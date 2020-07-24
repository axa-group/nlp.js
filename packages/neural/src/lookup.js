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

class Lookup {
  constructor(data, propName = 'input') {
    this.dict = {};
    this.items = [];
    if (data) {
      this.buildFromData(data, propName);
    }
  }

  add(key) {
    if (this.dict[key] === undefined) {
      this.dict[key] = this.items.length;
      this.items.push(key);
    }
  }

  buildFromData(data, propName) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i][propName];
      const keys = Object.keys(item);
      for (let j = 0; j < keys.length; j += 1) {
        this.add(keys[j]);
      }
    }
  }

  prepare(item) {
    const keys = Object.keys(item);
    const resultKeys = [];
    const resultData = {};
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (this.dict[key] !== undefined) {
        resultKeys.push(this.dict[key]);
        resultData[this.dict[key]] = item[key];
      }
    }
    return {
      keys: resultKeys,
      data: resultData,
    };
  }
}

module.exports = Lookup;
