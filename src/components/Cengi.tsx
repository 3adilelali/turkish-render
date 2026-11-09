import React from "react";
import { H, HFig, HTiny, ROBES, Sedir } from "./Harem";

// Kanal 3 · k3r-09 "Çengi" kiti: dönen dansçı, zilli maşa, tef, mumlu harem salonu, usul kartı, 1720 şenliği, Sadabad lale bahçesi (mumlu kaplumbağalar), Levni minyatürü, zil sandığı.
const cl = (x: number) => Math.max(0, Math.min(1, x));
const md = (a: number, m: number) => ((a % m) + m) % m;
const LN = "#3A2A1A";

/** zilli maşa (parmak zili çifti) */
export const Zil: React.FC<{ x: number; y: number; s?: number; t?: number; gold?: boolean; ring?: number }> = ({ x, y, s = 1, t = 0, gold = false, ring = 0 }) => {
  const c = gold ? "#F2C94C" : "#C9A86A";
  const g = Math.abs(Math.sin(t * 9)) * 10 * (ring ? 1 : 0.3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * (24 + g)},0) rotate(${d * 12})`}>
          <ellipse rx={34} ry={34} fill={c} stroke={LN} strokeWidth={4} />
          <ellipse rx={14} ry={14} fill={gold ? "#FFE89A" : "#E6CC94"} stroke={LN} strokeWidth={3} />
          <path d="M-20,-20 Q0,-28 20,-20" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.6} />
        </g>
      ))}
      {ring > 0 && [0, 1, 2].map((i) => { const f = md(t * 2 + i / 3, 1); return <circle key={i} r={40 + f * 90} fill="none" stroke={c} strokeWidth={5 * (1 - f)} opacity={(1 - f) * ring} />; })}
    </g>
  );
};

/** tef (def): halkalı çerçeve davul */
export const Tef: React.FC<{ x: number; y: number; s?: number; t?: number; hit?: number }> = ({ x, y, s = 1, t = 0, hit = 0 }) => {
  const k = hit ? Math.max(0, Math.sin(t * 6)) : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (1 + k * 0.04)})`}>
      <circle r={110} fill="#E9D6B0" stroke="#8A5A2A" strokeWidth={18} />
      <circle r={110} fill="none" stroke={LN} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`rotate(${i * 60}) translate(110,0)`}><rect x={-14} y={-10} width={28} height={20} fill="#8A5A2A" /><circle cx={-6} r={8} fill="#C9A86A" /><circle cx={6} r={8} fill="#C9A86A" /></g>)}
      {k > 0.5 && <circle r={60 + k * 30} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={k * 0.6} />}
    </g>
  );
};

