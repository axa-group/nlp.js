const { NlpManager, NlpUtil } = require('../../packages/node-nlp');
const AskUbuntuCorpus = require('./AskUbuntuCorpus.json');
const ChatbotCorpus = require('./ChatbotCorpus.json');
const WebApplicationCorpus = require('./WebApplicationCorpus.json');

NlpUtil.useAlternative.en = true;

const TOP_LIMIT = 3;

function showTopN(classifications, n) {
   let topN = [];
   if (classifications.length > 0) {
      topN = classifications.slice(0, n);
   }
   return topN.length > 0 ? 'Top ' + topN.length + ': ' + topN.map(item => `${item.intent} (${item.score.toFixed(2)})`).join(', ') : '';
}

async function scoreCorpus(corpus) {
  const manager = new NlpManager({ languages: ['en'] });
  const { sentences } = corpus;
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (sentence.training) {
      manager.addDocument('en', sentence.text, sentence.intent);
    }
  }
  await manager.train();
  let total = 0;
  let correct = 0;
  for (let i = 0; i < sentences.length; i += 1) {
    const sentence = sentences[i];
    if (!sentence.training) {
      const result = await manager.process('en', sentence.text);
      total += 1;
      if (result.intent === sentence.intent) {
        correct += 1;
      } else {
         console.log(`Failing text: "${sentence.text}". Calculated intent "${result.intent}" that should be "${sentence.intent}"`);
         console.log(showTopN(result.classifications, TOP_LIMIT));
      }
    }
  }
  console.log('\n\n');
  return { total, correct };
}

async function process() {
  let total = 0;
  let correct = 0;
   
  const askUbuntuResult = await scoreCorpus(AskUbuntuCorpus);
  total += askUbuntuResult.total;
  correct += askUbuntuResult.correct;
   
  const chatbotResult = await scoreCorpus(ChatbotCorpus);
  total += chatbotResult.total;
  correct += chatbotResult.correct;

  const webApplicationResult = await scoreCorpus(WebApplicationCorpus);
  
  console.log(`[Correct answers / total]`);
  console.log(`Ask Ubuntu ${askUbuntuResult.correct} / ${askUbuntuResult.total} = ${(askUbuntuResult.correct / askUbuntuResult.total).toFixed(2)}`);
  console.log(`Chatbot ${chatbotResult.correct} / ${chatbotResult.total} = ${(chatbotResult.correct / chatbotResult.total).toFixed(2)}`);
  console.log(`Web Application ${webApplicationResult.correct} / ${webApplicationResult.total} = ${(webApplicationResult.correct / webApplicationResult.total).toFixed(2)}`);

  total += webApplicationResult.total;
  correct += webApplicationResult.correct;

  console.log(`Global Score: ${(correct / total).toFixed(2)}`);
}

process();