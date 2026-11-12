import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "../theme";

// «Canlı Tablo» (2026-11-12): القناة 1، شورتس. لوحات ومنمنمات حقيقية (ملكية عامة/CC0) بتتحرّك 2.5D:
// خلفية اللوحة نفسها (مغبّشة شوي وأبطأ) + الشخصية مقصوصة بـ rembg (أوضح وأسرع) = عمق.
// وفوقها بالكود: ضو شمع، ودخان، وغبار، وتلج، وتدريج لوني، وفينيت، وحبيبات، وكروت الوثيقة، وترجمة كلمة بكلمة.
// القياس: الكادر 1080×1920. كل لوحة إلها w,h الأصليين، والكاميرا بتمشي بين نقطتين (zoom, fx, fy) حيث fx,fy من 0 لـ 1 جوّا اللوحة.

export const W = 1080, HH = 1920;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ez = (x: number) => { const k = clamp(x); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const lin = (a: number, b: number, k: number) => a + (b - a) * k;
export const rmp = (t: number, a: number, b: number) => clamp((t - a) / Math.max(0.001, b - a));

export type Cam = [number, number, number]; // zoom, fx, fy
export type Img2 = { src: string; w: number; h: number; cut?: string };

// موقع وحجم اللوحة لتغطّي الكادر مع زوم ونقطة تركيز (ما بتطلع حواف فاضية)
const place = (im: Img2, c: Cam) => {
  const base = Math.max(W / im.w, HH / im.h) * c[0];
  const dw = im.w * base, dh = im.h * base;
  const x = clamp(W / 2 - c[1] * dw, W - dw, 0);
  const y = clamp(HH / 2 - c[2] * dh, HH - dh, 0);
  return { x, y, dw, dh };
};

// اللوحة الحيّة: k من 0 لـ 1 خلال اللقطة. depth = قديش الشخصية بتسبق الخلفية (2.5D)
export const Tablo: React.FC<{ im: Img2; a: Cam; b: Cam; k: number; depth?: number; bgBlur?: number; sway?: number }> = ({ im, a, b, k, depth = 0.06, bgBlur = 2.2, sway = 0 }) => {
  const e = ez(k);
  const c: Cam = [lin(a[0], b[0], e), lin(a[1], b[1], e), lin(a[2], b[2], e)];
  const p = place(im, c);
  const hasCut = !!im.cut;
  // الخلفية بتتحرّك أقل، والشخصية أكتر: فرق صغير بيعمل عمق
  const pb = place(im, [c[0] * (1 - depth * 0.35), lin(a[1], b[1], e * 0.8), lin(a[2], b[2], e * 0.8)]);
  const pf = place(im, [c[0] * (1 + depth * 0.25), c[1], c[2]]);
  const sw = Math.sin(k * 6.28) * sway;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0B0705" }}>
      {hasCut ? (
        <>
          <Img src={staticFile(im.src)} style={{ position: "absolute", left: pb.x, top: pb.y, width: pb.dw, height: pb.dh, filter: `blur(${bgBlur}px) brightness(0.86)` }} />
          <Img src={staticFile(im.cut!)} style={{ position: "absolute", left: pf.x + sw, top: pf.y, width: pf.dw, height: pf.dh, filter: "drop-shadow(0 18px 30px rgba(0,0,0,.55))" }} />
        </>
      ) : (
        <Img src={staticFile(im.src)} style={{ position: "absolute", left: p.x, top: p.y, width: p.dw, height: p.dh }} />
      )}
    </AbsoluteFill>
  );
};

