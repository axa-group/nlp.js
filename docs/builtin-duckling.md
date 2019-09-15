# Integration with Duckling

Instead of using the existing builtin entity extraction, you can integrate with duckling.

## Language support

Those are the languages supported using Duckling or not using it:

| Language      | Locale | Without Duckling | With Duckling |
| :------------ | :----: | :--------------: | :-----------: |
| Arabic        |   ar   |                  |       X       |
| Armenian      |   hy   |                  |               |
| Basque        |   eu   |                  |               |
| Bengali       |   bn   |                  |       X       |
| Catala        |   ca   |                  |               |
| Chinese       |   zh   |         X        |       X       |
| Czech         |   cs   |                  |       X       |
| Danish        |   da   |                  |       X       |
| Dutch         |   nl   |                  |       X       |
| English       |   en   |         X        |       X       |
| Farsi         |   fa   |                  |               |
| Finnish       |   fi   |                  |       X       |
| French        |   fr   |         X        |       X       |
| Galician      |   gl   |                  |               |
| German        |   de   |                  |       X       |
| Greek         |   el   |                  |       X       |
| Hindi         |   hi   |                  |       X       |
| Hungarian     |   hu   |                  |       X       |
| Indonesian    |   id   |                  |       X       |
| Italian       |   it   |                  |       X       |
| Irish         |   ga   |                  |       X       |
| Japanese      |   ja   |         X        |       X       |
| Norwegian     |   no   |                  |       X       |
| Portuguese    |   pt   |         X        |       X       |
| Romanian      |   ro   |                  |       X       |
| Russian       |   ru   |                  |       X       |
| Spanish       |   es   |         X        |       X       |
| Swedish       |   sv   |                  |       X       |
| Tamil         |   ta   |                  |       X       |
| Thai          |   th   |                  |       *1      |
| Tagalog       |   tl   |                  |               |
| Turkish       |   tr   |                  |       X       |
| Ukrainian     |   uk   |                  |       X       |

*1: Thai is not supported by duckling, but there exists a repo in github with an implementation of the thai rules of duckling: https://github.com/pantuwong/thai_duckling


## How to integrate with duckling

For this you'll need to have an instance of duckling up and running, and the integration is through the REST API.
You can go to the official Duckling page for instructions on how to run it: https://github.com/facebook/duckling

You can use duckling by setting the property ducklingUrl parameter of the NER settings:

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ ner: { ducklingUrl: 'https://ducklinghost/parse' } });
  manager.addLanguage(['en']);
  const result = await manager.process(
    'twenty five euros'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```

Also you can set the environment variable DUCKLING_URL with the URL and set the property useDuckling of the NER to true:

```javascript
const { NlpManager } = require('node-nlp');

(async () => {
  let manager = new NlpManager({ ner: { useDuckling: true } });
  manager.addLanguage(['en']);
  const result = await manager.process(
    'twenty five euros'
  );
  console.log(JSON.stringify(result, null, 2));
})();
```
