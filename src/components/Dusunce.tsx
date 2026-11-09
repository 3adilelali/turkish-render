import React from "react";
import { MINI_COLS, Outfit, P, T, TFig, TMini } from "./Toon";

// Kanal 2 · k2r-08 "Düşünce" kiti: Marmaray vagonu içi, düşünce bulutları, ses fırtınası, park, apartman kesiti, ayna, kulaklık, susma halkası.
const cl = (x: number) => Math.max(0, Math.min(1, x));
const md = (a: number, m: number) => ((a % m) + m) % m;

const CROWD: Outfit[] = [
  { top: "#5C6B7A", top2: "#46525E", kind: "suit", inner: "#E9E2D2", shoes: "#222" },
  { top: T.pink, top2: "#C24F75", kind: "sweater", hair: "ponytail", hairColor: "#3A2A20" },
  { top: "#8B6B4A", top2: "#6E5338", kind: "coat", mustache: true, hair: "cap", hairColor: "#333" },
  { top: T.yellow, top2: T.yellow2, kind: "hoodie" },
  { top: "#3A4A6A", top2: "#2A3550", kind: "coat", hair: "scarf", hairColor: "#9A5A7A" },
  { top: "#7E5BD6", top2: "#5E42A8", kind: "sweater", glasses: true },
  { top: "#3FAE6A", top2: "#2E8A52", kind: "hoodie", hair: "band", hairColor: "#FFF" },
  { top: "#1E2128", top2: "#14161B", kind: "suit", inner: "#F4F4F4", glasses: true },
];

/** Marmaray vagonu içi: tünel ışıkları akar, tutamaklar sallanır, ayakta kalabalık. */
export const Vagon: React.FC<{ t: number; crowd?: number; sway?: number; dark?: number; hero?: React.ReactNode; phones?: boolean }> = ({ t, crowd = 1, sway = 1, dark = 0, hero, phones = true }) => {
  const sx = Math.sin(t * 1.7) * 6 * sway;
  return (
    <g transform={`translate(${sx},0)`}>
      <rect x={-40} width={2000} height={1080} fill="#E6EBEF" />
      {/* tavan */}
      <rect x={-40} width={2000} height={150} fill="#F5F7F9" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={80 + i * 380} y={40} width={300} height={22} rx={11} fill="#FFFFFF" stroke="#D5DCE2" strokeWidth={3} />)}
      {/* camlar + tünel */}
      {[60, 700, 1340].map((x, i) => (
        <g key={i}>
          <rect x={x} y={200} width={520} height={300} rx={34} fill="#141C26" />
          <clipPath id={`vw${i}`}><rect x={x} y={200} width={520} height={300} rx={34} /></clipPath>
          <g clipPath={`url(#vw${i})`}>
            {Array.from({ length: 4 }, (_, j) => <rect key={j} x={x + md(j * 300 - t * 2400 + i * 90, 1200) - 300} y={320} width={160} height={14} rx={7} fill="#FFD27A" opacity={0.8} />)}
            {Array.from({ length: 3 }, (_, j) => <rect key={j} x={x + md(j * 400 - t * 1800 + i * 50, 1200) - 300} y={230} width={10} height={260} fill="#2A3442" />)}
          </g>
          <rect x={x} y={200} width={520} height={300} rx={34} fill="#BFE6F2" opacity={0.08} stroke="#AAB4BE" strokeWidth={12} />
        </g>
      ))}
      {/* hat haritası */}
      <g transform="translate(960,170)"><rect x={-330} y={-26} width={660} height={44} rx={8} fill="#1E3A64" />{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-280 + i * 70} cy={-4} r={9} fill={i === 3 ? T.red : "#FFFFFF"} />)}<path d="M-280,-4 H280" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} /></g>
      {/* direkler + tutamaklar */}
      <rect x={-40} y={150} width={2000} height={12} fill="#C9D1D8" />
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} transform={`translate(${60 + i * 140},162) rotate(${Math.sin(t * 2.4 + i * 0.7) * 7 * sway})`}>
          <path d="M0,0 V70" stroke="#D0D6DC" strokeWidth={6} /><path d="M-18,70 a18,22 0 1,0 36,0 a18,22 0 1,0 -36,0" fill="none" stroke="#F2C230" strokeWidth={7} />
        </g>
      ))}
      {[440, 1480].map((x) => <rect key={x} x={x - 9} y={150} width={18} height={930} fill="#D7DDE2" stroke="#AEB7BF" strokeWidth={3} />)}
      {/* koltuk sırası */}
      <rect x={-40} y={600} width={2000} height={120} fill="#2B5DA8" /><rect x={-40} y={600} width={2000} height={18} fill="#3A7BD5" />
      <rect x={-40} y={720} width={2000} height={360} fill="#9AA3AB" />
      <rect x={-40} y={720} width={2000} height={10} fill={T.yellow} />
      {/* kalabalık */}
      {crowd > 0 && Array.from({ length: Math.round(10 * crowd) }, (_, i) => {
        const x = 120 + i * 180 + (i % 2) * 30;
        if (hero && Math.abs(x - 960) < 170) return null;
        const o = CROWD[i % CROWD.length];
        return <TFig key={i} x={x} y={1080 + (i % 3) * 14} s={0.86} o={o} t={t} seed={i * 3} pose={phones && i % 3 !== 1 ? P.phone : P.stand} mouth={i % 4 === 0 ? "flat" : "none"} eyes={phones && i % 3 !== 1 ? "squint" : "open"} look={i % 2 ? 0.3 : -0.3} lookY={phones ? 0.4 : 0} />;
      })}
      {hero}
      {dark > 0 && <rect x={-40} width={2000} height={1080} fill="#0E1626" opacity={dark} />}
    </g>
  );
};

