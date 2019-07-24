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

const BaseNLU = require('./base-nlu');
const BinaryNeuralNetworkClassifier = require('../classifiers/binary-neural-network-classifier');

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
   * Train the classifier
   */
  async train() {
    const mustTrain = this.isEditing ? this.endEdit() : true;
    if (!mustTrain) {
      return false;
    }
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
      return true;
    }
    return false;
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
}

BaseNLU.classes.BinaryNeuralNetworkNLU = BinaryNeuralNetworkNLU;

module.exports = BinaryNeuralNetworkNLU;
