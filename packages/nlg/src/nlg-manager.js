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

class NlgManager extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'nlg-manager';
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.responses = {};
    this.applySettings(this, {
      pipelineFind: this.getPipeline(`${this.settings.tag}-find`),
    });
  }

  registerDefault() {
    this.container.registerConfiguration('nlg-manager', {}, false);
  }

  findAllAnswers(srcInput) {
    const input = srcInput;
    if (this.responses[input.locale]) {
      input.answers = this.responses[input.locale][input.intent] || [];
    } else {
      input.answers = [];
    }
    return input;
  }

  filterAnswers(srcInput) {
    const input = srcInput;
    const { answers } = input;
    if (answers && answers.length) {
      const evaluator = this.container.get('Evaluator');
      if (evaluator) {
        const context = input.context || {};
        const filtered = [];
        for (let i = 0; i < answers.length; i += 1) {
          const answer = answers[i];
          if (answer.opts) {
            const condition =
              typeof answer.opts === 'string'
                ? answer.opts
                : answer.opts.condition;
            if (condition) {
              if (evaluator.evaluate(condition, context) === true) {
                filtered.push(answer);
              }
            } else {
              filtered.push(answer);
            }
          } else {
            filtered.push(answer);
          }
        }
        input.answers = filtered;
      }
    }
    return input;
  }

  chooseRandom(srcInput) {
    const input = srcInput;
    const { answers } = input;
    if (answers && answers.length) {
      input.answer = answers[Math.floor(Math.random() * answers.length)].answer;
    }
    return input;
  }

  renderText(srcText, context) {
    if (!srcText) {
      return srcText;
    }
    let text = srcText.answer || srcText;
    let matchFound;
    do {
      const match = /\((?:[^()]+)\|(?:[^()]+)\)/g.exec(text);
      if (match) {
        for (let i = 0; i < match.length; i += 1) {
          const source = match[i];
          const options = source.substring(1, source.length - 1).split('|');
          text = text.replace(
            source,
            options[Math.floor(Math.random() * options.length)]
          );
        }
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    if (srcText.answer) {
      srcText.answer = text;
    } else {
      srcText = text;
    }
    const template = this.container.get('Template');
    if (template && context) {
      return template.compile(srcText, context);
    }
    return srcText;
  }

  renderRandom(srcInput) {
    const input = srcInput;
    const { answers, context } = input;
    for (let i = 0; i < answers.length; i += 1) {
      answers[i] = this.renderText(answers[i], context);
    }
    return input;
  }

  indexOfAnswer(locale, intent, answer, opts) {
    if (!this.responses[locale]) {
      return -1;
    }
    if (!this.responses[locale][intent]) {
      return -1;
    }
    const potential = this.responses[locale][intent];
    for (let i = 0; i < potential.length; i += 1) {
      const response = potential[i];
      if (
        response.answer === answer &&
        JSON.stringify(response.opts) === JSON.stringify(opts)
      ) {
        return i;
      }
    }
    return -1;
  }

  add(locale, intent, answer, opts) {
    const index = this.indexOfAnswer(locale, intent, answer, opts);
    if (index !== -1) {
      return this.responses[locale][intent][index];
    }
    if (!this.responses[locale]) {
      this.responses[locale] = {};
    }
    if (!this.responses[locale][intent]) {
      this.responses[locale][intent] = [];
    }
    const obj = { answer, opts };
    this.responses[locale][intent].push(obj);
    return obj;
  }

  remove(locale, intent, answer, opts) {
    const index = this.indexOfAnswer(locale, intent, answer, opts);
    if (index !== -1) {
      this.responses[locale][intent].splice(index, 1);
    }
  }

  defaultPipelineFind(input) {
    let output = this.findAllAnswers(input);
    output = this.filterAnswers(output);
    output = this.renderRandom(output);
    output = this.chooseRandom(output);
    return output;
  }

  find(locale, intent, context, settings) {
    const input = {
      locale,
      intent,
      context,
      settings: settings || this.settings,
    };
    if (this.pipelineFind) {
      return this.runPipeline(input, this.pipelineFind);
    }
    return this.defaultPipelineFind(input);
  }

  run(srcInput, settings) {
    return this.find(
      srcInput.locale,
      srcInput.intent,
      srcInput.context,
      settings
    );
  }

  toJSON() {
    const result = {
      settings: { ...this.settings },
      responses: this.responses,
    };
    delete result.settings.container;
    return result;
  }

  fromJSON(json) {
    this.applySettings(this.settings, json.settings);
    this.responses = json.responses;
  }
}

module.exports = NlgManager;
