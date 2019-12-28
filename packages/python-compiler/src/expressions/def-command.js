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

const Expression = require('./expression');

class DefCommand extends Expression {
  transpile(options = {}) {
    const name = this.args[0];
    const args = this.args[1];
    const body = this.args[2];
    let code = `function ${name}(`;
    if (options.exports) {
      if (!options.names) {
        options.names = {};
      }
      this.addDefName(name, args, options.names);
    }
    for (let i = 0; i < args.length; i += 1) {
      if (i) {
        code = `${code}, `;
      }
      code = `${code}${args[i]}`;
    }
    code = `${code}) { ${body.transpile({
      names: { vars: [], defs: [], args: args.slice() },
    })} }`;
    if (options.exports) {
      code = `${code}${this.transpileExports(options.names)}`;
    }
    return code;
  }

  collectNames(names) {
    this.addDefName(this.args[0], this.args[1], names);
  }
}

module.exports = DefCommand;
