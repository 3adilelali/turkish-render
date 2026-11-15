import words from "../../../public/data/sh2-05-words.json";
import { DAD, HERO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Landing } from "../../components/K2Kit";
import { Dunya, Saat, Ziplayanlar } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #5 · «Bütün Türkiye Aynı Anda Zıplasa Ne Olur?» (النوع أ)
// السكربت والمصادر: السكربتات/sh2-05-zipla.txt (TÜİK 2025: 86.092.168)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const KOMSU: Outfit = { ...DAD, kind: "robe", top: "#7E5BD6", top2: "#5E3FB0", glasses: true };
const sky = (c = "#BFE3F2") => <rect width={1920} height={1080} fill={c} />;
const yer = <rect y={980} width={1920} height={100} fill="#8C9AA6" />;
const uzay = (t: number) => <g><rect width={1920} height={1080} fill="#0B1426" />{Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 1080} r={1.5 + (i % 3)} fill="#FFFFFF" opacity={0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i))} />)}</g>;
// zıplama eğrisi (a anından itibaren tek zıplayış)
const zip = (t: number, a: number, d = 0.9) => { const u = (t - a) / d; return u < 0 || u > 1 ? 0 : Math.sin(u * Math.PI); };
// tartı
const Tarti = ({ v }: { v: number }) => (
  <g transform="translate(960,1010)">
    <rect x={-170} y={-40} width={340} height={60} rx={20} fill="#E6EEF2" stroke="#7E868A" strokeWidth={6} />
    <rect x={-70} y={-34} width={140} height={34} rx={6} fill="#141414" />
    <text y={-8} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={28} fill="#5FF2E2">{v.toFixed(0)} kg</text>
  </g>
);
// atom (proton)
const Atom = ({ t, s = 1 }: { t: number; s?: number }) => (
  <g transform={`translate(960,560) scale(${s})`}>
    {[0, 60, 120].map((r) => <ellipse key={r} rx={260} ry={80} fill="none" stroke="#5FF2E2" strokeWidth={5} opacity={0.6} transform={`rotate(${r + t * 20})`} />)}
    {[0, 1, 2].map((i) => { const a = t * 3 + i * 2.1; return <circle key={i} cx={Math.cos(a) * 260} cy={Math.sin(a) * 80} r={14} fill="#5FF2E2" transform={`rotate(${i * 60 + t * 20})`} />; })}
    <circle r={40} fill="#E0393E" /><circle cx={-12} cy={-12} r={12} fill="#FFFFFF" opacity={0.5} />
  </g>
);

