import React from "react";
import { H, lerp } from "./Harem";

// Kanal 3 harem kitine ek mekânlar 2 (2026-11-02, "Sütanne 1494" videosu): beşik, Trabzon, rota haritası, avlu,
// sefer çadırı, Boğaz kıyısı (Beşiktaş dergâhı), cami, taht. Harem.tsx ile aynı çizgi ve palet.

// ───────── BEŞİK (sallanan) ─────────
export const Besik: React.FC<{ x: number; y: number; s?: number; t?: number; rock?: number; baby?: boolean; cry?: number; c?: string }> = ({ x, y, s = 1, t = 0, rock = 1, baby = true, cry = 0, c = H.cobalt }) => {
  const r = Math.sin(t * 2.2) * 6 * rock;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <g transform={`rotate(${r},0,-20)`}>
        <path d="M-200,-40 Q0,40 200,-40" fill="none" stroke={H.wood2} strokeWidth={14} />
        <path d="M-170,-60 L170,-60 L150,-170 L-150,-170Z" fill={H.wood} stroke={H.ln} strokeWidth={4} />
        <path d="M-150,-170 L150,-170" stroke={H.gold} strokeWidth={6} />
        <rect x={-140} y={-150} width={280} height={70} fill={c} opacity={0.8} />
        <rect x={-140} y={-150} width={280} height={70} fill="url(#hGoldDamask)" opacity={0.5} />
        <path d="M-170,-170 L-170,-240 M170,-170 L170,-240 M-170,-240 L170,-240" stroke={H.wood2} strokeWidth={10} />
        <g transform="translate(0,-240)"><line x1={0} y1={0} x2={0} y2={40} stroke={H.ln} strokeWidth={2} /><circle cy={52} r={14} fill="#2B6FD0" stroke="#FFFFFF" strokeWidth={4} /><circle cy={52} r={6} fill="#FFFFFF" /><circle cy={52} r={3} fill="#111" /></g>
        {baby && (
          <g transform="translate(-60,-176)">
            <ellipse cx={40} cy={10} rx={90} ry={34} fill="#F7F1E6" stroke={H.ln} strokeWidth={3} />
            <path d="M0,0 q40,-20 100,10" stroke="#E2D6BE" strokeWidth={4} fill="none" />
            <circle cx={-26} cy={0} r={28} fill={H.face} stroke={H.ln} strokeWidth={3} />
            {cry > 0 ? (
              <>
                <path d="M-38,-4 l8,4 l-8,4 M-12,-4 l-8,4 l8,4" stroke={H.ln} strokeWidth={2.5} fill="none" />
                <ellipse cx={-26} cy={14} rx={7} ry={6 + 3 * Math.abs(Math.sin(t * 9))} fill={H.ln} />
              </>
            ) : (
              <path d="M-36,-2 q4,4 8,0 M-22,-2 q4,4 8,0" stroke={H.ln} strokeWidth={2.5} fill="none" />
            )}
          </g>
        )}
      </g>
      {cry > 0 && [0, 1, 2].map((i) => { const p = (t * 1.2 + i / 3) % 1; return <path key={i} d={`M${-140 - p * 60},${-260 - p * 40} q-20,20 0,40`} stroke={H.red} strokeWidth={5} fill="none" opacity={(1 - p) * cry} />; })}
    </g>
  );
};

