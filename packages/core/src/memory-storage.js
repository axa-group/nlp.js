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

const { defaultContainer } = require('./container');
const Clonable = require('./clonable');

class MemoryStorage extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container || defaultContainer,
      },
      container
    );
    this.applySettings(this.settings, settings);
    this.applySettings(this.settings, { etag: 1, memory: {} });
    if (!this.settings.tag) {
      this.settings.tag = 'storage';
    }
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  read(keys) {
    return new Promise((resolve) => {
      const data = {};
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      keys.forEach((key) => {
        const item = this.settings.memory[key];
        if (item) {
          data[key] = JSON.parse(item);
        }
      });
      resolve(data);
    });
  }

  saveItem(key, item) {
    const clone = { ...item };
    clone.eTag = this.settings.etag.toString();
    this.settings.etag += 1;
    this.settings.memory[key] = JSON.stringify(clone);
    return clone;
  }

  write(changes) {
    return new Promise((resolve, reject) => {
      Object.keys(changes).forEach((key) => {
        const newItem = changes[key];
        const oldStr = this.settings.memory[key];
        if (!oldStr || newItem.eTag === '*') {
          return resolve(this.saveItem(key, newItem));
        }
        const oldItem = JSON.parse(oldStr);
        if (newItem.eTag !== oldItem.eTag) {
          return reject(
            new Error(`Error writing "${key}" due to eTag conflict.`)
          );
        }
        return resolve(this.saveItem(key, newItem));
      });
    });
  }

  delete(keys) {
    return new Promise((resolve) => {
      keys.forEach((key) => delete this.settings.memory[key]);
      resolve();
    });
  }
}

module.exports = MemoryStorage;
