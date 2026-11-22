import React from "react";
import { H } from "./Harem";
import { Kandil2, P } from "./HaremPro";

// Kanal 1 · k3r-21 "Regl" kiti (2026-11-22): Lale Devri haremi (~1720).
// Yatakhane (yan yana döşekler, kandil, kafesli ay ışığı), döşek yakın planı (yorgan kalkar), sandık + beyaz bohça,
// düğümlü ip (gün sayma), rütbe merdiveni (acemi → usta), korse, yazma (Sabuncuoğlu), rahle + kılıflı mushaf,
// seki + minder (Sofya hamamı), bugünün Anadolu evi, ayrı oda (eski inançlar), su bardağı, fısıltı halkaları.
// Kimlik aynı: krem/sıcak renkler, İznik mavisi, kalın kahve kontur, beyaz oval yüz + nokta gözler.
// Not: kan/çıplaklık YOK. Leke sadece soluk gül rengi küçük bir gölge.

const LN = "#4A3524";
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const QUILT = ["#8E1F2A", "#2B5DA8", "#C9873B", "#2E6A5A", "#6E1F3A", "#5A6A7A", "#B8892E"];

// ───────── uyuyan / uyanık baş (yorgan altından) ─────────
export const YatanBas: React.FC<{ x: number; y: number; s?: number; t?: number; eyes?: "closed" | "open" | "shock" | "worried"; scarf?: string; seed?: number; rot?: number }> = ({ x, y, s = 1, t = 0, eyes = "closed", scarf = "#F1E3C6", seed = 0, rot = -12 }) => {
  const br = Math.sin(t * 1.4 + seed) * 1.2;
  const blink = eyes !== "closed" && Math.sin(t * 0.9 + seed * 3) > 0.985;
  const ey = eyes === "shock" ? 9 : 7;
  return (
    <g transform={`translate(${x},${y + br}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={66} ry={58} fill={scarf} stroke={LN} strokeWidth={3} />
      <path d="M-60,10 Q-70,-50 0,-56 Q70,-50 60,10" fill={scarf} stroke={LN} strokeWidth={3} />
      <ellipse cx={2} cy={10} rx={44} ry={40} fill={P.skin} stroke={LN} strokeWidth={2.6} />
      <ellipse cx={2} cy={10} rx={44} ry={40} fill="url(#pShadeL)" opacity={0.5} />
      {eyes === "closed" || blink ? (
        <path d="M-22,8 q7,6 14,0 M10,8 q7,6 14,0" stroke={LN} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx={-15} cy={6} rx={5} ry={ey} fill="#2A1E16" /><ellipse cx={17} cy={6} rx={5} ry={ey} fill="#2A1E16" />
          <circle cx={-13} cy={3} r={1.8} fill="#fff" /><circle cx={19} cy={3} r={1.8} fill="#fff" />
          {(eyes === "worried" || eyes === "shock") && <path d={`M-26,${eyes === "shock" ? -14 : -8} q10,-6 20,2 M8,${eyes === "shock" ? -12 : -6} q10,-8 20,-2`} stroke={LN} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.75} />}
        </g>
      )}
      <ellipse cx={-26} cy={24} rx={7} ry={4} fill={P.blush} opacity={0.55} /><ellipse cx={30} cy={24} rx={7} ry={4} fill={P.blush} opacity={0.55} />
      {eyes === "shock" ? <ellipse cx={2} cy={34} rx={5} ry={6} fill="#8E3A40" /> : eyes === "worried" ? <path d="M-6,36 q8,-4 16,0" stroke={P.lip} strokeWidth={2.4} fill="none" /> : <path d="M-4,34 q6,3 12,0" stroke={P.lip} strokeWidth={2.2} fill="none" />}
    </g>
  );
};

// ───────── tek döşek (yan profil, perspektifte) ─────────
const Dosek: React.FC<{ x: number; y: number; s: number; t: number; i: number; lift?: number; eyes?: "closed" | "open" | "shock" | "worried"; empty?: boolean }> = ({ x, y, s, t, i, lift = 0, eyes = "closed", empty = false }) => {
  const q = QUILT[i % QUILT.length];
  const rise = Math.sin(t * 1.4 + i) * 2;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={18} rx={300} ry={26} fill="#2A1408" opacity={0.22} />
      <rect x={-290} y={-40} width={580} height={56} rx={14} fill="#F4ECDA" stroke={LN} strokeWidth={3} />
      <path d="M-290,-12 H290" stroke="#D9C9A8" strokeWidth={3} />
      <rect x={-284} y={-96} width={130} height={60} rx={22} fill="#FBF6EA" stroke={LN} strokeWidth={3} />
      {!empty && <YatanBas x={-206} y={-96} s={0.82} t={t} eyes={eyes} seed={i} scarf={["#F1E3C6", "#E9DCC2", "#F7EFE0"][i % 3]} />}
      <g transform={`rotate(${-lift * 14} -150 -40)`}>
        <path d={`M-160,-40 C-150,${-110 + rise} 240,${-104 + rise} 292,-40 L292,10 L-160,10Z`} fill={q} stroke={LN} strokeWidth={3} />
        <path d={`M-160,-40 C-150,${-110 + rise} 240,${-104 + rise} 292,-40 L292,10 L-160,10Z`} fill="url(#pBrocade)" opacity={0.45} />
        <path d={`M-160,-40 C-150,${-110 + rise} 240,${-104 + rise} 292,-40 L292,10 L-160,10Z`} fill="url(#pShadeL)" />
        <path d={`M-140,-46 C-120,${-98 + rise} 220,${-92 + rise} 270,-40`} stroke={P.gold} strokeWidth={4} fill="none" opacity={0.7} />
      </g>
    </g>
  );
};

// ───────── yatakhane: uzun oda, iki kafesli pencere, döşek sırası ─────────
export const Yatakhane: React.FC<{ t: number; n?: number; hero?: number; heroEyes?: "closed" | "open" | "shock" | "worried"; lift?: number; moon?: number; empty?: number[] }> = ({ t, n = 7, hero = 0, heroEyes = "closed", lift = 0, moon = 1, empty = [] }) => {
  const FL = 640;
  return (
    <g>
      <rect width={1920} height={FL} fill={H.plaster} />
      <rect width={1920} height={90} fill={H.wood2} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 124 + 8} y={12} width={108} height={66} rx={6} fill={H.wood} stroke={P.gold} strokeWidth={2.4} />)}
      <rect y={90} width={1920} height={36} fill="url(#hTileS)" />
      {/* kafesli pencereler + ay */}
      {[420, 1500].map((wx, k) => (
        <g key={wx} transform={`translate(${wx},430)`}>
          <path d="M-130,0 L-130,-220 A130,130 0 0 1 130,-220 L130,0Z" fill="url(#pNightSky)" />
          {k === 1 && <><circle cx={40} cy={-250} r={34} fill="#F4F1E4" opacity={moon} /><circle cx={40} cy={-250} r={90} fill="url(#pBloom)" opacity={0.35 * moon} /></>}
          <path d="M-130,0 L-130,-220 A130,130 0 0 1 130,-220 L130,0Z" fill="url(#hHoney)" opacity={0.9} />
          <path d="M-130,0 L-130,-220 A130,130 0 0 1 130,-220 L130,0Z" fill="none" stroke={H.wood2} strokeWidth={14} />
          <rect x={-150} y={0} width={300} height={20} fill={H.plaster2} stroke={LN} strokeWidth={3} />
          <path d={`M-40,20 L${-160 + k * 80},${FL - 430} L${200 + k * 80},${FL - 430} L60,20Z`} fill="#CFE0FF" opacity={0.07 * moon} />
        </g>
      ))}
      {/* dolap nişleri */}
      {[860, 1060].map((nx) => (
        <g key={nx} transform={`translate(${nx},${FL - 70})`}>
          <rect x={-80} y={-330} width={160} height={330} fill={H.wood} stroke={LN} strokeWidth={4} />
          <path d="M0,-330 V0" stroke={H.wood2} strokeWidth={4} />
          <path d="M-70,-300 H70 M-70,-160 H70" stroke={P.gold} strokeWidth={3} />
          <circle cx={-12} cy={-170} r={5} fill={P.gold} /><circle cx={12} cy={-170} r={5} fill={P.gold} />
        </g>
      ))}
      <rect y={FL - 150} width={1920} height={150} fill="url(#hTile)" opacity={0.85} />
      <rect y={FL - 160} width={1920} height={10} fill={H.cobalt} />
      <rect y={FL} width={1920} height={1080 - FL} fill="url(#hMarble)" />
      <rect y={FL} width={1920} height={24} fill="#2A1408" opacity={0.18} />
      {/* kandiller */}
      <Kandil2 x={660} y={300} s={0.9} t={t} chain={220} />
      <Kandil2 x={1280} y={300} s={0.9} t={t + 2} chain={220} />
      {/* döşekler: arkadan öne iki sıra */}
      {Array.from({ length: n }, (_, j) => n - 1 - j).map((i) => {
        const row = i % 2, col = Math.floor(i / 2);
        const yy = row === 0 ? 1000 : 780;
        const s = row === 0 ? 0.95 : 0.66;
        const xx = (row === 0 ? 360 : 300) + col * (row === 0 ? 640 : 470);
        return <Dosek key={i} x={xx} y={yy} s={s} t={t} i={i} lift={i === hero ? lift : 0} eyes={i === hero ? heroEyes : "closed"} empty={empty.includes(i)} />;
      }).sort((a, b) => (a.props.y as number) - (b.props.y as number))}
    </g>
  );
};

// ───────── döşek yakın planı: yorgan kalkar, soluk leke ─────────
export const DosekYakin: React.FC<{ t: number; lift?: number; eyes?: "closed" | "open" | "shock" | "worried"; stain?: number; hand?: number; night?: number }> = ({ t, lift = 0, eyes = "closed", stain = 0, hand = 0, night = 1 }) => {
  const rise = Math.sin(t * 1.4) * 4;
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DFCB" />
      <rect width={1920} height={1080} fill="url(#hMarble)" opacity={0.6} />
      <rect x={-40} y={420} width={2000} height={520} rx={40} fill="#F7F0E2" stroke={LN} strokeWidth={5} />
      <path d="M-40,520 H1960" stroke="#E2D4B6" strokeWidth={5} />
      {/* soluk leke (sadece gölge) */}
      {stain > 0 && <ellipse cx={1020} cy={700} rx={70 * stain} ry={34 * stain} fill="#B86A6E" opacity={0.28 * stain} filter="url(#pBlur8)" />}
      <rect x={200} y={330} width={440} height={200} rx={70} fill="#FBF6EA" stroke={LN} strokeWidth={5} />
      <YatanBas x={440} y={420} s={2.1} t={t} eyes={eyes} rot={-6} />
      {/* yorgan: köşesi kalkar */}
      <g transform={`rotate(${-lift * 7} 1980 980) translate(${lift * 90},${-lift * 10})`}>
        <path d={`M600,500 C760,${390 + rise} 1500,${380 + rise} 2000,470 L2000,1000 L600,1000Z`} fill="#8E1F2A" stroke={LN} strokeWidth={5} />
        <path d={`M600,500 C760,${390 + rise} 1500,${380 + rise} 2000,470 L2000,1000 L600,1000Z`} fill="url(#pBrocade)" opacity={0.5} />
        <path d={`M600,500 C760,${390 + rise} 1500,${380 + rise} 2000,470 L2000,1000 L600,1000Z`} fill="url(#pShadeL)" />
        <path d={`M640,530 C800,${430 + rise} 1480,${420 + rise} 1980,510`} stroke={P.gold} strokeWidth={8} fill="none" />
        {hand > 0 && <g transform="translate(650,590)"><ellipse rx={46} ry={34} fill={P.skin} stroke={LN} strokeWidth={3} /><path d="M-30,-14 q10,-20 20,-2 M-6,-22 q12,-18 20,0" stroke={LN} strokeWidth={2.4} fill="none" /></g>}
      </g>
      {night > 0 && <rect width={1920} height={1080} fill={P.night} opacity={0.38 * night} />}
      {night > 0 && <ellipse cx={520} cy={380} rx={700} ry={460} fill="url(#pPool)" opacity={0.35 * night} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

// ───────── beyaz bohça ─────────
export const BeyazBohca: React.FC<{ s?: number; glow?: number; t?: number }> = ({ s = 1, glow = 0, t = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0 && <circle r={190} fill="url(#pBloom)" opacity={0.5 * glow * (0.9 + 0.1 * Math.sin(t * 3))} />}
    <ellipse cy={70} rx={130} ry={18} fill="#2A1408" opacity={0.2} />
    <path d="M-120,60 C-140,0 -110,-60 -40,-70 L40,-70 C110,-60 140,0 120,60 Q0,90 -120,60Z" fill="#FBF8F0" stroke={LN} strokeWidth={4} />
    <path d="M-120,60 C-140,0 -110,-60 -40,-70 L40,-70 C110,-60 140,0 120,60 Q0,90 -120,60Z" fill="url(#pShadeL)" />
    <path d="M-90,30 Q0,50 90,30 M-70,-20 Q0,0 70,-20" stroke="#E2D9C6" strokeWidth={4} fill="none" />
    <path d="M-30,-70 C-60,-120 -20,-130 0,-96 C20,-130 60,-120 30,-70Z" fill="#FBF8F0" stroke={LN} strokeWidth={4} />
    <circle cy={-74} r={16} fill="#F2EBDC" stroke={LN} strokeWidth={3} />
    <path d="M-110,40 l10,-6 M100,40 l-10,-6" stroke={P.gold} strokeWidth={3} />
  </g>
);

// ───────── sedef kakmalı sandık ─────────
export const Sandik: React.FC<{ t: number; open?: number; bohca?: number; x?: number; y?: number; s?: number }> = ({ t, open = 0, bohca = 0, x = 960, y = 760, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={20} rx={420} ry={40} fill="#2A1408" opacity={0.3} />
    {/* iç (açılınca) */}
    <rect x={-360} y={-300} width={720} height={40} fill="#3A2214" />
    {bohca > 0 && <g transform={`translate(0,${lerp(-200, -420, ease(bohca))})`}><BeyazBohca s={1.2} glow={bohca} t={t} /></g>}
    {/* gövde */}
    <rect x={-380} y={-300} width={760} height={320} rx={12} fill={H.wood} stroke={LN} strokeWidth={5} />
    <rect x={-380} y={-300} width={760} height={320} rx={12} fill="url(#pShadeL)" />
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i} transform={`translate(${-300 + i * 120},-150)`}>
        <path d="M0,-50 L36,0 L0,50 L-36,0Z" fill="#F4F0E6" stroke={LN} strokeWidth={2} opacity={0.9} />
        <circle r={10} fill={H.cobalt} />
      </g>
    ))}
    <path d="M-380,-230 H380 M-380,-70 H380" stroke={P.gold} strokeWidth={6} />
    <rect x={-40} y={-260} width={80} height={70} rx={10} fill={P.gold} stroke={LN} strokeWidth={3} />
    <circle cy={-226} r={10} fill="#2A1408" />
    {/* kapak */}
    <g transform={`translate(0,-300) scale(1,${lerp(1, -0.25, ease(open))})`}>
      <path d="M-390,0 L-390,-90 Q0,-170 390,-90 L390,0Z" fill={H.wood2} stroke={LN} strokeWidth={5} />
      <path d="M-390,-40 Q0,-120 390,-40" stroke={P.gold} strokeWidth={5} fill="none" />
    </g>
  </g>
);

// ───────── düğümlü ip: gün sayma ─────────
export const DugumIp: React.FC<{ t: number; k: number; n?: number; y?: number; nums?: boolean; hl?: number }> = ({ t, k, n = 28, y = 540, nums = true, hl = -1 }) => {
  const x0 = 140, x1 = 1780;
  const sway = (x: number) => Math.sin(t * 1.2 + x * 0.004) * 10;
  const pts = Array.from({ length: 41 }, (_, i) => { const x = lerp(x0, x1, i / 40); return `${x},${y + sway(x) + Math.sin(i * 0.7) * 3}`; }).join(" ");
  const shown = Math.floor(k);
  return (
    <g>
      <polyline points={pts} fill="none" stroke="#8E1F2A" strokeWidth={7} strokeLinecap="round" />
      <polyline points={pts} fill="none" stroke="#C9636A" strokeWidth={2} strokeDasharray="6 8" />
      {Array.from({ length: n }, (_, i) => {
        const x = lerp(x0 + 30, x1 - 30, i / (n - 1));
        const on = i < shown ? 1 : i === shown ? k - shown : 0;
        if (on <= 0) return null;
        const big = i === hl;
        return (
          <g key={i} transform={`translate(${x},${y + sway(x)}) scale(${ease(on) * (big ? 1.5 : 1)})`}>
            <circle r={15} fill="#A8323A" stroke={LN} strokeWidth={2.6} />
            <path d="M-8,-4 q8,8 16,0" stroke="#5E1219" strokeWidth={2.4} fill="none" />
            {nums && <text y={62} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={28} fill={big ? "#8E1F2A" : "#5A4630"}>{i + 1}</text>}
          </g>
        );
      })}
    </g>
  );
};

// ───────── rütbe merdiveni (TDV "Harem") ─────────
export const RUTBE = ["ACEMİ", "KÜÇÜK KALFA", "ORTA KALFA", "BÜYÜK KALFA", "USTA"];
export const RutbeMerdiven: React.FC<{ t: number; k: number; hi?: number; key2?: number; marker?: React.ReactNode }> = ({ t, k, hi = -1, key2 = 0, marker }) => (
  <g>
    {RUTBE.map((lb, i) => {
      const kk = ease((k * RUTBE.length - i) / 1.1);
      const x = 140 + i * 330, y = 900 - i * 140;
      const on = i === hi;
      return (
        <g key={lb} opacity={kk} transform={`translate(0,${(1 - kk) * 60})`}>
          <rect x={x} y={y} width={330} height={1080 - y} fill={on ? H.cobalt : "#F4ECDA"} stroke={LN} strokeWidth={4} />
          <rect x={x} y={y} width={330} height={22} fill={P.gold} />
          <rect x={x} y={y + 22} width={330} height={60} fill="url(#hTileS)" opacity={on ? 0.25 : 0.5} />
          <text x={x + 165} y={y + 140} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={lb.length > 8 ? 38 : 48} fill={on ? "#FFFFFF" : H.cobalt}>{lb}</text>
          {on && marker && <g transform={`translate(${x + 165},${y})`}>{marker}</g>}
        </g>
      );
    })}
    {key2 > 0 && (
      <g opacity={ease(key2)} transform={`translate(1620,${200 - (1 - ease(key2)) * 40})`}>
        <circle r={110} fill="url(#pBloom)" opacity={0.6} />
        <circle cx={-40} r={36} fill="none" stroke={P.gold} strokeWidth={14} />
        <path d="M-4,0 H90 M60,0 v26 M84,0 v20" stroke={P.gold} strokeWidth={14} strokeLinecap="round" />
        <text y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={P.gold2}>HAZİNEDAR USTA</text>
      </g>
    )}
  </g>
);

// ───────── korse (18. yy, balina çubuklu) ─────────
export const Korse: React.FC<{ t: number; k?: number; lace?: number }> = ({ t, k = 1, lace = 1 }) => (
  <g opacity={ease(k)} transform={`translate(960,560) scale(${lerp(0.9, 1, ease(k))}) rotate(${Math.sin(t * 0.7) * 1.5})`}>
    <ellipse cy={330} rx={300} ry={30} fill="#000" opacity={0.25} />
    <path d="M-230,-300 C-170,-330 170,-330 230,-300 L170,260 Q0,320 -170,260Z" fill="#E9D9C2" stroke={LN} strokeWidth={6} />
    <path d="M-230,-300 C-170,-330 170,-330 230,-300 L170,260 Q0,320 -170,260Z" fill="url(#pShadeL)" />
    {Array.from({ length: 9 }, (_, i) => { const x = lerp(-190, 190, i / 8); return <path key={i} d={`M${x},-300 Q${x * 0.82},0 ${x * 0.78},270`} stroke="#B8A486" strokeWidth={5} fill="none" />; })}
    <path d="M-230,-300 C-170,-330 170,-330 230,-300" stroke="#8E1F2A" strokeWidth={10} fill="none" />
    <path d="M-170,260 Q0,320 170,260" stroke="#8E1F2A" strokeWidth={10} fill="none" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-24,${-260 + i * 60} L24,${-230 + i * 60} M24,${-260 + i * 60} L-24,${-230 + i * 60}`} stroke="#5E1219" strokeWidth={4} opacity={lace} />)}
    <path d="M-24,-280 V270 M24,-280 V270" stroke="#4A3524" strokeWidth={3} strokeDasharray="4 26" />
  </g>
);

