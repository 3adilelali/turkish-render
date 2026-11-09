import React, { createContext, useContext } from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { makeCue, ramp } from "../../lib/cues";
import { FONT, HAND } from "../../theme";

// ═══ Kanal 3 · O Yıl Sen · ortak kit (2026-11-07) ═══
// Her video: makeK5({ id, words, shots, ... }) → { Comp, seconds }. Görseller public/img/<id>/<NN>.jpg.
// Motor sahneleri (Fig, Scene, Route, Letter, Counter, Split, Phone, Years, Doc, Silence) görsellerle aynı dili konuşur:
// yuvarlak beyaz kafa, nokta gözler, sıcak krem/tuğla/petrol renkleri. Görsel azaldıkça motor öne çıkar.
export const K = { cream: "#F3E6CF", brick: "#B5432F", petrol: "#1F4E5F", ink: "#2B2420", night: "#14202A", paper: "#FBF6EA", gold: "#FFD27A", red: "#E30A17" };
export const shadow = "0 12px 30px rgba(0,0,0,.38)";
export { ramp };

const Dir = createContext("k5");
export const useSp = (t: number, at: number, st = 130) => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 14, stiffness: st } });
};

type Pos = "tl" | "tr" | "bl" | "br" | "bc" | "tc";
export type O =
  | { t: "date"; a: string; b?: string; d?: number }
  | { t: "tag"; a: string; b?: string; d?: number }
  | { t: "note"; a: string; p?: Pos; d?: number }
  | { t: "quote"; a: string; p?: Pos; d?: number }
  | { t: "cap"; a: string; d?: number }
  | { t: "arrow"; a: string; x: number; y: number; from?: "l" | "r"; d?: number }
  | { t: "list"; a: string[]; p?: Pos; d?: number }
  | { t: "cay"; d?: number }
  | { t: "flag"; d?: number }
  | { t: "stamp"; a: string; d?: number };
export type R = (t: number, a: number, b: number) => React.ReactNode;
export type Shot = { c: string | string[]; img?: string; ov?: O[]; r?: R; html?: R; yr?: number; g?: number | null; sfx?: string; glow?: string };

export const POS: Record<Pos, React.CSSProperties> = {
  tl: { left: 70, top: 70 }, tr: { right: 70, top: 220 }, bl: { left: 70, bottom: 80 }, br: { right: 70, bottom: 80 },
  bc: { left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center" }, tc: { left: 0, right: 0, top: 60, display: "flex", justifyContent: "center" },
};
export const Pop: React.FC<{ t: number; at: number; style?: React.CSSProperties; rot?: number; children: React.ReactNode }> = ({ t, at, style, rot = -5, children }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", opacity: sp, transform: `scale(${0.6 + 0.4 * sp}) rotate(${(1 - sp) * rot}deg)`, ...style }}>{children}</div>;
};
export const Txt: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; color?: string; sub?: string; bg?: string }> = ({ t, at, text, y = 80, size = 88, color = K.cream, sub, bg = "rgba(20,32,42,.84)" }) => {
  const sp = useSp(t, at, 150);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: 110, right: 110, top: y, textAlign: "center", opacity: sp, transform: `translateY(${(1 - sp) * 30}px)` }}>
      <div style={{ display: "inline-block", background: bg, borderRadius: 20, padding: `${size * 0.14}px ${size * 0.42}px`, boxShadow: shadow, fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.15 }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.42, color: "#fff", marginTop: 12, textShadow: "0 3px 0 rgba(0,0,0,.45)" }}>{sub}</div>}
    </div>
  );
};

// ───────── küçük Türk detayları ─────────
// ince belli çay bardağı, buharı tütüyor
export const Cay: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <svg width={150 * s} height={230 * s} viewBox="0 0 150 230">
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.5 + i / 3) % 1);
      return <path key={i} d={`M${55 + i * 20},${70 - p * 60} q${10 * Math.sin(t * 2 + i)},-15 0,-30 q${-10 * Math.sin(t * 2 + i)},-15 0,-30`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.55 * Math.sin(p * Math.PI)} />;
    })}
    <ellipse cx={75} cy={212} rx={62} ry={14} fill="#C9C2B2" stroke="#8A8270" strokeWidth={3} />
    <path d="M40,80 L110,80 Q100,120 92,140 Q108,175 102,205 L48,205 Q42,175 58,140 Q50,120 40,80 Z" fill="rgba(255,255,255,.35)" stroke="#fff" strokeWidth={4} />
    <path d="M45,96 L105,96 Q97,122 90,140 Q104,172 99,200 L51,200 Q46,172 60,140 Q53,122 45,96 Z" fill="#B5431F" opacity={0.92} />
    <path d="M52,100 Q56,150 58,195" stroke="rgba(255,255,255,.45)" strokeWidth={5} fill="none" />
  </svg>
);
// dalgalanan bayrak (oranlar: Türk Bayrağı Kanunu)
export const Flag: React.FC<{ t: number; w?: number }> = ({ t, w = 300 }) => {
  const h = w / 1.5, G = h;
  const pts = (k: number) => Array.from({ length: 21 }, (_, i) => { const x = (i / 20) * w; return [x, Math.sin(t * 3 - i * 0.45) * (i / 20) * h * 0.07 + k]; });
  const top = pts(0), bot = pts(h);
  const d = `M${top.map((p) => p.join(",")).join(" L")} L${bot.reverse().map((p) => p.join(",")).join(" L")} Z`;
  const wy = Math.sin(t * 3 - 4) * h * 0.035;
  const star = Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? G * 0.05 : G * 0.125; const an = Math.PI + (i * Math.PI) / 5; return `${0.86 * G + r * Math.cos(an)},${G / 2 + wy + r * Math.sin(an)}`; }).join(" ");
  return (
    <svg width={w + 20} height={h + 20} viewBox={`-6 -10 ${w + 20} ${h + 20}`}>
      <rect x={-6} y={-10} width={8} height={h + 20} fill="#7A6A55" />
      <path d={d} fill={K.red} />
      <circle cx={0.5 * G} cy={G / 2 + wy} r={0.25 * G} fill="#fff" />
      <circle cx={0.5625 * G} cy={G / 2 + wy} r={0.2 * G} fill={K.red} />
      <polygon points={star} fill="#fff" />
    </svg>
  );
};

