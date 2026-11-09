import React from "react";
import words from "../../../public/data/s3-03-words.json";
import { ramp } from "../../lib/cues";
import { H, HCam, HFig, lerp } from "../../components/Harem";
import { Sadabad } from "../../components/Cengi";
import { makeShort, Stamp, Sub, VT, W } from "../s3-common/Vert";

// Kanal 1 · SHORT 03 · "Sırtında Mum Taşıyan Kaplumbağalar" — Lale Devri çırağan eğlenceleri.
// Kaynak: TDV İA «Lâle Devri» (yürüyen kaplumbağaların üzerinde mumlar); İstanbul Ansiklopedisi bunu abartı/hayal sayar. Uzun video: Çengi (k3r-09).

const G = 1010;
const GIRL = { kind: "girl" as const, robe: "#2FA3A0", robe2: "#F5E8CC" };
const bahce = (t: number, turtles = 1, night = 1) => <Sadabad t={t} turtles={turtles} night={night} />;
const kiz = (t: number, x: number, s = 1.1, face: "normal" | "worried" | "shock" | "smile" | "sad" = "normal", look = 0) => <HFig x={x} y={G + 20} s={s} {...GIRL} t={t} face={face} look={look} seed={2} />;
const kalfa = (t: number, x: number, s = 1.2, talk = 1, look = 0) => <HFig x={x} y={G + 30} s={s} kind="kalfa" t={t} face="normal" talk={talk} look={look} old seed={5} />;

