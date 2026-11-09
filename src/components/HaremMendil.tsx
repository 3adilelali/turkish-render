import React from "react";
import { H, lerp } from "./Harem";

// Kanal 1 · "Mendil" kiti (s3-05'ten): ipek mendil (düşüş/yerde), padişah eli, arşiv defteri,
// Avrupa gravür kitabı, harem kapısı + altın anahtar, film şeridi çerçevesi. HaremPro ile aynı görünüm.

const cl = (v: number) => Math.max(0, Math.min(1, v));
const LN = H.ln;

// ipek mendil: k=0 havada (x0,y0), k=1 yerde (x1,y1). Düşerken sallanır ve kıvrılır, yerde düz yatar.
export const IpekMendil: React.FC<{ t: number; k?: number; x0?: number; y0?: number; x1?: number; y1?: number; s?: number; c?: string }> = ({ t, k = 1, x0 = 960, y0 = 200, x1 = 960, y1 = 960, s = 1, c = "#F4ECDD" }) => {
  const kk = cl(k);
  const air = 1 - kk;
  const x = lerp(x0, x1, kk) + Math.sin(kk * Math.PI * 3) * 120 * air;
  const y = lerp(y0, y1, kk * kk * (3 - 2 * kk));
  const rot = Math.sin(t * 3.2) * 28 * air + (1 - air) * 0;
  const flat = lerp(1, 0.38, cl((kk - 0.85) / 0.15)); // yere değince yassılaşır
  const wv = Math.sin(t * 6) * 18 * air;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s},${s * flat})`}>
      <ellipse cy={110} rx={150} ry={22} fill="#000" opacity={0.18 * cl((kk - 0.7) / 0.3)} />
      <path d={`M-120,-110 Q${-40 + wv},${-140 - wv} 120,-110 Q${150 + wv},0 120,110 Q0,${130 + wv} -120,110 Q${-150 - wv},0 -120,-110Z`} fill={c} stroke={LN} strokeWidth={5} />
      <path d={`M-120,-110 Q${-40 + wv},${-140 - wv} 120,-110 Q${150 + wv},0 120,110 Q0,${130 + wv} -120,110 Q${-150 - wv},0 -120,-110Z`} fill="url(#hDamask)" opacity={0.25} />
      {/* altın sırma kenar + köşe lale nakışı */}
      <path d={`M-100,-92 Q${-30 + wv},${-118 - wv} 100,-92 Q${126 + wv},0 100,92 Q0,${110 + wv} -100,92 Q${-126 - wv},0 -100,-92Z`} fill="none" stroke={H.gold} strokeWidth={6} strokeDasharray="14 8" />
      {[[-92, -86], [92, -86], [92, 86], [-92, 86]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${i * 90 + 45})`}>
          <path d="M0,8 q-12,-14 -6,-30 q6,10 6,14 q0,-4 6,-14 q6,16 -6,30Z" fill={H.red} stroke={LN} strokeWidth={2} />
          <path d="M0,8 v18" stroke={H.green} strokeWidth={3} />
          <circle cy={30} r={7} fill={H.gold} stroke={LN} strokeWidth={2} />
        </g>
      ))}
      <g transform="scale(0.9)"><path d="M0,-34 q-24,-6 -26,22 q12,-8 26,8 q14,-16 26,-8 q-2,-28 -26,-22Z" fill={H.red} opacity={0.85} stroke={LN} strokeWidth={2.5} /><path d="M0,-6 v40" stroke={H.green} strokeWidth={4} /><path d="M0,20 q-18,-4 -24,-18 M0,26 q18,-4 24,-18" stroke={H.green} strokeWidth={3} fill="none" /></g>
    </g>
  );
};

