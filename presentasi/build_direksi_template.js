// Paparan direksi PID POS di atas template perusahaan (template/PPT_TEMPLATE.pptx): 8 halaman, khusus tentang aplikasi.
// Latar sampul/penutup dan latar isi diambil dari template (logo Danantara dan PELNI Services sudah ada di latar).
// Area aman halaman isi: logo di atas sampai ±0,95", chevron di kiri bawah (x < 1,6" untuk y > 5,5"), garis navy di dasar.
// Pakai: npm install && node build_direksi_template.js  ->  ../docs/PID_POS_Paparan_Direksi_Template.pptx
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const FA = require('react-icons/fa');
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'motion/public/img', `${g}.png`);
const LATAR_SAMPUL = path.join(__dirname, 'template/latar_sampul.png');
const LATAR_ISI = path.join(__dirname, 'template/latar_isi.png');
const OUT = path.join(ROOT, 'docs/PID_POS_Paparan_Direksi_Template.pptx');
const DIMS = {g01: [2049, 1180], g02: [2049, 974], g11: [2049, 590], g19: [1419, 1260], g45: [2049, 1200], g46: [2049, 995]};

// warna template: navy PELNI 274289, biru muda chevron; oranye hanya untuk satu sorotan
const THEME = {
  name: 'PELNI Services',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1B2437', lt1: 'FFFFFF', dk2: '274289', lt2: 'EEF3FA',
    accent1: '5AB4E5', accent2: '274289', accent3: '3D6FC2', accent4: 'F2762E', accent5: '5B6B86', accent6: 'D5DEEC',
    hlink: '274289', folHlink: '5B6B86',
  },
};
const K = THEME.colors;
const DOK = {SO: '4A8A3C', PR: 'A87412', PO: 'C85A1C', GRPO: '7C68B8', IT: 'C45C8E', DO: 'CF5140'};

