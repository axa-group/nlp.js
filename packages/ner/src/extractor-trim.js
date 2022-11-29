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

const { defaultContainer } = require('@nlpjs/core');
const reduceEdges = require('./reduce-edges');
const { TrimType } = require('./trim-types');

class ExtractorTrim {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'extract-trim';
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

  matchBetween(utterance, condition, name) {
    const result = [];
    let matchFound;
    do {
      const match = condition.regex.exec(` ${utterance} `);
      if (match) {
        let matchIndex;
        let startIndex;
        let endIndex;
        if (condition && condition.options && condition.options.closest) {
          matchIndex = 1;
          if (!match[matchIndex]) {
            matchFound = false;
            break;
          }
          const leftWordIndex = match[0].indexOf(match[matchIndex]);
          startIndex = match.index - 1 + leftWordIndex;
          endIndex = startIndex + match[matchIndex].length - 1;
        } else {
          matchIndex = 0;
          startIndex = match.index - 1;
          endIndex = condition.regex.lastIndex - 2;
        }
        result.push({
          type: 'trim',
          subtype: TrimType.Between,
          start: startIndex,
          end: endIndex,
          len: match[matchIndex].length,
          accuracy: 1,
          sourceText: match[matchIndex],
          utteranceText: match[matchIndex],
          entity: name,
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

  getBeforeResults(utterance, wordPositions, name) {
    const result = [];
    let startPos = 0;
    let endPos = 0;
    for (let i = 0; i < wordPositions.length; i += 1) {
      endPos = wordPositions[i].start;
      const text = utterance.substring(startPos, endPos);
      result.push({
        type: 'trim',
        subtype: TrimType.Before,
        start: startPos,
        end: endPos - 1,
        len: text.length,
        accuracy: 0.99,
        sourceText: text,
        utteranceText: text,
        entity: name,
      });
      startPos = wordPositions[i].end;
    }
    return result;
  }

  getBeforeFirstResults(utterance, wordPositions, name) {
    const result = [];
    const startPos = 0;
    const endPos = wordPositions[0].start;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'trim',
      subtype: TrimType.BeforeFirst,
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: name,
    });
    return result;
  }

  getBeforeLastResults(utterance, wordPositions, name) {
    const result = [];
    const startPos = 0;
    const endPos = wordPositions[wordPositions.length - 1].start;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'trim',
      subtype: TrimType.BeforeLast,
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: name,
    });
    return result;
  }

  getAfterResults(utterance, wordPositions, name) {
    const result = [];
    let startPos = 0;
    let endPos = utterance.length;
    for (let i = wordPositions.length - 1; i >= 0; i -= 1) {
      startPos = wordPositions[i].end;
      const text = utterance.substring(startPos, endPos);
      result.unshift({
        type: 'trim',
        subtype: TrimType.After,
        start: startPos,
        end: endPos - 1,
        len: text.length,
        accuracy: 0.99,
        sourceText: text,
        utteranceText: text,
        entity: name,
      });
      endPos = wordPositions[i].start;
    }
    return result;
  }

  getAfterFirstResults(utterance, wordPositions, name) {
    const result = [];
    const startPos = wordPositions[0].end;
    const endPos = utterance.length;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'trim',
      subtype: TrimType.AfterFirst,
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: name,
    });
    return result;
  }

  getAfterLastResults(utterance, wordPositions, name) {
    const result = [];
    const startPos = wordPositions[wordPositions.length - 1].end;
    const endPos = utterance.length;
    const text = utterance.substring(startPos, endPos);
    result.push({
      type: 'trim',
      subtype: TrimType.AfterLast,
      start: startPos,
      end: endPos - 1,
      len: text.length,
      accuracy: 0.99,
      sourceText: text,
      utteranceText: text,
      entity: name,
    });
    return result;
  }

  getResults(utterance, wordPositions, type, name) {
    switch (type) {
      case TrimType.Before:
        return this.getBeforeResults(utterance, wordPositions, name);
      case TrimType.BeforeFirst:
        return this.getBeforeFirstResults(utterance, wordPositions, name);
      case TrimType.BeforeLast:
        return this.getBeforeLastResults(utterance, wordPositions, name);
      case TrimType.After:
        return this.getAfterResults(utterance, wordPositions, name);
      case TrimType.AfterFirst:
        return this.getAfterFirstResults(utterance, wordPositions, name);
      case TrimType.AfterLast:
        return this.getAfterLastResults(utterance, wordPositions, name);
      default:
        return [];
    }
  }

  match(utterance, condition, type, name) {
    const result = [];
    if (condition && Array.isArray(condition.words)) {
      for (let i = 0; i < condition.words.length; i += 1) {
        const word = condition.options.noSpaces
          ? condition.words[i]
          : ` ${condition.words[i]}`;
        const wordPositions = this.findWord(utterance, word);
        if (!condition.options.noSpaces) {
          const wordPositions2 = this.findWord(utterance, condition.words[i]);
          if (wordPositions2.length > 0 && wordPositions2[0].start === 0) {
            wordPositions.unshift(wordPositions2[0]);
          }
        }
        if (wordPositions.length > 0) {
          result.push(...this.getResults(utterance, wordPositions, type, name));
        }
      }
    }
    const filteredResult = [];
    for (let i = 0; i < result.length; i += 1) {
      // Remove common whitespace characters
      result[i].sourceText = result[i].sourceText.replace(
        /^[\s,.!?;:([\]'"¡¿)/]+|[\s,.!?;:([\]'"¡¿)/]+$/,
        ''
      );
      if (!this.mustSkip(result[i].utteranceText, condition)) {
        filteredResult.push(result[i]);
      }
    }
    return filteredResult;
  }

  getRules(input) {
    const allRules = input.nerRules;
    if (!allRules) {
      return [];
    }
    return allRules;
  }

  extractFromRule(utterance, rule) {
    const edges = [];
    for (let i = 0; i < rule.rules.length; i += 1) {
      const current = rule.rules[i];
      if (current.type === TrimType.Between) {
        edges.push(...this.matchBetween(utterance, current, rule.name));
      } else {
        edges.push(...this.match(utterance, current, current.type, rule.name));
      }
    }
    return edges;
  }

  extract(srcInput) {
    const input = srcInput;
    const rules = this.getRules(input);
    const edges = input.edges || [];
    for (let i = 0; i < rules.length; i += 1) {
      const newEdges = this.extractFromRule(
        input.text || input.utterance,
        rules[i]
      );
      for (let j = 0; j < newEdges.length; j += 1) {
        edges.push(newEdges[j]);
      }
    }
    edges.sort((a, b) => a.start - b.start);
    input.edges = reduceEdges(edges, false);
    return input;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const extractor = this.container.get(`extract-trim-${locale}`) || this;
    return extractor.extract(input);
  }
}

module.exports = ExtractorTrim;
