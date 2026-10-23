// Deck singkat 3 halaman: apa itu PID POS, alur besar 9 tahap, jejak dokumen SAP + aturan.
// Pakai: npm install && node build_singkat.js  ->  ../docs/PID_POS_Singkat_3_Halaman.pptx
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'motion/public/img', `${g}.png`);
const LOGO = path.join(ROOT, 'motion/public/brand/pelni_services.png');
const OUT = path.join(ROOT, 'docs/PID_POS_Singkat_3_Halaman.pptx');
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'tahap.json'), 'utf8'));

const DIMS = {};
for (const m of fs.readFileSync(path.join(ROOT, 'motion/src/data/dims.ts'), 'utf8').matchAll(/(g\d+): \[(\d+), (\d+)\]/g)) {
  DIMS[m[1]] = [Number(m[2]), Number(m[3])];
}

const THEME = {
  name: 'PID POS',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1B2437', lt1: 'FFFFFF', dk2: '1F3B7A', lt2: 'EEF3FB',
    accent1: 'FF6B1A', accent2: '3A7D3A', accent3: '3D8BFF', accent4: 'C0392B', accent5: '5B6B86', accent6: 'D5DEEC',
    hlink: '1F3B7A', folHlink: '5B6B86',
  },
};
const K = THEME.colors;

const ROLE = {
  kapal: {name: 'Admin kapal', c: '0F766E'},
  so: {name: 'Approve SO (P2)', c: '6D28D9'},
  dc: {name: 'Admin DC', c: 'EA580C'},
  pur: {name: 'Approve PUR', c: 'BE185D'},
  purchase: {name: 'Admin purchase', c: '2563EB'},
  po: {name: 'Approve PO', c: 'B7791F'},
  kasir: {name: 'Kasir', c: '15803D'},
};
const TAHAP = [
  {id: 'pesan', label: 'Pesan barang', roles: ['kapal']},
  {id: 'so', label: 'Approval SO', roles: ['so']},
  {id: 'pilah', label: 'Pilah stok DC', roles: ['dc']},
  {id: 'pur', label: 'PUR', roles: ['pur']},
  {id: 'po', label: 'PO', roles: ['purchase', 'po']},
  {id: 'grpo', label: 'GRPO', roles: ['dc', 'pur']},
  {id: 'transfer', label: 'Transfer ke dek', roles: ['dc', 'pur']},
  {id: 'terima', label: 'Terima di dek', roles: ['kapal', 'so']},
  {id: 'jual', label: 'Jual & DO', roles: ['kasir']},
];

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'PID POS: versi singkat';
pres.subject = 'Pengenalan dan alur besar PID POS';
pres.author = 'PID POS';
pres.company = 'PT Pelita Indonesia Djaya';
pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
const C = pres.SchemeColor;

pres.defineSlideMaster({
  title: 'ISI',
  background: {color: K.lt1},
  objects: [
    {placeholder: {options: {name: 'title', type: 'title', x: 0.5, y: 0.35, w: 10.4, h: 0.75, fontSize: 34, bold: true, color: C.text2, align: 'left', valign: 'middle', margin: 0}, text: ''}},
    {image: {path: LOGO, x: 11.45, y: 0.4, w: 1.38, h: 0.63}},
    {text: {text: 'PID POS · Versi singkat · Contoh data uji SAP DB_TEST', options: {x: 0.5, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent5, margin: 0}}},
  ],
  slideNumber: {x: 12.4, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: K.accent5, align: 'right'},
});

const fitImage = (slide, g, box, name) => {
  const [iw, ih] = DIMS[g];
  let w = box.w;
  let h = (ih / iw) * w;
  if (h > box.h) {
    h = box.h;
    w = (iw / ih) * h;
  }
  const x = box.x + (box.w - w) / 2;
  const y = box.y + (box.h - h) / 2;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, rectRadius: 0.08,
    fill: {color: K.lt1}, line: {color: K.accent6, width: 1},
    shadow: {type: 'outer', color: '1F3B7A', opacity: 0.18, blur: 8, offset: 3, angle: 90},
    objectName: `${name} bingkai`,
  });
  slide.addImage({path: IMG(g), x, y, w, h, altText: `Gambar layar PID POS (${name})`, objectName: name});
  return {x, y, w, h};
};

