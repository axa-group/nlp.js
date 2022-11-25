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

const languageData = require('./languages.json');
const data = require('./data.json');

const scripts = {
  cmn: /[\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9]|[\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/g,
  Latin:
    /[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]/g,
  Cyrillic:
    /[\u0400-\u0484\u0487-\u052F\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69D\uA69F]/g,
  Arabic:
    /[\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061E\u0620-\u063F\u0641-\u064A\u0656-\u065F\u066A-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0-\u08B2\u08E4-\u08FF\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFD\uFE70-\uFE74\uFE76-\uFEFC]|\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]/g,
  ben: /[\u0980-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FB]/g,
  Devanagari: /[\u0900-\u0950\u0953-\u0963\u0966-\u097F\uA8E0-\uA8FB]/g,
  jpn: /[\u3041-\u3096\u309D-\u309F]|\uD82C\uDC01|\uD83C\uDE00|[\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D]|\uD82C\uDC00/g,
  kor: /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/g,
  tel: /[\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7F]/g,
  tam: /[\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA]/g,
  guj: /[\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1]/g,
  kan: /[\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2]/g,
  mal: /[\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D75\u0D79-\u0D7F]/g,
  Myanmar: /[\u1000-\u109F\uA9E0-\uA9FE\uAA60-\uAA7F]/g,
  ori: /[\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77]/g,
  pan: /[\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75]/g,
  Ethiopic:
    /[\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]/g,
  tha: /[\u0E01-\u0E3A\u0E40-\u0E5B]/g,
  sin: /[\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4]|\uD804[\uDDE1-\uDDF4]/g,
  ell: /[\u0370-\u0373\u0375-\u0377\u037A-\u037D\u037F\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126\uAB65]|\uD800[\uDD40-\uDD8C\uDDA0]|\uD834[\uDE00-\uDE45]/g,
  khm: /[\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF]/g,
  hye: /[\u0531-\u0556\u0559-\u055F\u0561-\u0587\u058A\u058D-\u058F\uFB13-\uFB17]/g,
  sat: /[\u1C50-\u1C7F]/g,
  bod: /[\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA]/g,
  Hebrew:
    /[\u0591-\u05C7\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F]/g,
  kat: /[\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u2D00-\u2D25\u2D27\u2D2D]/g,
  lao: /[\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF]/g,
  zgh: /[\u2D30-\u2D67\u2D6F\u2D70\u2D7F]/g,
  iii: /[\uA000-\uA48C\uA490-\uA4C6]/g,
  aii: /[\u0700-\u070D\u070F-\u074A\u074D-\u074F]/g,
};

const scriptKeys = Object.keys(scripts);

const und = () => [['und', 1]];

class Language {
  constructor() {
    this.languagesAlpha3 = {};
    this.languagesAlpha2 = {};
    this.extraSentences = [];
    this.buildData();
  }

  static getTrigrams(srcValue) {
    const result = [];
    const value = srcValue
      ? ` ${String(srcValue)
          .replace(/[\u0021-\u0040]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase()} `
      : '';
    if (!value || value.length < 3) {
      return result;
    }
    for (let i = 0, l = value.length - 2; i < l; i += 1) {
      result[i] = value.substr(i, 3);
    }
    return result;
  }

  static asTuples(value) {
    const dictionary = Language.getTrigrams(value).reduce(
      (srcprev, current) => {
        const prev = srcprev;
        prev[current] = (prev[current] || 0) + 1;
        return prev;
      },
      {}
    );
    const tuples = [];
    Object.keys(dictionary).forEach((key) => {
      tuples.push([key, dictionary[key]]);
    });
    tuples.sort((a, b) => a[1] - b[1]);
    return tuples;
  }

  static getDistance(trigrams, model) {
    let distance = 0;
    trigrams.forEach((currentTrigram) => {
      distance +=
        currentTrigram[0] in model
          ? Math.abs(currentTrigram[1] - model[currentTrigram[0]] - 1)
          : 300;
    });
    return distance;
  }

  static getOccurrence(value, expression) {
    const count = value.match(expression);
    return (count ? count.length : 0) / value.length || 0;
  }

  static isLatin(value) {
    let total = 0;
    const half = value.length / 2;
    for (let i = 0; i < value.length; i += 1) {
      const c = value.charCodeAt(i);
      if (c >= 32 && c <= 126) {
        total += 1;
        if (total > half) {
          return true;
        }
      }
    }
    return total > half;
  }

  static getTopScript(value) {
    if (Language.isLatin(value)) {
      return ['Latin', 1];
    }
    let topCount = -1;
    let topScript;
    for (let i = 0; i < scriptKeys.length; i += 1) {
      const script = scriptKeys[i];
      const count = Language.getOccurrence(value, scripts[script]);
      if (count > topCount) {
        topCount = count;
        topScript = script;
        if (topCount === 1) {
          return [topScript, topCount];
        }
      }
    }
    return [topScript, topCount];
  }

  static filterLanguages(languages, allowList, denyList) {
    if (allowList.length === 0 && denyList.length === 0) {
      return languages;
    }
    const filteredLanguages = {};
    Object.keys(languages).forEach((language) => {
      if (
        (allowList.length === 0 || allowList.indexOf(language) > -1) &&
        denyList.indexOf(language) === -1
      ) {
        filteredLanguages[language] = languages[language];
      }
    });
    return filteredLanguages;
  }

