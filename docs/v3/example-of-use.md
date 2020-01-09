# Example of use

You can see a great example of use at the folder \examples\console-bot. This example is able to train the bot and save the model to a file, so when the bot is started again, the model is loaded instead of trained again.

You can start to build your NLP from scratch with few lines:

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');

async function train() {
  await manager.train();
}

// Train and save the model
train();
manager.save();

manager.process('en', 'I have to go').then(console.log);
```

This will show this result in console:

```bash
{ locale: 'en',
  localeIso2: 'en',
  language: 'English',
  utterance: 'I have to go',
  classification:
   [ { label: 'greetings.bye', value: 0.9791293407583773 },
     { label: 'greetings.hello', value: 0.020870659241622735 } ],
  intent: 'greetings.bye',
  score: 0.9791293407583773,
  entities: [],
  sentiment:
   { score: 0.5,
     comparative: 0.125,
     vote: 'positive',
     numWords: 4,
     numHits: 1,
     type: 'senticon',
     language: 'en' },
  answer: 'Till next time' }
```
