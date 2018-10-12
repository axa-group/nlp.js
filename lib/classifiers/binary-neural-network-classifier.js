/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const { NeuralNetwork } = require('brain.js');

/**
 * Classifier using Brain.js Neural Network
 */
class BinaryNeuralNetworkClassifier {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    if (!this.settings.config) {
      this.settings.config = {
        activation: 'leaky-relu',
        hiddenLayers: [],
        learningRate: 0.1,
        errorThresh: 0.0005,
      };
    }
    this.labels = [];
    this.classifierMap = {};
  }

  /**
   * If a trainer does not exists for a label, create it.
   * @param {*} label
   */
  addTrainer(label) {
    if (!this.classifierMap[label]) {
      this.labels.push(label);
      this.classifierMap[label] = new NeuralNetwork(this.settings.config);
    }
  }

  /**
   * Train the classifier given a dataset.
   * @param {Object} dataset Dataset with features and outputs.
   */
  trainBatch(dataset) {
    const datasetMap = {};
    dataset.forEach(item => {
      const label = item.output;
      this.addTrainer(label);
      if (!datasetMap[label]) {
        datasetMap[label] = [];
      }
      datasetMap[label].push({
        input: item.input,
        output: [1],
      });
    });
    dataset.forEach(item => {
      this.labels.forEach(label => {
        if (item.output !== label) {
          datasetMap[label].push({
            input: item.input,
            output: [0],
          });
        }
      });
    });
    Object.keys(datasetMap).forEach(label => {
      this.classifierMap[label].train(datasetMap[label]);
    });
  }

  /**
   * Given a sample, return the classification.
   * @param {Object} sample Input sample.
   * @returns {Object} Classification output.
   */
  classify(sample) {
    const scores = [];
    Object.keys(this.classifierMap).forEach(label => {
      const score = this.classifierMap[label].run(sample);
      scores.push({ label, value: score[0] });
    });
    return scores.sort((x, y) => y.value - x.value);
  }
}

module.exports = BinaryNeuralNetworkClassifier;
