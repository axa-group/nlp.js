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

class Container {
  constructor() {
    this.classes = {};
    this.factory = {};
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

  async runPipeline(pipeline, input, srcObject) {
    let currentInput = input;
    for (let i = 0; i < pipeline.length; i += 1) {
      const current = pipeline[i];
      const tokens = current.split('.');
      let currentObject;
      if (tokens[0]) {
        currentObject =
          tokens[0] === 'output' ? currentInput : this.get(tokens[0]);
      } else {
        currentObject = srcObject;
      }
      const method = currentObject[tokens[1] || 'run'];
      if (typeof method === 'function') {
        currentInput = await method.bind(currentObject)(currentInput);
      } else {
        currentInput = method;
      }
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
}

const defaultContainer = new Container();

module.exports = {
  Container,
  defaultContainer,
};
