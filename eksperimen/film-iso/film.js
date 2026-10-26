// "Satu Alur": papan pelabuhan isometrik, satu permintaan kapal menumpuk delapan dokumen di menara SAP.
import { Iso, tri, PAL, pin, inset, cutLine, hatch, ring, haloText, iconGrid, person, clamp, lerp, seg, ss, eo, eio, back, hash, TAU, FONT } from './engine.js';
import { TL, SUBS, DUR as D, BEAT } from './timeline.js';
export const DUR = D;

// ---------- warna: satu warna satu makna ----------
const DOK = { SO: '#6FA85A', PR: '#E2B24A', PO: '#E87A3A', GRPO: '#7C68B8', IT: '#C45C8E', DO: '#CF5140' };
const NAMA = { SO: 'Sales Order', PR: 'Purchase Request', PO: 'Purchase Order', GRPO: 'GRPO', IT: 'Inventory Transfer', DO: 'Delivery Order' };
const AQUA = '#7CC3E8', TEH = '#B5793A', NAVY = '#2F4A86';
const T3 = {
  paving: tri('#E7DFCC'), soil: tri('#A77850'), soilDk: tri('#8A5B3A'), sea: tri('#5A9BCB'), seaDk: tri('#3C7FB1'), seaDp: tri('#2D6390'),
  wall: tri('#EDE6D6'), roof: tri('#B8B2A6'), stone: PAL.stone, navy: tri(NAVY), white: tri('#F4F1EA'), road: tri('#CFC7B4'), quay: tri('#C9C2B0'),
  aqua: tri(AQUA), teh: tri(TEH), shelf: tri('#C9A060'), glass: tri('#9FC7E2'),
};

// ---------- tata letak papan (satuan dunia) ----------
const LAUT_Y = 78;                                   // garis dermaga; laut di y > 78
const KAPAL = { x0: 37, x1: 68, y0: 93.5, y1: 102.5, z0: -1.8, z1: 3.2 };
const P2 = { x: 16, y: 24, w: 12, d: 10, h: 8 };
const MENARA = { x: 57, y: 43, w: 9, d: 9 };
const DC = { x: 77, y: 12, w: 22, d: 16, h: 8 };
const VENDOR = { x: 103, y: 56, w: 10, d: 8, h: 6 };
const LEVEL_H = 1.9, MENARA_Z0 = 1.4;
const STASIUN = { p2: [P2.x + 6, P2.y + 10, 4], dc: [DC.x + 11, DC.y + 16, 4], vendor: [VENDOR.x + 5, VENDOR.y + 8, 3], kapal: [52, 98, 3.4] };

// ---------- kamera: [t, cx, cy, cz, k], posisi eio, zoom log ----------
const CAM = [
  [0, 55, 97, 2, 24], [1.6, 55, 97, 2, 24], [4.6, 50, 84, 2, 12.5], [6.2, 40, 60, 3, 9.6], [11.6, 45, 52, 4, 10],
  [12.8, 87, 22, 3, 19], [18.6, 87, 22, 3, 21], [19.6, 88, 40, 3, 10.5], [25.4, 84, 44, 3, 10.5],
  [26.6, 74, 66, 2, 11], [28.8, 62, 82, 2, 12], [29.8, 53, 97, 1, 23], [35.9, 53, 97, 1, 24.5],
  [36.8, 56, 84, 3, 13], [41.4, 56, 84, 3, 13], [43.6, 66, 66, 0, 6.6], [D, 66, 66, 0, 6.75],
];
function kamera(t) {
  let i = 0; while (i + 1 < CAM.length - 1 && t >= CAM[i + 1][0]) i++;
  const A = CAM[i], B = CAM[i + 1], u = eio(seg(t, A[0], B[0]));
  return { x: lerp(A[1], B[1], u), y: lerp(A[2], B[2], u), z: lerp(A[3], B[3], u), k: Math.exp(lerp(Math.log(A[4]), Math.log(B[4]), u)) };
}