// padişah eli (yakın plan): sırmalı kaftan yeni, yüzük. open=0 tutuyor, 1 bıraktı.
export const PadisahEli: React.FC<{ t: number; open?: number; x?: number; y?: number; s?: number }> = ({ t, open = 0, x = 960, y = 360, s = 1 }) => {
  const o = cl(open);
  const sw = Math.sin(t * 1.4) * 4;
  return (
    <g transform={`translate(${x},${y + sw}) scale(${s})`}>
      {/* yen */}
      <path d="M-520,-120 L-120,-150 Q-60,-60 -110,30 L-520,60Z" fill="#7A1E2A" stroke={LN} strokeWidth={6} />
      <path d="M-520,-120 L-120,-150 Q-60,-60 -110,30 L-520,60Z" fill="url(#hDamask)" opacity={0.4} />
      <path d="M-150,-148 Q-88,-60 -138,32" stroke={H.gold} strokeWidth={22} fill="none" />
      <path d="M-150,-148 Q-88,-60 -138,32" stroke="#FFE7A0" strokeWidth={5} fill="none" strokeDasharray="10 10" />
      {/* el */}
      <g transform={`rotate(${o * 18})`}>
        <path d="M-110,-110 Q-20,-140 40,-96 Q90,-70 70,-36 Q30,-50 10,-40 Q60,-10 40,30 Q0,50 -60,40 Q-110,20 -110,-110Z" fill="#F3D9C0" stroke={LN} strokeWidth={5} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${20 - i * 22},${-60 + i * 4} q${50 + o * 40},${10 + i * 8 - o * 30} ${70 + o * 60},${50 + i * 10 - o * 50}`} stroke={LN} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
        ))}
        <rect x={-44} y={-52} width={30} height={16} rx={6} fill={H.gold} stroke={LN} strokeWidth={3} />
        <circle cx={-29} cy={-44} r={7} fill="#2E8B57" stroke={LN} strokeWidth={2} />
      </g>
    </g>
  );
};

// Osmanlı arşiv defteri (açık), büyüteç tarar. scan 0..1, empty: aranan satır boş/çizik.
export const ArsivDefter: React.FC<{ t: number; scan?: number; x?: number; y?: number; s?: number }> = ({ t, scan = 0, x = 960, y = 560, s = 1 }) => {
  const mx = lerp(-260, 260, (Math.sin(scan * Math.PI * 2 - Math.PI / 2) + 1) / 2);
  const my = lerp(-220, 220, cl(scan));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cy={330} rx={560} ry={40} fill="#000" opacity={0.25} />
      <path d="M-520,-320 Q-260,-360 0,-320 Q260,-360 520,-320 L520,320 Q260,290 0,320 Q-260,290 -520,320Z" fill="#6A3A22" stroke={LN} strokeWidth={6} />
      <path d="M-500,-305 Q-250,-340 0,-305 L0,305 Q-250,280 -500,305Z" fill="#F1E1BC" stroke={LN} strokeWidth={4} />
      <path d="M500,-305 Q250,-340 0,-305 L0,305 Q250,280 500,305Z" fill="#EEDCB4" stroke={LN} strokeWidth={4} />
      <path d="M0,-310 V310" stroke="#8A6A44" strokeWidth={6} opacity={0.6} />
      {/* siyakat satırları (sağdan sola eğik) */}
      {[-1, 1].map((side) => Array.from({ length: 9 }, (_, i) => (
        <path key={`${side}${i}`} d={`M${side * 460},${-240 + i * 56} q${-side * 40},-12 ${-side * 90},0 t${-side * 90},0 t${-side * 90},2 t${-side * 90},-2`} stroke="#3A2A1A" strokeWidth={4} fill="none" opacity={0.72} />
      )))}
      {/* tuğra köşede + mühür */}
      <path d="M-420,-268 q30,-50 60,0 q20,-64 46,0 q20,-40 50,6 M-440,-246 q110,26 210,-8" stroke={H.gold} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={380} cy={240} r={34} fill="none" stroke={H.red} strokeWidth={5} opacity={0.75} />
      <circle cx={380} cy={240} r={22} fill={H.red} opacity={0.35} />
      {/* büyüteç */}
      <g transform={`translate(${mx},${my}) rotate(-25)`}>
        <circle r={110} fill="#FFFFFF" opacity={0.16} stroke="#B8902E" strokeWidth={16} />
        <circle r={110} fill="none" stroke="#F2D27A" strokeWidth={4} />
        <rect x={-14} y={120} width={28} height={190} rx={12} fill="#5A3A1E" stroke={LN} strokeWidth={4} />
        <path d="M-60,-60 q30,-30 70,-30" stroke="#fff" strokeWidth={8} opacity={0.6} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// Avrupa gravür kitabı: deri kapak, açık sayfada sarıklı padişah + mendil gravürü, Latin harfli başlık. mum + tüy kalem.
export const AvrupaKitap: React.FC<{ t: number; x?: number; y?: number; s?: number; k?: number }> = ({ t, x = 960, y = 560, s = 1, k = 1 }) => {
  const fl = Math.sin(t * 11) * 0.08 + Math.sin(t * 6.7) * 0.05;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cy={300} rx={540} ry={40} fill="#000" opacity={0.3} />
      <path d="M-500,-300 L0,-280 L500,-300 L500,290 L0,310 L-500,290Z" fill="#4A2A1A" stroke={LN} strokeWidth={6} />
      <path d="M-480,-285 L0,-265 L0,295 L-480,275Z" fill="#E9DDBF" stroke={LN} strokeWidth={4} />
      <path d="M480,-285 L0,-265 L0,295 L480,275Z" fill="#E5D7B5" stroke={LN} strokeWidth={4} />
      {/* sol sayfa: başlık + satırlar */}
      <g opacity={k}>
        <text x={-240} y={-190} textAnchor="middle" fontFamily="Georgia, serif" fontSize={44} fontStyle="italic" fill="#3A2210">Voyage</text>
        <text x={-240} y={-140} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fill="#3A2210">au Serrail du</text>
        <text x={-240} y={-98} textAnchor="middle" fontFamily="Georgia, serif" fontSize={40} fontWeight={700} fill="#3A2210">GRAND SEIGNEUR</text>
        <path d="M-380,-70 H-100" stroke="#3A2210" strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-420,${-20 + i * 36} H${-80 - (i % 3) * 30}`} stroke="#5A4630" strokeWidth={4} opacity={0.55} />)}
      </g>
      {/* sağ sayfa: gravür (çizgi tarama) */}
      <g transform="translate(240,0)" opacity={k}>
        <rect x={-190} y={-230} width={380} height={460} fill="#EFE5C9" stroke="#3A2210" strokeWidth={5} />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M-190,${-230 + i * 21} L190,${-250 + i * 21}`} stroke="#3A2210" strokeWidth={1.2} opacity={0.18} />)}
        {/* sarıklı figür */}
        <ellipse cx={-60} cy={-120} rx={56} ry={44} fill="#F6EFDD" stroke="#3A2210" strokeWidth={4} />
        <circle cx={-60} cy={-66} r={30} fill="#F6EFDD" stroke="#3A2210" strokeWidth={4} />
        <path d="M-60,-36 L-120,170 H0 Z" fill="#D9C9A0" stroke="#3A2210" strokeWidth={4} />
        <path d="M-60,-30 L-60,170" stroke="#3A2210" strokeWidth={2} opacity={0.6} />
        <path d="M-20,20 L60,60" stroke="#3A2210" strokeWidth={6} strokeLinecap="round" />
        {/* düşen mendil (gravürde) */}
        <path d={`M70,${80 + Math.sin(t * 2) * 6} q20,-14 40,0 q-4,24 -20,30 q-16,-6 -20,-30Z`} fill="#fff" stroke="#3A2210" strokeWidth={3} />
        {/* diz çökmüş kadınlar */}
        {[40, 110].map((cx, i) => <g key={i}><circle cx={cx} cy={150 - i * 6} r={18} fill="#F6EFDD" stroke="#3A2210" strokeWidth={3} /><path d={`M${cx - 26},${210} q26,-60 52,0Z`} fill="#D9C9A0" stroke="#3A2210" strokeWidth={3} /></g>)}
        <text y={210} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fontStyle="italic" fill="#3A2210" dy={0} opacity={0.8} transform="translate(0,6)">Le Mouchoir</text>
      </g>
      {/* tüy kalem + mum */}
      <g transform="translate(470,-250) rotate(28)"><path d="M0,0 q40,-160 10,-300 q-50,120 -10,300Z" fill="#F4F0E6" stroke={LN} strokeWidth={3} /><path d="M0,0 V40" stroke={LN} strokeWidth={4} /></g>
      <g transform="translate(-560,-40)">
        <rect x={-26} y={-120} width={52} height={200} fill="#F2E8D0" stroke={LN} strokeWidth={4} />
        <ellipse cy={-150} rx={18} ry={38 * (1 + fl)} fill="#FFC24A" />
        <ellipse cy={-142} rx={8} ry={18} fill="#FFF3C0" />
        <circle cy={-140} r={160} fill="#FFC870" opacity={0.18} />
        <rect x={-60} y={80} width={120} height={20} rx={8} fill="#B8902E" stroke={LN} strokeWidth={3} />
      </g>
    </g>
  );
};

// harem kapısı (Altın Yol başı): çini çerçeveli kemer, iki kanat. open 0..1. turn: anahtar dönüşü 0..1
export const HaremKapi: React.FC<{ t: number; open?: number; turn?: number; lock?: boolean }> = ({ t, open = 0, turn = 0, lock: showKey = true }) => {
  const o = cl(open);
  return (
    <g>
      <rect width={1920} height={1080} fill={H.plaster} />
      <rect width={1920} height={1080} fill="url(#hTile)" opacity={0.35} />
      <rect y={880} width={1920} height={200} fill="#B8A07A" />
      <rect y={872} width={1920} height={10} fill={H.cobalt} />
      {/* çini çerçeve */}
      <path d="M560,880 V320 Q960,40 1360,320 V880" fill={H.cobalt} stroke={LN} strokeWidth={8} />
      <path d="M600,880 V340 Q960,90 1320,340 V880" fill="url(#hTile)" stroke={H.gold} strokeWidth={6} />
      <path d="M640,880 V360 Q960,140 1280,360 V880Z" fill="#1A1008" />
      {/* içeride ışık */}
      <path d="M640,880 V360 Q960,140 1280,360 V880Z" fill="#FFD27A" opacity={0.75 * o} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${700 + i * 120},880 L${880 + i * 40},360`} stroke="#FFF2C8" strokeWidth={30} opacity={0.12 * o} />)}
      {/* kanatlar */}
      {[-1, 1].map((sd) => {
        const sc = 1 - 0.85 * o;
        const hx = sd < 0 ? 640 : 1280;
        return (
          <g key={sd} transform={`translate(${hx},0) scale(${sc},1) translate(${-hx},0)`}>
            <path d={sd < 0 ? "M640,880 V360 Q800,210 960,170 V880Z" : "M1280,880 V360 Q1120,210 960,170 V880Z"} fill="#6A3A1E" stroke={LN} strokeWidth={6} />
            {Array.from({ length: 4 }, (_, r) => <rect key={r} x={sd < 0 ? 680 : 990} y={420 + r * 110} width={250} height={86} rx={8} fill="none" stroke="#B8802E" strokeWidth={6} />)}
            {Array.from({ length: 4 }, (_, r) => <circle key={r} cx={sd < 0 ? 805 : 1115} cy={463 + r * 110} r={12} fill={H.gold} stroke={LN} strokeWidth={2} />)}
          </g>
        );
      })}
      {/* kilit + altın anahtar */}
      {showKey && o < 0.3 && (
        <g transform="translate(960,600)" opacity={1 - o * 3}>
          <rect x={-46} y={-70} width={92} height={140} rx={14} fill={H.gold} stroke={LN} strokeWidth={5} />
          <circle cy={-16} r={14} fill="#2A1A0E" /><path d="M-6,-10 h12 l6,40 h-24Z" fill="#2A1A0E" />
          <g transform={`translate(0,-10) rotate(${turn * 90})`}>
            <rect x={-6} y={-6} width={140} height={12} rx={5} fill="#F2D27A" stroke={LN} strokeWidth={3} />
            <circle cx={160} r={34} fill="none" stroke="#F2D27A" strokeWidth={14} />
            <circle cx={160} r={34} fill="none" stroke={LN} strokeWidth={3} />
          </g>
        </g>
      )}
      {/* yanlarda kandil */}
      {[440, 1480].map((lx) => <g key={lx} transform={`translate(${lx},300)`}><path d="M0,-300 V-40" stroke="#6A4A2A" strokeWidth={4} /><path d="M-36,-40 h72 l-14,90 h-44Z" fill="#C8A048" stroke={LN} strokeWidth={4} /><circle cy={20} r={110 + Math.sin(t * 9 + lx) * 6} fill="#FFC870" opacity={0.2} /><ellipse cy={10} rx={10} ry={20} fill="#FFE27A" /></g>)}
    </g>
  );
};

