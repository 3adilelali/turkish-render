import React from "react";
import { T, MINI_COLS } from "./Toon";

// Kanal 2 · k2r-14 «Güç» kiti, ek parçalar (2026-11-13): merdiven, silüet yükler, kas lifi, Newton, optik form,
// kırık telefonlar, maşrapa, izlenme sayacı, hesap makinesi, çamaşır ipi, omurga, terazi, vapur içi çay masası, balık ekmek, güvercin, seçim kartı, nakit.
const LN = "#1A1A22";
const TQ = "#2EE6D0";
const md = (v: number, m: number) => ((v % m) + m) % m;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const cl = (v: number) => Math.max(0, Math.min(1, v));

// ── merdiven boşluğu (çapraz basamaklar); stairY(x) = basamak yüksekliği
export const Basamak: React.FC<{ t: number; night?: number }> = ({ night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#3A3550" : "#E6D8BE"} />
    <rect x={0} y={0} width={1920} height={420} fill={night ? "#2E2A40" : "#D9C7A4"} />
    <path d={`M200,1080 ${Array.from({ length: 14 }, (_, i) => `L${200 + i * 110},${1060 - i * 60} L${310 + i * 110},${1060 - i * 60}`).join(" ")} L1920,220 L1920,1080Z`} fill="#BFA780" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${200 + i * 110},${1060 - i * 60} h110`} stroke="#8A7458" strokeWidth={6} />)}
    <path d="M180,880 L1760,40" stroke="#5E4428" strokeWidth={10} />
    {Array.from({ length: 12 }, (_, i) => <path key={"p" + i} d={`M${240 + i * 130},${848 - i * 69} v130`} stroke="#5E4428" strokeWidth={5} />)}
    <rect x={1560} y={20} width={160} height={200} rx={6} fill="#7A5A3A" stroke="#3A2A20" strokeWidth={5} />
    <text x={1400} y={80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#5A3E25">KAT 4</text>
  </g>
);
export const stairY = (x: number) => 1060 - Math.max(0, Math.min(13, (x - 200) / 110)) * 60;

// ── silüet yükler (figürün başının üstünde)
export const Silu: React.FC<{ kind: "fil" | "tank" | "eyfel" | "piramit"; x: number; y: number; s?: number; c?: string }> = ({ kind, x, y, s = 1, c = "#5E6670" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={c} stroke={LN} strokeWidth={6}>
    {kind === "fil" && <g><ellipse cx={0} cy={-120} rx={200} ry={120} /><circle cx={190} cy={-170} r={90} /><path d="M260,-150 Q320,-40 280,40" fill="none" strokeWidth={26} stroke={c} /><path d="M150,-230 Q90,-150 150,-90" fill="#8A929A" />{[-140, -60, 60, 130].map((lx) => <rect key={lx} x={lx - 26} y={-40} width={52} height={90} />)}</g>}
    {kind === "tank" && <g><rect x={-260} y={-110} width={520} height={110} rx={30} /><rect x={-140} y={-200} width={240} height={100} rx={20} /><rect x={90} y={-170} width={300} height={30} />{[-200, -100, 0, 100, 200].map((wx) => <circle key={wx} cx={wx} cy={-20} r={34} fill="#3A3F48" />)}</g>}
    {kind === "eyfel" && <g fill="none" strokeWidth={14} stroke="#8A6A3A"><path d="M-220,0 Q-60,-260 -20,-760 M220,0 Q60,-260 20,-760 M-20,-760 L0,-900 L20,-760 M-150,-180 H150 M-80,-420 H80" /><path d="M-120,0 Q0,-120 120,0" strokeWidth={10} /></g>}
    {kind === "piramit" && <g><path d="M-420,0 L0,-380 L420,0Z" fill="#D9B97A" />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-420 + i * 55},${-i * 50} H${420 - i * 55}`} stroke="#B8955A" strokeWidth={4} />)}</g>}
  </g>
);

