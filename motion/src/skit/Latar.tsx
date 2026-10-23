import React from 'react';
import {AbsoluteFill, random} from 'remotion';

// Latar ilustrasi datar 1080 x 1920: toko di kapal, atau gudang DC.

const Rak: React.FC<{x: number; y: number; w: number; items: string[]}> = ({x, y, w, items}) => (
  <g>
    {items.map((c, i) => {
      const bw = (w - 20) / items.length;
      const h = 70 + random(`h${x}${y}${i}`) * 40;
      const bottle = c.startsWith('b');
      const col = bottle ? c.slice(1) : c;
      return bottle ? (
        <g key={i}>
          <rect x={x + 10 + i * bw + bw * 0.2} y={y - h} width={bw * 0.6} height={h} rx={10} fill={col} opacity={0.85} />
          <rect x={x + 10 + i * bw + bw * 0.35} y={y - h - 14} width={bw * 0.3} height={16} rx={4} fill="#1F3B7A" />
          <rect x={x + 10 + i * bw + bw * 0.2} y={y - h * 0.6} width={bw * 0.6} height={h * 0.25} fill="white" opacity={0.7} />
        </g>
      ) : (
        <g key={i}>
          <rect x={x + 10 + i * bw + 4} y={y - h} width={bw - 8} height={h} rx={6} fill={col} />
          <rect x={x + 10 + i * bw + 12} y={y - h + 14} width={bw - 24} height={14} rx={4} fill="white" opacity={0.6} />
        </g>
      );
    })}
    <rect x={x} y={y} width={w} height={16} rx={4} fill="#9AA9BD" />
  </g>
);

export const LatarKapal: React.FC<{t: number; papan?: string}> = ({t, papan = 'TOKO · DEK 7'}) => {
  const sway = Math.sin(t / 55) * 0.5;
  const porthole = (cx: number, cy: number) => (
    <g>
      <circle cx={cx} cy={cy} r={92} fill="#8C9AAE" />
      <circle cx={cx} cy={cy} r={74} fill="url(#laut)" />
      <path
        d={`M ${cx - 74} ${cy + 12 + Math.sin(t / 12) * 6} Q ${cx - 30} ${cy - 2} ${cx} ${cy + 12} T ${cx + 74} ${cy + 12 + Math.cos(t / 12) * 6} L ${cx + 74} ${cy + 80} L ${cx - 74} ${cy + 80} Z`}
        fill="#1D4F8A"
        clipPath={`url(#c${cx})`}
      />
      <clipPath id={`c${cx}`}>
        <circle cx={cx} cy={cy} r={74} />
      </clipPath>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={cx + Math.cos((a * Math.PI) / 180) * 83} cy={cy + Math.sin((a * Math.PI) / 180) * 83} r={6} fill="#6B7A8F" />
      ))}
    </g>
  );
  return (
    <AbsoluteFill style={{transform: `rotate(${sway}deg) scale(1.04)`}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="dinding" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F3F7FC" />
            <stop offset="1" stopColor="#D6E2F1" />
          </linearGradient>
          <linearGradient id="laut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BFE0FF" />
            <stop offset="0.55" stopColor="#7FB7F0" />
            <stop offset="1" stopColor="#2E6FB5" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#dinding)" />
        <rect y={0} width={1080} height={90} fill="#C9D6E8" />
        {[180, 540, 900].map((x) => (
          <rect key={x} x={x - 90} y={70} width={180} height={18} rx={9} fill="#FFFBE8" />
        ))}
        {/* papan nama toko */}
        <rect x={340} y={150} width={400} height={86} rx={16} fill="#1F3B7A" />
        <text x={540} y={207} textAnchor="middle" fontSize={44} fontWeight={800} fill="white" fontFamily="Plus Jakarta Sans">
          {papan}
        </text>
        {porthole(165, 470)}
        {porthole(915, 470)}
        {/* rak barang */}
        <rect x={300} y={280} width={480} height={760} rx={10} fill="#E6EDF6" />
        <Rak x={310} y={480} w={460} items={['b#3D8BFF', 'b#3D8BFF', 'b#3D8BFF', 'b#3D8BFF', 'b#3D8BFF']} />
        <Rak x={310} y={700} w={460} items={['#22A05A', '#22A05A', '#E5A72B', '#E5A72B']} />
        <Rak x={310} y={920} w={460} items={['#C0392B', '#F59E0B', '#7C3AED', '#0F766E', '#F59E0B']} />
        <Rak x={20} y={760} w={240} items={['#E5A72B', '#22A05A', '#3D8BFF']} />
        <Rak x={820} y={760} w={240} items={['#C0392B', '#7C3AED', '#22A05A']} />
        <rect x={0} y={1100} width={1080} height={820} fill="#C7D3E3" />
      </svg>
    </AbsoluteFill>
  );
};

