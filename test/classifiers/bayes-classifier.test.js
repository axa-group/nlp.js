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

const { BayesClassifier, Classifier } = require('../../lib');

function getClassifier2() {
  const classifier = new BayesClassifier({});
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 0, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 0, 0, 0], 'one');
  classifier.addObservation([1, 1, 1, 1, 0, 0], 'one');

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
  const classifier = new BayesClassifier({});
  addObservations3a(classifier);
  addObservations3b(classifier);
  return classifier;
}

describe('Get classifications', () => {
  test('Should get correct clasifications for basic examples', () => {
    const classifier = getClassifier2();
    const classifications1 = classifier.getClassifications([1, 1, 1, 0, 0, 0]);
    expect(classifications1).toHaveLength(2);
    expect(classifications1[0].label).toEqual('one');
    expect(classifications1[1].label).toEqual('two');
    const classifications2 = classifier.getClassifications([0, 0, 0, 0, 1, 1]);
    expect(classifications2).toHaveLength(2);
    expect(classifications2[0].label).toEqual('two');
    expect(classifications2[1].label).toEqual('one');
  });
  test('Should get correct clasifications for more complex examples', () => {
    const classifier = getClassifier3();
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
  });
  test('Smoothing can be changed', () => {
    const classifier = getClassifier3();
    classifier.setSmoothing(0.5);
    expect(classifier.smoothing).toEqual(0.5);
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
  });

  describe('toObj and fromObj', () => {
    test('I can clone by toObj and retrieve with fromObj', () => {
      const classifier = getClassifier3();
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
    });
  });
});
