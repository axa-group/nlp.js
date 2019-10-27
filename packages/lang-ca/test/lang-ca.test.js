const { Container } = require('@nlpjs/core');
const { LangCa } = require('../src');

describe('Language Catalan', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangCa);
      const tokenizer = instance.get('tokenizer-ca');
      expect(tokenizer.constructor.name).toEqual('TokenizerCa');
      const stemmer = instance.get('stemmer-ca');
      expect(stemmer.constructor.name).toEqual('StemmerCa');
      const stopwords = instance.get('stopwords-ca');
      expect(stopwords.constructor.name).toEqual('StopwordsCa');
      const normalizer = instance.get('normalizer-ca');
      expect(normalizer.constructor.name).toEqual('NormalizerCa');
    });
  });
});
