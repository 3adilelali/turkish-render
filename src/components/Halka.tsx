import React from "react";

// Kanal 2 · k2r-11 Sevgi: göğüste, kalbin olduğu yerde, sadece kahramanın gördüğü ışık halkası ve yüzde.
// x,y = figürün ayak noktası (TFig ile aynı), s = figür ölçeği. from→n geçişi "at" anında titreyerek olur.
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const halkaRenk = (n: number) => (n < 30 ? "#F05A4A" : n < 70 ? "#F6C445" : "#2EE6D0");

export const Halka: React.FC<{ t: number; x: number; y: number; s?: number; n: number; from?: number; at?: number; k?: number; dir?: 1 | -1; big?: number }> = ({ t, x, y, s = 1, n, from, at = 0, k = 1, dir = 1, big = 1 }) => {
  if (k <= 0.001) return null;
  const p = from === undefined ? 1 : cl((t - at) / 0.9);
  const v = from === undefined ? n : Math.round(from + (n - from) * p);
  const jit = from !== undefined && p > 0 && p < 1 ? Math.sin(t * 60) * 4 : 0;
  const c = halkaRenk(v);
  const r = 40 * s * big;
  const cx = x + 12 * s * dir + jit, cy = y - 300 * s;
  return (
    <g opacity={k} transform={`translate(${cx},${cy})`}>
      <circle r={r * 1.7} fill={c} opacity={0.12 + Math.sin(t * 3) * 0.03} />
      <circle r={r} fill="#0E1A2E" opacity={0.55} />
      <circle r={r} fill="none" stroke={c} strokeWidth={6 * s * big} />
      <circle r={r} fill="none" stroke="#FFFFFF" strokeWidth={2 * s * big} strokeDasharray={`${(2 * Math.PI * r * v) / 100} 9999`} transform="rotate(-90)" opacity={0.85} />
      <text y={r * 0.32} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={r * 0.82} fill="#FFFFFF">%{v}</text>
    </g>
  );
};

// Telefonda "isim · sayı" listesi (istatistik ekranı). rows sırayla gelir, hl = vurgulanan satır.
export const Liste: React.FC<{ t: number; a: number; rows: [string, number][]; hl?: number; wipe?: number }> = ({ t, a, rows, hl = -1, wipe = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#14294A" />
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 263 + t * 20) % 1920} cy={(i * 151) % 1080} r={3} fill="#5FF2E2" opacity={0.3} />)}
    <g transform="translate(960,560)">
      <rect x={-340} y={-520} width={680} height={1040} rx={64} fill="#151515" />
      <rect x={-310} y={-480} width={620} height={960} rx={34} fill="#F4F6F8" />
      <rect x={-310} y={-480} width={620} height={110} rx={34} fill="#1E2A40" /><rect x={-310} y={-400} width={620} height={30} fill="#1E2A40" />
      <text x={-270} y={-412} fontFamily="Poppins" fontWeight={800} fontSize={42} fill="#FFFFFF">LİSTE</text>
      {rows.map(([name, n], i) => {
        const k = cl((t - a - i * 0.35) / 0.25);
        const gone = cl((wipe - i * 0.08) * 3);
        return (
          <g key={i} opacity={k * (1 - gone)} transform={`translate(${gone * -400},${-330 + i * 92})`}>
            <rect x={-290} y={-46} width={580} height={80} rx={18} fill={i === hl ? "#FFE3E0" : "#FFFFFF"} stroke={i === hl ? "#F05A4A" : "#D9DEE4"} strokeWidth={i === hl ? 5 : 3} />
            <text x={-260} y={8} fontFamily="Poppins" fontWeight={700} fontSize={34} fill="#1C1C1C">{name}</text>
            <circle cx={210} cy={-6} r={30} fill="none" stroke={halkaRenk(n)} strokeWidth={6} />
            <text x={210} y={4} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#1C1C1C">%{n}</text>
          </g>
        );
      })}
    </g>
  </g>
);
