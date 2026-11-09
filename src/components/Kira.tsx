import React from "react";
import { H, HTiny, lerp } from "./Harem";

// Kanal 3 · Kira kiti (k3r-08): bohça (açılır), gül yağı şişesi, ipek toplar, yere serilen kumaşlar,
// Balat sokağı ve Haliç, İtalyanca mektup + mühür, Londra arşiv kutusu, kraliçenin arabası,
// sipahi kalabalığı, kumaş dükkânı. Hepsi vektör.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const SILK = ["#C2477A", "#2B5DA8", "#2FA3A0", "#D6A640", "#6A4AA0", "#B8322E"];

export const GulSise: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string }> = ({ x, y, s = 1, t = 0, c = "#E86A92" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-30,0 Q-46,-60 -24,-90 L-12,-120 L12,-120 L24,-90 Q46,-60 30,0Z" fill={c} opacity={0.75} stroke={H.ln} strokeWidth={4} />
    <rect x={-14} y={-140} width={28} height={22} rx={4} fill={H.gold} stroke={H.ln} strokeWidth={3} />
    <ellipse cx={-10} cy={-50} rx={6} ry={22} fill="#FFFFFF" opacity={0.5} />
    {[0, 1].map((i) => <path key={i} d={`M${-6 + i * 12},${-150 - md(t * 20 + i * 18, 40)} q8,-10 0,-20`} stroke="#F2B8C9" strokeWidth={3} fill="none" opacity={1 - md(t * 20 + i * 18, 40) / 40} />)}
  </g>
);

export const Kupe: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{[-30, 30].map((dx) => <g key={dx} transform={`translate(${dx},0) rotate(${Math.sin(t * 2 + dx) * 6})`}><path d="M0,-40 V-10" stroke={H.gold} strokeWidth={4} /><circle cy={6} r={16} fill="#FFFDF4" stroke="#C9C2B0" strokeWidth={3} /><circle cx={-5} cy={1} r={5} fill="#FFFFFF" /></g>)}</g>
);

