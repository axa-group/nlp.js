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

const SimilarSearch = require('./similar-search');

/**
 * Class for do Spell Checking over a dictionary of features
 */
class SpellCheck {
  /**
   * Constructor of the class
   * @param {object} features Hashmap with the features
   */
  constructor(features) {
    this.similarSearch = new SimilarSearch();
    this.features = features;
    this.featuresList = Object.keys(this.features);
    this.featuresByLength = {};
    for (let i = 0; i < this.featuresList.length; i += 1) {
      const current = this.featuresList[i];
      if (!this.featuresByLength[current.length]) {
        this.featuresByLength[current.length] = [];
      }
      this.featuresByLength[current.length].push(current);
    }
  }

  /**
   * Check the token agains compatible list of features by distance
   * @param {string} token Token to be checked
   * @param {number} distance Max distance
   */
  checkToken(token, distance) {
    if (this.features[token]) {
      return token;
    }
    if (token.length < 4) {
      return token;
    }
    let best;
    let distanceBest = Infinity;
    for (
      let i = token.length - distance - 1;
      i <= token.length + distance;
      i += 1
    ) {
      const currentFeatures = this.featuresByLength[i + 1];
      if (currentFeatures) {
        for (let j = 0; j < currentFeatures.length; j += 1) {
          const feature = currentFeatures[j];
          const similarity = this.similarSearch.getSimilarity(token, feature);
          if (similarity <= distance) {
            if (similarity < distanceBest) {
              best = feature;
              distanceBest = similarity;
            } else if (similarity === distanceBest) {
              if (
                Math.abs(best.length - token.length) >
                Math.abs(feature.length - token.length)
              ) {
                best = feature;
                distanceBest = similarity;
              }
            }
          }
        }
      }
    }
    return best || token;
  }

  check(tokens, distance) {
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      result.push(this.checkToken(tokens[i], distance));
    }
    return result;
  }
}

module.exports = SpellCheck;
