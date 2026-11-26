import React from "react";
import { X, T, typed } from "./Protokol";
import { rp, lp, HCam, fmt } from "./Hayat";
import { hash } from "./Motion";
import { Label, Stamp } from "./Karun";

// Kanal 5 · Protokol X · k7-07 "Çiftlik Bank / Tosuncuk" kiti (2026-11-26)
// Kural: kartun yok. Sadece temiz arayüz/grafik: oyun telefonu (sanal → kilitli → anket → gerçek → kâr), saadet zinciri akışı,
// giren/çıkan para çubukları, vaat hesap makinesi, Kastelli 1982 arşiv kartı, tarih damgası, ceza sayacı, cezaevi mektubu,
// "Bank" = banka/oturak, bayilik ağı, Bitcoin makineleri + tavuk. Kimlik: zemin #07090E, MİT kırmızısı, para yeşili, saman sarısı.

type P = { t: number; a: number; b: number };
export const TRR = "#E30A17", MON = "#7BE495", AMB = X.amber, HAY = "#E8C66A", GRASS = "#6FBF5A";
const bg = (c = "#07090E") => <rect width={1920} height={1080} fill={c} />;
const lbl = (t: number, a: number, l?: [string, string?], c?: string) => l ? <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={l[0]} b={l[1]} c={c} /> : null;

// ───────── basit ikonlar (vektör, kartun yüz yok) ─────────
export type Ani = "tavuk" | "inek" | "koyun" | "ari" | "ordek" | "yumurta";
export const Icon: React.FC<{ k: Ani; x: number; y: number; s?: number; op?: number }> = ({ k, x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    {k === "tavuk" && <g><ellipse cx={0} cy={10} rx={34} ry={28} fill="#F3EEE4" /><circle cx={24} cy={-18} r={16} fill="#F3EEE4" /><path d="M20,-36 q6,-10 12,0 q6,-10 10,2" fill={TRR} /><path d="M38,-16 l14,4 l-14,5z" fill={HAY} /><circle cx={28} cy={-20} r={2.5} fill="#111" /><path d="M-6,36 v14 M8,36 v14" stroke={HAY} strokeWidth={4} /></g>}
    {k === "inek" && <g><rect x={-46} y={-14} width={92} height={50} rx={18} fill="#F2F2EE" /><circle cx={-20} cy={2} r={10} fill="#222" /><circle cx={16} cy={20} r={12} fill="#222" /><rect x={36} y={-34} width={34} height={36} rx={12} fill="#F2F2EE" /><path d="M40,-34 l-6,-10 M66,-34 l6,-10" stroke="#BBB" strokeWidth={5} /><rect x={44} y={-10} width={24} height={14} rx={7} fill="#E8B4A8" /><path d="M-36,36 v20 M-16,36 v20 M18,36 v20 M36,36 v20" stroke="#DDD" strokeWidth={8} /></g>}
    {k === "koyun" && <g>{[[-24, 0], [0, -10], [22, 0], [-10, 16], [14, 16]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22} fill="#EEEAE0" />)}<ellipse cx={44} cy={-8} rx={14} ry={18} fill="#333" /><path d="M-20,34 v18 M16,34 v18" stroke="#333" strokeWidth={6} /></g>}
    {k === "ari" && <g><ellipse cx={0} cy={0} rx={30} ry={20} fill={HAY} /><path d="M-10,-19 v38 M6,-19 v38" stroke="#222" strokeWidth={8} /><ellipse cx={-6} cy={-26} rx={14} ry={10} fill="#DDEEFF" opacity={0.8} /><ellipse cx={10} cy={-28} rx={14} ry={10} fill="#DDEEFF" opacity={0.8} /></g>}
    {k === "ordek" && <g><ellipse cx={0} cy={10} rx={34} ry={22} fill="#F5F0E0" /><circle cx={26} cy={-14} r={14} fill="#3D7A4A" /><path d="M38,-14 l16,3 l-16,6z" fill="#E89A3A" /></g>}
    {k === "yumurta" && <ellipse cx={0} cy={0} rx={22} ry={29} fill="#F4E9D6" stroke="#D9C7A6" strokeWidth={2} />}
  </g>
);

