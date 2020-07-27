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

class DefaultCompiler {
  constructor(container) {
    this.container = container.container || container;
    this.name = 'default';
  }

  getTokenFromWord(word) {
    if (word.startsWith('//')) {
      return {
        type: 'comment',
        value: word,
      };
    }
    if (
      [
        'set',
        'delete',
        'get',
        'inc',
        'dec',
        'eq',
        'neq',
        'gt',
        'ge',
        'lt',
        'le',
        'label',
        'goto',
        'jne',
        'je',
      ].includes(word)
    ) {
      return {
        type: word,
        arguments: [],
      };
    }
    if (word.startsWith('$')) {
      return {
        type: 'call',
        value: word.slice(1),
      };
    }
    return {
      type: 'reference',
      value: word,
    };
  }

  compile(pipeline) {
    const result = [];
    for (let i = 0; i < pipeline.length; i += 1) {
      const line = pipeline[i].trim();
      const words = line.split(' ');
      const tokens = [];
      let currentString = '';
      let currentQuote;
      for (let j = 0; j < words.length; j += 1) {
        const word = words[j];
        let processed = false;
        if (!currentQuote) {
          if (word.startsWith('"')) {
            currentString = word;
            processed = true;
            currentQuote = '"';
            if (word.endsWith('"')) {
              currentQuote = undefined;
              tokens.push(this.getTokenFromWord(currentString));
            }
          } else if (word.startsWith("'")) {
            currentString = word;
            processed = true;
            currentQuote = "'";
            if (word.endsWith("'")) {
              currentQuote = undefined;
              tokens.push(this.getTokenFromWord(currentString));
            }
          }
        } else {
          currentString = `${currentString} ${word}`;
          processed = true;
          if (word.endsWith(currentQuote)) {
            currentQuote = undefined;
            tokens.push(this.getTokenFromWord(currentString));
          }
        }
        if (!processed) {
          tokens.push(this.getTokenFromWord(word));
        }
      }
      result.push(tokens);
    }
    return result;
  }

  executeCall(firstToken, context, input, srcObject, depth) {
    const pipeline = this.container.getPipeline(firstToken.value);
    if (!pipeline) {
      throw new Error(`Pipeline $${firstToken.value} not found.`);
    }
    return this.container.runPipeline(pipeline, input, srcObject, depth + 1);
  }

  executeReference(step, firstToken, context, input, srcObject) {
    const currentObject = this.container.resolvePath(
      firstToken.value,
      context,
      input,
      srcObject
    );
    const args = [];
    for (let i = 1; i < step.length; i += 1) {
      args.push(
        this.container.resolvePathWithType(
          step[i].value,
          context,
          input,
          srcObject
        )
      );
    }
    if (!currentObject) {
      throw new Error(`Method not found for step ${JSON.stringify(step)}`);
    }
    const method = currentObject.run || currentObject;
    if (typeof method === 'function') {
      return typeof currentObject === 'function'
        ? method(input, ...args)
        : method.bind(currentObject)(input, ...args);
    }
    return method;
  }

  doGoto(label, srcContext) {
    const context = srcContext;
    const index = context.labels[label];
    context.cursor = index;
  }

  async executeAction(step, context, input, srcObject, depth) {
    let firstToken = step[0];
    if (firstToken && firstToken.value && firstToken.value.startsWith('->')) {
      if (depth > 0) {
        return input;
      }
      firstToken = { ...firstToken };
      firstToken.value = firstToken.value.slice(2);
    }
    switch (firstToken.type) {
      case 'set':
        this.container.setValue(
          step[1].value,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'delete':
        this.container.deleteValue(step[1].value, context, input, srcObject);
        break;
      case 'get':
        return this.container.getValue(
          step[1] ? step[1].value : undefined,
          context,
          input,
          srcObject
        );
      case 'inc':
        this.container.incValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : '1',
          context,
          input,
          srcObject
        );
        break;
      case 'dec':
        this.container.decValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : '1',
          context,
          input,
          srcObject
        );
        break;
      case 'eq':
        this.container.eqValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'neq':
        this.container.neqValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'gt':
        this.container.gtValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'ge':
        this.container.geValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'lt':
        this.container.ltValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'le':
        this.container.leValue(
          step[1] ? step[1].value : undefined,
          step[2] ? step[2].value : undefined,
          context,
          input,
          srcObject
        );
        break;
      case 'goto':
        this.doGoto(step[1].value, context);
        break;
      case 'jne':
        if (!context.floating) {
          this.doGoto(step[1].value, context);
        }
        break;
      case 'je':
        if (context.floating) {
          this.doGoto(step[1].value, context);
        }
        break;
      case 'call':
        return this.executeCall(firstToken, context, input, srcObject, depth);
      case 'reference':
        return this.executeReference(
          step,
          firstToken,
          context,
          input,
          srcObject
        );
      default:
        break;
    }
    return input;
  }

  findLabels(compiled, srcLabels) {
    const labels = srcLabels;
    for (let i = 0; i < compiled.length; i += 1) {
      const current = compiled[i];
      if (current[0].type === 'label') {
        labels[current[1].value] = i;
      }
    }
  }

  async execute(compiled, srcInput, srcObject, depth) {
    let input = srcInput;
    const context = { cursor: 0, labels: {} };
    this.findLabels(compiled, context.labels);
    while (context.cursor < compiled.length) {
      input = await this.executeAction(
        compiled[context.cursor],
        context,
        input,
        srcObject,
        depth
      );
      context.cursor += 1;
    }
    return input;
  }
}

module.exports = DefaultCompiler;
