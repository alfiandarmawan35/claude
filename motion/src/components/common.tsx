import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, fontFamily} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Masuk dan keluar halus untuk satu adegan.
export const useFade = (durationInFrames: number, inF = 12, outF = 12) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [0, inF], [0, 1], clamp),
    interpolate(f, [durationInFrames - outF, durationInFrames], [1, 0], clamp),
  );
};

export const useRise = (delay = 0, dist = 40) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 200}, durationInFrames: 20});
  return {opacity: s, transform: `translateY(${(1 - s) * dist}px)`};
};

export const Page: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = C.bg}) => (
  <AbsoluteFill style={{background: bg, fontFamily, color: C.ink}}>{children}</AbsoluteFill>
);

// Latar dengan bentuk lembut yang bergerak pelan.
export const SoftBackground: React.FC<{accent?: string}> = ({accent = C.navy}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          right: -380 + Math.sin(f / 90) * 20,
          top: -520,
          background: accent,
          opacity: 0.07,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          left: -300,
          bottom: -460 + Math.cos(f / 80) * 20,
          background: C.navy,
          opacity: 0.05,
        }}
      />
    </AbsoluteFill>
  );
};

export const Chip: React.FC<{color: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  color,
  children,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 22px',
      borderRadius: 999,
      background: color,
      color: 'white',
      fontWeight: 700,
      fontSize: 26,
      ...style,
    }}
  >
    {children}
  </div>
);

export const ContohTag: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      right: 14,
      bottom: 12,
      background: 'rgba(20,40,90,0.75)',
      color: 'white',
      fontSize: 18,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 8,
    }}
  >
    Contoh data uji
  </div>
);

// Gambar layar dalam bingkai browser: diperbesar pelan, atau digulir bila gambarnya tinggi.
export const Screen: React.FC<{
  src: string;
  dims: [number, number];
  box: {x: number; y: number; w: number; h: number};
  durationInFrames: number;
  focus?: [number, number, number, number];
}> = ({src, dims, box, durationInFrames, focus}) => {
  const f = useCurrentFrame();
  const bar = 44;
  const innerH = box.h - bar;
  const [iw, ih] = dims;
  const fitW = box.w;
  const fitH = (ih / iw) * fitW;
  const t = interpolate(f, [15, durationInFrames - 15], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  let wrap: React.CSSProperties;
  let w = fitW;
  let h = fitH;
  let scale = 1;
  if (fitH > innerH * 1.08 && !focus) {
    // Gambar tinggi: tampil selebar bingkai lalu digulir ke bawah.
    wrap = {left: 0, top: 0, transform: `translateY(${-(fitH - innerH) * t}px)`};
  } else {
    if (fitH > innerH) {
      h = innerH;
      w = (iw / ih) * h;
    }
    // Dengan sorotan: perbesar ke arah kotak sorot sampai kotaknya kira-kira separuh bingkai.
    const target = focus
      ? Math.max(1.1, Math.min(1.9, (0.55 * box.w) / (focus[2] * w), (0.55 * innerH) / (focus[3] * h)))
      : 1.05;
    scale = focus
      ? interpolate(f, [25, 70], [1, target], {...clamp, easing: Easing.inOut(Easing.cubic)})
      : interpolate(t, [0, 1], [1, target]);
    const origin = focus
      ? `${(focus[0] + focus[2] / 2) * 100}% ${(focus[1] + focus[3] / 2) * 100}%`
      : '50% 50%';
    wrap = {left: (box.w - w) / 2, top: (innerH - h) / 2, transform: `scale(${scale})`, transformOrigin: origin};
  }
  const fo = interpolate(f, [20, 35], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: 18,
        background: 'white',
        boxShadow: '0 30px 60px rgba(20,40,90,0.18)',
        overflow: 'hidden',
      }}
    >
      <div style={{height: bar, background: '#E4EAF4', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 18}}>
        {['#F26B5B', '#F5BE4F', '#5BC46A'].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        ))}
        <div
          style={{
            marginLeft: 20,
            background: 'white',
            borderRadius: 8,
            padding: '4px 16px',
            fontSize: 18,
            color: C.muted,
          }}
        >
          pos-dev.pidc.co.id
        </div>
      </div>
      <div style={{position: 'relative', width: box.w, height: innerH, overflow: 'hidden', background: '#F7F9FD'}}>
        <div style={{position: 'absolute', width: w, height: h, ...wrap}}>
          <img src={src} style={{width: '100%', height: '100%', display: 'block'}} />
          {focus ? (
            <div
              style={{
                position: 'absolute',
                left: `${focus[0] * 100}%`,
                top: `${focus[1] * 100}%`,
                width: `${focus[2] * 100}%`,
                height: `${focus[3] * 100}%`,
                border: '5px solid #F59E0B',
                borderRadius: 12,
                boxShadow: `0 0 0 4000px rgba(10,20,45,${0.45 * fo})`,
                opacity: fo,
              }}
            />
          ) : null}
        </div>
        <ContohTag />
      </div>
    </div>
  );
};

