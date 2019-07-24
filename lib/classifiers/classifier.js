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

/**
 * Class for a generic classifier.
 * This is an abstract class that must be implemented by subclasses that
 * contains the real classifier algorithm.
 */
class Classifier {
  /**
   * Constructor of the class.
   * Initialize the basic properties and structure of any classifier.
   * @param {Object} settings Settings for initializing the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.clear();
  }

  /**
   * Clears the content of the instance.
   * This is done by initializing the observations object, the labels array
   * and the observation count.
   */
  clear() {
    this.observations = {};
    this.labels = [];
    this.observationCount = 0;
  }

  /**
   * Adds a new label to the observation tree. If the label already exists,
   * return the existing one without creating it again.
   * @param {String} label Label to be created or getted.
   * @returns {String[]} List of observations assigned to this label.
   */
  addLabel(label) {
    if (!this.observations[label]) {
      this.observations[label] = [];
      this.labels.push(label);
    }
    return this.observations[label];
  }

  /**
   * Adds a new observation to the classifier.
   * @param {String} observation Observation to be added.
   * @param {String} label Label of the observation.
   */
  addObservation(observation, label) {
    const labelObservations = this.addLabel(label);
    labelObservations.push(observation);
    this.observationCount += 1;
  }

  /**
   * Removes an observation from the observation list of a label.
   * @param {String} observation Observation to be removed.
   * @param {String} label Label where we want the observation to be removed.
   */
  removeObservationByLabel(observation, label) {
    if (this.observations[label]) {
      const labelObservations = this.observations[label];
      const index = labelObservations.indexOf(observation);
      if (index !== -1) {
        labelObservations.splice(index, 1);
        if (labelObservations.length === 0) {
          delete this.observations[label];
          this.labels.splice(this.labels.indexOf(label), 1);
        }
        this.observationCount -= 1;
      }
    }
  }

  /**
   * Removes an observation. The label of the observation can be passed or
   * can be omitted. When omitted, it loops over all labels tryin to remove
   * the given observation.
   * @param {String} observation Observation to be removed.
   * @param {String} label Label of the observation, or undefined to iterate over
   *                  all labels.
   */
  removeObservation(observation, label) {
    if (label) {
      this.removeObservationByLabel(observation, label);
    } else {
      for (let i = 0; i < this.labels.length; i += 1) {
        this.removeObservationByLabel(observation, this.labels[i]);
      }
    }
  }

  /**
   * Iterate all the observations to calculate the total observation count.
   */
  recalculateObservationCount() {
    let count = 0;
    for (let i = 0, l = this.labels.length; i < l; i += 1) {
      if (this.observations[this.labels[i]]) {
        count += this.observations[this.labels[i]].length;
      }
    }
    this.observationCount = count;
  }

  /**
   * Classify one observation.
   */
  classifyObservation() {
    throw new Error(
      'This method is not implemented. Must be implemented by child classes.'
    );
  }

  /**
   * Get all the labels and score for each label from one observation.
   * @param {String} observation Observation to be classified.
   * @returns {Object[]} Sorted array of classifications, that means label and the score.
   */
  getClassifications(observation) {
    const labels = [];
    this.classifyObservation(observation, labels);
    return labels.sort((x, y) => y.value - x.value);
  }

  /**
   * Given an observation, get the label and score of the best classification.
   * @param {String} observation Observation to be classified.
   * @returns {Object} Best classification of the observation.
   */
  getBestClassification(observation) {
    const classifications = this.getClassifications(observation);
    if (!classifications || classifications.length === 0) {
      return undefined;
    }
    return classifications[0];
  }

  /**
   * Creates a matrix filled with zeros, that relate every single observation
   * with every single label.
   * @returns {Number[][]} A bidimensional array where x is the observation
   * and y is the label, filled to zeros.
   */
  createClassificationMatrix() {
    const result = [];
    for (let i = 0; i < this.observationCount; i += 1) {
      const classification = [];
      result.push(classification);
      for (let j = 0, l = this.labels.length; j < l; j += 1) {
        classification.push(0);
      }
    }
    return result;
  }

  /**
   * Given an obj with className and properties, return the correct instance
   * filled with the properties information.
   * @param {Object} obj Source object.
   * @returns {Object} Instance of a classifier.
   */
  static fromObj(obj) {
    const instance = new Classifier.classes[obj.className]();
    instance.fromObj(obj);
    return instance;
  }
}

Classifier.classes = {};

module.exports = Classifier;
