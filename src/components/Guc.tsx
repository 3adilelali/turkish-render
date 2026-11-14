import React from "react";
import { T, TMini, MINI_COLS, lerp } from "./Toon";
import { Vapur } from "./Toon2";

// Kanal 2 · k2r-14 «Güç» kiti (2026-11-13): her gün ikiye katlanan güç.
// Çarpan (elin üstünde turkuaz sayı), kavanoz, yumurta kolisi, sırt yükü (semer), otobüs, bordür, Nokia,
// Mahmutpaşa yokuşu + bitiş şeridi, Eminönü rıhtımı + demir baba + halat, ilan kâğıdı, hesap kâğıdı, bilek güreşi masası.
const LN = "#1A1A22";
const TQ = "#2EE6D0";
const md = (v: number, m: number) => ((v % m) + m) % m;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const cl = (v: number) => Math.max(0, Math.min(1, v));

// ── el + çarpan (yakın çekim). n: gösterilen sayı ("×2"), k: belirme, glow: parıltı
const HAND = "M-160,120 Q-180,0 -120,-60 L-100,-200 Q-80,-220 -60,-200 L-50,-60 L-30,-220 Q-10,-240 10,-220 L10,-60 L40,-200 Q60,-220 80,-200 L60,-40 L110,-100 Q140,-110 140,-80 L90,60 Q60,160 20,180Z";
export const Carpan: React.FC<{ t: number; n: string; k?: number; bg?: string; sub?: string; shake?: number; down?: boolean }> = ({ t, n, k = 1, bg = "#14203A", sub, shake = 0, down }) => {
  const g = 0.6 + Math.sin(t * 5) * 0.2;
  const sx = shake ? Math.sin(t * 60) * 6 * shake : 0;
  const c = down ? "#F6C445" : TQ;
  return (
    <g>
      <rect width={1920} height={1080} fill={bg} />
      <circle cx={960} cy={560} r={520} fill={c} opacity={0.07 * k} />
      <g transform={`translate(${960 + sx},600) scale(2.6)`}>
        <path d={HAND} fill="#FBE7D2" stroke={LN} strokeWidth={4} />
        <path d="M-60,40 Q0,20 60,40" stroke="#E9C8A8" strokeWidth={3} fill="none" />
      </g>
      <g opacity={k} transform={`translate(${960 + sx},${640})`}>
        <text textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={n.length > 9 ? 96 : 150} fill={c} opacity={g * 0.5} stroke={c} strokeWidth={18}>{n}</text>
        <text textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={n.length > 9 ? 96 : 150} fill="#E9FFFC">{n}</text>
      </g>
      {sub && <text x={960} y={1010} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#F6C445" opacity={k}>{sub}</text>}
    </g>
  );
};

// ── turşu kavanozu. lid: 0 yerinde → 1 uçtu (kapak uzaklaşır), juice: fışkırma
export const Kavanoz: React.FC<{ x: number; y: number; s?: number; t?: number; lid?: number; juice?: number; turn?: number }> = ({ x, y, s = 1, t = 0, lid = 0, juice = 0, turn = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {juice > 0 && Array.from({ length: 18 }, (_, i) => {
      const a = -1.9 + rnd(i) * 1.6, d = juice * (260 + rnd(i + 9) * 420);
      return <circle key={i} cx={Math.cos(a) * d * 0.6} cy={-150 + Math.sin(a) * d} r={10 + rnd(i + 3) * 14} fill="#C9D86A" opacity={0.85 * (1 - juice * 0.5)} />;
    })}
    <path d="M-80,-120 Q-95,-100 -95,-60 L-95,90 Q-95,120 -65,120 L65,120 Q95,120 95,90 L95,-60 Q95,-100 80,-120Z" fill="#DDEFE8" fillOpacity={0.55} stroke={LN} strokeWidth={6} />
    <rect x={-85} y={-40} width={170} height={150} rx={20} fill="#C9D86A" opacity={0.7} />
    {[[-40, 10], [20, 40], [-10, 70], [45, -10], [-55, 60]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={20} ry={36} fill="#7FA03A" stroke="#4E6A22" strokeWidth={3} transform={`rotate(${i * 30} ${cx} ${cy})`} />)}
    <rect x={-60} y={10} width={120} height={46} rx={6} fill="#FFF3D6" stroke={LN} strokeWidth={3} />
    <text y={42} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill={T.red}>TURŞU</text>
    <g transform={`translate(${lid * 900},${-140 - lid * 520 + lid * lid * 380}) rotate(${turn * 40 + lid * 720})`}>
      <rect x={-86} y={-24} width={172} height={46} rx={10} fill="#D23A3A" stroke={LN} strokeWidth={6} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-70 + i * 17},-20 V18`} stroke="#A02828" strokeWidth={3} />)}
    </g>
  </g>
);

// ── karton koli
export const Koli: React.FC<{ x: number; y: number; s?: number; c?: string; label?: string; rot?: number }> = ({ x, y, s = 1, c = "#C9965A", label, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-80} y={-60} width={160} height={120} rx={6} fill={c} stroke={LN} strokeWidth={5} />
    <path d="M-80,-60 L80,-60 M0,-60 V-20" stroke="#8A6236" strokeWidth={5} />
    <rect x={-22} y={-60} width={44} height={120} fill="#E9D3A8" opacity={0.6} />
    {label && <text y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#5A3E25">{label}</text>}
  </g>
);

// ── sırt yükü: semer + koli yığını (figürün arkasına). x,y = figürün ayak noktası, s = figür ölçeği, dir = baktığı yön
export const SirtYuk: React.FC<{ x: number; y: number; s?: number; n?: number; dir?: 1 | -1; t?: number; wob?: number; labels?: string[] }> = ({ x, y, s = 1, n = 2, dir = 1, t = 0, wob = 0, labels = [] }) => (
  <g transform={`translate(${x - dir * 70 * s},${y - 300 * s}) scale(${s})`}>
    <path d="M-50,-40 Q-70,60 -40,150 L30,150 Q50,60 30,-40Z" fill="#6B4426" stroke={LN} strokeWidth={5} />
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`rotate(${Math.sin(t * 3 + i) * wob * 4})`}>
        <Koli x={-dir * 20 + (i % 2 ? 6 : -6)} y={60 - i * 118} s={1} c={["#C9965A", "#B98A50", "#D4A468"][i % 3]} label={labels[i]} />
      </g>
    ))}
    <path d="M-50,-20 Q0,30 60,10" stroke="#3A2A20" strokeWidth={8} fill="none" />
  </g>
);

// ── yumurta kolisi (30 yumurta). broken: kırık sayısı
export const YumurtaKoli: React.FC<{ x: number; y: number; s?: number; broken?: number; t?: number; glow?: number }> = ({ x, y, s = 1, broken = 0, t = 0, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 && <ellipse rx={420} ry={260} fill={TQ} opacity={0.12 * glow} />}
    <rect x={-330} y={-200} width={660} height={400} rx={18} fill="#C9B79A" stroke={LN} strokeWidth={6} />
    {Array.from({ length: 30 }, (_, i) => {
      const cx = -275 + (i % 6) * 110, cy = -150 + Math.floor(i / 6) * 75;
      const br = i < broken;
      return (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <ellipse rx={44} ry={30} fill="#B5A386" />
          {!br ? <ellipse rx={36} ry={28} fill="#F7EBD8" stroke={LN} strokeWidth={3} /> : (
            <g><ellipse rx={38} ry={26} fill="#F6C445" opacity={0.85} /><circle r={12} fill="#F28C28" /><path d="M-30,-6 l12,-10 l8,10 l10,-12 l10,12" stroke={LN} strokeWidth={3} fill="#F7EBD8" /></g>
          )}
          {!br && <ellipse cx={-12} cy={-10} rx={10} ry={6} fill="#FFFFFF" opacity={0.7} />}
        </g>
      );
    })}
  </g>
);

// ── şehir otobüsü (yan görünüş)
export const Otobus: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; line?: string; smoke?: number; tilt?: number }> = ({ x, y, s = 1, t = 0, c = "#2E7D5B", line = "36 FATİH", smoke = 0, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
    <rect x={-520} y={-330} width={1040} height={290} rx={40} fill="#F4F4F2" stroke={LN} strokeWidth={7} />
    <rect x={-520} y={-120} width={1040} height={60} fill={c} />
    <rect x={-520} y={-330} width={1040} height={36} rx={18} fill={c} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-480 + i * 136} y={-280} width={112} height={130} rx={12} fill="#9FD3EC" stroke={LN} strokeWidth={4} />)}
    {Array.from({ length: 7 }, (_, i) => <rect key={"r" + i} x={-470 + i * 136} y={-270} width={30} height={110} rx={6} fill="#FFFFFF" opacity={0.35} />)}
    <rect x={380} y={-300} width={120} height={60} rx={8} fill="#1A1A22" /><text x={440} y={-260} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#F6C445">{line}</text>
    <rect x={-150} y={-280} width={110} height={240} rx={8} fill="#3A4652" stroke={LN} strokeWidth={4} />
    {[-340, 330].map((wx, i) => (
      <g key={i} transform={`translate(${wx},-30)`}>
        <circle r={74} fill="#1A1A22" /><circle r={38} fill="#9AA4AE" /><path d={`M0,-30 L0,30 M-30,0 L30,0`} stroke="#5E6670" strokeWidth={6} transform={`rotate(${t * 30})`} />
      </g>
    ))}
    {smoke > 0 && Array.from({ length: 6 }, (_, i) => { const p = md(t * 0.6 + i / 6, 1); return <circle key={i} cx={-560 - p * 200} cy={-70 - p * 140} r={30 + p * 50} fill="#8C949C" opacity={smoke * (1 - p) * 0.6} />; })}
    <rect x={-540} y={-90} width={40} height={40} rx={8} fill="#F28C28" />
  </g>
);

// ── yokuşlu cadde (Vatan/Fatih) — otobüs sahnesi için
export const YokusCadde: React.FC<{ t: number; px?: number; dusk?: number }> = ({ t, px = 0, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
    <g transform={`translate(${-px},0)`}>
      {Array.from({ length: 9 }, (_, i) => {
        const bx = -200 + i * 300, h = 360 + (i % 3) * 90;
        return (
          <g key={i}>
            <rect x={bx} y={820 - h - i * 22} width={280} height={h + 200} fill={["#E9D9C0", "#D9C7A8", "#EFE4D2", "#CDBB9A"][i % 4]} stroke="#B9A684" strokeWidth={4} />
            {Array.from({ length: 6 }, (_, k) => <rect key={k} x={bx + 30 + (k % 3) * 80} y={820 - h - i * 22 + 40 + Math.floor(k / 3) * 110} width={52} height={74} rx={4} fill="#7FA9C2" stroke="#5E6670" strokeWidth={3} />)}
            <rect x={bx + 20} y={760 - i * 22} width={240} height={60} fill={["#B23A3F", "#3A7BD5", "#3FAE6A"][i % 3]} />
          </g>
        );
      })}
    </g>
    <path d={`M0,880 L1920,700 L1920,1080 L0,1080Z`} fill="#5E6670" />
    <path d={`M0,860 L1920,680 L1920,700 L0,880Z`} fill="#BFB6A6" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${md(i * 240 - px, 2100) - 100},${975 - (md(i * 240 - px, 2100) - 100) * 0.094} l120,-11`} stroke="#F4F4F2" strokeWidth={10} />)}
  </g>
);

