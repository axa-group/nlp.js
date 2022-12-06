# Slot filling

One great feature that NLP systems can have is slot filling. When you define an intent, you can define what entities are mandatory and how to ask the data if not provided, so the intent is not considered complete until all the entities are provided. Example: If you have a travel intent that needs the city of departure, city of arrival and date of travel, and all three are mandatory, you can have a conversation like that one:

```
user> I want to travel
bot> Where do you want to go?
user> London
bot> From where you are traveling?
user> Barcelona
bot> When do you want to travel?
user> tomorrow
bot> You want to travel from Barcelona to London tomorrow
```

To achieve slot filling, when an utterance is processed and are still slots not filled, the answer provided is replaced by the question of the first slot to fill in the provided language, and the result contains an object *slotFill* with the information needed to understand what is the intent being filled, the current entities filled, the language, and the current slot being filled.

You can specify the definition within the corpus file:

```json
{
    "name": "Slot Filling Corpus",
    "locale": "en-US",
    "entities": {
        "fromCity": {
            "trim": [
                {
                    "position": "betweenLast",
                    "leftWords": ["from"],
                    "rightWords": ["to"]
                },
                {
                    "position": "afterLast",
                    "words": ["from"]
                }
            ]
        },
        "toCity": {
            "trim": [
                {
                    "position": "betweenLast",
                    "leftWords": ["to"],
                    "rightWords": ["from"]
                },
                {
                    "position": "afterLast",
                    "words": ["to"]
                }
            ]
        }
    },
    "data": [
        {
            "intent": "travel",
            "utterances": [
                "I want to travel from @fromCity to @toCity @date",
                "I want to travel from @fromCity @date",
                "I want to travel to @toCity @date",
                "I want to travel from @fromCity",
                "I want to travel to @toCity"
            ],
            "answers": [
                "Ok, I book the flight for you from {{fromCity}} to {{toCity}} {{date}}"
            ],
            "slotFilling": {
                "fromCity": {
                    "mandatory": true,
                    "question": "From where you are traveling?"
                },
                "toCity": {
                    "mandatory": true,
                    "question": "Where do you want to go?"
                },
                "date": "When do you want to travel from {{fromCity}} to {{toCity}}?"
            }
        }
    ]
}
```

The slot filling details in the corpus file can be provided as object allowing to also set the mandatory flag (if not provided in object form then mandatory is set to false). If you just use a string, the mandatory flag is set to true.

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    "./corpus2.json"
                ]
            }
        },
        use: ['Basic', 'BuiltinMicrosoft', 'LangEn'],
    });

    // Register Builtins to parse dates automatically
    const builtin = dock.get('builtin-microsoft');
    const ner = dock.get('ner');
    ner.container.register('extract-builtin-??', builtin, true);

    const manager = dock.get('nlp');

    // Train the network
    await manager.train();

    const context = {};
    const result = await manager.process('en', 'I want to travel to Madrid tomorrow', context);
    console.log(JSON.stringify(result, null, 2));
    const result2 = await manager.process('en', 'From Berlin', context);
    console.log(JSON.stringify(result2, null, 2));

})();

