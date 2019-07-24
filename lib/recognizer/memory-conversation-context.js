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

const ConversationContext = require('./conversation-context');

/**
 * In memory conversation context manager.
 */
class MemoryConversationContext extends ConversationContext {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.conversationContexts = {};
  }

  /**
   * Gets the conversation context from the session.
   * @param {Object} session Chatbot session of the conversation.
   * @returns {Promise<Object>} Promise to resolve the conversation context.
   */
  getConversationContext(session) {
    return new Promise((resolve, reject) => {
      const conversationId = this.getConversationId(session);
      if (!conversationId) {
        return reject(new Error('No conversation id found'));
      }
      if (!this.conversationContexts[conversationId]) {
        this.conversationContexts[conversationId] = {};
      }
      return resolve(this.conversationContexts[conversationId]);
    });
  }

  setConversationContext(session, context) {
    return new Promise((resolve, reject) => {
      const conversationId = this.getConversationId(session);
      if (!conversationId) {
        return reject(new Error('No conversation id found'));
      }
      this.conversationContexts[conversationId] = context;
      return resolve();
    });
  }
}

module.exports = MemoryConversationContext;
