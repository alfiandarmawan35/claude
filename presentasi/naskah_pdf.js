// Naskah paparan direksi -> PDF A4: gambar tiap halaman deck + naskahnya.
// Pakai: node naskah_pdf.js <folder gambar th-1.jpg..th-9.jpg> <keluaran.pdf>
const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const NASKAH = require('./naskah_direksi.js');
const [dir, out] = process.argv.slice(2);
const font = (w) => path.join(__dirname, '..', 'video-perkenalan', 'pro', 'video', 'assets', 'fonts', `plus-jakarta-sans-latin-${w}-normal.woff2`);

const isi = NASKAH.map((h, i) => `
<section>
  <div class="kepala"><span class="no">${i + 1}</span><h2>${h.judul}</h2><span class="dur">± ${h.durasi}</span></div>
  <img src="file://${path.resolve(dir, `th-${i + 1}.jpg`)}" alt="Halaman ${i + 1}">
  ${h.teks.map((t) => `<p>${t}</p>`).join('')}
</section>`).join('');

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Naskah Paparan Direksi PID POS</title><style>
@font-face{font-family:J;font-weight:500;src:url(file://${font(500)})}
@font-face{font-family:J;font-weight:700;src:url(file://${font(700)})}
@font-face{font-family:J;font-weight:800;src:url(file://${font(800)})}
@page{size:A4;margin:18mm 18mm 20mm}
body{font-family:J,sans-serif;color:#1b2740;font-size:11.5pt;line-height:1.6;margin:0}
.sampul{border-bottom:3px solid #274289;padding-bottom:10mm;margin-bottom:8mm}
.sampul small{color:#5ab4e5;font-weight:700;letter-spacing:.2em;font-size:9pt}
.sampul h1{font-size:26pt;color:#274289;margin:2mm 0 1mm;font-weight:800;line-height:1.15}
.sampul p{margin:0;color:#5b6b86}
.sampul table{margin-top:5mm;border-collapse:collapse;font-size:10pt}
.sampul td{padding:1mm 6mm 1mm 0;color:#5b6b86}.sampul td+td{color:#1b2740;font-weight:700}
section{break-inside:avoid;margin-bottom:9mm}
.kepala{display:flex;align-items:center;gap:3mm;margin-bottom:3mm}
.no{width:8mm;height:8mm;border-radius:2mm;background:#274289;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:11pt;flex:none}
h2{font-size:14pt;color:#274289;margin:0;flex:1;font-weight:800}
.dur{font-size:9.5pt;color:#5b6b86;background:#eef3fa;padding:1mm 3mm;border-radius:2mm;font-weight:700}
img{width:62%;display:block;border:1px solid #dfe6f0;border-radius:2mm;margin:0 0 3mm}
p{margin:0 0 2mm}
</style></head><body>
<div class="sampul"><small>NASKAH PAPARAN</small><h1>PID POS<br>Paparan kepada Direksi</h1><p>PT Pelita Indonesia Djaya (PELNI Services)</p>
<table><tr><td>Jumlah halaman</td><td>${NASKAH.length}</td></tr><tr><td>Perkiraan durasi</td><td>± 9 menit</td></tr></table></div>
${isi}</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  // file:// aset hanya termuat dari halaman file://, jadi HTML ditulis di samping keluaran dulu
  const tmp = out.replace(/\.pdf$/, '') + '.tmp.html';
  fs.writeFileSync(tmp, html);
  await p.goto('file://' + path.resolve(tmp), {waitUntil: 'load'});
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({path: out, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;color:#8a96ab;width:100%;padding:0 18mm;display:flex;justify-content:space-between"><span>Naskah Paparan Direksi · PID POS</span><span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>',
    margin: {top: '18mm', bottom: '20mm', left: '18mm', right: '18mm'}});
  await b.close();
  fs.unlinkSync(tmp);
  console.log(out);
})();
