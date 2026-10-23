import {fitFrames} from './vo';
import {INTRO_UCAPAN} from './naskah';

// Naskah video perkenalan: setiap adegan berisi satu atau beberapa kalimat.
// `caption: false` = kalimat hanya diucapkan, tidak ditulis di layar (layar sudah memuat teksnya).
type Line = {key: string; text: string; min: number; caption?: boolean};
type SceneDef = {id: string; lead: number; tail: number; lines: Line[]};

const DEFS: SceneDef[] = [
  {
    id: 'kapal',
    lead: 10,
    tail: 20,
    lines: [{key: 'intro/01-kapal', text: 'Setiap pelayaran, toko di setiap dek harus siap melayani penumpang.', min: 150}],
  },
  {
    id: 'masalah',
    lead: 10,
    tail: 40,
    lines: [{key: 'intro/02-masalah', text: 'Permintaan, persetujuan, dan stok sering tercatat di banyak tempat.', min: 190}],
  },
  {
    id: 'pidpos',
    lead: 20,
    tail: 20,
    lines: [
      {
        key: 'intro/03-pidpos',
        text: 'Kini ada PID POS: satu aplikasi, satu alur, langsung terhubung ke SAP.',
        min: 140,
        caption: false,
      },
    ],
  },
  {
    id: 'alur',
    lead: 30,
    tail: 60,
    lines: [
      {key: 'intro/04-alur-1', text: 'Admin kapal memesan barang ke DC.', min: 70},
      {key: 'intro/04-alur-2', text: 'Penyetuju menyetujui: Sales Order dibuat di SAP, satu per dek.', min: 70},
      {key: 'intro/04-alur-3', text: 'Admin DC memilah: ambil dari stok DC.', min: 70},
      {key: 'intro/04-alur-4', text: 'Yang kurang dibeli lewat Purchase Request dan Purchase Order.', min: 120},
      {key: 'intro/04-alur-5', text: 'Barang vendor diterima di DC dengan GRPO.', min: 70},
      {key: 'intro/04-alur-6', text: 'Barang dikirim ke dek dengan Inventory Transfer.', min: 70},
      {key: 'intro/04-alur-7', text: 'Dek menerima barang, kepala toko dan P2 menyetujui.', min: 70},
      {key: 'intro/04-alur-8', text: 'Barang siap dijual di kasir.', min: 70},
    ],
  },
  {
    id: 'peran',
    lead: 0,
    tail: 20,
    lines: [
      {key: 'intro/05-peran-1', text: 'Setiap peran hanya melihat tugasnya sendiri.', min: 130},
      {key: 'intro/05-peran-2', text: 'Lonceng dan Giliran saya menunjukkan apa yang menunggu Anda.', min: 150},
    ],
  },
  {
    id: 'kasir',
    lead: 0,
    tail: 0,
    lines: [
      {key: 'intro/06-kasir-1', text: 'Kasir scan barang: AQUA 2 pcs, total Rp 38.000.', min: 120},
      {key: 'intro/06-kasir-2', text: 'Bayar tunai atau QRIS. Kembalian dihitung otomatis.', min: 120},
      {key: 'intro/06-kasir-3', text: 'Struk tercetak. Penjualan dikirim ke SAP sebagai DO.', min: 120},
    ],
  },
  {
    id: 'penutup',
    lead: 10,
    tail: 40,
    lines: [
      {
        key: 'intro/07-penutup',
        text: 'PID POS. Dari permintaan kapal sampai struk kasir, semua tercatat. Tonton video sesuai peran Anda.',
        min: 230,
        caption: false,
      },
    ],
  },
];

export type TimedLine = Line & {from: number; dur: number};
export type TimedScene = {id: string; dur: number; lines: TimedLine[]};

export const introScenes = (fps: number): TimedScene[] =>
  DEFS.map((d) => {
    let at = d.lead;
    const lines = d.lines.map((l) => {
      const dur = fitFrames(l.key, l.min, fps, 0.45);
      const t = {...l, from: at, dur};
      at += dur;
      return t;
    });
    return {id: d.id, dur: at + d.tail, lines};
  });

export const INTRO_LINES = DEFS.flatMap((d) => d.lines.map((l) => ({key: l.key, text: INTRO_UCAPAN[l.key] ?? l.text})));
