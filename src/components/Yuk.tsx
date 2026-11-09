import React from "react";
import { T, TMini } from "./Toon";

// Kanal 2 · k2r-10 Yerçekimi: yük, enkaz, nakliye sahneleri. Çizgi: kalın siyah kontur, düz renk.
const LN = "#1A1A22";
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const md = (v: number, m: number) => ((v % m) + m) % m;

// Tüy efekti: hafifleyen nesnenin etrafında süzülen tüyler
export const Tuy: React.FC<{ x: number; y: number; t: number; k?: number; n?: number }> = ({ x, y, t, k = 1, n = 6 }) => (
  <g opacity={k}>{Array.from({ length: n }, (_, i) => { const p = md(t * 0.25 + i / n, 1); return <g key={i} transform={`translate(${x + Math.sin(t * 1.3 + i * 2) * 120 + (rnd(i) - 0.5) * 200},${y - p * 260}) rotate(${Math.sin(t * 2 + i) * 40})`} opacity={Math.sin(p * Math.PI)}><path d="M0,-26 Q12,-6 0,26 Q-12,-6 0,-26Z" fill="#FFFFFF" stroke="#9FE8F0" strokeWidth={2} /><line x1={0} y1={-26} x2={0} y2={30} stroke="#9FE8F0" strokeWidth={2} /></g>; })}</g>
);

// Hafiflik halesi: turkuaz parıltı (güç aktif)
export const Hale: React.FC<{ x: number; y: number; r?: number; t: number; k?: number }> = ({ x, y, r = 160, t, k = 1 }) => (
  <g opacity={k}><circle cx={x} cy={y} r={r * (1 + Math.sin(t * 4) * 0.04)} fill="none" stroke="#2EE6D0" strokeWidth={8} opacity={0.6} /><circle cx={x} cy={y} r={r * 1.25} fill="#2EE6D0" opacity={0.08} /></g>
);

export const Kombi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-90} y={-130} width={180} height={260} rx={14} fill="#F4F4F2" stroke={LN} strokeWidth={6} /><rect x={-60} y={40} width={120} height={50} rx={8} fill="#2A3346" stroke={LN} strokeWidth={4} /><circle cx={-30} cy={65} r={10} fill="#2EE6D0" /><circle cx={10} cy={65} r={8} fill="#F05A4A" />{[-50, -10, 30].map((px) => <rect key={px} x={px} y={130} width={14} height={30} fill="#9A9A9A" stroke={LN} strokeWidth={3} />)}</g>
);
export const Buzdolabi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-110} y={-320} width={220} height={320} rx={16} fill="#E9EEF2" stroke={LN} strokeWidth={6} /><line x1={-110} y1={-200} x2={110} y2={-200} stroke={LN} strokeWidth={5} /><rect x={70} y={-180} width={12} height={90} rx={6} fill="#9AA3AD" /><rect x={70} y={-290} width={12} height={60} rx={6} fill="#9AA3AD" /></g>
);
export const Piyano: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-200} y={-300} width={400} height={300} rx={10} fill="#2A1A14" stroke={LN} strokeWidth={6} /><rect x={-200} y={-150} width={400} height={50} fill="#3A2A20" stroke={LN} strokeWidth={4} /><rect x={-185} y={-140} width={370} height={34} fill="#FFFFFF" />{Array.from({ length: 18 }, (_, i) => <line key={i} x1={-185 + i * 20.5} y1={-140} x2={-185 + i * 20.5} y2={-106} stroke={LN} strokeWidth={2} />)}{Array.from({ length: 12 }, (_, i) => i % 7 !== 2 && i % 7 !== 6 && <rect key={`b${i}`} x={-175 + i * 30} y={-140} width={14} height={20} fill={LN} />)}<rect x={-180} y={0} width={30} height={30} fill="#2A1A14" /><rect x={150} y={0} width={30} height={30} fill="#2A1A14" /></g>
);
export const BakirKazan: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-150,-160 Q-170,0 0,10 Q170,0 150,-160Z" fill="#C8743A" stroke={LN} strokeWidth={6} /><ellipse cy={-160} rx={160} ry={30} fill="#A85A28" stroke={LN} strokeWidth={6} /><path d="M-150,-130 q-40,10 -40,40 M150,-130 q40,10 40,40" stroke={LN} strokeWidth={8} fill="none" /><path d="M-100,-90 Q0,-60 100,-90" stroke="#F0A060" strokeWidth={6} fill="none" opacity={0.6} /></g>
);
export const Karpuz: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><ellipse rx={70} ry={58} fill="#2F8A3A" stroke={LN} strokeWidth={5} />{[-40, -14, 14, 40].map((d) => <path key={d} d={`M${d},-56 Q${d * 1.3},0 ${d},56`} stroke="#1E5A26" strokeWidth={6} fill="none" />)}</g>
);

