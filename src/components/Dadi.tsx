import React from "react";
import { H, HTiny, Room, lerp } from "./Harem";
import { Kandil } from "./HaremPlus";

// Kanal 3 · Dadı kiti (k3r-07): hasta yatağı, kolera İstanbul'u, saray bahçesi, mum ışığında ders,
// divan, kese, düğün alayı, gelin duvağı, top gecesi, mezarlık. Hepsi vektör, kamera yaklaşınca bozulmaz.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));

// yatakta yatan çocuk (yandan): baş yastıkta, yorgan üstünde
export const YatanCocuk: React.FC<{ x: number; y: number; s?: number; t: number; fever?: number; eyes?: "closed" | "open"; cloth?: number; robe?: string }> = ({ x, y, s = 1, t, fever = 1, eyes = "closed", cloth = 1, robe = H.cobalt }) => {
  const br = Math.sin(t * 2.2) * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* şilte */}
      <rect x={-420} y={-40} width={840} height={70} rx={24} fill="#EFE2C4" stroke={H.ln} strokeWidth={5} />
      <rect x={-420} y={-6} width={840} height={14} fill="#B3262E" opacity={0.75} />
      {/* yastık */}
      <ellipse cx={-300} cy={-70} rx={130} ry={52} fill="#FBF3E2" stroke={H.ln} strokeWidth={5} />
      {[-360, -300, -240].map((px) => <circle key={px} cx={px} cy={-74} r={6} fill={H.gold} />)}
      {/* baş */}
      <g transform={`translate(-280,-118)`}>
        <ellipse rx={66} ry={74} fill="#2E2018" />
        <ellipse cx={8} cy={8} rx={56} ry={62} fill={H.face} stroke={H.ln} strokeWidth={4} />
        <ellipse cx={-10} cy={30} rx={18} ry={11} fill="#FF7A7A" opacity={0.35 + 0.35 * fever} />
        <ellipse cx={40} cy={30} rx={14} ry={9} fill="#FF7A7A" opacity={0.35 + 0.35 * fever} />
        {eyes === "closed" ? <><path d="M-8,4 q10,8 20,0" stroke={H.ln} strokeWidth={4} fill="none" /><path d="M28,4 q10,8 20,0" stroke={H.ln} strokeWidth={4} fill="none" /></> : <><circle cx={2} cy={4} r={7} fill={H.ln} /><circle cx={38} cy={4} r={7} fill={H.ln} /><circle cx={4} cy={1} r={2.5} fill="#FFF" /><circle cx={40} cy={1} r={2.5} fill="#FFF" /></>}
        <path d={eyes === "open" ? "M10,44 q10,6 20,0" : "M12,46 q8,-3 16,0"} stroke={H.ln} strokeWidth={4} fill="none" />
        {/* ıslak bez */}
        {cloth > 0 && <g opacity={cloth}><rect x={-40} y={-56} width={100} height={30} rx={8} fill="#F4F8FF" stroke="#9FB6CF" strokeWidth={3} transform="rotate(-6)" />{[0, 1].map((i) => <circle key={i} cx={-20 + i * 50} cy={-22 + md(t * 30 + i * 20, 40)} r={4} fill="#9FD3FF" opacity={1 - md(t * 30 + i * 20, 40) / 40} />)}</g>}
      </g>
      {/* yorgan */}
      <path d={`M-220,-60 C-150,${-150 + br} 120,${-160 + br} 380,${-110 + br} L400,-20 L-230,-20Z`} fill={robe} stroke={H.ln} strokeWidth={5} />
      <path d={`M-200,-70 C-120,${-140 + br} 120,${-150 + br} 370,${-104 + br}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.35} strokeDasharray="18 14" />
      {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={-120 + i * 110} cy={-100 + br * 0.6 + (i % 2) * 18} r={14} fill={H.gold} opacity={0.75} />)}
      {/* ateş dalgası */}
      {fever > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${-300 + i * 30},${-210 - md(t * 40 + i * 25, 70)} q10,-14 0,-28 q-10,-14 0,-28`} stroke="#FF8A5A" strokeWidth={5} fill="none" opacity={fever * 0.55 * (1 - md(t * 40 + i * 25, 70) / 70)} />)}
    </g>
  );
};