// إطار لوحة على جدار (للوحات العريضة أو الوثايق): اللوحة كاملة جوّا برواز ذهبي فوق نسخة مغبّشة منها
export const Cerceve: React.FC<{ im: Img2; k: number; y?: number; width?: number; tilt?: number; zoom?: [number, number] }> = ({ im, k, y = 560, width = 960, tilt = 0, zoom = [1, 1.08] }) => {
  const e = ez(k);
  const s = lin(zoom[0], zoom[1], e);
  const h = (width * im.h) / im.w;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120C08" }}>
      <Img src={staticFile(im.src)} style={{ position: "absolute", left: -300, top: -200, width: W + 600, height: HH + 400, objectFit: "cover", filter: "blur(28px) brightness(0.45) saturate(0.8)" }} />
      <div style={{ position: "absolute", left: (W - width) / 2, top: y, width, height: h, transform: `scale(${s}) rotate(${tilt}deg)`, boxShadow: "0 40px 80px rgba(0,0,0,.7)", border: "14px solid #B8892E", outline: "4px solid #F2D58A", outlineOffset: -20 }}>
        <Img src={staticFile(im.src)} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ───────── الجو (فوق اللوحة) ─────────
export type Ton = "gece" | "sicak" | "belge" | "soguk" | "kan";
const TON: Record<Ton, { mul: string; op: number; glow: string }> = {
  gece: { mul: "#1B2648", op: 0.42, glow: "#FFB866" },
  sicak: { mul: "#7A4A1E", op: 0.16, glow: "#FFD089" },
  belge: { mul: "#5A3A18", op: 0.22, glow: "#FFE2A8" },
  soguk: { mul: "#2A3A55", op: 0.3, glow: "#CFE2FF" },
  kan: { mul: "#4A0A10", op: 0.38, glow: "#FF6A4A" },
};

export const Grade: React.FC<{ t: number; ton: Ton; mum?: [number, number]; mumR?: number }> = ({ t, ton, mum, mumR = 760 }) => {
  const g = TON[ton];
  const fl = 0.85 + 0.15 * Math.sin(t * 13.1) * Math.sin(t * 7.3 + 1.2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: g.mul, opacity: g.op, mixBlendMode: "multiply" }} />
      {mum && <AbsoluteFill style={{ background: `radial-gradient(circle ${mumR * fl}px at ${mum[0]}px ${mum[1]}px, ${g.glow}AA 0%, ${g.glow}33 45%, transparent 75%)`, mixBlendMode: "screen", opacity: 0.85 }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 52%, rgba(8,4,2,.82) 100%)" }} />
    </AbsoluteFill>
  );
};

// حبيبات فيلم + خدوش خفيفة (بيتغيّر كل فريم)
export const Gren: React.FC<{ frame: number; op?: number }> = ({ frame, op = 0.09 }) => (
  <svg width={W} height={HH} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: op, mixBlendMode: "overlay" }}>
    <filter id={`gr${frame % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} /></filter>
    <rect width={W} height={HH} filter={`url(#gr${frame % 6})`} />
  </svg>
);

const h1 = (i: number, k: number) => Math.abs(Math.sin(i * k)) % 1;

// غبار بضو
export const Toz: React.FC<{ t: number; n?: number; c?: string; op?: number }> = ({ t, n = 46, c = "#FFE6B0", op = 0.75 }) => (
  <svg width={W} height={HH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const x = ((h1(i, 91.7) + t * 0.01 * (0.4 + h1(i, 13.1))) % 1) * W + Math.sin(t * 0.7 + i) * 18;
      const y = ((h1(i, 37.3) - t * 0.008 * (0.5 + h1(i, 7.7)) + 2) % 1) * HH;
      const r = 1.5 + 3.5 * h1(i, 5.3);
      return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={op * (0.3 + 0.7 * Math.abs(Math.sin(t * 1.3 + i)))} filter={r > 3.5 ? "blur(1.5px)" : undefined} />;
    })}
  </svg>
);

// تلج (لمشهد الأسر)
export const Kar: React.FC<{ t: number; n?: number }> = ({ t, n = 120 }) => (
  <svg width={W} height={HH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 0.05 + 0.08 * h1(i, 3.7);
      const x = ((h1(i, 51.3) + Math.sin(t * 0.9 + i) * 0.015) % 1) * W;
      const y = ((h1(i, 17.9) + t * sp) % 1) * HH;
      const r = 2 + 6 * h1(i, 9.1);
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.35 + 0.5 * h1(i, 2.2)} style={{ filter: r > 6 ? "blur(2px)" : undefined }} />;
    })}
  </svg>
);

