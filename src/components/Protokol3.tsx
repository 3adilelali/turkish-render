import React from "react";
import { hash, gait } from "./Motion";
import { rp, lp, cl } from "./Hayat";
import { X, T, Sil, typed } from "./Protokol";

// Kanal 5 · Protokol X · k7-01 Thodex için eklenen sahneler (2026-11-17). Sonraki dosyalar da kullanabilir:
// Türkiye/Akdeniz haritası, telefon + borsa uygulaması, "ekran ↔ kasa" analojisi, döviz bürosu, pasaport kontrolü,
// gece uçağı, X-ray bandı, villa baskını, biyometrik eşleşme, altın, cezaevi koridoru, ATM, çekiliş arabası, fiyat grafiği.
// Gerçek marka/logo yok: uygulama genel "KRİPTO BORSASI" arayüzü.
const md = (v: number, m: number) => ((v % m) + m) % m;

// ───────── AKDENİZ / TÜRKİYE HARİTASI ─────────
export const mp = (lon: number, lat: number): [number, number] => [60 + (lon - 12) * 53, 150 + (44.5 - lat) * 68];
const pth = (pts: number[][]) => "M" + pts.map(([a, b]) => mp(a, b).map((v) => v.toFixed(0)).join(",")).join(" L") + "Z";
const TR = [[26.0, 41.7], [28.0, 42.0], [29.1, 41.2], [31.2, 41.1], [33.3, 42.0], [35.1, 42.0], [36.9, 41.3], [38.3, 40.95], [40.0, 40.9], [41.5, 41.5], [43.4, 41.1], [44.8, 39.7], [44.4, 38.4], [44.8, 37.2], [42.3, 37.2], [40.6, 37.1], [38.7, 36.7], [36.6, 36.8], [36.1, 35.9], [35.8, 36.6], [34.6, 36.8], [32.8, 36.0], [31.0, 36.8], [29.7, 36.1], [28.2, 36.7], [27.3, 37.0], [26.3, 38.3], [26.7, 39.4], [26.1, 40.0], [26.6, 40.6], [26.0, 40.8]];
const AL = [[19.3, 42.2], [20.6, 42.0], [20.9, 41.0], [21.0, 40.6], [20.1, 39.6], [19.4, 40.3], [19.4, 41.0], [19.6, 41.8]];
const GR = [[20.2, 39.6], [21, 40.8], [22.5, 41.2], [24.5, 41.5], [26.2, 41.7], [26.1, 40.7], [23.5, 40.2], [22.8, 39.4], [23.0, 38.0], [22.0, 37.0], [21.6, 37.9], [21.0, 38.6]];
const IT = [[12.0, 45.5], [13.6, 45.6], [12.4, 44.2], [13.6, 43.5], [14.8, 42.1], [16.0, 41.4], [18.5, 40.1], [17.0, 39.0], [16.0, 38.0], [15.6, 40.0], [14.0, 41.0], [12.4, 41.8], [11.0, 42.5], [10.2, 43.9], [9.0, 44.4], [8.0, 45.5]];
const SI = [[12.4, 38.1], [15.6, 38.3], [15.1, 36.7], [12.6, 37.6]];
const BK = [[13.6, 45.6], [19.5, 45.7], [28.6, 44.6], [28.6, 43.8], [28.0, 42.0], [26.0, 41.7], [24.5, 41.5], [22.5, 41.2], [21, 40.8], [20.9, 41.0], [20.6, 42.0], [19.3, 42.2], [18.5, 42.5], [16.5, 43.4], [15.2, 44.2], [14.0, 44.9]];
const SY = [[36.1, 35.9], [36.6, 36.8], [38.7, 36.7], [40.6, 37.1], [42.3, 37.2], [44.8, 37.2], [46.5, 36.0], [46.5, 33.5], [36.0, 33.5], [35.6, 34.6]];
export const CITY: Record<string, [number, number]> = {
  İSTANBUL: [29.0, 41.0], ANKARA: [32.85, 39.93], İZMİR: [27.14, 38.42], KOCAELİ: [29.9, 40.77], TEKİRDAĞ: [27.5, 40.98], TİRAN: [19.82, 41.33], VLORA: [19.49, 40.47], MALTA: [14.4, 35.9],
  ANTALYA: [30.7, 36.9], ADANA: [35.3, 37.0], BURSA: [29.06, 40.18], KONYA: [32.48, 37.87], TRABZON: [39.72, 41.0], DİYARBAKIR: [40.2, 37.9], ERZURUM: [41.27, 39.9], SAMSUN: [36.33, 41.29], KAYSERİ: [35.48, 38.72], GAZİANTEP: [37.38, 37.07], VAN: [43.38, 38.5], ESKİŞEHİR: [30.52, 39.78],
};
// Türkiye içinde rastgele nokta (kabaca)
const trPt = (i: number): [number, number] => {
  const keys = Object.keys(CITY).filter((k) => !["TİRAN", "VLORA", "MALTA"].includes(k));
  const c = CITY[keys[i % keys.length]];
  return mp(c[0] + (hash(i * 3.1) - 0.5) * 3.2, c[1] + (hash(i * 7.7) - 0.5) * 1.4);
};
export type MapMode = "grow" | "dark" | "route" | "malta" | "vlora" | "plain";
export const MedMap: React.FC<{ t: number; a: number; mode?: MapMode; dur?: number; dots?: number; labels?: string[]; route?: [string, string]; arcK?: number }> = ({ t, a, mode = "plain", dur = 6, dots = 260, labels = [], route = ["İSTANBUL", "TİRAN"], arcK }) => {
  const k = cl((t - a) / dur);
  const land = (p: number[][], hi = false, key?: string) => <path key={key} d={pth(p)} fill={hi ? "#1A2638" : "#111823"} stroke={hi ? X.amber : "#2A3850"} strokeWidth={hi ? 3 : 1.5} strokeOpacity={hi ? 0.7 : 0.6} />;
  const [ax, ay] = mp(...CITY[route[0]]);
  const [bx, by] = mp(...CITY[route[1]]);
  const mx = (ax + bx) / 2, my = Math.min(ay, by) - 220;
  const q = arcK ?? k;
  const px = (1 - q) ** 2 * ax + 2 * (1 - q) * q * mx + q * q * bx, py = (1 - q) ** 2 * ay + 2 * (1 - q) * q * my + q * q * by;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A1420" />
      <rect width={1920} height={1080} fill="url(#pGrid)" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${md(i * 240 - t * 12, 2100) - 100},${880 + (i % 3) * 40} q30,-6 60,0 t60,0`} stroke="#2B4A66" strokeWidth={2} fill="none" opacity={0.4} />)}
      {[BK, IT, SI, SY].map((p, i) => land(p, false, `l${i}`))}
      {land(GR, false)}
      {land(AL, mode === "route" || mode === "vlora")}
      {land(TR, true)}
      {mode === "grow" && Array.from({ length: dots }, (_, i) => {
        const at = (i / dots) * 0.9;
        if (k < at) return null;
        const [x, y] = trPt(i);
        const pul = 0.5 + 0.5 * Math.sin(t * 3 + i);
        return <circle key={i} cx={x} cy={y} r={3 + pul * 2} fill={X.cyan} opacity={0.75} />;
      })}
      {mode === "dark" && Array.from({ length: dots }, (_, i) => {
        const off = k > (hash(i * 5.3) * 0.8);
        const [x, y] = trPt(i);
        return <circle key={i} cx={x} cy={y} r={off ? 3 : 4.5} fill={off ? "#3A1A1A" : X.cyan} opacity={off ? 0.6 : 0.8} />;
      })}
      {(mode === "route" || mode === "malta") && (
        <g>
          <path d={`M${ax},${ay} Q${mx},${my} ${bx},${by}`} stroke={mode === "malta" ? X.amber : X.red} strokeWidth={4} fill="none" strokeDasharray="14 12" strokeDashoffset={-t * 40} opacity={0.8} />
          {mode === "route" ? (
            <g transform={`translate(${px},${py}) rotate(${(Math.atan2(by - ay, bx - ax) * 180) / Math.PI + 180})`}><path d="M-34,0 L30,-5 L40,0 L30,5Z" fill="#E6E9EE" /><path d="M0,0 L-14,-26 L-4,-26 L14,0Z" fill="#C9CED6" /><path d="M0,0 L-14,26 L-4,26 L14,0Z" fill="#C9CED6" /></g>
          ) : Array.from({ length: 6 }, (_, i) => { const qq = md(t * 0.4 + i / 6, 1); const x = (1 - qq) ** 2 * ax + 2 * (1 - qq) * qq * mx + qq * qq * bx, y = (1 - qq) ** 2 * ay + 2 * (1 - qq) * qq * my + qq * qq * by; return <g key={i}><circle cx={x} cy={y} r={11} fill={X.amber} /><circle cx={x} cy={y} r={26} fill="url(#pGlowA)" /></g>; })}
          <circle cx={bx} cy={by} r={10} fill={mode === "malta" ? X.amber : X.red} />
          <circle cx={bx} cy={by} r={40 + 20 * Math.sin(t * 4)} fill="none" stroke={mode === "malta" ? X.amber : X.red} strokeWidth={3} opacity={0.5} />
        </g>
      )}
      {mode === "vlora" && (() => { const [vx, vy] = mp(...CITY.VLORA); const r = md(t * 0.8, 1); return <g><circle cx={vx} cy={vy} r={12} fill={X.red} /><circle cx={vx} cy={vy} r={120 * r} fill="none" stroke={X.red} strokeWidth={4} opacity={1 - r} /><circle cx={vx} cy={vy} r={200} fill="url(#pGlowR)" opacity={0.6} /></g>; })()}
      {labels.map((n) => { const c = CITY[n]; if (!c) return null; const [x, y] = mp(...c); return <g key={n}><circle cx={x} cy={y} r={7} fill="#FFF" /><rect x={x + 14} y={y - 38} width={n.length * 17 + 26} height={36} rx={6} fill="#0B0F15" opacity={0.85} />{T(x + 27, y - 12, n, 24, "#FFF", 700)}</g>; })}
    </g>
  );
};

// ───────── TELEFON + uygulama ekranları (yerel 360x740) ─────────
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode; glow?: string; hand?: boolean }> = ({ x, y, s = 1, rot = 0, children, glow = X.cyan, hand = true }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={420} ry={520} fill={glow === X.red ? "url(#pGlowR)" : glow === X.amber ? "url(#pGlowA)" : "url(#pGlowC)"} opacity={0.35} />
    {hand && <path d="M-210,260 Q-240,120 -200,40 L-180,40 Q-170,160 -140,240 L180,420 L-260,520Z" fill="#2A2F3A" />}
    <rect x={-200} y={-400} width={400} height={800} rx={52} fill="#0A0C10" stroke="#262B34" strokeWidth={6} />
    <svg x={-180} y={-370} width={360} height={740} viewBox="0 0 360 740"><rect width={360} height={740} rx={30} fill="#0D1118" />{children}</svg>
    <rect x={-50} y={-388} width={100} height={18} rx={9} fill="#000" />
    {hand && <path d="M200,60 Q250,80 240,180 Q230,260 180,300 L170,120Z" fill="#2A2F3A" />}
  </g>
);
const fmt = (v: number) => Math.round(v).toLocaleString("tr-TR");
export const AppBal: React.FC<{ t: number; a?: number; total?: number; up?: boolean; dim?: number }> = ({ t, a = 0, total = 48250, up = true, dim = 0 }) => {
  const rows: [string, string, number][] = [["BTC", "Bitcoin", 0.38], ["DOGE", "Dogecoin", 0.34], ["ETH", "Ethereum", 0.18], ["TRY", "Türk Lirası", 0.1]];
  const wob = up ? 1 + Math.sin(t * 1.3) * 0.004 + (t - a) * 0.004 : 1;
  return (
    <g>
      <rect width={360} height={90} fill="#121924" />
      {T(24, 56, "KRİPTO BORSASI", 22, X.amber, 700)}
      {T(24, 140, "Toplam varlık", 18, X.dim, 600)}
      {T(24, 196, `${fmt(total * wob)} ₺`, 46, "#FFF", 700)}
      {T(24, 232, up ? "▲ %4,2 bugün" : "—", 18, up ? "#3DDC84" : X.dim, 700)}
      {rows.map(([s, n, f], i) => (
        <g key={s} transform={`translate(0,${280 + i * 92})`}>
          <rect x={16} y={0} width={328} height={78} rx={14} fill="#151C27" />
          <circle cx={56} cy={39} r={22} fill={["#F7931A", "#C2A633", "#627EEA", "#E30A17"][i]} opacity={0.85} />
          {T(56, 46, s[0], 20, "#111", 700, "middle")}
          {T(92, 34, s, 20, "#FFF", 700)}{T(92, 60, n, 15, X.dim, 500)}
          {T(330, 46, `${fmt(total * f * wob)} ₺`, 20, "#FFF", 700, "end")}
        </g>
      ))}
      <rect x={24} y={660} width={150} height={56} rx={14} fill="#1E8F5A" />{T(99, 696, "Yatır", 22, "#FFF", 700, "middle")}
      <rect x={186} y={660} width={150} height={56} rx={14} fill="#2A3342" />{T(261, 696, "Para Çek", 22, "#FFF", 700, "middle")}
      {dim > 0 && <rect width={360} height={740} fill="#000" opacity={dim * 0.7} />}
    </g>
  );
};
export const AppMaint: React.FC<{ t: number; a?: number; days?: boolean; closed?: boolean }> = ({ t, a = 0, days = true, closed = false }) => (
  <g>
    <rect width={360} height={740} fill="#0B0E14" />
    <g transform={`translate(180,250) rotate(${closed ? 0 : (t - a) * 40})`} opacity={closed ? 0.3 : 1}>
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-12} y={-78} width={24} height={30} rx={4} fill={X.amber} transform={`rotate(${i * 45})`} />)}
      <circle r={56} fill={X.amber} /><circle r={24} fill="#0B0E14" />
    </g>
    {T(180, 400, closed ? "Geçici olarak" : "Bakım çalışması", 30, "#FFF", 700, "middle")}
    {T(180, 440, closed ? "kapalı" : "yapılmaktadır", 30, "#FFF", 700, "middle")}
    {days && T(180, 500, closed ? "" : "Tahmini süre: 4-5 iş günü", 18, X.dim, 600, "middle")}
    <rect x={40} y={600} width={280} height={56} rx={14} fill="#1A1F28" />{T(180, 636, "Para Çek  ✕", 22, "#555C68", 700, "middle")}
  </g>
);

// Çok telefon: insanlar aynı anda açıyor
export const PhoneWall: React.FC<{ t: number; a: number; flip?: number; cols?: number }> = ({ t, a, flip = 1.2, cols = 7 }) => (
  <g>
    <rect width={1920} height={1080} fill="#06080C" />
    {Array.from({ length: cols * 3 }, (_, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      const x = 140 + c * (1640 / (cols - 1)), y = 200 + r * 340 + (c % 2) * 40;
      const off = t > a + flip + hash(i * 3.7) * 1.6;
      return (
        <g key={i} transform={`translate(${x},${y}) scale(0.34) rotate(${(hash(i) - 0.5) * 10})`}>
          <rect x={-200} y={-400} width={400} height={800} rx={52} fill="#0A0C10" stroke="#262B34" strokeWidth={8} />
          <svg x={-180} y={-370} width={360} height={740} viewBox="0 0 360 740">{off ? <AppMaint t={t + i} a={a} /> : <AppBal t={t} a={a} total={4000 + hash(i * 9) * 90000} />}</svg>
          <ellipse cx={0} cy={0} rx={360} ry={460} fill={off ? "url(#pGlowA)" : "url(#pGlowC)"} opacity={0.25} />
        </g>
      );
    })}
  </g>
);

// ───────── EKRAN ↔ KASA (analoji) ─────────
// fill: kasadaki gerçek (0..1), shown: ekrandaki rakam
export const ScreenVault: React.FC<{ t: number; a: number; shown?: number; fill?: number; drain?: number; open?: number; key2?: boolean }> = ({ t, a, shown = 1000, fill = 1, drain, open = 0.6, key2 = false }) => {
  const f = drain !== undefined ? lp(fill, 0, rp(t, a + drain, a + drain + 2.2)) : fill;
  const ok = rp(t, a + 0.2, a + 0.2 + open);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0D12" />
      <rect x={0} y={820} width={1920} height={260} fill="#090B0F" />
      {/* ekran */}
      <g transform="translate(160,230)">
        <rect x={-12} y={-12} width={704} height={444} rx={16} fill="#05070A" />
        <rect width={680} height={420} rx={8} fill="#0E1520" />
        {T(40, 70, "EKRAN", 30, X.cyan, 700, "start", { letterSpacing: 6 } as React.SVGProps<SVGTextElement>)}
        {T(40, 130, "Senin hesabın", 30, X.dim, 600)}
        {T(40, 250, `${fmt(shown)} $`, 110, "#FFF", 700)}
        <rect width={680} height={420} fill="url(#pScan)" />
        <ellipse cx={340} cy={210} rx={500} ry={340} fill="url(#pGlowC)" opacity={0.25} />
        <rect x={300} y={432} width={80} height={120} fill="#141820" />
      </g>
      {T(960, 470, "≠", 140, f < 0.5 ? X.red : "#3A4252", 700, "middle")}
      {/* kasa */}
      <g transform="translate(1180,170)">
        <rect width={600} height={620} rx={20} fill="#2A3240" stroke="#3A4456" strokeWidth={10} />
        <rect x={40} y={40} width={520} height={540} rx={12} fill="#0D1016" />
        {Array.from({ length: 12 }, (_, i) => {
          const r = Math.floor(i / 3), c = i % 3;
          const show = (11 - i) / 12 < f;
          return show ? <g key={i}><rect x={70 + c * 160} y={470 - r * 120} width={140} height={90} rx={6} fill="#2F7A4F" /><rect x={70 + c * 160} y={500 - r * 120} width={140} height={30} fill="#E9E4D8" opacity={0.85} /></g> : null;
        })}
        {f < 0.05 && T(300, 330, "BOŞ", 90, X.red, 700, "middle")}
        {/* kapı */}
        <g transform={`translate(${40},40)`}>
          <g transform={`scale(${1 - ok * 0.92},1)`}>
            <rect width={520} height={540} rx={12} fill="#3B4556" stroke="#566278" strokeWidth={6} />
            <circle cx={260} cy={270} r={110} fill="none" stroke="#7A879C" strokeWidth={14} />
            {Array.from({ length: 6 }, (_, i) => <line key={i} x1={260} y1={270} x2={260 + Math.cos(i + t * 0.4) * 100} y2={270 + Math.sin(i + t * 0.4) * 100} stroke="#7A879C" strokeWidth={10} />)}
          </g>
        </g>
        {T(300, 690, "KASA", 30, X.amber, 700, "middle", { letterSpacing: 6 } as React.SVGProps<SVGTextElement>)}
      </g>
      {key2 && <g transform={`translate(1480,${900 + Math.sin(t * 2) * 8}) rotate(${Math.sin(t) * 8})`}><circle r={40} fill="none" stroke={X.amber} strokeWidth={14} /><rect x={36} y={-8} width={140} height={16} fill={X.amber} /><rect x={140} y={8} width={14} height={30} fill={X.amber} /><rect x={110} y={8} width={14} height={22} fill={X.amber} /><circle r={120} fill="url(#pGlowA)" opacity={0.5} /></g>}
    </g>
  );
};

// ───────── DÖVİZ BÜROSU (analoji) ─────────
export const Kiosk: React.FC<{ t: number; a: number; give?: number; empty?: boolean }> = ({ t, a, give = 1.2, empty = false }) => {
  const g = gait(t, a, a + give, 220, 620, 150);
  return (
    <g>
      <rect width={1920} height={1080} fill="#151A22" />
      <rect x={0} y={760} width={1920} height={320} fill="#0E1116" />
      <rect x={820} y={120} width={980} height={110} fill="#0B0E13" />
      {T(1310, 195, "DÖVİZ", 64, X.amber, 700, "middle", { letterSpacing: 14 } as React.SVGProps<SVGTextElement>)}
      {[["USD", "34,20"], ["EUR", "37,10"], ["ALTIN", "2.890"]].map(([c, v], i) => <g key={c}>{T(880 + i * 320, 300, c, 34, X.dim, 700)}{T(880 + i * 320, 350, v, 40, "#3DDC84", 700)}</g>)}
      {/* kasa arkada */}
      <g transform="translate(1500,420)"><rect width={260} height={300} rx={14} fill="#2A3240" stroke="#3A4456" strokeWidth={8} /><circle cx={130} cy={150} r={60} fill="none" stroke="#7A879C" strokeWidth={10} />{empty && <circle cx={130} cy={150} r={140} fill="url(#pGlowR)" opacity={0.5 + 0.3 * Math.sin(t * 4)} />}</g>
      <Sil x={1240} y={900} s={1.25} t={t} kind="suit" pose="hold" rim={X.amber} seed={4} dir={-1} />
      <rect x={820} y={640} width={980} height={260} fill="#2A2420" />
      <rect x={800} y={620} width={1020} height={30} fill="#3A3028" />
      <Sil x={g.x} y={1060} s={1.4} t={t} kind="casual" pose={g.moving ? "stand" : "hold"} walk={g.walk} rim={X.cyan} seed={9} />
      {!g.moving && <g transform={`translate(${g.x + 120},${780 - rp(t, a + give + 0.2, a + give + 0.8) * 60})`}><rect x={-50} y={-28} width={100} height={56} rx={6} fill="#C9B26B" />{T(0, 10, "₺", 32, "#5A4A20", 700, "middle")}</g>}
    </g>
  );
};

// ───────── PASAPORT KONTROLÜ ─────────
export const Gate: React.FC<{ t: number; a: number; time?: string; pass?: number }> = ({ t, a, time = "17:57", pass = 0.6 }) => {
  const g = gait(t, a + pass, a + pass + 4, 300, 1650, 160);
  const blink = Math.floor(t * 2) % 2 === 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#10151D" />
      <rect x={0} y={0} width={1920} height={140} fill="#0A0E14" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={60 + i * 190} y={40} width={150} height={20} rx={10} fill="#E8F4FF" opacity={0.6} />)}
      <rect x={0} y={680} width={1920} height={400} fill="url(#pFloor)" />
      <g transform="translate(160,200)"><rect width={560} height={130} fill="#05070A" stroke="#2A3240" strokeWidth={4} />{T(30, 50, "PASAPORT KONTROL", 30, X.amber, 700)}{T(30, 104, "DIŞ HATLAR · GİDİŞ", 28, "#9AA4B2", 700)}</g>
      {/* dijital saat */}
      <g transform="translate(1500,260)"><rect x={-180} y={-80} width={360} height={150} rx={10} fill="#05070A" stroke="#2A3240" strokeWidth={4} />{T(0, 40, blink ? time : time.replace(":", " "), 96, X.red, 700, "middle")}<ellipse cx={0} cy={0} rx={260} ry={140} fill="url(#pGlowR)" opacity={0.35} /></g>
      {/* kabinler */}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${560 + i * 420},560)`}><rect x={-140} y={-60} width={280} height={240} fill="#1E2632" /><rect x={-140} y={-80} width={280} height={30} fill="#2A3442" /><rect x={-120} y={-40} width={240} height={110} fill="#0D1118" /><circle cx={0} cy={-120} r={14} fill={i === 1 ? "#3DDC84" : "#3A1A1A"} /><Sil x={0} y={120} s={0.8} t={t} kind="suit" pose="type" rim="#2E3A4C" seed={30 + i} /></g>)}
      <Sil x={g.x} y={1010} s={1.4} t={t} kind="coat" pose="bag" walk={g.walk} rim={X.amber} seed={2} hair="short" />
    </g>
  );
};