/** düşünce bulutu (konuşma balonu değil: tırtıklı bulut, başa doğru küçülen baloncuklar) */
export const Dusun: React.FC<{ t: number; at: number; x: number; y: number; text: string; size?: number; hx?: number; hy?: number; c?: string; until?: number; w?: number }> = ({ t, at, x, y, text, size = 40, hx, hy, c = "#FFF6D8", until, w }) => {
  if (t < at || (until !== undefined && t > until + 0.3)) return null;
  const k = cl((t - at) / 0.28) * (until !== undefined ? 1 - cl((t - until) / 0.3) : 1);
  const W = w ?? Math.min(1100, text.length * size * 0.55 + 90);
  const H = size * 2.2;
  const n = Math.max(5, Math.round(W / 90));
  const bob = Math.sin(t * 2 + x) * 6;
  return (
    <g opacity={k}>
      {hx !== undefined && hy !== undefined && [0.25, 0.5, 0.75].map((f, i) => <circle key={i} cx={hx + (x - hx) * f * 0.8} cy={hy + (y + H / 2 - hy) * f * 0.8 + bob * f} r={8 + i * 6} fill={c} stroke="#333" strokeWidth={3} opacity={cl(k * 3 - i * 0.6)} />)}
      <g transform={`translate(${x},${y + bob}) scale(${0.7 + 0.3 * k})`}>
        {Array.from({ length: n }, (_, i) => <circle key={i} cx={-W / 2 + (i + 0.5) * (W / n)} cy={-H / 2 + 4} r={W / n / 1.4} fill={c} stroke="#333" strokeWidth={4} />)}
        {Array.from({ length: n }, (_, i) => <circle key={`b${i}`} cx={-W / 2 + (i + 0.5) * (W / n)} cy={H / 2 - 4} r={W / n / 1.4} fill={c} stroke="#333" strokeWidth={4} />)}
        <rect x={-W / 2 - 10} y={-H / 2} width={W + 20} height={H} rx={H / 2} fill={c} stroke="#333" strokeWidth={4} />
        <rect x={-W / 2 + 6} y={-H / 2 - 20} width={W - 12} height={H + 40} fill={c} />
        <text y={size * 0.36} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={size} fill="#1C1C1C" fontStyle="italic">{text}</text>
      </g>
    </g>
  );
};

