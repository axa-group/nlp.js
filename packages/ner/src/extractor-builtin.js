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

const { defaultContainer } = require('@nlpjs/core');
const reduceEdges = require('./reduce-edges');

class ExtractorBuiltin {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'extract-builtin';
  }

  extract(srcInput) {
    return srcInput;
  }

  async run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const extractor = this.container.get(`extract-builtin-${locale}`) || this;
    const newInput = await extractor.extract({
      text: input.text || input.utterance,
      locale: input.locale,
    });
    input.edges = input.edges || [];
    if (newInput.edges) {
      for (let i = 0; i < newInput.edges.length; i += 1) {
        input.edges.push(newInput.edges[i]);
      }
    }
    input.edges = reduceEdges(input.edges, false);
    input.sourceEntities = input.sourceEntities || [];
    if (newInput.sourceEntities) {
      for (let i = 0; i < newInput.sourceEntities.length; i += 1) {
        input.sourceEntities.push(newInput.sourceEntities[i]);
      }
    }
    return input;
  }
}

module.exports = ExtractorBuiltin;
