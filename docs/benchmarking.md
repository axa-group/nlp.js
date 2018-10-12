# Benchmarking

## Introduction

This benchmark is done following the instructions at https://github.com/Botfuel/benchmark-nlp-2018/blob/master/README.md

3 corpus called `Chatbot`, `Ask Ubuntu` and `Web Applications` as described in the paper http://workshop.colips.org/wochat/@sigdial2017/documents/SIGDIAL22.pdf

The corpus can be found at json files at https://github.com/sebischair/NLU-Evaluation-Corpora

| corpus           | num of intents | train | test |
| ---------------- | -------------- | ----- | ---- |
| Chatbot          | 2              | 100   | 106  |
| Ask Ubuntu       | 5              | 53    | 109  |
| Web Applications | 8              | 30    | 59   |

For `Ask Ubuntu` and `Web Application` corpus, there is a specific `None` intent for sentences that should not be matched with the other intents.

The code using for the benchmark of NLP.js can be found at [`/examples/nlu-benchmark`](https://github.com/axa-group/nlp.js/tree/master/examples/nlu-benchmark)

## Intent classification results

We compute the `f1` score for each corpus and the overall `f1`:

| Platform\Corpus  | Chatbot | Ask Ubuntu | Web Applications | Overall |
| ---------------- | ------- | ---------- | ---------------- | ------- |
| NLP.js           | 0.99    | 0.94       | 0.80             | 0.93    |
| Watson           | 0.97    | 0.92       | 0.83             | 0.92    |
| Botfuel          | 0.98    | 0.90       | 0.80             | 0.91    |
| Luis             | 0.98    | 0.90       | 0.81             | 0.91    |
| Snips            | 0.96    | 0.83       | 0.78             | 0.89    |
| Recast           | 0.99    | 0.86       | 0.75             | 0.89    |
| RASA             | 0.98    | 0.86       | 0.74             | 0.88    |
| API (DialogFlow) | 0.93    | 0.85       | 0.80             | 0.87    |