// ───────── Oyun telefonu ─────────
// mode: virtual = altın + sanal hayvanlar · locked = "Bu özellik yakında" · survey = soru kutusu · real = TL ile al + fotoğraf + makbuz · profit = kazanç sayacı
export const FarmPhone: React.FC<P & { mode?: "virtual" | "locked" | "survey" | "real" | "profit"; q?: string; label?: [string, string?]; side?: "l" | "c" }> = ({ t, a, b, mode = "virtual", q = "Sanal hayvanların gerçek olsun mu?", label, side = "c" }) => {
  const px = side === "c" ? 960 : 640;
  const coins = mode === "virtual" ? 1200 + Math.floor((t - a) * 37) : 0;
  const prof = mode === "profit" ? lp(100000, 108450, rp(t, a + 0.3, Math.max(a + 2, b - 0.3))) : 0;
  const grid: Ani[] = ["tavuk", "inek", "koyun", "ari", "ordek", "tavuk", "yumurta", "koyun", "inek"];
  return (
    <g>
      {bg("#06080C")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.07]} c0={[px, 540]}>
        <rect x={px - 290} y={60} width={580} height={1000} rx={60} fill="#0B0E14" stroke="#2A3240" strokeWidth={6} />
        <rect x={px - 262} y={120} width={524} height={900} rx={18} fill="#2E5A28" />
        {/* üst bar */}
        <rect x={px - 262} y={120} width={524} height={90} rx={18} fill="#1E3A1A" />
        {T(px - 236, 178, "ÇİFTLİĞİM", 30, "#FFF", 900)}
        {mode === "virtual" && T(px + 236, 178, `${fmt(coins)} altın`, 28, HAY, 800, "end")}
        {(mode === "real" || mode === "profit") && T(px + 236, 178, "₺ HESAP", 26, MON, 800, "end")}
        {/* tarla ızgarası */}
        {grid.map((k, i) => {
          const c = i % 3, r = Math.floor(i / 3), on = rp(t, a + 0.1 + i * 0.06, a + 0.4 + i * 0.06);
          const x = px - 230 + c * 160, y = 240 + r * 170;
          return (
            <g key={i} opacity={on}>
              <rect x={x} y={y} width={140} height={150} rx={14} fill="#4C8A3A" stroke="#6FAF55" strokeWidth={3} />
              <Icon k={k} x={x + 70} y={y + 72 + Math.sin(t * 2 + i) * 3} s={0.95} />
            </g>
          );
        })}
        {/* düğmeler */}
        {["SAT", "BESLE", "GERÇEK YAP"].map((s, i) => {
          const hi = i === 2 && (mode === "locked" || mode === "real");
          return (
            <g key={s}>
              <rect x={px - 236 + i * 160} y={780} width={150} height={70} rx={14} fill={hi ? (mode === "real" ? MON : "#5A5A5A") : "#E8C66A"} />
              {T(px - 161 + i * 160, 826, s, i === 2 ? 22 : 26, "#14210F", 900, "middle")}
            </g>
          );
        })}
        {mode === "locked" && (
          <g opacity={rp(t, a + 0.8, a + 1.2)}>
            <rect x={px - 230} y={880} width={460} height={110} rx={16} fill="#111" opacity={0.92} />
            {T(px, 930, "Bu özellik yakında", 30, "#FFF", 800, "middle")}
            {T(px, 970, "ekibimiz üzerinde çalışıyor", 22, "#AAA", 500, "middle")}
          </g>
        )}
        {mode === "survey" && (
          <g opacity={rp(t, a + 0.5, a + 0.9)}>
            <rect x={px - 262} y={120} width={524} height={900} rx={18} fill="#000" opacity={0.55} />
            <rect x={px - 230} y={380} width={460} height={300} rx={20} fill="#F4F1EA" />
            {T(px, 440, "Hızlı soru", 26, "#6A6A6A", 700, "middle")}
            {q.split("\n").map((l, i) => <g key={i}>{T(px, 500 + i * 44, typed(l, rp(t, a + 0.9 + i * 0.4, a + 1.8 + i * 0.4)), 32, "#111", 800, "middle")}</g>)}
            <rect x={px - 200} y={590} width={180} height={64} rx={14} fill={GRASS} />{T(px - 110, 633, "EVET", 28, "#FFF", 900, "middle")}
            <rect x={px + 20} y={590} width={180} height={64} rx={14} fill="#C9C4B8" />{T(px + 110, 633, "HAYIR", 28, "#333", 900, "middle")}
            {/* parmak dokunuşu */}
            <circle cx={px - 110} cy={622} r={20 + 30 * rp(t, a + 2.4, a + 2.9)} fill="#FFF" opacity={0.5 * (1 - rp(t, a + 2.6, a + 3.1)) * rp(t, a + 2.3, a + 2.5)} />
          </g>
        )}
        {mode === "real" && (
          <g opacity={rp(t, a + 0.6, a + 1.0)}>
            <rect x={px - 262} y={120} width={524} height={900} rx={18} fill="#000" opacity={0.5} />
            <g transform={`translate(${px - 200},300) rotate(-4)`}>
              <rect width={400} height={300} fill="#FFF" /><rect x={14} y={14} width={372} height={230} fill="#7A6A4A" />
              {Array.from({ length: 6 }, (_, i) => <Icon key={i} k="tavuk" x={70 + (i % 3) * 120} y={90 + Math.floor(i / 3) * 90} s={0.7} />)}
              {T(200, 282, "Senin tavukların · #48213", 22, "#333", 700, "middle")}
            </g>
            <g transform={`translate(${px - 150},650) rotate(3)`} opacity={rp(t, a + 1.3, a + 1.7)}>
              <rect width={300} height={260} fill="#F6F3EC" />
              {T(150, 46, "MAKBUZ", 30, "#222", 900, "middle")}
              {[0, 1, 2, 3].map((i) => <rect key={i} x={30} y={80 + i * 34} width={[240, 200, 220, 160][i]} height={12} rx={6} fill="#B9B3A6" />)}
              {T(150, 236, "6 tavuk · ödendi", 24, "#2E7A3A", 800, "middle")}
            </g>
          </g>
        )}
        {mode === "profit" && (
          <g>
            <rect x={px - 230} y={880} width={460} height={120} rx={16} fill="#0D1A0D" stroke={MON} strokeWidth={3} />
            {T(px, 925, "KAZANCIN", 22, "#9FD9A0", 800, "middle")}
            {T(px, 978, `₺ ${fmt(prof)}`, 46, MON, 900, "middle")}
            <path d={`M${px + 150},960 l18,-24 l18,24`} fill={MON} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 4))} />
          </g>
        )}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Saadet zinciri ─────────
