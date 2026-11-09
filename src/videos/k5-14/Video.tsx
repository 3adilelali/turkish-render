import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-14-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Question, Re, Route, Scene, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-14 · "18 Saatlik Kayıt Yolu" · ölçek: YOL ↔ DİPLOMA
const MURAT = { ...LOOK.teen, body: "#9CC3E6", body2: "#7AA3C6" };
const BABA = { ...LOOK.man, body: "#7A5A3A", body2: "#5A4028" };

// otobüs koltukları: 21-22, horlama dalgası
const Snore: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.5, a + 4);
  const amp = 20 + 160 * k;
  return (
    <AbsoluteFill style={{ background: "#10161D", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <svg width={1700} height={500} viewBox="0 0 1700 500">
        <polyline fill="none" stroke="#5A6A7A" strokeWidth={6} points={Array.from({ length: 170 }, (_, i) => `${i * 10},${250 + Math.sin(i * 0.9 + t * 20) * 12}`).join(" ")} />
        <polyline fill="none" stroke={K.gold} strokeWidth={10} points={Array.from({ length: 170 }, (_, i) => `${i * 10},${250 + Math.sin(i * 0.25 + t * 6) * amp * Math.max(0, Math.sin(i * 0.05 + t * 1.5))}`).join(" ")} />
      </svg>
      <div style={{ position: "absolute", top: 90, display: "flex", gap: 120, fontSize: 44, fontWeight: 800 }}><span style={{ color: "#8A9AAA" }}>motor</span><span style={{ color: K.gold }}>baban</span></div>
      <div style={{ position: "absolute", bottom: 90, fontFamily: HAND, fontSize: 80, color: K.gold, opacity: ramp(t, a + 3, a + 3.5) }}>Zzzrrrr…</div>
    </AbsoluteFill>
  );
};

// bütün otobüsün kararı: çay, kahve, fındık, sohbet
const Plan: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const s = [["☕", "her yarım saatte çay"], ["☕", "sonra kahve"], ["🌰", "ön koltuktan fındık"], ["💬", "arka koltuktan sohbet"]];
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: K.brick, marginBottom: 40 }}>KARAR: BU ADAMI UYUTMAYACAĞIZ</div>
      {s.map(([e, x], i) => {
        const k = ramp(t, a + 0.6 + i * 1.1, a + 1.1 + i * 1.1);
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: HAND, fontSize: 70, color: K.ink, marginTop: 14, opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}><span style={{ width: 120, height: 90, borderRadius: 20, background: K.petrol, color: "#fff", fontFamily: FONT, fontSize: 30, fontWeight: 800, display: "flex", justifyContent: "center", alignItems: "center" }}>{["ÇAY", "KAHVE", "FINDIK", "SOHBET"][i]}</span>{x}</div>;
      })}
    </AbsoluteFill>
  );
};

// otobüste baba: herkesle konuşuyor
const BusTalk: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#1E2833" floor="#2E3A46" label="Bir otobüsün en sevilen yolcusu.">
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={180 + i * 320} y={520} width={220} height={300} rx={30} fill="#3C5A8A" opacity={0.7} />)}
    <Fig t={t} x={500} y={840} s={1.05} look={LOOK.nine} talk seed={1} />
    <Fig t={t} x={820} y={840} s={1.15} look={BABA} talk seed={2} wave />
    <Fig t={t} x={1140} y={840} s={1.05} look={LOOK.man} talk seed={3} />
    <Fig t={t} x={1460} y={840} s={1.0} look={MURAT} seed={4} dir={-1} />
    {[0, 1, 2].map((i) => <text key={i} x={560 + i * 320} y={360 - ((t * 40 + i * 50) % 120)} fontFamily={HAND} fontSize={60} fill={K.gold} opacity={0.7}>ha ha</text>)}
  </Scene>
);

