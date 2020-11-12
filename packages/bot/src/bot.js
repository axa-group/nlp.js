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
const { JavascriptCompiler } = require('@nlpjs/evaluator');
const DialogManager = require('./dialog-manager');
const { loadScript, getDialogName } = require('./dialog-parse');

class Bot extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container:
          settings.container ||
          container ||
          (settings.dock ? settings.dock.getContainer() : containerBootstrap()),
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
    this.actions = {};
  }

  registerDefault() {
    this.container.registerConfiguration('bot', {}, false);
  }

  async start() {
    if (this.nlp) {
      await this.nlp.train();
    }
    if (!this.evaluator) {
      this.evaluator = new JavascriptCompiler({ container: this.container });
    }
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
      await this.loadScript(this.settings.scripts);
    }
  }

  registerAction(name, fn) {
    this.actions[name] = fn;
  }

  async executeAction(session, context, action) {
    if (typeof action === 'string') {
      if (action.startsWith('/')) {
        session.beginDialog(context, action);
      } else {
        session.say(action, context);
      }
    } else {
      let shouldContinue = true;
      if (action.condition) {
        shouldContinue = await this.evaluator.evaluate(
          action.condition,
          context
        );
      }
      if (shouldContinue) {
        let fn;
        switch (action.command) {
          case 'say':
            session.say(action.text, context);
            break;
          case 'endDialog':
            session.endDialog(context);
            break;
          case 'beginDialog':
            session.beginDialog(
              context,
              action.dialog.startsWith('/')
                ? action.dialog
                : `/${action.dialog}`
            );
            break;
          case 'ask':
            context.isWaitingInput = true;
            context.variableName = action.variableName;
            break;
          case 'nlp':
            if (this.nlp) {
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
            } else {
              session.say("Sorry, I don't understand");
            }
            break;
          case 'call':
            fn = this.actions[action.functionName];
            if (fn) {
              await fn(session, context, action.parameters);
            } else {
              console.log(`Unknown function "${action.functionName}"`);
            }
            break;
          case 'inc':
            if (!context[action.variableName]) {
              context[action.variableName] = 0;
            }
            context[action.variableName] += action.increment;
            break;
          case 'set':
            if (this.evaluator) {
              context[action.variableName] = await this.evaluator.evaluate(
                action.value,
                context
              );
            } else {
              context[action.variableName] = action.value;
            }
            break;
          default:
            console.log(`Unknown command executing action "${action.command}"`);
            break;
        }
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
        await this.executeAction(session, context, { command: 'ask' });
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

  getEntityOption(line) {
    const tokens = line
      .split(':')
      .map((x) => x.trim())
      .filter((x) => x);
    return {
      option: tokens[0],
      texts: tokens[1]
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x),
    };
  }

  buildAction(command, current) {
    return {
      command,
      condition: current.condition,
      settings: current.settings,
    };
  }

  async loadScript(fileName) {
    const fs = this.container.get('fs');
    const script = await loadScript(fileName, fs);
    const intents = {};
    const entities = {};
    let locale = 'en';
    let currentIntent = {};
    let currentEntity = {};
    let state;
    const dialogs = [];
    let currentDialog = {};
    let action;
    let tokens;
    for (let i = 0; i < script.length; i += 1) {
      const current = script[i];
      switch (current.type) {
        case 'language':
          locale = current.line;
          break;
        case 'comment':
          break;
        case 'intent':
          currentIntent = {
            intent: current.line,
            utterances: [],
            tests: [],
            answers: [],
          };
          if (!intents[locale]) {
            intents[locale] = [];
          }
          intents[locale].push(currentIntent);
          break;
        case 'entity':
          currentEntity = {
            name: current.line,
          };
          if (!entities[locale]) {
            entities[locale] = [];
          }
          entities[locale].push(currentEntity);
          state = 'entity';
          break;
        case 'utterances':
          state = 'utterances';
          break;
        case 'answers':
          state = 'answers';
          break;
        case 'tests':
          state = 'tests';
          break;
        case 'regex':
          currentEntity.regex = current.srcLine;
          break;
        case '-':
          if (state) {
            switch (state) {
              case 'utterances':
                currentIntent.utterances.push(current.line);
                break;
              case 'answers':
                currentIntent.answers.push(current.line);
                break;
              case 'tests':
                currentIntent.tests.push(current.line);
                break;
              case 'entity':
                if (!currentEntity.options) {
                  currentEntity.options = [];
                }
                currentEntity.options.push(this.getEntityOption(current.line));
                break;
              default:
                console.log(`Unknown state "${state}"`);
                break;
            }
          }
          break;
        case 'dialog':
          currentDialog = { name: getDialogName(current.line), actions: [] };
          dialogs.push(currentDialog);
          break;
        case 'run':
          action = this.buildAction('beginDialog', current);
          action.dialog = current.line;
          currentDialog.actions.push(action);
          break;
        case 'say':
          action = this.buildAction('say', current);
          action.text = current.line;
          currentDialog.actions.push(action);
          break;
        case 'ask':
          action = this.buildAction('ask', current);
          action.variableName = current.line;
          currentDialog.actions.push(action);
          break;
        case 'nlp':
          action = this.buildAction('nlp', current);
          currentDialog.actions.push(action);
          break;
        case 'call':
          action = this.buildAction('call', current);
          tokens = current.line.split(' ');
          [action.functionName] = tokens;
          action.parameters = tokens.slice(1);
          currentDialog.actions.push(action);
          break;
        case 'inc':
          action = this.buildAction('inc', current);
          tokens = current.line.split(' ');
          [action.variableName] = tokens;
          action.increment = parseInt(tokens[1] || '1', 10);
          currentDialog.actions.push(action);
          break;
        case 'set':
          action = this.buildAction('set', current);
          tokens = current.line.split(' ');
          [action.variableName] = tokens;
          action.value = current.line.slice(tokens[0].length + 1);
          currentDialog.actions.push(action);
          break;
        default:
          console.log('UNKNOWN COMMAND');
          console.log(current);
          break;
      }
    }
    const intentKeys = Object.keys(intents);
    const nlp = this.container.get('nlp');
    if (nlp) {
      for (let i = 0; i < intentKeys.length; i += 1) {
        const currentLocale = intentKeys[i];
        const corpus = {
          locale,
          data: intents[currentLocale],
        };
        const currentEntities = entities[currentLocale];
        if (currentEntities.length > 0) {
          corpus.entities = {};
          for (let j = 0; j < currentEntities.length; j += 1) {
            const entity = currentEntities[j];
            if (entity.regex) {
              corpus.entities[entity.name] = entity.regex;
            } else {
              const options = {};
              corpus.entities[entity.name] = { options };
              for (let k = 0; k < entity.options.length; k += 1) {
                const option = entity.options[k];
                options[option.option] = option.texts;
              }
            }
          }
        }
        nlp.addCorpus(corpus);
      }
      await nlp.train();
    }
    for (let i = 0; i < dialogs.length; i += 1) {
      this.addDialog(dialogs[i].name, dialogs[i].actions);
    }
  }
}

module.exports = Bot;
