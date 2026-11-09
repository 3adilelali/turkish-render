import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-09-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Question, Re, Route, Scene, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-09 · "Kâğıt Üstünde Kızım" · ölçek: ANA (doğuran) ↔ ANNE (büyüten)
const AYSE = { ...LOOK.girl, body: "#E58FA8", body2: "#C46F8A", scarf: "#5A3A2A" };
const YENGE = { ...LOOK.mother, body: "#5E8F5E", body2: "#476F47", scarf: "#F4F1EA" };
const ANA = { ...LOOK.mother, body: "#7A6A8F", body2: "#5C4F6E", scarf: "#2E3E6B" };

// avlu: iki ev, arada küçük kız
const Avlu: React.FC<{ t: number; a: number; cross?: boolean; label?: string }> = ({ t, a, cross, label }) => {
  const k = cross ? ramp(t, a + 0.3, a + 4) : 0;
  return (
    <Scene t={t} a={a} bg="#EAD9B8" floor="#D2B98A" label={label}>
      <rect x={90} y={360} width={460} height={460} fill="#B98E5E" stroke="#7A5A3A" strokeWidth={8} /><rect x={70} y={340} width={500} height={30} fill="#7A5A3A" />
      <rect x={260} y={600} width={110} height={220} fill="#5A3E26" /><rect x={140} y={450} width={90} height={80} fill="#F7D98A" opacity={0.8} />
      <text x={320} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.ink}>7 çocuk</text>
      <rect x={1370} y={380} width={460} height={440} fill="#C9A06B" stroke="#7A5A3A" strokeWidth={8} /><rect x={1350} y={360} width={500} height={30} fill="#7A5A3A" />
      <rect x={1540} y={600} width={110} height={220} fill="#5A3E26" /><rect x={1690} y={460} width={90} height={80} fill="#F7D98A" opacity={0.8} />
      <text x={1600} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.ink}>0 çocuk</text>
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={760 + i * 70} y={780 + (i % 2) * 20} width={60} height={26} rx={10} fill="#E8CF8A" opacity={0.7} />)}
      <Fig t={t} x={480} y={840} s={1.1} look={ANA} seed={1} sad={cross} />
      <Fig t={t} x={560 + 900 * k} y={840} s={0.8} look={AYSE} walk={cross && k < 1 ? 1 : 0} seed={2} />
      <Fig t={t} x={1500} y={840} s={1.1} look={YENGE} seed={3} wave={cross && k > 0.8} />
    </Scene>
  );
};

// beşik on iki yıl boş
const Cradle: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center" }}>
    <svg width={900} height={600} viewBox="0 0 900 600" style={{ transform: `rotate(${Math.sin((t - a) * 1.4) * 4}deg)`, transformOrigin: "450px 100px" }}>
      <path d="M150,250 Q450,560 750,250" fill="#8A5A34" stroke="#5A3A1E" strokeWidth={14} />
      <path d="M180,260 Q450,500 720,260 Z" fill="#E9DFC9" opacity={0.9} />
      <line x1={150} y1={250} x2={450} y2={40} stroke="#A07850" strokeWidth={6} /><line x1={750} y1={250} x2={450} y2={40} stroke="#A07850" strokeWidth={6} />
    </svg>
    <div style={{ position: "absolute", bottom: 120, fontFamily: HAND, fontSize: 84, color: K.gold, opacity: ramp(t, a + 0.8, a + 1.4) }}>12 yıl · beşik boş</div>
  </AbsoluteFill>
);

