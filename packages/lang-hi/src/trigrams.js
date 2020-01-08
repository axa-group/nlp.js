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
      'Devanagari',
      'hin',
      'के |प्र| के|और | और|ों | का|कार| प्|का | को|या |ं क|ार |ति |को | है|िका|ने |है |्रत|धिक| अध|अधि|की |ा क| कि| की| सम|ें |व्य|्ति|से |क्त|ा अ|्यक| व्|में|ि क|मान| मे| स्|सी |न्त| हो|े क|यक्|ता |ै ।|क्ष|त्य| कर|िक | वि| या|्य |भी |रत्|ी स| जा|र स|येक|स्व|ेक |रों|्ये|ा ज|िया|त्र|क व|र ह| अन|किस|्रा|ित |ा स|िसी|ा ह|ना | से| सा| । |देश|र क|गा | पर| अप|े स|ान |्त्|ी क|्त |समा| रा|ा प| ।प|वार|था |ष्ट|।प्|अन्|न क|षा |्वा|तन्| मा|ारो|्षा|्ट्|राष|वतन|ाष्|ाप्|ट्र|प्त|े अ|्वत| इस|राप| उस|कि |हो |त ह|ं औ| सं|े प|ार्|करन| भी| दे|किय|ा ।| न |जाए|ी प|र अ|क स|री | नि|अपन|े व|सभी|्तर| तथ|तथा|रा |यों|ओं |िवा|ाओं|ीय |सके|द्व|सम्|व क|पर |्री| द्|रता|ारा| ऐस|िए | सभ|रक्|्या|र प|ा व|माज|रने|र उ|होग|ो स|ं म|िक्| जि| लि|त क|ाएग|स्थ|े म|पूर|ाव |पने| भा|इस |े ल| घो|कृत|घोष|श्य|द्ध|लिए|ा औ|ो प|र्व|ाने|भाव|रूप|र्य|ी र|ेश |णा |ं स|ूर्|शिक|ूप |्ध |रीय| रू|। इ|े ब|दी |न्य|य क|रति|एगा| उन|ी अ|े औ| सु|सार|ेशो|जो |शों|जिस|ा उ| शि|ियो|तर्|ी भ|परा|चित|ानव|तिक|्र | पा| पू|म क|षणा|ोषण|ोगा|गी |र्ण|ाना|िश्|ो क|विश|ले |ारी|परि|र द|नव | यह|्म |साम|रका|म्म|राध| बु| जो|ानू| जन|चार|वाह|नून|स्त|े य|्रो|दिय|न स|ास |कर |य स|ं न|ाज |कता| सद|निय|अपर| ।क|ताओ|न अ|ाह |ी ज|बन्|ी न|े ज|ोई |य ह|्था|ामा|याद|ी व|ंकि|ूंक|ी म|चूं|श क|ुक्|त र'
    );
  }
}

module.exports = registerTrigrams;
