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

const { decomposeHangul, codaMap, composeHangul } = require('./hangul');
const { initDicts, names } = require('./korean-dictionary');

function isName(word) {
  initDicts();
  if (names.Full[word] || names.Given[word]) {
    return true;
  }
  if (
    word.length === 3 &&
    names.Family[word[0]] &&
    names.Given[word.slice(1, 3)]
  ) {
    return true;
  }
  if (
    word.length === 4 &&
    names.Family[word.slice(0, 2)] &&
    names.Given[word.slice(2, 4)]
  ) {
    return true;
  }
  return false;
}

function isKoreanNumber(word) {
  return /^[일이삼사오육칠팔구천백십해경조억만]*[일이삼사오육칠팔구천백십해경조억만원배분초]$/.test(
    word
  );
}

function isKoreanNameVariation(word) {
  if (isName(word)) {
    return true;
  }
  if (word.length < 3 || word.length > 5) {
    return false;
  }
  const decomposed = [...word].map((c) => decomposeHangul(c));
  const lastChar = decomposed[decomposed.length - 1];
  if (!codaMap[lastChar.onset]) {
    return false;
  }
  if (
    lastChar.onset === 'ㅇ' ||
    lastChar.vowel !== 'ㅣ' ||
    lastChar.coda !== ' '
  ) {
    return false;
  }
  if (decomposed[decomposed.length - 2].coda !== ' ') {
    return false;
  }
  const recovered = decomposed
    .map((hc, i) => {
      if (i === word.length - 1) {
        return '이';
      }
      if (i === word.length - 2) {
        return composeHangul(hc.onset, hc.vowel, lastChar.onset);
      }
      return composeHangul(hc.onset, hc.vowel, hc.coda);
    })
    .join('');
  return isName(recovered) || isName(recovered.slice(0, -1));
}

module.exports = {
  isName,
  isKoreanNumber,
  isKoreanNameVariation,
};
