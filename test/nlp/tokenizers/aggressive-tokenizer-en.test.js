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

const { AggressiveTokenizerEn } = require('../../../lib/nlp/tokenizers');

describe('Aggressive Tokenizer En', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const tokenizer = new AggressiveTokenizerEn();
      expect(tokenizer).toBeDefined();
    });
  });
  describe('Tokenize', () => {
    test('It must tokenize simple sentence', () => {
      const tokenizer = new AggressiveTokenizerEn();
      const expected = ['This', 'sentence', 'should', 'be', 'tokenized'];
      const actual = tokenizer.tokenize('This sentence should be tokenized');
      expect(actual).toEqual(expected);
    });
    test('It must replace contractions', () => {
      const tokenizer = new AggressiveTokenizerEn();
      const expected = ['I', 'am', 'you', 'are', 'is', 'not'];
      const actual = tokenizer.tokenize(`I'm you're isn't`);
      expect(actual).toEqual(expected);
    });
    test('It must replace slang contractions', () => {
      const tokenizer = new AggressiveTokenizerEn();
      const expected = ['I', 'am', 'can', 'not', 'going', 'to', 'want', 'to'];
      const actual = tokenizer.tokenize(`I'm cannot gonna wanna`);
      expect(actual).toEqual(expected);
    });
  });
});
