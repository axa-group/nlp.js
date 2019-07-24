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

const BaseStemmer = require('./base-stemmer');

class TagalogStemmer extends BaseStemmer {
  countSyllables(word) {
    if (!word) {
      return 0;
    }
    const match = word
      .toString()
      .replace('(?![aeiou])', '')
      .match(/[aeiou]/g);
    return match ? match.length : 0;
  }

  hasPrefix(word, prefix) {
    if (!word) {
      return false;
    }
    return prefix instanceof RegExp
      ? word.match(prefix)
      : word.indexOf(prefix) === 0;
  }

  hasSuffix(word, suffix) {
    if (!word) {
      return false;
    }
    return word.lastIndexOf(suffix) === word.length - suffix.length;
  }

  replaceAt(word, index, c) {
    if (!word) {
      return word;
    }
    return `${word.slice(0, index)}${c}${word.slice(index + 1, word.length)}`;
  }

  removePrefix(word) {
    const syllables = this.countSyllables(word);
    if (syllables < 3) {
      return word;
    }
    for (let i = 0; i < TagalogStemmer.prefixes.length; i += 1) {
      const prefix = TagalogStemmer.prefixes[i];
      if (
        this.hasPrefix(word, prefix) &&
        syllables - this.countSyllables(prefix) > 1
      ) {
        return word.replace(prefix, '').replace(/^-/, '');
      }
    }
    return word;
  }

  removeSuffix(srcWord) {
    let word = srcWord;
    let removed;
    const syllables = this.countSyllables(word);
    for (let i = 0; i < TagalogStemmer.suffixes.length; i += 1) {
      const suffix = TagalogStemmer.suffixes[i];
      if (
        this.hasSuffix(word, suffix) &&
        syllables - this.countSyllables(suffix) > 1
      ) {
        word = word.slice(0, word.length - suffix.length);
        removed = suffix;
        break;
      }
    }
    if (removed && removed.length === 3 && word[word.length - 1] === 'u') {
      word = this.replaceAt(word, word.length - 1, 'o');
    }
    if (removed && removed.length === 2 && word[word.length - 2] === 'u') {
      word = this.replaceAt(word, word.length - 2, 'o');
    }
    if (removed && removed.length === 2 && word[word.length - 1] === 'u') {
      word = this.replaceAt(word, word.length - 1, 'o');
    }
    return word;
  }

  removeInfix(word) {
    if (word.length < 5) {
      return word;
    }
    for (let i = 0; i < TagalogStemmer.infixes.length > 0; i += 1) {
      const infix = TagalogStemmer.infixes[i];
      const index = word.indexOf(infix);
      if (index === 0) {
        return word.slice(index + infix.length);
      }
      if (index === 1) {
        return word[0] + word.slice(infix.length + 1);
      }
    }
    return word;
  }

  removePartialReduplication(word) {
    if (word[0] === word[1]) {
      return word.slice(1);
    }
    if (word[0] === word[2] && word[1] === word[3]) {
      return word.slice(2);
    }
    return word;
  }

  removeFullReduplication(word) {
    const middle = Math.floor(word.length / 2);
    const firstSlice = word.slice(0, middle);
    return firstSlice === word.slice(middle) ? firstSlice : word;
  }

  stem() {
    let word = this.getCurrent();
    word = this.removePrefix(word);
    word = this.removeSuffix(word);
    word = this.removeInfix(word);
    word = this.removePartialReduplication(word);
    word = this.removeFullReduplication(word);
    this.setCurrent(word);
  }
}

