/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const Database = require('../src/database');

describe('Collection', () => {
  describe('Insert many', () => {
    test('It should insert many object', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await collection.insertMany(items);
      const actual = await collection.find();
      expect(actual).toHaveLength(1000);
    });
  });

  describe('Find one', () => {
    test('It should return first item with condition', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await collection.insertMany(items);
      const actual = await collection.findOne({ mod: 3 });
      await database.disconnect();
      expect(actual).toBeDefined();
      expect(actual.num).toEqual(3);
    });
  });

  describe('Find by id', () => {
    test('it should find one item if exists', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      const inserted = await collection.insertMany(items);
      const actual = await collection.findById(inserted[3].id);
      await database.disconnect();
      expect(actual).toBeDefined();
      expect(actual.num).toEqual(3);
    });
  });

  describe('Insert one', () => {
    test('It should calculate id for the item', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const inserted = await collection.insertOne({ num: 7 });
      expect(inserted).toBeDefined();
      expect(inserted.id).toBeDefined();
      expect(inserted.num).toEqual(7);
    });
  });

  describe('Save', () => {
    test('It should insert an item it does not exists', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const inserted = await collection.save({ num: 7 });
      expect(inserted).toBeDefined();
      expect(inserted.id).toBeDefined();
      expect(inserted.num).toEqual(7);
    });
  });

  describe('Update', () => {
    test('It should update an item', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const inserted = await collection.insertOne({ num: 7 });
      const newItem = {
        id: inserted.id,
        num: 8,
      };
      const actual = await collection.update(newItem);
      expect(actual.id).toEqual(inserted.id);
      expect(actual.num).toEqual(8);
    });
  });

  describe('Remove', () => {
    test('it should remove items', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await collection.insertMany(items);
      const result = await collection.remove({ mod: 3 });
      const actual = await collection.find();
      await database.disconnect();
      expect(result).toEqual(100);
      expect(actual).toHaveLength(900);
    });
  });

  describe('Remove by id', () => {
    test('it should remove item by id', async () => {
      const database = new Database();
      await database.connect();
      const collection = database.getCollection('items');
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      const allItems = await collection.insertMany(items);
      const result = await collection.removeById(allItems[3].id);
      const actual = await collection.find();
      await database.disconnect();
      expect(result).toEqual(1);
      expect(actual).toHaveLength(999);
    });
  });
});
