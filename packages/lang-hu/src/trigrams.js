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
      'hun',
      ' sz a en  vaés  ésminek  mi jojogindan nekszeság azgy szandealaaz dena vvalele elogamélegy egn aga zab mezememéabaintvanbadteltet teak tásényt a negyeélytt n sbenségzetlammegnakni  seetesenagyletlyns aynera z eet  almelkink jetéok tek kivagre n moz hozez s settgokogy kömbees em nemely leellembhogk aatáköznt  hoyenhezel z alendsáásátésadsk m ál ema sntea mszta tállás y aogosema henknyeesenkiágot slapameberló k ényibanméns ei mt m véllaly ébelatág amion mzen vemzfela nlő a aekieriyes cslletatelőnd i éég ésélisyilvetát külért keéterésl ahetszoartalá nytarkoz ama jészenleléól s ktárs ééles tlemsítgesott fen ktkozást ékelja  haalózésnlőéseot ri lekmástő veli jse ehetesevessátott kolgezei vázalehn eül tteos ti atkztoe atosányánaztefejdelársk kkorégeszát n bizatvédnevelmédezertébbizrraifeiztereat ll k eny sel néábalt ai sülházkift e arlegd ais i earrt tásoit etőal  mát v bábára éesülyem l esnyo'
    );
  }
}

module.exports = registerTrigrams;
