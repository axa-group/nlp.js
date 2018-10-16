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
 
  manager.slotManager.addSlot('travel', 'fromCity', true, { en: 'Where do you want to go?' });
  manager.slotManager.addSlot('travel', 'toCity', true, { en: 'From where you are traveling?' });
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


