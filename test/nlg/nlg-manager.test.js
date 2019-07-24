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

const { NlgManager } = require('../../lib');

describe('NLG Manager', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const manager = new NlgManager();
      expect(manager).toBeDefined();
    });
    test('Should initialize properties', () => {
      const manager = new NlgManager();
      expect(manager.evaluator).toBeDefined();
      expect(manager.responses).toEqual({});
    });
  });

  describe('Is valid', () => {
    test('Should return true if the condition is valid', () => {
      const manager = new NlgManager();
      const result = manager.isValid('7 * 2 === 14');
      expect(result).toBeTruthy();
    });
    test('Should return false if the condition is not valid', () => {
      const manager = new NlgManager();
      const result = manager.isValid('7 * 2 !== 14');
      expect(result).toBeFalsy();
    });
    test('Should use the context if provided', () => {
      const manager = new NlgManager();
      const result = manager.isValid('a * 2 === 14', { a: 7 });
      expect(result).toBeTruthy();
    });
  });

  describe('Add answer', () => {
    test('Should add an answer with no condition', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      expect(manager.responses.en.greet).toHaveLength(1);
      expect(manager.responses.en.greet[0].response).toEqual('Hello');
      expect(manager.responses.en.greet[0].condition).toBeUndefined();
    });
    test('Should add an answer with condition', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(1);
      expect(manager.responses.en.greet[0].response).toEqual('Hello');
      expect(manager.responses.en.greet[0].condition).toEqual('a === 1');
    });
    test('Should not add a duplicate entry', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(1);
    });
    test('Should be able to create several responses for the same intent and locale', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Greetings', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hi', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(3);
    });
    test('Should be able to create responses for different intents of a locale', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Greetings', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hi', 'a === 1');
      manager.addAnswer('en', 'bye', 'Goodbye', 'a === 1');
      manager.addAnswer('en', 'bye', 'Bye', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
    });
    test('Should be able to create responses for different intents and locales', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Greetings', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hi', 'a === 1');
      manager.addAnswer('en', 'bye', 'Goodbye', 'a === 1');
      manager.addAnswer('en', 'bye', 'Bye', 'a === 1');
      manager.addAnswer('es', 'greet', 'Hola', 'a === 1');
      manager.addAnswer('es', 'greet', 'Holi!', 'a === 1');
      manager.addAnswer('es', 'bye', 'Hasta luego', 'a === 1');
      manager.addAnswer('es', 'bye', 'Hasta otra', 'a === 1');
      manager.addAnswer('es', 'bye', 'Nos vemos!', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
      expect(manager.responses.es.greet).toHaveLength(2);
      expect(manager.responses.es.bye).toHaveLength(3);
    });
  });

  describe('Remove Answer', () => {
    test('I can remove an added response', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Greetings', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hi', 'a === 1');
      manager.addAnswer('en', 'bye', 'Goodbye', 'a === 1');
      manager.addAnswer('en', 'bye', 'Bye', 'a === 1');
      manager.addAnswer('es', 'greet', 'Hola', 'a === 1');
      manager.addAnswer('es', 'greet', 'Holi!', 'a === 1');
      manager.addAnswer('es', 'bye', 'Hasta luego', 'a === 1');
      manager.addAnswer('es', 'bye', 'Hasta otra', 'a === 1');
      manager.addAnswer('es', 'bye', 'Nos vemos!', 'a === 1');
      manager.removeAnswer('es', 'greet', 'Holi!', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(3);
      expect(manager.responses.en.bye).toHaveLength(2);
      expect(manager.responses.es.greet).toHaveLength(1);
      expect(manager.responses.es.bye).toHaveLength(3);
    });
    test('If the answer does not exists, do nothing', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.removeAnswer('en', 'greet', 'Hell', 'a === 1');
      expect(manager.responses.en.greet).toHaveLength(1);
    });
  });

  describe('Find all answers', () => {
    test('It should return all answers from intent and locale with no condition', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      manager.addAnswer('en', 'greet', 'Greetings');
      manager.addAnswer('en', 'greet', 'Hi');
      const result = manager.findAllAnswers('en', 'greet', {});
      expect(result).toHaveLength(3);
    });
    test('It should return all answers with true condition or no condition', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello', 'a === 1');
      manager.addAnswer('en', 'greet', 'Greetings', 'a === 1');
      manager.addAnswer('en', 'greet', 'Hi', 'a === 2');
      manager.addAnswer('en', 'greet', 'Good day');
      const result = manager.findAllAnswers('en', 'greet', { a: 1 });
      expect(result).toHaveLength(3);
      expect(result[0].response).toEqual('Hello');
      expect(result[1].response).toEqual('Greetings');
      expect(result[2].response).toEqual('Good day');
    });
    test('It should return an empty array if location does not have answers', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      const result = manager.findAllAnswers('es', 'greet', {});
      expect(result).toHaveLength(0);
    });
    test('It should return an empty array if intent does not exists', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      const result = manager.findAllAnswers('en', 'bye', {});
      expect(result).toHaveLength(0);
    });
  });

  describe('Find answer', () => {
    test('It should return one answer from intent and locale with no condition', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      manager.addAnswer('en', 'greet', 'Greetings');
      manager.addAnswer('en', 'greet', 'Hi');
      const result = manager.findAnswer('en', 'greet', {});
      expect(result).toBeDefined();
    });
    test('It should return undefined if there is no answer', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      manager.addAnswer('en', 'greet', 'Greetings');
      manager.addAnswer('en', 'greet', 'Hi');
      const result = manager.findAnswer('en', 'bye', {});
      expect(result).toBeUndefined();
    });
    test('It should return the existing answer if there is only 1', () => {
      const manager = new NlgManager();
      manager.addAnswer('en', 'greet', 'Hello');
      const result = manager.findAnswer('en', 'greet', {});
      expect(result.response).toEqual('Hello');
    });
  });
});