// Yeni gelen → havuz → eskiye "kâr". stop: yeni para durur, zincir kopar.
export const Ponzi: React.FC<P & { stop?: boolean; label?: [string, string?]; tag?: string }> = ({ t, a, b, stop = false, label, tag = "SAADET ZİNCİRİ" }) => {
  const rows = 4;
  const brk = stop ? rp(t, a + 1.4, a + 2.2) : 0;
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {T(960, 130, tag, 52, stop ? TRR : AMB, 900, "middle")}
        {/* havuz */}
        <rect x={810} y={420} width={300} height={240} rx={20} fill="#0E131C" stroke={stop ? TRR : "#2A3240"} strokeWidth={4} />
        <rect x={826} y={660 - 210 * (stop ? 1 - brk * 0.95 : 0.65 + 0.1 * Math.sin(t * 2))} width={268} height={210 * (stop ? 1 - brk * 0.95 : 0.65 + 0.1 * Math.sin(t * 2))} rx={10} fill={MON} opacity={0.5} />
        {T(960, 710, "HAVUZ", 30, "#8A94A6", 800, "middle")}
        {/* soldan yeni gelenler */}
        {Array.from({ length: rows }, (_, i) => {
          const y = 300 + i * 150, on = rp(t, a + 0.2 + i * 0.15, a + 0.5 + i * 0.15);
          const flow = !stop || brk < 0.5;
          return (
            <g key={i} opacity={on}>
              <circle cx={260} cy={y} r={44} fill="#1A2230" stroke="#3A4656" strokeWidth={3} /><circle cx={260} cy={y - 10} r={14} fill="#8A94A6" /><path d={`M232,${y + 30} q28,-34 56,0`} fill="#8A94A6" />
              {T(340, y + 10, "YENİ ÜYE", 24, "#AAB2C0", 700)}
              <path d={`M320,${y} C560,${y} 620,540 800,540`} stroke="#2A3240" strokeWidth={6} fill="none" />
              {flow && <circle r={10} fill={MON} cx={lp(330, 800, ((t * 0.6 + i * 0.25) % 1))} cy={lp(y, 540, ((t * 0.6 + i * 0.25) % 1))} />}
            </g>
          );
        })}
        {/* sağa eskilere "kâr" */}
        {Array.from({ length: rows }, (_, i) => {
          const y = 300 + i * 150, on = rp(t, a + 0.8 + i * 0.15, a + 1.1 + i * 0.15);
          return (
            <g key={i} opacity={on}>
              <path d={`M1120,540 C1300,540 1360,${y} 1600,${y}`} stroke="#2A3240" strokeWidth={6} fill="none" />
              {(!stop || brk < 0.5) && <circle r={10} fill={MON} cx={lp(1120, 1600, ((t * 0.6 + i * 0.25 + 0.5) % 1))} cy={lp(540, y, ((t * 0.6 + i * 0.25 + 0.5) % 1))} />}
              <circle cx={1660} cy={y} r={44} fill="#1A2230" stroke={stop && brk > 0.5 ? TRR : "#3A4656"} strokeWidth={3} /><circle cx={1660} cy={y - 10} r={14} fill="#8A94A6" /><path d={`M1632,${y + 30} q28,-34 56,0`} fill="#8A94A6" />
              {T(1580, y + 10, stop && brk > 0.6 ? "ÖDEME YOK" : "\"KÂR\"", 24, stop && brk > 0.6 ? TRR : MON, 800, "end")}
            </g>
          );
        })}
        {stop && <g opacity={brk}>{T(960, 860, "YENİ PARA DURDU → ZİNCİR KOPTU", 44, TRR, 900, "middle")}</g>}
        {!stop && <g opacity={rp(t, a + 1.6, a + 2.1)}>{T(960, 860, "kâr, tavuktan değil · yeni gelenin cebinden", 38, "#FFF", 700, "middle")}</g>}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Giren / çıkan para (SPK) ─────────
export const InOut: React.FC<P & { gap?: boolean; label?: [string, string?] }> = ({ t, a, b, gap = false, label }) => {
  const k1 = rp(t, a + 0.3, a + 1.4), k2 = rp(t, a + 1.0, a + 2.1), g = gap ? rp(t, a + 0.3, a + 1.0) : 0;
  const H = 560, h1 = H, h2 = H * (398.3 / 511.7);
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {T(960, 130, "SPK RAKAMLARI · 2016–2017", 40, AMB, 800, "middle")}
        {/* giren */}
        <rect x={560} y={900 - h1 * k1} width={300} height={h1 * k1} fill={MON} opacity={0.85} />
        {T(710, 960, "GİREN", 34, "#FFF", 900, "middle")}
        {T(710, 880 - h1 * k1, `${fmt(lp(0, 511.7, k1))} milyon ₺`, 44, MON, 900, "middle")}
        {T(710, 1010, `${fmt(lp(0, 77843, k1))} kişi yatırdı`, 26, "#AAB2C0", 600, "middle")}
        {/* çıkan */}
        <rect x={1060} y={900 - h2 * k2} width={300} height={h2 * k2} fill="#C9D2DE" opacity={0.85} />
        {T(1210, 960, "ÇIKAN", 34, "#FFF", 900, "middle")}
        {T(1210, 880 - h2 * k2, `${fmt(lp(0, 398.3, k2))} milyon ₺`, 44, "#FFF", 900, "middle")}
        {T(1210, 1010, `${fmt(lp(0, 62877, k2))} kişiye ödendi`, 26, "#AAB2C0", 600, "middle")}
        {gap && (
          <g opacity={g}>
            <rect x={1060} y={900 - h1} width={300} height={h1 - h2} fill="none" stroke={TRR} strokeWidth={5} strokeDasharray="16 10" />
            {T(1400, 900 - h1 + (h1 - h2) / 2 + 14, "≈ 113 milyon ₺", 40, TRR, 900)}{T(1400, 900 - h1 + (h1 - h2) / 2 + 64, "→ Kıbrıs", 34, TRR, 800)}
          </g>
        )}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Vaat hesap makinesi ─────────
export const Promise: React.FC<P & { put: number; get: number; per: string; note?: string; label?: [string, string?] }> = ({ t, a, b, put, get, per, note, label }) => {
  const k = rp(t, a + 0.6, a + 1.8);
  return (
    <g>
      {bg("#08090D")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
        <rect x={460} y={190} width={1000} height={680} rx={30} fill="#0E131C" stroke="#1F2938" strokeWidth={4} />
        {T(960, 280, "VAAT", 40, AMB, 900, "middle")}
        {T(700, 440, "YATIR", 30, "#8A94A6", 800, "middle")}
        {T(700, 520, `₺ ${fmt(put)}`, 64, "#FFF", 900, "middle")}
        <path d="M900,490 h110 l-24,-24 M1010,490 l-24,24" stroke={AMB} strokeWidth={8} fill="none" opacity={rp(t, a + 0.3, a + 0.6)} />
        {T(1230, 440, per, 30, "#8A94A6", 800, "middle")}
        {T(1230, 520, `₺ ${fmt(lp(put * (get > put ? 1 : 0), get, k))}`, 64, MON, 900, "middle")}
        {note && <g opacity={rp(t, a + 1.8, a + 2.3)}>{T(960, 700, note, 38, "#FFF", 700, "middle")}</g>}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Arşiv kartı (1982 Kastelli vb.) ─────────
export const Archive82: React.FC<P & { yr: string; head: string; sub?: string; label?: [string, string?] }> = ({ t, a, b, yr, head, sub, label }) => (
  <g>
    {bg("#0A0A0A")}
    <HCam t={t} a={a} b={b} z={[1.02, 1.1]}>
      <g transform="translate(360,150) rotate(-2)">
        <rect width={1200} height={780} fill="#D8CFB8" />
        <rect width={1200} height={780} fill="url(#none)" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i) * 1200} cy={hash(i + 99) * 780} r={2 + hash(i + 7) * 5} fill="#8A7A5A" opacity={0.25} />)}
        <rect x={40} y={40} width={1120} height={10} fill="#222" />
        {T(600, 150, yr, 120, "#1A1A1A", 900, "middle")}
        <rect x={40} y={190} width={1120} height={4} fill="#222" />
        {head.split("\n").map((l, i) => <g key={i}>{T(600, 320 + i * 100, typed(l, rp(t, a + 0.3 + i * 0.3, a + 1.2 + i * 0.3)), 84, "#111", 900, "middle")}</g>)}
        {sub && T(600, 320 + head.split("\n").length * 100 + 20, sub, 34, "#4A4236", 600, "middle")}
        {Array.from({ length: 4 }, (_, i) => <rect key={i} x={120} y={620 + i * 34} width={[960, 900, 940, 600][i]} height={14} rx={7} fill="#9A8F78" />)}
      </g>
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Tarih damgası (bölüm başı) ─────────
export const DateCard: React.FC<P & { date: string; place?: string; note?: string; c?: string; stamp?: string }> = ({ t, a, b, date, place, note, c = AMB, stamp }) => (
  <g>
    {bg("#06070A")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
      <rect x={0} y={500} width={1920 * rp(t, a, a + 0.5)} height={3} fill={c} opacity={0.5} />
      {T(960, 470, typed(date, rp(t, a + 0.1, a + 0.9)), 120, "#FFF", 900, "middle", { fontFamily: "monospace" })}
      {place && <g opacity={rp(t, a + 0.7, a + 1.1)}>{T(960, 590, place, 44, c, 800, "middle")}</g>}
      {note && <g opacity={rp(t, a + 1.1, a + 1.5)}>{T(960, 660, note, 32, "#AAB2C0", 600, "middle")}</g>}
      {stamp && <Stamp x={1480} y={300} t={t} at={a + 1.2} s={stamp} c={TRR} rot={-10} size={54} />}
    </HCam>
  </g>
);

// ───────── Ceza sayacı ─────────
export const Sentence: React.FC<P & { fine?: boolean }> = ({ t, a, b, fine = false }) => {
  const k = rp(t, a + 0.4, a + 2.6);
  return (
    <g>
      {bg("#050608")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {T(960, 250, "MEHMET AYDIN · FATİH AYDIN", 36, "#AAB2C0", 800, "middle")}
        {T(960, 560, fmt(lp(0, 45376, k)), 230, "#FFF", 900, "middle", { fontFamily: "monospace" })}
        {T(960, 680, "YIL 6 AY HAPİS · her biri", 50, TRR, 900, "middle")}
        {fine && <g opacity={rp(t, a + 2.8, a + 3.3)}>{T(960, 800, "+ 496.064.000 ₺ adli para cezası", 42, AMB, 800, "middle")}</g>}
        {T(960, 900, "Anadolu 6. Ağır Ceza · 03.02.2025 · karar istinafta", 26, "#6A7486", 600, "middle")}
      </HCam>
    </g>
  );
};

// ───────── Cezaevi mektubu ─────────
export const Letter: React.FC<P & { lines: string[]; head?: string; sign?: string }> = ({ t, a, b, lines, head = "Edirne · 20.11.2025", sign = "M. Aydın" }) => (
  <g>
    {bg("#0A0B0E")}
    <HCam t={t} a={a} b={b} z={[1.03, 1.12]} c0={[960, 480]} c1={[960, 600]}>
      <g transform="translate(470,90) rotate(1.5)">
        <rect width={980} height={940} fill="#EDE8DC" />
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={50} y={150 + i * 36} width={880} height={1.5} fill="#B8C4D8" />)}
        <rect x={110} y={0} width={2} height={940} fill="#E2A0A0" />
        {T(880, 100, head, 28, "#3A3A5A", 600, "end", { fontStyle: "italic" })}
        {lines.map((l, i) => <g key={i}>{T(140, 220 + i * 72, typed(l, rp(t, a + 0.4 + i * 0.7, a + 1.3 + i * 0.7)), 40, "#1E2A5A", 600, "start", { fontStyle: "italic", fontFamily: "Georgia, serif" })}</g>)}
        {T(880, 880, sign, 36, "#1E2A5A", 600, "end", { fontStyle: "italic", fontFamily: "Georgia, serif" })}
      </g>
    </HCam>
  </g>
);

// ───────── "BANK" = banka mı, oturak mı? ─────────
export const BankWord: React.FC<P> = ({ t, a, b }) => {
  const k = rp(t, a + 1.0, a + 1.6);
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {T(960, 300, "ÇİFTLİK BANK", 110, "#FFF", 900, "middle")}
        <rect x={1180} y={210} width={330} height={120} fill="none" stroke={TRR} strokeWidth={6} rx={10} opacity={rp(t, a + 0.4, a + 0.8)} />
        <g opacity={1 - k}>
          <rect x={760} y={500} width={400} height={260} fill="#1A2230" />{[0, 1, 2].map((i) => <rect key={i} x={800 + i * 120} y={560} width={80} height={200} fill="#2A3446" />)}
          <path d="M740,500 L960,410 L1180,500Z" fill="#2A3446" />{T(960, 820, "banka?", 44, "#AAB2C0", 700, "middle")}
        </g>
        <g opacity={k}>
          <rect x={700} y={600} width={520} height={30} rx={8} fill="#8A5A3A" /><rect x={700} y={540} width={520} height={24} rx={8} fill="#8A5A3A" /><rect x={700} y={500} width={520} height={24} rx={8} fill="#8A5A3A" />
          <path d="M740,630 v120 M1180,630 v120" stroke="#333" strokeWidth={14} />
          {T(960, 820, "yoksa park bankı?", 44, AMB, 800, "middle")}
        </g>
      </HCam>
    </g>
  );
};

// ───────── Bitcoin makineleri + tavuk çiftliği ─────────
export const MinerBarn: React.FC<P & { n?: number; label?: [string, string?] }> = ({ t, a, b, n = 550, label }) => (
  <g>
    {bg("#07090C")}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      {/* ahır kirişleri */}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 300 - 40} y={120} width={30} height={760} fill="#1C1812" />)}
      <rect x={0} y={120} width={1920} height={24} fill="#1C1812" />
      {/* raflar */}
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 9 }, (_, c) => {
        const on = rp(t, a + 0.1 + (r * 9 + c) * 0.02, a + 0.3 + (r * 9 + c) * 0.02);
        return (
          <g key={r * 9 + c} opacity={on} transform={`translate(${260 + c * 160},${220 + r * 120})`}>
            <rect width={140} height={96} rx={6} fill="#2A3038" stroke="#3A4250" strokeWidth={2} />
            <circle cx={36} cy={48} r={26} fill="#151A20" /><path d={`M36,48 l${22 * Math.cos(t * 20 + c)},${22 * Math.sin(t * 20 + c)}`} stroke="#4A5260" strokeWidth={4} />
            <circle cx={118} cy={20} r={5} fill={hash(r * 9 + c + Math.floor(t * 4)) > 0.3 ? MON : "#234"} />
          </g>
        );
      }))}
      {/* zemin + tavuklar */}
      <rect x={0} y={760} width={1920} height={320} fill="#3A2E1E" />
      {Array.from({ length: 12 }, (_, i) => <Icon key={i} k="tavuk" x={120 + i * 150 + Math.sin(t + i) * 10} y={860 + (i % 2) * 60} s={0.8} />)}
      {T(1840, 100, `${n} kazı makinesi · Manisa`, 34, AMB, 800, "end")}
    </HCam>
    {lbl(t, a, label)}
  </g>
);

