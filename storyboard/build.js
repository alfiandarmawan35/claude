// Storyboard lima konsep visual kapal (docs/Konsep_Visual_Kapal_PID_POS.md) -> storyboard.html, lalu render.js -> PNG + PDF.
const fs = require('fs');

const C = {navy: '#0b1a3a', biru: '#1f3b7a', garis: '#3d6fc2', muda: '#8fa6d8', oren: '#ff6b1a', putih: '#ffffff', krem: '#e9dcb8'};

// siluet kapal penumpang tampak samping; (x, y) = ujung kiri bawah lambung, w = panjang
function kapal(x, y, w, o = {}) {
  const s = o.stroke || C.putih, sw = o.sw || 2, f = o.fill || 'none', h = w * 0.11;
  const d = (a, b, c) => `M ${x + w * a} ${y - h - c * w} L ${x + w * a} ${y - h - (c + 0.06) * w} L ${x + w * b} ${y - h - (c + 0.06) * w} L ${x + w * b} ${y - h - c * w}`;
  let g = `<g fill="none" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">`;
  g += `<path d="M ${x} ${y - h} L ${x + w} ${y - h} L ${x + w * 0.94} ${y} L ${x + w * 0.07} ${y} Z" fill="${f}"/>`;
  if (!o.lambungSaja) {
    const tingkat = o.tingkat ?? 3, isi = f === 'none' ? 'none' : o.fill2 || f;
    [[0.06, 0.88, 0], [0.14, 0.76, 0.06], [0.22, 0.62, 0.12]].slice(0, tingkat).forEach(([p, q, r]) => { g += `<path d="${d(p, q, r)}" fill="${isi}"/>`; });
    if (tingkat >= 3 && !o.tanpaCerobong) g += `<path d="M ${x + w * 0.4} ${y - h - 0.18 * w} L ${x + w * 0.4} ${y - h - 0.25 * w} L ${x + w * 0.47} ${y - h - 0.25 * w} L ${x + w * 0.47} ${y - h - 0.18 * w}" stroke="${o.cerobong || C.oren}" fill="${o.cerobong && f !== 'none' ? o.cerobong : 'none'}"/>`;
    if (!o.tanpaJendela) g += `<path d="M ${x + w * 0.1} ${y - h - 0.03 * w} L ${x + w * 0.84} ${y - h - 0.03 * w} M ${x + w * 0.18} ${y - h - 0.09 * w} L ${x + w * 0.72} ${y - h - 0.09 * w}" stroke="${o.jendela || s}" stroke-dasharray="${w * 0.018} ${w * 0.014}" stroke-width="${o.jendelaW || sw}"/>`;
  }
  return g + '</g>';
}
const kisi = (warna = 'rgba(255,255,255,.07)', bg = C.navy) => `<rect width="640" height="360" fill="${bg}"/><g stroke="${warna}" stroke-width="1">${[...Array(16)].map((_, i) => `<path d="M ${i * 40} 0 V 360"/>`).join('')}${[...Array(9)].map((_, i) => `<path d="M 0 ${i * 40} H 640"/>`).join('')}</g>`;
const teks = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="Jakarta" font-weight="${o.b || 700}" font-size="${o.s || 14}" fill="${o.c || C.putih}" text-anchor="${o.a || 'start'}" ${o.ls ? `letter-spacing="${o.ls}"` : ''}>${t}</text>`;
const panah = (x1, y1, x2, y2, c = C.oren) => `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${c}" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ujung)"/>`;
const kamera = (t) => `<g><rect x="12" y="12" rx="4" width="${t.length * 7.4 + 26}" height="22" fill="rgba(0,0,0,.45)"/><circle cx="24" cy="23" r="4" fill="${C.oren}"/>${teks(34, 28, t, {s: 11.5, b: 600})}</g>`;
const laut = (y, c = C.garis) => `<path d="M 0 ${y} C 80 ${y - 6}, 160 ${y + 6}, 240 ${y} S 400 ${y - 6}, 480 ${y} S 600 ${y + 6}, 640 ${y}" stroke="${c}" stroke-width="2" fill="none"/>`;
const foto = (f) => `foto/${f}`;

// pulau-pulau Indonesia, sketsa kasar (bukan peta akurat)
const PULAU = [
  'M 40 120 L 70 105 L 120 150 L 160 200 L 175 235 L 160 240 L 120 205 L 80 165 Z',           // Sumatra
  'M 180 250 L 230 245 L 290 252 L 330 258 L 325 268 L 270 266 L 210 262 L 182 260 Z',         // Jawa
  'M 220 120 L 280 95 L 320 110 L 330 160 L 300 200 L 250 205 L 225 175 Z',                   // Kalimantan
  'M 360 140 L 385 130 L 395 150 L 380 165 L 410 175 L 395 185 L 375 180 L 372 215 L 360 220 L 362 180 Z', // Sulawesi
  'M 340 270 L 360 268 L 400 275 L 440 278 L 438 285 L 395 284 L 350 280 Z',                  // Nusa Tenggara
  'M 460 180 L 470 170 L 480 185 L 470 195 Z M 440 150 L 452 145 L 455 160 L 444 162 Z',        // Maluku
  'M 500 165 L 540 150 L 600 165 L 620 200 L 615 250 L 570 245 L 540 215 L 505 195 Z',          // Papua
];
const pulau = (c = '#173064', s = C.garis) => PULAU.map((d) => `<path d="${d}" fill="${c}" stroke="${s}" stroke-width="1.2"/>`).join('');
const PELABUHAN = {Priok: [205, 250], Surabaya: [292, 258], Makassar: [366, 214], Belawan: [72, 120], Bitung: [404, 152], Ambon: [470, 186], Sorong: [512, 172], Jayapura: [610, 182], Balikpapan: [318, 168]};
const titik = (n, o = {}) => { const [x, y] = PELABUHAN[n]; return `<circle cx="${x}" cy="${y}" r="${o.r || 4}" fill="${o.c || C.putih}"/>${o.label ? teks(x + 7, y - 6, n, {s: 10, c: C.muda, b: 600}) : ''}`; };
const rute = (a, b, o = {}) => { const [x1, y1] = PELABUHAN[a], [x2, y2] = PELABUHAN[b]; const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (o.lengkung || 25); return `<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" fill="none" stroke="${o.c || C.oren}" stroke-width="${o.w || 2.2}" ${o.putus ? 'stroke-dasharray="5 5"' : ''} opacity="${o.op || 1}"/>`; };