export const Legen: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={-6} rx={110} ry={30} fill="#B87333" stroke={H.ln} strokeWidth={4} />
    <path d="M-100,-10 Q-80,40 0,44 Q80,40 100,-10Z" fill="#9A5A28" stroke={H.ln} strokeWidth={4} />
    <ellipse cy={-8} rx={86} ry={18} fill="#7FC2E6" opacity={0.85} />
    <ellipse cx={-20 + Math.sin(t * 2) * 10} cy={-10} rx={30} ry={5} fill="#FFFFFF" opacity={0.5} />
    <path d="M40,-14 q30,-40 60,-20" stroke="#F4F8FF" strokeWidth={14} fill="none" strokeLinecap="round" />
  </g>
);

// hasta odası: gece, kandil, yatak, leğen
export const HastaOda: React.FC<{ t: number; night?: number; fever?: number; eyes?: "closed" | "open"; cloth?: number; dawn?: number }> = ({ t, night = 1, fever = 1, eyes = "closed", cloth = 1, dawn = 0 }) => (
  <g>
    <Room t={t} win={0.85 - dawn * 0.6} lamp={1} />
    <rect width={1920} height={1080} fill={H.night} opacity={0.5 * night * (1 - dawn)} />
    {dawn > 0 && <path d="M1340,140 L1640,140 L1900,1080 L1100,1080Z" fill="#FFD9A0" opacity={0.25 * dawn} />}
    <Kandil x={1640} y={520} s={0.9} t={t} />
    <circle cx={1640} cy={560} r={300} fill="#FFC86A" opacity={0.1 + 0.03 * Math.sin(t * 8)} />
    <YatanCocuk x={1020} y={990} s={1.1} t={t} fever={fever} eyes={eyes} cloth={cloth} />
    <Legen x={520} y={1010} s={0.9} t={t} />
  </g>
);