// ───────── Bayilik ağı sayacı ─────────
export const Shops: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => {
  const k = rp(t, a + 0.3, a + 2.2), n = Math.round(lp(0, 150, k));
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {Array.from({ length: 150 }, (_, i) => {
          const c = i % 15, r = Math.floor(i / 15), on = i < n ? 1 : 0.08, ist = i < 40;
          return (
            <g key={i} opacity={on} transform={`translate(${330 + c * 86},${230 + r * 62})`}>
              <rect width={70} height={46} rx={4} fill={ist ? "#3A2A1A" : "#1E2A1E"} stroke={ist ? AMB : GRASS} strokeWidth={2} />
              <path d="M0,10 h70" stroke={ist ? AMB : GRASS} strokeWidth={6} strokeDasharray="10 4" />
            </g>
          );
        })}
        {T(960, 170, `${n} SATIŞ NOKTASI`, 60, "#FFF", 900, "middle")}
        <g opacity={rp(t, a + 2.2, a + 2.6)}>{T(960, 940, "40'ı sadece İstanbul'da · bayilik: 100.000 ₺", 40, AMB, 800, "middle")}</g>
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};

// ───────── Ödeme gecikiyor (çekim ekranı) ─────────
export const Withdraw: React.FC<P & { stage?: 0 | 1 | 2 }> = ({ t, a, b, stage = 0 }) => {
  const msg = ["İşleminiz sıraya alındı", "Ödemeniz gecikmeli yapılacak", "Hesabınız geçici olarak kısıtlandı"][stage];
  return (
    <g>
      {bg("#06080C")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
        <rect x={670} y={60} width={580} height={1000} rx={60} fill="#0B0E14" stroke="#2A3240" strokeWidth={6} />
        <rect x={698} y={120} width={524} height={900} rx={18} fill="#10161E" />
        {T(960, 200, "PARA ÇEK", 36, "#FFF", 900, "middle")}
        {T(960, 330, "₺ 25.000", 70, MON, 900, "middle")}
        <circle cx={960} cy={520} r={70} fill="none" stroke="#2A3240" strokeWidth={10} />
        <path d={`M960,450 A70,70 0 0 1 ${960 + 70 * Math.sin(t * 4)},${520 - 70 * Math.cos(t * 4)}`} stroke={stage === 2 ? TRR : AMB} strokeWidth={10} fill="none" />
        {T(960, 700, typed(msg, rp(t, a + 0.5, a + 1.5)), 30, stage === 2 ? TRR : "#AAB2C0", 700, "middle")}
      </HCam>
    </g>
  );
};

// ═════════ v2 (2026-11-26): آلية اللعبة خطوة خطوة ═════════
// Aşama çizelgesi: sanal → gerçek para → şirket/çiftlik → fabrika → satış noktası → Bitcoin
const STG = ["SANAL OYUN", "GERÇEK PARA", "ŞİRKET + ÇİFTLİK", "FABRİKA", "SATIŞ NOKTASI", "BITCOIN"];
export const Stages: React.FC<P & { hi?: number; upto?: number }> = ({ t, a, b, hi = 0, upto }) => {
  const n = upto ?? Math.max(hi + 1, 1);
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]} c0={[960, 540]}>
        {T(960, 210, "PLAN", 34, "#7C8696", 800, "middle", { letterSpacing: 8 })}
        <line x1={190} x2={1730} y1={540} y2={540} stroke="#2A3240" strokeWidth={6} />
        {STG.map((s, i) => {
          const x = 190 + i * 308, on = i < n ? rp(t, a + 0.15 + i * 0.12, a + 0.45 + i * 0.12) : 0.18, cur = i === hi;
          const k = cur ? rp(t, a + 0.6, a + 1.0) : 0;
          return (
            <g key={i} opacity={Math.max(on, 0.18)}>
              {i > 0 && i < n && <line x1={x - 308} x2={x - 308 + 308 * rp(t, a + 0.1 + i * 0.12, a + 0.5 + i * 0.12)} y1={540} y2={540} stroke={AMB} strokeWidth={6} />}
              <circle cx={x} cy={540} r={cur ? 34 + 6 * k : 24} fill={cur ? TRR : i < n ? AMB : "#1A2030"} stroke="#07090E" strokeWidth={6} />
              {T(x, 552, `${i + 1}`, cur ? 30 : 24, "#07090E", 900, "middle")}
              {T(x, i % 2 ? 660 : 450, s, cur ? 34 : 26, cur ? "#FFF" : "#AAB2C0", cur ? 900 : 700, "middle")}
            </g>
          );
        })}
      </HCam>
    </g>
  );
};