// ---------- 1. Apa itu PID POS ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Apa itu PID POS?', {placeholder: 'title'});
  s.addText(
    [
      {text: 'PID POS', options: {bold: true, color: K.dk2}},
      {
        text: ' adalah aplikasi toko kapal PELNI Services. Permintaan barang, persetujuan, gudang DC, sampai penjualan di kasir tercatat di satu aplikasi dan terhubung langsung ke SAP Business One.',
        options: {color: K.dk1},
      },
    ],
    {x: 0.5, y: 1.3, w: 6.2, h: 1.35, fontSize: 18, valign: 'top', margin: 0, isTextBox: true, objectName: 'Definisi'},
  );
  const poin = [
    ['1', 'Satu alur, 7 peran', 'Dari admin kapal sampai kasir. Tiap peran hanya melihat tugasnya; lonceng menunjukkan yang menunggu.', '0F766E'],
    ['2', 'Langsung ke SAP', 'Sales Order, PUR, PO, GRPO, Inventory Transfer, dan DO dibuat otomatis setelah disetujui.', '3A7D3A'],
    ['3', 'Bisa dipantau', 'Status setiap permintaan terlihat per tahap, lengkap dengan riwayat persetujuannya.', '2563EB'],
    ['4', 'Kasir di web dan HP', 'Scan barang, bayar tunai atau QRIS, cetak struk, dan Kirim DO hari ini dari dek.', 'FF6B1A'],
  ];
  poin.forEach(([n, h, d, col], i) => {
    const y = 2.85 + i * 1.0;
    s.addShape(pres.shapes.OVAL, {x: 0.5, y, w: 0.62, h: 0.62, fill: {color: col}, line: {color: col}, objectName: `Ikon ${h}`});
    s.addText(n, {x: 0.5, y, w: 0.62, h: 0.62, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    s.addText(
      [
        {text: h, options: {bold: true, fontSize: 16, color: K.dk1, breakLine: true}},
        {text: d, options: {fontSize: 14, color: K.accent5}},
      ],
      {x: 1.3, y: y - 0.08, w: 5.4, h: 0.85, valign: 'top', margin: 0, isTextBox: true, objectName: h},
    );
  });
  // kolase: beranda admin kapal di belakang, layar kasir menumpuk di sudut kanan bawah
  fitImage(s, 'g01', {x: 7.0, y: 1.3, w: 5.4, h: 3.4}, 'Beranda admin kapal');
  fitImage(s, 'g45', {x: 8.75, y: 3.85, w: 4.08, h: 2.75}, 'Layar kasir');
  s.addText('Beranda admin kapal', {x: 7.0, y: 4.68, w: 1.65, h: 0.5, fontSize: 11, color: C.accent5, margin: 0, isTextBox: true});
  s.addText('Layar kasir', {x: 8.75, y: 6.55, w: 4.08, h: 0.3, fontSize: 11, color: C.accent5, align: 'right', margin: 0, isTextBox: true});
  s.addNotes(
    'PID POS adalah aplikasi untuk toko di kapal PELNI Services. Semua proses barang, dari kapal memesan ke DC, persetujuan, gudang, pembelian, sampai barang terjual di kasir, berjalan di satu aplikasi. Setiap dokumen langsung dibuat di SAP Business One setelah disetujui, jadi tidak ada input ulang. Ada tujuh peran, dan masing-masing hanya melihat tugasnya. Gambar atas: beranda admin kapal. Gambar bawah: layar kasir.',
  );
}

// ---------- 2. Alur besar ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Alur besar: 9 tahap dari pesan sampai DO', {placeholder: 'title'});
  s.addText('Jalur atas selalu dijalani. Jalur bawah hanya bila stok DC kurang. Label hijau = dokumen SAP yang terbentuk.', {
    x: 0.5, y: 1.2, w: 12.3, h: 0.4, fontSize: 15, color: C.accent5, margin: 0, isTextBox: true,
  });
  const pos = {
    pesan: [0.5, 2.0], so: [2.55, 2.0], pilah: [4.6, 2.0], transfer: [7.35, 2.0], terima: [9.4, 2.0], jual: [11.45, 2.0],
    pur: [4.6, 4.35], po: [6.45, 4.35], grpo: [8.3, 4.35],
  };
  const sap = {so: 'Sales Order', pur: 'Purchase Request', po: 'Purchase Order', grpo: 'GRPO', transfer: 'Inventory Transfer', terima: 'SO ditutup', jual: 'Delivery (DO)'};
  const BW = 1.7;
  const BH = 1.3;
  const line = (x1, y1, x2, y2, nm) =>
    s.addShape(pres.shapes.LINE, {x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
      flipV: y2 < y1, line: {color: K.dk2, width: 2, endArrowType: 'triangle'}, objectName: `Panah ${nm}`});
  line(0.5 + BW, 2.65, 2.55, 2.65, 1);
  line(2.55 + BW, 2.65, 4.6, 2.65, 2);
  line(4.6 + BW, 2.65, 7.35, 2.65, 3);
  line(7.35 + BW, 2.65, 9.4, 2.65, 4);
  line(9.4 + BW, 2.65, 11.45, 2.65, 5);
  line(5.45, 2.0 + BH, 5.45, 4.35, 6);
  line(4.6 + BW, 5.0, 6.45, 5.0, 7);
  line(6.45 + BW, 5.0, 8.3, 5.0, 8);
  line(9.15, 4.35, 8.2, 2.0 + BH, 9);
  s.addText('stok DC ada', {x: 6.3, y: 2.3, w: 1.05, h: 0.3, fontSize: 11, color: C.accent5, align: 'center', margin: 0, isTextBox: true});
  s.addText('stok DC kurang', {x: 3.25, y: 3.6, w: 2.1, h: 0.3, fontSize: 11, color: C.accent5, align: 'right', margin: 0, isTextBox: true});
  TAHAP.forEach((t, k) => {
    const [x, y] = pos[t.id];
    const col = ROLE[t.roles[0]].c;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w: BW, h: BH, rectRadius: 0.1, fill: {color: 'FFFFFF'}, line: {color: col, width: 2.25},
      shadow: {type: 'outer', color: '1F3B7A', opacity: 0.15, blur: 6, offset: 2, angle: 90}, objectName: `Tahap ${t.label}`});
    s.addText(
      [
        {text: `Tahap ${k + 1}`, options: {fontSize: 11, color: col, bold: true, breakLine: true}},
        {text: t.label, options: {fontSize: 15, color: K.dk1, bold: true, breakLine: true}},
        {text: t.roles.map((r) => ROLE[r].name.replace(' (P2)', '')).join(' · '), options: {fontSize: 10.5, color: K.accent5}},
      ],
      {x: x + 0.12, y: y + 0.08, w: BW - 0.24, h: BH - 0.16, valign: 'top', margin: 0, isTextBox: true},
    );
    if (sap[t.id]) {
      s.addText(`SAP · ${sap[t.id]}`, {x: x - 0.05, y: y + BH + 0.1, w: BW + 0.1, h: 0.32, fontSize: 10.5, bold: true, color: K.accent2,
        shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1, fill: {color: 'E5F4E4'}, line: {color: 'E5F4E4'}, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    }
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: 0.5, y: 6.3, w: 12.33, h: 0.55, rectRadius: 0.1, fill: {color: K.lt2}, line: {color: K.lt2}, objectName: 'Contoh'});
  s.addText(
    [
      {text: 'Contoh: ', options: {bold: true, color: K.accent1}},
      {text: 'PERMINTAAN-AWU/2610/0008 · KM Awu · AQUA 6 pcs ke Dek 3 dari stok DC · Teh Pucuk 24 pcs ke Dek 7 dibeli lewat PUR dan PO', options: {color: K.dk1}},
    ],
    {x: 0.75, y: 6.3, w: 11.9, h: 0.55, fontSize: 14, valign: 'middle', margin: 0, isTextBox: true},
  );
  s.addNotes(DATA.notes.peta + ' ' + DATA.notes.variasi);
}

