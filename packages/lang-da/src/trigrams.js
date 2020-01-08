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
      'dan',
      'er og  ogder deforen et til fo tiingde nderet rehedil lig halleden ened verelsundar  fr mese lseandhargenedege ellng at  afnnele ngee fghee oighes af enn atler i skehvee er hne enht tigeesk el beig tigfrior skanine sion ernhvre menr oe a stati sk inl atio påettensal ttimedr fom endr edelg fke  sopå elig o anr rns  alnathan ver sr a un het flin sir dtererenesdete r udalesamihelantterinrihentndle miskerkanst skal nasomholldeinde nrenn snerkelolddigte orse i hvsniskyenevær li sas fd dersstentemmeovee hnalonager grageg avilalle dfretels og ht ot dr ie t omarbd eernr u væd oresg tklæøren f vi måvensk  lagtekabstrn mrele brunrbebejt iejdkket eg drklilkgruvedbes dand  fulærærirdiærdld t mdlifunsig mostanstrt od  ar opvisigtæretett aemmg emodrhoie g ukerrem non h farskorme us sem d h geetse gg sper etlem tri sda dren adesdt kytrdeytterihenervl erviffeoffisnr t ofkenl hrkeg italmå r klkegt t vt b'
    );
  }
}

module.exports = registerTrigrams;
