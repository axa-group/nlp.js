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
      'Cyrillic',
      'rus',
      ' пр и равств напраго ениовево  каанить  в  по обия сво свловна  чеелоо н соостчелие огоет нияеставоый ажд имниевек нельнли оваимеатьприт пи пкажилиобо раых жды додыйвобек бодва й чегося и сии ациеетно мееи иленой тваныхто  илк иенн быию  зами твои но пвано сстоаль всом о вьноих ноги вновакопроий стии опололждолое брая в оснымженразти нося и воторвсе егей телне и рредельтвеоди кообщо и деимаа ичеснимснокак лищесвлеьсянныасттьснноосуе д отпрешена сбщеосноднбытсовытьлжнранниюичеак ым ватчтостучене в стресоль ниномродля нарвенду ожены е и товера озовм инацденринтупеждстр чтя понадосх ий итояеспличбесобротоо бьныь вниие мую  моем  меаро реавакотав  выам жностаая поди кное к  та гогоссудеобя нен и дможескелиавнве ечеущепечдноо дходка  длдляовоательсю ив кненциинойудавов беоронстамициаконсеме овно этазох пни ждем пкогот дствныстьые о опоссретраейстаки бдовму я кналдру дркойтерь парсизнсоцедиолн'
    );
  }
}

module.exports = registerTrigrams;
