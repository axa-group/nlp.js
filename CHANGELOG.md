# Changelog
All notable changes to release of this project will be documented in this file.

For detailed change-info on the commit level please [see our GitHub commit history](https://github.com/axa-group/nlp.js/commits/master).

## [3.10.0] - 2019-10-07
### Added
- Traverse for handlebars, so answers now can be arrays or objects
- Automatic stemmer: is able to learn rules from languages without stemmer when the languages are inflected.
- Tests of the automatic stemmer in polish 
- Spell checking: now users can write with small typos
- Changelog
- Portuguese sentiment analysis
- Contributor pictures to the readme
- Bengali sentiment analysis

### Changed
- Faster Levenshtein implementation
- Now the browser version is generated with terser

### Fixed
- Extended NER to support datetimerange
- Sort classifications in the NER manager
- Use performance.now instead of process.hrtime for browser compatibility

## [3.9.0] - 2019-09-15
### Added
- Support for Ukrainian language
- Duckling support

### Changed
- General code cleanup removing dead & unused code from the project
- Dependencies have been updated
- README.md has been updated

### Fixed
- now using url.parse instead of new URL due to support of node version 8

## [3.8.0] - 2019-09-12
### Added
- Support for Bengali language
- Support for Greek language

## [3.7.2] - 2019-09-07
### Added
- Support for Thai language

## [3.7.1] - 2019-09-07
### Added
- Added examples for huge training (10k intents) and benchmark (Corpus50)

## [3.7.0] - 2019-09-05
### Added
- Improved false-positive avoidance
- Training of huge datasets is now feasible

## [3.5.2] - 2019-08-20
### Added
- English tokenizer has been improved

### Changed
- Dependencies have been updated
- Package lockfile (JS) has been updated
- README.md has been updated

### Fixed
- Various typos in the documentation
- Bugs regarding contraction

## [3.5.1] - 2019-08-09
### Added
- Model sizes has been significantly reduced

## [3.5.0] - 2019-08-09
### Added
- Emoji support 🥳
- Sentiment analysis for the following languages: Finish, Danish, Russian
- Added a "default" sentiment analysis

### Changed
- Documentation has been updated

## [3.4.0] - 2019-07-24
### Added
- Added a default intent and score when score is less than threshold
- Now uses decay learning rate 

### Changed
- Updated license in documentation
- Removed handlebars dependency
- Dependencies have been updated
- Adjustments to tests

## [3.2.1] - 2019-07-16
### Fixed
- Fixed an error that occured when retrieving entites from whitelist

## [3.1.1] - 2019-05-06
### Changed
- General performance update. Increaed performance over 3.1.0

## [3.1.0] - 2019-05-05
### Added
- Actions
- Japanase language stemmer

### Changed
- Now builds in node v12
- Dependencies have been updated
- Tweaked hyperparameters for best performance

### Fixed
- Issues with NLP Util tests have been fixed

## [3.0.2] - 2019-04-19
### Fixed
- "is Alphanumeric" should now work with all most commonly used charsets

## [3.0.1] - 2019-04-17
### Added
- The language guesser is now trained with the trigrams from the utterances used to train. That means that it has a best guess, and also that fictional languages can be guessed (example, klingon).
- Added Tagalog and Galician languages.

### Changed
-NlpClassifier no longer exists, in favor of NluManager as the manager of several NLU classes, and is able to manage several languages and several domains inside each language.
- Now by default, each domain of a language has it's own neural network classifier. When a language has more than 1 domain, a master neural network is trained that instead of classifying into the intent, classify into de domain. That way the models are faster to train and have a better score.
- The console-bot example training time in version 2.x in my laptop was 108 seconds, in the version 3.x the training time went down to 3 seconds, so the improvement in performance is notable.
- Size of the model.nlp files is decreased, the console-bot example went from 1614KB down to 928KB.
- The browser version has decreased from 5.08MB down to 2.3MB

## [2.5.2] - 2019-03-26
### Added
- Added multiple different score calculation methods when combining LRC and Neural

### Changed:
- Default threshold (ner-manager) is now 0.8

## [2.5.1] - 2019-03-07
### Added
- Reduced the filesizes of our sentiment resorces

### Changes
- Updated dependencies
- Fixed issues with getter

## [2.4.1] - 2019-01-30
### Changed
- Moved to brain.js version 1.6.0
- Minimized the browser bundle

## [2.4.0] - 2019-01-25
### Added
- Support for "any" language
- Better documentation regarding language support

## Fixed
- NLU benchmark run

## [2.3.2] - 2019-01-22
### Fixed
- Fixed a bug in the load/export and classification behaviour

## [2.3.1] - 2019-01-10
### Changed
- Moved to using a non-blocking trainAsync, preventing the event loop from being blocked
- Updted dependencies
- LRC has been removed from the list of supported classifiers
- Updated the classifier, manager & recognizer tests

### Fixed
- Fixed a bug where an error would be thrown when attempting to read the content's length in several stemmers
- Fixed various prettifier bugs

## [2.3.0] - 2018-11-26
### Added
- Test cases for the English aggresive tokenizer
- Smoth tests for the bayes classifier
- Now includes normalization tests for the following tokenizers: fr, it, nl, no, pl

### Changed
- Recognizer now recognizes microsoft bot framework v4 contexts

### Fixed
- Fixed bug prventing tests with istanbul frontend parts from running
- English stemmer is now always the default alternative stemmer
- English natural stemmer now always uses english aggresive tokenizer
- Fixed contractions in the English tokenizer

## [2.1.2] - 2018-10-28
### Added
- Naive Bayes Classifier

### Fixed
- Minor bugfixes in slot manager
- Fixed fails in the language guesser for the chinese language

## [2.1.0] - 2018-10-12
### Added
- Documentation for context, import and export
- Added new Binary Relevance Neural Network Classifier

## [2.0.4] - 2018-10-06
### Added
- Basic benchmarking support
- Codebase now has precommit hooks
- Created stemmers and tokenizers from Natural

### Changed
- NLP Classifier Train interface is now async
- Removed Natural

## [2.0.3] -  2018-10-03
### Added
- Built-in exctraction for Chinese
- Built-in exctraction for Japanese
- Documentation for Tamil language support
- npmignore no longer uploads docs or testing model.nlp
- Documentation for built-in entity extraction
- Method for entity extraction without intent recognition in NLP Manger

### Changed
- Upgraded Microsoft recognizer to version 1.1.3
- Tests changed from French to English

## [2.0.2] -  2018-09-22
### Added
- Tamil & Armenian language support

## [2.0.1] -  2018-09-21
### Added
- Catalan language
- Arabic stemmer & documentation

### Fixed
- Errors affecting certain German stems

## [2.0.0] -  2018-09-18
### Added
- Load and Save Trim Entities
- Adding coveralls to the repo
- Slot Filling
- Microsoft Bot Framework Recognizer with Slot Filling

