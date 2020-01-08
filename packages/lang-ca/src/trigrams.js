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
      'cat',
      ' de i es de la  la a  peperió enttat sent retts dreat  ells  drmenacia pcióona coa lal na s dqueen el  tos i qu ene lns totet t aers prt donser  lliona sta a tconelss e l’rsoresalsson unestcio reproitacia inles o ue delllité  téia ameé dsevotanaci l als pa dar a iualnala cantnci leertstartasert ii al d nova ats d’s nre s ae ceva narà  cauescomlibés  soibe esetsberda r ano unal’es ltersenranuredesmani el pt en de de eom  dicciigua as t pai dtras oaqutrevolecta ul iguaides sadaeneialntantrenssocctera ocihumumaclaaliliteràcti aq huicipreeraessuninte fo niblessetesaltemeassicasego soterac ig poans ésa eun us mit mar sse ssis ha mr lnitl tèncó dten teir i ptaletadici ihomt qparegus f asn lria mi aclicint tracteixn es contnseecct tltrambqual’aeliuraan iste tó aonenaminglaro pesprecliga f haiva amllet srotmatliutiuiurn afonotsincndie pseuoluguri cmésderrnainaforigiciebliic mb in artol romninomp'
    );
  }
}

module.exports = registerTrigrams;
