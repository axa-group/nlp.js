# @nlpjs/lang-en-min

## Installation

You can install @nlpjs/lang-en-min:

```bash
    npm install @nlpjs/lang-en-min
```

## Example of Usage

```javascript
const { containerBootstrap } = require("@nlpjs/core");
const { Nlp } = require("@nlpjs/nlp");
const { LangEn } = require("@nlpjs/lang-en-min");

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangEn);
  const nlp = container.get("nlp");
  nlp.settings.autoSave = false;
  nlp.addLanguage("en");
  // Adds the utterances and intents for the NLP
  nlp.addDocument("en", "goodbye for now", "greetings.bye");
  nlp.addDocument("en", "bye bye take care", "greetings.bye");
  nlp.addDocument("en", "okay see you later", "greetings.bye");
  nlp.addDocument("en", "bye for now", "greetings.bye");
  nlp.addDocument("en", "i must go", "greetings.bye");
  nlp.addDocument("en", "hello", "greetings.hello");
  nlp.addDocument("en", "hi", "greetings.hello");
  nlp.addDocument("en", "howdy", "greetings.hello");

  // Train also the NLG
  nlp.addAnswer("en", "greetings.bye", "Till next time");
  nlp.addAnswer("en", "greetings.bye", "see you soon!");
  nlp.addAnswer("en", "greetings.hello", "Hey there!");
  nlp.addAnswer("en", "greetings.hello", "Greetings!");
  await nlp.train();
  const response = await nlp.process("en", "I should go now");
  console.log(response);
})();
```
