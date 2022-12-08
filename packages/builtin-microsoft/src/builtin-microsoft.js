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
const Recognizers = require('@microsoft/recognizers-text-suite');
const BuiltinDictionary = require('./builtin-dictionary.json');
const BuiltinInverse = require('./builtin-inverse.json');

const cultures = {
  bn: 'bn-bd',
  el: 'el-gr',
  en: 'en-us',
  hi: 'hi-in',
  fa: 'fa-ir',
  gl: 'gl-es',
  pt: 'pt-br',
  sv: 'sv-se',
  tl: 'tl-ph',
  ja: 'ja-jp',
  ar: 'ar-ae',
  hy: 'hy-am',
  eu: 'eu-es',
  ca: 'ca-es',
  cs: 'cs-cz',
  da: 'da-dk',
  ga: 'ga-ie',
  ta: 'ta-in',
  uk: 'uk-ua',
  zh: 'zh-cn',
};

function getCulture(locale) {
  const result = cultures[locale];
  if (result) {
    return result;
  }
  return locale ? `${locale}-${locale}` : 'en-us';
}

class BuiltinMicrosoft extends Clonable {
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
      this.settings.tag = `builtin-microsoft`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.settings.builtinAllowList = {};
    for (let i = 0; i < this.settings.allowList.length; i += 1) {
      this.settings.builtinAllowList[this.settings.allowList[i]] = 1;
    }
  }

  registerDefault() {
    this.container.registerConfiguration(
      'builtin-microsoft',
      {
        builtins: [
          'Number',
          'Ordinal',
          'Percentage',
          'Age',
          'Currency',
          'Dimension',
          'Temperature',
          'DateTime',
          'PhoneNumber',
          'IpAddress',
          'Boolean',
          'Email',
          'Hashtag',
          'URL',
        ],
        allowList: [
          'age',
          'currency',
          'dimension',
          'temperature',
          'number',
          'numberrange',
          'ordinal',
          'percentage',
          'email',
          'hashtag',
          'ip',
          'mention',
          'phonenumber',
          'url',
          'date',
          'daterange',
          'datetime',
          'datetimealt',
          'time',
          'set',
          'timerange',
          'timezone',
          'boolean',
          'duration',
          'datetimerange',
        ],
      },
      false
    );
  }

  translate(str, locale) {
    if (BuiltinDictionary[locale]) {
      const translation = BuiltinDictionary[locale][str];
      return translation !== '' ? translation : str;
    }
    return str;
  }

  inverseTranslate(str, locale) {
    if (BuiltinInverse[locale]) {
      const translation = BuiltinInverse[locale][str];
      if (translation && translation.length > 0) {
        return translation[0];
      }
    }
    return str;
  }

  calculateResolution(entity, locale) {
    const { resolution } = entity;
    if (['number', 'ordinal', 'percentage'].includes(entity.typeName)) {
      let resValue = resolution.value;
      if (resValue) {
        resValue = resValue.replace(',', '.');
      }
      const value = Number.parseFloat(resValue);
      return {
        strValue: resValue,
        value,
        subtype: value % 1 === 0 ? 'integer' : 'float',
      };
    }
    if (!resolution) {
      return undefined;
    }
    if (
      entity.typeName === 'datetimeV2.date' ||
      entity.typeName === 'datetimeV2.daterange' ||
      entity.typeName === 'datetimeV2.datetimerange'
    ) {
      if (resolution.values) {
        if (resolution.values.length === 1) {
          const resValue = resolution.values[0];
          const result = {
            type: resValue.type,
            timex: resValue.timex,
          };
          if (resValue.value) {
            result.strValue = resValue.value;
            result.date = new Date(resValue.value);
          } else if (resValue.start) {
            result.start = new Date(resValue.start);
            result.end = new Date(resValue.end);
            result.date = new Date(resValue.start);
          }
          return result;
        }
        if (resolution.values.length === 2) {
          const result = {
            type: 'interval',
            timex: resolution.values[0].timex,
          };
          if (resolution.values[0].value) {
            result.strPastValue = resolution.values[0].value;
            result.pastDate = new Date(result.strPastValue);
          }
          if (resolution.values[0].start) {
            result.strPastStartValue = resolution.values[0].start;
            result.pastStartDate = new Date(result.strPastStartValue);
          }
          if (resolution.values[0].end) {
            result.strPastEndValue = resolution.values[0].end;
            result.pastEndDate = new Date(result.strPastEndValue);
          }
          if (resolution.values[1].value) {
            result.strFutureValue = resolution.values[1].value;
            result.futureDate = new Date(result.strFutureValue);
          }
          if (resolution.values[1].start) {
            result.strFutureStartValue = resolution.values[1].start;
            result.futureStartDate = new Date(result.strFutureStartValue);
          }
          if (resolution.values[1].end) {
            result.strFutureEndValue = resolution.values[1].end;
            result.futureEndDate = new Date(result.strFutureEndValue);
          }
          return result;
        }
      }
    }
    if (resolution.unit) {
      const srcUnit = resolution.unit;
      resolution.srcUnit = srcUnit;
      resolution.unit = this.translate(srcUnit, locale);
      if (resolution.srcUnit === resolution.unit) {
        resolution.srcUnit = this.inverseTranslate(resolution.srcUnit, locale);
      }
    }
    if (resolution.srcUnit) {
      return {
        strValue: resolution.value,
        value: Number.parseFloat(resolution.value),
        unit: resolution.unit || resolution.srcUnit,
        localeUnit: resolution.srcUnit,
      };
    }
    return resolution;
  }

  prereduceEdges(edges) {
    for (let i = 0, l = edges.length; i < l; i += 1) {
      const edge = edges[i];
      if (!edge.discarded) {
        for (let j = i + 1; j < l; j += 1) {
          const other = edges[j];
          if (!other.discarded) {
            if (other.start === edge.start && other.end === edge.end) {
              if (other.entity === 'number' && edge.entity === 'ordinal') {
                other.discarded = true;
              } else if (
                other.entity === edge.entity &&
                other.accuracy === edge.accuracy &&
                ((!edge.resolution && !other.resolution) ||
                  (edge.resolution &&
                    other.resolution &&
                    edge.resolution.subtype === other.resolution.subtype))
              ) {
                other.discarded = true;
              } else if (
                other.entity === 'ordinal' &&
                edge.entity === 'number'
              ) {
                edge.discarded = true;
              } else if (
                other.entity === edge.entity &&
                edge.entity === 'number'
              ) {
                if (
                  (other.sourceText.includes(',') ||
                    other.sourceText.includes('.')) &&
                  parseFloat(other.sourceText.replace(',', '.')) !==
                    parseFloat(other.resolution.strValue.replace(',', '.'))
                ) {
                  other.discarded = true;
                }
                if (
                  (edge.sourceText.includes(',') ||
                    edge.sourceText.includes('.')) &&
                  parseFloat(edge.sourceText.replace(',', '.')) !==
                    parseFloat(edge.resolution.strValue.replace(',', '.'))
                ) {
                  edge.discarded = true;
                }
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

  findBuiltinEntities(utterance, locale, srcBuiltins) {
    const result = [];
    const source = [];
    const culture = getCulture(locale);
    const builtins = srcBuiltins || this.settings.builtins;
    builtins.forEach((name) => {
      try {
        const entities =
          name === 'Currency' && locale === 'pt'
            ? Recognizers[`recognize${name}`](utterance, getCulture('en'))
            : Recognizers[`recognize${name}`](utterance, culture);
        if (name === 'Number' && locale !== 'en') {
          entities.push(
            ...Recognizers.recognizeNumber(utterance, getCulture('en'))
          );
        }
        for (let i = 0; i < entities.length; i += 1) {
          const entity = entities[i];
          let entityName = entity.typeName;
          const index = entityName.lastIndexOf('.');
          if (index !== -1) {
            entityName = entityName.slice(index + 1);
          }
          entity.entity = entityName;
          source.push(entity);
          if (this.settings.builtinAllowList[entityName]) {
            const text = utterance.slice(entity.start, entity.end + 1);
            const accuracy = 0.95;
            const edge = {
              start: entity.start,
              end: entity.end,
              len: entity.end - entity.start + 1,
              accuracy,
              sourceText: text,
              utteranceText: text,
              entity: entity.entity,
              rawEntity: entity.typeName,
            };
            const resolution = this.calculateResolution(entity, locale);
            if (resolution) {
              edge.resolution = resolution;
            }
            result.push(edge);
          }
        }
      } catch (err) {
        //
      }
    });
    const reducedResult = this.prereduceEdges(result);
    return {
      edges: reducedResult,
      source,
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
    if (!input.sourceEntities) {
      input.sourceEntities = [];
    }
    for (let i = 0; i < entities.edges.length; i += 1) {
      input.edges.push(entities.edges[i]);
    }
    for (let i = 0; i < entities.source.length; i += 1) {
      input.sourceEntities.push(entities.source[i]);
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

module.exports = BuiltinMicrosoft;
