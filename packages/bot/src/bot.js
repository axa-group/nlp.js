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
const { loadScript, getDialogName, trimBetween } = require('./dialog-parse');
const {
  validatorEmail,
  validatorURL,
  validatorIP,
  validatorIPv4,
  validatorIPv6,
  validatorPhoneNumber,
  validatorNumber,
  validatorInteger,
  validatorDate,
} = require('./validators');
const BotLocalization = require('./bot-localization');

const localeDangle = '_localization';

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
    this.localization = new BotLocalization();
  }

  registerDefault() {
    this.actions = {};
    this.validators = {};
    this.cards = {};
    this.container.registerConfiguration('bot', {}, false);
    this.registerValidator('email', validatorEmail);
    this.registerValidator('url', validatorURL);
    this.registerValidator('ip', validatorIP);
    this.registerValidator('ipv4', validatorIPv4);
    this.registerValidator('ipv6', validatorIPv6);
    this.registerValidator('phone', validatorPhoneNumber);
    this.registerValidator('number', validatorNumber);
    this.registerValidator('integer', validatorInteger);
    this.registerValidator('date', validatorDate);
  }

  async start() {
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
    if (this.nlp) {
      await this.nlp.train();
    }
  }

  registerAction(name, fn) {
    this.actions[name] = fn;
  }

  registerValidator(name, fn) {
    this.validators[name.toLowerCase()] = fn;
  }

  getValidator(name) {
    return this.validators[name.toLowerCase()];
  }

  registerCard(name, card) {
    if (typeof name === 'string' && card) {
      this.cards[name] = card;
    } else if (Array.isArray(name)) {
      for (let i = 0; i < name.length; i += 1) {
        this.registerCard(name[i]);
      }
    } else {
      this.registerCard(name.name, name.card || name);
    }
  }

  async setVariable(context, variableName, variableValue) {
    if (this.evaluator) {
      await this.evaluator.evaluate(
        `${variableName} = ${variableValue}`,
        context
      );
    } else {
      context[variableName] = variableValue;
    }
  }

  getVariable(context, variableName) {
    if (this.evaluator) {
      return this.evaluator.evaluate(variableName, context);
    }
    return context[variableName];
  }

  async executeAction(session, context, action) {
    if (typeof action === 'string') {
      if (action.startsWith('/') && this.dialogManager.existsDialog(action)) {
        session.beginDialog(context, action);
      } else {
        await session.say(action, context);
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
        const dialog =
          (action.dialog && action.dialog.startsWith('/') ? '' : '/') +
          action.dialog;
        let fn;
        switch (action.command) {
          case 'say':
            await session.say(action.text, context);
            break;
          case 'suggest':
            session.addSuggestedActions(action.text);
            break;
          case 'endDialog':
            session.endDialog(context);
            break;
          case 'restartDialog':
            session.restartDialog(context);
            break;
          case 'beginDialog':
            if (this.dialogManager.existsDialog(dialog)) {
              session.beginDialog(context, dialog);
            } else {
              await session.say(dialog, context);
            }
            break;
          case 'ask':
            context.isWaitingInput = true;
            context.variableName = action.variableName;
            context.validatorName = action.validatorName;
            break;
          case 'nlp':
            if (this.nlp && session.text) {
              const result = await this.nlp.process(
                session,
                undefined,
                context,
                { allowList: action.allowedIntents }
              );
              if (result.answer) {
                if (
                  result.answer.startsWith('/') &&
                  this.dialogManager.existsDialog(result.answer)
                ) {
                  session.beginDialog(context, result.answer);
                } else {
                  await session.say(result.answer, context);
                }
              } else if (session.activity.file && this.onFile) {
                await this.onFile(this, session);
              } else {
                await session.say("Sorry, I don't understand", context);
              }
            } else {
              await session.say("Sorry, I don't understand", context);
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
          case 'card':
            if (this.cards[action.cardName]) {
              await session.sendCard(this.cards[action.cardName], context);
            } else {
              console.log(`Unknown card ${action.cardName}`);
            }
            break;
          case 'dec':
            if (!context[action.variableName]) {
              context[action.variableName] = 0;
            }
            context[action.variableName] -= action.increment;
            break;
          case 'set':
            await this.setVariable(context, action.variableName, action.value);
            break;
          default:
            console.log(`Unknown command executing action "${action.command}"`);
            break;
        }
      }
    }
  }

  async runValidation(session, context) {
    const validator = this.getValidator(context.validatorName);
    if (!validator) {
      console.log(`Unknown validator ${context.validatorName}`);
    } else {
      const validation = await validator(session, context, [
        context.variableName,
      ]);
      if (validation.isValid) {
        context.validation.currentRetry = 0;
        if (validation.changes) {
          for (let i = 0; i < validation.changes.length; i += 1) {
            const change = validation.changes[i];
            context[change.name] = change.value;
          }
        }
      } else {
        context.validation.currentRetry =
          (context.validation.currentRetry || 0) + 1;
        if (context.validation.retries === undefined) {
          context.validation.retries = 2;
        }
        if (context.validation.currentRetry > context.validation.retries) {
          if (context.validation.failDialog) {
            let { failDialog } = context.validation;
            if (!failDialog.startsWith('/')) {
              failDialog = `/${failDialog}`;
            }
            session.beginDialog(context, failDialog);
          } else {
            session.restartDialog(context);
          }
        } else {
          await session.say(
            context.validation.message || 'Invalid value',
            context
          );
          return false;
        }
      }
    }
    return true;
  }

  async process(session) {
    const context = await this.contextManager.getContext(session);
    context.channel = session.channel;
    context.app = session.app;
    context.from = session.from || null;
    if (!context.dialogStack) {
      context.dialogStack = [];
    }
    if (!context.validation) {
      context.validation = {};
    }
    context[localeDangle] = this.localization;
    if (session.forcedDialog) {
      session.beginDialog(context, session.forcedDialog);
    }
    if (session.activity.value) {
      const keys = Object.keys(session.activity.value);
      for (let i = 0; i < keys.length; i += 1) {
        context[keys[i]] = session.activity.value[keys[i]];
      }
    }
    if (this.onBeforeProcess) {
      await this.onBeforeProcess(session, context);
    }
    let shouldContinue = true;
    if (context.isWaitingInput) {
      if (context.validatorName) {
        shouldContinue = await this.runValidation(session, context);
      } else if (context.variableName) {
        await this.setVariable(
          context,
          context.variableName,
          `"${session.text}"`
        );
      }
    }
    if (shouldContinue) {
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
    let currentTranslations = {
      masterLocale: 'en',
      fallbackLocale: 'en',
      rules: [],
    };
    const translations = [];
    let state;
    const dialogs = [];
    let currentDialog = {};
    let action;
    let tokens;
    let contextData;
    let trimmed;
    const imports = [];
    for (let i = 0; i < script.length; i += 1) {
      const current = script[i];
      if (current.type.length > 3 && current.type.startsWith('ask')) {
        current.line += ` ${current.type.slice(3)}`;
        current.type = 'ask';
      }
      let splitted;
      switch (current.type) {
        case 'language':
          locale = current.line;
          break;
        case 'comment':
          break;
        case 'translations':
          splitted = current.line ? current.line.split(' ') : ['en', 'en'];
          currentTranslations = {
            masterLocale: splitted[0] || 'en',
            fallbackLocale: splitted[1] || splitted[0] || 'en',
            rules: [],
          };
          translations.push(currentTranslations);
          state = 'translations';
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
        case 'contextdata':
          contextData = current.line;
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
          currentEntity.regex = current.line;
          break;
        case '-':
          if (state) {
            switch (state) {
              case 'translations':
                currentTranslations.rules.push(current.line);
                break;
              case 'utterances':
                currentIntent.utterances.push(current.line);
                break;
              case 'answers':
                if (current.line.startsWith('[')) {
                  trimmed = trimBetween(current.line.trim(), '[', ']', true);
                  currentIntent.answers.push({
                    answer: trimmed.line.trim(),
                    opts: trimmed.trimmed,
                  });
                } else {
                  currentIntent.answers.push(current.line);
                }
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
        case 'restart':
          action = this.buildAction('restartDialog', current);
          currentDialog.actions.push(action);
          break;
        case 'say':
          action = this.buildAction('say', current);
          action.text = current.line;
          currentDialog.actions.push(action);
          break;
        case 'card':
          action = this.buildAction('card', current);
          action.cardName = current.line;
          currentDialog.actions.push(action);
          break;
        case 'suggest':
          action = this.buildAction('suggest', current);
          action.text = current.line;
          currentDialog.actions.push(action);
          break;
        case 'ask':
          action = this.buildAction('ask', current);
          tokens = current.line.split(' ');
          [action.variableName, action.validatorName] = tokens;
          currentDialog.actions.push(action);
          break;
        case 'nlp':
          action = this.buildAction('nlp', current);
          action.allowedIntents = current.line
            ? current.line.split(' ')
            : undefined;
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
        case 'dec':
          action = this.buildAction('dec', current);
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
        case 'import':
          imports.push(current.content);
          break;
        default:
          console.log('UNKNOWN COMMAND');
          console.log(current);
          break;
      }
    }
    this.localization.addRule(translations);
    const intentKeys = Object.keys(intents);
    for (let i = 0; i < imports.length; i += 1) {
      const currentImport = imports[i];
      if (currentImport && !currentImport.data) {
        this.registerCard(currentImport);
      }
    }
    const nlp = this.container.get('nlp');
    if (nlp) {
      for (let i = 0; i < imports.length; i += 1) {
        const currentImport = imports[i];
        if (currentImport && currentImport.locale && currentImport.data) {
          nlp.addCorpus(currentImport);
        }
      }
      for (let i = 0; i < intentKeys.length; i += 1) {
        const currentLocale = intentKeys[i];
        const corpus = {
          locale: currentLocale,
          data: intents[currentLocale],
        };
        if (contextData) {
          corpus.contextData = contextData;
        }
        const currentEntities = entities[currentLocale];
        if (currentEntities && currentEntities.length > 0) {
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
    this.addDialog('/#', [
      { command: 'ask' },
      { command: 'beginDialog', dialog: '/' },
    ]);
    for (let i = 0; i < dialogs.length; i += 1) {
      this.addDialog(dialogs[i].name, dialogs[i].actions);
    }
  }

  loadCorpus(corpus) {
    if (this.nlp) {
      this.nlp.addCorpus(corpus);
    }
  }

  async resetFlows() {
    const logger = this.container.get('logger');
    logger.info('reseting flows...');
    Object.keys(this.dialogManager.dialogs).forEach((dialogKey) => {
      delete this.dialogManager.dialogs[dialogKey];
    });
    await this.resetContexts();
  }

  async resetContexts() {
    const logger = this.container.get('logger');
    logger.info('reseting context in all conversations...');
    await this.contextManager.resetConversations();
  }

  async resetConversationContext(cid) {
    const logger = this.container.get('logger');
    logger.debug(`reseting context in conversation: ${cid}`);
    await this.contextManager.resetConversation(cid);
  }
}

module.exports = Bot;