// ---------- papan ----------
function latar(g, iso) {
  g.fillStyle = PAL.bg; g.fillRect(0, 0, 1920, 1080);
  // kisi titik isometrik di bawah papan
  const k = iso.cam.k, step = k > 14 ? 4 : 8;
  g.fillStyle = 'rgba(46,37,34,.13)';
  const [x0, y0] = iso.unP(0, 0, -7), [x1, y1] = iso.unP(1920, 1080, -7), [x2, y2] = iso.unP(1920, 0, -7), [x3, y3] = iso.unP(0, 1080, -7);
  const xs = [x0, x1, x2, x3], ys = [y0, y1, y2, y3];
  for (let x = Math.floor(Math.min(...xs) / step) * step; x < Math.max(...xs); x += step)
    for (let y = Math.floor(Math.min(...ys) / step) * step; y < Math.max(...ys); y += step) {
      if (x > -2 && x < 122 && y > -2 && y < 122) continue;
      const [sx, sy] = iso.P(x, y, -7); if (sx < -5 || sx > 1925 || sy < -5 || sy > 1085) continue;
      g.fillRect(sx - 1.2, sy - 1.2, 2.4, 2.4);
    }
  // bayangan papan
  const c = iso.P(60, 60, -9); g.save(); g.filter = `blur(${Math.max(8, 3 * k)}px)`; g.fillStyle = 'rgba(46,37,34,.16)';
  g.beginPath(); g.ellipse(c[0] + 2 * k, c[1] + 4 * k, 104 * k, 62 * k, 0, 0, TAU); g.fill(); g.restore();
}
function papan(iso) {
  // strata darat dan kolom laut (tepi depan menunjukkan lapisan)
  iso.box(0, 0, -7, 120, LAUT_Y, 2.5, T3.soilDk, { layer: 0 });
  iso.box(0, 0, -4.5, 120, LAUT_Y, 3.3, T3.soil, { layer: 0 });
  iso.box(0, 0, -1.2, 120, LAUT_Y, 1.2, T3.paving, { layer: 0 });
  iso.box(0, LAUT_Y, -7, 120, 42, 2.5, T3.seaDp, { layer: 0 });
  iso.box(0, LAUT_Y, -4.5, 120, 42, 2.2, T3.seaDk, { layer: 0 });
  iso.box(0, LAUT_Y, -2.3, 120, 42, 1.5, T3.sea, { layer: 0 });
  // dermaga, jalan
  iso.box(14, LAUT_Y - 3, 0, 98, 3, .35, T3.quay, { layer: 0 });
  const jalan = (pts, w = 3) => { for (let i = 1; i < pts.length; i++) { const [a, b] = [pts[i - 1], pts[i]], x = Math.min(a[0], b[0]) - w / 2, y = Math.min(a[1], b[1]) - w / 2; iso.flat([[x, y], [Math.max(a[0], b[0]) + w / 2, y], [Math.max(a[0], b[0]) + w / 2, Math.max(a[1], b[1]) + w / 2], [x, Math.max(a[1], b[1]) + w / 2]], .02, '#D3CBB8'); } };
  jalan([[88, 30], [88, 72]]); jalan([[108, 64], [108, 34], [99, 34]]); jalan([[22, 36], [22, 72]]);
  // pelat stasiun: pucat dengan tepi putus-putus warna aksen
  const pelat = (x, y, w, d, c) => { iso.flat([[x, y], [x + w, y], [x + w, y + d], [x, y + d]], .03, '#F6EFE0'); iso.line3([[x, y, .05], [x + w, y, .05], [x + w, y + d, .05], [x, y + d, .05], [x, y, .05]], c, 2, { dash: [7, 6], layer: 0 }); };
  pelat(P2.x - 3, P2.y - 3, P2.w + 6, P2.d + 6, DOK.SO);
  pelat(DC.x - 3, DC.y - 3, DC.w + 6, DC.d + 6, DOK.IT);
  pelat(VENDOR.x - 3, VENDOR.y - 3, VENDOR.w + 6, VENDOR.d + 6, DOK.PO);
  pelat(MENARA.x - 3, MENARA.y - 3, MENARA.w + 6, MENARA.d + 6, PAL.ink);
  // pohon kecil dan peti di dermaga (detail, dilewati saat zoom besar)
  if (iso.cam.k < 30) for (let i = 0; i < 9; i++) { const x = 6 + hash(i) * 108, y = 4 + hash(i + 9) * 66; if ((x > 12 && x < 32 && y > 18 && y < 40) || (x > 72 && y < 34) || (x > 52 && x < 70 && y > 38 && y < 56) || (x > 98 && y > 50) || (Math.abs(x - 88) < 4)) continue; iso.cyl(x, y, 0, .35, 1.2, PAL.soil, { n: 6 }); iso.sphere(x, y, 2.2, 1.3, PAL.green); }
}

// ---------- bangunan ----------
function kantorP2(iso, t) {
  const { x, y, w, d, h } = P2;
  iso.box(x, y, 0, w, d, h, T3.wall, { decal: (I) => jendela(I, x, y, w, d, h) });
  iso.box(x - .4, y - .4, h, w + .8, d + .8, .7, T3.roof);
  iso.box(x + 2, y + d - .1, 0, 3, .2, 3.6, tri('#5C4A3E'));
  // stempel hijau di atap saat disetujui
  const s = seg(t, TL.STEMPEL - .15, TL.STEMPEL);
  if (t > TL.STEMPEL - .15) {
    const z = h + .7 + 6 * (1 - s) + (t > TL.STEMPEL ? .5 * Math.exp(-(t - TL.STEMPEL) * 9) * Math.sin((t - TL.STEMPEL) * 30) : 0);
    iso.cyl(x + w / 2, y + d / 2, z, 1.6, .6, tri(DOK.SO), { bias: 50 }); iso.box(x + w / 2 - .4, y + d / 2 - .4, z + .6, .8, .8, 1.8, tri('#5C4A3E'), { bias: 51 });
    if (t > TL.STEMPEL) iso.flat([[x + w / 2 - 2, y + d / 2 - 2], [x + w / 2 + 2, y + d / 2 - 2], [x + w / 2 + 2, y + d / 2 + 2], [x + w / 2 - 2, y + d / 2 + 2]], h + .72, DOK.SO, { depth: x + y + h + 20, layer: 1 });
  }
  iso.bill(x + w / 2, y + d + 2.5, 0, g => person(g, { body: DOK.SO, hair: '#3A2A22', h: 3.2, arm: t > TL.STEMPEL - .3 && t < TL.STEMPEL + .4 ? 2.6 : .3 }));
}
function jendela(I, x, y, w, d, h) {
  for (let i = 0; i < 3; i++) I.face3([[x + 1.2 + i * 3.6, y + d + .01, 2.6], [x + 3.4 + i * 3.6, y + d + .01, 2.6], [x + 3.4 + i * 3.6, y + d + .01, 5.6], [x + 1.2 + i * 3.6, y + d + .01, 5.6]], T3.glass, { both: true, color: '#A9C8DD' });
}

