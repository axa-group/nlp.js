const { Container } = require('@nlpjs/core');
const { LangEs } = require('../src');

describe('Language Spanish', () => {
  describe('Use plugin', () => {
    test('Should register the classes', () => {
      const instance = new Container();
      instance.use(LangEs);
      const tokenizer = instance.get('tokenizer-es');
      expect(tokenizer.constructor.name).toEqual('TokenizerEs');
      const stemmer = instance.get('stemmer-es');
      expect(stemmer.constructor.name).toEqual('StemmerEs');
      const stopwords = instance.get('stopwords-es');
      expect(stopwords.constructor.name).toEqual('StopwordsEs');
    });
  });
});