const ikon = async (Icon, color) => {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, {color: '#' + color, size: 256}));
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
};

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'PID POS · Paparan Direksi';
  pres.author = 'PT Pelita Indonesia Djaya (PELNI Services)';
  pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: 'SAMPUL',
    background: {path: LATAR_SAMPUL},
    objects: [
      {placeholder: {options: {name: 'title', type: 'title', x: 0.67, y: 2.35, w: 7.6, h: 0.95, fontSize: 44, bold: true, color: C.background1, align: 'left', valign: 'bottom', margin: 0}, text: ''}},
      {line: {x: 0.67, y: 3.42, w: 7.4, h: 0, line: {color: 'FFFFFF', width: 1.25}}},
    ],
  });
  pres.defineSlideMaster({
    title: 'ISI',
    background: {path: LATAR_ISI},
    objects: [
      {placeholder: {options: {name: 'title', type: 'title', x: 0.75, y: 1.0, w: 11.85, h: 0.7, fontSize: 30, bold: true, color: C.text2, align: 'left', valign: 'middle', margin: 0}, text: ''}},
    ],
    slideNumber: {x: 12.15, y: 6.9, w: 0.5, h: 0.3, fontSize: 10, color: K.accent5, align: 'right'},
  });

  const kartu = (s, x, y, w, h, name, fill = K.lt1) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.12, fill: {color: fill}, line: {color: fill === K.lt1 ? 'E3E9F3' : fill, width: 0.75},
    shadow: {type: 'outer', color: '274289', opacity: 0.12, blur: 8, offset: 2, angle: 90}, objectName: name,
  });
  const lingkaranIkon = async (s, x, y, d, Icon, bg, fg, name) => {
    s.addShape(pres.shapes.OVAL, {x, y, w: d, h: d, fill: {color: bg}, line: {color: bg}, objectName: name + ' latar'});
    s.addImage({data: await ikon(Icon, fg), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, altText: name, objectName: name});
  };
  const gambar = (s, g, box, name) => {
    const [iw, ih] = DIMS[g];
    let w = box.w, h = (ih / iw) * w;
    if (h > box.h) { h = box.h; w = (iw / ih) * h; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    kartu(s, x - 0.07, y - 0.07, w + 0.14, h + 0.14, name + ' bingkai', 'E4EAF4');
    s.addImage({path: IMG(g), x, y, w, h, altText: `Layar PID POS: ${name}`, objectName: name});
  };
  const teks = (s, runs, o) => s.addText(runs, {margin: 0, valign: 'top', isTextBox: true, ...o});

  // ---------- 1. sampul ----------
  pres.addSection({title: 'Pembuka'});
  let s = pres.addSlide({masterName: 'SAMPUL', sectionTitle: 'Pembuka'});
  s.addText('PID POS', {placeholder: 'title'});
  teks(s, 'Aplikasi Toko Kapal Terintegrasi SAP Business One', {x: 0.67, y: 3.55, w: 7.4, h: 0.5, fontSize: 22, bold: true, color: 'FFFFFF'});
  teks(s, 'PT Pelita Indonesia Djaya (PELNI Services)', {x: 0.67, y: 4.1, w: 7.4, h: 0.4, fontSize: 16, color: 'D6E4F5'});
  s.addNotes('PID POS adalah aplikasi toko kapal PELNI Services yang terhubung langsung dengan SAP Business One. Paparan ini menyampaikan apa itu PID POS, alurnya, peran yang terlibat, fitur utama, kasir, keunggulan, dan batasannya saat ini.');

  // ---------- 2. satu aplikasi ----------
  pres.addSection({title: 'Aplikasi'});
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Satu aplikasi untuk seluruh alur toko kapal', {placeholder: 'title'});
  const baris = [[FA.FaGlobe, 'Aplikasi web', 'Untuk admin kapal, Distribution Center (DC), dan kantor pusat: pesan barang, persetujuan, stok, dan laporan.'], [FA.FaMobileAlt, 'Aplikasi kasir Android', 'Untuk kasir di setiap dek: scan, bayar tunai atau QRIS, struk, dan rekap shift.'], [FA.FaDatabase, 'Terhubung SAP Business One', 'Dokumen dibuat otomatis setelah disetujui, tanpa input ulang.']];
  for (let i = 0; i < 3; i++) {
    const [Ic, j, d] = baris[i], y = 2.0 + i * 1.2;
    await lingkaranIkon(s, 0.75, y, 0.85, Ic, i === 2 ? K.accent1 : K.dk2, 'FFFFFF', j);
    teks(s, [{text: j, options: {bold: true, fontSize: 19, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 14, color: K.dk1}}], {x: 1.85, y: y - 0.05, w: 4.9, h: 1.1});
  }
  gambar(s, 'g01', {x: 7.0, y: 1.95, w: 5.6, h: 4.3}, 'Beranda admin kapal');
  s.addNotes('PID POS terdiri dari aplikasi web untuk admin kapal, Distribution Center atau DC, dan kantor pusat, serta aplikasi kasir Android untuk setiap dek. Keduanya terhubung langsung dengan SAP Business One, sehingga dokumen dibuat otomatis setelah disetujui.');

  // ---------- 3. alur ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Alur end-to-end: setiap langkah tercatat di SAP', {placeholder: 'title'});
  const atas = [['Pesan ke DC', 'Admin kapal', null], ['Persetujuan permintaan', 'P2', 'SO'], ['Pilah stok', 'Admin DC', null], ['Transfer ke dek', 'Admin DC', 'IT'], ['Terima di dek', 'Kepala toko', null], ['Jual di kasir', 'Kasir', 'DO']];
  const nw = 1.78, gap = 0.235, y1 = 2.2, chip = (x, y, d) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w: 0.84, h: 0.34, rectRadius: 0.08, fill: {color: DOK[d]}, line: {color: DOK[d]}, objectName: `Dokumen ${d}`});
    s.addText(d, {x, y, w: 0.84, h: 0.34, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
  };
  atas.forEach(([j, p, d], i) => {
    const x = 0.75 + i * (nw + gap);
    kartu(s, x, y1, nw, 1.05, `Tahap ${j}`);
    s.addText([{text: j, options: {bold: true, fontSize: 15, color: K.dk2, breakLine: true}}, {text: p, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.1, y: y1 + 0.08, w: nw - 0.2, h: 0.9, margin: 0, align: 'center', valign: 'middle', isTextBox: true});
    if (i < atas.length - 1) s.addShape(pres.shapes.LINE, {x: x + nw + 0.03, y: y1 + 0.525, w: gap - 0.06, h: 0, line: {color: K.accent3, width: 2, endArrowType: 'triangle'}, objectName: 'Panah alur'});
    if (d) chip(x + nw / 2 - 0.42, y1 + 1.13, d);
  });
  // siklus: setelah terjual, stok dek menipis dan kapal memesan lagi ke DC
  const xa = 0.75 + nw / 2, xz = 0.75 + 5 * (nw + gap) + nw / 2, yl = 1.9, garisUlang = {color: K.accent1, width: 2.25};
  s.addShape(pres.shapes.LINE, {x: xa, y: yl, w: xz - xa, h: 0, line: garisUlang, objectName: 'Siklus ulang'});
  s.addShape(pres.shapes.LINE, {x: xz, y: yl, w: 0, h: y1 - yl, line: garisUlang, objectName: 'Siklus ulang dari kasir'});
  s.addShape(pres.shapes.LINE, {x: xa, y: yl, w: 0, h: y1 - yl - 0.02, line: {...garisUlang, endArrowType: 'triangle'}, objectName: 'Siklus ulang ke pesan'});
  s.addText('↻  Stok dek menipis: kapal memesan lagi ke DC', {x: 4.4, y: yl - 0.17, w: 4.6, h: 0.34, fontSize: 12, bold: true, color: K.accent1, align: 'center', valign: 'middle', margin: 0, fill: {color: 'FFFFFF'}, isTextBox: true});
  const xb0 = 0.75 + 2 * (nw + gap), y2 = 3.9;
  teks(s, 'Bila stok DC kurang:', {x: 0.75, y: y2 + 0.32, w: 3.85, h: 0.4, fontSize: 14, italic: true, color: K.accent5, align: 'right'});
  s.addShape(pres.shapes.LINE, {x: xb0 + nw / 2, y: y1 + 1.05, w: 0, h: y2 - y1 - 1.05, line: {color: K.accent3, width: 2, dashType: 'dash', endArrowType: 'triangle'}, objectName: 'Cabang pembelian'});
  [['Permintaan pembelian', 'Pergudangan', 'PR'], ['Pesanan ke vendor', 'Purchasing', 'PO'], ['Barang vendor tiba', 'Admin DC', 'GRPO']].forEach(([j, p, d], i) => {
    const x = xb0 + i * (nw + gap);
    kartu(s, x, y2, nw, 1.05, `Cabang ${j}`, K.lt2);
    s.addText([{text: j, options: {bold: true, fontSize: 14, color: K.dk2, breakLine: true}}, {text: p, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.1, y: y2 + 0.08, w: nw - 0.2, h: 0.9, margin: 0, align: 'center', valign: 'middle', isTextBox: true});
    chip(x + nw / 2 - 0.42, y2 + 1.13, d);
    if (i < 2) s.addShape(pres.shapes.LINE, {x: x + nw + 0.03, y: y2 + 0.525, w: gap - 0.06, h: 0, line: {color: K.accent3, width: 2, endArrowType: 'triangle'}, objectName: 'Panah cabang'});
  });
  const x3 = 0.75 + 3 * (nw + gap) + nw / 2, x4 = 0.75 + 4 * (nw + gap) + nw / 2;
  s.addShape(pres.shapes.LINE, {x: x3, y: y1 + 1.52, w: x4 - x3, h: y2 - y1 - 1.52, line: {color: K.accent3, width: 2, dashType: 'dash', beginArrowType: 'triangle'}, objectName: 'Kembali ke transfer'});
  // keterangan singkatan: 6 dokumen SAP yang dibuat otomatis
  kartu(s, 1.75, 5.48, 10.85, 1.2, 'Keterangan dokumen SAP', K.lt2);
  teks(s, 'Dokumen SAP yang dibuat otomatis:', {x: 2.0, y: 5.53, w: 6, h: 0.3, fontSize: 13, bold: true, color: K.dk2});
  [['SO', 'Sales Order', 'pesanan per dek'], ['PR', 'Purchase Request', 'permintaan pembelian'], ['PO', 'Purchase Order', 'pesanan ke vendor'],
   ['GRPO', 'Goods Receipt PO', 'penerimaan barang vendor'], ['IT', 'Inventory Transfer', 'kiriman DC ke dek'], ['DO', 'Delivery Order', 'penjualan harian kasir']].forEach(([d, n, a], i) => {
    const x = 2.0 + (i % 3) * 3.55, y = 5.88 + Math.floor(i / 3) * 0.38;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w: 0.72, h: 0.3, rectRadius: 0.06, fill: {color: DOK[d]}, line: {color: DOK[d]}, objectName: `Keterangan ${d}`});
    s.addText(d, {x, y, w: 0.72, h: 0.3, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    teks(s, [{text: n, options: {bold: true, color: K.dk2}}, {text: ' · ' + a, options: {color: K.accent5}}], {x: x + 0.82, y: y - 0.02, w: 2.65, h: 0.34, fontSize: 12, valign: 'middle'});
  });
  s.addNotes('Jalur atas selalu dijalani: kapal memesan ke DC, kantor pusat menyetujui sehingga Sales Order terbentuk di SAP, DC memilah stok, barang dikirim ke dek dengan Inventory Transfer, diterima kepala toko, lalu dijual di kasir dan masuk SAP sebagai Delivery Order. Bila stok DC kurang, jalur pembelian berjalan: Purchase Request, Purchase Order ke vendor, dan Goods Receipt PO (GRPO) saat barang tiba di DC. Alur ini berulang: setelah barang terjual dan stok dek menipis, kapal memesan lagi ke DC.');

  // ---------- 4. tujuh peran ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Tujuh peran, masing-masing melihat tugasnya sendiri', {placeholder: 'title'});
  const zona = [
    [FA.FaShip, 'Kapal', [['Admin Kapal / Kepala Toko', 'Pesan ke DC, terima barang di dek'], ['Kasir', 'Jual, kirim penjualan harian ke SAP']]],
    [FA.FaBuilding, 'Kantor pusat', [['Approve SO (P2)', 'Setujui permintaan kapal jadi Sales Order'], ['Approve PUR (Pergudangan)', 'Setujui Purchase Request, penerimaan, transfer'], ['Approve PO (Purchasing)', 'Setujui Purchase Order ke vendor'], ['Admin PO (Purchasing)', 'Buat Purchase Order ke vendor']]],
    [FA.FaWarehouse, 'DC', [['Admin DC', 'Pilah stok, ajukan penerimaan dan transfer']]],
  ];
  const zw = [3.7, 4.45, 3.1];
  let zx = 0.75;
  for (let z = 0; z < 3; z++) {
    const [Ic, nama, rows] = zona[z];
    kartu(s, zx, 1.9, zw[z], 1.15 + rows.length * 0.88, `Zona ${nama}`, K.lt2);
    await lingkaranIkon(s, zx + 0.25, 2.05, 0.55, Ic, K.dk2, 'FFFFFF', `Ikon ${nama}`);
    teks(s, nama, {x: zx + 0.95, y: 2.05, w: zw[z] - 1.2, h: 0.55, fontSize: 19, bold: true, color: K.dk2, valign: 'middle'});
    rows.forEach(([r, d], i) => {
      const y = 2.8 + i * 0.88;
      kartu(s, zx + 0.22, y, zw[z] - 0.44, 0.76, `Peran ${r}`);
      s.addText([{text: r, options: {bold: true, fontSize: 15, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}], {x: zx + 0.4, y, w: zw[z] - 0.8, h: 0.76, margin: 0, valign: 'middle', isTextBox: true});
    });
    zx += zw[z] + 0.3;
  }
  s.addNotes('Ada tujuh peran. Di kapal: admin kapal atau kepala toko, dan kasir. Di kantor pusat: Approve SO oleh P2, Approve PUR oleh Pergudangan, serta Approve PO dan Admin PO oleh Purchasing. Di DC: admin DC. Setiap peran hanya melihat tugas yang menunggunya, lewat lonceng dan tab Giliran saya.');

  // ---------- 5. fitur web ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Fitur utama aplikasi web', {placeholder: 'title'});
  const F = [['g02', 'Pesan ke DC', 'Pilih barang dan dek tujuan, lalu kirim permintaan ke DC.'], ['g19', 'Persetujuan berjenjang', 'Status tiap tahap terlihat; setelah disetujui menjadi Sales Order di SAP.'], ['g11', 'Posisi stok per dek', 'Stok setiap dek, total, dan penjualan 7 hari dalam satu tabel.']];
  F.forEach(([g, j, d], i) => {
    const x = 0.75 + i * 4.0;
    kartu(s, x, 1.9, 3.75, 3.6, `Fitur ${j}`);
    gambar(s, g, {x: x + 0.22, y: 2.1, w: 3.31, h: 2.0}, j);
    teks(s, [{text: j, options: {bold: true, fontSize: 18, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 13, color: K.dk1}}], {x: x + 0.25, y: 4.3, w: 3.25, h: 1.1, paraSpaceAfter: 4});
  });
  s.addNotes('Tiga fitur utama aplikasi web: admin kapal memesan barang ke DC per dek; setiap permintaan disetujui berjenjang dan statusnya terlihat per tahap, lalu menjadi Sales Order di SAP; dan posisi stok setiap dek terpantau dalam satu tabel.');

  // ---------- 6. kasir ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Kasir di setiap dek', {placeholder: 'title'});
  gambar(s, 'g45', {x: 0.75, y: 1.95, w: 5.75, h: 3.3}, 'Kasir: scan barang');
  gambar(s, 'g46', {x: 6.85, y: 1.95, w: 5.75, h: 3.3}, 'Kasir: pembayaran');
  const L = [['1', 'Scan barang', 'barcode, atau ketik nama/kode'], ['2', 'Bayar', 'tunai atau QRIS, kembalian otomatis'], ['3', 'Struk tercetak', 'cetak ulang dari riwayat'], ['4', 'Kirim Delivery Order', 'penjualan harian masuk SAP']];
  L.forEach(([n, j, d], i) => {
    const x = 1.75 + i * 2.72;
    s.addShape(pres.shapes.OVAL, {x, y: 5.65, w: 0.52, h: 0.52, fill: {color: i === 3 ? K.accent4 : K.dk2}, line: {color: i === 3 ? K.accent4 : K.dk2}, objectName: `Langkah ${n}`});
    s.addText(n, {x, y: 5.65, w: 0.52, h: 0.52, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    teks(s, [{text: j, options: {bold: true, fontSize: 15, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.65, y: 5.55, w: 1.95, h: 0.8, valign: 'middle'});
  });
  s.addNotes('Di setiap dek, kasir cukup scan barang, menerima pembayaran tunai atau QRIS dengan kembalian dihitung otomatis, lalu struk tercetak. Di akhir hari, penjualan dikirim ke SAP sebagai Delivery Order.');

  // ---------- 7. keunggulan ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Keunggulan PID POS', {placeholder: 'title'});
  const nilai = [[FA.FaEye, 'Transparan', 'Stok setiap dek dan status setiap permintaan terpantau real-time, lengkap dengan riwayatnya.'], [FA.FaShieldAlt, 'Terkendali', 'Persetujuan berjenjang di setiap tahap, dan setiap persetujuan tercatat lengkap dengan siapa dan kapan.'], [FA.FaLink, 'Terintegrasi', 'Dokumen SAP Business One dibuat otomatis, dan penjualan harian setiap dek masuk SAP sebagai Delivery Order.']];
  for (let i = 0; i < 3; i++) {
    const [Ic, j, d] = nilai[i], x = 0.75 + i * 4.0;
    kartu(s, x, 1.9, 3.75, 3.55, `Keunggulan ${j}`);
    await lingkaranIkon(s, x + 0.3, 2.2, 0.95, Ic, i === 2 ? K.accent1 : K.dk2, 'FFFFFF', `Ikon ${j}`);
    teks(s, j, {x: x + 0.3, y: 3.35, w: 3.15, h: 0.55, fontSize: 24, bold: true, color: K.dk2});
    teks(s, d, {x: x + 0.3, y: 3.95, w: 3.15, h: 1.35, fontSize: 14, color: K.dk1});
  }
  s.addNotes('Keunggulan PID POS ada tiga. Transparan: stok setiap dek dan status permintaan terpantau real-time. Terkendali: setiap tahap disetujui berjenjang, dan setiap persetujuan tercatat lengkap dengan siapa dan kapan. Terintegrasi: dokumen SAP dibuat otomatis, termasuk penjualan harian setiap dek sebagai Delivery Order.');

  // ---------- 8. batasan ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Batasan aplikasi saat ini', {placeholder: 'title'});
  const batas = [
    [FA.FaWifi, 'Memerlukan koneksi internet', 'Aplikasi web dan aplikasi kasir hanya dapat digunakan saat perangkat terhubung ke internet.', 'Koneksi internet di kapal, DC, dan kantor pusat.'],
    [FA.FaAndroid, 'Kasir hanya di Android', 'Aplikasi kasir baru tersedia untuk perangkat Android. Versi iOS (iPhone dan iPad) belum tersedia.', 'Perangkat kasir Android di setiap dek.'],
  ];
  for (let i = 0; i < 2; i++) {
    const [Ic, j, d, siap] = batas[i], x = 0.75 + i * 6.05;
    kartu(s, x, 1.9, 5.8, 3.75, `Batasan ${j}`);
    await lingkaranIkon(s, x + 0.35, 2.2, 0.95, Ic, K.dk2, 'FFFFFF', `Ikon ${j}`);
    if (i === 1) [['Android', 'Tersedia', '4A8A3C'], ['iOS', 'Belum tersedia', K.accent5]].forEach(([os, st, c], k) => {
      const cx = x + 1.6 + k * 2.0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: cx, y: 2.47, w: 1.85, h: 0.42, rectRadius: 0.21, fill: {color: k ? 'EEF1F6' : 'E8F2E4'}, line: {color: c, width: 1}, objectName: `Status ${os}`});
      s.addText([{text: os + ': ', options: {bold: true}}, {text: st}], {x: cx, y: 2.47, w: 1.85, h: 0.42, fontSize: 12, color: c, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    });
    teks(s, j, {x: x + 0.35, y: 3.35, w: 5.1, h: 0.55, fontSize: 24, bold: true, color: K.dk2});
    teks(s, d, {x: x + 0.35, y: 3.95, w: 5.1, h: 0.8, fontSize: 15, color: K.dk1});
    s.addShape(pres.shapes.LINE, {x: x + 0.35, y: 4.85, w: 5.1, h: 0, line: {color: 'E3E9F3', width: 1}, objectName: 'Pemisah'});
    teks(s, [{text: 'Perlu disiapkan: ', options: {bold: true, color: K.dk2}}, {text: siap, options: {color: K.dk1}}], {x: x + 0.35, y: 4.98, w: 5.1, h: 0.5, fontSize: 14});
  }
  s.addNotes('Ada dua batasan PID POS saat ini. Pertama, aplikasi web dan kasir memerlukan koneksi internet, jadi kapal, DC, dan kantor pusat perlu terhubung saat aplikasi dipakai. Kedua, aplikasi kasir baru tersedia di Android; versi iOS untuk iPhone dan iPad belum tersedia, jadi perangkat kasir di setiap dek perlu memakai Android.');

  // ---------- 8. penutup ----------
  pres.addSection({title: 'Penutup'});
  s = pres.addSlide({masterName: 'SAMPUL', sectionTitle: 'Penutup'});
  s.addText('Terima Kasih', {placeholder: 'title'});
  teks(s, 'PID POS · Satu alur, dari kapal sampai kasir.', {x: 0.67, y: 3.55, w: 7.4, h: 0.5, fontSize: 20, bold: true, color: 'FFFFFF'});
  teks(s, 'PT Pelita Indonesia Djaya (PELNI Services)', {x: 0.67, y: 4.1, w: 7.4, h: 0.4, fontSize: 16, color: 'D6E4F5'});
  s.addNotes('PID POS: satu alur, dari kapal sampai kasir. Terima kasih.');

  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
