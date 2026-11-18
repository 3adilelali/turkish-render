import React from "react";
import { legs, Walk, hash } from "./Motion";
import { rp, lp, cl } from "./Hayat";

// Kanal 5 · Protokol X (2026-11-17). Sinematik belgesel kiti: yüzsüz lacivert siluetler + kehribar/kırmızı kenar ışığı,
// karanlık mekânlar, gerçek arayüzlere BENZEYEN ama kopya olmayan ekranlar. Her şey vektör ve frame'e bağlı.
// Kimlik: zemin #07090E, kehribar #FFB21E (marka), kırmızı #FF3B3B (tehlike), camgöbeği #46D7FF (ekran ışığı).

export const X = {
  bg: "#07090E",
  bg2: "#0D121B",
  panel: "#111824",
  line: "#1F2938",
  sil: "#121A27",
  sil2: "#1A2435",
  txt: "#EDEFF2",
  dim: "#7D8796",
  amber: "#FFB21E",
  amber2: "#FF8A00",
  red: "#FF3B3B",
  red2: "#B3121B",
  cyan: "#46D7FF",
  cyan2: "#1E8FB8",
  paper: "#E9E4D8",
};
export const UI = "Poppins";
const md = (v: number, m: number) => ((v % m) + m) % m;
export const T = (x: number, y: number, s: string, size = 24, c = X.txt, w = 600, anchor: "start" | "middle" | "end" = "start", extra: React.SVGProps<SVGTextElement> = {}) => (
  <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor} {...extra}>{s}</text>
);
export const typed = (s: string, k: number) => s.slice(0, Math.floor(cl(k) * s.length));

// ───────── ortak defs (Frame içinde bir kez) ─────────
export const PDefs: React.FC = () => (
  <defs>
    <radialGradient id="pVig" cx="0.5" cy="0.5" r="0.72"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.65" /></radialGradient>
    <radialGradient id="pGlowC" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={X.cyan} stopOpacity="0.55" /><stop offset="1" stopColor={X.cyan} stopOpacity="0" /></radialGradient>
    <radialGradient id="pGlowR" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={X.red} stopOpacity="0.6" /><stop offset="1" stopColor={X.red} stopOpacity="0" /></radialGradient>
    <radialGradient id="pGlowA" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={X.amber} stopOpacity="0.55" /><stop offset="1" stopColor={X.amber} stopOpacity="0" /></radialGradient>
    <radialGradient id="pGlowW" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFE9C2" stopOpacity="0.6" /><stop offset="1" stopColor="#FFE9C2" stopOpacity="0" /></radialGradient>
    <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B2740" /><stop offset="0.6" stopColor="#3A3550" /><stop offset="1" stopColor="#C86B45" /></linearGradient>
    <linearGradient id="pSkyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05070C" /><stop offset="1" stopColor="#16203A" /></linearGradient>
    <linearGradient id="pSkyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FA7C9" /><stop offset="1" stopColor="#D9E3EA" /></linearGradient>
    <linearGradient id="pSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24405A" /><stop offset="1" stopColor="#0B1624" /></linearGradient>
    <linearGradient id="pFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#151C28" /><stop offset="1" stopColor="#07090E" /></linearGradient>
    <linearGradient id="pShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></linearGradient>
    <pattern id="pDots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.2" fill="#2E3B52" /></pattern>
    <pattern id="pScan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1.4" fill="#000" opacity="0.25" /></pattern>
    <pattern id="pGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80,0 L0,0 0,80" fill="none" stroke="#FFF" strokeOpacity="0.035" /></pattern>
  </defs>
);

// Sahne çerçevesi
export const PFrame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = X.bg }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <PDefs />
    <rect width={1920} height={1080} fill={bg} />
    {children}
    <rect width={1920} height={1080} fill="url(#pVig)" pointerEvents="none" />
  </svg>
);

