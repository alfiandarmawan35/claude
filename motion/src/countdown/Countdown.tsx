import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, ROLES} from '../theme';
import {Logo} from '../components/common';
import {NODES, REVEAL as URUTAN} from '../components/FlowMap';
import {BigWord, Chevrons, Flash, Grain, Mono, Vignette, cl, ease, easeIn, shake, slam} from '../showreel/fx';
import {SR} from '../showreel/beats';
import {BEAT, INTRO, N, PER, REVEAL, CD_FRAMES, bt} from './timing';

// Video hitung mundur peluncuran: 9 → 1, setiap angka satu tahap alur, lalu logo. Menyesuaikan 16:9 dan 9:16.

const TAHAP = URUTAN.map((id) => NODES.find((n) => n.id === id)!);

const useLayout = () => {
  const {width, height} = useVideoConfig();
  const tegak = height > width;
  const u = Math.min(width, height) / 1080;
  return {width, height, tegak, u};
};

// Cincin hitung mundur dengan 60 garis detik di sekelilingnya.
const Cincin: React.FC<{r: number; p: number; color: string; f: number}> = ({r, p, color, f}) => {
  const ticks = Array.from({length: 60});
  const lit = Math.floor(((f / BEAT) % 60));
  return (
    <svg width={r * 2.6} height={r * 2.6} viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`} style={{overflow: 'visible'}}>
      {ticks.map((_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const long = i % 5 === 0;
        const r1 = r * 1.12;
        const r2 = r * (long ? 1.22 : 1.17);
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke={i === lit ? SR.orange : 'rgba(143,184,255,0.45)'}
            strokeWidth={long ? r * 0.018 : r * 0.009}
            strokeLinecap="round"
          />
        );
      })}
      <circle r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={r * 0.05} />
      <circle
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={r * 0.05}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={p}
        transform="rotate(-90)"
        style={{filter: `drop-shadow(0 0 ${r * 0.06}px ${color})`}}
      />
    </svg>
  );
};

const Pembuka: React.FC = () => {
  const f = useCurrentFrame();
  const {u} = useLayout();
  const draw = interpolate(f, [0, bt(2.5)], [0, 1], {...cl, easing: ease});
  const fill = interpolate(f, [bt(2.5), bt(3)], [0, 1], cl);
  const out = interpolate(f, [bt(3.4), bt(4)], [1, 0], {...cl, easing: easeIn});
  const zoom = interpolate(f, [bt(3.4), bt(4)], [1, 4], {...cl, easing: easeIn});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{transform: `scale(${zoom})`, filter: `drop-shadow(0 0 ${30 * u}px ${SR.orange})`}}>
        <Chevrons size={300 * u} progress={draw} fill={fill} />
      </div>
      <Mono style={{color: '#8FA6D8', fontSize: 30 * u, letterSpacing: 8 * u, marginTop: 60 * u, opacity: interpolate(f, [bt(1), bt(2)], [0, 1], cl)}}>
        HITUNG MUNDUR PELUNCURAN
      </Mono>
      <div style={{fontFamily, fontWeight: 800, color: 'white', fontSize: 64 * u, marginTop: 16 * u, opacity: interpolate(f, [bt(1.5), bt(2.5)], [0, 1], cl)}}>
        PID POS
      </div>
    </AbsoluteFill>
  );
};

const Angka: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {tegak, u, width, height} = useLayout();
  const dur = bt(PER);
  const n = N - i;
  const t = TAHAP[i];
  const col = ROLES[t.roles[0]].color;
  const s = slam(f, 0, fps);
  const p = interpolate(f, [0, dur], [0, 1], cl);
  const keluar = interpolate(f, [dur - 8, dur], [0, 1], {...cl, easing: easeIn});
  const lbl = spring({frame: f - 6, fps, config: {damping: 14}});
  const r = 300 * u;
  const cx = tegak ? width / 2 : width * 0.36;
  const cy = tegak ? height * 0.38 : height / 2;
  return (
    <AbsoluteFill style={{transform: shake(f, [0], 20 * u)}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${(cx / width) * 100}% ${(cy / height) * 100}%, ${col}55 0%, rgba(0,0,0,0) 45%)`}} />
      <div style={{position: 'absolute', left: cx - r * 1.3, top: cy - r * 1.3, opacity: 1 - keluar, transform: `scale(${1 + keluar * 0.3})`}}>
        <Cincin r={r} p={p} color={col} f={f} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: cx - 400 * u,
          width: 800 * u,
          top: cy - 260 * u,
          height: 520 * u,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${s.scale * (1 + keluar * 0.6)}) scaleY(${s.squash})`,
          opacity: 1 - keluar,
        }}
      >
        <BigWord text={String(n)} size={460 * u} color="white" echo={col} echoes={3} f={f} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: tegak ? 80 * u : width * 0.6,
          right: tegak ? 80 * u : 110 * u,
          top: tegak ? height * 0.66 : height / 2 - 170 * u,
          textAlign: tegak ? 'center' : 'left',
          transform: `translate${tegak ? 'Y' : 'X'}(${(1 - lbl) * 120 * u}px)`,
          opacity: lbl * (1 - keluar),
          fontFamily,
        }}
      >
        <Mono style={{color: '#8FA6D8', fontSize: 26 * u, letterSpacing: 6 * u}}>TAHAP {i + 1} / 9</Mono>
        <div style={{fontSize: 96 * u, fontWeight: 800, color: 'white', lineHeight: 1.0, marginTop: 14 * u, letterSpacing: -2 * u}}>{t.label}</div>
        <div style={{display: 'flex', gap: 12 * u, marginTop: 26 * u, justifyContent: tegak ? 'center' : 'flex-start', flexWrap: 'wrap'}}>
          {t.roles.map((rk) => (
            <div key={rk} style={{background: ROLES[rk].color, color: 'white', fontWeight: 700, fontSize: 30 * u, padding: `${8 * u}px ${20 * u}px`, borderRadius: 999}}>
              {ROLES[rk].name}
            </div>
          ))}
        </div>
        {t.sap ? (
          <div style={{marginTop: 22 * u, color: '#7EE2A0', fontWeight: 700, fontSize: 28 * u}}>✓ SAP · {t.sap}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Peluncuran: React.FC<{tanggal?: string}> = ({tanggal}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, tegak} = useLayout();
  const mask = interpolate(f, [0, 24], [0, 2400 * u], {...cl, easing: ease});
  const land = spring({frame: f - 8, fps, config: {damping: 9, stiffness: 110}});
  const t1 = spring({frame: f - bt(2), fps, config: {damping: 12}});
  const t2 = spring({frame: f - bt(3), fps, config: {damping: 14}});
  const t3 = spring({frame: f - bt(4), fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: SR.paper, clipPath: `circle(${mask}px at 50% 50%)`, alignItems: 'center', justifyContent: 'center', fontFamily}}>
      {Array.from({length: 30}).map((_, i) => {
        const a = random(`ca${i}`) * Math.PI * 2;
        const d = f * (10 + random(`cd${i}`) * 18) * u * Math.exp(-f / 55);
        const o = interpolate(f, [0, 60], [1, 0], cl);
        return (
          <div key={i} style={{position: 'absolute', left: '50%', top: '45%', transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) rotate(${(a * 180) / Math.PI}deg)`, opacity: o}}>
            <Chevrons size={(28 + random(`cs${i}`) * 30) * u} progress={1} fill={1} color={i % 3 ? SR.orange : SR.electric} stroke={6} />
          </div>
        );
      })}
      <div style={{transform: `scale(${(0.4 + 0.6 * land) * (tegak ? 0.7 : 1)})`}}>
        <Logo size={1.0 * u} />
      </div>
      <div style={{fontSize: (tegak ? 110 : 120) * u, fontWeight: 800, color: SR.orange, marginTop: 50 * u, letterSpacing: -3 * u, transform: `scale(${t1})`}}>
        Siap digunakan
      </div>
      <div style={{fontSize: 44 * u, fontWeight: 600, color: SR.navy, marginTop: 18 * u, opacity: t2, textAlign: 'center', padding: `0 ${60 * u}px`}}>
        Satu alur, dari kapal sampai kasir.
      </div>
      {tanggal ? (
        <div style={{marginTop: 36 * u, background: SR.navy, color: 'white', fontWeight: 800, fontSize: 40 * u, padding: `${14 * u}px ${36 * u}px`, borderRadius: 999, opacity: t3}}>
          {tanggal}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Countdown: React.FC<{tanggal?: string}> = ({tanggal}) => {
  const f = useCurrentFrame();
  const gelap = interpolate(f, [bt(REVEAL - 1), bt(REVEAL - 0.6)], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: SR.ink, overflow: 'hidden'}}>
      <Sequence durationInFrames={bt(INTRO)}>
        <Pembuka />
      </Sequence>
      {Array.from({length: N}).map((_, i) => (
        <Sequence key={i} from={bt(INTRO + PER * i)} durationInFrames={bt(PER)}>
          <Angka i={i} />
        </Sequence>
      ))}
      <AbsoluteFill style={{background: 'black', opacity: f < bt(REVEAL) ? gelap : 0}} />
      <Sequence from={bt(REVEAL)} durationInFrames={CD_FRAMES - bt(REVEAL)}>
        <Peluncuran tanggal={tanggal} />
      </Sequence>
      <Flash at={bt(REVEAL)} len={12} />
      {f < bt(REVEAL) ? <Vignette strength={0.45} /> : null}
      <Grain opacity={0.07} />
      <Audio src={staticFile('music/countdown.wav')} />
    </AbsoluteFill>
  );
};
