const { Ner } = require('../../packages/ner');
const { BuiltinMicrosoft } = require('../../packages/builtin-microsoft');

(async () => {
  const builtin = new BuiltinMicrosoft();
  const ner = new Ner();

  ner.container.register('extract-builtin-??', builtin, true);
  const nerResultEN = await ner.process({
    locale: 'en',
    text: `I'll come back tomorrow at 3pm`,
  });
  console.log('nerResultEN ', JSON.stringify(nerResultEN, null, 2));
  /*
  nerResultEN: {
    "locale": "en",
    "text": "I'll come back tomorrow at 3pm",
    "sourceEntities": [
      {
        "start": 27,
        "end": 29,
        "resolution": {
          "value": "3",
          "unit": "Picometer",
          "srcUnit": "Picometer"
        },
        "text": "3pm",
        "typeName": "dimension"
      },
      {
        "start": 15,
        "end": 29,
        "resolution": {
          "values": [
            {
              "timex": "2022-01-31T15",
              "type": "datetime",
              "value": "2022-01-31 15:00:00"
            }
          ]
        },
        "text": "tomorrow at 3pm",
        "typeName": "datetimeV2.datetime"
      }
    ],
    "entities": [
      {
        "start": 27,
        "end": 29,
        "len": 3,
        "accuracy": 0.95,
        "sourceText": "3pm",
        "utteranceText": "3pm",
        "entity": "dimension",
        "resolution": {
          "strValue": "3",
          "value": 3,
          "unit": "Picometer",
          "localeUnit": "Picometer"
        }
      },
      {
        "start": 15,
        "end": 29,
        "len": 15,
        "accuracy": 0.95,
        "sourceText": "tomorrow at 3pm",
        "utteranceText": "tomorrow at 3pm",
        "entity": "datetime",
        "resolution": {
          "values": [
            {
              "timex": "2022-01-31T15",
              "type": "datetime",
              "value": "2022-01-31 15:00:00"
            }
          ]
        }
      }
    ]
  }
  */
  const nerResultES = await ner.process({
    locale: 'es',
    text: 'volveré mañana a las 15h',
  });
  console.log('nerResultES ', JSON.stringify(nerResultES, null, 2));
  /*
  nerResultES: {
    "locale": "es",
    "text": "volveré mañana a las 15h",
    "sourceEntities": [
      {
        "start": 8,
        "end": 23,
        "resolution": {
          "values": [
            {
              "timex": "2022-01-31T15",
              "type": "datetime",
              "value": "2022-01-31 15:00:00"
            }
          ]
        },
        "text": "mañana a las 15h",
        "typeName": "datetimeV2.datetime"
      }
    ],
    "entities": [
      {
        "start": 8,
        "end": 23,
        "len": 16,
        "accuracy": 0.95,
        "sourceText": "mañana a las 15h",
        "utteranceText": "mañana a las 15h",
        "entity": "datetime",
        "resolution": {
          "values": [
            {
              "timex": "2022-01-31T15",
              "type": "datetime",
              "value": "2022-01-31 15:00:00"
            }
          ]
        }
      }
    ]
  }
  */
})();
