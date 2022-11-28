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
| NLP.js (no stem) | 1.00    | 0.92       | 0.73             | 0.91    |
| Snips            | 0.96    | 0.83       | 0.78             | 0.89    |
| Recast           | 0.99    | 0.86       | 0.75             | 0.89    |
| RASA             | 0.98    | 0.86       | 0.74             | 0.88    |
| API (DialogFlow) | 0.93    | 0.85       | 0.80             | 0.87    |

You can se two entries for NLP.js, the best one is using stemmer the other one is only by using the tokenizer and the artificial intelligence. This is added because there are 27 languages supported with stemmers, but any other language is supported using only the tokenizer, but the result is good enough, in fact in english is at the middle of the table, being better than other systems that use more advanced methods than tokenization.

<div align="center">
<img src="https://github.com/axa-group/nlp.js/raw/master/screenshots/benchmark.png" width="auto" height="auto"/>
</div>


## Full data by system

### NLP.js

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
| chatbot |	FindConnection | 70 | 0 | 1	| 0,986 |	1     | 0,993 |
| chatbot |	DepartureTime	 | 35	| 1	| 0	| 1	    | 0,972 | 0,986 |
| askUbuntu | Software Recommendation | 35 | 1 | 4 | 0,897 | 0,972 | 0,933 |
| askUbuntu | None | 3 | 1 | 2 | 0,6 | 0,75 | 0,667 |
| askUbuntu |	Shutdown Computer | 14 | 2 | 0 | 1 | 0,875 | 0,933 |
| askUbuntu | Make Update | 37 | 2 | 0 | 1 | 0,949 | 0,974 |
| askUbuntu | Setup Printer | 13 | 0 | 0 | 1 | 1 | 1 |
| webApp    | Find Alternative | 16 | 3 | 0 | 1 | 0,842 | 0,914 |
| webApp    | Delete Account   | 9 | 4 | 1 | 0,9 | 0,692 | 0,783 |
| webApp    | Export Data	     | 2 | 3 | 1 | 0,667 | 0,4 | 0,5 |
| webApp|Sync Accounts|4|0|2|0,667|1|0,8|
|webApp|None|0|0|4|0|		
|webApp|Change Password|3|0|3|0,5|1|0,667|
|webApp|Filter Spam|13|1|1|0,929|0,929|0,929|
|webApp|Download Video||0|1|0|0|	
|**Total Chatbot**||105|1|1|0,991|0,991|0,991|
|**Total askUbuntu**||102|6|6|0,944|0,944|0,944|
|**Total webApp**||47|12|12|0,797|0,797|0,797|
|**Total**||254|19|19|0,930|0,930|0,930|

### Watson

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|70|1|2|0,972|0,986|0,979|
|chatbot|DepartureTime|33|2|1|0,971|0,943|0,957|
|askUbuntu|Software Recommendation|35|5|3|0,921|0,875|0,897|
|askUbuntu|None|1|4|1|0,5|0,2|0,286|
|askUbuntu|Shutdown Computer|14|0|0|1|1|1|
|askUbuntu|Make Update|37|0|4|0,902|1|0,949|
|askUbuntu|Setup Printer|13|0|1|0,929|1|0,963|
|webApp|Find Alternative|15|1|1|0,938|0,938|0,938|
|webApp|Delete Account|9|1|3|0,75|0,9|0,818|
|webApp|Export Data|2|1|2|0,5|0,667|0,571|
|webApp|Sync Accounts|5|1|0|1|0,833|0,909|
|webApp|None|0|4|1|0|0|	
|webApp|Change Password|5|1|0|1|0,833|0,909|
|webApp|Filter Spam|13|1|2|0,867|0,929|0,897|
|webApp|Download Video|0|0|1|0|		
|Total Chatbot||103|3|3|0,972|0,972|0,972|
|Total askUbuntu||100|9|9|0,917|0,917|0,917|
|Total webApp||49|10|10|0,831|0,831|0,831|
|Total||252|22|22|0,920|0,920|0,920|

### LUIS

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|70|1|1|0,986|0,986|0,986|
|chatbot|DepartureTime|34|1|1|0,971|0,971|0,971|
|askUbuntu|Software Recommendation|36|4|5|0,878|0,9|0,889|
|askUbuntu|None|0|5|0||0|	
|askUbuntu|Shutdown Computer|14|0|0|1|1|1|
|askUbuntu|Make Update|36|1|4|0,9|0,973|0,935|
|askUbuntu|Setup Printer|12|1|2|0,857|0,923|0,889|
|webApp|Find Alternative|14|2|2|0,875|0,875|0,875|
|webApp|Delete Account|8|2|0|1|0,8|0,889|
|webApp|Export Data|3|0|1|0,75|1|0,857|
|webApp|Sync Accounts|5|1|0|1|0,833|0,909|
|webApp|None|3|1|8|0,272|0,75|0,4|
|webApp|Change Password|3|3|0|1|0,5|0,667|
|webApp|Filter Spam|12|2|0|1|0,857|0,923|
|webApp|Download Video|0|0|0|			
|Total Chatbot||104|2|2|0,981|0,981|0,981|
|Total askUbuntu||98|11|11|0,900|0,900|0,900|
|Total webApp||48|11|11|0,814|0,814|0,814|
|Total||250|24|24|0,912|0,912|0,9124|

