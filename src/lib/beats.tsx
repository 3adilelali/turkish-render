import React from "react";
import { interpolate } from "remotion";
import { ease, Word } from "./cues";

// Retention helper: inside a long shot, every new spoken sentence reframes the camera (punch-in left / right / up),
// so the picture changes every few seconds without touching the shot itself. Chapter cards should pass `off`.
export const sentenceStarts = (words: Word[]) => {
  const out: number[] = [];
  words.forEach((w, i) => {
    if (i > 0 && /[.?!]$/.test(words[i - 1].text)) out.push(w.start);
  });
  return out;
};

// [scale, focus x, focus y] — kept mild so top titles and side labels stay inside the frame.
const FRAMES: [number, number, number][] = [[1, 960, 540], [1.12, 780, 560], [1.1, 1140, 540], [1.12, 960, 600]];

export const Beat: React.FC<{ t: number; from: number; starts: number[]; off?: boolean; children: React.ReactNode }> = ({ t, from, starts, off, children }) => {
  if (off) return <>{children}</>;
  const inShot = starts.filter((s) => s > from + 1.2 && s <= t);
  const n = inShot.length;
  const at = inShot[n - 1] ?? from;
  const cur = FRAMES[n % FRAMES.length];
  const prev = FRAMES[Math.max(0, n - 1) % FRAMES.length];
  const k = n === 0 ? 1 : interpolate(t, [at, at + 0.28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const [s, fx, fy] = cur.map((v, i) => prev[i] + (v - prev[i]) * k);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${(fx / 19.2).toFixed(2)}% ${(fy / 10.8).toFixed(2)}%` }}>
      {children}
    </div>
  );
};
