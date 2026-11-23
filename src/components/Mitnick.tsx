import React from "react";
import { X, T, typed } from "./Protokol";
import { rp, lp, Person, Look, HCam, BackView } from "./Hayat";
import { hash } from "./Motion";
import { KDefs, Label, Stamp } from "./Karun";

// Kanal 5 · Protokol X · k7-05 "Kevin Mitnick" kiti (2026-11-23)
// Donut kutusu motifi, buzdolabı baskını, sihirbaz kartları, otobüs bileti, yeşil terminal (siluet + kod adı),
// bölünmüş ekran telefon araması (sosyal mühendislik), telefon şebekesi, tek kişilik hücre, ıslık/füze,
// dinlenen hatlar, ABD haritası (kaçış), güven taklidi, iz zinciri, telsiz yön bulma arabası, 202 numaralı kapı,
// yüz yüze, gazete, "Kevin'i serbest bırakın", sahne, senato, Türkiye'deki telefon dolandırıcılığı uyarısı.
// Kimlik: zemin #07090E, terminal yeşili + donut pembesi + FBI sarısı. Flaş yok.

type P = { t: number; a: number; b: number };
export const GRN = "#38E07B", PINK = "#FF7EB6", FBI = "#F2C230", COLD = "#46D7FF";
export const KEVIN: Look = { hairStyle: "short", hair: "#2A1E16", glasses: true, kind: "shirt", top: "#3A4656", top2: "#2A3442", skin: "#EAC7A2" };
export const KEVIN_K: Look = { hairStyle: "short", hair: "#2A1E16", kind: "tshirt", top: "#B5643A", top2: "#8E4C2A", skin: "#EAC7A2" };
export const KEVIN_F: Look = { hairStyle: "short", hair: "#2A1E16", glasses: true, kind: "hoodie", top: "#2E3440", top2: "#1F242E", skin: "#EAC7A2", beard: 0.35 };
export const SHIMO: Look = { hairStyle: "curly", hair: "#111", glasses: true, kind: "jacket", top: "#2C3A30", top2: "#1E2A22", skin: "#E2BE95" };
export const LEWIS: Look = { hairStyle: "fade", hair: "#3A2A1E", kind: "jacket", top: "#5A4A3A", top2: "#46392C", beard: 0.5 };
export const DICICCO: Look = { hairStyle: "curly", hair: "#3A2A1E", kind: "sweater", top: "#4A5A3A", top2: "#38452B" };
export const ERIC: Look = { hairStyle: "buzz", hair: "#1A1A1A", kind: "hoodie", top: "#1E1E24", top2: "#141418" };
export const BONNIE: Look = { hairStyle: "bun", hair: "#6A3A22", kind: "cardigan", top: "#8A4A5A", top2: "#6E3A48", skin: "#F0CDAE" };
export const GRANDPA: Look = { hairStyle: "bald", hair: "#BBB", kind: "jacket", top: "#2A2A2A", top2: "#1C1C1C", mustache: true };
export const AGENT: Look = { hairStyle: "buzz", hair: "#2A2420", kind: "jacket", top: "#1C2230", top2: "#121722", beard: 0.1 };
export const DRIVER: Look = { hairStyle: "short", hair: "#3A2E26", kind: "uniform", top: "#2E4A6A", top2: "#22384E", mustache: true };
export const CLERK: Look = { hairStyle: "bun", hair: "#4A2E1E", kind: "shirt", top: "#C8CED6", top2: "#A8B0BA", skin: "#E8C2A0" };

// ───────── küçük parçalar ─────────
export const Donut: React.FC<{ x: number; y: number; r?: number; c?: string; seed?: number }> = ({ x, y, r = 50, c = PINK, seed = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#D9A15E" />
    <circle r={r * 0.9} fill={c} />
    <circle r={r * 0.32} fill="#3A2412" />
    {Array.from({ length: 9 }, (_, i) => {
      const an = hash(i + seed * 13) * Math.PI * 2, d = r * (0.45 + hash(i + seed * 7) * 0.35);
      return <rect key={i} x={Math.cos(an) * d - 5} y={Math.sin(an) * d - 2} width={10} height={4} rx={2} fill={["#FFF", "#6BD0FF", "#FFE066", "#7BE495"][i % 4]} transform={`rotate(${hash(i + seed) * 180},${Math.cos(an) * d},${Math.sin(an) * d})`} />;
    })}
  </g>
);
// Not kartı (el yazısı)
const Note: React.FC<{ x: number; y: number; s: string; k: number; rot?: number; size?: number }> = ({ x, y, s, k, rot = -4, size = 44 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${0.85 + 0.15 * k})`} opacity={k}>
    <rect x={-300} y={-60} width={600} height={120} rx={6} fill="#F4EEDC" />
    <rect x={-300} y={-60} width={600} height={120} rx={6} fill="none" stroke="#C8BFA6" strokeWidth={3} />
    {T(0, 16, s, size, "#1A1A2E", 800, "middle", { fontStyle: "italic" })}
  </g>
);

// Kutu (yakın plan): kapak açılır, donutlar ve not
export const DonutBox: React.FC<P & { note?: string; sub?: string; bg?: string }> = ({ t, a, b, note, sub, bg = "#0B0D12" }) => {
  const k = rp(t, a + 0.3, a + 1.3), n = rp(t, a + 1.2, a + 1.9);
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill={bg} />
      <circle cx={960} cy={560} r={620} fill="url(#kSpot)" opacity={0.6} />
      <HCam t={t} a={a} b={b} z={[1.04, 1.16]} c0={[960, 580]}>
        <ellipse cx={960} cy={860} rx={560} ry={60} fill="#000" opacity={0.45} />
        <g transform="translate(960,640)">
          <path d="M-460,-140 L460,-140 L500,220 L-500,220Z" fill="#F4F0E6" />
          <path d="M-460,-140 L460,-140 L500,220 L-500,220Z" fill="none" stroke="#D8D0BE" strokeWidth={6} />
          {[-300, -100, 100, 300].map((x, i) => <Donut key={i} x={x} y={-40} r={86} seed={i} c={[PINK, "#7A4A2A", "#FFE6A8", PINK][i]} />)}
          {[-200, 0, 200].map((x, i) => <Donut key={i} x={x} y={110} r={82} seed={i + 5} c={["#7A4A2A", PINK, "#FFF"][i]} />)}
          {/* kapak */}
          <g transform={`translate(0,-140) scale(1,${1 - k * 1.85})`}>
            <rect x={-460} y={-360} width={920} height={360} fill="#F7F2E8" stroke="#D8D0BE" strokeWidth={6} />
            <circle cx={0} cy={-180} r={110} fill={PINK} opacity={0.85} />
            {T(0, -164, "DONUTS", 64, "#FFF", 800, "middle")}
          </g>
        </g>
      </HCam>
      {note && <Note x={960} y={240} s={note} k={n} />}
      {sub && T(960, 1010, sub, 30, "#C8D0DA", 600, "middle", { opacity: n })}
    </g>
  );
};

// سمّاعة تلفون أرضي (الثمانينات) بسلك حلزوني، بدل الموبايل الحديث
export const Handset: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#1E1E22" }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(18)`}>
    <path d="M-18,-70 Q-34,-70 -34,-50 L-30,50 Q-30,70 -12,70 L10,70 Q26,70 24,52 L18,30 Q8,0 18,-30 L22,-52 Q24,-70 6,-70Z" fill={c} />
    <path d={`M0,70 ${Array.from({ length: 9 }, (_, i) => `q${i % 2 ? 14 : -14},14 0,26`).join(" ")}`} stroke={c} strokeWidth={6} fill="none" />
  </g>
);