TagalogStemmer.prefixes = [
  /^gangga/,
  /^gaga/,
  /^ga/,
  /^ikapakapagpaka/,
  /^ikapakapagpa/,
  /^ikapakapang/,
  /^ikapakapag(?![aeiou])/,
  /^ikapakapam/,
  /^ikapakapan/,
  /^ikapagpaka/,
  /^ikapakipan/,
  /^ikapakipag(?![aeiou])/,
  /^ikapakipam/,
  /^ikapakipa/,
  /^ipakipag(?![aeiou])/,
  /^ipagkang/,
  /^ikapagpa/,
  /^ikapaka/,
  /^ikapaki/,
  /^ikapang/,
  /^ipakipa/,
  /^ikapag(?![aeiou])/,
  /^ikapam/,
  /^ikapan/,
  /^ipagka/,
  /^ipagpa/,
  /^ipaka/,
  /^ipaki/,
  /^ikapa/,
  /^ipang/,
  /^ikang/,
  /^ipag(?![aeiou])/,
  /^ikam/,
  /^ikan/,
  /^isa/,
  /^ipa/,
  /^kasing/,
  /^kamaka/,
  /^kanda/,
  /^kasim/,
  /^kasin/,
  /^kamag/,
  /^kaka/,
  /^ka/,
  /^mangagsipagpaka/,
  /^mangagsipag(?![aeiou])/,
  /^mangagpaka/,
  /^magsipagpa/,
  /^makapagpa/,
  /^mangagsi/,
  /^mangagpa/,
  /^magsipag(?![aeiou])/,
  /^mangagka/,
  /^magkang/,
  /^magpaka/,
  /^magpati/,
  /^makapag(?![aeiou])/,
  /^mapapag(?![aeiou])/,
  /^mapang/,
  /^mapasa/,
  /^mapapa/,
  /^mangag/,
  /^manga/,
  /^magka/,
  /^magpa/,
  /^magsa/,
  /^mapag(?![aeiou])/,
  /^mapam/,
  /^mapan/,
  /^mapa/,
  /^mang/,
  /^maka/,
  /^maki/,
  /^mam/,
  /^man/,
  /^mag(?![aeiou])/,
  /^ma/,
  /^nangagsipagpaka/,
  /^nangagsipagpa/,
  /^nagsipagpaka/,
  /^nakapagpaka/,
  /^nangagsipag(?![aeiou])/,
  /^nangagpaka/,
  /^nangagkaka/,
  /^nagsipagpa/,
  /^nakapagpa/,
  /^nagsipag(?![aeiou])/,
  /^nangagpa/,
  /^nangagka/,
  /^nangagsi/,
  /^nakapag(?![aeiou])/,
  /^nakipag(?![aeiou])/,
  /^napapag(?![aeiou])/,
  /^nagpaka/,
  /^nagpati/,
  /^nangag/,
  /^napaka/,
  /^napasa/,
  /^nanga/,
  /^nagka/,
  /^nagpa/,
  /^nagsa/,
  /^nagsi/,
  /^napag(?![aeiou])/,
  /^naka/,
  /^naki/,
  /^nang/,
  /^napa/,
  /^nag/,
  /^na/,
  /^pagpapati/,
  /^pagpapaka/,
  /^pagpapa/,
  /^pagsasa/,
  /^pasasa/,
  /^pakiki/,
  /^pinaka/,
  /^pinag/,
  /^pinag/,
  /^papag(?![aeiou])/,
  /^pampa/,
  /^panag/,
  /^pagka/,
  /^paka/,
  /^paki/,
  /^pala/,
  /^pang/,
  /^pani/,
  /^papa/,
  /^para/,
  /^pasa/,
  /^pati/,
  /^pina/,
  /^pag(?![aeiou])/,
  /^pam/,
  /^pan/,
  /^pa/,
  /^sang/,
  /^sing/,
  /^sin/,
  /^tagapag(?![aeiou])/,
  /^taga/,
  /^tiga/,
  /^tag/,
  /^tig/,
  /^um/,
];

TagalogStemmer.suffixes = ['han', 'hin', 'an', 'in', 'ng'];

TagalogStemmer.infixes = ['in', 'um'];

module.exports = TagalogStemmer;
