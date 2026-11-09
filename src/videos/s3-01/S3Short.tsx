import React from "react";
import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/s3-01-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { Corridor, H, HCam, HDefs, HFig, Lantern, Room, Sedir, lerp } from "../../components/Harem";
import { Walker } from "../../components/K3Text";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { FONT } from "../../theme";

// Kanal 3 · SHORT 01 · "Harem Sırları" bilmece serisi · Çeşmeler neden açılırdı? (dikey 1080×1920, tamamen motor)
// Sahne 1920×1080 çizilir, ortadaki 608px şerit dikey kadraja büyütülür (HCam odağı hep ortada).
// Kaynak: TDV İslâm Ansiklopedisi «Arz Odası» (çeşmelerin şırıltısı konuşmaları örter, "söylenmektedir").

type W = { text: string; start: number; end: number };
const WORDS = words as W[];
const ALT: Record<string, string[]> = { "Sen Gülfem'sin": ["Sen Gülfemsin", "Sen Gülfem"], "Yani sen her gün": ["Yani sen her gün su"] };
const cueRaw = makeCue(WORDS);
const cue = (p: string, after = 0) => cueRaw([p, p.replace(/â/g, "a").replace(/î/g, "i"), ...(ALT[p] ?? [])], after);
const VOICE_END = WORDS[WORDS.length - 1].end;
export const S3_01_SECONDS = Math.ceil((VOICE_END + 2.2) * 10) / 10;

const GUL = { kind: "girl" as const, robe: "#2FA3A0", robe2: "#F5E8CC" };
const KAL = { kind: "kalfa" as const, robe: H.purple, robe2: "#E6D6F0" };
const G = 1010;
const WATER = "#8FD3EE";

// ───────── selsebil / duvar çeşmesi ─────────
const Cesme: React.FC<{ x: number; y: number; s?: number; t: number; on?: number }> = ({ x, y, s = 1, t, on = 1 }) => {
  const bowls: [number, number][] = [[0, -250], [-70, -120], [70, 10], [0, 140]];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-230} y={-460} width={460} height={720} rx={10} fill="#F4EEE2" stroke={H.ln} strokeWidth={4} />
      <rect x={-230} y={-460} width={460} height={720} rx={10} fill="url(#hTile)" opacity={0.9} />
      <rect x={-180} y={-410} width={360} height={630} fill="#FBF7EE" stroke={H.gold} strokeWidth={6} />
      <path d="M-150,220 L-150,-250 Q-150,-370 0,-400 Q150,-370 150,-250 L150,220Z" fill="#EFE6D3" stroke={H.ln} strokeWidth={4} />
      <path d="M-150,-250 Q-150,-370 0,-400 Q150,-370 150,-250" fill="none" stroke={H.cobalt} strokeWidth={10} />
      <circle cx={0} cy={-330} r={26} fill="none" stroke={H.cobalt} strokeWidth={5} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0,-330 l0,-24" stroke={H.turq} strokeWidth={5} transform={`rotate(${i * 45},0,-330)`} />)}
      {/* lüle + musluk */}
      <rect x={-14} y={-300} width={28} height={36} rx={6} fill={H.gold} stroke={H.ln} strokeWidth={3} />
      <g transform={`translate(0,-312) rotate(${on * 90})`}><rect x={-34} y={-7} width={68} height={14} rx={7} fill={H.gold} stroke={H.ln} strokeWidth={3} /></g>
      {/* su: lüleden tasa, tastan tasa */}
      {on > 0.02 && bowls.map(([bx, by], i) => {
        const [px, py] = i === 0 ? [0, -264] : [bowls[i - 1][0] + (bowls[i - 1][0] >= 0 ? 52 : -52) * (i === 1 ? -1 : 1), bowls[i - 1][1] + 6];
        return <path key={i} d={`M${px},${py} Q${(px + bx) / 2},${(py + by) / 2 - 10} ${bx},${by - 6}`} fill="none" stroke={WATER} strokeWidth={10 * on} strokeLinecap="round" strokeDasharray="22 12" strokeDashoffset={-t * 160} opacity={0.95} />;
      })}
      {bowls.map(([bx, by], i) => (
        <g key={i}>
          <path d={`M${bx - 56},${by} Q${bx},${by + 52} ${bx + 56},${by}Z`} fill="#E6DCC6" stroke={H.ln} strokeWidth={4} />
          <ellipse cx={bx} cy={by} rx={56} ry={10} fill={on > 0.05 ? WATER : "#D8CBB0"} stroke={H.ln} strokeWidth={3} />
          {on > 0.05 && <ellipse cx={bx} cy={by} rx={20 + ((t * 40 + i * 13) % 34)} ry={4 + ((t * 40 + i * 13) % 34) / 6} fill="none" stroke="#fff" strokeWidth={2} opacity={on * (1 - ((t * 40 + i * 13) % 34) / 34)} />}
        </g>
      ))}
      {/* yalak */}
      <path d="M-200,230 L200,230 L180,300 L-180,300Z" fill="#E6DCC6" stroke={H.ln} strokeWidth={4} />
      <rect x={-190} y={226} width={380} height={14} fill={on > 0.05 ? WATER : "#D8CBB0"} />
      {/* şırıltı dalgaları */}
      {on > 0.3 && [0, 1, 2].map((i) => { const k = (t * 0.9 + i / 3) % 1; return <g key={i} opacity={(1 - k) * on * 0.8}><path d={`M${170 + k * 120},${-120 - 60} q${30 + k * 30},60 0,120`} fill="none" stroke={WATER} strokeWidth={6} strokeLinecap="round" /><path d={`M${-170 - k * 120},${-120 - 60} q${-30 - k * 30},60 0,120`} fill="none" stroke={WATER} strokeWidth={6} strokeLinecap="round" /></g>; })}
    </g>
  );
};

