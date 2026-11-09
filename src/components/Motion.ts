// Hareket kiti (2026-11-08): tüm kanallar için gerçekçi yürüme, doğal göz kırpma, uzanıp alma/verme.
// Bakış ve renkler değişmez: sadece HAREKET. Her şey frame'e bağlı ve deterministik.
//
// Kurallar (ölçülmüş animasyon değerleri):
// - Yürüme fazı ZAMANA değil KATEDİLEN MESAFEYE bağlı → yerdeki ayak kaymaz (planted foot).
// - Gövde iki ayak açıkken en alçakta, ayaklar yan yana geçerken en yüksekte (bacak boyu sabit).
// - Kalkış/duruşta adım genişliği yarım adımda açılır/kapanır, figür bacakları açık donmaz.
// - Göz kırpma düzensiz: 0.4–5.6 sn arası, bazen çift kırpma, 4 kare (~0.13 sn).
// - Uzanma: önce hafif geri çekilme (hazırlık), sonra hafif aşıp yerine oturma, tutma, geri dönüş.

const fr = (x: number) => x - Math.floor(x);
export const hash = (n: number) => fr(Math.sin(n * 127.1 + 311.7) * 43758.5453);
const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sine = (k: number) => 0.5 - 0.5 * Math.cos(Math.PI * cl(k));

// üçgen dalga [-1,1], fazla doğrusal → destek ayağı sabit hızla geri gider (gövde hızıyla aynı)
export const tri = (ph: number) => (2 / Math.PI) * Math.asin(Math.sin(ph));

// ───────── göz kırpma ─────────
const SLOT = 3;
export const blinkAt = (t: number, seed = 0): boolean => {
  const i = Math.floor(t / SLOT);
  for (const j of [i, i - 1]) {
    const s0 = j * SLOT + hash(j * 7.3 + seed * 13.1) * (SLOT - 0.45);
    if (t >= s0 && t < s0 + 0.13) return true;
    if (hash(j * 3.1 + seed * 5.7) < 0.22 && t >= s0 + 0.24 && t < s0 + 0.35) return true; // çift kırpma
  }
  return false;
};

// ───────── yürüme ─────────
export type Walk = { ph: number; amp: number; dir: 1 | -1 };
export type GaitOut = { x: number; walk: Walk; moving: number };

// x0→x1 arası a→b saniyede yürü. stride = yarım döngüde (bir adım) katedilen piksel.
// Hız yumuşak başlar/biter; faz mesafeyi takip ettiği için ayak yerde kilitli kalır.
export const gait = (t: number, a: number, b: number, x0: number, x1: number, stride: number): GaitOut => {
  const D = Math.abs(x1 - x0);
  const dir: 1 | -1 = x1 >= x0 ? 1 : -1;
  const k = b > a ? cl((t - a) / (b - a)) : t >= b ? 1 : 0;
  // hızlanma/yavaşlama her uçta sürenin %18'i, ortası sabit hız
  const e = 0.18;
  const v = 1 / (1 - e); // ortadaki tepe hız (normalize)
  const pos = k < e ? (v * k * k) / (2 * e) : k > 1 - e ? 1 - (v * (1 - k) * (1 - k)) / (2 * e) : v * (k - e / 2);
  const d = D * cl(pos);
  const half = Math.max(1, stride * 0.5);
  const amp = D < 1 ? 0 : cl(Math.min(d, D - d) / half);
  return { x: x0 + dir * d, walk: { ph: (d / Math.max(1, stride)) * Math.PI, amp, dir }, moving: k > 0 && k < 1 ? 1 : 0 };
};

// yerinde yürüme (kamera takip ederken / arka plan kayarken): hız px/sn
export const treadmill = (t: number, a: number, speed: number, stride: number, dir: 1 | -1 = 1): Walk => {
  const d = Math.max(0, t - a) * speed;
  return { ph: (d / stride) * Math.PI, amp: cl(d / (stride * 0.5)), dir };
};

// bacak açıları (derece) + salınım bacağının kalkışı (0..1) + kalça düşüşü oranı
export const legs = (w: Walk, A: number) => {
  const tr = tri(w.ph);
  const c = Math.cos(w.ph);
  const aR = A * w.amp * tr;
  return {
    aR, aL: -aR,
    liftR: w.amp * Math.max(0, c), // sağ bacak öne savrulurken kalkar
    liftL: w.amp * Math.max(0, -c),
    tr,
    drop: 1 - Math.cos((A * w.amp * Math.abs(tr) * Math.PI) / 180), // × bacak boyu
  };
};

// ───────── uzanma / alma / verme ─────────
// at: harekete başlama, reach: uzanma süresi, hold: tutma, back: geri dönüş (Infinity = geri dönme)
// Değer: 0 → (hazırlık −0.08) → 1.06 aşma → 1 → 0
export const act = (t: number, at: number, hold = 1.2, reach = 0.45, back = 0.5): number => {
  const ant = 0.14;
  const u = t - at;
  if (u < 0) return 0;
  if (u < ant) return -0.08 * Math.sin((Math.PI * u) / ant);
  const r = u - ant;
  if (r < reach) {
    const k = r / reach;
    const c1 = 1.7, c3 = c1 + 1; // easeOutBack
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
  }
  const h = r - reach;
  if (h < hold) return 1;
  return 1 - sine((h - hold) / back);
};

// el değiştiren nesne: verenin elinden alanın eline geçiş anı
export const handoff = (t: number, at: number) => (t < at ? 0 : 1);
