import React from "react";
import { X, T, typed } from "./Protokol";
import { rp, lp, Person, Look, HCam, BackView, fmt } from "./Hayat";
import { hash } from "./Motion";
import { KDefs, Label, Stamp } from "./Karun";

// Kanal 5 · Protokol X · k7-06 "Victoria" kiti (2026-11-25)
// İstanbul şafak + 7 adres, 7 kapı, TV stüdyosu (alt yazı "EMEKLİ EMNİYET MÜDÜRÜ"), sosyal medya, Victoria telefonu (9 numara),
// üç kural kartları, boru hattı (Colonial), paravan şirket, ihraç dosyası, veri listesi, banka havalesi, otel buluşması,
// takip vizörü, Bitcoin cüzdanı, kod adı zinciri, ekip panosu, Instagram tuzağı + karakol videosu, Tophane kimlik kontrolü,
// takip cihazı, arşiv masası (kroki), baz istasyonu, 98 hesap. Kimlik: zemin #07090E, MİT kırmızısı, Victoria moru, para yeşili. Flaş yok.

type P = { t: number; a: number; b: number };
export const VIO = "#B48CFF", TRR = "#E30A17", MON = "#7BE495", AMB = X.amber;
export const HAMZA: Look = { hairStyle: "short", hair: "#6E6A66", kind: "jacket", top: "#2B2F38", top2: "#1D2028", mustache: true, skin: "#E0B793" };
export const HAMZA_TV: Look = { hairStyle: "short", hair: "#6E6A66", kind: "shirt", top: "#3A4A66", top2: "#2C3850", mustache: true, skin: "#E0B793" };
export const HAMZA_COP: Look = { hairStyle: "short", hair: "#3A2E26", kind: "uniform", top: "#2E4A6A", top2: "#22384E", mustache: true, skin: "#E0B793" };
export const VIC: Look = { hairStyle: "bun", hair: "#C9A46A", kind: "jacket", top: "#2A2236", top2: "#1C1726", skin: "#F0CDAE" };
export const FUNDA: Look = { hairStyle: "bun", hair: "#4A2E1E", kind: "cardigan", top: "#7A4A5A", top2: "#5E3846", skin: "#EBC4A2" };
export const EXCOP: Look = { hairStyle: "buzz", hair: "#2A2420", kind: "jacket", top: "#30343C", top2: "#22252C", beard: 0.25 };
export const IRAN1: Look = { hairStyle: "short", hair: "#1A1410", kind: "shirt", top: "#5A5040", top2: "#463E30", beard: 0.6 };
export const IRAN2: Look = { hairStyle: "fade", hair: "#1A1410", kind: "jacket", top: "#3E3A34", top2: "#2C2924", beard: 0.4 };
export const TARGET: Look = { hairStyle: "short", hair: "#B8B0A6", glasses: true, kind: "jacket", top: "#1E2A3A", top2: "#141C28", skin: "#F0CDAE" };
export const TUNUS: Look = { hairStyle: "curly", hair: "#1A1410", kind: "tshirt", top: "#4A5A6A", top2: "#38465A", beard: 0.3 };

const bg = (c = X.bg) => <rect width={1920} height={1080} fill={c} />;
const lbl = (t: number, a: number, l?: [string, string?], c?: string) => l ? <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={l[0]} b={l[1]} c={c} /> : null;
const blink = (t: number, f = 3) => 0.55 + 0.45 * Math.abs(Math.sin(t * f));

// ───────── İstanbul siluet ─────────
const Skyline: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    {/* uzak tepeler */}
    <path d="M0,700 Q300,640 640,680 T1300,660 T1920,690 V1080 H0Z" fill="#0F1622" />
    {/* cami + minareler */}
    {[[420, 1], [1380, 0.8]].map(([x, s], i) => (
      <g key={i} transform={`translate(${x},640) scale(${s})`} fill="#0A0F18">
        <path d="M-150,80 Q0,-120 150,80Z" /><rect x={-170} y={70} width={340} height={90} />
        <path d="M-60,-10 Q-110,-40 -110,40 H-10Z" opacity={0.9} />
        {[-210, 210].map((mx) => <g key={mx}><rect x={mx - 9} y={-170} width={18} height={330} /><path d={`M${mx - 12},-170 L${mx},-230 L${mx + 12},-170Z`} /></g>)}
      </g>
    ))}
    {/* Galata kulesi */}
    <g transform="translate(900,560)" fill="#0A0F18"><rect x={-40} y={0} width={80} height={180} /><path d="M-48,0 L0,-90 L48,0Z" />{night > 0 && <rect x={-30} y={30} width={60} height={10} fill={AMB} opacity={0.5 * night} />}</g>
    {/* binalar + ışıklı pencereler */}
    {Array.from({ length: 26 }, (_, i) => {
      const x = i * 76 - 10, h = 90 + hash(i * 3) * 150;
      return (
        <g key={i}>
          <rect x={x} y={760 - h} width={70} height={h + 320} fill={i % 2 ? "#0B111B" : "#0D1420"} />
          {Array.from({ length: 6 }, (_, j) => hash(i * 11 + j) > 0.55 && <rect key={j} x={x + 10 + (j % 2) * 30} y={780 - h + Math.floor(j / 2) * 34} width={16} height={18} fill={AMB} opacity={(0.25 + 0.4 * hash(i + j)) * night} />)}
        </g>
      );
    })}
    {/* boğaz */}
    <rect x={0} y={900} width={1920} height={180} fill="#08101A" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={md2(i * 160 + t * 20, 1920)} y={930 + (i % 4) * 34} width={60 + (i % 3) * 30} height={3} fill="#2A3A52" opacity={0.6} />)}
  </g>
);
const md2 = (v: number, m: number) => ((v % m) + m) % m;

