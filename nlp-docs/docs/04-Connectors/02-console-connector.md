# Console connector

The console connector allows you to manage scenarios where the main interface is the console.

## Installation

You can install the console connector @nlpjs/console-connector using:

```bash
    npm install @nlpjs/console-connector
```

## Example of use of the package

```javascript
const { ConsoleConnector } = require("@nlpjs/console-connector");

const connector = new ConsoleConnector();
connector.onHear = (self, text) => {
  self.say(`You said "${text}"`);
};
connector.say("Say something!");
```

## Example of use with @nlpjs/basic

Having a file _corpus.json_ in the source code folder, you could have a bot like this:

```javascript
const { dockStart } = require("@nlpjs/basic");

(async () => {
  const dockConfiguration = {
    settings: {
      nlp: { corpora: ["./corpus.json"] },
    },
    use: ["Nlp", "ConsoleConnector"],
  };
  const dock = await dockStart(dockConfiguration);
  const nlp = dock.get("nlp");
  await nlp.train();
  const connector = dock.get("console");
  connector.say("Say something!");
})();
```

## Configuration

For configuration details refer to [the proper configuration section](/configuration#console-connector)