// دخان ناعم بيطلع (للسحر والشمع)
export const Duman: React.FC<{ t: number; x?: number; y?: number; c?: string; op?: number }> = ({ t, x = 540, y = 1500, c = "#E9D9C0", op = 0.35 }) => (
  <svg width={W} height={HH} style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen" }}>
    <filter id="dmB"><feGaussianBlur stdDeviation={26} /></filter>
    {Array.from({ length: 7 }, (_, i) => {
      const ph = (t * 0.18 + i / 7) % 1;
      const cx = x + Math.sin(t * 0.8 + i * 1.7) * 140 + (i - 3) * 40;
      const cy = y - ph * 1100;
      return <ellipse key={i} cx={cx} cy={cy} rx={120 + ph * 220} ry={70 + ph * 120} fill={c} opacity={op * Math.sin(ph * Math.PI)} filter="url(#dmB)" />;
    })}
  </svg>
);

// ضوء متسرّب بالانتقال (light leak)
export const Sizinti: React.FC<{ k: number }> = ({ k }) => {
  if (k <= 0 || k >= 1) return null;
  const o = Math.sin(k * Math.PI);
  return <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(${110 + k * 40}deg, transparent 20%, rgba(255,190,110,${0.75 * o}) 50%, transparent 80%)`, mixBlendMode: "screen" }} />;
};

// ───────── كرت الوثيقة BELGE ─────────
export const Belge: React.FC<{ k: number; text: string; src: string; y?: number; typed?: number; quote?: boolean; tag?: string }> = ({ k, text, src, y = 380, typed = 1, quote = true, tag = "📜 BELGE" }) => {
  const e = ez(rmp(k, 0, 0.25));
  const n = Math.round(text.length * clamp(typed));
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, transform: `translateY(${(1 - e) * 120}px) rotate(${-2 + (1 - e) * -6}deg)`, opacity: e }}>
      <div style={{ background: "linear-gradient(160deg,#F7EBCF,#E9D3A6)", borderRadius: 10, padding: "46px 54px 38px", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 0 60px rgba(120,80,30,.35)", border: "2px solid #B08A4A", position: "relative" }}>
        <div style={{ position: "absolute", top: -34, left: 40, background: "#8E1F2A", color: "#F7EBCF", fontFamily: FONT, fontWeight: 700, fontSize: 40, padding: "6px 26px", borderRadius: 8, letterSpacing: 4 }}>{tag}</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 58, lineHeight: 1.25, color: "#2A1A0C", fontStyle: quote ? "italic" : "normal" }}>{quote ? "“" : ""}{text.slice(0, n)}{n < text.length ? "▍" : quote ? "”" : ""}</div>
        <div style={{ marginTop: 24, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: "#6A4A24" }}>— {src}</div>
      </div>
    </div>
  );
};

// اسم تحت لوحة (Etiket) متل المتاحف
export const Etiket: React.FC<{ k: number; text: string; y?: number }> = ({ k, text, y = 1640 }) => {
  const e = ez(rmp(k, 0.05, 0.25)) * (1 - ez(rmp(k, 0.85, 1)));
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e }}><span style={{ display: "inline-block", background: "rgba(14,9,5,.72)", border: "2px solid #B8892E", color: "#F2D58A", fontFamily: FONT, fontWeight: 600, fontSize: 32, padding: "10px 26px", borderRadius: 6, letterSpacing: 1 }}>{text}</span></div>;
};

// ───────── الترجمة كلمة بكلمة ─────────
export type Wd = { text: string; start: number; end: number };
export const chunk = (ws: Wd[], max = 3) => {
  const out: { ws: Wd[]; a: number; b: number }[] = [];
  let cur: Wd[] = [];
  ws.forEach((w, i) => {
    cur.push(w);
    const nx = ws[i + 1];
    if (cur.length >= max || /[.?!:,]$/.test(w.text) || !nx || nx.start - w.end > 0.5) { out.push({ ws: cur, a: cur[0].start, b: w.end }); cur = []; }
  });
  out.forEach((c, i) => (c.b = i + 1 < out.length ? Math.min(out[i + 1].a, c.b + 0.45) : c.b + 0.6));
  return out;
};

const norm = (s: string) => s.toLocaleLowerCase("tr-TR").replace(/[^a-zçğıöşüâî]/g, "");
export const Altyazi: React.FC<{ t: number; ch: ReturnType<typeof chunk>; hot?: string[]; y?: number; big?: [number, number] }> = ({ t, ch, hot = [], y = 1300, big }) => {
  const c = ch.find((x) => t >= x.a - 0.05 && t < x.b);
  if (!c) return null;
  const pop = ez(rmp(t, c.a - 0.05, c.a + 0.12));
  const isBig = big && c.a >= big[0] && c.a < big[1];
  const fs = isBig ? 112 : 86;
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: y, textAlign: "center", transform: `scale(${0.86 + 0.14 * pop})`, lineHeight: 1.12 }}>
      {c.ws.map((w, i) => {
        const on = t >= w.start - 0.04;
        const now = on && t < w.end + 0.12;
        const isHot = hot.some((h) => norm(w.text).startsWith(h));
        const col = isHot ? "#FF4A3D" : now ? "#FFD65A" : "#FFFFFF";
        return <span key={i} style={{ display: "inline-block", margin: "0 10px", fontFamily: FONT, fontWeight: 700, fontSize: fs * (now ? 1.06 : 1), color: col, WebkitTextStroke: "16px #120A04", paintOrder: "stroke fill", textShadow: isHot ? "0 0 30px rgba(255,60,40,.7), 0 8px 18px rgba(0,0,0,.6)" : "0 8px 18px rgba(0,0,0,.6)", textTransform: "uppercase", opacity: on ? 1 : 0.5 }}>{w.text.replace(/[.,:!?]$/, "")}</span>;
      })}
    </div>
  );
};

// ───────── القفص (Kafes): قضبان خشب مشبّكة بتنزل عالشاشة، وبتنكسر بـ open ─────────
// close: 0→1 (نزول القضبان)، open: 0→1 (انكسار وتطاير لبرّا). quote=false بكرت Belge = نص وصفي مش اقتباس.
export const Kafes: React.FC<{ close: number; open?: number; op?: number }> = ({ close, open = 0, op = 0.92 }) => {
  const c = ez(clamp(close)), o = ez(clamp(open));
  if (c <= 0 || o >= 1) return null;
  const bars = 7, gap = W / bars;
  const wood = "linear-gradient(90deg,#2A1607,#6B3E17 35%,#A7672A 50%,#6B3E17 65%,#2A1607)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: op * (1 - o * 0.6) }}>
      {Array.from({ length: bars + 1 }).map((_, i) => {
        const side = i < bars / 2 ? -1 : 1;
        const fall = (1 - c) * -HH * (1 + (i % 3) * 0.15);
        return <div key={"v" + i} style={{ position: "absolute", top: 0, left: i * gap - 16, width: 32, height: HH, background: wood, boxShadow: "8px 0 24px rgba(0,0,0,.65)", transform: `translate(${side * o * 900}px, ${fall + o * 300}px) rotate(${side * o * 25}deg)` }} />;
      })}
      {[0.18, 0.5, 0.82].map((y, j) => (
        <div key={"h" + j} style={{ position: "absolute", left: 0, top: y * HH - 14, width: W, height: 28, background: wood.replace("90deg", "180deg"), boxShadow: "0 8px 24px rgba(0,0,0,.65)", transform: `translate(${(j % 2 ? 1 : -1) * o * 1200}px, ${(1 - c) * -HH * 1.3}px) rotate(${(j % 2 ? 1 : -1) * o * 12}deg)` }} />
      ))}
    </AbsoluteFill>
  );
};

// ───────── الستارة (Perde): مخمل أحمر بيتسكّر (close) وبينفتح (open) ─────────
export const Perde: React.FC<{ close: number; open?: number }> = ({ close, open = 0 }) => {
  const c = ez(clamp(close)) * (1 - ez(clamp(open)));
  if (c <= 0.001) return null;
  const velvet = (d: string) => `repeating-linear-gradient(90deg, rgba(0,0,0,.35) 0 18px, rgba(255,255,255,.06) 30px, rgba(0,0,0,.3) 60px), linear-gradient(${d}, #3A0508, #8E1520 55%, #4A070C)`;
  const half = (W / 2 + 60) * c;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: half, height: HH, background: velvet("90deg"), boxShadow: "20px 0 50px rgba(0,0,0,.7)", borderRight: "8px solid #C9A04A" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: half, height: HH, background: velvet("270deg"), boxShadow: "-20px 0 50px rgba(0,0,0,.7)", borderLeft: "8px solid #C9A04A" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(#2A0306,#7A101A)", borderBottom: "8px solid #C9A04A" }} />
    </AbsoluteFill>
  );
};

// ───────── سنة كبيرة بتعدّ (Yil): الرقم بيلفّ لحد السنة ─────────
export const Yil: React.FC<{ k: number; yil: number; y?: number; c?: string }> = ({ k, yil, y = 300, c = "#F2D58A" }) => {
  const e = ez(rmp(k, 0, 0.3));
  const n = Math.round(yil - (1 - e) * 40);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: rmp(k, 0, 0.08) * (1 - rmp(k, 0.85, 1)) }}><span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 210, color: c, WebkitTextStroke: "10px #120A04", paintOrder: "stroke fill", letterSpacing: 6, textShadow: "0 0 40px rgba(242,196,106,.5), 0 14px 30px rgba(0,0,0,.8)" }}>{n}</span></div>;
};

