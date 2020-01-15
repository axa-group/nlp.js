# Similar Search

Similar Search is used to calculate the levenshtein distance between two strings and also is able to search the best substring inside a string, i.e., the substring of a string which levenshtein distance is the smaller to another string.

You can calculate the levenshtein distance:

```javascript
const { SimilarSearch } = require('node-nlp');

const similar = new SimilarSearch();
similar.getSimilarity('mikailovitch', 'Mikhaïlovitch');
// returns 3
```

Also you can use collation so case and special characters are compared using collation:

```javascript
const { SimilarSearch } = require('node-nlp');

const similar = new SimilarSearch({ useCollation: true });
similar.getSimilarity('mikailovitch', 'Mikhaïlovitch');
// returns 1
```

Unfortunately, collation is very slow, but you can use normalization. Normalization preprocess strings converting to lowercase and converting accented characters to their unaccented equivalent, and this is pretty much faster than collation:

```javascript
const { SimilarSearch } = require('node-nlp');

const similar = new SimilarSearch({ normalize: true });
similar.getSimilarity('mikailovitch', 'Mikhaïlovitch');
// returns 1
```

You can search the best substring of string with the lower levenshtein distance. The accuracy is calculated as _(length - distance) / length_:

```javascript
const { SimilarSearch } = require('node-nlp');

const similar = new SimilarSearch();
const text1 =
  'Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate.';
const text2 = 'interdumaultriciesbneque';
const result = similar.getBestSubstring(text1, text2);
// result is { start: 6, end: 30, levenshtein: 2, accuracy: 0.9166666666666666 }
```