const FRAG = ["Geç kaldım", "Patron bağıracak", "Kira…", "Neden bakıyor?", "Ayağıma bastı", "Annemi ara", "İstifa", "Aç mıyım?", "Kredi kartı", "Sınav", "Unuttum!", "Yoruldum", "Bugün olmaz", "Of…", "Saat kaç?", "Para yok", "Beni sevmiyor", "Toplantı", "Ev kirası", "Uyuyamadım"];
/** bin ses: başın etrafında dönen, üst üste binen düşünce kırıntıları */
export const SesFirtina: React.FC<{ t: number; x?: number; y?: number; k?: number; n?: number; r?: number; words?: string[] }> = ({ t, x = 960, y = 420, k = 1, n = 18, r = 520, words = FRAG }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const a = i * 2.39996 + t * (0.25 + (i % 3) * 0.08) * (i % 2 ? 1 : -1);
      const rr = r * (0.35 + ((i * 37) % 60) / 100) * (0.4 + 0.6 * k);
      const px = x + Math.cos(a) * rr * 1.5;
      const py = y + Math.sin(a) * rr * 0.6;
      const op = cl(k * 1.4 - (i / n) * 0.4) * (0.55 + 0.45 * Math.sin(t * 3 + i));
      const fs = 30 + ((i * 13) % 26);
      return (
        <g key={i} transform={`translate(${px},${py}) rotate(${Math.sin(a) * 8})`} opacity={op}>
          <rect x={-fs * words[i % words.length].length * 0.3 - 18} y={-fs * 0.8} width={fs * words[i % words.length].length * 0.6 + 36} height={fs * 1.4} rx={fs * 0.7} fill="#FFF6D8" stroke="#333" strokeWidth={3} strokeDasharray="10 7" />
          <text y={fs * 0.3} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontStyle="italic" fontSize={fs} fill="#1C1C1C">{words[i % words.length]}</text>
        </g>
      );
    })}
  </g>
);

/** kafanın içi: ses dalgaları başa çarpar (zonklama) */
export const Zonk: React.FC<{ t: number; x: number; y: number; s?: number; k?: number; c?: string }> = ({ t, x, y, s = 1, k = 1, c = "#F2C230" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    {[0, 1, 2].map((i) => { const f = md(t * 1.6 + i / 3, 1); return <circle key={i} r={140 + (1 - f) * 220} fill="none" stroke={c} strokeWidth={10 * f} opacity={f * 0.8} />; })}
  </g>
);

/** susma halkası (kural 3): dalgalar dışarıdan içeri kapanır, ortada sessizlik */
export const Sus: React.FC<{ t: number; a: number; x: number; y: number; s?: number }> = ({ t, a, x, y, s = 1 }) => {
  const k = cl((t - a) / 1.4);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((i) => <circle key={i} r={Math.max(4, (420 - i * 80) * (1 - k) + 60)} fill="none" stroke="#1FC8B4" strokeWidth={8} opacity={(1 - k) * 0.8 + 0.1} />)}
      <circle r={60 + 20 * k} fill="#1FC8B4" opacity={0.15 + 0.25 * k} />
      <text y={20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#FFFFFF" opacity={k}>🤫</text>
    </g>
  );
};

