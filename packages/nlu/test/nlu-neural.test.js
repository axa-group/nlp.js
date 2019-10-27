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
      expect(status.status.iterations).toEqual(26);
      const json = nlu.neuralNetwork.toJSON();
      nlu.neuralNetwork.fromJSON(json);
      let good = 0;
      for (let i = 0; i < srccorpus.data.length; i += 1) {
        const { intent, tests } = srccorpus.data[i];
        for (let j = 0; j < tests.length; j += 1) {
          const result = await nlu.process(tests[j]);
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
  });
});
