import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {fontFamily, monoFamily} from '../theme';
import {SR, BEAT_F} from './beats';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1); // keluar cepat, berhenti halus
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

// Guncangan kamera yang meluruh setelah setiap hentakan.
export const shake = (f: number, hits: number[], amp = 18) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const d = f - h;
    if (d >= 0 && d < 14) {
      const k = Math.exp(-d / 3.5) * amp;
      x += (random(`sx${h}-${d}`) - 0.5) * 2 * k;
      y += (random(`sy${h}-${d}`) - 0.5) * 2 * k;
    }
  }
  return `translate(${x}px, ${y}px)`;
};

// Hentakan: skala dari besar ke normal dengan squash.
export const slam = (f: number, at: number, fps: number) => {
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});
  const sc = interpolate(s, [0, 1], [1.9, 1]);
  const sq = 1 + Math.sin(Math.min(1, Math.max(0, (f - at) / 8)) * Math.PI) * 0.12;
  return {scale: sc, squash: sq, on: f >= at ? 1 : 0};
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${Math.floor(f / 2)}`) * 512);
  const y = Math.floor(random(`gy${Math.floor(f / 2)}`) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('showreel/grain.png')})`,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`}}
  />
);

// Kata raksasa dengan gema huruf kerangka di belakangnya.
export const BigWord: React.FC<{
  text: string;
  size: number;
  color: string;
  echo?: string;
  echoes?: number;
  f: number;
  style?: React.CSSProperties;
}> = ({text, size, color, echo, echoes = 4, f, style}) => (
  <div style={{position: 'relative', ...style}}>
    {echo
      ? Array.from({length: echoes}).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              fontFamily,
              fontWeight: 800,
              fontSize: size,
              letterSpacing: -size * 0.04,
              lineHeight: 0.9,
              color: 'transparent',
              WebkitTextStroke: `2px ${echo}`,
              opacity: 0.5 - i * 0.1,
              transform: `scale(${1 + (i + 1) * 0.09 + Math.sin(f / 20 + i) * 0.01}) translateX(${(i + 1) * Math.sin(f / 30) * 6}px)`,
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {text}
          </div>
        ))
      : null}
    <div
      style={{
        position: 'relative',
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -size * 0.04,
        lineHeight: 0.9,
        color,
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  </div>
);

// Teks dengan pergeseran warna RGB singkat (glitch).
export const Glitch: React.FC<{children: React.ReactNode; f: number; at: number; style?: React.CSSProperties}> = ({
  children,
  f,
  at,
  style,
}) => {
  const d = f - at;
  const on = d >= 0 && d < 6;
  const off = on ? (random(`gl${at}-${d}`) - 0.5) * 30 : 0;
  return (
    <div style={{position: 'relative', ...style}}>
      {on ? (
        <>
          <div style={{position: 'absolute', inset: 0, color: '#FF2E63', transform: `translateX(${off}px)`, mixBlendMode: 'screen'}}>
            {children}
          </div>
          <div style={{position: 'absolute', inset: 0, color: '#00E5FF', transform: `translateX(${-off}px)`, mixBlendMode: 'screen'}}>
            {children}
          </div>
        </>
      ) : null}
      <div style={{position: 'relative'}}>{children}</div>
    </div>
  );
};

// Angka yang berputar seperti papan stasiun sebelum berhenti.
export const NumberRoll: React.FC<{value: string; f: number; at: number; dur?: number; style?: React.CSSProperties}> = ({
  value,
  f,
  at,
  dur = 18,
  style,
}) => {
  const chars = value.split('');
  return (
    <span style={{fontFamily: monoFamily, fontWeight: 800, ...style}}>
      {chars.map((c, i) => {
        const stop = at + dur * 0.4 + i * (dur * 0.6) / chars.length;
        const show = !/[0-9]/.test(c) || f >= stop ? c : f < at ? '' : String(Math.floor(random(`n${at}${i}${f}`) * 10));
        return <span key={i}>{show}</span>;
      })}
    </span>
  );
};

// Tiga chevron PELNI. progress 0..1 menggambar garisnya, fill 0..1 mengisi warnanya.
export const Chevrons: React.FC<{size: number; progress: number; fill?: number; color?: string; stroke?: number}> = ({
  size,
  progress,
  fill = 0,
  color = SR.orange,
  stroke = 10,
}) => {
  const paths = [0, 1, 2].map((i) => {
    const x = i * 0.22;
    return `M ${x} 0 L ${x + 0.42} 0.5 L ${x} 1`;
  });
  return (
    <svg width={size * 0.9} height={size} viewBox="-0.05 -0.05 0.95 1.1" style={{overflow: 'visible'}}>
      {paths.map((d, i) => {
        const p = interpolate(progress, [i * 0.18, i * 0.18 + 0.64], [0, 1], cl);
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={(stroke / size) * (1 + fill * 1.6)}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={1 - i * 0.18 * (1 - fill)}
          />
        );
      })}
    </svg>
  );
};

export const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: monoFamily, fontWeight: 500, fontSize: 22, letterSpacing: 2, ...style}}>{children}</div>
);

// Kilatan putih singkat.
export const Flash: React.FC<{at: number; len?: number; color?: string}> = ({at, len = 6, color = 'white'}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + len], [0, 1, 0], cl);
  return o > 0 ? <AbsoluteFill style={{background: color, opacity: o}} /> : null;
};

export const useBeatPulse = () => {
  const f = useCurrentFrame();
  const ph = (f % BEAT_F) / BEAT_F;
  return Math.exp(-ph * 6);
};

export const ScreenCard: React.FC<{img: string; w: number; style?: React.CSSProperties}> = ({img, w, style}) => (
  <div
    style={{
      width: w,
      borderRadius: 18,
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 40px 80px rgba(5,10,30,0.35)',
      ...style,
    }}
  >
    <div style={{height: 30, background: '#E4EAF4', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14}}>
      {['#F26B5B', '#F5BE4F', '#5BC46A'].map((c) => (
        <div key={c} style={{width: 10, height: 10, borderRadius: 5, background: c}} />
      ))}
    </div>
    <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', display: 'block'}} />
  </div>
);

export const useVC = useVideoConfig;
