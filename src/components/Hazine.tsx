import React from "react";
import { H, HTiny, lerp } from "./Harem";

// Kanal 3 · hazine / gece / saray dışı detay kiti (k3r-06 Hazinedar ile başladı, sonraki videolar da kullanır).
// Büyük ve detaylı objeler: yakın plan çekimlerde bile zengin görünsün diye çok katmanlı.

const md = (v: number, m: number) => ((v % m) + m) % m;

// ── büyük mangal: kor, kıvılcım, duman, parlama
export const BigMangal: React.FC<{ x: number; y: number; s?: number; t?: number; heat?: number }> = ({ x, y, s = 1, t = 0, heat = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cy={-70} r={260 + Math.sin(t * 5) * 14} fill="#F2B640" opacity={0.18 * heat} />
    <circle cy={-70} r={150} fill="#FF8A3A" opacity={0.14 * heat} />
    {[-70, 70].map((lx) => <path key={lx} d={`M${lx},0 Q${lx * 1.2},40 ${lx * 1.4},70`} stroke={H.ln} strokeWidth={9} fill="none" strokeLinecap="round" />)}
    <ellipse cy={4} rx={70} ry={12} fill="#6A4020" />
    <path d="M-130,-60 Q-120,0 0,8 Q120,0 130,-60Z" fill="#B87333" stroke={H.ln} strokeWidth={5} />
    <path d="M-120,-40 Q0,-22 120,-40" stroke="#E0A060" strokeWidth={5} fill="none" />
    {[-90, -45, 0, 45, 90].map((dx) => <circle key={dx} cx={dx} cy={-28} r={7} fill={H.gold} stroke={H.ln} strokeWidth={1.5} />)}
    <ellipse cy={-60} rx={132} ry={26} fill="#3A2418" stroke={H.ln} strokeWidth={5} />
    {Array.from({ length: 11 }, (_, i) => {
      const cx = -100 + i * 20, cy = -64 + Math.sin(i * 1.7) * 6;
      return <circle key={i} cx={cx} cy={cy} r={13 + (i % 3) * 3} fill={i % 3 === 0 ? "#FFD25A" : i % 2 ? "#E2541E" : "#F28A2E"} opacity={(0.65 + 0.35 * Math.sin(t * 6 + i)) * heat} />;
    })}
    {Array.from({ length: 10 }, (_, i) => {
      const life = md(t * 0.9 + i * 0.37, 1);
      return <circle key={i} cx={-60 + ((i * 47) % 120) + Math.sin(t * 3 + i) * 20} cy={-80 - life * 260} r={4 * (1 - life)} fill="#FFC24A" opacity={(1 - life) * heat} />;
    })}
    {[0, 1, 2].map((i) => <path key={i} d={`M${-40 + i * 40},-90 q${16 + Math.sin(t * 2 + i) * 12},-50 0,-100 q-16,-50 0,-100`} stroke="#DDD" strokeWidth={7} fill="none" opacity={0.25} />)}
    <path d="M-150,-66 Q-180,-80 -176,-104 M150,-66 Q180,-80 176,-104" stroke={H.ln} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

// ── kül bulutu (savrulma): k 0→1
export const KulBulut: React.FC<{ x: number; y: number; k: number; t: number; dir?: number }> = ({ x, y, k, t, dir = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={k > 0 ? Math.min(1, k * 3) * (1 - Math.max(0, k - 0.7) / 0.3) : 0}>
    {Array.from({ length: 60 }, (_, i) => {
      const a = (i / 60) * 1.2 - 0.6, d = k * (300 + (i * 53) % 500);
      const px = Math.cos(a) * d * dir, py = Math.sin(a) * d * 0.6 - k * 40 + Math.sin(t * 4 + i) * 6;
      const hot = i % 4 === 0;
      return <circle key={i} cx={px} cy={py} r={(hot ? 6 : 14 + (i % 5) * 6) * (0.6 + k)} fill={hot ? "#FFB43A" : "#8A8078"} opacity={hot ? 0.95 : 0.45} />;
    })}
  </g>
);

// ── anahtar destesi (sallanır)
export const Anahtarlar: React.FC<{ x: number; y: number; s?: number; t?: number; n?: number; glow?: number }> = ({ x, y, s = 1, t = 0, n = 6, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 && <circle cy={120} r={220} fill="#FFD36A" opacity={0.25 * glow} />}
    <circle r={46} fill="none" stroke="#B8902E" strokeWidth={12} />
    <circle r={46} fill="none" stroke="#F2D27A" strokeWidth={4} />
    {Array.from({ length: n }, (_, i) => {
      const an = -50 + i * (100 / Math.max(1, n - 1)) + Math.sin(t * 2.2 + i) * 5;
      const L = 170 + (i % 3) * 30;
      return (
        <g key={i} transform={`rotate(${an}) translate(0,40)`}>
          <circle cy={18} r={22} fill="none" stroke={i % 2 ? "#C9A040" : "#9A8A70"} strokeWidth={9} />
          <rect x={-6} y={38} width={12} height={L} rx={5} fill={i % 2 ? "#C9A040" : "#9A8A70"} stroke={H.ln} strokeWidth={2} />
          <path d={`M6,${L + 10} h26 v14 h-12 v12 h-14Z M6,${L - 24} h18 v12 h-18Z`} fill={i % 2 ? "#C9A040" : "#9A8A70"} stroke={H.ln} strokeWidth={2} />
        </g>
      );
    })}
  </g>
);

// ── hesap defteri (açık), satırlar ve mürekkep
export const HDefter: React.FC<{ x: number; y: number; s?: number; k?: number; lines?: string[]; t?: number }> = ({ x, y, s = 1, k = 1, lines = [], t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-420,-260 Q-210,-300 0,-250 Q210,-300 420,-260 L420,260 Q210,220 0,270 Q-210,220 -420,260Z" fill="#6A2A22" stroke={H.ln} strokeWidth={5} />
    <path d="M-400,-240 Q-200,-276 -6,-232 L-6,250 Q-200,206 -400,240Z" fill="#F4E9CC" stroke={H.ln} strokeWidth={3} />
    <path d="M400,-240 Q200,-276 6,-232 L6,250 Q200,206 400,240Z" fill="#F7EED6" stroke={H.ln} strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-370,${-180 + i * 48} Q-200,${-204 + i * 48} -40,${-176 + i * 48}`} stroke="#C9B78E" strokeWidth={2} fill="none" />)}
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M40,${-176 + i * 48} Q200,${-204 + i * 48} 370,${-180 + i * 48}`} stroke="#C9B78E" strokeWidth={2} fill="none" />)}
    {lines.map((l, i) => (
      <text key={i} x={-200} y={-150 + i * 72} textAnchor="middle" fontFamily="Patrick Hand" fontSize={44} fill="#2A2018" opacity={Math.max(0, Math.min(1, k * lines.length - i))}>{l}</text>
    ))}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M80,${-150 + i * 70} q${30 + (i * 13) % 40},-14 ${60 + (i * 29) % 80},0 t${80 + (i * 7) % 60},0`} stroke="#3A2A20" strokeWidth={4} fill="none" opacity={Math.max(0, Math.min(1, k * 6 - i)) * 0.85} />)}
    <path d="M300,140 l20,20 l-60,40 l-6,-14Z" fill="#B3262E" opacity={0.85} />
    <g transform={`translate(${330 + Math.sin(t * 6) * 6},${-60 + Math.cos(t * 6) * 4}) rotate(30)`}><path d="M0,0 L-14,-220 Q10,-250 18,-210Z" fill="#F7F3EA" stroke={H.ln} strokeWidth={2} /><path d="M0,0 l-4,40" stroke="#2A2018" strokeWidth={4} /></g>
  </g>
);

export const Hokka: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-50,0 Q-60,-60 -30,-80 L30,-80 Q60,-60 50,0Z" fill="#2B5DA8" stroke={H.ln} strokeWidth={4} />
    <path d="M-40,-40 Q0,-30 40,-40" stroke={H.gold} strokeWidth={5} fill="none" />
    <rect x={-22} y={-100} width={44} height={22} rx={6} fill={H.gold} stroke={H.ln} strokeWidth={3} />
    <path d="M6,-96 L60,-260" stroke="#E9DDC2" strokeWidth={8} strokeLinecap="round" />
  </g>
);

// ── mühür (kırmızı balmumu) – bas: k 0→1
export const Muhur: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g transform={`translate(0,${-200 * (1 - Math.min(1, k * 1.4))})`} opacity={k < 0.75 ? 1 : 1 - (k - 0.75) * 4}>
      <rect x={-30} y={-210} width={60} height={150} rx={20} fill="#5E3B20" stroke={H.ln} strokeWidth={4} />
      <ellipse cy={-50} rx={60} ry={18} fill={H.gold} stroke={H.ln} strokeWidth={4} />
    </g>
    <g opacity={k > 0.7 ? 1 : 0}>
      <path d="M-74,0 q-10,-30 10,-50 q20,-30 64,-26 q50,-4 70,30 q20,30 0,56 q-30,30 -80,22 q-50,0 -64,-32Z" fill="#B3262E" stroke="#7A1418" strokeWidth={4} />
      <circle r={40} fill="none" stroke="#7A1418" strokeWidth={4} />
      <path d="M-20,-10 q20,-30 40,0 q-20,30 -40,0Z M0,-30 v60" stroke="#7A1418" strokeWidth={4} fill="none" />
    </g>
  </g>
);

// ── mücevher kutusu (açılır, ışıldar)
export const Mucevher: React.FC<{ x: number; y: number; s?: number; t?: number; open?: number }> = ({ x, y, s = 1, t = 0, open = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cy={-120} r={240} fill="#FFE7A0" opacity={0.22 * open} />
    <rect x={-200} y={-120} width={400} height={130} rx={14} fill="#7A2A3A" stroke={H.ln} strokeWidth={5} />
    <rect x={-200} y={-120} width={400} height={130} rx={14} fill="url(#hGoldDamask)" opacity={0.6} />
    <rect x={-30} y={-80} width={60} height={50} rx={8} fill={H.gold} stroke={H.ln} strokeWidth={3} />
    {[["#2FA3E0", -120], ["#D22E4A", -50], ["#3FB36A", 30], ["#F2D27A", 110]].map(([c, gx], i) => (
      <g key={i} opacity={open}>
        <path d={`M${gx},-136 l22,-30 l22,30 l-22,26Z`} fill={c as string} stroke={H.ln} strokeWidth={2.5} />
        <path d={`M${(gx as number) + 22},-176 l4,-14 l4,14 l14,4 l-14,4 l-4,14 l-4,-14 l-14,-4Z`} fill="#FFFFFF" opacity={0.5 + 0.5 * Math.sin(t * 5 + i * 1.9)} />
      </g>
    ))}
    <path d={`M-210,-120 L210,-120 L196,${-120 - 150 * open} L-196,${-120 - 150 * open}Z`} fill="#8E3446" stroke={H.ln} strokeWidth={5} />
    <path d="M-120,-60 Q0,-30 120,-60" stroke={H.gold} strokeWidth={6} fill="none" />
  </g>
);

// ── hazine odası: raflar, top top kumaş, sandıklar, kandiller, çini kemer
export const HazineOda: React.FC<{ t: number; night?: number; lit?: number }> = ({ t, night = 0, lit = 1 }) => {
  const fab = ["#B3262E", "#2B5DA8", "#3F6B33", "#D6A640", "#7A3A8A", "#2FA3A0", "#E9A48F", "#F2E2B8"];
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#3A2E2A" : "#E7D6B0"} />
      <rect width={1920} height={260} fill="url(#hTile)" opacity={0.85} />
      <rect y={250} width={1920} height={14} fill={H.gold} />
      {[0, 1, 2].map((c) => (
        <g key={c} transform={`translate(${140 + c * 600},300)`}>
          <rect width={460} height={540} fill="#6A4026" stroke={H.ln} strokeWidth={5} />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={10} y={20 + r * 175} width={440} height={14} fill="#4A2A16" />
              {Array.from({ length: 5 }, (_, i) => (
                <g key={i} transform={`translate(${56 + i * 86},${120 + r * 175})`}>
                  <circle r={40} fill={fab[(c * 5 + r * 3 + i) % fab.length]} stroke={H.ln} strokeWidth={3} />
                  <circle r={26} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.35} />
                  <circle r={10} fill="#3A2418" opacity={0.6} />
                </g>
              ))}
            </g>
          ))}
        </g>
      ))}
      <rect y={840} width={1920} height={240} fill="url(#hMarble)" />
      <rect y={840} width={1920} height={10} fill="#5A3E30" opacity={0.4} />
      {[300, 760, 1200, 1640].map((sx, i) => (
        <g key={i} transform={`translate(${sx},${960 + (i % 2) * 30})`}>
          <rect x={-120} y={-110} width={240} height={110} rx={10} fill={i % 2 ? "#7A4A2A" : "#8A3A2A"} stroke={H.ln} strokeWidth={4} />
          <path d="M-120,-110 Q0,-170 120,-110Z" fill={i % 2 ? "#8A5A34" : "#9A4A34"} stroke={H.ln} strokeWidth={4} />
          {[-80, 0, 80].map((bx) => <rect key={bx} x={bx - 8} y={-150} width={16} height={150} fill={H.gold} opacity={0.75} />)}
          <rect x={-18} y={-70} width={36} height={30} rx={4} fill={H.gold} stroke={H.ln} strokeWidth={2} />
        </g>
      ))}
      {[480, 960, 1440].map((lx, i) => (
        <g key={i} transform={`translate(${lx},${70 + Math.sin(t * 1.2 + i) * 6})`}>
          <path d="M0,-80 V0" stroke={H.ln} strokeWidth={4} />
          <path d="M-36,0 Q0,-30 36,0 L26,64 Q0,84 -26,64Z" fill={H.gold} stroke={H.ln} strokeWidth={3} />
          <circle cy={34} r={120} fill="#FFD27A" opacity={(0.18 + 0.05 * Math.sin(t * 6 + i)) * lit} />
        </g>
      ))}
      {night > 0 && <rect width={1920} height={1080} fill="#14182E" opacity={0.35 * night} />}
    </g>
  );
};

// ── gölge adamlar (şiddet yok: siluet, fener ışığı, uzun gölge)
export const GolgeAdam: React.FC<{ x: number; y: number; s?: number; t?: number; n?: number; walk?: number; op?: number }> = ({ x, y, s = 1, t = 0, n = 3, walk = 1, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    {Array.from({ length: n }, (_, i) => {
      const bob = Math.abs(Math.sin(t * 6 * walk + i)) * 10 * walk;
      return (
        <g key={i} transform={`translate(${i * 150},${-bob + (i % 2) * 14})`}>
          <path d="M-70,0 Q-90,-260 -50,-380 Q0,-420 50,-380 Q90,-260 70,0Z" fill="#14121A" />
          <circle cy={-440} r={50} fill="#14121A" />
          <path d="M-56,-470 Q0,-560 56,-470Z" fill="#14121A" />
          <path d={`M60,-300 L${130 + Math.sin(t * 6 + i) * 10},-120`} stroke="#14121A" strokeWidth={22} strokeLinecap="round" />
          <path d="M-200,0 L300,0" stroke="#000" strokeWidth={30} opacity={0.15} />
        </g>
      );
    })}
  </g>
);

// ── saray çatısı (gece/şafak), bacalar ve kubbeler, saklanan siluet
export const Cati: React.FC<{ t: number; dawn?: number; fig?: number; men?: number }> = ({ t, dawn = 0, fig = 1, men = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dawn ? "#E9A27A" : "#1E2848"} />
    <rect width={1920} height={1080} fill="#F2C890" opacity={dawn * 0.5} />
    {!dawn && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 131) % 520} r={1.5 + (i % 3)} fill="#FFFFFF" opacity={0.4 + 0.5 * Math.sin(t * 2 + i)} />)}
    <circle cx={1500} cy={dawn ? 520 : 220} r={dawn ? 120 : 70} fill={dawn ? "#FFD27A" : "#F4F0E0"} opacity={0.95} />
    <path d="M0,700 L240,520 L420,600 L640,470 L900,560 L1180,480 L1460,580 L1700,500 L1920,560 V1080 H0Z" fill={dawn ? "#8A5A64" : "#2A3458"} />
    {[300, 820, 1340].map((dx, i) => <g key={i} transform={`translate(${dx},${610 - (i % 2) * 30})`}><path d={`M-150,0 Q-150,-170 0,-190 Q150,-170 150,0Z`} fill={dawn ? "#9AA0A8" : "#4A5470"} stroke={H.ln} strokeWidth={4} /><path d="M0,-190 v-60" stroke={H.gold} strokeWidth={6} /><circle cy={-256} r={10} fill={H.gold} /></g>)}
    <path d="M0,780 L1920,720 V1080 H0Z" fill={dawn ? "#A0645A" : "#3A2A3A"} />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 66},${780 - i * 2} l33,-18 l33,18`} stroke={dawn ? "#7A3A30" : "#24182A"} strokeWidth={5} fill="none" />)}
    {[520, 1260].map((cx, i) => <g key={i} transform={`translate(${cx},${770 - i * 26})`}><rect x={-34} y={-180} width={68} height={180} fill={dawn ? "#C9B89A" : "#4A3E4E"} stroke={H.ln} strokeWidth={4} /><path d="M-46,-180 h92 l-12,-34 h-68Z" fill={dawn ? "#8A4A2A" : "#2A2030"} /></g>)}
    {fig > 0 && <g transform={`translate(1290,${746 - 26})`} opacity={fig}><path d="M30,0 Q20,-140 50,-200 Q80,-230 110,-200 Q130,-140 120,0Z" fill={dawn ? "#2B5DA8" : "#10141F"} /><circle cx={80} cy={-236} r={30} fill={dawn ? H.face : "#10141F"} stroke={dawn ? H.ln : "none"} strokeWidth={3} /></g>}
    {men > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${200 + i * 120 + men * 400},${790 - i * 3})`}><HTiny x={0} y={0} s={2.8} c="#B3262E" lit={0.4} /></g>)}
  </g>
);

// ── Kafkas köyü (dağlar, taş evler, dere)
export const Kafkas: React.FC<{ t: number; mist?: number }> = ({ t, mist = 0.4 }) => (
  <g>
    <rect width={1920} height={1080} fill="#BCD8E8" />
    <path d="M0,560 L260,260 L420,380 L640,160 L860,420 L1080,220 L1300,400 L1540,180 L1760,360 L1920,280 V1080 H0Z" fill="#8A9CB4" />
    <path d="M560,240 L640,160 L720,240 L680,230 L640,260 L600,230Z M1000,300 L1080,220 L1160,300 L1120,290 L1080,320 L1040,290Z M1460,260 L1540,180 L1620,260 L1580,250 L1540,280 L1500,250Z" fill="#FFFFFF" />
    <path d="M0,700 Q400,560 900,660 T1920,620 V1080 H0Z" fill="#7FA05A" />
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${80 + i * 165},${660 + Math.sin(i) * 30})`}><path d="M0,0 L-40,0 L0,-120 L40,0Z" fill="#3F6B33" /><path d="M0,-40 L-30,-40 L0,-150 L30,-40Z" fill="#4E8A3A" /></g>)}
    {[640, 900, 1180].map((hx, i) => <g key={i} transform={`translate(${hx},${820 + i * 10})`}><rect x={-110} y={-140} width={220} height={140} fill="#B8AA94" stroke={H.ln} strokeWidth={4} />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={-110 + (j % 4) * 55} y={-140 + Math.floor(j / 4) * 70} width={55} height={70} fill="none" stroke="#8A7A64" strokeWidth={2} />)}<path d="M-130,-140 L0,-210 L130,-140Z" fill="#6A4A34" stroke={H.ln} strokeWidth={4} /><rect x={-24} y={-80} width={48} height={80} fill="#5E3B20" /><path d={`M70,-200 q${10 + Math.sin(t * 2 + i) * 10},-40 0,-80`} stroke="#EEE" strokeWidth={9} fill="none" opacity={0.6} /></g>)}
    <path d={`M0,960 Q480,${900 + Math.sin(t) * 8} 960,950 T1920,930 V1000 Q1440,${990 + Math.sin(t * 1.3) * 8} 960,1010 T0,1020Z`} fill="#7FB8D6" />
    <rect width={1920} height={1080} fill="#FFFFFF" opacity={mist * (0.5 + 0.2 * Math.sin(t * 0.5))} />
  </g>
);

