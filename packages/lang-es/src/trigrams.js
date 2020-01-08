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

function registerTrigrams(container) {
  const language = container.get('Language');
  if (language) {
    language.addModel(
      'Latin',
      'spa',
      ' deos de  lala  y  a es ón iónrecereder coe lel en ienchoentechcióacio aa p ela lal as e d enna onas dda nte toad enecon pr sutod seho los peperers loo d tician dcio esidaresa ttieionrsote do  inson re lito dadtade sestproquemen poa eodanci qu unue ne n es ylibsu  nas enacia e etra paor adoa dnesra se uala cer porcomnalrtaa sber o ones pdosrá stalesdesibesereraar ertter dialel dntohosdelicaa as nn cociimiio o ere y le cantcci aslasparame cuiciaraencs tndi soo smietosunabredicclas le al pprentro tialy anidn pa ymanomoso n l alalis ano  igs se pntaumatenguaadey esocmo  fuiguo pn thumd dranriay dadativl ecas cavidl ts cidodasdiss i hus onadfun maracndaelisarund acunimbra udiee iquia i halar trodoca tico yctilidorindoari meta indesacuaun iertalespsegeleonsitoontivas hd ynosistrse lecieideediecciosl mr emedtorstin arimuiepletriibrsuslo ectpeny can e hn serntarl yegugururaintondmatl rr aisfote'
    );
  }
}

module.exports = registerTrigrams;
