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

class Stemmer {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'stem';
  }

  stem(tokens) {
    return tokens;
  }

  getStemmer(srcInput) {
    const input = srcInput;
    const locale =
      input.locale || (input.settings ? input.settings.locale || 'en' : 'en');
    let stemmer = this.container.get(`stemmer-${locale}`);
    if (!stemmer) {
      const stemmerBert = this.container.get(`stemmer-bert`);
      if (stemmerBert && stemmerBert.activeFor(locale)) {
        stemmer = stemmerBert;
      } else {
        stemmer = this;
      }
    }
    return stemmer;
  }

  async addForTraining(srcInput) {
    const stemmer = this.getStemmer(srcInput);
    if (stemmer.addUtterance) {
      await stemmer.addUtterance(srcInput.utterance, srcInput.intent);
    }
    return srcInput;
  }

  async train(srcInput) {
    const stemmer = this.getStemmer(srcInput);
    if (stemmer.innerTrain) {
      await stemmer.innerTrain();
    }
    return srcInput;
  }

  async run(srcInput) {
    const input = srcInput;
    const stemmer = this.getStemmer(input);
    input.tokens = await stemmer.stem(input.tokens, input);
    return input;
  }
}

module.exports = Stemmer;
