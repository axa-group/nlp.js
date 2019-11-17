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

const fs = require('fs');
const { compareWildcars } = require('./helper');
const DefaultCompiler = require('./default-compiler');
const logger = require('./logger');

/**
 * Container class
 */
class Container {
  /**
   * Constructor of the class.
   */
  constructor() {
    this.classes = {};
    this.factory = {};
    this.pipelines = {};
    this.configurations = {};
    this.compilers = {};
    this.registerCompiler(DefaultCompiler);
    this.use(logger);
  }

  registerCompiler(Compiler, name) {
    const instance = new Compiler(this);
    this.compilers[name || instance.name] = instance;
  }

  addClass(clazz, name) {
    this.classes[name || clazz.name] = clazz;
  }

  toJSON(instance) {
    const result = instance.toJSON ? instance.toJSON() : { ...instance };
    result.className = instance.constructor.name;
    return result;
  }

  fromJSON(obj, settings) {
    const Clazz = this.classes[obj.className];
    let instance;
    if (Clazz) {
      instance = new Clazz(settings);
      if (instance.fromJSON) {
        instance.fromJSON(obj);
      } else {
        Object.assign(instance, obj);
      }
    } else {
      instance = { ...obj };
    }
    delete instance.className;
    return instance;
  }

  register(name, Clazz, isSingleton = true) {
    const isClass = typeof Clazz === 'function';
    const item = { name, isSingleton };
    if (isSingleton) {
      item.instance = isClass ? new Clazz() : Clazz;
    } else {
      item.instance = isClass ? Clazz : Clazz.constructor;
    }
    this.factory[name] = item;
  }

  get(name, settings) {
    const item = this.factory[name];
    if (!item) {
      return undefined;
    }
    if (item.isSingleton) {
      if (item.instance && item.instance.applySettings) {
        item.instance.applySettings(item.instance.settings, settings);
      }
      return item.instance;
    }
    const Clazz = item.instance;
    return new Clazz(settings, this);
  }

