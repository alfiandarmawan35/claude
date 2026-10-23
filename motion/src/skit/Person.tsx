import React from 'react';
import {Pose} from './data';

// Tokoh datar setengah badan (viewBox 400 x 560). Mulut mengikuti keras-lemah suara (amp 0..1).
export const Person: React.FC<{
  gender: 'm' | 'f';
  baju: string;
  aksen: string;
  name: string;
  pose: Pose;
  amp: number;
  blink: boolean;
  t: number; // frame, untuk gerak kecil
  side: 'l' | 'r'; // arah menunjuk: tokoh kiri menunjuk ke kanan atas, tokoh kanan ke kiri atas
}> = ({gender, baju, aksen, name, pose, amp, blink, t, side}) => {
  const skin = gender === 'f' ? '#F2C7A5' : '#E3AE86';
  const skinDark = gender === 'f' ? '#E3B08C' : '#C98F66';
  const hijab = `#${aksen}`;
  const talking = amp > 0.05;
  const eyeRy = blink ? 1.5 : pose === 'senang' ? 7 : 11;
  const dir = side === 'l' ? 1 : -1;

  // lengan menunjuk ke arah layar di atas
  const wave = Math.sin(t / 6) * 4;
  const arm = (() => {
    if (pose === 'tunjuk') {
      const sx = 200 + dir * 120;
      const ex = 200 + dir * 205;
      const ey = 120 + wave;
      return (
        <g>
          <path d={`M ${sx} 360 Q ${sx + dir * 60} 250 ${ex} ${ey}`} stroke={`#${baju}`} strokeWidth={50} fill="none" strokeLinecap="round" />
          <circle cx={ex} cy={ey} r={27} fill={skin} />
          <rect x={ex - 6 + dir * 4} y={ey - 58} width={14} height={42} rx={7} fill={skin} transform={`rotate(${dir * 20} ${ex} ${ey})`} />
        </g>
      );
    }
    if (pose === 'bingung') {
      // tangan menggaruk kepala
      const hx = 200 + dir * 95;
      return (
        <g>
          <path d={`M ${200 + dir * 125} 380 Q ${200 + dir * 175} 260 ${hx} ${110 + wave}`} stroke={`#${baju}`} strokeWidth={48} fill="none" strokeLinecap="round" />
          <circle cx={hx} cy={110 + wave} r={26} fill={skin} />
        </g>
      );
    }
    if (pose === 'kamera' || pose === 'senang') {
      const up = pose === 'kamera' ? Math.sin(t / 9) * 10 : 0;
      return (
        <g>
          {[-1, 1].map((d) => (
            <g key={d}>
              <path d={`M ${200 + d * 125} 400 Q ${200 + d * 150} 470 ${200 + d * 95} ${430 + up}`} stroke={`#${baju}`} strokeWidth={46} fill="none" strokeLinecap="round" />
              <ellipse cx={200 + d * 88} cy={418 + up} rx={30} ry={22} fill={skin} />
            </g>
          ))}
        </g>
      );
    }
    return null;
  })();

  return (
    <svg viewBox="0 0 400 560" width="100%" height="100%" style={{overflow: 'visible'}}>
      {/* badan */}
      <path d="M 50 560 L 50 410 Q 50 330 140 312 L 260 312 Q 350 330 350 410 L 350 560 Z" fill={`#${baju}`} />
      {gender === 'm' ? (
        <>
          <path d="M 160 312 L 200 360 L 240 312 Z" fill="white" />
          <path d="M 150 308 L 200 352 L 178 372 Z M 250 308 L 200 352 L 222 372 Z" fill={`#${aksen}`} />
        </>
      ) : null}
      {/* kerudung menjuntai di dada */}
      {gender === 'f' ? <path d="M 105 280 Q 200 330 295 280 L 330 420 Q 200 470 70 420 Z" fill={hijab} opacity={1} /> : null}
      {/* papan nama */}
      <rect x={212} y={455} width={126} height={32} rx={6} fill="white" opacity={0.95} />
      <text x={275} y={478} textAnchor="middle" fontSize={17} fontWeight={800} fill="#1F3B7A" fontFamily="Plus Jakarta Sans">
        {name}
      </text>
      {/* leher */}
      <rect x={172} y={262} width={56} height={62} rx={18} fill={skinDark} />
      {/* kepala */}
      {gender === 'f' ? (
        <>
          <path d="M 92 205 Q 92 62 200 60 Q 308 62 308 205 Q 312 300 250 330 L 150 330 Q 88 300 92 205 Z" fill={hijab} />
          <ellipse cx={200} cy={200} rx={76} ry={90} fill={skin} />
          <path d="M 124 170 Q 130 108 200 104 Q 270 108 276 170 Q 250 130 200 128 Q 150 130 124 170 Z" fill={hijab} />
        </>
      ) : (
        <>
          <ellipse cx={200} cy={190} rx={92} ry={104} fill={skin} />
          <ellipse cx={108} cy={198} rx={14} ry={22} fill={skinDark} />
          <ellipse cx={292} cy={198} rx={14} ry={22} fill={skinDark} />
          <path d="M 106 175 Q 104 74 200 72 Q 298 74 294 175 Q 285 118 238 116 Q 196 108 160 122 Q 118 132 106 175 Z" fill="#2B2B33" />
        </>
      )}
      {/* alis */}
      {pose === 'bingung' ? (
        <>
          <path d="M 148 150 L 182 140" stroke="#3A2A24" strokeWidth={7} strokeLinecap="round" />
          <path d="M 218 146 L 252 156" stroke="#3A2A24" strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 148 154 Q 165 146 182 152" stroke="#3A2A24" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 218 152 Q 235 146 252 154" stroke="#3A2A24" strokeWidth={7} fill="none" strokeLinecap="round" />
        </>
      )}
      {/* mata */}
      <ellipse cx={166} cy={190} rx={10} ry={eyeRy} fill="#2A1E1A" />
      <ellipse cx={234} cy={190} rx={10} ry={eyeRy} fill="#2A1E1A" />
      {!blink ? (
        <>
          <circle cx={169} cy={186} r={3} fill="white" />
          <circle cx={237} cy={186} r={3} fill="white" />
        </>
      ) : null}
      {/* pipi */}
      <ellipse cx={142} cy={228} rx={16} ry={9} fill="#F08A7E" opacity={0.35} />
      <ellipse cx={258} cy={228} rx={16} ry={9} fill="#F08A7E" opacity={0.35} />
      {/* mulut */}
      {talking ? (
        <ellipse cx={200} cy={250} rx={17 + amp * 5} ry={3 + amp * 15} fill="#7A2E2E" />
      ) : pose === 'bingung' ? (
        <path d="M 182 254 Q 200 244 218 256" stroke="#7A2E2E" strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : (
        <path d={pose === 'senang' ? 'M 174 244 Q 200 274 226 244 Z' : 'M 180 248 Q 200 262 220 248'} stroke="#7A2E2E" strokeWidth={6} fill={pose === 'senang' ? '#7A2E2E' : 'none'} strokeLinecap="round" />
      )}
      {arm}
    </svg>
  );
};
