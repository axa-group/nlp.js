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
const BertWordPieceTokenizer = require('./bert-word-piece-tokenizer');

class MultiBertWordPieceTokenizer {
  constructor(settings = {}) {
    this.fs = settings.fs || fs;
    this.tokenizers = {};
  }

  loadTokenizers(locales, vocabContent, settings = {}) {
    const tokenizer = new BertWordPieceTokenizer({ ...settings, vocabContent });
    if (Array.isArray(locales)) {
      for (let i = 0; i < locales.length; i += 1) {
        this.tokenizers[locales[i]] = tokenizer;
      }
    } else {
      this.tokenizers[locales] = tokenizer;
    }
  }

  loadTokenizersFromFile(locales, fileName, settings = {}) {
    if (!this.fs) {
      throw new Error('No fs defined');
    }
    const vocabContent = this.fs.readFileSync(fileName, 'utf-8');
    if (settings.lowercase === undefined) {
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes('uncased')) {
        settings.lowercase = true;
      } else if (lowerName.includes('cased')) {
        settings.lowercase = false;
      }
    }
    this.loadTokenizers(locales, vocabContent, settings);
  }

  getTokenizer(locale) {
    if (this.tokenizers[locale]) {
      return this.tokenizers[locale];
    }
    if (this.tokenizers['*']) {
      return this.tokenizers['*'];
    }
    return undefined;
  }
}

module.exports = MultiBertWordPieceTokenizer;
