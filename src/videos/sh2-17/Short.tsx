import words from "../../../public/data/sh2-17-words.json";
import { DEDE, HERO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Demlik, InceBardak } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #17 · «Çay Bardağı Neden İnce Belli?» (النوع د)
// السكربت والمصادر: السكربتات/sh2-17-bardak.txt (تركيا الأولى عالمياً باستهلاك الشاي للفرد، والتفسير الشكلي «derler»)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const ZEMIN = "#F6EBD2";
const zemin = <rect width={1920} height={1080} fill={ZEMIN} />;
// çay bahçesi: yeşil, masa, iki kişi
const Bahce = ({ t, sip = 0 }: { t: number; sip?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE3B0" />
    {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={600 + i * 120} cy={180 + (i % 2) * 40} r={110} fill="#5FAE5A" opacity={0.85} />)}
    <rect y={760} width={1920} height={320} fill="#C9B48F" />
    <TFig x={790} y={1000} s={0.62} o={SEN} t={t} seed={1} pose={P.hand} holdR={<InceBardak x={0} y={0} s={0.28} t={t} saucer={false} />} mouth={sip > 0.5 ? "grin" : "smile"} talk={sip <= 0.5} />
    <TFig x={1130} y={1000} s={0.62} o={DEDE} t={t} seed={2} dir={-1} pose={P.hand} holdR={<InceBardak x={0} y={0} s={0.28} t={t} saucer={false} />} mouth="grin" />
    <rect x={850} y={780} width={220} height={20} rx={6} fill="#8A5A32" /><rect x={950} y={800} width={20} height={200} fill="#6E4628" />
    <InceBardak x={910} y={778} s={0.22} t={t} /><InceBardak x={1010} y={778} s={0.22} t={t} />
  </g>
);
const sicak = (t: number, k: number) => <g opacity={k}>{[0, 1, 2].map((i) => <path key={i} d={`M${900 + i * 60},${860 - ((t * 60 + i * 20) % 60)} q16,-20 0,-40 q-16,-20 0,-40`} stroke="#E0393E" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>;
const buhar = (t: number, k: number) => <g opacity={k}>{[0, 1, 2].map((i) => { const o = (t * 0.7 + i / 3) % 1; return <path key={i} d={`M${880 + i * 80},${340 - o * 200} q24,-30 0,-60 q-24,-30 0,-60`} stroke="#FFFFFF" strokeWidth={12} fill="none" opacity={1 - o} strokeLinecap="round" />; })}</g>;
const Parmak = ({ k }: { k: number }) => (
  <g transform={`translate(${lerp(1260, 1060, k)},700)`}>
    <path d="M0,-40 Q-40,-50 -80,-30 Q-90,0 -80,20 Q-40,30 0,30 H200 V-40Z" fill="#F2C9A0" stroke="#C99A70" strokeWidth={5} />
    <path d="M-80,-30 Q-110,-20 -110,0 Q-110,20 -80,20" fill="#F2C9A0" stroke="#C99A70" strokeWidth={5} />
  </g>
);

export const { SECONDS: SH2_17_SECONDS, Comp: Sh2Short17 } = makeShort2({
  words: words as W[],
  audio: "sh2-17",
  hook: "BARDAK NEDEN İNCE BELLİ?",
  hookUntil: 2.4,
  build: (cue) => {
    const tYor = cue("yorumlara");
    const S: Sh[] = [
      { c: "Çay", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 520]}>{zemin}<InceBardak x={960} y={860} s={2.3} t={t} /></TCam> },
      { c: "Türkiye, kişi", sfx: "boom", tone: "gold", bg: "#B3182B", r: (t, a) => <g><rect width={1920} height={1080} fill="#B3182B" />{Array.from({ length: 12 }, (_, i) => <g key={i} opacity={ramp(t, a + i * 0.08, a + i * 0.08 + 0.2)}><InceBardak x={740 + (i % 4) * 150} y={420 + Math.floor(i / 4) * 230} s={0.55} t={t} saucer={false} /></g>)}</g>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="KİŞİ BAŞI ÇAY" y={330} /><Damga t={t} at={a + 1.8} text="DÜNYA 1. 🥇" y={1060} c="#F6C445" rot={-5} /></> },
      { c: "Ve hep", sfx: "pop", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}>{zemin}{[0, 1, 2].map((i) => <InceBardak key={i} x={760 + i * 200} y={760} s={0.9} t={t} />)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="HEP AYNI BARDAK" y={330} /> },
      { c: "Bu şeklin", sfx: "whoosh", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.3} text="BİR MANTIĞI VAR" y={330} c="#2EE6D0" /><VT t={t} at={a + 1.4} text="(DERLER)" y={460} size={64} /></> },
      { c: "Alt kısım", sfx: "pop", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 820]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} hl="alt" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="ALT: DAR" y={330} c="#F6C445" size={120} /> },
      { c: "Çay orada sıcak", sfx: "ding", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.8]} c0={[960, 800]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} hl="alt" />{sicak(t, 1)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="🔥 SICAK KALIR" y={330} /> },
      { c: "Üst kısım", sfx: "pop", tone: "cool", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 400]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} hl="ust" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="ÜST: GENİŞ" y={1040} c="#F6C445" size={120} /> },
      { c: "Çay orada biraz", sfx: "whoosh", tone: "cool", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 360]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} hl="ust" />{buhar(t, 1)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="❄️ BİRAZ SOĞUR" y={1040} /> },
      { c: "Yani ilk", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[800, 720]}><Bahce t={t} sip={1} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1} text="DİL YANMAZ ✓" y={330} c="#2EE6D0" rot={-5} /> },
      { c: "Ortası", sfx: "pop", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 620]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} hl="bel" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="ORTA: İNCE" y={330} c="#F6C445" size={120} /> },
      { c: "Parmakların", sfx: "whoosh", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[1000, 640]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} /><Parmak k={ramp(t, a + 0.2, a + 1)} /></TCam> },
      { c: "Sıcak yerden", sfx: "ding", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1000, 640]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} /><Parmak k={1} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.1} text="BELİNDEN TUT ✓" y={330} c="#2EE6D0" rot={-4} /> },
      { c: "Bir de cam", sfx: "pop", tone: "cool", bg: "#1A2236", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 560]}><rect width={1920} height={1080} fill="#1A2236" /><InceBardak x={960} y={880} s={2.3} t={t} /><rect x={lerp(600, 1300, ramp(t, a, b))} y={200} width={60} height={700} fill="#FFFFFF" opacity={0.25} transform="skewX(-20)" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="CAM: RENGİ GÖRÜNÜR" y={330} size={80} /> },
      { c: "Tavşan", sfx: "pop", tone: "warm", bg: ZEMIN, r: (t, a) => <g>{zemin}{[[0.0, "AÇIK"], [0.6, "DEMLİ"], [1, "TAVŞAN KANI"]].map(([v, s], i) => <g key={i} opacity={ramp(t, a + i * 0.5, a + i * 0.5 + 0.3)}><InceBardak x={760 + i * 200} y={760} s={0.9} t={t} tea={v as number} /><text x={760 + i * 200} y={850} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={26} fill="#2A2E36">{s}</text></g>)}</g> },
      { c: "Bir bakışta", sfx: "ding", tone: "gold", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1160, 640]}>{zemin}{[0, 0.6, 1].map((v, i) => <InceBardak key={i} x={760 + i * 200} y={760} s={0.9} t={t} tea={v} hl={i === 2 ? "bel" : undefined} />)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="BİR BAKIŞTA 👀" y={330} /> },
      { c: "Ve küçük", sfx: "whoosh", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}>{zemin}<InceBardak x={960} y={880} s={2.3} t={t} fill={lerp(0.85, 0.05, ramp(t, a + 0.8, b))} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.9} text="ÇABUK BİTER" y={330} c="#F6C445" /> },
      { c: "O yüzden", sfx: "splash", tone: "warm", bg: ZEMIN, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}>{zemin}<g transform={`rotate(${-35 * ramp(t, a, a + 0.6)},1100,560)`}><Demlik x={1120} y={560} s={1.2} t={t} steam={1} /></g><InceBardak x={900} y={900} s={1.6} t={t} fill={lerp(0.05, 0.85, ramp(t, a + 0.6, b))} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="BİR TANE DAHA? 🙋" y={330} /> },
      { c: "Belki de", sfx: "drone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 700]}><Bahce t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="ASIL SIR..." y={330} c="#F6C445" /> },
      { c: "İnce belli", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 720]}><Bahce t={t} sip={1} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.4} text="SOHBET UZAR 💬" y={330} c="#2EE6D0" rot={-4} /> },
      { c: "Sen günde", sfx: "whoosh", tone: "warm", bg: ZEMIN, r: (t, a) => <g>{zemin}{Array.from({ length: 8 }, (_, i) => <g key={i} opacity={ramp(t, a + i * 0.2, a + i * 0.2 + 0.2)}><InceBardak x={720 + (i % 4) * 160} y={600 + Math.floor(i / 4) * 260} s={0.65} t={t} /></g>)}</g>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="GÜNDE KAÇ BARDAK?" y={330} size={84} />{t > tYor && <VT t={t} at={tYor} text="DÜRÜST OL, YAZ ↓" y={1060} size={80} />}</> },
    ];
    return S;
  },
});
