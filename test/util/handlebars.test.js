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

const { Handlebars } = require('../../lib');

describe('Handlebars', () => {
  describe('compile', () => {
    it('Should return a function', () => {
      const actual = Handlebars.compile(`Hello {{ something }}`);
      expect(actual).toBeInstanceOf(Function);
    });
  });

  describe('execute', () => {
    it('Should return the same string if no variables', () => {
      const answer = Handlebars.compile('Hello')();
      expect(answer).toEqual('Hello');
    });
    it('Should replace variables from the context', () => {
      const context = {
        name: 'Jesus',
        a: 43,
      }
      const answer = Handlebars.compile('Hello {{ name }} {{ a }}')(context);
      expect(answer).toEqual('Hello Jesus 43');
    });
    it('Should be able to call functions of the context', () => {
      const context = {
        name: 'Jesus',
        a: 43,
        double: x => x * 2
      }
      const answer = Handlebars.compile('Hello {{ name }} {{ double(a) }}')(context);
      expect(answer).toEqual('Hello Jesus 86');
    });
    it('Should be able to do operations with variables of the context', () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: x => x * 2
      }
      const answer = Handlebars.compile('Hello {{ name }} {{ double(a + b) }}')(context);
      expect(answer).toEqual('Hello Jesus 106');
    });
  });
});
