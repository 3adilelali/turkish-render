import React from "react";
import { T, lerp } from "./Toon";

// Kanal 5 "çağlar" kiti (Toon ile aynı dil, 2026-11-01): Türkiye'nin 1300 yılı. Hepsi vektör.
// Mekânlar 1920×1080 tuval; zemin çizgisi ~y=1040 (TFig y=1040 ile ayak basar).

const sh = (c: string, k = 0.78) => {
  const n = [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) * k));
  return `rgb(${n.join(",")})`;
};

// ───────── nesneler ─────────
// Eski harfli mektup: sağdan sola kıvrımlı satırlar (okunabilir metin değil, sadece doku)
export const OldLetter: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number; glow?: number; first?: string }> = ({ x, y, s = 1, rot = -3, t = 0, glow = 0, first }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {glow > 0 && <ellipse rx={420} ry={330} fill="url(#tGlow)" opacity={glow} />}
    <path d="M-260,-200 L250,-210 L262,190 L-250,204 L-256,120 L-246,60Z" fill="#EBD9AE" stroke="#B89A5E" strokeWidth={4} />
    <path d="M-260,-200 L250,-210 L262,190 L-250,204Z" fill="none" stroke="#C9AE74" strokeWidth={2} opacity={0.5} transform="translate(6,6)" />
    {Array.from({ length: 9 }, (_, r) => {
      const yy = -150 + r * 38;
      const w = r === 0 ? 160 : 420 - ((r * 53) % 90);
      let d = `M${210},${yy}`;
      for (let k = 0; k < w / 26; k++) {
        const h = ((k * 7 + r * 3) % 5) * 5 + 4;
        d += ` q-6,${-h} -13,0 q-6,${h * 0.5} -13,0`;
      }
      return <g key={r}>
        <path d={d} stroke="#5A3A1E" strokeWidth={3.4} fill="none" strokeLinecap="round" opacity={0.85} />
        {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={190 - ((k * 83 + r * 41) % Math.max(60, w - 20))} cy={yy - 18 - (k % 2) * 6} r={2.6} fill="#5A3A1E" />)}
      </g>;
    })}
    <circle cx={-170} cy={150} r={34} fill="none" stroke="#7A2E2E" strokeWidth={4} opacity={0.6} />
    {first && <text x={150} y={-140} textAnchor="middle" fontFamily="Patrick Hand" fontSize={44} fill={T.red2} opacity={Math.min(1, t)}>{first}</text>}
  </g>
);

export const TinBox: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={80} rx={8} fill="#2F6E8E" />
    <rect x={-120} y={-80} width={240} height={80} rx={8} fill="none" stroke="#D8B45A" strokeWidth={5} />
    {[-80, -40, 0, 40, 80].map((xx) => <circle key={xx} cx={xx} cy={-40} r={10} fill="#D8B45A" opacity={0.7} />)}
    <g transform={`translate(-124,-80) rotate(${-open * 70})`}><rect x={0} y={-24} width={248} height={26} rx={6} fill="#2A6080" stroke="#D8B45A" strokeWidth={4} /></g>
  </g>
);

export const TrFlag: React.FC<{ x: number; y: number; w?: number; t?: number; wave?: number }> = ({ x, y, w = 300, t = 0, wave = 1 }) => {
  const h = (w * 2) / 3;
  const d = (k: number) => Math.sin(t * 4 + k * 4) * 8 * wave;
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={`M0,${d(0)} Q${w / 2},${d(0.5) - 10 * wave} ${w},${d(1)} L${w},${h + d(1)} Q${w / 2},${h + d(0.5) - 10 * wave} 0,${h + d(0)}Z`} fill="#E30A17" />
      <circle cx={w * 0.38} cy={h / 2} r={h * 0.25} fill="#FFFFFF" />
      <circle cx={w * 0.42} cy={h / 2} r={h * 0.2} fill="#E30A17" />
      <path transform={`translate(${w * 0.6},${h / 2}) scale(${h * 0.0125}) rotate(-18)`} d="M0,-10 L2.35,-3.24 L9.51,-3.09 L3.8,1.24 L5.88,8.09 L0,4 L-5.88,8.09 L-3.8,1.24 L-9.51,-3.09 L-2.35,-3.24Z" fill="#FFFFFF" />
    </g>
  );
};

export const Kopuz: React.FC<{ s?: number; t?: number }> = ({ s = 1, t = 0 }) => (
  <g transform={`scale(${s}) rotate(-35)`}>
    <ellipse cx={0} cy={40} rx={46} ry={62} fill="#9A5B2E" />
    <ellipse cx={0} cy={40} rx={30} ry={40} fill="#E8D3A2" />
    <rect x={-9} y={-140} width={18} height={150} rx={6} fill="#7A4420" />
    <path d="M-10,-150 l-14,-24 l28,0 l-14,24Z" fill="#5A3010" />
    {[-5, 0, 5].map((xx, i) => <path key={i} d={`M${xx},-140 L${xx + Math.sin(t * 40 + i) * 1.5},90`} stroke="#F2E6C8" strokeWidth={1.6} />)}
  </g>
);

