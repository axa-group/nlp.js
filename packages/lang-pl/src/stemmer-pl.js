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

const { BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */
class StemmerPl extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-pl';
  }

  stemNoun(word) {
    let slice;
    if (word.length > 7) {
      slice = word.slice(-5);
      if (['zacja', 'zacji'].includes(slice)) {
        return word.slice(0, -4);
      }
    }
    if (word.length > 6) {
      slice = word.slice(-4);
      if (['acja', 'acji', 'tach', 'anie', 'enie', 'eniu', 'aniu'].includes(slice)) {
        return word.slice(0, -4);
      }
      if (slice === 'tyka') {
        return word.slice(0, -2);
      }
    }
    if (word.length > 5) {
      slice = word.slice(-3);
      if (['ach', 'ami', 'nia', 'niu', 'cia', 'ciu'].includes(slice)) {
        return word.slice(0, -3);
      }
      if (['cji', 'cja'].includes(slice)) {
        return word.slice(0, -2);
      }
      slice = word.slice(-2);
      if (['ce', 'ta'].includes(slice)) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemDiminutive(word) {
    let slice;
    if (word.length > 6) {
      slice = word.slice(-5);
      if (['eczek', 'iczek', 'iszek', 'aszek', 'uszek'].includes(slice)) {
        return word.slice(0, -5);
      }
      slice = word.slice(-4);
      if (['enek', 'ejek', 'erek'].includes(slice)) {
        return word.slice(0, -2);
      }
    }
    if (word.length > 4) {
      slice = word.slice(-2);
      if (['ek', 'ak'].includes(slice)) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemAdjective(word) {
    if (word.length > 7 && word.startsWith('naj')) {
      if (word.endsWith('szych')) {
        return word.slice(3, -5);
      }
      if (word.endsWith('sze') || word.endsWith('szy')) {
        return word.slice(3, -3);
      }
    }
    if (word.length > 6 && word.endsWith('czny')) {
      return word.slice(0, -4);
    }
    if (word.length > 5) {
      let slice = word.slice(-3);
      if (['owy', 'owa', 'owe', 'ych', 'ego'].includes(slice)) {
        return word.slice(0, -3);
      }
      if (word.endsWith('ej')) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemVerb(word) {
    let slice = word.slice(-3);
    if (word.length > 5) {
      if (['bym', 'esz', 'asz', 'cie', 'esc', 'asc', 'łem', 'amy', 'emy'].includes(slice)) {
        return word.slice(0, -3);
      }
    }
    if (word.length > 3) {
      if (['esz', 'asz', 'esc', 'asc', 'ec', 'ac'].includes(slice)) {
        return word.slice(0, -2);
      }
      slice = word.slice(-2);
      if (slice === 'aj') {
        return word.slice(0, -1);
      }
      if (['ac', 'em', 'am', 'ał', 'ił', 'ic', 'ac'].includes(slice)) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemAdverb(word) {
    if (word.length > 4) {
      const slice = word.slice(-3);
      if (['nie', 'wie', 'rze'].includes(slice)) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemPlural(word) {
    if (word.length > 4) {
      if (word.endsWith('ami')) {
        return word.slice(0, -3);
      }
      if (word.endsWith('ow') || word.endsWith('om')) {
        return word.slice(0, -2);
      }
    }
    return word;
  }

  stemGeneral(word) {
    if (word.length > 4) {
      if (word.endsWith('ia') || word.endsWith('ie')) {
        return word.slice(0, -2);
      }
      if (['u', 'a', 'i', 'e', 'ł', 'y'].includes(word[word.length - 1])) {
        return word.slice(0, -1);

      }
    }
    return word;
  }

  innerStem() {
    let current = this.getCurrent();
    current = this.stemNoun(current);
    current = this.stemDiminutive(current);
    current = this.stemAdjective(current);
    current = this.stemVerb(current);
    current = this.stemAdverb(current);
    current = this.stemPlural(current);
    current = this.stemGeneral(current);
    this.setCurrent(current)
  }
}

module.exports = StemmerPl;
