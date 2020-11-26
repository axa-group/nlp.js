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

const { Clonable, defaultContainer } = require('@nlpjs/core');
const Recognizers = require('./recognizers');

class BuiltinDefault extends Clonable {
  constructor(settings = {}, container = defaultContainer) {
    super(
      {
        settings: {},
        container: settings.container || container,
      },
      container
    );
    this.applySettings(this.settings, settings);
    if (!this.settings.tag) {
      this.settings.tag = 'builtin-default';
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  registerDefault() {
    this.container.registerConfiguration('builtin-default', {
      builtins: [
        'Email',
        'URL',
        'IpAddress',
        'PhoneNumber',
        'Hashtag',
        'Number',
        'Date',
      ],
    });
  }

  prereduceEdges(edges) {
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      if (!edge.discarded) {
        for (let j = i + 1; j < edges.length; j += 1) {
          const other = edges[j];
          if (!other.discarded) {
            if (
              other.start === edge.start &&
              other.end === edge.end &&
              other.entity === edge.entity &&
              other.accuracy <= edge.accuracy
            ) {
              other.discarded = true;
            }
          }
        }
      }
    }
    return edges.filter((x) => !x.discarded);
  }

  findBuiltinEntities(utterance, locale, srcBuiltins) {
    const result = [];
    const builtins = srcBuiltins || this.settings.builtins;
    builtins.forEach((name) => {
      const entities = Recognizers[`recognize${name}`](
        utterance,
        locale || 'en'
      );
      for (let i = 0; i < entities.length; i += 1) {
        const entity = entities[i];
        result.push(entity);
      }
    });
    const reducedResult = this.prereduceEdges(result);
    return {
      edges: reducedResult,
    };
  }

  extract(srcInput) {
    const input = srcInput;
    const entities = this.findBuiltinEntities(
      input.text || input.utterance,
      input.locale,
      input.builtins
    );
    if (!input.edges) {
      input.edges = [];
    }
    for (let i = 0; i < entities.edges.length; i += 1) {
      input.edges.push(entities.edges[i]);
    }
    return input;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const extractor = this.container.get(`extract-builtin-${locale}`) || this;
    return extractor.extract(input);
  }
}

module.exports = BuiltinDefault;
