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

const { Ner, ExtractorTrim } = require('../src');

describe('Extractor Trim', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const instance = new ExtractorTrim();
      expect(instance).toBeDefined();
    });
  });

  describe('Extract', () => {
    test('It should extract a between rule', async () => {
      const ner = new Ner();
      ner.addBetweenCondition('en', 'entity', 'from', 'to');
      const input = {
        text: 'I have to go from Madrid to Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          start: 18,
          end: 23,
          accuracy: 1,
          sourceText: 'Madrid',
          entity: 'entity',
          type: 'trim',
          subtype: 'between',
          utteranceText: 'Madrid',
          len: 6,
        },
      ]);
    });

    test('It should extract a between rule finding simplest solution', async () => {
      const ner = new Ner();
      ner.addBetweenCondition('en', 'destination', ['to'], ['from']);
      const input = {
        text: 'I want to travel to Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'between',
          start: 10,
          end: 25,
          len: 16,
          accuracy: 1,
          sourceText: 'travel to Madrid',
          utteranceText: 'travel to Madrid',
          entity: 'destination',
        },
      ]);
    });

    test('It should extract a between rule finding closest solution', async () => {
      const ner = new Ner();
      ner.addBetweenLastCondition('en', 'destination', ['to'], ['from']);
      const input = {
        text: 'I want to travel to Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'between',
          start: 20,
          end: 25,
          len: 6,
          accuracy: 1,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'destination',
        },
      ]);
    });

    test('It should extract a get before rule', async () => {
      const ner = new Ner();
      ner.addBeforeCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'before',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
        },
        {
          type: 'trim',
          subtype: 'before',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
        },
      ]);
    });
    test('It should extract a get before last rule', async () => {
      const ner = new Ner();
      ner.addBeforeLastCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeLast',
          start: 0,
          end: 23,
          len: 24,
          accuracy: 0.99,
          sourceText: 'I have to go from Madrid',
          utteranceText: 'I have to go from Madrid',
          entity: 'entity',
        },
      ]);
    });
    test('It should extract a get before first rule', async () => {
      const ner = new Ner();
      ner.addBeforeFirstCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeFirst',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
        },
      ]);
    });
    test('It should extract a get after rule', async () => {
      const ner = new Ner();
      ner.addAfterCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'after',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
        },
        {
          type: 'trim',
          subtype: 'after',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
        },
      ]);
    });
    test('It should extract a get after first rule', async () => {
      const ner = new Ner();
      ner.addAfterFirstCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterFirst',
          start: 18,
          end: 38,
          len: 21,
          accuracy: 0.99,
          sourceText: 'Madrid from Barcelona',
          utteranceText: 'Madrid from Barcelona',
          entity: 'entity',
        },
      ]);
    });
    test('It should extract a get after last rule', async () => {
      const ner = new Ner();
      ner.addAfterLastCondition('en', 'entity', 'from');
      const input = {
        text: 'I have to go from Madrid from Barcelona',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterLast',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
        },
      ]);
    });

    test('It should be able to retrieve at start of utterance', async () => {
      const ner = new Ner();
      ner.addAfterLastCondition('en', 'entity', 'from');
      const input = {
        text: 'from Barcelona to Madrid',
        locale: 'en',
      };
      const actual = await ner.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterLast',
          start: 5,
          end: 23,
          len: 19,
          accuracy: 0.99,
          sourceText: 'Barcelona to Madrid',
          utteranceText: 'Barcelona to Madrid',
          entity: 'entity',
        },
      ]);
    });
  });
});