// Seçenek daralıyor: 100 tavuk → en fazla 5
export const Limit: React.FC<P> = ({ t, a, b }) => {
  const k = rp(t, a + 1.0, a + 2.0);
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
        {Array.from({ length: 100 }).map((_, i) => {
          const c = i % 20, r = Math.floor(i / 20), keep = i < 5;
          const op = keep ? 1 : 1 - k;
          return <Icon key={i} k="tavuk" x={330 + c * 66} y={300 + r * 100} s={0.62} op={op * rp(t, a + i * 0.006, a + 0.3 + i * 0.006)} />;
        })}
        <g opacity={rp(t, a + 0.2, a + 0.6)}>{T(960, 170, typed("SANAL: 100 TAVUK", rp(t, a + 0.2, a + 0.8)), 50, "#AAB2C0", 800, "middle")}</g>
        <g opacity={k}>
          <rect x={290} y={232} width={360} height={136} rx={16} fill="none" stroke={MON} strokeWidth={5} />
          {T(960, 900, "GERÇEK PARA: EN FAZLA 5", 64, MON, 900, "middle")}
          {T(960, 970, "az olan, gerçek görünür", 34, "#AAB2C0", 600, "middle")}
        </g>
      </HCam>
    </g>
  );
};

// Fotoğraf + makbuz: "senin tavukların"
export const Receipt: React.FC<P & { amount?: string }> = ({ t, a, b, amount = "₺ 750" }) => {
  const k1 = rp(t, a + 0.2, a + 0.8), k2 = rp(t, a + 0.9, a + 1.5);
  return (
    <g>
      {bg("#0A0C10")}
      <HCam t={t} a={a} b={b} z={[1.0, 1.08]} c0={[900, 540]}>
        <g transform={`translate(${520 - (1 - k1) * 120},${200}) rotate(${-6 * k1})`} opacity={k1}>
          <rect width={560} height={640} fill="#F4F1EA" />
          <rect x={30} y={30} width={500} height={480} fill="#5E7A3A" />
          <rect x={30} y={30} width={500} height={480} fill="#000" opacity={0.18} />
          {[0, 1, 2, 3, 4].map((i) => <Icon key={i} k="tavuk" x={110 + (i % 3) * 160} y={170 + Math.floor(i / 3) * 190} s={1.2} />)}
          {T(280, 580, "Senin tavukların · No: 0412-0416", 26, "#333", 700, "middle")}
        </g>
        <g transform={`translate(${1060 + (1 - k2) * 120},${250}) rotate(${4 * k2})`} opacity={k2}>
          <rect width={420} height={560} fill="#FFFDF7" />
          {T(210, 70, "MAKBUZ", 40, "#222", 900, "middle")}
          {[["Ürün", "5 adet tavuk"], ["Tutar", amount], ["Ödeme", "Havale"], ["Teslim", "Çiftlikte bakım"]].map(([l, v], i) => (
            <g key={i}>{T(40, 160 + i * 80, l, 26, "#777", 600)}{T(380, 160 + i * 80, v, 28, "#222", 800, "end")}<line x1={40} x2={380} y1={180 + i * 80} y2={180 + i * 80} stroke="#DDD" strokeWidth={2} /></g>
          ))}
          <Stamp x={260} y={480} t={t} at={a + 1.6} s="ÖDENDİ" c={TRR} rot={-12} size={44} />
        </g>
      </HCam>
    </g>
  );
};

