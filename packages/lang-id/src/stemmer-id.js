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

const { Among, BaseStemmer } = require('@nlpjs/core');

/* eslint-disable */
class StemmerId extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-id';
    this.I_prefix = 0;
    this.I_measure = 0;
  }

  r_remove_particle() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerId.a_0) == 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.slice_del()) {
      return false;
    }
    this.I_measure -= 1;
    return true;
  }

  r_remove_possessive_pronoun() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerId.a_1) == 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.slice_del()) {
      return false;
    }
    this.I_measure -= 1;
    return true;
  }

  r_SUFFIX_KAN_OK() {
    if (!(I_prefix != 3)) {
      return false;
    }
    if (!(I_prefix != 2)) {
      return false;
    }
    return true;
  }

  r_SUFFIX_AN_OK() {
    if (!(I_prefix != 1)) {
      return false;
    }
    return true;
  }

  r_SUFFIX_I_OK() {
    if (!(I_prefix <= 2)) {
      return false;
    }
    {
      const v_1 = this.limit - this.cursor;
      lab0: {
        if (!this.eq_s_b('s')) {
          break lab0;
        }
        return false;
      }
      this.cursor = this.limit - v_1;
    }
    return true;
  }

  r_remove_suffix() {
    this.ket = this.cursor;
    if (this.find_among_b(StemmerId.a_2) == 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.slice_del()) {
      return false;
    }
    this.I_measure -= 1;
    return true;
  }

  r_VOWEL() {
    if (!this.in_grouping(StemmerId.g_vowel, 97, 117)) {
      return false;
    }
    return true;
  }

  r_KER() {
    if (!this.out_grouping(StemmerId.g_vowel, 97, 117)) {
      return false;
    }
    if (!this.eq_s('er')) {
      return false;
    }
    return true;
  }

  r_remove_first_order_prefix() {
    let /** number */ among_var;
    this.bra = this.cursor;
    among_var = this.find_among(StemmerId.a_3);
    if (among_var == 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 1:
        if (!this.slice_del()) {
          return false;
        }
        this.I_prefix = 1;
        this.I_measure -= 1;
        break;
      case 2:
        if (!this.slice_del()) {
          return false;
        }
        this.I_prefix = 3;
        this.I_measure -= 1;
        break;
      case 3:
        this.I_prefix = 1;
        if (!this.slice_from('s')) {
          return false;
        }
        this.I_measure -= 1;
        break;
      case 4:
        this.I_prefix = 3;
        if (!this.slice_from('s')) {
          return false;
        }
        this.I_measure -= 1;
        break;
      case 5:
        this.I_prefix = 1;
        this.I_measure -= 1;
        lab0: {
          const v_1 = this.cursor;
          lab1: {
            const v_2 = this.cursor;
            if (!this.in_grouping(StemmerId.g_vowel, 97, 117)) {
              break lab1;
            }
            this.cursor = v_2;
            if (!this.slice_from('p')) {
              return false;
            }
            break lab0;
          }
          this.cursor = v_1;
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
      case 6:
        this.I_prefix = 3;
        this.I_measure -= 1;
        lab2: {
          const v_3 = this.cursor;
          lab3: {
            const v_4 = this.cursor;
            if (!this.in_grouping(StemmerId.g_vowel, 97, 117)) {
              break lab3;
            }
            this.cursor = v_4;
            if (!this.slice_from('p')) {
              return false;
            }
            break lab2;
          }
          this.cursor = v_3;
          if (!this.slice_del()) {
            return false;
          }
        }
        break;
    }
    return true;
  }

  r_remove_second_order_prefix() {
    let among_var;
    this.bra = this.cursor;
    among_var = this.find_among(StemmerId.a_4);
    if (among_var == 0) {
      return false;
    }
    this.ket = this.cursor;
    switch (among_var) {
      case 1:
        if (!this.slice_del()) {
          return false;
        }
        this.I_prefix = 2;
        this.I_measure -= 1;
        break;
      case 2:
        if (!this.slice_from('ajar')) {
          return false;
        }
        this.I_measure -= 1;
        break;
      case 3:
        if (!this.slice_del()) {
          return false;
        }
        this.I_prefix = 4;
        this.I_measure -= 1;
        break;
      case 4:
        if (!this.slice_from('ajar')) {
          return false;
        }
        this.I_prefix = 4;
        this.measure -= 1;
        break;
    }
    return true;
  }

  innerbStem() {
    this.I_measure = 0;
    const /** number */ v_1 = this.cursor;
    {
      while (true) {
        const /** number */ v_2 = this.cursor;
        lab1: {
          while (true) {
            lab3: {
              if (!this.in_grouping(StemmerId.g_vowel, 97, 117)) {
                break lab3;
              }
              break;
            }
            if (this.cursor >= this.limit) {
              break lab1;
            }
            this.cursor++;
          }
          this.I_measure += 1;
          continue;
        }
        this.cursor = v_2;
        break;
      }
    }
    this.cursor = v_1;
    if (!(this.I_measure > 2)) {
      return false;
    }
    this.I_prefix = 0;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    const /** number */ v_4 = this.limit - this.cursor;
    this.r_remove_particle();
    this.cursor = this.limit - v_4;
    if (!(this.I_measure > 2)) {
      return false;
    }
    const /** number */ v_5 = this.limit - this.cursor;
    this.r_remove_possessive_pronoun();
    this.cursor = this.limit - v_5;
    this.cursor = this.limit_backward;
    if (!(this.I_measure > 2)) {
      return false;
    }
    lab4: {
      const /** number */ v_6 = this.cursor;
      lab5: {
        const /** number */ v_7 = this.cursor;
        if (!this.r_remove_first_order_prefix()) {
          break lab5;
        }
        const /** number */ v_8 = this.cursor;
        lab6: {
          const /** number */ v_9 = this.cursor;
          if (!(this.I_measure > 2)) {
            break lab6;
          }
          this.limit_backward = this.cursor;
          this.cursor = this.limit;
          if (!this.r_remove_suffix()) {
            break lab6;
          }
          this.cursor = this.limit_backward;
          this.cursor = v_9;
          if (!(this.I_measure > 2)) {
            break lab6;
          }
          if (!this.r_remove_second_order_prefix()) {
            break lab6;
          }
        }
        this.cursor = v_8;
        this.cursor = v_7;
        break lab4;
      }
      this.cursor = v_6;
      const /** number */ v_10 = this.cursor;
      // call remove_second_order_prefix, line 189
      this.r_remove_second_order_prefix();
      this.cursor = v_10;
      // do, line 190
      const /** number */ v_11 = this.cursor;
      lab7: {
        if (!(this.I_measure > 2)) {
          break lab7;
        }
        this.limit_backward = this.cursor;
        this.cursor = this.limit;
        if (!this.r_remove_suffix()) {
          break lab7;
        }
        this.cursor = this.limit_backward;
      }
      this.cursor = v_11;
    }
    return true;
  }


  innerStem() {
    const current = this.getCurrent();
    this.innerbStem();
    for (let i = 5; i > 0; i -= 1) {
      if (current.length - i > 2) {
        if (StemmerId[`suffixes${i}`][current.slice(-i)]) {
          this.setCurrent(current.slice(0, -i));
          i = 0;
        }
      }
    }
  }
}

