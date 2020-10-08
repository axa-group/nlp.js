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
const { SpellCheck } = require('../../packages/similarity/src');
// const { SpellCheck } = require('@nlpjs/similarity');
const { NGrams } = require('../../packages/utils/src');
// const { NGrams } = require('@nlpjs/utils');

const lines = fs.readFileSync('./data/book.txt', 'utf-8').split(/\r?\n/);
const ngrams = new NGrams({ byWord: true });
const freqs = ngrams.getNGramsFreqs(lines, 1);
const spellCheck = new SpellCheck({ features: freqs });
const actual = spellCheck.check(['knowldge', 'thas', 'prejudize']);
console.log(actual);
console.log(freqs.this);
console.log(freqs.that);
