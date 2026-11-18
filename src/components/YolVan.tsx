import React from "react";
import { lerp } from "./Toon";

// Kanal 2 · k2r-17 "Van'a 14 Gün" kiti (2026-11-18). SonIki.tsx'in devamı (aynı düz renk stili, zemin ~1040).
// İmza: GeceModu (güneş batınca dahi olan "sen": analiz HUD'u, 03:14'te çöküş) + HUD2 (GÜN n/14 · VAN'A KM · NÜFUS 2).
// Türkiye rota haritası, Mors oyma duvarlar (kaya/ahır/ağıl/istasyon), sedan araba (yolcu yuvaları, Karabaş, kar,
// egzoz/gömülü egzoz + CO, kaput+akü, patlak lastik), yol sahneleri (otoyol/tünel/dağ/bozkır/ova/tipi/göl),
// kurt + kurt izi, Osmanlı çeşmesi, istasyon saati 03:14, benzinlik, çoban kulübesi, Kızılay, lokanta, defter,
// bebek bilekliği, teneke kutu, Van gecesi + jeneratör, Van kedisi, radyo odası (5 sandalye, sıcak mikrofon, çay).

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const CY = "#2EE6D0", NAVY = "#0E1A2E";
type Mode = "day" | "dusk" | "night" | "storm";

// ───────── Mors ─────────
const MORS: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", Ç: "-.-..", D: "-..", E: ".", F: "..-.", G: "--.", Ğ: "--.-.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", Ö: "---.", P: ".--.", Q: "--.-", R: ".-.", S: "...", Ş: ".--..", T: "-", U: "..-", Ü: "..--", V: "...-", W: ".--",
  X: "-..-", Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};
export const morsOf = (ch: string) => MORS[ch === "İ" ? "I" : ch] ?? "";
const DOT = 22, DASH = 50, SG = 12, LG = 34, WG = 80;
const letterW = (code: string) => code.split("").reduce((w, c, i) => w + (c === "." ? DOT : DASH) + (i ? SG : 0), 0);

type Surf = "kaya" | "ahir" | "agil" | "istasyon";
// Oyma Mors yazısı. k: çözülen harf oranı (0..1), dust: taze taş tozu, snow: üstte kar
export const MorsDuvar: React.FC<{ t: number; text: string; surf?: Surf; k?: number; dust?: number; snow?: number; y?: number; bg?: boolean; night?: number }> = ({ t, text, surf = "kaya", k = 1, dust = 0, snow = 0, y = 470, bg = true, night = 0 }) => {
  const words = text.toUpperCase().split(" ");
  const lines: string[][] = [[]]; let lw = 0;
  for (const w of words) { const ww = w.split("").filter((c) => morsOf(c)).reduce((a, c, i) => a + letterW(morsOf(c)) + (i ? LG : 0), 0); if (lw + ww > 1300 && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(w); lw += ww + WG; }
  const total = text.replace(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/g, "").length; let idx = 0;
  const wall = { kaya: ["#8E8A84", "#77736D"], ahir: ["#C9A97E", "#A88A62"], agil: ["#9A9184", "#7E7568"], istasyon: ["#E6DCC6", "#CFC2A6"] }[surf];
  return (
    <g>
      {bg && <g>
        <rect width={1920} height={1080} fill={night ? "#2A2E3A" : wall[1]} />
        {surf === "kaya" && <path d="M-40,1080 L-40,230 Q200,120 520,170 Q900,90 1300,160 Q1700,110 1960,230 L1960,1080Z" fill={wall[0]} />}
        {surf === "kaya" && [[300, 300, 520, 420], [1400, 250, 1600, 380], [800, 820, 1100, 900]].map(([a, b, c, d], i) => <path key={i} d={`M${a},${b} L${(a + c) / 2},${(b + d) / 2 + 20} L${c},${d}`} stroke="#5E5A55" strokeWidth={5} fill="none" opacity={0.6} />)}
        {(surf === "agil") && Array.from({ length: 48 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8; const w = 220 + ((i * 37) % 60); return <rect key={i} x={c * 250 - (r % 2) * 120 - 40} y={120 + r * 150} width={w} height={136} rx={22} fill={i % 3 ? wall[0] : "#A8A092"} stroke="#5E574C" strokeWidth={6} />; })}
        {surf === "ahir" && <><rect y={140} width={1920} height={760} fill={wall[0]} />{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={180 + ((i * 131) % 680)} r={6 + (i % 4) * 4} fill="#B89A6E" opacity={0.6} />)}<rect y={100} width={1920} height={50} fill="#6E4A2E" /><rect y={890} width={1920} height={40} fill="#6E4A2E" /></>}
        {surf === "istasyon" && <><rect y={0} width={1920} height={1080} fill={wall[0]} /><rect y={860} width={1920} height={220} fill="#9E8E72" /></>}
        {snow > 0 && <path d={`M-40,${surf === "kaya" ? 200 : 150} Q300,${110} 700,${150} Q1100,${100} 1500,${150} Q1800,${120} 1960,${170} L1960,0 L-40,0Z`} fill="#F4F8FF" opacity={snow} />}
      </g>}
      <g transform={`translate(960,${y})`}>
        {lines.map((ln, li) => {
          const widths = ln.map((w) => w.split("").filter((c) => morsOf(c)).reduce((a, c, i) => a + letterW(morsOf(c)) + (i ? LG : 0), 0));
          const W = widths.reduce((a, b) => a + b, 0) + WG * (ln.length - 1);
          let x = -W / 2; const yy = (li - (lines.length - 1) / 2) * 220;
          return <g key={li}>{ln.map((w, wi) => {
            const out = w.split("").filter((c) => morsOf(c)).map((c) => {
              const code = morsOf(c), lw2 = letterW(code), x0 = x; x += lw2 + LG; const my = idx++; const vis = cl(k * total - my);
              let sx = x0;
              return <g key={`${wi}${my}`}>
                {code.split("").map((s, si) => { const w2 = s === "." ? DOT : DASH, el = s === "." ? <g key={si}><circle cx={sx + DOT / 2 + 2} cy={2} r={DOT / 2} fill="#FFFFFF" opacity={0.25} /><circle cx={sx + DOT / 2} cy={0} r={DOT / 2} fill="#2A2620" opacity={0.9} /></g> : <g key={si}><rect x={sx + 2} y={-6} width={DASH} height={16} rx={8} fill="#FFFFFF" opacity={0.25} /><rect x={sx} y={-8} width={DASH} height={16} rx={8} fill="#2A2620" opacity={0.9} /></g>; sx += w2 + SG; return el; })}
                {vis > 0 && <text x={x0 + lw2 / 2} y={92} textAnchor="middle" fontFamily="Patrick Hand" fontSize={78} fill="#E0566A" opacity={vis} stroke="#FFFFFF" strokeWidth={2} paintOrder="stroke">{c === "'" ? "" : c}</text>}
              </g>;
            });
            x += WG - LG;
            return <g key={wi}>{out}</g>;
          })}<g transform={`translate(0,${yy})`} /></g>;
        }).map((g, li) => <g key={li} transform={`translate(0,${(li - (lines.length - 1) / 2) * 220})`}>{g}</g>)}
        {dust > 0 && Array.from({ length: 22 }, (_, i) => { const ph = md(t * 0.6 + i * 0.13, 1); return <circle key={i} cx={-600 + ((i * 97) % 1200)} cy={30 + ph * 260} r={3 + (i % 3)} fill="#E8E2D6" opacity={dust * (1 - ph)} />; })}
      </g>
    </g>
  );
};

