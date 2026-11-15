import words from "../../../public/data/sh2-09-words.json";
import { HERO, KIDO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Banknot } from "../../components/Para";
import { Raf, RAF_Y } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #9 · «Markette En Pahalı Ürün Neden Göz Hizasında?» (النوع د، 87/100)
// السكربت والمصادر: السكربتات/sh2-09-market.txt (Musicus, Tal & Wansink 2014)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const COCUK: Outfit = { ...KIDO };
const G = 1060;
// göz çizgisi
const bakis = (x: number, y: number, x2: number, y2: number, k = 1, c = "#E0393E") => <path d={`M${x},${y} L${lerp(x, x2, k)},${lerp(y, y2, k)}`} stroke={c} strokeWidth={8} strokeDasharray="18 12" strokeLinecap="round" />;
// raf haritası ızgarası
const izgara = (k: number) => <g opacity={k}>{RAF_Y.map((y, i) => <g key={i}><rect x={650} y={y - 170} width={620} height={190} fill={["#3A7BD5", "#E0393E", "#F6C445", "#3FAE6A"][i]} opacity={0.22} /><text x={1240} y={y - 120} textAnchor="end" fontFamily="Poppins" fontWeight={900} fontSize={40} fill="#141414">{["ÜST", "GÖZ HİZASI", "ÇOCUK", "ALT"][i]}</text></g>)}</g>;
// kasa önü rafı
const KasaOnu = ({ t }: { t: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#EDEAE2" />
    <rect x={600} y={140} width={720} height={60} fill="#E0393E" /><text x={960} y={186} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#FFFFFF">KASA</text>
    <rect x={640} y={420} width={300} height={600} fill="#C9C2B0" stroke="#8A8270" strokeWidth={6} />
    {Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, i) => <rect key={`${r}${i}`} x={656 + i * 70} y={450 + r * 140} width={58} height={100} rx={8} fill={[["#E86A92", "#F6C445", "#3FAE6A", "#7E5BD6"], ["#8B4A2A", "#6E3A20", "#A85A28", "#8B4A2A"], ["#2A2E36", "#F28C28", "#2A2E36", "#F28C28"], ["#E0393E", "#3A7BD5", "#F6C445", "#E86A92"]][r][i]} />))}
    <rect x={960} y={700} width={360} height={380} fill="#9AA3A8" /><rect x={960} y={690} width={360} height={30} fill="#C9CDD0" />
    <rect x={1150} y={590} width={140} height={100} rx={8} fill="#2A2E36" /><rect x={1164} y={602} width={112} height={50} fill="#3FAE6A" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
  </g>
);

