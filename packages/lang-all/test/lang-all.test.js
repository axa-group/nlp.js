const { Container } = require('@nlpjs/core');
const { LangAll } = require('../src');

describe('Language All', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangAll);
      const tokenizer = instance.get('tokenizer-en');
      expect(tokenizer.constructor.name).toEqual('TokenizerEn');
      const stemmer = instance.get('stemmer-en');
      expect(stemmer.constructor.name).toEqual('StemmerEn');
      const stopwords = instance.get('stopwords-en');
      expect(stopwords.constructor.name).toEqual('StopwordsEn');
    });
  });
});