// ───────── TRABZON (deniz kıyısı, surlar) ─────────
export const Trabzon: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => {
  const n = night > 0.5;
  const wall = n ? "#4A5470" : "#C9B48A";
  return (
    <g>
      <rect width={1920} height={1080} fill={n ? "#1C2440" : "#BFE1F2"} />
      {n && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 420} r={2 + (i % 3)} fill="#FFFFFF" opacity={0.5 + 0.4 * Math.sin(t * 2 + i)} />)}
      <path d="M0,520 C300,380 520,420 760,300 C980,200 1200,280 1420,240 C1640,200 1800,300 1920,280 L1920,700 L0,700Z" fill={n ? "#2B3A55" : "#7E9A6E"} />
      <path d="M0,600 C400,520 800,560 1200,500 C1500,460 1700,520 1920,480 L1920,760 L0,760Z" fill={n ? "#33465F" : "#9AB27E"} />
      <g transform="translate(1100,640)">
        <path d="M-460,40 L-460,-120 L-380,-120 L-380,-160 L-320,-160 L-320,-120 L-120,-120 L-120,-200 L-40,-200 L-40,-120 L200,-120 L200,-170 L270,-170 L270,-120 L420,-120 L420,40Z" fill={wall} stroke={H.ln} strokeWidth={4} />
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-460 + i * 40} y={-136} width={22} height={16} fill={wall} stroke={H.ln} strokeWidth={2} />)}
        {[-300, -100, 100, 300].map((x, i) => <rect key={i} x={x - 16} y={-80} width={32} height={46} rx={16} fill={n ? "#FFD27A" : "#5E4630"} opacity={n ? 0.6 + 0.4 * Math.sin(t * 3 + i) : 1} />)}
      </g>
      <rect y={720} width={1920} height={360} fill={n ? "#1E2E4E" : "#3E8FC4"} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${((i * 260 + t * 40) % 2100) - 100},${780 + (i % 4) * 70} q30,-14 60,0 q30,14 60,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.5} />)}
      <g transform={`translate(${400 + Math.sin(t * 0.5) * 20},${820 + Math.sin(t * 2) * 5})`}>
        <path d="M-80,0 L80,0 L60,30 L-60,30Z" fill={H.wood} stroke={H.ln} strokeWidth={3} />
        <path d="M0,0 V-110" stroke={H.wood2} strokeWidth={6} />
        <path d="M3,-106 Q70,-60 5,-12Z" fill={H.cream} stroke={H.ln} strokeWidth={2.5} />
      </g>
    </g>
  );
};

// ───────── ROTA HARİTASI (Karadeniz + Anadolu, noktalar) ─────────
export const RotaHarita: React.FC<{ t: number; pts: { x: number; y: number; n: string }[]; k: number }> = ({ t, pts, k }) => {
  const seg = Math.max(1, pts.length - 1);
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DDC2" />
      <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.25} />
      <path d="M380,330 C560,250 900,240 1200,260 C1420,270 1600,300 1700,380 C1740,450 1660,520 1560,540 C1360,580 1000,570 760,560 C600,550 470,520 420,460 C380,410 350,370 380,330Z" fill="#9CC7DE" stroke={H.ln} strokeWidth={4} />
      <path d="M700,200 C760,170 860,170 900,210 C880,250 780,260 720,240Z" fill="#E9DDC2" stroke={H.ln} strokeWidth={3} />
      <path d="M200,640 C400,600 700,620 1000,600 C1300,590 1600,610 1800,580 L1800,980 C1400,1000 800,1000 200,960Z" fill="#DCC9A0" stroke={H.ln} strokeWidth={3} opacity={0.7} />
      <path d="M140,900 C200,980 240,1040 300,1080 L0,1080 L0,900Z" fill="#9CC7DE" />
      <text x={1050} y={420} textAnchor="middle" fontFamily="Patrick Hand" fontSize={64} fill="#4E7FA0" opacity={0.8}>Karadeniz</text>
      <text x={1000} y={820} textAnchor="middle" fontFamily="Patrick Hand" fontSize={64} fill="#8A6A3A" opacity={0.6}>Anadolu</text>
      {pts.map((p, i) => {
        if (i === 0) return null;
        const q = pts[i - 1];
        const kk = Math.max(0, Math.min(1, k * seg - (i - 1)));
        return <path key={i} d={`M${q.x},${q.y} L${lerp(q.x, p.x, kk)},${lerp(q.y, p.y, kk)}`} stroke={H.red} strokeWidth={10} strokeDasharray="20 14" strokeLinecap="round" />;
      })}
      {pts.map((p, i) => {
        const on = k * seg >= i - 0.05;
        return (
          <g key={i} opacity={on ? 1 : 0.35}>
            <circle cx={p.x} cy={p.y} r={on ? 20 + Math.sin(t * 5) * 3 : 14} fill={H.cobalt} stroke="#FFFFFF" strokeWidth={6} />
            <text x={p.x} y={p.y - 40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill={H.black}>{p.n}</text>
          </g>
        );
      })}
    </g>
  );
};