export const { SECONDS: SH2_09_SECONDS, Comp: Sh2Short09 } = makeShort2({
  words: words as W[],
  audio: "sh2-09",
  hook: "PAHALI ÜRÜN NEDEN GÖZ HİZASINDA?",
  hookUntil: 3.5,
  build: (cue) => {
    const tHar = cue("harita");
    const tBed = cue("raf bedeli");
    const tEg = cue("Eğil");
    const tSak = cue("Sakız"), tCik = cue("çikolata"), tPil = cue("pil");
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      // 0 · soru
      { c: "Markette", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.3]} c0={[960, 420]}><Raf t={t} hl={1} /></TCam> },
      { c: "Çünkü raf", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 560]}><Raf t={t} />{izgara(ramp(t, tHar - 0.2, tHar + 0.4))}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="RAF RASTGELE DEĞİL" y={330} size={80} /><Damga t={t} at={tHar} text="RAF = HARİTA" y={1040} c="#F6C445" rot={-4} /></> },
      { c: "Göz hizası, en", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 580]}><Raf t={t} hl={1} /><TFig x={820} y={G} s={1.1} o={SEN} t={t} rim={0.4} pose={P.stand} mouth="smile" look={0.6} />{bakis(850, 520, 1180, RAF_Y[1] - 80, ramp(t, a + 0.3, a + 1))}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1} text="EN ÇOK SATILAN YER" y={330} size={80} /> },
      { c: "Marketçilerin", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, RAF_Y[1] - 80]}><Raf t={t} hl={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 1.5} text="GÖZ HİZASI" y={330} c="#2EE6D0" size={110} /><VT t={t} at={a + 2.5} text="= SATIŞ HİZASI" y={480} c="#F6C445" size={100} /></> },
      { c: "Markalar", sfx: "whoosh", tone: "gold", r: (t, a, b) => { const k = ramp(t, a + 0.6, a + 1.6); return <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, RAF_Y[1] - 60]}><Raf t={t} hl={1} /><Banknot x={lerp(1500, 960, k)} y={RAF_Y[1] - 60} s={0.8} v="200" rot={lerp(20, -4, k)} /></TCam>; },
        html: (t) => <Damga t={t} at={tBed} text="RAF BEDELİ 💸" y={1040} c="#F6C445" rot={-5} /> },
      { c: "Ucuzunu", sfx: "pop", tone: "warm", r: (t, a, b) => { const e = ramp(t, tEg, tEg + 0.4); return <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 640]} c1={[960, 820]}><Raf t={t} hl={t > tEg ? 3 : -1} /><TFig x={820} y={G} s={1.1} o={SEN} t={t} rim={0.4} pose={{ ...P.reach, lean: 30 * e }} mouth="grin" lookY={e} /></TCam>; },
        html: (t) => <Damga t={t} at={tEg} text="EĞİL ↓ EN ALT RAF" y={330} c="#3FAE6A" rot={-4} size={80} /> },
      // çocuklar
      { c: "Peki ya", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}><Raf t={t} hl={2} /><TFig x={820} y={G} s={0.6} o={COCUK} t={t} pose={P.point} mouth="grin" eyes="happy" />{bakis(840, 830, 1160, RAF_Y[2] - 60, ramp(t, a + 1.3, a + 2))}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1.3} text="ÇOCUĞUN GÖZ HİZASI" y={330} size={80} /> },
      { c: "Şekerler", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, RAF_Y[2] - 60]}><Raf t={t} hl={2} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="ŞEKER · OYUNCAK" y={330} c="#F6C445" /> },
      // araştırma
      { c: "En ilginci", sfx: "ding", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.6]} c0={[960, 560]} c1={[880, RAF_Y[2] - 90]}><Raf t={t} gevrek={ramp(t, a + 1, a + 1.6)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.7} text="2014 · ARAŞTIRMA" y={330} c="#2EE6D0" /> },
      { c: "karakterlerin aşağıya", sfx: "boing", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[900, 720]}><Raf t={t} gevrek={1} /><TFig x={980} y={G} s={0.6} o={COCUK} t={t} pose={P.stand} mouth="grin" eyes="happy" lookY={-0.6} look={-0.4} />{bakis(880, RAF_Y[2] - 80, 970, 820, ramp(t, a + 0.4, a + 1.4), "#F6C445")}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.6} text="GÖZ GÖZE 👀" y={330} c="#F6C445" rot={-4} /> },
      // kasa önü
      { c: "Bir de kasa", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[900, 640]}><KasaOnu t={t} /></TCam>,
        html: (t) => <><VT t={t} at={tSak} text="SAKIZ" y={300} size={80} /><VT t={t} at={tCik} text="ÇİKOLATA" y={420} size={80} /><VT t={t} at={tPil} text="PİL" y={540} size={80} c="#F6C445" /></> },
      { c: "Sırada", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[880, 700]}><KasaOnu t={t} /><TFig x={1040} y={G} s={0.95} o={SEN} t={t} rim={0.4} dir={-1} pose={t > a + 1.2 ? P.hand : P.stand} holdR={t > a + 1.2 ? <rect x={-24} y={-40} width={48} height={70} rx={6} fill="#8B4A2A" /> : undefined} mouth="grin" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.2} text="ELİNE ALDIN 😅" y={330} c="#F6C445" rot={-4} /> },
      { c: "Bir dahaki", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]} c1={[960, 760]}><Raf t={t} hl={3} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.3} text="ÖNCE AŞAĞI BAK ↓" y={330} c="#3FAE6A" rot={-4} size={80} /> },
      // döngü
      { c: "Sen kasada", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[900, 680]}><KasaOnu t={t} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN EN SON NE ALDIN?" y={330} size={80} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
