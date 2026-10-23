// Deck PowerPoint "Alur Lengkap PID POS": dari pesan ke DC sampai Delivery Order.
// Pakai: npm install && node build_alur.js  ->  ../docs/Alur_Lengkap_PID_POS.pptx
// Gambar layar diambil dari motion/public/img (Gambar 1–52 manual book), logo dari motion/public/brand.
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

// Tulis warna dan font tema ke file (pptxgenjs sendiri tidak bisa).
const {applyTheme} = require('./apply_theme.js');

const ROOT = path.resolve(__dirname, '..');
const IMG = (g) => path.join(ROOT, 'motion/public/img', `${g}.png`);
const LOGO = path.join(ROOT, 'motion/public/brand/pelni_services.png');
const OUT = path.join(ROOT, 'docs/Alur_Lengkap_PID_POS.pptx');

// Ukuran gambar layar (px) untuk menjaga rasio.
const DIMS = {};
for (const m of fs.readFileSync(path.join(ROOT, 'motion/src/data/dims.ts'), 'utf8').matchAll(/(g\d+): \[(\d+), (\d+)\]/g)) {
  DIMS[m[1]] = [Number(m[2]), Number(m[3])];
}

const THEME = {
  name: 'PID POS',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1B2437',
    lt1: 'FFFFFF',
    dk2: '1F3B7A', // navy PELNI
    lt2: 'EEF3FB', // biru sangat muda
    accent1: 'FF6B1A', // oranye sinyal
    accent2: '3A7D3A', // hijau setuju
    accent3: '3D8BFF',
    accent4: 'C0392B',
    accent5: '5B6B86',
    accent6: 'D5DEEC',
    hlink: '1F3B7A',
    folHlink: '5B6B86',
  },
};

// Warna peran (sama dengan video).
const ROLE = {
  kapal: {name: 'Admin kapal', akun: 'admin.awu', c: '0F766E', s: 'AK'},
  so: {name: 'Approve SO (P2)', akun: 'approve.so', c: '6D28D9', s: 'SO'},
  dc: {name: 'Admin DC', akun: 'admin.dc.jkt', c: 'EA580C', s: 'DC'},
  pur: {name: 'Approve PUR', akun: 'approve.pur', c: 'BE185D', s: 'PR'},
  purchase: {name: 'Admin purchase', akun: 'admin.purchase', c: '2563EB', s: 'AP'},
  po: {name: 'Approve PO', akun: 'approve.po', c: 'B7791F', s: 'PO'},
  kasir: {name: 'Kasir', akun: 'kasir1.awu', c: '15803D', s: 'KA'},
};

// 9 tahap alur utama (bab 1.2 manual).
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
pres.layout = 'LAYOUT_WIDE'; // 13,33 x 7,5 inci
pres.title = 'Alur Lengkap PID POS';
pres.subject = 'Dari pesan ke DC sampai Delivery Order';
pres.author = 'PID POS';
pres.company = 'PT Pelita Indonesia Djaya';
pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
const C = pres.SchemeColor;
const W = 13.333;

// ---------- layout ----------
const footer = (dark) => [
  {
    text: {
      text: 'PID POS · Alur lengkap · Contoh data uji SAP DB_TEST',
      options: {x: 0.5, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: dark ? C.background2 : C.accent5, margin: 0},
    },
  },
];
pres.defineSlideMaster({
  title: 'JUDUL',
  background: {color: THEME.colors.dk2},
  objects: [
    {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 2.2, w: 8.5, h: 1.6, fontSize: 48, bold: true, color: C.background1, align: 'left', valign: 'top', margin: 0}, text: ''}},
    {placeholder: {options: {name: 'body', type: 'body', x: 0.7, y: 3.9, w: 8.5, h: 1.0, fontSize: 22, color: C.background2, valign: 'top', margin: 0}, text: ''}},
  ],
});
pres.defineSlideMaster({
  title: 'ISI',
  background: {color: THEME.colors.lt1},
  objects: [
    {placeholder: {options: {name: 'title', type: 'title', x: 0.5, y: 0.35, w: 10.4, h: 0.7, fontSize: 34, bold: true, color: C.text2, align: 'left', valign: 'middle', margin: 0}, text: ''}},
    {image: {path: LOGO, x: 11.45, y: 0.38, w: 1.38, h: 0.63}},
    ...footer(false),
  ],
  slideNumber: {x: 12.4, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: THEME.colors.accent5, align: 'right'},
});
pres.defineSlideMaster({
  title: 'PENUTUP',
  background: {color: THEME.colors.dk2},
  objects: [
    {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 0.6, w: 12, h: 1.0, fontSize: 40, bold: true, color: C.background1, align: 'left', valign: 'middle', margin: 0}, text: ''}},
    ...footer(true),
  ],
});

