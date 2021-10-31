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

class CosineSimilarity {
  constructor(container) {
    this.container = container;

    /* eslint-disable */
    this.wa_memory = new WebAssembly.Memory({ initial: 2 });
    /* eslint-enable */

    this.wa_buffer = new Uint32Array(this.wa_memory.buffer);
    this.wa_importObject = {
      js: {
        mem: this.wa_memory,
      },
    };

    /* eslint-disable */
    const source = fs.readFileSync(path.resolve(__dirname, '../wa/cosine-similarity.wasm'));
    const mod = new WebAssembly.Module(new Uint8Array(source));
    this.wa_object = new WebAssembly.Instance(mod, this.wa_importObject);
    /* eslint-enable */
  }

  getTokens(text, locale = 'en') {
    if (typeof text === 'string') {
      const tokenizer =
        this.container && this.container.get(`tokenizer-${locale}`);
      return tokenizer ? tokenizer.tokenize(text, true) : text.split(' ');
    }
    return text;
  }

  termFreqMap(str, locale) {
    const words = this.getTokens(str, locale);
    const termFreq = {};
    words.forEach((w) => {
      termFreq[w] = (termFreq[w] || 0) + 1;
    });
    return termFreq;
  }

  addKeysToDict(map, dict) {
    Object.keys(map).forEach((key) => {
      dict[key] = true;
    });
  }

  termFreqMapToVector(map, dict) {
    const termFreqVector = [];
    Object.keys(dict).forEach((term) => {
      termFreqVector.push(map[term] || 0);
    });
    return termFreqVector;
  }

  vecDotProduct(vecA, vecB) {
    let idx = 0;
    for (let i = 0; i < vecA.length; i += 1) {
      this.wa_buffer[idx] = vecA[i];
      idx += 1;
    }

    for (let i = 0; i < vecB.length; i += 1) {
      this.wa_buffer[idx] = vecB[i];
      idx += 1;
    }

    return this.wa_object.exports.vecDotProduct(vecA.length, vecB.length);
  }

  vecMagnitude(vec) {
    let idx = 0;
    for (let i = 0; i < vec.length; i += 1) {
      this.wa_buffer[idx] = vec[i];
      idx += 1;
    }

    return this.wa_object.exports.vecMagnitude(0, vec.length);
  }

  /**
   * Calculates cosine-similarity from two vectors
   * @param {number[]} left Left vector
   * @param {number[]} right Right vector
   * @returns {number} cosine between two vectors
   * {@link https://en.wikipedia.org/wiki/Cosine_similarity Cosine Similarity}
   */
  cosineSimilarity(vecA, vecB) {
    let idx = 0;
    for (let i = 0; i < vecA.length; i += 1) {
      this.wa_buffer[idx] = vecA[i];
      idx += 1;
    }

    for (let i = 0; i < vecB.length; i += 1) {
      this.wa_buffer[idx] = vecB[i];
      idx += 1;
    }

    return this.wa_object.exports.cosineSimilarity(vecA.length, vecB.length);
  }

  /**
   * Calculates cosine-similarity from two sentences
   * @param {string} left Left string
   * @param {string} right Right string
   * @returns {number} cosine between two sentences representend in VSM
   */
  similarity(strA, strB, locale) {
    if (strA === strB) {
      return 1;
    }
    const termFreqA = this.termFreqMap(strA, locale);
    const termFreqB = this.termFreqMap(strB, locale);

    if (!Object.keys(termFreqA).length || !Object.keys(termFreqB).length) {
      return 0;
    }
    const dict = {};
    this.addKeysToDict(termFreqA, dict);
    this.addKeysToDict(termFreqB, dict);

    const termFreqVecA = this.termFreqMapToVector(termFreqA, dict);
    const termFreqVecB = this.termFreqMapToVector(termFreqB, dict);

    return this.cosineSimilarity(termFreqVecA, termFreqVecB);
  }
}

module.exports = CosineSimilarity;
