import React from "react";
import { lerp } from "./Toon";
import { morsOf } from "./YolVan";

// Kanal 2 · k2r-18 "Üç Gece" kiti (2026-11-21). YolVan/SonIki ile aynı düz renk stili, zemin ~1040.
// Van sokağı (Erek Dağı, taş basamak, sokak lambası, kar), "Van'a Hoş Geldiniz" kahverengi tabela (Van kedisi logolu),
// mavi yön levhası (vida + yeni çizik + sökülmüş direk), buğulu cam (parmakla Mors), avuç içi Mors, bodrum (40 bidon + kamyonet),
// kamyonet, satranç, gece mutfağı, Van kahvaltısı (murtuğa), kar meleği, kırık kapı, ÜÇ GECE sayacı, deneme kartları.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const rnd = (i: number) => md(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
type Mode = "day" | "dusk" | "night";

// ───────── yağan kar (her sahnede aynı) ─────────
export const Kar: React.FC<{ t: number; k?: number; wind?: number; n?: number }> = ({ t, k = 1, wind = 0.3, n = 140 }) => (
  <g opacity={k} pointerEvents="none">
    {Array.from({ length: n }, (_, i) => {
      const sp = 40 + rnd(i) * 90, r = 2 + rnd(i + 9) * 5;
      const y = md(rnd(i + 3) * 1200 + t * sp, 1200) - 60;
      const x = md(rnd(i + 5) * 2000 + t * sp * wind + Math.sin(t * 1.3 + i) * 18, 2000) - 40;
      return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.55 + rnd(i + 1) * 0.4} />;
    })}
  </g>
);

const SKY: Record<Mode, [string, string]> = { day: ["#A9D6EE", "#EAF5FA"], dusk: ["#46407E", "#F2A86A"], night: ["#070E20", "#18284A"] };
// Erek Dağı (3204 m) — şehrin doğusunda, her gündüz sahnesinin arkasında
export const Erek: React.FC<{ mode?: Mode; y?: number }> = ({ mode = "day", y = 0 }) => {
  const c = mode === "day" ? "#8FA6BC" : mode === "dusk" ? "#4A3E62" : "#111A32";
  const cap = mode === "night" ? "#9AA8BE" : "#F4F8FB";
  return (
    <g transform={`translate(0,${y})`}>
      <path d="M-40,640 L260,470 L520,380 L760,250 L900,300 L1040,210 L1220,330 L1460,300 L1700,430 L1960,520 L1960,720 L-40,720Z" fill={c} />
      <path d="M680,300 L760,250 L830,286 L900,300 L960,262 L1040,210 L1120,268 L1060,282 L990,300 L930,322 L860,310 L790,316 L720,322Z" fill={cap} opacity={mode === "night" ? 0.5 : 0.95} />
    </g>
  );
};

