import words from "../../../public/data/sh2-04-words.json";
import { HERO, Istiklal, Lab, MOM, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Banknot } from "../../components/Para";
import { Lira } from "../../components/K2Dikey";
import { FiyatKart, Raf, RAF_Y } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #4 · «Neden Her Şey 99,90 Lira?» (النوع د، 87/100)
// السكربت والمصدر: السكربتات/sh2-04-fiyat.txt (Thomas & Morwitz 2005)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const KASIYER: Outfit = { ...MOM, top: "#3A7BD5", top2: "#2A5CA0", kind: "vest", inner: "#FFFFFF" };
const G = 1000;
const kart = (t: number, y: number, left: string, rest: string, hl = 0, s = 0.9, c?: string) => <FiyatKart t={t} y={y} s={s} left={left} rest={rest} hlLeft={hl} c={c} />;
// göz: soldan sağa tarama
const goz = (t: number, a: number, y: number) => { const k = ramp(t, a, a + 1.2); return <g><path d={`M${lerp(720, 1200, k)},${y} l-40,-30 v60Z`} fill="#E0393E" /><path d={`M720,${y} H${lerp(720, 1200, k)}`} stroke="#E0393E" strokeWidth={10} strokeDasharray="16 12" /></g>; };
const kasa = (t: number, f: { not?: boolean } = {}) => (
  <g>
    <rect width={1920} height={1080} fill="#EDEAE2" />
    <rect x={600} y={140} width={720} height={60} fill="#E0393E" /><text x={960} y={186} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#FFFFFF">KASA 3</text>
    <TFig x={1100} y={760} s={0.75} o={KASIYER} t={t} pose={P.hold} mouth="smile" dir={-1} />
    <rect x={600} y={700} width={720} height={380} fill="#9AA3A8" /><rect x={600} y={690} width={720} height={30} fill="#C9CDD0" />
    <rect x={1000} y={600} width={150} height={100} rx={8} fill="#2A2E36" /><rect x={1015} y={612} width={120} height={50} fill="#3FAE6A" />
    <text x={1075} y={650} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={34} fill="#0E1A2E">99,90</text>
    {f.not && <Banknot x={820} y={650} s={0.7} v="100" rot={-8} />}
    {[0, 1, 2].map((i) => <rect key={i} x={640 + i * 60} y={620 - i * 6} width={44} height={70 + i * 6} rx={6} fill={["#F28C28", "#7E5BD6", "#E86A92"][i]} />)}
  </g>
);

