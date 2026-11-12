import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-01-words.json";
import { Altyazi, Belge, Cerceve, chunk, Duman, Etiket, ez, Gren, Grade, HH, Img2, Kar, rmp, Sizinti, Tablo, Ton, Toz, W, Wd } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت جديد #1 (Canlı Tablo) · «Hürrem, Kanuni'yi büyüyle bağladı»
// الشائعة بتنحكى بالأول كأنها حقيقة، والكسر بالنص بالوثايق: مكتوب هيام، وديوان محبّي، والنكاح.
// المصدر الأساسي: Luigi Bassano, «Costumi et i modi particolari della vita de' Turchi» (1545) عبر L. Peirce, The Imperial Harem.
// الصور كلها ملكية عامة/CC0: public/img/sh1-01/المصادر.txt

const D = "img/sh1-01/";
const I = {
  hurrem: { src: D + "hurrem.jpg", cut: D + "hurrem_cut.png", w: 955, h: 1182 },
  hurrem2: { src: D + "hurrem2.jpg", cut: D + "hurrem2_cut.png", w: 843, h: 1024 },
  sulBust: { src: D + "sul_bust.jpg", cut: D + "sul_bust_cut.png", w: 2000, h: 2386 },
  sulStand: { src: D + "sul_stand.jpg", w: 2400, h: 3158 },
  sulname: { src: D + "sulname.jpg", w: 1489, h: 2176 },
  saray: { src: D + "saray.jpg", w: 3702, h: 2883 },
  tatar: { src: D + "tatar.jpg", w: 1532, h: 935 },
  pazar: { src: D + "pazar.jpg", w: 2214, h: 1478 },
  muhur: { src: D + "muhur.jpg", w: 2081, h: 1771 },
  mektup: { src: D + "mektup.jpg", w: 1123, h: 1094 },
  divan: { src: D + "divan.jpg", w: 1920, h: 1536 },
  gece: { src: D + "gece.jpg", w: 2922, h: 1746 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_01_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz" | "kar"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

// ikili portre: hem soru hem nikâh sahnesi
const Ikili: React.FC<{ k: number; top: string; bot: string; split?: boolean }> = ({ k, top, bot, split }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.24, width: W, height: HH }}><Tablo im={I.hurrem} a={[1.15, 0.5, 0.36]} b={[1.28, 0.5, 0.34]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.sulBust} a={[1.1, 0.5, 0.6]} b={[1.2, 0.5, 0.6]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      {split && (
        <>
          <Lbl y={110} text={top} c="#FF4A3D" k={rmp(k, 0.08, 0.3)} />
          <Lbl y={HH - 300} text={bot} c="#FFD65A" k={rmp(k, 0.2, 0.42)} />
        </>
      )}
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 150, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const BASSANO = "Padişah onu öyle seviyor ki, halk ona büyü yaptığını söylüyor.";

const SHOTS: Shot[] = [
  // ── الشائعة (كأنها حقيقة) ──
  { at: 0, ton: "kan", mum: [540, 1250], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.hurrem} a={[1.55, 0.5, 0.38]} b={[1.3, 0.5, 0.38]} k={k} depth={0.1} /> },
  { at: 2.6, ton: "gece", mum: [300, 700], fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.hurrem2} a={[1.2, 0.45, 0.4]} b={[1.5, 0.45, 0.36]} k={k} depth={0.1} /> },
  { at: 4.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.saray} a={[1.0, 0.3, 0.5]} b={[1.12, 0.62, 0.5]} k={k} /><Etiket k={k} text="TOPKAPI SARAYI" /></> },
  { at: 7.1, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.saray} a={[1.25, 0.6, 0.45]} b={[1.35, 0.66, 0.45]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.45)" }} /><Belge k={k} text={BASSANO} src="Luigi Bassano, İstanbul, 1545" typed={rmp(k, 0.08, 0.75)} /></> },
  // ── الأسر والسوق ──
  { at: 11.1, ton: "kan", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.tatar} a={[1.05, 0.12, 0.55]} b={[1.25, 0.2, 0.55]} k={k} /><Etiket k={k} text="TATAR AKINI · J. BRANDT" /></> },
  { at: 13.6, ton: "sicak", fx: "toz", r: (t, k) => <><Tablo im={I.pazar} a={[1.1, 0.35, 0.6]} b={[1.25, 0.5, 0.62]} k={k} /><Etiket k={k} text="İSTANBUL ESİR PAZARI" /></> },
  // ── السلطان ──
  { at: 15.4, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.sulStand} a={[1.05, 0.5, 0.7]} b={[1.25, 0.5, 0.2]} k={k} /><Etiket k={k} text="KANUNİ · MELCHIOR LORCK, 1559" /></> },
  { at: 17.9, ton: "gece", mum: [800, 600], r: (t, k) => <Tablo im={I.sulBust} a={[1.1, 0.5, 0.5]} b={[1.35, 0.5, 0.52]} k={k} depth={0.1} /> },
  // ── السؤال ──
  { at: 20.2, ton: "kan", mum: [540, 900], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.hurrem} a={[2.0, 0.48, 0.4]} b={[2.3, 0.48, 0.4]} k={k} depth={0.12} /> },
  // ── الكسر: الوثايق ──
  { at: 22.3, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.muhur} a={[1.0, 0.5, 0.5]} b={[1.2, 0.5, 0.5]} k={k} /><Etiket k={k} text="HÜRREM SULTAN'IN MÜHRÜ" /></> },
  { at: 24.9, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.mektup} a={[1.05, 0.5, 0.2]} b={[1.3, 0.5, 0.45]} k={k} /><Etiket k={k} text="HÜRREM'İN KENDİ MEKTUBU · 1549" /></> },
  { at: 27.8, ton: "belge", mum: [540, 960], fx: "toz", r: (t, k) => <Tablo im={I.mektup} a={[1.5, 0.5, 0.55]} b={[1.7, 0.45, 0.85]} k={k} /> },
  { at: 30.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.sulname} a={[1.5, 0.55, 0.2]} b={[1.2, 0.5, 0.35]} k={k} /><Etiket k={k} text="SÜLEYMANNÂME, 1558" /></> },
  { at: 33.0, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Cerceve im={I.divan} k={k} y={600} /><Etiket k={k} text="MUHİBBÎ DİVANI · KANUNİ'NİN ŞİİRLERİ" y={1120} /></> },
  { at: 35.2, ton: "sicak", mum: [540, 900], fx: "toz", r: (t, k) => <Tablo im={I.divan} a={[1.3, 0.3, 0.4]} b={[1.6, 0.36, 0.45]} k={k} /> },
  // ── النكاح ──
  { at: 38.6, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.hurrem2} a={[1.6, 0.47, 0.35]} b={[1.2, 0.47, 0.42]} k={k} depth={0.1} /> },
  { at: 41.4, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <Ikili k={k} top="" bot="" /> },
  // ── الحقيقة ──
  { at: 44.6, ton: "soguk", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.gece} a={[1.0, 0.25, 0.5]} b={[1.15, 0.6, 0.5]} k={k} /> },
  // ── سؤال التعليقات ──
  { at: 49.7, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} top="BÜYÜ MÜ?" bot="AŞK MI?" split /> },
  { at: 54.0, ton: "soguk", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.gece} a={[1.3, 0.55, 0.5]} b={[1.4, 0.6, 0.5]} k={k} /><Abone k={k} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0.05, 0.25));
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["büyü", "cadı", "aşk", "köle", "nikah", "nikâh"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short01: React.FC = () => {
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
        {s.fx === "kar" && <Kar t={t} />}
        <Grade t={t} ton={s.ton} mum={s.mum} />
        <Sizinti k={rmp(t, s.at - 0.05, s.at + 0.35)} />
        {n > 0 && flash > 0 && <AbsoluteFill style={{ background: "#FFF3D6", opacity: flash * 0.35 }} />}
        <Gren frame={frame} />
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 2.6]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-01.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