// ── bordür yakın çekim: ayak dayalı, kırılma
export const Bordur: React.FC<{ t: number; crack?: number; push?: number }> = ({ t, crack = 0, push = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#6B727A" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 50) * 1080} r={3 + rnd(i + 9) * 5} fill="#5A6068" />)}
    <g transform="translate(960,700)">
      <rect x={-900} y={-90} width={1800} height={180} fill="#C9C2B4" stroke={LN} strokeWidth={6} />
      {[-600, -200, 200, 600].map((bx) => <path key={bx} d={`M${bx},-90 V90`} stroke="#9E978A" strokeWidth={5} />)}
      {crack > 0 && <path d={`M40,-90 L10,-30 L60,10 L20,50 L50,90`} stroke={LN} strokeWidth={8 * crack} fill="none" />}
      {crack > 0.5 && Array.from({ length: 8 }, (_, i) => <rect key={i} x={20 + (rnd(i) - 0.5) * 200 * crack} y={-120 - rnd(i + 4) * 160 * crack} width={18} height={14} fill="#C9C2B4" stroke={LN} strokeWidth={2} />)}
    </g>
    <g transform={`translate(${900 - push * 20},575) rotate(-6)`}>
      <path d="M-260,-30 L60,-30 C120,-30 160,10 160,70 L-260,70Z" fill="#FFFFFF" stroke={LN} strokeWidth={7} />
      <rect x={-260} y={60} width={420} height={22} rx={8} fill="#C9C9C9" stroke={LN} strokeWidth={5} />
      <rect x={-560} y={-60} width={320} height={80} rx={30} fill={LN} />
      <path d="M-80,-30 l40,-30 M-20,-30 l40,-30" stroke={LN} strokeWidth={6} />
    </g>
  </g>
);

// ── eski tuğla telefon
export const Nokia: React.FC<{ x: number; y: number; s?: number; crack?: number; t?: number }> = ({ x, y, s = 1, crack = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-90} y={-230} width={180} height={460} rx={60} fill="#2E3A55" stroke={LN} strokeWidth={6} />
    <rect x={-60} y={-170} width={120} height={110} rx={10} fill="#A9C27A" stroke={LN} strokeWidth={4} />
    <text y={-105} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#33441E">12:00</text>
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-60 + (i % 3) * 44} y={0 + Math.floor(i / 3) * 44} width={34} height={30} rx={10} fill="#9AA4AE" stroke={LN} strokeWidth={3} />)}
    <rect x={-40} y={-40} width={80} height={26} rx={12} fill="#9AA4AE" stroke={LN} strokeWidth={3} />
    {crack > 0 && <g stroke="#E9FFFC" strokeWidth={4} opacity={crack} fill="none"><path d="M-60,-160 L0,-110 L-30,-70 M0,-110 L60,-140 M0,-110 L20,-60" /><path d="M-80,40 L80,120 M0,80 L-60,180" stroke={LN} strokeWidth={6} /></g>}
  </g>
);