// İneğin ömrü: 5 yıl, fiyat düşer, aynı inek birden fazla kişiye
export const CowLife: React.FC<P & { stage?: 0 | 1 | 2 | 3 }> = ({ t, a, b, stage = 0 }) => {
  const k = rp(t, a + 0.3, a + 2.2);
  const X0 = 300, X1 = 1620;
  const price = (y: number) => 560 + 0.95 * (y / 5) * 280;
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        <Icon k="inek" x={220} y={300} s={1.5} />
        {T(330, 300, "1 İNEK · OYUNDA ÖMRÜ: 5 YIL", 44, "#FFF", 900)}
        <line x1={X0} x2={X1} y1={880} y2={880} stroke="#2A3240" strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5].map((y) => <g key={y}>{T(X0 + (X1 - X0) * y / 5, 930, `${y}. yıl`, 26, "#7C8696", 600, "middle")}</g>)}
        {stage >= 1 && <g opacity={rp(t, a + 0.3, a + 0.8)}>
          <rect x={X1 - 6} y={420} width={12} height={460} fill={TRR} />
          {T(X1 - 20, 410, "oyunda ölür", 30, TRR, 800, "end")}
          {T(X1 + 20, 520, "gerçekte?", 30, "#AAB2C0", 700, "start")}
        </g>}
        {stage >= 2 && <g>
          <path d={`M${X0},${price(0)} ${[1, 2, 3, 4, 5].map((y) => `L${X0 + (X1 - X0) * y / 5},${price(y)}`).join(" ")}`} fill="none" stroke={HAY} strokeWidth={6} strokeDasharray={2000} strokeDashoffset={2000 * (1 - (stage === 2 ? k : 1))} />
          {T(X0, price(0) - 24, "fiyat: süt azaldıkça düşer", 30, HAY, 700)}
        </g>}
        {stage >= 3 && ["1. alıcı", "2. alıcı", "3. alıcı"].map((s, i) => {
          const on = rp(t, a + 0.4 + i * 0.5, a + 0.8 + i * 0.5);
          return <g key={i} opacity={on}><rect x={X0 + 40 + i * 440} y={420} width={380} height={80} rx={12} fill="#0E131C" stroke={i ? TRR : MON} strokeWidth={3} />{T(X0 + 230 + i * 440, 472, `${s} · aynı inek`, 30, "#FFF", 800, "middle")}</g>;
        })}
      </HCam>
    </g>
  );
};