// ---------- bantuan ----------
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
    fill: {color: C.background1}, line: {color: THEME.colors.accent6, width: 1},
    shadow: {type: 'outer', color: '1F3B7A', opacity: 0.18, blur: 8, offset: 3, angle: 90},
    objectName: `${name} bingkai`,
  });
  slide.addImage({path: IMG(g), x, y, w, h, altText: `Gambar layar PID POS (${name})`, objectName: name});
};

const progress = (slide, cur) => {
  const x0 = 0.5;
  const gap = 0.07;
  const total = W - 1.0;
  const curW = 1.95;
  const w = (total - curW - gap * 8) / 8;
  let x = x0;
  TAHAP.forEach((t, k) => {
    const now = k === cur;
    const done = k < cur;
    const ww = now ? curW : w;
    const col = ROLE[t.roles[0]].c;
    slide.addText(`${done ? '✓ ' : ''}${t.label}`, {
      x, y: 1.18, w: ww, h: 0.42,
      shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08,
      fill: {color: now ? col : done ? 'DCE6F5' : THEME.colors.lt1},
      line: {color: now ? col : done ? 'DCE6F5' : THEME.colors.accent6, width: 1},
      color: now ? THEME.colors.lt1 : done ? THEME.colors.dk2 : THEME.colors.accent5,
      fontSize: now ? 13 : 10.5, bold: true, align: 'center', valign: 'middle', margin: 0,
      isTextBox: true, objectName: `Tahap ${k + 1} ${t.label}`,
    });
    x += ww + gap;
  });
};

const roleChip = (slide, r, x, y, w) => {
  const R = ROLE[r];
  slide.addShape(pres.shapes.OVAL, {x, y, w: 0.5, h: 0.5, fill: {color: R.c}, line: {color: R.c}, objectName: `Ikon ${R.name}`});
  slide.addText(R.s, {x, y, w: 0.5, h: 0.5, fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true});
  slide.addText(
    [
      {text: R.name, options: {bold: true, color: R.c, fontSize: 16, breakLine: true}},
      {text: R.akun, options: {color: THEME.colors.accent5, fontSize: 12}},
    ],
    {x: x + 0.62, y: y - 0.05, w: w - 0.62, h: 0.6, valign: 'middle', margin: 0, isTextBox: true, objectName: `Peran ${R.name}`},
  );
};

const sapBox = (slide, items, x, y, w) => {
  const h = 0.36 + items.length * 0.36;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w, h, rectRadius: 0.08, fill: {color: 'E5F4E4'}, line: {color: 'E5F4E4'}, objectName: 'Dokumen SAP'});
  slide.addText(
    [
      {text: items.length ? 'Dokumen SAP yang terbentuk' : 'Belum ada dokumen SAP', options: {bold: true, color: THEME.colors.accent2, fontSize: 12, breakLine: items.length > 0}},
      ...items.map(([n, no], i) => ({
        text: `${n}  ${no}`,
        options: {color: THEME.colors.dk1, fontSize: 14, bold: false, breakLine: i < items.length - 1},
      })),
    ],
    {x: x + 0.18, y, w: w - 0.36, h, valign: 'middle', margin: 0, paraSpaceAfter: 2, isTextBox: true},
  );
};

// ---------- isi ----------
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'tahap.json'), 'utf8'));

