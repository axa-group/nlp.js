const { containerBootstrap } = require('@nlpjs/core');
const { Ner } = require('../src');

const container = containerBootstrap();

describe('NER', () => {
  describe('Constructor', () => {
    test('It should create an instance', () => {
      const instance = new Ner({ container });
      expect(instance).toBeDefined();
    });
  });
});
