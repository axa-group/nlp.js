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

const {
  ArrToObj,
  Container,
  Normalizer,
  Tokenizer,
  Stemmer,
  Stopwords,
} = require('@nlpjs/core');
const { NluNeural } = require('../src');
const srccorpus = require('./corpus50.json');

const corpus = [];
for (let i = 0; i < srccorpus.data.length; i += 1) {
  const { intent, utterances } = srccorpus.data[i];
  for (let j = 0; j < utterances.length; j += 1) {
    corpus.push({ utterance: utterances[j], intent });
  }
}

function bootstrap() {
  const container = new Container();
  container.use(ArrToObj);
  container.use(Normalizer);
  container.use(Tokenizer);
  container.use(Stemmer);
  container.use(Stopwords);
  return container;
}

describe('NLU Neural', () => {
  describe('Train and process', () => {
    test('It can train and process a corpus', async () => {
      const nlu = new NluNeural({ locale: 'en' }, bootstrap());
      const status = await nlu.train(corpus);
      expect(status.status.iterations).toEqual(34);
      const json = nlu.neuralNetwork.toJSON();
      nlu.neuralNetwork.fromJSON(json);
      let good = 0;
      for (let i = 0; i < srccorpus.data.length; i += 1) {
        const { intent, tests } = srccorpus.data[i];
        for (let j = 0; j < tests.length; j += 1) {
          let result = await nlu.process(tests[j]);
          if (result.classifications) {
            result = result.classifications;
          }
          const best = result[0] || 'None';
          if (best.intent === intent) {
            if (intent === 'None' || best.score >= 0.5) {
              good += 1;
            }
          } else if (intent === 'None' && best.score < 0.5) {
            good += 1;
          }
        }
      }
      expect(good).toBeGreaterThan(194);
    });

    test('It can explain the results', async () => {
      const nlu = new NluNeural(
        { locale: 'en', returnExplanation: true },
        bootstrap()
      );
      await nlu.train(corpus);
      const result = await nlu.process('what develop your company');
      expect(result.explanation).toBeDefined();
      expect(result.explanation).toEqual([
        {
          stem: '##bias',
          token: '',
          weight: -1.5109167334016105,
        },
        {
          stem: 'what',
          token: 'what',
          weight: 1.7451834678649902,
        },
        {
          stem: 'develop',
          token: 'develop',
          weight: 2.6306886672973633,
        },
        {
          stem: 'your',
          token: 'your',
          weight: 1.4032098054885864,
        },
        {
          stem: 'company',
          token: 'company',
          weight: 5.8944525718688965,
        },
      ]);
    });
  });
});
