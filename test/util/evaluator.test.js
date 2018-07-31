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

const { Evaluator } = require('../../lib');

describe('Evaluator', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const evaluator = new Evaluator();
      expect(evaluator).toBeDefined();
    });
    test('Should initialize properties', () => {
      const evaluator = new Evaluator();
      expect(evaluator.defaultContext).toBeDefined();
      expect(evaluator.defaultContext).toEqual({});
      expect(evaluator.failResult).toBeDefined();
      expect(evaluator.failResult).toEqual({});
    });
    test('If a context is provided, use it as default context', () => {
      const context = { a: 1 };
      const evaluator = new Evaluator(context);
      expect(evaluator.defaultContext).toBe(context);
    });
  });

  describe('Walk Literal', () => {
    test('It should return the literal of the node', () => {
      const evaluator = new Evaluator();
      const node = { value: 'This is the value' };
      const result = evaluator.walkLiteral(node);
      expect(result).toEqual(node.value);
    });
  });

  describe('Walk unary', () => {
    test('It should return the result of an unary + operation', () => {
      const evaluator = new Evaluator();
      const node = { argument: 17, operator: '+' };
      const result = evaluator.walkUnary(node);
      expect(result).toEqual(17);
    });
    test('It should return the result of an unary - operation', () => {
      const evaluator = new Evaluator();
      const node = { argument: 17, operator: '-' };
      const result = evaluator.walkUnary(node);
      expect(result).toEqual(-17);
    });
    test('It should return the result of an unary ~ operation', () => {
      const evaluator = new Evaluator();
      const node = { argument: 17, operator: '~' };
      const result = evaluator.walkUnary(node);
      expect(result).toEqual(-18);
    });
    test('It should return the result of an unary ! operation', () => {
      const evaluator = new Evaluator();
      const node = { argument: false, operator: '!' };
      const result = evaluator.walkUnary(node);
      expect(result).toEqual(true);
    });
    test('If the operator is unknown, return fail result', () => {
      const evaluator = new Evaluator();
      const node = { argument: 17, operator: '*' };
      const result = evaluator.walkUnary(node);
      expect(result).toBe(evaluator.failResult);
    });
  });

  describe('Walk this', () => {
    test('If context has a this property, return it', () => {
      const context = { this: { a: 17 } };
      const evaluator = new Evaluator(context);
      const node = {};
      const result = evaluator.walkThis(node, context);
      expect(result).toBe(context.this);
    });
    test('If context does not contain this, then return fail result', () => {
      const context = {};
      const evaluator = new Evaluator();
      const node = {};
      const result = evaluator.walkThis(node, context);
      expect(result).toBe(evaluator.failResult);
    });
  });

  describe('Walk identifier', () => {
    test('If context has the identifier, return the value', () => {
      const context = { a: 17 };
      const evaluator = new Evaluator();
      const node = { name: 'a' };
      const result = evaluator.walkIdentifier(node, context);
      expect(result).toEqual(context.a);
    });
    test('If context does not contain the identifier, return fail result', () => {
      const context = { a: 17 };
      const evaluator = new Evaluator(context);
      const node = { name: 'b' };
      const result = evaluator.walkIdentifier(node, context);
      expect(result).toEqual(evaluator.failResult);
    });
  });

  describe('EvaluateAll', () => {
    test('Should resolve parameters', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a = a; b;';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2]);
    });
    test('Should resolve return undefined for unresolved paramters', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a; b; c;';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2, undefined]);
    });
    test('Should evaluate boolean expressions', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a === 1; b === 1;';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([true, false]);
    });
    test('Should evaluate more complex expressions', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '[1, 2, 3].map(function(n) { return n * 2 })';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([[2, 4, 6]]);
    });
    test('Should be able to modify values from the context', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a = 7; b++;';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([7, 3]);
      expect(context).toEqual({ a: 7, b: 3 });
    });
    test('Should evaluate more complex expressions with functions provided by context', () => {
      const context = { n: 6, foo: x => x * 100, obj: { x: { y: 555 } } };
      const evaluator = new Evaluator();
      const question = '1; 2; 3+4*10+n; foo(3+5); obj[""+"x"].y;';
      const answer = evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2, 49, 800, 555]);
    });
  });
  describe('Evaluate', () => {
    test('Should resolve parameters', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a = a; b;';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(2);
    });
    test('Should resolve return undefined for unresolved paramters', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a; b; c;';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(undefined);
    });
    test('Should evaluate boolean expressions', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a === 1; b === 1;';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(false);
    });
    test('Should evaluate more complex expressions', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '[1, 2, 3].map(function(n) { return n * 2 })';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual([2, 4, 6]);
    });
    test('Should be able to modify values from the context', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a = 7; b++;';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(3);
      expect(context).toEqual({ a: 7, b: 3 });
    });
  });
});
