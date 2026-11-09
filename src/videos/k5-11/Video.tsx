import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-11-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Question, Re, Route, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-11 · "1991: Bir Broşür ve Bir Kapı" · ölçek: SUSKUN ↔ ÖZGÜR
const DERYA = { ...LOOK.teen, body: "#6E9BC7", body2: "#507DA8" };

// broşür: çocuk eğitimcisi okulu — kenarları zamanla yumuşuyor
const Brosur: React.FC<{ t: number; a: number; old?: number; label?: string }> = ({ t, a, old = 0, label }) => {
  const k = ramp(t, a + 0.2, a + 0.9);
  return (
    <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 760, height: 980, transform: `rotate(${-4 + Math.sin((t - a) * 0.6) * 1.5}deg) scale(${0.62 + 0.04 * k})`, background: old ? "#E8DCC0" : "#FBF6EA", borderRadius: 8 + old * 30, padding: 60, boxShadow: shadow, filter: old ? `sepia(${0.4 * old})` : undefined, border: old ? "3px dashed #B8A88A" : "none" }}>
        <div style={{ height: 300, background: `linear-gradient(135deg, ${K.gold}, #F2A65A)`, borderRadius: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 90, height: 90, borderRadius: 45, background: ["#E85A7A", "#4FA3D1", "#6BBF59"][i] }} />)}
        </div>
        <div style={{ marginTop: 50, fontSize: 64, fontWeight: 800, color: K.petrol, lineHeight: 1.1 }}>Erzieherin</div>
        <div style={{ fontSize: 40, color: "#665", marginTop: 10 }}>Çocuk eğitimcisi okulu</div>
        <div style={{ fontFamily: HAND, fontSize: 52, color: K.brick, marginTop: 60 }}>Başvuru: Sonbahar 1991</div>
      </div>
      {label ? <div style={{ position: "absolute", bottom: 80, fontFamily: HAND, fontSize: 70, color: K.gold, opacity: ramp(t, a + 1, a + 1.6) }}>{label}</div> : null}
    </AbsoluteFill>
  );
};

// iki dünya: ev / sokak
const TwoWorlds: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ flexDirection: "row" }}>
    {[["EVDE", "Türkçe · bir kural", "#7A3E2E"], ["SOKAKTA", "Almanca · başka kural", "#2E4E6E"]].map(([h, s, c], i) => {
      const k = ramp(t, a + 0.3 + i * 0.8, a + 0.9 + i * 0.8);
      return (
        <div key={i} style={{ flex: 1, background: c, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, opacity: 0.3 + 0.7 * k }}>
          <div style={{ fontSize: 110, fontWeight: 800, color: K.cream }}>{h}</div>
          <div style={{ fontFamily: HAND, fontSize: 60, color: K.gold, marginTop: 20 }}>{s}</div>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center" }}>
      <svg width={300} height={340} viewBox="380 520 300 340"><Fig t={t} x={530} y={850} s={1.25} look={DERYA} seed={3} /></svg>
    </div>
    <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#fff" }}>İKİNCİ KUŞAK</div>
  </AbsoluteFill>
);

// gidemediği yerler
const NoList: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const rows = ["Sinema", "Sınıf gezisi", "Yüzme dersi"];
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      {rows.map((r, i) => {
        const k = ramp(t, a + 0.3 + i * 1, a + 0.7 + i * 1);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 90, fontWeight: 800, color: K.ink, marginTop: 20, opacity: k }}><span style={{ color: K.brick }}>✗</span><span style={{ textDecoration: "line-through", textDecorationColor: K.brick }}>{r}</span></div>;
      })}
      <div style={{ marginTop: 60, display: "flex", alignItems: "center", gap: 40, fontSize: 90, fontWeight: 800, color: "#2E8B57", opacity: ramp(t, a + 3.4, a + 3.9) }}>✓ Okul</div>
    </AbsoluteFill>
  );
};

