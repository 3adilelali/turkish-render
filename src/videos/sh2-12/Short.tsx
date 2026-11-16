import words from "../../../public/data/sh2-12-words.json";
import { DAD, Living, MOM, Outfit, P, PhoneP, TCam, TFig, TMini, MINI_COLS } from "../../components/Toon";
import { Defter, DugunSalon, Kurdele } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #12 · «Düğünde Takı Sayan Teyze Sen Olsaydın?» (النوع ب)
// السكربت: السكربتات/sh2-12-taki.txt (عادة «takı töreni» بالعرس التركي)

const TEYZE: Outfit = { ...MOM, top: "#7E5BD6", top2: "#5E42A8", hairColor: "#C9A8F2", glasses: true };
const GELIN: Outfit = { top: "#FFFFFF", top2: "#E6E6E6", kind: "coat", inner: "#FFFFFF", hair: "scarf", hairColor: "#FFFFFF", shoes: "#FFFFFF" };
const DAMAT: Outfit = { ...DAD, top: "#2A2E36", top2: "#1A1E24", kind: "coat", inner: "#FFFFFF", mustache: false };
const HALA: Outfit = { ...MOM, top: "#3FAE6A", top2: "#2E8A50", hairColor: "#9AD8B0" };

const cift = (t: number) => <><TFig x={900} y={960} s={0.7} o={GELIN} t={t} seed={2} mouth="smile" /><TFig x={1030} y={960} s={0.74} o={DAMAT} t={t} seed={4} dir={-1} mouth="smile" /></>;
const kalabalik = (t: number) => <g>{Array.from({ length: 10 }, (_, i) => <TMini key={i} x={680 + i * 60} y={1040} s={1.2} c={MINI_COLS[i]} t={t} seed={i} />)}</g>;
const teyze = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={960} y={1000} s={0.95} o={TEYZE} t={t} seed={7} {...f} />;
const Bilezik = ({ k = 1 }: { k?: number }) => <g transform={`translate(960,560) scale(${0.6 + 0.4 * k})`}><ellipse rx={200} ry={200} fill="none" stroke="#F6C445" strokeWidth={34} /><ellipse rx={200} ry={200} fill="none" stroke="#B88A1A" strokeWidth={6} />{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={200 * Math.cos(i / 16 * Math.PI * 2)} cy={200 * Math.sin(i / 16 * Math.PI * 2)} r={8} fill="#FFF3B0" />)}</g>;
const Zarf = ({ t }: { t: number }) => <g transform={`translate(960,560) rotate(${Math.sin(t * 3) * 4})`}><rect x={-240} y={-150} width={480} height={300} rx={14} fill="#F4F1E4" stroke="#B9AE8F" strokeWidth={6} /><path d="M-240,-150 L0,40 L240,-150" fill="none" stroke="#B9AE8F" strokeWidth={6} /><text y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={120} fill="#E0393E">?</text></g>;
const sepia = (k: number) => <rect width={1920} height={1080} fill="#B8864A" opacity={0.35 * k} />;

const LISTE = ["Hala: 1 çeyrek ✓", "Komşu: bilezik (ince)", "Akraba: zarf ???", "Ayşe: AZ!", "Mehmetler: GELMEDİ ✗"];

