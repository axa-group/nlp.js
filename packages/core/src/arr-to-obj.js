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
const { defaultContainer } = require('./container');

/**
 * Plugin to convert an array to a hashmap where every item existing in the
 * array is mapped to a 1.
 */
class ArrToObj {
  /**
   * Constructor of the class
   * @param {object} container Parent container, if not defined then the
   *    default container is used.
   */
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'arrToObj';
  }

  /**
   * Static method to convert an array to a hashmap object.
   * @param {object[]} arr Input array.
   * @returns {object} Output object.
   */
  static arrToObj(arr) {
    const result = {};
    for (let i = 0; i < arr.length; i += 1) {
      result[arr[i]] = 1;
    }
    return result;
  }

  run(input) {
    if (Array.isArray(input)) {
      return ArrToObj.arrToObj(input);
    }
    input.tokens = ArrToObj.arrToObj(input.tokens);
    return input;
  }
}

module.exports = ArrToObj;
