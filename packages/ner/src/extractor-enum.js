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
const { Language } = require('@nlpjs/language-min');
const { similarity } = require('@nlpjs/similarity');
const reduceEdges = require('./reduce-edges');

class ExtractorEnum {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'extract-enum';
  }

  getScripts(str) {
    const result = [];
    const chars = str.split('');
    for (let i = 0; i < chars.length; i += 1) {
      result.push(Language.getTopScript(chars[i]));
    }
    return result;
  }

  isAlphanumeric(c) {
    return /[\u00C0-\u1FFF\u2C00-\uD7FF\w]/.test(c) && c !== '_';
  }

  getWordPositions(str) {
    const scripts = this.getScripts(str);
    let atWhiteSpace = true;
    let lastIndex = 0;
    let currentIndex = 0;
    const strlen = str.length;
    const result = [];
    while (currentIndex < strlen) {
      if (this.isAlphanumeric(str.charAt(currentIndex))) {
        if (atWhiteSpace) {
          if (scripts[currentIndex][0] === 'cmn') {
            result.push({
              start: currentIndex,
              end: currentIndex,
              len: 1,
            });
            lastIndex = currentIndex;
          } else {
            lastIndex = currentIndex;
            atWhiteSpace = false;
          }
        }
      } else if (!atWhiteSpace) {
        result.push({
          start: lastIndex,
          end: currentIndex - 1,
          len: currentIndex - lastIndex,
        });
        atWhiteSpace = true;
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

  getBestSubstring(str1, str2, words1) {
    const str1len = str1.length;
    const str2len = str2.length;
    if (str1len <= str2len) {
      const result = {
        start: 0,
        end: str1len - 1,
        len: str1len,
        levenshtein: similarity(str1, str2, true),
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
        const levenshtein = similarity(str3, str2, true);
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

  getBestSubstringList(str1, str2, words1, threshold = 1) {
    const str1len = str1.length;
    const str2len = str2.length;
    const result = [];
    if (str1len <= str2len) {
      const levenshtein = similarity(str1, str2, true);
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
    const maxLevenshtein = str2len * (1 - threshold);
    const wordPositions = words1 || this.getWordPositions(str1);
    const wordPositionsLen = wordPositions.length;
    for (let i = 0; i < wordPositionsLen; i += 1) {
      for (let j = i; j < wordPositionsLen; j += 1) {
        const str3 = str1.substring(
          wordPositions[i].start,
          wordPositions[j].end + 1
        );
        const levenshtein = similarity(str3, str2, true);
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
        if (
          str3.length - wordPositions[0].len >=
          str2.length + maxLevenshtein
        ) {
          break;
        }
      }
    }
    return result;
  }

  getRules(input) {
    const allRules = input.nerRules;
    if (!allRules) {
      return [];
    }
    return allRules;
  }

  normalize(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  buildRuleDict(rule) {
    const dict = {};
    const inverse = {};
    for (let i = 0; i < rule.rules.length; i += 1) {
      const current = rule.rules[i];
      for (let j = 0; j < current.texts.length; j += 1) {
        const source = current.texts[j];
        const key = this.normalize(current.texts[j]);
        if (!dict[key]) {
          dict[key] = [];
        }
        dict[key].push(current);
        inverse[key] = source;
      }
    }
    rule.dict = dict;
    rule.inverseDict = inverse;
  }

  getBestExact(srcText, words, rule) {
    const text = this.normalize(srcText);
    const wordPositions = words || this.getWordPositions(text);
    const wordPositionsLen = wordPositions.length;
    const result = [];
    for (let i = 0; i < wordPositionsLen; i += 1) {
      for (let j = i; j < wordPositionsLen; j += 1) {
        const str = text.substring(
          wordPositions[i].start,
          wordPositions[j].end + 1
        );
        if (rule.dict[str]) {
          const subrule = rule.dict[str];
          for (let k = 0; k < subrule.length; k += 1) {
            result.push({
              accuracy: 1,
              start: wordPositions[i].start,
              end: wordPositions[j].end,
              len: wordPositions[j].end - wordPositions[i].start + 1,
              levenshtein: 0,
              entity: rule.name,
              type: rule.type,
              option: subrule[k].option,
              sourceText: rule.inverseDict[str],
              utteranceText: srcText.substring(
                wordPositions[i].start,
                wordPositions[j].end + 1
              ),
            });
          }
        }
      }
    }
    return result;
  }

  extractFromRule(text, rule, words, threshold) {
    if (rule.type === 'enum') {
      const edges = [];
      if (threshold >= 1) {
        if (!rule.dict) {
          this.buildRuleDict(rule);
        }
        const newEdges = this.getBestExact(text, words, rule);
        for (let i = 0; i < newEdges.length; i += 1) {
          edges.push(newEdges[i]);
        }
      } else {
        for (let i = 0; i < rule.rules.length; i += 1) {
          const current = rule.rules[i];
          if (current && current.option && Array.isArray(current.texts)) {
            for (let j = 0; j < current.texts.length; j += 1) {
              const newEdges = this.getBestSubstringList(
                text,
                current.texts[j],
                words,
                current.threshold || threshold
              );
              for (let k = 0; k < newEdges.length; k += 1) {
                edges.push({
                  ...newEdges[k],
                  entity: rule.name,
                  type: rule.type,
                  option: rule.rules[i].option,
                  sourceText: current.texts[j],
                  utteranceText: text.substring(
                    newEdges[k].start,
                    newEdges[k].end + 1
                  ),
                });
              }
            }
          }
        }
      }
      return edges;
    }
    return [];
  }

  async extract(srcInput) {
    const input = srcInput;
    const originalInputText = input.text || input.utterance;
    let tokenizedText = originalInputText;
    const originalPositionMap = [];
    const tokenizer = this.container.get('tokenize');
    if (tokenizer) {
      const tokenizeResult = await tokenizer.run({
        locale: input.locale,
        text: tokenizedText,
      });
      tokenizedText = tokenizeResult.tokens.join(' ');
      if (tokenizedText !== originalInputText) {
        let originalTextIndex = 0;
        let tokenizedTextIndex = 0;
        for (let i = 0; i < tokenizeResult.tokens.length; i += 1) {
          const originaltextPos = originalInputText.indexOf(
            tokenizeResult.tokens[i],
            originalTextIndex
          );
          for (let idx = 0; idx < tokenizeResult.tokens[i].length; idx += 1) {
            originalPositionMap[tokenizedTextIndex + idx] =
              originaltextPos + idx;
          }
          originalTextIndex += tokenizeResult.tokens[i].length;
          tokenizedTextIndex += tokenizeResult.tokens[i].length + 1;
        }
      }
    }
    const wordPositions = this.getWordPositions(tokenizedText);
    const rules = this.getRules(input);
    const edges = input.edges || [];
    for (let i = 0; i < rules.length; i += 1) {
      const newEdges = this.extractFromRule(
        tokenizedText,
        rules[i],
        wordPositions,
        input.threshold || 0.8
      );
      for (let j = 0; j < newEdges.length; j += 1) {
        edges.push(newEdges[j]);
      }
    }
    if (originalPositionMap.length > 0) {
      for (let i = 0; i < edges.length; i += 1) {
        const edge = edges[i];
        edge.start = originalPositionMap[edge.start];
        edge.end = originalPositionMap[edge.end];
      }
    }
    edges.sort((a, b) => a.start - b.start);
    input.edges = reduceEdges(edges, false, input.intentEntities);
    return input;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const extractor = this.container.get(`extract-enum-${locale}`) || this;
    return extractor.extract(input);
  }
}

module.exports = ExtractorEnum;
