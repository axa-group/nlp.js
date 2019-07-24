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
 * Classifier using Binary Relevance Neural Network
 */
class BinaryNeuralNetworkClassifier extends Classifier {
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
        learningRate: 0.1,
        errorThresh: 0.0005,
      };
    }
    this.totalTimeout = this.settings.totalTimeout || 2 * 60 * 1000;
    this.labelTimeout = this.settings.labelTimeout;
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
      if (this.labelTimeout && this.labelTimeout > 0) {
        if (this.totalTimeout && this.totalTimeout > 0) {
          const partialTimeout = this.totalTimeout / this.labels.length;
          this.settings.config.timeout = Math.min(
            this.totalTimeout,
            partialTimeout
          );
        }
      } else if (this.totalTimeout && this.totalTimeout > 0) {
        this.settings.config.timeout = this.totalTimeout / this.labels.length;
      }
      this.classifierMap[label] = new NeuralNetwork(this.settings.config);
    }
  }

  /**
   * Train the classifier given a dataset.
   * @param {Object} dataset Dataset with features and outputs.
   */
  async trainBatch(dataset) {
    const datasetMap = {};
    dataset.forEach(item => this.addTrainer(item.output));
    dataset.forEach(item => {
      this.labels.forEach(label => {
        if (!datasetMap[label]) {
          datasetMap[label] = [];
        }
        const obj = {
          input: item.input,
          output: {},
        };
        obj.output[item.output === label ? 'true' : 'false'] = 1;
        datasetMap[label].push(obj);
      });
    });
    const promises = Object.keys(datasetMap).map(label =>
      this.classifierMap[label].train(datasetMap[label])
    );
    return Promise.all(promises);
  }

  /**
   * Given a sample, return the classification.
   * @param {Object} sample Input sample.
   * @returns {Object} Classification output.
   */
  classify(sample) {
    const scores = [];
    if (Object.keys(sample).length === 0) {
      this.labels.forEach(label => {
        scores.push({ label, value: 0.5 });
      });
    } else {
      Object.keys(this.classifierMap).forEach(label => {
        const score = this.classifierMap[label].run(sample);
        scores.push({ label, value: score.true });
      });
    }
    scores.sort((x, y) => y.value - x.value);
    return scores;
  }

  /**
   * Given an observation and an array for inserting the results,
   * it calculates the score of the observation for each of the classifications
   * and fills the array with the result objects.
   * @param {Object} srcObservation Source observation.
   * @param {Object[]} classifications Array of classifications.
   * @memberof BinaryNeuralNetworkClassifier
   */
  classifyObservation(observation, classifications) {
    const scores = [];
    if (Object.keys(observation).length === 0) {
      this.labels.forEach(label => {
        scores.push({ label, value: 0.5 });
      });
    } else {
      Object.keys(this.classifierMap).forEach(label => {
        const score = this.classifierMap[label].run(observation);
        scores.push({ label, value: score.true });
      });
    }
    const sortedScores = scores.sort((x, y) => y.value - x.value);
    sortedScores.forEach(x => classifications.push(x));
  }

  /**
   * Clone the object properties.
   * @returns {Object} Cloned object.
   */
  toObj() {
    const result = {};
    result.className = this.constructor.name;
    result.settings = this.settings;
    result.classifierMap = {};
    Object.keys(this.classifierMap).forEach(key => {
      result.classifierMap[key] = this.classifierMap[key].toJSON();
    });
    result.labels = this.labels;
    return result;
  }

  /**
   * Fills the instance from another object.
   * @param {Object} obj Source object.
   */
  fromObj(obj) {
    this.settings = obj.settings;
    this.labels = obj.labels;
    Object.keys(obj.classifierMap).forEach(label => {
      this.addTrainer(label);
      this.classifierMap[label].fromJSON(obj.classifierMap[label]);
    });
  }
}

Classifier.classes.BinaryNeuralNetworkClassifier = BinaryNeuralNetworkClassifier;

module.exports = BinaryNeuralNetworkClassifier;
