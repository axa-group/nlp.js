const { NlpManager } = require('../../packages/node-nlp');
const corpusEn = require('./corpus-en.json');
const corpusEs = require('./corpus-es.json');

async function doTests(manager, corpus) {
  const { data } = corpus;
  let total = 0;
  let good = 0;
  for (let i = 0; i < data.length; i += 1) {
    const intentData = data[i];
    const { tests } = intentData;
    for (let j = 0; j < tests.length; j += 1) {
      const result = await manager.process(corpus.locale.slice(0, 2), tests[j]);
      total += 1;
      if (result.intent === intentData.intent) {
        good += 1;
      }
    }
  }
  console.log(good);
  return total;
}

async function measure(withBuiltins = true) {
  const options = { nlu: { log: false } };
  if (!withBuiltins) {
    options.ner = { builtins: [] };
  }
  const manager = new NlpManager(options);
  await manager.nlp.addCorpora(['corpus-en.json', 'corpus-es.json']);
  console.time('train');
  await manager.train();
  console.timeEnd('train');
  const hrstart = process.hrtime();
  let total = await doTests(manager, corpusEn);
  total += await doTests(manager, corpusEs);
  const hrend = process.hrtime(hrstart);
  const elapsed = hrend[0] * 1000 + hrend[1] / 1000000;
  const timePerUtterance = elapsed / total;
  const utterancesPerSecond = 1000 / timePerUtterance;
  console.log(
    `Milliseconds per utterance (${
      withBuiltins ? 'with' : 'without'
    } builtins): ${timePerUtterance}`
  );
  console.log(
    `Utterances per second (${
      withBuiltins ? 'with' : 'without'
    } builtins): ${utterancesPerSecond}`
  );
}

(async () => {
  await measure(true);
  await measure(false);
})();
