const {
  ArrToObj,
  Container,
  Normalizer,
  Tokenizer,
  Stemmer,
  Stopwords,
  Timer,
} = require('@nlpjs/core');
const { NluNeural } = require('../src');

class OtherNlu extends NluNeural {
  registerDefault() {
    super.registerDefault();
    this.container.register('OtherNlu', OtherNlu, false);
  }
}

const container = new Container();
container.use(ArrToObj);
container.use(Normalizer);
container.use(Tokenizer);
container.use(Stemmer);
container.use(Stopwords);
container.use(Timer);
container.use(NluNeural);
container.use(OtherNlu);

module.exports = container;
