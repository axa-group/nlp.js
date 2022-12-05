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

const fs = require('fs');
const request = require('./request');

function isWeb(str) {
  return (
    typeof str === 'string' &&
    (str.startsWith('https:') || str.startsWith('http:'))
  );
}

function readFile(fileName) {
  return new Promise((resolve) => {
    if (isWeb(fileName)) {
      request(fileName)
        .then((data) => resolve(data))
        .catch(() => resolve(undefined));
    } else {
      try {
        const data = fs.readFileSync(fileName, 'utf8');
        resolve(data);
      } catch (err) {
        resolve(undefined);
      }
    }
  });
}

function writeFile(fileName, data, format = 'utf8') {
  return new Promise((resolve, reject) => {
    if (isWeb(fileName)) {
      reject(new Error('File cannot be written in web'));
    } else {
      try {
        fs.writeFile(fileName, data, format, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      } catch (err) {
        reject(err);
      }
    }
  });
}

function existsSync(fileName) {
  return fs.existsSync(fileName);
}

function lstatSync(fileName) {
  return fs.lstatSync(fileName);
}

function readFileSync(fileName, encoding = 'utf8') {
  return fs.readFileSync(fileName, encoding);
}

module.exports = {
  readFile,
  writeFile,
  existsSync,
  lstatSync,
  readFileSync,
  name: 'fs',
};