// ───────── GECE UÇAĞI · şehir ışıkları ─────────
export const NightPlane: React.FC<{ t: number; a: number; board?: string }> = ({ t, a, board = "TİRAN  19:50" }) => {
  const k = cl((t - a) / 6);
  const px = lp(300, 1700, k), py = lp(760, 260, k ** 1.3);
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#pSkyN)" />
      {Array.from({ length: 80 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i + 9) * 500} r={1 + hash(i * 3) * 1.4} fill="#FFF" opacity={0.25 + 0.3 * Math.sin(t * 2 + i)} />)}
      <path d="M0,800 Q500,760 960,790 Q1400,820 1920,780 L1920,1080 L0,1080Z" fill="#070A10" />
      {Array.from({ length: 260 }, (_, i) => <circle key={`c${i}`} cx={hash(i * 2.1) * 1920} cy={800 + hash(i * 5.3) * 280} r={1.5 + hash(i) * 2} fill={["#FFCF7A", "#FFE9C2", "#FF9A4A"][i % 3]} opacity={0.4 + 0.4 * Math.sin(t * 1.5 + i)} />)}
      <rect x={0} y={880} width={1920} height={14} fill="#1A2030" />
      {Array.from({ length: 24 }, (_, i) => <circle key={`r${i}`} cx={i * 82} cy={887} r={4} fill={i % 2 ? X.amber : "#FFF"} opacity={0.6 + 0.4 * Math.sin(t * 6 - i)} />)}
      <g transform={`translate(${px},${py}) rotate(-18) scale(1.6)`}>
        <path d="M-120,0 L110,-10 L140,0 L110,10Z" fill="#C8CDD6" />
        <path d="M0,0 L-40,-70 L-10,-70 L50,0Z" fill="#AEB4BF" /><path d="M-100,0 L-120,-40 L-100,-40 L-80,0Z" fill="#AEB4BF" />
        <circle cx={135} cy={0} r={4} fill={Math.sin(t * 7) > 0 ? X.red : "#FFF"} />
        <circle cx={-10} cy={-60} r={50} fill="url(#pGlowR)" opacity={Math.sin(t * 7) > 0 ? 0.6 : 0} />
      </g>
      <g transform="translate(120,110)"><rect width={540} height={120} fill="#05070A" stroke="#2A3240" strokeWidth={4} />{T(24, 44, "KALKIŞ · 20 NİSAN 2021", 24, X.amber, 700)}{T(24, 96, board, 40, "#FFF", 700)}</g>
    </g>
  );
};

