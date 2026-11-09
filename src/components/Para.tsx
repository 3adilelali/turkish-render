import React from "react";
import { T, TMini, MINI_COLS } from "./Toon";

// Kanal 2 · para / enflasyon kiti (k2r-06 Zengin): banknot (yüzsüz, seri no), para yığını, ikiye bölünen not,
// mahalle fırını, yağmurlu Bağcılar sokağı + kurye motoru, banka gişesi + sayma makinesi, depo, radyo,
// fiyat etiketi, bakkal kepengi, 2004 milyonluk banknot, "altı sıfır" atma kartı, kapı altı zarf.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const lp = (a: number, b: number, k: number) => a + (b - a) * k;

// banknot: yüz yok, sadece desen, değer, seri no
export const Banknot: React.FC<{ x: number; y: number; s?: number; rot?: number; v?: string; c?: string; serial?: string; op?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, v = "200", c = "#C98AB8", serial = "A 042731", op = 1, glow = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    {glow > 0 && <rect x={-180} y={-95} width={360} height={190} rx={22} fill={T.rim} opacity={0.35 * glow} />}
    <rect x={-160} y={-80} width={320} height={160} rx={12} fill={c} stroke="#5A3A50" strokeWidth={4} />
    <rect x={-146} y={-66} width={292} height={132} rx={8} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />
    <circle cx={-70} cy={0} r={48} fill="#FFFFFF" opacity={0.25} />
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-70} cy={0} r={12 + i * 7} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.35} />)}
    <text x={110} y={-22} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#FFFFFF" stroke="#5A3A50" strokeWidth={2} paintOrder="stroke">{v}</text>
    <text x={110} y={14} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#FFFFFF">TÜRK LİRASI</text>
    <text x={-140} y={60} fontFamily="monospace" fontWeight={700} fontSize={22} fill="#3A1A30">{serial}</text>
    <path d="M90,40 l14,-16 l14,16 l-14,16Z" fill={T.red} opacity={0.8} />
  </g>
);

// para yığını
export const ParaYigin: React.FC<{ x: number; y: number; s?: number; n?: number; t?: number; c?: string }> = ({ x, y, s = 1, n = 12, t = 0, c = "#C98AB8" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => {
      const r = Math.floor(i / 4), k = i % 4;
      return <g key={i} transform={`translate(${(k - 1.5) * 120 + (r % 2) * 50},${-r * 34}) rotate(${((i * 37) % 21) - 10})`}><rect x={-80} y={-26} width={160} height={52} rx={6} fill={c} stroke="#5A3A50" strokeWidth={3} /><rect x={-80} y={-6} width={160} height={10} fill="#F2E3A0" /></g>;
    })}
    {t > 0 && <circle cx={0} cy={-40} r={200} fill={T.yellow} opacity={0.08 + 0.05 * Math.sin(t * 4)} />}
  </g>
);

// ikiye bölünen banknot (k: 0→1)
export const Bolunen: React.FC<{ x: number; y: number; s?: number; k: number; v?: string; t?: number }> = ({ x, y, s = 1, k, v = "200", t = 0 }) => {
  const d = 190 * Math.sin(cl(k) * Math.PI / 2);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {k > 0 && k < 1 && <circle r={160 + 120 * k} fill={T.rim} opacity={0.35 * (1 - k)} />}
      <Banknot x={-d} y={-d * 0.15} rot={-d * 0.03} v={v} glow={k > 0 && k < 1 ? 1 : 0} />
      {k > 0 && <Banknot x={d} y={d * 0.15} rot={d * 0.03} v={v} glow={k < 1 ? 1 : 0} />}
      {k > 0 && k < 1 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.63) * (100 + k * 200)} cy={Math.sin(i * 0.63) * (60 + k * 120)} r={6} fill="#FFFFFF" opacity={1 - k} />)}
      {t > 0 && null}
    </g>
  );
};

