import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-02-words.json";
import { Altyazi, Belge, Cerceve, chunk, Duman, Etiket, ez, Gren, Grade, HH, Img2, Kafes, rmp, Sizinti, Tablo, Ton, Toz, W, Wd } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #2 (Canlı Tablo) · «Harem bir hapishaneydi»
// الشائعة بالأول كأنها حقيقة مع قضبان القفص، والكسر بدفاتر القصر (mevâcib): أسامي ومعاشات وتعليم وتجهيز وزواج.
// المرجع: L. Peirce, The Imperial Harem (1993)؛ Ç. Uluçay, Harem II. الصور ملكية عامة/CC0: public/img/sh1-02/المصادر.txt

const D = "img/sh1-02/";
const I = {
  asseki: { src: D + "asseki.jpg", cut: D + "asseki_cut.png", w: 1578, h: 2400 },
  vrouw: { src: D + "vrouw.jpg", cut: D + "vrouw_cut.png", w: 1784, h: 2400 },
  ahmed: { src: D + "ahmed.jpg", cut: D + "ahmed_cut.png", w: 1881, h: 2400 },
  saraykadin: { src: D + "saraykadin.jpg", cut: D + "saraykadin_cut.png", w: 600, h: 811 },
  borduur: { src: D + "borduur.jpg", w: 1868, h: 2400 },
  maaltijd: { src: D + "maaltijd.jpg", w: 2400, h: 1839 },
  kraam: { src: D + "kraam.jpg", w: 2400, h: 1473 },
  elci: { src: D + "elci.jpg", w: 2400, h: 1744 },
  kapi: { src: D + "kapi.jpg", w: 2260, h: 1488 },
  kapi2: { src: D + "kapi2.jpg", w: 2278, h: 1504 },
  kafes: { src: D + "kafes.jpg", w: 2400, h: 1800 },
  gelin: { src: D + "gelin.jpg", w: 2400, h: 371 },
  panorama: { src: D + "panorama.jpg", w: 2400, h: 714 },
  akce: { src: D + "akce.jpg", w: 2400, h: 1048 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_02_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

// سؤال الفريقين: فوق القفص، وتحت المدرسة
const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * -half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.kafes} a={[1.0, 0.5, 0.4]} b={[1.12, 0.5, 0.4]} k={k} /></div>
        <AbsoluteFill style={{ background: "rgba(40,0,0,.35)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.22, width: W, height: HH }}><Tablo im={I.borduur} a={[1.1, 0.5, 0.55]} b={[1.22, 0.5, 0.55]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="KAFES Mİ?" c="#FF4A3D" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="OKUL MU?" c="#FFD65A" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 150, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

// شريط عريض (منمنمة طويلة) بيمشي بالعرض فوق خلفية مغبّشة
const Serit: React.FC<{ im: Img2; k: number }> = ({ im, k }) => {
  const h = 640, w = (im.w / im.h) * h;
  const x = -(w - W) * (0.1 + 0.8 * k);
  return (
    <AbsoluteFill style={{ background: "#120A05" }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile(im.src)})`, backgroundSize: "cover", backgroundPosition: `${k * 100}% 50%`, filter: "blur(30px) brightness(.45)", transform: "scale(1.2)" }} />
      <div style={{ position: "absolute", top: 480, left: 0, height: h, width: w, transform: `translateX(${x}px)`, backgroundImage: `url(${staticFile(im.src)})`, backgroundSize: "100% 100%", boxShadow: "0 30px 80px rgba(0,0,0,.7)", borderTop: "6px solid #B8892E", borderBottom: "6px solid #B8892E" }} />
    </AbsoluteFill>
  );
};

// ختم أحمر «MAAŞ» بيدقّ عالشاشة
const Muhur: React.FC<{ k: number; text: string }> = ({ k, text }) => {
  const e = rmp(k, 0.15, 0.3);
  const s = 2.4 - 1.4 * ez(e);
  return <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", opacity: e > 0 ? 1 : 0, transform: `scale(${s}) rotate(-9deg)` }}><span style={{ display: "inline-block", border: "12px solid #C4161C", color: "#C4161C", fontFamily: FONT, fontWeight: 700, fontSize: 150, padding: "6px 50px", borderRadius: 18, background: "rgba(247,235,207,.18)", textShadow: "0 0 2px #7a0d10", boxShadow: "inset 0 0 0 6px rgba(196,22,28,.4)" }}>{text}</span></div>;
};

const DEFTER = "Harem halkının her biri adıyla deftere yazılır, her birine maaş bağlanırdı.";

const SHOTS: Shot[] = [
  // ── الشائعة (كأنها حقيقة) ──
  { at: 0, ton: "kan", mum: [540, 900], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.asseki} a={[2.2, 0.47, 0.3]} b={[1.8, 0.47, 0.34]} k={k} depth={0.1} /><Kafes close={rmp(k, 0.05, 0.35)} /></> },
  { at: 2.0, ton: "gece", mum: [700, 600], fx: "duman", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kapi2} a={[1.05, 0.3, 0.5]} b={[1.2, 0.45, 0.52]} k={k} /><Etiket k={k} text="SARAY · T. ALLOM, 1839" /></> },
  { at: 4.5, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.vrouw} a={[1.2, 0.48, 0.3]} b={[1.6, 0.48, 0.24]} k={k} depth={0.1} /><Kafes close={1} /></> },
  { at: 7.1, ton: "soguk", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kafes} a={[1.0, 0.35, 0.45]} b={[1.15, 0.62, 0.45]} k={k} /><Kafes close={rmp(k, 0.1, 0.5)} op={0.75} /><Etiket k={k} text="TOPKAPI SARAYI HAREMİ" /></> },
  { at: 8.7, ton: "gece", mum: [800, 700], fx: "toz", r: (t, k) => <Tablo im={I.kapi2} a={[1.5, 0.7, 0.55]} b={[1.7, 0.78, 0.58]} k={k} /> },
  { at: 10.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.ahmed} a={[1.1, 0.4, 0.55]} b={[1.4, 0.38, 0.22]} k={k} depth={0.1} /><Etiket k={k} text="III. AHMED · J.B. VANMOUR" /></> },
  { at: 13.3, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.elci} a={[1.05, 0.25, 0.5]} b={[1.25, 0.4, 0.5]} k={k} /><Etiket k={k} text="AVRUPALI ELÇİ SARAYDA · VANMOUR" /></> },
  { at: 16.3, ton: "gece", mum: [540, 700], fx: "duman", r: (t, k) => <><Cerceve im={I.asseki} k={k} y={330} width={760} /><Kafes close={1} op={0.7} /></> },
  // ── الكسر: دفاتر القصر ──
  { at: 17.9, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.maaltijd} a={[1.4, 0.5, 0.5]} b={[1.05, 0.5, 0.5]} k={k} /><Kafes close={1} open={rmp(k, 0.02, 0.4)} /></> },
  { at: 21.1, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.maaltijd} a={[1.2, 0.3, 0.5]} b={[1.3, 0.38, 0.5]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={DEFTER} src="Saray mevâcib defterleri · L. Peirce, The Imperial Harem" typed={rmp(k, 0.08, 0.8)} quote={false} tag="📜 SARAY DEFTERİ" /></> },
  { at: 24.1, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kraam} a={[1.1, 0.2, 0.5]} b={[1.3, 0.32, 0.55]} k={k} /><Etiket k={k} text="HAREM HAYATI · VANMOUR" /></> },
  { at: 27.3, ton: "belge", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.akce} a={[1.0, 0.3, 0.5]} b={[1.15, 0.35, 0.5]} k={k} /><Etiket k={k} text="AKÇE · OSMANLI GÜMÜŞ PARASI" /></> },
  { at: 29.2, ton: "belge", mum: [540, 960], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.akce} a={[1.7, 0.72, 0.5]} b={[1.9, 0.72, 0.5]} k={k} /><Muhur k={k} text="MAAŞ" /></> },
  // ── المدرسة ──
  { at: 30.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.saraykadin} a={[1.0, 0.5, 0.45]} b={[1.25, 0.5, 0.3]} k={k} depth={0.1} /> },
  { at: 32.9, ton: "sicak", mum: [500, 900], fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.borduur} a={[1.4, 0.5, 0.62]} b={[1.15, 0.5, 0.55]} k={k} /><Etiket k={k} text="NAKIŞ · VANMOUR" /></> },
  { at: 34.1, ton: "sicak", fx: "toz", r: (t, k) => <Tablo im={I.maaltijd} a={[1.3, 0.75, 0.55]} b={[1.5, 0.82, 0.55]} k={k} /> },
  { at: 35.1, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.kraam} a={[1.15, 0.8, 0.5]} b={[1.3, 0.55, 0.5]} k={k} /> },
  // ── المفاجأة: الطلعة والزواج ──
  { at: 37.1, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.asseki} a={[2.4, 0.47, 0.3]} b={[2.8, 0.47, 0.29]} k={k} depth={0.12} /> },
  { at: 39.2, ton: "soguk", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.kapi} a={[1.0, 0.3, 0.5]} b={[1.15, 0.55, 0.5]} k={k} /> },
  { at: 41.9, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <><Serit im={I.gelin} k={k} /><Etiket k={k} text="OSMANLI GELİN ALAYI · 16. YY" y={1180} /></> },
  { at: 44.7, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.panorama} a={[1.0, 0.15, 0.5]} b={[1.0, 0.75, 0.5]} k={k} /><Etiket k={k} text="İSTANBUL · C. BOSSOLI, 1854" /></> },
  // ── سؤال الفريقين ──
  { at: 48.5, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 53.2, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.kraam} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><Abone k={rmp(t, 55.3, 56.2)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["hapishane", "asla", "kafes", "maaş", "okul", "çeyiz", "evlendir", "gelin"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < SHOTS.length; i++) if (t >= SHOTS[i].at) n = i;
  const s = SHOTS[n];
  const to = n + 1 < SHOTS.length ? SHOTS[n + 1].at : END;
  const k = rmp(t, s.at, to);
  const flash = 1 - rmp(t, s.at, s.at + 0.12);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: 1 - rmp(t, END - 0.6, END) }}>
        {s.r(t, k)}
        {s.fx === "duman" && <Duman t={t} />}
        {s.fx === "toz" && <Toz t={t} />}
        <Grade t={t} ton={s.ton} mum={s.mum} />
        <Sizinti k={rmp(t, s.at - 0.05, s.at + 0.35)} />
        {n > 0 && flash > 0 && <AbsoluteFill style={{ background: "#FFF3D6", opacity: flash * 0.35 }} />}
        <Gren frame={frame} />
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 2.0]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-02.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
