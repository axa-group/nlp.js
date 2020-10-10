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
const { Nlp } = require('../../packages/nlp/src');
// const { containerBootstrap } = require('@nlpjs/core');
// const { Nlp } = require('@nlpjs/nlp');

async function measureCorpus(corpus, plugins, showErrors = true) {
  const container = await containerBootstrap();
  container.use(Nlp);
  if (plugins) {
    plugins.forEach((plugin) => {
      container.use(plugin);
    });
  }
  const nlp = container.get('nlp');
  nlp.settings.threshold = 0;
  nlp.settings.autoSave = false;
  await nlp.addCorpus(corpus);
  await nlp.train();
  let total = 0;
  let good = 0;
  let perfect = 0;
  for (let i = 0; i < corpus.data.length; i += 1) {
    const item = corpus.data[i];
    for (let j = 0; j < item.tests.length; j += 1) {
      const test = item.tests[j];
      total += 1;
      const result = await nlp.process(test);
      if (result.intent === item.intent) {
        good += 1;
        if (result.score >= 0.5) {
          perfect += 1;
        }
      } else if (showErrors) {
        console.log(
          `Expected: ${item.intent} Received: ${result.intent} "${test}"`
        );
      }
    }
  }
  console.log(`Total tests executed: ${total}`);
  console.log(`Total intents guessed correctly: ${good}`);
  console.log(`Total intents guessed correctly with score >= 0.5: ${perfect}`);
  console.log(`Precision without threshold: ${(good * 100) / total}%`);
  console.log(`Precision with threshold: ${(perfect * 100) / total}%`);
}

module.exports = measureCorpus;
