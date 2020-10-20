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

const { containerBootstrap } = require('../../packages/core/src');
const { NluNeural } = require('../../packages/nlu/src');
const { LangEn } = require('../../packages/lang-en/src');
// const { containerBootstrap } = require('@nlpjs/core');
// const { NluNeural } = require('@nlpjs/nlu');
// const { LangEn } = require('@nlpjs/lang-en');
const corpus = require('./corpus50.json');

function prepareCorpus(input, isTests = false) {
  const result = [];
  for (let i = 0; i < input.data.length; i += 1) {
    const { intent } = input.data[i];
    const utterances = isTests ? input.data[i].tests : input.data[i].utterances;
    for (let j = 0; j < utterances.length; j += 1) {
      result.push({ utterance: utterances[j], intent });
    }
  }
  return result;
}

async function measure(useStemmer) {
  const container = await containerBootstrap();
  if (useStemmer) {
    container.use(LangEn);
  }
  const nlu = new NluNeural({ container, locale: 'en', log: false });
  await nlu.train(prepareCorpus(corpus));
  const tests = prepareCorpus(corpus, true);
  let good = 0;
  let total = 0;
  for (let i = 0; i < tests.length; i += 1) {
    const { utterance, intent } = tests[i];
    const result = await nlu.process(utterance);
    total += 1;
    if (result.classifications[0].intent === intent) {
      good += 1;
    }
  }
  console.log(
    `Stemmer: ${useStemmer} Good: ${good} Total: ${total} Precision: ${
      good / total
    }`
  );
}

(async () => {
  await measure(false);
  await measure(true);
})();
