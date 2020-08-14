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

const path = require('path');
const { QAClient, BertTokenizer } = require('../src');

const modelsDir = path.join(
  __filename,
  '../.models/henryk/bert-base-multilingual-cased-finetuned-dutch-squad2'
);

const context = `the title of the first book is the philosopher stone, the second one is the chamber of secrets`;
const question = 'title of the second book';

describe('QA Client', () => {
  describe('constructor', () => {
    test('It should create a new instance', () => {
      const qa = new QAClient();
      expect(qa).toBeDefined();
    });
    test('Settings can be provided', () => {
      const settings = { a: 1, b: 2 };
      const qa = new QAClient(settings);
      expect(qa.settings).toEqual(settings);
    });
  });

  describe('Get Features', () => {
    test('It should return the features', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      const qa = new QAClient();
      qa.model = { inputLength: 384 };
      qa.tokenizer = tokenizer;
      const features = qa.getFeatures(question, context);
      expect(features).toHaveLength(1);
      expect(features[0].contextStartIndex).toEqual(7);
    });
  });
});
