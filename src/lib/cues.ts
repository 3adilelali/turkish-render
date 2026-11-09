import { Easing, interpolate } from "remotion";

export type Word = { text: string; start: number; end: number };

const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
    .replace(/[^a-zçğıöşü0-9]/g, "");

// Find when a phrase is spoken. Matching ignores spaces/punctuation/case, so "Denizyıldızı" finds "Deniz yıldızı"
// and "Sırtüstü" finds "Sırt üstü". Pass several spellings as an array (e.g. ["İki numara", "2 numara"]).
// `after` = search from this second on. Throws if missing, so typos surface early.
export const makeCue = (words: Word[]) => {
  let text = "";
  const owner: number[] = []; // char index → word index
  words.forEach((w, i) => {
    const n = norm(w.text);
    text += n;
    for (let k = 0; k < n.length; k++) owner.push(i);
  });
  // earliest match (at a word start) across all spellings, at or after `after`
  return (phrase: string | string[], after = 0, which: "start" | "end" = "start"): number => {
    let best: { at: number; q: string } | null = null;
    for (const p of Array.isArray(phrase) ? phrase : [phrase]) {
      const q = norm(p);
      let from = 0;
      while (q) {
        const at = text.indexOf(q, from);
        if (at < 0) break;
        const wi = owner[at];
        const wordStart = at === 0 || owner[at - 1] !== wi;
        if (wordStart && words[wi].start >= after) {
          if (!best || at < best.at) best = { at, q };
          break;
        }
        from = at + 1;
      }
    }
    if (!best) throw new Error(`cue not found: "${phrase}" after ${after}`);
    return which === "start" ? words[owner[best.at]].start : words[owner[best.at + best.q.length - 1]].end;
  };
};

export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const win = (t: number, a: number, b: number, fade = 0.3) => ramp(t, a, a + fade) * (1 - ramp(t, b, b + fade));

// keyframed numeric tracks: [[time, ...values]] → values at t (0.8 s eased moves)
export const track = (keys: number[][], t: number, move = 0.8): number[] => {
  let cur = keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const [ta, ...v] = keys[i];
    if (t >= ta) {
      const k = ramp(t, ta, ta + move);
      const prev = cur;
      cur = prev.map((p, j) => p + (v[j] - p) * k);
      if (k < 1) break;
      cur = v;
    }
  }
  return cur;
};
