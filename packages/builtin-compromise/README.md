# `builtin-compromise`

A golden entity extractor that runs in the browser.

Based on https://github.com/spencermountain/compromise

The Microsoft based builtins extractor only works for nodejs so this package is intended to provide golden entity extraction
where nlp.js is being used in a browser.

- Supports hashtags, person, place, organization ,email, phonenumber, date, url, number
- Supports multiple entities per utterance that are annotated as email_0, email_1


See compromise documentation for details.



## Usage

const {BuiltinCompromise} = require('@nlpjs/builtin-compromise')
const container = await containerBootstrap();
const builtin = new BuiltinCompromise({})
// if enable is set, only use the listed entity extractors
//const builtin = new BuiltinCompromise({enable:['hashtags', 'person', 'place', 'organization' ,'email', 'phonenumber', 'date', 'url', 'number','dimension']});
container.register('extract-builtin-??', builtin, true);
 