// ── ilan kâğıdı (çay ocağı duvarı)
export const Ilan: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B89A6E" /><rect width={1920} height={1080} fill="url(#tStone)" />
    <g transform={`translate(960,${560 + (1 - k) * 60}) rotate(${-2 + Math.sin(t * 1.2) * 0.6})`} opacity={k}>
      <rect x={-470} y={-430} width={940} height={860} fill="#FFF8E6" stroke={LN} strokeWidth={6} />
      {[[-430, -400], [400, -400]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={14} fill={T.red} />)}
      <text y={-300} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#5A3E25">MAHMUTPAŞA ESNAF DERNEĞİ</text>
      <text y={-180} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={92} fill={T.red}>HAMAL YARIŞI</text>
      <text y={-70} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#1C1C1C">EMİNÖNÜ → MAHMUTPAŞA</text>
      <text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#1C1C1C">SIRTTA 150 KİLO</text>
      <rect x={-330} y={70} width={660} height={160} rx={20} fill="#F6C445" stroke={LN} strokeWidth={5} />
      <text y={150} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#1C1C1C">ÖDÜL</text>
      <text y={210} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill={T.red}>100.000 ₺</text>
      <text y={330} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#5A3E25">11 GÜN SONRA · SABAH 9</text>
    </g>
  </g>
);

