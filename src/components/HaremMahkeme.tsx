import React from "react";
import { H, lerp } from "./Harem";

// Kanal 1 · "Mahkeme" kiti (s3-06'dan): kadı mahkemesi (sıcak, dikey kadraja ortalı), fakir ev içi,
// sicile yazan kamış kalem, mehir kesesi, terazi (mehir ↔ özgürlük), sicil rafları, nikâh senedi (şartlı).
// Figürler dışarıdan (PFig). Zemin çizgisi ~ y=1005 (ayakta), kadı kürsüsü oturuş y=770.

const cl = (v: number) => Math.max(0, Math.min(1, v));
const LN = H.ln;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// sicil defteri (cilt sırtı): raflarda
const Cilt: React.FC<{ x: number; y: number; w: number; h: number; c: string }> = ({ x, y, w, h, c }) => (
  <g><rect x={x} y={y} width={w} height={h} rx={3} fill={c} stroke={LN} strokeWidth={2.5} /><rect x={x + 3} y={y + 10} width={w - 6} height={6} fill={H.gold} opacity={0.7} /><rect x={x + 3} y={y + h - 18} width={w - 6} height={6} fill={H.gold} opacity={0.7} /></g>
);
const CILT = ["#6A2A22", "#2F4A3A", "#5A3A26", "#7A5A2A", "#3A3A5A", "#8A3A2A"];
const Raf: React.FC<{ x: number; y: number; w: number; rows?: number; seed?: number }> = ({ x, y, w, rows = 3, seed = 0 }) => (
  <g>
    <rect x={x - 14} y={y - 20} width={w + 28} height={rows * 130 + 30} fill="#4A2E1C" stroke={LN} strokeWidth={5} />
    {Array.from({ length: rows }, (_, r) => {
      let cx = x;
      const books: React.ReactNode[] = [];
      for (let i = 0; cx < x + w - 30; i++) { const bw = 26 + rnd(seed + r * 40 + i) * 22; const bh = 90 + rnd(seed + r * 13 + i * 3) * 24; books.push(<Cilt key={i} x={cx} y={y + r * 130 + (110 - bh)} w={bw} h={bh} c={CILT[(i + r + seed) % CILT.length]} />); cx += bw + 3; }
      return <g key={r}>{books}<rect x={x - 14} y={y + r * 130 + 110} width={w + 28} height={12} fill="#6A4428" stroke={LN} strokeWidth={3} /></g>;
    })}
  </g>
);

