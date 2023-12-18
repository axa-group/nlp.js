# NER Manager

The Named Entity Recognition manager is able to store an structure of entities and options of the entity for each language.
Then, given an utterance and the language, is able to search the options of the entity inside the utterance, and return a list
of the bests substrings. This is done using a threshold for the accuracy, by default the accuracy is 0.8 but you can provide it in the options when creating the instance.

## Entity extraction

nlp.js supports the definition of entities that are then parsed out of the text automatically and can be used in answers and in [slot filling](./slot-filling.md).

There are different entity types that can be defined and that are parsed in the following order:

1. [Enum entities](#enum-entities)
2. [Regex entities](#regex-entities)
3. [Trim entities](#trim-entities)
4. [Built-in entities](#built-in-entities)

After them being parsed another check is running to detect duplicates and overlapping entities. These are then cleaned up based on their accuracy and type.

The parsing also supports repeating entities of the same type in an utterance. These are then returned as list and get aliases with like `${entityName}_${integer}`. E.g. "hero\_0", "food\_1", etc.

## Enum entities

Enum entities allow to define a list of words that match a certain entity option.

Entity options can be defined in the corpus file by providing a top level "entities" property

```json
{
    ...,
    "entities": {
        "hero": {
            "options": {
                "spiderman": [
                    "Spider-man",
                    "spiderman"
                ],
                "iron man": [
                    "iron man",
                    "ironman",
                    "iron-man"
                ],
                "thor": [
                    "thor"
                ]
            }
        },
        "food": {
            "options": {
                "burguer": [
                    "Burguer"
                ],
                "pizza": [
                    "Pizza"
                ],
                "pasta": [
                    "Spaghetti",
                    "Pasta"
                ]
            }
        }
    },
    ...
}
```

or in JavaScript

```javascript
const manager = dock.get('nlp');
manager.addNerRuleOptionTexts('en', 'hero', 'spiderman', ["Spider-man", "spiderman"]);
manager.addNerRuleOptionTexts('en', 'hero', 'iron man', ["iron man", "ironman", "iron-man"]);
manager.addNerRuleOptionTexts('en', 'hero', 'thor', ["thor"]);
```

The matched entities is then returned with the "option", but also the matched text and type "enum". When entries were repeated they have a number-postfixed alias.

```json
"entities": [
    {
      "start": 6,
      "end": 14,
      "len": 9,
      "levenshtein": 0,
      "accuracy": 1,
      "entity": "hero",
      "type": "enum",
      "option": "spiderman",
      "sourceText": "spiderman",
      "utteranceText": "spiderman",
      "alias": "hero_0"
    },
    {
      "start": 30,
      "end": 36,
      "len": 7,
      "levenshtein": 0,
      "accuracy": 1,
      "entity": "hero",
      "type": "enum",
      "option": "iron man",
      "sourceText": "ironman",
      "utteranceText": "ironman",
      "alias": "hero_1"
    }
  ],
```

## Regex entities

You can also define regex to parse out what you need.

Configuration in corpus is done by just providing the Regex as string, like

```json
{
    ...,
    "entities": {
        "ownEmail": "/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi"
    },
    ...
}
```

or in JavaScript

```javascript
const manager = dock.get('nlp');
manager.addNerRegexRule('en', 'ownEmail', '/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi');
```

Result could look like

```javascript
//   { start: 61,
//     end: 80,
//     accuracy: 1,
//     sourceText: 'spiderman@gmial.com',
//     utteranceText: 'spiderman@gmial.com',
//     entity: 'email' }
```

## Trim entities

It is also possible to cut the entity value out of the text by providing words and rules. The following trim rule types are available:

* **between**: Allows to define a list of words before and after the extracted text and cuts the "longest" text between those words.
* **betweenLast**: Allows to define a list of words before and after the extracted text and cuts the most last text between those words.
* **before**: Allows to define a list of words before the extracted text and cuts the text before those words. Can lead to multiple results
* **beforeFirst** Allows to define a list of words before the extracted text and cuts the first match.
* **beforeLast** Allows to define a list of words before the extracted text and cuts the last match.
* **after**: Allows to define a list of words after the extracted text and cuts the text after those words. Can lead to multiple results
* **afterFirst** Allows to define a list of words after the extracted text and cuts the first match.
* **afterLast** Allows to define a list of words after the extracted text and cuts the last match.

The following options are supported and can be provided as "opts" property:
* caseSensitive: Defines if the word matching is done case sensitive or not. true or false, default is false
* noSpaces: Defines if the word matching is done on words (with spaces before and after the given word) or just the tesxt is matched. true or false, default is false
* skip: Defines an array of words that should be skipped when matching.

The json below shows for two examples how it can be configured in the corpus:

```json
{
    ...,
    "entities": {
        "fromCity": {
            "trim": [
                {
                    "position": "betweenLast",
                    "leftWords": ["from"],
                    "rightWords": ["to"],
                    "opts": {
                        "caseSensitive": true
                    }
                },
                {
                    "position": "afterLast",
                    "words": ["from"]
                }
            ]
        }
    },
    ...
}
```

In JavaScript also method are available like

```javascript
manager.addNerBetweenLastCondition('en', 'fromCity', ['from'], ['to']);
manager.addNerAfterLastCondition('en', 'fromCity', ['from']);
```

## Built-in entities

Additionally to the entities you can define manually the framework can also parse out some built-in entities automatically using plugins. What is supported and to which level in which language depends on the chosen Builtin plugin.

* [Builtin Compromise](../../packages/builtin-compromise/README.md) - A golden entity extractor that runs in the browser.
* [Builtin Default](../../packages/builtin-default/README.md) - A default entity extractor for some basic entity extractions
* [BuiltIn-Microsoft](../v3/builtin-entity-extraction.md) - This builtin is executed on server side in Node.js, but does not support all languages
* [Facebook Duckling](../v3/builtin-duckling.md) - This builtin forwards the call to a running instance of a Duckling server process.

The Builtin needs to added manually depending on what's wanted. As example for Facebook Duckling this can look like:

```javascript
const { dockStart } = require('@nlpjs/basic');

(async () => {
    const dock = await dockStart({
        settings: {
            'builtin-duckling': {
                ducklingUrl: 'http://localhost:8000/parse'
            },
        },
        use: ['Basic', 'BuiltinDuckling', 'LangEn'],
    });

    // Register Builtins to parse dates automatically
    // Register Ducking Builtins
    const builtin = dock.get('builtin-duckling');
    const ner = dock.get('ner');
    ner.container.register('extract-builtin-??', builtin, true);

    ...
})();
```
The code looks comparable for the other Builtin extractors. You can also specify which extractor is used for which language by registering specific extractors with the language instead the "??". 

In the returned result JSON the "sourceEntities" as returned by the plugins are included as well as mapped "entities". For an example see [Slot Filling examples](./slot-filling.md) 

## Utterances with duplicated Entities

Utterances with more than one entity with the same name are supported, providing an "allow list" with numbered entity names.

The "numbered entity" format must be in the form `${entityName}_${integer}`. E.g. "hero\_1", "food\_2", etc.

For more details also see the [Slot Filling documentation](./slot-filling.md#entities-with-the-same-name).

## Matching accuracy Threshold

NER accepts a threshold, by default is 0.8, to allow users to make mistakes when writing, so "Bracelona" will be understood as "Barcelona". But this implementation uses levenshtein distance, and this makes the time exponential based on the amount of entities and length of the sentence.

If the threshold is 1, then it uses a dictionary and not levenshtein, and even 1 million of entity values is resolved in milliseconds.

To set the threshold you simply set it in the NLP Manager configuration

```json
{
    ...,
    ner: { 
        threshold: 1
    },
}
```
