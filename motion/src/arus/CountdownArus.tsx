import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, monoFamily} from '../theme';
import {Logo} from '../components/common';
import {Grain, cl, ease, easeIn, shake} from '../showreel/fx';
import {A} from './beats';

// Hitung mundur 10 → 1 detik bergaya ARUS. 120 BPM: 1 detik = 2 ketukan = 60 frame.
// Waktu harus sama dengan scripts/make_arus_countdown_music.py.
export const CDA_FPS = 60;
const BT = 30;
const INTRO = 4;
const ANGKA = 24;
const GAP = 25;
const TOTAL = 38;
export const CDA_FRAMES = TOTAL * BT;
const bt = (x: number) => Math.round(x * BT);

const useUkuran = () => {
  const {width: W, height: H} = useVideoConfig();
  return {W, H, tegak: H > W, u: Math.min(W, H) / 1080};
};
const big: React.CSSProperties = {fontFamily, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.82, whiteSpace: 'nowrap'};
const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: monoFamily, fontWeight: 500, fontSize: 24, letterSpacing: 3, ...style}}>{children}</div>
);

const LANGKAH = ['PESAN', 'SETUJU', 'PILAH', 'PUR', 'PO', 'GRPO', 'KIRIM', 'TERIMA', 'JUAL', 'DO'];
// [latar, bidang yang menyapu, warna pita]
const WARNA: [string, string, string][] = [
  [A.ink, A.orange, A.navy],
  [A.orange, A.navy, A.ink],
  [A.white, A.orange, A.navy],
  [A.navy, A.white, A.orange],
  [A.ink, A.orange, A.navy],
  [A.orange, A.ink, A.white],
  [A.white, A.navy, A.orange],
  [A.navy, A.orange, A.ink],
  [A.orange, A.white, A.navy],
  [A.ink, A.orange, A.white],
];
const kontras = (bg: string) => (bg === A.white || bg === A.orange ? A.ink : A.white);