// 1. Judul
{
  const s = pres.addSlide({masterName: 'JUDUL'});
  s.addText('Alur Lengkap PID POS', {placeholder: 'title'});
  s.addText('Dari pesan ke DC sampai Delivery Order: 9 tahap, 7 peran, satu permintaan', {placeholder: 'body'});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x: 9.75, y: 0.6, w: 2.9, h: 1.35, rectRadius: 0.12, fill: {color: 'FFFFFF'}, line: {color: 'FFFFFF'}, objectName: 'Kartu logo'});
  s.addImage({path: LOGO, x: 9.95, y: 0.72, w: 2.5, h: 1.15, altText: 'Logo PELNI Services', objectName: 'Logo'});
  s.addText(
    [
      {text: 'Contoh di deck ini', options: {color: 'FF6B1A', bold: true, fontSize: 14, breakLine: true}},
      {text: 'PERMINTAAN-AWU/2610/0008 · KM Awu', options: {color: 'FFFFFF', fontSize: 16, breakLine: true}},
      {text: 'AQUA 6 pcs ke Dek 3 (stok DC) · Teh Pucuk 24 pcs ke Dek 7 (dibeli)', options: {color: 'CADCFC', fontSize: 14}},
    ],
    {x: 0.7, y: 5.4, w: 9, h: 1.1, margin: 0, valign: 'top', isTextBox: true, objectName: 'Contoh permintaan'},
  );
  s.addNotes(DATA.notes.judul);
}

// 2. Peta alur
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('9 tahap dari kapal sampai kasir', {placeholder: 'title'});
  s.addText('Dokumen SAP dibuat setelah tahap persetujuannya selesai. Jalur bawah hanya dijalani bila stok DC kurang.', {
    x: 0.5, y: 1.15, w: 12.3, h: 0.4, fontSize: 15, color: C.accent5, margin: 0, isTextBox: true,
  });
  const pos = {
    pesan: [0.5, 2.1], so: [2.55, 2.1], pilah: [4.6, 2.1], transfer: [7.35, 2.1], terima: [9.4, 2.1], jual: [11.45, 2.1],
    pur: [4.6, 4.55], po: [6.45, 4.55], grpo: [8.3, 4.55],
  };
  const sap = {so: 'Sales Order', pur: 'Purchase Request', po: 'Purchase Order', grpo: 'GRPO', transfer: 'Inventory Transfer', terima: 'SO ditutup', jual: 'Delivery (DO)'};
  const BW = 1.7;
  const BH = 1.3;
  const arrow = (x1, y1, x2, y2, label) => {
    s.addShape(pres.shapes.LINE, {x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
      flipV: y2 < y1, line: {color: THEME.colors.dk2, width: 2, endArrowType: 'triangle'}, objectName: `Panah ${label || ''}`});
  };
  arrow(0.5 + BW, 2.75, 2.55, 2.75);
  arrow(2.55 + BW, 2.75, 4.6, 2.75);
  arrow(4.6 + BW, 2.75, 7.35, 2.75, 'stok ada');
  arrow(7.35 + BW, 2.75, 9.4, 2.75);
  arrow(9.4 + BW, 2.75, 11.45, 2.75);
  arrow(5.45, 2.1 + BH, 5.45, 4.55, 'stok kurang');
  arrow(4.6 + BW, 5.2, 6.45, 5.2);
  arrow(6.45 + BW, 5.2, 8.3, 5.2);
  arrow(9.15, 4.55, 8.2, 2.1 + BH, 'ke transfer');
  s.addText('stok DC ada', {x: 6.3, y: 2.4, w: 1.05, h: 0.3, fontSize: 11, color: C.accent5, align: 'center', margin: 0, isTextBox: true});
  s.addText('stok DC kurang', {x: 3.25, y: 3.75, w: 2.1, h: 0.3, fontSize: 11, color: C.accent5, align: 'right', margin: 0, isTextBox: true});
  TAHAP.forEach((t, k) => {
    const [x, y] = pos[t.id];
    const col = ROLE[t.roles[0]].c;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w: BW, h: BH, rectRadius: 0.1, fill: {color: 'FFFFFF'}, line: {color: col, width: 2.25},
      shadow: {type: 'outer', color: '1F3B7A', opacity: 0.15, blur: 6, offset: 2, angle: 90}, objectName: `Tahap ${t.label}`});
    s.addText(
      [
        {text: `Tahap ${k + 1}`, options: {fontSize: 11, color: col, bold: true, breakLine: true}},
        {text: t.label, options: {fontSize: 15, color: THEME.colors.dk1, bold: true, breakLine: true}},
        {text: t.roles.map((r) => ROLE[r].name.replace(' (P2)', '')).join(' · '), options: {fontSize: 10.5, color: THEME.colors.accent5}},
      ],
      {x: x + 0.12, y: y + 0.08, w: BW - 0.24, h: BH - 0.16, valign: 'top', margin: 0, isTextBox: true},
    );
    if (sap[t.id]) {
      s.addText(`SAP · ${sap[t.id]}`, {x: x - 0.05, y: y + BH + 0.1, w: BW + 0.1, h: 0.32, fontSize: 10.5, bold: true, color: THEME.colors.accent2,
        shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1, fill: {color: 'E5F4E4'}, line: {color: 'E5F4E4'}, align: 'center', valign: 'middle', margin: 0, isTextBox: true});
    }
  });
  s.addNotes(DATA.notes.peta);
}

