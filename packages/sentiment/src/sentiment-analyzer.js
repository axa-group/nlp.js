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

class SentimentAnalyzer extends Clonable {
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
      this.settings.tag = 'sentiment-analyzer';
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.applySettings(this, {
      pipelinePrepare: this.getPipeline(`${this.settings.tag}-prepare`),
      pipelineProcess: this.getPipeline(`${this.settings.tag}-process`),
    });
  }

  registerDefault() {
    this.container.registerConfiguration('sentiment-analyzer', {}, false);
  }

  prepare(locale, text, settings, stemmed) {
    const pipeline = this.getPipeline(`${this.settings.tag}-prepare`);
    if (pipeline) {
      const input = {
        text,
        locale,
        settings: settings || this.settings,
      };
      return this.runPipeline(input, pipeline);
    }
    if (stemmed) {
      const stemmer =
        this.container.get(`stemmer-${locale}`) ||
        this.container.get(`stemmer-en`);
      if (stemmer) {
        return stemmer.tokenizeAndStem(text);
      }
    }
    const tokenizer =
      this.container.get(`tokenizer-${locale}`) ||
      this.container.get(`tokenizer-en`);
    if (tokenizer) {
      return tokenizer.tokenize(text, true);
    }
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return normalized.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
  }

  async getDictionary(srcInput) {
    const input = srcInput;
    const dictionaries = this.container.get(`sentiment-${input.locale}`);
    let type;
    if (dictionaries) {
      if (dictionaries.senticon) {
        type = 'senticon';
      } else if (dictionaries.pattern) {
        type = 'pattern';
      } else if (dictionaries.afinn) {
        type = 'afinn';
      }
    }
    if (!type) {
      input.sentimentDictionary = {
        type,
        dictionary: undefined,
        negations: [],
        stemmed: false,
      };
      return input;
    }
    input.sentimentDictionary = {
      type,
      dictionary: dictionaries[type],
      negations: dictionaries.negations.words,
      stemmed:
        dictionaries.stemmed === undefined ? false : dictionaries.stemmed,
    };
    return input;
  }

  async getTokens(srcInput) {
    const input = srcInput;
    if (!input.tokens && input.sentimentDictionary.type) {
      input.tokens = await this.prepare(
        input.locale,
        input.utterance || input.text,
        input.settings,
        input.sentimentDictionary.stemmed
      );
    }
    return input;
  }

  calculate(srcInput) {
    const input = srcInput;
    if (input.sentimentDictionary.type) {
      const tokens = Array.isArray(input.tokens)
        ? input.tokens
        : Object.keys(input.tokens);
      if (!input.sentimentDictionary.dictionary) {
        input.sentiment = {
          score: 0,
          numWords: tokens.length,
          numHits: 0,
          average: 0,
          type: input.sentimentDictionary.type,
          locale: input.locale,
        };
      } else {
        const { dictionary } = input.sentimentDictionary;
        const { negations } = input.sentimentDictionary;
        let score = 0;
        let negator = 1;
        let numHits = 0;
        for (let i = 0; i < tokens.length; i += 1) {
          const token = tokens[i].toLowerCase();
          if (negations.indexOf(token) !== -1) {
            negator = -1;
            numHits += 1;
          } else if (dictionary[token] !== undefined) {
            score += negator * dictionary[token];
            numHits += 1;
          }
        }
        input.sentiment = {
          score,
          numWords: tokens.length,
          numHits,
          average: score / tokens.length,
          type: input.sentimentDictionary.type,
          locale: input.locale,
        };
      }
    } else {
      input.sentiment = {
        score: 0,
        numWords: 0,
        numHits: 0,
        average: 0,
        type: input.sentimentDictionary.type,
        locale: input.locale,
      };
    }
    if (input.sentiment.score > 0) {
      input.sentiment.vote = 'positive';
    } else if (input.sentiment.score < 0) {
      input.sentiment.vote = 'negative';
    } else {
      input.sentiment.vote = 'neutral';
    }
    return input;
  }

  async defaultPipelineProcess(input) {
    let output = await this.getDictionary(input);
    output = await this.getTokens(output);
    output = await this.calculate(output);
    delete output.sentimentDictionary;
    return output;
  }

  process(srcInput, settings) {
    const input = srcInput;
    input.settings = input.settings || settings || this.settings;
    if (this.pipelineProcess) {
      return this.runPipeline(input, this.pipelineProcess);
    }
    return this.defaultPipelineProcess(input);
  }
}

module.exports = SentimentAnalyzer;