// konuşma balonu: noise>0 → su dalgaları yazıyı örter
const Bubble: React.FC<{ x: number; y: number; text: string; t: number; k?: number; noise?: number; w?: number }> = ({ x, y, text, t, k = 1, noise = 0, w = 300 }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={k}>
    <rect x={-w / 2} y={-60} width={w} height={110} rx={40} fill="#fff" stroke={H.ln} strokeWidth={4} />
    <path d="M-20,48 L-50,92 L10,50Z" fill="#fff" stroke={H.ln} strokeWidth={4} />
    <rect x={-22} y={44} width={40} height={10} fill="#fff" />
    <text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill={H.ln} opacity={1 - noise}>{text}</text>
    {noise > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${-w / 2 + 20},${-20 + i * 22} ${Array.from({ length: 8 }, (_, j) => `q${(w - 40) / 16},${j % 2 ? 14 : -14} ${(w - 40) / 8},0`).join(" ")}`} transform={`translate(${Math.sin(t * 6 + i) * 6},0)`} fill="none" stroke={WATER} strokeWidth={8} strokeLinecap="round" opacity={noise} />)}
  </g>
);

// duvardaki kulak
const Kulak: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y + Math.sin(t * 2) * 4}) scale(${s})`}>
    <path d="M0,-80 C60,-80 80,-30 70,10 C62,40 30,46 26,80 C22,110 -20,112 -30,84" fill="#F2C9A8" stroke={H.ln} strokeWidth={6} strokeLinecap="round" />
    <path d="M10,-44 C40,-44 46,-10 30,10 C20,22 4,20 6,40" fill="none" stroke={H.ln} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Kapi: React.FC<{ t: number; light?: number }> = ({ t, light = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={H.plaster} />
    <rect y={560} width={1920} height={520} fill="url(#hTile)" />
    <rect y={552} width={1920} height={14} fill={H.cobalt} />
    <path d="M760,1000 L760,330 Q960,170 1160,330 L1160,1000Z" fill={H.wood} stroke={H.ln} strokeWidth={6} />
    <path d="M960,1000 L960,250" stroke={H.wood2} strokeWidth={6} />
    {[400, 600, 800].map((yy) => <path key={yy} d={`M780,${yy} L1140,${yy}`} stroke={H.wood2} strokeWidth={4} opacity={0.6} />)}
    <circle cx={930} cy={640} r={12} fill={H.gold} /><circle cx={990} cy={640} r={12} fill={H.gold} />
    <rect x={760} y={996} width={400} height={10} fill="#FFE9A8" opacity={light * (0.6 + Math.sin(t * 5) * 0.2)} />
    <rect y={1000} width={1920} height={80} fill="url(#hMarble)" />
    <Lantern x={600} y={300} s={1} t={t} on={1} /><Lantern x={1320} y={300} s={1} t={t + 1} on={1} />
  </g>
);

const has = (t: number) => <Room t={t} win={0.35} lamp={1} />;
const odaCesme = (t: number, on: number) => <>{has(t)}<Cesme x={960} y={690} s={0.95} t={t} on={on} /></>;
const gul = (t: number, x: number, s = 1.25, face: "normal" | "worried" | "shock" | "smile" | "sad" | "closed" = "normal", o: Partial<React.ComponentProps<typeof HFig>> = {}) => <HFig x={x} y={G + 30} s={s} {...GUL} t={t} face={face} seed={2} {...o} />;
const kal = (t: number, x: number, s = 1.3, face: "normal" | "worried" | "shock" | "smile" = "normal", talk = 0, look = 0) => <HFig x={x} y={G + 40} s={s} {...KAL} t={t} face={face} talk={talk} look={look} old seed={5} />;
const gorusme = (t: number, talk = 1) => (
  <>{has(t)}<Sedir x={960} y={900} w={760} />
    <HFig x={870} y={G} s={0.62} kind="sultan" t={t} sit talk={talk * (Math.sin(t * 1.3) > 0 ? 1 : 0)} look={0.6} seed={1} />
    <HFig x={1055} y={G} s={0.58} kind="efendi" t={t} sit talk={talk * (Math.sin(t * 1.3) > 0 ? 0 : 1)} look={-0.6} seed={3} bow={0.2} /></>
);

// ───────── dikey yazılar (1080×1920) ─────────
const useSp = (t: number, at: number) => { const { fps } = useVideoConfig(); return spring({ frame: Math.max(0, (t - at) * fps), fps, config: { damping: 13, stiffness: 140 } }); };
const VT: React.FC<{ t: number; at: number; text: string; y?: number; size?: number; c?: string; bg?: string; until?: number }> = ({ t, at, text, y = 260, size = 92, c = "#2A1E14", bg = "#FBF3E0", until = 1e9 }) => {
  const sp = useSp(t, at);
  if (t < at || t > until + 0.25) return null;
  const out = 1 - ramp(t, until, until + 0.25);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, textAlign: "center", opacity: sp * out, transform: `scale(${0.8 + 0.2 * sp}) rotate(${(1 - sp) * -3}deg)` }}>
      <div style={{ display: "inline-block", background: bg, borderBottom: `12px solid ${H.gold}`, borderRadius: 26, padding: `${size * 0.16}px ${size * 0.4}px`, boxShadow: "0 16px 40px rgba(0,0,0,.4)", fontFamily: FONT, fontWeight: 800, fontSize: size, color: c, lineHeight: 1.06 }}>{text}</div>
    </div>
  );
};
const Stamp: React.FC<{ t: number; at: number; text: string; y?: number; c?: string }> = ({ t, at, text, y = 700, c = H.red }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: sp, transform: `scale(${2.2 - 1.2 * sp}) rotate(-8deg)` }}><span style={{ display: "inline-block", border: `12px solid ${c}`, color: c, fontFamily: FONT, fontWeight: 900, fontSize: 130, padding: "4px 40px", borderRadius: 20, background: "rgba(255,250,240,.85)" }}>{text}</span></div>;
};

