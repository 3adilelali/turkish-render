import React from "react";
import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { makeCue, ramp } from "../../lib/cues";
import { H, HDefs } from "../../components/Harem";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { FONT } from "../../theme";
import { PDefs } from "../../components/HaremPro";

// Kanal 1 (Osmanlı) dikey shortlar için ortak katman (s3-02 ve sonrası).
// Sahne 1920×1080 çizilir; ortadaki 608px şerit 1080×1920 kadraja büyütülür. HCam odağı hep ortada olsun.

export type W = { text: string; start: number; end: number };
export type R = (t: number, a: number, b: number) => React.ReactNode;
export type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone };

export const useSp = (t: number, at: number) => { const { fps } = useVideoConfig(); return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 13, stiffness: 140 } }); };

export const VT: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; c?: string; bg?: string; until?: number }> = ({ t, at, text, y = 260, size = 88, c = "#2A1E14", bg = "#FBF3E0", until = 1e9 }) => {
  const sp = useSp(t, at);
  if (t < at || t > until + 0.25) return null;
  const out = 1 - ramp(t, until, until + 0.25);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, textAlign: "center", opacity: sp * out, transform: `scale(${0.8 + 0.2 * sp}) rotate(${(1 - sp) * -3}deg)` }}>
      <div style={{ display: "inline-block", background: bg, borderBottom: `12px solid ${H.gold}`, borderRadius: 26, padding: `${size * 0.16}px ${size * 0.4}px`, boxShadow: "0 16px 40px rgba(0,0,0,.4)", fontFamily: FONT, fontWeight: 800, fontSize: size, color: c, lineHeight: 1.06 }}>{text}</div>
    </div>
  );
};

export const Stamp: React.FC<{ t: number; at: number; text: string; y?: number; c?: string; rot?: number; size?: number }> = ({ t, at, text, y = 700, c = H.red, rot = -8, size = 120 }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: sp, transform: `scale(${2.2 - 1.2 * sp}) rotate(${rot}deg)` }}><span style={{ display: "inline-block", border: `12px solid ${c}`, color: c, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: "4px 40px", borderRadius: 20, background: "rgba(255,250,240,.88)" }}>{text}</span></div>;
};

export const Sub: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", opacity: sp, transform: `scale(${0.7 + 0.3 * sp})` }}><span style={{ display: "inline-block", background: H.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "20px 70px", borderRadius: 70, boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>ABONE OL 🔔</span></div>;
};

// ilk saniyelerde ekranın üstünde duran merak başlığı
export const Hook: React.FC<{ t: number; text: string; until: number }> = ({ t, text, until }) => {
  if (t > until + 0.3) return null;
  const out = 1 - ramp(t, until, until + 0.3);
  const pulse = 1 + Math.sin(t * 7) * 0.015;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 200, textAlign: "center", opacity: out, transform: `scale(${pulse})` }}>
      <div style={{ display: "inline-block", background: "#1B1209", color: "#FFE9A8", border: `8px solid ${H.gold}`, borderRadius: 28, padding: "22px 38px", fontFamily: FONT, fontWeight: 900, fontSize: 82, lineHeight: 1.05, boxShadow: "0 18px 40px rgba(0,0,0,.5)" }}>{text}</div>
    </div>
  );
};

const chunks = (WORDS: W[]) => {
  const out: { ws: W[]; a: number; b: number }[] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const nx = WORDS[i + 1];
    if (cur.length >= 3 || /[.?!:,]$/.test(w.text) || !nx || nx.start - w.end > 0.6) { out.push({ ws: cur, a: cur[0].start, b: w.end }); cur = []; }
  });
  out.forEach((c, i) => (c.b = i + 1 < out.length ? Math.min(out[i + 1].a, c.b + 0.5) : c.b + 0.6));
  return out;
};

const Caps: React.FC<{ t: number; ch: ReturnType<typeof chunks> }> = ({ t, ch }) => {
  const c = ch.find((x) => t >= x.a - 0.05 && t < x.b);
  if (!c) return null;
  const pop = ramp(t, c.a - 0.05, c.a + 0.1);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1240, textAlign: "center", transform: `scale(${0.9 + 0.1 * pop})` }}>
      {c.ws.map((w, i) => {
        const on = t >= w.start - 0.05;
        return <span key={i} style={{ display: "inline-block", margin: "0 12px", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: on && t < w.end + 0.15 ? H.gold : "#FFFFFF", WebkitTextStroke: "14px #1B1209", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,.55)", textTransform: "uppercase", opacity: on ? 1 : 0.55 }}>{w.text.replace(/[.,:]$/, "")}</span>;
      })}
    </div>
  );
};

// kurulum: kelimeler + çekimler → zamanlı liste, süre ve bileşen
export const makeShort = (o: { words: W[]; audio: string; label: string; alt?: Record<string, string[]>; hook: string; hookUntil?: number; build: (cue: (p: string, after?: number) => number) => Sh[]; pro?: boolean; tail?: number }) => {
  const WORDS = o.words;
  const cueRaw = makeCue(WORDS);
  const cue = (p: string, after = 0) => cueRaw([p, p.replace(/â/g, "a").replace(/î/g, "i"), ...(o.alt?.[p] ?? [])], after);
  const SECONDS = Math.ceil((WORDS[WORDS.length - 1].end + (o.tail ?? 2.2)) * 10) / 10;
  const SHOTS = o.build(cue);
  let prev = 0, after = 0;
  const TIMED = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? prev + parseFloat(s.c) : cue(s.c, after) - 0.1;
    prev = from; after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  TIMED.forEach((s, i) => (s.to = i + 1 < TIMED.length ? TIMED[i + 1].from : SECONDS));
  const ch = chunks(WORDS);
  const VOL: Record<string, number> = { whoosh: 0.07, boom: 0.13, ding: 0.12, pop: 0.1, boing: 0.1, tick: 0.12 };
  const Comp: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    let n = 0;
    for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
    const s = TIMED[n];
    const cut = 1 - ramp(t, s.from, s.from + 0.14);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill style={{ opacity: 1 - ramp(t, SECONDS - 0.8, SECONDS) }}>
          <svg viewBox="656 0 608 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, background: H.plaster }}>
            <HDefs />
            {o.pro && <PDefs />}
            <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
            <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.5 : 1} seed={n} />
            <Sweep t={t} a={s.from} />
            {cut > 0 && <rect width={1920} height={1080} fill="#FFF8E6" opacity={cut * 0.3} />}
            <rect width={1920} height={1080} fill={o.pro ? "url(#pVig)" : "url(#hVig)"} pointerEvents="none" />
            {o.pro && <rect width={1920} height={1080} filter="url(#pGrain)" opacity={0.05} pointerEvents="none" />}
          </svg>
          <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}><span style={{ display: "inline-block", background: "rgba(27,18,9,.78)", color: H.gold, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "8px 30px", borderRadius: 40, letterSpacing: 2 }}>{o.label}</span></div>
          {s.html?.(t, s.from, s.to)}
          <Hook t={t} text={o.hook} until={o.hookUntil ?? 2.6} />
          <Caps t={t} ch={ch} />
        </AbsoluteFill>
        <Audio src={staticFile(`audio/${o.audio}.wav`)} />
        {TIMED.map((x, i) => i > 0 && x.sfx && x.from < SECONDS - 12 && (
          <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
            <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
          </Sequence>
        ))}
      </AbsoluteFill>
    );
  };
  return { SECONDS, Comp, TIMED };
};
