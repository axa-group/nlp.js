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

const { decomposeHangul, composeHangul, hasCoda } = require('./hangul');

const preEomis = [
  [...'게겠고구기긴길네다더던도든면자잖재져죠지진질'],
  [...'야서써도준'],
  [...'어었'],
  [...'아았'],
  [...'워웠'],
  [...'여였'],
  [...'노느니냐'],
  [...'러려며'],
  ['으'],
  ['은'],
  ['는'],
  ['운'],
  [...'세시실신셔습셨십'],
  [
    ...[...'게겠고구기긴길네다더던도든면자잖재져죠지진질'],
    ...[...'노느니냐'],
    ...[...'러려며'],
    ...[...'세시실신셔습셨십'],
  ],
];

function build(lastChar, list) {
  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    const eomis = preEomis[list[i]];
    for (let j = 0; j < eomis.length; j += 1) {
      result.push(lastChar + eomis[j]);
    }
  }
  return result;
}

function buildCommon(onset, vowel) {
  return ['ㅂ', 'ㅆ', 'ㄹ', 'ㄴ', 'ㅁ'].map((coda) =>
    composeHangul(onset, vowel, coda)
  );
}

function buildNoPast(onset, vowel) {
  return ['ㅂ', 'ㄹ', 'ㄴ', 'ㅁ'].map((coda) =>
    composeHangul(onset, vowel, coda)
  );
}

