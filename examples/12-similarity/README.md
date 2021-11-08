# @nlpjs/similarity examples

Those are examples to show how to use _@nlpjs/similarity_ package.

## 01 levenshtein
Shows the usage of the _leven_ function.

## 02 similarity
Shows the usage of the _similarity_ function. If _normalization_ is not provided, by default is false. Internally it uses _leven_ function.

## 03 spell-check
Shows the basic usage of _SpellCheck_ class.

## 04 spell-check-training
Shows the usage of _SpellCheck_ class learning frequencies of words from a book.

## 05 levenshtein-wa
Shows the usage of the _leven_ function on its WebAssembly implementation. See example 12 for a benchmark.

## 06 similarity-wa
Shows the usage of the _similarity_ function on its WebAssembly implementation. See example 12 for a benchmark. If _normalization_ is not provided, by default is false. Internally it uses _leven_ function.

## 07 spell-check-wa
Shows the basic usage of _SpellCheck_ class. Pending to be completed on WebAssembly

## 08 spell-check-trainig-wa
Shows the usage of _SpellCheck_ class learning frequencies of words from a book. Pending to be completed on WebAssembly.

## 09 similarity-benchmark
Runs a benchmark between _leven_ function implemented in JavaScript and implemented directly in WebAssembly. It currently checks the execution time of singe words, medium sized (200 chars) and long sized (10,000 chars) texts.
