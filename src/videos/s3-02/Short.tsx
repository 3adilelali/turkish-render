import React from "react";
import words from "../../../public/data/s3-02-words.json";
import { ramp } from "../../lib/cues";
import { H, HCam, HFig, lerp } from "../../components/Harem";
import { Hamam, Lady } from "../../components/Gelin";
import { makeShort, Stamp, Sub, VT, W } from "../s3-common/Vert";

// Kanal 1 · SHORT 02 · "Kocası Onu Kutuya Kilitlemiş!" — Lady Mary Montagu, Sofya hamamı, 1 Nisan 1717 mektubu (korse sahnesi).
// Uzun video bağlantısı: Hamamcı Kadın (k3r-11).

const G = 1010;
const kad = (t: number, x: number, i: number, face: "normal" | "smile" | "shock" | "sad" | "worried" = "normal", talk = 0, look = 0, s = 0.95) =>
  <HFig x={x} y={G} s={s} kind="girl" robe={["#F2D7C4", "#E3C9DA", "#D5E3EA", "#EADFC0"][i % 4]} robe2="#FFFFFF" t={t} seed={i} face={face} talk={talk} look={look} sit />;
const hamam = (t: number, crowd = 0) => <Hamam t={t} steam={1} crowd={crowd} />;
const lady = (t: number, x: number, s: number, open = 0, face: "normal" | "smile" | "shock" = "normal", look = 0) => <Lady x={x} y={G} s={s} t={t} open={open} face={face} look={look} />;

// kilitli kutu: leydinin gövdesine oturan tahta sandık + asma kilit
const Kutu: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g transform={`translate(960,${lerp(-400, 0, k)})`} opacity={k}>
    <rect x={-190} y={620} width={380} height={330} rx={14} fill="#8A5A34" stroke={H.ln} strokeWidth={8} />
    {[690, 770, 850].map((y) => <line key={y} x1={-190} x2={190} y1={y} y2={y} stroke="#5E3B20" strokeWidth={6} />)}
    <rect x={-200} y={610} width={400} height={30} fill="#5E3B20" stroke={H.ln} strokeWidth={6} />
    <g transform={`translate(0,780) rotate(${Math.sin(t * 6) * 6})`}>
      <path d="M-34,-20 V-60 A34,34 0 0 1 34,-60 V-20" fill="none" stroke="#9AA3AD" strokeWidth={14} />
      <rect x={-50} y={-24} width={100} height={84} rx={12} fill={H.gold} stroke={H.ln} strokeWidth={6} />
      <circle cy={12} r={10} fill={H.ln} /><rect x={-4} y={14} width={8} height={24} fill={H.ln} />
    </g>
  </g>
);
const Anahtar: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g transform={`translate(960,520) rotate(${(1 - k) * 200 + Math.sin(t * 3) * 8}) scale(${0.4 + 0.9 * k})`} opacity={k}>
    <circle cx={-150} r={70} fill="none" stroke={H.gold} strokeWidth={30} />
    <rect x={-80} y={-16} width={300} height={32} fill={H.gold} stroke={H.ln} strokeWidth={4} />
    <rect x={160} y={16} width={22} height={50} fill={H.gold} stroke={H.ln} strokeWidth={4} /><rect x={110} y={16} width={22} height={36} fill={H.gold} stroke={H.ln} strokeWidth={4} />
  </g>
);

