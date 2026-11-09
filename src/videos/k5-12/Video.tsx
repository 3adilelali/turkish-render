import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-12-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Letter, Question, Re, Route, Scene, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-12 · "Almanya'da İlk Gün: Karnaval" · ölçek: GURBET ↔ YUVA
const MUSTAFA = { ...LOOK.man, body: "#6A6A6A", body2: "#4E4E4E" };

// konfeti yağmuru + kırmızı burun
const Konfeti: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: "#2B3A4A", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
    {Array.from({ length: 140 }, (_, i) => { const y = ((t - a) * (120 + (i % 7) * 30) + i * 53) % 1200 - 60; return <div key={i} style={{ position: "absolute", left: (i * 137) % 1920, top: y, width: 18, height: 10, background: ["#E30A17", "#FFD27A", "#4FA3D1", "#6BBF59", "#E85A7A"][i % 5], transform: `rotate(${(t * 200 + i * 40) % 360}deg)` }} />; })}
    <div style={{ width: 260, height: 260, borderRadius: 130, background: "radial-gradient(circle at 35% 35%, #FF6B6B, #C0121E)", boxShadow: shadow, transform: `scale(${1 + 0.05 * Math.sin(t * 6)})` }} />
    <div style={{ position: "absolute", bottom: 90, fontFamily: HAND, fontSize: 80, color: K.gold, opacity: ramp(t, a + 0.8, a + 1.4) }}>Gül Pazartesisi · Rosenmontag</div>
  </AbsoluteFill>
);

// Almanca sözlük: 2 kelime
const Dict: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ fontSize: 44, fontWeight: 800, color: K.brick, letterSpacing: 4, marginBottom: 40 }}>İLK HAFTANIN BÜTÜN ALMANCASI</div>
    {[["Schnell", "çabuk"], ["Pause", "mola"]].map(([d, tr], i) => {
      const k = ramp(t, a + 0.5 + i * 1.2, a + 1 + i * 1.2);
      return <div key={i} style={{ display: "flex", gap: 50, alignItems: "baseline", opacity: k, transform: `scale(${0.8 + 0.2 * k})`, marginTop: 20 }}><span style={{ fontSize: 150, fontWeight: 800, color: K.petrol }}>{d}</span><span style={{ fontFamily: HAND, fontSize: 80, color: K.ink }}>= {tr}</span></div>;
    })}
  </AbsoluteFill>
);