// Van sokağı: taş basamak (sol alt), sokak lambası, beton/taş evler, düz kar damları, Erek arkada.
export const VanSokak: React.FC<{ t: number; mode?: Mode; snow?: number; lamp?: number; px?: number; steps?: boolean; windows?: number }> = ({ t, mode = "day", snow = 1, lamp = 0, px = 0, steps = true, windows = 0 }) => {
  const [s1, s2] = SKY[mode];
  const id = `vs${mode}`;
  const wall = mode === "day" ? ["#D9CBB4", "#C9B89C", "#BFAE96", "#D2C2A8"] : mode === "dusk" ? ["#8A7468", "#7A6658", "#6E5C52", "#806A5E"] : ["#2A2C3C", "#24263A", "#202234", "#282A3E"];
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s1} /><stop offset="1" stopColor={s2} /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} />
      {mode === "night" && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 71) % 360} r={1 + (i % 2)} fill="#FFFFFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />)}
      <Erek mode={mode} />
      <g transform={`translate(${-md(px * 0.4, 2400)},0)`}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = i * 190 - 60, h = 300 + ((i * 97) % 180), w = 180;
          const top = 860 - h;
          return (
            <g key={i}>
              <rect x={x} y={top} width={w} height={h} fill={wall[i % 4]} />
              <rect x={x - 6} y={top - 18} width={w + 12} height={22} fill="#F4F8FB" opacity={snow} rx={8} />
              {Array.from({ length: Math.floor(h / 90) }, (_, r) => [0, 1].map((cIdx) => {
                const lit = windows > 0 && rnd(i * 7 + r * 3 + cIdx) > 0.72;
                return <rect key={`${r}${cIdx}`} x={x + 30 + cIdx * 80} y={top + 40 + r * 90} width={46} height={52} rx={4}
                  fill={lit ? "#FFD98A" : mode === "day" ? "#5C7084" : "#121628"} opacity={lit ? windows : 0.85} />;
              }))}
              <rect x={x + 30} y={top + 40} width={46} height={6} fill="#F4F8FB" opacity={snow * 0.8} />
            </g>
          );
        })}
      </g>
      {/* yol + kaldırım */}
      <rect y={860} width={1920} height={220} fill={mode === "night" ? "#8E9AB2" : "#E8EEF3"} />
      <rect y={860} width={1920} height={18} fill={mode === "night" ? "#6E7A92" : "#C9D3DC"} />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={md(i * 260 - px, 2200) - 100} cy={960 + (i % 3) * 30} rx={70} ry={8} fill="#B9C6D2" opacity={0.5} />)}
      {/* sokak lambası */}
      <g transform="translate(470,0)">
        <rect x={-10} y={330} width={20} height={600} fill="#2E3440" />
        <path d="M0,340 Q0,300 60,300 L120,300" stroke="#2E3440" strokeWidth={14} fill="none" />
        <path d="M96,300 L148,300 L140,326 L104,326Z" fill="#3A404C" />
        <ellipse cx={122} cy={328} rx={20} ry={7} fill={lamp > 0 ? "#FFE6A0" : "#8A8F98"} />
        {lamp > 0 && <path d="M104,328 L-160,1040 L420,1040 L140,328Z" fill="#FFE6A0" opacity={lamp * (0.16 + 0.02 * Math.sin(t * 7))} />}
        {lamp > 0 && <circle cx={122} cy={330} r={70} fill="#FFE6A0" opacity={lamp * 0.25} />}
        <rect x={-14} y={326} width={28} height={10} rx={4} fill="#F4F8FB" opacity={snow} />
      </g>
      {/* taş basamak */}
      {steps && <g>
        <rect x={140} y={958} width={560} height={50} rx={6} fill="#8E8576" /><rect x={140} y={958} width={560} height={10} fill="#F4F8FB" opacity={snow * 0.9} rx={5} />
        <rect x={110} y={1004} width={620} height={76} rx={6} fill="#7A7264" />
        {[220, 360, 520, 640].map((x) => <line key={x} x1={x} y1={962} x2={x - 8} y2={1004} stroke="#6A6256" strokeWidth={4} />)}
      </g>}
    </g>
  );
};

