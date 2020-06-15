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

const TokenizerBert = require('./tokenizer-bert');
const StemmerBert = require('./stemmer-bert');
const NormalizerBert = require('./normalizer-bert');

function registerBertForLanguage(container, locale) {
  const tokenizer = new TokenizerBert(container);
  tokenizer.name = `tokenizer-${locale}`;
  container.use(tokenizer);
  const stemmer = new StemmerBert(container);
  stemmer.name = `stemmer-${locale}`;
  container.use(stemmer);
  const normalizer = new NormalizerBert(container);
  normalizer.name = `normalizer-${locale}`;
  container.use(normalizer);
}

/**
 * Class for LangBert
 */
class LangBert {
  register(container) {
    container.use(new TokenizerBert(container));
    container.use(new StemmerBert(container));
    container.use(new NormalizerBert(container));
    const conf = container.getConfiguration('bert');
    if (conf && conf.languages) {
      for (let i = 0; i < conf.languages.length; i += 1) {
        registerBertForLanguage(container, conf.languages[i]);
      }
    }
  }
}

module.exports = LangBert;
