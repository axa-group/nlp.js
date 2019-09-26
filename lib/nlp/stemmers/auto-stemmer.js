/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const BaseStemmer = require('./base-stemmer');

class AutoStemmer extends BaseStemmer {
  constructor(tokenizer, stopwords) {
    super(tokenizer, stopwords);
    this.intentUtterances = {};
    this.minLengthLearn = 2;
    this.amountLoops = 3;
    this.potentialRoots = {};
    this.potentialSuffixes = {};
  }

  clean() {
    this.intentUtterances = {}
  }

  addDocument(utterance, intent) {
    if (!this.intentUtterances[intent]) {
      this.intentUtterances[intent] = {};
    }
    const tokens = this.tokenizer.tokenize(utterance);
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      const converted = token.toLowerCase();
      if (converted) {
        this.intentUtterances[intent][converted] = 1;
      }
    }
  }

  getSimilarity(a, b) {
    const maxl = Math.max(a.length, b.length);
    const midl = Math.ceil(maxl / 2);
    if (a.length < midl || b.length < midl) {
      return 0;
    }
    for (let i = 0; i < midl; i += 1) {
      if (a[i] !== b[i]) {
        return 0;
      }
    }
    for (let i = midl; i < maxl; i += 1) {
      if (a[i] !== b[i]) {
        return i < this.minLengthLearn ? 0 : i;
      }
    }
    return maxl;
  }

  stemSuffix(word, srcLength) {
    if (word.length < this.minLengthLearn) {
      return word;
    }
    for (let i = 0; i < this.potentialSuffixesList.length; i += 1) {
      const current = this.potentialSuffixesList[i];
      if (srcLength >= (current.length * 2)) {
        if (word.endsWith(current)) {
          return word.slice(0, -current.length);
        }
      }
    }
    return word;
  }

  stemRoot(word, srcLength) {
    if (word.length < this.minLengthLearn) {
      return word;
    }
    let best;
    let bestSimilarity = 0;
    for (let i = 0; i < this.potentialRootsList.length; i += 1) {
      const current = this.potentialRootsList[i];
      if (word === current) {
        return word;
      }
      const similarity = this.getSimilarity(word, current);
      if (similarity && similarity > (srcLength / 2)) {
        if (similarity > bestSimilarity) {
          best = current;
          bestSimilarity = similarity;
        }
      }
    }
    return best || word;
  }

  stemRootSimilar(word) {
    let best;
    let bestSimilarity = 0;
    for (let i = 0; i < this.potentialRootsList.length; i += 1) {
      const current = this.potentialRootsList[i];
      const similarity = this.getSimilarity(word, current);
      if (similarity > bestSimilarity) {
        best = current;
        bestSimilarity = similarity;
      }
    }
    return best || word;
  }


  getSimilars(tokens) {
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const current = tokens[i];
      for (let j = i + 1; j < tokens.length; j += 1) {
        const other = tokens[j];
        const similarity = this.getSimilarity(current, other);
        if (similarity) {
          result.push({
            a: current,
            b: other,
            suffixa: current.slice(similarity),
            suffixb: other.slice(similarity),
            root: current.slice(0, similarity),
            similarity
          })
        }
      }
    }
    return result;
  }

  learnInitSuffixes() {
    const intents = Object.keys(this.intentUtterances);
    for (let i = 0; i < intents.length; i += 1) {
      const intent = intents[i];
      const tokens = Object.keys(this.intentUtterances[intent]).filter(x => x.length >= this.minLengthLearn);
      const similars = this.getSimilars(tokens);
      for (let j = 0; j < similars.length; j += 1) {
        const similar = similars[j];
        if (similar.root >= this.minLengthLearn) {
          this.potentialRoots[similar.root] = true;
        }
        if (!this.blockedSuffixes) {
          if (similar.suffixa) {
            this.potentialSuffixes[similar.suffixa] = true;
          }
          if (similar.suffixb) {
            this.potentialSuffixes[similar.suffixb] = true;
          }
        }
      }
    }
  }

  learn() {
    this.learnInitSuffixes();
    this.potentialSuffixesList = Object.keys(this.potentialSuffixes).sort((a, b) => b.length - a.length);
    const intents = Object.keys(this.intentUtterances);
    for (let i = 0; i < intents.length; i += 1) {
      Object.keys(this.intentUtterances[intents[i]]).forEach(token => {
        const word = this.stemSuffix(token);
        if (word.length >= this.minLengthLearn) {
          this.potentialRoots[word] = true;
        }
      });
    }
    this.potentialSuffixesList = Object.keys(this.potentialSuffixes).sort((a, b) => b.length - a.length);
    this.potentialRootsList = Object.keys(this.potentialRoots).sort((a, b) => a.length - b.length);
  }

  stem() {
    let word = this.getCurrent();
    const srcWord = word; 
    if (word) {
      word = word.toLowerCase();
      for (let i = 0; i < this.amountLoops; i += 1) {
        word = this.stemSuffix(word, word.length);
        word = this.stemRoot(word, word.length);
      }
      if (word === srcWord && !this.potentialRoots[word]) {
        word = this.stemRootSimilar(word, word.length);
      }
    }
    this.setCurrent(word);
  }
}

module.exports = AutoStemmer;