// ───────── tabelalar ─────────
// Kahverengi il giriş tabelası (turistik), Van kedisi logolu
export const HosGeldin: React.FC<{ x?: number; y?: number; s?: number; snow?: number; tilt?: number }> = ({ x = 1240, y = 1040, s = 1, snow = 1, tilt = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}>
    <rect x={-230} y={-420} width={22} height={420} fill="#7A7F88" /><rect x={208} y={-420} width={22} height={420} fill="#7A7F88" />
    <rect x={-300} y={-560} width={600} height={250} rx={16} fill="#6B3F22" stroke="#FFFFFF" strokeWidth={10} />
    <text x={0} y={-470} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={58} fill="#FFFFFF">VAN'A</text>
    <text x={0} y={-400} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={58} fill="#FFFFFF">HOŞ GELDİNİZ</text>
    <text x={0} y={-344} textAnchor="middle" fontFamily="Poppins" fontWeight={600} fontSize={22} fill="#F3E2CF">VAN BÜYÜKŞEHİR BELEDİYESİ</text>
    <g transform="translate(-230,-490) scale(0.5)"><circle r={50} fill="#F4F1EA" /><path d="M-44,-24 L-36,-70 L-10,-44Z M44,-24 L36,-70 L10,-44Z" fill="#F4F1EA" /><circle cx={-18} cy={-4} r={10} fill="#4A9BE8" /><circle cx={18} cy={-4} r={10} fill="#F2B23A" /></g>
    <rect x={-306} y={-572} width={612} height={30} rx={14} fill="#F4F8FB" opacity={snow} />
  </g>
);
// Mavi yön levhası. turn: 0..1 levha ok yönü ters döner; scratch: vidalarda yeni çizik; up: 0..1 direk sökülür (yerden kalkar)
export const YonLevha: React.FC<{ x?: number; y?: number; s?: number; t?: number; lines?: [string, string][]; scratch?: number; up?: number; snow?: number; fresh?: number; bolts?: boolean }> = ({ x = 1300, y = 1040, s = 1, t = 0, lines = [["ERCİŞ", "↑"], ["GEVAŞ", "→"]], scratch = 0, up = 0, snow = 1, fresh = 0, bolts = true }) => (
  <g transform={`translate(${x},${y - up * 260}) scale(${s}) rotate(${up * -14})`}>
    <rect x={-14} y={-560} width={28} height={560 + up * 120} fill="#8A9099" />
    {up > 0 && <g opacity={up}>{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-20 + i * 8},${up * 120} q${(i - 3) * 10},40 ${(i - 3) * 18},60`} stroke="#6B4E36" strokeWidth={8} fill="none" />)}<ellipse cx={0} cy={up * 120} rx={60} ry={20} fill="#6B4E36" /></g>}
    <rect x={-260} y={-640} width={520} height={240} rx={14} fill="#1F5FAE" stroke="#FFFFFF" strokeWidth={8} />
    {lines.map(([n, a], i) => <g key={i}><text x={-220} y={-560 + i * 100} fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#FFFFFF">{n}</text><text x={210} y={-560 + i * 100} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={66} fill="#FFFFFF">{a}</text></g>)}
    {bolts && [[-230, -612], [230, -612], [-230, -428], [230, -428]].map(([bx, by], i) => <g key={i}>
      <circle cx={bx} cy={by} r={12} fill={fresh > 0 ? "#E6EAEE" : "#8A6A4A"} /><circle cx={bx} cy={by} r={12} fill="#C9CED4" opacity={fresh} />
      {scratch > 0 && <g opacity={scratch}><path d={`M${bx - 16},${by - 4} L${bx + 16},${by + 6} M${bx - 12},${by + 10} L${bx + 14},${by - 12}`} stroke="#FFFFFF" strokeWidth={3} /><circle cx={bx} cy={by} r={18} fill="#FFFFFF" opacity={0.25 + 0.2 * Math.sin(t * 8 + i)} /></g>}
    </g>)}
    <rect x={-266} y={-652} width={532} height={26} rx={12} fill="#F4F8FB" opacity={snow} />
  </g>
);

// ───────── buğulu cam + parmakla Mors ─────────
// text: yazılan kelimeler; k: yazılan oran (0..1); read: çözülen harf oranı (0..1) — harfler altında belirir
export const BuzluCam: React.FC<{ t: number; text: string; k?: number; read?: number; night?: number; finger?: boolean; out?: React.ReactNode }> = ({ t, text, k = 1, read = 0, night = 0, finger = true, out }) => {
  const letters = text.toUpperCase().split("");
  const codes = letters.map((ch) => (ch === " " ? " " : morsOf(ch)));
  const total = codes.reduce((n, c) => n + Math.max(1, c.length), 0);
  let drawn = 0; const shown = k * total;
  const startX = 960 - letters.length * 70;
  let tipX = startX, tipY = 470;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#0E1424" : "#6A5444"} />
      <rect x={300} y={120} width={1320} height={820} rx={10} fill={night ? "#2A3650" : "#C9DCE8"} />
      <g opacity={1}>{out ?? <><rect x={300} y={120} width={1320} height={820} fill={night ? "#1A2440" : "#DCE8F0"} /><path d="M300,700 L700,560 L1000,640 L1300,520 L1620,600 L1620,940 L300,940Z" fill={night ? "#26324E" : "#F4F8FB"} /></>}</g>
      {/* buğu */}
      <rect x={300} y={120} width={1320} height={820} fill={night ? "#7A88A6" : "#EEF3F6"} opacity={0.72} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={320 + rnd(i) * 1280} cy={140 + rnd(i + 7) * 780} r={6 + rnd(i + 2) * 22} fill="#FFFFFF" opacity={0.12} />)}
      {/* çerçeve */}
      <rect x={290} y={110} width={1340} height={840} rx={14} fill="none" stroke={night ? "#3A2A20" : "#F2EDE4"} strokeWidth={30} />
      <rect x={950} y={110} width={20} height={840} fill={night ? "#3A2A20" : "#F2EDE4"} />
      <rect x={250} y={940} width={1420} height={50} rx={8} fill={night ? "#2A1E16" : "#E6DED0"} />
      {/* parmak izleri */}
      {letters.map((ch, li) => {
        const lx = startX + li * 140;
        const code = codes[li];
        let cx = 0;
        const marks = code === " " ? [] : code.split("").map((c, ci) => {
          const w = c === "." ? 26 : 70;
          const idx = drawn + ci;
          const vis = cl(shown - idx);
          const el = <rect key={ci} x={lx - 50 + cx} y={c === "." ? 458 : 462} width={w * vis} height={c === "." ? 26 : 18} rx={12} fill={night ? "#0E1424" : "#5A6E80"} opacity={0.85} />;
          if (vis > 0 && vis < 1.01) { tipX = lx - 50 + cx + w * vis; tipY = 470; }
          cx += w + 14;
          return el;
        });
        drawn += Math.max(1, code.length);
        const rd = cl(read * letters.length - li);
        return <g key={li}>{marks}{ch !== " " && rd > 0 && <text x={lx} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={86} fill="#F6C445" opacity={rd} stroke="#0E1A2E" strokeWidth={6} paintOrder="stroke">{ch}</text>}</g>;
      })}
      {finger && k > 0 && k < 1 && <g transform={`translate(${tipX},${tipY})`}><ellipse cx={10} cy={70} rx={34} ry={90} fill="#F1C9A5" /><ellipse cx={4} cy={4} rx={16} ry={20} fill="#E8B892" /></g>}
    </g>
  );
};

// Avuç içi yakın plan: parmak kısa-uzun-kısa çizer (iz parlar). k: 0..1
export const Avuc: React.FC<{ t: number; k?: number; code?: string; night?: number }> = ({ t, k = 1, code = ".-.", night = 1 }) => {
  const parts = code.split("");
  const n = parts.length;
  let x = 760;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#2A3A5E" : "#6A5444"} />
      <circle cx={960} cy={560} r={520} fill="#FFE6A0" opacity={0.12} />
      <path d="M600,1080 L640,640 Q660,520 780,500 L1180,500 Q1300,520 1320,640 L1360,1080Z" fill="#141414" />
      <path d="M700,600 Q720,430 960,420 Q1200,430 1220,600 Q1230,800 960,840 Q690,800 700,600Z" fill="#1E1E1E" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={720 + i * 130} y={240 - (i === 1 || i === 2 ? 40 : 0)} width={100} height={240} rx={50} fill="#1E1E1E" />)}
      <path d="M760,560 Q900,620 1100,560 M780,680 Q960,720 1140,660" stroke="#2C2C2C" strokeWidth={6} fill="none" />
      {parts.map((c, i) => {
        const vis = cl(k * n - i);
        if (c === " ") { x += 60; return null; }
        const w = c === "." ? 40 : 150;
        const el = <g key={i}><rect x={x} y={600} width={w * vis} height={30} rx={15} fill="#2EE6D0" opacity={0.9 * vis} /><rect x={x - 8} y={590} width={w * vis + 16} height={50} rx={25} fill="#2EE6D0" opacity={0.25 * vis} /></g>;
        x += w + 40;
        return el;
      })}
      {/* Defne'nin parmağı (mercan kazak kolu) */}
      {k > 0 && k < 1 && (() => {
        let fx = 760; const idx = Math.floor(k * n); const W = (c: string) => (c === " " ? 60 : (c === "." ? 40 : 150) + 40);
        for (let i = 0; i < idx; i++) fx += W(parts[i]);
        fx += (parts[idx] === " " ? 0 : parts[idx] === "." ? 40 : 150) * (k * n - idx);
        return <g transform={`translate(${fx},612)`}><path d="M0,0 L-60,-420 L60,-460 L30,0Z" fill="#141414" /><path d="M-70,-420 L70,-470 L120,-1100 L-140,-1100Z" fill="#E0566A" /><circle cx={6} cy={0} r={22} fill="#1A1A1A" /></g>;
      })()}
    </g>
  );
};

// ───────── bodrum + kamyonet ─────────
export const Kamyonet: React.FC<{ x: number; y: number; s?: number; t: number; c?: string; lights?: number; speed?: number; cans?: number; dir?: 1 | -1; front?: React.ReactNode; back?: React.ReactNode; snow?: number; food?: boolean }> = ({ x, y, s = 1, t, c = "#5E6A74", lights = 0, speed = 0, cans = 0, dir = 1, front, back, snow = 0, food = false }) => {
  const rot = t * speed * 600;
  const wheel = (wx: number) => <g transform={`translate(${wx},-60)`}><circle r={62} fill="#1E1E1E" /><circle r={30} fill="#9AA0A8" /><g transform={`rotate(${rot})`}>{[0, 72, 144, 216, 288].map((d) => <rect key={d} x={-4} y={-28} width={8} height={22} fill="#5A5F68" transform={`rotate(${d})`} />)}</g></g>;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={6} rx={380} ry={20} fill="#000" opacity={0.18} />
      {/* kasa */}
      <rect x={-380} y={-200} width={390} height={120} rx={8} fill={c} /><rect x={-372} y={-200} width={374} height={14} fill="#00000022" />
      {Array.from({ length: cans }, (_, i) => <g key={i} transform={`translate(${-350 + (i % 6) * 58},${-200 - Math.floor(i / 6) * 70})`}><rect x={0} y={-70} width={50} height={70} rx={8} fill={i % 2 ? "#D93A2E" : "#E0B020"} /><rect x={30} y={-82} width={14} height={14} fill="#2A2A2A" /></g>)}
      {food && <g transform="translate(-120,-260)"><rect x={-60} y={-40} width={110} height={60} rx={6} fill="#C9A06A" /><rect x={-50} y={-80} width={80} height={44} rx={6} fill="#B08850" /></g>}
      {/* kabin */}
      <path d="M10,-80 L10,-300 Q14,-330 50,-330 L230,-330 Q262,-330 280,-300 L340,-210 Q380,-200 390,-170 L390,-80Z" fill={c} />
      <path d="M40,-300 L40,-210 L150,-210 L150,-300Z" fill="#9FC6DD" /><path d="M170,-300 L170,-210 L320,-210 L258,-300Z" fill="#9FC6DD" />
      {snow > 0 && <path d="M40,-334 Q150,-352 262,-334 L262,-326 L40,-326Z" fill="#F4F8FB" opacity={snow} />}
      <g transform="translate(95,-205)">{back}</g><g transform="translate(245,-205)">{front}</g>
      <rect x={-390} y={-90} width={790} height={26} rx={10} fill="#2A2E34" />
      {wheel(-250)}{wheel(270)}
      <rect x={370} y={-170} width={26} height={30} rx={6} fill={lights > 0 ? "#FFF3C0" : "#C9CED4"} />
      {lights > 0 && <path d="M396,-160 L1300,-320 L1300,140 L396,-130Z" fill="#FFF3C0" opacity={lights * 0.28} />}
      <rect x={-392} y={-160} width={14} height={30} rx={4} fill="#E0393E" opacity={0.6 + lights * 0.4} />
    </g>
  );
};

const BidonK: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#D93A2E" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-46} y={-130} width={92} height={130} rx={10} fill={c} /><path d="M-34,-118 L34,-12 M34,-118 L-34,-12" stroke="#00000033" strokeWidth={6} />
    <rect x={-30} y={-152} width={36} height={18} rx={4} fill="#2A2A2A" /><path d="M10,-130 L40,-152 L40,-130Z" fill={c} />
  </g>
);
// Bodrum: kilitli kapı (open 0..1), fener (beam), 40 bidon, kamyonet, harita (plan)
export const Bodrum: React.FC<{ t: number; beam?: number; cans?: number; truck?: boolean; open?: number; plan?: number }> = ({ t, beam = 1, cans = 40, truck = true, open = 1, plan = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0D14" />
    <rect y={820} width={1920} height={260} fill="#11151E" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={100} width={160} height={70} fill="#151A24" />)}
    {Array.from({ length: cans }, (_, i) => { const col = i % 10, row = Math.floor(i / 10); return <BidonK key={i} x={180 + col * 104 + (row % 2) * 30} y={840 - row * 40} s={0.82 - row * 0.06} c={i % 3 ? "#D93A2E" : "#E0B020"} />; })}
    {truck && <Kamyonet x={1500} y={960} s={0.85} t={t} cans={12} food />}
    {plan > 0 && <g opacity={plan} transform="translate(1480,690) rotate(-8)"><rect x={-90} y={-60} width={180} height={120} fill="#E9DCC6" /><path d="M-70,40 Q-20,-30 30,0 T80,-40" stroke="#E0393E" strokeWidth={6} fill="none" /></g>}
    <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.55 * (1 - beam)} />
    {beam > 0 && <path d={`M960,1080 L${300 + Math.sin(t * 0.7) * 80},300 L${1500 + Math.sin(t * 0.7) * 80},360 Z`} fill="#FFF3C8" opacity={beam * 0.2} />}
    {open < 1 && <g><rect width={1920} height={1080} fill="#3A2A1E" opacity={1 - open} /><rect x={760 - open * 700} y={120} width={400} height={900} fill="#4A3426" opacity={1 - open} /></g>}
  </g>
);
// kapı kilidi + saç tokası yakın plan
export const Kilit: React.FC<{ t: number; k?: number }> = ({ t, k = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A3426" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={0} y={i * 120} width={1920} height={6} fill="#3A281C" />)}
    <rect x={760} y={360} width={400} height={300} rx={20} fill="#9A8A6A" stroke="#6E6048" strokeWidth={10} />
    <circle cx={960} cy={480} r={40} fill="#2A2A2A" /><rect x={946} y={480} width={28} height={80} fill="#2A2A2A" />
    <g transform={`translate(960,500) rotate(${-30 + k * 60})`}><rect x={0} y={-6} width={420} height={12} rx={6} fill="#F6C445" /><circle cx={420} cy={0} r={16} fill="#F6C445" /></g>
    {k >= 1 && <circle cx={960} cy={500} r={120} fill="#FFFFFF" opacity={0.2 + 0.1 * Math.sin(t * 10)} />}
  </g>
);

// ───────── iç mekânlar ─────────
// Gece mutfağı: pencere (kar), masa, tek mum
export const Mutfak: React.FC<{ t: number; night?: number; candle?: number; snow?: number }> = ({ t, night = 1, candle = 1, snow = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#141A2A" : "#E9DDC5"} />
    <rect y={820} width={1920} height={260} fill={night ? "#1A1F2E" : "#C9B89C"} />
    <rect x={1220} y={180} width={520} height={420} rx={8} fill={night ? "#0A1226" : "#BFE0F0"} />
    <g><clipPath id="mutw"><rect x={1220} y={180} width={520} height={420} /></clipPath><g clipPath="url(#mutw)"><path d="M1220,520 L1400,470 L1560,500 L1740,460 L1740,600 L1220,600Z" fill="#DDE6F0" opacity={0.6} />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={1220 + md(rnd(i) * 520 + t * 12, 520)} cy={180 + md(rnd(i + 3) * 420 + t * (40 + rnd(i) * 40), 420)} r={3 + rnd(i) * 3} fill="#FFFFFF" opacity={snow * 0.8} />)}</g></g>
    <rect x={1210} y={170} width={540} height={440} rx={10} fill="none" stroke="#3A2A20" strokeWidth={22} /><rect x={1470} y={170} width={18} height={440} fill="#3A2A20" />
    {/* tezgâh + dolaplar */}
    <rect x={80} y={300} width={700} height={220} fill={night ? "#2A2232" : "#C9A57A"} />{[0, 1, 2].map((i) => <rect key={i} x={100 + i * 230} y={320} width={210} height={180} rx={6} fill={night ? "#322840" : "#B88E62"} />)}
    <rect x={60} y={620} width={760} height={30} fill={night ? "#3A3040" : "#8A6A4A"} /><rect x={80} y={650} width={720} height={200} fill={night ? "#2A2232" : "#A8845A"} />
    {/* masa */}
    <rect x={700} y={760} width={600} height={28} rx={8} fill="#6E4A2E" /><rect x={730} y={788} width={22} height={240} fill="#5A3A26" /><rect x={1248} y={788} width={22} height={240} fill="#5A3A26" />
    {candle > 0 && <g transform="translate(1000,760)"><rect x={-12} y={-70} width={24} height={70} fill="#F4EAD6" /><path d={`M0,-70 q${6 + Math.sin(t * 9) * 3},-20 0,-40 q-6,20 0,40`} fill="#FFC24A" /><circle cx={0} cy={-90} r={160} fill="#FFC24A" opacity={candle * (0.12 + 0.03 * Math.sin(t * 11))} /></g>}
    {night > 0 && <rect width={1920} height={1080} fill="#0A1020" opacity={0.25} />}
  </g>
);

// Van kahvaltısı: uzun masa, murtuğa tavası, otlu peynir, bal-kaymak, sucuk, ince belli çaylar, simit
export const VanKahvalti: React.FC<{ t: number; steam?: number; sucuk?: number }> = ({ t, steam = 1, sucuk = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9D7B8" />
    <rect x={1300} y={120} width={460} height={380} rx={8} fill="#CFE6F2" /><rect x={1290} y={110} width={480} height={400} rx={10} fill="none" stroke="#F2EDE4" strokeWidth={22} />
    <path d="M1300,420 L1460,360 L1600,400 L1760,350 L1760,500 L1300,500Z" fill="#F4F8FB" />
    <rect y={640} width={1920} height={440} fill="#B5532E" /><rect y={640} width={1920} height={20} fill="#9A4426" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={660} width={80} height={420} fill="#C46A3E" opacity={0.35} />)}
    {/* murtuğa tavası (bakır) */}
    <g transform="translate(960,740)"><ellipse rx={190} ry={60} fill="#B8733A" /><ellipse rx={160} ry={46} fill="#E8B24A" /><ellipse cx={-40} cy={-6} rx={50} ry={14} fill="#F6D27A" /><rect x={180} y={-12} width={160} height={22} rx={10} fill="#8A5428" />
      {steam > 0 && Array.from({ length: 4 }, (_, i) => { const ph = md(t * 0.6 + i / 4, 1); return <path key={i} d={`M${-60 + i * 40},${-40 - ph * 120} q14,-24 0,-48`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={steam * 0.5 * (1 - ph)} strokeLinecap="round" />; })}</g>
    {/* otlu peynir */}
    <g transform="translate(560,760)"><ellipse rx={120} ry={34} fill="#FFFFFF" /><rect x={-80} y={-50} width={160} height={56} rx={8} fill="#F4F1E6" />{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-70 + i * 15},${-40 + (i % 3) * 14} l10,-6`} stroke="#3E8E5A" strokeWidth={5} />)}</g>
    {/* bal + kaymak */}
    <g transform="translate(1340,770)"><ellipse rx={110} ry={32} fill="#FFFFFF" /><ellipse cx={-30} cy={-8} rx={56} ry={20} fill="#F6EFD8" /><ellipse cx={36} cy={-8} rx={40} ry={16} fill="#E8A21E" /></g>
    {/* sucuk */}
    <g transform="translate(260,800)" opacity={sucuk}><ellipse rx={110} ry={30} fill="#FFFFFF" />{[-50, -10, 30, 70].map((x) => <ellipse key={x} cx={x} cy={-8} rx={20} ry={14} fill="#A8322A" />)}</g>
    {/* çaylar */}
    {[420, 760, 1160, 1560].map((x, i) => <g key={i} transform={`translate(${x},880)`}><path d="M-20,-90 Q-30,-50 -16,-30 Q-26,-6 -20,0 L20,0 Q26,-6 16,-30 Q30,-50 20,-90Z" fill="#B8341A" opacity={0.9} /><path d="M-20,-90 L20,-90" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} /><ellipse cy={4} rx={44} ry={10} fill="#FFFFFF" /></g>)}
    {/* simit */}
    <g transform="translate(1700,830)"><circle r={60} fill="#C8843A" /><circle r={26} fill="#B5532E" />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={Math.cos(i) * 44} cy={Math.sin(i) * 44} r={3} fill="#F4E8C8" />)}</g>
  </g>
);