// ── kas lifi şeması: active kadar lif turkuaz yanar; boost: yanan lifler balyoz gibi kalınlaşır
export const Lif: React.FC<{ t: number; n?: number; active: number; boost?: number; label?: string }> = ({ t, n = 20, active, boost = 0, label }) => (
  <g>
    <rect width={1920} height={1080} fill="#14203A" />
    <path d="M260,540 Q960,180 1660,540 Q960,900 260,540Z" fill="#E86A6A" opacity={0.25} stroke="#E86A6A" strokeWidth={6} />
    {Array.from({ length: n }, (_, i) => {
      const yy = 540 + (i - n / 2 + 0.5) * 22; const on = i < active;
      const w = on ? 8 + boost * 10 + Math.sin(t * 8 + i) * boost * 3 : 6;
      return <path key={i} d={`M${330 + Math.abs(i - n / 2) * 18},${yy} Q960,${yy + (yy - 540) * 0.2} ${1590 - Math.abs(i - n / 2) * 18},${yy}`} stroke={on ? TQ : "#C96A6A"} strokeWidth={w} fill="none" opacity={on ? 1 : 0.6} />;
    })}
    <g transform="translate(250,200)"><ellipse rx={110} ry={90} fill="#F2B8C9" stroke={LN} strokeWidth={5} /><path d="M-60,-20 q30,-30 60,0 q30,30 50,-10 M-70,30 q40,-20 80,10" stroke="#C24F75" strokeWidth={5} fill="none" />
      <path d="M80,60 L300,250" stroke={TQ} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-t * 60} /></g>
    {label && <text x={960} y={1000} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#F6C445">{label}</text>}
  </g>
);

// ── Newton kartı: sen → otobüs, otobüs → sen (eşit oklar)
export const Newton: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = cl((t - a) / 0.8), k2 = cl((t - a - 1.2) / 0.8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#F2E6D0" />
      <rect x={1000} y={360} width={700} height={300} rx={40} fill="#2E7D5B" stroke={LN} strokeWidth={6} /><text x={1350} y={530} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#FFF">OTOBÜS · 12 TON</text>
      <circle cx={520} cy={420} r={70} fill="#FBE7D2" stroke={LN} strokeWidth={6} /><rect x={460} y={500} width={120} height={180} rx={30} fill={TQ} stroke={LN} strokeWidth={6} /><text x={520} y={760} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={50} fill={LN}>SEN · 70 KG</text>
      <g opacity={k}><path d={`M600,470 L${600 + 380 * k},470`} stroke={T.red} strokeWidth={22} /><path d={`M${600 + 380 * k},440 l40,30 l-40,30Z`} fill={T.red} /></g>
      <g opacity={k2}><path d={`M980,600 L${980 - 380 * k2},600`} stroke={T.blue} strokeWidth={22} /><path d={`M${980 - 380 * k2},570 l-40,30 l40,30Z`} fill={T.blue} /></g>
      <path d="M300,690 H780" stroke="#8A7458" strokeWidth={8} /><text x={540} y={860} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#5A3E25" opacity={k2}>SÜRTÜNME SINIRI</text>
      <text x={960} y={160} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={70} fill={LN}>{"NEWTON'UN 3. YASASI"}</text>
    </g>
  );
};

