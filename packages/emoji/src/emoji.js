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

const { stringToArray } = require('@nlpjs/core');

const nonSpacingRegex = new RegExp(String.fromCharCode(65039), 'g');
const emojiByName = require('./emoji.json');

const strip = (x) => x.replace(nonSpacingRegex, '');

const keys = Object.keys(emojiByName);
const emojiByCode = {};
for (let i = 0; i < keys.length; i += 1) {
  const current = keys[i];
  emojiByCode[strip(emojiByName[current])] = current;
}

const which = (code) => {
  const word = emojiByCode[strip(code)];
  return word ? `:${word}:` : code;
};

const removeEmojis = (str) =>
  str
    ? stringToArray(str)
        .map((word) => which(word))
        .join('')
    : str;

module.exports = { removeEmojis };
