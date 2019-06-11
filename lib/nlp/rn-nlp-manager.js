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

const BaseNlpManager = require('./base-nlp-manager');
const { resolveTemplate } = require('../util/handlebars');

/**
 * Class for the NLP Manager.
 * The NLP manager is the one that is able to manage several classifiers,
 * to have multilanguage, and also is the responsible of the NER (Named Entity
 * Recognition).
 *
 * Understanding NER:
 *
 * You can have several entities defined, each one with multilanguage and
 * several texts for each option. Example
 * Entity   Option           English                  Spanish
 * FOOD     Burguer          Burguer, Hamburguer      Hamburguesa
 * FOOD     Salad            Salad                    Ensalada
 * FOOD     Pizza            Pizza                    Pizza
 *
 */
class RnNlpManager extends BaseNlpManager {
  getAnswer(locale, intent, context) {
    const answer = this.nlgManager.findAnswer(locale, intent, context);
    if (answer && answer.response) {
      const response = resolveTemplate(answer.response, context);
      return response;
    }
    return undefined;
  }

  compileAnswer(answer, context) {
    return resolveTemplate(answer, context);
  }
}

module.exports = RnNlpManager;