// mahalle fırını: taş fırın, raflarda ekmek, tezgâh, etiket
export const Firin: React.FC<{ t: number; price?: string; priceHi?: number; fire?: number; dawn?: number; empty?: number }> = ({ t, price = "15 TL", priceHi = 0, fire = 1, dawn = 0, empty = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8D2AE" />
    <rect width={1920} height={760} fill="url(#tBrick)" opacity={0.45} />
    {/* taş fırın */}
    <g transform="translate(560,700)">
      <path d="M-380,60 L-380,-260 Q0,-520 380,-260 L380,60Z" fill="#B9A58A" stroke={T.ink} strokeWidth={6} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-380 + i * 58},${-260 - Math.sin((i / 13) * Math.PI) * 250} l40,20`} stroke="#8A7A62" strokeWidth={5} />)}
      <path d="M-170,60 L-170,-110 Q0,-250 170,-110 L170,60Z" fill="#2A1A10" stroke={T.ink} strokeWidth={6} />
      <path d="M-150,60 Q0,-180 150,60Z" fill="#FF8A2A" opacity={fire * (0.7 + 0.2 * Math.sin(t * 9))} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-90 + i * 60},60 q${-20 + Math.sin(t * 8 + i) * 14},-60 0,${-110 - Math.sin(t * 6 + i) * 20} q20,40 18,110Z`} fill="#FFD23A" opacity={fire * 0.8} />)}
      <circle cy={-20} r={340} fill="#FF9A3A" opacity={fire * (0.1 + 0.04 * Math.sin(t * 7))} />
    </g>
    {/* raf ve ekmekler */}
    <g transform="translate(1340,200)">
      {[0, 1, 2].map((r) => <g key={r}><rect x={-300} y={r * 150 + 110} width={600} height={16} fill={T.wood2} />{Array.from({ length: 6 }, (_, i) => (i + r * 6) / 18 < 1 - empty && <g key={i} transform={`translate(${-250 + i * 100},${r * 150 + 80})`}><ellipse rx={46} ry={26} fill="#D9963A" stroke="#7A4A1A" strokeWidth={4} />{[-20, 0, 20].map((sx) => <path key={sx} d={`M${sx - 8},-12 l16,20`} stroke="#F2C27A" strokeWidth={4} />)}</g>)}</g>)}
    </g>
    {/* tezgâh */}
    <rect x={0} y={800} width={1920} height={280} fill={T.wood} />
    <rect x={0} y={800} width={1920} height={24} fill={T.wood2} />
    <rect x={0} y={824} width={1920} height={10} fill="#00000022" />
    {/* fiyat etiketi */}
    <g transform={`translate(1340,${720}) rotate(${Math.sin(t * 2) * 2}) scale(${1 + priceHi * 0.25})`}>
      <path d="M0,-120 V-60" stroke={T.ink} strokeWidth={4} />
      <rect x={-130} y={-60} width={260} height={110} rx={14} fill="#FFFDF4" stroke={priceHi ? T.red : T.ink} strokeWidth={6} />
      <text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill={priceHi ? T.red : T.ink}>{price}</text>
      <text y={-30} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={20} fill={T.ink2}>EKMEK</text>
    </g>
    {/* tabela */}
    <g transform="translate(960,70)"><rect x={-280} y={-46} width={560} height={92} rx={14} fill="#7A2430" stroke={T.ink} strokeWidth={5} /><text y={20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill="#F6E2A0">HAMDİ FIRINI</text></g>
    {dawn > 0 && <rect width={1920} height={1080} fill="#1A2C48" opacity={0.35 * dawn} />}
  </g>
);