export const CityDawn: React.FC<P & { pins?: number; label?: [string, string?]; night?: boolean }> = ({ t, a, b, pins = 0, label, night }) => {
  const k = rp(t, a, b);
  const sky = night ? ["#05080E", "#0B1220"] : [lerpC("#0A0E18", "#2A2440", k), lerpC("#1A1E2E", "#C8784A", k)];
  return (
    <g>
      <defs><linearGradient id="vSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 600]}>
        <rect width={1920} height={1080} fill="url(#vSky)" />
        {!night && <circle cx={1500} cy={760 - k * 80} r={70} fill="#F2B36A" opacity={0.35 + k * 0.3} />}
        <Skyline t={t} night={night ? 1 : 1 - k * 0.7} />
        {Array.from({ length: pins }, (_, i) => {
          const x = 180 + hash(i * 5 + 1) * 1560, y = 560 + hash(i * 7 + 2) * 300, on = rp(t, a + 0.3 + i * 0.22, a + 0.5 + i * 0.22);
          return (
            <g key={i} opacity={on} transform={`translate(${x},${y})`}>
              <circle r={16 + 10 * Math.abs(Math.sin(t * 3 + i))} fill="none" stroke={TRR} strokeWidth={3} opacity={0.6} />
              <circle r={9} fill={TRR} />
              {T(0, -26, `ADRES ${i + 1}`, 22, "#FFF", 800, "middle")}
            </g>
          );
        })}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};
const lerpC = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [p(c1), p(c2)];
  return "#" + x.map((v, i) => Math.round(lp(v, y[i], Math.max(0, Math.min(1, k)))).toString(16).padStart(2, "0")).join("");
};

// ───────── 7 kapı ─────────
export const Doors: React.FC<P & { n?: number; hi?: number; label?: [string, string?] }> = ({ t, a, b, n = 7, hi = -1, label }) => (
  <g>
    {bg("#090C12")}
    <HCam t={t} a={a} b={b} z={[1.04, 1.0]}>
      {Array.from({ length: n }, (_, i) => {
        const x = 140 + i * 240, on = rp(t, a + i * 0.18, a + 0.3 + i * 0.18), knock = Math.max(0, Math.sin((t - a - i * 0.18) * 14)) * (t - a - i * 0.18 < 0.6 ? 1 : 0);
        const H = i === hi;
        return (
          <g key={i} opacity={on} transform={`translate(${x + knock * 4},300)`}>
            <rect x={-6} y={-6} width={192} height={432} fill="#05070A" />
            <rect width={180} height={420} rx={4} fill={H ? "#5A3A22" : "#3A2A1E"} stroke={H ? AMB : "#000"} strokeWidth={H ? 5 : 2} />
            <rect x={24} y={30} width={132} height={150} rx={3} fill="#000" opacity={0.18} /><rect x={24} y={210} width={132} height={170} rx={3} fill="#000" opacity={0.18} />
            <circle cx={150} cy={230} r={9} fill="#C9A54A" />
            <rect x={60} y={-56} width={60} height={34} rx={4} fill="#111" />{T(90, -31, String(i + 1), 24, AMB, 800, "middle")}
            <rect x={-10} y={430} width={200} height={10} fill={TRR} opacity={0.35 + 0.35 * Math.abs(Math.sin(t * 2.4 + i))} />
          </g>
        );
      })}
      {T(960, 900, "MİT + İSTANBUL EMNİYETİ · AYNI DAKİKA", 40, "#C8D0DA", 800, "middle")}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── TV stüdyosu ─────────
export const TvStudio: React.FC<P & { lower?: string; sub?: string; topic?: string; blur?: boolean; label?: [string, string?] }> = ({ t, a, b, lower = "EMEKLİ EMNİYET MÜDÜRÜ", sub = "güvenlik yorumcusu", topic = "SİLAHLI SALDIRILAR NASIL ÖNLENİR?", label }) => (
  <g>
    {bg("#06080C")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]} c0={[960, 520]}>
      {/* TV kasası */}
      <rect x={250} y={90} width={1420} height={820} rx={20} fill="#111" stroke="#2A2F38" strokeWidth={8} />
      <defs><linearGradient id="vStudio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#123A6A" /><stop offset="1" stopColor="#0A1A30" /></linearGradient></defs>
      <rect x={280} y={120} width={1360} height={760} fill="url(#vStudio)" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={300 + i * 150} y={140} width={120} height={420} fill="#1E5A9A" opacity={0.12 + 0.08 * (i % 2)} />)}
      <clipPath id="vTvClip"><rect x={280} y={120} width={1360} height={760} /></clipPath>
      <g clipPath="url(#vTvClip)"><Person x={960} y={980} s={1.25} t={t} o={HAMZA_TV} talk arms="desk" mouth="open" brow="angry" seed={3} /></g>
      <rect x={280} y={120} width={1360} height={760} fill="#000" opacity={0.08} />
      {/* alt yazı */}
      <g opacity={rp(t, a + 0.3, a + 0.7)}>
        <rect x={280} y={700} width={980} height={110} fill={TRR} />
        {T(310, 755, lower, 46, "#FFF", 800)}
        <rect x={280} y={810} width={980} height={50} fill="#0B0E14" />
        {T(310, 845, sub, 28, "#C8D0DA", 600)}
      </g>
      <rect x={280} y={120} width={330} height={58} fill="#0B0E14" opacity={0.85} />{T(300, 160, "● CANLI", 30, TRR, 800)}
      <rect x={280} y={860} width={1360} height={20} fill="#0B0E14" />
      {T(1620 - md2((t - a) * 160, 1700), 876, topic + "   ·   " + topic, 16, "#AAB", 700)}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Sosyal medya (öfkeli paylaşımlar, metin bulanık) ─────────
export const Posts: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 500]}>
      <rect x={660} y={60} width={600} height={1000} rx={50} fill="#0E1118" stroke="#2A2F38" strokeWidth={10} />
      {Array.from({ length: 5 }, (_, i) => {
        const on = rp(t, a + 0.2 + i * 0.45, a + 0.6 + i * 0.45);
        return (
          <g key={i} opacity={on} transform={`translate(700,${130 + i * 180 + (1 - on) * 30})`}>
            <rect width={520} height={160} rx={16} fill="#161B26" />
            <circle cx={44} cy={44} r={26} fill="#3A4A66" />
            <rect x={84} y={28} width={180} height={14} rx={7} fill="#C8D0DA" opacity={0.7} /><rect x={84} y={50} width={110} height={10} rx={5} fill="#7D8796" />
            {[0, 1, 2].map((j) => <rect key={j} x={28} y={86 + j * 20} width={[440, 380, 300][j] - (i * 13) % 60} height={12} rx={6} fill="#AAB2C0" opacity={0.55} />)}
            <circle cx={480} cy={40} r={14} fill={TRR} opacity={0.85} />{T(480, 47, "!", 22, "#FFF", 900, "middle")}
          </g>
        );
      })}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Victoria telefonu ─────────
