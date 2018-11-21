/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const AggressiveTokenizer = require('./aggressive-tokenizer');

class AggressiveTokenizerEn extends AggressiveTokenizer {
  replaceContractions(arr) {
    const contractionsBase = {
      cannot: ['can', 'not'],
      gonna: ['going', 'to'],
      wanna: ['want', 'to'],
    };

    const contractions = {
      s: 'is',
      re: 'are',
      m: 'am',
      ve: 'have',
      d: 'had',
    };
    const result = [];
    arr.forEach(item => {
      const lowitem = item.toLowerCase();
      if (contractionsBase[lowitem]) {
        result.push(...contractionsBase[lowitem]);
      } else if (contractions[lowitem]) {
        result.push(contractions[lowitem]);
      } else {
        result.push(item);
      }
    });
    return result;
  }

  tokenize(text) {
    const arr = this.trim(text.split(/\W+/));
    return this.replaceContractions(arr);
  }
}

module.exports = AggressiveTokenizerEn;
