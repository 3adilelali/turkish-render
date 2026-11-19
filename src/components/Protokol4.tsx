import React from "react";
import { rp, lp, cl } from "./Hayat";
import { hash } from "./Motion";
import { X, T, Sil } from "./Protokol";
import { mp } from "./Protokol3";

// Kanal 5 · Protokol X · k7-02 (Çiçero) sahne kiti (2026-11-19). 1943 Ankara, büyükelçilik, casusluk, sahte sterlin.
// Hepsi vektör ve frame'e bağlı. Gerçek kurum amblemi/bayrak simgesi yok: etiket ve renk.

const AMB = X.amber, RED = X.red;
const md = (v: number, m: number) => ((v % m) + m) % m;

// ───────── Ankara · Cumhuriyet Bayramı gecesi
export const AnkaraBayram: React.FC<{ t: number; a?: number; fire?: boolean }> = ({ t, a = 0, fire = true }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSkyN)" />
    {Array.from({ length: 46 }, (_, i) => <circle key={i} cx={hash(i * 1.3) * 1920} cy={hash(i * 2.7) * 460} r={1 + hash(i) * 1.6} fill="#FFF" opacity={0.25 + 0.5 * Math.abs(Math.sin(t * 1.2 + i))} />)}
    {fire && [0, 1, 2].map((k) => {
      const cyc = md(t - a - k * 1.3, 3.9), p = cl(cyc / 1.4), cx = 460 + k * 520, cy = 250 + (k % 2) * 80;
      return <g key={k} opacity={p < 1 ? 1 - p * 0.9 : 0}>{Array.from({ length: 16 }, (_, j) => { const ang = (j / 16) * Math.PI * 2, r = 20 + p * 150; return <line key={j} x1={cx + Math.cos(ang) * r * 0.55} y1={cy + Math.sin(ang) * r * 0.55} x2={cx + Math.cos(ang) * r} y2={cy + Math.sin(ang) * r} stroke={j % 2 ? AMB : "#FFF"} strokeWidth={4} strokeLinecap="round" />; })}</g>;
    })}
    {Array.from({ length: 16 }, (_, i) => {
      const w = 90 + hash(i * 5.1) * 70, x = i * 125 - 20, h = 200 + hash(i * 9.3) * 300;
      return <g key={i}><rect x={x} y={1000 - h} width={w} height={h + 80} fill="#0A0F1A" />{Array.from({ length: Math.floor(h / 48) }, (_, r) => [0, 1].map((c) => { const on = hash(i * 13 + r * 7 + c) > 0.55; return <rect key={`${r}${c}`} x={x + 14 + c * 36} y={1020 - h + r * 48} width={20} height={26} fill={on ? "#FFD27A" : "#141B2A"} opacity={on ? 0.85 : 1} />; }))}</g>;
    })}
    <path d="M0,330 Q960,450 1920,330" stroke="#3A2E24" strokeWidth={3} fill="none" />
    {Array.from({ length: 15 }, (_, i) => {
      const x = 60 + i * 130, k = x / 1920, y = 330 + 4 * (1 - (2 * k - 1) ** 2) * 30 + 0, sw = Math.sin(t * 2 + i) * 6;
      return <g key={i} transform={`translate(${x},${y + 8}) rotate(${sw})`}><rect x={-28} y={0} width={56} height={38} fill="#C8202B" /><circle cx={-4} cy={19} r={9} fill="#FFF" /><circle cx={-1} cy={19} r={7.2} fill="#C8202B" /><circle cx={8} cy={19} r={2.6} fill="#FFF" /></g>;
    })}
    <rect x={0} y={1000} width={1920} height={80} fill="#06080C" />
  </g>
);

