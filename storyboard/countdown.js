// Storyboard konsep countdown peluncuran (15 detik) -> countdown.html, lalu: node render.js countdown.html Storyboard_Konsep_Countdown
const {C, kapal, kisi, teks, kamera, laut, pulau, titik, rute, PELABUHAN, tulis} = require('./build');

const T = ['0:00 – 0:02 · pembuka', '0:02 – 0:07 · angka 10 → 6', '0:07 – 0:12 · angka 5 → 1', '0:12 – 0:15 · nol, peluncuran'];
const logo = (x = 486, y = 14, gelap = false) => `<rect x="${x}" y="${y}" width="140" height="26" rx="6" fill="${gelap ? C.navy : C.putih}"/>` + teks(x + 70, y + 17, 'Danantara | PELNI', {s: 10, a: 'middle', c: gelap ? C.putih : C.navy, b: 800});
const angka = (x, y, n, o = {}) => teks(x, y, n, {s: o.s || 120, a: 'middle', b: 800, c: o.c || C.putih});
const tanggal = (y = 340, c = C.putih) => teks(320, y, 'Selasa, 27 Oktober 2026', {s: 13, a: 'middle', c});
const kartu = (y = 140, sub = 'Resmi diluncurkan') => `<rect x="150" y="${y}" width="340" height="70" rx="14" fill="${C.putih}"/>` + teks(320, y + 46, 'PID POS', {s: 32, a: 'middle', c: C.biru, b: 800}) +
  teks(320, y + 104, sub, {s: 20, a: 'middle', b: 800}) + `<rect x="230" y="${y + 120}" width="180" height="26" rx="13" fill="${C.oren}"/>` + teks(320, y + 138, 'Selasa, 27 Oktober 2026', {s: 11, a: 'middle', c: C.navy, b: 800});
const kilat = `<rect width="640" height="360" fill="#fff" opacity=".25"/>`;

// kemudi kapal dengan angka di ujung jari-jari; sudut = putaran (derajat)
function kemudi(cx, cy, r, sudut, aktif, warnaAktif = C.oren) {
  let g = `<g transform="rotate(${sudut} ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.krem}" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="${C.krem}"/>`;
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 - 90) * Math.PI / 180, x1 = cx + Math.cos(a) * r * 0.22, y1 = cy + Math.sin(a) * r * 0.22, x2 = cx + Math.cos(a) * r * 1.22, y2 = cy + Math.sin(a) * r * 1.22;
    g += `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${C.krem}" stroke-width="6" stroke-linecap="round"/>`;
    const n = 10 - i, tx = cx + Math.cos(a) * r * 1.42, ty = cy + Math.sin(a) * r * 1.42;
    g += `<g transform="rotate(${-sudut} ${tx} ${ty})">${teks(tx, ty + 6, n, {s: 16, a: 'middle', b: 800, c: n === aktif ? warnaAktif : C.muda})}</g>`;
  }
  return g + '</g>' + `<path d="M ${cx - 9} ${cy - r * 1.75} L ${cx + 9} ${cy - r * 1.75} L ${cx} ${cy - r * 1.6} Z" fill="${C.oren}"/>`;
}

const DAFTAR = ['Stok dek tercatat', 'Kasir Android aktif', 'Pembayaran QRIS', 'Printer struk', 'Pesan ke DC', 'Persetujuan berjenjang', 'Transfer ke dek', 'Sinkron SAP', 'Rekap shift', 'Tim kapal siap'];
function daftar(selesai) {
  return DAFTAR.map((d, i) => {
    const y = 72 + i * 26, ok = i < selesai;
    return `<rect x="300" y="${y - 15}" width="18" height="18" rx="4" fill="${ok ? C.oren : 'none'}" stroke="${ok ? C.oren : C.garis}" stroke-width="2"/>` + (ok ? `<path d="M ${304} ${y - 6} L ${308} ${y - 2} L ${314} ${y - 10}" stroke="#fff" stroke-width="2.5" fill="none"/>` : '') +
      teks(330, y, d, {s: 14, c: ok ? C.putih : C.muda, b: ok ? 700 : 600});
  }).join('');
}

