/* eslint-disable import/no-unresolved */
const builder = require('botbuilder');
const express = require('express');
const { Recognizer } = require('../../lib');

// Creates a connector for the chatbot
const connector = new builder.ChatConnector({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD,
});

// Creates a node-nlp recognizer for the bot
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
  'travel'
);
recognizer.nlpManager.addAnswer(
  'en',
  'travel',
  'You want to travel from {{ fromCity }} to {{ toCity }} {{ date }}'
);

(async () => {
  await recognizer.nlpManager.train();

  // Creates the bot using a memory storage, with a main dialog that
  // use the node-nlp recognizer to calculate the answer.
  const bot = new builder.UniversalBot(connector, session => {
    session.send(
      `You reached the default message handler. You said '${
        session.message.text
      }'.`
    );
  }).set('storage', new builder.MemoryBotStorage());

  recognizer.setBot(bot, true);

  // Creates the express application
  const app = express();
  const port = process.env.PORT || 3000;
  app.post('/api/messages', connector.listen());
  app.listen(port);
  console.log(`Chatbot listening on port ${port}`);
})();
