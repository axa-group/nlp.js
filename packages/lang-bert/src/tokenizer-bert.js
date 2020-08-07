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
const { Tokenizer } = require('@nlpjs/core');
const { MultiBertWordPieceTokenizer } = require('@nlpjs/bert-tokenizer');

class TokenizerBert extends Tokenizer {
  constructor(container, shouldNormalize) {
    super(container, shouldNormalize);
    this.multi = new MultiBertWordPieceTokenizer({
      fs:
        this.container && this.container.get
          ? this.container.get('fs')
          : undefined,
    });
    this.name = 'tokenizer-bert';
    this.removals = {
      '[CLS]': true,
      '[SEP]': true,
      '[PAD]': true,
      '[MASK]': true,
      ',': true,
      '?': true,
      '.': true,
      '!': true,
      ';': true,
      ':': true,
      '(': true,
      '[': true,
      ']': true,
      "'": true,
      '"': true,
      '¿': true,
      '¡': true,
      ')': true,
    };
    if (this.container && this.container.getConfiguration) {
      const conf = this.container.getConfiguration('bert');
      if (conf && conf.vocabs) {
        for (let i = 0; i < conf.vocabs.length; i += 1) {
          this.multi.loadTokenizersFromFile(
            conf.vocabs[i].locales,
            conf.vocabs[i].fileName,
            conf.vocabs[i].settings
          );
        }
      }
    }
  }

  activeFor(locale) {
    const conf = this.container.getConfiguration('bert');
    if ((conf ? conf.url : undefined) || process.env.BERT_ENDPOINT) {
      if (conf.avoid && conf.avoid.includes(locale)) {
        return false;
      }
      return true;
    }
    return false;
  }

  innerTokenizeMulti(text, locale = 'en') {
    const bertTokenizer = this.multi.getTokenizer(locale);
    if (bertTokenizer) {
      return bertTokenizer.encode(text);
    }
    return undefined;
  }

  async innerTokenize(text, settings = {}) {
    let result = this.innerTokenizeMulti(text, settings.locale);
    if (!result) {
      const conf = this.container.getConfiguration('bert');
      if (!conf || conf.useRemote === undefined || conf.useRemote) {
        const request = this.container.get('request');
        const postData = `{ "text": "${encodeURIComponent(text)}"}`;
        const url = (conf ? conf.url : undefined) || process.env.BERT_ENDPOINT;
        const options = {
          url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
          },
          postData,
        };
        result = await request.get(options);
      }
    }
    if (!result.tokens || !result.tokens.filter) {
      console.log(text);
      return [];
    }
    const tokens = result.tokens.filter((x) => !this.removals[x]);
    return tokens;
  }
}

module.exports = TokenizerBert;