function conjugate(words, isAdjective) {
  const expanded = [];
  for (const word of words) {
    const init = word.substr(0, word.length - 1);
    const lastChar = word.substr(-1);
    const lastCharDecomposed = decomposeHangul(lastChar);
    const lastOnset = lastCharDecomposed.onset;
    const lastVowel = lastCharDecomposed.vowel;
    const lastCoda = lastCharDecomposed.coda;
    let expandedLast;
    if (lastChar === '하') {
      expandedLast = [
        ...build(lastChar, [0, 6, 10, 12]),
        ...['ㅂ', 'ㅆ', 'ㄹ', 'ㄴ', 'ㅁ'].map((coda) =>
          composeHangul('ㅎ', coda === 'ㅆ' ? 'ㅐ' : 'ㅏ', coda)
        ),
        ...build('하', [13, 5, 10]),
        ...build('해', [1]),
        ...[...(isAdjective ? '합해히하' : '합해')],
      ];
    } else if (lastVowel === 'ㅗ' && lastCoda === ' ') {
      expandedLast = [].concat(
        build(lastChar, [13, 6, 3, 10]),
        buildNoPast(lastOnset, 'ㅗ'),
        [
          composeHangul(lastOnset, 'ㅘ'),
          composeHangul(lastOnset, 'ㅘ', 'ㅆ'),
          lastChar,
        ]
      );
    } else if (lastVowel === 'ㅜ' && lastCoda === ' ') {
      expandedLast = [].concat(
        build(lastChar, [13, 2, 6, 10]),
        buildNoPast(lastOnset, 'ㅜ'),
        [
          composeHangul(lastOnset, 'ㅝ'),
          composeHangul(lastOnset, 'ㅝ', 'ㅆ'),
          lastChar,
        ]
      );
    } else if (lastVowel === 'ㅡ' && lastCoda === ' ') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        buildNoPast(lastOnset, 'ㅡ'),
        [
          composeHangul(lastOnset, 'ㅝ'),
          composeHangul(lastOnset, 'ㅓ'),
          composeHangul(lastOnset, 'ㅏ'),
          composeHangul(lastOnset, 'ㅝ', 'ㅆ'),
          composeHangul(lastOnset, 'ㅓ', 'ㅆ'),
          composeHangul(lastOnset, 'ㅏ', 'ㅆ'),
          lastChar,
        ]
      );
    } else if (lastChar === '귀') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        buildNoPast('ㄱ', 'ㅟ'),
        ['겨', '겼', lastChar]
      );
    } else if (lastVowel === 'ㅟ' && lastCoda === ' ') {
      expandedLast = [].concat(
        buildNoPast(lastOnset, 'ㅟ'),
        build(lastChar, [6, 10]),
        [lastChar]
      );
    } else if (lastVowel === 'ㅣ' && lastCoda === ' ') {
      expandedLast = [].concat(
        buildNoPast(lastOnset, 'ㅣ'),
        build(lastChar, [2, 6, 10]),
        [
          `${composeHangul(lastOnset, 'ㅣ', 'ㅂ')}니`,
          composeHangul(lastOnset, 'ㅕ'),
          composeHangul(lastOnset, 'ㅕ', 'ㅆ'),
          lastChar,
        ]
      );
    } else if (
      (lastVowel === 'ㅞ' || lastVowel === 'ㅚ' || lastVowel === 'ㅙ') &&
      lastCoda === ' '
    ) {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        buildCommon(lastOnset, lastVowel),
        [lastChar]
      );
    } else if (lastCoda === ' ') {
      expandedLast = [].concat(
        build(lastChar, [13, 1, 6, 10]),
        buildCommon(lastOnset, lastVowel),
        [lastChar]
      );
    } else if (
      lastCoda === 'ㄹ' &&
      ((lastOnset === 'ㅁ' && lastVowel === 'ㅓ') ||
        lastVowel === 'ㅡ' ||
        lastVowel === 'ㅏ' ||
        lastVowel === 'ㅜ')
    ) {
      expandedLast = [].concat(
        build(lastChar, [2, 7]),
        build(composeHangul(lastOnset, lastVowel), [6, 10, 12]),
        [
          composeHangul(lastOnset, lastVowel, 'ㄻ'),
          composeHangul(lastOnset, lastVowel, 'ㄴ'),
          lastChar,
        ]
      );
    } else if (lastVowel === 'ㅏ' && lastCoda === 'ㅅ') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        build(composeHangul(lastOnset, 'ㅏ'), [8, 9]),
        [lastChar]
      );
    } else if (lastChar === '묻') {
      expandedLast = [].concat(build(lastChar, [6, 10]), ['물', lastChar]);
    } else if (lastVowel === 'ㅜ' && lastCoda === 'ㄷ') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        build(composeHangul(lastOnset, 'ㅜ'), [2, 4, 8, 9]),
        [composeHangul(lastOnset, 'ㅜ', 'ㄹ'), lastChar]
      );
    } else if (lastVowel === 'ㅜ' && lastCoda === 'ㅂ') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        build(composeHangul(lastOnset, 'ㅜ'), [4, 8, 9]),
        [lastChar]
      );
    } else if (lastVowel === 'ㅓ' && lastCoda === 'ㅂ' && isAdjective) {
      expandedLast = [].concat(build(composeHangul(lastOnset, 'ㅓ'), [4, 11]), [
        composeHangul(lastOnset, 'ㅓ'),
        composeHangul(lastOnset, 'ㅓ', 'ㄴ'),
        lastChar,
      ]);
    } else if (lastCoda === 'ㅂ' && isAdjective) {
      expandedLast = [].concat(
        build(composeHangul(lastOnset, lastVowel), [4, 11]),
        [composeHangul(lastOnset, lastVowel), lastChar]
      );
    } else if (lastVowel === 'ㅗ' && lastCoda === 'ㅎ') {
      expandedLast = [].concat(
        build(lastChar, [6, 10]),
        buildCommon(lastOnset, 'ㅗ'),
        [
          composeHangul(lastOnset, 'ㅘ'),
          composeHangul(lastOnset, 'ㅗ'),
          lastChar,
        ]
      );
    } else if (lastCoda === 'ㅎ' && isAdjective) {
      expandedLast = [].concat(
        buildCommon(lastOnset, lastVowel),
        ['ㅆ', 'ㄹ', 'ㅁ'].map((coda) => composeHangul(lastOnset, 'ㅐ', coda)),
        [
          composeHangul(lastOnset, 'ㅐ'),
          composeHangul(lastOnset, lastVowel),
          lastChar,
        ]
      );
    } else if (word.length === 1 || (isAdjective && lastCoda === 'ㅆ')) {
      expandedLast = [].concat(build(lastChar, [0, 2, 3, 6, 8, 9, 10]), [
        lastChar,
      ]);
      // eslint-disable-next-line no-dupe-else-if
    } else if (word.length === 1 && isAdjective) {
      expandedLast = [].concat(build(lastChar, [0, 2, 3, 6, 8, 9]), [lastChar]);
    } else {
      expandedLast = [lastChar];
    }
    let irregularExpansion = [];
    const initLast = init[init.length - 1];
    if (initLast && lastChar === '르' && !hasCoda(initLast)) {
      const lastInitCharDecomposed = decomposeHangul(initLast);
      const newInit =
        init.slice(0, -1) +
        composeHangul(
          lastInitCharDecomposed.onset,
          lastInitCharDecomposed.vowel,
          'ㄹ'
        );

      const o = lastCharDecomposed.onset;
      const conjugation = [].concat(
        build(lastChar, [6, 10]),
        buildNoPast(o, 'ㅡ'),
        [
          composeHangul(o, 'ㅝ'),
          composeHangul(o, 'ㅓ'),
          composeHangul(o, 'ㅏ'),
          composeHangul(o, 'ㅝ', 'ㅆ'),
          composeHangul(o, 'ㅓ', 'ㅆ'),
          composeHangul(o, 'ㅏ', 'ㅆ'),
          lastChar,
        ]
      );
      irregularExpansion = conjugation.map((s) => newInit + s);
    }
    expanded.push(...expandedLast.map((s) => init + s));
    expanded.push(...irregularExpansion);
  }

  const expandedMap = {};
  for (let i = 0; i < expanded.length; i += 1) {
    expandedMap[expanded[i]] = 1;
  }
  if (!isAdjective) {
    delete expandedMap['아니'];
    delete expandedMap['입'];
    delete expandedMap['입니'];
    delete expandedMap['나는'];
  }
  return expandedMap;
}

module.exports = {
  conjugate,
};
