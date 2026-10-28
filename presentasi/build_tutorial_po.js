// Panduan peran Admin Purchase & Approve PO di atas template perusahaan, isi dari Manual Book (doc Claude) dan video tutorial.
// Gambar layar: ../video-tutorial/po/assets/img (diambil dari manual). Sorotan oranye memakai koordinat piksel gambar asli.
// Pakai: node build_tutorial_po.js  ->  ../docs/PID_POS_Panduan_Admin_Purchase_Approve_PO.pptx
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const FA = require('react-icons/fa');
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'video-tutorial/po/assets/img', `${g}.png`);
const OUT = path.join(ROOT, 'docs/PID_POS_Panduan_Admin_Purchase_Approve_PO.pptx');
const DIMS = {lvl_admin: [1140, 645], lvl_po: [1140, 615], pajak: [1410, 299], tab_po: [2160, 1500], vendor: [1491, 1170], cari: [1491, 1100],
  terisi: [1491, 1428], approval: [1320, 276], ditolak: [1371, 254]};

const THEME = {
  name: 'PELNI Services', headFontFace: 'Calibri', bodyFontFace: 'Calibri',
  colors: {dk1: '1B2437', lt1: 'FFFFFF', dk2: '274289', lt2: 'EEF3FA', accent1: '5AB4E5', accent2: '274289', accent3: '3D6FC2', accent4: 'F2762E',
    accent5: '5B6B86', accent6: 'D5DEEC', hlink: '274289', folHlink: '5B6B86'},
};
const K = THEME.colors;
const MERAH = 'C0392B', HIJAU = '2E7D4F';

