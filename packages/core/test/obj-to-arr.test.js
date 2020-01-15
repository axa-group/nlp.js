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

const ObjToArr = require('../src/obj-to-arr');
const { Container } = require('../src/container');
const containerBootstrap = require('../src/container-bootstrap');

describe('ObjToArr', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const objToArr = new ObjToArr();
      expect(objToArr).toBeDefined();
    });
  });

  describe('Static objToArr', () => {
    test('It should transform an object to an array', () => {
      const obj = { when: 1, the: 1, moon: 1 };
      const actual = ObjToArr.objToArr(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('If an empty object is provided return empty array', () => {
      const obj = {};
      const actual = ObjToArr.objToArr(obj);
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container', () => {
    test('I can register it as a plugin', () => {
      const container = new Container();
      container.use(ObjToArr);
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('I can register it as a plugin and use it inside an input as tokens property', () => {
      const container = new Container();
      container.use(ObjToArr);
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run({ tokens: obj });
      const expected = { tokens: ['when', 'the', 'moon'] };
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container Bootstrap', () => {
    test('It is already registered as a plugin', () => {
      const container = containerBootstrap();
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('It is already registered as a plugin and can use it inside an input as tokens property', () => {
      const container = containerBootstrap();
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run({ tokens: obj });
      const expected = { tokens: ['when', 'the', 'moon'] };
      expect(actual).toEqual(expected);
    });
  });
});
