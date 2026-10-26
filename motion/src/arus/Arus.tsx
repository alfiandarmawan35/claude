import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, monoFamily, ROLES} from '../theme';
import {Logo} from '../components/common';
import {Grain, NumberRoll, cl, ease, easeIn, shake} from '../showreel/fx';
import {ACT, A, AR_FRAMES, BEAT_F, b, lb} from './beats';

// Showreel "ARUS": 9 babak, Swiss grid berani, isometrik, terowongan dokumen, mosaik, pusaran logo.

const W = 1920;
const H = 1080;
const big: React.CSSProperties = {fontFamily, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.86, whiteSpace: 'nowrap'};
const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: monoFamily, fontWeight: 500, fontSize: 22, letterSpacing: 3, ...style}}>{children}</div>
);
const pop = (f: number, at: number, fps: number, damping = 12) => spring({frame: f - at, fps, config: {damping, stiffness: 220, mass: 0.6}});

// ---------- 1. Tetes ----------
const Tetes: React.FC = () => {
  const f = useCurrentFrame();
  const S = ACT.tetes;
  const jatuh = interpolate(f, [0, lb(S, 1)], [0, 1], {...cl, easing: easeIn});
  const hit = lb(S, 1);
  const rings = [0, 1, 2, 3, 4, 5];
  const out = interpolate(f, [lb(S, 5.2), lb(S, 6)], [1, 0], cl);
  return (
    <AbsoluteFill style={{background: '#05080F'}}>
      {f < hit ? (
        <div style={{position: 'absolute', left: W / 2 - 14, top: -60 + jatuh * 640, width: 28, height: 40, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: A.orange, boxShadow: `0 0 30px ${A.orange}`}} />
      ) : null}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: out}}>
        {rings.map((k) => {
          const t0 = hit + k * 9;
          const p = interpolate(f, [t0, t0 + 120], [0, 1], cl);
          if (f < t0) return null;
          return (
            <ellipse
              key={k}
              cx={W / 2}
              cy={580}
              rx={30 + p * 1100}
              ry={(30 + p * 1100) * 0.32}
              fill="none"
              stroke={k % 2 ? A.electric : A.orange}
              strokeWidth={6 * (1 - p) + 1}
              opacity={1 - p}
            />
          );
        })}
      </svg>
      <Mono style={{position: 'absolute', bottom: 80, width: '100%', textAlign: 'center', color: '#6F83AE', opacity: interpolate(f, [hit + 20, hit + 50], [0, 1], cl) * out}}>
        PID POS · ARUS
      </Mono>
    </AbsoluteFill>
  );
};

