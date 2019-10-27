const { Container } = require('@nlpjs/core');
const { LangAr } = require('../src');

describe('Language Arabic', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangAr);
      const tokenizer = instance.get('tokenizer-ar');
      expect(tokenizer.constructor.name).toEqual('TokenizerAr');
      const stemmer = instance.get('stemmer-ar');
      expect(stemmer.constructor.name).toEqual('StemmerAr');
      const stopwords = instance.get('stopwords-ar');
      expect(stopwords.constructor.name).toEqual('StopwordsAr');
      const normalizer = instance.get('normalizer-ar');
      expect(normalizer.constructor.name).toEqual('NormalizerAr');
    });
  });
});
