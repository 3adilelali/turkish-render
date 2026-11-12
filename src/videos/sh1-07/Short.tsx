import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-07-words.json";
import { Altyazi, Ates, Cerceve, chunk, Ciz, Duman, Etiket, ez, Gren, Grade, HH, Img2, Muhur, rmp, Sizinti, Tablo, Ton, Toz, W, Wd } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #7 (Canlı Tablo) · «Yeniçeriler evlenemezdi»
// الكسر: المنع كان بالبداية، وخفّ بآخر القرن 16، والإنكشارية تزوّجوا وفتحوا دكاكين وصاروا حرفيين بالقرن 17.
// المراجع: İ.H. Uzunçarşılı, Kapıkulu Ocakları؛ C. Kafadar, «Yeniçeri-Esnaf Relations» (1981). الصور: public/img/sh1-07/المصادر.txt

const D = "img/sh1-07/";
const I = {
  aga: { src: D + "aga.jpg", cut: D + "aga_cut.png", w: 1911, h: 2400 },
  asker: { src: D + "asker.jpg", cut: D + "asker_cut.png", w: 1924, h: 2400 },
  alay: { src: D + "alay.jpg", w: 2400, h: 1727 },
  yeniceri: { src: D + "yeniceri.jpg", w: 822, h: 1080 },
  subay: { src: D + "subay.jpg", w: 1394, h: 2100 },
  ahmed: { src: "img/sh1-02/ahmed.jpg", cut: "img/sh1-02/ahmed_cut.png", w: 1881, h: 2400 },
  kraam: { src: "img/sh1-02/kraam.jpg", w: 2400, h: 1473 },
  pazar: { src: "img/sh1-04/pazar.jpg", w: 1174, h: 1596 },
  prez2: { src: "img/sh1-05/prez2.jpg", w: 640, h: 480 },
  kahvehane: { src: "img/sh1-05/kahvehane.jpg", w: 2400, h: 1490 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_07_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; ates?: boolean; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.kraam} a={[1.2, 0.4, 0.5]} b={[1.3, 0.45, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.kahvehane} a={[1.1, 0.5, 0.5]} b={[1.2, 0.55, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="EVLİLİK Mİ?" c="#FF8FB0" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="TİCARET Mİ?" c="#FFD65A" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 130, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.asker} a={[1.8, 0.5, 0.2]} b={[1.4, 0.5, 0.25]} k={k} depth={0.1} /><Muhur k={rmp(t, 0.9, 2.5)} text="YASAK" y={180} /></> },
  { at: 2.5, ton: "gece", fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.kraam} a={[1.4, 0.3, 0.5]} b={[1.6, 0.4, 0.5]} k={k} /> },
  { at: 5.2, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.alay} a={[1.1, 0.15, 0.55]} b={[1.3, 0.35, 0.55]} k={k} /><Etiket k={k} text="SARAY YOLUNDA · VANMOUR, 1727" /></> },
  { at: 8.1, ton: "gece", mum: [540, 700], fx: "duman", r: (t, k) => <Tablo im={I.ahmed} a={[1.5, 0.42, 0.25]} b={[1.25, 0.42, 0.3]} k={k} depth={0.1} /> },
  { at: 10.4, ton: "gece", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.yeniceri} a={[1.1, 0.5, 0.5]} b={[1.35, 0.5, 0.3]} k={k} /> },
  { at: 12.2, ton: "sicak", mum: [540, 700], fx: "toz", r: (t, k) => <><Tablo im={I.aga} a={[1.1, 0.5, 0.5]} b={[1.4, 0.5, 0.25]} k={k} depth={0.1} /><Etiket k={k} text="YENİÇERİ AĞASI · VANMOUR" /></> },
  // ── الكسر ──
  { at: 14.3, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.asker} a={[1.2, 0.5, 0.4]} b={[1.35, 0.5, 0.3]} k={k} depth={0.1} /><Ciz k={k} text="YASAK" y={180} /></> },
  { at: 17.6, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.subay} a={[1.05, 0.5, 0.5]} b={[1.3, 0.5, 0.3]} k={k} /><Etiket k={k} text="16. YÜZYILIN SONU" /></> },
  { at: 20.1, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.aga} a={[2.0, 0.5, 0.2]} b={[2.2, 0.5, 0.18]} k={k} depth={0.1} /> },
  { at: 23.3, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "ding", r: (t, k) => <Tablo im={I.kraam} a={[1.1, 0.6, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /> },
  { at: 26.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.pazar} a={[1.05, 0.5, 0.5]} b={[1.3, 0.4, 0.55]} k={k} /> },
  { at: 28.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Cerceve im={I.prez2} k={k} y={480} width={1040} zoom={[1, 1.25]} /> },
  { at: 31.7, ton: "sicak", mum: [540, 900], fx: "toz", r: (t, k) => <><Tablo im={I.kahvehane} a={[1.4, 0.3, 0.5]} b={[1.2, 0.6, 0.5]} k={k} /><Muhur k={k} text="ESNAF" y={480} /></> },
  { at: 35.5, ton: "kan", fx: "duman", ates: true, sfx: "boom", r: (t, k) => <Tablo im={I.asker} a={[1.5, 0.5, 0.25]} b={[1.9, 0.5, 0.2]} k={k} depth={0.12} /> },
  // ── سؤال الفريقين ──
  { at: 38.9, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 44.2, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.kahvehane} a={[1.2, 0.5, 0.5]} b={[1.3, 0.55, 0.5]} k={k} /><Abone k={rmp(t, 46.0, 46.8)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["evlenemezdi", "sürmedi", "gevşedi", "evlendi", "dükkân", "esnaf", "sonunu"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short07: React.FC = () => {
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
        {s.ates && <Ates t={t} k={rmp(k, 0, 0.2)} />}
        <Sizinti k={rmp(t, s.at - 0.05, s.at + 0.35)} />
        {n > 0 && flash > 0 && <AbsoluteFill style={{ background: "#FFF3D6", opacity: flash * 0.35 }} />}
        <Gren frame={frame} />
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 2.5]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-07.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
