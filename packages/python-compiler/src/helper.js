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

function forEach(list, fn) {
  if (!list) {
    return;
  }
  if (typeof list === 'string' || Array.isArray(list)) {
    for (let i = 0, l = list.length; i < l; i += 1) {
      fn(list[i]);
    }
    return;
  }
  for (const item in list) {
    if ({}.hasOwnProperty.call(list, item)) {
      fn(item);
    }
  }
}

function range(from, to) {
  const result = [];
  for (let i = from; i <= to; i += 1) {
    result.push(i);
  }
  return result;
}

function print(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (i > 0) {
      process.stdout.write(' ');
    }
    if (args[i] !== undefined && args[i] !== null) {
      process.stdout.write(args[i].toString());
    }
  }
  process.stdout.write('\n');
}

function getIndex(value, index) {
  if (index < 0) {
    return value[value.length + index];
  }
  return value[index];
}

function len(value) {
  return value.length;
}

module.exports = {
  forEach,
  range,
  print,
  getIndex,
  len,
};
