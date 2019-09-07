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

const aspects = require('./thai-aspects.json');

class ThaiTokenizer {
  constructor(settings = {}) {
    this.settings = settings;
  }

  addToTree(aspect) {
    let node = this.dict;
    for (let i = 0; i < aspect.length; i += 1) {
      const current = aspect[i];
      if (!node[current]) {
        node[current] = {};
      }
      node = node[current];
    }
    node.isLeaf = true;
  }

  buildDictionary() {
    this.dict = {};
    for (let i = 0; i < aspects.length; i += 1) {
      this.addToTree(aspects[i]);
    }
  }

  findCollisions(token, tokens) {
    const result = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const current = tokens[i];
      if (
        (!current.isDiscarded && current.start !== token.start) ||
        current.length !== token.length
      ) {
        if (current.start <= token.end && current.end >= token.start) {
          result.push(current);
        }
      }
    }
    return result;
  }

  perfectCompose(token, collisions) {
    for (let i = 0; i < collisions.length; i += 1) {
      const a = collisions[i];
      if (a.start <= token.start) {
        for (let j = 1; j < collisions.length; j += 1) {
          const b = collisions[j];
          if (b.start === a.end + 1 && b.end === token.end) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isLate(token, collisions, open = false) {
    for (let i = 0; i < collisions.length; i += 1) {
      if (
        !open &&
        token.start > collisions[i].start &&
        token.end < collisions[i].end
      ) {
        return true;
      }
      if (
        open &&
        token.start >= collisions[i].start &&
        token.end <= collisions[i].end
      ) {
        return true;
      }
    }
    return false;
  }

  fullSure(tokens) {
    for (let i = 0; i < tokens.length; i += 1) {
      if (!tokens[i].isSure) {
        return false;
      }
    }
    return true;
  }

  reduceEdges(srcTokens) {
    let tokens = srcTokens;
    let lastLength = 0;
    while (lastLength !== tokens.length && !this.fullSure(tokens)) {
      lastLength = tokens.length;
      for (let open = 0; open <= 1; open += 1) {
        for (let i = 0; i < tokens.length; i += 1) {
          const current = tokens[i];
          const collisions = this.findCollisions(current, tokens);
          if (collisions.length === 0) {
            current.isSure = true;
            current.isDiscarded = false;
          } else if (this.perfectCompose(current, collisions)) {
            current.isDiscarded = true;
          } else if (this.isLate(current, collisions, open === 1)) {
            current.isDiscarded = true;
          }
        }
        tokens = tokens.filter(x => !x.isDiscarded);
      }
    }
    return tokens;
  }

  tokenize(str) {
    if (!this.dict) {
      this.buildDictionary();
    }
    const potentialTokens = [];
    let currentChains = [];
    for (let i = 0; i < str.length; i += 1) {
      const chr = str[i];
      if (this.dict[chr]) {
        currentChains.push({ node: this.dict, value: '' });
      }
      for (let j = 0; j < currentChains.length; j += 1) {
        const chain = currentChains[j];
        const nextNode = chain.node[chr];
        if (nextNode) {
          currentChains[j] = { node: nextNode, value: chain.value + chr };
        } else {
          currentChains[j] = undefined;
        }
        if (nextNode && nextNode.isLeaf) {
          potentialTokens.push({
            start: i - currentChains[j].value.length + 1,
            length: currentChains[j].value.length,
            end: i,
            value: currentChains[j].value,
          });
        }
      }
      currentChains = currentChains.filter(x => x);
    }
    const edges = this.reduceEdges(potentialTokens);
    let index = 0;
    const result = [];
    for (let i = 0; i < edges.length; i += 1) {
      const current = edges[i];
      if (current.start > index) {
        result.push(...str.slice(index, current.start).split(/\W+/));
      }
      result.push(current.value);
      index = current.end + 1;
    }
    if (index < str.length) {
      result.push(...str.slice(index).split(/\W+/));
    }
    return result;
  }
}

module.exports = ThaiTokenizer;
