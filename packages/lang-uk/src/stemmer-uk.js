/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { BaseStemmer } = require('@nlpjs/core');

class StemmerUk extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-uk';
  }

  match(scrWord, regex, replacement = '') {
    const word = scrWord;
    const src = word.str;
    word.str = word.str.replace(regex, replacement);
    return word.str !== src;
  }

  replace(token, regex, replacement = '') {
    return token.replace(regex, replacement);
  }

  step1(word) {
    let srcWord = word;
    word = this.replace(word, /(?:[иы]в(?:ши(?:сь)?)?)$/);
    word = this.replace(word, /(?:а(?:в(?:ши(?:сь)?)?))$/, 'а');
    word = this.replace(word, /(?:я(?:в(?:ши(?:сь)?)?))$/, 'я');
    if (srcWord === word) {
      word = this.replace(word, /с[яьи]$/);
      srcWord = word;
      word = this.replace(
        word,
        /(?:[аеєуюя]|еє|ем|єє|ий|их|іх|ів|ій|ім|їй|ім|им|ими|іми|йми|ої|ою|ова|ове|ого|ому)$/
      );
      if (srcWord !== word) {
        word = this.replace(word, /(?:[аіу]|ій|ий|им|ім|их|йми|ого|ому|ою)$/);
      } else {
        srcWord = word;
        word = this.replace(
          word,
          /(?:[еєую]|ав|али|ати|вши|ив|ити|ме|сь|ся|ши|учи|яти|ячи|ать|ять)$/g
        );
        if (srcWord === word) {
          word = this.replace(
            word,
            /(?:[аеєіїийоуыьюя]|ам|ах|ами|ев|еві|еи|ей|ем|ею|єм|єю|ів|їв|ий|ием|ию|ия|иям|иях|ов|ові|ой|ом|ою|ью|ья|ям|ями|ях)$/g
          );
        }
      }
    }
    return word;
  }

  step2(word) {
    return this.replace(word, /и$/);
  }

  step3(word) {
    if (
      /[^аеиоуюяіїє][аеиоуюяіїє]+[^аеиоуюяіїє]+[аеиоуюяіїє].*oсть/g.exec(word)
    ) {
      word = this.replace(word, /ость$/);
    }
    return word;
  }

  step4(word) {
    const originalWord = word;
    word = this.replace(originalWord, /ь$/);
    if (originalWord === word) {
      word = this.replace(word, /ейше$/);
      word = this.replace(word, /нн$/, 'н');
    }
    return word;
  }

  innerStem() {
    let word = this.getCurrent();
    const matchVowel = /[аеиоуюяіїє]/.exec(word);
    if (!matchVowel) {
      this.setCurrent(word);
      return;
    }
    if (matchVowel.index !== undefined) {
      const start = word.slice(0, matchVowel.index + 1);
      word = word.slice(matchVowel.index + 1);
      if (word === '') {
        this.setCurrent(start);
        return;
      }
      word = this.step1(word);
      word = this.step2(word);
      word = this.step3(word);
      word = this.step4(word);
      this.setCurrent(`${start}${word}`);
      return;
    }
    this.setCurrent(word);
    this.setCurrent(`${word.start}${word.str}`);
  }
}

module.exports = StemmerUk;
