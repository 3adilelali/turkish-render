import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/sh1-03-words.json";
import { Altyazi, Belge, Cerceve, chunk, Duman, Etiket, ez, Gren, Grade, HH, Img2, Muhur, Perde, rmp, Sizinti, Tablo, Ton, Toz, W, Wd, Yil } from "../../components/Canli";
import { FONT } from "../../theme";

// القناة 1 · شورت #3 (Canlı Tablo) · «Osmanlı'yı bir kadın yönetti» (Kösem)
// الشائعة: كوسم حكمت من ورا الستارة بالمؤامرات. الكسر: كانت نائبة رسمية (naibe) 1623 و1648، ومكاتيبها للصدر الأعظم بأرشيف القصر.
// المرجع: L. Peirce, The Imperial Harem (1993). الصور: public/img/sh1-03/المصادر.txt

const D = "img/sh1-03/";
const I = {
  kosem: { src: D + "kosem.jpg", cut: D + "kosem_cut.png", w: 1107, h: 1366 },
  kosemmin: { src: D + "kosemmin.jpg", w: 630, h: 1024 },
  olum: { src: D + "olum.jpg", w: 1639, h: 1211 },
  muradmin: { src: D + "muradmin.jpg", w: 1112, h: 1681 },
  murad: { src: D + "murad.jpg", w: 1457, h: 1700 },
  mehmed: { src: D + "mehmed.jpg", cut: D + "mehmed_cut.png", w: 1423, h: 2400 },
  mehmedy: { src: D + "mehmedy.jpg", cut: D + "mehmedy_cut.png", w: 1097, h: 1700 },
  uclu: { src: D + "uclu.jpg", w: 874, h: 1426 },
  muhallefat: { src: D + "muhallefat.jpg", w: 1046, h: 1428 },
} satisfies Record<string, Img2>;

const WORDS = words as Wd[];
const END = WORDS[WORDS.length - 1].end + 0.9;
export const SH1_03_SECONDS = Math.ceil(END * 10) / 10;

type Shot = { at: number; ton: Ton; mum?: [number, number]; fx?: "duman" | "toz"; sfx?: string; noCap?: boolean; r: (t: number, k: number) => React.ReactNode };

