import React from "react";
import words from "../../../public/data/sh2-01-words.json";
import { Ball, DEDE, HERO, Lab, Outfit, P, Pitch, TCam, TFig, lerp } from "../../components/Toon";
import { Simit } from "../../components/K2Kit";
import { El, Galata, GK, Hiz, Iz, Lira, SimitSokak, Yagmur } from "../../components/K2Dikey";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #1 · «Galata Kulesi'nden 1 Lira Atsan Ne Olur?» (النوع أ، البطاقة 90/100)
// السكربت والمصادر: السكربتات/sh2-01-galata-para.txt

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const AMCA: Outfit = { ...DEDE };
const G = 1000;

// terasta duran sen (küçük)
const teras = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={GK.x + 40} y={GK.terrace - 8} s={0.2} o={SEN} t={t} rim={0.4} pose={P.reach} mouth="grin" {...f} />;
// sokakta simit yiyen amca
const amca = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <TFig x={900} y={G} s={1} o={AMCA} t={t} pose={P.hand} holdR={<Simit x={0} y={0} s={0.7} />} mouth="smile" {...f} />;
const HEAD_Y = G - 470;
const sky = (c = "#BFE3F2") => <rect width={1920} height={1080} fill={c} />;
// havanın freni: paranın altından yukarı itme okları
const oklar = (t: number, x: number, y: number) => (
  <g opacity={0.85}>{[-70, 0, 70].map((dx, i) => { const o = ((t * 2 + i * 0.33) % 1); return <g key={i} transform={`translate(${x + dx},${y + 200 - o * 120})`} opacity={1 - o}><path d="M0,60 V0 M-18,20 L0,0 L18,20" stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" /></g>; })}</g>
);

export const { SECONDS: SH2_01_SECONDS, Comp: Sh2Short01 } = makeShort2({
  words: words as W[],
  audio: "sh2-01",
  hook: "GALATA'DAN 1 LİRA ATSAN?",
  hookUntil: 3.9,
  build: (cue) => {
    const tOl = cue("öldürmez");
    const tYor = cue("Yorumlara");
    const tHit = cue("tam kafasına");
    const S: Sh[] = [
      // 0 · soru: kule, terasta sen, elinde lira
      { c: "Galata", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 520]}><Galata t={t} />{teras(t, { holdR: <Lira x={0} y={0} s={0.5} glow={1} /> })}</TCam> },
      // aşağıdaki biri
      { c: "aşağıdaki", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 640]}><SimitSokak t={t} />{amca(t, { look: -0.3, lookY: -1 })}<Lira x={960} y={lerp(290, 440, ramp(t, a, b))} s={1.3} spin={t * 12} glow={0.6} /></TCam> },
      // teras yüksekliği
      { c: "Kulenin", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[960, 300]}><Galata t={t} />{teras(t, { holdR: <Lira x={0} y={0} s={0.5} glow={1} /> })}</TCam>,
        html: (t, a) => <Sayi t={t} at={a + 0.6} to={51} unit="METRE YUKARIDA" y={700} /> },
      { c: "On yedi", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]} c0={[960, 540]}><Galata t={t} />{Array.from({ length: 17 }, (_, i) => { const on = ramp(t, a + i * 0.06, a + i * 0.06 + 0.1); return <rect key={i} x={GK.x - 150} y={1040 - (i + 1) * 43} width={300} height={38} rx={6} fill="#F6C445" opacity={0.28 * on} stroke="#F6C445" strokeWidth={3} strokeOpacity={on} />; })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="= 17 KATLI BİNA" y={380} /> },
      // havasız dünya: dümdüz düşüş
      { c: "Hava olmasaydı", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => { const k = ramp(t, a + 0.6, b); return <g><Lab t={t} /><Iz x={960} y={lerp(80, 900, k * k)} n={5} len={220} c="#5FF2E2" /><Lira x={960} y={lerp(80, 900, k * k)} s={1.6} /></g>; },
        html: (t, a) => <VT t={t} at={a + 0.2} text="HAVA YOK" y={360} c="#2EE6D0" /> },
      { c: "yüz on beş", sfx: "boom", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Hiz t={t} v={115 * ramp(t, a - 0.3, a + 0.9)} max={140} /></g> },
      { c: "Sert bir", sfx: "whoosh", tone: "warm", r: (t, a, b) => { const k = ramp(t, a, b); return <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 620]}><Pitch t={t} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${lerp(700, 1240, k) - 60 - i * 40},${540 + i * 12} h-90`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />)}<Ball x={lerp(700, 1240, k)} y={560} r={40} spin={t * 900} /></TCam>; },
        html: (t, a) => <VT t={t} at={a + 0.2} text="SERT BİR ŞUT KADAR" y={380} /> },
      // ama hava var
      { c: "Ama İstanbul'da", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.08, 1]} c0={[960, 500]}><Galata t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="AMA HAVA VAR" y={380} /> },
      // takla
      { c: "Ve para", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 540]}>{sky()}<Lira x={960 + Math.sin(t * 3) * 40} y={500 + Math.sin(t * 2) * 20} s={4.2} spin={(t - a) * 9} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.4} text="TAKLA ATAR" y={380} /> },
      { c: "Dönerek", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}>{sky("#CFEBF6")}{oklar(t, 960, 540)}<Lira x={960} y={480} s={3.4} spin={(t - a) * 10} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="HAVA = FREN" y={380} c="#2EE6D0" /> },
      { c: "Birkaç saniye", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Hiz t={t} v={Math.min(48, 70 * ramp(t, a, a + 1.6))} max={140} /></g> },
      { c: "Saatte elli", tone: "cool", bg: "#0E1A2E", r: (t) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Hiz t={t} v={48 + Math.sin(t * 6) * 1.5} max={140} c="#F6C445" /></g>,
        html: (t, a) => <Damga t={t} at={a + 0.9} text="TAKILDI" y={1000} c="#F6C445" rot={-6} /> },
      // aşağıda amca
      { c: "Aşağıda", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 620]}><SimitSokak t={t} />{amca(t, { talk: true, mouth: "grin" })}</TCam> },
      { c: "Para tam", sfx: "knock", tone: "warm", r: (t, a, b) => { const k = ramp(t, a, tHit + 0.35); return <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[930, HEAD_Y + 60]}><SimitSokak t={t} />{amca(t, { eyes: t > tHit + 0.35 ? "squint" : "open", lookY: -1 })}{t < tHit + 0.5 && <Lira x={920} y={lerp(HEAD_Y - 520, HEAD_Y - 30, k)} s={0.8} spin={t * 12} />}</TCam>; } },
      { c: "Amca ah", sfx: "boing", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[930, HEAD_Y + 80]}><SimitSokak t={t} />{amca(t, { eyes: "squint", brow: "worried", mouth: "o", pose: P.think })}<Lira x={1000} y={G - 10} s={0.6} spin={1.5} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="AH!" y={460} c="#E0393E" /> },
      { c: "simidine", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[930, HEAD_Y + 160]}><SimitSokak t={t} />{amca(t, { mouth: "grin", eyes: "happy", talk: true })}</TCam> },
      // sonuç
      { c: "Acıtır", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.35]} c0={[930, HEAD_Y + 200]}><SimitSokak t={t} />{amca(t, { mouth: "grin", eyes: "happy" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="ACITIR ✓" y={330} /><VT t={t} at={tOl - 0.1} text="ÖLDÜRMEZ ✗" y={520} c="#F6C445" /></> },
      { c: "Bir bilim", sfx: "whoosh", tone: "cool", bg: "#14294A", r: (t, a, b) => { const k = ramp(t, a + 2.2, a + 2.9); return <g><Lab t={t} /><El x={960} y={820} s={1.1} hit={k} />{k < 1 && <g><Iz x={960} y={lerp(80, 700, k)} n={4} len={160} c="#5FF2E2" /><Lira x={960} y={lerp(80, 700, k)} s={1.2} spin={t * 14} /></g>}{k >= 1 && <Lira x={1080} y={960} s={1.2} spin={1.4} />}</g>; },
        html: (t, a) => <VT t={t} at={a + 0.2} text="BİLİM TESTİ" y={330} c="#2EE6D0" /> },
      { c: "Deriyi", sfx: "ding", tone: "cool", bg: "#14294A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><Lab t={t} /><El x={960} y={820} s={1.1} hit={1 - ramp(t, a, b)} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.2} text="DERİ SAĞLAM" y={420} c="#2EE6D0" /> },
      // yağmur benzetmesi
      { c: "Yağmur", sfx: "splash", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><SimitSokak t={t} /><TFig x={980} y={G} s={1} o={SEN} t={t} rim={0.4} pose={P.cheer} mouth="grin" eyes="happy" /><Yagmur t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="YAĞMUR DA ÖYLE" y={330} /> },
      // açık soru (döngü: kuleye geri)
      { c: "Peki ya", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, 290]}><Galata t={t} dusk={1} />{teras(t, { holdR: <Simit x={0} y={0} s={0.5} />, mouth: "grin" })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.8} text="PEKİ BİR SİMİT?" y={360} c="#F6C445" /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={560} size={80} /></> },
    ];
    return S;
  },
});
