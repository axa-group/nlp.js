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
const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');

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

class BuiltinDuckling extends Clonable {
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
      this.settings.tag = `builtin-duckling`;
    }
    this.registerDefault();
    this.applySettings(
      this.settings,
      this.container.getConfiguration(this.settings.tag)
    );
    this.url = url.parse(this.settings.ducklingUrl);
    this.client = this.url.href.startsWith('https') ? https : http;
    this.port = this.url.port;
    if (!this.port) {
      this.port = this.url.href.startsWith('https') ? 443 : 80;
    }
  }

  registerDefault() {
    this.container.registerConfiguration(
      this.settings.tag,
      {
        ducklingUrl: process.env.DUCKLING_URL || 'http://localhost:8000/parse',
      },
      false
    );
  }

  // istanbul ignore next
  request(utterance, language) {
    return new Promise((resolve, reject) => {
      const postData = querystring.stringify({
        text: utterance,
        locale: BuiltinDuckling.getCulture(language),
      });

      const options = {
        host: this.url.hostname,
        port: this.port,
        method: 'POST',
        path: this.url.pathname,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length,
        },
      };
      const req = this.client.request(options, (res) => {
        let result = '';
        res.on('data', (chunk) => {
          result += chunk;
        });
        res.on('end', () => {
          try {
            const obj = JSON.parse(result);
            resolve(obj);
          } catch (err) {
            reject(err);
          }
        });
        res.on('error', (err) => reject(err));
      });
      req.on('error', (err) => reject(err));
      req.write(postData);
      req.end();
    });
  }

  transformEntity(entity) {
    const result = {
      start: entity.start,
      end: entity.start + entity.body.length - 1,
      len: entity.body.length,
      accuracy: 0.95,
      sourceText: entity.body,
      utteranceText: entity.body,
      rawEntity: entity.dim,
    };
    if (entity.dim === 'email') {
      result.entity = 'email';
      result.resolution = {
        value: entity.body,
      };
    } else if (entity.dim === 'phone-number') {
      result.entity = 'phonenumber';
      result.resolution = {
        value: entity.value.value,
      };
    } else if (entity.dim === 'url') {
      result.entity = 'url';
      result.resolution = {
        value: entity.value.value,
        domain: entity.value.domain,
      };
    } else if (entity.dim === 'number' || entity.dim === 'ordinal') {
      result.entity = entity.dim;
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        subtype: entity.value.value % 1 === 0 ? 'integer' : 'float',
      };
    } else if (entity.dim === 'distance') {
      result.entity = 'dimension';
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        unit: entity.value.unit,
        subtype: 'distance',
      };
    } else if (entity.dim === 'quantity') {
      result.entity = 'quantity';
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        unit: entity.value.unit,
        product: entity.value.product,
      };
    } else if (entity.dim === 'temperature') {
      result.entity = 'temperature';
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        unit: entity.value.unit,
      };
    } else if (entity.dim === 'volume') {
      result.entity = 'dimension';
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        unit: entity.value.unit,
        subtype: 'volume',
      };
    } else if (entity.dim === 'amount-of-money') {
      result.entity = 'currency';
      result.resolution = {
        strValue: entity.value.value.toString(),
        value: entity.value.value,
        unit: entity.value.unit,
      };
    } else if (entity.dim === 'duration') {
      result.entity = 'duration';
      result.resolution = {
        strValue: entity.value.normalized.value.toString(),
        value: entity.value.normalized.value,
        unit: entity.value.normalized.unit,
      };
    } else if (entity.dim === 'time') {
      result.entity = 'date';
      result.resolution = {
        value: entity.value.value,
        grain: entity.value.grain,
        values: entity.value.values,
      };
    }
    return result;
  }

  transform(entities) {
    return entities.map((x) => this.transformEntity(x));
  }

  async findBuiltinEntities(utterance, language) {
    try {
      const result = await this.request(utterance, language);
      return { edges: this.transform(result), source: result };
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

module.exports = BuiltinDuckling;
