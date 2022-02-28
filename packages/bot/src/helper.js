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

// a number or an string are not json objects
const isJsonObject = (content) => {
  try {
    if (
      typeof content !== 'object' &&
      typeof JSON.parse(content) !== 'object'
    ) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const tryParseJson = (candidate, fallback = {}) => {
  try {
    return JSON.parse(candidate);
  } catch (error) {
    return fallback;
  }
};

const trimInput = (input = '') =>
  input
    .replace(/\t/g, ' ')
    .replace(/^( )*/, '')
    .replace(/( )*$/, '')
    .replace(/ +/g, ' ');

const getValidationMessage = (validation) => {
  let message = validation.message || 'Invalid value';
  if (Array.isArray(message)) {
    const minIndex = Math.min(validation.currentRetry, message.length) - 1;

    message = message[minIndex];
  }
  return message;
};

module.exports = {
  isJsonObject,
  tryParseJson,
  trimInput,
  getValidationMessage,
};
