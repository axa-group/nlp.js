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

const {
  cartesian,
  splitPattern,
  composeFromPattern,
  composeCorpus,
} = require('../src');
const corpusPattern = require('./corpus-pattern.json');
const corpusComposed = require('./corpus-composed.json');

describe('Pattern', () => {
  describe('cartesian', () => {
    it('Should calculate cartesian product of terms of an array', () => {
      const input = [[1, 2], [3, 4, 5], [6], [7, 8]];
      const actual = cartesian(input);
      const expected = [
        [1, 3, 6, 7],
        [1, 3, 6, 8],
        [1, 4, 6, 7],
        [1, 4, 6, 8],
        [1, 5, 6, 7],
        [1, 5, 6, 8],
        [2, 3, 6, 7],
        [2, 3, 6, 8],
        [2, 4, 6, 7],
        [2, 4, 6, 8],
        [2, 5, 6, 7],
        [2, 5, 6, 8],
      ];
      expect(actual).toEqual(expected);
    });
  });
  describe('splitPattern', () => {
    it('should generate array of options for cartesian product', () => {
      const input =
        'I [am having|have] a [problem|question] that I have to [solve|investigate]';
      const actual = splitPattern(input);
      const expected = [
        ['I '],
        ['am having', 'have'],
        [' a '],
        ['problem', 'question'],
        [' that I have to '],
        ['solve', 'investigate'],
      ];
      expect(actual).toEqual(expected);
    });
  });
  describe('composeFromPattern', () => {
    it('Should generate all the strings from a pattern', () => {
      const input =
        'I [am having|have] a [problem|question] that I have to [solve|investigate]';
      const actual = composeFromPattern(input);
      const expected = [
        'I am having a problem that I have to solve',
        'I am having a problem that I have to investigate',
        'I am having a question that I have to solve',
        'I am having a question that I have to investigate',
        'I have a problem that I have to solve',
        'I have a problem that I have to investigate',
        'I have a question that I have to solve',
        'I have a question that I have to investigate',
      ];
      expect(actual).toEqual(expected);
    });
  });

  describe('composeCorpus', () => {
    it('Should compose a corpus that contains patterns', () => {
      const actual = composeCorpus(corpusPattern);
      expect(actual).toEqual(corpusComposed);
    });
  });
});
