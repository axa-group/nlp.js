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

class UkrainianStemmer extends BaseStemmer {

  match(word, regex,replacement = '') {
    const src = word.str;
    word.str = word.str.replace(regex, replacement);
    return word.str !== src;
  }

  step1(word) {
    if (!this.match(word, /(?:[иы]в(?:ши(?:сь)?)?|(?<=[ая])(?:в(?:ши(?:сь)?)?))$/)) {
      this.match(word, /с[яьи]$/);
      if (this.match(word, /(?:[аеєуюя]|еє|ем|єє|ий|их|іх|ів|ій|ім|їй|ім|им|ими|іми|йми|ої|ою|ова|ове|ого|ому)$/)) {
        this.match(word, /(?:[аіу]|ій|ий|им|ім|их|йми|ого|ому|ою)$/);
      } else {
        if (!this.match(word, /(?:[еєую]|ав|али|ати|вши|ив|ити|ме|сь|ся|ши|учи|яти|ячи|ать|ять)$/g)) {
          this.match(word, /(?:[аеєіїийоуыьюя]|ам|ах|ами|ев|еві|еи|ей|ем|ею|єм|єю|ів|їв|ий|ием|ию|ия|иям|иях|ов|ові|ой|ом|ою|ью|ья|ям|ями|ях)$/g);
        }
      }
    }
  }

  step2(word) {
    this.match(word, /и$/);
  }

  step3(word) {
    if ((/[^аеиоуюяіїє][аеиоуюяіїє]+[^аеиоуюяіїє]+[аеиоуюяіїє].*(?<=о)сть?$/g).test(word.str)) {
      this.match(word, /ость$/);
    }
  }

  step4(word) {
    if (!this.match(word, /ь$/)) {
      this.match(word, /ейше$/);
      this.match(word, /нн$/, 'н');
    }
  }

  stem() {
    const word = { str: this.getCurrent(), start: '' };
    const matchVowel = word.str.match(/[аеиоуюяіїє]/);
    if (!matchVowel) {
      this.setCurrent(word.str);
      return;
    }
    word.start = word.str.slice(0, matchVowel.index + 1);
    const newStr = word.str.slice(matchVowel.index + 1);
    if (newStr === '') {
      this.setCurrent(word.str);
      return;
    }
    word.str = newStr;
    this.step1(word);
    this.step2(word);
    this.step3(word);
    this.step4(word);
    this.setCurrent(`${word.start}${word.str}`);
  }
}

module.exports = UkrainianStemmer;
