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

const { Container } = require('@nlpjs/core');
const { TokenizerBert } = require('../src');
const {
  setResponse,
  request,
  resetNumCalls,
  getNumCalls,
} = require('./request-mock');

describe('Tokenizer Bert', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const container = {};
      const tokenizer = new TokenizerBert(container);
      expect(tokenizer).toBeDefined();
      expect(tokenizer.container).toBe(container);
      expect(tokenizer.name).toEqual('tokenizer-bert');
    });
  });

  describe('Tokenize', () => {
    test('It should tokenize a sentence and clear BERT special tokens', async () => {
      resetNumCalls();
      const container = new Container();
      container.register('request', { get: request });
      const tokenizer = new TokenizerBert(container);
      setResponse({
        tokens: [
          '[CLS]',
          '?',
          'this',
          'should',
          'be',
          'token',
          '##ized',
          '.',
          '[SEP]',
        ],
      });
      const input = '?this should be tokenized.';
      const expected = ['this', 'should', 'be', 'token', '##ized'];
      const actual = await tokenizer.tokenize(input);
      const numCalls = getNumCalls();
      expect(numCalls).toEqual(1);
      expect(actual).toEqual(expected);
    });
  });
});