export const LatarGudang: React.FC<{t: number; papan?: string}> = ({t, papan = 'GUDANG DC-JKT'}) => {
  const box = (x: number, y: number, w: number, h: number, label?: string) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#C89B62" />
      <rect x={x} y={y + h * 0.42} width={w} height={h * 0.12} fill="#B7864D" />
      {label ? (
        <text x={x + w / 2} y={y + h * 0.33} textAnchor="middle" fontSize={22} fontWeight={800} fill="#6B4A26" fontFamily="Plus Jakarta Sans">
          {label}
        </text>
      ) : null}
    </g>
  );
  const level = (y: number, labels: (string | undefined)[]) => (
    <g>
      <rect x={0} y={y} width={1080} height={22} fill="#EA580C" />
      {labels.map((l, i) => box(40 + i * 205, y - 150, 180, 150, l))}
      <rect x={20} y={y + 22} width={1040} height={10} fill="#8B6A3E" />
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill="#E7EAEE" />
        {/* lampu gantung */}
        {[200, 540, 880].map((x) => (
          <g key={x}>
            <rect x={x - 2} y={0} width={4} height={60} fill="#5B6B86" />
            <path d={`M ${x - 60} 100 L ${x + 60} 100 L ${x + 30} 60 L ${x - 30} 60 Z`} fill="#3E4A5E" />
            <ellipse cx={x} cy={102} rx={50} ry={8} fill="#FFF5C8" opacity={0.9 + Math.sin(t / 7 + x) * 0.05} />
          </g>
        ))}
        <rect x={340} y={140} width={400} height={80} rx={14} fill="#1F3B7A" />
        <text x={540} y={194} textAnchor="middle" fontSize={40} fontWeight={800} fill="white" fontFamily="Plus Jakarta Sans">
          {papan}
        </text>
        {/* rak tinggi */}
        {[30, 1035].map((x) => (
          <rect key={x} x={x} y={260} width={18} height={900} fill="#2563EB" />
        ))}
        {[263, 556].map((x) => (
          <rect key={x} x={x} y={260} width={14} height={900} fill="#2563EB" opacity={0.9} />
        ))}
        {level(430, ['AQUA', 'AQUA', 'AQUA', undefined, 'MAMY'])}
        {level(690, ['PARAMEX', undefined, 'AQUA', 'AQUA', undefined])}
        {level(950, [undefined, 'TEH', undefined, 'AQUA', 'MAMY'])}
        {/* lantai */}
        <rect x={0} y={1100} width={1080} height={820} fill="#B9C0CA" />
        <rect x={0} y={1100} width={1080} height={10} fill="#F2C94C" />
      </svg>
    </AbsoluteFill>
  );
};

// Meja atau konter di depan tokoh, dengan laptop di tengah.
export const Konter: React.FC<{tempat: 'kapal' | 'gudang' | 'kantor'}> = ({tempat}) => {
  const top = {kapal: '#B07A45', gudang: '#8E99A8', kantor: '#D9B88F'}[tempat];
  const front = {kapal: '#1F3B7A', gudang: '#5B6B86', kantor: '#8A6A45'}[tempat];
  return (
    <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: 'absolute', left: 0, top: 1500, overflow: 'visible'}}>
      <path d="M 380 40 L 700 40 L 680 -150 L 400 -150 Z" fill="#AEB8C6" />
      <path d="M 410 -140 L 670 -140 L 688 30 L 392 30 Z" fill="#C9D2DE" />
      <circle cx={540} cy={-60} r={22} fill="white" opacity={0.85} />
      <rect x={0} y={40} width={1080} height={40} fill={top} />
      <rect x={0} y={80} width={1080} height={340} fill={front} />
      <rect x={0} y={80} width={1080} height={10} fill="black" opacity={0.15} />
    </svg>
  );
};