// ── optik form (delik)
export const Optik: React.FC<{ t: number; hole?: number }> = ({ hole = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#8A7458" />
    <g transform="translate(960,540) rotate(-3)">
      <rect x={-520} y={-460} width={1040} height={920} fill="#FFFDF6" stroke={LN} strokeWidth={5} />
      <rect x={-520} y={-460} width={1040} height={80} fill="#E86A92" opacity={0.6} /><text y={-405} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#FFF">DENEME SINAVI · OPTİK FORM</text>
      {Array.from({ length: 40 }, (_, i) => <g key={i}>{["A", "B", "C", "D", "E"].map((l, j) => <circle key={l} cx={-440 + (i % 2) * 520 + j * 70} cy={-320 + Math.floor(i / 2) * 38} r={13} fill={i < 1 && j === 2 ? LN : "none"} stroke="#E86A92" strokeWidth={3} />)}</g>)}
      {hole > 0 && <g><circle cx={-300} cy={-282} r={30 * hole} fill="#8A7458" stroke={LN} strokeWidth={4} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-300,-282 l${Math.cos(i) * 60 * hole},${Math.sin(i) * 60 * hole}`} stroke={LN} strokeWidth={3} />)}</g>}
    </g>
  </g>
);

// ── kırık ekranlı telefonlar (3)
export const KirikTel: React.FC<{ t: number; n?: number }> = ({ n = 3 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A3346" />
    {Array.from({ length: 3 }, (_, i) => (
      <g key={i} transform={`translate(${520 + i * 440},560) rotate(${(i - 1) * 8})`}>
        <rect x={-150} y={-300} width={300} height={600} rx={40} fill="#1C1C1C" stroke={LN} strokeWidth={6} /><rect x={-130} y={-270} width={260} height={540} rx={20} fill="#7FD8F0" />
        {i < n && <g stroke="#FFFFFF" strokeWidth={5} fill="none"><path d={`M${-40 + i * 20},-40 L-130,-200 M${-40 + i * 20},-40 L110,-260 M${-40 + i * 20},-40 L130,120 M${-40 + i * 20},-40 L-90,270 M${-40 + i * 20},-40 L-130,60`} /><circle cx={-40 + i * 20} cy={-40} r={24} /></g>}
      </g>
    ))}
  </g>
);

// ── çelik maşrapa
export const Masrapa: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 0, y = 0, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,-90 L40,-90 L36,0 L-36,0Z" fill="#B9C2CA" stroke={LN} strokeWidth={5} /><path d="M40,-70 Q80,-60 70,-30 Q60,-10 38,-14" stroke={LN} strokeWidth={8} fill="none" />
    <rect x={-36} y={-80} width={18} height={70} fill="#FFFFFF" opacity={0.5} /><path d="M-30,-100 q10,-30 0,-50 M10,-100 q10,-30 0,-50" stroke="#E9E2D2" strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);

// ── izlenme sayacı (telefon ekranı)
export const Izlenme: React.FC<{ t: number; a: number; to: number; from?: number; title: string }> = ({ t, a, to, from = 0, title }) => {
  const v = Math.round(from + (to - from) * cl((t - a - 0.2) / 1.6));
  return (
    <g>
      <rect width={1920} height={1080} fill="#14203A" />
      <g transform="translate(960,560)">
        <rect x={-330} y={-500} width={660} height={1000} rx={60} fill="#1C1C1C" /><rect x={-300} y={-460} width={600} height={920} rx={30} fill="#F4F4F2" />
        <rect x={-300} y={-460} width={600} height={360} rx={30} fill="#2A3346" /><path d="M-40,-320 L50,-280 L-40,-240Z" fill="#FFFFFF" />
        <text x={-270} y={-40} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#1C1C1C">{title}</text>
        <text x={-270} y={60} fontFamily="Poppins" fontWeight={800} fontSize={74} fill={T.red}>{v.toLocaleString("tr-TR")}</text>
        <text x={-270} y={120} fontFamily="Poppins" fontWeight={700} fontSize={36} fill="#5E6670">izlenme</text>
        {Array.from({ length: 4 }, (_, i) => <rect key={i} x={-270} y={180 + i * 60} width={540 - i * 90} height={30} rx={10} fill="#D9DCDF" />)}
      </g>
    </g>
  );
};

// ── hesap makinesi: sayı ekrana sığmıyor
export const HesapMak: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const full = "1073741824"; const n = Math.min(full.length, Math.floor(cl((t - a - 0.3) / 1.6) * full.length));
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2420" />
      <g transform="translate(960,560)">
        <rect x={-300} y={-500} width={600} height={1000} rx={60} fill="#1C1C1C" />
        <rect x={-260} y={-440} width={520} height={220} rx={20} fill="#0E1A2E" />
        <text x={240} y={-290} textAnchor="end" fontFamily="Poppins" fontWeight={700} fontSize={n > 7 ? 86 : 110} fill="#E9FFFC">{full.slice(0, n) || "0"}</text>
        {n >= full.length && <rect x={-262} y={-442} width={524} height={224} rx={20} fill="none" stroke={T.red} strokeWidth={6} opacity={Math.sin(t * 10) > 0 ? 1 : 0.3} />}
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-195 + (i % 4) * 130} cy={-110 + Math.floor(i / 4) * 130} r={52} fill={i % 4 === 3 ? "#F28C28" : "#3A3F48"} />)}
      </g>
    </g>
  );
};

// ── çamaşır ipi: wind 0..1 (hapşırık)
export const Camasir: React.FC<{ t: number; wind?: number }> = ({ t, wind = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    <rect x={0} y={200} width={420} height={880} fill="#D9C3A0" stroke="#9E8460" strokeWidth={5} /><rect x={1500} y={160} width={420} height={920} fill="#CDB287" stroke="#9E8460" strokeWidth={5} />
    {Array.from({ length: 8 }, (_, i) => <rect key={"w" + i} x={60 + (i % 2) * 180 + (i > 3 ? 1500 : 0)} y={280 + Math.floor((i % 4) / 2) * 260} width={120} height={160} rx={6} fill="#7FA9C2" stroke="#5E6670" strokeWidth={4} />)}
    {[360, 600].map((ly, r) => (
      <g key={ly}>
        <path d={`M420,${ly} Q960,${ly + 60 - wind * 50} 1500,${ly}`} stroke="#5E6670" strokeWidth={4} fill="none" />
        {Array.from({ length: 6 }, (_, i) => {
          const cx = 520 + i * 160; const sw = wind * (60 + Math.sin(t * 20 + i) * 30);
          return <path key={i} d={`M${cx - 50},${ly + 30} L${cx + 50},${ly + 30} L${cx + 50 + sw},${ly + 190 - wind * 40} L${cx - 50 + sw},${ly + 190 - wind * 40}Z`} fill={MINI_COLS[(i + r * 3) % MINI_COLS.length]} stroke={LN} strokeWidth={4} />;
        })}
      </g>
    ))}
    {wind > 0 && Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${md(i * 160 + t * 1400, 2200) - 200},${300 + (i % 5) * 90} l160,0`} stroke="#FFFFFF" strokeWidth={6} opacity={0.6 * wind} />)}
  </g>
);