// ---------- 3. Jejak dokumen SAP + aturan ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Hasilnya: jejak dokumen SAP yang lengkap', {placeholder: 'title'});
  const head = ['Tahap', 'Dokumen SAP', 'Nomor (uji coba)'];
  const rows = [
    head.map((h) => ({text: h, options: {bold: true, color: 'FFFFFF', fill: {color: K.dk2}}})),
    ...DATA.dokumen.map((r, i) => [r[0], r[2], r[3]].map((c) => ({text: c, options: {fill: {color: i % 2 ? 'FFFFFF' : K.lt2}}}))),
  ];
  s.addTable(rows, {x: 0.5, y: 1.35, w: 7.9, colW: [2.2, 3.15, 2.55], fontSize: 13, color: K.dk1, rowH: 0.52,
    border: {type: 'solid', color: 'FFFFFF', pt: 1}, valign: 'middle', margin: [0.04, 0.1, 0.04, 0.1], objectName: 'Tabel dokumen SAP'});
  const aturan = [
    ['SAP dibuat setelah disetujui', 'Selama status masih "Approval", belum ada dokumen di SAP.'],
    ['Tolak selalu dengan alasan', 'Dokumen kembali ke pembuatnya untuk diperbaiki dan diajukan ulang.'],
    ['Pesan minimal H-5', 'Permintaan barang paling lambat 5 hari sebelum dibutuhkan.'],
  ];
  aturan.forEach(([h, d], i) => {
    const y = 1.35 + i * 1.62;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: 8.75, y, w: 4.08, h: 1.42, rectRadius: 0.12, fill: {color: K.dk2}, line: {color: K.dk2}, objectName: h});
    s.addText(String(i + 1), {x: 8.95, y: y + 0.18, w: 0.55, h: 0.6, fontSize: 30, bold: true, color: K.accent1, margin: 0, isTextBox: true});
    s.addText([{text: h, options: {bold: true, fontSize: 16, color: 'FFFFFF', breakLine: true}}, {text: d, options: {fontSize: 13, color: 'CADCFC'}}],
      {x: 9.55, y: y + 0.15, w: 3.1, h: 1.15, valign: 'top', margin: 0, paraSpaceAfter: 3, isTextBox: true});
  });
  s.addText(
    [
      {text: 'Materi lanjutan: ', options: {bold: true, color: K.accent1}},
      {text: 'video Alur Lengkap (4 menit) · video per peran 01–07 · Manual Book PID POS per Peran · deck Alur Lengkap 15 slide', options: {color: K.dk1}},
    ],
    {x: 0.5, y: 6.3, w: 12.33, h: 0.45, fontSize: 14, valign: 'middle', margin: 0, isTextBox: true},
  );
  s.addNotes(DATA.notes.dokumen + ' Tiga aturan yang perlu diingat: dokumen SAP baru dibuat setelah disetujui, menolak wajib dengan alasan, dan permintaan barang minimal lima hari sebelum dibutuhkan. ' + DATA.notes.penutup);
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), {recursive: true});
  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
