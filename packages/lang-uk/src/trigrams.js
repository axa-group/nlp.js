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
      'ukr',
      'на  пр і прарав наня ння заого поти го люд люво  ко мальнюдиих о н неавоанндин свсвоожнкоженнповжна доатиинаає а л буаціне уваобо ос якмає винихальабоє п тані ть овибо  ві абереі па мвинбезприільного пми та ом ою бодставоб бедо ва ті  обо вост в  щоий ся і с спиннвідстви пванновнанкон у ватонаії но дноій езппер деутиьноистпідстібут мои ііднаконніід тисщо роді ва зава пему і на псобої а вспрів нийякоду вноі дну арои с інля ріву в ріи днарненоваомуленнацнимисячи ав і рном роносві вниовн їїовіможвілу п пі суїї одн всовоютьістстьі з стбуд раченпророзівнодуа оьнини о сснознарацим о димия іціїх пдерчин соа сержи зи ве пди забосоу се бсі терніхя ні бкласпів і ніо зржастуїх а нннатакя пзпе одабедляту і мпеч длже ки вітнісгалагае мамизахримї отанкогресудь рето ковторарасвітваа божесоцоціціаоснробдь‐ь‐я‐які ізагахихиспілційх вливосвіалручь піншв яги аги дікоминиа іодиналтвокоївсія вноюоб о уо оі о'
    );
  }
}

module.exports = registerTrigrams;