// ───────── resepsiyon
export const Reception: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#150F0B" />
    <ellipse cx={960} cy={160} rx={560} ry={260} fill="url(#pGlowA)" opacity={0.35} />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${520 + i * 440},120)`}><line x1={0} y1={-120} x2={0} y2={20} stroke="#6B5A3E" strokeWidth={4} />{Array.from({ length: 9 }, (_, j) => <circle key={j} cx={(j - 4) * 22} cy={30 + Math.abs(j - 4) * 7} r={7} fill="#FFE9B0" opacity={0.8 + 0.2 * Math.sin(t * 3 + j + i)} />)}<path d="M-100,40 Q0,100 100,40" stroke="#8A7040" strokeWidth={5} fill="none" /></g>)}
    {[0, 1].map((i) => <path key={i} d={`M${i ? 1780 : 80},0 L${i ? 1780 : 80},1000`} stroke="#3A1E24" strokeWidth={90} opacity={0.9} />)}
    <rect x={0} y={900} width={1920} height={180} fill="#0C0806" />
    {[300, 640, 980, 1320, 1620].map((x, i) => <g key={i}><Sil x={x} y={990} s={1.25} t={t} kind={i % 2 ? "suit" : "coat"} pose={i % 3 === 1 ? "raise" : "hold"} rim="#B98B3C" seed={i * 7} hair={i === 2 ? "long" : "short"} /><circle cx={x + 40} cy={600 + (i % 2) * 15} r={10} fill="#FFE9B0" opacity={0.6} /></g>)}
  </g>
);

// ───────── büyükelçilik cephesi (amblem yok: renk + etiket)
export const EmbassyFront: React.FC<{ t: number; a?: number; label?: string; tone?: "de" | "uk"; lit?: number }> = ({ t, a = 0, label = "BÜYÜKELÇİLİK", tone = "uk", lit = 1 }) => {
  const wall = tone === "uk" ? "#1B2433" : "#241B1B", flag = tone === "uk" ? "#1F3A6B" : "#5B1B1B";
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#pSkyN)" />
      <ellipse cx={960} cy={560} rx={900} ry={420} fill="url(#pGlowA)" opacity={0.12} />
      <rect x={200} y={300} width={1520} height={640} fill={wall} />
      <rect x={200} y={300} width={1520} height={26} fill="#0B0F17" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={250 + i * 215} y={320} width={34} height={620} fill="#2A3548" opacity={0.7} />)}
      {Array.from({ length: 12 }, (_, i) => { const on = hash(i * 3.3 + a) > 0.4; return <rect key={i} x={330 + (i % 6) * 235} y={380 + Math.floor(i / 6) * 220} width={110} height={140} fill={on ? "#FFD27A" : "#0F1520"} opacity={on ? 0.55 + 0.35 * lit : 1} stroke="#0A0F17" strokeWidth={8} />; })}
      <rect x={820} y={700} width={280} height={240} fill="#0A0E15" stroke="#3A4558" strokeWidth={8} />
      <circle cx={960} cy={780} r={5} fill={AMB} />
      <line x1={1580} y1={300} x2={1580} y2={80} stroke="#8A8F9A" strokeWidth={8} />
      <path d={`M1584,90 q${40 + Math.sin(t * 2.2) * 12},${14 + Math.sin(t * 1.7) * 6} 130,0 l0,70 q-${50},${16 + Math.sin(t * 2.2) * 8} -130,0Z`} fill={flag} />
      <rect x={760} y={640} width={400} height={50} fill="#05070A" stroke={AMB} strokeWidth={3} />
      {T(960, 678, label, 28, AMB, 700, "middle")}
      <rect x={0} y={940} width={1920} height={140} fill="#07090E" />
      <circle cx={840} cy={900} r={7} fill="#FFE9B0" /><ellipse cx={840} cy={960} rx={120} ry={20} fill="#FFE9B0" opacity={0.1} />
      <Sil x={1250} y={1030} s={1.1} t={t} kind="coat" pose="stand" rim={AMB} seed={4} />
    </g>
  );
};

// ───────── telgraf şeridi
export const Telegram: React.FC<{ t: number; a: number; from?: string; to?: string; text?: string; stamp?: string }> = ({ t, a, from = "BERLİN", to = "ANKARA", text = "EVET. SATIN ALIN.", stamp = "ŞİFRELİ" }) => {
  const k = rp(t, a + 0.2, a + 1.4), n = Math.floor(cl(rp(t, a + 0.9, a + 2.2)) * text.length);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0A08" />
      <ellipse cx={960} cy={540} rx={780} ry={420} fill="url(#pGlowA)" opacity={0.16} />
      <g transform={`translate(960,540) rotate(${-2 + Math.sin(t * 0.7) * 0.6})`} opacity={k}>
        <rect x={-700} y={-190} width={1400} height={380} fill="#E9E1CC" /><rect x={-700} y={-190} width={1400} height={44} fill="#C9BFA3" />
        {T(-660, -156, `${from} → ${to}`, 30, "#3A3226", 700)}
        {Array.from({ length: 2 }, (_, i) => <line key={i} x1={-660} x2={660} y1={-92 + i * 100} y2={-92 + i * 100} stroke="#B8AD90" strokeWidth={2} />)}
        {T(-660, 20, text.slice(0, n), 78, "#15110C", 700)}
        <g opacity={rp(t, a + 2.2, a + 2.7)} transform="translate(420,100) rotate(-10)"><rect x={-130} y={-40} width={260} height={80} fill="none" stroke={RED} strokeWidth={6} />{T(0, 14, stamp, 44, RED, 700, "middle")}</g>
      </g>
    </g>
  );
};

// ───────── anahtar simgesi + belge kutusu
export const KeyGlyph: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = AMB, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}><circle cx={0} cy={0} r={34} fill="none" stroke={c} strokeWidth={14} /><rect x={30} y={-7} width={150} height={14} fill={c} /><rect x={140} y={7} width={14} height={34} fill={c} /><rect x={110} y={7} width={14} height={26} fill={c} /></g>
);
export const Strongbox: React.FC<{ t: number; a: number; open?: number; glow?: boolean }> = ({ t, a, open = 99, glow = true }) => {
  const k = rp(t, a + open, a + open + 0.9);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0D12" />
      {glow && <ellipse cx={960} cy={560} rx={620} ry={400} fill="url(#pGlowA)" opacity={0.22 + 0.2 * k} />}
      <rect x={560} y={560} width={800} height={340} rx={16} fill="#3A2A1E" stroke="#6B4E32" strokeWidth={8} />
      <rect x={560} y={560} width={800} height={50} fill="#4A3626" />
      <g transform={`translate(960,560) rotate(${-k * 28})`}><rect x={-400} y={-190} width={800} height={190} rx={16} fill="#4A3626" stroke="#6B4E32" strokeWidth={8} />{T(0, -90, "ÇOK GİZLİ", 52, AMB, 700, "middle")}</g>
      <rect x={930} y={560} width={60} height={70} rx={8} fill="#B98B3C" opacity={1 - k * 0.5} />
      {k > 0.1 && <g opacity={k}><rect x={700} y={520 - k * 60} width={520} height={30} fill="#E9E1CC" /><rect x={720} y={490 - k * 80} width={480} height={30} fill="#D8CFB8" /><rect x={740} y={462 - k * 90} width={440} height={30} fill="#E9E1CC" /></g>}
      <KeyGlyph x={420 + Math.sin(t * 1.4) * 6} y={800} s={0.9} c={AMB} rot={-18} />
    </g>
  );
};

// ───────── müdür odası: elçi + uşak
export const StudyRoom: React.FC<{ t: number; a: number; scene?: "door" | "piano" | "sleep" | "box" }> = ({ t, a, scene = "door" }) => {
  const k = rp(t, a + 0.2, a + 1.6);
  return (
    <g>
      <rect width={1920} height={1080} fill="#16110E" />
      <rect width={1920} height={1080} fill="url(#pGrid)" opacity={0.3} />
      <rect x={120} y={150} width={420} height={560} fill="#0D1118" stroke="#4A3626" strokeWidth={18} /><rect x={130} y={160} width={400} height={540} fill="url(#pSkyN)" />
      <ellipse cx={1500} cy={300} rx={380} ry={200} fill="url(#pGlowA)" opacity={0.3} />
      <rect x={1420} y={110} width={180} height={230} fill="#3A2E3A" stroke="#6B4E32" strokeWidth={10} />
      <rect x={0} y={900} width={1920} height={180} fill="#0C0907" />
      {scene === "piano" ? (
        <g>
          <rect x={560} y={640} width={680} height={260} rx={14} fill="#0A0A0C" stroke="#2A2A30" strokeWidth={6} />
          <rect x={590} y={680} width={620} height={40} fill="#E8E8E8" />{Array.from({ length: 14 }, (_, i) => <rect key={i} x={600 + i * 43} y={680} width={20} height={26} fill="#111" />)}
          <Sil x={900} y={980} s={1.4} t={t} kind="suit" pose="sit" rim={AMB} seed={2} dir={1} />
          {[0, 1, 2].map((i) => <text key={i} x={1000 + i * 70} y={400 - md(t * 40 + i * 80, 200)} fontSize={56} fill={AMB} opacity={0.6} fontFamily="serif">♪</text>)}
        </g>
      ) : scene === "sleep" ? (
        <g>
          <rect x={540} y={700} width={900} height={200} rx={20} fill="#2B1F2A" /><rect x={540} y={640} width={900} height={90} rx={30} fill="#3A2E3A" />
          <Sil x={960} y={900} s={1.2} t={t} kind="suit" pose="head" rim="#B98B3C" seed={5} />
          {T(1250, 500 - md(t * 20, 60), "z", 70, "#8A8F9A", 700)}
        </g>
      ) : (
        <g>
          <rect x={1060} y={660} width={560} height={250} fill="#2E2218" stroke="#4A3626" strokeWidth={8} />
          <rect x={1220} y={560} width={240} height={110} rx={10} fill="#3A2A1E" stroke="#6B4E32" strokeWidth={6} />
          {scene === "box" && <g opacity={k}><rect x={1230} y={540} width={220} height={26} fill="#E9E1CC" /><ellipse cx={1340} cy={480} rx={160} ry={90} fill="url(#pGlowW)" opacity={0.5} /></g>}
          <Sil x={700} y={980} s={1.4} t={t} kind="suit" pose="sit" rim="#B98B3C" seed={8} />
        </g>
      )}
      <g transform={`translate(${lp(1850, scene === "door" ? 1500 : 1700, k)},0)`}><Sil x={0} y={1000} s={1.45} t={t} kind="coat" pose={scene === "box" ? "hold" : "stand"} rim={AMB} seed={11} dir={-1} /></g>
    </g>
  );
};

// ───────── Layka makine + çekim
export const Leica: React.FC<{ t: number; a: number; shots?: number }> = ({ t, a, shots = 3 }) => {
  const sh = Array.from({ length: shots }, (_, i) => rp(t, a + 0.5 + i * 0.7, a + 0.62 + i * 0.7) * (1 - rp(t, a + 0.62 + i * 0.7, a + 0.9 + i * 0.7)));
  const flash = Math.max(0, ...sh);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <ellipse cx={960} cy={760} rx={900} ry={300} fill="url(#pGlowA)" opacity={0.15} />
      <g transform="translate(300,520)"><rect x={0} y={260} width={640} height={420} fill="#E9E1CC" transform="skewX(-12)" />{[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={40} x2={560} y1={310 + i * 46} y2={310 + i * 46} stroke="#9A907A" strokeWidth={4} />)}<rect x={60} y={330} width={220} height={38} fill="#2A2418" /></g>
      <g transform="translate(1180,200)">
        <rect x={-190} y={0} width={380} height={190} rx={22} fill="#1A1E27" stroke="#3A4558" strokeWidth={5} />
        <rect x={-190} y={0} width={380} height={66} rx={22} fill="#C8C8CC" /><rect x={-70} y={-26} width={140} height={34} fill="#9A9AA2" />
        <circle cx={0} cy={110} r={74} fill="#0A0C10" stroke="#8A8F9A" strokeWidth={10} /><circle cx={0} cy={110} r={44} fill="#1E2A44" /><circle cx={-14} cy={96} r={12} fill="#FFF" opacity={0.5} />
        <circle cx={150} cy={34} r={12} fill={RED} opacity={0.5 + 0.5 * flash} />
        <ellipse cx={0} cy={120} rx={420 * flash + 1} ry={300 * flash + 1} fill="#FFF" opacity={0.28 * flash} />
      </g>
      <g>{Array.from({ length: shots }, (_, i) => <g key={i} opacity={rp(t, a + 0.9 + i * 0.7, a + 1.1 + i * 0.7)}><rect x={150 + i * 150} y={900} width={120} height={80} fill="#1A1E27" stroke={AMB} strokeWidth={3} />{T(210 + i * 150, 950, `${i + 1}`, 38, AMB, 700, "middle")}</g>)}</g>
      <rect width={1920} height={1080} fill="#FFF" opacity={flash * 0.18} />
    </g>
  );
};

// ───────── gizli belge sayfası
export const ClassifiedDoc: React.FC<{ t: number; a: number; title?: string; stamp?: string; lines?: string[]; pages?: number }> = ({ t, a, title = "İNGİLİZ DIŞİŞLERİ", stamp = "ÇOK GİZLİ", lines = ["█████████ ████", "█████ ██████████", "███████████ ████"], pages = 3 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0C10" />
    {Array.from({ length: pages }, (_, i) => {
      const k = rp(t, a + 0.1 + i * 0.35, a + 0.7 + i * 0.35);
      return <g key={i} transform={`translate(${960 + (i - (pages - 1) / 2) * 80 + (1 - k) * 220},${540 + (i - 1) * 14}) rotate(${(i - 1) * 4 - (1 - k) * 8})`} opacity={k}><rect x={-380} y={-440 + i * 6} width={760} height={880} fill={i % 2 ? "#E4DCC4" : "#E9E1CC"} stroke="#B8AD90" strokeWidth={2} /></g>;
    })}
    <g transform="translate(960,540) rotate(1.5)">
      {T(-320, -340, title, 36, "#2A2418", 700)}<line x1={-320} x2={320} y1={-310} y2={-310} stroke="#2A2418" strokeWidth={3} />
      {lines.map((l, i) => <g key={i} opacity={rp(t, a + 0.7 + i * 0.3, a + 1.1 + i * 0.3)}>{T(-320, -220 + i * 80, l, 40, "#1A1610", 600, "start", { fontFamily: "monospace" } as React.SVGProps<SVGTextElement>)}</g>)}
      <g opacity={rp(t, a + 1.4, a + 1.8)} transform={`translate(80,180) rotate(-12) scale(${1 + (1 - rp(t, a + 1.4, a + 1.8)) * 0.4})`}><rect x={-230} y={-60} width={460} height={120} fill="none" stroke={RED} strokeWidth={9} />{T(0, 20, stamp, 64, RED, 700, "middle")}</g>
    </g>
  </g>
);

// ───────── film şeridi
export const FilmRoll: React.FC<{ t: number; a: number; label?: string }> = ({ t, a, label }) => {
  const off = (t - a) * 160;
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <ellipse cx={960} cy={540} rx={900} ry={400} fill="url(#pGlowC)" opacity={0.1} />
      {[0, 1].map((r) => (
        <g key={r} transform={`translate(0,${260 + r * 380})`}>
          <rect x={0} y={0} width={1920} height={260} fill="#14161C" />
          {Array.from({ length: 18 }, (_, i) => <g key={i} transform={`translate(${md(i * 120 - off * (r ? -1 : 1), 2160) - 120},0)`}><rect x={-40} y={10} width={30} height={20} fill="#07090E" /><rect x={-40} y={230} width={30} height={20} fill="#07090E" /></g>)}
          {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${md(i * 300 - off * (r ? -1 : 1), 2400) - 300},40)`}><rect x={0} y={0} width={260} height={180} fill="#C9C0A8" opacity={0.85} />{[0, 1, 2, 3].map((j) => <line key={j} x1={20} x2={230} y1={40 + j * 34} y2={40 + j * 34} stroke="#2A2418" strokeWidth={5} />)}</g>)}
        </g>
      ))}
      {label && T(960, 1040, label, 46, AMB, 700, "middle")}
    </g>
  );
};

