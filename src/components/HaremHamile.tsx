import React from "react";
import { P } from "./HaremPro";

// Kanal 1 · k3r-13 ek nesneler (HaremPro ölçeği ve renkleri): şerbet, saksı, doğum sandalyesi, nazarlık, kurdele, saray penceresi.
const LN = "#4A3524";

// kırmızı karanfilli şerbet bardağı (kristal, altın kenar)
export const Serbet: React.FC<{ t?: number; s?: number; level?: number; glow?: number }> = ({ t = 0, s = 1, level = 1, glow = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0 && <circle cx={0} cy={-34} r={70} fill="#FF5A4A" opacity={0.18 * glow * (0.8 + 0.2 * Math.sin(t * 3))} />}
    <path d="M-24,-74 L-18,-6 Q0,4 18,-6 L24,-74Z" fill="#F4F7FA" fillOpacity={0.55} stroke={LN} strokeWidth={2.4} />
    {level > 0 && <path d={`M${-23 + 6 * (1 - level)},${-6 - 62 * level} L-18,-6 Q0,4 18,-6 L${23 - 6 * (1 - level)},${-6 - 62 * level}Z`} fill="#B8242C" opacity={0.9} />}
    {level > 0 && <ellipse cx={0} cy={-6 - 62 * level} rx={22 - 6 * (1 - level)} ry={4} fill="#D8404A" />}
    <path d="M-14,-66 L-11,-14" stroke="#FFFFFF" strokeWidth={4} opacity={0.55} strokeLinecap="round" />
    <path d="M-25,-74 Q0,-68 25,-74" stroke={P.gold} strokeWidth={4} fill="none" />
    <ellipse cx={0} cy={-2} rx={26} ry={6} fill={P.gold} stroke={LN} strokeWidth={2} />
    {/* karanfil */}
    <g transform="translate(20,-80) rotate(30)"><path d="M0,0 L0,-14" stroke="#5A2A14" strokeWidth={3} /><circle cx={0} cy={-16} r={4} fill="#5A2A14" /></g>
  </g>
);

// gümüş tepsi üstünde şerbet
export const SerbetTepsi: React.FC<{ t?: number; glow?: number }> = ({ t = 0, glow = 0 }) => (
  <g>
    <ellipse cx={0} cy={6} rx={92} ry={17} fill="#B9BEC6" stroke={LN} strokeWidth={2.5} />
    <ellipse cx={0} cy={2} rx={80} ry={12} fill="#DCE0E6" />
    <path d="M-70,2 q70,10 140,0" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} />
    <g transform="translate(0,0)"><Serbet t={t} s={0.9} glow={glow} /></g>
    <path d="M-60,-4 l10,-6 l6,8Z M48,-2 l8,-8 l6,6Z" fill="#5A2A14" />
  </g>
);

// pencere önünde sardunya saksısı; pour>0 → şerbet dökülüyor; wilt → (kullanılmaz: sardunya hep yeşil)
export const Saksi: React.FC<{ x: number; y: number; s?: number; t?: number; pour?: number }> = ({ x, y, s = 1, t = 0, pour = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* yapraklar */}
    {[-50, -24, 0, 26, 50].map((dx, i) => <circle key={i} cx={dx} cy={-120 - (i % 2) * 24 + Math.sin(t * 1.2 + i) * 2} r={30} fill={i % 2 ? "#5E8C4A" : "#4E7A3E"} stroke={LN} strokeWidth={2} />)}
    {[-30, 6, 38].map((dx, i) => (
      <g key={i} transform={`translate(${dx},${-170 - (i % 2) * 20})`}>
        {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={Math.sin((a * Math.PI) / 180) * 9} r={8} fill="#D9364A" stroke={LN} strokeWidth={1.2} />)}
        <circle r={4} fill="#F2C14E" />
      </g>
    ))}
    {/* saksı */}
    <path d="M-70,-90 L70,-90 L56,0 L-56,0Z" fill="#B8603A" stroke={LN} strokeWidth={3} />
    <path d="M-76,-104 L76,-104 L72,-86 L-72,-86Z" fill="#C9744A" stroke={LN} strokeWidth={3} />
    <path d="M-40,-60 q40,16 80,0" stroke="#2B5DA8" strokeWidth={5} fill="none" opacity={0.7} />
    {pour > 0 && <path d={`M60,${-320} C40,-250 20,-190 10,${-110}`} stroke="#B8242C" strokeWidth={10 * pour} fill="none" strokeLinecap="round" opacity={0.9} />}
  </g>
);