// menara SAP: alas + satu tingkat per dokumen yang sudah mendarat
function menara(iso, t) {
  const { x, y, w, d } = MENARA;
  iso.box(x - .5, y - .5, 0, w + 1, d + 1, MENARA_Z0, T3.stone);
  TL.DOKUMEN.forEach(([jenis, t0], i) => {
    const tl = t0 + TL.TERBANG; if (t < tl) return;
    const a = t - tl, sq = .2 * Math.exp(-a * 10) * Math.cos(a * 34);
    const hh = LEVEL_H * (1 - sq), z = MENARA_Z0 + i * LEVEL_H;
    iso.box(x, y, z, w, d, hh - .12, tri(DOK[jenis]), { decal: I => { I.face3([[x + 1, y + d + .01, z + .5], [x + 4, y + d + .01, z + .5], [x + 4, y + d + .01, z + 1.2], [x + 1, y + d + .01, z + 1.2]], null, { both: true, color: 'rgba(255,248,236,.85)' }); } });
  });
}
const levelAtas = t => TL.DOKUMEN.filter(([, t0]) => t >= t0 + TL.TERBANG).length;

// kartu dokumen terbang dari stasiun ke puncak menara
function kartu(iso, t) {
  TL.DOKUMEN.forEach(([jenis, t0, asal], i) => {
    if (t < t0 || t > t0 + TL.TERBANG) return;
    const u = seg(t, t0, t0 + TL.TERBANG), [ax, ay, az] = STASIUN[asal];
    const bx = MENARA.x + MENARA.w / 2, by = MENARA.y + MENARA.d / 2, bz = MENARA_Z0 + i * LEVEL_H + 1;
    const e = eio(u), x = lerp(ax, bx, e), y = lerp(ay, by, e), z = lerp(az, bz, e) + 12 * 4 * u * (1 - u);
    iso.push(x, y, z, u * Math.PI * 2, 1); iso.box(-1.6, -1.1, 0, 3.2, 2.2, .45, tri(DOK[jenis]), { bias: 200, layer: 2 }); iso.pop();
  });
}