// ───────── X-RAY BANDI · soğuk cüzdan ─────────
export const XRay: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const x = lp(-200, 2000, cl((t - a) / 5));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C1016" />
      <rect x={0} y={620} width={1920} height={60} fill="#1A1F28" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={md(i * 60 + t * 120, 2400) - 200} y={630} width={4} height={40} fill="#2A303A" />)}
      <rect x={700} y={330} width={520} height={360} rx={20} fill="#2C3440" /><rect x={760} y={420} width={400} height={240} fill="#05070A" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={760 + i * 50} y={420} width={46} height={240} fill="#111" opacity={0.6} />)}
      <g transform={`translate(${x},590)`}>
        <rect x={-110} y={-70} width={220} height={100} rx={16} fill="#3A2E28" />
        <rect x={-30} y={-110} width={60} height={50} rx={10} fill="none" stroke="#3A2E28" strokeWidth={10} />
        <g transform="translate(40,-40)"><rect x={-20} y={-10} width={40} height={22} rx={4} fill="#1A1A1A" stroke={X.amber} strokeWidth={2} /><circle r={30} fill="url(#pGlowA)" opacity={0.5} /></g>
      </g>
      {/* monitör */}
      <g transform="translate(1340,140)">
        <rect width={480} height={320} rx={10} fill="#05070A" stroke="#2A3240" strokeWidth={4} />
        <rect x={20} y={20} width={440} height={280} fill="#0C2030" />
        {x > 600 && x < 1400 && <g><rect x={170} y={120} width={140} height={70} rx={10} fill="none" stroke="#5FC3FF" strokeWidth={4} /><rect x={270} y={140} width={22} height={12} fill="#5FC3FF" opacity={0.8} /></g>}
        {T(240, 270, x > 600 && x < 1400 ? "küçük cihaz · ?" : "", 26, "#9FD8FF", 700, "middle")}
      </g>
    </g>
  );
};
// soğuk cüzdan yakın plan (avuçta)
export const ColdWallet: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = rp(t, a + 0.3, a + 1.2);
  return (
    <g>
      <rect width={1920} height={1080} fill="#08090C" />
      <ellipse cx={960} cy={600} rx={700} ry={420} fill="url(#pGlowA)" opacity={0.25} />
      <path d="M560,1080 Q600,760 760,700 Q960,650 1180,700 Q1360,760 1380,1080Z" fill="#2A2F3A" />
      <g transform={`translate(960,${700 - k * 40}) rotate(${-8 + Math.sin(t) * 2})`}>
        <rect x={-180} y={-60} width={360} height={120} rx={24} fill="#15181E" stroke="#3A404C" strokeWidth={4} />
        <rect x={-120} y={-36} width={180} height={72} rx={8} fill="#0A0C10" />
        {T(-30, 10, typed("● ● ● ●", k), 28, X.amber, 700, "middle")}
        <circle cx={120} cy={0} r={22} fill="#2A2F3A" /><rect x={180} y={-16} width={40} height={32} rx={4} fill="#9AA4B2" />
      </g>
      <g opacity={rp(t, a + 1.0, a + 1.6)}>{T(960, 300, "İnternete bağlı değil", 52, "#FFF", 700, "middle")}{T(960, 370, "cebe sığan bir kasa", 40, X.amber, 600, "middle")}</g>
    </g>
  );
};

