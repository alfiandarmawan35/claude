// Peta waktu video hitung mundur: 120 BPM, 60 fps, 1 ketukan = 30 frame. Harus sama dengan scripts/make_countdown_music.py.
export const CD_FPS = 60;
export const BEAT = 30;
export const INTRO = 4; // ketukan pembuka
export const PER = 3; // ketukan per angka
export const N = 9; // 9 → 1
export const REVEAL = INTRO + PER * N + 1; // 32: satu ketukan hening sebelum peluncuran
export const TOTAL_BEATS = REVEAL + 12;
export const CD_FRAMES = TOTAL_BEATS * BEAT;
export const bt = (b: number) => Math.round(b * BEAT);
