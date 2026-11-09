import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k5-05-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { FONT, HAND } from "../../theme";

// Kanal 5 · O Yıl Sen · k5-05 "Çakır'ın Öldüğü Gece" (8 Nisan 2004). 50 görsel (GPT Image 2) + motor kartları.
// Sabit araçlar: sağ üstte yıl levhası (yr), altında "KURGU ↔ GERÇEK" ölçeği (g: 0 kurgu … 100 gerçek).
const K = { cream: "#F3E6CF", brick: "#B5432F", petrol: "#1F4E5F", ink: "#2B2420", night: "#14202A", tv: "#7FB2D6" };

const ALT: Record<string, string[]> = {};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const cue = (p: string | string[], after = 0) => cueRaw((Array.isArray(p) ? p : [p]).flatMap((x) => [x, ...(ALT[x] ?? [])]), after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K5_05_SECONDS = Math.ceil(VOICE_END + 4);

type Pos = "tl" | "tr" | "bl" | "br" | "bc" | "tc";
type O =
  | { t: "date"; a: string; b?: string; d?: number }
  | { t: "tag"; a: string; b?: string; d?: number }
  | { t: "note"; a: string; p?: Pos; d?: number }
  | { t: "quote"; a: string; p?: Pos; d?: number }
  | { t: "cap"; a: string; d?: number }
  | { t: "arrow"; a: string; x: number; y: number; from?: "l" | "r"; d?: number }
  | { t: "list"; a: string[]; p?: Pos; d?: number };
type R = (t: number, a: number, b: number) => React.ReactNode;
type Shot = { c: string | string[]; img?: string; ov?: O[]; r?: R; html?: R; yr?: number; g?: number | null; sfx?: string };

const useSp = (t: number, at: number, st = 130) => {
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 14, stiffness: st } });
};
const shadow = "0 12px 30px rgba(0,0,0,.38)";
const POS: Record<Pos, React.CSSProperties> = {
  tl: { left: 70, top: 70 }, tr: { right: 70, top: 200 }, bl: { left: 70, bottom: 80 }, br: { right: 70, bottom: 80 },
  bc: { left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center" }, tc: { left: 0, right: 0, top: 60, display: "flex", justifyContent: "center" },
};
const Pop: React.FC<{ t: number; at: number; style?: React.CSSProperties; rot?: number; children: React.ReactNode }> = ({ t, at, style, rot = -5, children }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", opacity: sp, transform: `scale(${0.6 + 0.4 * sp}) rotate(${(1 - sp) * rot}deg)`, ...style }}>{children}</div>;
};
const Txt: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; color?: string; sub?: string; bg?: string }> = ({ t, at, text, y = 80, size = 88, color = K.cream, sub, bg = "rgba(20,32,42,.82)" }) => {
  const sp = useSp(t, at, 150);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: 110, right: 110, top: y, textAlign: "center", opacity: sp, transform: `translateY(${(1 - sp) * 30}px)` }}>
      <div style={{ display: "inline-block", background: bg, borderRadius: 20, padding: `${size * 0.14}px ${size * 0.42}px`, boxShadow: shadow, fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.1 }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.42, color: "#fff", marginTop: 12, textShadow: "0 3px 0 rgba(0,0,0,.45)" }}>{sub}</div>}
    </div>
  );
};