// ───────── sterlin destesi (genel tasarım, gerçek banknot değil)
export const Notes: React.FC<{ t: number; a: number; fake?: number; count?: number; label?: string }> = ({ t, a, fake = 99, count = 6, label }) => {
  const f = rp(t, a + fake, a + fake + 0.9);
  const note = (i: number) => (
    <g key={i} transform={`translate(${960 + (i % 3 - 1) * 330},${430 + Math.floor(i / 3) * 190 + Math.sin(t * 1.2 + i) * 3}) rotate(${(i % 3 - 1) * 4})`} opacity={rp(t, a + 0.1 + i * 0.14, a + 0.5 + i * 0.14)}>
      <rect x={-140} y={-72} width={280} height={144} rx={8} fill="#CFC8A8" stroke="#8A8468" strokeWidth={3} />
      <rect x={-124} y={-58} width={248} height={116} fill="none" stroke="#9A9470" strokeWidth={2} />
      <circle cx={-70} cy={0} r={34} fill="none" stroke="#7A7458" strokeWidth={3} /><circle cx={-70} cy={0} r={22} fill="#B8B190" />
      {T(40, 18, "£", 76, "#4A4630", 700, "middle")}{T(86, -34, "STERLİN", 14, "#5A5640", 700, "middle")}
      <line x1={-124} x2={124} y1={46} y2={46} stroke="#7A7458" strokeWidth={2} />
      <g opacity={f}><rect x={-140} y={-72} width={280} height={144} rx={8} fill={RED} opacity={0.2} /><g transform="rotate(-14)"><rect x={-92} y={-26} width={184} height={52} fill="none" stroke={RED} strokeWidth={5} />{T(0, 14, "SAHTE", 38, RED, 700, "middle")}</g></g>
    </g>
  );
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0907" />
      <ellipse cx={960} cy={560} rx={760} ry={420} fill="url(#pGlowA)" opacity={0.2} />
      {Array.from({ length: count }, (_, i) => note(i))}
      {label && <g opacity={rp(t, a + 0.8, a + 1.3)}>{T(960, 960, label, 52, f > 0.5 ? RED : AMB, 700, "middle")}</g>}
    </g>
  );
};

