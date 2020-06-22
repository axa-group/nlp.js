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

const { NeuralNetwork } = require('../src');
const corpus = require('./corpus.json');

describe('Neural Network', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const net = new NeuralNetwork();
      expect(net).toBeDefined();
    });

    test('If log setting is true should create a log function', () => {
      const net = new NeuralNetwork({ log: true });
      expect(typeof net.logFn).toEqual('function');
    });

    test('A log function can be provided', () => {
      const net = new NeuralNetwork({
        log: () => {
          net.logCalls = (net.logCalls || 0) + 1;
        },
      });
      expect(typeof net.logFn).toEqual('function');
    });
  });

  describe('Train', () => {
    test('Train and run', async () => {
      const net = new NeuralNetwork();
      await net.train(corpus);
      const actual = net.run({ when: 1, birthday: 1 });
      expect(actual.who).toEqual(0);
      expect(actual.developer).toEqual(0);
      expect(actual.birthday).toBeGreaterThan(0.75);
    });
    test('Train and run with fixed error', async () => {
      const net = new NeuralNetwork({
        fixedError: true,
      });
      await net.train(corpus);
      const actual = net.run({ when: 1, birthday: 1 });
      expect(actual.who).toEqual(0);
      expect(actual.developer).toEqual(0);
      expect(actual.birthday).toBeGreaterThan(0.75);
    });
    test('Train process can be logged', async () => {
      const net = new NeuralNetwork({ log: true });
      await net.train(corpus);
      const actual = net.run({ when: 1, birthday: 1 });
      expect(actual.who).toEqual(0);
      expect(actual.developer).toEqual(0);
      expect(actual.birthday).toBeGreaterThan(0.75);
    });
    test('Can be trained with none feature', async () => {
      const net = new NeuralNetwork();
      await net.train([
        ...corpus,
        { input: { nonefeature: 1 }, output: { None: 1 } },
      ]);
      const actual = net.run({ when: 1, birthday: 1 });
      expect(actual.who).toEqual(0);
      expect(actual.developer).toEqual(0);
      expect(actual.birthday).toBeGreaterThan(0.75);
    });
    test('If run is called without train return undefined', () => {
      const net = new NeuralNetwork();
      const actual = net.run({ when: 1, birthday: 1 });
      expect(actual).toBeUndefined();
    });
  });

  describe('Import and export', () => {
    test('Should export and import', async () => {
      const net = new NeuralNetwork();
      await net.train(corpus);
      const json = net.toJSON();
      const net2 = new NeuralNetwork();
      net2.fromJSON(json);
      const actual = net2.run({ when: 1, birthday: 1 });
      expect(actual.who).toEqual(0);
      expect(actual.developer).toEqual(0);
      expect(actual.birthday).toBeGreaterThan(0.75);
    });
  });

  describe('Explain', () => {
    test('explain', async () => {
      const net = new NeuralNetwork();
      await net.train(corpus);
      const explanation = net.explain({ when: 1, birthday: 1 }, 'birthday');
      expect(explanation.weights).toBeDefined();
      expect(explanation.weights.when).toEqual(4.578855037689209);
      expect(explanation.weights.birthday).toEqual(3.949134349822998);
      expect(explanation.bias).toEqual(1.4713854180518258);
    });
  });
});
