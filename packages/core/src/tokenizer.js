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
  constructor(container = defaultContainer, normalize) {
    this.container = container.container || container;
    this.name = 'tokenize';
    if (normalize) {
      this.shouldNormalize = true;
      if (normalize !== true) {
        this.normmalizer = normalize;
      } else {
        this.normalizer = new Normalizer();
      }
    } else {
      this.shouldNormalize = false;
    }
  }

  tokenize(text) {
    const normalized = this.shouldNormalize
      ? this.normalizer.normalize(text)
      : text;
    return normalized.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter(x => x);
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const tokenizer = this.container.get(`tokenizer-${locale}`) || this;
    input.tokens = tokenizer.tokenize(input.text, input).filter(x => x);
    return input;
  }
}

module.exports = Tokenizer;
