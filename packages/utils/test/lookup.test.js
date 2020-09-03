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

const { Lookup } = require('../src');

const data = [
  { input: { a: 1, b: 2, c: 3 } },
  { input: { d: 2, e: 3, f: 4 } },
  { input: { a: 2, c: 4, e: 6 } },
];

describe('Lookup', () => {
  describe('constructor', () => {
    test('It should create a new instance', () => {
      const lookup = new Lookup();
      expect(lookup).toBeDefined();
    });
    test('Data can be provided', () => {
      const lookup = new Lookup(data);
      expect(lookup).toBeDefined();
      expect(lookup.items).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });
  });

  describe('Build from data', () => {
    test('Data can be provided', () => {
      const lookup = new Lookup();
      lookup.buildFromData(data, 'input');
      expect(lookup).toBeDefined();
      expect(lookup.items).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });
  });

  describe('Prepare', () => {
    test('It should return data and keys', () => {
      const lookup = new Lookup(data);
      const actual = lookup.prepare({ a: 7, b: 3, g: 1 });
      const expected = { keys: [0, 1], data: { 0: 7, 1: 3 } };
      expect(actual).toEqual(expected);
    });
  });

  describe('To vector', () => {
    test('It should return a vector representing the item', () => {
      const lookup = new Lookup(data);
      const actual = lookup.toVector({ a: 7, b: 3, g: 1 });
      const expected = new Float32Array([1, 1, 0, 0, 0, 0]);
      expect(actual).toEqual(expected);
    });
  });

  describe('To object', () => {
    test('It should return an object representing the item', () => {
      const lookup = new Lookup(data);
      const actual = lookup.toObj({ a: 7, b: 3, g: 1 });
      const expected = { 0: 1, 1: 1 };
      expect(actual).toEqual(expected);
    });
  });

  describe('Vector To object', () => {
    test('It should return an object representing the item', () => {
      const lookup = new Lookup(data);
      const actual = lookup.vectorToObj([0, 1, 2, 3, 4, 5]);
      const expected = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 };
      expect(actual).toEqual(expected);
    });
    test('An indexed object can be provided', () => {
      const lookup = new Lookup(data);
      const actual = lookup.vectorToObj({
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      });
      const expected = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 };
      expect(actual).toEqual(expected);
    });
  });
});