export const Satranc: React.FC<{ t?: number; k?: number }> = ({ t = 0, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A20" />
    <g transform="translate(960,560) scale(1,0.62) rotate(45)">
      {Array.from({ length: 64 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8; return <rect key={i} x={-320 + c * 80} y={-320 + r * 80} width={80} height={80} fill={(r + c) % 2 ? "#6E4A2E" : "#E9D7B8"} />; })}
    </g>
    {[[760, 420, 0], [880, 380, 1], [1020, 400, 0], [1160, 450, 1], [840, 640, 1], [1080, 680, 0], [960, 560, 1]].map(([x, y, w], i) => <g key={i} transform={`translate(${x},${y - (i === 6 ? k * 30 : 0)})`}><path d="M-22,0 L-16,-60 Q0,-80 16,-60 L22,0Z" fill={w ? "#F4F1EA" : "#1A1A1A"} /><circle cy={-74} r={14} fill={w ? "#F4F1EA" : "#1A1A1A"} /><ellipse rx={28} ry={8} fill={w ? "#D9D2C2" : "#2A2A2A"} /></g>)}
    {/* devrilmiş şah */}
    <g transform={`translate(1180,620) rotate(${k * 80})`}><path d="M-24,0 L-18,-80 Q0,-100 18,-80 L24,0Z" fill="#1A1A1A" /><rect x={-4} y={-126} width={8} height={30} fill="#1A1A1A" /><rect x={-14} y={-116} width={28} height={8} fill="#1A1A1A" /></g>
  </g>
);

export const KarMelegi: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    <path d="M0,-150 Q-140,-170 -180,-60 Q-120,-80 -60,-50 L-70,60 Q-120,140 -90,170 L0,90 L90,170 Q120,140 70,60 L60,-50 Q120,-80 180,-60 Q140,-170 0,-150Z" fill="#C9D6E2" />
    <circle cy={-170} r={56} fill="#C9D6E2" />
  </g>
);

