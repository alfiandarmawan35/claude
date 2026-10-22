import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {C, ROLES, RoleKey, fontFamily} from './theme';
import {Page, SoftBackground, Screen, SapChip, Logo, useFade, useRise, clamp} from './components/common';
import {FlowMap, tokenPos} from './components/FlowMap';
import {DIMS} from './data/dims';
import {EPISODES} from './data/episodes';
import {introScenes, TimedScene} from './data/intro';
import {voFile, voSec} from './data/vo';

// Teks keterangan di bawah layar (sama dengan narasi suara).
const Caption: React.FC<{text: string; dur: number; dark?: boolean}> = ({text, dur, dark}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [4, 16], [0, 1], clamp), interpolate(f, [dur - 10, dur], [1, 0], clamp));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 60,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
        transform: `translateY(${(1 - o) * 20}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          background: dark ? 'rgba(255,255,255,0.95)' : C.navy,
          color: dark ? C.navy : 'white',
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.3,
          padding: '22px 44px',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Kalimat adegan: keterangan di layar dan suara narasi, sesuai waktunya.
const SceneLines: React.FC<{sc: TimedScene; dark?: boolean}> = ({sc, dark}) => (
  <>
    {sc.lines.map((l) => (
      <Sequence key={l.key} from={l.from} durationInFrames={l.dur}>
        {l.caption === false ? null : <Caption text={l.text} dur={l.dur} dark={dark} />}
        {voSec(l.key) ? (
          <Sequence from={4}>
            <Audio src={staticFile(voFile(l.key))} />
          </Sequence>
        ) : null}
      </Sequence>
    ))}
  </>
);

type SceneProps = {dur: number; sc: TimedScene};

const Ship: React.FC<{x: number}> = ({x}) => (
  <svg width={760} height={330} viewBox="0 0 760 330" style={{position: 'absolute', left: x, top: 430}}>
    <path d="M20 200 L740 200 L680 300 L80 300 Z" fill="#14285A" />
    <rect x={130} y={130} width={470} height={70} rx={6} fill="white" />
    <rect x={200} y={70} width={340} height={60} rx={6} fill="white" />
    <rect x={280} y={20} width={180} height={50} rx={6} fill="white" />
    <rect x={480} y={0} width={36} height={70} fill="#E5A72B" />
    {[150, 210, 270, 330, 390, 450, 510, 560].map((cx) => (
      <circle key={cx} cx={cx} cy={165} r={11} fill="#2E6FB5" />
    ))}
    {[230, 290, 350, 410, 470].map((cx) => (
      <rect key={cx} x={cx} y={88} width={34} height={22} rx={4} fill="#2E6FB5" />
    ))}
    <rect x={20} y={230} width={720} height={10} fill="#E5A72B" />
  </svg>
);

const Waves: React.FC = () => {
  const f = useCurrentFrame();
  const wave = (y: number, amp: number, speed: number, color: string) => {
    let d = `M 0 ${y}`;
    for (let x = 0; x <= 1920; x += 40) d += ` L ${x} ${y + Math.sin(x / 120 + f / speed) * amp}`;
    d += ' L 1920 1080 L 0 1080 Z';
    return <path d={d} fill={color} />;
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {wave(720, 14, 14, C.sea)}
      {wave(760, 10, 10, C.seaDark)}
    </svg>
  );
};

const SceneShip: React.FC<SceneProps> = ({dur, sc}) => {
  const f = useCurrentFrame();
  const fade = useFade(dur, 1, 12);
  const title = useRise(20);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#BFD8F5, #EEF3FB)', opacity: fade, fontFamily}}>
      <div style={{...title, position: 'absolute', top: 150, width: '100%', textAlign: 'center'}}>
        <div style={{fontSize: 34, fontWeight: 700, color: C.muted, letterSpacing: 4}}>TOKO DI ATAS KAPAL</div>
      </div>
      <Ship x={interpolate(f, [0, dur], [-200, 700])} />
      <Waves />
      <SceneLines sc={sc} dark />
    </AbsoluteFill>
  );
};

const SceneProblem: React.FC<SceneProps> = ({dur, sc}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = useFade(dur, 10, 1);
  const items = [
    {t: 'Kertas permintaan', c: '#F9EEDA', x: 340, y: 230, r: -8},
    {t: 'Chat persetujuan', c: '#E5F4E4', x: 760, y: 300, r: 5},
    {t: 'Tabel Excel stok', c: '#E7F1FB', x: 1180, y: 220, r: -4},
    {t: 'Stok: 24? 18? 30?', c: '#FBEBEB', x: 760, y: 520, r: 3},
  ];
  // Di akhir adegan semua kartu tersapu ke tengah.
  const sweep = interpolate(f, [dur - 40, dur - 5], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <Page>
      <AbsoluteFill style={{opacity: fade}}>
        {items.map((it, i) => {
          const s = spring({frame: f - 8 - i * 14, fps, config: {damping: 12}});
          const shake = i === 3 ? Math.sin(f / 2) * 6 * interpolate(f, [70, 90], [0, 1], clamp) : 0;
          return (
            <div
              key={it.t}
              style={{
                position: 'absolute',
                left: it.x + (960 - 200 - it.x) * sweep + shake,
                top: it.y + (400 - it.y) * sweep,
                width: 400,
                height: 220,
                background: it.c,
                borderRadius: 22,
                boxShadow: '0 20px 40px rgba(20,40,90,0.15)',
                transform: `scale(${s * (1 - sweep * 0.8)}) rotate(${it.r * (1 - sweep)}deg)`,
                opacity: 1 - sweep,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 38,
                fontWeight: 800,
                color: i === 3 ? C.red : C.ink,
                textAlign: 'center',
                padding: 20,
                boxSizing: 'border-box',
              }}
            >
              {it.t}
            </div>
          );
        })}
        <SceneLines sc={sc} />
      </AbsoluteFill>
    </Page>
  );
};

const SceneReveal: React.FC<SceneProps> = ({dur, sc}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = useFade(dur, 1, 12);
  const s = spring({frame: f, fps, config: {damping: 13}});
  const tags = ['Satu aplikasi', 'Satu alur', 'Langsung ke SAP'];
  return (
    <Page>
      <SoftBackground />
      <AbsoluteFill style={{opacity: fade, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${s})`}}>
          <Logo />
        </div>
        <div style={{display: 'flex', gap: 24, marginTop: 50}}>
          {tags.map((t, i) => {
            const o = interpolate(f, [30 + i * 18, 44 + i * 18], [0, 1], clamp);
            return (
              <div
                key={t}
                style={{
                  opacity: o,
                  transform: `translateY(${(1 - o) * 30}px)`,
                  background: i === 2 ? C.green : 'white',
                  color: i === 2 ? 'white' : C.navy,
                  fontSize: 40,
                  fontWeight: 800,
                  padding: '16px 34px',
                  borderRadius: 999,
                  boxShadow: '0 10px 24px rgba(20,40,90,0.12)',
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <SceneLines sc={sc} />
    </Page>
  );
};

// Waktu munculnya simpul peta alur mengikuti kalimat narasinya.
const flowTimes = (sc: TimedScene) => {
  const L = sc.lines;
  return {
    pesan: L[0].from + 6,
    so: L[1].from,
    pilah: L[2].from,
    pur: L[3].from,
    po: L[3].from + Math.round(L[3].dur * 0.5),
    grpo: L[4].from,
    transfer: L[5].from,
    terima: L[6].from,
    jual: L[7].from,
  };
};

const SceneFlow: React.FC<SceneProps> = ({dur, sc}) => {
  const f = useCurrentFrame();
  const fade = useFade(dur, 12, 12);
  const times = flowTimes(sc);
  const tok = tokenPos(f, times);
  const title = useRise(0);
  return (
    <Page>
      <AbsoluteFill style={{opacity: fade}}>
        <div style={{...title, position: 'absolute', top: 70, width: '100%', textAlign: 'center'}}>
          <div style={{fontSize: 58, fontWeight: 800, color: C.navy}}>Alur barang: dari kapal sampai kasir</div>
          <div style={{fontSize: 30, color: C.muted, marginTop: 8}}>Contoh: KM Awu · Dek 3 dan Dek 7</div>
        </div>
        <FlowMap times={times} />
        {f > times.pesan ? (
          <div
            style={{
              position: 'absolute',
              left: tok.x - 34,
              top: tok.y - 128,
              width: 68,
              height: 46,
              borderRadius: 10,
              background: '#F59E0B',
              boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            ▤
          </div>
        ) : null}
        <SceneLines sc={sc} />
      </AbsoluteFill>
    </Page>
  );
};

const RoleCard: React.FC<{r: RoleKey; i: number}> = ({r, i}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 10 - i * 7, fps, config: {damping: 14}});
  const role = ROLES[r];
  return (
    <div
      style={{
        width: 225,
        height: 260,
        background: 'white',
        borderRadius: 22,
        borderTop: `12px solid ${role.color}`,
        boxShadow: '0 18px 36px rgba(20,40,90,0.14)',
        transform: `translateY(${(1 - s) * 80}px)`,
        opacity: s,
        padding: 20,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          background: role.color,
          color: 'white',
          fontSize: 38,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {role.short}
      </div>
      <div style={{fontSize: 28, fontWeight: 800, textAlign: 'center', lineHeight: 1.15}}>{role.name}</div>
    </div>
  );
};

const SceneRoles: React.FC<SceneProps> = ({dur, sc}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = useFade(dur);
  const title = useRise(0);
  const bellAt = sc.lines[1].from;
  const bell = spring({frame: f - bellAt, fps, config: {damping: 8}});
  const keys = Object.keys(ROLES) as RoleKey[];
  return (
    <Page>
      <SoftBackground />
      <AbsoluteFill style={{opacity: fade}}>
        <div style={{...title, position: 'absolute', top: 110, width: '100%', textAlign: 'center'}}>
          <div style={{fontSize: 64, fontWeight: 800, color: C.navy}}>7 peran · 1 alur</div>
        </div>
        <div style={{position: 'absolute', top: 290, width: '100%', display: 'flex', justifyContent: 'center', gap: 26}}>
          {keys.map((k, i) => (
            <RoleCard key={k} r={k} i={i} />
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 620,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            opacity: bell,
            transform: `scale(${0.8 + 0.2 * bell})`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'white', borderRadius: 999, padding: '14px 34px', boxShadow: '0 10px 24px rgba(20,40,90,0.12)'}}>
            <svg width={46} height={46} viewBox="0 0 24 24" style={{transform: `rotate(${Math.sin(f / 3) * 12 * Math.max(0, 1 - (f - bellAt) / 60)}deg)`}}>
              <path d="M12 2a6 6 0 0 0-6 6v4l-2 4h16l-2-4V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z" fill={C.navy} />
            </svg>
            <span style={{background: C.red, color: 'white', borderRadius: 999, padding: '2px 14px', fontSize: 30, fontWeight: 800}}>3</span>
            <span style={{fontSize: 34, fontWeight: 700, color: C.navy}}>Lonceng: tugas yang menunggu</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', background: C.navy, color: 'white', borderRadius: 999, padding: '14px 34px', fontSize: 34, fontWeight: 700}}>
            Tab Giliran saya
          </div>
        </div>
        <SceneLines sc={sc} />
      </AbsoluteFill>
    </Page>
  );
};

const SceneKasir: React.FC<SceneProps> = ({dur, sc}) => {
  const fade = useFade(dur);
  const box = {x: 160, y: 60, w: 1600, h: 760};
  const shots = ['g45', 'g46', 'g47'];
  return (
    <Page>
      <AbsoluteFill style={{opacity: fade}}>
        {shots.map((img, i) => {
          const l = sc.lines[i];
          return (
            <Sequence key={img} from={l.from} durationInFrames={l.dur}>
              <ShotFade dur={l.dur}>
                <Screen src={staticFile(`img/${img}.png`)} dims={DIMS[img]} box={box} durationInFrames={l.dur} />
              </ShotFade>
              {i === 2 ? <SapChip label="Delivery (DO)" delay={Math.round(l.dur * 0.4)} /> : null}
            </Sequence>
          );
        })}
        <SceneLines sc={sc} />
      </AbsoluteFill>
    </Page>
  );
};

const ShotFade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const o = useFade(dur, 8, 8);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const SceneOutro: React.FC<SceneProps> = ({dur, sc}) => {
  const fade = useFade(dur, 12, 1);
  const a = useRise(0);
  const b = useRise(14);
  const c = useRise(28);
  return (
    <Page>
      <SoftBackground />
      <AbsoluteFill style={{opacity: fade, alignItems: 'center', justifyContent: 'center'}}>
        <div style={a}>
          <Logo size={0.8} />
        </div>
        <div style={{...b, fontSize: 46, fontWeight: 700, color: C.ink, marginTop: 30, textAlign: 'center'}}>
          Dari permintaan kapal sampai struk kasir, semua tercatat.
        </div>
        <div style={{...c, marginTop: 60, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 1600}}>
          {EPISODES.map((e) => (
            <div
              key={e.id}
              style={{
                background: 'white',
                borderLeft: `10px solid ${ROLES[e.role].color}`,
                borderRadius: 14,
                padding: '12px 22px',
                fontSize: 28,
                fontWeight: 700,
                color: C.navy,
                boxShadow: '0 8px 18px rgba(20,40,90,0.1)',
              }}
            >
              Ep. {e.no} · {ROLES[e.role].name}
            </div>
          ))}
        </div>
        <div style={{...c, marginTop: 50, fontSize: 40, fontWeight: 800, color: C.green}}>Tonton episode sesuai peran Anda</div>
      </AbsoluteFill>
      <SceneLines sc={sc} />
    </Page>
  );
};

const SCENES: Record<string, React.FC<SceneProps>> = {
  kapal: SceneShip,
  masalah: SceneProblem,
  pidpos: SceneReveal,
  alur: SceneFlow,
  peran: SceneRoles,
  kasir: SceneKasir,
  penutup: SceneOutro,
};

export const introFrames = (fps: number) => introScenes(fps).reduce((a, sc) => a + sc.dur, 0);

export const Intro: React.FC = () => {
  const {fps} = useVideoConfig();
  let at = 0;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {introScenes(fps).map((sc) => {
        const from = at;
        at += sc.dur;
        const S = SCENES[sc.id];
        return (
          <Sequence key={sc.id} from={from} durationInFrames={sc.dur}>
            <S dur={sc.dur} sc={sc} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
