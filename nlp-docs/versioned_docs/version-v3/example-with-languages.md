# Example with languages

This example show how to handle the three kind of different scenarios with languages:
1. The language has stemmer
2. The language exists but has no stemmer
3. The language does not exists (fantasy language)

This example uses english, korean and klingon.

```javascript
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en', 'ko', 'kl'] });
// Gives a name for the fantasy language
manager.describeLanguage('kl', 'Klingon');
// Train Klingon
manager.addDocument('kl', 'nuqneH', 'hello');
manager.addDocument('kl', 'maj po', 'hello');
manager.addDocument('kl', 'maj choS', 'hello');
manager.addDocument('kl', 'maj ram', 'hello');
manager.addDocument('kl', `nuqDaq ghaH ngaQHa'moHwI'mey?`, 'keys');
manager.addDocument('kl', `ngaQHa'moHwI'mey lujta' jIH`, 'keys');
// Train Korean
manager.addDocument('ko', '여보세요', 'greetings.hello');
manager.addDocument('ko', '안녕하세요!', 'greetings.hello');
manager.addDocument('ko', '여보!', 'greetings.hello');
manager.addDocument('ko', '어이!', 'greetings.hello');
manager.addDocument('ko', '좋은 아침', 'greetings.hello');
manager.addDocument('ko', '안녕히 주무세요', 'greetings.hello');
manager.addDocument('ko', '안녕', 'greetings.bye');
manager.addDocument('ko', '친 공이 타자', 'greetings.bye');
manager.addDocument('ko', '상대가 없어 남는 사람', 'greetings.bye');
manager.addDocument('ko', '지엽적인 것', 'greetings.bye');
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

// Train and save the model.
await manager.train();
manager.save();

// English and Korean can be automatically detected
manager.process('I have to go').then(console.log);
manager.process('상대가 없어 남는 편').then(console.log);
// For Klingon, as it cannot be automatically detected, 
// you must provide the locale
manager.process('kl', `ngaQHa'moHwI'mey nIH vay'`).then(console.log);
```
