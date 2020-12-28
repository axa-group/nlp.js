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

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getMeasures(tokens) {
  const freqs = {
    length: 0,
    words: tokens.length,
    vowels: 0,
    consonants: 0,
    uniqueChars: 0,
  };
  const vowels = { a: 1, e: 1, i: 1, o: 1, u: 1, y: 1 };
  const chars = {};
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    freqs.length += token.length;
    for (let j = 0; j < token.length; j += 1) {
      if (vowels[token[j]]) {
        freqs.vowels += 1;
      } else {
        freqs.consonants += 1;
      }
      chars[token[j]] = 1;
    }
  }
  freqs.uniqueChars = Object.keys(chars).length;
  freqs.vowelFreq = freqs.vowels / freqs.length;
  freqs.consonantFreq = freqs.consonants / freqs.length;
  freqs.uniqueFreq = freqs.uniqueChars / freqs.length;
  freqs.wordCharFreq = freqs.words / freqs.length;
  freqs.vowelOverConsonant =
    freqs.consonants > 0 ? freqs.vowels / freqs.consonants : 0;
  return freqs;
}

function getDeviation(value, lower, upper) {
  if (value < lower) {
    return Math.log(lower) / Math.log(lower - value);
  }
  if (value > upper) {
    return Math.log(1 - upper) / Math.log(value - upper);
  }
  return 0;
}

function gibberishScore(text) {
  if (text.length < 6) {
    return 0;
  }
  const tokens = normalize(text)
    .split(/[\s,.!?;:([\]'"¡¿)/]+/)
    .filter((x) => x);
  const measures = getMeasures(tokens);
  const deviations = {
    wordChar: getDeviation(measures.wordCharFreq, 0.15, 0.3),
    unique: getDeviation(measures.uniqueFreq, 0.4, 1),
    vowelOverConsonant: getDeviation(measures.vowelOverConsonant, 0.5, 1.5),
  };
  return Math.min(
    1,
    deviations.unique * 2 + deviations.wordChar + deviations.vowelOverConsonant
  );
}

function isGibberish(text) {
  return gibberishScore(text) > 0.5;
}

module.exports = {
  gibberishScore,
  isGibberish,
};
