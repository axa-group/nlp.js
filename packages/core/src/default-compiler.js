class DefaultCompiler {
  constructor(container) {
    this.container = container;
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
    if (word.startsWith('#')) {
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
      const line = pipeline[i];
      const words = line.split(' ');
      const tokens = [];
      for (let j = 0; j < words.length; j += 1) {
        tokens.push(this.getTokenFromWord(words[j]));
      }
      result.push(tokens);
    }
    return result;
  }

  executeCall(firstToken, context, input, srcObject, depth) {
    const pipeline = this.container.getPipeline(firstToken.value);
    if (!pipeline) {
      throw new Error(`Pipeline #${firstToken.value} not found.`);
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
      args.push(this.container.resolvePath(step[i].value, input, srcObject));
    }
    const method = currentObject.run || currentObject;
    if (typeof method === 'function') {
      return method.bind(currentObject)(input, ...args);
    }
    return method;
  }

  doGoto(label, srcContext) {
    const context = srcContext;
    const index = context.labels[label];
    context.cursor = index;
  }

  async executeAction(step, context, input, srcObject, depth) {
    const firstToken = step[0];
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
