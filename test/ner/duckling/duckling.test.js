const { NlpManager } = require('../../../lib');
const NerDuckling = require('../../../lib/ner/ner-duckling');

function getManager(locale) {
  const manager = new NlpManager({
    languages: [locale],
    ner: { useDuckling: true },
  });
  manager.nerManager.nerRecognizer.request = (utterance, language) => {
    return new Promise((resolve, reject) => {
      if (language.startsWith('en')) {
        switch (utterance) {
          case 'The email is user@user.com, check it out':
            return resolve(
              JSON.parse(
                '[{"body":"user@user.com","start":13,"value":{"value":"user@user.com"},"end":26,"dim":"email","latent":false}]'
              )
            );
          case 'The phone number is +1 (650) 123-4567':
            return resolve(
              JSON.parse(
                '[{"body":"+1 (650) 123-4567","start":20,"value":{"value":"(+1) 6501234567"},"end":37,"dim":"phone-number","latent":false}]'
              )
            );
          case 'The url is https://subdomain.domain.com/something':
            return resolve(
              JSON.parse(
                '[{"body":"https://subdomain.domain.com/something","start":11,"value":{"domain":"subdomain.domain.com","value":"https://subdomain.domain.com/something"},"end":49,"dim":"url","latent":false}]'
              )
            );
          case 'The number is one hundred and twelve':
            return resolve(
              JSON.parse(
                '[{"body":"one hundred and twelve","start":14,"value":{"value":112,"type":"value"},"end":36,"dim":"number","latent":false}]'
              )
            );
          case 'The number is one hundred and twelve dot 5':
            return resolve(
              JSON.parse(
                '[{"body":"one hundred and twelve dot 5","start":14,"value":{"value":112.5,"type":"value"},"end":42,"dim":"number","latent":false}]'
              )
            );
          case 'There are 347kms':
            return resolve(
              JSON.parse(
                '[{"body":"347kms","start":10,"value":{"value":347,"type":"value","unit":"kilometre"},"end":16,"dim":"distance","latent":false}]'
              )
            );
          case 'Three cups of sugar':
            return resolve(
              JSON.parse(
                '[{"body":"Three cups of sugar","start":0,"value":{"value":3,"type":"value","product":"sugar","unit":"cup"},"end":19,"dim":"quantity","latent":false}]'
              )
            );
          case '80F':
            return resolve(
              JSON.parse(
                '[{"body":"80F","start":0,"value":{"value":80,"type":"value","unit":"fahrenheit"},"end":3,"dim":"temperature","latent":false}]'
              )
            );
          case '4 gallons':
            return resolve(
              JSON.parse(
                '[{"body":"4 gallons","start":0,"value":{"value":4,"type":"value","unit":"gallon"},"end":9,"dim":"volume","latent":false}]'
              )
            );
          case '42€':
            return resolve(
              JSON.parse(
                '[{"body":"42€","start":0,"value":{"value":42,"type":"value","unit":"EUR"},"end":3,"dim":"amount-of-money","latent":false}]'
              )
            );
          case '3 mins':
            return resolve(
              JSON.parse(
                '[{"body":"3 mins","start":0,"value":{"value":3,"type":"value","minute":3,"unit":"minute","normalized":{"value":180,"unit":"second"}},"end":6,"dim":"duration","latent":false}]'
              )
            );
          case '12/12/2019 at 9am':
            return resolve(
              JSON.parse(
                '[{"body":"12/12/2019 at 9am","start":0,"value":{"values":[{"value":"2019-12-12T09:00:00.000+00:00","grain":"hour","type":"value"}],"value":"2019-12-12T09:00:00.000+00:00","grain":"hour","type":"value"},"end":17,"dim":"time","latent":false}]'
              )
            );
          case 'raise exception':
            return reject(new Error('Exception!'));
          default:
            return resolve({});
        }
      }
      return resolve({});
    });
  };
  return manager;
}

