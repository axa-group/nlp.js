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

const { Clonable } = require('@nlpjs/core');
const Collection = require('./collection');
const MemorydbAdapter = require('./memory-adapter');

class Database extends Clonable {
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
      this.settings.tag = `database`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.adapters = {};
    this.collectionAdapters = {};
    this.collections = {};
    this.registerAdapter(
      'memory',
      new MemorydbAdapter(this.settings.memory, this.container)
    );
    this.defaultAdapter = 'memory';
  }

  registerDefault() {
    this.container.registerConfiguration(
      'database',
      {
        defaultAdapter: 'memory',
        memory: {
          autosave: false,
          autosaveInterval: 0,
          autosaveFolder: './',
        },
      },
      false
    );
  }

  registerAdapter(name, adapter) {
    this.adapters[name] = adapter;
  }

  registerCollection(name, adapterName) {
    this.collectionAdapters[name] = adapterName || 'default';
    this.collections[name] = new Collection(this, name);
  }

  connect() {
    const promises = [];
    const keys = Object.keys(this.adapters);
    for (let i = 0; i < keys.length; i += 1) {
      const promise = this.adapters[keys[i]].connect();
      if (promise && promise.then) {
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  }

  disconnect() {
    const promises = [];
    const keys = Object.keys(this.adapters);
    for (let i = 0; i < keys.length; i += 1) {
      const promise = this.adapters[keys[i]].disconnect();
      if (promise && promise.then) {
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  }

  getAdapter(name) {
    let adapterName = this.collectionAdapters[name];
    if (!adapterName) {
      this.registerCollection(name, 'default');
    }
    if (!adapterName || adapterName === 'default') {
      adapterName = this.defaultAdapter;
    }
    return this.adapters[adapterName];
  }

  getCollection(name) {
    if (!this.collections[name]) {
      this.registerCollection(name);
    }
    return this.collections[name];
  }

  find(name, condition, limit) {
    return this.getAdapter(name).find(name, condition, limit);
  }

  findOne(name, condition) {
    return this.getAdapter(name).findOne(name, condition);
  }

  findById(name, id) {
    return this.getAdapter(name).findById(name, id);
  }

  insertOne(name, item) {
    return this.getAdapter(name).insertOne(name, item);
  }

  insertMany(name, items) {
    return this.getAdapter(name).insertMany(name, items);
  }

  update(name, item) {
    return this.getAdapter(name).update(name, item);
  }

  save(name, item) {
    return this.getAdapter(name).save(name, item);
  }

  remove(name, condition, limit) {
    return this.getAdapter(name).remove(name, condition, limit);
  }

  removeById(name, id) {
    return this.getAdapter(name).removeById(name, id);
  }
}

module.exports = Database;