// kese altın
export const Kese: React.FC<{ x: number; y: number; s?: number; t?: number; open?: number }> = ({ x, y, s = 1, t = 0, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {open > 0 && Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${-90 + (i % 5) * 45},${-150 - Math.floor(i / 5) * 40 - open * 30})`} opacity={open}><ellipse rx={26} ry={26} fill="#F2C94C" stroke="#9A6A10" strokeWidth={4} /><circle r={12} fill="none" stroke="#9A6A10" strokeWidth={3} /></g>)}
    <path d="M-120,0 C-150,-90 -90,-150 -40,-160 L40,-160 C90,-150 150,-90 120,0 Q0,30 -120,0Z" fill="#7A2430" stroke={H.ln} strokeWidth={5} />
    <path d="M-60,-160 Q0,-140 60,-160" stroke={H.gold} strokeWidth={10} fill="none" />
    <path d="M0,-158 L-30,-210 M0,-158 L30,-210" stroke={H.gold} strokeWidth={8} />
    <path d="M-80,-60 Q0,-30 80,-60" stroke={H.gold} strokeWidth={5} fill="none" opacity={0.7} />
    <circle cy={-70} r={22} fill={H.gold} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
  </g>
);

// kolera İstanbul'u: liman, sarı bayraklı gemiler, boş sokak, sirke fıçıları, tabut
export const KoleraSehir: React.FC<{ t: number; k?: number; tabut?: number; sirke?: number; dusk?: number }> = ({ t, k = 0, tabut = 0, sirke = 0, dusk = 1 }) => (
  <g>
    <defs>
      <linearGradient id="dKsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? "#3A3550" : "#BFD9E8"} /><stop offset="1" stopColor={dusk ? "#C98A5A" : "#EFE3C8"} /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#dKsky)" />
    {/* siluet: camiler */}
    <g fill={dusk ? "#2A2438" : "#7A8CA0"}>
      <path d="M0,520 L1920,520 L1920,640 L0,640Z" />
      {[260, 880, 1520].map((cx, i) => <g key={i} transform={`translate(${cx},520)`}><path d="M-160,0 Q0,-200 160,0Z" /><rect x={-210} y={-20} width={420} height={40} />{[-230, 230].map((mx) => <g key={mx}><rect x={mx - 10} y={-280} width={20} height={280} /><path d={`M${mx - 14},-280 L${mx},-340 L${mx + 14},-280Z`} /></g>)}</g>)}
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={470 - (i * 37) % 60} width={110} height={60 + (i * 37) % 60} />)}
    </g>
    {/* deniz */}
    <rect y={640} width={1920} height={180} fill={dusk ? "#2E4A66" : "#4F8FB8"} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${md(i * 230 + t * 30, 2100) - 100},${680 + (i % 4) * 34} q30,-10 60,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.25} />)}
    {/* gemiler, sarı karantina bayrağı */}
    {[0, 1, 2].map((i) => {
      const gx = 300 + i * 600 + Math.sin(t * 0.5 + i) * 20, gy = 720 + Math.sin(t * 1.2 + i) * 6;
      return <g key={i} transform={`translate(${gx},${gy}) scale(${0.8 + i * 0.1})`}><path d="M-160,0 L160,0 L120,50 L-120,50Z" fill="#4A2E1E" stroke={H.ln} strokeWidth={4} /><rect x={-6} y={-220} width={12} height={220} fill="#5E3B20" /><path d="M6,-200 Q90,-140 6,-60Z" fill="#EFE3C8" stroke={H.ln} strokeWidth={3} /><path d={`M-6,-220 l-70,${12 + Math.sin(t * 6 + i) * 6} l70,24Z`} fill="#F2C94C" stroke={H.ln} strokeWidth={3} /></g>;
    })}
    {/* rıhtım ve sokak */}
    <rect y={820} width={1920} height={260} fill={dusk ? "#5A4A44" : "#B8A68A"} />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={(i % 12) * 160 + (i > 11 ? 80 : 0)} y={840 + (i > 11 ? 110 : 0)} width={150} height={100} fill="none" stroke="#00000022" strokeWidth={3} />)}
    {sirke > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${1400 + i * 150},1020)`} opacity={sirke}><path d="M-60,0 Q-74,-80 -60,-160 L60,-160 Q74,-80 60,0Z" fill="#8A5A34" stroke={H.ln} strokeWidth={4} /><rect x={-66} y={-120} width={132} height={10} fill="#3A2A20" /><rect x={-66} y={-50} width={132} height={10} fill="#3A2A20" /></g>)}
    {sirke > 0 && <g transform="translate(1550,820)" opacity={sirke}><rect x={-120} y={-36} width={240} height={60} rx={10} fill="#FFFDF4" stroke={H.ln} strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill={H.red}>SİRKE</text></g>}
    {tabut > 0 && <g transform={`translate(${lerp(-300, 900, cl(k))},960)`} opacity={tabut}>{[-130, -40, 50, 140].map((px, i) => <g key={i} transform={`translate(${px},${Math.sin(t * 6 + i) * 4})`}><HTiny x={0} y={60} s={1.4} c="#3A3A3A" /></g>)}<rect x={-190} y={-120} width={380} height={60} rx={14} fill="#2E6A3A" stroke={H.ln} strokeWidth={4} /><path d="M-170,-110 L170,-110" stroke={H.gold} strokeWidth={6} /></g>}
    {dusk > 0 && <rect width={1920} height={1080} fill="#1A1430" opacity={0.25} />}
  </g>
);

