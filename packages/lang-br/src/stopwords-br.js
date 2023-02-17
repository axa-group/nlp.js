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

const { Stopwords } = require('@nlpjs/core');

class StopwordsBr extends Stopwords {
  constructor(container, words) {
    super(container);
    this.name = 'stopwords-br';
    this.dictionary = {};
    const list = words || [
      'a',
      'acerca',
      'ademais',
      'adeus',
      'agora',
      'ainda',
      'algo',
      'algumas',
      'alguns',
      'ali',
      'além',
      'ambas',
      'ambos',
      'antes',
      'ao',
      'aos',
      'apenas',
      'apoia',
      'apoio',
      'apontar',
      'após',
      'aquela',
      'aquelas',
      'aquele',
      'aqueles',
      'aqui',
      'aquilo',
      'as',
      'assim',
      'através',
      'atrás',
      'até',
      'aí',
      'baixo',
      'bastante',
      'bem',
      'boa',
      'bom',
      'breve',
      'cada',
      'caminho',
      'catorze',
      'cedo',
      'cento',
      'certamente',
      'certeza',
      'cima',
      'cinco',
      'coisa',
      'com',
      'como',
      'comprida',
      'comprido',
      'conhecida',
      'conhecido',
      'conselho',
      'contra',
      'contudo',
      'corrente',
      'cuja',
      'cujo',
      'custa',
      'cá',
      'da',
      'daquela',
      'daquele',
      'dar',
      'das',
      'de',
      'debaixo',
      'demais',
      'dentro',
      'depois',
      'des',
      'desde',
      'dessa',
      'desse',
      'desta',
      'deste',
      'deve',
      'devem',
      'deverá',
      'dez',
      'dezanove',
      'dezasseis',
      'dezassete',
      'dezoito',
      'diante',
      'direita',
      'disso',
      'diz',
      'dizem',
      'dizer',
      'do',
      'dois',
      'dos',
      'doze',
      'duas',
      'dá',
      'dão',
      'e',
      'ela',
      'elas',
      'ele',
      'eles',
      'em',
      'embora',
      'enquanto',
      'entre',
      'então',
      'era',
      'essa',
      'essas',
      'esse',
      'esses',
      'esta',
      'estado',
      'estar',
      'estará',
      'estas',
      'estava',
      'este',
      'estes',
      'esteve',
      'estive',
      'estivemos',
      'estiveram',
      'estiveste',
      'estivestes',
      'estou',
      'está',
      'estás',
      'estão',
      'eu',
      'eventual',
      'exemplo',
      'falta',
      'fará',
      'favor',
      'faz',
      'fazeis',
      'fazem',
      'fazemos',
      'fazer',
      'fazes',
      'fazia',
      'faço',
      'fez',
      'fim',
      'final',
      'foi',
      'fomos',
      'for',
      'fora',
      'foram',
      'forma',
      'foste',
      'fostes',
      'fui',
      'geral',
      'grande',
      'grandes',
      'grupo',
      'inclusive',
      'iniciar',
      'inicio',
      'ir',
      'irá',
      'isso',
      'isto',
      'já',
      'lado',
      'lhe',
      'ligado',
      'local',
      'logo',
      'longe',
      'lugar',
      'lá',
      'maior',
      'maioria',
      'maiorias',
      'mais',
      'mal',
      'mas',
      'me',
      'meio',
      'menor',
      'menos',
      'meses',
      'mesmo',
      'meu',
      'meus',
      'mil',
      'minha',
      'minhas',
      'momento',
      'muito',
      'muitos',
      'máximo',
      'mês',
      'na',
      'nada',
      'naquela',
      'naquele',
      'nas',
      'nem',
      'nenhuma',
      'nessa',
      'nesse',
      'nesta',
      'neste',
      'no',
      'nos',
      'nossa',
      'nossas',
      'nosso',
      'nossos',
      'nova',
      'novas',
      'nove',
      'novo',
      'novos',
      'num',
      'numa',
      'nunca',
      'nuns',
      'não',
      'nível',
      'nós',
      'número',
      'números',
      'o',
      'obrigada',
      'obrigado',
      'oitava',
      'oitavo',
      'oito',
      'onde',
      'ontem',
      'onze',
      'ora',
      'os',
      'ou',
      'outra',
      'outras',
      'outros',
      'para',
      'parece',
      'parte',
      'partir',
      'pegar',
      'pela',
      'pelas',
      'pelo',
      'pelos',
      'perto',
      'pode',
      'podem',
      'poder',
      'poderá',
      'podia',
      'pois',
      'ponto',
      'pontos',
      'por',
      'porquanto',
      'porque',
      'porquê',
      'portanto',
      'porém',
      'posição',
      'possivelmente',
      'posso',
      'possível',
      'pouca',
      'pouco',
      'povo',
      'primeira',
      'primeiro',
      'próprio',
      'próxima',
      'próximo',
      'puderam',
      'pôde',
      'põe',
      'põem',
      'quais',
      'qual',
      'qualquer',
      'quando',
      'quanto',
      'quarta',
      'quarto',
      'quatro',
      'que',
      'quem',
      'quer',
      'querem',
      'quero',
      'questão',
      'quieta',
      'quieto',
      'quinta',
      'quinto',
      'quinze',
      'quê',
      'relação',
      'sabe',
      'saber',
      'se',
      'segunda',
      'segundo',
      'sei',
      'seis',
      'sem',
      'sempre',
      'ser',
      'seria',
      'sete',
      'seu',
      'seus',
      'sexta',
      'sexto',
      'sim',
      'sistema',
      'sob',
      'sobre',
      'sois',
      'somente',
      'somos',
      'sou',
      'sua',
      'suas',
      'são',
      'sétima',
      'sétimo',
      'só',
      'tais',
      'tal',
      'talvez',
      'também',
      'tanta',
      'tanto',
      'tarde',
      'te',
      'tem',
      'temos',
      'tempo',
      'tendes',
      'tenho',
      'tens',
      'tentar',
      'tentaram',
      'tente',
      'tentei',
      'ter',
      'terceira',
      'terceiro',
      'teu',
      'teus',
      'teve',
      'tipo',
      'tive',
      'tivemos',
      'tiveram',
      'tiveste',
      'tivestes',
      'toda',
      'todas',
      'todo',
      'todos',
      'treze',
      'três',
      'tu',
      'tua',
      'tuas',
      'tudo',
      'tão',
      'têm',
      'um',
      'uma',
      'umas',
      'uns',
      'usa',
      'usar',
      'vai',
      'vais',
      'valor',
      'veja',
      'vem',
      'vens',
      'ver',
      'vez',
      'vezes',
      'vinda',
      'vindo',
      'vinte',
      'você',
      'vocês',
      'vos',
      'vossa',
      'vossas',
      'vosso',
      'vossos',
      'vários',
      'vão',
      'vêm',
      'vós',
      'zero',
      'à',
      'às',
      'área',
      'é',
      'és',
      'último',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '_',
    ];
    this.build(list);
  }
}

module.exports = StopwordsBr;
