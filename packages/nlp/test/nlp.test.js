const { Nlp } = require('../src');

describe('NLP', () => {
  describe('Constructor', () => {
    const nlp = new Nlp();
    expect(nlp).toBeDefined();
  });

  describe('Guess language', () => {
    test('Should guess the language of an utterance', () => {
      const manager = new Nlp();
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new Nlp();
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Add Document', () => {
    test('A document can be added', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('A document can be added training by domain', () => {
      const nlp = new Nlp({ nlu: { trainByDomain: true } });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Remove Document', () => {
    test('A document can be removed', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('A document can be removed training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale cannot be guessed then throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });
});
