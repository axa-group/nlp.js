# NLP Manager

The `NlpManager` is able to manage several languages. It manages the named entities, and trains the NLP classifier for each language. Once trained, `NlpManager` is ready to process utterances. It will try to guess the language, if one isn't provided when processing an utterance. During processing, the `NlpManager` will:

- Identify the language
- Classify the utterance, using Machine Learning (ML)
- Find named, and/or default entities in the utterance
- Limit entities to those described with variables in the highest scoring intent, _if present_ (variable syntax for intents uses wildcard operators `%entity_name%`)
- Replace variables in the best answer with matched entities (variable syntax for answers uses handlebars: `{{entity_name}}`)
- Analyze sentiment
- Return the intent, entities, classifications, associated score(s), answer, and sentiment

> Note that periods are not supported in the entity names when using them as variables. Don't use `{{entity.name}}`. Use `{{entity_name}}` instead. The intent variable names must match the answer variable names.

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

## Saving and Loading Models
`NlpManager` has support for saving, and loading the models of trained managers. These models include the thetas that are produced by the ML algorithms, so they can be loaded into instances of `NlpManager` without having to train them again.

In addition to reducing startup time, this can be useful when a system doesn't have write permissions to local disk, or in cases where we benefit from deterministic results, such as A/B testing (or testing in general).

There are two approaches to saving and loading models: [using files](#saveload-using-files), and [using JSON](#importexport-using-json).

### Save/Load Using Files

`NlpManager.save` writes a model file to disk, and `NlpManager.load` reads a model file from disk.

By default, models are saved into `modelFileName` after training:

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], modelFileName: filename });
await manager.train();
```

Saving can also be done manually with `manager.save()`:

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], autoSave: false });
await manager.train();
manager.save(filename);
```

Loading a model file:

```javascript
const { NlpManager } = require('node-nlp');

manager = new NlpManager();
manager.load(filename);
```

> Note that if no filename is provided, './model.nlp' will be used by default.

### Import/Export Using JSON

`NlpManager.export` returns a model in JSON format, and `NlpManager.import` reads a model in JSON format. When exporting a model, you can choose whether or not to minify it.

Exporting a model:

```javascript
const { NlpManager } = require('node-nlp');

const minified = true;
const manager = new NlpManager();
// ...
await manager.train();
const data = manager.export(minified);
```

Importing a model:

```javascript
const fs = require('fs');
const { NlpManager } = require('node-nlp');

const data = fs.readFileSync('model.nlp', 'utf8');
const manager = new NlpManager();
manager.import(data);
// ...
```

## Context

You can also provide a context to `NlpManger.process` so the NLG changes its behaviour based on the context.

In this example, the manager chooses, "Till next time, {{name}}!" as the answer, and is able to use the `%name%` in the answer because context from the greeting is provided. The final result is, "Till next time, John!".

```javascript
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

## Transformers

The NLPManager constructor accepts a `processTransformer` function, which can be used to intercept, and modify the output of the manager's `process` function. When present, it will run after `process` completes, and the result of this function is what will be returned by `process`.

```javascript
const manager = new NlpManager({
  processTransformer: async (originalProcessOutput) => {
    return {
      ...originalProcessOutput,
      ...{
        anything: 'you want'
      }
    }
  }
});
```

or with Promises:

```javascript
const manager = new NlpManager({
  processTransformer: (originalProcessOutput) => new Promise((resolve, reject) =>  {
      originalProcessOutput.context = 'modify or add properties'
      resolve(originalProcessOutput)
  })
});
```

it can be synchronous, too:

```javascript
const manager = new NlpManager({
  processTransformer: function (originalProcessOutput) {
    return Object.assign(originalProcessOutput, { anything: 'you want' })
  }
});
```
