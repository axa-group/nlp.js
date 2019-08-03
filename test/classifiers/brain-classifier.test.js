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

const { BrainClassifier, Classifier } = require('../../lib');

const corpus = [
  {
    input: { who: 1, are: 1, you: 1 },
    output: 'who',
  },
  {
    input: { say: 1, about: 1, you: 1 },
    output: 'who',
  },
  {
    input: { why: 1, are: 1, you: 1, here: 1 },
    output: 'who',
  },
  {
    input: { who: 1, developed: 1, you: 1 },
    output: 'developer',
  },
  {
    input: { who: 1, is: 1, your: 1, developer: 1 },
    output: 'developer',
  },
  {
    input: { who: 1, do: 1, you: 1, work: 1, for: 1 },
    output: 'developer',
  },
  {
    input: { when: 1, is: 1, your: 1, birthday: 1 },
    output: 'birthday',
  },
  {
    input: { when: 1, were: 1, you: 1, borned: 1 },
    output: 'birthday',
  },
  {
    input: { date: 1, of: 1, your: 1, birthday: 1 },
    output: 'birthday',
  },
];

describe('Brain Classifier', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const classifier = new BrainClassifier();
      expect(classifier).toBeDefined();
    });
    test('Should create a configuration by default', () => {
      const classifier = new BrainClassifier();
      expect(classifier.settings.config).toEqual({
        activation: 'leaky-relu',
        hiddenLayers: [],
        learningRate: 0.7,
        errorThresh: 0.00005,
        iterations: 20000,
        momentum: 0.5,
        deltaErrorThresh: 0.000001,
        timeout: 120000,
        maxDecimals: 9,
        leakyReluAlpha: 0.08,
      });
    });
    test('I can provide a configuration', () => {
      const config = {
        activation: 'sigmoid',
        hiddenLayers: [],
        learningRate: 0.05,
        errorThresh: 0.001,
      };
      const classifier = new BrainClassifier({ config });
      expect(classifier.settings.config).toEqual(config);
    });
  });

  describe('Classifier', () => {
    test('Should be able to classify', () => {
      const classifier = new BrainClassifier();
      classifier.trainBatch(corpus);
      const actual = classifier.classify({ tell: 1, me: 1, about: 1, you: 1 });
      expect(actual).toHaveLength(3);
      expect(actual[0].label).toEqual('who');
    });
    test('If no feature is provided, should return None', () => {
      const classifier = new BrainClassifier();
      classifier.trainBatch(corpus);
      const actual = classifier.classify({});
      expect(actual).toHaveLength(1);
      expect(actual[0].label).toEqual('None');
      expect(actual[0].value).toEqual(1);
    });
    test('I can decide time per label', () => {
      const classifier = new BrainClassifier({
        labelTimeout: 1000,
      });
      classifier.trainBatch(corpus);
      const actual = classifier.classify({ tell: 1, me: 1, about: 1, you: 1 });
      expect(actual).toHaveLength(3);
      expect(actual[0].label).toEqual('who');
    });
    test('I can decide time per label and no global limit', () => {
      const classifier = new BrainClassifier({
        labelTimeout: 1000,
      });
      classifier.totalTimeout = 0;
      classifier.trainBatch(corpus);
      const actual = classifier.classify({ tell: 1, me: 1, about: 1, you: 1 });
      expect(actual).toHaveLength(3);
      expect(actual[0].label).toEqual('who');
    });
    test('I can decide time limit to not exists', () => {
      const classifier = new BrainClassifier();
      classifier.totalTimeout = 0;
      classifier.trainBatch(corpus);
      const actual = classifier.classify({ tell: 1, me: 1, about: 1, you: 1 });
      expect(actual).toHaveLength(3);
      expect(actual[0].label).toEqual('who');
    });
  });

  describe('toObj and fromObj', () => {
    test('Should be able to import/export', async () => {
      const classifier = new BrainClassifier();
      await classifier.trainBatch(corpus);
      const clone = Classifier.fromObj(classifier.toObj());
      const actual = clone.classify({ tell: 1, me: 1, about: 1, you: 1 });
      expect(actual).toHaveLength(3);
      expect(actual[0].label).toEqual('who');
    });
  });
});
