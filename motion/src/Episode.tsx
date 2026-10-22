import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, ROLES} from './theme';
import {Episode as Ep, Step, stepFrames, openFrames, mapFrames, recapFrames, voKey, EPISODES} from './data/episodes';
import {voFile, voSec} from './data/vo';
import {DIMS} from './data/dims';
import {Page, SoftBackground, Chip, Screen, SapChip, Logo, useFade, useRise, clamp} from './components/common';
import {FlowMap} from './components/FlowMap';

const Header: React.FC<{ep: Ep; right?: string}> = ({ep, right}) => {
  const role = ROLES[ep.role];
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 36,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <Chip color={role.color}>{role.name}</Chip>
      <div style={{fontSize: 30, fontWeight: 700, color: C.navy}}>
        Episode {ep.no} · {ep.title}
      </div>
      <div style={{flex: 1}} />
      {right ? <div style={{fontSize: 26, fontWeight: 700, color: C.muted}}>{right}</div> : null}
      <Img src={staticFile('brand/pelni_services.png')} style={{width: 140, marginLeft: 16}} />
    </div>
  );
};

const OpenScene: React.FC<{ep: Ep; dur: number}> = ({ep, dur}) => {
  const fade = useFade(dur);
  const role = ROLES[ep.role];
  const a = useRise(0);
  const b = useRise(8);
  const c = useRise(16);
  const d = useRise(26);
  return (
    <Page>
      <SoftBackground accent={role.color} />
      <div style={{position: 'absolute', right: 120, top: 90, opacity: fade}}>
        <Logo size={0.45} />
      </div>
      <AbsoluteFill style={{opacity: fade, padding: '0 160px', justifyContent: 'center'}}>
        <div style={a}>
          <Chip color={role.color} style={{fontSize: 30}}>
            Episode {ep.no} · {role.name}
          </Chip>
        </div>
        <div style={{...b, fontSize: 92, fontWeight: 800, color: C.navy, lineHeight: 1.05, marginTop: 34, maxWidth: 1500}}>
          {ep.title}
        </div>
        <div style={{...c, fontSize: 38, color: C.ink, marginTop: 30, maxWidth: 1400, lineHeight: 1.35}}>{ep.goal}</div>
        <div style={{...d, fontSize: 28, color: C.muted, marginTop: 40}}>
          Akun contoh: <b>{role.akun}</b> · Manual Book bab {ep.bab}
        </div>
      </AbsoluteFill>
    </Page>
  );
};

