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
      'ces',
      ' pr a ní  neprárávost sv pona ho ch  nanoso nání roti nebvo má ávoebokažažd kaou  mábo  za je přždýdý svoa ssti stá p v obovobbod sp záprorodýchváného byý meníné  náspoováo ptermi ně í arozto a pby jaknáráro li jaa zí pi a všlidkteny u po vím odnat mu  vy ma soli zák ktklaí ntnía vví olipodmí en je  dostábylt sdo em ávapolbýt býo s vevšeí sit í bčinrovdnítví se k ýt volsoua nejnnouse rannýcnesstnci i své ým kolpříovaíchžendu ečnstve smezsvéajítátké u sjehehonýmva nímecheréo zmaj zeole i émui vy sidskonhranu aveí v tom po di nlenprachnesmže  ta ni osvatstadskst  žeovnracladi pchrabym a abakoakénéhsobsmíáv bezdy čenlněí mvouleča mt vlní jipřiálnociravi kými čiensodum n s jí áklzemkdooch ocste vzvenky okotejjinsluivozeninnskéy bzaca jvědezi menezu askýstua oolniálnitřísnící zu kpln tru osvěnikikd odožeanuvini jchoaciděl pláváa todií k voadnesttup muobeve dinodůh nu vnemporhovčnokéh výtakjno'
    );
  }
}

module.exports = registerTrigrams;
