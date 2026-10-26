// Potongan isometrik untuk video perkenalan: film "Satu Alur" detik 5,6–30,5 dipadatkan menjadi 13,3 detik (?warp=1).
const Q = new URLSearchParams(location.search);
const cv = document.getElementById('c'), g = cv.getContext('2d');
for (const w of [400, 500, 600, 700, 800]) await document.fonts.load(`${w} 40px Jakarta`);
const film = await import('./film.js');
const T0 = 5.6, T1 = 30.5, DUR = 13.3;
window.DUR = DUR; window.EV = [];
window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); film.render(g, T0 + t * (T1 - T0) / DUR, new URLSearchParams('nosub=1')); };
window.READY = true;