// kelime kelime altyazı
const CHUNKS: { ws: W[]; a: number; b: number }[] = (() => {
  const out: { ws: W[]; a: number; b: number }[] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const nx = WORDS[i + 1];
    if (cur.length >= 3 || /[.?!:,]$/.test(w.text) || !nx || nx.start - w.end > 0.6) { out.push({ ws: cur, a: cur[0].start, b: w.end }); cur = []; }
  });
  out.forEach((c, i) => (c.b = i + 1 < out.length ? Math.min(out[i + 1].a, c.b + 0.5) : c.b + 0.6));
  return out;
})();
const Caps: React.FC<{ t: number }> = ({ t }) => {
  const c = CHUNKS.find((x) => t >= x.a - 0.05 && t < x.b);
  if (!c) return null;
  const pop = ramp(t, c.a - 0.05, c.a + 0.1);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1240, textAlign: "center", transform: `scale(${0.9 + 0.1 * pop})` }}>
      {c.ws.map((w, i) => {
        const on = t >= w.start - 0.05;
        return <span key={i} style={{ display: "inline-block", margin: "0 12px", fontFamily: FONT, fontWeight: 900, fontSize: 96, color: on && t < w.end + 0.15 ? H.gold : "#FFFFFF", WebkitTextStroke: "14px #1B1209", paintOrder: "stroke fill", textShadow: "0 8px 18px rgba(0,0,0,.55)", textTransform: "uppercase", opacity: on ? 1 : 0.55 }}>{w.text.replace(/[.,:]$/, "")}</span>;
      })}
    </div>
  );
};