const OvEl: React.FC<{ o: O; t: number; at: number }> = ({ o, t, at }) => {
  const box: React.CSSProperties = { fontFamily: FONT, color: K.ink, boxShadow: shadow };
  if (o.t === "date")
    return (
      <Pop t={t} at={at} style={{ left: 70, top: 60 }}>
        <div style={{ ...box, width: 400, background: K.cream, borderRadius: 10, overflow: "hidden" }}>
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
  return null;
};

// ───────── Ken Burns ─────────
const CROPS = [
  [1.08, 0, 0, 1.2, 0.04, -0.02], [1.3, -0.08, 0.05, 1.2, -0.05, 0.03], [1.28, 0.08, -0.04, 1.18, 0.06, 0],
  [1.2, 0, 0.07, 1.06, 0, 0], [1.34, 0.07, 0.06, 1.24, 0.03, 0.02], [1.34, -0.07, -0.05, 1.22, -0.03, -0.02],
];
const Photo: React.FC<{ img: string; a: number; b: number; n: number; t: number; tvGlow?: boolean; clip?: { a0: number; rate: number } }> = ({ img, a, b, n, t, tvGlow, clip }) => {
  const { fps } = useVideoConfig();
  const len = b - a;
  const kk = Math.max(1, Math.round(len / (a < 240 ? 3.4 : 5)));
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
  // TV titremesi: gece sahnelerinde mavi ışık nefes alıyor
  const flick = tvGlow ? 0.07 + 0.05 * Math.sin(t * 7.3 + n) * Math.sin(t * 2.1) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {clip ? (
        // Canva hareketli klibi: kendi kamera hareketi var, motor sadece hafif el kamerası salınımı ekler
        <Sequence from={Math.round(clip.a0 * fps)} layout="none">
          <AbsoluteFill style={{ transform: `scale(${1.02 + 0.03 * punch * punch}) translate(${Math.sin(t * 0.9 + n) * 0.3}%, ${Math.cos(t * 0.7 + n) * 0.25}%)`, filter: enter > 0 ? `blur(${enter * 10}px) brightness(${1 + enter * 0.5})` : undefined }}>
            <OffthreadVideo src={staticFile(`video/k5-05/${img}.mp4`)} muted playbackRate={clip.rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      ) : (
        <Img src={staticFile(`img/k5-05/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translate(${x * 100}%, ${y * 100}%) rotate(${rot}deg)`, filter: enter > 0 ? `blur(${enter * 10}px) brightness(${1 + enter * 0.5})` : undefined }} />
      )}
      {tvGlow ? <AbsoluteFill style={{ background: K.tv, opacity: flick, mixBlendMode: "screen" }} /> : <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${sweep * 100 - 12}%, rgba(255,236,200,.13) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)` }} />}
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
const TVG = new Set(["03", "05", "06", "07", "14", "22", "26", "28", "29", "30", "31", "32", "33"]);

// motor kartlarının altında: aynı görselin farklı kadrajı, koyulaştırılmış
const Re: React.FC<{ img: string; t: number; a: number; b: number; d: number }> = ({ img, t, a, b, d }) => (
  <AbsoluteFill><Photo img={img} a={a} b={b} n={img.charCodeAt(1) + 3} t={t} /><AbsoluteFill style={{ background: K.night, opacity: d }} /></AbsoluteFill>
);

// ───────── motor sahneleri ─────────
const Doc: React.FC<{ t: number; a: number; head: string; lines: string[]; foot?: string; stamp?: string; bg?: string }> = ({ t, a, head, lines, foot, stamp, bg = "#2A1E14" }) => {
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

// 2004 parası: sayaç + ekmek
const Money: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const v = Math.round(303 * ramp(t, a + 0.3, a + 2.0));
  const breads = Math.round(13 * ramp(t, a + 1.6, a + 3.2));
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 40, fontWeight: 800, color: K.brick, letterSpacing: 3 }}>2004 · ASGARİ ÜCRET</div>
      <div style={{ fontSize: 150, fontWeight: 800, color: K.petrol, transform: `scale(${1 + (t - a) * 0.01})` }}>{v}.000.000 TL</div>
      <div style={{ display: "flex", gap: 18, marginTop: 30, height: 120 }}>
        {Array.from({ length: breads }, (_, i) => (
          <svg key={i} width={110} height={110} viewBox="0 0 110 110"><ellipse cx={55} cy={62} rx={50} ry={30} fill="#D9A25A" stroke="#8A5A2A" strokeWidth={5} /><path d="M25 55 q10 -12 20 0 M50 52 q10 -12 20 0 M75 55 q8 -10 16 0" stroke="#8A5A2A" strokeWidth={4} fill="none" /></svg>
        ))}
      </div>
      {t > a + 1.6 && <div style={{ fontFamily: HAND, fontSize: 64, color: K.ink, marginTop: 10 }}>≈ {Math.round(1300 * ramp(t, a + 1.6, a + 3.2))} ekmek</div>}
      {t > a + 2.6 && <div style={{ position: "absolute", bottom: 60, fontSize: 26, color: "#7A6A55" }}>Kaynak: Ekonomi Gazetesi, asgari ücretin alım gücü karşılaştırması</div>}
    </AbsoluteFill>
  );
};

// YTL: altı sıfır siliniyor
const Zeros: React.FC<{ t: number; a: number; back?: boolean }> = ({ t, a, back }) => {
  const k = ramp(t, a + 1.0, a + 2.4);
  return (
    <AbsoluteFill style={{ background: K.night, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 150, fontWeight: 800, color: "#fff" }}>
        1{k < 0.97 && <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", whiteSpace: "nowrap", maxWidth: `${(1 - k) * 560}px`, color: K.brick, opacity: 1 - k, textDecoration: k > 0.1 ? "line-through" : undefined }}>.000.000</span>} {k > 0.6 ? "YTL" : "TL"}
      </div>
      <div style={{ fontSize: 50, fontWeight: 700, color: "#FFD27A", marginTop: 30, opacity: ramp(t, a + 2.2, a + 2.8) }}>{back ? "1 Ocak 2005 · altı sıfır silindi" : "Yeni Türk Lirası · 1 Ocak 2005'te gelecek"}</div>
    </AbsoluteFill>
  );
};

// tuşlu telefon: SMS yazılıyor, kontör düşüyor
const Nokia: React.FC<{ t: number; a: number; msg: string; credit: [number, number]; head?: string }> = ({ t, a, msg, credit, head = "Mesaj yaz" }) => {
  const n = Math.floor(ramp(t, a + 0.5, a + 0.5 + msg.length * 0.07) * msg.length);
  const c = Math.round(credit[0] + (credit[1] - credit[0]) * ramp(t, a + 1, a + 4));
  const blink = Math.floor(t * 2) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 470, height: 900, background: "#5A6470", borderRadius: "120px 120px 90px 90px", boxShadow: shadow, padding: "90px 50px", transform: `rotate(${-3 + (t - a) * 0.4}deg) scale(${1 + (t - a) * 0.01})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ width: 340, height: 300, background: "#A8C57A", borderRadius: 14, border: "10px solid #2C3238", padding: 18, fontFamily: "monospace", color: "#1E2A14" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700 }}><span>{head}</span><span>{c} kontör</span></div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 16, lineHeight: 1.25, wordBreak: "break-word" }}>{msg.slice(0, n)}{blink ? "|" : " "}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 90px)", gap: 18 }}>
          {"123456789*0#".split("").map((d, i) => <div key={i} style={{ height: 56, borderRadius: 28, background: (Math.floor((t - a) * 9) % 12) === i && n < msg.length ? "#DDE6EE" : "#C9D1D8", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, fontSize: 30, fontWeight: 800, color: "#333" }}>{d}</div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// tüplü TV kartı: ekranda yazı
const CRT: React.FC<{ t: number; a: number; title: string; sub?: string; off?: boolean }> = ({ t, a, title, sub, off }) => {
  const on = ramp(t, a + 0.1, a + 0.5);
  const noise = 0.06 + 0.04 * Math.sin(t * 40);
  return (
    <AbsoluteFill style={{ background: "#1A1410", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1300, height: 900, background: "#3A3A3A", borderRadius: 50, padding: 60, boxShadow: "0 0 140px rgba(127,178,214,.35)", transform: `scale(${1.02 + (t - a) * 0.012})`, display: "flex", gap: 40 }}>
        <div style={{ flex: 1, background: off ? "#0A0A0A" : "#0D2233", borderRadius: "60px / 50px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
          {!off && <>
            <div style={{ fontSize: 110, fontWeight: 800, color: "#F4F4F4", letterSpacing: 6, opacity: on, transform: `scaleY(${on})`, textShadow: "0 0 30px rgba(127,178,214,.8)" }}>{title}</div>
            {sub && <div style={{ fontSize: 48, fontWeight: 700, color: K.tv, marginTop: 24, opacity: ramp(t, a + 0.9, a + 1.4) }}>{sub}</div>}
            <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 3px, transparent 3px 7px)", opacity: noise * 6 }} />
          </>}
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.12), transparent 50%)" }} />
        </div>
        <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 30, paddingTop: 40 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 80, height: 80, borderRadius: 40, background: "#222", border: "6px solid #555" }} />)}
          <div style={{ width: 24, height: 24, borderRadius: 12, background: off ? "#550" : "#3F3", marginTop: 40, marginLeft: 28 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// takvim: 18 Mart → 8 Nisan, perşembeler
const Calendar: React.FC<{ t: number; a: number; upto: number }> = ({ t, a, upto }) => {
  const eps = [{ d: "18 Mart", e: "43. bölüm", n: "pusu" }, { d: "25 Mart", e: "44. bölüm", n: "hastanede" }, { d: "1 Nisan", e: "", n: "bekleyiş" }, { d: "8 Nisan", e: "45. bölüm", n: "…" }];
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: K.brick, letterSpacing: 3, marginBottom: 40 }}>2004 · PERŞEMBE AKŞAMLARI</div>
      <div style={{ display: "flex", gap: 34 }}>
        {eps.slice(0, upto).map((x, i) => {
          const k = ramp(t, a + 0.3 + i * 0.7, a + 0.7 + i * 0.7);
          const last = i === 3;
          return (
            <div key={i} style={{ width: 330, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, background: last ? K.petrol : "#FFFDF4", borderRadius: 14, overflow: "hidden", boxShadow: shadow }}>
              <div style={{ background: last ? K.brick : K.petrol, height: 30 }} />
              <div style={{ padding: "26px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 56, fontWeight: 800, color: last ? "#fff" : K.petrol }}>{x.d}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: last ? "#FFD27A" : K.brick, marginTop: 8, minHeight: 40 }}>{x.e}</div>
                <div style={{ fontFamily: HAND, fontSize: 46, color: last ? "#fff" : K.ink, marginTop: 6 }}>{x.n}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 60, fontSize: 26, color: "#7A6A55" }}>Bölüm tarihleri: Hürriyet, Türkiye Gazetesi (yıl dönümü haberleri)</div>
    </AbsoluteFill>
  );
};

// gazete taziye ilanı (kendi tasarımımız, gerçek gazete değil)
const Ilan: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = useSp(t, a + 0.4, 90);
  return (
    <AbsoluteFill style={{ background: "#D9CFBD", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 80, background: "repeating-linear-gradient(90deg, transparent 0 290px, #CBBFA9 290px 296px)", opacity: 0.6 }} />
      {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + (i % 6) * 280, top: 120 + Math.floor(i / 6) * 300, width: 230, height: 14 + (i % 3) * 4, background: "#B9AD97", borderRadius: 6 }} />)}
      <div style={{ width: 760, background: "#FBF8F1", border: "14px solid #111", padding: "40px 50px", textAlign: "center", boxShadow: shadow, transform: `scale(${0.85 + 0.15 * k + (t - a) * 0.008}) rotate(-1deg)`, opacity: k }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 8, color: "#111" }}>TAZİYE</div>
        <div style={{ height: 3, background: "#111", margin: "18px 80px" }} />
        <div style={{ fontSize: 78, fontWeight: 800, color: "#111", fontStyle: "italic" }}>Süleyman Çakır</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: "#333", marginTop: 16 }}>Allah rahmet eylesin.</div>
        <div style={{ fontSize: 26, color: "#666", marginTop: 20 }}>Seni unutmayacağız.</div>
      </div>
      <div style={{ position: "absolute", bottom: 40, fontSize: 24, color: "#5A4E3E" }}>Temsilî çizim · Taziye ilanları: CNN Türk, Haber7</div>
    </AbsoluteFill>
  );
};