// ---------- 2. Arus kata ----------
const KATA = ['PESAN', 'SETUJU', 'KIRIM', 'TERIMA', 'JUAL'];
const Pita: React.FC<{i: number; f: number}> = ({i, f}) => {
  const fills = [A.orange, A.white, A.ink, A.navy, A.orange, A.white, A.ink];
  const txt = [A.ink, A.navy, A.orange, A.white, A.white, A.orange, A.white];
  const speed = (i % 2 ? 1 : -1) * (14 + i * 4);
  const x = ((f * speed) % 2400) - (speed > 0 ? 2400 : 0);
  return (
    <div style={{height: 170, background: fills[i % fills.length], overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
      <div style={{...big, fontSize: 150, color: txt[i % txt.length], transform: `translateX(${x}px)`}}>
        {(KATA.join(' · ') + ' · ').repeat(4)}
      </div>
    </div>
  );
};
const Kata: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = ACT.kata;
  const masuk = interpolate(f, [0, 16], [1, 0], {...cl, easing: ease});
  const stops = [8, 10, 12, 14].map((x) => lb(S, x));
  let k = -1;
  stops.forEach((t, i) => {
    if (f >= t) k = i;
  });
  const jual = lb(S, 15);
  const kata = f >= jual ? 'JUAL' : k >= 0 ? KATA[k] : '';
  const at = f >= jual ? jual : k >= 0 ? stops[k] : 0;
  const s = pop(f, at, fps);
  const drop = interpolate(f, [lb(S, 15.4), lb(S, 16)], [0, 1], {...cl, easing: easeIn});
  return (
    <AbsoluteFill style={{background: A.navy, overflow: 'hidden', transform: shake(f, [...stops, jual], 16)}}>
      <div style={{position: 'absolute', left: -500, top: -420, width: W + 1000, transform: `rotate(-12deg) translateX(${masuk * -1800}px)`}}>
        {Array.from({length: 11}).map((_, i) => (
          <Pita key={i} i={i} f={f + i * 7} />
        ))}
      </div>
      {kata ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              background: A.white,
              padding: '10px 60px 30px',
              transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg) translateY(${drop * 900}px) rotate(${drop * 20}deg)`,
              boxShadow: '0 30px 0 rgba(0,0,0,0.35)',
            }}
          >
            <div style={{...big, fontSize: 300, color: A.ink}}>
              {kata}
              <span style={{color: A.orange}}>.</span>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
      <Mono style={{position: 'absolute', left: 60, bottom: 50, color: A.white, background: A.ink, padding: '8px 14px'}}>
        0{Math.max(1, k + 1)} — ARUS BARANG
      </Mono>
    </AbsoluteFill>
  );
};

// ---------- 3. Diorama kapal (isometrik) ----------
const ISO = 46;
const iso = (x: number, y: number, z: number): [number, number] => [(x - y) * ISO * 0.866, (x + y) * ISO * 0.5 - z * ISO];
const Kotak: React.FC<{x: number; y: number; z: number; w: number; d: number; h: number; c: [string, string, string]}> = ({x, y, z, w, d, h, c}) => {
  const P = (a: number, bb: number, cc: number) => iso(a, bb, cc).join(',');
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' ');
  const left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(' ');
  const right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)].join(' ');
  return (
    <g>
      <polygon points={left} fill={c[1]} />
      <polygon points={right} fill={c[2]} />
      <polygon points={top} fill={c[0]} />
    </g>
  );
};
const Kapal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = ACT.kapal;
  const dur = b(ACT.terowongan) - b(S);
  const turun = spring({frame: f, fps, config: {damping: 16}});
  const deks = [
    {z: 1.6, at: lb(S, 18), label: 'DEK 3', col: ROLES.kapal.color},
    {z: 2.5, at: lb(S, 20), label: 'DEK 5', col: ROLES.so.color},
    {z: 3.4, at: lb(S, 22), label: 'DEK 7', col: ROLES.kasir.color},
  ];
  const porthole = interpolate(f, [dur - 22, dur], [1, 60], {...cl, easing: easeIn});
  const items = ['#3D8BFF', '#22C55E', '#F59E0B', '#C0392B', '#7C3AED', '#0F766E'];
  return (
    <AbsoluteFill style={{background: A.orange, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 70, top: 70, ...big, fontSize: 230, color: A.ink, transform: `translateX(${(1 - turun) * -600}px)`}}>
        KM
        <br />
        AWU
      </div>
      <Mono style={{position: 'absolute', left: 80, bottom: 70, color: A.ink}}>1 KAPAL · 3 DEK · 1 APLIKASI</Mono>
      <AbsoluteFill style={{transform: `translate(1180px, ${650 - (1 - turun) * 700}px) scale(${1.15 + Math.sin(f / 60) * 0.012})`}}>
        <svg width={10} height={10} style={{overflow: 'visible'}}>
          {/* lambung */}
          <Kotak x={-6} y={-2} z={0} w={12} d={4} h={1.6} c={['#2A4A8F', '#14285A', '#1F3B7A']} />
          {deks.map((dk, i) => {
            const open = spring({frame: f - dk.at, fps, config: {damping: 13}});
            const dx = open * 2.4 * (i % 2 ? -1 : 1);
            return (
              <g key={dk.label} opacity={f >= dk.at - 10 ? 1 : 0.0}>
                <Kotak x={-5 + dx} y={-1.7} z={dk.z} w={10} d={3.4} h={0.9} c={['#FFFFFF', '#D6DEEA', '#E9EEF6']} />
                {items.map((ic, k) => {
                  const it = spring({frame: f - dk.at - 8 - k * 3, fps, config: {damping: 10}});
                  return it > 0.01 ? (
                    <Kotak key={k} x={-4.4 + dx + k * 1.5} y={-0.9} z={dk.z + 0.9} w={0.9} d={0.9} h={0.9 * it} c={[ic, ic, ic]} />
                  ) : null;
                })}
              </g>
            );
          })}
          <Kotak x={2} y={-1.2} z={4.3} w={2.5} d={2.4} h={1.4} c={['#FFFFFF', '#C9D2DE', '#E4EAF2']} />
        </svg>
        {deks.map((dk, i) => {
          const open = spring({frame: f - dk.at, fps, config: {damping: 13}});
          const [x, y] = iso(-5 + open * 2.4 * (i % 2 ? -1 : 1) + 10, -1.7, dk.z + 0.45);
          return (
            <div key={dk.label} style={{position: 'absolute', left: x + 20, top: y - 18, opacity: open, fontFamily: monoFamily, fontWeight: 800, fontSize: 24, color: 'white', background: dk.col, padding: '4px 12px'}}>
              {dk.label}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* jendela bulat tempat kamera masuk */}
      {f > dur - 30 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 70, height: 70, borderRadius: 35, background: A.ink, border: '10px solid #D6DEEA', transform: `scale(${porthole})`}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4. Terowongan dokumen ----------
const DOKS: [number, string, string, string][] = [
  [30, 'SALES ORDER', '266000699', ROLES.so.color],
  [32, 'PURCHASE REQUEST', '262000460', ROLES.pur.color],
  [34, 'PURCHASE ORDER', '262002060', ROLES.purchase.color],
  [36, 'GRPO', '262001908', ROLES.dc.color],
  [38, 'INVENTORY TRANSFER', '262000146', ROLES.dc.color],
  [40, 'DELIVERY ORDER', '266000512', ROLES.kasir.color],
];
const Kartu: React.FC<{f: number; at: number; nama: string; no: string; col: string; last: boolean}> = ({f, at, nama, no, col, last}) => {
  const d = f - at;
  const span = b(2);
  if (d < -16 || (!last && d > span - 2)) return null;
  const z = interpolate(d, [-16, 0, span * 0.7, span - 2], [0.05, 1, 1.08, last ? 1.08 : 6], {...cl});
  const fullz = last ? interpolate(d, [span * 0.7, span], [1, 9], {...cl, easing: easeIn}) : 1;
  const o = interpolate(d, [-16, -6], [0, 1], cl) * (last ? 1 : interpolate(d, [span * 0.72, span * 0.84], [1, 0], cl));
  const stamp = d >= 30;
  const mosh = d >= 30 && d < 36;
  const card = (
    <div style={{width: 1040, height: 480, background: last && fullz > 2 ? A.orange : 'white', borderRadius: 26, padding: 50, boxSizing: 'border-box', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'}}>
      <Mono style={{color: col, fontWeight: 800, fontSize: 26}}>DOKUMEN SAP</Mono>
      <div style={{...big, fontSize: nama.length > 14 ? 84 : 120, color: A.ink, marginTop: 20}}>{nama}</div>
      <NumberRoll value={no} f={d} at={10} dur={20} style={{fontSize: 90, color: A.orange, display: 'block', marginTop: 30}} />
      {stamp ? (
        <div style={{position: 'absolute', right: 50, bottom: 50, border: `6px solid ${A.green}`, color: A.green, fontFamily: monoFamily, fontWeight: 800, fontSize: 34, padding: '8px 18px', transform: `rotate(-8deg) scale(${interpolate(d, [30, 36], [1.6, 1], cl)})`}}>
          ✓ TERKIRIM
        </div>
      ) : null}
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `scale(${z * fullz})`, position: 'relative'}}>
        {mosh
          ? Array.from({length: 8}).map((_, k) => (
              <div key={k} style={{position: k ? 'absolute' : 'relative', top: 0, left: 0, clipPath: `inset(${k * 12.5}% 0 ${100 - (k + 1) * 12.5}% 0)`, transform: `translateX(${(random(`m${at}${d}${k}`) - 0.5) * 120}px)`, filter: k % 3 === 0 ? 'hue-rotate(90deg)' : undefined}}>
                {card}
              </div>
            ))
          : card}
      </div>
    </AbsoluteFill>
  );
};
const Terowongan: React.FC = () => {
  const f = useCurrentFrame();
  const S = ACT.terowongan;
  const masuk = interpolate(f, [0, 20], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: A.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: masuk}}>
        {Array.from({length: 14}).map((_, k) => {
          const p = ((f / 50 + k / 14) % 1);
          const s = 0.05 + p * p * 3.2;
          return (
            <div key={k} style={{position: 'absolute', left: W / 2 - 480, top: H / 2 - 270, width: 960, height: 540, border: `${3 + p * 6}px solid ${k % 3 === 0 ? A.orange : 'rgba(61,139,255,0.6)'}`, borderRadius: 30, transform: `scale(${s})`, opacity: Math.min(1, p * 3) * (1 - p)}} />
          );
        })}
      </AbsoluteFill>
      {DOKS.map(([bt, nama, no, col], i) => (
        <Kartu key={bt} f={f} at={lb(S, bt) + 16} nama={nama} no={no} col={col} last={i === DOKS.length - 1} />
      ))}
      <Mono style={{position: 'absolute', left: 60, top: 50, color: '#8FA6D8'}}>ARUS DOKUMEN → SAP BUSINESS ONE</Mono>
    </AbsoluteFill>
  );
};

// ---------- 5. Sapuan ----------
const SAPU: [string, string, string][] = [
  ['CEPAT.', A.orange, A.navy],
  ['TERCATAT.', A.navy, A.white],
  ['TERLACAK.', A.white, A.orange],
];
const Sapuan: React.FC = () => {
  const f = useCurrentFrame();
  const seg = b(2);
  const i = Math.min(2, Math.floor(f / seg));
  const local = f - i * seg;
  const [kata, base, plane] = SAPU[i];
  const p = interpolate(local, [0, 14], [0, 1], {...cl, easing: ease});
  const split = interpolate(local, [6, seg], [-10, 110], cl);
  const word = (color: string) => (
    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 90}}>
      <div style={{...big, fontSize: 340, color, transform: `translateX(${(1 - p) * 300}px)`}}>{kata}</div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: base, transform: shake(local, [0], 14)}}>
      {word(plane)}
      <AbsoluteFill style={{background: plane, clipPath: `polygon(0 0, ${split}% 0, ${split - 12}% 100%, 0 100%)`}}>{word(base)}</AbsoluteFill>
      <Mono style={{position: 'absolute', right: 70, bottom: 60, color: i === 1 ? A.white : A.ink}}>0{i + 1} / 03</Mono>
    </AbsoluteFill>
  );
};

// ---------- 6. Mosaik layar ----------
const TILES = ['g01', 'g02', 'g19', 'g27', 'g33', 'g39', 'g42', 'g28', 'g30', 'g05', 'g08', 'g44', 'g46', 'g48', 'g49', 'g45'];
const Mosaik: React.FC = () => {
  const f = useCurrentFrame();
  const S = ACT.mosaik;
  const dur = b(ACT.kasir) - b(S);
  // urutan posisi: setiap ketukan dua kotak bertukar
  const beat = Math.floor(f / BEAT_F);
  const into = (f - beat * BEAT_F) / BEAT_F;
  const order = Array.from({length: 16}, (_, k) => k);
  const swaps: [number, number][] = [];
  for (let k = 0; k <= beat; k++) {
    const a = Math.floor(random(`sa${k}`) * 16);
    const c = Math.floor(random(`sb${k}`) * 16);
    swaps.push([a, c]);
  }
  swaps.slice(0, -1).forEach(([a, c]) => ([order[a], order[c]] = [order[c], order[a]]));
  const [sa, sb] = swaps[swaps.length - 1];
  const e = interpolate(into, [0, 0.45], [0, 1], {...cl, easing: ease});
  const cw = 440;
  const ch = 230;
  const gx = 40;
  const gy = 30;
  const x0 = (W - 4 * cw - 3 * gx) / 2;
  const y0 = (H - 4 * ch - 3 * gy) / 2;
  const posOf = (slot: number) => [x0 + (slot % 4) * (cw + gx), y0 + Math.floor(slot / 4) * (ch + gy)];
  const zooms = [52, 56, 60].map((x) => lb(S, x));
  const last = dur - b(1.2);
  return (
    <AbsoluteFill style={{background: A.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...big, fontSize: 420, color: 'transparent', WebkitTextStroke: `3px ${A.navy}`, opacity: 0.18}}>1 APLIKASI</div>
      </AbsoluteFill>
      {TILES.map((img, t) => {
        const slot = order.indexOf(t);
        let [x, y] = posOf(slot);
        if (slot === sa || slot === sb) {
          const [tx, ty] = posOf(slot === sa ? sb : sa);
          x = x + (tx - x) * e;
          y = y + (ty - y) * e;
        }
        let z = 0;
        zooms.forEach((zt) => {
          if (slot === 5) z = Math.max(z, interpolate(f, [zt, zt + 10, zt + b(1.4), zt + b(1.8)], [0, 1, 1, 0], cl));
        });
        const isLast = img === 'g45' && f >= last;
        if (isLast) z = interpolate(f, [last, last + 16], [0, 1], {...cl, easing: ease});
        const fx = x + (0 - x) * z;
        const fy = y + (0 - y) * z;
        const fw = cw + (W - cw) * z;
        const fh = ch + (H - ch) * z;
        return (
          <div key={img} style={{position: 'absolute', left: fx, top: fy, width: fw, height: fh, overflow: 'hidden', borderRadius: 16 * (1 - z), background: 'white', boxShadow: '0 16px 30px rgba(20,40,90,0.18)', zIndex: z > 0 ? 10 : 1}}>
            <Img src={staticFile(`img/${img}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left'}} />
          </div>
        );
      })}
      <Mono style={{position: 'absolute', left: 60, top: 40, color: A.navy, zIndex: 20}}>16 LAYAR · 7 PERAN</Mono>
    </AbsoluteFill>
  );
};