// ───────── GECE MODU (imza) ─────────
export type Not = { x: number; y: number; text: string; dx?: number; dy?: number };
export const GeceModu: React.FC<{ t: number; a: number; k?: number; notes?: Not[]; saat?: string; crash?: number; scan?: boolean }> = ({ t, a, k = 1, notes = [], saat, crash = 0, scan = true }) => {
  if (k <= 0 && crash <= 0) return null;
  const sx = md((t - a) * 900, 2400) - 240;
  return (
    <g>
      <g opacity={k}>
        <rect width={1920} height={1080} fill="#061428" opacity={0.28} />
        {Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1={0} x2={1920} y1={i * 90} y2={i * 90} stroke={CY} strokeWidth={1} opacity={0.07} />)}
        {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} y1={0} y2={1080} x1={i * 90} x2={i * 90} stroke={CY} strokeWidth={1} opacity={0.07} />)}
        {scan && <rect x={sx} y={0} width={10} height={1080} fill={CY} opacity={0.18} />}
        {[[40, 40, 1], [1880, 40, -1], [40, 1040, 1], [1880, 1040, -1]].map(([x, y, d], i) => <path key={i} d={`M${x},${y + (i < 2 ? 70 : -70)} L${x},${y} L${x + d * 70},${y}`} stroke={CY} strokeWidth={6} fill="none" />)}
        <g transform="translate(70,70)">
          <rect width={420} height={92} rx={18} fill={NAVY} opacity={0.85} stroke={CY} strokeWidth={3} />
          <circle cx={46} cy={46} r={24} fill="none" stroke={CY} strokeWidth={4} /><path d="M34,46 Q46,24 58,46 Q46,68 34,46" fill={CY} opacity={0.6 + 0.4 * Math.sin(t * 6)} />
          <text x={86} y={44} fontFamily="Poppins" fontWeight={800} fontSize={30} fill={CY}>GECE MODU</text>
          <text x={86} y={76} fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFFFFF" opacity={0.85}>{saat ? `${saat}  →  03:14` : "03:14'E KADAR"}</text>
        </g>
        {notes.map((n, i) => {
          const v = cl((t - a - 0.4 - i * 0.55) / 0.35); if (v <= 0) return null;
          const dx = n.dx ?? 200, dy = n.dy ?? -110, lx = n.x + dx * v, ly = n.y + dy * v;
          const w = Math.max(160, n.text.length * 17 + 40);
          return <g key={i} opacity={v}>
            <circle cx={n.x} cy={n.y} r={14} fill="none" stroke={CY} strokeWidth={4} /><circle cx={n.x} cy={n.y} r={14 + 22 * md(t * 1.2 + i * 0.3, 1)} fill="none" stroke={CY} strokeWidth={2} opacity={1 - md(t * 1.2 + i * 0.3, 1)} />
            <path d={`M${n.x},${n.y} L${lx},${ly}`} stroke={CY} strokeWidth={3} />
            <g transform={`translate(${dx < 0 ? lx - w : lx},${ly - 28})`}><rect width={w} height={56} rx={12} fill={NAVY} opacity={0.9} stroke={CY} strokeWidth={3} /><text x={w / 2} y={38} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={28} fill={CY}>{n.text}</text></g>
          </g>;
        })}
      </g>
      {crash > 0 && <g>
        <rect width={1920} height={1080} fill="#B0182A" opacity={0.35 * crash * (0.6 + 0.4 * Math.sin(t * 40))} />
        {Array.from({ length: 9 }, (_, i) => { const an = (i / 9) * Math.PI * 2 + 0.3; let d = "M960,540"; for (let j = 1; j <= 5; j++) d += ` L${960 + Math.cos(an + (j % 2 ? 0.12 : -0.1)) * j * 170 * crash},${540 + Math.sin(an + (j % 2 ? 0.12 : -0.1)) * j * 120 * crash}`; return <path key={i} d={d} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.8} />; })}
        {[[-8, "#FF2E4A"], [8, CY], [0, "#FFFFFF"]].map(([o, c], i) => <text key={i} x={960 + (o as number) * crash * (1 + Math.sin(t * 50))} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={230} fill={c as string} opacity={i === 2 ? 1 : 0.7}>03:14</text>)}
      </g>}
    </g>
  );
};

// ───────── HUD2: GÜN n/14 · VAN'A KM · NÜFUS ─────────
export const HUD2: React.FC<{ t: number; gun: number; km: number; gece?: boolean; nufus?: string; k?: number }> = ({ t, gun, km, gece = false, nufus = "2", k = 1 }) => {
  const left = Math.max(0, 14 - gun) / 14, col = left < 0.2 ? "#E0393E" : left < 0.5 ? "#F6C445" : "#1FC8B4";
  const stroke = gece ? "#8E7BFF" : "#1FC8B4";
  return (
    <g transform="translate(1480,36)" opacity={k}>
      <rect width={404} height={180} rx={22} fill={NAVY} opacity={0.84} stroke={stroke} strokeWidth={4} />
      <text x={24} y={52} fontFamily="Poppins" fontWeight={800} fontSize={40} fill={CY}>GÜN {gun}<tspan fontSize={26} fill="#FFFFFF" opacity={0.7}> / 14</tspan></text>
      <rect x={210} y={30} width={170} height={16} rx={8} fill="#1A2C48" /><rect x={210} y={30} width={170 * left} height={16} rx={8} fill={col} />
      <text x={24} y={104} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#FFFFFF">VAN'A:</text>
      <text x={380} y={106} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6C445">{km.toLocaleString("tr-TR")} KM</text>
      <text x={24} y={154} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#FFFFFF">DÜNYA NÜFUSU:</text>
      <text x={380} y={158} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6C445">{nufus}</text>
      <circle cx={380} cy={-6} r={8} fill={left < 0.2 ? "#E0393E" : CY} opacity={0.5 + 0.5 * Math.sin(t * 5)} />
    </g>
  );
};

// ───────── Türkiye rota haritası ─────────
const PX = (lon: number, lat: number): [number, number] => [120 + (lon - 26) * 88.4, 180 + (42.1 - lat) * 113.8];
const TR: [number, number][] = [[26.0, 41.75], [27.4, 42.05], [28.1, 41.9], [29.1, 41.25], [30.2, 41.2], [31.4, 41.35], [32.7, 41.85], [33.6, 42.02], [35.2, 42.08], [36.0, 41.7], [36.8, 41.35], [38.3, 40.95], [39.6, 41.05], [40.6, 41.2], [41.6, 41.5], [42.6, 41.6], [43.5, 41.1], [43.7, 40.6], [44.6, 39.8], [44.8, 39.4], [44.4, 38.4], [44.3, 37.6], [44.8, 37.2], [43.5, 37.25], [42.4, 37.1], [41.2, 37.08], [40.2, 36.95], [38.4, 36.85], [37.0, 36.65], [36.6, 36.8], [36.15, 35.95], [35.9, 36.3], [35.3, 36.6], [34.6, 36.8], [33.6, 36.2], [32.6, 36.1], [31.6, 36.6], [30.6, 36.6], [30.4, 36.25], [29.6, 36.2], [28.4, 36.75], [27.4, 37.1], [27.2, 37.5], [26.4, 38.3], [26.8, 38.6], [26.6, 39.0], [26.1, 39.4], [26.4, 40.0], [26.2, 40.35], [26.7, 40.4], [26.0, 40.75], [26.4, 41.2], [26.0, 41.75]];
export const DURAK: Record<string, [number, number]> = { İSTANBUL: [28.98, 41.01], SAKARYA: [30.4, 40.78], BOLU: [31.6, 40.73], ANKARA: [32.85, 39.93], KAYSERİ: [35.48, 38.72], MALATYA: [38.31, 38.35], MUŞ: [41.49, 38.74], BİTLİS: [42.11, 38.4], VAN: [43.38, 38.5] };
const ROUTE = Object.keys(DURAK).map((n) => PX(...DURAK[n]));
const SEG = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
export const routeAt = (k: number): [number, number] => { let d = cl(k) * LEN; for (let i = 0; i < SEG.length; i++) { if (d <= SEG[i]) { const u = d / SEG[i]; return [lerp(ROUTE[i][0], ROUTE[i + 1][0], u), lerp(ROUTE[i][1], ROUTE[i + 1][1], u)]; } d -= SEG[i]; } return ROUTE[ROUTE.length - 1]; };
export const Harita: React.FC<{ t: number; k: number; night?: number; pins?: string[]; vanPulse?: number }> = ({ t, k, night = 0, pins = Object.keys(DURAK), vanPulse = 1 }) => {
  const land = TR.map(([lo, la], i) => `${i ? "L" : "M"}${PX(lo, la).join(",")}`).join(" ") + "Z";
  let d = `M${ROUTE[0].join(",")}`; { let rem = cl(k) * LEN; for (let i = 0; i < SEG.length && rem > 0; i++) { const u = Math.min(1, rem / SEG[i]); d += ` L${lerp(ROUTE[i][0], ROUTE[i + 1][0], u)},${lerp(ROUTE[i][1], ROUTE[i + 1][1], u)}`; rem -= SEG[i]; } }
  const [cx, cy] = routeAt(k); const [vx, vy] = PX(...DURAK.VAN), [lx, ly] = PX(42.9, 38.65);
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#0E1F38" : "#8FC3DA"} />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${md(i * 211 + t * 12, 2000) - 40},${60 + (i % 10) * 104} q20,-10 40,0 t40,0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.25} />)}
      <path d={land} fill={night ? "#2A3A55" : "#F3E7CF"} stroke={night ? "#4E6A92" : "#B07A4A"} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={lx} cy={ly} rx={42} ry={22} fill={night ? "#1A3358" : "#8FC3DA"} />
      <path d={`M${ROUTE.map((p) => p.join(",")).join(" L")}`} stroke={night ? "#4E6A92" : "#C9B08A"} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" fill="none" />
      <path d={d} stroke="#E0393E" strokeWidth={10} strokeDasharray="26 14" strokeLinecap="round" fill="none" />
      {Object.keys(DURAK).filter((n) => pins.includes(n)).map((n) => { const [x, y] = PX(...DURAK[n]); const big = n === "İSTANBUL" || n === "VAN"; return <g key={n}><circle cx={x} cy={y} r={big ? 16 : 10} fill={n === "VAN" ? "#3A7BD5" : n === "İSTANBUL" ? "#E0393E" : "#5A4636"} stroke="#FFFFFF" strokeWidth={4} /><text x={x} y={y + (n === "MUŞ" ? -26 : 46)} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={big ? 36 : 26} fill={night ? "#E9F0FF" : "#3A2A1E"} stroke={night ? "#0E1F38" : "#F3E7CF"} strokeWidth={6} paintOrder="stroke">{n}</text></g>; })}
      {vanPulse > 0 && <circle cx={vx} cy={vy} r={16 + 40 * md(t * 0.8, 1)} fill="none" stroke="#3A7BD5" strokeWidth={5} opacity={vanPulse * (1 - md(t * 0.8, 1))} />}
      <g transform={`translate(${cx},${cy - 34})`}><rect x={-34} y={-20} width={68} height={34} rx={12} fill="#E8E4D8" stroke="#2A2A2A" strokeWidth={4} /><rect x={-20} y={-34} width={40} height={18} rx={6} fill="#E8E4D8" stroke="#2A2A2A" strokeWidth={4} /><circle cx={-18} cy={16} r={8} fill="#2A2A2A" /><circle cx={18} cy={16} r={8} fill="#2A2A2A" /></g>
    </g>
  );
};

