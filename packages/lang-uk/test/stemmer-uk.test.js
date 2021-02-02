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

const StemmerUk = require('../src/stemmer-uk');

const stemmer = new StemmerUk();

describe('Stemmer Ukranian', () => {
  describe('It should stem', () => {
    test('розмовляючи', () => {
      const actual = stemmer.stemWord('розмовляючи');
      const expected = 'розмовляюч';
      expect(actual).toEqual(expected);
    });
    test('говорити', () => {
      const actual = stemmer.stemWord('говорити');
      const expected = 'говор';
      expect(actual).toEqual(expected);
    });
    test('парковка', () => {
      const actual = stemmer.stemWord('парковка');
      const expected = 'парковк';
      expect(actual).toEqual(expected);
    });
    test('експеримент', () => {
      const actual = stemmer.stemWord('експеримент');
      const expected = 'експеримент';
      expect(actual).toEqual(expected);
    });
    test('зустрічі', () => {
      const actual = stemmer.stemWord('зустрічі');
      const expected = 'зустріч';
      expect(actual).toEqual(expected);
    });
    test('потурбувавши', () => {
      const actual = stemmer.stemWord('потурбувавши');
      const expected = 'потурбува';
      expect(actual).toEqual(expected);
    });
  });
});