// ---------- 7. Kasir (puncak) ----------
const BARANG: [string, number][] = [
  ['AQUA 1500ML', 19000],
  ['MAMY POKO', 7000],
  ['PARAMEX', 10000],
  ['AQUA 1500ML', 19000],
  ['TEH PUCUK', 4000],
  ['MAMY POKO', 7000],
  ['AQUA 1500ML', 19000],
  ['PARAMEX', 10000],
];
const rp = (n: number) => n.toLocaleString('id-ID');
const Kasir: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = ACT.kasir;
  const half = b(0.5);
  const k = Math.floor(f / half);
  const tF12 = lb(S, 72);
  const tLunas = lb(S, 73);
  const tStruk = lb(S, 74);
  const n = Math.min(BARANG.length, Math.floor(k / 2) + 1);
  const total = BARANG.slice(0, n).reduce((a, [, p]) => a + p, 0);
  const mosh = f % half < 4 && f < tF12;
  if (f >= tStruk) {
    const p = interpolate(f, [tStruk, tStruk + b(1)], [0, 1], {...cl, easing: ease});
    const thin = interpolate(f, [tStruk + b(1.2), tStruk + b(2)], [1, 0], {...cl, easing: easeIn});
    return (
      <AbsoluteFill style={{background: A.ink, alignItems: 'center'}}>
        <div style={{width: 520 * thin + 6, height: H * p, background: 'white', fontFamily: monoFamily, color: A.ink, overflow: 'hidden', padding: thin > 0.2 ? '40px 40px' : 0, boxSizing: 'border-box'}}>
          {thin > 0.3 ? (
            <>
              <div style={{fontWeight: 800, fontSize: 34, textAlign: 'center'}}>PID POS · DEK 3</div>
              {BARANG.map(([nm, pr], i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, marginTop: 10}}>
                  <span>{nm}</span>
                  <span>{rp(pr)}</span>
                </div>
              ))}
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, fontWeight: 800, marginTop: 30, color: A.orange}}>
                <span>TOTAL</span>
                <span>{rp(BARANG.reduce((a, [, x]) => a + x, 0))}</span>
              </div>
            </>
          ) : null}
        </div>
      </AbsoluteFill>
    );
  }
  if (f >= tLunas) {
    const s = pop(f, tLunas, fps, 9);
    return (
      <AbsoluteFill style={{background: A.green, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...big, fontSize: 380, color: 'white', transform: `scale(${s})`}}>LUNAS</div>
      </AbsoluteFill>
    );
  }
  if (f >= tF12) {
    const s = pop(f, tF12, fps, 8);
    return (
      <AbsoluteFill style={{background: A.navy, alignItems: 'center', justifyContent: 'center', transform: shake(f, [tF12], 34)}}>
        <div style={{width: 560, height: 520, borderRadius: 60, background: 'white', borderBottom: '50px solid #C9D2DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: monoFamily, fontWeight: 800, fontSize: 230, color: A.navy, transform: `scale(${s})`}}>
          F12
        </div>
      </AbsoluteFill>
    );
  }
  const mode = k % 3;
  const [nm, pr] = BARANG[(n - 1) % BARANG.length];
  const bg = [A.orange, A.navy, A.white][mode];
  const fg = [A.ink, A.white, A.navy][mode];
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', transform: shake(f % half, [0], 18)}}>
      <AbsoluteFill style={{filter: mosh ? 'hue-rotate(60deg) saturate(2)' : undefined, transform: mosh ? `translateX(${(random(`k${f}`) - 0.5) * 60}px)` : undefined}}>
        {mode === 0 ? (
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{display: 'flex', gap: 10}}>
              {Array.from({length: 60}).map((_, i) => (
                <div key={i} style={{width: random(`bar${i}`) > 0.5 ? 14 : 6, height: 460, background: A.ink}} />
              ))}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 300 + ((f % half) / half) * 480, height: 10, background: '#FF1F1F', boxShadow: '0 0 30px #FF1F1F'}} />
            <Mono style={{position: 'absolute', bottom: 60, color: A.ink, fontSize: 30}}>BIP · {nm}</Mono>
          </AbsoluteFill>
        ) : mode === 1 ? (
          <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 110}}>
            <Mono style={{color: '#8FA6D8', fontSize: 30}}>TOTAL · {n} ITEM</Mono>
            <div style={{...big, fontSize: 330, color: fg}}>
              <span style={{fontSize: 140}}>Rp </span>
              {rp(total)}
            </div>
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 110}}>
            <div style={{...big, fontSize: 220, color: fg}}>{nm}</div>
            <div style={{...big, fontSize: 140, color: A.orange, marginTop: 20}}>+{rp(pr)}</div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 8. Hening ----------
