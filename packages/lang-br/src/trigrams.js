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
      'por',
      'os de  de a  e o dto ão  dientda itoem  coeitas dires irerei seçãoadea pdade ds dmenntedo s e pr pedos to daa ao e o o aesscontodque qute e a doal residam d in ouer sso na re poa s liumaciaar proe ea d teaçãa t es suou ue s ptosa edesra comno ameia e ptemnto pais esttraõesna s oodadassersoas npeso ps ao se o em as à o oaisberadooa o te smansuaua  no osa cterçõeerdlibrdas snciibee nicaodoso nalntrs thumura aoonaual soor ma stao ca nprearaeraonse tr aparo à huindporcioriam as c uma lguaran enndio ie craçionnidacianosoce roci acundsennosnsirecimealiintum pernac alm or p fundoontaçõ igigufunnta maunicçãere exa i meeseriol da os hpeladapriideam m ppods fém a fio odeca italidtive fvidr eespndaomoe lnaço ranta qtadliciva favers lialclanguing camo der vieliistta se atiiosidor oecidis une ir decço qs iquaênca mseustininuerrarcasaosensguéiassiduémturdamsseao elal efortecote plena trm ctro niicorot'
    );
  }
}

module.exports = registerTrigrams;
