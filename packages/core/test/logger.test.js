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

const logger = require('../src/logger');

global.console = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
  trace: jest.fn(),
};

describe('Logger', () => {
  describe('Constructor', () => {
    test('Constructor', () => {
      expect(logger).toBeDefined();
    });
  });

  describe('Logger methods', () => {
    test('debug', () => {
      logger.debug('hello world');
      expect(console.debug).toHaveBeenCalledWith('hello world');
    });
    test('info', () => {
      logger.info('hello world');
      expect(console.info).toHaveBeenCalledWith('hello world');
    });
    test('warn', () => {
      logger.warn('hello world');
      expect(console.warn).toHaveBeenCalledWith('hello world');
    });
    test('log', () => {
      logger.log('hello world');
      expect(console.log).toHaveBeenCalledWith('hello world');
    });
    test('error', () => {
      logger.error('hello world');
      expect(console.error).toHaveBeenCalledWith('hello world');
    });
    test('trace', () => {
      logger.trace('hello world');
      expect(console.trace).toHaveBeenCalledWith('hello world');
    });
    test('fatal', () => {
      logger.fatal('hello world');
      expect(console.error).toHaveBeenCalledWith('hello world');
    });
  });
});
