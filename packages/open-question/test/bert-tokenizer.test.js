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
const { BertTokenizer } = require('../src');

const modelsDir = path.join(
  __filename,
  '../.models/henryk/bert-base-multilingual-cased-finetuned-dutch-squad2'
);

describe('BERT Tokenizer', () => {
  describe('constructor', () => {
    test('It should create a new instance', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      expect(tokenizer).toBeDefined();
      expect(tokenizer.tokenizer).toBeDefined();
      expect(tokenizer.tokenizer.numWords).toEqual(119548);
      expect(tokenizer.tokenizer.lowercase).toEqual(false);
    });
    test('Parameters can be provided', () => {
      const tokenizer = new BertTokenizer({
        filesDir: modelsDir,
        lowercase: true,
        clsToken: '[CLS]',
      });
      expect(tokenizer).toBeDefined();
      expect(tokenizer.tokenizer).toBeDefined();
      expect(tokenizer.tokenizer.numWords).toEqual(119548);
      expect(tokenizer.tokenizer.lowercase).toEqual(true);
    });
  });

  describe('Get Lower Case', () => {
    test('If uncased, return true', () => {
      const actual = BertTokenizer.getLowerCase('blah-uncased-blah');
      expect(actual).toEqual(true);
    });
    test('If cased, return false', () => {
      const actual = BertTokenizer.getLowerCase('blah-cased-blah');
      expect(actual).toEqual(false);
    });
    test('If not cased neither uncased, return undefined', () => {
      const actual = BertTokenizer.getLowerCase('blah-blah');
      expect(actual).toBeUndefined();
    });
  });

  describe('encode', () => {
    test('It can generate encoding for question and context', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      const question = 'Title of the first book';
      const context =
        'The first book is the philosopher stone, the second book is the chamber of secrets';
      const actual = tokenizer.encode(question, context);
      expect(actual.length).toEqual(384);
    });
  });

  describe('getQuestionLength', () => {
    test('It should return the question length from the encoding', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      const question = 'Title of the first book';
      const context =
        'The first book is the philosopher stone, the second book is the chamber of secrets';
      const encoding = tokenizer.encode(question, context);
      const actual = tokenizer.getQuestionLength(encoding);
      expect(actual).toEqual(5);
    });
  });

  describe('getContextStartIndex', () => {
    test('It should return the context start index', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      const question = 'Title of the first book';
      const context =
        'The first book is the philosopher stone, the second book is the chamber of secrets';
      const encoding = tokenizer.encode(question, context);
      const actual = tokenizer.getContextStartIndex(encoding);
      expect(actual).toEqual(7);
    });
  });

  describe('getContextEndIndex', () => {
    test('It should return the context end index', () => {
      const tokenizer = new BertTokenizer({ filesDir: modelsDir });
      const question = 'Title of the first book';
      const context =
        'The first book is the philosopher stone, the second book is the chamber of secrets';
      const encoding = tokenizer.encode(question, context);
      const actual = tokenizer.getContextEndIndex(encoding);
      expect(actual).toEqual(22);
    });
  });
});