// kadı mahkemesi: arka duvar çini kuşak, iki kemerli pencere (ışık huzmesi), ortada yüksek kürsü (minder + yastık),
// iki yanda sicil rafları, ön solda kâtip rahlesi. light: pencere ışığı 0..1
export const KadiMahkeme: React.FC<{ t: number; light?: number; rahle?: boolean }> = ({ t, light = 1, rahle = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#E6D6B4" />
    <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.12} />
    {/* ahşap tavan kirişleri */}
    <rect width={1920} height={70} fill="#5A3A22" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={60} width={40} height={40} fill="#4A2E1C" />)}
    {/* çini kuşak */}
    <rect y={560} width={1920} height={110} fill="url(#hTile)" />
    <rect y={552} width={1920} height={10} fill={H.cobalt} />
    <rect y={668} width={1920} height={10} fill={H.cobalt} />
    {/* pencereler */}
    {[700, 1220].map((x, i) => (
      <g key={i}>
        <clipPath id={`mkW${i}`}><path d={`M${x - 90},520 V250 Q${x},150 ${x + 90},250 V520Z`} /></clipPath>
        <g clipPath={`url(#mkW${i})`}><BursaManzara x={x - 90 - i * 120} y={150} w={300} h={370} /></g>
        <path d={`M${x - 90},520 V250 Q${x},150 ${x + 90},250 V520Z`} fill="none" stroke={LN} strokeWidth={6} />
        <path d={`M${x - 90},520 V250 Q${x},150 ${x + 90},250 V520Z`} fill="url(#hHoney)" opacity={0.25} />
        {Array.from({ length: 3 }, (_, k) => <line key={k} x1={x - 45 + k * 45} y1={190} x2={x - 45 + k * 45} y2={520} stroke={LN} strokeWidth={4} />)}
        <line x1={x - 90} y1={380} x2={x + 90} y2={380} stroke={LN} strokeWidth={4} />
        <rect x={x - 110} y={516} width={220} height={18} fill="#8A6A44" stroke={LN} strokeWidth={3} />
        <path d={`M${x - 80},520 L${x - 240 + i * 120},1060 L${x + 140 + i * 120},1060 L${x + 80},520Z`} fill="#FFF3C8" opacity={(0.16 + Math.sin(t * 0.8 + i) * 0.03) * light} />
      </g>
    ))}
    {/* hat levhası (ortada) */}
    <g transform="translate(960,360)"><rect x={-170} y={-150} width={340} height={230} rx={16} fill="#1F3A2E" stroke={H.gold} strokeWidth={7} /><Tugra x={0} y={10} s={0.62} /></g>
    {/* raflar */}
    <Raf x={300} y={250} w={260} rows={5} seed={3} />
    <Raf x={1370} y={250} w={260} rows={5} seed={9} />
    {/* zemin + kilim */}
    <rect y={860} width={1920} height={220} fill="#A07A52" />
    {Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 150} y1={860} x2={i * 150 - 120} y2={1080} stroke="#8A6640" strokeWidth={3} />)}
    <path d="M520,1080 L700,900 H1220 L1400,1080Z" fill="#8E2F2A" stroke={LN} strokeWidth={4} />
    <path d="M600,1080 L740,930 H1180 L1320,1080Z" fill="none" stroke={H.gold} strokeWidth={6} strokeDasharray="20 12" />
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${860 + i * 50},${985 + (i % 2) * 24})`}><path d="M0,10 q-12,-8 -10,-26 q5,7 10,9 q5,-2 10,-9 q2,18 -10,26Z" fill={H.gold} /><path d="M0,10 v14" stroke={H.gold} strokeWidth={3} /></g>)}
    {/* kürsü: yüksek ahşap seki + kırmızı minder + yastık */}
    <rect x={760} y={780} width={400} height={110} fill="#5A3A22" stroke={LN} strokeWidth={6} />
    {Array.from({ length: 3 }, (_, i) => <rect key={i} x={780 + i * 128} y={798} width={110} height={74} fill="none" stroke={H.gold} strokeWidth={3} opacity={0.7} />)}
    <rect x={770} y={750} width={380} height={42} rx={12} fill="#8E2F2A" stroke={LN} strokeWidth={5} />
    <rect x={820} y={640} width={280} height={120} rx={30} fill="#A33A30" stroke={LN} strokeWidth={5} />
    <path d="M840,660 h240" stroke={H.gold} strokeWidth={4} opacity={0.7} />
    {/* kâtip rahlesi (ön sol) */}
    {rahle && <g transform="translate(560,980)">
      <path d="M-110,0 L-70,-90 H70 L110,0Z" fill="#7A5236" stroke={LN} strokeWidth={5} />
      <path d="M-80,-92 L0,-120 L80,-92 L0,-70Z" fill="#F1E1BC" stroke={LN} strokeWidth={3} />
      <rect x={70} y={-120} width={18} height={26} fill="#1A1A1A" stroke={LN} strokeWidth={2} />
    </g>}
  </g>
);

// fakir ev içi (Bursa): ahşap duvar, küçük pencere (Uludağ), boş kazan, sönük ocak, boş ekmek sepeti, kerevet. empty=1 boş
export const FakirEv: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#5A4434" : "#B99A74"} />
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 128} y1={0} x2={i * 128} y2={860} stroke="#7A5A3E" strokeWidth={4} opacity={0.6} />)}
    <rect y={110} width={1920} height={20} fill="#6A4A30" />
    {/* pencere: Uludağ */}
    <g transform="translate(960,330)">
      <BursaManzara x={-150} y={-120} w={300} h={240} night={night} />
      <rect x={-150} y={-120} width={300} height={240} fill="none" stroke={LN} strokeWidth={8} />
      {night ? <circle cx={-90} cy={-70} r={22} fill="#F4EEDC" /> : null}
      <line x1={0} y1={-120} x2={0} y2={120} stroke={LN} strokeWidth={6} />
      <line x1={-150} y1={0} x2={150} y2={0} stroke={LN} strokeWidth={6} />
    </g>
    {/* raf: boş testi, tas */}
    <rect x={640} y={560} width={640} height={16} fill="#6A4A30" stroke={LN} strokeWidth={3} />
    <g transform="translate(720,560)"><path d="M-24,0 q-12,-60 10,-80 h28 q22,20 10,80Z" fill="#B86A42" stroke={LN} strokeWidth={3} /></g>
    <g transform="translate(1200,560)"><path d="M-40,0 q0,-36 40,-36 q40,0 40,36Z" fill="#C88A3A" stroke={LN} strokeWidth={3} /></g>
    {/* zemin */}
    <rect y={860} width={1920} height={220} fill={night ? "#4A3424" : "#8A6A48"} />
    <path d="M560,1080 L700,920 H1220 L1360,1080Z" fill="#6A7A5A" opacity={0.7} />
    {/* sönük ocak + boş kazan (sağ) */}
    <g transform="translate(1180,860)">
      <path d="M-120,0 V-160 Q0,-260 120,-160 V0Z" fill="#8A7A6A" stroke={LN} strokeWidth={5} />
      <path d="M-60,0 V-70 Q0,-120 60,-70 V0Z" fill="#2A2420" />
      {[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={-12} r={8} fill="#5A5048" />)}
      <g transform="translate(0,-60)"><path d="M-70,0 Q-70,70 0,70 Q70,70 70,0Z" fill="#B87A3A" stroke={LN} strokeWidth={4} /><ellipse rx={70} ry={14} fill="#3A2A1E" stroke={LN} strokeWidth={4} /></g>
    </g>
    {/* boş ekmek sepeti (sol) */}
    <g transform="translate(760,960)">
      <ellipse rx={110} ry={30} fill="#C9A86A" stroke={LN} strokeWidth={4} />
      <path d="M-110,0 Q-100,60 0,64 Q100,60 110,0" fill="#B8925A" stroke={LN} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-90 + i * 36},10 v46`} stroke="#8A6A3A" strokeWidth={3} />)}
      <ellipse rx={92} ry={20} fill="#6A4A2A" />
      <circle cx={30} cy={-4} r={6} fill="#D9B87A" />
    </g>
    {/* toz zerreleri */}
    {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={820 + rnd(i) * 300 + Math.sin(t * 0.6 + i) * 20} cy={250 + rnd(i + 7) * 400 + Math.cos(t * 0.5 + i) * 20} r={3} fill="#FFF2C8" opacity={0.5} />)}
  </g>
);

