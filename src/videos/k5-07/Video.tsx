import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-07-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Letter, Question, Re, Route, Scene, Shot, Silence, Txt, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-07 · "Almanya Mektuplarını Okuyan Çocuk" · ölçek: YAZILAN ↔ SÖYLENEMEYEN
const ZEHRA = { ...LOOK.girl, body: "#B23A2E", body2: "#8E2E25", scarf: "#F4F1EA", skirt: "#5B7F95" };
const GULSUM = { ...LOOK.bride, body: "#5E2E6E", body2: "#4A2457", scarf: "#9E2F2F", skirt: "#6B4A3A" };

// karlı yolda yürüyüş: köy → kasaba 3 saat
const Walk: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#DCE6EC" floor="#F4F6F8" label="Kasabaya yürüyerek: 3 saat">
    {[0, 1, 2].map((i) => <path key={i} d={`M${-200 + i * 800 - ((t - a) * 40) % 800},820 L${200 + i * 800 - ((t - a) * 40) % 800},380 L${600 + i * 800 - ((t - a) * 40) % 800},820 Z`} fill="#9FB3C2" opacity={0.6} />)}
    {Array.from({ length: 40 }, (_, i) => { const y = ((t * 60 + i * 97) % 1100) - 50; return <circle key={i} cx={(i * 211 + Math.sin(t + i) * 20) % 1920} cy={y} r={4 + (i % 3)} fill="#fff" opacity={0.8} />; })}
    <Fig t={t} x={760} y={840} s={1.15} look={GULSUM} walk={1} seed={1} />
    <Fig t={t} x={1000} y={840} s={1.15} look={ZEHRA} walk={1} seed={3} />
  </Scene>
);

// erkeksiz köy: sadece kadınlar, çocuklar, yaşlılar
const NoMen: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <Scene t={t} a={a} bg="#E9DFC9" floor="#CDBB95" label="Sokakta erkek sesi yok.">
    <rect x={120} y={380} width={380} height={440} fill="#B98E5E" stroke="#7A5A3A" strokeWidth={8} /><path d="M100,390 L310,250 L520,390 Z" fill="#7A5A3A" />
    <rect x={1420} y={400} width={380} height={420} fill="#C9A06B" stroke="#7A5A3A" strokeWidth={8} /><path d="M1400,410 L1610,280 L1820,410 Z" fill="#7A5A3A" />
    <Fig t={t} x={600} y={840} s={1.05} look={LOOK.mother} seed={1} />
    <Fig t={t} x={800} y={840} s={1.05} look={LOOK.nine} seed={2} sad />
    <Fig t={t} x={980} y={840} s={1.0} look={LOOK.kid} seed={3} walk={1} />
    <Fig t={t} x={1160} y={840} s={1.05} look={GULSUM} seed={4} />
    <Fig t={t} x={1330} y={840} s={1.0} look={ZEHRA} seed={5} />
    <g opacity={ramp(t, a + 1.2, a + 1.8)}><circle cx={1700} cy={200} r={70} fill="none" stroke={K.brick} strokeWidth={10} /><path d="M1650,150 L1750,250" stroke={K.brick} strokeWidth={10} /><text x={1700} y={315} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={K.brick}>erkekler: Almanya</text></g>
  </Scene>
);

// başparmak izi = bir aylık ekmek
const Thumb: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.3, a + 0.8);
  return (
    <AbsoluteFill style={{ background: "#F7F1E3", justifyContent: "center", alignItems: "center" }}>
      <svg width={520} height={640} viewBox="0 0 260 320" style={{ transform: `scale(${1.4 - 0.4 * k}) rotate(-6deg)`, opacity: k }}>
        {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={130} cy={170} rx={20 + i * 8} ry={28 + i * 10} fill="none" stroke="#23314A" strokeWidth={5} opacity={0.75} strokeDasharray={i % 3 ? "40 8" : "none"} />)}
      </svg>
      <div style={{ position: "absolute", bottom: 150, fontFamily: HAND, fontSize: 84, color: K.ink, opacity: ramp(t, a + 1.2, a + 1.8) }}>= bir aylık ekmek</div>
    </AbsoluteFill>
  );
};