// kotak isometrik (maket)
function iso(x, y, w, d, h, warna) {
  const [a, b, c] = warna, dx = w * 0.866, dy = w * 0.5, ex = d * 0.866, ey = d * 0.5;
  return `<path d="M ${x} ${y} L ${x + dx} ${y + dy} L ${x + dx} ${y + dy - h} L ${x} ${y - h} Z" fill="${a}"/>` +
    `<path d="M ${x + dx} ${y + dy} L ${x + dx + ex} ${y + dy - ey} L ${x + dx + ex} ${y + dy - ey - h} L ${x + dx} ${y + dy - h} Z" fill="${b}"/>` +
    `<path d="M ${x} ${y - h} L ${x + dx} ${y + dy - h} L ${x + dx + ex} ${y + dy - ey - h} L ${x + ex} ${y - ey - h} Z" fill="${c}"/>`;
}
const orang = (x, y, c = C.oren) => `<circle cx="${x}" cy="${y - 16}" r="4.5" fill="${c}"/><path d="M ${x - 5} ${y} L ${x - 4} ${y - 10} Q ${x} ${y - 13} ${x + 4} ${y - 10} L ${x + 5} ${y} Z" fill="${c}"/>`;
function maket(x, y, s, buka = 0) {
  // lambung kuning-putih, dek bertingkat; buka = 0..1 atap dek atas terangkat
  let g = iso(x, y, 260 * s, 70 * s, 34 * s, ['#c9b07a', '#b39a66', '#e9dcb8']);
  g += iso(x + 20 * s, y - 34 * s + 10 * s, 210 * s, 50 * s, 26 * s, ['#e8edf5', '#cdd6e4', '#ffffff']);
  if (buka < 1) g += iso(x + 40 * s, y - 60 * s + 20 * s, 160 * s, 34 * s, 22 * s, ['#e8edf5', '#cdd6e4', '#ffffff']);
  else g += `<g transform="translate(0 ${-60 * s})" opacity=".9">${iso(x + 40 * s, y - 60 * s + 20 * s, 160 * s, 34 * s, 6 * s, ['#e8edf5', '#cdd6e4', '#ffffff'])}</g>`;
  g += iso(x + 120 * s, y - 82 * s + 50 * s, 22 * s, 18 * s, 30 * s, ['#e0661c', '#c85a1c', '#ff8a45']);
  return g;
}

