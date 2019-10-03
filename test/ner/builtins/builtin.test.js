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

const { NlpManager } = require('../../../lib');
const numberAgeTests = require('./number-age.json');
const numberTests = require('./number.json');
const numberOrdinalTests = require('./number-ordinal.json');
const numberPercentTests = require('./number-percent.json');
const numberCurrency = require('./number-currency.json');
const numberDimension = require('./number-dimension.json');
const sequence = require('./sequence.json');
const date = require('./date.json');

expect.extend({
  toContainResolution(received, argument) {
    for (let i = 0; i < received.length; i += 1) {
      const actual = received[i];
      if (actual.resolution) {
        const keys = Object.keys(argument);
        let pass = true;
        for (let j = 0; j < keys.length; j += 1) {
          const key = keys[j];
          if (!actual.resolution[key]) {
            pass = false;
          }
          if (argument[key] !== '*') {
            if (!this.equals(actual.resolution[key], argument[key])) {
              pass = false;
            }
          }
        }
        if (pass) {
          return {
            message: () =>
              `expected ${this.utils.printReceived(
                received
              )} not to contain resolution ${this.utils.printExpected(
                argument
              )}`,
            pass: true,
          };
        }
      }
    }
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          received
        )} to contain resolution ${this.utils.printExpected(argument)}`,
      pass: false,
    };
  },
});

function addTests(base, locale) {
  const manager = new NlpManager({ languages: [locale] });
  for (let i = 0; i < base.length; i += 1) {
    const testCase = base[i];
    const keys = Object.keys(testCase);
    for (let j = 0; j < keys.length; j += 1) {
      const key = keys[j];
      if (key.startsWith('result')) {
        const current = testCase[key];
        const currentKeys = Object.keys(current);
        for (let k = 0; k < currentKeys.length; k += 1) {
          const currentKey = currentKeys[k];
          if (
            (currentKey.includes('date') || currentKey.includes('Date')) &&
            testCase[key][currentKey].length === 24
          ) {
            testCase[key][currentKey] = new Date(testCase[key][currentKey]);
          }
        }
      }
    }
    if (!testCase.avoid || !testCase.avoid.includes(locale)) {
      const upperLocale = `${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
      const utteranceName = `utterance${upperLocale}`;
      const utterance = testCase[utteranceName] || testCase.utterance;
      const resultName = `result${upperLocale}`;
      if (utterance) {
        test(utterance, async () => {
          const expected = Object.assign(testCase.result, testCase[resultName]);
          const { entities: result } = await manager.process(utterance);
          expect(result).toContainResolution(expected);
        });
      }
    }
  }
}

const languages = [
  { locale: 'en', name: 'English' },
  { locale: 'es', name: 'Spanish' },
  { locale: 'fr', name: 'French' },
  { locale: 'pt', name: 'Portuguese' },
  { locale: 'zh', name: 'Chinese' },
  { locale: 'ja', name: 'Japanese' },];

describe('NER Manager builtins', () => {
  languages.forEach(language => {
    describe(`Numbers ${language.name}`, () => {
      addTests(numberTests, language.locale);
    });
    describe(`Ordinal ${language.name}`, () => {
      addTests(numberOrdinalTests, language.locale);
    });
    describe(`Percentage ${language.name}`, () => {
      addTests(numberPercentTests, language.locale);
    });
    describe(`Age ${language.name}`, () => {
      addTests(numberAgeTests, language.locale);
    });
    describe(`Currency ${language.name}`, () => {
      addTests(numberCurrency, language.locale);
    });
    describe(`Dimension ${language.name}`, () => {
      addTests(numberDimension, language.locale);
    });
    describe(`Sequence ${language.name}`, () => {
      addTests(sequence, language.locale);
    });
    describe(`Date ${language.name}`, () => {
      addTests(date, language.locale);
    });
  });
  describe(`Date english`, () => {
    test('tomorrow morning', async () => {
      const manager = new NlpManager({ languages: ['en'] });
      const { entities: results } = await manager.process('tomorrow morning');
      const [result] = results;
      expect(result).toBeDefined();
      expect(result.end).toEqual(15);
      expect(result.entity).toEqual('datetimerange');
      expect(result.len).toEqual(16);
      expect(result.sourceText).toEqual('tomorrow morning');
      expect(result.resolution).toBeDefined();
    });
  });
});


