// kru.js: orang-orang di toko kapal, dilukis dengan alat yang sama dengan Clawd (paint, inkLine, boil).
// Satu fungsi untuk semua tokoh: kru toko (topi kru navy, celemek) dan penumpang (rambut, baju warna lain).
// Satuan u sama dengan Clawd; (x, y) = titik di tanah di antara kaki. Tinggi tokoh sekitar 15u.
// Wajah memakai eyes() / mouth() / blush() dari clawd.js, jadi feel() dan emotions() langsung bisa dipakai:
//   kru(x, y, 26, { ...emotions(t, [[0, 'nervous'], [3, 'scared']]), topi: 'kru', celemek: true })
// Koordinat lokal (tampak depan): bahu (±2.7u, -7u), panjang lengan 3.2u, kepala berpusat di (0, -11u) dengan jari-jari ~3.3u.
// armL / armR dipanggil di ujung lengan (ruang lengan, x keluar sepanjang lengan), sama seperti Clawd.

const KULIT = '#E2AA7E', KULIT_GELAP = '#C98C62', NAVY = '#24356B', ORANYE = '#F2762E';
let KRU_N = 0;

function kru(x, y, u, o = {}) {
  const id = o.boilKey ?? 'k' + (++KRU_N), rs = p => boilSeed(`kru ${id} ${p}`);
  const sq = (o.sq || 0) + (o.take || 0), dy = (o.dy || 0) * u;
  const sw = clamp(u / 15, .45, 2.4), J = u * .06;
  const baju = o.baju || '#F3EFE6', bajuGelap = mixCol(baju, PAL.ink, .25), celana = o.celana || '#2A3558';
  x += (o.dx || 0) * u;

  rs('bayangan');
  if (!o.noShadow) paint(ellPts(x, y + u * .1, u * 3.6 * (1 - Math.min(.4, Math.abs(o.dy || 0) * .05)), u * .7, 20), { wash: PAL.ink, washOp: 60, ink: null });

  push();
  translate(x, y + dy);
  if (o.rot) rotate(o.rot);
  scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

  // kaki
  [[-1.55, 0], [.15, .5]].forEach(([lx, ph], i) => {
    rs('kaki' + i);
    let h = 3.2, sx = 0;
    if (o.walk != null) { const s = Math.sin((o.walk + ph) * TAU); sx = s * .5; h = 3.2 - Math.max(0, s) * .7; }
    paint(rectPts((lx + sx) * u, -3.6 * u, 1.4 * u, h * u, J), { wash: celana, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts((lx + sx + .8) * u, -(3.6 - h) * u - .25 * u, .95 * u, .4 * u, 12), { wash: '#3A2A22', ink: PAL.ink, sw: sw * .7 });
  });

  // badan
  rs('badan');
  const badan = rrPts(-3 * u, -7.8 * u, 6 * u, 4.6 * u, 1.3 * u, J);
  paint(badan, { wash: baju, ink: PAL.ink, sw });
  if (o.celemek) {
    paint(rrPts(-2.3 * u, -6.7 * u, 4.6 * u, 3.6 * u, .4 * u, J), { wash: NAVY, ink: PAL.ink, sw: sw * .8 });
    paint(rectPts(-.9 * u, -5 * u, 1.8 * u, .9 * u, J * .5), { wash: ORANYE, ink: PAL.ink, sw: sw * .5 });
    inkLine([[-2.1 * u, -6.7 * u], [-2.6 * u, -7.7 * u]], sw * .7, NAVY, 'ink', 0);
    inkLine([[2.1 * u, -6.7 * u], [2.6 * u, -7.7 * u]], sw * .7, NAVY, 'ink', 0);
  }
  paint([[-1.2 * u, -7.8 * u], [0, -6.7 * u], [1.2 * u, -7.8 * u]], { wash: o.kerah || (o.celemek ? NAVY : bajuGelap), ink: PAL.ink, sw: sw * .6 });
  paint(rectPts(-.55 * u, -8.5 * u, 1.1 * u, .9 * u, J * .4), { wash: KULIT_GELAP, ink: null });

  // lengan: sudut seperti Clawd (0 = lurus ke samping, + ke atas), digeser agar diam = sedikit turun
  const lengan = (dir, which) => {
    rs('lengan' + which);
    const a = (which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2)) - .55, hook = which === 'L' ? o.armL : o.armR;
    push(); translate(dir * 2.6 * u, -7 * u); rotate(dir < 0 ? a : -a);
    const P = [[0, 0], [dir * 1.6 * u, 0], [dir * 3 * u, 0]];
    paint(ribbon(P, 1.2 * u, .95 * u), { wash: baju, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(dir * 3.25 * u, 0, .62 * u, .58 * u, 12), { wash: KULIT, ink: PAL.ink, sw: sw * .7 });
    if (hook) { translate(dir * 3.3 * u, 0); if (dir < 0) scale(-1, 1); hook(u, sw); }
    pop();
  };

  // kepala
  rs('kepala');
  for (const s of [-1, 1]) paint(ellPts(s * 3.25 * u, -10.8 * u, .55 * u, .75 * u, 10), { wash: KULIT_GELAP, ink: PAL.ink, sw: sw * .6 });
  paint(ellPts(0, -11 * u, 3.3 * u, 3.15 * u, 26, J * .6), { wash: KULIT, ink: PAL.ink, sw });
  rs('rambut');
  const rambut = o.rambut || '#2B211D';
  if (o.topi !== 'kru') {
    const R = []; for (let k = 0; k <= 14; k++) { const ang = Math.PI + k / 14 * Math.PI; R.push([Math.cos(ang) * 3.45 * u, -11.2 * u + Math.sin(ang) * 3.35 * u]); }
    R.push([2.9 * u, -11.6 * u], [1.2 * u, -12.1 * u], [-.6 * u, -11.7 * u], [-2.9 * u, -11.9 * u]);
    paint(R, { wash: rambut, ink: PAL.ink, sw: sw * .8, curv: .4 });
    if (o.sanggul) paint(ellPts(0, -14.8 * u, 1.3 * u, 1 * u, 14), { wash: rambut, ink: PAL.ink, sw: sw * .7 });
  } else for (const s of [-1, 1]) paint(rectPts((s < 0 ? -3.3 : 2.5) * u, -12.4 * u, .8 * u, 1.6 * u, J * .4), { wash: rambut, ink: null });

  // wajah (fungsi Clawd, diperkecil ke kepala bulat)
  const K = .56;
  push(); translate(0, -11 * u); scale(K); translate(0, 5.46 * u);
  if (o.blush) blush(u, sw / K * .8, { sides: [-1, 1], bx: 3.6 }, o.blush === true ? 1 : o.blush);
  rs('mata'); eyes(u, o, sw / K * .8, [-1, 1], 0);
  rs('mulut'); mouth(u, o.mouth === undefined ? 'smile' : o.mouth, sw / K * .8);
  pop();

  // topi
  rs('topi');
  if (o.topi === 'kru') {
    paint(rrPts(-3.3 * u, -15.3 * u, 6.6 * u, 2.6 * u, 1 * u, J * .5), { wash: NAVY, ink: PAL.ink, sw });
    paint(rectPts(-3.4 * u, -13.3 * u, 6.8 * u, .75 * u, J * .3), { wash: ORANYE, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(0, -12.45 * u, 3.9 * u, .55 * u, 18), { wash: mixCol(NAVY, PAL.ink, .3), ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(0, -14.3 * u, .5 * u, .5 * u, 10), { wash: '#F0BE46', ink: PAL.ink, sw: sw * .5 });
  } else if (o.topi === 'caping') {
    paint([[-5 * u, -13.2 * u], [0, -16.6 * u], [5 * u, -13.2 * u]], { wash: '#E6C27A', ink: PAL.ink, sw, curv: .2 });
  }

  lengan(-1, 'L'); lengan(1, 'R');
  rs('gambar'); if (o.draw) o.draw(u, sw);
  pop();

  rs('emote');
  if (o.emote) {
    const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
    emote(o.emote, x + (top ? 0 : dir * 4.6 * u), y + dy + (top ? -17.5 : -14.6) * u * (1 - sq), u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
  }
  rs('sesudah');
}
