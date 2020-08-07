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

const fs = require('fs');
const { MultiBertWordPieceTokenizer } = require('../src');

const fileNameEn = './packages/bert-tokenizer/dicts/vocab-en.txt';
const fileNameMulti = './packages/bert-tokenizer/dicts/vocab-multi.txt';

describe('Multi BERT word piece tokenizer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const multi = new MultiBertWordPieceTokenizer();
      expect(multi).toBeDefined();
    });
  });

  describe('Define tokenizers', () => {
    test('Can be defined as array of locales', () => {
      const multi = new MultiBertWordPieceTokenizer({ fs });
      multi.loadTokenizersFromFile(['en', 'aa'], fileNameEn);
      multi.loadTokenizersFromFile('*', fileNameMulti);
      const tokenizerEn = multi.getTokenizer('en');
      const tokenizerAa = multi.getTokenizer('aa');
      const tokenizerEs = multi.getTokenizer('es');
      expect(tokenizerEn).toBeDefined();
      expect(tokenizerEn).toBe(tokenizerAa);
      expect(tokenizerEs).toBeDefined();
      expect(tokenizerEs).not.toBe(tokenizerEn);
    });
  });
});
