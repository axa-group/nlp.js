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
const path = require('path');
const { BertWordPieceTokenizer } = require('@nlpjs/bert-tokenizer');
const { getAbsolutePath } = require('@nlpjs/utils');
const { DEFAULT_ASSETS_DIR } = require('./constants');

class BertTokenizer {
  constructor(settings) {
    this.tokenizer = this.initializeTokenizer(settings);
  }

  initializeTokenizer(settings) {
    const filesDir = getAbsolutePath(settings.filesDir, DEFAULT_ASSETS_DIR);
    if (settings.lowercase === undefined) {
      settings.lowercase = BertTokenizer.getLowerCase(filesDir);
    }
    if (!settings.vocabFile) {
      const fullPath = path.join(filesDir, 'vocab.txt');
      if (fs.existsSync(fullPath)) {
        settings.vocabFile = fullPath;
      }
    }
    const tokenizerOptions = {
      vocabContent: fs.readFileSync(settings.vocabFile, 'utf-8'),
      lowercase: settings.lowercase,
    };
    const tokens = [
      'clsToken',
      'maskToken',
      'padToken',
      'sepToken',
      'unkToken',
    ];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (settings[token]) {
        tokenizerOptions[token] = settings[token];
      }
    }
    return new BertWordPieceTokenizer(tokenizerOptions);
  }

  static getLowerCase(name) {
    if (name.includes('uncased')) {
      return true;
    }
    if (name.includes('cased')) {
      return false;
    }
    return undefined;
  }

  getQuestionLength(encoding) {
    return encoding.tokens.indexOf(this.tokenizer.configuration.sepToken) - 1;
  }

  getContextStartIndex(encoding) {
    return this.getQuestionLength(encoding) + 2;
  }

  getContextEndIndex(encoding) {
    const nbAddedTokens = encoding.specialTokensMask.reduce(
      (acc, val) => acc + val,
      0
    );
    const actualLength = encoding.length - nbAddedTokens;
    const contextLength = actualLength - this.getQuestionLength(encoding);
    return this.getContextStartIndex(encoding) + contextLength - 1;
  }

  encode(sequence, pair) {
    return this.tokenizer.encode(sequence, pair, 384, 384);
  }

  encodeSliced(sequence, pair) {
    return this.tokenizer.encodeSliced(sequence, pair, 384);
  }

  setPadding() {}

  setTruncation() {}
}

module.exports = BertTokenizer;