// ───────── APARTMAN (dış, gece) ─────────
export const Apartment: React.FC<P & { raid?: boolean; label?: [string, string?]; lit?: number[] }> = ({ t, a, b, raid, label, lit = [3, 6, 9, 10] }) => {
  const w = rp(t, a + 0.2, b);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 560]}>
        <rect width={1920} height={1080} fill="url(#kNight)" />
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i + 5) * 300} r={1 + hash(i + 3)} fill="#FFF" opacity={0.2 + 0.4 * Math.abs(Math.sin(t + i))} />)}
        {/* palmiyeler */}
        {[150, 1700].map((x, i) => <g key={i}><rect x={x - 8} y={360} width={16} height={460} fill="#0A0E16" />{Array.from({ length: 7 }, (_, j) => <path key={j} d={`M${x},360 q${Math.cos(j) * 120},${-40 + Math.sin(j * 2) * 30} ${Math.cos(j) * 200},${40}`} stroke="#0A0E16" strokeWidth={14} fill="none" />)}</g>)}
        <g transform="translate(960,330)">
          <rect x={-520} y={0} width={1040} height={500} fill="#1A1F2B" />
          <rect x={-540} y={-20} width={1080} height={26} fill="#11151E" />
          {Array.from({ length: 12 }, (_, i) => {
            const cx = -440 + (i % 6) * 170, cy = 50 + Math.floor(i / 6) * 200, on = lit.includes(i);
            return <g key={i}><rect x={cx} y={cy} width={110} height={120} fill={on ? "#FFD98A" : "#2C3444"} opacity={on ? 0.75 : 0.8} /><rect x={cx - 10} y={cy + 120} width={130} height={10} fill="#11151E" /></g>;
          })}
          <rect x={-60} y={380} width={120} height={120} fill="#0A0D12" />
          {T(0, 370, "CALABASAS · 1992", 22, "#7D8796", 700, "middle")}
        </g>
        <rect x={0} y={830} width={1920} height={250} fill="#0C0F16" />
        {raid && [0, 1, 2, 3, 4].map((i) => {
          const x = lp(-160 - i * 130, 600 + i * 120, w);
          return (
            <g key={i} transform={`translate(${x},${900 + (i % 2) * 22})`}>
              <rect x={-26} y={-120} width={52} height={96} rx={10} fill="#0B0F16" />
              <circle cy={-140} r={23} fill="#0B0F16" />
              <rect x={-26} y={-104} width={52} height={24} fill={FBI} opacity={0.9} />
              {T(0, -86, "FBI", 18, "#07090E", 800, "middle")}
              <rect x={-20} y={-24} width={14} height={64 + Math.sin(t * 8 + i) * 6} fill="#0B0F16" /><rect x={6} y={-24} width={14} height={64 - Math.sin(t * 8 + i) * 6} fill="#0B0F16" />
              <path d={`M26,-90 L${360},-${70 + i * 12} L${360},-${10 + i * 12}Z`} fill="#FFF4D0" opacity={0.07} />
            </g>
          );
        })}
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} c={FBI} />}
    </g>
  );
};

// ───────── MUTFAK + BUZDOLABI ─────────
export const Fridge: React.FC<P & { open?: boolean; agent?: boolean; label?: string }> = ({ t, a, b, open, agent = true, label = "FBI DONUTS" }) => {
  const k = open ? rp(t, a + 0.5, a + 1.5) : 0, lb = rp(t, a + 1.4, a + 2.1);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={open ? [1.0, 1.14] : [1.02, 1.08]} c0={[960, 540]} c1={open ? [900, 520] : undefined}>
        <rect width={1920} height={1080} fill="#14171E" />
        <rect y={760} width={1920} height={320} fill="#1E1A16" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={760} width={168} height={320} fill={i % 2 ? "#221D18" : "#1A1612"} />)}
        {/* tezgâh */}
        <rect x={1150} y={520} width={700} height={240} fill="#2A2E36" /><rect x={1140} y={500} width={720} height={26} fill="#3A3F48" />
        {/* buzdolabı */}
        <g transform="translate(720,140)">
          <rect x={0} y={0} width={420} height={640} rx={14} fill="#D8DCE2" />
          {/* iç */}
          <rect x={14} y={14} width={392} height={612} fill="#EAF6FF" opacity={k} />
          {k > 0.05 && <g opacity={k}>
            {[180, 360, 520].map((y, i) => <rect key={i} x={20} y={y} width={380} height={8} fill="#B8C8D6" />)}
            <rect x={14} y={14} width={392} height={612} fill="#FFF" opacity={0.25 + 0.1 * Math.sin(t * 4)} />
            <g transform="translate(210,300)">
              <rect x={-140} y={-80} width={280} height={120} fill="#F4F0E6" stroke="#D8D0BE" strokeWidth={4} />
              <circle cx={0} cy={-20} r={40} fill={PINK} />
              {T(0, -10, "DONUTS", 26, "#FFF", 800, "middle")}
              <g opacity={lb} transform={`rotate(-5) translate(0,${(1 - lb) * 20})`}>
                <rect x={-150} y={-150} width={300} height={56} fill="#FFF8D8" stroke="#C8BFA6" strokeWidth={3} />
                {T(0, -112, label, 34, "#1A1A2E", 800, "middle")}
              </g>
            </g>
          </g>}
          {/* kapak */}
          <g transform={`translate(0,0) scale(${1 - k * 1.6},1)`}>
            <rect x={0} y={0} width={420} height={640} rx={14} fill="#CDD2D9" stroke="#AEB5BE" strokeWidth={4} />
            <rect x={0} y={250} width={420} height={6} fill="#AEB5BE" />
            <rect x={370} y={60} width={16} height={150} rx={8} fill="#8E96A0" /><rect x={370} y={300} width={16} height={180} rx={8} fill="#8E96A0" />
          </g>
          {k > 0.3 && <path d="M420,0 L900,-60 L900,700 L420,640Z" fill="#EAF6FF" opacity={0.06 * k} />}
        </g>
        {agent && <Person x={420} y={1080} s={1.15} t={t} o={AGENT} arms={open ? "hold" : "down"} mouth={k > 0.8 ? "o" : "tight"} eyes={k > 0.8 ? "wide" : "open"} brow={k > 0.8 ? "up" : "flat"} look={0.6} />}
      </HCam>
    </g>
  );
};