// gudang DC dengan potongan dinding +y
function gudangDC(iso, t) {
  const { x, y, w, d, h } = DC, X = x + w, Y = y + d;
  const geser = eo(seg(t, TL.DINDING, TL.DINDING + .35)), pudar = 1 - seg(t, TL.DINDING + .03, TL.DINDING + .26);
  const fokus = clamp(seg(t, TL.FOKUS_TEH, TL.FOKUS_TEH + .5) - seg(t, TL.FOKUS_LEPAS, TL.FOKUS_LEPAS + .5));
  iso.add(x + y + 4, () => {
    iso.boxNow(x, y, 0, w, .5, h, T3.wall); iso.boxNow(x, y, 0, .5, d, h, T3.wall);           // dinding belakang
    iso.boxNow(x + .5, y + .5, 0, w - 1, d - 1, .1, tri('#D8D0BE'));                           // lantai
    // rak: AQUA (biru) dan slot Teh yang kosong (fokus)
    for (const [rx, warna, isi] of [[x + 3, T3.aqua, 6], [x + 12, T3.teh, 0]]) {
      iso.boxNow(rx, y + 10, 0, 7, 4, .3, T3.shelf); iso.boxNow(rx, y + 10, 2.4, 7, 4, .3, T3.shelf);
      for (const px of [rx, rx + 6.6]) iso.boxNow(px, y + 10, 0, .4, .4, 2.7, T3.shelf), iso.boxNow(px, y + 13.6, 0, .4, .4, 2.7, T3.shelf);
      for (let i = 0; i < isi; i++) {
        const tt = TL.AQUA_IKON[i], m = t < tt ? 0 : back(seg(t, tt, tt + .25), 2.2);
        if (m > 0) iso.boxNow(rx + .6 + (i % 3) * 2.1, y + 10.8 + Math.floor(i / 3) * 1.6, .3, 1.5 * m, 1.2, 1.9 * m, warna);
      }
    }
    // slot Teh: tetap berwarna saat semua yang lain abu-abu, lalu terisi setelah GRPO
    const terisi = t > TL.GRPO + TL.TERBANG ? 1 : 0;
    iso.keep = true;
    if (!terisi) iso.line3([[x + 12, y + 10, .45], [x + 19, y + 10, .45], [x + 19, y + 14, .45], [x + 12, y + 14, .45], [x + 12, y + 10, .45]], TEH, 3, { dash: [6, 5], now: true });
    else for (let i = 0; i < 6; i++) iso.boxNow(x + 12.6 + (i % 3) * 2.1, y + 10.8 + Math.floor(i / 3) * 1.6, .3, 1.5, 1.2, 1.9, T3.teh);
    iso.keep = false;
    iso.boxNow(X - .5, y, 0, .5, d, h, T3.wall);                                               // dinding kanan (+x)
    const angkat = eo(seg(t, TL.DINDING, TL.DINDING + .45)) * (1 - eio(seg(t, TL.TRUK_D0 - 1, TL.TRUK_D0))), pud = 1 - .85 * angkat;
    if (pud > .02) { iso.alpha = pud; iso.boxNow(x - .3, y - .3, h + 7 * angkat, w + .6, d + .6, .8, T3.roof); iso.alpha = 1; }
    if (pudar > 0) { iso.alpha = pudar; iso.boxNow(x, Y - .5 + geser * 6, 0, w, .5, h, T3.wall); iso.alpha = 1; }   // kulit +y bergeser keluar
    if (geser > .6) { const k = seg(geser, .6, 1); const P = [[x, Y, 0], [X, Y, 0], [X, Y, h], [x, Y, h]].map(p => iso.P(...p)); iso.g.save(); iso.g.globalAlpha = k; hatch(iso.g, [P[0], iso.P(x, Y, .8), iso.P(X, Y, .8), P[1]]); hatch(iso.g, [iso.P(x, Y, h - .4), iso.P(X, Y, h - .4), P[2], P[3]]); iso.g.restore(); }
  });
  iso.bill(x + 7, Y + 2.5, 0, g => person(g, { body: DOK.GRPO, hat: 'cap', hatColor: DOK.IT, h: 3.2, arm: .5 }));
  return fokus;
}
function vendor(iso, t) {
  const { x, y, w, d, h } = VENDOR;
  iso.box(x, y, 0, w, d, h, T3.wall);
  iso.box(x - .3, y - .3, h, w + .6, d + .6, .6, tri(DOK.PO));
  iso.box(x + 1, y + d, 2.8, w - 2, 1.6, .3, tri(DOK.PO), { bias: 2 });
  iso.bill(x + w + 2, y + d - 2, 0, g => person(g, { body: DOK.PO, hair: '#2B211D', h: 3.1 }));
}
// truk: badan putih dengan garis warna; berjalan di polyline, menghadap arah gerak
function truk(iso, pts, u, garis, muatan) {
  let L = 0; const seglen = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(l); L += l; }
  let r = L * clamp(u), i = 0; while (i < seglen.length - 1 && r > seglen[i]) { r -= seglen[i]; i++; }
  const A = pts[i], B = pts[i + 1], f = clamp(r / seglen[i]), x = lerp(A[0], B[0], f), y = lerp(A[1], B[1], f), rot = Math.atan2(B[1] - A[1], B[0] - A[0]);
  iso.push(x, y, 0, rot, 1);
  iso.box(-3, -1.3, .5, 4.4, 2.6, 2.6, T3.white, { bias: 3 });
  iso.box(-3, 1.29, 1.4, 4.4, .02, .5, tri(garis), { bias: 4 });
  iso.box(1.6, -1.2, .5, 1.6, 2.4, 1.9, tri(garis), { bias: 3 });
  for (const wx of [-2, 2.2]) for (const wy of [-1.35, 1.1]) iso.box(wx - .45, wy, 0, .9, .25, .9, tri('#3A3533'), { bias: 2 });
  if (muatan) iso.box(-2.6, -1, 3.1, 3.6, 2, .9 * muatan, tri(TEH), { bias: 5 });
  iso.pop();
  return [x, y];
}