// Kartu dokumen SAP yang muncul saat dokumen terbentuk.
export const SapChip: React.FC<{label: string; delay: number; low?: boolean}> = ({label, delay, low}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14, stiffness: 120}});
  return (
    <div
      style={{
        position: 'absolute',
        right: 110,
        top: low ? 640 : 150,
        transform: `scale(${s}) rotate(${(1 - s) * -8}deg)`,
        opacity: Math.min(1, s * 1.5),
        background: C.green,
        color: 'white',
        borderRadius: 18,
        padding: '18px 28px',
        boxShadow: '0 20px 40px rgba(20,60,20,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          background: 'white',
          color: C.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        ✓
      </div>
      <div>
        <div style={{fontSize: 20, fontWeight: 600, opacity: 0.85}}>Terkirim ke SAP</div>
        <div style={{fontSize: 30, fontWeight: 800}}>{label}</div>
      </div>
    </div>
  );
};

// Logo resmi PELNI Services (diambil dari layar aplikasi) + nama aplikasi.
export const Logo: React.FC<{size?: number}> = ({size = 1}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 44 * size,
      background: 'white',
      borderRadius: 32 * size,
      padding: `${30 * size}px ${50 * size}px`,
      boxShadow: '0 20px 40px rgba(20,40,90,0.15)',
    }}
  >
    <Img src={staticFile('brand/pelni_services.png')} style={{width: 470 * size}} />
    <div style={{width: 4 * size, alignSelf: 'stretch', background: C.line, borderRadius: 2}} />
    <div style={{fontSize: 120 * size, fontWeight: 800, color: C.navy, letterSpacing: -2, lineHeight: 1}}>PID POS</div>
  </div>
);

// Logo kecil di pojok kanan atas setiap adegan episode.
export const CornerLogo: React.FC = () => (
  <Img
    src={staticFile('brand/pelni_services.png')}
    style={{position: 'absolute', right: 70, top: 26, width: 190, opacity: 0.95}}
  />
);

// Musik latar berulang. Volume turun saat narasi berbicara (ducking), naik di sela-selanya.
export const BedMusic: React.FC<{total: number; speech: [number, number][]}> = ({total, speech}) => {
  const RAMP = 10;
  const volume = (f: number) => {
    let duck = 0;
    for (const [a, b] of speech) {
      const k = interpolate(f, [a - RAMP, a, b, b + RAMP * 2], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      duck = Math.max(duck, k);
    }
    const fade = Math.min(
      interpolate(f, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      interpolate(f, [total - 75, total - 5], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    );
    return (0.4 - 0.25 * duck) * fade;
  };
  return <Audio src={staticFile('music/bed.wav')} loop volume={volume} />;
};