// ── hesap kâğıdı: satırlar sırayla belirir. rows: [sol, sağ]
export const Hesap: React.FC<{ t: number; a: number; rows: [string, string][]; step?: number; red?: number }> = ({ t, a, rows, step = 0.9, red = -1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2420" />
    <g transform="translate(960,540) rotate(-1.5)">
      <rect x={-640} y={-470} width={1280} height={940} fill="#FBF6EA" stroke={LN} strokeWidth={6} />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M-640,${-380 + i * 70} H640`} stroke="#A9C8E8" strokeWidth={3} />)}
      <path d="M-520,-470 V470" stroke="#E86A6A" strokeWidth={4} />
      {rows.map(([l, r], i) => {
        const k = cl((t - a - 0.2 - i * step) / 0.35);
        return (
          <g key={i} opacity={k} transform={`translate(${(1 - k) * -30},0)`}>
            <text x={-480} y={-330 + i * 140} fontFamily="Patrick Hand, sans-serif" fontSize={66} fill="#2A3346">{l}</text>
            <text x={590} y={-330 + i * 140} textAnchor="end" fontFamily="Patrick Hand, sans-serif" fontSize={72} fill={i === red ? T.red : "#1C1C1C"}>{r}</text>
          </g>
        );
      })}
    </g>
  </g>
);

// ── bilek güreşi masası (kahvehane içinde, yakın). split: 0 → 1 masa ikiye ayrılır
export const GuresMasa: React.FC<{ x: number; y: number; s?: number; split?: number }> = ({ x, y, s = 1, split = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${sd * split * 90},${split * 40}) rotate(${sd * split * 14})`}>
        <path d={sd < 0 ? "M-260,-20 L4,-20 L-10,10 L8,40 L-260,40Z" : "M4,-20 L260,-20 L260,40 L8,40 L-10,10Z"} fill="#B07A4A" stroke={LN} strokeWidth={6} />
        <rect x={sd < 0 ? -220 : 190} y={40} width={30} height={200} fill="#8A5A32" stroke={LN} strokeWidth={5} />
      </g>
    ))}
  </g>
);