const NUMS = ["+421 9•• ••• 41", "+27 8• ••• 2207", "+421 9•• ••• 18", "+27 7• ••• 6634", "+421 9•• ••• 92", "+27 8• ••• 0751", "+421 9•• ••• 07", "+27 6• ••• 3120", "+421 9•• ••• 55"];
export const VicPhone: React.FC<P & { nums?: number; ring?: boolean; label?: [string, string?] }> = ({ t, a, b, nums = 0, ring = true, label }) => {
  const shake = ring ? Math.sin(t * 40) * 4 * (Math.sin(t * 2) > 0 ? 1 : 0) : 0;
  return (
    <g>
      {bg("#07080D")}
      <circle cx={nums ? 600 : 960} cy={540} r={420} fill={VIO} opacity={0.07} />
      <HCam t={t} a={a} b={b} z={[1.0, 1.07]}>
        <g transform={`translate(${(nums ? 600 : 960) + shake},540)`}>
          <rect x={-230} y={-440} width={460} height={880} rx={56} fill="#0C0E14" stroke="#2E3340" strokeWidth={10} />
          <rect x={-200} y={-400} width={400} height={800} rx={36} fill="#141824" />
          <circle cx={0} cy={-210} r={86} fill="#2A2236" /><circle cx={0} cy={-235} r={32} fill={VIO} opacity={0.6} /><path d="M-55,-150 Q0,-210 55,-150Z" fill={VIO} opacity={0.6} />
          {T(0, -60, "Victoria", 54, "#FFF", 800, "middle")}
          {T(0, -15, "Global PI Services", 26, "#AAB2C0", 600, "middle")}
          {T(0, 25, ring ? "arıyor..." : "", 26, VIO, 600, "middle")}
          {ring && [0, 1, 2].map((i) => <circle key={i} cx={0} cy={-210} r={86 + ((t * 60 + i * 40) % 120)} fill="none" stroke={VIO} strokeWidth={3} opacity={1 - ((t * 60 + i * 40) % 120) / 120} />)}
          <circle cx={-110} cy={300} r={46} fill={TRR} /><circle cx={110} cy={300} r={46} fill={MON} />
        </g>
        {nums > 0 && (
          <g>
            {T(1000, 150, "VICTORIA'NIN NUMARALARI", 34, VIO, 800)}
            {NUMS.slice(0, nums).map((n, i) => {
              const on = rp(t, a + 0.3 + i * 0.28, a + 0.5 + i * 0.28);
              return <g key={i} opacity={on}><rect x={1000} y={190 + i * 86} width={720} height={70} rx={8} fill="#141824" />{T(1030, 236 + i * 86, n, 32, "#E6E8EE", 700, "start", { fontFamily: "monospace" })}{T(1690, 236 + i * 86, n.startsWith("+421") ? "SLOVAKYA" : "G. AFRİKA", 22, "#7D8796", 700, "end")}</g>;
            })}
            <g opacity={rp(t, a + 3, a + 3.4)}>{T(1360, 1010, `${nums} farklı numara`, 40, AMB, 800, "middle")}</g>
          </g>
        )}
      </HCam>
      {lbl(t, a, label, VIO)}
    </g>
  );
};

// ───────── Üç kural ─────────
const RULES: [string, string, string][] = [["1", "ANALİZ", "tutuklamadan önemli"], ["2", "BİLGİ", "silahtan değerli"], ["3", "SIZMAK", "savaşmaktan ucuz"]];
export const Rules: React.FC<P & { hi?: number; upto?: number }> = ({ t, a, b, hi = -1, upto = 3 }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
      {RULES.slice(0, upto).map(([n, h, s], i) => {
        const on = rp(t, a + 0.2 + i * 0.4, a + 0.6 + i * 0.4), H = i === hi, dim = hi >= 0 && !H;
        return (
          <g key={i} opacity={on * (dim ? 0.35 : 1)} transform={`translate(${210 + i * 520},${300 + (1 - on) * 40}) scale(${H ? 1.06 : 1})`}>
            <rect width={460} height={480} rx={14} fill="#0E131C" stroke={H ? TRR : "#1F2938"} strokeWidth={H ? 6 : 3} />
            <rect width={460} height={10} fill={H ? TRR : "#1F2938"} />
            {T(230, 170, n, 130, H ? TRR : "#3A4658", 900, "middle")}
            {T(230, 300, h, 62, "#FFF", 900, "middle")}
            {T(230, 360, s, 32, "#AAB2C0", 600, "middle")}
          </g>
        );
      })}
      {T(960, 200, "İSTİHBARATIN ÜÇ KURALI", 44, AMB, 800, "middle")}
    </HCam>
  </g>
);

