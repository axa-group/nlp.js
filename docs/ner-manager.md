# NER Manager

The Named Entity Recognition manager is able to store an structure of entities and options of the entity for each language.
Then, given an utterance and the language, is able to search the options of the entity inside the utterance, and return a list
of the bests substrings. This is done using a threshold for the accuracy, by default the accuracy is 0.5 but you can provide it in the options when creating the instance.

```javascript
const { NerManager } = require('node-nlp');

const manager = new NerManager({ threshold: 0.8 });
manager.addNamedEntityText(
  'hero',
  'spiderman',
  ['en'],
  ['Spiderman', 'Spider-man'],
);
manager.addNamedEntityText(
  'hero',
  'iron man',
  ['en'],
  ['iron man', 'iron-man'],
);
manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
manager.addNamedEntityText(
  'food',
  'burguer',
  ['en'],
  ['Burguer', 'Hamburguer'],
);
manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
manager.findEntities(
  'I saw spederman eating speghetti in the city',
  'en',
).then(entities => {
  // ...
})
// value is [ { start: 6, end: 15, levenshtein: 1, accuracy: 0.8888888888888888, option: 'spiderman',
//  sourceText: 'Spiderman', entity: 'hero', utteranceText: 'spederman' },
//  { start: 23, end: 32, levenshtein: 1, accuracy: 0.8888888888888888, option: 'pasta',
//  sourceText: 'spaghetti', entity: 'food', utteranceText: 'speghetti' } ]
```

## Regular Expression Entities

It also support Regular Expression entities

```javascript
const { NerManager } = require('node-nlp');

const manager = new NerManager({ threshold: 0.8 });
manager.addNamedEntityText(
  'hero',
  'spiderman',
  ['en'],
  ['Spiderman', 'Spider-man'],
);
manager.addNamedEntityText(
  'hero',
  'iron man',
  ['en'],
  ['iron man', 'iron-man'],
);
manager.addNamedEntityText('hero', 'thor', ['en'], ['Thor']);
manager.addNamedEntityText(
  'food',
  'burguer',
  ['en'],
  ['Burguer', 'Hamburguer'],
);
manager.addNamedEntityText('food', 'pizza', ['en'], ['pizza']);
manager.addNamedEntityText('food', 'pasta', ['en'], ['Pasta', 'spaghetti']);
const entity = manager.addNamedEntity('email', 'regex');
entity.addRegex('en', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
manager.findEntities(
  'I saw spiderman eating speghetti in the city and his mail is spiderman@gmial.com',
  'en',
).then(entities => console.log(entities));
// [ { start: 6,
//     end: 15,
//     levenshtein: 0,
//     accuracy: 1,
//     option: 'spiderman',
//     sourceText: 'Spiderman',
//     entity: 'hero',
//     utteranceText: 'spiderman' },
//   { start: 23,
//     end: 32,
//     levenshtein: 1,
//     accuracy: 0.8888888888888888,
//     option: 'pasta',
//     sourceText: 'spaghetti',
//     entity: 'food',
//     utteranceText: 'speghetti' },
//   { start: 61,
//     end: 80,
//     accuracy: 1,
//     sourceText: 'spiderman@gmial.com',
//     utteranceText: 'spiderman@gmial.com',
//     entity: 'email' } ]
```

## Trim Entities

It supports entities that works trimming text conditions, like text between two words.
It supports 7 different conditions:
- Between
- After
- After First
- After Last
- Before
- Before First
- Before Last

```javascript
const { NerManager } = require('node-nlp');

const manager = new NerManager({ threshold: 0.8 });
const fromEntity = manager.addNamedEntity('fromEntity', 'trim');
fromEntity.addBetweenCondition('en', 'from', 'to');
fromEntity.addAfterLastCondition('en', 'to');
const toEntity = manager.addNamedEntity('toEntity', 'trim');
fromEntity.addBetweenCondition('en', 'to', 'from');
fromEntity.addAfterLastCondition('en', 'from');
manager.findEntities(
  'I want to travel from Barcelona to Madrid',
  'en',
).then(entities => console.log(entities));
// [ { type: 'between',
//     start: 22,
//     end: 31,
//     accuracy: 1,
//     sourceText: 'Barcelona',
//     utteranceText: 'Barcelona',
//     entity: 'fromEntity' },
//   { type: 'afterLast',
//     start: 35,
//     end: 41,
//     accuracy: 0.99,
//     sourceText: 'Madrid',
//     utteranceText: 'Madrid',
//     entity: 'fromEntity' },
//   { type: 'between',
//     start: 10,
//     end: 16,
//     accuracy: 1,
//     sourceText: 'travel',
//     utteranceText: 'travel',
//     entity: 'fromEntity' } ]
```