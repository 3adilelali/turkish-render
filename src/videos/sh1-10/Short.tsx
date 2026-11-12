import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-10-words.json";
import { Altyazi, Belge, chunk, Duman, Etiket, ez, Gren, Grade, HH, Img2, Mektup, Muhur, Perde, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #10 (Canlı Tablo) · «Osmanlı kadını evden çıkamazdı»
// الكسر: مكاتيب الليدي ماري مونتاغو (إسطنبول وأدرنة 1717): الفراجة واليشمك، والسوق والحمام والمسيرة، وجملتها المشهورة.
// المرجع: Lady Mary Wortley Montagu, Turkish Embassy Letters (Letter XXIX, Adrianople, 1 April 1717). الصور: public/img/sh1-10/المصادر.txt

const D = "img/sh1-10/";
const I = {
  montagu: { src: D + "montagu.jpg", w: 2400, h: 1820 },
  jervas: { src: D + "jervas.jpg", cut: D + "jervas_cut.png", w: 789, h: 1422 },
  highmore: { src: D + "highmore.jpg", w: 1942, h: 2400 },
  vrouw: { src: "img/sh1-02/vrouw.jpg", cut: "img/sh1-02/vrouw_cut.png", w: 1784, h: 2400 },
  kraam: { src: "img/sh1-02/kraam.jpg", w: 2400, h: 1473 },
  borduur: { src: "img/sh1-02/borduur.jpg", w: 1868, h: 2400 },
  panorama: { src: "img/sh1-02/panorama.jpg", w: 2400, h: 714 },
  maaltijd: { src: "img/sh1-02/maaltijd.jpg", w: 2400, h: 1839 },
  pazar: { src: "img/sh1-04/pazar.jpg", w: 1174, h: 1596 },
  kadinkahve: { src: "img/sh1-05/kadinkahve.jpg", w: 2400, h: 1508 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_10_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.22, width: W, height: HH }}><Tablo im={I.highmore} a={[1.2, 0.5, 0.32]} b={[1.3, 0.5, 0.32]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.pazar} a={[1.1, 0.6, 0.4]} b={[1.2, 0.6, 0.4]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="HAKLIYDI" c="#FFD65A" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="ABARTIYOR" c="#FF4A3D" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 140, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const SOZ = "Türk kadınlarını, imparatorluğun tek özgür insanları olarak görüyorum.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.vrouw} a={[1.6, 0.48, 0.2]} b={[1.4, 0.48, 0.24]} k={k} depth={0.1} /><Perde close={0.5 * rmp(k, 0.2, 0.9)} /></> },
  { at: 2.8, ton: "gece", fx: "duman", sfx: "whoosh", r: (t, k) => <><Tablo im={I.pazar} a={[1.2, 0.5, 0.45]} b={[1.4, 0.55, 0.4]} k={k} /><Muhur k={k} text="YASAK" y={180} /></> },
  { at: 4.4, ton: "gece", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.panorama} a={[1.0, 0.15, 0.5]} b={[1.0, 0.5, 0.5]} k={k} /> },
  { at: 7.6, ton: "gece", mum: [540, 900], fx: "duman", r: (t, k) => <Tablo im={I.borduur} a={[1.3, 0.5, 0.5]} b={[1.5, 0.5, 0.45]} k={k} /> },
  // ── الكسر ──
  { at: 9.2, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.montagu} a={[1.3, 0.45, 0.5]} b={[1.1, 0.45, 0.5]} k={k} /><Yil k={k} yil={1717} y={180} /><Etiket k={k} text="LADY MONTAGU İSTANBUL'DA · VANMOUR" /></> },
  { at: 13.5, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.jervas} a={[1.1, 0.5, 0.5]} b={[1.4, 0.5, 0.25]} k={k} depth={0.1} /><Etiket k={k} text="LADY MARY WORTLEY MONTAGU · C. JERVAS" /></> },
  { at: 15.9, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.highmore} a={[1.2, 0.5, 0.4]} b={[1.3, 0.5, 0.4]} k={k} bgBlur={8} /><AbsoluteFill style={{ background: "rgba(10,6,3,.45)" }} /><Mektup k={rmp(t, 15.9, 19.2)} text="İstanbul, 1717…" /></> },
  { at: 19.2, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.pazar} a={[1.7, 0.72, 0.35]} b={[1.9, 0.72, 0.3]} k={k} /> },
  { at: 23.8, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kadinkahve} a={[1.3, 0.35, 0.55]} b={[1.5, 0.5, 0.55]} k={k} /><Etiket k={k} text="KAHVE İÇEN KADINLAR · VANMOUR" /></> },
  { at: 26.4, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <Tablo im={I.maaltijd} a={[1.2, 0.3, 0.5]} b={[1.4, 0.45, 0.5]} k={k} /> },
  { at: 29.1, ton: "belge", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.montagu} a={[1.5, 0.5, 0.45]} b={[1.6, 0.5, 0.45]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={rmp(t, 29.1, 36.5)} text={SOZ} src="Lady M. W. Montagu, Mektup, Edirne, 1 Nisan 1717" typed={rmp(t, 31.4, 36.2)} tag="📜 MONTAGU'NUN MEKTUBU" /></> },
  // ── سؤال الفريقين ──
  { at: 36.5, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 40.4, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.montagu} a={[1.2, 0.45, 0.5]} b={[1.3, 0.45, 0.5]} k={k} /><Abone k={rmp(t, 41.9, 42.7)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["çıkamazdı", "yasaktı", "erkeklerindi", "özgür", "kimse", "sahipti"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short10: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 2.8]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-10.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