/** dönen çengi: HFig + savrulan etek + kaldırılmış kollarda zil. spin: tur sayısı (0..∞) */
export const Dansci: React.FC<{ x: number; y: number; s?: number; t: number; spin?: number; robe?: string; robe2?: string; face?: "normal" | "smile" | "sad" | "worried" | "shock" | "closed"; seed?: number; zil?: boolean; fire?: number; op?: number; old?: boolean }> = ({ x, y, s = 1, t, spin = 0, robe = "#C2477A", robe2 = "#F5E8CC", face = "smile", seed = 0, zil = true, fire = 0, op = 1, old = false }) => {
  const sx = Math.cos(spin * Math.PI * 2);
  const flare = Math.abs(Math.sin(spin * Math.PI * 2)) * 0.5 + (spin > 0 ? 0.5 : 0);
  const sway = Math.sin(t * 3 + seed) * 4;
  return (
    <g opacity={op}>
      {/* savrulan etek */}
      <g transform={`translate(${x},${y - 230 * s})`}>
        <path d={`M${-90 * s},0 Q${-(160 + 120 * flare) * s},${120 * s} ${-(140 + 160 * flare) * s},${230 * s} L${(140 + 160 * flare) * s},${230 * s} Q${(160 + 120 * flare) * s},${120 * s} ${90 * s},0Z`} fill={robe} stroke={LN} strokeWidth={5} opacity={0.95} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${(-60 + i * 20) * s},${10 * s} Q${(-150 + i * 50) * flare * s + (-60 + i * 20) * s * (1 - flare)},${140 * s} ${(-(140 + 160 * flare) + i * (280 + 320 * flare) / 6) * s},${228 * s}`} stroke={robe2} strokeWidth={4} fill="none" opacity={0.55} />)}
        <path d={`M${-(140 + 160 * flare) * s},${226 * s} L${(140 + 160 * flare) * s},${226 * s}`} stroke="#F2C94C" strokeWidth={10 * s} />
        {fire > 0 && <g transform={`translate(${(130 + 150 * flare) * s},${200 * s})`} opacity={fire}><path d={`M0,0 C-20,-40 10,-60 0,-${90 + Math.sin(t * 20) * 14} C20,-60 30,-30 0,0Z`} fill="#FF9A2A" /><path d="M0,0 C-8,-20 6,-34 0,-50 C10,-30 12,-16 0,0Z" fill="#FFE07A" /></g>}
      </g>
      <g transform={`translate(${x},${y + sway * 0}) scale(${sx < 0 ? -1 : 1},1) translate(${-x},0)`}>
        <HFig x={x} y={y} s={s} kind="girl" robe={robe} robe2={robe2} t={t} face={face} seed={seed} old={old} hands="down" />
      </g>
      {/* kollar yukarı + ziller */}
      {[-1, 1].map((d) => {
        const ax = x + d * 70 * s * Math.abs(sx) + d * 20 * s, ay = y - 360 * s;
        const hx = x + d * (150 + Math.sin(t * 4 + d) * 20) * s * (0.5 + 0.5 * Math.abs(sx)), hy = y - (520 + Math.cos(t * 4 + d) * 30) * s;
        return <g key={d}><path d={`M${ax},${ay} Q${ax + d * 60 * s},${ay - 80 * s} ${hx},${hy}`} stroke={robe} strokeWidth={26 * s} fill="none" strokeLinecap="round" /><circle cx={hx} cy={hy} r={16 * s} fill="#FBE7D2" stroke={LN} strokeWidth={3} />{zil && <Zil x={hx} y={hy - 10 * s} s={0.45 * s} t={t} ring={spin > 0 ? 0.6 : 0} />}</g>;
      })}
    </g>
  );
};

/** mumlu harem salonu: yüzlerce mum, sedirlerde sultanlar, ortada halı */
export const MumSalon: React.FC<{ t: number; lit?: number; ladies?: number; carpet?: boolean; valide?: boolean }> = ({ t, lit = 1, ladies = 1, carpet = true, valide = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1C1C" />
    <rect width={1920} height={620} fill="#3A2626" />
    {/* çini kuşak + kemerler */}
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${160 + i * 320},120)`}><path d="M-120,420 V120 Q-120,0 0,-40 Q120,0 120,120 V420Z" fill="#1E2A44" stroke="#C9A86A" strokeWidth={6} /><path d="M-90,400 V140 Q-90,40 0,10 Q90,40 90,140 V400Z" fill="#26365A" />{Array.from({ length: 4 }, (_, j) => <circle key={j} cx={0} cy={120 + j * 70} r={18} fill="#2B6FA8" stroke="#E9D6B0" strokeWidth={3} />)}</g>)}
    <rect y={560} width={1920} height={60} fill="#1E5A8A" /><rect y={560} width={1920} height={60} fill="url(#hTile)" opacity={0.6} />
    {/* zemin + halı */}
    <rect y={620} width={1920} height={460} fill="#5A3A2A" />
    {carpet && <g><path d="M420,700 L1500,700 L1720,1080 L200,1080Z" fill="#8E2F2A" stroke="#F2C94C" strokeWidth={8} /><path d="M520,740 L1400,740 L1580,1060 L340,1060Z" fill="none" stroke="#E9D6B0" strokeWidth={5} /><ellipse cx={960} cy={890} rx={260} ry={90} fill="#B8452F" stroke="#F2C94C" strokeWidth={5} /></g>}
    {/* sedirler + kadınlar */}
    <Sedir x={260} y={760} w={420} c="#6A2A3A" /><Sedir x={1660} y={760} w={420} c="#6A2A3A" />
    {ladies > 0 && <>
      {[0, 1].map((i) => <HFig key={`l${i}`} x={170 + i * 170} y={800} s={0.6} kind="girl" robe={ROBES[i + 1]} t={t} sit seed={i} face="smile" look={0.6} />)}
      {[0, 1].map((i) => <HFig key={`r${i}`} x={1580 + i * 170} y={800} s={0.6} kind="girl" robe={ROBES[i + 4]} t={t} sit seed={i + 3} face="smile" look={-0.6} />)}
      {valide && <><Sedir x={960} y={640} w={380} c="#8E2F2A" /><HFig x={960} y={680} s={0.62} kind="valide" robe={H.crimson} robe2="#E9C37A" old t={t} sit seed={7} face="normal" /></>}
    </>}
    {/* mumlar */}
    {Array.from({ length: 26 }, (_, i) => {
      const x = 60 + i * 74, y = i % 2 ? 610 : 640;
      const f = Math.sin(t * 13 + i * 2.1);
      return <g key={i} opacity={lit}><rect x={x - 7} y={y - 46} width={14} height={46} fill="#F5EBD0" /><path d={`M${x},${y - 72 - f * 4} C${x - 8},${y - 58} ${x - 6},${y - 48} ${x},${y - 46} C${x + 6},${y - 48} ${x + 8},${y - 58} ${x},${y - 72 - f * 4}Z`} fill="#FFD27A" /><circle cx={x} cy={y - 58} r={34} fill="#FFD27A" opacity={0.13} /></g>;
    })}
    <rect width={1920} height={1080} fill="#FFB34A" opacity={0.06 * lit} />
  </g>
);

