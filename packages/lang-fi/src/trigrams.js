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
      'fin',
      'en iseja ist jaon ta staan n jaissenn okeuikeoiklis vaellllan tuks onksi oin k kaaaneenla llikaia j tasa in mis joa oäänän seln sksea ta ktaius ttaansssakundentä eusnenkannsaapaallest seeisillienseetaa yhjokn yvapa vttäokan vai ittaa aiketttukti ust kuisistäses tä tulain pstiastn en mtääsiaunnä judeä ostesi teiinepera sia kä äne mimaa pea pessa mainämätamyht jujulykshänä t häuttideet llävalsekstun alä amihmi keikklleiinsä euktämihmtee ihltapau saiskmääoisun tavtendishten hissssäa hava maa y ei te si olekästyalttoiattolltet jä ravat muiel tomaisalisua akkiat suun lvälää ulituntieeru yketuvaarusmuk heei a ekieskueidiit sunnasilomamin yllinautuutsko kottile siekaaa r risiinnoelitursaaaatleiolina  laoonurvlmarvaitemievasä m edtusiaaitää vuolyle allitsuoamajoiuntutei otykn raliliineepaaaviomioitjenkäävoiyhdä k kieeteks syityilöilmoimolesititauomvaiuskalahenope puaukpetojai sriiuudhdiäliva  om'
    );
  }
}

module.exports = registerTrigrams;
