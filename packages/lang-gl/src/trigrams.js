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
      'glg',
      ' deos de  e ión a da to cióereón deritoen a p coenteitn d sereiadeas acidads d pepero ds ee ae dmen danteers pr tedo al rsoidaes tensoaoa que to po o a t ina e li dociate todreso apro retosestra  es oudoslibcona dncio e nae ea aa sber á oda pae o que cue ar nac en sútras p unsúacomou ia ntosera cer ns a ose desis ters n caadoor ónsstaúa  nordas siberá erderano nal asicae pemeerápresendase n nie sporaisparantaraameccionaio o pn p dictos t soo to ánin me oscioencunhn en cnhaha ntrionn sá sn ts oesentaecte io se lso nidocisocontdicicie ttad activndialigual ereca l igomocaso mre  maingna iguvidelinguunds iraca nclactiseuriaon aseo nlics cmanlida uunita  ó ualidoori fuindndastes ates tractialfundisecco ócalmo un e rivan oca n ao cespomeo osegstir atorr deguadalo nder oumaote elalqlquuerspea itarbretrihumolocierenenaarimat fameduralarediverixiá pibrgurintpenrota fcacs filirioma a v virimlenita'
    );
  }
}

module.exports = registerTrigrams;
