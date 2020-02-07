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

const { Among, BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */
class StemmerNe extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-ne';
    this.I_p1 = 0;
  }

  r_remove_category_1() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerNe.a_0);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 1:
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        lab0: {
          let v_1 = this.limit - this.cursor;
          lab1: {
            lab2: {
              let v_2 = this.limit - this.cursor;
              lab3: {
                if (!(this.eq_s_b('ए'))) {
                  break lab3;
                }
                break lab2;
              }
              this.cursor = this.limit - v_2;
              if (!(this.eq_s_b('े'))) {
                break lab1;
              }
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    return true;
  }

  r_check_category_2() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerNe.a_1) === 0) {
      return false;
    }
    this.bra = this.cursor;
    return true;
  };

  r_remove_category_2() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerNe.a_2);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 1:
        lab0: {
          let v_1 = this.limit - this.cursor;
          lab1: {
            if (!(this.eq_s_b('यौ'))) {
              break lab1;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          lab2: {
            if (!(this.eq_s_b('छौ'))) {
              break lab2;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          lab3: {
            if (!(this.eq_s_b('नौ'))) {
              break lab3;
            }
            break lab0;
          }
          this.cursor = this.limit - v_1;
          if (!(this.eq_s_b('थे'))) {
            return false;
          }
        }
        if (!this.slice_del()) {
          return false;
        }
        break;
      case 2:
        if (!(this.eq_s_b('त्र'))) {
          return false;
        }
        if (!this.slice_del()) {
          return false;
        }
        break;
    }
    return true;
  };

  r_remove_category_3() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerNe.a_3) == 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.slice_del()) {
      return false;
    }
    return true;
  };

  innerStem() {
    this.limit_backward = this.cursor; this.cursor = this.limit;
    let v_1 = this.limit - this.cursor;
    this.r_remove_category_1();
    this.cursor = this.limit - v_1;
    let v_2 = this.limit - this.cursor;
    lab0: {
      while (true) {
        let v_3 = this.limit - this.cursor;
        lab1: {
          let v_4 = this.limit - this.cursor;
          lab2: {
            let v_5 = this.limit - this.cursor;
            if (!this.r_check_category_2()) {
              break lab2;
            }
            this.cursor = this.limit - v_5;
            if (!this.r_remove_category_2()) {
              break lab2;
            }
          }
          this.cursor = this.limit - v_4;
          if (!this.r_remove_category_3()) {
            break lab1;
          }
          continue;
        }
        this.cursor = this.limit - v_3;
        break;
      }
    }
    this.cursor = this.limit - v_2;
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerNe.a_0 = [
  ["लाइ", -1, 1],
  ["लाई", -1, 1],
  ["सँग", -1, 1],
  ["संग", -1, 1],
  ["मार्फत", -1, 1],
  ["रत", -1, 1],
  ["का", -1, 2],
  ["मा", -1, 1],
  ["द्वारा", -1, 1],
  ["कि", -1, 2],
  ["पछि", -1, 1],
  ["की", -1, 2],
  ["ले", -1, 1],
  ["कै", -1, 2],
  ["सँगै", -1, 1],
  ["मै", -1, 1],
  ["को", -1, 2]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_1 = [
  ["ँ", -1, -1],
  ["ं", -1, -1],
  ["ै", -1, -1]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_2 = [
  ["ँ", -1, 1],
  ["ं", -1, 1],
  ["ै", -1, 2]
].map(x => new Among(x[0], x[1], x[2]));

StemmerNe.a_3 = [
  ["थिए", -1, 1],
  ["छ", -1, 1],
  ["इछ", 1, 1],
  ["एछ", 1, 1],
  ["िछ", 1, 1],
  ["ेछ", 1, 1],
  ["नेछ", 5, 1],
  ["हुनेछ", 6, 1],
  ["इन्छ", 1, 1],
  ["िन्छ", 1, 1],
  ["हुन्छ", 1, 1],
  ["एका", -1, 1],
  ["इएका", 11, 1],
  ["िएका", 11, 1],
  ["ेका", -1, 1],
  ["नेका", 14, 1],
  ["दा", -1, 1],
  ["इदा", 16, 1],
  ["िदा", 16, 1],
  ["देखि", -1, 1],
  ["माथि", -1, 1],
  ["एकी", -1, 1],
  ["इएकी", 21, 1],
  ["िएकी", 21, 1],
  ["ेकी", -1, 1],
  ["देखी", -1, 1],
  ["थी", -1, 1],
  ["दी", -1, 1],
  ["छु", -1, 1],
  ["एछु", 28, 1],
  ["ेछु", 28, 1],
  ["नेछु", 30, 1],
  ["नु", -1, 1],
  ["हरु", -1, 1],
  ["हरू", -1, 1],
  ["छे", -1, 1],
  ["थे", -1, 1],
  ["ने", -1, 1],
  ["एकै", -1, 1],
  ["ेकै", -1, 1],
  ["नेकै", 39, 1],
  ["दै", -1, 1],
  ["इदै", 41, 1],
  ["िदै", 41, 1],
  ["एको", -1, 1],
  ["इएको", 44, 1],
  ["िएको", 44, 1],
  ["ेको", -1, 1],
  ["नेको", 47, 1],
  ["दो", -1, 1],
  ["इदो", 49, 1],
  ["िदो", 49, 1],
  ["यो", -1, 1],
  ["इयो", 52, 1],
  ["भयो", 52, 1],
  ["ियो", 52, 1],
  ["थियो", 55, 1],
  ["दियो", 55, 1],
  ["थ्यो", 52, 1],
  ["छौ", -1, 1],
  ["इछौ", 59, 1],
  ["एछौ", 59, 1],
  ["िछौ", 59, 1],
  ["ेछौ", 59, 1],
  ["नेछौ", 63, 1],
  ["यौ", -1, 1],
  ["थियौ", 65, 1],
  ["छ्यौ", 65, 1],
  ["थ्यौ", 65, 1],
  ["छन्", -1, 1],
  ["इछन्", 69, 1],
  ["एछन्", 69, 1],
  ["िछन्", 69, 1],
  ["ेछन्", 69, 1],
  ["नेछन्", 73, 1],
  ["लान्", -1, 1],
  ["छिन्", -1, 1],
  ["थिन्", -1, 1],
  ["पर्", -1, 1],
  ["इस्", -1, 1],
  ["थिइस्", 79, 1],
  ["छस्", -1, 1],
  ["इछस्", 81, 1],
  ["एछस्", 81, 1],
  ["िछस्", 81, 1],
  ["ेछस्", 81, 1],
  ["नेछस्", 85, 1],
  ["िस्", -1, 1],
  ["थिस्", 87, 1],
  ["छेस्", -1, 1],
  ["होस्", -1, 1]
].map(x => new Among(x[0], x[1], x[2]));


module.exports = StemmerNe;
