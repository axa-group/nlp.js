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
class StemmerCs extends BaseStemmer {
  constructor(container) {
    super(container);
    this.name = 'stemmer-cs';
    this.I_p1 = 0;
    this.I_pV = 0;
  }

  r_mark_regions() {
    let v_1;
    this.I_pV = this.limit;
    this.I_p1 = this.limit;
    v_1 = this.cursor;
    lab0: do {
      golab1: while (true) {
        lab2: do {
          if (!this.out_grouping(StemmerCs.g_v, 97, 367)) {
            break lab2;
          }
          break golab1;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_pV = this.cursor;
      golab3: while (true) {
        lab4: do {
          if (!this.out_grouping(StemmerCs.g_v, 97, 367)) {
            break lab4;
          }
          break golab3;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      golab5: while (true) {
        lab6: do {
          if (!this.in_grouping(StemmerCs.g_v, 97, 367)) {
            break lab6;
          }
          break golab5;
        } while (false);
        if (this.cursor >= this.limit) {
          break lab0;
        }
        this.cursor++;
      }
      this.I_p1 = this.cursor;
    } while (false);
    this.cursor = v_1;
    return true;
  }
  r_RV() {
    if (!(this.I_pV <= this.cursor)) {
      return false;
    }
    return true;
  }
  r_R1() {
    if (!(this.I_p1 <= this.cursor)) {
      return false;
    }
    return true;
  }
  r_palatalise() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_0);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.r_RV()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_from('k');
        break;
      case 2:
        this.slice_from('h');
        break;
      case 3:
        this.slice_from('ck');
        break;
      case 4:
        this.slice_from('sk');
        break;
    }
    return true;
  }
  r_do_possessive() {
    let among_var;
    let v_1;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_1);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.r_RV()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_del();
        v_1 = this.limit - this.cursor;
        lab0: do {
          if (!this.r_palatalise()) {
            this.cursor = this.limit - v_1;
            break lab0;
          }
        } while (false);
        break;
    }
    return true;
  }
  r_do_case() {
    let among_var;
    let v_1;
    let v_2;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_2);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_del();
        v_1 = this.limit - this.cursor;
        lab0: do {
          if (!this.r_palatalise()) {
            this.cursor = this.limit - v_1;
            break lab0;
          }
        } while (false);
        break;
      case 3:
        this.slice_from('e');
        v_2 = this.limit - this.cursor;
        lab1: do {
          if (!this.r_palatalise()) {
            this.cursor = this.limit - v_2;
            break lab1;
          }
        } while (false);
        break;
    }
    return true;
  }
  r_do_derivational() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_3);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    if (!this.r_R1()) {
      return false;
    }
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_from('i');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 3:
        this.slice_from('e');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 4:
        this.slice_from('\u00E9');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 5:
        this.slice_from('\u011B');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 6:
        this.slice_from('\u00ED');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
    }
    return true;
  }
  r_do_deriv_single() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_4);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
    }
    return true;
  }
  r_do_augmentative() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_5);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_from('i');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
    }
    return true;
  }
  r_do_diminutive() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_6);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_del();
        break;
      case 2:
        this.slice_from('e');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 3:
        this.slice_from('\u00E9');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 4:
        this.slice_from('i');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 5:
        this.slice_from('\u00ED');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 6:
        this.slice_from('\u00E1');
        break;
      case 7:
        this.slice_from('a');
        break;
      case 8:
        this.slice_from('o');
        break;
      case 9:
        this.slice_from('u');
        break;
    }
    return true;
  }
  r_do_comparative() {
    let among_var;
    this.ket = this.cursor;
    among_var = this.find_among_b(StemmerCs.a_7);
    if (among_var === 0) {
      return false;
    }
    this.bra = this.cursor;
    switch (among_var) {
      case 0:
        return false;
      case 1:
        this.slice_from('\u011B');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
      case 2:
        this.slice_from('e');
        if (!this.r_palatalise()) {
          return false;
        }
        break;
    }
    return true;
  }
  r_do_aggressive() {
    let v_1;
    let v_2;
    let v_3;
    let v_4;
    v_1 = this.limit - this.cursor;
    lab0: do {
      if (!this.r_do_comparative()) {
        break lab0;
      }
    } while (false);
    this.cursor = this.limit - v_1;
    v_2 = this.limit - this.cursor;
    lab1: do {
      if (!this.r_do_diminutive()) {
        break lab1;
      }
    } while (false);
    this.cursor = this.limit - v_2;
    v_3 = this.limit - this.cursor;
    lab2: do {
      if (!this.r_do_augmentative()) {
        break lab2;
      }
    } while (false);
    this.cursor = this.limit - v_3;
    lab3: do {
      v_4 = this.limit - this.cursor;
      lab4: do {
        if (!this.r_do_derivational()) {
          break lab4;
        }
        break lab3;
      } while (false);
      this.cursor = this.limit - v_4;
      if (!this.r_do_deriv_single()) {
        return false;
      }
    } while (false);
    return true;
  }
  innerStem() {
    if (this.current.length <= 4) {
      return true;
    }
    let v_1;
    v_1 = this.cursor;
    lab0: do {
      if (!this.r_mark_regions()) {
        break lab0;
      }
    } while (false);
    this.cursor = v_1;
    this.limit_backward = this.cursor;
    this.cursor = this.limit;
    if (!this.r_do_case()) {
      return false;
    }
    if (!this.r_do_possessive()) {
      return false;
    }
    if (!this.r_do_aggressive()) {
      return false;
    }
    this.cursor = this.limit_backward;
    return true;
  }
}

