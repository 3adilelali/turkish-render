import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-04-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { FONT } from "../../theme";
import {
  CarP, DEDE, Dice, HERO, Istiklal, Kitchen, Lab, Living, MINI_COLS, MOM, NightRoad, Office, P, PhoneP, Study, T, TCam, TFig, TFrame, TMini, Tavla, lerp, runPose, walkPose,
} from "../../components/Toon";
import { Hastane, SUIT_OUTFIT, Vapur } from "../../components/Toon2";

// Kanal 2 · k2r-04 · "Dedenin Başında "1" Yazıyor: Onu Son Kez Göreceksin" — TAMAMEN MOTOR, bağımsız hikâye (Program yok).
// Gösterge: herkesin başının üstünde beyaz, turkuaz haleli bir sayı (Num). Değişirken dönüyor ve parlıyor.

const ALT: Record<string, string[]> = {};
// لقطات قصيرة: إذا البداية بعد النهاية، القيمة بتقفز بدل ما يوقع interpolate
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_04_SECONDS = Math.ceil(VOICE_END + 4);

// sayının değiştiği anlar (ses ile birebir)
const AT_36 = cue("36", 63.8);
const AT_1211 = cue("1211", 94);
const AT_D0 = cue("sıfıra dönüyor", 374);
const AT_3914 = cue("3914", 436);
const AT_E1 = cue("Bir yazıyor", 470);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; m?: string; sfx?: string; html?: R };

// ───────── HTML yazı ─────────
const useSp = (t: number, at: number) => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 13, stiffness: 140 } });
};
export const Txt: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; color?: string; sub?: string; x?: number; w?: number; until?: number }> = ({ t, at, text, y = 70, size = 92, color = "#FFFFFF", sub, x = 960, w = 1700, until = 1e9 }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  const out = 1 - ramp(t, until, until + 0.25);
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, textAlign: "center", opacity: sp * out, transform: `translateY(${(1 - sp) * 30}px) scale(${0.85 + 0.15 * sp})` }}>
      <div style={{ display: "inline-block", background: "rgba(12,22,40,.74)", borderRadius: 22, padding: `${size * 0.12}px ${size * 0.4}px`, boxShadow: "0 10px 30px rgba(0,0,0,.3)", fontFamily: FONT, fontWeight: 800, fontSize: size, color, letterSpacing: 1, lineHeight: 1.05, textShadow: "0 4px 0 rgba(0,0,0,.35)" }}>{text}</div>
      {sub && <div style={{ marginTop: 10 }}><span style={{ display: "inline-block", background: "rgba(12,22,40,.74)", borderRadius: 12, padding: "4px 20px", fontFamily: FONT, fontWeight: 700, fontSize: size * 0.42, color: "#FFFFFF" }}>{sub}</span></div>}
    </div>
  );
};
export const Tag: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; c?: string }> = ({ t, at, text, x = 70, y = 60, c = T.red }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: sp, transform: `translateX(${(1 - sp) * -40}px)`, background: c, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "8px 26px", borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,.3)" }}>{text}</div>;
};
export const Abone: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: sp, transform: `scale(${0.7 + 0.3 * sp})` }}><div style={{ background: T.red, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: "18px 80px", borderRadius: 60, boxShadow: "0 12px 30px rgba(0,0,0,.45)" }}>ABONE OL 🔔</div></div>;
};

// ───────── SVG yardımcıları ─────────
export const Bub: React.FC<{ t: number; at: number; x: number; y: number; text: string; tail?: -1 | 1; size?: number; ghost?: boolean; w?: number }> = ({ t, at, x, y, text, tail = -1, size = 40, ghost, w }) => {
  if (t < at) return null;
  const k = Math.min(1, (t - at) / 0.25);
  const W = w ?? Math.min(1000, text.length * size * 0.56 + 70);
  return (
    <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * k})`} opacity={k * (ghost ? 0.85 : 1)}>
      <rect x={-W / 2} y={-55} width={W} height={110} rx={40} fill={ghost ? "#FFF1C9" : "#FFFFFF"} stroke={ghost ? T.yellow2 : "#222"} strokeWidth={ghost ? 5 : 4} strokeDasharray={ghost ? "14 10" : undefined} />
      <path d={`M${tail * 40},50 L${tail * 70},100 L${tail * 90},50Z`} fill={ghost ? "#FFF1C9" : "#FFFFFF"} />
      <text y={size * 0.36} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={size} fill="#1C1C1C">{text}</text>
    </g>
  );
};
// başın üstündeki sayı: (x, y) figürün ayağı, s figürün ölçeği. from→to: `at` anında dönerek değişir.
export const Num: React.FC<{ t: number; x: number; y: number; s?: number; n: string | number; from?: string | number; at?: number; k?: number; shake?: number; c?: string; size?: number }> = ({ t, x, y, s = 0.62, n, from, at, k = 1, shake = 0, c = "#FFFFFF", size }) => {
  if (k <= 0.001) return null;
  const fs = size ?? Math.max(54, 170 * s);
  const cy = y - 600 * s - fs * 0.2 + Math.sin(t * 2.2 + x * 0.01) * 6 * s;
  const fk = at === undefined ? 1 : ramp(t, at - 0.18, at + 0.18);
  const show = String(from !== undefined && fk < 0.5 ? from : n);
  const sy = at === undefined ? 1 : Math.max(0.05, Math.abs(1 - 2 * fk));
  const flash = at === undefined ? 0 : Math.max(0, 1 - Math.abs(t - at) / 0.6);
  const jx = shake ? Math.sin(t * 61) * shake + Math.sin(t * 37) * shake * 0.5 : 0;
  return (
    <g transform={`translate(${x + jx},${cy}) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <ellipse cx={0} cy={-fs * 0.36} rx={fs * (0.75 + 0.3 * flash) * Math.max(1, show.length * 0.42)} ry={fs * (0.7 + 0.2 * flash)} fill="url(#tRim)" opacity={0.5 + 0.45 * flash} />
      {flash > 0 && <circle cx={0} cy={-fs * 0.36} r={fs * (0.6 + (1 - flash) * 1.4)} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={flash} />}
      <g transform={`translate(0,${-fs * 0.36}) scale(1,${sy}) translate(0,${fs * 0.36})`}>
        <text textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={fs} fill={c} stroke="#0E1A2E" strokeWidth={fs * 0.07} paintOrder="stroke">{show}</text>
      </g>
    </g>
  );
};
// kalabalık mini figürlerin üstündeki küçük sayılar
export const MiniNum: React.FC<{ x: number; y: number; s: number; n: string; k?: number }> = ({ x, y, s, n, k = 1 }) => (
  <text x={x} y={y - 104 * s} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26 * s} fill="#FFFFFF" stroke="#0E1A2E" strokeWidth={4 * s} paintOrder="stroke" opacity={k}>{n}</text>
);
export const Tears: React.FC<{ x: number; y: number; s: number; t: number; dir?: 1 | -1 }> = ({ x, y, s, t }) => (
  <g>{[-1, 1].map((d) => { const k = ((t * 0.9 + (d > 0 ? 0.5 : 0)) % 1); return <ellipse key={d} cx={x + d * 34 * s} cy={y - 430 * s + k * 90 * s} rx={7 * s} ry={11 * s} fill="#8FD3FF" opacity={1 - k} />; })}</g>
);
export const Lines: React.FC<{ t: number; y0?: number; y1?: number; n?: number; c?: string }> = ({ t, y0 = 200, y1 = 900, n = 14, c = "#FFFFFF" }) => (
  <g opacity={0.6}>{Array.from({ length: n }, (_, i) => { const y = y0 + ((i * 97) % (y1 - y0)); const x = (((i * 331) - t * 2600) % 2400 + 2400) % 2400 - 240; return <rect key={i} x={x} y={y} width={180 + (i % 3) * 80} height={6} rx={3} fill={c} />; })}</g>
);
export const Calendar: React.FC<{ x: number; y: number; s?: number; top: string; big: string; sub?: string; k?: number }> = ({ x, y, s = 1, top, big, sub, k = 1 }) => (
  <g transform={`translate(${x},${y + (1 - k) * 60}) scale(${s})`} opacity={k}>
    <rect x={-200} y={-220} width={400} height={440} rx={22} fill="#FFFFFF" stroke="#D9D9D9" strokeWidth={4} />
    <rect x={-200} y={-220} width={400} height={110} rx={22} fill={T.red} /><rect x={-200} y={-140} width={400} height={30} fill={T.red} />
    <text y={-145} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill="#FFFFFF">{top}</text>
    <text y={70} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={big.length > 3 ? 120 : 170} fill="#1C1C1C">{big}</text>
    {sub && <text y={170} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#777">{sub}</text>}
    {[-120, 120].map((xx) => <rect key={xx} x={xx - 10} y={-250} width={20} height={60} rx={10} fill="#555" />)}
  </g>
);
export const Simit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={30} fill="none" stroke="#B5651D" strokeWidth={20} /><circle r={30} fill="none" stroke="#F3D9A4" strokeWidth={20} strokeDasharray="2 9" opacity={0.9} /></g>
);
export const Poset: React.FC<{ s?: number; t?: number; simit?: boolean; heavy?: boolean }> = ({ s = 1, t = 0, simit = true, heavy }) => (
  <g transform={`scale(${s})`}>
    <path d="M-50,10 L50,10 L62,150 L-62,150Z" fill={simit ? "#E9D3A8" : "#F7F7F7"} stroke={simit ? "#C9A86A" : "#D0D0D0"} strokeWidth={4} />
    {simit ? <><Simit x={-14} y={12} s={0.8} /><Simit x={22} y={0} s={0.7} /></> : <>{[T.red, T.orange, T.green].map((c, i) => <circle key={i} cx={-30 + i * 30} cy={14 - (i % 2) * 8} r={18} fill={c} />)}<path d="M-20,10 q20,-50 40,0" stroke="#D0D0D0" strokeWidth={6} fill="none" /></>}
    {simit && !heavy && [0, 1].map((i) => <path key={i} d={`M${-10 + i * 24},-30 q-10,-16 0,-32 q10,-16 0,-32`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} />)}
  </g>
);
export const Caydanlik: React.FC<{ s?: number; tilt?: number }> = ({ s = 1, tilt = 0 }) => (
  <g transform={`scale(${s}) rotate(${tilt})`}><ellipse cx={0} cy={30} rx={46} ry={40} fill="#C9C9C9" /><ellipse cx={0} cy={-18} rx={30} ry={24} fill="#DADADA" /><path d="M40,20 L80,-6" stroke="#BDBDBD" strokeWidth={12} strokeLinecap="round" /><circle cx={0} cy={-44} r={8} fill="#555" /></g>
);
export const Tea: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-14,-40 L14,-40 L10,0 L-10,0Z" fill="#B8352E" opacity={0.85} /><ellipse cx={0} cy={2} rx={22} ry={5} fill="#E8E8E8" /></g>
);
export const Heart: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = T.red }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} d="M0,40 C-70,-10 -60,-80 0,-46 C60,-80 70,-10 0,40Z" fill={c} />
);
export const Bolt: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} d="M20,-160 L-60,10 L-4,10 L-30,160 L60,-30 L4,-30Z" fill={T.yellow} stroke="#FFFFFF" strokeWidth={8} opacity={k} />
);
export const Cross: React.FC<{ x: number; y: number; r?: number; k?: number }> = ({ x, y, r = 170, k = 1 }) => (
  <path d={`M${x - r},${y - r} L${x - r + 2 * r * k},${y - r + 2 * r * k} M${x + r},${y - r} L${x + r - 2 * r * Math.max(0, k * 2 - 1)},${y - r + 2 * r * Math.max(0, k * 2 - 1)}`} stroke={T.red} strokeWidth={24} strokeLinecap="round" />
);
export const Turp: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M0,-60 q-30,-60 -50,-80 M0,-60 q0,-70 6,-90 M0,-60 q30,-60 50,-76" stroke="#3FAE6A" strokeWidth={16} fill="none" strokeLinecap="round" /><ellipse cx={0} cy={0} rx={60} ry={66} fill="#D83A6A" /><path d="M0,64 q4,30 0,50" stroke="#F0E0E6" strokeWidth={6} fill="none" /><ellipse cx={-20} cy={-20} rx={14} ry={20} fill="#FFFFFF" opacity={0.3} /></g>
);

// ───────── kişiler ─────────
const G = 1040;
const EMRE = { top: T.green, top2: "#2E8A55", kind: "sweater" as const, shoes: "#FFFFFF" };
const ZEYNEP = { top: T.purple, top2: "#5E42A8", kind: "sweater" as const, hair: "ponytail" as const, shoes: "#F4F4F4" };
const EX = { top: T.red, top2: T.red2, kind: "coat" as const, inner: "#F4F4F4", hair: "bun" as const, hairColor: "#3A2A20", shoes: "#222" };
const AYTEN = { top: "#3FAE6A", top2: "#2E8A55", kind: "sweater" as const, hair: "scarf" as const, hairColor: "#F6C445", shoes: "#5A4A3A" };
const HASAN = { top: "#FFFFFF", top2: "#E0E0E0", kind: "vest" as const, inner: "#F4F4F4", hair: "cap" as const, hairColor: "#B23A3F", mustache: true, shoes: "#3A2A20" };
const MUDUR = { ...SUIT_OUTFIT, mustache: true };
const GUARD = { top: "#2A3A55", top2: "#1E2A40", kind: "coat" as const, inner: "#BFE6F2", hair: "cap" as const, hairColor: "#1E2A40", shoes: "#111" };
const OGR = { top: T.yellow, top2: T.yellow2, shoes: "#FFFFFF" };
const HUG = { l: [70, 100] as [number, number], r: [70, 100] as [number, number], lean: 6 };