export const { SECONDS: SH2_12_SECONDS, Comp: Sh2Short12 } = makeShort2({
  words: words as W[],
  audio: "sh2-12",
  hook: "TAKI SAYAN TEYZE SEN OLSAN?",
  hookUntil: 2.8,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tGram = cue("gramıyla");
    const S: Sh[] = [
      { c: "Düğünde", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 600]} c1={[960, 700]}><DugunSalon t={t} />{cift(t)}{teyze(t, { x: 760, eyes: "squint", brow: "up", look: 1, mouth: "flat" })}</TCam> },
      { c: "Takı töreni", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 620]}><DugunSalon t={t} />{cift(t)}{kalabalik(t)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="TAKI TÖRENİ 💍" y={330} /> },
      { c: "Herkes gelinle", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[965, 700]}><DugunSalon t={t} />{cift(t)}</TCam> },
      { c: "Sen hariç", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[960, 760]}><DugunSalon t={t} />{teyze(t, { eyes: "squint", brow: "angry", mouth: "flat", look: 1 })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.2} text="SEN HARİÇ" y={1040} c="#F6C445" rot={-5} /> },
      { c: "Senin gözün", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[960, 440]}><DugunSalon t={t} /><Kurdele t={t} n={0} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="GÖZÜN KURDELEDE 👀" y={1060} size={80} /> },
      { c: "Halan geliyor", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 700]}><DugunSalon t={t} />{cift(t)}<TFig x={780} y={960} s={0.72} o={HALA} t={t} seed={9} pose={P.reach} mouth="grin" /></TCam> },
      { c: "Bir çeyrek", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 420]}><DugunSalon t={t} /><Kurdele t={t} n={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a} text="1 ÇEYREK" y={1060} c="#F6C445" size={120} /> },
      { c: "Not alıyorsun", sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 520]}><rect width={1920} height={1080} fill="#4A2A4E" /><Defter lines={LISTE.slice(0, 1)} k={ramp(t, a + 0.1, a + 1)} title="TAKI DEFTERİ" /></TCam> },
      { c: "Komşu geliyor", sfx: "pop", tone: "gold", bg: "#4A2A4E", r: (t, a) => <g><rect width={1920} height={1080} fill="#4A2A4E" /><Bilezik k={ramp(t, a + 0.6, a + 1.2)} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="1 BİLEZİK" y={330} c="#F6C445" size={120} /> },
      { c: "Kafanda", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, 760]}><DugunSalon t={t} />{teyze(t, { pose: P.think, eyes: "squint", brow: "worried", mouth: "flat" })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.3} text="BU İNCE." y={1040} c="#E0393E" rot={-6} /> },
      { c: "Sonra uzak", sfx: "whoosh", tone: "cool", bg: "#4A2A4E", r: (t) => <g><rect width={1920} height={1080} fill="#4A2A4E" /><Zarf t={t} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.9} text="ZARF ✉️" y={330} size={110} /> },
      { c: "İçinde", sfx: "drone", tone: "cool", bg: "#2A1A2E", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[960, 560]}><rect width={1920} height={1080} fill="#2A1A2E" /><Zarf t={t * 3} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="İÇİNDE NE VAR?!" y={330} /> },
      { c: "Bu seni", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, 740]} shake={6}><DugunSalon t={t} />{teyze(t, { pose: P.shock, eyes: "wide", brow: "angry", mouth: "o", sweat: true })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="DELİ EDİYOR" y={1040} c="#E0393E" rot={-4} /> },
      { c: "Ve geçen", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 640]}><DugunSalon t={t} />{cift(t)}{sepia(1)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="GEÇEN YIL..." y={330} c="#F6C445" /> },
      { c: "Hatırlıyorsun", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, 760]}><DugunSalon t={t} />{teyze(t, { pose: P.point, eyes: "happy", brow: "up", mouth: "grin" })}</TCam>,
        html: (t, a) => <>{t > tGram && <Damga t={t} at={tGram} text="GRAMIYLA!" y={1040} c="#F6C445" rot={-6} size={110} />}</> },
      { c: "Gece eve", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[960, 620]}><Living t={t} night /><TFig x={960} y={1000} s={0.9} o={TEYZE} t={t} seed={7} pose={P.sit} eyes="squint" mouth="flat" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="HERKES UYUYOR 😴" y={330} size={84} /> },
      { c: "Sen deftere", sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 520]}><rect width={1920} height={1080} fill="#2E3A52" /><Defter lines={LISTE.slice(0, 3)} k={ramp(t, a, b)} title="TAKI DEFTERİ" /></TCam> },
      { c: "Kim ne", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><rect width={1920} height={1080} fill="#2E3A52" /><Defter lines={LISTE} k={ramp(t, a - 1.2, b)} title="TAKI DEFTERİ" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="KİM NE TAKTI?" y={330} size={84} /> },
      { c: "Ertesi gün", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 540]}><rect width={1920} height={1080} fill="#F6EBD2" /><g transform="translate(960,560)"><PhoneP s={2.4} ring={(t * 4) % 1} /></g></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="📞 ZIRRR" y={330} /> },
      { c: "Bütün aile", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}><rect width={1920} height={1080} fill="#F6EBD2" />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${760 + (i % 2) * 400},${360 + Math.floor(i / 2) * 400}) rotate(${Math.sin(t * 9 + i) * 8})`}><PhoneP s={1.3} ring={(t * 4 + i * 0.3) % 1} /></g>)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="HERKES DEFTERİ SORUYOR" y={1060} size={70} /> },
      { c: "Çünkü düğünün", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.4]} c0={[960, 720]}><DugunSalon t={t} />{teyze(t, { pose: P.hips, eyes: "happy", mouth: "grin", holdR: undefined })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="DÜĞÜNÜN HAFIZASI" y={330} size={84} /><Damga t={t} at={a + 1.5} text="SENSİN 👑" y={1040} c="#F6C445" rot={-5} /></> },
      { c: "Sizin ailede", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 640]}><DugunSalon t={t} />{cift(t)}{teyze(t, { x: 760, eyes: "squint", look: 1, mouth: "smile" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SİZDE KİM SAYIYOR?" y={330} size={84} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