// struk kasir: baris-baris yang sudah tercetak
function struk(baris, o = {}) {
  const tinggi = 40 + baris.length * 20 + (o.akhir ? 110 : 0), y0 = 300 - tinggi;
  let g = `<rect x="230" y="300" width="180" height="40" rx="6" fill="#2b2b2b"/><rect x="240" y="${y0}" width="160" height="${tinggi}" fill="#fff"/>`;
  g += `<path d="M 240 ${y0} ${[...Array(16)].map((_, i) => `L ${245 + i * 10} ${y0 - 5} L ${250 + i * 10} ${y0}`).join(' ')}" fill="#fff"/>`;
  g += teks(320, y0 + 22, 'PID POS · KASIR', {s: 10, a: 'middle', c: '#555', b: 800});
  baris.forEach((b, i) => { g += teks(252, y0 + 44 + i * 20, b[0], {s: 11, c: '#333', b: 600}) + teks(388, y0 + 44 + i * 20, b[1], {s: 11, c: '#333', a: 'end', b: 800}); });
  if (o.akhir) {
    const y = y0 + 44 + baris.length * 20;
    g += `<path d="M 252 ${y - 8} H 388" stroke="#999" stroke-dasharray="3 3"/>` + teks(252, y + 14, 'TOTAL', {s: 13, c: '#111', b: 800}) + teks(388, y + 14, 'RESMI', {s: 13, c: C.oren, a: 'end', b: 800}) +
      teks(320, y + 36, 'PID POS diluncurkan', {s: 11, a: 'middle', c: '#333', b: 800}) + teks(320, y + 52, '27-10-2026', {s: 10, a: 'middle', c: '#555'}) +
      [...Array(26)].map((_, i) => `<rect x="${262 + i * 4.5}" y="${y + 62}" width="${i % 3 ? 2 : 3}" height="28" fill="#111"/>`).join('');
  }
  return g;
}
const BARIS = [['10 Stok dek', 'SIAP'], ['9 Kasir', 'SIAP'], ['8 QRIS', 'SIAP'], ['7 Struk', 'SIAP'], ['6 Pesan DC', 'SIAP'], ['5 Approve', 'SIAP'], ['4 Transfer', 'SIAP'], ['3 SAP', 'SIAP'], ['2 Shift', 'SIAP'], ['1 Tim', 'SIAP']];

const RUTE = [['Priok', 'Belawan', -40], ['Priok', 'Surabaya', 25], ['Surabaya', 'Balikpapan', -10], ['Surabaya', 'Makassar', 25], ['Makassar', 'Bitung', -30], ['Makassar', 'Ambon', 25], ['Ambon', 'Sorong', 25], ['Bitung', 'Sorong', -30], ['Sorong', 'Jayapura', -20], ['Priok', 'Makassar', -60]];
const peta = (n, o = {}) => kisi('rgba(255,255,255,.04)', '#07122b') + `<g opacity="${o.redup || 1}">${pulau()}</g>` + RUTE.slice(0, n).map(([a, b, l]) => rute(a, b, {lengkung: l, w: 2.6})).join('') +
  RUTE.slice(n).map(([a, b, l]) => rute(a, b, {lengkung: l, w: 1.2, c: C.garis, putus: true, op: 0.6})).join('') + Object.keys(PELABUHAN).map((k) => titik(k, {r: 3.5, c: n ? C.putih : C.muda})).join('');