// telefon kulübesi: numara çevriliyor
const Kulube: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const num = "0203 ··· ···";
  const n = Math.min(num.length, Math.floor(ramp(t, a + 0.4, a + 3) * num.length));
  return (
    <AbsoluteFill style={{ background: "#1C2228", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 620, height: 900, background: "#F2C230", borderRadius: 20, padding: 40, boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: K.ink, letterSpacing: 6 }}>TELEFON</div>
        <div style={{ marginTop: 40, width: 440, height: 560, background: "#3A3F44", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50 }}>
          <div style={{ width: 340, height: 90, background: "#9FD3B6", borderRadius: 8, fontFamily: "monospace", fontSize: 50, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", color: "#123" }}>{num.slice(0, n)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 90px)", gap: 18, marginTop: 40 }}>{"123456789*0#".split("").map((d, i) => <div key={i} style={{ height: 70, borderRadius: 10, background: (Math.floor((t - a) * 6) % 12) === i && n < num.length ? "#FFF" : "#C9D1D8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 34, fontWeight: 800 }}>{d}</div>)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, fontFamily: HAND, fontSize: 72, color: K.gold, opacity: ramp(t, a + 3, a + 3.6) }}>„Ich brauche Hilfe.“</div>
    </AbsoluteFill>
  );
};

// kurtulmanın adımları
const Steps: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const s = ["bir broşürü saklamak", "bir dili öğrenmek", "bir numarayı ezberlemek", "bir sabah eve dönmemek"];
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "flex-start", paddingLeft: 360, fontFamily: FONT }}>
      {s.map((x, i) => {
        const k = ramp(t, a + 0.4 + i * 1.3, a + 0.9 + i * 1.3);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 30, marginLeft: i * 90, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}><div style={{ width: 96, height: 96, borderRadius: 48, background: i === 3 ? K.brick : K.petrol, color: "#fff", fontSize: 50, fontWeight: 800, display: "flex", justifyContent: "center", alignItems: "center" }}>{i + 1}</div><div style={{ fontFamily: HAND, fontSize: 72, color: K.ink }}>{x}</div></div>;
      })}
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "28 Haziran", img: "01", yr: 1991, g: 30, ov: [{ t: "date", a: "28 Haziran 1991", b: "Duisburg · Batı Almanya" }] },
  { c: "Senin adın Derya", img: "02", ov: [{ t: "tag", a: "DERYA", b: "16 · Almanya doğumlu · sen" }] },
  { c: "Karnende iyi notlar", r: (t, a) => <Brosur t={t} a={a} label="„Sonbaharda başvur.“" />, sfx: "ding" },
  { c: "Broşürü çantana", img: "02" },
  { c: "Evin önünde", img: "03" },
  { c: "Baban sadece", img: "04", ov: [{ t: "quote", a: "Yarın sabah memlekete gidiyoruz. Bu yaz düğünün var.", d: 0.6 }], g: 10 },
  { c: "Bu videoda", img: "09" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir insan ailesinden nasıl kurtulur?" img="24" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={212} text="Reşit olunca kendimi zorla kurtardım. Bütün ailemi hayatımdan sildim." /> },
  // ── 2 · İkinci kuşak ──
  { c: "Önce yaşadığın", img: "01" },
  { c: "Duisburg'daki çelik", img: "05", yr: 1970 },
  { c: "bir Alman hastanesinde", img: "06", yr: 1975 },
  { c: "Almanya'da büyüyen", r: (t, a) => <TwoWorlds t={t} a={a} /> },
  { c: "Evde Türkçe", img: "07" },
  { c: "1983'te Alman", r: (t, a) => <Doc t={t} a={a} head="1983 · DÖNÜŞ YARDIMI YASASI" lines={["Kesin dönüş yapan yabancı işçiye", "dönüş primi ödenir."]} foot="Kaynak: Rückkehrhilfegesetz, 28 Kasım 1983" />, yr: 1983 },
  { c: "Binlerce Türk aile", img: "08" },
  { c: "Senin ailen kalıyor", img: "04", ov: [{ t: "quote", a: "Biz burada misafiriz. Kızlarımız buranın olmayacak.", d: 1.5 }], yr: 1990 },
  { c: "Ve bu cümle", r: (t, a) => <Silence t={t} a={a} text="Bu cümle, senin için bir plan demek." /> },
  { c: "Okulda Alman", r: (t, a) => <NoList t={t} a={a} /> },
  { c: "Ama sen her şeye", img: "09" },
  { c: "Bir de kütüphane", img: "10", g: 45 },
  { c: "Kütüphaneci yaşlı", img: "10", ov: [{ t: "quote", a: "Bunu seveceksin.", d: 1.5 }] },
  // ── 3 · Yol ──
  { c: "yoluna çık", r: (t, a) => <Route t={t} a={a} icon="bus" title="Temmuz 1991 · 3 gün" stops={[["Duisburg", 300, 230], ["Avusturya", 560, 380], ["Yugoslavya", 960, 540], ["Bulgaristan", 1320, 680], ["Köy", 1680, 830]]} />, yr: 1991, g: 30 },
  { c: "savaş başlıyor", img: "11" },
  { c: "Sen arka koltukta", img: "12" },
  { c: "Ve köye varıyorsunuz", img: "13" },
  // ── 4 · Düğün ──
  { c: "Damadı ilk kez", img: "14", g: 20 },
  { c: "Bu evlilik, onun için", r: (t, a) => <Silence t={t} a={a} text="Bu evlilik, onun için Almanya'ya giden kapı." /> },
  { c: "O yıllarda Almanya yeni", r: (t, a) => <Split t={t} a={a} left={{ h: "1973'TEN SONRA", v: ["yeni işçi alımı yok"] }} right={{ h: "TEK YOL", v: ["aile birleşimi", "Almanya'daki biriyle evlilik"] }} /> },
  { c: "Ve sen bunu bir akşam", img: "15" },
  { c: "Babana karşı", img: "16", ov: [{ t: "quote", a: "Ben evlenmek istemiyorum. Ben okula gideceğim.", d: 1.5 }], g: 40 },
  { c: "Bu hikâyeyi anlatan", r: (t, a) => <Yorum t={t} a={a} likes={212} text="“Gelinlikle çıkarsın bu evden. Kefenle dönersin.” Babam bunu söyledi." /> },
  { c: "Annene bakıyorsun", img: "17", g: 10 },
  { c: "O izleyici bu sessizliği", r: (t, a) => <Silence t={t} a={a} text="En ağır cümle, annenin söylemediği." /> },
  { c: "Bir şeyi bilmen", r: (t, a) => <Split t={t} a={a} left={{ h: "KANUNDA", v: ["Almanya: 18", "(izinle 16)", "Türkiye: yaş sınırı var"] }} right={{ h: "KÖYDE", v: ["dini nikâh", "kâğıt yok", "kimlik soran yok"] }} /> },
  { c: "Düğün oluyor", img: "19", sfx: "whoosh" },
  { c: "Kına gecesinde", img: "18" },
  { c: "O gece ağlamak", img: "18", ov: [{ t: "cap", a: "Ağlamanın kimsenin fark etmediği tek gece." }] },
  { c: "Düğün fotoğrafçısı", img: "20", ov: [{ t: "note", a: "gözler: kapıda", p: "tr" }] },
  // ── 5 · Dönüş ──
  { c: "Ve yaz bitiyor", img: "21" },
  { c: "Eylülde Duisburg'a", img: "21", g: 15 },
  { c: "Resmi nikâh, sen", img: "22", yr: 1993 },
  { c: "Ve sen? Çocuk", r: (t, a) => <Brosur t={t} a={a} old={1} label="Başvuru tarihi çoktan geçti." /> },
  { c: "Bir yıl. İki yıl", img: "23", g: 5 },
  { c: "Ama sen bir şeyi", img: "23" },
  { c: "1970'lerin sonundan", r: (t, a) => <Years t={t} a={a} items={[{ y: "1976", s: "ilk kadın sığınma evi" }, { y: "1986", s: "göçmen kızlara kriz evi" }, { y: "2011", s: "zorla evlendirme = suç" }]} upto={2} foot="Kaynak: Frauenhaus Berlin (1976); Papatya, Berlin (1986); StGB §237 (2011)" /> },
  { c: "Bir sabah vardiyadan", img: "24", g: 50 },
  { c: "brauche", r: (t, a) => <Kulube t={t} a={a} /> },
  { c: "Ve o gün bir otobüse", img: "25" },
  { c: "Kulübenin camından", img: "24" },
  { c: "O izleyici şöyle", r: (t, a) => <Yorum t={t} a={a} likes={212} text="Reşit olunca kendimi zorla kurtardım. Bütün ailemi hayatımdan sildim." /> },
  { c: "Sığınma evinde", img: "26", yr: 1994 },
  { c: "Kalemi tutuyorsun", r: (t, a) => <Brosur t={t} a={a} old={1} label="Meslek: Erzieherin" />, g: 75 },
  { c: "Boşanma iki yıl", img: "27" },
  { c: "Frau Derya", img: "28", g: 90, ov: [{ t: "quote", a: "Frau Derya!", d: 0.2 }] },
  { c: "Almanya, zorla evlendirmeyi", r: (t, a) => <Counter t={t} a={a} from={1991} to={2011} head="ZORLA EVLENDİRME = AYRI SUÇ" sub="Almanya ceza kanunu" foot="Kaynak: StGB §237 (2011)" fmt={(n) => String(Math.round(n))} /> },
  { c: "Seni kurtaran kanun", r: (t, a) => <Silence t={t} a={a} text="Seni kurtaran kanun değil, bir telefon numarasıydı." /> },
  // ── 6 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir insan ailesinden nasıl kurtulur?" img="25" /> },
  { c: "Bir gecede değil", r: (t, a) => <Steps t={t} a={a} /> },
  { c: "Ama bunun bir bedeli", r: (t, a) => <Split t={t} a={a} left={{ h: "KAZANDIĞI", v: ["bir meslek", "bir isim", "kendi hayatı"] }} right={{ h: "KAYBETTİĞİ", v: ["bir annenin sesi", "kardeş düğünleri", "bayram sabahları"] }} /> },
  { c: "7 Kasım", img: "29", yr: 2026, g: 100, ov: [{ t: "date", a: "7 Kasım 2026", b: "Almanya" }] },
  { c: "Bir akşam kızı", img: "29", ov: [{ t: "quote", a: "Hiç fotoğraf görmedim.", d: 2 }] },
  { c: "Derya bir süre", r: (t, a) => <Brosur t={t} a={a} old={1} /> },
  { c: "Benim düğünüm yoktu", r: (t, a, b) => <Re img="29" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 1.5} text="“Benim bir kapım vardı. Ve ben o kapıdan çıktım.”" size={58} y={430} /> },
  { c: "Kızı broşürü", img: "30" },
  { c: "Bu hikâyeyi anlattığı", img: "30", ov: [{ t: "cap", a: "Senin çevrende kendi hayatını seçen bir kadın var mı?", d: 2.5 }] },
];

export const { Comp: K5Video11, seconds: K5_11_SECONDS } = makeK5({ id: "k5-11", words, shots: SHOTS, year: 1991, gauge: ["SUSKUN", "ÖZGÜR"], title: "Bir insan ailesinden nasıl kurtulur?" });
