// Lembar model tokoh: kru toko dan dua penumpang, dalam beberapa emosi. Buka studio.html?loop=kru.
LOOPS.kru = t => {
  boilSeed('latar'); paint(rectPts(-20, -20, W + 40, H + 40), { wash: '#EFE4CF', ink: null });
  const E = ['neutral', 'nervous', 'scared', 'dizzy', 'surprised', 'idea', 'happy', 'proud'];
  E.forEach((e, i) => kru(150 + i * 232, 470, 17, { ...feel(e, t), topi: 'kru', celemek: true, boilKey: 'm' + i }));
  kru(330, 1020, 20, { ...feel('bored', t), baju: '#E8833A', boilKey: 'p1', armR: (u, sw) => botol(0, 0, u * .9, sw) });
  kru(760, 1020, 20, { ...feel('love', t), baju: '#3F9A7A', rambut: '#3B2A20', sanggul: true, boilKey: 'p2' });
  kru(1200, 1020, 20, { ...feel('angry', t), baju: '#C9455A', topi: 'caping', boilKey: 'p3' });
  kru(1640, 1020, 26, { ...feel('determined', t), topi: 'kru', celemek: true, aR: .6, boilKey: 'big' });
};
LOOPS.kru.len = 2;
// botol air minum biru, tanpa tulisan
function botol(x, y, u, sw) {
  paint(rrPts(x - .7 * u, y - 2.6 * u, 1.4 * u, 3.4 * u, .4 * u), { wash: '#9FD3EE', ink: PAL.ink, sw: sw * .7 });
  paint(rectPts(x - .72 * u, y - 1.6 * u, 1.44 * u, .9 * u), { wash: '#2E7CC4', ink: null });
  paint(rectPts(x - .38 * u, y - 3.3 * u, .76 * u, .7 * u), { wash: '#1F5FA8', ink: PAL.ink, sw: sw * .6 });
}
