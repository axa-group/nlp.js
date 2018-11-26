const { ActivityTypes } = require('botbuilder');
const { Recognizer } = require('../../lib');
const trainnlp = require('./train-nlp');

class MyBot {
  constructor() {
    this.recognizer = new Recognizer();
    this.recognizer.nlpManager.addLanguage('en');
    trainnlp(this.recognizer.nlpManager, console.log);
  }

  async onTurn(turnContext) {
    if (turnContext.activity.type === ActivityTypes.Message) {
      try {
        const result = await this.recognizer.recognize(turnContext);
        await turnContext.sendActivity(result.answer);
      } catch (ex) {
        await turnContext.sendActivity('Opps! there was an error recognizing!');
      }
    }
  }
}

module.exports = MyBot;
