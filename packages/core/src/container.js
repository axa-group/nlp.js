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

const { compareWildcars } = require('./helper');

class Container {
  constructor() {
    this.classes = {};
    this.factory = {};
    this.pipelines = {};
    this.configurations = {};
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
      return item.instance;
    }
    const Clazz = item.instance;
    return new Clazz(settings);
  }

  resolvePath(step, input, srcObject) {
    const tokens = step.split('.');
    const token = tokens[0].trim();
    const isnum = /^\d+$/.test(token);
    if (isnum) {
      return parseFloat(token);
    }
    if (token.startsWith('"')) {
      return token.replace(/^"(.+(?="$))"$/, '$1');
    }
    if (token.startsWith("'")) {
      return token.replace(/^'(.+(?='$))'$/, '$1');
    }
    let currentObject = srcObject;
    if (token === 'input' || token === 'output') {
      currentObject = input;
    } else if (token && token !== 'this') {
      currentObject = this.get(token);
    }
    for (let i = 1; i < tokens.length; i += 1) {
      const currentToken = tokens[i];
      if (!currentObject[currentToken]) {
        throw Error(`Path not found in pipeline "${step}"`);
      }
      currentObject = currentObject[currentToken];
    }
    return currentObject;
  }

  setValue(path, valuePath, input, srcObject) {
    const value = this.resolvePath(valuePath, input, srcObject);
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, input, srcObject);
    currentObject[tokens[tokens.length - 1]] = value;
  }

  deleteValue(path, input, srcObject) {
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, input, srcObject);
    delete currentObject[tokens[tokens.length - 1]];
  }

  getValue(path, input, srcObject) {
    const tokens = path.split('.');
    const newPath = tokens.slice(0, -1).join('.');
    const currentObject = this.resolvePath(newPath, input, srcObject);
    return currentObject[tokens[tokens.length - 1]];
  }

  async executeAction(step, input, srcObject) {
    const tokens = step.split(' ');
    if (tokens.length === 0) {
      return undefined;
    }
    const firstToken = tokens[0];
    if (firstToken === 'set') {
      this.setValue(tokens[1], tokens[2], input, srcObject);
      return input;
    }
    if (firstToken === 'delete') {
      this.deleteValue(tokens[1], input, srcObject);
      return input;
    }
    if (firstToken === 'get') {
      return this.getValue(tokens[1], input, srcObject);
    }
    const currentObject = this.resolvePath(tokens[0], input, srcObject);
    const args = [];
    for (let i = 1; i < tokens.length; i += 1) {
      args.push(this.resolvePath(tokens[i], input, srcObject));
    }
    const method = currentObject.run || currentObject;
    if (!method) {
      return currentObject;
    }
    if (typeof method === 'function') {
      return method.bind(currentObject)(input, ...args);
    }
    return method;
  }

  fillPipeline(srcPipeline, index) {
    if (index > 10) {
      throw new Error(
        'Pipeline depth is too high: perhaps you are using recursive pipelines?'
      );
    }
    const result = [];
    let someTag = false;
    for (let i = 0; i < srcPipeline.length; i += 1) {
      const current = srcPipeline[i];
      if (current.startsWith('#')) {
        const otherPipeline = this.getPipeline(current.slice(1));
        if (!otherPipeline) {
          throw new Error(`Pipeline ${current} not found.`);
        }
        for (let j = 0; j < otherPipeline.length; j += 1) {
          result.push(otherPipeline[j]);
        }
        someTag = true;
      } else {
        result.push(current);
      }
    }
    if (someTag) {
      return this.fillPipeline(result, index + 1);
    }
    return result;
  }

  async runPipeline(srcPipeline, input, srcObject) {
    const pipeline = this.fillPipeline(srcPipeline, 0);
    let currentInput = input;
    for (let i = 0; i < pipeline.length; i += 1) {
      const current = pipeline[i];
      currentInput = await this.executeAction(current, currentInput, srcObject);
    }
    return currentInput;
  }

  use(item, name) {
    let instance;
    if (typeof item === 'function') {
      const Clazz = item;
      instance = new Clazz(this);
    } else {
      instance = item;
    }
    if (instance.register) {
      instance.register(this);
    } else {
      this.register(name || instance.name, instance);
    }
  }

  registerPipeline(tag, pipeline) {
    this.pipelines[tag] = pipeline;
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

  registerConfiguration(tag, configuration) {
    this.configurations[tag] = configuration;
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
}

const defaultContainer = new Container();

module.exports = {
  Container,
  defaultContainer,
};
