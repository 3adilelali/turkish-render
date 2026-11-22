import React from "react";
import { DFig, DOutfit, SKIN, CAST, _dz } from "./Dizi";
import { lerp } from "./Toon";

// Kanal 6 · k8-03 "Eşref Rüya" kiti (2026-11-22). Dizi.tsx'teki DFig üstüne: yeni kadro (genel benzerlik: ten/saç/boy/kıyafet),
// Fıstık (fıstık yeşili klasik araba: dış + iç), gece sahil yolu / gündüz Boğaz yolu, İhtiyar'ın köşkü (dış + koridor),
// hastane koridoru, ambulans içi, laptop ekranı (video / liste), flaş bellek, bebek, beşik, gençlik merkezi, yetimhane anısı, duvar saati.

const INK = "#1B1210";
const { hs } = _dz;
const clamp = (x: number) => Math.max(0, Math.min(1, x));

export const CE: Record<string, DOutfit> = {
  esref: { skin: SKIN.bugday, hair: "slick", hairColor: "#1B130E", beard: "stubble", beardColor: "#1B130E", top: "coat", c: "#16171B", c2: "#24262C", inner: "#1E1E22", pants: "#17181C", shoes: "#0E0E0E", build: 1.08 },
  esrefKan: { skin: SKIN.bugday, hair: "slick", hairColor: "#1B130E", beard: "stubble", beardColor: "#1B130E", top: "coat", c: "#16171B", c2: "#24262C", inner: "#7A1A1E", pants: "#17181C", shoes: "#0E0E0E", build: 1.08 },
  esrefHasta: { skin: "#D9B89A", hair: "slick", hairColor: "#1B130E", beard: "stubble", beardColor: "#1B130E", top: "gown", c: "#A9C7D6", c2: "#86A9BA", skirt: "#A9C7D6", shoes: "#DADADA", build: 1.05 },
  esrefYasli: { skin: SKIN.bugday, hair: "slick", hairColor: "#55504A", beard: "stubble", beardColor: "#8A847C", top: "coat", c: "#2A2420", c2: "#3A322C", inner: "#E8E2D6", pants: "#22201E", shoes: "#2A1E16", build: 1.08 },
  esrefCocuk: { skin: SKIN.bugday, hair: "messy", hairColor: "#1B130E", top: "tee", c: "#7A6A58", c2: "#5A4A3A", pants: "#3A342E", shoes: "#2A2420", build: 0.9 },
  nisan: { skin: SKIN.acik, hair: "wavy", hairColor: "#5A2A1A", top: "cardigan", c: "#D8C8B0", c2: "#B8A488", inner: "#F4EFE6", pants: "#3A3440", female: true, lips: "#B4474F", earring: true, shoes: "#2A2020" },
  nisanPalto: { skin: SKIN.acik, hair: "wavy", hairColor: "#5A2A1A", top: "coat", c: "#A0703E", c2: "#7E5630", inner: "#F4EFE6", pants: "#2A2630", female: true, lips: "#B4474F", earring: true, shoes: "#2A2020" },
  nisanCocuk: { skin: SKIN.acik, hair: "kid", hairColor: "#5A2A1A", top: "dress", c: "#C8B8D8", c2: "#A898B8", female: true, shoes: "#6A4A3A" },
  ruya: { skin: SKIN.acik, hair: "kid", hairColor: "#4A2416", top: "dress", c: "#F2C14E", c2: "#D9A030", female: true, shoes: "#E0393E" },
  ihtiyar: { skin: SKIN.bugday, hair: "grey", hairColor: "#CFCAC2", beard: "full", beardColor: "#CFCAC2", top: "suit", c: "#2B2520", c2: "#3B3129", inner: "#4A3A30", pants: "#241F1B", shoes: "#140F0C", build: 1.0 },
  faruk: { skin: SKIN.acik, hair: "short", hairColor: "#2A1E16", beard: "stubble", top: "cardigan", c: "#5E5246", c2: "#463C32", inner: "#DCD6CC", pants: "#2E3440", glasses: true, shoes: "#3A2A20" },
  gurdal: { skin: SKIN.bugday, hair: "short", hairColor: "#121010", beard: "full", beardColor: "#121010", top: "leather", c: "#3B2A1E", c2: "#2B1E15", inner: "#1E2228", pants: "#1E2228", shoes: "#121212", build: 1.24 },
  muslum: { skin: SKIN.esmer, hair: "curly", hairColor: "#22160E", beard: "stubble", top: "leather", c: "#4A5236", c2: "#363C26", inner: "#E2DACA", pants: "#2A2A30", shoes: "#1A1A1A", build: 1.06 },
  irmak: { skin: SKIN.bugday, hair: "long", hairColor: "#140E0C", top: "cardigan", c: "#7A3446", c2: "#5E2634", inner: "#EDE6DA", pants: "#2A2A34", female: true, lips: "#A3343F", shoes: "#1A1A1A" },
  kadir: { skin: SKIN.bugday, hair: "slick", hairColor: "#0F0C0A", beard: "stubble", top: "suit", c: "#262A34", c2: "#1C1F27", inner: "#121216", pants: "#1E2129", shoes: "#0E0E0E", build: 1.06 },
  kenan: { skin: SKIN.esmer, hair: "short", hairColor: "#141010", beard: "goatee", top: "leather", c: "#1A1A1C", c2: "#101012", inner: "#5A1E22", pants: "#1A1E24", shoes: "#101010", build: 1.1 },
  selma: { skin: SKIN.acik, hair: "bun", hairColor: "#6A5A50", top: "suit", c: "#34343E", c2: "#26262E", inner: "#F2F2F2", pants: "#34343E", female: true, glasses: true, lips: "#9A4A4A", shoes: "#111" },
  cigdem: { skin: SKIN.acik, hair: "pony", hairColor: "#3A2418", top: "leather", c: "#2A2E36", c2: "#1E2128", inner: "#EDEDED", pants: "#24262C", female: true, lips: "#A3434A", shoes: "#111" },
  balikci: { skin: SKIN.acik, hair: "grey", hairColor: "#A8A39A", top: "suit", c: "#2E3A46", c2: "#222C36", inner: "#E9EEF2", tie: "#1B2A3A", pants: "#2A333E", shoes: "#111", build: 1.04 },
  adam: { skin: SKIN.bugday, hair: "short", hairColor: "#141010", beard: "stubble", top: "suit", c: "#141518", c2: "#24262B", inner: "#141518", pants: "#141518", shoes: "#0A0A0A", build: 1.12 },
  doktor: { skin: SKIN.acik, hair: "short", hairColor: "#3A2A20", top: "coat", c: "#F2F4F4", c2: "#D2D8DA", inner: "#7FB0C8", pants: "#7FB0C8", shoes: "#E8E8E8", glasses: true },
  polis: { skin: SKIN.bugday, hair: "short", hairColor: "#141010", top: "uniform", c: "#1E2A4A", c2: "#C8A040", pants: "#1E2A4A", shoes: "#0E0E0E" },
  yakup: { skin: SKIN.bugday, hair: "grey", hairColor: "#8A847C", beard: "full", beardColor: "#8A847C", top: "coat", c: "#4A3E30", c2: "#3A3026", inner: "#D8CCB4", pants: "#2A2622" },
};
// merkezdeki çocuklar
export const COCUK = (i: number): DOutfit => ({ ...CAST.ada, c: ["#3A7BD5", "#F6C445", "#3FAE6A", "#E86A92", "#E0763A"][i % 5], hairColor: ["#2A1A12", "#8A5A34", "#1A1410", "#C99A5E", "#3A2418"][i % 5], hair: i % 2 ? "kid" : "short", female: i % 2 === 1 });

