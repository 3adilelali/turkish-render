import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-10-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Question, Re, Scene, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-10 · "Annem Gece Yarısı Liseye Gidiyor" · ölçek: GİZLİ ↔ MEZUN
const ANNE = { ...LOOK.mother, body: "#7A4E8F", body2: "#5C3A6E", scarf: "#E9DCC2" };
const ELIF = { ...LOOK.teen, body: "#9AA0A6", body2: "#7A8086" };

// üç kuşak: nine · anne · Elif — her birinin okulu nerede bitti
const ThreeGen: React.FC<{ t: number; a: number; upto?: number }> = ({ t, a, upto = 3 }) => {
  const g = [["NİNE", "1950", "ilkokul", LOOK.nine], ["ANNE", "1975", "lise son sınıf", ANNE], ["ELİF", "1998", "?", ELIF]] as const;
  return (
    <AbsoluteFill style={{ background: K.cream, flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 120, paddingBottom: 140, fontFamily: FONT }}>
      {g.slice(0, upto).map(([n, y, s, l], i) => {
        const k = ramp(t, a + 0.3 + i * 0.9, a + 0.8 + i * 0.9);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: k, transform: `translateY(${(1 - k) * 50}px)` }}>
            <svg width={320} height={380} viewBox="370 500 320 380"><Fig t={t} x={530} y={860} s={1.25} look={l} seed={i + 2} /></svg>
            <div style={{ fontSize: 60, fontWeight: 800, color: K.petrol }}>{n}</div>
            <div style={{ fontSize: 36, color: "#665" }}>{y}</div>
            <div style={{ marginTop: 14, padding: "8px 26px", borderRadius: 30, background: i === 2 ? K.gold : K.brick, color: i === 2 ? K.ink : "#fff", fontSize: 38, fontWeight: 800 }}>{i < 2 ? "✂ " : ""}{s}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// açık öğretim: okul = mutfak masası
const AofCard: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const rows = [["Okul", "mutfak masası"], ["Ders saati", "01:00 – 03:00"], ["Öğretmen", "çözümlü sorular"], ["Sınav günü", "“Teyzeme gidiyorum.”"]];
  return (
    <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1200, background: K.paper, borderRadius: 18, padding: "50px 70px", boxShadow: shadow }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: K.brick, letterSpacing: 3 }}>ANNENİN DERS PROGRAMI</div>
        {rows.map(([l, r], i) => {
          const k = ramp(t, a + 0.5 + i * 1.1, a + 1 + i * 1.1);
          return <div key={i} style={{ display: "flex", borderBottom: "3px solid #E4D8C0", padding: "18px 0", opacity: k }}><span style={{ width: 340, fontSize: 42, fontWeight: 700, color: "#665" }}>{l}</span><span style={{ fontFamily: HAND, fontSize: 60, color: K.ink }}>{r}</span></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// masa ikiye bölünüyor: aynı lamba
const Table: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#1C2430" floor="#5A4632" label="Aynı lamba. Aynı saat.">
    <path d="M960,120 L960,260" stroke="#888" strokeWidth={4} /><path d="M880,300 L1040,300 L1000,260 L920,260 Z" fill="#C9A66B" />
    <path d="M960,300 L560,800 L1360,800 Z" fill="#FFE6A0" opacity={0.18 + 0.03 * Math.sin(t * 3)} />
    <rect x={460} y={700} width={1000} height={40} fill="#8A5A34" />
    <line x1={960} y1={640} x2={960} y2={700} stroke={K.brick} strokeWidth={6} strokeDasharray="10 8" />
    <text x={720} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.gold}>ÜNİVERSİTE SINAVI</text>
    <text x={1200} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={K.gold}>LİSE</text>
    <Fig t={t} x={600} y={840} s={1.1} look={ELIF} talk seed={1} />
    <Fig t={t} x={1320} y={840} s={1.1} look={ANNE} dir={-1} seed={2} />
  </Scene>
);

// sonuç ekranı: MEZUN
const Result: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 1.2, a + 1.6);
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1300, height: 760, background: "#2B2F36", borderRadius: 30, padding: 40, boxShadow: shadow }}>
        <div style={{ width: "100%", height: "100%", background: "#F4F6F8", borderRadius: 10, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: 34, color: "#778", fontWeight: 700 }}>Açık Öğretim Lisesi · Sınav Sonucu</div>
          <div style={{ marginTop: 40, width: 600, height: 18, borderRadius: 9, background: "#DDE", overflow: "hidden" }}><div style={{ width: `${ramp(t, a + 0.2, a + 1.2) * 100}%`, height: "100%", background: K.petrol }} /></div>
          <div style={{ marginTop: 50, fontSize: 170, fontWeight: 800, color: "#2E8B57", opacity: k, transform: `scale(${1.3 - 0.3 * k})` }}>MEZUN</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// çekmece: iki diploma
