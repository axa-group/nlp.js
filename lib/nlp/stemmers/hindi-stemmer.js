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

const BaseStemmer = require('./base-stemmer');

class HindiStemmer extends BaseStemmer {
  processSuffixes(word) {
    const maxSuffixes = word.length > 5 ? 4 : word.length - 2;
    for (let i = maxSuffixes; i >= 0; i -= 1) {
      const suffixes = HindiStemmer.suffixes[i];
      for (let j = 0; j < suffixes.length; j += 1) {
        if (word.endsWith(suffixes[j])) {
          return word.slice(0, -suffixes[j].length);
        }
      }
    }
    return word;
  }

  stem() {
    let word = this.getCurrent();
    word = this.processSuffixes(word);
    this.setCurrent(word);
  }
}

HindiStemmer.suffixes = [
  ['ो', 'े', 'ू', 'ु', 'ी', 'ि', 'ा'],
  ['कर', 'ाओ', 'िए', 'ाई', 'ाए', 'ने', 'नी', 'ना', 'ते', 'ीं', 'ती', 'ता', 'ाँ', 'ां', 'ों', 'ें'],
  ['ाकर', 'ाइए', 'ाईं', 'ाया', 'ेगी', 'ेगा', 'ोगी', 'ोगे', 'ाने', 'ाना', 'ाते', 'ाती', 'ाता', 'तीं',
   'ाओं', 'ाएं', 'ुओं', 'ुएं', 'ुआं'],
  ['ाएगी', 'ाएगा', 'ाओगी', 'ाओगे', 'एंगी', 'ेंगी', 'एंगे', 'ेंगे', 'ूंगी', 'ूंगा', 'ातीं', 'नाओं', 'नाएं',
   'ताओं', 'ताएं', 'ियाँ', 'ियों', 'ियां'],
  ['ाएंगी', 'ाएंगे', 'ाऊंगी', 'ाऊंगा', 'ाइयाँ', 'ाइयों', 'ाइयां'],
];

module.exports = HindiStemmer;
