const {
  Container,
  Normalizer,
  Tokenizer,
  Stemmer,
  Stopwords,
} = require('@nlpjs/core');
const Nlu = require('../src/nlu');

function bootstrap() {
  const container = new Container();
  container.register('normalize', new Normalizer(container));
  container.register('tokenize', new Tokenizer(container));
  container.register('stem', new Stemmer(container));
  container.register('removeStopwords', new Stopwords(container));
  return container;
}

describe('NLU', () => {
  describe('Constructor', () => {
    test('An instance can be created', () => {
      const nlu = new Nlu();
      expect(nlu).toBeDefined();
    });
    test('Some settings are by default', () => {
      const nlu = new Nlu();
      expect(nlu.settings.locale).toEqual('en');
      expect(nlu.settings.keepStopwords).toBeTruthy();
      expect(nlu.settings.nonefeatureValue).toEqual(1);
      expect(nlu.settings.nonedeltaMultiplier).toEqual(1.2);
      expect(nlu.settings.spellcheckDistance).toEqual(0);
    });
    test('The settings can be provided in constructor', () => {
      const nlu = new Nlu({ locale: 'fr', keepStopwords: false });
      expect(nlu.settings.locale).toEqual('fr');
      expect(nlu.settings.keepStopwords).toBeFalsy();
      expect(nlu.settings.nonefeatureValue).toEqual(1);
      expect(nlu.settings.nonedeltaMultiplier).toEqual(1.2);
      expect(nlu.settings.spellcheckDistance).toEqual(0);
    });
  });

  describe('Prepare', () => {
    test('Prepare will generate an array of tokens', async () => {
      const container = bootstrap();
      const nlu = new Nlu({ locale: 'en', keepStopwords: true }, container);
      const input = 'Allí hay un ratón';
      const actual = await nlu.prepare(input);
      expect(actual).toEqual(['alli', 'hay', 'un', 'raton']);
    });
  });
});