// film greni + ince tarama
export const Grain: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => {
  const f = Math.floor(t * 24);
  return (
    <g pointerEvents="none" opacity={k}>
      {Array.from({ length: 70 }, (_, i) => <rect key={i} x={md(hash(i + f * 71) * 1920, 1920)} y={md(hash(i * 3 + f * 13) * 1080, 1080)} width={2} height={2} fill="#FFF" opacity={0.05 + hash(i + f) * 0.08} />)}
      {hash(f * 0.37) > 0.93 && <rect x={0} y={hash(f) * 1080} width={1920} height={1 + hash(f + 1) * 3} fill="#FFF" opacity={0.05} />}
    </g>
  );
};

// ───────── YÜZSÜZ SİLUET ─────────
export type Kind = "hood" | "suit" | "robe" | "nurse" | "casual" | "teen" | "coat";
export type Pose = "stand" | "type" | "sit" | "phone" | "cuffs" | "badge" | "head" | "point" | "raise" | "hold" | "paper" | "think" | "bag";
type SilP = { x: number; y: number; s?: number; t: number; kind?: Kind; pose?: Pose; walk?: Walk; rim?: string; dir?: 1 | -1; seed?: number; back?: boolean; hair?: "curly" | "short" | "none" | "long"; op?: number; body?: string; item?: React.ReactNode };

const limb = (pts: [number, number][], w: number, c: string, key?: string | number) => (
  <path key={key} d={`M${pts.map((p) => p.join(",")).join(" L")}`} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
);
const rot = (x: number, y: number, len: number, deg: number): [number, number] => [x + Math.sin((deg * Math.PI) / 180) * len, y + Math.cos((deg * Math.PI) / 180) * len];