const Hening: React.FC = () => {
  const f = useCurrentFrame();
  const dur = b(ACT.muara) - b(ACT.hening);
  const x = interpolate(f, [0, dur], [-200, W * 0.62], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <AbsoluteFill style={{background: '#FAFBFD'}}>
      <div style={{position: 'absolute', left: 0, top: H / 2 - 3, height: 6, width: x, background: A.orange}} />
      <div style={{position: 'absolute', left: x - 8, top: H / 2 - 8, width: 16, height: 16, borderRadius: 8, background: A.orange, boxShadow: `0 0 24px ${A.orange}`}} />
      <Mono style={{position: 'absolute', bottom: 70, width: '100%', textAlign: 'center', color: '#9AA6BD', opacity: interpolate(f, [20, 50], [0, 1], cl)}}>
        semua arus menuju satu muara
      </Mono>
    </AbsoluteFill>
  );
};

// ---------- 9. Muara ----------
const Muara: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const S = ACT.muara;
  const tLogo = lb(S, 88);
  const tGanti = lb(S, 90);
  const parts = Array.from({length: 140});
  const spin = interpolate(f, [0, tLogo], [0, 1], {...cl, easing: easeIn});
  const land = pop(f, tLogo + 4, fps, 10);
  const mask = interpolate(f, [tLogo, tLogo + 24], [0, 2300], {...cl, easing: ease});
  const ganti = interpolate(f, [tGanti, tGanti + 14], [0, 1], cl);
  const colors = [A.orange, A.electric, A.white, ROLES.kasir.color, ROLES.so.color];
  return (
    <AbsoluteFill style={{background: A.ink, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {parts.map((_, i) => {
          const side = i % 4;
          const r0 = 1300 + random(`r${i}`) * 400;
          const a0 = [Math.PI, 0, -Math.PI / 2, Math.PI / 2][side] + (random(`a${i}`) - 0.5) * 0.8;
          const life = (f / (b(4) + random(`l${i}`) * b(3)) + random(`o${i}`)) % 1;
          const prog = Math.min(1, life + spin * 0.6);
          const r = r0 * (1 - prog) * (1 - spin * 0.4);
          const a = a0 + prog * (2 + spin * 6);
          const x = W / 2 + Math.cos(a) * r;
          const y = H / 2 + Math.sin(a) * r * 0.62;
          const tail = 18 + spin * 60;
          const ax = W / 2 + Math.cos(a - 0.05) * (r + tail);
          const ay = H / 2 + Math.sin(a - 0.05) * (r + tail) * 0.62;
          return f < tLogo + 6 ? <line key={i} x1={x} y1={y} x2={ax} y2={ay} stroke={colors[i % colors.length]} strokeWidth={3 + (i % 3)} strokeLinecap="round" opacity={0.85} /> : null;
        })}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{...big, fontSize: 380, color: 'transparent', WebkitTextStroke: `3px rgba(255,255,255,${0.25 * (1 - mask / 2300)})`, transform: `scale(${1 + spin * 0.4}) rotate(${spin * -8}deg)`}}>ARUS</div>
      </AbsoluteFill>
      {f >= tLogo ? (
        <AbsoluteFill style={{background: A.paper, clipPath: `circle(${mask}px at 50% 50%)`, alignItems: 'center', justifyContent: 'center'}}>
          {[0, 1, 2].map((k) => {
            const p = interpolate(f, [tLogo + k * 6, tLogo + 50 + k * 6], [0, 1], cl);
            return <div key={k} style={{position: 'absolute', width: 300 + p * 1500, height: 300 + p * 1500, borderRadius: '50%', border: `${8 * (1 - p)}px solid ${k === 1 ? A.electric : A.orange}`, opacity: 1 - p}} />;
          })}
          <div style={{transform: `scale(${0.5 + 0.5 * land}) translateY(-80px)`}}>
            <Logo size={1.0} />
          </div>
          <div style={{position: 'absolute', top: 720, height: 180, width: '100%', textAlign: 'center'}}>
            <div style={{...big, fontSize: 150, color: A.navy, position: 'absolute', width: '100%', opacity: 1 - ganti, transform: `translateY(${-ganti * 40}px)`}}>
              ARUS<span style={{color: A.orange}}>.</span>
            </div>
            <div style={{...big, fontSize: 150, color: A.navy, position: 'absolute', width: '100%', opacity: ganti, transform: `translateY(${(1 - ganti) * 40}px)`}}>
              SATU APLIKASI<span style={{color: A.orange}}>.</span>
            </div>
          </div>
          <Mono style={{position: 'absolute', bottom: 60, color: A.navy, opacity: interpolate(f, [tGanti + 20, tGanti + 40], [0, 0.7], cl)}}>
            DARI KAPAL SAMPAI KASIR
          </Mono>
        </AbsoluteFill>
      ) : null}
      {f >= tLogo && f < tLogo + 8 ? <AbsoluteFill style={{background: 'white', opacity: 1 - (f - tLogo) / 8}} /> : null}
    </AbsoluteFill>
  );
};