// ───────── mekânlar ─────────
// Üsküdar sahili: Kız Kulesi, karşı kıyı, cami
export const Uskudar: React.FC<{ t: number; dusk?: number; boat?: boolean }> = ({ t, dusk = 0, boat }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
    {[0, 1, 2].map((k) => <ellipse key={k} cx={((200 + k * 700 + t * 10) % 2300) - 200} cy={110 + k * 40} rx={120} ry={30} fill="#FFFFFF" opacity={dusk ? 0.25 : 0.8} />)}
    <path d="M0,520 L120,500 L180,470 L260,500 L420,480 L470,430 L500,480 L700,490 L760,440 L790,440 L800,410 L810,440 L860,490 L1100,470 L1180,420 L1200,350 L1220,420 L1300,480 L1500,470 L1560,440 L1640,480 L1920,470 L1920,560 L0,560Z" fill={dusk ? "#5A4A6E" : "#8FA9B8"} />
    <rect y={540} width={1920} height={340} fill={dusk ? "#3E5A8C" : "#3E8FC4"} />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${((i * 151 + t * 30) % 2000) - 40},${600 + (i % 5) * 50} q20,-8 40,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.5} />)}
    {boat && <Vapur x={((t * 40) % 2600) - 400} y={760} s={0.7} t={t} />}
    <g transform="translate(1380,690)">
      <ellipse cx={0} cy={40} rx={170} ry={36} fill="#8A7A66" />
      <rect x={-120} y={-40} width={240} height={80} fill="#F2EBDD" /><rect x={-50} y={-210} width={100} height={180} fill="#F2EBDD" />
      <path d="M-62,-210 L0,-300 L62,-210Z" fill="#7A8C9A" /><rect x={-4} y={-330} width={8} height={36} fill="#7A8C9A" />
      {[-30, 10].map((xx) => <rect key={xx} x={xx} y={-180} width={18} height={30} rx={9} fill="#5E8BA6" />)}
      <path d="M-120,-40 Q-60,-80 0,-40 Q60,-80 120,-40" fill="#7A8C9A" />
    </g>
    <path d="M0,880 L0,380 L560,380 L620,880Z" fill="#E7D3AE" />
    <g transform="translate(260,380)">
      <path d="M-180,0 Q0,-200 180,0Z" fill="#8FA0AE" /><circle cx={0} cy={-150} r={10} fill="#C9A24A" />
      <rect x={-240} y={-260} width={22} height={260} fill="#E8E1D4" /><path d="M-244,-260 L-229,-320 L-214,-260Z" fill="#8FA0AE" />
      <rect x={218} y={-260} width={22} height={260} fill="#E8E1D4" /><path d="M214,-260 L229,-320 L244,-260Z" fill="#8FA0AE" />
      <rect x={-220} y={0} width={440} height={180} fill="#E8E1D4" />
      {[-160, -80, 0, 80, 160].map((xx) => <rect key={xx} x={xx - 22} y={40} width={44} height={70} rx={22} fill="#5E8BA6" />)}
    </g>
    <rect y={860} width={1920} height={220} fill="#C9BBA6" /><rect y={860} width={1920} height={220} fill="url(#tStone)" />
    <path d="M0,860 H1920" stroke="#5A6A75" strokeWidth={8} />
    {Array.from({ length: 25 }, (_, i) => <rect key={i} x={i * 80} y={820} width={6} height={44} fill="#5A6A75" />)}
    <path d="M0,820 H1920" stroke="#5A6A75" strokeWidth={6} />
  </g>
);
// apartman sahanlığı ve kapı (open 0..1)
export const Landing: React.FC<{ t: number; open?: number; wall?: string; door?: string; plate?: string; inside?: React.ReactNode }> = ({ open = 0, wall = "#E9DDC5", door = "#7A4526", plate = "7", inside }) => (
  <g>
    <rect width={1920} height={1080} fill={wall} />
    <rect width={1920} height={1040} fill="url(#tBrick)" opacity={0.22} />
    <rect y={560} width={1920} height={480} fill="#000" opacity={0.05} /><rect y={556} width={1920} height={10} fill="#C9B48C" />
    <path d="M0,760 L520,420" stroke="#5A3820" strokeWidth={18} strokeLinecap="round" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${20 + i * 60},${747 - i * 39.3} V1080`} stroke="#5A3820" strokeWidth={8} />)}
    <rect x={740} y={240} width={440} height={800} fill="#F6E3BE" />
    <rect x={830} y={320} width={170} height={210} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={10} />
    <rect x={1050} y={420} width={90} height={120} fill="#D9B77A" /><rect x={1060} y={430} width={70} height={100} fill="#8FC1A9" />
    <path d="M760,1040 L1160,1040 L1100,920 L820,920Z" fill="url(#tCarpet)" opacity={0.85} />
    {inside}
    <rect x={720} y={220} width={480} height={22} fill="#5A3820" /><rect x={720} y={220} width={22} height={820} fill="#5A3820" /><rect x={1178} y={220} width={22} height={820} fill="#5A3820" />
    <g transform={`translate(742,0) scale(${lerp(1, 0.1, open)},1)`}>
      <rect x={0} y={242} width={436} height={798} fill={door} />
      <rect x={50} y={290} width={336} height={300} rx={8} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={10} />
      <rect x={50} y={650} width={336} height={330} rx={8} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={10} />
      <circle cx={392} cy={660} r={18} fill="#E8C468" /><circle cx={218} cy={430} r={8} fill="#222" />
    </g>
    <g transform="translate(960,190)"><rect x={-44} y={-30} width={88} height={52} rx={8} fill="#E8C468" /><text y={12} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#5A3820">{plate}</text></g>
    <g transform="translate(1290,600)"><rect x={-28} y={-38} width={56} height={76} rx={10} fill="#F4F4F4" stroke="#BBB" strokeWidth={4} /><circle r={15} fill="#E8C468" /></g>
    <rect x={1500} y={300} width={60} height={40} rx={8} fill="#F6E7B0" /><ellipse cx={1530} cy={340} rx={140} ry={80} fill="url(#tGlow)" opacity={0.6} />
    <rect y={1040} width={1920} height={40} fill="#B89A6E" />
  </g>
);
export const Koltuk: React.FC<{ x: number; y?: number; c?: string }> = ({ x, y = 1040, c = "#8B3A4A" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-170} y={-330} width={340} height={300} rx={60} fill={c} />
    <rect x={-150} y={-70} width={300} height={60} rx={24} fill="#A84D5E" />
    <rect x={-215} y={-180} width={80} height={180} rx={36} fill="#6E2C3A" /><rect x={135} y={-180} width={80} height={180} rx={36} fill="#6E2C3A" />
    <rect x={-150} y={-10} width={14} height={10} fill="#3A2A20" /><rect x={136} y={-10} width={14} height={10} fill="#3A2A20" />
  </g>
);
export const Salon: React.FC<{ t: number }> = ({ t }) => <g><Living t={t} night={false} /><Koltuk x={1320} /></g>;
// kahvaltı sofrası (önde)
export const Sofra: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={360} y={860} width={1200} height={30} rx={8} fill="#F4F4F4" /><path d="M360,890 L1560,890 L1540,1080 L380,1080Z" fill="#E86A6A" opacity={0.9} />
    <path d="M360,890 L1560,890" stroke="#FFFFFF" strokeWidth={6} strokeDasharray="24 18" />
    <Tea x={560} y={860} /><Tea x={960} y={860} /><Tea x={1360} y={860} />
    <ellipse cx={760} cy={856} rx={70} ry={14} fill="#FFFFFF" /><rect x={720} y={832} width={80} height={24} rx={4} fill="#FFF6D6" />
    <ellipse cx={1160} cy={856} rx={70} ry={14} fill="#FFFFFF" />{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1120 + i * 20} cy={846} r={9} fill="#2E2E2E" />)}
    <Simit x={860} y={840} s={0.7} /><Simit x={1060} y={840} s={0.7} />
    <g opacity={0.5 + 0.3 * Math.sin(t * 3)}><path d="M960,810 q-8,-16 0,-32" stroke="#FFF" strokeWidth={3} fill="none" /></g>
  </g>
);
// metro / Marmaray peronu ve tren (pencerelerin içi `inside`, üstü `over`)
const WINS = [-120, 360, 1080, 1560, 2040];
export const Peron: React.FC<{ t: number; door?: number; px?: number; inside?: React.ReactNode; over?: React.ReactNode; sign?: string; train?: boolean; gates?: boolean }> = ({ t, door = 0, px = 0, inside, over, sign = "MARMARAY · ÜSKÜDAR", train = true, gates }) => (
  <g>
    <rect width={1920} height={1080} fill="#DCE3E8" />
    <rect width={1920} height={250} fill="#B9C5CF" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={60 + i * 320} y={40} width={220} height={18} rx={9} fill="#FFFFFF" />)}
    <g transform="translate(960,170)"><rect x={-300} y={-44} width={600} height={88} rx={12} fill="#1E3A64" /><text y={16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={42} fill="#FFFFFF">{sign}</text></g>
    {train ? (
      <g transform={`translate(${-px},0)`}>
        <rect x={-500} y={280} width={2900} height={520} rx={40} fill="#F4F6F8" stroke="#B9C3CB" strokeWidth={6} />
        <rect x={-500} y={700} width={2900} height={30} fill={T.red} /><rect x={-500} y={736} width={2900} height={12} fill={T.blue} />
        <defs><clipPath id="pWin">{WINS.map((x) => <rect key={x} x={x} y={360} width={300} height={250} rx={24} />)}<rect x={740} y={340} width={280} height={440} /></clipPath></defs>
        {WINS.map((x) => <rect key={x} x={x} y={360} width={300} height={250} rx={24} fill="#2B3E55" />)}
        <rect x={740} y={340} width={280} height={440} fill="#C9D3DA" />
        <g clipPath="url(#pWin)">{inside}</g>
        {WINS.map((x) => <rect key={x} x={x} y={360} width={300} height={250} rx={24} fill="#BFE6F2" opacity={0.16} stroke="#8A97A3" strokeWidth={8} />)}
        <rect x={740} y={340} width={140 * door} height={440} fill="#E3E8EC" stroke="#8A97A3" strokeWidth={4} /><rect x={1020 - 140 * door} y={340} width={140 * door} height={440} fill="#E3E8EC" stroke="#8A97A3" strokeWidth={4} />
        {door > 0.05 && <><rect x={760} y={380} width={Math.max(0, 140 * door - 40)} height={200} rx={10} fill="#2B3E55" /><rect x={1040 - 140 * door} y={380} width={Math.max(0, 140 * door - 40)} height={200} rx={10} fill="#2B3E55" /></>}
        <rect x={740} y={310} width={280} height={24} rx={6} fill={door > 0.5 && door < 1 ? (Math.sin(t * 20) > 0 ? T.red : "#661A1A") : "#661A1A"} />
        {over}
      </g>
    ) : <rect y={250} width={1920} height={550} fill="#2A3346" />}
    <rect y={800} width={1920} height={280} fill="#9AA3AB" /><rect y={800} width={1920} height={280} fill="url(#tTile)" /><rect y={812} width={1920} height={16} fill={T.yellow} />
    {gates && Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${260 + i * 280},1040)`}><rect x={-40} y={-200} width={80} height={200} rx={10} fill="#5E6670" /><rect x={-36} y={-196} width={72} height={30} rx={6} fill={i % 2 ? T.green : "#3A7BD5"} /><path d={`M40,-120 L${130 - 40 * Math.abs(Math.sin(t * 2 + i))},-120`} stroke="#C9C9C9" strokeWidth={12} strokeLinecap="round" /></g>)}
  </g>
);
// vapur içi: ahşap sıralar, büyük camlar, akan boğaz
const VWIN = [140, 700, 1260];
export const VapurIc: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8DCC0" />
    <defs><clipPath id="vWin">{VWIN.map((x) => <rect key={x} x={x} y={150} width={520} height={360} rx={30} />)}</clipPath></defs>
    <g clipPath="url(#vWin)">
      <rect width={1920} height={520} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      <g transform={`translate(${-((t * 30) % 900)},0)`}>
        {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${i * 450},0)`}>
          <path d="M0,420 L80,380 L160,400 L240,360 L260,330 L280,360 L360,390 L450,420Z" fill={dusk ? "#3A2F4E" : "#6E8798"} />
          <rect x={300} y={300} width={28} height={110} fill={dusk ? "#3A2F4E" : "#6E8798"} /><path d="M296,300 L314,256 L332,300Z" fill={dusk ? "#3A2F4E" : "#6E8798"} />
          <path d="M120,400 Q160,340 200,400Z" fill={dusk ? "#3A2F4E" : "#6E8798"} />
        </g>)}
      </g>
      <rect y={410} width={1920} height={120} fill={dusk ? "#4A5A8C" : "#3E8FC4"} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 211 - t * 120) % 2000 + 2000) % 2000 - 40},${440 + (i % 3) * 22} q20,-6 40,0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.5} />)}
    </g>
    {VWIN.map((x) => <rect key={x} x={x} y={150} width={520} height={360} rx={30} fill="none" stroke="#FFFFFF" strokeWidth={16} />)}
    {[420, 980, 1540].map((x) => <g key={x}><rect x={x - 70} y={40} width={140} height={20} rx={10} fill="#F6E7B0" /><ellipse cx={x} cy={70} rx={160} ry={60} fill="url(#tGlow)" opacity={0.5} /></g>)}
    <rect x={100} y={700} width={1720} height={170} rx={16} fill="#A0683C" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={110} y={715 + i * 38} width={1700} height={24} rx={6} fill="#B9804E" />)}
    <rect x={100} y={870} width={1720} height={36} rx={10} fill="#8A5A32" />
    <rect y={960} width={1920} height={120} fill="#6B5A4A" />
  </g>
);
// yatak odası (gece), yatan kahraman için yatak
export const Yatak: React.FC<{ t: number }> = ({ t }) => (
  <g><Living t={t} night /><rect width={1920} height={1080} fill="#0B1426" opacity={0.35} />
    <rect x={420} y={760} width={1120} height={160} rx={20} fill="#6B4426" /><rect x={400} y={600} width={40} height={340} rx={12} fill="#5A3820" />
    <ellipse cx={560} cy={760} rx={110} ry={44} fill="#F4F4F4" /></g>
);
export const Battaniye: React.FC<{ x?: number }> = ({ x = 700 }) => <path d={`M${x},720 Q${x + 300},690 ${x + 820},730 L${x + 840},860 L${x},860Z`} fill="#3A7BD5" stroke="#2A5DA8" strokeWidth={6} />;
// pazar tezgâhları
export const Pazar: React.FC<{ t: number; px?: number; crowd?: number }> = ({ t, px = 0, crowd = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    {Array.from({ length: 7 }, (_, i) => <g key={i}><rect x={-100 + i * 300} y={120 + (i % 3) * 30} width={280} height={500} fill={["#E9B872", "#E3D2B4", "#D98C7A", "#C9D6A5"][i % 4]} />{Array.from({ length: 6 }, (_, k) => <rect key={k} x={-70 + i * 300 + (k % 2) * 130} y={170 + (i % 3) * 30 + Math.floor(k / 2) * 120} width={90} height={80} fill="#5E8BA6" />)}</g>)}
    <g transform={`translate(${-px},0)`}>
      {Array.from({ length: 8 }, (_, i) => {
        const x = -200 + i * 400;
        return <g key={i}>
          <path d={`M${x},320 L${x + 380},320 L${x + 400},420 L${x - 20},420Z`} fill={i % 2 ? T.green : T.red} />
          {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M${x + 20 + k * 76},320 l38,0 l6,100 l-46,0Z`} fill="#FFFFFF" opacity={0.85} />)}
          <rect x={x + 10} y={420} width={10} height={320} fill="#777" /><rect x={x + 360} y={420} width={10} height={320} fill="#777" />
          <rect x={x} y={640} width={380} height={30} fill="#8A5A32" /><rect x={x + 10} y={670} width={360} height={110} fill="#B07A4A" />
          {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={x + 40 + (k % 5) * 75} cy={620 - Math.floor(k / 5) * 34} r={24} fill={[T.orange, T.red, T.green, T.yellow, "#7E3A8A"][(k + i) % 5]} />)}
        </g>;
      })}
      {crowd > 0 && Array.from({ length: 22 }, (_, i) => { const x = ((i * 157 + t * (i % 2 ? 40 : -30)) % 3400 + 3400) % 3400 - 300; return <TMini key={i} x={x} y={850 + (i % 3) * 14} s={1.3 + (i % 3) * 0.1} c={MINI_COLS[(i * 7) % MINI_COLS.length]} t={t} seed={i} />; })}
    </g>
    <rect y={800} width={1920} height={280} fill="#8E949B" /><rect y={800} width={1920} height={280} fill="url(#tTile)" opacity={0.6} />
  </g>
);
// önde, arkasına saklanılan meyve tezgâhı
export const Tezgah: React.FC<{ x?: number }> = ({ x = 700 }) => (
  <g>
    <rect x={x - 380} y={820} width={760} height={40} fill="#8A5A32" /><rect x={x - 370} y={860} width={740} height={220} fill="#B07A4A" />
    {Array.from({ length: 30 }, (_, k) => { const row = Math.floor(k / 10); return <circle key={k} cx={x - 330 + (k % 10) * 74 + row * 20} cy={790 - row * 52} r={36} fill={[T.orange, T.red, T.yellow, T.green][(k + row) % 4]} stroke="#000" strokeOpacity={0.1} strokeWidth={3} />; })}
    <g transform={`translate(${x + 240},700)`}><rect x={-70} y={-40} width={140} height={60} rx={8} fill="#FFFFFF" stroke="#333" strokeWidth={3} /><text y={4} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill={T.red}>25 ₺</text></g>
  </g>
);
// hastane odası: yatak, monitör, pencere (dawn: gece→sabah)
export const Oda: React.FC<{ t: number; dawn?: number }> = ({ t, dawn = 0 }) => {
  const sky = dawn > 0.5 ? "#F2B880" : dawn > 0.2 ? "#5A5A8C" : "#1E3350";
  const pts = Array.from({ length: 30 }, (_, i) => { const x = i * 10; const ph = ((t * 1.2 * 30 + i) % 30); return `${x},${ph > 12 && ph < 15 ? (ph < 13.5 ? -40 : 30) : 0}`; }).join(" ");
  return (
    <g>
      <rect width={1920} height={1080} fill="#D6E6E3" /><rect y={540} width={1920} height={14} fill="#3E8E9E" />
      <rect x={1240} y={150} width={480} height={360} fill={sky} stroke="#FFFFFF" strokeWidth={16} />
      {dawn > 0.2 && <ellipse cx={1480} cy={500} rx={300} ry={120} fill="#FFE2A8" opacity={dawn * 0.6} />}
      <g fill={dawn > 0.5 ? "#7A5A6E" : "#0E1A2E"}><path d="M1260,510 L1260,440 L1400,440 Q1460,360 1520,440 L1700,440 L1700,510Z" /><rect x={1340} y={300} width={16} height={140} /><path d="M1336,300 L1348,262 L1360,300Z" /><rect x={1610} y={330} width={14} height={110} /></g>
      <path d="M1480,150 V510 M1240,330 H1720" stroke="#FFFFFF" strokeWidth={8} />
      <g transform="translate(330,520)"><rect x={-130} y={-120} width={260} height={180} rx={14} fill="#1A1E26" /><rect x={-114} y={-104} width={228} height={148} rx={8} fill="#0E1522" />
        <polyline transform="translate(-100,-30) scale(0.72,1)" points={pts} fill="none" stroke="#3FD48A" strokeWidth={5} /><rect x={-6} y={60} width={12} height={440} fill="#888" /></g>
      <rect x={560} y={780} width={980} height={100} rx={16} fill="#E8EEF2" stroke="#9AA5AD" strokeWidth={6} /><rect x={560} y={880} width={980} height={30} fill="#9AA5AD" />
      <rect x={540} y={640} width={30} height={420} rx={10} fill="#9AA5AD" /><rect x={1530} y={700} width={30} height={360} rx={10} fill="#9AA5AD" />
      <ellipse cx={680} cy={770} rx={120} ry={40} fill="#FFFFFF" />
      <rect y={1000} width={1920} height={80} fill="#B5C9C6" />
    </g>
  );
};
export const Carsaf: React.FC = () => <path d="M800,740 Q1100,700 1500,740 L1520,850 L800,850Z" fill="#BFE6F2" stroke="#8FB8C6" strokeWidth={6} />;
// köprü, gece trafiği, taksi
export const Kopru: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 67) % 300} r={2.5} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 48} y={600 - ((i * 37) % 90)} width={40} height={(i * 37) % 90 + 20} fill="#16243C" />)}
    {Array.from({ length: 60 }, (_, i) => <rect key={i} x={(i * 97) % 1920} y={540 + ((i * 53) % 70)} width={6} height={8} fill="#F6D27A" opacity={0.7} />)}
    <rect y={620} width={1920} height={120} fill="#14213A" />
    {[260, 1660].map((x) => <g key={x}><rect x={x - 30} y={140} width={60} height={600} fill="#3A4A66" /><rect x={x - 60} y={260} width={120} height={20} fill="#3A4A66" /><rect x={x - 60} y={520} width={120} height={20} fill="#3A4A66" /><circle cx={x} cy={150} r={8} fill={T.red} opacity={0.5 + 0.5 * Math.sin(t * 4)} /></g>)}
    <path d="M-200,620 Q260,140 260,140 Q960,620 1660,140 Q1660,140 2120,620" fill="none" stroke="#5A6A85" strokeWidth={10} />
    {Array.from({ length: 26 }, (_, i) => { const x = 300 + i * 52; const k = (x - 960) / 700; const y = 620 - 480 * k * k * 0.95 - 10; return <path key={i} d={`M${x},${Math.min(700, 140 + (620 - 140) * (1 - k * k))} V700`} stroke="#5A6A85" strokeWidth={3} opacity={y > 0 ? 1 : 1} />; })}
    <rect y={700} width={1920} height={380} fill="#2E3440" />
    <rect y={700} width={1920} height={20} fill="#5A6A85" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={((i * 140 - t * 60) % 2240 + 2240) % 2240 - 160} y={880} width={70} height={10} fill="#E8E8E8" opacity={0.7} />)}
    {Array.from({ length: 7 }, (_, i) => <g key={i}><CarP x={((i * 330 + t * 8) % 2400) - 240} y={820} s={0.5} c={MINI_COLS[(i * 3) % MINI_COLS.length]} /><circle cx={((i * 330 + t * 8) % 2400) - 240 - 122} cy={770} r={9} fill={T.red} /></g>)}
  </g>
);
export const Taksi: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g><CarP x={x} y={y} s={s} t={t * 0.2} c="#F6C445" /><g transform={`translate(${x + 30 * s},${y - 270 * s})`}><rect x={-60 * s} y={-24 * s} width={120 * s} height={40 * s} rx={8 * s} fill="#1C1C1C" /><text y={8 * s} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26 * s} fill={T.yellow}>TAKSİ</text></g>
    <circle cx={x - 248 * s} cy={y - 100 * s} r={12 * s} fill={T.red} /></g>
);
// banyo: ayna (içine yansıma çizilir)
export const Banyo: React.FC<{ t: number; children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect width={1920} height={1080} fill="#CFE3E8" /><rect width={1920} height={1080} fill="url(#tTile)" />
    <rect x={540} y={120} width={840} height={680} rx={36} fill="#8FA9B2" />
    <defs><clipPath id="mir"><rect x={570} y={150} width={780} height={620} rx={24} /></clipPath></defs>
    <g clipPath="url(#mir)"><rect x={570} y={150} width={780} height={620} fill="#E4EEF1" /><rect x={570} y={150} width={780} height={620} fill="url(#tTile)" opacity={0.6} />{children}
      <path d="M640,200 L760,200 L620,420Z" fill="#FFFFFF" opacity={0.35} /></g>
    <rect x={680} y={820} width={560} height={70} rx={30} fill="#FFFFFF" stroke="#C9D6DA" strokeWidth={6} /><rect x={930} y={780} width={60} height={46} rx={10} fill="#B9C5CC" />
    <rect x={860} y={890} width={200} height={190} fill="#E8EEF2" />
  </g>
);
// Balat cephesi: renkli evler, pencerede dede
export const Balat: React.FC<{ t: number; inside?: React.ReactNode; night?: boolean }> = ({ t, inside, night }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "url(#tSkyNight)" : "url(#tSkyDay)"} />
    {[["#D9534F", -100], ["#F6C445", 360], ["#3FAE6A", 1340], ["#7E5BD6", 1700]].map(([c, x]) => <g key={String(x)}><rect x={Number(x)} y={160} width={420} height={920} fill={String(c)} /><rect x={Number(x)} y={140} width={420} height={30} fill="#5A3820" />
      {[0, 1, 2].map((r) => [0, 1].map((cc) => <rect key={`${r}${cc}`} x={Number(x) + 60 + cc * 190} y={240 + r * 260} width={110} height={160} fill={night ? "#F6D27A" : "#5E8BA6"} stroke="#FFFFFF" strokeWidth={8} />))}</g>)}
    <rect x={760} y={120} width={600} height={960} fill="#4FA3C7" /><rect x={740} y={100} width={640} height={30} fill="#5A3820" />
    <rect x={800} y={160} width={520} height={50} fill="#3B8AAE" />
    <defs><clipPath id="bWin"><rect x={840} y={340} width={440} height={380} /></clipPath></defs>
    <g clipPath="url(#bWin)"><rect x={840} y={340} width={440} height={380} fill={night ? "#F6E3BE" : "#F3E2C6"} />{inside}</g>
    <rect x={840} y={340} width={440} height={380} fill="none" stroke="#FFFFFF" strokeWidth={16} /><path d="M1060,340 V720" stroke="#FFFFFF" strokeWidth={8} />
    <rect x={820} y={720} width={480} height={30} fill="#FFFFFF" />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${880 + i * 150},700)`}><rect x={-30} y={-40} width={60} height={40} fill="#B5651D" /><circle cx={-10} cy={-56} r={18} fill={T.red} /><circle cx={12} cy={-62} r={16} fill={T.pink} /><path d="M0,-40 q-6,-30 -20,-40" stroke="#3FAE6A" strokeWidth={6} fill="none" /></g>)}
    <rect y={960} width={1920} height={120} fill="#8A7A66" /><rect y={960} width={1920} height={120} fill="url(#tStone)" />
    <Lines t={t} n={0} />
  </g>
);
// telefon sohbet ekranı
export type Msg = [string, boolean, number];
export const Chat: React.FC<{ t: number; name: string; msgs: Msg[]; c?: string }> = ({ t, name, msgs, c = "#1E7A6E" }) => {
  let y = -300;
  return (
    <g>
      <rect width={1920} height={1080} fill="#14294A" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 263 + t * 20) % 1920} cy={(i * 151) % 1080} r={3} fill={T.rim} opacity={0.3} />)}
      <g transform="translate(960,560)">
        <rect x={-340} y={-520} width={680} height={1040} rx={64} fill="#151515" />
        <rect x={-310} y={-480} width={620} height={960} rx={34} fill="#ECE5DD" />
        <rect x={-310} y={-480} width={620} height={120} rx={34} fill={c} /><rect x={-310} y={-400} width={620} height={40} fill={c} />
        <circle cx={-230} cy={-420} r={36} fill="#FFFFFF" opacity={0.85} /><text x={-170} y={-408} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#FFFFFF">{name}</text>
        {msgs.map(([txt, me, at], i) => {
          if (t < at) return null;
          const lines = txt.split("\n");
          const w = Math.min(520, Math.max(...lines.map((l) => l.length)) * 19 + 60);
          const h = 50 + lines.length * 40;
          const k = ramp(t, at, at + 0.25);
          const yy = y; y += h + 26;
          const x0 = me ? 290 - w : -290;
          return <g key={i} transform={`translate(0,${(1 - k) * 30})`} opacity={k}>
            <rect x={x0} y={yy} width={w} height={h} rx={24} fill={me ? "#D9FDD3" : "#FFFFFF"} />
            {lines.map((l, j) => <text key={j} x={x0 + 30} y={yy + 58 + j * 40} fontFamily="Poppins" fontWeight={600} fontSize={32} fill="#1C1C1C">{l}</text>)}
          </g>;
        })}
      </g>
    </g>
  );
};
// görüntülü konuşma: ekranın içinde oda ve kişi
export const VideoCall: React.FC<{ t: number; children: React.ReactNode; z?: number }> = ({ children }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A2C48" />
    <rect x={320} y={120} width={1280} height={760} rx={30} fill="#151515" />
    <defs><clipPath id="vc"><rect x={360} y={160} width={1200} height={675} rx={10} /></clipPath></defs>
    <g clipPath="url(#vc)"><g transform="translate(360,160) scale(0.625)">{children}</g></g>
    <rect x={1300} y={600} width={230} height={200} rx={14} fill="#2B3A55" stroke="#FFFFFF" strokeWidth={4} />
    <g transform="translate(1415,800) scale(0.28)"><TFig x={0} y={0} o={HERO} t={0} eyes="happy" mouth="grin" /></g>
    <g transform="translate(960,940)">{[[-120, "#E0393E"], [0, "#5E6670"], [120, "#5E6670"]].map(([x, c]) => <circle key={String(x)} cx={Number(x)} cy={0} r={40} fill={String(c)} />)}</g>
    <rect x={380} y={180} width={110} height={44} rx={22} fill={T.red} /><text x={435} y={212} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFF">● CANLI</text>
  </g>
);
// kural kartı
// uzun kural cümlesini kelime sınırından satırlara böler (kısa cümleler eskisi gibi tek satır)
const wrapLine = (s: string, max: number) => s.split(" ").reduce<string[]>((acc, w) => { const last = acc[acc.length - 1]; if (last !== undefined && (last + " " + w).length <= max) acc[acc.length - 1] = last + " " + w; else acc.push(w); return acc; }, []);
export const Kural: React.FC<{ t: number; a: number; n: string; line: string }> = ({ t, a, n, line }) => {
  const k = ramp(t, a, a + 0.35);
  return (
    <g><Lab t={t} />
      <g transform={`translate(960,540) scale(${0.7 + 0.3 * k})`} opacity={k}>
        <rect x={-620} y={-260} width={1240} height={520} rx={40} fill="#0E1A2E" stroke={T.rim} strokeWidth={12} />
        <text y={-60} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={150} fill={T.yellow}>{n}</text>
        {line.length <= 34 ? <text y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={64} fill="#FFFFFF">{line}</text>
          : wrapLine(line, 36).map((l, i, all) => <text key={i} y={70 + i * 62 - (all.length - 2) * 31} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={50} fill="#FFFFFF">{l}</text>)}
      </g>
    </g>
  );
};
// pazar günleri ızgarası (52 hafta)
export const Pazarlar: React.FC<{ t: number; n: number; lit?: number }> = ({ t, n, lit = 0 }) => (
  <g><Lab t={t} />
    {Array.from({ length: 52 }, (_, i) => { const on = i < n; return <g key={i} transform={`translate(${300 + (i % 13) * 110},${300 + Math.floor(i / 13) * 130})`}>
      <rect x={-46} y={-50} width={92} height={100} rx={12} fill={on ? T.hero : "#1E3A64"} stroke={on ? T.rim : "#2A4A74"} strokeWidth={4} opacity={on ? 1 : 0.7} />
      <text y={16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={on ? "#0E1A2E" : "#5A7AA4"}>{on ? String(i + 1) : "P"}</text></g>; })}
    {lit > 0 && <rect x={240} y={240} width={1440} height={520} rx={20} fill="none" stroke={T.red} strokeWidth={10} strokeDasharray="30 20" opacity={lit} />}
  </g>
);
// laptop e-posta
export const Mail: React.FC<{ t: number; a: number; text: string; k: number; sent?: number; to?: string }> = ({ t, text, k, sent = 0, to = "İK · Berlin" }) => {
  const n = Math.floor(k * text.length);
  return (
    <g>
      <Study t={t} />
      <rect x={440} y={140} width={1040} height={640} rx={24} fill="#1A1E26" /><rect x={470} y={170} width={980} height={580} rx={10} fill="#F4F6F8" />
      <path d="M380,780 L1540,780 L1620,850 L300,850Z" fill="#9AA5AD" />
      <rect x={470} y={170} width={980} height={70} fill="#3A7BD5" /><text x={500} y={218} fontFamily="Poppins" fontWeight={800} fontSize={32} fill="#FFF">Yeni İleti</text>
      <text x={500} y={290} fontFamily="Poppins" fontWeight={600} fontSize={30} fill="#555">Kime: {to}</text><path d="M500,310 H1420" stroke="#D0D5DA" strokeWidth={3} />
      <text x={500} y={360} fontFamily="Poppins" fontWeight={600} fontSize={30} fill="#555">Konu: İş teklifi</text><path d="M500,380 H1420" stroke="#D0D5DA" strokeWidth={3} />
      <text x={500} y={460} fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#1C1C1C">{text.slice(0, n)}{Math.floor(t * 3) % 2 && k < 1 ? "|" : ""}</text>
      <g transform={`translate(1320,690) scale(${1 - 0.1 * Math.max(0, 1 - Math.abs(sent - 0.2) * 5)})`}><rect x={-100} y={-34} width={200} height={68} rx={34} fill={sent > 0.3 ? T.green : "#3A7BD5"} /><text y={12} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={32} fill="#FFF">{sent > 0.3 ? "✓ GİTTİ" : "GÖNDER"}</text></g>
      {sent > 0 && sent < 0.4 && <circle cx={1320} cy={690} r={30 + sent * 200} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={1 - sent * 2.5} />}
    </g>
  );
};
export const Zarf: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {open > 0 && <g transform={`translate(0,${-open * 260})`}><rect x={-230} y={-160} width={460} height={320} rx={8} fill="#FFFFFF" stroke="#DDD" strokeWidth={3} />
      <text y={-90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill={T.blue}>İŞ TEKLİFİ</text>
      <text y={-30} textAnchor="middle" fontFamily="Poppins" fontWeight={600} fontSize={28} fill="#555">Berlin · Almanya</text>
      {[20, 60, 100].map((yy) => <rect key={yy} x={-170} y={yy} width={340} height={12} rx={6} fill="#D9D9D9" />)}</g>}
    <rect x={-260} y={-150} width={520} height={300} rx={10} fill="#E9D3A8" stroke="#C9A86A" strokeWidth={4} />
    <path d="M-260,-150 L0,30 L260,-150" fill="none" stroke="#C9A86A" strokeWidth={5} />
    <rect x={150} y={-130} width={80} height={90} fill="#E0393E" opacity={0.85} />
  </g>
);
// yol ayrımı: 36 ve 3914
export const Yol: React.FC<{ t: number; pick: number; k?: number }> = ({ t, pick, k = 1 }) => (
  <g><Lab t={t} />
    <path d="M960,1080 L960,640" stroke="#5A6A85" strokeWidth={90} strokeLinecap="round" />
    <path d="M960,640 Q700,420 420,260" stroke={pick < 0.5 ? T.red : "#3A4A66"} strokeWidth={80} fill="none" strokeLinecap="round" opacity={k} />
    <path d="M960,640 Q1220,420 1500,260" stroke={pick >= 0.5 ? T.hero : "#3A4A66"} strokeWidth={80} fill="none" strokeLinecap="round" opacity={k} />
    <g opacity={k}><text x={420} y={200} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#FFFFFF">ALMANYA ✈</text><text x={420} y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={90} fill={T.red}>36</text>
      <text x={1500} y={200} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#FFFFFF">ÜSKÜDAR ⌂</text><text x={1500} y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={90} fill={T.hero}>3914</text></g>
    <TFig x={lerp(960, 1140, pick)} y={lerp(760, 560, pick)} s={0.4} o={HERO} t={t} rim={0.8} pose={pick > 0 && pick < 1 ? walkPose(t * 7) : P.stand} dir={1} />
  </g>
);
// çerçeveli dede fotoğrafı (yas kurdelesi)
export const DedeFoto: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-170} y={-210} width={340} height={420} fill="#D9B77A" /><rect x={-148} y={-188} width={296} height={376} fill="#EADFC6" />
    <g transform="translate(0,190) scale(0.62)"><TFig x={0} y={0} o={DEDE} t={t} eyes="happy" mouth="smile" /></g>
    <path d="M110,-210 L170,-210 L170,-150Z" fill="#1C1C1C" />
  </g>
);

// ───────── çekimler ─────────
const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Üsküdar", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[900, 560]} c1={[1100, 560]}><Uskudar t={t} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="ÜSKÜDAR · PAZAR SABAHI" />, sfx: "whoosh" },
  { c: "Annenin kapısındasın", r: (t, a, b) => {
    const k = ramp(t, a, a + 1.6);
    return <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[900, 600]}><Landing t={t} /><TFig x={lerp(200, 560, k)} y={G} s={0.62} o={HERO} t={t} pose={k < 1 ? walkPose(t * 7) : P.hand} holdR={<Poset s={0.6} t={t} />} mouth="smile" /></TCam>;
  } },
  { c: "Elinde bir poşet", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3]} c0={[620, 800]}><Landing t={t} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} mouth="smile" eyes="happy" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.4} text="SICACIK SİMİT" y={110} size={76} color={T.yellow} /> },
  { c: "Zile basıyorsun", r: (t, a, b) => {
    const k = ramp(t, a, a + 0.5);
    return <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1200, 640]}><Landing t={t} /><TFig x={1080} y={G} s={0.62} o={HERO} t={t} pose={{ l: [40, 95], r: [lerp(30, 95, k), lerp(60, 90, k)] }} holdL={<Poset s={0.55} t={t} />} look={1} /></TCam>;
  }, sfx: "doorbell" },
  { c: "Kapı açılıyor", r: (t, a, b) => {
    const k = ramp(t, a, a + 1);
    return <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[900, 680]}><Landing t={t} open={k} inside={<TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="grin" eyes="happy" pose={P.wave} />} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} mouth="smile" /></TCam>;
  } },
  { c: "Ve tam başının üstünde", r: (t, a, b) => {
    const k = ramp(t, a + (b - a) * 0.4, b - 0.3);
    return <TCam t={t} a={a} b={b} z={[1.5, 2.4]} c0={[880, 760]} c1={[1000, 560]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1000} y={G} n={37} k={k} /></>} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} eyes="wide" mouth="o" look={1} lookY={-1} /></TCam>;
  }, sfx: "ding" },
  { c: "Otuz yedi", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3.4, 3.8]} c0={[1000, 560]} shake={ramp(t, a, a + 0.2) * 3}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1000} y={G} n={37} at={a + 0.05} from={37} /></>} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text="37" y={820} size={120} color={T.rim} />, sfx: "boom" },
  { c: "Gözlerini ovuşturuyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[560, 760]}><Landing t={t} open={1} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={{ l: [120 + Math.sin(t * 18) * 8, 240], r: [120 - Math.sin(t * 18) * 8, 240] }} eyes="closed" mouth="flat" /></TCam> },
  { c: "Sayı hâlâ orada", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[800, 700]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1000} y={G} n={37} /></>} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} eyes="wide" mouth="o" sweat look={1} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.5} text="HÂLÂ ORADA" y={80} size={80} /> },
  { c: "Annen gülüyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 720]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="grin" eyes="happy" talk={t > a + 0.9} pose={P.hips} /><Num t={t} x={1000} y={G} n={37} /></>} /><Bub t={t} at={a + 0.9} x={1100} y={420} text="Ne oldu oğlum, hayalet mi gördün?" size={34} /></TCam> },
  { c: "Arkada, salondaki koltukta", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[1000, 560]} c1={[1200, 640]}><Salon t={t} /><TFig x={1320} y={1097} s={0.62} o={DEDE} t={t} dir={-1} pose={P.sit} mouth="smile" /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.4} text="DEDEN" c={T.blue} x={1500} /> },
  { c: "Sana el sallıyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1320, 800]}><Salon t={t} /><TFig x={1320} y={1097} s={0.62} o={DEDE} t={t} dir={-1} pose={{ ...P.sit, r: [150 + Math.sin(t * 9) * 15, 175] }} eyes="happy" /></TCam> },
  { c: "Onun başının üstünde de", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.6]} c0={[1320, 800]} c1={[1320, 640]}><Salon t={t} /><TFig x={1320} y={1097} s={0.62} o={DEDE} t={t} dir={-1} pose={P.sit} mouth="smile" /><Num t={t} x={1320} y={1097} n={1} k={ramp(t, a + 0.4, a + 1.2)} /></TCam> },
  { c: "Bir. Sadece", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3.4, 3.8]} c0={[1320, 640]} shake={ramp(t, a, a + 0.2) * 3}><Salon t={t} /><TFig x={1320} y={1097} s={0.62} o={DEDE} t={t} dir={-1} pose={P.sit} /><Num t={t} x={1320} y={1097} n={1} at={a + 0.05} from={1} /></TCam>, sfx: "boom" },
  { c: "Sadece bir", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[560, 760]}><Landing t={t} open={1} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} eyes="wide" mouth="frown" brow="worried" pose={P.shock} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text="SADECE 1" y={90} size={110} color={T.yellow} /> },
  { c: "O sabah henüz bilmiyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 600]}><Salon t={t} /><TFig x={700} y={G} s={0.62} o={MOM} t={t} mouth="smile" /><Num t={t} x={700} y={G} n={37} /><TFig x={1320} y={1097} s={0.62} o={DEDE} t={t} dir={-1} pose={P.sit} /><Num t={t} x={1320} y={1097} n={1} /><TFig x={1000} y={G} s={0.62} o={HERO} t={t} look={1} mouth="flat" /></TCam> },
  { c: "bu sayılar bu insanları", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      {[0, 1, 2, 3, 4].map((i) => { const k = ramp(t, a + i * 0.35, a + i * 0.35 + 0.3); return <g key={i} opacity={k} transform={`translate(${380 + i * 290},0)`}><TFig x={0} y={900} s={0.42} o={HERO} t={t} seed={i} eyes="happy" /><TFig x={70} y={900} s={0.42} o={MOM} t={t} dir={-1} seed={i + 3} /><text x={35} y={480} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill={T.rim}>{5 - i}</text></g>; })}
    </TFrame>
  ), html: (t, a) => <Txt t={t} at={a + 0.3} text="KAÇ KEZ DAHA GÖRECEĞİN" y={90} size={84} color={T.yellow} />, sfx: "tick" },
  { c: "Annenle otuz yedi", r: (t, a, b) => (
    <TFrame bg="#1A2C48"><rect width={960} height={1080} fill="#2C8A7E" /><rect x={960} width={960} height={1080} fill="#2A2E48" />
      <TFig x={480} y={1000} s={0.72} o={MOM} t={t} mouth="smile" /><Num t={t} x={480} y={1000} s={0.72} n={37} />
      <g opacity={ramp(t, a + (b - a) * 0.5, a + (b - a) * 0.6)}><TFig x={1440} y={1060} s={0.72} o={DEDE} t={t} dir={-1} pose={P.sit} /><Num t={t} x={1440} y={1060} s={0.72} n={1} /></g></TFrame>
  ), html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="ANNEN: 37 BULUŞMA" x={480} w={900} y={940} size={58} /><Txt t={t} at={a + (b - a) * 0.55} text="DEDEN: 1" x={1440} w={900} y={940} size={58} color={T.yellow} /></> },
  { c: "Peki herkesin başında", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 600]}><Istiklal t={t} px={(t - a) * 30} />
      {Array.from({ length: 9 }, (_, i) => { const x = 160 + i * 200; return <g key={i}><TMini x={x} y={900} s={2.2} c={MINI_COLS[i % MINI_COLS.length]} t={t} seed={i} /><MiniNum x={x} y={900} s={2.2} n={["0", "12", "0", "3", "214", "0", "1", "57", "0"][i]} k={ramp(t, a + i * 0.15, a + i * 0.15 + 0.3)} /></g>; })}</TCam>
  ), html: (t, a) => <Txt t={t} at={a + 0.6} text="KİMİ GÖRMEK İÇİN KOŞARDIN?" y={80} size={80} color={T.yellow} /> },
  { c: "ve kimden kaçardın", r: (t, a, b) => (
    <TFrame bg="#1A2C48"><rect width={960} height={1080} fill="#2C8A7E" /><rect x={960} width={960} height={1080} fill="#3A1E2E" />
      <TFig x={480} y={1000} s={0.72} o={HERO} t={t} pose={runPose(t * 12)} eyes="happy" mouth="grin" /><Lines t={t} y0={600} y1={980} />
      <TFig x={1440} y={1000} s={0.72} o={HERO} t={t} dir={-1} pose={runPose(t * 12)} eyes="wide" brow="worried" mouth="frown" sweat /></TFrame>
  ), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="KOŞARDIN?" x={480} w={900} y={90} size={110} color={T.yellow} /><Txt t={t} at={a + (b - a) * 0.4} text="KAÇARDIN?" x={1440} w={900} y={90} size={110} color={T.red} /></> },

  // ── KURAL 1 ──
  { c: "Kahvaltı boyunca", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 620]}><Living t={t} night={false} /><TFig x={560} y={G} s={0.62} o={MOM} t={t} mouth="smile" /><Num t={t} x={560} y={G} n={37} /><TFig x={1360} y={G} s={0.62} o={DEDE} t={t} dir={-1} /><Num t={t} x={1360} y={G} n={1} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} look={Math.sin((t - a) * 2) > 0 ? 1 : -1} lookY={-1} mouth="flat" /><Sofra t={t} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="KAHVALTI" c={T.orange} />, sfx: "whoosh" },
  { c: "Annen çay dolduruyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[640, 700]}><Living t={t} night={false} /><TFig x={560} y={G} s={0.62} o={MOM} t={t} mouth="smile" pose={P.reach} holdR={<Caydanlik s={0.7} tilt={20} />} /><Num t={t} x={560} y={G} n={37} /><Sofra t={t} /></TCam>, html: (t, a) => <Txt t={t} at={a + 1.2} text="SAYI DEĞİŞMİYOR" y={860} size={66} /> },
  { c: "Deden peynir uzatıyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1280, 700]}><Living t={t} night={false} /><TFig x={1360} y={G} s={0.62} o={DEDE} t={t} dir={-1} mouth="smile" eyes="happy" pose={P.reach} holdR={<rect x={-30} y={-14} width={60} height={28} rx={4} fill="#FFF6D6" />} /><Num t={t} x={1360} y={G} n={1} /><Sofra t={t} /></TCam>, html: (t, a) => <Txt t={t} at={a + 1.1} text="SAYI DEĞİŞMİYOR" y={860} size={66} /> },
  { c: "Kapıdan çıkarken", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[860, 760]}><Landing t={t} open={1} inside={<><TFig x={940} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={HUG} eyes="happy" mouth="smile" /><Num t={t} x={940} y={G} n={37} /></>} /><TFig x={800} y={G} s={0.62} o={HERO} t={t} pose={HUG} eyes="closed" mouth="smile" /></TCam> },
  { c: "Merdivenden inerken", r: (t, a, b) => {
    const k = ramp(t, a, b);
    return <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[700, 640]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={P.wave} mouth="smile" /><Num t={t} x={1000} y={G} n={37} /></>} /><TFig x={lerp(460, 300, k)} y={lerp(G, 1110, k)} s={0.62} o={HERO} t={t} pose={walkPose(t * 5)} look={1} lookY={-1} /></TCam>;
  } },
  { c: "37 gitmiş", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3.2, 3.5]} c0={[1000, 560]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={P.wave} mouth="smile" /><Num t={t} x={1000} y={G} n={36} from={37} at={AT_36} /></>} /></TCam>, html: (t, a, b) => <Txt t={t} at={AT_36 + 0.3} text="37 → 36" y={860} size={96} color={T.rim} />, sfx: "tick" },
  { c: "Ertesi sabah metroya", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 600]}><Peron t={t} sign="METRO · ÜSKÜDAR" door={1} gates /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="ERTESİ SABAH" c={T.blue} />, sfx: "whoosh" },
  { c: "Herkesin başında bir sayı", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 640]}><Peron t={t} sign="METRO · ÜSKÜDAR" door={1} />
      {Array.from({ length: 10 }, (_, i) => { const x = 120 + i * 190 + ((t - a) * (i % 2 ? 20 : -20)); return <g key={i}><TMini x={x} y={980 + (i % 2) * 30} s={2.4} c={MINI_COLS[(i * 3) % MINI_COLS.length]} t={t} seed={i} /><MiniNum x={x} y={980 + (i % 2) * 30} s={2.4} n={["0", "0", "4", "0", "0", "19", "0", "0", "2", "0"][i]} k={ramp(t, a + 0.2 + i * 0.1, a + 0.4 + i * 0.1)} /></g>; })}</TCam>
  ) },
  { c: "Turnikedeki görevli", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[700, 780]}><Peron t={t} sign="METRO · ÜSKÜDAR" door={1} gates /><TFig x={680} y={G} s={0.62} o={GUARD} t={t} mouth="flat" /><Num t={t} x={680} y={G} n={214} k={ramp(t, a + 0.6, a + 1)} /></TCam> },
  { c: "Yanındaki takım elbiseli", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1100, 780]}><Peron t={t} sign="METRO · ÜSKÜDAR" door={1} /><TFig x={1000} y={G} s={0.62} o={HERO} t={t} look={1} /><TFig x={1200} y={G} s={0.64} o={SUIT_OUTFIT} t={t} dir={-1} pose={P.phone} holdR={<PhoneP s={0.8} />} mouth="flat" /><Num t={t} x={1200} y={G} s={0.64} n={0} k={ramp(t, a + 0.8, a + 1.2)} /></TCam> },
  { c: "Karşıdaki öğrenci", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.5, 1.2]} c0={[960, 740]}><Peron t={t} sign="METRO · ÜSKÜDAR" door={1} /><TFig x={960} y={G} s={0.62} o={OGR} t={t} pose={P.phone} holdR={<PhoneP s={0.8} />} lookY={1} /><Num t={t} x={960} y={G} n={0} k={ramp(t, a + 0.5, a + 0.9)} />
      {[300, 560, 1360, 1620].map((x, i) => <g key={x}><TFig x={x} y={G} s={0.56} o={{ top: MINI_COLS[i + 3], top2: MINI_COLS[i + 3], shoes: "#FFF" }} t={t} seed={i} dir={i % 2 ? -1 : 1} /><Num t={t} x={x} y={G} s={0.56} n={0} k={ramp(t, a + 1.2 + i * 0.4, a + 1.5 + i * 0.4)} /></g>)}</TCam>
  ), sfx: "pop" },
  { c: "İstanbul'da her gün", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.3, 1]} c0={[960, 700]}><Istiklal t={t} px={(t - a) * 40} />
      {Array.from({ length: 16 }, (_, i) => { const x = 60 + i * 120; return <g key={i}><TMini x={x} y={880 + (i % 3) * 30} s={1.8} c={MINI_COLS[(i * 7) % MINI_COLS.length]} t={t} seed={i} /><MiniNum x={x} y={880 + (i % 3) * 30} s={1.8} n="0" /></g>; })}</TCam>
  ), html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="BİNLERCE İNSAN" y={80} size={80} /><Txt t={t} at={a + (b - a) * 0.55} text="BİR DAHA ASLA" y={240} size={100} color={T.red} /></> },
  { c: "Kadıköy Çarşısı'na", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[900, 560]} c1={[1100, 560]}><Istiklal t={t} px={300 + (t - a) * 60} crowd /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="KADIKÖY ÇARŞI" c={T.green} />, sfx: "whoosh" },
  { c: "Her sabah simit aldığın", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[1000, 760]}><Istiklal t={t} px={500} crowd={false} /><SimitCart x={1080} t={t} /><TFig x={1240} y={G} s={0.62} o={HASAN} t={t} dir={-1} mouth="grin" eyes="happy" pose={P.wave} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.6} text="HASAN ABİ" c={T.red} x={1300} y={80} /> },
  { c: "Başında 1212", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.8]} c0={[1240, 640]}><Istiklal t={t} px={500} crowd={false} /><SimitCart x={1080} t={t} /><TFig x={1240} y={G} s={0.62} o={HASAN} t={t} dir={-1} mouth="grin" /><Num t={t} x={1240} y={G} n={1212} k={ramp(t, a, a + 0.4)} /></TCam>, sfx: "ding" },
  { c: "Simidi alıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[1040, 740]}><Istiklal t={t} px={500} crowd={false} /><SimitCart x={1080} t={t} /><TFig x={1240} y={G} s={0.62} o={HASAN} t={t} dir={-1} mouth="grin" pose={P.reach} holdR={<Simit x={0} y={0} s={0.8} />} /><Num t={t} x={1240} y={G} n={1212} /><TFig x={780} y={G} s={0.62} o={HERO} t={t} pose={P.reach} mouth="smile" talk={t > a + 1} /><Bub t={t} at={a + 1.2} x={780} y={480} text="Kolay gelsin abi!" size={42} tail={1} /></TCam> },
  { c: "Dönüp bakıyorsun 1211", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3]} c0={[1240, 620]}><Istiklal t={t} px={500} crowd={false} /><SimitCart x={1080} t={t} /><TFig x={1240} y={G} s={0.62} o={HASAN} t={t} dir={-1} mouth="smile" /><Num t={t} x={1240} y={G} n={1211} from={1212} at={AT_1211} /></TCam>, html: (t) => <Txt t={t} at={AT_1211 + 0.3} text="−1" y={820} size={120} color={T.rim} />, sfx: "tick" },
  { c: "İşte ilk kural", r: (t, a) => <Kural t={t} a={a} n="KURAL 1" line="Sayı gün saymaz. Buluşma sayar." />, sfx: "boom" },
  { c: "Sayı gün saymıyor", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} /><Calendar x={600} y={540} top="GÜN" big="✕" k={ramp(t, a, a + 0.3)} /><Cross x={600} y={540} r={200} k={ramp(t, a + 0.6, a + 1)} />
      <g transform="translate(1320,540)" opacity={ramp(t, a + 1.2, a + 1.5)}><circle r={200} fill="#FFFFFF" stroke="#333" strokeWidth={12} /><path d={`M0,0 L${Math.sin(t) * 90},${-Math.cos(t) * 90} M0,0 L${Math.sin(t * 8) * 150},${-Math.cos(t * 8) * 150}`} stroke="#333" strokeWidth={12} strokeLinecap="round" /></g><Cross x={1320} y={540} r={200} k={ramp(t, a + 1.8, a + 2.2)} /></TFrame>
  ) },
  { c: "Sadece buluşmaları sayıyor", r: (t, a, b) => {
    const k = ramp(t, a, a + 1.2);
    return <TFrame bg="#14294A"><Lab t={t} /><TFig x={lerp(300, 820, k)} y={900} s={0.6} o={HERO} t={t} pose={k < 1 ? walkPose(t * 7) : P.wave} eyes="happy" /><TFig x={lerp(1620, 1100, k)} y={900} s={0.6} o={EMRE} t={t} dir={-1} pose={k < 1 ? walkPose(t * 7) : P.wave} eyes="happy" /><Num t={t} x={lerp(1620, 1100, k)} y={900} s={0.6} n={5} from={6} at={a + 1.3} /></TFrame>;
  }, html: (t, a) => <Txt t={t} at={a + 0.3} text="SADECE BULUŞMALAR" y={70} size={86} color={T.yellow} /> },
  { c: "Her yüz yüze", r: (t, a, b) => {
    const n = 5 - Math.min(3, Math.floor((t - a) / 0.9));
    return <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]}><Lab t={t} /><TFig x={840} y={900} s={0.6} o={HERO} t={t} pose={P.reach} eyes="happy" /><TFig x={1080} y={900} s={0.6} o={EMRE} t={t} dir={-1} pose={P.reach} eyes="happy" /><Num t={t} x={1080} y={900} s={0.6} n={n} from={n + 1} at={a + (5 - n) * 0.9 - 0.4} /></TCam>;
  }, html: (t, a) => <Txt t={t} at={a + 0.6} text="HER KARŞILAŞMA = −1" y={900} size={70} color={T.rim} />, sfx: "tick" },

  // ── OYUN ──
  { c: "İlk günler bunun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]}><Istiklal t={t} px={(t - a) * 50} crowd={false} /><TFig x={960} y={G} s={0.66} o={HERO} t={t} pose={P.cheer} eyes="happy" mouth="grin" rim={0.5} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="OYUN" c={T.purple} />, sfx: "whoosh" },
  { c: "Ofiste müdürünün", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[1100, 640]}><Office t={t} night={false} /><TFig x={1300} y={G} s={0.66} o={MUDUR} t={t} dir={-1} pose={P.hips} mouth="flat" /><Num t={t} x={1300} y={G} s={0.66} n={2840} k={ramp(t, a + 1.2, a + 1.6)} /><TFig x={700} y={G} s={0.62} o={HERO} t={t} look={1} lookY={-1} mouth="o" /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="MÜDÜR" c="#1E2128" x={1500} /> },
  { c: "Bu en az 10 yıl", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      <text x={960} y={330} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={130} fill="#FFFFFF" opacity={ramp(t, a, a + 0.3)}>2840 ÷ 5 gün</text>
      <text x={960} y={560} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={110} fill={T.yellow} opacity={ramp(t, a + 1, a + 1.3)}>≈ 568 hafta</text>
      <text x={960} y={820} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={180} fill={T.red} opacity={ramp(t, a + 2, a + 2.3)}>10+ YIL</text></TFrame>
  ), sfx: "tick" },
  { c: "Bilgisayarın başında", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 2.4]} c0={[960, 700]}><Office t={t} night={false} /><TFig x={960} y={G} s={0.66} o={HERO} t={t} eyes="open" mouth="flat" bob={0} /><rect width={1920} height={1080} fill="#0E1A2E" opacity={ramp(t, a, b) * 0.3} /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="10 YIL…" y={90} size={90} color={T.red} /> },
  { c: "Apartmanın kapısında", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 720]}><Landing t={t} plate="3" door="#3E5A7A" /><TFig x={720} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<g transform="translate(0,10)"><rect x={-14} y={-6} width={28} height={12} rx={4} fill="#E8C468" /></g>} brow="worried" mouth="flat" /><TFig x={1100} y={G} s={0.62} o={AYTEN} t={t} dir={-1} mouth="grin" talk pose={P.hips} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.6} text="AYTEN TEYZE" c={T.green} x={1300} y={80} /> },
  { c: "Başında 6000", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.8]} c0={[1100, 640]}><Landing t={t} plate="3" door="#3E5A7A" /><TFig x={1100} y={G} s={0.62} o={AYTEN} t={t} dir={-1} mouth="grin" eyes="happy" /><Num t={t} x={1100} y={G} n={6000} k={ramp(t, a, a + 0.4)} /></TCam>, sfx: "ding" },
  { c: "6000 kez daha", r: (t, a, b) => {
    const n = Math.min(6, 1 + Math.floor((t - a) * 2.2));
    return <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 620]}><Landing t={t} plate="3" door="#3E5A7A" /><TFig x={720} y={G} s={0.62} o={HERO} t={t} eyes="squint" mouth="flat" sweat /><TFig x={1100} y={G} s={0.62} o={AYTEN} t={t} dir={-1} mouth="grin" talk pose={P.hand} />
      {Array.from({ length: n }, (_, i) => <Bub key={i} t={t} at={a} x={420 + (i % 3) * 540} y={180 + Math.floor(i / 3) * 170 + (i % 2) * 30} text="Ne zaman evleniyorsun?" size={36} />)}</TCam>;
  }, html: (t, a) => <Txt t={t} at={a + 1.6} text="× 6000" y={900} size={110} color={T.yellow} />, sfx: "pop" },
  { c: "Kaçış yok", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.1]} c0={[720, 760]}><Landing t={t} plate="3" door="#3E5A7A" /><TFig x={720} y={G} s={0.62} o={HERO} t={t} eyes="closed" brow="worried" mouth="frown" sweat /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text="KAÇIŞ YOK" y={90} size={110} color={T.red} /> },
  { c: "Eski sevgilin", r: (t, a, b) => {
    const k = ramp(t, a, b);
    return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}><Istiklal t={t} px={200} crowd={false} /><TFig x={lerp(1500, 1100, k)} y={940} s={0.5} o={EX} t={t} dir={-1} pose={walkPose(t * 7)} mouth="flat" /><TFig x={600} y={G} s={0.62} o={HERO} t={t} look={1} eyes="wide" mouth="o" /></TCam>;
  }, html: (t, a) => <Tag t={t} at={a + 0.4} text="ESKİ SEVGİLİ" c={T.red} x={1300} y={80} /> },
  { c: "Başında sıfır", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[1080, 700]}><Istiklal t={t} px={200} crowd={false} /><TFig x={1080} y={940} s={0.5} o={EX} t={t} dir={-1} pose={walkPose(t * 7)} mouth="flat" /><Num t={t} x={1080} y={940} s={0.5} n={0} k={ramp(t, a, a + 0.3)} /></TCam>, sfx: "ding" },
  { c: "İlk kez bir sayı", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[600, 760]}><Istiklal t={t} px={200} crowd={false} /><TFig x={600} y={G} s={0.62} o={HERO} t={t} eyes="happy" mouth="grin" pose={{ l: [8, 6], r: [60, 170] }} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.4} text="OH BE!" y={90} size={110} color={T.green} /> },
  { c: "Akşam vapurdasın", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[900, 600]}><Uskudar t={t} dusk={1} boat /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="AKŞAM · VAPUR" c={T.orange} />, sfx: "whoosh" },
  { c: "Yan koltukta", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 700]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={{ ...P.sit, l: [40, 95], r: [40, 95] }} lookY={1} eyes="squint" holdR={<rect x={-50} y={-40} width={100} height={70} rx={6} fill="#3A7BD5" />} /></TCam> },
  { c: "Adını bilmiyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, 720]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} lookY={Math.max(-1, -(t - a))} eyes="open" /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={{ ...P.sit, l: [40, 95], r: [40, 95] }} lookY={1} eyes="squint" holdR={<rect x={-50} y={-40} width={100} height={70} rx={6} fill="#3A7BD5" />} /></TCam> },
  { c: "9400", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.8]} c0={[1160, 600]} shake={ramp(t, a, a + 0.2) * 3}><VapurIc t={t} /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={{ ...P.sit, l: [40, 95], r: [40, 95] }} lookY={1} eyes="squint" holdR={<rect x={-50} y={-40} width={100} height={70} rx={6} fill="#3A7BD5" />} /><Num t={t} x={1160} y={990} n={9400} at={a + 0.05} from={9400} /></TCam>, sfx: "boom" },
  { c: "Bir daha bakıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[760, 720]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={{ ...P.sit, l: [120 + Math.sin(t * 18) * 8, 240], r: [120, 240] }} eyes="closed" /></TCam> },
  { c: "Hala 9400", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} eyes="wide" mouth="o" /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={{ ...P.sit, l: [40, 95], r: [40, 95] }} lookY={1} eyes="squint" holdR={<rect x={-50} y={-40} width={100} height={70} rx={6} fill="#3A7BD5" />} /><Num t={t} x={1160} y={990} n={9400} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.3} text="HÂLÂ 9400" y={860} size={80} color={T.yellow} /> },
  { c: "Kız kitabından", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1000, 700]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} eyes="wide" mouth="flat" sweat /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={{ ...P.sit, l: [40, 95], r: [40, 95] }} brow="up" talk={t > a + 1.8} holdR={<rect x={-50} y={-40} width={100} height={70} rx={6} fill="#3A7BD5" />} /><Num t={t} x={1160} y={990} n={9400} /><Bub t={t} at={a + 1.9} x={1220} y={420} text="Bir sorun mu var?" size={42} /></TCam> },
  { c: "Hayır diyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[900, 700]}><VapurIc t={t} /><TFig x={760} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} mouth="smile" talk /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={P.sit} brow="up" /><Num t={t} x={1160} y={990} n={9400} /><Bub t={t} at={a + 0.1} x={700} y={460} text="Hayır…" size={44} tail={1} /><Bub t={t} at={a + 1.1} x={800} y={300} text="Sadece galiba çok görüşeceğiz." size={36} tail={1} /></TCam> },
  { c: "Kız gülüyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[1160, 700]}><VapurIc t={t} /><TFig x={1160} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={P.sit} eyes="happy" mouth="grin" /><Num t={t} x={1160} y={990} n={9400} /><Heart x={1300} y={500} s={0.6 + 0.1 * Math.sin(t * 6)} c={T.pink} /></TCam>, html: (t, a) => <Txt t={t} at={a + 1} text="ADI ZEYNEP" y={860} size={86} color={T.pink} /> },

  // ── SIFIR ──
  { c: "Ama bir akşam Marmaray'da", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 600]}><Peron t={t} door={0} inside={MARM_IN(t)} />{PERON_CROWD(t, 0)}</TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="MARMARAY · AKŞAM" c={T.red} />, sfx: "whoosh" },
  { c: "Kalabalığın içinde", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.7]} c0={[700, 560]}><Peron t={t} door={0} inside={MARM_IN(t)} />{PERON_CROWD(t, 0)}<circle cx={530} cy={470} r={lerp(240, 120, ramp(t, a, a + 1.2))} fill="none" stroke={T.yellow} strokeWidth={10} opacity={ramp(t, a + 0.6, a + 1)} /></TCam> },
  { c: "Emre, çocukluk arkadaşın", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[530, 500]}><Peron t={t} door={0} inside={MARM_IN(t, "happy")} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="EMRE · ÇOCUKLUK ARKADAŞIN" c={T.green} /> },
  { c: "Aynı sokakta büyüdünüz", m: "ÇOCUKLUK · AYNI SOKAK", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 760]}><Istiklal t={t} px={700} crowd={false} />
      <TFig x={760} y={G} s={0.4} o={HERO} t={t} pose={runPose(t * 12)} eyes="happy" mouth="grin" /><TFig x={1180} y={G} s={0.4} o={EMRE} t={t} dir={-1} pose={P.kick} eyes="happy" mouth="grin" />
      <circle cx={lerp(1100, 820, ((t - a) * 0.8) % 1)} cy={1000 - Math.sin(((t - a) * 0.8 % 1) * Math.PI) * 140} r={22} fill="#FFFFFF" stroke="#222" strokeWidth={4} /></TCam>
  ) },
  { c: "aynı müdür odasında", m: "ÇOCUKLUK · MÜDÜR ODASI", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 760]}><Office t={t} night={false} /><TFig x={820} y={G} s={0.4} o={HERO} t={t} eyes="closed" mouth="frown" lookY={1} /><TFig x={1000} y={G} s={0.4} o={EMRE} t={t} eyes="closed" mouth="smile" lookY={1} /><TFig x={1300} y={G} s={0.66} o={MUDUR} t={t} dir={-1} pose={P.point} brow="angry" talk /></TCam>
  ) },
  { c: "Yıllardır bir gün", r: (t, a) => <Chat t={t} name="Emre" msgs={[["Bir gün buluşalım!", false, a + 0.2], ["Kesin! Bu hafta?", true, a + 0.7], ["Bu ay olmaz…", false, a + 1.2], ["Bir gün buluşalım!", true, a + 1.6], ["Kesin kardeşim 😅", false, a + 2]]} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="YILLARDIR" x={300} w={500} y={420} size={60} color={T.yellow} />, sfx: "pop" },
  { c: "Başının üstünde sıfır", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3]} c0={[530, 420]} shake={ramp(t, a, a + 0.2) * 3}><Peron t={t} door={0} inside={MARM_IN(t)} over={<Num t={t} x={530} y={790} s={0.7} n={0} k={ramp(t, a, a + 0.3)} c="#FFB3B3" />} /></TCam>, sfx: "boom" },
  { c: "Kapılar kapanmak üzere", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[880, 560]}><Peron t={t} door={lerp(0, 0.6, ramp(t, a, b))} inside={MARM_IN(t)} over={<Num t={t} x={530} y={790} s={0.7} n={0} c="#FFB3B3" />} />{PERON_CROWD(t, 0)}</TCam>, sfx: "buzz" },
  { c: "Bağırıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1240, 760]}><Peron t={t} door={0.65} inside={MARM_IN(t)} /><TFig x={1240} y={G} s={0.62} o={HERO} t={t} dir={-1} pose={P.reach} eyes="wide" brow="worried" mouth="open" /><Bub t={t} at={a + 0.4} x={1160} y={460} text="EMRE!" size={64} /></TCam> },
  { c: "Kalabalığı itiyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1100, 760]} shake={5}><Peron t={t} door={0.75} inside={MARM_IN(t)} />{PERON_CROWD(t, (t - a) * 30)}<TFig x={lerp(1400, 1150, ramp(t, a, b))} y={G} s={0.62} o={HERO} t={t} dir={-1} pose={runPose(t * 14)} brow="angry" mouth="open" /></TCam>, sfx: "whoosh" },
  { c: "Ama kapılar kapanıyor", r: (t, a, b) => {
    const k = ramp(t, a, a + 0.8);
    return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}><Peron t={t} door={lerp(0.75, 1, k)} px={Math.pow(Math.max(0, t - a - 1), 2) * 120} inside={MARM_IN(t, "wide")} over={<Num t={t} x={530} y={790} s={0.7} n={0} c="#FFB3B3" />} /><TFig x={1150} y={G} s={0.62} o={HERO} t={t} dir={-1} pose={P.reach} eyes="wide" mouth="o" /></TCam>;
  }, sfx: "buzz" },
  { c: "Camın arkasında", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[600, 480]}><Peron t={t} door={1} px={120 + (t - a) * 380} inside={MARM_IN(t, "wide")} over={<Num t={t} x={530} y={790} s={0.7} n={0} c="#FFB3B3" />} /><Lines t={t} y0={300} y1={800} /></TCam> },
  { c: "Sıfır. Onu bir daha", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]} c0={[960, 600]}><Peron t={t} train={false} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="open" brow="worried" mouth="frown" /></TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.1} text="0" y={180} size={200} color="#FFB3B3" /><Txt t={t} at={a + (b - a) * 0.4} text="BİR DAHA HİÇ" y={860} size={80} /></> },
  { c: "O gece ona yazıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 720]}><Yatak t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} lookY={1} mouth="flat" /></TCam> },
  { c: "Seni marmarayda gördüm", r: (t, a) => <Chat t={t} name="Emre" msgs={[["Seni Marmaray'da gördüm.", true, a + 0.1], ["Ben de seni gördüm kardeşim!", false, a + 2.4]]} />, sfx: "pop" },
  { c: "Hafta sonu Almanya'ya", r: (t, a) => <Chat t={t} name="Emre" msgs={[["Seni Marmaray'da gördüm.", true, 0], ["Ben de seni gördüm kardeşim!", false, 0], ["Hafta sonu Almanya'ya\ntaşınıyorum. İş çıktı.", false, a + 0.1], ["Bir görüntülü konuşalım.", false, a + 2.2]]} />, html: (t, a) => <Tag t={t} at={a + 0.4} text="ALMANYA ✈" c={T.blue} x={1400} y={80} />, sfx: "pop" },
  { c: "Ve konuşuyorsunuz", r: (t) => <VideoCall t={t}><Living t={t} night /><TFig x={960} y={1040} s={0.9} o={EMRE} t={t} eyes="happy" mouth="grin" talk /></VideoCall>, sfx: "ding" },
  { c: "Gülüyorsunuz", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><VideoCall t={t}><Living t={t} night /><TFig x={960} y={1040} s={0.9} o={EMRE} t={t} eyes="happy" mouth="grin" pose={{ l: [8, 6], r: [40, 150] }} /></VideoCall></TCam>, html: (t, a) => <Txt t={t} at={a + 0.4} text="SAATLERCE" y={60} size={70} color={T.yellow} /> },
  { c: "Ama ekrandaki yüzün", r: (t, a, b) => (
    <TCam t={t} a={a} b={b} z={[1.2, 2]} c0={[960, 500]} c1={[960, 300]}><VideoCall t={t}><Living t={t} night /><TFig x={960} y={1040} s={0.9} o={EMRE} t={t} eyes="happy" mouth="smile" /></VideoCall>
      <rect x={830} y={170} width={260} height={150} rx={20} fill="none" stroke={T.rim} strokeWidth={8} strokeDasharray="22 14" opacity={ramp(t, a + 1, a + 1.4)} /><text x={960} y={275} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={90} fill={T.rim} opacity={ramp(t, a + 1.2, a + 1.6)}>?</text></TCam>
  ), html: (t, a) => <Txt t={t} at={a + 1.4} text="SAYI YOK" y={860} size={90} color={T.rim} /> },
  { c: "İkinci kural", r: (t, a) => <Kural t={t} a={a} n="KURAL 2" line="Ekran sayılmaz. Göz göze olmalı." />, sfx: "boom" },
  { c: "Sayı sadece gerçek", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Lab t={t} /><TFig x={720} y={900} s={0.6} o={HERO} t={t} look={1} eyes="happy" /><TFig x={1200} y={900} s={0.6} o={EMRE} t={t} dir={-1} look={1} eyes="happy" /><Num t={t} x={1200} y={900} s={0.6} n={1} /><path d="M760,630 H1160" stroke={T.rim} strokeWidth={6} strokeDasharray="20 14" opacity={ramp(t, a + 0.8, a + 1.2)} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.3} text="GERÇEK BULUŞMA" y={80} size={84} color={T.yellow} /> },
  { c: "Ekran sayılmıyor", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><g transform="translate(960,540) scale(5)"><PhoneP s={1} screen="#7FD8F0" /></g><Cross x={960} y={540} r={220} k={ramp(t, a + 0.3, a + 0.9)} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 0.2} text="EKRAN ✕" y={70} size={90} /> },
  { c: "Ses sayılmıyor", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><g transform="translate(960,540)">{[0, 1, 2].map((i) => <path key={i} d={`M${60 + i * 60},-${100 + i * 50} q${60 + i * 20},${100 + i * 50} 0,${200 + i * 100}`} stroke="#FFFFFF" strokeWidth={18} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 6 - i)} />)}<path d="M-160,-70 L-60,-70 L40,-170 L40,170 L-60,70 L-160,70Z" fill="#FFFFFF" /></g><Cross x={960} y={540} r={220} k={ramp(t, a + 0.3, a + 0.9)} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 0.2} text="SES ✕" y={70} size={90} /> },
  { c: "Sadece aynı yerde", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[960, 700]}><Uskudar t={t} /><TFig x={820} y={G} s={0.62} o={HERO} t={t} look={1} eyes="happy" mouth="smile" /><TFig x={1100} y={G} s={0.62} o={EMRE} t={t} dir={-1} eyes="happy" mouth="smile" /></TCam>, html: (t, a, b) => <Txt t={t} at={a + 0.3} text="AYNI YER · AYNI HAVA" y={80} size={80} color={T.yellow} /> },
  { c: "Göz göze", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3.4, 3.8]} c0={[960, 760]}><Uskudar t={t} /><TFig x={850} y={G} s={0.62} o={HERO} t={t} look={1} /><TFig x={1070} y={G} s={0.62} o={EMRE} t={t} dir={-1} look={1} /><path d="M890,755 H1030" stroke={T.rim} strokeWidth={5} strokeDasharray="10 8" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.1} text="GÖZ GÖZE" y={110} size={100} color={T.rim} />, sfx: "ding" },

  // ── ANNE ──
  { c: "Sonra aklına annen", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Yatak t={t} /><TFig x={760} y={G} s={0.62} o={HERO} t={t} pose={P.think} mouth="flat" brow="worried" /><g opacity={0.55 * ramp(t, a + 0.6, a + 1.2)}><TFig x={1240} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1240} y={G} n={36} /></g></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="ANNE" c={T.pink} />, sfx: "whoosh" },
  { c: "Her pazar onu ziyaret", r: (t, a) => <Pazarlar t={t} n={0} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="HER PAZAR" y={60} size={80} color={T.yellow} /> },
  { c: "Hesabı yapıyorsun", r: (t, a, b) => <Pazarlar t={t} n={Math.min(36, Math.floor(ramp(t, a + 0.2, b - 0.3) * 36))} />, html: (t, a, b) => <Txt t={t} at={a + 0.2} text={`${Math.min(36, Math.floor(ramp(t, a + 0.2, b - 0.3) * 36))} PAZAR`} y={60} size={90} color={T.rim} />, sfx: "tick" },
  { c: "Bir yıl bile etmiyor", r: (t, a) => <Pazarlar t={t} n={36} lit={ramp(t, a, a + 0.4)} />, html: (t, a) => <Txt t={t} at={a + 0.2} text="BİR YIL BİLE ETMİYOR" y={830} size={80} color={T.red} />, sfx: "boom" },
  { c: "O gece uyuyamıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[700, 700]}><Yatak t={t} /><g transform="translate(1060,790) rotate(-90)"><TFig x={0} y={0} s={1} o={HERO} t={t} eyes="wide" mouth="flat" look={-1} /></g><Battaniye x={720} /><text x={1420} y={360} fontFamily="Poppins" fontWeight={800} fontSize={60} fill={T.red}>03:{String(17 + Math.floor((t - a) * 3)).padStart(2, "0")}</text></TCam> },
  { c: "Annen hasta mı", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 600]}><Yatak t={t} /><g transform="translate(1060,790) rotate(-90)"><TFig x={0} y={0} s={1} o={HERO} t={t} eyes="wide" brow="worried" mouth="frown" /></g><Battaniye x={720} /><Bub t={t} at={a + 0.1} x={700} y={300} text="Annen hasta mı?" size={44} ghost /><Bub t={t} at={a + 1.4} x={1240} y={180} text="Benden bir şey mi saklıyor?" size={40} ghost /></TCam> },
  { c: "Sabah ilk iş", r: (t, a, b) => (
    <TFrame bg="#0E1A2E"><g transform="scale(0.5) translate(0,540)"><Office t={t} night={false} /><TFig x={960} y={G} s={0.9} o={HERO} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} talk mouth="flat" brow="worried" /></g>
      <g transform="translate(960,0) scale(0.5) translate(0,540)"><Kitchen t={t} /><TFig x={960} y={G} s={0.9} o={MOM} t={t} dir={-1} pose={P.phone} holdR={<PhoneP s={0.9} />} mouth="grin" eyes="happy" talk={t > a + 1.5} /></g><rect x={955} y={270} width={10} height={540} fill="#FFFFFF" /></TFrame>
  ), html: (t, a) => <Txt t={t} at={a + 1.8} text="SESİ GAYET İYİ" y={110} size={70} color={T.green} />, sfx: "ding" },
  { c: "Doktor mu", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1000, 720]}><Kitchen t={t} /><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={P.hips} mouth="grin" talk={t > a + 1.2} /><Bub t={t} at={a} x={600} y={300} text="Doktor mu?" size={40} ghost tail={1} /><Bub t={t} at={a + 1.3} x={1100} y={430} text="Ne doktoru oğlum, ben turp gibiyim!" size={34} /><g opacity={ramp(t, a + 2, a + 2.3)}><Turp x={1500} y={760} s={1.2} /></g></TCam> },
  { c: "Ama sen inanmıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[960, 720]}><Office t={t} night={false} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} eyes="squint" brow="angry" mouth="flat" /></TCam> },
  { c: "Ve aklına korkunç", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.8]} c0={[960, 700]}><Yatak t={t} /><rect width={1920} height={1080} fill="#2A0E1A" opacity={0.5} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="wide" mouth="o" rim={ramp(t, a, b) * 0.6} /><g transform="translate(960,330)" opacity={ramp(t, a + 0.6, a + 1)}><circle r={60} fill={T.red} /><rect x={-26} y={50} width={52} height={40} rx={8} fill="#888" /><ellipse r={140} ry={140} fill="url(#tGlow)" opacity={0.4} /></g></TCam>, sfx: "boom" },
  { c: "Eğer sayı buluşmaları", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      <text x={200} y={330} fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFFFFF">HER HAFTA</text>
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={560 + i * 100} cy={315} r={30} fill={T.hero} opacity={ramp(t, a + i * 0.12, a + i * 0.12 + 0.2)} />)}
      <text x={1820} y={330} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={44} fill={T.red}>BİTTİ</text>
      <g opacity={ramp(t, a + 2.2, a + 2.6)}><text x={200} y={680} fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFFFFF">AYDA BİR</text>
        {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={560 + i * 330} cy={665} r={30} fill={T.yellow} />)}<text x={1820} y={680} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={44} fill={T.green}>DAHA UZUN?</text></g></TFrame>
  ) },
  { c: "sayı daha uzun dayanır", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]}><Lab t={t} /><TFig x={960} y={940} s={0.66} o={MOM} t={t} mouth="smile" /><Num t={t} x={960} y={940} s={0.66} n={36} /><g transform="translate(1400,600)"><path d="M-70,-120 L70,-120 L0,0 L70,120 L-70,120 L0,0Z" fill="none" stroke="#FFFFFF" strokeWidth={10} /><path d={`M${-50 + 30 * ramp(t, a, b)},-100 L${50 - 30 * ramp(t, a, b)},-100 L0,-10Z`} fill={T.yellow} /><path d={`M0,10 L${-50 * ramp(t, a, b)},110 L${50 * ramp(t, a, b)},110Z`} fill={T.yellow} /></g></TCam>, html: (t, a) => <Txt t={t} at={a + 0.3} text="DAHA AZ GÖRÜRSEN…" y={80} size={80} color={T.yellow} /> },
  { c: "Belki annene zaman", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.9]} c0={[960, 700]}><Yatak t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="squint" mouth="smile" rim={0.3} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.4} text="ZAMAN KAZANDIRIRSIN?" y={90} size={84} color={T.yellow} /> },
  { c: "Böylece annenden kaçmaya", r: (t, a, b) => {
    const k = ramp(t, a, b);
    return <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[860, 640]}><Landing t={t} /><TFig x={lerp(640, 160, k)} y={G} s={0.62} o={HERO} t={t} dir={-1} pose={walkPose(t * 8)} brow="worried" mouth="flat" /></TCam>;
  }, html: (t, a) => <Tag t={t} at={a + 0.2} text="KAÇIŞ" c={T.red} />, sfx: "whoosh" },
  { c: "Pazar günleri işim var", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 700]}><Office t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} talk mouth="flat" look={-1} /><Bub t={t} at={a + 0.1} x={1000} y={420} text="Pazar işim var anne." size={40} tail={1} /></TCam> },
  { c: "Bayramda nöbetteyim", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><Calendar x={960} y={560} top="BAYRAM" big="🌙" k={ramp(t, a, a + 0.3)} /><Cross x={960} y={560} r={220} k={ramp(t, a + 0.7, a + 1.3)} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 0.3} text="“NÖBETTEYİM”" y={70} size={84} /> },
  { c: "Onu sadece telefonda", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]}><Office t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.phone} holdR={<PhoneP s={0.9} ring={t} />} mouth="smile" talk /></TCam> },
  { c: "Çünkü ekran sayılmıyor", r: (t) => <VideoCall t={t}><Kitchen t={t} /><TFig x={960} y={1040} s={0.9} o={MOM} t={t} mouth="smile" talk /></VideoCall>, html: (t, a) => <Txt t={t} at={a + 0.3} text="EKRAN SAYILMAZ" y={40} size={70} color={T.rim} /> },
  { c: "Sayı otuz altıda", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.7]} c0={[960, 560]}><Kitchen t={t} /><TFig x={960} y={G} s={0.62} o={MOM} t={t} mouth="flat" lookY={1} /><Num t={t} x={960} y={G} n={36} c="#DFF6FF" /><g opacity={ramp(t, a + 0.4, a + 1)}>{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M960,580 l${Math.cos(i * 0.8) * 110},${Math.sin(i * 0.8) * 80}`} stroke="#DFF6FF" strokeWidth={6} />)}</g></TCam>, html: (t, a) => <Txt t={t} at={a + 0.6} text="DONUP KALIYOR" y={860} size={76} color="#DFF6FF" /> },
  { c: "Ve sen buna onu korumak", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, 720]}><Office t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.hips} mouth="smile" eyes="squint" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.6} text="BUNA “KORUMAK” DİYORSUN" y={90} size={76} /> },
  { c: "Bir cumartesi", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[900, 580]} c1={[1060, 580]}><Pazar t={t} px={(t - a) * 30} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="ÜSKÜDAR PAZARI · CUMARTESİ" c={T.green} />, sfx: "whoosh" },
  { c: "Gizlice", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[700, 760]}><Pazar t={t} px={200} crowd={0} /><TFig x={700} y={G} s={0.62} o={HERO} t={t} pose={walkPose(t * 4)} eyes="squint" brow="worried" look={1} mouth="flat" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.1} text="GİZLİCE" y={100} size={90} color={T.yellow} /> },
  { c: "Bir meyve tezgahının", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 700]}><Pazar t={t} px={200} crowd={0} /><TFig x={1400} y={900} s={0.5} o={MOM} t={t} dir={-1} pose={P.hold} holdR={<Poset s={0.6} simit={false} />} /><Num t={t} x={1400} y={900} s={0.5} n={36} /><TFig x={640} y={1080} s={0.7} o={HERO} t={t} look={1} eyes="open" brow="worried" mouth="flat" /><Tezgah x={620} /></TCam> },
  { c: "İki ağır poşet", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1200, 720]}><Pazar t={t} px={200 + (t - a) * 20} crowd={0} /><TFig x={lerp(1400, 1200, ramp(t, a, b))} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={{ ...walkPose(t * 3, false), l: [10, 10], r: [10, 10] }} holdR={<Poset s={0.7} simit={false} heavy />} holdL={<Poset s={0.7} simit={false} heavy />} mouth="flat" /><Num t={t} x={lerp(1400, 1200, ramp(t, a, b))} y={G} n={36} /></TCam> },
  { c: "Yalnız", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 0.95]} c0={[960, 600]}><Pazar t={t} px={300} crowd={0} /><TFig x={1100} y={980} s={0.5} o={MOM} t={t} dir={-1} pose={{ l: [10, 10], r: [10, 10] }} holdR={<Poset s={0.7} simit={false} heavy />} holdL={<Poset s={0.7} simit={false} heavy />} mouth="flat" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.1} text="YALNIZ" y={100} size={100} /> },
  { c: "Bir an duruyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1100, 720]}><Pazar t={t} px={300} crowd={0} /><TFig x={1100} y={G} s={0.62} o={MOM} t={t} dir={-1} pose={{ l: [10, 10], r: [10, 10], lean: 8 }} holdR={<Poset s={0.7} simit={false} heavy />} holdL={<Poset s={0.7} simit={false} heavy />} eyes="closed" mouth="open" sweat bob={Math.sin(t * 5) * 5} /><Num t={t} x={1100} y={G} n={36} /></TCam> },
  { c: "Koşup poşetleri", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[700, 760]}><Pazar t={t} px={300} crowd={0} /><TFig x={680} y={1080} s={0.7} o={HERO} t={t} pose={{ ...P.reach, lean: 4 + Math.sin(t * 8) * 4 }} eyes="wide" brow="worried" mouth="open" look={1} /><Tezgah x={620} /></TCam> },
  { c: "Ama yerinden kıpırdamıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[660, 700]}><Pazar t={t} px={300} crowd={0} /><TFig x={660} y={1080} s={0.7} o={HERO} t={t} eyes="open" brow="worried" mouth="frown" look={1} bob={0} /><Tezgah x={620} /></TCam> },
  { c: "Çünkü o seni görmüyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[1100, 640]}><Pazar t={t} px={300} crowd={0} /><TFig x={lerp(1100, 1300, ramp(t, a, b))} y={G} s={0.62} o={MOM} t={t} dir={1} pose={{ ...walkPose(t * 3, false), l: [10, 10], r: [10, 10] }} holdR={<Poset s={0.7} simit={false} heavy />} holdL={<Poset s={0.7} simit={false} heavy />} mouth="flat" /><Num t={t} x={lerp(1100, 1300, ramp(t, a, b))} y={G} n={36} /></TCam>, html: (t, a) => <Txt t={t} at={a + 1.4} text="SAYI DÜŞMÜYOR" y={860} size={76} color={T.rim} /> },
  { c: "Ve hayatında hiç", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3.2]} c0={[660, 700]}><Pazar t={t} px={300} crowd={0} /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.55} /><TFig x={660} y={1080} s={0.7} o={HERO} t={t} eyes="closed" brow="worried" mouth="frown" lookY={1} /><Tears x={660} y={1080} s={0.7} t={t} /><Tezgah x={620} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.6} text="HİÇ BU KADAR KÖTÜ BİR EVLAT OLMADIN" y={90} size={62} /> },
  { c: "Annenin sesi her hafta", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Kitchen t={t} /><TFig x={960} y={G} s={0.62} o={MOM} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} eyes="squint" mouth="flat" brow="worried" /><Num t={t} x={960} y={G} n={36} /><Calendar x={1540} y={420} s={0.6} top="HAFTA" big={String(1 + Math.floor((t - a) * 2.5))} /></TCam> },
  { c: "Gelmiyorsun artık", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 640]}><Kitchen t={t} /><TFig x={960} y={G} s={0.62} o={MOM} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} eyes="squint" mouth="frown" brow="worried" talk /><Num t={t} x={960} y={G} n={36} /><Bub t={t} at={a + 0.1} x={1000} y={240} text="Gelmiyorsun artık…" size={42} /><Bub t={t} at={a + 2.2} x={1000} y={380} text="Deden de seni soruyor." size={40} /></TCam> },

  // ── DEDE ──
  { c: "Deden, başında bir yazan", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[1060, 560]}><Balat t={t} inside={<><TFig x={1060} y={900} s={0.5} o={DEDE} t={t} eyes="happy" mouth="smile" /><Num t={t} x={1060} y={900} s={0.5} n={1} /></>} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="DEDE · BALAT" c={T.blue} />, sfx: "whoosh" },
  { c: "Ondan da kaçıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 700]}><Istiklal t={t} px={900} crowd={false} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} dir={-1} pose={P.back} brow="worried" mouth="flat" /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="SONRAKİ BULUŞMA = SON BULUŞMA" y={90} size={66} color={T.red} /> },
  { c: "Gitmezsen belki", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 620]}><Lab t={t} /><Calendar x={960} y={560} top="SON GÜN" big="?" k={ramp(t, a, a + 0.3)} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.8} text="HİÇ GELMEZ Mİ?" y={860} size={80} color={T.yellow} /> },
  { c: "Belki deden sonsuza", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.7]} c0={[1060, 560]}><Balat t={t} inside={<><TFig x={1000} y={920} s={0.5} o={DEDE} t={t} eyes="happy" mouth="smile" pose={P.hold} /><Num t={t} x={1000} y={920} s={0.5} n={1} /><Tavla x={1100} y={700} s={0.6} /><Dice x={1120} y={690} n={1 + Math.floor(t * 3) % 6} s={0.7} /></>} /></TCam>, html: (t, a) => <Txt t={t} at={a + 1.2} text="SONSUZA KADAR?" y={860} size={80} color={T.yellow} /> },
  { c: "Sen yedi yaşındayken", m: "SEN 7 YAŞINDAYKEN", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 760]}><Living t={t} night={false} /><TFig x={700} y={1097} s={0.62} o={DEDE} t={t} pose={P.sit} eyes="happy" mouth="smile" /><Koltuk x={700} c="#8B6B4A" /><TFig x={700} y={1097} s={0.62} o={DEDE} t={t} pose={P.sit} eyes="happy" mouth="smile" talk /><TFig x={1200} y={G} s={0.38} o={HERO} t={t} dir={-1} eyes="open" mouth="smile" /><Tavla x={960} y={880} s={0.8} /></TCam> },
  { c: "Zarları avucuna", m: "SEN 7 YAŞINDAYKEN", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[1080, 800]}><Living t={t} night={false} /><TFig x={1200} y={G} s={0.38} o={HERO} t={t} dir={-1} pose={P.hand} holdR={<g><Dice x={0} y={-10} n={6} s={0.6} rot={10} /><Dice x={20} y={-20} n={5} s={0.6} rot={-12} /></g>} eyes="happy" mouth="o" /><Tavla x={960} y={880} s={0.8} /><Bub t={t} at={a + 0.3} x={900} y={500} text="Üfle! Şans üflemeyi sever." size={40} /></TCam> },
  { c: "Her seferinde sana yenilir", m: "SEN 7 YAŞINDAYKEN", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 780]}><Living t={t} night={false} /><Koltuk x={700} c="#8B6B4A" /><TFig x={700} y={1097} s={0.62} o={DEDE} t={t} pose={{ ...P.sit, l: [20, 120], r: [20, 120] }} eyes="closed" mouth="o" brow="worried" /><TFig x={1200} y={G} s={0.38} o={HERO} t={t} dir={-1} pose={P.cheer} eyes="happy" mouth="grin" /><Tavla x={960} y={880} s={0.8} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.6} text="“OLAMAZ, YİNE YENDİN!”" y={90} size={66} /> },
  { c: "Sen de her seferinde", m: "SEN 7 YAŞINDAYKEN", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[1200, 860]}><Living t={t} night={false} /><TFig x={1200} y={G} s={0.38} o={HERO} t={t} dir={-1} pose={P.cheer} eyes="happy" mouth="grin" bob={Math.abs(Math.sin(t * 8)) * -10} /></TCam> },
  { c: "Üç ay geçiyor", r: (t, a, b) => <TFrame bg="#14294A"><Lab t={t} /><Calendar x={960} y={560} top="AY" big={["EKİM", "KASIM", "ARALIK", "OCAK"][Math.min(3, Math.floor((t - a) * 3))]} /></TFrame>, sfx: "tick" },
  { c: "Bir gece saat ikide", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]} shake={2}><Yatak t={t} /><g transform="translate(1060,790) rotate(-90)"><TFig x={0} y={0} s={1} o={HERO} t={t} eyes={t > a + 1 ? "wide" : "closed"} mouth="flat" /></g><Battaniye x={720} /><g transform="translate(1600,700)"><PhoneP s={3} ring={t} screen={T.red} /></g><text x={1420} y={360} fontFamily="Poppins" fontWeight={800} fontSize={80} fill={T.red}>02:00</text></TCam>, sfx: "buzz" },
  { c: "Annen ağlıyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 640]}><Hastane t={t} night /><TFig x={960} y={G} s={0.62} o={MOM} t={t} pose={P.phone} holdR={<PhoneP s={0.9} />} eyes="closed" brow="worried" mouth="open" talk /><Tears x={960} y={G} s={0.62} t={t} /><Bub t={t} at={a + 1.3} x={1060} y={300} text="Deden hastanede. Hemen gel!" size={40} /></TCam> },
  { c: "Taksiye atlıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 600]}><Kopru t={t} /><Taksi x={960} y={1000} s={0.9} t={t} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="KÖPRÜ · TRAFİK" c={T.red} />, sfx: "whoosh" },
  { c: "Kalbin göğsünü", r: (t, a, b) => { const p = 1 + 0.18 * Math.max(0, Math.sin(t * 14)); return <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 700]} shake={3}><NightRoad t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="wide" brow="worried" mouth="open" sweat /><Heart x={960} y={760} s={0.5 * p} /></TCam>; }, sfx: "tick" },
  { c: "Ve o anda anlıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3.2]} c0={[960, 720]}><NightRoad t={t} /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.5} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="wide" mouth="o" rim={ramp(t, a, b)} /></TCam> },
  { c: "Sayı dedeni ölümden", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><g transform="translate(960,560)" opacity={ramp(t, a, a + 0.3)}><path d="M0,-230 L190,-160 Q190,90 0,230 Q-190,90 -190,-160Z" fill="#1E3A64" stroke={T.rim} strokeWidth={14} /><text y={60} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={190} fill="#FFFFFF">1</text></g><Cross x={960} y={560} r={240} k={ramp(t, a + 0.8, a + 1.4)} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 0.4} text="SAYI KORUMUYORDU" y={60} size={86} color={T.red} /> },
  { c: "Sayı sadece sana", r: (t, a, b) => <TFrame bg="#14294A"><Lab t={t} />{Array.from({ length: 3 }, (_, i) => <g key={i} transform={`translate(${620 + i * 340},560) scale(${ramp(t, a + i * 0.4, a + i * 0.4 + 0.3)})`}><circle r={130} fill={T.yellow} stroke="#FFFFFF" strokeWidth={10} /><text y={50} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={140} fill="#14294A">{i === 0 ? "1" : "?"}</text></g>)}</TFrame>, html: (t, a) => <Txt t={t} at={a + 0.4} text="KAÇ ŞANSIN KALDIĞINI SÖYLÜYORDU" y={60} size={70} color={T.yellow} /> },
  { c: "Ve sen bu şansı", r: (t, a, b) => <TFrame bg="#14294A"><Lab t={t} /><g transform={`translate(960,${560 + ramp(t, a + 0.6, b) * 600})`} opacity={1 - ramp(t, b - 0.8, b)}><circle r={130} fill={T.yellow} stroke="#FFFFFF" strokeWidth={10} /><text y={50} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={140} fill="#14294A">1</text></g><TFig x={1500} y={1000} s={0.6} o={HERO} t={t} dir={-1} eyes="closed" brow="worried" mouth="frown" lookY={1} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 0.5} text="KAÇARAK HARCADIN" y={70} size={86} color={T.red} /> },
  { c: "Hastane koridorunda", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 640]} shake={3}><Hastane t={t} night /><TFig x={960} y={lerp(800, 1060, ramp(t, a, b))} s={lerp(0.4, 0.66, ramp(t, a, b))} o={HERO} t={t} pose={runPose(t * 13)} brow="worried" mouth="open" /></TCam>, sfx: "whoosh" },
  { c: "Kapıyı açıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[1000, 620]}><Oda t={t} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="squint" mouth="flat" /></g><Carsaf /><rect width={1920} height={1080} fill="#0E1A2E" opacity={1 - ramp(t, a, a + 0.6)} /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="GÖZLERİ YARI AÇIK" y={860} size={70} />, sfx: "pop" },
  { c: "Başının üstünde hala bir", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2.2]} c0={[700, 640]}><Oda t={t} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="squint" mouth="smile" /></g><Carsaf /><Num t={t} x={682} y={909} s={0.55} n={1} k={ramp(t, a, a + 0.5)} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.8} text="HÂLÂ 1" y={80} size={90} color={T.yellow} /> },
  { c: "Yanına oturuyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[620, 740]}><Oda t={t} /><TFig x={440} y={1150} s={0.62} o={HERO} t={t} pose={{ ...P.sit, r: [80, 90] }} brow="worried" mouth="flat" /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="squint" mouth="smile" /></g><Carsaf /><Num t={t} x={682} y={909} s={0.55} n={1} /></TCam> },
  { c: "Deden gülümsüyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[720, 700]}><Oda t={t} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="happy" mouth="smile" talk={t > a + 1.2} /></g><Carsaf /><Bub t={t} at={a + 1.3} x={1100} y={560} text="Tavla borcun var." size={42} /></TCam> },
  { c: "Geçen sefer beni yendin", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[640, 720]}><Oda t={t} /><TFig x={440} y={1150} s={0.62} o={HERO} t={t} pose={{ ...P.sit, r: [80, 90] }} eyes="happy" mouth="smile" /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="happy" mouth="smile" talk /></g><Carsaf /><Bub t={t} at={a + 0.1} x={900} y={480} text="Geçen sefer beni yendin," size={38} /><Bub t={t} at={a + 1.5} x={900} y={600} text="rövanşı vermedin!" size={38} /></TCam> },
  { c: "Gülüyorsun ve ağlıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[440, 840]}><Oda t={t} /><TFig x={440} y={1150} s={0.62} o={HERO} t={t} pose={{ ...P.sit, r: [80, 90] }} eyes="happy" mouth="grin" /><Tears x={440} y={1150} s={0.62} t={t} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.8} text="AYNI ANDA" y={90} size={90} /> },
  { c: "O gece dedenle", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1100, 620]}><Oda t={t} dawn={ramp(t, a, b) * 0.3} /><TFig x={440} y={1150} s={0.62} o={HERO} t={t} pose={{ ...P.sit, r: [80, 90] }} mouth="smile" talk={Math.sin(t) > 0} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="happy" mouth="smile" talk={Math.sin(t) <= 0} /></g><Carsaf /><Num t={t} x={682} y={909} s={0.55} n={1} /><text x={330} y={300} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#FFFFFF" stroke="#0E1A2E" strokeWidth={6} paintOrder="stroke">0{2 + Math.floor((t - a) * 0.8)}:{String(Math.floor(((t - a) * 47) % 60)).padStart(2, "0")}</text></TCam> },
  { c: "Sana hiç anlatmadığı", m: "DEDENİN GENÇLİĞİ", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 640]}><Uskudar t={t} boat /><TFig x={960} y={G} s={0.66} o={{ ...DEDE, mustacheColor: "#2A2A2A", hairColor: "#2A2A2A" }} t={t} eyes="happy" mouth="smile" pose={P.wave} /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="GENÇLİĞİ · KORKULARI" y={90} size={70} color={T.yellow} /> },
  { c: "Sabah ezanıyla", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[1000, 560]}><Oda t={t} dawn={lerp(0.5, 1, ramp(t, a, b))} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="closed" mouth="smile" bob={0} /></g><Carsaf /><Num t={t} x={682} y={909} s={0.55} n={1} /></TCam> },
  { c: "Ve başının üstündeki sayı, sessizce", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.8]} c0={[700, 600]}><Oda t={t} dawn={1} /><g transform="translate(1140,780) rotate(-90)"><TFig x={0} y={0} s={1} o={DEDE} t={t} eyes="closed" mouth="smile" bob={0} /></g><Carsaf /><Num t={t} x={682} y={909} s={0.55} n={0} from={1} at={AT_D0} k={1 - ramp(t, AT_D0 + 1.2, b - 0.2)} /></TCam>, html: (t) => <Txt t={t} at={AT_D0 + 0.3} text="0" y={860} size={110} color="#DFF6FF" until={AT_D0 + 2.6} /> },

  // ── YOL ──
  { c: "Cenazeden sonra", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 640]}><Living t={t} night /><rect width={1920} height={1080} fill="#0B1426" opacity={0.4} /><TFig x={960} y={G} s={0.62} o={{ ...HERO, top: "#2A2E36", top2: "#1E2128" }} t={t} eyes="closed" brow="worried" mouth="flat" lookY={1} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="SONRA" c="#2A2E36" />, sfx: "whoosh" },
  { c: "Banyoda aynaya", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 520]}><Banyo t={t}><TFig x={960} y={1060} s={0.75} o={{ ...HERO, top: "#2A2E36", top2: "#1E2128" }} t={t} eyes="open" brow="worried" mouth="flat" /></Banyo></TCam> },
  { c: "Kendi başının üstünde", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.8]} c0={[960, 480]} c1={[960, 360]}><Banyo t={t}><TFig x={960} y={1060} s={0.75} o={{ ...HERO, top: "#2A2E36", top2: "#1E2128" }} t={t} eyes="open" mouth="flat" /><rect x={850} y={190} width={220} height={130} rx={18} fill="none" stroke={T.rim} strokeWidth={8} strokeDasharray="20 14" opacity={ramp(t, a + 0.6, a + 1)} /></Banyo></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SAYILAR SENİ SAYMIYOR" y={860} size={76} color={T.rim} /> },
  { c: "Masanda bir zarf", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[1000, 640]}><Study t={t} /><Zarf x={1000} y={620} s={0.6} /></TCam> },
  { c: "Bir ay önce gelen", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[1000, 500]}><Study t={t} /><Zarf x={1000} y={620} s={0.6} open={ramp(t, a, a + 0.8)} /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BERLİN · BÜYÜK ŞİRKET" y={880} size={66} /> },
  { c: "Maaş burada", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      <rect x={560} y={900 - 180 * ramp(t, a, a + 0.5)} width={260} height={180 * ramp(t, a, a + 0.5)} fill="#5A6A85" /><text x={690} y={970} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFF">BURADA</text>
      <rect x={1100} y={900 - 540 * ramp(t, a + 0.6, a + 1.4)} width={260} height={540 * ramp(t, a + 0.6, a + 1.4)} fill={T.yellow} /><text x={1230} y={970} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFF">BERLİN</text>
      <text x={1230} y={320} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={120} fill={T.yellow} opacity={ramp(t, a + 1.4, a + 1.7)}>×3</text></TFrame>
  ), sfx: "tick" },
  { c: "Gelecek ay gidiyorsun", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${460 + i * 250},560)`} opacity={ramp(t, a + 1.4 + i * 0.12, a + 1.6 + i * 0.12)}><TFig x={0} y={150} s={0.36} o={i === 4 ? MOM : { top: MINI_COLS[i], top2: MINI_COLS[i], shoes: "#FFF" }} t={t} seed={i} mouth="smile" />
        <circle cx={0} cy={-170} r={42} fill={i === 4 ? T.red : T.green} /><text x={0} y={-152} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFF">{i === 4 ? "✕" : "✓"}</text></g>)}
    </TFrame>
  ), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="GELECEK AY ✈ BERLİN" y={60} size={76} /><Txt t={t} at={a + (b - a) * 0.7} text="ANNEN HARİÇ" y={880} size={84} color={T.red} /></> },
  { c: "Ve birden kafanda", r: (t, a, b) => { const f = Math.max(0, 1 - (t - a - 0.3) / 0.4); return <TCam t={t} a={a} b={b} z={[2, 2.4]} c0={[960, 640]} shake={ramp(t, a, a + 0.3) * 5}><Study t={t} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} eyes="wide" mouth="o" brow="up" rim={0.8} /><Bolt x={1180} y={380} s={1.2} k={ramp(t, a + 0.2, a + 0.4)} /><rect width={1920} height={1080} fill="#FFFFFF" opacity={t > a + 0.3 ? f * 0.8 : 0} /></TCam>; }, sfx: "boom" },
  { c: "Otuz altı. Bir yıldan", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><text x={960} y={640} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={360} fill="#FFFFFF" stroke="#0E1A2E" strokeWidth={14} paintOrder="stroke" opacity={ramp(t, a, a + 0.3)}>36</text><ellipse cx={960} cy={520} rx={420} ry={260} fill="url(#tRim)" opacity={0.4} /></TFrame>, html: (t, a) => <Txt t={t} at={a + 1} text="BİR YILDAN AZ" y={860} size={80} color={T.yellow} /> },
  { c: "Ya bu sayı annenin", r: (t, a, b) => {
    const k = ramp(t, a + 0.4, b - 0.4);
    const px = lerp(1350, 620, k), py = 820 - Math.sin(k * Math.PI) * 460 - k * 300;
    return <TFrame bg="#14294A"><Lab t={t} /><path d="M1350,820 Q985,140 620,520" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeDasharray="24 18" />
      <circle cx={1350} cy={820} r={26} fill={T.red} /><text x={1350} y={900} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#FFF">İSTANBUL</text>
      <circle cx={620} cy={520} r={26} fill={T.yellow} /><text x={620} y={460} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#FFF">BERLİN</text>
      <text x={px} y={py + 20} textAnchor="middle" fontSize={90}>✈</text></TFrame>;
  }, html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="HASTALIĞI DEĞİL…" y={60} size={70} /><Txt t={t} at={a + (b - a) * 0.5} text="SENİN GİDİŞİN?" y={200} size={90} color={T.yellow} /></> },
  { c: "Ya oraya gidince", r: (t, a, b) => (
    <TFrame bg="#14294A"><Lab t={t} />
      {Array.from({ length: 12 }, (_, i) => { const on = i === 0 || i === 6 || i === 11; return <g key={i} transform={`translate(${330 + i * 115},500)`}><rect x={-48} y={-60} width={96} height={120} rx={12} fill={on ? T.yellow : "#1E3A64"} opacity={on ? ramp(t, a + 0.3 + i * 0.08, a + 0.5 + i * 0.08) : 0.8} /><text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill={on ? "#14294A" : "#5A7AA4"}>{["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"][i]}</text></g>; })}
      <text x={960} y={780} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={100} fill="#FFFFFF" opacity={ramp(t, a + 1.8, a + 2.2)}>36 ÷ 3 = 12 YIL</text></TFrame>
  ), html: (t, a) => <Txt t={t} at={a + 0.3} text="YILDA SADECE BİRKAÇ KEZ" y={80} size={76} color={T.yellow} /> },
  { c: "Ya otuz altı", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Study t={t} /><TFig x={760} y={G} s={0.62} o={HERO} t={t} eyes="wide" brow="worried" mouth="o" /><g opacity={0.6}><TFig x={1200} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1200} y={G} n={36} /></g></TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.4} text="ANNENİN ÖMRÜ DEĞİL" y={80} size={70} /><Txt t={t} at={a + (b - a) * 0.55} text="SENİN SEÇTİĞİN HAYAT" y={860} size={84} color={T.yellow} /></> },
  { c: "Ertesi sabah şirkete", r: (t, a, b) => <Mail t={t} a={a} text="" k={0} />, html: (t, a) => <Tag t={t} at={a + 0.2} text="ERTESİ SABAH" c={T.blue} /> },
  { c: "Teşekkür ederim ama", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 460]}><Mail t={t} a={a} text="Teşekkür ederim, ama kalıyorum." k={ramp(t, a, b - 0.3)} /></TCam> },
  { c: "Gönder tuşuna", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.6]} c0={[1100, 560]} c1={[1300, 680]}><Mail t={t} a={a} text="Teşekkür ederim, ama kalıyorum." k={1} sent={ramp(t, a + 0.5, a + 2)} /></TCam>, sfx: "pop" },
  { c: "Sonra Üsküdar'a", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[900, 620]} c1={[1060, 620]}><Uskudar t={t} /><TFig x={lerp(500, 900, ramp(t, a, b))} y={1000} s={0.55} o={HERO} t={t} pose={walkPose(t * 7)} holdR={<Poset s={0.6} t={t} />} mouth="smile" /></TCam>, sfx: "whoosh" },
  { c: "Elinde sıcak simit", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3]} c0={[620, 800]}><Landing t={t} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} mouth="smile" /></TCam> },
  { c: "Zile basıyorsun", r: (t, a, b) => { const k = ramp(t, a, a + 0.5); return <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1200, 640]}><Landing t={t} /><TFig x={1080} y={G} s={0.62} o={HERO} t={t} pose={{ l: [40, 95], r: [lerp(30, 95, k), lerp(60, 90, k)] }} holdL={<Poset s={0.55} t={t} />} look={1} /></TCam>; }, sfx: "doorbell" },
  { c: "Kapı açılıyor", r: (t, a, b) => { const k = ramp(t, a, a + 1); return <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[900, 680]}><Landing t={t} open={k} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="o" eyes="wide" brow="up" /><Num t={t} x={1000} y={G} n={36} k={ramp(t, a + 1, a + 1.4)} /></>} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} mouth="smile" /></TCam>; } },
  { c: "Ve başının üstündeki sayı titriyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.2]} c0={[1000, 560]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1000} y={G} n={36} shake={ramp(t, a, b) * 10} /></>} /></TCam>, sfx: "static" },
  { c: "Kayıyor", r: (t, a, b) => { const r = Math.floor(t * 30); return <TCam t={t} a={a} b={b} z={[3, 3.3]} c0={[1000, 560]} shake={3}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth="smile" /><Num t={t} x={1000} y={G} n={String(36 + (r * 137) % 4000)} shake={6} /></>} /></TCam>; }, sfx: "static" },
  { c: "36 değil artık", r: (t, a, b) => { const r = Math.floor(t * 30); return <TCam t={t} a={a} b={b} z={[2.4, 1.6]} c0={[1000, 560]} c1={[900, 640]}><Landing t={t} open={1} inside={<><TFig x={1000} y={G} s={0.62} o={MOM} t={t} dir={-1} mouth={t > AT_3914 ? "grin" : "smile"} eyes={t > AT_3914 ? "happy" : "open"} /><Num t={t} x={1000} y={G} n={t > AT_3914 - 0.2 ? 3914 : String(36 + (r * 137) % 4000)} from={String(36 + (r * 137) % 4000)} at={AT_3914} /></>} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} pose={P.hand} holdR={<Poset s={0.6} t={t} />} eyes={t > AT_3914 ? "happy" : "wide"} mouth={t > AT_3914 ? "grin" : "o"} /></TCam>; }, html: (t) => <Txt t={t} at={AT_3914 + 0.2} text="3914" y={850} size={130} color={T.rim} />, sfx: "tick" },
  { c: "Üçüncü kural", r: (t, a) => <Kural t={t} a={a} n="KURAL 3" line="Sayı kader değil. Yolun sonucu." />, sfx: "boom" },
  { c: "Sayı kader değil", r: (t, a, b) => <Yol t={t} pick={0} k={ramp(t, a, a + 0.5)} />, html: (t, a) => <Txt t={t} at={a + 0.6} text="YÜRÜDÜĞÜN YOLUN SONUCU" y={900} size={70} color={T.yellow} /> },
  { c: "Yolu değiştirirsen", r: (t, a, b) => <Yol t={t} pick={ramp(t, a + 0.3, b - 0.4)} />, sfx: "whoosh" },
  { c: "Ama bazı sayılar", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.4]} c0={[960, 540]}><Living t={t} night={false} /><DedeFoto x={960} y={520} s={1.1} t={t} /><Num t={t} x={960} y={1000} s={0.9} n={0} c="#DFF6FF" /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="BAZI SAYILAR DEĞİŞMEZ" y={880} size={76} /> },
  { c: "Çünkü bazı vedalar", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><Living t={t} night={false} /><TFig x={960} y={G} s={0.62} o={HERO} t={t} pose={P.hold} holdR={<g transform="translate(-50,-20) scale(0.3)"><DedeFoto x={0} y={0} t={t} /></g>} lookY={1} eyes="happy" mouth="smile" /></TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="BAZI VEDALAR SEÇMEKLE GELMEZ" y={60} size={66} /><Txt t={t} at={a + (b - a) * 0.7} text="ZAMANLA GELİR" y={880} size={84} color={T.yellow} /></> },

  // ── EMRE ──
  { c: "O akşam Emre'ye", r: (t, a) => <Chat t={t} name="Emre" msgs={[["Bayramda geliyorum.", true, a + 2.4], ["Sana.", true, a + 3.8], ["Kaçış yok. 😄", true, a + 4.6]]} />, sfx: "pop" },
  { c: "Bileti alıyorsun", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><g transform={`translate(960,540) rotate(-4) scale(${0.7 + 0.3 * ramp(t, a, a + 0.3)})`}><rect x={-520} y={-200} width={1040} height={400} rx={30} fill="#FFFFFF" /><rect x={260} y={-200} width={4} height={400} fill="#CCC" /><text x={-130} y={-40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={120} fill="#1C1C1C">İST ✈ BER</text><text x={-130} y={90} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={50} fill={T.red}>BAYRAM</text><text x={390} y={20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill={T.blue}>BİNİŞ</text></g></TFrame>, sfx: "ding" },
  { c: "Ve birkaç hafta sonra", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[860, 680]}><Landing t={t} wall="#DCE3E8" door="#2A3A55" plate="12" /><TFig x={lerp(240, 560, ramp(t, a, a + 1.5))} y={G} s={0.62} o={HERO} t={t} pose={ramp(t, a, a + 1.5) < 1 ? walkPose(t * 7) : P.stand} mouth="smile" /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="BERLİN" c="#2A3A55" />, sfx: "whoosh" },
  { c: "Kapı açılıyor", r: (t, a, b) => { const k = ramp(t, a, a + 0.9); return <TCam t={t} a={a} b={b} z={[1.4, 2.2]} c0={[860, 720]} c1={[1000, 560]}><Landing t={t} wall="#DCE3E8" door="#2A3A55" plate="12" open={k} inside={<><TFig x={1000} y={G} s={0.62} o={EMRE} t={t} dir={-1} eyes="wide" mouth="grin" pose={P.cheer} /><Num t={t} x={1000} y={G} n={1} from={0} at={AT_E1} k={ramp(t, a + 0.8, a + 1.2)} c={t < AT_E1 ? "#FFB3B3" : "#FFFFFF"} /></>} /><TFig x={560} y={G} s={0.62} o={HERO} t={t} eyes="happy" mouth="grin" /></TCam>; }, html: (t) => <Txt t={t} at={AT_E1 + 0.2} text="0 → 1" y={860} size={110} color={T.rim} />, sfx: "ding" },
  { c: "Sadece bir", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[880, 720]}><Landing t={t} wall="#DCE3E8" door="#2A3A55" plate="12" open={1} inside={<><TFig x={940} y={G} s={0.62} o={EMRE} t={t} dir={-1} pose={HUG} eyes="closed" mouth="grin" /><Num t={t} x={940} y={G} n={1} /></>} /><TFig x={800} y={G} s={0.62} o={HERO} t={t} pose={HUG} eyes="closed" mouth="grin" /></TCam> },
  { c: "Ama bir, sıfırdan", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><text x={560} y={640} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={340} fill="#FFFFFF" opacity={ramp(t, a, a + 0.3)}>1</text><text x={960} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={200} fill={T.yellow} opacity={ramp(t, a + 0.5, a + 0.8)}>{">"}</text><text x={1360} y={640} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={340} fill="#5A7AA4" opacity={ramp(t, a + 0.8, a + 1.1)}>0</text></TFrame>, html: (t, a) => <Txt t={t} at={a + 1.4} text="SONSUZ KEZ FAZLA" y={860} size={90} color={T.rim} /> },

  // ── SON ──
  { c: "Aylar geçiyor", r: (t, a) => <TFrame bg="#14294A"><Lab t={t} /><Calendar x={960} y={560} top="AY" big={["MART", "NİSAN", "MAYIS"][Math.min(2, Math.floor((t - a) * 2.4))]} /></TFrame>, sfx: "tick" },
  { c: "Zeynep'le artık", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 680]}><VapurIc t={t} /><TFig x={860} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} eyes="happy" mouth="smile" /><TFig x={1060} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={P.sit} eyes="happy" mouth="grin" talk={Math.sin(t * 0.8) > 0} /><Tea x={960} y={880} s={0.8} /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.3} text="HER AKŞAM · AYNI VAPUR" c={T.orange} /> },
  { c: "Başındaki sayı her gün", r: (t, a, b) => { const d = Math.floor((t - a) * 3); return <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1060, 600]}><VapurIc t={t} /><TFig x={1060} y={990} s={0.62} o={ZEYNEP} t={t} dir={-1} pose={P.sit} eyes="happy" mouth="smile" /><Num t={t} x={1060} y={990} n={9213 - d} /></TCam>; }, sfx: "tick" },
  { c: "Ve bu seni hiç", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[860, 720]}><VapurIc t={t} /><TFig x={860} y={990} s={0.62} o={HERO} t={t} pose={P.sit} look={1} eyes="happy" mouth="smile" rim={0.4} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.6} text="KORKUTMUYOR" y={90} size={90} color={T.green} /> },
  { c: "Çünkü bir şey öğrendin", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]}><Uskudar t={t} dusk={1} boat /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.35} /></TCam> },
  { c: "Sayıları saymak", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.25]}><Uskudar t={t} dusk={1} boat /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.45} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text="SAYMAK HAYATI UZATMIYOR" y={420} size={86} /> },
  { c: "Saymak sadece korkutuyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.25, 1.35]}><Uskudar t={t} dusk={1} boat /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.55} /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text="SADECE KORKUTUYOR" y={420} size={96} color={T.red} /> },
  { c: "Asıl önemli olan", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 640]}><Living t={t} night={false} /><DedeFoto x={1500} y={420} s={0.6} t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} eyes="happy" mouth="smile" /><TFig x={1040} y={G} s={0.62} o={HERO} t={t} dir={-1} eyes="happy" mouth="smile" pose={HUG} /></TCam>, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="SAYI BİTERKEN O İNSANIN YANINDA OLMAK" y={70} size={60} color={T.yellow} /> },
  { c: "Bir pazar sabahı annenin", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 600]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} mouth="smile" /><Num t={t} x={760} y={G} n={3914} /><TFig x={1160} y={G} s={0.62} o={HERO} t={t} dir={-1} mouth="smile" /></TCam>, html: (t, a) => <Tag t={t} at={a + 0.2} text="BİR PAZAR SABAHI" c={T.orange} />, sfx: "whoosh" },
  { c: "Annen çay koyuyor", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.6]} c0={[860, 760]} c1={[800, 560]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} mouth="smile" pose={P.reach} holdR={<Caydanlik s={0.7} tilt={20} />} lookY={1} /><Num t={t} x={760} y={G} n={3914} /><Tea x={960} y={870} /></TCam> },
  { c: "Ve bakmıyorsun", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.2]} c0={[800, 560]} c1={[800, 760]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} mouth="smile" pose={P.reach} holdR={<Caydanlik s={0.7} tilt={20} />} lookY={1} /><Num t={t} x={760} y={G} n={3914} k={1 - ramp(t, a, a + 0.8)} /></TCam> },
  { c: "Onun yerine annenin", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3.4, 3.8]} c0={[760, 760]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} mouth="smile" look={1} /></TCam> },
  { c: "Bugün ne pişirelim", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 720]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} mouth="smile" look={1} /><TFig x={1160} y={G} s={0.62} o={HERO} t={t} dir={-1} mouth="grin" eyes="happy" talk /><Bub t={t} at={a + 0.1} x={1160} y={420} text="Bugün ne pişirelim anne?" size={40} /></TCam> },
  { c: "Annen şaşırıyor", r: (t, a, b) => { const k = t > a + 1.3; return <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[760, 760]}><Kitchen t={t} /><TFig x={760} y={G} s={0.62} o={MOM} t={t} eyes={k ? "happy" : "wide"} mouth={k ? "grin" : "o"} brow={k ? "none" : "up"} pose={k ? P.cheer : P.stand} /><Heart x={900} y={500} s={k ? 0.5 + 0.06 * Math.sin(t * 6) : 0} c={T.pink} /></TCam>; } },
  { c: "Peki senin hayatında", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]}><Uskudar t={t} dusk={1} /><rect width={1920} height={1080} fill="#0E1A2E" opacity={0.4} /><TFig x={960} y={G} s={0.75} o={HERO} t={t} rim={0.8} eyes="open" brow="up" mouth="smile" /></TCam>, html: (t, a) => <Txt t={t} at={a + 0.4} text="BAŞINDA KÜÇÜK BİR SAYI YAZAN BİRİ VAR MI?" y={70} size={62} color={T.yellow} /> },
  { c: "Bir dede, bir anne", r: (t, a, b) => (
    <TFrame bg="#1A2C48"><Lab t={t} />
      {[[DEDE, "1", "DEDE"], [MOM, "36", "ANNE"], [EMRE, "0", "ARKADAŞ"]].map(([o, n, l], i) => { const k = ramp(t, a + i * 1.4, a + i * 1.4 + 0.3); return <g key={i} opacity={k} transform={`translate(${420 + i * 540},0)`}>
        <rect x={-200} y={240} width={400} height={640} rx={30} fill="#0E1A2E" stroke={T.rim} strokeWidth={6} /><TFig x={0} y={780} s={0.62} o={o as typeof MOM} t={t} seed={i} mouth="smile" eyes="happy" /><Num t={t} x={0} y={780} n={String(n)} />
        <text x={0} y={850} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#FFFFFF">{String(l)}</text></g>; })}
    </TFrame>
  ) },
  { c: "Yorumlara onun adını", r: (t, a, b) => {
    const msg = "Dedem… bu akşam gidiyorum.";
    const n = Math.floor(ramp(t, a + 0.3, a + 2.4) * msg.length);
    return (<TFrame bg="#1A2C48"><g transform="translate(960,440)"><rect x={-640} y={-170} width={1280} height={340} rx={30} fill="#FFFFFF" />
      <circle cx={-530} cy={-60} r={56} fill={T.hero} /><text x={-450} y={-70} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#111">Yorum ekle…</text>
      <text x={-450} y={10} fontFamily="Poppins" fontWeight={600} fontSize={46} fill="#333">{msg.slice(0, n)}{Math.floor(t * 3) % 2 ? "|" : ""}</text>
      <rect x={380} y={70} width={220} height={70} rx={35} fill={T.blue} /><text x={490} y={118} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#fff">YORUM</text></g>
      <TFig x={260} y={1060} s={0.55} o={HERO} t={t} pose={P.point} eyes="happy" mouth="grin" /><TFig x={1680} y={1060} s={0.55} o={MOM} t={t} dir={-1} pose={P.wave} mouth="smile" eyes="happy" /></TFrame>);
  }, sfx: "pop" },
  { c: "Git, gör", r: (t, a, b) => { const k = ramp(t, a, a + 2.5); return <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[900, 620]}><Uskudar t={t} dusk={1} /><TFig x={lerp(300, 900, k)} y={1000} s={0.55} o={HERO} t={t} pose={k < 1 ? walkPose(t * 7) : P.wave} holdR={<Poset s={0.6} t={t} />} eyes="happy" mouth="smile" rim={0.6} /></TCam>; }, html: (t, a) => <><Txt t={t} at={a - 0.6} text="ARAMA. GİT, GÖR." y={90} size={96} color={T.yellow} /><Abone t={t} at={a + 1.2} /></> },
];

// Marmaray penceresinde Emre ve yolcular / peronda kalabalık
function MARM_IN(t: number, eyes: "open" | "happy" | "wide" = "open") {
  return (
    <g>
      {[-60, 140, 1140, 1300, 1600, 1760, 2100].map((x, i) => <TFig key={i} x={x} y={820} s={0.62} o={{ top: MINI_COLS[(i * 3) % 10], top2: MINI_COLS[(i * 3) % 10], shoes: "#FFF" }} t={t} seed={i} dir={i % 2 ? -1 : 1} mouth="flat" />)}
      <TFig x={530} y={790} s={0.7} o={EMRE} t={t} eyes={eyes} mouth={eyes === "wide" ? "o" : "smile"} look={1} pose={P.hand} />
      {[860, 920].map((x, i) => <TFig key={x} x={x} y={860} s={0.66} o={{ top: MINI_COLS[i + 5], top2: MINI_COLS[i + 5], shoes: "#FFF" }} t={t} seed={i + 9} />)}
    </g>
  );
}
function PERON_CROWD(t: number, push: number) {
  return <g>{Array.from({ length: 9 }, (_, i) => { const x = 120 + i * 210 + (i > 5 ? push : -push * 0.4); return <TMini key={i} x={x} y={1000 + (i % 2) * 30} s={2.6} c={MINI_COLS[(i * 7) % MINI_COLS.length]} t={t} seed={i} />; })}</g>;
}
// simitçi tezgâhı
function SimitCart({ x, t }: { x: number; t: number }) {
  return (
    <g transform={`translate(${x},${G})`}>
      <rect x={-160} y={-330} width={320} height={210} rx={12} fill="#E0393E" /><rect x={-140} y={-310} width={280} height={170} rx={8} fill="#F4FBFF" opacity={0.85} />
      {Array.from({ length: 8 }, (_, i) => <Simit key={i} x={-90 + (i % 4) * 60} y={-270 + Math.floor(i / 4) * 70} s={0.75} />)}
      <rect x={-160} y={-120} width={320} height={30} fill="#B02A2F" /><text x={0} y={-345} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#B02A2F">SİMİT</text>
      {[-110, 110].map((xx) => <g key={xx} transform={`translate(${xx},-50) rotate(${t * 20})`}><circle r={46} fill="#2A2A2A" /><circle r={14} fill="#888" /></g>)}
    </g>
  );
}

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_04_SECONDS));
  return raw;
})();

// hatıra efekti: sıcak sepya, film tanesi, beyaz flaş, alt etiket
export const MemFx: React.FC<{ t: number; a: number; label: string; children: React.ReactNode }> = ({ t, a, label, children }) => {
  const flash = 1 - ramp(t, a, a + 0.35);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "sepia(0.55) saturate(1.25) brightness(1.04) contrast(1.03)" }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(${(t * 37) % 180}deg, rgba(90,60,20,.06) 0px, rgba(90,60,20,.06) 2px, transparent 2px, transparent 5px)` }} />
      <AbsoluteFill style={{ boxShadow: `inset 0 0 240px rgba(246,196,69,${0.5 + 0.12 * Math.sin(t * 6)})` }} />
      <AbsoluteFill style={{ background: "#FFF6DC", opacity: flash * 0.9 }} />
      <div style={{ position: "absolute", left: 60, bottom: 50, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#FFE9A8", letterSpacing: 3, background: "rgba(40,26,8,.82)", padding: "8px 24px", borderRadius: 12 }}>◀◀ {label}</div>
    </AbsoluteFill>
  );
};

export const K2RVideo04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const body = s.r(t, s.from, s.to);
  const svgWrapped = React.isValidElement(body) && (body.type === TFrame) ? body : <TFrame>{body}</TFrame>;
  const fadeIn = ramp(t, 0, 0.5);
  const cutFlash = s.m ? 0 : 1 - ramp(t, s.from, s.from + 0.12);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {s.m ? <MemFx t={t} a={s.from} label={s.m}>{svgWrapped}</MemFx> : svgWrapped}
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cutFlash * 0.25, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-04.wav")} />
      {TIMED.map((x, i) => i > 0 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.m && !x.sfx ? "static" : x.sfx ?? "whoosh"}.wav`)} volume={x.sfx && x.sfx !== "whoosh" ? 0.2 : x.m ? 0.05 : 0.09} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
