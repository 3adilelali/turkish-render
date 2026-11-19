import React from "react";
import words from "../../../public/data/k7-02-words.json";
import { makeCue } from "../../lib/cues";
import credits from "../../../public/img/k7-02/credits.json";
import dimsJson from "../../../public/data/k7-02-dims.json";
import { X, T } from "../../components/Protokol";
import { rp } from "../../components/Hayat";
import {
  Ph, Seq, SeqItem, Panel, QuoteCard, ListCard, ChainCard, BigStat, ChapterCard, DateStrip, People, Overlay, Person, setDims, setDepths, Grade, Par,
} from "../../components/Protokol5";
import { GeoMap, MapPin, MapRoute, GeoView, Board, BoardItem, BoardString, Circ, Arrow, Under, Redact } from "../../components/Protokol6";

// k7-02 v2 · مساعدات المشاهد (كل لقطة = صورة حقيقية، بلا ومضات)
export const DIMS = dimsJson as unknown as Record<string, [number, number]>;
setDims(DIMS);
export const CUE = makeCue(words as { text: string; start: number; end: number }[]);
export const DEPTH_FILES = ["tehran1", "papen3", "ankbulv2", "ankara4012", "istanbul22", "ankbulv4", "hitler24", "typewriter1", "istanbul406", "ankara407", "ankara4011", "ankbulv3", "ankbulv5", "istanbul404", "istanbul407", "istanbul408", "tehran2", "cairow2", "papenw6", "papenw5", "ribb2", "churchill3", "overlord6", "ankara405", "ankara403", "ankara406", "ankara404", "papenw4", "papenw3", "hitlerw4", "istanbul21", "istanbul23"];
setDepths(DEPTH_FILES);

export type R = (t: number, a: number, b: number) => React.ReactNode;
export type Sh = { c: string | string[]; r: R; html?: R; sfx?: string };
export const AMB = X.amber, RED = X.red;

// سطر الشكر الصغير على الشاشة (فقط للتراخيص اللي بتطلب نسب)
export const crd = (file: string): string | undefined => {
  const c = (credits as Record<string, { license: string; artist: string }>)[file];
  if (!c) return undefined;
  if (/^(public domain|no restrictions|cc0)/i.test(c.license)) return undefined;
  const a = (c.artist || "").replace(/\s+/g, " ").replace(/^Unknown\s*/i, "").trim().slice(0, 34);
  return `${a ? a + " · " : ""}${c.license} · Wikimedia Commons`;
};

type PO = { cap?: string; sub?: string; yr?: string; z?: [number, number]; f?: [number, number, number, number]; grade?: Grade; par?: Par; mode?: "auto" | "cover" | "card"; dim?: number };
// صورة وحدة بحركة كاميرا
// تنويع الاقتصاص: نفس الصورة بتبيّن بزاوية وتقريب مختلفين كل مرة
const FV: [number, number, number, number][] = [[0.5, 0.5, 0.56, 0.5], [0.32, 0.45, 0.46, 0.5], [0.68, 0.45, 0.54, 0.5], [0.5, 0.38, 0.5, 0.56], [0.42, 0.58, 0.6, 0.44], [0.6, 0.5, 0.38, 0.5]];
const ZV: [number, number][] = [[1.04, 1.16], [1.14, 1.3], [1.08, 1.22], [1.2, 1.42]];
let VC = 0;
const vary = (o: PO): PO => { VC++; return { f: FV[VC % FV.length], z: ZV[(VC * 3 + 1) % ZV.length], ...o }; };
export const ph = (file: string, o: PO = {}): R => { const v = vary(o); return (t, a, b) => <Ph t={t} a={a} b={b} file={file} credit={crd(file)} {...v} />; };
// عدّة صور بالتتابع (كل واحدة تاخد حصة متساوية من اللقطة)
export const seq = (items: (PO & { file: string })[]): R => { const its = items.map((i): SeqItem => ({ credit: crd(i.file), ...vary(i), ...i })); return (t, a, b) => <Seq t={t} a={a} b={b} items={its} />; };
// رشقة تأكيد: صور سريعة 0.25–0.4 ث (مرة أو مرتين بالدقيقة بس)
export const burst = (files: string[], o: PO = {}): R => (t, a, b) => <Seq t={t} a={a} b={b} items={files.map((f, i): SeqItem => ({ file: f, credit: undefined, z: [1.02 + (i % 3) * 0.03, 1.1 + (i % 3) * 0.03], f: [0.35 + (i % 4) * 0.1, 0.45, 0.5 + (i % 3) * 0.05, 0.5], ...o }))} />;

export const panel = (bg: string, title: string, lines: string[], o: { stamp?: string; stampAt?: number; side?: "l" | "r"; tag?: string; c?: string; dim?: number; f?: [number, number, number, number] } = {}): R => (t, a, b) =>
  <Panel t={t} a={a} b={b} bg={bg} title={title} lines={lines} {...o} />;