// bohça: k=0 bağlı, 1 açık (içindekiler görünür)
export const Bohca: React.FC<{ x: number; y: number; s?: number; t: number; open?: number; letter?: boolean; c?: string }> = ({ x, y, s = 1, t, open = 0, letter = true, c = "#7A2430" }) => {
  const k = cl(open);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cy={20} rx={360} ry={40} fill="#000" opacity={0.18} />
      {k > 0 ? (
        <g>
          <path d={`M-340,10 L${-180 - k * 100},${-120 - k * 40} L0,${-160 - k * 60} L${180 + k * 100},${-120 - k * 40} L340,10 Q0,50 -340,10Z`} fill={c} stroke={H.ln} strokeWidth={5} />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-280 + i * 62} cy={0} r={8} fill={H.gold} />)}
          <g opacity={k}>
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-160 + i * 90},${-60})`}><rect x={-40} y={-30} width={80} height={60} rx={20} fill={SILK[i]} stroke={H.ln} strokeWidth={3} /><path d="M-40,0 h80" stroke="#FFFFFF" strokeWidth={3} opacity={0.4} /></g>)}
            <GulSise x={110} y={-20} s={0.7} t={t} />
            <GulSise x={170} y={-16} s={0.6} t={t} c="#B08AD8" />
            <Kupe x={-250} y={-30} s={0.8} t={t} />
            {letter && <g transform="translate(40,-110) rotate(-8)"><rect x={-60} y={-36} width={120} height={72} fill="#FFFAEE" stroke={H.ln} strokeWidth={3} /><circle cx={30} cy={10} r={14} fill={H.red} /></g>}
          </g>
        </g>
      ) : (
        <g transform={`rotate(${Math.sin(t * 2) * 1.5})`}>
          <path d="M-220,10 Q-260,-140 -100,-200 Q0,-230 100,-200 Q260,-140 220,10 Q0,40 -220,10Z" fill={c} stroke={H.ln} strokeWidth={5} />
          <path d="M-180,-60 Q0,-20 180,-60" stroke={H.gold} strokeWidth={8} fill="none" />
          {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-150 + i * 50} cy={-50 + Math.abs(i - 3) * -4} r={7} fill={H.gold} />)}
          <path d="M-40,-200 L-90,-280 Q0,-250 0,-210 Q0,-250 90,-280 L40,-200Z" fill={c} stroke={H.ln} strokeWidth={5} />
          <circle cy={-208} r={18} fill={H.gold} stroke={H.ln} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

// yere serilen kumaşlar (harem odasında)
export const Kumaslar: React.FC<{ t: number; k?: number; y?: number; hl?: number }> = ({ t, k = 1, y = 960, hl = -1 }) => (
  <g>
    {SILK.map((c, i) => {
      const w = lerp(40, 320, cl(k * 1.6 - i * 0.12));
      const x = 260 + i * 240;
      return <g key={i} transform={`translate(${x},${y})`}>
        <path d={`M-30,0 L${w - 30},${-6 + Math.sin(t * 1.5 + i) * 3} L${w - 10},60 L-10,66Z`} fill={c} stroke={H.ln} strokeWidth={4} opacity={0.95} />
        <ellipse cx={-20} cy={30} rx={34} ry={40} fill={c} stroke={H.ln} strokeWidth={4} />
        <path d={`M0,20 L${w - 30},16`} stroke="#FFFFFF" strokeWidth={3} opacity={0.35} strokeDasharray="14 10" />
        {i === hl && <ellipse cx={w / 2} cy={30} rx={w / 2 + 40} ry={70} fill="none" stroke={H.gold} strokeWidth={6} opacity={0.6 + 0.4 * Math.sin(t * 5)} />}
      </g>;
    })}
  </g>
);

// Balat: renkli evler, dar sokak, Haliç
export const Balat: React.FC<{ t: number; dusk?: number; crowd?: number; night?: number }> = ({ t, dusk = 0, crowd = 0, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1A2040" : dusk ? "#E9A97A" : "#CFE6F0"} />
    <rect y={500} width={1920} height={140} fill={night ? "#22305A" : "#5E9AC0"} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${md(i * 260 + t * 20, 2100) - 100},${540 + (i % 3) * 30} q30,-8 60,0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.3} />)}
    <g fill={night ? "#121830" : "#7A8CA0"}>{[300, 1500].map((cx) => <g key={cx}><path d={`M${cx - 120},500 Q${cx},360 ${cx + 120},500Z`} /><rect x={cx + 150} y={330} width={16} height={170} /></g>)}</g>
    {[[0, 300, "#E07A5F"], [300, 260, "#F2CC8F"], [560, 280, "#81B29A"], [1060, 300, "#3D7EA6"], [1360, 260, "#E9C46A"], [1620, 300, "#C2477A"]].map(([x, w, c], i) => (
      <g key={i} transform={`translate(${x},0)`}>
        <rect x={0} y={420 - (i % 2) * 40} width={w as number} height={560 + (i % 2) * 40} fill={night ? "#3A3550" : (c as string)} stroke={H.ln} strokeWidth={5} />
        <rect x={-10} y={600 - (i % 2) * 40} width={(w as number) + 20} height={30} fill={H.wood2} />
        <rect x={20} y={460 - (i % 2) * 40} width={(w as number) - 40} height={140} fill={H.wood} stroke={H.ln} strokeWidth={4} />
        {[0, 1].map((r) => <rect key={r} x={40 + r * (((w as number) - 80) / 2)} y={680} width={((w as number) - 100) / 2} height={110} fill={night ? "#F6C445" : "#2A3346"} opacity={night ? 0.7 : 0.8} stroke={H.ln} strokeWidth={4} />)}
      </g>
    ))}
    <path d="M860,1080 L900,620 L1020,620 L1060,1080Z" fill={night ? "#2A2A3A" : "#B8A68A"} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${880 - i * 2},${660 + i * 44} H${1040 + i * 2}`} stroke="#00000022" strokeWidth={3} />)}
    <rect y={980} width={1920} height={100} fill={night ? "#2A2A3A" : "#A89878"} />
    {crowd > 0 && Array.from({ length: 10 }, (_, i) => <HTiny key={i} x={100 + i * 190} y={1070} s={2} c={SILK[i % 6]} />)}
    {dusk > 0 && <rect width={1920} height={1080} fill="#E89B2A" opacity={0.1} />}
  </g>
);

// İtalyanca mektup + kırmızı mühür
export const ItalyanMektup: React.FC<{ x?: number; y?: number; s?: number; t: number; k?: number; seal?: number }> = ({ x = 960, y = 540, s = 1, t, k = 1, seal = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${-2 + Math.sin(t * 0.6)})`}>
    <rect x={-430} y={-330} width={860} height={660} fill="#F7EBCF" stroke={H.ln} strokeWidth={6} />
    <rect x={-430} y={-330} width={860} height={660} fill="url(#hTile)" opacity={0.04} />
    <text x={-370} y={-250} fontFamily="serif" fontStyle="italic" fontSize={44} fill="#3A2A20" opacity={cl(k * 8)}>Serenissima Regina…</text>
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-370,${-180 + i * 56} q90,-10 180,0 t180,0 t180,0 t160,0`} stroke="#3A2A20" strokeWidth={4} fill="none" opacity={cl(k * 8 - 1 - i)} />)}
    <text x={360} y={290} textAnchor="end" fontFamily="serif" fontStyle="italic" fontSize={40} fill="#3A2A20" opacity={cl(k * 8 - 8)}>Esperanza Malchi</text>
    <g transform={`translate(-300,250) scale(${0.6 + 0.4 * cl(seal)})`} opacity={cl(seal)}><circle r={56} fill="#A8202E" stroke="#6A1018" strokeWidth={5} />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.785) * 56} cy={Math.sin(i * 0.785) * 56} r={12} fill="#A8202E" />)}<text y={14} textAnchor="middle" fontFamily="serif" fontWeight={800} fontSize={40} fill="#F2C94C">S</text></g>
  </g>
);

