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
      'swe',
      ' ocochch er ingförtt ar en ättnde förätillet and rä en ti detilhetll de om varliggen frellskaninng ter haas  inka attlledersam i undllaghefriallensetena ler atör den elav  av soighr hnvaga r renvla tignskigahart asomtti utiont ta sngens a fr smäna o sk sirnaiskan  stär ra  vi alt f saa rati är me ben s antionnalanernt emed vaig äns åtstata nat unkliten grvisäll laonehanändt sstät ineransgru gever må lilikiheersrihr a remå snin ft o mä nar eri ad entkladet värunrklda h ruppdrarinigtdign eerkkapttaed d frane stanutanomlargt s f på omktelinr uvidg oännervikaaria ilagrviid r os svilr mörkot ndlstrelsro a mmot moi opå r don delisnskye mras här fi sa nnadn ogantnieraärda dtälberngar iennnd n a upsindd örsje ittkaln mamtn ikillseskinasends e såinntatpert varje fl arelt binttetg aöral vkydyddrje fabetse t llitsa närhäll sndrnisyckh allmlkeh farblmändabarcklv srängartrare eger garaessd evärmt ap '
    );
  }
}

module.exports = registerTrigrams;
