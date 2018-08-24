const { NlpManager } = require('../../../lib');

expect.extend({
  toContainResolution(received, argument) {
    for (let i = 0; i < received.length; i += 1) {
      const actual = received[i];
      if (actual.resolution) {
        const pass = this.equals(actual.resolution, argument);
        if (pass) {
          return {
            message: () => (`expected ${this.utils.printReceived(received)} not to contain resolution ${this.utils.printExpected(argument)}`),
            pass: true,
          };
        }
      }
    }
    return {
      message: () => (`expected ${this.utils.printReceived(received)} to contain resolution ${this.utils.printExpected(argument)}`),
      pass: false,
    };
  },
});

const ageTests = [
  {
    utteranceEn: 'When she was five years old, she learned to ride a bike',
    utteranceEs: 'Cuando tenía cinco años, aprendió a montar en bici.',
    utteranceFr: 'Quand elle avait cinq ans, elle a appris à aller à une bicyclette',
    utterancePt: 'Quando tinha cinco anos, aprendeu a andar de bicicleta.',
    result: { strValue: '5', value: 5, unit: 'Year' },
  },
  {
    utteranceEn: 'This saga is ten years old',
    utteranceEs: 'Esta saga se remonta a casi diez años atrás.',
    utteranceFr: 'Cette saga a dix ans.',
    utterancePt: 'Esta saga remonta a quase dez anos atrás',
    result: { strValue: '10', value: 10, unit: 'Year' },
  },
  {
    utteranceEn: 'I\'m only 29 years old!',
    utteranceEs: '¡Mi pelo ya está gris y sólo tengo 29 años!',
    utteranceFr: 'J\'ai seulement 29 ans!',
    utterancePt: 'Só tenho 29 anos!',
    result: { strValue: '29', value: 29, unit: 'Year' },
  },
  {
    utteranceEn: 'Now, after ninety five years of age, perspectives change.',
    utteranceEs: 'Ahora cuenta noventa y cinco años: tiene una perspectiva de las cosas y tiene memoria.',
    // utteranceFr: 'Maintenant, après quatre vingt quince ans, mes perspectives changent',
    utterancePt: 'Agora com noventa e cinco anos tens perspectiva das coisas',
    result: { strValue: '95', value: 95, unit: 'Year' },
  },
  {
    utteranceEn: 'The Great Wall of China is more than 500 years old and extends for more than 5,000 miles',
    utteranceEs: 'La Gran Muralla china tiene más de 500 años y se extiende más de 5,000 millas.',
    utteranceFr: 'La Grande Muraille de Chine a plus de 500 ans et prolonge au-dessus de 5000 miles',
    utterancePt: 'A Grande Muralha da China tem mais de 500 anos e se extende por mais de 5,000 milhas',
    result: { strValue: '500', value: 500, unit: 'Year' },
  },
  {
    utteranceEn: 'She\'s 60 years old; she was born in May 8, 1945.',
    utteranceEs: 'Ya tiene 60 años, pues en principio nació el 8 de mayo de 1945.',
    utteranceFr: 'Elle est 60 ans; elle est née dans le 8 mai 1945',
    utterancePt: 'Já tem 60 anos, pois nasceu em 8 de maio de 1945',
    result: { strValue: '60', value: 60, unit: 'Year' },
  },
  {
    utteranceEn: '25% of cases are not diagnosed until around 3 years of age.',
    utteranceEs: 'Y al 25% no se les diagnostica hasta que tienen casi tres años.',
    utteranceFr: '25 % de cas ne sont pas diagnostiqués jusqu\'à autour de 3 ans.',
    utterancePt: '25% dos casos não são diagnosticados até por volta dos tres anos',
    result: { strValue: '3', value: 3, unit: 'Year' },
  },
  {
    utteranceEn: 'When will there be pressure to fulfil a promise that is one year old?',
    utteranceEs: '¿Cuándo se va aplicar una presión seria para cumplir realmente esa promesa formulada hace un año?',
    utteranceFr: 'Quand sera là la pression pour accomplir une promesse qui est un ans?',
    utterancePt: 'Quando haverá pressão para comprir essa promessa feita há um ano?',
    result: { strValue: '1', value: 1, unit: 'Year' },
  },
  {
    utteranceEn: 'It happened when the baby was only ten months old',
    utteranceEs: 'La sublevación se produjo cuando yo era un bebé y tenía tan solo diez meses.',
    utteranceFr: 'C\'est arrivé quand le bébé était seulement dix mois',
    utterancePt: 'Aconteceu quando era um bebê e tinha apenas dez meses',
    result: { strValue: '10', value: 10, unit: 'Month' },
  },
  {
    utteranceEn: 'The committee proposal is 8 months old',
    utteranceEs: 'La propuesta de la Comisión tiene ya 8 meses.',
    utteranceFr: 'La proposition de comité est 8 mois',
    utterancePt: 'A proposta da comissão já tem 8 meses de idade',
    result: { strValue: '8', value: 8, unit: 'Month' },
  },
  {
    utteranceEn: 'Aproximately 50% of cases are diagnosed at around eighteen months of age',
    utteranceEs: 'Alrededor del 50% de ellos no se les diagnostica hasta los dieciocho meses de edad.',
    utteranceFr: '50 % de cas sont diagnostiqués a peus peu près dix-huit mois d\'âge',
    utterancePt: 'Aproximadamente 50% dos casos são diagnosticados aos dezoito meses de idade.',
    result: { strValue: '18', value: 18, unit: 'Month' },
  },
  {
    utteranceEn: 'It is possible, but in 2006 95% of them were younger than three months old.',
    utteranceEs: 'Es posible, pero en 2006 mataron a 330 000 focas arpa y el 95% de ellas tenían menos de tres meses.',
    utteranceFr: 'C\'est possible, mais en 2006 95 % d\'entre eux étaient plus jeunes que trois mois',
    utterancePt: 'É possível, mas em 2006 95% delas tinham menos de tres meses de vida',
    result: { strValue: '3', value: 3, unit: 'Month' },
  },
  {
    utteranceEn: 'If we go ahead in December, it will be three weeks old',
    utteranceEs: 'Si seguimos adelante con la resolución en el período parcial de sesiones de diciembre, tendrá para entonces tres semanas de antigüedad.',
    utteranceFr: 'Si nous avançons en décembre ce sera trois semaines vieilles',
    utterancePt: 'Se seguirmos adiante no período de dezembro, terão tres semanas de existência',
    result: { strValue: '3', value: 3, unit: 'Week' },
  },
  {
    utteranceEn: 'At 6 weeks of age, one can already celebrate Christmas',
    utteranceEs: 'A las 6 semanas de edad, ya se puede celebrar Navidad',
    utteranceFr: 'à l\'âge de 6 semaines, on peut déjà fêter Noël',
    utterancePt: 'Às 6 semanas de idade já comemora o Natal',
    result: { strValue: '6', value: 6, unit: 'Week' },
  },
  {
    utteranceEn: 'A 90 day old utilities bill is quite late',
    utteranceEs: 'Una factura impagada a los 90 días ya se considera morosidad',
    utteranceFr: 'Un 90 jour la vieille facture est tres tard',
    utterancePt: 'Uma conta vencida a 90 dias está bem atrasada',
    result: { strValue: '90', value: 90, unit: 'Day' },
  },
];

