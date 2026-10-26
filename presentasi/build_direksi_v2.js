// Paparan direksi PID POS (versi 2, 8 halaman, khusus tentang aplikasi), selaras dengan video perkenalan versi profesional:
// navy gelap, aksen oranye, logo Danantara · PELNI Services, layar aplikasi asli.
// Pakai: npm install && node build_direksi_v2.js  ->  ../docs/PID_POS_Paparan_Direksi_v2.pptx
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const FA = require('react-icons/fa');
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'motion/public/img', `${g}.png`);
const PELNI = path.join(ROOT, 'motion/public/brand/pelni_services.png');
const DANANTARA = path.join(ROOT, 'brand/danantara_gelap.png');
const OUT = path.join(ROOT, 'docs/PID_POS_Paparan_Direksi_v2.pptx');
const DIMS = {g01: [2049, 1180], g02: [2049, 974], g11: [2049, 590], g19: [1419, 1260], g45: [2049, 1200], g46: [2049, 995]};

const THEME = {
  name: 'PID POS Direksi',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1B2437', lt1: 'FFFFFF', dk2: '0B1A3A', lt2: 'EEF3FB',
    accent1: 'FF6B1A', accent2: '1F3B7A', accent3: '3D6FC2', accent4: '2E8B57', accent5: '5B6B86', accent6: 'D5DEEC',
    hlink: '1F3B7A', folHlink: '5B6B86',
  },
};
const K = THEME.colors;
const DOK = {SO: '4A8A3C', PR: 'A87412', PO: 'C85A1C', GRPO: '7C68B8', IT: 'C45C8E', DO: 'CF5140'};

