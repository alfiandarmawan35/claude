// Grid tempo dan waktu cue: satu-satunya sumber waktu untuk gambar, musik, mix, dan subtitle.
export const BPM = 110, BEAT = 60 / BPM;
export const b = n => +(n * BEAT).toFixed(4);           // ketukan ke detik
export const DUR = 54;

export const TL = {
  KARTU: b(1),          // kartu permintaan jatuh ke dek
  KAPAL0: b(2), KAPAL1: b(4),
  RUTE_P2: b(10), STEMPEL: b(13),
  SO: [b(13.5), b(14.5)],             // dua kartu Sales Order berangkat (mendarat 1,5 ketukan kemudian)
  DORONG_DC: b(22), POTONG: b(23.5), DINDING: b(24), AQUA: b(25), FOKUS_TEH: b(27.5), FOKUS_LEPAS: b(34),
  TRUK_V0: b(34.5), TRUK_V1: b(38.5), TEH0: b(37.5),                 // 24 ikon teh pada seperenambelas
  PR: b(38.5), PO: b(40.5), GRPO: b(42.5),
  TRUK_D0: b(47), TRUK_D1: b(52), IT: [b(49), b(50)],
  POTONG_KAPAL: b(54), LAMBUNG: b(55), DEK: b(56.5), CEK: [b(58), b(59), b(60)],
  INSET: b(66.5), JUAL: b(68), DO: b(71),
  MUNDUR0: b(76), MUNDUR1: b(80), LEGENDA: b(81), JUDUL: b(82), STASIUN: [b(80), b(80.5), b(81), b(81.5), b(82), b(82.5)],
};
TL.TERBANG = 1.5 * BEAT;                                  // lama kartu dokumen terbang ke menara
TL.TEH = [...Array(24)].map((_, i) => +(TL.TEH0 + i * BEAT / 4).toFixed(4));
TL.AQUA_IKON = [...Array(6)].map((_, i) => +(TL.AQUA + i * BEAT / 2).toFixed(4));
// urutan dokumen yang mendarat di menara SAP: [jenis, waktu berangkat, stasiun asal]
TL.DOKUMEN = [
  ['SO', TL.SO[0], 'p2'], ['SO', TL.SO[1], 'p2'], ['PR', TL.PR, 'dc'], ['PO', TL.PO, 'vendor'], ['GRPO', TL.GRPO, 'dc'],
  ['IT', TL.IT[0], 'dc'], ['IT', TL.IT[1], 'dc'], ['DO', TL.DO, 'kapal'],
];

// subtitle: tahan = max(1,8 s, ucapan + 0,6 s); t0 = suara mulai
const DURS = { L1: 3.272, L2: 5.726, L3: 5.977, L4: 5.38, L5: 2.702, L6: 5.869, L7: 4.532, L8: 6.823 };
const SUB = (id, t0, text) => ({ id, t0, t1: +(t0 + Math.max(1.8, DURS[id] + .6)).toFixed(3), text });
export const SUBS = [
  SUB('L1', b(3), 'Dari dek kapal, admin memesan barang ke DC.'),
  SUB('L2', b(11), 'Approve SO menyetujui. Sales Order per dek langsung masuk SAP.'),
  SUB('L3', b(23.5), 'Di DC, AQUA diambil dari stok. Teh Pucuk kosong, jadi dibeli.'),
  SUB('L4', b(36), 'Purchase Request, Purchase Order, lalu GRPO saat barang vendor tiba.'),
  SUB('L5', b(47.5), 'Inventory Transfer mengirim barang ke setiap dek.'),
  SUB('L6', b(54.5), 'Kapal menerima. Kepala toko dan P2 menyetujui, stok dek bertambah.'),
  SUB('L7', b(67), 'Kasir menjual, dan Delivery Order masuk SAP setiap hari.'),
  SUB('L8', b(80.5), 'Satu permintaan, delapan dokumen SAP. Satu alur di PID POS.'),
];
