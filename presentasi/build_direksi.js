// Paparan direksi 3 halaman: nilai PID POS, alur besar, kesiapan dan usulan langkah berikutnya.
// Pakai: npm install && node build_direksi.js  ->  ../docs/PID_POS_Paparan_Direksi.pptx
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'motion/public/img', `${g}.png`);
const LOGO = path.join(ROOT, 'motion/public/brand/pelni_services.png');
const OUT = path.join(ROOT, 'docs/PID_POS_Paparan_Direksi.pptx');
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
pres.title = 'PID POS: paparan direksi';
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
    {text: {text: 'PID POS · Paparan direksi', options: {x: 0.5, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.accent5, margin: 0}}},
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

// ---------- 1. Apa itu PID POS dan nilainya ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('PID POS: satu aplikasi, langsung ke SAP', {placeholder: 'title'});
  s.addText(
    'Permintaan barang dari kapal, persetujuan, gudang DC, pembelian, sampai penjualan di kasir berjalan di satu aplikasi web. Setiap dokumen dibuat otomatis di SAP Business One setelah disetujui.',
    {x: 0.5, y: 1.25, w: 12.3, h: 0.75, fontSize: 17, color: K.dk1, valign: 'top', margin: 0, isTextBox: true, objectName: 'Definisi'},
  );
  // angka besar
  const angka = [
    ['9', 'tahap alur', 'dari pesan ke DC sampai Delivery Order'],
    ['7', 'peran', 'masing-masing hanya melihat tugasnya'],
    ['6', 'jenis dokumen SAP', 'SO, PUR, PO, GRPO, Transfer, DO'],
  ];
  angka.forEach(([n, l, d], i) => {
    const x = 0.5 + i * 2.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y: 2.2, w: 2.25, h: 2.0, rectRadius: 0.12, fill: {color: K.lt2}, line: {color: K.lt2}, objectName: `Angka ${l}`});
    s.addText(n, {x: x + 0.2, y: 2.3, w: 1.9, h: 0.95, fontSize: 60, bold: true, color: K.dk2, margin: 0, valign: 'middle', isTextBox: true});
    s.addText([{text: l, options: {bold: true, fontSize: 16, color: K.dk1, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}],
      {x: x + 0.2, y: 3.25, w: 1.9, h: 0.9, valign: 'top', margin: 0, isTextBox: true});
  });
  // nilai bagi perusahaan
  s.addText('Nilai bagi perusahaan', {x: 0.5, y: 4.45, w: 7.2, h: 0.4, fontSize: 18, bold: true, color: K.dk2, margin: 0, isTextBox: true});
  const nilai = [
    ['Kontrol', 'Barang masuk dan keluar tercatat dan disetujui berjenjang, dari SO sampai PO.', '0F766E'],
    ['Transparansi', 'Status setiap permintaan terpantau per tahap, lengkap dengan riwayat persetujuan.', '2563EB'],
    ['Data penjualan', 'Penjualan kasir di setiap dek masuk SAP setiap hari sebagai Delivery Order.', 'FF6B1A'],
  ];
  nilai.forEach(([h, d, col], i) => {
    const y = 5.0 + i * 0.62;
    s.addShape(pres.shapes.OVAL, {x: 0.5, y: y + 0.05, w: 0.36, h: 0.36, fill: {color: col}, line: {color: col}, objectName: `Ikon ${h}`});
    s.addText([{text: `${h}  `, options: {bold: true, color: K.dk1}}, {text: d, options: {color: K.accent5}}],
      {x: 1.05, y, w: 6.65, h: 0.5, fontSize: 14, valign: 'middle', margin: 0, isTextBox: true, objectName: h});
  });
  fitImage(s, 'g01', {x: 8.0, y: 2.2, w: 4.83, h: 4.5}, 'Beranda admin kapal');
  s.addNotes(
    'PID POS adalah aplikasi untuk toko di kapal PELNI Services. Seluruh alur barang, dari kapal memesan ke DC, persetujuan, gudang, pembelian, sampai barang terjual di kasir, berjalan di satu aplikasi, dan dokumennya dibuat otomatis di SAP Business One setelah disetujui. Nilainya bagi perusahaan ada tiga: kontrol atas barang yang keluar masuk, transparansi status setiap permintaan, dan data penjualan harian dari setiap dek yang masuk ke SAP. Gambar di kanan adalah beranda admin kapal.',
  );
}

// ---------- 2. Alur besar ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Setiap permintaan terlacak sampai penjualan', {placeholder: 'title'});
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
      {text: 'Contohnya: ', options: {bold: true, color: K.accent1}},
      {text: 'barang yang ada di gudang langsung dikirim ke dek; yang kurang dibeli dulu lewat PUR dan PO, lalu dikirim bersama.', options: {color: K.dk1}},
    ],
    {x: 0.75, y: 6.3, w: 11.9, h: 0.55, fontSize: 14, valign: 'middle', margin: 0, isTextBox: true},
  );
  s.addNotes('Satu permintaan dari kapal bisa dilacak sampai barangnya terjual. Jalur atas selalu dijalani: kapal memesan, Sales Order disetujui, DC memilah stok, barang dikirim ke dek, diterima, lalu dijual di kasir dan masuk SAP sebagai Delivery Order. Jalur bawah, PUR, PO, dan GRPO, hanya dijalani bila stok DC tidak cukup. Label hijau menunjukkan dokumen SAP yang dibuat otomatis setelah tiap tahap disetujui.');
}