// ───────── gece yolu + araba (takip)
export const CarNight: React.FC<{ t: number; a: number; chase?: boolean }> = ({ t, a, chase = false }) => {
  const go = (t - a) * 380;
  const car = (x: number, y: number, c: string, s = 1, beam = true) => (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {beam && <path d="M150,10 L720,-70 L720,110Z" fill="#FFE9B0" opacity={0.16} />}
      <path d="M-150,40 L-150,0 Q-120,-60 -40,-62 L60,-62 Q120,-60 150,0 L150,40Z" fill={c} stroke="#000" strokeWidth={3} />
      <rect x={-50} y={-52} width={50} height={32} fill="#9FB4CC" opacity={0.5} /><rect x={6} y={-52} width={50} height={32} fill="#9FB4CC" opacity={0.5} />
      <circle cx={-90} cy={44} r={28} fill="#0A0A0A" /><circle cx={90} cy={44} r={28} fill="#0A0A0A" />
      <circle cx={146} cy={12} r={10} fill="#FFE9B0" />
    </g>
  );
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#pSkyN)" />
      <rect x={0} y={640} width={1920} height={440} fill="#0C1018" />
      <rect x={0} y={760} width={1920} height={200} fill="#1A1E27" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={md(i * 260 - go, 2340) - 260} y={856} width={120} height={10} fill="#E9E1CC" opacity={0.7} />)}
      {Array.from({ length: 5 }, (_, i) => { const x = md(i * 520 - go * 0.6, 2600) - 300; return <g key={i}><rect x={x} y={420} width={10} height={340} fill="#2A3040" /><circle cx={x + 5} cy={420} r={14} fill="#FFE9B0" /><ellipse cx={x + 5} cy={780} rx={120} ry={24} fill="#FFE9B0" opacity={0.08} /></g>; })}
      {car(chase ? 760 : 900, 800 + Math.sin(t * 6) * 3, "#1E2A44", 1.4)}
      {chase && car(240 + Math.sin(t * 1.3) * 40, 820, "#3A1A1A", 1.1, true)}
    </g>
  );
};

