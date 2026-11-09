import React from "react";
import words from "../../../public/data/s3-04-words.json";
import { ramp } from "../../lib/cues";
import { H, HCam, HFig, HTiny, lerp } from "../../components/Harem";
import { Carsi } from "../../components/HaremPlus";
import { makeShort, Stamp, Sub, VT, W } from "../s3-common/Vert";

// Kanal 1 · SHORT 04 · "Bu Yaka Yüzünden Ferman Çıktı!" — 1791, III. Selim büyük yakalı ve açık renkli ferace yasağını tekrarlar.
// Kaynak: TDV İA «Ferace» (yasağın 1791'de tekrarlanması).

const G = 1010;
const PEMBE = "#F2A7B8";
const kiz = (t: number, x: number, s = 1.1, face: "normal" | "worried" | "shock" | "smile" | "sad" = "normal", look = 0, talk = 0) =>
  <HFig x={x} y={G + 20} s={s} kind="girl" robe={PEMBE} robe2="#FFF4E8" t={t} face={face} look={look} talk={talk} seed={2} />;
const carsi = (t: number, crowd = 1) => <Carsi t={t} closed={0} crowd={crowd} />;

// askıda ferace: açık renk ipek, kocaman kare yaka (yaka: 0..1 büyüklük)
const Ferace: React.FC<{ t: number; x?: number; y?: number; s?: number; yaka?: number; c?: string; k?: number }> = ({ t, x = 960, y = 560, s = 1, yaka = 1, c = PEMBE, k = 1 }) => {
  const sw = Math.sin(t * 1.6) * 2;
  const Y = 0.6 + 0.6 * yaka;
  return (
    <g transform={`translate(${x},${y}) scale(${s * (0.6 + 0.4 * k)}) rotate(${sw})`} opacity={k}>
      <path d="M0,-330 v-40 q0,-30 30,-30" stroke={H.ln} strokeWidth={8} fill="none" />
      <path d="M-170,-300 L170,-300 L240,380 L-240,380Z" fill={c} stroke={H.ln} strokeWidth={6} />
      <path d="M-170,-300 L170,-300 L240,380 L-240,380Z" fill="url(#hDamask)" opacity={0.35} />
      <path d="M-170,-300 L-290,40 L-230,60 L-150,-160" fill={c} stroke={H.ln} strokeWidth={6} />
      <path d="M170,-300 L290,40 L230,60 L150,-160" fill={c} stroke={H.ln} strokeWidth={6} />
      {/* yaka */}
      <g transform={`translate(0,-300) scale(${Y})`}>
        <path d="M-230,0 L230,0 L200,230 L-200,230Z" fill="#FFF4E8" stroke={H.ln} strokeWidth={6} />
        <path d="M-200,20 L200,20 L176,205 L-176,205Z" fill="none" stroke={H.gold} strokeWidth={8} />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-150 + i * 60} cy={120} r={12} fill={H.cobalt} />)}
      </g>
      <path d="M0,-300 V380" stroke={H.ln} strokeWidth={4} opacity={0.5} />
    </g>
  );
};
// ferman tomarı (açılma k)
const Ferman: React.FC<{ t: number; k: number; x?: number; y?: number; s?: number; rot?: number }> = ({ t, k, x = 960, y = 540, s = 1, rot = 0 }) => {
  const h = lerp(40, 640, k);
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
      <rect x={-240} y={-h / 2} width={480} height={h} fill="#F3E3BC" stroke={H.ln} strokeWidth={6} />
      {k > 0.5 && <g opacity={ramp(k, 0.5, 1)}>
        <path d="M-120,-230 q40,-70 80,0 q30,-90 60,0 q30,-60 70,10 M-150,-200 q150,40 300,-10" stroke={H.gold} strokeWidth={10} fill="none" strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M-190,${-110 + i * 50} q50,-10 95,0 t95,0 t95,0 t95,0`} stroke="#6A4A2A" strokeWidth={5} fill="none" opacity={0.65} />)}
        <circle cx={150} cy={250} r={34} fill={H.red} stroke={H.ln} strokeWidth={4} />
      </g>}
      <rect x={-262} y={-h / 2 - 26} width={524} height={44} rx={22} fill="#C9A86A" stroke={H.ln} strokeWidth={5} />
      <rect x={-262} y={h / 2 - 18} width={524} height={44} rx={22} fill="#C9A86A" stroke={H.ln} strokeWidth={5} />
    </g>
  );
};
const Duvar = () => <><rect width={1920} height={1080} fill={H.plaster} /><rect y={640} width={1920} height={440} fill="url(#hTile)" /><rect y={630} width={1920} height={14} fill={H.cobalt} /></>;
const tellal = (t: number, s = 1.15) => <HFig x={960} y={G + 30} s={s} kind="efendi" robe="#7A3A2A" t={t} face="shock" talk={1} look={0.2} seed={8} />;
const moda = (t: number) => <g>{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${700 + i * 90},${900 + (i % 2) * 40})`}><HTiny x={0} y={0} s={1.9} c={["#F2A7B8", "#A9CADB", "#F2D27A", "#C9E2B0", "#E3C9DA"][i % 5]} /></g>)}</g>;

