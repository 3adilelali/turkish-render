import words from "../../../public/data/sh2-11-words.json";
import { HERO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Saat } from "../../components/K2Dikey2";
import { Dag, InceBardak, Termometre } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #11 · «Ağrı Dağı'nın Zirvesinde Çay Demlesen Ne Olur?» (النوع أ)
// السكربت والمصادر: السكربتات/sh2-11-agri-cay.txt (5137 م، الغليان ≈ 83 °C)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#E0393E", top2: "#B3182B", hair: "cap", hairColor: "#F6C445" };
const sen = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={980} y={1000} s={0.62} o={SEN} t={t} {...f} />;

// basınç: hava molekülleri (yoğun → seyrek)
const Hava = ({ t, k }: { t: number; k: number }) => {
  const n = Math.round(lerp(90, 26, k));
  return <g>
    <rect width={1920} height={1080} fill={k > 0.5 ? "#5B9BD6" : "#9FD3F0"} />
    {Array.from({ length: n }, (_, i) => <circle key={i} cx={680 + ((i * 137 + Math.sin(t * 2 + i) * 30) % 560)} cy={120 + ((i * 89 + Math.cos(t * 1.7 + i) * 30) % 820)} r={14} fill="#FFFFFF" opacity={0.85} />)}
  </g>;
};
// düdüklü tencere
const Tencere = ({ t, whistle = 0 }: { t: number; whistle?: number }) => (
  <g transform="translate(960,640)">
    <ellipse cy={140} rx={240} ry={30} fill="#5E666C" />
    <rect x={-200} y={-100} width={400} height={240} rx={30} fill="#C9CDD0" stroke="#7E868A" strokeWidth={8} />
    <path d="M-220,-110 H220 Q230,-150 0,-170 Q-230,-150 -220,-110Z" fill="#D9DEE1" stroke="#7E868A" strokeWidth={8} />
    <rect x={200} y={-150} width={170} height={36} rx={18} fill="#2A2E36" />
    <rect x={-20} y={-230} width={40} height={64} rx={10} fill="#2A2E36" />
    {whistle > 0 && [0, 1, 2].map((i) => { const o = (t * 1.6 + i / 3) % 1; return <path key={i} d={`M0,${-240 - o * 220} q30,-30 0,-60 q-30,-30 0,-60`} stroke="#FFFFFF" strokeWidth={14} fill="none" opacity={whistle * (1 - o)} strokeLinecap="round" />; })}
  </g>
);
const Yumurta = ({ t }: { t: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#F4F8FB" />
    <path d="M760,520 Q760,900 960,900 Q1160,900 1160,520Z" fill="#9AA3A8" stroke="#5E666C" strokeWidth={8} />
    <rect x={740} y={500} width={440} height={30} rx={12} fill="#7E868A" />
    <rect x={770} y={560} width={380} height={320} fill="#4FA3FF" opacity={0.5} />
    {[0, 1].map((i) => <ellipse key={i} cx={900 + i * 120} cy={760 + Math.sin(t * 8 + i) * 6} rx={52} ry={68} fill="#FFF6E6" stroke="#D9C8A8" strokeWidth={4} />)}
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={800 + (i * 37) % 320} cy={860 - ((t * 120 + i * 40) % 300)} r={6 + (i % 3) * 3} fill="#FFFFFF" opacity={0.7} />)}
  </g>
);

