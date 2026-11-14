import React from "react";
import { spring, useVideoConfig } from "remotion";
import { ramp as rampRaw } from "../lib/cues";
import { FONT } from "../theme";
import { Lab, T, lerp } from "./Toon";

// Kanal 2 ortak arayüz kiti (2026-11-14): k2r-04'ten taşındı (o dosya kendi words.json'u olmadan açılmıyor).
// Txt (HTML yazı), Tag (köşe etiketi), Abone, Kural kartı, Landing (apartman kapısı), Simit.
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
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
export const Simit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={30} fill="none" stroke="#B5651D" strokeWidth={20} /><circle r={30} fill="none" stroke="#F3D9A4" strokeWidth={20} strokeDasharray="2 9" opacity={0.9} /></g>
);
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