// kapal KM Awu dengan potongan lambung (dua dek di dalamnya)
function kapal(iso, t) {
  const { x0, x1, y0, y1, z0, z1 } = KAPAL, naik = 1, dz = 0;
  const ayun = Math.sin(t * 1.3) * .12;
  const geser = eo(seg(t, TL.LAMBUNG, TL.LAMBUNG + .35)), pudar = 1 - seg(t, TL.LAMBUNG + .03, TL.LAMBUNG + .26);
  if (naik <= 0) return;
  iso.add(x0 + y0 + 6, () => {
    const Z0 = z0 + dz + ayun, Z1 = z1 + dz + ayun, H = Z1 - Z0;
    iso.boxNow(x0, y0, Z0, x1 - x0, .4, H, T3.navy); iso.boxNow(x0, y0, Z0, .4, y1 - y0, H, T3.navy);
    // dek 3 (bawah) dan dek 7 (atas), stok naik setelah diterima
    const isi = seg(t, TL.DEK, TL.DEK + 1.6);
    iso.boxNow(x0 + .4, y0 + .4, Z0 + 2.5, x1 - x0 - .8, y1 - y0 - .8, .25, tri('#D8D0BE'));
    for (let i = 0; i < 6; i++) if (isi * 6 > i) iso.boxNow(x0 + 14 + i * 2.2, y1 - 2.4, Z0 + .3, 1.6, 2, 1.8 * back(clamp(isi * 6 - i), 2), T3.aqua);
    for (let i = 0; i < 8; i++) if (isi * 8 > i) iso.boxNow(x0 + 12 + i * 2.2, y1 - 2.4, Z0 + 2.8, 1.6, 2, 1.7 * back(clamp(isi * 8 - i), 2), T3.teh);
    iso.boxNow(x1 - .4, y0, Z0, .4, y1 - y0, H, T3.navy);
    iso.boxNow(x0, y0, Z1, x1 - x0, y1 - y0, .25, T3.white);                                     // geladak
    if (pudar > 0) { iso.alpha = pudar; iso.boxNow(x0, y1 - .4 + geser * 7, Z0, x1 - x0, .4, H, T3.navy); iso.alpha = 1; }
    if (geser > .6) { const k = seg(geser, .6, 1); iso.g.save(); iso.g.globalAlpha = k; hatch(iso.g, [iso.P(x0, y1, Z0), iso.P(x1, y1, Z0), iso.P(x1, y1, Z0 + .5), iso.P(x0, y1, Z0 + .5)]); hatch(iso.g, [iso.P(x0, y1, Z1 - .4), iso.P(x1, y1, Z1 - .4), iso.P(x1, y1, Z1), iso.P(x0, y1, Z1)]); iso.g.restore(); }
    // haluan
    iso.prismNow([[x1, y0], [x1 + 6, (y0 + y1) / 2], [x1, y1]], Z0, H, T3.navy);
    iso.prismNow([[x1, y0], [x1 + 6, (y0 + y1) / 2], [x1, y1]], Z1, .25, T3.white);
    // anjungan dan cerobong (garis oranye)
    iso.boxNow(x0 + 2, y0 + 1.5, Z1 + .25, 9, y1 - y0 - 3, 3, T3.white);
    iso.boxNow(x0 + 3, y0 + 2.2, Z1 + 3.25, 6, y1 - y0 - 4.4, 2, T3.white);
    iso.boxNow(x0 + 4.5, y0 + 3.6, Z1 + 5.25, 2.4, 1.8, 2.6, T3.white);
    iso.boxNow(x0 + 4.5, y0 + 3.6, Z1 + 6.4, 2.4, 1.8, .7, tri('#F2762E'));
  });
  // kartu permintaan jatuh ke geladak
  const jatuh = seg(t, TL.KARTU - .45, TL.KARTU);
  if (t > TL.KARTU - .45 && t < TL.SO[0]) {
    const zc = KAPAL.z1 + .3 + 18 * (1 - eo(jatuh) ** 1) * (1 - jatuh), sq = t > TL.KARTU ? .18 * Math.exp(-(t - TL.KARTU) * 8) * Math.cos((t - TL.KARTU) * 30) : 0;
    iso.push(54, 98, Math.max(KAPAL.z1 + .3, zc + dz), 0, 1); iso.box(-2.2, -1.5, 0, 4.4 * (1 + sq), 3, .5 * (1 - sq), T3.white, { bias: 60, decal: I => { } }); iso.box(-1.7, -1.1, .5, 3.4, .5, .05, tri(AQUA), { bias: 61 }); iso.box(-1.7, -.2, .5, 2.4, .5, .05, tri(TEH), { bias: 61 }); iso.pop();
  }
  iso.bill(60, 97, KAPAL.z1 + dz + .3, g => person(g, { body: NAVY, hat: 'cap', hatColor: '#24356B', h: 3, arm: t < TL.KARTU + .8 ? 2.4 : .3 }));
}

// ---------- subtitle: label peta ----------
function subtitle(g, t) {
  const s = SUBS.find(s => t >= s.t0 && t < s.t1); if (!s) return;
  const a = seg(t, s.t0, s.t0 + .2), out = seg(t, s.t1 - .25, s.t1), wipe = seg(t, s.t0 + .1, s.t0 + .55);
  g.save(); g.font = `500 42px ${FONT}`; const tw = g.measureText(s.text).width, W = tw + 120, H = 76, x = 960 - W / 2, y = 1080 - 64 - H + 8 * out;
  g.globalAlpha = 1 - out;
  g.fillStyle = PAL.paper; g.beginPath(); g.roundRect(x, y, W, H, 10); g.fill();
  g.strokeStyle = PAL.ink; g.lineWidth = 2; g.setLineDash([W * 2 * a + H * 2 * a, 9999]); g.beginPath(); g.roundRect(x, y, W, H, 10); g.stroke(); g.setLineDash([]);
  // chip kubus iso
  const cx = x + 40, cy = y + H / 2, c = tri(NAVY);
  const kub = (pts, f) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(cx + p[0], cy + p[1]) : g.moveTo(cx + p[0], cy + p[1])); g.fillStyle = f; g.fill(); };
  kub([[0, -12], [11, -6], [0, 0], [-11, -6]], c[0]); kub([[-11, -6], [0, 0], [0, 13], [-11, 7]], c[1]); kub([[0, 0], [11, -6], [11, 7], [0, 13]], c[2]);
  g.beginPath(); g.rect(x + 70, y, (tw + 10) * ss(wipe), H); g.clip();
  g.fillStyle = PAL.ink; g.textBaseline = 'middle'; g.fillText(s.text, x + 72, y + H / 2 + 2);
  g.restore();
}