// console:
// {
//   "locale": "en",
//   "utterance": "I want to travel to Madrid tomorrow",
//   "languageGuessed": false,
//   "localeIso2": "en",
//   "language": "English",
//   "nluAnswer": {
//     "classifications": [
//       {
//         "intent": "travel",
//         "score": 1
//       }
//     ]
//   },
//   "classifications": [
//     {
//       "intent": "travel",
//       "score": 1
//     }
//   ],
//   "intent": "travel",
//   "score": 1,
//   "domain": "default",
//   "sourceEntities": [
//     {
//       "start": 27,
//       "end": 34,
//       "resolution": {
//         "values": [
//           {
//             "timex": "2022-08-06",
//             "type": "date",
//             "value": "2022-08-06"
//           }
//         ]
//       },
//       "text": "tomorrow",
//       "typeName": "datetimeV2.date"
//     }
//   ],
//   "entities": [
//     {
//       "type": "trim",
//       "subtype": "afterLast",
//       "start": 20,
//       "end": 26,
//       "len": 6,
//       "accuracy": 0.99,
//       "sourceText": "Madrid",
//       "utteranceText": "Madrid",
//       "entity": "toCity"
//     },
//     {
//       "start": 27,
//       "end": 34,
//       "len": 8,
//       "accuracy": 0.95,
//       "sourceText": "tomorrow",
//       "utteranceText": "tomorrow",
//       "entity": "date",
//       "resolution": {
//         "type": "date",
//         "timex": "2022-08-06",
//         "strValue": "2022-08-06",
//         "date": "2022-08-06T00:00:00.000Z"
//       }
//     }
//   ],
//   "slotFill": {
//     "localeIso2": "en",
//     "intent": "travel",
//     "entities": [
//       {
//         "type": "trim",
//         "subtype": "afterLast",
//         "start": 20,
//         "end": 26,
//         "len": 6,
//         "accuracy": 0.99,
//         "sourceText": "Madrid",
//         "utteranceText": "Madrid",
//         "entity": "toCity"
//       },
//       {
//         "start": 27,
//         "end": 34,
//         "len": 8,
//         "accuracy": 0.95,
//         "sourceText": "tomorrow",
//         "utteranceText": "tomorrow",
//         "entity": "date",
//         "resolution": {
//           "type": "date",
//           "timex": "2022-08-06",
//           "strValue": "2022-08-06",
//           "date": "2022-08-06T00:00:00.000Z"
//         }
//       }
//     ],
//     "currentSlot": "fromCity"
//   },
//   "srcAnswer": "From where you are traveling?",
//   "answers": [
//     {
//       "answer": "Ok, I book the flight for you from {{fromCity}} to Madrid tomorrow"
//     }
//   ],
//   "answer": "From where you are traveling?",
//   "actions": [],
//   "sentiment": {
//     "score": 1.25,
//     "numWords": 7,
//     "numHits": 4,
//     "average": 0.17857142857142858,
//     "type": "senticon",
//     "locale": "en",
//     "vote": "positive"
//   }
// }
//
//
// {
//   "locale": "en",
//   "utterance": "From Berlin",
//   "languageGuessed": false,
//   "localeIso2": "en",
//   "language": "English",
//   "nluAnswer": {
//     "classifications": [
//       {
//         "intent": "travel",
//         "score": 1
//       }
//     ]
//   },
//   "classifications": [
//     {
//       "intent": "travel",
//       "score": 1
//     }
//   ],
//   "intent": "travel",
//   "score": 1,
//   "domain": "default",
//   "sourceEntities": [],
//   "entities": [
//     {
//       "type": "trim",
//       "subtype": "afterLast",
//       "start": 20,
//       "end": 26,
//       "len": 6,
//       "accuracy": 0.99,
//       "sourceText": "Madrid",
//       "utteranceText": "Madrid",
//       "entity": "toCity"
//     },
//     {
//       "start": 27,
//       "end": 34,
//       "len": 8,
//       "accuracy": 0.95,
//       "sourceText": "tomorrow",
//       "utteranceText": "tomorrow",
//       "entity": "date",
//       "resolution": {
//         "type": "date",
//         "timex": "2022-08-06",
//         "strValue": "2022-08-06",
//         "date": "2022-08-06T00:00:00.000Z"
//       }
//     },
//     {
//       "type": "trim",
//       "subtype": "afterLast",
//       "start": 5,
//       "end": 10,
//       "len": 6,
//       "accuracy": 0.99,
//       "sourceText": "Berlin",
//       "utteranceText": "Berlin",
//       "entity": "fromCity"
//     }
//   ],
//   "answer": "Ok, I book the flight for you from Berlin to Madrid tomorrow",
//   "answers": [
//     {
//       "answer": "Ok, I book the flight for you from Berlin to Madrid tomorrow"
//     }
//   ],
//   "actions": [],
//   "sentiment": {
//     "score": 0,
//     "numWords": 2,
//     "numHits": 0,
//     "average": 0,
//     "type": "senticon",
//     "locale": "en",
//     "vote": "neutral"
//   }
// }
```

Alternatively to providing the configuration in a corpus JSON you can define all this on code level as on v3 too like this:

```javascript
  manager.addNerBetweenLastCondition('en', 'fromCity', 'from', 'to');
  manager.addNerAfterLastCondition('en', 'fromCity', 'from');
  manager.addNerBetweenLastCondition('en', 'toCity', 'to', 'from');
  manager.addNerAfterLastCondition('en', 'toCity', 'to');
 
  manager.slotManager.addSlot('travel', 'fromCity', true, { en: 'From where you are traveling?' });
  manager.slotManager.addSlot('travel', 'toCity', true, { en: 'Where do you want to go?' });
  manager.slotManager.addSlot('travel', 'date', true, { en: 'When do you want to travel from {{fromCity}} to {{toCity}}?' });
  
  manager.addDocument('en', 'I want to travel from @fromCity to @toCity @date', 'travel');
  manager.addDocument('en', 'I want to travel from @fromCity @date', 'travel');
  // and the other possible documents too