// ───────── Araba (kutu sedan) ─────────
// yerel koordinat: zemin 0, gövde -330..332, tekerler ±215. Yolcu yuvaları: ön koltuk x≈95, arka x≈-110 (TFig sit, y≈-40, s≈0.4)
const WIN = "M-160,-262 L-200,-184 L-22,-184 L-22,-262 Z M0,-262 L0,-184 L196,-184 L140,-262 Z";
export const Araba: React.FC<{ x: number; y: number; s?: number; t: number; id?: string; c?: string; dir?: 1 | -1; speed?: number; lights?: number; snow?: number; smoke?: number; buried?: number; co?: number; hood?: number; battery?: boolean; flat?: number; front?: React.ReactNode; back?: React.ReactNode; dog?: React.ReactNode; inside?: number }> = ({ x, y, s = 1, t, id = "a", c = "#E8E4D8", dir = 1, speed = 0, lights = 0, snow = 0, smoke = 0, buried = 0, co = 0, hood = 0, battery = true, flat = 0, front, back, dog, inside = 0.28 }) => {
  const bob = speed ? Math.sin(t * 18) * 2.5 * speed : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <defs><clipPath id={`yvWin${id}`}><path d={WIN} /></clipPath></defs>
      <ellipse cx={0} cy={4} rx={360} ry={22} fill="#000" opacity={0.18} />
      {lights > 0 && <path d="M320,-140 L1100,-300 L1100,60 Z" fill="url(#tBeam)" opacity={lights} />}
      {smoke > 0 && Array.from({ length: 6 }, (_, i) => { const ph = md(t * 0.9 + i / 6, 1); return <circle key={i} cx={-350 - ph * 260 - speed * ph * 300} cy={-40 - ph * 80} r={14 + ph * 44} fill="#D8DDE4" opacity={smoke * 0.5 * (1 - ph)} />; })}
      <g transform={`translate(0,${bob})`}>
        <path d="M-330,-60 L-330,-150 Q-330,-170 -305,-174 L-232,-180 L-172,-270 Q-162,-284 -140,-284 L118,-284 Q140,-284 152,-270 L214,-182 L300,-174 Q332,-170 332,-140 L332,-60Z" fill={c} />
        <path d={WIN} fill="#24303E" />
        <g clipPath={`url(#yvWin${id})`}>{back}{front}{dog}
          {co > 0 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-200 + ((i * 53) % 400) + Math.sin(t * 0.7 + i) * 30} cy={-230 + ((i * 29) % 50) + Math.cos(t * 0.5 + i) * 14} r={40 + (i % 3) * 12} fill="#9FB3C8" opacity={0.22 * co} />)}
        </g>
        <path d={WIN} fill="#CFEAF5" opacity={inside} />
        <path d="M-150,-252 L-120,-252 L-170,-196Z M20,-252 L50,-252 L10,-200Z" fill="#FFFFFF" opacity={0.35} />
        <rect x={-22} y={-270} width={22} height={90} fill={c} />
        <path d="M-330,-120 L332,-120" stroke="#000" strokeWidth={4} opacity={0.12} />
        <rect x={-6} y={-150} width={40} height={8} rx={4} fill="#000" opacity={0.25} /><rect x={-190} y={-150} width={40} height={8} rx={4} fill="#000" opacity={0.25} />
        <rect x={300} y={-160} width={34} height={22} rx={6} fill="#FFF3B0" /><rect x={-336} y={-160} width={18} height={26} rx={4} fill="#E0393E" />
        <rect x={-346} y={-86} width={56} height={26} rx={10} fill="#8E8A84" /><rect x={300} y={-86} width={50} height={26} rx={10} fill="#8E8A84" />
        <rect x={-356} y={-52} width={30} height={10} rx={5} fill="#555" />
        {snow > 0 && <path d="M-176,-280 Q-150,-318 -40,-312 Q60,-322 140,-296 Q156,-284 150,-276 L-170,-276Z" fill="#F4F8FF" opacity={snow} />}
        {snow > 0 && <path d="M150,-276 Q240,-200 320,-182 L214,-182Z" fill="#F4F8FF" opacity={snow * 0.8} />}
        {hood > 0 && <g><rect x={160} y={-182} width={160} height={30} fill="#1E1E1E" />
          {battery && <g transform="translate(212,-206)"><rect width={70} height={42} rx={6} fill="#2A2E36" /><rect x={8} y={-8} width={14} height={10} fill="#B23A3F" /><rect x={48} y={-8} width={14} height={10} fill="#333" /></g>}
          {!battery && <rect x={210} y={-176} width={74} height={10} fill="#555" />}
          <g transform={`rotate(${-hood * 58} 156 -180)`}><path d="M152,-182 L320,-178 L322,-168 L156,-172Z" fill={c} stroke="#000" strokeOpacity={0.15} strokeWidth={3} /></g></g>}
      </g>
      {[-215, 215].map((xx) => { const fl = xx < 0 ? flat : 0; return <g key={xx} transform={`translate(${xx},${-52 + fl * 14})`}><g transform={`scale(1,${1 - fl * 0.28}) rotate(${t * 520 * speed})`}><circle r={52} fill="#1E1E1E" /><circle r={22} fill="#9A9A9A" /><path d="M-20,0 H20 M0,-20 V20" stroke="#666" strokeWidth={5} /></g></g>; })}
      {buried > 0 && <path d={`M-560,4 Q-470,${-170 * buried} -330,${-120 * buried} Q-250,${-90 * buried} -200,0Z`} fill="#F4F8FF" />}
    </g>
  );
};