const Drawer: React.FC<{ t: number; a: number; n: number }> = ({ t, a, n }) => {
  const k = ramp(t, a + 0.3, a + 1.3);
  return (
    <AbsoluteFill style={{ background: "#3A2A1E", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1100, height: 520, background: "#8A5A34", border: "14px solid #5A3A1E", borderRadius: 12, position: "relative", transform: `translateY(${(1 - k) * -80}px)`, boxShadow: shadow, overflow: "hidden" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 40 + i * 20, top: 30 + i * 30, width: 980, height: 100, background: ["#EADFCB", "#D9C7A8", "#F1E6D2"][i], borderRadius: 8, border: "3px dashed #C8B48E" }} />)}
        {Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: 160 + i * 380, top: 230 + i * 20, width: 420, height: 260, background: "#C9A06B", border: "4px solid #8A6A3A", borderRadius: 6, transform: `rotate(${i ? 4 : -3}deg)`, opacity: ramp(t, a + 1 + i * 0.8, a + 1.5 + i * 0.8), display: "flex", justifyContent: "center", alignItems: "center", fontFamily: HAND, fontSize: 52, color: K.ink }}>{i ? "Elif · yüksek lisans" : "Anne · lise"}</div>)}
      </div>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "22 Ekim", img: "01", yr: 2015, g: 0, ov: [{ t: "date", a: "22 Ekim 2015 · 01:00", b: "Kayseri" }] },
  { c: "Senin adın Elif", img: "02", ov: [{ t: "tag", a: "ELİF", b: "17 · sen" }] },
  { c: "Kapıyı yavaşça", img: "02" },
  { c: "Seni görünce", img: "03", sfx: "whoosh" },
  { c: "Ne yapıyorsun anne", img: "03", ov: [{ t: "quote", a: "Ne yapıyorsun anne?", d: 0.2 }] },
  { c: "Annen bir an", img: "04", ov: [{ t: "stamp", a: "LİSE", d: 1.8 }] },
  { c: "Annen kırk yaşında", img: "04", ov: [{ t: "list", a: ["40 yaşında", "lise", "babandan gizli"] }] },
  { c: "Bu videoda", r: (t, a) => <ThreeGen t={t} a={a} /> },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir kadın okumak için neyi saklar?" img="14" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={64} text="Annem köyde büyüdüğü için liseye gidemedi. Yıllar sonra inat edip açık lisede okudu, sonra üniversite sınavına girdi." /> },
  // ── 2 · Nine ──
  { c: "Önce annenin annesini", r: (t, a) => <ThreeGen t={t} a={a} upto={1} />, yr: 1950 },
  { c: "1950'de bir Orta", img: "05", yr: 1958 },
  { c: "Bu kız hemşire", img: "05", ov: [{ t: "quote", a: "Bu kız hemşire olur.", d: 0.2 }] },
  { c: "Ama ninenin babası", img: "06", ov: [{ t: "quote", a: "Kız kısmı okuyup ne olacak?", d: 2.2 }] },
  { c: "yaşında evleniyor", r: (t, a) => <Silence t={t} a={a} text="Hemşire olmuyor." sub="16 yaşında evleniyor" /> },
  { c: "alışkanlığı kalıyor", img: "07", yr: 1985 },
  { c: "Ben okusaydım", img: "07", ov: [{ t: "cap", a: "“Ben okusaydım, şimdi beyaz önlükle hastanede olurdum.”" }] },
  { c: "O yıllarda bu bir istisna", r: (t, a) => <Doc t={t} a={a} head="1960'LAR · KIZLAR VE OKUL" lines={["Köyde kız çocuğunun okulu", "çoğu zaman ilkokulla bitiyor.", "Ortaokula giden kız: çok az."]} foot="Kaynak: TÜİK, Milli Eğitim İstatistikleri" /> },
  // ── 3 · Anne ──
  { c: "Şimdi annene gel", r: (t, a) => <ThreeGen t={t} a={a} upto={2} />, yr: 1975 },
  { c: "Ninen ona söz", img: "08", yr: 1990, ov: [{ t: "quote", a: "Sen okuyacaksın.", d: 0.6 }] },
  { c: "Ama on yedi", img: "09", yr: 1992 },
  { c: "O adam senin baban", img: "09", ov: [{ t: "note", a: "o adam: baban", p: "tr" }] },
  { c: "Evlilik oluyor", img: "10" },
  { c: "Yıllar geçiyor", img: "11", yr: 2005 },
  { c: "Ve her akşam", img: "12", g: 5 },
  { c: "Baban kötü bir adam", img: "13" },
  { c: "Bu yaştan sonra", img: "13", ov: [{ t: "quote", a: "Bu yaştan sonra okul mu olur? Herkes sana güler.", d: 0.3 }] },
  { c: "İşte bu cümle", img: "14", yr: 2015 },
  // ── 4 · Nasıl ──
  { c: "Peki nasıl", r: (t, a) => <Counter t={t} a={a} from={1980} to={1992} head="AÇIK ÖĞRETİM LİSESİ" sub="okula gitmeden lise" fmt={(n) => String(Math.round(n))} foot="Kaynak: MEB, Açık Öğretim Lisesi (1992)" /> },
  { c: "Okula gitmeden", img: "14" },
  { c: "Yani annenin okulu", r: (t, a) => <AofCard t={t} a={a} />, g: 15 },
  { c: "Ve sınav günleri", img: "15" },
  { c: "Sen bu sırrı", img: "16" },
  { c: "Bir keresinde", img: "18", sfx: "whoosh" },
  { c: "Bu saatte ne", img: "18", ov: [{ t: "quote", a: "Bu saatte ne yapıyorsunuz?", d: 0.2 }] },
  { c: "Sen hemen cevap", img: "18", ov: [{ t: "quote", a: "Annem bana test çözdürüyor.", d: 0.4 }] },
  { c: "O geceden sonra", r: (t, a) => <Table t={t} a={a} />, g: 30 },
  { c: "Bazen sen ona", img: "17" },
  // ── 5 · Yorumlar ──
  { c: "Yorumlarda bu hikâyenin", img: "19" },
  { c: "Ve bir gün, ilk kez", img: "19", ov: [{ t: "stamp", a: "LİSE MEZUNU", d: 1.5 }] },
  { c: "Bir başka izleyici", img: "20", ov: [{ t: "quote", a: "Sen erkeksin, hayvanlara bak.", d: 2 }] },
  { c: "Oğlu birinci sınıftayken", img: "20", ov: [{ t: "list", a: ["oğlu: 1. sınıf → baba: 1. sınıf", "oğlu: 2. sınıf → baba: 2. sınıf"] }] },
  { c: "Bir başkası ninesini", img: "21" },
  { c: "Ve bir torun", img: "22" },
  { c: "Sonra alzheimer", img: "22", ov: [{ t: "cap", a: "…ve hepsini unutmuş." }] },
  { c: "Bu hikâyelerin hepsi", r: (t, a) => <Silence t={t} a={a} text="Okuma hikâyesi, çoğu zaman bir kadının gece yarısı hikâyesi." /> },
  { c: "2008'de Milli", img: "23", yr: 2008, ov: [{ t: "stamp", a: "ANA KIZ OKULDAYIZ", d: 2.5 }] },
  { c: "Bir yorumda", img: "24" },
  // ── 6 · Mezun ──
  { c: "Şimdi tekrar mutfağa", img: "16", yr: 2016 },
  { c: "Ve bir gün internetten", r: (t, a) => <Result t={t} a={a} />, g: 70, sfx: "ding" },
  { c: "Annen hiçbir şey", img: "25" },
  { c: "Sonra kalkıp", img: "26" },
  { c: "Bardakları tokuşturuyorsunuz", img: "26", ov: [{ t: "cap", a: "O evde yapılan ilk ve tek mezuniyet töreni." }, { t: "cay", d: 0.5 }] },
  { c: "Diploma birkaç hafta", r: (t, a) => <Drawer t={t} a={a} n={1} /> },
  { c: "Aynı yıl üniversite", img: "15", g: 80 },
  { c: "Ve sonuç geliyor", img: "25", ov: [{ t: "stamp", a: "ÜNİVERSİTE", d: 0.6 }] },
  { c: "bugün hâlâ bilmiyor", r: (t, a) => <Split t={t} a={a} left={{ h: "BABAN BİLİYOR", v: ["—"] }} right={{ h: "BABAN BİLMİYOR", v: ["lise diploması", "üniversite sınavı", "açıköğretim"] }} /> },
  { c: "Peki sen ne", img: "28" },
  { c: "Benim yerime", img: "28", ov: [{ t: "quote", a: "Benim yerime de oku.", d: 0.2 }] },
  // ── 7 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir kadın okumak için neyi saklar?" img="27" /> },
  { c: "Ninen bir hayali", r: (t, a) => <ThreeGen t={t} a={a} /> },
  { c: "Ne kadar çok", r: (t, a) => <Silence t={t} a={a} text="Ne kadar çok istediklerini." /> },
  { c: "Bugün Türkiye'de", r: (t, a) => <Years t={t} a={a} items={[{ y: "1960'lar", s: "kızlar: ilkokul" }, { y: "1992", s: "açık lise" }, { y: "2008", s: "Ana Kız Okuldayız" }, { y: "2012", s: "lise zorunlu" }]} /> },
  { c: "7 Kasım", img: "29", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "bir üniversite" }] },
  { c: "Akşam annesini", img: "30" },
  { c: "Aferin kızım", img: "30", ov: [{ t: "quote", a: "Ben de bu dönem son sınavıma girdim.", d: 1 }], g: 100 },
  { c: "İkisi de gülüyor", r: (t, a) => <Drawer t={t} a={a} n={2} /> },
  { c: "Senin annen ya da", r: (t, a, b) => <Re img="26" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 0.4} text="Senin annen ya da ninen okumak için neleri göze aldı?" size={56} y={420} /> },
];

export const { Comp: K5Video10, seconds: K5_10_SECONDS } = makeK5({ id: "k5-10", words, shots: SHOTS, year: 2015, gauge: ["GİZLİ", "MEZUN"], title: "Bir kadın okumak için neyi saklar?" });