// ───────── Boru hattı (Colonial, 2021) ─────────
export const Pipeline: React.FC<P & { mode?: "flow" | "locked" | "queue"; label?: [string, string?] }> = ({ t, a, b, mode = "flow", label }) => {
  const locked = mode !== "flow";
  return (
    <g>
      {bg("#070A10")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
        {mode !== "queue" && (
          <g>
            <path d="M120,820 C500,820 600,520 960,520 S1500,260 1820,240" stroke="#2A3240" strokeWidth={46} fill="none" />
            <path d="M120,820 C500,820 600,520 960,520 S1500,260 1820,240" stroke={locked ? "#3A1010" : "#C88A2A"} strokeWidth={20} fill="none" strokeDasharray="40 30" strokeDashoffset={locked ? 0 : -(t * 160)} />
            {T(120, 900, "TEKSAS", 30, "#7D8796", 800)}{T(1820, 200, "NEW YORK", 30, "#7D8796", 800, "end")}
            {T(960, 640, "8.850 km", 40, AMB, 800, "middle")}
            {locked && (
              <g opacity={rp(t, a + 0.3, a + 0.8)}>
                <rect x={560} y={160} width={800} height={280} rx={12} fill="#120608" stroke={X.red} strokeWidth={4} />
                <path d="M960,210 v-20 a40,40 0 0 1 80,0 v20" stroke={X.red} strokeWidth={10} fill="none" transform="translate(-40,0)" /><rect x={900} y={210} width={120} height={80} rx={10} fill={X.red} />
                {T(960, 350, typed("DOSYALARINIZ ŞİFRELENDİ", rp(t, a + 0.6, a + 1.8)), 44, "#FFF", 800, "middle", { fontFamily: "monospace" })}
                {T(960, 405, "DarkSide · 7 Mayıs 2021", 28, "#C8A0A0", 600, "middle")}
              </g>
            )}
          </g>
        )}
        {mode === "queue" && (
          <g>
            <rect x={0} y={780} width={1920} height={300} fill="#12161E" />
            <rect x={1380} y={430} width={420} height={36} fill="#2A3240" /><rect x={1420} y={466} width={24} height={320} fill="#2A3240" /><rect x={1740} y={466} width={24} height={320} fill="#2A3240" />
            <rect x={1540} y={600} width={90} height={180} rx={8} fill="#1E2632" />{T(1585, 650, "YOK", 30, X.red, 900, "middle")}
            {Array.from({ length: 11 }, (_, i) => {
              const x = 1300 - i * 150 + Math.min(0, -((t - a) * 6) % 20);
              return <g key={i} transform={`translate(${x},800)`}><rect x={0} y={0} width={130} height={56} rx={14} fill={["#3A4656", "#5A3A3A", "#2E4A3A", "#4A4A5A"][i % 4]} /><rect x={20} y={-26} width={86} height={34} rx={10} fill="#1A2230" /><circle cx={28} cy={58} r={14} fill="#0A0A0A" /><circle cx={102} cy={58} r={14} fill="#0A0A0A" /></g>;
            })}
            {T(960, 220, "KİLOMETRELERCE KUYRUK", 64, "#FFF", 900, "middle")}
            {T(960, 290, "75 Bitcoin fidye · ≈ 4,4 milyon dolar", 36, AMB, 700, "middle")}
          </g>
        )}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Paravan şirket ─────────
export const FrontCo: React.FC<P & { name?: string; city?: string; reveal?: boolean; label?: [string, string?] }> = ({ t, a, b, name = "GLOBAL PI SERVICES", city = "Güney Afrika", reveal, label }) => {
  const r = reveal ? rp(t, a + 1.2, a + 2.2) : 0;
  return (
    <g>
      {bg("#08090D")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 520]}>
        <rect x={360} y={160} width={1200} height={760} fill="#141922" />
        {Array.from({ length: 4 }, (_, row) => Array.from({ length: 6 }, (_, c) => <rect key={row * 6 + c} x={410 + c * 185} y={300 + row * 140} width={140} height={100} fill={hash(row * 6 + c) > 0.5 ? "#3A3220" : "#1A2130"} opacity={0.9} />))}
        <rect x={460} y={190} width={1000} height={90} rx={6} fill="#E6E8EE" />
        {T(960, 252, name, 52, "#0B0E14", 900, "middle")}
        {T(960, 980, city, 32, "#AAB2C0", 700, "middle")}
        <g opacity={r}>
          <rect x={360} y={160} width={1200} height={760} fill="#000" opacity={0.55} />
          <circle cx={960} cy={560} r={150} fill="none" stroke={VIO} strokeWidth={8} />
          {T(960, 610, "?", 150, VIO, 900, "middle")}
        </g>
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Polis geçmişi + ihraç ─────────
export const CopFile: React.FC<P & { stamp?: string; yr?: string; label?: [string, string?] }> = ({ t, a, b, stamp = "MESLEKTEN İHRAÇ", yr = "2002", label }) => (
  <g>
    {bg("#0A0C10")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      <Person x={520} y={1150} s={1.5} t={t} o={HAMZA_COP} mouth="flat" brow="flat" seed={2} />
      <g transform="translate(1000,180) rotate(-3)">
        <rect width={720} height={720} fill="#E9E4D8" />
        {T(40, 80, "EMNİYET GENEL MÜDÜRLÜĞÜ", 30, "#2A2A2A", 800)}
        {T(40, 130, "Personel dosyası · Güngören İlçe Emn. Md.", 24, "#555", 600)}
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={40} y={190 + i * 44} width={[600, 520, 560, 480, 600, 420, 540, 500, 300][i]} height={14} rx={7} fill="#9A958A" />)}
        {T(40, 660, `Yıl: ${yr}`, 34, "#2A2A2A", 800)}
        <Stamp x={360} y={470} t={t} at={a + 0.9} s={stamp} c={X.red} rot={-12} size={58} />
      </g>
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Veri listesi ─────────
export const DataList: React.FC<P & { items: string[]; head?: string; c?: string }> = ({ t, a, b, items, head = "BULABİLİRİM", c = AMB }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
      {T(960, 170, head, 52, c, 900, "middle")}
      {items.map((s, i) => {
        const on = rp(t, a + 0.3 + i * 0.4, a + 0.55 + i * 0.4), col = i % 2, row = Math.floor(i / 2);
        return (
          <g key={i} opacity={on} transform={`translate(${280 + col * 700},${260 + row * 190})`}>
            <rect width={640} height={150} rx={12} fill="#0E131C" stroke="#1F2938" strokeWidth={3} />
            <rect x={30} y={45} width={60} height={60} rx={8} fill="none" stroke={c} strokeWidth={4} />
            {on > 0.9 && <path d="M42,76 l16,16 l30,-36" stroke={c} strokeWidth={8} fill="none" />}
            {T(120, 92, s, 40, "#FFF", 700)}
          </g>
        );
      })}
    </HCam>
  </g>
);

// ───────── Banka havalesi / ödeme kartı ─────────
export const Transfer: React.FC<P & { amt: string; from: string; who?: string; via?: string; c?: string; label?: [string, string?] }> = ({ t, a, b, amt, from, who, via = "BANKA HAVALESİ", c = MON, label }) => {
  const k = rp(t, a + 0.3, a + 1.3);
  return (
    <g>
      {bg("#07090E")}
      <circle cx={960} cy={520} r={460} fill={c} opacity={0.05} />
      <HCam t={t} a={a} b={b} z={[1.02, 1.08]}>
        <rect x={460} y={220} width={1000} height={600} rx={24} fill="#0E131C" stroke="#1F2938" strokeWidth={4} />
        {T(520, 300, via, 32, "#7D8796", 800)}
        {T(520, 380, "Gönderen", 26, "#7D8796", 600)}{T(520, 430, from, 44, "#FFF", 800)}
        {who && <>{T(520, 500, "Hesap sahibi görünen isim", 24, "#7D8796", 600)}{T(520, 545, who, 40, VIO, 800)}</>}
        <rect x={520} y={590} width={880} height={4} fill="#1F2938" />
        <rect x={520} y={590} width={880 * k} height={4} fill={c} />
        {T(1400, 730, amt, 96, c, 900, "end", { opacity: rp(t, a + 1.2, a + 1.6) })}
        {T(520, 730, k < 1 ? "aktarılıyor..." : "TAMAMLANDI", 30, k < 1 ? "#AAB2C0" : c, 800)}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Otel buluşması (Belgrad) ─────────
export const Hotel: React.FC<P & { who?: "vic" | "two"; label?: [string, string?]; say?: string }> = ({ t, a, b, who = "vic", label, say }) => (
  <g>
    {bg("#0C0A08")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]} c0={[960, 560]}>
      <rect x={0} y={0} width={1920} height={760} fill="#1A1410" />
      <rect x={700} y={90} width={520} height={420} fill="#0A1020" stroke="#3A2E22" strokeWidth={14} />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={720 + hash(i) * 470} y={300 + hash(i * 3) * 190} width={8} height={8} fill={AMB} opacity={0.3 + hash(i * 7) * 0.5} />)}
      <path d="M720,420 Q960,380 1200,430 V490 H720Z" fill="#05080F" />
      {T(960, 140, "BELGRAD", 26, "#5A6A84", 800, "middle")}
      <circle cx={360} cy={200} r={60} fill="#F2C27A" opacity={0.18} /><rect x={340} y={250} width={40} height={300} fill="#2A2018" />
      <rect x={0} y={760} width={1920} height={320} fill="#2A1E16" />
      <ellipse cx={960} cy={860} rx={260} ry={50} fill="#3A2A1E" />
      <Person x={560} y={1120} s={1.25} t={t} o={HAMZA} arms="desk" look={0.6} talk seed={1} />
      {who === "vic" ? <BackView x={1360} y={1130} s={1.25} t={t} o={VIC} seed={4} /> : <><BackView x={1260} y={1130} s={1.15} t={t} o={{ ...VIC, hairStyle: "short", hair: "#3A2E26", kind: "jacket" }} seed={4} /><BackView x={1580} y={1130} s={1.15} t={t} o={{ ...VIC, hairStyle: "bun", hair: "#2A1E16" }} seed={6} /></>}
      {say && <g opacity={rp(t, a + 0.6, a + 1)}><rect x={1120} y={560} width={640} height={110} rx={20} fill="#F4F1EA" /><path d="M1300,670 l30,40 l20,-40Z" fill="#F4F1EA" />{T(1440, 628, say, 32, "#1A1A1A", 700, "middle")}</g>}
    </HCam>
    {lbl(t, a, label, VIO)}
  </g>
);

// ───────── Takip vizörü ─────────
export const Viewfinder: React.FC<P & { place?: string; date?: string; who?: Look; scene?: "hotel" | "venue" | "airport" | "street"; label?: [string, string?] }> = ({ t, a, b, place = "ETİLER", date = "08.2019", who = TARGET, scene = "venue", label }) => {
  const px = lp(1300, 900, rp(t, a, b));
  return (
    <g>
      {bg("#0A0C0E")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.12]} c0={[960, 560]}>
        <rect width={1920} height={1080} fill={scene === "airport" ? "#1A2230" : "#16130F"} />
        {scene === "hotel" && <><rect x={500} y={120} width={920} height={700} fill="#2A2218" /><rect x={760} y={420} width={400} height={400} fill="#0E0B08" />{T(960, 230, "HOTEL", 70, "#C9A54A", 800, "middle")}</>}
        {scene === "venue" && <>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 330} y={180} width={300} height={500} fill={i % 2 ? "#221C14" : "#2A2218"} />)}{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={100 + i * 160} cy={140} r={10} fill={AMB} opacity={0.6} />)}</>}
        {scene === "airport" && <><rect x={0} y={150} width={1920} height={60} fill="#2A3A52" />{T(960, 195, "ÇIKIŞ · EXIT", 40, "#F2C230", 800, "middle")}{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={210} width={20} height={600} fill="#2A3240" />)}</>}
        {scene === "street" && <><rect x={0} y={200} width={1920} height={560} fill="#2A2620" />{Array.from({ length: 5 }, (_, i) => <rect key={i} x={60 + i * 380} y={260} width={300} height={360} fill="#1A1814" />)}</>}
        <rect x={0} y={800} width={1920} height={280} fill="#0E0D0B" />
        <Person x={px} y={1120} s={1.1} t={t} o={who} seed={5} look={-0.4} />
      </HCam>
      {/* vizör */}
      <g>
        {[[120, 100, 1], [1800, 100, -1]].map(([x, y, s], i) => <path key={i} d={`M${x},${y + 80} V${y} H${x + 80 * s}`} stroke="#FFF" strokeWidth={5} fill="none" />)}
        {[[120, 980, 1], [1800, 980, -1]].map(([x, y, s], i) => <path key={i} d={`M${x},${y - 80} V${y} H${x + 80 * s}`} stroke="#FFF" strokeWidth={5} fill="none" />)}
        <circle cx={190} cy={170} r={14} fill={X.red} opacity={blink(t, 3)} />{T(220, 182, "REC", 34, "#FFF", 800)}
        {T(1760, 182, `${place} · ${date}`, 30, "#FFF", 700, "end", { fontFamily: "monospace" })}
        <rect x={px - 130} y={560} width={260} height={480} fill="none" stroke={AMB} strokeWidth={3} opacity={0.8} />
      </g>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Bitcoin cüzdanı ─────────
