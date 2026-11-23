import React from "react";
import { X, T, typed } from "./Protokol";
import { rp, lp, Person, Look, HCam, Laptop, BackView } from "./Hayat";
import { hash } from "./Motion";
import { KDefs, Label, Tag, Stamp } from "./Karun";

// Kanal 5 · Protokol X · k7-04 "Silk Road / Jimmy Zhong" kiti (2026-11-23)
// Göl evi baskını, patlamış mısır kutusu, betondaki kasa, karanlık pazar arayüzü, para çek açığı (5 tık = 5 kat),
// bankamatik benzetmesi, 9 hesap, blok zinciri izi, kütüphane yakalaması, 911 araması, sahte ziyaret, fiyat grafiği.
// Kimlik: zemin #07090E, yeşil terminal vurgusu (#38E07B) + kehribar. Flaş yok.

type P = { t: number; a: number; b: number };
export const GRN = "#38E07B", BTC = "#F7931A";
export const JIMMY: Look = { hairStyle: "short", hair: "#121212", glasses: true, kind: "shirt", top: "#2B3442", top2: "#1E2530", skin: "#E6C39A" };
export const JIMMY_K: Look = { hairStyle: "short", hair: "#121212", glasses: true, kind: "hoodie", top: "#3A4A5E", top2: "#2A3646", skin: "#E6C39A" };
export const ROSS: Look = { hairStyle: "curly", hair: "#6B4A2E", kind: "tshirt", top: "#4A5560", top2: "#38414A", beard: 0.3 };
export const AGENT: Look = { hairStyle: "buzz", hair: "#2A2420", kind: "jacket", top: "#1C2230", top2: "#121722", beard: 0.1 };
export const COP: Look = { hairStyle: "short", hair: "#3A2E26", kind: "uniform", top: "#26324A", top2: "#1A2336", mustache: true };
export const FRIEND: Look = { hairStyle: "fade", hair: "#2A1E16", kind: "hoodie", top: "#6A2E2E", top2: "#4E2020" };

const BtcGlyph: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 40, o = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <circle r={r} fill={BTC} />
    <circle r={r * 0.86} fill="none" stroke="#FFD08A" strokeWidth={r * 0.06} />
    {T(0, r * 0.38, "₿", r * 1.1, "#FFF", 800, "middle")}
  </g>
);
const fmtN = (n: number) => Math.round(n).toLocaleString("tr-TR");
const Rain: React.FC<{ t: number; n?: number; c?: string }> = ({ t, n = 26, c = GRN }) => (
  <g opacity={0.18}>{Array.from({ length: n }, (_, i) => {
    const x = hash(i + 4) * 1920, sp = 80 + hash(i) * 140, y = ((t * sp + hash(i + 9) * 1400) % 1400) - 200;
    return <g key={i}>{Array.from({ length: 8 }, (_, j) => T(x, y - j * 30, String.fromCharCode(48 + Math.floor(hash(i * 9 + j + Math.floor(t * 4)) * 42)), 24, c, 600, "middle", { opacity: 1 - j / 8 }))}</g>;
  })}</g>
);

