import React from "react";
import words from "../../../public/data/s3-05-words.json";
import { ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { ForeColumns, GalleryWall, Motes, NightVeil, PCam, PFig, proWalk, Samdan, Sedir2, ValideOda } from "../../components/HaremPro";
import { AltinAnahtar, ArsivDefter, AvrupaKitap, FilmSerit, HaremKapi, IpekMendil, PadisahEli } from "../../components/HaremMendil";
import { makeShort, Stamp, Sub, VT, W } from "../s3-common/Vert";

// Kanal 1 · SHORT 05 · "Padişah Mendil Atınca Ne Olurdu?" — HaremPro görünümü.
// Mendil efsanesi: Osmanlı kaynaklarında yok, Avrupalı seyyah/yazar anlatılarından yayıldı (L. Peirce, The Imperial Harem).
// Gerçek: cariyeler yıllarca eğitilir; padişaha cariyeyi çoğu zaman Valide Sultan (veya kız kardeşleri) hediye ederdi.

type PO = Partial<React.ComponentProps<typeof PFig>>;
const Y = 1005;
const SEN = { robe: "#C8566A", robe2: "#F7E6C4", scarf: "#D6A640" };
const sen = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" {...SEN} t={t} seed={3} {...o} />;
const cariye = (t: number, x: number, i: number, o: PO = {}, s = 1.0, y = Y) => <PFig x={x} y={y} s={s} kind="girl" robe={["#A9C6DA", "#D98E8E", "#9FC3B0", "#E9B58F", "#B8A8D0"][i % 5]} robe2="#F5E8CC" t={t} seed={30 + i} {...o} />;
const padisah = (t: number, x: number, o: PO = {}, s = 1.18) => <PFig x={x} y={Y} s={s} kind="sultan" t={t} seed={11} {...o} />;
const valide = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="valide" t={t} seed={5} {...o} />;
const sehzade = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="prince" t={t} seed={8} {...o} />;
const kalfa = (t: number, x: number, o: PO = {}, s = 1.06) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#5E6E5A" t={t} seed={40} {...o} />;
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;

// büyük salon: galeri + iki sıra cariye (arka sıra küçük), ortada "sen". camX: kamera kaydırma
const HERO = 960;
const salon = (t: number, camX: number, o: { look?: (wx: number) => number; bow?: number; face?: (wx: number) => PO["face"]; hero?: PO; extra?: React.ReactNode; mendil?: boolean } = {}) => {
  const front = Array.from({ length: 11 }, (_, i) => HERO + (i - 5) * 250);
  const back = Array.from({ length: 12 }, (_, i) => HERO - 1500 + i * 270 + 135);
  return (
    <>
      <GalleryWall t={t} camX={camX} night={0.25} />
      {back.map((wx, i) => cariye(t, wx - camX, i + 2, { look: o.look?.(wx) ?? 0, bow: o.bow ?? 0.25, op: 0.92 }, 0.66, 905))}
      {front.map((wx, i) => wx === HERO ? null : cariye(t, wx - camX, i, { look: o.look?.(wx) ?? 0, bow: o.bow ?? 0.3, face: o.face?.(wx) ?? "normal" }, 0.95))}
      {sen(t, HERO - camX, { bow: o.bow ?? 0.3, ...(o.hero ?? {}) }, 0.98)}
      {o.mendil && <IpekMendil t={t} k={1} x1={HERO - camX + 30} y1={Y + 25} s={0.45} />}
      {o.extra}
      <Motes t={t} n={30} op={0.5} />
      <ForeColumns camX={camX} />
    </>
  );
};
const toHero = (wx: number) => (wx < HERO ? 0.7 : wx > HERO ? -0.7 : 0);

// gece koridoru: sen yürürsün (Altın Yol)
const koridor = (t: number, a: number, b: number) => {
  const g = proWalk(t, a + 0.1, b + 0.6, 300, 1500, 1.1);
  const camX = g.x - 960;
  const M = 560, n0 = Math.floor((camX - 200) / M) - 1;
  const lights = Array.from({ length: 6 }, (_, i) => n0 + i).flatMap((m) => { const lx = m * M + M / 2 - camX; return [{ x: lx, y: 380, r: 250 }, { x: lx, y: 980, r: 210, f: 0.75 }]; }).concat([{ x: 960, y: 640, r: 360, f: 0.9 }]);
  return (<><GalleryWall t={t} camX={camX} night={1} />{sen(t, g.x - camX, { walk: g.walk, look: g.look, face: "worried" }, 1.0)}<NightVeil id="nvKor5" k={0.7} lights={lights} t={t} /><Motes t={t} n={34} op={0.45} /><ForeColumns camX={camX} /></>);
};
const oda = (t: number, figs: React.ReactNode, win = 0.15) => (<><ValideOda t={t} win={win} /><Samdan x={1240} y={1010} t={t} s={0.9} />{figs}<Motes t={t} n={24} op={0.4} /></>);

const S = makeShort({
  words: words as W[], audio: "s3-05", label: "HAREMİN SIRLARI · #5", hook: "PADİŞAH SANA MENDİL ATARSA…", hookUntil: 2.8, pro: true, tail: 0.8,
  alt: { "Mendil hikayesi": ["Mendil hikâyesi"] },
  build: () => [
    // ── EFSANE ──
    { c: "Sarayın en büyük", tone: "gold", r: (t, a, b) => C(t, a, b, [1.0, 1.12], [960, 600], salon(t, lerp(-260, 60, ramp(t, a, b + 1)))) },
    { c: "Yüzlerce cariye", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.2], [960, 640], salon(t, lerp(-1100, -250, ramp(t, a, b))), [960, 660]),
      html: (t, a) => <VT t={t} at={a + 0.4} text="YÜZLERCE CARİYE" y={260} size={86} /> },
    { c: "nefesini tutmuş", tone: "gold", r: (t, a, b) => C(t, a, b, [2.3, 2.6], [960, 560], salon(t, 0, { hero: { face: "worried", bow: 0.15 } })) },
    { c: "Padişah aranızdan", tone: "gold", r: (t, a, b) => {
      const g = proWalk(t, a + 0.1, b + 1.2, -500, 900, 1.0);
      const camX = g.x - 960;
      return C(t, a, b, [1.15, 1.25], [960, 640], salon(t, camX, { bow: 0.6, extra: padisah(t, g.x - camX, { walk: g.walk, look: g.look }, 1.12) }));
    }, html: (t, a) => <VT t={t} at={a + 0.5} text="PADİŞAH GELİYOR" y={260} size={86} bg={H.crimson} c="#fff" /> },
    { c: "Ve birden", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.06], [960, 560], <>
      <rect width={1920} height={1080} fill="#3A2416" /><circle cx={960} cy={420} r={520} fill="#FFC870" opacity={0.16} />
      {[0, 1, 2].map((i) => cariye(t, 760 + i * 200, i, { bow: 0.3, blur: 8, op: 0.55 }, 0.95))}
      <PadisahEli t={t} open={ramp(t, a + 0.7, a + 1.1)} x={1020} y={300} s={0.95} />
      <IpekMendil t={t} k={ramp(t, a + 0.9, b + 0.15)} x0={1070} y0={350} x1={960} y1={960} s={0.75} />
    </>), html: (t, a) => <VT t={t} at={a + 1.0} text="İPEK MENDİL" y={260} size={88} /> },
    { c: "senin önüne", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 720], <><GalleryWall t={t} camX={0} night={0.25} />{sen(t, 960, { face: "shock", bow: 0.45 }, 1.05)}<IpekMendil t={t} k={1} x1={1010} y1={1035} s={0.5} /><Motes t={t} n={24} op={0.5} /></>, [960, 660]) },
    { c: "Herkes sana", sfx: "boing", tone: "gold", r: (t, a, b) => C(t, a, b, [1.25, 1.35], [960, 640], salon(t, 0, { look: (wx) => toHero(wx) * ramp(t, a, a + 0.5), bow: 0.1, face: (wx) => (Math.abs(wx - HERO) < 300 ? "shock" : "normal"), hero: { face: "shock", bow: 0.1 }, mendil: true })),
      html: (t, a) => <VT t={t} at={a + 0.3} text="👀 HERKES SANA BAKIYOR" y={260} size={74} /> },
    { c: "Bu gece", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], koridor(t, a, b)),
      html: (t, a) => <VT t={t} at={a + 0.6} text="🌙 BU GECE: PADİŞAHIN ODASI" y={260} size={68} bg="#1B1209" c="#FFE9A8" /> },
    // ── KIRILMA ──
    { c: "Filmlerde hep", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.06], [960, 560], <FilmSerit t={t}>{salon(t, 0, { look: toHero, bow: 0.1, hero: { face: "smile" }, mendil: true })}</FilmSerit>),
      html: (t, a) => <Stamp t={t} at={a + 0.3} text="🎬 FİLMLERDE" y={300} c={H.ln} size={96} rot={-4} /> },
    { c: "Ama bir sorun", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [960, 560], <><GalleryWall t={t} camX={0} night={0.8} />{sen(t, 960, { face: "worried", look: -0.4 }, 1.05)}<NightVeil id="nvAma" k={0.5} lights={[{ x: 960, y: 520, r: 380 }]} t={t} /></>),
      html: (t, a) => <Stamp t={t} at={a + 0.2} text="AMA…" y={300} c={H.red} size={140} /> },
    { c: "Bu sahne", tone: "cool", r: (t, a, b) => C(t, a, b, [1.0, 1.15], [960, 560], <><rect width={1920} height={1080} fill="#4A3020" /><rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.15} /><ArsivDefter t={t} scan={ramp(t, a, b)} s={0.55} /></>),
      html: (t, a, b) => <><VT t={t} at={a + 0.3} text="📜 OSMANLI ARŞİVİ" y={260} size={84} /><Stamp t={t} at={a + 2.3} text="BELGEDE YOK ✖" y={760} c={H.red} size={100} rot={-9} /></> },
    { c: "Mendil hikayesi", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.15], [960, 560], <><rect width={1920} height={1080} fill="#2A1A10" /><AvrupaKitap t={t} s={0.62} x={960} y={600} /></>),
      html: (t, a) => <VT t={t} at={a + 0.5} text="📖 AVRUPA'DAN GELDİ" y={260} size={80} /> },
    { c: "Avrupalı yazarların", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.4], [1110, 580], <><rect width={1920} height={1080} fill="#2A1A10" /><AvrupaKitap t={t} s={0.62} x={960} y={600} /></>),
      html: (t, a) => <Stamp t={t} at={a + 0.5} text="HAREMİ HİÇ GÖRMEDİLER" y={1000} c={H.cobalt} size={64} rot={-5} /> },
    // ── GERÇEK ──
    { c: "Peki gerçekte", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], oda(t, sen(t, 960, { face: "normal", look: Math.sin(t * 1.4) * 0.5 }, 1.05))),
      html: (t, a) => <VT t={t} at={a + 0.4} text="KİM SEÇERDİ? 🤔" y={260} size={92} /> },
    { c: "Padişah değil", sfx: "pop", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [960, 600], oda(t, padisah(t, 960, { face: "normal" }, 1.12))),
      html: (t, a) => <Stamp t={t} at={a + 0.25} text="PADİŞAH DEĞİL ✖" y={760} c={H.red} size={90} /> },
    { c: "haremi yöneten", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.35], [960, 640], oda(t, <><Sedir2 x={960} y={900} w={600} />{valide(t, 960, { sit: true, y: 905, face: "normal", look: 0.1 }, 1.08)}</>), [960, 560]) },
    { c: "Valide Sultan", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 1.95], [960, 650], oda(t, <><Sedir2 x={960} y={900} w={600} />{valide(t, 960, { sit: true, y: 905, face: "smile", look: 0.1 }, 1.08)}</>)),
      html: (t, a) => <VT t={t} at={a + 0.1} text="👑 VALİDE SULTAN" y={260} size={90} bg={H.cobalt} c="#FFE9A8" /> },
    { c: "Cariyeler yıllarca", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 660], oda(t, <>{kalfa(t, 1180, { talk: 1, look: -0.6 }, 1.0)}{[0, 1, 2].map((i) => cariye(t, 720 + i * 150, i, { sit: true, y: 960, look: 0.6, bow: 0.2 }, 0.8))}</>)),
      html: (t, a) => <>{["📖 OKUMA", "🎶 MÜZİK", "🫖 ADAP"].map((l, i) => <Stamp key={l} t={t} at={a + 0.4 + i * 0.75} text={l} y={330 + i * 150} rot={[-5, 4, -3][i]} c={[H.cobalt, H.red, H.green][i]} size={74} />)}</> },
    { c: "ve sonunda", tone: "gold", r: (t, a, b) => {
      const g = proWalk(t, a + 1.6, a + 3.4, 900, 1040, 1.0);
      return C(t, a, b, [1.05, 1.15], [960, 640], oda(t, <>{valide(t, 760, { reach: ramp(t, a + 1.0, a + 1.6) * (1 - ramp(t, a + 3.4, a + 3.9)), reachDir: 1, look: 0.5 }, 1.05)}{sen(t, g.x, { walk: g.walk, look: 0.4, face: "shy", bow: 0.3 }, 0.98)}{sehzade(t, 1200, { look: -0.5, face: "smile" }, 1.05)}</>));
    }, html: (t, a) => <VT t={t} at={a + 2.4} text="🎁 ANNESİNİN HEDİYESİ" y={260} size={76} /> },
    { c: "Yani haremin", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.35], [960, 560], <HaremKapi t={t} turn={ramp(t, a + 0.6, a + 1.4)} open={ramp(t, a + 1.8, a + 3.2)} />),
      html: (t, a) => <VT t={t} at={a + 0.4} text="🔑 HAREMİN ASIL KAPISI" y={260} size={76} /> },
    { c: "annesinin elindeydi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], oda(t, valide(t, 900, { face: "smile", reach: ramp(t, a, a + 0.3), reachDir: 1, item: <AltinAnahtar s={1.2} glow={1} t={t} /> }, 1.12))),
      html: (t, a) => <Stamp t={t} at={a + 0.2} text="ANNESİNİN ELİNDE" y={760} c={H.gold} size={80} /> },
    // ── KAPANIŞ ──
    { c: "Sen olsan", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.04], [960, 540], <>
      <rect width={1920} height={540} fill="#3A2416" /><IpekMendil t={t} k={1} x1={960} y1={300} s={0.95} />
      <rect y={540} width={1920} height={540} fill="#4A3020" /><g transform="translate(0,270)"><ArsivDefter t={t} scan={ramp(t, a, b) * 0.5} x={960} y={540} s={0.5} /></g>
      <rect y={532} width={1920} height={16} fill={H.gold} />
    </>), html: (t, a) => <><Stamp t={t} at={a + 1.3} text="MENDİL Mİ?" y={600} c={H.rose} size={88} rot={-4} /><Stamp t={t} at={a + 2.9} text="BELGE Mİ?" y={1500} c={H.cobalt} size={88} rot={4} /></> },
    { c: "Yorumlara yaz", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [960, 560], oda(t, sen(t, 960, { face: "smile", look: Math.sin(t * 2) * 0.4 }, 1.05))),
      html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={260} size={88} /> },
    { c: "Haremin gerçek", tone: "gold", r: (t, a, b) => C(t, a, b, [1.0, 1.1], [960, 600], salon(t, lerp(0, 160, ramp(t, a, b)), { hero: { face: "smile" }, mendil: true })),
      html: (t, a) => <><VT t={t} at={a + 0.1} text="HAREMİN SIRLARI" y={260} size={90} /><Sub t={t} at={a + 0.6} /></> },
  ],
});
export const S3_05_SECONDS = S.SECONDS;
export const S3Short05 = S.Comp;
