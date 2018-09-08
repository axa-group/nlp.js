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
const entities = manager.findEntities(
  'I saw spederman eating speghetti in the city',
  'en',
);
// value is [ { start: 6, end: 15, levenshtein: 1, accuracy: 0.8888888888888888, option: 'spiderman',
//  sourceText: 'Spiderman', entity: 'hero', utteranceText: 'spederman' },
//  { start: 23, end: 32, levenshtein: 1, accuracy: 0.8888888888888888, option: 'pasta',
//  sourceText: 'spaghetti', entity: 'food', utteranceText: 'speghetti' } ]
```

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
manager.addNamedEntity('email', /\b(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})\b/gi);
const entities = manager.findEntities(
  'I saw spiderman eating speghetti in the city and his mail is spiderman@gmial.com',
  'en',
);
console.log(entities);
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
