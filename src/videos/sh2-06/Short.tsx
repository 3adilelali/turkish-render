import React from "react";
import words from "../../../public/data/sh2-06-words.json";
import { DAD, DEDE, HERO, Living, MOM, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Landing } from "../../components/K2Kit";
import { Banknot } from "../../components/Para";
import { BaklavaMasa, Saat } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #6 · «Bayramda Ailenin En Küçük Torunu Olsaydın?» (النوع ب)
// السكربت: السكربتات/sh2-06-bayram.txt

const KUCUK: Outfit = { ...HERO, kind: "sweater", top: "#FFFFFF", top2: "#DDE2E6", shoes: "#3A2A20" };
const BUYUK: Outfit = { ...HERO, kind: "suit", top: "#3A4A5E", top2: "#2A3646", mustache: true, shoes: "#1E1E1E" };
const TEYZE: Outfit = { ...MOM, top: "#7E5BD6", top2: "#5E3FB0", hairColor: "#C9B8E8" };
const TEYZE2: Outfit = { ...MOM, top: "#3FAE6A", top2: "#2E8A52", hairColor: "#F6E7B0" };
const AMCA: Outfit = { ...DAD, top: "#8B6B4A", top2: "#6E5338" };
const G = 1035;
const PARA: [string, string][] = [["50", "#E8A04A"], ["100", "#8FC17A"], ["200", "#C98AB8"]];
const kapi = (t: number, plate: string, who: Outfit, open: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <Landing t={t} plate={plate} open={open} inside={<TFig x={960} y={G} s={0.9} o={who} t={t} pose={P.hand} mouth="grin" eyes="happy" {...f} />} />;
const kucuk = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={1120} y={G + 10} s={0.62} o={KUCUK} t={t} dir={-1} rim={0.4} pose={P.reach} mouth="smile" {...f} />;

export const { SECONDS: SH2_06_SECONDS, Comp: Sh2Short06 } = makeShort2({
  words: words as W[],
  audio: "sh2-06",
  hook: "BAYRAMDA EN KÜÇÜK TORUN?",
  hookUntil: 3.4,
  build: (cue) => {
    const tKas = cue("Kaşındırıyor");
    const tMas = cue("Maşallah");
    const tKac = cue("Kaçıncı");
    const tP = [cue("Elli"), cue("yüz, iki"), cue("iki yüz")];
    const tVer = cue("Ver bakalım");
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      // 0 · soru
      { c: "Bayramda", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 700]}><Landing t={t} plate="3" /><TFig x={960} y={G + 10} s={0.62} o={KUCUK} t={t} rim={0.4} pose={P.wave} mouth="grin" eyes="happy" /></TCam> },
      { c: "Sabah", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={7 - (1 - ramp(t, a, a + 0.8)) * 0.3} label="07:00" /></g> },
      { c: "Annen seni", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 660]}><Living t={t} night={false} /><TFig x={820} y={G - 35} s={0.88} o={MOM} t={t} pose={P.wave} mouth="open" talk /><TFig x={1100} y={G - 35} s={0.62} o={KUCUK} t={t} pose={P.stand} eyes={t > a + 0.8 ? "squint" : "closed"} mouth="flat" dir={-1} /></TCam> },
      { c: "Yeni", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, G - 260]}><Living t={t} night={false} /><TFig x={960} y={G - 35} s={0.75} o={KUCUK} t={t} pose={t > tKas ? P.think : P.hips} mouth={t > tKas ? "frown" : "flat"} brow={t > tKas ? "worried" : "none"} sweat={t > tKas} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="YENİ GÖMLEK" y={330} /><Damga t={t} at={tKas} text="KAŞINIYOR!" y={1040} c="#E0393E" rot={-6} /></> },
      // kapılar
      { c: "İlk kapı", sfx: "doorbell", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1000, 680]}>{kapi(t, "3", TEYZE, ramp(t, a, a + 0.6))}{kucuk(t)}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.2} text="1. KAPI" y={330} c="#F6C445" rot={-4} /><VT t={t} at={a + 1.8} text="EL ÖPME" y={1040} size={80} /></> },
      { c: "Yanağını", sfx: "boing", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1080, G - 330]}>{kapi(t, "3", TEYZE, 1, { pose: P.reach, talk: t > tMas })}{kucuk(t, { eyes: "squint", mouth: "flat", pose: P.stand })}<circle cx={1095} cy={G - 280} r={18} fill="#F28C8C" opacity={0.7} /></TCam>,
        html: (t) => <VT t={t} at={tMas} text="MAŞALLAH!" y={330} c="#F6C445" size={110} /> },
      { c: "İkinci kapı", sfx: "doorbell", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1000, 680]}>{kapi(t, "5", TEYZE2, ramp(t, a, a + 0.6), { talk: true })}{kucuk(t, { mouth: "flat", pose: P.stand })}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.2} text="2. KAPI" y={330} c="#F6C445" rot={4} /><VT t={t} at={a + 1.2} text="AYNI CÜMLE" y={1040} size={80} /></> },
      { c: "Üçüncü kapı", sfx: "doorbell", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[1000, 680]}>{kapi(t, "8", AMCA, ramp(t, a, a + 0.6), { pose: P.point, talk: true, mouth: "open" })}{kucuk(t, { mouth: "frown", brow: "worried", pose: P.stand, sweat: t > tKac })}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.2} text="3. KAPI" y={330} c="#F6C445" rot={-4} /><VT t={t} at={a + 1} text="OKUL NASIL?" y={460} size={80} /><VT t={t} at={tKac} text="KAÇINCI OLDUN?" y={1040} size={80} c="#E0393E" /></> },
      // tatlı
      { c: "Masada", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 760]}><BaklavaMasa t={t} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.4} to={12} dur={0.8} unit="ÇEŞİT TATLI" y={330} c="#F6C445" /> },
      { c: "Sana sadece", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[860, 700]}><BaklavaMasa t={t} take={ramp(t, a + 1.2, a + 1.6)} /><TFig x={900} y={1140} s={0.62} o={KUCUK} t={t} pose={P.reach} mouth="grin" eyes="happy" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1} text="SADECE 1 TANE" y={330} c="#E0393E" rot={-5} /> },
      // harçlık
      { c: "Sonra en", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 680]}><Living t={t} night={false} /><TFig x={820} y={G - 35} s={0.9} o={DEDE} t={t} pose={P.hand} mouth="smile" holdR={<Banknot x={0} y={0} s={0.35} v="200" glow={ramp(t, a + 1.2, a + 2)} />} />{kucuk(t, { x: 1080, y: G - 30, mouth: "grin", eyes: "happy" })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1.8} text="HARÇLIK!" y={330} c="#F6C445" size={120} /> },
      { c: "Cebin", sfx: "ding", tone: "gold", r: (t) => <g><rect width={1920} height={1080} fill="#F6EBD2" />{PARA.map(([v, c], i) => t > tP[i] - 0.1 && <Banknot key={v} x={960 + (i - 1) * 30} y={lerp(-200, 420 + i * 150, ramp(t, tP[i] - 0.1, tP[i] + 0.3))} s={1.1} v={v} c={c} rot={(i - 1) * 6} />)}</g>,
        html: (t) => <>{PARA.map(([v], i) => <Damga key={v} t={t} at={tP[i]} text={`+${v}`} y={240 + i * 150} c="#3FAE6A" size={110} rot={(i - 1) * 5} />)}</> },
      // annem saklar
      { c: "Akşam", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 680]}><Living t={t} /><TFig x={820} y={G - 35} s={0.88} o={MOM} t={t} pose={P.reach} mouth="smile" /><TFig x={1100} y={G - 35} s={0.62} o={KUCUK} t={t} dir={-1} pose={P.hold} mouth="flat" holdR={<Banknot x={0} y={0} s={0.3} v="200" />} /></TCam> },
      { c: "Ver bakalım", sfx: "boing", tone: "night", r: (t, a, b) => { const k = ramp(t, tVer + 0.6, tVer + 1.3); return <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, G - 300]}><Living t={t} /><TFig x={820} y={G - 35} s={0.88} o={MOM} t={t} pose={P.hand} mouth="grin" talk={t < tVer + 1.2} /><TFig x={1100} y={G - 35} s={0.62} o={KUCUK} t={t} dir={-1} pose={P.stand} mouth="o" eyes="wide" />{PARA.map(([v, c], i) => <Banknot key={v} x={lerp(1080, 870, k) + i * 10} y={lerp(G - 250, G - 400, k) - i * 8} s={0.35} v={v} c={c} op={1 - ramp(t, b - 0.4, b)} />)}</TCam>; },
        html: (t) => <Damga t={t} at={tVer + 0.6} text="BEN SAKLARIM 😇" y={330} c="#F6C445" rot={-4} size={80} /> },
      { c: "Yirmi yıl", sfx: "tick", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.65]} c0={[960, 680]}><Living t={t} night={false} /><TFig x={960} y={G - 35} s={0.95} o={BUYUK} t={t} pose={P.shrug} mouth="flat" brow="up" /></TCam>,
        html: (t, a) => <><Sayi t={t} at={a + 0.1} to={20} dur={0.8} unit="YIL GEÇTİ" y={300} /><Damga t={t} at={a + 2.4} text="HÂLÂ SAKLANIYOR" y={1040} c="#E0393E" rot={-5} size={80} /></> },
      // döngü
      { c: "Senin bayram", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 700]}><Landing t={t} plate="3" /><TFig x={960} y={G + 10} s={0.62} o={KUCUK} t={t} rim={0.4} pose={P.shrug} mouth="grin" /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SENİN HARÇLIĞIN NEREDE?" y={330} size={76} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