// Kantor pusat: jendela dengan pemandangan pelabuhan, papan tulis alur, jam dinding, tanaman.
export const LatarKantor: React.FC<{t: number; papan?: string}> = ({t, papan = 'KANTOR PUSAT'}) => {
  const jam = (t / 30) * 6;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9CC9F5" />
            <stop offset="1" stopColor="#DCEEFF" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="#F4F1EC" />
        <rect y={0} width={1080} height={80} fill="#E4DED4" />
        {/* jendela */}
        <rect x={60} y={300} width={560} height={620} rx={12} fill="#7C8796" />
        <rect x={78} y={318} width={524} height={584} fill="url(#langit)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={95 + i * 85} y={640 - (i % 3) * 70} width={70} height={262 + (i % 3) * 70} fill="#7F93AE" opacity={0.75} />
        ))}
        <rect x={78} y={820} width={524} height={82} fill="#2E6FB5" />
        <g transform={`translate(${((t * 1.2) % 700) - 120} 0)`}>
          <path d="M 0 812 L 150 812 L 135 836 L 15 836 Z" fill="#1F3B7A" />
          <rect x={40} y={790} width={70} height={22} fill="white" />
        </g>
        <rect x={337} y={318} width={6} height={584} fill="#7C8796" />
        <rect x={78} y={608} width={524} height={6} fill="#7C8796" />
        {/* papan tulis alur */}
        <rect x={660} y={300} width={370} height={430} rx={14} fill="white" stroke="#C9C2B6" strokeWidth={6} />
        {['Pesan', 'SO', 'PUR', 'PO', 'DO'].map((w, i) => (
          <g key={w}>
            <rect x={690} y={330 + i * 78} width={150} height={52} rx={10} fill={['#0F766E', '#6D28D9', '#BE185D', '#CA8A04', '#15803D'][i]} />
            <text x={765} y={364 + i * 78} textAnchor="middle" fontSize={26} fontWeight={800} fill="white" fontFamily="Plus Jakarta Sans">
              {w}
            </text>
            <path d={`M 860 356 L ${900 + i * 18} 356`} stroke="#9AA6BD" strokeWidth={6} strokeLinecap="round" />
            <circle cx={950 + (i % 2) * 30} cy={356 + i * 78} r={14} fill="#22C55E" />
          </g>
        ))}
        {/* jam dinding */}
        <circle cx={845} cy={180} r={62} fill="white" stroke="#3E4A5E" strokeWidth={8} />
        <line x1={845} y1={180} x2={845 + Math.sin((jam * Math.PI) / 180) * 42} y2={180 - Math.cos((jam * Math.PI) / 180) * 42} stroke="#C0392B" strokeWidth={4} strokeLinecap="round" />
        <line x1={845} y1={180} x2={870} y2={160} stroke="#1B2437" strokeWidth={8} strokeLinecap="round" />
        <rect x={160} y={150} width={400} height={80} rx={14} fill="#1F3B7A" />
        <text x={360} y={204} textAnchor="middle" fontSize={40} fontWeight={800} fill="white" fontFamily="Plus Jakarta Sans">
          {papan}
        </text>
        {/* tanaman */}
        <path d="M 1000 1080 Q 960 940 1010 860 Q 1040 950 1030 1080 Z" fill="#2F855A" />
        <path d="M 990 1080 Q 930 980 950 900 Q 1000 980 1010 1080 Z" fill="#38A169" />
        <rect x={960} y={1060} width={90} height={60} rx={10} fill="#C05621" />
        <rect x={0} y={1100} width={1080} height={820} fill="#D8D0C2" />
      </svg>
    </AbsoluteFill>
  );
};
