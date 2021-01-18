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

const { Connector } = require('@nlpjs/connector');
const { dialogflow } = require('actions-on-google');

class DialogflowConnector extends Connector {
  initialize() {
    this.app = dialogflow();
    this.app.intent('Default Fallback Intent', async (conv) => {
      await this.hear(conv);
    });
    const server = this.container.get('api-server').app;
    if (!this.settings.apiTag) {
      this.settings.apiTag = '/fulfillment';
    }
    server.post(this.settings.apiTag, this.app);
  }

  async hear(conv) {
    if (conv.body.queryResult.queryText) {
      if (this.onHear) {
        await this.onHear(this, conv);
      } else {
        const bot = this.container.get('bot');
        if (bot) {
          let conversationId;
          if (conv.request && conv.request.conversation) {
            conversationId = conv.request.conversation.conversationId;
          }
          if (!conversationId) {
            conversationId = conv.body.session;
          }
          const session = this.createSession({
            channelId: 'dialogflow',
            text: conv.body.queryResult.queryText,
            address: {
              conversation: { id: conversationId },
            },
          });
          session.conv = conv;
          await bot.process(session);
        } else {
          const nlp = this.container.get('nlp');
          if (nlp) {
            const result = await nlp.process(
              {
                message: conv.body.queryResult.queryText,
                channel: 'dialogflow',
                app: this.container.name,
              },
              undefined,
              this.context
            );
            this.say({ text: result.answer }, { connector: { conv } });
          }
        }
      }
    }
  }

  say(message, session) {
    session.conv.ask(message.text);
  }
}

module.exports = DialogflowConnector;
