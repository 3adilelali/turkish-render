import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-06-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, Flag, K, LOOK, Question, Re, Route, Scene, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-06 · "Babanın Almanya Mirası" · ölçek: KANUN ↔ GELENEK
const HASAN = { ...LOOK.worker, body: "#5B4636", body2: "#46362A" };
const UNCLE = { ...LOOK.man, body: "#6E5A3A", body2: "#56462C", cap: "#3A3A3A" };

// para akışı: Almanya'daki baba → köydeki amcalar (anne gri kalıyor)
const MoneyFlow: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} label="Para kime gidiyor?">
    <rect x={60} y={160} width={560} height={660} rx={30} fill="#D9E3E6" />
    <text x={340} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.petrol}>ALMANYA</text>
    <rect x={1300} y={160} width={560} height={660} rx={30} fill="#EAD9B8" />
    <text x={1580} y={230} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={K.brick}>KÖY</text>
    <Fig t={t} x={340} y={800} s={1.25} look={HASAN} />
    <Fig t={t} x={1450} y={800} s={1.2} look={UNCLE} seed={2} talk={t > a + 2} />
    <Fig t={t} x={1700} y={800} s={1.2} look={UNCLE} seed={5} dir={-1} />
    <g opacity={0.35 + 0.65 * (1 - ramp(t, a + 1.5, a + 2.5))}><Fig t={t} x={1000} y={800} s={1.1} look={LOOK.mother} sad={t > a + 2} seed={3} /></g>
    {[0, 1, 2, 3].map((i) => {
      const p = ((t - a - 0.6 - i * 0.9) % 3.6) / 3.6;
      if (t - a - 0.6 - i * 0.9 < 0) return null;
      const x = 420 + p * 1140, y = 420 - Math.sin(p * Math.PI) * 300;
      return <g key={i} transform={`translate(${x},${y}) rotate(${p * 40 - 20})`}><rect x={-60} y={-38} width={120} height={76} rx={6} fill="#FBF6EA" stroke={K.ink} strokeWidth={4} /><path d="M-60,-38 L0,8 L60,-38" stroke={K.ink} strokeWidth={4} fill="none" /><text y={28} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={K.brick}>DM</text></g>;
    })}
  </Scene>
);

// tarlalar birer birer alınıyor
const Fields: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#CFE0E8" floor="#C9B27A" zoom={[1.02, 1.1]}>
    {Array.from({ length: 12 }, (_, i) => {
      const k = ramp(t, a + 0.3 + i * 0.35, a + 0.6 + i * 0.35);
      const c = i % 4, r = Math.floor(i / 4);
      return (
        <g key={i} opacity={k} transform={`translate(${260 + c * 360 + r * 60},${420 + r * 150}) scale(${0.7 + 0.3 * k})`}>
          <path d="M0,0 L320,0 L300,130 L-20,130 Z" fill={["#E4C76B", "#9FBF6A", "#D9B45A", "#B7CC7A"][i % 4]} stroke="#7A6A3A" strokeWidth={4} />
          {Array.from({ length: 5 }, (_, j) => <path key={j} d={`M${20 + j * 60},20 L${10 + j * 60},115`} stroke="rgba(90,70,30,.35)" strokeWidth={5} />)}
          <rect x={140} y={-60} width={6} height={60} fill="#5A4632" /><path d="M146,-60 L200,-46 L146,-32 Z" fill={K.brick} />
        </g>
      );
    })}
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill={K.petrol} opacity={ramp(t, a + 1, a + 1.6)}>Bir tarla. Bir tarla daha. Bir arsa.</text>
  </Scene>
);

