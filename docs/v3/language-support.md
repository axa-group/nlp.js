# Language Support

Any language is supported, even fantasy languages, but there are 30 languages with stemmer support. The difference between using an stemmer or only tokenization exists, but with a good training is not so big. You can take a look into [Benchmarking](docs/benchmarking.md). For english, using the SIGDIAL22 to compare, with stemmer the success is 94%, only with tokenization is 91%, so is good enough.

Inside Stemmers there are three type of stemmers: Natural, Snowball and Custom. Natural stemmers are these supported by the Natural library, while Snowball stemmers are the ported version from the Snowball ones from Java. Custom stemmers are those with custom development out of the scope of Natural or Snowball.

Inside Sentiment Analysis, there are three possible algoritms: AFINN, Senticon and Pattern.

## Classification 

| Language        | Natural | Snowball | Custom |
| :-------------- | :-----: | :------: | :----: |
| Arabic (ar)     |         |    X     |        |
| Armenian (hy)   |         |    X     |        |
| Basque (eu)     |         |    X     |        |
| Bengali (bn)    |         |          |   X
| Catalan (ca)    |         |    X     |        |
| Chinese (zh)    |         |          |   X    |
| Czech (cx)      |         |    X     |        |
| Danish (da)     |         |    X     |        |
| Dutch (nl)      |    X    |    X     |        |
| English (en)    |    X    |    X     |        |
| Farsi (fa)      |    X    |          |        |
| Finnish (fi)    |         |    X     |        |
| French (fr)     |    X    |    X     |        |
| Galician (gl)   |         |          |   X    |
| German (de)     |         |    X     |        |
| Greek (el)      |         |          |   X    |
| Hindi (hi)      |         |          |   X    |
| Hungarian (hu)  |         |    X     |        |
| Indonesian (id) |    X    |          |        |
| Irish (ga)      |         |    X     |        |
| Italian (it)    |    X    |    X     |        |
| Japanese (ja)   |    X    |          |        |
| Korean (ko)     |         |          |   X    |
| Lithuanian (lt) |         |    X     |        |
| Malay (ms)      |    X    |          |        |
| Nepali (ne)     |         |    X     |        |
| Norwegian (no)  |    X    |    X     |        |
| Polish (pl)     |         |          |   X    |
| Portuguese (pt) |    X    |    X     |        |
| Romanian (ro)   |         |    X     |        |
| Russian (ru)    |    X    |    X     |        |
| Serbian (sr)    |         |    X     |        |
| Slovene (sl)    |         |    X     |        |
| Spanish (es)    |    X    |    X     |        |
| Swedish (sv)    |    X    |    X     |        |
| Tagalog (tl)    |         |          |   X    |
| Tamil (ta)      |         |    X     |        |
| Thai (th)       |         |          |   X    |
| Turkish (tr)    |         |    X     |        |
| Ukrainian (uk)  |         |          |   X    |

## Sentiment Analysis

| Language        | AFINN | Senticon | Pattern |
| :-------------- | :---: | :------: | :-----: |
| Arabic (ar)     |       |          |         |
| Armenian (hy)   |       |          |         |
| Basque (eu)     |       |    X     |         |
| Bengali (bn)    |   X   |          |         |
| Catalan (ca)    |       |    X     |         |
| Chinese (zh)    |       |          |         |
| Czech (cs)      |       |          |         |
| Danish (da)     |   X   |          |         |
| Dutch (nl)      |       |          |    X    |
| English (en)    |   X   |    X     |    X    |
| Farsi (fa)      |       |          |         |
| Finnish (fi)    |   X   |          |         |
| French (fr)     |       |          |    X    |
| Galician (gl)   |       |    X     |         |
| German (de)     |       |    X     |         |
| Greek (el)      |       |          |         |
| Hindi (hi)      |       |          |         |
| Hungarian (hu)  |       |          |         |
| Indonesian (id) |       |          |         |
| Irish (ga)      |       |          |         |
| Italian (it)    |       |          |    X    |
| Japanese (ja)   |       |          |         |
| Korean (ko)     |       |          |         |
| Lithuanian (lt) |       |          |         |
| Malay (ms)      |       |          |         |
| Nepali (ne)     |       |          |         |
| Norwegian (no)  |       |          |         |
| Portuguese (pt) |   X   |          |         |
| Polish (pl)     |       |          |         |
| Romanian (ro)   |       |          |         |
| Russian (ru)    |   X   |          |         |
| Serbian (sr)    |       |          |         |
| Slovene (sl)    |       |          |         |
| Spanish (es)    |   X   |    X     |         |
| Swedish (sv)    |       |          |         |
| Tagalog (tl)    |       |          |         |
| Tamil (ta)      |       |          |         |
| Thai (th)       |       |          |         |
| Turkish (tr)    |       |          |         |
| Ukrainian (uk)  |       |          |         |

