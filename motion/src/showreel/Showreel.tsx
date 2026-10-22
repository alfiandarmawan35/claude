import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, monoFamily, ROLES, RoleKey} from '../theme';
import {Logo} from '../components/common';
import {FlowMap} from '../components/FlowMap';
import {ACT, b, lb, SR, SR_FRAMES, BEAT_F} from './beats';
import {
  BigWord,
  Chevrons,
  Flash,
  Glitch,
  Grain,
  Mono,
  NumberRoll,
  ScreenCard,
  Vignette,
  cl,
  ease,
  easeIn,
  shake,
  slam,
} from './fx';

const Dark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: SR.ink, color: 'white', fontFamily, overflow: 'hidden'}}>{children}</AbsoluteFill>
);
const Light: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: SR.paper, color: SR.navy, fontFamily, overflow: 'hidden'}}>{children}</AbsoluteFill>
);

// ---------- 1. Percikan ----------
const Percikan: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.percikan;
  const dot = spring({frame: f, fps, config: {damping: 12}});
  const stretch = interpolate(f, [lb(A, 1), lb(A, 3.2)], [0, 1], {...cl, easing: ease});
  const lineOut = interpolate(f, [lb(A, 4), lb(A, 4.6)], [1, 0], cl);
  const draw = interpolate(f, [lb(A, 4), lb(A, 6.6)], [0, 1], {...cl, easing: ease});
  const fill = interpolate(f, [lb(A, 6.6), lb(A, 7.4)], [0, 1], cl);
  const zoom = interpolate(f, [lb(A, 7.2), lb(A, 8)], [1, 6], {...cl, easing: easeIn});
  const w = 26 + stretch * 1300;
  return (
    <Dark>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(61,139,255,${0.18 * stretch}) 0%, rgba(0,0,0,0) 55%)`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: w,
            height: 26 - stretch * 14,
            borderRadius: 20,
            background: SR.orange,
            transform: `scale(${dot})`,
            opacity: lineOut,
            boxShadow: `0 0 ${40 + stretch * 60}px ${SR.orange}`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <div style={{filter: `drop-shadow(0 0 30px ${SR.orange})`}}>
          <Chevrons size={380} progress={draw} fill={fill} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
        <Mono style={{color: '#8FA6D8', opacity: interpolate(f, [lb(A, 2), lb(A, 3)], [0, 1], cl) * (1 - fill)}}>
          PT PELITA INDONESIA DJAYA &nbsp;·&nbsp; PID POS &nbsp;·&nbsp; 2026
        </Mono>
      </AbsoluteFill>
      <Vignette />
    </Dark>
  );
};

// ---------- 2. Ledakan kata ----------
const WORDS: [number, string][] = [
  [8, 'PESAN'],
  [10, 'SETUJUI'],
  [12, 'KIRIM'],
  [14, 'TERIMA'],
  [16, 'JUAL'],
];
const Kata: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.kata;
  const times = WORDS.map(([bt]) => lb(A, bt));
  let idx = 0;
  times.forEach((t, i) => {
    if (f >= t) idx = i;
  });
  const [, word] = WORDS[idx];
  const last = idx === WORDS.length - 1;
  const dark = idx % 2 === 0;
  const bg = last ? SR.ink : dark ? SR.ink : 'white';
  const fg = last ? SR.orange : dark ? 'white' : SR.navy;
  const echo = last ? SR.orange : dark ? SR.electric : SR.navy;
  const s = slam(f, times[idx], fps);
  const size = Math.min(400, 1650 / (word.length * 0.7));
  // Match cut: huruf A di JUAL membesar memenuhi layar.
  const zoom = interpolate(f, [lb(A, 18), lb(A, 20)], [1, 42], {...cl, easing: easeIn});
  const bar = interpolate((f - times[idx]) / BEAT_F, [0, 2], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: bg, fontFamily, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: shake(f, times, 22)}}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${zoom})`,
            transformOrigin: last ? '61.5% 52%' : '50% 50%',
          }}
        >
          <div style={{transform: `scale(${s.scale}) scaleY(${s.squash})`}}>
            <BigWord text={word} size={size} color={fg} echo={echo} f={f} />
          </div>
        </AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: 120,
            bottom: 150,
            height: 10,
            width: 1680 * bar,
            background: SR.orange,
            opacity: zoom > 2 ? 0 : 1,
          }}
        />
        <Mono style={{position: 'absolute', left: 120, top: 90, color: fg, opacity: zoom > 2 ? 0 : 0.8}}>
          0{idx + 1} / 05
        </Mono>
        <Mono style={{position: 'absolute', right: 120, top: 90, color: fg, opacity: zoom > 2 ? 0 : 0.8}}>
          SATU ALUR
        </Mono>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 3. Laut ----------
