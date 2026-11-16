import words from "../../../public/data/sh2-16-words.json";
import { DAD, DEDE, HERO, KIDO, MOM, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { BakkalOn, Defter } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #16 · «Bir Günlüğüne Mahallenin Bakkalı Sen Olsaydın?» (النوع ب)
// السكربت: السكربتات/sh2-16-bakkal.txt (veresiye defteri، bakkal kapanmaz)

const SEN: Outfit = { ...HERO, kind: "vest", top: "#3FAE6A", top2: "#2E8A50", inner: "#F4F4F2", mustache: true };
const TEYZE2: Outfit = { ...MOM, top: "#E86A92", top2: "#C24F75", hairColor: "#F6C445" };
const bakkal = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={1080} y={1000} s={0.7} o={SEN} t={t} seed={3} {...f} />;
const Saatli = ({ t, s }: { t: number; s: string }) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><text x={960} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={220} fill="#F6C445" opacity={0.9 + 0.1 * Math.sin(t * 6)}>{s}</text></g>;
const Radyo = ({ t }: { t: number }) => <g transform="translate(960,870)"><rect x={-60} y={-50} width={120} height={80} rx={12} fill="#8A5A32" /><circle cx={-24} cy={-10} r={22} fill="#2A2E36" /><path d="M20,-30 h24 M20,-14 h24 M20,2 h24" stroke="#F4E6CC" strokeWidth={4} />{[0, 1, 2].map((i) => { const o = (t + i / 3) % 1; return <path key={i} d={`M${60 + o * 60},-40 q14,30 0,60`} stroke="#F6C445" strokeWidth={5} fill="none" opacity={1 - o} />; })}</g>;
const Yumurta = () => <ellipse cx={0} cy={0} rx={22} ry={28} fill="#FFF6E6" stroke="#D9C8A8" strokeWidth={3} />;
const VERESIYE = ["Ayşe Hn: 2 ekmek", "Kemal: süt + yoğurt", "3. kat: deterjan", "Okan: sigara (!)"];

export const { SECONDS: SH2_16_SECONDS, Comp: Sh2Short16 } = makeShort2({
  words: words as W[],
  audio: "sh2-16",
  hook: "BİR GÜNLÜĞÜNE BAKKAL SEN?",
  hookUntil: 3,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tKimin = cue("kimin");
    const S: Sh[] = [
      { c: "Bir günlüğüne", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.25]} c0={[960, 560]} c1={[1000, 700]}><BakkalOn t={t} />{bakkal(t, { pose: P.wave, mouth: "grin" })}</TCam> },
      { c: "Sabah altı", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t) => <Saatli t={t} s="06:00" /> },
      { c: "Kepengi", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><BakkalOn t={t} open={ramp(t, a + 0.2, b)} night={0.6} />{bakkal(t, { pose: P.reach, mouth: "flat", eyes: "squint" })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="KEPENK ↑" y={330} /> },
      { c: "Ekmekler", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[860, 770]}><BakkalOn t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="SICAK EKMEK 🥖" y={330} /> },
      { c: "Yedi buçuk", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t) => <Saatli t={t} s="07:30" /> },
      { c: "İlk müşteri", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 760]}><BakkalOn t={t} />{bakkal(t)}<TFig x={lerp(700, 840, ramp(t, a, a + 1))} y={1000} s={0.45} o={KIDO} t={t} seed={5} mouth="smile" /></TCam> },
      { c: "Annem", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.1]} c0={[880, 830]}><BakkalOn t={t} />{bakkal(t, { look: -1 })}<TFig x={840} y={1000} s={0.45} o={KIDO} t={t} seed={5} pose={P.wave} mouth="open" talk /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="“ANNEM 2 EKMEK İSTEDİ”" y={330} size={72} /> },
      { c: "Parayı", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.3]} c0={[1060, 760]}><BakkalOn t={t} />{bakkal(t, { pose: P.shrug, mouth: "flat", brow: "up" })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="PARA SONRA 😅" y={1040} c="#F6C445" rot={-5} /> },
      { c: "Veresiye", sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 520]}><rect width={1920} height={1080} fill="#A86E40" /><Defter lines={VERESIYE} k={0.25 + ramp(t, a + 0.5, b) * 0.25} title="VERESİYE" c="#3A2A20" /></TCam> },
      { c: "Bu defter", sfx: "drone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 500]}><rect width={1920} height={1080} fill="#A86E40" /><Defter lines={VERESIYE} k={1} title="VERESİYE" c="#3A2A20" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.2} text="MAHALLENİN SIRLARI 🤫" y={1060} c="#F6C445" rot={-4} size={74} /> },
      { c: "Öğlen", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t) => <Saatli t={t} s="12:00" /> },
      { c: "Teyzeler", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 760]}><BakkalOn t={t} />{bakkal(t, { x: 1140 })}<TFig x={lerp(640, 760, ramp(t, a, a + 1))} y={1000} s={0.66} o={MOM} t={t} seed={8} talk mouth="open" /><TFig x={lerp(560, 920, ramp(t, a, a + 1.2))} y={1000} s={0.64} o={TEYZE2} t={t} seed={9} dir={-1} mouth="grin" /></TCam> },
      { c: "Bir şey", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[900, 720]}><BakkalOn t={t} />{bakkal(t, { x: 1140, pose: P.hips, mouth: "flat" })}<TFig x={760} y={1000} s={0.66} o={MOM} t={t} seed={8} talk mouth="open" pose={P.hand} /><TFig x={920} y={1000} s={0.64} o={TEYZE2} t={t} seed={9} dir={-1} mouth="o" eyes="wide" /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="ALIŞVERİŞ: 0" y={330} /><Damga t={t} at={a + 1.8} text="HABER: ÇOK" y={1040} c="#F6C445" rot={-5} /></> },
      { c: "Kim evleniyor", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[1110, 720]}><BakkalOn t={t} />{bakkal(t, { x: 1140, eyes: "wide", brow: "up", mouth: "o" })}</TCam>,
        html: (t, a) => <>{["💍 EVLENİYOR", "📦 TAŞINIYOR", "🪖 ASKERDEN"].map((s, i) => <VT key={s} t={t} at={(i === 2 ? tKimin : a + i * 0.9)} text={s} y={330 + i * 120} size={64} />)}</> },
      { c: "Hepsini", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.1]} c0={[1110, 720]}><BakkalOn t={t} />{bakkal(t, { x: 1140, pose: P.hips, eyes: "happy", mouth: "grin" })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.6} text="İLK SEN DUYUYORSUN" y={1040} c="#2EE6D0" rot={-4} size={80} /> },
      { c: "Akşam", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t) => <Saatli t={t} s="19:00" /> },
      { c: "Maç var", sfx: "drone", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 780]}><BakkalOn t={t} night={0.6} />{[740, 960, 1180].map((x, i) => <TFig key={x} x={x} y={1010} s={0.6} o={i === 1 ? DEDE : { ...DAD, top: ["#5C6B7A", "", "#8B6B4A"][i] || "#5C6B7A" }} t={t} seed={i} pose={P.sit} mouth={i === 1 ? "o" : "smile"} />)}<Radyo t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="3 AMCA · 1 RADYO 📻" y={330} size={80} /> },
      { c: "Gece on", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t) => <Saatli t={t} s="22:00" /> },
      { c: "Kapatıyorsun", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.2]} c0={[960, 600]}><BakkalOn t={t} open={1 - ramp(t, a, b)} night={1} />{bakkal(t, { pose: P.reach, eyes: "squint", mouth: "flat" })}</TCam> },
      { c: "Kapı çalıyor", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]} shake={3}><BakkalOn t={t} open={0} night={1} /><TFig x={780} y={1000} s={0.7} o={{ ...HERO, top: "#7E5BD6", top2: "#5E42A8" }} t={t} seed={6} pose={P.reach} mouth="open" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.1} text="TAK TAK!" y={330} c="#F6C445" rot={-6} /> },
      { c: "Abi", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.3]} c0={[800, 720]}><BakkalOn t={t} open={0} night={1} /><TFig x={780} y={1000} s={0.7} o={{ ...HERO, top: "#7E5BD6", top2: "#5E42A8" }} t={t} seed={6} pose={P.hand} mouth="open" talk brow="worried" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="“ABİ, SADECE 1 YUMURTA”" y={330} size={68} /> },
      { c: "Açıyorsun", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 700]}><BakkalOn t={t} open={ramp(t, a, a + 0.8) * 0.6} night={1} />{bakkal(t, { pose: P.hand, holdR: <Yumurta />, mouth: "smile", eyes: "happy" })}</TCam> },
      { c: "Çünkü bakkal", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]} c0={[960, 560]}><BakkalOn t={t} open={0.6} night={1} />{bakkal(t, { pose: P.hips, mouth: "grin" })}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.4} text="BAKKAL KAPANMAZ" y={330} c="#F6C445" rot={-4} size={90} /><VT t={t} at={a + 2} text="SADECE DİNLENİR 😌" y={1040} size={76} /></> },
      { c: "Sizin mahallenin", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}><BakkalOn t={t} />{bakkal(t, { pose: P.wave, mouth: "grin" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SİZİN BAKKAL HÂLÂ AÇIK MI?" y={330} size={68} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={1040} size={80} /></> },
    ];
    return S;
  },
});
