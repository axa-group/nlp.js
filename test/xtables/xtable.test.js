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

const { XTable } = require('../../lib');

const matrix1 = [
  [{ w: 'Table 1' }],
  [{ w: 'id' }, { w: 'name' }],
  [{ w: 1 }, { w: 'name 1' }],
  [{ w: 2 }, { w: 'name 2' }],
  [{ w: 3 }, { w: 'name 3' }],
  [{ w: 4 }, { w: 'name 4' }],
  [{ w: 5 }, { w: 'name 5' }],
];

const matrix2 = [
  [{ w: 'Table 2' }],
  [{ w: 'id' }, { w: 'name' }, undefined],
  [{ w: 1 }, { w: 'name 1' }, { w: 'yes' }],
  [{ w: 2 }, { w: 'name 2' }, { w: 'no' }],
  [{ w: 3 }, { w: 'name 3' }, { w: undefined }],
  [{ w: 4 }, { w: 'name 4' }, { w: 'yes' }],
  [{ w: 5 }, { w: 'name 5' }, { w: 'no' }],
];

describe('XTable', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const table = new XTable();
      expect(table).toBeDefined();
      expect(table.name).toEqual('');
      expect(table.keys).toEqual([]);
      expect(table.data).toEqual([]);
    });
    test('It should create an instance from a matrix', () => {
      const table = new XTable(matrix1);
      expect(table.name).toEqual('Table 1');
      expect(table.keys).toEqual(['id', 'name']);
      expect(table.data).toHaveLength(5);
      expect(table.data[0].id).toEqual(1);
      expect(table.data[0].name).toEqual('name 1');
    });
    test('It should create a column name for columns without it', () => {
      const table = new XTable(matrix2);
      expect(table.name).toEqual('Table 2');
      expect(table.keys).toEqual(['id', 'name', '_column_2']);
    });
  });
  describe('Match', () => {
    test('Return true if a row match the given query', () => {
      const table = new XTable(matrix2);
      const result = table.match(table.data[2], { id: 3 });
      expect(result).toBeTruthy();
    });
    test('Return true if a row match the given query even with several parameters', () => {
      const table = new XTable(matrix2);
      const result = table.match(table.data[2], { id: 3, name: 'name 3' });
      expect(result).toBeTruthy();
    });
    test('Return false if a row does not match the given query', () => {
      const table = new XTable(matrix2);
      const result = table.match(table.data[2], { id: 2 });
      expect(result).toBeFalsy();
    });
    test('Return false if a row does not match all the terms of the given query', () => {
      const table = new XTable(matrix2);
      const result = table.match(table.data[2], { id: 3, name: 'name 2' });
      expect(result).toBeFalsy();
    });
  });
  describe('Find', () => {
    test('We can search all rows matching a query', () => {
      const table = new XTable(matrix2);
      const result = table.find({ _column_2: 'yes' });
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(1);
      expect(result[1].id).toEqual(4);
    });
    test('If no matchs found, return an empty array', () => {
      const table = new XTable(matrix2);
      const result = table.find({ _column_2: 'meh' });
      expect(result).toEqual([]);
    });
  });
  describe('Find One', () => {
    test('We can search the first row matching a query', () => {
      const table = new XTable(matrix2);
      const result = table.findOne({ _column_2: 'yes' });
      expect(result).toEqual({ id: 1, name: 'name 1', _column_2: 'yes' });
    });
    test('If no matchs found, return undefined', () => {
      const table = new XTable(matrix2);
      const result = table.findOne({ _column_2: 'meh' });
      expect(result).toBeUndefined();
    });
  });
});
