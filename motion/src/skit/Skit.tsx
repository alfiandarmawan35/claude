import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from '../theme';
import {DIMS} from '../data/dims';
import {Screen, BedMusic} from '../components/common';
import {SKITS, SOROT, Skit as SkitT, skitKey, Line} from './data';
import {Person} from './Person';
import {LatarGudang, LatarKapal, LatarKantor, Konter} from './Latar';
import voJson from './skit_vo.json';

type Word = {w: string; s: number; e: number};
type Vo = {dur: number; words: Word[]; amp: number[]};
const VO = voJson as unknown as Record<string, Vo>;

export const SKIT_FPS = 30;
const GAP = 6; // jeda antar kalimat (frame)
const LEAD = 20; // sebelum kalimat pertama
const END = 105; // kartu penutup

export const skitTimeline = (s: SkitT, fps = SKIT_FPS) => {
  let at = LEAD;
  const lines = s.lines.map((l, i) => {
    const v = VO[skitKey(s, i)];
    const dur = Math.round((v?.dur ?? 3) * fps) + GAP;
    const r = {line: l, i, from: at, dur, vo: v};
    at += dur;
    return r;
  });
  return {lines, endAt: at, total: at + END};
};

const sorot = new Set(SOROT.map((w) => w.toLowerCase()));
const bersih = (w: string) => w.replace(/[^\p{L}\p{N}-]/gu, '').toLowerCase();

// Takarir per kata: kelompok 3–4 kata, kata kunci kuning, kata yang sedang diucapkan sedikit membesar.
const Takarir: React.FC<{words: Word[]; dur: number}> = ({words, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const groups: Word[][] = [];
  let g: Word[] = [];
  words.forEach((w, i) => {
    g.push(w);
    const end = /[.?!]$/.test(w.w) || (/,$/.test(w.w) && g.length >= 2) || g.length >= 4 || (words[i + 1] && words[i + 1].s - w.e > 0.35);
    if (end) {
      groups.push(g);
      g = [];
    }
  });
  if (g.length) groups.push(g);
  let gi = 0;
  groups.forEach((gr, i) => {
    if (t >= gr[0].s - 0.05) gi = i;
  });
  const cur = groups[gi] ?? [];
  if (!cur.length || f > dur - 2) return null;
  const st = cur[0].s * fps;
  const pop = spring({frame: f - st, fps, config: {damping: 12, stiffness: 220}});
  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 50,
        top: 1640,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '0 22px',
        transform: `scale(${0.85 + 0.15 * pop})`,
      }}
    >
      {cur.map((w, i) => {
        const key = sorot.has(bersih(w.w));
        const now = t >= w.s && t < w.e + 0.05;
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: key ? 96 : 76,
              color: key ? '#FFD60A' : 'white',
              WebkitTextStroke: '12px #111',
              paintOrder: 'stroke fill',
              textShadow: '0 6px 0 rgba(0,0,0,0.35)',
              transform: `scale(${now ? 1.08 : 1})`,
              display: 'inline-block',
              letterSpacing: -1,
            }}
          >
            {w.w.replace(/[,.]$/, '')}
          </span>
        );
      })}
    </div>
  );
};

const Tanya: React.FC<{x: number}> = ({x}) => {
  const f = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const p = ((f + i * 12) % 36) / 36;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 140 + i * 110,
              top: 900 - p * 90 - i * 30,
              fontFamily,
              fontWeight: 800,
              fontSize: 120,
              color: '#FFD60A',
              WebkitTextStroke: '8px #111',
              paintOrder: 'stroke fill',
              opacity: Math.sin(p * Math.PI),
              transform: `rotate(${(i - 1) * 15}deg)`,
            }}
          >
            ?
          </div>
        );
      })}
    </>
  );
};

const NamaTokoh: React.FC<{name: string; peran: string; color: string; left: boolean}> = ({name, peran, color, left}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  const out = interpolate(f, [80, 95], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top: 1030,
        [left ? 'left' : 'right']: 40,
        transform: `translateX(${(1 - s) * (left ? -400 : 400)}px)`,
        opacity: out,
        background: 'white',
        borderRadius: 18,
        padding: '12px 24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        borderLeft: left ? `12px solid #${color}` : undefined,
        borderRight: left ? undefined : `12px solid #${color}`,
        fontFamily,
      }}
    >
      <div style={{fontSize: 40, fontWeight: 800, color: '#1B2437'}}>{name}</div>
      <div style={{fontSize: 26, fontWeight: 600, color: '#5B6B86'}}>{peran}</div>
    </div>
  );
};