```

## Entities with the same name

Utterances with more than one entity with the same name are supported by providing "numbered entities".

The "numbered entity" format must be in the form `${entityName}_${integer}`. E.g. "hero\_0", "food\_1", etc.

So with a corpus of

```json
{
    "name": "Slot Filling Corpus",
    "locale": "en-US",
    "entities": {
        "hero": {
            "options": {
                "spiderman": ["Spider-man", "spiderman"],
                "iron man": ["iron man", "ironman", "iron-man"],
                "thor": ["thor"]
            }
        },
        "food": {
            "options": {
                "burguer": ["Burguer"],
                "pizza": ["Pizza"],
                "pasta": ["Spaghetti","Pasta"]
            }
        }
    },
    "data": [
        {
            "intent": "saw_heroes_eating",
            "utterances": [
                "I saw @hero_0 together with @hero_1, they where eating @food"
            ],
            "answers": [
                "Wow! You saw {{ hero_0 }} and {{ hero_1 }} eating {{ food }}!"
            ],
            "slotFilling": {
                "hero_0": {
                    "mandatory": true,
                    "question": "Who did you see?"
                },
                "hero_1": {
                    "mandatory": true,
                    "question": "With whom did you see {{ hero_0 }}?"
                },
                "food": "What where they eating?"
            }
        }
    ]
}
```

and code

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    "./corpus2.json"
                ]
            }
        },
        use: ['Basic', 'LangEn'],
    });

    const manager = dock.get('nlp');

    // Train the network
    await manager.train();

    const result1 = await manager.process('I saw spiderman together with ironman, they where eating spaghetti');
    console.log(result1.answer);

    const result2 = await manager.process('I saw iron-man and the other hero, they where eating a burger');
    console.log(result2.answer);

    const result3 = await manager.process('I saw him together with thor, they where eating pizza');
    console.log(result3.answer);

    const result4 = await manager.process('I saw iron-man together with thor, they where eating');
    console.log(result4.answer);

    const result5 = await manager.process('I saw them together, they where eating');
    console.log(result5.answer);

})();

  // Console output:
  // Wow! You saw spiderman and ironman eating Spaghetti!
  // With whom did you see iron-man?
  // With whom did you see thor?
  // What where they eating?
  // Who did you see?
```

When a repeated entity is found the entities property will have an other structure. The object then contains an "isList" property with the value true and the found entities are n an array with the key name "items". You can use this also in answer options to answer more specific:

![structure](https://user-images.githubusercontent.com/15154218/105776091-3d9f0000-5f68-11eb-85d3-0cf9c879b131.png)

```json
{
  "name": "Corpus with entities",
  "locale": "en-US",
  "contextData": "./heros.json",
  "data": [
    {
      "intent": "hero.realname",
      "utterances": [
        "what is the real name of @hero"
      ],
      "answers": [
        { "answer": "The real name of {{ hero }} is {{ _data[entities.hero.option].realName }}", "opts": "entities.hero !== undefined && !entities.hero.isList" },
        { "answer": "Well, perhaps you can tell me only one hero at a time", "opts": "entities.hero !== undefined && entities.hero.isList" },
        { "answer": "You have to specify a hero", "opts": "entities.hero === undefined" }
      ]
    },
    {
      "intent": "hero.city",
      "utterances": [
        "where @hero lives?",
        "what's the city of @hero?"
      ],
      "answers": [
        { "answer": "{{ hero }} lives at {{ _data[entities.hero.option].city }}", "opts": "entities.hero !== undefined && !entities.hero.isList" },
        { "answer": "Well, perhaps you can tell me only one hero at a time", "opts": "entities.hero !== undefined && entities.hero.isList" },
        { "answer": "You have to specify a hero", "opts": "entities.hero === undefined" }
      ]
    }
  ],
  "entities": {
    "hero": {
      "options": {
        "spiderman": ["spiderman", "spider-man"],
        "ironman": ["ironman", "iron-man"],
        "thor": ["thor"]
      }
    },
    "email": "/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi"
  }
}
```
