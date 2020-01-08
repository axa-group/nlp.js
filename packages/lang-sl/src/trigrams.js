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
      'slv',
      ' prin  inravprado anjti avije njeno vic doih  poli o d za vsosta pegao ine  dr na v ga  svja vansvoakoprico icoi se so p kaalistvstivsa ne imsakimajo drunoskdoi dakdi pnjao snih alo vma i i dee nprevo i vni redobovobavnneg biova izoveitilovki jana vna  soem  nja ise  tetvaolibodruže i ra skatie paroi k oba d člevaržadrž spko i n se kienastoe vžennakkaki zvarteržav modi govimiva koln s z mi ovorodvoj ennarve  jeposa segovljjeg sth per katčloatea zenjn pdeli oljapolčina ned smejeneni taodn ve nie ben  mejemkonnaneljsamda ljezakoviščirazansju bitic  smji nskv s s n vtvoenea kme vatorakršnimstaživebnev ri ekoo kn nso za ičnskie d vao zacicijejaelodejsi njuvolkihi mnstkupkovužila morvih dah iljuotrmedo askurugodoijodstspotakznaednvneararšnitvodiu sčenbošnikavlakre ovekdnoolno oošče mta vičbi pnočnomelemeoljoderstremov ars bon deredovajoklaicevezvni koosetevbnoužbavavere zljnmu a bvi dolkerr s'
    );
  }
}

module.exports = registerTrigrams;