// ───────── SİHİRBAZ KARTLARI ─────────
export const Cards: React.FC<P & { vanish?: boolean; old?: boolean; label?: [string, string?] }> = ({ t, a, b, vanish, old, label }) => {
  const k = vanish ? rp(t, a + 0.8, a + 1.6) : 0;
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#0E0A0A" />
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 600]}>
        {/* kumarhane ışıkları */}
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={100 + i * 115} cy={120 + Math.sin(i) * 30} r={40} fill={i % 2 ? "#FFB21E" : "#FF3B3B"} opacity={0.08 + 0.05 * Math.sin(t * 2 + i)} />)}
        {old && <g opacity={0.9}><Person x={960} y={760} s={1.0} t={t} o={GRANDPA} arms="desk" mouth="smile" look={0.2} /></g>}
        <ellipse cx={960} cy={900} rx={900} ry={260} fill="#0E4A2E" />
        <ellipse cx={960} cy={900} rx={900} ry={260} fill="none" stroke="#6B4A2E" strokeWidth={30} />
        {/* kartlar */}
        {[-2, -1, 0, 1, 2].map((i) => {
          const sp = rp(t, a + 0.2, a + 0.9);
          const isK = i === 0;
          return (
            <g key={i} transform={`translate(${960 + i * 150 * sp},${840 - Math.abs(i) * 10}) rotate(${i * 8 * sp})`} opacity={isK ? 1 - k : 1}>
              <rect x={-70} y={-100} width={140} height={200} rx={12} fill="#FAFAF5" stroke="#CCC" strokeWidth={3} />
              {T(-46, -60, ["A", "K", "Q", "J", "10"][i + 2], 36, i % 2 ? "#C8352E" : "#111", 800, "middle")}
              {T(0, 26, i % 2 ? "♥" : "♠", 80, i % 2 ? "#C8352E" : "#111", 600, "middle")}
            </g>
          );
        })}
        {vanish && <circle cx={960} cy={840} r={40 + k * 180} fill="none" stroke="#FFF" strokeWidth={4} opacity={(1 - k) * 0.6} />}
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── OTOBÜS + AKTARMA BİLETİ ─────────
export const Bus: React.FC<P & { punch?: boolean; ask?: boolean }> = ({ t, a, b, punch, ask }) => {
  const k = punch ? rp(t, a + 0.6, b - 0.4) : 0;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.1]}>
        <rect width={1920} height={1080} fill="#2A3442" />
        {/* camlar, dışarıda akan şehir */}
        {[0, 1, 2].map((i) => <g key={i}><rect x={100 + i * 600} y={120} width={520} height={300} fill="#8FB4D8" />
          {Array.from({ length: 6 }, (_, j) => { const x = ((j * 160 - t * 220) % 960 + 960) % 960; return <rect key={j} x={100 + i * 600 + x * 0.55} y={220 + (j % 3) * 30} width={60} height={200} fill="#5E7088" opacity={0.7} />; })}
        </g>)}
        <rect y={420} width={1920} height={30} fill="#1C232E" />
        <rect y={700} width={1920} height={380} fill="#1E2632" />
        {/* şoför */}
        <Person x={1380} y={1080} s={1.1} t={t} o={DRIVER} arms="desk" mouth={ask ? "smile" : "flat"} look={-0.6} talk={ask} />
        <circle cx={1380} cy={760} r={150} fill="none" stroke="#111" strokeWidth={22} />
        {/* çocuk */}
        <Person x={620} y={1080} s={0.82} t={t} o={KEVIN_K} arms={ask ? "wave" : "down"} mouth={ask ? "open" : "smile"} talk={ask} look={0.7} />
      </HCam>
      {punch && (
        <g transform="translate(960,420)">
          <rect x={-360} y={-150} width={720} height={300} rx={10} fill="#F2E6C8" stroke="#B8A57A" strokeWidth={4} />
          {T(0, -96, "AKTARMA BİLETİ", 36, "#5A3A1A", 800, "middle")}
          {T(0, -56, "TRANSFER · 1975", 22, "#8A6A3A", 600, "middle")}
          {Array.from({ length: 12 }, (_, i) => <g key={i}>{T(-300 + i * 55, 20, String(i + 1), 24, "#5A3A1A", 700, "middle")}<circle cx={-300 + i * 55} cy={60} r={12} fill={k * 12 > i ? "#2A3442" : "none"} stroke="#8A6A3A" strokeWidth={2} /></g>)}
          {T(0, 126, "temsili", 18, "#8A6A3A", 600, "middle")}
        </g>
      )}
    </g>
  );
};

// ───────── YEŞİL TERMİNAL (+siluet / kod adı) ─────────
export const Crt: React.FC<P & { lines?: string[]; sil?: string; label?: [string, string?]; c?: string }> = ({ t, a, b, lines = [], sil, label, c = GRN }) => {
  const total = lines.join("").length || 1, k = rp(t, a + 0.3, Math.min(b - 0.3, a + 0.3 + total * 0.05));
  let used = 0;
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#06080A" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.12]} c0={[960, 500]}>
        <rect x={420} y={90} width={1080} height={820} rx={60} fill="#2A2C2E" />
        <rect x={500} y={160} width={920} height={620} rx={40} fill="#031208" />
        <rect x={500} y={160} width={920} height={620} rx={40} fill={c} opacity={0.05 + 0.02 * Math.sin(t * 20)} />
        {Array.from({ length: 62 }, (_, i) => <rect key={i} x={500} y={160 + i * 10} width={920} height={3} fill="#000" opacity={0.25} />)}
        {sil && <g opacity={0.85}><circle cx={960} cy={380} r={90} fill="#0A1E10" /><path d="M780,700 Q780,500 960,490 Q1140,500 1140,700Z" fill="#0A1E10" />{T(960, 620, sil, 64, c, 800, "middle", { letterSpacing: 6 })}</g>}
        {!sil && lines.map((l, i) => {
          const st = used; used += l.length;
          const vis = Math.max(0, Math.min(l.length, Math.floor(k * total) - st));
          return T(560, 230 + i * 56, l.slice(0, vis) + (vis < l.length && vis > 0 ? "█" : ""), 38, c, 600, "start", { fontFamily: "monospace" });
        })}
        <rect x={860} y={910} width={200} height={60} fill="#222" /><rect x={720} y={960} width={480} height={30} rx={8} fill="#1A1A1A" />
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} c={c} />}
    </g>
  );
};

// ───────── BÖLÜNMÜŞ EKRAN TELEFON (sosyal mühendislik) ─────────
export const Call: React.FC<P & { left?: Look; right?: Look; tag?: string; say?: string; reply?: string; kid?: boolean }> = ({ t, a, b, left = KEVIN, right = CLERK, tag = "TELEFON ŞİRKETİ · TEKNİK DESTEK", say, reply }) => {
  const s1 = rp(t, a + 0.4, a + 1.0), s2 = rp(t, a + 1.6, a + 2.2);
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#0A0E14" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]} k={0.6}>
        {/* sol: Kevin karanlık oda */}
        <g>
          <path d="M0,0 L1040,0 L880,1080 L0,1080Z" fill="#0C1310" />
          <rect x={80} y={180} width={360} height={260} rx={12} fill="#031208" stroke="#1E2A22" strokeWidth={10} />
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={110} y={210 + i * 36} width={80 + hash(i + Math.floor(t * 2)) * 220} height={12} fill={GRN} opacity={0.5} />)}
          <Person x={520} y={1080} s={1.05} t={t} o={left} arms="chin" mouth={say && s1 > 0 && s2 < 1 ? "open" : "flat"} talk={!!say && s2 < 1} look={0.5} />
          <Handset x={648} y={515} s={1.0} />
        </g>
        {/* sağ: ofis */}
        <g>
          <path d="M1040,0 L1920,0 L1920,1080 L880,1080Z" fill="#1A2230" />
          {Array.from({ length: 5 }, (_, i) => <rect key={i} x={1150 + i * 150} y={120} width={110} height={200} fill="#2A3444" />)}
          <Person x={1460} y={1080} s={1.05} t={t} o={right} arms="desk" mouth={reply && s2 > 0 ? "smile" : "flat"} talk={!!reply && s2 > 0.2} look={-0.5} />
          <rect x={1180} y={360} width={560} height={64} rx={8} fill="#0A0E14" opacity={0.85} />
          {T(1460, 402, tag, 26, COLD, 700, "middle")}
        </g>
        <path d="M1040,0 L880,1080" stroke="#FFF" strokeWidth={6} opacity={0.5} />
        {/* ses dalgası */}
        {Array.from({ length: 40 }, (_, i) => {
          const h = 10 + Math.abs(Math.sin(t * 9 + i * 0.7)) * 60 * (0.4 + hash(i));
          return <rect key={i} x={760 + i * 10} y={540 - h / 2} width={5} height={h} fill={COLD} opacity={0.6} />;
        })}
      </HCam>
      {say && <g opacity={s1}><rect x={90} y={760} width={760} height={110} rx={16} fill="#0A0E14" opacity={0.85} stroke={GRN} strokeWidth={3} />{T(470, 828, say, 34, "#FFF", 600, "middle")}</g>}
      {reply && <g opacity={s2}><rect x={1080} y={520} width={760} height={110} rx={16} fill="#0A0E14" opacity={0.85} stroke={COLD} strokeWidth={3} />{T(1460, 588, reply, 34, "#FFF", 600, "middle")}</g>}
    </g>
  );
};

