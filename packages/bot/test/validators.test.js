/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {
  validatorEmail,
  validatorURL,
  validatorIP,
  validatorIPv4,
  validatorIPv6,
  validatorPhoneNumber,
  validatorNumber,
  validatorInteger,
  validatorDate,
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

  describe('Validator PhoneNumber', () => {
    test('It should be able to extract a Phone Number', async () => {
      const input = 'My phone is 555-567-6894';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorPhoneNumber(session, context, [
        'userPhone',
      ]);
      const expected = {
        isValid: true,
        changes: [{ name: 'userPhone', value: '555-567-6894' }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain a phone number', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorPhoneNumber(session, context, [
        'userPhone',
      ]);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator Number', () => {
    test('It should be able to extract an integer', async () => {
      const input = 'Number is 547';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorNumber(session, context, ['userNumber']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userNumber', value: 547 }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract a negative integer', async () => {
      const input = 'Number is -547';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorNumber(session, context, ['userNumber']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userNumber', value: -547 }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract a float', async () => {
      const input = 'Number is 547.7';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorNumber(session, context, ['userNumber']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userNumber', value: 547.7 }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain a number', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorNumber(session, context, ['userNumber']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator Integer', () => {
    test('It should be able to extract an integer', async () => {
      const input = 'Number is 547';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorInteger(session, context, ['userNumber']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userNumber', value: 547 }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should be able to extract a negative integer', async () => {
      const input = 'Number is -547';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorInteger(session, context, ['userNumber']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userNumber', value: -547 }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if number is float', async () => {
      const input = 'Number is 547.7';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorInteger(session, context, ['userNumber']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain a number', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorInteger(session, context, ['userNumber']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('Validator Date', () => {
    test('It should be able to extract a date', async () => {
      const input = 'It will be 29/02/2020';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorDate(session, context, ['userDate']);
      const expected = {
        isValid: true,
        changes: [{ name: 'userDate', value: new Date(2020, 1, 29) }],
      };
      expect(actual).toEqual(expected);
    });
    test('It should return no valid if input does not contain a date', async () => {
      const input = 'My ip is http:/something@';
      const session = buildSession(input);
      const context = {};
      const actual = await validatorDate(session, context, ['userDate']);
      const expected = {
        isValid: false,
      };
      expect(actual).toEqual(expected);
    });
  });
});