// ───────── AVLU (saray bahçesi, selvi, havuz) ─────────
export const Avlu: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk > 0.5 ? "#E8B07A" : "#BFE1F2"} />
    <rect y={380} width={1920} height={320} fill="#ECE3D0" stroke={H.ln} strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <path d={`M${60 + i * 220},700 L${60 + i * 220},500 A80,70 0 0 1 ${220 + i * 220},500 L${220 + i * 220},700Z`} fill="#C9B48A" stroke={H.ln} strokeWidth={3} />
        <rect x={40 + i * 220} y={470} width={20} height={230} fill="#F3ECDD" stroke={H.ln} strokeWidth={2} />
      </g>
    ))}
    <path d="M0,380 L1920,380 L1920,340 L0,340Z" fill="#9AA7B0" stroke={H.ln} strokeWidth={3} />
    <rect y={700} width={1920} height={380} fill="#AFBE8C" />
    <path d="M400,1080 L800,700 L1120,700 L1520,1080Z" fill="#D8C7A4" />
    <ellipse cx={960} cy={860} rx={260} ry={60} fill="#9CC7DE" stroke={H.ln} strokeWidth={4} />
    <path d="M960,860 v-60" stroke="#CFEAF6" strokeWidth={8} opacity={0.6 + 0.3 * Math.sin(t * 20)} />
    {[160, 1760].map((x, i) => <path key={i} d={`M${x},900 C${x - 60},720 ${x - 36},480 ${x},380 C${x + 36},480 ${x + 60},720 ${x},900Z`} fill="#2F5D3A" stroke={H.ln} strokeWidth={3} transform={`rotate(${Math.sin(t + i) * 1.5},${x},900)`} />)}
  </g>
);