// Tofaş Şahin benzeri eski sedan (marka yok)
export const EskiAraba: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = "#E8E2CF", rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <path d="M-330,-60 L-320,-140 L-180,-150 L-110,-240 L150,-240 L230,-150 L330,-140 L340,-60Z" fill={c} stroke={LN} strokeWidth={6} />
    <path d="M-160,-150 L-100,-225 L20,-225 L20,-150Z M40,-150 L40,-225 L140,-225 L200,-150Z" fill="#8FB4C8" stroke={LN} strokeWidth={4} />
    <rect x={-340} y={-80} width={60} height={22} fill="#C9C9C9" stroke={LN} strokeWidth={4} />
    <rect x={290} y={-130} width={40} height={24} fill="#F6D08A" stroke={LN} strokeWidth={3} />
    {[-200, 200].map((wx) => <g key={wx}><circle cx={wx} cy={-50} r={58} fill="#2A2A30" stroke={LN} strokeWidth={5} /><circle cx={wx} cy={-50} r={24} fill="#9A9A9A" /></g>)}
    <path d="M-60,-120 L-60,-70" stroke={LN} strokeWidth={4} />
  </g>
);

export const Otopark: React.FC<{ t: number; dawn?: number }> = ({ t, dawn = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dawn ? "#5A6E9A" : "#141A2E"} />
    {dawn > 0 && <rect y={380} width={1920} height={240} fill="#F2B880" opacity={0.5 * dawn} />}
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 380} r={1.6} fill="#FFFFFF" opacity={0.6 * (1 - dawn)} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 330 - 40} y={260 - (i % 3) * 60} width={260} height={400 + (i % 3) * 60} fill="#1E2640" stroke={LN} strokeWidth={4} />)}
    {[0, 1, 2, 3, 4, 5].map((i) => Array.from({ length: 6 }, (_, k) => <rect key={`${i}-${k}`} x={i * 330 + (k % 3) * 70} y={300 - (i % 3) * 60 + Math.floor(k / 3) * 110} width={40} height={50} fill={rnd(i * 6 + k) > 0.7 ? "#F6D08A" : "#2A3456"} />))}
    <rect y={660} width={1920} height={420} fill="#2A2E38" />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={160 + i * 280} y1={700} x2={120 + i * 300} y2={1080} stroke="#E8E2CF" strokeWidth={6} opacity={0.5} />)}
    <g transform="translate(260,660)"><rect x={-8} y={-420} width={16} height={420} fill="#3A3E48" /><path d="M0,-420 h80" stroke="#3A3E48" strokeWidth={12} /><circle cx={80} cy={-405} r={20} fill="#FFE8A0" /><path d="M60,-400 L-60,0 L240,0 L100,-400Z" fill="#FFE8A0" opacity={0.08 + Math.sin(t * 9) * 0.01} /></g>
  </g>
);

