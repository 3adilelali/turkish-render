import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-06-words.json";
import { Altyazi, Belge, Cerceve, chunk, Duman, Etiket, ez, Grafik, Gren, Grade, HH, Img2, Muhur, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #6 (Canlı Tablo) · «Lale Devri'nde bir lale bir ev fiyatınaydı»
// الكسر: جنون اللالا (بصلة بسعر بيت) كان بهولندا 1637، وأحمد التالت 1726 حط تسعيرة (narh) لكل نوع.
// المراجع: Ahmed Refik, Lâle Devri؛ A. Goldgar, Tulipmania (2007). الصور: public/img/sh1-06/المصادر.txt

const D = "img/sh1-06/";
const I = {
  brueghel: { src: D + "brueghel.jpg", w: 1200, h: 767 },
  alegori: { src: D + "alegori.jpg", w: 1649, h: 1032 },
  semper: { src: D + "semper.jpg", w: 1460, h: 2400 },
  tooneel: { src: D + "tooneel.jpg", w: 1348, h: 1747 },
  tulpen: { src: D + "tulpen.jpg", w: 2400, h: 1790 },
  surname: { src: D + "surname.jpg", w: 1776, h: 1392 },
  iznik: { src: D + "iznik.jpg", w: 2400, h: 2399 },
  ahmed: { src: "img/sh1-02/ahmed.jpg", cut: "img/sh1-02/ahmed_cut.png", w: 1881, h: 2400 },
  panorama: { src: "img/sh1-02/panorama.jpg", w: 2400, h: 714 },
  maaltijd: { src: "img/sh1-02/maaltijd.jpg", w: 2400, h: 1839 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_06_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * -half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.surname} a={[1.0, 0.5, 0.5]} b={[1.1, 0.6, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.iznik} a={[1.0, 0.5, 0.5]} b={[1.12, 0.5, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="ZEVK Ü SEFA" c="#FF4A3D" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="SANAT ÇAĞI" c="#7FC4FF" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 130, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const FERMAN = "Lale soğanlarına tür tür resmî fiyat (narh) konuldu; fazlasına satan cezalandırılacaktı.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.semper} a={[1.6, 0.5, 0.3]} b={[1.2, 0.5, 0.4]} k={k} /><Muhur k={rmp(t, 3.6, 5.2)} text="1 EV!" y={1480} /></> },
  { at: 5.2, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.surname} a={[1.3, 0.3, 0.5]} b={[1.5, 0.45, 0.5]} k={k} /><Etiket k={k} text="SURNÂME-İ HÜMAYUN · İSTANBUL" /></> },
  { at: 7.8, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.ahmed} a={[1.6, 0.42, 0.25]} b={[1.3, 0.42, 0.3]} k={k} depth={0.1} /> },
  { at: 10.7, ton: "gece", fx: "toz", r: (t, k) => <Tablo im={I.iznik} a={[1.6, 0.45, 0.45]} b={[1.9, 0.45, 0.4]} k={k} /> },
  // ── الكسر: هولندا ──
  { at: 12.1, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <Tablo im={I.tulpen} a={[1.6, 0.28, 0.45]} b={[1.2, 0.3, 0.5]} k={k} /> },
  { at: 15.4, ton: "soguk", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.panorama} a={[1.0, 0.7, 0.5]} b={[1.0, 0.4, 0.5]} k={k} /> },
  { at: 17.2, ton: "belge", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.brueghel} a={[1.1, 0.2, 0.5]} b={[1.3, 0.35, 0.55]} k={k} /><Etiket k={k} text="LALE ÇILGINLIĞI HİCVİ · J. BRUEGHEL, 1640" /></> },
  { at: 19.2, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Cerceve im={I.tooneel} k={k} y={250} width={760} /><Yil k={k} yil={1637} y={20} /><Etiket k={k} text="AMSTERDAM LALE BROŞÜRÜ, 1637" y={1500} /></> },
  { at: 21.6, ton: "sicak", mum: [540, 700], fx: "toz", r: (t, k) => <Tablo im={I.semper} a={[1.1, 0.5, 0.5]} b={[1.35, 0.5, 0.25]} k={k} /> },
  { at: 23.8, ton: "kan", fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.alegori} a={[1.3, 0.5, 0.5]} b={[1.45, 0.55, 0.5]} k={k} bgBlur={8} /><AbsoluteFill style={{ background: "rgba(10,6,3,.4)" }} /><Grafik k={rmp(t, 23.6, 26.4)} label="1 LALE SOĞANI" /></> },
  // ── إسطنبول ──
  { at: 26.7, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.panorama} a={[1.0, 0.2, 0.5]} b={[1.0, 0.45, 0.5]} k={k} /> },
  { at: 29.2, ton: "sicak", mum: [540, 700], fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.ahmed} a={[1.05, 0.42, 0.5]} b={[1.3, 0.42, 0.25]} k={k} depth={0.1} /><Yil k={k} yil={1726} y={180} /><Etiket k={k} text="III. AHMED · J.B. VANMOUR" /></> },
  { at: 32.0, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.iznik} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={FERMAN} src="III. Ahmed fermanı, 1726 · Ahmed Refik, Lâle Devri" typed={rmp(k, 0.05, 0.6)} quote={false} tag="📜 FERMAN" /></> },
  { at: 37.7, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.surname} a={[1.1, 0.7, 0.5]} b={[1.3, 0.6, 0.45]} k={k} /><Muhur k={k} text="İZİN YOK" y={500} /></> },
  // ── سؤال الفريقين ──
  { at: 41.8, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 47.1, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.tulpen} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><Abone k={rmp(t, 48.6, 49.4)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["ev", "çöktü", "hollanda", "değildi", "ferman", "izin", "çılgınlığa"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short06: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 5.2]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-06.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