// ───────── ilişki zinciri (düğümler ve oklar)
export const Chain: React.FC<{ t: number; a: number; nodes: string[]; sub?: string[]; c?: string }> = ({ t, a, nodes, sub = [], c = AMB }) => {
  const n = nodes.length, gap = 1500 / Math.max(1, n - 1);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
      {nodes.map((s, i) => {
        const x = 210 + i * gap, k = rp(t, a + 0.3 + i * 0.7, a + 0.8 + i * 0.7), lk = rp(t, a + 0.6 + i * 0.7, a + 1.2 + i * 0.7);
        return (
          <g key={i}>
            {i > 0 && <><line x1={210 + (i - 1) * gap + 90} y1={520} x2={lp(210 + (i - 1) * gap + 90, x - 90, lk)} y2={520} stroke={c} strokeWidth={6} /><path d={`M${lp(210 + (i - 1) * gap + 90, x - 90, lk)},520 l-24,-16 l0,32Z`} fill={c} opacity={lk} /></>}
            <g opacity={k} transform={`translate(${x},520) scale(${0.8 + 0.2 * k})`}><circle cx={0} cy={0} r={90} fill="#111824" stroke={c} strokeWidth={5} /><circle cx={0} cy={0} r={90} fill="url(#pGlowA)" opacity={0.18} />{T(0, 12, s, s.length > 8 ? 26 : 34, "#FFF", 700, "middle")}{sub[i] && T(0, 150, sub[i], 28, X.dim, 600, "middle")}</g>
          </g>
        );
      })}
    </g>
  );
};

