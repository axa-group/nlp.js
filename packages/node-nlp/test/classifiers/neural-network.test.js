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

const { NeuralNetwork } = require('../../src');

const corpus = [
  {
    input: { who: 1, are: 1, you: 1 },
    output: { who: 1 },
  },
  {
    input: { say: 1, about: 1, you: 1 },
    output: { who: 1 },
  },
  {
    input: { why: 1, are: 1, you: 1, here: 1 },
    output: { who: 1 },
  },
  {
    input: { who: 1, developed: 1, you: 1 },
    output: { developer: 1 },
  },
  {
    input: { who: 1, is: 1, your: 1, developer: 1 },
    output: { developer: 1 },
  },
  {
    input: { who: 1, do: 1, you: 1, work: 1, for: 1 },
    output: { developer: 1 },
  },
  {
    input: { when: 1, is: 1, your: 1, birthday: 1 },
    output: { birthday: 1 },
  },
  {
    input: { when: 1, were: 1, you: 1, borned: 1 },
    output: { birthday: 1 },
  },
  {
    input: { date: 1, of: 1, your: 1, birthday: 1 },
    output: { birthday: 1 },
  },
];

describe('Neural Network', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const net = new NeuralNetwork();
      expect(net).toBeDefined();
    });
    test('It should fill default parameters', () => {
      const net = new NeuralNetwork();
      expect(net.perceptronSettings).toBeDefined();
      expect(net.perceptronSettings.iterations).toEqual(20000);
      expect(net.perceptronSettings.errorThresh).toEqual(0.00005);
      expect(net.perceptronSettings.deltaErrorThresh).toEqual(0.000001);
      expect(net.perceptronSettings.learningRate).toEqual(0.7);
      expect(net.perceptronSettings.momentum).toEqual(0.5);
      expect(net.perceptronSettings.alpha).toEqual(0.08);
    });

    test('Parameters can be provided', () => {
      const options = {
        iterations: 10000,
        errorThresh: 0.0005,
        deltaErrorThresh: 0.0000003,
        learningRate: 0.1,
        momentum: 0.5,
        alpha: 0.01,
      };
      const net = new NeuralNetwork(options);
      expect(net.perceptronSettings).toBeDefined();
      expect(net.perceptronSettings.iterations).toEqual(options.iterations);
      expect(net.perceptronSettings.errorThresh).toEqual(options.errorThresh);
      expect(net.perceptronSettings.deltaErrorThresh).toEqual(
        options.deltaErrorThresh
      );
      expect(net.perceptronSettings.learningRate).toEqual(options.learningRate);
      expect(net.perceptronSettings.momentum).toEqual(options.momentum);
      expect(net.perceptronSettings.alpha).toEqual(options.alpha);
    });
  });

  describe('Initialize', () => {
    test('It should initialize based on the sizes provided', () => {
      const net = new NeuralNetwork();
      net.sizes = [2, 4];
      net.initialize();
      expect(net.perceptrons).toHaveLength(4);
      expect(net.inputs).toEqual([]);
      expect(net.outputs).toEqual([]);
    });
  });

  describe('Is Runnable', () => {
    test('A net without sizes cannot be runnable', () => {
      const net = new NeuralNetwork();
      const actual = net.isRunnable;
      expect(actual).toBeFalsy();
    });
    test('A net with sizes must be runnable', () => {
      const net = new NeuralNetwork();
      net.sizes = [2, 4];
      const actual = net.isRunnable;
      expect(actual).toBeTruthy();
    });
  });

  describe('Train', () => {
    test('Network can be trained', async () => {
      const net = new NeuralNetwork();
      const status = net.train(corpus);
      expect(status.iterations).toBeLessThan(100);
      expect(status.error).toBeLessThan(0.005);
      expect(status.deltaError).toBeGreaterThan(0.0000001);
    });
  });

  describe('Run', () => {
    test('If the network is not runnable then return undefined', () => {
      const net = new NeuralNetwork();
      const actual = net.run(corpus[0].input);
      expect(actual).toBeUndefined();
    });
  });

  describe('Adjust', () => {
    test('It should adjust numbers to the number of decimals', () => {
      const net = new NeuralNetwork({ maxDecimals: 4 });
      const actual = net.adjust(0.123456789);
      expect(actual).toEqual(0.1235);
    });
  });

  describe('To JSON', () => {
    test('If is not runnable return perceptronSettings', () => {
      const net = new NeuralNetwork();
      const actual = net.toJSON();
      const expected = {
        perceptronSettings: {},
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('From JSON', () => {
    test('If the JSON does not contains training, recover only training ops', () => {
      const net = new NeuralNetwork();
      const perceptronSettings = {
        iterations: 10000,
        errorThresh: 0.001,
        deltaErrorThresh: 0.0000002,
        learningRate: 0.1,
        momentum: 0.5,
        alpha: 0.08,
        fixedError: false,
        log: false,
      };
      net.fromJSON({
        sizes: undefined,
        layers: [],
        perceptronSettings,
      });
      expect(net.perceptronSettings).toEqual(perceptronSettings);
    });
  });
});
