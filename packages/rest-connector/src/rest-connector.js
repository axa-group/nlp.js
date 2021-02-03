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
const { Connector } = require('@nlpjs/connector');

class RestConnector extends Connector {
  registerDefault() {
    this.container.registerConfiguration(
      'rest',
      { log: true, channelId: 'rest' },
      false
    );
  }

  log(level, message) {
    if (this.settings.log) {
      this.container.get('logger')[level](message);
    }
  }

  start() {
    const server = this.container.get('api-server').app;
    if (!server) {
      throw new Error('No api-server found');
    }
    if (!this.settings.apiTag) {
      this.settings.apiTag = '/rest';
    }

    server.get(`${this.settings.apiTag}/token`, async (req, res) => {
      this.log('debug', `GET ${this.settings.apiTag}/token`);
      const id = uuid();
      if (req.query && req.query.locale) {
        const contextManager = this.container.get('context-manager');
        if (contextManager) {
          const activity = { address: { conversation: { id } } };
          const context = await contextManager.getContext({ activity });
          if (context) {
            context.locale = req.query.locale;
          }
          await contextManager.setContext({ activity }, context);
        }
      }
      res.status(200).send({ id });
    });

    server.get(`${this.settings.apiTag}/talk`, async (req, res) => {
      this.log('debug', `GET ${this.settings.apiTag}/talk`);
      console.log(req.query);
      const bot = this.container.get('bot');
      if (bot) {
        const session = this.createSession({
          channelId: 'rest',
          text: req.query.text,
          conversation: { id: req.query.conversationId },
          address: { conversation: { id: req.query.conversationId } },
        });
        session.res = res;
        session.req = req;
        await bot.process(session);
      }
    });
  }

  say(activity, session) {
    if (session.res) {
      session.res.status(200).send(activity);
    }
  }
}

module.exports = RestConnector;