// Türkiye: aynı anda yanan pencereler
const Windows: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.2, a + 3.5);
  return (
    <AbsoluteFill style={{ background: "#0B1118" }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 + (t - a) * 0.015})` }}>
        {Array.from({ length: 22 }, (_, r) => Array.from({ length: 38 }, (_, c) => {
          const id = r * 38 + c;
          const on = ((id * 7919) % 1000) / 1000 < k;
          return <div key={id} style={{ position: "absolute", left: 30 + c * 50, top: 20 + r * 48, width: 30, height: 26, background: on ? K.tv : "#1A2430", opacity: on ? 0.55 + 0.35 * Math.sin(t * 6 + id) : 0.6, borderRadius: 3 }} />;
        }))}
      </AbsoluteFill>
      <Txt t={t} at={a + 1.2} text="Aynı akşam · aynı saat · aynı ekran" size={70} y={440} />
    </AbsoluteFill>
  );
};

// yıllar: 2008 → 2020 → 2025
const Years: React.FC<{ t: number; a: number; upto: number }> = ({ t, a, upto }) => {
  const Y = [
    { y: "2004", s: "8 Nisan · 45. bölüm" },
    { y: "2008", s: "Kocaeli · anma ilanı" },
    { y: "2020", s: "Sosyal medyada gündem" },
    { y: "2025", s: "Ankara · lokma dağıtımı" },
  ];
  const w = ramp(t, a + 0.2, a + 0.2 + upto * 0.8);
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "relative", width: 1600, height: 420 }}>
        <div style={{ position: "absolute", top: 120, left: 0, height: 12, width: `${w * 88 * (upto / 4)}%`, background: K.petrol, borderRadius: 6 }} />
        {Y.slice(0, upto).map((x, i) => {
          const k = ramp(t, a + 0.3 + i * 0.8, a + 0.7 + i * 0.8);
          return (
            <div key={i} style={{ position: "absolute", left: i * 470, top: 60, width: 400, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: i === upto - 1 ? K.brick : K.petrol, color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 40, fontWeight: 800, boxShadow: shadow }}>{x.y}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: K.ink, marginTop: 30 }}>{x.s}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 60, fontSize: 26, color: "#7A6A55" }}>Kaynaklar: Milli Gazete (2008 ilanı), CNN Türk (2020), İHA (2025)</div>
    </AbsoluteFill>
  );
};

// "Ve sessizlik." — tamamen karanlık, tek cümle
const Silence: React.FC<{ t: number; a: number; text: string }> = ({ t, a, text }) => (
  <AbsoluteFill style={{ background: "#050607", justifyContent: "center", alignItems: "center" }}>
    <div style={{ fontFamily: FONT, fontSize: 110, fontWeight: 800, color: "#EEE", opacity: ramp(t, a + 0.3, a + 1.2), letterSpacing: 2 }}>{text}</div>
  </AbsoluteFill>
);

// kalp ritmi → düz çizgi
const Pulse: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const flat = ramp(t, a + 2.2, a + 2.6);
  const pts = Array.from({ length: 200 }, (_, i) => {
    const x = i * 9.6;
    const ph = ((x / 1920) * 4 + (t - a) * 1.2) % 1;
    const beat = ph > 0.45 && ph < 0.55 ? Math.sin((ph - 0.45) * Math.PI * 20) * 220 : 0;
    return `${x},${540 - beat * (1 - flat)}`;
  }).join(" ");
  return (
    <AbsoluteFill style={{ background: "#061015" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%"><polyline points={pts} fill="none" stroke="#5CE08A" strokeWidth={8} style={{ filter: "drop-shadow(0 0 12px #5CE08A)" }} /></svg>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 0 · Kahve ──
  { c: "Perşembe akşamı", img: "01", yr: 2004, ov: [{ t: "date", a: "8 Nisan 2004", b: "Perşembe · 20:55" }, { t: "note", a: "Keçiören · Ankara", p: "br", d: 1.4 }] },
  { c: "mahalle kahvesinde", img: "02", ov: [{ t: "note", a: "tek boş sandalye yok", p: "tr", d: 0.8 }] },
  { c: "Senin adın Burak", img: "04", ov: [{ t: "tag", a: "BURAK", b: "16 · lise 2 · Keçiören" }] },
  { c: "Okul çantan", img: "04", ov: [{ t: "note", a: "çanta hâlâ sırtında", p: "br", d: 0.4 }] },
  { c: "Duvardaki tüplü", img: "03", ov: [{ t: "note", a: "40 kişi · 1 televizyon", p: "bl", d: 1.0 }] },
  { c: "Okey taşları", img: "05" },
  { c: "Çaycı bile", img: "06" },
  { c: "Bu gece bir adam", img: "07" },
  { c: "Gerçek bir adam değil", img: "08", g: 0, ov: [{ t: "cap", a: "Bir dizi karakteri.", d: 1.6 }] },
  { c: "Ama birkaç gün sonra", r: (t, a, b) => <Re img="08" t={t} a={a} b={b} d={0.55} />, g: 10,
    html: (t, a) => <><Txt t={t} at={a + 0.6} text="GERÇEK BİR" size={70} y={330} /><Txt t={t} at={a + 1.4} text="CENAZE NAMAZI" size={120} y={460} color="#FFD27A" bg="rgba(181,67,47,.9)" /></> },
  { c: "Bu videoda o geceyi", img: "30" },
  { c: "Bir ülke, hiç yaşamamış", r: (t, a, b) => <Re img="01" t={t} a={a} b={b} d={0.6} />,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="Bir ülke, hiç yaşamamış bir adam için neden yas tuttu?" size={70} y={400} /> },
  // ── 1 · 2004 ──
  { c: "Önce bulunduğun yılı", img: "09", ov: [{ t: "note", a: "cüzdanda milyonlar", p: "tr", d: 0.8 }] },
  { c: "Asgari ücret", r: (t, a) => <Money t={t} a={a} /> },
  { c: "Bu parayla", img: "10", ov: [{ t: "note", a: "≈ 1.300 ekmek", p: "tr", d: 0.4 }] },
  { c: ["Altı sıfır henüz", "6 -0 henüz", "henüz silinmedi"], r: (t, a) => <Zeros t={t} a={a} /> },
  { c: "Cebinde tuşlu", r: (t, a) => <Nokia t={t} a={a} msg="Slm. Bu aksm kahvdeyz. Gec kalma!" credit={[48, 31]} /> },
  { c: "o yüzden mesajları", img: "11" },
  { c: "Akşamları internet", img: "12", ov: [{ t: "note", a: "internet kafe · 2004", p: "tr", d: 0.6 }] },
  { c: "YouTube yok", r: (t, a, b) => <Re img="14" t={t} a={a} b={b} d={0.4} />,
    html: (t, a) => <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", gap: 40 }}>
      {["✗ YouTube", "✗ Instagram", "✗ tekrar izleme"].map((s, i) => <Pop key={i} t={t} at={a + 0.2 + i * 0.9} style={{ position: "relative" }}><div style={{ background: K.cream, color: K.brick, fontFamily: FONT, fontWeight: 800, fontSize: 60, padding: "14px 34px", borderRadius: 14, boxShadow: shadow }}>{s}</div></Pop>)}
    </div> },
  { c: "Bir bölümü kaçırırsan", img: "13" },
  { c: "Bu yüzden bütün ülke", img: "14", ov: [{ t: "cap", a: "Bütün ülke · aynı dakika · aynı ekran", d: 0.8 }] },
  { c: "Ve perşembe akşamlarının", r: (t, a) => <CRT t={t} a={a} title="KURTLAR VADİSİ" sub="Perşembe akşamları · Show TV" /> },
  // ── 2 · Çakır ──
  { c: "Dizi 2003", img: "15", ov: [{ t: "note", a: "2003'te başladı", p: "tr", d: 0.6 }] },
  { c: "Ama senin için", r: (t, a, b) => <Re img="15" t={t} a={a} b={b} d={0.45} />,
    html: (t, a) => <Txt t={t} at={a + 1.0} text="Dizinin kalbi…" size={80} y={430} /> },
  { c: ["Çakır'ın hikayesini", "hikayesini ezbere"], r: (t, a, b) => <Re img="07" t={t} a={a} b={b} d={0.25} />,
    html: (t, a) => <Pop t={t} at={a + 0.1} style={{ left: 80, bottom: 90 }}><div style={{ background: K.cream, borderLeft: `14px solid ${K.brick}`, padding: "14px 32px", borderRadius: 6, fontFamily: FONT, boxShadow: shadow }}><div style={{ fontSize: 66, fontWeight: 800, color: K.petrol }}>SÜLEYMAN ÇAKIR</div><div style={{ fontSize: 30, fontWeight: 600, color: K.brick }}>dizinin kalbi</div></div></Pop> },
  { c: "Çocukken babasının", img: "16", ov: [{ t: "note", a: "cami avlusu", p: "tr", d: 1.4 }] },
  { c: "Annesinin evde", img: "17", ov: [{ t: "note", a: "nohutlu pilav", p: "tr", d: 0.8 }] },
  { c: "Annesine ve kız", img: "18" },
  { c: "Bir gün zabıtayla", img: "19", ov: [{ t: "note", a: "hapis", p: "tr", d: 2.2 }] },
  { c: "Dışarı çıktığında", r: (t, a, b) => <Re img="15" t={t} a={a} b={b} d={0.6} />,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="…karanlık bir dünya" size={80} y={430} /> },
  { c: "Ama sen onu", img: "20", ov: [{ t: "list", a: ["sözünden dönmez", "arkadaşını satmaz", "annesine bakar"], p: "tl", d: 0.8 }] },
  { c: "Babanın kahvede", img: "05", ov: [{ t: "quote", a: "Adamlık bu işte.", d: 0.6 }] },
  { c: "Bir şeyi baştan", img: "21", g: 0 },
  { c: "Çakır bir kurgu", r: (t, a) => <Doc t={t} a={a} head="NOT" lines={["Bu bir dizi.", "Çakır kurgu, işlediği suçlar da."]} /> },
  { c: "Bu video kurgunun", r: (t, a, b) => <Re img="03" t={t} a={a} b={b} d={0.5} />,
    html: (t, a) => <Txt t={t} at={a + 0.6} text="Kurguya ağlayan GERÇEK insanlar" size={76} y={420} color="#FFD27A" /> },
  // ── 3 · 18 Mart ──
  { c: "Her şey üç hafta", r: (t, a) => <Calendar t={t} a={a} upto={1} /> },
  { c: "Çakır bir pusuya", img: "22", g: 15 },
  { c: "Bölüm bitti", r: (t, a) => <CRT t={t} a={a} title="" off /> },
  { c: "Ve sen o gece", img: "23" },
  { c: "Sonraki günlerde", img: "24", ov: [{ t: "quote", a: "Ölmez lan, Çakır ölmez.", p: "tc", d: 1.2 }] },
  { c: "Senaristler buna", r: (t, a, b) => <Re img="24" t={t} a={a} b={b} d={0.4} />,
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“Senaristler buna cesaret edemez.”" size={66} y={80} /> },
  { c: "Telefonuna zincir", r: (t, a) => <Nokia t={t} a={a} head="Yeni mesaj" msg="CAKIR OLMESIN. DUA ET VE 10 KISIYE GONDER" credit={[31, 12]} />, g: 25 },
  { c: "Sanki ne kadar", img: "25" },
  { c: "Bir hafta geçiyor", r: (t, a) => <Calendar t={t} a={a - 2.8} upto={3} /> },
  { c: "Her hastane sahnesinde", img: "26" },
  { c: "annen mutfaktan", img: "27" },
  { c: "Annen aslında", r: (t, a, b) => <Re img="27" t={t} a={a} b={b} d={0.35} />,
    html: (t, a) => <Pop t={t} at={a + 0.6} style={{ right: 120, top: 220 }}><div style={{ fontFamily: HAND, fontSize: 64, background: "#FFF6DC", color: K.ink, padding: "8px 30px", borderRadius: 8, boxShadow: shadow }}>“Hep silah, hep kavga.”</div></Pop> },
  { c: "Ama perşembe akşamları o da", img: "27" },
  // ── 4 · Gece ──
  { c: "Ve işte bu gece", r: (t, a) => <Calendar t={t} a={a - 2.8} upto={4} />, g: 35 },
  { c: "Kahvede biri sigarasını", img: "28" },
  { c: "Televizyonun sesi", img: "03" },
  { c: "Hastane odası", img: "29" },
  { c: "Ve o an geliyor", r: (t, a) => <Pulse t={t} a={a} /> },
  { c: "Kahvede kimse", img: "30", g: 55 },
  { c: "Ve sessizlik", r: (t, a) => <Silence t={t} a={a} text="Ve sessizlik." /> },
  { c: "Arkandaki masadan", img: "31", ov: [{ t: "quote", a: "Allah rahmet eylesin.", p: "tc", d: 1.6 }] },
  { c: "Kimse gülmüyor", img: "31" },
  { c: "Yanındaki arkadaşın", img: "32", ov: [{ t: "tag", a: "VOLKAN", b: "“Göze toz kaçtı.”", d: 0.8 }] },
  { c: ["Eve yürürken", "Eve yırırken"], img: "33", g: 60 },
  { c: "Bütün evler aynı kanalda", r: (t, a, b) => <Re img="33" t={t} a={a} b={b} d={0.45} />,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="Bütün evler aynı anda susmuş." size={72} y={90} /> },
  // ── 5 · Ertesi gün ──
  { c: "Cuma sabahı", img: "34", ov: [{ t: "date", a: "9 Nisan 2004", b: "Cuma sabahı" }] },
  { c: "Palto ona", img: "34", ov: [{ t: "arrow", a: "3 beden büyük", x: 900, y: 650, from: "r", d: 0.3 }] },
  { c: "Nöbetçi öğretmen", img: "35" },
  { c: "Birkaç gün içinde", img: "36", g: 70 },
  { c: "Gazetede bir ilan", img: "37" },
  { c: "Ölen kişinin adı", r: (t, a) => <Ilan t={t} a={a} /> },
  { c: "Gülmek istiyorsun", r: (t, a, b) => <Re img="37" t={t} a={a} b={b} d={0.45} />,
    html: (t, a) => <Txt t={t} at={a + 1.8} text="Şaka değil." size={90} y={430} /> },
  { c: ["Gerçek insanlar gerçek", "Gerçek insanlar, gerçek"], r: (t, a, b) => <Re img="36" t={t} a={a} b={b} d={0.45} />,
    html: (t, a) => <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 30 }}>
      {["gerçek insanlar", "gerçek para", "gerçek gazete"].map((x, i) => <Pop key={i} t={t} at={a + 0.2 + i * 0.8} style={{ position: "relative" }}><div style={{ background: K.cream, color: K.brick, fontFamily: FONT, fontWeight: 800, fontSize: 58, padding: "14px 30px", borderRadius: 14, boxShadow: shadow }}>{x}</div></Pop>)}
    </div> },
  { c: "Ve haberler gelmeye", img: "38", g: 85, ov: [{ t: "cap", a: "Ülkenin dört bir yanında: gıyabi cenaze namazı", d: 1.2 }] },
  { c: "Bazı evlerde onun için", img: "39", ov: [{ t: "note", a: "mevlit", p: "tr", d: 0.4 }] },
  // ── 6 · Dede ──
  { c: ["O akşam eve", "Bu akşam eve"], img: "40", ov: [{ t: "quote", a: "Dede, gıyabi namaz ne demek?", p: "tc", d: 1.0 }] },
  { c: "Cenazesi orada olmayan", r: (t, a) => <Doc t={t} a={a} head="GIYABİ CENAZE NAMAZI" lines={["Cenazesi orada olmayan bir Müslüman için kılınır.", "Uzak bir şehirde ölmüş, ya da denizde kaybolmuş biri için."]} /> },
  { c: "Peki bir dizi", r: (t, a, b) => <Re img="40" t={t} a={a} b={b} d={0.3} />,
    html: (t, a) => <Pop t={t} at={a + 0.3} style={{ left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}><div style={{ background: "#fff", fontFamily: FONT, fontSize: 56, fontWeight: 700, fontStyle: "italic", padding: "16px 34px", borderRadius: 22, boxShadow: shadow }}>“Peki bir dizi karakteri için kılınır mı?”</div></Pop> },
  { c: "Deden uzun süre", img: "41" },
  { c: "O bir rol", img: "41", ov: [{ t: "quote", a: "Onu oynayan adam şu an evinde, sağ salim oturuyor.", p: "tc", d: 0.6 }] },
  { c: "Ama sonra, sesini", r: (t, a, b) => <Re img="40" t={t} a={a} b={b} d={0.35} />,
    html: (t, a) => <Txt t={t} at={a + 1.8} text="“İnsanlar boşuna ağlamaz.”" size={70} y={80} /> },
  { c: "Herkes o adamda", r: (t, a, b) => <Re img="20" t={t} a={a} b={b} d={0.4} />,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“Herkes o adamda kendi abisini gördü.”" size={64} y={820} /> },
  // ── 7 · Kilit ──
  { c: "Dedenin bu cümlesi", r: (t, a, b) => <Re img="30" t={t} a={a} b={b} d={0.55} />,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="Hikâyenin kilidi" size={90} y={420} color="#FFD27A" /> },
  { c: "Çakır'a ağlayanların", r: (t, a, b) => <Re img="31" t={t} a={a} b={b} d={0.4} />,
    html: (t, a) => <Txt t={t} at={a + 1.4} text="Bir mafya adamına değil…" size={80} y={430} /> },
  { c: "Fakirlikten gelen", r: (t, a, b) => <Re img="18" t={t} a={a} b={b} d={0.35} />,
    html: (t, a) => <div style={{ position: "absolute", right: 80, top: 220, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
      {["fakirlikten geldi", "annesine baktı", "sözünü tuttu", "arkadaşı için öne çıktı"].map((s, i) => <Pop key={i} t={t} at={a + 0.2 + i * 0.75} style={{ position: "relative" }}><div style={{ background: K.cream, color: K.petrol, fontFamily: FONT, fontWeight: 800, fontSize: 48, padding: "8px 28px", borderRadius: 10, boxShadow: shadow }}>{s}</div></Pop>)}
    </div> },
  { c: "Yani kendi mahallelerinden", img: "01", ov: [{ t: "cap", a: "Kendi mahallelerinden biri.", d: 0.3 }] },
  { c: "Ve 2004'te bütün ülke", r: (t, a) => <Windows t={t} a={a} />, g: 95 },
  { c: "Kimse bunu tek başına", r: (t, a, b) => <Re img="33" t={t} a={a} b={b} d={0.4} />,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="Kimse bunu tek başına yaşamadı." size={72} y={90} /> },
  { c: "O gece kahvelerde", img: "42" },
  { c: "Bugün telefonunda", img: "43", yr: 2026 },
  { c: "Ama 2004'te bir ülke", img: "14", yr: 2004 },
  { c: "İşte bu yüzden", r: (t, a) => <Doc t={t} a={a} head="TÜRKİYE · 2004" lines={["Süleyman Çakır:", "gıyabi cenaze namazı kılınan ilk dizi karakteri olarak anılıyor."]} stamp="İLK" foot="Kaynak: CNN Türk, Haber7" />, g: 100 },
  // ── 8 · Yıllar ──
  { c: "Yıllar geçiyor", r: (t, a) => <Zeros t={t} a={a} back />, yr: 2005 },
  { c: "Tuşlu telefonun", img: "43", yr: 2012 },
  { c: "Kahvedeki tüplü", img: "44" },
  { c: "Ama Çakır gitmiyor", r: (t, a) => <Silence t={t} a={a} text="Ama Çakır gitmiyor." /> },
  { c: "2008'de", r: (t, a) => <Years t={t} a={a} upto={2} />, yr: 2008 },
  { c: "2020'de", r: (t, a) => <Years t={t} a={a - 1.6} upto={3} />, yr: 2020 },
  { c: "Ve 2025 Nisanında", img: "45", yr: 2025, ov: [{ t: "note", a: "21. yıl · Ankara", p: "tr", d: 0.8 }] },
  { c: ["Bir dizi karakteri için. Yirmi", "Bit dizi karakteri için 21"], r: (t, a) => <Years t={t} a={a - 2.4} upto={4} /> },
  // ── 9 · Dönüş ──
  { c: ["8 Nisan 2026", "Nisan 2026"], img: "46", yr: 2026, g: null, ov: [{ t: "date", a: "8 Nisan 2026", b: "Keçiören · Ankara" }] },
  { c: ["Artık otuz sekiz", "Artık 38"], img: "46", ov: [{ t: "tag", a: "BURAK", b: "38 · aynı sokak" }] },
  { c: "Elinde bir tabak", img: "47" },
  { c: "Baba, bu lokma", img: "47", ov: [{ t: "quote", a: "Baba, bu lokma kimin için?", p: "tc", d: 0.2 }] },
  { c: "Bir an düşünüyorsun", img: "48" },
  { c: "Hiç yaşamamış bir adam için oğlum", img: "49", ov: [{ t: "quote", a: "Ama o gece, hepimiz biraz onunla birlikte öldük.", p: "tc", d: 2.4 }] },
  { c: "Peki sen", img: "50", ov: [{ t: "cap", a: "8 Nisan 2004 gecesi sen neredeydin?", d: 0.6 }] },
];

// ───────── zamanlama ─────────
type Timed = Shot & { from: number; to: number; Y: number; G: number | null; clip?: { a0: number; rate: number } };
const TIMED: Timed[] = (() => {
  let after = 0, Y = 2004, G: number | null = null;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    if (s.yr) Y = s.yr;
    if (s.g !== undefined) G = s.g;
    return { ...s, from, to: 0, Y, G } as Timed;
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : VOICE_END + 1.2));
  // Canva klipleri (01–22, her biri 5 sn): bir görselin ilk geçtiği ardışık grup klibi oynatır; sonraki geçişler hareketsiz görsel + Ken Burns
  const used = new Set<string>();
  for (let i = 0; i < raw.length; i++) {
    const img = raw[i].img;
    if (!img || +img > 22 || used.has(img)) continue;
    used.add(img);
    let j = i;
    while (j + 1 < raw.length && raw[j + 1].img === img) j++;
    const len = raw[j].to - raw[i].from;
    const clip = { a0: raw[i].from, rate: Math.min(1, 4.9 / len) };
    for (let q = i; q <= j; q++) raw[q].clip = clip;
  }
  return raw;
})();

const Hud: React.FC<{ s: Timed; prev?: Timed; t: number }> = ({ s, prev, t }) => {
  const flip = ramp(t, s.from, s.from + 0.5);
  const yChanged = prev && prev.Y !== s.Y;
  const gFrom = prev?.G ?? s.G ?? 0, gTo = s.G ?? 0;
  const g = gFrom + (gTo - gFrom) * ramp(t, s.from + 0.3, s.from + 1.6);
  return (
    <>
      <div style={{ position: "absolute", right: 60, top: 50, background: K.petrol, color: K.cream, fontFamily: FONT, fontWeight: 800, fontSize: 54, padding: "6px 26px", borderRadius: 12, boxShadow: shadow, transform: yChanged ? `rotateX(${(1 - flip) * 90}deg)` : undefined }}>{s.Y}</div>
      {s.G !== null && (
        <div style={{ position: "absolute", right: 60, top: 136, width: 320, fontFamily: FONT, background: "rgba(243,230,207,.92)", borderRadius: 10, padding: "8px 14px", boxShadow: shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, color: K.ink, letterSpacing: 2 }}><span>KURGU</span><span>GERÇEK</span></div>
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
      <div style={{ fontSize: 44, fontWeight: 600, color: K.petrol }}>Eğer o yıl orada olsaydın?</div>
    </AbsoluteFill>
  );
};

const FULL = new Set<unknown>([Doc, Money, Zeros, Nokia, CRT, Calendar, Ilan, Windows, Years, Silence, Pulse, Re]);

export const K5Video05: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });
  const body = s.r?.(t, s.from, s.to);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        {s.img ? <Photo img={s.img} a={s.from} b={s.to} n={n} t={t} tvGlow={TVG.has(s.img)} clip={s.clip} /> : React.isValidElement(body) && FULL.has(body.type) ? body : <AbsoluteFill>{body}</AbsoluteFill>}
        {s.ov?.map((o, i) => <OvEl key={i} o={o} t={t} at={s.from + 0.35 + (o.d ?? 0)} />)}
        {s.html?.(t, s.from, s.to)}
        <Hud s={s} prev={TIMED[n - 1]} t={t} />
      </AbsoluteFill>
      <Outro t={t} />
      <Audio src={staticFile("audio/k5-05.wav")} />
      {TIMED.map((x, i) => i > 0 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx ? 0.3 : 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
