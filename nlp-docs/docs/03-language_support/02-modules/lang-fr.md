# @nlpjs/lang-fr

## Installation

You can install @nlpjs/lang-fr:

```bash
    npm install @nlpjs/lang-fr
```

## Example of Usage

```javascript
const { containerBootstrap } = require("@nlpjs/core");
const { Nlp } = require("@nlpjs/nlp");
const { LangFr } = require("@nlpjs/lang-fr");

(async () => {
  const container = await containerBootstrap();
  container.use(Nlp);
  container.use(LangFr);
  const nlp = container.get("nlp");
  nlp.settings.autoSave = false;
  nlp.addLanguage("fr");
  // Adds the utterances and intents for the NLP
  nlp.addDocument("fr", "au revoir pour l'instant", "greetings.bye");
  nlp.addDocument("fr", "au revoir et soyez prudent", "greetings.bye");
  nlp.addDocument("fr", "très bien à plus tard", "greetings.bye");
  nlp.addDocument("fr", "je dois partir", "greetings.bye");
  nlp.addDocument("fr", "Salut", "greetings.hello");

  // Train also the NLG
  nlp.addAnswer("fr", "greetings.bye", "à la prochaine");
  nlp.addAnswer("fr", "greetings.bye", "à bientôt!");
  nlp.addAnswer("fr", "greetings.hello", "salut comment ca va!");
  nlp.addAnswer("fr", "greetings.hello", "salutations!");
  await nlp.train();
  const response = await nlp.process("fr", "je dois partir");
  console.log(response);
})();
```
