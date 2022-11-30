# Builtin Entity Extraction

For integration with duckling please visit [Builtin Duckling](builtin-duckling.md). Duckling support more languages, but you will need to have an instance of duckling up and running.

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
| Korean        |   ko   |                  |       X       |
| Lithuanian    |   lt   |                  |               |
| Malay         |   ms   |                  |       X       |
| Nepali        |   ne   |                  |       X       |
| Norwegian     |   no   |                  |       X       |
| Polish        |   pl   |                  |       X       |
| Portuguese    |   pt   |         X        |       X       |
| Romanian      |   ro   |                  |       X       |
| Russian       |   ru   |                  |       X       |
| Serbian       |   sr   |                  |               |
| Spanish       |   es   |         X        |       X       |
| Swedish       |   sv   |                  |       X       |
| Tamil         |   ta   |                  |       X       |
| Thai          |   th   |                  |       *1      |
| Tagalog       |   tl   |                  |               |
| Turkish       |   tr   |                  |       X       |
| Ukrainian     |   uk   |                  |       X       |

*1: Thai is not supported by duckling, but there exists a repo in github with an implementation of the thai rules of duckling: https://github.com/pantuwong/thai_duckling

The NER Manager includes by default a builtin entity extraction with different bundles available for different languages.
The entity extraction is done even if the utterance is not matched to an intent.

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

