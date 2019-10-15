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

const TreebankWordTokenizer = require("../tokenizers/treebank-word-tokenizer");

class BaseStemmer {
  constructor(tokenizer, stopwords, dictionary) {
    this.cache = {};
    this.setCurrent("");
    this.tokenizer = tokenizer || new TreebankWordTokenizer();
    this.dictionary = dictionary || { before: {}, after: {}};
    this.loadStopwords(stopwords);
  }

  loadStopwords(stopwords) {
    this.stopwords = {};
    if (stopwords) {
      stopwords.forEach(stopword => {
        this.stopwords[stopword] = 1;
      });
    }
  }

  setCurrent(value) {
    this.current = value;
    this.cursor = 0;
    this.limit = this.current.length;
    this.limit_backward = 0;
    this.bra = this.cursor;
    this.ket = this.limit;
  }

  getCurrent() {
    return this.current;
  }

  copy_from(other) {
    this.current = other.current;
    this.cursor = other.cursor;
    this.limit = other.limit;
    this.limit_backward = other.limit_backward;
    this.bra = other.bra;
    this.ket = other.ket;
  }

  in_grouping(s, min, max) {
    if (this.cursor >= this.limit) return false;
    let ch = this.current.charCodeAt(this.cursor);
    if (ch > max || ch < min) return false;
    ch -= min;
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
    this.cursor++;
    return true;
  }

