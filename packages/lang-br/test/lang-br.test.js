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

const { Container } = require('@nlpjs/core');
const { LangBr } = require('../src');

describe('Language Brazilian Portuguese', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangBr);
      const tokenizer = instance.get('tokenizer-br');
      expect(tokenizer.constructor.name).toEqual('TokenizerBr');
      const stemmer = instance.get('stemmer-br');
      expect(stemmer.constructor.name).toEqual('StemmerBr');
      const stopwords = instance.get('stopwords-br');
      expect(stopwords.constructor.name).toEqual('StopwordsBr');
      const normalizer = instance.get('normalizer-br');
      expect(normalizer.constructor.name).toEqual('NormalizerBr');
    });
  });
});