const KONSEP = [
  {
    no: 1, judul: 'Cetak Biru Kapal', durasi: '± 8 detik', saran: true,
    ide: 'Kapal digambar sebagai cetak biru teknis, lalu terbelah per dek untuk menunjukkan toko dan kasir di setiap dek.',
    panel: [
      {t: '0:00 – 0:02', judul: 'Garis lambung tergambar', svg: kisi() + kapal(100, 270, 440, {sw: 1.6, tanpaJendela: true}).replace('<g ', '<g stroke-dasharray="900" stroke-dashoffset="330" ') +
        `<path d="M 100 300 L 540 300" stroke="${C.muda}" stroke-width="1"/><path d="M 100 294 V 306 M 540 294 V 306" stroke="${C.muda}"/>` + teks(320, 322, 'LOA ± — m', {s: 11, c: C.muda, a: 'middle', b: 600}) +
        teks(560, 205, 'HALUAN', {s: 10, c: C.muda, a: 'end', ls: 2}) + `<circle cx="398" cy="225" r="5" fill="${C.oren}"/>` + kamera('DIAM · garis digambar'),
        vis: 'Latar navy berkisi. Garis putih tipis menggambar lambung dari buritan ke haluan, dengan label ukuran ala gambar teknik.', audio: 'Nada pad rendah, desis pena halus.', teks: '—'},
      {t: '0:02 – 0:04', judul: 'Lambung terbelah per dek', svg: kisi() +
        kapal(100, 320, 440, {lambungSaja: true, sw: 1.6}) +
        [['DEK 7 · KANTOR', 0.22, 0.62, 95], ['DEK 5 · KASIR', 0.14, 0.76, 160], ['DEK 3 · TOKO', 0.06, 0.88, 225]].map(([l, a, b, yy]) =>
          `<rect x="${100 + 440 * a}" y="${yy}" width="${440 * (b - a)}" height="34" fill="rgba(61,111,194,.18)" stroke="${C.putih}" stroke-width="1.6"/>` + teks(100 + 440 * a + 10, yy + 22, l, {s: 11, ls: 1.5})).join('') +
        panah(590, 250, 590, 120, C.muda) + kamera('KAMERA MAJU PELAN'),
        vis: 'Dek-dek bergeser ke atas satu per satu seperti laci terbuka, masing-masing diberi label.', audio: 'Tiga bunyi “klik” mekanis, satu per dek.', teks: 'Satu kapal, banyak titik jual.'},
      {t: '0:04 – 0:06', judul: 'Masuk ke Dek 5', svg: kisi() +
        `<rect x="60" y="80" width="520" height="210" fill="rgba(61,111,194,.15)" stroke="${C.putih}" stroke-width="1.6"/>` + teks(76, 104, 'DEK 5 · KASIR', {s: 12, ls: 1.5}) +
        `<rect x="90" y="130" width="180" height="120" rx="10" fill="${C.putih}"/>` + teks(104, 158, 'Stok dek', {s: 13, c: C.navy, b: 800}) +
        teks(104, 186, 'Air mineral', {s: 12, c: C.biru}) + teks(256, 186, '120 → 118', {s: 12, c: C.oren, a: 'end', b: 800}) +
        teks(104, 212, 'Mi instan', {s: 12, c: C.biru}) + teks(256, 212, '64 → 63', {s: 12, c: C.oren, a: 'end', b: 800}) +
        `<rect x="330" y="140" width="110" height="80" rx="8" fill="none" stroke="${C.oren}" stroke-width="3"/><rect x="345" y="155" width="80" height="40" rx="4" fill="${C.oren}" opacity=".35"/>` + teks(385, 240, 'KASIR', {s: 11, a: 'middle', c: C.oren, ls: 2}) +
        `<circle cx="500" cy="180" r="34" fill="none" stroke="${C.putih}" stroke-width="2"/>` + teks(500, 186, 'SAP', {s: 16, a: 'middle', b: 800}) + panah(445, 180, 462, 180) + kamera('ZOOM KE DEK 5'),
        vis: 'Kamera masuk ke satu dek. Angka stok berkurang saat barang terjual, kasir menyala oranye, dan data mengalir ke SAP.', audio: 'Bunyi “bip” scan, tik angka.', teks: 'Stok tiap dek tercatat langsung.'},
      {t: '0:06 – 0:08', judul: 'Kapal utuh, lampu menyala', svg: kisi() + `<circle cx="320" cy="200" r="190" fill="rgba(61,111,194,.18)"/>` +
        kapal(110, 265, 420, {sw: 2.2, jendela: C.oren, jendelaW: 3.5}) + laut(285) + laut(305, '#2a4f94') +
        teks(320, 70, 'Setiap dek, satu sistem.', {s: 26, a: 'middle', b: 800}) + kamera('KAMERA MUNDUR'),
        vis: 'Dek kembali menyatu. Jendela menyala oranye satu per satu dari buritan ke haluan, dan laut garis muncul.', audio: 'Akor terbuka, nada naik.', teks: 'Setiap dek, satu sistem.'},
    ],
  },
  {
    no: 2, judul: 'Peta Arus Nusantara', durasi: '± 10 detik',
    ide: 'Peta Indonesia gelap; rute kapal menyala dan bergerak. Saat kapal sandar, muncul kartu alur aplikasi.',
    panel: [
      {t: '0:00 – 0:02', judul: 'Nusantara muncul', svg: kisi('rgba(255,255,255,.04)', '#07122b') + pulau() + Object.keys(PELABUHAN).map((n) => titik(n, {r: 3, c: C.muda})).join('') + kamera('DIAM · DARI ATAS'),
        vis: 'Pulau-pulau muncul dari gelap sebagai bidang navy dengan garis tepi biru. Titik pelabuhan berkedip pelan.', audio: 'Pad lebar, desir angin laut.', teks: '—'},
      {t: '0:02 – 0:05', judul: 'Rute menyala', svg: kisi('rgba(255,255,255,.04)', '#07122b') + pulau() +
        rute('Priok', 'Belawan', {lengkung: -40}) + rute('Priok', 'Surabaya') + rute('Surabaya', 'Makassar') + rute('Makassar', 'Bitung', {lengkung: -30}) + rute('Makassar', 'Ambon') + rute('Ambon', 'Sorong') + rute('Sorong', 'Jayapura', {lengkung: -20}) + rute('Surabaya', 'Balikpapan', {lengkung: -10}) +
        Object.keys(PELABUHAN).map((n) => titik(n, {r: 3.5})).join('') + `<circle cx="330" cy="236" r="6" fill="${C.oren}"/><circle cx="330" cy="236" r="12" fill="none" stroke="${C.oren}" opacity=".5"/><circle cx="440" cy="196" r="6" fill="${C.oren}"/>` + kamera('PAN PELAN KE TIMUR'),
        vis: 'Garis rute oranye mengalir antarpelabuhan. Titik cahaya (kapal) bergerak di sepanjang rute.', audio: 'Denyut bas mulai, petikan tiap kapal sandar.', teks: 'Dari barat sampai timur.'},
      {t: '0:05 – 0:08', judul: 'Kapal sandar → alur aplikasi', svg: kisi('rgba(255,255,255,.04)', '#07122b') + `<g transform="translate(-420 -170) scale(2.1)">${pulau()}${rute('Surabaya', 'Makassar')}${rute('Makassar', 'Ambon')}${titik('Makassar', {r: 3})}</g>` +
        `<circle cx="349" cy="280" r="14" fill="${C.oren}"/><circle cx="349" cy="280" r="26" fill="none" stroke="${C.oren}" stroke-width="2"/>` + teks(372, 302, 'Makassar', {s: 13, c: C.muda}) +
        `<rect x="380" y="70" width="220" height="120" rx="12" fill="${C.putih}"/>` + teks(398, 100, 'KM — · Dek 5', {s: 12, c: C.muda, b: 700}) + teks(398, 128, 'Pesan ke DC', {s: 16, c: C.navy, b: 800}) +
        `<rect x="398" y="146" width="44" height="22" rx="5" fill="#4a8a3c"/>` + teks(420, 162, 'SO', {s: 12, a: 'middle', b: 800}) + teks(452, 162, 'terbentuk di SAP', {s: 12, c: C.biru}) + panah(372, 268, 430, 196) + kamera('ZOOM KE PELABUHAN'),
        vis: 'Kamera turun ke satu pelabuhan. Titik kapal berhenti dan berdenyut. Kartu putih muncul: “Pesan ke DC → SO terbentuk di SAP”.', audio: 'Bunyi notifikasi lembut.', teks: '—'},
      {t: '0:08 – 0:10', judul: 'Satu jaringan', svg: kisi('rgba(255,255,255,.04)', '#07122b') + `<g opacity=".55">${pulau()}</g>` +
        [['Priok', 'Belawan', -40], ['Priok', 'Surabaya', 25], ['Surabaya', 'Makassar', 25], ['Makassar', 'Bitung', -30], ['Makassar', 'Ambon', 25], ['Ambon', 'Sorong', 25], ['Sorong', 'Jayapura', -20], ['Surabaya', 'Balikpapan', -10], ['Priok', 'Makassar', -60], ['Bitung', 'Sorong', -30]].map(([a, b, l]) => rute(a, b, {lengkung: l, w: 2.6})).join('') +
        Object.keys(PELABUHAN).map((n) => titik(n, {r: 4})).join('') + teks(320, 60, 'Satu jaringan, satu data.', {s: 24, a: 'middle', b: 800}) + kamera('KAMERA MUNDUR'),
        vis: 'Kamera mundur; semua rute menyala bersamaan, peta meredup sedikit agar judul terbaca.', audio: 'Hantaman ringan, akor naik.', teks: 'Satu jaringan, satu data.'},
    ],
    catatan: 'Pelabuhan dan rute di sketsa hanya contoh. Versi final mengikuti jadwal resmi PELNI.',
  },
  {
    no: 3, judul: 'Diorama Isometrik', durasi: '± 10 detik',
    ide: 'Kapal sebagai maket mini di atas meja. Atap dek dibuka dan terlihat kru kecil yang bekerja dengan PID POS.',
    panel: [
      {t: '0:00 – 0:03', judul: 'Maket di atas meja', svg: `<rect width="640" height="360" fill="#eef3fa"/><ellipse cx="320" cy="270" rx="250" ry="45" fill="#d5deec"/><path d="M 0 250 L 640 250" stroke="#e0e7f2"/>` +
        `<path d="M 90 255 L 320 300 L 560 225" fill="none" stroke="#9fc4e6" stroke-width="10" stroke-linecap="round" opacity=".7"/>` + maket(130, 250, 1) + kamera('ORBIT PELAN 15°'),
        vis: 'Latar terang. Maket kapal kuning-putih berdiri di atas “laut” biru di meja, dengan bayangan lembut.', audio: 'Marimba ringan, suara ombak kecil.', teks: '—'},
      {t: '0:03 – 0:05', judul: 'Atap dek terangkat', svg: `<rect width="640" height="360" fill="#eef3fa"/><ellipse cx="320" cy="270" rx="250" ry="45" fill="#d5deec"/>` + maket(130, 250, 1, 1) +
        panah(330, 80, 330, 40, C.oren) + `<rect x="180" y="150" width="20" height="14" fill="#ff8a45"/><rect x="250" y="160" width="20" height="14" fill="#5ab4e5"/>` + kamera('DIAM'),
        vis: 'Atap dek atas terangkat seperti tutup kotak, memperlihatkan isi dek: rak toko dan meja kasir mini.', audio: 'Bunyi “pop” kayu.', teks: '—'},
      {t: '0:05 – 0:08', judul: 'Kru kecil bekerja', svg: `<rect width="640" height="360" fill="#eef3fa"/>` + iso(80, 300, 380, 120, 10, ['#e8edf5', '#cdd6e4', '#ffffff']) +
        iso(150, 250, 60, 30, 40, ['#5b6b86', '#46546d', '#7c8aa3']) + iso(330, 230, 70, 34, 28, ['#c85a1c', '#a8460f', '#ff8a45']) +
        orang(240, 255, C.biru) + orang(300, 240, C.oren) + orang(420, 265, '#4a8a3c') + `<rect x="412" y="270" width="26" height="14" fill="#c9b07a"/><circle cx="415" cy="287" r="3" fill="#333"/><circle cx="435" cy="287" r="3" fill="#333"/>` +
        `<rect x="350" y="150" width="120" height="44" rx="8" fill="${C.putih}" stroke="#d5deec"/>` + teks(362, 170, 'Scan · Bayar', {s: 12, c: C.navy, b: 800}) + teks(362, 186, 'QRIS / tunai', {s: 11, c: C.muda}) + kamera('ZOOM KE DEK'),
        vis: 'Close-up isi dek: admin memindai rak, kasir melayani pembeli, troli barang naik dari dermaga.', audio: 'Bip scan, kertas struk.', teks: 'Kasir di setiap dek.'},
      {t: '0:08 – 0:10', judul: 'Maket utuh + logo', svg: `<rect width="640" height="360" fill="#eef3fa"/><ellipse cx="320" cy="285" rx="230" ry="40" fill="#d5deec"/>` + maket(160, 270, 0.85) +
        `<rect x="170" y="40" width="300" height="60" rx="14" fill="${C.putih}" stroke="#d5deec"/>` + teks(320, 79, 'PID POS', {s: 26, a: 'middle', c: C.biru, b: 800}) + kamera('KAMERA NAIK'),
        vis: 'Atap kembali tertutup, kamera naik, kartu PID POS muncul di atas maket.', audio: 'Akor penutup ceria.', teks: 'PID POS di setiap dek.'},
    ],
    catatan: 'Nada santai: cocok untuk sosialisasi internal dan media sosial, kurang cocok untuk paparan direksi.',
  },
  {
    no: 4, judul: 'Rekam Sendiri (Footage Kru)', durasi: '± 12 detik',
    ide: 'Rekaman ponsel kru kapal mengikuti daftar gambar. Storyboard ini menjadi panduan saat merekam.',
    panel: [
      {t: '0:00 – 0:03', judul: 'Fajar dari haluan', svg: `<defs><linearGradient id="fajar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3b7a"/><stop offset=".6" stop-color="#ff8a45"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs><rect width="640" height="360" fill="url(#fajar)"/>` +
        `<circle cx="320" cy="215" r="34" fill="#fff2c4"/><rect y="215" width="640" height="145" fill="#16305e"/><path d="M 320 360 L 230 215 L 410 215 Z" fill="#e9edf3" opacity=".0"/>` +
        `<path d="M 170 360 L 300 230 L 340 230 L 470 360 Z" fill="#e9dcb8"/><path d="M 300 230 L 340 230" stroke="#c9b07a" stroke-width="4"/>` + kamera('POV HALUAN · DIAM, TANPA ZOOM'),
        vis: 'Ponsel di dek atas menghadap ke depan, haluan kapal membelah laut saat matahari terbit.', audio: 'Suara asli angin + musik masuk pelan.', teks: '—'},
      {t: '0:03 – 0:06', judul: 'Lorong menuju toko', svg: `<rect width="640" height="360" fill="#3a3326"/><path d="M 0 0 L 250 120 L 390 120 L 640 0 Z" fill="#5a4f3c"/><path d="M 0 360 L 250 240 L 390 240 L 640 360 Z" fill="#7a6a4e"/>` +
        `<path d="M 0 0 L 250 120 L 250 240 L 0 360 Z" fill="#4a4131"/><path d="M 640 0 L 390 120 L 390 240 L 640 360 Z" fill="#4a4131"/><rect x="250" y="120" width="140" height="120" fill="#f3e3b5"/>` +
        `<rect x="280" y="140" width="80" height="22" fill="${C.biru}"/>` + teks(320, 156, 'TOKO', {s: 13, a: 'middle', b: 800}) + panah(320, 300, 320, 255, C.putih) + kamera('BERJALAN PELAN · SETINGGI DADA'),
        vis: 'Berjalan pelan menyusuri lorong dek menuju toko. Papan “TOKO” terlihat di ujung.', audio: 'Langkah kaki, dengung mesin kapal.', teks: '—'},
      {t: '0:06 – 0:09', judul: 'Scan & struk (close-up)', svg: `<rect width="640" height="360" fill="#d9dee8"/><rect x="60" y="70" width="330" height="220" rx="16" fill="#1a2132"/><image href="${foto('g45.png')}" x="72" y="82" width="306" height="196" preserveAspectRatio="xMidYMid slice"/>` +
        `<rect x="430" y="150" width="140" height="150" rx="10" fill="#2b2b2b"/><rect x="455" y="60" width="90" height="120" fill="#fff"/>` + [80, 98, 116, 134].map((y) => `<path d="M 465 ${y} H 535" stroke="#999" stroke-width="3"/>`).join('') +
        `<path d="M 405 120 Q 420 110 440 125" stroke="${C.oren}" stroke-width="3" fill="none"/>` + kamera('CLOSE-UP · LAYAR TERLIHAT JELAS'),
        vis: 'Tangan memindai barcode, layar kasir PID POS terlihat; lanjut struk keluar dari printer.', audio: 'Bip scan, suara printer struk.', teks: 'Scan, bayar, selesai.'},
      {t: '0:09 – 0:12', judul: 'Sandar saat senja (+ drone bila ada)', svg: `<defs><linearGradient id="senja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2f6b"/><stop offset=".7" stop-color="#e2704a"/></linearGradient></defs><rect width="640" height="360" fill="url(#senja)"/><rect y="250" width="640" height="110" fill="#1d2754"/>` +
        kapal(120, 262, 400, {fill: '#e9dcb8', fill2: '#f4f1ea', stroke: '#1d2754', sw: 1.4, cerobong: C.oren, jendela: '#ffcf6b', jendelaW: 3}) + `<rect x="0" y="262" width="640" height="10" fill="#555"/>` + kamera('DARI DERMAGA · DIAM 10 DETIK'),
        vis: 'Kapal sandar di pelabuhan saat senja, lampu kapal mulai menyala. Bila ada drone: terbang lurus pelan di atas buritan.', audio: 'Musik penuh, akor penutup.', teks: 'PID POS · dari kapal sampai kasir.'},
    ],
    catatan: 'Rekam 4K 30 fps, horizontal, ponsel stabil. Wajah penumpang dihindari atau dimintakan izin.',
  },
  {
    no: 5, judul: 'Foto Jadi Bergerak (Parallax 2.5D)', durasi: '± 8 detik',
    ide: 'Foto kapal PELNI dipisah per lapisan (langit, kapal, laut) dan digerakkan dengan kedalaman sehingga terasa seperti rekaman kamera.',
    panel: [
      {t: '0:00 – 0:02', judul: 'Foto dipisah per lapisan', svg: `<rect width="640" height="360" fill="#0b1a3a"/>` +
        `<g transform="translate(40 20)"><image href="${foto('New_Livery_kapal_PELNI.jpg')}" width="300" height="225" opacity=".35"/></g><g transform="translate(150 70)"><image href="${foto('New_Livery_kapal_PELNI.jpg')}" width="300" height="225" opacity=".7"/></g>` +
        `<g transform="translate(260 120)"><image href="${foto('New_Livery_kapal_PELNI.jpg')}" width="300" height="225"/></g>` +
        teks(48, 262, 'LANGIT', {s: 11, c: C.muda, ls: 2}) + teks(158, 312, 'KAPAL', {s: 11, c: C.muda, ls: 2}) + teks(268, 362, 'LAUT', {s: 11, c: C.muda, ls: 2}).replace('362', '352') + kamera('DIAGRAM LAPISAN'),
        vis: 'Foto KM Kelud (livery biru) dipotong menjadi tiga lapisan: langit, kapal, dan laut.', audio: '—', teks: '—', kredit: 'Foto: Mybottle6969, CC BY-SA 4.0'},
      {t: '0:02 – 0:04', judul: 'Dorong masuk dengan kedalaman', svg: `<image href="${foto('New_Livery_kapal_PELNI.jpg')}" x="-40" y="-40" width="720" height="540" preserveAspectRatio="xMidYMid slice"/>` +
        `<rect width="640" height="360" fill="url(#vignet)"/>` + panah(120, 300, 70, 330, C.putih) + panah(520, 300, 570, 330, C.putih) + `<rect x="240" y="300" width="160" height="40" rx="8" fill="rgba(11,26,58,.8)"/>` + teks(320, 328, 'KM Kelud', {s: 22, a: 'middle', b: 800}) + kamera('PUSH-IN PELAN · LAPISAN BERGESER'),
        vis: 'Kamera maju pelan; laut bergeser lebih cepat dari kapal, langit paling lambat. Nama kapal muncul.', audio: 'Ombak + pad.', teks: 'KM Kelud', kredit: 'Foto: Mybottle6969, CC BY-SA 4.0'},
      {t: '0:04 – 0:06', judul: 'Kios TOKO → layar kasir', svg: `<image href="${foto('Pelni_Bordkiosk.jpg')}" x="0" y="0" width="320" height="360" preserveAspectRatio="xMidYMid slice"/>` +
        `<rect x="320" width="320" height="360" fill="#eef2f8"/><image href="${foto('g45.png')}" x="330" y="90" width="300" height="180" preserveAspectRatio="xMidYMid slice"/>` +
        `<path d="M 320 0 V 360" stroke="${C.oren}" stroke-width="6"/>` + teks(160, 340, 'DULU', {s: 14, a: 'middle', ls: 3}) + teks(480, 340, 'KINI · PID POS', {s: 14, a: 'middle', c: C.biru, ls: 3}) + kamera('WIPE KE KANAN'),
        vis: 'Foto kios “TOKO” di dalam kapal disapu garis oranye dan berganti menjadi layar kasir PID POS.', audio: 'Whoosh, bip scan.', teks: 'Toko kapal, kini terhubung.', kredit: 'Foto kios: Maximilian Dörrbecker, CC BY-SA 3.0'},
      {t: '0:06 – 0:08', judul: 'Senja + kartu penutup', svg: `<image href="${foto('KM_Tilong_Kabila_Benoa.jpg')}" x="0" y="0" width="640" height="360" preserveAspectRatio="xMidYMid slice"/><rect width="640" height="360" fill="rgba(11,26,58,.6)"/>` +
        `<rect x="150" y="130" width="340" height="80" rx="16" fill="${C.putih}"/>` + teks(320, 182, 'PID POS', {s: 34, a: 'middle', c: C.biru, b: 800}) + teks(320, 250, 'Satu alur, dari kapal sampai kasir.', {s: 16, a: 'middle'}) + kamera('PAN PELAN KE KANAN'),
        vis: 'Foto KM Tilong Kabila di Benoa sedikit digelapkan; kartu PID POS dan tagline muncul.', audio: 'Akor penutup.', teks: 'Satu alur, dari kapal sampai kasir.', kredit: 'Foto: Sabung.hamster, CC BY-SA 4.0'},
    ],
    catatan: 'Kredit foto wajib dicantumkan di akhir video. Foto arsip humas PELNI lebih disarankan untuk versi resmi.',
  },
];