/** kulaklık (başın üstüne), figür ayağına göre: hx = x, hy = y - 470*s */
export const Kulaklik: React.FC<{ x: number; y: number; s?: number; t?: number; notes?: boolean }> = ({ x, y, s = 1, t = 0, notes = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-78,0 C-78,-110 78,-110 78,0" fill="none" stroke="#1C1C1C" strokeWidth={16} strokeLinecap="round" />
    {[-1, 1].map((d) => <rect key={d} x={d * 84 - 24} y={-20} width={48} height={70} rx={20} fill="#E0393E" stroke="#1C1C1C" strokeWidth={6} />)}
    {notes && [0, 1, 2].map((i) => { const f = md(t * 0.8 + i / 3, 1); return <text key={i} x={140 + f * 80} y={-40 - f * 120} fontSize={50} opacity={1 - f} fill="#7E5BD6">♪</text>; })}
  </g>
);

/** Sirkeci/Gülhane parkı: ağaçlar, bank, martılar, uzakta Haliç */
export const Park: React.FC<{ t: number; dusk?: number; bench?: boolean }> = ({ t, dusk = 0, bench = true }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#F2B880" : "#BFE3F2"} />
    <rect y={480} width={1920} height={120} fill={dusk ? "#5A7A9A" : "#6FA8C8"} />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={md(i * 260 - t * 20, 2100) - 100} y={520 + (i % 3) * 22} width={80} height={6} rx={3} fill="#FFFFFF" opacity={0.5} />)}
    <g opacity={0.6}>{[300, 620, 1300, 1600].map((x, i) => <g key={i}><rect x={x - 70} y={380 - i * 10} width={140} height={110 + i * 10} fill="#8A97A8" /><path d={`M${x - 70},${380 - i * 10} Q${x},${300 - i * 10} ${x + 70},${380 - i * 10}Z`} fill="#8A97A8" /></g>)}<rect x={960} y={250} width={14} height={240} fill="#8A97A8" /></g>
    <rect y={600} width={1920} height={480} fill="#6BB36B" />
    <path d="M0,760 Q960,700 1920,760 L1920,820 Q960,760 0,820Z" fill="#D9C9A6" />
    {[180, 560, 1420, 1780].map((x, i) => (
      <g key={i} transform={`translate(${x},720)`}>
        <rect x={-18} y={-220} width={36} height={240} fill="#7A5434" />
        {[0, 1, 2].map((j) => <circle key={j} cx={(j - 1) * 90 + Math.sin(t + i + j) * 4} cy={-260 - (j % 2) * 60} r={120} fill={["#3E8E4A", "#4FA35A", "#357A40"][j]} />)}
      </g>
    ))}
    {bench && <g transform="translate(960,900)"><rect x={-260} y={-120} width={520} height={26} rx={8} fill="#8B5A2B" stroke="#4A2E14" strokeWidth={5} /><rect x={-260} y={-70} width={520} height={30} rx={8} fill="#A86A34" stroke="#4A2E14" strokeWidth={5} />{[-220, 220].map((x) => <rect key={x} x={x - 10} y={-60} width={20} height={80} fill="#333" />)}</g>}
    {[0, 1, 2].map((i) => { const gx = md(i * 600 + t * 90, 2200) - 140; const gy = 200 + i * 60 + Math.sin(t * 2 + i) * 20; return <path key={i} d={`M${gx - 30},${gy} Q${gx - 15},${gy - 14 - Math.sin(t * 9 + i) * 10} ${gx},${gy} Q${gx + 15},${gy - 14 - Math.sin(t * 9 + i) * 10} ${gx + 30},${gy}`} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />; })}
  </g>
);

/** apartman kesiti: 3×3 daire, her birinde bir gece dramı; ortada sen */
export const Apartman: React.FC<{ t: number; k?: number; center?: React.ReactNode; hl?: number }> = ({ t, k = 1, center, hl = -1 }) => {
  const W = 560, Hh = 300, X0 = 120, Y0 = 120;
  const flats: { c: string; draw: (cx: number, cy: number) => React.ReactNode }[] = [
    { c: "#3A3550", draw: (cx, cy) => <><TFig x={cx - 90} y={cy + 130} s={0.5} o={CROWD[0]} t={t} pose={P.shrug} brow="angry" mouth="open" talk /><TFig x={cx + 90} y={cy + 130} s={0.5} o={CROWD[1]} t={t} dir={-1} pose={P.hips} brow="angry" mouth="open" talk seed={2} /></> },
    { c: "#2A3A50", draw: (cx, cy) => <><rect x={cx - 120} y={cy + 60} width={240} height={50} rx={10} fill="#7FB0CF" /><circle cx={cx - 90} cy={cy + 50} r={26} fill="#FBE7D2" stroke="#222" strokeWidth={3} /><text x={cx + 40} y={cy - 20} fontSize={60} opacity={0.6 + 0.4 * Math.sin(t * 3)}>👻</text></> },
    { c: "#3A3A3A", draw: (cx, cy) => <><TFig x={cx} y={cy + 130} s={0.5} o={CROWD[2]} t={t} pose={P.think} brow="worried" mouth="frown" />{[0, 1, 2].map((i) => <rect key={i} x={cx + 60 + i * 26} y={cy + 40 - i * 10} width={60} height={40} fill="#F4F1EA" stroke="#222" strokeWidth={2} transform={`rotate(${i * 12 - 10} ${cx + 80} ${cy + 50})`} />)}<text x={cx + 120} y={cy - 30} fontFamily="Poppins" fontWeight={800} fontSize={36} fill={T.red}>₺ BORÇ</text></> },
    { c: "#2E3A44", draw: () => null },
    { c: "#1E2A3A", draw: () => null },
    { c: "#2E3A44", draw: (cx, cy) => <><text x={cx} y={cy + 40} textAnchor="middle" fontSize={80}>📺</text></> },
    { c: "#2A2A40", draw: (cx, cy) => <><text x={cx} y={cy + 40} textAnchor="middle" fontSize={80}>🐶</text></> },
    { c: "#33303A", draw: (cx, cy) => <><TFig x={cx} y={cy + 130} s={0.5} o={CROWD[5]} t={t} pose={P.phone} eyes="squint" mouth="flat" /></> },
    { c: "#2A3442", draw: () => null },
  ];
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1626" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 89) % 110} r={2} fill="#FFFFFF" opacity={0.5} />)}
      <rect x={X0 - 30} y={Y0 - 30} width={W * 3 + 60} height={Hh * 3 + 60} fill="#B9A58A" stroke="#4A3A2A" strokeWidth={8} />
      {flats.map((f, i) => {
        const cx = X0 + (i % 3) * W + W / 2, cy = Y0 + Math.floor(i / 3) * Hh + Hh / 2 - 40;
        const on = i === 4 || cl(k * 9 - i) > 0;
        return (
          <g key={i}>
            <rect x={X0 + (i % 3) * W + 10} y={Y0 + Math.floor(i / 3) * Hh + 10} width={W - 20} height={Hh - 20} fill={on ? f.c : "#141A24"} />
            {on && <rect x={X0 + (i % 3) * W + 10} y={Y0 + Math.floor(i / 3) * Hh + 10} width={W - 20} height={Hh - 20} fill="#FFD27A" opacity={0.12} />}
            {on && f.draw(cx, cy)}
            {i === 4 && center}
            {hl === i && <rect x={X0 + (i % 3) * W + 10} y={Y0 + Math.floor(i / 3) * Hh + 10} width={W - 20} height={Hh - 20} fill="none" stroke={T.yellow} strokeWidth={10} />}
          </g>
        );
      })}
    </g>
  );
};