// sicil sayfası + yazan kamış kalem. k: yazılan satır ilerlemesi 0..1, seal: mühür 0..1
export const SicilKalem: React.FC<{ t: number; k?: number; seal?: number; hi?: number }> = ({ t, k = 1, seal = 0, hi = 0 }) => {
  const N = 7;
  const done = k * N;
  const row = Math.min(N - 1, Math.floor(done));
  const fr = done - row;
  const px = lerp(380, -380, fr), py = -220 + row * 70;
  return (
    <g>
      <rect width={1920} height={1080} fill="#3A2A1C" />
      <g transform="translate(960,560) rotate(-3)">
        <ellipse cy={420} rx={520} ry={40} fill="#000" opacity={0.3} />
        <rect x={-460} y={-360} width={920} height={760} fill="#EEDDB6" stroke={LN} strokeWidth={6} />
        <rect x={-460} y={-360} width={920} height={760} fill="url(#hDamask)" opacity={0.12} />
        <path d="M-300,-300 q40,-40 80,0 q30,-50 60,0 q30,-30 70,6" stroke={H.gold} strokeWidth={6} fill="none" />
        {hi > 0 && <rect x={-420} y={-250 + 2 * 70} width={840} height={56} rx={10} fill="#FFD84A" opacity={0.35 * hi} />}
        {Array.from({ length: N }, (_, i) => {
          const f = cl(done - i);
          return f > 0 && <path key={i} d={`M380,${-220 + i * 70} ${Array.from({ length: 10 }, (_, j) => `q-${20 + rnd(i * 10 + j) * 16},${-12 - rnd(j + i) * 8} -${38 + rnd(i + j * 3) * 10},0`).join(" ")}`} stroke="#2A1E14" strokeWidth={6} fill="none" strokeDasharray={`${f * 900} 900`} opacity={0.88} />;
        })}
        {seal > 0 && <g transform={`translate(-300,290) scale(${lerp(1.6, 1, cl(seal))})`} opacity={cl(seal * 2)}><circle r={58} fill="#8E2F2A" opacity={0.85} /><circle r={42} fill="none" stroke="#F1E1BC" strokeWidth={3} opacity={0.6} /><path d="M-20,0 q10,-20 20,0 q10,-20 20,0" stroke="#F1E1BC" strokeWidth={4} fill="none" /></g>}
        {/* kamış kalem + el */}
        {k < 1 && <g transform={`translate(${px},${py + Math.sin(t * 22) * 3})`}>
          <path d="M0,0 L120,-260" stroke="#C9A66A" strokeWidth={14} strokeLinecap="round" />
          <path d="M0,0 L18,-36" stroke="#2A1E14" strokeWidth={10} strokeLinecap="round" />
          <path d="M70,-150 q60,-40 110,-10 q30,40 0,90 q-50,30 -100,-10Z" fill="#F0D2B4" stroke={LN} strokeWidth={4} />
          <path d="M150,-110 L330,-230 L390,-150 L210,-30Z" fill="#3A4A3A" stroke={LN} strokeWidth={4} />
        </g>}
      </g>
    </g>
  );
};

