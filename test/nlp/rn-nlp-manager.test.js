const { RnNlpManager } = require('../../lib');

describe('RN NLP Manager', () => {
  describe('Process', () => {
    test('If the NLG is trained, and the answer contains a template, replace with context variables', async () => {
      const manager = new RnNlpManager({ languages: ['en'] });
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('en', 'how is your day', 'greetings.howareyou');
      manager.addDocument('en', 'how is your day going', 'greetings.howareyou');
      manager.addDocument('en', 'how are you', 'greetings.howareyou');
      manager.addDocument('en', 'how are you doing', 'greetings.howareyou');
      manager.addDocument('en', 'what about your day', 'greetings.howareyou');
      manager.addDocument('en', 'are you alright', 'greetings.howareyou');
      manager.addDocument('en', 'nice to meet you', 'greetings.nicetomeetyou');
      manager.addDocument(
        'en',
        'pleased to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument(
        'en',
        'it was very nice to meet you',
        'greetings.nicetomeetyou'
      );
      manager.addDocument('en', 'glad to meet you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice meeting you', 'greetings.nicetomeetyou');
      manager.addDocument('en', 'nice to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'good to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'great to see you', 'greetings.nicetoseeyou');
      manager.addDocument('en', 'lovely to see you', 'greetings.nicetoseeyou');
      manager.addDocument(
        'en',
        'nice to talk to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's nice to talk to you",
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        'nice talking to you',
        'greetings.nicetotalktoyou'
      );
      manager.addDocument(
        'en',
        "it's been nice talking to you",
        'greetings.nicetotalktoyou'
      );
      manager.addAnswer('en', 'greetings.bye', 'Till next time');
      manager.addAnswer('en', 'greetings.bye', 'See you soon!');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      manager.addAnswer('en', 'greetings.hello', 'Greetings!');
      manager.addAnswer('en', 'greetings.howareyou', 'Feeling wonderful!');
      manager.addAnswer(
        'en',
        'greetings.howareyou',
        'Wonderful! Thanks for asking'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "It's nice meeting you, too {{name}}"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        "Likewise. I'm looking forward to helping you out {{name}}"
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'Nice meeting you, as well {{name}}'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetomeetyou',
        'The pleasure is mine {{name}}'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'Same here. I was starting to miss you'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetoseeyou',
        'So glad we meet again'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'It sure was. We can chat again anytime'
      );
      manager.addAnswer(
        'en',
        'greetings.nicetotalktoyou',
        'I enjoy talking to you, too'
      );
      await manager.train();
      const result = await manager.process('en', 'It was nice to meet you', {
        name: 'John',
      });
      expect(result.srcAnswer).toMatch(
        new RegExp(
          /(It's nice meeting you, too {{name}})|(Likewise. I'm looking forward to helping you out {{name}})|(Nice meeting you, as well {{name}})|(The pleasure is mine {{name}})/g
        )
      );
      expect(result.answer).toMatch(
        new RegExp(
          /(It's nice meeting you, too John)|(Likewise. I'm looking forward to helping you out John)|(Nice meeting you, as well John)|(The pleasure is mine John)/g
        )
      );
    });
  });
});
