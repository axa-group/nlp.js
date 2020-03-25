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

class Dictionary {
  getElement(line) {
    if (!line) {
      return {
        traditional: '',
        simplified: '',
      };
    }
    if (this.cache[line]) {
      return this.cache[line];
    }
    const tokens = line.split(' ');
    const element = {
      traditional: tokens[0],
      simplified: tokens[1],
      pinyin: line.substring(line.indexOf('[') + 1, line.indexOf(']')),
      definition: line.substring(line.indexOf('/') + 1, line.lastIndexOf('/')),
    };
    this.cache[line] = element;
    return element;
  }

  start() {
    if (!this.cedict) {
      // eslint-disable-next-line global-require
      this.cedict = require('./cedict_ts.u8');
      console.log('Compiling dictionary');
      this.cache = {};
      this.simplified = {};
      this.traditional = {};
      const lines = this.cedict.split(/\r?\n/);
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (!line.startsWith('#')) {
          const current = this.getElement(line);
          const definitions = [current];
          let nextDefinition = this.getElement(lines[i + 1]);
          while (
            nextDefinition.traditional === current.traditional &&
            nextDefinition.simplified === current.simplified
          ) {
            i += 1;
            definitions.push(nextDefinition);
            nextDefinition = this.getElement(lines[i + 1]);
          }
          if (!this.simplified[current.simplified]) {
            this.simplified[current.simplified] = [];
          }
          for (let j = 0; j < definitions.length; j += 1) {
            this.simplified[current.simplified].push(definitions[j]);
          }
          if (!this.traditional[current.traditional]) {
            this.traditional[current.traditional] = [];
          }
          for (let j = 0; j < definitions.length; j += 1) {
            this.traditional[current.traditional].push(definitions[j]);
          }
        }
      }
      this.cache = undefined;
    }
  }

  search(word) {
    this.start();
    return this.simplified[word] || this.traditional[word];
  }

  getPinyin(char) {
    const definitions = this.search(char);
    return definitions ? definitions.map((x) => x.pinyin) : char;
  }

  getLongestMatch(text) {
    const max = Math.min(8, text.length);
    for (let i = max; i >= 0; i -= 1) {
      const slice = text.substr(0, i);
      if (this.search(slice)) {
        return slice;
      }
    }
    return undefined;
  }

  segment(text) {
    const result = [];
    while (text) {
      const seg = this.getLongestMatch(text) || text.substr(0, 1);
      result.push(seg);
      text = text.slice(seg.length);
    }
    return result;
  }
}

const instance = new Dictionary();
module.exports = instance;
