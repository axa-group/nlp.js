const { NlpManager, NlpUtil } = require('../../lib');
const AskUbuntuCorpus = require('./AskUbuntuCorpus.json');
const ChatbotCorpus = require('./ChatbotCorpus.json');
const WebApplicationCorpus = require('./WebApplicationCorpus.json');

NlpUtil.useAlternative.en = true;

const withEntities = true;
const entityUtterance = false;
const sentenceUtterance = true;

async function scoreCorpus(corpus) {
  const manager = new NlpManager({ languages: ['en'] });
  const { sentences } = corpus;
  const entities = {};
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    let { text } = sentence;
    if (sentence.training) {
      if (sentence.entities && sentence.entities.length > 0) {
        for (let j = 0; j < sentence.entities.length; j += 1) {
          const entity = sentence.entities[j];
          if (!entities[entity.entity]) {
            entities[entity.entity] = {};
          }
          entities[entity.entity][entity.text] = 1;
          text = text.replace(entity.text, `%${entity.entity}%`);
        }
      }
    }
  }
  if (withEntities) {
    Object.keys(entities).forEach(entity => {
      Object.keys(entities[entity]).forEach(text => {
        manager.addNamedEntityText(entity, text, 'en', text);
      });
    });
  }

  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    let { text } = sentence;
    if (sentence.training) {
      if (sentence.entities && sentence.entities.length > 0) {
        for (let j = 0; j < sentence.entities.length; j += 1) {
          const entity = sentence.entities[j];
          if (!entities[entity.entity]) {
            entities[entity.entity] = {};
          }
          entities[entity.entity][entity.text] = 1;
          text = text.replace(entity.text, `%${entity.entity}%`);
        }
      }
    }
    if (sentence.training) {
      if (text !== sentence.text) {
        if (sentenceUtterance) {
          manager.addDocument('en', sentence.text, sentence.intent);
        }
        if (entityUtterance) {
          manager.addDocument('en', text, sentence.intent);
        }
      } else {
        manager.addDocument('en', sentence.text, sentence.intent);
      }
    }
  }

  await manager.train();
  manager.save('./model.nlp');

  let total = 0;
  let correct = 0;
  const analysis = {};
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (!sentence.training) {
      /* eslint-disable no-await-in-loop */
      const result = await manager.process('en', sentence.text);
      total += 1;
      if (!analysis[result.intent]) {
        analysis[result.intent] = { truePos: 0, falsePos: 0, falseNeg: 0 };
      }
      if (!analysis[sentence.intent]) {
        analysis[sentence.intent] = { truePos: 0, falsePos: 0, falseNeg: 0 };
      }
      if (result.intent === sentence.intent) {
        analysis[result.intent].truePos += 1;
        correct += 1;
      } else {
        analysis[sentence.intent].falsePos += 1;
        if (analysis[result.intent]) {
          analysis[result.intent].falseNeg += 1;
        }
      }
    }
  }
  return { total, correct, analysis };
}

async function process() {
  const askUbuntuResult = await scoreCorpus(AskUbuntuCorpus);
  const chatbotResult = await scoreCorpus(ChatbotCorpus);
  const webApplicationResult = await scoreCorpus(WebApplicationCorpus);
  console.log(
    `Ask Ubuntu ${askUbuntuResult.correct} / ${askUbuntuResult.total} = ${(
      askUbuntuResult.correct / askUbuntuResult.total
    ).toFixed(2)}`
  );
  console.log(
    `Chatbot ${chatbotResult.correct} / ${chatbotResult.total} = ${(
      chatbotResult.correct / chatbotResult.total
    ).toFixed(2)}`
  );
  console.log(
    `Web Application ${webApplicationResult.correct} / ${
      webApplicationResult.total
    } = ${(webApplicationResult.correct / webApplicationResult.total).toFixed(
      2
    )}`
  );
  const total =
    askUbuntuResult.total + chatbotResult.total + webApplicationResult.total;
  const correct =
    askUbuntuResult.correct +
    chatbotResult.correct +
    webApplicationResult.correct;
  console.log(`Global Score: ${(correct / total).toFixed(4)}`);
  const analysis = {
    chatbot: chatbotResult.analysis,
    askUbuntu: askUbuntuResult.analysis,
    webApplication: webApplicationResult.analysis,
  };
  console.log(analysis);
}

process();
