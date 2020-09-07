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

const similarity = require('./similarity');

class SpellCheck {
  constructor(settings) {
    this.settings = settings || {};
    this.minLength = this.settings.minLength || 4;
    if (this.settings.features) {
      this.setFeatures(this.settings.features);
    } else {
      this.features = {};
      this.featuresByLength = {};
    }
  }

  setFeatures(features) {
    this.features = features;
    this.featuresByLength = {};
    this.featuresList = Object.keys(this.features);
    for (let i = 0; i < this.featuresList.length; i += 1) {
      const feature = this.featuresList[i];
      const { length } = feature;
      if (!this.featuresByLength[length]) {
        this.featuresByLength[length] = [];
      }
      this.featuresByLength[length].push(feature);
    }
  }

  checkToken(token, distance) {
    if (this.features[token]) {
      return token;
    }
    if (token.length < this.minLength) {
      return token;
    }
    let best;
    let distanceBest = Infinity;
    for (
      let i = token.length - distance - 1;
      i < token.length + distance;
      i += 1
    ) {
      const currentFeatures = this.featuresByLength[i + 1];
      if (currentFeatures) {
        for (let j = 0; j < currentFeatures.length; j += 1) {
          const feature = currentFeatures[j];
          const similar = similarity(token, feature);
          if (similar <= distance) {
            if (similar < distanceBest) {
              best = feature;
              distanceBest = similar;
            } else if (similar === distanceBest && best) {
              const la = Math.abs(best.length - token.length);
              const lb = Math.abs(feature.length - token.length);
              if (
                la > lb ||
                (la === lb && this.features[feature] > this.features[best])
              ) {
                best = feature;
                distanceBest = similar;
              }
            }
          }
        }
      }
    }
    return best || token;
  }

  check(tokens, distance = 1) {
    if (!Array.isArray(tokens)) {
      const keys = Object.keys(tokens);
      const processed = this.check(keys, distance);
      const obj = {};
      for (let i = 0; i < processed.length; i += 1) {
        obj[processed[i]] = tokens[keys[i]];
      }
      return obj;
    }
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      result.push(this.checkToken(tokens[i], distance));
    }
    return result;
  }
}

module.exports = SpellCheck;
