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

const { TokenizerPt } = require('../src');

const tokenizer = new TokenizerPt();

describe('Tokenizer', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const instance = new TokenizerPt();
      expect(instance).toBeDefined();
    });
  });

  describe('Tokenize', () => {
    test('Should tokenize "disse-me DISSE-ME covid-19 COVID-19 covid19"', () => {
      const input = 'disse-me DISSE-ME covid-19 COVID-19 covid19';
      const expected = [
        'disse',
        'me',
        'DISSE',
        'ME',
        'covid-19',
        'COVID-19',
        'covid19',
      ];
      const actual = tokenizer.tokenize(input);
      expect(actual).toEqual(expected);
    });
  });
});
