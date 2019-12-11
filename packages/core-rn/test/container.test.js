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

const { Container, Timer } = require('../src');
const Cloned = require('./assets/cloned');
const Lower = require('./assets/lower');
const Char = require('./assets/char');

class Other {
  constructor() {
    this.name = 'name';
  }

  run(srcInput) {
    const input = srcInput;
    input.text = input.arr.join('');
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

  describe('Resolve Path', () => {
    test('If path is a number, return the number', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      const actual = instance.resolvePath('17', input, srcObject);
      expect(actual).toBe(17);
    });
    test('If path is a boolean true, return the boolean true', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      const actual = instance.resolvePath('true', input, srcObject);
      expect(actual).toBe(true);
    });
    test('If path is a boolean false, return the boolean false', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      const actual = instance.resolvePath('false', input, srcObject);
      expect(actual).toBe(false);
    });
    test('If path is an string double quoted, returns the string without quotes', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      const actual = instance.resolvePath('"hello"', input, srcObject);
      expect(actual).toBe('hello');
    });
    test('If path is an string single quoted, returns the string without quotes', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      const actual = instance.resolvePath("'hello'", {}, input, srcObject);
      expect(actual).toBe('hello');
    });
    test('If the path does not exists throw an error', () => {
      const instance = new Container();
      const input = {};
      const srcObject = new Other();
      expect(() =>
        instance.resolvePath('this.potato.cucumber', {}, input, srcObject)
      ).toThrow('Path not found in pipeline "this.potato.cucumber"');
    });
  });

  describe('Use', () => {
    test('Container can use plugins by class', () => {
      const instance = new Container();
      instance.use(Lower, 'lower');
      expect(instance.factory.lower).toBeDefined();
      expect(instance.factory.lower.instance).toBeInstanceOf(Lower);
    });
    test('Container can use plugins by instance', () => {
      const instance = new Container();
      const lower = new Lower();
      instance.use(lower, 'lower');
      expect(instance.factory.lower).toBeDefined();
      expect(instance.factory.lower.instance).toBe(lower);
    });
    test('Container can use plugins by instance if name is not provided use the name property', () => {
      const instance = new Container();
      const lower = new Lower();
      lower.name = 'lower';
      instance.use(lower);
      expect(instance.factory.lower).toBeDefined();
      expect(instance.factory.lower.instance).toBe(lower);
    });
    test('Plugins can have a method register than is triggered before registering', () => {
      const instance = new Container();
      const lower = new Lower();
      let registered = false;
      lower.register = () => {
        registered = true;
      };
      instance.use(lower, 'lower');
      expect(registered).toBeTruthy();
    });
  });

  describe('Pipeline', () => {
    test('I can register and run a pipeline', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'lower',
        'char',
        'char.filter',
        'this',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'vctor',
        arr: ['v', 'c', 't', 'o', 'r'],
        excludeChars: 'e',
      });
    });
    test('Pipelines can have comments', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'lower',
        'char',
        '// this will filter characters',
        'char.filter',
        'this',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'vctor',
        arr: ['v', 'c', 't', 'o', 'r'],
        excludeChars: 'e',
      });
    });
    test('Default get return floating value', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline(['set floating 7', 'get']);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual(7);
    });
    test('Pipelines can have set and delete and pass parameters', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        'lower',
        'char',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'magdalna',
        excludeChars: 'e',
      });
    });
    test('Pipelines can inc variables by 1', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'inc input.value',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({ value: 8 });
    });
    test('Pipelines can inc variables by a value', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'inc input.value 3',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({ value: 10 });
    });
    test('Pipelines can dec variables by 1', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'dec input.value',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({ value: 6 });
    });
    test('Pipelines can dec variables by a value', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'dec input.value 3',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({ value: 4 });
    });
    test('Pipelines can use eq operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'eq input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(true);
    });
    test('Pipelines can use neq operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'neq input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(false);
    });
    test('Pipelines can use lt operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'lt input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(false);
    });
    test('Pipelines can use le operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'le input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(true);
    });
    test('Pipelines can use gt operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'gt input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(false);
    });
    test('Pipelines can use ge operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set input.value 7',
        'ge input.value 7',
        'get',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toBe(true);
    });
    test('Pipelines can use label and jne operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set counter 0',
        'label first',
        'inc counter',
        'eq counter 10',
        'jne first',
        'get counter',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual(10);
    });
    test('Pipelines can use label and je operator', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set counter 0',
        'label first',
        'inc counter',
        'eq counter 1',
        'je first',
        'get counter',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual(2);
    });
    test('Pipelines can use label and goto operator... but do not do that', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'set counter 0',
        'label first',
        'inc counter',
        'eq counter 10',
        'je last',
        'goto first',
        'label last',
        'get counter',
      ]);
      const input = {};
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual(10);
    });
    test('Pipelines can have sub pipelines', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      instance.registerPipeline('lowerch?r', ['lower', 'char']);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        '$lowerchar',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'magdalna',
        excludeChars: 'e',
      });
    });
    test('Pipelines can be decorated with $super', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      instance.use(Timer);
      instance.registerPipeline('lowerchar', ['lower', 'char']);
      instance.registerPipeline('lowerchar', [
        'timer.start',
        '$super',
        'timer.stop',
      ]);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        '$lowerchar',
        'char.filter',
        'this',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual.elapsed).toBeDefined();
      expect(actual.text).toEqual('magdalna');
    });
    test('Pipelines can get parameters from input', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      instance.registerPipeline('lowerch?r', ['lower', 'char']);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        '$lowerchar',
        'char.filter',
        'this',
        'get input.text',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual('magdalna');
    });
    test('Pipeline task can have parameters', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'lower "magdalena"',
        'char',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'magdalna',
        excludeChars: 'e',
      });
    });
    test('Pipeline task can have reference parameters', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      const pipeline = instance.buildPipeline([
        'lower input.something',
        'char',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        something: 'MAGDALENA',
        excludeChars: 'e',
      };
      const actual = await instance.runPipeline(pipeline, input, new Other());
      expect(actual).toEqual({
        source: 'VECTOR',
        text: 'VECTOR',
        something: 'magdalena',
        excludeChars: 'e',
      });
    });
    test('If the pipeline is recursive then throw an error', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      instance.registerPipeline('lowerchar', ['$lowerchar', 'char']);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        '$lowerchar',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      await expect(
        instance.runPipeline(pipeline, input, new Other())
      ).rejects.toThrow(
        'Pipeline depth is too high: perhaps you are using recursive pipelines?'
      );
    });
    test('If the subpipeline does not exists then throw an error', async () => {
      const instance = new Container();
      instance.register('lower', Lower);
      instance.register('char', Char);
      instance.registerPipeline('lowerchar', ['$lowerchar', 'char']);
      const pipeline = instance.buildPipeline([
        'set input.text "magdalena"',
        '$loperchar',
        'char.filter',
        'this',
        'delete input.arr',
      ]);
      const input = {
        source: 'VECTOR',
        text: 'VECTOR',
        excludeChars: 'e',
      };
      await expect(
        instance.runPipeline(pipeline, input, new Other())
      ).rejects.toThrow('Pipeline $loperchar not found.');
    });
  });

  describe('Register Configuration', () => {
    test('Configuration objects can be registered by name', () => {
      const instance = new Container();
      const conf = { name: 'configuration' };
      instance.registerConfiguration('conf', conf);
      expect(instance.configurations.conf).toBe(conf);
    });
    test('Configuration objects can be retrieved using get', () => {
      const instance = new Container();
      const conf = { name: 'configuration' };
      instance.registerConfiguration('conf', conf);
      const actual = instance.getConfiguration('conf');
      expect(actual).toBe(conf);
    });
    test('Wildcards can be used in the name', () => {
      const instance = new Container();
      const conf = { name: 'configuration' };
      instance.registerConfiguration('conf-??', conf);
      const actual = instance.getConfiguration('conf-en');
      expect(actual).toBe(conf);
    });
    test('If no matching configuration exists return undefined', () => {
      const instance = new Container();
      const conf = { name: 'configuration' };
      instance.registerConfiguration('conf-??', conf);
      const actual = instance.getConfiguration('confs-en');
      expect(actual).toBeUndefined();
    });
  });
});
