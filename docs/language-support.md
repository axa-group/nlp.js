# Language Support

Any language is supported, even fantasy languages, but there are 27 languages with stemmer support. The difference between using an stemmer or only tokenization exists, but with a good training is not so big. You can take a look into [Benchmarking](docs/benchmarking.md). For english, using the SIGDIAL22 to compare, with stemmer the success is 94%, only with tokenization is 91%, so is good enough.

Inside Stemmers there are three type of stemmers: Natural, Snowball and Custom. Natural stemmers are these supported by the Natural library, while Snowball stemmers are the ported version from the Snowball ones from Java. Custom stemmers are those with custom development out of the scope of Natural or Snowball.

Inside Sentiment Analysis, there are three possible algoritms: AFINN, Senticon and Pattern.

## Classification 

| Language        | Natural | Snowball | Custom |
| :-------------- | :-----: | :------: | :----: |
| Arabic (ar)     |         |    X     |        |
| Armenian (hy)   |         |    X     |        |
| Basque (eu)     |         |    X     |        |
| Catalan (ca)    |         |    X     |        |
| Chinese (zh)    |         |          |   X    |
| Czech (cx)      |         |    X     |        |
| Danish (da)     |         |    X     |        |
| Dutch (nl)      |    X    |    X     |        |
| English (en)    |    X    |    X     |        |
| Farsi (fa)      |    X    |          |        |
| Finnish (fi)    |         |    X     |        |
| French (fr)     |    X    |    X     |        |
| German (de)     |         |    X     |        |
| Hungarian (hu)  |         |    X     |        |
| Indonesian (id) |    X    |          |        |
| Irish (ga)      |         |    X     |        |
| Italian (it)    |    X    |    X     |        |
| Japanese (ja)   |    X    |          |        |
| Norwegian (no)  |    X    |    X     |        |
| Portuguese (pt) |    X    |    X     |        |
| Romanian (ro)   |         |    X     |        |
| Russian (ru)    |    X    |    X     |        |
| Slovene (sl)    |         |    X     |        |
| Spanish (es)    |    X    |    X     |        |
| Swedish (sv)    |    X    |    X     |        |
| Tamil (ta)      |         |    X     |        |
| Turkish (tr)    |         |    X     |        |

## Sentiment Analysis

| Language        | AFINN | Senticon | Pattern |
| :-------------- | :---: | :------: | :-----: |
| Arabic (ar)     |       |          |         |
| Armenian (hy)   |       |          |         |
| Basque (eu)     |       |          |         |
| Catalan (ca)    |       |          |         |
| Chinese (zh)    |       |          |         |
| Czech (cs)      |       |          |         |
| Danish (da)     |       |          |         |
| Dutch (nl)      |       |          |    X    |
| English (en)    |   X   |    X     |    X    |
| Farsi (fa)      |       |          |         |
| Finnish (fi)    |       |          |         |
| French (fr)     |       |          |    X    |
| German (de)     |       |    X     |         |
| Hungarian (hu)  |       |          |         |
| Indonesian (id) |       |          |         |
| Irish (ga)      |       |          |         |
| Italian (it)    |       |          |    X    |
| Japanese (ja)   |       |          |         |
| Norwegian (no)  |       |          |         |
| Portuguese (pt) |       |          |         |
| Romanian (ro)   |       |          |         |
| Russian (ru)    |       |          |         |
| Slovene (sl)    |       |          |         |
| Spanish (es)    |   X   |    X     |         |
| Swedish (sv)    |       |          |         |
| Turkish (tr)    |       |          |         |
| Tamil (ta)      |       |          |         |

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
