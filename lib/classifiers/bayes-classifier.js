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

const Classifier = require('./classifier');
const { Mathops } = require('../math');

/**
 * Class for a Bayes Classifier.
 */
class BayesClassifier extends Classifier {
  /**
   * Sets the smoothing
   * @param {number} newSmoothing New smoothing value
   */
  setSmoothing(newSmoothing) {
    this.smoothing = newSmoothing;
  }

  /**
   * Calculate the probability of a class (label) given an observation.
   *
   * @param {Vector} observation Observation vector.
   * @param {String} label Label of the class.
   * @returns {Number} Value of probability of class.
   * @memberof BayesClassifier
   */
  getProbabilityOfClass(observation, label) {
    const smoothing = this.smoothing || 1.0;
    let probability = 0;

    const classTotal = this.observations[label].length;

    observation.forEach((feature, index) => {
      if (feature) {
        let count = 0;
        this.observations[label].forEach(classObservation => {
          count += classObservation[index];
        });
        const value = count || smoothing;
        probability += Math.log(value / classTotal);
      }
    });
    probability = (classTotal / this.observationCount) * Math.exp(probability);
    return probability;
  }

  /**
   * Given an observation and an array for inserting the results,
   * it calculates the score of the observation for each of the classifications
   * and fills the array with the result objects.
   * @param {Object} srcObservation Source observation.
   * @param {Object[]} classifications Array of classifications.
   * @memberof BayesClassifier
   */
  classifyObservation(srcObservation, classifications) {
    const observation = Mathops.asVector(srcObservation);
    Object.keys(this.observations).forEach(label => {
      const value = this.getProbabilityOfClass(observation, label);
      classifications.push({
        label,
        value,
      });
    });
  }

  train() {
    // Do nothing
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
    result.observations = this.observations;
    result.smoothing = this.smoothing;
    result.observationCount = this.observationCount;
    return result;
  }

  /**
   * Fills the instance from another object.
   * @param {Object} obj Source object.
   */
  fromObj(obj) {
    this.settings = obj.settings;
    this.labels = obj.labels;
    this.observations = obj.observations;
    this.smoothing = obj.smoothing;
    this.observationCount = obj.observationCount;
  }
}

Classifier.classes.BayesClassifier = BayesClassifier;

module.exports = BayesClassifier;
