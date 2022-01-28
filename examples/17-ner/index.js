const { dockStart } = require('@nlpjs/basic');

(async () => {
  const locale = 'en';
  const dock = await dockStart({ 
     settings: {
        nlp: {
         forceNER: true,
       },
     },
      use: ['Basic'], 
   });
  const nlp = dock.get('nlp');

  nlp.addLanguage(locale);

  nlp.addDocument(locale, 'I use to drive a car everyday', 'use-case1.drive');
  nlp.addDocument(locale, 'I\'m driving to Barcelona', 'use-case1.drive');
  nlp.addDocument(locale, 'I\'m driving a peugeot', 'use-case1.drive');
  
  nlp.addDocument(locale, 'bye bye take care', 'greetings.bye');
  nlp.addDocument(locale, 'goodbye for now', 'greetings.bye');
  nlp.addDocument(locale, 'bye bye take care', 'greetings.bye');
  nlp.addDocument(locale, 'okay see you later', 'greetings.bye');
  nlp.addDocument(locale, 'bye for now', 'greetings.bye');
  nlp.addDocument(locale, 'i must go', 'greetings.bye');
  nlp.addDocument(locale, 'hello', 'greetings.hello');
  nlp.addDocument(locale, 'hi', 'greetings.hello');
  nlp.addDocument(locale, 'howdy', 'greetings.hello');

  nlp.addAnswer(locale, 'greetings.bye', 'Till next time');
  nlp.addAnswer(locale, 'greetings.bye', 'see you soon!');
  nlp.addAnswer(locale, 'greetings.hello', 'Hey there!');
  nlp.addAnswer(locale, 'greetings.hello', 'Greetings!');
  nlp.addAnswer(locale, 'use-case1.drive', `You drive a {{ entities && entities.Car ? entities.Car.option : 'car' }}!`);

  const entities = {
    Car: {
      'options': {
        'Twingo': ['Twingo', 'twingo'],
        'peugeot 206': ['206'],
        'volvo': ['volvo'],
      }
    }
  };

  nlp.addEntities(entities, locale);

  await nlp.train();
  const response1 = await nlp.process('en', 'I drove a volvo'); // You drive a volvo!
  console.log(response1.answer);
  const response2 = await nlp.process('en', 'I like to drive with my 206'); // You drive a peugeot 206!
  console.log(response2.answer);
  const response3 = await nlp.process('en', 'I like to drive'); // You drive a car!
  console.log(response3.answer);

})();