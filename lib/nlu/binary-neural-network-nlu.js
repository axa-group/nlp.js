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

const BaseNLU = require('./base-nlu');
const BinaryNeuralNetworkClassifier = require('../classifiers/binary-neural-network-classifier');
const Classifier = require('../classifiers/classifier');

/**
 * Class for the Logistic Regression NLU
 */
class BinaryNeuralNetworkNLU extends BaseNLU {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    super(settings);
    this.classifier =
      this.settings.classifier || new BinaryNeuralNetworkClassifier();
  }

  /**
   * Given an utterance, tokenize and steam the utterance and convert it
   * to a vector of binary values, where each position is a feature (a word
   * stemmed) and the value means if the utterance has this feature.
   * The input utterance can be an string or an array of tokens.
   * @param {String} utterance Utterance to be converted to features vector.
   * @returns {Number[]} Features vector of the utterance.
   */
  textToFeatures(utterance) {
    const tokens = this.tokenizeAndStem(utterance);
    const result = {};
    tokens.forEach(key => {
      result[key] = 1;
    });
    return result;
  }

  /**
   * Train the classifier
   */
  async train() {
    this.classifier.clear();
    const input = [];
    this.docs.forEach(doc => {
      input.push({
        input: this.textToFeatures(doc.tokens),
        output: doc.intent,
      });
    });
    if (input.length > 0) {
      await this.classifier.trainBatch(input);
    }
  }

  /**
   * Get all the labels and score for each label from this utterance.
   * @param {String} utterance Utterance to be classified.
   * @returns {Object[]} Sorted array of classifications, with label and score.
   */
  getClassifications(utterance) {
    return this.normalizeNeural(
      this.classifier.getClassifications(this.textToFeatures(utterance))
    );
  }

  /**
   * Export as object
   */
  toObj() {
    const result = this.baseToObj();
    result.className = 'BinaryNeuralNetworkNLU';
    result.classifier = this.classifier.toObj();
    return result;
  }

  /**
   * Import from object
   * @param {Object} obj Source object
   */
  fromObj(obj) {
    this.baseFromObj(obj);
    this.classifier = Classifier.fromObj(obj.classifier);
  }
}

BaseNLU.classes.BinaryNeuralNetworkNLU = BinaryNeuralNetworkNLU;

module.exports = BinaryNeuralNetworkNLU;
