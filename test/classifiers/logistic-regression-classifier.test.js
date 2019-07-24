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

const { Classifier, LogisticRegressionClassifier } = require('../../lib');

function getClassifier2() {
  const classifier = new LogisticRegressionClassifier({});
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 0, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([0, 0, 0, 1, 1, 1], 'two');
  classifier.addObservation([0, 0, 0, 1, 0, 1], 'two');
  classifier.addObservation([0, 0, 0, 1, 1, 0], 'two');
  return classifier;
}

function addObservations3a(classifier) {
  classifier.addObservation([1, 1, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([1, 0, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 0, 0, 0, 0, 0, 0], 'one');
  classifier.addObservation([0, 0, 0, 1, 1, 1, 0, 0, 0], 'two');
  classifier.addObservation([0, 0, 0, 1, 0, 1, 0, 0, 0], 'two');
  classifier.addObservation([0, 0, 0, 1, 1, 0, 0, 0, 0], 'two');
}

function addObservations3b(classifier) {
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 1], 'three');
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 0, 1], 'three');
  classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 0], 'three');
}

function getClassifier3() {
  const classifier = new LogisticRegressionClassifier({});
  addObservations3a(classifier);
  addObservations3b(classifier);
  return classifier;
}

describe('Logistic Regression Classifier', () => {
  describe('Train', () => {
    test('Should create the theta', async () => {
      const classifier = getClassifier2();
      expect(classifier.theta).toBeUndefined();
      await classifier.train();
      expect(classifier.theta).toBeDefined();
      const expected = [
        [
          2.443849977840033,
          1.2755682924177316,
          2.443849977840033,
          -2.768423007562095,
          -1.6689759372483393,
          -1.6689759372483393,
        ],
        [
          -2.4438499778400344,
          -1.275568292417731,
          -2.4438499778400344,
          2.768423007562096,
          1.6689759372483401,
          1.6689759372483401,
        ],
      ];
      expect(classifier.theta).toHaveLength(expected.length);
      for (let i = 0, l = expected.length; i < l; i += 1) {
        expect(classifier.theta[i].elements).toEqual(expected[i]);
      }
    });

    test('Should not get into an infinite loop', () => {
      const classifier = new LogisticRegressionClassifier({});
      classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 1], 'one');
      classifier.addObservation([0, 0, 0, 0, 0, 0, 1, 1, 1], 'two');
    });
  });

  describe('Get classifications', () => {
    test('Should get correct clasifications for basic examples', async () => {
      const classifier = getClassifier2();
      await classifier.train();
      const classifications1 = classifier.getClassifications([
        0,
        1,
        1,
        0,
        0,
        0,
      ]);
      expect(classifications1).toHaveLength(2);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.95);
      expect(classifications1[1].label).toEqual('two');
      expect(classifications1[1].value).toBeLessThan(0.05);
      const classifications2 = classifier.getClassifications([
        0,
        0,
        0,
        0,
        1,
        1,
      ]);
      expect(classifications2).toHaveLength(2);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.95);
      expect(classifications2[1].label).toEqual('one');
      expect(classifications2[1].value).toBeLessThan(0.05);
    });
    test('Should return empty array if no thetha', async () => {
      const classifier = getClassifier2();
      await classifier.train();
      classifier.theta = undefined;
      const classifications1 = classifier.getClassifications([
        0,
        1,
        1,
        0,
        0,
        0,
      ]);
      expect(classifications1).toEqual([]);
    });
    test('Should get correct clasifications for more complex examples', async () => {
      const classifier = getClassifier3();
      await classifier.train();
      const classifications1 = classifier.getClassifications([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classifications1).toHaveLength(3);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      const classifications2 = classifier.getClassifications([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
      ]);
      expect(classifications2).toHaveLength(3);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      const classifications3 = classifier.getClassifications([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
      ]);
      expect(classifications3).toHaveLength(3);
      expect(classifications3[0].label).toEqual('three');
      expect(classifications3[0].value).toBeGreaterThan(0.6);
    });
    test('Should allow retraining', async () => {
      const classifier = new LogisticRegressionClassifier();
      addObservations3a(classifier);
      await classifier.train();
      let classifications1 = classifier.getClassifications([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classifications1).toHaveLength(2);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      let classifications2 = classifier.getClassifications([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
      ]);
      expect(classifications2).toHaveLength(2);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      addObservations3b(classifier);
      await classifier.train();
      classifications1 = classifier.getClassifications([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classifications1).toHaveLength(3);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      classifications2 = classifier.getClassifications([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
      ]);
      expect(classifications2).toHaveLength(3);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      const classifications3 = classifier.getClassifications([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
      ]);
      expect(classifications3).toHaveLength(3);
      expect(classifications3[0].label).toEqual('three');
      expect(classifications3[0].value).toBeGreaterThan(0.6);
    });
  });

  describe('Get Best Classification', () => {
    test('Should get the best classification', async () => {
      const classifier = getClassifier3();
      await classifier.train();
      const classification1 = classifier.getBestClassification([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classification1.label).toEqual('one');
      expect(classification1.value).toBeGreaterThan(0.85);
      const classification2 = classifier.getBestClassification([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
      ]);
      expect(classification2.label).toEqual('two');
      expect(classification2.value).toBeGreaterThan(0.85);
      const classification3 = classifier.getBestClassification([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
      ]);
      expect(classification3.label).toEqual('three');
      expect(classification3.value).toBeGreaterThan(0.6);
    });
    test('If cannot get classifications, then return undefined', async () => {
      const classifier = new LogisticRegressionClassifier({});
      await classifier.train();
      const classification = classifier.getBestClassification([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classification).toBeUndefined();
    });
  });

  describe('toObj and fromObj', () => {
    test('I can clone by toObj and retrieve with fromObj', async () => {
      const classifier = getClassifier3();
      await classifier.train();
      const clone = Classifier.fromObj(classifier.toObj());
      const classifications1 = clone.getClassifications([
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
      ]);
      expect(classifications1).toHaveLength(3);
      expect(classifications1[0].label).toEqual('one');
      expect(classifications1[0].value).toBeGreaterThan(0.85);
      const classifications2 = clone.getClassifications([
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
      ]);
      expect(classifications2).toHaveLength(3);
      expect(classifications2[0].label).toEqual('two');
      expect(classifications2[0].value).toBeGreaterThan(0.85);
      const classifications3 = clone.getClassifications([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
      ]);
      expect(classifications3).toHaveLength(3);
      expect(classifications3[0].label).toEqual('three');
      expect(classifications3[0].value).toBeGreaterThan(0.6);
    });
  });
});