// ───────── GÖL EVİ (dış) ─────────
export const LakeHouse: React.FC<P & { raid?: boolean; dawn?: boolean; label?: [string, string?] }> = ({ t, a, b, raid, dawn = true, label }) => {
  const walk = rp(t, a + 0.3, b);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 560]}>
        <rect width={1920} height={1080} fill={dawn ? "url(#kDusk)" : "url(#kNight)"} />
        {/* göl */}
        <rect x={0} y={700} width={1920} height={380} fill="#0E1A2C" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${(hash(i) * 1920 + t * 12) % 1920},${720 + hash(i + 5) * 340} l${60 + hash(i + 2) * 80},0`} stroke="#5A6E90" strokeWidth={2} opacity={0.35} />)}
        {/* ağaçlar */}
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 150 - 40},700 l70,-${180 + hash(i) * 120} l70,${180 + hash(i) * 120}Z`} fill="#0A1018" />)}
        {/* ev */}
        <g transform="translate(980,420)">
          <rect x={-300} y={0} width={600} height={290} fill="#1A202A" />
          <path d="M-340,0 L0,-170 L340,0Z" fill="#11161E" />
          {[-220, -80, 60, 200].map((x, i) => <rect key={i} x={x} y={70} width={90} height={110} fill={raid && i % 2 === 0 ? "#FFE2A0" : "#3A4252"} opacity={raid && i % 2 === 0 ? 0.6 + 0.2 * Math.sin(t * 3 + i) : 0.6} />)}
          <rect x={-40} y={170} width={80} height={120} fill="#0A0D12" />
          {/* iskele + tekne */}
          <rect x={300} y={270} width={360} height={16} fill="#3A2A1C" />
          <path d={`M560,${300 + Math.sin(t * 1.3) * 4} l120,0 l-20,30 l-90,0Z`} fill="#D8DDE4" />
        </g>
        {/* ajanlar */}
        {raid && [0, 1, 2, 3].map((i) => {
          const x = lp(-120 - i * 140, 560 + i * 110, walk);
          return (
            <g key={i} transform={`translate(${x},${640 + (i % 2) * 20})`}>
              <rect x={-24} y={-110} width={48} height={90} rx={10} fill="#0B0F16" />
              <circle cy={-130} r={22} fill="#0B0F16" />
              <rect x={-28} y={-96} width={56} height={22} fill="#C9A227" opacity={0.85} />
              {T(0, -80, "IRS-CI", 14, "#07090E", 800, "middle")}
              <rect x={-20} y={-20} width={14} height={60 + Math.sin(t * 8 + i) * 6} fill="#0B0F16" /><rect x={6} y={-20} width={14} height={60 - Math.sin(t * 8 + i) * 6} fill="#0B0F16" />
              <path d={`M24,-80 L${300},-${60 + i * 10} L${300},-${10 + i * 10}Z`} fill="#FFF4D0" opacity={0.08} />
            </g>
          );
        })}
        {raid && [0, 1].map((i) => {
          const x = lp(-200 - i * 200, 380 + i * 160, walk);
          return <g key={i} transform={`translate(${x},${700})`}><ellipse rx={50} ry={20} cy={-30} fill="#15110D" /><circle cx={48} cy={-46} r={16} fill="#15110D" /><path d="M54,-60 l10,-16 l4,18Z" fill="#15110D" />{[-30, -10, 14, 34].map((lx, j) => <rect key={j} x={lx} y={-16} width={8} height={26 + Math.sin(t * 12 + j + i) * 5} fill="#15110D" />)}</g>;
        })}
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── DOLAP + PATLAMIŞ MISIR KUTUSU ─────────
export const PopcornTin: React.FC<P & { open?: boolean; reveal?: boolean }> = ({ t, a, b, open, reveal }) => {
  const k = open ? rp(t, a + 0.6, a + 1.6) : 0;
  const g = reveal ? rp(t, a + 1.4, a + 2.4) : 0;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={open ? [1.0, 1.1] : [1.04, 1.12]} c0={[960, 560]} c1={[960, 520]}>
        <rect width={1920} height={1080} fill="#0C0E13" />
        <rect x={360} y={60} width={1200} height={980} fill="#171A21" stroke="#2A2F3A" strokeWidth={10} />
        {[300, 560, 820].map((y, i) => <rect key={i} x={370} y={y} width={1180} height={18} fill="#3A2E22" />)}
        {/* sıradan eşyalar */}
        {[[460, 300, 120, 140, "#5A3A3A"], [620, 300, 160, 90, "#3A4A5A"], [1240, 300, 200, 120, "#4A4A3A"], [470, 560, 260, 70, "#2E3A2E"], [1300, 560, 160, 180, "#4A3A5A"], [520, 820, 180, 120, "#3A3A3A"], [1250, 820, 240, 90, "#5A4A3A"]].map(([x, y, w, h, c], i) => <rect key={i} x={+x} y={+y - +h} width={+w} height={+h} rx={6} fill={String(c)} />)}
        {/* kutu */}
        <g transform="translate(960,560)">
          <ellipse cx={0} cy={0} rx={190} ry={30} fill="#000" opacity={0.4} />
          <rect x={-180} y={-330} width={360} height={330} rx={18} fill="#C8352E" />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-180 + i * 64} y={-330} width={30} height={330} fill="#F2E8D0" opacity={0.85} />)}
          <rect x={-120} y={-230} width={240} height={110} rx={10} fill="#F7D14A" />
          {T(0, -186, "POPCORN", 40, "#7A1E18", 800, "middle")}
          {T(0, -146, "temsili", 18, "#7A1E18", 600, "middle")}
          {/* kapak */}
          <g transform={`translate(0,${-330 - k * 120}) rotate(${-k * 25})`}>
            <ellipse rx={186} ry={26} fill="#B12A24" stroke="#7A1E18" strokeWidth={4} />
          </g>
          {/* içi: tek kartlı bilgisayar */}
          {k > 0.2 && (
            <g opacity={rp(k, 0.2, 0.6)} transform={`translate(0,${-360 - g * 50})`}>
              <rect x={-110} y={-70} width={220} height={140} rx={8} fill="#1F7A3A" stroke="#0E3A1A" strokeWidth={3} />
              <rect x={-70} y={-40} width={80} height={60} fill="#222" /><rect x={30} y={-50} width={60} height={30} fill="#BFC5CC" /><rect x={30} y={10} width={60} height={34} fill="#BFC5CC" />
              {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={-100 + i * 10} cy={-60} r={3} fill="#E8C060" />)}
              <circle cx={-90} cy={50} r={6} fill={GRN} opacity={0.5 + 0.5 * Math.sin(t * 6)} />
              <circle r={260} fill={GRN} opacity={0.08 * g} />
            </g>
          )}
        </g>
      </HCam>
      {reveal && g > 0.5 && (
        <g opacity={rp(t, a + 2.2, a + 2.8)}>
          <rect x={560} y={820} width={800} height={150} rx={12} fill="#05070C" opacity={0.9} />
          <BtcGlyph x={650} y={895} r={46} />
          {T(720, 880, `${fmtN(lp(0, 50676, rp(t, a + 2.2, a + 4)))} BTC`, 60, "#FFF", 800)}
          {T(720, 940, "≈ 3,36 MİLYAR DOLAR", 34, BTC, 700)}
        </g>
      )}
    </g>
  );
};

// ───────── BETONDAKİ KASA ─────────
export const FloorSafe: React.FC<P & { open?: boolean }> = ({ t, a, b, open }) => {
  const lift = rp(t, a + 0.5, a + 1.6), op = open ? rp(t, a + 1.8, a + 2.8) : 0;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.0, 1.15]}>
        <rect width={1920} height={1080} fill="#14161B" />
        {Array.from({ length: 8 * 5 }, (_, i) => {
          const c = i % 8, r = Math.floor(i / 8), x = 160 + c * 200, y = 80 + r * 200;
          const mid = c >= 3 && c <= 4 && r >= 1 && r <= 3;
          const dx = mid ? (c === 3 ? -1 : 1) * lift * 260 : 0;
          return <rect key={i} x={x + dx} y={y} width={196} height={196} fill="#B8B2A6" stroke="#8A857C" strokeWidth={4} opacity={mid ? 1 - lift * 0.3 : 1} />;
        })}
        {lift > 0.3 && (
          <g opacity={rp(lift, 0.3, 0.8)}>
            <rect x={760} y={280} width={400} height={600} fill="#5E5E5A" />
            {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={770 + hash(i) * 380} cy={290 + hash(i + 3) * 580} r={2 + hash(i + 7) * 4} fill="#3E3E3A" />)}
            <rect x={820} y={380} width={280} height={400} rx={10} fill="#2C3038" stroke="#15181C" strokeWidth={8} />
            <circle cx={960} cy={540} r={60} fill="#3A3F48" stroke="#15181C" strokeWidth={6} />
            <line x1={960} y1={540} x2={960 + Math.cos(t * 2) * 50} y2={540 + Math.sin(t * 2) * 50} stroke="#BFC5CC" strokeWidth={6} />
            {op > 0 && (
              <g opacity={op}>
                <rect x={830} y={390} width={260} height={380} fill="#0E1014" />
                {[0, 1, 2].map((i) => <rect key={i} x={850 + i * 80} y={420} width={70} height={40} rx={4} fill={i === 1 ? "#C9CDD3" : "url(#kGold)"} />)}
                {[0, 1, 2, 3].map((i) => <rect key={i} x={850} y={490 + i * 26} width={220} height={22} fill="#5E8C5A" stroke="#3E6A3A" />)}
                {[0, 1, 2].map((i) => <circle key={i} cx={880 + i * 80} cy={680} r={32} fill={i === 1 ? "#C9CDD3" : "url(#kGold)"} stroke="#6E4A14" strokeWidth={3} />)}
                {T(960, 750, "₿ ₿ ₿", 30, "#7A5418", 800, "middle")}
              </g>
            )}
          </g>
        )}
      </HCam>
      {open && (
        <g opacity={rp(t, a + 2.6, a + 3.2)}>
          <Tag x={1240} y={420} k={1} s="ALTIN · GÜMÜŞ KÜLÇE" c={X.amber} />
          <Tag x={1240} y={520} k={rp(t, a + 3, a + 3.4)} s="661.900 $ NAKİT" c={GRN} />
          <Tag x={1240} y={620} k={rp(t, a + 3.4, a + 3.8)} s="FİZİKSEL BITCOIN" c={BTC} />
        </g>
      )}
    </g>
  );
};

