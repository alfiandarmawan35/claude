// toko.js: "Malam Panjang di Toko Kapal" (18 s). Lihat STORYBOARD.md.
//   A (0–4.6)    nota menumpuk dan runtuh.          B (4.6–9.2)  kiriman DC membawa tablet dan scanner.
//   C (9.2–14.2) scan, bip, struk, penumpang senang. D (14.2–18) pagi, meja rapi, kru melambai.
// Semua dilukis dengan wash (tanpa fill cat air) supaya cepat di render tanpa GPU.
(() => {
  const MEJA_Y = 668, KRU_X = 1120, KRU_Y = 776, KRU_U = 26;
  const P_U = 25, P_Y = 1075, BOTOL_U = 22;
  const KAYU = '#C98A52', KAYU_GELAP = '#9C6537', KERTAS = '#F6EEDC';
  const NAVY_WIPE = [NAVY, '#3A4F8F'];

  // botol air minum biru, tanpa tulisan
  function botol(x, y, u, sw) {
    paint(rrPts(x - .7 * u, y - 2.6 * u, 1.4 * u, 3.4 * u, .4 * u), { wash: '#9FD3EE', ink: PAL.ink, sw: sw * .7 });
    paint(rectPts(x - .72 * u, y - 1.6 * u, 1.44 * u, .9 * u), { wash: '#2E7CC4', ink: null });
    paint(rectPts(x - .38 * u, y - 3.3 * u, .76 * u, .7 * u), { wash: '#1F5FA8', ink: PAL.ink, sw: sw * .6 });
  }

  // ---------- latar ----------
  function dunia(t, pagi) {
    boilSeed('dinding');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: mixCol('#5D5B88', '#F2DDB6', pagi), ink: null });
    paint(rectPts(-400, 560, W + 800, 160), { wash: mixCol('#4A4874', '#E2C596', pagi), ink: null });
    inkLine([[-400, 560], [W + 400, 560]], 1, PAL.ink, 'ink', 0);
    // jendela bulat
    boilSeed('jendela');
    const jx = 1560, jy = 260;
    paint(ellPts(jx, jy, 132, 132, 32, 1), { wash: '#C8A24A', ink: PAL.ink, sw: 1.4 });
    paint(ellPts(jx, jy, 100, 100, 32, 1), { wash: mixCol('#1E2A50', '#F8C987', pagi), ink: PAL.ink, sw: 1 });
    if (pagi > .01) {
      glow(jx - 10, jy + 18, 120, '#FFD98A', pagi);
      paint(ellPts(jx - 10, jy + 20, 34, 34, 20), { wash: '#FFE6A0', washOp: 255 * pagi, ink: null });
    }
    if (pagi < .99) paint(ellPts(jx + 40, jy - 40, 16, 16, 14), { wash: PAL.cream, washOp: 255 * (1 - pagi), ink: null });
    const laut = []; for (let k = 0; k <= 12; k++) { const a = Math.PI * k / 12; laut.push([jx + Math.cos(a) * 99, jy + Math.sin(a) * 99]); }
    for (let k = 0; k <= 8; k++) laut.push([jx + 99 - k * 24.75, jy + 30 + 6 * Math.sin(t * 2 + k)]);
    paint(laut, { wash: mixCol('#2B4B7A', '#4C8FC0', pagi), ink: null });
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; paint(ellPts(jx + Math.cos(a) * 116, jy + Math.sin(a) * 116, 6, 6, 8), { wash: '#8A6A2A', ink: null }); }
    // rak dan barang
    for (const [ry, n] of [[250, 7], [420, 7]]) {
      boilSeed('rak' + ry);
      for (let i = 0; i < n; i++) {
        const bx = 180 + i * 112 + hash(ry + i) * 20, jenis = Math.floor(hash(ry * 3 + i) * 3);
        if (jenis === 0) botol(bx, ry - BOTOL_U * .8, BOTOL_U * .9, .8);
        else paint(rrPts(bx - 34, ry - 70 - 20 * hash(i + ry), 68, 70 + 20 * hash(i + ry), 6), { wash: ['#E8833A', '#3F9A7A', '#C9455A'][(i + ry) % 3], ink: PAL.ink, sw: .9 });
      }
      paint(rectPts(130, ry, 880, 22, 1), { wash: KAYU_GELAP, ink: PAL.ink, sw: 1 });
    }
    // lampu gantung
    boilSeed('lampu');
    inkLine([[960, -300], [960, 96]], 1.2, PAL.ink, 'ink', 0);
    glow(960, 170, 520, '#FFC766', .9 - .55 * pagi);
    paint([[900, 150], [1020, 150], [992, 96], [928, 96]], { wash: NAVY, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(960, 152, 22, 10, 12), { wash: '#FFE6A0', ink: null });
  }

  function meja(t) {
    boilSeed('meja');
    paint(rectPts(330, MEJA_Y + 40, 1280, 420, 1), { wash: KAYU_GELAP, ink: PAL.ink, sw: 1.2 });
    for (let k = 1; k < 8; k++) inkLine([[330 + k * 160, MEJA_Y + 120], [330 + k * 160, H + 40]], .7, mixCol(KAYU_GELAP, PAL.ink, .4), 'inkfine', 0);
    paint(rectPts(330, MEJA_Y + 76, 1280, 38, 1), { wash: NAVY, ink: PAL.ink, sw: .9 });
    paint(rectPts(330, MEJA_Y + 114, 1280, 9, 0), { wash: ORANYE, ink: null });
    paint(rectPts(300, MEJA_Y, 1340, 44, 1), { wash: KAYU, ink: PAL.ink, sw: 1.2 });
  }

  // ---------- properti ----------
  function nota(x, y, rot, s = 1, key = '') {
    boilSeed('nota' + key);
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rectPts(-58, -6, 116, 12, .6), { wash: KERTAS, ink: PAL.ink, sw: .6 });
    pop();
  }
  function buku(x, y) {
    boilSeed('buku');
    paint([[x - 110, y], [x, y - 14], [x + 110, y], [x + 110, y - 8], [x, y - 22], [x - 110, y - 8]], { wash: KERTAS, ink: PAL.ink, sw: .9 });
    for (let k = 0; k < 3; k++) inkLine([[x - 90, y - 10 - k * 3 + 2], [x - 20, y - 18 - k * 3 + 2]], .5, '#9AA3B8', 'inkfine', 0);
  }
  const pensil = (u, sw) => paint(rectPts(-.12 * u, -1.4 * u, .26 * u, 1.9 * u), { wash: '#F0BE46', ink: PAL.ink, sw: sw * .5 });
  const scanner = (u, sw) => {
    paint(rectPts(.05 * u, .1 * u, .55 * u, 1.1 * u, u * .03), { wash: '#2E3340', ink: PAL.ink, sw: sw * .6 });
    paint(rrPts(-.3 * u, -.55 * u, 2.2 * u, .85 * u, .3 * u), { wash: '#3C4150', ink: PAL.ink, sw: sw * .7 });
    paint(rectPts(1.7 * u, -.5 * u, .22 * u, .75 * u), { wash: '#FF4D4D', ink: null });
  };
  function peti(x, y, w, h, sq = 0) {
    boilSeed('peti');
    push(); translate(x, y); scale(1 + sq * .5, 1 - sq);
    paint(rectPts(-w / 2, -h, w, h, 1), { wash: '#B57B45', ink: PAL.ink, sw: 1.2 });
    for (const yy of [.33, .66]) inkLine([[-w / 2, -h * yy], [w / 2, -h * yy]], .7, PAL.ink, 'inkfine', 0);
    inkLine([[-w / 2, -h], [w / 2, 0]], .7, PAL.ink, 'inkfine', 0);
    paint(rectPts(-w * .2, -h * .62, w * .4, h * .22, 0), { wash: NAVY, ink: PAL.ink, sw: .6 });   // label navy tanpa tulisan
    pop();
  }
  function tutupPeti(x, y, w, rot) {
    boilSeed('tutup');
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-w / 2 - 8, -14, w + 16, 18, 1), { wash: KAYU, ink: PAL.ink, sw: 1.1 });
    pop();
  }
  // tablet PID POS: layar dengan batang data, centang hijau saat scan berhasil (k 0..1)
  function tablet(x, y, s, nyala, hijau = 0) {
    boilSeed('tablet');
    if (nyala > 0) glow(x, y - 80 * s, 230 * s * nyala, '#8FD0FF', .55 * nyala);
    push(); translate(x, y); scale(s);
    paint(rectPts(-14, -24, 28, 24), { wash: '#2E3340', ink: PAL.ink, sw: .8 });
    paint(rrPts(-110, -168, 220, 150, 14), { wash: NAVY, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(-96, -156, 192, 126, 8), { wash: mixCol(mixCol('#20305E', '#9ED6FA', nyala), '#9BE8B4', hijau), ink: null });
    if (nyala > .3) {
      for (let k = 0; k < 3; k++) paint(rrPts(-78, -140 + k * 30, 70 + 50 * hash(k + 4), 16, 6), { wash: '#FFFFFF', washOp: 200 * nyala, ink: null });
      paint(ellPts(56, -94, 26, 26, 16), { wash: hijau > .3 ? '#2FA35E' : ORANYE, ink: null });
      if (hijau > .3) inkLine([[44, -94], [53, -84], [70, -104]], 2.2, '#FFFFFF', 'ink', 0);
    }
    pop();
  }
  function printer(x, y, panjang) {
    boilSeed('printer');
    if (panjang > 1) {
      const P = []; for (let k = 0; k <= 6; k++) { const q = k / 6; P.push([x + 10 * Math.sin(q * 2.2) * q, y - 46 - panjang * q]); }
      paint(ribbon(P, 34, 34), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 });
      for (let k = 1; k < Math.min(5, panjang / 20); k++) inkLine([[x - 10, y - 50 - k * 18], [x + 8, y - 50 - k * 18]], .5, '#9AA3B8', 'inkfine', 0);
    }
    paint(rrPts(x - 46, y - 48, 92, 48, 8), { wash: '#DADFE8', ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 26, y - 50, 52, 6), { wash: '#2E3340', ink: null });
  }
  function struk(x, y, rot) {
    boilSeed('struk' + Math.round(x));
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-17, -40, 34, 80, .5), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 });
    for (let k = 0; k < 3; k++) inkLine([[-10, -24 + k * 16], [10, -24 + k * 16]], .5, '#9AA3B8', 'inkfine', 0);
    pop();
  }

  // posisi ujung tangan kanan kru di dunia (untuk barang yang dipegang dan sinar scan)
  function tanganKanan(x, y, u, o) {
    const a = (o.aR ?? .2) - .55, sx = x + 2.6 * u, sy = y + (o.dy || 0) * u - 7 * u * (1 - (o.sq || 0));
    return [sx + 3.3 * u * Math.cos(a), sy - 3.3 * u * Math.sin(a), a];
  }
  const ujungScanner = (x, y, u, o) => { const [hx, hy, a] = tanganKanan(x, y, u, o); return [hx + 2 * u * Math.cos(a), hy - 2 * u * Math.sin(a)]; };

  // ---------- A: tumpukan nota ----------
  const T_RUNTUH = 3.0;
  const jumlahNota = lt => Math.min(22, 8 + Math.floor(lt * 4.5));
  // ke mana nota ke-i jatuh saat runtuh; nota bernomor kelipatan 5 mendarat di topi kru
  const DI_TOPI = i => i % 5 === 2;
  function targetNota(i) {
    if (DI_TOPI(i)) return [KRU_X - 60 + (i % 3) * 50, KRU_Y - 15 * KRU_U - 4 - (i % 2) * 8, (hash(i) - .5) * .6];
    return [600 + hash(i + 50) * 1000, MEJA_Y - 6 - hash(i + 9) * 6, (hash(i + 7) - .5) * 1.4];
  }
  function tumpukan(lt) {
    const n = jumlahNota(Math.min(lt, T_RUNTUH)), goyang = lt < T_RUNTUH ? .07 * seg(lt, 2.4, 3) * Math.sin((lt - 2.4) * 22) : 0;
    for (let i = 0; i < n; i++) {
      const baru = i === n - 1 && lt < T_RUNTUH ? 1 - easeOut(frac(lt * 4.5) * 2) : 0;
      const x0 = 860 + (hash(i) - .5) * 16, y0 = MEJA_Y - 6 - i * 11;
      const px = 860 + Math.sin(goyang) * (MEJA_Y - y0), py = MEJA_Y - Math.cos(goyang) * (MEJA_Y - y0);
      const sx = x0 - 860 + px, sy = py - baru * 70, rot0 = (hash(i + 3) - .5) * .12 + goyang;
      if (lt < T_RUNTUH) { nota(sx, sy, rot0, 1, i); continue; }
      const t0 = T_RUNTUH + i * .012, k = seg(lt, t0, t0 + .45 + hash(i) * .25);
      const [tx, ty, tr] = targetNota(i), p = arcPt([sx, sy], [tx, ty], 160 + 140 * hash(i + 2), easeOut(k));
      if (DI_TOPI(i)) continue;   // digambar bersama kru (topi bergerak)
      nota(p[0], p[1], lerp(rot0, tr, k) + (k < 1 ? k * 6 * (hash(i) - .5) : 0), 1, i);
    }
  }
  // nota yang terbang ke topi: posisinya mengikuti kru setelah mendarat
  function notaDiTopi(lt, gTerbang, lepas) {
    for (let i = 0; i < 22; i++) {
      if (!DI_TOPI(i)) continue;
      const [tx, ty, tr] = targetNota(i), sx = 860, sy = MEJA_Y - 6 - i * 11;
      const t0 = T_RUNTUH + i * .012, k = gTerbang ? seg(lt, t0, t0 + .55) : 1;
      let p = arcPt([sx, sy], [tx, ty], 220, easeOut(k)), r = lerp(0, tr, k) + (k < 1 ? k * 5 : 0);
      if (lepas != null && lepas > 0) { const q = clamp(lepas); p = arcPt([tx, ty], [tx + (i % 2 ? 420 : -380), ty + 500], 260, q); r = tr + q * 8 * (i % 2 ? 1 : -1); }
      nota(p[0], p[1], r, 1, 'topi' + i);
    }
  }

  function shotA(t, lt, dur) {
    camBegin(960, 560, kf(lt, [[0, 1.0], [4.6, 1.07]]));
    dunia(t, 0);
    buku(1040, MEJA_Y);
    const muka = emotions(lt, [[0, 'nervous'], [2.5, 'scared'], [3.35, 'dizzy']]);
    const nulis = lt < 2.45 ? { aR: -.15 + .14 * Math.sin(lt * TAU * 4), lookX: -.6, lookY: .7, armR: pensil } : {};
    kru(KRU_X, KRU_Y, KRU_U, { ...muka, ...nulis, topi: 'kru', celemek: true, boilKey: 'kru' });
    if (lt > T_RUNTUH) notaDiTopi(lt, true, null);
    meja(t);
    tumpukan(lt);
    const p1 = emotions(lt, [[0, 'bored'], [1.5, 'angry'], [3.15, 'surprised']]);
    kru(560, P_Y, P_U, { ...p1, lookX: .8, baju: '#E8833A', aR: -.25, armR: (u, sw) => botol(0, 0, BOTOL_U * .85, sw), boilKey: 'p1' });
    const at = toScreen(KRU_X, KRU_Y - 11 * KRU_U);
    camEnd();
    if (lt < .55) iris(...at, lerp(0, 1500, easeIn(lt / .55)));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NAVY_WIPE);
  }

  // ---------- B: kiriman DC ----------
  const PETI_X = 1470, PETI_W = 250, PETI_H = 160;
  function shotB(t, lt, dur) {
    const cx = kf(lt, [[0, 1180], [dur, 1230]]) - (lt > dur - .25 ? 1100 * easeIn(seg(lt, dur - .25, dur)) : 0);
    camBegin(cx, 470, 1.42);
    dunia(t, 0);
    // peti meluncur masuk lalu memantul
    const masuk = easeOut(seg(lt, .3, .95)), px = lerp(2150, PETI_X, masuk), sqPeti = .12 * spring(lt, .95, 7, 26);
    // kru: pusing → bingung → kaget → ide → mantap; mengulurkan tangan untuk menangkap scanner
    const muka = emotions(lt, [[0, 'dizzy'], [1.2, 'confused', { lookX: .9 }], [1.95, 'surprised', { lookX: .9 }], [2.6, 'idea', { lookX: .6 }], [3.5, 'determined']]);
    const raih = seg(lt, 3.0, 3.4), pegang = lt > 3.55;
    const pose = { ...muka, ...(lt > 3.0 ? { aR: lerp(muka.aR ?? .2, .75, ease(raih)) } : {}), topi: 'kru', celemek: true, boilKey: 'kru' };
    if (pegang) pose.armR = scanner;
    kru(KRU_X, KRU_Y, KRU_U, pose);
    notaDiTopi(lt, false, seg(lt, 1.95, 2.55));
    meja(t);
    buku(1040, MEJA_Y);
    for (let i = 0; i < 22; i++) if (!DI_TOPI(i)) { const [tx, ty, tr] = targetNota(i); if (tx > 900) nota(tx, ty, tr, 1, i); }
    // tablet naik dari peti, cahaya biru
    const naik = backOut(seg(lt, 2.0, 2.6)), nyala = seg(lt, 1.95, 2.3);
    if (nyala > 0) glow(PETI_X, MEJA_Y - PETI_H - 40, 300 * nyala, '#9ED6FA', .8 * nyala * (1 - .4 * seg(lt, 2.6, 3.2)));
    if (lt > 1.98) tablet(PETI_X, MEJA_Y - PETI_H + 40 - 40 * naik, .8, nyala);
    peti(px, MEJA_Y, PETI_W, PETI_H, sqPeti);
    if (lt < 1.95) tutupPeti(px, MEJA_Y - PETI_H, PETI_W, 0);
    else { const q = seg(lt, 1.95, 2.6), p = arcPt([PETI_X, MEJA_Y - PETI_H], [PETI_X + 520, MEJA_Y - 650], 180, q); if (q < 1) tutupPeti(p[0], p[1], PETI_W, q * 4); }
    // scanner melompat dari peti ke tangan kru
    if (lt > 2.3 && !pegang) {
      const tujuan = tanganKanan(KRU_X, KRU_Y, KRU_U, pose), q = ease(seg(lt, 2.95, 3.55));
      const awal = [PETI_X - 190, MEJA_Y - PETI_H - 10 - 60 * backOut(seg(lt, 2.3, 2.7))];
      const p = q > 0 ? arcPt(awal, tujuan, 140, q) : awal;
      push(); translate(p[0], p[1]); rotate(lerp(-.6, -tujuan[2], q)); scanner(KRU_U, 1); pop();
    }
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NAVY_WIPE);
    if (lt > dur - .25) whip(seg(lt, dur - .25, dur), 1, 0);
  }

  // garis seret untuk whip pan (layar penuh)
  function whip(k, dir, pagi) {
    const a = Math.sin(k * Math.PI);
    if (a < .02) return;
    for (let i = 0; i < 9; i++) {
      boilSeed('whip' + i);
      const y = hash(i) * H, h = 30 + 80 * hash(i + 3);
      paint(rectPts(-100, y, W + 200, h), { wash: mixCol('#5D5B88', '#7C79A8', hash(i + 5)), washOp: 210 * a, ink: null });
    }
  }

  // ---------- C: scan, bip, struk ----------
  const BOTOL1_X = 930, BOTOL2_X = 960, PRINTER_X = 1290;
  function shotC(t, lt, dur) {
    const masuk = lt < .3 ? 1100 * (1 - easeOut(lt / .3)) : 0;
    camBegin(980 + masuk, 590, 1.12);
    dunia(t, 0);
    const scan1 = [1.3, 1.85], scan2 = [4.05, 4.4];
    const bidik = seg(lt, 1.1, 1.3) - seg(lt, 1.95, 2.2) + seg(lt, 3.85, 4.0) - seg(lt, 4.5, 4.7);
    const muka = emotions(lt, [[0, 'determined'], [1.7, 'happy'], [4.35, 'proud']]);
    const pose = { ...muka, aR: lerp(muka.aR ?? .2, -.05, clamp(bidik)), lookX: bidik > .3 ? -.6 : muka.lookX, lookY: bidik > .3 ? .6 : muka.lookY, armR: scanner, topi: 'kru', celemek: true, boilKey: 'kru' };
    kru(KRU_X, KRU_Y, KRU_U, pose);
    meja(t);
    buku(1040, MEJA_Y);
    // printer, peti dan tablet di kanan
    const panjang1 = 110 * ease(seg(lt, 1.95, 2.55)) * (1 - seg(lt, 2.55, 2.6)), panjang2 = 110 * ease(seg(lt, 4.45, 4.8)) * (1 - seg(lt, 4.8, 4.85));
    printer(PRINTER_X, MEJA_Y, Math.max(panjang1, panjang2));
    peti(PETI_X, MEJA_Y, PETI_W, PETI_H);
    const hijau = Math.max(seg(lt, 1.6, 1.7) * (1 - seg(lt, 3.2, 3.5)), seg(lt, 4.25, 4.3));
    tablet(PETI_X, MEJA_Y - PETI_H, .8, 1, hijau);
    // penumpang 1: meletakkan botol, dilayani, jatuh hati, pergi
    const p1 = emotions(lt, [[0, 'angry'], [1.55, 'surprised'], [2.95, 'love']]);
    const pergi = stroll(t, 9.2 + 3.4, 9.2 + 4.2, 560, -260, P_U);
    const x1 = lt > 3.4 ? pergi.x : 560;
    const taruh = ease(seg(lt, .55, .95)), kembali = ease(seg(lt, 2.6, 2.95));
    const tanganP1 = [x1 + 2.6 * P_U + 3.3 * P_U * Math.cos(-.3), P_Y - 7 * P_U - 3.3 * P_U * Math.sin(-.3)];
    kru(x1, P_Y, P_U, { ...p1, lookX: lt > 3.4 ? -.8 : .8, baju: '#E8833A', aR: lt < .95 ? lerp(-.25, .25, taruh) : lt < 2.95 ? .25 - .5 * kembali : -.25,
      ...(lt > 3.4 ? { walk: pergi.walk, flip: true, dy: pergi.dy } : {}),
      armR: lt < .55 || lt > 2.95 ? (u, sw) => botol(0, 0, BOTOL_U * .85, sw) : null, boilKey: 'p1' });
    if (lt >= .55 && lt <= 2.95) {
      let bx = BOTOL1_X, by = MEJA_Y - .8 * BOTOL_U;
      if (lt < .95) { const p = arcPt(tanganP1, [bx, by], 90, taruh); bx = p[0]; by = p[1]; }
      if (lt > 2.6) { const p = arcPt([BOTOL1_X, by], tanganP1, 120, kembali); bx = p[0]; by = p[1]; }
      botol(bx, by, BOTOL_U, 1);
    }
    if (lt > 2.55 && lt < 2.95) { const p = arcPt([PRINTER_X, MEJA_Y - 140], tanganP1, 200, ease(seg(lt, 2.55, 2.95))); struk(p[0], p[1], lt * 6); }
    // penumpang 2 datang dan dilayani cepat
    if (lt > 3.3) {
      const datang = stroll(t, 9.2 + 3.3, 9.2 + 3.85, -240, 520, P_U), x2 = datang.x;
      const p2 = emotions(lt, [[3.3, 'hopeful'], [4.45, 'happy']]);
      const taruh2 = ease(seg(lt, 3.85, 4.05)), tanganP2 = [x2 + 2.6 * P_U + 3.3 * P_U * Math.cos(-.3), P_Y - 7 * P_U - 3.3 * P_U * Math.sin(-.3)];
      kru(x2, P_Y, P_U, { ...p2, lookX: .8, baju: '#3F9A7A', rambut: '#3B2A20', sanggul: true, ...(lt < 3.85 ? { walk: datang.walk, dy: datang.dy } : {}),
        aR: lt < 4.05 ? lerp(-.25, .25, taruh2) : .25, armR: lt < 3.85 ? (u, sw) => botol(0, 0, BOTOL_U * .85, sw) : null, boilKey: 'p2' });
      if (lt >= 3.85) { const p = lt < 4.05 ? arcPt(tanganP2, [BOTOL2_X, MEJA_Y - .8 * BOTOL_U], 70, taruh2) : [BOTOL2_X, MEJA_Y - .8 * BOTOL_U]; botol(p[0], p[1], BOTOL_U, 1); }
    }
    // sinar scan dan bip
    for (const [a, b] of [scan1, scan2]) {
      if (lt > a && lt < b) {
        const [sx, sy] = ujungScanner(KRU_X, KRU_Y, KRU_U, pose), bx = lt > 3 ? BOTOL2_X : BOTOL1_X, by = MEJA_Y - 1.2 * BOTOL_U;
        glow(bx, by, 70, '#FF4D4D', .8);
        boilSeed('sinar'); inkLine([[sx, sy], [bx, by]], 3, '#FF4D4D', 'ink', 0);
        emote('spark', bx + 40, by - 70, 22, seg(lt, a, a + .15), lt - a);
      }
    }
    camEnd();
    if (lt < .3) whip(.5 + lt / .6, 1, 0);
    // iris menutup ke jendela bulat (malam), lalu shot D membukanya dari jendela yang sama (pagi)
    if (lt > dur - .55) { const [jx, jy] = toScreen(1560, 260, LAST_CAM); iris(jx, jy, lerp(1700, 112 * LAST_CAM.zoom, easeIn(seg(lt, dur - .55, dur - .05)))); }
  }

  // ---------- D: pagi ----------
  function shotD(t, lt, dur) {
    camBegin(960, 560, kf(lt, [[0, 1.0], [dur, 1.05]]));
    dunia(t, 1);
    const lambai = lt > 1.6 && lt < 2.9 ? 1.25 + .35 * Math.sin((lt - 1.6) * TAU * 2) : null;
    const muka = emotions(lt, [[0, 'relieved'], [1.2, 'happy']]);
    kru(KRU_X, KRU_Y, KRU_U, { ...muka, ...(lambai != null ? { aL: lambai } : {}), topi: 'kru', celemek: true, boilKey: 'kru' });
    meja(t);
    for (let i = 0; i < 4; i++) struk(820 + i * 3, MEJA_Y - 8 - i * 6, Math.PI / 2 + (hash(i) - .5) * .1);   // tumpukan struk kecil yang rapi
    printer(PRINTER_X, MEJA_Y, 0);
    peti(PETI_X, MEJA_Y, PETI_W, PETI_H);
    tablet(PETI_X, MEJA_Y - PETI_H, .8, 1, 0);
    kru(420, P_Y, P_U, { ...feel('love', t), lookX: .7, baju: '#E8833A', aR: .1, armR: (u, sw) => botol(0, 0, BOTOL_U * .85, sw), boilKey: 'p1' });
    kru(700, P_Y, P_U, { ...feel('happy', t + .3), lookX: .7, baju: '#3F9A7A', rambut: '#3B2A20', sanggul: true, aR: .1, armR: (u, sw) => botol(0, 0, BOTOL_U * .85, sw), boilKey: 'p2' });
    const kepala = toScreen(KRU_X, KRU_Y - 11 * KRU_U), [jx, jy] = toScreen(1560, 260);
    camEnd();
    if (lt < .6) iris(jx, jy, lerp(112, 2000, easeIn(lt / .6)));
    if (lt > dur - 1) iris(...kepala, lerp(1700, 0, ease(seg(lt, dur - 1, dur - .15))));
  }


  // ---------- video perkenalan: dua potongan ----------
  // K1 (0–7.6): shot A diperlambat di bagian menulis, lalu runtuh; tertutup sapuan navy di 7.6.
  // K8 (7.6–15.8): pagi; dibuka dari sapuan navy, kru lega lalu melambai; logo ditumpuk oleh video master.
  const WARP = [[0, 0], [1.6, 1.6], [4.4, 2.4], [5.0, 3.0], [6.2, 4.0], [7.3, 4.3], [7.6, 4.6]];
  const warp = lt => { let i = 0; while (i < WARP.length - 2 && lt > WARP[i + 1][0]) i++; const [a0, b0] = WARP[i], [a1, b1] = WARP[i + 1]; return b0 + (b1 - b0) * clamp((lt - a0) / (a1 - a0)); };
  const malam = (t, lt) => shotA(t, warp(lt), 4.6);
  function pagi(t, lt, dur) {
    camBegin(980, 600, kf(lt, [[0, 1.08], [dur, 1.14]]));
    dunia(t, 1);
    const lambai = (lt > 1.4 && lt < 3.2) || (lt > 5.2 && lt < 6.6) ? 1.25 + .35 * Math.sin((lt - 1.4) * TAU * 2) : null;
    const muka = emotions(lt, [[0, 'relieved'], [1.2, 'happy'], [4.6, 'proud']]);
    kru(KRU_X, KRU_Y, KRU_U, { ...muka, ...(lambai != null ? { aL: lambai } : {}), topi: 'kru', celemek: true, boilKey: 'kru' });
    meja(t);
    for (let i = 0; i < 4; i++) struk(820 + i * 3, MEJA_Y - 8 - i * 6, Math.PI / 2 + (hash(i) - .5) * .1);
    printer(PRINTER_X, MEJA_Y, 0);
    peti(PETI_X, MEJA_Y, PETI_W, PETI_H);
    tablet(PETI_X, MEJA_Y - PETI_H, .8, 1, 0);
    kru(420, P_Y, P_U, { ...feel('love', t), lookX: .7, baju: '#E8833A', aR: .1, armR: (u, sw) => botol(0, 0, BOTOL_U * .85, sw), boilKey: 'p1' });
    kru(700, P_Y, P_U, { ...feel('happy', t + .3), lookX: .7, baju: '#3F9A7A', rambut: '#3B2A20', sanggul: true, aR: .1, armR: (u, sw) => botol(0, 0, BOTOL_U * .85, sw), boilKey: 'p2' });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NAVY_WIPE);
  }
  shots([[0, malam], [7.6, pagi]]);
})();
