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

const { uuid } = require('@nlpjs/core');

const localeDangle = '_localization';

class Session {
  constructor(connector = {}, activity = {}) {
    this.activity = activity;
    this.connector = connector;
    this.bot = this.connector.container.get('bot');
    if (!this.connector.settings) {
      this.connector.settings = {};
    }
    this.type = 'message';
    this.serviceUrl = this.activity.serviceUrl;
    this.channelId =
      this.activity.channelId || this.connector.settings.tag || 'emulator';
    this.conversation = {
      id: activity.conversation ? activity.conversation.id : 'conversation',
    };
    this.text = this.activity.text;
    this.recipient = this.activity.from;
    this.inputHint = this.activity.inputHint || 'acceptingInput';
    this.replyToId = this.activity.id;
    this.id = uuid();
    this.from = {
      id: process.env.BACKEND_ID || this.connector.settings.tag || 'emulator',
      name:
        process.env.BACKEND_NAME || this.connector.settings.tag || 'emulator',
    };

    this.template = this.bot ? this.bot.container.get('Template') : undefined;
    this.suggestedActions = undefined;
  }

  beginDialog(context, name) {
    this.bot.dialogManager.beginDialog(context.dialogStack, name);
  }

  endDialog(context) {
    this.bot.dialogManager.endDialog(context.dialogStack);
  }

  restartDialog(context) {
    this.bot.dialogManager.restartDialog(context.dialogStack);
  }

  createMessage() {
    return {
      type: 'message',
      serviceUrl: this.serviceUrl,
      channelId: this.channelId,
      conversation: this.conversation,
      recipient: this.recipient,
      inputHint: this.inputHint,
      replyToId: this.replyToId,
      id: uuid(),
      from: this.from,
    };
  }

  addSuggestedActions(actions) {
    if (typeof actions === 'string') {
      const objActions = [];
      const tokens = actions.split('|');
      for (let i = 0; i < tokens.length; i += 1) {
        const obj = {
          type: 'imBack',
          title: tokens[i],
          value: tokens[i],
        };
        objActions.push(obj);
      }
      this.addSuggestedActions(objActions);
    } else {
      this.suggestedActions = actions;
    }
  }

  async say(srcMessage, context) {
    let message;
    if (typeof srcMessage === 'string') {
      message = this.createMessage();
      if (context && context[localeDangle]) {
        message.text = context[localeDangle].getLocalized(
          context.locale || 'en',
          srcMessage
        );
      } else {
        message.text = srcMessage;
      }
    } else {
      message = srcMessage;
    }
    if (this.suggestedActions) {
      message.suggestedActions = { actions: this.suggestedActions };
      this.suggestedActions = undefined;
    }
    if (context) {
      if (this.template) {
        message = this.template.compile(message, context);
      }
    }
    await this.connector.say(message, this, context);
  }

  async sendCard(card, context) {
    let message = this.createMessage();
    const keys = Object.keys(card);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (!message[key]) {
        message[key] = card[key];
      }
    }
    if (context && this.template) {
      message = this.template.compile(message, context);
    }
    await this.connector.say(message, this, context);
  }
}

module.exports = Session;
