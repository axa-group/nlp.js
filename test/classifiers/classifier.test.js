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

const { Classifier } = require('../../lib');

const labelList = ['label1', 'label2', 'label3'];
const observationList = [
  'observation1',
  'observation2',
  'observation3',
  'observation4',
  'observation5',
];

describe('Classifier', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const classifier = new Classifier();
      expect(classifier).toBeDefined();
    });
    test('If no settings are supplied, should create a new instance', () => {
      const classifier = new Classifier();
      expect(classifier.settings).toBeDefined();
      expect(classifier.settings).toEqual({});
    });
    test('If settings are supplied, should be assigned as property', () => {
      const settings = { name: 'test' };
      const classifier = new Classifier(settings);
      expect(classifier.settings).toBeDefined();
      expect(classifier.settings).toEqual(settings);
    });
    test('Should initialize the properties', () => {
      const classifier = new Classifier();
      expect(classifier.observations).toBeDefined();
      expect(classifier.observations).toEqual({});
      expect(classifier.labels).toBeDefined();
      expect(classifier.labels).toEqual([]);
      expect(classifier.observationCount).toBe(0);
    });
  });

  describe('Add observation', () => {
    test('Should add the label to the label list', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      expect(classifier.labels[0]).toBe(labelList[0]);
    });
    test('Should add the observation', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      expect(classifier.observations[labelList[0]]).toBeDefined();
      expect(classifier.observations[labelList[0]]).toEqual([
        observationList[0],
      ]);
    });
    test('Should increase the observation count', () => {
      const classifier = new Classifier();
      expect(classifier.observationCount).toEqual(0);
      classifier.addObservation(observationList[0], labelList[0]);
      expect(classifier.observationCount).toEqual(1);
    });
    test('Several observations can be added to the same label', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      expect(classifier.observations[labelList[0]]).toContain(
        observationList[0]
      );
      expect(classifier.observations[labelList[0]]).toContain(
        observationList[1]
      );
      expect(classifier.observationCount).toEqual(2);
    });
    test('Several observations can be added to several labels', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      expect(classifier.observations[labelList[0]]).toContain(
        observationList[0]
      );
      expect(classifier.observations[labelList[0]]).toContain(
        observationList[1]
      );
      expect(classifier.observations[labelList[1]]).toContain(
        observationList[2]
      );
      expect(classifier.observations[labelList[1]]).toContain(
        observationList[3]
      );
      expect(classifier.observationCount).toEqual(4);
    });
  });

  describe('Remove observation', () => {
    test('I can remove observations by label', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservationByLabel(observationList[2], labelList[1]);
      expect(classifier.observations[labelList[1]]).not.toContain(
        observationList[2]
      );
      expect(classifier.observationCount).toEqual(3);
    });
    test('If the label does not exists, do nothing', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservationByLabel(observationList[2], labelList[2]);
      expect(classifier.observationCount).toEqual(4);
    });
    test('If the observation is not in the label it should not modify the instance', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservationByLabel(observationList[2], labelList[0]);
      expect(classifier.observations[labelList[1]]).toContain(
        observationList[2]
      );
      expect(classifier.observationCount).toEqual(4);
    });
    test('If I remove all the observations from a label, the label should be removed', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservationByLabel(observationList[2], labelList[1]);
      classifier.removeObservationByLabel(observationList[3], labelList[1]);
      expect(classifier.observationCount).toEqual(2);
      expect(classifier.labels).toHaveLength(1);
      expect(classifier.labels).not.toContain(labelList[1]);
    });
    test('I can remove obsrevations by label with default observation removal', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservation(observationList[2], labelList[1]);
      expect(classifier.observations[labelList[1]]).not.toContain(
        observationList[2]
      );
      expect(classifier.observationCount).toEqual(3);
    });
    test('If the observation is not in the label it should not modify the instance using default observation removal', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservation(observationList[2], labelList[0]);
      expect(classifier.observations[labelList[1]]).toContain(
        observationList[2]
      );
      expect(classifier.observationCount).toEqual(4);
    });
    test('If I remove all the observations from a label, the label should be removed using default observation removal', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservation(observationList[2], labelList[1]);
      classifier.removeObservation(observationList[3], labelList[1]);
      expect(classifier.observationCount).toEqual(2);
      expect(classifier.labels).toHaveLength(1);
      expect(classifier.labels).not.toContain(labelList[1]);
    });
    test('I can remove observations without knowing the label', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservation(observationList[2]);
      expect(classifier.observations[labelList[1]]).not.toContain(
        observationList[2]
      );
      expect(classifier.observationCount).toEqual(3);
    });
    test('It should do nothing if the observation does not exists', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      classifier.removeObservation(observationList[4]);
      expect(classifier.observationCount).toEqual(4);
    });
  });

  describe('Recalculate Example count', () => {
    test('Should recalculate if manual modifications are done', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      delete classifier.observations[labelList[0]];
      expect(classifier.observationCount).toEqual(4);
      classifier.recalculateObservationCount();
      expect(classifier.observationCount).toEqual(2);
    });
  });

  describe('Create classification matrix', () => {
    test('Should return an empty array if there are no observations', () => {
      const classifier = new Classifier();
      const matrix = classifier.createClassificationMatrix();
      expect(matrix).toEqual([]);
    });
    test('Should return an zero matrix relating each observation with each label', () => {
      const classifier = new Classifier();
      classifier.addObservation(observationList[0], labelList[0]);
      classifier.addObservation(observationList[1], labelList[0]);
      classifier.addObservation(observationList[2], labelList[1]);
      classifier.addObservation(observationList[3], labelList[1]);
      const matrix = classifier.createClassificationMatrix();
      expect(matrix).toEqual([[0, 0], [0, 0], [0, 0], [0, 0]]);
    });
  });

  describe('Classify Observation', () => {
    test('This method should throw an error because must be implemented by child', () => {
      const classifier = new Classifier();
      expect(() => {
        classifier.classifyObservation();
      }).toThrowError(
        'This method is not implemented. Must be implemented by child classes.'
      );
    });
  });
});