// yağmurlu Bağcılar sokağı
export const Yagmur: React.FC<{ t: number; heavy?: number; shop?: boolean }> = ({ t, heavy = 1, shop = true }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    {[[0, 380, 520], [380, 300, 600], [680, 360, 480], [1040, 320, 640], [1360, 300, 540], [1660, 260, 600]].map(([x, w, h], i) => (
      <g key={i}><rect x={x} y={860 - h} width={w} height={h} fill={["#3A3F55", "#454A62", "#383C50"][i % 3]} stroke="#1A1C28" strokeWidth={4} />
        {Array.from({ length: Math.floor(h / 110) }, (_, r) => Array.from({ length: Math.floor(w / 110) }, (_, c) => <rect key={`${r}${c}`} x={x + 24 + c * 110} y={860 - h + 30 + r * 110} width={60} height={70} fill={(r * 7 + c * 3 + i) % 4 === 0 ? "#F6C445" : "#20243A"} opacity={0.85} />))}
      </g>
    ))}
    {shop && <g transform="translate(1180,700)"><rect x={-220} y={-60} width={440} height={220} fill="#F6E7C8" stroke={T.ink} strokeWidth={5} /><rect x={-240} y={-110} width={480} height={60} fill="#7A2430" /><text y={-66} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6E2A0">FIRIN</text><circle cy={40} r={180} fill="#FFC86A" opacity={0.25} /></g>}
    <rect y={860} width={1920} height={220} fill="#2A2E3A" />
    {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={(i * 260 + 80) % 1920} cy={960 + (i % 3) * 30} rx={120} ry={10} fill="#8FA9C8" opacity={0.25} />)}
    {Array.from({ length: Math.round(160 * heavy) }, (_, i) => {
      const x = md(i * 97 - t * 160, 1960) - 20, y = md(i * 131 + t * 1700, 1140) - 60;
      return <path key={i} d={`M${x},${y} l-10,44`} stroke="#BFD4FF" strokeWidth={2.5} opacity={0.5} />;
    })}
  </g>
);

// kurye motoru (yan)
export const Motor: React.FC<{ x: number; y: number; s?: number; t?: number; box?: boolean; c?: string }> = ({ x, y, s = 1, t = 0, box = true, c = T.red }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-150, 150].map((wx) => <g key={wx} transform={`translate(${wx},-60)`}><circle r={62} fill={T.ink} /><circle r={30} fill="#9AA4AE" /><path d={`M0,0 L${Math.cos(t * 12) * 28},${Math.sin(t * 12) * 28}`} stroke={T.ink} strokeWidth={5} /></g>)}
    <path d="M-170,-90 L-60,-150 L120,-150 L190,-90 L150,-70 L-150,-70Z" fill={c} stroke={T.ink} strokeWidth={5} />
    <path d="M120,-150 L150,-230 L180,-230" stroke={T.ink} strokeWidth={10} fill="none" strokeLinecap="round" />
    <circle cx={190} cy={-180} r={16} fill="#FFF3B0" />
    {box && <g transform="translate(-140,-150)"><rect x={-80} y={-150} width={160} height={150} rx={10} fill={T.yellow} stroke={T.ink} strokeWidth={5} /><text y={-62} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill={T.ink}>KURYE</text></g>}
  </g>
);

