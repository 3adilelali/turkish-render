import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-04-words.json";
import { Altyazi, Belge, chunk, Duman, Etiket, ez, Gren, Grade, Halka, HH, Img2, Muhur, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #4 (Canlı Tablo) · «Osmanlı kadını hiçbir şeye sahip olamazdı»
// الكسر: دفتر أوقاف إسطنبول 1546 (أكتر من التلت مؤسّسات نسوان)، ودعاوى الميراث عند القاضي، وأوقاف مهرماه وهرّم.
// المراجع: Ö.L. Barkan & E.H. Ayverdi, İstanbul Vakıfları Tahrir Defteri 953 (1546) Tarihli (1970)؛ H. Gerber؛ R. Jennings. الصور: public/img/sh1-04/المصادر.txt

const D = "img/sh1-04/";
const I = {
  mihrimah: { src: D + "mihrimah.jpg", cut: D + "mihrimah_cut.png", w: 1376, h: 2000 },
  mihrimah2: { src: D + "mihrimah2.jpg", cut: D + "mihrimah2_cut.png", w: 2005, h: 2400 },
  uskudar: { src: D + "uskudar.jpg", w: 2400, h: 1598 },
  haseki: { src: D + "haseki.jpg", w: 1454, h: 2400 },
  haseki2: { src: D + "haseki2.jpg", w: 2400, h: 1597 },
  pazar: { src: D + "pazar.jpg", w: 1174, h: 1596 },
  avrupa: { src: D + "avrupa.jpg", w: 576, h: 685 },
  hurrem: { src: "img/sh1-01/hurrem.jpg", cut: "img/sh1-01/hurrem_cut.png", w: 955, h: 1182 },
  vrouw: { src: "img/sh1-02/vrouw.jpg", cut: "img/sh1-02/vrouw_cut.png", w: 1784, h: 2400 },
  kraam: { src: "img/sh1-02/kraam.jpg", w: 2400, h: 1473 },
  panorama: { src: "img/sh1-02/panorama.jpg", w: 2400, h: 714 },
  akce: { src: "img/sh1-02/akce.jpg", w: 2400, h: 1048 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_04_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * -half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.22, width: W, height: HH }}><Tablo im={I.mihrimah} a={[1.2, 0.5, 0.25]} b={[1.3, 0.5, 0.25]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.avrupa} a={[1.05, 0.5, 0.35]} b={[1.15, 0.5, 0.35]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="OSMANLI MI?" c="#FFD65A" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="AVRUPA MI?" c="#7FC4FF" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 140, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const DEFTER = "1546 İstanbul vakıf defteri: vakıf kurucularının üçte birinden fazlası kadındır.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.mihrimah2} a={[1.5, 0.5, 0.32]} b={[1.2, 0.5, 0.36]} k={k} depth={0.1} /> },
  { at: 3.9, ton: "gece", mum: [600, 700], fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.pazar} a={[1.1, 0.5, 0.5]} b={[1.35, 0.55, 0.4]} k={k} /> },
  { at: 6.2, ton: "kan", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.akce} a={[1.6, 0.28, 0.5]} b={[1.8, 0.28, 0.5]} k={k} /><Muhur k={rmp(t, 7.0, 9.2)} text="0 AKÇE" /></> },
  { at: 9.2, ton: "gece", mum: [540, 700], fx: "duman", r: (t, k) => <Tablo im={I.vrouw} a={[1.4, 0.48, 0.2]} b={[1.6, 0.48, 0.17]} k={k} depth={0.1} /> },
  // ── الكسر ──
  { at: 10.6, ton: "sicak", fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.panorama} a={[1.0, 0.1, 0.5]} b={[1.0, 0.6, 0.5]} k={k} /><Etiket k={k} text="İSTANBUL · C. BOSSOLI, 1854" /></> },
  { at: 15.6, ton: "belge", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.haseki} a={[1.1, 0.5, 0.3]} b={[1.25, 0.5, 0.5]} k={k} /><Yil k={k} yil={1546} y={260} /></> },
  { at: 17.5, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.haseki} a={[1.3, 0.5, 0.55]} b={[1.4, 0.5, 0.6]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={DEFTER} src="Barkan & Ayverdi, İstanbul Vakıfları Tahrir Defteri (1970)" typed={rmp(k, 0.06, 0.6)} quote={false} tag="📜 VAKIF DEFTERİ" /></> },
  { at: 19.5, ton: "sicak", mum: [540, 700], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.kraam} a={[1.2, 0.4, 0.5]} b={[1.3, 0.5, 0.5]} k={k} bgBlur={6} /><AbsoluteFill style={{ background: "rgba(10,6,3,.45)" }} /><Halka k={k} oran={0.36} text="3'TE 1+" alt="KURUCU KADIN" y={300} /></> },
  { at: 23.2, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.pazar} a={[1.6, 0.4, 0.55]} b={[1.4, 0.45, 0.5]} k={k} /> },
  { at: 26.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.kraam} a={[1.5, 0.15, 0.5]} b={[1.7, 0.25, 0.5]} k={k} /> },
  { at: 30.0, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.kraam} a={[1.5, 0.75, 0.5]} b={[1.65, 0.7, 0.5]} k={k} /><Muhur k={k} text="KAZANDI" y={500} /></> },
  { at: 32.1, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.mihrimah} a={[1.05, 0.5, 0.5]} b={[1.35, 0.5, 0.25]} k={k} depth={0.1} /><Etiket k={k} text="MİHRİMAH SULTAN" /></> },
  { at: 33.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.uskudar} a={[1.0, 0.3, 0.5]} b={[1.15, 0.55, 0.45]} k={k} /><Etiket k={k} text="MİHRİMAH SULTAN CAMİİ · ÜSKÜDAR" /></> },
  { at: 35.2, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.haseki2} a={[1.0, 0.35, 0.5]} b={[1.15, 0.6, 0.5]} k={k} /><Etiket k={k} text="HASEKİ KÜLLİYESİ · İMARET VE DARÜŞŞİFA" /></> },
  { at: 37.7, ton: "sicak", mum: [540, 700], fx: "toz", r: (t, k) => <Tablo im={I.hurrem} a={[1.2, 0.5, 0.4]} b={[1.5, 0.5, 0.36]} k={k} depth={0.1} /> },
  // ── سؤال الفريقين ──
  { at: 39.4, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 44.9, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.uskudar} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><Abone k={rmp(t, 46.3, 47.1)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["hiçbir", "kuruş", "kadındı", "dava", "kazandı", "kendi", "güçlü"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short04: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 3.9]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-04.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