// büyük kaplumbağa (yakın plan), sırtında mum (mum: 0..1 iniş)
const Kap: React.FC<{ x: number; y: number; s?: number; t: number; mum?: number; walk?: number }> = ({ x, y, s = 1, t, mum = 1, walk = 1 }) => {
  const st = Math.sin(t * 5) * 10 * walk;
  const fl = 1 + Math.sin(t * 23) * 0.08 + Math.sin(t * 11) * 0.06;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cy={70} rx={230} ry={26} fill="#000" opacity={0.25} />
      {[[-150, 40, st], [150, 40, -st], [-110, 60, -st], [110, 60, st]].map(([lx, ly, r], i) => <ellipse key={i} cx={lx} cy={ly} rx={42} ry={26} fill="#7E8F4E" stroke={H.ln} strokeWidth={5} transform={`rotate(${r},${lx},${ly - 20})`} />)}
      <g transform={`translate(${210 + Math.sin(t * 2) * 6},${-10})`}><ellipse rx={56} ry={40} fill="#8FA05A" stroke={H.ln} strokeWidth={5} /><circle cx={22} cy={-10} r={7} fill={H.ln} /><circle cx={24} cy={-12} r={2} fill="#fff" /><path d="M24,14 q10,4 18,-2" stroke={H.ln} strokeWidth={4} fill="none" /></g>
      <path d="M-200,40 Q-200,-170 0,-175 Q200,-170 200,40Z" fill="#5E7034" stroke={H.ln} strokeWidth={6} />
      {[[-90, -60], [0, -100], [90, -60], [-40, -10], [50, -10]].map(([px, py], i) => <path key={i} d={`M${px - 42},${py} l20,-34 h44 l20,34 l-20,34 h-44Z`} fill="#7A8C45" stroke="#3F4A22" strokeWidth={4} />)}
      <path d="M-200,40 H200" stroke={H.ln} strokeWidth={6} />
      {mum > 0 && (
        <g transform={`translate(0,${-175 - (1 - mum) * 260})`} opacity={Math.min(1, mum * 2)}>
          <rect x={-26} y={-150} width={52} height={150} rx={8} fill="#FFF6DE" stroke={H.ln} strokeWidth={5} />
          <ellipse cy={0} rx={50} ry={14} fill={H.gold} stroke={H.ln} strokeWidth={4} />
          <line x1={0} y1={-150} x2={0} y2={-168} stroke={H.ln} strokeWidth={4} />
          <circle cy={-200} r={90 * fl} fill="#FFD27A" opacity={0.25} />
          <path d={`M0,${-168} q-22,-26 0,${-62 * fl} q22,36 0,${62 * fl}Z`} fill="#FFB43A" />
          <path d={`M0,${-170} q-10,-14 0,${-32 * fl} q10,18 0,${32 * fl}Z`} fill="#FFF2B0" />
        </g>
      )}
    </g>
  );
};
const Gece: React.FC<{ t: number }> = ({ t }) => (
  <g><rect width={1920} height={1080} fill="#16203E" />{Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 173) % 1920} cy={(i * 97) % 1080} r={2 + (i % 3)} fill="#fff" opacity={0.3 + 0.3 * Math.sin(t * 2 + i)} />)}<rect y={760} width={1920} height={320} fill="#1E3A26" /></g>
);
// küçük kaplumbağa ızgarası (sayaç)
const Suru: React.FC<{ t: number; n: number }> = ({ t, n }) => (
  <g>{Array.from({ length: n }, (_, i) => { const c = i % 9, r = Math.floor(i / 9); return <g key={i} transform={`translate(${690 + c * 68 + (r % 2) * 30},${300 + r * 80}) scale(0.3)`}><Kap x={0} y={0} t={t + i * 0.37} mum={0} /></g>; })}</g>
);
const Parsomen: React.FC<{ text: string; c: string }> = ({ text, c }) => (
  <g transform="translate(960,560)">
    <rect x={-250} y={-300} width={500} height={600} rx={14} fill="#F3E3BC" stroke={H.ln} strokeWidth={6} />
    <rect x={-270} y={-320} width={540} height={40} rx={20} fill="#C9A86A" stroke={H.ln} strokeWidth={5} /><rect x={-270} y={280} width={540} height={40} rx={20} fill="#C9A86A" stroke={H.ln} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-190,${-220 + i * 50} q60,-12 120,0 t120,0 t120,0`} stroke="#8A6A40" strokeWidth={5} fill="none" opacity={0.6} />)}
    <rect x={-230} y={-90} width={460} height={110} rx={16} fill="#FFF8E6" stroke={c} strokeWidth={6} /><text y={0} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={80} fill={c}>{text}</text>
  </g>
);

const S = makeShort({
  words: words as W[], audio: "s3-03", label: "HAREMİN SIRLARI · #3", hook: "SIRTINDA MUM TAŞIYAN KAPLUMBAĞALAR?!", hookUntil: 2.6,
  alt: { "Buna çırağan": ["Buna çırağın"], "Osmanlı sarayının daha": ["Osmanlı Sarayı'nın daha"] },
  build: () => [
    { c: "Gece. İstanbul", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.25, 1.05]} c0={[960, 560]}><Gece t={t} /><Kap x={960} y={800} s={1.0} t={t} /></HCam> },
    { c: "Sarayın bahçesindesin", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 680]}>{bahce(t, 0)}{kiz(t, 960, 1.05, "normal")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="LALE DEVRİ · SARAY" y={240} size={80} /> },
    { c: "Kalfa sana hayatının", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.9, 2.2]} c0={[960, 520]}>{bahce(t, 0)}{kalfa(t, 960, 1.2, 1)}</HCam> },
    { c: "Bahçedeki kaplumbağaları", sfx: "pop", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Gece t={t} /><Kap x={960} y={760} s={1.1} t={t} mum={0} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="“KAPLUMBAĞALARI TOPLA.”" y={240} size={78} /> },
    { c: "Bir değil", sfx: "pop", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.15]} c0={[960, 560]}><Gece t={t} /><Suru t={t} n={Math.round(lerp(1, 54, ramp(t, a, b)))} /></HCam>,
      html: (t, a, b) => <VT t={t} at={a} text={`${Math.round(lerp(1, 300, Math.pow(ramp(t, a, b), 2)))} KAPLUMBAĞA`} y={1000} size={88} /> },
    { c: "Ve her birinin sırtına", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.2]} c0={[960, 520]}><Gece t={t} /><Kap x={960} y={800} s={1.0} t={t} mum={ramp(t, a + 0.5, a + 1.4)} walk={0} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 1.5} text="🕯 YANAN BİR MUM" y={240} size={88} /> },
    { c: "Sonra hepsini lale", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 860]}>{bahce(t)}</HCam> },
    { c: "Kaplumbağalar yavaş", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 560]}><Gece t={t} /><Kap x={lerp(760, 1160, ramp(t, a, b + 2))} y={820} s={0.85} t={t} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="YAVAŞ… YAVAŞ… 🐢" y={240} size={88} /> },
    { c: "Mumlar lalelerin", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[960, 900]}>{bahce(t)}</HCam> },
    { c: "Bahçe sanki", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.2]} c0={[960, 640]}>{bahce(t)}{kiz(t, 960, 0.9, "smile")}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.4} text="✨ YÜRÜYEN YILDIZLAR ✨" y={240} size={80} /> },
    { c: "Buna çırağan", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}>{bahce(t)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.2} text="ÇIRAĞAN EĞLENCESİ" y={240} size={86} bg={H.cobalt} c="#fff" /> },
    { c: "Ama işin gizemli", sfx: "boom", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.0, 2.3]} c0={[960, 520]}>{bahce(t, 0)}<rect width={1920} height={1080} fill="#0B0F22" opacity={0.4} />{kiz(t, 960, 1.15, "worried", Math.sin(t * 2))}</HCam>,
      html: (t, a) => <Stamp t={t} at={a + 0.2} text="AMA…" y={300} c={H.ln} size={130} /> },
    { c: "Bazı tarihçiler bu", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 560]}><rect width={1920} height={1080} fill={H.cream} /><Parsomen text="GERÇEK ✓" c={H.green} /></HCam> },
    { c: "Bazıları ise bunun", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 560]}><rect width={1920} height={1080} fill={H.cream} /><Parsomen text="EFSANE ✗" c={H.red} /></HCam>,
      html: (t, a) => <Stamp t={t} at={a + 1.2} text="UYDURMA?" y={300} size={120} /> },
    { c: "Çünkü o devrin", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 620]}><rect width={1920} height={1080} fill={H.plaster} /><HFig x={960} y={G} s={1.1} kind="efendi" t={t} face="normal" sit look={0.3} seed={3} /></HCam>,
      html: (t, a) => <VT t={t} at={a + 0.3} text="ŞAİRLER: “HİÇ GÖRMEDİK”" y={240} size={76} /> },
    { c: "Sence gerçek mi", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><Gece t={t} /><Kap x={960} y={800} s={1.0} t={t} /></HCam>,
      html: (t, a) => <><Stamp t={t} at={a + 0.1} text="GERÇEK?" y={240} c={H.green} rot={-6} size={100} /><Stamp t={t} at={a + 0.9} text="EFSANE?" y={1000} c={H.red} rot={5} size={100} /></> },
    { c: "Yorumlara yaz", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 880]}>{bahce(t)}</HCam>,
      html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={240} size={88} /> },
    { c: "Osmanlı sarayının daha", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.0, 1.15]} c0={[960, 700]}>{bahce(t)}</HCam>,
      html: (t, a) => <><VT t={t} at={a + 0.1} text="HAREMİN SIRLARI" y={240} size={92} /><Sub t={t} at={a + 0.5} /></> },
  ],
});
export const S3_03_SECONDS = S.SECONDS;
export const S3Short03 = S.Comp;
