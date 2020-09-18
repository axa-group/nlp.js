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

const { Container } = require('@nlpjs/core');
const { NlgManager } = require('../src');
const container = require('./bootstrap');

class Evaluator {
  evaluate(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}

describe('NLG Manager', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const manager = new NlgManager({ container });
      expect(manager).toBeDefined();
    });
    test('Should initialize properties', () => {
      const manager = new NlgManager({ container });
      expect(manager.settings.tag).toEqual('nlg-manager');
      expect(manager.responses).toEqual({});
    });
  });

  describe('Choose Random', () => {
    test('It should do nothing if answers is not defined', () => {
      const manager = new NlgManager({ container });
      const input = {};
      manager.chooseRandom(input);
      expect(input.answer).toBeUndefined();
    });
    test('It should do nothing if answers is empty', () => {
      const manager = new NlgManager({ container });
      const input = { answers: [] };
      manager.chooseRandom(input);
      expect(input.answer).toBeUndefined();
    });
    test('If there is only one answer, return this answer', () => {
      const manager = new NlgManager({ container });
      const input = { answers: [{ answer: 'a' }] };
      manager.chooseRandom(input);
      expect(input.answer).toEqual('a');
    });
    test('If there is more than one should return at random', () => {
      const manager = new NlgManager({ container });
      const input = { answers: [{ answer: 'a' }, { answer: 'b' }] };
      const responses = {};
      for (let i = 0; i < 100; i += 1) {
        responses[manager.chooseRandom(input).answer] = 1;
      }
      expect(responses).toEqual({ a: 1, b: 1 });
    });
  });

  describe('Add', () => {
    test('Should add an answer with no condition', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello');
      expect(manager.responses.en.greet).toHaveLength(1);
      expect(manager.responses.en.greet[0].answer).toEqual('Hello');
      expect(manager.responses.en.greet[0].condition).toBeUndefined();
    });
    test('Should add an answer with condition', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(1);
      expect(manager.responses.en.greet[0].answer).toEqual('Hello');
      expect(manager.responses.en.greet[0].opts).toEqual({
        condition: 'a === 1',
      });
    });
    test('Should not add a duplicate entry', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(1);
    });
    test('Should be able to create several responses for the same intent and locale', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Greetings', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Hi', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(3);
    });
    test('Should be able to create responses for different intents of a locale', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Greetings', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Hi', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Goodbye', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Bye', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
    });
    test('Should be able to create responses for different intents and locales', () => {
      const manager = new NlgManager();
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Greetings', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Hi', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Goodbye', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Bye', { condition: 'a === 1' });
      manager.add('es', 'greet', 'Hola', { condition: 'a === 1' });
      manager.add('es', 'greet', 'Holi!', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Hasta luego', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Hasta otra', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Nos vemos!', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
      expect(manager.responses.es.greet).toHaveLength(2);
      expect(manager.responses.es.bye).toHaveLength(3);
    });
  });

  describe('Remove', () => {
    test('I can remove an added response', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Greetings', { condition: 'a === 1' });
      manager.add('en', 'greet', 'Hi', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Goodbye', { condition: 'a === 1' });
      manager.add('en', 'bye', 'Bye', { condition: 'a === 1' });
      manager.add('es', 'greet', 'Hola', { condition: 'a === 1' });
      manager.add('es', 'greet', 'Holi!', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Hasta luego', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Hasta otra', { condition: 'a === 1' });
      manager.add('es', 'bye', 'Nos vemos!', { condition: 'a === 1' });
      manager.remove('es', 'greet', 'Holi!', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
      expect(manager.responses.es.greet).toHaveLength(1);
      expect(manager.responses.es.bye).toHaveLength(3);
    });
    test('If the answer does not exists, do nothing', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello', { condition: 'a === 1' });
      manager.remove('en', 'greet', 'Hell', { condition: 'a === 1' });
      expect(manager.responses.en.greet).toHaveLength(1);
    });
  });

  describe('Find all answers', () => {
    test('It should return all answers from intent and locale with no condition', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello');
      manager.add('en', 'greet', 'Greetings');
      manager.add('en', 'greet', 'Hi');
      const result = manager.findAllAnswers({ locale: 'en', intent: 'greet' });
      expect(result.answers).toHaveLength(3);
    });
    test('It should return an empty array if location does not have answers', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello');
      const result = manager.findAllAnswers({ locale: 'es', intent: 'greet' });
      expect(result.answers).toHaveLength(0);
    });
    test('It should return an empty array if intent does not exists', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'greet', 'Hello');
      const result = manager.findAllAnswers({ locale: 'en', intent: 'bye' });
      expect(result.answers).toHaveLength(0);
    });
  });

  describe('Filter answers', () => {
    test('If answers is undefined do nothing', () => {
      const manager = new NlgManager({ container });
      const input = {};
      manager.filterAnswers(input);
      expect(input.answers).toBeUndefined();
    });
    test('If answers is empty do nothing', () => {
      const manager = new NlgManager({ container });
      const input = { answers: [] };
      manager.filterAnswers(input);
      expect(input.answers).toEqual([]);
    });
    test('If no evaluator do nothing', () => {
      const manager = new NlgManager({ container });
      manager.add('en', 'intent', 'a1', { condition: { a: 1 } });
      manager.add('en', 'intent', 'a2', { condition: { a: 2 } });
      manager.add('en', 'intent', 'a3', { condition: { a: 3 } });
      const input = manager.findAllAnswers({ locale: 'en', intent: 'intent' });
      manager.filterAnswers(input);
      expect(input.answers).toHaveLength(3);
    });
    test('An evaluator can be used', () => {
      const otherContainer = new Container();
      otherContainer.register('Evaluator', Evaluator, true);
      const manager = new NlgManager({ container: otherContainer });
      manager.add('en', 'intent', 'a1', { condition: { a: 1 } });
      manager.add('en', 'intent', 'a2', { condition: { a: 2 } });
      manager.add('en', 'intent', 'a3', { condition: { a: 3 } });
      const input = manager.findAllAnswers({
        locale: 'en',
        intent: 'intent',
        context: { a: 2 },
      });
      manager.filterAnswers(input);
      expect(input.answers).toHaveLength(1);
    });
  });

  describe('Render patterns', () => {
    test('It should render patterns in answer', async () => {
      const manager = new NlgManager();
      manager.add('en', 'intent', '(Hi|Hello) user');
      const actual = await manager.run({ locale: 'en', intent: 'intent' });
      expect(['Hi user', 'Hello user'].includes(actual.answer)).toBeTruthy();
    });
  });
});