// ───────── VLORA · sahil villası + baskın ─────────
export const Villa: React.FC<{ t: number; a: number; raid?: number; clock?: string }> = ({ t, a, raid = 1.0, clock = "08:30" }) => {
  const on = t > a + raid;
  const g = on ? gait(t, a + raid, a + raid + 3, 1900, 1250, 160) : null;
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#pSkyD)" />
      <circle cx={420} cy={180} r={70} fill="#FFF3D0" opacity={0.9} />
      <rect x={0} y={560} width={1920} height={140} fill="url(#pSea)" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${md(i * 300 - t * 20, 2200) - 150},${590 + (i % 3) * 30} q40,-8 80,0 t80,0`} stroke="#B9D4EA" strokeWidth={2} fill="none" opacity={0.5} />)}
      <path d="M0,520 Q300,470 620,540 L0,560Z" fill="#6E8A6A" opacity={0.7} />
      <rect x={0} y={700} width={1920} height={380} fill="#C9BFA8" />
      <g transform="translate(980,330)">
        <rect width={640} height={380} fill="#EDE6D6" /><rect x={-30} y={-20} width={700} height={40} fill="#B85C3A" />
        {[[40, 80], [240, 80], [440, 80]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={150} height={120} fill="#4A6A88" /><rect x={x} y={y} width={150} height={120} fill="none" stroke="#FFF" strokeWidth={8} /></g>)}
        <rect x={260} y={240} width={120} height={140} fill="#5A3A28" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-60 - i * 60},380 Q${-80 - i * 60},${200 + i * 20} ${-40 - i * 60},${120 + i * 30}`} stroke="#3E5A3C" strokeWidth={12} fill="none" />)}
      </g>
      {on && [0, 1].map((i) => <g key={i} transform={`translate(${380 + i * 380},860)`}><rect x={-150} y={-70} width={300} height={90} rx={20} fill="#E8E8E8" /><rect x={-150} y={-20} width={300} height={22} fill="#1E3C8C" /><rect x={-60} y={-110} width={120} height={46} rx={10} fill="#DDD" /><rect x={-50} y={-122} width={44} height={16} fill={Math.sin(t * 10 + i) > 0 ? "#2B5BFF" : "#333"} /><rect x={6} y={-122} width={44} height={16} fill={Math.sin(t * 10 + i) > 0 ? "#333" : X.red} /><circle cx={0} cy={-114} r={90} fill={Math.sin(t * 10 + i) > 0 ? "url(#pGlowC)" : "url(#pGlowR)"} opacity={0.7} />{[-90, 90].map((w) => <circle key={w} cx={w} cy={22} r={28} fill="#1A1A1A" />)}</g>)}
      {g && [0, 1, 2].map((i) => <Sil key={i} x={g.x + i * 150} y={1040} s={1.2} t={t} kind="coat" pose={i === 0 && !g.moving ? "badge" : "stand"} walk={g.walk} dir={-1} rim="#2B5BFF" seed={70 + i} />)}
      <g transform="translate(120,90)"><rect width={360} height={110} rx={10} fill="#05070A" opacity={0.85} />{T(30, 72, `VLORA · ${clock}`, 44, X.amber, 700)}</g>
      {on && <rect width={1920} height={1080} fill={Math.sin(t * 10) > 0 ? "#2B5BFF" : X.red} opacity={0.05} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

// ───────── BİYOMETRİK EŞLEŞME ─────────
export const Biometric: React.FC<{ t: number; a: number; match?: number; fake?: string }> = ({ t, a, match = 2.4, fake = "SAHTE İSİM" }) => {
  const scan = md((t - a) * 0.8, 1);
  const ok = t > a + match;
  return (
    <g>
      <rect width={1920} height={1080} fill="#060A10" />
      <rect width={1920} height={1080} fill="url(#pGrid)" />
      {/* parmak izi */}
      <g transform="translate(560,540)">
        {Array.from({ length: 11 }, (_, i) => <ellipse key={i} cx={0} cy={0} rx={30 + i * 18} ry={44 + i * 22} fill="none" stroke={ok ? "#3DDC84" : X.cyan} strokeWidth={5} strokeDasharray={`${40 + i * 6} ${8 + (i % 3) * 6}`} opacity={0.75} />)}
        {!ok && <rect x={-240} y={-300 + scan * 600} width={480} height={6} fill={X.cyan} opacity={0.9} />}
      </g>
      {/* yüz çerçevesi */}
      <g transform="translate(1340,520)">
        <rect x={-230} y={-290} width={460} height={580} rx={12} fill="#0C121B" stroke={ok ? "#3DDC84" : "#2A3850"} strokeWidth={4} />
        <ellipse cx={0} cy={-40} rx={110} ry={140} fill={X.sil} /><path d="M-190,290 Q-170,110 0,100 Q170,110 190,290Z" fill={X.sil} />
        {[[-60, -70], [60, -70], [0, 0], [-50, 60], [50, 60]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y - 20} r={6} fill={ok ? "#3DDC84" : X.cyan} />{i > 0 && <line x1={x} y1={y - 20} x2={[-60, 60, 0, -50, 50][i - 1]} y2={[-70, -70, 0, 60, 60][i - 1] - 20} stroke={ok ? "#3DDC84" : X.cyan} strokeWidth={2} opacity={0.6} />}</g>)}
        {[[-230, -290], [230, -290], [-230, 290], [230, 290]].map(([x, y], i) => <path key={i} d={`M${x},${y + (y < 0 ? 40 : -40)} L${x},${y} L${x + (x < 0 ? 40 : -40)},${y}`} stroke={X.amber} strokeWidth={6} fill="none" />)}
      </g>
      <g transform="translate(960,160)">
        <rect x={-380} y={-50} width={760} height={90} rx={10} fill="#0B0F15" stroke={ok ? "#3DDC84" : X.red} strokeWidth={3} />
        {T(0, 12, ok ? "KİMLİK DOĞRULANDI" : `BEYAN: ${fake}`, 40, ok ? "#3DDC84" : X.red, 700, "middle")}
      </g>
      {T(560, 960, "PARMAK İZİ", 30, X.dim, 700, "middle")}{T(1340, 960, "YÜZ TANIMA", 30, X.dim, 700, "middle")}
    </g>
  );
};