// banka gişesi + sayma makinesi
export const Gise: React.FC<{ t: number; count?: number; stop?: number; alarm?: number }> = ({ t, count = 1, stop = 0, alarm = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E3ECF2" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={120 + i * 300} y={100} width={220} height={300} fill="#CFE0EA" stroke="#9FB6C8" strokeWidth={4} />)}
    <rect x={0} y={420} width={1920} height={60} fill="#2C5AA0" />
    <text x={960} y={462} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={38} fill="#FFFFFF">VEZNE · GİŞE 3</text>
    <rect x={0} y={480} width={1920} height={20} fill="#9FB6C8" />
    <rect x={0} y={780} width={1920} height={300} fill="#C7B79A" />
    <rect x={0} y={760} width={1920} height={30} fill="#8A7A62" />
    {/* cam bölme */}
    <rect x={200} y={500} width={1520} height={270} fill="#DFF2FA" opacity={0.35} stroke="#9FB6C8" strokeWidth={6} />
    {/* sayma makinesi */}
    <g transform="translate(1260,760)">
      <rect x={-170} y={-150} width={340} height={150} rx={18} fill="#3A4250" stroke={T.ink} strokeWidth={5} />
      <rect x={-120} y={-130} width={170} height={60} rx={6} fill={alarm ? T.red : "#0E1A2E"} />
      <text x={-35} y={-86} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={40} fill={alarm ? "#FFFFFF" : "#5FF2E2"}>{alarm ? "HATA" : String(Math.floor(count * (stop ? 37 : (t * 40) % 1000))).padStart(3, "0")}</text>
      {!stop && Array.from({ length: 5 }, (_, i) => <rect key={i} x={70 + md(t * 300 + i * 30, 120) - 60} y={-150 - md(t * 300 + i * 30, 120) * 0.4} width={80} height={12} fill="#C98AB8" />)}
      <circle cx={110} cy={-100} r={14} fill={alarm ? T.red : T.green} opacity={alarm ? 0.6 + 0.4 * Math.sin(t * 14) : 1} />
    </g>
    {alarm > 0 && <rect width={1920} height={1080} fill={T.red} opacity={0.06 + 0.05 * Math.sin(t * 12)} />}
  </g>
);

// depo: tek lamba, masa, çuvallar
export const Depo: React.FC<{ t: number; sacks?: number; radio?: boolean }> = ({ t, sacks = 8, radio = true }) => {
  const sw = Math.sin(t * 1.3) * 8;
  return (
    <g>
      <rect width={1920} height={1080} fill="#1E2028" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={0} width={14} height={760} fill="#2A2C36" />)}
      <rect y={760} width={1920} height={320} fill="#2E2A26" />
      <g transform={`rotate(${sw},960,0)`}>
        <path d="M960,0 V200" stroke="#111" strokeWidth={5} />
        <path d="M880,200 L1040,200 L1000,250 L920,250Z" fill="#3A3A3A" />
        <circle cx={960} cy={258} r={18} fill="#FFF3B0" />
        <path d="M900,250 L1020,250 L1460,1080 L460,1080Z" fill="#FFE7A0" opacity={0.16} />
      </g>
      {/* masa */}
      <rect x={640} y={760} width={640} height={30} fill={T.wood} stroke={T.ink} strokeWidth={4} />
      {[680, 1240].map((lx) => <rect key={lx} x={lx - 10} y={790} width={20} height={190} fill={T.wood2} />)}
      <ParaYigin x={960} y={750} s={0.7} n={8} />
      {Array.from({ length: sacks }, (_, i) => <g key={i} transform={`translate(${i < 4 ? 140 + i * 120 : 1360 + (i - 4) * 120},${960 - (i % 2) * 40})`}><path d="M-60,40 Q-80,-60 -40,-110 L40,-110 Q80,-60 60,40Z" fill="#B59A6A" stroke={T.ink} strokeWidth={4} /><path d="M-30,-110 Q0,-130 30,-110" stroke={T.ink} strokeWidth={6} fill="none" /><text y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#5A3A20">₺</text></g>)}
      {radio && <g transform="translate(1180,700)"><rect x={-70} y={-60} width={140} height={60} rx={10} fill="#7A4A2A" stroke={T.ink} strokeWidth={4} /><circle cx={-30} cy={-30} r={18} fill="#2A2A2A" /><rect x={10} y={-46} width={44} height={10} fill="#F6C445" /><path d="M40,-60 L70,-110" stroke={T.ink} strokeWidth={4} />{[0, 1, 2].map((i) => <path key={i} d={`M${90 + i * 18},-60 q14,-20 0,-40`} stroke="#5FF2E2" strokeWidth={4} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 6 + i)} />)}</g>}
    </g>
  );
};

