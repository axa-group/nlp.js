const ArrToObj = require('../src/arr-to-obj');
const { Container } = require('../src/container');
const containerBootstrap = require('../src/container-bootstrap');

describe('ArrToObj', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const arrToObj = new ArrToObj();
      expect(arrToObj).toBeDefined();
    });
  });

  describe('Static arrToObj', () => {
    test('It should transform an array to an object', () => {
      const arr = ['when', 'the', 'moon'];
      const actual = ArrToObj.arrToObj(arr);
      const expected = { when: 1, the: 1, moon: 1 };
      expect(actual).toEqual(expected);
    });
    test('It should remove repeated words', () => {
      const arr = ['when', 'the', 'moon', 'when', 'the'];
      const actual = ArrToObj.arrToObj(arr);
      const expected = { when: 1, the: 1, moon: 1 };
      expect(actual).toEqual(expected);
    });
    test('If an empty array is provided return empty object', () => {
      const arr = [];
      const actual = ArrToObj.arrToObj(arr);
      const expected = {};
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container', () => {
    test('I can register it as a plugin', () => {
      const container = new Container();
      container.use(ArrToObj);
      const arr = ['when', 'the', 'moon'];
      const arrToObj = container.get('arrToObj');
      const actual = arrToObj.run(arr);
      const expected = { when: 1, the: 1, moon: 1 };
      expect(actual).toEqual(expected);
    });
    test('I can register it as a plugin and use it inside an input as tokens property', () => {
      const container = new Container();
      container.use(ArrToObj);
      const arr = ['when', 'the', 'moon'];
      const arrToObj = container.get('arrToObj');
      const actual = arrToObj.run({ tokens: arr });
      const expected = { tokens: { when: 1, the: 1, moon: 1 } };
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container Bootstrap', () => {
    test('It is already registered as a plugin', () => {
      const container = containerBootstrap();
      const arr = ['when', 'the', 'moon'];
      const arrToObj = container.get('arrToObj');
      const actual = arrToObj.run(arr);
      const expected = { when: 1, the: 1, moon: 1 };
      expect(actual).toEqual(expected);
    });
    test('It is already registered as a plugin and can use it inside an input as tokens property', () => {
      const container = containerBootstrap();
      const arr = ['when', 'the', 'moon'];
      const arrToObj = container.get('arrToObj');
      const actual = arrToObj.run({ tokens: arr });
      const expected = { tokens: { when: 1, the: 1, moon: 1 } };
      expect(actual).toEqual(expected);
    });
  });
});
