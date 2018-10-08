# NLP Manager

The NLP Manager is able to manage several languages. For each one, he manages the Named Entities, and is able to train the NLP classifier. Once we have it trained, we can ask the NLP manager to process one utterance. We can even don't tell the language and the NLP Manger will guess it from the languages that it knows.
When the utterance is processed, the NLP manager will:

- Identify the language
- Classify the utterance using ML, and returns the classifications and the best intent and score
- Gets the entities from the utterance. If the NLP was trained using entities in the format %entity%, then the search for entities will be limited to those that are present in this intent; otherwise, all the possible entities will be checked.
- Gets the sentiment analysis.

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
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
manager.addDocument('en', 'I saw %hero% eating %food%', 'sawhero');
manager.addDocument(
  'en',
  'I have seen %hero%, he was eating %food%',
  'sawhero',
);
manager.addDocument('en', 'I want to eat %food%', 'wanteat');
await manager.train();
manager
  .process('I saw spiderman eating spaghetti today in the city!')
  .then(result => console.log(result));
// { locale: 'en',
//   localeIso2: 'en',
//   language: 'English',
//   utterance: 'I saw spiderman eating spaghetti today in the city!',
//   classification:
//    [ { label: 'sawhero', value: 0.9920519933583061 },
//      { label: 'wanteat', value: 0.00794800664169383 } ],
//   intent: 'sawhero',
//   score: 0.9920519933583061,
//   entities:
//    [ { start: 6,
//        end: 15,
//        levenshtein: 0,
//        accuracy: 1,
//        option: 'spiderman',
//        sourceText: 'Spiderman',
//        entity: 'hero',
//        utteranceText: 'spiderman' },
//      { start: 23,
//        end: 32,
//        levenshtein: 0,
//        accuracy: 1,
//        option: 'pasta',
//        sourceText: 'spaghetti',
//        entity: 'food',
//        utteranceText: 'spaghetti' } ],
//   sentiment:
//    { score: 0.708,
//      comparative: 0.07866666666666666,
//      vote: 'positive',
//      numWords: 9,
//      numHits: 2,
//      type: 'senticon',
//      language: 'en' } }
```


## Load/Save

Also, you can save and load the NLP Manager to be reused without having to train it, because the thetas of the ML are also stored.

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
await manager.train();
manager.save(filename);
```

```javascript
const { NlpManager } = require('node-nlp');

manager = new NlpManager();
manager.load(filename);
```

If no filename is provided by default it is './model.nlp'.

## Import/Export

Importing works similar to loading, but instead of a filename takes a JSON string as an argument.

```javascript
const fs = require('fs');
const { NlpManager } = require('node-nlp');

const data = fs.readFileSync('model.nlp', 'utf8');
const manager = new NlpManager();
manager.import(data);
// ...
```

You could use the export function to return this JSON string. The ``export`` function also takes an optional boolean argument that will tell it to minimize the JSON string.

```javascript
const { NlpManager } = require('node-nlp');

const minified = true;
const manager = new NlpManager();
// ...
await manager.train();
const data = manager.export(minified);
```

## Context

You can also provide a context to ```NlpManger.process``` so the NLG changes its behaviour based on the context.

```
const { NlpManager, ConversationContext } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
const context = new ConversationContext();

manager.addDocument('en', 'Hello my name is %name%', 'greeting.hello');
manager.addDocument('en', 'I have to go', 'greeting.bye');
manager.addAnswer('en', 'greeting.hello', 'Hey there!');
manager.addAnswer('en', 'greeting.bye', 'Till next time, {{name}}!');

manager.train()
  .then(result => manager.process('en', 'Hello my name is John', context))
  .then(result => manager.process('en', 'I have to go', context))
  .then(result => console.log(result.answer));
```

This will show this result in console:

```
See you soon, John!
```

## Transformers

You could pass transformer function to NLPManager constructor, which might be used to modify process output format.

```javascript
const manager = new NlpManager({
  transformer: originalProcessOutput => {
    // put some modifications logic (it might be async)
    // and return modified value
    return Promise.resolve({ modified: 'VALUE' });
  },
});
```
