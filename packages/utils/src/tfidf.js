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

const { normalize, tokenize } = require('./base-fn');

class TfIdf {
  constructor(settings = {}) {
    this.tokenizer = settings.tokenizer;
    this.normalizer = settings.normalizer;
    this.documents = {};
    this.cache = {};
  }

  clearCache() {
    this.cache = {};
  }

  getTokens(text) {
    if (typeof text === 'string') {
      const normalized = normalize(text, this.normalizer);
      return tokenize(normalized, this.tokenizer);
    }
    return text;
  }

  buildDocument(text) {
    const tokenized = this.getTokens(text);
    const result = {};
    tokenized.forEach((word) => {
      result[word] = (result[word] || 0) + 1;
    });
    return result;
  }

  addDocument(key, document) {
    this.documents[key] = this.buildDocument(document);
    this.clearCache();
  }

  static tf(term, document) {
    return document[term] || 0;
  }

  docsWithTerm(term) {
    if (this.cache[term] && this.cache[term].docsWithTerm !== undefined) {
      return this.cache[term].docsWithTerm;
    }
    let result = 0;
    Object.values(this.documents).forEach((document) => {
      if (document[term] && document[term] > 0) {
        result += 1;
      }
    });
    if (!this.cache[term]) {
      this.cache[term] = {};
    }
    this.cache[term].docsWithTerm = result;
    return result;
  }

  idf(term) {
    if (this.cache[term] && this.cache[term].idf !== undefined) {
      return this.cache[term].idf;
    }
    const docsWithTerm = this.docsWithTerm(term);
    const result =
      1 + Math.log(Object.keys(this.documents).length / (1 + docsWithTerm));
    if (!this.cache[term]) {
      this.cache[term] = {};
    }
    this.cache[term].idf = result;
    return result;
  }

  tfidf(terms, key) {
    const tokens = this.getTokens(terms);
    let result = 0;
    const document = this.documents[key];
    for (let i = 0; i < tokens.length; i += 1) {
      const term = tokens[i];
      let idf = this.idf(term);
      idf = idf === Infinity ? 0 : idf;
      result += TfIdf.tf(term, document) * idf;
    }
    return result;
  }

  tfidfs(terms) {
    const keys = Object.keys(this.documents);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      result[keys[i]] = this.tfidf(terms, keys[i]);
    }
    return result;
  }

  classify(terms) {
    const tfidfs = this.tfidfs(terms);
    const result = [];
    Object.keys(tfidfs).forEach((key) => {
      result.push({ document: key, score: tfidfs[key] });
    });
    return result.sort((a, b) => b.score - a.score);
  }
}

module.exports = TfIdf;
