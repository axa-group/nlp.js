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

/**
 * Class for checking similarity between strings, or search the more similar
 * substring inside an string.
 */
class SimilarSearch {
  /**
   * Constructor of the class. Does the basic initializations.
   */
  constructor(settings) {
    this.settings = settings || {};
    this.alphanumeric = this.settings.alphanumeric || new RegExp(/[a-zA-ZÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôû0-9]/);
    this.collator = this.settings.collator || Intl.Collator('generic', { sensitivity: 'base' });
    this.useCollator = this.settings.useCollator === undefined ? false : this.settings.useCollator;
    this.normalize = this.settings.normalize === undefined ? false : this.settings.normalize;
  }

  /**
   * Calculates the levenshtein distance between two strings.
   * @param {String} str1 First String.
   * @param {String} str2 Second String.
   * @returns {Number} Levenshtein distance.
   */
  getSimilarity(str1, str2) {
    if (this.normalize) {
      /* eslint-disable */
      str1 = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      str2 = str2.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      /* eslint-enable */
    }
    if (str1 === str2) {
      return 0;
    }
    const str1len = str1.length;
    const str2len = str2.length;
    if (str1len === 0) return str2len;
    if (str2len === 0) return str1len;
    const prevRow = [];
    const str2Char = [];
    const str2CharAt = [];
    let curCol;
    let nextCol;
    let tmp;
    if (this.useCollator) {
      for (let i = 0; i < str2len; i += 1) {
        prevRow[i] = i;
        str2CharAt[i] = str2.charAt(i);
      }
    } else {
      for (let i = 0; i < str2len; i += 1) {
        prevRow[i] = i;
        str2Char[i] = str2.charCodeAt(i);
      }
    }
    prevRow[str2len] = str2len;
    let strCmp;
    let j;
    for (let i = 0; i < str1len; i += 1) {
      nextCol = i + 1;
      for (j = 0; j < str2len; j += 1) {
        curCol = nextCol;
        if (this.useCollator) {
          strCmp = this.collator.compare(str1.charAt(i), str2CharAt[j]) === 0;
        } else {
          strCmp = str1.charCodeAt(i) === str2Char[j];
        }
        nextCol = prevRow[j] + (strCmp ? 0 : 1);
        tmp = curCol + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }
        prevRow[j] = curCol;
      }
      prevRow[j] = nextCol;
    }
    return nextCol;
  }

  /**
   * Indicates if a character is alphanumeric.
   * @param {Character} c Character.
   * @returns {Boolean} True if the character is alphanumeric, false otherwise.
   */
  isAlphanumeric(c) {
    return this.alphanumeric.test(c);
  }

  /**
   * Given an string, iterates over it and return the start position, end position
   * and length of each of the words, without tokenizing the string.
   * @param {String} str String to be processed.
   * @returns {Object[]} Array of positions of the words, with the start index,
   *                     end index, and length.
   */
  getWordPositions(str) {
    const strlen = str.length;
    const result = [];
    let lastIndex = 0;
    let currentIndex = 0;
    let atWhiteSpace = true;
    while (currentIndex < strlen) {
      if (!this.isAlphanumeric(str.charAt(currentIndex))) {
        if (!atWhiteSpace) {
          result.push({ start: lastIndex, end: currentIndex, len: currentIndex - lastIndex });
          atWhiteSpace = true;
        }
      } else if (atWhiteSpace) {
        lastIndex = currentIndex;
        atWhiteSpace = false;
      }
      currentIndex += 1;
    }
    if (!atWhiteSpace) {
      result.push({ start: lastIndex, end: currentIndex, len: currentIndex - lastIndex });
    }
    return result;
  }

  /**
   * Given two strings, search best occurence of the second inside the first,
   * that is, the consecutive words of the first string that have less
   * levenshtein distance with the second one.
   * @param {String} str1 First string.
   * @param {String} str2 Second string.
   * @param {Object[]} words1 Array of positions of the words of the first string.
   *                          If not provided this will be built.
   * @returns {Object} Best occurence, expressed as the index of the first character,
   *                   index of the last character, levenshtein distance and accuracy.
   */
  getBestSubstring(str1, str2, words1) {
    const str1len = str1.length;
    const str2len = str2.length;
    if (str1len <= str2len) {
      const result = {
        start: 0,
        end: str1len,
        levenshtein: this.getSimilarity(str1, str2),
      };
      result.accuracy = (str2len - result.levenshtein) / str2len;
      return result;
    }
    const wordPositions = words1 || this.getWordPositions(str1);
    const wordPositionsLen = wordPositions.length;
    const best = {
      start: 0,
      end: 0,
      levenshtein: undefined,
      accuracy: 0,
    };
    for (let i = 0; i < wordPositionsLen; i += 1) {
      for (let j = i; j < wordPositionsLen; j += 1) {
        const str3 = str1.substring(wordPositions[i].start, wordPositions[j].end);
        const levenshtein = this.getSimilarity(str3, str2);
        if (best.levenshtein === undefined || levenshtein < best.levenshtein) {
          best.levenshtein = levenshtein;
          best.start = wordPositions[i].start;
          best.end = wordPositions[j].end;
        }
      }
    }
    best.accuracy = (str2len - best.levenshtein) / str2len;
    return best;
  }

  /**
   * Given an utterance and an array of entities with options, search the
   * best option for each entity and return the results.
   * @param {String} str Utterance to retrieve entities.
   * @param {Object[]} entities Entities Array.
   * @param {String} locale Locale for the search.
   * @param {String[]} whitelist Whitelist of entity names for the search.
   */
  getBestEntity(str, entities, locale, whitelist) {
    const result = [];
    const wordPositions = this.getWordPositions(str);
    const entityKeys = Object.keys(entities);
    for (let i = 0; i < entityKeys.length; i += 1) {
      const entity = entities[entityKeys[i]];
      if (!whitelist || whitelist.indexOf(entity.name) > -1) {
        let best;
        for (let j = 0; j < entity.options.length; j += 1) {
          const option = entity.options[j];
          if (option.texts[locale]) {
            const texts = option.texts[locale];
            for (let k = 0; k < texts.length; k += 1) {
              const current = this.getBestSubstring(str, texts[k], wordPositions);
              if (best === undefined || current.levenshtein < best.levenshtein) {
                best = current;
                best.option = option.name;
                best.sourceText = texts[k];
                best.entity = entity.name;
                best.utteranceText = str.substring(best.start, best.end);
              }
            }
          }
        }
        if (best) {
          result.push(best);
        }
      }
    }
    return result;
  }
}

module.exports = SimilarSearch;
