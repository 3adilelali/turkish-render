import words from "../../../public/data/sh2-15-words.json";
import { CarP, HERO, Outfit, P, TCam, TFig, lerp, walkPose } from "../../components/Toon";
import { Saat } from "../../components/K2Dikey2";
import { Kopru } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #15 · «1915 Çanakkale Köprüsü'nden Yürüyerek Geçsen?» (النوع أ)
// السكربت والمصادر: السكربتات/sh2-15-kopru.txt (4608 م، الفتحة 2023 م، الأبراج 318 م، بلا ممرّ مشاة)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#F6C445", top2: "#C99A1E" };
const yuru = (t: number, x: number, pose = walkPose(t * 3)) => <TFig x={x} y={598} s={0.2} o={SEN} t={t} pose={pose} mouth="smile" />;
const arabalar = (t: number, v = 300) => <g>{[0, 1, 2].map((i) => <CarP key={i} x={((t * v + i * 640) % 2200) - 140} y={598} s={0.32} t={t} c={["#E0393E", "#3A7BD5", "#F4F4F2"][i]} lights={1} />)}</g>;
const ruzgar = (t: number) => <g>{Array.from({ length: 10 }, (_, i) => { const o = (t * 1.4 + i / 10) % 1; return <path key={i} d={`M${lerp(600, 1320, o)},${200 + i * 60} h120`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6 * Math.sin(o * Math.PI)} />; })}</g>;
const aralik = (k: number) => <g opacity={k}><path d="M780,660 V700 H1140 V660" stroke="#F6C445" strokeWidth={8} fill="none" /><path d="M780,680 H1140" stroke="#F6C445" strokeWidth={4} strokeDasharray="14 10" /></g>;
const Tabela = ({ k }: { k: number }) => (
  <g transform="translate(960,520)">
    <rect x={-8} y={60} width={16} height={420} fill="#7E868A" />
    <circle r={200} fill="#FFFFFF" stroke="#E0393E" strokeWidth={34} />
    <g fill="#2A2E36"><circle cx={0} cy={-100} r={26} /><path d="M-20,-70 L20,-70 L30,20 L60,100 L40,110 L10,40 L-10,40 L-40,110 L-60,100 L-30,20Z" /></g>
    <path d="M-140,-140 L140,140" stroke="#E0393E" strokeWidth={34} strokeLinecap="round" opacity={k} />
  </g>
);

export const { SECONDS: SH2_15_SECONDS, Comp: Sh2Short15 } = makeShort2({
  words: words as W[],
  audio: "sh2-15",
  alt: { "1915": ["Bin"] },
  hook: "BU KÖPRÜDEN YÜRÜYEREK GEÇSEN?",
  hookUntil: 3.4,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      { c: "1915", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.6]} c0={[960, 520]} c1={[900, 560]}><Kopru t={t} />{yuru(t, lerp(860, 940, ramp(t, a, b)))}</TCam> },
      { c: "Avrupa'dan", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.95, 0.9]} c0={[960, 540]}><Kopru t={t} />{arabalar(t, 160)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="AVRUPA → ASYA" y={330} /> },
      { c: "Toplam", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 540]}><Kopru t={t} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.3} to={4608} dur={1.2} unit="METRE" y={1040} c="#F6C445" /> },
      { c: "Ortadaki", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.15]} c0={[960, 560]}><Kopru t={t} />{aralik(ramp(t, a + 0.2, a + 0.8))}</TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.8} to={2023} dur={1} unit="METRE AÇIKLIK" y={1040} c="#F6C445" /> },
      { c: "Cumhuriyet'in", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.2]} c0={[960, 560]}><Kopru t={t} />{aralik(1)}</TCam>,
        html: (t, a) => <><VT t={t} at={a} text="2023" y={330} c="#E0393E" size={150} /><VT t={t} at={a + 0.6} text="CUMHURİYET'İN 100. YILI" y={1040} size={70} /></> },
      { c: "Dünyanın", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.9, 1]} c0={[960, 520]}><Kopru t={t} dusk={0.6} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.4} text="DÜNYA REKORU" y={330} c="#F6C445" rot={-5} size={90} /> },
      { c: "Başını", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 1.6]} c0={[760, 560]} c1={[760, 200]}><Kopru t={t} />{yuru(t, 820, P.point)}</TCam> },
      { c: "Kuleler", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[760, 400]}><Kopru t={t} /><path d="M680,80 V820" stroke="#F6C445" strokeWidth={8} strokeDasharray="20 14" /></TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.4} to={318} dur={1} unit="METRE" y={1040} c="#F6C445" /> },
      { c: "Yani on", sfx: "ding", tone: "gold", bg: "#B3182B", r: (t, a) => <g><rect width={1920} height={1080} fill="#B3182B" /><circle cx={960} cy={540} r={lerp(0, 200, ramp(t, a, a + 0.4))} fill="#FFFFFF" opacity={0.15} /></g>,
        html: (t, a) => <><VT t={t} at={a} text="3·18" y={500} c="#FFFFFF" size={200} /><Damga t={t} at={a + 0.8} text="18 MART 🇹🇷" y={1000} c="#F6C445" rot={-4} /></> },
      { c: "Altında", sfx: "splash", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]} c1={[960, 860]}><Kopru t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="ÇANAKKALE BOĞAZI" y={330} size={84} /> },
      { c: "Gemiler", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 780]}><Kopru t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="GEMİLER OYUNCAK GİBİ 🚢" y={330} size={72} /> },
      { c: "Rüzgar", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.3]} c0={[960, 560]} shake={3}><Kopru t={t} sway={6} />{yuru(t, 960, P.shock)}{ruzgar(t)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="RÜZGAR SERT 💨" y={330} /> },
      { c: "Köprü hafifçe", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><Kopru t={t * 2} sway={14} />{ruzgar(t)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="KÖPRÜ NEFES ALIYOR" y={1040} size={78} /> },
      { c: "Asma köprüler", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.25]} c0={[960, 520]}><Kopru t={t * 2} sway={8} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.8} text="ESNER = NORMAL ✓" y={1040} c="#2EE6D0" rot={-4} size={90} /> },
      { c: "Normal bir", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={0.9 * ramp(t, a + 0.3, a + 2.6)} label="< 1 SAAT" /></g> },
      { c: "Ama küçük", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, 560]}><Kopru t={t} />{yuru(t, 960, P.think)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="AMA..." y={330} c="#F6C445" size={130} /> },
      { c: "Bu bir", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 1.9]} c0={[960, 560]} shake={2}><Kopru t={t} />{arabalar(t, 700)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="OTOYOL KÖPRÜSÜ 🚗" y={330} size={84} /> },
      { c: "Yaya yolu", sfx: "boom", tone: "warm", bg: "#9FD3F0", r: (t, a) => <g><rect width={1920} height={1080} fill="#9FD3F0" /><Tabela k={ramp(t, a + 0.2, a + 0.6)} /></g>,
        html: (t, a) => <Damga t={t} at={a + 0.6} text="YAYA YOLU YOK" y={1060} c="#E0393E" rot={-4} /> },
      { c: "Yani bu", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 560]}><Kopru t={t} dusk={1} /><g opacity={0.8}>{yuru(t, lerp(900, 1020, ramp(t, a, b)))}</g></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="SADECE HAYALİNDE ✨" y={330} size={84} /> },
      { c: "Sen köprünün", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2]} c0={[960, 560]}><Kopru t={t} dusk={1} />{yuru(t, 960, P.cheer)}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="ORTADA NE YAPARDIN?" y={330} size={84} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={1040} size={80} /></> },
    ];
    return S;
  },
});