const Ikili: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(rmp(k, 0, 0.3));
  const half = HH / 2;
  return (
    <AbsoluteFill style={{ background: "#0B0705" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * -W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.2, width: W, height: HH }}><Tablo im={I.kosem} a={[1.2, 0.5, 0.3]} b={[1.32, 0.5, 0.3]} k={k} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: half, width: W, height: half, overflow: "hidden", transform: `translateX(${(1 - e) * W}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -HH * 0.25, width: W, height: HH }}><Tablo im={I.olum} a={[1.1, 0.6, 0.5]} b={[1.22, 0.6, 0.5]} k={k} /></div>
        <AbsoluteFill style={{ background: "rgba(60,0,0,.3)" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: half - 5, height: 10, background: "linear-gradient(90deg,#7A5A1E,#F2D58A,#7A5A1E)", boxShadow: "0 0 30px #F2C46A" }} />
      <Lbl y={150} text="KURTARDI MI?" c="#FFD65A" k={rmp(k, 0.08, 0.3)} />
      <Lbl y={HH - 330} text="TEHLİKE Mİ?" c="#FF4A3D" k={rmp(k, 0.2, 0.42)} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ y: number; text: string; c: string; k: number }> = ({ y, text, c, k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: e, transform: `scale(${1.6 - 0.6 * e})` }}><span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 130, color: c, WebkitTextStroke: "20px #120A04", paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,.7)" }}>{text}</span></div>;
};

const MEKTUP = "Valide Kösem, sadrazama kendi eliyle yazdığı mektuplarla hazineyi, erzakı ve atamaları sorardı.";

const SHOTS: Shot[] = [
  // ── الشائعة ──
  { at: 0, ton: "kan", mum: [540, 900], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.uclu} a={[1.6, 0.5, 0.15]} b={[1.6, 0.5, 0.85]} k={k} /> },
  { at: 3.6, ton: "gece", mum: [540, 700], fx: "duman", sfx: "boom", r: (t, k) => <Tablo im={I.kosem} a={[1.1, 0.5, 0.4]} b={[1.45, 0.48, 0.32]} k={k} depth={0.1} /> },
  { at: 5.0, ton: "gece", mum: [540, 600], r: (t, k) => <><Tablo im={I.kosem} a={[1.8, 0.45, 0.3]} b={[2.0, 0.45, 0.28]} k={k} depth={0.1} /><Etiket k={k} text="KÖSEM SULTAN · 17. YY PORTRESİ" /></> },
  { at: 6.7, ton: "kan", mum: [540, 800], fx: "duman", sfx: "whoosh", r: (t, k) => <><Tablo im={I.kosemmin} a={[1.2, 0.5, 0.35]} b={[1.4, 0.5, 0.3]} k={k} /><Perde close={0.55 * rmp(k, 0.1, 0.7)} /></> },
  { at: 8.7, ton: "kan", fx: "toz", sfx: "boom", r: (t, k) => <Tablo im={I.muradmin} a={[1.5, 0.2, 0.5]} b={[1.3, 0.35, 0.45]} k={k} /> },
  { at: 10.3, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.uclu} a={[2.2, 0.5, 0.2]} b={[2.2, 0.5, 0.8]} k={k} /><Etiket k={k} text="IV. MURAD · İBRAHİM · IV. MEHMED" /></> },
  { at: 12.9, ton: "kan", mum: [540, 800], fx: "toz", r: (t, k) => <><Tablo im={I.kosem} a={[1.3, 0.5, 0.35]} b={[1.5, 0.5, 0.3]} k={k} depth={0.1} /><Perde close={0.48 + 0.08 * k} /></> },
  // ── الكسر: الستارة بتنفتح ──
  { at: 15.4, ton: "belge", mum: [540, 900], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.muhallefat} a={[1.5, 0.5, 0.3]} b={[1.1, 0.5, 0.45]} k={k} /><Perde close={0.56} open={rmp(k, 0.02, 0.45)} /></> },
  { at: 19.3, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.murad} a={[1.1, 0.5, 0.45]} b={[1.3, 0.5, 0.35]} k={k} /><Yil k={k} yil={1623} y={200} /><Etiket k={k} text="IV. MURAD · 11 YAŞINDA TAHTTA" /></> },
  { at: 22.7, ton: "sicak", mum: [540, 700], fx: "toz", sfx: "boom", r: (t, k) => <><Tablo im={I.kosem} a={[1.3, 0.5, 0.3]} b={[1.5, 0.5, 0.28]} k={k} depth={0.1} /><Muhur k={rmp(t, 24.2, 26.4)} text="NAİBE" y={1050} /></> },
  { at: 26.4, ton: "sicak", fx: "toz", sfx: "whoosh", r: (t, k) => <Tablo im={I.muradmin} a={[1.0, 0.5, 0.5]} b={[1.2, 0.55, 0.4]} k={k} /> },
  { at: 29.6, ton: "belge", fx: "toz", sfx: "whoosh", r: (t, k) => <><Tablo im={I.muhallefat} a={[1.2, 0.5, 0.5]} b={[1.3, 0.5, 0.6]} k={k} /><AbsoluteFill style={{ background: "rgba(10,6,3,.5)" }} /><Belge k={k} text={MEKTUP} src="Topkapı Sarayı Arşivi · L. Peirce, The Imperial Harem" typed={rmp(k, 0.06, 0.55)} quote={false} tag="📜 SARAY ARŞİVİ" /></> },
  { at: 35.6, ton: "belge", mum: [540, 900], fx: "toz", sfx: "whoosh", r: (t, k) => <><Cerceve im={I.muhallefat} k={k} y={250} width={820} /><Etiket k={k} text="KÖSEM SULTAN'IN MUHALLEFAT KAYDI" y={1420} /></> },
  { at: 39.3, ton: "sicak", fx: "toz", sfx: "ding", r: (t, k) => <><Tablo im={I.mehmed} a={[1.05, 0.5, 0.5]} b={[1.35, 0.5, 0.25]} k={k} depth={0.1} /><Yil k={k} yil={1648} y={200} /><Etiket k={k} text="IV. MEHMED · 7 YAŞINDA TAHTTA" /></> },
  { at: 42.6, ton: "gece", mum: [540, 700], fx: "toz", r: (t, k) => <Tablo im={I.kosem} a={[2.2, 0.45, 0.28]} b={[1.7, 0.45, 0.32]} k={k} depth={0.1} /> },
  // ── النهاية ──
  { at: 44.9, ton: "kan", mum: [540, 900], fx: "duman", sfx: "boom", r: (t, k) => <><Tablo im={I.olum} a={[1.0, 0.5, 0.5]} b={[1.15, 0.55, 0.5]} k={k} /><Yil k={k} yil={1651} y={200} c="#FF5A4A" /></> },
  { at: 47.4, ton: "kan", mum: [700, 800], fx: "duman", r: (t, k) => <Tablo im={I.olum} a={[1.6, 0.35, 0.55]} b={[1.9, 0.3, 0.55]} k={k} /> },
  // ── سؤال الفريقين ──
  { at: 49.8, ton: "sicak", sfx: "boom", noCap: true, r: (t, k) => <Ikili k={k} /> },
  { at: 55.0, ton: "gece", fx: "toz", sfx: "pop", r: (t, k) => <><Tablo im={I.kosem} a={[1.2, 0.5, 0.35]} b={[1.3, 0.5, 0.33]} k={k} /><Abone k={rmp(t, 56.8, 57.6)} /></> },
];

const Abone: React.FC<{ k: number }> = ({ k }) => {
  const e = ez(k);
  return <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}><span style={{ display: "inline-block", background: "#C4161C", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, padding: "22px 70px", borderRadius: 80, boxShadow: "0 16px 40px rgba(0,0,0,.6)" }}>ABONE OL 🔔</span></div>;
};

const CH = chunk(WORDS, 3);
const HOT = ["kadın", "kösem", "titrerdi", "entrika", "naibe", "resmen", "yasal", "öldürüldü"];
const VOL: Record<string, number> = { whoosh: 0.06, boom: 0.16, ding: 0.1, pop: 0.1 };

export const Sh1Short03: React.FC = () => {
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
        {!s.noCap && <Altyazi t={t} ch={CH} hot={HOT} big={[0, 3.6]} />}
      </AbsoluteFill>
      <Audio src={staticFile("audio/sh1-03.wav")} />
      <Audio src={staticFile("sfx/drone.wav")} volume={0.05} loop />
      {SHOTS.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.at - 0.05) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
