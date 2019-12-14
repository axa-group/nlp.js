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

const { parse } = require('esprima');

class JavascriptCompiler {
  constructor(container) {
    this.container = container.container || container;
    this.name = 'javascript';
    this.failResult = {};
  }

  compile(pipeline) {
    // const code = `(async () => {\n${pipeline.join('\n')}})();`;
    const header = '(function() {';
    const footer = '\n})();';
    const code = pipeline.join('\n');
    const wrapped = header + code + footer;
    return wrapped;
  }
  //   var tree = esprima.parse(wrappedCode, {range: true, loc: true});

  walkLiteral(node) {
    return node.value;
  }

  async walkUnary(node, context) {
    switch (node.operator) {
      case '+':
        return +(await this.walk(node.argument, context));
      case '-':
        return -(await this.walk(node.argument, context));
      case '~':
        /* eslint-disable no-bitwise */
        return ~(await this.walk(node.argument, context));
      case '!':
        return !(await this.walk(node.argument, context));
      default:
        return this.failResult;
    }
  }

  async walkArray(node, context) {
    const result = [];
    for (let i = 0, l = node.elements.length; i < l; i += 1) {
      const x = await this.walk(node.elements[i], context);
      if (x === this.failResult) {
        return this.failResult;
      }
      result.push(x);
    }
    return result;
  }

  async walkObject(node, context) {
    const result = {};
    for (let i = 0, l = node.properties.length; i < l; i += 1) {
      const prop = node.properties[i];
      const value = await this.walk(prop.value, context);
      if (value === this.failResult) {
        return this.failResult;
      }
      result[prop.key.value || prop.key.name] = value;
    }
    return result;
  }

  async walkBinary(node, context) {
    const left = await this.walk(node.left, context);
    if (left === this.failResult) {
      return this.failResult;
    }
    const right = await this.walk(node.right, context);
    if (right === this.failResult) {
      return this.failResult;
    }
    switch (node.operator) {
      case '==':
        /* eslint-disable eqeqeq */
        return left == right;
      case '===':
        return left === right;
      case '!=':
        /* eslint-disable eqeqeq */
        return left != right;
      case '!==':
        return left !== right;
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      case '%':
        return left % right;
      case '<':
        return left < right;
      case '<=':
        return left <= right;
      case '>':
        return left > right;
      case '>=':
        return left >= right;
      case '|':
        /* eslint-disable no-bitwise */
        return left | right;
      case '&':
        /* eslint-disable no-bitwise */
        return left & right;
      case '^':
        /* eslint-disable no-bitwise */
        return left ^ right;
      case '||':
        return left || right;
      case '&&':
        return left && right;
      default:
        return this.failResult;
    }
  }

  async walkIdentifier(node, context) {
    if ({}.hasOwnProperty.call(context, node.name)) {
      return context[node.name];
    }
    if ((context.input, {}.hasOwnProperty.call(context.input, node.name))) {
      return context.input[node.name];
    }
    if (context.this && context.this.container) {
      const item = context.this.container.get(node.name);
      if (item) {
        return item;
      }
    }
    return this.failResult;
  }

  async walkThis(node, context) {
    if ({}.hasOwnProperty.call(context, 'this')) {
      // eslint-disable-next-line
      return context["this"];
    }
    return this.failResult;
  }

  async walkCall(node, context) {
    const callee = await this.walk(node.callee, context);
    if (callee === this.failResult || typeof callee !== 'function') {
      return this.failResult;
    }
    let ctx = node.callee.object
      ? await this.walk(node.callee.object, context)
      : this.failResult;
    if (ctx === this.failResult) {
      ctx = null;
    }
    const args = [];
    for (let i = 0, l = node.arguments.length; i < l; i += 1) {
      const x = await this.walk(node.arguments[i], context);
      if (x === this.failResult) {
        return this.failResult;
      }
      args.push(x);
    }
    if (args.length === 0) {
      args.push(context.input);
    }
    return callee.apply(ctx, args);
  }

  async walkMember(node, context) {
    const obj = await this.walk(node.object, context);
    if (obj === this.failResult || typeof obj === 'function') {
      return this.failResult;
    }
    if (node.property.type === 'Identifier') {
      return obj[node.property.name];
    }
    const prop = await this.walk(node.property, context);
    if (prop === this.failResult) {
      return this.failResult;
    }
    return obj[prop];
  }

  async walkConditional(node, context) {
    const value = await this.walk(node.test, context);
    if (value === this.failResult) {
      return this.failResult;
    }
    if (value) {
      return this.walk(node.consequent, context);
    }
    if (!node.alternate) {
      return undefined;
    }
    return this.walk(node.alternate, context);
  }

  async walkExpression(node, context) {
    const value = await this.walk(node.expression, context);
    if (value === this.failResult) {
      return this.failResult;
    }
    return value;
  }

  async walkReturn(node, context) {
    return this.walk(node.argument, context);
  }

  async walkFunction(node, context) {
    const newContext = {};
    const keys = Object.keys(context);
    keys.forEach(element => {
      newContext[element] = context[element];
    });
    node.params.forEach(key => {
      if (key.type === 'Identifier') {
        newContext[key.name] = null;
      }
    });
    const bodies = node.body.body;
    for (let i = 0, l = bodies.length; i < l; i += 1) {
      if ((await this.walk(bodies[i], newContext)) === this.failResult) {
        return this.failResult;
      }
    }
    return undefined;
  }

