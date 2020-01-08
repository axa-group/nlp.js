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
      'fra',
      ' dees de ionnt et tio etent lala e don ne oite lle  les de pt datiroi drdroit  à  coté ns te e smenre  tocon l’touque qules sodesson peons uns ls e prue  pae ct lts onn aue aemee e liontantoututet àresers sace  a trepera dctier libité enux  reen rsoà l ou inlleun natou nnen dune d’ separnteus ur s sansdana pr lproitsés t piree ts psa  déondé da lnceertauxommnalme  na foiqu certéectalebert as a dammeibesane r pocomal s cquiourt e nee nousr daliter difone oau  chairui ell eslits nissératessocautociêtrienintdu estététrapou plratar ranrais oonaainclaégaancrs eurprin ce ms tà u dourebreut  êtage étnsisureinsenserndiensessntrir  macian pst a c dul e sublige rés rée qassndapeuée l’a tea statil tésaisu dineindé equ’ acs in tt cn al’ht qsoit scunrit égoir’enntahom onn e moie ignrelnnat il n trillples él’ereca rotesseuniidéives ut êinsact fan s vigal asligssapréleue flicdisver nutenssirottecs mabl'
    );
  }
}

module.exports = registerTrigrams;
