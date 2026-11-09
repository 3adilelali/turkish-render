import React from "react";
import { H, HFig, HTiny, Lantern, ArchWindow, lerp } from "./Harem";

// Kanal 3 harem kitine ek mekânlar (2026-11-02, "1651 gecesi" videosu): koğuş, çeşme, ders, sofra, daire kapısı,
// perde arkası bakış, harem merdiveni, Osmanlı saati, akçe, deniz yolu, türbe, kapalı çarşı, çınar meydanı, çıkış kapısı.
// Hepsi Harem.tsx ile aynı çizgi (H paleti, 3.5 kalınlık, krem sıva, İznik çini). 1920×1080 sahne koordinatları.

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

// ───────── küçük nesneler ─────────
export const Kandil: React.FC<{ x: number; y: number; s?: number; t?: number; on?: number }> = ({ x, y, s = 1, t = 0, on = 1 }) => {
  const f = 0.8 + 0.2 * Math.sin(t * 11 + x) * Math.sin(t * 4.1 + y);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {on > 0 && <ellipse cx={0} cy={-40} rx={180} ry={160} fill="url(#hGlow)" opacity={0.6 * on * f} />}
      <path d="M-60,0 Q0,30 60,0 Q50,-14 0,-14 Q-50,-14 -60,0Z" fill="#C8763A" stroke={H.ln} strokeWidth={3} />
      <path d="M55,-4 q30,-6 40,-22" stroke="#9A5526" strokeWidth={8} fill="none" strokeLinecap="round" />
      {on > 0 && <path d={`M-62,-6 q-8,${-30 * f} 4,${-50 * f} q8,${20 * f} -4,${50 * f}Z`} fill="#FFC955" opacity={on} />}
    </g>
  );
};

export const Testi: React.FC<{ x: number; y: number; s?: number; tilt?: number }> = ({ x, y, s = 1, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
    <path d="M-50,0 C-90,-20 -96,-100 -60,-140 L-30,-170 L-34,-200 L34,-200 L30,-170 L60,-140 C96,-100 90,-20 50,0Z" fill="#C8763A" stroke={H.ln} strokeWidth={4} />
    <path d="M-80,-90 Q0,-70 80,-90 M-70,-50 Q0,-34 70,-50" stroke="#E7A266" strokeWidth={6} fill="none" />
    <path d="M58,-150 q60,10 46,80" stroke="#9A5526" strokeWidth={10} fill="none" />
    <ellipse cx={0} cy={-200} rx={34} ry={8} fill="#7A3E1A" />
  </g>
);

export const Akce: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 40, spin = 0 }) => {
  const sx = Math.max(0.12, Math.abs(Math.cos(spin)));
  return (
    <g transform={`translate(${x},${y}) scale(${sx},1)`}>
      <circle r={r} fill="#D9D9D9" stroke="#8E8E8E" strokeWidth={r * 0.12} />
      <circle r={r * 0.7} fill="none" stroke="#A9A9A9" strokeWidth={r * 0.06} />
      <path d={`M${-r * 0.35},${-r * 0.1} q${r * 0.35},${-r * 0.4} ${r * 0.7},0 M${-r * 0.3},${r * 0.2} h${r * 0.6}`} stroke="#8E8E8E" strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
    </g>
  );
};

