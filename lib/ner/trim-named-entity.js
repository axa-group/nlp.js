/*
 * Copyright (c) AXA Shared Services Spain S.A.
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

const NamedEntity = require('./named-entity');
const RegexNamedEntity = require('./regex-named-entity');

/**
 * Class for the Trim Named Entity.
 */
class TrimNamedEntity extends NamedEntity {
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings) {
    super(settings);
    this.type = 'trim';
  }

  addBetweenCondition(srcLanguages, srcLeftWords, srcRightWords, srcOptions) {
    const options = srcOptions || {};
    const languages = Array.isArray(srcLanguages)
      ? srcLanguages
      : [srcLanguages];
    const leftWords = Array.isArray(srcLeftWords)
      ? srcLeftWords
      : [srcLeftWords];
    const rightWords = Array.isArray(srcRightWords)
      ? srcRightWords
      : [srcRightWords];
    const conditions = [];
    for (let i = 0; i < leftWords.length; i += 1) {
      for (let j = 0; j < rightWords.length; j += 1) {
        const leftWord =
          options.noSpaces === true ? leftWords[i] : ` ${leftWords[i]} `;
        const rightWord =
          options.noSpaces === true ? rightWords[j] : ` ${rightWords[j]} `;
        conditions.push(`(?<=${leftWord})(.*)(?=${rightWord})`);
      }
    }
    let regex = `/${conditions.join('|')}/g`;
    if (!(options.caseSensitive === true)) {
      regex += 'i';
    }
    languages.forEach(language => {
      const locale = this.getLocale(language);
      if (!locale.conditions) {
        locale.conditions = [];
      }
      locale.conditions.push({
        type: 'between',
        leftWords,
        rightWords,
        regex: RegexNamedEntity.str2regex(regex),
        options,
      });
    });
  }

  addPositionCondition(position, srcLanguages, srcWords, srcOptions) {
    const options = srcOptions || {};
    const languages = Array.isArray(srcLanguages)
      ? srcLanguages
      : [srcLanguages];
    const words = Array.isArray(srcWords) ? srcWords : [srcWords];
    languages.forEach(language => {
      const locale = this.getLocale(language);
      if (!locale.conditions) {
        locale.conditions = [];
      }
      locale.conditions.push({ type: position, words, options });
    });
  }

  addAfterCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition('after', srcLanguages, srcWords, srcOptions);
  }

  addAfterFirstCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition('afterFirst', srcLanguages, srcWords, srcOptions);
  }

  addAfterLastCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition('afterLast', srcLanguages, srcWords, srcOptions);
  }

  addBeforeCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition('before', srcLanguages, srcWords, srcOptions);
  }

  addBeforeFirstCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition(
      'beforeFirst',
      srcLanguages,
      srcWords,
      srcOptions
    );
  }

  addBeforeLastCondition(srcLanguages, srcWords, srcOptions) {
    this.addPositionCondition('beforeLast', srcLanguages, srcWords, srcOptions);
  }

  mustSkip(word, condition) {
    if (
      condition.options &&
      condition.options.skip &&
      condition.options.skip.length > 0
    ) {
      for (let i = 0; i < condition.options.skip.length; i += 1) {
        const skipWord = condition.options.skip[i];
        if (condition.options.caseSensitive) {
          if (skipWord === word) {
            return true;
          }
        } else if (skipWord.toLowerCase() === word.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  matchBetween(utterance, condition) {
    const result = [];
    let matchFound;
    do {
      const match = condition.regex.exec(` ${utterance} `);
      if (match) {
        result.push({
          type: 'between',
          start: match.index - 1,
          end: condition.regex.lastIndex - 2,
          len: match[0].length,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: this.name,
        });
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    const filteredResult = [];
    for (let i = 0; i < result.length; i += 1) {
      if (!this.mustSkip(result[i].utteranceText, condition)) {
        filteredResult.push(result[i]);
      }
    }
    return filteredResult;
  }

  findWord(utterance, word, caseSensitive = false, noSpaces = false) {
    const result = [];
    let matchFound;
    const regex = new RegExp(
      noSpaces ? word : ` ${word} | ${word}|${word} `,
      caseSensitive ? 'g' : 'ig'
    );
    do {
      const match = regex.exec(utterance);
      if (match) {
        result.push({
          start: match.index,
          end: regex.lastIndex,
        });
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    return result;
  }

  getBeforeResults(utterance, wordPositions) {
    const result = [];
    let startPos = 0;
    let endPos = 0;
    for (let i = 0; i < wordPositions.length; i += 1) {
      endPos = wordPositions[i].start;
      const text = utterance.substring(startPos, endPos);
      result.push({
        type: 'before',
        start: startPos,
        end: endPos - 1,
        len: text.length,
        accuracy: 0.99,
        sourceText: text,
        utteranceText: text,
        entity: this.name,
      });
      startPos = wordPositions[i].end;
    }
    return result;
  }

  getBeforeFirstResults(utterance, wordPositions) {
    const result = [];
    const startPos = 0;
    const endPos = wordPositions[0].start;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'beforeFirst',
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: this.name,
    });
    return result;
  }

  getBeforeLastResults(utterance, wordPositions) {
    const result = [];
    const startPos = 0;
    const endPos = wordPositions[wordPositions.length - 1].start;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'beforeLast',
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: this.name,
    });
    return result;
  }

  getAfterResults(utterance, wordPositions) {
    const result = [];
    let startPos = 0;
    let endPos = utterance.length;
    for (let i = wordPositions.length - 1; i >= 0; i -= 1) {
      startPos = wordPositions[i].end;
      const text = utterance.substring(startPos, endPos);
      result.unshift({
        type: 'after',
        start: startPos,
        end: endPos - 1,
        len: text.length,
        accuracy: 0.99,
        sourceText: text,
        utteranceText: text,
        entity: this.name,
      });
      endPos = wordPositions[i].start;
    }
    return result;
  }

  getAfterFirstResults(utterance, wordPositions) {
    const result = [];
    const startPos = wordPositions[0].end;
    const endPos = utterance.length;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'afterFirst',
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: this.name,
    });
    return result;
  }

  getAfterLastResults(utterance, wordPositions) {
    const result = [];
    const startPos = wordPositions[wordPositions.length - 1].end;
    const endPos = utterance.length;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'afterLast',
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: this.name,
    });
    return result;
  }

  getResults(utterance, wordPositions, type) {
    switch (type) {
      case 'before':
        return this.getBeforeResults(utterance, wordPositions, type);
      case 'beforeFirst':
        return this.getBeforeFirstResults(utterance, wordPositions, type);
      case 'beforeLast':
        return this.getBeforeLastResults(utterance, wordPositions, type);
      case 'after':
        return this.getAfterResults(utterance, wordPositions, type);
      case 'afterFirst':
        return this.getAfterFirstResults(utterance, wordPositions, type);
      case 'afterLast':
        return this.getAfterLastResults(utterance, wordPositions, type);
      default:
        return [];
    }
  }

  match(utterance, condition) {
    const result = [];
    for (let i = 0; i < condition.words.length; i += 1) {
      const word = condition.options.noSpaces
        ? condition.words[i]
        : ` ${condition.words[i]}`;
      const wordPositions = this.findWord(utterance, word);
      if (wordPositions.length > 0) {
        result.push(
          ...this.getResults(utterance, wordPositions, condition.type)
        );
      }
    }
    const filteredResult = [];
    for (let i = 0; i < result.length; i += 1) {
      if (!this.mustSkip(result[i].utteranceText, condition)) {
        filteredResult.push(result[i]);
      }
    }
    return filteredResult;
  }

  extract(utterance, language) {
    const result = [];
    const locale = this.getLocaleRules(language);
    if (!locale || !locale.conditions) {
      return result;
    }
    for (let i = 0; i < locale.conditions.length; i += 1) {
      const condition = locale.conditions[i];
      if (condition.type === 'between') {
        result.push(...this.matchBetween(utterance, condition));
      } else {
        result.push(...this.match(utterance, condition));
      }
    }
    return result;
  }
}

module.exports = TrimNamedEntity;
