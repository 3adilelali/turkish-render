import React from "react";
import words from "../../../public/data/sh2-02-words.json";
import { DAD, DEDE, HERO, Living, MOM, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Banknot } from "../../components/Para";
import { FORMA, GeceSehir, TV } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #2 · «Ailenin Tek Fenerbahçelisi Sen Olsaydın?» (النوع ب، 86/100)
// السكربت: السكربتات/sh2-02-fener.txt

const { FB, GS } = FORMA;
const SEN: Outfit = { ...HERO, kind: "jersey", top: FB.y, top2: FB.n, number: "10" };
const BABA: Outfit = { ...DAD, kind: "jersey", top: GS.y, top2: GS.r };
const ANNE: Outfit = { ...MOM, kind: "jersey", top: GS.y, top2: GS.r };
const DEDEG: Outfit = { ...DEDE, sash: GS.r };
const GENC: Outfit = { ...HERO, kind: "jersey", top: FB.y, top2: FB.n, mustache: true, hairColor: "#2A1E16" };
const G = 1000;
const sepia = <rect width={1920} height={1080} fill="#B08A50" opacity={0.28} />;

// salon + kanepe
const kanepe = (x = 960) => (
  <g>
    <rect x={x - 330} y={760} width={660} height={160} rx={30} fill="#7A3E3E" />
    <rect x={x - 330} y={640} width={660} height={150} rx={40} fill="#8E4A4A" />
    <rect x={x - 370} y={700} width={80} height={220} rx={30} fill="#6E3434" /><rect x={x + 290} y={700} width={80} height={220} rx={30} fill="#6E3434" />
  </g>
);
// küçük forma (elde)
const Forma: React.FC<{ s?: number; c: string; c2: string; fade?: number }> = ({ s = 1, c, c2, fade = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60,-70 L-25,-85 Q0,-70 25,-85 L60,-70 L85,-30 L55,-15 L50,70 L-50,70 L-55,-15 L-85,-30Z" fill={c} stroke="#141414" strokeWidth={4} opacity={1 - fade * 0.6} />
    {[-30, 0, 30].map((x) => <rect key={x} x={x - 8} y={-75} width={16} height={145} fill={c2} opacity={1 - fade * 0.8} />)}
    {fade > 0 && <path d="M-60,-70 L-25,-85 Q0,-70 25,-85 L60,-70 L85,-30 L55,-15 L50,70 L-50,70 L-55,-15 L-85,-30Z" fill="#F4E9F0" opacity={fade * 0.7} />}
  </g>
);
// çamaşır makinesi
const Makine: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g transform="translate(960,620)">
    <rect x={-260} y={-300} width={520} height={600} rx={30} fill="#F2F4F6" stroke="#9AA3A8" strokeWidth={8} />
    <rect x={-230} y={-270} width={460} height={60} rx={10} fill="#DDE2E6" /><circle cx={160} cy={-240} r={20} fill="#9AA3A8" />
    <circle cy={40} r={190} fill="#C9D2D8" stroke="#9AA3A8" strokeWidth={10} />
    <circle cy={40} r={160} fill="#7FB6D8" opacity={0.6} />
    <g transform={`translate(0,40) rotate(${t * 260})`}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-60} y={-60} width={110} height={70} rx={20} transform={`rotate(${i * 90}) translate(40,20)`} fill={i === 0 ? (k > 0.5 ? "#E8C9D8" : FB.y) : "#FFFFFF"} stroke="#9AA3A8" strokeWidth={3} />)}
    </g>
    <circle cy={40} r={160} fill="#FFFFFF" opacity={0.15} />
  </g>
);
// beşik + bebek
const Besik: React.FC<{ t: number; cry: boolean }> = ({ t, cry }) => (
  <g>
    <rect x={720} y={700} width={480} height={220} rx={20} fill="#F7F1E6" stroke="#B48A5A" strokeWidth={10} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={740 + i * 52} y={600} width={14} height={320} fill="#B48A5A" />)}
    <rect x={720} y={590} width={480} height={22} rx={10} fill="#B48A5A" />
    <TFig x={960} y={780} s={0.42} o={{ ...HERO, kind: "sweater", top: GS.y, top2: GS.r, hair: "none" }} t={t} pose={cry ? P.shock : P.stand} eyes={cry ? "closed" : "open"} mouth={cry ? "open" : "smile"} talk={cry} />
    {cry && [0, 1].map((i) => <path key={i} d={`M${930 + i * 60},${600} q${(i ? 1 : -1) * 20},-30 0,-60`} stroke="#5FB6E8" strokeWidth={8} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 8 + i)} />)}
  </g>
);
// balkon korkuluğu (gece şehir üstünde)
const balkon = (
  <g>
    <rect y={900} width={1920} height={180} fill="#3A3F4A" />
    <rect x={600} y={700} width={720} height={16} fill="#8A929C" />
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={610 + i * 56} y={716} width={10} height={190} fill="#8A929C" />)}
  </g>
);
const aile = (t: number, f: { mood?: "happy" | "flat" | "cheer"; sen?: Partial<React.ComponentProps<typeof TFig>> } = {}) => {
  const m = f.mood ?? "happy";
  const pose = m === "cheer" ? P.cheer : P.stand;
  const fx = { pose, t, mouth: m === "flat" ? ("flat" as const) : ("grin" as const), eyes: m === "cheer" ? ("happy" as const) : ("open" as const), brow: m === "flat" ? ("angry" as const) : ("none" as const) };
  return (
    <g>
      <TFig x={760} y={G - 60} s={0.78} o={BABA} seed={1} {...fx} />
      <TFig x={1160} y={G - 60} s={0.76} o={ANNE} seed={2} {...fx} />
      <TFig x={960} y={G} s={0.86} o={SEN} seed={3} t={t} rim={0.4} {...f.sen} />
    </g>
  );
};

