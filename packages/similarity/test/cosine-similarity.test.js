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

const CosineSimilarity = require('../src/cosine-similarity');

describe('Cosine similarity', () => {
  const cosineSimilarityTools = new CosineSimilarity();

  test('Should return 0 similarity if one of the inputs is empty', () => {
    expect(cosineSimilarityTools.similarity('a', '')).toEqual(0);
    expect(cosineSimilarityTools.similarity('', 'a')).toEqual(0);
    expect(cosineSimilarityTools.similarity('', '123')).toEqual(0);
    expect(cosineSimilarityTools.similarity('123', '')).toEqual(0);
  });

  test('Should give max similarity although two sentences are not strictly equal', () => {
    expect(cosineSimilarityTools.similarity('hello', 'hello hello')).toEqual(1);
    expect(
      cosineSimilarityTools.similarity('hello bye', 'bye hello')
    ).toBeCloseTo(1, 3);
  });

  test('Should get low similarity receiving two similar words with different ending as stemmer is not used', () => {
    expect(
      cosineSimilarityTools.similarity('developer', 'development')
    ).toEqual(0);
  });

  test('Should return correct cosine similarity score (non oriental)', () => {
    expect(cosineSimilarityTools.similarity('potatoe', 'potatoe')).toEqual(1);
    expect(cosineSimilarityTools.similarity('a', 'b')).toEqual(0);
    expect(cosineSimilarityTools.similarity('ab', 'ac')).toEqual(0);
    expect(cosineSimilarityTools.similarity('abc', 'axc')).toEqual(0);
    expect(
      cosineSimilarityTools.similarity('this is a test', 'this is a test')
    ).toEqual(1);
    expect(
      cosineSimilarityTools.similarity('this is a test', 'this was a test')
    ).toEqual(0.75);
    expect(
      cosineSimilarityTools.similarity('this is a test', 'that was a test')
    ).toEqual(0.5);
    expect(
      cosineSimilarityTools.similarity('this is a test', 'that was some test')
    ).toEqual(0.25);
    expect(
      cosineSimilarityTools.similarity('this is a test', 'that was some tests')
    ).toEqual(0);

    const response = cosineSimilarityTools.similarity(
      'hey you',
      'hey how are you',
      'es'
    );
    expect(response).toBeCloseTo(0.707, 3);
    expect(response).not.toBeCloseTo(0.807, 3);
    expect(response).not.toBeCloseTo(0.607, 3);
  });

  test('should get frequency map from a sentence', () => {
    const response1 = cosineSimilarityTools.termFreqMap('hey you');
    const response2 = cosineSimilarityTools.termFreqMap('hey how are you');
    const response3 = cosineSimilarityTools.termFreqMap(
      'hey how how are you you'
    );

    expect(response1).toEqual({ hey: 1, you: 1 });
    expect(response2).toEqual({ hey: 1, how: 1, are: 1, you: 1 });
    expect(response2).not.toEqual({ hey: 1, you: 1 });
    expect(response3).toEqual({ hey: 1, how: 2, are: 1, you: 2 });
  });

  test('should add keys to dictionary', () => {
    const dic1 = {};

    cosineSimilarityTools.addKeysToDict({ hey: 1, you: 1 }, dic1);
    expect(dic1).toEqual({ hey: true, you: true });
    cosineSimilarityTools.addKeysToDict(
      { how: 1, are: 1, you: 1, doing: 1 },
      dic1
    );
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
    const response = cosineSimilarityTools.termFreqMapToVector(
      { hey: 1, how: 2, you: 1 },
      dic1
    );

    expect(response).toEqual([1, 2, 1, 0]);
  });

  test('should calculate cosine similarity given two frequency vectors', () => {
    const response1 = cosineSimilarityTools.cosineSimilarity(
      [1, 2, 1, 0],
      [0, 2, 2, 0]
    );
    expect(response1).toBeCloseTo(0.866, 3);

    const response2 = cosineSimilarityTools.cosineSimilarity([1, 2], [1, 2]);
    expect(response2).toBeCloseTo(1, 3);

    const response3 = cosineSimilarityTools.cosineSimilarity([1, 0], [0, 1]);
    expect(response3).toBeCloseTo(0, 3);
  });

  test('should calculate vector dot product', () => {
    const response1 = cosineSimilarityTools.vecDotProduct([1, 2, 3], [2, 2, 2]);

    expect(response1).toBe(12);
  });

  test('should calculate vector magnitude', () => {
    const response1 = cosineSimilarityTools.vecMagnitude([1, 2, 3]);

    expect(response1).toBeCloseTo(3.74);
  });
});