### Botfuel

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|69|2|0|1|0,972|0,986|
|chatbot|DepartureTime|35|0|2|0,946|1|0,972|
|askUbuntu|Software Recommendation|33|7|1|0,971|0,825|0,892|
|askUbuntu|None|1|4|0|1|0,2|0,333|
|askUbuntu|Shutdown Computer|14|0|2|0,875|1|0,933|
|askUbuntu|Make Update|37|0|6|0,860|1|0,925|
|askUbuntu|Setup Printer|12|1|2|0,857|0,923|0,889|
|webApp|Find Alternative|16|0|4|0,8|1|0,889|
|webApp|Delete Account|9|1|3|0,75|0,9|0,818|
|webApp|Export Data|2|1|2|0,5|0,667|0,571|
|webApp|Sync Accounts|4|2|0|1|0,667|0,8|
|webApp|None|0|4|0||0|	
|webApp|Change Password|4|2|1|0,8|0,667|0,727|
|webApp|Filter Spam|12|2|1|0,923|0,857|0,889|
|webApp|Download Video|0|0|1|0|		
|Total Chatbot||104|2|2|0,981|0,981|0,981|
|Total askUbuntu||97|12|11|0,898|0,890|0,894|
|Total webApp||47|12|12|0,797|0,797|0,797|
|Total||248|26|25|0,908|0,905|0,907|

### Recast

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|70|1|0|1|0,986|0,993|
|chatbot|DepartureTime|35|0|1|0,972|1|0,986|
|askUbuntu|Software Recommendation|29|11|1|0,967|0,725|0,829|
|askUbuntu|None|1|4|0|1|0,2|0,333|
|askUbuntu|Shutdown Computer|14|0|6|0,7|1|0,824|
|askUbuntu|Make Update|37|0|7|0,841|1|0,914|
|askUbuntu|Setup Printer|13|0|1|0,929|1|0,963|
|webApp|Find Alternative|15|1|3|0,833|0,938|0,882|
|webApp|Delete Account|9|1|5|0,643|0,9|0,75|
|webApp|Export Data|2|1|4|0,333|0,667|0,444|
|webApp|Sync Accounts|3|3|0|1|0,5|0,667|
|webApp|None|1|3|1||0,25|	
|webApp|Change Password|4|2|1|0,8|0,667|0,727|
|webApp|Filter Spam|10|4|1|0,909|0,714|0,8|
|webApp|Download Video|0|0|0|			
|Total Chatbot||105|1|1|0,991|0,991|0,991|
|Total askUbuntu||94|15|15|0,862|0,862|0,862|
|Total webApp||44|15|15|0,746|0,746|0,746|
|Total||243|31|31|0,887|0,887|0,887|

### RASA

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|70|1|1|0,986|0,986|0,986|
|chatbot|DepartureTime|34|1|1|0,971|0,971|0,971|
|askUbuntu|Software Recommendation|33|7|4|0,892|0,825|0,857|
|askUbuntu|None|0|5|1|0|0|	
|askUbuntu|Shutdown Computer|14|0|6|0,7|1|0,824|
|askUbuntu|Make Update|34|3|2|0,944|0,919|0,932|
|askUbuntu|Setup Printer|13|0|2|0,867|1|0,929|
|webApp|Find Alternative|15|1|8|0,652|0,9375|0,769|
|webApp|Delete Account|9|1|5|0,643|0,9|0,75|
|webApp|Export Data|0|3|0||0|	
|webApp|Sync Accounts|3|3|0|1|0,5|0,667|
|webApp|None|0|4|1|0|0|	
|webApp|Change Password|4|2|0|1|0,667|0,8|
|webApp|Filter Spam|13|1|0|1|0,929|0,963|
|webApp|Download Video|0|0|1|0|		
|Total Chatbot||104|2|2|0,981|0,981|0,981|
|Total askUbuntu||94|15|15|0,862|0,862|0,862|
|Total webApp||44|15|15|0,746|0,746|0,746|
|Total||242|32|32|0,883|0,883|0,883|

### DialogFlow

| Corpus  | intent | true + | false - | false + | precision | recall | f1 |
| ------- | ------ | ------ | ------- | ------- | --------- | ------ | -- |
|chatbot|FindConnection|60|11|0|1|0,845|0,916|
|chatbot|DepartureTime|35|0|4|0,897|1|0,946|
|askUbuntu|Software Recommendation|28|12|2|0,933|0,7|0,8|
|askUbuntu|None|2|3|8|0,2|0,4|0,267|
|askUbuntu|Shutdown Computer|14|0|2|0,875|1|0,933|
|askUbuntu|Make Update|36|1|3|0,923|0,973|0,947|
|askUbuntu|Setup Printer|13|0|1|0,929|1|0,963|
|webApp|Find Alternative|16|0|2|0,889|1|0,941|
|webApp|Delete Account|10|0|2|0,833|1|0,909|
|webApp|Export Data|1|2|2|0,333|0,333|0,333|
|webApp|Sync Accounts|4|2|0|1|0,667|0,8|
|webApp|None|2|2|1|0,667|0,5|0,571|
|webApp|Change Password|4|2|1|0,8|0,667|0,727|
|webApp|Filter Spam|10|4|3|0,769|0,714|0,741|
|webApp|Download Video|0|0|0|			
|Total Chatbot||95|11|4|0,960|0,896|0,927|
|Total askUbuntu||93|16|16|0,853|0,853|0,853|
|Total webApp||47|12|11|0,810|0,797|0,803|
|Total||235|39|31|0,883|0,858|0,870|