// ───────── yol sahneleri ─────────
const SKY: Record<Mode, [string, string]> = { day: ["#A9D6EC", "#EAF5FA"], dusk: ["#3B3F7A", "#F7B06A"], night: ["#060C1C", "#16284A"], storm: ["#9AA6B4", "#D9DFE6"] };
type Yol = "otoyol" | "kopru" | "tunel" | "dag" | "bozkir" | "ova" | "tipi" | "gol";
export const YolSahne: React.FC<{ t: number; kind?: Yol; mode?: Mode; px?: number; snow?: number; fall?: number; stars?: number; sun?: number; cars?: number; road?: boolean }> = ({ t, kind = "otoyol", mode = "day", px = 0, snow = 0, fall = 0, stars = 0, sun = 0, cars = 1, road = true }) => {
  const [a, b] = SKY[mode]; const nt = mode === "night", dk = mode === "dusk";
  const far = nt ? "#16223A" : dk ? "#5A4A6E" : mode === "storm" ? "#B9C2CC" : "#9FB4C6";
  const mid = nt ? "#1E2C46" : dk ? "#6E5068" : mode === "storm" ? "#CFD6DE" : "#C8B48E";
  const gnd = snow > 0.5 || kind === "tipi" ? (nt ? "#7E8CA6" : "#EEF3F8") : nt ? "#2A3248" : kind === "bozkir" || kind === "ova" ? "#D8C79E" : "#9CB27A";
  const id = `yvSky${kind}${mode}`;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} />
      {stars > 0 && Array.from({ length: 110 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 560} r={1.2 + (i % 3)} fill="#FFFFFF" opacity={stars * (0.35 + 0.6 * Math.abs(Math.sin(t * 2 + i * 1.7)))} />)}
      {dk && sun > 0 && <circle cx={1300} cy={600} r={90} fill="#FFE2A0" opacity={sun} />}
      {mode === "day" && [0, 1].map((k) => <ellipse key={k} cx={md(300 + k * 900 - px * 0.05, 2300) - 200} cy={130 + k * 50} rx={150} ry={34} fill="#FFFFFF" opacity={0.75} />)}
      {/* uzak dağlar */}
      <g transform={`translate(${-md(px * 0.1, 1920)},0)`}>{[0, 1920].map((o) => <path key={o} d={`M${o - 100},700 L${o + 200},${kind === "gol" ? 360 : 470} L${o + 420},560 L${o + 700},${kind === "dag" || kind === "tipi" ? 330 : 520} L${o + 1000},600 L${o + 1300},${kind === "gol" ? 300 : 480} L${o + 1650},580 L${o + 2020},500 L${o + 2020},760 L${o - 100},760Z`} fill={far} />)}
        {(snow > 0 || kind === "gol" || kind === "dag" || kind === "tipi") && [0, 1920].map((o) => {
          const cap = (px: number, py: number, lx: number, ly: number, rx: number, ry: number, f = 0.24) => `M${px + (lx - px) * f},${py + (ly - py) * f} L${px},${py} L${px + (rx - px) * f},${py + (ry - py) * f} Q${px},${py + ((ly + ry) / 2 - py) * f * 0.8} ${px + (lx - px) * f},${py + (ly - py) * f}Z `;
          const p1 = kind === "gol" ? 360 : 470, p2 = kind === "dag" || kind === "tipi" ? 330 : 520, p3 = kind === "gol" ? 300 : 480;
          return <path key={o} d={cap(o + 200, p1, o - 100, 700, o + 420, 560) + cap(o + 700, p2, o + 420, 560, o + 1000, 600) + cap(o + 1300, p3, o + 1000, 600, o + 1650, 580)} fill="#F4F8FF" opacity={0.92} />;
        })}</g>
      {kind === "gol" && <g><rect y={700} width={1920} height={130} fill={nt ? "#14305A" : "#3D8FB8"} />{Array.from({ length: 18 }, (_, i) => <rect key={i} x={md(i * 157 + t * 18, 2100) - 100} y={716 + (i % 6) * 18} width={70} height={4} rx={2} fill="#FFFFFF" opacity={0.3} />)}</g>}
      {/* orta plan */}
      <g transform={`translate(${-md(px * 0.35, 1920)},0)`}>{[0, 1920].map((o) => <g key={o}>
        {kind === "dag" && Array.from({ length: 16 }, (_, i) => { const x = o + i * 125, h = 160 + ((i * 53) % 90); return <g key={i}><path d={`M${x},760 L${x + 60},${760 - h} L${x + 120},760Z`} fill={nt ? "#1B3A30" : "#2E6B4A"} />{snow > 0 && <path d={`M${x + 40},${760 - h * 0.66} L${x + 60},${760 - h} L${x + 80},${760 - h * 0.66}Z`} fill="#F4F8FF" opacity={snow} />}</g>; })}
        {(kind === "bozkir" || kind === "ova") && <path d={`M${o},760 Q${o + 480},735 ${o + 960},752 T${o + 1920},748 L${o + 1920},770 L${o},770Z`} fill={mid} />}
        {kind === "bozkir" && [300, 1400].map((vx) => <g key={vx} transform={`translate(${o + vx},740)`}>{[0, 70, 150].map((hx, j) => <g key={j}><rect x={hx} y={-46 - j * 4} width={60} height={46 + j * 4} fill={nt ? "#3A3A4A" : "#B89C74"} /><path d={`M${hx - 6},${-46 - j * 4} L${hx + 30},${-70 - j * 4} L${hx + 66},${-46 - j * 4}Z`} fill={snow ? "#F4F8FF" : "#8E5A3A"} /></g>)}</g>)}
        {kind === "ova" && [500, 1500].map((tx) => <g key={tx}><rect x={o + tx} y={690} width={12} height={70} fill="#5A4636" /><circle cx={o + tx + 6} cy={680} r={36} fill={snow ? "#E6EEF6" : "#4E7A3A"} /></g>)}
      </g>)}</g>
      {/* terk edilmiş arabalar: yol kenarında, yamuk, tozlu, kapısı açık — yere sabit (px ile birlikte kayar), ASLA trafik gibi değil */}
      {kind === "otoyol" && cars > 0 && <g transform={`translate(${-md(px, 1920)},0)`}>{[0, 1920].map((o) => [260, 1180].map((cx, i) => <g key={`${o}${i}`} transform={`translate(${o + cx},${i ? 806 : 812}) rotate(${i ? 7 : -5}) scale(0.42)`}>
        <path d="M-250,-60 L-250,-130 Q-240,-160 -200,-165 L-120,-170 L-60,-240 L120,-240 L220,-170 Q260,-160 260,-120 L260,-60Z" fill={["#9E5A52", "#6C7E92"][i]} />
        <path d="M-50,-228 L110,-228 L190,-168 L-110,-168Z" fill="#2A3442" opacity={0.85} />
        {i === 0 && <path d="M-60,-165 L-60,-70 L-170,-40 L-170,-150Z" fill="#7E4640" />}
        <path d="M-250,-120 Q0,-150 260,-118" stroke={snow > 0 ? "#F4F8FF" : "#C9B9A0"} strokeWidth={snow > 0 ? 26 : 10} fill="none" opacity={0.85} />
        <circle cx={-150} cy={-56} r={44} fill="#1E1E1E" /><ellipse cx={160} cy={-46} rx={46} ry={i ? 30 : 44} fill="#1E1E1E" /></g>))}</g>}
      {/* zemin + yol */}
      <rect y={760} width={1920} height={320} fill={gnd} />
      {road && <g><rect y={830} width={1920} height={220} fill={nt ? "#1A1E28" : "#4A4E56"} />
        {snow > 0 && <><rect y={826} width={1920} height={16} fill="#F4F8FF" opacity={snow} /><rect y={1042} width={1920} height={16} fill="#F4F8FF" opacity={snow} /></>}
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={md(i * 220 - px, 2640) - 360} y={936} width={120} height={12} rx={6} fill="#F4F4F4" opacity={snow > 0.6 ? 0.25 : 0.85} />)}</g>}
      {kind === "tunel" && <g><path d="M560,830 L560,520 Q960,300 1360,520 L1360,830Z" fill="#6E6A64" /><path d="M640,830 L640,560 Q960,400 1280,560 L1280,830Z" fill="#141414" />
        {[[700, 0.5], [960, 0.62], [1190, 0.5]].map(([x, s], i) => <g key={i} transform={`translate(${x},830) scale(${s})`}><rect x={-160} y={-300} width={320} height={300} fill={["#C9473E", "#E8E4D8", "#3A7BD5"][i]} /><rect x={-120} y={-260} width={240} height={110} fill="#2A3A4A" /><circle cx={-110} cy={-10} r={36} fill="#1E1E1E" /><circle cx={110} cy={-10} r={36} fill="#1E1E1E" /></g>)}
        <rect x={860} y={470} width={200} height={40} rx={8} fill="#2E6B4A" /><text x={960} y={500} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">BOLU DAĞI</text></g>}
      {kind === "kopru" && <g><rect y={760} width={1920} height={70} fill="#5FA7C8" />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={md(i * 240 - px * 1, 2160) - 120} y={600} width={14} height={230} fill="#C9473E" />)}<path d={`M-200,610 ${Array.from({ length: 10 }, (_, i) => `Q${md(-px, 240) + i * 240 - 80},700 ${md(-px, 240) + i * 240 + 40},610`).join(" ")}`} stroke="#C9473E" strokeWidth={6} fill="none" /></g>}
      {(fall > 0 || kind === "tipi") && Array.from({ length: kind === "tipi" ? 140 : 70 }, (_, i) => { const tipi = kind === "tipi"; const x = md(i * 173 - t * (tipi ? 1400 : 80) + Math.sin(t + i) * 30, 2000) - 40, y = md(i * 131 + t * (tipi ? 420 : 260), 1080); return tipi ? <path key={i} d={`M${x},${y} l-${40 + (i % 4) * 14},6`} stroke="#FFFFFF" strokeWidth={4 + (i % 3)} strokeLinecap="round" opacity={0.85} /> : <circle key={i} cx={x} cy={y} r={4 + (i % 4) * 2} fill="#FFFFFF" opacity={0.9 * (fall || 1)} />; })}
      {kind === "tipi" && <rect width={1920} height={1080} fill="#E6ECF2" opacity={0.28} />}
    </g>
  );
};

