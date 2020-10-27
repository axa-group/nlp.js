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

function runDiscard(srcEdge, srcOther, useMaxLength) {
  let edge;
  let other;
  if (
    srcEdge.accuracy > srcOther.accuracy ||
    (srcEdge.accuracy === srcOther.accuracy && srcEdge.length > srcOther.length)
  ) {
    edge = srcEdge;
    other = srcOther;
  } else {
    edge = srcOther;
    other = srcEdge;
  }
  if (other.start <= edge.end && other.end >= edge.start) {
    if (other.accuracy < edge.accuracy) {
      other.discarded = true;
    } else if (
      (useMaxLength ||
        other.entity === edge.entity ||
        other.entity === 'number') &&
      other.len <= edge.len
    ) {
      // Do nothing! entities have same priority
      if (
        other.start === edge.start &&
        other.end === edge.end &&
        other.type === edge.type &&
        other.entity === edge.entity &&
        other.option === edge.option
      ) {
        other.discarded = true;
      }
    } else if (
      (useMaxLength ||
        other.entity === edge.entity ||
        edge.entity === 'number') &&
      other.len > edge.len
    ) {
      edge.discarded = true;
    } else if (edge.type === 'enum' && other.type === 'enum') {
      if (
        edge.len <= other.len &&
        other.utteranceText.includes(edge.utteranceText)
      ) {
        edge.discarded = true;
      } else if (
        edge.len > other.len &&
        edge.utteranceText.includes(other.utteranceText)
      ) {
        other.discarded = true;
      }
    }
  }
}

function reduceEdges(edges, useMaxLength = true) {
  const edgeslen = edges.length;
  for (let i = 0; i < edgeslen; i += 1) {
    const edge = edges[i];
    if (!edge.discarded) {
      for (let j = i + 1; j < edgeslen; j += 1) {
        const other = edges[j];
        if (!other.discarded) {
          runDiscard(edge, other, useMaxLength);
        }
      }
    }
  }
  return edges.filter((x) => !x.discarded);
}

module.exports = reduceEdges;
