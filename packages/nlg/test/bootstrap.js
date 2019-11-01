const {
  ArrToObj,
  Container,
  Normalizer,
  Tokenizer,
  Stemmer,
  Stopwords,
  Timer,
} = require('@nlpjs/core');

const container = new Container();
container.use(ArrToObj);
container.use(Normalizer);
container.use(Tokenizer);
container.use(Stemmer);
container.use(Stopwords);
container.use(Timer);

module.exports = container;