function tulis(konsep, judulDok, berkas, catatanBawaan = 'Semua aset digambar sendiri; tidak memerlukan footage stok.') {
const halaman = konsep.map((k) => `
<section class="hal">
  <header>
    <div class="no">${k.no}</div>
    <div class="kepala"><h1>${k.judul}${k.saran ? ' <span class="saran">Rekomendasi</span>' : ''}</h1><p>${k.ide}</p></div>
    <div class="durasi">${k.durasi}</div>
  </header>
  <div class="grid">
    ${k.panel.map((p, i) => `
    <figure>
      <div class="bingkai"><svg viewBox="0 0 640 360"><defs><marker id="ujung" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.oren}"/></marker><radialGradient id="vignet" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>${p.svg}</svg>${p.kredit ? `<span class="kredit">${p.kredit}</span>` : ''}</div>
      <figcaption>
        <div class="baris1"><b>Shot ${k.no}.${i + 1}</b><span>${p.t}</span></div>
        <h2>${p.judul}</h2>
        <p>${p.vis}</p>
        <dl><dt>Teks layar</dt><dd>${p.teks}</dd><dt>Audio</dt><dd>${p.audio}</dd></dl>
      </figcaption>
    </figure>`).join('')}
  </div>
  <footer><span>${k.catatan || catatanBawaan}</span><span>${judulDok} · PID POS · ${k.no}/${konsep.length}</span></footer>
</section>`).join('');

