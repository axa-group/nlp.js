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

// allow for using compromise with react
const compromise = require('compromise');
const compromiseNumbers = require('compromise-numbers');
const compromiseDates = require('compromise-dates');

const nlp =
  compromise && typeof compromise.default === 'function'
    ? compromise.default
    : compromise;
const nlpDates =
  compromiseDates && typeof compromiseDates.default === 'function'
    ? compromiseDates.default
    : compromiseDates;
const nlpNumbers =
  compromiseNumbers && typeof compromiseNumbers.default === 'function'
    ? compromiseNumbers.default
    : compromiseNumbers;
nlp.extend(nlpDates);
nlp.extend(nlpNumbers);

const cultures = {
  bn: 'bn_BD',
  el: 'el_GR',
  en: 'en_US',
  hi: 'hi_IN',
  fa: 'fa_IR',
  gl: 'gl_ES',
  pt: 'pt_BR',
  sv: 'sv_SE',
  tl: 'tl_PH',
  ja: 'ja_JP',
  ar: 'ar_AE',
  hy: 'hy_AM',
  eu: 'eu_ES',
  ca: 'ca_ES',
  cs: 'cs_CZ',
  da: 'da_DK',
  ga: 'ga_IE',
  ta: 'ta_IN',
  uk: 'uk_UA',
  zh: 'zh_CN',
  no: 'nb_NO',
};

class BuiltinCompromise extends Clonable {
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
      this.settings.tag = `builtin-compromise`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
  }

  registerDefault() {
    this.container.registerConfiguration(this.settings.tag, {}, false);
  }

  async findBuiltinEntities(utterance) {
    function getDomainFromUrl(url) {
      // eslint-disable-next-line
      const matches = url.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      return matches && matches[1];
    }

    try {
      const edges = [];
      const extractor = nlp(utterance);
      const extractions = {
        hashtag: [extractor.hashTags()],
        person: [extractor.people()],
        place: [extractor.places()],
        organization: [extractor.organizations()],

        email: [
          extractor.emails(),
          function (result, data) {
            result.resolution = { value: data.text.replace(',', '', 'g') };
            return result;
          },
        ],
        phonenumber: [
          extractor.phoneNumbers(),
          function (result, data) {
            result.resolution = { value: data.text.replace(/[^0-9]/g, '') };
            return result;
          },
        ],
        date: [
          extractor.dates(),
          function (result, data) {
            result.resolution.value =
              data && data.date && data.date.start ? data.date.start : '';
            return result;
          },
        ],
        url: [
          extractor.urls(),
          function (result, data) {
            result.resolution.domain = getDomainFromUrl(data.text);
            return result;
          },
        ],
        number: [
          extractor.numbers(),
          function (result, data) {
            // check for ordinal
            if (nlp(data.text).numbers().text() === data.textOrdinal) {
              result.resolution = {
                strValue: data.textOrdinal,
                value: data.ordinal,
              };
              result.entity = 'ordinal';
            } else {
              result.resolution = {
                strValue: data.cardinal,
                value: data.number,
                subtype: data.number % 1 === 0 ? 'integer' : 'float',
              };
              result.entity = 'number';
            }
            return result;
          },
        ],
      };

      Object.keys(extractions).forEach((extractionKey) => {
        const extracted = extractions[extractionKey][0].json({ offset: true });

        extracted.forEach((data, eKey) => {
          if (data && data.text && data.offset) {
            const text = data.text.replace(',', '', 'g');
            let result = {
              start: data.offset.start,
              end: data.offset.start + text.length - 1,
              len: text.length,
              accuracy: 0.95,
              sourceText: text,
              utteranceText: text,
            };
            if (extracted.length > 1) {
              result.entity = `${extractionKey}_${eKey}`;
            } else {
              result.entity = extractionKey;
            }
            result.resolution = {
              value: text,
            };
            if (
              extractions[extractionKey].length > 1 &&
              extractions[extractionKey][1]
            ) {
              result = extractions[extractionKey][1](result, data);
            }
            edges.push(result);
          }
          return null;
        });
        return null;
      });
      return { edges };
    } catch (ex) {
      this.logger.error(ex);
      return { edges: [] };
    }
  }

  async extract(srcInput) {
    const input = srcInput;
    const entities = await this.findBuiltinEntities(
      input.text || input.utterance,
      input.locale
    );
    if (!input.edges) {
      input.edges = [];
    }
    if (!input.sourceEntities) {
      input.sourceEntities = [];
    }
    if (entities.edges) {
      for (let i = 0; i < entities.edges.length; i += 1) {
        input.edges.push(entities.edges[i]);
      }
    }
    if (entities.source) {
      for (let i = 0; i < entities.source.length; i += 1) {
        input.sourceEntities.push(entities.source[i]);
      }
    }
    return input;
  }

  run(srcInput) {
    const input = srcInput;
    const locale = input.locale || 'en';
    const extractor = this.container.get(`extract-builtin-${locale}`) || this;
    return extractor.extract(input);
  }

  static getCulture(locale) {
    const result = cultures[locale];
    if (result) {
      return result;
    }
    return locale ? `${locale}_${locale.toUpperCase()}` : 'en_US';
  }
}

module.exports = BuiltinCompromise;