export const { SECONDS: SH2_05_SECONDS, Comp: Sh2Short05 } = makeShort2({
  words: words as W[],
  audio: "sh2-05",
  hook: "BÜTÜN TÜRKİYE AYNI ANDA ZIPLASA?",
  hookUntil: 3.1,
  build: (cue) => {
    const tUc = cue("Üç"), tIki = cue("İki"), tBir = cue("Bir. Ve") ;
    const tTs = cue("tsunami"), tHic = cue("hiçbir şey");
    const tKnock = cue("çalıyor");
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      // 0 · soru
      { c: "Bütün", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 640]}>{sky()}<Dunya x={960} y={1500} r={900} t={t} tr={0} />{yer}<Ziplayanlar t={t} k={Math.abs(Math.sin(t * 3.4))} /></TCam> },
      { c: "Seksen altı", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.2]} c0={[960, 760]}>{sky()}{yer}<Ziplayanlar t={t} k={0} rows={5} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.1} to={86} dur={0.9} unit="MİLYON İNSAN" y={360} /> },
      { c: "Ortalama", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.75]} c0={[960, 720]}><rect width={1920} height={1080} fill="#F2EEE6" /><Tarti v={Math.min(70, 70 * ramp(t, a + 0.3, a + 1.2))} /><TFig x={960} y={975} s={0.85} o={SEN} t={t} rim={0.4} pose={P.hips} mouth="grin" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="ORTALAMA 70 KİLO" y={330} /> },
      { c: "Toplam", sfx: "boom", tone: "cool", bg: "#14294A", r: (t, a, b) => { const k = ramp(t, a + 0.3, a + 1.4); return <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]}><rect width={1920} height={1080} fill="#14294A" /><g transform={`translate(960,${lerp(-200, 640, k * k)})`}><path d="M-220,160 L-160,-140 H160 L220,160Z" fill="#2A2E36" stroke="#5E666C" strokeWidth={8} /><rect x={-50} y={-190} width={100} height={60} rx={20} fill="none" stroke="#5E666C" strokeWidth={14} /><text y={60} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={70} fill="#FFFFFF">6 MİLYAR</text><text y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#F6C445">KİLO</text></g></TCam>; },
        html: (t, a) => <VT t={t} at={a + 0.4} text="TOPLAM ≈" y={330} /> },
      { c: "Saat tam", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={12 - (1 - ramp(t, a, a + 1)) * 0.25} label="12:00" /></g> },
      // geri sayım
      { c: "Herkes sayıyor", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 780]}>{sky()}{yer}<Ziplayanlar t={t} k={-0.15 * ramp(t, a, b)} /></TCam>,
        html: (t) => <><Damga t={t} at={tUc} text="3" y={330} size={220} c="#FFFFFF" /><Damga t={t} at={tIki} text="2" y={330} size={220} c="#F6C445" /><Damga t={t} at={tBir} text="1" y={330} size={220} c="#E0393E" /></> },
      { c: "hepsi aynı", sfx: "boing", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.1]} c0={[960, 700]} shake={4 * zip(t, a + 0.6)}>{sky()}{yer}<Ziplayanlar t={t} k={zip(t, a + 0.3, 1.4) * 1.6} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="HOP!" y={330} size={140} /> },
      // dünya
      { c: "Dünya kıpırdıyor", sfx: "drone", tone: "cool", bg: "#0B1426", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 560]}>{uzay(t)}<Dunya x={960} y={580} r={270} t={t} wob={3 * (1 - ramp(t, a + 1.5, b))} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.2} text="GERÇEKTEN" y={1020} c="#2EE6D0" rot={-5} /> },
      { c: "Ama ne", sfx: "whoosh", tone: "cool", bg: "#0B1426", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 3]} c0={[1036, 500]}>{uzay(t)}<Dunya x={960} y={580} r={270} t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="NE KADAR?" y={330} /> },
      { c: "Bir protondan", sfx: "ding", tone: "cool", bg: "#0B1426", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.9, 1.1]} c0={[960, 560]}>{uzay(t)}<Atom t={t} s={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="BİR PROTONDAN BİLE AZ" y={330} c="#2EE6D0" size={80} /> },
      // katrilyon
      { c: "Çünkü Dünya", sfx: "boom", tone: "cool", bg: "#0B1426", r: (t, a, b) => { const k = ramp(t, a + 0.4, a + 2.5); return <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 560]}>{uzay(t)}<Dunya x={960} y={lerp(1150, 760, k)} r={lerp(120, 520, k)} t={t} tr={0} /><circle cx={960} cy={240} r={8} fill="#F6C445" /><text x={990} y={250} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F6C445">86 MİLYON KİŞİ</text></TCam>; },
        html: (t, a) => <><VT t={t} at={a + 2.4} text="1 KATRİLYON KAT" y={500} c="#F6C445" /><VT t={t} at={a + 3.2} text="DAHA AĞIR" y={640} size={80} /></> },
      { c: "Yere", sfx: "boing", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}>{sky()}{yer}<Ziplayanlar t={t} k={1.2 * (1 - ramp(t, a, a + 0.9))} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.3} text="DÜNYA DA GERİ GELİR" y={330} size={80} /> },
      { c: "Ödeşiyorsunuz", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 760]}>{sky()}{yer}<Ziplayanlar t={t} k={0} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.1} text="ÖDEŞTİK 🤝" y={420} c="#F6C445" /> },
      { c: "Deprem", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}>{uzay(t)}<Dunya x={960} y={620} r={260} t={t} tr={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="DEPREM ✗" y={300} size={80} /><VT t={t} at={tTs} text="TSUNAMİ ✗" y={420} size={80} /><VT t={t} at={tHic} text="HİÇBİR ŞEY ✗" y={540} size={80} c="#2EE6D0" /></> },
      // komşu
      { c: "Sadece bir", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}><Landing t={t} plate="4" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="SADECE BİR ŞEY..." y={330} /> },
      { c: "Alt kattaki", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 640]} shake={t > tKnock && t < tKnock + 0.5 ? 5 : 0}><Landing t={t} plate="4" open={ramp(t, tKnock + 0.3, tKnock + 0.8)} inside={<TFig x={960} y={1035} s={0.9} o={KOMSU} t={t} pose={P.hips} mouth="frown" brow="angry" talk />} /></TCam>,
        html: (t) => <Damga t={t} at={tKnock} text="TAK TAK!" y={420} c="#E0393E" rot={-6} /> },
      // döngü
      { c: "Sence", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 680]}>{sky()}{yer}<Ziplayanlar t={t} k={Math.abs(Math.sin(t * 3.4))} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN NE YAPARDIN?" y={330} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