// ───────── çekimler ─────────
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone };

const SHOTS: Sh[] = [
  { c: "Sen Gülfem'sin", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.9, 1.5]} c0={[960, 560]}>{odaCesme(t, 1)}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.05} text="BU SUDAN KİMSE İÇMEZDİ" y={230} size={88} /> },
  { c: "On altı yaşındasın", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}>{has(t)}{gul(t, 960, 1.35, "normal")}</HCam>,
    html: (t, a) => <><VT t={t} at={a + 0.1} text="GÜLFEM · 16" y={240} size={96} bg={H.turq} c="#fff" /></> },
  { c: "ve Topkapı Sarayı'nın", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.25]} c0={[960, 600]}><Corridor t={t} /><Walker t={t} a={a} b={b} x0={1080} x1={880} y={G + 30} s={0.75} o={{ ...GUL, face: "normal" }} /></HCam>,
    html: (t, a) => <VT t={t} at={a + 0.3} text="TOPKAPI · HAREM" y={240} size={80} /> },
  { c: "Her gün aynı şey", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 560]}>{has(t)}{gul(t, 960, 1.2, "closed")}</HCam>,
    html: (t, a, b) => <VT t={t} at={a} text={`${1 + Math.min(3, Math.floor((t - a) / Math.max(0.3, (b - a) / 4)))}. GÜN`} y={240} size={100} /> },
  { c: "Kalfa koşarak geliyor", sfx: "whoosh", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[960, 620]}><Corridor t={t} /><g transform={`translate(0,${-Math.abs(Math.sin(t * 12)) * 14})`}><HFig x={lerp(1200, 900, ramp(t, a, b))} y={G + 40} s={0.95} {...KAL} t={t} face="worried" old seed={5} /></g></HCam>,
    html: (t, a) => <VT t={t} at={a + 0.1} text="KALFA" y={240} size={90} bg={H.purple} c="#fff" /> },
  { c: "ve tek bir emir", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.1, 2.4]} c0={[960, 440]}>{has(t)}{kal(t, 960, 1.3, "normal", 1, -0.3)}</HCam> },
  { c: "Padişahın odasındaki bütün", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.25, 1.1]} c0={[960, 560]}>{odaCesme(t, 0)}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.2} text="“BÜTÜN ÇEŞMELERİ AÇ!”" y={240} size={90} /> },
  { c: "Sonuna kadar", sfx: "boom", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3.4, 4]} c0={[960, 400]}>{odaCesme(t, ramp(t, a, b) * 0.3)}</HCam>,
    html: (t, a) => <Stamp t={t} at={a + 0.15} text="SONUNA KADAR" y={300} c={H.cobalt} /> },
  { c: "Sen açıyorsun", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.35, 1.5]} c0={[960, 600]}>{has(t)}<Cesme x={960} y={690} s={0.95} t={t} on={ramp(t, a + 0.3, b)} />{gul(t, 1130, 1.05, "worried", { look: -0.8, hands: "jug" })}</HCam> },
  { c: "Su şırıl şırıl", sfx: "whoosh", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[960, 520]}>{odaCesme(t, 1)}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.2} text="ŞIRIL ŞIRIL…" y={240} size={100} bg="#DFF3FA" c={H.cobalt} /> },
  { c: "Ama kimse o sudan", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 820]}>{odaCesme(t, 1)}<g transform="translate(960,900)"><path d="M-50,-60 L50,-60 L38,40 L-38,40Z" fill={H.gold} stroke={H.ln} strokeWidth={5} /><ellipse cx={0} cy={-60} rx={50} ry={10} fill="#C99A3A" stroke={H.ln} strokeWidth={4} /></g></HCam>,
    html: (t, a) => <Stamp t={t} at={a + 0.5} text="İÇİLMEZ ✗" y={420} /> },
  { c: "Kimse elini bile", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 560]}>{odaCesme(t, 1)}{gul(t, 1130, 1.0, "worried", { look: -0.8 })}</HCam>,
    html: (t, a) => <Stamp t={t} at={a + 0.4} text="YIKANMAZ ✗" y={420} /> },
  { c: "Bir saat sonra kalfa", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 600]}>{odaCesme(t, 1)}{kal(t, 1080, 1.1, "normal", 0, -0.7)}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.1} text="⏳ 1 SAAT SONRA" y={240} size={86} /> },
  { c: "Şimdi kapat", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.8]} c0={[960, 420]}>{odaCesme(t, 1 - ramp(t, a + 0.3, a + 1))}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.1} text="“ŞİMDİ KAPAT.”" y={240} size={100} /> },
  { c: "Neden?", sfx: "boom", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, 460]}>{has(t)}{gul(t, 960, 1.3, "shock")}</HCam>,
    html: (t, a) => <Stamp t={t} at={a + 0.05} text="NEDEN?" y={330} c={H.red} /> },
  { c: "Sana on saniye", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 560]}>{odaCesme(t, 0)}{gul(t, 1120, 1.0, "normal", { look: -0.6 })}</HCam> },
  { c: "Cevabını yorumlara", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><Kapi t={t} /></HCam>,
    html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={240} size={88} /> },
  // geri sayım boyunca ipucu çekimleri (ses yok)
  { c: "+2.4", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.6]} c0={[960, 700]}><Kapi t={t} /></HCam> },
  { c: "+3.3", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.2]} c0={[960, 520]}>{odaCesme(t, 1)}</HCam> },
  { c: "+3.3", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.8]} c0={[960, 520]}>{has(t)}{gul(t, 960, 1.3, "worried", { look: Math.sin(t * 1.4) })}</HCam> },
  // cevap
  { c: "Anlatılana göre", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.3]} c0={[960, 560]}><Kapi t={t} light={1} /></HCam>,
    html: (t, a) => <VT t={t} at={a + 0.1} text="CEVAP 👇" y={240} size={100} bg={H.gold} /> },
  { c: "O odada padişah", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.2]} c0={[960, 760]}>{gorusme(t)}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.4} text="GİZLİ GÖRÜŞME" y={240} size={92} bg={H.crimson} c="#fff" /> },
  { c: "Ve sarayda duvarların", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 560]}><Kapi t={t} /><Kulak x={1080} y={520} s={1.4 + 0.2 * ramp(t, a, b)} t={t} /></HCam>,
    html: (t, a) => <VT t={t} at={a + 0.3} text="DUVARLARIN BİLE KULAĞI VAR" y={230} size={78} /> },
  { c: "Akan suyun sesi", sfx: "whoosh", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 700]}>{gorusme(t)}<Bubble x={960} y={560} text="Sefer… Paşa…" t={t} k={1} noise={ramp(t, a + 0.4, a + 1.4)} w={360} /></HCam> },
  { c: "Kapının dışındaki kimse", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 600]}><Kapi t={t} /><HFig x={1060} y={G + 30} s={0.9} kind="aga" t={t} face="worried" look={-0.9} seed={7} /><Bubble x={940} y={560} text="şşşşş…?" t={t} k={ramp(t, a + 0.5, a + 0.9)} noise={0} w={260} /></HCam>,
    html: (t, a) => <Stamp t={t} at={a + 1.2} text="TEK KELİME YOK" y={300} c={H.cobalt} /> },
  { c: "Yani sen her gün", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}>{has(t)}<Cesme x={960} y={690} s={0.95} t={t} on={1} />{gul(t, 1130, 1.05, "normal", { look: -0.8 })}</HCam> },
  { c: "Bir sırrı koruyordun", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.1, 2.4]} c0={[960, 460]}>{has(t)}{gul(t, 960, 1.3, "smile")}</HCam>,
    html: (t, a) => <VT t={t} at={a + 0.2} text="🔒 BİR SIRRI KORUYORDUN" y={240} size={78} bg={H.cobalt} c="#fff" /> },
  { c: "Haremin daha büyük", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 600]}><Corridor t={t} /><Walker t={t} a={a} b={b + 2} x0={960} x1={900} y={G + 30} s={0.75} o={{ ...GUL, face: "smile" }} /></HCam>,
    html: (t, a) => <><VT t={t} at={a + 0.1} text="HAREMİN SIRLARI" y={240} size={92} /><Sub t={t} at={a + 0.6} /></> },
];

