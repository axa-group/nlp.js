# Language Support

## Supported languages

Native Support means that the tokenizer and stemmer are included in javascript in NLP.js.
BERT Support means that the tokenizer and stemmer are supported through a BERT API made in python. You can see how to create this API here: https://github.com/axa-group/nlp.js/tree/master/examples/80-bert-server

Microsoft Builtins mean that the Builtin Entity extraction is supported directly in javascript, while the ones supported by Duckling requires the deployment of a Duckling instance.

Languages not included in this list can be still supported, but without stemming, only tokenizing. That means less precission, but most of the times can be good enough, as an example you can use it for fantasy languages (at unit tests you'll find tests in klingon from Star Trek).

| Locale | Language              | Native Support | BERT Support | Microsoft Builtins | Duckling Builtins | Sentiment |
|--------|-----------------------|----------------|--------------|--------------------|-------------------|-----------|
| af     | Afrikaans             |                |       X      |                    |         X         |           |
| sq     | Albanian              |                |       X      |                    |                   |           |
| ar     | Arabic                |        X       |       X      |                    |         X         |     X     |
| an     | Aragonese             |                |       X      |                    |                   |           |
| hy     | Armenian              |        X       |       X      |                    |                   |     X     |
| ast    | Asturian              |                |       X      |                    |                   |           |
| az     | Azerbaijani           |                |       X      |                    |                   |           |
| ba     | Bashkir               |                |       X      |                    |                   |           |
| eu     | Basque                |        X       |       X      |                    |                   |     X     |
| bar    | Bavarian              |                |       X      |                    |                   |           |
| be     | Belarusian            |                |       X      |                    |                   |           |
| bn     | Bengali               |        X       |       X      |                    |         X         |     X     |
| bpy    | Bishnupriya Manipuri  |                |       X      |                    |                   |           |
| bs     | Bosnian               |                |       X      |                    |                   |           |
| br     | Breton                |                |       X      |                    |                   |           |
| bg     | Bulgarian             |                |       X      |                    |         X         |           |
| my     | Burmese               |                |       X      |                    |         X         |           |
| ca     | Catalan               |        X       |       X      |                    |                   |     X     |
| ceb    | Cebuano               |                |       X      |                    |                   |           |
| ce     | Chechen               |                |       X      |                    |                   |           |
| zh     | Chinese (Simplified)  |        X       |       X      |          X         |         X         |           |
| zh     | Chinese (Traditional) |        X       |       X      |          X         |         X         |           |
| cv     | Chuvash               |                |       X      |                    |                   |           |
| hr     | Croatian              |                |       X      |                    |         X         |           |
| cs     | Czech                 |        X       |       X      |                    |                   |     X     |
| da     | Danish                |        X       |       X      |                    |         X         |     X     |
| nl     | Dutch                 |        X       |       X      |                    |         X         |     X     |
| en     | [English](https://github.com/axa-group/nlp.js/blob/master/packages/lang-en/README.md)               |        X       |       X      |          X         |         X         |     X     |
| et     | Estonian              |                |       X      |                    |         X         |           |
| fi     | Finnish               |        X       |       X      |                    |         X         |     X     |
| fr     | French                |        X       |       X      |          X         |         X         |     X     |
| gl     | Galician              |        X       |       X      |                    |                   |     X     |
| ka     | Georgian              |                |       X      |                    |         X         |           |
| de     | German                |        X       |       X      |                    |         X         |     X     |
| el     | Greek                 |        X       |       X      |                    |         X         |     X     |
| gu     | Gujarati              |                |       X      |                    |                   |           |
| ht     | Haitian               |                |       X      |                    |                   |           |
| he     | Hebrew                |                |       X      |                    |         X         |           |
| hi     | Hindi                 |        X       |       X      |                    |         X         |     X     |
| hu     | Hungarian             |        X       |       X      |                    |         X         |     X     |
| is     | Icelandic             |                |       X      |                    |         X         |           |
| io     | Ido                   |                |       X      |                    |                   |           |
| id     | [Indonesian](https://github.com/axa-group/nlp.js/blob/master/packages/lang-id/README.md)            |        X       |       X      |                    |         X         |     X     |
| ga     | Irish                 |        X       |       X      |                    |         X         |     X     |
| it     | [Italian](https://github.com/axa-group/nlp.js/blob/master/packages/lang-it/README.md)               |        X       |       X      |                    |         X         |     X     |
| ja     | Japanese              |        X       |       X      |          X         |         X         |           |
| jv     | Javanese              |                |       X      |                    |                   |           |
| kn     | Kannada               |                |       X      |                    |         X         |           |
| kk     | Kazakh                |                |       X      |                    |                   |           |
| ky     | Kirghiz               |                |       X      |                    |                   |           |
| ko     | Korean                |        X       |       X      |                    |         X         |     X     |
| la     | Latin                 |                |       X      |                    |                   |           |
| lv     | Latvian               |                |       X      |                    |                   |           |
| lt     | Lithuanian            |        X       |       X      |                    |                   |     X     |
| lmo    | Lombard               |                |       X      |                    |                   |           |
| nds    | Low Saxon             |                |       X      |                    |                   |           |
| lb     | Luxembourgish         |                |       X      |                    |                   |           |
| mk     | Macedonian            |                |       X      |                    |                   |           |
| mg     | Malagasy              |                |       X      |                    |                   |           |
| ms     | Malay                 |        X       |       X      |                    |                   |           |
| ml     | Malayalam             |                |       X      |                    |         X         |           |
| mr     | Marathi               |                |       X      |                    |                   |           |
| min    | Minangkabau           |                |       X      |                    |                   |           |
| mn     | Mongolian             |                |       X      |                    |         X         |           |
| ne     | Nepali                |        X       |       X      |                    |         X         |     X     |
| new    | Newar                 |                |       X      |                    |                   |           |
| nb     | Norwegian (Bokmål)    |        X       |       X      |                    |         X         |     X     |
| nn     | Norwegian (Nynorsk)   |                |       X      |                    |                   |           |
| oc     | Occitan               |                |       X      |                    |                   |           |
| fa     | Persian (Farsi)       |        X       |       X      |                    |                   |     X     |
| pms    | Piedmontese           |                |       X      |                    |                   |           |
| pl     | Polish                |        X       |       X      |                    |         X         |     X     |
| pt     | Portuguese            |        X       |       X      |          X         |         X         |     X     |
| pa     | Punjabi               |                |       X      |                    |                   |           |
| ro     | Romanian              |        X       |       X      |                    |         X         |     X     |
| ru     | Russian               |        X       |       X      |                    |         X         |     X     |
| sco    | Scots                 |                |       X      |                    |                   |           |
| sr     | Serbian               |        X       |       X      |                    |                   |     X     |
| hbs    | Serbo-Croatian        |                |       X      |                    |                   |           |
| scn    | Sicilian              |                |       X      |                    |                   |           |
| sk     | Slovak                |                |       X      |                    |         X         |           |
| sl     | Slovenian             |        X       |       X      |                    |                   |     X     |
| az     | South Azerbaijani     |                |       X      |                    |                   |           |
| es     | [Spanish](https://github.com/axa-group/nlp.js/blob/master/packages/lang-es/README.md)               |        X       |       X      |          X         |         X         |     X     |
| su     | Sundanese             |                |       X      |                    |                   |           |
| sw     | Swahili               |                |       X      |                    |         X         |           |
| sv     | Swedish               |        X       |       X      |                    |         X         |     X     |
| tl     | Tagalog               |        X       |       X      |                    |                   |     X     |
| tg     | Tajik                 |                |       X      |                    |                   |           |
| ta     | Tamil                 |        X       |       X      |                    |         X         |     X     |
| tt     | Tatar                 |                |       X      |                    |                   |           |
| te     | Telugu                |                |       X      |                    |                   |           |
| th     | Thai                  |        X       |       X      |                    |         X         |     X     |
| tr     | Turkish               |        X       |       X      |                    |         X         |     X     |
| uk     | Ukrainian             |        X       |       X      |                    |         X         |     X     |
| ur     | Urdu                  |                |       X      |                    |                   |           |
| uz     | Uzbek                 |                |       X      |                    |                   |           |
| vi     | Vietnamese            |                |       X      |                    |         X         |           |
| vo     | Volapük               |                |       X      |                    |                   |           |
| war    | Waray-Waray           |                |       X      |                    |                   |           |
| cy     | Welsh                 |                |       X      |                    |                   |           |
| fy     | West Frisian          |                |       X      |                    |                   |           |
| pa     | Western Punjabi       |                |       X      |                    |                   |           |
| yo     | Yoruba                |                |       X      |                    |                   |           |

## Sentiment Analysis

| Language             | AFINN | Senticon | Pattern |
| :------------------- | :---: | :------: | :-----: |
| Arabic (ar)          |   X   |          |         |
| Armenian (hy)        |   X   |          |         |
| Basque (eu)          |       |    X     |         |
| Bengali (bn)         |   X   |          |         |
| Catalan (ca)         |       |    X     |         |
| Czech (cs)           |   X   |          |         |
| Danish (da)          |   X   |          |         |
| Dutch (nl)           |       |          |    X    |
| English (en)         |   X   |    X     |    X    |
| Finnish (fi)         |   X   |          |         |
| French (fr)          |       |          |    X    |
| Galician (gl)        |       |    X     |         |
| German (de)          |       |    X     |         |
| Greek (el)           |   X   |          |         |
| Hindi (hi)           |   X   |          |         |
| Hungarian (hu)       |   X   |          |         |
| Indonesian (id)      |   X   |          |         |
| Irish (ga)           |   X   |          |         |
| Italian (it)         |       |          |    X    |
| Korean (ko)          |   X   |          |         |
| Lithuanian (lt)      |   X   |          |         |
| Nepali (ne)          |   X   |          |         |
| Norwegian (no)       |   X   |          |         |
| Persian (Farsi) (fa) |   X   |          |         |
| Polish (pl)          |   X   |          |         |
| Portuguese (pt)      |   X   |          |         |
| Romanian (ro)        |   X   |          |         |
| Russian (ru)         |   X   |          |         |
| Serbian (sr)         |   X   |          |         |
| Slovenian (sl)       |   X   |          |         |
| Spanish (es)         |   X   |    X     |         |
| Swedish (sv)         |   X   |          |         |
| Tagalog (tl)         |   X   |          |         |
| Tamil (ta)           |   X   |          |         |
| Thai (th)            |   X   |          |         |
| Turkish (tr)         |   X   |          |         |
| Ukrainian (uk)       |   X   |          |         |

## Comparision with other NLP products

| Locale | Language              | Microsoft LUIS | Google Dialogflow | SAP Conversational AI | Amazon LEX | IBM Watson | NLP.js |
|--------|-----------------------|----------------|-------------------|-----------------------|------------|------------|:------:|
| af     | Afrikaans             |                |                   |                       |            |            |    X   |
| sq     | Albanian              |                |                   |                       |            |            |    X   |
| ar     | Arabic                |        X       |                   |           X           |            |      X     |    X   |
| an     | Aragonese             |                |                   |                       |            |            |    X   |
| hy     | Armenian              |                |                   |                       |            |            |    X   |
| ast    | Asturian              |                |                   |                       |            |            |    X   |
| az     | Azerbaijani           |                |                   |                       |            |            |    X   |
| ba     | Bashkir               |                |                   |                       |            |            |    X   |
| eu     | Basque                |                |                   |                       |            |            |    X   |
| bar    | Bavarian              |                |                   |                       |            |            |    X   |
| be     | Belarusian            |                |                   |                       |            |            |    X   |
| bn     | Bengali               |                |                   |                       |            |            |    X   |
| bpy    | Bishnupriya Manipuri  |                |                   |                       |            |            |    X   |
| bs     | Bosnian               |                |                   |                       |            |            |    X   |
| br     | Breton                |                |                   |                       |            |            |    X   |
| bg     | Bulgarian             |                |                   |                       |            |            |    X   |
| my     | Burmese               |                |                   |                       |            |            |    X   |
| ca     | Catalan               |                |                   |           X           |            |            |    X   |
| ceb    | Cebuano               |                |                   |                       |            |            |    X   |
| ce     | Chechen               |                |                   |                       |            |            |    X   |
| zh     | Chinese (Simplified)  |        X       |         X         |           X           |            |      X     |    X   |
| zh     | Chinese (Traditional) |        X       |         X         |           X           |            |      X     |    X   |
| cv     | Chuvash               |                |                   |                       |            |            |    X   |
| hr     | Croatian              |                |                   |                       |            |            |    X   |
| cs     | Czech                 |                |                   |                       |            |      X     |    X   |
| da     | Danish                |                |         X         |           X           |            |            |    X   |
| nl     | Dutch                 |        X       |         X         |           X           |            |      X     |    X   |
| en     | English               |        X       |         X         |           X           |      X     |      X     |    X   |
| et     | Estonian              |                |                   |                       |            |            |    X   |
| fi     | Finnish               |                |                   |           X           |            |            |    X   |
| fr     | French                |        X       |         X         |           X           |            |      X     |    X   |
| gl     | Galician              |                |                   |                       |            |            |    X   |
| ka     | Georgian              |                |                   |                       |            |            |    X   |
| de     | German                |        X       |         X         |           X           |            |      X     |    X   |
| el     | Greek                 |                |                   |                       |            |            |    X   |
| gu     | Gujarati              |        X       |                   |                       |            |            |    X   |
| ht     | Haitian               |                |                   |                       |            |            |    X   |
| he     | Hebrew                |                |                   |                       |            |            |    X   |
| hi     | Hindi                 |        X       |         X         |           X           |            |            |    X   |
| hu     | Hungarian             |                |                   |                       |            |            |    X   |
| is     | Icelandic             |                |                   |                       |            |            |    X   |
| io     | Ido                   |                |                   |                       |            |            |    X   |
| id     | Indonesian            |                |         X         |                       |            |            |    X   |
| ga     | Irish                 |                |                   |                       |            |            |    X   |
| it     | Italian               |        X       |         X         |           X           |            |      X     |    X   |
| ja     | Japanese              |        X       |         X         |           X           |            |      X     |    X   |
| jv     | Javanese              |                |                   |                       |            |            |    X   |
| kn     | Kannada               |                |                   |                       |            |            |    X   |
| kk     | Kazakh                |                |                   |                       |            |            |    X   |
| ky     | Kirghiz               |                |                   |                       |            |            |    X   |
| ko     | Korean                |        X       |         X         |           X           |            |      X     |    X   |
| la     | Latin                 |                |                   |                       |            |            |    X   |
| lv     | Latvian               |                |                   |                       |            |            |    X   |
| lt     | Lithuanian            |                |                   |                       |            |            |    X   |
| lmo    | Lombard               |                |                   |                       |            |            |    X   |
| nds    | Low Saxon             |                |                   |                       |            |            |    X   |
| lb     | Luxembourgish         |                |                   |                       |            |            |    X   |
| mk     | Macedonian            |                |                   |                       |            |            |    X   |
| mg     | Malagasy              |                |                   |                       |            |            |    X   |
| ms     | Malay                 |                |                   |                       |            |            |    X   |
| ml     | Malayalam             |                |                   |                       |            |            |    X   |
| mr     | Marathi               |        X       |                   |                       |            |            |    X   |
| min    | Minangkabau           |                |                   |                       |            |            |    X   |
| mn     | Mongolian             |                |                   |                       |            |            |    X   |
| ne     | Nepali                |                |                   |                       |            |            |    X   |
| new    | Newar                 |                |                   |                       |            |            |    X   |
| nb     | Norwegian (Bokmål)    |                |         X         |           X           |            |            |    X   |
| nn     | Norwegian (Nynorsk)   |                |                   |                       |            |            |    X   |
| oc     | Occitan               |                |                   |                       |            |            |    X   |
| fa     | Persian (Farsi)       |                |                   |                       |            |            |    X   |
| pms    | Piedmontese           |                |                   |                       |            |            |    X   |
| pl     | Polish                |                |         X         |           X           |            |            |    X   |
| pt     | Portuguese            |        X       |         X         |           X           |            |      X     |    X   |
| pa     | Punjabi               |                |                   |                       |            |            |    X   |
| ro     | Romanian              |                |                   |                       |            |            |    X   |
| ru     | Russian               |                |         X         |           X           |            |            |    X   |
| sco    | Scots                 |                |                   |                       |            |            |    X   |
| sr     | Serbian               |                |                   |                       |            |            |    X   |
| hbs    | Serbo-Croatian        |                |                   |                       |            |            |    X   |
| scn    | Sicilian              |                |                   |                       |            |            |    X   |
| sk     | Slovak                |                |                   |                       |            |            |    X   |
| sl     | Slovenian             |                |                   |                       |            |            |    X   |
| az     | South Azerbaijani     |                |                   |                       |            |            |    X   |
| es     | Spanish               |        X       |         X         |           X           |            |      X     |    X   |
| su     | Sundanese             |                |                   |                       |            |            |    X   |
| sw     | Swahili               |                |                   |                       |            |            |    X   |
| sv     | Swedish               |                |         X         |           X           |            |            |    X   |
| tl     | Tagalog               |                |                   |                       |            |            |    X   |
| tg     | Tajik                 |                |                   |                       |            |            |    X   |
| ta     | Tamil                 |        X       |                   |                       |            |            |    X   |
| tt     | Tatar                 |                |                   |                       |            |            |    X   |
| te     | Telugu                |        X       |                   |                       |            |            |    X   |
| th     | Thai                  |                |         X         |                       |            |            |    X   |
| tr     | Turkish               |        X       |         X         |                       |            |            |    X   |
| uk     | Ukrainian             |                |         X         |                       |            |            |    X   |
| ur     | Urdu                  |                |                   |                       |            |            |    X   |
| uz     | Uzbek                 |                |                   |                       |            |            |    X   |
| vi     | Vietnamese            |                |                   |                       |            |            |    X   |
| vo     | Volapük               |                |                   |                       |            |            |    X   |
| war    | Waray-Waray           |                |                   |                       |            |            |    X   |
| cy     | Welsh                 |                |                   |                       |            |            |    X   |
| fy     | West Frisian          |                |                   |                       |            |            |    X   |
| pa     | Western Punjabi       |                |                   |                       |            |            |    X   |
| yo     | Yoruba                |                |                   |                       |            |            |    X   |


## Example with several languages

Example with three languages, where one of the language is klingon, to show that NLP will work even with    support of the language, because it will use tokenizer but not stemmers.

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