const KONSEP = [
  {
    no: 1, judul: 'Kapal Dibangun', durasi: '15 detik', saran: true,
    ide: 'Setiap detik, satu bagian kapal tergambar sebagai cetak biru di belakang angka. Saat nol, kapal utuh dan lampunya menyala.',
    panel: [
      {t: T[0], judul: 'Kisi cetak biru dan logo', svg: kisi() + logo() + teks(320, 80, 'PELUNCURAN PID POS', {s: 12, a: 'middle', c: C.muda, ls: 4}) + `<path d="M 120 250 H 520" stroke="${C.muda}" stroke-dasharray="4 6"/>` + tanggal() + kamera('DIAM'),
        vis: 'Latar navy berkisi seperti kertas cetak biru. Kartu logo dan judul muncul, garis air laut tergambar putus-putus.', audio: 'Pad rendah, desis pena.', teks: 'PELUNCURAN PID POS · tanggal'},
      {t: T[1], judul: '10: lambung, 7: dek pertama', svg: kisi() + logo() + kapal(110, 250, 300, {tingkat: 1, tanpaJendela: true, sw: 1.6}) + angka(520, 210, '7') + `<path d="M 470 230 H 570" stroke="${C.oren}" stroke-width="3"/>` + tanggal() + kamera('DIAM · GARIS TERGAMBAR TIAP DETIK'),
        vis: 'Angka besar di kanan. Setiap detik satu bagian kapal tergambar di kiri: 10 lambung, 9 garis air, 8 haluan, 7 dek pertama, dan seterusnya.', audio: 'Tik per detik + bunyi pena.', teks: 'Angka 10 → 6'},
      {t: T[2], judul: '3, 2, 1: cerobong, jendela', svg: kisi() + logo() + kapal(110, 250, 300, {sw: 1.8}) + angka(520, 210, '2', {c: C.oren}) + `<path d="M 470 230 H 570" stroke="${C.oren}" stroke-width="3"/>` + tanggal() + kamera('PUSH-IN PELAN'),
        vis: 'Kapal hampir lengkap: dek atas, cerobong oranye, garis jendela. Angka 3–1 berubah oranye dan ketukan makin rapat.', audio: 'Ketukan dobel, nada naik.', teks: 'Angka 5 → 1'},
      {t: T[3], judul: 'Nol: lampu menyala', svg: kisi() + `<circle cx="320" cy="200" r="200" fill="rgba(61,111,194,.2)"/>` + kapal(150, 300, 340, {sw: 2, jendela: C.oren, jendelaW: 3.5}) + laut(318) + kilat + `<rect x="190" y="40" width="260" height="56" rx="12" fill="${C.putih}"/>` + teks(320, 78, 'PID POS', {s: 26, a: 'middle', c: C.biru, b: 800}) + teks(320, 125, 'Resmi diluncurkan', {s: 16, a: 'middle', b: 800}) + kamera('KILAT, KAMERA MUNDUR'),
        vis: 'Kilat putih. Semua jendela menyala oranye bersamaan, laut muncul, kartu PID POS dan “Resmi diluncurkan” turun di atas kapal.', audio: 'Klakson kapal + hantaman + akor.', teks: 'PID POS · Resmi diluncurkan'},
    ],
  },
  {
    no: 2, judul: 'Nusantara Menyala', durasi: '15 detik',
    ide: 'Setiap detik, satu rute pelayaran menyala di peta. Saat nol, seluruh jaringan menyala bersama.',
    panel: [
      {t: T[0], judul: 'Peta gelap', svg: peta(0) + logo() + tanggal() + kamera('DIAM · DARI ATAS'),
        vis: 'Peta Nusantara gelap; rute masih putus-putus redup. Logo dan tanggal muncul.', audio: 'Pad lebar.', teks: 'Tanggal'},
      {t: T[1], judul: 'Satu rute per detik', svg: peta(4) + logo() + angka(560, 330, '7', {s: 80}) + tanggal(345) + kamera('DIAM'),
        vis: 'Angka di pojok kanan bawah. Setiap detik satu rute berubah oranye dan menyala, dengan titik kapal bergerak di atasnya.', audio: 'Petikan nada tiap rute menyala.', teks: 'Angka 10 → 6'},
      {t: T[2], judul: 'Hampir semua menyala', svg: peta(9) + logo() + angka(560, 330, '2', {s: 80, c: C.oren}) + tanggal(345) + kamera('ZOOM-OUT PELAN'),
        vis: 'Sembilan rute sudah menyala; peta perlahan menjauh. Angka 3–1 oranye.', audio: 'Ketukan rapat, riser.', teks: 'Angka 5 → 1'},
      {t: T[3], judul: 'Nol: jaringan penuh', svg: peta(10, {redup: 0.5}) + kilat + kartu(90) + kamera('KILAT'),
        vis: 'Rute terakhir menyala, semua berdenyut bersama, lalu kartu peluncuran muncul di tengah.', audio: 'Hantaman + akor terbuka.', teks: 'PID POS · Resmi diluncurkan'},
    ],
    catatan: 'Rute di sketsa hanya contoh. Versi final mengikuti jadwal resmi PELNI.',
  },
  {
    no: 3, judul: 'Kemudi Kapal', durasi: '15 detik',
    ide: 'Angka 10 sampai 1 berada di ujung jari-jari kemudi kapal. Setiap detik kemudi berputar satu jari-jari. Saat nol, kemudi berputar cepat dan berubah menjadi bingkai logo.',
    panel: [
      {t: T[0], judul: 'Kemudi muncul', svg: kisi() + logo() + kemudi(320, 200, 70, 0, 0) + tanggal() + kamera('DIAM'),
        vis: 'Kemudi kayu bergaya garis muncul di tengah, penunjuk oranye di atas.', audio: 'Derit kayu pelan.', teks: 'Tanggal'},
      {t: T[1], judul: 'Berputar satu jari-jari per detik', svg: kisi() + logo() + kemudi(320, 200, 70, -108, 7) + tanggal() + kamera('DIAM'),
        vis: 'Setiap detik kemudi berputar 36° dan angka berikutnya berhenti tepat di bawah penunjuk, lalu menyala oranye.', audio: 'Bunyi “klek” mekanis tiap putaran.', teks: 'Angka 10 → 6'},
      {t: T[2], judul: 'Putaran makin cepat', svg: kisi() + logo() + kemudi(320, 200, 70, -288, 2) + tanggal() + kamera('PUSH-IN PELAN'),
        vis: 'Di 3–1 putaran makin bertenaga dengan sedikit pantulan, kamera mendekat.', audio: 'Klek + ketukan dobel.', teks: 'Angka 5 → 1'},
      {t: T[3], judul: 'Nol: kemudi jadi bingkai logo', svg: kisi() + `<circle cx="320" cy="175" r="115" fill="none" stroke="${C.krem}" stroke-width="10"/><circle cx="320" cy="175" r="135" fill="none" stroke="${C.oren}" stroke-width="2" stroke-dasharray="6 8"/>` +
        `<circle cx="320" cy="175" r="100" fill="${C.putih}"/>` + teks(320, 186, 'PID POS', {s: 30, a: 'middle', c: C.biru, b: 800}) + teks(320, 330, 'Resmi diluncurkan · 27 Oktober 2026', {s: 16, a: 'middle', b: 800}) + kamera('PUTARAN CEPAT LALU BERHENTI'),
        vis: 'Kemudi berputar cepat, jari-jari memudar, lingkarannya menjadi bingkai untuk logo PID POS.', audio: 'Klakson kapal panjang + akor.', teks: 'PID POS · Resmi diluncurkan'},
    ],
  },
  {
    no: 4, judul: 'Siap Berlayar (Checklist)', durasi: '15 detik',
    ide: 'Setiap detik, satu kesiapan aplikasi dicentang. Saat nol, stempel “Siap Berlayar” dan kapal mulai bergerak.',
    panel: [
      {t: T[0], judul: 'Daftar kesiapan muncul', svg: kisi() + logo() + daftar(0) + angka(160, 230, '10', {s: 110}) + kamera('DIAM'),
        vis: 'Kiri: angka besar. Kanan: 10 butir kesiapan PID POS, semua belum dicentang.', audio: 'Pad, ketikan halus.', teks: 'Daftar kesiapan'},
      {t: T[1], judul: 'Satu centang per detik', svg: kisi() + logo() + daftar(4) + angka(160, 230, '7') + kamera('DIAM'),
        vis: 'Setiap angka turun, satu butir dicentang oranye: stok dek, kasir aktif, QRIS, printer struk, dan seterusnya.', audio: '“Cek” tiap centang.', teks: 'Angka 10 → 6'},
      {t: T[2], judul: 'Hampir lengkap', svg: kisi() + logo() + daftar(9) + angka(160, 230, '2', {c: C.oren}) + kamera('PUSH-IN PELAN'),
        vis: 'Sembilan butir tercentang. Angka 3–1 oranye.', audio: 'Ketukan rapat.', teks: 'Angka 5 → 1'},
      {t: T[3], judul: 'Nol: SIAP BERLAYAR', svg: kisi() + kapal(140, 335, 360, {sw: 2, jendela: C.oren, jendelaW: 3}) + laut(350) +
        `<g transform="rotate(-8 320 85)"><rect x="170" y="45" width="300" height="70" rx="8" fill="none" stroke="${C.oren}" stroke-width="5"/>` + teks(320, 93, 'SIAP BERLAYAR', {s: 32, a: 'middle', c: C.oren, b: 800}) + '</g>' + teks(320, 160, 'PID POS · Selasa, 27 Oktober 2026', {s: 14, a: 'middle'}) + kamera('STEMPEL, KAPAL BERGERAK KE KANAN'),
        vis: 'Butir terakhir dicentang, daftar menyusut, stempel “SIAP BERLAYAR” menghantam layar, lalu kapal mulai bergerak.', audio: 'Bunyi stempel + klakson kapal.', teks: 'SIAP BERLAYAR · PID POS'},
    ],
    catatan: 'Butir kesiapan bisa diganti sesuai kesiapan nyata saat peluncuran.',
  },
  {
    no: 5, judul: 'Struk Kasir', durasi: '15 detik',
    ide: 'Printer struk mencetak satu baris per detik. Saat nol, struk menampilkan “TOTAL: RESMI” lengkap dengan barcode.',
    panel: [
      {t: T[0], judul: 'Printer siap', svg: `<rect width="640" height="360" fill="#eef3fa"/>` + logo(486, 14, true) + struk([]) + kamera('DIAM · DARI DEPAN'),
        vis: 'Latar terang. Printer struk di bawah tengah, kertas mulai keluar dengan judul “PID POS · KASIR”.', audio: 'Dengung printer.', teks: '—'},
      {t: T[1], judul: 'Satu baris per detik', svg: `<rect width="640" height="360" fill="#eef3fa"/>` + logo(486, 14, true) + struk(BARIS.slice(0, 4)) + angka(530, 220, '7', {c: C.biru}) + kamera('KAMERA NAIK MENGIKUTI KERTAS'),
        vis: 'Setiap detik printer mencetak satu baris, misalnya “10 Stok dek … SIAP”. Angka besar di kanan.', audio: 'Bunyi printer “krrt” tiap baris.', teks: 'Angka 10 → 6'},
      {t: T[2], judul: 'Struk memanjang', svg: `<rect width="640" height="360" fill="#eef3fa"/>` + logo(486, 14, true) + struk(BARIS.slice(0, 9).slice(-9)) + angka(530, 220, '2', {c: C.oren}) + kamera('KAMERA NAIK'),
        vis: 'Struk makin panjang, kamera terus naik. Angka 3–1 oranye.', audio: 'Printer makin cepat.', teks: 'Angka 5 → 1'},
      {t: T[3], judul: 'Nol: struk disobek', svg: `<rect width="640" height="360" fill="#eef3fa"/>` + `<g transform="translate(0 30) rotate(-4 320 200)">${struk(BARIS.slice(7), {akhir: true})}</g>` + kamera('STRUK DISOBEK, DIANGKAT KE KAMERA'),
        vis: 'Struk disobek dan diangkat ke kamera: “TOTAL: RESMI · PID POS diluncurkan · 27-10-2026” dengan barcode.', audio: 'Bunyi sobek + “bip” scan + akor.', teks: 'TOTAL: RESMI'},
    ],
    catatan: 'Nada ringan dan jenaka; cocok untuk acara internal dan media sosial.',
  },
];

tulis(KONSEP, 'Storyboard Konsep Countdown', 'countdown.html');