export const KirikKapi: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DDC5" /><rect y={900} width={1920} height={180} fill="#B89A72" />
    <rect x={760} y={240} width={420} height={680} fill="#3A2A20" />
    <g transform={`translate(${760 + k * 260},${240 + k * 120}) rotate(${k * 24})`}><rect x={0} y={0} width={400} height={660} rx={6} fill="#8A5A36" /><rect x={30} y={40} width={340} height={260} fill="#9A6A42" /><rect x={30} y={340} width={340} height={280} fill="#9A6A42" /><circle cx={360} cy={340} r={14} fill="#D9B44A" /></g>
    {k > 0 && Array.from({ length: 8 }, (_, i) => <rect key={i} x={740 + rnd(i) * 80} y={260 + rnd(i + 1) * 600} width={18} height={6} fill="#6E4A2E" transform={`rotate(${rnd(i + 2) * 180} 760 ${300 + i * 60})`} opacity={k} />)}
  </g>
);

// ÜÇ GECE sayacı (sağ üst): üç ay, geçen geceler dolu
export const UcGeceHUD: React.FC<{ t: number; gece: number; gun?: number; k?: number }> = ({ t, gece, gun, k = 1 }) => (
  <g transform="translate(1520,44)" opacity={k}>
    <rect x={0} y={0} width={360} height={92} rx={18} fill="#0E1A2E" opacity={0.82} stroke="#2EE6D0" strokeWidth={3} />
    <text x={22} y={38} fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#2EE6D0">{gun ? `${gun}. GÜN` : "VAN"}</text>
    <text x={22} y={72} fontFamily="Poppins" fontWeight={700} fontSize={20} fill="#FFFFFF" opacity={0.8}>ÜÇ GECE</text>
    {[0, 1, 2].map((i) => { const on = gece > i; return <g key={i} transform={`translate(${200 + i * 52},46)`}><circle r={20} fill={on ? "#F6C445" : "#2A3650"} /><circle cx={9} cy={-6} r={17} fill="#0E1A2E" opacity={on ? 1 : 0.6} />{on && gece === i + 1 && <circle r={28} fill="#F6C445" opacity={0.2 + 0.15 * Math.sin(t * 4)} />}</g>; })}
  </g>
);