// ── omurga: iki fıtık
export const Omurga: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E1A2E" />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i} transform={`translate(${960 + Math.sin(i * 0.5) * 30},${140 + i * 100})`}>
        <rect x={-90} y={-36} width={180} height={72} rx={22} fill="#D9E8F0" stroke="#7FA9C2" strokeWidth={4} opacity={0.9} />
        <rect x={-70} y={36} width={140} height={28} rx={10} fill="#7FA9C2" opacity={0.6} />
        {(i === 6 || i === 7) && <ellipse cx={90} cy={50} rx={40 + Math.sin(t * 4) * 4} ry={20} fill={T.red} opacity={k} />}
      </g>
    ))}
    <text x={1240} y={820} fontFamily="Poppins" fontWeight={800} fontSize={64} fill={T.red} opacity={k}>2 FITIK</text>
  </g>
);

// ── terazi: sol vs sağ (tilt -1..1)
export const Terazi: React.FC<{ t: number; tilt?: number; l: string; r: string }> = ({ t, tilt = 0, l, r }) => {
  const a = tilt * 12 + Math.sin(t * 1.5) * 2;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2420" />
      <rect x={950} y={360} width={20} height={600} fill="#B8955A" /><rect x={820} y={950} width={280} height={30} rx={10} fill="#B8955A" />
      <g transform={`rotate(${a} 960 360)`}>
        <rect x={360} y={350} width={1200} height={20} fill="#D9B97A" />
        {([[460, l], [1460, r]] as [number, string][]).map(([px, lb], i) => (
          <g key={i} transform={`translate(${px},360) rotate(${-a})`}>
            <path d="M0,0 L-160,300 M0,0 L160,300" stroke="#8A6A3A" strokeWidth={4} /><path d="M-220,300 Q0,380 220,300Z" fill="#D9B97A" stroke={LN} strokeWidth={5} />
            <text y={260} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={38} fill="#FFF3D6">{lb}</text>
          </g>
        ))}
      </g>
    </g>
  );
};

