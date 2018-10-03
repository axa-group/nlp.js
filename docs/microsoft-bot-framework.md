# Microsoft Bot Framwork

## Introduction

You can integrate it with Microsoft Bot Framework chatbots by importing the _Recognizer_ class from _node-nlp_ and using it as always. This will be enough to work as the LUIS Recognizer, using `bot.recognizer(recognizer);` but as LUIS does not have NLG you'll have to develop how to integrate the answers and not only the intents.

If you want that the chatbot is automatically using the NLG, instead of calling `bot.recognizer(recognizer);` that tells Microsoft Bot Framework to use the recognizer, use `recognizer.setBot(bot, true, 0.7);` that is telling the recognizer what bot must be used, the second parameter (optional) is true to override the usual behaviour of Microsoft Bot Framework with the improved behaviour of the recognizer, and the last parameter (optional) is the threshold that indicates that the intent response must be used instead of triggering the next step of the dialogs.

Another feature that comes with the improved behaviour, is that when the answer starts with _/_ then is not a phrase to return to the user, and is a _session.beginDialog()_, so the dialog of the given name is raised and pushed into the dialog stack.

![Example](https://github.com/axa-group/nlp.js/blob/master/screenshots/slotfilling.gif)

## Example of use

Example of a bot using Microsoft Bot Framework and NLP.js.
To create the bot create a folder and start a new node project with npm init. Then install the dependencies:

```sh
npm i botbuilder express node-nlp
```

Put the code in the index.js, and in the same folder put an excel file with the NLP information.
Execute it and the magic will happen. The bot will be trained the first time you start the app, so first time will take some time to train, but next times will load the already trained model.

```javascript
const builder = require('botbuilder');
const express = require('express');
const fs = require('fs');
const { Recognizer } = require('node-nlp');

const modelName = './model.nlp';
const excelName = './model.xls';

// Creates a connector for the chatbot
const connector = new builder.ChatConnector({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD,
});

// Creates a node-nlp recognizer for the bot
const recognizer = new Recognizer();
if (fs.existsSync(modelName)) {
  recognizer.load(modelName);
} else {
  recognizer.loadExcel(excelName);
  recognizer.save(modelName);
}

// Creates the bot using a memory storage, with a main dialog that
// use the node-nlp recognizer to calculate the answer.
const bot = new builder.UniversalBot(connector, session => {
  session.send(
    `You reached the default message handler. You said '${
      session.message.text
    }'.`,
  );
}).set('storage', new builder.MemoryBotStorage());

recognizer.setBot(bot, true);

// Creates the express application
const app = express();
const port = process.env.PORT || 3000;
app.post('/api/messages', connector.listen());
app.listen(port);
console.log(`Chatbot listening on port ${port}`);
```

## Recognizer and Slot filling

Slot filling is done automatically when using the recognizer for microsoft bot framework when the behaviour overrided to be the one of NLP.js.

Example code for slot filling:

```javascript
const recognizer = new Recognizer();
recognizer.nlpManager.addLanguage('en');
const fromEntity = recognizer.nlpManager.addTrimEntity('fromCity');
fromEntity.addBetweenCondition('en', 'from', 'to', { skip: ['travel'] });
fromEntity.addAfterLastCondition('en', 'from', { skip: ['travel'] });
const toEntity = recognizer.nlpManager.addTrimEntity('toCity');
toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
toEntity.addAfterLastCondition('en', 'to', { skip: ['travel'] });
recognizer.nlpManager.slotManager.addSlot('travel', 'toCity', true, {
  en: 'Where do you want to go?',
});
recognizer.nlpManager.slotManager.addSlot('travel', 'fromCity', true, {
  en: 'From where you are traveling?',
});
recognizer.nlpManager.slotManager.addSlot('travel', 'date', true, {
  en: 'When do you want to travel?',
});
recognizer.nlpManager.addDocument(
  'en',
  'I want to travel from %fromCity% to %toCity% %date%',
  'travel',
);
recognizer.nlpManager.addAnswer(
  'en',
  'travel',
  'You want to travel from {{ fromCity }} to {{ toCity }} {{ date }}',
);
await recognizer.nlpManager.train();
```

With this example what we achieve is that the user can use the intent providing partial information, and the bot automatically ask the information not provided. So we can have conversations like:

```
user> I want to travel
bot> Where do you want to go?
user> London
bot> From where you are traveling?
user> Barcelona
bot> When do you want to travel?
user> tomorrow
bot> You want to travel from Barcelona to London tomorrow
```

But also can provide some information or all at the first utterance of the intent:

```
user> I want to travel tomorrow to London
bot> From where you are traveling?
user> Barcelona
bot> You want to travel from Barcelona to London tomorrow
```

You have an example of a Microsoft Bot Framework bot with an intent with slot filling at [`/examples/microsoft-bot`](https://github.com/axa-group/nlp.js/tree/master/examples/microsoft-bot)