export const BigBook: React.FC<{ x: number; y: number; s?: number; page?: number }> = ({ x, y, s = 1, page = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-240,-20 L0,0 L240,-20 L240,150 L0,170 L-240,150Z" fill="#6E3B1E" />
    <path d="M-226,-30 Q-110,-50 0,-12 L0,152 Q-110,120 -226,138Z" fill="#F1E2BD" />
    <path d="M226,-30 Q110,-50 0,-12 L0,152 Q110,120 226,138Z" fill="#EAD8AE" />
    {Array.from({ length: 6 }, (_, r) => <g key={r} stroke="#3A2A1A" strokeWidth={3} strokeLinecap="round">
      <path d={`M-200,${-6 + r * 24} q20,-6 40,0 q20,6 40,0 q20,-6 40,0 q20,6 40,0`} fill="none" opacity={0.75} />
      <path d={`M40,${-6 + r * 24} q20,-6 40,0 q20,6 40,0 q20,-6 40,0`} fill="none" opacity={0.75} />
    </g>)}
    <path d="M-200,-6 q20,-6 40,0" stroke="#A3201A" strokeWidth={4} fill="none" />
    {page > 0 && <path d={`M0,-12 Q${lerp(120, -120, page)},${-60 + Math.sin(page * Math.PI) * -40} ${lerp(226, -226, page)},-30 L${lerp(226, -226, page)},138 Q${lerp(110, -110, page)},120 0,152Z`} fill="#F7EBCB" opacity={0.95} />}
  </g>
);

export const Horse: React.FC<{ x: number; y: number; s?: number; c?: string; t?: number; dir?: 1 | -1; graze?: number }> = ({ x, y, s = 1, c = "#7A4E2E", t = 0, dir = 1, graze = 0 }) => {
  const leg = (lx: number, ph: number) => <path d={`M${lx},-90 L${lx + Math.sin(t * 2 + ph) * 3},0`} stroke={sh(c)} strokeWidth={18} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      {leg(-90, 0)}{leg(-60, 1)}{leg(70, 2)}{leg(100, 3)}
      <ellipse cx={0} cy={-120} rx={140} ry={60} fill={c} />
      <g transform={`rotate(${graze * 55},110,-150)`}>
        <path d="M100,-150 L170,-250 Q190,-275 215,-260 L240,-215 Q245,-195 225,-195 L180,-205 L140,-120Z" fill={c} />
        <path d="M150,-240 Q120,-200 105,-150" stroke="#2A1A10" strokeWidth={16} fill="none" strokeLinecap="round" />
        <circle cx={205} cy={-245} r={6} fill="#1A1A1A" />
        <path d="M185,-262 l6,-24 l10,22" fill={c} />
      </g>
      <path d={`M-140,-130 Q-180,${-90 + Math.sin(t * 3) * 10} -170,-40`} stroke="#2A1A10" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const Camel: React.FC<{ x: number; y: number; s?: number; t?: number; dir?: 1 | -1; load?: string }> = ({ x, y, s = 1, t = 0, dir = 1, load = "#B8352E" }) => {
  const ph = t * 5;
  const leg = (lx: number, k: number) => <path d={`M${lx},-150 L${lx + Math.sin(ph + k) * 18},0`} stroke="#B98A55" strokeWidth={16} strokeLinecap="round" />;
  return (
    <g transform={`translate(${x},${y + Math.abs(Math.sin(ph)) * -4}) scale(${s * dir},${s})`}>
      {leg(-80, 0)}{leg(-50, Math.PI)}{leg(60, Math.PI)}{leg(90, 0)}
      <path d="M-120,-150 Q-110,-260 -20,-250 Q20,-300 70,-250 Q130,-240 130,-150Z" fill="#D2A46A" />
      <rect x={-70} y={-280} width={110} height={60} rx={10} fill={load} /><rect x={-70} y={-262} width={110} height={10} fill="#F2C14E" />
      <path d="M120,-170 Q170,-240 170,-300 Q190,-320 220,-300 L230,-280 L190,-280 Q190,-230 150,-160Z" fill="#D2A46A" />
      <circle cx={208} cy={-300} r={5} fill="#222" />
    </g>
  );
};

// Taş yazıt (Orhun): kaplumbağa kaide + dikili taş + kazınmış işaretler
export const Stele: React.FC<{ x: number; y: number; s?: number; carve?: number }> = ({ x, y, s = 1, carve = 1 }) => {
  const glyph = (i: number) => {
    const k = i % 6;
    return ["M0,0 v34 M0,10 l12,-10 M0,10 l12,10", "M0,0 l12,17 l-12,17", "M0,0 v34 M0,17 h12", "M12,0 l-12,17 l12,17", "M0,0 v34 M12,0 v34 M0,17 h12", "M6,0 v34 M0,8 l6,6 l6,-6"][k];
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={-30} rx={260} ry={70} fill="#7E8A8E" />
      <path d="M-200,-50 Q0,-150 200,-50" fill="#909DA1" />
      <circle cx={250} cy={-60} r={44} fill="#848F93" />
      <path d="M-150,-90 L-130,-780 Q0,-840 130,-780 L150,-90Z" fill="#A4AEB0" />
      <path d="M-130,-780 Q0,-840 130,-780 L120,-720 Q0,-770 -120,-720Z" fill="#8C979A" />
      <path d="M-150,-90 L-130,-780" stroke="#7C878A" strokeWidth={8} />
      {Array.from({ length: 6 }, (_, c) => Array.from({ length: 13 }, (_, r) => {
        const i = c * 13 + r;
        return i / 78 < carve && <path key={i} transform={`translate(${70 - c * 34},${-700 + r * 46})`} d={glyph(i * 7 + c)} stroke="#4E585B" strokeWidth={5} fill="none" strokeLinecap="round" />;
      }))}
    </g>
  );
};

// Atalar ağacı: her kuşakta ikiye katlanan noktalar
export const AncTree: React.FC<{ t: number; k: number; n?: number }> = ({ t, k, n = 7 }) => {
  const show = k * n;
  const rows = Array.from({ length: n }, (_, g) => g);
  return (
    <g>
      {rows.map((g) => {
        const cnt = 2 ** g;
        const y = 960 - g * 128;
        const op = Math.max(0, Math.min(1, show - g + 1));
        return <g key={g} opacity={op}>
          {Array.from({ length: Math.min(cnt, 64) }, (_, i) => {
            const x = 960 + (i - (Math.min(cnt, 64) - 1) / 2) * Math.min(220, 1700 / Math.min(cnt, 64));
            const px = g === 0 ? 960 : 960 + (Math.floor(i / 2) - (Math.min(cnt / 2, 64) - 1) / 2) * Math.min(220, 1700 / Math.min(cnt / 2, 64));
            return <g key={i}>{g > 0 && <path d={`M${px},${y + 128} L${x},${y}`} stroke="#E8D3A2" strokeWidth={2} opacity={0.5} />}
              <circle cx={x} cy={y} r={g === 0 ? 30 : Math.max(5, 22 - g * 2.6)} fill={g === 0 ? T.hero : g % 2 ? "#F2C14E" : "#E8A87C"} transform={`translate(0,${Math.sin(t * 3 + i) * 2})`} /></g>;
          })}
          <text x={160} y={y + 12} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F3E6CF">{g === 0 ? "SEN" : cnt.toLocaleString("tr-TR")}</text>
        </g>;
      })}
    </g>
  );
};

// ───────── mekânlar ─────────
// Atalar yolu: perspektif toprak yol; çağ ilerledikçe gök ve renk eskir (era 0 = bugün, 1 = Orhun)
export const AncRoad: React.FC<{ t: number; era?: number; px?: number }> = ({ t, era = 0, px = 0 }) => {
  const sky = era < 0.5 ? ["#8FC6E2", "#F3E6CF"] : era < 0.8 ? ["#D99A5E", "#F3D9A8"] : ["#6F8796", "#C9D3CF"];
  const ground = era < 0.8 ? "#C9A86A" : "#9DAA7A";
  return (
    <g>
      <defs><linearGradient id="eSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#eSky)" />
      <circle cx={1500} cy={220} r={90} fill="#FFF3C4" opacity={0.85} />
      {[0, 1, 2].map((k) => <ellipse key={k} cx={((200 + k * 700 + t * 15) % 2300) - 200} cy={140 + k * 60} rx={150} ry={30} fill="#FFFFFF" opacity={0.6} />)}
      <path d="M0,620 Q300,540 620,600 Q960,520 1300,590 Q1650,530 1920,600 L1920,1080 L0,1080Z" fill={sh(ground, 0.85)} />
      <path d="M0,700 Q480,640 960,680 Q1440,640 1920,700 L1920,1080 L0,1080Z" fill={ground} />
      <path d="M900,640 L1020,640 L1620,1080 L300,1080Z" fill="#B08C55" />
      {Array.from({ length: 12 }, (_, i) => {
        const k = ((i / 12 + (px * 0.0006)) % 1);
        const yy = 650 + k * k * 430, w = 8 + k * 60;
        return <rect key={i} x={960 - w / 2 + (i % 2 ? -1 : 1) * k * 140} y={yy} width={w} height={4 + k * 10} rx={4} fill="#9B7744" opacity={0.6} />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const k = ((i / 9 + px * 0.0006) % 1), side = i % 2 ? 1 : -1;
        const sx = 960 + side * (90 + k * 1100), sy = 650 + k * k * 430, ss = 0.15 + k * 1.1;
        return <g key={`tr${i}`} transform={`translate(${sx},${sy}) scale(${ss})`}><rect x={-12} y={-180} width={24} height={180} fill="#6E4E2E" /><ellipse cx={0} cy={-220} rx={90} ry={110} fill={era < 0.8 ? "#5E8A4E" : "#7A8F5E"} /></g>;
      })}
    </g>
  );
};

// Ankara'da babaanne evi (gece): dantelli kanepe, vitrin, dolap üstü kutu, pencerede şehir ışıkları
export const Babaanne: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#EAD9BC" />
    <rect width={1920} height={1080} fill="url(#tTile)" opacity={0.4} />
    <rect y={860} width={1920} height={220} fill="#8A5A32" />
    <rect x={160} y={900} width={1200} height={150} fill="url(#tCarpet)" opacity={0.9} />
    <g transform="translate(1360,170)">
      <rect width={420} height={420} rx={10} fill="#0F1C33" />
      {Array.from({ length: 26 }, (_, i) => <rect key={i} x={20 + ((i * 67) % 380)} y={200 + ((i * 41) % 180)} width={10} height={14} fill="#F6D27A" opacity={0.4 + 0.6 * ((Math.sin(t * 1.5 + i) + 1) / 2)} />)}
      <path d="M0,330 L60,250 L120,300 L200,220 L280,290 L340,240 L420,300 L420,420 L0,420Z" fill="#1A2A44" />
      <rect width={420} height={420} rx={10} fill="none" stroke="#F3E7D3" strokeWidth={18} /><path d="M210,0 V420 M0,210 H420" stroke="#F3E7D3" strokeWidth={10} />
      <path d="M-40,-20 Q20,200 -30,460 L-80,460 L-80,-20Z M460,-20 Q400,200 450,460 L500,460 L500,-20Z" fill="#9E2F38" />
    </g>
    <g transform="translate(140,240)">
      <rect width={420} height={620} rx={8} fill="#7A4A26" /><rect x={20} y={20} width={380} height={300} fill="#BFDDE2" opacity={0.5} />
      {[0, 1, 2].map((r) => <rect key={r} x={20} y={100 + r * 100} width={380} height={8} fill="#6A3E1E" />)}
      {[60, 140, 220, 300].map((xx, i) => <g key={xx}><path d={`M${xx},${90 + (i % 2) * 100} l-14,-40 h28Z`} fill="#E8EEF2" opacity={0.8} /></g>)}
      <rect x={20} y={340} width={185} height={260} rx={4} fill="#8A5A32" /><rect x={215} y={340} width={185} height={260} rx={4} fill="#8A5A32" />
      <circle cx={190} cy={470} r={8} fill="#D8B45A" /><circle cx={230} cy={470} r={8} fill="#D8B45A" />
    </g>
    <g transform="translate(560,640)">
      <rect x={0} y={60} width={700} height={160} rx={30} fill="#7E3A3A" />
      <rect x={0} y={-60} width={700} height={140} rx={40} fill="#934545" />
      <path d="M40,-40 l40,30 l40,-30 l40,30 l40,-30 l40,30 l40,-30 l40,30 l40,-30 l40,30 l40,-30 l40,30 l40,-30 l40,30 l40,-30" stroke="#F7F1E6" strokeWidth={6} fill="none" />
      <rect x={-40} y={20} width={80} height={200} rx={30} fill="#7E3A3A" /><rect x={660} y={20} width={80} height={200} rx={30} fill="#7E3A3A" />
    </g>
    <ellipse cx={1290} cy={520} rx={240} ry={240} fill="url(#tGlow)" opacity={0.6 + 0.05 * Math.sin(t * 7)} />
    <g transform="translate(1290,860)"><rect x={-6} y={-330} width={12} height={330} fill="#3A2A1A" /><path d="M-70,-330 L70,-330 L44,-420 L-44,-420Z" fill="#E9C46A" /></g>
  </g>
);

// 1980'ler oturma odası: tüplü TV, duvar kâğıdı, dantel
export const Room80: React.FC<{ t: number; tv?: "flag" | "snow" | "news" }> = ({ t, tv = "flag" }) => (
  <g>
    <rect width={1920} height={1080} fill="#D9C08E" />
    {Array.from({ length: 16 }, (_, i) => Array.from({ length: 9 }, (_, j) => <path key={`${i}${j}`} d={`M${i * 130 + (j % 2) * 65},${j * 110} l20,30 l-20,30 l-20,-30Z`} fill="#C4A673" opacity={0.6} />))}
    <rect y={850} width={1920} height={230} fill="#7A5232" /><rect x={300} y={880} width={1300} height={170} fill="url(#tCarpet2)" opacity={0.9} />
    <g transform="translate(960,520)">
      <rect x={-330} y={250} width={660} height={90} fill="#6A4424" />
      <rect x={-260} y={-260} width={520} height={500} rx={30} fill="#5A3A20" /><rect x={-250} y={-250} width={500} height={480} rx={26} fill="#6E4A2A" />
      <rect x={-210} y={-210} width={340} height={300} rx={40} fill="#1A1A1A" />
      <g clipPath="url(#eTv)">
        <defs><clipPath id="eTv"><rect x={-200} y={-200} width={320} height={280} rx={36} /></clipPath></defs>
        {tv === "flag" && <><rect x={-200} y={-200} width={320} height={280} fill="#2A2A2A" /><TrFlag x={-170} y={-150} w={260} t={t} /></>}
        {tv === "snow" && Array.from({ length: 160 }, (_, i) => <rect key={i} x={-200 + ((i * 37 + Math.floor(t * 30) * 13) % 320)} y={-200 + ((i * 53 + Math.floor(t * 30) * 7) % 280)} width={6} height={6} fill="#EEE" opacity={0.7} />)}
        {tv === "news" && <><rect x={-200} y={-200} width={320} height={280} fill="#2C4A7A" /><circle cx={-40} cy={-60} r={40} fill="#141414" /><rect x={-90} y={-20} width={100} height={100} rx={20} fill="#3A3A3A" /></>}
        <rect x={-200} y={-200} width={320} height={280} fill="url(#tScan)" />
      </g>
      {[0, 1].map((k) => <circle key={k} cx={190} cy={-150 + k * 70} r={22} fill="#C9A86A" />)}
      <path d="M-60,-260 L-140,-400 M60,-260 L140,-400" stroke="#888" strokeWidth={6} />
      <path d="M-200,-262 Q-100,-230 0,-262 Q100,-230 200,-262 L200,-250 Q100,-220 0,-250 Q-100,-220 -200,-250Z" fill="#FFFFFF" opacity={0.9} />
    </g>
  </g>
);

// Kahvehane (1960'lar): ahşap, raf üstünde radyo, ocak, ince belli bardaklar
export const Kahvehane: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9A26E" />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y={0} width={4} height={700} fill="#B08A58" />)}
    <rect y={700} width={1920} height={380} fill="#6E4A2A" /><rect y={700} width={1920} height={20} fill="#5A3A20" />
    <g transform="translate(1340,140)">
      <rect width={480} height={320} fill="#BFE0EE" /><path d="M0,230 Q120,180 240,220 Q360,170 480,210 L480,320 L0,320Z" fill="#9FBF86" />
      <rect width={480} height={320} fill="none" stroke="#5A3A20" strokeWidth={16} /><path d="M240,0 V320" stroke="#5A3A20" strokeWidth={10} />
    </g>
    <g transform="translate(260,260)">
      <rect x={-120} y={70} width={340} height={14} fill="#5A3A20" />
      <rect x={-60} y={-60} width={220} height={130} rx={18} fill="#8A5A32" /><rect x={-40} y={-40} width={110} height={90} rx={10} fill="#E8D3A2" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-36 + i * 18},-36 V46`} stroke="#B08A58" strokeWidth={4} />)}
      <circle cx={110} cy={-10} r={20} fill="#3A2A1A" /><circle cx={110} cy={40} r={14} fill="#3A2A1A" />
      {[0, 1, 2].map((i) => { const k = ((t * 0.7 + i / 3) % 1); return <text key={i} x={180 + Math.sin(k * 6) * 20} y={-30 - k * 120} fontSize={40} fill="#5A3A20" opacity={1 - k}>♪</text>; })}
    </g>
    {[520, 1100].map((x0, j) => <g key={j} transform={`translate(${x0},880)`}>
      <rect x={-200} y={-30} width={400} height={26} rx={6} fill="#8A5A32" /><rect x={-14} y={-4} width={28} height={160} fill="#6A4424" />
      <rect x={-150} y={-62} width={130} height={34} rx={4} fill="#E8D3A2" /><rect x={30} y={-62} width={130} height={34} rx={4} fill="#E8D3A2" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-144 + i * 24} y={-58} width={18} height={26} rx={3} fill="#FBF6E8" stroke="#CCC" />)}
      <g transform="translate(0,-34)"><path d="M-12,-46 L12,-46 Q4,-24 10,0 L-10,0 Q-4,-24 -12,-46Z" fill="#DDF1F7" opacity={0.85} /><path d="M-9,-30 L9,-30 Q4,-14 8,0 L-8,0 Q-4,-14 -9,-30Z" fill="#B5432F" opacity={0.9} /></g>
    </g>)}
    {[0, 1, 2].map((i) => <path key={i} d={`M${1000 + i * 20},${640 - ((t * 40 + i * 30) % 90)} q10,-20 0,-40`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.4} />)}
  </g>
);

// Osmanlı İstanbul sokağı (1900'ler): cumbalı ahşap evler, Arnavut kaldırımı, gaz lambası, ufukta minare
export const OttoStreet: React.FC<{ t: number; px?: number; dusk?: number }> = ({ t, px = 0, dusk = 0 }) => {
  const cols = ["#C98A5A", "#9DB0A0", "#D9B48A", "#B57A6A", "#A7A2C0", "#D4A373"];
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      <g opacity={0.55} transform={`translate(${-px * 0.2},0)`}>
        <path d="M600,420 Q760,300 920,420Z" fill="#7A8AA0" /><rect x={600} y={420} width={320} height={60} fill="#7A8AA0" />
        {[560, 960].map((x) => <g key={x}><rect x={x} y={220} width={18} height={260} fill="#7A8AA0" /><path d={`M${x - 4},220 l13,-60 l13,60Z`} fill="#7A8AA0" /></g>)}
      </g>
      <g transform={`translate(${-px},0)`}>
        {Array.from({ length: 9 }, (_, i) => {
          const x = -150 + i * 300, h = 460 + ((i * 71) % 120), c = cols[i % cols.length];
          return (
            <g key={i}>
              <rect x={x} y={860 - h} width={300} height={h} fill={c} />
              {Array.from({ length: 14 }, (_, k) => <path key={k} d={`M${x},${860 - h + k * 34} H${x + 300}`} stroke={sh(c)} strokeWidth={2} opacity={0.5} />)}
              <path d={`M${x - 14},${860 - h} L${x + 150},${860 - h - 70} L${x + 314},${860 - h}Z`} fill="#8E4A3A" />
              <rect x={x + 40} y={860 - h + 60} width={220} height={170} fill={sh(c, 0.9)} />
              <path d={`M${x + 40},${860 - h + 230} L${x + 70},${860 - h + 270} L${x + 230},${860 - h + 270} L${x + 260},${860 - h + 230}`} fill={sh(c, 0.7)} />
              {[0, 1, 2].map((w) => <rect key={w} x={x + 58 + w * 68} y={860 - h + 80} width={50} height={120} rx={4} fill="#5E7F8F" stroke="#F3E7D3" strokeWidth={5} />)}
              {[0, 1, 2].map((w) => Array.from({ length: 4 }, (_, q) => <path key={`${w}${q}`} d={`M${x + 58 + w * 68},${860 - h + 92 + q * 26} h50`} stroke="#F3E7D3" strokeWidth={3} />))}
              <rect x={x + 110} y={700} width={80} height={160} rx={6} fill="#5A3A20" />
            </g>
          );
        })}
      </g>
      <rect y={860} width={1920} height={220} fill="#8E8A80" />
      {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={((i * 97 - px) % 2000 + 2000) % 2000 - 40} cy={880 + (i % 5) * 40} rx={34} ry={14} fill="#7A766C" />)}
      <g transform={`translate(${1500 - px * 0.9},860)`}>
        <rect x={-8} y={-360} width={16} height={360} fill="#2A2A2A" /><path d="M-36,-360 L36,-360 L26,-430 L-26,-430Z" fill="#3A3A3A" />
        <rect x={-22} y={-424} width={44} height={60} fill="#FFE59A" opacity={0.6 + (dusk ? 0.4 : 0)} />
      </g>
    </g>
  );
};

// 1876 devlet dairesi: yüksek pencere (Boğaz + cami silueti), masa, hokka, kâğıtlar
export const Daire: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#E3D3B4" />
    <rect y={0} width={1920} height={60} fill="#B89A6A" />
    <g transform="translate(1180,120)">
      <path d="M0,600 L0,140 Q200,-40 400,140 L400,600Z" fill="#9CC8DE" />
      <path d="M0,430 Q100,410 200,430 Q300,410 400,430 L400,600 L0,600Z" fill="#4E86A6" />
      {[0, 1, 2].map((k) => <path key={k} d={`M${((t * 30 + k * 140) % 460) - 40},${470 + k * 30} q20,-6 40,0`} stroke="#DCEFF7" strokeWidth={4} fill="none" />)}
      <g fill="#6E8296" opacity={0.8}><path d="M140,430 Q200,350 260,430Z" /><rect x={120} y={330} width={10} height={100} /><rect x={270} y={330} width={10} height={100} /></g>
      <path d="M0,600 L0,140 Q200,-40 400,140 L400,600Z" fill="none" stroke="#6A4A2A" strokeWidth={18} /><path d="M200,40 V600 M0,330 H400" stroke="#6A4A2A" strokeWidth={10} />
    </g>
    <rect y={820} width={1920} height={260} fill="#7A4E2A" /><rect y={820} width={1920} height={260} fill="url(#tCarpet)" opacity={0.35} />
    <g transform="translate(700,820)">
      <rect x={-380} y={-40} width={760} height={40} rx={6} fill="#5A3418" /><rect x={-360} y={0} width={30} height={200} fill="#4A2A12" /><rect x={330} y={0} width={30} height={200} fill="#4A2A12" />
      {[-220, -60].map((xx, i) => <g key={i} transform={`translate(${xx},-48) rotate(${i ? 6 : -4})`}><rect x={-90} y={-14} width={180} height={14} fill="#F4E8C8" />{[0, 1, 2].map((r) => <path key={r} d={`M${70},${-10 + r * 0} h-${120 - r * 20}`} />)}</g>)}
      <g transform="translate(200,-50)"><rect x={-26} y={-30} width={52} height={36} rx={8} fill="#3A3A3A" /><path d="M10,-30 L60,-110" stroke="#F4E8C8" strokeWidth={5} /><path d="M54,-104 l20,-30" stroke="#E8DCC0" strokeWidth={10} strokeLinecap="round" /></g>
    </g>
    <ellipse cx={420} cy={420} rx={200} ry={200} fill="url(#tGlow)" opacity={0.5 + 0.05 * Math.sin(t * 6)} />
    <g transform="translate(420,520)"><rect x={-6} y={-60} width={12} height={60} fill="#B08A3A" /><path d="M-30,-60 Q0,-140 30,-60Z" fill="#FFF3C4" opacity={0.85} /></g>
  </g>
);

// Hızlı geçiş: tarla, tekke kapısı, kervan
export const Fields: React.FC<{ t: number; px?: number; tone?: number }> = ({ t, px = 0, tone = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={tone ? "#E9C38A" : "#BFE0EE"} />
    <path d="M0,560 Q480,470 960,540 Q1440,470 1920,540 L1920,1080 L0,1080Z" fill="#9FB27A" />
    <g transform={`translate(${-px},0)`}>
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 140},${700 + (i % 3) * 20} q20,-80 0,-160`} stroke="#D9B45A" strokeWidth={10} fill="none" opacity={0.8} />)}
      {Array.from({ length: 6 }, (_, i) => <g key={`h${i}`} transform={`translate(${200 + i * 700},620)`}><rect x={-80} y={-90} width={160} height={90} fill="#D9C9A8" /><path d="M-100,-90 L0,-150 L100,-90Z" fill="#9A5A3A" /><rect x={-20} y={-56} width={40} height={56} fill="#6A4424" /></g>)}
    </g>
    <path d="M0,780 Q960,740 1920,790 L1920,1080 L0,1080Z" fill="#B9C98A" />
    <path d="M0,900 Q960,860 1920,910 L1920,1080 L0,1080Z" fill="#A88A5A" />
  </g>
);