/** usul kartı: DÜM tek tek — sırayla yanan vuruşlar */
export const Usul: React.FC<{ t: number; a: number; beats?: string[]; bpm?: number; x?: number; y?: number; s?: number; dark?: boolean }> = ({ t, a, beats = ["DÜM", "tek", "tek", "DÜM", "tek"], bpm = 110, x = 960, y = 540, s = 1, dark = true }) => {
  const step = 60 / bpm;
  const cur = Math.floor(Math.max(0, t - a) / step) % beats.length;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-760} y={-180} width={1520} height={360} rx={40} fill={dark ? "#1E1626" : "#FBF2DE"} stroke="#C9A86A" strokeWidth={8} />
      {beats.map((b, i) => {
        const on = i === cur && t >= a;
        const big = b.toUpperCase() === b;
        return <g key={i} transform={`translate(${(i - (beats.length - 1) / 2) * 290},0) scale(${on ? 1.18 : 1})`}><circle r={big ? 110 : 80} fill={on ? (big ? "#C2477A" : "#2FA3A0") : dark ? "#3A2E42" : "#EADBC0"} stroke={LN} strokeWidth={5} /><text y={big ? 22 : 16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={big ? 62 : 44} fill={on ? "#FFFFFF" : dark ? "#9A8AA8" : "#8A7A5A"}>{b}</text></g>;
      })}
    </g>
  );
};

