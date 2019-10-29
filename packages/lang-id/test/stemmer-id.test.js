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

const { NormalizerId, TokenizerId, StemmerId } = require('../src');

const normalizer = new NormalizerId();
const tokenizer = new TokenizerId();
const stemmer = new StemmerId();

function tokenizeAndStem(utterance) {
  const normalized = normalizer.normalize(utterance);
  const tokens = tokenizer.tokenize(normalized);
  const result = stemmer.stem(tokens);
  return result;
}

const words = {
  mei: 'mei',
  bui: 'bui',
  nilai: 'nilai',
  hancurlah: 'hancur',
  jubahku: 'jubah',
  bajumu: 'baju',
  celananya: 'celana',
  hantui: 'hantu',
  jualan: 'jual',
  bukumukah: 'buku',
  miliknyalah: 'milik',
  kulitkupun: 'kulit',
  berikanku: 'beri',
  sakitimu: 'sakit',
  beriannya: 'beri',
  kasihilah: 'kasih',
  dibuang: 'buang',
  kesakitan: 'sakit',
  sesuap: 'suap',
  beradu: 'adu',
  berambut: 'rambut',
  bersuara: 'suara',
  berdaerah: 'daerah',
  belajar: 'ajar',
  beternak: 'ternak',
  terasing: 'asing',
  teraup: 'raup',
  tergerak: 'gerak',
  terpuruk: 'puruk',
  teterbang: 'terbang',
  melipat: 'lipat',
  meringkas: 'ringkas',
  mewarnai: 'warna',
  membangun: 'bangun',
  memfitnah: 'fitnah',
  memvonis: 'vonis',
  memperbarui: 'baru',
  mempelajari: 'ajar',
  meminum: 'minum',
  memukul: 'pukul',
  mencinta: 'cinta',
  mendua: 'dua',
  menjauh: 'jauh',
  menziarah: 'ziarah',
  menuklir: 'nuklir',
  menangkap: 'tangkap',
  menggila: 'gila',
  menghajar: 'hajar',
  mengqasar: 'qasar',
  mengudara: 'udara',
  mengupas: 'kupas',
  menyuarakan: 'suara',
  mempopulerkan: 'populer',
  pewarna: 'warna',
  peyoga: 'yoga',
  peradilan: 'adil',
  perumahan: 'rumah',
  permuka: 'muka',
  perdaerah: 'daerah',
  pembangun: 'bangun',
  pemfitnah: 'fitnah',
  pemvonis: 'vonis',
  peminum: 'minum',
  pemukul: 'pukul',
  pencinta: 'cinta',
  pendahulu: 'dahulu',
  penjarah: 'jarah',
  penziarah: 'ziarah',
  penasihat: 'nasihat',
  penangkap: 'tangkap',
  penggila: 'gila',
  penghajar: 'hajar',
  pengqasar: 'qasar',
  pengudara: 'udara',
  pengupas: 'kupas',
  penyuara: 'suara',
  pelajar: 'ajar',
  pelabuhan: 'labuh',
  petarung: 'tarung',
  terpercaya: 'percaya',
  pekerja: 'kerja',
  peserta: 'serta',
  mempengaruhi: 'pengaruh',
  mengkritik: 'kritik',
  bersekolah: 'sekolah',
  bertahan: 'tahan',
  mencapai: 'capai',
  petani: 'tani',
  terabai: 'abai',
  mensyaratkan: 'syarat',
  mensyukuri: 'syukur',
  mengebom: 'bom',
  mempromosikan: 'promosi',
  memproteksi: 'proteksi',
  memprediksi: 'prediksi',
  pengkajian: 'kaji',
  pengebom: 'bom',
  bersembunyi: 'sembunyi',
  bersembunyilah: 'sembunyi',
  pelanggan: 'langgan',
  pelaku: 'laku',
  pelangganmukah: 'langgan',
  pelakunyalah: 'laku',
  perbaikan: 'baik',
  kebaikannya: 'baik',
  bisikan: 'bisik',
  berpelanggan: 'langgan',
  bermakanan: 'makan',
  menyala: 'nyala',
  menyanyikan: 'nyanyi',
  menyatakannya: 'nyata',
  penyanyi: 'nyanyi',
  penyawaan: 'nyawa',
  lemigas: 'ligas',
  kinerja: 'kerja',
  'buku-buku': 'buku',
  'berbalas-balasan': 'balas',
  'bolak-balik': 'bolak-balik',
  bertebaran: 'tebar',
  terasingkan: 'asing',
  membangunkan: 'bangun',
  mencintai: 'cinta',
  menduakan: 'dua',
  menjauhi: 'jauh',
  menggilai: 'gila',
  pembangunan: 'bangun',
  marwan: 'marwan',
  subarkah: 'subarkah',
  memberdayakan: 'daya',
  persemakmuran: 'makmur',
  keberuntunganmu: 'untung',
  kesepersepuluhnya: 'sepuluh',
  Perekonomian: 'ekonomi',
  menahan: 'tahan',
  peranan: 'peran',
  medannya: 'medan',
  berbadan: 'badan',
  abdullah: 'abdullah',
  finalisasi: 'final',
  penstabilan: 'stabil',
  pentranskripsi: 'transkripsi',
  mentaati: 'taat',
  'meniru-nirukan': 'tiru',
  'menyepak-nyepak': 'sepak',
  melewati: 'lewat',
  menganga: 'nganga',
  kupukul: 'pukul',
  kauhajar: 'hajar',
  'kuasa-Mu': 'kuasa',
  'malaikat-malaikat-Nya': 'malaikat',
  'nikmat-Ku': 'nikmat',
  'allah-lah': 'allah',
  benarkah: 'benar',
  siapapun: 'siapa',
  bekerja: 'kerja',
  meyakinkan: 'yakin',
  dimulai: 'mulai',
  memberikan: 'beri',
  sebagai: 'bagai',
};

describe('Indonesian Stemmer', () => {
  describe('Should stem words', () => {
    const keys = Object.keys(words);
    for (let i = 0; i < keys.length; i += 1) {
      const word = keys[i];
      const expected = words[word];
      test(`It should stem "${word}"`, () => {
        const actual = tokenizeAndStem(word);
        expect(actual).toEqual([expected]);
      });
    }
  });
});
