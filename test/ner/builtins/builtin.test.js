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
            message: () => (`expected ${this.utils.printReceived(received)} not to contain resolution ${this.utils.printExpected(argument)}`),
            pass: true,
          };
        }
      }
    }
    return {
      message: () => (`expected ${this.utils.printReceived(received)} to contain resolution ${this.utils.printExpected(argument)}`),
      pass: false,
    };
  },
});

function addTests(base, locale) {
  const upperLocale = `${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
  const utteranceName = `utterance${upperLocale}`;
  const resultName = `result${upperLocale}`;
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
          if ((currentKey.includes('date') || currentKey.includes('Date')) && testCase[key][currentKey].length === 24) {
            testCase[key][currentKey] = new Date(testCase[key][currentKey]);
          }
        }
      }
    }
    if (!testCase.avoid || !testCase.avoid.includes(locale)) {
      const utterance = testCase[utteranceName] || testCase.utterance;
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(utterance).entities;
          expect(result).toContainResolution(Object.assign(testCase.result, testCase[resultName]));
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
];

describe('NER Manager builtins', () => {
  languages.forEach((language) => {
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
});
