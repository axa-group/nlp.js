const {
  validatorEmail,
  validatorURL,
  validatorIP,
  validatorIPv4,
  validatorIPv6,
} = require('../src/validators');

function buildSession(text) {
  return {
    text,
  };
}

describe('Validators', () => {
  describe('Validator Email', () => {
    test('It should be able to extract an email', async () => {
      const input = 'My mail is something@mail.com';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorEmail(session, context, ['userEmail']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userEmail', value: 'something@mail.com' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain an email', async () => {
      const input = 'My mail is something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorEmail(session, context, ['userEmail']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator URL', () => {
    test('It should be able to extract an URL', async () => {
      const input = 'My url is https://www.url.com';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorURL(session, context, ['userURL']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userURL', value: 'https://www.url.com' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain an URL', async () => {
      const input = 'My url is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorURL(session, context, ['userURL']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator IP', () => {
    test('It should be able to extract an IP', async () => {
      const input = 'My ip is 8.8.8.8';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIP(session, context, ['userIP']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userIP', value: '8.8.8.8' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract an IPv6', async () => {
      const input = 'My ip is ABEF:452::FE10';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIP(session, context, ['userIP']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userIP', value: 'ABEF:452::FE10' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain an IP', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIP(session, context, ['userIP']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator IPv4', () => {
    test('It should be able to extract an IPv4', async () => {
      const input = 'My ip is 8.8.8.8';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv4(session, context, ['userIP']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userIP', value: '8.8.8.8' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should fail if the ip is IPv6', async () => {
      const input = 'My ip is ABEF:452::FE10';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv4(session, context, ['userIP']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain an IP', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv4(session, context, ['userIP']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator IPv6', () => {
    test('It should be able to extract an IPv6', async () => {
      const input = 'My ip is ABEF:452::FE10';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv6(session, context, ['userIP']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userIP', value: 'ABEF:452::FE10' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should fail if the ip is IPv4', async () => {
      const input = 'My ip is 8.8.8.8';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv6(session, context, ['userIP']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain an IP', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorIPv6(session, context, ['userIP']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });
});