// Yayla (1550'ler): yeşil tepeler, kara çadırlar, ateş, dağlar; akşamüstü
export const Yayla: React.FC<{ t: number; night?: number }> = ({ t, night = 0.4 }) => (
  <g>
    <defs><linearGradient id="eYay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night > 0.5 ? "#2A2F5A" : "#5A6FA8"} /><stop offset="0.7" stopColor={night > 0.5 ? "#C46A5A" : "#F2B27A"} /><stop offset="1" stopColor="#F7D9A0" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#eYay)" />
    {night > 0.3 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 137) % 1920} cy={(i * 59) % 380} r={2.4} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    <path d="M0,560 L260,330 L420,460 L700,250 L960,470 L1240,300 L1500,460 L1720,340 L1920,470 L1920,1080 L0,1080Z" fill="#6E7FA0" />
    <path d="M700,250 L640,310 L700,300 L760,320Z M1240,300 L1190,350 L1250,340 L1300,355Z" fill="#F4F4F4" />
    <path d="M0,700 Q400,600 900,680 Q1400,600 1920,690 L1920,1080 L0,1080Z" fill="#5E8A4E" />
    <path d="M0,840 Q960,780 1920,850 L1920,1080 L0,1080Z" fill="#6E9A56" />
    {[[300, 760, 1], [1450, 740, 0.9], [1750, 790, 0.7]].map(([x, y, s], i) => <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-200,0 L-140,-150 L0,-190 L140,-150 L200,0Z" fill="#2E2620" /><path d="M-40,0 L0,-120 L40,0Z" fill="#1A1410" />
      <path d="M-200,0 L-260,30 M200,0 L260,30 M0,-190 L0,-230" stroke="#3A2E24" strokeWidth={5} />
    </g>)}
    <g transform="translate(960,960)">
      <ellipse cx={0} cy={0} rx={300} ry={140} fill="url(#tGlow)" opacity={0.7 + 0.15 * Math.sin(t * 9)} />
      {[-30, 0, 30].map((xx, i) => <path key={i} d={`M${xx},10 Q${xx - 30 + Math.sin(t * 8 + i) * 10},-70 ${xx + Math.sin(t * 6 + i) * 14},${-130 - i * 10} Q${xx + 30},-60 ${xx + 20},10Z`} fill={i === 1 ? "#FFD25A" : "#F28C28"} />)}
      <path d="M-60,14 L60,-4 M-60,-4 L60,14" stroke="#5A3A20" strokeWidth={14} strokeLinecap="round" />
    </g>
    {[[160, 860, 0.5, 1], [1700, 880, 0.45, -1]].map(([x, y, s, d], i) => <Horse key={i} x={x} y={y} s={s} t={t} dir={d as 1 | -1} graze={0.6 + 0.3 * Math.sin(t + i)} c={i ? "#E8DCC8" : "#7A4E2E"} />)}
  </g>
);