const ikon = async (Icon, color) => {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, {color: '#' + color, size: 256}));
  return 'image/png;base64,' + (await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64');
};

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'PID POS · Panduan Admin Purchase & Approve PO';
  pres.author = 'PT Pelita Indonesia Djaya (PELNI Services)';
  pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: 'SAMPUL', background: {path: path.join(__dirname, 'template/latar_sampul.png')},
    objects: [
      {placeholder: {options: {name: 'title', type: 'title', x: 0.67, y: 1.95, w: 8.2, h: 1.35, fontSize: 40, bold: true, color: C.background1, align: 'left', valign: 'bottom', margin: 0}, text: ''}},
      {line: {x: 0.67, y: 3.42, w: 7.4, h: 0, line: {color: 'FFFFFF', width: 1.25}}},
    ],
  });
  pres.defineSlideMaster({
    title: 'ISI', background: {path: path.join(__dirname, 'template/latar_isi.png')},
    objects: [{placeholder: {options: {name: 'title', type: 'title', x: 0.75, y: 1.0, w: 11.85, h: 0.7, fontSize: 28, bold: true, color: C.text2, align: 'left', valign: 'middle', margin: 0}, text: ''}}],
    slideNumber: {x: 12.15, y: 6.9, w: 0.5, h: 0.3, fontSize: 10, color: K.accent5, align: 'right'},
  });

  const kartu = (s, x, y, w, h, name, fill = K.lt1) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.1, fill: {color: fill}, line: {color: fill === K.lt1 ? 'E3E9F3' : fill, width: 0.75},
    shadow: {type: 'outer', color: '274289', opacity: 0.12, blur: 8, offset: 2, angle: 90}, objectName: name,
  });
  const teks = (s, runs, o) => s.addText(runs, {margin: 0, valign: 'top', isTextBox: true, fontSize: 14, color: K.dk1, ...o});
  const b = (t, o = {}) => ({text: t, options: {bold: true, color: K.dk2, ...o}});
  const n = (t, o = {}) => ({text: t, options: o});
  const pil = (s, x, y, w, t, warna = K.dk2, isi = 'FFFFFF') => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w, h: 0.32, rectRadius: 0.16, fill: {color: warna}, line: {color: warna}, objectName: `Label ${t}`});
    s.addText(t, {x, y, w, h: 0.32, fontSize: 11, bold: true, color: isi, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
  };
  // gambar layar dalam bingkai + sorotan oranye; sorot = [[x, y, w, h, nomor?], ...] dalam piksel gambar asli
  const gambar = (s, g, box, name, sorot = []) => {
    const [iw, ih] = DIMS[g];
    let w = box.w, h = (ih / iw) * w;
    if (h > box.h) { h = box.h; w = (iw / ih) * h; }
    const x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2, k = w / iw;
    kartu(s, x - 0.07, y - 0.07, w + 0.14, h + 0.14, name + ' bingkai', 'E4EAF4');
    s.addImage({path: IMG(g), x, y, w, h, altText: `Layar PID POS: ${name}`, objectName: name});
    sorot.forEach(([rx, ry, rw, rh, no], i) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: x + rx * k - 0.03, y: y + ry * k - 0.03, w: rw * k + 0.06, h: rh * k + 0.06, rectRadius: 0.05,
        fill: {type: 'none'}, line: {color: K.accent4, width: 2.25}, objectName: `Sorotan ${name} ${i + 1}`});
      if (no) {
        const cx = x + rx * k - 0.17, cy = y + ry * k - 0.17;
        s.addShape(pres.shapes.OVAL, {x: cx, y: cy, w: 0.32, h: 0.32, fill: {color: K.accent4}, line: {color: 'FFFFFF', width: 1.5}, objectName: `Nomor ${no}`});
        s.addText(String(no), {x: cx, y: cy, w: 0.32, h: 0.32, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
      }
    });
  };
  // daftar langkah bernomor di kolom
  const langkah = (s, x, y, w, items, gap = 0.12, fs = 13.5) => {
    let yy = y;
    items.forEach(([judul, isi, tinggi], i) => {
      s.addShape(pres.shapes.OVAL, {x, y: yy, w: 0.36, h: 0.36, fill: {color: K.dk2}, line: {color: K.dk2}, objectName: `Langkah ${i + 1}`});
      s.addText(String(i + 1), {x, y: yy, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
      teks(s, [b(judul, {breakLine: true}), n(isi, {color: K.dk1})], {x: x + 0.5, y: yy - 0.02, w: w - 0.5, h: tinggi, fontSize: fs});
      yy += tinggi + gap;
    });
  };
  const tabel = (s, rows, o) => {
    const head = rows[0].map((t) => ({text: t, options: {bold: true, color: 'FFFFFF', fill: {color: K.dk2}}}));
    const body = rows.slice(1).map((r, i) => r.map((c) => (typeof c === 'string' ? {text: c, options: {fill: {color: i % 2 ? 'F6F8FC' : 'FFFFFF'}}} : {...c, options: {fill: {color: i % 2 ? 'F6F8FC' : 'FFFFFF'}, ...c.options}})));
    s.addTable([head, ...body], {fontSize: 12, color: K.dk1, fontFace: 'Calibri', border: {type: 'solid', pt: 0.75, color: 'D5DEEC'}, margin: [0.06, 0.1, 0.06, 0.1], valign: 'middle', ...o});
  };
  const tb = (t, warna = K.dk2) => ({text: t, options: {bold: true, color: warna}});

  // ---------- 1. sampul ----------
  let s = pres.addSlide({masterName: 'SAMPUL'});
  s.addText('Panduan Admin Purchase & Approve PO', {placeholder: 'title'});
  teks(s, 'PID POS · Membuat dan menyetujui Purchase Order', {x: 0.67, y: 3.55, w: 7.6, h: 0.5, fontSize: 20, bold: true, color: 'FFFFFF'});
  teks(s, 'PT Pelita Indonesia Djaya (PELNI Services)', {x: 0.67, y: 4.1, w: 7.4, h: 0.4, fontSize: 16, color: 'D6E4F5'});
  s.addNotes('Panduan ini untuk dua peran di web PID POS, menu Permintaan DC: admin purchase yang membuat Purchase Order (PO) per vendor dari sisa Purchase Request (PUR), dan Approve PO yang menyetujuinya level demi level sampai PO final di SAP. Penerimaan barang (GRPO) dibahas di panduan terpisah.');

  // ---------- 2. dua peran ----------
  s = pres.addSlide({masterName: 'ISI'});
  s.addText('Dua peran, satu alur Purchase Order', {placeholder: 'title'});
  const peran = [
    [FA.FaFileInvoice, 'Admin purchase', 'Membuat PO per vendor dari sisa Purchase Request (PUR), dan memperbaiki PO yang ditolak.', '+ Buat PO · Ajukan approval · Ubah & ajukan ulang', 'Buat PO · PO ditolak'],
    [FA.FaUserCheck, 'Approve PO', 'Memeriksa PO yang diajukan, lalu menyetujui atau menolaknya, level demi level.', 'Setujui · Tolak', 'Approval PO · Draft SAP'],
  ];
  for (let i = 0; i < 2; i++) {
    const [Ic, j, d, tombol, status] = peran[i], x = 0.75 + i * 6.05;
    kartu(s, x, 1.9, 5.8, 3.55, `Peran ${j}`);
    s.addShape(pres.shapes.OVAL, {x: x + 0.35, y: 2.2, w: 0.85, h: 0.85, fill: {color: i ? K.accent1 : K.dk2}, line: {color: i ? K.accent1 : K.dk2}, objectName: `Ikon ${j} latar`});
    s.addImage({data: await ikon(Ic, 'FFFFFF'), x: x + 0.56, y: 2.41, w: 0.43, h: 0.43, altText: j, objectName: `Ikon ${j}`});
    teks(s, j, {x: x + 1.4, y: 2.38, w: 4.1, h: 0.5, fontSize: 24, bold: true, color: K.dk2});
    teks(s, d, {x: x + 0.35, y: 3.3, w: 5.1, h: 0.75, fontSize: 15});
    teks(s, [b('Tombol utama: ', {color: K.accent5}), n(tombol, {bold: true, color: K.dk2})], {x: x + 0.35, y: 4.2, w: 5.1, h: 0.4, fontSize: 13});
    teks(s, [b('Tugas Anda saat status: ', {color: K.accent5}), n(status, {bold: true, color: K.dk2})], {x: x + 0.35, y: 4.7, w: 5.1, h: 0.4, fontSize: 13});
  }
  teks(s, [n('Keduanya bekerja di '), b('Permintaan DC → tab Giliran saya'), n(' (yang menunggu Anda) atau '), b('tab PO'), n(' (semua permintaan di tahap PO). Akun admin boleh melakukan semua tahap.')],
    {x: 1.75, y: 5.75, w: 10.85, h: 0.45, fontSize: 13, color: K.accent5});
  s.addNotes('Ada dua peran. Admin purchase membuat PO per vendor dari sisa PUR dan memperbaiki PO yang ditolak. Approve PO memeriksa lalu menyetujui atau menolak PO per level. Keduanya bekerja di Permintaan DC, tab Giliran saya atau tab PO.');

  // ---------- 3. alur status ----------
  s = pres.addSlide({masterName: 'ISI'});
  s.addText('Alur status PO: final hanya setelah level approval terakhir', {placeholder: 'title'});
  const atas = [['Buat PO', 'admin purchase', K.lt1, K.dk2], ['Draft', 'di web, qty dicadangkan', K.lt1, K.dk2], ['Menunggu approval', 'Draft SAP · level 1 s.d. n', K.lt1, K.dk2],
    ['PO final di SAP', 'nomor PO terbit', K.dk2, 'FFFFFF'], ['Terima barang', 'GRPO (panduan terpisah)', K.lt2, K.dk2]];
  const bw = 2.15, bg = 0.28, y1 = 2.25;
  atas.forEach(([j, d, fill, warna], i) => {
    const x = 0.75 + i * (bw + bg);
    kartu(s, x, y1, bw, 1.0, `Status ${j}`, fill);
    s.addText([{text: j, options: {bold: true, fontSize: 15, color: warna, breakLine: true}}, {text: d, options: {fontSize: 11.5, color: fill === K.dk2 ? 'D6E4F5' : K.accent5}}],
      {x: x + 0.08, y: y1 + 0.08, w: bw - 0.16, h: 0.84, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    if (i < 4) s.addShape(pres.shapes.LINE, {x: x + bw + 0.03, y: y1 + 0.5, w: bg - 0.06, h: 0, line: {color: K.accent3, width: 2, endArrowType: 'triangle'}, objectName: 'Panah'});
  });
  // label di atas panah: Draft -> Menunggu (Ajukan), Menunggu -> Final (Setujui level terakhir)
  teks(s, 'Ajukan', {x: 4.87, y: 1.92, w: 1.2, h: 0.3, fontSize: 11, color: K.accent5, align: 'center'});
  teks(s, 'Setujui level terakhir', {x: 7.0, y: 1.92, w: 2.1, h: 0.3, fontSize: 11, color: K.accent5, align: 'center'});
  // cabang bawah
  const xMenunggu = 0.75 + 2 * (bw + bg), y2 = 4.05;
  kartu(s, xMenunggu, y2, bw, 1.0, 'Status Ditolak', 'FBECEA');
  s.addText([{text: 'Ditolak', options: {bold: true, fontSize: 15, color: MERAH, breakLine: true}}, {text: 'Draft SAP dihapus, qty kembali', options: {fontSize: 11.5, color: K.accent5}}],
    {x: xMenunggu + 0.08, y: y2 + 0.08, w: bw - 0.16, h: 0.84, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
  s.addShape(pres.shapes.LINE, {x: xMenunggu + bw / 2, y: y1 + 1.03, w: 0, h: y2 - y1 - 1.06, line: {color: MERAH, width: 2, dashType: 'dash', endArrowType: 'triangle'}, objectName: 'Ke ditolak'});
  teks(s, 'Tolak + alasan', {x: xMenunggu + bw / 2 + 0.1, y: y1 + 1.25, w: 1.6, h: 0.3, fontSize: 11, color: MERAH});
  s.addShape(pres.shapes.LINE, {x: 0.75 + bw + bg + bw / 2, y: y2 + 0.5, w: xMenunggu - (0.75 + bw + bg + bw / 2), h: 0, line: {color: K.accent3, width: 2, dashType: 'dash', beginArrowType: 'triangle'}, objectName: 'Ajukan ulang'});
  s.addShape(pres.shapes.LINE, {x: 0.75 + bw + bg + bw / 2, y: y1 + 1.03, w: 0, h: y2 + 0.5 - y1 - 1.03, line: {color: K.accent3, width: 2, dashType: 'dash'}, objectName: 'Ajukan ulang naik'});
  teks(s, 'Ubah & ajukan ulang', {x: 0.75 + bw + bg + bw / 2 + 0.08, y: y2 + 0.58, w: 1.15, h: 0.3, fontSize: 10, color: K.accent3});
  kartu(s, 0.75, y2, bw, 1.0, 'Status Dibatalkan', K.lt2);
  s.addText([{text: 'Dibatalkan', options: {bold: true, fontSize: 15, color: K.accent5, breakLine: true}}, {text: 'qty kembali ke sisa PUR', options: {fontSize: 11.5, color: K.accent5}}],
    {x: 0.83, y: y2 + 0.08, w: bw - 0.16, h: 0.84, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
  s.addShape(pres.shapes.LINE, {x: 0.75 + bw / 2, y: y1 + 1.03, w: 0, h: y2 - y1 - 1.06, line: {color: K.accent5, width: 1.5, dashType: 'dash', endArrowType: 'triangle'}, objectName: 'Ke dibatalkan'});
  teks(s, 'Batalkan', {x: 0.75 + bw / 2 + 0.1, y: y1 + 1.25, w: 1.2, h: 0.3, fontSize: 11, color: K.accent5});
  kartu(s, 9.95, 4.05, 2.65, 1.25, 'Catatan final', K.lt2);
  teks(s, [b('PO final', {breakLine: true}), n('tidak bisa diubah atau dibatalkan dari web; pembatalannya di SAP.')], {x: 10.1, y: 4.15, w: 2.4, h: 1.1, fontSize: 12.5});
  s.addNotes('Admin purchase membuat PO, bisa disimpan sebagai draft di web dulu (qty sudah dicadangkan), lalu diajukan sehingga masuk SAP sebagai Draft dan menunggu approval level 1 sampai level terakhir. Hanya persetujuan level terakhir yang membuat PO final. PO ditolak kembali ke admin purchase untuk diubah dan diajukan ulang; PO yang dibatalkan mengembalikan qty ke sisa PUR. PO final lanjut ke penerimaan barang (GRPO).');

  // ---------- 4. persiapan: level approval ----------
  s = pres.addSlide({masterName: 'ISI'});
  s.addText('Persiapan (admin, sekali): Level approval', {placeholder: 'title'});
  gambar(s, 'lvl_admin', {x: 0.75, y: 1.95, w: 5.75, h: 3.3}, 'Level approval, tab Admin purchase', [[370, 100, 196, 58, 1], [16, 372, 478, 120, 2]]);
  gambar(s, 'lvl_po', {x: 6.85, y: 1.95, w: 5.75, h: 3.3}, 'Level approval, tab Approval PO', [[570, 100, 164, 58, 3], [30, 515, 240, 70, 4], [915, 515, 197, 70, 5]]);
  teks(s, [b('Permintaan DC → tombol Level approval (kanan atas).', {breakLine: true}),
    n('1 Tab Admin purchase · 2 centang akun yang boleh membuat dan mengajukan PO (kosong = penyetuju PUR level terakhir bertindak sebagai admin purchase) · 3 Tab Approval PO · 4 Tambah level, satu baris per level · 5 Simpan level.')],
    {x: 1.75, y: 5.45, w: 10.85, h: 0.9, fontSize: 13});
  s.addNotes('Sebelum mulai, admin menentukan siapa admin purchase dan penyetuju PO di Permintaan DC, tombol Level approval. Di tab Admin purchase, centang akun yang boleh membuat PO. Di tab Approval PO, buat satu baris per level dan centang penyetujunya; level tanpa akun dicentang berarti semua admin boleh menyetujui level itu. Klik Simpan level; perubahan juga berlaku untuk PO yang sedang menunggu.');

  // ---------- 5. persiapan: pajak ----------
  s = pres.addSlide({masterName: 'ISI'});
  s.addText('Persiapan: aturan pajak pembelian', {placeholder: 'title'});
  gambar(s, 'pajak', {x: 0.75, y: 1.9, w: 11.85, h: 2.6}, 'Aturan pajak pembelian');
  tabel(s, [['Isian', 'Pilihan', 'Dipakai bila'],
    ['Sumber pajak bawaan', [tb('Ikut master barang SAP')][0], 'Pajak pembelian di master barang sudah benar'],
    ['', [tb('Selalu pakai pajak templat PO (VAT I-E)')][0], 'Master barang belum rapi'],
    ['Ganti kode pajak', 'Kode kiri → kode kanan, mis. VAT I-B → VAT I-E', 'Master barang masih VAT I-B (10%), padahal PPN masukan 11% = VAT I-E']],
    {x: 1.75, y: 4.6, w: 10.85, colW: [2.2, 4.1, 4.55]});
  teks(s, [n('Pengaturan → tab '), b('Templat SAP'), n(' → kartu '), b('Aturan pajak pembelian (PO / GRPO)'), n(', lalu '), b('Simpan aturan pajak'), n('. Aturan ini hanya mengisi bawaan kolom Pajak; admin purchase tetap bisa mengubahnya per baris.')],
    {x: 1.75, y: 6.25, w: 10.85, h: 0.5, fontSize: 12.5, color: K.accent5});
  s.addNotes('Aturan pajak pembelian ada di Pengaturan, tab Templat SAP. Pilih sumber pajak bawaan dan, bila perlu, aturan ganti kode pajak, misalnya VAT I-B ke VAT I-E. Aturan hanya mengisi bawaan kolom pajak. Catatan: approval PO aktif secara bawaan (sakelar dc.po_approval_required); bila dimatikan, PO langsung final di SAP saat diajukan. Sakelar ini belum ada di halaman Pengaturan dan diubah oleh tim IT.');

  // ---------- 6. admin purchase: menemukan permintaan ----------
  pres.addSection({title: 'Admin purchase'});
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Admin purchase'});
  s.addText('Admin purchase · 1. Menemukan permintaan yang siap di-PO', {placeholder: 'title'});
  gambar(s, 'tab_po', {x: 0.75, y: 1.9, w: 6.9, h: 4.8}, 'Tab PO dan panel Purchase Order', [[916, 221, 137, 60, 1], [32, 537, 584, 149, 2], [699, 873, 1370, 129, 3], [1910, 780, 159, 62, 4]]);
  langkah(s, 8.0, 1.95, 4.6, [
    ['Buka Permintaan DC → tab PO', 'atau tab Giliran saya.', 0.62],
    ['Klik permintaan', 'berstatus Buat PO (PUR sudah di SAP dan masih ada sisa) atau PO ditolak.', 0.85],
    ['Baca ringkasan', 'Qty PUR, sudah di-PO, sisa belum di-PO, dan bilah progres. Di bawahnya satu kartu per vendor.', 1.05],
    ['Klik + Buat PO', 'Hanya muncul bila masih ada sisa dan tidak ada PO yang menunggu approval.', 0.85],
  ]);
  s.addNotes('Buka Permintaan DC, tab PO atau Giliran saya, lalu klik permintaan berstatus Buat PO atau PO ditolak. Panel Purchase Order langsung tampil: ringkasan qty PUR, yang sudah di-PO, dan sisanya; kartu PO per vendor; dan tombol + Buat PO. Tabel permintaan bisa dibuka lewat tombol Detail permintaan.');

  // ---------- 7. admin purchase: vendor & barang ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Admin purchase'});
  s.addText('Admin purchase · 2. Pilih vendor dan isi barang', {placeholder: 'title'});
  gambar(s, 'vendor', {x: 0.75, y: 1.9, w: 5.7, h: 4.45}, 'Memilih vendor', [[58, 436, 680, 120, 1]]);
  gambar(s, 'cari', {x: 6.75, y: 1.9, w: 5.85, h: 4.45}, 'Mengisi barang', [[58, 541, 280, 67, 2], [800, 541, 633, 140, 3], [346, 541, 284, 67, 4]]);
  teks(s, [b('1 Vendor: '), n('ketik kode/nama, klik dari daftar SAP; satu PO untuk satu vendor (salah pilih → Ganti vendor).  '),
    b('2 Salin dari PUR: '), n('semua barang bersisa, qty = sisa.  '), b('3 Cari barang PUR: '), n('tambah satu per satu.  '), b('4 Tempel dari Excel. '),
    n('Filter dek dipakai bila PO dibuat per dek.')], {x: 1.75, y: 6.45, w: 10.85, h: 0.55, fontSize: 12});
  s.addNotes('Klik + Buat PO; form selalu mulai kosong. Pilih vendor dari daftar SAP, satu PO untuk satu vendor. Isi barang dengan Salin dari PUR (semua barang yang masih bersisa, qty sama dengan sisa), Cari barang PUR untuk menambah satu per satu, atau Tempel dari Excel. Gunakan filter dek bila PO ingin dibuat per dek.');

  // ---------- 8. admin purchase: periksa & ajukan ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Admin purchase'});
  s.addText('Admin purchase · 3. Periksa tiap baris, lalu simpan atau ajukan', {placeholder: 'title'});
  gambar(s, 'terisi', {x: 0.75, y: 1.9, w: 5.2, h: 4.95}, 'PO terisi', [[636, 636, 222, 510, 1], [886, 636, 196, 510, 2], [1106, 636, 222, 510, 3], [752, 444, 683, 82, 4], [797, 1301, 435, 71, 5]]);
  tabel(s, [['', 'Kolom', 'Aturan'],
    ['1', 'Qty PO', 'Tidak boleh melebihi Sisa (sisa PUR dikurangi PO vendor lain yang masih aktif); melebihi = baris merah'],
    ['2', 'Harga beli (sblm PPN)', 'Terisi dari PO final terakhir vendor itu; ubah bila berbeda; wajib diisi'],
    ['3', 'Pajak', 'Bawaan dari master barang setelah aturan pajak; bisa diubah per baris'],
    ['4', 'Catatan', 'Opsional, mis. “Kirim ke DC Jakarta paling lambat 30 Okt”']],
    {x: 6.25, y: 1.9, w: 6.35, colW: [0.4, 1.75, 4.2], fontSize: 11.5});
  tabel(s, [['5 Tombol', 'Hasil', 'Status PO'],
    [tb('Simpan draft'), 'Tersimpan di web, belum ke SAP; qty sudah dicadangkan', 'Draft'],
    [tb('Ajukan approval'), 'Masuk SAP sebagai Draft, menunggu Approve PO level 1', 'Menunggu approval']],
    {x: 6.25, y: 4.75, w: 6.35, colW: [1.55, 3.3, 1.5], fontSize: 11.5});
  teks(s, 'Tombol tidak aktif bila vendor belum dipilih, belum ada barang, ada baris merah, atau total Rp 0.', {x: 6.25, y: 6.2, w: 6.35, h: 0.5, fontSize: 11.5, color: K.accent5, italic: true});
  s.addNotes('Periksa setiap baris: qty tidak boleh melebihi sisa, harga beli terisi dari PO final terakhir vendor itu dan bisa diubah, pajak bisa diubah per baris. Tambahkan catatan bila perlu dan periksa total di kiri bawah. Simpan draft hanya menyimpan di web dan mencadangkan qty; Ajukan approval mengirim PO ke SAP sebagai Draft dan menunggu Approve PO level 1.');

  // ---------- 9. admin purchase: mengelola sebelum final ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Admin purchase'});
  s.addText('Admin purchase · 4. Mengelola PO sebelum final', {placeholder: 'title'});
  tabel(s, [['Status PO', 'Tombol di kartu', 'Akibat'],
    [tb('Draft'), 'Ubah · Ajukan · Batalkan', 'Ajukan = Draft SAP, approval mulai level 1'],
    [tb('Menunggu approval'), 'Ubah · Batalkan', 'Ubah + Ajukan = Draft SAP diperbarui, approval mulai lagi dari level 1; Ubah + Simpan draft = pengajuan ditarik'],
    [tb('Ditolak', MERAH), 'Ubah & ajukan ulang · Ajukan · Batalkan', 'Alasan penolakan tampil merah di kartu'],
    [tb('Final', HIJAU), 'Lihat', 'Tidak bisa diubah/dibatalkan dari web; lanjut ke tab GRPO'],
    [tb('Dibatalkan', K.accent5), 'Lihat', 'Draft SAP dihapus; qty kembali menjadi sisa PUR']],
    {x: 0.75, y: 1.9, w: 11.85, colW: [2.2, 3.4, 6.25], fontSize: 12.5});
  gambar(s, 'ditolak', {x: 0.75, y: 5.05, w: 6.6, h: 1.4}, 'Kartu PO ditolak', [[886, 122, 226, 55]]);
  teks(s, [b('Beberapa vendor: ', {breakLine: false}), n('buat PO pertama, lalu + Buat PO lagi untuk sisanya. Kolom Sisa sudah dikurangi PO aktif vendor lain, jadi qty tidak bisa dobel.')],
    {x: 7.7, y: 5.1, w: 4.9, h: 1.3, fontSize: 13});
  s.addNotes('Selama belum final, admin purchase yang mengelola PO. Mengubah PO yang menunggu approval membuat approval mulai lagi dari level 1. PO ditolak menampilkan alasan merah dan diperbaiki lewat Ubah & ajukan ulang. PO final tidak bisa diubah atau dibatalkan dari web. Satu PUR boleh dipecah ke beberapa vendor.');

  // ---------- 10. approve PO ----------
  pres.addSection({title: 'Approve PO'});
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Approve PO'});
  s.addText('Approve PO · Temukan, periksa, putuskan', {placeholder: 'title'});
  gambar(s, 'tab_po', {x: 0.75, y: 1.9, w: 5.6, h: 3.9}, 'PO menunggu approval', [[32, 221, 222, 60, 1], [32, 537, 584, 149, 2], [699, 1285, 1370, 215, 3]]);
  langkah(s, 6.7, 1.95, 5.9, [
    ['Tab Giliran saya', 'Permintaan berstatus Approval PO · Draft SAP menunggu Anda (angka di tab = jumlahnya).', 0.62],
    ['Buka permintaannya', 'Kotak Approval PO hanya muncul bila level itu giliran Anda.', 0.62],
    ['Kartu “Menunggu approval · level n” → Lihat', 'Periksa sebelum memutuskan:', 0.55],
  ], 0.1, 13);
  const cek = ['Vendor benar dan aktif di SAP', 'Harga beli wajar dibanding PO sebelumnya', 'Pajak per baris sesuai (mis. VAT I-E 11%, VAT I-C 0%)', 'Qty dan dek sesuai permintaan kapal', 'Catatan pengiriman (tanggal, DC tujuan) jelas'];
  teks(s, cek.map((c, i) => n('✓  ' + c, {breakLine: i < cek.length - 1})), {x: 7.2, y: 4.0, w: 5.4, h: 1.6, fontSize: 12.5, color: K.dk1, paraSpaceAfter: 2});
  gambar(s, 'approval', {x: 0.75, y: 5.95, w: 5.6, h: 1.2}, 'Kotak Approval PO', [[1164, 184, 133, 71], [22, 184, 114, 71]]);
  s.addNotes('Penyetuju membuka tab Giliran saya; permintaan berstatus Approval PO · Draft SAP sedang menunggu. Buka permintaannya, cari kartu PO yang menunggu approval di level Anda, lalu klik Lihat dan periksa vendor, harga, pajak, qty, dek, dan catatan pengiriman.');

  // ---------- 11. setujui / tolak ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Approve PO'});
  s.addText('Approve PO · Setujui atau tolak', {placeholder: 'title'});
  gambar(s, 'approval', {x: 0.75, y: 1.9, w: 11.85, h: 2.05}, 'Kotak Approval PO', [[1164, 184, 133, 71, 1], [22, 112, 1275, 68, 2], [22, 184, 114, 71, 3]]);
  tabel(s, [['Tindakan', 'Cara', 'Hasil'],
    [tb('1 Setujui (belum level terakhir)'), 'Klik Setujui; catatan opsional', 'PO naik ke level berikutnya'],
    [tb('1 Setujui (level terakhir)', HIJAU), 'Klik Setujui', 'Draft SAP dipromosikan menjadi PO final; nomor PO SAP tampil di kartu; PO pindah ke tab GRPO'],
    [tb('2 + 3 Tolak', MERAH), 'Isi Catatan (wajib), klik Tolak', 'Draft SAP dihapus, status Ditolak, qty kembali menjadi sisa; alasan tampil untuk admin purchase']],
    {x: 0.75, y: 4.15, w: 11.85, colW: [3.0, 3.0, 5.85], fontSize: 12.5});
  teks(s, [b('Bila pembuatan PO di SAP gagal: '), n('status kartu menjadi Gagal kirim ke SAP. Setelah penyebabnya diatasi (mis. koneksi SAP pulih), klik Setujui lagi; PO tidak terbuat dobel.')],
    {x: 1.75, y: 6.2, w: 10.85, h: 0.5, fontSize: 12.5});
  s.addNotes('Klik Setujui untuk menaikkan PO ke level berikutnya. Di level terakhir, Draft SAP yang sama menjadi PO final dan nomor PO tampil di web. Untuk menolak, isi catatan alasannya lalu klik Tolak; Draft SAP dihapus dan admin purchase bisa mengubah lalu mengajukan ulang. Bila pembuatan PO di SAP gagal, klik Setujui lagi setelah penyebabnya diatasi.');

  // ---------- 12. pesan galat ----------
  pres.addSection({title: 'Referensi'});
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Referensi'});
  s.addText('Pesan galat dan cara mengatasinya', {placeholder: 'title'});
  tabel(s, [['Pesan', 'Penyebab', 'Cara mengatasi'],
    ['“Qty PO … melebihi sisa PUR …”', 'Sisa sudah dipakai PO vendor lain', 'Kurangi qty, atau batalkan PO lain yang salah'],
    ['“Isi harga beli.”', 'Harga kosong / 0', 'Isi harga sebelum PPN'],
    ['“Pilih vendor.”', 'Vendor belum dipilih', 'Cari dan klik vendor'],
    ['“… sedang menunggu approval PO.”', 'Ada PO lain yang menunggu', 'Tunggu keputusan, atau batalkan PO itu'],
    ['“Purchase Request ini sudah ditutup/dibatalkan di SAP”', 'PUR diproses langsung di SAP', 'Barangnya diterima lewat tab PO dari SAP'],
    ['“Daftar vendor tidak bisa dibaca dari SAP”', 'Koneksi SAP terputus', 'Coba lagi beberapa menit; bila berlanjut hubungi tim IT'],
    ['“Isi alasan penolakan.”', 'Tolak tanpa catatan', 'Isi catatan lalu Tolak lagi']],
    {x: 0.75, y: 1.9, w: 11.85, colW: [4.4, 3.2, 4.25], fontSize: 12.5});
  s.addNotes('Pesan galat yang paling sering muncul beserta penyebab dan cara mengatasinya.');

  // ---------- 13. FAQ ----------
  s = pres.addSlide({masterName: 'ISI', sectionTitle: 'Referensi'});
  s.addText('Pertanyaan yang sering muncul', {placeholder: 'title'});
  const faq = [
    ['Kenapa form PO kosong?', 'Sengaja, supaya hanya barang yang dibeli dari vendor itu yang masuk.'],
    ['Kenapa pajak baris VAT I-B (10%)?', 'Bawaannya dari master barang SAP. Ubah per baris, atau minta admin menambah aturan VAT I-B → VAT I-E.'],
    ['Bisakah PO final dibatalkan dari web?', 'Tidak; batalkan di SAP.'],
    ['Bolehkah mengubah PO yang sudah disetujui level 1?', 'Boleh selama belum final, tetapi approval mulai lagi dari level 1.'],
    ['Dari mana harga beli terisi sendiri?', 'Dari PO final terakhir vendor yang sama untuk barang itu; tetap bisa diubah.'],
    ['Di mana menerima barang setelah PO final?', 'Tab GRPO (admin DC), dijelaskan di panduan GRPO.'],
  ];
  faq.forEach(([q, a], i) => {
    const x = 0.75 + (i % 2) * 6.05, y = 1.9 + Math.floor(i / 2) * 1.5;
    kartu(s, x, y, 5.8, 1.35, `FAQ ${i + 1}`);
    teks(s, [b(q, {breakLine: true}), n(a)], {x: x + 0.3, y: y + 0.18, w: 5.2, h: 1.05, fontSize: 13.5});
  });
  s.addNotes('Pertanyaan yang sering muncul dari admin purchase dan penyetuju PO.');

  // ---------- 14. penutup ----------
  s = pres.addSlide({masterName: 'SAMPUL'});
  s.addText('Terima Kasih', {placeholder: 'title'});
  teks(s, 'Video tutorial dan manual book tersedia untuk dipelajari ulang.', {x: 0.67, y: 3.55, w: 7.6, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF'});
  teks(s, 'PT Pelita Indonesia Djaya (PELNI Services)', {x: 0.67, y: 4.1, w: 7.4, h: 0.4, fontSize: 16, color: 'D6E4F5'});
  s.addNotes('Terima kasih. Untuk belajar ulang, gunakan video tutorial dan manual book Admin Purchase & Approve PO.');

  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
