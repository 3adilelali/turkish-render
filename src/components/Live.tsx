import React from "react";

// "Canlı" katman (2026-11-05, kanal sahibi: "hareket az, sıkıcı"): her çekime otomatik canlılık.
// LiveCam: elde kamera titreşimi + her kesimde "punch" zoom + yavaş nefes alan dönüş.
// Atmos: havada süzülen toz/ışık parçacıkları, sallanan ışık huzmeleri, sıcak/soğuk ton, sinema bantı.
// Fore: ön planda kameradan hızlı geçen bulanık nesneler (derinlik hissi).
// Hepsi vektör ve deterministik (frame'e bağlı), render maliyeti düşük.

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3));
const md = (v: number, m: number) => ((v % m) + m) % m;

export const LiveCam: React.FC<{ t: number; a: number; k?: number; punch?: number; children: React.ReactNode }> = ({ t, a, k = 1, punch = 0.07, children }) => {
  const dt = t - a;
  const p = 1 + punch * (1 - ease(dt / 0.45));
  const dx = (Math.sin(t * 0.73) * 7 + Math.sin(t * 1.91 + 1.3) * 3) * k;
  const dy = (Math.sin(t * 0.61 + 2.1) * 5 + Math.sin(t * 2.33) * 2) * k;
  const rot = (Math.sin(t * 0.37 + 0.6) * 0.35 + Math.sin(t * 1.3) * 0.08) * k;
  return <g transform={`translate(960,540) scale(${p}) rotate(${rot}) translate(${-960 + dx},${-540 + dy})`}>{children}</g>;
};

export type Tone = "warm" | "cool" | "night" | "gold" | "none";
const TONES: Record<Tone, { mote: string; ray: string; tint: string; tintOp: number }> = {
  warm: { mote: "#FFF1C8", ray: "#FFE7B0", tint: "#FFB45A", tintOp: 0.05 },
  gold: { mote: "#FFE08A", ray: "#FFD36A", tint: "#E89B2A", tintOp: 0.07 },
  cool: { mote: "#E6F6FF", ray: "#CFEFFF", tint: "#4FA6D8", tintOp: 0.05 },
  night: { mote: "#BFD4FF", ray: "#9DB8FF", tint: "#1A2A5A", tintOp: 0.2 },
  none: { mote: "#FFFFFF", ray: "#FFFFFF", tint: "#000", tintOp: 0 },
};

export const Atmos: React.FC<{ t: number; tone?: Tone; dust?: number; rays?: number; bars?: boolean; seed?: number }> = ({ t, tone = "warm", dust = 1, rays = 1, bars = false, seed = 0 }) => {
  const c = TONES[tone];
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id="lvRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.ray} stopOpacity="0.5" />
          <stop offset="1" stopColor={c.ray} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="lvMote" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c.mote} stopOpacity="1" />
          <stop offset="1" stopColor={c.mote} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lvVig" cx="0.5" cy="0.48" r="0.72">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
      </defs>
      {rays > 0 && [0, 1, 2].map((i) => {
        const x = 300 + i * 560 + Math.sin(t * 0.21 + i * 2 + seed) * 60;
        const op = rays * (0.16 + 0.1 * Math.sin(t * 0.5 + i * 1.7 + seed));
        return <path key={i} d={`M${x - 70},-40 L${x + 90},-40 L${x + 520},1120 L${x + 160},1120Z`} fill="url(#lvRay)" opacity={op} style={{ mixBlendMode: "screen" }} />;
      })}
      {dust > 0 && Array.from({ length: 46 }, (_, i) => {
        const sp = 8 + (i % 7) * 4;
        const x = md(i * 431 + seed * 97 + Math.sin(t * 0.4 + i) * 40 + t * (i % 2 ? 6 : -4), 1960) - 20;
        const y = md(i * 263 + seed * 53 - t * sp, 1120) - 20;
        const r = 2.5 + (i % 5) * 1.8 + (i % 11 === 0 ? 9 : 0);
        const op = dust * (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 2.1))) * (i % 11 === 0 ? 0.35 : 1);
        return <circle key={i} cx={x} cy={y} r={r * 2.2} fill="url(#lvMote)" opacity={op} />;
      })}
      {c.tintOp > 0 && <rect width={1920} height={1080} fill={c.tint} opacity={c.tintOp} style={{ mixBlendMode: "multiply" }} />}
      <rect width={1920} height={1080} fill="url(#lvVig)" />
      {bars && <><rect width={1920} height={56} fill="#000" /><rect y={1024} width={1920} height={56} fill="#000" /></>}
    </g>
  );
};

// ön plan: kameradan hızlı geçen bulanık şekiller (perde kenarı, sütun, fener…)
export const Fore: React.FC<{ t: number; a: number; kind?: "column" | "curtain" | "lamp" | "leaf" | "rail"; c?: string; side?: 1 | -1; speed?: number }> = ({ t, a, kind = "column", c = "#3A2618", side = 1, speed = 1 }) => {
  const dt = t - a;
  const x = side > 0 ? 1700 - dt * 120 * speed : 220 + dt * 120 * speed;
  return (
    <g opacity={0.92} style={{ filter: "blur(6px)" }} pointerEvents="none">
      {kind === "column" && <g transform={`translate(${x},0)`}><rect x={-90} y={-20} width={180} height={1120} fill={c} /><rect x={-60} y={-20} width={30} height={1120} fill="#FFFFFF" opacity={0.08} /></g>}
      {kind === "curtain" && <g transform={`translate(${x},0)`}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${-160 + i * 70},-20 q${30 + Math.sin(t + i) * 10},540 0,1120 h70 q${-30},-560 0,-1120Z`} fill={c} opacity={0.85 - i * 0.12} />)}</g>}
      {kind === "lamp" && <g transform={`translate(${x},${120 + Math.sin(t * 1.4) * 10})`}><path d="M0,-200 V-40" stroke={c} strokeWidth={6} /><path d="M-60,-40 Q0,-90 60,-40 L40,60 Q0,90 -40,60Z" fill={c} /><circle cy={10} r={90} fill="#FFD27A" opacity={0.35} /></g>}
      {kind === "leaf" && <g transform={`translate(${x},${980})`}>{[0, 1, 2].map((i) => <path key={i} d={`M0,0 q${-120 + i * 80},-260 ${-40 + i * 60},-420 q60,200 40,420Z`} fill={c} opacity={0.9} transform={`rotate(${-20 + i * 20 + Math.sin(t * 2 + i) * 3})`} />)}</g>}
      {kind === "rail" && <g transform={`translate(${x},0)`}><rect x={-1000} y={930} width={2000} height={34} fill={c} />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={-1000 + i * 240} y={940} width={26} height={200} fill={c} />)}</g>}
    </g>
  );
};

// gölge/ışık süpürmesi: kesimden sonra ekrandan geçen ışık şeridi
export const Sweep: React.FC<{ t: number; a: number; c?: string; dur?: number }> = ({ t, a, c = "#FFF6DA", dur = 0.9 }) => {
  const k = (t - a) / dur;
  if (k < 0 || k > 1) return null;
  const x = -600 + k * 3200;
  return <path d={`M${x},-40 L${x + 220},-40 L${x - 180},1120 L${x - 400},1120Z`} fill={c} opacity={0.18 * Math.sin(k * Math.PI)} pointerEvents="none" />;
};
