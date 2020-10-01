const { ConsoleConnector } = require('../../packages/console-connector/src');
// const { ConsoleConnector } = require('@nlpjs/console-connector');

const connector = new ConsoleConnector();
connector.onHear = (self, text) => {
  self.say(`You said "${text}"`);
};
connector.say('Say something!');