// küçük altın anahtar (ele tutturmak için, PFig item)
export const AltinAnahtar: React.FC<{ s?: number; glow?: number; t?: number }> = ({ s = 1, glow = 0, t = 0 }) => (
  <g transform={`scale(${s}) rotate(-30)`}>
    {glow > 0 && <circle r={70} fill="#FFD36A" opacity={0.3 * glow * (0.8 + 0.2 * Math.sin(t * 5))} />}
    <circle cx={-46} r={20} fill="none" stroke="#E8C04A" strokeWidth={9} />
    <circle cx={-46} r={20} fill="none" stroke={LN} strokeWidth={2} />
    <rect x={-26} y={-5} width={80} height={10} rx={4} fill="#E8C04A" stroke={LN} strokeWidth={2} />
    <path d="M40,5 v16 h8 v-8 h8 v12 h6 V5Z" fill="#E8C04A" stroke={LN} strokeWidth={2} />
  </g>
);

// film şeridi çerçevesi (sepya, delikler kayar): içindeki sahneyi "filmlerde" gibi gösterir
export const FilmSerit: React.FC<{ t: number; children: React.ReactNode; k?: number }> = ({ t, children, k = 1 }) => {
  const off = (t * 220) % 120;
  return (
    <g>
      <rect width={1920} height={1080} fill="#120C08" />
      <g transform="translate(960,540) scale(0.86) translate(-960,-540)">
        <g filter="url(#fSepia)">{children}</g>
        <rect width={1920} height={1080} fill="#3A2410" opacity={0.18 * k} />
      </g>
      <defs>
        <filter id="fSepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter>
      </defs>
      {[640, 1230].map((sx) => (
        <g key={sx}>
          <rect x={sx} y={0} width={50} height={1080} fill="#0A0604" />
          {Array.from({ length: 11 }, (_, i) => <rect key={i} x={sx + 13} y={i * 120 - off} width={24} height={60} rx={6} fill="#EDE2C8" opacity={0.85} />)}
        </g>
      ))}
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${700 + ((i * 197 + Math.floor(t * 12) * 53) % 520)},0 v1080`} stroke="#FFF" strokeWidth={1.5} opacity={0.12} />)}
    </g>
  );
};