// ───────── TELEFON ŞEBEKESİ ─────────
export const Network: React.FC<P & { label?: string; hi?: boolean }> = ({ t, a, b, label = "TELEFON ŞEBEKESİ · 1980'ler", hi }) => {
  const N = Array.from({ length: 26 }, (_, i) => [180 + hash(i * 3) * 1560, 160 + hash(i * 7 + 1) * 760] as [number, number]);
  const E: [number, number][] = [];
  N.forEach((p, i) => { const d = N.map((q, j) => [j, (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2]).sort((x, y) => x[1] - y[1]); E.push([i, d[1][0]], [i, d[2][0]]); });
  const g = rp(t, a + 0.2, a + 1.4);
  return (
    <g>
      <rect width={1920} height={1080} fill="#06080C" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.15]}>
        {E.map(([i, j], n) => <line key={n} x1={N[i][0]} y1={N[i][1]} x2={lp(N[i][0], N[j][0], g)} y2={lp(N[i][1], N[j][1], g)} stroke="#2A4A6A" strokeWidth={3} />)}
        {E.map(([i, j], n) => { const q = ((t * 0.5 + hash(n)) % 1); return <circle key={n} cx={lp(N[i][0], N[j][0], q)} cy={lp(N[i][1], N[j][1], q)} r={5} fill={hi && n % 3 === 0 ? GRN : COLD} opacity={g * 0.8} />; })}
        {N.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={16} fill="#0E1A2A" stroke={COLD} strokeWidth={3} /><circle cx={p[0]} cy={p[1]} r={6} fill={COLD} opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} /></g>)}
        {hi && <g><circle cx={N[0][0]} cy={N[0][1]} r={40 + 10 * Math.sin(t * 4)} fill="none" stroke={GRN} strokeWidth={4} />{T(N[0][0], N[0][1] - 56, "KEVIN", 26, GRN, 800, "middle")}</g>}
      </HCam>
      {T(960, 1010, label, 32, "#C8D0DA", 700, "middle", { opacity: g })}
    </g>
  );
};