// ───────── yuvarlak kafalı karakter (görsellerle aynı stil) ─────────
export type Look = { body: string; body2?: string; scarf?: string; cap?: string; moustache?: boolean; beard?: boolean; hair?: string; kid?: boolean; skirt?: string; bag?: string };
export const LOOK: Record<string, Look> = {
  girl: { body: "#C8553D", body2: "#9E3F2C", scarf: "#F2C14E", skirt: "#5B7F95", kid: true },
  kid: { body: "#3E7CB1", body2: "#2C5D86", hair: "#2B2420", kid: true },
  bride: { body: "#7A3E65", body2: "#5E2E4E", scarf: "#E9DFC9", skirt: "#3F5E4F" },
  mother: { body: "#6B8F71", body2: "#4F6F55", scarf: "#C9A66B", skirt: "#5A4632" },
  nine: { body: "#5A4A6B", body2: "#43374F", scarf: "#F4F1EA", skirt: "#3A3A3A" },
  man: { body: "#4E5D6C", body2: "#3B4754", moustache: true, hair: "#2B2420" },
  worker: { body: "#2F5F8A", body2: "#244A6B", moustache: true, cap: "#3A3A3A" },
  dede: { body: "#7A5A3A", body2: "#5E4428", moustache: true, beard: true, cap: "#E9E2D2" },
  teen: { body: "#3FA7A0", body2: "#2E7F79", hair: "#2B2420" },
};
export const Fig: React.FC<{ t: number; x: number; y: number; s?: number; look: Look; walk?: number; dir?: 1 | -1; wave?: boolean; sad?: boolean; talk?: boolean; hold?: React.ReactNode; seed?: number }> = ({ t, x, y, s = 1, look, walk = 0, dir = 1, wave, sad, talk, hold, seed = 0 }) => {
  const k = look.kid ? 0.78 : 1;
  const ph = t * 7 + seed;
  const step = walk ? Math.sin(ph) : 0;
  const bob = walk ? Math.abs(Math.cos(ph)) * 8 : Math.sin(t * 2 + seed) * 3; // nefes
  const blink = ((t + seed * 0.37) % 3.7) < 0.12;
  const armL = walk ? step * 28 : wave ? -150 + Math.sin(t * 9) * 25 : 8 + Math.sin(t * 1.6 + seed) * 3;
  const armR = walk ? -step * 28 : hold ? -60 : -8 - Math.sin(t * 1.6 + seed) * 3;
  const mouthOpen = talk ? Math.abs(Math.sin(t * 13 + seed)) * 7 : 0;
  const B = look.body, B2 = look.body2 ?? look.body;
  return (
    <g transform={`translate(${x},${y - bob}) scale(${s * k * dir},${s * k})`}>
      <ellipse cx={0} cy={bob / (s * k) + 8} rx={70} ry={12} fill="rgba(0,0,0,.18)" />
      {/* bacaklar */}
      <g transform={`rotate(${step * 22},-18,-120)`}><rect x={-30} y={-125} width={24} height={125} rx={12} fill={look.skirt ? "#3A2E28" : "#3A3F4A"} /><ellipse cx={-14} cy={-2} rx={22} ry={10} fill="#2B2420" /></g>
      <g transform={`rotate(${-step * 22},18,-120)`}><rect x={6} y={-125} width={24} height={125} rx={12} fill={look.skirt ? "#3A2E28" : "#3A3F4A"} /><ellipse cx={22} cy={-2} rx={22} ry={10} fill="#2B2420" /></g>
      {look.skirt && <path d="M-58,-60 L58,-60 L46,-165 L-46,-165 Z" fill={look.skirt} />}
      {/* gövde */}
      <rect x={-52} y={-275} width={104} height={160} rx={40} fill={B} />
      <rect x={-52} y={-200} width={104} height={14} fill={B2} opacity={0.5} />
      {/* kollar */}
      <g transform={`rotate(${armL},-46,-255)`}><rect x={-66} y={-262} width={26} height={120} rx={13} fill={B2} /><circle cx={-53} cy={-140} r={15} fill="#FFFFFF" stroke="#2B2420" strokeWidth={3} /></g>
      <g transform={`rotate(${armR},46,-255)`}><rect x={40} y={-262} width={26} height={120} rx={13} fill={B2} /><circle cx={53} cy={-140} r={15} fill="#FFFFFF" stroke="#2B2420" strokeWidth={3} />{hold && <g transform="translate(53,-140)">{hold}</g>}</g>
      {/* kafa */}
      <g transform={`translate(0,-340) rotate(${sad ? 8 : Math.sin(t * 0.9 + seed) * 3})`}>
        {look.scarf && <path d="M-74,10 Q-80,-80 0,-84 Q80,-80 74,10 Q70,60 0,70 Q-70,60 -74,10 Z" fill={look.scarf} />}
        <circle r={62} fill="#FFFFFF" stroke="#2B2420" strokeWidth={4} />
        {look.scarf && <path d="M-66,-10 Q-60,-72 0,-74 Q60,-72 66,-10 Q40,-52 0,-54 Q-40,-52 -66,-10 Z" fill={look.scarf} />}
        {look.hair && !look.scarf && <path d="M-60,-18 Q-58,-66 0,-66 Q58,-66 60,-18 Q30,-44 0,-40 Q-30,-44 -60,-18 Z" fill={look.hair} />}
        {look.cap && <><path d="M-58,-22 Q-56,-70 0,-70 Q56,-70 58,-22 Z" fill={look.cap} /><rect x={-4} y={-34} width={72} height={12} rx={6} fill={look.cap} /></>}
        {blink ? <><rect x={-28} y={-4} width={16} height={4} rx={2} fill="#2B2420" /><rect x={12} y={-4} width={16} height={4} rx={2} fill="#2B2420" /></> : <><circle cx={-20} cy={-4} r={7} fill="#2B2420" /><circle cx={20} cy={-4} r={7} fill="#2B2420" /></>}
        {sad && <><path d="M-32,-22 L-10,-16" stroke="#2B2420" strokeWidth={4} strokeLinecap="round" /><path d="M32,-22 L10,-16" stroke="#2B2420" strokeWidth={4} strokeLinecap="round" /></>}
        {look.moustache && <path d="M-22,22 Q-10,14 0,20 Q10,14 22,22 Q10,28 0,25 Q-10,28 -22,22 Z" fill="#2B2420" />}
        {look.beard && <path d="M-44,20 Q-40,62 0,66 Q40,62 44,20 Q30,46 0,48 Q-30,46 -44,20 Z" fill="#E8E4DA" stroke="#B9B2A2" strokeWidth={2} />}
        {mouthOpen > 1 ? <ellipse cx={0} cy={34} rx={9} ry={mouthOpen} fill="#2B2420" /> : <path d={sad ? "M-12,38 Q0,30 12,38" : "M-12,32 Q0,40 12,32"} stroke="#2B2420" strokeWidth={4} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};

// motor sahnesi: kâğıt dokulu sıcak fon + kamera kayması
export const Scene: React.FC<{ t: number; a: number; bg?: string; floor?: string; zoom?: [number, number]; children: React.ReactNode; label?: string }> = ({ t, a, bg = K.cream, floor = "#E2CFAE", zoom = [1, 1.06], children, label }) => {
  const k = ramp(t, a, a + 6);
  const z = zoom[0] + (zoom[1] - zoom[0]) * k;
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,.35), transparent 60%)" }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", transform: `scale(${z}) translateX(${Math.sin(t * 0.3) * 6}px)` }}>
        <rect x={-200} y={820} width={2400} height={400} fill={floor} />
        <path d="M-200,820 L2200,820" stroke="rgba(0,0,0,.12)" strokeWidth={6} />
        {children}
      </svg>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(45deg, rgba(120,90,50,.035) 0 2px, transparent 2px 6px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(40,25,10,.28) 100%)" }} />
      {label && <div style={{ position: "absolute", left: 70, bottom: 60, fontFamily: HAND, fontSize: 56, color: K.ink, opacity: ramp(t, a + 0.5, a + 1) }}>{label}</div>}
    </AbsoluteFill>
  );
};

