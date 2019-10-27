const { Container } = require('@nlpjs/core');
const { LangEu } = require('../src');

describe('Language Basque', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangEu);
      const tokenizer = instance.get('tokenizer-eu');
      expect(tokenizer.constructor.name).toEqual('TokenizerEu');
      const stemmer = instance.get('stemmer-eu');
      expect(stemmer.constructor.name).toEqual('StemmerEu');
      const stopwords = instance.get('stopwords-eu');
      expect(stopwords.constructor.name).toEqual('StopwordsEu');
      const normalizer = instance.get('normalizer-eu');
      expect(normalizer.constructor.name).toEqual('NormalizerEu');
    });
  });
});