// ahşap doğum sandalyesi (kolçaklı, oturağı ortası açık)
export const DogumSandalye: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={190} ry={22} fill="#1E0E04" opacity={0.3} />
    {[-120, 120].map((dx) => <path key={dx} d={`M${dx - 12},0 L${dx - 8},-200 L${dx + 8},-200 L${dx + 12},0Z`} fill="#8A5A34" stroke={LN} strokeWidth={3} />)}
    <path d="M-130,-380 C-130,-430 130,-430 130,-380 L130,-200 L-130,-200Z" fill="#9A6A40" stroke={LN} strokeWidth={3} />
    <path d="M-100,-370 C-100,-400 100,-400 100,-370 L100,-230 L-100,-230Z" fill="#7A4A2A" stroke={LN} strokeWidth={2} />
    {[0, 1, 2].map((i) => <path key={i} d={`M-80,${-340 + i * 36} Q0,${-356 + i * 36} 80,${-340 + i * 36}`} stroke="#B8844E" strokeWidth={4} fill="none" />)}
    {/* oturak: ortası açık (U) */}
    <path d="M-150,-200 L150,-200 L150,-170 L-150,-170Z" fill="#A8764A" stroke={LN} strokeWidth={3} />
    <path d="M-60,-200 C-60,-150 60,-150 60,-200" fill="#3A2214" stroke={LN} strokeWidth={2} />
    {/* kolçaklar */}
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 130},-300 L${sd * 190},-290 L${sd * 190},-270 L${sd * 130},-278Z`} fill="#A8764A" stroke={LN} strokeWidth={3} />
        <path d={`M${sd * 180},-272 L${sd * 176},-200`} stroke={LN} strokeWidth={14} strokeLinecap="round" />
        <path d={`M${sd * 180},-272 L${sd * 176},-200`} stroke="#8A5A34" strokeWidth={9} strokeLinecap="round" />
        <circle cx={sd * 190} cy={-282} r={12} fill={P.gold} stroke={LN} strokeWidth={2} />
      </g>
    ))}
  </g>
);

// kapı üstüne asılan mavi nazarlık
export const Nazarlik: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 1.5) * 6})`}>
    <path d="M0,0 L0,60" stroke="#C9636A" strokeWidth={4} />
    <circle cx={0} cy={110} r={50} fill="#1F4FA0" stroke={LN} strokeWidth={3} />
    <circle cx={0} cy={110} r={34} fill="#FFFFFF" />
    <circle cx={0} cy={110} r={22} fill="#6FB0E6" />
    <circle cx={0} cy={110} r={11} fill="#0E1A3A" />
    <circle cx={-12} cy={96} r={6} fill="#FFFFFF" opacity={0.8} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={176 + (i % 2) * 8} r={9} fill={i % 2 ? "#D9AE4E" : "#1F4FA0"} stroke={LN} strokeWidth={1.6} />)}
  </g>
);

// lohusa kurdelesi (yatağın başına bağlı kırmızı kurdele)
export const Kurdele: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,0 C-60,-30 -60,-50 -30,-40 L0,0 L30,-40 C60,-50 60,-30 40,0 Z" fill="#C8243A" stroke={LN} strokeWidth={2.4} />
    <path d={`M-6,4 C-20,60 ${-30 + Math.sin(t * 2) * 8},120 -24,170 M6,4 C20,60 ${30 + Math.sin(t * 2 + 1) * 8},120 24,170`} stroke="#C8243A" strokeWidth={14} fill="none" strokeLinecap="round" />
    <circle cx={0} cy={0} r={12} fill="#A01C2E" stroke={LN} strokeWidth={2} />
  </g>
);

// muska (üçgen, boyna asılı)
export const Muska: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-70,-60 Q0,40 70,-60" stroke="#5A3A1E" strokeWidth={4} fill="none" />
    <path d="M-50,20 L50,20 L0,100Z" fill="#7A2430" stroke={LN} strokeWidth={3} />
    <path d="M-36,28 L36,28 L0,86Z" fill="none" stroke={P.gold} strokeWidth={3} />
    <circle cx={0} cy={48} r={6} fill={P.gold} />
  </g>
);

// Topkapı'nın bir penceresi dışarıdan (çini kenar, kafes); içeride küçük bir el sallar (child>0)
export const SarayPencere: React.FC<{ t: number; wave?: number; children?: React.ReactNode }> = ({ t, wave = 1, children }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DCC2" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={0} y={i * 80} width={1920} height={3} fill="#CDBE9E" />)}
    {Array.from({ length: 40 }, (_, i) => <rect key={`b${i}`} x={(i % 8) * 260 + ((Math.floor(i / 8) % 2) * 130)} y={Math.floor(i / 8) * 80 + 40} width={3} height={40} fill="#CDBE9E" />)}
    <path d="M660,980 L660,420 C660,260 1260,260 1260,420 L1260,980Z" fill="#2B5DA8" stroke={LN} strokeWidth={4} />
    <path d="M700,960 L700,430 C700,300 1220,300 1220,430 L1220,960Z" fill="#FFFFFF" stroke={LN} strokeWidth={3} />
    <path d="M730,940 L730,440 C730,330 1190,330 1190,440 L1190,940Z" fill="#3A2A1E" />
    <rect x={730} y={440} width={460} height={500} fill="#FFD089" opacity={0.35} />
    {children}
    {/* kafes */}
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${730 + i * 58},440 L${730 + i * 58},940`} stroke="#6A4A2E" strokeWidth={5} opacity={0.0} />)}
    <path d="M730,940 L730,440 C730,330 1190,330 1190,440 L1190,940Z" fill="none" stroke="#6A4A2E" strokeWidth={10} />
    <path d="M620,990 L1300,990 L1300,1020 L620,1020Z" fill="#CDBE9E" stroke={LN} strokeWidth={3} />
    {/* çini bant */}
    {Array.from({ length: 12 }, (_, i) => <circle key={`c${i}`} cx={690 + i * 49} cy={1005} r={9} fill={i % 2 ? "#C8243A" : "#2B5DA8"} />)}
    <g opacity={wave > 0 ? 1 : 0} />
  </g>
);