// ---------- legenda akhir ----------
function legenda(g, t) {
  const a = seg(t, TL.LEGENDA, TL.LEGENDA + .6); if (a <= 0) return;
  const x = 56, y = 52, W = 460, H = 392;
  g.save(); g.globalAlpha = ss(a);
  g.fillStyle = 'rgba(251,244,230,.95)'; g.beginPath(); g.roundRect(x, y, W, H, 14); g.fill(); g.strokeStyle = PAL.ink; g.lineWidth = 2; g.stroke();
  haloText(g, 'PID POS · SATU ALUR', x + 28, y + 52, { font: `800 30px ${FONT}`, track: 3, halo: false });
  haloText(g, '1 permintaan → 8 dokumen SAP', x + 28, y + 88, { font: `500 22px ${FONT}`, halo: false, color: '#5C4F48' });
  const rows = [['SO', 2], ['PR', 1], ['PO', 1], ['GRPO', 1], ['IT', 2], ['DO', 1]];
  rows.forEach(([j, n], i) => {
    const ry = y + 126 + i * 38, k = seg(t, TL.LEGENDA + .2 + i * .1, TL.LEGENDA + .5 + i * .1); if (k <= 0) return;
    for (let q = 0; q < n; q++) { const c = tri(DOK[j]), cx = x + 42 + q * 26, cy = ry; const kub = (pts, f) => { g.beginPath(); pts.forEach((p, ii) => ii ? g.lineTo(cx + p[0], cy + p[1]) : g.moveTo(cx + p[0], cy + p[1])); g.fillStyle = f; g.fill(); }; const s = back(k, 2); g.save(); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); kub([[0, -11], [10, -5.5], [0, 0], [-10, -5.5]], c[0]); kub([[-10, -5.5], [0, 0], [0, 11], [-10, 5.5]], c[1]); kub([[0, 0], [10, -5.5], [10, 5.5], [0, 11]], c[2]); g.restore(); }
    haloText(g, `${NAMA[j]}  ×${n}`, x + 104, ry + 8, { font: `600 24px ${FONT}`, halo: false });
  });
  haloText(g, 'TIDAK SESUAI SKALA · DATA UJI', x + 28, y + H - 22, { font: `600 16px ${FONT}`, track: 2.5, halo: false, color: '#7A6D66' });
  g.restore();
}

