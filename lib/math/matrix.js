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

const Vector = require('./vector');

/**
 * Class representing a Matrix and some of the possible operations.
 */
class Matrix {
  /**
   * Constructor of the class
   * @param {Number[][] | Matrix} elements Elements for initializing the matrix.
   * @param {boolean} useClone If true, the input array is cloned. If false, it uses
   *                     the elements input directly by reference.
   */
  constructor(elements, useClone = true) {
    if (useClone) {
      this.setElements(elements);
    } else {
      this.elements = elements.elements || elements;
    }
  }

  /**
   * Clone the input elemnts and assign to this instance elements.
   * @param {Number[][] | Matrix} els Input elements.
   */
  setElements(els) {
    if (!els) {
      return this;
    }
    const elements = els.elements || els;
    if (!elements || elements.length === 0) {
      return this;
    }
    this.elements = [];
    if (elements[0][0] !== undefined) {
      for (let i = 0; i < elements.length; i += 1) {
        this.elements.push(elements[i].slice());
      }
      return this;
    }
    for (let i = 0; i < elements.length; i += 1) {
      this.elements.push([elements[i]]);
    }
    return this;
  }

  /**
   * Return a row of the matrix as a vector.
   * @param {Number} i Row number.
   * @returns {Vector} Row of the matrix as a vector.
   */
  row(i) {
    if (i < 0 || i >= this.elements.length) {
      return undefined;
    }
    return new Vector(this.elements[i]);
  }

  /**
   * Return a column of the matrix as a vector.
   * @param {Number} j Column number.
   * @returns {Vector} Column of the matrix as a vector.
   */
  column(j) {
    if (j < 0 || j >= this.elements[0].length) {
      return undefined;
    }
    const result = [];
    for (let i = 0; i < this.elements.length; i += 1) {
      result.push(this.elements[i][j]);
    }
    return new Vector(result);
  }

  /**
   * Return the amount of rows of the matrix.
   * @returns {Number} Amount of rows of the matrix.
   */
  rowCount() {
    return this.elements.length;
  }

  /**
   * Creates a new Matrix with given dimensions and filled with the cell value.
   * @param {Number} n Amount of rows.
   * @param {Number} m Amount of columns.
   * @param {Number} v Cell value.
   * @returns {Number[][] | Matrix} Matrix with given dimensions and cell value.
   */
  static fill(n, m, v) {
    const elements = [];
    for (let i = 0; i < n; i += 1) {
      elements.push(Vector.createArray(m, v));
    }
    return new Matrix(elements, false);
  }

  /**
   * Creates a new Matrix with given dimensions and filled with 0.
   * @param {Number} n Amount of rows.
   * @param {Number} m Amount of columns.
   * @returns {Matrix} Matrix with given dimensions filled with 0.
   */
  static zero(n, m) {
    return Matrix.fill(n, m, 0);
  }

  /**
   * Creates a new Matrix with given dimensions and filled with 1.
   * @param {Number} n Amount of rows.
   * @param {Number} m Amount of columns.
   * @returns {Matrix} Matrix with given dimensions filled with 1.
   */
  static one(n, m) {
    return Matrix.fill(n, m, 1);
  }

  /**
   * Creates a new Matrix that is the transposed of this one
   * (rows become columns).
   * @returns {Matrix} Matrix that is transposed of this one.
   */
  transpose() {
    const numRows = this.elements.length;
    const numColumns = this.elements[0].length;
    const elements = [];
    for (let i = 0; i < numColumns; i += 1) {
      elements.push([]);
      for (let j = 0; j < numRows; j += 1) {
        elements[i][j] = this.elements[j][i];
      }
    }
    return new Matrix(elements, false);
  }

  /**
   * Creates a new matrix where each element is the result of executiong
   * the provided function with signature (element, i, j).
   * @param {Function} fn Function for calculating each element.
   * @returns {Matrix} Resulting mapped matrix.
   */
  map(fn) {
    const numRows = this.elements.length;
    const numColumns = this.elements[0].length;
    const elements = [];
    for (let i = 0; i < numRows; i += 1) {
      elements.push([]);
      for (let j = 0; j < numColumns; j += 1) {
        elements[i][j] = fn(this.elements[i][j], i, j);
      }
    }
    return new Matrix(elements, false);
  }

  /**
   * Returns a new matrix where each cell is the natural logarithm
   * of the input element.
   * @returns {Matrix} Logarithm matrix.
   */
  log() {
    return this.map(x => Math.log(x));
  }

