import React from "react";
import { spring, useVideoConfig } from "remotion";
import { ramp } from "../lib/cues";
import { K3 } from "./Ott";
import { FONT } from "../theme";
import { H, HFig, HTiny, ROBES, haremWalk } from "./Harem";

// Kanal 3 motor videoları için ortak yazı ve yardımcılar (k3r-02'den çıkarıldı, k3r-03 ve sonrası kullanır).
// Txt: krem kart + altın alt çizgi; Tag: sol üst etiket; NameCard: kişi kartı; Belge: eski kâğıt belge kartı; Abone.

const useSp = (t: number, at: number) => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 14, stiffness: 130 } });
};

export const Txt: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; sub?: string; x?: number; w?: number; until?: number; dark?: boolean; accent?: string }> = ({ t, at, text, y = 60, size = 76, sub, x = 960, w = 1700, until = 1e9, dark, accent = K3.gold }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  const out = 1 - ramp(t, until, until + 0.25);
  return (
    <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, textAlign: "center", opacity: sp * out, transform: `translateY(${(1 - sp) * 24}px) scale(${0.86 + 0.14 * sp})` }}>
      <div style={{ display: "inline-block", background: dark ? "rgba(20,28,56,.86)" : K3.paper, borderBottom: `9px solid ${accent}`, borderRadius: 18, padding: `${size * 0.14}px ${size * 0.45}px`, boxShadow: "0 12px 30px rgba(0,0,0,.35)", fontFamily: FONT, fontWeight: 800, fontSize: size, color: dark ? "#FFF3D6" : K3.ink, lineHeight: 1.08 }}>{text}</div>
      {sub && <div style={{ marginTop: 10 }}><span style={{ display: "inline-block", background: K3.cobalt, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: size * 0.44, padding: "6px 22px", borderRadius: 12 }}>{sub}</span></div>}
    </div>
  );
};

export const Tag: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; c?: string }> = ({ t, at, text, x = 70, y = 60, c = K3.cobalt }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: sp, transform: `translateX(${(1 - sp) * -40}px)`, background: c, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "8px 28px", borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,.3)" }}>{text}</div>;
};

export const NameCard: React.FC<{ t: number; at: number; name: string; sub: string; x?: number; y?: number; c?: string }> = ({ t, at, name, sub, x = 120, y = 760, c = K3.cobalt }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: sp, transform: `translateY(${(1 - sp) * 30}px)` }}>
      <div style={{ background: K3.paper, borderLeft: `14px solid ${c}`, borderRadius: 14, padding: "12px 34px", boxShadow: "0 10px 26px rgba(0,0,0,.35)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: K3.ink }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "#5A4430" }}>{sub}</div>
      </div>
    </div>
  );
};

export const Belge: React.FC<{ t: number; at: number; date: string; children: React.ReactNode; src: string }> = ({ t, at, date, children, src }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: 360, top: 120, width: 1200, opacity: sp, transform: `rotate(${-1.5 + (1 - sp) * -6}deg) scale(${0.8 + 0.2 * sp})` }}>
      <div style={{ background: "linear-gradient(135deg,#F3E6C4,#E3CC98)", border: "3px solid #8A6A3A", borderRadius: 10, padding: "40px 60px", boxShadow: "0 24px 60px rgba(0,0,0,.5)", fontFamily: FONT, color: "#3A2A18" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ background: K3.red, color: "#fff", fontWeight: 800, fontSize: 44, padding: "6px 26px", borderRadius: 8, letterSpacing: 4 }}>BELGE</span>
          <span style={{ fontWeight: 700, fontSize: 34 }}>{date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 50, lineHeight: 1.3, marginTop: 34 }}>{children}</div>
        <div style={{ fontWeight: 600, fontSize: 32, marginTop: 30, color: "#6A5030" }}>{src}</div>
      </div>
    </div>
  );
};

export const Abone: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: sp, transform: `scale(${0.7 + 0.3 * sp})` }}><div style={{ background: K3.red, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: "18px 80px", borderRadius: 60, boxShadow: "0 12px 30px rgba(0,0,0,.45)" }}>ABONE OL 🔔</div></div>;
};

// yürüyen figür: x0→x1 (a..b arası). 2026-11-08: hareket kiti → terlikler eteğin altından sırayla basar
// (yerde kayma yok), gövde adımla iner/kalkar, etek savrulur, kollar sallanır, yüz gittiği yöne bakar.
export const Walker: React.FC<{ t: number; a: number; b: number; x0: number; x1: number; y?: number; s?: number; o: Partial<React.ComponentProps<typeof HFig>> }> = ({ t, a, b, x0, x1, y = 990, s = 0.9, o }) => {
  const w = haremWalk(t, a, b, x0, x1, s);
  return <HFig x={w.x} y={y} s={s} t={t} look={w.look} {...(o as object)} walk={w.walk} />;
};

export const Crowd: React.FC<{ t: number; n?: number; y?: number; s?: number; cols?: string[] }> = ({ t, n = 14, y = 900, s = 2.4, cols = ROBES }) => (
  <g>{Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(0,${Math.sin(t * 2 + i) * 2})`}><HTiny x={120 + i * (1680 / n)} y={y + (i % 3) * 30} s={s} c={cols[i % cols.length]} /></g>)}</g>
);

export const Notes: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g>{[0, 1, 2].map((i) => { const k = (t * 0.6 + i / 3) % 1; return <text key={i} x={x + Math.sin(k * 6 + i) * 30 + i * 40} y={y - k * 160} fontSize={56} fill={H.cobalt} opacity={1 - k}>♪</text>; })}</g>
);

// düz krem zemin (damask)
export const Paper: React.FC<{ c?: string }> = ({ c = H.cream }) => (<><rect width={1920} height={1080} fill={c} /><rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.4} /></>);

// büyük ikon dairesi + etiket (liste kartları)
export const Disc: React.FC<{ x: number; y: number; k: number; c: string; label: string; r?: number; children?: React.ReactNode }> = ({ x, y, k, c, label, r = 160, children }) => (
  <g transform={`translate(${x},${y + (1 - k) * 60})`} opacity={k}>
    <circle r={r} fill={c} stroke={H.gold} strokeWidth={10} />
    {children}
    <text y={r + 80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill={H.black}>{label}</text>
  </g>
);
