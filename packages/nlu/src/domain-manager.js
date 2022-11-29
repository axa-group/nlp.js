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

const { Clonable, compareWildcars } = require('@nlpjs/core');

const defaultDomainName = 'master_domain';

class DomainManager extends Clonable {
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
      this.settings.tag = `domain-manager-${this.settings.locale}`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.domains = {};
    this.addDomain(defaultDomainName);
    this.stemDict = {};
    this.intentDict = {};
    this.sentences = [];
    this.applySettings(this, {
      pipelineTrain: this.getPipeline(`${this.settings.tag}-train`),
      pipelineProcess: this.getPipeline(`${this.settings.tag}-process`),
    });
  }

  registerDefault() {
    this.container.registerConfiguration(
      'domain-manager-??',
      {
        nluByDomain: {
          default: {
            className: 'NeuralNlu',
            settings: {},
          },
        },
        trainByDomain: false,
        useStemDict: true,
      },
      false
    );
    this.container.registerPipeline(
      'domain-manager-??-train',
      [
        '.trainStemmer',
        '.generateCorpus',
        '.fillStemDict',
        '.innerTrain',
        'output.status',
      ],
      false
    );
  }

  getDomainInstance(domainName) {
    if (!this.settings.nluByDomain) {
      this.settings.nluByDomain = {};
    }
    const domainSettings = this.settings.nluByDomain[domainName] ||
      this.settings.nluByDomain.default || {
        className: 'NeuralNlu',
        settings: {},
      };
    return this.container.get(
      domainSettings.className || 'NeuralNlu',
      this.applySettings(
        { locale: this.settings.locale },
        domainSettings.settings || {}
      )
    );
  }

  addDomain(name) {
    if (!this.domains[name]) {
      this.domains[name] = this.getDomainInstance(name);
    }
    return this.domains[name];
  }

  removeDomain(name) {
    delete this.domains[name];
  }

  async generateStemKey(srcTokens) {
    let tokens;
    if (typeof srcTokens !== 'string') {
      tokens = srcTokens;
    } else {
      const input = await this.prepare({ utterance: srcTokens });
      tokens = await input.stems;
    }
    if (!Array.isArray(tokens)) {
      tokens = Object.keys(tokens);
    }
    return tokens.slice().sort().join();
  }

  add(domain, utterance, intent) {
    if (!intent) {
      this.sentences.push({
        domain: defaultDomainName,
        utterance: domain,
        intent: utterance,
      });
    } else {
      this.sentences.push({ domain, utterance, intent });
    }
  }

  getSentences() {
    return this.sentences;
  }

  remove(srcDomain, srcUtterance, srcIntent) {
    const domain = srcIntent ? srcDomain : defaultDomainName;
    const utterance = srcIntent ? srcUtterance : srcDomain;
    const intent = srcIntent || srcUtterance;
    for (let i = 0; i < this.sentences.length; i += 1) {
      const sentence = this.sentences[i];
      if (
        sentence.domain === domain &&
        sentence.utterance === utterance &&
        sentence.intent === intent
      ) {
        this.sentences.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  async trainStemmer(srcInput) {
    const input = srcInput;
    if (!this.cache) {
      this.cache = {
        stem: this.container.get('stem'),
      };
    }
    for (let i = 0; i < this.sentences.length; i += 1) {
      const current = this.sentences[i];
      const subInput = { ...current, ...input };
      await this.cache.stem.addForTraining(subInput);
    }
    await this.cache.stem.train(input);
    return input;
  }

  innerGenerateCorpus(domainName) {
    this.intentDict = {};
    const result = {};
    result[defaultDomainName] = [];
    for (let i = 0; i < this.sentences.length; i += 1) {
      const sentence = this.sentences[i];
      this.intentDict[sentence.intent] = sentence.domain;
      const domain = domainName || sentence.domain;
      if (!result[domain]) {
        result[domain] = [];
      }
      const domainObj = result[domain];
      domainObj.push({
        utterance: sentence.utterance,
        intent: sentence.intent,
      });
      if (!domainName) {
        result[defaultDomainName].push({
          utterance: sentence.utterance,
          intent: sentence.domain,
        });
      }
    }
    return result;
  }

  async generateCorpus(srcInput) {
    const input = srcInput;
    input.corpus = this.innerGenerateCorpus(
      this.settings.trainByDomain ? undefined : defaultDomainName
    );
    return input;
  }

  async prepare(srcInput) {
    const input = srcInput;
    const isString = typeof input === 'string';
    const utterance = isString ? input : input.utterance;
    const nlu = this.addDomain(defaultDomainName);
    const tokens = nlu.prepare(utterance);
    if (isString) {
      return tokens;
    }
    input.stems = tokens;
    return input;
  }

  async fillStemDict(srcInput) {
    this.stemDict = {};
    for (let i = 0; i < this.sentences.length; i += 1) {
      const { utterance, intent, domain } = this.sentences[i];
      const key = await this.generateStemKey(utterance);
      if (!key || key === '') {
        this.container
          .get('logger')
          .warn(`This utterance: "${utterance}" contains only stop words`);
      }
      this.stemDict[key] = {
        intent,
        domain,
      };
    }
    return srcInput;
  }

  async innerTrain(srcInput) {
    const input = srcInput;
    const { corpus } = input;
    const keys = Object.keys(corpus);
    const status = {};
    for (let i = 0; i < keys.length; i += 1) {
      const nlu = this.addDomain(keys[i]);
      const options = { useNoneFeature: this.settings.useNoneFeature };
      if (srcInput.settings && srcInput.settings.log !== undefined) {
        options.log = srcInput.settings.log;
      }
      const result = await nlu.train(corpus[keys[i]], options);
      status[keys[i]] = result.status;
    }
    input.status = status;
    return input;
  }

  async train(settings) {
    const input = {
      domainManager: this,
      settings: settings || this.settings,
    };
    return this.runPipeline(input, this.pipelineTrain);
  }

  matchAllowList(intent, allowList) {
    for (let i = 0; i < allowList.length; i += 1) {
      if (compareWildcars(intent, allowList[i])) {
        return true;
      }
    }
    return false;
  }

  async classifyByStemDict(utterance, domainName, allowList) {
    const key = await this.generateStemKey(utterance);
    const resolved = this.stemDict[key];
    if (resolved && (!domainName || resolved.domain === domainName)) {
      if (allowList && !this.matchAllowList(resolved.intent, allowList)) {
        return undefined;
      }
      const classifications = [];
      classifications.push({
        intent: resolved.intent,
        score: 1,
      });
      const intents = Object.keys(this.intentDict);
      for (let i = 0; i < intents.length; i += 1) {
        if (intents[i] !== resolved.intent) {
          classifications.push({ intent: intents[i], score: 0 });
        }
      }
      return { domain: resolved.domain, classifications };
    }
    return undefined;
  }

  async innerClassify(srcInput, domainName) {
    const input = srcInput;
    const settings = this.applySettings({ ...input.settings }, this.settings);
    if (settings.useStemDict) {
      const result = await this.classifyByStemDict(
        input.utterance,
        domainName,
        srcInput.settings ? srcInput.settings.allowList : undefined
      );
      if (result) {
        input.classification = result;
        input.explanation = [
          {
            token: '',
            stem: '##exact',
            weight: 1,
          },
        ];
        return input;
      }
    }
    if (domainName) {
      const nlu = this.domains[domainName];
      if (!nlu) {
        input.classification = {
          domain: 'default',
          classifications: [{ intent: 'None', score: 1 }],
        };
        return input;
      }
      const nluAnswer = await nlu.process(
        input.utterance,
        input.settings || this.settings
      );
      let classifications;
      if (Array.isArray(nluAnswer)) {
        classifications = nluAnswer;
      } else {
        classifications = nluAnswer.classifications;
        input.nluAnswer = nluAnswer;
      }
      let finalDomain;
      if (domainName === defaultDomainName) {
        if (classifications && classifications.length) {
          finalDomain = this.intentDict[classifications[0].intent];
        } else {
          finalDomain = defaultDomainName;
        }
      } else {
        finalDomain = domainName;
      }
      input.classification = {
        domain: finalDomain,
        classifications,
      };
      return input;
    }
    let domain = defaultDomainName;
    if (
      (input.settings.trainByDomain === undefined &&
        this.settings.trainByDomain) ||
      input.settings.trainByDomain
    ) {
      const nlu = this.domains[defaultDomainName];
      let classifications = await nlu.process(input.utterance);
      if (classifications.classifications) {
        classifications = classifications.classifications;
      }
      if (Object.keys(this.domains).length === 1) {
        input.classification = {
          domain: 'default',
          classifications,
        };
        return input;
      }
      domain = classifications[0].intent;
      if (domain === 'None') {
        input.classification = {
          domain: 'default',
          classifications: [{ intent: 'None', score: 1 }],
        };
        return input;
      }
    }
    return this.innerClassify(input, domain);
  }

  async defaultPipelineProcess(input) {
    const output = await this.innerClassify(input);
    return output.classification;
  }

  async process(utterance, settings) {
    const input =
      typeof utterance === 'string'
        ? {
            utterance,
            settings: settings || this.settings,
          }
        : utterance;
    if (this.pipelineProcess) {
      return this.runPipeline(input, this.pipelineProcess);
    }
    return this.defaultPipelineProcess(input);
  }

  toJSON() {
    const result = {
      settings: this.settings,
      stemDict: this.stemDict,
      intentDict: this.intentDict,
      sentences: this.sentences,
      domains: {},
    };
    delete result.settings.container;
    const keys = Object.keys(this.domains);
    for (let i = 0; i < keys.length; i += 1) {
      result.domains[keys[i]] = this.domains[keys[i]].toJSON();
    }
    return result;
  }

  fromJSON(json) {
    this.applySettings(this.settings, json.settings);
    this.stemDict = json.stemDict;
    this.intentDict = json.intentDict;
    this.sentences = json.sentences;
    const keys = Object.keys(json.domains);
    for (let i = 0; i < keys.length; i += 1) {
      const domain = this.addDomain(keys[i]);
      domain.fromJSON(json.domains[keys[i]]);
    }
  }
}

module.exports = DomainManager;
