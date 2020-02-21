# Integration with Duckling

Instead of using the existing builtin entity extraction, you can integrate with duckling.

* [Language support](#language-support)
* [How to integrate with duckling](#how-to-integrate-with-duckling)
* [Email Extraction](#email-extraction)
* [Phone Number Extraction](#phone-number-extraction)
* [URL Extraction](#url-extraction)
* [Number Extraction](#number-extraction)
* [Ordinal Extraction](#ordinal-extraction)
* [Dimension Extraction](#dimension-extraction)
* [Quantity Extraction](#quantity-extraction)
* [Amount of Money Extraction](#amount-of-money-extraction)
* [Date Extraction](#date-extraction)

## Language support

Those are the languages supported using Duckling or not using it:

| Language      | Locale | Without Duckling | With Duckling |
| :------------ | :----: | :--------------: | :-----------: |
| Arabic        |   ar   |                  |       X       |
| Armenian      |   hy   |                  |               |
| Basque        |   eu   |                  |               |
| Bengali       |   bn   |                  |       X       |
| Catala        |   ca   |                  |               |
| Chinese       |   zh   |         X        |       X       |
| Czech         |   cs   |                  |       X       |
| Danish        |   da   |                  |       X       |
| Dutch         |   nl   |                  |       X       |
| English       |   en   |         X        |       X       |
| Farsi         |   fa   |                  |               |
| Finnish       |   fi   |                  |       X       |
| French        |   fr   |         X        |       X       |
| Galician      |   gl   |                  |               |
| German        |   de   |                  |       X       |
| Greek         |   el   |                  |       X       |
| Hindi         |   hi   |                  |       X       |
| Hungarian     |   hu   |                  |       X       |
| Indonesian    |   id   |                  |       X       |
| Italian       |   it   |                  |       X       |
| Irish         |   ga   |                  |       X       |
| Japanese      |   ja   |         X        |       X       |
| Korean        |   ko   |                  |       X       |
| Lithuanian    |   lt   |                  |               |
| Malay         |   ms   |                  |       X       |
| Nepali        |   ne   |                  |       X       |
| Norwegian     |   no   |                  |       X       |
| Polish        |   pl   |                  |       X       |
| Portuguese    |   pt   |         X        |       X       |
| Romanian      |   ro   |                  |       X       |
| Russian       |   ru   |                  |       X       |
| Serbian       |   sr   |                  |               |
| Spanish       |   es   |         X        |       X       |
| Swedish       |   sv   |                  |       X       |
| Tamil         |   ta   |                  |       X       |
| Thai          |   th   |                  |       *1      |
| Tagalog       |   tl   |                  |               |
| Turkish       |   tr   |                  |       X       |
| Ukrainian     |   uk   |                  |       X       |

*1: Thai is not supported by duckling, but there exists a repo in github with an implementation of the thai rules of duckling: https://github.com/pantuwong/thai_duckling


## How to integrate with duckling

For this you'll need to have an instance of duckling up and running, and the integration is through the REST API.
You can go to the official Duckling page for instructions on how to run it: https://github.com/facebook/duckling

You can use duckling by setting the property ducklingUrl parameter of the NER settings:

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ ner: { ducklingUrl: 'https://ducklinghost/parse' } });
  manager.addLanguage(['en']);
  const result = await manager.process(
    'twenty five euros'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

Also you can set the environment variable DUCKLING_URL with the URL and set the property useDuckling of the NER to true:

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ ner: { useDuckling: true } });
  manager.addLanguage(['en']);
  const result = await manager.process(
    'twenty five euros'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will include a property "sourceEntities" with the original response from duckling, and a property "entities" with the processed entities.

## Email Extraction

It can identify and extract valid emails accounts, this works for any language.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'My email is something@somehost.com please write me'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "My email is something@somehost.com please write me",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 12,
      "end": 33,
      "len": 22,
      "accuracy": 0.95,
      "sourceText": "something@somehost.com",
      "utteranceText": "something@somehost.com",
      "entity": "email",
      "resolution": {
        "value": "something@somehost.com"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "something@somehost.com",
      "start": 12,
      "value": {
        "value": "something@somehost.com"
      },
      "end": 34,
      "dim": "email",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0.75,
    "comparative": 0.08333333333333333,
    "vote": "positive",
    "numWords": 9,
    "numHits": 2,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Phone Number Extraction

It can identify and extract phone numbers from the utterances, this works for any language.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'So here is my number +1 541-754-3010 callme maybe'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "So here is my number +1 541-754-3010 callme maybe",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 21,
      "end": 35,
      "len": 15,
      "accuracy": 0.95,
      "sourceText": "+1 541-754-3010",
      "utteranceText": "+1 541-754-3010",
      "entity": "phonenumber",
      "resolution": {
        "value": "(+1) 5417543010"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "+1 541-754-3010",
      "start": 21,
      "value": {
        "value": "(+1) 5417543010"
      },
      "end": 36,
      "dim": "phone-number",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0.125,
    "comparative": 0.011363636363636364,
    "vote": "positive",
    "numWords": 11,
    "numHits": 3,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## URL Extraction

It can identify and extract URLs from the utterances, this works for any language.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'The url is https://something.com'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "The url is https://something.com",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 11,
      "end": 31,
      "len": 21,
      "accuracy": 0.95,
      "sourceText": "https://something.com",
      "utteranceText": "https://something.com",
      "entity": "url",
      "resolution": {
        "value": "https://something.com",
        "domain": "something.com"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "https://something.com",
      "start": 11,
      "value": {
        "domain": "something.com",
        "value": "https://something.com"
      },
      "end": 32,
      "dim": "url",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 6,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Number Extraction

It can identify and extract numbers. This works for any language, and the numbers can be integer or floats.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'This is 12'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "This is 12",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 8,
      "end": 9,
      "len": 2,
      "accuracy": 0.95,
      "sourceText": "12",
      "utteranceText": "12",
      "entity": "number",
      "resolution": {
        "strValue": "12",
        "value": 12,
        "subtype": "integer"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "12",
      "start": 8,
      "value": {
        "value": 12,
        "type": "value"
      },
      "end": 10,
      "dim": "number",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 3,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

The numbers can be also be text written, but this only works for the supported languages.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'This is twelve'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "This is twelve",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 8,
      "end": 13,
      "len": 6,
      "accuracy": 0.95,
      "sourceText": "twelve",
      "utteranceText": "twelve",
      "entity": "number",
      "resolution": {
        "strValue": "12",
        "value": 12,
        "subtype": "integer"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "twelve",
      "start": 8,
      "value": {
        "value": 12,
        "type": "value"
      },
      "end": 14,
      "dim": "number",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 3,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Ordinal Extraction

It can identify and extract ordinal numbers. This works only for the supported languages.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'He was 2nd'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "He was 2nd",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 7,
      "end": 9,
      "len": 3,
      "accuracy": 0.95,
      "sourceText": "2nd",
      "utteranceText": "2nd",
      "entity": "ordinal",
      "resolution": {
        "strValue": "2",
        "value": 2,
        "subtype": "integer"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "2nd",
      "start": 7,
      "value": {
        "value": 2,
        "type": "value"
      },
      "end": 10,
      "dim": "ordinal",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 3,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Dimension Extraction

It can identify and extract different dimensions, like distance or temperature.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    '120km'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "120km",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 0,
      "end": 4,
      "len": 5,
      "accuracy": 0.95,
      "sourceText": "120km",
      "utteranceText": "120km",
      "entity": "dimension",
      "resolution": {
        "strValue": "120",
        "value": 120,
        "unit": "kilometre",
        "subtype": "distance"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "120km",
      "start": 0,
      "value": {
        "value": 120,
        "type": "value",
        "unit": "kilometre"
      },
      "end": 5,
      "dim": "distance",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 1,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Quantity Extraction

It can identify and extract quantities of producs, example "three cups of sugar". It identifies the amount (3), the unit (cup) and the product (sugar).

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'three cups of sugar'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "three cups of sugar",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 0,
      "end": 18,
      "len": 19,
      "accuracy": 0.95,
      "sourceText": "three cups of sugar",
      "utteranceText": "three cups of sugar",
      "entity": "quantity",
      "resolution": {
        "strValue": "3",
        "value": 3,
        "unit": "cup",
        "product": "sugar"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "three cups of sugar",
      "start": 0,
      "value": {
        "value": 3,
        "type": "value",
        "product": "sugar",
        "unit": "cup"
      },
      "end": 19,
      "dim": "quantity",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0.25,
    "comparative": 0.0625,
    "vote": "positive",
    "numWords": 4,
    "numHits": 1,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Amount of Money Extraction

It can extract amounts of money with the currenty.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    'It was 42.5€'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "It was 42.5€",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 7,
      "end": 11,
      "len": 5,
      "accuracy": 0.95,
      "sourceText": "42.5€",
      "utteranceText": "42.5€",
      "entity": "currency",
      "resolution": {
        "strValue": "42.5",
        "value": 42.5,
        "unit": "EUR"
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "42.5€",
      "start": 7,
      "value": {
        "value": 42.5,
        "type": "value",
        "unit": "EUR"
      },
      "end": 12,
      "dim": "amount-of-money",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 4,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```

## Date Extraction

It can identify and extract dates and times.

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ languages: ['en'], ner: { useDuckling: true } });
  const result = await manager.process(
    '12/12/2019 at 9am'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

The answer will be:

```json
{
  "utterance": "12/12/2019 at 9am",
  "locale": "en",
  "languageGuessed": false,
  "localeIso2": "en",
  "language": "English",
  "classifications": [
    {
      "label": "None",
      "value": 1
    }
  ],
  "intent": "None",
  "score": 1,
  "entities": [
    {
      "start": 0,
      "end": 16,
      "len": 17,
      "accuracy": 0.95,
      "sourceText": "12/12/2019 at 9am",
      "utteranceText": "12/12/2019 at 9am",
      "entity": "date",
      "resolution": {
        "value": "2019-12-12T09:00:00.000+00:00",
        "grain": "hour",
        "values": [
          {
            "value": "2019-12-12T09:00:00.000+00:00",
            "grain": "hour",
            "type": "value"
          }
        ]
      }
    }
  ],
  "sourceEntities": [
    {
      "body": "12/12/2019 at 9am",
      "start": 0,
      "value": {
        "values": [
          {
            "value": "2019-12-12T09:00:00.000+00:00",
            "grain": "hour",
            "type": "value"
          }
        ],
        "value": "2019-12-12T09:00:00.000+00:00",
        "grain": "hour",
        "type": "value"
      },
      "end": 17,
      "dim": "time",
      "latent": false
    }
  ],
  "sentiment": {
    "score": 0,
    "comparative": 0,
    "vote": "neutral",
    "numWords": 5,
    "numHits": 0,
    "type": "senticon",
    "language": "en"
  },
  "actions": []
}
```