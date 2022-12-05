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

const { chunk } = require('./korean-chunker');
const { initDicts, dictionary } = require('./korean-dictionary');

const {
  isName,
  isKoreanNumber,
  isKoreanNameVariation,
} = require('./korean-substantive');

function getTopSlice(word) {
  initDicts();
  const max = Math.min(word.length, 2);
  for (let i = max; i > 1; i -= 1) {
    const slice = word.slice(0, i);
    if (isName(slice)) {
      return slice;
    }
    if (isKoreanNumber(slice)) {
      return slice;
    }
    if (isKoreanNameVariation(slice)) {
      return slice;
    }
    if (dictionary[slice]) {
      return slice;
    }
  }
  return word[0];
}

function isHangulChar(ch) {
  const regex =
    /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g;
  return regex.test(ch);
}

function buildPotentials(word) {
  if (!isHangulChar(word.text[0])) {
    return [word.text];
  }
  const potentials = [];
  let pending = word.text;
  while (pending.length > 0) {
    const top = getTopSlice(pending);
    potentials.push(top);
    pending = pending.slice(top.length);
  }
  return potentials;
}

function tokenize(text) {
  const chunks = chunk(text);
  const result = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const potentials = buildPotentials(chunks[i]);
    for (let j = 0; j < potentials.length; j += 1) {
      result.push(potentials[j]);
    }
  }
  return result;
}

function stemWord(token) {
  initDicts();
  const value = dictionary[token];
  if (value) {
    return value.root || token;
  }
  return token;
}

module.exports = {
  tokenize,
  stemWord,
};