  resolvePathWithType(step, context, input, srcObject) {
    const tokens = step.split('.');
    let token = tokens[0].trim();
    if (!token) {
      token = step.startsWith('.') ? 'this' : 'context';
    }
    const isnum = /^\d+$/.test(token);
    if (isnum) {
      return {
        type: 'literal',
        subtype: 'number',
        src: step,
        value: parseFloat(token),
        context,
        container: this,
      };
    }
    if (token.startsWith('"')) {
      return {
        type: 'literal',
        subtype: 'string',
        src: step,
        value: token.replace(/^"(.+(?="$))"$/, '$1'),
        context,
        container: this,
      };
    }
    if (token.startsWith("'")) {
      return {
        type: 'literal',
        subtype: 'string',
        src: step,
        value: token.replace(/^'(.+(?='$))'$/, '$1'),
        context,
        container: this,
      };
    }
    if (token === 'true') {
      return {
        type: 'literal',
        subtype: 'boolean',
        src: step,
        value: true,
        context,
        container: this,
      };
    }
    if (token === 'false') {
      return {
        type: 'literal',
        subtype: 'boolean',
        src: step,
        value: false,
        context,
        container: this,
      };
    }
    let currentObject = context;
    if (token === 'input' || token === 'output') {
      currentObject = input;
    } else if (token && token !== 'context' && token !== 'this') {
      currentObject = this.get(token) || currentObject[token];
    } else if (token && token === 'context') {
      currentObject = context;
    } else if (token === 'this') {
      currentObject = srcObject;
    }
    for (let i = 1; i < tokens.length; i += 1) {
      const currentToken = tokens[i];
      if (!currentObject || !currentObject[currentToken]) {
        if (i < tokens.length - 1) {
          throw Error(`Path not found in pipeline "${step}"`);
        }
      }
      const prevCurrentObject = currentObject;
      currentObject = currentObject[currentToken];
      if (typeof currentObject === 'function') {
        currentObject = currentObject.bind(prevCurrentObject);
      }
    }
    if (typeof currentObject === 'function') {
      return {
        type: 'function',
        src: step,
        value: currentObject,
        context,
        container: this,
      };
    }
    return {
      type: 'reference',
      src: step,
      value: currentObject,
      context,
      container: this,
    };
  }

  resolvePath(step, context, input, srcObject) {
    const result = this.resolvePathWithType(step, context, input, srcObject);
    return result ? result.value : result;
  }

  setValue(path, valuePath, context, input, srcObject) {
    const value = this.resolvePath(valuePath, context, input, srcObject);
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, context, input, srcObject);
    currentObject[tokens[tokens.length - 1]] = value;
  }

  incValue(path, valuePath, context, input, srcObject) {
    const value = this.resolvePath(valuePath, context, input, srcObject);
    const tokens = path.split('.');
    if (path.startsWith('.')) {
      tokens.push('this');
    }
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, context, input, srcObject);
    currentObject[tokens[tokens.length - 1]] += value;
  }

  decValue(path, valuePath, context, input, srcObject) {
    const value = this.resolvePath(valuePath, context, input, srcObject);
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, context, input, srcObject);
    currentObject[tokens[tokens.length - 1]] -= value;
  }

  eqValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA === valueB;
  }

  neqValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA !== valueB;
  }

  gtValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA > valueB;
  }

  geValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA >= valueB;
  }

  ltValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA < valueB;
  }

  leValue(pathA, pathB, srcContext, input, srcObject) {
    const context = srcContext;
    const valueA = this.resolvePath(pathA, context, input, srcObject);
    const valueB = this.resolvePath(pathB, context, input, srcObject);
    context.floating = valueA <= valueB;
  }

  deleteValue(path, context, input, srcObject) {
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, context, input, srcObject);
    delete currentObject[tokens[tokens.length - 1]];
  }

  getValue(path = 'floating', context, input, srcObject) {
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, context, input, srcObject);
    return currentObject[tokens[tokens.length - 1]];
  }

  async runPipeline(srcPipeline, input, srcObject, depth = 0) {
    if (depth > 10) {
      throw new Error(
        'Pipeline depth is too high: perhaps you are using recursive pipelines?'
      );
    }
    const pipeline =
      typeof srcPipeline === 'string'
        ? this.getPipeline(srcPipeline)
        : srcPipeline;
    if (!pipeline) {
      throw new Error(`Pipeline not found ${srcPipeline}`);
    }
    if (!pipeline.compiler) {
      const tag = JSON.stringify(pipeline);
      this.registerPipeline(tag, pipeline, false);
      const built = this.getPipeline(tag);
      return built.compiler.execute(built.compiled, input, srcObject, depth);
    }
    return pipeline.compiler.execute(
      pipeline.compiled,
      input,
      srcObject,
      depth
    );
  }

  use(item, name) {
    let instance;
    if (typeof item === 'function') {
      const Clazz = item;
      instance = new Clazz({ container: this });
    } else {
      instance = item;
    }
    if (instance.register) {
      instance.register(this);
    }
    const tag = instance.settings ? instance.settings.tag : undefined;
    const itemName =
      name || instance.name || tag || item.name || instance.constructor.name;
    this.register(itemName, instance);
    return itemName;
  }

  buildPipeline(srcPipeline, prevPipeline = []) {
    const pipeline = [];
    if (srcPipeline && srcPipeline.length > 0) {
      for (let i = 0; i < srcPipeline.length; i += 1) {
        const line = srcPipeline[i];
        if (line.trim() === '$super') {
          for (let j = 0; j < prevPipeline.length; j += 1) {
            pipeline.push(prevPipeline[j]);
          }
        } else {
          pipeline.push(line);
        }
      }
    }
    const compilerName =
      !pipeline.length || !pipeline[0].startsWith('// compiler=')
        ? 'default'
        : pipeline[0].slice(12);
    const compiler = this.compilers[compilerName] || this.compilers.default;
    const compiled = compiler.compile(pipeline);
    return {
      pipeline,
      compiler,
      compiled,
    };
  }

  registerPipeline(tag, pipeline, overwrite = true) {
    if (overwrite || !this.pipelines[tag]) {
      const prev = this.getPipeline(tag);
      this.pipelines[tag] = this.buildPipeline(
        pipeline,
        prev ? prev.pipeline : []
      );
    }
  }

  getPipeline(tag) {
    if (this.pipelines[tag]) {
      return this.pipelines[tag];
    }
    const keys = Object.keys(this.pipelines);
    for (let i = 0; i < keys.length; i += 1) {
      if (compareWildcars(tag, keys[i])) {
        return this.pipelines[keys[i]];
      }
    }
    return undefined;
  }

  registerConfiguration(tag, configuration, overwrite = true) {
    if (overwrite || !this.configurations[tag]) {
      this.configurations[tag] = configuration;
    }
  }

  getConfiguration(tag) {
    if (this.configurations[tag]) {
      return this.configurations[tag];
    }
    const keys = Object.keys(this.configurations);
    for (let i = 0; i < keys.length; i += 1) {
      if (compareWildcars(tag, keys[i])) {
        return this.configurations[keys[i]];
      }
    }
    return undefined;
  }

  loadPipelinesFromString(str = '') {
    const lines = str.split(/\n|\r|\r\n/);
    let currentName = '';
    let currentPipeline = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (line !== '') {
        if (line.startsWith('##')) {
          if (currentName) {
            this.registerPipeline(currentName, currentPipeline);
          }
          currentName = line.slice(2).trim();
          currentPipeline = [];
        } else if (currentName) {
          currentPipeline.push(line);
        }
      }
    }
    if (currentName) {
      this.registerPipeline(currentName, currentPipeline);
    }
  }

  loadPipelinesFromFile(fileName) {
    const str = fs.readFileSync(fileName, 'utf8');
    this.loadPipelinesFromString(str);
  }
}

const defaultContainer = new Container();

module.exports = {
  Container,
  defaultContainer,
};
