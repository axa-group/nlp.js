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

const reduceEdges = require('../src/reduce-edges');

describe('Reduce Edges', () => {
  describe('reduceEdges', () => {
    test('It should take the edge with best accuracy', () => {
      const edgeA = {
        accuracy: 0.8,
        start: 0,
        end: 10,
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 10,
      };
      const actual = reduceEdges([edgeA, edgeB]);
      expect(actual).toEqual([edgeB]);
    });
    test('If one edge is discarded then should not take it into account', () => {
      const edgeA = {
        accuracy: 0.8,
        start: 0,
        end: 10,
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        discarded: true,
      };
      const actual = reduceEdges([edgeA, edgeB]);
      expect(actual).toEqual([edgeA]);
    });
    test('It should take the edge with best accuracy even if the overlap is small', () => {
      const edgeA = {
        accuracy: 0.8,
        start: 0,
        end: 10,
      };
      const edgeB = {
        accuracy: 0.9,
        start: 10,
        end: 15,
      };
      const actual = reduceEdges([edgeA, edgeB]);
      expect(actual).toEqual([edgeB]);
    });
    test('It should take the edge with best accuracy even with different sorting', () => {
      const edgeA = {
        accuracy: 0.8,
        start: 0,
        end: 10,
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 10,
      };
      const actual = reduceEdges([edgeB, edgeA]);
      expect(actual).toEqual([edgeB]);
    });
    test('It should keep both if no overlap', () => {
      const edgeA = {
        accuracy: 0.8,
        start: 0,
        end: 10,
      };
      const edgeB = {
        accuracy: 0.9,
        start: 11,
        end: 20,
      };
      const actual = reduceEdges([edgeA, edgeB]);
      expect(actual).toEqual([edgeA, edgeB]);
    });
    test('It should keep both if they have same priority', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        entity: 'entity',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 5,
        end: 16,
        len: 11,
        entity: 'entity',
      };
      const actual = reduceEdges([edgeA, edgeB]);
      expect(actual).toEqual([edgeA, edgeB]);
    });
    test('It should keep both if they have same priority if useMaxLength is false', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        entity: 'entity',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 5,
        end: 16,
        len: 11,
        entity: 'entity',
      };
      const actual = reduceEdges([edgeA, edgeB], false);
      expect(actual).toEqual([edgeA, edgeB]);
    });
    test('It should keep both if one is a number and useMaxLength is false', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        entity: 'entity',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 5,
        end: 16,
        len: 11,
        entity: 'number',
      };
      const actual = reduceEdges([edgeA, edgeB], false);
      expect(actual).toEqual([edgeA, edgeB]);
    });
    test('It should detect if is the same enum option entity to discard one', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        type: 'enum',
        entity: 'entity',
        option: 'op1',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        type: 'enum',
        entity: 'entity',
        option: 'op1',
      };
      const actual = reduceEdges([edgeA, edgeB], false);
      expect(actual).toEqual([edgeB]);
    });
    test('It should choose the largest one', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        type: 'enum',
        entity: 'entity',
        option: 'op1',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 9,
        len: 10,
        type: 'enum',
        entity: 'entity',
        option: 'op1',
      };
      const actual = reduceEdges([edgeA, edgeB], false);
      expect(actual).toEqual([edgeA]);
    });
    test('If both are enums and one is substring of the other, discard the smaller', () => {
      const edgeA = {
        accuracy: 0.9,
        start: 0,
        end: 10,
        len: 11,
        type: 'enum',
        entity: 'entity1',
        option: 'op1',
        utteranceText: 'abcdefghijk',
      };
      const edgeB = {
        accuracy: 0.9,
        start: 0,
        end: 9,
        len: 10,
        type: 'enum',
        entity: 'entity2',
        option: 'op2',
        utteranceText: 'abcdefghij',
      };
      const actual = reduceEdges([edgeA, edgeB], false);
      expect(actual).toEqual([edgeA]);
    });
  });
});
