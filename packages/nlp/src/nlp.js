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

const fs = require('fs');
const { Clonable, containerBootstrap } = require('@nlpjs/core');
const { NluManager, NluNeural } = require('@nlpjs/nlu');
const {
  Ner,
  ExtractorEnum,
  ExtractorRegex,
  ExtractorTrim,
  ExtractorBuiltin,
} = require('@nlpjs/ner');
const { ActionManager, NlgManager } = require('@nlpjs/nlg');
const { SentimentAnalyzer } = require('@nlpjs/sentiment');
const { SlotManager } = require('@nlpjs/slot');

class Nlp extends Clonable {
  constructor(settings = {}, container) {
    super(
      {
        settings: {},
        container: settings.container || container || containerBootstrap(),
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = `nlp`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.nluManager = this.container.get('nlu-manager', this.settings.nlu);
    this.ner = this.container.get('ner', this.settings.ner);
    this.nlgManager = this.container.get('nlg-manager', this.settings.nlg);
    this.actionManager = this.container.get(
      'action-manager',
      this.settings.action
    );
    this.sentiment = this.container.get(
      'sentiment-analyzer',
      this.settings.sentiment
    );
    this.slotManager = this.container.get('SlotManager', this.settings.slot);
    this.initialize();
  }

  registerDefault() {
    this.use(NluManager);
    this.use(Ner);
    this.use(ExtractorEnum);
    this.use(ExtractorRegex);
    this.use(ExtractorTrim);
    this.use(ExtractorBuiltin);
    this.use(NlgManager);
    this.use(ActionManager);
    this.use(NluNeural);
    this.use(SentimentAnalyzer);
    this.use(SlotManager);
  }

  initialize() {
    if (this.settings.nlu) {
      const locales = Object.keys(this.settings.nlu);
      for (let i = 0; i < locales.length; i += 1) {
        const locale = locales[i];
        const domains = Object.keys(this.settings.nlu[locale]);
        for (let j = 0; j < domains.length; j += 1) {
          const domain = domains[j];
          const settings = this.settings.nlu[locale][domain];
          const { className } = settings;
          delete settings.className;
          this.useNlu(className, locale, domain, settings);
        }
      }
    }
    if (this.settings.languages) {
      this.addLanguage(this.settings.languages);
    }
    if (this.settings.locales) {
      this.addLanguage(this.settings.locales);
    }
    if (this.settings.corpora) {
      this.addCorpora(this.settings.corpora);
    }
  }

  useNlu(clazz, locale, domain, settings) {
    if (!locale) {
      locale = '??';
    }
    if (Array.isArray(locale)) {
      for (let i = 0; i < locale.length; i += 1) {
        this.useNlu(clazz, locale[i], domain, settings);
      }
    } else {
      const className =
        typeof clazz === 'string' ? clazz : this.container.use(clazz);
      let config = this.container.getConfiguration(`domain-manager-${locale}`);
      if (!config) {
        config = {};
        this.container.registerConfiguration(
          `domain-manager-${locale}`,
          config
        );
      }
      if (!config.nluByDomain) {
        config.nluByDomain = {};
      }
      const domainName = !domain || domain === '*' ? 'default' : domain;
      if (!config.nluByDomain[domainName]) {
        config.nluByDomain[domainName] = {};
      }
      config.nluByDomain[domainName].className = className;
      config.nluByDomain[domainName].settings = settings;
    }
  }

  guessLanguage(input) {
    return this.nluManager.guessLanguage(input);
  }

  addLanguage(locales) {
    return this.nluManager.addLanguage(locales);
  }

  addDocument(locale, utterance, intent) {
    const entities = this.ner.getEntitiesFromUtterance(utterance);
    this.slotManager.addBatch(intent, entities);
    return this.nluManager.add(locale, utterance, intent);
  }

  removeDocument(locale, utterance, intent) {
    return this.nluManager.remove(locale, utterance, intent);
  }

  getRulesByName(locale, name) {
    return this.ner.getRulesByName(locale, name);
  }

  addNerRule(locale, name, type, rule) {
    return this.ner.addRule(locale, name, type, rule);
  }

  removeNerRule(locale, name, rule) {
    return this.ner.removeRule(locale, name, rule);
  }

  addNerRuleOptionTexts(locale, name, option, texts) {
    return this.ner.addRuleOptionTexts(locale, name, option, texts);
  }

  removeNerRuleOptionTexts(locale, name, option, texts) {
    return this.ner.removeRuleOptionTexts(locale, name, option, texts);
  }

  addNerRegexRule(locale, name, regex) {
    return this.ner.addRegexRule(locale, name, regex);
  }

  addNerBetweenCondition(locale, name, left, right, opts) {
    return this.ner.addBetweenCondition(locale, name, left, right, opts);
  }

  addNerPositionCondition(locale, name, position, words, opts) {
    return this.ner.addPositionCondition(locale, name, position, words, opts);
  }

  addNerAfterCondition(locale, name, words, opts) {
    return this.ner.addAfterCondition(locale, name, words, opts);
  }

  addNerAfterFirstCondition(locale, name, words, opts) {
    return this.ner.addAfterFirstCondition(locale, name, words, opts);
  }

  addNerAfterLastCondition(locale, name, words, opts) {
    return this.ner.addAfterLastCondition(locale, name, words, opts);
  }

  addNerBeforeCondition(locale, name, words, opts) {
    return this.ner.addBeforeCondition(locale, name, words, opts);
  }

  addNerBeforeFirstCondition(locale, name, words, opts) {
    return this.ner.addBeforeFirstCondition(locale, name, words, opts);
  }

  addNerBeforeLastCondition(locale, name, words, opts) {
    return this.ner.addBeforeLastCondition(locale, name, words, opts);
  }

  assignDomain(locale, intent, domain) {
    return this.nluManager.assignDomain(locale, intent, domain);
  }

  getIntentDomain(locale, intent) {
    return this.nluManager.getIntentDomain(locale, intent);
  }

  getDomains() {
    return this.nluManager.getDomains();
  }

  addAction(intent, action, parameters, fn) {
    return this.actionManager.addAction(intent, action, parameters, fn);
  }

  getActions(intent) {
    return this.actionManager.findActions(intent);
  }

  removeAction(intent, action, parameters) {
    return this.actionManager.removeAction(intent, action, parameters);
  }

  removeActions(intent) {
    return this.actionManager.removeActions(intent);
  }

  addAnswer(locale, intent, answer, opts) {
    return this.nlgManager.add(locale, intent, answer, opts);
  }

  removeAnswer(locale, intent, answer, opts) {
    return this.nlgManager.remove(locale, intent, answer, opts);
  }

  findAllAnswers(locale, intent) {
    const response = this.nlgManager.findAllAnswers({ locale, intent });
    return response.answers;
  }

  addCorpora(names) {
    for (let i = 0; i < names.length; i += 1) {
      this.addCorpus(names[i]);
    }
  }

  addCorpus(fileName) {
    const corpus = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    const locale = corpus.locale.slice(0, 2);
    this.addLanguage(locale);
    const { data } = corpus;
    for (let i = 0; i < data.length; i += 1) {
      const current = data[i];
      const { intent, utterances } = current;
      for (let j = 0; j < utterances.length; j += 1) {
        this.addDocument(locale, utterances[j], intent);
      }
    }
  }

  getSentiment(locale, utterance) {
    if (typeof locale === 'object') {
      return this.sentiment.process(locale);
    }
    if (!utterance) {
      utterance = locale;
      locale = this.guessLanguage(utterance);
    }
    return this.sentiment.process({ utterance, locale });
  }

  describeLanguage(locale, name) {
    this.nluManager.describeLanguage(locale, name);
  }

  train() {
    this.nluManager.addLanguage(this.settings.languages);
    return this.nluManager.train();
  }

  async classify(locale, utterance, settings) {
    return this.nluManager.process(
      locale,
      utterance,
      settings || this.settings.nlu
    );
  }

  async extractEntities(locale, utterance, context, settings) {
    if (typeof locale === 'object') {
      return this.ner.process(locale);
    }
    if (!utterance) {
      utterance = locale;
      locale = undefined;
    }
    if (!locale) {
      locale = this.guessLanguage(utterance);
    }
    const output = await this.ner.process({
      locale,
      utterance,
      context,
      settings: this.applySettings(settings, this.settings.ner),
    });
    return output;
  }

  async process(locale, utterance, context = {}, settings) {
    if (!utterance) {
      utterance = locale;
      locale = undefined;
    }
    if (!locale) {
      locale = this.guessLanguage(utterance);
    }
    const input = {
      locale,
      utterance,
      context,
      settings: this.applySettings(settings, this.settings.nlu),
    };
    let output = await this.nluManager.process(input);
    const optionalUtterance = await this.ner.generateEntityUtterance(
      locale,
      utterance
    );
    if (optionalUtterance && optionalUtterance !== utterance) {
      const optionalInput = {
        locale,
        utterance: optionalUtterance,
        context,
        settings: this.applySettings(settings, this.settings.nlu),
      };
      const optionalOutput = await this.nluManager.process(optionalInput);
      if (
        optionalOutput &&
        (optionalOutput.score > output.score || output.intent === 'None')
      ) {
        output = optionalOutput;
        output.utterance = utterance;
        output.optionalUtterance = optionalUtterance;
      }
    }
    output.context = context;
    output = await this.ner.process({ ...output });
    const answers = await this.nlgManager.run({ ...output });
    output.answers = answers.answers;
    output.answer = answers.answer;
    output = await this.actionManager.run({ ...output });
    const sentiment = await this.getSentiment(locale, utterance);
    output.sentiment = sentiment ? sentiment.sentiment : undefined;
    if (this.slotManager.process(output, context)) {
      output.entities.forEach(entity => {
        context[entity.entity] = entity.option || entity.utteranceText;
      });
    }
    context.slotFill = output.slotFill;
    delete output.context;
    delete output.settings;
    return output;
  }

  toJSON() {
    const result = {
      settings: { ...this.settings },
      nluManager: this.nluManager.toJSON(),
      ner: this.ner.toJSON(),
      nlgManager: this.nlgManager.toJSON(),
      actionManager: this.actionManager.toJSON(),
      slotManager: this.slotManager.save(),
    };
    delete result.settings.container;

    return result;
  }

  fromJSON(json) {
    this.applySettings(this.settings, json.settings);
    this.nluManager.fromJSON(json.nluManager);
    this.ner.fromJSON(json.ner);
    this.nlgManager.fromJSON(json.nlgManager);
    this.actionManager.fromJSON(json.actionManager);
    this.slotManager.load(json.slotManager);
  }
}

module.exports = Nlp;