// ───────── BUZ DAĞI: görünen internet / karanlık ağ ─────────
export const Iceberg: React.FC<P & { deep?: boolean }> = ({ t, a, b, deep }) => {
  const d = deep ? rp(t, a + 0.4, a + 2.2) : 0;
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]} c1={[960, 540 + d * 220]}>
        <rect width={1920} height={1600} fill="#06101C" />
        <rect width={1920} height={420} fill="#1A2E4A" />
        <path d={`M0,420 ${Array.from({ length: 20 }, (_, i) => `L${i * 100 + 50},${420 + Math.sin(t * 2 + i) * 6}`).join(" ")} L1920,420`} stroke="#8FB4E0" strokeWidth={3} fill="none" />
        <path d="M820,420 L900,220 L960,180 L1030,250 L1100,420Z" fill="#E8F1FA" />
        <path d="M700,420 L1220,420 L1380,820 L1180,1280 L760,1300 L560,860Z" fill="#7FA4C8" opacity={0.55} />
        <Rain t={t} n={18} />
        <g opacity={rp(t, a + 0.3, a + 0.8)}>{T(1340, 300, "GÖRÜNEN İNTERNET", 40, "#FFF", 800)}{T(1340, 345, "Google · sosyal medya · haberler", 26, "#C8D6E6", 500)}</g>
        <g opacity={rp(t, a + 1.0, a + 1.6)}>{T(1440, 1000, "KARANLIK AĞ", 52, GRN, 800)}{T(1440, 1050, "arama motorları göremez", 26, "#8FA0B4", 500)}{T(1440, 1090, "özel tarayıcıyla girilir", 26, "#8FA0B4", 500)}</g>
      </HCam>
    </g>
  );
};

// ───────── KARANLIK PAZAR ARAYÜZÜ (temsili) ─────────
export const Market: React.FC<P & { stamps?: boolean; cart?: boolean; bounty?: boolean }> = ({ t, a, b, stamps, cart, bounty }) => {
  const cats = ["Kategoriler", "▸ ████████ (1.819)", "▸ █████ (417)", "▸ Sahte belgeler", "▸ ██████ (232)", "▸ Dijital ürünler", "▸ Hizmetler", "▸ ██████ (162)"];
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1.02, 1.1]} k={0.6}>
        <rect width={1920} height={1080} fill="#E9E6DC" />
        <rect width={1920} height={130} fill="#F4F1E8" />
        {/* deve simgesi (basit) */}
        <g transform="translate(110,95) scale(1.1)"><path d="M0,0 l10,-40 l14,0 l6,-22 l10,0 l-2,26 l30,-14 l26,14 l10,-12 l10,8 l-12,16 l0,30 l-8,0 l0,-20 l-40,0 l0,20 l-8,0 l0,-20 l-14,0 l0,20 l-8,0Z" fill="#2E6B2E" /></g>
        {T(220, 70, "Silk Road", 58, "#2E6B2E", 800)}
        {T(222, 108, "anonymous marketplace · temsili çizim", 24, "#5E7A5E", 600)}
        <rect x={60} y={170} width={420} height={860} fill="#F7F5EE" stroke="#CFC9B8" strokeWidth={2} />
        {cats.map((c, i) => T(90, 230 + i * 62, c, i === 0 ? 34 : 28, i === 0 ? "#2E6B2E" : "#333", i === 0 ? 800 : 600))}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 540 + (i % 3) * 440, y = 190 + Math.floor(i / 3) * 420;
          return (
            <g key={i} opacity={rp(t, a + 0.2 + i * 0.12, a + 0.5 + i * 0.12)}>
              <rect x={x} y={y} width={400} height={380} fill="#FFF" stroke="#CFC9B8" strokeWidth={2} />
              <rect x={x + 20} y={y + 20} width={360} height={230} fill={["#7A8A9A", "#9A7A6A", "#6A8A6A", "#8A7A9A", "#9A9A6A", "#6A7A8A"][i]} opacity={0.5} filter="url(#kBlur)" />
              {T(x + 20, y + 300, "████ ██████", 28, "#333", 700)}
              {T(x + 20, y + 350, `₿${(hash(i + 3) * 3).toFixed(2)}`, 30, "#2E6B2E", 800)}
              {stamps && <g opacity={rp(t, a + 1 + i * 0.25, a + 1.2 + i * 0.25)}><circle cx={x + 200} cy={y + 135} r={80} fill="none" stroke={X.red} strokeWidth={16} /><line x1={x + 143} y1={y + 78} x2={x + 257} y2={y + 192} stroke={X.red} strokeWidth={16} /></g>}
            </g>
          );
        })}
        {cart && <g opacity={rp(t, a + 0.6, a + 1)} transform={`translate(${lp(1500, 1180, rp(t, a + 0.6, a + 1.6))},${lp(900, 360, rp(t, a + 0.6, a + 1.6))})`}><path d="M0,0 l-10,30 l14,-8 l10,22 l8,-4 l-10,-22 l16,-2Z" fill="#111" stroke="#FFF" strokeWidth={2} /></g>}
      </HCam>
      {bounty && (
        <g opacity={rp(t, a + 0.5, a + 1)}>
          <rect x={500} y={330} width={920} height={420} rx={14} fill="#0B0F16" stroke={X.amber} strokeWidth={6} />
          {T(960, 430, "DUYURU", 40, X.amber, 800, "middle", { letterSpacing: 6 })}
          {T(960, 520, "Sitede açık bulana", 50, "#FFF", 700, "middle")}
          {T(960, 590, "ÖDÜL", 70, GRN, 800, "middle")}
          {T(960, 700, "anlatılanlara göre · temsili", 26, X.dim, 600, "middle")}
        </g>
      )}
    </g>
  );
};

