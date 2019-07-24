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
   * @returns {Matrix} Hypothesis result.
   */
  static hypothesis(theta, observations) {
    return observations.multiply(theta, Mathops.sigmoid);
  }

  /**
   * Cost function
   * @param {Matrix} theta Theta matrix.
   * @param {Matrix} observations Observations.
   * @param {Matrix} classifications Classification matrix.
   * @param {Matrix} srcHypothesis Hypothesis. If not provided is calculated.
   * @return {number} Calculated cost based on the hypothesis.
   */
  static cost(theta, observations, classifications, srcHypothesis) {
    const hypothesis = srcHypothesis || Mathops.hypothesis(theta, observations);
    const ones = Vector.one(observations.rowCount());
    const costOne = Vector.zero(observations.rowCount())
      .subtract(classifications)
      .elementMultiply(hypothesis.log());
    const costZero = ones
      .subtract(classifications)
      .elementMultiply(ones.subtract(hypothesis).log());
    return (1 / observations.rowCount()) * costOne.subtract(costZero).sum();
  }

  /**
   * Descend the gradient based on the cost function.
   * @param {Matrix} srcTheta Theta matrix.
   * @param {Vector} srcExamples Examples.
   * @param {Matrix} classifications Classification matrix.
   * @param {Object} srcOptions Settings for the descend.
   */
  static descendGradient(srcTheta, srcExamples, classifications, srcOptions) {
    return new Promise((resolve, reject) => {
      const options = srcOptions || {};
      const maxIterationFactor =
        options.maxIterationFactor || Mathops.maxIterationFactor;
      const learningRateStart =
        options.learningRateStart || Mathops.learningRateStart;
      const maxCostDelta = options.maxCostDelta || Mathops.maxCostDelta;
      const learningRateDivisor =
        options.learningRateDivisor || Mathops.learningRateDivisor;
      const maxIterations = maxIterationFactor * srcExamples.rowCount();
      const examples = Matrix.one(srcExamples.rowCount(), 1).augment(
        srcExamples
      );
      const examplesRowCountInverse = 1 / examples.rowCount();
      const transposed = examples.transpose();
      let learningRate = learningRateStart;
      let multiplyFactor = examplesRowCountInverse * learningRate;
      let learningRateFound = false;
      let theta = srcTheta.augment([0]);
      while (!learningRateFound || learningRate === 0) {
        let i = 0;
        let lastCost = null;
        while (i < maxIterations) {
          const hypothesis = Mathops.hypothesis(theta, examples);
          theta = theta.subtract(
            transposed
              .multiply(hypothesis.subtract(classifications))
              .multiply(multiplyFactor)
          );
          const currentCost = Mathops.cost(
            theta,
            examples,
            classifications,
            hypothesis
          );
          i += 1;
          if (lastCost) {
            if (currentCost >= lastCost) {
              break;
            }
            learningRateFound = true;
            if (lastCost - currentCost < maxCostDelta) {
              break;
            }
          }
          if (i >= maxIterations) {
            return reject(new Error('Unable to find minimum'));
          }
          lastCost = currentCost;
        }
        learningRate /= learningRateDivisor;
        multiplyFactor = examplesRowCountInverse * learningRate;
      }
      return resolve(theta.chomp(1));
    });
  }

  /**
   * Return a vector representing x.
   * @param {Number[]} x Input array.
   * @returns {Vector} Vector representing x.
   */
  static asVector(x) {
    return new Vector(x);
  }

  /**
   * Returns a matrix representing x.
   * @param {Number[][]} x Input array.
   * @return {Matrix} Matrix representing x.
   */
  static asMatrix(x) {
    return new Matrix(x);
  }

  /**
   * Function returning 0.
   * @returns {number} Returns 0.
   */
  static zero() {
    return 0;
  }

  /**
   * Compute the thetas of the examples and classifications.
   * @param {Vector} srcExamples Vector of examples.
   * @param {Matrix} srcClassifications Matrix of classifications.
   */
  static async computeThetas(srcExamples, srcClassifications) {
    if (!srcClassifications || srcClassifications.length === 0) {
      return [];
    }
    const result = [];

    await Promise.all(
      srcClassifications[0].map(async (_, i) => {
        const item = await Mathops.computeThetasHelper(
          srcExamples,
          srcClassifications,
          i
        );
        result.push(item);
      })
    );

    return result;
  }

  static async computeThetasHelper(srcExamples, srcClassifications, num) {
    const examples = this.asMatrix(srcExamples);
    const classifications = this.asMatrix(srcClassifications);
    const row = examples.row(0);
    const theta = row.map(this.zero);
    return this.descendGradient(theta, examples, classifications.column(num));
  }
}

Mathops.learningRateStart = 3;
Mathops.learningRateDivisor = 3;
Mathops.maxIterationFactor = 500;
Mathops.maxCostDelta = 0.0001;

module.exports = Mathops;
