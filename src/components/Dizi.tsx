import React from "react";
import { blinkAt, legs as gLegs, Walk } from "./Motion";
import { P, TPose, TOON_A, lerp } from "./Toon";

// Kanal 6 "Finali Biz Yazdık" karakter kiti (2026-11-19). Dizi karakterleri için insan oranlı 2D çizgi film figürü:
// ten rengi kafa, kaş/göz/burun/ağız, saç modelleri, sakal, deri ceket/takım/elbise/palto. Kalın koyu kontur.
// Bacak geometrisi TFig ile aynı (kalça -178, uyluk 88, baldır 86) → toonWalk() ile ayak kaymadan yürür.
// Ölçek: s=1 → ayaktan saçın tepesine ~510 birim. Kural: gerçek oyuncu yüzü kopyalanmaz, sadece ten/saç/boy/kıyafet.

const INK = "#1B1210";
const fr = (x: number) => x - Math.floor(x);
const hs = (n: number) => fr(Math.sin(n * 91.7 + 17.3) * 43758.5453);

export const SKIN = { acik: "#F3CDAA", bugday: "#E3AE86", esmer: "#C98E64", koyu: "#94603F" };
export type DHair = "short" | "slick" | "messy" | "long" | "wavy" | "pony" | "bun" | "grey" | "bald" | "kid" | "scarf" | "curly";
export type DTop = "leather" | "suit" | "coat" | "dress" | "shirt" | "cardigan" | "tee" | "blouse" | "gown" | "uniform";
export type DOutfit = {
  skin: string; hair: DHair; hairColor: string; beard?: "stubble" | "full" | "goatee"; beardColor?: string;
  top: DTop; c: string; c2?: string; inner?: string; pants?: string; shoes?: string; tie?: string; skirt?: string;
  glasses?: boolean; female?: boolean; build?: number; lips?: string; earring?: boolean; scar?: boolean;
};
export type DEyes = "open" | "wide" | "closed" | "happy" | "squint" | "sad" | "down";
export type DBrow = "none" | "angry" | "worried" | "up" | "sad";
export type DMouth = "smile" | "grin" | "flat" | "frown" | "open" | "o" | "smirk" | "tight" | "shout";