export const Sil: React.FC<SilP> = ({ x, y, s = 1, t, kind = "hood", pose = "stand", walk, rim = X.amber, dir = 1, seed = 0, back = false, hair = "short", op = 1, body, item }) => {
  const c = body ?? (kind === "nurse" ? "#1C2A3A" : kind === "robe" ? "#0B0E14" : X.sil);
  const br = Math.sin(t * 2.1 + seed) * 2.2; // nefes
  const sway = Math.sin(t * 0.9 + seed * 1.7) * 1.2;
  const sit = pose === "sit" || pose === "type" || pose === "think";
  const L = walk ? legs(walk, 26) : null;
  const hipY = sit ? -128 : -150 + (L ? L.drop * 150 : 0);
  const bob = L ? -Math.abs(Math.sin(walk!.ph)) * 5 * walk!.amp : 0;
  const shY = hipY - 112 + br * 0.4 + bob;
  const headY = shY - 58 + br * 0.3;
  // bacaklar
  const leg = (side: 1 | -1) => {
    const hx = side * 15;
    if (sit) {
      const kx = 78, ky = hipY + 6;
      return limb([[hx, hipY], [kx + side * 4, ky], [kx + side * 6, 0]], 30, c, `l${side}`);
    }
    const a = L ? (side === 1 ? L.aR : L.aL) : side * 3;
    const lift = L ? (side === 1 ? L.liftR : L.liftL) : 0;
    const [kx, ky] = rot(hx, hipY + bob, 76, a);
    const [fx, fy] = rot(kx, ky, 76, a - lift * 38);
    return limb([[hx, hipY + bob], [kx, ky], [fx, Math.min(0, fy)]], 30, c, `l${side}`);
  };
  // kollar: [omuz açısı, dirsek açısı]
  const P: Record<Pose, [[number, number], [number, number]]> = {
    stand: [[8, 4], [-8, -4]],
    type: [[-58, -100], [-48, -96]],
    sit: [[10, 20], [-10, -20]],
    phone: [[8, 4], [-40, -165]],
    cuffs: [[-14, -40], [14, 40]],
    badge: [[8, 4], [-70, -95]],
    head: [[-150, -200], [150, 200]],
    point: [[8, 4], [-95, -92]],
    raise: [[-160, -175], [8, 4]],
    hold: [[-40, -95], [40, 95]],
    paper: [[-45, -110], [45, 110]],
    think: [[-30, -165], [10, 15]],
    bag: [[6, 0], [-12, -8]],
  };
  const swing = L && walk ? L.tr * 18 * walk.amp : 0;
  const [A1, A2] = P[pose];
  const arm = (side: 1 | -1, [u, f]: [number, number]) => {
    const sx = side * 46;
    const ua = (pose === "stand" || pose === "bag") ? u - side * swing : u;
    const [ex, ey] = rot(sx, shY + 8, 62, side === 1 ? -ua : ua);
    const [hx, hy] = rot(ex, ey, 58, side === 1 ? -f : f);
    const tap = pose === "type" ? Math.max(0, Math.sin(t * 17 + side * 1.9 + seed)) * 5 : 0;
    return <g key={`a${side}`}>{limb([[sx, shY + 8], [ex, ey], [hx, hy - tap]], 24, c)}<circle cx={hx} cy={hy - tap} r={12} fill={c} /></g>;
  };
  const torso = () => {
    const w = kind === "suit" || kind === "coat" ? 56 : 52;
    const hw = 34;
    const hem = kind === "robe" ? 0 : kind === "coat" ? hipY + 70 : hipY + 12;
    return (
      <g>
        <path d={`M${-w},${shY + 6} Q${-w - 4},${shY - 10} ${-w + 18},${shY - 14} L${w - 18},${shY - 14} Q${w + 4},${shY - 10} ${w},${shY + 6} L${hw + (kind === "robe" ? 40 : 0)},${hem} L${-hw - (kind === "robe" ? 40 : 0)},${hem}Z`} fill={c} />
        {kind === "hood" && <path d={`M-40,${shY - 8} Q0,${shY + 22} 40,${shY - 8}`} stroke="#0A0F18" strokeWidth={8} fill="none" />}
        {kind === "suit" && <path d={`M0,${shY - 12} L-14,${shY + 40} L0,${shY + 70} L14,${shY + 40}Z`} fill="#0A0D13" />}
        {kind === "nurse" && <rect x={-30} y={shY + 30} width={22} height={6} fill="#5FA8C9" opacity={0.6} />}
        {kind === "teen" && <path d={`M-30,${shY + 40} L30,${shY + 40}`} stroke={X.cyan2} strokeWidth={5} opacity={0.4} />}
      </g>
    );
  };
  const head = () => (
    <g transform={`translate(${sway * 0.6},${headY})`}>
      <rect x={-12} y={20} width={24} height={30} fill={c} />
      <ellipse cx={0} cy={0} rx={33} ry={40} fill={c} />
      {kind === "hood" && <path d="M-44,10 Q-48,-50 0,-56 Q48,-50 44,10 Q40,48 0,52 Q-40,48 -44,10Z" fill={c} />}
      {hair === "curly" && kind !== "hood" && Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-28 + i * 7} cy={-30 - Math.sin(i * 1.3) * 6} r={12} fill={c} />)}
      {hair === "long" && <path d="M-34,-10 Q-40,50 -30,70 L30,70 Q40,50 34,-10Z" fill={c} />}
      {kind === "nurse" && <path d="M-30,-34 L30,-34 L26,-50 L-26,-50Z" fill="#DDE6EE" opacity={0.85} />}
    </g>
  );
  const fig = (col?: string) => (
    <g>
      {leg(-1)}{leg(1)}
      {back ? null : arm(-1, A2)}
      {torso()}
      {head()}
      {back ? <>{arm(-1, A2)}{arm(1, A1)}</> : arm(1, A1)}
      {col && null}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`} opacity={op}>
      <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.45} />
      <g transform="translate(-3,-2)" style={{ filter: `drop-shadow(0 0 3px ${rim}) drop-shadow(0 0 12px ${rim})` }} opacity={0.9}>
        <g style={{ filter: "brightness(0)" }}>{fig()}</g>
      </g>
      <g stroke={rim} strokeWidth={0} >{fig()}</g>
      {item}
    </g>
  );
};

// ───────── EKRAN / MONİTÖR ─────────
// İçerik 1600x900 yerel koordinatta çizilir.
export const Screen: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; glow?: string; on?: number; bezel?: string; tilt?: number }> = ({ x, y, w, h, children, glow = X.cyan, on = 1, bezel = "#05070A", tilt = 0 }) => (
  <g transform={`translate(${x},${y}) skewY(${tilt})`}>
    <ellipse cx={w / 2} cy={h / 2} rx={w * 0.9} ry={h * 0.9} fill={glow === X.red ? "url(#pGlowR)" : glow === X.amber ? "url(#pGlowA)" : "url(#pGlowC)"} opacity={0.35 * on} />
    <rect x={-10} y={-10} width={w + 20} height={h + 20} rx={10} fill={bezel} />
    <svg x={0} y={0} width={w} height={h} viewBox="0 0 1600 900" preserveAspectRatio="none">
      <rect width={1600} height={900} fill="#06080C" />
      <g opacity={on}>{children}</g>
      <rect width={1600} height={900} fill="url(#pScan)" />
      <path d="M0,0 L1600,0 L1600,180 Q800,260 0,120Z" fill="#FFF" opacity={0.035} />
    </svg>
  </g>
);

// ekran içerikleri (1600x900)
export const Ransom: React.FC<{ t: number; a?: number; tr?: boolean }> = ({ t, a = 0, tr = true }) => {
  const left = Math.max(0, 3 * 86400 - (t - a) * 37 - 4200);
  const hh = Math.floor(left / 3600) % 24, dd = Math.floor(left / 86400), mm = Math.floor(left / 60) % 60, ss = Math.floor(left) % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const blink = Math.sin(t * 6) > 0;
  return (
    <g>
      <rect width={1600} height={900} fill="#7A0A0F" />
      <rect x={40} y={40} width={1520} height={820} fill="#8E0E14" stroke="#C7262E" strokeWidth={4} />
      <g transform="translate(250,330)">
        <rect x={-120} y={-40} width={240} height={200} rx={18} fill="#E9C46A" />
        <path d="M-70,-40 L-70,-110 Q-70,-190 0,-190 Q70,-190 70,-110 L70,-40" stroke="#E9C46A" strokeWidth={36} fill="none" />
        <circle cx={0} cy={50} r={24} fill="#5A0A0A" /><rect x={-9} y={50} width={18} height={60} fill="#5A0A0A" />
      </g>
      {T(470, 170, tr ? "Dosyalarınız şifrelendi!" : "Your files have been encrypted!", 72, "#FFF", 700)}
      {T(470, 240, tr ? "Fotoğraflar, belgeler, veritabanları… hepsi kilitli." : "Photos, documents, databases… all locked.", 34, "#F6D3D3", 500)}
      <rect x={470} y={300} width={1040} height={300} fill="#FFF" opacity={0.95} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={500} y={330 + i * 42} width={900 - (i * 97) % 300} height={16} fill="#9AA" opacity={0.6} />)}
      <rect x={80} y={560} width={340} height={260} fill="#5A070B" stroke="#E9C46A" strokeWidth={3} />
      {T(250, 610, tr ? "Fiyat artacak:" : "Payment will be raised on", 26, "#E9C46A", 600, "middle")}
      {T(250, 690, `${pad(dd)}:${pad(hh)}:${pad(mm)}:${pad(ss)}`, 62, blink ? "#FFF" : "#FFD6D6", 700, "middle")}
      {T(250, 770, tr ? "Dosyalar silinecek: 7 gün" : "Files will be lost: 7 days", 24, "#E9C46A", 600, "middle")}
      <rect x={470} y={640} width={1040} height={90} fill="#2A0507" />
      {T(500, 698, tr ? "300 $ değerinde bitkoin gönderin →" : "Send $300 worth of bitcoin →", 40, "#FFF", 700)}
      <rect x={470} y={750} width={1040} height={70} fill="#EDEDED" />
      {T(500, 797, "1Ab3 ████████████████ 9xQ", 34, "#222", 600)}
    </g>
  );
};

export const DOMAIN = "uzun-anlamsiz-bir-adres-████████.com";
export const Code: React.FC<{ t: number; a?: number; hi?: number; scroll?: number }> = ({ t, a = 0, hi = 0, scroll = 1 }) => {
  // basitleştirilmiş görünüm: gerçek kod yok, sadece soyut satırlar + tek bir vurgulu "garip adres" satırı
  const off = (t - a) * 30 * scroll;
  return (
    <g>
      <rect width={1600} height={900} fill="#0A0D12" />
      <rect width={1600} height={50} fill="#151B25" />
      {T(30, 34, "inceleme · örnek dosya", 24, X.dim, 600)}
      {Array.from({ length: 19 }, (_, i) => {
        const y = 100 + i * 42 - (off % 42);
        const isHi = i === 9 && hi > 0;
        const w1 = 200 + hash(i + Math.floor(off / 42)) * 600, w2 = 120 + hash(i * 7 + Math.floor(off / 42)) * 400;
        return (
          <g key={i}>
            <rect x={30} y={y - 18} width={110} height={14} rx={4} fill="#2A3344" />
            {isHi ? (
              <g>
                <rect x={170} y={y - 34} width={1400} height={46} fill={X.amber} opacity={0.18 * hi} />
                {T(190, y, `→ önce şu adrese sor: "${typed(DOMAIN, hi * 1.4)}"`, 28, X.amber, 700)}
              </g>
            ) : <g><rect x={180} y={y - 18} width={w1} height={14} rx={4} fill="#3E4F66" /><rect x={200 + w1} y={y - 18} width={w2} height={14} rx={4} fill="#26303F" /></g>}
          </g>
        );
      })}
    </g>
  );
};

export const Registrar: React.FC<{ t: number; a: number; buy?: number }> = ({ t, a, buy = 4 }) => {
  const k = rp(t, a + 0.3, a + 2.2);
  const res = t > a + 2.4;
  const bought = t > a + buy;
  const clickK = rp(t, a + buy - 0.4, a + buy);
  return (
    <g>
      <rect width={1600} height={900} fill="#F2F4F7" />
      <rect width={1600} height={90} fill="#1E2532" />
      {T(40, 58, "alanadi.shop", 34, "#FFF", 700)}
      {T(1560, 58, "Sepet (0)", 26, "#BFC7D4", 600, "end")}
      {T(800, 220, "Hayalindeki alan adını bul", 48, "#1E2532", 700, "middle")}
      <rect x={160} y={270} width={1280} height={96} rx={48} fill="#FFF" stroke="#C9D1DD" strokeWidth={3} />
      {T(210, 332, typed(DOMAIN, k), 30, "#1E2532", 600)}
      {k < 1 && Math.sin(t * 8) > 0 && <rect x={210 + typed(DOMAIN, k).length * 16.6} y={300} width={3} height={42} fill="#1E2532" />}
      {res && (
        <g opacity={rp(t, a + 2.4, a + 2.8)}>
          <rect x={160} y={430} width={1280} height={200} rx={20} fill="#FFF" stroke={bought ? "#2BB673" : "#C9D1DD"} strokeWidth={4} />
          {T(210, 500, DOMAIN, 30, "#1E2532", 700)}
          {T(210, 565, bought ? "✓ Kaydedildi · Sahibi: sen" : "✓ Müsait", 34, "#2BB673", 700)}
          {T(1160, 520, "10,69 $", 52, "#1E2532", 700, "end")}
          <rect x={1190} y={470} width={220} height={80} rx={40} fill={bought ? "#2BB673" : "#FF8A00"} transform={`translate(${1300 * (1 - (1 - clickK * 0.08))},0)`} />
          {T(1300, 522, bought ? "Alındı" : "Satın al", 32, "#FFF", 700, "middle")}
        </g>
      )}
      {res && !bought && (() => { const cx = lp(1500, 1300, rp(t, a + 2.8, a + buy - 0.4)), cy = lp(800, 510, rp(t, a + 2.8, a + buy - 0.4)); return <path d={`M${cx},${cy} l0,46 l12,-12 l10,22 l9,-4 l-10,-22 l17,0Z`} fill="#111" stroke="#FFF" strokeWidth={3} />; })()}
    </g>
  );
};

// canlı bağlantı akışı (sinkhole)
export const Sinkhole: React.FC<{ t: number; a: number; rate?: number; stopAt?: number; label?: string }> = ({ t, a, rate = 900, stopAt, label = "Bağlantılar" }) => {
  const el = Math.max(0, t - a);
  const n = Math.floor(el * rate + el * el * rate * 0.4);
  const rows = 15;
  return (
    <g>
      <rect width={1600} height={900} fill="#06090E" />
      <rect width={1600} height={60} fill="#101722" />
      {T(30, 40, "sinkhole · canlı", 26, X.cyan, 700)}
      <circle cx={260} cy={31} r={8} fill={X.red} opacity={Math.sin(t * 5) > 0 ? 1 : 0.3} />
      {Array.from({ length: rows }, (_, i) => {
        const id = n - i;
        if (id < 0) return null;
        const ip = `${Math.floor(hash(id) * 223) + 1}.${Math.floor(hash(id + 1) * 255)}.${Math.floor(hash(id + 2) * 255)}.${Math.floor(hash(id + 3) * 255)}`;
        const cc = ["RU", "UA", "IN", "TW", "GB", "ES", "DE", "CN", "US", "BR", "FR", "TR"][Math.floor(hash(id + 9) * 12)];
        return <g key={i} opacity={1 - i / rows}>{T(30, 110 + i * 46, `${String(Math.floor(el * 100 + i) % 60).padStart(2, "0")}:${String(Math.floor(hash(id) * 60)).padStart(2, "0")}  GET  ${ip}`, 26, "#9FD8E8", 500)}{T(760, 110 + i * 46, cc, 26, X.amber, 700)}</g>;
      })}
      <rect x={980} y={100} width={580} height={360} rx={14} fill="#0D141E" stroke={X.line} />
      {T(1270, 170, label, 30, X.dim, 600, "middle")}
      {T(1270, 300, n.toLocaleString("tr-TR"), 110, X.cyan, 700, "middle")}
      {stopAt !== undefined && t > stopAt && T(1270, 400, "yeni şifreleme: 0", 34, X.amber, 700, "middle")}
      <polyline points={Array.from({ length: 40 }, (_, i) => `${1000 + i * 14},${840 - Math.min(300, (Math.max(0, el - (40 - i) * 0.08)) * 160 * (0.8 + hash(i) * 0.4))}`).join(" ")} stroke={X.cyan} strokeWidth={4} fill="none" />
    </g>
  );
};

// sohbet (genel)
export const Chat: React.FC<{ t: number; a: number; msgs: [string, string, number][]; title?: string }> = ({ t, a, msgs, title = "# wannacry-analiz" }) => (
  <g>
    <rect width={1600} height={900} fill="#1A1D24" />
    <rect width={300} height={900} fill="#13151B" />
    {T(30, 60, "Kriptos", 32, "#FFF", 700)}
    {["# genel", title, "# sinkhole"].map((c, i) => <g key={i}><rect x={10} y={110 + i * 56} width={280} height={46} rx={8} fill={c === title ? "#2B3140" : "none"} />{T(30, 142 + i * 56, c, 26, c === title ? "#FFF" : "#8A93A6", 600)}</g>)}
    {T(340, 60, title, 32, "#FFF", 700)}
    {msgs.map(([who, m, at], i) => {
      const k = rp(t, a + at, a + at + 0.3);
      if (k <= 0) return null;
      return (
        <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 20})`}>
          <rect x={340} y={130 + i * 130} width={64} height={64} rx={14} fill={who.startsWith("M") ? X.amber : X.cyan2} />
          {T(372, 172 + i * 130, who[0], 30, "#111", 700, "middle")}
          {T(430, 152 + i * 130, who, 28, "#FFF", 700)}
          {T(430, 196 + i * 130, typed(m, rp(t, a + at, a + at + 0.8)), 30, "#D7DBE3", 500)}
        </g>
      );
    })}
  </g>
);