## Builtin Entity Extraction

| Builtin      | English | French | Spanish | Portuguese | Chinese | Japanese | Other |
| :----------- | :-----: | :----: | :-----: | :--------: | :-----: | :------: | :---: |
| Email        |    X    |   X    |    X    |     X      |    X    |   X      |   X   |
| Ip           |    X    |   X    |    X    |     X      |    X    |   X      |   X   |
| Hashtag      |    X    |   X    |    X    |     X      |    X    |   X      |   X   |
| Phone Number |    X    |   X    |    X    |     X      |    X    |   X      |   X   |
| URL          |    X    |   X    |    X    |     X      |    X    |   X      |   X   |
| Number       |    X    |   X    |    X    |     X      |    X    |   X      | see 1 |
| Ordinal      |    X    |   X    |    X    |     X      |    X    |   X      |       |
| Percentage   |    X    |   X    |    X    |     X      |    X    |   X      | see 2 |
| Dimension    |    X    |   X    |    X    |     X      |    X    |   X      | see 3 |
| Age          |    X    |   X    |    X    |     X      |    X    |   X      |       |
| Currency     |    X    |   X    |    X    |     X      |    X    |   X      |       |
| Date         |    X    |   X    |    X    |     X      |  see 4  | see 4    | see 4 |
| Duration     |    X    |        |         |            |         |          |       |

- 1: Only for non text numbers
- 2: Only for % symbol non text numbers
- 3: Only for dimension acronyms (km, s, km/h...) non text numbers
- 4: Only dd/MM/yyyy formats or similars, non text

## Auto Stemmer

Previously, if we wanted to score a corpus in a language which stemmer is not yet implemented (you can see the list of current stemmers [here](https://github.com/axa-group/nlp.js/tree/master/lib/nlp/stemmers)), we had to use a `Token Stemmer`. For instance, Polish:

```javascript
const stemmer = new TokenStemmer(NlpUtil.getTokenizer("pl"));

const managerTokenizer = new NlpManager({
  languages: ["pl"],
  nlu: { useStemDict: false, log: false, useNoneFeature: true, stemmer },
  ner: { builtins: [] }
});

scoreCorpus(corpus, managerTokenizer);
// 0.59765625
```

But how to stem word without knowing the rules of a language? Sometimes reducing a word to its stem can be very complex, because of the morphology of the language. In languages with very little inflection like English, the stem is usually not distinct from the "normal" form of the word, so the process of stemming is quite trivial.

But it's not the case of highly inflected languages (most of the Indo-European languages), because their words can be composed with one or more morphemes to assign grammatical properties, making the stems very different from the root word.

The goal of the Auto Stemmer is to automatically learn how to stem that highly inflected languages. For this, the Auto Stemmer will try to learn which are the potential suffixes of a language according to the training corpus, and then find out the part of each word that never changes whoch will be considered as the stem of the word.

### Example: Polish Auto-Stemmer

As told before, we can take advantage of the Auto-Stemmer to learn automatically the rules of Polish from the training corpus:

```javascript
/*

  If no stemmer is provided to NlpManager, an AutoStemmer instance according to the locale provided is created internally in NlpUtil.autoStemmers object.

  NlpUtil.autoStemmers['pl'] = new AutoStemmer(NlpUtil.getTokenizer('pl'));

*/

const managerTokenizer = new NlpManager({
  languages: ["pl"],
  nlu: { useStemDict: false, log: false, useNoneFeature: true },
  ner: { builtins: [] }
});

scoreCorpus(corpus, managerTokenizer);
// 0.81640625,
```

That's how you can build a stemmer from an unknown language. Still not the perfect stemmer for the specific language, but you can obtain better results.

You can run the test [here](https://github.com/axa-group/nlp.js/blob/master/test/nlp/stemmers/auto-stemmer.test.js).
