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

/**
 * Class representing a Vector and some of the possible operations.
 */
class Vector {
  /**
   * Constructor of the class
   * @param {Number[] | Vector} elements Elements for initializing the vector.
   * @param {boolean} useClone If true, the input array is cloned. If false, it uses
   *                     the elements input directly by reference.
   */
  constructor(elements, useClone = true) {
    if (useClone) {
      this.elements = elements
        ? (elements.elements || elements).slice()
        : undefined;
    } else {
      this.elements = elements.elements || elements;
    }
  }

  /**
   * Creates a new array, where we can say the number of elements, and also the
   * value used for initializing each cell of the array.
   * @param {Number} numElements Number of elements.
   * @param {Number} value Initialization value.
   * @returns {Number[]} Array initialized with the given value at each cell.
   */
  static createArray(numElements, value) {
    const result = [];
    for (let i = 0; i < numElements; i += 1) {
      result.push(value);
    }
    return result;
  }

  /**
   * Creates a new array where each element value is 1.
   * @param {Number} numElements Number of elements.
   * @returns {Number[]} Array where each cell is 1.
   */
  static one(numElements) {
    return new Vector(Vector.createArray(numElements, 1));
  }

  /**
   * Creates a new array where each element value is 0.
   * @param {Number} numElements Number of elements.
   * @returns {Number[]} Array where each cell is 0.
   */
  static zero(numElements) {
    return new Vector(Vector.createArray(numElements, 0));
  }

  /**
   * Iterate every element of the vector, and executed the provided function
   * for each one.
   * @param {Function} fn Function with signature (element, index).
   */
  forEach(fn) {
    const numElements = this.elements.length;
    for (let i = 0; i < numElements; i += 1) {
      fn(this.elements[i], i);
    }
  }

  /**
   * Creates a new vector where each element is the element of this vector,
   * but operated by a function.
   * @param {Function} fn Function with signature (element, index).
   * @returns {Vector} New vector result of apply the function to each element.
   */
  map(fn) {
    const result = Vector.zero(this.elements.length);
    this.forEach((value, i) => {
      result.elements[i] = fn(value, i);
    });
    return result;
  }

  /**
   * Run an binary operation over this vector.
   * @param {Number|Number[] | Vector} operand Scalar o vector to operate this with.
   * @param {Fucntion} operator Operator binary function with
   *            signature (operandElement, thisElement, index)
   */
  runOperation(operand, operator) {
    // If operand is an scalar.
    if (typeof operand === 'number') {
      return this.map((v, i) => operator(v, operand, i));
    }
    // If operand is a vector.
    const values = operand.elements || operand;
    if (this.elements.length !== values.length) {
      throw new Error('Cannot operate two vectors with different dimensions.');
    }
    return this.map((v, i) => operator(v, values[i], i));
  }

  /**
   * Return a vector where every element is the natural logarithm of the
   * input element.
   * @returns {Vector} Result vector.
   */
  log() {
    return this.map(x => Math.log(x));
  }

  /**
   * Return a new Vector that is the result of this - value.
   * @param {Vector} value Vector to subtract from this one.
   * @returns {Vector} Result vector that is this - value.
   */
  subtract(value) {
    const elements = [];
    if (typeof value === 'number') {
      for (let i = 0, li = this.elements.length; i < li; i += 1) {
        elements.push(this.elements[i] - value);
      }
    } else {
      const values = value.elements || value;
      if (this.elements.length !== values.length) {
        throw new Error(
          'Cannot operate two vectors with different dimensions.'
        );
      }
      for (let i = 0, li = this.elements.length; i < li; i += 1) {
        elements.push(this.elements[i] - values[i]);
      }
    }
    return new Vector(elements, false);
  }

  /**
   * Returns the sum of all the elements of the Vector.
   * @returns {Number} Sum of all the vector elements.
   */
  sum() {
    let result = 0;
    this.forEach(element => {
      result += element;
    });
    return result;
  }

  /**
   * Multiply this vector by the vector provided element by element.
   * @param {Number[] | Vector} value Vector to multiply by this one.
   * @returns {Vector} Vector result of multiplication of both.
   */
  elementMultiply(value) {
    const values = value.elements || value;
    const elements = [];
    for (let i = 0, li = this.elements.length; i < li; i += 1) {
      elements.push(this.elements[i] * values[i]);
    }
    return new Vector(elements, false);
  }

  /**
   * Return a new array that is the concatenation of both.
   * @param {Vector | Number[]} values Vector or array to be added.
   * @returns {Vector} Vector that is concat of this with values.
   */
  augment(values) {
    return new Vector(this.elements.concat(values.elements || values), false);
  }

  /**
   * Calculates the dot product (scalar product) between two vectors.
   * @param {Vector | Number[]} value Vector to be multiplied by this one.
   * @returns {Number} Scalar representing the dot product.
   */
  dot(value) {
    const elements = value.elements || value;
    if (this.elements.length !== elements.length) {
      throw new Error('Cannot operate two vectors with different dimensions.');
    }
    let product = 0;
    for (let i = 0; i < elements.length; i += 1) {
      product += this.elements[i] * elements[i];
    }
    return product;
  }

  /**
   * Returns a vector that is a subvector of this from element n.
   * @param {Number} n Position of the chomp.
   * @returns {Vector} Vector that is subvector of this from element n.
   */
  chomp(n) {
    return new Vector(this.elements.slice(n), false);
  }
}

module.exports = Vector;
