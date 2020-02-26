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

const dict = require('./dict.json');
const namesDict = require('./names-dict.json');
const { conjugate } = require('./korean-conjugation');

const dictionary = {};
const names = {};
let initialized = false;

function build() {
  const keys = Object.keys(dict);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const words = dict[key];
    for (let j = 0; j < words.length; j += 1) {
      dictionary[words[j]] = { type: key };
      if (key === 'Verb') {
        const conjugations = Object.keys(conjugate(words[j], false));
        for (let k = 0; k < conjugations.length; k += 1) {
          if (conjugations[k] !== words[j]) {
            dictionary[conjugations[k]] = { type: key, root: words[j] };
          }
        }
      }
    }
  }
}

function buildNames() {
  const keys = Object.keys(namesDict);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    names[key] = {};
    const words = namesDict[key];
    for (let j = 0; j < words.length; j += 1) {
      names[key][words[j]] = 1;
    }
  }
}

function initDicts() {
  if (!initialized) {
    build();
    buildNames();
    initialized = true;
  }
}

module.exports = {
  initDicts,
  dictionary,
  names,
};