export const Wallet: React.FC<P & { amt?: string; note?: string; label?: [string, string?] }> = ({ t, a, b, amt = "+ ₿ ?", note = "kayıt yok · iz yok", label }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <rect x={660} y={80} width={600} height={940} rx={50} fill="#0E1118" stroke="#2A2F38" strokeWidth={10} />
      <circle cx={960} cy={300} r={110} fill="#F7931A" /><text x={960} y={345} fontSize={140} fontWeight={900} fill="#FFF" textAnchor="middle">₿</text>
      {T(960, 490, "Gelen işlem", 30, "#7D8796", 700, "middle")}
      {T(960, 580, amt, 72, MON, 900, "middle", { opacity: rp(t, a + 0.5, a + 1) })}
      {Array.from({ length: 4 }, (_, i) => <g key={i} opacity={rp(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25)}><rect x={720} y={650 + i * 80} width={480} height={60} rx={10} fill="#161B26" />{T(745, 690 + i * 80, `bc1q${Math.floor(hash(i + 3) * 1e6).toString(36)}••••`, 24, "#AAB2C0", 600, "start", { fontFamily: "monospace" })}</g>)}
      {T(960, 1060, note, 32, AMB, 800, "middle")}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Kod adı zinciri ─────────
const CHAIN: [string, string][] = [["VICTORIA", "2019"], ["ROBERT", "2020"], ["ANDREA", "2020"], ["MARC", "Temmuz 2022"]];
export const Chain: React.FC<P & { upto?: number; hi?: number }> = ({ t, a, b, upto = 4, hi = -1 }) => (
  <g>
    {bg("#07080D")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      {T(960, 180, "KOD ADLARI", 44, VIO, 900, "middle")}
      {CHAIN.slice(0, upto).map(([n, d], i) => {
        const x = 270 + i * 460, on = rp(t, a + 0.2 + i * 0.5, a + 0.5 + i * 0.5), H = i === hi;
        return (
          <g key={i} opacity={on * (hi >= 0 && !H ? 0.45 : 1)}>
            {i > 0 && <path d={`M${x - 330},540 H${x - 130}`} stroke={VIO} strokeWidth={4} strokeDasharray="12 10" />}
            <circle cx={x} cy={470} r={110} fill="#16121F" stroke={H ? VIO : "#3A3050"} strokeWidth={H ? 8 : 4} />
            <circle cx={x} cy={440} r={38} fill="#3A3050" /><path d={`M${x - 62},540 Q${x},460 ${x + 62},540Z`} fill="#3A3050" />
            {T(x, 650, n, 44, "#FFF", 900, "middle")}{T(x, 700, d, 28, "#AAB2C0", 600, "middle")}
          </g>
        );
      })}
    </HCam>
  </g>
);

// ───────── Ekip panosu ─────────
export const TEAM: [string, string][] = [["E.K.", "emekli polis · takip"], ["Ö.B.G.", "istifa etmiş polis · takip"], ["Ö.Ş.", "ihraç polis · takip"], ["İ.K.", "ihraç polis · bilgi"], ["M.Y.", "vergi dairesi · şirket bilgisi"], ["H.K.", "seyahat + pasaport"], ["F.K.", "kız arkadaşı · kamuflaj"]];
export const Team: React.FC<P & { upto?: number; hi?: number }> = ({ t, a, b, upto = 7, hi = -1 }) => (
  <g>
    {bg("#1A140E")}
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i * 3) * 1080} r={2} fill="#000" opacity={0.3} />)}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      {TEAM.slice(0, upto).map(([n, r], i) => {
        const an = -Math.PI / 2 + (i / 7) * Math.PI * 2, x = 960 + Math.cos(an) * 640, y = 540 + Math.sin(an) * 360, on = rp(t, a + 0.3 + i * 0.3, a + 0.55 + i * 0.3), H = i === hi;
        return (
          <g key={i} opacity={on * (hi >= 0 && !H ? 0.5 : 1)}>
            <line x1={960} y1={540} x2={x} y2={y} stroke={X.red} strokeWidth={3} opacity={0.8} />
            <g transform={`translate(${x},${y}) rotate(${(hash(i) - 0.5) * 8})`}>
              <rect x={-130} y={-90} width={260} height={180} fill="#EDE8DC" />
              <rect x={-110} y={-72} width={70} height={84} fill="#3A3A3A" />
              {T(30, -30, n, 34, "#1A1A1A", 900, "middle")}
              {T(0, 50, r, 18, "#333", 700, "middle")}
              <circle cx={0} cy={-90} r={9} fill={X.red} />
            </g>
          </g>
        );
      })}
      <g transform="translate(960,540)">
        <rect x={-160} y={-110} width={320} height={220} fill="#EDE8DC" stroke={X.red} strokeWidth={5} />
        {T(0, -20, "HAMZA T. AYBERK", 30, "#1A1A1A", 900, "middle")}{T(0, 30, "ekip başı", 24, "#555", 700, "middle")}
      </g>
    </HCam>
  </g>
);

