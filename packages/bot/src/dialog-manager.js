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

async function defaultAction(session, context) {
  const nlp = this.container.get('nlp');
  if (nlp) {
    const result = await nlp.process(session.text);
    session.say(result.answer || "Sorry, I don't understand", context);
  } else {
    session.say('Sorry, I have problems connecting to my brain', context);
  }
}

class DialogManager extends Clonable {
  constructor(settings = {}, container) {
    super(
      { settings: {}, container: settings.container || container },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = `dialog-manager`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.dialogs = {};
  }

  registerDefault() {}

  addDialog(name, pipeline, settings) {
    this.dialogs[name] = {
      name,
      pipeline,
      settings: settings || {},
    };
  }

  getDialog(name) {
    return this.dialogs[name];
  }

  getNextActionDialog(stack) {
    if (stack.length === 0) {
      this.beginDialog(stack, '/');
    }
    return stack[stack.length - 1];
  }

  getNextAction(stack) {
    const actionDialog = this.getNextActionDialog(stack);
    const position =
      actionDialog.lastExecuted === undefined
        ? 0
        : actionDialog.lastExecuted + 1;
    const dialog = this.getDialog(actionDialog.dialog);
    if (!dialog) {
      return { dialog: '/', lastExecuted: 0, action: defaultAction };
    }
    if (position >= dialog.pipeline.length) {
      actionDialog.lastExecuted = dialog.pipeline.length;
      if (actionDialog.dialog === '/') {
        dialog.lastExecuted = undefined;
        while (stack.pop()) {
          // do nothing
        }
        return {
          dialog: '/',
          lastExecuted: undefined,
          action: { command: 'ask' },
        };
      }
      return {
        dialog: actionDialog.dialog,
        lastExecuted: actionDialog.lastExecuted,
        action: { command: 'endDialog' },
      };
    }
    actionDialog.lastExecuted = position;
    return {
      dialog: actionDialog.dialog,
      lastExecuted: actionDialog.lastExecuted,
      action: dialog.pipeline[actionDialog.lastExecuted],
    };
  }

  beginDialog(stack, dialogName) {
    stack.push({ dialog: dialogName, lastExecuted: undefined });
  }

  endDialog(stack) {
    stack.pop();
  }

  restartDialog(stack) {
    while (stack.length > 0) {
      this.endDialog(stack);
    }
    this.beginDialog(stack, '/#');
  }

  existsDialog(dialog) {
    return Object.keys(this.dialogs).includes(dialog);
  }
}

module.exports = DialogManager;
