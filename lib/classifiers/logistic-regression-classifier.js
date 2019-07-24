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
 * Class for a Logistic Regression Classifier.
 */
class LogisticRegressionClassifier extends Classifier {
  /**
   * Train the logistic regression clasifier, that means
   * that it calculates the thetas that relates all the features
   * with the classifications, so when a new vector of features
   * is the input to classify, these thetas are the weights for the
   * calculation of the scores of each classification.
   */
  async train() {
    const observations = [];
    const classifications = this.createClassificationMatrix();
    let currentObservation = 0;
    for (let i = 0, li = this.labels.length; i < li; i += 1) {
      const classificationObservations = this.observations[this.labels[i]];
      for (let j = 0, lj = classificationObservations.length; j < lj; j += 1) {
        observations.push(classificationObservations[j]);
        classifications[currentObservation][i] = 1;
        currentObservation += 1;
      }
    }
    this.theta = await Mathops.computeThetas(observations, classifications);
  }

  /**
   * Given an observation vector and the index of one of the classifications,
   * it returns an object that contains the label of the classification and
   * the score of the vector for this classification.
   * @param {Vector} observation Observation vector.
   * @param {Number} indexClassification Index of the classification.
   */
  newClassification(observation, indexClassification) {
    return {
      label: this.labels[indexClassification],
      value: Mathops.sigmoid(observation.dot(this.theta[indexClassification])),
    };
  }

  /**
   * Given an observation and an array for inserting the results,
   * it calculates the score of the observation for each of the classifications
   * and fills the array with the result objects.
   * @param {Object} srcObservation Source observation.
   * @param {Object[]} classifications Array of classifications.
   */
  classifyObservation(srcObservation, classifications) {
    const observation = Mathops.asVector(srcObservation);
    if (this.theta) {
      for (let i = 0; i < this.theta.length; i += 1) {
        classifications.push(this.newClassification(observation, i));
      }
    }
  }

  /**
   * Clone the object properties.
   * @returns {Object} Cloned object.
   */
  toObj() {
    const result = {};
    result.className = this.constructor.name;
    result.observations = this.observations;
    result.labels = this.labels;
    result.classifications = this.classifications;
    result.observationCount = this.observationCount;
    result.theta = this.theta;
    return result;
  }

  /**
   * Fills the instance from another object.
   * @param {Object} obj Source object.
   */
  fromObj(obj) {
    this.labels = obj.labels;
    this.classifications = obj.classifications;
    this.observationCount = obj.observationCount;
    this.theta = obj.theta;
    this.observations = obj.observations;
  }
}

Classifier.classes.LogisticRegressionClassifier = LogisticRegressionClassifier;

module.exports = LogisticRegressionClassifier;
