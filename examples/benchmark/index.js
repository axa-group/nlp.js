const fs = require('fs');
const path = require('path');
const { NlpManager } = require('../../lib');

const corpusNames = [
  '../nlu-benchmark/AskUbuntuCorpus.json',
  '../nlu-benchmark/ChatbotCorpus.json',
  '../nlu-benchmark/WebApplicationCorpus.json',
  './corpus50.json',
];

function findIntent(list, intent) {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].intent === intent) {
      return list[i];
    }
  }
  const result = {
    intent,
    utterances: [],
  };
  list.push(result);
  return result;
}

function translateCorpus(corpus) {
  const result = { training: [], tests: [] };
  if (corpus.sentences) {
    corpus.sentences.forEach(sentence => {
      const intent = findIntent(
        result[sentence.training ? 'training' : 'tests'],
        sentence.intent
      );
      intent.utterances.push(sentence.text);
    });
  } else if (corpus.data) {
    for (let i = 0; i < corpus.data.length; i += 1) {
      const current = corpus.data[i];
      const currentTraining = {
        intent: current.intent,
        utterances: [],
      };
      result.training.push(currentTraining);
      const currentTest = {
        intent: current.intent,
        utterances: [],
      };
      result.tests.push(currentTest);
      current.utterances.forEach(utterance => {
        currentTraining.utterances.push(utterance);
      });
      current.tests.forEach(utterance => {
        currentTest.utterances.push(utterance);
      });
    }
  }
  return result;
}

async function evaluate(nlu, corpus) {
  let good = 0;
  let bad = 0;
  const errors = [];
  for (let i = 0; i < corpus.tests.length; i += 1) {
    const intent = corpus.tests[i];
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
        bad += 1;
      }
    }
  }
  return { good, bad, errors };
}

async function scoreCorpus(corpus, name) {
  const manager = new NlpManager({
    languages: ['en'],
    nlu: { useStemDict: false, log: false, useNoneFeature: true },
    ner: { builtins: [] },
  });
  corpus.training.forEach(intent => {
    intent.utterances.forEach(utterance => {
      manager.addDocument('en', utterance, intent.intent);
    });
  });
  await manager.train();
  const result = await evaluate(manager, corpus);
  console.log(
    `${name} Score: ${result.good / (result.good + result.bad)} Bads: ${
      result.bad
    } Good: ${result.good}`
  );
  return result;
}

async function main() {
  const hrstart = process.hrtime();
  let totalGood = 0;
  let totalBad = 0;
  for (let i = 0; i < corpusNames.length; i += 1) {
    const name = path.basename(corpusNames[i]);
    const corpusSrc = JSON.parse(fs.readFileSync(corpusNames[i], 'utf8'));
    const corpus = translateCorpus(corpusSrc);
    // eslint-disable-next-line no-await-in-loop
    const score = await scoreCorpus(corpus, name);
    totalBad += score.bad;
    totalGood += score.good;
  }
  const totalSentences = totalBad + totalGood;
  console.log(
    `Totals: ${totalSentences} sentences, ${totalBad} errors, accuracy: ${(
      (totalGood * 100) /
      totalSentences
    ).toFixed(2)}%`
  );
  const hrend = process.hrtime(hrstart);
  console.log(`Executed in ${hrend[0] * 1000 + hrend[1] / 1000000} ms`);
}

main();