// ---------- 3. Pengguna, kesiapan, dan usulan langkah berikutnya ----------
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Siap diterapkan di kapal, DC, dan kantor pusat', {placeholder: 'title'});
  // kiri: siapa memakai PID POS
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: 0.5, y: 1.3, w: 6.0, h: 3.55, rectRadius: 0.12, fill: {color: K.lt2}, line: {color: K.lt2}, objectName: 'Pengguna'});
  s.addText('Pengguna PID POS', {x: 0.75, y: 1.45, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: K.dk2, margin: 0, isTextBox: true});
  const lokasi = [
    ['Kapal', ['Kepala Toko / Admin Kapal', 'Kasir (per dek)'], '0F766E'],
    ['DC / Gudang', ['Admin DC'], 'EA580C'],
    ['Kantor pusat', ['Approve SO (P2)', 'Approve PUR', 'Admin Purchase', 'Approve PO'], '2563EB'],
  ];
  let ly = 2.0;
  lokasi.forEach(([tempat, peran, col]) => {
    s.addText(tempat, {x: 0.75, y: ly, w: 1.6, h: 0.42, fontSize: 13, bold: true, color: 'FFFFFF', shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08,
      fill: {color: col}, line: {color: col}, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    peran.forEach((r, k) => {
      const row = Math.floor(k / 2);
      s.addText(r, {x: 2.5 + (k % 2) * 1.95, y: ly + row * 0.5, w: 1.85, h: 0.42, fontSize: 12, color: K.dk1, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08,
        fill: {color: 'FFFFFF'}, line: {color: K.accent6, width: 1}, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    });
    ly += Math.ceil(peran.length / 2) * 0.5 + 0.22;
  });
  // kanan: kesiapan sosialisasi
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: 6.83, y: 1.3, w: 6.0, h: 3.55, rectRadius: 0.12, fill: {color: K.lt2}, line: {color: K.lt2}, objectName: 'Materi sosialisasi'});
  s.addText('Materi sosialisasi siap', {x: 7.08, y: 1.45, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: K.dk2, margin: 0, isTextBox: true});
  const materi = [['1', 'Manual book', 'per peran, 44 halaman'], ['9', 'video tutorial', 'alur lengkap + per peran'], ['4', 'video pendek', 'format media sosial']];
  materi.forEach(([n, l, d], i) => {
    const x = 7.08 + i * 1.88;
    s.addText(n, {x, y: 2.05, w: 1.7, h: 1.0, fontSize: 54, bold: true, color: K.dk2, margin: 0, isTextBox: true});
    s.addText([{text: l, options: {bold: true, fontSize: 15, color: K.dk1, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}],
      {x, y: 3.1, w: 1.75, h: 1.0, valign: 'top', margin: 0, isTextBox: true});
  });
  // usulan langkah berikutnya
  s.addText('Usulan langkah berikutnya', {x: 0.5, y: 5.1, w: 8, h: 0.4, fontSize: 18, bold: true, color: K.dk2, margin: 0, isTextBox: true});
  const langkah = [
    ['1', 'Siapkan akun dan level approval', 'untuk setiap peran dan kapal'],
    ['2', 'Pilot di satu kapal (KM Awu)', 'dengan SAP produksi'],
    ['3', 'Sosialisasi ke seluruh peran', 'memakai manual dan video'],
  ];
  langkah.forEach(([n, h, d], i) => {
    const x = 0.5 + i * 4.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y: 5.6, w: 3.95, h: 1.15, rectRadius: 0.12, fill: {color: K.dk2}, line: {color: K.dk2}, objectName: h});
    s.addText(n, {x: x + 0.2, y: 5.68, w: 0.5, h: 0.95, fontSize: 32, bold: true, color: K.accent1, margin: 0, valign: 'middle', isTextBox: true});
    s.addText([{text: h, options: {bold: true, fontSize: 15, color: 'FFFFFF', breakLine: true}}, {text: d, options: {fontSize: 12, color: 'CADCFC'}}],
      {x: x + 0.75, y: 5.68, w: 3.05, h: 0.95, valign: 'middle', margin: 0, isTextBox: true});
  });
  s.addNotes(
    'PID POS dipakai di tiga tempat: di kapal oleh kepala toko dan kasir, di DC oleh admin gudang, dan di kantor pusat oleh para penyetuju dan admin purchase. Materi sosialisasi sudah siap: manual book per peran, sembilan video tutorial, dan empat video pendek. Usulan langkah berikutnya: menyiapkan akun dan level approval untuk setiap peran, menjalankan pilot di satu kapal dengan SAP produksi, lalu sosialisasi ke seluruh peran.',
  );
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), {recursive: true});
  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
