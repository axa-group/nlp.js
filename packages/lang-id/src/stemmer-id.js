/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { BaseStemmer } = require('@nlpjs/core');
const kataDasar = require('./kata-dasar.json');
const preffixRules = require('./preffix-rules').rules;
const suffixRules = require('./suffix-rules').rules;

class StemmerId extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-id';
  }

  findWord(token) {
    const result = kataDasar[token] === 1;
    return result;
  }

  stemPlural(token) {
    let matches = token.match(/^(.*)-(.*)$/);
    if (!matches) {
      return token;
    }
    const words = [matches[1], matches[2]];
    matches = words[0].match(/^(.*)-(.*)$/);
    if (StemmerId.suffixes[words[1]] && matches) {
      [, words[0]] = matches;
      words[1] = `${matches[2]}-${words[1]}`;
    }
    const rootWord1 = this.stemSingular(words[0]);
    let rootWord2 = this.stemSingular(words[1]);
    if (rootWord2 === words[1] && !this.findWord(words[1])) {
      rootWord2 = this.stemSingular(`me${words[1]}`);
    }
    if (rootWord1 === rootWord2) {
      return rootWord1;
    }
    return token;
  }

  requiresAdjustment(word) {
    const rules = [
      /^be(.*)lah$/,
      /^be(.*)an$/,
      /^me(.*)i$/,
      /^di(.*)i$/,
      /^pe(.*)i$/,
      /^ter(.*)i$/,
    ];
    for (let i = 0; i < rules.length; i += 1) {
      if (word.match(rules[i])) {
        return true;
      }
    }
    return false;
  }

  checkPrefixRules() {
    const removalCount = this.removals.length;
    for (let i = 0; i < preffixRules.length; i += 1) {
      const resultObj = preffixRules[i](this.currentWord);
      if (resultObj.removal) {
        this.removals.push(resultObj.removal);
      }
      this.currentWord = resultObj.currentWord;
      if (this.findWord(this.currentWord)) {
        return this.currentWord;
      }
      if (this.removals.length > removalCount) {
        return this.currentWord;
      }
    }
    return this.currentWord;
  }

  removePrefixes() {
    for (let i = 0; i < 3; i += 1) {
      this.checkPrefixRules();
      if (this.findWord(this.currentWord)) {
        return this.currentWord;
      }
    }
    return this.currentWord;
  }

  removeSuffixes() {
    for (let i = 0; i < suffixRules.length; i += 1) {
      const resultObj = suffixRules[i](this.currentWord);
      if (resultObj.removal) {
        this.removals.push(resultObj.removal);
      }
      this.currentWord = resultObj.currentWord;
      if (this.findWord(this.currentWord)) {
        return this.currentWord;
      }
    }
    return this.currentWord;
  }

  restorePrefix() {
    for (let i = 0; i < this.removals.length; i += 1) {
      this.currentWord = this.removals[i].originalWord;
      break;
    }
    let i = 0;
    while (i < this.removals.length) {
      if (this.removals[i].affixType === 'DP') {
        this.removals.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }

  loopRestorePrefixes() {
    this.restorePrefix();
    const tempCurrentWord = this.currentWord;
    for (let i = this.removals.length - 1; i >= 0; i -= 1) {
      const currentRemoval = this.removals[i];
      if (['DS', 'PP', 'P'].includes(currentRemoval.affixType)) {
        if (currentRemoval.removedPart === 'kan') {
          this.currentWord = `${currentRemoval.result}k`;
          this.removePrefixes();
          if (this.findWord(this.currentWord)) {
            return this.currentWord;
          }
          this.currentWord = `${currentRemoval.result}kan`;
        } else {
          this.currentWord = currentRemoval.originalWord;
        }
        this.removePrefixes();
        if (this.findWord(this.currentWord)) {
          return this.currentWord;
        }
        this.currentWord = tempCurrentWord;
        return this.currentWord;
      }
    }
    return this.currentWord;
  }

  stemmingProcess() {
    if (this.findWord(this.currentWord)) {
      return this.currentWord;
    }
    if (this.requiresAdjustment(this.originalWord)) {
      this.removePrefixes();
      if (this.findWord(this.currentWord)) {
        return this.currentWord;
      }
      this.removeSuffixes();
      if (this.findWord(this.currentWord)) {
        return this.currentWord;
      }
      this.currentWord = this.originalWord;
      this.removals = [];
    }
    this.removeSuffixes();
    if (this.findWord(this.currentWord)) {
      return this.currentWord;
    }
    this.removePrefixes();
    if (this.findWord(this.currentWord)) {
      return this.currentWord;
    }
    this.loopRestorePrefixes();
    return this.currentWord;
  }

  stemSingular(word) {
    this.originalWord = word;
    this.currentWord = word;
    if (this.currentWord.length > 3) {
      this.stemmingProcess();
    }
    return this.findWord(this.currentWord)
      ? this.currentWord
      : this.originalWord;
  }

  isPlural(word) {
    const matches = word.match(/^(.*)-(ku|mu|nya|lah|kah|tah|pun)$/);
    if (matches) {
      return matches[1].search('-') !== -1;
    }
    return word.search('-') !== -1;
  }

  innerStem() {
    const token = this.getCurrent();
    this.removals = [];
    this.setCurrent(
      this.isPlural(token) ? this.stemPlural(token) : this.stemSingular(token)
    );
  }
}

StemmerId.suffixes = {
  ku: 1,
  mu: 1,
  nya: 1,
  lah: 1,
  kah: 1,
  tah: 1,
  pun: 1,
};

module.exports = StemmerId;