// ---------- satu frame ----------
export function render(g, t, Q) {
  const iso = new Iso(g); iso.cam = kamera(t);
  latar(g, iso);
  const fokus = clamp(seg(t, TL.FOKUS_TEH, TL.FOKUS_TEH + .5) - seg(t, TL.FOKUS_LEPAS, TL.FOKUS_LEPAS + .5));
  iso.desat = .92 * fokus;
  papan(iso); kantorP2(iso, t); menara(iso, t); gudangDC(iso, t); vendor(iso, t); kapal(iso, t);
  // truk vendor membawa Teh ke DC; truk DC membawa kiriman ke kapal
  const uV = seg(t, TL.TRUK_V0, TL.TRUK_V1);
  const posV = truk(iso, [[108, 62], [108, 36], [100, 34]], eio(uV), DOK.PO, t < TL.TRUK_V1 + .3 ? 1 : 0);
  const uD = seg(t, TL.TRUK_D0, TL.TRUK_D1);
  const posD = truk(iso, [[92, 34], [88, 36], [88, 72], [70, 74]], eio(uD), DOK.IT, t > TL.TRUK_D0 - .2 && t < TL.TRUK_D1 + .2 ? 1 : 0);
  kartu(iso, t);
  // garis rute digambar sedikit di depan cerita
  const rute = [[[54, 96, 3.5], [40, 76, 1], [24, 40, 1]], TL.RUTE_P2 - .6, TL.RUTE_P2 + .5];
  const r = seg(t, rute[1], rute[2]); if (r > 0 && t < TL.MUNDUR0) { const P = rute[0]; const n = P.length - 1, q = r * n, i = Math.min(n - 1, Math.floor(q)); const pts = P.slice(0, i + 1).concat([[lerp(P[i][0], P[i + 1][0], q - i), lerp(P[i][1], P[i + 1][1], q - i), lerp(P[i][2], P[i + 1][2], q - i)]]); iso.line3(pts, PAL.ink, 2.5, { dash: [8, 7], layer: 3 }); }
  iso.flush();

  // potongan: garis potong digambar sebelum kulit bergeser
  if (t > TL.POTONG && t < TL.DINDING + .6) cutLine(g, [iso.P(DC.x, DC.y + DC.d, .3), iso.P(DC.x + DC.w, DC.y + DC.d, .3), iso.P(DC.x + DC.w, DC.y + DC.d, DC.h - .3), iso.P(DC.x, DC.y + DC.d, DC.h - .3), iso.P(DC.x, DC.y + DC.d, .3)], seg(t, TL.POTONG, TL.DINDING));
  if (t > TL.POTONG_KAPAL && t < TL.LAMBUNG + .6) { const k = KAPAL; cutLine(g, [iso.P(k.x0, k.y1, k.z0 + .3), iso.P(k.x1, k.y1, k.z0 + .3), iso.P(k.x1, k.y1, k.z1 - .3), iso.P(k.x0, k.y1, k.z1 - .3), iso.P(k.x0, k.y1, k.z0 + .3)], seg(t, TL.POTONG_KAPAL, TL.LAMBUNG)); }

  // pin label: muncul saat cerita sampai di stasiun, semua tampil di akhir
  const akhir = seg(t, TL.MUNDUR1 - .4, TL.MUNDUR1 + .8), ps = { ts: 24, ns: 40 };
  const sembunyi = (a0, a1) => clamp(seg(t, a0, a0 + .9)) * (t < a1 ? 1 : 1 - seg(t, a1, a1 + .3));
  const pinA = (t0, t1, i) => Math.max(sembunyi(t0, t1), seg(t, TL.STASIUN[i] - .3, TL.STASIUN[i] + .6));
  pin(iso, 52, 98, KAPAL.z1 + 2, { ...ps, title: 'KM AWU', num: '6 + 24', unit: 'PCS DIPESAN', dir: 1, up: 120, a: pinA(TL.KARTU + .3, TL.RUTE_P2, 0) });
  pin(iso, P2.x + 6, P2.y + 5, P2.h + 1, { ...ps, title: 'APPROVE SO', num: '2', unit: 'SALES ORDER', dir: -1, up: 110, a: pinA(TL.STEMPEL - .2, TL.DORONG_DC, 1) });
  pin(iso, DC.x + 4, DC.y + 2, DC.h + .8, { ...ps, title: 'DC-JKT', num: '6', unit: 'AQUA DARI STOK', dir: 1, up: 120, a: pinA(TL.AQUA + .4, TL.TRUK_V0, 2), icons: (gg, x, y, dir) => iconGrid(gg, x, y, 6, (t - TL.AQUA) / (BEAT / 2) + 1, 6, 30, (c, px, py, s, on) => botol(c, px, py, s, AQUA, on)) });
  pin(iso, VENDOR.x + 5, VENDOR.y + 4, VENDOR.h + .6, { ...ps, title: 'VENDOR', num: '24', unit: 'TEH PUCUK', dir: 1, up: 150, a: pinA(TL.TEH0 - .4, TL.TRUK_D0, 3), icons: (gg, x, y) => iconGrid(gg, x, y, 24, (t - TL.TEH0) / (BEAT / 4) + 1, 8, 26, (c, px, py, s, on) => botol(c, px, py, s, TEH, on)) });
  const n = levelAtas(t);
  pin(iso, MENARA.x + MENARA.w / 2, MENARA.y + MENARA.d / 2, MENARA_Z0 + Math.max(1, n) * LEVEL_H + .3, { ...ps, title: 'SAP', num: String(n), unit: 'DOKUMEN', dir: 1, up: 90, a: t > TL.SO[0] + TL.TERBANG - .3 ? Math.max(seg(t, TL.SO[0] + TL.TERBANG - .3, TL.SO[0] + TL.TERBANG + .6), akhir) : 0 });
  if (t > TL.DEK && t < TL.INSET + .2) pin(iso, KAPAL.x0 + 9, KAPAL.y1, KAPAL.z0 + 1.2, { ...ps, title: 'DEK 3 · DEK 7', num: '+6 / +24', unit: 'STOK', dir: -1, up: 70, a: seg(t, TL.DEK, TL.DEK + .9) * (1 - seg(t, TL.INSET - .2, TL.INSET + .1)) });

  // cincin "di sini" pada truk kiriman
  if (t > TL.TRUK_D0 && t < TL.TRUK_D1 + .3) { const [sx, sy] = iso.P(posD[0], posD[1], 2); ring(g, sx, sy, 3.6 * iso.cam.k, seg(t, TL.TRUK_D0, TL.TRUK_D0 + .4) * (1 - seg(t, TL.TRUK_D1, TL.TRUK_D1 + .3)), t, 'KIRIMAN DEK 3 + DEK 7'); }

  // inset kasir: frame di dalam frame
  const ai = seg(t, TL.INSET, TL.INSET + .8) * (1 - seg(t, TL.MUNDUR0, TL.MUNDUR0 + .4));
  if (ai > 0) { const [ax, ay] = iso.P(48, 99, KAPAL.z1 + .5); inset(iso, ax, ay, 1460, 330, 200, ai, (gg, cx, cy, R) => kasir(gg, cx, cy, R, t)); }

  // judul isometrik di papan
  if (t > TL.JUDUL) { const iso2 = new Iso(g); iso2.cam = iso.cam; const a = back(seg(t, TL.JUDUL, TL.JUDUL + .4), 2); if (a > 0) iso2.text3('PID POS', 14, 117, -.75, { plane: 'xy', size: 6.5 * a, extrude: .7, tri: tri('#FBF4E6'), weight: 800 }); iso2.flush(); }

  if (!(Q && Q.has('nosub'))) subtitle(g, t);
  legenda(g, t);
  // buka dari kertas di awal, tutup ke kertas di akhir
  const fade = Math.max(1 - seg(t, 0, .35), seg(t, D - .5, D));
  if (fade > 0) { g.fillStyle = `rgba(242,230,208,${fade})`; g.fillRect(0, 0, 1920, 1080); }
}

