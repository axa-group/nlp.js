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

const { Clonable, uuid } = require('@nlpjs/core');
const path = require('path');

class MemorydbAdapter extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'memorydb-adapter';
    }
    this.collections = {};
    this.modifiedCollections = {};
    if (this.settings.autosave === undefined) {
      this.settings.autosave = false;
    }
    if (this.settings.autosaveInterval === undefined) {
      this.settings.autosaveInterval = 0;
    }
    if (this.settings.autosaveFolder === undefined) {
      this.settings.autosaveFolder = './';
    }
  }

  connect() {
    this.collections = {};
  }

  disconnect() {
    this.collections = {};
  }

  async saveCollection(name) {
    const collection = this.collections[name];
    if (collection) {
      const fileName = path.join(this.settings.autosaveFolder, `${name}.json`);
      const fs = this.container.get('fs');
      return fs.writeFile(fileName, JSON.stringify(collection));
    }
    throw new Error(`Collection ${name} not found`);
  }

  async loadCollection(name) {
    const fileName = path.join(this.settings.autosaveFolder, `${name}.json`);
    const fs = this.container.get('fs');
    const str = await fs.readFile(fileName);
    return JSON.parse(str);
  }

  existsCollectionFile(name) {
    const fileName = path.join(this.settings.autosaveFolder, `${name}.json`);
    const fs = this.container.get('fs');
    return fs.existsSync(fileName);
  }

  saveCollections() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const keys = Object.keys(this.modifiedCollections);
    const promises = [];
    for (let i = 0; i < keys.length; i += 1) {
      promises.push(this.saveCollection(keys[i]));
      delete this.modifiedCollections[keys[i]];
    }
    return Promise.all(promises);
  }

  async markToSave(name) {
    if (!this.settings.autosave) {
      return false;
    }
    if (this.settings.autosaveInterval === 0) {
      return this.saveCollection(name);
    }
    this.modifiedCollections[name] = true;
    if (!this.timer) {
      this.timer = setInterval(
        this.saveCollections.bind(this),
        this.settings.autosaveInterval * 1000
      );
    }
    return true;
  }

  async getCollection(name, autoCreate = true) {
    if (!this.collections[name] && autoCreate) {
      if (this.settings.autosave && this.existsCollectionFile(name)) {
        this.collections[name] = await this.loadCollection(name);
      } else {
        this.collections[name] = {};
      }
    }
    return this.collections[name];
  }

  // Assumes a list of eq conditions
  static match(item, condition, conditionKeys) {
    for (let i = 0; i < conditionKeys.length; i += 1) {
      const key = conditionKeys[i];
      if (item[key] !== condition[key]) {
        return false;
      }
    }
    return true;
  }

  async find(name, condition, limit, offset) {
    const collection = await this.getCollection(name);
    const keys = Object.keys(collection);
    const conditionKeys = Object.keys(condition || {});
    let pendingOffset = offset || 0;
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      const item = collection[keys[i]];
      if (
        conditionKeys === 0 ||
        MemorydbAdapter.match(item, condition || {}, conditionKeys)
      ) {
        if (pendingOffset > 0) {
          pendingOffset -= 1;
        } else {
          result.push(item);
          if (limit && result.length >= limit) {
            return result;
          }
        }
      }
    }
    return result;
  }

  async findOne(name, condition = {}) {
    const items = await this.find(name, condition, 1);
    return items[0];
  }

  async findById(name, id) {
    const collection = await this.getCollection(name);
    return collection[id];
  }

  async insertOne(name, item) {
    const id = uuid();
    const cloned = { id, ...item };
    const collection = await this.getCollection(name);
    collection[id] = cloned;
    await this.markToSave(name);
    return cloned;
  }

  async insertMany(name, items) {
    const result = [];
    const collection = await this.getCollection(name);
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const id = uuid();
      const cloned = { id, ...item };
      collection[id] = cloned;
      result.push(cloned);
    }
    if (result.length > 0) {
      await this.markToSave(name);
    }
    return result;
  }

  async save(name, item) {
    if (item.id) {
      const oldItem = await this.findById(name, item.id);
      if (oldItem) {
        return this.update(name, item);
      }
    }
    return this.insertOne(name, item);
  }

  async update(name, item) {
    const { id } = item;
    const collection = await this.getCollection(name);
    if (!collection[id]) {
      throw new Error(
        `Trying to update collection ${name} with a non existing item with id ${id}`
      );
    }
    collection[id] = item;
    await this.markToSave(name);
    return item;
  }

  async remove(name, condition = {}) {
    const collection = await this.getCollection(name);
    const collectionKeys = Object.keys(collection);
    const conditionKeys = Object.keys(condition);
    let result = 0;
    for (let i = 0; i < collectionKeys.length; i += 1) {
      const key = collectionKeys[i];
      if (
        conditionKeys.length === 0 ||
        MemorydbAdapter.match(collection[key], condition, conditionKeys)
      ) {
        delete collection[key];
        result += 1;
      }
    }
    if (result > 0) {
      await this.markToSave(name);
    }
    return result;
  }

  async removeById(name, id) {
    const collection = await this.getCollection(name);
    if (!collection[id]) {
      return 0;
    }
    delete collection[id];
    await this.markToSave(name);
    return 1;
  }
}

module.exports = MemorydbAdapter;