/** değnek (çengibaşının sopası) */
export const Degnek: React.FC<{ x: number; y: number; s?: number; hit?: number }> = ({ x, y, s = 1, hit = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${-40 + hit * 50}) scale(${s})`}><rect x={-6} y={-260} width={12} height={260} rx={6} fill="#7A4A24" stroke={LN} strokeWidth={3} /><circle cy={-262} r={12} fill="#C9A86A" /></g>
);

/** 1720 şenliği: Haliç gece, çadırlar, kayıklar, havai fişek */
export const Senlik: React.FC<{ t: number; k?: number; fw?: number; tents?: boolean }> = ({ t, k = 1, fw = 1, tents = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#141A36" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 73) % 420} r={2} fill="#FFFFFF" opacity={0.5} />)}
    {/* silüet: camiler */}
    <g fill="#0E1226">{[260, 760, 1260, 1700].map((x, i) => <g key={i}><rect x={x - 120} y={430} width={240} height={140} /><path d={`M${x - 110},430 Q${x},${330 - i * 6} ${x + 110},430Z`} />{[-150, 150].map((d) => <rect key={d} x={x + d - 8} y={300} width={16} height={270} />)}</g>)}</g>
    <rect y={570} width={1920} height={240} fill="#1E2A54" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={md(i * 170 - t * 30, 2100) - 100} y={600 + (i % 4) * 46} width={90} height={5} rx={3} fill="#FFD27A" opacity={0.35} />)}
    {/* kayıklar */}
    {[0, 1, 2].map((i) => { const bx = md(300 + i * 640 + t * 40 * (i % 2 ? -1 : 1), 2200) - 140; return <g key={i} transform={`translate(${bx},${690 + i * 30 + Math.sin(t * 2 + i) * 6})`}><path d="M-120,0 L120,0 L90,36 L-90,36Z" fill="#7A4A24" stroke="#F2C94C" strokeWidth={3} /><rect x={-4} y={-90} width={8} height={90} fill="#5A3A1A" /><circle cy={-96} r={12} fill="#FFD27A" /></g>; })}
    {/* kıyı + çadırlar */}
    <rect y={810} width={1920} height={270} fill="#3A2E24" />
    {tents && Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${160 + i * 320},${880 + (i % 2) * 30})`}><path d="M-120,90 L0,-80 L120,90Z" fill={["#B8452F", "#E9D6B0", "#2B6FA8"][i % 3]} stroke={LN} strokeWidth={4} /><path d="M0,-80 V90" stroke={LN} strokeWidth={3} /><path d="M-30,90 L0,10 L30,90Z" fill="#FFD27A" opacity={0.6} /><circle cy={-84} r={8} fill="#F2C94C" /></g>)}
    {/* havai fişek */}
    {fw > 0 && [0, 1, 2, 3].map((i) => {
      const f = md(t * 0.55 + i * 0.27, 1);
      const cx = 300 + i * 440, cy = 140 + (i % 2) * 90;
      const c = ["#FFD27A", "#E86A92", "#7FE0D4", "#FFFFFF"][i];
      return <g key={i} opacity={cl((1 - f) * 1.4) * fw * k}>{f < 0.25 ? <path d={`M${cx},${560} L${cx},${560 - (560 - cy) * (f / 0.25)}`} stroke={c} strokeWidth={4} /> : Array.from({ length: 14 }, (_, j) => { const ang = (j / 14) * Math.PI * 2; const r = (f - 0.25) * 340; return <circle key={j} cx={cx + Math.cos(ang) * r} cy={cy + Math.sin(ang) * r + (f - 0.25) * 60} r={6} fill={c} />; })}</g>;
    })}
  </g>
);

/** şekerden bahçe (nahıl ve şeker ağaçları) */
export const SekerBahce: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#F5E8CC" />
    <rect y={760} width={1920} height={320} fill="#C9A86A" />
    {Array.from({ length: 5 }, (_, i) => (
      <g key={i} transform={`translate(${260 + i * 350},${800 - (i % 2) * 30})`}>
        <ellipse cy={20} rx={150} ry={34} fill="#E9D6B0" stroke={LN} strokeWidth={4} />
        <rect x={-10} y={-300} width={20} height={320} fill="#FFFFFF" stroke="#E0C9A0" strokeWidth={3} />
        {Array.from({ length: 9 }, (_, j) => <circle key={j} cx={Math.cos(j * 0.7) * (40 + j * 8)} cy={-300 + j * 30} r={22 - j} fill={["#E86A92", "#FFFFFF", "#7FE0D4", "#F2C94C"][(i + j) % 4]} stroke={LN} strokeWidth={2} transform={`rotate(${Math.sin(t + j) * 3})`} />)}
        <path d="M-60,-120 Q0,-180 60,-120" stroke="#F2C94C" strokeWidth={6} fill="none" />
      </g>
    ))}
    {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={(i * 97) % 1920} cy={md(i * 53 + t * 40, 760)} r={4} fill="#FFFFFF" opacity={0.6} />)}
  </g>
);