// Deprem gecesi enkaz. lift: betonun kalkması (0..1). gap: altında dede+torun görünür.
export const Enkaz: React.FC<{ t: number; lift?: number; dust?: number; lights?: number; people?: number; gap?: number }> = ({ t, lift = 0, dust = 1, lights = 1, people = 0, gap = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1E2C" />
    <rect width={1920} height={600} fill="#2A2E40" opacity={0.6} />
    {[[80, 260, 300], [1500, 220, 380], [1180, 330, 240]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={700} fill="#252A3C" stroke={LN} strokeWidth={4} />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={x + 30 + (k % 3) * (w / 3.4)} y={y + 40 + Math.floor(k / 3) * 120} width={40} height={60} fill="#151A26" />)}</g>)}
    {/* moloz yığını */}
    <path d="M200,1080 L360,760 L520,820 L640,640 L860,700 L1040,600 L1220,720 L1380,660 L1560,820 L1760,1080Z" fill="#6A6458" stroke={LN} strokeWidth={6} />
    {Array.from({ length: 26 }, (_, i) => <polygon key={i} points={`${300 + rnd(i) * 1360},${760 + rnd(i + 1) * 260} ${340 + rnd(i) * 1360},${720 + rnd(i + 2) * 260} ${380 + rnd(i) * 1360},${780 + rnd(i + 3) * 240}`} fill={["#8A8274", "#7A7264", "#5A544A"][i % 3]} stroke={LN} strokeWidth={3} />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${520 + i * 160},${700 + (i % 2) * 40} l${30 - i * 8},-${90 + (i % 3) * 30}`} stroke="#9A6A4A" strokeWidth={6} />)}
    {/* boşluk ve içindekiler */}
    {gap > 0 && <g opacity={gap}><path d="M780,880 Q960,820 1140,880 L1120,940 L800,940Z" fill="#0A0C12" /><circle cx={920} cy={890} r={24} fill="#FBE7D2" stroke={LN} strokeWidth={3} /><circle cx={980} cy={898} r={18} fill="#FBE7D2" stroke={LN} strokeWidth={3} /><path d="M904,868 q16,-10 32,0" stroke="#E8E8E8" strokeWidth={8} fill="none" /></g>}
    {/* beton blok */}
    <g transform={`translate(960,${860 - lift * 180}) rotate(${-4 + lift * 3})`}><rect x={-260} y={-90} width={520} height={110} fill="#9A948A" stroke={LN} strokeWidth={6} />{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-220 + i * 110},-90 v110`} stroke="#6A6458" strokeWidth={4} opacity={0.6} />)}<path d="M-260,-20 l-40,-30 M260,-40 l50,-20" stroke="#5A3A2A" strokeWidth={8} /></g>
    {lights > 0 && Array.from({ length: 5 }, (_, i) => { const x = 280 + i * 340, y = 600 + (i % 2) * 80; return <g key={i} opacity={lights}><path d={`M${x},${y} L${x + 160 - i * 60},${y + 400} L${x + 260 - i * 60},${y + 400}Z`} fill="#FFFFFF" opacity={0.07 + Math.sin(t * 3 + i) * 0.02} /><circle cx={x} cy={y} r={7} fill="#FFFFFF" /></g>; })}
    {people > 0 && Array.from({ length: 8 }, (_, i) => <TMini key={i} x={160 + i * 220} y={1060} s={1.3} c={["#5A6A8A", "#8A5A4A", "#4A6A5A", "#7A6A9A"][i % 4]} t={t} seed={i} />)}
    {dust > 0 && Array.from({ length: 14 }, (_, i) => { const p = md(t * 0.05 + rnd(i), 1); return <circle key={`d${i}`} cx={rnd(i + 7) * 1920 + Math.sin(t * 0.3 + i) * 80} cy={900 - p * 700} r={140 + rnd(i) * 160} fill="#B8B0A0" opacity={0.12 * dust * Math.sin(p * Math.PI)} />; })}
  </g>
);

// Vücut yük haritası: kırmızı bölgeler (göğüs, sırt, diz) k ile artar.
export const VucutYuk: React.FC<{ t: number; k: number; x?: number; y?: number; s?: number; label?: string }> = ({ t, k, x = 960, y = 540, s = 1, label }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-300} y={-440} width={600} height={880} rx={30} fill="#0E1626" stroke="#2EE6D0" strokeWidth={4} opacity={0.92} />
    <circle cy={-300} r={70} fill="#1E2A40" stroke="#9FE8F0" strokeWidth={5} />
    <path d="M-110,-210 Q-130,-60 -100,120 L-90,360 M110,-210 Q130,-60 100,120 L90,360 M-110,-210 H110 M-110,-200 L-200,40 M110,-200 L200,40 M-100,120 H100" stroke="#9FE8F0" strokeWidth={6} fill="none" />
    {[[0, -130, 90], [0, 20, 70], [-80, 280, 40], [80, 280, 40]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r * (0.6 + 0.4 * k) * (1 + Math.sin(t * 6 + i) * 0.06 * k)} fill="#F05A4A" opacity={cl(k * 1.3 - i * 0.15) * 0.75} />)}
    <rect x={-240} y={380} width={480} height={26} rx={13} fill="#1E2A40" /><rect x={-240} y={380} width={480 * cl(k)} height={26} rx={13} fill="#F05A4A" />
    {label && <text y={-390} textAnchor="middle" fontFamily="Patrick Hand, sans-serif" fontSize={44} fill="#9FE8F0">{label}</text>}
  </g>
);

export const Kamyon: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string }> = ({ x, y, s = 1, t = 0, c = T.blue }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-420} y={-330} width={560} height={270} rx={10} fill="#F4F4F2" stroke={LN} strokeWidth={6} /><rect x={-400} y={-260} width={520} height={60} fill={c} /><path d="M140,-260 H280 L340,-170 V-60 H140Z" fill={c} stroke={LN} strokeWidth={6} /><path d="M170,-240 H270 L310,-180 H170Z" fill="#8FB4C8" stroke={LN} strokeWidth={4} />{[-300, -120, 250].map((wx) => <g key={wx} transform={`translate(${wx},-50) rotate(${t * 80})`}><circle r={52} fill="#2A2A30" stroke={LN} strokeWidth={5} /><path d="M-30,0 H30 M0,-30 V30" stroke="#9A9A9A" strokeWidth={6} /></g>)}</g>
);

export const _yuk = { cl, md };
