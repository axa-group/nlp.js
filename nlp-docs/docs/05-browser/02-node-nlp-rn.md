# node-nlp-rn

There is a version of NLP.js that works in React Native, so you can build chatbots that can be trained and executed on the mobile even without the internet. You can install it via NPM:

```bash
    npm install node-nlp-rn
```

Some limitations:

- No Chinese
- The Japanese stemmer is not the complete one
- No Excel import
- No loading from a file, or saving to a file, but it can still import from JSON and export to JSON.

## Example of use

You can see a great example of use in the folder [`/examples/02-qna-classic`](https://github.com/axa-group/nlp.js/tree/master/examples/02-qna-classic). This example is able to train the bot and save the model to a file, so when the bot is started again, the model is loaded instead of being trained again.

You can start to build your NLP from scratch with a few lines:

```javascript
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument("en", "goodbye for now", "greetings.bye");
manager.addDocument("en", "bye bye take care", "greetings.bye");
manager.addDocument("en", "okay see you later", "greetings.bye");
manager.addDocument("en", "bye for now", "greetings.bye");
manager.addDocument("en", "i must go", "greetings.bye");
manager.addDocument("en", "hello", "greetings.hello");
manager.addDocument("en", "hi", "greetings.hello");
manager.addDocument("en", "howdy", "greetings.hello");

// Train also the NLG
manager.addAnswer("en", "greetings.bye", "Till next time");
manager.addAnswer("en", "greetings.bye", "see you soon!");
manager.addAnswer("en", "greetings.hello", "Hey there!");
manager.addAnswer("en", "greetings.hello", "Greetings!");

// Train and save the model.
(async () => {
  await manager.train();
  manager.save();
  const response = await manager.process("en", "I should go now");
  console.log(response);
})();
```

This produces the following result in a console:

```bash
{ utterance: 'I should go now',
  locale: 'en',
  languageGuessed: false,
  localeIso2: 'en',
  language: 'English',
  domain: 'default',
  classifications:
   [ { label: 'greetings.bye', value: 0.698219120207268 },
     { label: 'None', value: 0.30178087979273216 },
     { label: 'greetings.hello', value: 0 } ],
  intent: 'greetings.bye',
  score: 0.698219120207268,
  entities:
   [ { start: 12,
       end: 14,
       len: 3,
       accuracy: 0.95,
       sourceText: 'now',
       utteranceText: 'now',
       entity: 'datetime',
       resolution: [Object] } ],
  sentiment:
   { score: 1,
     comparative: 0.25,
     vote: 'positive',
     numWords: 4,
     numHits: 2,
     type: 'senticon',
     language: 'en' },
  actions: [],
  srcAnswer: 'Till next time',
  answer: 'Till next time' }
```
