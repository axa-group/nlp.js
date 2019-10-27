const { Container } = require('@nlpjs/core');
const { LangBn } = require('../src');

describe('Language Bengali', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangBn);
      const tokenizer = instance.get('tokenizer-bn');
      expect(tokenizer.constructor.name).toEqual('TokenizerBn');
      const stemmer = instance.get('stemmer-bn');
      expect(stemmer.constructor.name).toEqual('StemmerBn');
      const stopwords = instance.get('stopwords-bn');
      expect(stopwords.constructor.name).toEqual('StopwordsBn');
      const normalizer = instance.get('normalizer-bn');
      expect(normalizer.constructor.name).toEqual('NormalizerBn');
    });
  });
});