export const { SECONDS: SH2_02_SECONDS, Comp: Sh2Short02 } = makeShort2({
  words: words as W[],
  audio: "sh2-02",
  hook: "AİLENİN TEK FENERLİSİ SEN?",
  hookUntil: 2.7,
  build: (cue) => {
    const tAc = cue("Acıkmamıştın");
    const tYor = cue("Yorumlara");
    const tGol1 = cue("gol atıyor");
    const tYar = cue("yarıya");
    const S: Sh[] = [
      // 0 · soru
      { c: "Ailenin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.3]} c0={[960, 640]}><Living t={t} night={false} />{aile(t, { mood: "flat", sen: { mouth: "grin", eyes: "happy", pose: P.wave } })}</TCam> },
      { c: "Baban", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.85]} c0={[800, 640]}><Living t={t} night={false} /><TFig x={820} y={G} s={0.95} o={BABA} t={t} pose={P.cheer} mouth="grin" eyes="happy" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="GALATASARAYLI" y={380} c={GS.y} /> },
      { c: "Annen", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.85]} c0={[1100, 640]}><Living t={t} night={false} /><TFig x={1100} y={G} s={0.92} o={ANNE} t={t} pose={P.wave} mouth="grin" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="GALATASARAYLI" y={380} c={GS.y} /> },
      { c: "Deden", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 640]}><Living t={t} night={false} /><TFig x={960} y={G} s={0.95} o={DEDEG} t={t} pose={P.hips} mouth="smile" brow="up" /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.3} to={40} unit="YILLIK GS" y={360} c={GS.y} /> },
      // doğum
      { c: "Doğduğun", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 760]}><rect width={1920} height={1080} fill="#F3E6EC" /><Besik t={t} cry={false} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="SARI-KIRMIZI ZIBIN" y={380} c={GS.y} /> },
      { c: "Sen ağladın", sfx: "buzz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 720]} shake={2}><rect width={1920} height={1080} fill="#F3E6EC" /><Besik t={t} cry /></TCam> },
      { c: "Herkes", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}><rect width={1920} height={1080} fill="#F3E6EC" /><Besik t={t} cry /><TFig x={760} y={G + 60} s={0.8} o={ANNE} t={t} pose={P.hold} holdR={<g><rect x={-14} y={-50} width={28} height={60} rx={10} fill="#FFFFFF" stroke="#9AA3A8" strokeWidth={3} /><rect x={-8} y={-66} width={16} height={18} rx={6} fill="#F2C14E" /></g>} mouth="smile" /></TCam>,
        html: (t) => <Damga t={t} at={tAc} text="ACIKMAMIŞTIN" y={420} c={FB.y} rot={-6} /> },
      // ilk forma
      { c: "Yedi", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Living t={t} night={false} /><TFig x={960} y={G} s={0.7} o={{ ...HERO, kind: "sweater" }} t={t} pose={P.hold} mouth="grin" eyes="happy" holdR={<Forma s={0.9} c={FB.y} c2={FB.n} />} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.3} text="İLK SARI-LACİVERT" y={380} c={FB.y} /> },
      { c: "Annen onu", sfx: "splash", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 620]}><rect width={1920} height={1080} fill="#E6EEF2" /><Makine t={t} k={ramp(t, a + 1.2, b)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="BEYAZLARLA..." y={330} /> },
      // derbi
      { c: "Derbi", sfx: "whistle", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 600]}><Living t={t} /><TV t={t} y={400} s={1.05} />{kanepe()}{aile(t)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="DERBİ GÜNÜ" y={1000} /> },
      { c: "Fenerbahçe gol", sfx: "boom", tone: "night", r: (t, a, b) => { const f = 1 - ramp(t, tGol1 - 0.1, tGol1 + 1.2); return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]} shake={4 * f}><Living t={t} /><TV t={t} y={400} s={1.05} score="1 - 0" flash={f} side="FB" />{kanepe()}{aile(t, { mood: "flat", sen: { pose: P.cheer, mouth: "open", eyes: "happy", talk: true } })}</TCam>; } },
      { c: "Ev sessiz", sfx: "tick", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[960, 700]}><Living t={t} />{kanepe()}{aile(t, { mood: "flat", sen: { pose: P.stand, mouth: "flat", eyes: "wide", sweat: true } })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="SESSİZLİK" y={420} c="#FFFFFF" rot={4} /> },
      { c: "Sonra onlar", sfx: "boom", tone: "night", r: (t, a, b) => { const f = 1 - ramp(t, a + 0.9, a + 2); return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]} shake={7 * f}><Living t={t} /><TV t={t} y={400} s={1.05} score="1 - 1" flash={f} side="GS" />{kanepe()}{aile(t, { mood: "cheer", sen: { pose: P.stand, mouth: "frown", brow: "worried" } })}</TCam>; },
        html: (t, a) => <Damga t={t} at={a + 1.8} text="EV YIKILIYOR" y={1020} c={GS.y} rot={-5} /> },
      { c: "Sen balkondasın", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 620]}><GeceSehir t={t} stars={0.6} />{balkon}<TFig x={960} y={G} s={0.85} o={SEN} t={t} pose={P.think} mouth="flat" lookY={-0.6} rim={0.5} /></TCam> },
      // bayram
      { c: "Bayramda", sfx: "doorbell", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 640]}><Living t={t} night={false} /><TFig x={820} y={G} s={0.9} o={DEDEG} t={t} pose={P.hand} holdR={<Banknot x={0} y={0} s={0.35} v="200" />} mouth="smile" /><TFig x={1110} y={G} s={0.8} o={SEN} t={t} dir={-1} pose={P.reach} mouth="grin" eyes="happy" /></TCam> },
      { c: "Hala mı", sfx: "boing", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[830, G - 470]}><Living t={t} night={false} /><TFig x={820} y={G} s={0.9} o={DEDEG} t={t} pose={P.hand} holdR={<Banknot x={0} y={0} s={0.35} v="200" />} mouth="flat" brow="up" look={0.6} talk={t < a + 0.6} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="HÂLÂ MI?" y={380} size={120} c={GS.y} /> },
      { c: "Sen hala", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[1110, G - 420]}><Living t={t} night={false} /><TFig x={1110} y={G} s={0.8} o={SEN} t={t} dir={-1} pose={P.hips} mouth="grin" talk={t < a + 0.9} rim={0.4} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="HÂLÂ!" y={380} size={120} c={FB.y} /> },
      { c: "Harçlık yarıya", sfx: "buzz", tone: "gold", r: (t) => { const k = ramp(t, tYar, tYar + 0.4); return <g><rect width={1920} height={1080} fill="#F6EBD2" /><Banknot x={960} y={560} s={1.6} v={k < 0.5 ? "200" : "100"} rot={-4} /><path d={`M${lerp(620, 1300, k)},400 L620,720`} stroke="#E0393E" strokeWidth={16} strokeLinecap="round" opacity={k > 0 ? 1 : 0} /></g>; },
        html: (t) => <Damga t={t} at={tYar + 0.3} text="-%50" y={900} c="#E0393E" rot={-8} size={140} /> },
      // dede yanına oturuyor
      { c: "Bir gün maçta", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.35, 1.5]} c0={[960, 600]}><Living t={t} /><TV t={t} y={400} s={1.05} score="0 - 0" />{kanepe()}<TFig x={1060} y={G - 40} s={0.8} o={SEN} t={t} rim={0.4} pose={P.stand} mouth="flat" look={-0.4} /><TFig x={lerp(700, 860, ramp(t, a, a + 1.4))} y={G - 40} s={0.82} o={DEDEG} t={t} pose={P.stand} mouth="smile" /></TCam> },
      { c: "Fenerbahçe gol atıyor. Deden", sfx: "boom", tone: "night", r: (t, a, b) => { const f = 1 - ramp(t, a, a + 1.2); return <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 600]} shake={3 * f}><Living t={t} /><TV t={t} y={400} s={1.05} score="1 - 0" flash={f} />{kanepe()}<TFig x={1060} y={G - 40} s={0.8} o={SEN} t={t} rim={0.4} pose={P.cheer} mouth="open" eyes="happy" /><TFig x={860} y={G - 40} s={0.82} o={DEDEG} t={t} pose={P.stand} mouth="flat" /></TCam>; } },
      { c: "hafifçe", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3]} c0={[860, G - 480]}><Living t={t} />{kanepe()}<TFig x={860} y={G - 40} s={0.82} o={DEDEG} t={t} pose={P.stand} mouth={t > a + 0.4 ? "smile" : "flat"} eyes={t > a + 0.4 ? "happy" : "open"} look={0.5} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.5} text=":)" y={420} c={FB.y} /> },
      // flashback
      { c: "Meğer", sfx: "whoosh", tone: "gold", bg: "#3A2A1A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><Living t={t} night={false} /><TFig x={960} y={G} s={0.9} o={GENC} t={t} pose={P.cheer} mouth="grin" eyes="happy" />{sepia}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="GENÇKEN..." y={380} c={FB.y} /> },
      { c: "Ailenin tek", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 620]}><Living t={t} night={false} /><TFig x={860} y={G} s={0.88} o={{ ...DEDEG, sash: FB.n }} t={t} pose={P.cheer} mouth="grin" eyes="happy" /><TFig x={1080} y={G} s={0.8} o={SEN} t={t} dir={-1} pose={P.cheer} mouth="grin" eyes="happy" rim={0.4} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="YALNIZ DEĞİLDİN" y={380} c={FB.y} /> },
      // döngü: aile
      { c: "Senin ailende", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 640]}><Living t={t} night={false} />{aile(t, { mood: "flat", sen: { mouth: "grin", eyes: "happy", pose: P.wave } })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SENİN AİLENDE?" y={360} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={560} size={80} /></> },
    ];
    return S;
  },
});