// ── Mahmutpaşa yokuşu: eğimli taş yol, hanlar, dükkânlar, kalabalık, bitiş şeridi (finish: 0..1 görünür)
export const Mahmutpasa: React.FC<{ t: number; px?: number; finish?: number; crowd?: number; dusk?: number; broke?: number }> = ({ t, px = 0, finish = 0, crowd = 1, dusk = 0, broke = 0 }) => {
  const slope = 0.16;
  const gy = (x: number) => 1000 - x * slope;
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      {/* Süleymaniye silueti tepede */}
      <g transform="translate(1500,330)" fill="#8C7EA0" opacity={0.6}>
        <path d="M-160,40 L-160,-20 A160,120 0 0 1 160,-20 L160,40Z" /><rect x={-230} y={-170} width={14} height={210} /><rect x={216} y={-170} width={14} height={210} /><rect x={-300} y={-120} width={12} height={160} /><rect x={288} y={-120} width={12} height={160} />
      </g>
      <g transform={`translate(${-px},${-px * slope})`}>
        {Array.from({ length: 12 }, (_, i) => {
          const bx = -300 + i * 260, base = gy(bx + 130) - 40;
          return (
            <g key={i}>
              <rect x={bx} y={base - 520} width={250} height={560} fill={["#D9C3A0", "#CDB287", "#E6D5BA"][i % 3]} stroke="#9E8460" strokeWidth={4} />
              <path d={`M${bx + 20},${base} L${bx + 20},${base - 180} A105,90 0 0 1 ${bx + 230},${base - 180} L${bx + 230},${base}Z`} fill="#3A2A20" />
              {i % 2 === 0 && Array.from({ length: 4 }, (_, k) => <rect key={k} x={bx + 40 + k * 44} y={base - 150} width={34} height={140} fill={[T.red, T.blue, T.yellow, T.green][(k + i) % 4]} opacity={0.85} />)}
              {i % 2 === 1 && Array.from({ length: 6 }, (_, k) => <rect key={k} x={bx + 40 + (k % 3) * 60} y={base - 160 + Math.floor(k / 3) * 70} width={50} height={56} fill="#C9965A" stroke={LN} strokeWidth={3} />)}
              <rect x={bx + 10} y={base - 240} width={230} height={44} fill={["#B23A3F", "#2A5DA8", "#3FAE6A"][i % 3]} />
              <text x={bx + 125} y={base - 208} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={20} fill="#FFF3D6">{["TEKSTİL", "TOPTAN", "ZÜCCACİYE", "KUMAŞ", "OYUNCAK", "PERDE"][i % 6]}</text>
              {Array.from({ length: 3 }, (_, k) => <rect key={"w" + k} x={bx + 30 + k * 76} y={base - 470} width={46} height={80} rx={20} fill="#6E8FA8" stroke="#5E4428" strokeWidth={3} />)}
            </g>
          );
        })}
        <path d={`M-400,${gy(-400)} L3400,${gy(3400)} L3400,1600 L-400,1600Z`} fill="#A08A6A" />
        <path d={`M-400,${gy(-400)} L3400,${gy(3400)} L3400,1600 L-400,1600Z`} fill="url(#tStone)" opacity={0.8} />
        {finish > 0 && (
          <g opacity={finish}>
            {[1500, 1900].map((fx) => <rect key={fx} x={fx - 8} y={gy(fx) - 300} width={16} height={300} fill="#3A3F48" />)}
            {broke > 0 ? (
              <g><path d={`M1508,${gy(1508) - 200} q60,${40 + broke * 80} 120,${broke * 160}`} stroke={T.red} strokeWidth={14} fill="none" /><path d={`M1892,${gy(1892) - 200} q-60,${40 + broke * 80} -120,${broke * 160}`} stroke={T.red} strokeWidth={14} fill="none" /></g>
            ) : <path d={`M1508,${gy(1508) - 200} Q1700,${gy(1700) - 180 + Math.sin(t * 3) * 6} 1892,${gy(1892) - 200}`} stroke={T.red} strokeWidth={14} fill="none" />}
            <rect x={1540} y={gy(1700) - 380} width={320} height={60} rx={10} fill="#FFF8E6" stroke={LN} strokeWidth={4} />
            <text x={1700} y={gy(1700) - 338} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill={T.red}>BİTİŞ</text>
          </g>
        )}
      </g>
      {crowd > 0 && Array.from({ length: 22 }, (_, i) => {
        const cx = ((i * 97) % 2100) - 90;
        return <TMini key={i} x={cx} y={Math.min(1080, gy(cx + px) + 120) + (i % 3) * 10} s={1.15 + (i % 3) * 0.12} c={MINI_COLS[(i * 5) % MINI_COLS.length]} t={t} seed={i} />;
      })}
    </g>
  );
};
export const mahGY = (x: number, px = 0) => 1000 - (x + px) * 0.16;