// ───────── ختم أحمر بيدقّ عالشاشة (Muhur) ─────────
export const Muhur: React.FC<{ k: number; text: string; y?: number }> = ({ k, text, y = 520 }) => {
  const e = rmp(k, 0.15, 0.3);
  const s = 2.4 - 1.4 * ez(e);
  return <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", opacity: e > 0 ? 1 : 0, transform: `scale(${s}) rotate(-9deg)` }}><span style={{ display: "inline-block", border: "12px solid #C4161C", color: "#C4161C", fontFamily: FONT, fontWeight: 700, fontSize: 150, padding: "6px 50px", borderRadius: 18, background: "rgba(247,235,207,.18)", textShadow: "0 0 2px #7a0d10", boxShadow: "inset 0 0 0 6px rgba(196,22,28,.4)" }}>{text}</span></div>;
};

// ───────── حلقة نسبة (Halka): دايرة بتتعبّى لحد نسبة، ونص بالنص ─────────
export const Halka: React.FC<{ k: number; oran: number; text: string; alt?: string; y?: number }> = ({ k, oran, text, alt, y = 420 }) => {
  const e = ez(rmp(k, 0.05, 0.6));
  const R = 300, C = 2 * Math.PI * R;
  const o = ez(rmp(k, 0, 0.15));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${0.8 + 0.2 * o})` }}>
      <svg width={760} height={760} viewBox="-380 -380 760 760">
        <circle r={R} fill="rgba(14,9,5,.75)" stroke="#3A2A18" strokeWidth={60} />
        <circle r={R} fill="none" stroke="#E0B252" strokeWidth={60} strokeDasharray={`${C * oran * e} ${C}`} transform="rotate(-90)" style={{ filter: "drop-shadow(0 0 18px rgba(242,196,106,.8))" }} />
        <text y={40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#F7EBCF">{text}</text>
      </svg>
      {alt && <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 700, fontSize: 64, color: "#F2D58A", WebkitTextStroke: "10px #120A04", paintOrder: "stroke fill" }}>{alt}</div>}
    </div>
  );
};

// ───────── نار (Ates): وهج برتقالي بيرجف من تحت وشرار طالع ─────────
export const Ates: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => {
  const f = 0.75 + 0.25 * Math.sin(t * 13) * Math.sin(t * 7.3);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: clamp(k) }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 60% at 50% 105%, rgba(255,120,20,${0.75 * f}), rgba(200,40,0,${0.35 * f}) 45%, transparent 75%)`, mixBlendMode: "screen" }} />
      {Array.from({ length: 40 }).map((_, i) => {
        const sp = 0.25 + ((i * 37) % 10) / 20;
        const y = HH - (((t * 300 * sp) + i * 173) % (HH * 0.9));
        const x = ((i * 271) % W) + Math.sin(t * 2 + i) * 40;
        const a = clamp((y - HH * 0.1) / (HH * 0.5));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: 9, background: "#FFB347", boxShadow: "0 0 12px #FF7A00", opacity: a * 0.9 }} />;
      })}
    </AbsoluteFill>
  );
};

