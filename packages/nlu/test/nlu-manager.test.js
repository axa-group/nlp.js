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

const { NluManager } = require('../src');
const container = require('./bootstrap');
const {
  addFoodDomainEn,
  addFoodDomainEs,
  addPersonalityDomainEn,
  addPersonalityDomainEs,
} = require('./domains');

describe('NLU Manager', () => {
  describe('constructor', () => {
    test('Should create a new instance', () => {
      const manager = new NluManager({ container });
      expect(manager).toBeDefined();
    });
    test('Languages can be provided', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      expect(manager.locales).toEqual(['en', 'es']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en', 'es']);
    });
  });

  describe('Add language', () => {
    test('A language can be added', () => {
      const manager = new NluManager({ container });
      manager.addLanguage('en');
      expect(manager.locales).toEqual(['en']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en']);
    });
    test('If the language is added 2 times, second time does not change manager', () => {
      const manager = new NluManager({ container });
      manager.addLanguage('en');
      manager.addLanguage('en');
      expect(manager.locales).toEqual(['en']);
      expect(Object.keys(manager.domainManagers)).toEqual(['en']);
    });
  });

  describe('Guess language', () => {
    test('If there is only one language, then return this one', () => {
      const manager = new NluManager({ container });
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
      manager.addLanguage(['en']);
      const language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
    });
    test('Should guess the language of an utterance', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      let language = manager.guessLanguage('what is?');
      expect(language).toEqual('en');
      language = manager.guessLanguage('¿Qué es?');
      expect(language).toEqual('es');
    });
    test('Should return undefined if cannot be guessed', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      const language = manager.guessLanguage('');
      expect(language).toBeUndefined();
    });
  });

  describe('Assign Domain', () => {
    test('Domains can be assigned to intents', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.intentDomains.en.a).toEqual('domain1');
      expect(manager.intentDomains.en.b).toEqual('domain1');
      expect(manager.intentDomains.en.c).toEqual('domain2');
      expect(manager.intentDomains.en.d).toEqual('domain2');
      expect(manager.intentDomains.es.a).toEqual('domain1');
      expect(manager.intentDomains.es.b).toEqual('domain1');
      expect(manager.intentDomains.es.c).toEqual('domain2');
      expect(manager.intentDomains.es.d).toEqual('domain3');
    });
  });

  describe('Get Intent Domain', () => {
    test('I can get the domain of an intent in a given language', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('en', 'a')).toEqual('domain1');
      expect(manager.getIntentDomain('en', 'b')).toEqual('domain1');
      expect(manager.getIntentDomain('en', 'c')).toEqual('domain2');
      expect(manager.getIntentDomain('en', 'd')).toEqual('domain2');
      expect(manager.getIntentDomain('es', 'a')).toEqual('domain1');
      expect(manager.getIntentDomain('es', 'b')).toEqual('domain1');
      expect(manager.getIntentDomain('es', 'c')).toEqual('domain2');
      expect(manager.getIntentDomain('es', 'd')).toEqual('domain3');
    });
    test('If the intent has not domain assigned return default', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('en', 'e')).toEqual('default');
    });
    test('If the locale does not exists return default', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      expect(manager.getIntentDomain('fr', 'a')).toEqual('default');
    });
  });

  describe('Get Domains', () => {
    test('It should return a tree of languages, domains an intents', () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      manager.assignDomain('en', 'a', 'domain1');
      manager.assignDomain('en', 'b', 'domain1');
      manager.assignDomain('en', 'c', 'domain2');
      manager.assignDomain('en', 'd', 'domain2');
      manager.assignDomain('es', 'a', 'domain1');
      manager.assignDomain('es', 'b', 'domain1');
      manager.assignDomain('es', 'c', 'domain2');
      manager.assignDomain('es', 'd', 'domain3');
      const expected = {
        en: {
          domain1: ['a', 'b'],
          domain2: ['c', 'd'],
        },
        es: {
          domain1: ['a', 'b'],
          domain2: ['c'],
          domain3: ['d'],
        },
      };
      const actual = manager.getDomains();
      expect(actual).toEqual(expected);
    });
  });

  describe('Add Document', () => {
    test('A document can be added', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('A document can be added training by domain', () => {
      const manager = new NluManager({ container, trainByDomain: true });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      manager.add(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined, then guess it training by domain', () => {
      const manager = new NluManager({ container, trainByDomain: true });
      manager.addLanguage(['en', 'es']);
      manager.add(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(1);
    });
    test('If locale is not defined and cannot be guessed, throw an error', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      expect(() => manager.add(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      expect(() => manager.add('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Remove Document', () => {
    test('A document can be removed', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      manager.remove('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('A document can be removed training by domain', () => {
      const manager = new NluManager({ container, trainByDomain: true });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      manager.remove('es', 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      manager.remove(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale is not defined then guess it training by domain', () => {
      const manager = new NluManager({ container, trainByDomain: true });
      manager.addLanguage(['en', 'es']);
      manager.add('es', 'Dónde están las llaves', 'keys');
      manager.remove(undefined, 'Dónde están las llaves', 'keys');
      expect(manager.domainManagers.es.sentences).toHaveLength(0);
    });
    test('If locale cannot be guessed then throw an error', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      expect(() => manager.remove(undefined, '', 'keys')).toThrow(
        'Locale must be defined'
      );
    });
    test('If there is not domain for the given language, throw an error', () => {
      const manager = new NluManager({ container });
      manager.addLanguage(['en', 'es']);
      expect(() => manager.remove('fr', 'Bonjour', 'greet')).toThrow(
        'Domain Manager not found for locale fr'
      );
    });
  });

  describe('Train', () => {
    test('Can train several domains', async () => {
      const manager = new NluManager({ container, locales: ['en', 'es'] });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
    });
  });

  describe('Fill Language', () => {
    test('If not data is provided, then guess undefined', () => {
      const manager = new NluManager({ container });
      const actual = manager.fillLanguage({ utterance: '' });
      expect(actual.language).toBeUndefined();
      expect(actual.locale).toBeUndefined();
      expect(actual.localeIso2).toBeUndefined();
    });
    test('If has language but not data is provided, then guess as unique existing language', () => {
      const manager = new NluManager({ container, locales: ['en'] });
      const actual = manager.fillLanguage({ utterance: '' });
      expect(actual.language).toEqual('English');
      expect(actual.locale).toEqual('en');
      expect(actual.localeIso2).toEqual('en');
    });
    test('If has language the provided is not in the list, return the source one', () => {
      const manager = new NluManager({ container, locales: ['en'] });
      const actual = manager.fillLanguage({
        locale: 'es',
        utterance: 'la lluvia en sevilla es pura maravilla',
      });
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeIso2).toEqual('es');
    });
  });

  describe('Process', () => {
    test('Can classify if I provide locale without using None Feature', async () => {
      const manager = new NluManager({
        container,
        locales: ['en', 'es'],
        useNoneFeature: false,
        trainByDomain: true,
      });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const actual = await manager.process('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(2);
      expect(actual.classifications[0].intent).toEqual('agent.acquaintance');
      expect(actual.classifications[0].score).toBeGreaterThan(0.8);
    });
    test('Can classify if I provide locale', async () => {
      const manager = new NluManager({
        container,
        locales: ['en', 'es'],
        trainByDomain: true,
      });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const actual = await manager.process('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(2);
      expect(actual.classifications[0].intent).toEqual('agent.acquaintance');
      expect(actual.classifications[0].score).toBeGreaterThan(0.8);
    });
  });

  describe('toJSON and fromJSON', () => {
    test('I can export and import and should work', async () => {
      const manager = new NluManager({
        container,
        locales: ['en', 'es'],
        useNoneFeature: false,
        trainByDomain: true,
      });
      addFoodDomainEn(manager);
      addPersonalityDomainEn(manager);
      addFoodDomainEs(manager);
      addPersonalityDomainEs(manager);
      await manager.train();
      const manager2 = new NluManager({ container });
      manager2.fromJSON(manager.toJSON());
      const actual = await manager2.process('es', 'dime quién eres tú');
      expect(actual.domain).toEqual('personality');
      expect(actual.language).toEqual('Spanish');
      expect(actual.locale).toEqual('es');
      expect(actual.localeGuessed).toBeFalsy();
      expect(actual.localeIso2).toEqual('es');
      expect(actual.utterance).toEqual('dime quién eres tú');
      expect(actual.classifications).toHaveLength(2);
      expect(actual.classifications[0].intent).toEqual('agent.acquaintance');
      expect(actual.classifications[0].score).toBeGreaterThan(0.8);
    });
  });

  describe('Is equal classification', () => {
    test('Should return true if the two frist classifications have the same score', () => {
      const manager = new NluManager({ container });
      const classifications = [];
      classifications.push({ intent: 'a', score: 0.6 });
      classifications.push({ intent: 'b', score: 0.6 });
      classifications.push({ intent: 'c', score: 0.5 });
      classifications.push({ intent: 'd', score: 0.5 });
      classifications.push({ intent: 'e', score: 0.5 });
      classifications.push({ intent: 'f', score: 0.5 });
      const result = manager.classificationsIsNone(classifications);
      expect(result).toBeTruthy();
    });
    test('Should return false if first score is different than second score', () => {
      const manager = new NluManager({ container });
      const classifications = [];
      classifications.push({ intent: 'a', score: 0.7 });
      classifications.push({ intent: 'b', score: 0.6 });
      classifications.push({ intent: 'c', score: 0.6 });
      classifications.push({ intent: 'd', score: 0.5 });
      classifications.push({ intent: 'e', score: 0.5 });
      classifications.push({ intent: 'f', score: 0.5 });
      const result = manager.classificationsIsNone(classifications);
      expect(result).toBeFalsy();
    });
  });
});
