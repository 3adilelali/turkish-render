import words from "../../../public/data/sh2-20-words.json";
import { DEDE, P, TCam, TFig, TMini, MINI_COLS, lerp } from "../../components/Toon";
import { TasKapi, YeraltiKesit } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #20 · «Evinin Duvarını Yıksan, Arkasından Bir Şehir Çıksa?» (النوع أ)
// السكربت والمصادر: السكربتات/sh2-20-derinkuyu.txt (Derinkuyu 1963، عمق ≈85 م، تقدير ≈20 ألف شخص)

const TQ = "#2EE6D0";
// evin içi: taş duvar; hole 0..1 yıkılan delik
const Ev = ({ t, hole = 0, light = 0 }: { t: number; hole?: number; light?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8D8BE" />
    {Array.from({ length: 48 }, (_, i) => <rect key={i} x={560 + (i % 8) * 110 + (Math.floor(i / 8) % 2) * 55} y={140 + Math.floor(i / 8) * 120} width={104} height={112} rx={10} fill="#D9C4A0" stroke="#B9A07A" strokeWidth={4} />)}
    <rect y={860} width={1920} height={220} fill="#A67A50" />
    {hole > 0 && <g><ellipse cx={960} cy={560} rx={190 * hole} ry={230 * hole} fill="#1A120C" />{light > 0 && <ellipse cx={960} cy={600} rx={60} ry={90} fill="#FFB84A" opacity={light * (0.3 + 0.1 * Math.sin(t * 6))} />}</g>}
    {hole > 0 && hole < 1 && Array.from({ length: 10 }, (_, i) => <rect key={i} x={900 + Math.cos(i) * 200 * hole} y={560 + ((t * 600 + i * 40) % 300)} width={30} height={26} fill="#D9C4A0" />)}
  </g>
);
const Tunel = ({ t, k = 0 }: { t: number; k?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A120C" />
    {Array.from({ length: 7 }, (_, i) => { const s = 1 - ((i / 7 + t * 0.15 * k) % 1); return <ellipse key={i} cx={960} cy={560 + (1 - s) * 80} rx={460 * s} ry={420 * s} fill="none" stroke="#5E4E40" strokeWidth={30 * s} opacity={s} />; })}
    <ellipse cx={960} cy={640} rx={40} ry={50} fill="#FFB84A" opacity={0.5} />
  </g>
);
const Oda = ({ t, kind }: { t: number; kind: "ahir" | "mutfak" | "kuyu" | "depo" | "baca" }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A1E" />
    <path d="M620,1080 V300 Q960,80 1300,300 V1080Z" fill="#6E5440" />
    <path d="M620,1080 V300 Q960,80 1300,300 V1080Z" fill="url(#tGlow)" opacity={0.15} />
    <rect y={940} width={1920} height={140} fill="#4A3828" />
    {kind === "ahir" && [0, 1].map((i) => <g key={i} transform={`translate(${820 + i * 260},860)`}><ellipse rx={110} ry={60} fill="#F4F1E4" /><circle cx={100} cy={-40} r={36} fill="#F4F1E4" /><rect x={-80} y={40} width={16} height={60} fill="#2A2E36" /><rect x={60} y={40} width={16} height={60} fill="#2A2E36" /></g>)}
    {kind === "mutfak" && <g><rect x={860} y={720} width={200} height={220} fill="#2A1E16" /><path d={`M900,720 q20,-${40 + Math.sin(t * 10) * 10} 40,0 q20,-${40 + Math.cos(t * 9) * 10} 40,0`} fill="#F28C28" /><path d="M960,700 V420" stroke="#2A1E16" strokeWidth={50} opacity={0.6} />{[0, 1, 2].map((i) => <ellipse key={i} cx={760 + i * 60} cy={920} rx={30} ry={40} fill="#B4703A" />)}</g>}
    {kind === "kuyu" && <g><ellipse cx={960} cy={880} rx={180} ry={50} fill="#1A120C" stroke="#8A7A6A" strokeWidth={16} /><path d="M960,880 V500" stroke="#C9B48F" strokeWidth={6} /><rect x={930} y={500} width={60} height={50} fill="#8A5A32" /></g>}
    {kind === "depo" && Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${720 + (i % 3) * 240},${(i < 3 ? 900 : 760)})`}><path d="M-70,0 Q-80,-120 0,-140 Q80,-120 70,0Z" fill="#B4703A" stroke="#8A5A32" strokeWidth={5} /></g>)}
    {kind === "baca" && <g><rect x={930} y={0} width={60} height={940} fill="#1A120C" />{Array.from({ length: 8 }, (_, i) => { const o = (t * 0.5 + i / 8) % 1; return <path key={i} d={`M${940 + (i % 3) * 15},${900 - o * 900} v-40`} stroke="#BFE3F2" strokeWidth={5} opacity={0.6 * (1 - o)} />; })}</g>}
  </g>
);
const Kalabalik = ({ t, k }: { t: number; k: number }) => (
  <g>{Array.from({ length: 8 }, (_, f) => Array.from({ length: Math.round(8 * k) }, (_, i) => <TMini key={`${f}-${i}`} x={720 + (f % 2) * 120 + i * 40} y={290 + f * 105} s={0.5} c={MINI_COLS[(i + f) % 10]} t={t} seed={i + f} />))}</g>
);

export const { SECONDS: SH2_20_SECONDS, Comp: Sh2Short20 } = makeShort2({
  words: words as W[],
  audio: "sh2-20",
  hook: "DUVARIN ARKASINDA ŞEHİR?",
  hookUntil: 3.2,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tKat2 = cue("Sonra bir kat", cue("Sonra bir kat") + 0.5);
    const S: Sh[] = [
      { c: "Evinin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.4]} c0={[960, 560]}><Ev t={t} hole={0.6} light={1} /></TCam> },
      { c: "Yıl", sfx: "tick", tone: "warm", bg: "#2A1E16", r: (t, a) => <g><rect width={1920} height={1080} fill="#2A1E16" /><rect width={1920} height={1080} fill="#B8864A" opacity={0.25} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="1963" y={600} c="#F6C445" size={220} /> },
      { c: "Kapadokya", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 200]}><YeraltiKesit t={t} levels={0} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="KAPADOKYA · DERİNKUYU" y={1040} size={72} /> },
      { c: "Bir adam", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><Ev t={t} /><TFig x={980} y={900} s={0.8} o={DEDE} t={t} seed={3} pose={P.reach} mouth="smile" /></TCam> },
      { c: "Bir duvarı", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.35]} c0={[960, 600]} shake={5}><Ev t={t} hole={ramp(t, a + 0.2, b)} /><TFig x={1180} y={900} s={0.8} o={DEDE} t={t} seed={3} pose={P.cheer} dir={-1} mouth="o" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="GÜM!" y={330} c="#F6C445" rot={-6} /> },
      { c: "Arkasında", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 2.4]} c0={[960, 580]}><Ev t={t} hole={1} /><TFig x={1180} y={900} s={0.8} o={DEDE} t={t} seed={3} pose={P.shock} dir={-1} eyes="wide" mouth="o" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="KARANLIK BİR TÜNEL" y={330} size={84} /> },
      { c: "Tünel aşağı", sfx: "whoosh", tone: "cool", bg: "#1A120C", r: (t) => <Tunel t={t} k={1} /> },
      { c: "Sonra bir oda", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2]} c0={[960, 280]}><YeraltiKesit t={t} levels={1} /></TCam> },
      { c: "Sonra bir kat", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.9, 1.7]} c0={[960, 380]}><YeraltiKesit t={t} levels={t > tKat2 ? 3 : 2} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="BİR KAT DAHA ⬇" y={1040} size={80} /> },
      { c: "Ortaya", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1]} c0={[960, 420]} c1={[960, 560]}><YeraltiKesit t={t} levels={lerp(3, 8, ramp(t, a, a + 2.5))} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 1.8} to={85} dur={1} unit="METRE ALTINDA" y={330} c="#F6C445" /> },
      { c: "dev bir", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 560]}><YeraltiKesit t={t} levels={8} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="YERALTI ŞEHRİ" y={330} c={TQ} rot={-4} size={96} /> },
      { c: "İçinde", sfx: "pop", tone: "warm", r: (t) => <Oda t={t} kind="ahir" />, html: (t, a) => <VT t={t} at={a + 0.4} text="AHIR 🐑" y={330} /> },
      { c: "mutfaklar", sfx: "pop", tone: "warm", r: (t) => <Oda t={t} kind="mutfak" />, html: (t, a) => <VT t={t} at={a} text="MUTFAK 🔥" y={330} /> },
      { c: "kuyular", sfx: "pop", tone: "warm", r: (t) => <Oda t={t} kind="kuyu" />, html: (t, a) => <VT t={t} at={a} text="KUYU 💧" y={330} /> },
      { c: "depolar", sfx: "pop", tone: "warm", r: (t) => <Oda t={t} kind="depo" />, html: (t, a) => <VT t={t} at={a} text="DEPO 🏺" y={330} /> },
      { c: "havalandırma", sfx: "whoosh", tone: "cool", r: (t) => <Oda t={t} kind="baca" />, html: (t, a) => <VT t={t} at={a} text="HAVA BACASI 💨" y={330} /> },
      { c: "Kapılar", sfx: "boom", tone: "warm", bg: "#2A1E16", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><rect width={1920} height={1080} fill="#2A1E16" /><TasKapi roll={ramp(t, a + 1.2, b)} y={600} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="DEV TAŞ TEKERLEK" y={330} size={84} /> },
      { c: "Tahminlere", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 560]}><YeraltiKesit t={t} levels={8} /><Kalabalik t={t} k={ramp(t, a + 0.5, b)} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 1} to={20000} dur={1.4} unit="KİŞİ (TAHMİNİ)" y={330} c="#F6C445" /> },
      { c: "Hayvanlarıyla", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[960, 640]}><YeraltiKesit t={t} levels={8} /><Kalabalik t={t} k={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="+ HAYVANLARI 🐐" y={1040} /> },
      { c: "Ve tüm", sfx: "drone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.6]} c0={[960, 560]} c1={[960, 130]}><YeraltiKesit t={t} levels={8} light={0.5} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.4} text="YÜZYILLARCA BEKLEDİ" y={1040} size={80} /> },
      { c: "Senin evinin", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 560]}><Ev t={t} hole={0.35} light={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="SENİN DUVARIN ARKASINDA?" y={330} size={72} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={1040} size={80} /></> },
    ];
    return S;
  },
});
