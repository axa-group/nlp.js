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

## 03 domain-manager
Shows the usage of the _DomainManager_ class.
It classifies not only to intent, but also has the concept of _domain_, so every intent belongs to a domain and the result contains both intent and domain. 
In this example, all intents and domains are trained in a single model.

## 04 domain-manager-by-domain
Shows the usage of the _DomainManager_ class training by domain, that means that every domain is trained in a separate model, and there exists a master model that classifies an utterance into a domain.
This is done by providing the setting _trainByDomain_ with value _true_ at the constructor of _DomainManager_

## 05 nlu-manager
Shows the usage of the _NluManager_ class.
The _NluManager_ is able to contain several _DomainManager_ instances, one per language.
That way the structure is that _NluManager_ contains several languages, each language has a _DomainManager_ that is able to manage several domains per language.
Also, _NluManager_ is able to process sentences without specifying the language, and internally it guess the language.

## 06 nlu-manager-by-domain
Shows the usage of the _NluManager_ class training by domain.
It's the same example as the previous one but training by domain. That means that 6 models will be trained:
- English personality
- English food
- English master (classify into domain personality or food)
- Spanish personality
- Spanish food
- Spanish master (classify into domain personality or food)