// ───────── kaplamalar ─────────
const OvEl: React.FC<{ o: O; t: number; at: number }> = ({ o, t, at }) => {
  const box: React.CSSProperties = { fontFamily: FONT, color: K.ink, boxShadow: shadow };
  if (o.t === "date")
    return (
      <Pop t={t} at={at} style={{ left: 70, top: 60 }}>
        <div style={{ ...box, width: 420, background: K.cream, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: K.brick, height: 34, display: "flex", gap: 50, justifyContent: "center", alignItems: "center" }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: K.cream }} />)}</div>
          <div style={{ padding: "16px 20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: K.petrol, lineHeight: 1.05 }}>{o.a}</div>
            {o.b && <div style={{ fontSize: 26, fontWeight: 700, color: K.brick, marginTop: 8 }}>{o.b}</div>}
          </div>
        </div>
      </Pop>
    );
  if (o.t === "tag")
    return (
      <Pop t={t} at={at} style={{ left: 80, bottom: 90 }}>
        <div style={{ ...box, background: K.cream, borderLeft: `14px solid ${K.brick}`, padding: "14px 32px", borderRadius: 6 }}>
          <div style={{ fontSize: 58, fontWeight: 800, color: K.petrol, lineHeight: 1 }}>{o.a}</div>
          {o.b && <div style={{ fontSize: 30, fontWeight: 600, color: K.brick, marginTop: 6 }}>{o.b}</div>}
        </div>
      </Pop>
    );
  if (o.t === "note")
    return (
      <Pop t={t} at={at} style={POS[o.p ?? "br"]} rot={8}>
        <div style={{ fontFamily: HAND, fontSize: 60, color: K.ink, background: "#FFF6DC", padding: "6px 30px", borderRadius: 8, boxShadow: shadow, transform: "rotate(-3deg)" }}>{o.a}</div>
      </Pop>
    );
  if (o.t === "quote") {
    const n = Math.floor(ramp(t, at + 0.2, at + 0.2 + o.a.length * 0.035) * o.a.length);
    return (
      <Pop t={t} at={at} style={{ ...POS[o.p ?? "tc"] }}>
        <div style={{ ...box, maxWidth: 1250, background: "#FFFFFF", borderRadius: "26px 26px 26px 6px", padding: "18px 34px", fontSize: 50, fontWeight: 700, lineHeight: 1.25, fontStyle: "italic" }}>
          “{o.a.slice(0, n)}<span style={{ opacity: 0 }}>{o.a.slice(n)}</span>”
        </div>
      </Pop>
    );
  }
  if (o.t === "cap")
    return (
      <Pop t={t} at={at} style={POS.bc} rot={0}>
        <div style={{ ...box, background: "rgba(31,78,95,.93)", color: K.cream, padding: "16px 44px", borderRadius: 16, fontSize: 54, fontWeight: 800, maxWidth: 1500, textAlign: "center" }}>{o.a}</div>
      </Pop>
    );
  if (o.t === "arrow") {
    const k = ramp(t, at, at + 0.5);
    const L = o.from === "r" ? 1 : -1;
    const x0 = o.x + L * 260 * k, y0 = o.y - 150 * k;
    return (
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
          <path d={`M${x0},${y0} Q${(x0 + o.x) / 2},${y0 - 40} ${o.x + L * 30},${o.y - 30}`} stroke="#FFF6DC" strokeWidth={11} fill="none" strokeLinecap="round" opacity={k} />
          <path d={`M${o.x + L * 30},${o.y - 30} l${L * 10},${-38} M${o.x + L * 30},${o.y - 30} l${L * 40},${4}`} stroke="#FFF6DC" strokeWidth={11} strokeLinecap="round" opacity={k} />
        </svg>
        {k > 0.6 && <div style={{ position: "absolute", left: x0 - (L < 0 ? 330 : 0) + (L > 0 ? 20 : -20), top: y0 - 70, width: 330, textAlign: L < 0 ? "right" : "left", fontFamily: HAND, fontSize: 52, color: "#FFF6DC", textShadow: "0 3px 8px rgba(0,0,0,.8)", opacity: ramp(t, at + 0.4, at + 0.7) }}>{o.a}</div>}
      </AbsoluteFill>
    );
  }
  if (o.t === "list")
    return (
      <div style={{ position: "absolute", ...POS[o.p ?? "tr"], display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
        {o.a.map((s, i) => {
          const sp = ramp(t, at + i * 0.9, at + i * 0.9 + 0.3);
          return sp > 0 && <div key={i} style={{ ...box, opacity: sp, transform: `translateX(${(1 - sp) * 60}px)`, background: K.cream, borderRadius: 10, padding: "8px 26px", fontSize: 44, fontWeight: 800, color: s.startsWith("✗") ? K.brick : K.petrol }}>{s}</div>;
        })}
      </div>
    );
  if (o.t === "cay") return <Pop t={t} at={at} style={{ right: 60, bottom: 40 }} rot={0}><Cay t={t} s={0.9} /></Pop>;
  if (o.t === "flag") return <Pop t={t} at={at} style={{ left: 60, top: 40 }} rot={0}><Flag t={t} w={210} /></Pop>;
  if (o.t === "stamp") {
    const st = useSp(t, at, 220);
    if (t < at) return null;
    return <div style={{ position: "absolute", right: 140, bottom: 140, border: `10px solid ${K.brick}`, color: K.brick, fontFamily: FONT, fontSize: 90, fontWeight: 800, padding: "0 30px", borderRadius: 16, background: "rgba(251,246,234,.75)", transform: `rotate(-12deg) scale(${2.2 - 1.2 * st})`, opacity: 0.92 * st }}>{o.a}</div>;
  }
  return null;
};

// ───────── Ken Burns (görsel) ─────────
const CROPS = [
  [1.08, 0, 0, 1.2, 0.04, -0.02], [1.3, -0.08, 0.05, 1.2, -0.05, 0.03], [1.28, 0.08, -0.04, 1.18, 0.06, 0],
  [1.2, 0, 0.07, 1.06, 0, 0], [1.34, 0.07, 0.06, 1.24, 0.03, 0.02], [1.34, -0.07, -0.05, 1.22, -0.03, -0.02],
];
export const Photo: React.FC<{ img: string; a: number; b: number; n: number; t: number; glow?: string }> = ({ img, a, b, n, t, glow }) => {
  const dir = useContext(Dir);
  const len = b - a;
  const kk = Math.max(1, Math.round(len / (a < 60 ? 3.2 : 4.6)));
  const j = Math.min(kk - 1, Math.floor(((t - a) / len) * kk));
  const pa = a + (len * j) / kk, pb = a + (len * (j + 1)) / kk;
  const k = Math.min(1, Math.max(0, (t - pa) / (pb - pa)));
  const [z0, x0, y0, z1, x1, y1] = CROPS[(n * 2 + j) % CROPS.length];
  const e = k * k * (3 - 2 * k);
  const punch = 1 - ramp(t, pa, pa + 0.45);
  const z = z0 + (z1 - z0) * e + 0.07 * punch * punch, x = x0 + (x1 - x0) * e + Math.sin(t * 0.9 + n) * 0.006, y = y0 + (y1 - y0) * e + Math.cos(t * 0.7 + n) * 0.005;
  const rot = Math.sin(t * 0.5 + n * 1.7) * 0.5;
  const enter = 1 - ramp(t, a, a + 0.3);
  const sweep = ((t - a) * 0.22 + n * 0.37) % 1.6 - 0.3;
  const flick = glow ? 0.08 + 0.05 * Math.sin(t * 7.3 + n) * Math.sin(t * 2.1) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(`img/${dir}/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translate(${x * 100}%, ${y * 100}%) rotate(${rot}deg)`, filter: enter > 0 ? `blur(${enter * 10}px) brightness(${1 + enter * 0.5})` : undefined }} />
      {glow ? <AbsoluteFill style={{ background: glow, opacity: flick, mixBlendMode: "screen" }} /> : <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep * 100 - 12}%, rgba(255,236,200,.13) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)` }} />}
      <AbsoluteFill>
        {Array.from({ length: 14 }, (_, i) => {
          const p = ((t * (0.02 + (i % 4) * 0.008) + i * 0.137) % 1);
          return <div key={i} style={{ position: "absolute", left: `${(i * 71 + Math.sin(t * 0.6 + i) * 3) % 100}%`, top: `${100 - p * 110}%`, width: 4 + (i % 3) * 3, height: 4 + (i % 3) * 3, borderRadius: 9, background: "#FFF3D6", opacity: 0.35 * Math.sin(p * Math.PI) }} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(30,20,10,.38) 100%)" }} />
    </AbsoluteFill>
  );
};
// motor kartlarının altında: aynı görselin farklı kadrajı, koyulaştırılmış
export const Re: React.FC<{ img: string; t: number; a: number; b: number; d: number }> = ({ img, t, a, b, d }) => (
  <AbsoluteFill><Photo img={img} a={a} b={b} n={img.charCodeAt(1) + 3} t={t} /><AbsoluteFill style={{ background: K.night, opacity: d }} /></AbsoluteFill>
);

// ───────── motor sahneleri ─────────
export const Doc: React.FC<{ t: number; a: number; head: string; lines: string[]; foot?: string; stamp?: string; bg?: string }> = ({ t, a, head, lines, foot, stamp, bg = "#2A1E14" }) => {
  const st = useSp(t, a + 1.6, 220);
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1240, background: "#F7F1E3", padding: "50px 70px", boxShadow: shadow, fontFamily: FONT, transform: `rotate(1deg) scale(${1.02 + (t - a) * 0.01})`, position: "relative" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: K.petrol, letterSpacing: 2, borderBottom: `5px solid ${K.brick}`, paddingBottom: 14 }}>{head}</div>
        {lines.map((l, i) => <div key={i} style={{ fontSize: 50, fontWeight: 700, color: K.ink, marginTop: 26, lineHeight: 1.25, opacity: ramp(t, a + 0.3 + i * 0.6, a + 0.6 + i * 0.6) }}>{l}</div>)}
        {foot && <div style={{ fontSize: 26, color: "#7A6A55", marginTop: 30 }}>{foot}</div>}
        {stamp && t > a + 1.6 && <div style={{ position: "absolute", right: -40, top: -70, border: `10px solid ${K.brick}`, color: K.brick, fontSize: 110, fontWeight: 800, padding: "0 30px", borderRadius: 16, transform: `rotate(-14deg) scale(${2.2 - 1.2 * st})`, opacity: 0.9 * st }}>{stamp}</div>}
      </div>
    </AbsoluteFill>
  );
};

// el yazısı mektup: satırlar yazılıyor, köşede pul
export const Letter: React.FC<{ t: number; a: number; lines: string[]; head?: string; stamp?: string; speed?: number; bg?: string; hidden?: number }> = ({ t, a, lines, head, stamp = "DEUTSCHE BUNDESPOST", speed = 0.045, bg = "#3A2A1E", hidden = -1 }) => {
  let acc = a + 0.4;
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1300, minHeight: 760, background: "#FBF6EA", padding: "60px 80px", boxShadow: shadow, position: "relative", transform: `rotate(-1.2deg) scale(${1.0 + (t - a) * 0.008})`, backgroundImage: "repeating-linear-gradient(0deg, transparent 0 66px, rgba(31,78,95,.18) 66px 68px)" }}>
        <div style={{ position: "absolute", right: 50, top: 40, width: 140, height: 170, border: "6px dashed #B5432F", background: "#F1D9B5", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FONT, fontSize: 18, fontWeight: 800, color: K.brick, transform: "rotate(4deg)" }}>{stamp}</div>
        {head && <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: "#7A6A55", marginBottom: 20 }}>{head}</div>}
        {lines.map((l, i) => {
          const st = acc; acc += l.length * speed + 0.5;
          const n = Math.floor(ramp(t, st, st + l.length * speed) * l.length);
          const hid = i === hidden;
          return <div key={i} style={{ fontFamily: HAND, fontSize: hid ? 34 : 64, color: hid ? "#8A7A60" : "#23314A", lineHeight: "68px", textAlign: hid ? "right" : "left", marginTop: hid ? 30 : 0 }}>{l.slice(0, n)}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// şematik yol haritası (metro haritası gibi): durakları ve hareket eden tren
export const Route: React.FC<{ t: number; a: number; stops: [string, number, number][]; dur?: number; title?: string; icon?: "train" | "bus" | "plane" }> = ({ t, a, stops, dur = 4, title, icon = "train" }) => {
  const k = ramp(t, a + 0.4, a + 0.4 + dur);
  const segs = stops.slice(1).map((s, i) => Math.hypot(s[1] - stops[i][1], s[2] - stops[i][2]));
  const tot = segs.reduce((x, y) => x + y, 0);
  let d = k * tot, i = 0;
  while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
  const f = Math.min(1, d / segs[i]);
  const px = stops[i][1] + (stops[i + 1][1] - stops[i][1]) * f, py = stops[i][2] + (stops[i + 1][2] - stops[i][2]) * f;
  const path = stops.map((s, j) => `${j ? "L" : "M"}${s[1]},${s[2]}`).join(" ");
  return (
    <AbsoluteFill style={{ background: K.cream }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ transform: `scale(${1.04 + k * 0.05})` }}>
        <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0 L0 0 0 60" fill="none" stroke="rgba(31,78,95,.08)" strokeWidth={2} /></pattern></defs>
        <rect width={1920} height={1080} fill="url(#grid)" />
        <path d={path} stroke="#D6C7A8" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path} stroke={K.brick} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={tot} strokeDashoffset={tot * (1 - k)} />
        {stops.map(([n, x, y], j) => {
          const reached = j === 0 || segs.slice(0, j).reduce((p, q) => p + q, 0) <= k * tot + 1;
          return (
            <g key={j}>
              <circle cx={x} cy={y} r={reached ? 24 : 18} fill={reached ? K.petrol : "#fff"} stroke={K.petrol} strokeWidth={8} />
              <text x={x} y={y + (j % 2 ? 78 : -46)} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={reached ? K.ink : "#9A8B72"}>{n}</text>
            </g>
          );
        })}
        <g transform={`translate(${px},${py})`}>
          <circle r={52} fill={K.gold} stroke={K.ink} strokeWidth={6} />
          <g transform={`translate(0,${Math.sin(t * 14) * 1.5})`}>
            <rect x={-32} y={-22} width={64} height={34} rx={8} fill={icon === "bus" ? K.brick : K.petrol} />
            {icon === "train" && <rect x={-32} y={-34} width={18} height={14} fill={K.petrol} />}
            {[-20, -2, 16].map((wx) => <rect key={wx} x={wx} y={-16} width={12} height={12} rx={2} fill="#FBF6EA" />)}
            <circle cx={-18} cy={16} r={8} fill={K.ink} /><circle cx={18} cy={16} r={8} fill={K.ink} />
          </g>
        </g>
      </svg>
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, color: K.petrol, letterSpacing: 2 }}>{title}</div>}
    </AbsoluteFill>
  );
};

// büyük sayaç (para, yıl, kişi)
export const Counter: React.FC<{ t: number; a: number; to: number; from?: number; pre?: string; suf?: string; head?: string; sub?: string; foot?: string; bg?: string; fmt?: (n: number) => string }> = ({ t, a, to, from = 0, pre = "", suf = "", head, sub, foot, bg = K.cream, fmt }) => {
  const v = from + (to - from) * ramp(t, a + 0.3, a + 2.2);
  const s = fmt ? fmt(v) : Math.round(v).toLocaleString("tr-TR");
  const dark = bg === K.night || bg === "#050607";
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      {head && <div style={{ fontSize: 44, fontWeight: 800, color: K.brick, letterSpacing: 3 }}>{head}</div>}
      <div style={{ fontSize: 170, fontWeight: 800, color: dark ? "#fff" : K.petrol, transform: `scale(${1 + (t - a) * 0.012})`, textShadow: dark ? "none" : `5px 6px 0 rgba(181,67,47,.25)` }}>{pre}{s}{suf}</div>
      {sub && <div style={{ fontFamily: HAND, fontSize: 66, color: dark ? K.gold : K.ink, marginTop: 6, opacity: ramp(t, a + 1.6, a + 2.2) }}>{sub}</div>}
      {foot && <div style={{ position: "absolute", bottom: 50, fontSize: 26, color: dark ? "#9AA" : "#7A6A55" }}>{foot}</div>}
    </AbsoluteFill>
  );
};

// iki kefe: kanun ne diyor / gerçekte ne oldu
export const Split: React.FC<{ t: number; a: number; left: { h: string; v: string[] }; right: { h: string; v: string[] }; foot?: string }> = ({ t, a, left, right, foot }) => (
  <AbsoluteFill style={{ background: K.cream, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 70, fontFamily: FONT }}>
    {[left, right].map((s, i) => {
      const k = ramp(t, a + 0.3 + i * 1.4, a + 0.8 + i * 1.4);
      return (
        <div key={i} style={{ width: 720, opacity: k, transform: `translateY(${(1 - k) * 50}px)`, background: i ? K.petrol : "#FFFDF4", color: i ? K.cream : K.ink, borderRadius: 22, boxShadow: shadow, overflow: "hidden" }}>
          <div style={{ background: i ? K.brick : K.petrol, color: "#fff", fontSize: 46, fontWeight: 800, padding: "18px 30px", letterSpacing: 2 }}>{s.h}</div>
          {s.v.map((l, j) => <div key={j} style={{ fontSize: 50, fontWeight: 700, padding: "18px 34px", opacity: ramp(t, a + 0.8 + i * 1.4 + j * 0.5, a + 1.1 + i * 1.4 + j * 0.5) }}>{l}</div>)}
        </div>
      );
    })}
    {foot && <div style={{ position: "absolute", bottom: 50, fontSize: 26, color: "#7A6A55" }}>{foot}</div>}
  </AbsoluteFill>
);

// tuşlu telefon: mesaj yazılıyor veya arama
export const Phone: React.FC<{ t: number; a: number; msg: string; top?: string; right?: string; ring?: boolean; color?: string; screen?: string }> = ({ t, a, msg, top = "Mesaj yaz", right = "", ring, color = "#5A6470", screen = "#E8B04A" }) => {
  const n = Math.floor(ramp(t, a + 0.5, a + 0.5 + msg.length * 0.07) * msg.length);
  const blink = Math.floor(t * 2) % 2 === 0;
  const shake = ring ? Math.sin(t * 60) * 6 * (Math.floor((t - a) * 1.2) % 2 === 0 ? 1 : 0) : 0;
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center" }}>
      {ring && [0, 1, 2].map((i) => { const p = ((t - a) * 0.8 + i / 3) % 1; return <div key={i} style={{ position: "absolute", width: 500 + p * 900, height: 500 + p * 900, borderRadius: "50%", border: `8px solid ${K.brick}`, opacity: 0.5 * (1 - p) }} />; })}
      <div style={{ width: 470, height: 900, background: color, borderRadius: "120px 120px 90px 90px", boxShadow: shadow, padding: "90px 50px", transform: `rotate(${-3 + (t - a) * 0.4 + shake * 0.4}deg) translateX(${shake}px) scale(${1 + (t - a) * 0.01})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ width: 340, height: 300, background: screen, borderRadius: 14, border: "10px solid #2C3238", padding: 18, fontFamily: "monospace", color: "#2A1A08" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700 }}><span>{top}</span><span>{right}</span></div>
          <div style={{ fontSize: ring ? 44 : 34, fontWeight: 700, marginTop: 16, lineHeight: 1.25, wordBreak: "break-word", textAlign: ring ? "center" : "left" }}>{ring ? msg : <>{msg.slice(0, n)}{blink ? "|" : " "}</>}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 90px)", gap: 18 }}>
          {"123456789*0#".split("").map((d, i) => <div key={i} style={{ height: 56, borderRadius: 28, background: !ring && (Math.floor((t - a) * 9) % 12) === i && n < msg.length ? "#DDE6EE" : "#C9D1D8", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, fontSize: 30, fontWeight: 800, color: "#333" }}>{d}</div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// zaman çizgisi
export const Years: React.FC<{ t: number; a: number; items: { y: string; s: string }[]; upto?: number; foot?: string }> = ({ t, a, items, upto = items.length, foot }) => {
  const w = ramp(t, a + 0.2, a + 0.2 + upto * 0.8);
  const gap = 1600 / items.length;
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "relative", width: 1700, height: 460 }}>
        <div style={{ position: "absolute", top: 120, left: 40, height: 12, width: `${w * (upto / items.length) * 92}%`, background: K.petrol, borderRadius: 6 }} />
        {items.slice(0, upto).map((x, i) => {
          const k = ramp(t, a + 0.3 + i * 0.8, a + 0.7 + i * 0.8);
          return (
            <div key={i} style={{ position: "absolute", left: i * gap, top: 50, width: gap - 30, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
              <div style={{ width: 140, height: 140, borderRadius: 70, background: i === upto - 1 ? K.brick : K.petrol, color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 42, fontWeight: 800, boxShadow: shadow }}>{x.y}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: K.ink, marginTop: 30, lineHeight: 1.2 }}>{x.s}</div>
            </div>
          );
        })}
      </div>
      {foot && <div style={{ position: "absolute", bottom: 50, fontSize: 26, color: "#7A6A55" }}>{foot}</div>}
    </AbsoluteFill>
  );
};