// mehir kesesi (ağzı bağlı, altın taşan). push 0..1: ileri itilir/uzaklaşır
export const Kese: React.FC<{ x: number; y: number; s?: number; t?: number; spill?: number }> = ({ x, y, s = 1, t = 0, spill = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={110} rx={150} ry={22} fill="#000" opacity={0.25} />
    <path d="M-120,100 Q-150,-20 -50,-80 L50,-80 Q150,-20 120,100Z" fill="#8E2F2A" stroke={LN} strokeWidth={6} />
    <path d="M-120,100 Q-150,-20 -50,-80 L50,-80 Q150,-20 120,100Z" fill="url(#hDamask)" opacity={0.3} />
    <path d="M-60,-80 Q0,-110 60,-80 L40,-120 Q0,-140 -40,-120Z" fill="#A33A30" stroke={LN} strokeWidth={5} />
    <path d="M-56,-92 Q0,-74 56,-92" stroke={H.gold} strokeWidth={8} fill="none" />
    {Array.from({ length: 6 }, (_, i) => <g key={i} opacity={cl(spill * 6 - i)} transform={`translate(${-90 + i * 40 + Math.sin(i) * 10},${96 + (i % 2) * 8})`}><ellipse rx={26} ry={12} fill={H.gold} stroke={LN} strokeWidth={3} /><ellipse rx={16} ry={7} fill="none" stroke="#A88028" strokeWidth={2} /></g>)}
    <circle cx={-30} cy={20} r={6} fill="#FFF2C8" opacity={0.5 + 0.5 * Math.sin(t * 4)} />
  </g>
);

// terazi: sol kefe mehir kesesi, sağ kefe açık kafes + uçan kuş (özgürlük). tilt: -1 sol ağır, +1 sağ ağır
export const Terazi: React.FC<{ t: number; tilt?: number; bird?: number }> = ({ t, tilt = 0, bird = 0 }) => {
  const a = tilt * 14 + Math.sin(t * 2) * 1.2;
  const r = (a * Math.PI) / 180;
  const L = 300;
  const ly = -Math.sin(r) * L, ry = Math.sin(r) * L;
  const pan = (x: number, y: number, kids: React.ReactNode) => (
    <g transform={`translate(${x},${y})`}>
      <path d="M0,0 L-110,220 M0,0 L110,220" stroke="#B8902E" strokeWidth={4} />
      <path d="M-140,220 Q0,290 140,220Z" fill={H.gold} stroke={LN} strokeWidth={5} />
      <g transform="translate(0,200)">{kids}</g>
    </g>
  );
  const bk = cl(bird);
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A1E16" />
      <circle cx={960} cy={420} r={520} fill="#FFC870" opacity={0.14} />
      <g transform="translate(960,260)">
        <rect x={-14} y={0} width={28} height={720} fill="#B8902E" stroke={LN} strokeWidth={4} />
        <path d="M-160,720 h320 l-40,-50 h-240Z" fill="#8A6A2A" stroke={LN} strokeWidth={5} />
        <circle r={30} fill={H.gold} stroke={LN} strokeWidth={4} />
        <g transform={`rotate(${a})`}><rect x={-L - 10} y={-10} width={2 * L + 20} height={20} rx={8} fill={H.gold} stroke={LN} strokeWidth={4} /></g>
        {pan(-Math.cos(r) * L, ly, <Kese x={0} y={-60} s={0.5} t={t} />)}
        {pan(Math.cos(r) * L, ry, <g transform="translate(0,-70)">
          <path d="M-60,40 V-50 Q0,-110 60,-50 V40Z" fill="none" stroke="#C9A040" strokeWidth={5} />
          {[-30, 0, 30].map((x) => <line key={x} x1={x} y1={-80} x2={x} y2={40} stroke="#C9A040" strokeWidth={3} />)}
          <path d={`M60,40 L${60 + 50 * bk},${-30 * bk}`} stroke="#C9A040" strokeWidth={5} />
        </g>)}
      </g>
      {/* özgürlük kuşu */}
      {bk > 0 && (() => {
        const bx = 960 + Math.cos(r) * L + lerp(0, 260, bk), by = 260 + ry + 130 - lerp(0, 380, bk);
        const fl = Math.sin(t * 16) * 18;
        return <g transform={`translate(${bx},${by})`}><path d={`M0,0 q-30,${-20 - fl} -60,${-6 - fl} q30,10 60,6 q30,4 60,-6 q-30,${-14 + fl} -60,0Z`} fill="#F4F6F8" stroke={LN} strokeWidth={3} /><circle cx={6} cy={-6} r={10} fill="#F4F6F8" stroke={LN} strokeWidth={3} /><path d="M14,-6 l10,3 l-10,3" fill={H.gold} /></g>;
      })()}
    </g>
  );
};

