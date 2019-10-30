const { DomainManager } = require('../src');
const container = require('./bootstrap');

describe('Domain Manager', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const manager = new DomainManager({ container });
      expect(manager).toBeDefined();
    });
  });
});