// Tek yumurta döngüsü: al → büyüt → sat → kazan → tekrar (güven makinesi)
export const EggLoop: React.FC<P & { debt?: boolean }> = ({ t, a, b, debt = false }) => {
  const steps: [Ani, string][] = [["yumurta", "1 yumurta al"], ["tavuk", "büyüsün"], ["ari", "sat, kazan"], ["yumurta", "tekrar"]];
  const loops = Math.max(0, Math.floor((t - a - 0.5) / 0.9));
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.05]}>
        {steps.map(([k, s], i) => {
          const ang = -Math.PI / 2 + i * Math.PI / 2, x = 960 + Math.cos(ang) * 300, y = 520 + Math.sin(ang) * 300;
          const act = Math.floor((t - a) / 0.45) % 4 === i;
          return (
            <g key={i} opacity={rp(t, a + i * 0.15, a + 0.4 + i * 0.15)}>
              <circle cx={x} cy={y} r={90} fill="#0E131C" stroke={act ? MON : "#2A3240"} strokeWidth={act ? 6 : 3} />
              {i === 2 ? T(x, y + 22, "₺", 64, MON, 900, "middle") : <Icon k={k} x={x} y={y - 6} s={1.0} />}
              {T(x + (i === 1 ? 0 : 0), y + (i === 0 ? -120 : 140), s, 30, "#FFF", 700, "middle")}
            </g>
          );
        })}
        {T(960, 535, `${Math.min(10, loops)}×`, 90, MON, 900, "middle")}
        {T(960, 590, "kazandı", 28, "#AAB2C0", 600, "middle")}
        {debt && <g opacity={rp(t, a + 1.6, a + 2.1)}><rect x={560} y={960} width={800} height={80} rx={10} fill="#07090E" opacity={0.9} />{T(960, 1016, "11. sefer: borç alıp gelir", 48, TRR, 900, "middle")}</g>}
      </HCam>
    </g>
  );
};

// Para nereye gider (anlatılanlara göre)
export const Split: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => {
  const k = rp(t, a + 0.4, a + 1.6);
  const parts: [string, number, string][] = [["vitrin + reklam", 0.2, AMB], ["eskilere 'kâr'", 0.5, MON], ["geri kalan: dışarı", 0.3, TRR]];
  let x = 260;
  return (
    <g>
      {bg()}
      <HCam t={t} a={a} b={b} z={[1.0, 1.04]}>
        {T(960, 300, "YATIRILAN HER 100 ₺", 52, "#FFF", 900, "middle")}
        {parts.map(([s, w, c], i) => {
          const W = 1400 * w * k, x0 = x; x += 1400 * w;
          return <g key={i}><rect x={x0} y={420} width={W} height={150} fill={c} opacity={0.85} />{k > 0.9 && T(x0 + 700 * w, 640, s, 30, c, 800, "middle")}</g>;
        })}
        {T(960, 900, "anlatılanlara göre", 28, "#7C8696", 600, "middle")}
      </HCam>
      {lbl(t, a, label)}
    </g>
  );
};