// 3. Tujuh peran
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('7 peran, masing-masing dengan tugasnya', {placeholder: 'title'});
  const keys = Object.keys(ROLE);
  keys.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.25;
    const y = 1.35 + row * 1.35;
    const w = i === 6 ? 12.33 : 6.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w, h: 1.15, rectRadius: 0.1, fill: {color: THEME.colors.lt2}, line: {color: THEME.colors.lt2}, objectName: `Kartu ${ROLE[r].name}`});
    roleChip(s, r, x + 0.2, y + 0.15, 2.6);
    s.addText(DATA.peran[r], {x: x + 2.95, y: y + 0.1, w: w - 3.15, h: 0.95, fontSize: 14, color: THEME.colors.dk1, valign: 'middle', margin: 0, isTextBox: true});
  });
  s.addNotes(DATA.notes.peran);
}

// 4..12. Satu slide per tahap
DATA.tahap.forEach((t, k) => {
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText(`Tahap ${k + 1} · ${t.judul}`, {placeholder: 'title'});
  progress(s, k);
  fitImage(s, t.img, {x: 0.56, y: 1.92, w: 7.2, h: 4.85}, `Layar ${t.judul}`);
  let y = 1.95;
  t.oleh.forEach((r) => {
    roleChip(s, r, 8.2, y, 4.6);
    y += 0.68;
  });
  s.addText(
    t.langkah.map((l, i) => ({text: l, options: {bullet: {type: 'number'}, breakLine: i < t.langkah.length - 1}})),
    {x: 8.2, y: y + 0.08, w: 4.63, h: 6.75 - y - 0.08 - (0.48 + t.sap.length * 0.36), fontSize: 15, color: THEME.colors.dk1, valign: 'top', paraSpaceAfter: 6, margin: 0, isTextBox: true, objectName: 'Langkah'},
  );
  sapBox(s, t.sap, 8.2, 6.77 - (0.36 + t.sap.length * 0.36), 4.63);
  s.addNotes(t.catatan);
});

// 13. Ringkasan dokumen SAP
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Jejak dokumen SAP satu permintaan', {placeholder: 'title'});
  const head = ['Tahap', 'Disetujui oleh', 'Dokumen SAP', 'Nomor (uji coba)'];
  const rows = [
    head.map((h) => ({text: h, options: {bold: true, color: 'FFFFFF', fill: {color: THEME.colors.dk2}}})),
    ...DATA.dokumen.map((r, i) => r.map((c) => ({text: c, options: {fill: {color: i % 2 ? 'FFFFFF' : THEME.colors.lt2}}}))),
  ];
  s.addTable(rows, {x: 0.5, y: 1.35, w: 12.33, colW: [2.6, 3.0, 3.73, 3.0], fontSize: 14, color: THEME.colors.dk1, rowH: 0.48,
    border: {type: 'solid', color: 'FFFFFF', pt: 1}, valign: 'middle', margin: [0.04, 0.12, 0.04, 0.12], objectName: 'Tabel dokumen SAP'});
  s.addNotes(DATA.notes.dokumen);
}

