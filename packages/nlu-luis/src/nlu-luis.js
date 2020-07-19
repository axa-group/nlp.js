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

const { Nlu } = require('@nlpjs/nlu');
const { request } = require('@nlpjs/request');

class NluLuis extends Nlu {
  innerTrain(srcInput) {
    const input = srcInput;
    return input;
  }

  async innerProcess(srcInput) {
    const input = srcInput;
    const text =
      this.settings.useStemmer && input.tokens
        ? Object.keys(input.tokens).join(' ')
        : input.text || input.utterance;
    input.nluAnswer = await request(`${this.settings.luisUrl}${text}`);
    return input;
  }

  processUtterance(utterance) {
    return request(`${this.settings.luisUrl}${utterance}`);
  }

  registerDefault() {
    super.registerDefault();
    this.container.register('NluLuis', NluLuis, false);
  }

  fromCorpus(corpus, transformer) {
    const result = {
      luis_schema_version: '3.2.0',
      versionId: '0.1',
      name: corpus.name,
      desc: corpus.name,
      culture: corpus.locale.toLowerCase(),
      tokenizerVersion: '1.0.0',
      intents: [],
      entities: [],
      composites: [],
      closedLists: [],
      patternAnyEntities: [],
      regex_entities: [],
      prebuiltEntities: [],
      model_features: [],
      regex_features: [],
      patterns: [],
      utterances: [],
      settings: [],
    };
    corpus.data.forEach((item) => {
      result.intents.push({ name: item.intent });
      item.utterances.forEach((utterance) => {
        const tgtUtterance = transformer
          ? transformer(utterance, corpus.locale)
          : utterance;
        result.utterances.push({
          text: tgtUtterance,
          intent: item.intent,
          entities: [],
        });
      });
    });
    return result;
  }
}

module.exports = NluLuis;