// ───────── Instagram tuzağı → karakol videosu ─────────
export const InstaTrap: React.FC<P & { step?: 0 | 1 | 2; label?: [string, string?] }> = ({ t, a, b, step = 0, label }) => (
  <g>
    {bg("#08090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.07]}>
      {step === 0 && (
        <g>
          <rect x={660} y={60} width={600} height={980} rx={50} fill="#0E1118" stroke="#2A2F38" strokeWidth={10} />
          <circle cx={760} cy={170} r={44} fill="#5A4A6A" />{T(830, 160, "hamza.k_____", 30, "#FFF", 800)}{T(830, 196, "sahte hesap", 24, X.red, 700)}
          {[0, 1, 2, 3].map((i) => <g key={i} opacity={rp(t, a + 0.4 + i * 0.5, a + 0.7 + i * 0.5)}><rect x={700} y={270 + i * 140} width={420} height={100} rx={26} fill="#3A2A4A" /><rect x={730} y={305 + i * 140} width={300 - i * 30} height={14} rx={7} fill="#C8B8D8" /><rect x={730} y={330 + i * 140} width={200} height={12} rx={6} fill="#C8B8D8" opacity={0.6} /></g>)}
          {T(960, 1010, "taciz mesajları", 30, AMB, 800, "middle")}
        </g>
      )}
      {step >= 1 && (
        <g>
          <rect width={1920} height={1080} fill="#1C2230" />
          <rect x={0} y={760} width={1920} height={320} fill="#141A24" />
          <rect x={160} y={120} width={600} height={110} fill="#0E3A6A" />{T(460, 192, "POLİS MERKEZİ", 50, "#FFF", 900, "middle")}
          <rect x={300} y={700} width={1320} height={40} fill="#3A3026" />
          <Person x={620} y={1130} s={1.2} t={t} o={TUNUS} mouth="o" eyes="wide" brow="worry" seed={2} />
          <Person x={1240} y={1130} s={1.3} t={t} o={HAMZA} arms={step === 2 ? "phone" : "cross"} mouth="tight" brow="angry" talk seed={7} />
          {step === 2 && <g><circle cx={1500} cy={280} r={16} fill={X.red} opacity={blink(t)} />{T(1530, 293, "REC", 34, "#FFF", 800)}<path d="M1520,380 C1650,300 1760,320 1830,240" stroke={VIO} strokeWidth={5} fill="none" strokeDasharray="14 10" strokeDashoffset={-(t * 60)} />{T(1840, 220, "→ Victoria", 34, VIO, 800, "end")}</g>}
        </g>
      )}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Tophane kimlik kontrolü / takip ─────────
export const Street: React.FC<P & { mode?: "check" | "follow"; label?: [string, string?] }> = ({ t, a, b, mode = "check", label }) => {
  const walk = mode === "follow" ? (t - a) * 60 : 0;
  return (
    <g>
      {bg("#141210")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
        <rect width={1920} height={760} fill="#2A2520" />
        {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={i * 340 - 40} y={180} width={300} height={500} fill={i % 2 ? "#221E18" : "#2E2820"} />{Array.from({ length: 4 }, (_, j) => <rect key={j} x={i * 340 + (j % 2) * 120} y={230 + Math.floor(j / 2) * 170} width={80} height={110} fill={AMB} opacity={0.12 + hash(i + j) * 0.2} />)}</g>)}
        <rect y={760} width={1920} height={320} fill="#1A1714" />
        {mode === "check" ? (
          <g>
            <Person x={700} y={1120} s={1.15} t={t} o={IRAN1} mouth="flat" brow="worry" seed={1} />
            <Person x={900} y={1120} s={1.15} t={t} o={IRAN2} mouth="flat" brow="worry" seed={3} />
            <Person x={1180} y={1120} s={1.15} t={t} o={EXCOP} arms="hold" mouth="flat" brow="angry" seed={5} dir={-1} />
            <Person x={1400} y={1120} s={1.15} t={t} o={EXCOP} mouth="tight" seed={8} dir={-1} />
            <g opacity={rp(t, a + 1, a + 1.6)}><Person x={lp(1900, 1620, rp(t, a + 1, a + 2.5))} y={1120} s={1.15} t={t} o={HAMZA} talk mouth="open" seed={9} dir={-1} /></g>
            <rect x={1080} y={720} width={90} height={60} rx={6} fill="#C8D0DA" opacity={0.9} />
          </g>
        ) : (
          <g>
            <Person x={1300 + walk} y={1120} s={1.0} t={t} o={IRAN1} seed={1} />
            <Person x={1460 + walk} y={1120} s={1.0} t={t} o={IRAN2} seed={3} />
            <Person x={380 + walk} y={1120} s={1.1} t={t} o={HAMZA} seed={5} look={1} />
            <Person x={560 + walk} y={1120} s={1.05} t={t} o={FUNDA} seed={6} look={1} />
            <g opacity={rp(t, a + 0.8, a + 1.3)}><rect x={300 + walk} y={560} width={360} height={60} rx={8} fill="#0B0E14" opacity={0.85} />{T(480 + walk, 600, "“aile gibi”", 32, AMB, 800, "middle")}</g>
          </g>
        )}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Takip cihazı ─────────
export const Tracker: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => (
  <g>
    {bg("#0A0E14")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={0} y={i * 90} width={1920} height={2} fill="#1A2230" />)}
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={i * 100} y={0} width={2} height={1080} fill="#1A2230" />)}
      <g transform="translate(700,560)">
        <rect x={-240} y={-120} width={480} height={240} rx={70} fill="#2A3A4E" /><rect x={-150} y={-100} width={300} height={200} rx={30} fill="#1A2430" />
        <circle cx={200} cy={110} r={22} fill={X.red} opacity={blink(t, 4)} />
        {[0, 1, 2].map((i) => <circle key={i} cx={200} cy={110} r={22 + ((t * 80 + i * 50) % 150)} fill="none" stroke={X.red} strokeWidth={3} opacity={1 - ((t * 80 + i * 50) % 150) / 150} />)}
      </g>
      <path d="M720,600 C1000,420 1300,700 1700,300" stroke={X.red} strokeWidth={4} fill="none" strokeDasharray="10 12" strokeDashoffset={-(t * 80)} />
      <rect x={1460} y={180} width={400} height={120} rx={10} fill="#0B0E14" stroke="#2A3240" />{T(1480, 230, "KONUM · ANLIK", 28, X.red, 800)}{T(1480, 275, `41.0${Math.floor(t * 7) % 10}° N · 28.9${Math.floor(t * 5) % 10}° E`, 26, "#C8D0DA", 600, "start", { fontFamily: "monospace" })}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Arşiv masası ─────────
const ARCH: [string, string][] = [["PASAPORT", "bir Suriyelinin bilgileri"], ["FOTOĞRAF", "Başkonsolosluk önü protesto"], ["DERGİ", "kapakta Dışişleri Bakanı"], ["KROKİ", "28 Ekim 2023 · miting güvenliği"]];
export const Archive: React.FC<P & { hi?: number; label?: [string, string?] }> = ({ t, a, b, hi = -1, label }) => (
  <g>
    {bg("#18120C")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]} c0={hi >= 0 ? [300 + hi * 440, 560] : [960, 540]} c1={hi >= 0 ? [300 + hi * 440, 560] : [960, 540]}>
      <rect width={1920} height={1080} fill="#2A1E14" />
      {ARCH.map(([h, s], i) => {
        const x = 120 + i * 440, on = rp(t, a + 0.2 + i * 0.3, a + 0.5 + i * 0.3), H = i === hi;
        return (
          <g key={i} opacity={on * (hi >= 0 && !H ? 0.45 : 1)} transform={`translate(${x},${260 + (i % 2) * 60}) rotate(${(i - 1.5) * 3})`}>
            <rect width={360} height={480} fill={i === 3 ? "#DDE6EE" : "#EDE8DC"} />
            {i === 0 && <><rect x={30} y={40} width={300} height={50} fill="#7A1F2A" />{T(180, 75, "PASAPORT", 26, "#FFF", 800, "middle")}<rect x={30} y={120} width={110} height={140} fill="#555" /><rect x={30} y={120} width={110} height={140} fill="#888" opacity={0.5} /></>}
            {i === 1 && Array.from({ length: 4 }, (_, j) => <rect key={j} x={30 + (j % 2) * 155} y={40 + Math.floor(j / 2) * 170} width={140} height={150} fill="#3A3A3A" />)}
            {i === 2 && <><rect x={30} y={30} width={300} height={420} fill="#2A3A5A" /><circle cx={180} cy={200} r={80} fill="#4A5A7A" /><rect x={50} y={320} width={260} height={30} fill="#FFF" opacity={0.6} /></>}
            {i === 3 && <>{Array.from({ length: 6 }, (_, j) => <rect key={j} x={40 + (j % 3) * 100} y={60 + Math.floor(j / 3) * 140} width={80} height={100} fill="none" stroke="#2A4A7A" strokeWidth={3} />)}<path d="M40,380 H320" stroke={X.red} strokeWidth={4} /><circle cx={180} cy={330} r={30} fill="none" stroke={X.red} strokeWidth={4} /></>}
            {T(180, 520, h, 34, "#FFF", 900, "middle")}{T(180, 560, s, 22, "#C8C0B0", 600, "middle")}
          </g>
        );
      })}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Baz istasyonu ─────────
export const BaseStation: React.FC<P & { n?: number }> = ({ t, a, b, n = 1483 }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      <path d="M960,240 L900,800 H1020Z" fill="none" stroke="#3A4658" strokeWidth={10} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${960 - 80 - i * 50},${300 - i * 10} a${100 + i * 50},${100 + i * 50} 0 0 1 0,${120 + i * 40}`} stroke={AMB} strokeWidth={5} fill="none" opacity={blink(t + i, 2)} transform={`rotate(180,960,360)`} />)}
      {[0, 1, 2].map((i) => <path key={"r" + i} d={`M${960 + 80 + i * 50},${300 - i * 10} a${100 + i * 50},${100 + i * 50} 0 0 1 0,${120 + i * 40}`} stroke={AMB} strokeWidth={5} fill="none" opacity={blink(t + i, 2)} />)}
      {[[420, 640], [1500, 640]].map(([x, y], i) => <g key={i}><rect x={x - 60} y={y - 110} width={120} height={220} rx={18} fill="#141824" stroke="#3A4658" strokeWidth={5} /><path d={`M${x},${y - 120} Q${(x + 960) / 2},${200} 960,300`} stroke={i ? VIO : X.red} strokeWidth={3} fill="none" strokeDasharray="8 8" strokeDashoffset={-(t * 50)} />{T(x, y + 160, i ? "EKİP ÜYESİ" : "HAMZA", 30, "#C8D0DA", 800, "middle")}</g>)}
      {T(960, 950, fmt(Math.round(n * rp(t, a + 0.4, a + 2.2))), 120, AMB, 900, "middle")}
      {T(960, 1020, "ortak baz kaydı · 3 telefon hattı", 32, "#AAB2C0", 700, "middle")}
    </HCam>
  </g>
);

// ───────── 98 hesap ─────────
export const Accounts98: React.FC<P> = ({ t, a, b }) => (
  <g>
    {bg("#07090E")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      {Array.from({ length: 98 }, (_, i) => {
        const x = 230 + (i % 14) * 106, y = 200 + Math.floor(i / 14) * 86, on = rp(t, a + 0.2 + i * 0.018, a + 0.3 + i * 0.018), act = i < 63;
        return <g key={i} opacity={on}><rect x={x} y={y} width={92} height={70} rx={8} fill={act ? "#0F2A1C" : "#161A22"} stroke={act ? MON : "#3A4250"} strokeWidth={2} />{T(x + 46, y + 44, "₺", 26, act ? MON : "#4A5260", 800, "middle")}</g>;
      })}
      <g opacity={rp(t, a + 2.2, a + 2.6)}>{T(560, 900, "63 aktif", 50, MON, 900, "middle")}{T(960, 900, "35 kapalı", 50, "#7D8796", 900, "middle")}{T(1360, 900, "98 hesap", 50, "#FFF", 900, "middle")}</g>
    </HCam>
  </g>
);

// ───────── Portre (temsili) ─────────
export const Portrait: React.FC<P & { o?: Look; tag?: string; sub?: string; c?: string; blur?: boolean; mood?: "calm" | "angry" | "smug" | "fear" }> = ({ t, a, b, o = HAMZA, tag = "Hamza Turhan Ayberk", sub = "temsili çizim", c = TRR, mood = "calm" }) => (
  <g>
    {bg("#07090E")}
    <circle cx={960} cy={480} r={520} fill={c} opacity={0.06} />
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <Person x={960} y={1200} s={1.75} t={t} o={o} mouth={mood === "smug" ? "tight" : mood === "angry" ? "open" : mood === "fear" ? "o" : "flat"} eyes={mood === "fear" ? "wide" : mood === "smug" ? "half" : "open"} brow={mood === "angry" || mood === "smug" ? "angry" : mood === "fear" ? "worry" : "flat"} />
    </HCam>
    <Label x={80} y={960} k={rp(t, a + 0.4, a + 0.9)} a={tag} b={sub} c={c} />
  </g>
);

// ───────── Gölge (yüzü yok) ─────────
export const Shadow: React.FC<P & { name?: string; sub?: string; c?: string }> = ({ t, a, b, name = "VICTORIA", sub = "sesi var, yüzü yok", c = VIO }) => (
  <g>
    <KDefs />
    {bg("#06060A")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
      <circle cx={960} cy={420} r={420} fill={c} opacity={0.08} />
      <BackView x={960} y={1330} s={1.6} t={t} o={VIC} seed={2} />
      <rect width={1920} height={1080} fill="#000" opacity={0.25} />
    </HCam>
    <g opacity={rp(t, a + 0.4, a + 0.9)}>{T(960, 900, name, 90, c, 900, "middle")}{T(960, 960, sub, 34, "#AAB2C0", 600, "middle")}</g>
  </g>
);

// ───────── KÖSTEBEK mühür ─────────
export const Mole: React.FC<P & { s?: string; sub?: string }> = ({ t, a, b, s = "KÖSTEBEK", sub = "MİT + İstanbul Emniyeti ortak operasyonu" }) => (
  <g>
    {bg("#0A0C10")}
    <HCam t={t} a={a} b={b} z={[1.02, 1.08]}>
      <rect x={460} y={200} width={1000} height={660} fill="#E9E4D8" transform="rotate(-2,960,530)" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={520} y={290 + i * 48} width={[820, 700, 760, 640, 800, 560, 720, 680, 780, 400][i]} height={14} rx={7} fill="#9A958A" transform="rotate(-2,960,530)" />)}
      <Stamp x={960} y={540} t={t} at={a + 0.5} s={s} c={TRR} rot={-10} size={120} />
      {T(960, 960, sub, 34, "#C8D0DA", 700, "middle")}
    </HCam>
  </g>
);
