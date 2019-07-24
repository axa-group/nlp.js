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

const { ConversationContext } = require('../../lib');

describe('Conversation Context', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const context = new ConversationContext();
      expect(context).toBeDefined();
    });
  });
  describe('Get conversation id', () => {
    test('It should return the conversation id if provided in the session', () => {
      const expected = 'a1b2c3';
      const session = {
        message: {
          address: {
            conversation: {
              id: expected,
            },
          },
        },
      };
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toEqual(expected);
    });
    test('It should return the conversation id if provided in the an v4 session', () => {
      const expected = 'a1b2c3';
      const session = {
        _activity: {
          conversation: {
            id: expected,
          },
        },
      };
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toEqual(expected);
    });
    test('It should return undefined if the session does not provide a conversation identifier', () => {
      const session = {
        message: {
          address: {
            conversation: {
              pid: 'a1b2c3',
            },
          },
        },
      };
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toBeUndefined();
    });
    test('It should return undefined if the session does not provide a conversation', () => {
      const session = {
        message: {
          address: {},
        },
      };
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toBeUndefined();
    });
    test('It should return undefined if the session does not provide an address', () => {
      const session = {
        message: {},
      };
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toBeUndefined();
    });
    test('It should return undefined if the session does not provide a message', () => {
      const session = {};
      const context = new ConversationContext();
      const result = context.getConversationId(session);
      expect(result).toBeUndefined();
    });
    test('It should return undefined if the session is not provided', () => {
      const context = new ConversationContext();
      const result = context.getConversationId(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('Get conversation context', () => {
    test('It should throw an error', () => {
      const context = new ConversationContext();
      expect(() => context.getConversationContext()).toThrow(
        'This method must be implemented by child'
      );
    });
  });
  describe('Set conversation context', () => {
    test('It should throw an error', () => {
      const context = new ConversationContext();
      expect(() => context.setConversationContext()).toThrow(
        'This method must be implemented by child'
      );
    });
  });
});
