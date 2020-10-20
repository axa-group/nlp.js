# @nlpjs/nlu examples

Those are examples to show how to use _@nlpjs/nlu_ package.

## 01 neural-nlu
Shows the usage of the _NluNeural_ class.
It trains and test an english corpus that contains 50 intents with 5 sentences per intent to train and 5 sentences to test.
It do it twice: one without using the tokenizer and stemmer for the language, and one registering the language as a plugin so the NLU will be able to use the correct tokenizer and stemmer. The objective of doing that twice, one without using the language tools and other using the language tools, is to measure the difference of Precision.

## 02 brain-nlu
Shows the usage of the _BrainNLU_ class.
It trains and test an english corpus that contains 50 intents with 5 sentences per intent to train and 5 sentences to test.
_BrainNLU_ internally is a _NluNeural_ instance with all languages registered.