// sicil arşivi: yüksek raflar dolusu defter (kamera kayar). pan: px
export const SicilArsiv: React.FC<{ t: number; pan?: number }> = ({ t, pan = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A1C" />
    <g transform={`translate(${-pan},0)`}>
      {Array.from({ length: 6 }, (_, i) => <Raf key={i} x={-200 + i * 520} y={110} w={460} rows={7} seed={i * 7} />)}
    </g>
    <rect y={1030} width={1920} height={50} fill="#2A1A10" />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={(rnd(i) * 1920 + t * 10 * (i % 3)) % 1920} cy={200 + rnd(i + 3) * 700} r={2.5} fill="#FFF2C8" opacity={0.5} />)}
  </g>
);

// nikâh senedi (rulo), şart satırı vurgulu. hi 0..1
export const NikahSenet: React.FC<{ t: number; k?: number; hi?: number; x?: number; y?: number; s?: number }> = ({ t, k = 1, hi = 0, x = 960, y = 540, s = 1 }) => {
  const h = lerp(60, 700, cl(k));
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 0.8) * 1.2})`}>
      <rect x={-260} y={-h / 2} width={520} height={h} fill="#F3E3BC" stroke={LN} strokeWidth={6} />
      {k > 0.6 && <g opacity={cl((k - 0.6) / 0.4)}>
        <path d="M-120,-280 q40,-60 80,0 q30,-80 60,0 q30,-50 70,10" stroke={H.gold} strokeWidth={8} fill="none" strokeLinecap="round" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M200,${-190 + i * 60} q-40,-10 -80,0 t-80,0 t-80,0 t-80,0 t-80,0`} stroke="#3A2A1A" strokeWidth={5} fill="none" opacity={0.75} />)}
        <rect x={-235} y={160} width={470} height={70} rx={10} fill="#FFD84A" opacity={0.15 + 0.45 * hi} />
        <path d="M200,195 q-40,-12 -80,0 t-80,0 t-80,0 t-80,0 t-80,0" stroke={H.red} strokeWidth={7} fill="none" />
        {[-120, 120].map((sx) => <circle key={sx} cx={sx} cy={290} r={26} fill="#8E2F2A" opacity={0.8} />)}
      </g>}
      <rect x={-282} y={-h / 2 - 26} width={564} height={44} rx={22} fill="#C9A86A" stroke={LN} strokeWidth={5} />
      <rect x={-282} y={h / 2 - 18} width={564} height={44} rx={22} fill="#C9A86A" stroke={LN} strokeWidth={5} />
    </g>
  );
};

