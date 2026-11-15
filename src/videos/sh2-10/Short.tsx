import words from "../../../public/data/sh2-10-words.json";
import { TCam, lerp } from "../../components/Toon";
import { Simit } from "../../components/K2Kit";
import { BogazHarita, Saat, Yuzucu } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #10 · «Boğaz'ı Yüzmek İçin Kaç Simit Gerekir?» (النوع أ، 82/100)
// السكربت والمصادر: السكربتات/sh2-10-yuzme.txt (Boğaziçi Kıtalararası Yüzme Yarışı، 6,5 كم)

const TQ = "#2EE6D0";
// deniz (yakın plan)
const Deniz = ({ t, push = 0 }: { t: number; push?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE3F2" />
    <path d="M0,300 L300,250 L520,290 L760,240 L1000,280 L1300,230 L1600,280 L1920,250 V420 H0Z" fill="#E9DFC8" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={600 + i * 160} y={250 - (i % 2) * 30} width={110} height={90 + (i % 2) * 30} fill={["#F1DDBE", "#EAD8C0", "#F4E6CC", "#E6D2B4"][i]} />)}
    <rect y={400} width={1920} height={680} fill="#2F7FC1" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${((i * 260 + t * 80) % 2200) - 200},${470 + (i % 4) * 150} q40,-18 80,0 q40,18 80,0`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.4} />)}
    {push > 0 && [0, 1, 2].map((i) => { const o = (t * 0.8 + i / 3) % 1; return <path key={i} d={`M${lerp(700, 1250, o)},${780 + i * 70} h80 m-24,-18 l24,18 l-24,18`} stroke="#F6C445" strokeWidth={9} fill="none" strokeLinecap="round" opacity={push * Math.sin(o * Math.PI)} />; })}
  </g>
);
const Cay = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,-110 Q-60,-60 -36,0 Q-50,40 -30,60 H30 Q50,40 36,0 Q60,-60 40,-110Z" fill="#B3402A" stroke="#7A2A1A" strokeWidth={4} opacity={0.9} />
    <path d="M-40,-110 H40" stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
    <ellipse cy={70} rx={70} ry={14} fill="#E8E2CF" stroke="#9A8A6A" strokeWidth={3} />
  </g>
);
// n simit (yarım dahil) yan yana
const simitler = (t: number, n: number, k: number, y = 560) => (
  <g>{Array.from({ length: Math.ceil(n) }, (_, i) => { const half = i + 1 > n; const on = ramp(t, i * 0.25, i * 0.25 + 0.2); return <g key={i} opacity={k > i / Math.ceil(n) ? 1 : 0.15} transform={`translate(${760 + i * 130},${y}) scale(${0.6 + 0.4 * on})`}><clipPath id={`half${i}`}><rect x={-120} y={-120} width={half ? 120 : 240} height={240} /></clipPath><g clipPath={`url(#half${i})`}><Simit x={0} y={0} s={1.3} /></g></g>; })}</g>
);