// ───────── ALTIN ─────────
export const Gold: React.FC<{ t: number; a: number; label?: string }> = ({ t, a, label = "52 kg 287 g" }) => {
  const n = 30;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0906" />
      <ellipse cx={960} cy={660} rx={800} ry={420} fill="url(#pGlowA)" opacity={0.4} />
      <rect x={0} y={840} width={1920} height={240} fill="#14100A" />
      {Array.from({ length: n }, (_, i) => {
        const row = [0, 8, 15, 21, 26, 30].findIndex((v) => v > i) - 1;
        const starts = [0, 8, 15, 21, 26];
        const inRow = i - starts[row];
        const perRow = [8, 7, 6, 5, 4][row];
        const x = 960 + (inRow - (perRow - 1) / 2) * 150, y = 820 - row * 70;
        const k = rp(t, a + 0.1 + i * 0.05, a + 0.4 + i * 0.05);
        return <g key={i} transform={`translate(${x},${y - (1 - k) * 300})`} opacity={k}><path d="M-66,0 L66,0 L52,-60 L-52,-60Z" fill="#D9A93A" /><path d="M-52,-60 L52,-60 L44,-68 L-44,-68Z" fill="#F5D271" /><rect x={-30} y={-42} width={60} height={14} fill="#B8862A" opacity={0.6} /></g>;
      })}
      {Array.from({ length: 12 }, (_, i) => { const sx = 600 + hash(i * 4) * 720, sy = 420 + hash(i * 9) * 380, f = Math.max(0, Math.sin(t * 3 + i * 2)); return <path key={i} d={`M${sx - 14 * f},${sy} L${sx + 14 * f},${sy} M${sx},${sy - 14 * f} L${sx},${sy + 14 * f}`} stroke="#FFF6D0" strokeWidth={3} opacity={f} />; })}
      <g opacity={rp(t, a + 1.4, a + 2)}>{T(960, 180, label, 110, X.amber, 700, "middle")}</g>
    </g>
  );
};