// 14. Variasi alur
{
  const s = pres.addSlide({masterName: 'ISI'});
  s.addText('Dua variasi alur', {placeholder: 'title'});
  const card = (x, title, chips, text, col) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y: 1.4, w: 6.0, h: 5.2, rectRadius: 0.12, fill: {color: THEME.colors.lt2}, line: {color: THEME.colors.lt2}, objectName: title});
    s.addText(title, {x: x + 0.35, y: 1.65, w: 5.3, h: 0.5, fontSize: 22, bold: true, color: col, margin: 0, isTextBox: true});
    chips.forEach((c, i) => {
      const skip = c.startsWith('~');
      s.addText(skip ? c.slice(1) : c, {x: x + 0.35 + (i % 3) * 1.78, y: 2.45 + Math.floor(i / 3) * 0.6, w: 1.66, h: 0.46, fontSize: 12, bold: true,
        shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, align: 'center', valign: 'middle', margin: 0, isTextBox: true,
        fill: {color: skip ? 'FFFFFF' : col}, color: skip ? 'A7B2C6' : 'FFFFFF', line: {color: skip ? 'D5DEEC' : col, width: 1, dashType: skip ? 'dash' : 'solid'}});
    });
    s.addText(text, {x: x + 0.35, y: 4.45, w: 5.3, h: 1.9, fontSize: 15, color: THEME.colors.dk1, valign: 'top', margin: 0, isTextBox: true});
  };
  card(0.5, 'Semua ada di stok DC', ['Pesan', 'Approval SO', 'Pilah stok', '~PUR', '~PO', '~GRPO', 'Transfer', 'Terima', 'Jual & DO'],
    'Tahap PUR, PO, dan GRPO dilewati. Setelah admin DC memilah, langsung ke Inventory Transfer.', '0F766E');
  card(6.83, 'Sebagian dibeli (contoh deck ini)', ['Pesan', 'Approval SO', 'Pilah stok', 'PUR', 'PO', 'GRPO', 'Transfer', 'Terima', 'Jual & DO'],
    'Semua tahap dijalani. Inventory Transfer menunggu GRPO, lalu dikirim sekali (stok DC + hasil GRPO), tetap satu dokumen per dek.', 'EA580C');
  s.addNotes(DATA.notes.variasi);
}

// 15. Penutup
{
  const s = pres.addSlide({masterName: 'PENUTUP'});
  s.addText('Satu permintaan, satu alur', {placeholder: 'title'});
  const pts = [
    ['Dokumen SAP dibuat setelah disetujui', 'Selama status masih "Approval …", belum ada apa pun di SAP.'],
    ['Lonceng dan Giliran saya', 'Setiap peran langsung melihat tugas yang menunggunya.'],
    ['Tolak selalu dengan alasan', 'Dokumen kembali ke pembuatnya untuk diperbaiki dan diajukan ulang.'],
  ];
  pts.forEach(([h, d], i) => {
    const x = 0.7 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y: 1.95, w: 3.8, h: 2.6, rectRadius: 0.12, fill: {color: '2A4A8F'}, line: {color: '2A4A8F'}, objectName: h});
    s.addText(String(i + 1), {x: x + 0.3, y: 2.15, w: 0.8, h: 0.8, fontSize: 40, bold: true, color: 'FF6B1A', margin: 0, isTextBox: true});
    s.addText([{text: h, options: {bold: true, fontSize: 18, color: 'FFFFFF', breakLine: true}}, {text: d, options: {fontSize: 14, color: 'CADCFC'}}],
      {x: x + 0.3, y: 2.95, w: 3.2, h: 1.5, valign: 'top', margin: 0, paraSpaceAfter: 4, isTextBox: true});
  });
  s.addText(
    [
      {text: 'Video pendamping', options: {bold: true, color: 'FF6B1A', fontSize: 14, breakLine: true}},
      {text: '08_Alur_Lengkap.mp4 (tahap demi tahap, 4 menit) · 01–07 per peran · Manual Book PID POS per Peran', options: {color: 'FFFFFF', fontSize: 14}},
    ],
    {x: 0.7, y: 5.1, w: 12, h: 0.9, margin: 0, valign: 'top', isTextBox: true},
  );
  s.addNotes(DATA.notes.penutup);
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), {recursive: true});
  await pres.writeFile({fileName: OUT});
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