// ── yelkenli gemi (denizde sallanır)
export const Yelkenli: React.FC<{ t: number; px?: number; night?: number }> = ({ t, px = 0, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#26304E" : "#9CC6DC"} />
    <rect y={600} width={1920} height={480} fill={night ? "#1A2440" : "#3E7FA8"} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${md(i * 197 + t * 40, 2100) - 100},${640 + (i % 8) * 56} q40,-14 80,0 q40,14 80,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.35} />)}
    <g transform={`translate(${960 + px},${640 + Math.sin(t * 1.4) * 10}) rotate(${Math.sin(t * 1.1) * 2.5})`}>
      <path d="M-380,0 L380,0 L300,110 L-300,110Z" fill="#6A4026" stroke={H.ln} strokeWidth={6} />
      <path d="M-370,20 H370" stroke={H.gold} strokeWidth={6} />
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-240 + i * 80} cy={60} r={12} fill="#2A1A10" />)}
      {[-160, 120].map((mx, i) => <g key={i}><path d={`M${mx},0 V-460`} stroke="#4A2A16" strokeWidth={14} /><path d={`M${mx - 150},-420 Q${mx + 20 * Math.sin(t)},-300 ${mx - 150},-140 L${mx + 150},-140 Q${mx + 200},-300 ${mx + 150},-420Z`} fill="#F4EEDC" stroke={H.ln} strokeWidth={4} /></g>)}
      <rect x={-20} y={-540} width={70} height={40} fill="#C8202A" />
    </g>
  </g>
);

