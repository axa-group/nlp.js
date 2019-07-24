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

const { Matrix, Vector } = require('../../lib');

describe('Matrix', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const matrix = new Matrix();
      expect(matrix).toBeDefined();
    });
    test('Should clone the input by default', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input);
      expect(matrix.elements).toEqual(input);
      expect(matrix.elements).not.toBe(input);
    });
    test('Input can be another matrix', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input);
      expect(matrix.elements).toEqual(input.elements);
      expect(matrix.elements).not.toBe(input.elements);
    });
    test('Developer can decide to use input by reference', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      expect(matrix.elements).toEqual(input);
      expect(matrix.elements).toBe(input);
    });
    test('Input can be a matrix also by reference', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      expect(matrix.elements).toEqual(input.elements);
      expect(matrix.elements).toBe(input.elements);
    });
    test('If the input is not multidimensional, create multidimension 1xn', () => {
      const input = [1, 2, 3, 4];
      const matrix = new Matrix(input);
      expect(matrix.elements).toEqual([[1], [2], [3], [4]]);
    });
  });

  describe('Set Elements', () => {
    test('We can set the matrix to an input', () => {
      const matrix = new Matrix();
      const input = [1, 2, 3, 4];
      matrix.setElements(input);
      expect(matrix.elements).toEqual([[1], [2], [3], [4]]);
    });

    test('We can provide an empty input', () => {
      const matrix = new Matrix();
      const input = [];
      matrix.setElements(input);
      expect(matrix.elements).toBeUndefined();
    });
  });

  describe('Get row', () => {
    test('It should return a Vector representing the row', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      const row = matrix.row(1);
      expect(row).toBeInstanceOf(Vector);
      expect(row.elements).toEqual([3, 4]);
    });
    test('It should return undefined if the row does not exists', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      const row = matrix.row(2);
      expect(row).toBeUndefined();
    });
  });

  describe('Get column', () => {
    test('It should return a Vector representing the column', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      const column = matrix.column(1);
      expect(column).toBeInstanceOf(Vector);
      expect(column.elements).toEqual([2, 4]);
    });
    test('It should return undefined if the column does not exists', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      const column = matrix.column(2);
      expect(column).toBeUndefined();
    });
  });

  describe('Get row count', () => {
    test('It should return the row count', () => {
      const input = new Matrix([[1, 2], [3, 4]]);
      const matrix = new Matrix(input, false);
      const rows = matrix.rowCount();
      expect(rows).toEqual(2);
    });
  });

  describe('Fill', () => {
    test('It should create a new Matrix with the dimensions and cell value specified', () => {
      const matrix = Matrix.fill(2, 3, 4);
      expect(matrix).toBeInstanceOf(Matrix);
      expect(matrix.elements).toEqual([[4, 4, 4], [4, 4, 4]]);
    });
  });

  describe('One', () => {
    test('It should create a new Matrix with the dimensions and cell value 1', () => {
      const matrix = Matrix.one(2, 3);
      expect(matrix).toBeInstanceOf(Matrix);
      expect(matrix.elements).toEqual([[1, 1, 1], [1, 1, 1]]);
    });
  });

  describe('Zero', () => {
    test('It should create a new Matrix with the dimensions and cell value 0', () => {
      const matrix = Matrix.zero(2, 3);
      expect(matrix).toBeInstanceOf(Matrix);
      expect(matrix.elements).toEqual([[0, 0, 0], [0, 0, 0]]);
    });
  });

  describe('Transpose', () => {
    test('It should return a new Matrix that is the transpose of the input', () => {
      const input = new Matrix([[1, 2], [3, 4], [5, 6]]);
      const matrix = new Matrix(input, false);
      const transposed = matrix.transpose();
      expect(transposed).toBeInstanceOf(Matrix);
      expect(transposed.elements).toEqual([[1, 3, 5], [2, 4, 6]]);
    });
  });

  describe('Map', () => {
    test('It should create a new Matrix where each cell is calculated through a function', () => {
      const input = [[1, 2], [3, 4], [5, 6]];
      const matrix = new Matrix(input, false);
      const mapped = matrix.map((element, i, j) => element + i + j);
      expect(mapped).toBeInstanceOf(Matrix);
      expect(mapped.elements).toEqual([[1, 3], [4, 6], [7, 9]]);
    });
  });

  describe('Log', () => {
    test('It should create a new Matrix where each cell is the logarithm of the input cell', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const log = matrix.log();
      expect(log).toBeInstanceOf(Matrix);
      expect(log.elements).toEqual([
        [0, 0.6931471805599453],
        [1.0986122886681096, 1.3862943611198906],
      ]);
    });
  });

  describe('Augment', () => {
    test('It should create a new Matrix where each row is augmented with the passed matrix', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.augment([[5, 6, 7], [8, 9, 10]]);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[1, 2, 5, 6, 7], [3, 4, 8, 9, 10]]);
    });
    test('It should throw an error if the other matrix has not the same amount of rows', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      expect(() => {
        matrix.augment([[5, 6], [7, 8], [9, 10]]);
      }).toThrow('Cannot operate two matrix with different amount of rows.');
    });
    test('If an array is provided, is converted to a matrix', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.augment([5, 6]);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[1, 2, 5], [3, 4, 6]]);
    });
  });

  describe('Is same size as', () => {
    test('It should return true if both matrix have same dimension', () => {
      const inputA = [[1, 2, 2], [3, 4, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[5, 6, 6], [7, 8, 8]];
      const matrixB = new Matrix(inputB, false);
      expect(matrixA.isSameSizeAs(matrixB)).toEqual(true);
    });
    test('It should return false if the amount of rows is different', () => {
      const inputA = [[1, 2, 2], [3, 4, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[5, 6, 6], [7, 8, 8], [9, 10, 10]];
      const matrixB = new Matrix(inputB, false);
      expect(matrixA.isSameSizeAs(matrixB)).toEqual(false);
    });
    test('It should return false if the amount of columns is different', () => {
      const inputA = [[1, 2, 2], [3, 4, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[5, 6], [7, 8]];
      const matrixB = new Matrix(inputB, false);
      expect(matrixA.isSameSizeAs(matrixB)).toEqual(false);
    });
    test('It a vector is provided, is converted to matrix', () => {
      const inputA = [[1], [2], [3]];
      const matrixA = new Matrix(inputA, false);
      expect(matrixA.isSameSizeAs([4, 5, 6])).toEqual(true);
    });
  });

  describe('Is same column to row size', () => {
    test('It should return true if matrix A column count equals matrix B row count', () => {
      const inputA = [[1, 2, 2], [3, 4, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[5, 6], [7, 8], [9, 10]];
      const matrixB = new Matrix(inputB, false);
      expect(matrixA.isSameColumnToRowSize(matrixB)).toEqual(true);
    });
    test('It a vector is provided, is converted to matrix', () => {
      const inputA = [[1, 2, 3]];
      const matrixA = new Matrix(inputA, false);
      expect(matrixA.isSameColumnToRowSize([4, 5, 6])).toEqual(true);
    });
  });

  describe('Subtract', () => {
    test('If an scalar is provided, operate matrix with scalar', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.subtract(1);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[0, 1], [2, 3]]);
    });
    test('If a vector is provided, convert to matrix', () => {
      const input = [[1], [2], [3], [4]];
      const matrix = new Matrix(input, false);
      const result = matrix.subtract([0, 1, 2, 3]);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[1], [1], [1], [1]]);
    });
    test('If a matrix is provided, operate subtraction', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.subtract([[1, 1], [2, 2]]);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[0, 1], [1, 2]]);
    });
    test('If both matrix have not the same dimensions, an error is thrown', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      expect(() => {
        matrix.subtract([[1, 1, 1], [2, 2, 2]]);
      }).toThrow('Cannot operate two matrix with different dimensions.');
    });
  });

  describe('Multiply Operation', () => {
    test('If provided matrix is an scalar, then apply scalar operation for each element', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.mulOp(2, (a, b) => a * b);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[2, 4], [6, 8]]);
    });
    test('If a matrix is provided, apply the operation', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[1, 2], [3, 4]];
      const matrixB = new Matrix(inputB, false);
      const result = matrixA.mulOp(matrixB, (a, b) => a * b);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[7, 10], [15, 22]]);
    });
    test('If a matrix array is provided, apply the operation', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[1, 2], [3, 4]];
      const result = matrixA.mulOp(inputB, (a, b) => a * b);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[7, 10], [15, 22]]);
    });
    test('If a vector is provided, convert to matrix', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [1, 2];
      const matrixB = new Matrix(inputB, false);
      const result = matrixA.mulOp(matrixB, (a, b) => a * b);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[5], [11]]);
    });
    test('Number of rows of A should match number of columns of B, otherwise an error is thrown', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [1, 2, 3];
      const matrixB = new Matrix(inputB, false);
      expect(() => {
        matrixA.mulOp(matrixB, (a, b) => a * b);
      }).toThrow('Number of rows of A should match number of cols of B.');
    });
  });

  describe('Multiply', () => {
    test('If provided matrix is an scalar, then apply scalar operation for each element', () => {
      const input = [[1, 2], [3, 4]];
      const matrix = new Matrix(input, false);
      const result = matrix.multiply(2);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[2, 4], [6, 8]]);
    });
    test('If a matrix is provided, apply the operation', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[1, 2], [3, 4]];
      const matrixB = new Matrix(inputB, false);
      const result = matrixA.multiply(matrixB);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[7, 10], [15, 22]]);
    });
    test('If a matrix array is provided, apply the operation', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [[1, 2], [3, 4]];
      const result = matrixA.multiply(inputB);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[7, 10], [15, 22]]);
    });
    test('If a vector is provided, convert to matrix', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [1, 2];
      const matrixB = new Matrix(inputB, false);
      const result = matrixA.multiply(matrixB);
      expect(result).toBeInstanceOf(Matrix);
      expect(result.elements).toEqual([[5], [11]]);
    });
    test('Number of rows of A should match number of columns of B, otherwise an error is thrown', () => {
      const inputA = [[1, 2], [3, 4]];
      const matrixA = new Matrix(inputA, false);
      const inputB = [1, 2, 3];
      const matrixB = new Matrix(inputB, false);
      expect(() => {
        matrixA.multiply(matrixB);
      }).toThrow('Number of rows of A should match number of cols of B.');
    });
  });
});