// ortak mutfak rafı: dört bölme, aynı üç şey
const Raf: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: "#3A2E24", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {["Trabzon", "Konya", "Sivas", "Sen"].map((n, i) => {
        const k = ramp(t, a + 0.3 + i * 0.6, a + 0.7 + i * 0.6);
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 40, borderBottom: "14px solid #9A9A9A", padding: "0 40px", width: 1100, opacity: k }}>
            <div style={{ width: 200, fontFamily: HAND, fontSize: 50, color: i === 3 ? K.gold : K.cream }}>{n}</div>
            <div style={{ width: 110, height: 140, background: "#1F1F1F", borderRadius: 6, color: "#D9B44A", fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>ÇAY</div>
            <div style={{ width: 110, height: 120, background: "#B8231B", borderRadius: "10px 10px 20px 20px", border: "6px solid #DDD" }} />
            <div style={{ width: 150, height: 130, background: "#D8C29A", borderRadius: "40px 40px 10px 10px", color: "#6A5A3A", fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>BULGUR</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

// on dört gece
const Nights: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.min(14, Math.floor(ramp(t, a + 0.3, a + 4) * 14.99));
  return (
    <AbsoluteFill style={{ background: "#14202A", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 150px)", gap: 20 }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ height: 150, borderRadius: 14, background: i < n ? "#2C3E50" : "#1E2A36", border: "3px solid #3E556B", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 70, color: K.gold }}>{i < n ? "☾" : ""}</div>)}
      </div>
      <div style={{ marginTop: 60, fontFamily: HAND, fontSize: 76, color: K.cream }}>mektup → cevap: {n} gece</div>
    </AbsoluteFill>
  );
};

// gurbetin üç gidişi
const Trips: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const g = [["1.", "trenle", "bir bavulla"], ["2.", "askerlikten sonra", "ailesiyle"], ["3.", "emeklilikte", "çocuklarının peşinden"]];
  return (
    <AbsoluteFill style={{ background: K.cream, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 70, fontFamily: FONT }}>
      {g.map(([n, h, s], i) => {
        const k = ramp(t, a + 0.4 + i * 1.4, a + 0.9 + i * 1.4);
        return <div key={i} style={{ width: 460, padding: "50px 30px", background: K.paper, borderRadius: 20, boxShadow: shadow, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 60}px)` }}><div style={{ fontSize: 120, fontWeight: 800, color: i === 2 ? K.brick : K.petrol }}>{n}</div><div style={{ fontSize: 50, fontWeight: 800, color: K.ink }}>{h}</div><div style={{ fontFamily: HAND, fontSize: 52, color: "#665", marginTop: 10 }}>{s}</div></div>;
      })}
    </AbsoluteFill>
  );
};

// on beş aile: soy ağacı büyüyor
const Tree: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.min(15, Math.floor(ramp(t, a + 0.6, a + 4) * 15.99));
  return (
    <Scene t={t} a={a} bg="#F3E6CF" floor="#E2CFAE" label={`Bugün: ${n} aile`}>
      <circle cx={960} cy={240} r={70} fill={K.brick} /><text x={960} y={252} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#fff">1963</text>
      {Array.from({ length: 15 }, (_, i) => { const x = 160 + i * 114; const on = i < n; return <g key={i} opacity={on ? 1 : 0.1}><path d={`M960,310 C960,420 ${x},420 ${x},540`} stroke="#8A6A4A" strokeWidth={5} fill="none" /><circle cx={x} cy={580} r={40} fill={K.petrol} /><path d={`M${x - 18},584 L${x},566 L${x + 18},584 L${x + 18},604 L${x - 18},604 Z`} fill={K.cream} /></g>; })}
    </Scene>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "25 Şubat", img: "01", yr: 1963, g: 5, ov: [{ t: "date", a: "25 Şubat 1963 · Pazartesi", b: "Köln Garı · Batı Almanya" }] },
  { c: "Senin adın Mustafa", img: "01", ov: [{ t: "tag", a: "MUSTAFA", b: "20 · 3 gündür trende · sen" }] },
  { c: "Tren duruyor", img: "02", sfx: "whoosh" },
  { c: "Peronda bir adam", r: (t, a) => <Konfeti t={t} a={a} /> },
  { c: "Biri sana doğru", img: "02" },
  { c: "Ve sen yanındaki", img: "03", ov: [{ t: "quote", a: "Burada tımarhane mi boşaldı?", d: 1.6 }] },
  { c: "Bu videoda", img: "04" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir insan gurbete kaç kez gider?" img="01" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={58} text="Dayım Almanya'ya karnaval sabahı inmiş. Peronda kostümlü insanları görünce geri dönüp trene binmek istemiş: “Bunlar deli!”" /> },
  // ── 2 · Karnaval ──
  { c: "Önce o sabahı", img: "04" },
  { c: "O gün Köln'de", r: (t, a) => <Konfeti t={t} a={a} /> },
  { c: "Ama sen bunu", img: "05" },
  { c: "Ve ilk gördüğün", img: "02", g: 0 },
  { c: "Yorumu yazan izleyici", img: "03", ov: [{ t: "quote", a: "Bunlar deli. Ben burada çalışamam.", d: 1.5 }] },
  { c: "Ve o an yanındaki", img: "03", ov: [{ t: "quote", a: "Korkma kardeşim. Bu bir bayram.", d: 2 }] },
  { c: "Sen trene geri", img: "06", g: 20 },
  // ── 3 · Fabrika ──
  { c: "Fabrika bir otomobil", img: "07" },
  { c: "Her kırk saniyede", r: (t, a) => <Counter t={t} a={a} to={40} suf=" sn" head="BİR ARABA GÖVDESİ" sub="her 40 saniyede bir · aynı vida" /> },
  { c: "Bir Alman usta", r: (t, a) => <Dict t={t} a={a} /> },
  { c: "İlk maaş gününde", img: "08", g: 40, sfx: "ding" },
  { c: "Sonra yarısını", img: "09" },
  { c: "Kalan yarısıyla", img: "10" },
  { c: "Akşamları bir işçi", img: "11" },
  { c: "Yurdun kuralları", img: "11", ov: [{ t: "list", a: ["22:00 ışıklar söner", "misafir yok", "herkesin bir rafı var"] }] },
  { c: "Mutfakta herkesin", r: (t, a) => <Raf t={t} a={a} /> },
  { c: "Akşamları biri saz", img: "11", ov: [{ t: "cay", d: 0.8 }] },
  { c: "İlk aylar bir şaşkınlık", img: "13", ov: [{ t: "list", a: ["her şey paketli", "ekmek siyah ve ekşi", "pazar: her yer kapalı", "otobüsü bir kadın kullanıyor"] }] },
  { c: "İlk bayram geliyor", img: "07", ov: [{ t: "note", a: "bayram sabahı: fabrika düdüğü", p: "tr" }] },
  { c: "Öğle molasında dört", img: "11", ov: [{ t: "cay", d: 0.5 }] },
  { c: "Ertesi gün postaneden", r: (t, a) => <Letter t={t} a={a} head="TELGRAF" lines={["BAYRAMINIZ MÜBAREK OLSUN.", "BEN İYİYİM."]} stamp="PTT" speed={0.07} />, sfx: "ding" },
  { c: "Ama en zoru", r: (t, a) => <Silence t={t} a={a} text="Akşamlar." />, g: 15 },
  { c: "Fabrika bitiyor", img: "14" },
  { c: "Cevap iki hafta", r: (t, a) => <Nights t={t} a={a} /> },
  // ── 4 · Günlük ──
  { c: "Bir izleyici yorumlarda, dedesinin", img: "15" },
  { c: "Günlüğün ilk sayfasında", r: (t, a) => <Letter t={t} a={a} head="11 Temmuz 1961" lines={["SIKILDIM."]} stamp="GÜNLÜK" speed={0.12} /> },
  { c: "Günlük sonra yavaş", img: "15" },
  { c: "Ve sen de bir defter", img: "14", ov: [{ t: "note", a: "ilk sayfa: aynı kelime", p: "tr" }] },
  // ── 5 · Askerlik ──
  { c: "1965 baharı", img: "16", yr: 1965 },
  { c: "Askerlik çağrısı", r: (t, a) => <Doc t={t} a={a} head="ASKERLİK ÇAĞRISI" lines={["Yurt dışındaki Türk gençleri de", "askerlik yapmak zorundadır.", "Süre: yaklaşık 2 yıl."]} stamp="T.C." /> },
  { c: "O yıllarda yurt dışındaki", r: (t, a) => <Split t={t} a={a} left={{ h: "2 YIL BOYUNCA", v: ["maaş yok", "fabrika yok", "Almanya yok"] }} right={{ h: "KÖYDE", v: ["bir eş", "bekliyor"] }} />, g: 10 },
  { c: "Ama bir sorun daha", img: "17" },
  { c: "Ve şimdi karın", img: "19" },
  { c: "Bir izleyici bu bekleyişi", img: "19", ov: [{ t: "list", a: ["mektup", "fotoğraf", "sayılan günler"] }] },
  { c: "Kışlada Almancı", img: "18", ov: [{ t: "quote", a: "Orada kaç para alıyordun?", d: 3.5 }] },
  { c: "Askerlik bitiyor", img: "18", g: 30, ov: [{ t: "cap", a: "Bu kez Almanya'ya yalnız gitmeyeceksin." }] },
  // ── 6 · Aile ──
  { c: "Almanya o yıllarda", r: (t, a) => <Route t={t} a={a} title="Aile birleşimi" stops={[["Köy", 1680, 830], ["İstanbul", 1450, 760], ["Belgrad", 1080, 560], ["Münih", 520, 330], ["Köln", 300, 220]]} />, yr: 1967 },
  { c: "Bu kez şubat değil", img: "20", ov: [{ t: "quote", a: "Burada insanlar neden hiç gülmüyor?", d: 2.5 }] },
  { c: "Sen gülüyorsun", img: "20", ov: [{ t: "quote", a: "Gülüyorlar. Ama yılda bir gün. Hepsini birden.", d: 0.5 }], g: 60 },
  { c: "Karın ilk haftalarda", img: "21" },
  { c: "İçine bir tepsi baklava", img: "21", ov: [{ t: "cap", a: "Birbirinin dilini bilmeden, yıllarca komşuluk." }] },
  { c: "Yıllar geçiyor", img: "22", yr: 1975, g: 75 },
  { c: "1980'lerden itibaren", r: (t, a) => <Split t={t} a={a} left={{ h: "MUSTAFA · 1965", v: ["yaklaşık 2 yıl"] }} right={{ h: "OĞLU · DÖVİZLE", v: ["birkaç hafta"] }} />, yr: 1985 },
  { c: "Senin oğlun", img: "23" },
  { c: "Ve sen bir kez daha", img: "24", yr: 1998, ov: [{ t: "cap", a: "Gurbetten gurbete." }] },
  // ── 7 · Son ──
  { c: "2020 baharı", img: "25", yr: 2020, g: 50 },
  { c: "Cenaze, salgın", r: (t, a) => <Silence t={t} a={a} text="Çok az kişi katılabildi." /> },
  { c: "Ama bir şey var", r: (t, a) => <Tree t={t} a={a} />, g: 100 },
  { c: "Bugün onun torunları", r: (t, a) => <Yorum t={t} a={a} likes={58} text="Bugün onun torunları on beş aile." /> },
  // ── 8 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir insan gurbete kaç kez gider?" img="20" /> },
  { c: "İlk kez trenle", r: (t, a) => <Trips t={t} a={a} /> },
  { c: "Ama aslında gurbet", r: (t, a, b) => <Re img="01" t={t} a={a} b={b} d={0.35} />, html: (t, a) => <Txt t={t} at={a + 1.2} text="Gurbet, trene geri dönmemeye karar verdiğin andır." size={58} y={430} /> },
  { c: "7 Kasım", img: "26", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "Köln" }] },
  { c: "Gara geldiğinde", img: "26", ov: [{ t: "quote", a: "Korkmayın amca. Bu bir bayram.", d: 2.5 }] },
  { c: "Senin ailende", img: "22", ov: [{ t: "cap", a: "Senin ailende Almanya'ya ilk adımı kim attı?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video12, seconds: K5_12_SECONDS } = makeK5({ id: "k5-12", words, shots: SHOTS, year: 1963, gauge: ["GURBET", "YUVA"], title: "Bir insan gurbete kaç kez gider?" });
void Fig; void MUSTAFA; void Years;
