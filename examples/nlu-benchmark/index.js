const { NlpManager, NlpUtil } = require('../../lib');
const AskUbuntuCorpus = require('./AskUbuntuCorpus.json');
const ChatbotCorpus = require('./ChatbotCorpus.json');
const WebApplicationCorpus = require('./WebApplicationCorpus.json');

NlpUtil.useAlternative.en = true;

async function scoreCorpus(corpus) {
  const manager = new NlpManager({ languages: ['en'] });
  const { sentences } = corpus;
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (sentence.training) {
      manager.addDocument('en', sentence.text, sentence.intent);
    }
  }
  manager.train();
  let total = 0;
  let correct = 0;
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (!sentence.training) {
      /* eslint-disable no-await-in-loop */
      const result = await manager.process('en', sentence.text);
      total += 1;
      if (result.intent === sentence.intent) {
        correct += 1;
      }
    }
  }
  return { total, correct };
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
  console.log(`Global Score: ${(correct / total).toFixed(2)}`);
}

process();