// Deneme kartı (Bayram'ın 7 denemesi): büyük emoji + numara + etiket
export const Deneme: React.FC<{ t: number; a: number; n: number; icon: string; label: string; fail?: boolean }> = ({ t, a, n, icon, label, fail = true }) => {
  const k = cl((t - a) / 0.35), x = cl((t - a - 0.9) / 0.25);
  return (
    <g>
      <rect width={1920} height={1080} fill="#F2E6CF" />
      <Erek mode="day" y={200} />
      <rect y={900} width={1920} height={180} fill="#F4F8FB" />
      <text x={960} y={250} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={86} fill="#0E1A2E">{`DENEME ${n}`}</text>
      <g transform={`translate(960,${620 - (1 - k) * 80}) scale(${0.6 + k * 0.4})`} opacity={k}><text x={0} y={0} textAnchor="middle" fontSize={300}>{icon}</text></g>
      <text x={960} y={860} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill="#6B3F22">{label}</text>
      {fail && x > 0 && <g opacity={x} transform="translate(1340,470) rotate(-12)"><rect x={-200} y={-60} width={400} height={120} rx={14} fill="none" stroke="#E0393E" strokeWidth={12} /><text x={0} y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#E0393E">YİNE VAN</text></g>}
    </g>
  );
};

// Göl kıyısı (Van Gölü, sodalı, donmaz) — yüzen kedi için su çizgisi
export const VanGolu: React.FC<{ t: number; mode?: Mode; cat?: number; snow?: number }> = ({ t, mode = "day", cat = 0, snow = 1 }) => {
  const [s1, s2] = SKY[mode];
  return (
    <g>
      <defs><linearGradient id="vgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s1} /><stop offset="1" stopColor={s2} /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#vgg)" />
      <path d="M-40,560 L300,440 L560,500 L900,380 L1240,480 L1560,420 L1960,520 L1960,620 L-40,620Z" fill={mode === "day" ? "#9AB0C4" : "#3E3A5E"} />
      <path d="M840,410 L900,380 L960,404 Z" fill="#F4F8FB" />
      <rect y={600} width={1920} height={320} fill={mode === "day" ? "#3E86B8" : "#2A4068"} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${md(i * 170 + t * 30, 2100) - 100},${640 + (i % 5) * 52} q30,-10 60,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.4} />)}
      <path d="M-40,900 Q600,860 1100,900 T1960,890 L1960,1080 L-40,1080Z" fill="#E8EEF3" opacity={snow ? 1 : 0.7} />
      {cat > 0 && <g transform={`translate(${lerp(1500, 1100, cl(cat))},${720 + Math.sin(t * 3) * 6})`}>
        <ellipse cx={0} cy={20} rx={90} ry={16} fill="#FFFFFF" opacity={0.4} />
        <circle cx={0} cy={-10} r={44} fill="#F4F1EA" /><path d="M-38,-30 L-30,-70 L-8,-46Z M38,-30 L30,-70 L8,-46Z" fill="#F4F1EA" />
        <circle cx={-16} cy={-14} r={9} fill="#4A9BE8" /><circle cx={16} cy={-14} r={9} fill="#F2B23A" />
        {[-50, -20, 20, 50].map((x, i) => <path key={i} d={`M${x},26 q10,${10 + Math.sin(t * 8 + i) * 8} 20,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7} />)}
      </g>}
    </g>
  );
};

// Bora'nın planı (harita kenarında el yazısı)
export const Plan: React.FC<{ t: number; k?: number; names?: number; cross?: number }> = ({ t, k = 1, names = 1, cross = 0 }) => {
  const L = ["Birinci gece: Tabelalar.", "İkinci gece: Not.", "Üçüncü gece, 03.14:", "O uyur. Biz gideriz."];
  const shown = k * L.length;
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A140E" />
      <g transform="translate(960,540) rotate(-2)">
        <rect x={-720} y={-420} width={1440} height={840} fill="#E9DCC6" />
        <path d="M-640,300 Q-300,120 -60,180 T420,-120 T640,-300" stroke="#E0393E" strokeWidth={10} fill="none" strokeDasharray="30 16" />
        {[[-640, 300], [640, -300]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={18} fill="#E0393E" />)}
        <text x={600} y={-330} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#6B3F22">BATI →</text>
        <rect x={-700} y={-400} width={720} height={560} fill="#F4EEDF" opacity={0.92} />
        {L.map((l, i) => <text key={i} x={-660} y={-320 + i * 92} fontFamily="Patrick Hand" fontSize={62} fill="#1E2A5A" opacity={cl(shown - i)}>{l}</text>)}
        {names > 0 && <g opacity={names}>{["Defne", "Bayram", "Su", "Bora"].map((n, i) => <text key={n} x={-660 + i * 170} y={90} fontFamily="Patrick Hand" fontSize={56} fill="#1E2A5A">{n}</text>)}
          <rect x={-670} y={110} width={680} height={4} fill="#1E2A5A" opacity={0.6} /></g>}
      </g>
    </g>
  );
};