/** Sadabad: gece lale bahçesi, mumlu kaplumbağalar, köşk ve havuz */
export const Sadabad: React.FC<{ t: number; turtles?: number; night?: number; ruin?: number }> = ({ t, turtles = 1, night = 1, ruin = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#16203E" : "#BFE3F2"} />
    {night > 0 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 173) % 1920} cy={(i * 61) % 360} r={2} fill="#FFFFFF" opacity={0.6} />)}
    {/* köşk */}
    <g transform="translate(960,420)" opacity={1 - ruin * 0.5}>
      <rect x={-380} y={-40} width={760} height={200} fill="#E9D6B0" stroke={LN} strokeWidth={5} />
      <path d="M-420,-40 L0,-170 L420,-40Z" fill={ruin ? "#5A4A3A" : "#8E2F2A"} stroke={LN} strokeWidth={5} />
      {Array.from({ length: 7 }, (_, i) => <g key={i}><rect x={-340 + i * 110} y={0} width={60} height={110} rx={30} fill={night && !ruin ? "#FFD27A" : "#5A6A7A"} opacity={0.85} /></g>)}
      {ruin > 0 && <path d="M-200,-40 L-120,60 L-60,-20 L40,80" stroke="#1C1C1C" strokeWidth={6} fill="none" />}
    </g>
    {/* havuz */}
    <rect x={560} y={600} width={800} height={120} rx={20} fill="#2B5DA8" stroke="#C9A86A" strokeWidth={6} />
    <rect x={560} y={600} width={800} height={120} rx={20} fill="#FFD27A" opacity={night ? 0.12 : 0} />
    <rect y={720} width={1920} height={360} fill={night ? "#1E3A26" : "#4E9A4A"} />
    {/* laleler */}
    {Array.from({ length: 34 }, (_, i) => {
      const x = 40 + i * 56, y = 820 + (i % 3) * 70;
      const c = ["#E0393E", "#F2C94C", "#E86A92", "#FFFFFF", "#7A3AA0"][i % 5];
      return <g key={i} transform={`translate(${x},${y}) rotate(${Math.sin(t * 1.4 + i) * 4})`} opacity={1 - ruin * 0.8}><path d="M0,0 V-70" stroke="#3E8E4A" strokeWidth={5} /><path d="M0,-30 Q-26,-50 -20,-70" stroke="#3E8E4A" strokeWidth={8} fill="none" /><path d="M-16,-70 C-18,-100 -8,-110 0,-96 C8,-110 18,-100 16,-70 Q0,-60 -16,-70Z" fill={c} stroke={LN} strokeWidth={2.5} /></g>;
    })}
    {/* mumlu kaplumbağalar */}
    {turtles > 0 && Array.from({ length: 5 }, (_, i) => {
      const x = md(160 + i * 420 + t * 14, 2100) - 100, y = 880 + (i % 2) * 110;
      const f = Math.sin(t * 12 + i);
      return <g key={i} transform={`translate(${x},${y})`} opacity={turtles}><ellipse rx={56} ry={30} fill="#5A6A3A" stroke={LN} strokeWidth={4} /><path d="M-40,-6 Q0,-46 40,-6" fill="#6E7E44" stroke={LN} strokeWidth={3} /><circle cx={60} cy={4} r={12} fill="#7A8A4A" stroke={LN} strokeWidth={3} /><rect x={-7} y={-74} width={14} height={40} fill="#F5EBD0" /><path d={`M0,${-96 - f * 3} C-7,-84 -5,-76 0,-74 C5,-76 7,-84 0,${-96 - f * 3}Z`} fill="#FFD27A" /><circle cy={-84} r={44} fill="#FFD27A" opacity={0.16} /></g>;
    })}
  </g>
);