// ───────── kurt + izler ─────────
export const Kurt: React.FC<{ x: number; y: number; s?: number; t: number; dir?: 1 | -1; walk?: number; howl?: number; c?: string }> = ({ x, y, s = 1, t, dir = 1, walk = 1, howl = 0, c = "#6B7480" }) => {
  const ph = t * 7 * walk;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      {[[-70, 0], [-40, Math.PI], [60, Math.PI / 2], [90, Math.PI * 1.5]].map(([lx, o], i) => <path key={i} d={`M${lx},-60 L${lx + Math.sin(ph + o) * 16},0`} stroke={i % 2 ? "#4E5560" : c} strokeWidth={16} strokeLinecap="round" />)}
      <path d="M-110,-70 Q-130,-100 -180,-110 Q-150,-80 -120,-60Z" fill={c} />
      <ellipse cx={0} cy={-80} rx={120} ry={42} fill={c} /><ellipse cx={0} cy={-62} rx={90} ry={20} fill="#9AA3AE" />
      <g transform={`rotate(${-howl * 40} 100 -100)`}><path d="M90,-110 L150,-150 L178,-128 L150,-100 L100,-80Z" fill={c} /><path d="M140,-148 L134,-178 L152,-152Z M156,-142 L158,-172 L168,-146Z" fill="#4E5560" /><circle cx={154} cy={-132} r={4} fill="#F6C445" /><path d="M176,-128 L186,-124" stroke="#222" strokeWidth={5} strokeLinecap="round" /></g>
    </g>
  );
};
export const KurtIzi: React.FC<{ k?: number; y?: number; big?: boolean; fresh?: number }> = ({ k = 1, y = 940, big = true, fresh = 1 }) => {
  const n = 14, sz = big ? 1 : 0.6;
  return <g>{Array.from({ length: n }, (_, i) => { if (i / n > k) return null; const x = 120 + i * 130, yy = y + (i % 2 ? 30 : -30) + Math.sin(i * 0.7) * 20; return <g key={i} transform={`translate(${x},${yy}) scale(${sz}) rotate(90)`}><ellipse cx={0} cy={10} rx={18} ry={16} fill="#8A9AB4" opacity={0.7 * fresh} />{[[-16, -14], [-6, -24], [6, -24], [16, -14]].map(([a, b], j) => <ellipse key={j} cx={a} cy={b} rx={6} ry={8} fill="#8A9AB4" opacity={0.7 * fresh} />)}</g>; })}</g>;
};

