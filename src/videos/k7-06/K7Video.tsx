import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import stockDur from "../../../public/data/k7-06-stock.json";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k7-06-words.json";
import { makeCue } from "../../lib/cues";
import { rp } from "../../components/Hayat";
import { PFrame, Grain } from "../../components/Protokol";
import { Sh } from "./h";
import { SHOTS } from "./s";

// Kanal 5 · Protokol X · k7-06 · "Victoria" (2026-11-25)
// المحرّك أساس (SilkRoad.tsx)، والصور الحرة للتعريف. عدّة الصوت الخاصة sfx/px + موسيقى مرخّصة music/k7-06-mix.mp3. الصوت: Gemini 3.8 (Gacrux).

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
// المؤثرات (v2، 2026-11-25): Mixkit موحّدة العلو (-18 LUFS) بـ sfx/v3، وحدة بس للّقطة المميزة (قواعد تحليل حمزة).
const SFX_VOL: Record<string, number> = {
  "v3/impact": 0.32, "v3/boom": 0.34, "v3/thud": 0.3, "v3/hit": 0.26, "v3/logo": 0.3, "v3/whoosh": 0.2, "v3/whoosh2": 0.2,
  "v3/heart": 0.36, "v3/tick": 0.24, "v3/shutter": 0.3, "v3/shutter2": 0.3, "v3/keys": 0.16, "v3/paper": 0.28, "v3/page": 0.28,
  "v3/static": 0.12, "v3/ring": 0.22, "v3/sign": 0.25,
};

export const K7_06_SECONDS = Math.ceil(VOICE_END + 4);

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.1;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K7_06_SECONDS));
  return raw;
})();

const SD = stockDur as Record<string, number>;
// فيديو الستوك: بيبلّش مع اللقطة، وحركة كاميرا بطيئة، وبيبطّأ إذا اللقطة أطول من الكليب
const StockLayer: React.FC<{ v: NonNullable<Sh["v"]>; from: number; to: number; fps: number; t: number }> = ({ v, from, to, fps, t }) => {
  const len = Math.max(0.5, to - from), dur = SD[v.id] ?? 10, ss = Math.min(v.ss ?? 0.5, Math.max(0, dur - 1));
  const rate = Math.min(0.9, Math.max(0.35, (dur - ss - 0.2) / len));
  const [z0, z1] = v.z ?? [1.04, 1.12];
  const k = Math.min(1, Math.max(0, (t - from) / len));
  const [fx, fy] = v.fx ?? [50, 50];
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={Math.max(1, Math.round(len * fps) + 2)} layout="none">
      <AbsoluteFill style={{ transform: `scale(${z0 + (z1 - z0) * k})`, transformOrigin: `${fx}% ${fy}%` }}>
        <OffthreadVideo src={staticFile(`stock/k7-06/${v.id}.mp4`)} muted startFrom={Math.round(ss * fps)} playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
  );
};

export const K7Video06: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const prev = n > 0 ? TIMED[n - 1] : null;
  // قطع حاد لما في فيديو (متل أبو الصادق)، وذوبان خفيف بين الغرافيك
  const inK = s.v || prev?.v ? 1 : rp(t, s.from, s.from + 0.22);
  const fadeIn = rp(t, 0, 0.4);
  const fadeOut = 1 - rp(t, K7_06_SECONDS - 1.5, K7_06_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* تلوين سينمائي موحّد على كل شي (سيبيا خفيفة + تباين)، متل فيلم واحد */}
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut, filter: "sepia(0.22) saturate(0.82) contrast(1.07) brightness(0.95)" }}>
        {s.v && <StockLayer v={s.v} from={s.from} to={s.to} fps={fps} t={t} />}
        <PFrame bg={s.v ? "transparent" : undefined}>
          {prev && inK < 1 && prev.r(t, prev.from, prev.to)}
          <g opacity={inK}>{s.r(t, s.from, s.to)}</g>
          <Grain t={t} k={0.5} />
        </PFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k7-06.wav")} />
      {/* الموسيقى (2026-11-23): مكتبة Kevin MacLeod المرخّصة CC BY 4.0، مركّبة بـ أدوات/music_mix.py (مقدمة The Escalation وبعدين خلفيات غامضة، وبتوطى لحالها تحت الكلام) */}
      <Audio src={staticFile("music/k7-06-mix.mp3")} />
      {TIMED.map((x, i) => x.sfx && SFX_VOL[x.sfx] && (x.to < K7_06_SECONDS - 15 || x.sfx === "v3/logo") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(5 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={SFX_VOL[x.sfx]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
