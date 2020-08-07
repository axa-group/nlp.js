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

const { NlpManager } = require('../../packages/node-nlp');
const { LangBert } = require('../../packages/lang-bert');
const corpusEn = require('./corpus-en.json');
const corpusEs = require('./corpus-es.json');

async function doTests(manager, corpus) {
  const { data } = corpus;
  let total = 0;
  let good = 0;
  let bad = 0;
  const promises = [];
  const intents = [];
  for (let i = 0; i < data.length; i += 1) {
    const intentData = data[i];
    const { tests } = intentData;
    for (let j = 0; j < tests.length; j += 1) {
      promises.push(manager.process(corpus.locale.slice(0, 2), tests[j]));
      intents.push(intentData.intent);
    }
  }
  total += promises.length;
  const results = await Promise.all(promises);
  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.intent === intents[i]) {
      good += 1;
    } else {
      bad += 1;
    }
  }
  console.log(`Good: ${good}`);
  console.log(`Bad: ${bad}`);
  console.log(`Precision: ${(good * 100) / (good + bad)}`);
  return total;
}

async function measure() {
  const options = { nlu: { log: true }, ner: { builtins: [] } };
  const manager = new NlpManager(options);
  manager.container.registerConfiguration('bert', {
    vocabs: [
      {
        locales: 'en',
        fileName: './vocab-en.txt',
      },
      {
        locales: '*',
        fileName: './vocab-multi.txt',
        settings: {
          lowercase: true,
        },
      },
    ],
    useRemote: false,
    url: 'http://localhost:8000/tokenize',
    languages: ['en', 'es'],
  });
  manager.container.use(LangBert);
  await manager.nlp.addCorpora(['corpus-en.json', 'corpus-es.json']);
  console.time('train');
  await manager.train();
  console.timeEnd('train');
  const hrstart = process.hrtime();
  console.log(`\nProcessing English Corpus...`);
  let total = await doTests(manager, corpusEn);
  console.log(`\nProcessing Spanish Corpus...`);
  total += await doTests(manager, corpusEs);
  const hrend = process.hrtime(hrstart);
  const elapsed = hrend[0] * 1000 + hrend[1] / 1000000;
  const timePerUtterance = elapsed / total;
  const utterancesPerSecond = 1000 / timePerUtterance;
  console.log(`\nMilliseconds per utterance: ${timePerUtterance}`);
  console.log(`Utterances per second: ${utterancesPerSecond}`);
}

(async () => {
  await measure(false);
})();
