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

const { XTableUtils } = require('../../lib');

describe('XTableUtils', () => {
  describe('Alpha Index', () => {
    test('Should return the index of an uppercase alpha character', () => {
      for (let i = 0, l = XTableUtils.alphachars.length; i < l; i += 1) {
        expect(XTableUtils.alphaIndex(XTableUtils.alphachars[i])).toEqual(i);
      }
      expect(XTableUtils.alphaIndex('A')).toEqual(0);
      expect(XTableUtils.alphaIndex('Z')).toEqual(25);
    });
    test('Should return -1 if the character is lowercase', () => {
      expect(XTableUtils.alphaIndex('a')).toEqual(-1);
      expect(XTableUtils.alphaIndex('z')).toEqual(-1);
    });
    test('Should return -1 if the character is not an alpha', () => {
      expect(XTableUtils.alphaIndex('.')).toEqual(-1);
      expect(XTableUtils.alphaIndex('*')).toEqual(-1);
      expect(XTableUtils.alphaIndex('1')).toEqual(-1);
    });
  });
  describe('Is Alpha Character', () => {
    test('Should return true if is an uppercase alpha character', () => {
      for (let i = 0, l = XTableUtils.alphachars.length; i < l; i += 1) {
        expect(XTableUtils.isAlphaChar(XTableUtils.alphachars[i])).toBeTruthy();
      }
      expect(XTableUtils.isAlphaChar('A')).toBeTruthy();
      expect(XTableUtils.isAlphaChar('Z')).toBeTruthy();
    });
    test('Should return false if the character is lowercase', () => {
      expect(XTableUtils.isAlphaChar('a')).toBeFalsy();
      expect(XTableUtils.isAlphaChar('z')).toBeFalsy();
    });
    test('Should return false if the character is not an alpha', () => {
      expect(XTableUtils.isAlphaChar('.')).toBeFalsy();
      expect(XTableUtils.isAlphaChar('*')).toBeFalsy();
      expect(XTableUtils.isAlphaChar('1')).toBeFalsy();
    });
  });
  describe('Alpha to number', () => {
    test('Should return correct number for one character', () => {
      expect(XTableUtils.alpha2number('A')).toEqual(0);
      expect(XTableUtils.alpha2number('Z')).toEqual(25);
    });
    test('Should return correct number for several characters', () => {
      expect(XTableUtils.alpha2number('AA')).toEqual(26);
      expect(XTableUtils.alpha2number('AZ')).toEqual(51);
      expect(XTableUtils.alpha2number('BA')).toEqual(52);
      expect(XTableUtils.alpha2number('ZZ')).toEqual(701);
      expect(XTableUtils.alpha2number('AAA')).toEqual(702);
    });
    test('Should throw exception if invalid alpha', () => {
      expect(() => XTableUtils.alpha2number('12')).toThrow('Invalid alpha');
    });
  });
  describe('Number to alpha', () => {
    test('Should return correct alpha value for number', () => {
      expect(XTableUtils.number2alpha(0)).toEqual('A');
      expect(XTableUtils.number2alpha(25)).toEqual('Z');
      expect(XTableUtils.number2alpha(26)).toEqual('AA');
      expect(XTableUtils.number2alpha(51)).toEqual('AZ');
      expect(XTableUtils.number2alpha(52)).toEqual('BA');
      expect(XTableUtils.number2alpha(701)).toEqual('ZZ');
      expect(XTableUtils.number2alpha(702)).toEqual('AAA');
      expect(XTableUtils.number2alpha(1378)).toEqual('BAA');
      expect(XTableUtils.number2alpha(1379)).toEqual('BAB');
      expect(XTableUtils.number2alpha(18278)).toEqual('AAAA');
      expect(XTableUtils.number2alpha(475254)).toEqual('AAAAA');
      expect(XTableUtils.number2alpha(12356630)).toEqual('AAAAAA');
    });
    test('Should throw an error if its not a valid number', () => {
      expect(() => XTableUtils.number2alpha('A')).toThrow('Invalid number');
    });
    test('Should throw an error if its not a negative number', () => {
      expect(() => XTableUtils.number2alpha(-10)).toThrow(
        'Number cannot be negative'
      );
    });
  });
  describe('excel 2 coord', () => {
    test('Should return correct coordinates', () => {
      let result = XTableUtils.excel2coord('A1');
      expect(result).toBeDefined();
      expect(result.column).toEqual(0);
      expect(result.row).toEqual(0);
      result = XTableUtils.excel2coord('AAAAAA123456');
      expect(result).toBeDefined();
      expect(result.column).toEqual(12356630);
      expect(result.row).toEqual(123455);
    });
  });
  describe('coord 2 excel', () => {
    test('Should return correct excel coordinates', () => {
      let result = XTableUtils.coord2excel({ column: 0, row: 0 });
      expect(result).toEqual('A1');
      result = XTableUtils.coord2excel({ column: 12356630, row: 123455 });
      expect(result).toEqual('AAAAAA123456');
    });
  });
  describe('excel 2 range', () => {
    test('Should return correct range', () => {
      const result = XTableUtils.excel2range('A1:AAAAAA123456');
      expect(result).toBeDefined();
      expect(result.topleft).toBeDefined();
      expect(result.bottomright).toBeDefined();
      expect(result.topleft.column).toEqual(0);
      expect(result.topleft.row).toEqual(0);
      expect(result.bottomright.column).toEqual(12356630);
      expect(result.bottomright.row).toEqual(123455);
    });
    test('If is not a range raises an error', () => {
      expect(() => XTableUtils.excel2range('A1B2')).toThrow(
        'Invalid excel range'
      );
    });
  });
});