const Mektup: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g>
    <rect width={1920} height={1080} fill="#5E3B20" />
    <g transform={`translate(960,560) rotate(${-4 + (1 - k) * 10}) scale(${(0.8 + 0.2 * k) * 0.95})`} opacity={k}>
      <rect x={-260} y={-360} width={520} height={700} fill="#F6EBD0" stroke={H.ln} strokeWidth={6} />
      <text x={0} y={-280} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={34} fill="#3A2A1A">Adrianople, 1 April 1717</text>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M-210,${-200 + i * 52} q40,-14 80,0 t80,0 t80,0 t80,0 t80,0`} stroke="#3A2A1A" strokeWidth={4} fill="none" opacity={i * 0.12 < 1.6 * (t % 9) ? 0.7 : 0} />)}
      <path d={`M${180},${260} l140,-260`} stroke="#E8E0D0" strokeWidth={22} strokeLinecap="round" />
      <path d={`M${180},${260} l12,-24`} stroke={H.ln} strokeWidth={6} />
    </g>
  </g>
);

const S = makeShort({
  words: words as W[], audio: "s3-02", label: "HAREMİN SIRLARI · #2", hook: "“KOCASI ONU KUTUYA KİLİTLEMİŞ!”", hookUntil: 2.0,
  alt: { "Bir korse": ["Bir korse!"], "Korseli": ["Korseli Lady"] },
  build: () => [
    { c: "Yıl 1717", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.0, 2.3]} c0={[960, 840]}>{hamam(t, 1)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 2.0} text="1717 · SOFYA" y={240} size={92} /> },
    { c: "Sıcak mermer", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 760]}>{hamam(t)}{kad(t, 870, 0, "closed", 0, 0.3)}{kad(t, 1060, 2, "smile", 0, -0.3)}</HCam> },
    { c: "Kapı açılıyor", sfx: "whoosh", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.15]} c0={[960, 640]}>{hamam(t)}{kad(t, 760, 0, "normal", 0, 0.8, 0.8)}{lady(t, lerp(1260, 1020, ramp(t, a, b)), 0.9)}</HCam> },
    { c: "Bir İngiliz leydi", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.9]} c0={[960, 640]}>{hamam(t)}{lady(t, 960, 1.15, 0, "smile")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.15} text="İNGİLİZ LEYDİ" y={240} size={92} bg="#2E4A66" c="#fff" /> },
    { c: "Hamamda herkes rahat", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 760]}>{hamam(t)}{kad(t, 850, 1, "smile", 0, 0.3)}{kad(t, 1070, 2, "smile", 0, -0.3)}</HCam> },
    { c: "Ama bu kadın", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.7]} c0={[960, 640]}>{hamam(t)}{lady(t, 960, 1.15, 0, "normal", 0.3)}</HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.9} text="FULL KAPALI" y={330} c="#2E4A66" size={100} /> },
    { c: "Şapkası bile", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3.0]} c0={[960, 520]}>{hamam(t)}{lady(t, 960, 1.15, 0, "normal")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="ŞAPKASI BİLE BAŞINDA 🎩" y={240} size={76} /> },
    { c: "Kadınlar ısrar", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 760]}>{hamam(t)}{kad(t, 840, 1, "smile", 1, 0.7)}{kad(t, 1080, 3, "smile", 1, -0.7)}</HCam> },
    { c: "Hadi, soyun", sfx: "pop", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.9, 2.1]} c0={[960, 700]}>{hamam(t)}{kad(t, 960, 2, "smile", 1, 0, 1.15)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="“HADİ, SOYUN!”" y={240} size={104} /> },
    { c: "Leydi sonunda", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.8]} c0={[960, 640]}>{hamam(t)}{lady(t, 960, 1.15, ramp(t, a + 0.6, b), "normal", -0.2)}</HCam> },
    { c: "Ve altından sert", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3.4]} c0={[960, 720]}>{hamam(t)}{lady(t, 960, 1.15, 1, "normal")}</HCam>,
      html: (t, a) => <>{["SERT", "SIKI", "KEMİKLİ"].map((l, i) => <Stamp key={l} t={t} at={a + 0.6 + i * 0.75} text={l} y={260 + i * 190} rot={[-8, 6, -4][i]} c={H.ln} size={80} />)}</> },
    { c: "Bir korse", sfx: "boom", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 700]}>{hamam(t)}{lady(t, 960, 1.15, 1, "smile")}</HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.15} text="KORSE!" y={300} size={150} /> },
    { c: "Hamamda derin", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 760]}>{hamam(t)}{kad(t, 840, 1, "shock", 0, 0.6)}{kad(t, 1080, 3, "shock", 0, -0.6)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="🤫 …" y={240} size={110} /> },
    { c: "Sonra kadınlar acıyarak", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2.0]} c0={[960, 740]}>{hamam(t)}{kad(t, 880, 1, "sad", 1, 0.9)}{kad(t, 1040, 3, "worried", 0, -0.9)}</HCam> },
    { c: "Zavallı kadın", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, 650]}>{hamam(t)}{kad(t, 960, 1, "sad", 1, 0, 1.15)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="“ZAVALLI KADIN…”" y={240} size={96} /> },
    { c: "Kocası onu bu kutuya", sfx: "boing", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}>{hamam(t)}{lady(t, 960, 1.15, 1, "shock")}<Kutu t={t} k={ramp(t, a + 0.7, a + 1.2)} /></HCam>,
      html: (t, a) => <Stamp t={t} at={a + 1.3} text="KİLİTLİ!" y={300} size={130} /> },
    { c: "Anahtarı da kocasında", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}>{hamam(t)}<rect width={1920} height={1080} fill="#1B1209" opacity={0.55} /><Anahtar t={t} k={ramp(t, a, a + 0.7)} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="ANAHTAR KOCASINDA 🔑" y={1000} size={80} /> },
    { c: "Bu kadın Lady Mary", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}>{hamam(t)}{lady(t, 960, 1.15, 0, "smile")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="LADY MARY WORTLEY MONTAGU" y={240} size={70} bg="#2E4A66" c="#fff" /> },
    { c: "Ve bu sahneyi kendi", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[0.92, 1.0]} c0={[960, 560]}><Mektup t={t} k={ramp(t, a, a + 0.6)} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="📜 MEKTUP · 1 NİSAN 1717" y={240} size={76} /> },
    { c: "Sence kim daha", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 700]}>{hamam(t)}{kad(t, 800, 2, "smile", 0, 0.5, 0.8)}{lady(t, 1120, 0.85, 1, "normal", -0.5)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="KİM DAHA ÖZGÜRDÜ?" y={240} size={90} /> },
    { c: "Yorumlara yaz", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 760]}>{hamam(t)}{kad(t, 860, 1, "smile", 0, 0.4)}{kad(t, 1060, 3, "smile", 0, -0.4)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={240} size={88} /> },
    { c: "Osmanlı kadınlarının", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.9, 2.1]} c0={[960, 840]}>{hamam(t, 1)}</HCam>,
      html: (t, a) => <><VT t={t} at={a + 0.1} text="HAREMİN SIRLARI" y={240} size={92} /><Sub t={t} at={a + 0.5} /></> },
  ],
});
export const S3_02_SECONDS = S.SECONDS;
export const S3Short02 = S.Comp;
