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

const { NormalizerBert } = require('../src');

describe('Normalizer Bert', () => {
  describe('Constructor', () => {
    test('Constructor should be defined', () => {
      const container = {};
      const normalizer = new NormalizerBert(container);
      expect(normalizer).toBeDefined();
      expect(normalizer.container).toBe(container);
      expect(normalizer.name).toEqual('normalizer-bert');
    });
  });

  describe('Normalize', () => {
    test('Normalizer should pass to lower case', () => {
      const normalizer = new NormalizerBert();
      const input = 'This Is a NoRMaLiZeR';
      const expected = 'this is a normalizer';
      const actual = normalizer.normalize(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Run', () => {
    test('It should normalize text property', () => {
      const normalizer = new NormalizerBert();
      const input = { text: 'This Is a NoRMaLiZeR' };
      const expected = { text: 'this is a normalizer' };
      const actual = normalizer.run(input);
      expect(actual.text).toEqual(expected.text);
    });
  });
});
