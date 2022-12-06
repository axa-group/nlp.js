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
const { TrimTypesList } = require('./trim-types');

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

/**
 * Given an array of edges, detect the trim edges and find overlaps with
 * non-trim edges. When an overlap is detected, reduce the trim edged to
 * fit with the other edge. Only cases where it overlaps on beginning or
 * end are handled
 * @param {Object[]} edges Edges to be splitted
 * @returns {Object[]} Splitted edges.
 */
function splitEdges(edges) {
  for (let i = 0, l = edges.length; i < l; i += 1) {
    const edge = edges[i];
    if (edge.type === 'trim' && TrimTypesList.includes(edge.subtype)) {
      for (let j = 0; j < edges.length; j += 1) {
        const other = edges[j];
        if (
          i !== j &&
          other.start >= edge.start &&
          other.end <= edge.end &&
          other.type !== 'trim'
        ) {
          const edgeLen = edge.end - edge.start;
          const otherLen = other.end - other.start;
          if (edge.end === other.end) {
            // is at the end
            const text = edge.sourceText.substring(0, edgeLen - otherLen - 1);
            edge.sourceText = text;
            edge.utteranceText = text;
            edge.end = other.start - 1;
            edge.len = text.length;
          } else if (edge.start === other.start) {
            // is at the start
            const text = edge.sourceText.substring(otherLen + 1);
            edge.sourceText = text;
            edge.utteranceText = text;
            edge.start = other.end + 1;
            edge.len = text.length;
          }
        }
      }
    }
  }
  return edges;
}

function reduceEdges(edges, useMaxLength = true) {
  edges = splitEdges(edges);
  const edgeslen = edges.length;
  for (let i = 0; i < edgeslen; i += 1) {
    const edge = edges[i];
    if (edge.len === 0) {
      edge.discarded = true;
    }
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