// ───── Türk kimliği işaretleri ─────
// tuğra (stilize): üç dik çizgi (tuğ), ilmek (beyze), kollar (hançere)
export const Tugra: React.FC<{ x: number; y: number; s?: number; c?: string; k?: number }> = ({ x, y, s = 1, c = H.gold, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={c} strokeLinecap="round" strokeWidth={7} strokeDasharray={`${k * 1400} 1400`}>
    <path d="M-20,40 V-120 M10,40 V-130 M40,40 V-110" />
    <path d="M-20,-120 q-14,-10 -6,-22 M10,-130 q-14,-10 -6,-22 M40,-110 q-14,-10 -6,-22" strokeWidth={5} />
    <path d="M-60,40 Q-150,40 -150,0 Q-150,-50 -90,-40 Q-40,-30 -60,20 Q-80,60 -150,60" />
    <path d="M-60,50 Q-200,70 -210,10 Q-220,-70 -120,-70" strokeWidth={5} />
    <path d="M-30,48 Q60,60 140,30 Q190,10 220,-10" />
    <path d="M-30,60 Q80,80 160,50 Q210,30 240,0" strokeWidth={5} />
    <path d="M-40,40 q20,-30 40,0 q20,-30 40,0 q20,-26 50,4" strokeWidth={5} />
  </g>
);

// Bursa manzarası: Uludağ karlı, Ulu Cami çok kubbeli + iki kalem minare, selviler. (x,y,w,h) alanına çizer
export const BursaManzara: React.FC<{ x: number; y: number; w: number; h: number; night?: number }> = ({ x, y, w, h, night = 0 }) => {
  const sx = w / 600, sy = h / 400;
  return (
    <g transform={`translate(${x},${y}) scale(${sx},${sy})`}>
      <rect width={600} height={400} fill={night ? "#1C2440" : "#CFE3EE"} />
      <path d="M0,260 L120,120 L200,170 L300,60 L420,150 L520,100 L600,180 V400 H0Z" fill={night ? "#2E3A5A" : "#7FA08A"} />
      <path d="M270,95 L300,60 L335,100 L318,96 L300,110 L286,98Z" fill="#F4F6F8" />
      <path d="M0,300 Q300,250 600,300 V400 H0Z" fill={night ? "#26304A" : "#9DB88E"} />
      <g transform="translate(300,330)" fill={night ? "#4A5470" : "#B8C2C8"} stroke={LN} strokeWidth={2}>
        <rect x={-150} y={-10} width={300} height={70} />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-140 + i * 60},-10 a30,26 0 0 1 60,0Z`} />)}
        {Array.from({ length: 4 }, (_, i) => <path key={`b${i}`} d={`M${-110 + i * 60},-24 a30,24 0 0 1 60,0Z`} opacity={0.9} />)}
        {[-175, 175].map((mx) => <g key={mx}><rect x={mx - 7} y={-150} width={14} height={210} /><path d={`M${mx - 9},-150 L${mx},-200 L${mx + 9},-150Z`} fill={night ? "#5A6480" : "#8A9AA8"} /><rect x={mx - 11} y={-110} width={22} height={6} /></g>)}
      </g>
      {[60, 110, 520, 560].map((cx, i) => <path key={i} d={`M${cx},400 q-12,-60 0,-120 q12,60 0,120Z`} fill={night ? "#1A2A22" : "#3F6B33"} />)}
    </g>
  );
};

// Bursa sokağı: cumbalı ahşap Osmanlı evleri, arnavut kaldırımı, arkada Ulu Cami + Uludağ. pan: px
export const BursaSokak: React.FC<{ t: number; pan?: number; dusk?: number }> = ({ t, pan = 0, dusk = 0 }) => {
  const EV = ["#C98A5A", "#E7D2A8", "#B9776A", "#D9B98A", "#A9B8A0"];
  const off = ((pan % 520) + 520) % 520;
  const base = Math.floor(pan / 520);
  return (
    <g>
      <BursaManzara x={0} y={0} w={1920} h={760} />
      {dusk > 0 && <rect width={1920} height={760} fill="#E8905A" opacity={0.25 * dusk} />}
      <g transform={`translate(${-off},0)`}>
        {Array.from({ length: 6 }, (_, i) => {
          const x = -260 + i * 520, c = EV[(((i + base) % EV.length) + EV.length) % EV.length];
          return (
            <g key={i}>
              <rect x={x} y={640} width={480} height={300} fill="#B8AA94" stroke={LN} strokeWidth={5} />
              {Array.from({ length: 4 }, (_, k) => <line key={k} x1={x} y1={700 + k * 60} x2={x + 480} y2={700 + k * 60} stroke="#9A8C78" strokeWidth={3} />)}
              <rect x={x + 180} y={760} width={120} height={180} fill="#5A3A22" stroke={LN} strokeWidth={5} />
              <path d={`M${x - 30},640 L${x + 10},600 H${x + 470} L${x + 510},640Z`} fill="#6A4A30" stroke={LN} strokeWidth={4} />
              <rect x={x - 30} y={360} width={540} height={250} fill={c} stroke={LN} strokeWidth={5} />
              {Array.from({ length: 4 }, (_, k) => <g key={k}><rect x={x + 10 + k * 128} y={400} width={96} height={150} fill="#3A4A5A" stroke={LN} strokeWidth={4} /><path d={`M${x + 10 + k * 128},475 H${x + 106 + k * 128} M${x + 58 + k * 128},400 V550`} stroke="#E7D2A8" strokeWidth={4} /></g>)}
              <path d={`M${x - 60},370 L${x + 240},250 L${x + 540},370Z`} fill="#A84A30" stroke={LN} strokeWidth={5} />
              {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${x - 20 + k * 70},360 q15,-12 30,0`} stroke="#8A3A22" strokeWidth={3} fill="none" />)}
              <g transform={`translate(${x + 400},600)`}><rect x={-26} y={-30} width={52} height={34} fill="#B86A42" stroke={LN} strokeWidth={3} />{[-14, 0, 14].map((lx, j) => <g key={j}><path d={`M${lx},-30 v-34`} stroke={H.green} strokeWidth={3} /><path d={`M${lx},-62 q-10,-6 -8,-22 q4,6 8,8 q4,-2 8,-8 q2,16 -8,22Z`} fill={j % 2 ? H.red : "#E8604A"} stroke={LN} strokeWidth={2} /></g>)}</g>
            </g>
          );
        })}
      </g>
      <rect y={940} width={1920} height={140} fill="#8E8270" />
      {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={((i * 97 - pan) % 1980 + 1980) % 1980 - 30} cy={960 + (i % 4) * 30} rx={34} ry={12} fill="#A89A84" stroke="#6E6252" strokeWidth={2} />)}
      {Array.from({ length: 6 }, (_, i) => <circle key={`m${i}`} cx={(i * 330 + t * 14) % 1920} cy={300 + (i % 3) * 90} r={2.5} fill="#FFF" opacity={0.5} />)}
    </g>
  );
};