// miras payları: kanun ↔ gerçek
const Shares: React.FC<{ t: number; a: number; real?: boolean }> = ({ t, a, real }) => {
  const rows = real
    ? [{ n: "Büyük abi", v: 50, c: K.petrol }, { n: "Küçük abi", v: 50, c: K.petrol }, { n: "Emine", v: 0, c: K.brick }, { n: "Hatice", v: 0, c: K.brick }, { n: "Anne", v: 0, c: "#8A7A60" }]
    : [{ n: "Anne", v: 25, c: "#8A7A60" }, { n: "Büyük abi", v: 18.75, c: K.petrol }, { n: "Küçük abi", v: 18.75, c: K.petrol }, { n: "Emine", v: 18.75, c: K.brick }, { n: "Hatice", v: 18.75, c: K.brick }];
  return (
    <AbsoluteFill style={{ background: real ? "#2A1E14" : K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ fontSize: 50, fontWeight: 800, color: real ? K.gold : K.petrol, marginBottom: 40, letterSpacing: 2 }}>{real ? "İMZADAN SONRA" : "KANUNA GÖRE MİRAS (1926'dan beri)"}</div>
      {rows.map((r, i) => {
        const k = ramp(t, a + 0.4 + i * 0.35, a + 1.2 + i * 0.35);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, width: 1400, marginTop: 18 }}>
            <div style={{ width: 300, fontSize: 46, fontWeight: 800, color: real ? K.cream : K.ink, textAlign: "right" }}>{r.n}</div>
            <div style={{ flex: 1, height: 64, background: real ? "#3F3024" : "#E2D3B5", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ width: `${r.v * 2 * k}%`, height: "100%", background: r.c, borderRadius: 12 }} />
            </div>
            <div style={{ width: 170, fontSize: 46, fontWeight: 800, color: r.v ? (real ? K.cream : K.ink) : K.brick }}>{r.v ? `%${(r.v * k).toFixed(r.v % 1 ? 2 : 0)}` : "0"}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 40, fontSize: 24, color: real ? "#9A8B72" : "#7A6A55" }}>{real ? "Temsilî" : "Sağ kalan eş 1/4, kalan 3/4 çocuklar arasında eşit · Türk Kanunu Medenisi (1926), Türk Medeni Kanunu (2001)"}</div>
    </AbsoluteFill>
  );
};

// tarlada apartman kat kat yükseliyor
const Building: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const fl = Math.min(6, Math.floor(ramp(t, a + 0.5, a + 4) * 6.99));
  return (
    <Scene t={t} a={a} bg="#CFE0E8" floor="#C9B27A">
      <path d="M560,820 L1360,820 L1330,900 L590,900 Z" fill="#E4C76B" opacity={1 - fl / 7} />
      {Array.from({ length: fl }, (_, i) => (
        <g key={i} transform={`translate(700,${740 - i * 95})`}>
          <rect width={520} height={95} fill={i % 2 ? "#E9DFC9" : "#F1E8D6"} stroke="#9A8B72" strokeWidth={3} />
          {[0, 1, 2, 3].map((w) => <rect key={w} x={40 + w * 120} y={22} width={70} height={52} fill={(i + w) % 3 ? "#7FB2D6" : "#FFD27A"} stroke="#5A4632" strokeWidth={3} />)}
          <rect x={-20} y={80} width={560} height={10} fill="#B9AD97" />
        </g>
      ))}
      <rect x={1320} y={120} width={14} height={700} fill="#E0A030" /><rect x={900} y={120} width={600} height={16} fill="#E0A030" />
      <Fig t={t} x={420} y={820} s={1} look={{ ...LOOK.man, body: "#2E3A46" }} seed={1} />
      <text x={960} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill={K.petrol}>{fl} kat</text>
    </Scene>
  );
};

// annen evde, kimse sormuyor
const MotherHome: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#E8D8BC" floor="#B98E5E" label="Annen evde. Ona kimse sormuyor.">
    <rect x={1250} y={250} width={300} height={260} rx={10} fill="#9FC3D6" stroke="#6E5338" strokeWidth={14} />
    <path d="M1400,250 L1400,510 M1250,380 L1550,380" stroke="#6E5338" strokeWidth={10} />
    <rect x={520} y={640} width={440} height={180} rx={20} fill="#8B3A3A" />
    <Fig t={t} x={740} y={760} s={1.25} look={LOOK.mother} sad seed={4} />
    <g transform="translate(1100,700)"><rect x={-50} y={0} width={100} height={120} rx={10} fill="#3A3A3A" /><rect x={-14} y={-150} width={28} height={150} fill="#555" /></g>
  </Scene>
);

