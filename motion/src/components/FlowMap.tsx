import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, ROLES, RoleKey} from '../theme';
import {clamp} from './common';

// Peta alur utama (bab 1.2 manual). Koordinat dalam kanvas 1920x1080.
type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  label: string;
  step: string;
  roles: RoleKey[];
  sap?: string;
};

export const NODES: Node[] = [
  {id: 'pesan', x: 170, y: 400, w: 230, label: 'Pesan barang', step: '1', roles: ['kapal']},
  {id: 'so', x: 445, y: 400, w: 230, label: 'Approval SO', step: '2', roles: ['so'], sap: 'Sales Order'},
  {id: 'pilah', x: 720, y: 400, w: 230, label: 'Pilah stok DC', step: '3', roles: ['dc']},
  {id: 'pur', x: 770, y: 700, w: 180, label: 'PUR', step: '4', roles: ['pur'], sap: 'PUR'},
  {id: 'po', x: 985, y: 700, w: 180, label: 'PO', step: '5–6', roles: ['purchase', 'po'], sap: 'PO'},
  {id: 'grpo', x: 1200, y: 700, w: 180, label: 'GRPO', step: '7–8', roles: ['dc', 'pur'], sap: 'GRPO'},
  {id: 'transfer', x: 1240, y: 400, w: 230, label: 'Transfer ke dek', step: '9–10', roles: ['dc', 'pur'], sap: 'Inv. Transfer'},
  {id: 'terima', x: 1515, y: 400, w: 230, label: 'Terima di dek', step: '11–12', roles: ['kapal', 'so'], sap: 'SO ditutup'},
  {id: 'jual', x: 1760, y: 400, w: 210, label: 'Jual & DO', step: '13', roles: ['kasir'], sap: 'Delivery (DO)'},
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const NH = 150; // tinggi kartu

type Edge = {from: string; to: string; d: string; label?: string; lx?: number; ly?: number};
const EDGES: Edge[] = [
  {from: 'pesan', to: 'so', d: 'M 285 400 L 330 400'},
  {from: 'so', to: 'pilah', d: 'M 560 400 L 605 400'},
  {from: 'pilah', to: 'transfer', d: 'M 835 400 L 1125 400', label: 'stok DC ada', lx: 980, ly: 382},
  {from: 'pilah', to: 'pur', d: 'M 720 475 C 720 560, 650 620, 680 690', label: 'stok DC kurang', lx: 580, ly: 590},
  {from: 'pur', to: 'po', d: 'M 860 700 L 895 700'},
  {from: 'po', to: 'grpo', d: 'M 1075 700 L 1110 700'},
  {from: 'grpo', to: 'transfer', d: 'M 1290 700 C 1330 700, 1250 580, 1245 478'},
  {from: 'transfer', to: 'terima', d: 'M 1355 400 L 1400 400'},
  {from: 'terima', to: 'jual', d: 'M 1630 400 L 1655 400'},
];

// Urutan munculnya simpul pada animasi peta alur.
export const REVEAL = ['pesan', 'so', 'pilah', 'pur', 'po', 'grpo', 'transfer', 'terima', 'jual'];

export const FlowMap: React.FC<{
  times?: Record<string, number>; // frame munculnya setiap simpul; kosong = semua tampil langsung
  highlight?: string[]; // simpul yang dinyalakan, sisanya redup
  showSap?: boolean;
}> = ({times, highlight, showSap = true}) => {
  const f = useCurrentFrame();
  const gap = times ? 1 : 0;
  const at = (id: string) => (times ? times[id] : 0);
  const appear = (id: string) => (times ? interpolate(f, [at(id), at(id) + 14], [0, 1], clamp) : 1);
  const dim = (id: string) => (highlight && !highlight.includes(id) ? 0.28 : 1);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.navy} />
          </marker>
        </defs>
        {EDGES.map((e) => {
          const p = Math.min(appear(e.from), 1) * (gap ? appear(e.to) : 1);
          const prog = gap
            ? interpolate(f, [at(e.to) - 10, at(e.to) + 6], [0, 1], {
                ...clamp,
                easing: Easing.out(Easing.cubic),
              })
            : 1;
          const o = Math.min(dim(e.from), dim(e.to)) < 1 ? 0.25 : 1;
          return (
            <g key={e.from + e.to} opacity={o}>
              <path
                d={e.d}
                stroke={C.navy}
                strokeWidth={4}
                fill="none"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog}
                markerEnd={prog > 0.95 ? 'url(#arr)' : undefined}
              />
              {e.label ? (
                <text
                  x={e.lx}
                  y={e.ly}
                  textAnchor="middle"
                  fontSize={22}
                  fontWeight={600}
                  fill={C.muted}
                  opacity={p}
                >
                  {e.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {NODES.map((n) => {
        const a = appear(n.id);
        const lit = highlight?.includes(n.id);
        const main = ROLES[n.roles[0]].color;
        return (
          <div
            key={n.id}
            style={{
              position: 'absolute',
              left: n.x - n.w / 2,
              top: n.y - NH / 2,
              width: n.w,
              height: NH,
              opacity: a * dim(n.id),
              transform: `scale(${(0.7 + 0.3 * a) * (lit ? 1.08 : 1)})`,
              background: 'white',
              borderRadius: 18,
              borderTop: `10px solid ${main}`,
              boxShadow: lit ? `0 0 0 5px ${main}, 0 24px 40px rgba(20,40,90,0.25)` : '0 14px 28px rgba(20,40,90,0.14)',
              padding: '12px 16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontSize: 18, fontWeight: 700, color: C.muted}}>Langkah {n.step}</div>
            <div style={{fontSize: 26, fontWeight: 800, color: C.ink, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{n.label}</div>
            <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
              {n.roles.map((r) => (
                <div
                  key={r}
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'white',
                    background: ROLES[r].color,
                    borderRadius: 6,
                    padding: '2px 8px',
                  }}
                >
                  {n.w < 200 ? ROLES[r].short : ROLES[r].name.replace(' (P2)', '')}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showSap
        ? NODES.filter((n) => n.sap).map((n) => {
            const a = gap ? interpolate(f, [at(n.id) + 10, at(n.id) + 22], [0, 1], clamp) : 1;
            return (
              <div
                key={'sap' + n.id}
                style={{
                  position: 'absolute',
                  left: n.x - 110,
                  width: 220,
                  top: n.y + NH / 2 + 14,
                  textAlign: 'center',
                  opacity: a * dim(n.id),
                  transform: `translateY(${(1 - a) * -20}px)`,
                }}
              >
                <span
                  style={{
                    background: '#E5F4E4',
                    color: C.green,
                    border: `2px solid ${C.green}`,
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 17,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  SAP · {n.sap}
                </span>
              </div>
            );
          })
        : null}
    </div>
  );
};

// Posisi token yang berjalan di sepanjang alur (dipakai di video perkenalan).
export const tokenPos = (f: number, times: Record<string, number>) => {
  const pts = REVEAL.map((id) => ({...byId[id], t: times[id]}));
  let i = 0;
  while (i < pts.length - 1 && f >= pts[i + 1].t) i++;
  if (i === pts.length - 1) return {x: pts[i].x, y: pts[i].y};
  const k = Math.max(0, Math.min(1, (f - (pts[i + 1].t - 22)) / 24));
  const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  return {x: pts[i].x + (pts[i + 1].x - pts[i].x) * e, y: pts[i].y + (pts[i + 1].y - pts[i].y) * e};
};