// ───────── CEZAEVİ KORİDORU (kişi yok) ─────────
export const Corridor: React.FC<{ t: number; label?: string }> = ({ t, label }) => (
  <g>
    <rect width={1920} height={1080} fill="#121519" />
    <path d="M0,0 L780,400 L1140,400 L1920,0Z" fill="#1A1E24" />
    <path d="M0,1080 L780,660 L1140,660 L1920,1080Z" fill="#20252C" />
    <path d="M0,0 L780,400 L780,660 L0,1080Z" fill="#171B21" />
    <path d="M1920,0 L1140,400 L1140,660 L1920,1080Z" fill="#15191E" />
    <rect x={780} y={400} width={360} height={260} fill="#0A0C0F" />
    {Array.from({ length: 5 }, (_, i) => { const k = i / 5; const y = lp(30, 390, k ** 0.7); const w = lp(380, 100, k ** 0.7); return <rect key={i} x={960 - w / 2} y={y} width={w} height={lp(22, 5, k)} fill="#DDE6EE" opacity={(hash(Math.floor(t * 6) + i) > 0.95 ? 0.2 : 0.55)} />; })}
    {[0.12, 0.34, 0.56].map((k, i) => { const x = lp(0, 780, k), y = lp(0, 400, k), h = lp(1080, 660, k) - y; return <g key={i}><rect x={x + 30} y={y + h * 0.22} width={lp(160, 46, k)} height={h * 0.64} fill="#3A4048" /><rect x={x + 30 + lp(50, 14, k)} y={y + h * 0.3} width={lp(60, 18, k)} height={lp(26, 8, k)} fill="#0A0C0F" /></g>; })}
    {[0.2, 0.45].map((k, i) => { const x = lp(1920, 1140, k), y = lp(0, 400, k), h = lp(1080, 660, k) - y; return <rect key={i} x={x - lp(190, 60, k)} y={y + h * 0.22} width={lp(160, 46, k)} height={h * 0.64} fill="#353B43" />; })}
    {label && <g><rect x={660} y={830} width={600} height={90} rx={8} fill="#05070A" opacity={0.8} />{T(960, 890, label, 40, "#C9CED6", 700, "middle")}</g>}
  </g>
);