StemmerId.a_0 = [
  ['kah', -1, 1],
  ['lah', -1, 1],
  ['pun', -1, 1],
].map(x => new Among(x[0], x[1], x[2]));

StemmerId.a_1 = [
  ['nya', -1, 1],
  ['ku', -1, 1],
  ['mu', -1, 1],
].map(x => new Among(x[0], x[1], x[2]));

StemmerId.a_2 = [
  ['i', -1, 1],
  ['an', -1, 1],
  ['kan', 1, 1],
].map(x => new Among(x[0], x[1], x[2]));

StemmerId.a_3 = [
  ['di', -1, 1],
  ['ke', -1, 2],
  ['me', -1, 1],
  ['mem', 2, 5],
  ['men', 2, 1],
  ['meng', 4, 1],
  ['meny', 4, 3],
  ['pem', -1, 6],
  ['pen', -1, 2],
  ['peng', 8, 2],
  ['peny', 8, 4],
  ['ter', -1, 1],
].map(x => new Among(x[0], x[1], x[2]));

StemmerId.a_4 = [
  ['be', -1, 3],
  ['belajar', 0, 4],
  ['ber', 0, 3],
  ['pe', -1, 1],
  ['pelajar', 3, 2],
  ['per', 3, 1],
].map(x => new Among(x[0], x[1], x[2]));

StemmerId.suffixes5 = {
  iskos: 1,
  iskas: 1,
  anciu: 1,
  ingas: 1,
  jamas: 1,
  intas: 1,
  antis: 1,
  uotas: 1,
  iskai: 1,
  damas: 1,
  iuose: 1,
};

StemmerId.suffixes4 = {
  iant: 1,
  isku: 1,
  iaus: 1,
  ingu: 1,
  iems: 1,
  jami: 1,
  asis: 1,
  dama: 1,
  ytas: 1,
  iska: 1,
  inta: 1,
  dami: 1,
  uoja: 1,
  inga: 1,
  jama: 1,
  iame: 1,
  amos: 1,
  uota: 1,
  iams: 1,
  inti: 1,
  uoti: 1,
  amas: 1,
  emis: 1,
  uose: 1,
  davo: 1,
  omis: 1,
  iais: 1,
};

StemmerId.suffixes3 = {
  aja: 1,
  oti: 1,
  amu: 1,
  ias: 1,
  ies: 1,
  osi: 1,
  iam: 1,
  eja: 1,
  ems: 1,
  eti: 1,
  ziu: 1,
  yta: 1,
  aus: 1,
  ojo: 1,
  iui: 1,
  oms: 1,
  usi: 1,
  ese: 1,
  ami: 1,
  yje: 1,
  ejo: 1,
  yti: 1,
  ant: 1,
  ose: 1,
  ios: 1,
  ama: 1,
  ams: 1,
  eje: 1,
  oje: 1,
  ais: 1,
  ius: 1,
  iai: 1,
};

StemmerId.suffixes2 = {
  ki: 1,
  ei: 1,
  ys: 1,
  ia: 1,
  ui: 1,
  ti: 1,
  io: 1,
  is: 1,
  us: 1,
  os: 1,
  ai: 1,
  es: 1,
  iu: 1,
  as: 1,
};

StemmerId.suffixes1 = {
  s: 1,
  i: 1,
  o: 1,
  e: 1,
  u: 1,
  a: 1,
};

StemmerId.g_vowel = [17, 65, 16];

module.exports = StemmerId;
