NLP.js
=======

[![Build Status](https://travis-ci.com/axa-group/nlp.js.svg?branch=master)](https://travis-ci.com/axa-group/nlp.js)

"NLP.js" is a general natural language utilities for nodejs. Currently supporting:
- Guess the language of a phrase
- Fast levenshtein distance of two strings
- Search the best substring of a string with less levenshtein distance to a given pattern.
- Get stemmers and tokenizers for several languages.
- Sentiment Analysis for phrases (with negation support).
- Named Entity Recognition and management, multilanguage, and accepting similar strings, so the introduced text does not need to be exact.
- Natural Language Processing Classifier, to classify utterance into intents.
- Natural Language Generation Manager, so from intents and conditions it can generate an answer.
- NLP Manager: a tool able to manage several languages, the Named Entities for each language, the utterance and intents for the training of the classifier, and for a given utterance return the entity extraction, the intent classification and the sentiment analysis. Also, it is able to maintain a Natural Language Generation Manager for the answers.

### TABLE OF CONTENTS

<!--ts-->

- [Installation](docs/installation.md)
- [Example of use](docs/example-of-use.md)
- [Language Support](docs/language-support.md)
- [Language Guesser](docs/language-guesser.md)
- [Similar Search](docs/similar-search.md)
- [NLP Classifier](docs/nlp-classifier.md)
- [NER Manager](docs/ner-manager.md)
- [Builtin Entity Extraction](docs/builtin-entity-extraction.md)
  - [Email Extraction](docs/builtin-entity-extraction.md#email-extraction)
  - [IP Extraction](docs/builtin-entity-extraction.md#ip-extraction)
  - [Hashtag Extraction](docs/builtin-entity-extraction.md#hashtag-extraction)
  - [Phone Number Extraction](docs/builtin-entity-extraction.md#phone-number-extraction)
  - [URL Extraction](docs/builtin-entity-extraction.md#url-extraction)
  - [Number Extraction](docs/builtin-entity-extraction.md#number-extraction)
  - [Ordinal Extraction](docs/builtin-entity-extraction.md#ordinal-extraction)
  - [Percentage Extraction](docs/builtin-entity-extraction.md#percentage-extraction)
  - [Age Extraction](docs/builtin-entity-extraction.md#age-extraction)
  - [Currency Extraction](docs/builtin-entity-extraction.md#currency-extraction)
  - [Date Extraction](docs/builtin-entity-extraction.md#date-extraction)
  - [Duration Extraction](docs/builtin-entity-extraction.md#duration-extraction)
- [Sentiment Analysis](docs/sentiment-analysis.md)
- [NLP Manager](docs/nlp-manager.md)
- [Loading from Excel](docs/loading-from-excel.md)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Who is behind it](#who-is-behind-it)
- [License](#license.md)
  <!--te-->

## Contributing

You can read the guide of how to contribute at [Contributing](https://github.com/axa-group/nlp.js/blob/master/CONTRIBUTING.md).

## Code of Conduct

You can read the Code of Conduct at [Code of Conduct](https://github.com/axa-group/nlp.js/blob/master/CODE_OF_CONDUCT.md).

## Who is behind it?

This project is developed by AXA Shared Services Spain S.A.

If you need to contact us, you can do it at the email jesus.seijas@axa-groupsolutions.com

## License

Copyright (c) AXA Shared Services Spain S.A.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