type P = [number, number];
const bez = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const ROUTE: [P, P, P, P] = [
  [-120, 820],
  [600, 420],
  [1250, 980],
  [2050, 560],
];

const Laut: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.laut;
  const dur = b(ACT.alur) - b(A);
  const iris = interpolate(f, [0, 20], [1500, 0], {...cl, easing: ease});
  const prog = interpolate(f, [lb(A, 20.5), lb(A, 34)], [0, 1], {...cl, easing: ease});
  const [sx, sy] = bez(...ROUTE, prog);
  const [sx2, sy2] = bez(...ROUTE, Math.min(1, prog + 0.01));
  const ang = (Math.atan2(sy2 - sy, sx2 - sx) * 180) / Math.PI;
  const out = interpolate(f, [dur - 14, dur], [1, 3.2], {...cl, easing: easeIn});
  const outO = interpolate(f, [dur - 10, dur], [1, 0], cl);
  const stats: [number, string, string][] = [
    [22, '1', 'KAPAL'],
    [26, '4', 'DEK'],
    [30, '1', 'ALUR'],
  ];
  return (
    <Dark>
      <AbsoluteFill style={{transform: `scale(${out})`, opacity: outO, filter: `blur(${(out - 1) * 6}px)`}}>
        {/* grid laut dalam perspektif */}
        <div
          style={{
            position: 'absolute',
            left: -1100,
            top: 380,
            width: 4100,
            height: 2400,
            transform: 'perspective(900px) rotateX(64deg)',
            transformOrigin: '50% 0%',
            backgroundImage: `linear-gradient(rgba(61,139,255,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(61,139,255,0.35) 2px, transparent 2px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: `0px ${(f * 5) % 120}px`,
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          }}
        />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, rgba(61,139,255,0.25), rgba(0,0,0,0) 60%)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <path
            d={`M ${ROUTE[0].join(' ')} C ${ROUTE[1].join(' ')}, ${ROUTE[2].join(' ')}, ${ROUTE[3].join(' ')}`}
            stroke={SR.orange}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - prog}
            style={{filter: `drop-shadow(0 0 18px ${SR.orange})`}}
          />
          {[0.18, 0.5, 0.82].map((p) => {
            const [x, y] = bez(...ROUTE, p);
            const on = prog > p;
            return (
              <g key={p} opacity={on ? 1 : 0.25}>
                <circle cx={x} cy={y} r={on ? 16 : 10} fill={on ? SR.orange : 'none'} stroke={SR.orange} strokeWidth={4} />
                <circle cx={x} cy={y} r={on ? 16 + ((f * 1.5) % 40) : 0} fill="none" stroke={SR.orange} strokeWidth={2} opacity={1 - ((f * 1.5) % 40) / 40} />
              </g>
            );
          })}
        </svg>
        {/* kapal */}
        <div style={{position: 'absolute', left: sx - 70, top: sy - 70, width: 140, height: 140, transform: `rotate(${ang}deg)`}}>
          <svg width={140} height={140} viewBox="-70 -70 140 140">
            <path d="M -60 -18 L 40 -18 L 66 0 L 40 18 L -60 18 Z" fill="white" />
            <rect x={-40} y={-10} width={50} height={20} rx={4} fill={SR.navy} />
            <circle cx={22} cy={0} r={5} fill={SR.orange} />
          </svg>
        </div>
        <Mono style={{position: 'absolute', left: 120, top: 90, color: '#8FA6D8'}}>KM AWU &nbsp;·&nbsp; VOYAGE 23/2026</Mono>
        <Mono style={{position: 'absolute', right: 120, top: 90, color: '#8FA6D8'}}>06°06′S &nbsp;106°53′E</Mono>
        <Mono style={{position: 'absolute', left: sx + 90, top: sy + 40, color: SR.orange, opacity: prog > 0.05 && prog < 0.97 ? 1 : 0}}>
          {Math.round(prog * 100)
            .toString()
            .padStart(3, '0')}{' '}
          NM
        </Mono>
        {/* angka raksasa */}
        {stats.map(([bt, num, word], i) => {
          const t0 = lb(A, bt);
          const t1 = i < stats.length - 1 ? lb(A, stats[i + 1][0]) : lb(A, 35);
          if (f < t0 || f >= t1) return null;
          const s = slam(f, t0, fps);
          const leave = interpolate(f, [t1 - 8, t1], [0, 1], {...cl, easing: easeIn});
          return (
            <div
              key={bt}
              style={{
                position: 'absolute',
                left: 140,
                top: 170,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 34,
                transform: `scale(${s.scale}) translateX(${-leave * 1400}px)`,
                transformOrigin: '0% 100%',
              }}
            >
              <div style={{fontSize: 420, fontWeight: 800, color: SR.orange, lineHeight: 0.8, letterSpacing: -20}}>{num}</div>
              <div style={{fontSize: 150, fontWeight: 800, color: 'white', lineHeight: 0.9, paddingBottom: 14}}>{word}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Vignette />
      {iris > 0 ? <AbsoluteFill style={{background: SR.orange, clipPath: `circle(${iris}px at 61.5% 52%)`}} /> : null}
    </Dark>
  );
};

// ---------- 4. Alur ----------
const SAPDOCS: [number, string, string][] = [
  [39, 'SALES ORDER', '266000699'],
  [43, 'PURCHASE REQUEST', '262000460'],
  [44.5, 'PURCHASE ORDER', '262002060'],
  [46, 'GRPO', '262001908'],
  [48, 'INV. TRANSFER', '262000146'],
  [52, 'DELIVERY', '266000512'],
];
const Alur: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.alur;
  const dur = b(ACT.layar) - b(A);
  const times = {
    pesan: lb(A, 37),
    so: lb(A, 39),
    pilah: lb(A, 41),
    pur: lb(A, 43),
    po: lb(A, 44),
    grpo: lb(A, 46),
    transfer: lb(A, 48),
    terima: lb(A, 50),
    jual: lb(A, 52),
  };
  const intro = interpolate(f, [0, 18], [0, 1], {...cl, easing: ease});
  const pan = interpolate(f, [0, dur], [260, -300], cl);
  const rot = interpolate(f, [0, dur], [34, 22], cl);
  return (
    <Dark>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 70%, rgba(61,139,255,0.28), rgba(0,0,0,0) 60%)'}} />
      <AbsoluteFill style={{perspective: 1800, opacity: intro}}>
        <AbsoluteFill
          style={{
            transform: `translateY(150px) translateX(${pan}px) rotateX(${rot}deg) rotateZ(-7deg) scale(${0.85 + 0.5 * intro})`,
            transformOrigin: '50% 50%',
            filter: `blur(${(1 - intro) * 12}px)`,
          }}
        >
          <FlowMap times={times} dark />
        </AbsoluteFill>
      </AbsoluteFill>
      {SAPDOCS.map(([bt, name, no], i) => {
        const t0 = lb(A, bt);
        const t1 = i < SAPDOCS.length - 1 ? lb(A, SAPDOCS[i + 1][0]) : dur;
        if (f < t0 || f >= t1) return null;
        const s = slam(f, t0, fps);
        return (
          <div key={bt} style={{position: 'absolute', left: 110, top: 80, transform: `scale(${s.scale})`, transformOrigin: '0% 0%'}}>
            <Glitch f={f} at={t0} style={{fontSize: name.length > 12 ? 120 : 150, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, color: 'white'}}>
              {name}
            </Glitch>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 14}}>
              <NumberRoll value={no} f={f} at={t0} style={{fontSize: 74, color: SR.orange}} />
              <div
                style={{
                  background: SR.green,
                  color: 'white',
                  fontFamily: monoFamily,
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: 2,
                  padding: '8px 16px',
                  borderRadius: 999,
                  opacity: interpolate(f, [t0 + 14, t0 + 20], [0, 1], cl),
                }}
              >
                ✓ TERKIRIM KE SAP
              </div>
            </div>
          </div>
        );
      })}
      <Mono style={{position: 'absolute', right: 110, top: 90, color: '#8FA6D8'}}>
        PERMINTAAN-AWU/2610/0008
      </Mono>
      <Vignette strength={0.5} />
    </Dark>
  );
};

// ---------- 5. Layar ----------
const STACK = ['g01', 'g19', 'g27', 'g45'];
const COLS: [RoleKey, string][] = [
  ['kapal', 'g01'],
  ['so', 'g19'],
  ['dc', 'g26'],
  ['pur', 'g33'],
  ['purchase', 'g39'],
  ['po', 'g42'],
  ['kasir', 'g45'],
];
const Layar: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.layar;
  const dur = b(ACT.kasir) - b(A);
  const phaseB = lb(A, 64);
  const phaseC = lb(A, 70);
  const whip = interpolate(f, [dur - 10, dur], [0, 1], {...cl, easing: easeIn});
  const mask = interpolate(f, [phaseC, phaseC + b(1)], [0, 1300], {...cl, easing: ease});
  const big = slam(f, lb(A, 71), fps);
  return (
    <Light>
      <AbsoluteFill style={{transform: `translateX(${-whip * 1920}px)`, filter: `blur(${whip * 30}px)`}}>
        {/* A: tumpukan kartu 3D */}
        {f < phaseB + 20 ? (
          <AbsoluteFill style={{opacity: interpolate(f, [phaseB, phaseB + 20], [1, 0], cl)}}>
            <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
              <BigWord text="1 APLIKASI" size={330} color="rgba(31,59,122,0.06)" echo="rgba(31,59,122,0.25)" echoes={2} f={f} />
            </AbsoluteFill>
            <AbsoluteFill style={{perspective: 2200, alignItems: 'center', justifyContent: 'center'}}>
              <div
                style={{
                  position: 'relative',
                  width: 960,
                  height: 560,
                  transformStyle: 'preserve-3d',
                  transform: `translateY(-30px) rotateY(${-20 + f * 0.04}deg) rotateX(14deg)`,
                }}
              >
                {STACK.map((img, i) => {
                  const t0 = lb(A, 56 + i * 2);
                  const s = spring({frame: f - t0, fps, config: {damping: 15, stiffness: 140}});
                  if (f < t0) return null;
                  return (
                    <div
                      key={img}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        transform: `translate3d(${i * 46}px, ${-i * 40 + (1 - s) * 900}px, ${i * 70}px) rotateZ(${(-6 + i * 3.5) * s + (1 - s) * 20}deg) rotateX(${(1 - s) * 50}deg)`,
                      }}
                    >
                      <ScreenCard img={img} w={960} />
                    </div>
                  );
                })}
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        ) : null}
        {/* B: layar terbelah 7 peran */}
        {f >= phaseB ? (
          <AbsoluteFill style={{display: 'flex', flexDirection: 'row'}}>
            {COLS.map(([r, img], i) => {
              const t0 = phaseB + Math.round(i * BEAT_F * 0.5);
              const p = interpolate(f, [t0, t0 + 14], [0, 1], {...cl, easing: ease});
              const outP = interpolate(f, [phaseC + i * 3, phaseC + i * 3 + 14], [0, 1], {...cl, easing: easeIn});
              const dir = i % 2 ? 1 : -1;
              const role = ROLES[r];
              return (
                <div
                  key={r}
                  style={{
                    position: 'relative',
                    width: 1920 / 7,
                    height: 1080,
                    overflow: 'hidden',
                    background: role.color,
                    transform: `translateY(${dir * ((1 - p) * 1100 + outP * 1100)}px)`,
                  }}
                >
                  <Img
                    src={staticFile(`img/${img}.png`)}
                    style={{position: 'absolute', height: 1080, left: -200 - ((f * 0.6) % 200), top: 0, opacity: 0.35, filter: 'grayscale(1)'}}
                  />
                  <AbsoluteFill style={{background: `linear-gradient(to top, ${role.color} 20%, rgba(0,0,0,0) 70%)`}} />
                  <div style={{position: 'absolute', left: 22, bottom: 120, fontSize: 130, fontWeight: 800, color: 'white', letterSpacing: -4, lineHeight: 0.9}}>
                    {role.short}
                  </div>
                  <Mono style={{position: 'absolute', left: 24, bottom: 70, color: 'white', fontSize: 18, letterSpacing: 1}}>
                    {role.name.toUpperCase()}
                  </Mono>
                  <Mono style={{position: 'absolute', left: 24, top: 60, color: 'white', fontSize: 18, opacity: 0.8}}>
                    0{i + 1}
                  </Mono>
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}
        {/* C: 7 peran, 1 aplikasi */}
        {f >= phaseC ? (
          <AbsoluteFill style={{background: SR.navy, clipPath: `circle(${mask}px at 50% 50%)`, alignItems: 'center', justifyContent: 'center'}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 50, transform: `scale(${f >= lb(A, 71) ? big.scale : 0})`}}>
              <div style={{fontSize: 300, fontWeight: 800, color: SR.orange, letterSpacing: -12}}>7</div>
              <div style={{fontSize: 150, fontWeight: 800, color: 'white', letterSpacing: -4}}>PERAN</div>
              <div style={{fontSize: 150, fontWeight: 300, color: SR.electric}}>/</div>
              <div style={{fontSize: 300, fontWeight: 800, color: SR.orange, letterSpacing: -12}}>1</div>
              <div style={{fontSize: 150, fontWeight: 800, color: 'white', letterSpacing: -4}}>APLIKASI</div>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </Light>
  );
};

// ---------- 6. Kasir ----------
const ITEMS: [string, number][] = [
  ['AQUA BTL1500ML/12', 19000],
  ['MAMY POKO', 7000],
  ['PARAMEX 4\'S', 10000],
  ['AQUA BTL1500ML/12', 19000],
  ['MAMY POKO', 7000],
  ['PARAMEX 4\'S', 10000],
  ['AQUA BTL1500ML/12', 19000],
];
const rp = (n: number) => n.toLocaleString('id-ID');
const Kasir: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.kasir;
  const dur = b(ACT.tembok) - b(A);
  const enter = interpolate(f, [0, 12], [1, 0], {...cl, easing: ease});
  const scans = ITEMS.map((_, i) => lb(A, 77 + i));
  const n = scans.filter((t) => f >= t).length;
  const total = ITEMS.slice(0, n).reduce((a, [, p]) => a + p, 0);
  const lastScan = n ? scans[n - 1] : -100;
  const bump = 1 + 0.08 * Math.exp(-(f - lastScan) / 5) * (f >= lastScan ? 1 : 0);
  const tF12 = lb(A, 84);
  const tPay = lb(A, 86);
  const tStruk = lb(A, 88);
  const key = slam(f, tF12, fps);
  const check = spring({frame: f - tPay, fps, config: {damping: 10}});
  const fadeMain = interpolate(f, [tStruk - 6, tStruk + 6], [1, 0], cl);
  const paper = interpolate(f, [tStruk, lb(A, 91)], [0, 1], {...cl, easing: ease});
  const pull = interpolate(f, [dur - 14, dur], [0, 1], {...cl, easing: easeIn});
  const bgWord = f < tF12 ? 'SCAN' : f < tStruk ? 'BAYAR' : 'STRUK';
  const laser = ((f - lastScan) / 10) % 1;
  return (
    <AbsoluteFill style={{transform: `translateY(${-pull * 1200}px)`}}>
      <Light>
        <AbsoluteFill style={{transform: `translateX(${enter * 1920}px) ${shake(f, [tF12], 30)}`, filter: `blur(${enter * 40}px)`}}>
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <BigWord text={bgWord} size={520} color="rgba(255,107,26,0.07)" echo="rgba(255,107,26,0.35)" echoes={3} f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{opacity: fadeMain}}>
            {/* daftar scan */}
            <div style={{position: 'absolute', left: 110, top: 120, width: 760, height: 840, borderRadius: 28, background: SR.ink, padding: 40, boxSizing: 'border-box', overflow: 'hidden'}}>
              <div style={{position: 'relative', height: 120, borderRadius: 14, background: '#13204A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                {Array.from({length: 46}).map((_, i) => (
                  <div key={i} style={{width: random(`bc${i}`) > 0.5 ? 6 : 3, height: 80, background: 'white', opacity: 0.85}} />
                ))}
                {n > 0 && laser < 1 ? (
                  <div style={{position: 'absolute', left: 0, right: 0, top: 10 + laser * 100, height: 4, background: '#FF2E2E', boxShadow: '0 0 20px #FF2E2E'}} />
                ) : null}
              </div>
              <Mono style={{color: '#8FA6D8', marginTop: 26, fontSize: 20}}>SCAN BARCODE &nbsp;·&nbsp; DEK 3</Mono>
              {ITEMS.slice(0, n).map(([name, price], i) => {
                const p = interpolate(f, [scans[i], scans[i] + 8], [0, 1], {...cl, easing: ease});
                const hot = f - scans[i] < 10;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 16,
                      padding: '12px 18px',
                      borderRadius: 12,
                      background: hot ? SR.orange : 'rgba(255,255,255,0.06)',
                      color: 'white',
                      fontFamily: monoFamily,
                      fontWeight: 800,
                      fontSize: 26,
                      transform: `translateX(${(1 - p) * -200}px)`,
                      opacity: p,
                    }}
                  >
                    <span>{name}</span>
                    <span>{rp(price)}</span>
                  </div>
                );
              })}
            </div>
            {/* total */}
            <div style={{position: 'absolute', left: 930, top: 320}}>
              <Mono style={{color: SR.navy, fontSize: 28, letterSpacing: 6}}>TOTAL &nbsp;·&nbsp; {n} ITEM</Mono>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 20, transform: `scale(${bump})`, transformOrigin: '0% 100%'}}>
                <div style={{fontSize: 90, fontWeight: 800, color: SR.navy}}>Rp</div>
                <div style={{fontSize: 180, fontWeight: 800, color: SR.navy, letterSpacing: -8, fontFamily}}>{rp(total)}</div>
              </div>
            </div>
            {/* F12 */}
            {f >= tF12 ? (
              <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
                <div
                  style={{
                    transform: `scale(${key.scale * (f < tPay ? 1 : interpolate(f, [tPay, tPay + 8], [1, 0], cl))})`,
                    width: 420,
                    height: 400,
                    borderRadius: 50,
                    background: 'white',
                    border: `6px solid ${SR.navy}`,
                    borderBottomWidth: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: monoFamily,
                    fontWeight: 800,
                    fontSize: 170,
                    color: SR.navy,
                    boxShadow: '0 40px 80px rgba(5,10,30,0.3)',
                  }}
                >
                  F12
                </div>
              </AbsoluteFill>
            ) : null}
            {f >= tPay ? (
              <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 420, height: 420, borderRadius: 210, background: SR.green, transform: `scale(${check})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 80px rgba(34,197,94,0.45)'}}>
                  <svg width={240} height={240} viewBox="0 0 24 24">
                    <path d="M4 12.5 L10 18 L20 6" stroke="white" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(f, [tPay + 4, tPay + 16], [0, 1], cl)} />
                  </svg>
                </div>
                <div style={{marginTop: 30, fontSize: 90, fontWeight: 800, color: SR.green, letterSpacing: 10, opacity: check}}>LUNAS</div>
              </AbsoluteFill>
            ) : null}
          </AbsoluteFill>
          {/* struk */}
          {f >= tStruk - 2 ? (
            <AbsoluteFill style={{alignItems: 'center'}}>
              <div style={{width: 760, height: 36, marginTop: 40, borderRadius: 18, background: SR.ink}} />
              <div
                style={{
                  width: 600,
                  height: 940 * paper,
                  marginTop: -18,
                  background: 'white',
                  boxShadow: '0 30px 60px rgba(5,10,30,0.2)',
                  overflow: 'hidden',
                  fontFamily: monoFamily,
                  color: SR.ink,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '0 46px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{paddingBottom: 50}}>
                  <div style={{textAlign: 'center', fontWeight: 800, fontSize: 34}}>PID POS</div>
                  <div style={{textAlign: 'center', fontSize: 20, marginTop: 6}}>KM AWU · DEK 3</div>
                  <div style={{textAlign: 'center', fontSize: 20}}>DEK3-AWU/2610/00002</div>
                  <div style={{borderTop: '3px dashed #9AA6BD', margin: '24px 0'}} />
                  {ITEMS.map(([nm, pr], i) => (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, marginTop: 8}}>
                      <span>{nm}</span>
                      <span>{rp(pr)}</span>
                    </div>
                  ))}
                  <div style={{borderTop: '3px dashed #9AA6BD', margin: '24px 0'}} />
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 36, fontWeight: 800}}>
                    <span>TOTAL</span>
                    <span style={{color: SR.orange}}>{rp(ITEMS.reduce((a, [, p]) => a + p, 0))}</span>
                  </div>
                  <div style={{textAlign: 'center', fontSize: 20, marginTop: 30}}>TERIMA KASIH</div>
                </div>
              </div>
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      </Light>
    </AbsoluteFill>
  );
};