/** banyo aynası: çerçeve + yansıma */
export const Ayna: React.FC<{ t: number; children?: React.ReactNode; crack?: number }> = ({ t, children, crack = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#CFE0E6" />
    {Array.from({ length: 12 }, (_, i) => Array.from({ length: 7 }, (_, j) => <rect key={`${i}-${j}`} x={i * 170} y={j * 170} width={166} height={166} fill="#DCEBF0" stroke="#B8CBD2" strokeWidth={4} />))}
    <rect x={460} y={80} width={1000} height={760} rx={40} fill="#5A6A76" stroke="#3A4650" strokeWidth={10} />
    <clipPath id="ayna"><rect x={490} y={110} width={940} height={700} rx={28} /></clipPath>
    <g clipPath="url(#ayna)"><rect x={490} y={110} width={940} height={700} fill="#A9C4CE" />{children}<path d={`M${560 + Math.sin(t * 0.3) * 20},110 L760,810`} stroke="#FFFFFF" strokeWidth={60} opacity={0.12} /></g>
    {crack > 0 && <path d="M960,460 L900,300 M960,460 L1100,380 M960,460 L1000,700 M960,460 L760,520" stroke="#FFFFFF" strokeWidth={4} opacity={crack} />}
    <rect x={560} y={860} width={800} height={60} rx={20} fill="#F4F6F8" stroke="#9AA4AE" strokeWidth={6} />
    <rect y={920} width={1920} height={160} fill="#E9EEF1" />
  </g>
);

/** kahvaltı masası ve demlik (mutfak önü) */
export const Demlik: React.FC<{ x: number; y: number; s?: number; t?: number; fall?: number }> = ({ x, y, s = 1, t = 0, fall = 0 }) => (
  <g transform={`translate(${x},${y + fall * 120}) rotate(${fall * 60}) scale(${s})`}>
    <ellipse cx={0} cy={-40} rx={70} ry={60} fill="#C9302C" stroke="#1C1C1C" strokeWidth={5} />
    <ellipse cx={0} cy={-110} rx={46} ry={40} fill="#E0393E" stroke="#1C1C1C" strokeWidth={5} />
    <path d="M60,-60 L120,-100" stroke="#1C1C1C" strokeWidth={12} strokeLinecap="round" />
    {[0, 1].map((i) => { const f = md(t * 0.7 + i / 2, 1); return <path key={i} d={`M${-10 + i * 20},${-160 - f * 80} q10,-20 0,-40`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={(1 - f) * 0.7} />; })}
  </g>
);

export const KALABALIK = CROWD;
export const _mini = { TMini, MINI_COLS };