const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${judulDok}</title><style>
@font-face{font-family:Jakarta;font-weight:600;src:url(foto/plus-jakarta-sans-latin-600-normal.woff2)}
@font-face{font-family:Jakarta;font-weight:700 800;src:url(foto/plus-jakarta-sans-latin-800-normal.woff2)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Jakarta,sans-serif;background:#dfe5ef;color:#0b1a3a}
.hal{width:1600px;height:1320px;background:#fff;padding:36px 44px 24px;display:flex;flex-direction:column;page-break-after:always;margin:0 auto 24px}
header{display:flex;align-items:center;gap:22px;margin-bottom:20px}
.no{width:64px;height:64px;border-radius:16px;background:#1f3b7a;color:#fff;font-weight:800;font-size:34px;display:flex;align-items:center;justify-content:center;flex:none}
.kepala{flex:1}.kepala h1{font-size:32px;font-weight:800;color:#1f3b7a;letter-spacing:-.01em}.kepala p{font-size:16px;color:#5b6b86;margin-top:4px}
.saran{font-size:14px;background:#ff6b1a;color:#fff;padding:4px 12px;border-radius:20px;vertical-align:middle;margin-left:8px}
.durasi{font-weight:800;font-size:18px;color:#1f3b7a;background:#eef3fa;padding:10px 18px;border-radius:12px}
.grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px}
figure{display:flex;flex-direction:column;background:#f5f8fc;border:1px solid #e1e8f2;border-radius:14px;overflow:hidden}
.bingkai{position:relative;aspect-ratio:16/9;background:#0b1a3a}.bingkai svg{display:block;width:100%;height:100%}
.kredit{position:absolute;right:6px;bottom:4px;font-size:10px;color:#fff;background:rgba(0,0,0,.5);padding:1px 6px;border-radius:4px}
figcaption{padding:14px 18px;display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:auto auto 1fr;column-gap:24px;row-gap:6px;flex:1}
.baris1,figcaption h2,figcaption p{grid-column:1}dl{grid-column:2;grid-row:1/4}
.baris1{display:flex;justify-content:space-between;font-size:13px;color:#5b6b86}.baris1 b{color:#ff6b1a;font-weight:800}
figcaption h2{font-size:18px;font-weight:800;color:#1f3b7a;line-height:1.2}
figcaption p{font-size:14px;line-height:1.45;color:#2b3a55}
dl{display:grid;grid-template-columns:auto 1fr;align-content:start;gap:6px 10px;font-size:14px;border-left:1px solid #e1e8f2;padding-left:18px}
dt{color:#5b6b86;font-weight:700}dd{color:#0b1a3a}
footer{display:flex;justify-content:space-between;font-size:13px;color:#5b6b86;margin-top:16px}
@page{size:1600px 1320px;margin:0}@media print{body{background:#fff}.hal{margin:0}}
</style></head><body>${halaman}</body></html>`;
fs.writeFileSync(__dirname + '/' + berkas, html);
console.log(berkas);
}

module.exports = {C, kapal, kisi, teks, panah, kamera, laut, foto, pulau, titik, rute, iso, orang, maket, PELABUHAN, tulis};
if (require.main === module) tulis(KONSEP, 'Storyboard Konsep Visual Kapal', 'storyboard.html');