// ---------- 7. Tembok kata ----------
const ROWS = [
  'SALES ORDER · PURCHASE REQUEST · PURCHASE ORDER · GRPO · ',
  'KM AWU · DEK 3 · DEK 5 BELAKANG · DEK 7 · DC-JKT · ',
  'ADMIN KAPAL · APPROVE SO · ADMIN DC · APPROVE PUR · ',
  'SCAN · BAYAR · STRUK · KIRIM DO · TUTUP KASIR · ',
  'INVENTORY TRANSFER · DELIVERY · SAP BUSINESS ONE · ',
  'ADMIN PURCHASE · APPROVE PO · KASIR · SATU ALUR · ',
];
export const TEMBOK_LEAD = 14;
const Tembok: React.FC = () => {
  const f = useCurrentFrame();
  const A = ACT.tembok;
  const freeze = TEMBOK_LEAD + lb(A, 103);
  const ff = Math.min(f, freeze);
  const dim = f >= freeze ? interpolate(f, [freeze, freeze + 6], [1, 0.12], cl) : 1;
  const sc = interpolate(ff, [0, freeze], [1.12, 1.35], cl);
  return (
    <Dark>
      <AbsoluteFill style={{transform: `rotate(-8deg) scale(${sc})`, opacity: dim, justifyContent: 'center'}}>
        {ROWS.map((txt, i) => {
          const dir = i % 2 ? 1 : -1;
          const speed = 7 + i * 1.6;
          const x = dir * (ff * speed + (ff * ff) / 90) - 3000;
          const style: React.CSSProperties =
            i % 3 === 0
              ? {color: 'white'}
              : i % 3 === 1
              ? {color: 'transparent', WebkitTextStroke: '3px white'}
              : {color: SR.orange};
          return (
            <div
              key={i}
              style={{
                whiteSpace: 'nowrap',
                fontSize: 140,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 1.05,
                transform: `translateX(${((x % 6000) - 6000) % 6000}px)`,
                ...style,
              }}
            >
              {txt.repeat(6)}
            </div>
          );
        })}
      </AbsoluteFill>
      <Vignette strength={0.7} />
    </Dark>
  );
};