const Tetes: React.FC = () => {
  const f = useCurrentFrame();
  const {W, H} = useUkuran();
  const hit = bt(0.5);
  const jatuh = interpolate(f, [0, hit], [0, 1], {...cl, easing: easeIn});
  const out = interpolate(f, [bt(3.4), bt(4)], [1, 0], cl);
  return (
    <AbsoluteFill style={{background: '#05080F'}}>
      {f < hit ? <div style={{position: 'absolute', left: W / 2 - 14, top: -60 + jatuh * (H * 0.54 + 60), width: 28, height: 40, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: A.orange, boxShadow: `0 0 30px ${A.orange}`}} /> : null}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: out}}>
        {[0, 1, 2, 3, 4].map((k) => {
          const t0 = hit + k * 8;
          const p = interpolate(f, [t0, t0 + 100], [0, 1], cl);
          return f >= t0 ? <ellipse key={k} cx={W / 2} cy={H * 0.54} rx={30 + p * 1100} ry={(30 + p * 1100) * 0.32} fill="none" stroke={k % 2 ? A.electric : A.orange} strokeWidth={6 * (1 - p) + 1} opacity={1 - p} /> : null;
        })}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: interpolate(f, [bt(1.2), bt(2)], [0, 1], cl) * out}}>
        <Mono style={{color: '#8FA6D8', fontSize: 30, letterSpacing: 10}}>HITUNG MUNDUR</Mono>
        <div style={{...big, fontSize: 90, color: 'white', marginTop: 18}}>PID POS</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Detik: React.FC<{k: number}> = ({k}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {tegak} = useUkuran();
  const n = 10 - k;
  const [bg, plane, pita] = WARNA[k];
  const dur = bt(2);
  const s = spring({frame: f, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
  const split = interpolate(f, [4, dur], [-15, 115], cl);
  const last = k === 9;
  const hisap = last ? interpolate(f, [bt(1.2), dur], [0, 1], {...cl, easing: easeIn}) : 0;
  const angka = (color: string) => (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{...big, fontSize: tegak ? 900 : 820, color, transform: `scale(${(0.7 + 0.3 * s) * (1 - hisap)}) rotate(${hisap * 200}deg)`, marginTop: -60}}>{n}</div>
    </AbsoluteFill>
  );
  const pitaX = ((f * (k % 2 ? 18 : -18)) % 1600) - (k % 2 ? 1600 : 0);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', transform: shake(f, [0], 22)}}>
      {angka(plane)}
      <AbsoluteFill style={{background: plane, clipPath: `polygon(0 0, ${split}% 0, ${split - 14}% 100%, 0 100%)`}}>{angka(bg)}</AbsoluteFill>
      {/* pita kata langkah, miring di bawah */}
      <div style={{position: 'absolute', left: -200, right: -200, bottom: tegak ? 260 : 70, height: tegak ? 150 : 130, background: pita, transform: `rotate(-6deg) scale(${1 - hisap})`, display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
        <div style={{...big, fontSize: 110, color: pita === A.white ? A.ink : pita === A.orange ? A.ink : A.white, transform: `translateX(${pitaX}px)`}}>
          {`${LANGKAH[k]} · `.repeat(14)}
        </div>
      </div>
      <Mono style={{position: 'absolute', left: 60, top: 50, color: kontras(bg), fontSize: 30, opacity: 1 - hisap}}>00:00:{String(n).padStart(2, '0')}</Mono>
      <Mono style={{position: 'absolute', right: 60, top: 50, color: kontras(bg), opacity: 1 - hisap}}>
        LANGKAH {String(k + 1).padStart(2, '0')} / 10 · {LANGKAH[k]}
      </Mono>
      {last ? <AbsoluteFill style={{background: '#05080F', opacity: hisap}} /> : null}
    </AbsoluteFill>
  );
};

const Peluncuran: React.FC<{tanggal?: string}> = ({tanggal}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {W, H, tegak} = useUkuran();
  const t3 = spring({frame: f - bt(5), fps, config: {damping: 14}});
  const mask = interpolate(f, [0, 24], [0, 2300], {...cl, easing: ease});
  const land = spring({frame: f - 4, fps, config: {damping: 10, stiffness: 220, mass: 0.6}});
  const t1 = spring({frame: f - bt(2), fps, config: {damping: 12}});
  const t2 = spring({frame: f - bt(3.5), fps, config: {damping: 14}});
  const colors = [A.orange, A.electric, A.navy];
  return (
    <AbsoluteFill style={{background: A.paper, clipPath: `circle(${mask}px at 50% 50%)`, alignItems: 'center', justifyContent: 'center', fontFamily}}>
      {Array.from({length: 36}).map((_, i) => {
        const a = random(`pa${i}`) * Math.PI * 2;
        const d = f * (12 + random(`pd${i}`) * 18) * Math.exp(-f / 50);
        const o = interpolate(f, [0, 60], [1, 0], cl);
        return <div key={i} style={{position: 'absolute', left: W / 2 + Math.cos(a) * d, top: H / 2 + Math.sin(a) * d, width: 70, height: 14, background: colors[i % 3], transform: `rotate(${(a * 180) / Math.PI}deg)`, opacity: o}} />;
      })}
      {[0, 1, 2].map((k) => {
        const p = interpolate(f, [k * 6, 50 + k * 6], [0, 1], cl);
        return <div key={k} style={{position: 'absolute', width: 300 + p * 1500, height: 300 + p * 1500, borderRadius: '50%', border: `${8 * (1 - p)}px solid ${k === 1 ? A.electric : A.orange}`, opacity: 1 - p}} />;
      })}
      <div style={{transform: `scale(${(0.5 + 0.5 * land) * (tegak ? 0.72 : 1)})`}}>
        <Logo size={1.0} />
      </div>
      <div style={{...big, fontSize: tegak ? 118 : 150, color: A.navy, marginTop: tegak ? 50 : 70, transform: `scale(${t1})`}}>
        SATU APLIKASI<span style={{color: A.orange}}>.</span>
      </div>
      <div style={{marginTop: 50, background: A.orange, color: A.ink, fontWeight: 800, fontSize: 44, padding: '12px 34px', transform: `scale(${t2}) rotate(-2deg)`}}>
        SIAP DIGUNAKAN
      </div>
      {tanggal ? (
        <div style={{marginTop: 40, background: A.navy, color: 'white', fontWeight: 800, fontSize: tegak ? 46 : 42, padding: '14px 40px', borderRadius: 999, transform: `scale(${t3})`}}>
          {tanggal}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const CountdownArus: React.FC<{tanggal?: string}> = ({tanggal}) => {
  const f = useCurrentFrame();
  const fadeEnd = interpolate(f, [bt(TOTAL - 1.5), CDA_FRAMES], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: '#05080F', fontFamily}}>
      <Sequence durationInFrames={bt(INTRO)}>
        <Tetes />
      </Sequence>
      {Array.from({length: 10}).map((_, k) => (
        <Sequence key={k} from={bt(INTRO + 2 * k)} durationInFrames={bt(2)}>
          <Detik k={k} />
        </Sequence>
      ))}
      <Sequence from={bt(GAP)} durationInFrames={CDA_FRAMES - bt(GAP)}>
        <Peluncuran tanggal={tanggal} />
      </Sequence>
      {f >= bt(GAP) && f < bt(GAP) + 8 ? <AbsoluteFill style={{background: 'white', opacity: 1 - (f - bt(GAP)) / 8}} /> : null}
      <AbsoluteFill style={{background: A.ink, opacity: fadeEnd}} />
      <Grain opacity={0.07} />
      <Audio src={staticFile('music/arus_countdown.wav')} />
    </AbsoluteFill>
  );
};