  /**
   * Return a matrix where is row is augmented with the corresponding
   * row of the input matrix.
   * @param {Number[][] | Matrix} matrix Input matrix.
   * @returns {Matrix} Matrix that is this one augmented with the input one.
   */
  augment(matrix) {
    let elements = matrix.elements || matrix;
    if (!elements[0][0]) {
      ({ elements } = new Matrix(elements));
    }
    const clone = new Matrix(this.elements);
    const numColumns = clone.elements[0].length;
    const numRows = clone.elements.length;
    const elementColumns = elements[0].length;
    if (numRows !== elements.length) {
      throw new Error(
        'Cannot operate two matrix with different amount of rows.'
      );
    }
    for (let i = 0; i < numRows; i += 1) {
      for (let j = 0; j < elementColumns; j += 1) {
        clone.elements[i][numColumns + j] = elements[i][j];
      }
    }
    return clone;
  }

  /**
   * Indicates if another matrix has exactly same dimensions as this one.
   * @param {Number[][] | Number[] | Matrix | Vector} matrix Input matrix.
   * @returns {boolean} True if both have same number of rows and columns.
   */
  isSameSizeAs(matrix) {
    let elements = matrix.elements || matrix;
    if (!elements[0][0]) {
      ({ elements } = new Matrix(elements));
    }
    return (
      this.elements.length === elements.length &&
      this.elements[0].length === elements[0].length
    );
  }

  /**
   * Indicates if another matrix has exactly same amount of rows as this
   * matrix amount of columns.
   * @param {Number[][] | Number[] | Matrix | Vector} matrix Input matrix.
   * @returns {boolean} True if this one column count equals input row count.
   */
  isSameColumnToRowSize(matrix) {
    let elements = matrix.elements || matrix;
    if (!elements[0][0]) {
      ({ elements } = new Matrix(elements));
    }
    return this.elements[0].length === elements.length;
  }

  /**
   * Performs a substraction element by element between two matrix.
   * @param {Matrix} matrix Input matrix.
   */
  subtract(matrix) {
    if (typeof matrix === 'number') {
      return this.map(x => x - matrix);
    }
    let elements = matrix.elements || matrix;
    if (!elements[0][0]) {
      ({ elements } = new Matrix(elements));
    }
    if (!this.isSameSizeAs(elements)) {
      throw new Error('Cannot operate two matrix with different dimensions.');
    }
    return this.map((x, i, j) => x - elements[i][j]);
  }

  /**
   * Given a matrix an an operation function, applies this operation
   * multiplying this matrix with the provided one.
   * @param {Matrix} matrix Matrix to operate with this.
   * @param {Function} op Multiply operation.
   * @returns {Matrix} Result matrix of multiplying both matrix.
   */
  mulOp(matrix, op) {
    if (typeof matrix === 'number') {
      return this.map((x, i, j) => op(x, matrix, i, j));
    }
    let inputElements = matrix.elements || matrix;
    if (!inputElements[0][0]) {
      inputElements = new Matrix(inputElements).elements;
    }
    if (!this.isSameColumnToRowSize(inputElements)) {
      throw new Error('Number of rows of A should match number of cols of B.');
    }
    const result = [];
    for (let i = 0; i < this.elements.length; i += 1) {
      const currentRow = [];
      for (let j = 0; j < inputElements[0].length; j += 1) {
        let sum = 0;
        for (let k = this.elements[0].length - 1; k >= 0; k -= 1) {
          sum += op(this.elements[i][k], inputElements[k][j]);
        }
        currentRow[j] = sum;
      }
      result[i] = currentRow;
    }
    return new Matrix(result);
  }

  /**
   * Multiply two matrix.
   * @param {Matrix} matrix Input matrix.
   * @param {Function} activation Optional activation fucntion.
   * @returns {Matrix} Multiplication of the matrix.
   */
  multiply(matrix, activation) {
    if (typeof matrix === 'number') {
      const result = new Matrix(this.elements, true);
      for (let i = 0, li = result.elements.length; i < li; i += 1) {
        for (let j = 0, lj = result.elements[0].length; j < lj; j += 1) {
          result.elements[i][j] *= matrix;
        }
      }
      return result;
    }
    let inputElements = matrix.elements || matrix;
    if (!inputElements[0][0]) {
      inputElements = new Matrix(inputElements).elements;
    }
    if (this.elements[0].length !== inputElements.length) {
      throw new Error('Number of rows of A should match number of cols of B.');
    }
    const li = this.elements.length;
    const lj = inputElements[0].length;
    const lk = this.elements[0].length - 1;
    const result = [];
    for (let i = 0; i < li; i += 1) {
      const currentRow = [];
      for (let j = 0; j < lj; j += 1) {
        let sum = 0;
        for (let k = lk; k >= 0; k -= 1) {
          sum += this.elements[i][k] * inputElements[k][j];
        }
        if (activation) {
          sum = activation(sum);
        }
        currentRow[j] = sum;
      }
      result[i] = currentRow;
    }
    return new Matrix(result);
  }
}

module.exports = Matrix;