// arşiv: rafta kutu, etiket "LONDRA"
export const Arsiv: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2E3A" />
    {Array.from({ length: 4 }, (_, r) => <g key={r}><rect x={80} y={200 + r * 220} width={1760} height={16} fill="#5E4A36" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={100 + i * 145} y={80 + r * 220} width={130} height={120} fill={["#8A7A62", "#7A6A52", "#9A8A72"][(i + r) % 3]} stroke="#3A2A20" strokeWidth={3} />)}</g>)}
    <g transform={`translate(960,${lerp(420, 560, cl(k))}) scale(${lerp(1, 1.6, cl(k))})`}><rect x={-90} y={-70} width={180} height={140} fill="#B8A07A" stroke="#3A2A20" strokeWidth={4} /><rect x={-60} y={-30} width={120} height={50} fill="#FFFDF4" /><text y={4} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#3A2A20">LONDRA · 1599</text></g>
    <circle cx={960} cy={500} r={400} fill="#FFE7A0" opacity={0.08 + 0.03 * Math.sin(t * 2)} />
  </g>
);

// kraliçenin hediye arabası
export const Araba: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-160, 160].map((wx) => <g key={wx} transform={`translate(${wx},-70) rotate(${t * 60})`}><circle r={70} fill="none" stroke={H.wood2} strokeWidth={14} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0,0 L${Math.cos(i) * 66},${Math.sin(i) * 66}`} stroke={H.wood2} strokeWidth={6} />)}</g>)}
    <path d="M-240,-120 L240,-120 L270,-330 Q0,-420 -270,-330Z" fill="#2E4A7A" stroke={H.ln} strokeWidth={6} />
    <rect x={-120} y={-300} width={240} height={130} rx={20} fill="#BFE6F2" stroke={H.gold} strokeWidth={8} />
    {[-200, 200].map((cx) => <circle key={cx} cx={cx} cy={-360} r={20} fill={H.gold} />)}
    <path d="M-40,-410 L0,-460 L40,-410Z" fill={H.gold} />
  </g>
);

// sipahi kalabalığı: öfkeli siluetler, mızrak, bayrak
export const Sipahiler: React.FC<{ t: number; n?: number; k?: number; fire?: number }> = ({ t, n = 18, k = 1, fire = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = 60 + (i * 113) % 1820, row = i % 3, bob = Math.abs(Math.sin(t * 6 + i)) * 12;
      const sc = 1.6 + row * 0.5;
      return <g key={i} transform={`translate(${x},${880 + row * 70 - bob}) scale(${sc})`} opacity={cl(k * 2 - i / n)}>
        <path d="M-30,0 L-24,-90 Q0,-110 24,-90 L30,0Z" fill={["#5A2A1E", "#3A2A20", "#6A3A2A"][i % 3]} />
        <circle cy={-118} r={22} fill="#3A2A20" />
        <path d="M-26,-130 Q0,-170 26,-130Z" fill="#B3262E" />
        {i % 2 === 0 && <path d={`M18,-80 L${40 + Math.sin(t * 5 + i) * 8},-230`} stroke="#5E3B20" strokeWidth={5} />}
        {i % 5 === 0 && <path d={`M40,-230 l60,${12 + Math.sin(t * 6 + i) * 6} l-60,26Z`} fill="#B3262E" />}
        <path d={`M-20,-80 L${-50 - Math.abs(Math.sin(t * 7 + i)) * 20},${-150}`} stroke="#3A2A20" strokeWidth={8} strokeLinecap="round" />
      </g>;
    })}
    {fire > 0 && <rect width={1920} height={1080} fill="#FF6A2A" opacity={fire * (0.08 + 0.05 * Math.sin(t * 9))} />}
  </g>
);

// kumaş dükkânı (Balat): raflarda toplar, tezgâh
export const KiraDukkan: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#EADFC8" />
    <rect width={1920} height={760} fill="url(#hTile)" opacity={0.12} />
    {Array.from({ length: 3 }, (_, r) => <g key={r}><rect x={120} y={220 + r * 170} width={1680} height={18} fill={H.wood2} />{Array.from({ length: 14 }, (_, i) => <g key={i} transform={`translate(${170 + i * 118},${190 + r * 170})`}><ellipse rx={50} ry={34} fill={SILK[(i + r) % 6]} stroke={H.ln} strokeWidth={3} /><ellipse rx={16} ry={11} fill="#00000033" /></g>)}</g>)}
    <rect y={800} width={1920} height={280} fill={H.wood} />
    <rect y={800} width={1920} height={24} fill={H.wood2} />
    <path d={`M600,820 Q960,${790 + Math.sin(t * 1.5) * 8} 1320,820 L1320,880 L600,880Z`} fill={SILK[0]} stroke={H.ln} strokeWidth={4} />
    {dusk > 0 && <rect width={1920} height={1080} fill="#E89B2A" opacity={0.1 * dusk} />}
  </g>
);