  static getDistances(trigrams, srcLanguages, options) {
    const distances = [];
    const allowList = options.allowList || [];
    const denyList = options.denyList || [];
    const languages = Language.filterLanguages(
      srcLanguages,
      allowList,
      denyList
    );
    if (!languages) {
      return und();
    }
    Object.keys(languages).forEach((language) => {
      distances.push([
        language,
        Language.getDistance(trigrams, languages[language]),
      ]);
    });
    return distances.sort((a, b) => a[1] - b[1]);
  }

  static detectAll(srcValue, settings = {}) {
    const minLength = settings.minLength || 10;
    if (!srcValue || srcValue.length < minLength) {
      return und();
    }
    const value = srcValue.substr(0, 2048);
    const script = Language.getTopScript(value);
    if (!(script[0] in data) && script[1] > 0.5) {
      if (settings.allowList) {
        if (settings.allowList.includes(script[0])) {
          return [[script[0], 1]];
        }
        if (script[0] === 'cmn' && settings.allowList.includes('jpn')) {
          return [['jpn', 1]];
        }
      } else {
        return [[script[0], 1]];
      }
    }

    if (data[script[0]]) {
      const distances = Language.getDistances(
        Language.asTuples(value),
        data[script[0]],
        settings
      );
      if (distances[0][0] === 'und') {
        return [[script[0], 1]];
      }
      const min = distances[0][1];
      const max = value.length * 300 - min;
      return distances.map((d) => [d[0], 1 - (d[1] - min) / max || 0]);
    }
    return [[script[0], 1]];
  }

  buildData() {
    for (let i = 0; i < languageData.length; i += 1) {
      const language = {
        alpha2: languageData[i][0],
        alpha3: languageData[i][1],
        name: languageData[i][2],
      };
      this.languagesAlpha3[language.alpha3] = language;
      this.languagesAlpha2[language.alpha2] = language;
    }
  }

  transformAllowList(allowList) {
    const result = [];
    for (let i = 0; i < allowList.length; i += 1) {
      if (allowList[i].length === 3) {
        result.push(allowList[i]);
      } else {
        const language = this.languagesAlpha2[allowList[i]];
        if (language) {
          result.push(language.alpha3);
        }
      }
    }
    return result;
  }

  guess(utterance, allowList, limit) {
    const options = {};
    if (utterance.length < 10) {
      options.minLength = utterance.length;
    }
    if (allowList && allowList.length && allowList.length > 0) {
      options.allowList = this.transformAllowList(allowList);
    }
    const scores = Language.detectAll(utterance, options);
    const result = [];
    for (let i = 0; i < scores.length; i += 1) {
      const language = this.languagesAlpha3[scores[i][0]];
      if (language) {
        result.push({
          alpha3: language.alpha3,
          alpha2: language.alpha2,
          language: language.name,
          score: scores[i][1],
        });
        if (limit && result.length >= limit) {
          break;
        }
      }
    }
    return result;
  }

  /**
   * Given an utterance, an allow list of iso codes and the limit of results,
   * return the language with the best score.
   * The allowList is optional.
   * @param {String} utterance Utterance wich we want to guess the language.
   * @param {String[]} allowList allowList of accepted languages.
   * @return {Object} Best guess.
   */
  guessBest(utterance, allowList) {
    return this.guess(utterance, allowList, 1)[0];
  }

  addTrigrams(locale, sentence) {
    const language = this.languagesAlpha2[locale];
    const iso3 = language ? language.alpha3 : locale;
    const script = Language.getTopScript(sentence)[0];
    const trigrams = Language.getTrigrams(sentence);
    if (data[script]) {
      if (!data[script][iso3]) {
        data[script][iso3] = {};
      }
      trigrams.forEach((trigram) => {
        data[script][iso3][trigram] = 1;
      });
    }
  }

  addExtraSentence(locale, sentence) {
    this.extraSentences.push([locale, sentence]);
    this.addTrigrams(locale, sentence);
  }

  processExtraSentences() {
    this.extraSentences.forEach((item) => {
      this.addTrigrams(item[0], item[1]);
    });
  }

  static lansplit(s) {
    if (s.includes('|')) {
      return s.split('|');
    }
    const result = [];
    for (let i = 0; i < s.length; i += 3) {
      result.push(s.substr(i, 3));
    }
    return result;
  }

  static addModel(script, name, value) {
    const languages = data[script];
    const model = Language.lansplit(value);
    let weight = model.length;
    const trigrams = {};
    while (weight > 0) {
      weight -= 1;
      trigrams[model[weight]] = weight;
    }
    languages[name] = trigrams;
  }

  addModel(script, name, value) {
    Language.addModel(script, name, value);
  }

  static buildModel() {
    Object.keys(data).forEach((script) => {
      const languages = data[script];
      Object.keys(languages).forEach((name) => {
        Language.addModel(script, name, languages[name]);
      });
    });
  }
}

Language.buildModel();

module.exports = Language;
