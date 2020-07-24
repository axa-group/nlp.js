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

const Lookup = require('./lookup');

class CorpusLookup {
  constructor(features, intents) {
    if (features) {
      this.inputLookup = new Lookup();
      this.outputLookup = new Lookup();
      for (let i = 0; i < features.length; i += 1) {
        this.inputLookup.add(features[i]);
      }
      for (let i = 0; i < intents.length; i += 1) {
        this.outputLookup.add(intents[i]);
      }
      this.numInputs = this.inputLookup.items.length;
      this.numOutputs = this.outputLookup.items.length;
    }
  }

  build(corpus) {
    this.inputLookup = new Lookup(corpus, 'input');
    this.outputLookup = new Lookup(corpus, 'output');
    this.numInputs = this.inputLookup.items.length;
    this.numOutputs = this.outputLookup.items.length;
    const result = [];
    for (let i = 0; i < corpus.length; i += 1) {
      const { input, output } = corpus[i];
      result.push({
        input: this.inputLookup.prepare(input),
        output: this.outputLookup.prepare(output),
      });
    }
    return result;
  }

  transformInput(input) {
    return this.inputLookup.prepare(input);
  }
}

module.exports = CorpusLookup;
