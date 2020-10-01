# @nlpjs/console-connector

## Installation

You can install @nlpjs/console-connector:

```bash
    npm install @nlpjs/console-connector
```

## Example of use inside NLP.js

This is a little bit special component. It allows to manage scenarios where the main interface way is the console. You can find an example of use on **`examples/02-qna-classic`**.

## Example of use of the package

```javascript
const { ConsoleConnector } = require('@nlpjs/console-connector');

const connector = new ConsoleConnector();
connector.onHear = (self, text) => {
  self.say(`You said "${text}"`);
};
connector.say('Say something!');
```

## Example of use with @nlpjs/basic

You must have a file _corpus.json_ in the folder of the source code:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dockConfiguration = {
    settings: {
      nlp: { corpora: ['./corpus.json'] },
    },
    use: ['Nlp', 'ConsoleConnector']
  };
  const dock = await dockStart(dockConfiguration);
  const nlp = dock.get('nlp');
  await nlp.train();
  const connector = dock.get('console');
  connector.say('Say something!');
})();
```
