import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
// المؤثرات: هادية وقليلة. انشالوا riser (صفير صاعد) وpulse وtick وclick (2026-11-23، شكوى عادل).
const SFX_VOL: Record<string, number> = { "px/boom": 0.11, "px/boom3": 0.11, "px/hit_end": 0.13, "px/whoosh": 0.06, "px/keys": 0.09, "px/steps": 0.09 };

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

export const K7Video06: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const prev = n > 0 ? TIMED[n - 1] : null;
  const inK = rp(t, s.from, s.from + 0.22);
  const fadeIn = rp(t, 0, 0.4);
  const fadeOut = 1 - rp(t, K7_06_SECONDS - 1.5, K7_06_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <PFrame>
          {prev && inK < 1 && prev.r(t, prev.from, prev.to)}
          <g opacity={inK}>{s.r(t, s.from, s.to)}</g>
          <Grain t={t} k={0.4} />
        </PFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k7-06.wav")} />
      {/* الموسيقى (2026-11-23): مكتبة Kevin MacLeod المرخّصة CC BY 4.0، مركّبة بـ أدوات/music_mix.py (مقدمة The Escalation وبعدين خلفيات غامضة، وبتوطى لحالها تحت الكلام) */}
      <Audio src={staticFile("music/k7-06-mix.mp3")} />
      {TIMED.map((x, i) => i > 0 && x.sfx && SFX_VOL[x.sfx] && (x.to < K7_06_SECONDS - 15 || x.sfx === "px/hit_end") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(5 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={SFX_VOL[x.sfx]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
