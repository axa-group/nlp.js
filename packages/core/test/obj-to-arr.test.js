const ObjToArr = require('../src/obj-to-arr');
const { Container } = require('../src/container');
const containerBootstrap = require('../src/container-bootstrap');

describe('ObjToArr', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const objToArr = new ObjToArr();
      expect(objToArr).toBeDefined();
    });
  });

  describe('Static objToArr', () => {
    test('It should transform an object to an array', () => {
      const obj = { when: 1, the: 1, moon: 1 };
      const actual = ObjToArr.objToArr(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('If an empty object is provided return empty array', () => {
      const obj = {};
      const actual = ObjToArr.objToArr(obj);
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container', () => {
    test('I can register it as a plugin', () => {
      const container = new Container();
      container.use(ObjToArr);
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('I can register it as a plugin and use it inside an input as tokens property', () => {
      const container = new Container();
      container.use(ObjToArr);
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run({ tokens: obj });
      const expected = { tokens: ['when', 'the', 'moon'] };
      expect(actual).toEqual(expected);
    });
  });

  describe('With Container Bootstrap', () => {
    test('It is already registered as a plugin', () => {
      const container = containerBootstrap();
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run(obj);
      const expected = ['when', 'the', 'moon'];
      expect(actual).toEqual(expected);
    });
    test('It is already registered as a plugin and can use it inside an input as tokens property', () => {
      const container = containerBootstrap();
      const obj = { when: 1, the: 1, moon: 1 };
      const objToArr = container.get('objToArr');
      const actual = objToArr.run({ tokens: obj });
      const expected = { tokens: ['when', 'the', 'moon'] };
      expect(actual).toEqual(expected);
    });
  });
});
