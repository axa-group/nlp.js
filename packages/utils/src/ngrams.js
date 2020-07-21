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

const { normalize, tokenize } = require('./base-fn');

class NGrams {
  constructor(settings = {}) {
    this.normalizer = settings.normalizer;
    this.tokenizer = settings.tokenizer;
    if (settings.byChar === undefined) {
      if (settings.byWord) {
        this.byChar = false;
      } else {
        this.byChar = true;
      }
    } else {
      this.byChar = settings.byChar;
    }
    this.startToken = settings.startToken;
    this.endToken = settings.endToken;
  }

  split(text) {
    if (this.byChar) {
      return text.split('');
    }
    return tokenize(text, this.tokenizer);
  }

  getNGrams(text, n = 3) {
    if (Array.isArray(text)) {
      return this.getNGrams(text.join(' '), n);
    }
    const normalized = normalize(text, this.normalizer);
    const tokens = this.split(normalized);
    if (this.startToken !== undefined) {
      for (let i = 0; i < n - 1; i += 1) {
        tokens.unshift(this.startToken);
      }
    }
    if (this.endToken !== undefined) {
      for (let i = 0; i < n - 1; i += 1) {
        tokens.push(this.endToken);
      }
    }
    const result = [];
    for (let i = 0; i < tokens.length + 1 - n; i += 1) {
      const current = [];
      for (let j = 0; j < n; j += 1) {
        current.push(tokens[i + j]);
      }
      result.push(this.byChar ? current.join('') : current);
    }
    return result;
  }

  getFreqs(ngrams, weighted = false) {
    const dict = {};
    let delta = 1;
    if (weighted) {
      delta = typeof weighted === 'number' ? weighted : 1 / ngrams.length;
    }
    for (let i = 0; i < ngrams.length; i += 1) {
      dict[ngrams[i]] = (dict[ngrams[i]] || 0) + delta;
    }
    return dict;
  }

  getNGramsFreqs(text, n = 3, weighted = false) {
    return this.getFreqs(this.getNGrams(text, n), weighted);
  }
}

module.exports = NGrams;