// ───────── Bernhard basım odası (silüet, yüz yok)
export const PressRoom: React.FC<{ t: number; a: number; count?: string }> = ({ t, a, count }) => {
  const sheet = (t - a) * 140;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0A09" />
      <rect x={1200} y={120} width={420} height={460} fill="none" stroke="#3A3A3A" strokeWidth={10} />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={1250 + i * 80} x2={1250 + i * 80} y1={130} y2={570} stroke="#3A3A3A" strokeWidth={8} />)}
      <ellipse cx={1410} cy={350} rx={260} ry={210} fill="url(#pGlowW)" opacity={0.18} />
      <rect x={160} y={560} width={900} height={220} rx={10} fill="#2A2A2E" stroke="#4A4A52" strokeWidth={6} />
      <rect x={200} y={520} width={820} height={50} fill="#3A3A42" />
      <circle cx={300} cy={650} r={70} fill="#1A1A1E" stroke="#6A6A72" strokeWidth={8} /><circle cx={300} cy={650} r={70} fill="none" stroke="#9A9AA2" strokeWidth={3} strokeDasharray="12 18" transform={`rotate(${(t - a) * 120} 300 650)`} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={md(i * 160 - sheet, 960) + 100} y={500} width={110} height={46} fill="#D9D2B4" stroke="#8A8468" strokeWidth={2} />)}
      <rect x={0} y={900} width={1920} height={180} fill="#050505" />
      {[1260, 1560].map((x, i) => <Sil key={i} x={x} y={1000} s={1.2} t={t} kind="coat" pose="paper" rim="#7A6A4E" seed={20 + i} hair="none" />)}
      <rect x={160} y={800} width={900} height={110} fill="#1A1814" />{Array.from({ length: 5 }, (_, i) => <rect key={i} x={190 + i * 170} y={760 - (i % 2) * 8} width={130} height={44} fill="#D9D2B4" opacity={rp(t, a + 0.3 + i * 0.3, a + 0.7 + i * 0.3)} />)}
      {count && <g opacity={rp(t, a + 1.2, a + 1.8)}>{T(960, 1030, count, 52, AMB, 700, "middle")}</g>}
    </g>
  );
};

