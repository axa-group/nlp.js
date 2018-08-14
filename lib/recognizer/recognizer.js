/*
 * Copyright (c) AXA Shared Services Spain S.A.
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
    this.nlpManager = this.settings.nlpManager ||
      new NlpManager({ ner: { threshold: this.settings.nerThreshold || 0.7 } });
    this.threshold = this.settings.threshold || 0.7;
    this.conversationContext = this.settings.conversationContext || new MemoryConversationContext();
  }

  /**
   * Train the NLP manager.
   */
  train() {
    this.nlpManager.train();
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
  loadExcel(filename) {
    this.nlpManager.loadExcel(filename);
    this.train();
    this.save();
  }

  /**
   * Process an utterance using the NLP manager. This is done using a given context
   * as the context object.
   * @param {Object} srcContext Source context
   * @param {String} locale Locale of the utterance.
   * @param {String} utterance Utterance to be recognized.
   */
  process(srcContext, locale, utterance) {
    const context = srcContext || {};
    const response = locale ? this.nlpManager.process(locale, utterance, context)
      : this.nlpManager.process(utterance, undefined, context);
    if (response.score < this.threshold || response.intent === 'None') {
      response.answer = undefined;
      return response;
    }
    for (let i = 0; i < response.entities.length; i += 1) {
      const entity = response.entities[i];
      context[entity.entity] = entity.option;
      context.$modified = true;
    }
    return response;
  }

  /**
   * Given an utterance and the locale, returns the recognition of the utterance.
   * @param {String} utterance Utterance to be recognized.
   * @param {String} model Model of the utterance.
   * @param {Function} cb Callback Function.
   */
  recognizeUtterance(utterance, model, cb) {
    const response = this.process(model, model ? model.locale : undefined, utterance, {});
    return cb(null, response);
  }

  /**
   * Given a session of a chatbot containing a message, recognize the utterance in the message.
   * @param {Object} session Chatbot session of the message.
   * @param {Function} cb Callback function.
   */
  recognize(session, cb) {
    const result = { score: 0.0, intent: undefined };
    if (session && session.message && session.message.text) {
      const utterance = session.message.text;
      const { locale } = session;
      this.conversationContext.getConversationContext(session)
        .then((context) => {
          const processResult = this.process(context, locale, utterance);
          if (context.$modified) {
            // eslint-disable-next-line no-param-reassign
            delete context.$modified;
            this.conversationContext.setConversationContext(session, context)
              .then(() => cb(null, processResult))
              .catch(() => cb(null, processResult));
            return undefined;
          }
          return cb(null, processResult);
        })
        .catch(() => {
          const processResult = this.process({}, locale, utterance);
          return cb(null, processResult);
        });
      return undefined;
    }
    return cb(null, result);
  }
}

module.exports = Recognizer;