export const Silence: React.FC<{ t: number; a: number; text: string; sub?: string }> = ({ t, a, text, sub }) => (
  <AbsoluteFill style={{ background: "#050607", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ fontSize: 104, fontWeight: 800, color: "#EEE", opacity: ramp(t, a + 0.3, a + 1.2), letterSpacing: 2, textAlign: "center", maxWidth: 1600 }}>{text}</div>
    {sub && <div style={{ fontFamily: HAND, fontSize: 60, color: K.gold, marginTop: 30, opacity: ramp(t, a + 1.4, a + 2) }}>{sub}</div>}
  </AbsoluteFill>
);

// büyük soru kartı (videonun sorusu)
export const Question: React.FC<{ t: number; a: number; q: string; img?: string; b: number }> = ({ t, a, q, img, b }) => {
  const sp = useSp(t, a + 0.3, 120);
  return (
    <AbsoluteFill style={{ background: K.night }}>
      {img && <AbsoluteFill style={{ opacity: 0.35 }}><Photo img={img} a={a} b={b} n={7} t={t} /></AbsoluteFill>}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: HAND, fontSize: 60, color: K.gold, opacity: sp }}>Soru</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: K.cream, textAlign: "center", maxWidth: 1500, lineHeight: 1.15, transform: `scale(${0.8 + 0.2 * sp})`, opacity: sp }}>{q}</div>
        <div style={{ width: 360 * sp, height: 8, background: K.brick, marginTop: 34 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// izleyici yorumu kartı (kendi tasarımımız, isim gizli): hikâyenin kaynağı
export const Yorum: React.FC<{ t: number; a: number; text: string; likes: number; who?: string }> = ({ t, a, text, likes, who = "Bir izleyici" }) => {
  const sp = useSp(t, a + 0.2, 110);
  const n = Math.floor(ramp(t, a + 0.6, a + 0.6 + text.length * 0.03) * text.length);
  const l = Math.round(likes * ramp(t, a + 1, a + 2.6));
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 70, fontSize: 40, fontWeight: 800, color: K.brick, letterSpacing: 4 }}>YORUMLARDAN</div>
      <div style={{ width: 1400, background: "#fff", borderRadius: 26, padding: "40px 50px", boxShadow: shadow, display: "flex", gap: 34, transform: `scale(${0.85 + 0.15 * sp}) translateY(${(1 - sp) * 40}px)`, opacity: sp }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: K.petrol, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", color: K.cream, fontSize: 56, fontWeight: 800 }}>?</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#7A6A55" }}>{who} · isim gizlendi</div>
          <div style={{ fontSize: 46, fontWeight: 600, color: K.ink, lineHeight: 1.3, marginTop: 12 }}>{text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, fontSize: 38, fontWeight: 800, color: K.brick }}>
            <svg width={44} height={44} viewBox="0 0 24 24"><path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z" fill={K.brick} /></svg>
            {l}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 50, fontSize: 26, color: "#7A6A55" }}>Hikâye izleyici yorumlarından derlendi · isimler değiştirildi</div>
    </AbsoluteFill>
  );
};