// eski forum (2008-2012)
export const Forum: React.FC<{ t: number; a: number; posts: [string, string, number][]; head?: string }> = ({ t, a, posts, head = "underground · forum" }) => (
  <g>
    <rect width={1600} height={900} fill="#0E1116" />
    <rect width={1600} height={80} fill="#202634" />
    {T(40, 54, head, 34, "#9FC4FF", 700)}
    {posts.map(([u, m, at], i) => {
      const k = rp(t, a + at, a + at + 0.3);
      return (
        <g key={i} opacity={k}>
          <rect x={40} y={110 + i * 190} width={1520} height={170} fill="#161B24" stroke="#2A3242" />
          <rect x={40} y={110 + i * 190} width={260} height={170} fill="#1C2230" />
          <rect x={120} y={130 + i * 190} width={100} height={100} fill={u === "Vini" ? X.red2 : "#2E3A50"} />
          {T(170, 260 + i * 190, u, 24, u === "Vini" ? X.red : "#9FC4FF", 700, "middle")}
          {T(330, 170 + i * 190, typed(m, rp(t, a + at, a + at + 1.2)), 32, "#D6DCE6", 500)}
        </g>
      );
    })}
  </g>
);

// anonim blog (Malver Tek benzeri ama kendi tasarımımız)
export const Blog: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1600} height={900} fill="#0F1218" />
    <rect width={1600} height={140} fill="#141922" />
    {T(60, 92, "MALWARE · TECH", 54, "#FFF", 700)}
    {T(60, 126, "anonim bir araştırmacının notları", 24, X.dim, 500)}
    {["Bir bankacılık truvasının içi", "Bu botnet nasıl haberleşiyor?", "Sahte güncellemeler: yeni dalga", "Bir solucanın anatomisi"].map((h, i) => {
      const k = rp(t, a + 0.3 + i * 0.3, a + 0.7 + i * 0.3);
      return <g key={i} opacity={k}><rect x={60} y={190 + i * 170} width={1480} height={140} rx={12} fill="#161C26" />{T(100, 250 + i * 170, h, 40, "#E6EAF0", 700)}{T(100, 300 + i * 170, `${12 + i * 7} Mart · okuma: ${5 + i} dk · ${(1200 + i * 830).toLocaleString("tr-TR")} görüntülenme`, 24, X.dim, 500)}</g>;
    })}
  </g>
);

