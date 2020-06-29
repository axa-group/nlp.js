# Example 80: Using BERT

## Introduction

This example show how to run a python API sharing BERT tokenizing so NLP.js can use it.

## Python app

For the python application you'll need to install python and the requirements provided in requirements.txt.
Then run:

```sh
python app.py
```

This will start a server at the port 8000 that provides a REST API that receives a sentence and tokenize it using the BERT large uncased whole work masking model, finetuned for squad.


## Node app

Once the python application is up and running, then run the node.js application:

```sh
node index.js
```

The most important part, is when creating the NLP Manager:

```javascript
  const manager = new NlpManager(options);
  manager.container.registerConfiguration('bert', {
    url: 'http://localhost:8000/tokenize',
    languages: ['en', 'es']
  });
  manager.container.use(LangBert);
```

We are giving to it a configuration for BERT, including the url of the service and also the languages that it should override from the native stemmers of NLP.js
For languages not supported natively by NLP.js, then BERT is used automatically if you provide a BERT configuration with the URL or you have the environment variable BERT_ENDPINT defined.

## Accuracy and performance

For languages natively supported by NLP.js, we recommend to use the the native support and no BERT because of this reasons:
- Accuracy will be lower
- The performance will decrese

In our benchmarks, for the same corpus:
- In english the analysis shows a 98.05% Precision using native NLP.js tokenizers and stemmers, 77.34% Precision for the same corpus using BERT tokenizer.
- In spanish the analysis shows a 97.66% Precision using native NLP.js tokenizers and stemmers, 88.28% Precision for the same corpus using BERT tokenizer.
- The transactions per second goes from 2300 using native NLP.js tokenizers and stemmers down to 219 using BERT tokenizer

## License

Copyright (c) AXA Group Operations Spain S.A.

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
