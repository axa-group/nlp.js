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

const NGrams = require('./ngrams');
const {
  lowerNormalize,
  wordPunctTokenize,
  tokenize,
  normalize,
} = require('./base-fn');

class MarkovChain {
  constructor(settings = {}) {
    this.ngrams = new NGrams({
      normalizer: settings.normalizer || lowerNormalize,
      tokenizer: settings.tokenizer || wordPunctTokenize,
      byWord: settings.byWord === undefined ? true : settings.byWord,
      startToken: settings.startToken || '[start]',
      endToken: settings.endToken || '[end]',
    });
    if (settings.text) {
      this.setSeed(settings.text);
    }
  }

  buildTree(grams) {
    const dict = { token: undefined, childs: {}, weight: 0 };
    for (let i = 0; i < grams.length; i += 1) {
      const gram = grams[i];
      let currentNode = dict;
      for (let j = 0; j < gram.length; j += 1) {
        const token = gram[j];
        if (!currentNode.childs[token]) {
          currentNode.childs[token] = { token, childs: {}, weight: 0 };
        }
        currentNode = currentNode.childs[token];
        currentNode.weight += 1;
      }
    }
    return dict;
  }

  setSeed(text) {
    this.trees = [];
    for (let i = 2; i <= 5; i += 1) {
      const grams = this.ngrams.getNGrams(text, i);
      this.trees.push(this.buildTree(grams));
    }
  }

  getChildsFromTree(inputTokens, tree, l) {
    const tokens = inputTokens.slice(-l);
    while (tokens.length < l) {
      tokens.unshift(this.ngrams.startToken);
    }
    let node = tree;
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (!node.childs[token]) {
        return undefined;
      }
      node = node.childs[token];
    }
    return node.childs;
  }

  getChilds(tokens, avoidLongs = false) {
    const result = [];
    for (let i = this.trees.length - 1; i >= 0; i -= 1) {
      const len = i + 1;
      if (!avoidLongs || tokens.length >= len) {
        const childs = this.getChildsFromTree(tokens, this.trees[i], len);
        if (childs) {
          result.push(childs);
        }
      }
    }
    return result;
  }

  getSortedChilds(tokens, avoidLongs = false) {
    const childs = this.getChilds(tokens, avoidLongs);
    const result = [];
    for (let i = 0; i < childs.length; i += 1) {
      const values = Object.values(childs[i]).sort(
        (a, b) => b.weight - a.weight
      );
      result.push(values);
    }
    return result;
  }

  predictNext(text, amount = 5) {
    const tokens = tokenize(
      normalize(text, this.ngrams.normalizer),
      this.ngrams.tokenizer
    );
    const childs = this.getSortedChilds(tokens, true);
    const result = [];
    for (let i = 0; i < childs.length; i += 1) {
      if (result.length < amount) {
        const child = childs[i];
        for (let j = 0; j < child.length; j += 1) {
          const { token } = child[j];
          if (result.indexOf(token) === -1) {
            result.push(token);
            if (result.length === amount) {
              return result;
            }
          }
        }
      }
    }
    return result;
  }

  pickByWeight(obj) {
    const keys = Object.keys(obj);
    let sum = 0;
    for (let i = 0; i < keys.length; i += 1) {
      sum += obj[keys[i]];
    }
    const choose = Math.floor(Math.random() * sum);
    let count = 0;
    for (let i = 0; i < keys.length; i += 1) {
      count += obj[keys[i]];
      if (count > choose) {
        return keys[i];
      }
    }
    return undefined;
  }

  predictNextRandom(text) {
    const tokens =
      typeof text === 'string'
        ? tokenize(
            normalize(text, this.ngrams.normalizer),
            this.ngrams.tokenizer
          )
        : text;
    const childs = this.getSortedChilds(tokens, false);
    const result = {};
    let multiplier = childs.length;
    for (let i = 0; i < childs.length; i += 1) {
      const child = childs[i];
      for (let j = 0; j < child.length; j += 1) {
        const { token } = child[j];
        if (!result[token]) {
          result[token] = 0;
        }
        result[token] += child[j].weight * multiplier;
      }
      multiplier -= 1;
    }
    let word = this.pickByWeight(result);
    let rounds = 0;
    while (word === this.ngrams.endToken && rounds < 5) {
      word = this.pickByWeight(result);
      rounds += 1;
    }
    return word;
  }

  randomSentence(startText = '', maxLength = 30) {
    const tokens = tokenize(
      normalize(startText, this.ngrams.normalizer),
      this.ngrams.tokenizer
    );
    let word = '';
    while (word !== this.ngrams.endToken && tokens.length < maxLength) {
      word = this.predictNextRandom(tokens);
      tokens.push(word);
    }
    return tokens
      .filter((x) => x !== this.ngrams.startToken && x !== this.ngrams.endToken)
      .join(' ');
  }
}

module.exports = MarkovChain;