// ── sıbyan mektebi cephesi (Divanyolu), kitabe, çocuklar
export const Mektep: React.FC<{ t: number; kids?: number; today?: number; k?: number }> = ({ t, kids = 1, today = 0, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={today ? "#CFE3EE" : "#E9D9B4"} />
    <rect y={860} width={1920} height={220} fill={today ? "#9A9A94" : "#C9B48A"} />
    {today > 0 && Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 260} y={940} width={150} height={10} fill="#FFFFFF" opacity={0.7} />)}
    <g transform="translate(960,860)">
      <rect x={-560} y={-520} width={1120} height={520} fill="#EFE3C8" stroke={H.ln} strokeWidth={6} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M-560,${-520 + i * 74} H560`} stroke={today ? "#C9B89A" : "#D8C7A4"} strokeWidth={3} />)}
      <path d="M-600,-520 L0,-660 L600,-520Z" fill="#8A4A2A" stroke={H.ln} strokeWidth={6} />
      {[-380, -190, 190, 380].map((wx) => <g key={wx}><path d={`M${wx - 60},-120 V-300 Q${wx},-370 ${wx + 60},-300 V-120Z`} fill="#6E8FA4" stroke={H.ln} strokeWidth={4} /><path d={`M${wx},-350 V-120 M${wx - 60},-220 H${wx + 60}`} stroke="#3A4A54" strokeWidth={4} /></g>)}
      <path d="M-90,0 V-250 Q0,-340 90,-250 V0Z" fill="#5E3B20" stroke={H.ln} strokeWidth={5} />
      <rect x={-260} y={-470} width={520} height={110} rx={10} fill="#2F5A3A" stroke={H.gold} strokeWidth={6} opacity={k} />
      <text y={-430} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={H.gold} opacity={k}>CEVRİ KALFA</text>
      <text y={-386} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={28} fill="#F6EEDC" opacity={k}>SIBYAN MEKTEBİ · 1819</text>
    </g>
    {kids > 0 && Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${300 + i * 110 + (i > 3 ? 560 : 0)},${1010 + Math.abs(Math.sin(t * 5 + i)) * -8})`}><HTiny x={0} y={0} s={2.3} c={["#B3262E", "#2B5DA8", "#3F6B33", "#D6A640"][i % 4]} /></g>)}
  </g>
);

