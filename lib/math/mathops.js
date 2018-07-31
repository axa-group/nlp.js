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

const Vector = require('./vector');
const Matrix = require('./matrix');

class Mathops {
  /**
   * Calculates the sigmoid defined as:
   * S(x) = 1/(1+e^(-x))
   * @param {Number} x Input value.
   * @returns {Number} Sigmoid of x.
   */
  static sigmoid(x) {
    let result = 1.0 / (1 + Math.exp(-x));
    if (result === 1) {
      result = 0.99999999999999;
    } else if (result === 0) {
      result = 1e-14;
    }
    return result;
  }

  /**
   * Calculate the hypothesis from the observations.
   * @param {Matrix} theta Theta matrix.
   * @param {Matrix} observations Observations.
   */
  static hypothesis(theta, observations) {
    return observations.multiply(theta).map(Mathops.sigmoid);
  }

  static cost(theta, observations, classifications) {
    const hypothesis = Mathops.hypothesis(theta, observations);
    const ones = Vector.one(observations.rowCount());
    const costOne = Vector.zero(observations.rowCount()).subtract(classifications)
      .elementMultiply(hypothesis.log());
    const costZero = ones.subtract(classifications)
      .elementMultiply(ones.subtract(hypothesis).log());
    return (1 / observations.rowCount()) * costOne.subtract(costZero).sum();
  }

  static descendGradient(srcTheta, srcExamples, classifications) {
    const maxIt = 500 * srcExamples.rowCount();
    let last;
    let current;
    let learningRate = 3;
    let learningRateFound = false;
    const examples = Matrix.one(srcExamples.rowCount(), 1).augment(srcExamples);
    let theta = srcTheta.augment([0]);
    while (!learningRateFound) {
      let i = 0;
      last = null;
      while (i < maxIt) {
        const hypothesisResult = Mathops.hypothesis(theta, examples);
        theta = theta.subtract(examples.transpose()
          .multiply(hypothesisResult.subtract(classifications))
          .multiply(1 / examples.rowCount())
          .multiply(learningRate));
        current = Mathops.cost(theta, examples, classifications);
        i += 1;
        if (last) {
          if (current >= last) {
            break;
          }
          learningRateFound = true;
          if (last - current < 0.0001) {
            break;
          }
        }
        if (i >= maxIt) {
          throw new Error('Unable to find minimum');
        }
        last = current;
      }
      learningRate /= 3;
    }
    return theta.chomp(1);
  }

  static asVector(x) {
    return new Vector(x);
  }

  static asMatrix(x) {
    return new Matrix(x);
  }

  static zero() {
    return 0;
  }

  static computeThetas(srcExamples, srcClassifications) {
    const examples = Mathops.asMatrix(srcExamples);
    if (!srcClassifications || srcClassifications.length === 0) {
      return [];
    }
    const classifications = Mathops.asMatrix(srcClassifications);
    const numClassifications = srcClassifications[0].length;
    const result = [];
    for (let i = 0; i < numClassifications; i += 1) {
      const row = examples.row(0);
      const theta = row.map(Mathops.zero);
      result.push(Mathops.descendGradient(theta, examples, classifications.column(i)));
    }
    return result;
  }
}

module.exports = Mathops;