const Sub: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const sp = useSp(t, at);
  if (t < at) return null;
  return <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center", opacity: sp, transform: `scale(${0.7 + 0.3 * sp})` }}><span style={{ display: "inline-block", background: H.red, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "20px 70px", borderRadius: 70, boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>ABONE OL 🔔</span></div>;
};

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let prev = 0, after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? prev + parseFloat(s.c) : cue(s.c, after) - 0.1;
    prev = from; after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : S3_01_SECONDS));
  return raw;
})();

// geri sayım: "yaz"dan sonraki 10 saniyelik sessizlik
const CD_END = cue("Anlatılana göre") - 0.25;
const CD_START = CD_END - 10;
const Countdown: React.FC<{ t: number }> = ({ t }) => {
  if (t < CD_START || t >= CD_END) return null;
  const left = Math.max(1, 10 - Math.floor(t - CD_START));
  const fr = (t - CD_START) % 1;
  const pulse = 1 + 0.25 * (1 - Math.min(1, fr * 4));
  const R = 210, C = 2 * Math.PI * R;
  const prog = (t - CD_START) / 10;
  const hot = left <= 3;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
      <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ transform: `scale(${pulse})` }}>
        <circle r={R + 30} fill="rgba(20,16,40,.82)" />
        <circle r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={26} />
        <circle r={R} fill="none" stroke={hot ? H.red : H.gold} strokeWidth={26} strokeDasharray={`${C * (1 - prog)} ${C}`} transform="rotate(-90)" strokeLinecap="round" />
        <text y={85} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={250} fill={hot ? "#FF8A7A" : "#FFF3D6"}>{left}</text>
      </svg>
    </div>
  );
};