// ───────── خط بيطلع وبينهار (Grafik): فقاعة سعر ─────────
export const Grafik: React.FC<{ k: number; label?: string; crash?: number }> = ({ k, label, crash = 0.72 }) => {
  const pts: [number, number][] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const y = x < crash ? Math.pow(x / crash, 3) : Math.max(0.05, 1 - (x - crash) / (1 - crash) * 1.6);
    pts.push([80 + x * 920, 1100 - y * 700]);
  }
  const shown = Math.max(2, Math.round(N * ez(rmp(k, 0.05, 0.85))));
  const d = pts.slice(0, shown).map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = pts[shown - 1];
  const down = shown / N > crash;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={HH} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={50} y={330} width={980} height={820} rx={20} fill="rgba(14,9,5,.72)" stroke="#B8892E" strokeWidth={3} />
        <path d={d} fill="none" stroke={down ? "#FF3B30" : "#5BE37D"} strokeWidth={14} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${down ? "#FF3B30" : "#5BE37D"})` }} />
        <circle cx={last[0]} cy={last[1]} r={18} fill="#fff" />
      </svg>
      {label && <div style={{ position: "absolute", top: 360, left: 90, fontFamily: FONT, fontWeight: 700, fontSize: 52, color: "#F2D58A" }}>{label}</div>}
    </AbsoluteFill>
  );
};

// ───────── كلمة بتنشطب (Ciz): كلمة كبيرة وخط أحمر بينرسم فوقها ─────────
export const Ciz: React.FC<{ k: number; text: string; y?: number; c?: string }> = ({ k, text, y = 520, c = "#F7EBCF" }) => {
  const o = ez(rmp(k, 0, 0.12));
  const l = ez(rmp(k, 0.2, 0.45));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o }}>
      <span style={{ position: "relative", display: "inline-block", fontFamily: FONT, fontWeight: 700, fontSize: 170, color: c, WebkitTextStroke: "18px #120A04", paintOrder: "stroke fill" }}>
        {text}
        <span style={{ position: "absolute", left: -20, top: "48%", height: 26, width: `calc(${l * 100}% + ${l * 40}px)`, background: "#E0141C", borderRadius: 14, transform: "rotate(-6deg)", boxShadow: "0 0 20px rgba(224,20,28,.8)" }} />
      </span>
    </div>
  );
};

// ───────── حبر بينكتب (Murekkep): كلمة بتنكشف كأنها عم تنكتب بالحبر، مع خط ذهبي ─────────
export const Murekkep: React.FC<{ k: number; text: string; y?: number }> = ({ k, text, y = 200 }) => {
  const e = ez(rmp(k, 0.05, 0.6));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
      <span style={{ display: "inline-block", position: "relative", clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`, fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 180, color: "#1A0E06", background: "linear-gradient(160deg,#F7EBCF,#E3C98F)", padding: "10px 60px", borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }}>
        {text}
        <span style={{ position: "absolute", left: 40, right: 40, bottom: 18, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", borderRadius: 6 }} />
      </span>
    </div>
  );
};

