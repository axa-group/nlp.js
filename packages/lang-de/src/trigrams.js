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
      'deu',
      'en er der unnd undeinungcht deichschng  geie cheech didierecgenineeit rech  dan dverhen zut d auht  halicit tenrei bein  ve in eindeaufdenedezu n suf frene teres  jejedn u anseiand frrunat  see udasheis rhtehatnscnger has ens alerellet a wen grdenteesemen ododenerg dallt uerste nen sod dn abenlei gr vowere aegeion stigele cha mehafaftn jren ererkentbei sieihihekeierdtign ion lunr dlengemiesgrutliuntchuerngesende sft st isttioati glstagunmitsenn n nan zite wir geice eei lier sn wglemeide uchem chlnatrcht wdesn ehrealesprd fachsser e scurcr mniee ffene ge d nidurdarint dugehiedt s mialtherhabf gsicstetaaaathe angruchlitz emeabeh an vnungegarfrf ehepru iserfe mansndle btunn od gn rr vwieberr aarbbest ih dr wr b ihd sigkgkenspdigemaellerun finsrbeffeescigugerstrkene vgewhanindrt  arießn hrn manr ihututzd als ebevonlter orlietztraausdethule ionenneiscsonselet ohnt gsam farstrklseriemg vt zerr'
    );
  }
}

module.exports = registerTrigrams;
