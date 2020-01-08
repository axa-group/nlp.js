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
      'ita',
      ' dito  deion inla e ddi ne  e ziore le ni ellonellarita do ddelittiridir coti essent alazittote i di ieretà  prndie laleo ainde ee igninteconi eli a s unmenogn neuo  ogidue aividuovid estti hadiv lia pno allproza atopersseser soi s la sue p peibena a l ilbere nil alilibha chein o se s quo eia e c rinzata ntohe onio i o stao cnel a o pnaze oso  poo hglii uondi cersamei plleun erari verro el unaa c chertua i assirtàa eei disant l tata aonaual leitàareter adnit daprideià ecia st sinalesttutistcomuni edono nasuaal si anz pa rerazguaitaresdersocmano oad i oesequeenzed  seio etton  tudicà dsiai rrsoocirioariquaialpreichratientraaniumase ll eria no n umdo araa tzzaer triatticoposscii lsonndapare ufon fontiuzistruttatisenintnesiar i hian cstichiannra  egeguispbilonta r norop meoprost mauesicassotalciesunlitoreinaitetan ranongiod ae rdevi ml iezzizi cunnorà a ittarialiacosssudall p asassopove eve'
    );
  }
}

module.exports = registerTrigrams;
