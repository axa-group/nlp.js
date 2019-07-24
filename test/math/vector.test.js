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

const { Vector } = require('../../lib');

describe('Vector', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const vector = new Vector();
      expect(vector).toBeDefined();
    });
    test('Should clone the input by default', () => {
      const input = [1, 2, 3];
      const vector = new Vector(input);
      expect(vector.elements).toEqual(input);
      expect(vector.elements).not.toBe(input);
    });
    test('Input can be a vector', () => {
      const input = new Vector([1, 2, 3]);
      const vector = new Vector(input);
      expect(vector.elements).toEqual(input.elements);
      expect(vector.elements).not.toBe(input.elements);
    });
    test('Developer can decide to use input by reference', () => {
      const input = [1, 2, 3];
      const vector = new Vector(input, false);
      expect(vector.elements).toEqual(input);
      expect(vector.elements).toBe(input);
    });
    test('Input can be a vector also by reference', () => {
      const input = new Vector([1, 2, 3]);
      const vector = new Vector(input, false);
      expect(vector.elements).toEqual(input.elements);
      expect(vector.elements).toBe(input.elements);
    });
  });

  describe('Create Array', () => {
    test('It create an empty array if the length is 0', () => {
      const result = Vector.createArray(0, 3);
      expect(result).toEqual([]);
    });
    test('It should create an array of the given length and value', () => {
      const result = Vector.createArray(12, 3);
      expect(result).toEqual([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    });
  });

  describe('One', () => {
    test('It should create a Vector of the given length filled with 1', () => {
      const result = Vector.one(12);
      expect(result.elements).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
  });

  describe('Zero', () => {
    test('It should create a Vector of the given length filled with 0', () => {
      const result = Vector.zero(12);
      expect(result.elements).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('For Each', () => {
    test('It should iterate every single element in order', () => {
      const result = Vector.one(12);
      const visited = [];
      result.forEach((element, i) => {
        visited.push(i);
      });
      expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });
    test('It should give every vector cell value in order', () => {
      const result = new Vector([2, 3, 5, 7, 11, 17]);
      let sum = 0;
      result.forEach(element => {
        sum += element;
      });
      expect(sum).toEqual(45);
    });
  });

  describe('Map', () => {
    test('It should return a new vector different from the original one', () => {
      const input = new Vector([2, 3, 5, 7, 11, 17]);
      const result = input.map((element, i) => element * i);
      expect(result).toBeDefined();
      expect(result).not.toBe(input);
    });
    test('It should return a new vector where every elemnt is the operation result', () => {
      const input = new Vector([2, 3, 5, 7, 11, 17]);
      const result = input.map((element, i) => element * i);
      expect(result.elements).toEqual([0, 3, 10, 21, 44, 85]);
    });
  });

  describe('Run Operation', () => {
    test('It should be able to operate the vector with a scalar', () => {
      const input = new Vector([2, 3, 5, 7, 11, 17]);
      const operand = 2;
      const result = input.runOperation(
        operand,
        (a, b, index) => a * b * index
      );
      expect(result.elements).toEqual([0, 6, 20, 42, 88, 170]);
    });
    test('It should be able to operate the vector with another vector', () => {
      const input = new Vector([2, 3, 5, 7, 11, 17]);
      const operand = [1, -1, 2, -2, 3, -3];
      const result = input.runOperation(operand, (a, b) => a * b);
      expect(result.elements).toEqual([2, -3, 10, -14, 33, -51]);
    });
    test('It should throw an error if the vectors does not have same length', () => {
      const input = new Vector([2, 3, 5, 7, 11, 17]);
      const operand = [1, -1, 2, -2, 3, -3, 4];
      expect(() => {
        input.runOperation(operand, (a, b) => a * b);
      }).toThrowError('Cannot operate two vectors with different dimensions.');
    });
  });

  describe('Log', () => {
    test('It should return a vector with natural logarithm', () => {
      const input = new Vector([2, 4, 8, 16]);
      const result = input.log();
      expect(result.elements).toEqual([
        0.6931471805599453,
        1.3862943611198906,
        2.0794415416798357,
        2.772588722239781,
      ]);
    });
  });

  describe('Subtract', () => {
    test('It should return a vector result of the subtraction', () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([4, 3, 2, 1]);
      const result = input.subtract(other);
      expect(result.elements).toEqual([-2, 1, 6, 15]);
    });

    test('It can substract an scalar from a vector', () => {
      const input = new Vector([2, 4, 8, 16]);
      const result = input.subtract(2);
      expect(result.elements).toEqual([0, 2, 6, 14]);
    });

    test("Should raise an exception if the dimensions don't match", () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([4, 3, 2]);
      expect(() => {
        input.subtract(other);
      }).toThrowError('Cannot operate two vectors with different dimensions.');
    });
  });

  describe('Sum', () => {
    test('It should sum all the elements', () => {
      const input = new Vector([2, 4, 8, 16]);
      const result = input.sum();
      expect(result).toEqual(30);
    });
  });

  describe('Element multiply', () => {
    test('It should return a vector with multiplication', () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([16, 8, 4, 2]);
      const result = input.elementMultiply(other);
      expect(result.elements).toEqual([32, 32, 32, 32]);
    });
  });

  describe('Augment', () => {
    test('It should return a vector with two vectors concated', () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([1, 2, 3, 4]);
      const result = input.augment(other);
      expect(result.elements).toEqual([2, 4, 8, 16, 1, 2, 3, 4]);
    });
  });

  describe('Dot product', () => {
    test('It should return an scalar with the dot product of two vectors', () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([1, 2, 3, 4]);
      const result = input.dot(other);
      expect(result).toEqual(98);
    });
    test('It should throw an error if the vectors have not the same dimension', () => {
      const input = new Vector([2, 4, 8, 16]);
      const other = new Vector([1, 2, 3, 4, 5]);
      expect(() => {
        input.dot(other);
      }).toThrowError('Cannot operate two vectors with different dimensions.');
    });
  });

  describe('Chomp', () => {
    test('It should return new vector that is a subvector from element n', () => {
      const input = new Vector([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const result = input.chomp(3);
      expect(result.elements).toEqual([3, 4, 5, 6, 7, 8, 9]);
    });
  });
});
