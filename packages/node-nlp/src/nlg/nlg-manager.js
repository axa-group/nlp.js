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

const { NlgManager: NlgManagerBase } = require('@nlpjs/nlg');
const { Evaluator } = require('@nlpjs/evaluator');

class NlgManager extends NlgManagerBase {
  constructor(settings = {}, container) {
    super(settings, container);
    this.container.register('Evaluator', Evaluator, true);
  }

  addAnswer(locale, intent, answer, opts) {
    return this.add(locale, intent, answer, opts);
  }

  async findAnswer(locale, intent, context, settings) {
    const answer = await this.find(locale, intent, context, settings);
    if (!answer.answer) {
      return undefined;
    }
    return {
      response: answer.answer,
    };
  }

  removeAnswer(locale, intent, answer, opts) {
    return this.remove(locale, intent, answer, opts);
  }

  isValid(condition, context) {
    const evaluator = this.container.get('Evaluator');
    if (evaluator) {
      return (
        !condition ||
        condition === '' ||
        evaluator.evaluate(condition, context) === true
      );
    }
    return true;
  }

  findAllAnswers(locale, intent, context) {
    if (typeof locale === 'string') {
      const input = {
        locale,
        intent,
        context,
      };
      const found = super.findAllAnswers(input);
      const filtered = super.filterAnswers(found);
      return filtered.answers.map((x) => ({
        response: x.answer,
        opts: x.opts,
      }));
    }
    return super.findAllAnswers(locale);
  }
}

module.exports = NlgManager;
