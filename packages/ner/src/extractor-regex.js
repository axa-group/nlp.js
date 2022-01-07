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

class ExtractorRegex {
  constructor(container = defaultContainer) {
    this.container = container.container || container;
    this.name = 'extract-regex';
  }

  getRules(input) {
    const allRules = input.nerRules;
    if (!allRules) {
      return [];
    }
    return allRules;
  }

  getMatchs(utterance, regex) {
    const result = [];
    let matchFound;
    do {
      const match = regex instanceof RegExp ? regex.exec(utterance) : null;
      if (match) {
        if (match.length === 1) {
          result.push({
            start: match.index,
            end: regex.lastIndex - 1,
            accuracy: 1,
            sourceText: match[0],
          });
        } else {
          const index = utterance.indexOf(match[1]);
          result.push({
            start: index,
            end: index + match[1].length - 1,
            accuracy: 1,
            sourceText: match[1],
          });
        }
        matchFound = true;
      } else {
        matchFound = false;
      }
    } while (matchFound);
    return result;
  }

  extractFromRule(text, rule) {
    const edges = [];
    for (let i = 0; i < rule.rules.length; i += 1) {
      const newEdges = this.getMatchs(text, rule.rules[i]);
      for (let j = 0; j < newEdges.length; j += 1) {
        const edge = newEdges[j];
        edge.entity = rule.name;
        edge.type = rule.type;
        edge.utteranceText = text.substring(edge.start, edge.end + 1);
        edge.len = edge.utteranceText.length;
        edges.push(edge);
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
    const extractor = this.container.get(`extract-regex-${locale}`) || this;
    return extractor.extract(input);
  }
}

module.exports = ExtractorRegex;
