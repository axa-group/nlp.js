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

const defaultDomainName = 'master_domain';

class DomainManager extends Clonable {
  constructor(settings = {}, container) {
    super({ settings: {} }, container);
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
      pipelineTrain: this.container.getPipeline(`${this.settings.tag}-train`),
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
      ['.trainStemmer'],
      false
    );
  }

  getDomainInstance(domainName) {
    const domainSettings = this.settings.nluByDomain[domainName] ||
      this.settings.nluByDomain.default || {
        className: 'NeuralNlu',
        settings: {},
      };
    return this.container.get(
      domainSettings.className || 'NeuralNlu',
      domainSettings.settings || {}
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

  generateStemKey(tokens) {
    return tokens
      .slice()
      .sort()
      .join();
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
    for (let i = 0; i < this.sentences.length; i += 1) {
      const current = this.sentences[i];
      const subInput = { ...current, ...input };
      await this.runPipeline(subInput, ['stem.addForTraining']);
    }
    await this.runPipeline(input, ['stem.train']);
  }

  async train(settings) {
    const input = {
      domainManager: this,
      settings: settings || this.settings,
    };
    this.runPipeline(input, this.pipelineTrain);
  }
}

module.exports = DomainManager;