// ── vapur içi masa: ince belli bardaklar (wob: sallanma)
export const CayMasa: React.FC<{ t: number; wob?: number }> = ({ t, wob = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9D3A8" />
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={160 + i * 440} y={140} width={360} height={260} rx={40} fill="#9FD3EC" stroke="#7A5A3A" strokeWidth={8} />)}
    {Array.from({ length: 4 }, (_, i) => <rect key={"w" + i} x={160 + i * 440} y={140} width={360} height={260} rx={40} fill="#F7A86A" opacity={0.3} />)}
    <rect x={200} y={640} width={1520} height={40} rx={10} fill="#8A5A32" stroke={LN} strokeWidth={5} />
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i} transform={`translate(${380 + i * 230},640) rotate(${Math.sin(t * 9 + i) * wob * 6})`}>
        <ellipse cx={0} cy={0} rx={50} ry={10} fill="#C9C9C9" /><g transform="scale(2.2)"><path d="M-16,-46 L16,-46 Q8,-23 12,0 L-12,0 Q-8,-23 -16,-46Z" fill="#DDF1F7" opacity={0.85} stroke="#9CC9D6" strokeWidth={2.5} /><path d="M-13,-30 L13,-30 Q8,-15 12,0 L-12,0 Q-8,-15 -13,-30Z" fill="#B8461E" opacity={0.85} /></g>
      </g>
    ))}
  </g>
);

// ── balık ekmek
export const BalikEkmek: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60,-10 Q0,-40 60,-10 L60,10 Q0,30 -60,10Z" fill="#E0B36A" stroke={LN} strokeWidth={3} /><path d="M-50,-4 L50,-4" stroke="#8C949C" strokeWidth={8} /><path d="M-40,-12 L40,-12" stroke="#7FA03A" strokeWidth={4} />
  </g>
);

// ── güvercinler (havalanma)
export const Guvercin: React.FC<{ t: number; a: number; n?: number; x?: number; y?: number }> = ({ t, a, n = 24, x = 330, y = 330 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const p = cl((t - a - rnd(i) * 0.5) / 3); const bx = x + (rnd(i + 5) - 0.3) * 300 + p * (300 + rnd(i + 2) * 900), by = y - p * (200 + rnd(i + 7) * 300);
      const f = Math.sin(t * 22 + i) * 14;
      return <path key={i} d={`M${bx - 20},${by - f} Q${bx - 8},${by - 6} ${bx},${by} Q${bx + 8},${by - 6} ${bx + 20},${by - f}`} stroke="#3A3F48" strokeWidth={4} fill="none" />;
    })}
  </g>
);

// ── iki seçenek kartı
export const Secim: React.FC<{ t: number; a: number; l: [string, string] }> = ({ t, a, l }) => (
  <g>
    <rect width={1920} height={1080} fill="#F2E6D0" />
    {l.map((tx, i) => <g key={i} opacity={cl((t - a - 0.4 - i * 1.4) / 0.3)}><rect x={160 + i * 840} y={380} width={760} height={240} rx={40} fill={[TQ, T.red][i]} stroke={LN} strokeWidth={6} /><text x={540 + i * 840} y={520} textAnchor="middle" fontFamily="Patrick Hand, sans-serif" fontSize={64} fill="#FFFFFF">{tx}</text></g>)}
  </g>
);

// ── nakit deste
export const Nakit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${i * 6},${-i * 14})`}><rect x={-110} y={-40} width={220} height={80} rx={6} fill="#B7D6A0" stroke="#3E6A2E" strokeWidth={4} /><rect x={-20} y={-40} width={40} height={80} fill="#E9D3A8" /></g>)}
  </g>
);

// ── kırık yatak (yer minderi)
export const KirikYatak: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-300,0 L-260,-40 L-10,-10 L20,-60 L300,-30 L300,0Z" fill="#8A5A32" stroke={LN} strokeWidth={5} />
    <rect x={-290} y={-70} width={580} height={50} rx={20} fill="#E9E2D2" stroke={LN} strokeWidth={5} />
    <path d="M-20,-60 l20,30 l20,-30" stroke={LN} strokeWidth={5} fill="none" />
  </g>
);
