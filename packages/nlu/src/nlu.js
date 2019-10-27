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

class Nlu extends Clonable {
  constructor(settings = {}, container) {
    super({ settings: {} }, container);
    this.applySettings(this.settings, settings);
    this.applySettings(this.settings, { locale: 'en' });
    if (!this.settings.tag) {
      this.settings.tag = `nlu-${this.settings.locale}`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.applySettings(this, {
      pipelinePrepare: this.container.getPipeline(
        `${this.settings.tag}-prepare`
      ),
      pipelineTrain: this.container.getPipeline(`${this.settings.tag}-train`),
      pipelineProcess: this.container.getPipeline(
        `${this.settings.tag}-process`
      ),
    });
  }

  registerDefault() {
    this.container.registerConfiguration(
      'nlu-??',
      {
        keepStopwords: true,
        nonefeatureValue: 1,
        nonedeltaMultiplier: 1.2,
        spellcheckDistance: 0,
        filterZeros: true,
      },
      false
    );
    this.container.registerPipeline(
      'nlu-??-prepare',
      [
        'normalize',
        'tokenize',
        'removeStopwords',
        'stem',
        'arrToObj',
        'output.tokens',
      ],
      false
    );
    this.container.registerPipeline(
      'nlu-??-train',
      ['.prepareCorpus', '.addNoneFeature', '.innerTrain'],
      false
    );
    this.container.registerPipeline(
      'nlu-??-process',
      [
        '.prepare',
        '.calculateNoneFeature',
        '.innerProcess',
        '.convertToArray',
        '.normalizeClassifications',
        'output.classifications',
      ],
      false
    );
  }

  async prepare(text, srcSettings) {
    const settings = srcSettings || this.settings;
    if (typeof text === 'string') {
      const input = {
        locale: this.locale,
        text,
        settings,
      };
      return this.runPipeline(input, this.pipelinePrepare);
    }
    if (typeof text === 'object') {
      if (Array.isArray(text)) {
        const result = [];
        for (let i = 0; i < text.length; i += 1) {
          result.push(await this.prepare(text[i], settings));
        }
        return result;
      }
      const item = settings.fieldNameSrc
        ? text[settings.fieldNameSrc]
        : text.text || text.utterance || text.texts || text.utterances;
      if (item) {
        const result = await this.prepare(item, settings);
        const targetField = settings.fieldNameTgt || 'tokens';
        return { [targetField]: result, ...text };
      }
    }
    throw new Error(
      `Error at nlu.prepare: expected a text but received ${text}`
    );
  }

  async prepareCorpus(srcInput) {
    this.features = {};
    this.intents = {};
    const input = srcInput;
    const { corpus } = input;
    const result = [];
    for (let i = 0; i < corpus.length; i += 1) {
      const { intent } = corpus[i];
      const item = {
        input: await this.prepare(corpus[i].utterance, input.settings),
        output: { [intent]: 1 },
      };
      const keys = Object.keys(item.input);
      for (let j = 0; j < keys.length; j += 1) {
        this.features[keys[j]] = 1;
      }
      this.intents[intent] = 1;
      result.push(item);
    }
    this.numFeatures = Object.keys(this.features).length;
    this.numIntents = Object.keys(this.intents).length;
    input.corpus = result;
    return input;
  }

  addNoneFeature(input) {
    const { corpus } = input;
    corpus.push({ input: { nonefeature: 1 }, output: { None: 1 } });
    return input;
  }

  convertToArray(srcInput) {
    const input = srcInput;
    const { classifications } = input;
    const keys = Object.keys(classifications);
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      const intent = keys[i];
      const score = classifications[intent];
      if (score > 0 || !input.settings.filterZeros) {
        result.push({ intent, score });
      }
    }
    input.classifications = result.sort((a, b) => b.score - a.score);
    return input;
  }

  normalizeClassifications(srcInput) {
    const input = srcInput;
    const { classifications } = input;
    let total = 0;
    for (let i = 0; i < classifications.length; i += 1) {
      classifications[i].score **= 2;
      total += classifications[i].score;
    }
    if (total > 0) {
      for (let i = 0; i < classifications.length; i += 1) {
        classifications[i].score /= total;
      }
    }
    return input;
  }

  calculateNoneFeature(srcInput) {
    const input = srcInput;
    const { tokens } = input;
    const keys = Object.keys(tokens);
    let unknownTokens = 0;
    for (let i = 0; i < keys.length; i += 1) {
      const token = keys[i];
      if (token === 'nonefeature') {
        tokens[token] = this.nonefeatureValue;
      } else if (!this.features[token]) {
        unknownTokens += 1;
      }
    }
    let nonedelta =
      input.settings.nonedeltaValue === undefined
        ? this.numIntents / this.numFeatures
        : this.settings.nonedeltaValue;
    let nonevalue = 0;
    for (let i = 0; i < unknownTokens; i += 1) {
      nonevalue += nonedelta;
      nonedelta *= this.settings.nonedeltaMultiplier;
    }
    if (nonevalue) {
      tokens.nonefeature = nonevalue;
    }
    return input;
  }

  async innerTrain() {
    throw new Error('This method should be implemented by child classes');
  }

  async train(corpus, settings) {
    const input = {
      corpus,
      settings: settings || this.settings,
    };
    return this.runPipeline(input, this.pipelineTrain);
  }

  async process(utterance, settings) {
    const input = {
      text: utterance,
      settings: settings || this.settings,
    };
    return this.runPipeline(input, this.pipelineProcess);
  }
}

module.exports = Nlu;
