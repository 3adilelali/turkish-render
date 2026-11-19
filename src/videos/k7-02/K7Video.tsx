import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k7-02-words.json";
import { makeCue } from "../../lib/cues";
import { Big, SubBtn, rp } from "../../components/Hayat";
import { PFrame, Grain } from "../../components/Protokol";
import { Sh } from "./h";
import { S0 } from "./s0";
import { S1 } from "./s1";
import { S2 } from "./s2";
import { S3 } from "./s3";
import { S4 } from "./s4";

// Kanal 5 · Protokol X · k7-02 v2 · "Hitler'e Sır Satan Uşağın Parası Neden Sahteydi?" (Çiçero · İlyas Bazna)
// v2 (2026-11-19): gerçek fotoğraf + derinlikli paralaks + gerçek harita + soruşturma panosu. Işık patlaması/flaş YOK.
// Ses: Gemini TTS (Gacrux), kelime zamanları: public/data/k7-02-words.json. Çalışma notları: القناة 5/دراسة-المونتاج-النهائية.md

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K7_02_SECONDS = Math.ceil(VOICE_END + 4);

const SHOTS: Sh[] = [...S0, ...S1, ...S2, ...S3, ...S4];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.1;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K7_02_SECONDS));
  return raw;
})();

export const K7Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const prev = n > 0 ? TIMED[n - 1] : null;
  const inK = rp(t, s.from, s.from + 0.22); // تلاشي ناعم بين اللقطات (بلا ومضة)
  const fadeIn = rp(t, 0, 0.4);
  const fadeOut = 1 - rp(t, K7_02_SECONDS - 1.5, K7_02_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <PFrame>
          {prev && inK < 1 && prev.r(t, prev.from, prev.to)}
          <g opacity={inK}>{s.r(t, s.from, s.to)}</g>
          <Grain t={t} k={0.45} />
        </PFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k7-02.wav")} />
      {TIMED.map((x, i) => i > 0 && x.sfx && x.to < K7_02_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.1 : 0.1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { Big, SubBtn };
