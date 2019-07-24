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

const { MemoryConversationContext } = require('../../lib');

describe('MemoryConversation Context', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const context = new MemoryConversationContext();
      expect(context).toBeDefined();
    });
    test('The instance should initialize the properties', () => {
      const context = new MemoryConversationContext();
      expect(context.conversationContexts).toBeDefined();
    });
  });

  describe('Get conversation context', () => {
    test('It should return a new context if if the conversation identifier is valid', async () => {
      const session = {
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
        },
      };
      const context = new MemoryConversationContext();
      const conversationContext = await context.getConversationContext(session);
      expect(conversationContext).toBeDefined();
      expect(conversationContext).toEqual({});
    });
    test('It should reject if the conversation id does not exists', () => {
      const session = {
        message: {
          address: {
            conversation: {},
          },
        },
      };
      const context = new MemoryConversationContext();
      expect.assertions(1);
      context.getConversationContext(session).catch(e => {
        expect(e.message).toEqual('No conversation id found');
      });
    });
    test('It should return the same object if called second time with same conversation id', async () => {
      const session = {
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
        },
      };
      const context = new MemoryConversationContext();
      const conversationContext = await context.getConversationContext(session);
      const conversationContext2 = await context.getConversationContext(
        session
      );
      expect(conversationContext2).toBe(conversationContext);
    });
    test('It should return a different object if called with different conversation id', async () => {
      const session1 = {
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
        },
      };
      const session2 = {
        message: {
          address: {
            conversation: {
              id: 'a1b2c4',
            },
          },
        },
      };
      const context = new MemoryConversationContext();
      const conversationContext1 = await context.getConversationContext(
        session1
      );
      const conversationContext2 = await context.getConversationContext(
        session2
      );
      expect(conversationContext2).not.toBe(conversationContext1);
    });
  });
  describe('Set conversation context', () => {
    test('It should set a conversation context', async () => {
      const context = new MemoryConversationContext();
      const session = {
        message: {
          address: {
            conversation: {
              id: 'a1b2c3',
            },
          },
        },
      };
      const conversationContext = { a: 1 };
      await context.setConversationContext(session, conversationContext);
      const conversationContext1 = await context.getConversationContext(
        session
      );
      expect(conversationContext1).toBe(conversationContext);
    });
    test('It should reject if the conversation id does not exists', () => {
      const session = {
        message: {
          address: {
            conversation: {},
          },
        },
      };
      const context = new MemoryConversationContext();
      expect.assertions(1);
      const conversationContext = { a: 1 };
      context.setConversationContext(session, conversationContext).catch(e => {
        expect(e.message).toEqual('No conversation id found');
      });
    });
  });
});