export const quote = (bg: string, q: string, who = "Protokol X", c = AMB): R => (t, a, b) => <QuoteCard t={t} a={a} b={b} bg={bg} q={q} who={who} c={c} />;
export const list = (bg: string, title: string, items: string[], c = AMB): R => (t, a, b) => <ListCard t={t} a={a} b={b} bg={bg} title={title} items={items} c={c} />;
export const chain = (bg: string, nodes: string[], sub: string[] = [], c = AMB): R => (t, a, b) => <ChainCard t={t} a={a} b={b} bg={bg} nodes={nodes} sub={sub} c={c} />;
export const stat = (bg: string, to: number, label: string, o: { prefix?: string; suffix?: string; c?: string } = {}): R => (t, a, b) => <BigStat t={t} a={a} b={b} bg={bg} to={to} label={label} {...o} />;
export const chap = (bg: string, n: string, title: string, sub?: string, f?: [number, number, number, number]): R => (t, a, b) => <ChapterCard t={t} a={a} b={b} bg={bg} n={n} title={title} sub={sub} f={f} />;
export const date = (bg: string, d: string, place?: string, c?: string, f?: [number, number, number, number]): R => (t, a, b) => <DateStrip t={t} a={a} b={b} bg={bg} date={d} place={place} c={c} f={f} />;
export const people = (bg: string, ps: Person[]): R => (t, a, b) => <People t={t} a={a} b={b} bg={bg} people={ps} />;
export const over = (bg: string, text: string, o: { sub?: string; c?: string; y?: number; f?: [number, number, number, number]; z?: [number, number]; yr?: string } = {}): R => (t, a, b) => <Overlay t={t} a={a} b={b} bg={bg} text={text} credit={crd(bg)} {...o} />;

export const map = (v0: GeoView, o: { v1?: GeoView; hi?: string[]; hi2?: string[]; pins?: (MapPin & { dt?: number })[]; routes?: (Omit<MapRoute, "at"> & { dt: number })[]; yr?: string; place?: string } = {}): R => (t, a, b) => {
  const { pins = [], routes = [], ...rest } = o;
  return <GeoMap t={t} a={a} b={b} v0={v0} {...rest} pins={pins.map((p) => ({ ...p, at: a + (p.dt ?? 0.3) }))} routes={routes.map((r) => ({ ...r, at: a + r.dt }))} />;
};

export const board = (items: BoardItem[], strings: BoardString[], focus: { id: string; z?: number }, focus1?: { id: string; z?: number }): R => (t, a, b) =>
  <Board t={t} a={a} b={b} items={items} strings={strings} focus={focus} focus1={focus1} dims={DIMS} />;

// صورة + تعليق بخط اليد (دوائر/أسهم) فوقها
export type Ann = { k: "c"; x: number; y: number; rx: number; ry?: number; at: number; c?: string } | { k: "a"; x1: number; y1: number; x2: number; y2: number; at: number; c?: string } | { k: "u"; x: number; y: number; w: number; at: number; c?: string } | { k: "r"; x: number; y: number; w: number; at: number; n?: number };
export const note = (file: string, anns: Ann[], o: PO = {}): R => (t, a, b) => (
  <Ph t={t} a={a} b={b} file={file} credit={crd(file)} {...o}>
    {anns.map((n, i) => n.k === "c" ? <Circ key={i} t={t} at={a + n.at} x={n.x} y={n.y} rx={n.rx} ry={n.ry} c={n.c} />
      : n.k === "a" ? <Arrow key={i} t={t} at={a + n.at} x1={n.x1} y1={n.y1} x2={n.x2} y2={n.y2} c={n.c} />
      : n.k === "u" ? <Under key={i} t={t} at={a + n.at} x={n.x} y={n.y} w={n.w} c={n.c} />
      : <Redact key={i} t={t} at={a + n.at} x={n.x} y={n.y} w={n.w} n={n.n} />)}
  </Ph>
);

// بطاقة نص كبير على خلفية سودا (للجملة الثابتة والإغلاق)
export const title = (lines: { s: string; c?: string; size?: number }[], bg = "#050608"): R => (t, a) => (
  <g>
    <rect width={1920} height={1080} fill={bg} />
    {lines.map((l, i) => <g key={i} opacity={rp(t, a + 0.3 + i * 1.6, a + 0.9 + i * 1.6)}>{T(960, 520 + i * 110, l.s, l.size ?? 70, l.c ?? "#FFF", 700, "middle")}</g>)}
  </g>
);

// مجمّعات صور عامة: G("doc") بيرجّع التالية مع تجنّب آخر 5 مستعملة
export const POOLS: Record<string, string[]> = {
  doc: ["typewriter1", "dgpi32", "typewriter2", "radio51", "typewriter3", "tele53", "enigma3", "dgpi33", "enigma4", "foreign51", "enigma2", "radio52"],
  ank: ["ankara1", "ankara2", "ankara3", "ankara403", "ankara404", "ankara405", "ankara406", "ankara407", "ankara408", "ankara4011", "ankara4012", "ankara4014", "ankbulv2", "ankbulv3", "ankbulv4", "ankbulv5", "ankbulv6", "dgpi31", "dgpi34", "dgpi35", "dgpi37", "dgpi38", "dgpi41", "dgpi43", "dgpi44", "dgpi46", "ankold51", "ankold52"],
  ist: ["istanbul404", "istanbul406", "istanbul407", "istanbul408", "istanbul21", "istanbul22", "istanbul23"],
  war: ["hitlerw5", "hitler22", "hitler24", "ww23", "ww25", "overlord2", "overlord3", "overlord5", "overlord7"],
  ber: ["hitlerw5", "hitler22", "hitler24", "papenw5", "ribb1"],
  hotel: ["hotel51", "hotel52", "hotel53"],
  news: ["news53", "news52", "news54"],
  money: ["bernhard1", "bernhard2", "bernhard20", "bank1"],
  ally: ["ww52", "ww53", "ww54", "churchill1", "churchill2", "churchill3", "tehran2", "tehran3", "cairow2", "roosevelt1", "roosevelt2", "stalin1"],
};
const USED: Record<string, string[]> = {};
export const G = (pool: string): string => {
  const list = POOLS[pool];
  const used = (USED[pool] ??= []);
  const recent = used.slice(-Math.min(5, list.length - 1));
  const pick = list.find((f) => !recent.includes(f) && !used.slice(-list.length).includes(f)) ?? list.find((f) => !recent.includes(f)) ?? list[0];
  used.push(pick);
  return pick;
};