// fiyat etiketi kartı (büyük)
export const Etiket: React.FC<{ x?: number; y?: number; s?: number; t: number; from: string; to: string; k: number; item?: string }> = ({ x = 960, y = 540, s = 1, t, from, to, k, item = "EKMEK" }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 2) * 2})`}>
    <path d="M0,-300 V-170" stroke={T.ink} strokeWidth={6} />
    <circle cy={-300} r={12} fill={T.ink} />
    <rect x={-330} y={-170} width={660} height={340} rx={30} fill="#FFFDF4" stroke={k > 0.5 ? T.red : T.ink} strokeWidth={10} />
    <text y={-90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={54} fill={T.ink2}>{item}</text>
    <g opacity={1 - cl(k * 2)}><text y={60} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={130} fill={T.ink}>{from}</text></g>
    <g opacity={cl(k * 2 - 1)} transform={`scale(${1 + 0.15 * Math.sin(cl(k * 2 - 1) * Math.PI)})`}><text y={60} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={130} fill={T.red}>{to}</text></g>
    {k > 0.3 && k < 0.7 && <path d="M-260,20 L260,20" stroke={T.red} strokeWidth={14} strokeLinecap="round" />}
  </g>
);

// bakkal kepengi
export const Kepenk: React.FC<{ t: number; down?: number; crowd?: number }> = ({ t, down = 0, crowd = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    <rect x={0} y={200} width={1920} height={680} fill="#4A4E60" />
    <g transform="translate(960,300)">
      <rect x={-460} y={-80} width={920} height={90} fill="#2C5AA0" stroke={T.ink} strokeWidth={5} />
      <text y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={58} fill="#FFFFFF">BAKKAL</text>
      <rect x={-420} y={10} width={840} height={560} fill="#F6E7C8" />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 8 }, (_, c) => <rect key={`${r}${c}`} x={-390 + c * 100} y={50 + r * 150} width={70} height={100} rx={8} fill={MINI_COLS[(r + c) % MINI_COLS.length]} />))}
      <rect x={-420} y={10} width={840} height={560 * cl(down)} fill="#9AA4AE" />
      {Array.from({ length: Math.floor(28 * cl(down)) }, (_, i) => <rect key={i} x={-420} y={10 + i * 20} width={840} height={4} fill="#6E7680" />)}
    </g>
    <rect y={880} width={1920} height={200} fill="#2A2E3A" />
    <circle cx={300} cy={140} r={60} fill="#F2E6B0" />
    {crowd > 0 && Array.from({ length: 4 }, (_, i) => <TMini key={i} x={300 + i * 420} y={1040} s={2.6} c={MINI_COLS[i + 1]} t={t} seed={i} />)}
  </g>
);

// 2004'te milyonluk banknotlar ve "altı sıfır"
export const Milyon: React.FC<{ t: number; k?: number; zeros?: number }> = ({ t, k = 1, zeros = 0 }) => {
  const digits = "1.000.000".split("");
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DDC5" />
      {Array.from({ length: 6 }, (_, i) => <Banknot key={i} x={300 + i * 270} y={260 + (i % 2) * 60} s={0.8} rot={-8 + i * 3} v="1.000.000" c={["#B8D08A", "#E2B07A", "#9FC2E0"][i % 3]} serial={`F ${100000 + i * 7}`} op={cl(k * 6 - i)} />)}
      <g transform="translate(960,720)">
        {digits.map((d, i) => {
          const isZero = d === "0" || d === ".";
          const fall = isZero ? cl(zeros * 1.6 - (digits.length - i) * 0.08) : 0;
          return <text key={i} x={(i - 4) * 110} y={fall * 600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={190} fill={isZero && zeros > 0 ? T.red : T.ink} opacity={1 - fall} transform={`rotate(${fall * 40 * (i % 2 ? 1 : -1)},${(i - 4) * 110},${fall * 600})`}>{d}</text>;
        })}
        <text x={560} y={0} fontFamily="Poppins" fontWeight={800} fontSize={120} fill={T.ink}>{zeros > 0.9 ? "YTL" : "TL"}</text>
      </g>
      {t < 0 && null}
    </g>
  );
};

// kapı altına bırakılan zarf
export const KapiZarf: React.FC<{ t: number; k?: number; n?: number }> = ({ t, k = 1, n = 3 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2E40" />
    {Array.from({ length: n }, (_, i) => {
      const dx = 320 + i * 640;
      return <g key={i} transform={`translate(${dx},0)`}>
        <rect x={-200} y={160} width={400} height={760} fill={["#6A4A2A", "#3A5A6A", "#5A3A4A"][i % 3]} stroke={T.ink} strokeWidth={6} />
        <rect x={-170} y={190} width={340} height={300} fill="none" stroke="#00000044" strokeWidth={5} />
        <rect x={-170} y={530} width={340} height={340} fill="none" stroke="#00000044" strokeWidth={5} />
        <circle cx={140} cy={560} r={14} fill={T.yellow} />
        <text y={140} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#BFC8D8">{["No: 4", "No: 7", "No: 12"][i % 3]}</text>
        <g transform={`translate(${lp(-260, 0, cl(k * n - i))},970)`} opacity={cl(k * n - i)}><rect x={-90} y={-40} width={180} height={80} fill="#FFFDF4" stroke={T.ink} strokeWidth={4} /><path d="M-90,-40 L0,10 L90,-40" stroke={T.ink} strokeWidth={4} fill="none" /></g>
      </g>;
    })}
    <rect y={920} width={1920} height={160} fill="#1E2030" />
    <rect width={1920} height={1080} fill="#F6C445" opacity={0.04 + 0.02 * Math.sin(t * 3)} />
  </g>
);
