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

const { KoreanPos } = require('./korean-pos');
const { KoreanToken } = require('./korean-token');
const ChunkMatch = require('./chunk-match');

const POS_PATTERNS = {
  [KoreanPos.Email]: /([A-Za-z0-9.\-_]+@[A-Za-z0-9.]+)/,
  [KoreanPos.Number]:
    /(\$?[0-9]+(,[0-9]{3})*([/~:.-][0-9]+)?(천|만|억|조)*(%|원|달러|위안|옌|엔|유로|등|년|월|일|회|시간|시|분|초)?)/,
  [KoreanPos.Korean]: /([가-힣]+)/,
  [KoreanPos.KoreanParticle]: /([ㄱ-ㅣ]+)/,
  [KoreanPos.Alpha]: /([A-Za-z]+)/,
  [KoreanPos.Punctuation]: /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~·…’]+)/,
  [KoreanPos.Space]: /\s+/,
};

const CHUNKING_ORDER = [
  KoreanPos.Email,
  KoreanPos.Number,
  KoreanPos.Korean,
  KoreanPos.KoreanParticle,
  KoreanPos.Alpha,
  KoreanPos.Punctuation,
];

function splitBySpace(s) {
  const space = /\s+/g;
  const tokens = [];
  let m = space.exec(s);
  let index = 0;
  while (m) {
    if (index < m.index) {
      tokens.push(s.substring(index, m.index));
    }
    tokens.push(m[0]);
    index = m.index + m[0].length;
    m = space.exec(s);
  }
  tokens.push(s.substring(index, s.length));
  return tokens;
}

function fillInUnmatched(text, chunks) {
  const chunksWithForeign = [];
  let prevEnd = 0;
  for (let i = 0; i < chunks.length; i += 1) {
    const cm = chunks[i];
    if (cm.start === prevEnd) {
      chunksWithForeign.push(cm);
    } else if (cm.start > prevEnd) {
      chunksWithForeign.push(
        new ChunkMatch(
          prevEnd,
          cm.start,
          text.substring(prevEnd, cm.start),
          KoreanPos.Foreign
        )
      );
      chunksWithForeign.push(cm);
    }
    prevEnd = cm.end;
  }
  if (prevEnd < text.length) {
    chunksWithForeign.push(
      new ChunkMatch(
        prevEnd,
        text.length,
        text.substring(prevEnd, text.length),
        KoreanPos.Foreign
      )
    );
  }
  return chunksWithForeign;
}

function splitChunks(text) {
  if (/\s/.test(text[0])) {
    return [new ChunkMatch(0, text.length, text, KoreanPos.Space)];
  }
  const chunksMatched = [];
  let matchedLen = 0;
  for (let i = 0; i < CHUNKING_ORDER.length; i += 1) {
    if (matchedLen < text.length) {
      const pos = CHUNKING_ORDER[i];
      const r = new RegExp(POS_PATTERNS[pos].source, 'gi');
      let m = r.exec(text);
      while (m) {
        const cm = new ChunkMatch(m.index, m.index + m[0].length, m[0], pos);
        if (
          chunksMatched.filter((c) => cm.disjoint(c) === false).length === 0
        ) {
          chunksMatched.push(cm);
          matchedLen += m[0].length;
        }
        m = r.exec(text);
      }
    }
  }
  chunksMatched.sort((a, b) => a.start - b.start);
  return fillInUnmatched(text, chunksMatched);
}

function chunk(input) {
  const l = [].concat(...splitBySpace(input).map(splitChunks));
  let segStart = 0;
  const tokens = l.map((m) => {
    segStart = input.indexOf(m.text, segStart);
    return new KoreanToken(m.text, m.pos, segStart, m.text.length);
  });
  return tokens;
}

function getChunks(input) {
  return chunk(input).map((c) => c.text);
}

function getChunksByPos(input, pos) {
  return chunk(input).filter((x) => x.pos === pos);
}

module.exports = {
  chunk,
  getChunks,
  getChunksByPos,
};
