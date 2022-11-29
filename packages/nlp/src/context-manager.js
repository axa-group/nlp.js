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

const { Clonable } = require('@nlpjs/core');

const dataName = '_data';

class ContextManager extends Clonable {
  constructor(settings = {}, container) {
    super(
      { settings: {}, container: settings.container || container },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = `context-manager`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.contextDictionary = {};
    this.defaultData = {};
  }

  registerDefault() {
    this.container.registerConfiguration('context-manager', {
      tableName: 'context',
    });
  }

  async getInputContextId(input) {
    let result;
    if (this.onGetInputContextId) {
      result = await this.onGetInputContextId(input);
    }
    if (!result && input && input.activity) {
      if (input.activity.address && input.activity.address.conversation) {
        result = input.activity.address.conversation.id;
      } else if (input.activity.conversation) {
        result = input.activity.conversation.id;
      }
    }
    return result;
  }

  async getContext(input) {
    const id = await this.getInputContextId(input);
    let result;
    if (id) {
      if (this.settings.tableName) {
        const database = this.container
          ? this.container.get('database')
          : undefined;
        if (database) {
          result = (await database.findOne(this.settings.tableName, {
            conversationId: id,
          })) || { conversationId: id };
        }
      }
      if (!result) {
        result = this.contextDictionary[id] || { conversationId: id };
      }
    } else {
      result = {};
    }
    result[dataName] = this.defaultData;
    return result;
  }

  async setContext(input, context) {
    const logger = this.container.get('logger');
    const id = await this.getInputContextId(input);
    if (id) {
      if (!context.id) {
        const savedContext = await this.getContext(input);
        if (savedContext) {
          context.id = savedContext.id;
        }
      }
      const keys = Object.keys(context);
      const clone = { conversationId: id };
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (!key.startsWith('_')) {
          clone[key] = context[key];
        }
      }
      if (this.settings.tableName) {
        const database = this.container
          ? this.container.get('database')
          : undefined;
        if (database) {
          await database.save(this.settings.tableName, clone);
        } else {
          this.contextDictionary[id] = clone;
        }
      } else {
        this.contextDictionary[id] = clone;
      }
      if (this.onCtxUpdate) {
        logger.debug(`emmitting event onCtxUpdate...`);
        await this.onCtxUpdate(clone);
      }
    }
  }

  async resetConversations() {
    for (const cid of Object.keys(this.contextDictionary)) {
      await this.resetConversation(cid);
    }
  }

  async resetConversation(cid) {
    const logger = this.container.get('logger');
    logger.debug(`resetting context in conversation: ${cid}`);
    const conversationCtx = this.contextDictionary[cid];
    Object.keys(conversationCtx).forEach((convCtxKey) => {
      delete conversationCtx[convCtxKey];
    });
    this.contextDictionary[cid].dialogStack = [];
    this.contextDictionary[cid].variableName = undefined;
  }
}

module.exports = ContextManager;