// baban bavuluyla yola çıkıyor
const Leaving: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const x = 300 + (t - a) * 150;
  return (
    <Scene t={t} a={a} bg="#D8E2E4" floor="#9A9488" label="1963 → 1981">
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 420 - ((t - a) * 60) % 420} y={560} width={360} height={170} rx={20} fill="#3F6B5A" stroke="#2A4A3E" strokeWidth={6} />)}
      <Fig t={t} x={x} y={830} s={1.3} look={HASAN} walk={1} hold={<g transform="translate(-10,0)"><rect x={-50} y={0} width={110} height={80} rx={8} fill="#8A5A2A" stroke="#5A3A1A" strokeWidth={5} /><rect x={-10} y={-14} width={30} height={16} rx={6} fill="none" stroke="#5A3A1A" strokeWidth={5} /></g>} />
      <g transform="translate(1500,200)"><Flag t={t} w={240} /></g>
    </Scene>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "14 Mart", img: "01", yr: 1981, g: 90, ov: [{ t: "date", a: "14 Mart 1981", b: "Cumartesi · tapu müdürlüğü" }] },
  { c: "Koridorda soba", img: "01", ov: [{ t: "cay" }] },
  { c: "Senin adın Hatice", img: "02", ov: [{ t: "tag", a: "HATİCE", b: "17 yaşında · sen" }] },
  { c: "Ablan Emine", img: "02", ov: [{ t: "note", a: "ablan: Emine", p: "tr" }] },
  { c: "Masanın üstünde", img: "03" },
  { c: "Kimse sana", img: "03", ov: [{ t: "cap", a: "Kâğıtta ne yazdığını kimse okumuyor." }] },
  { c: "Abin sadece", img: "02", ov: [{ t: "quote", a: "İmzala, babamın hakkı helal olsun.", d: 0.6 }] },
  { c: "O kâğıttaki tarlaları", img: "13", yr: 1970 },
  { c: "Bugün o tarlaların", img: "04", yr: 2026 },
  { c: "Ve o apartmanların", img: "04", ov: [{ t: "cap", a: "Hiçbirinde senin adın yok." }] },
  { c: "Bu videoda", r: (t, a) => <Leaving t={t} a={a} /> },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir imza, bir aileyi nasıl ikiye böler?" img="02" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={386} text="Dedem Almanya'ya gitti, kendine hiçbir şey harcamadı. Parayla tarlalar alındı. O ölünce amcalarım her şeyi üstüne aldı, halalarımı imzayla mirastan çıkardılar…" /> },
  { c: "İsimleri değiştirdik", r: (t, a, b) => <Re img="02" t={t} a={a} b={b} d={0.45} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="İsimler değişti. Yaşananlar gerçek." size={70} y={440} /> },
  // ── 2 · Almanya ──
  { c: "Önce geriye", r: (t, a) => <Doc t={t} a={a} head="30 EKİM 1961 · BONN" lines={["Türkiye – Batı Almanya", "İşgücü Anlaşması"]} stamp="İMZA" foot="Kaynak: Resmî Gazete; Almanya Federal Arşivi" />, yr: 1961, g: 50 },
  { c: "Almanya'nın fabrikaları", r: (t, a) => <Split t={t} a={a} left={{ h: "ALMANYA", v: ["Fabrikalar", "işçi bekliyor"] }} right={{ h: "TÜRKİYE", v: ["Köyler", "iş bekliyor"] }} /> },
  { c: "1963 baharında", img: "05", yr: 1963, ov: [{ t: "tag", a: "HASAN", b: "27 · baban" }] },
  { c: "Evde karısı", img: "05", ov: [{ t: "note", a: "sen henüz yoksun", p: "tr" }] },
  { c: "Alman doktorlar", img: "06" },
  { c: "Baban geçiyor", img: "06", ov: [{ t: "stamp", a: "UYGUN" }], sfx: "pop" },
  { c: "Sirkeci Garı", img: "07", ov: [{ t: "date", a: "Sirkeci", b: "1963 · İstanbul" }] },
  { c: "Tahta bir bavul", img: "08", ov: [{ t: "list", a: ["birkaç gömlek", "bir kavanoz peynir", "annenin ördüğü kazak"] }] },
  { c: "Tren yaklaşık", r: (t, a) => <Route t={t} a={a} dur={7} title="Sirkeci → Münih · yaklaşık 3 gün" stops={[["İstanbul", 1660, 820], ["Sofya", 1330, 700], ["Belgrad", 1080, 560], ["Zagreb", 820, 470], ["Ljubljana", 660, 430], ["Salzburg", 480, 330], ["Münih", 320, 270]]} /> },
  { c: "Ve Münih", img: "09" },
  { c: "Baban sabah altıda", img: "09", ov: [{ t: "note", a: "40°C'nin üstü", p: "tr" }] },
  { c: "Akşam, altı kişinin", img: "10", ov: [{ t: "cay" }] },
  // ── 3 · Para ──
  { c: "Şimdi parayı", r: (t, a) => <Silence t={t} a={a} text="Parayı takip et." sub="hikâyenin asıl kahramanı" /> },
  { c: "Baban ayda", img: "10", ov: [{ t: "note", a: "ayda birkaç yüz mark", p: "tr" }] },
  { c: "Kendine neredeyse", img: "10", ov: [{ t: "list", a: ["✗ kahve", "✗ yeni elbise", "✗ yeni ayakkabı"] }] },
  { c: "Her ay postaneye", img: "11" },
  { c: "Ama annene değil", r: (t, a) => <MoneyFlow t={t} a={a} />, g: 65 },
  { c: "Çünkü o yıllarda", r: (t, a, b) => <Re img="12" t={t} a={a} b={b} d={0.4} />, html: (t, a) => <Txt t={t} at={a + 0.6} text="“Parayı evin erkeği yönetir.”" size={72} y={420} /> },
  { c: "O mark köye", img: "12", ov: [{ t: "note", a: "1 mark = çok lira", p: "tr" }] },
  { c: "Amcaların bu parayla", img: "12" },
  { c: "Sonra bir tarla daha", r: (t, a) => <Fields t={t} a={a} /> },
  { c: "O yıllarda gurbetçilerin", r: (t, a) => <Doc t={t} a={a} head="TÜRKİYE · 1970'LER" lines={["İşçi dövizleri:", "ülkenin en büyük döviz kaynaklarından biri"]} foot="Kaynak: TCMB ödemeler dengesi verileri; DPT kalkınma planları" /> },
  { c: "Ülkenin dengesi", r: (t, a, b) => <Re img="11" t={t} a={a} b={b} d={0.35} />, html: (t, a) => <Txt t={t} at={a + 0.4} text="Bir ülkenin dengesi, bu zarflarda." size={68} y={440} /> },
  { c: "sen doğuyorsun", img: "14", yr: 1964 },
  { c: "Kucağına alıyor", img: "14", ov: [{ t: "note", a: "Almanya kokan çikolata", p: "br" }] },
  { c: "Yıllar böyle", img: "15", yr: 1972 },
  { c: "Arabanın üstünde", img: "15", ov: [{ t: "list", a: ["televizyon", "mikser", "halı"] }] },
  { c: "Köyde herkes", img: "16", ov: [{ t: "quote", a: "Almancı…", d: 0.8 }] },
  { c: "Ama baban her izinde", img: "17", ov: [{ t: "quote", a: "Tarlalar ne durumda?", d: 0.8 }] },
  { c: "Amcaların gülümsüyor", img: "17", g: 75, ov: [{ t: "quote", a: "Merak etme abi, hepsi senin adına.", d: 0.3 }] },
  { c: "Kimse tapuya", r: (t, a) => <Doc t={t} a={a} head="TAPU KAYDI" lines={["Malik: …………", "Kimse bakmıyor."]} stamp="?" bg="#3A2A1E" /> },
  { c: "Kardeşe güvenilir", r: (t, a, b) => <Re img="13" t={t} a={a} b={b} d={0.35} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="Kardeşe güvenilir." size={90} y={430} /> },
  // ── 4 · Kaza ──
  { c: "1979 kışı", r: (t, a) => <Silence t={t} a={a} text="1979 kışı." sub="fabrikadan bir telefon" />, yr: 1979 },
  { c: "bir makine eziyor", img: "18" },
  { c: "Almanya'da iş kazası", r: (t, a) => <Doc t={t} a={a} head="ALMANYA · İŞ KAZASI SİGORTASI" lines={["Tazminat", "+ her ay kaza aylığı"]} foot="Kaynak: Alman kaza sigortası (Berufsgenossenschaft); Türk–Alman Sosyal Güvenlik Anlaşması (1964)" /> },
  { c: "Köyde bu haber", img: "16", ov: [{ t: "quote", a: "Hasan zengin oldu.", d: 0.6 }] },
  { c: "Baban artık", img: "19", yr: 1980 },
  { c: "Ama ev artık", img: "19", ov: [{ t: "note", a: "17 yıl sonra", p: "tr" }] },
  { c: "Bir akşam, tazminat", img: "20" },
  { c: "Bunu da toprağa", img: "20", ov: [{ t: "quote", a: "Toprak kaybolmaz.", d: 1.2 }] },
  { c: "Ve bir yıl bile", img: "21", yr: 1981 },
  // ── 5 · Kanun ve gelenek ──
  { c: "Şimdi o tapu", img: "01" },
  { c: "Bilmen gereken", r: (t, a) => <Doc t={t} a={a} head="TÜRK KANUNU MEDENİSİ · 17 ŞUBAT 1926" lines={["Kız ve erkek çocuk", "mirastan EŞİT pay alır."]} stamp="1926" foot="Kabul: 17 Şubat 1926 · Yürürlük: 4 Ekim 1926" />, g: 20 },
  { c: "Kanun bu konuda", r: (t, a) => <Shares t={t} a={a} /> },
  { c: "Ama köyde başka", r: (t, a) => <Split t={t} a={a} left={{ h: "KANUN (yazılı)", v: ["Kız = erkek", "eşit pay"] }} right={{ h: "GELENEK (yazısız)", v: ["“Kız evlenir, gider.”", "“Toprak yabancıya gitmesin.”"] }} /> },
  { c: "Ve bu kural", r: (t, a) => <Shares t={t} a={a} real />, g: 90 },
  { c: "Abin kalemi", img: "02" },
  { c: "Annen evde", r: (t, a) => <MotherHome t={t} a={a} /> },
  { c: "Ablan sana bakıyor", img: "03" },
  { c: "İmzalamazsan", r: (t, a, b) => <Re img="16" t={t} a={a} b={b} d={0.5} />, html: (t, a) => <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>{["“malı kardeşine çok gören kız”", "o evin kapısı kapanır", "annenin yüzüne bakamazsın"].map((s, i) => <div key={i} style={{ opacity: ramp(t, a + 0.6 + i * 1.6, a + 1 + i * 1.6), background: K.cream, color: K.brick, fontFamily: FONT, fontWeight: 800, fontSize: 52, padding: "10px 34px", borderRadius: 12, boxShadow: shadow }}>{s}</div>)}</div> },
  { c: "İmzalıyorsun", img: "03", g: 100, sfx: "knock", ov: [{ t: "stamp", a: "İMZA", d: 0.2 }] },
  { c: "O gün dışarı", img: "22" },
  { c: "Sadece bir kâğıt", r: (t, a, b) => <Re img="01" t={t} a={a} b={b} d={0.45} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="Sadece bir kâğıt, bir dosyaya giriyor." size={64} y={440} /> },
  // ── 6 · Anne ──
  { c: "Peki parayla", img: "23" },
  { c: "Almanya'nın emekli", r: (t, a) => <Doc t={t} a={a} head="ALMAN EMEKLİ SİGORTASI" lines={["Dul aylığı (Witwenrente)", "her ay · Türkiye'deki hesaba"]} foot="Türk–Alman Sosyal Güvenlik Anlaşması (1964): aylıklar Türkiye'ye ödenebilir" /> },
  { c: "Ve bu para annen", img: "23", ov: [{ t: "note", a: "80 yaşına kadar · her ay", p: "tr" }] },
  { c: "Yani evin en çok", r: (t, a, b) => <Re img="23" t={t} a={a} b={b} d={0.45} />, html: (t, a) => <Txt t={t} at={a + 0.4} text="En çok çalışan para → en az söz hakkı olan kadın" size={58} y={440} /> },
  { c: "Annen o parayla", img: "24" },
  { c: "Ve yıllar geçiyor", r: (t, a) => <Years t={t} a={a} upto={1} items={[{ y: "1981", s: "imza" }, { y: "1990'lar", s: "çevre yolu" }, { y: "2000'ler", s: "apartmanlar" }, { y: "2026", s: "bugün" }]} /> },
  { c: "İlçe büyüyor", img: "25", yr: 1995 },
  { c: "Tarlaların değeri", r: (t, a, b) => <Re img="25" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="Tarlanın değeri: kat kat ↑" size={80} y={420} /> },
  { c: "Müteahhitler geliyor", img: "26", yr: 2005 },
  { c: "Babanın aldığı tarlanın", r: (t, a) => <Building t={t} a={a} /> },
  { c: "Abilerinin her birinin", r: (t, a, b) => <Re img="26" t={t} a={a} b={b} d={0.35} />, ov: [{ t: "list", a: ["büyük abi: daireler", "küçük abi: daireler", "✗ Hatice: kira"] }] },
  { c: "Sen evleniyorsun", img: "27" },
  { c: "Her bayram köye", img: "28" },
  { c: "Yorumu yazan kişi", r: (t, a) => <Yorum t={t} a={a} likes={386} text="Ne bir hayır yapıldı, ne bir sadaka verildi. Dedemin onca yıllık emeğinin üstüne kimse bir dua bile okutmadı." /> },
  { c: "On yedi yıllık", r: (t, a, b) => <Re img="09" t={t} a={a} b={b} d={0.35} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="17 yıllık alın teri" size={86} y={430} /> },
  { c: "Benzer bir yorum", r: (t, a) => <Yorum t={t} a={a} likes={157} text="Dedem Almanya'da çöpçülük yaptı, restoran açtı. Hastalanınca restoranı kardeşlerine bıraktı. Onların çocukları rahat, biz zorluk çekiyoruz." /> },
  { c: "Biriktirdiği parayla", img: "30" },
  { c: "Bugün o kardeşlerin", r: (t, a) => <Split t={t} a={a} left={{ h: "Kardeşlerin çocukları", v: ["rahat"] }} right={{ h: "Dedenin torunları", v: ["zor günler"] }} /> },
  { c: "İki farklı aile", r: (t, a, b) => <Re img="30" t={t} a={a} b={b} d={0.45} />, html: (t, a) => <Txt t={t} at={a + 1.2} text="Para gidiyor. Emeğin sahibi kayboluyor." size={62} y={440} /> },
  // ── 7 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir imza, bir aileyi nasıl ikiye böler?" img="03" /> },
  { c: "İmza bölmüyor", img: "03" },
  { c: "Para kadına değil", r: (t, a) => <Years t={t} a={a} items={[{ y: "1963", s: "para kardeşe gidiyor" }, { y: "1970'ler", s: "tapuya kimse bakmıyor" }, { y: "1981", s: "kanun eşit, gelenek değil" }]} /> },
  { c: "Bugün Türkiye'de", r: (t, a) => <Doc t={t} a={a} head="BUGÜN" lines={["Kanun aynı: eşit pay.", "Değişmesi gereken: sessizlik."]} />, g: 50 },
  { c: "Değişmesi gereken", r: (t, a, b) => <Re img="01" t={t} a={a} b={b} d={0.4} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="o koridordaki sessizlik" size={80} y={440} /> },
  // ── 8 · Dönüş ──
  { c: "7 Kasım", img: "29", yr: 2026, g: null, ov: [{ t: "date", a: "7 Kasım 2026", b: "köy mezarlığı" }] },
  { c: "Mezar taşında", img: "29", ov: [{ t: "list", a: ["✗ Almanya", "✗ döküm fabrikası", "✗ 17 yıl"] }] },
  { c: "Hatice cebinden", img: "29" },
  { c: "Baba, ben hakkımı", r: (t, a, b) => <Re img="21" t={t} a={a} b={b} d={0.45} />, ov: [{ t: "quote", a: "Baba, ben hakkımı helal ettim. Ama sen de bil. Biz de senin çocuklarındık.", d: 0.2 }] },
  { c: "Peki senin ailende", img: "14", ov: [{ t: "cap", a: "Senin ailende Almanya parası nereye gitti?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video06, seconds: K5_06_SECONDS } = makeK5({ id: "k5-06", words, shots: SHOTS, year: 1981, gauge: ["KANUN", "GELENEK"], title: "Babanın Almanya mirası kime kaldı?" });
void Counter; void HAND;