// ── Eminönü rıhtımı: Yeni Cami, Galata Köprüsü, vapur (drift: 0 uzak/serbest → 1 iskeleye yanaştı), demir baba + halat
export const Rihtim: React.FC<{ t: number; drift?: number; rope?: number; tense?: number; dusk?: number; crowd?: number; ropeTo?: [number, number]; panic?: number }> = ({ t, drift = 0, rope = 0, tense = 0, dusk = 1, crowd = 1, ropeTo = [700, 760], panic = 0 }) => {
  const vx = lerp(1500, 1180, drift), vy = 640 + Math.sin(t * 1.4) * 6 * (1 - drift);
  const rot = (1 - drift) * -4 + Math.sin(t * 0.9) * 0.6 * (1 - drift);
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      <circle cx={420} cy={300} r={80} fill="#FBD38D" opacity={0.8 * dusk} />
      {/* Yeni Cami + Galata Kulesi uzakta */}
      <g fill="#5A4A6A" opacity={0.8}>
        <g transform="translate(330,470)"><path d="M-170,0 L-170,-70 A170,130 0 0 1 170,-70 L170,0Z" /><path d="M-90,-120 A90,70 0 0 1 90,-120Z" /><rect x={-230} y={-260} width={14} height={260} /><path d="M-230,-260 l7,-40 l7,40Z" /><rect x={216} y={-260} width={14} height={260} /><path d="M216,-260 l7,-40 l7,40Z" /></g>
        <g transform="translate(1720,430)"><rect x={-30} y={-180} width={60} height={220} /><path d="M-40,-180 L0,-260 L40,-180Z" /></g>
      </g>
      <rect y={470} width={1920} height={400} fill="#2F6E9E" />
      <rect y={470} width={1920} height={400} fill="#F7A86A" opacity={0.2 * dusk} />
      {/* Galata Köprüsü */}
      <g transform="translate(0,500)">
        <rect x={900} y={0} width={1100} height={40} fill="#6E7A86" stroke={LN} strokeWidth={4} />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={960 + i * 180} y={40} width={40} height={180} fill="#5E6670" stroke={LN} strokeWidth={3} />)}
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${910 + i * 36},0 V-26`} stroke="#5E6670" strokeWidth={3} />)}
        {Array.from({ length: 10 }, (_, i) => <path key={"f" + i} d={`M${940 + i * 100},-26 l${-20 + Math.sin(t + i) * 8},-90`} stroke="#3A3F48" strokeWidth={2} />)}
      </g>
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${md(i * 173 + t * 25, 2100) - 100},${520 + (i % 7) * 46} q22,-8 44,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.45} />)}
      <g transform={`rotate(${rot} ${vx} ${vy})`}><Vapur x={vx} y={vy} s={0.9} t={t} /></g>
      {panic > 0 && Array.from({ length: 8 }, (_, i) => <text key={i} x={vx - 300 + i * 80} y={vy - 190 - Math.abs(Math.sin(t * 6 + i)) * 20} fontFamily="Poppins" fontWeight={800} fontSize={34} fill={T.red} opacity={panic}>!</text>)}
      {/* rıhtım */}
      <rect y={800} width={1920} height={280} fill="#A79A88" />
      <rect y={800} width={1920} height={280} fill="url(#tStone)" opacity={0.9} />
      <rect y={800} width={1920} height={14} fill="#6E6456" />
      <rect y={830} width={1920} height={250} fill="#7FA9C2" opacity={0.12 + 0.06 * Math.sin(t * 2)} />
      {/* demir baba */}
      <g transform="translate(700,820)">
        <path d="M-40,0 L-34,-90 Q0,-120 34,-90 L40,0Z" fill="#2E333B" stroke={LN} strokeWidth={6} />
        <ellipse cx={0} cy={-96} rx={46} ry={18} fill="#3A3F48" stroke={LN} strokeWidth={5} />
      </g>
      {rope > 0 && (
        <path d={`M${vx - 330},${vy - 20} Q${lerp(vx - 330, ropeTo[0], 0.5)},${lerp(vy, ropeTo[1], 0.5) + 120 * (1 - tense)} ${ropeTo[0]},${ropeTo[1]}`} stroke={tense > 0.6 ? "#F2D27A" : "#C9A66B"} strokeWidth={14} fill="none" opacity={rope} strokeDasharray={`${rope * 2000} 2000`} />
      )}
      {crowd > 0 && Array.from({ length: 14 }, (_, i) => {
        const cx = 900 + ((i * 131) % 1100);
        return <TMini key={i} x={cx} y={1040 + (i % 3) * 14} s={1.3 + (i % 3) * 0.1} c={MINI_COLS[(i * 7) % MINI_COLS.length]} t={t} seed={i} />;
      })}
    </g>
  );
};

// ── halat yakın çekim: el halatı tutuyor. grip: 0 gevşek → 1 sıkı (sıkınca lifler kopar), soft: yumuşak tutuş parıltısı
export const HalatEl: React.FC<{ t: number; grip?: number; soft?: number; fray?: number }> = ({ t, grip = 0, soft = 0, fray = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#1E2A3A" />
    <rect width={1920} height={1080} fill="#F7A86A" opacity={0.12} />
    <path d={`M-100,${560 + Math.sin(t * 2) * 6} C600,${540 - grip * 20} 1300,${580 + grip * 20} 2020,${540 + Math.sin(t * 2.3) * 6}`} stroke="#C9A66B" strokeWidth={70} fill="none" />
    {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${-100 + i * 90},530 l40,60`} stroke="#9E7E48" strokeWidth={8} />)}
    {fray > 0 && Array.from({ length: 10 }, (_, i) => <path key={"f" + i} d={`M${1100 + i * 12},${560} l${30 + rnd(i) * 60},${-40 - rnd(i + 3) * 80 * fray}`} stroke="#E9D3A8" strokeWidth={5} opacity={fray} />)}
    {soft > 0 && <ellipse cx={960} cy={560} rx={420} ry={220} fill={TQ} opacity={0.14 * soft} />}
    <g transform={`translate(960,${580}) scale(${2.2 - grip * 0.06})`}>
      <path d="M-120,-40 Q-140,-90 -80,-100 L80,-100 Q140,-90 130,-30 L120,40 Q60,70 -90,50Z" fill="#FBE7D2" stroke={LN} strokeWidth={4} />
      {[-70, -25, 20, 65].map((fx) => <path key={fx} d={`M${fx},-100 Q${fx + 10},${-20 - grip * 30} ${fx + 4},40`} stroke="#E0B894" strokeWidth={3} fill="none" />)}
      <text x={0} y={-130} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={TQ}>×1.073.741.824</text>
    </g>
  </g>
);

// ── bitiş çizgisi kalabalık telefonları (dikey ekranlar)
export const Telefonlar: React.FC<{ t: number; n?: number; k?: number }> = ({ t, n = 9, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${160 + i * 200},${800 + Math.sin(t * 2 + i) * 12 + (i % 2) * 40}) rotate(${(rnd(i) - 0.5) * 16})`}>
        <rect x={-50} y={-90} width={100} height={180} rx={14} fill="#1C1C1C" /><rect x={-42} y={-80} width={84} height={150} rx={8} fill="#7FD8F0" />
        <circle cx={28} cy={-66} r={7} fill={T.red} opacity={Math.sin(t * 4 + i) > 0 ? 1 : 0.3} />
        <path d={`M-30,80 Q0,${110 + i % 3 * 6} 30,80`} stroke="#F4D2B4" strokeWidth={28} strokeLinecap="round" fill="none" />
      </g>
    ))}
  </g>
);
