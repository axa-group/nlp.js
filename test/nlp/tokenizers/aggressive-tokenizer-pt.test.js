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

const { AggressiveTokenizerPt } = require('../../../lib/nlp/tokenizers');

describe('Aggressive Tokenizer Pt', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const tokenizer = new AggressiveTokenizerPt();
      expect(tokenizer).toBeDefined();
    });
  });
  describe('Tokenize', () => {
    test('It must tokenize simple sentence', () => {
      const tokenizer = new AggressiveTokenizerPt();
      const expected = [
        'Quando',
        'a',
        'noite',
        'chega',
        'e',
        'a',
        'terra',
        'está',
        'escura',
      ];
      const actual = tokenizer.tokenize(
        'Quando a noite chega e a terra está escura',
        false
      );
      expect(actual).toEqual(expected);
    });
    test('It must tokenize and normalize', () => {
      const tokenizer = new AggressiveTokenizerPt();
      const expected = [
        'Quando',
        'a',
        'noite',
        'chega',
        'e',
        'a',
        'terra',
        'esta',
        'escura',
      ];
      const actual = tokenizer.tokenize(
        'Quando a noite chega e a terra está escura',
        true
      );
      expect(actual).toEqual(expected);
    });
  });
});
