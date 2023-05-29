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

const { Nlp } = require('../src');
const TemplateMock = require('./template-mock');

const defaultCorpus = {
  name: 'corpus',
  locale: 'en-US',
  data: [
    {
      intent: 'greet',
      utterances: ['hello', 'hi', 'good morning', 'good night'],
      answers: ['Hello user!'],
    },
    {
      intent: 'bye',
      utterances: ['see you later', 'bye', 'goodbye'],
      answers: ['Bye user!'],
    },
  ],
};

describe('NLP', () => {
  describe('Constructor', () => {
    test('It should create a new instance', () => {
      const nlp = new Nlp();
      expect(nlp).toBeDefined();
    });
    test('It should create default object structure', () => {
      const nlp = new Nlp();
      expect(nlp.contextManager).toBeDefined();
      expect(nlp.slotManager).toBeDefined();
      expect(nlp.sentiment).toBeDefined();
      expect(nlp.actionManager).toBeDefined();
      expect(nlp.nlgManager).toBeDefined();
      expect(nlp.ner).toBeDefined();
      expect(nlp.nluManager).toBeDefined();
    });
  });

  describe('Guess language', () => {
    test('Should guess the language of an utterance', () => {
      const manager = new Nlp();
      const lang = manager.container.get('Language');
      lang.addModel(
        'Latin',
        'eng',
        ' ththe anhe nd andion ofof tio toto on  inal atiighghtrig rior entas ed is ll in  bee rne oneveralls tevet t frs a ha rety ery ord t prht  co eve he ang ts hisingbe yon shce reefreryon thermennatshapronaly ahases for hihalf tn an ont  pes o fod inceer onsrese sectityly l bry e eerse ian e o dectidomedoeedhtsteronare  no wh a  und f asny l ae pere en na winitnted aanyted dins stath perithe tst e cy tom soc arch t od ontis eequve ociman fuoteothess al acwitial mauni serea so onlitintr ty oencthiualt a eqtatquaive stalie wl oaref hconte led isundciae fle  lay iumaby  byhumf aic  huavege r a woo ams com meeass dtec lin een rattitplewheateo ts rt frot chciedisagearyo oancelino  fa susonincat ndahouwort inderomoms otg temetleitignis witlducd wwhiacthicaw law heichminimiorto sse e bntrtraeduountane dnstl pd nld ntas iblen p pun s atilyrththofulssidero ecatucauntien edo ph aeraindpensecn wommr s'
      );
      lang.addModel(
        'Latin',
        'spa',
        ' deos de  lala  y  a es ón iónrecereder coe lel en ienchoentechcióacio aa p ela lal as e d enna onas dda nte toad enecon pr sutod seho los peperers loo d tician dcio esidaresa ttieionrsote do  inson re lito dadtade sestproquemen poa eodanci qu unue ne n es ylibsu  nas enacia e etra paor adoa dnesra se uala cer porcomnalrtaa sber o ones pdosrá stalesdesibesereraar ertter dialel dntohosdelicaa as nn cociimiio o ere y le cantcci aslasparame cuiciaraencs tndi soo smietosunabredicclas le al pprentro tialy anidn pa ymanomoso n l alalis ano  igs se pntaumatenguaadey esocmo  fuiguo pn thumd dranriay dadativl ecas cavidl ts cidodasdiss i hus onadfun maracndaelisarund acunimbra udiee iquia i halar trodoca tico yctilidorindoari meta indesacuaun iertalespsegeleonsitoontivas hd ynosistrse lecieideediecciosl mr emedtorstin arimuiepletriibrsuslo ectpeny can e hn serntarl yegugururaintondmatl rr aisfote'
      );
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new Nlp();
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Add Document', () => {
    test('A document can be added', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('A document can be added training by domain', () => {
      const nlp = new Nlp({ nlu: { trainByDomain: true } });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.addDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Remove Document', () => {
    test('A document can be removed', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('A document can be removed training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument('es', 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it training by domain', () => {
      const nlp = new Nlp({ trainByDomain: true });
      nlp.addLanguage(['en', 'es']);
      nlp.addDocument('es', 'Dónde están las llaves', 'keys');
      nlp.removeDocument(undefined, 'Dónde están las llaves', 'keys');
      expect(nlp.nluManager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale cannot be guessed then throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const nlp = new Nlp();
      nlp.addLanguage(['en', 'es']);
      expect(() => nlp.removeDocument('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Add NER Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('If locale is not defined, will be wildcard by default', () => {
      const nlp = new Nlp();
      nlp.addNerRule(undefined, 'A1', 'regex', /t/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules['*']).toBeDefined();
      expect(nlp.ner.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi],
      });
    });
    test('Rules can be added to same locale and mane', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      expect(nlp.ner.rules).toBeDefined();
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
  });

  describe('Remove NER Rule', () => {
    test('Rules can be added by locale, name and type', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If no locale defined use wildcard', () => {
      const nlp = new Nlp();
      nlp.addNerRule(undefined, 'A1', 'regex', /t/gi);
      nlp.addNerRule(undefined, 'A1', 'regex', /b/gi);
      nlp.removeNerRule(undefined, 'A1', /t/gi);
      expect(nlp.ner.rules['*'].A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/b/gi],
      });
    });
    test('If locale does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('es', 'A1', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If name does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A2', /t/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If rule does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1', /c/gi);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'regex',
        rules: [/t/gi, /b/gi],
      });
    });
    test('If only locale and name are provided, remove the rule by name', () => {
      const nlp = new Nlp();
      nlp.addNerRule('en', 'A1', 'regex', /t/gi);
      nlp.addNerRule('en', 'A1', 'regex', /b/gi);
      nlp.addNerRule('en', 'A2', 'regex', /b/gi);
      nlp.removeNerRule('en', 'A1');
      expect(nlp.ner.rules.en.A1).toBeUndefined();
    });
    test('Rules removal selects properly the rule to remove', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', 'text1');
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt2', 'text2');
      nlp.addNerRuleOptionTexts('en', 'A2', 'opt1', 'text1');
      nlp.addNerRuleOptionTexts('en', 'A2', 'opt2', 'text2');
      nlp.addNerRuleOptionTexts('en', 'A2', 'opt3', 'text3');
      nlp.addNerRuleOptionTexts('en', 'A3', 'opt2', 'text2');
      nlp.removeNerRule('en', 'A1');
      nlp.removeNerRule('en', 'A2', { option: 'opt2', texts: ['text2'] });
      expect(nlp.ner.rules.en.A1).toBeUndefined();
      expect(nlp.ner.rules.en.A2).toBeDefined();
      expect(nlp.ner.rules.en.A3).toBeDefined();
      expect(nlp.ner.rules.en.A2).toEqual({
        name: 'A2',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
          {
            option: 'opt3',
            texts: ['text3'],
          },
        ],
      });
      expect(nlp.ner.rules.en.A3).toEqual({
        name: 'A3',
        type: 'enum',
        rules: [
          {
            option: 'opt2',
            texts: ['text2'],
          },
        ],
      });
    });
  });

  describe('Add NER rule option texts', () => {
    test('A text can be added to an option of a rule for a locale', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', 'text1');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
    });
    test('A text can be added to an option of a rule for several locales', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text1');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
      expect(nlp.ner.rules.es.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1'],
          },
        ],
      });
    });
    test('Several texts can be added to an option of a rule for a locale', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2'],
          },
        ],
      });
    });
    test('Several texts can be added to an option of a rule for a locale at different moments', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text1', 'text2']);
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', ['text3', 'text4']);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If no text is provided use the option name', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['opt1'],
          },
        ],
      });
    });

    test('addEntities using a single rule for each entity covering all rule types and regexp import as string', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addEntities({
        regex_all_string: '/[0-9]/gi',
        regex_string: { regex: '/[0-9]/gi' },
        regex_array: { regex: ['/[0-9]/gi'] },
        options_array: { options: { spiderman: ['spiderman', 'spider-man'] } },
        trim_array: {
          trim: [
            {
              position: 'after',
              words: ['from'],
              opts: { caseSensitive: true },
            },
          ],
        },
      });
      expect(nlp.ner.rules.en).toEqual({
        regex_all_string: {
          name: 'regex_all_string',
          type: 'regex',
          rules: [/[0-9]/gi],
        },
        regex_string: {
          name: 'regex_string',
          type: 'regex',
          rules: [/[0-9]/gi],
        },
        regex_array: {
          name: 'regex_array',
          type: 'regex',
          rules: [/[0-9]/gi],
        },
        options_array: {
          name: 'options_array',
          type: 'enum',
          rules: [{ option: 'spiderman', texts: ['spiderman', 'spider-man'] }],
        },
        trim_array: {
          name: 'trim_array',
          type: 'trim',
          rules: [
            {
              type: 'after',
              words: ['from'],
              options: { caseSensitive: true },
            },
          ],
        },
      });
    });

    test('addEntities then process', async () => {
      let p = null;
      let nlp = null;

      // TRIM
      nlp = new Nlp({ forceNER: true });
      nlp.addEntities({
        trim_array: {
          trim: [
            {
              position: 'after',
              words: ['from'],
              opts: { caseSensitive: true },
            },
          ],
        },
      });

      p = await nlp.process(
        'en',
        '8 days ago i saw spider-man coming from heaven'
      );
      expect(p.entities).toEqual([
        {
          type: 'trim',
          subtype: 'after',
          start: 40,
          end: 45,
          len: 6,
          accuracy: 0.99,
          sourceText: 'heaven',
          utteranceText: 'heaven',
          entity: 'trim_array',
        },
      ]);

      // OPTIONS
      nlp = new Nlp({ forceNER: true });
      nlp.addEntities({
        options_array: { options: { spiderman: ['spiderman', 'spider-man'] } },
      });

      p = await nlp.process(
        'en',
        '8 days ago i saw spider-man coming from heaven'
      );
      expect(p.entities).toEqual([
        {
          start: 17,
          end: 26,
          len: 10,
          levenshtein: 0,
          accuracy: 1,
          entity: 'options_array',
          type: 'enum',
          option: 'spiderman',
          sourceText: 'spider-man',
          utteranceText: 'spider-man',
        },
      ]);

      // TRIM AND OPTIONS
      nlp = new Nlp({ forceNER: true });
      nlp.addEntities({
        mixed: {
          options: { spiderman: ['spiderman', 'spider-man'] },
          trim: [
            {
              position: 'after',
              words: ['from'],
              opts: { caseSensitive: true },
            },
          ],
        },
      });

      p = await nlp.process(
        'en',
        '8 days ago i saw spider-man coming from heaven'
      );
      expect(p.entities).toEqual([
        {
          start: 17,
          end: 26,
          len: 10,
          levenshtein: 0,
          accuracy: 1,
          entity: 'mixed',
          alias: 'mixed_0',
          type: 'enum',
          option: 'spiderman',
          sourceText: 'spider-man',
          utteranceText: 'spider-man',
        },
        {
          type: 'trim',
          subtype: 'after',
          start: 40,
          end: 45,
          len: 6,
          accuracy: 0.99,
          sourceText: 'heaven',
          utteranceText: 'heaven',
          entity: 'mixed',
          alias: 'mixed_1',
        },
      ]);

      // TRIM AND OPTIONS and regexp
      nlp = new Nlp({ forceNER: true });
      nlp.addEntities({
        mixed: {
          options: { spiderman: ['spiderman', 'spider-man'] },
          trim: [
            {
              position: 'after',
              words: ['from'],
              opts: { caseSensitive: true },
            },
          ],
          regex: ['/[0-9]/gi'],
        },
      });

      p = await nlp.process(
        'en',
        '8 days ago i saw spider-man coming from heaven'
      );
      expect(p.entities).toEqual([
        {
          start: 0,
          end: 0,
          accuracy: 1,
          sourceText: '8',
          entity: 'mixed',
          type: 'enum',
          utteranceText: '8',
          len: 1,
          alias: 'mixed_0',
        },
        {
          start: 17,
          end: 26,
          len: 10,
          levenshtein: 0,
          accuracy: 1,
          entity: 'mixed',
          type: 'enum',
          option: 'spiderman',
          sourceText: 'spider-man',
          utteranceText: 'spider-man',
          alias: 'mixed_1',
        },
        {
          type: 'trim',
          subtype: 'after',
          start: 40,
          end: 45,
          len: 6,
          accuracy: 0.99,
          sourceText: 'heaven',
          utteranceText: 'heaven',
          entity: 'mixed',
          alias: 'mixed_2',
        },
      ]);
    });
  });

  describe('Remove NER rule option texts', () => {
    test('A text can be removed', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the locale does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('es', 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.es).toBeUndefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the rule name does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A2', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A2).toBeUndefined();
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('If the option does not exists do not crash', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt2', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text3', 'text4'],
          },
        ],
      });
    });
    test('The texts can be a list', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1', ['text2', 'text3']);
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text4'],
          },
        ],
      });
    });
    test('If no text is defined use the option name', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts('en', 'A1', 'opt1', [
        'text1',
        'text2',
        'opt1',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts('en', 'A1', 'opt1');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text2', 'text4'],
          },
        ],
      });
    });
    test('The locale can be a list', () => {
      const nlp = new Nlp();
      nlp.addNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', [
        'text1',
        'text2',
        'text3',
        'text4',
      ]);
      nlp.removeNerRuleOptionTexts(['en', 'es'], 'A1', 'opt1', 'text2');
      expect(nlp.ner.rules.en.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
      expect(nlp.ner.rules.es.A1).toEqual({
        name: 'A1',
        type: 'enum',
        rules: [
          {
            option: 'opt1',
            texts: ['text1', 'text3', 'text4'],
          },
        ],
      });
    });
  });

  describe('Process an utterance', () => {
    test('When the input contains `from.id` do not crash', async () => {
      const nlp = new Nlp();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
        from: { id: 'jo.bloggs@example.org', name: 'Jo', role: 'user' },
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('None');
      expect(output.answer).toBeUndefined();
      expect(output.from.id).toEqual(input.from.id);
    });
  });

  describe('Process an utterance with actions', () => {
    test('The action is executed when intent matches', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        actionCalled = true;
      });
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toBeUndefined();
      expect(actionCalled).toEqual(true);
    });
    test('The action is executed after answer generation (default) and answer returned in object', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are HAL');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        actionCalled = true;
        data.answer = 'answer';
        return data;
      });
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('answer');
      expect(actionCalled).toEqual(true);
    });
    test('The action is executed after answer generation (default) and answer returned as string', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are HAL');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        actionCalled = true;
        return 'answer';
      });
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('answer');
      expect(actionCalled).toEqual(true);
    });
    test('The action is executed before answer generation (when configured that way) and answer determined normally when no answer set', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        executeActionsBeforeAnswers: true,
      });
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are HAL');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        actionCalled = true;
        return data;
      });
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('You are HAL');
      expect(actionCalled).toEqual(true);
    });
    test('The action is executed before answer generation (when configured that way) and answer set in action is used', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        executeActionsBeforeAnswers: true,
      });
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are HAL');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        actionCalled = true;
        expect(param1).toEqual('param1');
        data.answer = 'answer';
        return data;
      });
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Who am i?',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('answer');
      expect(actionCalled).toEqual(true);
    });

    test('The action is executed before answer generation so a set entity can be used when answer is rendered', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        executeActionsBeforeAnswers: true,
      });

      nlp.container.register('Template', TemplateMock, true);
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are {{ name }}');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        data.context.name = 'HAL';
        actionCalled = true;
        return data;
      });
      await nlp.train();
      const context = {};
      const output = await nlp.process('en', 'Who am i?', context);
      expect(output.utterance).toEqual('Who am i?');
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('You are HAL');
      expect(actionCalled).toEqual(true);
      expect(context.name).toEqual('HAL');
    });
    test('The action is executed after answer generation so a set entity can not be used when answer is rendered', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        executeActionsBeforeAnswers: false,
      });

      nlp.container.register('Template', TemplateMock, true);
      nlp.addDocument('en', 'Who am i?', 'who_am_i');
      nlp.addAnswer('en', 'who_am_i', 'You are {{ name }}');
      let actionCalled = false;
      nlp.addAction('who_am_i', 'testaction', ['param1'], (data, param1) => {
        expect(param1).toEqual('param1');
        data.context.name = 'HAL';
        actionCalled = true;
        return data;
      });
      await nlp.train();
      const context = {};
      const output = await nlp.process('en', 'Who am i?', context);
      expect(output.utterance).toEqual('Who am i?');
      expect(output.intent).toEqual('who_am_i');
      expect(output.answer).toEqual('You are {{ name }}');
      expect(actionCalled).toEqual(true);
      expect(context.name).toEqual('HAL');
    });
  });

  describe('Dynamically add entity utterances and process', () => {
    test('add additional utterances based on the defined enum entities with one utterance', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'convert from @ccyFrom to @ccyTo', 'GetForexRates');
      nlp.addAnswer(
        'en',
        'GetForexRates',
        '{{ ccyFrom }} is equal to 76 {{ ccyTo }}'
      );

      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'aud', ['AUD']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'gbp', ['GBP', 'Pound']);

      const manager = nlp.nluManager.consolidateManager('en');
      expect(manager.sentences.length).toEqual(1);
      nlp.addAdditionalEnumEntityUtterances();
      expect(manager.sentences.length).toEqual(29);
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'convert from USD to INR',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('GetForexRates');
      expect(output.entities[0].entity).toBe('ccyFrom');
      expect(output.entities[0].option).toBe('usd');
      expect(output.entities[1].entity).toBe('ccyTo');
      expect(output.entities[1].option).toBe('inr');
      expect(output.answer).toBeDefined();
    });
    test('add additional utterances based on the defined enum entities with multiple utterances', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'convert from @ccyFrom to @ccyTo', 'GetForexRates');
      nlp.addDocument(
        'en',
        'convert from @ccyFrom and @ccyFrom to @ccyTo',
        'GetForexRates'
      );
      nlp.addAnswer(
        'en',
        'GetForexRates',
        '{{ ccyFrom }} is equal to 76 {{ ccyTo }}'
      );

      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'aud', ['AUD']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'gbp', ['GBP', 'Pound']);

      const manager = nlp.nluManager.consolidateManager('en');
      expect(manager.sentences.length).toEqual(2);
      nlp.addAdditionalEnumEntityUtterances();
      expect(manager.sentences.length).toEqual(142);
      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'convert from USD to INR',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('GetForexRates');
      expect(output.entities[0].entity).toBe('ccyFrom');
      expect(output.entities[0].option).toBe('usd');
      expect(output.entities[1].entity).toBe('ccyTo');
      expect(output.entities[1].option).toBe('inr');
      expect(output.answer).toBeDefined();
    });
  });

  describe('addCorpus', () => {
    test('A corpus can be added as a json', async () => {
      const nlp = new Nlp();
      await nlp.addCorpus(defaultCorpus);
      expect(nlp.nluManager.domainManagers.en.sentences).toHaveLength(7);
    });
    test('A corpus with domains can be added as a json', async () => {
      const corpus = {
        name: 'corpus',
        locale: 'en-US',
        domains: [
          {
            name: 'domain1',
            locale: 'en-US',
            data: [
              {
                intent: 'greet',
                utterances: ['hello', 'hi', 'good morning', 'good night'],
                answers: ['Hello user!'],
              },
            ],
          },
          {
            name: 'domain2',
            locale: 'en-US',
            data: [
              {
                intent: 'bye',
                utterances: ['see you later', 'bye', 'goodbye'],
                answers: ['Bye user!'],
              },
            ],
          },
        ],
      };
      const nlp = new Nlp();
      await nlp.addCorpus(corpus);
      expect(nlp.nluManager.domainManagers.en.sentences[0].domain).toEqual(
        'domain1'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[1].domain).toEqual(
        'domain1'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[2].domain).toEqual(
        'domain1'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[3].domain).toEqual(
        'domain1'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[4].domain).toEqual(
        'domain2'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[5].domain).toEqual(
        'domain2'
      );
      expect(nlp.nluManager.domainManagers.en.sentences[6].domain).toEqual(
        'domain2'
      );
    });

    test('The corpus can contain entities', async () => {
      const corpus = {
        name: 'corpus',
        locale: 'en-US',
        data: [
          {
            intent: 'greet',
            utterances: ['hello', 'hi', 'good morning', 'good night'],
            answers: ['Hello user!'],
          },
          {
            intent: 'bye',
            utterances: ['see you later', 'bye', 'goodbye'],
            answers: ['Bye user!'],
          },
        ],
        entities: {
          hero: {
            locale: ['en', 'es'],
            type: 'text',
            options: {
              spiderman: ['spiderman', 'spider-man'],
              ironman: ['ironman', 'iron-man'],
              thor: ['thor'],
            },
          },
          email: {
            locale: ['en', 'es'],
            regex: '/\\b(\\w[-._\\w]*\\w@\\w[-._\\w]*\\w\\.\\w{2,3})\\b/gi',
          },
          fromCity: {
            locale: ['en', 'es'],
            trim: [
              {
                position: 'betweenLast',
                leftWords: ['from'],
                rightWords: ['to'],
                opts: {
                  caseSensitive: true,
                },
              },
              {
                position: 'afterLast',
                words: ['from'],
              },
            ],
          },
        },
      };
      const nlp = new Nlp();
      await nlp.addCorpus(corpus);
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.es).toBeDefined();
      expect(nlp.ner.rules.en.hero).toBeDefined();
      expect(nlp.ner.rules.en.email).toBeDefined();
      expect(nlp.ner.rules.en.fromCity).toBeDefined();
      expect(nlp.ner.rules.es.hero).toBeDefined();
      expect(nlp.ner.rules.es.email).toBeDefined();
      expect(nlp.ner.rules.es.fromCity).toBeDefined();
      expect(nlp.ner.rules.es.fromCity.type).toEqual('trim');
      expect(nlp.ner.rules.es.fromCity.rules).toBeDefined();
      expect(nlp.ner.rules.es.fromCity.rules[0]).toBeDefined();
      // Verify betweenlast was converted to a between Rule on example of this es rule
      expect(nlp.ner.rules.es.fromCity.rules[0].type).toEqual('between');
    });

    test('The corpus can contain entities with slotFilling details', async () => {
      const corpus = {
        name: 'Slot Filling Corpus',
        locale: 'en-US',
        entities: {
          fromCity: {
            trim: [
              {
                position: 'betweenLast',
                leftWords: ['from'],
                rightWords: ['to'],
              },
              {
                position: 'afterLast',
                words: ['from'],
              },
            ],
          },
          toCity: {
            trim: [
              {
                position: 'betweenLast',
                leftWords: ['to'],
                rightWords: ['from'],
              },
              {
                position: 'afterLast',
                words: ['to'],
              },
            ],
          },
        },
        data: [
          {
            intent: 'travel',
            utterances: ['I want to travel from @fromCity to @toCity @date'],
            slotFilling: {
              fromCity: {
                mandatory: true,
                question: 'From where you are traveling?',
              },
              toCity: {
                mandatory: false,
                question: 'Where do you want to go?',
              },
              date: 'When do you want to travel from {{fromCity}} to {{toCity}}?',
            },
          },
        ],
      };
      const nlp = new Nlp();
      await nlp.addCorpus(corpus);
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.fromCity).toBeDefined();
      expect(nlp.ner.rules.en.toCity).toBeDefined();
      expect(nlp.ner.rules.en.date).toBeUndefined();
      expect(nlp.slotManager.intents.travel).toBeDefined();
      expect(nlp.slotManager.intents.travel.fromCity).toBeDefined();
      expect(nlp.slotManager.intents.travel.fromCity.mandatory).toEqual(true);
      expect(nlp.slotManager.intents.travel.fromCity.locales).toBeDefined();
      expect(nlp.slotManager.intents.travel.fromCity.locales.en).toEqual(
        'From where you are traveling?'
      );
      expect(nlp.slotManager.intents.travel.toCity).toBeDefined();
      expect(nlp.slotManager.intents.travel.toCity.mandatory).toEqual(false);
      expect(nlp.slotManager.intents.travel.date).toBeDefined();
      expect(nlp.slotManager.intents.travel.date.mandatory).toEqual(true);
      expect(nlp.slotManager.intents.travel.date.locales).toBeDefined();
      expect(nlp.slotManager.intents.travel.date.locales.en).toEqual(
        'When do you want to travel from {{fromCity}} to {{toCity}}?'
      );
    });
    test('On initial processing slotFill.latestSlot is not set in response (because no asked slot filled now)', async () => {
      const corpus = {
        name: 'basic conversations',
        locale: 'en-us',
        entities: {
          clientName: {
            trim: [
              {
                position: 'betweenLast',
                leftWords: ['is', 'am'],
                rightWords: ['.'],
              },
              {
                position: 'afterLast',
                words: ['is', 'am'],
              },
            ],
          },
          location: {
            trim: [
              {
                position: 'betweenLast',
                leftWords: ['in', 'around'],
                rightWords: ['today', 'currently', 'at'],
              },
              {
                position: 'afterLast',
                words: ['in', 'around', 'to', 'at', 'from'],
              },
            ],
          },
        },
        data: [
          {
            intent: 'user.introduce',
            utterances: ['i am @clientName', 'my name is @clientName'],
            answer: [
              'Nice to meet you @clientName.',
              "It's a pleasure to meet you @clientName.",
            ],
            slotFilling: {
              clientName: "I'm sorry but i didn't get your name",
              location: 'Where are you from @clientName?',
            },
          },
        ],
      };
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      await nlp.addCorpus(corpus);
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.en.clientName).toBeDefined();
      expect(nlp.ner.rules.en.location).toBeDefined();
      expect(nlp.slotManager.intents['user.introduce']).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        text: 'my name is John',
      };
      const actual = await nlp.process(input);
      expect(actual.intent).toEqual('user.introduce');
      expect(actual.entities).toBeDefined();
      expect(actual.entities[0].entity).toEqual('clientName');
      expect(actual.entities[0].sourceText).toEqual('John');
      expect(actual.slotFill).toBeDefined();
      expect(actual.slotFill.currentSlot).toEqual('location');
      expect(actual.slotFill.latestSlot).toBeUndefined();
    });
    test('The corpus can contain entities with action details', async () => {
      const corpus = {
        name: 'Slot Filling Corpus',
        locale: 'en-US',
        data: [
          {
            intent: 'whatTimeIsIt',
            utterances: ['What time is it?'],
            answers: ["It is {{ time }} o'clock."],
            actions: [
              {
                name: 'handleWhatsTimeIntent',
                parameters: ['en-US', 'parameter 2'],
              },
            ],
          },
          {
            intent: 'whatDayIsIt',
            utterances: ['What day is it?'],
            answers: ['It is {{ day }}.'],
            actions: ['handleWhatsDayIntent', 'fallbackAction'],
          },
        ],
      };
      const nlp = new Nlp();
      await nlp.addCorpus(corpus);
      expect(nlp.actionManager.actions.whatTimeIsIt).toBeDefined();
      expect(nlp.actionManager.actions.whatTimeIsIt[0]).toBeDefined();
      expect(nlp.actionManager.actions.whatTimeIsIt[0].action).toEqual(
        'handleWhatsTimeIntent'
      );
      expect(nlp.actionManager.actions.whatTimeIsIt[0].parameters).toEqual([
        'en-US',
        'parameter 2',
      ]);
      expect(nlp.actionManager.actions.whatDayIsIt).toBeDefined();
      expect(nlp.actionManager.actions.whatDayIsIt[0]).toBeDefined();
      expect(nlp.actionManager.actions.whatDayIsIt[0].action).toEqual(
        'handleWhatsDayIntent'
      );
      expect(nlp.actionManager.actions.whatDayIsIt[0].parameters).toEqual([]);
      expect(nlp.actionManager.actions.whatDayIsIt[1]).toBeDefined();
      expect(nlp.actionManager.actions.whatDayIsIt[1].action).toEqual(
        'fallbackAction'
      );
      expect(nlp.actionManager.actions.whatDayIsIt[1].parameters).toEqual([]);
      expect(
        nlp.actionManager.actionsMap.handleWhatsTimeIntent
      ).toBeUndefined();
      expect(nlp.actionManager.actionsMap.handleWhatsDayIntent).toBeUndefined();
      expect(nlp.actionManager.actionsMap.fallbackAction).toBeUndefined();
    });
  });

  describe('addCorpora', () => {
    test('A corpora can be added as a json', async () => {
      const nlp = new Nlp();
      await nlp.addCorpora([defaultCorpus]);
      expect(nlp.nluManager.domainManagers.en.sentences).toHaveLength(7);
    });
    test('A corpora can be added as a json but not an array', async () => {
      const nlp = new Nlp();
      await nlp.addCorpora(defaultCorpus);
      expect(nlp.nluManager.domainManagers.en.sentences).toHaveLength(7);
    });
    test('If corpora is not defined, it should not crash', async () => {
      const nlp = new Nlp();
      await nlp.addCorpora();
      expect(nlp.nluManager).toBeDefined();
    });
  });

  describe('Process an utterance with entities', () => {
    test('The entity is registered in slotManager with addDocument', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Hi, my name is @forename!', 'hi_intent');
      expect(nlp.slotManager.intents.hi_intent).toBeDefined();
      expect(nlp.slotManager.intents.hi_intent.forename).toBeDefined();
      expect(nlp.ner.rules).toEqual({});
    });
    test('An enum entity is selected when matching and a trim definition is also existing for the entity', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument(
        'en',
        'Tell me about the @attribute of the device',
        'attribute_intent'
      );

      nlp.addNerRuleOptionTexts('en', 'attribute', 'display', [
        'display',
        'screen',
      ]);
      nlp.addNerRuleOptionTexts('en', 'attribute', 'cpu', ['cpu', 'processor']);
      nlp.addNerBetweenCondition('en', 'attribute', ['the'], 'of');

      expect(nlp.slotManager.intents.attribute_intent).toBeDefined();
      expect(nlp.slotManager.intents.attribute_intent.attribute).toBeDefined();
      expect(nlp.ner.rules.en.attribute).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Tell me about the screen of the device',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('attribute_intent');
      expect(output.entities[0].type).toBe('enum');
      expect(output.entities[0].entity).toBe('attribute');
      expect(output.entities[0].option).toBe('display');
      expect(output.entities[1]).toBeUndefined();
      expect(output.answer).toBeUndefined();
    });
    test('A trim entity is selected when matching and a parallel enum do not match', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument(
        'en',
        'Tell me about the @attribute of the device',
        'attribute_intent'
      );

      nlp.addNerRuleOptionTexts('en', 'attribute', 'display', [
        'display',
        'screen',
      ]);
      nlp.addNerRuleOptionTexts('en', 'attribute', 'cpu', ['cpu', 'processor']);
      nlp.addNerBetweenCondition('en', 'attribute', ['the'], 'of');

      expect(nlp.slotManager.intents.attribute_intent).toBeDefined();
      expect(nlp.slotManager.intents.attribute_intent.attribute).toBeDefined();
      expect(nlp.ner.rules.en.attribute).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'Tell me about the mainboard of the device',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('attribute_intent');
      expect(output.entities[0].type).toBe('trim');
      expect(output.entities[0].entity).toBe('attribute');
      expect(output.entities[0].sourceText).toBe('mainboard');
      expect(output.entities[0].option).toBeUndefined();
      expect(output.entities[1]).toBeUndefined();
      expect(output.answer).toBeUndefined();
    });
    test('The intent entities get priority over non-intent entities when matching (standard)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Hi, my name is @forename!', 'forename_intent');
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeUndefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('forename');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.answer).toBeUndefined();
    });
    test('We discover two entities, also an additional one which is not in any intent-utterance (standard)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'Hi, my name is @forename!', 'forename_intent');
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeUndefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 mylastname!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('forename');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1].entity).toBe('lastname');
      expect(output.entities[1].option).toBe('mylastname');
      expect(output.answer).toBeUndefined();
    });
    test('We discover two entities, also when overlapping (standard)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument(
        'en',
        'Hi, my name is @forename @lastname!',
        'forename_intent'
      );
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeDefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 myforename2!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('lastname');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1].entity).toBe('forename');
      expect(output.entities[1].option).toBe('myforename2');
      expect(output.answer).toBeUndefined();
    });
    test('We discover two entities, also when overlapping #2 (standard)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
      });
      nlp.addDocument('en', 'convert from @ccyFrom to @ccyTo', 'GetForexRates');
      nlp.addAnswer(
        'en',
        'GetForexRates',
        '{{ ccyFrom }} is equal to 76 {{ ccyTo }}'
      );

      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyFrom', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'usd', ['USD', 'Dollar']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'inr', ['INR', 'rupee']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'aud', ['AUD']);
      nlp.addNerRuleOptionTexts('en', 'ccyTo', 'gbp', ['GBP', 'Pound']);

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'convert from USD to INR',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('GetForexRates');
      expect(output.entities[0].entity).toBe('ccyFrom');
      expect(output.entities[0].option).toBe('usd');
      expect(output.entities[1].entity).toBe('ccyTo');
      expect(output.entities[1].option).toBe('inr');
      expect(output.answer).toBeDefined();
    });
    test('Non intent entities are ignored in matching when considerOnlyIntentEntities is used', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        ner: {
          considerOnlyIntentEntities: true,
        },
      });
      nlp.addDocument('en', 'Hi, my name is @forename!', 'forename_intent');
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeUndefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 mylastname!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('forename');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1]).toBeUndefined();
      expect(output.answer).toBeUndefined();
    });
    test('We discover two entities, also when overlapping (also with considerOnlyIntentEntities)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        ner: {
          considerOnlyIntentEntities: true,
        },
      });
      nlp.addDocument(
        'en',
        'Hi, my name is @forename @lastname!',
        'forename_intent'
      );
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeDefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 myforename2!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('lastname');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1].entity).toBe('forename');
      expect(output.entities[1].option).toBe('myforename2');
      expect(output.answer).toBeUndefined();
    });
    test('We discover two entities, also when overlapping and multiple utterances (also with considerOnlyIntentEntities)', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        ner: {
          considerOnlyIntentEntities: true,
        },
      });
      nlp.addDocument(
        'en',
        'Hi, my name is @forename @lastname!',
        'name_intent'
      );
      nlp.addDocument('en', 'Hi, my name is @lastname!', 'name_intent');
      nlp.addDocument('en', 'Hi, my name is @forename!', 'name_intent');
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.name_intent).toBeDefined();
      expect(nlp.slotManager.intents.name_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.name_intent.lastname).toBeDefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 myforename2!',
      };
      const output = await nlp.process(input);
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('name_intent');
      expect(output.entities[0].entity).toBe('lastname');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1].entity).toBe('forename');
      expect(output.entities[1].option).toBe('myforename2');
      expect(output.answer).toBeUndefined();
    });
    test('Non intent entities are ignored in matching when considerOnlyIntentEntities is used, multi same entity still possible', async () => {
      const nlp = new Nlp({
        languages: ['en'],
        autoSave: false,
        ner: {
          considerOnlyIntentEntities: true,
        },
      });
      nlp.addDocument('en', 'Hi, my name is @forename!', 'forename_intent');
      nlp.addNerRuleOptionTexts('en', 'lastname', 'myforename2', [
        'myforename2',
      ]);
      nlp.addNerRuleOptionTexts('en', 'lastname', 'mylastname', ['mylastname']);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename1', [
        'myforename1',
      ]);
      nlp.addNerRuleOptionTexts('en', 'forename', 'myforename2', [
        'myforename2',
      ]);

      expect(nlp.slotManager.intents.forename_intent).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.forename).toBeDefined();
      expect(nlp.slotManager.intents.forename_intent.lastname).toBeUndefined();
      expect(nlp.ner.rules.en.forename).toBeDefined();
      expect(nlp.ner.rules.en.lastname).toBeDefined();

      await nlp.train();
      const input = {
        locale: 'en',
        utterance: 'my name is myforename2 myforename1!',
      };
      const output = await nlp.process(input, {});
      expect(output.utterance).toEqual(input.utterance);
      expect(output.intent).toEqual('forename_intent');
      expect(output.entities[0].entity).toBe('forename');
      expect(output.entities[0].option).toBe('myforename2');
      expect(output.entities[1].entity).toBe('forename');
      expect(output.entities[1].option).toBe('myforename1');
      expect(output.answer).toBeUndefined();
    });
  });

  describe('addNerBetweenCondition', () => {
    test('It should extract a between rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBetweenCondition('en', 'entity', 'from', 'to');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid to Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          start: 18,
          end: 23,
          accuracy: 1,
          sourceText: 'Madrid',
          entity: 'entity',
          type: 'trim',
          subtype: 'between',
          utteranceText: 'Madrid',
          len: 6,
        },
      ]);
    });
    test('It should extract a between rule and return longest string', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBetweenCondition('en', 'entity', 'from', 'to');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid to Barcelona and then back from Barcelona to Madrid',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          start: 18,
          end: 65,
          accuracy: 1,
          sourceText: 'Madrid to Barcelona and then back from Barcelona',
          entity: 'entity',
          type: 'trim',
          subtype: 'between',
          utteranceText: 'Madrid to Barcelona and then back from Barcelona',
          len: 48,
        },
      ]);
    });
  });

  describe('addNerBetweenLastCondition', () => {
    test('It should extract a between last rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBetweenLastCondition('en', 'entity', 'from', 'to');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid to Barcelona and then back from Barcelona to Madrid',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          start: 57,
          end: 65,
          accuracy: 1,
          sourceText: 'Barcelona',
          entity: 'entity',
          type: 'trim',
          subtype: 'between',
          utteranceText: 'Barcelona',
          len: 9,
        },
      ]);
    });
  });

  describe('addNerBeforeCondition', () => {
    test('It should extract a before rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBeforeCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'before',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
          alias: 'entity_0',
        },
        {
          type: 'trim',
          subtype: 'before',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
          alias: 'entity_1',
        },
      ]);
    });
  });

  describe('addNerBeforeLastCondition', () => {
    test('It should extract a before last rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBeforeLastCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeLast',
          start: 0,
          end: 23,
          len: 24,
          accuracy: 0.99,
          sourceText: 'I have to go from Madrid',
          utteranceText: 'I have to go from Madrid',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addNerBeforeFirstCondition', () => {
    test('It should extract a before first rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerBeforeFirstCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'beforeFirst',
          start: 0,
          end: 11,
          len: 12,
          accuracy: 0.99,
          sourceText: 'I have to go',
          utteranceText: 'I have to go',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addNerAfterCondition', () => {
    test('It should extract a get after rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerAfterCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'after',
          start: 18,
          end: 23,
          len: 6,
          accuracy: 0.99,
          sourceText: 'Madrid',
          utteranceText: 'Madrid',
          entity: 'entity',
          alias: 'entity_0',
        },
        {
          type: 'trim',
          subtype: 'after',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
          alias: 'entity_1',
        },
      ]);
    });
  });

  describe('addNerAfterFirstCondition', () => {
    test('It should extract a get after first rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerAfterFirstCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterFirst',
          start: 18,
          end: 38,
          len: 21,
          accuracy: 0.99,
          sourceText: 'Madrid from Barcelona',
          utteranceText: 'Madrid from Barcelona',
          entity: 'entity',
        },
      ]);
    });
  });

  describe('addNerAfterLastCondition', () => {
    test('It should extract a get after last rule', async () => {
      const nlp = new Nlp({ forceNER: true });
      nlp.addNerAfterLastCondition('en', 'entity', 'from');
      const input = {
        locale: 'en',
        text: 'I have to go from Madrid from Barcelona',
      };
      const actual = await nlp.process(input);
      expect(actual.entities).toEqual([
        {
          type: 'trim',
          subtype: 'afterLast',
          start: 30,
          end: 38,
          len: 9,
          accuracy: 0.99,
          sourceText: 'Barcelona',
          utteranceText: 'Barcelona',
          entity: 'entity',
        },
      ]);
    });
  });
});
