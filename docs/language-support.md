# Language Support

There are several languages supported. The language support can be for the Stemmers or for Sentiment Analysis.
Inside Stemmers there are three type of stemmers: Natural, Snowball and Custom. Natural stemmers are these supported by the Natural library, while Snowball stemmers are the ported version from the Snowball ones from Java. Custom stemmers are those with custom development out of the scope of Natural or Snowball.
Inside Sentiment Analysis, there are three possible algoritms: AFINN, Senticon and Pattern.

## Classification

| Language        | Natural | Snowball | Custom |
| :-------------- | :-----: | :------: | :----: |
| Chinese (zh)    |         |          |   X    |
| Danish (da)     |         |    X     |        |
| Dutch (nl)      |    X    |    X     |        |
| English (en)    |    X    |    X     |        |
| Farsi (fa)      |    X    |          |        |
| Finnish (fi)    |         |    X     |        |
| French (fr)     |    X    |    X     |        |
| German (de)     |         |    X     |        |
| Hungarian (hu)  |         |    X     |        |
| Indonesian (id) |    X    |          |        |
| Italian (it)    |    X    |    X     |        |
| Japanese (ja)   |    X    |          |        |
| Norwegian (no)  |    X    |    X     |        |
| Portuguese (pt) |    X    |    X     |        |
| Romanian (ro)   |         |    X     |        |
| Russian (ru)    |    X    |    X     |        |
| Spanish (es)    |    X    |    X     |        |
| Swedish (sv)    |    X    |    X     |        |
| Turkish (tr)    |         |    X     |        |

## Sentiment Analysis

| Language        | AFINN | Senticon | Pattern |
| :-------------- | :---: | :------: | :-----: |
| Chinese (zh)    |       |          |         |
| Danish (da)     |       |          |         |
| Dutch (nl)      |       |          |    X    |
| English (en)    |   X   |    X     |    X    |
| Farsi (fa)      |       |          |         |
| Finnish (fi)    |       |          |         |
| French (fr)     |       |          |    X    |
| German (de)     |       |    X     |         |
| Hungarian (hu)  |       |          |         |
| Indonesian (id) |       |          |         |
| Italian (it)    |       |          |    X    |
| Japanese (ja)   |       |          |         |
| Norwegian (no)  |       |          |         |
| Portuguese (pt) |       |          |         |
| Romanian (ro)   |       |          |         |
| Russian (ru)    |       |          |         |
| Spanish (es)    |   X   |    X     |         |
| Swedish (sv)    |       |          |         |
| Turkish (tr)    |       |          |         |

## Builtin Entity Extraction

| Builtin      | English | French | Spanish | Portuguese | Other |
| :----------- | :-----: | :----: | :-----: | :--------: | :---: |
| Email        |    X    |   X    |    X    |     X      |   X   |
| Ip           |    X    |   X    |    X    |     X      |   X   |
| Hashtag      |    X    |   X    |    X    |     X      |   X   |
| Phone Number |    X    |   X    |    X    |     X      |   X   |
| URL          |    X    |   X    |    X    |     X      |   X   |
| Number       |    X    |   X    |    X    |     X      | see 1 |
| Ordinal      |    X    |   X    |    X    |     X      |       |
| Percentage   |    X    |   X    |    X    |     X      | see 2 |
| Dimension    |    X    |   X    |    X    |     X      | see 3 |
| Age          |    X    |   X    |    X    |     X      |       |
| Currency     |    X    |   X    |    X    |     X      |       |
| Date         |    X    |   X    |    X    |     X      | see 4 |
| Duration     |    X    |        |         |            |       |

- 1: Only for non text numbers
- 2: Only for % symbol non text numbers
- 3: Only for dimension acronyms (km, s, km/h...) non text numbers
- 4: Only dd/MM/yyyy formats or similars, non text