describe('Duckling Integration', () => {
  describe('Constructor', () => {
    test('Should put the port if is https', () => {
      const ner = new NerDuckling({ ducklingUrl: 'https://something.com' });
      expect(ner.port).toEqual(443);
    });
    test('Should put the port if is http', () => {
      const ner = new NerDuckling({ ducklingUrl: 'http://something.com' });
      expect(ner.port).toEqual(80);
    });
    test('Should put the port if provided', () => {
      const ner = new NerDuckling({ ducklingUrl: 'http://something.com:8080' });
      expect(ner.port).toEqual('8080');
    });
    test('Can create without providing settings', () => {
      const ner = new NerDuckling();
      expect(ner.url.href).toEqual('http://localhost:8000/parse');
    });
  });

  describe('Get locale', () => {
    test('It should return the culture locale from a 2 char locale', () => {
      const ner = new NerDuckling({ ducklingUrl: 'https://something.com' });
      const expected = 'es_ES';
      const actual = ner.getLocale('es');
      expect(actual).toEqual(expected);
    });
    test('It should return the nb_NO if no locale is provided', () => {
      const ner = new NerDuckling({ ducklingUrl: 'https://something.com' });
      const expected = 'nb_NO';
      const actual = ner.getLocale('no');
      expect(actual).toEqual(expected);
    });
  });

  describe('English', () => {
    test('When there is an exception, return empty array', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'raise exception';
      const actual = await manager.process(locale, input);
      const expected = [];
      expect(actual.entities).toEqual(expected);
    });
    test('Duckling English Email', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'The email is user@user.com, check it out';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'email',
          start: 13,
          end: 25,
          len: 13,
          accuracy: 0.95,
          sourceText: 'user@user.com',
          utteranceText: 'user@user.com',
          resolution: {
            value: 'user@user.com',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Phone Number', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'The phone number is +1 (650) 123-4567';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'phonenumber',
          start: 20,
          end: 36,
          len: 17,
          accuracy: 0.95,
          sourceText: '+1 (650) 123-4567',
          utteranceText: '+1 (650) 123-4567',
          resolution: {
            value: '(+1) 6501234567',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English URL', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'The url is https://subdomain.domain.com/something';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'url',
          start: 11,
          end: 48,
          len: 38,
          accuracy: 0.95,
          sourceText: 'https://subdomain.domain.com/something',
          utteranceText: 'https://subdomain.domain.com/something',
          resolution: {
            value: 'https://subdomain.domain.com/something',
            domain: 'subdomain.domain.com',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Number', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'The number is one hundred and twelve';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'number',
          start: 14,
          end: 35,
          len: 22,
          accuracy: 0.95,
          sourceText: 'one hundred and twelve',
          utteranceText: 'one hundred and twelve',
          resolution: {
            strValue: '112',
            value: 112,
            subtype: 'integer',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Number Float', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'The number is one hundred and twelve dot 5';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'number',
          start: 14,
          end: 41,
          len: 28,
          accuracy: 0.95,
          sourceText: 'one hundred and twelve dot 5',
          utteranceText: 'one hundred and twelve dot 5',
          resolution: {
            strValue: '112.5',
            value: 112.5,
            subtype: 'float',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Distance', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'There are 347kms';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'dimension',
          start: 10,
          end: 15,
          len: 6,
          accuracy: 0.95,
          sourceText: '347kms',
          utteranceText: '347kms',
          resolution: {
            strValue: '347',
            value: 347,
            unit: 'kilometre',
            subtype: 'distance',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Quantity', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = 'Three cups of sugar';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'quantity',
          start: 0,
          end: 18,
          len: 19,
          accuracy: 0.95,
          sourceText: 'Three cups of sugar',
          utteranceText: 'Three cups of sugar',
          resolution: {
            strValue: '3',
            value: 3,
            unit: 'cup',
            product: 'sugar',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Temperature', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = '80F';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'temperature',
          start: 0,
          end: 2,
          len: 3,
          accuracy: 0.95,
          sourceText: '80F',
          utteranceText: '80F',
          resolution: {
            strValue: '80',
            value: 80,
            unit: 'fahrenheit',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Volume', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = '4 gallons';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'dimension',
          start: 0,
          end: 8,
          len: 9,
          accuracy: 0.95,
          sourceText: '4 gallons',
          utteranceText: '4 gallons',
          resolution: {
            strValue: '4',
            value: 4,
            unit: 'gallon',
            subtype: 'volume',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Currency', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = '42€';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'currency',
          start: 0,
          end: 2,
          len: 3,
          accuracy: 0.95,
          sourceText: '42€',
          utteranceText: '42€',
          resolution: {
            strValue: '42',
            value: 42,
            unit: 'EUR',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Duration', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = '3 mins';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'duration',
          start: 0,
          end: 5,
          len: 6,
          accuracy: 0.95,
          sourceText: '3 mins',
          utteranceText: '3 mins',
          resolution: {
            strValue: '180',
            value: 180,
            unit: 'second',
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });

    test('Duckling English Time', async () => {
      const locale = 'en';
      const manager = getManager(locale);
      const input = '12/12/2019 at 9am';
      const actual = await manager.process(locale, input);
      const expected = [
        {
          entity: 'date',
          start: 0,
          end: 16,
          len: 17,
          accuracy: 0.95,
          sourceText: '12/12/2019 at 9am',
          utteranceText: '12/12/2019 at 9am',
          resolution: {
            value: '2019-12-12T09:00:00.000+00:00',
            grain: 'hour',
            values: [
              {
                grain: 'hour',
                type: 'value',
                value: '2019-12-12T09:00:00.000+00:00',
              },
            ],
          },
        },
      ];
      expect(actual.entities).toEqual(expected);
    });
  });
});
