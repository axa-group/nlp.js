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

const { NlpManager } = require('../nlp');
const MemoryConversationContext = require('./memory-conversation-context');

/**
 * Microsoft Bot Framework compatible recognizer for nlp.js.
 */
class Recognizer {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.nlpManager =
      this.settings.nlpManager ||
      new NlpManager({ ner: { threshold: this.settings.nerThreshold || 0.7 } });
    this.threshold = this.settings.threshold || 0.7;
    this.conversationContext =
      this.settings.conversationContext || new MemoryConversationContext();
  }

  /**
   * Train the NLP manager.
   */
  async train() {
    await this.nlpManager.train();
  }

  /**
   * Loads the model from a file.
   * @param {String} filename Name of the file.
   */
  load(filename) {
    this.nlpManager.load(filename);
  }

  /**
   * Saves the model into a file.
   * @param {String} filename Name of the file.
   */
  save(filename) {
    this.nlpManager.save(filename);
  }

  /**
   * Loads the NLP manager from an excel.
   * @param {String} filename Name of the file.
   */
  async loadExcel(filename) {
    this.nlpManager.loadExcel(filename);
    await this.train();
    this.save();
  }

  /**
   * Process an utterance using the NLP manager. This is done using a given context
   * as the context object.
   * @param {Object} srcContext Source context
   * @param {String} locale Locale of the utterance.
   * @param {Promise.String} Promise utterance Utterance to be recognized.
   */
  async process(srcContext, locale, utterance) {
    const context = srcContext || {};
    const response = await (locale
      ? this.nlpManager.process(locale, utterance, context)
      : this.nlpManager.process(utterance, undefined, context));
    if (response.score < this.threshold || response.intent === 'None') {
      response.answer = undefined;
      return response;
    }
    for (let i = 0; i < response.entities.length; i += 1) {
      const entity = response.entities[i];
      context[entity.entity] = entity.option;
    }
    if (response.slotFill) {
      context.slotFill = response.slotFill;
    } else {
      delete context.slotFill;
    }
    return response;
  }

  /**
   * Given an utterance and the locale, returns the recognition of the utterance.
   * @param {String} utterance Utterance to be recognized.
   * @param {String} model Model of the utterance.
   * @param {Function} cb Callback Function.
   */
  async recognizeUtterance(utterance, model, cb) {
    const response = await this.process(
      model,
      model ? model.locale : undefined,
      utterance,
      {}
    );
    return cb(null, response);
  }

  /**
   * Gets the last developer (not framework) dialogId on the stack.
   * @param {Object} session Microsoft bot framework session.
   * @returns {string} Last dialog id.
   */
  getDialogId(session) {
    if (!session.dialogStack) {
      return '';
    }
    const stack = session.dialogStack();
    for (let i = 0; i < stack.length; i += 1) {
      const dialogId = stack[i];
      if (dialogId.startsWith('*:')) {
        return dialogId.substring(2);
      }
    }
    return '';
  }

  innerRecognize(session, cb) {
    const result = { score: 0.0, intent: undefined };
    if (session && session.message && session.message.text) {
      const utterance = session.message.text;
      const { locale } = session;
      this.conversationContext
        .getConversationContext(session)
        .then(async srcContext => {
          const context = srcContext;
          context.dialogId = this.getDialogId(session);
          const processResult = await this.process(context, locale, utterance);
          context.lastRecognized = processResult;
          this.conversationContext
            .setConversationContext(session, context)
            .then(() => cb(null, processResult))
            .catch(() => cb(null, processResult));
          return undefined;
        })
        .catch(async () => {
          const processResult = await this.process({}, locale, utterance);
          return cb(null, processResult);
        });
      return undefined;
    }
    // eslint-disable-next-line no-underscore-dangle
    if (session && session._activity && session._activity.type === 'message') {
      // eslint-disable-next-line no-underscore-dangle
      const message = session._activity;
      const utterance = message.text;
      const { locale } = message;
      this.conversationContext
        .getConversationContext(session)
        .then(async srcContext => {
          const context = srcContext;
          const processResult = await this.process(context, locale, utterance);
          context.lastRecognized = processResult;
          this.conversationContext
            .setConversationContext(session, context)
            .then(() => cb(null, processResult))
            .catch(() => cb(null, processResult));
          return undefined;
        })
        .catch(async () => {
          const processResult = await this.process({}, locale, utterance);
          return cb(null, processResult);
        });
      return undefined;
    }
    return cb(null, result);
  }

  /**
   * Given a session of a chatbot containing a message, recognize the utterance in the message.
   * @param {Object} session Chatbot session of the message.
   * @param {Function} cb Callback function.
   */
  recognize(session, cb) {
    if (cb) {
      return this.innerRecognize(session, cb);
    }
    return new Promise((resolve, reject) => {
      this.innerRecognize(session, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  /**
   * Given a session of a chatbot containing a message, recognize for second time
   * the utterance in the message.
   * @param {Object} session Chatbot session of the message.
   * @param {Function} cb Callback function.
   */
  recognizeTwice(session, cb) {
    this.conversationContext
      .getConversationContext(session)
      .then(async srcContext => {
        const context = srcContext;
        if (context.lastRecognized) {
          const processResult = context.lastRecognized;
          delete context.lastRecognized;
          this.conversationContext
            .setConversationContext(session, context)
            .then(() => cb(null, processResult))
            .catch(() => cb(null, processResult));
        } else {
          return this.recognize(session, cb);
        }
        return undefined;
      })
      .catch(async () => this.recognize(session, cb));
  }

  /**
   * Route to a default route of the bot. First the route is calculated as the
   * best route based on the results and the dialog stack. If no best route exists
   * then is routed to the active dialog.
   * @param {Object} bot Microsoft Bot Framework Universal Bot instance.
   * @param {Object} session Microsoft bot framework session.
   * @param {Object} results Results for the routing.
   */
  defaultRouting(bot, session, results) {
    const route = bot.libraries.BotBuilder.constructor.bestRouteResult(
      results,
      session.dialogStack(),
      bot.name
    );
    if (route) {
      return bot.library(route.libraryName).selectRoute(session, route);
    }
    return session.routeToActiveDialog();
  }

  executeAction(name, parameters, context) {
    return new Promise(resolve => {
      const params = JSON.parse(`[${parameters}]`);
      if (this.actions[name]) {
        const action = this.actions[name](this, context, ...(params || []));
        if (action.then) {
          action.then(() => resolve());
        } else {
          return resolve();
        }
      }
      return resolve();
    });
  }

  processActions(session, response, cb) {
    if (!response || !response.actions || response.actions.length === 0) {
      return cb();
    }
    this.conversationContext
      .getConversationContext(session)
      .then(async srcContext => {
        const context = srcContext;
        const { actions } = response;
        const promises = actions.map(action =>
          this.executeAction(action.action, action.parameters, context)
        );
        Promise.all(promises)
          .then(() => cb())
          .catch(err => cb(err));
      })
      .catch(async () => {
        return cb();
      });
    return undefined;
  }

  /**
   * When an answer is received over the threshold, decide what to do with this answer.
   * @param {Object} session Microsoft bot framework session.
   * @param {string} answer Answer given by the NLP.
   */
  processAnswer(session, answer) {
    if (answer[0] === '/') {
      return session.beginDialog(answer);
    }
    return session.send(answer);
  }

  /**
   * Sets the recognizer to a Microsoft bot framework universal bot instance.
   * Also, the default bot routing can be overrided and replaced by the
   * recognizer routing.
   * @param {Object} bot Microsoft Bot Framework Universal Bot instance.
   * @param {boolean} activateRouting True if default routing should be overrided.
   * @param {number} routingThreshold Threshold for the score of the intent.
   */
  setBot(bot, activateRouting = false, routingThreshold = 0.7) {
    bot.recognizer(this);
    if (!activateRouting) {
      return;
    }
    const self = this;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    bot._onDisambiguateRoute = function disambiguate(
      session,
      results,
      cb = () => {}
    ) {
      if (self.onBeginRouting && !self.onBeginRouting(session)) {
        return cb();
      }
      if (session.message && session.message.text) {
        self.recognizeTwice(session, (err, result) => {
          if (result.score > routingThreshold) {
            if (
              self.onRecognizedRouting &&
              !self.onRecognizedRouting(session, result)
            ) {
              return cb();
            }
            self.processActions(session, result, () => {
              if (result.answer && result.answer !== '') {
                self.processAnswer(session, result.answer);
              }
              return cb();
            });
            return undefined;
          }
          if (
            self.onUnrecognizedRouting &&
            !self.onUnrecognizedRouting(session, result)
          ) {
            return cb();
          }
          self.defaultRouting(bot, session, results);
          return cb();
        });
      } else {
        if (self.onNoTextRouting && !self.onNoTextRouting(session)) {
          return cb();
        }
        self.defaultRouting(bot, session, results);
        return cb();
      }
      return undefined;
    };
  }
}

module.exports = Recognizer;
