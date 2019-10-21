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

class Other {
  constructor() {
    this.name = 'name';
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
  });
});
