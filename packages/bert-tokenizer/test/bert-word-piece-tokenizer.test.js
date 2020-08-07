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
const { BertWordPieceTokenizer } = require('../src');

const vocabEn = fs.readFileSync(
  './packages/bert-tokenizer/dicts/vocab-en.txt',
  'utf-8'
);

describe('BertWordPieceTokenizer', () => {
  describe('constructor', () => {
    test('It should create a new instance', () => {
      const tokenizer = new BertWordPieceTokenizer();
      expect(tokenizer).toBeDefined();
    });
    test('It should load the vocabulary if provided', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      expect(tokenizer.words).toBeDefined();
      expect(tokenizer.affixes).toBeDefined();
      expect(tokenizer.affixMaxLength).toEqual(14);
    });
  });

  describe('Split sentence', () => {
    test('Should split a sentence into tokens', () => {
      const input = "This isn't tokenized, maybe.";
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.splitSentence(input);
      expect(actual.length).toEqual(11);
      expect(actual[0].token).toEqual('This');
      expect(actual[6].start).toEqual(11);
      expect(actual[6].end).toEqual(19);
      expect(actual[6].type).toEqual('word');
    });
  });

  describe('Get Best Affix', () => {
    test('Should calculate the best affix for a word', () => {
      const input = 'Supervised';
      const expected = 'ised';
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.getBestAffix(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Tokenize Word', () => {
    test('Should return several tokens if word does not match and has affixes', () => {
      const input = 'Supervised';
      const expected = {
        tokens: ['Super', '##v', '##ised'],
        ids: [3198, 1964, 3673],
      };
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.tokenizeWord(input);
      expect(actual).toEqual(expected);
    });
    test('Should return matched word if found', () => {
      const input = 'supervised';
      const expected = {
        tokens: ['supervised'],
        ids: [14199],
      };
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.tokenizeWord(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Tokenize Sentence', () => {
    test('Should tokenize a sentence', () => {
      const expected = {
        ids: [1188, 1110, 170, 5650, 119],
        offsets: [
          [0, 4],
          [5, 7],
          [8, 9],
          [10, 18],
          [18, 19],
        ],
        tokens: ['This', 'is', 'a', 'sentence', '.'],
      };
      const input = 'This is a sentence.';
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.tokenizeSentence(input);
      expect(actual).toEqual(expected);
    });
  });

  describe('Encode', () => {
    test('It should add a [CLS] at the begining', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.'
      );
      expect(actual.ids[0]).toEqual(101);
      expect(actual.tokens[0]).toEqual('[CLS]');
    });
    test('It should add a [SEP] between question and context', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.'
      );
      expect(actual.ids[6]).toEqual(102);
      expect(actual.tokens[6]).toEqual('[SEP]');
    });
    test('It should add a [SEP] at the end', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.'
      );
      expect(actual.ids[actual.ids.length - 1]).toEqual(102);
      expect(actual.tokens[actual.ids.length - 1]).toEqual('[SEP]');
    });
    test('It should add word indexes for words, null for special tokens', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.'
      );
      expect(actual.wordIndexes[0]).toEqual(null);
      expect(actual.wordIndexes[1]).toEqual(0);
      expect(actual.wordIndexes[2]).toEqual(1);
      expect(actual.wordIndexes[6]).toEqual(null);
      expect(actual.wordIndexes[7]).toEqual(5);
    });
    test('It should add type ids, 0 for question, 1 for context', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.'
      );
      expect(actual.typeIds[0]).toEqual(0);
      expect(actual.typeIds[8]).toEqual(1);
    });
    test('Min length can be provided', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.',
        100
      );
      expect(actual.ids.length).toEqual(100);
    });
    test('Max length can be provided', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encode(
        'This is the question.',
        'This is the context.',
        undefined,
        6
      );
      expect(actual.ids.length).toEqual(6);
    });
  });

  describe('Encode sliced', () => {
    test('It should generate several slices', () => {
      const tokenizer = new BertWordPieceTokenizer({ vocabContent: vocabEn });
      const actual = tokenizer.encodeSliced(
        'This is the question.',
        'This is the context and we do it larger to have enough tokens.',
        16
      );
      expect(actual.length).toEqual(4);
    });
  });
});