// ───────── fabrika ─────────
export type K5Opts = {
  id: string; words: { text: string; start: number; end: number }[]; shots: Shot[]; year: number;
  gauge?: [string, string]; alt?: Record<string, string[]>; title: string;
};
const FULL = new Set<unknown>([Doc, Letter, Route, Counter, Split, Phone, Years, Silence, Re, Scene, Question, Yorum]);
export const markFull = (...c: unknown[]) => c.forEach((x) => FULL.add(x));

// "On yedi yaşındasın" ← "17 yaşındasın" (Whisper بيكتب الأرقام أرقام). "bir" لحالها بتضل.
const NUM: Record<string, number> = { sıfır: 0, bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, yirmi: 20, otuz: 30, kırk: 40, elli: 50, altmış: 60, yetmiş: 70, seksen: 80, doksan: 90 };
export const digitize = (s: string) => {
  const ws = s.split(/\s+/), out: string[] = [];
  let run: string[] = [];
  const flush = () => {
    if (!run.length) return;
    if (run.length === 1 && run[0].toLocaleLowerCase("tr-TR") === "bir") out.push(run[0]);
    else {
      let total = 0, cur = 0;
      for (const r of run) { const v = r.toLocaleLowerCase("tr-TR"); if (v === "yüz") cur = (cur || 1) * 100; else if (v === "bin") { total += (cur || 1) * 1000; cur = 0; } else cur += NUM[v]; }
      out.push(String(total + cur));
    }
    run = [];
  };
  for (const w of ws) { const v = w.toLocaleLowerCase("tr-TR"); if (v in NUM || v === "yüz" || v === "bin") run.push(w); else { flush(); out.push(w); } }
  flush();
  return out.join(" ");
};

