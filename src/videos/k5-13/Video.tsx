import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-13-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, K, Question, Re, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-13 · "Tokayla Alınan Ev" · ölçek: ÖDÜNÇ ↔ SENİN

// şeker çuvalından yastık: çuval + yamalar
const Yastik: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.4, a + 4);
  const patches = Array.from({ length: 18 }, (_, i) => ({ x: (i % 6) * 120, y: Math.floor(i / 6) * 110, c: ["#E85A7A", "#4FA3D1", "#F2C14E", "#6BBF59", "#B07AD1", "#F28C5A"][i % 6] }));
  return (
    <AbsoluteFill style={{ background: "#3A2A1E", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "relative", width: 760, height: 360, background: "#F3EDE0", borderRadius: 60, boxShadow: shadow, overflow: "hidden", transform: `scale(${1 + 0.02 * Math.sin(t * 2)})` }}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 800, color: "#9AA", letterSpacing: 10, opacity: 1 - k }}>ŞEKER · 50 KG</div>
        {patches.map((p, i) => <div key={i} style={{ position: "absolute", left: 20 + p.x, top: 20 + p.y, width: 110, height: 100, background: p.c, borderRadius: 10, border: "3px dashed #fff", opacity: k * 18 > i ? 0.9 : 0 }} />)}
      </div>
      <div style={{ position: "absolute", bottom: 100, fontFamily: HAND, fontSize: 76, color: K.gold, opacity: ramp(t, a + 3, a + 3.6) }}>Biraz sert. Biraz hışırdıyor. Ama senin.</div>
    </AbsoluteFill>
  );
};

// toka: parça başı ücret
const Toka: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.floor(ramp(t, a + 0.3, a + 4.5) * 100);
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 54px)", gap: 10 }}>
        {Array.from({ length: 100 }, (_, i) => <svg key={i} width={54} height={30} viewBox="0 0 54 30" opacity={i < n ? 1 : 0.12}><path d="M4,15 Q14,2 27,15 Q40,28 50,15" stroke={["#E85A7A", "#4FA3D1", "#F2C14E", "#6BBF59", "#B07AD1"][i % 5]} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>)}
      </div>
      <div style={{ marginTop: 50, display: "flex", gap: 50, alignItems: "baseline" }}>
        <span style={{ fontSize: 110, fontWeight: 800, color: K.petrol }}>{n}</span><span style={{ fontSize: 46, fontWeight: 700, color: K.ink }}>toka</span>
        <span style={{ fontFamily: HAND, fontSize: 70, color: K.brick, opacity: n >= 99 ? 1 : 0 }}>= birkaç kuruş</span>
      </div>
    </AbsoluteFill>
  );
};

// görünmeyen işçiler
const Invisible: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: "#14202A", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 70px)", gap: 18 }}>
      {Array.from({ length: 96 }, (_, i) => { const on = ramp(t, a + 0.2 + (i % 16) * 0.08 + Math.floor(i / 16) * 0.12, a + 0.6 + (i % 16) * 0.08 + Math.floor(i / 16) * 0.12); return <div key={i} style={{ width: 70, height: 70, borderRadius: 35, background: "#F7D98A", opacity: on * (0.35 + 0.25 * Math.sin(t * 2 + i)) , boxShadow: "0 0 20px #F7D98A" }} />; })}
    </div>
    <div style={{ position: "absolute", top: 70, fontSize: 52, fontWeight: 800, color: K.cream }}>BİNLERCE PENCERE · BİNLERCE KADIN</div>
    <div style={{ position: "absolute", bottom: 80, fontFamily: HAND, fontSize: 64, color: K.gold, opacity: ramp(t, a + 2.5, a + 3) }}>Hiçbir istatistikte görünmüyorlar.</div>
  </AbsoluteFill>
);

// uyku: 2 saat
const Sleep: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.4, a + 2);
  return (
    <AbsoluteFill style={{ background: "#0F161D", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <svg width={560} height={560} viewBox="-140 -140 280 280">
        <circle r={120} fill="#1E2A36" stroke="#3E556B" strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-108} x2={0} y2={-96} stroke="#8AA" strokeWidth={4} transform={`rotate(${i * 30})`} />)}
        <path d={`M0,0 L0,-100 A100,100 0 0 1 ${100 * Math.sin((60 * k * Math.PI) / 180)},${-100 * Math.cos((60 * k * Math.PI) / 180)} Z`} fill={K.gold} opacity={0.8} />
      </svg>
      <div style={{ position: "absolute", bottom: 110, fontSize: 90, fontWeight: 800, color: K.gold, opacity: ramp(t, a + 1.8, a + 2.3) }}>gecede 2 saat uyku</div>
    </AbsoluteFill>
  );
};

