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

const cosineSimilarityTools = require('../src/cosine-similarity');

const {
  termFreqMap,
  addKeysToDict,
  termFreqMapToVector,
  vecDotProduct,
  vecMagnitude,
  cosineSimilarity,
  similarity,
} = cosineSimilarityTools;

describe('Cosine similarity', () => {
  test('Should return 0 similarity if one of the inputs is empty', () => {
    expect(similarity('a', '')).toEqual(0);
    expect(similarity('', 'a')).toEqual(0);
    expect(similarity('', '123')).toEqual(0);
    expect(similarity('123', '')).toEqual(0);
  });

  test('Should give max similarity although two sentences are not strictly equal', () => {
    expect(similarity('hello', 'hello hello')).toEqual(1);
    expect(similarity('hello bye', 'bye hello')).toBeCloseTo(1, 3);
  });

  test('Should get low similarity receiving two similar words with different ending as stemmer is not used', () => {
    expect(similarity('developer', 'development')).toEqual(0);
  });

  test('Should return correct cosine similarity score (without stemmers)', () => {
    expect(similarity('potatoe', 'potatoe')).toEqual(1);
    expect(similarity('a', 'b')).toEqual(0);
    expect(similarity('ab', 'ac')).toEqual(0);
    expect(similarity('abc', 'axc')).toEqual(0);
    expect(similarity('this is a test', 'this is a test')).toEqual(1);
    expect(similarity('this is a test', 'this was a test')).toEqual(0.75);
    expect(similarity('this is a test', 'that was a test')).toEqual(0.5);
    expect(similarity('this is a test', 'that was some test')).toEqual(0.25);
    expect(similarity('this is a test', 'that was some tests')).toEqual(0);

    const response = similarity('hey you', 'hey how are you', 'es');
    expect(response).toBeCloseTo(0.707, 3);
    expect(response).not.toBeCloseTo(0.807, 3);
    expect(response).not.toBeCloseTo(0.607, 3);

    expect(similarity('こんにちは世界', 'こんにちは世', 'ja')).toEqual(0.75);
    expect(similarity('你好世界', '你好世界', 'zh')).toEqual(1);
    expect(similarity('你好世界', '你好', 'zh')).toBeCloseTo(0.707, 3);
    expect(
      similarity(
        '因為我是中國人所以我會說中文',
        '因為我是英國人所以我會說英文',
        'zh'
      )
    ).toBeCloseTo(0.727, 3);
  });

  test('should get frequency map from a sentence', () => {
    const response1 = termFreqMap('hey you');
    const response2 = termFreqMap('hey how are you');
    const response3 = termFreqMap('hey how how are you you');

    expect(response1).toEqual({ hey: 1, you: 1 });
    expect(response2).toEqual({ hey: 1, how: 1, are: 1, you: 1 });
    expect(response2).not.toEqual({ hey: 1, you: 1 });
    expect(response3).toEqual({ hey: 1, how: 2, are: 1, you: 2 });
  });

  test('should get frequency map from a sentence (also with oriental languages, chinese)', () => {
    const chineseLocale = 'zh';
    const response1 = termFreqMap(
      '当她五岁的时候，她学会了骑自行车',
      chineseLocale
    );
    expect(response1).toEqual({
      了: 1,
      五: 1,
      她: 2,
      学会: 1,
      岁: 1,
      当: 1,
      时候: 1,
      的: 1,
      自行车: 1,
      骑: 1,
      '，': 1,
    });
  });

  test('should get frequency map from a sentence (also with oriental languages, japanese)', () => {
    const japaneseLocale = 'ja';
    const response2 = termFreqMap('こんにちは世界', japaneseLocale);
    expect(response2).toEqual({
      こん: 1,
      にち: 1,
      は: 1,
      世界: 1,
    });
  });

  test('should add keys to dictionary', () => {
    const dic1 = {};

    addKeysToDict({ hey: 1, you: 1 }, dic1);
    expect(dic1).toEqual({ hey: true, you: true });
    addKeysToDict({ how: 1, are: 1, you: 1, doing: 1 }, dic1);
    expect(dic1).toEqual({
      hey: true,
      you: true,
      how: true,
      are: true,
      doing: true,
    });
  });

  test('should return frequency vector from map', () => {
    const dic1 = { hey: true, how: true, you: true, other: true };
    const response = termFreqMapToVector({ hey: 1, how: 2, you: 1 }, dic1);

    expect(response).toEqual([1, 2, 1, 0]);
  });

  test('should calculate cosine similarity given two frequency vectors', () => {
    const response1 = cosineSimilarity([1, 2, 1, 0], [0, 2, 2, 0]);
    expect(response1).toBeCloseTo(0.866, 3);

    const response2 = cosineSimilarity([1, 2], [1, 2]);
    expect(response2).toBeCloseTo(1, 3);

    const response3 = cosineSimilarity([1, 0], [0, 1]);
    expect(response3).toBeCloseTo(0, 3);
  });

  test('should calculate vector dot product', () => {
    const response1 = vecDotProduct([1, 2, 3], [2, 2, 2]);

    expect(response1).toBe(12);
  });

  test('should calculate vector magnitude', () => {
    const response1 = vecMagnitude([1, 2, 3]);

    expect(response1).toBeCloseTo(3.74);
  });
});