// iki anne, iki kelime
const TwoWords: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <AbsoluteFill style={{ background: K.cream, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 260, fontFamily: HAND }}>
    {[["ANA", "doğuran", ANA, 0.3], ["ANNE", "büyüten", YENGE, 1.3]].map(([w, s, l, d], i) => {
      const k = ramp(t, a + (d as number), a + (d as number) + 0.5);
      return (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
          <svg width={300} height={360} viewBox="380 520 300 360"><Fig t={t} x={530} y={860} s={1.2} look={l as typeof ANA} seed={i + 1} /></svg>
          <div style={{ fontSize: 140, color: i ? K.brick : K.petrol, lineHeight: 1 }}>{w as string}</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: K.ink }}>{s as string}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// nüfus cüzdanı: baba/anne adı satırları değişiyor
const Nufus: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 1.2, a + 2.2);
  const row = (l: string, real: string, paper: string) => (
    <div style={{ display: "flex", gap: 30, alignItems: "center", fontSize: 46, marginTop: 24 }}>
      <span style={{ width: 280, color: "#556", fontWeight: 700 }}>{l}</span>
      <span style={{ position: "relative", fontFamily: HAND, fontSize: 62 }}>
        <span style={{ opacity: 1 - k, textDecoration: k > 0.3 ? "line-through" : undefined }}>{real}</span>
        <span style={{ position: "absolute", left: 0, top: 0, color: K.brick, opacity: k }}>{paper}</span>
      </span>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1100, background: "#CFE3EC", borderRadius: 24, padding: "50px 70px", boxShadow: shadow, border: "6px solid #8FB3C2" }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: K.petrol, letterSpacing: 4 }}>NÜFUS CÜZDANI</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: K.ink, marginTop: 20 }}>Adı: Ayşe</div>
        {row("Baba adı", "(gerçek baba)", "Amca")}
        {row("Ana adı", "(gerçek ana)", "Yenge")}
      </div>
    </AbsoluteFill>
  );
};

// bebek iki ev arasında
const Doll: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const p = (Math.sin((t - a) * 1.2) + 1) / 2;
  return (
    <AbsoluteFill style={{ background: "#EAD9B8", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 200, top: 380, width: 360, height: 360, background: "#B98E5E", border: "8px solid #7A5A3A" }} />
      <div style={{ position: "absolute", right: 200, top: 380, width: 360, height: 360, background: "#C9A06B", border: "8px solid #7A5A3A" }} />
      <div style={{ position: "absolute", left: 580 + p * 620, top: 470 - Math.sin(p * Math.PI) * 160 }}>
        <svg width={120} height={170} viewBox="0 0 60 85"><circle cx={30} cy={20} r={16} fill="#F6D7B8" /><path d="M14,18 Q30,-2 46,18" fill="#C8873A" /><circle cx={24} cy={20} r={2.4} fill="#333" opacity={Math.floor(t * 2) % 4 ? 1 : 0} /><circle cx={36} cy={20} r={2.4} fill="#333" opacity={Math.floor(t * 2) % 4 ? 1 : 0} /><path d="M12,40 L48,40 L54,82 L6,82 Z" fill="#E85A7A" /></svg>
      </div>
      {["bir gece burada", "bir gece orada"].map((s, i) => <div key={i} style={{ position: "absolute", top: 780, left: i ? undefined : 200, right: i ? 200 : undefined, width: 360, textAlign: "center", fontFamily: HAND, fontSize: 50, color: K.ink }}>{s}</div>)}
    </AbsoluteFill>
  );
};

