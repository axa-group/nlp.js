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

const { Container } = require('../src');
const Cloned = require('./assets/cloned');
const Lower = require('./assets/lower');
const Char = require('./assets/char');

class Other {
  constructor() {
    this.name = 'name';
  }

  run(srcInput) {
    const input = srcInput;
    input.str = input.arr.join('');
    return input;
  }
}

const settings = {
  name: 'Name',
  surname: 'Surname',
  keys: ['a', 'b', 'c'],
  values: {
    a: 1,
    b: 2,
    c: 3,
  },
};

describe('Container', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const instance = new Container();
      expect(instance).toBeDefined();
    });
  });

  describe('Add Class', () => {
    test('I can add classes by name', () => {
      const instance = new Container();
      instance.addClass(Cloned, 'Cloned');
      expect(instance.classes.Cloned).toBe(Cloned);
    });
    test('If the name of the class is not provided extract it from class', () => {
      const instance = new Container();
      instance.addClass(Cloned);
      expect(instance.classes.Cloned).toBe(Cloned);
    });
  });

  describe('To JSON', () => {
    test('It can export to JSON including class name', () => {
      const other = new Other();
      const instance = new Container();
      const actual = instance.toJSON(other);
      expect(actual).toEqual({ name: 'name', className: 'Other' });
    });

    test('If the exported item contains a toJSON method use it', () => {
      const cloned = new Cloned(settings);
      const instance = new Container();
      const json = instance.toJSON(cloned);
      expect(json.name).toEqual(settings.name);
      expect(json.keys).toBeUndefined();
      expect(json.values).toEqual([1, 2, 3]);
      expect(json.familyname).toEqual(settings.surname);
      expect(json.nick).toBeUndefined();
      expect(json.className).toEqual('Cloned');
    });
  });

  describe('From JSON', () => {
    test('If the class is registered, then create an instance', () => {
      const other = new Other();
      const instance = new Container();
      instance.addClass(Other);
      const json = instance.toJSON(other);
      const actual = instance.fromJSON(json);
      expect(actual).toBeInstanceOf(Other);
      expect(actual.className).toBeUndefined();
      expect(actual.name).toEqual('name');
    });
    test('If the class is registered and Clonable, then create an instance', () => {
      const cloned = new Cloned(settings);
      const instance = new Container();
      instance.addClass(Cloned);
      const json = instance.toJSON(cloned);
      const actual = instance.fromJSON(json, { keys: settings.keys });
      expect(actual).toBeInstanceOf(Cloned);
      expect(actual.name).toEqual(settings.name);
      expect(actual.values).toEqual({ a: 1, b: 2, c: 3 });
      expect(actual.surname).toEqual(settings.surname);
      expect(actual.className).toBeUndefined();
    });
    test('If the class is not registered, then clone the instance', () => {
      const other = new Other();
      const instance = new Container();
      const json = instance.toJSON(other);
      const actual = instance.fromJSON(json);
      expect(actual).toBeInstanceOf(Object);
      expect(actual.className).toBeUndefined();
      expect(actual.name).toEqual('name');
    });
  });

  describe('Register', () => {
    test('An instance can be registered as singleton', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(other);
      expect(instance.factory.other.isSingleton).toBeTruthy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('A class can be registered as singleton, so an instance will be created', () => {
      const instance = new Container();
      instance.register('other', Other);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBeInstanceOf(Other);
      expect(instance.factory.other.isSingleton).toBeTruthy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('A class can be registered as no singleton', () => {
      const instance = new Container();
      instance.register('other', Other, false);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(Other);
      expect(instance.factory.other.isSingleton).toBeFalsy();
      expect(instance.factory.other.name).toEqual('other');
    });
    test('If an instance is registered as no singleton, its constructor is extracted', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other, false);
      expect(instance.factory.other).toBeDefined();
      expect(instance.factory.other.instance).toBe(Other);
      expect(instance.factory.other.isSingleton).toBeFalsy();
      expect(instance.factory.other.name).toEqual('other');
    });
  });

  describe('Get', () => {
    test('If no item exists with this name, return undefined', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      const actual = instance.get('another');
      expect(actual).toBeUndefined();
    });
    test('We can get a singleton instance and should be the original object', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other);
      const actual = instance.get('other');
      expect(actual).toBe(other);
    });
    test('We can get a singleton class and everytime should be the same object', () => {
      const instance = new Container();
      instance.register('other', Other);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      const actual2 = instance.get('other');
      expect(actual2).toBe(actual);
    });
    test('If is not a singleton, return different instances', () => {
      const instance = new Container();
      const other = new Other();
      instance.register('other', other, false);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      expect(actual).not.toBe(other);
      const actual2 = instance.get('other');
      expect(actual2).toBeInstanceOf(Other);
      expect(actual2).not.toBe(other);
      expect(actual2).not.toBe(actual);
    });
    test('If is not a singleton and registering a class, return different instances', () => {
      const instance = new Container();
      instance.register('other', Other, false);
      const actual = instance.get('other');
      expect(actual).toBeInstanceOf(Other);
      const actual2 = instance.get('other');
      expect(actual2).toBeInstanceOf(Other);
      expect(actual2).not.toBe(actual);
    });
  });

  describe('Pipeline', () => {
    test('I can register and run a pipeline', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = ['lower', 'char', 'char.filter', ''];
      const input = {
        source: 'VECTOR',
        str: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        str: 'vctor',
        arr: ['v', 'c', 't', 'o', 'r'],
        excludeChars: 'e',
      });
    });
  });
});