StemmerCs.a_0 = [
  new Among('ce', -1, 1),
  new Among('ze', -1, 2),
  new Among('\u017Ee', -1, 2),
  new Among('ci', -1, 1),
  new Among('\u010Dti', -1, 3),
  new Among('\u0161ti', -1, 4),
  new Among('zi', -1, 2),
  new Among('\u010Di', -1, 1),
  new Among('\u017Ei', -1, 2),
  new Among('\u010Dt\u00E9', -1, 3),
  new Among('\u0161t\u00E9', -1, 4),
  new Among('\u010D', -1, 1),
  new Among('\u010Dt\u011B', -1, 3),
  new Among('\u0161t\u011B', -1, 4)
];

StemmerCs.a_1 = [
  new Among('in', -1, 2),
  new Among('ov', -1, 1),
  new Among('\u016Fv', -1, 1)
];

StemmerCs.a_2 = [
  new Among('a', -1, 1),
  new Among('ama', 0, 1),
  new Among('ata', 0, 1),
  new Among('e', -1, 2),
  new Among('\u011Bte', 3, 2),
  new Among('ech', -1, 2),
  new Among('atech', 5, 1),
  new Among('ich', -1, 2),
  new Among('\u00E1ch', -1, 1),
  new Among('\u00EDch', -1, 2),
  new Among('\u00FDch', -1, 1),
  new Among('i', -1, 2),
  new Among('mi', 11, 1),
  new Among('ami', 12, 1),
  new Among('emi', 12, 2),
  new Among('\u00EDmi', 12, 2),
  new Among('\u00FDmi', 12, 1),
  new Among('\u011Bmi', 12, 2),
  new Among('\u011Bti', 11, 2),
  new Among('ovi', 11, 1),
  new Among('em', -1, 3),
  new Among('\u011Btem', 20, 1),
  new Among('\u00E1m', -1, 1),
  new Among('\u00E9m', -1, 2),
  new Among('\u00EDm', -1, 2),
  new Among('\u00FDm', -1, 1),
  new Among('at\u016Fm', -1, 1),
  new Among('o', -1, 1),
  new Among('iho', 27, 2),
  new Among('\u00E9ho', 27, 2),
  new Among('\u00EDho', 27, 2),
  new Among('es', -1, 2),
  new Among('os', -1, 1),
  new Among('us', -1, 1),
  new Among('at', -1, 1),
  new Among('u', -1, 1),
  new Among('imu', 35, 2),
  new Among('\u00E9mu', 35, 2),
  new Among('ou', 35, 1),
  new Among('y', -1, 1),
  new Among('aty', 39, 1),
  new Among('\u00E1', -1, 1),
  new Among('\u00E9', -1, 1),
  new Among('ov\u00E9', 42, 1),
  new Among('\u00ED', -1, 2),
  new Among('\u00FD', -1, 1),
  new Among('\u011B', -1, 2),
  new Among('\u016F', -1, 1)
];