// ───────── otel inşaatı (Bursa) + sahte zarf
export const HotelSite: React.FC<{ t: number; a: number; pay?: boolean }> = ({ t, a, pay = false }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSky)" opacity={0.9} />
    <rect x={0} y={860} width={1920} height={220} fill="#14110E" />
    <path d="M0,700 Q400,560 800,660 T1920,600 L1920,860 L0,860Z" fill="#161B22" />
    {Array.from({ length: 4 }, (_, f) => <g key={f}>{Array.from({ length: 6 }, (_, c) => <rect key={c} x={520 + c * 110} y={720 - f * 110} width={14} height={110} fill="#6A5A48" opacity={rp(t, a + 0.1 + f * 0.4, a + 0.6 + f * 0.4)} />)}<rect x={510} y={720 - f * 110} width={580} height={12} fill="#7A6A58" opacity={rp(t, a + 0.1 + f * 0.4, a + 0.6 + f * 0.4)} /></g>)}
    <g transform={`translate(1380,0)`}><rect x={0} y={150} width={18} height={710} fill="#C9A23A" /><rect x={-300} y={150} width={600} height={14} fill="#C9A23A" /><line x1={-240} y1={164} x2={-240} y2={360 + Math.sin(t * 1.3) * 20} stroke="#8A8F9A" strokeWidth={4} /><rect x={-270} y={360 + Math.sin(t * 1.3) * 20} width={60} height={36} fill="#6A5A48" /></g>
    {[260, 380].map((x, i) => <Sil key={i} x={x} y={880} s={1.2} t={t} kind="casual" pose={i ? "hold" : "stand"} rim={AMB} seed={30 + i} hair="short" />)}
    {pay && <g opacity={rp(t, a + 0.8, a + 1.4)} transform="translate(700,880)"><rect x={-110} y={-50} width={220} height={100} rx={6} fill="#CFC8A8" stroke="#8A8468" strokeWidth={3} /><g transform="rotate(-12)"><rect x={-84} y={-22} width={168} height={44} fill="none" stroke={RED} strokeWidth={5} />{T(0, 12, "SAHTE", 34, RED, 700, "middle")}</g></g>}
  </g>
);

// ───────── kaynaklar ayrışıyor
export const Disagree: React.FC<{ t: number; a: number; rows: [string, number, string][]; title?: string }> = ({ t, a, rows, title = "KAYNAKLAR AYRIŞIYOR" }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
    {T(960, 170, title, 56, AMB, 700, "middle")}
    {rows.map(([who, pct, what], i) => {
      const k = rp(t, a + 0.4 + i * 0.7, a + 1.3 + i * 0.7);
      return <g key={i} transform={`translate(260,${300 + i * 230})`}>{T(0, 0, who, 38, "#FFF", 700)}<rect x={0} y={24} width={1400} height={60} fill="#111824" /><rect x={0} y={24} width={1400 * (pct / 100) * k} height={60} fill={RED} opacity={0.85} /><rect x={1400 * (pct / 100) * k} y={24} width={Math.max(0, 1400 - 1400 * (pct / 100) * k)} height={60} fill="#2D5A3A" opacity={0.7} />{T(1400, 14, what, 30, X.dim, 600, "end")}</g>;
    })}
    {T(960, 1010, "kırmızı = sahte olduğu iddia edilen kısım", 28, X.dim, 500, "middle")}
  </g>
);

// ───────── üç ihtimal
export const ThreePaths: React.FC<{ t: number; a: number; items: [string, string][] }> = ({ t, a, items }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
    {T(960, 160, "ÇİÇERO KİMİN İÇİN ÇALIŞIYORDU?", 56, AMB, 700, "middle")}
    {items.map(([h, s], i) => {
      const k = rp(t, a + 0.5 + i * 1.0, a + 1.1 + i * 1.0);
      return <g key={i} opacity={k} transform={`translate(${240 + i * 480},${300 + (1 - k) * 60})`}><rect x={-0} y={0} width={440} height={560} rx={18} fill="#111824" stroke={AMB} strokeWidth={4} />{T(220, 120, `${i + 1}`, 110, AMB, 700, "middle")}<foreignObject x={24} y={170} width={392} height={260}><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 38, color: "#FFF", textAlign: "center", lineHeight: 1.2 }}>{h}</div></foreignObject>{T(220, 520, s, 34, RED, 700, "middle")}</g>;
    })}
  </g>
);

// ───────── filmler (tipografik afişler)
export const Posters: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0806" />
    {[["1951", "ANKARA CASUSU ÇİÇERO", "Türkiye"], ["1952", "BEŞ PARMAK", "ABD"], ["2019", "ÇİÇERO", "Türkiye"]].map(([y, n, c], i) => {
      const k = rp(t, a + 0.3 + i * 0.7, a + 0.9 + i * 0.7);
      return <g key={i} opacity={k} transform={`translate(${250 + i * 520},${180 + (1 - k) * 60}) rotate(${(i - 1) * 2})`}><rect x={0} y={0} width={420} height={700} fill="#16110C" stroke={AMB} strokeWidth={5} /><rect x={20} y={20} width={380} height={420} fill="#241A12" />{T(210, 250, y, 96, AMB, 700, "middle")}<foreignObject x={24} y={470} width={372} height={170}><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, color: "#FFF", textAlign: "center", lineHeight: 1.15 }}>{n}</div></foreignObject>{T(210, 680, c, 28, X.dim, 600, "middle")}</g>;
    })}
  </g>
);