export const { SECONDS: SH2_10_SECONDS, Comp: Sh2Short10 } = makeShort2({
  words: words as W[],
  audio: "sh2-10",
  hook: "BOĞAZ'I YÜZMEK = KAÇ SİMİT?",
  hookUntil: 3.3,
  build: (cue) => {
    const tCay = cue("Bir de çay");
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      // 0 · soru
      { c: "Boğaz'ı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.15]} c0={[960, 600]}><Deniz t={t} /><Yuzucu x={960} y={620} s={1.6} t={t} cap={TQ} /><Simit x={1150} y={460} s={1.2} /></TCam> },
      { c: "Her yıl", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 640]}><Deniz t={t} />{Array.from({ length: 9 }, (_, i) => <Yuzucu key={i} x={720 + (i % 3) * 230 + ((t * 30) % 60)} y={520 + Math.floor(i / 3) * 170} s={0.8 + Math.floor(i / 3) * 0.2} t={t + i * 0.7} cap={["#E0393E", "#F6C445", TQ, "#7E5BD6"][i % 4]} />)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="YÜZLERCE KİŞİ" y={330} /> },
      { c: "Kanlıca'dan", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 540]}><BogazHarita t={t} k={ramp(t, a + 0.4, b + 2)} /></TCam> },
      { c: "Altı buçuk", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.15]} c0={[960, 540]}><BogazHarita t={t} k={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="6,5 KM" y={330} c="#F6C445" size={150} /> },
      { c: "Amatör", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={2 * ramp(t, a + 0.3, a + 2.4)} label="≈ 2 SAAT" /></g> },
      // kalori
      { c: "Yüzmek, saatte", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}><Deniz t={t} /><Yuzucu x={960} y={620} s={1.4} t={t * 1.4} cap={TQ} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 1} text="🔥 500 KALORİ" y={330} c="#F6C445" /><VT t={t} at={a + 1.5} text="HER SAAT" y={460} size={76} /></> },
      { c: "Yani toplam", sfx: "boom", tone: "gold", bg: "#3A2410", r: (t) => <g><rect width={1920} height={1080} fill="#3A2410" /></g>,
        html: (t, a) => <Sayi t={t} at={a + 0.1} to={1000} dur={1} unit="KALORİ" y={600} c="#F6C445" /> },
      { c: "Bir simit", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]}><rect width={1920} height={1080} fill="#F6EBD2" /><Simit x={960} y={560} s={3} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.9} text="≈ 300 KALORİ" y={330} /> },
      { c: "Sonuç", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]} c0={[960, 560]}><rect width={1920} height={1080} fill="#F6EBD2" />{simitler(t - a, 3.5, ramp(t, a + 0.5, a + 1.4), 520)}{t > tCay && <Cay x={960} y={820} s={1.4} />}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.8} text="3,5 SİMİT" y={300} c="#F6C445" size={130} /><Damga t={t} at={tCay} text="+ BİR ÇAY ☕" y={1040} c="#E0393E" rot={-4} /></> },
      // sır: akıntı
      { c: "Ama bir sır", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.4]} c0={[960, 540]}><BogazHarita t={t} k={0} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="AMA BİR SIR VAR 🤫" y={330} /> },
      { c: "Yarış kuzeyden", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 540]}><BogazHarita t={t} k={ramp(t, a + 0.4, b)} flow={ramp(t, a + 2.2, a + 3)} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.4} text="KUZEY → GÜNEY" y={300} size={80} /><Damga t={t} at={a + 2.4} text="AKINTI GÜNEYE ↓" y={1040} c="#2EE6D0" rot={-4} /></> },
      { c: "Akıntı seni", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><Deniz t={t} push={1} /><Yuzucu x={lerp(860, 1060, ramp(t, a, b))} y={640} s={1.4} t={t} cap={TQ} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.4} text="BELKİ 3 SİMİT" y={330} c="#F6C445" rot={-4} /> },
      // uyarı
      { c: "Yine de", sfx: "buzz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><Deniz t={t} /><g transform={`translate(${lerp(1700, 700, ramp(t, a, b + 2))},560)`}><path d="M-420,0 L420,0 L360,120 L-380,120Z" fill="#2A2E36" /><rect x={-300} y={-120} width={200} height={120} fill="#E0393E" /><rect x={-80} y={-70} width={420} height={70} fill="#F4F4F2" /><rect x={200} y={-190} width={60} height={120} fill="#2A2E36" /></g><Yuzucu x={960} y={720} s={1} t={t} cap={TQ} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.5} text="TEK BAŞINA DENEME ✗" y={330} c="#E0393E" rot={-4} size={80} /> },
      { c: "Bu iş ancak", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}><Deniz t={t} />{Array.from({ length: 6 }, (_, i) => <Yuzucu key={i} x={720 + (i % 3) * 230} y={560 + Math.floor(i / 3) * 220} s={1} t={t + i} cap={["#E0393E", "#F6C445", TQ][i % 3]} />)}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.9} text="SADECE YARIŞ GÜNÜ" y={300} size={80} /><VT t={t} at={a + 2} text="BOĞAZ TRAFİĞE KAPALI" y={420} size={72} c="#2EE6D0" /></> },
      // döngü
      { c: "Sen kaç", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}><Deniz t={t} /><Yuzucu x={960} y={640} s={1.5} t={t} cap={TQ} /><Simit x={1140} y={470} s={1.1} /><Simit x={780} y={470} s={1.1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN KAÇ SİMİTLE YÜZERDİN?" y={330} size={76} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
