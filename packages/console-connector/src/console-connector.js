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

const readline = require('readline');
const { Clonable, containerBootstrap } = require('@nlpjs/core');

class ConsoleConnector extends Clonable {
  constructor(settings = {}, container = undefined) {
    super(
      {
        settings: {},
        container: settings.container || container || containerBootstrap(),
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'console';
    }
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.context = {};
    this.initialize();
  }

  initialize() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.rl.on('line', async (line) => this.hear(line));
  }

  say(message, reference) {
    let text;
    if (typeof reference === 'object' && reference.value) {
      text = reference.value;
    } else if (typeof message === 'string') {
      text = message;
    } else {
      text = message.answer || message.message;
    }
    const botName = this.settings.botName || 'bot';
    if (this.settings.debug && typeof message === 'object' && !reference) {
      const intent = message.intent || '';
      const score = message.score || '';
      // eslint-disable-next-line no-console
      console.log(`${botName}> ${text} (${intent} - ${score})`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${botName}> ${text}`);
    }
  }

  async hear(line) {
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

  close() {
    this.rl.close();
  }

  destroy() {
    this.close();
  }

  exit() {
    process.exit();
  }
}

module.exports = ConsoleConnector;