// ───────── GİZLİ TÜNEL (anonimlik): sen → 3 düğüm → site ─────────
export const Tunnel: React.FC<P> = ({ t, a, b }) => {
  const nodes = [[260, 540], [700, 360], [1140, 700], [1620, 520]];
  const k = rp(t, a + 0.3, b - 0.4);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <Rain t={t} n={16} />
      {nodes.slice(0, -1).map((n, i) => <line key={i} x1={n[0]} y1={n[1]} x2={nodes[i + 1][0]} y2={nodes[i + 1][1]} stroke={GRN} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-t * 60} opacity={rp(k, i / 3, (i + 1) / 3)} />)}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n[0]},${n[1]})`} opacity={rp(k, i / 4 - 0.1, i / 4 + 0.1)}>
          <circle r={i === 0 || i === 3 ? 70 : 52} fill="#0F1A14" stroke={GRN} strokeWidth={5} />
          {[0, 1, 2].map((j) => i > 0 && i < 3 && <circle key={j} r={22 + j * 10} fill="none" stroke={GRN} strokeWidth={2} opacity={0.5} />)}
          {T(0, i === 0 || i === 3 ? 120 : 100, ["SEN", "DÜĞÜM 1", "DÜĞÜM 2", "SİTE"][i], 30, "#FFF", 700, "middle")}
          {i === 0 && T(0, 14, "?", 60, GRN, 800, "middle")}
          {i === 3 && T(0, 14, "₿", 60, BTC, 800, "middle")}
        </g>
      ))}
      <g opacity={rp(t, a + 1.6, a + 2.2)}>{T(960, 960, "Gerçek isim yok · gerçek adres yok · iz yok", 40, X.amber, 700, "middle")}</g>
    </g>
  );
};

// ───────── ÜÇ DÜĞME: YATIR · HARCA · ÇEK ─────────
export const ThreeButtons: React.FC<P & { hi?: number }> = ({ t, a, hi = -1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0D12" />
    {["YATIR", "HARCA", "ÇEK"].map((s, i) => {
      const k = rp(t, a + 0.2 + i * 0.35, a + 0.6 + i * 0.35), on = hi < 0 || hi === i;
      const pulse = hi === i ? 1 + 0.04 * Math.sin(t * 6) : 1;
      return (
        <g key={i} opacity={k * (on ? 1 : 0.25)} transform={`translate(${380 + i * 580},540) scale(${pulse})`}>
          <rect x={-220} y={-110} width={440} height={220} rx={110} fill={i === 2 ? "#123A22" : "#18202C"} stroke={hi === i ? GRN : "#3A4658"} strokeWidth={hi === i ? 10 : 5} />
          {T(0, 26, s, 76, hi === i ? GRN : "#E8EDF2", 800, "middle")}
        </g>
      );
    })}
    {hi === 2 && <g opacity={rp(t, a + 1.4, a + 2)}>{T(1540, 780, "bütün hikâye burada", 34, X.amber, 700, "middle")}<path d="M1540,740 L1540,680" stroke={X.amber} strokeWidth={5} markerEnd="" /></g>}
  </g>
);

// ───────── PARA ÇEK AÇIĞI ─────────
// mode "normal": bak → gönder → düş. mode "bug": düşmeden önce tekrar tekrar basılıyor.
export const Withdraw: React.FC<P & { mode?: "normal" | "bug"; n?: number; dep?: number; showTotal?: boolean }> = ({ t, a, b, mode = "bug", n = 5, dep = 500, showTotal = true }) => {
  const dur = Math.max(2, b - a - 1.5);
  const clicks = mode === "bug" ? Math.min(n, Math.floor(rp(t, a + 0.8, a + 0.8 + dur * 0.7) * n + (t > a + 0.8 ? 1 : 0))) : t > a + 1 ? 1 : 0;
  const deducted = mode === "normal" ? t > a + 2.6 : t > a + 0.8 + dur * 0.8;
  const out = clicks * dep;
  const bal = deducted ? 0 : dep;
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      {/* hesap paneli */}
      <rect x={140} y={170} width={760} height={560} rx={20} fill="#0F141C" stroke="#263244" strokeWidth={4} />
      {T(190, 250, "HESAP · Silk Road cüzdanı", 34, X.dim, 700)}
      {T(190, 380, `${bal} BTC`, 110, deducted ? X.red : "#FFF", 800)}
      {T(190, 440, deducted ? "bakiye düşüldü" : "bakiye (henüz düşülmedi)", 30, deducted ? X.red : X.amber, 600)}
      {/* düğme */}
      <g transform={`translate(520,620) scale(${1 - 0.06 * Math.max(0, Math.sin((t - a) * 14)) * (mode === "bug" && !deducted ? 1 : 0)})`}>
        <rect x={-260} y={-60} width={520} height={120} rx={60} fill="#123A22" stroke={GRN} strokeWidth={6} />
        {T(0, 22, "PARA ÇEK", 56, GRN, 800, "middle")}
      </g>
      {/* tık sayacı */}
      {T(520, 790, mode === "bug" ? `tık × ${clicks}` : "tık × 1", 44, X.amber, 800, "middle")}
      {/* zaman çizgisi */}
      <g transform="translate(140,880)">
        <rect width={760} height={10} rx={5} fill="#263244" />
        <rect width={760 * rp(t, a + 0.4, a + 0.8 + dur * 0.85)} height={10} rx={5} fill={X.amber} />
        {T(0, 60, "bakiye kontrolü", 24, X.dim, 600)}{T(760, 60, "hesaptan düş", 24, X.dim, 600, "end")}
        {mode === "bug" && T(380, -26, "bu boşlukta tekrar basılırsa?", 26, X.amber, 700, "middle")}
      </g>
      {/* çıkan para */}
      <rect x={1020} y={170} width={760} height={760} rx={20} fill="#0F141C" stroke="#263244" strokeWidth={4} />
      {T(1070, 250, "DIŞARI ÇIKAN", 34, X.dim, 700)}
      {Array.from({ length: clicks }, (_, i) => <BtcGlyph key={i} x={1150 + (i % 5) * 130} y={360 + Math.floor(i / 5) * 120} r={50} o={rp(t, a + 0.8 + i * 0.3, a + 1.1 + i * 0.3)} />)}
      {showTotal && T(1400, 860, `${fmtN(out)} BTC`, 96, mode === "bug" && clicks > 1 ? GRN : "#FFF", 800, "middle")}
    </g>
  );
};

// ───────── BANKAMATİK benzetmesi ─────────
export const Atm: React.FC<P & { n?: number }> = ({ t, a, b, n = 5 }) => {
  const step = Math.max(0.5, (b - a - 1.2) / n);
  const c = Math.min(n, Math.max(0, Math.floor((t - a - 0.6) / step) + 1));
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
        <rect width={1920} height={1080} fill="#10141B" />
        <rect x={560} y={90} width={800} height={960} rx={30} fill="#2A3240" />
        <rect x={640} y={170} width={640} height={380} rx={10} fill="#0C1A24" />
        {T(960, 280, "BANKAMATİK", 46, "#8FD0FF", 800, "middle")}
        {T(960, 380, "100 TL", 90, "#FFF", 800, "middle")}
        {T(960, 470, c > 0 ? `verilen: ${c * 100} TL` : "işlem bekleniyor", 40, c > 1 ? GRN : X.dim, 700, "middle")}
        {[0, 1, 2].map((r) => [0, 1, 2].map((cc) => <rect key={`${r}${cc}`} x={700 + cc * 120} y={600 + r * 90} width={100} height={70} rx={8} fill="#3A4454" />))}
        <rect x={1100} y={620} width={140} height={230} rx={10} fill={GRN} opacity={0.25 + 0.25 * Math.sin(t * 8)} />
        {T(1170, 750, "ÇEK", 34, "#FFF", 800, "middle")}
        <rect x={700} y={900} width={520} height={30} rx={8} fill="#0A0D12" />
        {Array.from({ length: c }, (_, i) => <g key={i} transform={`translate(${960 + (i - 2) * 14},${930 + rp(t, a + 0.6 + i * step, a + 0.9 + i * step) * 70}) rotate(${(i - 2) * 4})`}><rect x={-140} y={0} width={280} height={120} rx={6} fill="#6FA86A" stroke="#3E6A3A" strokeWidth={3} />{T(0, 74, "100", 50, "#244A22", 800, "middle")}</g>)}
      </HCam>
      <g opacity={rp(t, a + 0.4, a + 0.8)}>{T(80, 120, "benzetme", 30, X.dim, 600)}</g>
    </g>
  );
};

// ───────── 9 SAHTE HESAP ─────────
export const Accounts: React.FC<P & { n?: number; flow?: boolean }> = ({ t, a, n = 9, flow }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <Rain t={t} n={12} />
    {Array.from({ length: n }, (_, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = 360 + c * 420, y = 170 + r * 270, k = rp(t, a + 0.15 * i, a + 0.15 * i + 0.4);
      return (
        <g key={i} opacity={k} transform={`translate(${x},${y + (1 - k) * 20})`}>
          <rect width={360} height={210} rx={14} fill="#0F141C" stroke={flow && Math.sin(t * 5 + i) > 0.6 ? GRN : "#2A3646"} strokeWidth={4} />
          <circle cx={60} cy={70} r={34} fill="#1E2836" />{T(60, 84, "?", 40, X.dim, 800, "middle")}
          {T(110, 70, `hesap_${String(i + 1).padStart(2, "0")}`, 30, "#E8EDF2", 700)}
          {T(110, 110, "sahte isim", 22, X.dim, 600)}
          {flow && T(30, 180, `↑ ${fmtN(200 + hash(i) * 300)} BTC`, 32, GRN, 800)}
        </g>
      );
    })}
    {T(960, 1010, "Mahkeme kayıtları: 9 hesap · 140+ işlem", 34, X.amber, 700, "middle")}
  </g>
);

// ───────── BLOK ZİNCİRİ DEFTERİ + geriye iz sürme ─────────
export const Ledger: React.FC<P & { trace?: boolean; labels?: [string, string] }> = ({ t, a, b, trace, labels = ["2012 · SILK ROAD", "2019 · BORSA · GERÇEK İSİM"] }) => {
  const N = 9, k = trace ? rp(t, a + 0.8, b - 0.6) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      {Array.from({ length: N }, (_, i) => {
        const x = 120 + i * 200, y = 540 + Math.sin(i * 1.3) * 60;
        const lit = trace && (N - 1 - i) / (N - 1) <= k;
        return (
          <g key={i}>
            {i < N - 1 && <line x1={x + 140} y1={y} x2={x + 200} y2={540 + Math.sin((i + 1) * 1.3) * 60} stroke={lit ? GRN : "#2A3646"} strokeWidth={6} />}
            <rect x={x} y={y - 70} width={140} height={140} rx={12} fill="#0F141C" stroke={lit ? GRN : "#2A3646"} strokeWidth={lit ? 6 : 3} />
            {[0, 1, 2, 3].map((j) => <rect key={j} x={x + 20} y={y - 46 + j * 26} width={100 - hash(i * 4 + j) * 40} height={12} rx={4} fill={lit ? GRN : "#334055"} opacity={0.7} />)}
          </g>
        );
      })}
      {T(960, 170, "HERKESE AÇIK DEFTER", 56, "#FFF", 800, "middle")}
      {T(960, 230, "isim yok · ama her işlem yazılı", 32, X.dim, 600, "middle")}
      <g opacity={rp(t, a + 0.4, a + 0.8)}>{T(190, 760, labels[0], 30, BTC, 800, "middle")}</g>
      <g opacity={rp(t, a + 0.4, a + 0.8)}>{T(1730, 760, labels[1], 30, trace ? GRN : X.amber, 800, "middle")}</g>
      {trace && <g opacity={rp(t, b - 1, b - 0.5)}>{T(960, 940, "← iz geriye doğru sürülüyor", 38, GRN, 700, "middle")}</g>}
    </g>
  );
};

// ───────── YALNIZ ÇOCUK + bilgisayar ─────────
export const LonelyKid: React.FC<P & { school?: boolean }> = ({ t, a, b, school }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.04, 1.14]}>
      <rect width={1920} height={1080} fill={school ? "#1C2230" : "#0B0E14"} />
      {school ? (
        <g>
          <rect x={0} y={760} width={1920} height={320} fill="#2A2E36" />
          {[0, 1, 2, 3].map((i) => <Person key={i} x={1100 + i * 190} y={820} s={0.8} t={t + i} o={{ hairStyle: (["fade", "curly", "short", "buzz"] as const)[i], kind: "tshirt", top: ["#5A3A3A", "#3A4A5A", "#4A5A3A", "#5A4A3A"][i] }} mouth="smile" look={-1} arms={i === 1 ? "wave" : "down"} lit={0.5} />)}
          <Person x={520} y={840} s={0.8} t={t} o={JIMMY_K} mouth="flat" brow="worry" look={0.6} slump={0.4} />
          <circle cx={520} cy={560} r={300} fill="#000" opacity={0.25} />
        </g>
      ) : (
        <g>
          <circle cx={960} cy={420} r={600} fill="#3A6AA0" opacity={0.08 + 0.02 * Math.sin(t * 3)} />
          <rect x={560} y={760} width={800} height={30} fill="#3A2E22" />
          <rect x={700} y={420} width={520} height={330} rx={10} fill="#1A1C20" /><rect x={720} y={440} width={480} height={290} fill="#0C2A3E" />
          {Array.from({ length: 7 }, (_, i) => <rect key={i} x={740} y={460 + i * 38} width={typed("████████████████████", rp(t, a + i * 0.4, a + i * 0.4 + 1)).length * 21} height={16} fill={GRN} opacity={0.6} />)}
          <BackView x={960} y={1060} s={1.1} t={t} o={JIMMY_K} type />
        </g>
      )}
    </HCam>
  </g>
);

// ───────── KÜTÜPHANE · 1 Ekim 2013 ─────────
export const Library: React.FC<P & { grab?: boolean }> = ({ t, a, b, grab }) => {
  const g = grab ? rp(t, a + 1.2, a + 1.8) : 0;
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 560]}>
        <rect width={1920} height={1080} fill="#2A241E" />
        {Array.from({ length: 5 }, (_, s) => (
          <g key={s} transform={`translate(${s * 400 - 40},80)`}>
            <rect width={360} height={700} fill="#3E2E20" />
            {Array.from({ length: 6 }, (_, r) => <g key={r}>{Array.from({ length: 12 }, (_, c) => <rect key={c} x={10 + c * 28} y={20 + r * 112} width={24} height={86 - hash(s * 99 + r * 12 + c) * 30} fill={["#7A3A2A", "#2A4A6A", "#5A6A3A", "#8A7A4A", "#4A3A5A"][Math.floor(hash(s + r * 7 + c * 3) * 5)]} />)}<rect y={110 + r * 112} width={360} height={10} fill="#2A1E14" /></g>)}
          </g>
        ))}
        <rect x={0} y={780} width={1920} height={300} fill="#5A4632" />
        <rect x={700} y={760} width={620} height={30} fill="#3A2A1C" />
        <Person x={900} y={900} s={0.9} t={t} o={ROSS} look={grab ? 1 : 0.2} eyes={grab ? "wide" : "open"} />
        <Laptop x={1080} y={700 - g * 0} s={0.14} on={1}><rect width={1000} height={625} fill="#0A1A10" />{T(40, 80, "Silk Road · admin", 60, GRN, 800)}</Laptop>
        {[0, 1].map((i) => <Person key={i} x={lp(1500 + i * 150, 1240 + i * 120, g)} y={900} s={0.9} t={t + i * 2} o={i ? { hairStyle: "bun", kind: "cardigan", top: "#6A4A5A", top2: "#4A3A44" } : AGENT} talk={!grab} mouth={grab ? "flat" : "open"} look={-1} />)}
      </HCam>
      {grab && <Stamp x={1400} y={300} t={t} at={a + 1.8} s="FBI" />}
    </g>
  );
};

// ───────── KIRIK CAM + 911 ─────────
export const BrokenWindow: React.FC<P & { call?: boolean }> = ({ t, a, b, call }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.0, 1.12]}>
      <rect width={1920} height={1080} fill="url(#kNight)" />
      <rect x={460} y={150} width={1000} height={760} fill="#1A202A" stroke="#3A3226" strokeWidth={30} />
      <rect x={490} y={180} width={940} height={700} fill="#0A1220" />
      {Array.from({ length: 14 }, (_, i) => { const ang = (i / 14) * Math.PI * 2; return <line key={i} x1={960} y1={520} x2={960 + Math.cos(ang) * (300 + hash(i) * 200)} y2={520 + Math.sin(ang) * (250 + hash(i + 3) * 120)} stroke="#C8D6E6" strokeWidth={3} opacity={0.7} />; })}
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={960} cy={520} r={40 + i * 50} fill="none" stroke="#C8D6E6" strokeWidth={2} opacity={0.25} strokeDasharray="30 40" />)}
      <path d="M900,460 L1010,470 L1040,560 L930,590 L880,520Z" fill="#000" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${600 + hash(i) * 720},${940 + hash(i + 2) * 80} l${10 + hash(i + 4) * 20},${-8 + hash(i + 6) * 16} l${-6},10Z`} fill="#C8D6E6" opacity={0.6} />)}
    </HCam>
    {call && (
      <g opacity={rp(t, a + 0.5, a + 1)} transform="translate(1460,560)">
        <rect x={-170} y={-330} width={340} height={660} rx={40} fill="#111" stroke="#333" strokeWidth={6} />
        <rect x={-150} y={-300} width={300} height={600} rx={24} fill="#0E1E14" />
        {T(0, -180, "aranıyor…", 30, X.dim, 600, "middle")}
        {T(0, -90, "911", 110, "#FFF", 800, "middle")}
        <circle cx={0} cy={190} r={50} fill={X.red} opacity={0.7 + 0.3 * Math.sin(t * 6)} />
        {T(0, 290, "13 Mart 2019 · Athens", 22, X.dim, 600, "middle")}
      </g>
    )}
  </g>
);

