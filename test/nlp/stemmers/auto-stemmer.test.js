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

const { NlpManager, NlpUtil } = require('../../../lib');
const corpuspl = require('./corpus50pl.json');

class TokenStemmer {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }

  tokenizeAndStem(text) {
    return this.tokenizer.tokenize(text);
  }
}

async function scoreCorpus(corpus, manager) {
  const locale = corpus.locale.slice(0, 2);
  for (let i = 0; i < corpus.data.length; i += 1) {
    const { intent, utterances } = corpus.data[i];
    for (let j = 0; j < utterances.length; j += 1) {
      manager.addDocument(locale, utterances[j], intent);
    }
  }
  await manager.train();
  let good = 0;
  let total = 0;
  for (let i = 0; i < corpus.data.length; i += 1) {
    const { intent, tests } = corpus.data[i];
    for (let j = 0; j < tests.length; j += 1) {
      total += 1;
      // eslint-disable-next-line
      const classification = await manager.process(locale, tests[j]);
      if (classification.score < 0.5) {
        classification.intent = 'None';
        classification.score = 1;
      }
      if (classification.intent === intent) {
        good += 1;
      }
    }
  }
  return good / total;
}

describe('Auto Stemmer', () => {
  describe('Stem', () => {
    test('Should have better accuracy than by tokens', async () => {
      const stemmer = new TokenStemmer(NlpUtil.getTokenizer('pl'));
      const managerTokenizer = new NlpManager({
        languages: ['pl'],
        nlu: { useStemDict: false, log: false, useNoneFeature: true, stemmer },
        ner: { builtins: [] },
      });
      const resultTokenizer = await scoreCorpus(corpuspl, managerTokenizer);
      const managerAuto = new NlpManager({
        languages: ['pl'],
        nlu: { useStemDict: false, log: false, useNoneFeature: true },
        ner: { builtins: [] },
      });
      const resultAuto = await scoreCorpus(corpuspl, managerAuto);
      expect(resultAuto).toBeGreaterThan(resultTokenizer);
    });
  });
});
