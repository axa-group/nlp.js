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
const { QnaImporter } = require('../src');

describe('QnA Importer', () => {
  describe('constructor', () => {
    it('Should create an instance', () => {
      const instance = new QnaImporter();
      expect(instance).toBeDefined();
    });
  });

  describe('Transform', () => {
    it('Should transform a qna into a corpus', () => {
      const content = fs.readFileSync(path.join(__dirname, 'qna.tsv'), 'utf8');
      const instance = new QnaImporter();
      const corpus = instance.transform(content, { locale: 'en' })[0];
      expect(corpus).toBeDefined();
      expect(corpus.name).toEqual('corpus_en');
      expect(corpus.locale).toEqual('en');
      expect(corpus.data).toHaveLength(90);
    });
  });
});