export const Arus: React.FC = () => {
  const f = useCurrentFrame();
  const seg = (from: number, to: number) => ({from: b(from), durationInFrames: b(to) - b(from)});
  const fadeEnd = interpolate(f, [b(ACT.akhir - 2), AR_FRAMES], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: A.ink, fontFamily}}>
      <Sequence {...seg(ACT.tetes, ACT.kata)}>
        <Tetes />
      </Sequence>
      <Sequence {...seg(ACT.kata, ACT.kapal)}>
        <Kata />
      </Sequence>
      <Sequence {...seg(ACT.kapal, ACT.terowongan)}>
        <Kapal />
      </Sequence>
      <Sequence {...seg(ACT.terowongan, ACT.sapuan)}>
        <Terowongan />
      </Sequence>
      <Sequence {...seg(ACT.sapuan, ACT.mosaik)}>
        <Sapuan />
      </Sequence>
      <Sequence {...seg(ACT.mosaik, ACT.kasir)}>
        <Mosaik />
      </Sequence>
      <Sequence {...seg(ACT.kasir, ACT.hening)}>
        <Kasir />
      </Sequence>
      <Sequence {...seg(ACT.hening, ACT.muara)}>
        <Hening />
      </Sequence>
      <Sequence {...seg(ACT.muara, ACT.akhir)}>
        <Muara />
      </Sequence>
      <AbsoluteFill style={{background: A.ink, opacity: fadeEnd}} />
      <Grain opacity={0.07} />
      <Audio src={staticFile('music/arus.wav')} />
    </AbsoluteFill>
  );
};