  in_grouping_b(s, min, max) {
    if (this.cursor <= this.limit_backward) return false;
    let ch = this.current.charCodeAt(this.cursor - 1);
    if (ch > max || ch < min) return false;
    ch -= min;
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) return false;
    this.cursor--;
    return true;
  }

  out_grouping(s, min, max) {
    if (this.cursor >= this.limit) return false;
    let ch = this.current.charCodeAt(this.cursor);
    if (ch > max || ch < min) {
      this.cursor++;
      return true;
    }
    ch -= min;
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
      this.cursor++;
      return true;
    }
    return false;
  }

  out_grouping_b(s, min, max) {
    if (this.cursor <= this.limit_backward) return false;
    let ch = this.current.charCodeAt(this.cursor - 1);
    if (ch > max || ch < min) {
      this.cursor--;
      return true;
    }
    ch -= min;
    if ((s[ch >>> 3] & (0x1 << (ch & 0x7))) == 0) {
      this.cursor--;
      return true;
    }
    return false;
  }

  in_range(min, max) {
    if (this.cursor >= this.limit) return false;
    const ch = this.current.charCodeAt(this.cursor);
    if (ch > max || ch < min) return false;
    this.cursor++;
    return true;
  }

  in_range_b(min, max) {
    if (this.cursor <= this.limit_backward) return false;
    const ch = this.current.charCodeAt(this.cursor - 1);
    if (ch > max || ch < min) return false;
    this.cursor--;
    return true;
  }

  out_range(min, max) {
    if (this.cursor >= this.limit) return false;
    const ch = this.current.charCodeAt(this.cursor);
    if (!(ch > max || ch < min)) return false;
    this.cursor++;
    return true;
  }

  out_range_b(min, max) {
    if (this.cursor <= this.limit_backward) return false;
    const ch = this.current.charCodeAt(this.cursor - 1);
    if (!(ch > max || ch < min)) return false;
    this.cursor--;
    return true;
  }

  eq_s(s_size, s) {
    if (this.limit - this.cursor < s_size) return false;
    if (this.current.slice(this.cursor, this.cursor + s_size) != s) {
      return false;
    }
    this.cursor += s_size;
    return true;
  }

  eq_s_b(s_size, s) {
    if (this.cursor - this.limit_backward < s_size) return false;
    if (this.current.slice(this.cursor - s_size, this.cursor) != s) {
      return false;
    }
    this.cursor -= s_size;
    return true;
  }

  eq_v(s) {
    return this.eq_s(s.length, s);
  }

  eq_v_b(s) {
    return this.eq_s_b(s.length, s);
  }

  find_among(v, v_size) {
    let i = 0;
    let j = v_size || v.length;

    const c = this.cursor;
    const l = this.limit;

    let common_i = 0;
    let common_j = 0;

    let first_key_inspected = false;

    while (true) {
      const k = i + ((j - i) >>> 1);
      let diff = 0;
      let common = common_i < common_j ? common_i : common_j; // smaller
      var w = v[k];
      var i2;
      for (i2 = common; i2 < w.s_size; i2++) {
        if (c + common == l) {
          diff = -1;
          break;
        }
        diff = this.current.charCodeAt(c + common) - w.s.charCodeAt(i2);
        if (diff != 0) break;
        common++;
      }
      if (diff < 0) {
        j = k;
        common_j = common;
      } else {
        i = k;
        common_i = common;
      }
      if (j - i <= 1) {
        if (i > 0) break; // v->s has been inspected
        if (j == i) break; // only one item in v

        // - but now we need to go round once more to get
        // v->s inspected. This looks messy, but is actually
        // the optimal approach.

        if (first_key_inspected) break;
        first_key_inspected = true;
      }
    }
    while (true) {
      var w = v[i];
      if (common_i >= w.s_size) {
        this.cursor = c + w.s_size;
        if (w.method == null) {
          return w.result;
        }
        const res = w.method(w.instance);
        this.cursor = c + w.s_size;
        if (res) {
          return w.result;
        }
      }
      i = w.substring_i;
      if (i < 0) return 0;
    }
    return -1; // not reachable
  }

  // find_among_b is for backwards processing. Same comments apply
  find_among_b(v, v_size) {
    let i = 0;
    let j = v_size || v.length;

    const c = this.cursor;
    const lb = this.limit_backward;

    let common_i = 0;
    let common_j = 0;

    let first_key_inspected = false;

    while (true) {
      const k = i + ((j - i) >> 1);
      let diff = 0;
      let common = common_i < common_j ? common_i : common_j;
      var w = v[k];
      var i2;
      for (i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
        if (c - common == lb) {
          diff = -1;
          break;
        }
        diff = this.current.charCodeAt(c - 1 - common) - w.s.charCodeAt(i2);
        if (diff != 0) break;
        common++;
      }
      if (diff < 0) {
        j = k;
        common_j = common;
      } else {
        i = k;
        common_i = common;
      }
      if (j - i <= 1) {
        if (i > 0) break;
        if (j == i) break;
        if (first_key_inspected) break;
        first_key_inspected = true;
      }
    }
    while (true) {
      var w = v[i];
      if (common_i >= w.s_size) {
        this.cursor = c - w.s_size;
        if (w.method == null) return w.result;
        const res = w.method(this);
        this.cursor = c - w.s_size;
        if (res) return w.result;
      }
      i = w.substring_i;
      if (i < 0) return 0;
    }
    return -1; // not reachable
  }

  /* to replace chars between c_bra and c_ket in this.current by the
   * chars in s.
   */
  replace_s(c_bra, c_ket, s) {
    const adjustment = s.length - (c_ket - c_bra);
    this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket);
    this.limit += adjustment;
    if (this.cursor >= c_ket) this.cursor += adjustment;
    else if (this.cursor > c_bra) this.cursor = c_bra;
    return adjustment;
  }

  slice_check() {
    if (
      this.bra < 0 ||
      this.bra > this.ket ||
      this.ket > this.limit ||
      this.limit > this.current.length
    ) {
      return false;
    }
    return true;
  }

  slice_from(s) {
    let result = false;
    if (this.slice_check()) {
      this.replace_s(this.bra, this.ket, s);
      result = true;
    }
    return result;
  }

  slice_del() {
    return this.slice_from("");
  }

  insert(c_bra, c_ket, s) {
    const adjustment = this.replace_s(c_bra, c_ket, s);
    if (c_bra <= this.bra) this.bra += adjustment;
    if (c_bra <= this.ket) this.ket += adjustment;
  }

  /* Copy the slice into the supplied StringBuffer */
  slice_to(s) {
    let result = "";
    if (this.slice_check()) {
      result = this.current.slice(this.bra, this.ket);
    }
    return result;
  }

  assign_to(s) {
    return this.current.slice(0, this.limit);
  }

  stem() {
    return false;
  }

  stemWord(word) {
    let result = this.cache[`.${word}`];
    if (result == null) {
      if (this.dictionary.before[word]) {
        result = this.dictionary.before[word];
      } else {
        this.setCurrent(word);
        this.stem();
        result = this.getCurrent();
        if (this.dictionary.after[result]) {
          result = this.dictionary.after[result];
        }
      }
      this.cache[`.${word}`] = result;
    }
    return result;
  }

  stemWords(words) {
    const results = [];
    for (let i = 0; i < words.length; i++) {
      results.push(this.stemWord(words[i]));
    }
    return results;
  }

  addStopword(stopword) {
    this.stopwords[stopword] = 1;
  }

  removeStopword(stopword) {
    delete this.stopwords[stopword];
  }

  tokenizeAndStem(text, keepStops = true) {
    const tokens = [];
    this.tokenizer.tokenize(text, true).forEach(token => {
      const lowToken = token.toLowerCase();
      if (keepStops || !this.stopwords[lowToken]) {
        tokens.push(lowToken);
      }
    });
    return this.stemWords(tokens);
  }
}

module.exports = BaseStemmer;