// kaset: makaralar dönüyor, ses dalgası
const Kaset: React.FC<{ t: number; a: number; play?: boolean; line?: string }> = ({ t, a, play, line }) => {
  const rot = play ? (t - a) * 220 : 0;
  return (
    <AbsoluteFill style={{ background: "#2A1E14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 1100, height: 680, background: "#3A3A3A", borderRadius: 40, boxShadow: shadow, position: "relative", transform: `scale(${1 + (t - a) * 0.01}) rotate(-2deg)` }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 60, height: 300, background: K.cream, borderRadius: 16 }}>
          <div style={{ fontFamily: HAND, fontSize: 64, color: "#23314A", padding: "20px 40px" }}>Gülsüm'e · Köln'den</div>
          <div style={{ position: "absolute", left: 160, right: 160, top: 130, height: 140, background: "#2B2420", borderRadius: 70, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px" }}>
            {[0, 1].map((i) => <svg key={i} width={110} height={110} viewBox="-55 -55 110 110" style={{ transform: `rotate(${rot}deg)` }}><circle r={50} fill="#F4F1EA" /><circle r={16} fill="#2B2420" />{[0, 60, 120, 180, 240, 300].map((d) => <rect key={d} x={-4} y={-30} width={8} height={14} fill="#2B2420" transform={`rotate(${d})`} />)}</svg>)}
          </div>
        </div>
        {play && <svg viewBox="0 0 960 200" width={960} height={200} style={{ position: "absolute", left: 70, bottom: 60 }}>
          {Array.from({ length: 60 }, (_, i) => { const h = 20 + Math.abs(Math.sin(t * 8 + i * 0.7) * Math.sin(t * 3 + i * 0.3)) * 150; return <rect key={i} x={i * 16} y={100 - h / 2} width={10} height={h} rx={5} fill={K.gold} />; })}
        </svg>}
      </div>
      {line && <Txt t={t} at={a + 1.2} text={line} size={64} y={60} />}
    </AbsoluteFill>
  );
};

// zarfın arkasında minicik "Özledim."
const Zarf: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const z = 1 + ramp(t, a + 1.2, a + 4) * 1.6;
  return (
    <AbsoluteFill style={{ background: "#3A2A1E", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ width: 1100, height: 640, background: "#F1E3C6", boxShadow: shadow, position: "relative", transform: `scale(${z})`, transformOrigin: "85% 85%" }}>
        <svg viewBox="0 0 1100 640" width={1100} height={640} style={{ position: "absolute" }}><path d="M0,0 L550,330 L1100,0" fill="none" stroke="#C9B48E" strokeWidth={6} /><path d="M0,640 L460,300 M1100,640 L640,300" stroke="#C9B48E" strokeWidth={6} /></svg>
        <div style={{ position: "absolute", right: 70, bottom: 50, fontFamily: HAND, fontSize: 30, color: "#23314A", opacity: ramp(t, a + 0.6, a + 1.2), transform: "rotate(-4deg)" }}>Özledim.</div>
      </div>
    </AbsoluteFill>
  );
};

// sesli mesaj balonu
const VoiceMsg: React.FC<{ t: number; a: number; text: string }> = ({ t, a, text }) => (
  <AbsoluteFill style={{ background: "#DCE8E4", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ width: 600, height: 960, background: "#111", borderRadius: 70, padding: 26, boxShadow: shadow, transform: `rotate(2deg) scale(${1 + (t - a) * 0.01})` }}>
      <div style={{ width: "100%", height: "100%", background: "#ECE5DD", borderRadius: 50, padding: "120px 30px", display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ alignSelf: "flex-start", background: "#fff", borderRadius: 26, padding: "20px 26px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 4px rgba(0,0,0,.15)", opacity: ramp(t, a + 0.3, a + 0.7) }}>
          <div style={{ width: 0, height: 0, borderLeft: "26px solid #1F4E5F", borderTop: "16px solid transparent", borderBottom: "16px solid transparent" }} />
          <svg width={260} height={60}>{Array.from({ length: 26 }, (_, i) => { const h = 8 + Math.abs(Math.sin(i * 1.3 + t * (t > a + 1 ? 6 : 0))) * 44; return <rect key={i} x={i * 10} y={30 - h / 2} width={6} height={h} rx={3} fill="#1F4E5F" />; })}</svg>
          <span style={{ fontSize: 26, color: "#666" }}>0:02</span>
        </div>
        <div style={{ alignSelf: "flex-start", fontFamily: HAND, fontSize: 48, color: K.ink, opacity: ramp(t, a + 1.2, a + 1.8) }}>“{text}”</div>
      </div>
    </div>
  </AbsoluteFill>
);

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "12 Şubat", img: "01", yr: 1977, g: 50, ov: [{ t: "date", a: "12 Şubat 1977", b: "Karadeniz · bir yayla köyü" }] },
  { c: "Senin adın Zehra", img: "02", ov: [{ t: "tag", a: "ZEHRA", b: "10 yaşında · sen" }] },
  { c: "Kapıda başörtüsünü", img: "02" },
  { c: "Adı Gülsüm", img: "03", ov: [{ t: "tag", a: "GÜLSÜM", b: "19 · kocası Almanya'da" }] },
  { c: "Ve Gülsüm okuma", img: "03", ov: [{ t: "cap", a: "Gülsüm okuma yazma bilmiyor." }] },
  { c: "Zehra kızım", img: "13", ov: [{ t: "quote", a: "Zehra kızım, bir okuyuver şunu.", d: 0.2 }] },
  { c: "Bu videoda", img: "21" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir mektupta en çok neyi yazamazsın?" img="14" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={239} text="Babaannem okuma bilmezdi. Dedeme mektup yazdırmak için köyün öbür ucuna yürürdü. 'Seni özledim' diyemedi. Cevap geldi: 'Bu yıl da gelemiyorum.'" /> },
  // ── 2 · Köy ──
  { c: "Önce köyü tanı", img: "04" },
  { c: "Köyde elektrik yok", img: "04", ov: [{ t: "list", a: ["✗ elektrik", "✗ telefon", "gaz lambası"] }] },
  { c: "Kasabaya yürüyerek", r: (t, a) => <Walk t={t} a={a} /> },
  { c: "Okulun tek bir", img: "05" },
  { c: "Öğretmen bir sıraya", img: "05", ov: [{ t: "list", a: ["1. sınıf", "2. sınıf", "3. sınıf", "· aynı oda ·"] }] },
  { c: "Sabah okula giderken", img: "06" },
  { c: "Çünkü sobayı", img: "06", ov: [{ t: "note", a: "sobayı öğrenciler yakıyor", p: "br" }] },
  { c: "Ve sen sınıfın", img: "07" },
  { c: "Ve bu işin", img: "12", ov: [{ t: "list", a: ["bir avuç ceviz", "iki yumurta", "kuru üzüm"] }] },
  { c: "Köyün en zengin", img: "12", ov: [{ t: "note", a: "köyün en zengin çocuğu", p: "tl" }] },
  { c: "Bu neden bu kadar", r: (t, a) => <Doc t={t} a={a} head="TÜRKİYE · 1970 NÜFUS SAYIMI" lines={["Kadınların yarısından fazlası", "okuma yazma bilmiyor."]} foot="Kaynak: DİE, 1970 Genel Nüfus Sayımı (kadın okuryazarlığı ≈ %42)" />, g: 60 },
  { c: "Ve köyün erkeklerinin", img: "08" },
  { c: "1961'de Türkiye", img: "09", yr: 1961 },
  { c: "On iki yıl boyunca", r: (t, a) => <Route t={t} a={a} dur={5} title="1961–1973 · yüz binlerce erkek, trenle" stops={[["İstanbul", 1660, 820], ["Sofya", 1330, 700], ["Belgrad", 1080, 560], ["Zagreb", 820, 470], ["Münih", 520, 330], ["Köln", 300, 220]]} /> },
  { c: "Bir köy düşün", r: (t, a) => <NoMen t={t} a={a} />, yr: 1977 },
  { c: "Tarlayı kadınlar", img: "08" },
  { c: "Bir mektup Almanya'dan", r: (t, a) => <Route t={t} a={a} dur={6} icon="bus" title="Bir mektubun yolu: ~2 hafta, bazen 1 ay" stops={[["Köln", 300, 220], ["Münih", 520, 330], ["Belgrad", 1000, 520], ["İstanbul", 1500, 760], ["Kasaba", 1700, 600], ["Köy", 1800, 450]]} /> },
  { c: "Postacı mektupları", img: "10" },
  { c: "Mektup günü", img: "10", ov: [{ t: "note", a: "mektup günü", p: "tr" }] },
  { c: "Ama bazı kapılar", r: (t, a, b) => <Re img="19" t={t} a={a} b={b} d={0.4} />, html: (t, a) => <Txt t={t} at={a + 0.4} text="Bazı kapılar hiç açılmıyor." size={76} y={430} /> },
  { c: "Para da bu yoldan", img: "11" },
  { c: "İmza atamayanlar", img: "11", ov: [{ t: "note", a: "imza yerine başparmak", p: "tr" }] },
  { c: "Bir başparmak izi", r: (t, a) => <Thumb t={t} a={a} /> },
  // ── 3 · Mektup ──
  { c: "Şimdi Gülsüm'ün", img: "03" },
  { c: "Kâğıt ince", img: "14" },
  { c: "Önce Allah'ın selamı", r: (t, a) => <Letter t={t} a={a} head="Köln, Ocak 1977" lines={["Önce Allah'ın selamı,", "sonra benim selamım…"]} /> },
  { c: "Sonra uzun bir liste", r: (t, a) => <Letter t={t} a={a} speed={0.03} lines={["Anneme selam, babama selam,", "amcama selam, komşulara selam,", "Hacı Emmi'ye selam…"]} /> },
  { c: "Sonra iş", r: (t, a) => <Letter t={t} a={a} lines={["Fabrikada çalışıyorum, iyiyim,", "merak etmeyin.", "Bu ay iki yüz mark gönderdim,", "babama verin."]} /> },
  { c: "Ve en sonunda, en alta", r: (t, a) => <Letter t={t} a={a} lines={["…", "…", "Gülsüm'e de selam söyleyin."]} />, g: 70 },
  { c: "Zarfın içinden", img: "15" },
  { c: "Gülsüm fotoğrafı", img: "16" },
  { c: "Gülsüm sana bakıyor", img: "17", ov: [{ t: "quote", a: "Başka bir şey yazmıyor mu?", d: 0.5 }] },
  { c: "Sen kâğıda tekrar", img: "17", ov: [{ t: "cap", a: "Yazmıyor." }] },
  { c: "İşte o an", r: (t, a, b) => <Re img="13" t={t} a={a} b={b} d={0.4} />, html: (t, a) => <Txt t={t} at={a + 0.4} text="Karısına doğrudan yazamıyor." size={70} y={430} /> },
  { c: "Çünkü mektubu evde", img: "23", ov: [{ t: "list", a: ["baba okuyacak", "anne okuyacak", "kardeşler okuyacak", "ya da bir çocuk"] }] },
  { c: "Ertesi hafta", img: "18" },
  { c: "Kâğıdı açıyorsun", img: "18", ov: [{ t: "quote", a: "Ne yazayım abla?", d: 1 }] },
  { c: "Gülsüm başlıyor", r: (t, a) => <Letter t={t} a={a} stamp="PTT" head="Köy, Şubat 1977" lines={["Önce Allah'ın selamı.", "İnek doğurdu.", "Çatı akıyor.", "Sonra…"]} /> },
  { c: "Duruyor", img: "18", g: 85 },
  { c: "Ve sonunda sadece", r: (t, a, b) => <Re img="16" t={t} a={a} b={b} d={0.35} />, ov: [{ t: "quote", a: "Yaz kızım. De ki, bu yaz gelsin.", d: 0.4 }] },
  { c: "Yıllar sonra bir başkası", img: "19" },
  { c: "Kocasına", img: "20", ov: [{ t: "cap", a: "“Seni özledim” diyemiyor." }] },
  { c: "Mektup gidiyor", r: (t, a) => <Letter t={t} a={a} lines={["Bu yıl da gelemiyorum."]} /> },
  { c: "Bir yıl daha", r: (t, a) => <Silence t={t} a={a} text="Bir yıl daha." sub="söylenemeyen bir kelime yüzünden" />, g: 95 },
  { c: "Senin defterinde", img: "21", ov: [{ t: "list", a: ["kim para göndermiyor", "kim hasta", "kimin kocası…"] }] },
  { c: "Ama sen on yaşındasın", img: "21", ov: [{ t: "cap", a: "Bu sırları kimseye söylemiyorsun." }] },
  // ── 4 · Kaset ──
  { c: "Bir gün Gülsüm yine", img: "22" },
  { c: "Kocası mektup yerine", r: (t, a) => <Kaset t={t} a={a} line="Mektup yerine: ses." /> },
  { c: "Köyde pilli", img: "23" },
  { c: "Teybin düğmesine", r: (t, a) => <Kaset t={t} a={a} play line="“Gülsüm, beni duyuyor musun?”" />, sfx: "static" },
  { c: "O akşam odada", img: "23", g: 60 },
  { c: "Ve sesin söylediği", img: "24", g: 20, ov: [{ t: "quote", a: "Ben de sizi çok özledim.", d: 1.2 }] },
  { c: "1970'lerin sonunda kaset", r: (t, a) => <Doc t={t} a={a} head="1970'LERİN SONU" lines={["Kaset mektuplar:", "okuma bilmeyenler için bir köprü."]} stamp="SES" /> },
  { c: "Bir yorumda", img: "25" },
  { c: "Dede o kaseti", img: "25", ov: [{ t: "note", a: "dede dayanamayıp döndü", p: "tr" }] },
  // ── 5 · Sen ──
  { c: "Peki sen ne", img: "21" },
  { c: "yeni işçi alımını", r: (t, a) => <Doc t={t} a={a} head="23 KASIM 1973 · BONN" lines={["Almanya yeni işçi alımını durdurdu.", "Sonra: aile birleşimi."]} foot="Anwerbestopp · Federal Almanya Hükümeti kararı" />, yr: 1973 },
  { c: "Ondan sonraki yıllarda", img: "26", yr: 1979 },
  { c: "Senin köyünde de", img: "01" },
  { c: "On dört yaşında", img: "27", yr: 1981 },
  { c: "Ve Ankara'da ilk kez", img: "28" },
  { c: "Kalemi tutuyorsun", r: (t, a) => <Letter t={t} a={a} stamp="PTT" head="Ankara, 1981" lines={["Önce Allah'ın selamı.", "Şehir büyük.", "İyiyim."]} /> },
  { c: "Ve bir yerde duruyorsun", img: "28", ov: [{ t: "cap", a: "Annen de okuma bilmiyor." }] },
  { c: "Yazmak istediğin", r: (t, a) => <Silence t={t} a={a} text="Yazmıyorsun." />, g: 100 },
  { c: "Mektubu zarfa", img: "29" },
  { c: "Annen o kelimeyi", r: (t, a) => <Zarf t={t} a={a} /> },
  // ── 6 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir mektupta en çok neyi yazamazsın?" img="14" /> },
  { c: "En önemli şeyi", r: (t, a, b) => <Re img="13" t={t} a={a} b={b} d={0.4} />, html: (t, a) => <Txt t={t} at={a + 0.3} text="En önemli şeyi." size={96} y={420} /> },
  { c: "Mektubu bir köy", img: "23", ov: [{ t: "cap", a: "Bir köy yazıyor, bir köy okuyor." }] },
  { c: "7 Kasım", img: "30", yr: 2026, g: null, ov: [{ t: "date", a: "7 Kasım 2026", b: "Ankara" }] },
  { c: "Zehra telefonu", r: (t, a) => <VoiceMsg t={t} a={a} text="Babaanne, seni özledim." /> },
  { c: "Zehra gülümsüyor", img: "30", ov: [{ t: "quote", a: "Ben de seni çok özledim kuzum.", d: 0.8 }] },
  { c: "Elli yıl önce", r: (t, a) => <Counter t={t} a={a} from={50} to={2} suf=" saniye" head="50 YIL ÖNCE SÖYLENEMEYEN CÜMLE" sub="bugün: iki saniye" fmt={(n) => (n > 2.5 ? "∞" : String(Math.round(n)))} /> },
  { c: "Senin ailende", img: "13", ov: [{ t: "cap", a: "Senin ailende mektup okuyan biri var mıydı?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video07, seconds: K5_07_SECONDS } = makeK5({ id: "k5-07", words, shots: SHOTS, year: 1977, gauge: ["YAZILAN", "SÖYLENEMEYEN"], title: "Bir mektupta en çok neyi yazamazsın?" });
void Fig;