// saray bahçesi: servi, çınar, havuz, çiçek
export const Bahce: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#E9B98A" : "#CFE6F0"} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={md(300 + i * 700 + t * 12, 2300) - 200} cy={150 + i * 40} rx={160} ry={40} fill="#FFFFFF" opacity={0.7} />)}
    <path d="M0,560 L1920,560 L1920,640 L0,640Z" fill="#E2CFA9" />
    {Array.from({ length: 12 }, (_, i) => <g key={i}><rect x={i * 170 + 20} y={420} width={30} height={160} fill="#EFE3C8" stroke={H.ln} strokeWidth={3} /><path d={`M${i * 170 + 35},420 m-60,0 q60,-90 120,0`} fill="none" stroke={H.cobalt} strokeWidth={8} /></g>)}
    <rect y={600} width={1920} height={480} fill="#8DBA6A" />
    <path d="M760,1080 L900,600 L1020,600 L1160,1080Z" fill="#E2CFA9" />
    {/* serviler */}
    {[140, 420, 1500, 1780].map((cx, i) => <g key={i} transform={`translate(${cx},700) rotate(${Math.sin(t * 0.8 + i) * 1.5})`}><rect x={-10} y={-20} width={20} height={60} fill="#5E3B20" /><path d="M0,-420 C70,-300 80,-120 50,-20 L-50,-20 C-80,-120 -70,-300 0,-420Z" fill="#2F5A3A" stroke="#1F3E28" strokeWidth={4} /></g>)}
    {/* havuz */}
    <g transform="translate(1340,860)"><ellipse rx={240} ry={70} fill="#EFE3C8" stroke={H.ln} strokeWidth={5} /><ellipse rx={210} ry={56} fill="#6FB3D8" />{[0, 1, 2].map((i) => <ellipse key={i} rx={40 + md(t * 40 + i * 50, 150)} ry={(40 + md(t * 40 + i * 50, 150)) * 0.27} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={1 - md(t * 40 + i * 50, 150) / 150} />)}<rect x={-12} y={-90} width={24} height={60} fill={H.gold} /><path d={`M0,-90 q-40,${-30 - Math.sin(t * 5) * 6} -70,40 M0,-90 q40,${-30 - Math.sin(t * 5) * 6} 70,40`} stroke="#BFE6F2" strokeWidth={6} fill="none" /></g>
    {/* çiçekler */}
    {Array.from({ length: 22 }, (_, i) => { const fx = 40 + (i * 89) % 1840, fy = 900 + (i * 53) % 160; return fx > 720 && fx < 1200 ? null : <g key={i} transform={`translate(${fx},${fy}) rotate(${Math.sin(t * 2 + i) * 5})`}><path d="M0,0 V-50" stroke="#3F6B33" strokeWidth={5} /><path d="M-16,-50 Q-18,-80 -8,-84 L0,-72 L8,-84 Q18,-80 16,-50 Q0,-40 -16,-50Z" fill={[H.red, "#E9B23A", "#D98CB0", "#FFFFFF"][i % 4]} stroke={H.ln} strokeWidth={2} /></g>; })}
    {dusk > 0 && <rect width={1920} height={1080} fill="#E89B2A" opacity={0.12} />}
  </g>
);

// mum ışığında ders: karanlık oda, rahle, kâğıt, harfler
export const MumDers: React.FC<{ t: number; k?: number; letters?: string[]; night?: number }> = ({ t, k = 1, letters = ["ا", "ب", "ت", "ث"], night = 1 }) => {
  const fl = Math.sin(t * 11) * 0.06 + Math.sin(t * 7.3) * 0.04;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#1E1626" : "#EFE3C8"} />
      <rect width={1920} height={1080} fill="url(#hTile)" opacity={0.12} />
      <rect y={820} width={1920} height={260} fill={night ? "#3A2A2A" : "#D8C7A4"} />
      <circle cx={960} cy={640} r={560} fill="#FFC86A" opacity={(0.2 + fl) * night} />
      {/* rahle */}
      <g transform="translate(960,900)">
        <path d="M-260,0 L-200,-90 L200,-90 L260,0Z" fill="#8A5A34" stroke={H.ln} strokeWidth={5} />
        <path d="M-220,-90 L-180,-170 L180,-170 L220,-90Z" fill="#6E4426" stroke={H.ln} strokeWidth={5} />
        <g transform="translate(0,-130) skewX(-6)"><rect x={-150} y={-60} width={300} height={110} fill="#FFFDF4" stroke={H.ln} strokeWidth={3} />
          {letters.map((l, i) => <text key={i} x={110 - i * 72} y={18} textAnchor="middle" fontFamily="serif" fontSize={56} fill="#2A2A2A" opacity={cl(k * letters.length - i)}>{l}</text>)}
        </g>
      </g>
      {/* mum */}
      <g transform="translate(1240,860)">
        <rect x={-22} y={-140} width={44} height={140} rx={6} fill="#FFF4D6" stroke={H.ln} strokeWidth={4} />
        <path d={`M0,-140 Q${-18 + fl * 60},-190 0,${-230 - fl * 40} Q${18 + fl * 60},-190 0,-140Z`} fill="#FFB43A" />
        <path d="M0,-150 Q-8,-175 0,-195 Q8,-175 0,-150Z" fill="#FFF3B0" />
        <ellipse cy={0} rx={60} ry={14} fill={H.gold} stroke={H.ln} strokeWidth={3} />
      </g>
    </g>
  );
};

