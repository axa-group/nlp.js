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

const { NGrams } = require('../src');

describe('NGrams', () => {
  describe('get ngrams', () => {
    test('It should get by default the char 3-grams', () => {
      const input = 'this is a book';
      const ngrams = new NGrams();
      const actual = ngrams.getNGrams(input);
      const expected = [
        'thi',
        'his',
        'is ',
        's i',
        ' is',
        'is ',
        's a',
        ' a ',
        'a b',
        ' bo',
        'boo',
        'ook',
      ];
      expect(actual).toEqual(expected);
    });
    test('It can get by other n-grams', () => {
      const input = 'this is a book';
      const ngrams = new NGrams();
      const actual = ngrams.getNGrams(input, 4);
      const expected = [
        'this',
        'his ',
        'is i',
        's is',
        ' is ',
        'is a',
        's a ',
        ' a b',
        'a bo',
        ' boo',
        'book',
      ];
      expect(actual).toEqual(expected);
    });
    test('It can get the 3-grams by words', () => {
      const input = 'this is a larger sentence to test n-grams';
      const ngrams = new NGrams({ byWord: true });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'n-grams'],
      ];
      expect(actual).toEqual(expected);
    });
    test('Start token can be set', () => {
      const input = 'this is a larger sentence to test n-grams';
      const ngrams = new NGrams({ byWord: true, startToken: '[start]' });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['[start]', '[start]', 'this'],
        ['[start]', 'this', 'is'],
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'n-grams'],
      ];
      expect(actual).toEqual(expected);
    });
    test('End token can be set', () => {
      const input = 'this is a larger sentence to test n-grams';
      const ngrams = new NGrams({ byWord: true, endToken: '[end]' });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'n-grams'],
        ['test', 'n-grams', '[end]'],
        ['n-grams', '[end]', '[end]'],
      ];
      expect(actual).toEqual(expected);
    });
    test('Start and End tokens can be set', () => {
      const input = 'this is a larger sentence to test n-grams';
      const ngrams = new NGrams({
        byWord: true,
        startToken: '[start]',
        endToken: '[end]',
      });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['[start]', '[start]', 'this'],
        ['[start]', 'this', 'is'],
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'n-grams'],
        ['test', 'n-grams', '[end]'],
        ['n-grams', '[end]', '[end]'],
      ];
      expect(actual).toEqual(expected);
    });
    test('It can get the 3-grams by words from several lines', () => {
      const input = ['this is a larger sentence', 'to test n-grams'];
      const ngrams = new NGrams({ byWord: true });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'n-grams'],
      ];
      expect(actual).toEqual(expected);
    });
    test('Own tokenizer can be provided', () => {
      const input = 'this-is-a-larger-sentence-to-test-ngrams';
      const tokenizer = (sentence) => sentence.split('-');
      const ngrams = new NGrams({ byWord: true, tokenizer });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'ngrams'],
      ];
      expect(actual).toEqual(expected);
    });
    test('Own tokenizer with tokenize method can be provided', () => {
      const input = 'this-is-a-larger-sentence-to-test-ngrams';
      const tokenizer = {
        tokenize: (sentence) => sentence.split('-'),
      };
      const ngrams = new NGrams({ byWord: true, tokenizer });
      const actual = ngrams.getNGrams(input);
      const expected = [
        ['this', 'is', 'a'],
        ['is', 'a', 'larger'],
        ['a', 'larger', 'sentence'],
        ['larger', 'sentence', 'to'],
        ['sentence', 'to', 'test'],
        ['to', 'test', 'ngrams'],
      ];
      expect(actual).toEqual(expected);
    });
    test('Own normalizer can be provided', () => {
      const input = 'áéíóú';
      const normalizer = (c) => c;
      const ngrams = new NGrams({ byChar: true, normalizer });
      const actual = ngrams.getNGrams(input);
      const expected = ['áéí', 'éíó', 'íóú'];
      expect(actual).toEqual(expected);
    });
    test('Own normalizer with normalize method can be provided', () => {
      const input = 'áéíóú';
      const normalizer = { normalize: (c) => c };
      const ngrams = new NGrams({ byChar: true, normalizer });
      const actual = ngrams.getNGrams(input);
      const expected = ['áéí', 'éíó', 'íóú'];
      expect(actual).toEqual(expected);
    });
  });

  describe('get ngram frequencies', () => {
    test('it should return a dict of freqs', () => {
      const input = 'aeiouaei';
      const ngrams = new NGrams();
      const actual = ngrams.getNGramsFreqs(input);
      const expected = {
        aei: 2,
        eio: 1,
        iou: 1,
        oua: 1,
        uae: 1,
      };
      expect(actual).toEqual(expected);
    });
    test('it can be weighted', () => {
      const input = 'aeiouaei';
      const ngrams = new NGrams();
      const actual = ngrams.getNGramsFreqs(input, 3, true);
      const expected = {
        aei: 2 / 6,
        eio: 1 / 6,
        iou: 1 / 6,
        oua: 1 / 6,
        uae: 1 / 6,
      };
      expect(actual).toEqual(expected);
    });
    test('own weight can be provided', () => {
      const input = 'aeiouaei';
      const ngrams = new NGrams();
      const actual = ngrams.getNGramsFreqs(input, 3, 0.5);
      const expected = {
        aei: 1,
        eio: 0.5,
        iou: 0.5,
        oua: 0.5,
        uae: 0.5,
      };
      expect(actual).toEqual(expected);
    });
  });
});
