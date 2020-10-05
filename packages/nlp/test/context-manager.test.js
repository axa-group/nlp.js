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

const { ContextManager } = require('../src');

const dataName = '_data';

describe('ContextManager', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const contextManager = new ContextManager();
      expect(contextManager).toBeDefined();
    });
    test('Instance should contain default settings', () => {
      const contextManager = new ContextManager();
      expect(contextManager.settings).toBeDefined();
      expect(contextManager.settings.tableName).toEqual('context');
    });
  });

  describe('getInputContextId', () => {
    test('It should return undefined if no way to get the id', async () => {
      const contextManager = new ContextManager();
      const actual = await contextManager.getInputContextId({});
      expect(actual).toBeUndefined();
    });
    test('If onGetInputContextId is defined, then get the id from it', async () => {
      const contextManager = new ContextManager();
      contextManager.onGetInputContextId = () => 7;
      const actual = await contextManager.getInputContextId({});
      expect(actual).toEqual(7);
    });
    test('If the input contains a valid activity, then return conversation id', async () => {
      const contextManager = new ContextManager();
      const actual = await contextManager.getInputContextId({
        activity: { address: { conversation: { id: 7 } } },
      });
      expect(actual).toEqual(7);
    });
  });

  describe('getContext', () => {
    test('if no id then return empty object', async () => {
      const contextManager = new ContextManager();
      const actual = await contextManager.getContext({});
      expect(actual).toBeDefined();
      expect(actual).toEqual({ [dataName]: {} });
    });
    test('if id then return context object', async () => {
      const contextManager = new ContextManager();
      const actual = await contextManager.getContext({
        activity: { address: { conversation: { id: 7 } } },
      });
      expect(actual).toBeDefined();
      expect(actual).toEqual({ conversationId: 7, [dataName]: {} });
    });
  });

  describe('setContext', () => {
    test('If no id, do not crash', async () => {
      const contextManager = new ContextManager();
      const context = {};
      await contextManager.setContext({}, context);
      expect(contextManager.contextDictionary).toEqual({});
    });
    test('If input has id, then save the context', async () => {
      const contextManager = new ContextManager();
      const context = { something: 'abc' };
      await contextManager.setContext(
        { activity: { address: { conversation: { id: 7 } } } },
        context
      );
      expect(contextManager.contextDictionary[7]).toBeDefined();
      expect(contextManager.contextDictionary[7]).toEqual({
        ...context,
        conversationId: 7,
      });
    });
  });
});
