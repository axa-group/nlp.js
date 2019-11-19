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

const { Clonable } = require('@nlpjs/core');
const defaultSettings = require('./default-settings.json');

/**
 * Class for a Perceptron
 */
class Perceptron extends Clonable {
  /**
   * Constructor of the class
   * @param {object} settings Settings for the instance
   */
  constructor(settings) {
    super(settings);
    this.applySettings(this, defaultSettings);
    this.bias = 0;
    this.weights = {};
    this.changes = {};
    for (let i = 0; i < this.features.length; i += 1) {
      this.weights[this.features[i]] = 0;
      this.changes[this.features[i]] = 0;
    }
    this.activation = x => (x < 0 ? 0 : this.alpha * x);
    this.jsonExport = {
      features: false,
      log: false,
      iterations: false,
      errorThresh: false,
      fixedError: false,
      deltaErrorThresh: false,
      learningRate: false,
      momentum: false,
      alpha: false,
      changes: false,
      activation: false,
      weights: (target, source, key, value) =>
        this.objToValues(value, this.features),
    };
    this.jsonImport = {
      weights: (target, source, key, value) =>
        this.valuesToObj(value, this.features),
    };
  }

  /**
   * Given an input, run the perceptron
   * @param {object} input
   * @param {*} srckeys
   */
  run(input, srckeys) {
    const { weights, bias } = this;
    let result = bias;
    let visited = false;
    const keys = srckeys || Object.keys(input);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (weights[key]) {
        if (input[key]) {
          result += input[key] * weights[key];
          if (!visited) {
            visited = true;
          }
        }
      }
    }
    return visited ? this.activation(result) : 0;
  }

  /**
   * Calculate the weights of this iteration
   * @param {object} current Current input
   * @param {number} iteration Current iteration
   */
  calculateDeltas(current, iteration = 0) {
    const { learningRate, alpha, momentum, changes, weights } = this;
    const decayLearningRate = learningRate / (1 + 0.001 * iteration);
    const { input, keys, output } = current;
    const actual = this.run(input, keys);
    const currentError = (output[this.feature] || 0) - actual;
    if (currentError) {
      const delta = (actual > 0 ? 1 : alpha) * currentError * decayLearningRate;
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const change = delta * input[key] + momentum * changes[key];
        changes[key] = change;
        weights[key] += change;
      }
      this.bias += delta;
    } else {
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const change = momentum * changes[key];
        changes[key] = change;
        weights[key] += change;
      }
    }
    return currentError;
  }
}

module.exports = Perceptron;
