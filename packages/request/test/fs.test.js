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

const { fs } = require('../src');

describe('fs', () => {
  describe('readFile', () => {
    test('It can read one file', async () => {
      const actual = await fs.readFile('./packages/request/test/file.txt');
      expect(actual).toEqual('something');
    });
  });

  describe('readFileSync', () => {
    test('It can read one file sync', () => {
      const actual = fs.readFileSync('./packages/request/test/file.txt');
      expect(actual).toEqual('something');
    });
  });

  describe('existsSync', () => {
    test('It should return true if the file exists', () => {
      const actual = fs.existsSync('./packages/request/test/file.txt');
      expect(actual).toBeTruthy();
    });
    test('It should return true if the file do not exists', () => {
      const actual = fs.existsSync('./packages/request/test/file2.txt');
      expect(actual).toBeFalsy();
    });
  });

  describe('lstatSync', () => {
    test('It should return a valid lstat object', () => {
      const actual = fs.lstatSync('./packages/request/test/file.txt');
      expect(actual).toBeDefined();
      expect(actual.isDirectory()).toBeFalsy();
      expect(actual.isFile).toBeTruthy();
    });
  });

  describe('writeFile', () => {
    test('Should return a Promise', () => {
      const actual = fs.writeFile();
      expect(actual.then).toBeDefined();
      expect(typeof actual.then).toEqual('function');
    });
    test('Should throw an Error', async () => {
      await expect(fs.writeFile('https://wwww.something.com')).rejects.toThrow(
        'File cannot be written in web'
      );
    });
  });
});
