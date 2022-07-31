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

const path = require('path');
const fsp = require('fs').promises;
const { Connector } = require('@nlpjs/connector');

const { isJsonObject, trimInput } = require('./helper');

class TestConnector extends Connector {
  initialize() {
    this.settings.settings = this.settings.settings || {};
    this.messages = [];
  }

  say(message, reference) {
    let text;

    if (typeof message === 'string') {
      text = message;
    } else {
      if (message.attachments && message.attachments.length) {
        const attachment = message.attachments[0];
        if (attachment.contentType.includes('card.adaptive')) {
          text =
            attachment.content.speak ||
            message.name ||
            message.id ||
            attachment.content.id;
        }
      }
      if (!text) {
        text =
          message.answer ||
          message.name ||
          message.message ||
          message.text ||
          reference;
      }
    }
    const botName = this.settings.botName || 'bot';
    let botText = typeof text === 'object' ? JSON.stringify(text) : text;
    if (this.settings.debug && typeof message === 'object' && !reference) {
      const intent = message.intent || '';
      const score = message.score || '';
      botText += ` (${intent} - ${score})`;
    }
    if (this.settings.settings.trimInput) {
      botText = trimInput(botText);
    }
    this.messages.push(`${botName}> ${botText}`);
  }

  async hear(line) {
    const userName = this.settings.userName || 'user';
    this.messages.push(`${userName}> ${line}`);
    if (this.onHear) {
      this.onHear(this, line);
    } else {
      const name = `${this.settings.tag}.hear`;
      const pipeline = this.container.getPipeline(name);
      if (pipeline) {
        this.container.runPipeline(
          pipeline,
          { message: line, channel: 'console', app: this.container.name },
          this
        );
      } else {
        const bot = this.container.get('bot');
        if (bot) {
          const { conversationId } = this.settings.settings;
          const conversation = { id: `console000-${conversationId}` };
          const session = this.createSession({
            channelId: 'console',
            ...(isJsonObject(line)
              ? { value: JSON.parse(line) }
              : { text: line }),
            type: 'message',
            address: { conversation },
            // To keep compatibility with msbf
            conversation,
          });
          await bot.process(session);
        } else {
          const nlp = this.container.get('nlp');
          if (nlp) {
            const result = await nlp.process(
              {
                message: line,
                channel: 'console',
                app: this.container.name,
              },
              undefined,
              this.context
            );
            this.say(result);
          } else {
            console.error(`There is no pipeline for ${name}`);
          }
        }
      }
    }
  }

  async parseTestScript(fileName) {
    const testPath = path.dirname(fileName);
    const lines = (await fsp.readFile(fileName, 'utf-8'))
      .split(/\r?\n/)
      .filter((x) => !x.startsWith('#'))
      .filter((x) => x)
      .map((x) => (this.settings.settings.trimInput ? trimInput(x) : x));

    const finalTest = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const inputMatch = line.match(/^import */);
      if (inputMatch) {
        const remoteFilePath = inputMatch.input.split(' ')[1];
        const remoteTestScript = await this.parseTestScript(
          path.join(testPath, remoteFilePath)
        );

        if (remoteTestScript && remoteTestScript.length) {
          finalTest.push(...remoteTestScript);
        }
      } else {
        finalTest.push(line);
      }
    }
    return finalTest;
  }

  async runScript(fileName) {
    this.expected = await this.parseTestScript(fileName);
    this.messages = [];
    const userName = this.settings.userName || 'user';
    for (let i = 0; i < this.expected.length; i += 1) {
      const line = this.expected[i];
      if (line.startsWith(`${userName}>`)) {
        await this.hear(line.slice(userName.length + 2));
      }
    }
  }
}

module.exports = TestConnector;
