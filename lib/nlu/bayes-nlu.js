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
const BayesClassifier = require('../classifiers/bayes-classifier');

/**
 * Class for the Logistic Regression NLU
 */
class BayesNLU extends BaseNLU {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for this instance.
   */
  constructor(settings) {
    super(settings);
    this.classifier = this.settings.classifier || new BayesClassifier();
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
    const keys = Object.keys(this.features);
    return keys.map(key => (tokens.indexOf(key) > -1 ? 1 : 0));
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
    this.docs.forEach(doc => {
      this.classifier.addObservation(
        this.textToFeatures(doc.tokens),
        doc.intent
      );
    });
    if (this.classifier.observationCount > 0) {
      await this.classifier.train();
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
      this.classifier.getClassifications(
        this.textToFeatures(this.tokenizeAndStem(utterance))
      )
    );
  }
}

BaseNLU.classes.BayesNLU = BayesNLU;

module.exports = BayesNLU;
