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

```javascript
const { NlpManager } = require('./lib');

async function main() {
  const manager = new NlpManager({ languages: ['en'] });
  const fromEntity = manager.addTrimEntity('fromCity');
  fromEntity.addBetweenCondition('en', 'from', 'to');
  fromEntity.addAfterLastCondition('en', 'from');
  const toEntity = manager.addTrimEntity('toCity');
  toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
  toEntity.addAfterLastCondition('en', 'to');
 
  manager.slotManager.addSlot('travel', 'fromCity', true, { en: 'From where you are traveling?' });
  manager.slotManager.addSlot('travel', 'toCity', true, { en: 'Where do you want to go?' });
  manager.slotManager.addSlot('travel', 'date', true, { en: 'When do you want to travel?' });


  manager.addDocument('en', 'I want to travel from %fromCity% to %toCity% %date%', 'travel');
  await manager.train();
  const result = await manager.process('en', 'I want to travel to Madrid tomorrow', {});
  console.log(JSON.stringify(result, null, 2));
}

main();

// console:
// {
//   "locale": "en",
//   "localeIso2": "en",
//   "language": "English",
//   "utterance": "I want to travel to Madrid tomorrow",
//   "classification": [
//     {
//       "label": "travel",
//       "value": 0.999876611513072
//     }
//   ],
//   "intent": "travel",
//   "domain": "default",
//   "score": 0.999876611513072,
//   "entities": [
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
//         "timex": "2018-09-19",
//         "strValue": "2018-09-19",
//         "date": "2018-09-19T00:00:00.000Z"
//       }
//     },
//     {
//       "type": "afterLast",
//       "start": 20,
//       "end": 25,
//       "len": 6,
//       "accuracy": 0.99,
//       "sourceText": "Madrid",
//       "utteranceText": "Madrid",
//       "entity": "toCity"
//     }
//   ],
//   "sentiment": {
//     "score": -0.275,
//     "comparative": -0.03928571428571429,
//     "vote": "negative",
//     "numWords": 7,
//     "numHits": 1,
//     "type": "senticon",
//     "language": "en"
//   },
//   "slotFill": {
//     "localeIso2": "en",
//     "intent": "travel",
//     "entities": [
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
//           "timex": "2018-09-19",
//           "strValue": "2018-09-19",
//           "date": "2018-09-19T00:00:00.000Z"
//         }
//       },
//       {
//         "type": "afterLast",
//         "start": 20,
//         "end": 25,
//         "len": 6,
//         "accuracy": 0.99,
//         "sourceText": "Madrid",
//         "utteranceText": "Madrid",
//         "entity": "toCity"
//       }
//     ],
//     "currentSlot": "fromCity"
//   },
//   "srcAnswer": "Where do you want to go?",
//   "answer": "Where do you want to go?"
// }
```

## Entities with the same name

Utterances with more than one entity with the same name are supported by providing "numbered entities".

The "numbered entity" format must be in the form `${entityName}_${integer}`. E.g. "hero\_1", "food\_2", etc.

```javascript
const { NlpManager } = require('node-nlp');

async function main() {
  const manager = new NlpManager({ languages: ['en'] });

  manager.addDocument(
    'en',
    'I saw %hero_1% together with %hero_2%, they where eating %food%',
    'saw_heroes_eating'
  );

  await manager.train();

  manager.addNamedEntityText('hero', 'spiderman', ['en'], ['Spider-man']);
  manager.addNamedEntityText('hero', 'iron man', ['en'], ['iron man']);
  manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
  manager.addNamedEntityText('food', 'burguer', ['en'], ['Burguer']);
  manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
  manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);

  manager.slotManager.addSlot('saw_heroes_eating', 'hero_1', true, { en: 'Who did you see?' });
  manager.slotManager.addSlot('saw_heroes_eating', 'hero_2', true, { en: 'With whom did you see {{ hero_1 }}?' });
  manager.slotManager.addSlot('saw_heroes_eating', 'food', true, { en: 'What where they eating?' });

  manager.addAnswer('en', 'saw_heroes_eating', 'Wow! You saw {{ hero_1 }} and {{ hero_2 }} eating {{ food }}!');

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

  // Console output:
  // Wow! You saw spiderman and iron man eating pasta!
  // With whom did you see iron man?
  // With whom did you see thor?
  // What where they eating?
  // Who did you see?
}

main();
```