// Kaşgar (1070'ler): kerpiç sur, kubbeler, kavaklar, çöl
export const Kashgar: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#F2D7A8" />
    <rect width={1920} height={500} fill="#E9B97A" opacity={0.5} />
    <circle cx={1550} cy={200} r={110} fill="#FFF0C0" />
    <path d="M0,560 Q500,500 1000,550 Q1500,500 1920,560 L1920,1080 L0,1080Z" fill="#E2BE84" />
    <g transform={`translate(${-px},0)`}>
      <rect x={-100} y={420} width={2400} height={260} fill="#C9935A" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-100 + i * 80} y={390} width={44} height={40} fill="#C9935A" />)}
      {[300, 900, 1500].map((x, i) => <g key={i}><rect x={x - 90} y={300} width={180} height={140} fill="#D9A56A" /><path d={`M${x - 90},300 Q${x},${170} ${x + 90},300Z`} fill={i === 1 ? "#3E8E9E" : "#D9A56A"} /></g>)}
      <path d="M800,680 L800,520 Q900,430 1000,520 L1000,680Z" fill="#7A4E2A" />
      {Array.from({ length: 10 }, (_, i) => <g key={`k${i}`} transform={`translate(${60 + i * 240},700)`}><rect x={-6} y={-200} width={12} height={200} fill="#8A6A3A" /><ellipse cx={0} cy={-250} rx={34} ry={110} fill="#7A9A4E" transform={`rotate(${Math.sin(t * 1.5 + i) * 3},0,-150)`} /></g>)}
    </g>
    <rect y={820} width={1920} height={260} fill="#D2AE74" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${((i * 173 + t * 60) % 2100) - 100},${860 + (i % 4) * 50} q40,-10 80,0`} stroke="#C29A60" strokeWidth={6} fill="none" />)}
  </g>
);

// Âlimin odası: kemerli pencere, halı, rahle, kandil
export const Scholar: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#E6C99A" />
    <g transform="translate(1260,150)"><path d="M0,560 L0,200 Q160,20 320,200 L320,560Z" fill="#F7D9A0" /><path d="M0,560 L0,200 Q160,20 320,200 L320,560Z" fill="none" stroke="#B07A4A" strokeWidth={20} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${40 + i * 60},120 L${40 + i * 60},560`} stroke="#B07A4A" strokeWidth={6} opacity={0.6} />)}</g>
    <rect y={800} width={1920} height={280} fill="#9A5A2E" /><rect x={200} y={820} width={1400} height={240} fill="url(#tCarpet)" />
    <ellipse cx={1420} cy={420} rx={260} ry={260} fill="url(#tGlow)" opacity={0.35} />
    <g transform="translate(560,640)"><path d="M-30,0 Q0,-30 30,0 L20,10 L-20,10Z" fill="#B08A3A" /><path d={`M24,-4 Q30,${-30 + Math.sin(t * 9) * 4} 36,-8`} fill="#FFD25A" /><ellipse cx={30} cy={-20} rx={80} ry={80} fill="url(#tGlow)" opacity={0.6} /></g>
    <g transform="translate(560,720)"><rect x={-300} y={0} width={600} height={30} fill="#6E3B1E" /><path d="M-260,30 L-200,140 M260,30 L200,140" stroke="#5A3010" strokeWidth={16} /></g>
  </g>
);

