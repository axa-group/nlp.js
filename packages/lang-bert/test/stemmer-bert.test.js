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

const { StemmerBert } = require('../src');

describe('Stemmer Bert', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const container = {};
      const stemmer = new StemmerBert(container);
      expect(stemmer).toBeDefined();
      expect(stemmer.container).toBe(container);
      expect(stemmer.name).toEqual('stemmer-bert');
      expect(stemmer.removeAffixes).toBeFalsy();
    });
  });

  describe('Stem', () => {
    test('It should return the tokens', () => {
      const stemmer = new StemmerBert();
      const input = ['this', 'should', 'be', 'token', '##ized'];
      const actual = stemmer.stem(input);
      expect(actual).toEqual(input);
    });

    test('It can remove affixes', () => {
      const stemmer = new StemmerBert();
      stemmer.removeAffixes = true;
      const input = ['this', 'should', 'be', 'token', '##ized'];
      const expected = ['this', 'should', 'be', 'token'];
      const actual = stemmer.stem(input);
      expect(actual).toEqual(expected);
    });
  });
});