const MapScene: React.FC<{ep: Ep; dur: number}> = ({ep, dur}) => {
  const fade = useFade(dur);
  const t = useRise(0);
  return (
    <Page>
      <AbsoluteFill style={{opacity: fade}}>
        <div style={{...t, position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center'}}>
          <div style={{fontSize: 30, fontWeight: 700, color: C.muted}}>Posisi Anda di alur</div>
          <div style={{fontSize: 56, fontWeight: 800, color: C.navy, marginTop: 8}}>
            Giliran {ROLES[ep.role].name}
          </div>
        </div>
        <div style={{position: 'absolute', inset: 0, transform: 'translateY(40px)'}}>
          <FlowMap highlight={ep.flow} />
        </div>
      </AbsoluteFill>
    </Page>
  );
};

const IconPanel: React.FC<{icon: Step['icon']}> = ({icon}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [8, 24], [0.6, 1], clamp);
  const map = {
    tolak: {bg: '#FBEBEB', fg: C.red, sym: '↩', label: 'Ditolak · kembali ke pembuat'},
    stok: {bg: '#F9EEDA', fg: '#B45309', sym: '!', label: 'Stok habis di dek ini'},
    info: {bg: '#E7F1FB', fg: C.navy, sym: 'i', label: 'Info'},
  } as const;
  const m = map[icon ?? 'info'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: 130,
        width: 1760,
        height: 640,
        borderRadius: 18,
        background: m.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          background: m.fg,
          color: 'white',
          fontSize: 140,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${s})`,
        }}
      >
        {m.sym}
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color: m.fg}}>{m.label}</div>
    </div>
  );
};

const StepScene: React.FC<{ep: Ep; step: Step; i: number; n: number; dur: number}> = ({ep, step, i, n, dur}) => {
  const fade = useFade(dur, 10, 10);
  const role = ROLES[ep.role];
  const cap = useRise(6, 60);
  const txt = useRise(14, 30);
  const box = {x: 80, y: 130, w: 1760, h: 640};
  return (
    <Page>
      <AbsoluteFill style={{opacity: fade}}>
        <Header ep={ep} right={`Langkah ${i + 1} / ${n}`} />
        {step.img ? (
          <Screen
            src={staticFile(`img/${step.img}.png`)}
            dims={DIMS[step.img]}
            box={box}
            durationInFrames={dur}
            focus={step.focus}
          />
        ) : (
          <IconPanel icon={step.icon} />
        )}
        {step.sap ? (
          <SapChip label={step.sap} delay={Math.round(dur * 0.45)} low={!!step.focus && step.focus[1] < 0.3} />
        ) : null}
        <div
          style={{
            ...cap,
            position: 'absolute',
            left: 80,
            right: 80,
            top: 800,
            height: 240,
            borderRadius: 22,
            background: C.navy,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            padding: '0 48px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              minWidth: 120,
              height: 120,
              borderRadius: 60,
              background: role.color,
              border: '5px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              fontWeight: 800,
            }}
          >
            {i + 1}
          </div>
          <div>
            <div style={{fontSize: 50, fontWeight: 800, lineHeight: 1.1}}>{step.title}</div>
            <div style={{...txt, fontSize: 35, fontWeight: 500, marginTop: 12, lineHeight: 1.3, opacity: 0.95}}>
              {step.text}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 1048,
            height: 8,
            width: 1760 * ((i + interpolate(useCurrentFrame(), [0, dur], [0, 1], clamp)) / n),
            background: role.color,
            borderRadius: 4,
          }}
        />
      </AbsoluteFill>
    </Page>
  );
};

const RecapScene: React.FC<{ep: Ep; dur: number}> = ({ep, dur}) => {
  const fade = useFade(dur, 12, 20);
  const role = ROLES[ep.role];
  const h = useRise(0);
  const items = [useRise(10), useRise(20), useRise(30)];
  const foot = useRise(45);
  return (
    <Page>
      <SoftBackground accent={role.color} />
      <div style={{position: 'absolute', right: 120, top: 90, opacity: fade}}>
        <Logo size={0.45} />
      </div>
      <AbsoluteFill style={{opacity: fade, padding: '0 160px', justifyContent: 'center'}}>
        <div style={{...h, fontSize: 64, fontWeight: 800, color: C.navy}}>Ingat tiga hal</div>
        <div style={{display: 'flex', gap: 36, marginTop: 50}}>
          {ep.recap.map((r, k) => (
            <div
              key={r}
              style={{
                ...items[k],
                flex: 1,
                background: 'white',
                borderRadius: 24,
                padding: 40,
                borderTop: `12px solid ${role.color}`,
                boxShadow: '0 20px 40px rgba(20,40,90,0.12)',
              }}
            >
              <div style={{fontSize: 70, fontWeight: 800, color: role.color}}>{k + 1}</div>
              <div style={{fontSize: 40, fontWeight: 700, marginTop: 10, lineHeight: 1.2}}>{r}</div>
            </div>
          ))}
        </div>
        <div style={{...foot, fontSize: 32, color: C.muted, marginTop: 56}}>
          Langkah lengkap: Manual Book PID POS bab {ep.bab}
          {ep.next ? (
            <>
              {'  ·  '}Berikutnya: <b style={{color: C.navy}}>{ep.next}</b>
            </>
          ) : null}
        </div>
      </AbsoluteFill>
    </Page>
  );
};

// Suara narasi satu bagian, mulai sedikit setelah adegan muncul.
const Narasi: React.FC<{k: string; delay?: number}> = ({k, delay = 8}) =>
  voSec(k) ? (
    <Sequence from={delay}>
      <Audio src={staticFile(voFile(k))} />
    </Sequence>
  ) : null;

export const EpisodeVideo: React.FC<{id: string}> = ({id}) => {
  const ep = EPISODES.find((e) => e.id === id)!;
  const {fps} = useVideoConfig();
  let at = 0;
  const seq: React.ReactNode[] = [];
  const add = (key: string, d: number, node: React.ReactNode, k: string) => {
    seq.push(
      <Sequence key={key} from={at} durationInFrames={d}>
        {node}
        <Narasi k={k} />
      </Sequence>,
    );
    at += d;
  };
  const o = openFrames(ep, fps);
  add('open', o, <OpenScene ep={ep} dur={o} />, voKey.open(ep));
  const m = mapFrames(ep, fps);
  add('map', m, <MapScene ep={ep} dur={m} />, voKey.map(ep));
  ep.steps.forEach((s, i) => {
    const d = stepFrames(ep, i, fps);
    add('s' + i, d, <StepScene ep={ep} step={s} i={i} n={ep.steps.length} dur={d} />, voKey.step(ep, i));
  });
  const r = recapFrames(ep, fps);
  add('recap', r, <RecapScene ep={ep} dur={r} />, voKey.recap(ep));
  return <AbsoluteFill style={{background: C.bg}}>{seq}</AbsoluteFill>;
};
