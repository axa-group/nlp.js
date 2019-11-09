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
const { NluManager } = require('@nlpjs/nlu');

class Nlp extends Clonable {
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
      this.settings.tag = `nlp`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.nluManager = this.container.get('nlu-manager');
    // new NluManager(this.settings.nlu, this.container);
    // this.applySettings(this, {
    //   pipelinePrepare: this.getPipeline(`${this.settings.tag}-prepare`),
    //   pipelineTrain: this.getPipeline(`${this.settings.tag}-train`),
    //   pipelineProcess: this.getPipeline(`${this.settings.tag}-process`),
    // });
  }

  registerDefault() {
    this.use(NluManager);
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
      const className = this.container.use(clazz);
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

  train() {
    return this.nluManager.train();
  }

  process(locale, utterance, domain, settings) {
    return this.nluManager.process(locale, utterance, domain, settings);
  }
}

module.exports = Nlp;
