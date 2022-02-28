// const { Ner } = require('@nlpjs/ner');
const { Ner } = require('../../packages/ner');

(async () => {
  const ner = new Ner();
  ner.addAfterLastCondition('en', 'origin', 'from');
  ner.addAfterLastCondition('en', 'destination', 'to');
  ner.addBetweenLastCondition('en', 'destination', ['to'], ['from']);
  ner.addBetweenLastCondition('en', 'origin', ['from'], ['to']);

  // Disclaimer: Have in mind this helps you to extract key information from the utterance but in some cases will require post processing

  let text = 'travel to Madrid';
  let response = await ner.process({ text });
  console.log('response ', response); // -> destination: Madrid

  text = 'travel from Barcelona';
  response = await ner.process({ text });
  console.log('response ', response); // -> origin: Barcelona

  text = 'I want to travel from Barcelona to Madrid';
  response = await ner.process({ text });
  console.log('response ', response); // -> origin: Barcelona, destination: Madrid

  text = 'I want to travel to Madrid from Barcelona';
  response = await ner.process({ text });
  console.log('response ', response); // -> origin: Barcelona, destination: Madrid
})();