function botol(g, x, y, s, c, on) {
  const t3 = tri(on ? c : '#D8CCB6');
  g.fillStyle = t3[1]; g.beginPath(); g.roundRect(x - s * .2, y - s * .3, s * .4, s * .7, s * .08); g.fill();
  g.fillStyle = t3[2]; g.fillRect(x + s * .02, y - s * .3, s * .18, s * .7);
  g.fillStyle = t3[0]; g.fillRect(x - s * .1, y - s * .46, s * .2, s * .16);
}

// isi inset kasir: meja, kasir, dua botol AQUA, total, lalu DO ke SAP
function kasir(g, cx, cy, R, t) {
  g.fillStyle = '#EDE6D6'; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  g.fillStyle = tri(NAVY)[2]; g.fillRect(cx - R, cy + R * .3, 2 * R, R);
  g.fillStyle = '#C98A52'; g.fillRect(cx - R, cy + R * .2, 2 * R, R * .12);
  g.save(); g.translate(cx - R * .45, cy + R * .22); g.scale(R / 4.6, R / 4.6); person(g, { body: NAVY, hat: 'cap', hatColor: '#24356B', h: 3.2, arm: t > TL.JUAL ? 1.8 : .4 }); g.restore();
  for (let i = 0; i < 2; i++) { const s = back(seg(t, TL.JUAL + i * BEAT / 2, TL.JUAL + i * BEAT / 2 + .3), 2); if (s > 0) botol(g, cx - R * .05 + i * R * .2, cy + R * .1, R * .3 * s, AQUA, 1); }
  const jual = seg(t, TL.JUAL, TL.JUAL + .4);
  if (jual > 0) { g.save(); g.globalAlpha = jual; haloText(g, 'Rp 38.000', cx + R * .02, cy - R * .32, { font: `800 ${Math.round(R * .2)}px ${FONT}`, color: NAVY, align: 'center' }); haloText(g, '2 × AQUA · DEK 3', cx + R * .02, cy - R * .14, { font: `600 ${Math.round(R * .1)}px ${FONT}`, align: 'center' }); g.restore(); }
  const d = seg(t, TL.DO - .3, TL.DO);
  if (d > 0) { g.save(); g.globalAlpha = d; g.fillStyle = DOK.DO; g.beginPath(); g.roundRect(cx - R * .5, cy + R * .46, R, R * .24, R * .12); g.fill(); haloText(g, 'DO 266000512', cx, cy + R * .62, { font: `700 ${Math.round(R * .12)}px ${FONT}`, color: '#FFF8EC', align: 'center', halo: false }); g.restore(); }
}

// ---------- event suara untuk mix ----------
export function events() {
  const ev = [];
  ev.push({ t: TL.KARTU, type: 'kertas' }, { t: TL.KAPAL0, type: 'naik' }, { t: TL.STEMPEL, type: 'stempel' });
  TL.DOKUMEN.forEach(([j, t0], i) => ev.push({ t: t0, type: 'terbang', i }, { t: +(t0 + TL.TERBANG).toFixed(4), type: 'mendarat', i, jenis: j }));
  ev.push({ t: TL.POTONG, type: 'potong' }, { t: TL.DINDING, type: 'geser' }, { t: TL.POTONG_KAPAL, type: 'potong' }, { t: TL.LAMBUNG, type: 'geser' });
  TL.AQUA_IKON.forEach((t, i) => ev.push({ t, type: 'ikon', i }));
  TL.TEH.forEach((t, i) => ev.push({ t, type: 'ikon', i, kecil: 1 }));
  ev.push({ t: TL.TRUK_V0, type: 'truk', dur: TL.TRUK_V1 - TL.TRUK_V0 }, { t: TL.TRUK_D0, type: 'truk', dur: TL.TRUK_D1 - TL.TRUK_D0 });
  TL.CEK.forEach(t => ev.push({ t, type: 'cek' }));
  ev.push({ t: TL.INSET, type: 'inset' }, { t: TL.JUAL, type: 'bip' }, { t: TL.MUNDUR0, type: 'mundur' });
  TL.STASIUN.forEach((t, i) => ev.push({ t, type: 'stasiun', i }));
  ev.push({ t: TL.FOKUS_TEH, type: 'fokus' }, { t: TL.FOKUS_LEPAS, type: 'lepas' });
  return ev.sort((a, b) => a.t - b.t);
}
export const TEXTS = () => [];
