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
const { SpellCheck } = require('@nlpjs/similarity');
const useNoneFeature = require('./none-languages');

class Nlu extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
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
      pipelinePrepare: this.getPipeline(`${this.settings.tag}-prepare`),
      pipelineTrain: this.getPipeline(`${this.settings.tag}-train`),
      pipelineProcess: this.getPipeline(`${this.settings.tag}-process`),
    });
    this.spellCheck = new SpellCheck();
  }

  registerDefault() {
    this.container.registerConfiguration(
      'nlu-??',
      {
        keepStopwords: true,
        nonefeatureValue: 1,
        nonedeltaMultiplier: 1.2,
        spellCheck: false,
        spellCheckDistance: 1,
        filterZeros: true,
        log: true,
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
        '.doSpellCheck',
        '.textToFeatures',
        '.innerProcess',
        '.convertToArray',
        '.filterNonActivated',
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
        locale: this.settings.locale,
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

  async doSpellCheck(input, srcSettings) {
    const settings = this.applySettings(srcSettings || {}, this.settings);
    let shouldSpellCheck =
      input.settings.spellCheck === undefined
        ? undefined
        : input.settings.spellCheck;
    let spellCheckDistance =
      input.settings.spellCheckDistance === undefined
        ? undefined
        : input.settings.spellCheckDistance;
    if (shouldSpellCheck === undefined) {
      shouldSpellCheck =
        settings.spellCheck === undefined ? undefined : settings.spellCheck;
    }
    if (spellCheckDistance === undefined) {
      spellCheckDistance =
        settings.spellCheckDistance === undefined
          ? 1
          : settings.spellCheckDistance;
    }
    if (shouldSpellCheck) {
      const tokens = this.spellCheck.check(input.tokens, spellCheckDistance);
      input.tokens = tokens;
    }
    return input;
  }

  async prepareCorpus(srcInput) {
    this.features = {};
    this.intents = {};
    this.intentFeatures = {};
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
      if (!this.intentFeatures[intent]) {
        this.intentFeatures[intent] = {};
      }
      for (let j = 0; j < keys.length; j += 1) {
        this.features[keys[j]] = 1;
        this.intentFeatures[intent][keys[j]] = 1;
      }
      this.intents[intent] = 1;
      result.push(item);
    }
    const keys = Object.keys(this.intentFeatures);
    this.featuresToIntent = {};
    for (let i = 0; i < keys.length; i += 1) {
      const intent = keys[i];
      const features = Object.keys(this.intentFeatures[intent]);
      for (let j = 0; j < features.length; j += 1) {
        const feature = features[j];
        if (!this.featuresToIntent[feature]) {
          this.featuresToIntent[feature] = [];
        }
        this.featuresToIntent[feature].push(intent);
      }
      this.intentFeatures[keys[i]] = Object.keys(this.intentFeatures[keys[i]]);
    }
    this.spellCheck.setFeatures(this.features);
    this.numFeatures = Object.keys(this.features).length;
    this.numIntents = Object.keys(this.intents).length;
    input.corpus = result;
    return input;
  }

  addNoneFeature(input) {
    const { corpus } = input;
    const locale = input.locale || this.settings.locale;
    if (
      (input.settings && input.settings.useNoneFeature) ||
      ((!input.settings || input.settings.useNoneFeature === undefined) &&
        useNoneFeature[locale])
    ) {
      corpus.push({ input: { nonefeature: 1 }, output: { None: 1 } });
    }
    return input;
  }

  convertToArray(srcInput) {
    const input = srcInput;
    const { classifications } = input;
    if (classifications) {
      if (!this.intentsArr) {
        if (this.intents) {
          this.intentsArr = Object.keys(this.intents);
          if (!this.intents.None) {
            this.intentsArr.push('None');
          }
        } else {
          this.intentsArr = Object.keys(classifications);
        }
      }
      const keys = this.intentsArr;
      const result = [];
      for (let i = 0; i < keys.length; i += 1) {
        const intent = keys[i];
        const score = classifications[intent];
        if (score !== undefined && (score > 0 || !input.settings.filterZeros)) {
          result.push({ intent, score });
        }
      }
      input.classifications = result.sort((a, b) => b.score - a.score);
    }
    return input;
  }

  someSimilar(tokensA, tokensB) {
    for (let i = 0; i < tokensB.length; i += 1) {
      if (tokensA[tokensB[i]]) {
        return true;
      }
    }
    return false;
  }

  getWhitelist(tokens) {
    const result = {};
    const features = Object.keys(tokens);
    for (let i = 0; i < features.length; i += 1) {
      const intents = this.featuresToIntent[features[i]];
      if (intents) {
        for (let j = 0; j < intents.length; j += 1) {
          result[intents[j]] = 1;
        }
      }
    }
    return result;
  }

  filterNonActivated(srcInput) {
    if (!this.intentFeatures || !srcInput.classifications) {
      return srcInput;
    }
    const whitelist = this.getWhitelist(srcInput.tokens);
    whitelist.None = 1;
    const { classifications } = srcInput;
    for (let i = 0; i < classifications.length; i += 1) {
      const classification = classifications[i];
      if (!whitelist[classification.intent]) {
        classification.score = 0;
      }
    }
    return srcInput;
  }

  normalizeClassifications(srcInput) {
    const input = srcInput;
    const { classifications } = input;
    if (classifications) {
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
    } else {
      input.classifications = input.nluAnswer;
    }
    return input;
  }

  textToFeatures(srcInput) {
    const locale = srcInput.locale || this.settings.locale;
    const input = srcInput;
    const { tokens } = input;
    const keys = Object.keys(tokens);
    let unknownTokens = 0;
    const features = {};
    for (let i = 0; i < keys.length; i += 1) {
      const token = keys[i];
      if (token === 'nonefeature') {
        tokens[token] = this.nonefeatureValue;
      } else if (!this.features || !this.features[token]) {
        unknownTokens += 1;
      } else {
        features[token] = tokens[token];
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
    if (
      (input.settings ||
        input.settings.useNoneFeature ||
        ((input.settings || input.settings.useNoneFeature === undefined) &&
          useNoneFeature[locale])) &&
      nonevalue
    ) {
      features.nonefeature = nonevalue;
    }
    input.tokens = features;
    return input;
  }

  async innerTrain() {
    throw new Error('This method should be implemented by child classes');
  }

  async train(corpus, settings) {
    const input = {
      corpus,
      settings: this.applySettings(settings, this.settings),
    };
    return this.runPipeline(input, this.pipelineTrain);
  }

  async process(utterance, settings) {
    const input = {
      text: utterance,
      settings: this.applySettings(settings || {}, this.settings),
    };
    const output = await this.runPipeline(input, this.pipelineProcess);
    if (Array.isArray(output)) {
      return {
        classifications: output,
        entities: undefined,
      };
    }
    if (output.intents) {
      output.classifications = output.intents;
      delete output.intents;
    }
    return output;
  }

  toJSON() {
    const result = {
      settings: { ...this.settings },
      features: this.features,
      intents: this.intents,
      intentFeatures: this.intentFeatures,
      featuresToIntent: this.featuresToIntent,
    };
    delete result.settings.container;
    return result;
  }

  fromJSON(json) {
    this.applySettings(this.settings, json.settings);
    this.features = json.features || {};
    this.intents = json.intents || {};
    this.featuresToIntent = json.featuresToIntent || {};
    this.intentFeatures = json.intentFeatures || {};
    this.spellCheck.setFeatures(this.features);
    this.numFeatures = Object.keys(this.features).length;
    this.numIntents = Object.keys(this.intents).length;
  }
}

module.exports = Nlu;
