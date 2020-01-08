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
      'nld',
      'en de an  devan va en heingchtderng n dn vet een geechn everrecnde ee re beedeer e vgendenhetten te in opn i velij ziereelizijijkte oorht ensn oandt oijniedke  oneidop  vojn id ondin sch vraarn zaan ierderijmenrenordheihte weeftn gft n wor n heefvriwor meheeal t rof le  ofatig ve beni aalle won ae ond r hvoo alegen terk da nat hstajkeat natngee eend stom e gtien bstediee rerwwele sr d omij digt eigeterie gelre jhet d zae mersijhnigzalnied vns d ee we nestelebes dog echevolge ezee dig gindathapchaeke dionae alkenstard grtelmin towaalenelklinemejk n sdelstrhanevegroichvendoo wat vit overinaatn nwetuitijdze  zoion ovdezgemmettiobbeach nihedst alliesperhebebbe itoees taan mnteienel ninalebendaasti mameekinpene hwerontiettigg os e erigdeteanglannscemamant gis begherescbijd orontinnaleerp vediermitet wt a hurwiwijijsr ewegjs rminaat bapprwe bit zkerameeriken anar  latregerrditaneitgdeg id zoep'
    );
  }
}

module.exports = registerTrigrams;
