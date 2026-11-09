import React from "react";
import words from "../../../public/data/s3-06-words.json";
import { ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { Motes, PCam, PFig, proWalk } from "../../components/HaremPro";
import { ArsivDefter } from "../../components/HaremMendil";
import { BursaSokak, FakirEv, KadiMahkeme, Kese, NikahSenet, SicilArsiv, SicilKalem, Terazi } from "../../components/HaremMahkeme";
import { makeShort, Stamp, Sub, VT, W } from "../s3-common/Vert";

// Kanal 1 · SHORT 06 · "Osmanlı Kadını Boşanamaz mıydı?" — kışkırtıcı açılış (yaygın inanç gerçek gibi), kırılma ortada.
// Kaynak: kadı sicillerinde hul' (muhâlaa) kayıtları — R. Jennings (Kayseri sicilleri, 17. yy), H. Gerber (Bursa sicilleri, 17. yy).
// Evlilikte şart (ikinci eş alırsa boşanmış sayılma): Osmanlı nikâh pratiği; 1917 Hukuk-ı Aile Kararnamesi bunu yazılı hale getirdi.

type PO = Partial<React.ComponentProps<typeof PFig>>;
const Y = 1005;
const FAT = { robe: "#2F6B6B", robe2: "#F2E6C4", scarf: "#E8D8B0" };
const FERACE = { robe: "#4A3A5A", robe2: "#E9DCC2", scarf: "#F2EDE4" };
const fatma = (t: number, x: number, o: PO = {}, s = 1.05) => <PFig x={x} y={Y} s={s} kind="girl" {...FAT} t={t} seed={3} {...o} />;
const feraceli = (t: number, x: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" {...FERACE} t={t} seed={3} {...o} />;
const gelin = (t: number, x: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe="#C8243A" robe2="#F7E6C4" scarf="#D8404A" t={t} seed={3} {...o} />;
const koca = (t: number, x: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#6A4A2E" robe2="#D9C9A8" t={t} seed={8} {...o} />;
const kadi = (t: number, o: PO = {}, s = 0.86) => <PFig x={960} y={758} s={s} kind="sultan" plain sit robe="#2F4A3A" robe2="#E9DCC2" t={t} seed={11} {...o} />;
const komsu = (t: number, x: number, i: number, o: PO = {}, s = 0.95) => <PFig x={x} y={Y} s={s} kind="girl" robe={["#8A5A3A", "#5A6A8A", "#7A3A4A"][i % 3]} robe2="#F2E6C4" scarf={["#F2EDE4", "#E8D8B0", "#D9C8A8"][i % 3]} t={t} seed={60 + i} {...o} />;
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
const ev = (t: number, kids: React.ReactNode, night = 0) => <><FakirEv t={t} night={night} />{kids}{night > 0 && <rect width={1920} height={1080} fill="#1C2440" opacity={0.28} />}</>;
const mahkeme = (t: number, kids: React.ReactNode) => <><KadiMahkeme t={t} />{kids}<Motes t={t} n={26} op={0.45} /></>;
const sokak = (t: number, pan: number, kids: React.ReactNode, dusk = 0) => <><BursaSokak t={t} pan={pan} dusk={dusk} />{kids}</>;

const S = makeShort({
  words: words as W[], audio: "s3-06", label: "OSMANLI KADINLARI · #6", hook: "OSMANLI KADINI BOŞANAMAZDI!", hookUntil: 3.0, pro: true, tail: 0.8,
  alt: { "Katip sicil": ["Kâtip sicil", "Katip, sicil"], "Kadı efendinin": ["kadı efendinin"] },
  build: () => [
    // ── KIŞKIRTMA ──
    { c: "Osmanlı'da bir kadın", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 700], ev(t, fatma(t, 960, { sit: true, face: "sad", bow: 0.4 }, 1.0), 1)) },
    { c: "Ne olursa olsun", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [960, 700], ev(t, fatma(t, 960, { sit: true, face: "sad", bow: 0.2, look: -0.3 }, 1.0), 1)),
      html: (t, a) => <Stamp t={t} at={a + 1.6} text="🤐 SUSMAK ZORUNDA" y={760} c={H.red} size={84} /> },
    { c: "Herkes böyle bilir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], sokak(t, 200, <>{komsu(t, 760, 0, { talk: 1, look: 0.5 })}{komsu(t, 960, 1, { look: -0.4, face: "worried" })}{komsu(t, 1160, 2, { talk: 1, look: -0.5 })}</>)),
      html: (t, a) => <VT t={t} at={a + 0.2} text="HERKES BÖYLE BİLİR…" y={260} size={82} /> },
    { c: "Ama şimdi bir belgeye", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.0, 1.15], [960, 560], <><rect width={1920} height={1080} fill="#4A3020" /><ArsivDefter t={t} scan={ramp(t, a, b)} s={0.55} /></>),
      html: (t, a) => <VT t={t} at={a + 0.3} text="📜 AMA BELGE NE DİYOR?" y={260} size={78} bg={H.crimson} c="#fff" /> },
    // ── HİKÂYE ──
    { c: "Bursa, on yedinci", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.12], [960, 520], sokak(t, lerp(0, 300, ramp(t, a, b + 1)), null), [960, 600]),
      html: (t, a) => <VT t={t} at={a + 0.3} text="BURSA · 1600'LER" y={260} size={90} /> },
    { c: "Sen Fatma'sın", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], ev(t, fatma(t, 960, { face: "normal", look: 0.2 }))),
      html: (t, a) => <VT t={t} at={a + 0.4} text="FATMA" y={260} size={110} bg={FAT.robe} c="#FFE9A8" /> },
    { c: "Kocan aylardır", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], ev(t, <>{koca(t, 1120, { sit: true, face: "closed", bow: 0.3 })}{fatma(t, 800, { face: "worried", look: 0.6 }, 1.0)}</>)),
      html: (t, a) => <VT t={t} at={a + 0.5} text="AYLARDIR… 😶" y={260} size={86} /> },
    { c: "ne ekmek getiriyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.08], [960, 800], ev(t, null)),
      html: (t, a) => <><Stamp t={t} at={a + 0.4} text="🍞 EKMEK YOK" y={420} c={H.red} size={86} rot={-6} /><Stamp t={t} at={a + 1.5} text="🪙 PARA YOK" y={600} c={H.red} size={86} rot={5} /></> },
    { c: "Bir sabah feraceni", tone: "warm", r: (t, a, b) => {
      const g = proWalk(t, a + 0.1, b + 0.8, 0, 1300, 1.0);
      return C(t, a, b, [1.25, 1.3], [960, 640], sokak(t, g.x, feraceli(t, 960, { walk: g.walk, look: g.look })));
    }, html: (t, a) => <VT t={t} at={a + 0.6} text="FERACEYİ GİY. YOLA ÇIK." y={260} size={74} /> },
    { c: "kadı mahkemesine", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.0, 1.1], [960, 560], mahkeme(t, kadi(t, { look: 0 }))),
      html: (t, a) => <VT t={t} at={a + 0.2} text="⚖️ KADI MAHKEMESİ" y={260} size={86} bg="#1F3A2E" c="#FFE9A8" /> },
    { c: "Kadı efendinin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 720], mahkeme(t, <>{kadi(t, { look: -0.2 })}{feraceli(t, 790, { look: 0.6, face: "worried" }, 0.95)}{koca(t, 1130, { look: -0.6, face: "shock" }, 0.95)}</>)) },
    { c: "Ve diyorsun ki", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [790, 560], mahkeme(t, <>{kadi(t, { look: -0.4 })}{feraceli(t, 790, { look: 0.5, face: t > a + 1.4 ? "normal" : "worried", talk: t > a + 1.4 ? 1 : 0 }, 0.95)}{koca(t, 1130, { look: -0.6, face: "shock" }, 0.95)}</>)),
      html: (t, a) => <VT t={t} at={a + 1.3} text="“BU EVLİLİĞİ İSTEMİYORUM!”" y={260} size={64} bg={H.crimson} c="#fff" /> },
    { c: "Katip sicil", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.12], [960, 560], <g><rect width={1920} height={1080} fill="#3A2A1C" /><g transform="translate(960,560) scale(0.62) translate(-960,-560)"><SicilKalem t={t} k={ramp(t, a + 0.2, b + 2.6)} /></g></g>),
      html: (t, a) => <VT t={t} at={a + 0.4} text="✍️ SİCİLE YAZILDI" y={260} size={84} /> },
    { c: "Fatma, mehrinden", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 760], mahkeme(t, <>{kadi(t, { look: -0.2, talk: 1 })}{feraceli(t, 790, { look: 0.5, face: t > a + 2.4 ? "smile" : "normal" }, 0.95)}<Kese x={lerp(830, 960, ramp(t, a + 0.3, a + 1.2))} y={940} s={0.62} t={t} />{koca(t, 1130, { look: -0.6, face: "sad" }, 0.95)}</>)),
      html: (t, a) => <><VT t={t} at={a + 0.6} text="MEHİR → GERİ" y={260} size={86} /><Stamp t={t} at={a + 2.4} text="SERBEST ✔" y={760} c={H.green} size={120} /></> },
    { c: "Buna hul", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <g><rect width={1920} height={1080} fill="#3A2A1C" /><g transform="translate(960,560) scale(0.62) translate(-960,-560)"><SicilKalem t={t} k={1} seal={ramp(t, a, a + 0.5)} hi={ramp(t, a + 0.3, a + 0.8)} /></g></g>),
      html: (t, a) => <Stamp t={t} at={a + 0.5} text="HUL" y={700} c={H.cobalt} size={190} rot={-5} /> },
    { c: "Kadın mehrini", tone: "warm", r: (t, a, b) => C(t, a, b, [1.0, 1.1], [960, 560], <g><rect width={1920} height={1080} fill="#2A1E16" /><g transform="translate(960,600) scale(0.6) translate(-960,-600)"><Terazi t={t} tilt={lerp(-1, 1, ramp(t, a + 0.4, a + 1.6))} bird={ramp(t, a + 1.4, b)} /></g></g>),
      html: (t, a) => <><VT t={t} at={a + 0.2} text="MEHİR" y={300} size={70} bg="#8E2F2A" c="#fff" /><VT t={t} at={a + 1.4} text="ÖZGÜRLÜK 🕊️" y={1500} size={80} bg="#F4F6F8" /></> },
    { c: "Osmanlı mahkeme defterlerinde", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <SicilArsiv t={t} pan={lerp(0, 900, ramp(t, a, b))} />),
      html: (t, a) => <><VT t={t} at={a + 0.3} text="KADI SİCİLLERİ 📚" y={260} size={84} /><Stamp t={t} at={a + 2.3} text="YÜZLERCE KAYIT" y={760} c={H.gold} size={96} /></> },
    { c: "Hatta bazı kadınlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 700], mahkeme(t, <>{kadi(t, { look: -0.3 })}{gelin(t, 800, { talk: 1, look: 0.5, face: "smile" }, 0.95)}{koca(t, 1120, { look: -0.6, face: "worried" }, 0.95)}</>)),
      html: (t, a) => <VT t={t} at={a + 0.4} text="📜 EVLENİRKEN ŞART!" y={260} size={86} /> },
    { c: "Kocam ikinci", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1.0, 1.3], [960, 540], <><rect width={1920} height={1080} fill="#3A2A1C" /><NikahSenet t={t} k={ramp(t, a - 0.2, a + 0.6)} hi={ramp(t, a + 1.0, a + 1.6)} s={0.8} /></>, [960, 690]),
      html: (t, a) => <Stamp t={t} at={a + 1.8} text="2. EŞ = BOŞANMA" y={1500} c={H.red} size={66} rot={-4} /> },
    // ── KAPANIŞ ──
    { c: "Şimdi söyle", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], sokak(t, 600, fatma(t, 960, { face: "smile", look: Math.sin(t * 1.3) * 0.4 }))),
      html: (t, a) => <VT t={t} at={a + 1.2} text="ÇARESİZ MİYDİ? 🤔" y={260} size={90} /> },
    { c: "Yorumlara yaz", sfx: "pop", tone: "warm", r: (t, a, b) => C(t, a, b, [2.3, 2.4], [960, 560], sokak(t, 600, fatma(t, 960, { face: "smile", look: 0.2 }))),
      html: (t, a) => <VT t={t} at={a + 0.1} text="💬 YORUMLARA YAZ" y={260} size={88} /> },
    { c: "Osmanlı kadınlarının bilinmeyen", tone: "gold", r: (t, a, b) => {
      const g = proWalk(t, a, b + 2, 0, 1400, 1.0);
      return C(t, a, b, [1.15, 1.05], [960, 640], sokak(t, 800 + g.x, fatma(t, 960, { walk: g.walk, look: g.look, face: "smile" }), 0.6));
    }, html: (t, a) => <><VT t={t} at={a + 0.1} text="OSMANLI KADINLARI" y={260} size={86} /><Sub t={t} at={a + 0.6} /></> },
  ],
});
export const S3_06_SECONDS = S.SECONDS;
export const S3Short06 = S.Comp;
