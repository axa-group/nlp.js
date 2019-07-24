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
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const query = '+17';
      const result = evaluator.evaluate(query, context);
      expect(result).toEqual(17);
    });
    test('It should return the result of an unary - operation', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const query = '-17';
      const result = evaluator.evaluate(query, context);
      expect(result).toEqual(-17);
    });
    test('It should return the result of an unary ~ operation', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const query = '~17';
      const result = evaluator.evaluate(query, context);
      expect(result).toEqual(-18);
    });
    test('It should return the result of an unary ! operation', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const query = '!false';
      const result = evaluator.evaluate(query, context);
      expect(result).toEqual(true);
    });
    test('If the operator is unknown, return fail result', () => {
      const evaluator = new Evaluator();
      const node = { argument: 17, operator: '*' };
      const result = evaluator.walkUnary(node);
      expect(result).toBe(evaluator.failResult);
    });
    test('It should return the result if variables are used', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = '-a';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(-12);
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
    test('Evaluate this from evaluator', () => {
      const context = { this: { a: 17 } };
      const evaluator = new Evaluator(context);
      const query = 'this.a++';
      const result = evaluator.evaluate(query, context);
      expect(result).toBe(18);
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

  describe('Walk Binary', () => {
    test('Should eval ==', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 == 1';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 == 2';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval ===', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 === 1';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 === 2';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval !=', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 != 2';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 != 1';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval !==', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 !== 2';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 !== 1';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval +', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '1 + 2';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(3);
    });
    test('Should eval -', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '1 - 4';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(-3);
    });
    test('Should eval *', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '2 * 7';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(14);
    });
    test('Should eval /', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '7 / 2';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(3.5);
    });
    test('Should eval %', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '8 % 3';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(2);
    });
    test('Should eval <', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 < 2';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '2 < 1';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval <=', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '1 <= 1';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '2 <= 1';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval >', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '2 > 1';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 > 2';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval >=', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = '2 >= 2';
      const answerTrue = evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 >= 2';
      const answerFalse = evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval | (binary or)', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '9 | 3';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(11);
    });
    test('Should eval & (binary and)', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '12 & 5';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(4);
    });
    test('Should eval ^ (binary xor)', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = '12 ^ 5';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(9);
    });
    test('Should eval || (logical or)', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'false || true';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(true);
    });
    test('Should eval && (logical and)', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'true && false';
      const answer = evaluator.evaluate(question, context);
      expect(answer).toEqual(false);
    });
    test('If is an unknown operator throw an error', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'true ^^ false';
      expect(() => evaluator.evaluate(question, context)).toThrow(
        'Line 1: Unexpected token ^'
      );
    });
    test('Should return undefined if left term is undefined', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'c + a';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('Should return undefined if right term is undefined', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a + c';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('Should return undefined if the operator is not recognized', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a >> b';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk Assignment', () => {
    test('Should eval =', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a = 7';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(7);
    });
    test('Should eval +=', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a += 7';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(8);
    });
    test('Should eval -=', () => {
      const context = { a: 1, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a -= 7';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(-6);
    });
    test('Should eval *=', () => {
      const context = { a: 3, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a *= 7';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(21);
    });
    test('Should eval /=', () => {
      const context = { a: 3, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a /= 2';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(1.5);
    });
    test('Should eval %=', () => {
      const context = { a: 3, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a %= 2';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(1);
    });
    test('Should eval |=', () => {
      const context = { a: 3, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a |= 9';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(11);
    });
    test('Should eval &=', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a &= 5';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(4);
    });
    test('Should eval ^=', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'a ^= 5';
      evaluator.evaluate(question, context);
      expect(context.a).toEqual(9);
    });
  });

  describe('Walk conditional', () => {
    test('It should evaluate a ternary operator', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = 'b === 2 ? a-- : a++;';
      evaluator.evaluate(questionTrue, context);
      expect(context.a).toEqual(11);
      context.a = 12;
      const questionFalse = 'b < 2 ? a-- : a++;';
      evaluator.evaluate(questionFalse, context);
      expect(context.a).toEqual(13);
    });
    test('Should return undefined if some term is not defined', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const questionTrue = 'c === 2 ? a-- : a++;';
      const result = evaluator.evaluate(questionTrue, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk Template Literal', () => {
    test('Should evaluate a template literal', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      // eslint-disable-next-line
      const question = "`${a}-${b}`";
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual('12-2');
    });
  });

  describe('Walk Tagged Template Literal', () => {
    test('Should evaluate a tagged template literal', () => {
      const context = {
        a: 12,
        b: 2,
        tag: (literals, a, b) => `${literals.join('-')}-${a}-${b}`,
      };
      const evaluator = new Evaluator();
      // eslint-disable-next-line
      const question = "tag`Hello ${a}hi${b}`";
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual('Hello -hi--12-2');
    });
  });

  describe('Walk array', () => {
    test('Should evaluate every element of the array', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = '[a, b, a+b, a-b]';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual([12, 2, 14, 10]);
    });
    test('Should return undefined if a term cannot be resolved', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = '[a, b, a+b, a-b, c]';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk object', () => {
    test('Should walk an object', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'd = { a: a, b: b, c: a + b}';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual({ a: 12, b: 2, c: 14 });
    });
    test('If some member is incorrect return undefined', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'd = { a: a, b: b, c: c}';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('If statement', () => {
    test('Should be able to resolve if-then-else expressions then path', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'if (a > 10) { c = 7; b++ } else { c = 3; b-- }';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(3);
      expect(context.c).toEqual(7);
      expect(context.b).toEqual(3);
    });
    test('Should be able to resolve if-then-else expressions else path', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'if (a < 10) { c = 7; b++ } else { c = 3; b-- }';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toEqual(3);
      expect(context.b).toEqual(1);
    });
    test('Should be able to resolve if-then expressions then path', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'if (a > 10) { c = 7; b++ }; d = 1;';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toEqual(7);
      expect(context.b).toEqual(3);
    });
    test('Should be able to resolve if-then expressions else path', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'if (a < 10) { c = 7; b++ }; d = 1;';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toBeUndefined();
      expect(context.b).toEqual(2);
    });
  });

  describe('Walk call', () => {
    test('It should walk a function', () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new Evaluator();
      const question = 'sum(a, b)';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(14);
    });
    test('If the function does not exists, should return undefined', () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new Evaluator();
      const question = 'zum(a, b)';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('If some argument of the function does not exists, should return undefined', () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new Evaluator();
      const question = 'sum(a, c)';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk member', () => {
    test('It should be able to walk a member', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'c = [a, b]; d = c[0] + c[1];';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(14);
    });
    test('It should return undefined when then member expression does not exists', () => {
      const context = { a: 12, b: x => x + 1 };
      const evaluator = new Evaluator();
      const question = 'c = [a, b]; d = e[0] + e[1];';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('It should return undefined when then member cannot be resolved', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'c = [a, b, d]; e = c[0] + c[1] + c[2];';
      const result = evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk set member', () => {
    test('It should set a member', () => {
      const context = { a: 12, b: 2, c: [1, 2] };
      const evaluator = new Evaluator();
      const question = 'c[0] = 3';
      const result = evaluator.evaluate(question, context);
      expect(result).toEqual(3);
      expect(context.c).toEqual([3, 2]);
    });
    test('It should not set a member of a non existing variable', () => {
      const context = { a: 12, b: 2 };
      const evaluator = new Evaluator();
      const question = 'c[0] = 3';
      evaluator.evaluate(question, context);
      expect(context.c).toBeUndefined();
    });
  });

  describe('Evaluator', () => {
    test('If no term is provided, return undefined', () => {
      const evaluator = new Evaluator();
      const result = evaluator.evaluate('', {});
      expect(result).toBeUndefined();
    });
  });
});
