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

const { Container } = require('@nlpjs/core');
const fs = require('./fs');
const { MemorydbAdapter } = require('../src');

describe('MemoryDB Adapter', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const adapter = new MemorydbAdapter();
      expect(adapter).toBeDefined();
    });
  });

  describe('Connect', () => {
    test('Should initialize the collections', async () => {
      const adapter = new MemorydbAdapter();
      adapter.collections = { something: 1 };
      await adapter.connect();
      expect(adapter.collections).toEqual({});
    });
  });

  describe('Disconnect', () => {
    test('Should initialize the collections', async () => {
      const adapter = new MemorydbAdapter();
      adapter.collections = { something: 1 };
      await adapter.disconnect();
      expect(adapter.collections).toEqual({});
    });
  });

  describe('Insert one', () => {
    test('It should create the collection', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      await adapter.insertOne('user', { name: 'user 1' });
      expect(adapter.collections.user).toBeDefined();
    });
    test('It should provides an id for the item', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const input = { name: 'user 1' };
      const expected = await adapter.insertOne('user', input);
      expect(expected.id).toBeDefined();
      const actual = await adapter.findById('user', expected.id);
      expect(actual).toBe(expected);
    });
  });

  describe('Insert many', () => {
    test('It should create the collection', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      await adapter.insertMany('user', [
        { name: 'user 1' },
        { name: 'user 2' },
      ]);
      expect(adapter.collections.user).toBeDefined();
    });
    test('It should return all items with ids', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const input = [{ name: 'user 1' }, { name: 'user 2' }];
      const actual = await adapter.insertMany('user', input);
      expect(actual.length).toEqual(2);
      expect(actual[0].name).toEqual(input[0].name);
      expect(actual[1].name).toEqual(input[1].name);
    });
  });

  describe('Save', () => {
    test('If the item does not haves id, then insert new', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const input = { name: 'user 1' };
      const actual = await adapter.save('user', input);
      expect(actual.id).toBeDefined();
    });
    test('If the item has id but is not in collection, then insert new', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const input = { id: 'patata', name: 'user 1' };
      const actual = await adapter.save('user', input);
      expect(actual.id).toBeDefined();
      expect(actual.id).toEqual(input.id);
    });
    test('If the item has id and alreay exists, then replace', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const input = { name: 'user 1' };
      const item = await adapter.save('user', input);
      item.age = 30;
      const actual = await adapter.save('user', item);
      expect(actual.id).toEqual(item.id);
      expect(actual.name).toEqual(item.name);
      expect(actual.age).toEqual(item.age);
    });
  });

  describe('Find', () => {
    test('I can get all items', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const actual = await adapter.find('items');
      expect(actual).toHaveLength(1000);
    });
    test('I can filter by condition', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const actual = await adapter.find('items', { mod: 3 });
      expect(actual).toHaveLength(100);
      expect(actual[0].num).toEqual(3);
      expect(actual[1].num).toEqual(13);
    });
    test('I can limit the amount of items to be found', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const actual = await adapter.find('items', { mod: 3 }, 3);
      expect(actual).toHaveLength(3);
      expect(actual[0].num).toEqual(3);
      expect(actual[1].num).toEqual(13);
      expect(actual[2].num).toEqual(23);
    });
    test('I can set an offset for items to be found', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const actual = await adapter.find('items', { mod: 3 }, 3, 10);
      expect(actual).toHaveLength(3);
      expect(actual[0].num).toEqual(103);
      expect(actual[1].num).toEqual(113);
      expect(actual[2].num).toEqual(123);
    });
  });

  describe('Find One', () => {
    test('It returns only the first element', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const actual = await adapter.findOne('items', { mod: 3 });
      expect(actual.num).toEqual(3);
    });
  });

  describe('Update', () => {
    test('It throws an exception if the id does not exists', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      await expect(adapter.update('items', { id: 'a' })).rejects.toThrow(
        'Trying to update collection items with a non existing item with id a'
      );
    });
  });

  describe('Remove', () => {
    test('It should remove items by condition', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const num = await adapter.remove('items', { mod: 3 });
      expect(num).toEqual(100);
      const actual = await adapter.find('items');
      expect(actual).toHaveLength(900);
      expect(actual[3].mod).toEqual(4);
    });
  });

  describe('Remove by id', () => {
    test('Should remove one item', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      const inserted = await adapter.insertMany('items', [
        { name: 'a' },
        { name: 'b' },
      ]);
      const result = await adapter.removeById('items', inserted[0].id);
      expect(result).toEqual(1);
      const actual = await adapter.find('items');
      expect(actual).toHaveLength(1);
      expect(actual[0].name).toEqual('b');
    });

    test('If the item does not exists, return 0', async () => {
      const adapter = new MemorydbAdapter();
      await adapter.connect();
      await adapter.insertMany('items', [{ name: 'a' }, { name: 'b' }]);
      const result = await adapter.removeById('items', 'notexists');
      expect(result).toEqual(0);
      const actual = await adapter.find('items');
      expect(actual).toHaveLength(2);
    });
  });

  describe('Autosave', () => {
    test('I can save and load collections', async () => {
      if (fs.existsSync('./items.json')) {
        fs.unlinkSync('./items.json');
      }
      const container = new Container();
      container.use(fs);
      const adapter = new MemorydbAdapter({ container, autosave: true });
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      const adapter2 = new MemorydbAdapter({ container, autosave: true });
      await adapter2.connect();
      const actual = await adapter2.find('items');
      expect(actual).toHaveLength(1000);
      expect(actual[0].num).toEqual(0);
      if (fs.existsSync('./items.json')) {
        fs.unlinkSync('./items.json');
      }
    });
  });

  describe('Save Collections', () => {
    test('I can manually save collections', async () => {
      if (fs.existsSync('./items.json')) {
        fs.unlinkSync('./items.json');
      }
      const container = new Container();
      container.use(fs);
      const adapter = new MemorydbAdapter({ container });
      await adapter.connect();
      const items = [];
      for (let i = 0; i < 1000; i += 1) {
        const item = { num: i, mod: i % 10 };
        items.push(item);
      }
      await adapter.insertMany('items', items);
      adapter.modifiedCollections.items = true;
      await adapter.saveCollections();
      const adapter2 = new MemorydbAdapter({ container, autosave: true });
      await adapter2.connect();
      const actual = await adapter2.find('items');
      expect(actual).toHaveLength(1000);
      expect(actual[0].num).toEqual(0);
      if (fs.existsSync('./items.json')) {
        fs.unlinkSync('./items.json');
      }
    });
  });
});
