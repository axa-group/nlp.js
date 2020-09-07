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

const { Normalizer } = require('@nlpjs/core');

class NormalizerBn extends Normalizer {
  constructor(container) {
    super(container);
    this.name = 'normalizer-bn';
  }

  normalize(text) {
    let result = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    result = result.replace('\u200D', '');
    result = result.replace('\u09CD', '');
    result = result.replace('\u09BC', '');
    result = result.replace('\u09DC', '\u09A1');
    result = result.replace('\u09DD', '\u09A2');
    result = result.replace('\u09DF', '\u09AF');
    result = result.replace('\u09C7\u09BE', '\u09CB');
    result = result.replace('\u09C7\u09D7', '\u09CC');
    result = result.replace('\u09C0', '\u09BF');
    result = result.replace('\u09C2', '\u09C1');
    return result.replace(/^[^\u0980-\u09FF]+|[^\u0980-\u09FF]+$/g, '');
  }

  run(srcInput) {
    const input = srcInput;
    input.text = this.normalize(input.text, input);
    return input;
  }
}

module.exports = NormalizerBn;
