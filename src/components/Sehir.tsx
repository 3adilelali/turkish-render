import React from "react";
import { T, TMini, MINI_COLS } from "./Toon";

// Kanal 2 · İstanbul detay kiti (k2r-05 ile başladı): plaza toplantı odası, hırdavat dükkânı, metrobüs içi,
// telefon satranç, gazete bulmacası, mektup, tabela. Çok katmanlı, yakın planda da zengin.

const md = (v: number, m: number) => ((v % m) + m) % m;

// ── Levent plaza toplantı odası: cam duvar, gökdelenler, büyük ekran (slayt), masa, sandalyeler
export const Toplanti: React.FC<{ t: number; err?: number; fuzzy?: number; night?: number; slide?: string }> = ({ t, err = 1, fuzzy = 0, night = 0, slide = "Q3 BÜTÇE" }) => {
  const rows = [["Gelir", "4.820"], ["Gider", "3.150"], ["Kâr", "1.870"]];
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "url(#tSkyNight)" : "url(#tSkyDay)"} />
      {[[60, 260, 520], [300, 200, 380], [520, 300, 600], [1380, 240, 470], [1600, 180, 640], [1780, 220, 420]].map(([x, w, h], i) => (
        <g key={i}><rect x={x} y={760 - h} width={w * 0.6} height={h} fill={night ? "#22304C" : "#9FB6C8"} />{Array.from({ length: Math.floor(h / 40) }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={`${r}${c}`} x={x + 12 + c * (w * 0.18)} y={780 - h + r * 40} width={w * 0.1} height={18} fill={night ? (r * 3 + c + i) % 4 ? "#F6D98A" : "#2E3C58" : "#D9E6EE"} opacity={0.8} />))}</g>
      ))}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 240} y={0} width={10} height={1080} fill="#B9C6CF" opacity={0.9} />)}
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.08} />
      <g transform="translate(960,300)">
        <rect x={-430} y={-200} width={860} height={420} rx={12} fill="#1C2230" stroke="#3A4250" strokeWidth={14} />
        <rect x={-410} y={-182} width={820} height={384} fill="#F7F9FB" />
        <rect x={-410} y={-182} width={820} height={60} fill="#2C5AA0" />
        <text x={-380} y={-140} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF">{slide}</text>
        {[60, 130, 90, 170, 120].map((h, i) => <rect key={i} x={-380 + i * 70} y={160 - h} width={44} height={h} fill={i === 3 ? T.red : "#3A7BD5"} opacity={0.9} />)}
        <g style={{ filter: fuzzy ? `blur(${fuzzy * 3}px)` : undefined }} transform={fuzzy ? `translate(${Math.sin(t * 5) * fuzzy * 8},0) rotate(${Math.sin(t * 3) * fuzzy * 2})` : undefined}>
          {rows.map(([a, b], i) => (
            <g key={i} transform={`translate(20,${-70 + i * 76})`}>
              <text x={0} y={0} fontFamily="Poppins" fontWeight={700} fontSize={38} fill="#2A2A2A">{a}</text>
              <text x={360} y={0} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={38} fill={i === 2 && err ? T.red : "#2A2A2A"}>{b}</text>
            </g>
          ))}
          {err > 0 && <ellipse cx={330} cy={88} rx={90} ry={40} fill="none" stroke={T.red} strokeWidth={6} opacity={err} />}
        </g>
      </g>
      <rect y={820} width={1920} height={260} fill="#C9CED4" />
      <path d="M200,840 L1720,840 L1840,980 L80,980Z" fill="#5A4636" />
      <path d="M200,840 L1720,840 L1730,856 L190,856Z" fill="#7A604A" />
      {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={300 + i * 230} y={850} width={120} height={24} rx={6} fill="#F4F4F4" opacity={0.85} /><rect x={330 + i * 230 + (i % 2) * 40} y={826} width={26} height={30} rx={4} fill={["#FFFFFF", "#C9302C", "#3A3A3A"][i % 3]} /></g>)}
    </g>
  );
};