// ---------- 8. Logo ----------
const Akhir: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const A = ACT.logo;
  const dur = b(ACT.akhir) - b(A);
  const shoot = interpolate(f, [0, lb(A, 105)], [-2200, 0], {...cl, easing: ease});
  const draw = interpolate(f, [lb(A, 105), lb(A, 107)], [0, 1], {...cl, easing: ease});
  const fill = interpolate(f, [lb(A, 107), lb(A, 107.6)], [0, 1], cl);
  const tOpen = lb(A, 108);
  const mask = interpolate(f, [tOpen, tOpen + 22], [0, 1400], {...cl, easing: ease});
  const land = spring({frame: f - tOpen - 6, fps, config: {damping: 9, stiffness: 120}});
  const tText = lb(A, 112);
  const text = 'SATU ALUR';
  const shown = Math.max(0, Math.min(text.length, Math.floor((f - tText) / 4)));
  const dotOn = spring({frame: f - tText - text.length * 4, fps, config: {damping: 8}});
  const fadeEnd = interpolate(f, [dur - b(2), dur], [0, 1], cl);
  return (
    <Dark>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', left: 0, top: 534, height: 12, width: 1920, background: SR.orange, transform: `translateX(${shoot}px)`, opacity: interpolate(f, [lb(A, 105), lb(A, 105.6)], [1, 0], cl), boxShadow: `0 0 40px ${SR.orange}`}} />
        <div style={{filter: `drop-shadow(0 0 30px ${SR.orange})`}}>
          <Chevrons size={300} progress={draw} fill={fill} />
        </div>
      </AbsoluteFill>
      {f >= tOpen ? (
        <AbsoluteFill style={{background: SR.paper, clipPath: `circle(${mask}px at 50% 50%)`, alignItems: 'center', justifyContent: 'center'}}>
          {Array.from({length: 26}).map((_, i) => {
            const a = random(`pa${i}`) * Math.PI * 2;
            const d = (f - tOpen) * (10 + random(`pd${i}`) * 16) * Math.exp(-(f - tOpen) / 50);
            const o = interpolate(f - tOpen, [0, 50], [1, 0], cl);
            return (
              <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * d, top: 500 + Math.sin(a) * d, opacity: o, transform: `rotate(${(a * 180) / Math.PI}deg)`}}>
                <Chevrons size={30 + random(`ps${i}`) * 30} progress={1} fill={1} color={i % 3 ? SR.orange : SR.electric} stroke={6} />
              </div>
            );
          })}
          <div style={{transform: `scale(${0.4 + 0.6 * land}) translateY(-60px)`}}>
            <Logo size={1.05} />
          </div>
          <div style={{position: 'absolute', top: 690, display: 'flex', alignItems: 'baseline'}}>
            <div style={{fontSize: 170, fontWeight: 800, color: SR.navy, letterSpacing: -6}}>{text.slice(0, shown)}</div>
            <div style={{width: 46, height: 46, borderRadius: 23, background: SR.orange, marginLeft: 12, transform: `scale(${shown === text.length ? dotOn : 0})`}} />
          </div>
          <Mono style={{position: 'absolute', bottom: 70, color: SR.navy, opacity: interpolate(f, [lb(A, 116), lb(A, 117)], [0, 0.7], cl)}}>
            DARI PERMINTAAN KAPAL SAMPAI STRUK KASIR
          </Mono>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: SR.ink, opacity: fadeEnd}} />
    </Dark>
  );
};

