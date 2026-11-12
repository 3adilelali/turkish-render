import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-09-words.json";
import { Altyazi, Belge, chunk, Duman, Etiket, ez, Gren, Grade, Harita, HH, Img2, Muhur, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #9 (Canlı Tablo) · «Gemiler karadan yürümez, bu bir efsane»
// الكسر: يوميات نيكولو باربارو (طبيب بندقي جوّا المدينة): 22 نيسان 1453 السفن العثمانية صارت جوّا الخليج ورا السلسلة، 72 سفينة.
// المراجع: Nicolò Barbaro, Giornale dell'assedio di Costantinopoli 1453؛ Kritovoulos. الصور: public/img/sh1-09/المصادر.txt

const D = "img/sh1-09/";
const I = {
  fetih: { src: D + "fetih.jpg", w: 1600, h: 1112 },
  kusatma: { src: D + "kusatma.jpg", w: 700, h: 506 },
  kapi: { src: D + "kapi.jpg", w: 903, h: 1224 },
  fatih: { src: D + "fatih.jpg", w: 1776, h: 2400 },
  dusus: { src: D + "dusus.jpg", w: 2400, h: 1932 },
  zincir: { src: D + "zincir.jpg", w: 1600, h: 1200 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_09_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * -half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.kusatma} a={[1.0, 0.45, 0.5]} b={[1.08, 0.5, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateY(${(1 - e) * half}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.22, width: W, height: HH }}><Tablo im={I.fatih} a={[1.4, 0.55, 0.35]} b={[1.5, 0.55, 0.35]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="DEHA MI?" c="#FFD65A" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="KUMAR MI?" c="#FF4A3D" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 140, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const BARBARO = "22 Nisan 1453: Türkler gemilerini karadan geçirip Haliç'e indirdi. Barbaro 72 gemi saydı.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.kusatma} a={[1.5, 0.3, 0.5]} b={[1.2, 0.35, 0.5]} k={k} /><Muhur k={rmp(t, 0.7, 2.2)} text="EFSANE" y={180} /></> },
  { at: 2.2, ton: "gece", fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.fetih} a={[1.2, 0.15, 0.5]} b={[1.4, 0.35, 0.5]} k={k} /> },
  { at: 5.5, ton: "gece", mum: [540, 700], fx: "duman", r: (t, k) => <Tablo im={I.fatih} a={[1.35, 0.52, 0.45]} b={[1.55, 0.52, 0.43]} k={k} /> },
  { at: 7.8, ton: "kan", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.fetih} a={[1.6, 0.8, 0.5]} b={[1.8, 0.75, 0.5]} k={k} /> },
  { at: 9.5, ton: "gece", fx: "toz", r: (t, k) => <Tablo im={I.kapi} a={[1.1, 0.5, 0.4]} b={[1.3, 0.5, 0.35]} k={k} /> },
  // ── الكسر ──
  { at: 10.7, ton: "belge", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.dusus} a={[1.0, 0.5, 0.5]} b={[1.2, 0.6, 0.4]} k={k} /><Etiket k={k} text="KUŞATMA HARİTASI · ZOGRAFOS" /></> },
  { at: 14.5, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.dusus} a={[1.3, 0.4, 0.5]} b={[1.4, 0.45, 0.5]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={BARBARO} src="Nicolò Barbaro, Kuşatma Günlüğü, 1453" typed={rmp(k, 0.06, 0.75)} quote={false} tag="📜 BARBARO GÜNLÜĞÜ" /></> },
  { at: 18.8, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.dusus} a={[1.6, 0.7, 0.3]} b={[1.8, 0.7, 0.35]} k={k} /><Yil k={k} yil={1453} y={180} /></> },
  { at: 21.0, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <Harita k={rmp(t, 21.0, 26.0)} /> },
  { at: 24.8, ton: "belge", fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.zincir} a={[1.1, 0.5, 0.5]} b={[1.3, 0.55, 0.5]} k={k} /><Etiket k={k} text="HALİÇ ZİNCİRİ · ASKERÎ MÜZE" /></> },
  { at: 26.2, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.kusatma} a={[1.2, 0.25, 0.5]} b={[1.5, 0.4, 0.45]} k={k} /> },
  { at: 30.7, ton: "sicak", fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.kusatma} a={[1.3, 0.7, 0.5]} b={[1.45, 0.75, 0.5]} k={k} /><Muhur k={k} text="72 GEMİ" y={180} /></> },
  { at: 33.5, ton: "soguk", fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.dusus} a={[1.8, 0.6, 0.25]} b={[2.0, 0.62, 0.22]} k={k} /> },
  { at: 36.4, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.kapi} a={[1.3, 0.5, 0.45]} b={[1.1, 0.5, 0.5]} k={k} /><Etiket k={k} text="29 MAYIS 1453 · F. ZONARO" /></> },
  // ── سؤال الفريقين ──
  { at: 38.5, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 43.3, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.fetih} a={[1.2, 0.4, 0.5]} b={[1.3, 0.5, 0.5]} k={k} /><Abone k={rmp(t, 44.9, 45.7)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["yürümez", "efsane", "yapamaz", "zincir", "haliç", "düştü", "kumar"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short09: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 2.2]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-09.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