// divan kitabı
export const DivanKitap: React.FC<{ x?: number; y?: number; s?: number; t: number; k?: number; title?: string }> = ({ x = 960, y = 560, s = 1, t, k = 1, title = "ADİLE SULTAN DİVANI" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={300} rx={620} ry={40} fill="#000" opacity={0.2} />
    <path d="M0,-280 C-200,-320 -420,-300 -600,-260 L-600,280 C-420,240 -200,240 0,280Z" fill="#FFFAEE" stroke={H.ln} strokeWidth={6} />
    <path d="M0,-280 C200,-320 420,-300 600,-260 L600,280 C420,240 200,240 0,280Z" fill="#FBF3E2" stroke={H.ln} strokeWidth={6} />
    <path d="M0,-280 V280" stroke={H.ln} strokeWidth={6} />
    {[-1, 1].map((d) => <rect key={d} x={d > 0 ? 60 : -540} y={-230} width={480} height={460} fill="none" stroke={H.gold} strokeWidth={6} rx={10} />)}
    {Array.from({ length: 7 }, (_, i) => [-1, 1].map((d) => <path key={`${i}${d}`} d={`M${d > 0 ? 100 : -500},${-170 + i * 62} q100,${-14 + (i % 2) * 8} 200,0 t200,0`} stroke="#3A2A20" strokeWidth={5} fill="none" opacity={cl(k * 7 - i)} />))}
    <text y={-320} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill={H.ln}>{title}</text>
    {[0, 1, 2].map((i) => <circle key={i} cx={-300 + i * 300} cy={-260 - md(t * 20 + i * 30, 80)} r={6} fill={H.gold} opacity={1 - md(t * 20 + i * 30, 80) / 80} />)}
  </g>
);

// düğün alayı: çeyiz sandıkları başlarda, bayraklar, araba
export const DugunAlay: React.FC<{ t: number; k?: number; crowd?: number }> = ({ t, k = 0, crowd = 1 }) => {
  const px = lerp(0, -900, k);
  return (
    <g>
      <rect width={1920} height={1080} fill="#BFD9E8" />
      <rect y={380} width={1920} height={260} fill="#E2CFA9" />
      {Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${i * 200},380)`}><path d="M20,0 V-140 Q100,-200 180,-140 V0Z" fill="#EFE3C8" stroke={H.ln} strokeWidth={4} /><rect x={70} y={-110} width={60} height={80} rx={30} fill={H.cobalt} opacity={0.6} /></g>)}
      {/* bayraklar ipte */}
      <path d="M0,240 Q960,320 1920,240" stroke={H.ln} strokeWidth={3} fill="none" />
      {Array.from({ length: 24 }, (_, i) => { const fx = i * 82, fy = 240 + Math.sin((fx / 1920) * Math.PI) * 76; return <path key={i} d={`M${fx},${fy} l20,${44 + Math.sin(t * 4 + i) * 6} l20,-44Z`} fill={[H.red, H.gold, H.cobalt, H.turq][i % 4]} />; })}
      <rect y={640} width={1920} height={440} fill="#D8C7A4" />
      <g transform={`translate(${md(px, 1) + px},0)`}>
        {Array.from({ length: 14 }, (_, i) => {
          const wx = 200 + i * 230, bob = Math.abs(Math.sin(t * 5 + i)) * 10;
          return <g key={i} transform={`translate(${wx},${900 - bob})`}>
            <HTiny x={0} y={60} s={2.4} c={["#5E3B20", "#2B4A8A", "#6A4A2A", "#3A5A3A"][i % 4]} />
            {i % 3 !== 2 ? <g transform="translate(0,-180)"><rect x={-60} y={-50} width={120} height={50} rx={6} fill={["#8A4A2A", "#5B3A86", "#2E6A3A"][i % 3]} stroke={H.ln} strokeWidth={3} /><rect x={-60} y={-60} width={120} height={14} rx={6} fill={H.gold} /></g>
              : <g transform="translate(20,-200)"><rect x={-4} y={-60} width={8} height={160} fill="#5E3B20" /><path d={`M4,-60 l90,${16 + Math.sin(t * 6 + i) * 8} l-90,30Z`} fill={H.red} /></g>}
          </g>;
        })}
      </g>
      {crowd > 0 && Array.from({ length: 16 }, (_, i) => <HTiny key={i} x={60 + i * 120} y={1080} s={2} c={["#C2477A", "#2B5DA8", "#E9B23A", "#5B3A86"][i % 4]} />)}
    </g>
  );
};

// gelin duvağı: HFig'in başına kırmızı tül ve altın tel
export const Duvak: React.FC<{ x: number; y: number; s?: number; t: number; op?: number }> = ({ x, y, s = 1, t, op = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
    <path d={`M-90,-470 C-160,-380 -170,-180 ${-190 + Math.sin(t * 1.4) * 8},-20 L${190 + Math.sin(t * 1.4 + 1) * 8},-20 C170,-180 160,-380 90,-470 Q0,-520 -90,-470Z`} fill="#D0283A" opacity={0.42} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-60 + i * 15},-480 Q${-70 + i * 18 + Math.sin(t * 2 + i) * 5},-300 ${-80 + i * 20},-160`} stroke="#F2C94C" strokeWidth={3} fill="none" opacity={0.8} />)}
    <path d="M-80,-470 Q0,-510 80,-470" stroke={H.gold} strokeWidth={10} fill="none" />
    {[-50, 0, 50].map((px) => <circle key={px} cx={px} cy={-488} r={8} fill="#FFFFFF" />)}
  </g>
);

