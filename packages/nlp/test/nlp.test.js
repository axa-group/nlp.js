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
        },
      };
      const nlp = new Nlp();
      await nlp.addCorpus(corpus);
      expect(nlp.ner.rules.en).toBeDefined();
      expect(nlp.ner.rules.es).toBeDefined();
      expect(nlp.ner.rules.en.hero).toBeDefined();
      expect(nlp.ner.rules.en.email).toBeDefined();
      expect(nlp.ner.rules.es.hero).toBeDefined();
      expect(nlp.ner.rules.es.email).toBeDefined();
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
