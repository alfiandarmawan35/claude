// Peta ketukan showreel "ARUS": 128 BPM, 60 fps, 96 ketukan = 45 detik. Harus sama dengan scripts/make_arus_music.py.
export const AR_FPS = 60;
export const BEAT_F = (60 * 60) / 128; // 28,125 frame
export const TOTAL_BEATS = 96;
export const AR_FRAMES = Math.round(TOTAL_BEATS * BEAT_F);
export const b = (beat: number) => Math.round(beat * BEAT_F);
export const lb = (act: number, beat: number) => b(beat) - b(act);

export const ACT = {tetes: 0, kata: 6, kapal: 16, terowongan: 30, sapuan: 42, mosaik: 48, kasir: 64, hening: 76, muara: 80, akhir: 96} as const;

export const A = {ink: '#0B1430', navy: '#1F3B7A', orange: '#FF6B1A', white: '#FFFFFF', paper: '#F3F5F9', electric: '#3D8BFF', green: '#22C55E'};