const VOL: Record<string, number> = { whoosh: 0.07, boom: 0.14, ding: 0.13, splash: 0.12 };
export const S3Short01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = S3_01_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.14);
  const inCd = t >= CD_START && t < CD_END;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: 1 - ramp(t, END - 0.8, END) }}>
        <svg viewBox="656 0 608 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, background: H.plaster }}>
          <HDefs />
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.5 : 1} seed={n} />
          <Sweep t={t} a={s.from} />
          {inCd && <rect x={0} width={1920} height={1080} fill="#0E0A1E" opacity={0.35} />}
          {cut > 0 && <rect width={1920} height={1080} fill="#FFF8E6" opacity={cut * 0.3} />}
          <rect width={1920} height={1080} fill="url(#hVig)" pointerEvents="none" />
        </svg>
        {/* seri etiketi */}
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}><span style={{ display: "inline-block", background: "rgba(27,18,9,.78)", color: H.gold, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "8px 30px", borderRadius: 40, letterSpacing: 2 }}>HAREMİN SIRLARI · #1</span></div>
        {s.html?.(t, s.from, s.to)}
        <Countdown t={t} />
        <Caps t={t} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/s3-01.wav")} />
      {TIMED.map((x, i) => i > 0 && x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <Sequence key={`tk${i}`} from={Math.round((CD_START + i) * fps)} durationInFrames={Math.round(0.9 * fps)} layout="none">
          <Audio src={staticFile("sfx/tick.wav")} volume={0.16} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
