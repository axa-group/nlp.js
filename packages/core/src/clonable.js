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

class Clonable {
  /**
   * Constructor of the class
   * @param {object} settings
   */
  constructor(settings = {}, container = defaultContainer) {
    this.container = settings.container || container;
    this.applySettings(this, settings);
  }

  get logger() {
    return this.container.get('logger');
  }

  /**
   * Apply default settings to an object.
   * @param {object} obj Target object.
   * @param {object} settings Input settings.
   */
  applySettings(srcobj, settings = {}) {
    const obj = srcobj || {};
    Object.keys(settings).forEach((key) => {
      if (obj[key] === undefined) {
        obj[key] = settings[key];
      }
    });
    return obj;
  }

  toJSON() {
    const settings = this.jsonExport || {};
    const result = {};
    const keys = Object.keys(this);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (
        key !== 'jsonExport' &&
        key !== 'jsonImport' &&
        key !== 'container' &&
        !key.startsWith('pipeline')
      ) {
        const fn = settings[key] === undefined ? true : settings[key];
        if (typeof fn === 'function') {
          const value = fn.bind(this)(result, this, key, this[key]);
          if (value) {
            result[key] = value;
          }
        } else if (typeof fn === 'boolean') {
          if (fn) {
            result[key] = this[key];
            if (key === 'settings') {
              delete result[key].container;
            }
          }
        } else if (typeof fn === 'string') {
          result[fn] = this[key];
        }
      }
    }
    return result;
  }

  fromJSON(json) {
    const settings = this.jsonImport || {};
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const fn = settings[key] === undefined ? true : settings[key];
      if (typeof fn === 'function') {
        const value = fn.bind(this)(this, json, key, json[key]);
        if (value) {
          this[key] = value;
        }
      } else if (typeof fn === 'boolean') {
        if (fn) {
          this[key] = json[key];
        }
      } else if (typeof fn === 'string') {
        this[fn] = json[key];
      }
    }
  }

  objToValues(obj, srcKeys) {
    const keys = srcKeys || Object.keys(obj);
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      result.push(obj[keys[i]]);
    }
    return result;
  }

  valuesToObj(values, keys) {
    const result = {};
    for (let i = 0; i < values.length; i += 1) {
      result[keys[i]] = values[i];
    }
    return result;
  }

  getPipeline(tag) {
    return this.container.getPipeline(tag);
  }

  async runPipeline(input, pipeline) {
    return this.container.runPipeline(pipeline || this.pipeline, input, this);
  }

  use(item) {
    this.container.use(item);
  }
}

module.exports = Clonable;