const ikon = async (Icon, color) => {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, {color: '#' + color, size: 256}));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
};

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'PID POS · Paparan Direksi';
  pres.author = 'PT Pelita Indonesia Djaya (PELNI Services)';
  pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
  const C = pres.SchemeColor;

  // ---------- layout ----------
  pres.defineSlideMaster({
    title: 'GELAP',
    background: {color: K.dk2},
    objects: [
      {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 2.55, w: 7.2, h: 1.3, fontSize: 66, bold: true, color: C.background1, align: 'left', valign: 'middle', margin: 0}, text: ''}},
    ],
  });
  pres.defineSlideMaster({
    title: 'ISI',
    background: {color: K.lt1},
    objects: [
      {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 0.45, w: 10.6, h: 0.8, fontSize: 34, bold: true, color: C.text2, align: 'left', valign: 'middle', margin: 0}, text: ''}},
      {image: {path: PELNI, x: 11.55, y: 0.5, w: 1.2, h: 0.55}},
      {text: {text: 'PID POS · Paparan Direksi', options: {x: 0.7, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent5, margin: 0}}},
    ],
    slideNumber: {x: 12.25, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: K.accent5, align: 'right'},
  });

  // kartu putih dengan bayangan lembut: motif seluruh deck
  const kartu = (s, x, y, w, h, name, fill = K.lt1) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.14, fill: {color: fill}, line: {color: fill},
    shadow: {type: 'outer', color: '0B1A3A', opacity: 0.14, blur: 10, offset: 3, angle: 90}, objectName: name,
  });
  const lingkaranIkon = async (s, x, y, d, Icon, bg, fg, name) => {
    s.addShape(pres.shapes.OVAL, {x, y, w: d, h: d, fill: {color: bg}, line: {color: bg}, objectName: name + ' latar'});
    s.addImage({data: await ikon(Icon, fg), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, altText: name, objectName: name});
  };
  const gambar = (s, g, box, name) => {
    const [iw, ih] = DIMS[g];
    let w = box.w, h = (ih / iw) * w;
    if (h > box.h) { h = box.h; w = (iw / ih) * h; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    kartu(s, x - 0.08, y - 0.08, w + 0.16, h + 0.16, name + ' bingkai', 'E4EAF4');
    s.addImage({path: IMG(g), x, y, w, h, altText: `Layar PID POS: ${name}`, objectName: name});
  };
  const logoLockup = (s, x, y, w) => {
    const h = w * 0.2;
    kartu(s, x, y, w, h, 'Kartu logo');
    s.addImage({path: DANANTARA, x: x + w * 0.05, y: y + h * 0.24, w: w * 0.4, h: w * 0.4 * 454 / 1802, altText: 'Logo Danantara Indonesia', objectName: 'Logo Danantara'});
    s.addShape(pres.shapes.LINE, {x: x + w * 0.5, y: y + h * 0.2, w: 0, h: h * 0.6, line: {color: K.accent6, width: 1.5}, objectName: 'Pemisah logo'});
    s.addImage({path: PELNI, x: x + w * 0.56, y: y + h * 0.16, w: w * 0.38, h: w * 0.38 * 0.46, altText: 'Logo PELNI Services', objectName: 'Logo PELNI Services'});
  };

  // ---------- 1. sampul ----------
  pres.addSection({title: 'Pembuka'});
  let s = pres.addSlide({masterName: 'GELAP', sectionTitle: 'Pembuka'});
  logoLockup(s, 0.7, 0.6, 4.6);
  s.addText('PID POS', {placeholder: 'title'});
  s.addText('Aplikasi toko kapal yang terhubung langsung dengan SAP Business One', {x: 0.7, y: 3.95, w: 6.4, h: 0.95, fontSize: 22, color: 'CADCFC', margin: 0, valign: 'top', isTextBox: true});
  s.addText('Paparan kepada Direksi · Oktober 2026', {x: 0.7, y: 6.55, w: 6, h: 0.35, fontSize: 14, color: '8FA6D8', margin: 0, isTextBox: true});
  gambar(s, 'g01', {x: 7.75, y: 1.75, w: 5.0, h: 4.0}, 'Beranda admin kapal');
  s.addNotes('PID POS adalah aplikasi toko kapal PELNI Services yang terhubung langsung dengan SAP Business One. Paparan ini menyampaikan apa itu PID POS, alurnya, peran yang terlibat, fitur utamanya, kasir, dan keunggulannya.');

  // ---------- 2. apa itu ----------
  pres.addSection({title: 'Aplikasi'});
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Satu aplikasi untuk seluruh alur toko kapal', {placeholder: 'title'});
  const baris = [[FA.FaGlobe, 'Aplikasi web', 'Untuk admin kapal, DC, dan kantor pusat: pesan barang, persetujuan, stok, kas, dan laporan.'], [FA.FaMobileAlt, 'Aplikasi kasir Android', 'Untuk kasir di setiap dek: scan, bayar tunai atau QRIS, struk, dan rekap shift.'], [FA.FaDatabase, 'Terhubung SAP Business One', 'Dokumen dibuat otomatis setelah disetujui, tanpa input ulang.']];
  for (let i = 0; i < baris.length; i++) {
    const [Ic, j, d] = baris[i], y = 1.75 + i * 1.6;
    await lingkaranIkon(s, 0.7, y, 0.95, Ic, i === 2 ? K.accent1 : K.accent2, 'FFFFFF', j);
    s.addText([{text: j, options: {bold: true, fontSize: 20, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 15, color: K.dk1}}], {x: 1.9, y: y - 0.1, w: 4.9, h: 1.25, margin: 0, valign: 'top', isTextBox: true});
  }
  gambar(s, 'g01', {x: 7.2, y: 1.75, w: 5.55, h: 4.7}, 'Beranda admin kapal');
  s.addNotes('PID POS terdiri dari aplikasi web untuk admin kapal, DC, dan kantor pusat, serta aplikasi kasir Android untuk setiap dek. Keduanya terhubung langsung dengan SAP Business One, sehingga dokumen dibuat otomatis setelah disetujui. Gambar di kanan adalah beranda admin kapal.');

  // ---------- 3. alur ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Alur end-to-end: setiap langkah tercatat di SAP', {placeholder: 'title'});
  const atas = [['Pesan ke DC', 'Admin kapal', null], ['Approve SO', 'Kantor pusat', 'SO'], ['Pilah stok', 'Admin DC', null], ['Transfer ke dek', 'Admin DC', 'IT'], ['Terima di dek', 'Kepala toko · P2', null], ['Jual di kasir', 'Kasir', 'DO']];
  const nw = 1.78, gap = 0.25, y1 = 1.9;
  atas.forEach(([j, p, d], i) => {
    const x = 0.7 + i * (nw + gap);
    kartu(s, x, y1, nw, 1.15, `Tahap ${j}`);
    s.addText([{text: j, options: {bold: true, fontSize: 15, color: K.dk2, breakLine: true}}, {text: p, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.12, y: y1 + 0.12, w: nw - 0.24, h: 0.9, margin: 0, align: 'center', valign: 'middle', isTextBox: true});
    if (i < atas.length - 1) s.addShape(pres.shapes.LINE, {x: x + nw + 0.03, y: y1 + 0.575, w: gap - 0.06, h: 0, line: {color: K.accent3, width: 2, endArrowType: 'triangle'}, objectName: 'Panah alur'});
    if (d) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: x + nw / 2 - 0.42, y: y1 + 1.25, w: 0.84, h: 0.36, rectRadius: 0.08, fill: {color: DOK[d]}, line: {color: DOK[d]}, objectName: `Dokumen ${d}`});
      s.addText(d, {x: x + nw / 2 - 0.42, y: y1 + 1.25, w: 0.84, h: 0.36, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    }
  });
  // cabang pembelian bila stok DC kurang
  const xb0 = 0.7 + 2 * (nw + gap), y2 = 3.75;
  s.addText('Bila stok DC kurang:', {x: 0.7, y: y2 + 0.3, w: 3.9, h: 0.45, fontSize: 14, italic: true, color: K.accent5, align: 'right', margin: 0, isTextBox: true});
  s.addShape(pres.shapes.LINE, {x: xb0 + nw / 2, y: y1 + 1.15, w: 0, h: y2 - y1 - 1.15, line: {color: K.accent3, width: 2, dashType: 'dash', endArrowType: 'triangle'}, objectName: 'Cabang pembelian'});
  [['Purchase Request', 'Approve PUR', 'PR'], ['Purchase Order', 'Purchasing', 'PO'], ['Barang vendor tiba', 'Admin DC', 'GRPO']].forEach(([j, p, d], i) => {
    const x = xb0 + i * (nw + gap);
    kartu(s, x, y2, nw, 1.15, `Cabang ${j}`, 'F5F7FB');
    s.addText([{text: j, options: {bold: true, fontSize: 14, color: K.dk2, breakLine: true}}, {text: p, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.1, y: y2 + 0.12, w: nw - 0.2, h: 0.9, margin: 0, align: 'center', valign: 'middle', isTextBox: true});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: x + nw / 2 - 0.42, y: y2 + 1.25, w: 0.84, h: 0.36, rectRadius: 0.08, fill: {color: DOK[d]}, line: {color: DOK[d]}, objectName: `Dokumen ${d}`});
    s.addText(d, {x: x + nw / 2 - 0.42, y: y2 + 1.25, w: 0.84, h: 0.36, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    if (i < 2) s.addShape(pres.shapes.LINE, {x: x + nw + 0.03, y: y2 + 0.575, w: gap - 0.06, h: 0, line: {color: K.accent3, width: 2, endArrowType: 'triangle'}, objectName: 'Panah cabang'});
  });
  // GRPO kembali ke transfer: garis diagonal dengan panah di ujung atas (kolom transfer)
  const x3 = 0.7 + 3 * (nw + gap) + nw / 2, x4 = 0.7 + 4 * (nw + gap) + nw / 2;
  s.addShape(pres.shapes.LINE, {x: x3, y: y1 + 1.68, w: x4 - x3, h: y2 - y1 - 1.68, line: {color: K.accent3, width: 2, dashType: 'dash', beginArrowType: 'triangle'}, objectName: 'Kembali ke transfer'});
  kartu(s, 0.7, 5.75, 11.85, 0.9, 'Kesimpulan alur', K.lt2);
  s.addText([{text: '6 jenis dokumen SAP dibuat otomatis: ', options: {bold: true, color: K.dk2}}, {text: 'SO, PR, PO, GRPO, IT (Inventory Transfer), dan DO (Delivery Order), tanpa input ulang.', options: {color: K.dk1}}], {x: 1.0, y: 5.75, w: 11.3, h: 0.9, fontSize: 16, margin: 0, valign: 'middle', isTextBox: true});
  s.addNotes('Jalur atas selalu dijalani: kapal memesan ke DC, kantor pusat menyetujui sehingga Sales Order terbentuk di SAP, DC memilah stok, barang dikirim ke dek dengan Inventory Transfer, diterima kepala toko dan P2, lalu dijual di kasir dan masuk SAP sebagai Delivery Order. Bila stok DC kurang, jalur pembelian berjalan: Purchase Request, Purchase Order ke vendor, dan GRPO saat barang tiba di DC.');

  // ---------- 4. tujuh peran ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Tujuh peran, masing-masing melihat tugasnya sendiri', {placeholder: 'title'});
  const zona = [
    [FA.FaShip, 'Kapal', [['Admin Kapal / Kepala Toko', 'Pesan ke DC, terima barang di dek'], ['Kasir', 'Jual, kirim DO harian ke SAP']]],
    [FA.FaBuilding, 'Kantor pusat', [['Approve SO (P2)', 'Setujui permintaan jadi Sales Order'], ['Approve PUR', 'Setujui PR, GRPO, dan transfer'], ['Admin Purchase', 'Buat Purchase Order ke vendor'], ['Approve PO', 'Setujui Purchase Order']]],
    [FA.FaWarehouse, 'DC', [['Admin DC', 'Pilah stok, ajukan GRPO dan transfer']]],
  ];
  const zw = [3.7, 4.45, 3.1];
  let zx = 0.7;
  for (let z = 0; z < zona.length; z++) {
    const [Ic, nama, rows] = zona[z];
    kartu(s, zx, 1.7, zw[z], 1.25 + rows.length * 0.95, `Zona ${nama}`, K.lt2);
    await lingkaranIkon(s, zx + 0.3, 1.9, 0.6, Ic, K.dk2, 'FFFFFF', `Ikon ${nama}`);
    s.addText(nama, {x: zx + 1.05, y: 1.9, w: zw[z] - 1.3, h: 0.6, fontSize: 20, bold: true, color: K.dk2, margin: 0, valign: 'middle', isTextBox: true});
    rows.forEach(([r, d], i) => {
      const y = 2.75 + i * 0.95;
      kartu(s, zx + 0.25, y, zw[z] - 0.5, 0.8, `Peran ${r}`);
      s.addText([{text: r, options: {bold: true, fontSize: 15, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}], {x: zx + 0.45, y, w: zw[z] - 0.9, h: 0.8, margin: 0, valign: 'middle', isTextBox: true});
    });
    zx += zw[z] + 0.3;
  }
  s.addNotes('Ada tujuh peran. Di kapal: admin kapal atau kepala toko, dan kasir. Di kantor pusat: Approve SO, Approve PUR, Admin Purchase, dan Approve PO. Di DC: admin DC. Setiap peran hanya melihat tugas yang menunggunya, lewat lonceng dan tab Giliran saya.');

  // ---------- 5. fitur web: layar asli ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Fitur utama aplikasi web', {placeholder: 'title'});
  const F = [['g02', 'Pesan ke DC', 'Pilih barang dan dek tujuan, lalu kirim permintaan ke DC.'], ['g19', 'Persetujuan berjenjang', 'Status tiap tahap terlihat; setelah disetujui jadi Sales Order di SAP.'], ['g11', 'Posisi stok per dek', 'Stok setiap dek, total, dan penjualan 7 hari dalam satu tabel.']];
  F.forEach(([g, j, d], i) => {
    const x = 0.7 + i * 4.05;
    kartu(s, x, 1.65, 3.75, 4.95, `Fitur ${j}`);
    gambar(s, g, {x: x + 0.25, y: 1.95, w: 3.25, h: 2.55}, j);
    s.addText([{text: j, options: {bold: true, fontSize: 20, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 14, color: K.dk1}}], {x: x + 0.3, y: 4.75, w: 3.15, h: 1.7, margin: 0, valign: 'top', paraSpaceAfter: 6, isTextBox: true});
  });
  s.addNotes('Tiga fitur utama aplikasi web: admin kapal memesan barang ke DC per dek; setiap permintaan disetujui berjenjang dan statusnya terlihat per tahap, lalu menjadi Sales Order di SAP; dan posisi stok setiap dek terpantau dalam satu tabel.');

  // ---------- 6. kasir ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Kasir di setiap dek', {placeholder: 'title'});
  gambar(s, 'g45', {x: 0.7, y: 1.7, w: 5.5, h: 3.4}, 'Kasir: scan barang');
  gambar(s, 'g46', {x: 6.45, y: 1.7, w: 5.5, h: 3.4}, 'Kasir: pembayaran');
  const L = [['1', 'Scan barang', 'barcode, atau ketik nama/kode'], ['2', 'Bayar', 'tunai atau QRIS, kembalian otomatis'], ['3', 'Struk tercetak', 'cetak ulang dari riwayat'], ['4', 'Kirim DO', 'penjualan harian masuk SAP']];
  L.forEach(([n, j, d], i) => {
    const x = 0.7 + i * 2.97;
    s.addShape(pres.shapes.OVAL, {x, y: 5.6, w: 0.55, h: 0.55, fill: {color: i === 3 ? K.accent1 : K.dk2}, line: {color: i === 3 ? K.accent1 : K.dk2}, objectName: `Langkah ${n}`});
    s.addText(n, {x, y: 5.6, w: 0.55, h: 0.55, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    s.addText([{text: j, options: {bold: true, fontSize: 16, color: K.dk2, breakLine: true}}, {text: d, options: {fontSize: 12, color: K.accent5}}], {x: x + 0.7, y: 5.5, w: 2.15, h: 0.85, margin: 0, valign: 'middle', isTextBox: true});
  });
  s.addNotes('Di setiap dek, kasir cukup scan barang, menerima pembayaran tunai atau QRIS dengan kembalian dihitung otomatis, lalu struk tercetak. Di akhir hari, penjualan dikirim ke SAP sebagai Delivery Order.');

  // ---------- 7. keunggulan ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Aplikasi'});
  s.addText('Keunggulan PID POS', {placeholder: 'title'});
  const nilai = [[FA.FaEye, 'Transparan', 'Stok setiap dek dan status setiap permintaan terpantau real-time, lengkap dengan riwayatnya.'], [FA.FaShieldAlt, 'Terkendali', 'Persetujuan berjenjang di setiap tahap; retur dan kas keluar besar memerlukan PIN kepala toko.'], [FA.FaLink, 'Terintegrasi', 'Dokumen SAP Business One dibuat otomatis, dan penjualan harian setiap dek masuk SAP sebagai DO.']];
  for (let i = 0; i < 3; i++) {
    const [Ic, j, d] = nilai[i], x = 0.7 + i * 4.05;
    kartu(s, x, 1.75, 3.75, 3.9, `Nilai ${j}`);
    await lingkaranIkon(s, x + 0.35, 2.1, 1.0, Ic, i === 0 ? K.accent2 : i === 1 ? K.accent3 : K.accent1, 'FFFFFF', `Ikon ${j}`);
    s.addText(j, {x: x + 0.35, y: 3.35, w: 3.1, h: 0.6, fontSize: 26, bold: true, color: K.dk2, margin: 0, isTextBox: true});
    s.addText(d, {x: x + 0.35, y: 4.0, w: 3.1, h: 2.0, fontSize: 15, color: K.dk1, margin: 0, valign: 'top', isTextBox: true});
  }
  s.addNotes('Nilainya bagi perusahaan ada tiga. Transparan: stok setiap dek dan status permintaan terpantau real-time. Terkendali: setiap tahap disetujui berjenjang, dan transaksi sensitif seperti retur memerlukan PIN kepala toko. Terintegrasi: dokumen SAP dibuat otomatis, termasuk penjualan harian setiap dek sebagai Delivery Order.');

  // ---------- 8. penutup ----------
  pres.addSection({title: 'Penutup'});
  s = pres.addSlide({masterName: 'GELAP', sectionTitle: 'Penutup'});
  logoLockup(s, 0.7, 0.6, 4.6);
  s.addText('PID POS', {placeholder: 'title'});
  s.addText('Satu alur, dari kapal sampai kasir.', {x: 0.7, y: 3.95, w: 8, h: 0.6, fontSize: 24, color: 'CADCFC', margin: 0, isTextBox: true});
  s.addText([{text: 'Terima kasih', options: {bold: true, fontSize: 30, color: 'FFFFFF', breakLine: true}}, {text: 'Aplikasi toko kapal PELNI Services, terhubung SAP Business One.', options: {fontSize: 16, color: '8FA6D8'}}], {x: 0.7, y: 5.75, w: 11.9, h: 1.15, margin: 0, valign: 'top', isTextBox: true});
  s.addNotes('PID POS: satu alur, dari kapal sampai kasir. Terima kasih.');

  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
