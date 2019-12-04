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

const crypto = require('crypto');

const byteToHex = [];

for (let i = 0; i < 256; i += 1) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function uuid() {
  const rnds = crypto.randomBytes(16);
  /* eslint-disable no-bitwise */
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  /* eslint-disable no-bitwise */
  rnds[8] = (rnds[8] & 0x3f) | 0x80;
  const arr = [];
  let curr = 0;
  for (let i = 0; i < 20; i += 1) {
    if (i === 4 || i === 7 || i === 10 || i === 13) {
      arr.push('-');
    } else {
      arr.push(byteToHex[rnds[curr]]);
      curr += 1;
    }
  }
  return arr.join('');
}

module.exports = uuid;