* [Email Extraction](#email-extraction)
* [IP Extraction](#ip-extraction)
* [Hashtag Extraction](#hashtag-extraction)
* [Phone Number Extraction](#phone-number-extraction)
* [URL Extraction](#url-extraction)
* [Number Extraction](#number-extraction)
* [Ordinal Extraction](#ordinal-extraction)
* [Percentage Extraction](#percentage-extraction)
* [Age Extraction](#age-extraction)
* [Currency Extraction](#currency-extraction)
* [Date Extraction](#date-extraction)
* [Duration Extraction](#duration-extraction)

## Email Extraction

It can identify and extract valid emails accounts, this works for any language.

```javascript
"utterance": "My email is something@somehost.com please write me",
"entities": [
  {
    "start": 12,
    "end": 33,
    "len": 22,
    "accuracy": 0.95,
    "sourceText": "something@somehost.com",
    "utteranceText": "something@somehost.com",
    "entity": "email",
    "resolution": {
      "value": "something@somehost.com"
    }
  }
]
```

## IP Extraction

It can identify and extract valid IPv4 and IPv6 addresses, this works for any language.

```javascript
"utterance": "My ip is 8.8.8.8",
"entities": [
  {
    "start": 9,
    "end": 15,
    "len": 7,
    "accuracy": 0.95,
    "sourceText": "8.8.8.8",
    "utteranceText": "8.8.8.8",
    "entity": "ip",
    "resolution": {
      "value": "8.8.8.8",
      "type": "ipv4"
    }
  }
]

"utterance": "My ip is ABEF:452::FE10",
"entities": [
  {
    "start": 9,
    "end": 22,
    "len": 14,
    "accuracy": 0.95,
    "sourceText": "ABEF:452::FE10",
    "utteranceText": "ABEF:452::FE10",
    "entity": "ip",
    "resolution": {
      "value": "ABEF:452::FE10",
      "type": "ipv6"
    }
  }
]
```

## Hashtag Extraction

It can identify and extract hashtags from the utterances, this works for any language.

```javascript
"utterance": "Open source is great! #proudtobeaxa",
"entities": [
  {
    "start": 22,
    "end": 34,
    "len": 13,
    "accuracy": 0.95,
    "sourceText": "#proudtobeaxa",
    "utteranceText": "#proudtobeaxa",
    "entity": "hashtag",
    "resolution": {
      "value": "#proudtobeaxa"
    }
  }
]
```

## Phone Number Extraction

It can identify and extract phone numbers from the utterances, this works for any language.

```javascript
"utterance": "So here is my number +1 541-754-3010 callme maybe",
"entities": [
  {
    "start": 21,
    "end": 35,
    "len": 15,
    "accuracy": 0.95,
    "sourceText": "+1 541-754-3010",
    "utteranceText": "+1 541-754-3010",
    "entity": "phonenumber",
    "resolution": {
      "value": "+1 541-754-3010"
    }
  }
]
```

## URL Extraction

It can identify and extract URLs from the utterances, this works for any language.

```javascript
"utterance": "The url is https://something.com",
"entities": [
  {
    "start": 11,
    "end": 31,
    "len": 21,
    "accuracy": 0.95,
    "sourceText": "https://something.com",
    "utteranceText": "https://something.com",
    "entity": "url",
    "resolution": {
      "value": "https://something.com"
    }
  }
]
```

## Number Extraction

It can identify and extract numbers. This works for any language, and the numbers can be integer or floats.

```javascript
"utterance": "This is 12",
"entities": [
  {
    "start": 8,
    "end": 9,
    "len": 2,
    "accuracy": 0.95,
    "sourceText": "12",
    "utteranceText": "12",
    "entity": "number",
    "resolution": {
      "strValue": "12",
      "value": 12,
      "subtype": "integer"
    }
  }
]
```

The numbers can be also be text written, but this only works for: English, French, Spanish and Portuguese.

```javascript
"utterance": "This is twelve",
"entities": [
  {
    "start": 8,
    "end": 13,
    "len": 6,
    "accuracy": 0.95,
    "sourceText": "twelve",
    "utteranceText": "twelve",
    "entity": "number",
    "resolution": {
      "strValue": "12",
      "value": 12,
      "subtype": "integer"
    }
  }
]
```

The text feature also works for fractions.

```javascript
"utterance": "one over 3",
"entities": [
  {
    "start": 0,
    "end": 9,
    "len": 10,
    "accuracy": 0.95,
    "sourceText": "one over 3",
    "utteranceText": "one over 3",
    "entity": "number",
    "resolution": {
      "strValue": "0.333333333333333",
      "value": 0.333333333333333,
      "subtype": "float"
    }
  }
]
```

## Ordinal Extraction

It can identify and extract ordinal numbers. This works only for English, Spanish, French and Portuguese.

```javascript
"utterance": "He was 2nd",
"entities": [
  {
    "start": 7,
    "end": 9,
    "len": 3,
    "accuracy": 0.95,
    "sourceText": "2nd",
    "utteranceText": "2nd",
    "entity": "ordinal",
    "resolution": {
      "strValue": "2",
      "value": 2,
      "subtype": "integer"
    }
  }
]
```

The numbers can be written by text.

```javascript
"utterance": "one hundred twenty fifth",
"entities": [
  {
    "start": 0,
    "end": 23,
    "len": 24,
    "accuracy": 0.95,
    "sourceText": "one hundred twenty fifth",
    "utteranceText": "one hundred twenty fifth",
    "entity": "ordinal",
    "resolution": {
      "strValue": "125",
      "value": 125,
      "subtype": "integer"
    }
  }
]
```

## Percentage Extraction

It can identify and extract percentages. If the percentage is indicated with the symbol % it works for any language.

```javascript
"utterance": "68.2%",
"entities": [
  {
    "start": 0,
    "end": 4,
    "len": 5,
    "accuracy": 0.95,
    "sourceText": "68.2%",
    "utteranceText": "68.2%",
    "entity": "percentage",
    "resolution": {
      "strValue": "68.2%",
      "value": 68.2,
      "subtype": "float"
    }
  }
]
```

The percentage can be indicated by text, but it only works for English, French, Spanish and Portuguese.

```javascript
"utterance": "68.2 percent",
"entities": [
  {
    "start": 0,
    "end": 11,
    "len": 12,
    "accuracy": 0.95,
    "sourceText": "68.2 percent",
    "utteranceText": "68.2 percent",
    "entity": "percentage",
    "resolution": {
      "strValue": "68.2%",
      "value": 68.2,
      "subtype": "float"
    }
  }
]
```

It can understand text numbers but only works for English, French, Spanish and Portuguese.

```javascript
"utterance": "thirty five percentage",
"entities": [
  {
    "start": 0,
    "end": 21,
    "len": 22,
    "accuracy": 0.95,
    "sourceText": "thirty five percentage",
    "utteranceText": "thirty five percentage",
    "entity": "percentage",
    "resolution": {
      "strValue": "35%",
      "value": 35,
      "subtype": "integer"
    }
  }
]
```

## Dimension Extraction

It can identify and extract different dimensions, like length, distance, speed, volume, area,... If the international acronym of the dimension is used then it works in any language.

```javascript
"utterance": "120km",
"entities": [
  {
    "start": 0,
    "end": 4,
    "len": 5,
    "accuracy": 0.95,
    "sourceText": "120km",
    "utteranceText": "120km",
    "entity": "dimension",
    "resolution": {
      "strValue": "120",
      "value": 120,
      "unit": "Kilometer",
      "localeUnit": "Kilometer"
    }
  }
]
```

In instead of the acronym, the text of the dimension is used in a language, then it works in English, French, Spanish and Portuguese.

```javascript
"utterance": "Está a 325 kilómetros de Bucarest",
"entities": [
  {
    "start": 7,
    "end": 20,
    "len": 14,
    "accuracy": 0.95,
    "sourceText": "325 kilómetros",
    "utteranceText": "325 kilómetros",
    "entity": "dimension",
    "resolution": {
      "strValue": "325",
      "value": 325,
      "unit": "Kilometer",
      "localeUnit": "Kilómetro"
    }
  }
]
```

## Age Extraction

It can identify and extract ages. It works in English, French, Spanish and Portuguese.
Take into account that several ways to say an age can be also confused with a duraction ("It will be 10 years" can be an age or a duration), so two overlaped entities, one age and one duration, can be returned.

```javascript
"utterance": "This saga is ten years old",
"entities": [
  {
    "start": 13,
    "end": 25,
    "len": 13,
    "accuracy": 0.95,
    "sourceText": "ten years old",
    "utteranceText": "ten years old",
    "entity": "age",
    "resolution": {
      "strValue": "10",
      "value": 10,
      "unit": "Year",
      "localeUnit": "Year"
    }
  },
  {
    "start": 13,
    "end": 21,
    "len": 9,
    "accuracy": 0.95,
    "sourceText": "ten years",
    "utteranceText": "ten years",
    "entity": "duration",
    "resolution": {
      "values": [
        {
          "timex": "P10Y",
          "type": "duration",
          "value": "315360000"
        }
      ]
    }
  }
]
```

## Currency Extraction

It can identify and extract currency values. It works in English, French, Spanish and Portuguese.

```javascript
"utterance": "420 million finnish markka",
"entities": [
  {
    "start": 0,
    "end": 25,
    "len": 26,
    "accuracy": 0.95,
    "sourceText": "420 million finnish markka",
    "utteranceText": "420 million finnish markka",
    "entity": "currency",
    "resolution": {
      "strValue": "420000000",
      "value": 420000000,
      "unit": "Finnish markka",
      "localeUnit": "Finnish markka"
    }
  }
]
```

It the used language is not english, the localeUnit contains the locale name of the currency.

```javascript
"utterance": "420 millones de marcos finlandeses",
"entities": [
  {
    "start": 0,
    "end": 33,
    "len": 34,
    "accuracy": 0.95,
    "sourceText": "420 millones de marcos finlandeses",
    "utteranceText": "420 millones de marcos finlandeses",
    "entity": "currency",
    "resolution": {
      "strValue": "420000000",
      "value": 420000000,
      "unit": "Finnish markka",
      "localeUnit": "Marco finlandés"
    }
  }
]
```

## Date Extraction

It can identify and extract dates, if provided in numeric format can work in any language, but take into account that the localization also affect to the date format.

```javascript
"utterance": "28/10/2018",
"entities": [
  {
    "start": 0,
    "end": 9,
    "len": 10,
    "accuracy": 0.95,
    "sourceText": "28/10/2018",
    "utteranceText": "28/10/2018",
    "entity": "date",
    "resolution": {
      "type": "date",
      "timex": "2018-10-28",
      "strValue": "2018-10-28",
      "date": "2018-10-28T00:00:00.000Z"
    }
  }
]
```

It can understand written date formats in English, French, Spanish and Portuguese.

```javascript
"utterance": "Volveré el 12 de enero del 2019",
"entities": [
  {
    "start": 11,
    "end": 30,
    "len": 20,
    "accuracy": 0.95,
    "sourceText": "12 de enero del 2019",
    "utteranceText": "12 de enero del 2019",
    "entity": "date",
    "resolution": {
      "type": "date",
      "timex": "2019-01-12",
      "strValue": "2019-01-12",
      "date": "2019-01-12T00:00:00.000Z"
    }
  }
]
```

It can understand partial dates. Then the timex contains the resolution, example, if I provide the day but not the month neither the year, then both year and month will be filled with X. Also, in this case, two possible dates will be returned: the past and the future. Also take into account that in cases like that, the resolution can also include a number, like in this example:

```javascript
"utterance": "I'll go back on 15",
"entities": [
  {
    "start": 16,
    "end": 17,
    "len": 2,
    "accuracy": 0.95,
    "sourceText": "15",
    "utteranceText": "15",
    "entity": "number",
    "resolution": {
      "strValue": "15",
      "value": 15,
      "subtype": "integer"
    }
  },
  {
    "start": 16,
    "end": 17,
    "len": 2,
    "accuracy": 0.95,
    "sourceText": "15",
    "utteranceText": "15",
    "entity": "date",
    "resolution": {
      "type": "interval",
      "timex": "XXXX-XX-15",
      "strPastValue": "2018-08-15",
      "pastDate": "2018-08-15T00:00:00.000Z",
      "strFutureValue": "2018-09-15",
      "futureDate": "2018-09-15T00:00:00.000Z"
    }
  }
]
```

When the grain resolution is not a day, it can be resolved not only with a past and future date, but also each date is an interval. Example: if we are resolving a date that is a month, like January, it will return the past and future januaries, but also each january is an interval from the day 1 of January until the day 1 of February, like in this example:

```javascript
"utterance": "I'll be out in Jan",
"entities": [
  {
    "start": 15,
    "end": 17,
    "len": 3,
    "accuracy": 0.95,
    "sourceText": "Jan",
    "utteranceText": "Jan",
    "entity": "daterange",
    "resolution": {
      "type": "interval",
      "timex": "XXXX-01",
      "strPastStartValue": "2018-01-01",
      "pastStartDate": "2018-01-01T00:00:00.000Z",
      "strPastEndValue": "2018-02-01",
      "pastEndDate": "2018-02-01T00:00:00.000Z",
      "strFutureStartValue": "2019-01-01",
      "futureStartDate": "2019-01-01T00:00:00.000Z",
      "strFutureEndValue": "2019-02-01",
      "futureEndDate": "2019-02-01T00:00:00.000Z"
    }
  }
]
```

It also identifies expecial dates, like Christmas:

```javascript
"utterance": "I will return in Christmas",
"entities": [
  {
    "start": 17,
    "end": 25,
    "len": 9,
    "accuracy": 0.95,
    "sourceText": "Christmas",
    "utteranceText": "Christmas",
    "entity": "date",
    "resolution": {
      "type": "interval",
      "timex": "XXXX-12-25",
      "strPastValue": "2017-12-25",
      "pastDate": "2017-12-25T00:00:00.000Z",
      "strFutureValue": "2018-12-25",
      "futureDate": "2018-12-25T00:00:00.000Z"
    }
  }
]
```

## Duration Extraction

It can identify and extract duration intervals. It works currently in English only. The resolution is done in seconds, with a timex indicator. Example: "It will take me 5 minutes" the timex is "PT5M" meaning "Present Time 5 Minutes".

```javascript
"utterance": "It will take me 5 minutes",
"entities": [
  {
    "start": 13,
    "end": 21,
    "len": 9,
    "accuracy": 0.95,
    "sourceText": "5 minutes",
    "utteranceText": "5 minutes",
    "entity": "duration",
    "resolution": {
      "values": [
        {
          "timex": "PT5M",
          "type": "duration",
          "value": "300"
        }
      ]
    }
  }
]
```