// diplomanın kilometreleri
const Km: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const rows = [["köy → kasaba", "her gün 2 saat"], ["köy → İstanbul", "bir göç"], ["İstanbul → Erzurum", "18 saat"], ["Erzurum → İstanbul", "baba, tek başına, 18 saat"]];
  return (
    <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1300, background: K.paper, borderRadius: 18, padding: "40px 60px", boxShadow: shadow }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: K.brick, letterSpacing: 3 }}>BİR DİPLOMANIN YOLU</div>
        {rows.map(([l, r], i) => {
          const k = ramp(t, a + 0.5 + i * 1.3, a + 1 + i * 1.3);
          return <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #E4D8C0", padding: "20px 0", opacity: k }}><span style={{ fontSize: 46, fontWeight: 800, color: K.petrol }}>{l}</span><span style={{ fontFamily: HAND, fontSize: 56, color: K.ink }}>{r}</span></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// e-Devlet: 5 dakika
const Online: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.4, a + 2.2);
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1200, height: 700, background: "#2B2F36", borderRadius: 24, padding: 30, boxShadow: shadow }}>
        <div style={{ width: "100%", height: "100%", background: "#F4F6F8", borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#B5432F" }}>e-Devlet · Üniversite e-Kayıt</div>
          <div style={{ marginTop: 50, width: 700, height: 22, borderRadius: 11, background: "#DDE" }}><div style={{ width: `${k * 100}%`, height: "100%", borderRadius: 11, background: "#2E8B57" }} /></div>
          <div style={{ marginTop: 50, fontSize: 90, fontWeight: 800, color: "#2E8B57", opacity: ramp(t, a + 2.2, a + 2.6) }}>Kaydınız tamamlandı ✓</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, fontFamily: HAND, fontSize: 64, color: K.ink }}>birkaç tık · 5 dakika</div>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "3 Eylül", img: "01", yr: 2003, g: 0, ov: [{ t: "date", a: "3 Eylül 2003 · 18:15", b: "İstanbul · Esenler Otogarı" }] },
  { c: "Senin adın Murat", img: "02", ov: [{ t: "tag", a: "MURAT", b: "18 · sen" }] },
  { c: "Erzurum'da bir üniversiteyi", r: (t, a) => <Route t={t} a={a} icon="bus" title="İstanbul → Erzurum" stops={[["İstanbul", 300, 380], ["Bolu", 620, 420], ["Ankara", 860, 560], ["Sivas", 1260, 520], ["Erzurum", 1660, 440]]} /> },
  { c: "Yanında baban var", img: "01", ov: [{ t: "list", a: ["haşlanmış yumurta", "peynir · domates", "annenin sarması"] }] },
  { c: "Annen otogara", img: "03", ov: [{ t: "quote", a: "Su gibi git, su gibi gel.", d: 2.5 }] },
  { c: "Yolculuk on sekiz", r: (t, a) => <Counter t={t} a={a} to={18} suf=" saat" head="YOLCULUK" sub="40 yolcu · bir gece" /> },
  { c: "Bu videoda", img: "05" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir diploma kaç kilometre çeker?" img="21" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={93} text="Üniversite kaydına babamla gittim. Babam bütün gece horladı, bütün otobüs onu uyutmamak için seferber oldu!" /> },
  // ── 2 · Taşımalı ──
  { c: "Önce on yıl", img: "04", yr: 1993, g: 5 },
  { c: "Sekiz yaşındasın", img: "04" },
  { c: "Ve devlet yeni", r: (t, a) => <Doc t={t} a={a} head="TAŞIMALI EĞİTİM" lines={["Köydeki çocuk her sabah", "minibüsle kasabadaki okula."]} foot="Kaynak: MEB; 1989 pilot uygulama, 1997'de 8 yıllık zorunlu eğitimle yaygınlaştı" /> },
  { c: "Köylerdeki çocuklar", img: "05" },
  { c: "Türkiye'de bu sistem", r: (t, a) => <Years t={t} a={a} items={[{ y: "1989", s: "deneme" }, { y: "1997", s: "8 yıl zorunlu" }, { y: "yüz binlerce", s: "çocuk minibüste" }]} /> },
  { c: "Senin minibüsün", img: "05", ov: [{ t: "note", a: "06:30 · ilk durak: sen", p: "tr" }] },
  { c: "Gidiş", r: (t, a) => <Counter t={t} a={a} to={2} suf=" saat" head="HER GÜN" sub="gidiş 1 · dönüş 1" /> },
  { c: "Kışın yol kapanıyor", img: "06", sfx: "whoosh" },
  { c: "Öğle yemeğini", img: "07" },
  { c: "Bir izleyici yorumlarda tam", r: (t, a) => <Yorum t={t} a={a} likes={51} text="Köyün en uzak evinde otururduk. Okula gidip gelmek her gün iki saatimi alırdı. Liseye yaklaşınca ailem şehirde ev tuttu." /> },
  // ── 3 · İstanbul ──
  { c: "Senin ailen de aynı", img: "08", g: 15 },
  { c: "1998", img: "08", yr: 1998 },
  { c: "İstanbul'da okul", img: "09" },
  { c: "Sınıf arkadaşların", img: "10", g: 25 },
  { c: "Akşamları evde masa", img: "11" },
  { c: "O yıllarda bir test", r: (t, a) => <Split t={t} a={a} left={{ h: "1 TEST KİTABI", v: ["="] }} right={{ h: "BABANIN", v: ["yarım günlük yevmiyesi"] }} /> },
  { c: "Ama bir şeyi biliyorsun", img: "12", ov: [{ t: "quote", a: "Ben atölyede eğiliyorum ki sen eğilme.", d: 2.5 }] },
  // ── 4 · Sonuç ──
  { c: "2003 yazı", img: "13", yr: 2003, g: 40, sfx: "ding" },
  { c: "Eve koşuyorsun", img: "14" },
  { c: "O yıllarda üniversite kaydı", img: "21", ov: [{ t: "cap", a: "Kayıt: öğrenci bizzat, dosyasıyla." }] },
  // ── 5 · Otobüs ──
  { c: "Şimdi otobüse", img: "15" },
  { c: "Baban kolonyayı", img: "15", ov: [{ t: "quote", a: "Gördün mü, kendi araban gibi.", d: 1.8 }] },
  { c: "Saat on bir", img: "16", g: 45 },
  { c: "Ve baban horlamaya", r: (t, a) => <Snore t={t} a={a} /> },
  { c: "Arkadaki yolcular", img: "17" },
  { c: "Yorumu yazan izleyici bu", img: "16" },
  { c: "Muavin her yarım", r: (t, a) => <Plan t={t} a={a} /> },
  { c: "Ve baban, gece boyunca", r: (t, a) => <BusTalk t={t} a={a} />, g: 60 },
  { c: "Sen pencereye", img: "19" },
  { c: "Sabaha karşı", img: "20" },
  { c: "Beş yıl önce", img: "20", ov: [{ t: "quote", a: "Bir daha bu yoldan dönmem sanmıştım.", d: 4 }] },
  // ── 6 · Kayıt ──
  { c: "Ertesi gün öğlen", img: "21", g: 70 },
  { c: "Erzurum eylülde", img: "22" },
  { c: "Sıra sana geliyor", img: "23", sfx: "ding" },
  { c: "Arkanı dönüyorsun", img: "24", g: 85 },
  { c: "Baban o gece", img: "25" },
  // ── 7 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir diploma kaç kilometre çeker?" img="24" /> },
  { c: "Senin diploman", r: (t, a) => <Km t={t} a={a} /> },
  { c: "Bugün Türkiye'de", r: (t, a) => <Online t={t} a={a} />, g: 100 },
  { c: "7 Kasım", img: "26", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "İstanbul" }] },
  { c: "Sonra Murat telefonu", img: "27" },
  { c: "Telefonun öbür ucunda", r: (t, a, b) => <Re img="27" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 1.5} text="“İnternetten mi? Yazık. O yolun tadını bilmeyecek.”" size={56} y={430} /> },
  { c: "Senin üniversite", img: "20", ov: [{ t: "cap", a: "Üniversite kaydına seninle kim geldi?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video14, seconds: K5_14_SECONDS } = makeK5({ id: "k5-14", words, shots: SHOTS, year: 2003, gauge: ["YOL", "DİPLOMA"], title: "Bir diploma kaç kilometre çeker?" });
void Silence;
