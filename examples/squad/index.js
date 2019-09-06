const { NlpManager } = require('../../lib');
const corpus = require('./squad.json');

async function evaluate(nlu) {
  let good = 0;
  let bad = 0;
  const errors = [];
  for (let i = 0; i < corpus.length; i += 1) {
    const intent = corpus[i];
    for (let j = 0; j < intent.utterances.length; j += 1) {
      const utterance = intent.utterances[j];
      // eslint-disable-next-line no-await-in-loop
      const classification = await nlu.process('en', utterance);
      if (classification.score < 0.5) {
        classification.intent = 'None';
        classification.score = 1;
      }
      if (classification.intent === intent.intent) {
        good += 1;
      } else {
        console.log(utterance);
        console.log(
          `Expected: ${intent.intent} Actual: ${
            classification.intent
          } ${classification.score.toFixed(2)}`
        );
        console.log(
          `Classifications: ${
            classification.classifications[0].label
          } ${classification.classifications[0].value.toFixed(2)} ${
            classification.classifications[1].label
          } ${classification.classifications[1].value.toFixed(2)}`
        );
        bad += 1;
      }
    }
  }
  return { good, bad, errors };
}

async function main() {
  const manager = new NlpManager({
    languages: ['en'],
    nlu: { useStemDict: false, log: true, useNoneFeature: true },
    ner: { builtins: [] },
  });
  corpus.forEach(intent => {
    intent.utterances.forEach(utterance => {
      manager.addDocument('en', utterance, intent.intent);
    });
  });
  const hrstart = process.hrtime();
  // manager.load();
  // manager.load('./examples/squad/model.nlp');
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.log(`Trained in ${hrend[0] * 1000 + hrend[1] / 1000000} ms`);
  manager.save();
  const hrstart2 = process.hrtime();
  const result = await evaluate(manager);
  const hrend2 = process.hrtime(hrstart2);
  console.log(`Executed in ${hrend2[0] * 1000 + hrend2[1] / 1000000} ms`);
  console.log(result);
}

main();
