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

const { Perceptron } = require('../src');
const corpus = require('./corpus.json');

describe('Perceptron', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const perceptron = new Perceptron({
        feature: 'something',
        features: ['something'],
      });
      expect(perceptron).toBeDefined();
    });

    test('It should initialize default properties', () => {
      const perceptron = new Perceptron({
        feature: 'something',
        features: ['something'],
      });
      expect(perceptron.iterations).toEqual(20000);
      expect(perceptron.errorThresh).toEqual(0.00005);
      expect(perceptron.fixedError).toEqual(false);
      expect(perceptron.deltaErrorThresh).toEqual(0.000001);
      expect(perceptron.learningRate).toEqual(0.7);
      expect(perceptron.momentum).toEqual(0.5);
      expect(perceptron.alpha).toEqual(0.08);
      expect(perceptron.log).toEqual(false);
    });
  });

  describe('Train', () => {
    test('Should train and run', () => {
      const inputs = {};
      for (let i = 0; i < corpus.length; i += 1) {
        const current = corpus[i];
        const keys = Object.keys(current.input);
        for (let j = 0; j < keys.length; j += 1) {
          inputs[keys[j]] = 1;
        }
      }
      const perceptron = new Perceptron({
        feature: 'birthday',
        features: Object.keys(inputs),
      });
      for (let i = 0; i < 64; i += 1) {
        for (let j = 0; j < corpus.length; j += 1) {
          const current = corpus[j];
          if (!current.keys) {
            current.keys = Object.keys(current.input);
          }
          perceptron.calculateDeltas(current, i);
        }
      }
      const actual = perceptron.run({ when: 1, birthday: 1 });
      expect(actual).toBeGreaterThan(0.75);
    });

    test('If input does not contains words from training return 0', () => {
      const inputs = {};
      for (let i = 0; i < corpus.length; i += 1) {
        const current = corpus[i];
        const keys = Object.keys(current.input);
        for (let j = 0; j < keys.length; j += 1) {
          inputs[keys[j]] = 1;
        }
      }
      const perceptron = new Perceptron({
        feature: 'birthday',
        features: Object.keys(inputs),
      });
      for (let i = 0; i < 64; i += 1) {
        for (let j = 0; j < corpus.length; j += 1) {
          const current = corpus[j];
          if (!current.keys) {
            current.keys = Object.keys(current.input);
          }
          perceptron.calculateDeltas(current, i);
        }
      }
      const actual = perceptron.run({ something: 1, else: 1 });
      expect(actual).toEqual(0);
    });

    test('If other words activated, return 0', () => {
      const inputs = {};
      for (let i = 0; i < corpus.length; i += 1) {
        const current = corpus[i];
        const keys = Object.keys(current.input);
        for (let j = 0; j < keys.length; j += 1) {
          inputs[keys[j]] = 1;
        }
      }
      const perceptron = new Perceptron({
        feature: 'birthday',
        features: Object.keys(inputs),
      });
      for (let i = 0; i < 64; i += 1) {
        for (let j = 0; j < corpus.length; j += 1) {
          const current = corpus[j];
          if (!current.keys) {
            current.keys = Object.keys(current.input);
          }
          perceptron.calculateDeltas(current);
        }
      }
      const actual = perceptron.run({ who: 1, developed: 1, you: 1, date: 0 });
      expect(actual).toEqual(0);
    });
  });
});
