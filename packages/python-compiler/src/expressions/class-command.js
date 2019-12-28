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

class ClassCommand extends Expression {
  collectNames(names) {
    this.addDefName(this.args[0], [], names);
  }

  transpile(options = {}) {
    if (!options.names) {
      options.names = {};
    }
    const name = this.args[0];
    const body = this.args[1];
    if (!options.exports) {
      this.addDefName(name, [], options.names);
    }
    let code = `function ${name} (...args) {\n`;
    const newoptions = { names: {} };
    code += body.transpile(newoptions);
    if (body.collectNames) {
      body.collectNames(newoptions.names);
    }
    code += this.transpileSelfDefs(newoptions.names);
    if (
      !newoptions.names ||
      !newoptions.names.defs ||
      !newoptions.names.defs.includes('__init__')
    ) {
      code += ' function __init__() { }\n';
    }
    if (newoptions.names && newoptions.names.defs) {
      for (let i = 0; i < newoptions.names.defs.length; i += 1) {
        const funcname = newoptions.names.defs[i];
        code += `${name}.prototype.${funcname} = function (...args) { return ${funcname}(this, ...args); }\n`;
      }
    }
    code += '  this.__init__(...args);\n';
    code += '\n}\n';
    if (options.exports) {
      code += this.transpileExports(name, options.names);
    }
    return code;
  }

  transpileSelfDefs(className, names) {
    let code = '';
    if (!names || !names.defs || !names.defargs) {
      return code;
    }
    for (let i = 0; i < names.defs.length; i += 1) {
      const defname = names.defs[i];
      if (!(!names.defargs[defname] || names.defargs[defname][0] !== 'self')) {
        if (code !== '') {
          code += ' ';
        }
        code += `${className}.prototype.${defname} = function (`;
        let arglist = '';
        for (let j = 1; j < names.defargs[defname].length; j += 1) {
          if (arglist !== '') {
            arglist += ', ';
          }
          arglist += names.defargs[defname][j];
        }
        code += `${arglist}) { return ${defname}(this)`;
        if (arglist !== '') {
          code += `, ${arglist}`;
        }
        code += '); };';
      }
    }
    return code;
  }
}

module.exports = ClassCommand;
