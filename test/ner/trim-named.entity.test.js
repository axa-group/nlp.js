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

const { TrimNamedEntity } = require('../../lib');

describe('Trim Named Entity', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const entity = new TrimNamedEntity();
      expect(entity).toBeDefined();
    });
  });
  describe('Add Between Condition', () => {
    test('A between condition can be added to a language', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'from', 'to');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('between');
      expect(condition.leftWords).toEqual(['from']);
      expect(condition.rightWords).toEqual(['to']);
    });
    test('A between condition can be added to several languages', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition(['en', 'es'], 'from', 'to');
      expect(entity.locales.en.conditions).toHaveLength(1);
      expect(entity.locales.es.conditions).toHaveLength(1);
      const conditionEn = entity.locales.en.conditions[0];
      expect(conditionEn.type).toEqual('between');
      expect(conditionEn.leftWords).toEqual(['from']);
      expect(conditionEn.rightWords).toEqual(['to']);
      const conditionEs = entity.locales.en.conditions[0];
      expect(conditionEs.type).toEqual('between');
      expect(conditionEs.leftWords).toEqual(['from']);
      expect(conditionEs.rightWords).toEqual(['to']);
    });
    test('The composed regex should work', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'from', 'to');
      const condition = entity.locales.en.conditions[0];
      const match = condition.regex.exec(
        'I want to travel from Madrid to Barcelona'
      );
      expect(match[0]).toEqual('Madrid');
    });
    test('Several words can be provided', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', ['from', 'since'], ['to', 'until']);
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('between');
      expect(condition.leftWords).toEqual(['from', 'since']);
      expect(condition.rightWords).toEqual(['to', 'until']);
      const match = condition.regex.exec(
        'I want to travel from Madrid until Barcelona'
      );
      expect(match[0]).toEqual('Madrid');
    });
    test('The condition can be case sensitive', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'From', 'To', { caseSensitive: true });
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      const match = condition.regex.exec(
        'I want to travel from Madrid to Barcelona or From Motril To Armilla'
      );
      expect(match[0]).toEqual('Motril');
    });
    test('The condition can be non spaced', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'from', 'to', { noSpaces: true });
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      const match = condition.regex.exec(
        'I want to travel from Madrid to Barcelona'
      );
      expect(match[0]).toEqual(' Madrid ');
    });
  });

  describe('Add Position Condition', () => {
    test('It must add a position condition', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addPositionCondition('before', 'en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('before');
      expect(condition.words).toEqual(['from']);
    });
    test('The condition can be added to several languages', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addPositionCondition('before', ['en', 'es'], 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const conditionEn = entity.locales.en.conditions[0];
      expect(conditionEn.type).toEqual('before');
      expect(conditionEn.words).toEqual(['from']);
      expect(entity.locales.es.conditions).toHaveLength(1);
      const conditionEs = entity.locales.en.conditions[0];
      expect(conditionEs.type).toEqual('before');
      expect(conditionEs.words).toEqual(['from']);
    });
    test('Several words can be added', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addPositionCondition('before', 'en', ['from', 'to']);
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('before');
      expect(condition.words).toEqual(['from', 'to']);
    });
  });

  describe('Add After Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addAfterCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('after');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Add After First Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addAfterFirstCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('afterFirst');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Add After Last Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addAfterLastCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('afterLast');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Add Before Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBeforeCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('before');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Add Before First Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBeforeFirstCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('beforeFirst');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Add Before Last Condition', () => {
    test('If must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBeforeLastCondition('en', 'from');
      expect(entity.locales.en.conditions).toHaveLength(1);
      const condition = entity.locales.en.conditions[0];
      expect(condition.type).toEqual('beforeLast');
      expect(condition.words).toEqual(['from']);
    });
  });

  describe('Match Between', () => {
    test('It must match', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'from', 'to');
      const condition = entity.locales.en.conditions[0];
      const matchs = entity.matchBetween(
        'I have to go from Madrid to Barcelona',
        condition
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'between',
        start: 18,
        end: 23,
        len: 6,
        accuracy: 1,
        entity: 'entity',
        sourceText: 'Madrid',
        utteranceText: 'Madrid',
      });
    });
  });

  describe('Find word', () => {
    test('It should be able to find a word in an utterance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.findWord(
        'I must go from Barcelona to Madrid',
        'from'
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({ start: 9, end: 15 });
    });
    test('It should be able to find several occurences of a word in an utterance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.findWord(
        'I must go from Barcelona from Madrid',
        'from'
      );
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({ start: 9, end: 15 });
      expect(matchs[1]).toEqual({ start: 24, end: 30 });
    });
    test('It can be case sensitive', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.findWord(
        'I must go from Barcelona From Madrid',
        'From',
        true
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({ start: 24, end: 30 });
    });
    test('By default is case insensitive', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.findWord(
        'I must go froM Barcelona fRom Madrid',
        'FrOm'
      );
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({ start: 9, end: 15 });
      expect(matchs[1]).toEqual({ start: 24, end: 30 });
    });
    test('It can work without spacing', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.findWord(
        'I must go fromBarcelona From Madrid',
        'From',
        undefined,
        true
      );
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({ start: 10, end: 14 });
      expect(matchs[1]).toEqual({ start: 24, end: 28 });
    });
  });

  describe('Get Before Results', () => {
    test('It must retrieve matchs before a word', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getBeforeResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'before',
        start: 0,
        end: 8,
        len: 9,
        accuracy: 0.99,
        sourceText: 'I must go',
        utteranceText: 'I must go',
        entity: 'entity',
      });
    });
    test('It must retrieve matchs before a word several times', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getBeforeResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({
        type: 'before',
        start: 0,
        end: 8,
        len: 9,
        accuracy: 0.99,
        sourceText: 'I must go',
        utteranceText: 'I must go',
        entity: 'entity',
      });
      expect(matchs[1]).toEqual({
        type: 'before',
        start: 15,
        end: 23,
        len: 9,
        accuracy: 0.99,
        sourceText: 'Barcelona',
        utteranceText: 'Barcelona',
        entity: 'entity',
      });
    });
  });
  describe('Get Before First', () => {
    test('It must retrieve the first occurance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getBeforeFirstResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'beforeFirst',
        start: 0,
        end: 8,
        len: 9,
        accuracy: 0.99,
        sourceText: 'I must go',
        utteranceText: 'I must go',
        entity: 'entity',
      });
    });
  });
  describe('Get Before Last', () => {
    test('It must retrieve the last occurance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getBeforeLastResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'beforeLast',
        start: 0,
        end: 23,
        len: 24,
        accuracy: 0.99,
        sourceText: 'I must go from Barcelona',
        utteranceText: 'I must go from Barcelona',
        entity: 'entity',
      });
    });
  });
  describe('Get After Results', () => {
    test('It must retrieve matchs after a word', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getAfterResults(
        'I must go from Barcelona from Madrid',
        [{ start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'after',
        start: 30,
        end: 35,
        len: 6,
        accuracy: 0.99,
        sourceText: 'Madrid',
        utteranceText: 'Madrid',
        entity: 'entity',
      });
    });
    test('It must retrieve matchs before a word several times', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getAfterResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({
        type: 'after',
        start: 15,
        end: 23,
        len: 9,
        accuracy: 0.99,
        sourceText: 'Barcelona',
        utteranceText: 'Barcelona',
        entity: 'entity',
      });
      expect(matchs[1]).toEqual({
        type: 'after',
        start: 30,
        end: 35,
        len: 6,
        accuracy: 0.99,
        sourceText: 'Madrid',
        utteranceText: 'Madrid',
        entity: 'entity',
      });
    });
  });
  describe('Get After First', () => {
    test('It must retrieve the first occurance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getAfterFirstResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'afterFirst',
        start: 15,
        end: 35,
        len: 21,
        accuracy: 0.99,
        sourceText: 'Barcelona from Madrid',
        utteranceText: 'Barcelona from Madrid',
        entity: 'entity',
      });
    });
  });
  describe('Get After Last', () => {
    test('It must retrieve the last occurance', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      const matchs = entity.getAfterLastResults(
        'I must go from Barcelona from Madrid',
        [{ start: 9, end: 15 }, { start: 24, end: 30 }]
      );
      expect(matchs).toHaveLength(1);
      expect(matchs[0]).toEqual({
        type: 'afterLast',
        start: 30,
        end: 35,
        len: 6,
        accuracy: 0.99,
        sourceText: 'Madrid',
        utteranceText: 'Madrid',
        entity: 'entity',
      });
    });
  });

  describe('Extract', () => {
    test('It should be able to retrieve named entities', () => {
      const entity = new TrimNamedEntity({ name: 'fromLocation' });
      entity.addBetweenCondition('en', 'from', 'to');
      entity.addAfterLastCondition('en', 'from');
      const matchs = entity.extract('I must go from Barcelona to Madrid');
      expect(matchs).toHaveLength(2);
      expect(matchs[0]).toEqual({
        type: 'between',
        start: 15,
        end: 23,
        len: 9,
        accuracy: 1,
        sourceText: 'Barcelona',
        utteranceText: 'Barcelona',
        entity: 'fromLocation',
      });
      expect(matchs[1]).toEqual({
        type: 'afterLast',
        start: 15,
        end: 33,
        len: 19,
        accuracy: 0.99,
        sourceText: 'Barcelona to Madrid',
        utteranceText: 'Barcelona to Madrid',
        entity: 'fromLocation',
      });
    });
    test('It must combine different methods without removing edges', () => {
      const entity = new TrimNamedEntity({ name: 'entity' });
      entity.addBetweenCondition('en', 'from', 'to');
      entity.addBeforeCondition('en', 'from');
      entity.addBeforeFirstCondition('en', 'from');
      entity.addBeforeLastCondition('en', 'from');
      entity.addAfterCondition('en', 'to');
      entity.addAfterFirstCondition('en', 'to');
      entity.addAfterLastCondition('en', 'to');
      const matchs = entity.extract('I must go from Barcelona to Madrid');
      expect(matchs).toHaveLength(7);
    });
  });
});
