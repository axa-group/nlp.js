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

const NeuralNetwork = require('./neural-network');
const Classifier = require('./classifier');

/**
 * Classifier using Multilabel Neural Network
 */
class BrainClassifier extends Classifier {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    if (!this.settings.config) {
      this.settings.config = {
        activation: 'leaky-relu',
        hiddenLayers: [],
        iterations: 20000,
        learningRate: 0.7,
        errorThresh: 0.00005,
        momentum: 0.5,
        deltaErrorThresh: 0.000001,
        maxDecimals: 9,
        leakyReluAlpha: 0.08,
      };
    }
    this.settings.config.log = this.settings.log;
    this.settings.config.timeout = this.settings.timeout || 2 * 60 * 1000;
    this.labels = [];
    this.network = new NeuralNetwork(this.settings.config);
  }

  /**
   * Train the classifier given a dataset.
   * @param {Object} dataset Dataset with features and outputs.
   */
  async trainBatch(dataset, createNetwork = true) {
    if (createNetwork || !this.network) {
      this.network = new NeuralNetwork(this.settings.config);
    }
    const netDataset = [];
    dataset.forEach(item => {
      const netItem = {
        input: item.input,
        output: {},
      };
      netItem.output[item.output] = 1;
      netDataset.push(netItem);
    });
    return this.network.train(netDataset);
  }

  /**
   * Given a sample, return the classification.
   * @param {Object} sample Input sample.
   * @returns {Object} Classification output.
   */
  classify(sample) {
    const scores = [];
    if (Object.keys(sample).length > 0) {
      const result = this.network.run(sample);
      Object.keys(result).forEach(key => {
        scores.push({ label: key, value: result[key] });
      });
    }
    if (scores.length > 0) {
      scores.sort((x, y) => y.value - x.value);
      return scores;
    }
    return [{ label: 'None', value: 1 }];
  }

  /**
   * Given an observation and an array for inserting the results,
   * it calculates the score of the observation for each of the classifications
   * and fills the array with the result objects.
   * @param {Object} srcObservation Source observation.
   * @param {Object[]} classifications Array of classifications.
   */
  classifyObservation(observation, classifications) {
    const scores = [];
    if (Object.keys(observation).length > 0) {
      const result = this.network.isRunnable
        ? this.network.run(observation)
        : [];
      Object.keys(result).forEach(key => {
        scores.push({ label: key, value: result[key] });
      });
    }
    if (scores.length > 0) {
      scores.sort((x, y) => y.value - x.value);
      scores.forEach(x => classifications.push(x));
    } else {
      classifications.push({ label: 'None', value: 1 });
    }
  }

  /**
   * Clone the object properties.
   * @returns {Object} Cloned object.
   */
  toObj() {
    const result = {};
    result.className = this.constructor.name;
    result.settings = this.settings;
    result.labels = this.labels;
    result.network = this.network.toJSON();
    return result;
  }

  /**
   * Fills the instance from another object.
   * @param {Object} obj Source object.
   */
  fromObj(obj) {
    this.settings = obj.settings;
    this.labels = obj.labels;
    this.network.fromJSON(obj.network);
  }
}

Classifier.classes.BrainClassifier = BrainClassifier;

module.exports = BrainClassifier;