// ── hırdavat dükkânı (Bakırköy): raflar, vida kutuları, musluklar, anahtarlar, tezgâh, kapı zili, tabela
export const Dukkan: React.FC<{ t: number; bell?: number; sign?: string; signOk?: boolean; dusk?: number }> = ({ t, bell = 0, sign = "ÖZTÜRK HIRDAVAT", signOk = true, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#E9C9A0" : "#EDE2CC"} />
    <rect width={1920} height={1080} fill="url(#tBrick)" opacity={0.25} />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x={60} y={150 + r * 210} width={1800} height={18} fill="#7A5634" />
        {Array.from({ length: 22 }, (_, i) => {
          const x = 80 + i * 82, y = 150 + r * 210;
          const k = (i * 7 + r * 3) % 6;
          return k === 0 ? <g key={i}><rect x={x} y={y - 70} width={64} height={70} fill="#C9302C" /><rect x={x + 8} y={y - 56} width={48} height={20} fill="#FFFFFF" opacity={0.7} /></g>
            : k === 1 ? <g key={i}><rect x={x} y={y - 90} width={56} height={90} rx={6} fill="#3A7BD5" /><circle cx={x + 28} cy={y - 60} r={14} fill="#F6C445" /></g>
            : k === 2 ? <g key={i} transform={`translate(${x + 30},${y - 30})`}><path d="M-26,0 h30 q20,0 20,-20 v-20" stroke="#B8B8B8" strokeWidth={14} fill="none" strokeLinecap="round" /><circle cx={24} cy={-44} r={12} fill="#9A9A9A" /></g>
            : k === 3 ? <g key={i}>{[0, 1, 2].map((j) => <rect key={j} x={x + j * 20} y={y - 50} width={16} height={50} fill={["#F28C28", "#3FAE6A", "#7E5BD6"][j]} />)}</g>
            : k === 4 ? <g key={i}><path d={`M${x + 10},${y} l14,-80 h20 l14,80Z`} fill="#8B6B4A" /><rect x={x + 18} y={y - 96} width={28} height={20} fill="#5A5A5A" /></g>
            : <g key={i}><rect x={x} y={y - 46} width={64} height={46} fill="#E9D3A8" stroke="#B89A6E" strokeWidth={3} /><text x={x + 32} y={y - 16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={18} fill="#5A3820">M8</text></g>;
        })}
      </g>
    ))}
    {Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${260 + i * 150},${720 + Math.sin(t * 1.5 + i) * 2})`}><path d="M0,-40 V0" stroke="#5A5A5A" strokeWidth={3} /><path d="M-12,0 h24 v60 h-24Z" fill={i % 2 ? "#C9C9C9" : "#B5651D"} /></g>)}
    <rect x={0} y={800} width={1920} height={280} fill="#9A7A5A" />
    <rect x={300} y={780} width={1320} height={60} fill="#6E4E32" />
    <rect x={300} y={840} width={1320} height={240} fill="#7A5634" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={340 + i * 260} y={870} width={220} height={180} rx={8} fill="none" stroke="#5A3820" strokeWidth={6} />)}
    <g transform="translate(1500,770)"><rect x={-60} y={-40} width={120} height={40} rx={6} fill="#3A3A3A" /><rect x={-50} y={-90} width={100} height={50} rx={6} fill="#2A2A2A" /><rect x={-40} y={-82} width={80} height={30} fill="#7FD8A0" /></g>
    <g transform="translate(560,770)"><circle r={22} fill="#C9C9C9" stroke="#8A8A8A" strokeWidth={4} /><circle cx={60} r={16} fill="#B5651D" /><rect x={90} y={-10} width={70} height={14} rx={6} fill="#9A9A9A" /></g>
    <g transform={`translate(120,60) rotate(${Math.sin(t * 18) * bell * 14})`}><path d="M0,0 V30" stroke="#5A5A5A" strokeWidth={4} /><path d="M-22,60 Q-22,30 0,30 Q22,30 22,60Z" fill="#E8C468" /><circle cy={64} r={6} fill="#8A6A2A" /></g>
    <g transform="translate(960,70)">
      <rect x={-380} y={-50} width={760} height={100} rx={12} fill={signOk ? "#2C5AA0" : "#F4EEDC"} stroke="#5A3820" strokeWidth={8} />
      <text y={22} textAnchor="middle" fontFamily={signOk ? "Poppins" : "Patrick Hand"} fontWeight={800} fontSize={58} fill={signOk ? "#FFFFFF" : "#3A2A20"}>{sign}</text>
    </g>
    {dusk > 0 && <rect width={1920} height={1080} fill="#F28C28" opacity={0.1 * dusk} />}
  </g>
);

// ── musluk (tamir sahnesi), damla: leak 0..1
export const Musluk: React.FC<{ x: number; y: number; s?: number; t?: number; leak?: number; open?: number }> = ({ x, y, s = 1, t = 0, leak = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-200} y={-30} width={160} height={60} rx={20} fill="#C9C9C9" stroke="#8A8A8A" strokeWidth={5} />
    <path d="M-40,-24 H80 Q130,-24 130,30 V80 H90 V40 Q90,24 70,24 H-40Z" fill="#D9D9D9" stroke="#8A8A8A" strokeWidth={5} />
    <g transform={`translate(20,-30) rotate(${open * 40})`}><rect x={-14} y={-60} width={28} height={60} fill="#BDBDBD" stroke="#8A8A8A" strokeWidth={4} /><rect x={-70} y={-80} width={140} height={26} rx={12} fill="#C9302C" /></g>
    {leak > 0 && Array.from({ length: 3 }, (_, i) => { const k = md(t * 1.4 + i / 3, 1); return <ellipse key={i} cx={110} cy={96 + k * 220} rx={12} ry={16} fill="#7FC8F0" opacity={(1 - k) * leak} />; })}
    {open > 0.5 && <circle cx={-120} cy={0} r={26} fill="none" stroke="#2A2A2A" strokeWidth={8} strokeDasharray="10 6" />}
  </g>
);

// ── metrobüs içi: tutamaklar, kalabalık, pencereden akan şehir
export const Metrobus: React.FC<{ t: number; crowd?: number }> = ({ t, crowd = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#D8DEE4" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${80 + i * 470},170)`}>
        <rect width={400} height={330} rx={20} fill="#7FB0CF" />
        {Array.from({ length: 6 }, (_, j) => <rect key={j} x={md(j * 140 - t * 900, 700) - 120} y={110 + (j % 3) * 40} width={90} height={220 - (j % 3) * 40} fill="#5A7088" opacity={0.7} />)}
        <rect width={400} height={330} rx={20} fill="none" stroke="#9AA4AE" strokeWidth={14} />
      </g>
    ))}
    <rect y={120} width={1920} height={16} fill="#B8C0C8" />
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${100 + i * 160},136) rotate(${Math.sin(t * 2.6 + i) * 6})`}><path d="M0,0 V70" stroke="#E0E0E0" strokeWidth={6} /><path d="M-18,70 h36 v30 q-18,14 -36,0Z" fill="#F6C445" /></g>)}
    <rect y={560} width={1920} height={520} fill="#9AA4AE" />
    <rect y={560} width={1920} height={30} fill="#C9302C" />
    {crowd > 0 && Array.from({ length: 11 }, (_, i) => <TMini key={i} x={60 + i * 180 + (i % 2) * 40} y={1080} s={2.6} c={MINI_COLS[i % MINI_COLS.length]} t={t} seed={i} />)}
  </g>
);

// ── telefon: satranç tahtası, saat
export const Satranc: React.FC<{ t: number; x?: number; y?: number; s?: number; time?: string; win?: number }> = ({ t, x = 960, y = 540, s = 1, time = "10:00", win = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-230} y={-420} width={460} height={840} rx={50} fill="#1C1C1C" />
    <rect x={-210} y={-390} width={420} height={780} rx={30} fill="#2A3346" />
    <text y={-300} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#FFFFFF">⏱ {time}</text>
    <g transform="translate(-180,-220)">
      {Array.from({ length: 64 }, (_, i) => <rect key={i} x={(i % 8) * 45} y={Math.floor(i / 8) * 45} width={45} height={45} fill={(i + Math.floor(i / 8)) % 2 ? "#7A5634" : "#E9D3A8"} />)}
      {[[1, 1, "♚"], [5, 2, "♛"], [3, 5, "♞"], [6, 6, "♜"], [2, 3, "♝"]].map(([c, r, p], i) => <text key={i} x={(c as number) * 45 + 22} y={(r as number) * 45 + 36} textAnchor="middle" fontSize={38} fill={i % 2 ? "#FFFFFF" : "#111"} transform={i === 2 ? `translate(${Math.sin(t * 4) * 6},${-Math.abs(Math.sin(t * 4)) * 10})` : undefined}>{p}</text>)}
    </g>
    {win > 0 && <g opacity={win}><rect x={-180} y={180} width={360} height={90} rx={20} fill={T.green} /><text y={240} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#FFFFFF">KAZANDIN</text></g>}
  </g>
);

// ── gazete bulmacası (anne), kalem
export const Bulmaca: React.FC<{ t: number; x?: number; y?: number; s?: number; fill?: number; word?: string }> = ({ t, x = 960, y = 540, s = 1, fill = 0, word = "TAHAMMÜL" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-460} y={-320} width={920} height={640} fill="#F2EEE4" stroke="#C9C2B0" strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-430} y={-290 + i * 40} width={300} height={14} fill="#B8B2A4" opacity={0.6} />)}
    <g transform="translate(-60,-260)">
      {Array.from({ length: 80 }, (_, i) => <rect key={i} x={(i % 10) * 50} y={Math.floor(i / 10) * 50} width={50} height={50} fill={(i * 7) % 11 === 0 ? "#2A2A2A" : "#FFFFFF"} stroke="#2A2A2A" strokeWidth={2} />)}
      {word.split("").map((ch, i) => <text key={i} x={i * 50 + 25} y={3 * 50 + 38} textAnchor="middle" fontFamily="Patrick Hand" fontSize={42} fill="#1E3A8A" opacity={Math.max(0, Math.min(1, fill * word.length - i))}>{ch}</text>)}
    </g>
    <g transform={`translate(${-60 + Math.min(fill, 1) * word.length * 50},${-40 + Math.sin(t * 9) * 4}) rotate(30)`}><rect x={-8} y={-120} width={16} height={120} fill="#F6C445" /><path d="M-8,0 L8,0 L0,22Z" fill="#2A2A2A" /></g>
  </g>
);

// ── kendine mektup (katlanabilir): fold 0..1
export const Mektup: React.FC<{ t: number; x?: number; y?: number; s?: number; k?: number; lines?: string[]; fold?: number }> = ({ t, x = 960, y = 540, s = 1, k = 1, lines = [], fold = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) scale(1,${1 - fold * 0.7})`}>
    <rect x={-380} y={-460} width={760} height={920} fill="#FFFDF4" stroke="#D9D0B8" strokeWidth={4} />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M-340,${-380 + i * 60} H340`} stroke="#BFD6EA" strokeWidth={2} />)}
    <path d="M-300,-460 V460" stroke="#F2A0A0" strokeWidth={3} />
    {lines.map((l, i) => <text key={i} x={-280} y={-330 + i * 120} fontFamily="Patrick Hand" fontSize={i === lines.length - 1 ? 64 : 52} fill="#1E3A8A" opacity={Math.max(0, Math.min(1, k * lines.length - i))}>{l}</text>)}
    {fold > 0 && <path d="M-380,0 H380" stroke="#C9C0A8" strokeWidth={6} />}
    <g transform={`translate(${280 + Math.sin(t * 7) * 10},${-300 + Math.min(1, k) * 600}) rotate(30)`}><rect x={-8} y={-140} width={16} height={140} fill="#2C5AA0" /><path d="M-8,0 L8,0 L0,22Z" fill="#111" /></g>
  </g>
);

// ── kesir defteri: elma ikiye/dörde
export const Kesir: React.FC<{ t: number; x?: number; y?: number; s?: number; cut?: number }> = ({ t, x = 960, y = 540, s = 1, cut = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-480} y={-320} width={960} height={640} fill="#FFFFFF" stroke="#BFD6EA" strokeWidth={4} />
    {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${-480 + i * 40},-320 V320`} stroke="#E3EEF7" strokeWidth={2} />)}
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M-480,${-320 + i * 40} H480`} stroke="#E3EEF7" strokeWidth={2} />)}
    <g transform="translate(-200,0)">
      <circle r={150} fill="#E0393E" stroke="#8A1E22" strokeWidth={6} />
      <path d="M0,-150 q10,-40 40,-60" stroke="#5A3820" strokeWidth={10} fill="none" /><path d="M20,-190 q50,-30 80,0 q-40,20 -80,0Z" fill="#3FAE6A" />
      {cut > 0 && <path d={`M0,${-160 * Math.min(1, cut * 2)} V${160 * Math.min(1, cut * 2)}`} stroke="#1E3A8A" strokeWidth={8} strokeDasharray="16 10" />}
      {cut > 0.5 && <path d={`M${-160 * Math.min(1, (cut - 0.5) * 2)},0 H${160 * Math.min(1, (cut - 0.5) * 2)}`} stroke="#1E3A8A" strokeWidth={8} strokeDasharray="16 10" />}
    </g>
    <text x={220} y={-40} textAnchor="middle" fontFamily="Patrick Hand" fontSize={120} fill="#1E3A8A" opacity={Math.min(1, cut * 2)}>½</text>
    <text x={220} y={140} textAnchor="middle" fontFamily="Patrick Hand" fontSize={120} fill="#1E3A8A" opacity={Math.max(0, cut * 2 - 1)}>¼</text>
  </g>
);

// ── zekâ göstergesi: gözün köşesinde küçük beyaz sayı (TFig başının yanında). Başın merkezi ≈ y - 470*s
export const EyeNum: React.FC<{ t: number; x: number; y: number; s?: number; dir?: 1 | -1; n: number; from?: number; at?: number; big?: boolean; stop?: number }> = ({ t, x, y, s = 1, dir = 1, n, from, at, big = false, stop = 0 }) => {
  const fk = at === undefined ? 1 : Math.max(0, Math.min(1, (t - at + 0.18) / 0.36));
  const show = from !== undefined && fk < 0.5 ? from : n;
  const sy = at === undefined ? 1 : Math.max(0.05, Math.abs(1 - 2 * fk));
  const flash = at === undefined ? 0 : Math.max(0, 1 - Math.abs(t - at) / 0.7);
  const fs = (big ? 120 : 64) * s;
  const cx = x + dir * 150 * s, cy = y - 520 * s + Math.sin(t * 2.3) * 5 * s;
  const drop = flash > 0 && from !== undefined && from > n;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <ellipse rx={fs * 1.4} ry={fs * 0.9} cy={-fs * 0.34} fill="url(#tRim)" opacity={0.55 + 0.4 * flash} />
      {flash > 0 && <circle cy={-fs * 0.34} r={fs * (0.6 + (1 - flash) * 1.6)} fill="none" stroke={drop ? "#FF6A6A" : "#FFFFFF"} strokeWidth={5 * s} opacity={flash} />}
      {stop > 0 && <circle cy={-fs * 0.34} r={fs * 1.3} fill="none" stroke={T.green} strokeWidth={8 * s} opacity={stop} />}
      <g transform={`translate(0,${-fs * 0.34}) scale(1,${sy}) translate(0,${fs * 0.34})`}>
        <text textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={fs} fill={drop && flash > 0.3 ? "#FFD0D0" : "#FFFFFF"} stroke="#0E1A2E" strokeWidth={fs * 0.08} paintOrder="stroke">{show}</text>
      </g>
      {drop && <text x={fs * 0.9} y={-fs * 0.8 + (1 - flash) * 30} fontFamily="Poppins" fontWeight={800} fontSize={fs * 0.45} fill="#FF6A6A" opacity={flash}>−1</text>}
    </g>
  );
};