// yer yatağı (dürülmüş ya da serili)
const Bed: React.FC<{ x: number; y: number; s?: number; rolled?: number; c?: string }> = ({ x, y, s = 1, rolled = 0, c = "#E9DCC0" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <g opacity={1 - rolled}>
      <path d="M-170,0 L170,0 L150,-46 L-150,-46Z" fill={c} stroke={H.ln} strokeWidth={3} />
      <path d="M-150,-46 L150,-46 L140,-60 L-140,-60Z" fill="#F7F1E4" stroke={H.ln} strokeWidth={2.5} />
      <path d="M-40,-46 L160,-46 L170,0 L-40,0Z" fill={H.cobalt} opacity={0.75} />
      <path d="M-40,-46 L160,-46 L170,0 L-40,0Z" fill="url(#hDamask)" opacity={0.5} />
      <ellipse cx={-110} cy={-58} rx={46} ry={16} fill="#FFFFFF" stroke={H.ln} strokeWidth={2} />
    </g>
    <g opacity={rolled}>
      <rect x={-80} y={-80} width={160} height={80} rx={40} fill={c} stroke={H.ln} strokeWidth={3} />
      <path d="M-40,-80 v80 M40,-80 v80" stroke={H.cobalt} strokeWidth={8} />
    </g>
  </g>
);

// ───────── KOĞUŞ: uzun yatakhane, perspektif ─────────
export const Kogus: React.FC<{ t: number; night?: number; rolled?: number; girls?: number; sleep?: boolean }> = ({ t, night = 0, rolled = 0, girls = 0, sleep = true }) => {
  const VX = 960, top = 330, bot = 640;
  const rows = [0.08, 0.26, 0.42, 0.56, 0.68, 0.78];
  return (
    <g>
      <rect width={1920} height={1080} fill={H.plaster} />
      <path d={`M0,0 L1920,0 L1260,${top} L660,${top}Z`} fill={H.plaster2} />
      {[0.25, 0.55].map((k) => <path key={k} d={`M${lerp(0, 660, k)},${lerp(0, top, k)} L${lerp(1920, 1260, k)},${lerp(0, top, k)}`} stroke={H.wood2} strokeWidth={18 - k * 12} />)}
      <path d={`M0,0 L660,${top} L660,${bot} L0,1080Z`} fill={H.plaster} stroke={H.ln} strokeWidth={2} />
      <path d={`M1920,0 L1260,${top} L1260,${bot} L1920,1080Z`} fill={H.plaster} stroke={H.ln} strokeWidth={2} />
      {/* dolaplar sol duvar */}
      {[0.05, 0.3, 0.52].map((k, i) => {
        const x0 = lerp(0, 660, k), x1 = lerp(0, 660, k + 0.18);
        const ya = lerp(0, top, k) + 160 * (1 - k), yb = lerp(0, top, k + 0.18) + 160 * (1 - k - 0.18);
        const ha = 420 * (1 - k * 0.55), hb = 420 * (1 - (k + 0.18) * 0.55);
        return (
          <g key={i}>
            <path d={`M${x0},${ya} L${x1},${yb} L${x1},${yb + hb} L${x0},${ya + ha}Z`} fill={H.wood} stroke={H.ln} strokeWidth={4} />
            <path d={`M${(x0 + x1) / 2},${(ya + yb) / 2} L${(x0 + x1) / 2},${(ya + yb) / 2 + (ha + hb) / 2}`} stroke={H.wood2} strokeWidth={4} />
            <path d={`M${x0 + 14},${ya + 20} L${x1 - 14},${yb + 20}`} stroke={H.gold} strokeWidth={4} />
          </g>
        );
      })}
      {/* sağ duvar: kafesli pencereler */}
      {[0.1, 0.4].map((k, i) => {
        const x0 = lerp(1920, 1260, k), x1 = lerp(1920, 1260, k + 0.16);
        const ya = lerp(0, top, k) + 150 * (1 - k), yb = lerp(0, top, k + 0.16) + 150 * (1 - k - 0.16);
        const ha = 300 * (1 - k * 0.6), hb = 300 * (1 - (k + 0.16) * 0.6);
        return (
          <g key={i}>
            <path d={`M${x0},${ya} L${x1},${yb} L${x1},${yb + hb} L${x0},${ya + ha}Z`} fill={night > 0.5 ? "#26315A" : "#F9E2A8"} stroke={H.wood2} strokeWidth={8} />
            <path d={`M${x0},${ya} L${x1},${yb} L${x1},${yb + hb} L${x0},${ya + ha}Z`} fill="url(#hHoney)" opacity={0.8} />
          </g>
        );
      })}
      <rect x={660} y={top} width={600} height={bot - top} fill={H.plaster2} stroke={H.ln} strokeWidth={3} />
      <rect x={660} y={top + 170} width={600} height={bot - top - 170} fill="url(#hTileS)" />
      <path d={`M${VX - 70},${bot} L${VX - 70},${top + 110} A70,70 0 0 1 ${VX + 70},${top + 110} L${VX + 70},${bot}Z`} fill={H.wood} stroke={H.ln} strokeWidth={4} />
      <path d={`M0,1080 L660,${bot} L1260,${bot} L1920,1080Z`} fill="url(#hMarble)" />
      {/* yataklar iki sıra */}
      {rows.map((k, i) => {
        const y = lerp(1080, bot, k), sc = 1.15 * (1 - k * 0.85);
        return (
          <g key={i}>
            <Bed x={lerp(380, 820, k)} y={y} s={sc} rolled={rolled} c={i % 2 ? "#E9DCC0" : "#EFD9C9"} />
            <Bed x={lerp(1540, 1100, k)} y={y} s={sc} rolled={rolled} c={i % 2 ? "#EFD9C9" : "#E9DCC0"} />
            {girls > 0 && i < girls && sleep && rolled < 0.5 && (
              <g opacity={1 - rolled * 2}>
                {[lerp(380, 820, k), lerp(1540, 1100, k)].map((bx, j) => (
                  <g key={j} transform={`translate(${bx - 110 * sc},${y - 62 * sc}) scale(${sc})`}>
                    <ellipse cx={0} cy={0} rx={30} ry={20} fill={H.hijab} stroke={H.ln} strokeWidth={2} />
                    <ellipse cx={4} cy={2} rx={16} ry={13} fill={H.face} />
                    <path d="M-4,2 q3,3 6,0 M8,2 q3,3 6,0" stroke={H.ln} strokeWidth={2} fill="none" />
                  </g>
                ))}
              </g>
            )}
          </g>
        );
      })}
      <Kandil x={VX} y={420} s={0.8} t={t} on={1} />
      <Kandil x={VX - 420} y={250} s={1.1} t={t + 1} on={1} />
      <Kandil x={VX + 420} y={250} s={1.1} t={t + 2} on={1} />
      {night > 0 && <rect width={1920} height={1080} fill={H.night} opacity={night * 0.55} />}
    </g>
  );
};

// ───────── ÇEŞME ─────────
export const Cesme: React.FC<{ t: number; x?: number; y?: number; flow?: number }> = ({ t, x = 960, y = 820, flow = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-260,0 L-260,-520 Q0,-640 260,-520 L260,0Z" fill="#F2EBDD" stroke={H.ln} strokeWidth={4} />
    <path d="M-220,-30 L-220,-480 Q0,-580 220,-480 L220,-30Z" fill="url(#hTile)" opacity={0.85} />
    <path d="M-150,-120 L-150,-380 A150,150 0 0 1 150,-380 L150,-120Z" fill="#F7F2E8" stroke={H.gold} strokeWidth={6} />
    <text y={-300} textAnchor="middle" fontFamily="Patrick Hand" fontSize={46} fill={H.cobalt}>❀ ❀ ❀</text>
    <rect x={-20} y={-250} width={40} height={30} rx={6} fill="#B98A3A" stroke={H.ln} strokeWidth={2.5} />
    <path d="M0,-220 v26" stroke="#B98A3A" strokeWidth={14} strokeLinecap="round" />
    {flow > 0 && <g opacity={flow}>{[0, 1, 2].map((i) => <rect key={i} x={-5 + i * 3} y={-194} width={6} height={150} fill="#9FD3EC" opacity={0.5 + 0.3 * Math.sin(t * 30 + i)} />)}</g>}
    <path d="M-200,-40 L200,-40 L180,0 L-180,0Z" fill="#E2D8C4" stroke={H.ln} strokeWidth={3} />
    {flow > 0 && <ellipse cx={0} cy={-44} rx={40 + 6 * Math.sin(t * 12)} ry={8} fill="#CFEAF6" opacity={0.8} />}
  </g>
);

// ───────── SOFRA (yer sofrası) ─────────
export const Sofra: React.FC<{ t: number; x?: number; y?: number; s?: number; rich?: boolean }> = ({ t, x = 960, y = 820, s = 1, rich = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={30} rx={420} ry={90} fill={rich ? "#A8322C" : "#E9DCC0"} stroke={H.ln} strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={300} ry={60} fill={rich ? "#E9C37A" : "#C8CCD2"} stroke={H.ln} strokeWidth={4} />
    <ellipse cx={0} cy={-8} rx={270} ry={48} fill={rich ? "#F3D894" : "#DDE1E6"} />
    {(rich ? [-180, -90, 0, 90, 180] : [-60, 60]).map((bx, i) => (
      <g key={i} transform={`translate(${bx},${-14 + (i % 2) * 14})`}>
        <path d="M-46,0 Q0,40 46,0Z" fill={rich ? H.cobalt : "#F7F3EA"} stroke={H.ln} strokeWidth={2.5} />
        <ellipse cx={0} cy={0} rx={46} ry={10} fill={rich ? ["#D98C3A", "#F6EEDC", "#8A5A34", "#E9A48F", "#AFBE8C"][i] : "#E8B26A"} stroke={H.ln} strokeWidth={2} />
        {rich && <path d="M-40,-4 Q0,-60 40,-4Z" fill="#C9CDD3" stroke={H.ln} strokeWidth={2} opacity={i % 2 ? 1 : 0} />}
        {[0, 1].map((k) => { const p = ((t * 0.5 + k * 0.5 + i * 0.2) % 1); return <path key={k} d={`M${-10 + k * 16},${-10 - p * 70} q8,-12 0,-24`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={(1 - p) * 0.7} />; })}
      </g>
    ))}
    {!rich && <g transform="translate(150,-30)"><ellipse rx={60} ry={18} fill="#D8A45C" stroke={H.ln} strokeWidth={2.5} /><path d="M-40,-4 q40,-16 80,0" stroke="#A8743A" strokeWidth={3} fill="none" /></g>}
  </g>
);

// ───────── DAİRE KAPISI (iki kanatlı, ağalar) ─────────
export const DaireKapi: React.FC<{ t: number; open?: number; agas?: number; night?: number; glow?: number }> = ({ t, open = 0, agas = 2, night = 0, glow = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={H.plaster} />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={0} width={70} height={820} fill={H.plaster2} opacity={0.18} />)}
    <rect y={0} width={1920} height={70} fill="url(#hTileS)" /><rect y={66} width={1920} height={10} fill={H.cobalt} />
    <rect y={520} width={1920} height={300} fill="url(#hTile)" /><rect y={508} width={1920} height={14} fill={H.cobalt} />
    <path d="M620,820 L620,300 A340,300 0 0 1 1300,300 L1300,820Z" fill={H.cream} stroke={H.ln} strokeWidth={5} />
    <path d="M650,820 L650,310 A310,270 0 0 1 1270,310 L1270,820Z" fill="url(#hTile)" />
    <path d="M700,820 L700,330 A260,230 0 0 1 1220,330 L1220,820Z" fill={glow > 0 ? `rgba(255,224,150,${0.4 + 0.5 * glow})` : "#2A1E14"} />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${960 + sd * 260},0) scale(${1 - open * 0.85},1) translate(${-(960 + sd * 260)},0)`}>
        <path d={sd < 0 ? "M700,820 L700,330 A260,230 0 0 1 960,100 L960,820Z" : "M1220,820 L1220,330 A260,230 0 0 0 960,100 L960,820Z"} fill={H.wood} stroke={H.ln} strokeWidth={4} />
        {[0, 1, 2].map((r) => <rect key={r} x={sd < 0 ? 740 : 1000} y={360 + r * 150} width={180} height={120} rx={8} fill="none" stroke={H.gold} strokeWidth={5} />)}
        <circle cx={sd < 0 ? 935 : 985} cy={560} r={14} fill={H.gold} stroke={H.ln} strokeWidth={2.5} />
      </g>
    ))}
    <rect y={820} width={1920} height={260} fill="url(#hMarble)" />
    <path d="M560,860 L1360,860 L1500,1080 L420,1080Z" fill="url(#hRunner)" stroke={H.gold} strokeWidth={5} />
    <Lantern x={420} y={300} t={t} on={1} /><Lantern x={1500} y={300} t={t + 1} on={1} />
    {agas >= 1 && <HFig x={500} y={900} s={0.92} kind="aga" t={t} seed={3} look={0.4} />}
    {agas >= 2 && <HFig x={1420} y={900} s={0.92} kind="aga" t={t} seed={7} look={-0.4} />}
    {night > 0 && <rect width={1920} height={1080} fill={H.night} opacity={night * 0.55} />}
  </g>
);

// ───────── PERDE ARKASINDAN (ön plan perdeleri) ─────────
export const Perde: React.FC<{ t: number; gap?: number; c?: string }> = ({ t, gap = 0.3, c = "#8E2F2A" }) => {
  const w = 960 * (1 - gap);
  const sway = Math.sin(t * 1.3) * 8;
  return (
    <g>
      {[-1, 1].map((sd) => {
        const x0 = sd < 0 ? 0 : 1920, x1 = sd < 0 ? w : 1920 - w;
        return (
          <g key={sd}>
            <path d={`M${x0},0 L${x1},0 Q${x1 + sd * -30 + sway},540 ${x1 + sway * 2},1080 L${x0},1080Z`} fill={c} />
            {Array.from({ length: 7 }, (_, i) => { const xx = lerp(x0, x1, (i + 0.5) / 7); return <path key={i} d={`M${xx},0 Q${xx + sway},540 ${xx + sway * 1.6},1080`} stroke="#5E1C18" strokeWidth={10} opacity={0.4} fill="none" />; })}
            <path d={`M${x1},0 Q${x1 + sd * -30 + sway},540 ${x1 + sway * 2},1080`} stroke={H.gold} strokeWidth={8} fill="none" />
          </g>
        );
      })}
      <rect width={1920} height={60} fill="#5E1C18" /><rect y={56} width={1920} height={8} fill={H.gold} />
    </g>
  );
};

// ───────── HAREM MERDİVENİ ─────────
export const Merdiven: React.FC<{ t: number; k: number; hi?: number }> = ({ t, k, hi = 0 }) => {
  const steps = ["ACEMİ", "CARİYE", "KALFA", "USTA"];
  return (
    <g>
      {steps.map((lb, i) => {
        const kk = ease((k * 5 - i) / 1.2);
        const x = 300 + i * 340, y = 900 - i * 150;
        return (
          <g key={i} opacity={kk} transform={`translate(0,${(1 - kk) * 60})`}>
            <rect x={x} y={y} width={340} height={1080 - y} fill={i === hi ? H.cobalt : H.cream} stroke={H.ln} strokeWidth={4} />
            <rect x={x} y={y} width={340} height={22} fill={H.gold} />
            <text x={x + 170} y={y + 90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill={i === hi ? "#FFFFFF" : H.cobalt}>{lb}</text>
            <HFig x={x + 170} y={y} s={0.36} kind={i >= 2 ? "kalfa" : "girl"} robe={[H.pink, H.blue, H.purple, H.teal][i]} t={t} seed={i} face={i === hi ? "worried" : "normal"} />
          </g>
        );
      })}
      <g opacity={ease(k * 5 - 4)}>
        <path d="M1660,240 L1660,180" stroke={H.gold} strokeWidth={6} />
        <HFig x={1560} y={300} s={0.3} kind="valide" t={t} seed={1} old />
        <HFig x={1760} y={300} s={0.3} kind="valide" robe={H.purple} t={t} seed={2} />
      </g>
    </g>
  );
};

// ───────── OSMANLI SAATİ (köşe rozeti, vakitler) ─────────
const VAKIT = ["SABAH", "ÖĞLE", "İKİNDİ", "AKŞAM", "YATSI", "GECE"];
export const OSaat: React.FC<{ t: number; v: number; x?: number; y?: number; s?: number }> = ({ t, v, x = 1760, y = 160, s = 1 }) => {
  const ang = -120 + v * 48 + Math.sin(t * 2) * 1.5;
  const night = v >= 3.5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={118} fill={night ? "#1C2440" : H.cream} stroke={H.gold} strokeWidth={10} />
      <circle r={100} fill="none" stroke={H.cobalt} strokeWidth={5} />
      {VAKIT.map((_, i) => { const a = ((-120 + i * 48) * Math.PI) / 180; return <circle key={i} cx={Math.sin(a) * 84} cy={-Math.cos(a) * 84} r={i === Math.round(v) ? 11 : 6} fill={i === Math.round(v) ? H.red : night ? "#9FB0D8" : H.cobalt} />; })}
      <line x1={0} y1={0} x2={Math.sin((ang * Math.PI) / 180) * 70} y2={-Math.cos((ang * Math.PI) / 180) * 70} stroke={night ? "#FFE3A0" : H.black} strokeWidth={8} strokeLinecap="round" />
      <circle r={10} fill={H.gold} />
      {night ? <path d="M-12,-40 a22,22 0 1 0 22,30 a17,17 0 1 1 -22,-30Z" fill="#FFE3A0" /> : <circle cy={-40} r={14} fill="#F2B640" />}
      <rect x={-96} y={128} width={192} height={52} rx={14} fill={H.cobalt} />
      <text y={166} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF">{VAKIT[Math.min(5, Math.round(v))]}</text>
    </g>
  );
};

// ───────── DENİZ YOLU: Kafkasya → İstanbul ─────────
export const DenizYolu: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  const path = (p: number) => ({ x: lerp(1560, 520, p), y: 430 + Math.sin(p * Math.PI) * -90 + p * 160 });
  const sp = path(k);
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DDC2" />
      <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.25} />
      <path d="M380,320 C560,240 900,250 1200,260 C1420,270 1600,300 1700,380 C1760,470 1680,560 1560,610 C1360,690 1000,700 760,680 C600,668 470,640 420,560 C380,490 340,400 380,320Z" fill="#9CC7DE" stroke={H.ln} strokeWidth={4} />
      <path d="M380,320 C560,240 900,250 1200,260 C1420,270 1600,300 1700,380" fill="none" stroke="#6E9BB8" strokeWidth={10} opacity={0.5} />
      <path d="M440,620 L470,700 L440,760" stroke="#9CC7DE" strokeWidth={22} fill="none" strokeLinecap="round" />
      {Array.from({ length: 30 }, (_, i) => { const p = i / 30; if (p > k) return null; const a = path(p); return <circle key={i} cx={a.x} cy={a.y} r={7} fill={H.red} />; })}
      <g transform={`translate(${sp.x},${sp.y + Math.sin(t * 3) * 4}) scale(${-1},1)`}>
        <path d="M-60,0 L60,0 L44,26 L-44,26Z" fill={H.wood} stroke={H.ln} strokeWidth={3} />
        <path d="M0,0 V-90" stroke={H.wood2} strokeWidth={5} /><path d="M2,-86 Q50,-50 4,-10Z" fill={H.cream} stroke={H.ln} strokeWidth={2.5} />
      </g>
      <g transform="translate(1660,300)"><path d="M-80,40 L-30,-50 L10,10 L50,-70 L110,40Z" fill="#B9A68A" stroke={H.ln} strokeWidth={3} /><path d="M-30,-50 l-12,22 h24Z M50,-70 l-14,26 h28Z" fill="#FFFFFF" /></g>
      <text x={1680} y={420} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill={H.black}>KAFKASYA</text>
      <g opacity={ease(k * 1.5 - 0.5)}><circle cx={455} cy={690} r={18} fill={H.cobalt} stroke="#FFFFFF" strokeWidth={5} /><text x={455} y={780} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill={H.cobalt}>İSTANBUL</text></g>
      <text x={1000} y={490} textAnchor="middle" fontFamily="Patrick Hand" fontSize={64} fill="#4E7FA0" opacity={0.8}>Karadeniz</text>
    </g>
  );
};

// ───────── TÜRBE ─────────
export const Turbe: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk > 0.5 ? "#E8B07A" : "#BFE1F2"} />
    <rect y={600} width={1920} height={480} fill="#CFC09C" />
    <g transform="translate(1500,420)" opacity={0.5}><path d="M-200,180 L-200,40 A200,170 0 0 1 200,40 L200,180Z" fill="#9FB3C8" /><rect x={-240} y={-160} width={18} height={340} fill="#9FB3C8" /><rect x={222} y={-160} width={18} height={340} fill="#9FB3C8" /></g>
    {[260, 380, 1640, 1760].map((x, i) => <path key={i} d={`M${x},${700} C${x - 50},${560} ${x - 30},${380} ${x},${300 + (i % 2) * 40} C${x + 30},${380} ${x + 50},${560} ${x},${700}Z`} fill="#2F5D3A" stroke={H.ln} strokeWidth={3} transform={`rotate(${Math.sin(t + i) * 1.5},${x},700)`} />)}
    <g transform="translate(960,760)">
      <rect x={-300} y={-300} width={600} height={300} fill="#ECE3D0" stroke={H.ln} strokeWidth={4} />
      {[-200, 0, 200].map((x) => <path key={x} d={`M${x - 60},-40 L${x - 60},-200 A60,60 0 0 1 ${x + 60},-200 L${x + 60},-40Z`} fill="#4C6A86" stroke={H.ln} strokeWidth={3} />)}
      <path d="M-320,-300 L320,-300 L300,-340 L-300,-340Z" fill="#D8C7A6" stroke={H.ln} strokeWidth={3} />
      <path d="M-260,-340 A260,230 0 0 1 260,-340Z" fill="#8E9AA6" stroke={H.ln} strokeWidth={4} />
      <path d="M0,-570 v-50" stroke={H.gold} strokeWidth={8} /><path d="M-14,-630 a16,16 0 1 0 28,0" fill="none" stroke={H.gold} strokeWidth={6} />
    </g>
    <rect y={760} width={1920} height={320} fill="#BFAE88" />
    {dusk > 0 && <rect width={1920} height={1080} fill="#7A3E1A" opacity={dusk * 0.18} />}
  </g>
);

// ───────── ÇARŞI (kepenkler kapalı ya da açık) ─────────
export const Carsi: React.FC<{ t: number; closed?: number; crowd?: number }> = ({ t, closed = 0, crowd = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DCC3" />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i} transform={`translate(${i * 300 - 40},0)`}>
        <path d="M0,520 L0,160 A150,120 0 0 1 300,160 L300,520Z" fill="#D6C29C" stroke={H.ln} strokeWidth={4} />
        <path d="M30,520 L30,190 A120,95 0 0 1 270,190 L270,520Z" fill={i % 2 ? "#E8B26A" : "#C9A0D6"} />
        {[0, 1, 2].map((r) => <rect key={r} x={50 + r * 70} y={380} width={50} height={60} rx={8} fill={["#B8322E", "#2B5DA8", "#3F6B33"][(i + r) % 3]} />)}
        <rect x={30} y={190 - 10} width={240} height={(520 - 180) * closed} fill="#7A5634" stroke={H.ln} strokeWidth={3} />
        {closed > 0.5 && [0, 1, 2, 3, 4, 5].map((r) => <path key={r} d={`M30,${200 + r * 54} H270`} stroke="#5E3B20" strokeWidth={4} />)}
      </g>
    ))}
    <rect y={520} width={1920} height={560} fill="#CDBB96" />
    <path d="M0,620 H1920" stroke="#B5A27C" strokeWidth={6} />
    {crowd > 0 && Array.from({ length: 16 }, (_, i) => <HTiny key={i} x={((i * 137 + t * (i % 2 ? 20 : -14)) % 2000 + 2000) % 2000 - 40} y={760 + (i % 4) * 70} s={2.2 + (i % 4) * 0.35} c={["#3F3A55", "#5A4430", "#2B3A4A", "#4A4040"][i % 4]} />)}
  </g>
);

// ───────── ÇINAR MEYDANI (1656 ayaklanması) ─────────
export const Cinar: React.FC<{ t: number; crowd?: number; dusk?: number }> = ({ t, crowd = 1, dusk = 0.6 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk > 0.5 ? "#D9875A" : "#BFE1F2"} />
    <rect y={540} width={1920} height={540} fill="#B39A72" />
    <g transform="translate(1500,520)" opacity={0.6}><path d="M-260,40 L-260,-80 A260,200 0 0 1 260,-80 L260,40Z" fill="#8E6E58" /><rect x={-300} y={-300} width={20} height={340} fill="#8E6E58" /><rect x={280} y={-300} width={20} height={340} fill="#8E6E58" /></g>
    <g transform="translate(700,640)">
      <path d="M-50,0 C-40,-120 -60,-220 -30,-300 L30,-300 C60,-220 40,-120 50,0Z" fill="#7A5634" stroke={H.ln} strokeWidth={4} />
      {[[-200, -380, 170], [0, -470, 200], [200, -380, 170], [-90, -300, 140], [110, -290, 140]].map(([cx, cy, r], i) => <circle key={i} cx={cx + Math.sin(t * 0.8 + i) * 4} cy={cy} r={r} fill={i % 2 ? "#4F7A3A" : "#3F6B33"} stroke={H.ln} strokeWidth={3} />)}
    </g>
    {crowd > 0 && Array.from({ length: 40 }, (_, i) => {
      const x = 60 + ((i * 97) % 1800), row = i % 5;
      return <g key={i} transform={`translate(0,${Math.sin(t * 5 + i) * 3})`}><HTiny x={x} y={760 + row * 60} s={1.8 + row * 0.3} c={["#5A2A26", "#3E3A30", "#4A3A28", "#2E2E3A"][i % 4]} /></g>;
    })}
    {crowd > 0 && [300, 820, 1260, 1600].map((x, i) => <g key={i}><path d={`M${x},${760} v-160`} stroke={H.wood2} strokeWidth={8} /><path d={`M${x},${600} q-16,-30 0,-60 q16,30 0,60Z`} fill="#FFB33A" opacity={0.8 + 0.2 * Math.sin(t * 12 + i)} /></g>)}
    {dusk > 0 && <rect width={1920} height={1080} fill="#5A1E0E" opacity={dusk * 0.2} />}
  </g>
);

// ───────── SARAY KAPISI (Bâbüssaâde, dışarıdan) ─────────
export const SarayKapi: React.FC<{ t: number; open?: number }> = ({ t, open = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE1F2" />
    <rect y={760} width={1920} height={320} fill="#CFC09C" />
    <g transform="translate(960,780)">
      <rect x={-560} y={-460} width={1120} height={460} fill="#F1E8D6" stroke={H.ln} strokeWidth={5} />
      <path d="M-640,-460 L640,-460 L560,-560 L-560,-560Z" fill="#9AA7B0" stroke={H.ln} strokeWidth={4} />
      {[-440, -300, 300, 440].map((x) => <rect key={x} x={x - 22} y={-460} width={44} height={460} fill="#E2D6BE" stroke={H.ln} strokeWidth={3} />)}
      <path d="M-200,0 L-200,-280 A200,180 0 0 1 200,-280 L200,0Z" fill="url(#hTile)" stroke={H.gold} strokeWidth={8} />
      <path d="M-150,0 L-150,-260 A150,140 0 0 1 150,-260 L150,0Z" fill={open > 0 ? "#FFF0C8" : H.wood} />
      {[-1, 1].map((sd) => <rect key={sd} x={sd < 0 ? -150 : 150 - 150 * (1 - open)} y={-260} width={150 * (1 - open)} height={260} fill={H.wood} stroke={H.ln} strokeWidth={3} />)}
      <rect x={-180} y={-400} width={360} height={70} rx={10} fill={H.cobalt} />
      <text y={-352} textAnchor="middle" fontFamily="Patrick Hand" fontSize={46} fill={H.gold}>❀ BÂBÜSSAÂDE ❀</text>
    </g>
    {[200, 1720].map((x, i) => <path key={i} d={`M${x},${800} C${x - 50},${640} ${x - 30},${420} ${x},${330} C${x + 30},${420} ${x + 50},${640} ${x},${800}Z`} fill="#2F5D3A" stroke={H.ln} strokeWidth={3} transform={`rotate(${Math.sin(t + i) * 1.5},${x},800)`} />)}
  </g>
);

// ───────── iki valide yan yana (Kösem yaşlı, Turhan genç + çocuk padişah) ─────────
export const IkiValide: React.FC<{ t: number; left?: number; right?: number; child?: number; split?: boolean }> = ({ t, left = 1, right = 1, child = 0, split = true }) => (
  <g>
    <rect width={960} height={1080} fill="#EAD9C0" />
    <rect x={960} width={960} height={1080} fill="#DCE4EE" />
    <g transform="translate(0,0) scale(0.5,1)"><rect y={0} width={1920} height={70} fill="url(#hTileS)" /></g>
    <rect y={760} width={1920} height={320} fill="url(#hMarble)" />
    <ArchWindow x={480} y={560} w={260} h={400} k={0.3} />
    <ArchWindow x={1440} y={560} w={260} h={400} k={0.3} />
    {split && <rect x={954} width={12} height={1080} fill={H.gold} />}
    <g opacity={left}><HFig x={480} y={980} s={1.2} kind="valide" old t={t} seed={1} face="normal" look={0.6} /></g>
    <g opacity={right}><HFig x={1380} y={980} s={1.15} kind="valide" robe={H.purple} robe2="#C9B4E2" t={t} seed={2} look={-0.6} /></g>
    <g opacity={child}><HFig x={1660} y={980} s={0.62} kind="sultan" child t={t} seed={4} look={-0.4} /></g>
  </g>
);

export const _hp = { HTiny };
