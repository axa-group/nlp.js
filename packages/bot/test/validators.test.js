const { validatorEmail, validatorURL } = require('../src/validators');

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
    test('It should return no valid if input does not contain an email', async () => {
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
});