const Adegan: React.FC<{s: SkitT; line: Line; prev?: Line; vo?: Vo; dur: number; first: boolean}> = ({s, line, prev, vo, dur, first}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amp = vo ? vo.amp[Math.min(vo.amp.length - 1, Math.max(0, f))] ?? 0 : 0;
  const kamera = line.pose === 'kamera';
  const speaker = line.who;
  const blink = (f + (speaker === 'a' ? 0 : 37)) % 110 < 4;
  const grey = line.pose === 'bingung' ? interpolate(f, [0, dur * 0.7, dur * 0.85], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const punch = line.pose === 'bingung' ? 1 + 0.05 * spring({frame: f, fps, config: {damping: 9}}) : 1;
  const newScreen = line.screen && (!prev?.screen || prev.screen.img !== line.screen.img);
  const scr = line.screen ? (newScreen ? spring({frame: f, fps, config: {damping: 14}}) : 1) : 0;
  const Latar = {kapal: LatarKapal, gudang: LatarGudang, kantor: LatarKantor}[s.tempat];
  const tokoh = (k: 'a' | 'b') => {
    const T = s[k];
    const talking = k === speaker;
    const pose = talking ? line.pose ?? 'idle' : 'idle';
    const bob = talking ? Math.sin(f / 4) * amp * 6 : Math.sin(f / 30) * 2;
    return (
      <div
        key={k}
        style={{
          position: 'absolute',
          width: 540,
          height: 756,
          left: k === 'a' ? 0 : 540,
          top: 860 + bob,
          transform: `scale(${talking ? 1.03 : 1})`,
          transformOrigin: '50% 100%',
        }}
      >
        <Person gender={T.gender} baju={T.baju} aksen={T.aksen} name={T.name} pose={pose} amp={talking ? amp : 0} blink={blink} t={f} side={k === 'a' ? 'l' : 'r'} />
      </div>
    );
  };
  const camX = kamera ? 0 : speaker === 'a' ? 20 : -20;
  return (
    <AbsoluteFill style={{filter: `grayscale(${grey})`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${punch}) translateX(${camX}px)`}}>
        <Latar t={f} papan={s.papan} />
        {kamera ? (
          <div
            style={{
              position: 'absolute',
              width: 760,
              height: 1064,
              left: 160,
              top: 640 + Math.sin(f / 4) * amp * 6,
            }}
          >
            <Person
              gender={s.b.gender}
              baju={s.b.baju}
              aksen={s.b.aksen}
              name={s.b.name}
              pose="kamera"
              amp={amp}
              blink={blink}
              t={f}
              side="r"
            />
          </div>
        ) : (
          <>
            {tokoh('a')}
            {tokoh('b')}
            <Konter tempat={s.tempat} />
          </>
        )}
      </AbsoluteFill>
      {line.pose === 'bingung' ? <Tanya x={speaker === 'a' ? 280 : 800} /> : null}
      {line.screen ? (
        <AbsoluteFill style={{transform: `translateY(${(1 - scr) * -900}px) scale(${0.9 + 0.1 * scr})`, transformOrigin: '50% 0%'}}>
          <Screen
            src={staticFile(`img/${line.screen.img}.png`)}
            dims={DIMS[line.screen.img]}
            box={{x: 40, y: 150, w: 1000, h: 640}}
            durationInFrames={dur}
            focus={line.screen.focus}
          />
        </AbsoluteFill>
      ) : null}
      {first ? <NamaTokoh name={s[speaker].name} peran={s[speaker].peran} color={s[speaker].baju} left={speaker === 'a'} /> : null}
      {vo ? <Takarir words={vo.words} dur={dur} /> : null}
    </AbsoluteFill>
  );
};

const Judul: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 10}});
  const out = interpolate(f, [70, 85], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 260,
        textAlign: 'center',
        transform: `scale(${s}) rotate(-3deg)`,
        opacity: out,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#FFD60A',
          color: '#111',
          fontFamily,
          fontWeight: 800,
          fontSize: 78,
          lineHeight: 1.1,
          padding: '20px 36px',
          borderRadius: 26,
          boxShadow: '0 14px 0 #111',
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Penutup: React.FC<{s: SkitT}> = ({s}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f, fps, config: {damping: 12}});
  const b = spring({frame: f - 10, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: '#1F3B7A', alignItems: 'center', justifyContent: 'center', fontFamily, padding: 80}}>
      <div style={{fontSize: 96, fontWeight: 800, color: '#FFD60A', textAlign: 'center', transform: `scale(${a})`, lineHeight: 1.05}}>{s.penutup.judul}</div>
      <div style={{fontSize: 52, fontWeight: 700, color: 'white', textAlign: 'center', marginTop: 40, opacity: b, lineHeight: 1.25}}>{s.penutup.sub}</div>
      <div style={{marginTop: 90, background: 'white', borderRadius: 30, padding: '26px 44px', display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${b})`}}>
        <Img src={staticFile('brand/pelni_services.png')} style={{width: 330}} />
        <div style={{width: 4, alignSelf: 'stretch', background: '#D5DEEC'}} />
        <div style={{fontSize: 80, fontWeight: 800, color: '#1F3B7A'}}>PID POS</div>
      </div>
    </AbsoluteFill>
  );
};

export const SkitVideo: React.FC<{id: string}> = ({id}) => {
  const s = SKITS.find((x) => x.id === id)!;
  const {fps} = useVideoConfig();
  const tl = skitTimeline(s, fps);
  const seen = new Set<string>();
  const speech: [number, number][] = tl.lines.filter((x) => x.vo).map((x) => [x.from, x.from + Math.round(x.vo!.dur * fps)]);
  return (
    <AbsoluteFill style={{background: '#1F3B7A'}}>
      <Sequence durationInFrames={LEAD + 1}>
        <Adegan s={s} line={{...s.lines[0], pose: 'bingung'}} dur={LEAD + 1} first={false} />
      </Sequence>
      {tl.lines.map(({line, i, from, dur, vo}) => {
        const first = !seen.has(line.who) && line.pose !== 'kamera';
        if (first) seen.add(line.who);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Adegan s={s} line={line} prev={s.lines[i - 1]} vo={vo} dur={dur} first={first} />
            <Audio src={staticFile(`skit/${skitKey(s, i)}.mp3`)} />
          </Sequence>
        );
      })}
      <Sequence durationInFrames={95}>
        <Judul text={s.judul} />
      </Sequence>
      <Sequence from={tl.endAt} durationInFrames={END}>
        <Penutup s={s} />
      </Sequence>
      <Img src={staticFile('brand/pelni_services.png')} style={{position: 'absolute', right: 40, top: 40, width: 200, background: 'rgba(255,255,255,0.85)', borderRadius: 14, padding: '8px 12px'}} />
      <BedMusic total={tl.total} speech={speech} />
    </AbsoluteFill>
  );
};
