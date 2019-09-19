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

const { Language } = require('../language');

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
    this.alphanumeric =
      this.settings.alphanumeric ||
      new RegExp(/[\u00C0-\u1FFF\u2C00-\uD7FF\w]/);
    this.collator =
      this.settings.collator ||
      Intl.Collator('generic', { sensitivity: 'base' });
    this.useCollator =
      this.settings.useCollator === undefined
        ? false
        : this.settings.useCollator;
    this.normalize =
      this.settings.normalize === undefined ? false : this.settings.normalize;
    this.array = [];
    this.charCodeCache = [];
  }

  leven(left, right) {
    if (left.length > right.length) {
      // eslint-disable-next-line no-param-reassign
      [left, right] = [right, left];
    }
    let leftLength = left.length - 1;
    let rightLength = right.length - 1;
    while (
      leftLength > 0 &&
      left.charCodeAt(leftLength) === right.charCodeAt(rightLength)
    ) {
      leftLength -= 1;
      rightLength -= 1;
    }
    leftLength += 1;
    rightLength += 1;
    let start = 0;
    while (
      start < leftLength &&
      left.charCodeAt(start) === right.charCodeAt(start)
    ) {
      start += 1;
    }
    leftLength -= start;
    rightLength -= start;
    if (leftLength === 0) {
      return rightLength;
    }
    for (let i = 0; i < leftLength; i += 1) {
      this.charCodeCache[i] = left.charCodeAt(start + i);
      this.array[i] = i + 1;
    }
    let bCharCode;
    let result;
    let temp;
    let temp2;
    let j = 0;
    while (j < rightLength) {
      bCharCode = right.charCodeAt(start + j);
      temp = j;
      j += 1;
      result = j;
      for (let i = 0; i < leftLength; i += 1) {
        temp2 = bCharCode === this.charCodeCache[i] ? temp : temp + 1;
        temp = this.array[i];
        if (temp > result) {
          this.array[i] = temp2 > result ? result + 1 : temp2;
        } else {
          this.array[i] = temp2 > temp ? temp + 1 : temp2;
        }
        result = this.array[i];
      }
    }
    return result;
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
      str1 = str1
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      str2 = str2
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      /* eslint-enable */
    }
    if (str1 === str2) {
      return 0;
    }
    if (this.useCollator) {
      const str1len = str1.length;
      const str2len = str2.length;
      if (str1len === 0) return str2len;
      if (str2len === 0) return str1len;
      const prevRow = [];
      const str2CharAt = [];
      let curCol;
      let nextCol;
      let tmp;
      for (let i = 0; i < str2len; i += 1) {
        prevRow[i] = i;
        str2CharAt[i] = str2.charAt(i);
      }
      prevRow[str2len] = str2len;
      let strCmp;
      let j;
      for (let i = 0; i < str1len; i += 1) {
        nextCol = i + 1;
        for (j = 0; j < str2len; j += 1) {
          curCol = nextCol;
          strCmp = this.collator.compare(str1.charAt(i), str2CharAt[j]) === 0;
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
    return this.leven(str1, str2);
  }

  /**
   * Indicates if a character is alphanumeric.
   * @param {Character} c Character.
   * @returns {Boolean} True if the character is alphanumeric, false otherwise.
   */
  isAlphanumeric(c) {
    return this.alphanumeric.test(c) && c !== '_';
  }

  /**
   * Given an string, iterates over it and return the start position, end position
   * and length of each of the words, without tokenizing the string.
   * @param {String} str String to be processed.
   * @returns {Object[]} Array of positions of the words, with the start index,
   *                     end index, and length.
   */
  getWordPositions(str) {
    const scripts = [];
    for (let i = 0; i < str.length; i += 1) {
      scripts.push(Language.getTopScript(str.substr(i, 1)));
    }
    const strlen = str.length;
    const result = [];
    let lastIndex = 0;
    let currentIndex = 0;
    let atWhiteSpace = true;
    while (currentIndex < strlen) {
      if (!this.isAlphanumeric(str.charAt(currentIndex))) {
        if (!atWhiteSpace) {
          result.push({
            start: lastIndex,
            end: currentIndex - 1,
            len: currentIndex - lastIndex,
          });
          atWhiteSpace = true;
        }
      } else if (atWhiteSpace) {
        if (scripts[currentIndex][0] === 'cmn') {
          result.push({
            start: currentIndex,
            end: currentIndex,
            len: 1,
          });
          lastIndex = currentIndex;
          atWhiteSpace = true;
        } else {
          lastIndex = currentIndex;
          atWhiteSpace = false;
        }
      }
      currentIndex += 1;
    }
    if (!atWhiteSpace) {
      result.push({
        start: lastIndex,
        end: currentIndex - 1,
        len: currentIndex - lastIndex,
      });
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
        end: str1len - 1,
        len: str1len,
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
      len: 0,
      levenshtein: undefined,
      accuracy: 0,
    };
    for (let i = 0; i < wordPositionsLen; i += 1) {
      for (let j = i; j < wordPositionsLen; j += 1) {
        const str3 = str1.substring(
          wordPositions[i].start,
          wordPositions[j].end + 1
        );
        const levenshtein = this.getSimilarity(str3, str2);
        if (best.levenshtein === undefined || levenshtein < best.levenshtein) {
          best.levenshtein = levenshtein;
          best.start = wordPositions[i].start;
          best.end = wordPositions[j].end;
          best.len = best.end - best.start + 1;
        }
      }
    }
    best.accuracy = (str2len - best.levenshtein) / str2len;
    return best;
  }

  /**
   * Given two strings, search all the occurences of the second inside the first,
   * where the accuracy is at least as good as the threshold.
   * @param {String} str1 First string.
   * @param {String} str2 Second string.
   * @param {Object[]} words1 Array of positions of the words of the first string.
   *                          If not provided this will be built.
   * @returns {Object[]} List of occurences.
   */
  getBestSubstringList(str1, str2, words1, threshold = 1) {
    const str1len = str1.length;
    const str2len = str2.length;
    const result = [];
    if (str1len <= str2len) {
      const levenshtein = this.getSimilarity(str1, str2);
      const accuracy = (str2len - levenshtein) / str2len;
      if (accuracy >= threshold) {
        result.push({
          start: 0,
          end: str1len - 1,
          len: str1len,
          levenshtein,
          accuracy,
        });
      }
      return result;
    }
    const wordPositions = words1 || this.getWordPositions(str1);
    const wordPositionsLen = wordPositions.length;
    for (let i = 0; i < wordPositionsLen; i += 1) {
      for (let j = i; j < wordPositionsLen; j += 1) {
        const str3 = str1.substring(
          wordPositions[i].start,
          wordPositions[j].end + 1
        );
        const levenshtein = this.getSimilarity(str3, str2);
        const accuracy = (str2len - levenshtein) / str2len;
        if (accuracy >= threshold) {
          result.push({
            start: wordPositions[i].start,
            end: wordPositions[j].end,
            len: wordPositions[j].end - wordPositions[i].start + 1,
            levenshtein,
            accuracy,
          });
        }
      }
    }
    return result;
  }

  reduceEdges(edges, useMaxLength = true) {
    for (let i = 0, l = edges.length; i < l; i += 1) {
      const edge = edges[i];
      if (!edge.discarded) {
        for (let j = i + 1; j < l; j += 1) {
          const other = edges[j];
          if (!other.discarded) {
            if (other.start <= edge.end && other.end >= edge.start) {
              if (other.accuracy < edge.accuracy) {
                other.discarded = true;
              } else if (other.accuracy > edge.accuracy) {
                edge.discarded = true;
              } else if (
                (useMaxLength ||
                  other.entity === edge.entity ||
                  other.entity === 'number') &&
                other.len <= edge.len
              ) {
                other.discarded = true;
              } else if (
                (useMaxLength ||
                  other.entity === edge.entity ||
                  edge.entity === 'number') &&
                other.len > edge.len
              ) {
                edge.discarded = true;
              }
            }
          }
        }
      }
    }
    const result = [];
    for (let i = 0, l = edges.length; i < l; i += 1) {
      if (!edges[i].discarded) {
        result.push(edges[i]);
      }
    }
    return result;
  }

  getEdgesFromEntity(
    str,
    entity,
    language,
    entityName,
    threshold = 1,
    srcWordPositions
  ) {
    const wordPositions = srcWordPositions || this.getWordPositions(str);
    const locale = entity.getLocaleRules
      ? entity.getLocaleRules(language)
      : entity[language];
    const result = [];
    if (!locale) {
      return result;
    }
    const optionKeys = Object.keys(locale);
    for (let i = 0, li = optionKeys.length; i < li; i += 1) {
      const optionName = optionKeys[i];
      const texts = locale[optionName];
      for (let j = 0, lj = texts.length; j < lj; j += 1) {
        const current = this.getBestSubstringList(
          str,
          texts[j],
          wordPositions,
          threshold
        );
        for (let k = 0, lk = current.length; k < lk; k += 1) {
          const item = current[k];
          item.option = optionName;
          item.sourceText = texts[j];
          item.entity = entityName || entity.name;
          item.utteranceText = str.substring(item.start, item.end + 1);
          result.push(item);
        }
      }
    }
    return this.reduceEdges(result);
  }

  /**
   * Given an utterance and an array of entities with options, search the
   * best option for each entity and return the results.
   * @param {String} str Utterance to retrieve entities.
   * @param {Object[]} entities Entities Array.
   * @param {String} locale Locale for the search.
   * @param {String[]} whitelist Whitelist of entity names for the search.
   */
  getEdgesFromEntities(str, entities, language, whitelist, threshold = 1) {
    const result = [];
    const wordPositions = this.getWordPositions(str);
    const entityKeys = Object.keys(entities);
    for (let i = 0, l = entityKeys.length; i < l; i += 1) {
      const entityName = entityKeys[i];
      if (!whitelist || whitelist.indexOf(entityName) !== -1) {
        const edges = this.getEdgesFromEntity(
          str,
          entities[entityName],
          language,
          entityName,
          threshold,
          wordPositions
        );
        edges.forEach(srcEdge => {
          const edge = srcEdge;
          result.push(edge);
        });
      }
    }
    return this.reduceEdges(result);
  }
}

module.exports = SimilarSearch;
