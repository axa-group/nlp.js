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

const Evaluator = require('./evaluator');

const evaluator = new Evaluator();

const dictionary = {};

/**
 * Process a string using a dictionary to don't repeat the regex match.
 * @param {string} str String to be processed.
 * @param {object[]} context Context with the variables to be replaced.
 * @returns {string} String processed with context variables replaced.
 */
function processString(str, context) {
  if (dictionary[str] === undefined) {
    dictionary[str] = str.match(/{{\s*([^}]+)\s*}}/g) || [];
  }
  const matches = dictionary[str];
  return matches.reduce((p, c) => {
    const solution = evaluator.evaluate(c.substr(2, c.length - 4), context);
    return solution !== null && solution !== undefined
      ? p.replace(c, solution)
      : p;
  }, str);
}

/**
 * Traverse the object replacing strings using context.
 * @param {object} obj Object to be replaced
 * @param {object} context Context variables
 * @returns {object} Object traversed in deep replacing strings.
 */
function process(obj, context) {
  if (typeof obj === 'string') {
    return processString(obj, context);
  }
  if (Array.isArray(obj)) {
    return obj.map((x) => process(x, context));
  }
  if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      result[keys[i]] = process(obj[keys[i]], context);
    }
    return result;
  }
  return obj;
}

function compile(str) {
  return (context = {}) => process(str, context);
}

module.exports = compile;