// haber sitesi (genel, gerçek marka değil)
export const NewsPage: React.FC<{ t: number; a: number; head: string; sub?: string; tag?: string }> = ({ t, a, head, sub, tag = "SON DAKİKA" }) => (
  <g>
    <rect width={1600} height={900} fill="#F5F5F2" />
    <rect width={1600} height={100} fill="#111" />
    {T(60, 66, "DÜNYA HABER", 44, "#FFF", 700)}
    <rect x={60} y={150} width={220} height={50} fill={X.red} />{T(170, 186, tag, 28, "#FFF", 700, "middle")}
    {head.split("\n").map((l, i) => <g key={i}>{T(60, 300 + i * 92, typed(l, rp(t, a + 0.2 + i * 0.3, a + 1 + i * 0.3)), 78, "#111", 700)}</g>)}
    {sub && T(60, 300 + head.split("\n").length * 92 + 30, sub, 34, "#555", 500)}
    <rect x={60} y={620} width={900} height={240} fill="#D9D9D4" /><rect x={1000} y={620} width={540} height={20} fill="#CCC" /><rect x={1000} y={660} width={480} height={20} fill="#CCC" /><rect x={1000} y={700} width={510} height={20} fill="#CCC" />
  </g>
);

// cüzdanlar (blokzinciri açık)
export const Wallets: React.FC<{ t: number; a: number; drain?: number }> = ({ t, a, drain }) => {
  const vals = [51.6 * 0.37, 51.6 * 0.33, 51.6 * 0.3];
  return (
    <g>
      <rect width={1600} height={900} fill="#0B0F15" />
      {T(800, 110, "WANNACRY CÜZDANLARI · herkese açık", 40, X.dim, 700, "middle")}
      {vals.map((v, i) => {
        const dk = drain !== undefined ? rp(t, a + drain + i * 0.5, a + drain + 1.2 + i * 0.5) : 0;
        const val = v * (1 - dk);
        return (
          <g key={i} transform={`translate(${130 + i * 470},220)`}>
            <rect width={400} height={480} rx={22} fill="#121924" stroke={dk > 0 ? X.red : X.line} strokeWidth={4} />
            <circle cx={200} cy={130} r={70} fill={X.amber} opacity={0.9 - dk * 0.6} />
            {T(200, 158, "₿", 80, "#111", 700, "middle")}
            {T(200, 300, val.toFixed(2), 74, dk > 0.5 ? X.red : "#FFF", 700, "middle")}
            {T(200, 350, "BTC", 30, X.dim, 600, "middle")}
            {T(200, 430, `cüzdan ${i + 1} · ████`, 26, "#4E5A6E", 600, "middle")}
            {dk > 0 && Array.from({ length: 6 }, (_, j) => { const q = cl(dk * 1.4 - j * 0.12); return <circle key={j} cx={200 + Math.cos(j * 1.1) * q * 500} cy={130 + Math.sin(j * 1.7) * q * 300 - q * 200} r={10} fill={X.amber} opacity={1 - q} />; })}
          </g>
        );
      })}
      {Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(${200 + i * 400},790)`}><circle r={30} fill="none" stroke={X.cyan} strokeWidth={3} opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} /><circle r={8} fill={X.cyan} />{T(0, 70, "izleniyor", 22, X.cyan, 600, "middle")}</g>)}
    </g>
  );
};

// güncelleme bildirimi (son)
export const UpdateNote: React.FC<{ t: number; a: number; later?: number }> = ({ t, a, later = 2.2 }) => {
  const k = rp(t, a + 0.3, a + 0.8);
  const press = t > a + later;
  return (
    <g>
      <rect width={1600} height={900} fill="#1E2A3A" />
      <rect width={1600} height={900} fill="url(#pGrid)" />
      <g transform={`translate(800,${450 + (1 - k) * 200})`} opacity={k}>
        <rect x={-520} y={-200} width={1040} height={400} rx={28} fill="#F4F6F9" />
        <rect x={-460} y={-140} width={110} height={110} rx={24} fill={X.cyan2} />
        <path d="M-405,-110 L-405,-55 M-430,-80 L-405,-55 L-380,-80" stroke="#FFF" strokeWidth={12} fill="none" strokeLinecap="round" />
        {T(-320, -95, "Güncelleme hazır", 50, "#111", 700)}
        {T(-320, -40, "Güvenlik güncellemesi · yeniden başlatma gerekli", 28, "#555", 500)}
        <rect x={-460} y={60} width={420} height={90} rx={45} fill={press ? "#999" : "#DDE2E8"} />{T(-250, 118, "Sonra", 36, "#222", 700, "middle")}
        <rect x={40} y={60} width={420} height={90} rx={45} fill={X.cyan2} />{T(250, 118, "Şimdi yükle", 36, "#FFF", 700, "middle")}
      </g>
    </g>
  );
};