// iki mezar, iki uç
const Graves: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.5, a + 5);
  return (
    <Scene t={t} a={a} bg="#E7C9A0" floor="#A88E5E" label="İkisine de aynı dua.">
      {[300, 1620].map((x, i) => <g key={i}><rect x={x - 50} y={620} width={100} height={200} rx={50} fill="#E9E4DA" stroke="#9A948A" strokeWidth={6} /><rect x={x - 90} y={800} width={180} height={30} fill="#9A948A" /></g>)}
      <path d="M350,840 Q960,900 1570,840" stroke="#7A6A4A" strokeWidth={4} strokeDasharray="14 14" fill="none" />
      <Fig t={t} x={420 + 1080 * k} y={840} s={1.05} look={LOOK.nine} walk={k > 0 && k < 1 ? 1 : 0} seed={4} />
    </Scene>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "3 Eylül", img: "01", yr: 1968, ov: [{ t: "date", a: "3 Eylül 1968", b: "İç Anadolu · bir köy" }] },
  { c: "Senin adın Ayşe", img: "02", ov: [{ t: "tag", a: "AYŞE", b: "3 yaşında · sen" }] },
  { c: "Sonra elini tuttu", r: (t, a) => <Avlu t={t} a={a} cross /> },
  { c: "O evde amcan", img: "03" },
  { c: "Annen elini bırakıyor", img: "04", ov: [{ t: "quote", a: "Bundan sonra annen bu.", d: 2 }], g: 30 },
  { c: "Bu videoda", img: "07" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir çocuk kime aittir?" img="04" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={86} text="Babam, çocuğu olmayan amcama bir kızını verdi. Aynı avluda büyüdü. Kâğıtta amcamın kızıydı." /> },
  // ── 2 · Neden ──
  { c: "Önce neden", img: "05" },
  { c: "Senin evinde yedi", r: (t, a) => <Avlu t={t} a={a} label="Tarla küçük, ağız çok." /> },
  { c: "Amcanın ise hiç", r: (t, a) => <Cradle t={t} a={a} /> },
  { c: "O yıllarda Anadolu'da", img: "06" },
  { c: "Kimse buna satmak", r: (t, a) => <Silence t={t} a={a} text="“Kardeşimin ocağı tütsün.”" sub="satmak değil · vermek bile değil" /> },
  { c: "Çocuk aynı avluda", img: "03", ov: [{ t: "list", a: ["aynı avlu", "aynı soyadı", "başka kapı"] }] },
  { c: "Ve bazen, nüfus", r: (t, a) => <Nufus t={t} a={a} /> },
  { c: "Yengen seni yanına", img: "08" },
  { c: "Ama akşam olunca", img: "07", g: 20 },
  { c: "İlk aylar zor", img: "08" },
  { c: "Bir süre sonra", r: (t, a) => <TwoWords t={t} a={a} /> },
  { c: "İki anne", r: (t, a) => <Silence t={t} a={a} text="İki anne. İki kelime." /> },
  // ── 3 · Almanya ──
  { c: "1970 baharı", img: "09", yr: 1970 },
  { c: "Türkiye ile Batı Almanya", r: (t, a) => <Route t={t} a={a} title="1961 · İşçi anlaşması" stops={[["Köy", 1660, 820], ["İstanbul", 1450, 760], ["Belgrad", 1080, 560], ["Münih", 520, 330], ["Köln", 300, 220]]} /> },
  { c: "Bir işçi yurdunda", img: "10" },
  { c: "Akşamları yatağının", img: "11" },
  { c: "Odadaki öbür", img: "11", ov: [{ t: "quote", a: "Kızın mı?", d: 0.6 }] },
  { c: "Ve o kelimeyi", img: "11", ov: [{ t: "quote", a: "Kızım.", d: 0.3 }], g: 50 },
  { c: "Ve orada hayatını", img: "12" },
  { c: "Çocuk parası", r: (t, a) => <Doc t={t} a={a} head="KINDERGELD" lines={["= çocuk parası", "Almanya'da çalışan her işçiye", "her çocuk için, her ay."]} stamp="ANTRAG" /> },
  { c: "Almanya'da çalışan her", img: "12" },
  { c: "Ve Türkiye ile Almanya arasındaki", r: (t, a) => <Doc t={t} a={a} head="1964 · SOSYAL GÜVENLİK ANLAŞMASI" lines={["Türkiye ↔ Almanya", "Çocuk Türkiye'de yaşasa da", "çocuk parası ödenir."]} foot="Kaynak: Türkiye–Almanya Sosyal Güvenlik Sözleşmesi (1964)" /> },
  { c: "Miktar, Almanya'da", r: (t, a) => <Split t={t} a={a} left={{ h: "ALMANYA'DA ÇOCUK", v: ["tam tutar"] }} right={{ h: "KÖYDE ÇOCUK", v: ["daha az", "ama: ekmek parası"] }} /> },
  { c: "Amcan forma bir isim", img: "12", ov: [{ t: "note", a: "Ayşe", p: "tr" }] },
  { c: "Her ay Almanya'dan", img: "13" },
  { c: "Ama bu para kendiliğinden", img: "14" },
  { c: "Muhtar bir kâğıt", r: (t, a) => <Doc t={t} a={a} head="MUHTARLIK" lines={["Bu çocuk hayattadır", "ve köyde yaşamaktadır."]} stamp="MÜHÜR" bg="#3A2A1E" /> },
  { c: "Yengen bu kâğıtları", img: "14", ov: [{ t: "cap", a: "Bütün hayatın: bir dosya kalınlığında." }] },
  // ── 4 · Almancı kızı ──
  { c: "Yengen o parayla", img: "15", g: 70 },
  { c: "Karşıdaki evde", img: "16", ov: [{ t: "quote", a: "Almancı kızı!", d: 1.5 }] },
  { c: "Ama sen henüz", img: "15" },
  { c: "Her yaz amcan", img: "17", sfx: "ding" },
  { c: "O gece bebeği", img: "17" },
  { c: "Ama sabah", img: "18" },
  { c: "Bebek o yaz", r: (t, a) => <Doll t={t} a={a} /> },
  { c: "O yıllarda bu sistemi", r: (t, a) => <Years t={t} a={a} items={[{ y: "1961", s: "işçi anlaşması" }, { y: "1964", s: "sosyal güvenlik" }, { y: "1970'ler", s: "çocuk parası köye" }, { y: "1990", s: "emeklilik · son" }]} upto={3} /> },
  { c: "Ve bir çocuk için", r: (t, a) => <Counter t={t} a={a} to={1} pre="çocuk = " suf=" form" head="BİR ÇOCUK" sub="bir yerlerde bir rakam" bg="#E9DCC2" /> },
  // ── 5 · Gerçek ──
  { c: "1977", img: "19", yr: 1977 },
  { c: "Kendi cüzdanını", r: (t, a) => <Nufus t={t} a={a} />, g: 40 },
  { c: "O akşam eve koşuyorsun", img: "20", ov: [{ t: "quote", a: "Ben kimin kızıyım?", d: 1.2 }] },
  { c: "Yengen kaşığı", img: "20", ov: [{ t: "quote", a: "Benim kızımsın.", d: 3 }] },
  { c: "Ama sen o gece", img: "21", ov: [{ t: "quote", a: "Ana beni neden verdi?", d: 2 }], g: 15 },
  { c: "Gerçek annen bu soruya", img: "22" },
  { c: "Bir gün kendi", img: "23" },
  { c: "Sen zaten bizden", img: "23", ov: [{ t: "cap", a: "“Sen Almancı'nın kızısın.”" }] },
  { c: "O cümle yıllarca", r: (t, a) => <Silence t={t} a={a} text="İkisi de doğru. İkisi de yanlış." /> },
  // ── 6 · Durdurulan hikâye ──
  { c: "Şimdi aynı hikâyenin", img: "24" },
  { c: "Yorumlarda bir başkası", r: (t, a) => <Yorum t={t} a={a} likes={41} text="Amcamın tek oğlu ölünce babam beş oğlundan birini ona vermek istedi. Abilerim ve annem karşı çıktı. Kardeşim evde kaldı." /> },
  { c: "Ama bu kez olmuyor", img: "24", ov: [{ t: "quote", a: "Benim oğlum bir boşluğu doldurmak için büyümedi.", d: 2 }] },
  { c: "İki hikâye", r: (t, a) => <Split t={t} a={a} left={{ h: "AYŞE", v: ["verildi", "kimse “hayır” demedi"] }} right={{ h: "BEŞ KARDEŞ", v: ["durduruldu", "bir anne “hayır” dedi"] }} /> },
  // ── 7 · Düğün ──
  { c: "1985", img: "25", yr: 1985, g: 80 },
  { c: "Ve sen o an", img: "25", ov: [{ t: "cap", a: "Annen seni hiç bırakmamış. Avlunun karşısından izlemiş." }] },
  { c: "Amcan 1990'da", img: "26", yr: 1990 },
  // ── 8 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir çocuk kime aittir?" img="25" /> },
  { c: "Kâğıt üstünde", r: (t, a) => <Nufus t={t} a={a} /> },
  { c: "Ama gerçek cevap", r: (t, a) => <TwoWords t={t} a={a} />, g: 100 },
  { c: "7 Kasım", img: "27", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "köy mezarlığı" }] },
  { c: "İki mezar", r: (t, a) => <Graves t={t} a={a} /> },
  { c: "Ve giderken torunu", img: "28", ov: [{ t: "quote", a: "Hangisi senin annendi?", d: 1.5 }] },
  { c: "Ayşe gülümsüyor", r: (t, a, b) => <Re img="28" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 0.8} text="“İkisi de kuzum. İkisi de.”" size={70} y={430} /> },
  { c: "Sizin ailenizde", img: "21", ov: [{ t: "cap", a: "Sizin ailenizde evlat verildiğini duydunuz mu?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video09, seconds: K5_09_SECONDS } = makeK5({ id: "k5-09", words, shots: SHOTS, year: 1968, gauge: ["ANA", "ANNE"], title: "Bir çocuk kime aittir?" });