// ───────── Osmanlı çeşmesi ─────────
export const Cesme: React.FC<{ t: number; dug?: number; flow?: number; dog?: React.ReactNode }> = ({ t, dug = 1, flow = 1, dog }) => (
  <g>
    <rect width={1920} height={1080} fill="#DCE4EC" /><rect y={760} width={1920} height={320} fill="#EEF3F8" />
    <g transform="translate(960,760)">
      <rect x={-330} y={-560} width={660} height={560} fill="#C9BFA8" stroke="#8E8470" strokeWidth={8} />
      <path d="M-260,-30 L-260,-360 Q0,-560 260,-360 L260,-30Z" fill="#B3A88E" stroke="#8E8470" strokeWidth={6} />
      <rect x={-200} y={-470} width={400} height={70} rx={8} fill="#E3D9C2" stroke="#8E8470" strokeWidth={5} />
      {[0, 1].map((r) => <path key={r} d={`M-170,${-450 + r * 30} q20,-12 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} stroke="#6E6450" strokeWidth={4} fill="none" />)}
      <circle cx={0} cy={-250} r={56} fill="none" stroke="#8E8470" strokeWidth={6} /><path d="M-30,-250 Q0,-290 30,-250 Q0,-210 -30,-250Z" fill="#8E8470" />
      <rect x={-12} y={-170} width={24} height={60} rx={6} fill="#B5651D" /><path d="M-14,-110 L14,-110 L8,-96 L-8,-96Z" fill="#8E4A16" />
      {flow > 0 && dug > 0.5 && Array.from({ length: 8 }, (_, i) => <rect key={i} x={-4} y={-96 + md(t * 300 + i * 18, 140)} width={8} height={12} rx={4} fill="#8FD0F0" opacity={0.9 * flow} />)}
      <rect x={-300} y={-40} width={600} height={60} rx={10} fill="#A89C80" /><rect x={-280} y={-36} width={560} height={20} rx={8} fill="#7FB8D8" opacity={0.8} />
      <path d={`M-700,20 Q-400,${-260 * (1 - dug) - 40} 0,${-300 * (1 - dug) - 20} Q400,${-260 * (1 - dug) - 40} 700,20Z`} fill="#F4F8FF" />
      {dug > 0 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={-380 + ((i * 83) % 760)} cy={-10 - ((i * 37) % 60)} r={18 + (i % 3) * 8} fill="#FFFFFF" opacity={0.9} />)}
    </g>
    {dog}
  </g>
);

// ───────── istasyon + 03:14 saati ─────────
export const Saat: React.FC<{ x: number; y: number; s?: number; h?: number; m?: number; c?: string }> = ({ x, y, s = 1, h = 3, m = 14, c = "#FFFBEA" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={150} fill="#2A2A2A" /><circle r={132} fill={c} />
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <rect key={i} x={-5} y={-124} width={10} height={i % 3 ? 16 : 30} fill="#2A2A2A" transform={`rotate(${(a * 180) / Math.PI})`} />; })}
    <rect x={-7} y={-74} width={14} height={80} rx={7} fill="#2A2A2A" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
    <rect x={-5} y={-112} width={10} height={118} rx={5} fill="#2A2A2A" transform={`rotate(${m * 6})`} />
    <circle r={12} fill="#E0393E" />
  </g>
);
export const Istasyon: React.FC<{ t: number; mors?: React.ReactNode; snow?: number }> = ({ t, mors, snow = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9D4DE" />
    <rect x={180} y={260} width={1560} height={520} fill="#D9C9A8" stroke="#9E8E72" strokeWidth={8} />
    <path d="M140,270 L960,120 L1780,270Z" fill="#A8442E" />{snow > 0 && <path d="M150,262 L960,116 L1770,262 L1700,262 L960,150 L220,262Z" fill="#F4F8FF" opacity={snow} />}
    {[330, 1430].map((x) => <g key={x}><rect x={x} y={420} width={160} height={220} fill="#5E7A8E" /><rect x={x - 20} y={410} width={60} height={240} fill="#3E6A4E" /><rect x={x + 120} y={410} width={60} height={240} fill="#3E6A4E" /></g>)}
    <rect x={810} y={510} width={300} height={270} fill="#4A3A2A" />
    <rect x={720} y={300} width={480} height={70} rx={8} fill="#1E3A5E" /><text x={960} y={348} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#FFFFFF">İSTASYON</text>
    <Saat x={960} y={190} s={0.5} />
    {mors}
    <rect y={780} width={1920} height={300} fill="#EEF3F8" />
    {[880, 990].map((ry) => <rect key={ry} y={ry} width={1920} height={14} fill="#6E6A64" />)}
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 130 + 20} y={870} width={40} height={140} fill="#8A6A4A" opacity={0.6} />)}
  </g>
);

// ───────── benzinlik ─────────
export const Benzinlik: React.FC<{ t: number; mode?: Mode; smoke?: number; people?: React.ReactNode }> = ({ t, mode = "day", smoke = 1, people }) => {
  const nt = mode !== "day";
  return (
    <g>
      <rect width={1920} height={1080} fill={nt ? "#2A2E48" : "#DCE4EC"} />
      <rect y={760} width={1920} height={320} fill={nt ? "#8E9AB2" : "#EEF3F8"} />
      <rect x={260} y={300} width={1400} height={70} fill="#C9473E" /><rect x={260} y={370} width={1400} height={16} fill="#8E2E2A" />
      <text x={960} y={350} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill="#FFFFFF">AKARYAKIT</text>
      {[320, 1000].map((x) => <rect key={x} x={x} y={386} width={40} height={380} fill="#B9C2CC" />)}
      {/* oturma köşesi (pompalardan uzak): tabure + sucuk tavası sobanın yanında */}
      {[1380, 1780].map((x) => <g key={x} transform={`translate(${x},1040)`}><rect x={-70} y={-150} width={140} height={150} rx={8} fill="#8A5A32" /><rect x={-70} y={-150} width={140} height={20} fill="#6E4626" /></g>)}
      {[480, 860].map((x) => <g key={x}><rect x={x - 60} y={560} width={120} height={200} rx={10} fill="#E8E4D8" /><rect x={x - 44} y={584} width={88} height={50} rx={6} fill="#1A1E28" /><text x={x} y={618} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#3A4A5A">-- , --</text><path d={`M${x + 60},640 q40,10 30,90`} stroke="#2A2A2A" strokeWidth={8} fill="none" /></g>)}
      <g transform="translate(1600,760)"><rect x={-50} y={-120} width={100} height={120} rx={10} fill="#3A3A3A" /><rect x={-14} y={-420} width={28} height={300} fill="#5A5A5A" /><circle cx={0} cy={-60} r={22} fill="#F28C28" opacity={0.6 + 0.4 * Math.sin(t * 9)} />
        {Array.from({ length: 6 }, (_, i) => { const ph = md(t * 0.4 + i / 6, 1); return <circle key={i} cx={Math.sin(t + i) * 30 * ph} cy={-430 - ph * 300} r={20 + ph * 50} fill="#CFD6DE" opacity={smoke * 0.55 * (1 - ph)} />; })}</g>
      {people}
    </g>
  );
};

// ───────── çoban kulübesi ─────────
export const Kulube: React.FC<{ x: number; y: number; s?: number; t: number; lit?: number; light?: number; smoke?: number }> = ({ x, y, s = 1, t, lit = 1, light = 0, smoke = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 5 }, (_, i) => { const ph = md(t * 0.35 + i / 5, 1); return <circle key={i} cx={150 + Math.sin(t + i) * 20 - ph * 80} cy={-380 - ph * 260} r={18 + ph * 40} fill="#D8DDE4" opacity={smoke * 0.5 * (1 - ph)} />; })}
    <rect x={130} y={-380} width={44} height={110} fill="#6E665A" />
    {Array.from({ length: 18 }, (_, i) => { const r = Math.floor(i / 6), c = i % 6; return <rect key={i} x={-260 + c * 88 - (r % 2) * 40} y={-260 + r * 86} width={84} height={80} rx={16} fill={i % 3 ? "#9A9184" : "#857C6E"} stroke="#5E574C" strokeWidth={4} />; })}
    <path d="M-300,-250 L0,-360 L300,-250Z" fill="#6E4A2E" /><path d="M-310,-246 Q0,-400 310,-246 L300,-262 L0,-370 L-300,-262Z" fill="#F4F8FF" />
    <rect x={-60} y={-170} width={110} height={170} fill="#4A3424" />
    <rect x={110} y={-180} width={90} height={80} fill={lit ? "#FFD98A" : "#2A2A2A"} opacity={0.6 + 0.4 * lit * (0.85 + 0.15 * Math.sin(t * 8))} /><path d="M155,-180 V-100 M110,-140 H200" stroke="#4A3424" strokeWidth={6} />
    {light > 0 && <circle cx={155} cy={-140} r={90} fill="#FFF6D0" opacity={light * 0.7} />}
  </g>
);

// ───────── Ankara Kızılay ─────────
export const Kizilay: React.FC<{ t: number; px?: number; pigeons?: number }> = ({ t, px = 0, pigeons = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C6DCEA" />
    <g transform={`translate(${-px * 0.3},0)`}>{Array.from({ length: 9 }, (_, i) => { const x = -100 + i * 240, h = 360 + ((i * 97) % 300); return <g key={i}><rect x={x} y={760 - h} width={220} height={h} fill={["#B9B2A6", "#9AA6B4", "#C9BFA8", "#A8B4C0"][i % 4]} />{Array.from({ length: Math.floor(h / 60) }, (_, r) => <rect key={r} x={x + 16} y={760 - h + 20 + r * 60} width={188} height={30} fill="#5E7A8E" opacity={0.5} />)}</g>; })}</g>
    <rect y={760} width={1920} height={320} fill="#5A5E66" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={md(i * 260 - px, 2080) - 160} y={900} width={140} height={14} rx={7} fill="#F4F4F4" opacity={0.8} />)}
    <rect x={1300} y={760} width={14} height={180} fill="#3A3A3A" /><rect x={1284} y={700} width={46} height={110} rx={10} fill="#2A2A2A" />{[0, 1, 2].map((i) => <circle key={i} cx={1307} cy={722 + i * 32} r={11} fill="#4A4A4A" />)}
    <g transform="translate(380,840)"><rect x={-100} y={-90} width={200} height={90} rx={8} fill="#C9473E" /><rect x={-110} y={-110} width={220} height={24} rx={6} fill="#F4EDE2" />{[-60, 0, 60].map((sx) => <circle key={sx} cx={sx} cy={-122} r={22} fill="none" stroke="#B5651D" strokeWidth={14} />)}</g>
    {pigeons > 0 && Array.from({ length: 9 }, (_, i) => { const x = 300 + ((i * 53) % 220) - 20, y = 726 + (i % 3) * 8, pk = Math.abs(Math.sin(t * 6 + i)) * 10; return <g key={i} transform={`translate(${x},${y})`}><ellipse cx={0} cy={0} rx={22} ry={14} fill="#8A93A6" /><circle cx={18} cy={-8 + pk} r={9} fill="#6E7890" /><path d={`M26,${-8 + pk} l8,3`} stroke="#E0A040" strokeWidth={4} /></g>; })}
    <g transform="translate(1040,980)"><ellipse rx={90} ry={26} fill="#3A3C42" /><ellipse rx={74} ry={18} fill="#2A2C30" />{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-60 + i * 30},-12 L${-50 + i * 30},12`} stroke="#4A4C52" strokeWidth={5} />)}</g>
  </g>
);

// ───────── yol kenarı lokanta (mum ışığı) ─────────
export const Lokanta: React.FC<{ t: number; candle?: number; people?: React.ReactNode }> = ({ t, candle = 1, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A22" />
    {Array.from({ length: 60 }, (_, i) => <rect key={i} x={(i % 12) * 160} y={Math.floor(i / 12) * 80 + 420} width={156} height={76} fill="#4A3A30" stroke="#2E2018" strokeWidth={4} />)}
    <rect x={1300} y={140} width={420} height={300} fill="#0E1A2E" stroke="#5A4030" strokeWidth={16} /><path d="M1510,140 V440 M1300,290 H1720" stroke="#5A4030" strokeWidth={10} />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={1320 + ((i * 97) % 380)} cy={md(160 + i * 61 + t * 60, 270) + 150} r={4} fill="#FFFFFF" opacity={0.8} />)}
    <rect x={160} y={160} width={320} height={60} rx={8} fill="#5A4030" /><text x={320} y={202} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F6C445">LOKANTA</text>
    {people}
    <g transform="translate(960,800)"><rect x={-520} y={-20} width={1040} height={40} fill="#B5651D" />{Array.from({ length: 13 }, (_, i) => <rect key={i} x={-520 + i * 80} y={-20} width={40} height={40} fill="#E9DCC6" opacity={i % 2 ? 0.9 : 0} />)}<rect x={-480} y={20} width={30} height={260} fill="#6E4A2E" /><rect x={450} y={20} width={30} height={260} fill="#6E4A2E" />
      <rect x={-16} y={-110} width={32} height={90} rx={6} fill="#F4EDE2" /><path d={`M0,-110 Q${-10 + Math.sin(t * 9) * 6},-140 0,-160 Q${10 + Math.sin(t * 7) * 6},-140 0,-110Z`} fill="#FFC64A" /></g>
    {candle > 0 && <circle cx={960} cy={650} r={520} fill="url(#yvCandle)" opacity={candle * (0.9 + 0.1 * Math.sin(t * 11))} />}
    <defs><radialGradient id="yvCandle"><stop offset="0" stopColor="#FFD58A" stopOpacity="0.45" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" /></radialGradient></defs>
  </g>
);

