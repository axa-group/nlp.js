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

class Stopwords {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'removeStopwords';
    this.dictionary = {};
  }

  build(list) {
    for (let i = 0; i < list.length; i += 1) {
      this.dictionary[list[i]] = true;
    }
  }

  isNotStopword(token) {
    return !this.dictionary[token];
  }

  isStopword(token) {
    return !!this.dictionary[token];
  }

  removeStopwords(tokens) {
    return tokens.filter((x) => this.isNotStopword(x));
  }

  run(srcInput) {
    if (srcInput.settings && srcInput.settings.keepStopwords === false) {
      const input = srcInput;
      const locale = input.locale || 'en';
      const remover = this.container.get(`stopwords-${locale}`) || this;
      input.tokens = remover
        .removeStopwords(input.tokens, input)
        .filter((x) => x);
      return input;
    }
    return srcInput;
  }
}

module.exports = Stopwords;