// ───────── iki kitap
export const TwoBooks: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0806" />
    {[["MOYTSİŞ · 1950", "“Operasyon Çiçero”", "sansasyonel anlatı, eksik ve yanlışlar", 560], ["BAZNA · 1962", "“Ben Çiçero'ydum”", "defter notlarından derleme, abartılar çıkarıldı", 1360]].map(([a1, b1, c1, x], i) => {
      const k = rp(t, a + 0.3 + i * 0.9, a + 0.9 + i * 0.9);
      return <g key={i} opacity={k} transform={`translate(${x},540)`}><rect x={-230} y={-330} width={460} height={620} rx={10} fill="#2A1F18" stroke="#6B4E32" strokeWidth={8} /><rect x={-210} y={-310} width={420} height={580} fill="#3A2A1E" />{T(0, -170, String(a1), 34, AMB, 700, "middle")}<foreignObject x={-190} y={-130} width={380} height={160}><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "#FFF", textAlign: "center" }}>{String(b1)}</div></foreignObject><g opacity={rp(t, a + 1.2 + i * 0.9, a + 1.7 + i * 0.9)}><rect x={-210} y={90} width={420} height={110} fill="#05070A" opacity={0.85} /><foreignObject x={-200} y={96} width={400} height={100}><div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 26, color: RED, textAlign: "center", lineHeight: 1.2 }}>{String(c1)}</div></foreignObject></g></g>;
    })}
  </g>
);

// ───────── harita: Priştine → İstanbul → Ankara (+ Bursa)
export const RouteMarks: React.FC<{ t: number; a: number; pts: [string, number, number][]; arcs?: [number, number][] }> = ({ t, a, pts, arcs = [] }) => (
  <g>
    {arcs.map(([i, j], n) => {
      const [x1, y1] = mp(pts[i][1], pts[i][2]), [x2, y2] = mp(pts[j][1], pts[j][2]), k = rp(t, a + 0.3 + n * 0.9, a + 1.3 + n * 0.9), mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 120;
      const px = (1 - k) ** 2 * x1 + 2 * (1 - k) * k * mx + k * k * x2, py = (1 - k) ** 2 * y1 + 2 * (1 - k) * k * my + k * k * y2;
      return <g key={n}><path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke={AMB} strokeWidth={4} fill="none" strokeDasharray="10 10" opacity={0.6} /><circle cx={px} cy={py} r={9} fill={AMB} /></g>;
    })}
    {pts.map(([name, lon, lat], i) => { const [x, y] = mp(lon, lat), k = rp(t, a + 0.1 + i * 0.5, a + 0.5 + i * 0.5); return <g key={i} opacity={k}><circle cx={x} cy={y} r={14 + 6 * Math.sin(t * 3 + i)} fill="none" stroke={AMB} strokeWidth={3} opacity={0.6} /><circle cx={x} cy={y} r={8} fill={AMB} />{T(x + 20, y - 18, name, 34, "#FFF", 700)}</g>; })}
  </g>
);

// ───────── iki araç: fırça + Layka
export const TwoTools: React.FC<{ t: number; a: number; extra?: string }> = ({ t, a, extra }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0A09" />
    <ellipse cx={960} cy={560} rx={780} ry={400} fill="url(#pGlowA)" opacity={0.18} />
    <g opacity={rp(t, a + 0.2, a + 0.8)} transform="translate(560,560) rotate(-14)"><rect x={-170} y={-26} width={340} height={52} rx={12} fill="#6B4E32" stroke="#8A6A44" strokeWidth={4} />{Array.from({ length: 16 }, (_, i) => <line key={i} x1={-150 + i * 20} y1={26} x2={-146 + i * 20} y2={70} stroke="#C9B28A" strokeWidth={5} />)}</g>
    <g opacity={rp(t, a + 0.9, a + 1.5)} transform="translate(1300,540)"><rect x={-170} y={-70} width={340} height={150} rx={18} fill="#1A1E27" stroke="#3A4558" strokeWidth={5} /><rect x={-170} y={-70} width={340} height={50} rx={18} fill="#C8C8CC" /><circle cx={0} cy={20} r={56} fill="#0A0C10" stroke="#8A8F9A" strokeWidth={9} /><circle cx={0} cy={20} r={32} fill="#1E2A44" /></g>
    {extra && T(960, 940, extra, 54, AMB, 700, "middle")}
  </g>
);

// ───────── konferans üçlü kare (gerçek fotoğraflar dışarıdan verilir)
export const TriFrames: React.FC<{ t: number; a: number; labels: [string, string, string]; imgs?: [string?, string?, string?] }> = ({ t, a, labels, imgs = [] }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
    {labels.map((l, i) => {
      const k = rp(t, a + 0.3 + i * 0.8, a + 0.9 + i * 0.8);
      return <g key={i} opacity={k} transform={`translate(${150 + i * 580},${230 + (1 - k) * 50})`}><rect x={0} y={0} width={520} height={560} rx={10} fill="#111824" stroke={AMB} strokeWidth={4} />{imgs[i] ? <image href={imgs[i]} x={14} y={14} width={492} height={430} preserveAspectRatio="xMidYMid slice" opacity={0.85} /> : <rect x={14} y={14} width={492} height={430} fill="#1A2435" />}{T(260, 510, l, 44, "#FFF", 700, "middle")}</g>;
    })}
  </g>
);