// ───────── خريطة القرن الذهبي (Harita): الماء والسلسلة وطريق السفن عالبرّ ─────────
export const Harita: React.FC<{ k: number }> = ({ k }) => {
  const o = ez(rmp(k, 0, 0.12));
  const p = ez(rmp(k, 0.15, 0.85));
  const path = "M 960 980 C 900 760, 760 640, 600 700 S 380 860, 330 860";
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(160deg,#EAD9B0,#CFB27A)" }}>
      <svg width={W} height={HH} viewBox={`0 0 ${W} ${HH}`}>
        <path d="M 900 0 L 1080 0 L 1080 1920 L 980 1920 C 990 1500, 960 1200, 1000 1000 C 1010 900, 940 600, 900 0 Z" fill="#5E8FA8" opacity={0.85} />
        <path d="M 1000 1000 C 820 1010, 620 960, 420 1000 C 300 1020, 160 1000, 40 1060 L 40 1110 C 200 1070, 330 1080, 440 1060 C 640 1030, 840 1080, 1000 1090 Z" fill="#5E8FA8" opacity={0.85} />
        <line x1={985} y1={1000} x2={985} y2={1092} stroke="#C4161C" strokeWidth={14} strokeDasharray="18 10" />
        <path d={path} fill="none" stroke="#7A2E10" strokeWidth={10} pathLength={1} strokeDasharray={`${p} 1`} />
        <text x={560} y={1180} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={58} fill="#1F3A4A">HALİÇ</text>
        <text x={860} y={1160} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#C4161C">ZİNCİR</text>
        <text x={520} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#4A2E12">GALATA TEPELERİ</text>
        <text x={540} y={1720} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#4A2E12">KONSTANTİNİYYE</text>
      </svg>
      {[0, 0.12, 0.24].map((d, i) => {
        const q = clamp(p - d);
        const x = 960 - (960 - 330) * q, y = 980 - Math.sin(q * Math.PI) * 300 - q * 120;
        return <div key={i} style={{ position: "absolute", left: x - 45, top: y - 70, fontSize: 130, opacity: p > d ? 1 : 0 }}>⛵</div>;
      })}
    </AbsoluteFill>
  );
};

