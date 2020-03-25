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

const PythonCompiler = require('../src/python-compiler');

function normalize(str) {
  return str
    .split('\n')
    .map((x) => x.trim())
    .join(' ')
    .trim();
}

const container = {
  get() {
    return undefined;
  },
};

describe('Python Compiler', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const evaluator = new PythonCompiler(container);
      expect(evaluator).toBeDefined();
    });
  });

  describe('Execute', () => {
    test('It should exeucute a simple code', async () => {
      const script = 'if n > 3:\n  n += 1';
      const context = { n: 5 };
      const evaluator = new PythonCompiler(container);
      const compiled = evaluator.transpile(script);
      await evaluator.execute(compiled, context);
      expect(context.n).toEqual(6);
    });
  });

  describe('Compile', () => {
    test('It should remove first comment', () => {
      const pipeline = ['// compiler=python', 'n = 7'];
      const evaluator = new PythonCompiler(container);
      const compiled = evaluator.compile(pipeline);
      const expected = '(async () => { n = 7;  })();';
      expect(normalize(compiled)).toEqual(normalize(expected));
    });
  });
});
