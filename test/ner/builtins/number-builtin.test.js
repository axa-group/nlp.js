const { NlpManager } = require('../../../lib');
const numberAgeTests = require('./number-age.json');
const numberTests = require('./number.json');
const numberOrdinalTests = require('./number-ordinal.json');

expect.extend({
  toContainResolution(received, argument) {
    for (let i = 0; i < received.length; i += 1) {
      const actual = received[i];
      if (actual.resolution) {
        const pass = this.equals(actual.resolution, argument);
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
  const utteranceName = `utterance${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
  const manager = new NlpManager({ languages: [locale] });
  for (let i = 0; i < base.length; i += 1) {
    const testCase = base[i];
    if (!testCase.avoid || !testCase.avoid.includes(locale)) {
      const utterance = testCase[utteranceName] || testCase.utterance;
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(utterance).entities;
          expect(result).toContainResolution(testCase.result);
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

describe('NerManager Number builtins', () => {
  languages.forEach((language) => {
    describe(`Numbers ${language.name}`, () => {
      addTests(numberTests, language.locale);
    });
    describe(`Ordinal ${language.name}`, () => {
      addTests(numberOrdinalTests, language.locale);
    });
    describe(`Age ${language.name}`, () => {
      addTests(numberAgeTests, language.locale);
    });
  });
});
