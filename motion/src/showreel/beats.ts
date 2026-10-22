// Peta ketukan showreel: 124 BPM, 60 fps, 124 ketukan = 60 detik.
// Harus sama dengan scripts/make_music.py.
export const SR_FPS = 60;
export const BPM = 124;
export const BEAT_F = (SR_FPS * 60) / BPM; // 29,03 frame per ketukan
export const TOTAL_BEATS = 124;
export const SR_FRAMES = Math.round(TOTAL_BEATS * BEAT_F); // 3600

export const b = (beat: number) => Math.round(beat * BEAT_F);

export const ACT = {
  percikan: 0,
  kata: 8,
  laut: 20,
  alur: 36,
  layar: 56,
  kasir: 76,
  tembok: 92,
  logo: 104,
  akhir: 124,
} as const;

// Frame lokal di dalam babak untuk ketukan absolut `beat`.
export const lb = (act: number, beat: number) => b(beat) - b(act);

export const SR = {
  ink: '#0B1430',
  navy: '#1F3B7A',
  electric: '#3D8BFF',
  orange: '#FF6B1A',
  green: '#22C55E',
  white: '#FFFFFF',
  paper: '#F4F7FC',
};