// ───────── SAHTE ZİYARET: ajanlar Jimmy'nin koltuğunda ─────────
export const Visit: React.FC<P & { screen?: boolean }> = ({ t, a, b, screen }) => {
  const s = screen ? rp(t, a + 1, a + 2) : 0;
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 560]} c1={screen ? [1000, 520] : [960, 560]}>
        <rect width={1920} height={1080} fill="#2E2A26" />
        <rect x={0} y={760} width={1920} height={320} fill="#4A3E32" />
        <rect x={1300} y={160} width={480} height={360} fill="#9AB8D0" opacity={0.4} />
        <rect x={180} y={640} width={700} height={180} rx={30} fill="#5A4A3E" />
        <Person x={330} y={830} s={0.85} t={t} o={AGENT} look={0.5} />
        <Person x={600} y={830} s={0.85} t={t + 3} o={COP} look={0.5} />
        <Person x={1480} y={850} s={0.85} t={t + 5} o={{ hairStyle: "fade", kind: "shirt", top: "#3A4A3A", top2: "#2A362A", beard: 0.5 }} look={-0.6} />
        <Person x={1120} y={850} s={0.85} t={t + 1} o={JIMMY} talk mouth="smile" look={-0.6} />
        <Laptop x={1010} y={640} s={0.16} on={1}>
          <rect width={1000} height={625} fill="#0C1118" />
          {T(500, 300, "₿", 200, BTC, 800, "middle")}
        </Laptop>
      </HCam>
      {screen && (
        <g opacity={s}>
          <rect x={560} y={200} width={800} height={340} rx={16} fill="#0C1118" stroke={BTC} strokeWidth={6} />
          {T(960, 300, "EKRANDA", 34, X.dim, 700, "middle")}
          {T(960, 420, "60–70 MİLYON $", 90, BTC, 800, "middle")}
          {T(960, 490, "Bitcoin", 32, "#FFF", 600, "middle")}
        </g>
      )}
      <g><circle cx={110} cy={110} r={16} fill={X.red} opacity={0.5 + 0.5 * Math.sin(t * 5)} />{T(140, 122, "KAYIT", 32, "#FFF", 800)}</g>
    </g>
  );
};

