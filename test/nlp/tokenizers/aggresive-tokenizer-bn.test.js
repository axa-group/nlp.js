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

const { AggressiveTokenizerBn } = require('../../../lib/nlp/tokenizers');

describe('Aggressive Tokenizer Bn', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const tokenizer = new AggressiveTokenizerBn();
      expect(tokenizer).toBeDefined();
    });
  });
  describe('Tokenize', () => {
    test('It must tokenize simple sentence', () => {
      const tokenizer = new AggressiveTokenizerBn();
      const expected = ['আমি', 'ভাত', 'খাই'];
      const actual = tokenizer.tokenize('আমি ভাত খাই');
      expect(actual).toEqual(expected);
    });
    test('It must tokenize sentences with punctuation', () => {
      const tokenizer = new AggressiveTokenizerBn();
      const expected = ['আমি', 'ভাত', 'খাই', 'তুমি', 'খাবেনা'];
      const actual = tokenizer.tokenize(`আমি ভাত খাই। তুমি খাবেনা?`);
      expect(actual).toEqual(expected);
    });
    test('It must tokenize big sentences', () => {
      const tokenizer = new AggressiveTokenizerBn();
      const expected = [
        'বাংলাদেশ',
        'দকষিণ',
        'এশিযার',
        'একটি',
        'রাষ্ট্র',
        'দেশটির',
        'উত্তর',
        'পুর্ব',
        'ও',
        'পশ্চিম',
        'সিমানায়',
        'ভারত',
        'ও',
        'দক্ষিণ',
        'পূর্ব',
        'সীমানায়',
        'মায়ানমার',
        'দক্ষিণে',
        'বঙ্গোপসাগর',
      ];
      const actual = tokenizer.tokenize(
        `বাংলাদেশ দক্ষিণ এশিয়ার একটি রাষ্ট্র। দেশটির উত্তর, পূর্ব ও পশ্চিম সীমানায় ভারত ও দক্ষিণ-পূর্ব সীমানায় মায়ানমার; দক্ষিণে বঙ্গোপসাগর। `
      );
      expect(actual).toEqual(expected);
    });
  });
});