export const { SECONDS: SH2_04_SECONDS, Comp: Sh2Short04 } = makeShort2({
  words: words as W[],
  audio: "sh2-04",
  hook: "NEDEN HER ŞEY 99,90?",
  hookUntil: 2.3,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tDok = cue("Öbür yanda");
    const tUst = cue("üstü kalsın");
    const S: Sh[] = [
      // 0 · soru
      { c: "Neden", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Raf t={t} />{kart(t, 620, "99", ",90₺", 0, 1.1)}</TCam> },
      { c: "Çünkü", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 560]}><Raf t={t} />{kart(t, 600, "99", ",90₺", ramp(t, a + 1.4, a + 2), 1.1)}{goz(t, a + 1.3, 820)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1.6} text="BEYİN SOLDAN OKUR" y={360} /> },
      // iki ürün
      { c: "Rafta", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Raf t={t} hl={1} />{t > a + 1.4 && kart(t, 380, "100", "₺", 0, 0.8, "#FFFFFF")}{t > a + 2.4 && kart(t, 720, "99", ",90₺", 0, 0.8)}</TCam> },
      { c: "Aradaki", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 540]}><rect width={1920} height={1080} fill="#F6EBD2" /><Lira x={960} y={560} s={3} spin={(t - a) * 6} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="FARK: 10 KURUŞ" y={330} /> },
      // ilk rakam
      { c: "Ama beynin", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 540]}><rect width={1920} height={1080} fill="#14294A" />{kart(t, 360, "100", "₺", ramp(t, a + 1.4, a + 1.9), 0.8, "#FFFFFF")}{kart(t, 720, "99", ",90₺", ramp(t, tDok, tDok + 0.4), 0.8)}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 3} text="1" y={260} size={160} c="#FFFFFF" /><Damga t={t} at={tDok} text="9" y={1060} size={160} c="#F6C445" /></> },
      { c: "Ve karar", sfx: "boing", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 640]}><Raf t={t} /><TFig x={960} y={G} s={0.9} o={SEN} t={t} rim={0.4} pose={P.cheer} mouth="grin" eyes="happy" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1} text="DAHA UCUZ! HEM DE ÇOK!" y={380} c="#F6C445" rot={-5} size={72} /> },
      // bilim
      { c: "Bilim", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}><Lab t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="SOL RAKAM ETKİSİ" y={360} c="#2EE6D0" /> },
      { c: "İki bin", sfx: "pop", tone: "cool", bg: "#14294A", r: (t, a) => {
          const k = ramp(t, a + 2, a + 3.4);
          return <g><rect width={1920} height={1080} fill="#14294A" />
            <rect x={760} y={lerp(900, 300, k)} width={160} height={lerp(0, 600, k)} rx={12} fill="#FFFFFF" /><text x={840} y={960} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#FFFFFF">100₺</text>
            <rect x={1000} y={lerp(900, 560, k)} width={160} height={lerp(0, 340, k)} rx={12} fill="#F6C445" /><text x={1080} y={960} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#F6C445">99,90₺</text>
            <path d="M720,900 H1200" stroke="#FFFFFF" strokeWidth={6} /></g>; },
        html: (t, a) => <><VT t={t} at={a + 0.1} text="2005 · ARAŞTIRMA" y={260} size={80} /><VT t={t} at={a + 3.6} text="ALGI: ÇOK DAHA UCUZ" y={1080} size={72} c="#F6C445" /></> },
      // herkes biliyor
      { c: "Market bunu", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Raf t={t} hl={1} />{[0, 1, 2].map((i) => <g key={i} transform={`translate(${760 + i * 200},${RAF_Y[i] + 40})`}><rect x={-60} y={-22} width={120} height={44} rx={8} fill="#FFE24A" stroke="#141414" strokeWidth={3} /><text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={30} fill="#141414">{["9,90", "49,90", "199,90"][i]}</text></g>)}</TCam> },
      { c: "mağaza", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 560]}><Istiklal t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="MAĞAZA BİLİYOR" y={360} /> },
      { c: "indirim", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}><rect width={1920} height={1080} fill="#E0393E" /><text x={960} y={420} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={120} fill="#FFFFFF">İNDİRİM</text>{kart(t, 660, "499", ",90₺", 0, 0.85)}</TCam> },
      // 10 kuruş nereye
      { c: "Peki o", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 540]}><rect width={1920} height={1080} fill="#F6EBD2" /><Lira x={960 + Math.sin(t * 3) * 40} y={560} s={2.6} spin={(t - a) * 8} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="10 KURUŞ NEREYE?" y={330} /> },
      { c: "Kasada", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 620]}>{kasa(t, { not: t > a + 0.6 })}<TFig x={760} y={G + 40} s={0.85} o={SEN} t={t} pose={P.hand} mouth={t > tUst ? "grin" : "smile"} talk={t > tUst && t < tUst + 0.8} rim={0.4} /></TCam>,
        html: (t) => <Damga t={t} at={tUst} text="ÜSTÜ KALSIN" y={380} c="#F6C445" rot={-5} /> },
      // ders
      { c: "Bir dahaki", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => { const k = ramp(t, a + 2, a + 3); return <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}><rect width={1920} height={1080} fill="#14294A" />{kart(t, 560, "99", ",90₺", 0, 1.05)}<path d={`M${lerp(1200, 720, k)},780 l40,-30 v60Z`} fill="#2EE6D0" /><path d={`M1200,780 H${lerp(1200, 720, k)}`} stroke="#2EE6D0" strokeWidth={10} strokeDasharray="16 12" /></TCam>; },
        html: (t, a) => <VT t={t} at={a + 2} text="SAĞDAN BAK →" y={330} c="#2EE6D0" /> },
      // döngü
      { c: "Sen en son", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Raf t={t} />{kart(t, 620, "99", ",90₺", 0, 1.1)}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN NE ALDIN?" y={300} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={1000} size={80} /></> },
    ];
    return S;
  },
});