// çorap: kalınlaşıyor
const Corap: React.FC<{ t: number; a: number; fat?: number }> = ({ t, a, fat = 0.3 }) => {
  const k = ramp(t, a + 0.3, a + 3);
  const w = 1 + fat * k;
  return (
    <AbsoluteFill style={{ background: "#3A2A1E", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <svg width={600} height={700} viewBox="0 0 300 350" style={{ transform: `scaleX(${w})` }}>
        <path d="M100,20 L190,20 L190,220 Q190,300 110,310 L50,310 Q20,310 20,280 Q20,250 60,240 L100,230 Z" fill="#8A6E5A" stroke="#5A4434" strokeWidth={6} />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={100} y1={40 + i * 12} x2={190} y2={40 + i * 12} stroke="#6E5646" strokeWidth={4} />)}
        {Array.from({ length: Math.floor(k * 8) }, (_, i) => <rect key={i} x={110 + (i % 3) * 22} y={130 + Math.floor(i / 3) * 30} width={40} height={24} fill="#E8D9A8" stroke="#A89060" strokeWidth={2} transform={`rotate(${(i % 3) * 7 - 7},130,150)`} />)}
      </svg>
      <div style={{ position: "absolute", bottom: 90, fontFamily: HAND, fontSize: 70, color: K.gold }}>Ali'nin bilmediği bir çorap.</div>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "9 Eylül", img: "01", yr: 1975, g: 0, ov: [{ t: "date", a: "9 Eylül 1975", b: "İstanbul'un kenarı · yeni bir mahalle" }] },
  { c: "Senin adın Fadime", img: "01", ov: [{ t: "tag", a: "FADİME", b: "13 yaşında · sen" }] },
  { c: "Yatağı seriyorsun", img: "01", ov: [{ t: "note", a: "evde yastık yok", p: "tr" }] },
  { c: "Kapıyı çalıyorsun", img: "02", ov: [{ t: "quote", a: "Yenge, bu gecelik bir yastık verir misin?", d: 2.5 }] },
  { c: "Yengen bir yastık", img: "03" },
  { c: "Bu videoda", img: "02" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir ev neyle alınır?" img="23" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={147} text="Annem 13 yaşında evlendi. İlk gece yastıkları bile yoktu, karşı komşudan ödünç aldı. Yıllar sonra tokacılık yapıp iki ev aldı." /> },
  // ── 2 · Ali ──
  { c: "Önce kocanı", img: "04", yr: 1970 },
  { c: "İlk geceler bekâr", img: "05" },
  { c: "Bazı geceler yer", img: "06" },
  { c: "Gündüz bir inşaatta", img: "07", ov: [{ t: "list", a: ["inşaat", "atölye", "başka atölye"] }] },
  { c: "O yıllarda İstanbul'a", r: (t, a) => <Counter t={t} a={a} to={3} pre="≈ " suf=" milyon" head="İSTANBUL İLİ NÜFUSU · 1970" sub="her yıl yüz binlerce yeni göçmen" foot="Kaynak: TÜİK, 1970 Genel Nüfus Sayımı" /> },
  { c: "bir gecede yeni", img: "07" },
  // ── 3 · Fadime ──
  { c: "Ve şimdi kendine", img: "08", yr: 1975 },
  { c: "On üç yaşındasın. Resmi", r: (t, a) => <Split t={t} a={a} left={{ h: "KANUN", v: ["13 yaş: evlilik yok"] }} right={{ h: "MAHALLE", v: ["önce imam nikâhı", "resmi nikâh: yıllar sonra"] }} />, g: 5 },
  { c: "Bir çocuk gibi", img: "08" },
  { c: "On dört yaşında", img: "09", yr: 1976 },
  { c: "Komşu kadınlar sana", img: "09", ov: [{ t: "cap", a: "Mahalle, senin annen oluyor." }] },
  // ── 4 · Yastık ──
  { c: "Ve bir gün, yastık", img: "10" },
  { c: "Çuvalı yıkıyorsun", img: "11" },
  { c: "Çuvalı dikip", r: (t, a) => <Yastik t={t} a={a} />, g: 20 },
  { c: "O gece, ödünç", img: "12" },
  { c: "Yıllar sonra kızın", r: (t, a) => <Yorum t={t} a={a} likes={147} text="Annem şeker çuvalından, terziden topladığı kumaş artıklarıyla yastık dikmişti. O yastık hâlâ dolabın üstünde." /> },
  // ── 5 · Vitrin ──
  { c: "Bir yıl sonra", img: "13", yr: 1977, g: 30 },
  { c: "İçine dizecek", img: "13", ov: [{ t: "list", a: ["2 kristal bardak", "1 çay takımı", "1 porselen biblo"] }] },
  { c: "Ve bir gün, vitrin", img: "14", sfx: "whoosh", g: 15 },
  { c: "Sen akşama kadar", img: "14" },
  { c: "Ve şunu söylüyor", img: "14", ov: [{ t: "quote", a: "Ağlama. Önemli olan sana bir şey olmaması.", d: 0.3 }] },
  { c: "Kızın bu cümleyi", r: (t, a) => <Silence t={t} a={a} text="“Önemli olan sana bir şey olmaması.”" sub="babasından hatırladığı en güzel cümle" /> },
  // ── 6 · Kumar ──
  { c: "Çünkü bu hikâyenin", img: "15" },
  { c: "Hafta sonları", img: "15", g: 5 },
  { c: "Ama bir şeye", r: (t, a) => <Silence t={t} a={a} text="Bu evin parasını sen kazanacaksın." /> },
  // ── 7 · Toka ──
  { c: "Mahallenin kadınları", img: "16" },
  { c: "Toka yapıyorlar", img: "17" },
  { c: "Bir atölye hammaddeyi", r: (t, a) => <Toka t={t} a={a} /> },
  { c: "O yıllarda İstanbul'un", r: (t, a) => <Invisible t={t} a={a} /> },
  { c: "Sen de oturuyorsun", img: "18", g: 25 },
  { c: "Kızın yorumunda", r: (t, a) => <Sleep t={t} a={a} /> },
  { c: "İki saat", img: "18" },
  { c: "Parmakların", img: "19", sfx: "ding" },
  { c: "Bir çorabın içine", r: (t, a) => <Corap t={t} a={a} />, g: 40 },
  { c: "Bazen Ali kumarda", img: "21", ov: [{ t: "quote", a: "Biraz ver, yarın geri koyarım.", d: 1.5 }] },
  { c: "Sen başını sallıyorsun", img: "21", ov: [{ t: "quote", a: "Yok. Atölye bu hafta ödemedi.", d: 0.5 }] },
  { c: "Yalan söylediğin", img: "20", ov: [{ t: "cap", a: "Çoraptaki para: çocuklarının başının üstündeki çatı." }] },
  { c: "Yıllar geçiyor. Çorap", r: (t, a) => <Corap t={t} a={a} fat={0.7} />, g: 55 },
  // ── 8 · İmza ve tapu ──
  { c: "On sekiz yaşına", img: "22", yr: 1980 },
  { c: "Memur kâğıdı", img: "22", ov: [{ t: "note", a: "ilk imza", p: "tr" }] },
  { c: "1980'lerin başı", img: "23", yr: 1983 },
  { c: "Ve bir sabah, tapu", r: (t, a) => <Doc t={t} a={a} head="TAPU" lines={["Malik: Fadime", "İki odalı ev"]} stamp="TAPU" bg="#2A1E14" />, g: 75, sfx: "ding" },
  { c: "On üç yaşında ödünç", r: (t, a) => <Split t={t} a={a} left={{ h: "13 YAŞINDA", v: ["ödünç bir yastık"] }} right={{ h: "21 YAŞINDA", v: ["bir ev sahibi"] }} /> },
  { c: "Ali bunu öğrendiğinde", img: "24" },
  // ── 9 · Merter ──
  { c: "Ama sen durmuyorsun", img: "25" },
  { c: "1980'lerde İstanbul'da", img: "25", yr: 1986 },
  { c: "Sen bir komşunla", img: "26" },
  { c: "Pazarcı kadın", img: "26", ov: [{ t: "quote", a: "Abla, kazaklar burada, üç tanesi bir fiyat!", d: 2.5 }] },
  { c: "Ve birkaç yıl sonra", r: (t, a) => <Years t={t} a={a} items={[{ y: "1975", s: "ödünç yastık" }, { y: "1983", s: "1. ev · toka" }, { y: "1990'lar", s: "2. ev · pazar" }]} />, g: 100 },
  // ── 10 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir ev neyle alınır?" img="23" /> },
  { c: "değil sadece", r: (t, a) => <Yastik t={t} a={a} /> },
  { c: "Ve bu hikâyede", r: (t, a) => <Silence t={t} a={a} text="O evleri, kanunun evlenmesine bile izin vermediği yaşta gelin gelen bir kız aldı." /> },
  { c: "7 Kasım", img: "27", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "İstanbul" }] },
  { c: "Torunu tokaya", img: "27", ov: [{ t: "quote", a: "Nine, bu toka çok güzel. Nereden aldın?", d: 0.4 }] },
  { c: "Fadime gülüyor", r: (t, a, b) => <Re img="27" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 1.5} text="“Bu evin her tuğlası, bir toka.”" size={70} y={430} /> },
  { c: "Sonra yatağa", img: "12" },
  { c: "Senin annenin", img: "13", ov: [{ t: "cap", a: "Annenin evinde hikâyesi olan bir eşya var mı?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video13, seconds: K5_13_SECONDS } = makeK5({ id: "k5-13", words, shots: SHOTS, year: 1975, gauge: ["ÖDÜNÇ", "SENİN"], title: "Bir ev neyle alınır?" });
