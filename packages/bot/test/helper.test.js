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

const { isJsonObject, getValidationMessage } = require('../src/helper');

describe('isJsonObject', () => {
  test('It should be able to detect objects', async () => {
    expect(isJsonObject('text')).toEqual(false);
    expect(isJsonObject(123)).toEqual(false);
    expect(isJsonObject({})).toEqual(true);
    expect(isJsonObject({ text: 'sample' })).toEqual(true);
    expect(isJsonObject('{"text": 123}')).toEqual(true);
    expect(isJsonObject('{"text: 123}')).toEqual(false);
  });
});

describe('getValidationMessage', () => {
  test('It should be always the same', async () => {
    const validationCase1 = {
      currentRetry: 1,
      message: 'wrong value, try again',
    };
    expect(validationCase1.message).toEqual(
      getValidationMessage(validationCase1)
    );
    validationCase1.currentRetry += 1;
    expect(validationCase1.message).toEqual(
      getValidationMessage(validationCase1)
    );
  });

  test('It should be always the same although is a list', async () => {
    const validationCase1 = {
      currentRetry: 1,
      message: ['wrong value, try again'],
    };
    expect(validationCase1.message[0]).toEqual(
      getValidationMessage(validationCase1)
    );
    validationCase1.currentRetry += 1;
    expect(validationCase1.message[0]).toEqual(
      getValidationMessage(validationCase1)
    );
    validationCase1.currentRetry += 1;
    expect(validationCase1.message[0]).toEqual(
      getValidationMessage(validationCase1)
    );
  });

  test('It should return a different error message', async () => {
    const validationCase1 = {
      currentRetry: 1,
      message: [
        'wrong value, try again',
        'again is a wrong value, try one time more',
      ],
    };
    expect(validationCase1.message[0]).toEqual(
      getValidationMessage(validationCase1)
    );
    validationCase1.currentRetry += 1;
    expect(validationCase1.message[1]).toEqual(
      getValidationMessage(validationCase1)
    );
  });

  test('It should return the last message if current retry exceeds index', async () => {
    const validationCase1 = {
      currentRetry: 4,
      message: [
        'wrong value, try again',
        'again is a wrong value, try one time more',
      ],
    };
    expect(validationCase1.message[validationCase1.message.length - 1]).toEqual(
      getValidationMessage(validationCase1)
    );
  });
});
