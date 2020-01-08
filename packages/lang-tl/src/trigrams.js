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
      'tgl',
      'ng ang paan sa  saat  ka ng maalag papa naatapagpan an atay araga a ptang mmga mgn npat ban aayana amag kawakara klanrapgkangan sg nahag ba a taagkgantaoasaakayanao a mmaymankalinga snanaga labanalig aanay mkatsankang iongpammaga no abawisawat y layg sy kin ilat t ayaano ykasinat nag t pwalunayon o  itnaglaltaypiniliansitonsalahkakanya intanyato haygalmamabaranantagton t sagp wa gagawhankapo mlipya as g thaty nngkungno g lgpawa laggtat mkaiyaasalarilina lpapahi is diita pipunagiipimaka by sbatyagagso nakitatpahla gayhin sidi i nsasitia tt kmalaiss nt aal ipuikalitgin ipanogsaaloninumahaliraap aniod i aggay ppartasig sapihinahini bungisyoo snapo pa g haukaa harua omahibaasyli usag euhaipambalamkinkildukn oiga dadaiaigigdgdipildigpak tud nsamnasnakba ad limsinbuhri labit tagg glunainandndapaskabaholignarula ededu ibgitma masagbamiagggi sari msiyg wapipuliyaambnilaglstauliinoabuaunayu aliyo'
    );
  }
}

module.exports = registerTrigrams;