// ───────── Defne'nin defteri ─────────
export const Defter: React.FC<{ x?: number; y?: number; s?: number; lines: string[]; k?: number; corner?: string; erased?: string; erase?: number }> = ({ x = 960, y = 540, s = 1, lines, k = 1, corner, erased, erase = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-560} y={-380} width={1120} height={760} rx={14} fill="#FFFBEA" transform="rotate(-1.5)" />
    {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-520} x2={520} y1={-290 + i * 64} y2={-290 + i * 64} stroke="#9FC4E0" strokeWidth={3} />)}
    <line x1={-430} x2={-430} y1={-380} y2={380} stroke="#E8A0A0" strokeWidth={4} />
    {lines.map((l, i) => { const v = cl(k * lines.length - i); return <text key={i} x={-400} y={-304 + i * 64} fontFamily="Patrick Hand" fontSize={52} fill="#2A3A6A" opacity={v}>{l.slice(0, Math.ceil(l.length * v))}</text>; })}
    {erased && <g><text x={-400} y={-304 + lines.length * 64} fontFamily="Patrick Hand" fontSize={52} fill="#2A3A6A" opacity={1 - erase * 0.82}>{erased}</text>{erase > 0 && <rect x={-410} y={-350 + lines.length * 64} width={60 + erased.length * 22 * erase} height={60} fill="#FFFBEA" opacity={0.55} />}</g>}
    {corner && <text x={500} y={340} textAnchor="end" fontFamily="Patrick Hand" fontSize={46} fill="#E0566A" transform="rotate(-6 500 340)">{corner}</text>}
  </g>
);

