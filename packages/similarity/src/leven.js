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

const array = [];
const charCodeCache = [];

/**
 * Calculates levenshtein distance
 * @param {string} left Left string
 * @param {string} right Right string
 * @returns {number} levenshtein distance of the two strings
 */
function leven(left, right) {
  if (left.length > right.length) {
    // eslint-disable-next-line no-param-reassign
    [left, right] = [right, left];
  }
  let leftLength = left.length - 1;
  let rightLength = right.length - 1;
  while (
    leftLength > 0 &&
    left.charCodeAt(leftLength) === right.charCodeAt(rightLength)
  ) {
    leftLength -= 1;
    rightLength -= 1;
  }
  leftLength += 1;
  rightLength += 1;
  let start = 0;
  while (
    start < leftLength &&
    left.charCodeAt(start) === right.charCodeAt(start)
  ) {
    start += 1;
  }
  leftLength -= start;
  rightLength -= start;
  if (leftLength === 0) {
    return rightLength;
  }
  for (let i = 0; i < leftLength; i += 1) {
    charCodeCache[i] = left.charCodeAt(start + i);
    array[i] = i + 1;
  }
  let bCharCode;
  let result;
  let temp;
  let temp2;
  let j = 0;
  while (j < rightLength) {
    bCharCode = right.charCodeAt(start + j);
    temp = j;
    j += 1;
    result = j;
    for (let i = 0; i < leftLength; i += 1) {
      /* eslint-disable */
      temp2 = temp + (bCharCode !== charCodeCache[i])|0;
      /* eslint-enable */
      temp = array[i];
      if (temp > result) {
        array[i] = temp2 > result ? result + 1 : temp2;
      } else {
        array[i] = temp2 > temp ? temp + 1 : temp2;
      }
      result = array[i];
    }
  }
  return result;
}

module.exports = leven;