/** Levni minyatürü (Surname-i Vehbi tarzı sayfa): çerçeve, düz perspektif, küçük figürler */
export const Levni: React.FC<{ t: number; k?: number; zoom?: boolean }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1E1A" />
    <g transform={`translate(960,540) scale(${0.85 + 0.15 * k})`} opacity={cl(k * 2)}>
      <rect x={-560} y={-470} width={1120} height={940} fill="#E9D6B0" stroke="#8A5A2A" strokeWidth={10} />
      <rect x={-520} y={-430} width={1040} height={860} fill="#F5EBD0" stroke="#B8452F" strokeWidth={6} />
      <rect x={-500} y={-410} width={1000} height={260} fill="#A8C8A0" />
      {[-300, 0, 300].map((x, i) => <g key={i}><path d={`M${x - 90},-150 L${x},-260 L${x + 90},-150Z`} fill={["#B8452F", "#2B6FA8", "#C9A86A"][i]} stroke={LN} strokeWidth={3} /></g>)}
      <rect x={-500} y={-150} width={1000} height={560} fill="#D9C08A" />
      {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${-320 + i * 160},${120 + (i % 2) * 40})`}><path d={`M-26,0 Q-48,${-60} 0,-110 Q48,${-60} 26,0Z`} fill={["#C2477A", "#2FA3A0", "#F2C94C", "#7A3AA0", "#E0393E"][i]} stroke={LN} strokeWidth={3} transform={`rotate(${Math.sin(t * 2 + i) * 8})`} /><circle cy={-128} r={18} fill="#FBE7D2" stroke={LN} strokeWidth={2} /><circle cx={-30} cy={-120} r={8} fill="#C9A86A" /><circle cx={30} cy={-120} r={8} fill="#C9A86A" /></g>)}
      {Array.from({ length: 6 }, (_, i) => <HTiny key={i} x={-380 + i * 150} y={360} s={1.6} c={ROBES[i % 8]} />)}
      <rect x={-500} y={-430} width={1000} height={40} fill="#8A5A2A" /><text y={-400} textAnchor="middle" fontFamily="serif" fontSize={30} fill="#F2C94C">سورنامهٔ وهبی</text>
    </g>
  </g>
);

/** zil sandığı: kapak kapanır */
export const Sandik: React.FC<{ x: number; y: number; s?: number; open?: number; t?: number; gold?: boolean }> = ({ x, y, s = 1, open = 1, t = 0, gold = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-160} width={520} height={200} rx={14} fill="#7A4A24" stroke={LN} strokeWidth={6} />
    {[-180, 0, 180].map((d) => <rect key={d} x={d - 14} y={-160} width={28} height={200} fill="#C9A86A" />)}
    {open > 0.2 && <>{[-120, -40, 40, 120].map((d, i) => <Zil key={i} x={d} y={-170} s={0.5} t={t} gold={gold && i === 3} />)}</>}
    <g transform={`translate(0,-160) rotate(${-110 * open} -260 0)`}><rect x={-260} y={-60} width={520} height={60} rx={14} fill="#8A5A2A" stroke={LN} strokeWidth={6} /><circle cx={0} cy={-30} r={14} fill="#F2C94C" /></g>
  </g>
);

/** küçük not kâğıdı */
export const Not: React.FC<{ x: number; y: number; s?: number; text: string; k?: number }> = ({ x, y, s = 1, text, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (0.6 + 0.4 * k)}) rotate(-4)`} opacity={k}>
    <rect x={-260} y={-90} width={520} height={180} fill="#FFFAEE" stroke={LN} strokeWidth={4} />
    <text y={16} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={48} fill={LN}>{text}</text>
  </g>
);