// ───────── yazma (Sabuncuoğlu, 15. yy) ─────────
export const Yazma: React.FC<{ t: number; k?: number; hl?: number; title?: string }> = ({ t, k = 1, hl = 0, title = "MÜCERREBNÂME" }) => (
  <g>
    <rect width={1920} height={1080} fill="#2E2018" />
    <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.15} />
    <g transform={`translate(960,${lerp(620, 540, ease(k))}) rotate(${-2 + Math.sin(t * 0.5) * 0.4})`}>
      <ellipse cy={430} rx={720} ry={50} fill="#000" opacity={0.35} />
      <path d="M-680,-400 L0,-380 L680,-400 L680,400 L0,420 L-680,400Z" fill="#5A2A1A" stroke={LN} strokeWidth={6} />
      <path d="M-650,-380 L0,-360 L0,400 L-650,380Z" fill="#EFE2BE" stroke={LN} strokeWidth={3} />
      <path d="M650,-380 L0,-360 L0,400 L650,380Z" fill="#EADBB2" stroke={LN} strokeWidth={3} />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 325},0)`}>
          <rect x={-250} y={-320} width={500} height={70} rx={8} fill={H.cobalt} stroke={P.gold} strokeWidth={5} />
          <path d="M-220,-285 h440" stroke={P.gold} strokeWidth={3} strokeDasharray="10 8" />
          {Array.from({ length: 13 }, (_, i) => {
            const w = 380 + ((i * 53) % 90);
            const shown = ease((k - 0.15 - i * 0.03) * 3);
            const red = i % 5 === 2;
            return <path key={i} d={`M${w / 2},${-200 + i * 44} q${-w * 0.25},${-8 + (i % 3) * 4} ${-w * 0.5},0 t${-w * 0.5},0`} stroke={red ? "#A8323A" : "#2A1E16"} strokeWidth={red ? 6 : 4.5} fill="none" strokeDasharray={`${w * 1.1}`} strokeDashoffset={w * 1.1 * (1 - shown)} opacity={0.8} />;
          })}
        </g>
      ))}
      {/* kenar: çiçek (bitki) çizimi */}
      <g transform="translate(470,250)" opacity={k}>
        <path d="M0,90 C-10,30 10,-10 0,-80" stroke="#2E6A5A" strokeWidth={5} fill="none" />
        {[-50, -10, 30].map((yy, i) => <ellipse key={i} cx={i % 2 ? 26 : -26} cy={yy} rx={26} ry={11} fill="#4E8A6A" stroke={LN} strokeWidth={2} transform={`rotate(${i % 2 ? -30 : 30} ${i % 2 ? 26 : -26} ${yy})`} />)}
        <circle cy={-86} r={14} fill="#C9636A" stroke={LN} strokeWidth={2} />
      </g>
      {hl > 0 && <rect x={-620} y={-46} width={560} height={52} fill="#FFE49A" opacity={0.45 * ease(hl)} />}
      <text x={-325} y={-273} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F7E2B0">{title}</text>
    </g>
  </g>
);

// ───────── rahle + kılıfına sarılı, kapalı mushaf (dokunulmaz) ─────────
export const Rahle: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 960, y = 820, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={10} rx={260} ry={26} fill="#2A1408" opacity={0.25} />
    <path d="M-200,0 L0,-260 L200,0 M-200,0 L0,-120 L200,0" stroke={H.wood2} strokeWidth={22} fill="none" strokeLinejoin="round" />
    <path d="M-200,0 L0,-260 L200,0" stroke={P.gold} strokeWidth={4} fill="none" />
    <g transform="translate(0,-250)">
      <path d="M-190,0 L0,-60 L190,0 L190,40 L0,-20 L-190,40Z" fill="#1F5A3A" stroke={LN} strokeWidth={4} />
      <path d="M-170,12 L0,-42 L170,12" stroke={P.gold} strokeWidth={4} fill="none" />
      <circle cy={-14} r={14} fill={P.gold} stroke={LN} strokeWidth={2} />
    </g>
  </g>
);

// ───────── seki + minder (Sofya hamamı; kadınlar giyimli, oturur) ─────────
export const Seki: React.FC<{ x: number; y: number; w?: number; t?: number }> = ({ x, y, w = 1700, t = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-80} width={w} height={80} fill="#EFE7D6" stroke="#A89C86" strokeWidth={5} />
    <rect x={-w / 2} y={-96} width={w} height={22} fill="url(#hCarpet)" stroke={P.gold} strokeWidth={3} />
    {Array.from({ length: Math.floor(w / 210) }, (_, i) => (
      <rect key={i} x={-w / 2 + 30 + i * 210} y={-150} width={160} height={60} rx={22} fill={["#8E1F2A", "#2B5DA8", "#C9873B"][i % 3]} stroke={LN} strokeWidth={3} />
    ))}
    {Array.from({ length: 3 }, (_, i) => <ellipse key={i} cx={-w / 2 + 300 + i * 560} cy={-170 - ((t * 20 + i * 40) % 80)} rx={30} ry={14} fill="#fff" opacity={0.12} />)}
  </g>
);

// ───────── kahve + şerbet tepsisi (yakın) ─────────
export const KahveSerbet: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cy={30} rx={260} ry={40} fill="#2A1408" opacity={0.25} />
    <ellipse rx={250} ry={60} fill={P.gold} stroke={LN} strokeWidth={4} />
    <ellipse rx={226} ry={50} fill="#E4C373" />
    {[-120, 0].map((cx, i) => (
      <g key={i} transform={`translate(${cx},-20)`}>
        <path d="M-30,0 L-24,-46 L24,-46 L30,0Z" fill="#FBF6EA" stroke={LN} strokeWidth={3} />
        <path d="M-24,-40 L24,-40" stroke={H.cobalt} strokeWidth={4} />
        <ellipse cy={-46} rx={24} ry={6} fill="#4A2A1A" />
        {[0, 1].map((j) => <path key={j} d={`M${-6 + j * 12},-54 q${8 * Math.sin(t * 2 + j)},-20 0,-40`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.35} />)}
      </g>
    ))}
    <g transform="translate(130,-20)">
      <path d="M-26,0 L-34,-90 L34,-90 L26,0Z" fill="#F2A6A0" opacity={0.75} stroke={LN} strokeWidth={3} />
      <path d="M-30,-60 L30,-60" stroke="#fff" strokeWidth={3} opacity={0.6} />
    </g>
  </g>
);

// ───────── bugünün Anadolu evi (sade salon) ─────────
export const BugunEv: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#EFE6D6" />
    <rect y={0} width={1920} height={760} fill="#F3EBDD" />
    <g transform="translate(1380,140)">
      <rect width={380} height={420} fill={night ? "#26315A" : "#BFE1F2"} stroke="#9A8A72" strokeWidth={10} />
      {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 120} y={180 - i * 30} width={90} height={240 + i * 30} fill={night ? "#3A4470" : "#D9D2C4"} />)}
      {[0, 1, 2].map((i) => Array.from({ length: 4 }, (_, j) => <rect key={`${i}${j}`} x={48 + i * 120} y={210 - i * 30 + j * 52} width={20} height={26} fill={night ? "#FFD27A" : "#A9C6DA"} opacity={0.8} />))}
      <path d="M190,0 V420 M0,210 H380" stroke="#9A8A72" strokeWidth={6} />
      <path d={`M-40,-20 C-20,140 ${-50 + Math.sin(t) * 5},300 -30,460 L20,460 C10,300 20,140 10,-20Z`} fill="#C9A35A" opacity={0.8} />
    </g>
    <rect y={760} width={1920} height={320} fill="#C9B898" />
    <path d="M200,800 L1700,800 L1840,1080 L60,1080Z" fill="url(#hCarpet)" opacity={0.85} />
    <g transform="translate(560,760)">
      <rect x={-380} y={-210} width={760} height={120} rx={30} fill="#7A5A6A" stroke={LN} strokeWidth={4} />
      <rect x={-400} y={-110} width={800} height={110} rx={24} fill="#8A6A7A" stroke={LN} strokeWidth={4} />
      {[-240, 0, 240].map((cx) => <rect key={cx} x={cx - 90} y={-200} width={180} height={90} rx={26} fill="#E9DCC2" stroke={LN} strokeWidth={3} />)}
    </g>
    <g transform="translate(1100,520)">
      <circle r={70} fill="#FBF6EA" stroke={LN} strokeWidth={5} />
      <path d="M0,0 V-46 M0,0 L32,18" stroke={LN} strokeWidth={6} strokeLinecap="round" />
    </g>
    {night > 0 && <rect width={1920} height={1080} fill={P.night} opacity={0.3 * night} />}
  </g>
);

// ───────── ayrı oda (eski inançlar: kapı kapalı, yemek kabı kapıda) ─────────
export const AyriOda: React.FC<{ t: number; bowl?: number; water?: number }> = ({ t, bowl = 0, water = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2C22" />
    <rect y={760} width={1920} height={320} fill="#5A4636" />
    <g transform="translate(760,760)">
      <path d="M-300,0 V-420 L0,-560 L300,-420 V0Z" fill="#8A6E52" stroke={LN} strokeWidth={6} />
      <rect x={-90} y={-300} width={180} height={300} fill="#3A2416" stroke={LN} strokeWidth={5} />
      <path d="M-90,-300 L90,0 M90,-300 L-90,0" stroke="#2A1408" strokeWidth={3} opacity={0.4} />
      <rect x={-20} y={-300} width={40} height={300} fill="#FFD27A" opacity={0.12 + 0.05 * Math.sin(t * 6)} />
      <rect x={180} y={-340} width={70} height={60} fill="#FFD27A" opacity={0.35 + 0.08 * Math.sin(t * 7)} stroke={LN} strokeWidth={4} />
      {bowl > 0 && <g transform={`translate(${lerp(420, 140, ease(bowl))},-10)`} opacity={ease(bowl * 2)}>
        <path d="M-50,0 Q0,40 50,0Z" fill="#B8892E" stroke={LN} strokeWidth={3} />
        <path d={`M50,-6 L${330 - 280 * ease(bowl)},-60`} stroke="#6E4A22" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      </g>}
    </g>
    {water > 0 && <g transform="translate(1500,820)" opacity={ease(water)}>
      <ellipse rx={260} ry={60} fill="#5A8AA8" stroke={LN} strokeWidth={5} />
      <ellipse rx={220} ry={44} fill="#9CC3D6" />
      {[0, 1, 2].map((i) => <ellipse key={i} rx={60 + ((t * 40 + i * 50) % 160)} ry={14 + ((t * 10 + i * 12) % 36)} fill="none" stroke="#fff" strokeWidth={2} opacity={0.5 * (1 - ((t * 40 + i * 50) % 160) / 160)} />)}
    </g>}
    <rect width={1920} height={1080} fill="#000" opacity={0.15} />
  </g>
);

// ───────── su bardağı (gizlice içilir, yıkanır) ─────────
export const SuBardak: React.FC<{ t: number; level?: number; wash?: number; s?: number }> = ({ t, level = 1, wash = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse cy={10} rx={110} ry={18} fill="#2A1408" opacity={0.25} />
    <path d="M-70,0 L-90,-260 L90,-260 L70,0Z" fill="#DDEFF6" opacity={0.5} stroke={LN} strokeWidth={4} />
    <path d={`M-70,0 L${-70 - 20 * level * 0.85},${-220 * level} L${70 + 20 * level * 0.85},${-220 * level} L70,0Z`} fill="#9CC3D6" opacity={0.75} />
    <path d="M-60,-240 L-46,-20" stroke="#fff" strokeWidth={8} opacity={0.5} />
    {wash > 0 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-60 + ((i * 37) % 120)} cy={-40 - ((t * 120 + i * 40) % 220)} r={6 + (i % 3) * 3} fill="#fff" opacity={0.6 * wash} />)}
  </g>
);

// ───────── fısıltı halkaları (kulaktan kulağa) ─────────
export const Fisilti: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; k?: number }> = ({ x, y, t, dir = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1)`} opacity={k}>
    {[0, 1, 2].map((i) => {
      const p = (t * 0.9 + i / 3) % 1;
      return <path key={i} d={`M${20 + p * 120},${-30 - p * 20} q${20 + p * 20},${30 + p * 20} 0,${60 + p * 40}`} stroke="#FFF2C8" strokeWidth={5} fill="none" opacity={0.8 * (1 - p)} strokeLinecap="round" />;
    })}
  </g>
);

// ───────── 28 günlük ay halkası ─────────
export const AyHalka: React.FC<{ t: number; k: number; x?: number; y?: number; r?: number }> = ({ t, k, x = 960, y = 540, r = 300 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r + 40} fill="#1A2238" opacity={0.6} />
    {Array.from({ length: 28 }, (_, i) => {
      const a = -Math.PI / 2 + (i / 28) * Math.PI * 2;
      const on = ease(k * 28 - i);
      return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={10 + 8 * on} fill={i < 5 ? "#A8323A" : "#F4F1E4"} opacity={0.25 + 0.75 * on} />;
    })}
    <clipPath id="rgAyClip"><circle r={110} /></clipPath>
    <circle r={110} fill="#F4F1E4" />
    <g clipPath="url(#rgAyClip)"><circle cx={lerp(-230, 230, Math.min(1, k))} r={112} fill="#1A2238" opacity={0.85} /></g>
    <circle r={180} fill="url(#pBloom)" opacity={0.25 + 0.05 * Math.sin(t * 2)} />
  </g>
);

export const _reglUnused = { lerp };
