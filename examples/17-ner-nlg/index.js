// const { dockStart } = require('@nlpjs/basic');
const { dockStart } = require('../../packages/basic');

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
  nlp.addDocument(locale, 'I drove a @Car yesterday', 'use-case1.drive');
  nlp.addDocument(locale, `I'm driving a @Car`, 'use-case1.drive');
  nlp.addDocument(
    locale,
    `I like to take my friends by car`,
    'use-case1.drive'
  );

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

  const singleCar = `entities.Car.option`;
  const manyCars = `many cars (' + Car_0 + ', ' + Car_1 + '...)`;
  nlp.addAnswer(
    locale,
    'use-case1.drive',
    `You drive {{ entities && entities.Car ? (entities.Car.isList ? '${manyCars}' : ${singleCar}) : 'a car'}}!`
  );

  const entities = {
    Car: {
      options: {
        'renault Twingo': ['Twingo', 'twingo'],
        'peugeot 206': ['206'],
        volvo: ['volvo'],
      },
    },
  };

  nlp.addEntities(entities, locale);

  await nlp.train();

  const response1 = await nlp.process('en', 'I drove a volvo');
  console.log(response1.answer); // You drive a volvo!
  const response2 = await nlp.process('en', 'I like to drive with my 206');
  console.log(response2.answer); // You drive a peugeot 206!
  const response3 = await nlp.process('en', 'I like to drive');
  console.log(response3.answer); // You drive a car!
  const response4 = await nlp.process('en', `We don't fit in your twingo`);
  console.log(response4.answer); // You drive a renault Twingo!
  const response5 = await nlp.process('en', `I use to take a car some days`);
  console.log(response5.answer); // You drive a car!
  const response6 = await nlp.process('en', 'I use to drive a 206 and volvo');
  console.log(response6.answer); // You drive many cars (206, volvo...)!
})();