// Sapuan chevron di antara Alur dan Layar.
const ChevronWipe: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 28], [0, 1], {...cl, easing: Easing2});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {[SR.orange, SR.electric, 'white'].map((c, i) => {
        const x = -2600 + p * 5600 - i * 260;
        return (
          <svg key={c} width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <polygon points={`${x},-100 ${x + 900},540 ${x},1180 ${x - 900},1180 ${x},540 ${x - 900},-100`} fill={c} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
const Easing2 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const Showreel: React.FC = () => {
  const seg = (from: number, to: number) => ({from: b(from), durationInFrames: b(to) - b(from)});
  return (
    <AbsoluteFill style={{background: SR.ink}}>
      <Sequence {...seg(ACT.percikan, ACT.kata)}>
        <Percikan />
      </Sequence>
      <Sequence {...seg(ACT.kata, ACT.laut)}>
        <Kata />
      </Sequence>
      <Sequence {...seg(ACT.laut, ACT.alur)}>
        <Laut />
      </Sequence>
      <Sequence {...seg(ACT.alur, ACT.layar)}>
        <Alur />
      </Sequence>
      <Sequence {...seg(ACT.layar, ACT.kasir)}>
        <Layar />
      </Sequence>
      <Sequence from={b(ACT.tembok) - TEMBOK_LEAD} durationInFrames={b(ACT.logo) - b(ACT.tembok) + TEMBOK_LEAD}>
        <Tembok />
      </Sequence>
      <Sequence {...seg(ACT.kasir, ACT.tembok)}>
        <Kasir />
      </Sequence>
      <Sequence {...seg(ACT.logo, ACT.akhir)}>
        <Akhir />
      </Sequence>
      <Sequence from={b(ACT.layar) - 14} durationInFrames={28}>
        <ChevronWipe />
      </Sequence>
      <Flash at={b(ACT.kata) - 1} len={8} />
      <Flash at={b(ACT.logo)} len={10} />
      <Grain opacity={0.08} />
      <Audio src={staticFile('music/showreel.wav')} />
    </AbsoluteFill>
  );
};

export {SR_FRAMES};
