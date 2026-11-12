import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-05-words.json";
import { Altyazi, Ates, Belge, Cerceve, chunk, Duman, Etiket, ez, Gren, Grade, HH, Img2, Muhur, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #5 (Canlı Tablo) · «Osmanlı'da kahve içmenin cezası ölümdü»
// الكسر: القهوة وصلت 1555 (Peçevî)، والمنع 1633 بعد الحريق كان عالقهاوي مش عالقهوة (Kâtib Çelebi؛ Naîmâ)، والبيوت ما وقفت.
// المراجع: Peçevî Tarihi؛ Kâtib Çelebi, Mîzânü'l-Hak؛ R. Hattox, Coffee and Coffeehouses (1985). الصور: public/img/sh1-05/المصادر.txt

const D = "img/sh1-05/";
const I = {
  kahvehane: { src: D + "kahvehane.jpg", w: 2400, h: 1490 },
  prez1: { src: D + "prez1.jpg", w: 640, h: 480 },
  prez2: { src: D + "prez2.jpg", w: 640, h: 480 },
  tiryaki: { src: D + "tiryaki.jpg", w: 1768, h: 2400 },
  cezve: { src: D + "cezve.jpg", w: 1135, h: 2400 },
  kadinkahve: { src: D + "kadinkahve.jpg", w: 2400, h: 1508 },
  kahveci: { src: D + "kahveci.jpg", w: 500, h: 712 },
  kizkahve: { src: D + "kizkahve.jpg", w: 500, h: 712 },
  murad: { src: "img/sh1-03/murad.jpg", w: 1457, h: 1700 },
  muradmin: { src: "img/sh1-03/muradmin.jpg", w: 1112, h: 1681 },
  gece: { src: "img/sh1-02/kapi.jpg", w: 2260, h: 1488 },
  panorama: { src: "img/sh1-02/panorama.jpg", w: 2400, h: 714 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_05_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; ates?: boolean; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.22, width: W, height: HH }}><Tablo im={I.murad} a={[1.1, 0.5, 0.4]} b={[1.2, 0.5, 0.38]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.kahvehane} a={[1.0, 0.5, 0.5]} b={[1.1, 0.55, 0.5]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="HAKLIYDI" c="#FFD65A" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="KAHVE DÜŞMANI" c="#FF4A3D" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 120, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const PECEVI = "1555: Halepli Hakem ve Şamlı Şems, Tahtakale'de İstanbul'un ilk kahvehanesini açtı.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 900], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.cezve} a={[1.3, 0.5, 0.4]} b={[1.05, 0.5, 0.45]} k={k} /><Muhur k={rmp(t, 1.9, 3.5)} text="İDAM" y={300} /></> },
  { at: 3.5, ton: "gece", mum: [540, 700], fx: "duman", sfx: "whoosh", r: (t, k) => <><Tablo im={I.murad} a={[1.6, 0.5, 0.35]} b={[1.3, 0.5, 0.38]} k={k} /><Etiket k={k} text="IV. MURAD" /></> },
  { at: 4.9, ton: "soguk", fx: "duman", sfx: "whoosh", r: (t, k) => <Tablo im={I.gece} a={[1.1, 0.2, 0.5]} b={[1.3, 0.4, 0.5]} k={k} /> },
  { at: 6.5, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.tiryaki} a={[1.3, 0.55, 0.3]} b={[1.6, 0.6, 0.25]} k={k} /> },
  { at: 7.9, ton: "kan", mum: [540, 700], fx: "duman", r: (t, k) => <Tablo im={I.muradmin} a={[1.5, 0.55, 0.22]} b={[1.7, 0.55, 0.2]} k={k} /> },
  { at: 9.9, ton: "gece", fx: "toz", r: (t, k) => <Tablo im={I.kahveci} a={[1.1, 0.5, 0.45]} b={[1.3, 0.5, 0.35]} k={k} /> },
  // ── الكسر ──
  { at: 11.7, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <Tablo im={I.kahvehane} a={[1.5, 0.5, 0.5]} b={[1.05, 0.5, 0.5]} k={k} /> },
  { at: 14.6, ton: "belge", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.panorama} a={[1.0, 0.2, 0.5]} b={[1.0, 0.55, 0.5]} k={k} /><Yil k={k} yil={1555} y={260} /></> },
  { at: 17.1, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kahvehane} a={[1.2, 0.3, 0.5]} b={[1.3, 0.4, 0.5]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={PECEVI} src="Peçevî İbrahim Efendi, Peçevî Tarihi" typed={rmp(k, 0.06, 0.6)} quote={false} tag="📜 PEÇEVÎ TARİHİ" /></> },
  { at: 20.9, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Cerceve im={I.prez2} k={k} y={480} width={1040} zoom={[1, 1.25]} /> },
  { at: 23.6, ton: "sicak", mum: [540, 800], fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.tiryaki} a={[1.05, 0.5, 0.6]} b={[1.25, 0.5, 0.5]} k={k} /> },
  { at: 26.3, ton: "sicak", fx: "toz", r: (t, k) => <Cerceve im={I.prez1} k={k} y={480} width={1040} zoom={[1.1, 1.3]} /> },
  { at: 27.3, ton: "kan", mum: [540, 800], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.kahvehane} a={[1.9, 0.2, 0.5]} b={[2.1, 0.25, 0.5]} k={k} /> },
  // ── الحريق والمنع ──
  { at: 29.6, ton: "kan", fx: "duman", ates: true, sfx: "boom", r: (t, k) => <><Tablo im={I.panorama} a={[1.0, 0.6, 0.5]} b={[1.0, 0.3, 0.5]} k={k} /><Yil k={k} yil={1633} y={260} c="#FF6A3A" /></> },
  { at: 32.2, ton: "sicak", mum: [540, 700], fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.muradmin} a={[1.0, 0.5, 0.5]} b={[1.25, 0.5, 0.4]} k={k} /> },
  { at: 34.2, ton: "kan", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.prez2} a={[1.3, 0.5, 0.5]} b={[1.4, 0.5, 0.5]} k={k} bgBlur={5} /><Muhur k={k} text="KAPANDI" y={600} /></> },
  { at: 36.3, ton: "gece", mum: [540, 800], fx: "duman", r: (t, k) => <Tablo im={I.kahvehane} a={[1.6, 0.75, 0.5]} b={[1.8, 0.8, 0.5]} k={k} /> },
  { at: 39.3, ton: "sicak", mum: [540, 900], fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kadinkahve} a={[1.3, 0.4, 0.55]} b={[1.5, 0.5, 0.55]} k={k} /><Etiket k={k} text="KAHVE İÇEN KADINLAR · VANMOUR" /></> },
  { at: 41.3, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <Tablo im={I.kizkahve} a={[1.1, 0.5, 0.5]} b={[1.35, 0.6, 0.6]} k={k} /> },
  // ── سؤال الفريقين ──
  { at: 43.8, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 47.8, ton: "sicak", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.cezve} a={[1.1, 0.5, 0.45]} b={[1.2, 0.5, 0.45]} k={k} /><Abone k={rmp(t, 49.3, 50.1)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["ölüm", "kelle", "yangın", "kahvehanelere", "isyan", "dedikodu", "değil"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short05: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 3.5]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-05.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
