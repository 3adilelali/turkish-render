import words from "../../../public/data/sh2-03-words.json";
import { HERO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { GeceSehir, Kabin, Kuyu, Saat } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #3 · «Asansörde Mahsur Kalsan Kaç Saat Dayanırsın?» (النوع ج، 88/100)
// السكربت والمصادر: السكربتات/sh2-03-asansor.txt

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const NICK: Outfit = { top: "#3A4A5E", top2: "#2A3646", kind: "suit", shoes: "#1E1E1E", hairColor: "#3A2A1E" };
const G = 990;
// hava akışı okları (kapı aralığı + tavan)
const hava = (t: number) => (
  <g opacity={0.9}>
    {[0, 1, 2, 3, 4].map((i) => { const o = (t * 0.8 + i / 5) % 1; return <path key={i} d={`M${lerp(1240, 990, o)},${300 + i * 140} h-60 m18,-16 l-18,16 l18,16`} stroke="#5FF2E2" strokeWidth={8} fill="none" strokeLinecap="round" opacity={Math.sin(o * Math.PI)} />; })}
    {[0, 1, 2].map((i) => { const o = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M${820 + i * 140},${lerp(10, 160, o)} v50 m-16,-18 l16,18 l16,-18`} stroke="#5FF2E2" strokeWidth={8} fill="none" strokeLinecap="round" opacity={Math.sin(o * Math.PI)} />; })}
  </g>
);
const kat = (y: number, n: string) => <g><rect x={680} y={y} width={560} height={14} fill="#5E666C" /><text x={700} y={y - 16} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#9AA3A8">{n}</text></g>;
const SAAT: [number, string][] = [[0, "1 SAAT"], [1, "5 SAAT"], [1.7, "1 GECE"]];

export const { SECONDS: SH2_03_SECONDS, Comp: Sh2Short03 } = makeShort2({
  words: words as W[],
  audio: "sh2-03",
  hook: "ASANSÖRDE MAHSUR KALSAN?",
  hookUntil: 3.3,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tBas = cue("bas, otur");
    const tOtur = cue("otur");
    const tBek = cue("bekle");
    const S: Sh[] = [
      // 0 · soru
      { c: "Asansörde", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.3]} c0={[960, 640]}><Kabin t={t} floor="7" /><TFig x={960} y={G} s={0.9} o={SEN} t={t} rim={0.4} pose={P.phone} mouth="flat" eyes="wide" look={0.3} lookY={-0.8} /></TCam> },
      // 1999 New York
      { c: "Bin dokuz", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 600]}><GeceSehir t={t} stars={0.3} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="1999" y={330} size={180} /><VT t={t} at={a + 1.6} text="NEW YORK" y={560} c="#F6C445" /></> },
      { c: "Nicholas", sfx: "doorbell", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 640]}><Kabin t={t} floor="43" /><TFig x={lerp(1250, 960, ramp(t, a, a + 1.8))} y={G} s={0.9} o={NICK} t={t} pose={P.stand} mouth="smile" dir={-1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="NICHOLAS WHITE" y={360} /> },
      // durdu
      { c: "Asansör iki", sfx: "boom", tone: "cool", bg: "#2A2F36", r: (t, a, b) => { const k = ramp(t, a, a + 1.2); const y = lerp(200, 560, k); return <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 540]} shake={k >= 1 && t < a + 1.6 ? 6 : 0}><Kuyu t={t} carY={y} ropes={6} />{kat(330, "13")}{kat(830, "12")}</TCam>; },
        html: (t, a) => <Damga t={t} at={a + 1.2} text="DURDU" y={1000} c="#E0393E" rot={-6} /> },
      { c: "Alarma", sfx: "buzz", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1130, 640]}><Kabin t={t} floor="--" alarm={1} /><TFig x={1040} y={G} s={0.9} o={NICK} t={t} pose={P.point} mouth="o" brow="worried" look={0.6} /></TCam> },
      { c: "Kimse", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 700]}><Kabin t={t} floor="--" dark={0.5} /><TFig x={960} y={G} s={0.9} o={NICK} t={t} pose={P.sit} mouth="flat" brow="worried" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="KİMSE YOK" y={360} /> },
      // zaman akıyor
      { c: "Bir saat", sfx: "tick", tone: "night", bg: "#0E1A2E", r: (t, a) => { const u = t - a; const lab = SAAT.filter(([s]) => u >= s).pop()![1]; return <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={u * 2.2} label={lab} /></g>; } },
      { c: "Tam kırk", sfx: "boom", tone: "night", bg: "#0E1A2E", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}><Kabin t={t} floor="--" dark={0.7} /><TFig x={960} y={G} s={0.9} o={NICK} t={t} pose={P.sit} mouth="flat" eyes="squint" sweat /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.1} to={41} dur={0.8} unit="SAAT" y={950} c="#F6C445" /> },
      // korkular
      { c: "Ama korktuğu", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, G - 330]}><Kabin t={t} floor="--" dark={0.4} /><TFig x={960} y={G} s={0.9} o={NICK} t={t} pose={P.sit} mouth="o" brow="worried" eyes="wide" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.6} text="HİÇBİRİ GERÇEK DEĞİL" y={380} c="#2EE6D0" rot={-4} size={72} /> },
      // 1 · hava
      { c: "Bir. Hava", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Kabin t={t} floor="--" />{hava(t)}<TFig x={900} y={G} s={0.9} o={NICK} t={t} pose={P.sit} mouth="smile" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="1 · HAVA BİTMEZ" y={360} c="#2EE6D0" /> },
      // 2 · düşmez
      { c: "İki. Asansör", sfx: "pop", tone: "cool", bg: "#2A2F36", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 520]}><Kuyu t={t} carY={560} ropes={6} />{kat(330, "13")}{kat(830, "12")}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="2 · DÜŞMEZ" y={360} c="#2EE6D0" /> },
      { c: "birkaç çelik", sfx: "ding", tone: "cool", bg: "#2A2F36", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1000, 260]}><Kuyu t={t} carY={560} ropes={Math.min(6, 1 + Math.floor((t - a) * 5))} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.1} from={1} to={6} dur={1} unit="ÇELİK HALAT" y={760} /> },
      // 3 · fren
      { c: "Halatlar kopsa", sfx: "boom", tone: "cool", bg: "#2A2F36", r: (t, a, b) => { const cut = Math.min(6, Math.floor(ramp(t, a + 0.3, a + 1.2) * 6)); const br = ramp(t, a + 1.4, a + 1.6); const y = lerp(560, 640, ramp(t, a + 0.9, a + 1.5)); return <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]} shake={br > 0 && t < a + 2.2 ? 8 : 0}><Kuyu t={t} carY={y} ropes={6} cut={cut} brake={br} /></TCam>; },
        html: (t, a) => <><VT t={t} at={a + 0.1} text="3 · FREN" y={360} c="#2EE6D0" /><Damga t={t} at={a + 1.6} text="KİLİTLENDİ" y={1020} c="#E0393E" rot={-6} /></> },
      // doğrusu
      { c: "Yani en", sfx: "whoosh", tone: "cool", r: (t, a, b) => { const sit = t > tOtur; return <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1010, 640]}><Kabin t={t} floor="--" alarm={t > tBas && t < tOtur ? 1 : 0} /><TFig x={1040} y={G} s={0.9} o={NICK} t={t} pose={sit ? P.sit : P.point} mouth="smile" look={sit ? 0 : 0.6} /></TCam>; },
        html: (t) => <><VT t={t} at={tBas} text="✓ ALARMA BAS" y={300} size={76} /><VT t={t} at={tOtur} text="✓ OTUR" y={420} size={76} /><VT t={t} at={tBek} text="✓ BEKLE" y={540} size={76} c="#2EE6D0" /></> },
      { c: "Kapıyı", sfx: "buzz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 600]} shake={2}><Kabin t={t} floor="--" /><TFig x={960} y={G} s={0.9} o={NICK} t={t} pose={P.reach} mouth="frown" brow="angry" sweat /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.8} text="✗ EN TEHLİKELİSİ" y={380} c="#E0393E" rot={-5} size={80} /> },
      // çıkış
      { c: "Nicholas", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><rect width={1920} height={1080} fill="#F4EAD6" /><rect y={G} width={1920} height={90} fill="#C9B89A" /><TFig x={960} y={G} s={0.95} o={NICK} t={t} pose={P.cheer} mouth="grin" eyes="happy" /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.4} text="SAPASAĞLAM" y={380} c="#3FAE6A" rot={-5} /> },
      // döngü
      { c: "Sen olsan", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 640]}><Kabin t={t} floor="7" /><TFig x={960} y={G} s={0.9} o={SEN} t={t} rim={0.4} pose={P.shrug} mouth="flat" eyes="wide" /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN NE YAPARDIN?" y={360} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={560} size={80} /></> },
    ];
    return S;
  },
});