StemmerCs.a_3 = [
  new Among('ob', -1, 1),
  new Among('itb', -1, 2),
  new Among('ec', -1, 3),
  new Among('inec', 2, 2),
  new Among('obinec', 3, 1),
  new Among('ovec', 2, 1),
  new Among('ic', -1, 2),
  new Among('enic', 6, 3),
  new Among('och', -1, 1),
  new Among('\u00E1sek', -1, 1),
  new Among('nk', -1, 1),
  new Among('isk', -1, 2),
  new Among('ovisk', 11, 1),
  new Among('tk', -1, 1),
  new Among('vk', -1, 1),
  new Among('n\u00EDk', -1, 1),
  new Among('ovn\u00EDk', 15, 1),
  new Among('ov\u00EDk', -1, 1),
  new Among('\u010Dk', -1, 1),
  new Among('i\u0161k', -1, 2),
  new Among('u\u0161k', -1, 1),
  new Among('dl', -1, 1),
  new Among('itel', -1, 2),
  new Among('ul', -1, 1),
  new Among('an', -1, 1),
  new Among('\u010Dan', 24, 1),
  new Among('en', -1, 3),
  new Among('in', -1, 2),
  new Among('\u0161tin', 27, 1),
  new Among('ovin', 27, 1),
  new Among('teln', -1, 1),
  new Among('\u00E1rn', -1, 1),
  new Among('\u00EDrn', -1, 6),
  new Among('oun', -1, 1),
  new Among('loun', 33, 1),
  new Among('ovn', -1, 1),
  new Among('yn', -1, 1),
  new Among('kyn', 36, 1),
  new Among('\u00E1n', -1, 1),
  new Among('i\u00E1n', 38, 2),
  new Among('\u00EDn', -1, 6),
  new Among('\u010Dn', -1, 1),
  new Among('\u011Bn', -1, 5),
  new Among('as', -1, 1),
  new Among('it', -1, 2),
  new Among('ot', -1, 1),
  new Among('ist', -1, 2),
  new Among('ost', -1, 1),
  new Among('nost', 47, 1),
  new Among('out', -1, 1),
  new Among('ovi\u0161t', -1, 1),
  new Among('iv', -1, 2),
  new Among('ov', -1, 1),
  new Among('tv', -1, 1),
  new Among('ctv', 53, 1),
  new Among('stv', 53, 1),
  new Among('ovstv', 55, 1),
  new Among('ovtv', 53, 1),
  new Among('a\u010D', -1, 1),
  new Among('\u00E1\u010D', -1, 1),
  new Among('o\u0148', -1, 1),
  new Among('\u00E1\u0159', -1, 1),
  new Among('k\u00E1\u0159', 61, 1),
  new Among('ion\u00E1\u0159', 61, 2),
  new Among('\u00E9\u0159', -1, 4),
  new Among('n\u00E9\u0159', 64, 1),
  new Among('\u00ED\u0159', -1, 6),
  new Among('ou\u0161', -1, 1)
];

StemmerCs.a_4 = [
  new Among('c', -1, 1),
  new Among('k', -1, 1),
  new Among('l', -1, 1),
  new Among('n', -1, 1),
  new Among('t', -1, 1),
  new Among('\u010D', -1, 1)
];

StemmerCs.a_5 = [
  new Among('isk', -1, 2),
  new Among('\u00E1k', -1, 1),
  new Among('izn', -1, 2),
  new Among('ajzn', -1, 1)
];

StemmerCs.a_6 = [
  new Among('k', -1, 1),
  new Among('ak', 0, 7),
  new Among('ek', 0, 2),
  new Among('anek', 2, 1),
  new Among('enek', 2, 2),
  new Among('inek', 2, 4),
  new Among('onek', 2, 1),
  new Among('unek', 2, 1),
  new Among('\u00E1nek', 2, 1),
  new Among('a\u010Dek', 2, 1),
  new Among('e\u010Dek', 2, 2),
  new Among('i\u010Dek', 2, 4),
  new Among('o\u010Dek', 2, 1),
  new Among('u\u010Dek', 2, 1),
  new Among('\u00E1\u010Dek', 2, 1),
  new Among('\u00E9\u010Dek', 2, 3),
  new Among('\u00ED\u010Dek', 2, 5),
  new Among('ou\u0161ek', 2, 1),
  new Among('ik', 0, 4),
  new Among('ank', 0, 1),
  new Among('enk', 0, 1),
  new Among('ink', 0, 1),
  new Among('onk', 0, 1),
  new Among('unk', 0, 1),
  new Among('\u00E1nk', 0, 1),
  new Among('\u00E9nk', 0, 1),
  new Among('\u00EDnk', 0, 1),
  new Among('ok', 0, 8),
  new Among('\u00E1tk', 0, 1),
  new Among('uk', 0, 9),
  new Among('\u00E1k', 0, 6),
  new Among('\u00E9k', 0, 3),
  new Among('\u00EDk', 0, 5),
  new Among('a\u010Dk', 0, 1),
  new Among('e\u010Dk', 0, 1),
  new Among('i\u010Dk', 0, 1),
  new Among('o\u010Dk', 0, 1),
  new Among('u\u010Dk', 0, 1),
  new Among('\u00E1\u010Dk', 0, 1),
  new Among('\u00E9\u010Dk', 0, 1),
  new Among('\u00ED\u010Dk', 0, 1),
  new Among('u\u0161k', 0, 1)
];

StemmerCs.a_7 = [
  new Among('ej\u0161', -1, 2),
  new Among('\u011Bj\u0161', -1, 1)
];

StemmerCs.g_v = [
  17,
  65,
  16,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  17,
  4,
  18,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  64
];

module.exports = StemmerCs;
