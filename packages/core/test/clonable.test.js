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

const Cloned = require('./assets/cloned');

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

describe('Clonable', () => {
  describe('Constructor', () => {
    test('Should create an instance', () => {
      const instance = new Cloned();
      expect(instance).toBeDefined();
    });

    test('Settings can be provided', () => {
      const instance = new Cloned(settings);
      expect(instance.name).toEqual(settings.name);
      expect(instance.keys).toEqual(settings.keys);
      expect(instance.values).toEqual(settings.values);
    });

    test('If a property is already set, do not overwrite it', () => {
      const instance = new Cloned(settings);
      instance.applySettings(instance, { name: 'other', age: 18 });
      expect(instance.name).toEqual(settings.name);
      expect(instance.age).toEqual(18);
    });
  });

  describe('Export', () => {
    test('Export to JSON', () => {
      const instance = new Cloned(settings);
      const json = instance.toJSON();
      expect(json.name).toEqual(settings.name);
      expect(json.keys).toBeUndefined();
      expect(json.values).toEqual([1, 2, 3]);
      expect(json.familyname).toEqual(settings.surname);
      expect(json.nick).toBeUndefined();
    });

    test('Export to JSON if no export settings', () => {
      const instance = new Cloned(settings);
      delete instance.jsonExport;
      const json = instance.toJSON();
      expect(json.name).toEqual(settings.name);
      expect(json.keys).toEqual(settings.keys);
      expect(json.values).toEqual(settings.values);
      expect(json.surname).toEqual(settings.surname);
    });

    test('Export to JSON functions can return no value', () => {
      const instance = new Cloned(settings);
      instance.jsonExport.values = instance.writeValues;
      const json = instance.toJSON();
      expect(json.name).toEqual(settings.name);
      expect(json.keys).toBeUndefined();
      expect(json.values).toEqual([1, 2, 3]);
      expect(json.familyname).toEqual(settings.surname);
    });
  });

  describe('Import', () => {
    test('Import from JSON', () => {
      const instance = new Cloned({ keys: settings.keys });
      const json = {
        name: 'Name',
        values: [1, 2, 3],
        familyname: 'Surname',
      };
      instance.fromJSON(json);
      expect(instance.name).toEqual(settings.name);
      expect(instance.values).toEqual({ a: 1, b: 2, c: 3 });
      expect(instance.surname).toEqual(settings.surname);
    });

    test('Import from JSON if no import settings', () => {
      const instance = new Cloned();
      delete instance.jsonImport;
      instance.fromJSON(settings);
      expect(instance.name).toEqual(settings.name);
      expect(instance.keys).toEqual(settings.keys);
      expect(instance.values).toEqual(settings.values);
      expect(instance.surname).toEqual(settings.surname);
    });

    test('Import from JSON functions can return no value', () => {
      const instance = new Cloned({ keys: settings.keys });
      instance.jsonImport.values = instance.readValues;
      const json = {
        name: 'Name',
        keys: ['a', 'b', 'c'],
        values: [1, 2, 3],
        familyname: 'Surname',
        nick: 7,
      };
      instance.fromJSON(json);
      expect(instance.name).toEqual(settings.name);
      expect(instance.values).toEqual({ a: 1, b: 2, c: 3 });
      expect(instance.surname).toEqual(settings.surname);
    });
  });

  describe('Object to Values', () => {
    test('It should convert an object map to an array of values', () => {
      const instance = new Cloned();
      const arr = instance.objToValues({ a: 1, b: 2, c: 3 });
      expect(arr).toEqual([1, 2, 3]);
    });
  });
});