// ───────── SOKAK · Bitcoin ATM ─────────
export const AtmStreet: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSkyN)" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 230 - 40} y={260 - hash(i) * 160} width={210} height={900} fill={["#141A26", "#171E2B", "#121722"][i % 3]} />)}
    {Array.from({ length: 90 }, (_, i) => <rect key={`w${i}`} x={hash(i * 9) * 1920} y={160 + hash(i * 4) * 520} width={20} height={26} fill="#FFCF7A" opacity={hash(i * 2) > 0.5 ? 0.5 : 0.1} />)}
    <rect x={0} y={820} width={1920} height={260} fill="#14171C" />
    <rect x={0} y={810} width={1920} height={14} fill="#2A2F38" />
    <g transform="translate(1100,440)">
      <ellipse cx={110} cy={180} rx={360} ry={300} fill="url(#pGlowA)" opacity={0.5} />
      <rect width={220} height={380} rx={16} fill="#1C222C" stroke={X.amber} strokeWidth={4} />
      <rect x={20} y={20} width={180} height={60} rx={8} fill={X.amber} />{T(110, 64, "₿  ATM", 34, "#111", 700, "middle")}
      <rect x={30} y={110} width={160} height={110} rx={6} fill="#0E1520" />{T(110, 175, "BTC", 30, X.cyan, 700, "middle")}
      <rect x={60} y={250} width={100} height={12} rx={6} fill="#05070A" /><rect x={60} y={300} width={100} height={40} rx={6} fill="#2A3240" />
    </g>
    <Sil x={880} y={1000} s={1.3} t={t} kind="casual" pose="phone" rim={X.amber} seed={12} />
  </g>
);

// ───────── ÇEKİLİŞ · spor araba ─────────
export const CarDraw: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = rp(t, a + 0.2, a + 1.4);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0B10" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${700 + i * 260},0 L${760 + i * 260},0 L${900 + i * 120},1080 L${560 + i * 300},1080Z`} fill="#FFF1D0" opacity={0.07} />)}
      <ellipse cx={960} cy={860} rx={700} ry={90} fill="#1A1C24" />
      <g transform={`translate(960,800) scale(${lp(0.9, 1.05, k)})`}>
        <path d="M-520,0 L-500,-90 Q-420,-120 -260,-130 Q-160,-230 40,-230 Q220,-230 330,-140 Q480,-130 520,-80 L530,0Z" fill="#C9C9CF" />
        <path d="M-140,-140 Q-80,-210 40,-212 Q170,-210 250,-140Z" fill="#1C2430" />
        <rect x={-500} y={-40} width={1030} height={14} fill="#9A9AA2" />
        {[-320, 320].map((x) => <g key={x}><circle cx={x} cy={0} r={86} fill="#111" /><circle cx={x} cy={0} r={46} fill="#5A5A62" /></g>)}
        <path d="M-60,-232 L-60,10 M-560,-60 L560,-60" stroke={X.red} strokeWidth={22} opacity={0.9} />
        <g transform="translate(-60,-240)"><circle cx={-30} cy={0} r={30} fill={X.red} /><circle cx={30} cy={0} r={30} fill={X.red} /></g>
      </g>
      {Array.from({ length: 50 }, (_, i) => { const x = hash(i) * 1920, y = md(hash(i * 3) * 1080 + t * (120 + hash(i) * 120), 1200) - 100; return <rect key={i} x={x} y={y} width={12} height={20} fill={[X.amber, X.red, X.cyan, "#FFF"][i % 4]} transform={`rotate(${t * 200 + i * 40},${x},${y})`} opacity={0.8} />; })}
      <g opacity={k}>{T(960, 200, "ÇEKİLİŞ", 110, X.amber, 700, "middle")}</g>
    </g>
  );
};

// ───────── FİYAT GRAFİĞİ ─────────
export const PriceChart: React.FC<{ t: number; a: number; sym?: string; pct?: string; crash?: number; dur?: number }> = ({ t, a, sym = "DOGE", pct = "+%20", crash, dur = 3 }) => {
  const k = cl((t - a) / dur);
  const N = 60;
  const yv = (i: number) => {
    const u = i / N;
    let v = 0.15 + u * u * 0.75 + Math.sin(i * 1.7) * 0.03 + Math.sin(i * 0.6) * 0.04;
    if (crash !== undefined && u > crash) v = 0.9 - (u - crash) * 3;
    return 900 - Math.max(0.02, v) * 700;
  };
  const shown = Math.max(2, Math.floor(k * N));
  const d = Array.from({ length: shown }, (_, i) => `${i ? "L" : "M"}${200 + (i / N) * 1520},${yv(i)}`).join(" ");
  const last = yv(shown - 1);
  const down = crash !== undefined && shown / N > crash;
  return (
    <g>
      <rect width={1920} height={1080} fill="#070A10" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={200} x2={1720} y1={200 + i * 100} y2={200 + i * 100} stroke="#FFF" opacity={0.05} />)}
      <path d={`${d} L${200 + ((shown - 1) / N) * 1520},900 L200,900Z`} fill={down ? X.red : "#3DDC84"} opacity={0.1} />
      <path d={d} stroke={down ? X.red : "#3DDC84"} strokeWidth={6} fill="none" />
      <circle cx={200 + ((shown - 1) / N) * 1520} cy={last} r={12} fill={down ? X.red : "#3DDC84"} />
      <g transform="translate(240,140)"><circle r={44} fill="#C2A633" />{T(0, 16, sym[0], 48, "#3A2E08", 700, "middle")}{T(70, 16, sym, 48, "#FFF", 700)}{T(260, 16, pct, 48, down ? X.red : "#3DDC84", 700)}</g>
    </g>
  );
};

