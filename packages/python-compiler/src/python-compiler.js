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
const { JavascriptCompiler } = require('@nlpjs/evaluator');
const PythonParser = require('./python-parser');
const { forEach, range, print, getIndex, len } = require('./helper');

class PythonCompiler extends JavascriptCompiler {
  constructor(container) {
    super(container);
    this.name = 'python';
  }

  transpile(text) {
    return new PythonParser(text).parseCommand().transpile();
  }

  compile(pipeline) {
    let code;
    if (Array.isArray(pipeline) && pipeline[0].startsWith('//')) {
      code = pipeline.slice(1).join('\n');
    } else {
      code = Array.isArray(pipeline) ? pipeline.join('\n') : pipeline;
    }
    const header = '(async () => {\n';
    const footer = '\n})();';
    const wrapped = header + this.transpile(code) + footer;
    return wrapped;
  }

  async evaluate(str, context) {
    const transpiled = this.transpile(str);
    if (!context.globalFuncs) {
      context.globalFuncs = { forEach, range, print, getIndex, len };
    }
    const result = await this.evaluateAll(transpiled, context);
    if (!result || result.length === 0) {
      return undefined;
    }
    return result[result.length - 1];
  }

  async execute(compiled, srcInput, srcObject) {
    const context = {
      this: srcObject,
      input: srcInput,
      globalFuncs: {
        forEach,
        range,
        print,
        getIndex,
        len,
      },
    };
    await super.evaluate(compiled, context);
  }
}

module.exports = PythonCompiler;