const S = makeShort({
  words: words as W[], audio: "s3-04", label: "HAREMİN SIRLARI · #4", hook: "BU YAKA YÜZÜNDEN FERMAN ÇIKTI!", hookUntil: 2.3,
  alt: { "kadınlar onu pek": ["kadınlar onu pek dinlemiyordu"] },
  build: () => [
    { c: "İstanbul, 1791", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.2]} c0={[960, 600]}>{carsi(t)}</HCam> },
    { c: "Yeni feracen nihayet", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 560]}><Duvar /><Ferace t={t} y={600} s={0.75} yaka={0.4} k={ramp(t, a, a + 0.6)} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.6} text="YENİ FERACE ✨" y={240} size={92} /> },
    { c: "Açık renk", sfx: "pop", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 520]}><Duvar /><Ferace t={t} y={600} s={0.75} yaka={lerp(0.4, 1.2, ramp(t, a + 1.4, a + 2.4))} /></HCam>,
      html: (t, a) => <>{["AÇIK RENK", "İPEK", "KOCAMAN YAKA"].map((l, i) => <Stamp key={l} t={t} at={a + 0.1 + i * 0.75} text={l} y={330 + i * 160} rot={[-5, 4, -3][i]} c={[H.rose, H.cobalt, H.red][i]} size={76} />)}</> },
    { c: "Çarşıya çıkıyorsun", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 680]}>{carsi(t)}<g transform={`translate(0,${-Math.abs(Math.sin(t * 6)) * 8})`}>{kiz(t, lerp(1100, 900, ramp(t, a, b)), 0.9, "smile")}</g></HCam> },
    { c: "Herkes dönüp", sfx: "boing", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 620]}>{carsi(t)}{kiz(t, 960, 1.1, "smile", Math.sin(t * 3) * 0.6)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="👀 👀 👀" y={240} size={100} /> },
    { c: "Ertesi sabah tellal", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 620]}>{carsi(t, 0)}{tellal(t)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="📢 TELLAL" y={240} size={92} /> },
    { c: "Padişah fermanı", sfx: "boom", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 540]}><Duvar /><Ferman t={t} k={ramp(t, a, a + 0.8)} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.5} text="PADİŞAH FERMANI!" y={240} size={90} bg={H.crimson} c="#fff" /> },
    { c: "Ve ferman, senin", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[960, 520]}><Duvar />{kiz(t, 960, 1.2, "shock")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.9} text="…SENİN FERACEN?!" y={240} size={92} /> },
    { c: "Büyük yakalı", sfx: "boom", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 560]}><Duvar /><Ferace t={t} y={600} s={0.75} yaka={1.2} /></HCam>,
      html: (t, a) => <Stamp t={t} at={a + 1.6} text="YASAK!" y={700} size={170} /> },
    { c: "Evet. Osmanlı devleti", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><Duvar /><Ferman t={t} k={1} s={0.9} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 1.0} text="YAKA YASAĞI 📏" y={240} size={92} /> },
    { c: "Ama işin komik", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.0, 2.2]} c0={[960, 540]}><Duvar />{kiz(t, 960, 1.2, "smile", 0.4)}</HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.3} text="AMA… 😄" y={300} c={H.ln} size={120} /> },
    { c: "Bu yasak ilk", sfx: "pop", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.05]} c0={[960, 560]}><Duvar />{[0, 1, 2].map((i) => ramp(t, a + i * 1.1, a + i * 1.1 + 0.4) > 0 && <Ferman key={i} t={t} k={1} s={0.62} x={lerp(870, 1050, i / 2)} y={520 + i * 40} rot={[-10, 4, 12][i]} />)}</HCam>,
      html: (t, a, b) => <VT t={t} at={a} text={`YASAK × ${1 + Math.min(2, Math.floor((t - a) / 1.1))}`} y={1000} size={96} /> },
    { c: "Üçüncü Selim sadece", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 560]}><Duvar /><HFig x={960} y={G + 30} s={1.0} kind="sultan" t={t} face="normal" seed={1} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="III. SELİM: “TEKRAR!”" y={240} size={84} /> },
    { c: "Yani bir yasak tekrar", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.08]} c0={[960, 560]}><Duvar />{[0, 1, 2, 3, 4].map((i) => <Ferman key={i} t={t} k={1} s={0.5} x={760 + i * 100} y={500 + (i % 2) * 60} rot={-14 + i * 7} />)}</HCam> },
    { c: "kadınlar onu pek", sfx: "boing", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 860]}>{carsi(t, 0)}{moda(t)}</HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.6} text="DİNLEMEDİLER 😏" y={300} c={H.cobalt} size={90} /> },
    { c: "Moda yine kazanmıştı", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}><Duvar /><Ferace t={t} y={600} s={0.75} yaka={1.2} c="#A9CADB" /></HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.2} text="MODA KAZANDI 👑" y={300} c={H.gold} size={90} /> },
    { c: "Sen olsan", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2.0]} c0={[960, 560]}><Duvar />{kiz(t, 960, 1.2, "smile", Math.sin(t * 1.5) * 0.6)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="GİYER MİYDİN?" y={240} size={96} /> },
    { c: "Yorumlara yaz", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}>{carsi(t)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={240} size={88} /> },
    { c: "Osmanlı kadınlarının bilinmeyen", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.15]} c0={[960, 640]}>{carsi(t)}{kiz(t, 960, 0.85, "smile")}</HCam>,
      html: (t, a) => <><VT t={t} at={a + 0.1} text="HAREMİN SIRLARI" y={240} size={92} /><Sub t={t} at={a + 0.5} /></> },
  ],
});
export const S3_04_SECONDS = S.SECONDS;
export const S3Short04 = S.Comp;