// ───────── eşyalar ─────────
export const FlasBellek: React.FC<{ x: number; y: number; s?: number; rot?: number; label?: boolean; glow?: number }> = ({ x, y, s = 1, rot = -8, label = true, glow = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {glow > 0 && <ellipse cx={0} cy={0} rx={190} ry={110} fill="#FFE29A" opacity={0.18 * glow} />}
    <rect x={60} y={-26} width={70} height={52} rx={4} fill="#C9CED6" stroke={INK} strokeWidth={5} />
    <rect x={78} y={-12} width={14} height={10} fill="#5A5E66" /><rect x={100} y={-12} width={14} height={10} fill="#5A5E66" />
    <rect x={-130} y={-40} width={196} height={80} rx={16} fill="#1E2A3A" stroke={INK} strokeWidth={6} />
    <circle cx={-108} cy={0} r={10} fill="none" stroke="#9AA4B0" strokeWidth={5} />
    {label && <><rect x={-84} y={-26} width={140} height={52} rx={4} fill="#F4EEDC" /><text x={-14} y={10} textAnchor="middle" fontFamily="Caveat, Poppins" fontStyle="italic" fontWeight={700} fontSize={30} fill="#2A2420">Rüya'ya</text></>}
  </g>
);
export const Kelepce: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke="#B8BEC6" strokeWidth={9}>
    <circle cx={-36} cy={0} r={26} /><circle cx={36} cy={0} r={26} /><path d="M-10,0 h20" strokeWidth={6} />
  </g>
);
export const Fincan: React.FC<{ x: number; y: number; s?: number; broken?: number }> = ({ x, y, s = 1, broken = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {broken < 0.5 ? (
      <g><path d="M-24,-30 L-18,0 L18,0 L24,-30Z" fill="#F4F0E6" stroke={INK} strokeWidth={4} /><path d="M24,-22 q16,0 12,12 q-4,8 -14,4" fill="none" stroke={INK} strokeWidth={4} /><ellipse cx={0} cy={-30} rx={24} ry={6} fill="#5A3A22" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={2} rx={34} ry={6} fill="#E8E2D6" stroke={INK} strokeWidth={3} /></g>
    ) : (
      <g>{[[-60, 6, -30], [-20, 10, 15], [30, 4, 40], [64, 12, -10]].map(([a, b, r], i) => <path key={i} d="M-12,-8 L10,-12 L14,6 L-8,10Z" fill="#F4F0E6" stroke={INK} strokeWidth={3} transform={`translate(${a * broken},${b}) rotate(${r})`} />)}<ellipse cx={0} cy={12} rx={70 * broken} ry={10 * broken} fill="#3A2216" opacity={0.7} /></g>
    )}
  </g>
);
// battaniyeye sarılı bebek (uyur / ağlar)
export const Bebek: React.FC<{ x: number; y: number; s?: number; t?: number; cry?: number; rot?: number }> = ({ x, y, s = 1, t = 0, cry = 0, rot = -20 }) => {
  const br = Math.sin(t * 2.6) * 2;
  const open = cry > 0 && Math.sin(t * 8) > -0.3;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M-90,${-10 + br} C-96,-60 -40,-78 10,-74 C70,-70 100,-40 96,0 C92,40 40,58 -10,56 C-60,54 -88,30 -90,${-10 + br}Z`} fill="#F2D6E0" stroke={INK} strokeWidth={5} />
      <path d="M-60,40 Q0,-10 80,20" stroke="#E2B6C6" strokeWidth={6} fill="none" />
      <circle cx={-46} cy={-30} r={34} fill={SKIN.acik} stroke={INK} strokeWidth={4} />
      <path d="M-72,-50 Q-50,-74 -20,-54" fill="#5A2A1A" opacity={0.8} />
      {cry > 0 ? <><path d="M-62,-34 l10,4 M-38,-34 l-10,4" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />{open ? <ellipse cx={-48} cy={-14} rx={8} ry={7} fill="#7A2A2A" /> : <path d="M-56,-14 h14" stroke={INK} strokeWidth={3} />}</> : <><path d="M-62,-32 q6,4 12,0 M-42,-32 q6,4 12,0" stroke={INK} strokeWidth={3} fill="none" /><path d="M-52,-16 q4,3 8,0" stroke="#B4474F" strokeWidth={3} fill="none" /></>}
      <ellipse cx={-66} cy={-22} rx={7} ry={4} fill="#E8737A" opacity={0.35} /><ellipse cx={-30} cy={-22} rx={7} ry={4} fill="#E8737A" opacity={0.35} />
    </g>
  );
};
export const Besik: React.FC<{ x: number; y: number; s?: number; t?: number; baby?: boolean; rock?: number }> = ({ x, y, s = 1, t = 0, baby = true, rock = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${Math.sin(t * 1.6) * 3 * rock}) scale(${s})`}>
    <path d="M-220,0 L220,0 L200,-180 L-200,-180Z" fill="#E8DCC4" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={-190 + i * 31} y={-176} width={10} height={170} fill="#C8B898" />)}
    {baby && <Bebek x={0} y={-150} s={0.9} t={t} rot={0} />}
    <path d="M-220,-180 L220,-180" stroke={INK} strokeWidth={10} />
    <path d="M-240,40 Q0,90 240,40" stroke="#B8A47E" strokeWidth={14} fill="none" />
    <path d="M-200,0 L-220,40 M200,0 L220,40" stroke="#B8A47E" strokeWidth={12} />
    {/* dönence */}
    <path d="M150,-180 V-300 H40" stroke="#B8A47E" strokeWidth={6} fill="none" />
    <g transform={`translate(40,-300) rotate(${t * 20})`}>{[0, 1, 2, 3].map((i) => <g key={i} transform={`rotate(${i * 90})`}><path d="M0,0 L60,0 V40" stroke="#9A8A70" strokeWidth={3} fill="none" /><path d="M60,40 l-14,22 h28Z" fill={["#F2C14E", "#E86A92", "#7FB3D6", "#9AD08A"][i]} stroke={INK} strokeWidth={3} /></g>)}</g>
  </g>
);
export const Saat: React.FC<{ x: number; y: number; s?: number; h: number; m: number }> = ({ x, y, s = 1, h, m }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={120} fill="#F4EEDC" stroke="#3A2A1E" strokeWidth={14} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0,-100 V-84" stroke={INK} strokeWidth={i % 3 ? 4 : 8} transform={`rotate(${i * 30})`} />)}
    <path d="M0,0 V-56" stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
    <path d="M0,0 V-88" stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${m * 6})`} />
    <circle r={9} fill="#C0392B" />
  </g>
);
// laptop: mode "video" (Eşref'in vedası) / "liste" (İhtiyar'ın devletteki adamları)
export const Laptop: React.FC<{ x: number; y: number; s?: number; t: number; mode: "video" | "liste"; hl?: number; scroll?: number; talk?: boolean }> = ({ x, y, s = 1, t, mode, hl = 0, scroll = 0, talk = false }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-460,250 L460,250 L520,300 L-520,300Z" fill="#9AA0A8" stroke={INK} strokeWidth={6} />
    <rect x={-440} y={-300} width={880} height={550} rx={20} fill="#2A2E36" stroke={INK} strokeWidth={6} />
    <rect x={-410} y={-270} width={820} height={490} fill={mode === "video" ? "#1A1E26" : "#F4F6F8"} />
    {mode === "video" ? (
      <g>
        <rect x={-410} y={-270} width={820} height={490} fill="#2A241E" />
        <rect x={-300} y={-270} width={600} height={490} fill="#3A3028" />
        <defs><clipPath id="lapScr"><rect x={-410} y={-270} width={820} height={490} /></clipPath></defs><g clipPath="url(#lapScr)"><g transform="translate(0,860)"><DFig x={0} y={0} s={2} o={CE.esref} t={t} talk={talk} eyes="sad" mouth="smile" seed={7} /></g></g>
        <circle cx={-370} cy={-236} r={10} fill="#E0393E" opacity={0.5 + 0.5 * Math.sin(t * 5)} />
        <text x={-350} y={-226} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#FFFFFF">REC · 07:42</text>
        <rect x={-410} y={190} width={820} height={30} fill="#000" opacity={0.5} /><rect x={-400} y={202} width={800 * ((t * 0.02) % 1)} height={6} fill="#E0393E" />
      </g>
    ) : (
      <g>
        <rect x={-410} y={-270} width={820} height={60} fill="#1B2A3A" />
        <text x={-390} y={-230} fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#FFFFFF">İHTİYAR · DEVLETTEKİ ADAMLAR</text>
        <g transform={`translate(0,${-scroll * 300})`}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const y0 = -190 + i * 92, on = i === 0 ? hl : 0;
            return (
              <g key={i}>
                <rect x={-400} y={y0} width={800} height={82} fill={on ? "#FFE4A8" : i % 2 ? "#E8ECF0" : "#F4F6F8"} />
                <rect x={-390} y={y0 + 8} width={66} height={66} fill="#B8C0CA" stroke={INK} strokeWidth={2} />
                {i === 0 ? <g transform={`translate(-357,${y0 + 82}) scale(0.16)`}><DFig x={0} y={0} o={CE.balikci} t={t} seed={3} /></g> : <circle cx={-357} cy={y0 + 34} r={18} fill="#8A929C" />}
                <rect x={-300} y={y0 + 18} width={i === 0 ? 0 : 200 + hs(i) * 160} height={16} rx={4} fill="#5A6470" opacity={0.6} />
                {i === 0 && <text x={-300} y={y0 + 34} fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#1B2A3A">BALIKÇI</text>}
                <rect x={-300} y={y0 + 48} width={300 + hs(i + 3) * 120} height={12} rx={4} fill="#9AA4B0" opacity={0.6} />
                <text x={340} y={y0 + 50} textAnchor="end" fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#C0392B">{["₺ 48.000.000", "₺ 12.400.000", "₺ 9.100.000", "₺ 7.750.000", "₺ 5.300.000", "₺ 3.900.000", "₺ 2.200.000"][i]}</text>
              </g>
            );
          })}
        </g>
        {hl > 0 && <rect x={-404} y={-194} width={808} height={90} fill="none" stroke="#E0393E" strokeWidth={8} opacity={hl} />}
      </g>
    )}
  </g>
);

// ───────── Fıstık: klasik coupé (fıstık yeşili) ─────────
export const Fistik: React.FC<{ x: number; y: number; s?: number; t?: number; dir?: 1 | -1; lights?: number; door?: number; roll?: number; who?: React.ReactNode; who2?: React.ReactNode; tail?: number }> = ({ x, y, s = 1, t = 0, dir = 1, lights = 0, door = 0, roll = 0, who, who2, tail = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    {lights > 0 && <path d="M400,-120 L1300,-260 L1300,40 Z" fill="#FFF3C0" opacity={0.18 * lights} />}
    <ellipse cx={0} cy={6} rx={430} ry={22} fill="#000" opacity={0.3} />
    {/* gövde */}
    <path d="M-420,-70 L-420,-140 Q-410,-170 -360,-176 L-200,-186 L-120,-270 Q-100,-290 -60,-292 L150,-292 Q200,-290 230,-262 L310,-190 L400,-180 Q440,-170 440,-130 L440,-70 Q440,-40 400,-40 L-390,-40 Q-420,-40 -420,-70Z" fill="#8FBF6A" stroke={INK} strokeWidth={7} />
    <path d="M-420,-110 L440,-110" stroke="#6E9E4C" strokeWidth={10} />
    <path d="M-410,-96 L436,-96" stroke="#E8ECEE" strokeWidth={6} />
    {/* camlar */}
    <path d="M-180,-188 L-108,-262 Q-96,-274 -70,-274 L40,-274 L40,-188Z" fill="#1E3350" stroke={INK} strokeWidth={5} />
    <path d="M60,-274 L146,-274 Q182,-272 206,-250 L272,-188 L60,-188Z" fill="#1E3350" stroke={INK} strokeWidth={5} />
    <g clipPath="url(#fistikCam)">{who}{who2}</g>
    <clipPath id="fistikCam"><path d="M-180,-188 L-108,-262 Q-96,-274 -70,-274 L40,-274 L40,-188Z M60,-274 L146,-274 Q182,-272 206,-250 L272,-188 L60,-188Z" /></clipPath>
    <path d="M-150,-250 L-60,-250" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={6} />
    {/* kapı */}
    <g transform={`translate(-190,-186) rotate(${-door * 28},0,0)`}><path d="M0,0 L250,0 L250,140 L10,140Z" fill="none" stroke={INK} strokeWidth={5} /><rect x={200} y={30} width={34} height={8} rx={3} fill="#D8DCE0" /></g>
    {/* farlar */}
    <circle cx={420} cy={-140} r={22} fill={lights > 0 ? "#FFF3C0" : "#DDE6E8"} stroke={INK} strokeWidth={5} />
    {lights > 0 && <circle cx={420} cy={-140} r={50} fill="#FFF3C0" opacity={0.3 * lights} />}
    <rect x={-424} y={-150} width={20} height={30} rx={4} fill={tail > 0 ? "#FF3030" : "#9A2A2A"} stroke={INK} strokeWidth={4} />
    {tail > 0 && <circle cx={-430} cy={-135} r={40} fill="#FF3030" opacity={0.25 * tail} />}
    <rect x={380} y={-70} width={66} height={16} rx={6} fill="#D8DCE0" stroke={INK} strokeWidth={4} /><rect x={-436} y={-70} width={60} height={16} rx={6} fill="#D8DCE0" stroke={INK} strokeWidth={4} />
    {/* tekerler */}
    {[-250, 270].map((xx) => <g key={xx} transform={`translate(${xx},-40) rotate(${roll * 360})`}><circle r={66} fill="#141414" stroke={INK} strokeWidth={5} /><circle r={36} fill="#D8DCE0" stroke={INK} strokeWidth={4} />{[0, 60, 120].map((a) => <path key={a} d="M-30,0 H30" stroke="#8A9098" strokeWidth={5} transform={`rotate(${a})`} />)}<circle r={9} fill="#5A5E66" /></g>)}
  </g>
);
// arabanın içi (yolcu koltuğundan şoföre bakış): who = şoför (DFig, büyük), sea=dışarıda akan ışıklar
export const FistikIc: React.FC<{ t: number; who?: React.ReactNode; night?: number; speed?: number; glove?: number; rain?: number; phone?: number; day?: number; back?: React.ReactNode }> = ({ t, who, night = 1, speed = 0, glove = 0, rain = 0, phone = 0, day = 0, back }) => (
  <g>
    <rect width={1920} height={1080} fill={day ? "#9FD3EC" : "#0B1426"} />
    {/* dışarısı (arka cam/yan cam) */}
    <g>
      {!day && Array.from({ length: 24 }, (_, i) => { const X = ((i * 211 - t * speed * 900) % 2400 + 2400) % 2400 - 240; return <circle key={i} cx={X} cy={300 + hs(i) * 160} r={4 + hs(i + 2) * 5} fill={i % 4 ? "#FFD27A" : "#9FD0EC"} opacity={0.7} />; })}
      <rect y={460} width={1920} height={160} fill={day ? "#3A7EB0" : "#0E2440"} />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 230 - t * (speed + 0.05) * 600) % 2300 + 2300) % 2300 - 200},${500 + (i % 3) * 30} h60`} stroke={day ? "#E8F4FA" : "#FFD27A"} strokeOpacity={0.4} strokeWidth={3} />)}
      {day ? <path d="M0,440 Q300,400 700,430 T1400,420 T1920,430 L1920,470 L0,470Z" fill="#5E7F96" /> : null}
    </g>
    {back}
    {/* tavan ve pervaz */}
    <rect width={1920} height={140} fill="#2A2620" />
    <path d="M0,140 L1920,140 L1920,180 L0,180Z" fill="#3A342C" />
    <rect x={-20} y={140} width={150} height={760} fill="#3A342C" /><rect x={1790} y={140} width={150} height={760} fill="#3A342C" />
    {rain > 0 && Array.from({ length: 50 }, (_, i) => <ellipse key={i} cx={hs(i) * 1920} cy={180 + ((hs(i + 3) * 500 + t * 40 * hs(i + 5)) % 500)} rx={4} ry={6} fill="#CFE3F2" opacity={0.4 * rain} />)}
    {who}
    {/* direksiyon + torpido */}
    <path d="M0,820 Q960,700 1920,820 L1920,1080 L0,1080Z" fill="#4A3A2A" stroke={INK} strokeWidth={6} />
    <path d="M0,860 Q960,750 1920,860" stroke="#6A5440" strokeWidth={10} fill="none" />
    <g transform="translate(1440,880)"><rect x={-90} y={-36} width={180} height={60} rx={8} fill="#2A2420" stroke={INK} strokeWidth={4} /><rect x={-70} y={-24} width={90} height={22} fill={night ? "#3FE07A" : "#9AD08A"} opacity={0.7} /><circle cx={56} cy={-6} r={14} fill="#8A7A60" /></g>
    <g transform="translate(1180,940)">
      <path d={`M-170,-40 L170,-40 L170,${-40 + glove * 120} L-170,${-40 + glove * 120}Z`} fill="#1A1410" />
      <g transform={`translate(0,${glove * 110}) `}><rect x={-170} y={-60} width={340} height={30} rx={6} fill="#5A4836" stroke={INK} strokeWidth={4} /><rect x={-20} y={-54} width={40} height={14} rx={4} fill="#C8B48A" /></g>
      {glove > 0.4 && <g opacity={clamp((glove - 0.4) * 2)}><FlasBellek x={-30} y={20} s={0.45} rot={-6} glow={glove} /></g>}
    </g>
    <g transform={`translate(560,820) rotate(${Math.sin(t * 0.9) * 2 * speed})`}><circle r={240} fill="none" stroke="#2A1E14" strokeWidth={34} /><circle r={240} fill="none" stroke={INK} strokeWidth={4} /><path d="M-230,0 H230 M0,0 V240" stroke="#2A1E14" strokeWidth={26} /><circle r={50} fill="#C8B48A" stroke={INK} strokeWidth={5} /></g>
    {phone > 0 && <g transform="translate(980,1000) rotate(-12)"><rect x={-60} y={-110} width={120} height={200} rx={16} fill="#111" stroke={INK} strokeWidth={4} /><rect x={-50} y={-96} width={100} height={170} rx={8} fill="#1E8E4A" opacity={0.6 + 0.4 * Math.sin(t * 8)} /><text x={0} y={-30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#FFF">NİSAN</text><circle cx={0} cy={30} r={22} fill="#FFF" opacity={0.8} /></g>}
    <rect width={1920} height={1080} fill={night ? "#0A1426" : "#FFF6DA"} opacity={night ? 0.22 : 0.05} />
  </g>
);

// ───────── mekânlar ─────────
// Sahil yolu: gece (ıssız, korkuluk, sokak lambaları, uzakta köprü) / gündüz Boğaz yolu. px = kaydırma
export const SahilYolu: React.FC<{ t: number; day?: number; px?: number; fog?: number }> = ({ t, day = 0, px = 0, fog = 0 }) => {
  const sky = day ? "url(#tSkyDay)" : "url(#tSkyNight)";
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {!day && Array.from({ length: 50 }, (_, i) => <circle key={i} cx={hs(i) * 1920} cy={hs(i + 7) * 280} r={1.2 + hs(i + 2) * 1.6} fill="#FFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 1.3 + i))} />)}
      {!day && <circle cx={1580} cy={140} r={46} fill="#F4F0DC" opacity={0.9} />}
      {day ? [0, 1, 2].map((i) => <ellipse key={i} cx={((i * 700 + t * 10) % 2400) - 200} cy={110 + i * 46} rx={150} ry={34} fill="#FFF" opacity={0.85} />) : null}
      {/* karşı kıyı + köprü */}
      <g transform={`translate(${-px * 0.15},0)`}>
        <path d="M-200,420 L100,380 L300,396 L520,360 L760,384 L1000,350 L1260,378 L1500,356 L1800,380 L2200,370 L2200,470 L-200,470Z" fill={day ? "#6E8E5A" : "#16233A"} />
        {Array.from({ length: 60 }, (_, i) => <rect key={i} x={-180 + hs(i) * 2300} y={384 + hs(i + 1) * 70} width={6} height={6} fill="#FFD27A" opacity={day ? 0 : 0.8} />)}
        {day && Array.from({ length: 26 }, (_, i) => <rect key={i} x={-150 + i * 92} y={396 + hs(i) * 40} width={40 + hs(i + 3) * 30} height={30 + hs(i + 5) * 30} fill={["#F2EEE6", "#E8C8A0", "#D8A890", "#F4E2C0"][i % 4]} stroke={INK} strokeWidth={2} />)}
        <g transform="translate(1300,0)">
          <path d="M-520,300 L520,300" stroke={day ? "#C8CED4" : "#6A7A90"} strokeWidth={10} />
          {[-360, 360].map((xx) => <path key={xx} d={`M${xx},300 V150`} stroke={day ? "#D8DCE0" : "#5A6A80"} strokeWidth={16} />)}
          <path d="M-520,300 Q-360,150 0,280 Q360,150 520,300" stroke={day ? "#D8DCE0" : "#5A6A80"} strokeWidth={5} fill="none" />
          {!day && Array.from({ length: 24 }, (_, i) => <circle key={i} cx={-500 + i * 43} cy={300} r={4} fill={["#C06AE0", "#5AB0FF", "#FFD27A"][Math.floor(t * 0.5 + i / 8) % 3]} />)}
        </g>
      </g>
      {/* deniz */}
      <rect y={460} width={1920} height={240} fill={day ? "#2E78B0" : "#0E2440"} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${((i * 97 + t * 14 - px * 0.4) % 2000 + 2000) % 2000 - 40},${490 + (i % 7) * 30} h${30 + (i % 4) * 22}`} stroke={day ? "#E8F4FA" : "#FFD27A"} strokeOpacity={day ? 0.5 : 0.35} strokeWidth={3} />)}
      {/* korkuluk + lambalar */}
      <g transform={`translate(${-(px % 300)},0)`}>
        <path d="M-300,700 H2400" stroke="#9AA0A8" strokeWidth={12} /><path d="M-300,730 H2400" stroke="#7A8088" strokeWidth={8} />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-300 + i * 300} y={700} width={14} height={60} fill="#7A8088" />)}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`translate(${-150 + i * 600},700)`}>
            <path d="M0,0 V-420 Q0,-450 40,-450 H90" stroke="#3A3E44" strokeWidth={12} fill="none" />
            <path d="M70,-456 h50 l-8,14 h-34Z" fill="#2A2E34" />
            {!day && <><ellipse cx={95} cy={-440} rx={14} ry={8} fill="#FFE8A8" /><path d="M95,-440 L-40,300 L230,300Z" fill="#FFE8A8" opacity={0.08} /></>}
          </g>
        ))}
      </g>
      {/* yol */}
      <rect y={760} width={1920} height={320} fill={day ? "#5E6670" : "#24282E"} />
      <rect y={760} width={1920} height={14} fill={day ? "#C9C2B4" : "#3A3E44"} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={((i * 260 - px) % 2340 + 2340) % 2340 - 200} y={930} width={150} height={14} fill={day ? "#F4F4F4" : "#C8C8B0"} opacity={day ? 1 : 0.7} />)}
      {fog > 0 && <rect width={1920} height={1080} fill="#9AB0C8" opacity={0.15 * fog} />}
      {!day && <rect width={1920} height={1080} fill="#06101E" opacity={0.2} />}
    </g>
  );
};
// İhtiyar'ın köşkü (dış, gece): taş duvar, demir kapı, fenerler, ışıklı pencereler
export const KoskDis: React.FC<{ t: number; gate?: number }> = ({ t, gate = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    <circle cx={300} cy={150} r={40} fill="#F4F0DC" opacity={0.85} />
    {[0, 1].map((i) => <ellipse key={i} cx={((i * 900 + t * 8) % 2400) - 200} cy={160 + i * 60} rx={220} ry={30} fill="#2A3A54" opacity={0.6} />)}
    <g transform="translate(960,640)">
      <rect x={-520} y={-380} width={1040} height={380} fill="#3A3430" stroke={INK} strokeWidth={6} />
      <path d="M-570,-380 L0,-520 L570,-380Z" fill="#2A221E" stroke={INK} strokeWidth={6} />
      <rect x={-90} y={-470} width={40} height={90} fill="#2A221E" stroke={INK} strokeWidth={4} />
      {[-420, -280, -140, 140, 280, 420].map((xx, i) => [-320, -170].map((yy, k) => <g key={`${xx}${yy}`}><rect x={xx - 40} y={yy} width={80} height={110} fill={(i + k) % 3 ? "#FFD27A" : "#1A1E28"} opacity={(i + k) % 3 ? 0.85 + 0.1 * Math.sin(t * 3 + i) : 1} stroke={INK} strokeWidth={4} /><path d={`M${xx},${yy} v110 M${xx - 40},${yy + 50} h80`} stroke="#3A3430" strokeWidth={5} /></g>))}
      <rect x={-80} y={-200} width={160} height={200} fill="#2A1A12" stroke={INK} strokeWidth={6} />
    </g>
    {/* ağaçlar */}
    {[120, 1800].map((xx, i) => <g key={i} transform={`translate(${xx},700)`}><path d="M-16,0 L-10,-260 L10,-260 L16,0Z" fill="#1E1612" />{[[-80, -300, 110], [40, -340, 120], [0, -250, 100]].map(([a, b, r], k) => <circle key={k} cx={a} cy={b} r={r} fill="#0E1A16" />)}</g>)}
    {/* taş duvar + kapı */}
    <rect y={640} width={1920} height={170} fill="#5A544C" stroke={INK} strokeWidth={6} />
    <rect y={640} width={1920} height={170} fill="url(#tStone)" />
    <g transform="translate(960,810)">
      <rect x={-300} y={-330} width={60} height={330} fill="#4A443C" stroke={INK} strokeWidth={5} /><rect x={240} y={-330} width={60} height={330} fill="#4A443C" stroke={INK} strokeWidth={5} />
      {[-1, 1].map((d) => <g key={d} transform={`translate(${d * 240},0) scale(${d},1) rotate(${-gate * 50},0,0)`}><g transform="scale(1,1)">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={-236 + i * 30} y={-290} width={8} height={290} fill="#1A1A1E" />)}<path d="M-240,-290 H0 M-240,-150 H0 M-240,-10 H0" stroke="#1A1A1E" strokeWidth={10} /></g></g>)}
      {[-270, 270].map((xx) => <g key={xx}><rect x={xx - 22} y={-390} width={44} height={60} rx={6} fill="#2A2420" stroke={INK} strokeWidth={4} /><rect x={xx - 14} y={-380} width={28} height={40} fill="#FFD27A" opacity={0.8 + 0.2 * Math.sin(t * 9 + xx)} /><circle cx={xx} cy={-360} r={80} fill="#FFD27A" opacity={0.08} /></g>)}
    </g>
    <rect y={810} width={1920} height={270} fill="#2A2A26" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={hs(i) * 1920} cy={830 + hs(i + 2) * 240} r={3 + hs(i + 4) * 4} fill="#3A3A34" />)}
    <rect width={1920} height={1080} fill="#06101E" opacity={0.28} />
  </g>
);
// köşk koridoru: perspektif, tablolar, aplikler, en sonda kapı; kan izi (blood 0..1)
export const Koridor: React.FC<{ t: number; blood?: number; door?: number }> = ({ t, blood = 0, door = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1C14" />
    <path d="M0,0 L760,380 L1160,380 L1920,0Z" fill="#1E140E" />
    <path d="M0,1080 L760,700 L1160,700 L1920,1080Z" fill="#3A2418" />
    <path d="M0,1080 L760,700 L1160,700 L1920,1080Z" fill="url(#tCarpet)" opacity={0.35} />
    <path d="M0,0 L760,380 L760,700 L0,1080Z" fill="#4A3020" /><path d="M1920,0 L1160,380 L1160,700 L1920,1080Z" fill="#40291C" />
    {[0, 1, 2].map((i) => { const k = 0.12 + i * 0.28; const x0 = lerp(60, 700, k), y0 = lerp(260, 430, k), w = lerp(260, 40, k), h = lerp(300, 60, k); return <g key={i}><rect x={x0} y={y0} width={w} height={h} fill="#C8A060" stroke={INK} strokeWidth={4} /><rect x={x0 + w * 0.1} y={y0 + h * 0.1} width={w * 0.8} height={h * 0.8} fill={["#3A4A2E", "#5A2E2A", "#2E3A4A"][i]} /><rect x={1920 - x0 - w} y={y0} width={w} height={h} fill="#C8A060" stroke={INK} strokeWidth={4} /><rect x={1920 - x0 - w + w * 0.1} y={y0 + h * 0.1} width={w * 0.8} height={h * 0.8} fill={["#4A3A2A", "#2E4A3A", "#5A4A2A"][i]} /><circle cx={x0 + w + lerp(60, 10, k)} cy={y0 - 20} r={lerp(22, 6, k)} fill="#FFD27A" opacity={0.85 + 0.1 * Math.sin(t * 7 + i)} /><circle cx={1920 - x0 - w - lerp(60, 10, k)} cy={y0 - 20} r={lerp(22, 6, k)} fill="#FFD27A" opacity={0.85} /></g>; })}
    <rect x={860} y={440} width={200} height={260} fill="#1A100A" stroke={INK} strokeWidth={4} />
    <g transform={`translate(860,440) scale(${1 - door * 0.8},1)`}><rect width={200} height={260} fill="#5A3A26" stroke={INK} strokeWidth={4} /><circle cx={176} cy={140} r={8} fill="#C8A060" /></g>
    {door > 0 && <path d={`M1060,700 L${1060 + door * 200},1080 L${860},1080 L860,700Z`} fill="#FFB060" opacity={0.18 * door} />}
    {blood > 0 && [[300, 420, -10], [520, 470, 6], [1500, 430, 12], [1330, 480, -8]].slice(0, Math.ceil(blood * 4)).map(([a, b, r], i) => <g key={i} transform={`translate(${a},${b}) rotate(${r}) scale(${1 - i * 0.12})`}><path d="M-20,30 C-24,0 -14,-30 -6,-40 C-2,-30 0,-20 2,-10 C4,-34 10,-48 16,-44 C18,-30 14,-10 14,0 C18,-20 26,-30 30,-24 C30,-6 26,20 20,34Z" fill="#7A1218" opacity={0.85} /></g>)}
    <rect width={1920} height={1080} fill="#100806" opacity={0.25} />
  </g>
);
// hastane koridoru: sandalyeler, AMELİYATHANE kapısı + kırmızı lamba, saat, pencere (sabaha doğru aydınlanır)
export const HastaneKoridor: React.FC<{ t: number; red?: number; dawn?: number; door?: number }> = ({ t, red = 1, dawn = 0, door = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B8CCCC" />
    <rect y={0} width={1920} height={110} fill="#E8EEEE" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={160 + i * 460} y={30} width={240} height={36} rx={6} fill="#FFFFFF" opacity={0.9} />)}
    <rect y={560} width={1920} height={12} fill="#7EA4A8" />
    {/* pencere */}
    <rect x={120} y={190} width={420} height={300} fill={dawn > 0.5 ? "#F7C27A" : "#142640"} stroke="#E6EEEE" strokeWidth={14} />
    {dawn > 0.5 && <circle cx={330} cy={430} r={60} fill="#FFD27A" />}
    <path d="M330,190 V490 M120,340 H540" stroke="#E6EEEE" strokeWidth={8} />
    {/* ameliyathane kapısı */}
    <g transform="translate(1260,0)">
      <rect x={-260} y={250} width={520} height={650} fill="#9AB4B8" stroke={INK} strokeWidth={6} />
      <g transform={`translate(-260,250) scale(${1 - door * 0.5},1)`}><rect width={260} height={650} fill="#D8E4E4" stroke={INK} strokeWidth={5} /><rect x={70} y={120} width={120} height={150} fill="#9FC8D0" stroke={INK} strokeWidth={4} /></g>
      <g transform={`translate(260,250) scale(${-(1 - door * 0.5)},1)`}><rect width={260} height={650} fill="#D8E4E4" stroke={INK} strokeWidth={5} /><rect x={70} y={120} width={120} height={150} fill="#9FC8D0" stroke={INK} strokeWidth={4} /></g>
      <rect x={-200} y={160} width={400} height={66} rx={8} fill={red ? "#7A1218" : "#3A3E44"} stroke={INK} strokeWidth={5} />
      <text x={0} y={206} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill={red ? "#FFD0D0" : "#9AA0A8"} opacity={red ? 0.75 + 0.25 * Math.sin(t * 4) : 1}>AMELİYATHANE</text>
      {red > 0 && <ellipse cx={0} cy={192} rx={300} ry={90} fill="#FF3030" opacity={0.12 * red} />}
    </g>
    {/* sandalyeler */}
    {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${130 + i * 150},860)`}><rect x={-60} y={-100} width={120} height={20} rx={6} fill="#3A7BD5" stroke={INK} strokeWidth={4} /><rect x={-60} y={-170} width={120} height={70} rx={10} fill="#3A7BD5" stroke={INK} strokeWidth={4} /><path d="M-50,-80 V0 M50,-80 V0" stroke="#5A5E66" strokeWidth={8} /></g>)}
    <g transform="translate(860,180) scale(0.5)"><Saat x={0} y={0} h={dawn > 0.5 ? 6 : 1} m={dawn > 0.5 ? 40 : 20} /></g>
    <rect y={900} width={1920} height={180} fill="#8EA6A8" />
    <rect y={900} width={1920} height={180} fill="url(#tTile)" />
    <rect width={1920} height={1080} fill={dawn > 0.5 ? "#FFD27A" : "#0A1A30"} opacity={dawn > 0.5 ? 0.06 : 0.14} />
  </g>
);
// ambulans içi: sedye, monitör, tavan lambası, arka kapı camından akan sokak ışıkları
export const AmbulansIc: React.FC<{ t: number; beat?: number }> = ({ t, beat = 1 }) => {
  const ph = (t * 1.4) % 1;
  return (
    <g transform={`translate(0,${Math.sin(t * 7) * 2})`}>
      <rect width={1920} height={1080} fill="#D8E2E4" />
      <rect x={760} y={180} width={400} height={300} rx={12} fill="#0E1A2E" stroke="#9AA4A8" strokeWidth={12} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={760 + (((i * 90 + t * 500) % 420))} cy={260 + (i % 3) * 60} r={8} fill={i % 2 ? "#FFD27A" : "#E0393E"} opacity={0.7} />)}
      <rect x={0} y={0} width={1920} height={120} fill="#C8D2D4" /><rect x={760} y={40} width={400} height={40} rx={8} fill="#FFFFFF" />
      <rect x={0} y={120} width={300} height={700} fill="#E8EEF0" stroke="#9AA4A8" strokeWidth={6} />
      {[0, 1, 2].map((i) => <rect key={i} x={30} y={170 + i * 200} width={240} height={150} rx={8} fill="#F4F8F8" stroke="#9AA4A8" strokeWidth={4} />)}
      <g transform="translate(1600,330)">
        <rect x={-160} y={-120} width={320} height={220} rx={14} fill="#2A2E36" stroke={INK} strokeWidth={6} />
        <rect x={-140} y={-100} width={280} height={150} fill="#071410" />
        <polyline fill="none" stroke="#3FE07A" strokeWidth={4} points={Array.from({ length: 56 }, (_, i) => { const xx = -136 + i * 5; const p = ((i / 56) - ph + 1) % 1; const spike = beat > 0 && p < 0.06 ? (p < 0.03 ? -60 : 30) : 0; return `${xx},${-20 + spike * beat}`; }).join(" ")} />
        <text x={86} y={40} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#3FE07A">{beat > 0 ? Math.round(44 + Math.sin(t) * 3) : "—"}</text>
      </g>
      <g transform="translate(960,860)"><rect x={-520} y={-60} width={1040} height={70} rx={14} fill="#F4F6F6" stroke={INK} strokeWidth={6} /><path d="M-500,10 V180 M500,10 V180" stroke="#5A5E66" strokeWidth={12} /><rect x={-540} y={10} width={1080} height={20} fill="#9AA0A8" /></g>
      <rect y={960} width={1920} height={120} fill="#7E8A8C" />
      <rect width={1920} height={1080} fill="#E0393E" opacity={0.05 + 0.05 * (Math.sin(t * 9) > 0 ? 1 : 0)} />
    </g>
  );
};
// ambulans dış (yan): beyaz, kırmızı şerit, tepe lambası
export const Ambulans: React.FC<{ x: number; y: number; s?: number; t?: number; roll?: number }> = ({ x, y, s = 1, t = 0, roll = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-420,-60 L-420,-380 L180,-380 L180,-300 L300,-300 Q380,-290 420,-200 L440,-60Z" fill="#F4F6F6" stroke={INK} strokeWidth={7} />
    <rect x={-420} y={-220} width={860} height={40} fill="#E0393E" />
    <text x={-120} y={-250} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={60} fill="#E0393E">AMBULANS</text>
    <path d="M200,-290 L300,-290 Q360,-280 392,-210 L200,-210Z" fill="#1E3350" stroke={INK} strokeWidth={5} />
    <rect x={-300} y={-430} width={120} height={50} rx={8} fill={Math.sin(t * 9) > 0 ? "#FF3030" : "#3A7BD5"} stroke={INK} strokeWidth={5} />
    <circle cx={-240} cy={-405} r={90} fill={Math.sin(t * 9) > 0 ? "#FF3030" : "#3A7BD5"} opacity={0.2} />
    {[-260, 280].map((xx) => <g key={xx} transform={`translate(${xx},-60) rotate(${roll * 360})`}><circle r={64} fill="#141414" stroke={INK} strokeWidth={5} /><circle r={30} fill="#9AA0A8" /></g>)}
  </g>
);
// Eşref Tek Gençlik Merkezi (gündüz): bina, tabela, basket potası, çocuklar sahne tarafından çizilir
export const Merkez: React.FC<{ t: number; ic?: boolean }> = ({ t, ic = false }) => ic ? (
  <g>
    <rect width={1920} height={1080} fill="#F2E6CC" />
    <rect x={160} y={120} width={1600} height={260} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <text x={960} y={230} textAnchor="middle" fontFamily="Caveat, Poppins" fontStyle="italic" fontWeight={700} fontSize={84} fill="#2A2420">“Kimse yetim değildir.</text>
    <text x={960} y={330} textAnchor="middle" fontFamily="Caveat, Poppins" fontStyle="italic" fontWeight={700} fontSize={84} fill="#2A2420">Bir kapı açan varsa.”</text>
    {/* kitaplık */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${200 + i * 560},440)`}><rect width={480} height={420} fill="#8A5A32" stroke={INK} strokeWidth={6} />{[0, 1, 2].map((r) => <g key={r}><rect x={10} y={20 + r * 136} width={460} height={8} fill="#5A3A22" />{Array.from({ length: 12 }, (_, k) => <rect key={k} x={20 + k * 37} y={40 + r * 136} width={28} height={96 - (k % 3) * 10} fill={["#C0392B", "#3A7BD5", "#F2C14E", "#3FAE6A", "#7A3A8A"][(k + r + i) % 5]} stroke={INK} strokeWidth={2} />)}</g>)}</g>)}
    <rect y={880} width={1920} height={200} fill="#B8875A" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 170},880 L${i * 170 - 60},1080`} stroke="#9A6E46" strokeWidth={4} />)}
  </g>
) : (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 700 + t * 12) % 2400) - 200} cy={110 + i * 50} rx={140} ry={34} fill="#FFFFFF" opacity={0.85} />)}
    <g transform="translate(960,640)">
      <rect x={-640} y={-420} width={1280} height={420} fill="#E8D8B8" stroke={INK} strokeWidth={6} />
      <rect x={-640} y={-460} width={1280} height={50} fill="#B85A3A" stroke={INK} strokeWidth={5} />
      {[-520, -360, -200, 200, 360, 520].map((xx) => [-360, -200].map((yy) => <rect key={`${xx}${yy}`} x={xx - 50} y={yy} width={100} height={110} fill="#9FD0EC" stroke={INK} strokeWidth={4} />))}
      <rect x={-110} y={-220} width={220} height={220} fill="#5A3A26" stroke={INK} strokeWidth={6} /><path d="M0,-220 V0" stroke={INK} strokeWidth={4} />
      <rect x={-430} y={-560} width={860} height={90} rx={12} fill="#1B4F9C" stroke={INK} strokeWidth={6} />
      <text x={0} y={-500} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={50} fill="#FFFFFF">EŞREF TEK GENÇLİK MERKEZİ</text>
    </g>
    <rect y={640} width={1920} height={440} fill="#C9C2B4" />
    <rect y={760} width={1920} height={320} fill="#D86A4A" />
    <path d="M200,1080 L520,760 M1720,1080 L1400,760 M0,920 H1920" stroke="#F4F4F4" strokeWidth={8} opacity={0.8} />
    <g transform="translate(1700,760)"><path d="M0,0 V-360 H-90" stroke="#5A5E66" strokeWidth={14} fill="none" /><rect x={-200} y={-460} width={140} height={100} fill="#FFFFFF" stroke={INK} strokeWidth={5} /><ellipse cx={-130} cy={-350} rx={50} ry={10} fill="none" stroke="#E0763A" strokeWidth={8} /></g>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${300 + i * 260},${600 + Math.sin(t + i) * 4} q12,-12 24,0 q12,-12 24,0`} stroke="#2A2A2A" strokeWidth={3} fill="none" opacity={i % 2 ? 0 : 0.6} />)}
  </g>
);
// yetimhane bahçesi (anı, sepya): eski taş bina, çıplak ağaç, salıncak yok, iki çocuk sahneden
export const Yetimhane: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#D8C8A8" />
    <rect x={200} y={180} width={1100} height={480} fill="#B8A07E" stroke="#5A4630" strokeWidth={6} />
    <rect x={200} y={180} width={1100} height={480} fill="url(#tStone)" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={260 + i * 175} y={260} width={100} height={130} fill="#6A5A44" stroke="#5A4630" strokeWidth={4} />)}
    <rect x={640} y={460} width={180} height={200} fill="#5A4630" />
    <text x={750} y={230} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={38} fill="#5A4630">ÇOCUK ESİRGEME KURUMU</text>
    <g transform="translate(1600,700)"><path d="M-18,0 L-10,-380 L10,-380 L18,0Z" fill="#6A5640" />{[[-120, -320, -60, -380], [0, -360, 120, -420], [10, -260, 140, -300]].map(([a, b, c, d], i) => <path key={i} d={`M${a / 6},${b} Q${a},${b - 30} ${c},${d}`} stroke="#6A5640" strokeWidth={10} fill="none" />)}</g>
    {Array.from({ length: 14 }, (_, i) => { const y0 = ((t * 30 + i * 90) % 1100) - 40; return <path key={i} d={`M${hs(i) * 1920 + Math.sin(t + i) * 30},${y0} q6,-6 12,0 q-6,6 -12,0`} fill="#A07A4A" opacity={0.7} />; })}
    <rect y={660} width={1920} height={420} fill="#C8B490" />
    <rect width={1920} height={1080} fill="#C89A5A" opacity={0.18} />
    <rect width={1920} height={1080} fill="url(#tScan)" opacity={0.6} />
  </g>
);
// gece bahçe kapısı (Eşref'in evi): duvar, demir kapı (kilitli), bahçe lambası, ağaç
export const BahceKapi: React.FC<{ t: number; siren?: number }> = ({ t, siren = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E1A2E" />
    <path d="M0,600 Q480,560 960,580 T1920,570 L1920,1080 L0,1080Z" fill="#1E3A26" />
    <rect x={1200} y={360} width={720} height={320} fill="#C8BEA8" stroke={INK} strokeWidth={6} />
    <rect x={1200} y={360} width={720} height={320} fill="url(#tStone)" />
    <g transform="translate(1480,680)">{Array.from({ length: 9 }, (_, i) => <rect key={i} x={-150 + i * 34} y={-300} width={10} height={300} fill="#1A1A1E" />)}<path d="M-160,-280 H160 M-160,-140 H160" stroke="#1A1A1E" strokeWidth={10} /><rect x={-20} y={-170} width={40} height={50} rx={6} fill="#5A5E66" stroke={INK} strokeWidth={3} /></g>
    <g transform="translate(400,680)"><path d="M0,0 V-340" stroke="#3A3E44" strokeWidth={10} /><circle cx={0} cy={-350} r={24} fill="#FFE8A8" /><circle cx={0} cy={-350} r={140} fill="#FFE8A8" opacity={0.1} /></g>
    <g transform="translate(860,700)"><path d="M-14,0 L-8,-300 L8,-300 L14,0Z" fill="#2A1E16" />{[[-80, -320, 110], [40, -360, 120], [0, -260, 100]].map(([a, b, r], k) => <circle key={k} cx={a} cy={b} r={r} fill="#10241A" />)}</g>
    {siren > 0 && <g style={{ mixBlendMode: "screen" }}><rect width={1920} height={1080} fill={Math.sin(t * 9) > 0 ? "#E0393E" : "#3A7BD5"} opacity={0.22 * siren} /></g>}
    <rect width={1920} height={1080} fill="#06101E" opacity={0.25} />
  </g>
);
