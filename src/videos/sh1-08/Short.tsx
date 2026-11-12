import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-08-words.json";
import { Altyazi, Cerceve, chunk, Ciz, Duman, Etiket, ez, Gren, Grade, HH, Img2, Muhur, Murekkep, rmp, Sizinti, Tablo, Ton, Toz, W, Wd } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #8 (Canlı Tablo) · «Osmanlı padişahları okuma yazma bilmezdi»
// الكسر: ياووز سليم ديوان فارسي، والقانوني «محبّي»، وأحمد التالت خطّاط، ومحمود التاني ألواح خط بتوقيعه.
// المراجع: Yavuz Sultan Selim'in Farsça Divanı (ed. 1904)؛ Muhibbî Divanı؛ Ş. Rado, Türk Hattatları. الصور: public/img/sh1-08/المصادر.txt

const D = "img/sh1-08/";
const I = {
  selim: { src: D + "selim.jpg", w: 1510, h: 2400 },
  levha: { src: D + "levha.jpg", w: 2400, h: 1463 },
  mahmud: { src: D + "mahmud.jpg", w: 1149, h: 2400 },
  tugra: { src: D + "tugra.jpg", w: 1024, h: 1682 },
  berat: { src: D + "berat.jpg", w: 850, h: 2400 },
  bayezid: { src: D + "bayezid.jpg", w: 1550, h: 2400 },
  divan: { src: "img/sh1-01/divan.jpg", w: 1920, h: 1536 },
  sulBust: { src: "img/sh1-01/sul_bust.jpg", cut: "img/sh1-01/sul_bust_cut.png", w: 2000, h: 2386 },
  ahmed: { src: "img/sh1-02/ahmed.jpg", cut: "img/sh1-02/ahmed_cut.png", w: 1881, h: 2400 },
  asker: { src: "img/sh1-07/asker.jpg", w: 1924, h: 2400 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_08_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.asker} a={[1.2, 0.5, 0.35]} b={[1.3, 0.5, 0.35]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.levha} a={[1.0, 0.5, 0.5]} b={[1.1, 0.5, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="KILIÇ ⚔️" c="#FF4A3D" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="KALEM ✒️" c="#FFD65A" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 140, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.selim} a={[1.6, 0.5, 0.3]} b={[1.25, 0.5, 0.35]} k={k} /><Muhur k={rmp(t, 1.6, 3.3)} text="CAHİL" y={180} /></> },
  { at: 3.3, ton: "kan", fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.asker} a={[1.3, 0.5, 0.3]} b={[1.6, 0.5, 0.25]} k={k} /> },
  { at: 7.1, ton: "gece", mum: [540, 800], fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.bayezid} a={[1.6, 0.5, 0.7]} b={[1.9, 0.45, 0.72]} k={k} /> },
  { at: 9.0, ton: "gece", fx: "toz", r: (t, k) => <Tablo im={I.sulBust} a={[1.3, 0.5, 0.5]} b={[1.5, 0.5, 0.45]} k={k} depth={0.1} /> },
  // ── الكسر ──
  { at: 10.2, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.bayezid} a={[1.0, 0.5, 0.5]} b={[1.2, 0.5, 0.35]} k={k} /><Ciz k={rmp(t, 10.2, 12.4)} text="CAHİL" y={180} /></> },
  { at: 13.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.selim} a={[1.05, 0.5, 0.5]} b={[1.35, 0.5, 0.3]} k={k} /><Etiket k={k} text="YAVUZ SULTAN SELİM · FARSÇA DİVAN" /></> },
  { at: 17.1, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Cerceve im={I.divan} k={k} y={480} /><Etiket k={k} text="MUHİBBÎ DİVANI · KANUNİ'NİN ŞİİRLERİ" y={1150} /></> },
  { at: 20.9, ton: "sicak", mum: [540, 700], fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.ahmed} a={[1.05, 0.42, 0.5]} b={[1.35, 0.42, 0.25]} k={k} depth={0.1} /><Etiket k={k} text="III. AHMED · HATTAT PADİŞAH" /></> },
  { at: 22.6, ton: "belge", fx: "toz", sfx: "ding", r: (t, k) => <Tablo im={I.berat} a={[1.15, 0.5, 0.04]} b={[1.4, 0.5, 0.06]} k={k} /> },
  { at: 24.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.mahmud} a={[1.1, 0.5, 0.5]} b={[1.4, 0.5, 0.25]} k={k} /><Etiket k={k} text="II. MAHMUD" /></> },
  { at: 25.9, ton: "belge", mum: [540, 900], fx: "toz", sfx: "ding", r: (t, k) => <><Cerceve im={I.levha} k={k} y={520} /><Etiket k={k} text="II. MAHMUD İMZALI HAT LEVHASI" y={1150} /></> },
  { at: 27.5, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.berat} a={[1.4, 0.5, 0.3]} b={[1.4, 0.5, 0.8]} k={k} /><Murekkep k={rmp(t, 29.9, 31.6)} text="Kalem" y={180} /></> },
  // ── سؤال الفريقين ──
  { at: 32.0, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 37.2, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.levha} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><Abone k={rmp(t, 38.7, 39.5)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["bilmezdi", "yazamazlardı", "divan", "şiir", "hattat", "kalem", "kılıç"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short08: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 3.3]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-08.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