  async walkTemplateLiteral(node, context) {
    let str = '';
    for (let i = 0; i < node.expressions.length; i += 1) {
      str += await this.walk(node.quasis[i], context);
      str += await this.walk(node.expressions[i], context);
    }
    return str;
  }

  walkTemplateElement(node) {
    return node.value.cooked;
  }

  async walkTaggedTemplate(node, context) {
    const tag = await this.walk(node.tag, context);
    const { quasi } = node;
    const strings = quasi.quasis.map(q => this.walk(q, context));
    const values = quasi.expressions.map(e => this.walk(e, context));
    // eslint-disable-next-line
    return tag.apply(null, [strings].concat(values));
  }

  async walkUpdateExpression(node, context) {
    let value = await this.walk(node.argument, context);
    if (value === this.failResult) {
      return this.failResult;
    }
    switch (node.operator) {
      case '++':
        value += 1;
        return this.walkSet(node.argument, context, value);
      case '--':
        value -= 1;
        return this.walkSet(node.argument, context, value);
      default:
        return this.failResult;
    }
  }

  async walkAssignmentExpression(node, context) {
    const value = await this.walk(node.right, context);
    if (value === this.failResult) {
      return this.failResult;
    }
    let leftValue = await this.walk(node.left, context);
    if (leftValue === this.failResult) {
      leftValue = 0;
    }
    switch (node.operator) {
      case '=':
        await this.walkSet(node.left, context, value);
        return value;
      case '+=':
        leftValue += value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '-=':
        leftValue -= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '*=':
        leftValue *= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '/=':
        leftValue /= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '%=':
        leftValue %= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '|=':
        // eslint-disable-next-line
        leftValue |= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '&=':
        // eslint-disable-next-line
        leftValue &= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      case '^=':
        // eslint-disable-next-line
        leftValue ^= value;
        await this.walkSet(node.left, context, leftValue);
        return leftValue;
      default:
        return this.failResult;
    }
  }

  async walkBlock(node, context) {
    if (Array.isArray(node.body)) {
      let result;
      for (let i = 0; i < node.body.length; i += 1) {
        result = await this.walk(node.body[i], context);
      }
      return result;
    }
    return this.walk(node.body, context);
  }

  async walk(node, context) {
    switch (node.type) {
      case 'Literal':
        return this.walkLiteral(node, context);
      case 'UnaryExpression':
        return this.walkUnary(node, context);
      case 'ArrayExpression':
        return this.walkArray(node, context);
      case 'ObjectExpression':
        return this.walkObject(node, context);
      case 'BinaryExpression':
      case 'LogicalExpression':
        return this.walkBinary(node, context);
      case 'Identifier':
        return this.walkIdentifier(node, context);
      case 'ThisExpression':
        return this.walkThis(node, context);
      case 'CallExpression':
        return this.walkCall(node, context);
      case 'MemberExpression':
        return this.walkMember(node, context);
      case 'ConditionalExpression':
        return this.walkConditional(node, context);
      case 'ExpressionStatement':
        return this.walkExpression(node, context);
      case 'ReturnStatement':
        return this.walkReturn(node, context);
      case 'FunctionExpression':
        return this.walkFunction(node, context);
      case 'TemplateLiteral':
        return this.walkTemplateLiteral(node, context);
      case 'TemplateElement':
        return this.walkTemplateElement(node, context);
      case 'TaggedTemplateExpression':
        return this.walkTaggedTemplate(node, context);
      case 'UpdateExpression':
        return this.walkUpdateExpression(node, context);
      case 'AssignmentExpression':
        return this.walkAssignmentExpression(node, context);
      case 'IfStatement':
        return this.walkConditional(node, context);
      case 'BlockStatement':
        return this.walkBlock(node, context);
      default:
        return this.failResult;
    }
  }

  walkSetIdentifier(node, context, value) {
    const newContext = context;
    newContext[node.name] = value;
    return value;
  }

  async walkSetMember(node, context, value) {
    const obj = await this.walk(node.object, context);
    if (obj === this.failResult || typeof obj === 'function') {
      return this.failResult;
    }
    if (node.property.type === 'Identifier') {
      obj[node.property.name] = value;
      return value;
    }
    const prop = await this.walk(node.property, context);
    if (prop === this.failResult) {
      return this.failResult;
    }
    obj[prop] = value;
    return value;
  }

  async walkSet(node, context, value) {
    switch (node.type) {
      case 'Identifier':
        return this.walkSetIdentifier(node, context, value);
      case 'MemberExpression':
        return this.walkSetMember(node, context, value);
      default:
        return this.failResult;
    }
  }

  async evaluateAll(str, context) {
    const result = [];
    const newContext = context || this.context;
    const compiled = parse(str);
    for (let i = 0; i < compiled.body.length; i += 1) {
      const expression = compiled.body[i].expression
        ? compiled.body[i].expression
        : compiled.body[i];
      const value = await this.walk(expression, newContext);
      result.push(value === this.failResult ? undefined : value);
    }
    return result;
  }

  async evaluate(str, context) {
    const result = await this.evaluateAll(str, context);
    if (!result || result.length === 0) {
      return undefined;
    }
    return result[result.length - 1];
  }

  async execute(compiled, srcInput, srcObject) {
    const context = {
      this: srcObject,
      input: srcInput,
    };
    await this.evaluate(compiled, context);
  }
}

module.exports = JavascriptCompiler;
