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

const { JavascriptCompiler } = require('../src');

const container = {
  get() {
    return undefined;
  },
};

describe('JavascriptCompiler', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const evaluator = new JavascriptCompiler(container);
      expect(evaluator).toBeDefined();
    });
  });

  describe('Walk Literal', () => {
    test('It should return the literal of the node', async () => {
      const evaluator = new JavascriptCompiler(container);
      const node = { value: 'This is the value' };
      const result = await evaluator.walkLiteral(node);
      expect(result).toEqual(node.value);
    });
  });

  describe('Walk unary', () => {
    test('It should return the result of an unary + operation', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const query = '+17';
      const result = await evaluator.evaluate(query, context);
      expect(result).toEqual(17);
    });
    test('It should return the result of an unary - operation', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const query = '-17';
      const result = await evaluator.evaluate(query, context);
      expect(result).toEqual(-17);
    });
    test('It should return the result of an unary ~ operation', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const query = '~17';
      const result = await evaluator.evaluate(query, context);
      expect(result).toEqual(-18);
    });
    test('It should return the result of an unary ! operation', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const query = '!false';
      const result = await evaluator.evaluate(query, context);
      expect(result).toEqual(true);
    });
    test('If the operator is unknown, return fail result', async () => {
      const evaluator = new JavascriptCompiler(container);
      const node = { argument: 17, operator: '*' };
      const result = await evaluator.walkUnary(node);
      expect(result).toBe(evaluator.failResult);
    });
    test('It should return the result if variables are used', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '-a';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(-12);
    });
  });

  describe('Walk this', () => {
    test('If context has a this property, return it', async () => {
      const context = { this: { a: 17 } };
      const evaluator = new JavascriptCompiler(container);
      const node = {};
      const result = await evaluator.walkThis(node, context);
      expect(result).toBe(context.this);
    });
    test('If context does not contain this, then return fail result', async () => {
      const context = {};
      const evaluator = new JavascriptCompiler(container);
      const node = {};
      const result = await evaluator.walkThis(node, context);
      expect(result).toBe(evaluator.failResult);
    });
    test('Evaluate this from evaluator', async () => {
      const context = { this: { a: 17 } };
      const evaluator = new JavascriptCompiler(container);
      const query = 'this.a++';
      const result = await evaluator.evaluate(query, context);
      expect(result).toBe(18);
    });
  });

  describe('Walk identifier', () => {
    test('If context has the identifier, return the value', async () => {
      const context = { a: 17 };
      const evaluator = new JavascriptCompiler(container);
      const node = { name: 'a' };
      const result = await evaluator.walkIdentifier(node, context);
      expect(result).toEqual(context.a);
    });
    test('If context does not contain the identifier, return fail result', async () => {
      const context = { a: 17 };
      const evaluator = new JavascriptCompiler(container);
      const node = { name: 'b' };
      const result = await evaluator.walkIdentifier(node, context);
      expect(result).toEqual(evaluator.failResult);
    });
  });

  describe('EvaluateAll', () => {
    test('Should resolve parameters', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a = a; b;';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2]);
    });
    test('Should resolve return undefined for unresolved paramters', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a; b; c;';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2, undefined]);
    });
    test('Should evaluate boolean expressions', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a === 1; b === 1;';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([true, false]);
    });
    test('Should evaluate more complex expressions', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '[1, 2, 3].map(function(n) { return n * 2 })';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([[2, 4, 6]]);
    });
    test('Should be able to modify values from the context', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a = 7; b++;';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([7, 3]);
      expect(context).toEqual({ a: 7, b: 3 });
    });
    test('Should evaluate more complex expressions with functions provided by context', async () => {
      const context = { n: 6, foo: (x) => x * 100, obj: { x: { y: 555 } } };
      const evaluator = new JavascriptCompiler(container);
      const question = '1; 2; 3+4*10+n; foo(3+5); obj[""+"x"].y;';
      const answer = await evaluator.evaluateAll(question, context);
      expect(answer).toEqual([1, 2, 49, 800, 555]);
    });
  });
  describe('Evaluate', () => {
    test('Should resolve parameters', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a = a; b;';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(2);
    });
    test('Should resolve return undefined for unresolved paramters', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a; b; c;';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(undefined);
    });
    test('Should evaluate boolean expressions', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a === 1; b === 1;';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(false);
    });
    test('Should evaluate more complex expressions', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '[1, 2, 3].map(function(n) { return n * 2 })';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual([2, 4, 6]);
    });
    test('Should be able to modify values from the context', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a = 7; b++;';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(3);
      expect(context).toEqual({ a: 7, b: 3 });
    });
  });

  describe('Walk Binary', () => {
    test('Should eval ==', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 == 1';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 == 2';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval ===', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 === 1';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 === 2';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval !=', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 != 2';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 != 1';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval !==', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 !== 2';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 !== 1';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval +', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '1 + 2';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(3);
    });
    test('Should eval -', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '1 - 4';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(-3);
    });
    test('Should eval *', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '2 * 7';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(14);
    });
    test('Should eval /', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '7 / 2';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(3.5);
    });
    test('Should eval %', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '8 % 3';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(2);
    });
    test('Should eval <', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 < 2';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '2 < 1';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval <=', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '1 <= 1';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '2 <= 1';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval >', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '2 > 1';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 > 2';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval >=', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = '2 >= 2';
      const answerTrue = await evaluator.evaluate(questionTrue, context);
      expect(answerTrue).toEqual(true);
      const questionFalse = '1 >= 2';
      const answerFalse = await evaluator.evaluate(questionFalse, context);
      expect(answerFalse).toEqual(false);
    });
    test('Should eval | (binary or)', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '9 | 3';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(11);
    });
    test('Should eval & (binary and)', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '12 & 5';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(4);
    });
    test('Should eval ^ (binary xor)', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '12 ^ 5';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(9);
    });
    test('Should eval || (logical or)', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'false || true';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(true);
    });
    test('Should eval && (logical and)', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'true && false';
      const answer = await evaluator.evaluate(question, context);
      expect(answer).toEqual(false);
    });
    test('Should return undefined if left term is undefined', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c + a';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('Should return undefined if right term is undefined', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a + c';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('Should return undefined if the operator is not recognized', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a >> b';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk Assignment', () => {
    test('Should eval =', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a = 7';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(7);
    });
    test('Should eval +=', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a += 7';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(8);
    });
    test('Should eval -=', async () => {
      const context = { a: 1, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a -= 7';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(-6);
    });
    test('Should eval *=', async () => {
      const context = { a: 3, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a *= 7';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(21);
    });
    test('Should eval /=', async () => {
      const context = { a: 3, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a /= 2';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(1.5);
    });
    test('Should eval %=', async () => {
      const context = { a: 3, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a %= 2';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(1);
    });
    test('Should eval |=', async () => {
      const context = { a: 3, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a |= 9';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(11);
    });
    test('Should eval &=', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a &= 5';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(4);
    });
    test('Should eval ^=', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'a ^= 5';
      await evaluator.evaluate(question, context);
      expect(context.a).toEqual(9);
    });
  });

  describe('Walk conditional', () => {
    test('It should evaluate a ternary operator', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = 'b === 2 ? a-- : a++;';
      await evaluator.evaluate(questionTrue, context);
      expect(context.a).toEqual(11);
      context.a = 12;
      const questionFalse = 'b < 2 ? a-- : a++;';
      await evaluator.evaluate(questionFalse, context);
      expect(context.a).toEqual(13);
    });
    test('Should return undefined if some term is not defined', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const questionTrue = 'c === 2 ? a-- : a++;';
      const result = await evaluator.evaluate(questionTrue, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk Template Literal', () => {
    test('Should evaluate a template literal', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      // eslint-disable-next-line
      const question = "`${a}-${b}`";
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual('12-2');
    });
  });

  describe('Walk Tagged Template Literal', () => {
    test('Should evaluate a tagged template literal', async () => {
      const context = {
        a: 12,
        b: 2,
        tag: (literals, a, b) => `${literals.join('-')}-${a}-${b}`,
      };
      const evaluator = new JavascriptCompiler(container);
      // eslint-disable-next-line
      const question = "tag`Hello ${a}hi${b}`";
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual('Hello -hi--12-2');
    });
  });

  describe('Walk array', () => {
    test('Should evaluate every element of the array', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '[a, b, a+b, a-b]';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual([12, 2, 14, 10]);
    });
    test('Should return undefined if a term cannot be resolved', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = '[a, b, a+b, a-b, c]';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk object', () => {
    test('Should walk an object', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'd = { a: a, b: b, c: a + b}';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual({ a: 12, b: 2, c: 14 });
    });
    test('If some member is incorrect return undefined', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'd = { a: a, b: b, c: c}';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('If statement', () => {
    test('Should be able to resolve if-then-else expressions then path', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'if (a > 10) { c = 7; b++ } else { c = 3; b-- }';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(3);
      expect(context.c).toEqual(7);
      expect(context.b).toEqual(3);
    });
    test('Should be able to resolve if-then-else expressions else path', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'if (a < 10) { c = 7; b++ } else { c = 3; b-- }';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toEqual(3);
      expect(context.b).toEqual(1);
    });
    test('Should be able to resolve if-then expressions then path', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'if (a > 10) { c = 7; b++ }; d = 1;';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toEqual(7);
      expect(context.b).toEqual(3);
    });
    test('Should be able to resolve if-then expressions else path', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'if (a < 10) { c = 7; b++ }; d = 1;';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(1);
      expect(context.c).toBeUndefined();
      expect(context.b).toEqual(2);
    });
  });

  describe('Walk call', () => {
    test('It should walk a function', async () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new JavascriptCompiler(container);
      const question = 'sum(a, b)';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(14);
    });
    test('If the function does not exists, should return undefined', async () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new JavascriptCompiler(container);
      const question = 'zum(a, b)';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('If some argument of the function does not exists, should return undefined', async () => {
      const context = { a: 12, b: 2, sum: (a, b) => a + b };
      const evaluator = new JavascriptCompiler(container);
      const question = 'sum(a, c)';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk member', () => {
    test('It should be able to walk a member', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c = [a, b]; d = c[0] + c[1];';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(14);
    });
    test('It should return undefined when then member expression does not exists', async () => {
      const context = { a: 12, b: (x) => x + 1 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c = [a, b]; d = e[0] + e[1];';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
    test('It should return undefined when then member cannot be resolved', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c = [a, b, d]; e = c[0] + c[1] + c[2];';
      const result = await evaluator.evaluate(question, context);
      expect(result).toBeUndefined();
    });
  });

  describe('Walk set member', () => {
    test('It should set a member', async () => {
      const context = { a: 12, b: 2, c: [1, 2] };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c[0] = 3';
      const result = await evaluator.evaluate(question, context);
      expect(result).toEqual(3);
      expect(context.c).toEqual([3, 2]);
    });
    test('It should not set a member of a non existing variable', async () => {
      const context = { a: 12, b: 2 };
      const evaluator = new JavascriptCompiler(container);
      const question = 'c[0] = 3';
      await evaluator.evaluate(question, context);
      expect(context.c).toBeUndefined();
    });
  });

  describe('Evaluator', () => {
    test('If no term is provided, return undefined', async () => {
      const evaluator = new JavascriptCompiler(container);
      const result = await evaluator.evaluate('', {});
      expect(result).toBeUndefined();
    });
  });
});
