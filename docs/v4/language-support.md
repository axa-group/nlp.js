# Language Support

## Supported languages

Native Support means that the tokenizer and stemmer are included in javascript in NLP.js.
BERT Support means that the tokenizer and stemmer are supported through a BERT API made in python. You can see how to create this API here: https://github.com/axa-group/nlp.js/tree/master/examples/80-bert-server

Microsoft Builtins mean that the Builtin Entity extraction is supported directly in javascript, while the ones supported by Duckling requires the deployment of a Duckling instance. Read more about builtin entities here: https://github.com/axa-group/nlp.js/blob/master/docs/v3/builtin-entity-extraction.md

Languages not included in this list can be still supported, but without stemming, only tokenizing. That means less precission, but most of the times can be good enough, as an example you can use it for fantasy languages (at unit tests you'll find tests in klingon from Star Trek).

| Locale | Language              | Native Support | BERT Support | Microsoft Builtins | Duckling Builtins |
|--------|-----------------------|----------------|--------------|--------------------|-------------------|
| af     | Afrikaans             |       No       |      Yes     |         No         |        Yes        |
| sq     | Albanian              |       No       |      Yes     |         No         |         No        |
| ar     | Arabic                |       Yes      |      Yes     |         No         |        Yes        |
| an     | Aragonese             |       No       |      Yes     |         No         |         No        |
| hy     | Armenian              |       Yes      |      Yes     |         No         |         No        |
| ast    | Asturian              |       No       |      Yes     |         No         |         No        |
| az     | Azerbaijani           |       No       |      Yes     |         No         |         No        |
| ba     | Bashkir               |       No       |      Yes     |         No         |         No        |
| eu     | Basque                |       Yes      |      Yes     |         No         |         No        |
| bar    | Bavarian              |       No       |      Yes     |         No         |         No        |
| be     | Belarusian            |       No       |      Yes     |         No         |         No        |
| bn     | Bengali               |       Yes      |      Yes     |         No         |        Yes        |
| bpy    | Bishnupriya Manipuri  |       No       |      Yes     |         No         |         No        |
| bs     | Bosnian               |       No       |      Yes     |         No         |         No        |
| br     | Breton                |       No       |      Yes     |         No         |         No        |
| bg     | Bulgarian             |       No       |      Yes     |         No         |        Yes        |
| my     | Burmese               |       No       |      Yes     |         No         |        Yes        |
| ca     | Catalan               |       Yes      |      Yes     |         No         |         No        |
| ceb    | Cebuano               |       No       |      Yes     |         No         |         No        |
| ce     | Chechen               |       No       |      Yes     |         No         |         No        |
| zh     | Chinese (Simplified)  |       Yes      |      Yes     |         Yes        |        Yes        |
| zh     | Chinese (Traditional) |       Yes      |      Yes     |         Yes        |        Yes        |
| cv     | Chuvash               |       No       |      Yes     |         No         |         No        |
| hr     | Croatian              |       No       |      Yes     |         No         |        Yes        |
| cs     | Czech                 |       Yes      |      Yes     |         No         |         No        |
| da     | Danish                |       Yes      |      Yes     |         No         |        Yes        |
| nl     | Dutch                 |       Yes      |      Yes     |         No         |        Yes        |
| en     | English               |       Yes      |      Yes     |         Yes        |        Yes        |
| et     | Estonian              |       No       |      Yes     |         No         |        Yes        |
| fi     | Finnish               |       Yes      |      Yes     |         No         |        Yes        |
| fr     | French                |       Yes      |      Yes     |         Yes        |        Yes        |
| gl     | Galician              |       Yes      |      Yes     |         No         |         No        |
| ka     | Georgian              |       No       |      Yes     |         No         |        Yes        |
| de     | German                |       Yes      |      Yes     |         No         |        Yes        |
| el     | Greek                 |       Yes      |      Yes     |         No         |        Yes        |
| gu     | Gujarati              |       No       |      Yes     |         No         |         No        |
| ht     | Haitian               |       No       |      Yes     |         No         |         No        |
| he     | Hebrew                |       No       |      Yes     |         No         |        Yes        |
| hi     | Hindi                 |       Yes      |      Yes     |         No         |        Yes        |
| hu     | Hungarian             |       Yes      |      Yes     |         No         |        Yes        |
| is     | Icelandic             |       No       |      Yes     |         No         |        Yes        |
| io     | Ido                   |       No       |      Yes     |         No         |         No        |
| id     | Indonesian            |       Yes      |      Yes     |         No         |        Yes        |
| ga     | Irish                 |       Yes      |      Yes     |         No         |        Yes        |
| it     | Italian               |       Yes      |      Yes     |         No         |        Yes        |
| ja     | Japanese              |       Yes      |      Yes     |         Yes        |        Yes        |
| jv     | Javanese              |       No       |      Yes     |         No         |         No        |
| kn     | Kannada               |       No       |      Yes     |         No         |        Yes        |
| kk     | Kazakh                |       No       |      Yes     |         No         |         No        |
| ky     | Kirghiz               |       No       |      Yes     |         No         |         No        |
| ko     | Korean                |       Yes      |      Yes     |         No         |        Yes        |
| la     | Latin                 |       No       |      Yes     |         No         |         No        |
| lv     | Latvian               |       No       |      Yes     |         No         |         No        |
| lt     | Lithuanian            |       Yes      |      Yes     |         No         |         No        |
| lmo    | Lombard               |       No       |      Yes     |         No         |         No        |
| nds    | Low Saxon             |       No       |      Yes     |         No         |         No        |
| lb     | Luxembourgish         |       No       |      Yes     |         No         |         No        |
| mk     | Macedonian            |       No       |      Yes     |         No         |         No        |
| mg     | Malagasy              |       No       |      Yes     |         No         |         No        |
| ms     | Malay                 |       Yes      |      Yes     |         No         |         No        |
| ml     | Malayalam             |       No       |      Yes     |         No         |        Yes        |
| mr     | Marathi               |       No       |      Yes     |         No         |         No        |
| min    | Minangkabau           |       No       |      Yes     |         No         |         No        |
| mn     | Mongolian             |       No       |      Yes     |         No         |        Yes        |
| ne     | Nepali                |       Yes      |      Yes     |         No         |        Yes        |
| new    | Newar                 |       No       |      Yes     |         No         |         No        |
| nb     | Norwegian (Bokmål)    |       Yes      |      Yes     |         No         |        Yes        |
| nn     | Norwegian (Nynorsk)   |       No       |      Yes     |         No         |         No        |
| oc     | Occitan               |       No       |      Yes     |         No         |         No        |
| fa     | Persian (Farsi)       |       Yes      |      Yes     |         No         |         No        |
| pms    | Piedmontese           |       No       |      Yes     |         No         |         No        |
| pl     | Polish                |       Yes      |      Yes     |         No         |        Yes        |
| pt     | Portuguese            |       Yes      |      Yes     |         Yes        |        Yes        |
| pa     | Punjabi               |       No       |      Yes     |         No         |         No        |
| ro     | Romanian              |       Yes      |      Yes     |         No         |        Yes        |
| ru     | Russian               |       Yes      |      Yes     |         No         |        Yes        |
| sco    | Scots                 |       No       |      Yes     |         No         |         No        |
| sr     | Serbian               |       Yes      |      Yes     |         No         |         No        |
| hbs    | Serbo-Croatian        |       No       |      Yes     |         No         |         No        |
| scn    | Sicilian              |       No       |      Yes     |         No         |         No        |
| sk     | Slovak                |       No       |      Yes     |         No         |        Yes        |
| sl     | Slovenian             |       Yes      |      Yes     |         No         |         No        |
| az     | South Azerbaijani     |       No       |      Yes     |         No         |         No        |
| es     | Spanish               |       Yes      |      Yes     |         Yes        |        Yes        |
| su     | Sundanese             |       No       |      Yes     |         No         |         No        |
| sw     | Swahili               |       No       |      Yes     |         No         |        Yes        |
| sv     | Swedish               |       Yes      |      Yes     |         No         |        Yes        |
| tl     | Tagalog               |       Yes      |      Yes     |         No         |         No        |
| tg     | Tajik                 |       No       |      Yes     |         No         |         No        |
| ta     | Tamil                 |       Yes      |      Yes     |         No         |        Yes        |
| tt     | Tatar                 |       No       |      Yes     |         No         |         No        |
| te     | Telugu                |       No       |      Yes     |         No         |         No        |
| th     | Thai                  |       Yes      |      Yes     |         No         |        Yes        |
| tr     | Turkish               |       Yes      |      Yes     |         No         |        Yes        |
| uk     | Ukrainian             |       Yes      |      Yes     |         No         |        Yes        |
| ur     | Urdu                  |       No       |      Yes     |         No         |         No        |
| uz     | Uzbek                 |       No       |      Yes     |         No         |         No        |
| vi     | Vietnamese            |       No       |      Yes     |         No         |        Yes        |
| vo     | Volapük               |       No       |      Yes     |         No         |         No        |
| war    | Waray-Waray           |       No       |      Yes     |         No         |         No        |
| cy     | Welsh                 |       No       |      Yes     |         No         |         No        |
| fy     | West Frisian          |       No       |      Yes     |         No         |         No        |
| pa     | Western Punjabi       |       No       |      Yes     |         No         |         No        |
| yo     | Yoruba                |       No       |      Yes     |         No         |         No        |

## Sentiment Analysis

| Language        | AFINN | Senticon | Pattern |
| :-------------- | :---: | :------: | :-----: |
| Basque (eu)     |       |    X     |         |
| Bengali (bn)    |   X   |          |         |
| Catalan (ca)    |       |    X     |         |
| Danish (da)     |   X   |          |         |
| Dutch (nl)      |       |          |    X    |
| English (en)    |   X   |    X     |    X    |
| Finnish (fi)    |   X   |          |         |
| French (fr)     |       |          |    X    |
| Galician (gl)   |       |    X     |         |
| German (de)     |       |    X     |         |
| Italian (it)    |       |          |    X    |
| Portuguese (pt) |   X   |          |         |
| Russian (ru)    |   X   |          |         |
| Spanish (es)    |   X   |    X     |         |

## Comparision with other NLP products

| Locale | Language              | Microsoft LUIS | Google Dialogflow | SAP Conversational AI | Amazon LEX | IBM Watson | NLP.js |
|--------|-----------------------|----------------|-------------------|-----------------------|------------|------------|:------:|
| af     | Afrikaans             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sq     | Albanian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ar     | Arabic                |       Yes      |         No        |          Yes          |     No     |     Yes    |   Yes  |
| an     | Aragonese             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| hy     | Armenian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ast    | Asturian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| az     | Azerbaijani           |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ba     | Bashkir               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| eu     | Basque                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| bar    | Bavarian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| be     | Belarusian            |       No       |         No        |           No          |     No     |     No     |   Yes  |
| bn     | Bengali               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| bpy    | Bishnupriya Manipuri  |       No       |         No        |           No          |     No     |     No     |   Yes  |
| bs     | Bosnian               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| br     | Breton                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| bg     | Bulgarian             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| my     | Burmese               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ca     | Catalan               |       No       |         No        |          Yes          |     No     |     No     |   Yes  |
| ceb    | Cebuano               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ce     | Chechen               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| zh     | Chinese (Simplified)  |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| zh     | Chinese (Traditional) |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| cv     | Chuvash               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| hr     | Croatian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| cs     | Czech                 |       No       |         No        |           No          |     No     |     Yes    |   Yes  |
| da     | Danish                |       No       |        Yes        |          Yes          |     No     |     No     |   Yes  |
| nl     | Dutch                 |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| en     | English               |       Yes      |        Yes        |          Yes          |     Yes    |     Yes    |   Yes  |
| et     | Estonian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| fi     | Finnish               |       No       |         No        |          Yes          |     No     |     No     |   Yes  |
| fr     | French                |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| gl     | Galician              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ka     | Georgian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| de     | German                |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| el     | Greek                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| gu     | Gujarati              |       Yes      |         No        |           No          |     No     |     No     |   Yes  |
| ht     | Haitian               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| he     | Hebrew                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| hi     | Hindi                 |       Yes      |        Yes        |          Yes          |     No     |     No     |   Yes  |
| hu     | Hungarian             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| is     | Icelandic             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| io     | Ido                   |       No       |         No        |           No          |     No     |     No     |   Yes  |
| id     | Indonesian            |       No       |        Yes        |           No          |     No     |     No     |   Yes  |
| ga     | Irish                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| it     | Italian               |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| ja     | Japanese              |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| jv     | Javanese              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| kn     | Kannada               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| kk     | Kazakh                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ky     | Kirghiz               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ko     | Korean                |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| la     | Latin                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| lv     | Latvian               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| lt     | Lithuanian            |       No       |         No        |           No          |     No     |     No     |   Yes  |
| lmo    | Lombard               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| nds    | Low Saxon             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| lb     | Luxembourgish         |       No       |         No        |           No          |     No     |     No     |   Yes  |
| mk     | Macedonian            |       No       |         No        |           No          |     No     |     No     |   Yes  |
| mg     | Malagasy              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ms     | Malay                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ml     | Malayalam             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| mr     | Marathi               |       Yes      |         No        |           No          |     No     |     No     |   Yes  |
| min    | Minangkabau           |       No       |         No        |           No          |     No     |     No     |   Yes  |
| mn     | Mongolian             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ne     | Nepali                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| new    | Newar                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| nb     | Norwegian (Bokmål)    |       No       |        Yes        |          Yes          |     No     |     No     |   Yes  |
| nn     | Norwegian (Nynorsk)   |       No       |         No        |           No          |     No     |     No     |   Yes  |
| oc     | Occitan               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| fa     | Persian (Farsi)       |       No       |         No        |           No          |     No     |     No     |   Yes  |
| pms    | Piedmontese           |       No       |         No        |           No          |     No     |     No     |   Yes  |
| pl     | Polish                |       No       |        Yes        |          Yes          |     No     |     No     |   Yes  |
| pt     | Portuguese            |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| pa     | Punjabi               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ro     | Romanian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ru     | Russian               |       No       |        Yes        |          Yes          |     No     |     No     |   Yes  |
| sco    | Scots                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sr     | Serbian               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| hbs    | Serbo-Croatian        |       No       |         No        |           No          |     No     |     No     |   Yes  |
| scn    | Sicilian              |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sk     | Slovak                |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sl     | Slovenian             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| az     | South Azerbaijani     |       No       |         No        |           No          |     No     |     No     |   Yes  |
| es     | Spanish               |       Yes      |        Yes        |          Yes          |     No     |     Yes    |   Yes  |
| su     | Sundanese             |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sw     | Swahili               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| sv     | Swedish               |       No       |        Yes        |          Yes          |     No     |     No     |   Yes  |
| tl     | Tagalog               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| tg     | Tajik                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| ta     | Tamil                 |       Yes      |         No        |           No          |     No     |     No     |   Yes  |
| tt     | Tatar                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| te     | Telugu                |       Yes      |         No        |           No          |     No     |     No     |   Yes  |
| th     | Thai                  |       No       |        Yes        |           No          |     No     |     No     |   Yes  |
| tr     | Turkish               |       Yes      |        Yes        |           No          |     No     |     No     |   Yes  |
| uk     | Ukrainian             |       No       |        Yes        |           No          |     No     |     No     |   Yes  |
| ur     | Urdu                  |       No       |         No        |           No          |     No     |     No     |   Yes  |
| uz     | Uzbek                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| vi     | Vietnamese            |       No       |         No        |           No          |     No     |     No     |   Yes  |
| vo     | Volapük               |       No       |         No        |           No          |     No     |     No     |   Yes  |
| war    | Waray-Waray           |       No       |         No        |           No          |     No     |     No     |   Yes  |
| cy     | Welsh                 |       No       |         No        |           No          |     No     |     No     |   Yes  |
| fy     | West Frisian          |       No       |         No        |           No          |     No     |     No     |   Yes  |
| pa     | Western Punjabi       |       No       |         No        |           No          |     No     |     No     |   Yes  |
| yo     | Yoruba                |       No       |         No        |           No          |     No     |     No     |   Yes  |


## Example with several languages including klingon

```javascript
const { NlpManager } = require('../packages/node-nlp/src');

(async () => {
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
})();
```