// ───────── fare oynatıcı (ekran kilitlenmesin) ─────────
export const Jiggler: React.FC<P> = ({ t, a, b }) => {
  const mx = Math.sin(t * 6) * 40, my = Math.cos(t * 4) * 20;
  return (
    <g>
      <HCam t={t} a={a} b={b} z={[1.04, 1.14]}>
        <rect width={1920} height={1080} fill="#14171C" />
        <Laptop x={960} y={470} s={0.9} on={1}>
          <rect width={1000} height={625} fill="#10161E" />
          <path d={`M${500 + mx},${300 + my} l0,40 l10,-10 l8,18 l6,-3 l-8,-18 l14,0Z`} fill="#FFF" />
          {T(500, 560, "ekran açık", 34, GRN, 700, "middle")}
        </Laptop>
        <rect x={1280} y={860} width={120} height={60} rx={10} fill="#2A2E36" stroke={GRN} strokeWidth={3} />
        <circle cx={1300} cy={890} r={6} fill={GRN} opacity={0.5 + 0.5 * Math.sin(t * 9)} />
      </HCam>
    </g>
  );
};

// ───────── BITCOIN FİYATI ─────────
const PTS: [number, number, string][] = [[2012, 12, "12 $"], [2013, 800, ""], [2015, 300, ""], [2017, 19500, "≈ 20.000 $"], [2018, 3500, ""], [2019, 7000, ""], [2020, 9000, ""], [2021, 65000, "≈ 65.000 $"]];
export const PriceUp: React.FC<P & { upto?: number }> = ({ t, a, b, upto = 2021 }) => {
  const pts = PTS.filter((p) => p[0] <= upto);
  const k = rp(t, a + 0.3, b - 0.4);
  const X0 = 200, X1 = 1720, Y0 = 900, Y1 = 180;
  const xy = (p: [number, number, string]) => [X0 + ((p[0] - 2012) / 9) * (X1 - X0), Y0 - (Math.log10(p[1]) / Math.log10(70000)) * (Y0 - Y1)];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${xy(p)[0]},${xy(p)[1]}`).join(" ");
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      {[2012, 2015, 2018, 2021].map((y) => <g key={y}>{T(X0 + ((y - 2012) / 9) * (X1 - X0), 960, String(y), 30, X.dim, 600, "middle")}</g>)}
      <path d={d} fill="none" stroke={BTC} strokeWidth={8} strokeDasharray={4000} strokeDashoffset={4000 * (1 - k)} strokeLinejoin="round" />
      {pts.map((p, i) => p[2] && <g key={i} opacity={rp(k, i / pts.length, i / pts.length + 0.15)}><circle cx={xy(p)[0]} cy={xy(p)[1]} r={14} fill={BTC} />{T(xy(p)[0], xy(p)[1] - 34, p[2], 40, "#FFF", 800, "middle")}</g>)}
      {T(200, 120, "1 BITCOIN", 40, BTC, 800)}
    </g>
  );
};

// ───────── ÖZEL JET + lüks kartları ─────────
export const Jet: React.FC<P> = ({ t, a, b }) => {
  const k = rp(t, a, b);
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="url(#kDusk)" />
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={(hash(i) * 2400 - t * 60 * (1 + hash(i + 2))) % 2400} cy={200 + hash(i + 4) * 500} rx={180} ry={30} fill="#FFF" opacity={0.08} />)}
      <g transform={`translate(${lp(-300, 2100, k)},${lp(700, 300, k)}) rotate(-12)`}>
        <path d="M-260,0 C-200,-40 200,-40 280,0 C200,30 -200,30 -260,0Z" fill="#E8ECF0" />
        <path d="M-40,0 L-140,-150 L-90,-150 L60,0Z" fill="#C8CED6" /><path d="M-40,10 L-120,120 L-80,120 L40,10Z" fill="#B8BEC6" />
        <path d="M-240,-6 L-300,-90 L-260,-90 L-200,-10Z" fill="#C8CED6" />
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-100 + i * 50} cy={-6} r={7} fill="#2A3A4A" />)}
      </g>
      <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a="2018 · kiralık özel jet" b="Rose Bowl maçına · arkadaşlarıyla" />
    </g>
  );
};
export const LifeCards: React.FC<P & { items: [string, string][] }> = ({ t, a, items }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    {items.map(([h, s], i) => {
      const k = rp(t, a + 0.2 + i * 0.5, a + 0.6 + i * 0.5);
      const x = 160 + (i % 4) * 410, y = 300 + Math.floor(i / 4) * 330;
      return (
        <g key={i} opacity={k} transform={`translate(${x},${y + (1 - k) * 26})`}>
          <rect width={370} height={280} rx={16} fill="#0F141C" stroke={X.amber} strokeWidth={3} />
          {T(185, 130, h, 46, X.amber, 800, "middle")}
          {T(185, 200, s, 26, "#C8D0DA", 600, "middle")}
        </g>
      );
    })}
  </g>
);

// ───────── KORKUNÇ KORSAN ROBERTS (maske simgesi) ─────────
export const Pirate: React.FC<P> = ({ t, a, b }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <Rain t={t} n={20} />
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
      <g transform="translate(960,480)">
        <path d="M-200,-60 C-200,-260 200,-260 200,-60 L200,120 C200,260 -200,260 -200,120Z" fill="#0F141C" stroke={GRN} strokeWidth={6} />
        <path d="M-150,-20 L-40,-20 L-60,40 L-140,40Z" fill={GRN} opacity={0.7 + 0.3 * Math.sin(t * 3)} />
        <path d="M150,-20 L40,-20 L60,40 L140,40Z" fill={GRN} opacity={0.7 + 0.3 * Math.sin(t * 3)} />
        <path d="M-260,-110 L260,-110 L180,-220 L-180,-220Z" fill="#0F141C" stroke={GRN} strokeWidth={5} />
        {T(0, 160, "?", 120, GRN, 800, "middle")}
      </g>
    </HCam>
    <g opacity={rp(t, a + 0.5, a + 1)}>{T(960, 900, "«Dread Pirate Roberts»", 60, "#FFF", 800, "middle")}{T(960, 960, "Korkunç Korsan Roberts · sitenin sahibinin takma adı", 30, X.dim, 600, "middle")}</g>
  </g>
);

// ───────── ÖZEL DEDEKTİF panosu ─────────
export const PIBoard: React.FC<P> = ({ t, a, b }) => (
  <g>
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
      <rect width={1920} height={1080} fill="#3A2E22" />
      <rect x={200} y={120} width={1520} height={840} fill="#B8946A" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={220 + hash(i) * 1480} cy={140 + hash(i + 5) * 800} r={3} fill="#7A5A3A" />)}
      {[[420, 360, "JİMMY", "ev sahibi"], [960, 300, "KASA", "boşaltıldı"], [1480, 380, "ARKADAŞ?", "şüpheli"], [960, 720, "150 BTC?", "dedektifin tahmini"]].map(([x, y, h, s], i) => (
        <g key={i} opacity={rp(t, a + 0.3 + i * 0.4, a + 0.6 + i * 0.4)} transform={`translate(${x},${y}) rotate(${(hash(i) - 0.5) * 8})`}>
          <rect x={-170} y={-110} width={340} height={220} fill="#F2EDE2" />
          {T(0, -10, String(h), 46, i === 2 ? X.red : "#1A1A1A", 800, "middle")}{T(0, 50, String(s), 26, "#555", 600, "middle")}
          <circle cy={-100} r={12} fill={X.red} />
        </g>
      ))}
      <path d="M420,260 L960,200 L1480,280 M960,200 L960,620" stroke={X.red} strokeWidth={4} fill="none" strokeDasharray={1600} strokeDashoffset={1600 * (1 - rp(t, a + 1.6, a + 2.6))} />
    </HCam>
    <Label x={80} y={1000} k={rp(t, a + 0.4, a + 0.9)} a="Özel dedektif · Robin Martinelli" b="temsili çizim" />
  </g>
);

// ───────── SON SORU ─────────
export const PxQuestion: React.FC<P & { q: string; opts: string[] }> = ({ t, a, q, opts }) => (
  <g>
    <rect width={1920} height={1080} fill="#08090D" />
    {T(960, 230, q, 58, "#FFF", 800, "middle")}
    {opts.map((o, i) => {
      const k = rp(t, a + 1 + i * 1.2, a + 1.5 + i * 1.2);
      return <g key={i} opacity={k} transform={`translate(460,${360 + i * 190 + (1 - k) * 20})`}>
        <rect width={1000} height={140} rx={12} fill="#0F131B" stroke="#2A3240" strokeWidth={3} />
        <circle cx={80} cy={70} r={40} fill={i ? X.red : GRN} />{T(80, 86, String.fromCharCode(65 + i), 42, "#07090E", 800, "middle")}
        {T(150, 88, o, 46, "#EDEFF2", 700)}
      </g>;
    })}
    <g opacity={rp(t, a + 4, a + 4.6)}>{T(960, 900, "Cevabını yorumlara yaz", 38, X.amber, 700, "middle")}</g>
  </g>
);