export const makeK5 = (o: K5Opts) => {
  // صوت لسا ما انعمل: نموذج فاضي ثانية وحدة، لحتى ما ينكسر تجميع المحرك لباقي القنوات
  if (!o.words || o.words.length === 0) return { Comp: (() => <AbsoluteFill style={{ background: "#000" }} />) as React.FC, seconds: 1 };
  const words = o.words;
  const ALT = o.alt ?? {};
  const cueRaw = makeCue(words);
  // عبارة ← بدائل: الأرقام المكتوبة ← أرقام (Whisper)، وبعدين بلا أول كلمة أو كلمتين (كلمة انسمعت غلط)
  const variants = (x: string) => {
    const d = digitize(x), out = [x, ...(ALT[x] ?? []), d];
    for (const base of [x, d]) {
      const ws = base.split(/\s+/);
      for (let k = 1; k <= 2 && ws.length - k >= 2; k++) out.push(ws.slice(k).join(" "));
      if (ws.length >= 3) out.push(ws.slice(0, -1).join(" "));
    }
    return out;
  };
  const cue = (p: string | string[], after = 0) => {
    const ps = Array.isArray(p) ? p : [p];
    try { return cueRaw(ps.flatMap((x) => [x, ...(ALT[x] ?? []), digitize(x)]), after); } catch { /* fallback */ }
    try { const v = cueRaw(ps.flatMap(variants), after); if (v - after < 45) return v; } catch { /* soft */ }
    return after + 1.5; // ما انلقت: لقطة قصيرة بعد اللي قبلها بدل ما ينكسر الفيديو
  };
  const VOICE_END = words[words.length - 1].end;
  type Timed = Shot & { from: number; to: number; Y: number; G: number | null };
  const TIMED: Timed[] = (() => {
    let after = 0, Y = o.year, G: number | null = null;
    const raw = o.shots.map((s, i) => {
      const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
      after = from + 0.2;
      if (s.yr) Y = s.yr;
      if (s.g !== undefined) G = s.g;
      return { ...s, from, to: 0, Y, G } as Timed;
    });
    raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : VOICE_END + 1.2));
    return raw;
  })();
  const [gl, gr] = o.gauge ?? ["", ""];

  const Hud: React.FC<{ s: Timed; prev?: Timed; t: number }> = ({ s, prev, t }) => {
    const flip = ramp(t, s.from, s.from + 0.5);
    const yChanged = prev && prev.Y !== s.Y;
    const gFrom = prev?.G ?? s.G ?? 0, gTo = s.G ?? 0;
    const g = gFrom + (gTo - gFrom) * ramp(t, s.from + 0.3, s.from + 1.6);
    return (
      <>
        <div style={{ position: "absolute", right: 60, top: 50, background: K.petrol, color: K.cream, fontFamily: FONT, fontWeight: 800, fontSize: 54, padding: "6px 26px", borderRadius: 12, boxShadow: shadow, transform: yChanged ? `rotateX(${(1 - flip) * 90}deg)` : undefined }}>{s.Y}</div>
        {s.G !== null && gl && (
          <div style={{ position: "absolute", right: 60, top: 136, width: 340, fontFamily: FONT, background: "rgba(243,230,207,.93)", borderRadius: 10, padding: "8px 14px", boxShadow: shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, color: K.ink, letterSpacing: 2 }}><span>{gl}</span><span>{gr}</span></div>
            <div style={{ height: 18, background: "#D6C7A8", borderRadius: 9, marginTop: 6, position: "relative" }}>
              <div style={{ height: "100%", width: `${g}%`, background: `linear-gradient(90deg, ${K.petrol}, ${K.brick})`, borderRadius: 9 }} />
              <div style={{ position: "absolute", left: `calc(${g}% - 12px)`, top: -5, width: 24, height: 28, borderRadius: 6, background: "#fff", border: `4px solid ${K.ink}` }} />
            </div>
          </div>
        )}
      </>
    );
  };
  const Outro: React.FC<{ t: number }> = ({ t }) => {
    const a = ramp(t, VOICE_END + 0.8, VOICE_END + 1.8);
    if (a <= 0) return null;
    return (
      <AbsoluteFill style={{ background: K.cream, opacity: a, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 150, fontWeight: 800, color: K.petrol, textShadow: `6px 7px 0 ${K.brick}` }}>O Yıl Sen</div>
        <div style={{ width: 420, height: 7, background: K.brick, margin: "26px 0" }} />
        <div style={{ fontSize: 44, fontWeight: 600, color: K.petrol }}>{o.title}</div>
      </AbsoluteFill>
    );
  };
  const Comp: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    let n = 0;
    for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
    const s = TIMED[n];
    const fadeIn = interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
    const body = s.r?.(t, s.from, s.to);
    return (
      <Dir.Provider value={o.id}>
        <AbsoluteFill style={{ background: K.ink }}>
          <AbsoluteFill style={{ opacity: fadeIn }}>
            {s.img ? <Photo img={s.img} a={s.from} b={s.to} n={n} t={t} glow={s.glow} /> : React.isValidElement(body) && FULL.has(body.type) ? body : <AbsoluteFill>{body}</AbsoluteFill>}
            {s.img && body}
            {s.ov?.map((x, i) => <OvEl key={i} o={x} t={t} at={s.from + 0.35 + (x.d ?? 0)} />)}
            {s.html?.(t, s.from, s.to)}
            <Hud s={s} prev={TIMED[n - 1]} t={t} />
          </AbsoluteFill>
          <Outro t={t} />
          <Audio src={staticFile(`audio/${o.id}.wav`)} />
          {TIMED.map((x, i) => i > 0 && (
            <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
              <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx ? (x.from > VOICE_END - 15 ? 0.08 : 0.18) : 0.07} />
            </Sequence>
          ))}
        </AbsoluteFill>
      </Dir.Provider>
    );
  };
  return { Comp, seconds: Math.ceil(VOICE_END + 4) };
};
