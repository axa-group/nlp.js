# Stopwords

There are plugins that removes stopwords from an array of tokens. Each language plugin provides it's own plugin with it's own list of stopwords.

## Default stopword removal

By default no stopwords removal is done, so no token is removed before training neither when processing an utterance to classify it.
This is because in tests with different corpus, it seems that the time performance is better removing stopwords (because that means less features at the training) but the accuracy was not so high as keeping the stopwords.

## How to activate stopword removal

You have two ways to do it.
The first one is to activate it by settings of "nlu". The default configuration of "nlu" is:

```javascript
    this.container.registerConfiguration(
      'nlu-??',
      {
        keepStopwords: true,
        nonefeatureValue: 1,
        nonedeltaMultiplier: 1.2,
        spellCheck: false,
        spellCheckDistance: 1,
        filterZeros: true,
        log: true,
      },
      false
    );
```

You can set it in the conf.json file, "nlu-??" name means that will be the fallback configuration for any language, if you want to set a config for a locale you can set it, example for english it's "nlu-en".
