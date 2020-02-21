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
const { LangAr } = require('@nlpjs/lang-ar');
const { LangBn } = require('@nlpjs/lang-bn');
const { LangCa } = require('@nlpjs/lang-ca');
const { LangCs } = require('@nlpjs/lang-cs');
const { LangDa } = require('@nlpjs/lang-da');
const { LangDe } = require('@nlpjs/lang-de');
const { LangEl } = require('@nlpjs/lang-el');
const { LangEn } = require('@nlpjs/lang-en');
const { LangEs } = require('@nlpjs/lang-es');
const { LangEu } = require('@nlpjs/lang-eu');
const { LangFa } = require('@nlpjs/lang-fa');
const { LangFi } = require('@nlpjs/lang-fi');
const { LangFr } = require('@nlpjs/lang-fr');
const { LangGa } = require('@nlpjs/lang-ga');
const { LangGl } = require('@nlpjs/lang-gl');
const { LangHi } = require('@nlpjs/lang-hi');
const { LangHu } = require('@nlpjs/lang-hu');
const { LangHy } = require('@nlpjs/lang-hy');
const { LangId } = require('@nlpjs/lang-id');
const { LangIt } = require('@nlpjs/lang-it');
const { LangJa } = require('@nlpjs/lang-ja');
const { LangKo } = require('@nlpjs/lang-ko');
const { LangLt } = require('@nlpjs/lang-lt');
const { LangMs } = require('@nlpjs/lang-ms');
const { LangNe } = require('@nlpjs/lang-ne');
const { LangNl } = require('@nlpjs/lang-nl');
const { LangNo } = require('@nlpjs/lang-no');
const { LangPl } = require('@nlpjs/lang-pl');
const { LangPt } = require('@nlpjs/lang-pt');
const { LangRo } = require('@nlpjs/lang-ro');
const { LangRu } = require('@nlpjs/lang-ru');
const { LangSl } = require('@nlpjs/lang-sl');
const { LangSr } = require('@nlpjs/lang-sr');
const { LangSv } = require('@nlpjs/lang-sv');
const { LangTa } = require('@nlpjs/lang-ta');
const { LangTh } = require('@nlpjs/lang-th');
const { LangTl } = require('@nlpjs/lang-tl');
const { LangTr } = require('@nlpjs/lang-tr');
const { LangUk } = require('@nlpjs/lang-uk');
const { LangZh } = require('@nlpjs/lang-zh');

class LangAll {
  register(container) {
    container.use(LangAr);
    container.use(LangBn);
    container.use(LangCa);
    container.use(LangCs);
    container.use(LangDa);
    container.use(LangDe);
    container.use(LangEl);
    container.use(LangEn);
    container.use(LangEs);
    container.use(LangEu);
    container.use(LangFa);
    container.use(LangFi);
    container.use(LangFr);
    container.use(LangGa);
    container.use(LangGl);
    container.use(LangHi);
    container.use(LangHu);
    container.use(LangHy);
    container.use(LangId);
    container.use(LangIt);
    container.use(LangJa);
    container.use(LangKo);
    container.use(LangLt);
    container.use(LangMs);
    container.use(LangNe);
    container.use(LangNl);
    container.use(LangNo);
    container.use(LangPl);
    container.use(LangPt);
    container.use(LangRo);
    container.use(LangRu);
    container.use(LangSl);
    container.use(LangSr);
    container.use(LangSv);
    container.use(LangTa);
    container.use(LangTh);
    container.use(LangTl);
    container.use(LangTr);
    container.use(LangUk);
    container.use(LangZh);
  }
}

module.exports = LangAll;
