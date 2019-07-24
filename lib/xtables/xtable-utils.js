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

class XTableUtils {
  /**
   * Indicates the index of a given alpha character.
   * @param {Character} c Character to be checked.
   * @returns Index of the character, -1 if is invalid.
   */
  static alphaIndex(c) {
    return XTableUtils.alphachars.indexOf(c);
  }

  /**
   * Indicates if the given character is a valid Alpha.
   * @param {Character} c Character to be checked.
   * @returns {Boolean} True if the character is a valid alpha, false otherwise.
   */
  static isAlphaChar(c) {
    return XTableUtils.alphaIndex(c) !== -1;
  }

  /**
   * Converts an alpha from excel to its number equivalent.
   * @param {String} alpha Alpha representation, example: 'AB'. Is the format
   *                       for naming columns in Excel.
   * @returns {Number} Alpha in number format.
   */
  static alpha2number(alpha) {
    let result = 0;
    const alphalength = XTableUtils.alphachars.length;
    for (let i = 0, l = alpha.length; i < l; i += 1) {
      if (i > 0) {
        result += 1;
      }
      const current = XTableUtils.alphaIndex(alpha[i]);
      if (current === -1) {
        throw new Error('Invalid alpha');
      }
      result = result * alphalength + current;
    }
    return result;
  }

  /**
   * Given a decimal number, transform it to alpha format.
   * @param {Number} n Number in decimal format.
   * @return {String} Number in alpha format.
   */
  static number2alpha(n) {
    if (!Number.isInteger(n)) {
      throw new Error('Invalid number');
    }
    if (n < 0) {
      throw new Error('Number cannot be negative');
    }
    const alphalength = XTableUtils.alphachars.length;
    if (n < alphalength) {
      return XTableUtils.alphachars[n];
    }
    let result = '';
    let x = n;
    while (x >= 0) {
      const currentMod = x % alphalength;
      const currentValue = XTableUtils.alphachars[currentMod];
      result = currentValue + result;
      x = (x - currentMod) / alphalength - 1;
    }
    return result;
  }

  /**
   * Given an excel coordinate (example: 'BC123') transform it
   * to decimal coordinates.
   * @param {String} str Excel coordinate.
   * @returns {Object} Coordinate in format { column: ..., row: ...}
   */
  static excel2coord(str) {
    const l = str.length;
    let index = 0;
    let alpha = '';
    let numeric = '';
    while (index < l && XTableUtils.isAlphaChar(str[index])) {
      alpha += str[index];
      index += 1;
    }
    while (index < l) {
      numeric += str[index];
      index += 1;
    }
    return {
      column: XTableUtils.alpha2number(alpha),
      row: Number.parseInt(numeric, 10) - 1,
    };
  }

  /**
   * Decimal coordinate to excel coordinate.
   * @param {Object} coord Decimal coordinate in format { column: ..., row: ...}
   * @returns {String} Excel coordinate.
   */
  static coord2excel(coord) {
    return XTableUtils.number2alpha(coord.column) + (coord.row + 1);
  }

  /**
   * Transform an excel range to a decimal range.
   * @param {*} str
   */
  static excel2range(str) {
    const index = str.indexOf(':');
    if (index === -1) {
      throw new Error('Invalid excel range');
    }
    return {
      topleft: XTableUtils.excel2coord(str.substring(0, index)),
      bottomright: XTableUtils.excel2coord(
        str.substring(index + 1, str.length)
      ),
    };
  }
}

XTableUtils.alphachars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = XTableUtils;