describe('NerManager Number builtins', () => {
  describe('Age English', () => {
    const locale = 'en';
    const utteranceName = 'utteranceEn';
    const manager = new NlpManager({
      languages: [locale],
    });
    for (let i = 0; i < ageTests.length; i += 1) {
      const testCase = ageTests[i];
      const utterance = testCase[utteranceName];
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(utterance).entities;
          expect(result).toContainResolution(testCase.result);
        });
      }
    }
  });
  describe('Age Spanish', () => {
    const locale = 'es';
    const utteranceName = 'utteranceEs';
    const manager = new NlpManager({
      languages: [locale],
    });
    for (let i = 0; i < ageTests.length; i += 1) {
      const testCase = ageTests[i];
      const utterance = testCase[utteranceName];
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(utterance).entities;
          expect(result).toContainResolution(testCase.result);
        });
      }
    }
  });
  describe('Age French', () => {
    const locale = 'fr';
    const utteranceName = 'utteranceFr';
    const manager = new NlpManager({
      languages: [locale],
    });
    for (let i = 0; i < ageTests.length; i += 1) {
      const testCase = ageTests[i];
      const utterance = testCase[utteranceName];
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(locale, utterance).entities;
          expect(result).toContainResolution(testCase.result);
        });
      }
    }
  });
  describe('Age Portuguese', () => {
    const locale = 'pt';
    const utteranceName = 'utterancePt';
    const manager = new NlpManager({
      languages: [locale],
    });
    for (let i = 0; i < ageTests.length; i += 1) {
      const testCase = ageTests[i];
      const utterance = testCase[utteranceName];
      if (utterance) {
        test(utterance, () => {
          const result = manager.process(locale, utterance).entities;
          expect(result).toContainResolution(testCase.result);
        });
      }
    }
  });
});
