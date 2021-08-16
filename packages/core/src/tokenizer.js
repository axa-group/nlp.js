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

const { defaultContainer } = require('./container');
const Normalizer = require('./normalizer');

class Tokenizer {
  constructor(container = defaultContainer, shouldNormalize = false) {
    this.container = container.container || container;

    this.name = 'tokenize';
    this.shouldNormalize = shouldNormalize;
  }

  getNormalizer() {
    if (!this.normalizer) {
      this.normalizer =
        this.container.get(`normalizer-${this.name.slice(-2)}`) ||
        new Normalizer();
    }
    return this.normalizer;
  }

  normalize(text, force) {
    if ((force === undefined && this.shouldNormalize) || force === true) {
      const normalizer = this.getNormalizer();
      return normalizer.normalize(text);
    }
    return text;
  }

  innerTokenize(text) {
    return text.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
  }

  tokenize(text, normalize) {
    let result;
    if (this.cache) {
      const now = new Date();
      const diff = Math.abs(now.getTime() - this.cache.created) / 3600000;
      if (diff > 1) {
        this.cache = undefined;
      }
    }
    if (!this.cache) {
      this.cache = {
        created: new Date().getTime(),
        normalized: {},
        nonNormalized: {},
      };
    } else {
      if (normalize) {
        if (Object.prototype.hasOwnProperty.call(this.cache.normalized, text)) {
          result = this.cache.normalized[text];
        }
      } else if (
        Object.prototype.hasOwnProperty.call(this.cache.nonNormalized, text)
      ) {
        result = this.cache.nonNormalized[text];
      }
      if (result) {
        return result;
      }
    }
    result = this.innerTokenize(this.normalize(text, normalize), normalize);
    if (normalize) {
      this.cache.normalized[text] = result;
    } else {
      this.cache.nonNormalized[text] = result;
    }
    return result;
  }

  async run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    let tokenizer = this.container.get(`tokenizer-${locale}`);
    if (!tokenizer) {
      const tokenizerBert = this.container.get(`tokenizer-bert`);
      if (tokenizerBert && tokenizerBert.activeFor(locale)) {
        tokenizer = tokenizerBert;
      } else {
        tokenizer = this;
      }
    }
    const tokens = await tokenizer.tokenize(input.text, input);
    input.tokens = tokens.filter((x) => x);
    return input;
  }
}

module.exports = Tokenizer;