// 1826: gece şehir üstünde top ateşi
export const TopGece: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const dt = t - a;
  return (
    <g>
      <rect width={1920} height={1080} fill="#16142A" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 400} r={2} fill="#FFFFFF" opacity={0.5} />)}
      <g fill="#0C0A18">{Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 125} y={600 - (i * 53) % 140} width={110} height={500} />)}<path d="M760,600 Q960,380 1160,600Z" />{[700, 1220].map((mx) => <rect key={mx} x={mx} y={300} width={22} height={300} />)}</g>
      {[0, 1, 2, 3].map((i) => { const ph = md(dt * 0.9 + i * 0.37, 1); return <g key={i}><circle cx={300 + i * 440} cy={560 - (i % 2) * 60} r={40 + ph * 260} fill="#FF9A3A" opacity={(1 - ph) * 0.5} /><circle cx={300 + i * 440} cy={560 - (i % 2) * 60} r={30 * (1 - ph)} fill="#FFF3B0" opacity={1 - ph} /></g>; })}
      <rect width={1920} height={1080} fill="#FF7A2A" opacity={0.08 + 0.06 * Math.sin(t * 9)} />
    </g>
  );
};

// küçük mezarlık: servi ve şahideler
export const Mezarlik: React.FC<{ t: number; n?: number; fog?: number }> = ({ t, n = 9, fog = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#9AA8B8" />
    <rect y={620} width={1920} height={460} fill="#6E7E5A" />
    {[220, 760, 1400, 1760].map((cx, i) => <g key={i} transform={`translate(${cx},720) rotate(${Math.sin(t * 0.6 + i) * 1})`}><path d="M0,-480 C80,-330 90,-130 56,-20 L-56,-20 C-90,-130 -80,-330 0,-480Z" fill="#2F4A3A" /></g>)}
    {Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${200 + i * 190},${860 + (i % 3) * 50})`}><rect x={-24} y={-130} width={48} height={130} rx={10} fill="#E9E2D2" stroke={H.ln} strokeWidth={3} /><ellipse cy={-138} rx={30} ry={20} fill="#E9E2D2" stroke={H.ln} strokeWidth={3} /></g>)}
    {fog > 0 && [0, 1].map((i) => <ellipse key={i} cx={md(i * 900 + t * 30, 2600) - 300} cy={900 + i * 60} rx={700} ry={70} fill="#FFFFFF" opacity={0.25 * fog} />)}
  </g>
);