export const { SECONDS: SH2_11_SECONDS, Comp: Sh2Short11 } = makeShort2({
  words: words as W[],
  audio: "sh2-11",
  hook: "ZİRVEDE ÇAY DEMLESEN?",
  hookUntil: 3,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tKotu = cue("aynı zamanda");
    const S: Sh[] = [
      { c: "Ağrı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.5]} c0={[960, 540]} c1={[1000, 760]}><Dag t={t} steam={1} />{sen(t, { pose: P.hold, holdR: <InceBardak x={0} y={0} s={0.35} t={t} tea={0.2} saucer={false} /> })}</TCam> },
      { c: "Türkiye'nin", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.25]} c0={[960, 220]} c1={[960, 420]}><Dag t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="EN YÜKSEK NOKTA" y={1040} size={80} /> },
      { c: "Beş bin", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 300]}><Dag t={t} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a} to={5137} dur={1.1} unit="METRE" y={420} c="#F6C445" /> },
      { c: "Ocağı", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[1050, 880]}><Dag t={t} steam={0} />{sen(t, { x: 1010, pose: P.reach, mouth: "grin" })}</TCam> },
      { c: "Su çabucak", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[1120, 900]}><Dag t={t} steam={ramp(t, a, a + 0.8)} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.5} text="ÇABUCAK!" y={1040} c="#2EE6D0" rot={-5} /> },
      { c: "Ama bir sorun", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1000, 820]}><Dag t={t} steam={1} />{sen(t, { x: 1000, pose: P.think, brow: "worried", mouth: "flat" })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="AMA BİR SORUN VAR" y={330} c="#F6C445" size={84} /> },
      { c: "Yukarıda", sfx: "whoosh", tone: "cool", r: (t, a) => <Hava t={t} k={ramp(t, a + 0.5, a + 2)} />,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="HAVA BASINCI" y={330} /><Damga t={t} at={a + 1.6} text="DÜŞÜK ↓" y={1040} c="#F6C445" rot={-4} /></> },
      { c: "O yüzden", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Termometre x={940} y={380} s={0.9} v={lerp(100, 83, ramp(t, a + 1.6, a + 3.4))} mark={100} /></g>,
        html: (t, a) => <><VT t={t} at={a + 0.4} text="100°C DEĞİL..." y={330} c="#FFFFFF" /><VT t={t} at={a + 2.8} text="≈ 83°C" y={1060} c="#2EE6D0" size={140} /></> },
      { c: "Su fokur", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3, 3.2]} c0={[1120, 880]} shake={2}><Dag t={t} steam={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="AMA YETERİNCE SICAK DEĞİL" y={330} size={72} /> },
      { c: "Çayı", sfx: "pop", tone: "warm", bg: "#F6EBD2", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}><rect width={1920} height={1080} fill="#F6EBD2" /><InceBardak x={960} y={860} s={2.1} t={t} tea={lerp(0, 0.18, ramp(t, a + 0.3, a + 2))} fill={ramp(t, a, a + 0.8) * 0.85} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.3} text="RENGİ AÇIK" y={330} c="#F6C445" rot={-4} /> },
      { c: "Tadı", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[985, 760]}><Dag t={t} />{sen(t, { pose: P.hand, holdR: <InceBardak x={0} y={0} s={0.35} t={t} tea={0.18} saucer={false} />, eyes: "squint", brow: "angry", mouth: "frown" })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="TADI SULU 🤢" y={330} /> },
      { c: "Yani dünyanın", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.05]} c0={[960, 640]}><Dag t={t} steam={1} />{sen(t, { pose: P.hand, holdR: <InceBardak x={0} y={0} s={0.35} t={t} tea={0.18} saucer={false} />, mouth: "flat" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.4} text="EN MANZARALI ÇAY" y={330} c="#2EE6D0" size={84} />{t > tKotu && <Damga t={t} at={tKotu + 0.6} text="EN KÖTÜ ÇAY" y={1040} c="#E0393E" rot={-6} />}</> },
      { c: "Dağcılar", sfx: "ding", tone: "cool", bg: "#E6EEF4", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><rect width={1920} height={1080} fill="#E6EEF4" /><Tencere t={t} whistle={0.4} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.7} text="DÜDÜKLÜ TENCERE" y={330} size={84} /> },
      { c: "Basıncı", sfx: "boom", tone: "warm", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Termometre x={940} y={380} s={0.9} v={lerp(83, 108, ramp(t, a + 0.6, a + 2.4))} mark={100} /></g>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="DAHA SICAK ✓" y={1060} c="#F6C445" size={110} /> },
      { c: "Peki ya", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 700]}><Yumurta t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="YA YUMURTA? 🥚" y={330} /> },
      { c: "Haşlamak", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={lerp(0, 0.5, ramp(t, a + 0.2, a + 2.2))} label="ÇOK UZUN" /></g> },
      { c: "Sen zirvede", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.3]} c0={[980, 760]}><Dag t={t} steam={1} />{sen(t, { pose: P.cheer, eyes: "happy", mouth: "grin" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="İLK NEYİ YAPARDIN?" y={330} size={84} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