// ───────── ÇADIR (sefer otağı) ─────────
export const Cadir: React.FC<{ t: number; night?: number }> = ({ t, night = 0.6 }) => {
  const n = night > 0.5;
  return (
    <g>
      <rect width={1920} height={1080} fill={n ? "#2A2440" : "#D9B98A"} />
      <rect y={700} width={1920} height={380} fill={n ? "#3A3048" : "#B89A6A"} />
      {[260, 1660].map((x, i) => <g key={i} transform={`translate(${x},720) scale(0.6)`} opacity={0.6}><path d="M-200,0 L0,-260 L200,0Z" fill="#E9DDC2" stroke={H.ln} strokeWidth={4} /></g>)}
      <g transform="translate(960,760)">
        <path d="M-460,0 L-300,-380 Q0,-470 300,-380 L460,0Z" fill="#EFE3C8" stroke={H.ln} strokeWidth={5} />
        <path d="M-300,-380 Q0,-470 300,-380 L320,-330 Q0,-410 -320,-330Z" fill={H.red} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-400 + i * 100},-60 l40,-60 l40,60Z`} fill={H.cobalt} opacity={0.8} />)}
        <path d="M-120,0 L-60,-260 L60,-260 L120,0Z" fill={n ? "#FFD98A" : "#8A5A34"} opacity={n ? 0.6 + 0.2 * Math.sin(t * 4) : 1} />
        <path d="M0,-450 V-560" stroke={H.wood2} strokeWidth={8} />
        <path d="M4,-556 L80,-530 L4,-506Z" fill={H.red} />
      </g>
      {n && <rect width={1920} height={1080} fill="#14182E" opacity={0.25} />}
    </g>
  );
};

// ───────── BOĞAZ KIYISI (Beşiktaş dergâhı) ─────────
export const Bogaz: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0.3 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk > 0.5 ? "#E8A06A" : "#BFE1F2"} />
    <path d="M0,420 C400,360 800,400 1200,360 C1500,330 1700,380 1920,360 L1920,520 L0,520Z" fill="#8FA88A" />
    {[300, 700, 1200].map((x, i) => <g key={i} transform={`translate(${x},430)`} opacity={0.7}><rect x={-30} y={-30} width={60} height={40} fill="#E9D5B4" /><path d="M-36,-30 L0,-56 L36,-30Z" fill="#9A5526" /></g>)}
    <rect y={500} width={1920} height={300} fill="#3E8FC4" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 230 + t * 30) % 2100) - 100},${540 + (i % 4) * 60} q30,-12 60,0 q30,12 60,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.5} />)}
    <rect y={780} width={1920} height={300} fill="#CFC09C" />
    <g transform="translate(1300,800)">
      <rect x={-260} y={-260} width={520} height={260} fill="#F1E8D6" stroke={H.ln} strokeWidth={4} />
      <path d="M-300,-260 L0,-380 L300,-260Z" fill="#9A5526" stroke={H.ln} strokeWidth={4} />
      {[-160, 0, 160].map((x) => <path key={x} d={`M${x - 46},-40 L${x - 46},-170 A46,46 0 0 1 ${x + 46},-170 L${x + 46},-40Z`} fill="url(#hHoney)" stroke={H.wood2} strokeWidth={5} />)}
      <g transform="translate(-420,0)"><rect x={-110} y={-200} width={220} height={200} fill="#ECE3D0" stroke={H.ln} strokeWidth={4} /><path d="M-110,-200 A110,90 0 0 1 110,-200Z" fill="#8E9AA6" stroke={H.ln} strokeWidth={4} /></g>
    </g>
    {[200, 520].map((x, i) => <path key={i} d={`M${x},880 C${x - 50},720 ${x - 30},520 ${x},430 C${x + 30},520 ${x + 50},720 ${x},880Z`} fill="#2F5D3A" stroke={H.ln} strokeWidth={3} transform={`rotate(${Math.sin(t + i) * 1.5},${x},880)`} />)}
    {dusk > 0.5 && <rect width={1920} height={1080} fill="#7A3E1A" opacity={0.12} />}
  </g>
);

// ───────── CAMİ (küçük mahalle camisi) ─────────
export const Cami: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE1F2" />
    <rect y={800} width={1920} height={280} fill="#CFC09C" />
    <g transform={`translate(960,820) scale(${0.8 + 0.2 * k})`} opacity={k}>
      <rect x={-340} y={-300} width={680} height={300} fill="#ECE3D0" stroke={H.ln} strokeWidth={4} />
      <path d="M-280,-300 A280,240 0 0 1 280,-300Z" fill="#8E9AA6" stroke={H.ln} strokeWidth={4} />
      <path d="M0,-540 v-40" stroke={H.gold} strokeWidth={8} />
      <rect x={400} y={-640} width={60} height={640} fill="#ECE3D0" stroke={H.ln} strokeWidth={4} />
      <path d="M396,-640 L430,-760 L464,-640Z" fill="#8E9AA6" stroke={H.ln} strokeWidth={4} />
      <rect x={390} y={-470} width={80} height={20} fill="#D8C7A6" stroke={H.ln} strokeWidth={3} />
      {[-200, 0, 200].map((x) => <path key={x} d={`M${x - 50},-40 L${x - 50},-180 A50,50 0 0 1 ${x + 50},-180 L${x + 50},-40Z`} fill="#4C6A86" stroke={H.ln} strokeWidth={3} />)}
    </g>
    {[200, 1720].map((x, i) => <path key={i} d={`M${x},860 C${x - 50},700 ${x - 30},480 ${x},390 C${x + 30},480 ${x + 50},700 ${x},860Z`} fill="#2F5D3A" stroke={H.ln} strokeWidth={3} transform={`rotate(${Math.sin(t + i) * 1.5},${x},860)`} />)}
  </g>
);

// ───────── TAHT ─────────
export const Taht: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 960, y = 990, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-220} y={-200} width={440} height={200} fill={H.gold} stroke={H.ln} strokeWidth={4} />
    <rect x={-220} y={-200} width={440} height={200} fill="url(#hDamask)" opacity={0.4} />
    <rect x={-190} y={-440} width={380} height={260} rx={24} fill="#B8322E" stroke={H.ln} strokeWidth={4} />
    <rect x={-190} y={-440} width={380} height={260} rx={24} fill="url(#hGoldDamask)" />
    <path d="M-240,-200 L-240,-500 M240,-200 L240,-500" stroke={H.gold} strokeWidth={16} />
    <path d="M-260,-500 Q0,-600 260,-500" stroke={H.gold} strokeWidth={16} fill="none" />
  </g>
);