// ── Eski Saray / Gözyaşı Sarayı (gri, yağmur)
export const EskiSaray: React.FC<{ t: number; rain?: number; walkers?: number }> = ({ t, rain = 1, walkers = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#8A96A4" />
    <rect y={760} width={1920} height={320} fill="#6E747A" />
    <g transform="translate(960,760)">
      <rect x={-700} y={-360} width={1400} height={360} fill="#A8A498" stroke={H.ln} strokeWidth={5} />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-700 + i * 66} y={-394} width={40} height={34} fill="#A8A498" stroke={H.ln} strokeWidth={3} />)}
      {[-560, -280, 0, 280, 560].map((wx) => <rect key={wx} x={wx - 40} y={-260} width={80} height={110} fill="#3E4650" stroke={H.ln} strokeWidth={3} />)}
      <path d="M-110,0 V-200 Q0,-280 110,-200 V0Z" fill="#3A3028" stroke={H.ln} strokeWidth={5} />
    </g>
    {walkers > 0 && Array.from({ length: 8 }, (_, i) => <HTiny key={i} x={200 + i * 70 + (t * 30) % 70 + walkers * 300} y={1000 + (i % 2) * 20} s={2.4} c={["#7A7A8A", "#8A7A6A", "#6A7A7A"][i % 3]} />)}
    {rain > 0 && Array.from({ length: 120 }, (_, i) => { const x = md(i * 157 - t * 200, 1960), y = md(i * 89 + t * 1300, 1120) - 20; return <path key={i} d={`M${x},${y} l-10,36`} stroke="#DDE6EE" strokeWidth={2} opacity={0.5 * rain} />; })}
    <rect width={1920} height={1080} fill="#2A3240" opacity={0.18} />
  </g>
);

// ── iki güç arasında: iki büyük kadın, ortada sen (bölünmüş ışık)
export const IkiGuc: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={960} height={1080} fill="#8E2A2A" />
    <rect x={960} width={960} height={1080} fill="#2B4A8A" />
    <rect width={960} height={1080} fill="url(#hGoldDamask)" opacity={0.35} />
    <rect x={960} width={960} height={1080} fill="url(#hDamask)" opacity={0.35} />
    <path d={`M960,0 V1080`} stroke={H.gold} strokeWidth={10} opacity={0.6 + 0.3 * Math.sin(t * 3)} />
    <circle cx={960} cy={560} r={lerp(200, 380, k)} fill="#FFE7A0" opacity={0.15} />
  </g>
);

export const Kandil2: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cy={-30} r={140} fill="#FFD27A" opacity={0.22 + 0.06 * Math.sin(t * 7)} />
    <path d="M-60,0 Q-70,-30 -30,-40 L40,-40 Q90,-36 100,-10 Q60,10 -60,0Z" fill="#C8823A" stroke={H.ln} strokeWidth={4} />
    <path d={`M90,-14 q${6 + Math.sin(t * 9) * 4},-30 0,-60 q-12,30 0,60Z`} fill="#FFB43A" />
  </g>
);