// ───────── TELEFON ŞİRKETİ BİNASI (gece) ─────────
export const PhoneHQ: React.FC<P & { enter?: boolean; docs?: boolean; label?: [string, string?] }> = ({ t, a, b, enter, docs, label }) => {
  const w = rp(t, a + 0.2, b);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.14]} c0={[960, 520]}>
        <rect width={1920} height={1080} fill="url(#kNight)" />
        <g transform="translate(960,80)">
          <rect x={-420} y={0} width={840} height={800} fill="#1C2230" />
          {Array.from({ length: 48 }, (_, i) => { const cx = -380 + (i % 8) * 100, cy = 40 + Math.floor(i / 8) * 120; const on = hash(i) > 0.8; return <rect key={i} x={cx} y={cy} width={70} height={80} fill={on ? "#CDE6FF" : "#2C3546"} opacity={on ? 0.6 : 0.8} />; })}
          <rect x={-120} y={-60} width={240} height={60} fill="#0E1320" />
          {T(0, -18, "TELEFON ŞİRKETİ", 26, COLD, 800, "middle")}
          {/* anten */}
          <rect x={300} y={-200} width={10} height={200} fill="#3A4252" /><circle cx={305} cy={-206} r={8} fill="#FF3B3B" opacity={0.5 + 0.5 * Math.sin(t * 3)} />
        </g>
        <rect y={880} width={1920} height={200} fill="#0C0F16" />
        {enter && [0, 1, 2].map((i) => {
          const x = lp(200 - i * 120, 880 + i * 60, w);
          return <g key={i} transform={`translate(${x},${960})`}><rect x={-22} y={-110} width={44} height={86} rx={10} fill="#0A0C12" /><circle cy={-128} r={20} fill="#0A0C12" /><rect x={-18} y={-26} width={12} height={56 + Math.sin(t * 9 + i) * 6} fill="#0A0C12" /><rect x={6} y={-26} width={12} height={56 - Math.sin(t * 9 + i) * 6} fill="#0A0C12" /><path d={`M22,-70 L${260},-${40 + i * 20} L${260},${10 - i * 10}Z`} fill="#FFF4D0" opacity={0.09} /></g>;
        })}
      </HCam>
      {docs && (
        <g transform="translate(1380,560)" opacity={rp(t, a + 0.8, a + 1.4)}>
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 40},${i * 30}) rotate(${-6 + i * 5})`}><rect x={-200} y={-140} width={400} height={280} fill="#E9E4D8" stroke="#B8B0A0" strokeWidth={3} />{T(0, -90, ["COSMOS · KILAVUZ", "KAPI ŞİFRELERİ", "HAT LİSTESİ"][i], 26, "#2A2A2A", 800, "middle")}{Array.from({ length: 5 }, (_, j) => <rect key={j} x={-160} y={-50 + j * 34} width={260 + hash(i * 9 + j) * 60} height={10} fill="#9A9284" />)}</g>)}
        </g>
      )}
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} c={COLD} />}
    </g>
  );
};

// ───────── TEK KİŞİLİK HÜCRE ─────────
export const Cell: React.FC<P & { days?: number; who?: Look; lbl?: string }> = ({ t, a, b, days = 0, who = KEVIN, lbl = "TEK KİŞİLİK HÜCRE" }) => {
  const k = rp(t, a + 0.4, b - 0.3);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
        <rect width={1920} height={1080} fill="#2A2C30" />
        <rect y={820} width={1920} height={260} fill="#1E2024" />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={0} width={2} height={820} fill="#000" opacity={0.2} />)}
        <rect x={1300} y={160} width={380} height={660} fill="#3A3D44" stroke="#4A4E56" strokeWidth={10} />
        <rect x={1420} y={240} width={140} height={40} fill="#111" />
        <rect x={160} y={600} width={600} height={60} fill="#4A4038" />
        <Person x={620} y={1080} s={1.0} t={t} o={who} arms="cross" mouth="flat" eyes="half" slump={0.4} look={0.3} />
        <circle cx={960} cy={60} r={300} fill="url(#kSpot)" opacity={0.4} />
      </HCam>
      {days > 0 && <g><rect x={1340} y={60} width={480} height={150} rx={12} fill="#07090E" opacity={0.85} />{T(1580, 120, lbl, 26, "#C8D0DA", 700, "middle")}{T(1580, 184, `GÜN ${Math.max(1, Math.round(k * days))}`, 56, X.amber, 800, "middle")}</g>}
    </g>
  );
};

// ───────── ISLIK → FÜZE ─────────
export const Whistle: React.FC<P> = ({ t, a, b }) => {
  const k = rp(t, a + 0.6, a + 2.2);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
        {/* ankesörlü telefon */}
        <g transform="translate(420,520)">
          <rect x={-130} y={-260} width={260} height={480} rx={20} fill="#9AA2AE" />
          <rect x={-90} y={-200} width={180} height={120} fill="#1A1E26" />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-70 + (i % 3) * 50} y={-40 + Math.floor(i / 3) * 50} width={36} height={36} rx={6} fill="#E0E4EA" />)}
          <rect x={-180} y={-220} width={50} height={300} rx={20} fill="#2A2E36" />
        </g>
        {/* nota → çizgi */}
        {Array.from({ length: 8 }, (_, i) => { const q = ((t - a) * 0.7 + i / 8) % 1; return T(600 + q * 700, 480 - Math.sin(q * 6 + i) * 60, "♪", 60, "#FFF", 600, "middle", { opacity: (1 - q) * 0.9 }); })}
        <path d={`M600,520 Q1100,${520 - 300 * k} ${lp(600, 1560, k)},${lp(520, 180, k)}`} stroke={X.red} strokeWidth={6} fill="none" strokeDasharray="20 14" opacity={k} />
        <g transform={`translate(${lp(600, 1560, k)},${lp(520, 180, k)}) rotate(-40)`} opacity={k}><path d="M-60,-14 L40,-14 L70,0 L40,14 L-60,14Z" fill="#DDE2EA" /><path d="M-60,-14 L-80,-34 L-60,0Z M-60,14 L-80,34 L-60,0Z" fill="#9AA2AE" /><circle cx={-70} cy={0} r={12} fill={X.amber} opacity={0.6 + 0.4 * Math.sin(t * 20)} /></g>
      </HCam>
      {T(960, 990, "“Bir ıslıkla nükleer füze fırlatabilir.”", 44, "#FFF", 700, "middle", { opacity: rp(t, a + 1.2, a + 1.8) })}
      {T(960, 1040, "mahkemede bir savcının sözü · 1988", 24, "#7D8796", 600, "middle", { opacity: rp(t, a + 1.4, a + 2.0) })}
    </g>
  );
};

// ───────── DİNLENEN HATLAR ─────────
export const Wiretap: React.FC<P & { rows?: [string, string][]; alert?: number }> = ({ t, a, b, rows = [["FBI · LOS ANGELES", "AKTİF"], ["FBI · AJAN", "AKTİF"], ["MAHKEME · HÂKİM", "ARAMA"], ["ERIC", "GİZLİ"], ["BİLİNMEYEN HAT", "AKTİF"]], alert = 2 }) => (
  <g>
    <rect width={1920} height={1080} fill="#06080A" />
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <BackView x={360} y={1120} s={1.4} t={t} o={KEVIN_F} />
      <path d="M270,560 q90,-130 180,0" stroke="#111" strokeWidth={22} fill="none" />
      <rect x={760} y={140} width={1040} height={760} rx={16} fill="#031208" stroke="#1E2A22" strokeWidth={10} />
      {T(800, 200, "HAT İZLEME", 32, GRN, 800, "start", { fontFamily: "monospace" })}
      {rows.map(([n, s], i) => {
        const on = rp(t, a + 0.3 + i * 0.35, a + 0.6 + i * 0.35), al = i === alert && t > a + 0.3 + i * 0.35 + 0.4;
        return (
          <g key={i} opacity={on}>
            <rect x={800} y={250 + i * 120} width={960} height={96} rx={8} fill={al ? "#3A0E0E" : "#0A1E10"} opacity={al ? 0.6 + 0.4 * Math.abs(Math.sin(t * 5)) : 1} />
            {T(830, 310 + i * 120, `(•••) •••-${String(1000 + Math.floor(hash(i) * 8999))}`, 30, "#7D8796", 600, "start", { fontFamily: "monospace" })}
            {T(1180, 310 + i * 120, n, 32, al ? X.red : GRN, 700, "start", { fontFamily: "monospace" })}
            {T(1730, 310 + i * 120, s, 26, al ? X.red : "#7D8796", 700, "end", { fontFamily: "monospace" })}
          </g>
        );
      })}
    </HCam>
  </g>
);

// ───────── ABD HARİTASI (kaçış) ─────────
const US: [number, number][] = [[-124.7, 48.4], [-123, 46], [-124, 42], [-124.2, 40.4], [-122.4, 37.8], [-120.6, 34.6], [-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.4, 25.9], [-97.4, 27.8], [-94.7, 29.4], [-90, 29.2], [-89.4, 30.2], [-85, 29.7], [-83, 29], [-82.6, 27.5], [-81.8, 26], [-80.4, 25.2], [-80, 26.8], [-80.6, 28.5], [-81.4, 30.7], [-79.2, 33.2], [-76.5, 34.7], [-75.5, 35.2], [-76, 37], [-74, 39.6], [-73.9, 40.6], [-70, 41.6], [-70.6, 42.7], [-70.2, 43.7], [-67, 44.8], [-67.8, 47.1], [-69.2, 47.4], [-71.5, 45], [-74.8, 45], [-76.5, 44], [-79, 43.3], [-79.2, 42.5], [-83, 42], [-82.5, 45.3], [-84.6, 46.5], [-88, 48], [-89.6, 48], [-95.2, 49], [-123, 49]];
const pj = (lon: number, lat: number): [number, number] => [190 + (lon + 125) * 26, 120 + (50 - lat) * 32.5];
export const CITY: Record<string, [number, number]> = {
  "Los Angeles": [-118.24, 34.05], "San Diego": [-117.16, 32.72], "San Francisco": [-122.42, 37.77], Denver: [-104.99, 39.74], Seattle: [-122.33, 47.6], Raleigh: [-78.64, 35.78], Washington: [-77.04, 38.9],
};
export const UsaMap: React.FC<P & { pins?: string[]; route?: string[]; hi?: string; yr?: string; red?: boolean }> = ({ t, a, b, pins = [], route = [], hi, yr, red }) => {
  const d = "M" + US.map(([lo, la]) => pj(lo, la).join(",")).join(" L") + "Z";
  const pts = route.map((c) => pj(...CITY[c]));
  const k = rp(t, a + 0.4, Math.max(a + 1.2, b - 0.6));
  const seg = pts.length > 1 ? k * (pts.length - 1) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
        {Array.from({ length: 20 }, (_, i) => <line key={i} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke="#121A26" strokeWidth={1} />)}
        {Array.from({ length: 33 }, (_, i) => <line key={i} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke="#121A26" strokeWidth={1} />)}
        <path d={d} fill="#121C2A" stroke="#3A5A7A" strokeWidth={4} />
        {pts.slice(0, -1).map((p, i) => {
          const q = Math.max(0, Math.min(1, seg - i)); const e = pts[i + 1];
          return q > 0 && <line key={i} x1={p[0]} y1={p[1]} x2={lp(p[0], e[0], q)} y2={lp(p[1], e[1], q)} stroke={red ? X.red : X.amber} strokeWidth={6} strokeDasharray="18 12" />;
        })}
        {[...new Set([...pins, ...route])].map((c, i) => {
          const [x, y] = pj(...CITY[c]); const isHi = c === hi;
          return <g key={c} opacity={rp(t, a + 0.2 + i * 0.15, a + 0.5 + i * 0.15)}>
            <circle cx={x} cy={y} r={isHi ? 22 + 6 * Math.sin(t * 5) : 12} fill={isHi ? X.red : X.amber} />
            {isHi && <circle cx={x} cy={y} r={50 + ((t * 40) % 60)} fill="none" stroke={X.red} strokeWidth={3} opacity={1 - ((t * 40) % 60) / 60} />}
            {T(x + 26, y - 18, c.toUpperCase(), 28, "#FFF", 800, x > 1500 ? "end" : "start", x > 1500 ? { transform: `translate(-52,0)` } : {})}
          </g>;
        })}
      </HCam>
      {yr && T(1840, 1020, yr, 54, X.amber, 800, "end")}
    </g>
  );
};

// ───────── GÜVEN TAKLİDİ (kavram) ─────────
export const Spoof: React.FC<P> = ({ t, a, b }) => {
  const k1 = rp(t, a + 0.3, a + 1.0), k2 = rp(t, a + 1.2, a + 2.0), k3 = rp(t, a + 2.2, a + 3.0);
  const pc = (x: number, lbl: string, c: string) => <g transform={`translate(${x},460)`}><rect x={-150} y={-120} width={300} height={200} rx={14} fill="#1A2230" stroke={c} strokeWidth={6} /><rect x={-120} y={-92} width={240} height={140} fill="#031208" /><rect x={-60} y={80} width={120} height={40} fill="#2A3444" />{T(0, 180, lbl, 30, c, 800, "middle")}</g>;
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
        {pc(420, "GÜVENİLEN", GRN)}{pc(1500, "HEDEF", COLD)}
        <line x1={580} y1={430} x2={lp(580, 1340, k1)} y2={430} stroke={GRN} strokeWidth={6} strokeDasharray="16 10" />
        {T(960, 400, "“Ben tanıdığın bilgisayarım.”", 30, GRN, 700, "middle", { opacity: k1 })}
        {/* sahte ses */}
        <g opacity={k2}><circle cx={960} cy={760} r={70} fill="#1A0E0E" stroke={X.red} strokeWidth={5} />{T(960, 778, "?", 60, X.red, 800, "middle")}
          <path d={`M1030,740 Q1200,${640} 1340,500`} stroke={X.red} strokeWidth={5} fill="none" strokeDasharray="12 10" />
          {T(960, 880, "aynı sesi taklit ediyor", 28, X.red, 700, "middle")}</g>
        <g opacity={k3}><rect x={1380} y={290} width={240} height={50} rx={8} fill={X.red} />{T(1500, 326, "KAPI AÇIK", 28, "#FFF", 800, "middle")}</g>
      </HCam>
      {T(960, 1020, "kavramsal anlatım · uygulama değil", 22, "#7D8796", 600, "middle")}
    </g>
  );
};

// ───────── İZ ZİNCİRİ ─────────
export const Trace: React.FC<P & { hops?: string[]; upto?: number }> = ({ t, a, b, hops = ["THE WELL", "İNTERNET SAĞLAYICISI", "TELEFON SANTRALİ", "CEP ŞEBEKESİ", "RALEIGH"], upto }) => {
  const n = upto ?? hops.length, k = rp(t, a + 0.3, Math.max(a + 1, b - 0.5)) * (n - 1);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]} c0={[200 + (n - 1) * 190, 540]}>
        {hops.slice(0, n).map((h, i) => {
          const x = 200 + i * 380, y = 540 + (i % 2 ? 90 : -90), on = k >= i - 0.05, last = i === hops.length - 1;
          return (
            <g key={i} opacity={on ? 1 : 0.15}>
              {i > 0 && <line x1={200 + (i - 1) * 380} y1={540 + ((i - 1) % 2 ? 90 : -90)} x2={lp(200 + (i - 1) * 380, x, Math.max(0, Math.min(1, k - i + 1)))} y2={lp(540 + ((i - 1) % 2 ? 90 : -90), y, Math.max(0, Math.min(1, k - i + 1)))} stroke={X.amber} strokeWidth={5} />}
              <circle cx={x} cy={y} r={last ? 70 : 54} fill={last ? "#2A0E0E" : "#0E1A2A"} stroke={last ? X.red : X.amber} strokeWidth={6} />
              {T(x, y + 12, String(i + 1), 40, last ? X.red : X.amber, 800, "middle")}
              {T(x, y + (i % 2 ? 130 : -100), h, 28, "#FFF", 800, "middle")}
            </g>
          );
        })}
      </HCam>
    </g>
  );
};

// ───────── TELSİZ YÖN BULMA ARABASI ─────────
export const RadioCar: React.FC<P & { strength?: [number, number] }> = ({ t, a, b, strength = [0.2, 1] }) => {
  const q = rp(t, a + 0.3, b - 0.2), s = lp(strength[0], strength[1], q) * (0.85 + 0.15 * Math.sin(t * 7));
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.1]}>
        <rect width={1920} height={1080} fill="url(#kNight)" />
        {Array.from({ length: 9 }, (_, i) => { const x = ((i * 260 - t * 120) % 2340 + 2340) % 2340 - 200; return <g key={i}><rect x={x} y={260 + hash(i) * 120} width={200} height={500} fill="#141A26" />{Array.from({ length: 8 }, (_, j) => <rect key={j} x={x + 20 + (j % 2) * 90} y={300 + hash(i) * 120 + Math.floor(j / 2) * 100} width={60} height={60} fill={hash(i * 8 + j) > 0.7 ? "#FFD98A" : "#232B3A"} opacity={0.7} />)}</g>; })}
        <rect y={760} width={1920} height={320} fill="#0E1118" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={((i * 300 - t * 400) % 2400 + 2400) % 2400 - 200} y={900} width={140} height={10} fill="#FFE08A" opacity={0.5} />)}
        {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={((i * 560 - t * 120) % 2240 + 2240) % 2240 - 160} cy={500} r={180} fill="#FFD98A" opacity={0.04} />)}
        <g transform="translate(860,820)">
          <path d="M-300,0 L-260,-110 L-120,-170 L160,-170 L300,-90 L320,0Z" fill="#2A3040" />
          <path d="M-230,-110 L-120,-160 L140,-160 L240,-100Z" fill="#0A0E16" />
          <circle cx={-170} cy={0} r={56} fill="#0A0A0A" /><circle cx={190} cy={0} r={56} fill="#0A0A0A" />
          <rect x={20} y={-250} width={6} height={90} fill="#8A92A0" /><circle cx={23} cy={-254} r={10} fill={X.red} opacity={0.5 + 0.5 * s} />
          {[0, 1, 2].map((i) => <circle key={i} cx={23} cy={-254} r={40 + i * 40 + ((t * 60) % 40)} fill="none" stroke={COLD} strokeWidth={3} opacity={(0.5 - i * 0.15) * s} />)}
        </g>
      </HCam>
      {/* yön bulucu ekranı */}
      <g transform="translate(1520,300)">
        <rect x={-260} y={-220} width={520} height={440} rx={20} fill="#0A0E14" stroke="#2A3444" strokeWidth={6} />
        {T(0, -170, "SİNYAL YÖN BULUCU", 24, COLD, 800, "middle")}
        <circle cx={0} cy={20} r={130} fill="none" stroke="#2A4A6A" strokeWidth={4} />
        <line x1={0} y1={20} x2={Math.sin(0.6 * Math.sin(t * 1.3) * (1 - q)) * 120} y2={20 - Math.cos(0.6 * Math.sin(t * 1.3) * (1 - q)) * 120} stroke={X.red} strokeWidth={6} />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-200 + i * 40} y={180 - i * 6} width={28} height={10 + i * 6} fill={i / 10 < s ? (i > 7 ? X.red : GRN) : "#1A2230"} />)}
      </g>
    </g>
  );
};

// ───────── 202 NUMARALI KAPI ─────────
export const Door202: React.FC<P & { open?: boolean; cuffs?: boolean; num?: string }> = ({ t, a, b, open, cuffs, num = "202" }) => {
  const k = open ? rp(t, a + 0.8, a + 1.8) : 0, kn = Math.max(0, Math.sin((t - a) * 18)) * (t - a < 0.8 ? 1 : 0);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]} punch={0.1}>
        <rect width={1920} height={1080} fill="#1E1C1A" />
        <rect y={860} width={1920} height={220} fill="#2A2420" />
        <rect x={700} y={160} width={520} height={700} fill="#0A0A0A" />
        {k > 0 && <rect x={700} y={160} width={520 * k} height={700} fill="#FFE6B0" opacity={0.5} />}
        <g transform={`translate(700,160) scale(${1 - k * 0.8},1)`}>
          <rect width={520} height={700} fill="#5A3A26" stroke="#3A2618" strokeWidth={10} transform={`translate(${kn * 3},0)`} />
          <rect x={60} y={60} width={400} height={240} fill="#4E3220" /><rect x={60} y={360} width={400} height={280} fill="#4E3220" />
          <circle cx={460} cy={370} r={16} fill="#C9A227" />
          <rect x={180} y={-10} width={160} height={70} rx={6} fill="#C9A227" transform="translate(0,90)" />
          {T(260, 140, num, 52, "#2A1A0E", 800, "middle")}
        </g>
        {k > 0.5 && <Person x={960} y={1080} s={1.05} t={t} o={KEVIN_F} arms={cuffs ? "down" : "down"} mouth="flat" eyes="half" look={-0.2} />}
        <Person x={380} y={1080} s={1.15} t={t} o={AGENT} arms="hold" mouth="tight" look={0.6} />
        <Person x={1560} y={1080} s={1.15} t={t} o={AGENT} arms="down" mouth="tight" look={-0.6} dir={-1} />
      </HCam>
      {cuffs && k > 0.5 && (
        <g transform="translate(960,960)" opacity={rp(t, a + 2.0, a + 2.6)}>
          <circle cx={-50} cy={0} r={40} fill="none" stroke="#C8CED6" strokeWidth={14} /><circle cx={50} cy={0} r={40} fill="none" stroke="#C8CED6" strokeWidth={14} /><rect x={-14} y={-6} width={28} height={12} fill="#C8CED6" />
        </g>
      )}
    </g>
  );
};

// ───────── YÜZ YÜZE ─────────
export const FaceOff: React.FC<P & { l?: Look; r?: Look; ln?: string; rn?: string }> = ({ t, a, b, l = KEVIN_F, r = SHIMO, ln = "KEVIN MITNICK", rn = "TSUTOMU SHIMOMURA" }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <rect width={960} height={1080} fill={GRN} opacity={0.04} /><rect x={960} width={960} height={1080} fill={COLD} opacity={0.04} />
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <Person x={560} y={1100} s={1.45} t={t} o={l} mouth="flat" eyes="half" look={0.8} />
      <Person x={1360} y={1100} s={1.45} t={t} o={r} mouth="tight" look={-0.8} dir={-1} />
      <line x1={960} y1={80} x2={960} y2={1000} stroke="#FFF" strokeWidth={2} opacity={0.2} />
    </HCam>
    {T(480, 120, ln, 40, GRN, 800, "middle", { opacity: rp(t, a + 0.3, a + 0.8) })}
    {T(1440, 120, rn, 40, COLD, 800, "middle", { opacity: rp(t, a + 0.5, a + 1.0) })}
    {T(960, 1040, "temsili çizim", 20, "#7D8796", 600, "middle")}
  </g>
);

// ───────── GAZETE ─────────
export const Paper: React.FC<P & { head: string; date: string; sub?: string }> = ({ t, a, b, head, date, sub }) => {
  const k = rp(t, a, a + 0.9);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E0E10" />
      <HCam t={t} a={a} b={b} z={[1.0, 1.12]}>
        <g transform={`translate(960,540) rotate(${(1 - k) * 540 - 3}) scale(${0.2 + 0.8 * k})`}>
          <rect x={-560} y={-420} width={1120} height={840} fill="#ECE6D6" />
          {T(0, -330, "GAZETE", 70, "#1A1A1A", 800, "middle", { fontFamily: "serif" })}
          <rect x={-520} y={-300} width={1040} height={4} fill="#1A1A1A" />
          {T(-520, -266, date, 24, "#3A3A3A", 600, "start")}
          {T(0, -170, head, 64, "#111", 800, "middle", { fontFamily: "serif" })}
          {sub && T(0, -110, sub, 30, "#3A3A3A", 600, "middle", { fontFamily: "serif" })}
          <rect x={-520} y={-70} width={420} height={420} fill="#B8B2A2" />
          <circle cx={-310} cy={80} r={90} fill="#8A8476" /><path d="M-450,350 Q-450,190 -310,190 Q-170,190 -170,350Z" fill="#8A8476" />
          {T(-310, 120, "?", 120, "#ECE6D6", 800, "middle")}
          {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-60} y={-60 + i * 30} width={560 - hash(i) * 120} height={12} fill="#8A8476" />)}
        </g>
      </HCam>
    </g>
  );
};

// ───────── KEVIN'İ SERBEST BIRAKIN ─────────
export const FreeKevin: React.FC<P> = ({ t, a, b }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.02, 1.12]}>
      <rect width={1920} height={1080} fill="#2A3442" />
      <rect y={700} width={1920} height={380} fill="#3A3A3E" />
      {[0, 1, 2].map((i) => {
        const x = 200 + i * 620 - ((t - a) * 30);
        return (
          <g key={i} transform={`translate(${x},${640 + (i % 2) * 40})`}>
            <path d="M0,0 L520,0 L540,160 L-20,160Z" fill={["#8A2E2E", "#2E4A8A", "#5A5A5A"][i]} />
            <rect x={-30} y={150} width={600} height={40} rx={10} fill="#BFC5CC" />
            <rect x={80} y={60} width={360} height={80} rx={6} fill="#FFF" />
            {T(260, 114, "FREE KEVIN", 44, "#C8352E", 800, "middle")}
          </g>
        );
      })}
    </HCam>
    {T(960, 1030, "“Kevin'i serbest bırakın” · 1990'ların sonu", 30, "#FFF", 700, "middle")}
  </g>
);

// ───────── SAHNE (konferans) ─────────
export const Stage: React.FC<P & { screen?: string }> = ({ t, a, b, screen = "SOSYAL MÜHENDİSLİK" }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]} c0={[960, 480]}>
      <rect width={1920} height={1080} fill="#07090E" />
      <rect x={460} y={80} width={1000} height={520} fill="#0E1A2A" stroke="#2A4A6A" strokeWidth={6} />
      {T(960, 320, screen, 64, COLD, 800, "middle")}
      {T(960, 400, "Bir sistemin en zayıf halkası: İNSAN", 36, "#FFF", 600, "middle")}
      <rect y={680} width={1920} height={80} fill="#1A1E26" />
      <circle cx={960} cy={300} r={600} fill="url(#kSpot)" opacity={0.5} />
      <Person x={960} y={900} s={0.9} t={t} o={KEVIN} arms="wave" mouth="open" talk look={0.2} />
      {Array.from({ length: 22 }, (_, i) => <g key={i}><circle cx={60 + i * 88} cy={950 + (i % 2) * 20} r={36} fill="#0A0C10" /><rect x={20 + i * 88} y={980 + (i % 2) * 20} width={80} height={120} rx={30} fill="#0A0C10" /></g>)}
    </HCam>
  </g>
);

// ───────── SENATO ─────────
export const Senate: React.FC<P> = ({ t, a, b }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <rect width={1920} height={1080} fill="#2E2218" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={0} width={20} height={700} fill="#3A2A1C" />)}
      <rect x={0} y={200} width={1920} height={180} fill="#4A3424" />
      {[260, 560, 860, 1160, 1460, 1760].map((x, i) => <g key={i}><circle cx={x} cy={260} r={32} fill="#1A1410" /><rect x={x - 46} y={290} width={92} height={90} rx={20} fill="#1A1410" /></g>)}
      <rect y={380} width={1920} height={40} fill="#6B4A2E" />
      <rect x={560} y={720} width={800} height={60} fill="#6B4A2E" />
      <Person x={960} y={1080} s={1.0} t={t} o={KEVIN} arms="desk" mouth="open" talk look={0} />
      <rect x={990} y={640} width={8} height={90} fill="#222" /><ellipse cx={994} cy={636} rx={14} ry={20} fill="#333" />
      <rect x={640} y={60} width={640} height={70} rx={10} fill="#1A1410" opacity={0.85} />{T(960, 108, "ABD SENATOSU · MART 2000", 32, "#E9DCC0", 700, "middle")}
    </HCam>
  </g>
);

// ───────── TÜRKİYE: TELEFON DOLANDIRICILIĞI UYARISI ─────────
export const ScamCall: React.FC<P & { who?: string }> = ({ t, a, b, who = "“POLİS / SAVCILIK”" }) => {
  const k = rp(t, a + 1.4, a + 2.2);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <circle cx={960} cy={540} r={600} fill={X.red} opacity={0.05 + 0.03 * Math.sin(t * 4)} />
      <HCam t={t} a={a} b={b} z={[1.0, 1.06]}>
        <g transform={`translate(960,540) rotate(${Math.sin(t * 30) * (k < 1 ? 1.2 : 0)})`}>
          <rect x={-230} y={-440} width={460} height={880} rx={60} fill="#111" stroke="#333" strokeWidth={8} />
          <rect x={-200} y={-400} width={400} height={800} rx={40} fill="#16202E" />
          {T(0, -260, "Gelen arama", 30, "#AAB", 600, "middle")}
          {T(0, -190, who, 40, "#FFF", 800, "middle")}
          {T(0, -140, "Bilinmeyen numara", 24, "#7D8796", 600, "middle")}
          <rect x={-170} y={-60} width={340} height={150} rx={16} fill="#2A0E0E" opacity={0.9} />
          {T(0, -10, "Şifre? Kod?", 32, X.red, 800, "middle")}
          {T(0, 40, "Para?", 32, X.red, 800, "middle")}
          <circle cx={-100} cy={290} r={60} fill={X.red} transform={`scale(${1 + 0.15 * k})`} />
          {T(-100, 300, "KAPAT", 22, "#FFF", 800, "middle")}
          <circle cx={100} cy={290} r={60} fill="#2EA84A" opacity={1 - k * 0.7} />
        </g>
      </HCam>
      {T(960, 1030, "Kurumu kendin ara.", 40, X.amber, 800, "middle", { opacity: k })}
    </g>
  );
};

// ───────── İHANET (ankesörlü telefondan FBI'ı arayan) ─────────
export const Betray: React.FC<P & { who?: Look; name?: string; to?: string }> = ({ t, a, b, who = DICICCO, name = "Lenny DiCicco", to = "FBI" }) => {
  const k = rp(t, a + 0.6, a + 1.4);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.12]}>
        <rect width={1920} height={1080} fill="#0C1016" />
        <circle cx={760} cy={200} r={420} fill="url(#kSpot)" opacity={0.6} />
        <rect x={540} y={260} width={240} height={420} rx={14} fill="#8A929E" />
        <rect x={570} y={300} width={180} height={100} fill="#1A1E26" />
        <Person x={860} y={1080} s={1.2} t={t} o={who} arms="chin" mouth="tight" eyes="half" look={-0.4} talk={k > 0.5} />
        <Handset x={1010} y={420} s={1.15} />
      </HCam>
      <g opacity={k}><rect x={1220} y={360} width={520} height={200} rx={16} fill="#0A0E14" stroke={FBI} strokeWidth={5} />{T(1480, 450, `☎  ${to}`, 64, FBI, 800, "middle")}{T(1480, 520, "arama bağlanıyor…", 26, "#C8D0DA", 600, "middle")}</g>
      <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={name} b="temsili çizim" c={X.red} />
    </g>
  );
};

// ───────── KAÇAK HAYAT (sahte kimlikler) ─────────
export const FakeIds: React.FC<P & { names?: string[] }> = ({ t, a, b, names = ["Brian Merrill", "Eric Weiss", "Lee Nussbaum", "Glenn Case"] }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <HCam t={t} a={a} b={b} z={[1.0, 1.1]}>
      {names.map((n, i) => {
        const k = rp(t, a + 0.2 + i * 0.4, a + 0.6 + i * 0.4);
        return (
          <g key={i} transform={`translate(${380 + i * 390},${540 + (i % 2 ? 60 : -60)}) rotate(${-8 + i * 5}) scale(${0.8 + 0.2 * k})`} opacity={k}>
            <rect x={-170} y={-110} width={340} height={220} rx={14} fill="#E9E4D8" />
            <rect x={-150} y={-80} width={110} height={140} fill="#9A9284" /><circle cx={-95} cy={-30} r={30} fill="#6A6458" /><path d="M-140,60 Q-140,10 -95,10 Q-50,10 -50,60Z" fill="#6A6458" />
            {T(-20, -50, "KİMLİK", 22, "#5A5448", 800, "start")}
            {T(-20, 0, n, 24, "#1A1A1A", 800, "start")}
            {Array.from({ length: 3 }, (_, j) => <rect key={j} x={-20} y={24 + j * 20} width={150} height={8} fill="#B8B0A0" />)}
            <rect x={-170} y={-110} width={340} height={220} rx={14} fill="none" stroke={X.red} strokeWidth={6} opacity={0.6} />
          </g>
        );
      })}
    </HCam>
    {T(960, 1030, "sahte kimlikler · temsili", 26, "#7D8796", 600, "middle")}
  </g>
);

// ───────── KAYNAK KODU (şirketler) ─────────
export const SourceCode: React.FC<P & { cos?: string[] }> = ({ t, a, b, cos = ["MOTOROLA", "NOKIA", "SUN", "NOVELL"] }) => (
  <g>
    <rect width={1920} height={1080} fill="#050806" />
    {Array.from({ length: 30 }, (_, i) => T(60 + (i % 3) * 620, ((i * 40 + (t - a) * 160) % 1180) - 60, Array.from({ length: 34 }, (_, j) => "{}();=<>/*#abcdef01"[Math.floor(hash(i * 40 + j) * 19)]).join(""), 26, GRN, 500, "start", { fontFamily: "monospace", opacity: 0.18 }))}
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      {cos.map((c, i) => {
        const k = rp(t, a + 0.2 + i * 0.45, a + 0.6 + i * 0.45);
        return <g key={i} opacity={k} transform={`translate(${300 + i * 440},540)`}><rect x={-180} y={-90} width={360} height={180} rx={16} fill="#0A140C" stroke={GRN} strokeWidth={4} />{T(0, -10, c, 44, "#FFF", 800, "middle")}{T(0, 50, "kaynak kodu", 26, GRN, 600, "middle")}</g>;
      })}
    </HCam>
  </g>
);

export { Stamp, Label, KDefs, typed };
