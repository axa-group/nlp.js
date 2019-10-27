const { Container } = require('@nlpjs/core');
const { LangHy } = require('../src');

describe('Language Armenian', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangHy);
      const tokenizer = instance.get('tokenizer-hy');
      expect(tokenizer.constructor.name).toEqual('TokenizerHy');
      const stemmer = instance.get('stemmer-hy');
      expect(stemmer.constructor.name).toEqual('StemmerHy');
      const stopwords = instance.get('stopwords-hy');
      expect(stopwords.constructor.name).toEqual('StopwordsHy');
      const normalizer = instance.get('normalizer-hy');
      expect(normalizer.constructor.name).toEqual('NormalizerHy');
    });
  });
});
