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

function runDiscard(srcEdge, srcOther, useMaxLength, intentEntities = []) {
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
      // Entities have same priority
      if (
        other.start === edge.start &&
        other.end === edge.end &&
        other.type === edge.type &&
        other.entity === edge.entity &&
        other.option === edge.option
      ) {
        // same type and none of them is an enum or both are an enum
        other.discarded = true;
      } else if (
        other.start === edge.start &&
        other.end === edge.end &&
        other.entity === edge.entity &&
        other.type !== edge.type
      ) {
        if (edge.type === 'trim' && other.type !== 'trim') {
          edge.discarded = true;
        } else if (edge.type !== 'trim' && other.type === 'trim') {
          other.discarded = true;
        } else {
          other.discarded = true;
        }
      }
    } else if (
      (useMaxLength ||
        other.entity === edge.entity ||
        edge.entity === 'number') &&
      other.len > edge.len
    ) {
      edge.discarded = true;
    } else if (edge.type === 'enum' && other.type === 'enum') {
      const edgeIncludedInIntentEntities = intentEntities.includes(edge.entity);
      const otherIncludedInIntentEntities = intentEntities.includes(
        other.entity
      );
      if (edgeIncludedInIntentEntities && !otherIncludedInIntentEntities) {
        other.discarded = true;
      } else if (
        !edgeIncludedInIntentEntities &&
        otherIncludedInIntentEntities
      ) {
        edge.discarded = true;
      } else if (
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

function reduceEdges(edges, useMaxLength = true, intentEntities = []) {
  const edgeslen = edges.length;
  for (let i = 0; i < edgeslen; i += 1) {
    const edge = edges[i];
    if (!edge.discarded) {
      for (let j = i + 1; j < edgeslen; j += 1) {
        const other = edges[j];
        if (!other.discarded) {
          runDiscard(edge, other, useMaxLength, intentEntities);
        }
        if (edge.discarded) {
          break;
        }
      }
    }
    if (!edge.discarded) {
      const knownEntityPos = intentEntities.indexOf(edge.entity);
      if (knownEntityPos !== -1) {
        intentEntities.splice(knownEntityPos, 1);
      }
    }
  }
  return edges.filter((x) => !x.discarded);
}

module.exports = reduceEdges;