// ───────── bebek bilekliği + teneke kutu ─────────
export const Bileklik: React.FC<{ x?: number; y?: number; s?: number; k?: number; saat?: string }> = ({ x = 960, y = 540, s = 1, k = 1, saat = "03:14" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-620,-40 Q0,-150 620,-40 L620,60 Q0,-50 -620,60Z" fill="#BFDDF2" stroke="#8EB8D8" strokeWidth={6} />
    <rect x={-360} y={-118} width={720} height={150} rx={18} fill="#FFFFFF" opacity={0.92} />
    <text x={-320} y={-62} fontFamily="Poppins" fontWeight={700} fontSize={34} fill="#3A4A6A">ERKEK BEBEK · ANNE: ██████</text>
    <text x={-320} y={0} fontFamily="Poppins" fontWeight={700} fontSize={34} fill="#3A4A6A">DOĞUM: ██.██.2008 · SAAT:</text>
    <text x={250} y={4} fontFamily="Poppins" fontWeight={800} fontSize={50} fill="#E0393E" opacity={k}>{saat}</text>
    {[-560, 560].map((bx) => <circle key={bx} cx={bx} cy={10} r={14} fill="#8EB8D8" />)}
  </g>
);
export const TenekeKutu: React.FC<{ x?: number; y?: number; s?: number; open?: number }> = ({ x = 960, y = 600, s = 1, open = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-420} y={-60} width={840} height={300} rx={20} fill="#C9473E" /><rect x={-420} y={-60} width={840} height={40} rx={10} fill="#E0566A" />
    {open > 0 && <g opacity={open}>
      <g transform="translate(-220,-120) rotate(-8)"><rect x={-130} y={-100} width={260} height={200} fill="#FFFFFF" /><rect x={-110} y={-80} width={220} height={140} fill="#9FC4C8" /><circle cx={0} cy={-20} r={34} fill="#F2C8A0" /></g>
      <g transform="translate(120,-110) rotate(6)"><rect x={-130} y={-100} width={260} height={200} fill="#FFFFFF" /><rect x={-110} y={-80} width={220} height={140} fill="#E9C9A8" /><circle cx={0} cy={-10} r={30} fill="#F2C8A0" /></g>
      <path d="M260,-40 Q330,-120 360,-40" stroke="#5A3A2A" strokeWidth={10} fill="none" />
      <path d="M-200,-10 Q0,-60 200,-10" stroke="#BFDDF2" strokeWidth={22} fill="none" strokeLinecap="round" />
    </g>}
    {open < 1 && <rect x={-430} y={-80 - open * 200} width={860} height={60} rx={12} fill="#E0566A" />}
  </g>
);

// ───────── Van ─────────
export const VanGece: React.FC<{ t: number; bulb?: number; gen?: number; stars?: number }> = ({ t, bulb = 1, gen = 1, stars = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#081022" />
    {Array.from({ length: 120 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 520} r={1 + (i % 3)} fill="#FFFFFF" opacity={stars * (0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i)))} />)}
    <path d="M-40,620 L300,420 L520,520 L860,300 L1180,500 L1500,380 L1960,600 L1960,700 L-40,700Z" fill="#141E36" /><path d="M820,330 L860,300 L900,330 Q860,345 820,330Z" fill="#E6EEF6" opacity={0.6} />
    <rect y={640} width={700} height={90} fill="#0E2244" />
    {Array.from({ length: 22 }, (_, i) => { const x = 600 + i * 70, h = 120 + ((i * 53) % 200); return <rect key={i} x={x} y={760 - h} width={66} height={h} fill={i % 2 ? "#18223A" : "#1C2842"} />; })}
    <g transform="translate(1220,560)"><rect x={-70} y={-140} width={140} height={340} fill="#202C48" />
      <line x1={0} y1={-140} x2={0} y2={-196} stroke="#2A2A2A" strokeWidth={4} /><circle cx={0} cy={-204} r={14} fill={bulb ? "#FFE8A0" : "#3A3A3A"} />
      {bulb > 0 && <circle cx={0} cy={-204} r={90} fill="#FFE8A0" opacity={bulb * (0.35 + 0.1 * Math.sin(t * 13))} />}
      <rect x={30} y={-170} width={50} height={30} rx={4} fill="#3A3A3A" />
      {gen > 0 && Array.from({ length: 4 }, (_, i) => { const ph = md(t * 0.9 + i / 4, 1); return <circle key={i} cx={80 + ph * 40} cy={-170 - ph * 70} r={8 + ph * 18} fill="#9AA6B4" opacity={gen * 0.45 * (1 - ph)} />; })}</g>
    <rect y={760} width={1920} height={320} fill="#9AA6BC" />
  </g>
);
export const VanKedisi: React.FC<{ x: number; y: number; s?: number; t: number; look?: number }> = ({ x, y, s = 1, t, look = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d={`M60,-30 Q${130 + Math.sin(t * 2) * 20},-60 110,-140`} stroke="#F4F1EA" strokeWidth={22} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-70} rx={80} ry={74} fill="#F4F1EA" /><ellipse cx={0} cy={-6} rx={70} ry={14} fill="#000" opacity={0.15} />
    <g transform={`translate(${look * 12},0)`}><circle cx={0} cy={-170} r={62} fill="#F4F1EA" /><path d="M-54,-200 L-44,-252 L-14,-222Z M54,-200 L44,-252 L14,-222Z" fill="#F4F1EA" /><path d="M-44,-210 L-40,-238 L-24,-220Z M44,-210 L40,-238 L24,-220Z" fill="#F2B8C9" />
      <circle cx={-22} cy={-176} r={12} fill="#4A9BE8" /><circle cx={22} cy={-176} r={12} fill="#F2B23A" />{[-22, 22].map((ex) => <ellipse key={ex} cx={ex} cy={-176} rx={4} ry={9} fill="#141414" />)}
      <path d="M-6,-150 L6,-150 L0,-142Z" fill="#E86A92" /></g>
  </g>
);
export const RadyoOdasi: React.FC<{ t: number; beam?: number; bulb?: number; steam?: number; names?: number; jacket?: number; mic?: number; bardak?: React.ReactNode }> = ({ t, beam = 1, bulb = 0, steam = 1, names = 1, jacket = 1, mic = 1, bardak }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C1220" />
    <rect y={760} width={1920} height={320} fill="#151C2C" />
    {bulb > 0 && <rect width={1920} height={1080} fill="#FFE8A0" opacity={bulb * 0.18} />}
    <g transform="translate(1500,420)"><rect x={-180} y={-160} width={360} height={260} rx={14} fill="#2A3040" />{Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-130 + i * 52} cy={-100} r={16} fill="#3A4050" />)}<rect x={-150} y={-40} width={300} height={70} rx={8} fill="#1A2030" /></g>
    {[[300, 0], [600, 1], [960, 2], [1320, 3], [1620, 4]].map(([x, i]) => <g key={i} transform={`translate(${x},${i === 2 ? 700 : 800}) scale(${i === 2 ? 1 : 1.3})`}>
      <rect x={-70} y={-230} width={140} height={20} rx={8} fill="#5A3A26" /><rect x={-60} y={-230} width={18} height={230} fill="#4A2E1E" /><rect x={42} y={-230} width={18} height={230} fill="#4A2E1E" /><rect x={-80} y={-90} width={160} height={24} rx={8} fill="#6E4A2E" />
      {names > 0 && (i === 0 || i === 4) && <g opacity={names} transform="translate(0,-140) rotate(-4)"><rect x={-84} y={-52} width={168} height={98} fill="#FFFBEA" /><text x={0} y={-12} textAnchor="middle" fontFamily="Patrick Hand" fontSize={38} fill="#2A3A6A">{i === 4 ? "DEFNE" : "▬▬▬"}</text><text x={0} y={32} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#E0393E">03.14</text></g>}
      {jacket > 0 && i === 3 && <g opacity={jacket}><path d="M-66,-226 Q0,-250 66,-226 L74,-80 L-74,-80Z" fill="#6E7B3A" /><path d="M-10,-226 L0,-120 L10,-226Z" fill="#F28C28" /><path d="M-66,-226 L-90,-110 M66,-226 L90,-110" stroke="#56612C" strokeWidth={22} strokeLinecap="round" /></g>}
    </g>)}
    <g transform="translate(960,660)"><rect x={-360} y={-20} width={720} height={36} rx={8} fill="#7A5236" /><rect x={-330} y={16} width={26} height={240} fill="#5A3A26" /><rect x={304} y={16} width={26} height={240} fill="#5A3A26" />
      <g transform="translate(-60,-20)"><rect x={-40} y={-10} width={80} height={14} rx={6} fill="#2A2A2A" /><rect x={-6} y={-130} width={12} height={124} fill="#3A3A3A" /><rect x={-26} y={-200} width={52} height={86} rx={26} fill="#4A4A4A" />{mic > 0 && <circle cx={0} cy={-157} r={46} fill="#FF7A3A" opacity={mic * 0.22 * (0.8 + 0.2 * Math.sin(t * 4))} />}</g>
      <g transform="translate(150,-20)">{bardak}{steam > 0 && Array.from({ length: 3 }, (_, i) => { const ph = md(t * 0.6 + i / 3, 1); return <path key={i} d={`M${-10 + i * 10},${-80 - ph * 90} q${12 * Math.sin(t * 3 + i)},-20 0,-40`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={steam * 0.6 * (1 - ph)} strokeLinecap="round" />; })}</g></g>
    {beam > 0 && <path d="M0,1080 L760,420 L1240,560 L260,1080Z" fill="#FFF6D0" opacity={beam * 0.16} />}
  </g>
);
export const _yv = { cl };

// ───────── ARABA İÇİ (büyük yakın plan: karakterler ep1 boyutunda) ─────────
// Ön camdan içeri bakış. Türkiye: direksiyon solda → önden bakınca şoför (Defne) SAĞDA.
// Yolcu düğümleri dışarıdan gelir: right = şoför (x≈1220), left = yolcu (x≈700), dog = arka orta (x≈960).
// Önerilen: TFig sit, s=1.15, y=1060. Pano y≥880'den başlar, kafalar ≈ y 450–560.
export const ArabaIci: React.FC<{ t: number; mode?: Mode; kind?: Yol; move?: boolean; snow?: number; left?: React.ReactNode; right?: React.ReactNode; dog?: React.ReactNode; dash?: React.ReactNode; wheel?: boolean; glow?: number }> = ({ t, mode = "day", kind = "otoyol", move = true, snow = 0, left, right, dog, dash, wheel = true, glow = 0 }) => {
  const nt = mode === "night" || mode === "storm";
  const bob = move ? Math.sin(t * 11) * 2.5 + Math.sin(t * 3.1) * 1.5 : 0;
  const cab = nt ? "#232C3E" : "#3A3F4A", seat = nt ? "#34405A" : "#565C68";
  return (
    <g>
      <rect width={1920} height={1080} fill={cab} />
      {/* arka cam: dışarıdaki yol geriye akıyor */}
      <defs><clipPath id="yvIciArka"><path d="M560,170 L1360,170 Q1400,175 1400,220 L1380,470 L540,470 L520,220 Q520,175 560,170Z" /></clipPath></defs>
      <g clipPath="url(#yvIciArka)"><g transform="translate(520,120) scale(0.46)"><YolSahne t={t} kind={kind} mode={mode} px={move ? -t * 420 : 0} snow={snow} fall={snow} cars={0} /></g></g>
      <path d="M560,170 L1360,170 Q1400,175 1400,220 L1380,470 L540,470 L520,220 Q520,175 560,170Z" fill="none" stroke="#0E1218" strokeWidth={14} />
      {/* arka koltuk + koltuk başlıkları */}
      <rect x={380} y={520} width={1160} height={420} rx={60} fill={seat} />
      <g transform={`translate(0,${bob * 0.5})`}>{dog}</g>
      {[700, 1220].map((x) => <g key={x}><rect x={x - 170} y={560} width={340} height={420} rx={50} fill={seat} /><rect x={x - 90} y={470} width={180} height={110} rx={36} fill={seat} /><rect x={x - 12} y={570} width={24} height={20} fill="#1A1E28" /></g>)}
      <g transform={`translate(0,${bob})`}>{left}{right}</g>
      {/* emniyet kemerleri */}
      {[[600, 640, 830, 980], [1320, 640, 1090, 980]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} L${x2},${y2}`} stroke="#22262E" strokeWidth={22} opacity={0.8} transform={`translate(0,${bob})`} />)}
      {/* direksiyon (şoförün önünde) */}
      {wheel && <g transform={`translate(1220,${930 + bob * 0.3}) rotate(${move ? Math.sin(t * 0.9) * 6 : 0})`}><circle r={190} fill="none" stroke="#1A1D24" strokeWidth={30} /><rect x={-190} y={-14} width={380} height={28} fill="#1A1D24" /><circle r={46} fill="#2A2E36" /><circle r={16} fill="#C9473E" /></g>}
      {/* torpido + pano */}
      <path d="M0,900 Q960,840 1920,900 L1920,1080 L0,1080Z" fill={nt ? "#0E1218" : "#2A2E36"} />
      <path d="M0,900 Q960,840 1920,900" stroke={nt ? "#2EE6D0" : "#4A4E58"} strokeWidth={6} fill="none" opacity={nt ? 0.35 + glow * 0.5 : 1} />
      {dash}
      {/* ön cam çerçevesi (A sütunları + tavan) */}
      <path d="M0,0 L1920,0 L1920,90 Q960,40 0,90Z" fill="#0E1218" />
      <path d="M0,0 L160,0 L60,1080 L0,1080Z M1920,0 L1760,0 L1860,1080 L1920,1080Z" fill="#0E1218" />
      {/* dikiz aynası */}
      <g transform="translate(960,70)"><rect x={-4} y={0} width={8} height={40} fill="#0E1218" /><rect x={-130} y={34} width={260} height={64} rx={20} fill="#0E1218" /><rect x={-118} y={44} width={236} height={44} rx={14} fill={nt ? "#1E2A3A" : "#8FA6B8"} /></g>
      {/* cam yansıması + kar */}
      <path d="M200,90 L420,90 L260,1080 L120,1080Z" fill="#FFFFFF" opacity={0.05} />
      {snow > 0 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={md(i * 89 + t * 140, 900)} r={3 + (i % 3) * 2} fill="#FFFFFF" opacity={0.5 * snow} />)}
      {nt && <><rect width={1920} height={1080} fill="#0A1430" opacity={0.12} /><ellipse cx={960} cy={860} rx={900} ry={260} fill="#2EE6D0" opacity={0.02 + glow * 0.03} /></>}
    </g>
  );
};