// ───────── KOMİSYON (analoji) ─────────
export const Commission: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0E14" />
    <Sil x={360} y={900} s={1.3} t={t} kind="casual" pose="hold" rim={X.cyan} seed={14} />
    <Sil x={1560} y={900} s={1.3} t={t} kind="coat" pose="hold" rim={X.cyan} seed={15} dir={-1} />
    {Array.from({ length: 10 }, (_, i) => { const q = md(t * 0.5 + i / 10, 1); const x = lp(480, 1440, q), y = 520 - Math.sin(q * Math.PI) * 160; return <g key={i}><circle cx={x} cy={y} r={20} fill={i % 2 ? "#3DDC84" : X.amber} /></g>; })}
    <g transform="translate(960,820)">
      <path d="M-110,-120 L110,-120 L90,80 L-90,80Z" fill="#1A222E" stroke={X.amber} strokeWidth={4} />
      {Array.from({ length: Math.min(14, Math.floor((t - a) * 3)) }, (_, i) => <circle key={i} cx={-60 + (i % 5) * 30} cy={60 - Math.floor(i / 5) * 26} r={12} fill={X.amber} />)}
      {Array.from({ length: 3 }, (_, i) => { const q = md(t * 1.2 + i / 3, 1); return <circle key={i} cx={0} cy={-330 + q * 230} r={8} fill={X.amber} opacity={1 - q * 0.3} />; })}
      {T(0, 150, "BORSA · komisyon", 32, X.amber, 700, "middle")}
    </g>
    {T(960, 160, "Her işlemden binde birkaç", 56, "#FFF", 700, "middle")}
  </g>
);

// ───────── KALABALIK · ekranda rakam (mağdurlar) ─────────
export const Crowd: React.FC<{ t: number; red?: boolean; office?: boolean }> = ({ t, red = false, office = false }) => (
  <g>
    <rect width={1920} height={1080} fill={office ? "#1A1714" : "#0C0F14"} />
    {office && <g><rect x={560} y={120} width={800} height={110} fill="#0B0E13" />{T(960, 196, "AVUKATLIK BÜROSU", 56, "#C9B26B", 700, "middle")}<rect x={760} y={260} width={400} height={560} fill="#2A2018" /><circle cx={1120} cy={560} r={10} fill="#C9A23A" /></g>}
    {Array.from({ length: 3 }, (_, r) => Array.from({ length: 9 }, (_, i) => {
      const x = 80 + i * 220 + (r % 2) * 110, y = 860 + r * 110;
      const ph = hash(i * 5 + r * 9) > 0.35;
      return <g key={`${r}-${i}`}><Sil x={x} y={y} s={1.0 + r * 0.12} t={t} kind={["casual", "coat", "suit"][(i + r) % 3] as "casual"} pose={ph ? "phone" : "stand"} back rim={red ? X.red : X.cyan2} seed={r * 10 + i} hair={(i + r) % 3 ? "short" : "long"} op={0.95} />{ph && <circle cx={x - 20} cy={y - 330 * (1.0 + r * 0.12)} r={50} fill={red ? "url(#pGlowR)" : "url(#pGlowC)"} opacity={0.8} />}</g>;
    }))}
  </g>
);

// ───────── OFİS (tabelalı) ─────────
export const OfficeFront: React.FC<{ t: number; sign?: string; police?: boolean; night?: boolean }> = ({ t, sign = "KRİPTO BORSASI", police = false, night = true }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "url(#pSkyN)" : "url(#pSkyD)"} />
    <rect x={360} y={120} width={1200} height={760} fill="#1A222E" />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 10 }, (_, c) => <rect key={`${r}${c}`} x={400 + c * 114} y={160 + r * 90} width={90} height={60} fill={hash(r * 13 + c) > (police ? 0.2 : 0.5) ? "#FFE9B0" : "#0D1118"} opacity={0.7} />))}
    <rect x={560} y={700} width={800} height={110} fill="#05070A" stroke={X.amber} strokeWidth={4} />
    {T(960, 776, sign, 64, X.amber, 700, "middle", { letterSpacing: 8 } as React.SVGProps<SVGTextElement>)}
    <rect x={0} y={880} width={1920} height={200} fill="#14171C" />
    {police && [0, 1].map((i) => <g key={i}><rect x={300 + i * 1100} y={900} width={260} height={80} rx={18} fill="#DADADA" /><rect x={300 + i * 1100} y={940} width={260} height={18} fill="#1E3C8C" /><rect x={380 + i * 1100} y={872} width={100} height={30} fill={Math.sin(t * 10 + i) > 0 ? "#2B5BFF" : X.red} /><circle cx={430 + i * 1100} cy={880} r={120} fill={Math.sin(t * 10 + i) > 0 ? "url(#pGlowC)" : "url(#pGlowR)"} opacity={0.7} /></g>)}
    {police && Array.from({ length: 4 }, (_, i) => <Sil key={i} x={700 + i * 170} y={1040} s={1.1} t={t} kind="coat" pose={i % 2 ? "hold" : "stand"} back rim="#2B5BFF" seed={80 + i} />)}
  </g>
);

// ───────── e-ticaret ekranı → hacklendi (1600x900 Screen içi) ─────────
export const ShopScreen: React.FC<{ t: number; a: number; hack?: number }> = ({ t, a, hack }) => {
  const h = hack !== undefined && t > a + hack;
  return (
    <g>
      <rect width={1600} height={900} fill="#EEF1F5" />
      <rect width={1600} height={110} fill="#1E2A3A" />{T(60, 72, "online mağaza", 44, "#FFF", 700)}
      {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${80 + (i % 4) * 370},${170 + Math.floor(i / 4) * 350})`}><rect width={330} height={310} rx={14} fill="#FFF" /><rect x={20} y={20} width={290} height={180} rx={8} fill={["#C9D6E3", "#E3D2C9", "#D2E3C9", "#E3E0C9"][i % 4]} /><rect x={20} y={220} width={200} height={20} fill="#9AA4B2" /><rect x={20} y={256} width={110} height={26} fill="#1E8F5A" /></g>)}
      {h && <g><rect width={1600} height={900} fill="#2A0508" opacity={0.85 + 0.15 * Math.sin(t * 20)} />{T(800, 470, "SİSTEM ELE GEÇİRİLDİ", 90, "#FF5A5A", 700, "middle")}</g>}
    </g>
  );
};