const dk = (c: string, k = 0.78) => {
  if (!c.startsWith("#") || c.length < 7) return c;
  const n = [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) * k));
  return `rgb(${n.join(",")})`;
};
const pt = (x: number, y: number, a: number, L: number) => {
  const r = (a * Math.PI) / 180;
  return [x + Math.sin(r) * L, y + Math.cos(r) * L] as const;
};
// konturlu çizgi (kalın koyu alt çizgi + renkli üst çizgi)
const Limb: React.FC<{ pts: string; c: string; w: number; sil?: string }> = ({ pts, c, w, sil }) => (
  <>
    <polyline points={pts} fill="none" stroke={sil ?? INK} strokeWidth={w + 9} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points={pts} fill="none" stroke={sil ?? c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const DFig: React.FC<{
  x: number; y: number; s?: number; dir?: 1 | -1; o: DOutfit; pose?: TPose; t?: number; seed?: number;
  eyes?: DEyes; brow?: DBrow; mouth?: DMouth; look?: number; lookY?: number; talk?: boolean; tear?: number; blush?: number;
  holdR?: React.ReactNode; holdL?: React.ReactNode; op?: number; walk?: Walk; sil?: string; rim?: string; wet?: number;
}> = ({ x, y, s = 1, dir = 1, o, pose: pose0 = P.stand, t = 0, seed = 0, eyes = "open", brow = "none", mouth = "flat", look = 0, lookY = 0, talk = false, tear = 0, blush = 0, holdR, holdL, op = 1, walk, sil, rim, wet = 0 }) => {
  const B = o.build ?? 1;
  const fem = !!o.female;
  const W = (fem ? 56 : 66) * B; // omuz yarı genişliği
  const breathe = Math.sin(t * 2.1 + seed) * 2;
  const blink = blinkAt(t, seed);
  const G = walk ? gLegs(walk, TOON_A) : null;
  const freeArms = pose0 === P.stand;
  const pose: TPose = G && walk
    ? {
        l: freeArms ? [-0.7 * G.aL, -0.7 * G.aL + 12] : pose0.l,
        r: freeArms ? [-0.7 * G.aR, -0.7 * G.aR + 12] : pose0.r,
        ll: [G.aL + 26 * G.liftL, G.aL - 48 * G.liftL],
        rl: [G.aR + 26 * G.liftR, G.aR - 48 * G.liftR],
        lean: (pose0.lean ?? 0) + 3 * walk.amp,
      }
    : pose0;
  const drop = G ? 174 * G.drop : 0;
  const open = talk && Math.sin(t * 19 + seed) > -0.1;
  const C = (c: string) => sil ?? c;
  const skin = C(o.skin), skinD = C(dk(o.skin, 0.82));
  const hairC = C(o.hairColor);
  const pants = o.pants ?? "#24262C";
  const shoe = o.shoes ?? "#18181A";
  const long = o.top === "coat" || o.top === "dress" || o.top === "gown";
  const HIP: [number, number] = [0, -178];

  const leg = (side: -1 | 1, ang: [number, number], back: boolean) => {
    const h = [HIP[0] + side * 22 * B, HIP[1]] as const;
    const k = pt(h[0], h[1], ang[0], 88);
    const f = pt(k[0], k[1], ang[1], 86);
    const dress = o.top === "dress" || o.top === "gown";
    const lc = dress ? (o.top === "gown" ? o.skin : o.skin) : pants;
    return (
      <g key={side} opacity={back && !sil ? 0.96 : 1}>
        <Limb pts={`${h[0]},${h[1]} ${k[0]},${k[1]} ${f[0]},${f[1]}`} c={back ? dk(lc, 0.86) : lc} w={dress ? 18 : 30 * B} sil={sil} />
        <g transform={`translate(${f[0]},${f[1]}) rotate(${-ang[1] * 0.4})`}>
          <path d={fem && dress ? "M-12,-8 C-10,-18 16,-16 26,-4 L30,6 L-14,8Z" : "M-18,-12 C-18,-24 12,-24 24,-12 L38,-4 C44,0 42,12 32,12 L-20,12 C-26,12 -26,-4 -18,-12Z"} fill={C(back ? dk(shoe) : shoe)} stroke={C(INK)} strokeWidth={5} />
        </g>
      </g>
    );
  };

  const SH = -350;
  const arm = (side: -1 | 1, ang: [number, number], back: boolean, hold?: React.ReactNode) => {
    const sh = [side * (W - 8), SH + 16] as const;
    const e = pt(sh[0], sh[1], ang[0], 80);
    const h = pt(e[0], e[1], ang[1], 74);
    const sleeveC = o.top === "dress" || o.top === "tee" ? null : o.c;
    return (
      <g key={`a${side}`}>
        {sleeveC
          ? <Limb pts={`${sh[0]},${sh[1]} ${e[0]},${e[1]} ${h[0]},${h[1]}`} c={back ? dk(sleeveC, 0.85) : sleeveC} w={(fem ? 24 : 30) * B} sil={sil} />
          : <>
              <Limb pts={`${sh[0]},${sh[1]} ${e[0]},${e[1]} ${h[0]},${h[1]}`} c={back ? dk(o.skin, 0.9) : o.skin} w={fem ? 16 : 22} sil={sil} />
              {o.top === "tee" && <Limb pts={`${sh[0]},${sh[1]} ${lerp(sh[0], e[0], 0.5)},${lerp(sh[1], e[1], 0.5)}`} c={o.c} w={30 * B} sil={sil} />}
            </>}
        {o.top === "suit" && !sil && <circle cx={lerp(e[0], h[0], 0.92)} cy={lerp(e[1], h[1], 0.92)} r={11} fill={o.inner ?? "#F4F4F4"} />}
        <circle cx={h[0]} cy={h[1]} r={fem ? 13 : 16} fill={skin} stroke={C(INK)} strokeWidth={5} />
        {hold && <g transform={`translate(${h[0]},${h[1]})`}>{hold}</g>}
      </g>
    );
  };

  const torso = () => {
    const w = W, wh = (fem ? 48 : 58) * B; // bel
    const body = `M${-w},-352 Q0,-370 ${w},-352 C${w + 8},-300 ${wh + 6},-230 ${wh},-176 Q0,-164 ${-wh},-176 C${-wh - 6},-230 ${-w - 8},-300 ${-w},-352Z`;
    const ink = C(INK);
    const inner = C(o.inner ?? "#EDEDED");
    const c = C(o.c), c2 = C(o.c2 ?? dk(o.c));
    switch (o.top) {
      case "dress": case "gown": {
        const hem = o.top === "gown" ? -60 : -96;
        const sk = C(o.skirt ?? o.c);
        return (
          <g>
            <path d={`M${-wh},-190 C${-wh - 30},-140 ${-wh - 56},${hem + 30} ${-wh - 60},${hem} Q0,${hem + 22} ${wh + 60},${hem} C${wh + 56},${hem + 30} ${wh + 30},-140 ${wh},-190Z`} fill={sk} stroke={ink} strokeWidth={5} />
            {!sil && <path d={`M-20,-180 Q-30,-120 -40,${hem + 6} M24,-180 Q36,-120 48,${hem + 8}`} stroke={dk(sk, 0.82)} strokeWidth={5} fill="none" />}
            <path d={body} fill={c} stroke={ink} strokeWidth={5} />
            {!sil && <path d={`M-30,-356 Q0,-318 30,-356`} fill={skin} stroke={ink} strokeWidth={4} />}
            {!sil && <path d={`M${-wh},-196 Q0,-184 ${wh},-196`} stroke={c2} strokeWidth={9} fill="none" />}
          </g>
        );
      }
      case "leather": return (
        <g>
          <path d={body} fill={inner} stroke={ink} strokeWidth={5} />
          <path d={`M${-w},-352 Q-40,-362 -22,-358 L-14,-176 Q${-wh},-170 ${-wh},-176 C${-wh - 6},-230 ${-w - 8},-300 ${-w},-352Z`} fill={c} stroke={ink} strokeWidth={5} />
          <path d={`M${w},-352 Q40,-362 22,-358 L14,-176 Q${wh},-170 ${wh},-176 C${wh + 6},-230 ${w + 8},-300 ${w},-352Z`} fill={c2} stroke={ink} strokeWidth={5} />
          <path d="M-22,-358 L-44,-318 L-20,-306Z M22,-358 L44,-318 L20,-306Z" fill={c2} stroke={ink} strokeWidth={4} />
          {!sil && <><path d={`M${-w + 16},-250 h28 M${w - 44},-250 h28`} stroke={dk(o.c, 0.6)} strokeWidth={4} /><path d="M-14,-300 L-14,-182" stroke="#B9B9B9" strokeWidth={3} strokeDasharray="5 5" /></>}
        </g>
      );
      case "suit": return (
        <g>
          <path d={body} fill={inner} stroke={ink} strokeWidth={5} />
          {o.tie && <path d="M-7,-352 L7,-352 L11,-268 L0,-252 L-11,-268Z" fill={C(o.tie)} stroke={ink} strokeWidth={3} />}
          <path d={`M${-w},-352 Q-40,-362 -24,-358 L-4,-232 L-8,-176 Q${-wh},-170 ${-wh},-176 C${-wh - 6},-230 ${-w - 8},-300 ${-w},-352Z`} fill={c} stroke={ink} strokeWidth={5} />
          <path d={`M${w},-352 Q40,-362 24,-358 L4,-232 L8,-176 Q${wh},-170 ${wh},-176 C${wh + 6},-230 ${w + 8},-300 ${w},-352Z`} fill={c} stroke={ink} strokeWidth={5} />
          <path d="M-24,-358 L-40,-300 L-12,-286Z M24,-358 L40,-300 L12,-286Z" fill={c2} stroke={ink} strokeWidth={4} />
          {!sil && <><circle cx={-6} cy={-214} r={4} fill={dk(o.c, 0.5)} /><path d={`M${w - 50},-300 h24`} stroke="#F4F4F4" strokeWidth={5} /></>}
        </g>
      );
      case "coat": return (
        <g>
          <path d={`M${-w - 4},-352 Q0,-370 ${w + 4},-352 C${w + 16},-260 ${w + 20},-160 ${w + 24},-70 L${-w - 24},-70 C${-w - 20},-160 ${-w - 16},-260 ${-w - 4},-352Z`} fill={c} stroke={ink} strokeWidth={5} />
          <path d={`M-20,-356 L-4,-250 L4,-250 L20,-356Z`} fill={inner} stroke={ink} strokeWidth={4} />
          {o.tie && <path d="M-5,-350 L5,-350 L7,-276 L0,-264 L-7,-276Z" fill={C(o.tie)} />}
          <path d="M-20,-356 L-48,-300 L-6,-250 M20,-356 L48,-300 L6,-250 M0,-250 L0,-70" stroke={c2} strokeWidth={6} fill="none" />
          {!sil && [-210, -160, -110].map((yy) => <circle key={yy} cx={-14} cy={yy} r={5} fill={dk(o.c, 0.5)} />)}
          {!sil && <path d={`M${-w + 10},-150 h36 M${w - 46},-150 h36`} stroke={c2} strokeWidth={5} />}
        </g>
      );
      case "cardigan": return (
        <g>
          <path d={body} fill={inner} stroke={ink} strokeWidth={5} />
          <path d={`M${-w},-352 Q-30,-364 -16,-358 L-10,-176 Q${-wh},-170 ${-wh},-176 C${-wh - 6},-230 ${-w - 8},-300 ${-w},-352Z M${w},-352 Q30,-364 16,-358 L10,-176 Q${wh},-170 ${wh},-176 C${wh + 6},-230 ${w + 8},-300 ${w},-352Z`} fill={c} stroke={ink} strokeWidth={5} />
          {!sil && [-300, -260, -220].map((yy) => <circle key={yy} cx={-12} cy={yy} r={4} fill={c2} />)}
        </g>
      );
      case "gown": return null;
      case "uniform": return (
        <g>
          <path d={body} fill={c} stroke={ink} strokeWidth={5} />
          <path d="M-26,-356 L0,-320 L26,-356" stroke={c2} strokeWidth={8} fill="none" />
          {!sil && <><rect x={18} y={-300} width={34} height={26} rx={4} fill={c2} /><path d={`M${-wh},-196 Q0,-184 ${wh},-196`} stroke={c2} strokeWidth={10} fill="none" /></>}
        </g>
      );
      default: return (
        <g>
          <path d={body} fill={c} stroke={ink} strokeWidth={5} />
          {o.top === "shirt" && !sil && <><path d="M-22,-358 L0,-326 L22,-358 M0,-326 L0,-180" stroke={c2} strokeWidth={5} fill="none" />{[-300, -260, -220].map((yy) => <circle key={yy} cx={0} cy={yy} r={3.5} fill={c2} />)}</>}
          {o.top === "blouse" && !sil && <path d="M-34,-356 Q0,-310 34,-356" fill={skin} stroke={ink} strokeWidth={4} />}
          {o.top === "tee" && !sil && <path d="M-26,-356 Q0,-334 26,-356" stroke={c2} strokeWidth={7} fill="none" />}
        </g>
      );
    }
  };

  // ── kafa ──
  const HY = -430; // yüz merkezi
  const FX = 52, FY = 62;
  const ex = look * 7, ey = lookY * 5;
  const EY = HY - 4;
  const eye = (cx: number, side: -1 | 1) => {
    const X = cx + ex * 0.5;
    if (blink || eyes === "closed") return <path d={`M${X - 11},${EY + 1} q11,${eyes === "closed" ? 7 : 4} 22,0`} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    if (eyes === "happy") return <path d={`M${X - 11},${EY + 4} q11,-12 22,0`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />;
    const rx = eyes === "wide" ? 12 : 11;
    const ry = eyes === "wide" ? 11 : eyes === "squint" ? 4.5 : eyes === "sad" || eyes === "down" ? 6.5 : fem ? 8.5 : 7.5;
    const lookDown = eyes === "down" ? 3 : 0;
    return (
      <g>
        <ellipse cx={X} cy={EY} rx={rx} ry={ry} fill="#FFFFFF" />
        <circle cx={X + ex * 0.45} cy={EY + 1 + ey * 0.5 + lookDown} r={Math.min(6.5, ry + 0.5)} fill="#3B2416" />
        <circle cx={X + ex * 0.45} cy={EY + 1 + ey * 0.5 + lookDown} r={3} fill="#0C0806" />
        <circle cx={X + ex * 0.45 + 2.2} cy={EY - 1.5 + ey * 0.5 + lookDown} r={1.7} fill="#FFFFFF" />
        <path d={`M${X - rx - 1},${EY + 1} Q${X},${EY - ry - 5} ${X + rx + 1},${EY - 1}`} stroke={INK} strokeWidth={fem ? 4.6 : 3.8} fill="none" strokeLinecap="round" />
        {fem && <path d={`M${X + side * (rx - 1)},${EY - 3} l${side * 6},-5`} stroke={INK} strokeWidth={3} strokeLinecap="round" />}
        {(eyes === "sad" || eyes === "down") && <path d={`M${X - rx},${EY - 2} Q${X},${EY - 8} ${X + rx},${EY - 2}`} fill={skinD} />}
      </g>
    );
  };
  const browEl = (cx: number, side: -1 | 1) => {
    const X = cx + ex * 0.5;
    const by = EY - 20 + (eyes === "wide" ? -4 : 0);
    // iç uç (burna yakın) y kayması
    const inner = brow === "angry" ? 9 : brow === "worried" || brow === "sad" ? -8 : brow === "up" ? -6 : 0;
    const outer = brow === "up" ? -6 : brow === "sad" ? 3 : 0;
    const xi = X - side * 13, xo = X + side * 13;
    return <path d={`M${xi},${by + inner} Q${X},${by - 5 + (inner + outer) / 2} ${xo},${by + outer}`} stroke={C(o.hair === "grey" ? "#9E9A94" : o.hairColor)} strokeWidth={fem ? 5 : 7.5} fill="none" strokeLinecap="round" />;
  };
  const MY = HY + 32;
  const mouthEl = () => {
    const X = ex * 0.4;
    const lip = C(o.lips ?? (fem ? "#B4474F" : "#7A3A30"));
    if (open && mouth !== "shout") return <ellipse cx={X} cy={MY + 1} rx={9} ry={7} fill="#5A1E1E" stroke={INK} strokeWidth={3} />;
    switch (mouth) {
      case "shout": return <path d={`M${X - 14},${MY - 4} Q${X},${MY - 8} ${X + 14},${MY - 4} Q${X + 10},${MY + 20} ${X},${MY + 20} Q${X - 10},${MY + 20} ${X - 14},${MY - 4}Z`} fill="#5A1E1E" stroke={INK} strokeWidth={3.5} />;
      case "open": return <ellipse cx={X} cy={MY + 2} rx={10} ry={9} fill="#5A1E1E" stroke={INK} strokeWidth={3} />;
      case "o": return <ellipse cx={X} cy={MY + 1} rx={6} ry={7} fill="#5A1E1E" stroke={INK} strokeWidth={3} />;
      case "grin": return <path d={`M${X - 16},${MY - 3} Q${X},${MY + 16} ${X + 16},${MY - 3}Z`} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />;
      case "smile": return <path d={`M${X - 13},${MY - 2} q13,10 26,0`} stroke={fem ? lip : INK} strokeWidth={fem ? 5 : 4} fill="none" strokeLinecap="round" />;
      case "smirk": return <path d={`M${X - 11},${MY + 1} q14,2 22,-7`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />;
      case "frown": return <path d={`M${X - 12},${MY + 5} q12,-9 24,0`} stroke={fem ? lip : INK} strokeWidth={fem ? 5 : 4} fill="none" strokeLinecap="round" />;
      case "tight": return <path d={`M${X - 10},${MY + 1} h20`} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      default: return <path d={`M${X - 11},${MY + 1} q11,${fem ? 3 : 1.5} 22,0`} stroke={fem ? lip : INK} strokeWidth={fem ? 5 : 4} fill="none" strokeLinecap="round" />;
    }
  };
  const hc = hairC, hcD = C(dk(o.hairColor, 0.72));
  const ink = C(INK);
  const sw = Math.sin(t * 2.4 + seed) * 4;
  // saçın arkası (kafanın arkasında)
  const hairBack = () => {
    switch (o.hair) {
      case "long": case "wavy": case "kid": {
        const L = o.hair === "kid" ? 70 : 120;
        const wv = o.hair === "wavy";
        return <path d={`M${-FX - 8},${HY - 20} C${-FX - 30},${HY + 40} ${-FX - 34 + sw},${HY + L - 20} ${-FX - 20 + sw},${HY + L} ${wv ? `q20,14 34,0 q20,14 34,0 q20,14 34,0 q20,14 30,-2 q14,12 26,0` : `Q0,${HY + L + 18} ${FX + 20 + sw},${HY + L}`} C${FX + 34 + sw},${HY + L - 20} ${FX + 30},${HY + 40} ${FX + 8},${HY - 20}Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      }
      case "pony": return <path d={`M-30,${HY - 50} C-90,${HY - 40} -96 ,${HY + 40} -80 ,${HY + 96} C-70,${HY + 60} -50,${HY + 10} -20,${HY - 30}Z`} fill={hc} stroke={ink} strokeWidth={5} transform={`rotate(${sw},-30,${HY - 50})`} />;
      case "bun": return <circle cx={0} cy={HY - 66} r={26} fill={hc} stroke={ink} strokeWidth={5} />;
      case "scarf": return <path d={`M${-FX - 16},${HY - 30} C${-FX - 24},${HY + 50} ${-FX - 10},${HY + 90} -30,${HY + 104} L30,${HY + 104} C${FX + 10},${HY + 90} ${FX + 24},${HY + 50} ${FX + 16},${HY - 30}Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      default: return null;
    }
  };
  const hairFront = () => {
    const top = `M${-FX - 4},${HY - 6}`;
    switch (o.hair) {
      case "short": return <path d={`${top} C${-FX - 8},${HY - 60} -30,${HY - 78} 4,${HY - 76} C40,${HY - 76} ${FX + 10},${HY - 56} ${FX + 4},${HY - 6} C${FX - 2},${HY - 30} ${FX - 8},${HY - 40} ${FX - 18},${HY - 44} Q10,${HY - 36} -14,${HY - 50} Q-30,${HY - 36} ${-FX + 6},${HY - 30} Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      case "messy": return <path d={`${top} C${-FX - 10},${HY - 50} -46,${HY - 70} -30,${HY - 74} l8,-14 l12,10 l14,-16 l10,16 l18,-10 l2,16 C${FX + 12},${HY - 52} ${FX + 8},${HY - 20} ${FX + 4},${HY - 6} C${FX - 4},${HY - 32} ${FX - 14},${HY - 40} 20,${HY - 44} l-12,10 l-6,-12 l-14,12 l-6,-10 Q-36,${HY - 34} ${-FX + 6},${HY - 28}Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      case "slick": return <g><path d={`${top} C${-FX - 6},${HY - 64} -20,${HY - 82} 10,${HY - 78} C46,${HY - 74} ${FX + 8},${HY - 52} ${FX + 4},${HY - 8} C${FX - 4},${HY - 36} ${FX - 10},${HY - 46} 30,${HY - 50} Q-10,${HY - 54} ${-FX + 4},${HY - 26}Z`} fill={hc} stroke={ink} strokeWidth={5} />{!sil && <path d={`M-30,${HY - 60} Q10,${HY - 74} 40,${HY - 58} M-20,${HY - 50} Q16,${HY - 64} 44,${HY - 48}`} stroke={hcD} strokeWidth={3.5} fill="none" />}</g>;
      case "grey": return <path d={`${top} C${-FX - 8},${HY - 50} -40,${HY - 72} 0,${HY - 72} C40,${HY - 72} ${FX + 8},${HY - 50} ${FX + 4},${HY - 6} C${FX - 4},${HY - 26} ${FX - 10},${HY - 36} ${FX - 22},${HY - 40} Q0,${HY - 52} ${-FX + 22},${HY - 40} C${-FX + 10},${HY - 36} ${-FX + 4},${HY - 26} ${-FX - 4},${HY - 6}Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      case "bald": return <path d={`M${-FX - 3},${HY - 4} C${-FX - 4},${HY - 26} ${-FX + 2},${HY - 34} ${-FX + 10},${HY - 36} L${-FX + 8},${HY - 6}Z M${FX + 3},${HY - 4} C${FX + 4},${HY - 26} ${FX - 2},${HY - 34} ${FX - 10},${HY - 36} L${FX - 8},${HY - 6}Z`} fill={hc} stroke={ink} strokeWidth={4} />;
      case "curly": return <g fill={hc} stroke={ink} strokeWidth={4}>{[[-46, -40], [-30, -62], [-6, -72], [20, -70], [42, -56], [54, -30], [-56, -16], [56, -10]].map(([a, b], i) => <circle key={i} cx={a} cy={HY + b} r={20} />)}</g>;
      case "long": case "wavy": case "kid": case "pony": case "bun": {
        const part = o.hair === "kid" ? 0 : -14;
        return (
          <g>
            <path d={`${top} C${-FX - 8},${HY - 60} -30,${HY - 80} ${part},${HY - 76} C30,${HY - 80} ${FX + 8},${HY - 60} ${FX + 4},${HY - 6} C${FX - 2},${HY - 30} ${FX - 14},${HY - 50} ${part + 10},${HY - 56} Q${part - 8},${HY - 46} ${-FX + 8},${HY - 24}Z`} fill={hc} stroke={ink} strokeWidth={5} />
            {(o.hair === "long" || o.hair === "wavy" || o.hair === "kid") && (
              <>
                <path d={`M${-FX - 4},${HY - 10} C${-FX - 10},${HY + 30} ${-FX - 6},${HY + 70} ${-FX + 6 + sw * 0.5},${HY + 96} C${-FX + 2},${HY + 60} ${-FX + 4},${HY + 20} ${-FX + 8},${HY - 20}Z`} fill={hc} stroke={ink} strokeWidth={4} />
                <path d={`M${FX + 4},${HY - 10} C${FX + 10},${HY + 30} ${FX + 6},${HY + 70} ${FX - 6 + sw * 0.5},${HY + 96} C${FX - 2},${HY + 60} ${FX - 4},${HY + 20} ${FX - 8},${HY - 20}Z`} fill={hc} stroke={ink} strokeWidth={4} />
              </>
            )}
            {o.hair === "kid" && <path d={`M-40,${HY - 50} Q-20,${HY - 30} 0,${HY - 46} Q20,${HY - 30} 40,${HY - 50}`} stroke={hcD} strokeWidth={4} fill="none" />}
            {!sil && o.hair !== "kid" && <path d={`M${part + 4},${HY - 70} Q${part + 30},${HY - 62} ${FX - 6},${HY - 34}`} stroke={C("#FFFFFF")} strokeOpacity={0.25} strokeWidth={6} fill="none" />}
          </g>
        );
      }
      case "scarf": return <path d={`M${-FX - 14},${HY - 4} C${-FX - 16},${HY - 70} -20,${HY - 90} 0,${HY - 90} C20,${HY - 90} ${FX + 16},${HY - 70} ${FX + 14},${HY - 4} C${FX + 4},${HY - 40} ${FX - 10},${HY - 56} 0,${HY - 58} C${-FX + 10},${HY - 56} ${-FX - 4},${HY - 40} ${-FX - 14},${HY - 4}Z`} fill={hc} stroke={ink} strokeWidth={5} />;
      default: return null;
    }
  };
  const beardEl = () => {
    const bc = C(o.beardColor ?? o.hairColor);
    if (o.beard === "stubble") return <path d={`M${-FX + 2},${HY + 4} C${-FX + 4},${HY + 46} -24,${HY + FY} 0,${HY + FY} C24,${HY + FY} ${FX - 4},${HY + 46} ${FX - 2},${HY + 4} C${FX - 12},${HY + 30} 20,${HY + 22} 0,${HY + 22} C-20,${HY + 22} ${-FX + 12},${HY + 30} ${-FX + 2},${HY + 4}Z`} fill={bc} opacity={sil ? 1 : 0.42} />;
    if (o.beard === "full") return (
      <g>
        <path d={`M${-FX - 2},${HY - 4} C${-FX - 4},${HY + 56} -30,${HY + FY + 22} 0,${HY + FY + 24} C30,${HY + FY + 22} ${FX + 4},${HY + 56} ${FX + 2},${HY - 4} C${FX - 8},${HY + 22} 22,${HY + 18} 0,${HY + 20} C-22,${HY + 18} ${-FX + 8},${HY + 22} ${-FX - 2},${HY - 4}Z`} fill={bc} stroke={ink} strokeWidth={4} />
        <path d={`M-22,${MY - 8} Q0,${MY - 16} 22,${MY - 8} Q26,${MY} 16,${MY - 2} Q0,${MY - 8} -16,${MY - 2} Q-26,${MY} -22,${MY - 8}Z`} fill={bc} stroke={ink} strokeWidth={3} />
      </g>
    );
    if (o.beard === "goatee") return <path d={`M-16,${MY + 10} Q0,${MY + 34} 16,${MY + 10} Q0,${MY + 18} -16,${MY + 10}Z M-20,${MY - 8} Q0,${MY - 14} 20,${MY - 8}`} fill={bc} stroke={bc} strokeWidth={5} />;
    return null;
  };
  const rimEl = rim ? <ellipse cx={0} cy={-270} rx={200} ry={320} fill={rim} opacity={0.18} /> : null;
  const lean = pose.lean ?? 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`} opacity={op}>
      {rimEl}
      <ellipse cx={0} cy={4} rx={80 * B} ry={11} fill="#000" opacity={0.18} />
      <ellipse cx={0} cy={4} rx={G ? 64 + 26 * Math.abs(G.tr) * (walk?.amp ?? 0) : 48} ry={5} fill="#000" opacity={0.22} />
      <g transform={`translate(0,${drop})`}>
        {leg(-1, pose.ll ?? [-3, -3], true)}
        {leg(1, pose.rl ?? [3, 3], false)}
        {!long && !sil && <path d={`M${-58 * B},-186 L${58 * B},-186 L${54 * B},-168 L${-54 * B},-168Z`} fill={pants} />}
        <g transform={`rotate(${lean},0,-178) translate(0,${breathe})`}>
          {arm(-1, pose.l, true, holdL)}
          <g transform={`translate(0,${breathe * 0.3})`}>{hairBack()}</g>
          {torso()}
          <g transform={`translate(0,${breathe * 0.3})`}>
            <path d={`M-16,-380 L-18,-348 Q0,-340 18,-348 L16,-380Z`} fill={skinD} stroke={ink} strokeWidth={4} />
            {o.hair !== "scarf" && <><ellipse cx={-FX + 2} cy={HY + 2} rx={10} ry={15} fill={skin} stroke={ink} strokeWidth={4} /><ellipse cx={FX - 2} cy={HY + 2} rx={10} ry={15} fill={skin} stroke={ink} strokeWidth={4} /></>}
            {o.earring && !sil && <circle cx={-FX + 2} cy={HY + 22} r={5} fill="#F2C14E" />}
            <path d={`M0,${HY - FY} C${FX + 4},${HY - FY} ${FX + 2},${HY - 10} ${FX - 2},${HY + 16} C${FX - 8},${HY + 44} 24,${HY + FY} 0,${HY + FY} C-24,${HY + FY} ${-FX + 8},${HY + 44} ${-FX + 2},${HY + 16} C${-FX - 2},${HY - 10} ${-FX - 4},${HY - FY} 0,${HY - FY}Z`} fill={skin} stroke={ink} strokeWidth={5} />
            {!sil && <>
              <path d={`M${FX - 8},${HY - 10} C${FX - 6},${HY + 20} ${FX - 16},${HY + 46} 10,${HY + FY - 4} C${FX - 18},${HY + 40} ${FX - 14},${HY + 10} ${FX - 8},${HY - 10}Z`} fill={skinD} opacity={0.5} />
              {beardEl()}
              {eye(-21, -1)}{eye(21, 1)}
              {browEl(-21, -1)}{browEl(21, 1)}
              <path d={`M${2 + ex * 0.6},${HY + 2} q6,12 -2,16 q-4,1 -7,-1`} stroke={dk(o.skin, 0.6)} strokeWidth={3.5} fill="none" strokeLinecap="round" />
              {o.beard !== "full" && mouthEl()}
              {o.beard === "full" && (open || mouth === "open" || mouth === "shout") && <ellipse cx={ex * 0.4} cy={MY + 2} rx={9} ry={6} fill="#5A1E1E" />}
              {(blush > 0 || fem) && <><ellipse cx={-30} cy={HY + 18} rx={10} ry={5} fill="#E8737A" opacity={0.25 + blush * 0.3} /><ellipse cx={30} cy={HY + 18} rx={10} ry={5} fill="#E8737A" opacity={0.25 + blush * 0.3} /></>}
              {o.scar && <path d={`M30,${HY - 26} l10,22`} stroke="#A0524A" strokeWidth={3.5} />}
              {o.glasses && <g fill="none" stroke="#2A2A2A" strokeWidth={4}><rect x={-37 + ex * 0.5} y={EY - 12} width={30} height={22} rx={6} /><rect x={7 + ex * 0.5} y={EY - 12} width={30} height={22} rx={6} /><path d={`M${-7 + ex * 0.5},${EY - 3} h14`} /></g>}
              {tear > 0 && <path d={`M-24,${EY + 10} q-4,${16 * tear} 0,${26 * tear} q5,-8 0,${-26 * tear}Z`} fill="#9BD8FF" opacity={0.9} />}
              {wet > 0 && <g opacity={wet}>{[[-30, -30], [20, -10], [36, 20], [-10, 40]].map(([a, b], i) => <path key={i} d={`M${a},${HY + b} q3,8 0,12 q-3,-4 0,-12Z`} fill="#BFE8FF" />)}</g>}
            </>}
            {hairFront()}
          </g>
          {arm(1, pose.r, false, holdR)}
        </g>
      </g>
    </g>
  );
};

// ───────── Yeraltı oyuncu kadrosu (genel benzerlik: ten/saç/boy/kıyafet, yüz kopyası değil) ─────────
export const CAST: Record<string, DOutfit> = {
  haydar: { skin: SKIN.bugday, hair: "short", hairColor: "#1E1712", beard: "stubble", top: "leather", c: "#2B2522", c2: "#1E1A18", inner: "#2F3B4A", pants: "#1F2329", shoes: "#141414", build: 1.05 },
  bozo: { skin: SKIN.bugday, hair: "slick", hairColor: "#22190F", beard: "full", top: "coat", c: "#1C1D22", c2: "#2E3038", inner: "#3A1E22", pants: "#16171B", shoes: "#0E0E0E", build: 1.18 },
  ceylan: { skin: SKIN.acik, hair: "wavy", hairColor: "#2A1A12", top: "dress", c: "#7A1F2E", c2: "#5A1622", female: true, lips: "#A3343F", earring: true, shoes: "#1A1A1A" },
  sultan: { skin: SKIN.acik, hair: "long", hairColor: "#7A4E2C", top: "blouse", c: "#E7E2D8", c2: "#CFC6B6", pants: "#2A2E3A", female: true, lips: "#C0545A", earring: true, shoes: "#3A2A20" },
  melek: { skin: SKIN.bugday, hair: "pony", hairColor: "#2E2018", top: "cardigan", c: "#6E8FA8", c2: "#4E6E86", inner: "#F2EFE8", pants: "#3A4658", female: true, shoes: "#F4F4F4" },
  ruzgar: { skin: SKIN.bugday, hair: "messy", hairColor: "#3A2618", beard: "stubble", top: "leather", c: "#5A3A26", c2: "#43291A", inner: "#1D1F24", pants: "#2A3240", shoes: "#2A1E16" },
  yilmaz: { skin: SKIN.acik, hair: "grey", hairColor: "#B9B5AE", top: "suit", c: "#3A3F4A", c2: "#2C3038", inner: "#E9EEF2", tie: "#5A1E28", glasses: true, pants: "#30343D", shoes: "#111" },
  derya: { skin: SKIN.acik, hair: "long", hairColor: "#C99A5E", top: "blouse", c: "#5E7F6A", c2: "#466350", pants: "#E8E1D4", female: true, lips: "#C0545A", shoes: "#D9C9B0" },
  ada: { skin: SKIN.acik, hair: "kid", hairColor: "#8A5A34", top: "dress", c: "#F2A7B8", c2: "#D9849A", female: true, shoes: "#E0393E" },
  merdan: { skin: SKIN.bugday, hair: "short", hairColor: "#1A1410", beard: "stubble", top: "gown", c: "#A9C7D6", c2: "#86A9BA", skirt: "#A9C7D6", shoes: "#DADADA" },
  merdanS: { skin: SKIN.bugday, hair: "short", hairColor: "#1A1410", beard: "stubble", top: "shirt", c: "#2A2A30", c2: "#4A4A52", pants: "#1E1E22" },
  efraim: { skin: SKIN.esmer, hair: "bald", hairColor: "#1A1410", beard: "goatee", top: "suit", c: "#141518", c2: "#24262B", inner: "#141518", pants: "#141518", build: 1.12 },
  gulsum: { skin: SKIN.bugday, hair: "scarf", hairColor: "#5A4A6A", top: "cardigan", c: "#6A4E3A", c2: "#4E3828", inner: "#EDE4D2", pants: "#3A2E26", female: true, lips: "#9A5050", shoes: "#2A2018" },
  yavuz: { skin: SKIN.esmer, hair: "short", hairColor: "#141010", beard: "stubble", top: "leather", c: "#1A1A1C", c2: "#101012", inner: "#4A4E58", pants: "#1A1E24" },
  pasa: { skin: SKIN.bugday, hair: "curly", hairColor: "#2A1C12", top: "shirt", c: "#C8A04A", c2: "#9A7A34", pants: "#3A3A42" },
  asli: { skin: SKIN.acik, hair: "bun", hairColor: "#1E1612", top: "suit", c: "#2E3440", c2: "#232833", inner: "#F2F2F2", pants: "#2E3440", female: true, lips: "#A3434A", shoes: "#111" },
  yasli: { skin: SKIN.bugday, hair: "grey", hairColor: "#DAD6CE", beard: "full", beardColor: "#DAD6CE", top: "coat", c: "#3E3A34", c2: "#2E2A26", inner: "#6A5A4A", pants: "#2A2622", build: 0.95 },
  konsey: { skin: "#2A2A30", hair: "slick", hairColor: "#0E0E10", top: "suit", c: "#0E0E12", c2: "#16161C", inner: "#0E0E12", pants: "#0E0E12" },
};

// ───────── yardımcı objeler ─────────
export const Tabanca: React.FC<{ s?: number; rot?: number; c?: string }> = ({ s = 1, rot = -90, c = "#22242A" }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-10,-8 L74,-8 L74,10 L16,10 L16,14 Q14,40 0,48 L-14,46 Q-4,30 -6,12 L-10,10Z" fill={c} stroke={INK} strokeWidth={4} />
    <rect x={20} y={-14} width={50} height={6} fill="#3A3D44" />
  </g>
);
export const Ekmek: React.FC<{ x: number; y: number; s?: number; half?: number }> = ({ x, y, s = 1, half = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d={`M-90,0 C-90,-40 -40,-56 0,-56 C40,-56 90,-40 90,0 Q0,14 -90,0Z`} fill="#D9A05A" stroke={INK} strokeWidth={5} transform={`translate(${-half * 30},0)`} />
    {[-40, 0, 40].map((xx) => <path key={xx} d={`M${xx - 16 - half * 30},-36 l22,-10`} stroke="#B07A3A" strokeWidth={6} strokeLinecap="round" />)}
    {half > 0 && <path d="M60,0 C60,-40 90,-50 110,-48 C130,-40 140,-20 136,0 Q100,10 60,0Z" fill="#E8C08A" stroke={INK} strokeWidth={5} transform={`translate(${half * 40},0)`} />}
  </g>
);
// dört adamlı eski fotoğraf; dördüncünün yüzü kazınmış (reveal=1 → kazıntının altındaki gri saç ve gözlük belirir)
export const Foto4: React.FC<{ x: number; y: number; s?: number; rot?: number; reveal?: number; hl?: number }> = ({ x, y, s = 1, rot = -4, reveal = 0, hl = -1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-330} y={-220} width={660} height={440} fill="#F2E8D2" stroke={INK} strokeWidth={6} />
    <rect x={-300} y={-190} width={600} height={340} fill="#9C8B70" />
    <rect x={-300} y={60} width={600} height={90} fill="#7E6E58" />
    {[-210, -70, 70, 210].map((xx, i) => (
      <g key={i} transform={`translate(${xx},140) scale(0.42)`} opacity={hl >= 0 && hl !== i ? 0.55 : 1}>
        <DFig x={0} y={0} o={i === 3 ? { ...CAST.yilmaz, c: "#4A4038", inner: "#D8CCB4" } : i === 0 ? { ...CAST.bozo, c: "#3A3028" } : i === 1 ? { ...CAST.yasli, hair: "slick", beardColor: "#3A2A1A", hairColor: "#3A2A1A", c: "#4A3E30" } : { ...CAST.haydar, beard: undefined, top: "suit", c: "#4A4036", inner: "#D8CCB4", tie: "#3A2A20" }} mouth="flat" />
      </g>
    ))}
    {/* kazıntı (dördüncü adamın yüzü) */}
    <g opacity={1 - reveal}>
      <path d="M176,-78 l22,-14 l20,8 l24,-6 l10,22 l-6,20 l12,18 l-16,22 l-24,-4 l-20,14 l-18,-12 l-14,-24 l8,-18Z" fill="#E9DFC8" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${180 + i * 3},${-70 + i * 12} l${54 - (i % 3) * 8},${-6 + (i % 2) * 6}`} stroke="#B9AA8C" strokeWidth={3} />)}
    </g>
    <rect x={-330} y={-220} width={660} height={440} fill="#C8A060" opacity={0.15} />
    <text x={240} y={196} textAnchor="middle" fontFamily="Poppins" fontStyle="italic" fontSize={28} fill="#6A5A42">1998</text>
  </g>
);
export const Yuzuk: React.FC<{ x: number; y: number; s?: number; open?: number; t?: number }> = ({ x, y, s = 1, open = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-70} y={-40} width={140} height={80} rx={14} fill="#7A1F2E" stroke={INK} strokeWidth={5} />
    <path d={`M-70,-40 L70,-40 L70,${-40 - 70 * open} L-70,${-40 - 70 * open}Z`} fill="#5A1622" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-20} rx={34} ry={30} fill="none" stroke="#F2C14E" strokeWidth={10} />
    <path d="M-12,-56 L0,-72 L12,-56 L0,-46Z" fill="#DFF6FF" stroke="#9AD" strokeWidth={3} />
    <circle cx={6} cy={-64} r={4 + Math.sin(t * 6) * 2} fill="#FFFFFF" />
  </g>
);
export const CocukResmi: React.FC<{ x: number; y: number; s?: number; rot?: number; k?: number }> = ({ x, y, s = 1, rot = 3, k = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-180} width={520} height={360} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
    <g strokeLinecap="round" fill="none" strokeWidth={8} opacity={k}>
      <circle cx={170} cy={-110} r={40} stroke="#F6C445" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return <path key={i} d={`M${170 + Math.cos(a) * 52},${-110 + Math.sin(a) * 52} l${Math.cos(a) * 20},${Math.sin(a) * 20}`} stroke="#F6C445" />; })}
      <path d="M-240,120 Q0,90 240,120" stroke="#3FAE6A" />
      {[-150, -60, 30, 120].map((xx, i) => (
        <g key={i} stroke={["#2B2522", "#7A1F2E", "#1C1D22", "#F2A7B8"][i]}>
          <circle cx={xx} cy={i === 3 ? -10 : -40} r={i === 3 ? 18 : 24} />
          <path d={`M${xx},${i === 3 ? 8 : -16} v${i === 3 ? 60 : 90} M${xx - 30},${i === 3 ? 30 : 10} h60 M${xx},${i === 3 ? 68 : 74} l-20,40 M${xx},${i === 3 ? 68 : 74} l20,40`} />
        </g>
      ))}
      <path d="M-170,-120 q10,-20 20,0 q10,-20 20,0 l-20,24Z" stroke="#E0393E" fill="#E0393E" />
    </g>
    <text x={-200} y={160} fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#3A7BD5" opacity={k}>ADA</text>
  </g>
);
export const Kayit: React.FC<{ x: number; y: number; s?: number; t?: number; on?: number }> = ({ x, y, s = 1, t = 0, on = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-70} y={-130} width={140} height={260} rx={22} fill="#24262C" stroke={INK} strokeWidth={6} />
    <rect x={-54} y={-110} width={108} height={130} rx={8} fill="#0F1A14" />
    {Array.from({ length: 12 }, (_, i) => { const h = on ? 10 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 70 : 6; return <rect key={i} x={-48 + i * 8.5} y={-45 - h / 2} width={5} height={h} fill="#3FE07A" />; })}
    <circle cx={0} cy={70} r={26} fill="#E0393E" opacity={0.5 + 0.5 * Math.sin(t * 5)} stroke={INK} strokeWidth={4} />
    <text x={0} y={-118} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={16} fill="#E0393E">REC</text>
  </g>
);
export const Zincir: React.FC<{ x0: number; y0: number; x1: number; y1: number; sag?: number; c?: string }> = ({ x0, y0, x1, y1, sag = 60, c = "#8A8E96" }) => {
  const n = Math.max(4, Math.round(Math.hypot(x1 - x0, y1 - y0) / 34));
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, i) => {
        const k = i / n;
        const xx = lerp(x0, x1, k), yy = lerp(y0, y1, k) + Math.sin(k * Math.PI) * sag;
        return <ellipse key={i} cx={xx} cy={yy} rx={i % 2 ? 20 : 8} ry={i % 2 ? 8 : 16} fill="none" stroke={c} strokeWidth={7} />;
      })}
    </g>
  );
};
export const TekerlekliSandalye: React.FC<{ x: number; y: number; s?: number; t?: number; roll?: number; who?: React.ReactNode }> = ({ x, y, s = 1, t = 0, roll = 0, who }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-80,-260 L-70,-120 L80,-120" stroke="#3A3D44" strokeWidth={14} fill="none" strokeLinejoin="round" />
    {who}
    <g transform={`translate(-30,-80) rotate(${roll * 600})`}><circle r={84} fill="none" stroke="#24262C" strokeWidth={14} /><circle r={70} fill="none" stroke="#9AA0A8" strokeWidth={4} />{[0, 45, 90, 135].map((a) => <path key={a} d="M-70,0 H70" stroke="#9AA0A8" strokeWidth={3} transform={`rotate(${a})`} />)}</g>
    <circle cx={90} cy={-18} r={18} fill="#24262C" />
    <path d="M80,-120 L96,-30" stroke="#3A3D44" strokeWidth={10} />
  </g>
);
export const SiyahMinibus: React.FC<{ x: number; y: number; s?: number; t?: number; door?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t = 0, door = 0, dir = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    <path d="M-330,-60 L-330,-300 Q-326,-330 -290,-332 L190,-332 Q250,-330 290,-250 L340,-160 Q352,-130 350,-60Z" fill="#17181C" stroke={INK} strokeWidth={6} />
    <path d="M-300,-300 L170,-300 Q220,-296 250,-240 L290,-170 L-300,-170Z" fill="#2E3440" />
    {[-290, -150, -10].map((xx) => <rect key={xx} x={xx} y={-292} width={120} height={112} rx={6} fill="#0B0C10" opacity={0.85} />)}
    <path d="M130,-292 L180,-292 Q220,-290 246,-240 L276,-180 L130,-180Z" fill="#232836" />
    <rect x={-80 + door * 130} y={-300} width={140} height={236} fill="#1D1F25" stroke={INK} strokeWidth={4} />
    <rect x={-330} y={-110} width={680} height={14} fill="#0A0A0C" />
    <rect x={310} y={-130} width={40} height={20} rx={4} fill="#FFF3B0" />
    {[-210, 210].map((xx) => <g key={xx} transform={`translate(${xx},-50) rotate(${t * 500})`}><circle r={56} fill="#111" /><circle r={30} fill="#5A5E66" /><path d="M-30,0 H30 M0,-30 V30" stroke="#333" strokeWidth={5} /></g>)}
    <rect x={-120} y={-150} width={90} height={24} rx={3} fill="#E8E8E8" /><text x={-75} y={-132} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={16} fill="#222">34 ??? 00</text>
  </g>
);
export const SirenIsik: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => {
  const a = Math.sin(t * 9) > 0 ? 1 : 0;
  return (
    <g opacity={k} style={{ mixBlendMode: "screen" }}>
      <rect width={1920} height={1080} fill="#E0393E" opacity={0.16 * a} />
      <rect width={1920} height={1080} fill="#3A7BD5" opacity={0.16 * (1 - a)} />
    </g>
  );
};
export const Yagmur: React.FC<{ t: number; k?: number; slant?: number }> = ({ t, k = 1, slant = 0.25 }) => (
  <g opacity={k}>
    {Array.from({ length: 130 }, (_, i) => {
      const sp = 1500 + hs(i) * 900;
      const X = ((i * 137.3 + hs(i + 4) * 400 - t * sp * slant) % 2300 + 2300) % 2300 - 200;
      const Y = ((i * 211.7 + t * sp) % 1300) - 110;
      const L = 30 + hs(i + 9) * 40;
      return <path key={i} d={`M${X},${Y} l${-L * slant},${L}`} stroke="#CFE3F2" strokeOpacity={0.35 + hs(i + 2) * 0.35} strokeWidth={2 + hs(i + 7) * 2} strokeLinecap="round" />;
    })}
  </g>
);
export const Simsek: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const d = t - at;
  if (d < 0 || d > 0.5) return null;
  const f = d < 0.08 ? 1 : d < 0.16 ? 0.2 : d < 0.24 ? 0.8 : 1 - (d - 0.24) / 0.26;
  return <rect width={1920} height={1080} fill="#EEF4FF" opacity={0.55 * Math.max(0, f)} />;
};

// ───────── mekânlar ─────────
// Konak (Bozo'nun köşkü) içi: salon / yatak odası / mutfak. Gece Boğaz manzarası, avize, ahşap lambri.
export const Konak: React.FC<{ t: number; room?: "salon" | "oda" | "mutfak" | "kapi"; night?: number; lamp?: number; door?: number }> = ({ t, room = "salon", night = 1, lamp = 1, door = 0 }) => {
  const wall = room === "mutfak" ? "#D8CDB8" : "#3E2C22";
  const wall2 = room === "mutfak" ? "#C4B79E" : "#2E2019";
  const sky = night > 0.5 ? "#0E1A30" : "#7FB3D6";
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      {room !== "mutfak" && Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170 - 20} y={600} width={150} height={300} rx={6} fill="none" stroke={wall2} strokeWidth={8} />)}
      <rect y={560} width={1920} height={18} fill={wall2} />
      {/* büyük pencere + Boğaz */}
      <g transform={room === "oda" ? "translate(1200,0)" : room === "mutfak" ? "translate(-200,0)" : "translate(0,0)"}>
        <rect x={560} y={130} width={800} height={460} fill={sky} stroke="#1A120E" strokeWidth={14} />
        {night > 0.5 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={580 + hs(i) * 760} cy={150 + hs(i + 3) * 150} r={1.5 + hs(i + 5) * 1.5} fill="#FFF" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />)}
        <path d="M560,420 L700,380 L820,400 L980,360 L1120,392 L1260,370 L1360,390 L1360,470 L560,470Z" fill={night > 0.5 ? "#16233A" : "#5E7F96"} />
        {Array.from({ length: 34 }, (_, i) => <rect key={i} x={575 + i * 23} y={400 + hs(i + 1) * 50} width={6} height={6} fill="#FFD27A" opacity={night > 0.5 ? 0.85 : 0} />)}
        <path d="M640,452 Q960,330 1290,452" stroke={night > 0.5 ? "#7FA8D6" : "#E8EEF2"} strokeWidth={8} fill="none" />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={660 + i * 46} cy={452 - Math.sin((i / 13) * Math.PI) * 112} r={4} fill="#FFE29A" opacity={night > 0.5 ? 0.9 : 0} />)}
        <rect x={560} y={470} width={800} height={120} fill={night > 0.5 ? "#0E2440" : "#3A6E96"} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${590 + i * 96 + ((t * 20) % 96)},${500 + (i % 3) * 26} h40`} stroke="#FFD27A" strokeOpacity={night > 0.5 ? 0.5 : 0.2} strokeWidth={3} />)}
        <path d="M960,130 V590 M560,360 H1360" stroke="#1A120E" strokeWidth={10} />
        <path d="M520,110 Q600,360 560,620 L470,620 Q520,360 470,110Z M1400,110 Q1320,360 1360,620 L1450,620 Q1400,360 1450,110Z" fill="#5A1E28" stroke={INK} strokeWidth={5} />
      </g>
      {room === "salon" && (
        <g>
          {/* şömine + tablo */}
          <rect x={80} y={430} width={340} height={300} fill="#5A4436" stroke={INK} strokeWidth={6} />
          <rect x={140} y={510} width={220} height={220} fill="#170E0A" />
          {[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 50},720 q${-20 + Math.sin(t * 7 + i) * 10},-60 0,-${90 + 30 * Math.sin(t * 5 + i * 2)} q${20},40 0,90Z`} fill={i === 1 ? "#FFC14E" : "#F28C28"} opacity={0.9} />)}
          <rect x={110} y={200} width={280} height={200} fill="#C8A060" stroke={INK} strokeWidth={6} /><rect x={130} y={220} width={240} height={160} fill="#2E3A2A" /><path d="M140,370 L220,280 L280,330 L330,260 L360,370Z" fill="#4E6A3E" />
          {/* koltuk */}
          <path d="M1480,820 Q1480,700 1560,700 L1860,700 Q1920,700 1920,820 L1920,920 L1480,920Z" fill="#5A1E28" stroke={INK} strokeWidth={6} />
          <rect x={1460} y={780} width={70} height={150} rx={20} fill="#4A1620" stroke={INK} strokeWidth={5} />
          {/* avize */}
          <path d="M960,0 V70" stroke="#C8A060" strokeWidth={5} />
          <g transform={`translate(960,90) rotate(${Math.sin(t * 0.9) * 1.5})`}><path d="M-120,0 Q0,60 120,0" stroke="#C8A060" strokeWidth={8} fill="none" />{[-120, -60, 0, 60, 120].map((xx) => <g key={xx}><rect x={xx - 6} y={xx === 0 ? 24 : Math.abs(xx) === 60 ? 14 : -6} width={12} height={24} fill="#F4EAD2" /><circle cx={xx} cy={(xx === 0 ? 24 : Math.abs(xx) === 60 ? 14 : -6) - 8} r={9 + Math.sin(t * 9 + xx) * 1.5} fill="#FFE29A" opacity={lamp} /></g>)}</g>
          <ellipse cx={960} cy={140} rx={420} ry={180} fill="#FFE29A" opacity={0.08 * lamp} />
        </g>
      )}
      {room === "oda" && (
        <g>
          {/* yatak + abajur */}
          <rect x={80} y={660} width={760} height={240} rx={14} fill="#E8E0D0" stroke={INK} strokeWidth={6} />
          <rect x={60} y={460} width={70} height={440} rx={10} fill="#3A2418" stroke={INK} strokeWidth={6} />
          <path d="M140,700 Q200,650 300,680 Q260,720 140,720Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <path d="M80,760 L840,760 L840,900 L80,900Z" fill="#6A1E2E" stroke={INK} strokeWidth={6} />
          <rect x={880} y={720} width={140} height={180} fill="#3A2418" stroke={INK} strokeWidth={6} />
          <path d="M910,600 L990,600 L1010,690 L890,690Z" fill="#F4E2B0" stroke={INK} strokeWidth={5} /><rect x={944} y={690} width={12} height={30} fill="#3A2418" />
          <ellipse cx={950} cy={640} rx={260} ry={220} fill="#FFE29A" opacity={0.12 * lamp} />
        </g>
      )}
      {room === "mutfak" && (
        <g>
          <rect x={900} y={600} width={1020} height={300} fill="#8A6A4A" stroke={INK} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={920 + i * 200} y={630} width={180} height={250} rx={6} fill="#9C7A56" stroke={INK} strokeWidth={4} />)}
          <rect x={890} y={580} width={1040} height={30} fill="#E8E2D8" stroke={INK} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={960 + i * 240} y={240} width={200} height={170} rx={6} fill="#9C7A56" stroke={INK} strokeWidth={4} />)}
          <g transform="translate(1300,540)"><rect x={-60} y={-20} width={120} height={40} rx={8} fill="#2A2A2A" />{[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-30 q${-10 + Math.sin(t * 3 + i) * 8},-30 0,-60`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={6} fill="none" />)}</g>
          <rect x={300} y={720} width={500} height={30} fill="#7A5A3A" stroke={INK} strokeWidth={5} /><path d="M330,750 V900 M770,750 V900" stroke="#5A3E25" strokeWidth={14} />
          <g transform="translate(520,700)"><path d="M-30,0 L-24,-50 L24,-50 L30,0Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} /><path d="M-24,-40 h48" stroke="#C0392B" strokeWidth={6} /></g>
        </g>
      )}
      {room === "kapi" && (
        <g>
          <rect x={760} y={260} width={400} height={640} fill="#2A1A12" stroke={INK} strokeWidth={8} />
          <g transform={`translate(760,260) scale(${1 - door * 0.82},1)`}><rect width={400} height={640} fill="#5A3A26" stroke={INK} strokeWidth={6} /><rect x={50} y={50} width={300} height={240} fill="none" stroke="#3E2618" strokeWidth={8} /><rect x={50} y={340} width={300} height={250} fill="none" stroke="#3E2618" strokeWidth={8} /><circle cx={350} cy={340} r={14} fill="#C8A060" /></g>
          <path d={`M1160,900 L${1160 + door * 300},1080 L${760 + door * 200},1080 L760,900Z`} fill="#FFE29A" opacity={0.25 * door} />
        </g>
      )}
      <rect y={900} width={1920} height={180} fill={room === "mutfak" ? "#B9A88A" : "#2A1C14"} />
      <rect x={300} y={930} width={1320} height={130} rx={10} fill="url(#tCarpet)" opacity={room === "mutfak" ? 0 : 0.55} />
      {night > 0.5 && <rect width={1920} height={1080} fill="#0A1426" opacity={0.25} />}
    </g>
  );
};
// Köşk bahçesi (gündüz): beyaz köşk, çim, salıncak, yüksek duvar, güvenlik
export const KonakBahce: React.FC<{ t: number; swing?: number; dusk?: number }> = ({ t, swing = 1, dusk = 0 }) => {
  const sw = Math.sin(t * 2.2) * 18 * swing;
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 700 + t * 12) % 2400) - 200} cy={120 + i * 50} rx={140} ry={34} fill="#FFFFFF" opacity={0.8} />)}
      <path d="M0,520 Q480,470 960,500 T1920,490 L1920,620 L0,620Z" fill="#4E7A4A" />
      {/* köşk */}
      <g transform="translate(1180,620)">
        <rect x={-380} y={-420} width={760} height={420} fill="#F2EEE6" stroke={INK} strokeWidth={6} />
        <path d="M-420,-420 L0,-560 L420,-420Z" fill="#8A3A2E" stroke={INK} strokeWidth={6} />
        {[-300, -160, 160, 300].map((xx) => [-330, -170].map((yy) => <g key={`${xx}${yy}`}><rect x={xx - 40} y={yy} width={80} height={110} fill="#3E5A72" stroke={INK} strokeWidth={4} /><path d={`M${xx},${yy} v110 M${xx - 40},${yy + 50} h80`} stroke="#F2EEE6" strokeWidth={5} /><rect x={xx - 52} y={yy - 14} width={104} height={14} fill="#D8D2C4" /></g>))}
        <rect x={-70} y={-200} width={140} height={200} fill="#5A3A26" stroke={INK} strokeWidth={6} />
        {[-110, 110].map((xx) => <rect key={xx} x={xx - 14} y={-230} width={28} height={230} fill="#E2DDD2" stroke={INK} strokeWidth={4} />)}
        <path d="M-150,-230 L150,-230 L120,-260 L-120,-260Z" fill="#D8D2C4" stroke={INK} strokeWidth={4} />
      </g>
      {/* duvar */}
      <rect y={560} width={760} height={70} fill="#CFC6B4" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 80} y={548} width={60} height={14} fill="#B8AE9A" />)}
      <rect y={620} width={1920} height={460} fill="#6FA35A" />
      {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${hs(i) * 1920},${660 + hs(i + 1) * 400} q4,-14 8,0`} stroke="#4E8A40" strokeWidth={4} fill="none" />)}
      {/* ağaç */}
      <g transform="translate(330,640)">
        <path d="M-24,0 L-14,-300 L14,-300 L24,0Z" fill="#6A4A30" stroke={INK} strokeWidth={5} />
        <path d="M-14,-250 L-120,-280" stroke="#6A4A30" strokeWidth={22} strokeLinecap="round" />
        {[[-120, -360, 120], [40, -400, 140], [-30, -300, 110], [120, -320, 100]].map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill={i % 2 ? "#3E7A3E" : "#4E8E46"} stroke={INK} strokeWidth={5} />)}
        {/* salıncak */}
        <g transform={`translate(-110,-282) rotate(${sw})`}>
          <path d="M-40,0 V240 M40,0 V240" stroke="#3A2A1E" strokeWidth={5} />
          <rect x={-56} y={236} width={112} height={18} rx={6} fill="#C0392B" stroke={INK} strokeWidth={4} />
        </g>
      </g>
      {/* çiçekler */}
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={600 + i * 72} cy={650 + (i % 3) * 10} r={10} fill={["#E86A92", "#F6C445", "#FFFFFF"][i % 3]} stroke={INK} strokeWidth={3} />)}
      <rect width={1920} height={1080} fill="#FFB060" opacity={dusk * 0.12} />
    </g>
  );
};
export const SALINCAK_EL = (t: number, swing = 1): [number, number] => {
  const a = (Math.sin(t * 2.2) * 18 * swing * Math.PI) / 180;
  return [330 - 110 + Math.sin(-a) * -250, 640 - 282 + Math.cos(a) * 250];
};
// Hastane odası (gece): yatak, monitör, serum, pencere
export const HastaneOda: React.FC<{ t: number; beat?: number; night?: number }> = ({ t, beat = 1, night = 1 }) => {
  const ph = (t * 1.2) % 1;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#9DB4B8" : "#D6E6E6"} />
      <rect y={620} width={1920} height={14} fill="#6E9AA0" />
      <rect x={1240} y={150} width={520} height={360} fill={night ? "#142640" : "#9FD0EC"} stroke="#E6EEEE" strokeWidth={16} />
      <path d="M1500,150 V510 M1240,330 H1760" stroke="#E6EEEE" strokeWidth={10} />
      {night && Array.from({ length: 20 }, (_, i) => <rect key={i} x={1260 + i * 24} y={380 + hs(i) * 100} width={8} height={8} fill="#FFD27A" opacity={0.7} />)}
      {/* monitör */}
      <g transform="translate(380,320)">
        <rect x={-150} y={-110} width={300} height={220} rx={14} fill="#2A2E36" stroke={INK} strokeWidth={6} />
        <rect x={-130} y={-90} width={260} height={150} fill="#071410" />
        <polyline fill="none" stroke="#3FE07A" strokeWidth={4} points={Array.from({ length: 52 }, (_, i) => { const xx = -126 + i * 5; const p = ((i / 52) - ph + 1) % 1; const spike = beat > 0 && p < 0.06 ? (p < 0.03 ? -60 : 30) : 0; return `${xx},${-10 + spike * beat}`; }).join(" ")} />
        <text x={80} y={46} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#3FE07A">{beat > 0 ? Math.round(68 + Math.sin(t) * 4) : "—"}</text>
        <path d="M0,110 V430" stroke="#5A5E66" strokeWidth={10} />
      </g>
      {/* serum */}
      <g transform="translate(1080,240)"><path d="M0,0 V560" stroke="#9AA0A8" strokeWidth={8} /><path d="M-40,20 h80" stroke="#9AA0A8" strokeWidth={6} /><rect x={-30} y={30} width={60} height={90} rx={14} fill="#E8F6FF" stroke={INK} strokeWidth={4} /><rect x={-26} y={70} width={52} height={46} rx={10} fill="#BFE6F2" /><path d="M0,120 Q-40,300 -180,420" stroke="#C9D6D8" strokeWidth={4} fill="none" /></g>
      {/* yatak */}
      <g transform="translate(700,780)">
        <rect x={-460} y={-60} width={900} height={110} rx={10} fill="#F4F6F6" stroke={INK} strokeWidth={6} />
        <rect x={-480} y={-200} width={40} height={300} rx={8} fill="#B8C4C8" stroke={INK} strokeWidth={5} />
        <rect x={420} y={-120} width={40} height={220} rx={8} fill="#B8C4C8" stroke={INK} strokeWidth={5} />
        <path d="M-440,-80 Q-380,-130 -280,-110 L-280,-60 L-440,-60Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <path d="M-200,-70 Q100,-120 420,-70 L420,-40 L-200,-40Z" fill="#A9C7D6" stroke={INK} strokeWidth={5} />
        <path d="M-440,50 V200 M420,50 V200" stroke="#5A5E66" strokeWidth={12} />
      </g>
      <rect y={900} width={1920} height={180} fill={night ? "#7E9498" : "#C2D2D2"} />
      {night && <rect width={1920} height={1080} fill="#0A1A30" opacity={0.18} />}
    </g>
  );
};
// Hapishane: hücre (gece, iki ranza, parmaklık, ay ışığı) veya avlu (gündüz, tel örgü)
export const Hapis: React.FC<{ t: number; mode?: "hucre" | "avlu" }> = ({ t, mode = "hucre" }) => mode === "hucre" ? (
  <g>
    <rect width={1920} height={1080} fill="#4A4E52" />
    <rect width={1920} height={1080} fill="url(#tBrick)" />
    <rect x={1300} y={140} width={260} height={180} fill="#16243A" stroke="#2A2E32" strokeWidth={14} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={1320 + i * 60} y={140} width={12} height={180} fill="#2A2E32" />)}
    <path d="M1300,320 L1560,320 L1200,1000 L700,1000Z" fill="#CFE3F2" opacity={0.12} />
    <circle cx={1500} cy={200} r={30} fill="#F4F0DC" opacity={0.85} />
    <g transform="translate(360,0)">
      <rect x={-200} y={520} width={460} height={40} fill="#5A5E66" stroke={INK} strokeWidth={5} /><rect x={-200} y={760} width={460} height={40} fill="#5A5E66" stroke={INK} strokeWidth={5} />
      <rect x={-190} y={496} width={440} height={30} rx={6} fill="#8A8E7A" /><rect x={-190} y={736} width={440} height={30} rx={6} fill="#8A8E7A" />
      <path d="M-200,400 V1000 M260,400 V1000" stroke="#3A3E44" strokeWidth={16} />
    </g>
    <rect y={1000} width={1920} height={80} fill="#3A3D40" />
    {/* ön parmaklık */}
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 160 - 20 + Math.sin(t * 0.3) * 4} y={0} width={18} height={1080} fill="#1E2024" opacity={0.0} />)}
    <rect width={1920} height={1080} fill="#08101C" opacity={0.3} />
  </g>
) : (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    <rect y={180} width={1920} height={440} fill="#B8B2A6" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 84},180 l40,-60 l40,60`} stroke="#6A6E74" strokeWidth={4} fill="none" />)}
    <path d="M0,120 H1920" stroke="#6A6E74" strokeWidth={5} />
    <g transform="translate(1600,180)"><rect x={-70} y={-180} width={140} height={180} fill="#9A948A" stroke={INK} strokeWidth={6} /><rect x={-90} y={-210} width={180} height={40} fill="#7A746A" stroke={INK} strokeWidth={5} /><rect x={-40} y={-150} width={80} height={50} fill="#2A3A4A" /></g>
    <rect y={620} width={1920} height={460} fill="#A9A49A" />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${hs(i) * 1920},${660 + hs(i + 3) * 380} l30,4`} stroke="#8E897F" strokeWidth={4} />)}
    <g transform="translate(300,620)"><rect x={-150} y={-30} width={300} height={30} fill="#7A5A3A" stroke={INK} strokeWidth={5} /><path d="M-130,0 V60 M130,0 V60" stroke="#5A3E25" strokeWidth={12} /></g>
  </g>
);
// Okul kapısı: sokak, okul binası, demir kapı, çocuklar
export const OkulKapisi: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    <g transform={`translate(${-px},0)`}>
      <rect x={200} y={180} width={1400} height={480} fill="#E8C27A" stroke={INK} strokeWidth={6} />
      <rect x={200} y={150} width={1400} height={40} fill="#B85A3A" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 7 }, (_, i) => [0, 1].map((r) => <rect key={`${i}${r}`} x={260 + i * 196} y={230 + r * 190} width={130} height={130} fill="#9FD0EC" stroke={INK} strokeWidth={5} />))}
      <rect x={700} y={196} width={400} height={50} rx={6} fill="#1B4F9C" /><text x={900} y={232} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFF">İLKOKULU</text>
      <path d="M840,40 V196" stroke="#555" strokeWidth={6} /><rect x={846} y={40} width={110} height={70} fill="#E0393E" /><circle cx={890} cy={75} r={16} fill="#FFF" /><circle cx={896} cy={75} r={13} fill="#E0393E" />
      {/* duvar + kapı */}
      <rect y={560} width={2400} height={120} fill="#D8CFC0" stroke={INK} strokeWidth={5} />
      <g transform="translate(900,680)">
        <rect x={-180} y={-240} width={20} height={240} fill="#2A2E36" /><rect x={160} y={-240} width={20} height={240} fill="#2A2E36" />
        {Array.from({ length: 11 }, (_, i) => <rect key={i} x={-150 + i * 30} y={-220} width={8} height={220} fill="#3A3E46" />)}
        <path d="M-160,-200 H160 M-160,-60 H160" stroke="#3A3E46" strokeWidth={8} />
      </g>
    </g>
    <rect y={680} width={1920} height={110} fill="#C9C2B4" />
    <rect y={790} width={1920} height={290} fill="#5E6670" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={((i * 280 - px * 1.2) % 2240 + 2240) % 2240 - 160} y={930} width={140} height={16} fill="#E8E8E8" />)}
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1260 + i * 120 - px * 0.3},${700 + (i % 2) * 6}) scale(0.32)`}><DFig x={0} y={0} o={{ ...CAST.ada, c: ["#3A7BD5", "#F6C445", "#3FAE6A", "#E86A92"][i], hairColor: ["#2A1A12", "#8A5A34", "#1A1410", "#C99A5E"][i], hair: i % 2 ? "kid" : "short", female: i % 2 === 1 }} t={t} seed={i * 3} mouth="smile" /></g>)}
  </g>
);
// Eski Tersane (Haliç, terk edilmiş kuru havuz): gece, yağmur, vinçler, konteynerler, projektörler; flood=su seviyesi 0..1
export const Tersane: React.FC<{ t: number; lights?: number; flood?: number; rain?: number; dawn?: number; crane?: number }> = ({ t, lights = 0, flood = 0, rain = 1, dawn = 0, crane = 0 }) => {
  const W = 680 - flood * 300;
  return (
    <g>
      <rect width={1920} height={1080} fill={dawn ? "url(#tSkyDusk)" : "url(#tSkyNight)"} />
      {/* karşı kıyı (Haliç) */}
      <path d="M0,360 L120,330 L160,280 L200,330 L420,320 L520,250 L540,200 L560,250 L640,320 L900,330 L1100,300 L1300,330 L1500,310 L1700,330 L1920,320 L1920,420 L0,420Z" fill="#141E30" />
      <ellipse cx={540} cy={250} rx={60} ry={40} fill="#141E30" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={hs(i) * 1920} y={330 + hs(i + 2) * 70} width={5} height={5} fill="#FFD27A" opacity={0.6} />)}
      <rect y={410} width={1920} height={90} fill="#0E1C2E" />
      {/* vinçler */}
      {[[300, 1], [1540, -1]].map(([cx, d], i) => (
        <g key={i} transform={`translate(${cx},560)`}>
          <path d="M-40,0 L-20,-440 L20,-440 L40,0" fill="none" stroke="#C0782A" strokeWidth={14} />
          {Array.from({ length: 10 }, (_, k) => <path key={k} d={`M${-38 + k * 2},${-k * 44} L${36 - k * 2},${-(k + 1) * 44}`} stroke="#A0621E" strokeWidth={6} />)}
          <g transform={`rotate(${(d as number) * (crane * 8 + Math.sin(t * 0.4) * 1.5)},0,-440)`}>
            <path d={`M-80,-440 L${(d as number) * 520},-440`} stroke="#C0782A" strokeWidth={18} />
            <path d={`M0,-500 L${(d as number) * 520},-440 M0,-500 L-80,-440`} stroke="#A0621E" strokeWidth={6} />
            <path d={`M${(d as number) * 420},-440 V${-240 + Math.sin(t * 0.8 + i) * 10}`} stroke="#555" strokeWidth={4} />
            <path d={`M${(d as number) * 420 - 16},${-240 + Math.sin(t * 0.8 + i) * 10} h32 l-16,26Z`} fill="#333" />
          </g>
          {lights > 0 && <><circle cx={0} cy={-460} r={16} fill="#FFF7D0" opacity={lights} /><path d={`M0,-460 L${(d as number) * 600},440 L${(d as number) * -100},440Z`} fill="#FFF7D0" opacity={0.12 * lights} /></>}
        </g>
      ))}
      {/* beton kenar + kuru havuz */}
      <rect y={500} width={1920} height={120} fill="#4A4E54" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 124} y={500} width={6} height={120} fill="#3A3E44" />)}
      <path d="M140,620 L1780,620 L1660,1080 L260,1080Z" fill="#34383E" />
      <path d="M260,1080 L140,620 L200,620 L310,1080Z M1660,1080 L1780,620 L1720,620 L1610,1080Z" fill="#2A2E34" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${200 + i * 10},${660 + i * 50} H${1720 - i * 10}`} stroke="#2A2E34" strokeWidth={4} />)}
      {/* su */}
      {flood > 0 && (
        <g>
          <path d={`M${200 - flood * 40},${1080 - flood * 420} ${Array.from({ length: 20 }, (_, i) => `L${200 + i * 80},${1080 - flood * 420 + Math.sin(t * 4 + i) * 8}`).join(" ")} L${1720 + flood * 40},${1080 - flood * 420} L1720,1080 L200,1080Z`} fill="#1E4A6A" opacity={0.92} />
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${260 + i * 100 + Math.sin(t * 2 + i) * 20},${1090 - flood * 420 + 30 + (i % 3) * 40} h50`} stroke="#9FD0EC" strokeOpacity={0.4} strokeWidth={4} />)}
          <path d={`M940,620 Q${960 + Math.sin(t * 9) * 20},${700} 960,${1080 - flood * 420}`} stroke="#9FD0EC" strokeWidth={60 + flood * 20} opacity={0.5} fill="none" />
        </g>
      )}
      {/* konteynerler */}
      {[[1180, "#8A2E2E"], [1500, "#2E5A8A"]].map(([xx, c], i) => (
        <g key={i} transform={`translate(${xx},500)`}>
          <rect x={-150} y={-150} width={300} height={150} fill={c as string} stroke={INK} strokeWidth={6} />
          {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${-130 + k * 32},-140 V-10`} stroke="#000" strokeOpacity={0.25} strokeWidth={6} />)}
        </g>
      ))}
      {/* projektör ışığı */}
      {lights > 0 && <rect width={1920} height={1080} fill="#FFF7D0" opacity={0.06 * lights} />}
      {rain > 0 && <Yagmur t={t} k={rain} />}
      {/* yağmur halkaları */}
      {rain > 0 && Array.from({ length: 10 }, (_, i) => { const p = (t * 1.3 + hs(i) * 3) % 1; return <ellipse key={i} cx={hs(i + 1) * 1920} cy={520 + hs(i + 5) * 90} rx={6 + p * 30} ry={2 + p * 8} fill="none" stroke="#CFE3F2" strokeOpacity={(1 - p) * 0.5 * rain} strokeWidth={2} />; })}
      <rect width={1920} height={1080} fill="#06101E" opacity={0.25 * (1 - lights * 0.6) * (1 - dawn)} />
      <rect x={W} width={0} height={0} />
    </g>
  );
};
// Konsey: karanlık uzun masa, tek lamba, siluetler
export const Konsey: React.FC<{ t: number; n?: number; lamp?: number }> = ({ t, n = 7, lamp = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0B0F" />
    <path d={`M960,120 L${960 - 700},1080 L${960 + 700},1080Z`} fill="#FFE8B0" opacity={0.07 * lamp} />
    <path d="M960,0 V120" stroke="#333" strokeWidth={5} />
    <path d="M880,120 L1040,120 L1000,170 L920,170Z" fill="#2A2A2A" stroke="#444" strokeWidth={3} />
    <ellipse cx={960} cy={172} rx={50} ry={12} fill="#FFE8B0" opacity={0.6 * lamp + Math.sin(t * 13) * 0.04} />
    <path d="M520,760 L1400,760 L1620,960 L300,960Z" fill="#2A1C14" stroke="#000" strokeWidth={6} />
    {Array.from({ length: n }, (_, i) => {
      const k = n === 1 ? 0.5 : i / (n - 1);
      const xx = lerp(560, 1360, k), sc = 0.62 + Math.abs(k - 0.5) * 0.2;
      return <g key={i} transform={`translate(${xx},${760 - Math.abs(k - 0.5) * 20}) scale(${sc})`}><DFig x={0} y={0} o={CAST.konsey} sil="#050507" t={t} seed={i * 2} /></g>;
    })}
    <rect x={880} y={700} width={160} height={50} fill="#C8B48A" opacity={0.8} />
  </g>
);
// Sahil kasabası (final): gün batımı, ahşap ev, iskele, balıkçı tekneleri
export const Sahil: React.FC<{ t: number; sun?: number }> = ({ t, sun = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDusk)" />
    <circle cx={1300} cy={520 + (1 - sun) * 120} r={110} fill="#FFD27A" opacity={0.95} />
    <circle cx={1300} cy={520 + (1 - sun) * 120} r={200} fill="#FFD27A" opacity={0.15} />
    <path d="M0,500 Q300,440 600,480 T1200,470 T1920,460 L1920,560 L0,560Z" fill="#5A4A6A" opacity={0.8} />
    <rect y={540} width={1920} height={540} fill="#2E5A86" />
    <path d={`M1240,560 L1360,560 L1420,1080 L1180,1080Z`} fill="#FFD27A" opacity={0.25} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${(i * 97 + t * 14) % 1920},${580 + (i % 7) * 70} h${30 + (i % 4) * 20}`} stroke="#FFE4A8" strokeOpacity={0.45} strokeWidth={4} />)}
    {/* iskele */}
    <path d="M0,760 L820,760 L820,790 L0,790Z" fill="#8A5A32" stroke={INK} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20 + i * 96} y={790} width={20} height={200} fill="#5A3A22" />)}
    {/* tekne */}
    <g transform={`translate(1000,${720 + Math.sin(t * 1.6) * 6}) rotate(${Math.sin(t * 1.3) * 2})`}>
      <path d="M-160,0 L160,0 L120,60 L-130,60Z" fill="#F2EEE6" stroke={INK} strokeWidth={5} /><path d="M-160,0 L160,0 L156,14 L-156,14Z" fill="#1B4F9C" />
      <rect x={-20} y={-80} width={90} height={80} fill="#F2EEE6" stroke={INK} strokeWidth={5} /><rect x={0} y={-66} width={50} height={30} fill="#9FD0EC" />
      <text x={-80} y={46} fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#1B4F9C">ADA</text>
    </g>
    {/* ev */}
    <g transform="translate(260,560)">
      <rect x={-200} y={-200} width={360} height={200} fill="#E8D8B8" stroke={INK} strokeWidth={6} />
      <path d="M-230,-200 L-20,-330 L190,-200Z" fill="#B85A3A" stroke={INK} strokeWidth={6} />
      <rect x={-150} y={-150} width={90} height={80} fill="#FFD27A" stroke={INK} strokeWidth={5} /><rect x={40} y={-130} width={80} height={130} fill="#5A3A26" stroke={INK} strokeWidth={5} />
      <path d="M-20,-330 V-380" stroke="#6A4A30" strokeWidth={14} />{[0, 1].map((i) => <circle key={i} cx={-20 + Math.sin(t + i) * 10} cy={-400 - i * 40 - ((t * 20) % 40)} r={16 + i * 6} fill="#FFFFFF" opacity={0.25} />)}
    </g>
    {[0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 160 + Math.sin(t + i) * 20},${200 + i * 30} q16,-14 30,0 q14,-14 30,0`} stroke="#2A2030" strokeWidth={4} fill="none" />)}
  </g>
);
// Yılmaz'ın ofisi (gece): dosya dolapları, harita, masa lambası, Boğaz değil şehir
export const Ofis: React.FC<{ t: number; lamp?: number }> = ({ t, lamp = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A3038" />
    <rect x={120} y={140} width={560} height={380} fill="#0E1A2E" stroke="#141820" strokeWidth={14} />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={140 + (i % 10) * 54} y={300 + Math.floor(i / 10) * 60 + hs(i) * 30} width={10} height={10} fill="#FFD27A" opacity={0.7} />)}
    <rect x={820} y={160} width={520} height={340} fill="#C8B48A" stroke={INK} strokeWidth={6} />
    {[[900, 240], [1040, 320], [1200, 260], [980, 420], [1260, 420]].map(([a, b], i) => <g key={i}><rect x={a - 40} y={b - 50} width={80} height={100} fill="#F4F0E6" stroke={INK} strokeWidth={3} /><circle cx={a} cy={b - 15} r={18} fill="#9A8A70" /></g>)}
    <path d="M900,240 L1040,320 L1200,260 M1040,320 L980,420 M1200,260 L1260,420" stroke="#C0392B" strokeWidth={4} fill="none" />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1460 + i * 140},300)`}><rect x={-60} y={0} width={120} height={600} fill="#5A6470" stroke={INK} strokeWidth={5} />{[0, 1, 2, 3].map((k) => <rect key={k} x={-24} y={60 + k * 140} width={48} height={12} rx={4} fill="#8A949E" />)}</g>)}
    <rect x={300} y={720} width={1000} height={40} fill="#3E2C22" stroke={INK} strokeWidth={6} /><rect x={340} y={760} width={920} height={200} fill="#2E2019" />
    <g transform="translate(1120,720)"><path d="M0,0 V-120 L-80,-180" stroke="#222" strokeWidth={10} fill="none" /><path d="M-130,-170 L-30,-200 L-40,-160Z" fill="#2A5A3A" stroke={INK} strokeWidth={4} /><path d="M-80,-170 L-260,0 L80,0Z" fill="#FFE8B0" opacity={0.1 * lamp} /></g>
    <rect y={960} width={1920} height={120} fill="#1E2228" />
  </g>
);
export const _dz = { hs, dk };