// ───────── ظرف مكتوب بينفتح (Mektup): الختم بينكسر، والغطا بينفتح، والورقة بتطلع ─────────
export const Mektup: React.FC<{ k: number; text: string; src?: string }> = ({ k, text, src }) => {
  const a = ez(rmp(k, 0, 0.15)), f = ez(rmp(k, 0.15, 0.35)), p = ez(rmp(k, 0.35, 0.6));
  const n = Math.round(text.length * rmp(k, 0.55, 0.95));
  return (
    <div style={{ position: "absolute", left: 90, width: 900, top: 760, height: 560, opacity: a, transform: `translateY(${(1 - a) * 200}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: -p * 620, height: 600, background: "linear-gradient(170deg,#FBF3DE,#EBD9AE)", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,.4)", padding: "40px 46px", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 50, lineHeight: 1.3, color: "#2A1A0C", zIndex: p > 0.05 ? 1 : 0 }}>
        {text.slice(0, n)}
        {src && n >= text.length && <div style={{ marginTop: 18, fontFamily: FONT, fontStyle: "normal", fontSize: 30, color: "#6A4A24" }}>— {src}</div>}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#C9A46A,#9C7642)", borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,.6)", zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 320, transformOrigin: "top", transform: `rotateX(${f * 180}deg)`, background: "linear-gradient(180deg,#B48D55,#8E6834)", clipPath: "polygon(0 0,100% 0,50% 100%)", zIndex: f < 0.5 ? 3 : 0 }} />
      <div style={{ position: "absolute", left: 410, top: 250, width: 80, height: 80, borderRadius: 40, background: "radial-gradient(circle at 35% 35%,#D23A3A,#7A1010)", boxShadow: "0 4px 10px rgba(0,0,0,.5)", zIndex: 4, opacity: 1 - f, transform: `scale(${1 + f}) rotate(${f * 40}deg)` }} />
    </div>
  );
};