// Orhun bozkırı (730'lar): uçsuz bucaksız ova, gri gök, rüzgâr çizgileri, uzakta otağlar
export const Steppe: React.FC<{ t: number; wind?: number }> = ({ t, wind = 1 }) => (
  <g>
    <defs><linearGradient id="eSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5E7484" /><stop offset="0.75" stopColor="#B9C4BE" /><stop offset="1" stopColor="#D8D6C0" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#eSt)" />
    {[0, 1, 2, 3].map((k) => <ellipse key={k} cx={((k * 600 + t * 40 * wind) % 2500) - 300} cy={120 + k * 55} rx={260} ry={46} fill="#E2E6E2" opacity={0.5} />)}
    <path d="M0,600 Q300,560 700,590 Q1100,550 1500,585 Q1750,560 1920,580 L1920,1080 L0,1080Z" fill="#8E9A6E" />
    {[[380, 600, 0.35], [1640, 595, 0.3]].map(([x, y, s], i) => <g key={i} transform={`translate(${x},${y}) scale(${s})`}><path d="M-120,0 L-120,-80 Q0,-170 120,-80 L120,0Z" fill="#E8E0CC" /><rect x={-20} y={-60} width={40} height={60} fill="#B5432F" /></g>)}
    <path d="M0,700 Q960,650 1920,710 L1920,1080 L0,1080Z" fill="#A4AE7C" />
    {Array.from({ length: 70 }, (_, i) => { const x = (i * 131) % 1960, y = 720 + ((i * 47) % 340); return <path key={i} d={`M${x},${y} q${6 + Math.sin(t * 3 + i) * 8 * wind},-26 ${14 + Math.sin(t * 3 + i) * 12 * wind},-44`} stroke="#7E8A5A" strokeWidth={4} fill="none" />; })}
    {Array.from({ length: 10 }, (_, i) => <rect key={`w${i}`} x={((i * 311 + t * 900 * wind) % 2400) - 240} y={180 + ((i * 97) % 600)} width={160 + (i % 3) * 60} height={4} rx={2} fill="#FFFFFF" opacity={0.35} />)}
  </g>
);

// Yolun sonu: boş bozkır + sis
export const Mist: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g opacity={k}>{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={((i * 400 + t * 30) % 2400) - 240} cy={600 + i * 60} rx={500} ry={90} fill="#F3EEE2" opacity={0.35} />)}</g>
);

// Eski harf kursu sınıfı
export const Kurs: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9E1CF" />
    <rect x={460} y={110} width={1000} height={460} rx={10} fill="#2E4A3A" stroke="#8A5A32" strokeWidth={22} />
    {["ا ب ت ث ج", "elif · be · te · se · cim"].map((l, i) => <text key={i} x={960} y={300 + i * 150} textAnchor="middle" fontFamily={i ? "Patrick Hand" : "serif"} fontSize={i ? 64 : 110} fill="#F4F4F0" opacity={0.92}>{l}</text>)}
    <rect y={860} width={1920} height={220} fill="#A8865A" />
    <ellipse cx={1700} cy={300} rx={260} ry={260} fill="url(#tGlow)" opacity={0.3 + 0.05 * Math.sin(t * 2)} />
  </g>
);
