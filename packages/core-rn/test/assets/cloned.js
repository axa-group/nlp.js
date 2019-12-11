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

const { Clonable } = require('../../src');

class Cloned extends Clonable {
  constructor(settings) {
    super(settings);
    this.nick = 'nick';
    this.jsonExport = {
      keys: false,
      values: this.exportValues,
      surname: 'familyname',
      nick: {},
    };
    this.jsonImport = {
      keys: false,
      values: this.importValues,
      familyname: 'surname',
      nick: {},
    };
  }

  exportValues(target, source, key, value) {
    return this.objToValues(value, this.keys);
  }

  importValues(target, source, key, value) {
    return this.valuesToObj(value, this.keys);
  }

  writeValues(target, source, key, value) {
    const tgt = target;
    tgt.values = this.objToValues(value, this.keys);
  }

  readValues(target, source, key, value) {
    const tgt = target;
    tgt.values = this.valuesToObj(value, this.keys);
  }
}

module.exports = Cloned;
