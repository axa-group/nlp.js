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

const { Clonable, containerBootstrap } = require('@nlpjs/core');
const { ContextManager } = require('@nlpjs/nlp');
const DialogManager = require('./dialog-manager');
const dialogParse = require('./dialog-parse');

class Bot extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container:
          settings.container || container || settings.dock
            ? settings.dock.getContainer()
            : containerBootstrap(),
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = `bot`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.nlp = this.container.get('nlp');
  }

  registerDefault() {
    this.container.registerConfiguration('bot', {}, false);
  }

  async start() {
    await this.nlp.train();
    if (!this.contextManager) {
      this.contextManager = this.container.get('context-manager');
      if (!this.contextManager) {
        this.use(ContextManager);
        this.contextManager = this.container.get('context-manager');
      }
    }
    if (!this.dialogManager) {
      this.dialogManager = this.container.get('dialog-manager');
      if (!this.dialogManager) {
        this.use(DialogManager);
        this.dialogManager = this.container.get('dialog-manager');
      }
    }
    if (this.settings.scripts) {
      this.loadScript(this.settings.scripts);
    }
  }

  async executeAction(session, context, action) {
    if (typeof action === 'string') {
      if (action.startsWith('/_endDialog')) {
        session.endDialog(context);
      } else if (action.startsWith('/_nlp')) {
        const result = await this.nlp.process(session);
        if (result.answer) {
          if (result.answer.startsWith('/')) {
            session.beginDialog(context, result.answer);
          } else {
            session.say(result.answer);
          }
        } else {
          session.say("Sorry, I don't understand");
        }
      } else if (action.startsWith('/')) {
        session.beginDialog(context, action);
      } else if (action.startsWith('?')) {
        context.isWaitingInput = true;
        const text = action.slice(1);
        if (text) {
          context.variableName = text;
        }
      } else {
        session.say(action, context);
      }
    }
  }

  async process(session) {
    const context = await this.contextManager.getContext(session);
    if (!context.dialogStack) {
      context.dialogStack = [];
    }
    if (context.isWaitingInput && context.variableName) {
      context[context.variableName] = session.text;
    }
    context.isWaitingInput = false;
    context.variableName = undefined;
    let lastDialog;
    let lastPosition;
    while (!context.isWaitingInput) {
      const current = this.dialogManager.getNextAction(context.dialogStack);
      if (
        current.dialog === lastDialog &&
        current.lastExecuted === lastPosition
      ) {
        await this.executeAction(session, context, '?');
      } else {
        lastDialog = current.dialog;
        lastPosition = current.lastExecuted;
        await this.executeAction(session, context, current.action);
      }
    }
    await this.contextManager.setContext(session, context);
  }

  addDialog(name, pipeline, settings) {
    this.dialogManager.addDialog(name, pipeline, settings);
  }

  loadScript(fileName) {
    if (Array.isArray(fileName)) {
      for (let i = 0; i < fileName.length; i += 1) {
        this.loadScript(fileName[i]);
      }
    } else {
      const fs = this.container.get('fs');
      const text = fs.readFileSync(fileName);
      const parsed = dialogParse(text);
      for (let i = 0; i < parsed.length; i += 1) {
        const current = parsed[i];
        this.addDialog(current.name, current.actions);
      }
    }
  }
}

module.exports = Bot;
