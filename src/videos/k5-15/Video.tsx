import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-15-words.json";
import { FONT, HAND } from "../../theme";
import { Doc, Fig, K, LOOK, Question, Re, Scene, Shot, Silence, Split, Txt, Years, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-15 · "Köye Su Geldiği Gün" · ölçek: SUSUZ ↔ MUSLUK
const ZEYNEP = { ...LOOK.girl, body: "#C8453D", body2: "#9E342C", scarf: "#F4F1EA" };
const ANNE = { ...LOOK.mother, body: "#5E7F4E", body2: "#46603A", scarf: "#3E6B4E" };

// pınar yolu: güğüm ve testi
const Yol: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.2, a + 6);
  return (
    <Scene t={t} a={a} bg="#F2D9A8" floor="#D9B87A" label="Pınara: yarım saat. Dönüş: daha uzun.">
      <rect x={60} y={560} width={260} height={260} fill="#B98E5E" stroke="#7A5A3A" strokeWidth={6} />
      <g transform="translate(1680,700)"><rect x={-80} y={-40} width={160} height={120} fill="#A8A08E" stroke="#7A7464" strokeWidth={6} /><rect x={-10} y={-10} width={20} height={40} fill="#666" /><path d={`M0,30 Q4,${60 + Math.sin(t * 8) * 4} 0,80`} stroke="#4FA3D1" strokeWidth={8} fill="none" /></g>
      <path d="M320,820 Q960,760 1600,820" stroke="#B89A6A" strokeWidth={6} strokeDasharray="20 16" fill="none" />
      <Fig t={t} x={380 + 1100 * k} y={840} s={1.1} look={ANNE} walk={1} seed={1} hold={<g transform="translate(-40,-150)"><path d="M0,0 Q-30,40 0,80 L40,80 Q70,40 40,0 Z" fill="#B87333" stroke="#8A5524" strokeWidth={4} /></g>} />
      <Fig t={t} x={300 + 1100 * k} y={840} s={0.82} look={ZEYNEP} walk={1} seed={2} />
    </Scene>
  );
};

// güğüm ağırlığı
const Weight: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 0.3, a + 2);
  return (
    <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <svg width={420} height={520} viewBox="0 0 210 260" style={{ transform: `translateY(${k * 30}px)` }}>
        <path d="M70,40 Q20,120 40,220 L170,220 Q190,120 140,40 Z" fill="#B87333" stroke="#7A4A1E" strokeWidth={6} />
        <rect x={80} y={20} width={50} height={26} rx={6} fill="#8A5524" /><path d="M140,60 Q200,90 160,150" stroke="#7A4A1E" strokeWidth={8} fill="none" />
      </svg>
      <div style={{ fontSize: 120, fontWeight: 800, color: K.brick }}>{Math.round(15 + 5 * k)} kg</div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: K.ink }}>bir güğüm su · omuzda</div>
    </AbsoluteFill>
  );
};

// pınar başı = köyün gazetesi
const Gazete: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const h = ["Kim evleniyor?", "Kim hasta?", "Almanya'dan mektup!", "O kız beğenildi…"];
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ width: 1300, background: "#F7F1E3", padding: "40px 60px", boxShadow: shadow, transform: "rotate(-1.5deg)" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 800, textAlign: "center", borderBottom: "6px double #333", paddingBottom: 10 }}>PINAR BAŞI</div>
        <div style={{ textAlign: "center", fontSize: 30, color: "#666", margin: "10px 0 20px" }}>köyün her sabah çıkan gazetesi</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {h.map((x, i) => <div key={i} style={{ fontFamily: HAND, fontSize: 58, color: K.ink, opacity: ramp(t, a + 0.6 + i * 0.8, a + 1 + i * 0.8), borderLeft: `8px solid ${K.brick}`, paddingLeft: 20 }}>{x}</div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// bir damla bile boşa gitmez
const Damla: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const s = [["yüz yıkama suyu", "→ fasulyeye"], ["bulaşık suyu", "→ tavuklara"], ["çamaşır", "→ derede, tokaçla"]];
  return (
    <AbsoluteFill style={{ background: "#1E3A4A", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <svg width={120} height={170} viewBox="0 0 60 85" style={{ marginBottom: 40, transform: `translateY(${Math.sin(t * 3) * 8}px)` }}><path d="M30,4 Q56,46 50,60 A21,21 0 0 1 10,60 Q4,46 30,4 Z" fill="#7FC4E8" /></svg>
      {s.map(([l, r], i) => {
        const k = ramp(t, a + 0.4 + i * 1.2, a + 0.9 + i * 1.2);
        return <div key={i} style={{ display: "flex", gap: 40, fontSize: 60, color: K.cream, marginTop: 16, opacity: k }}><span style={{ width: 520, textAlign: "right", fontWeight: 800 }}>{l}</span><span style={{ fontFamily: HAND, color: K.gold }}>{r}</span></div>;
      })}
    </AbsoluteFill>
  );
};

// yarım saat → bir dakika
const Minute: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = ramp(t, a + 1, a + 2.5);
  return (
    <AbsoluteFill style={{ background: K.cream, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 120, fontFamily: FONT }}>
      <div style={{ textAlign: "center", opacity: 1 - 0.6 * k }}><div style={{ fontSize: 150, fontWeight: 800, color: "#887", textDecoration: k > 0.5 ? "line-through" : undefined }}>30 dk</div><div style={{ fontFamily: HAND, fontSize: 56 }}>pınar yolu</div></div>
      <div style={{ fontSize: 120, color: K.brick }}>→</div>
      <div style={{ textAlign: "center", opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}><div style={{ fontSize: 180, fontWeight: 800, color: "#2E8B57" }}>1 dk</div><div style={{ fontFamily: HAND, fontSize: 56 }}>meydandaki musluk</div></div>
    </AbsoluteFill>
  );
};

// bir annenin hayatından saatler
const Hours: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.round(ramp(t, a + 0.3, a + 4) * 40);
  return (
    <AbsoluteFill style={{ background: "#14202A", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 120px)", gap: 14 }}>
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ height: 70, borderRadius: 10, background: i < n ? "#B87333" : "#22303C", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 24, color: K.cream, fontWeight: 700 }}>{i < n ? 1975 - 40 + i + 1 : ""}</div>)}
      </div>
      <div style={{ marginTop: 50, fontSize: 64, fontWeight: 800, color: K.gold }}>{n} yıl × her gün birkaç saat</div>
      <div style={{ fontFamily: HAND, fontSize: 60, color: K.cream, opacity: ramp(t, a + 4, a + 4.5) }}>= binlerce saat</div>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "17 Haziran", img: "01", yr: 1975, g: 10, ov: [{ t: "date", a: "17 Haziran 1975", b: "Konya · bir köy" }] },
  { c: "Senin adın Zeynep", img: "01", ov: [{ t: "tag", a: "ZEYNEP", b: "10 yaşında · sen" }] },
  { c: "Bir koç kesiliyor", img: "01" },
  { c: "Önce bir hırıltı", img: "02", sfx: "whoosh", g: 100 },
  { c: "Kadınlar ağlamaya", img: "03", ov: [{ t: "quote", a: "Ölmeden gördüm.", d: 2.5 }] },
  { c: "Bu videoda", img: "05" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir musluk, bir kadının hayatından kaç saat alır?" img="05" /> },
  { c: "Bu konu", r: (t, a) => <Silence t={t} a={a} text="“Evlere su ne zaman geldi?”" sub="yorumlarda sizin sorduğunuz soru" /> },
  // ── 2 · Susuz gün ──
  { c: "Önce bir gün", img: "04", g: 0 },
  { c: "Sabah beşte", img: "04", ov: [{ t: "note", a: "05:00", p: "tr" }] },
  { c: "Köyün suyu", r: (t, a) => <Yol t={t} a={a} /> },
  { c: "Ve bu yolu her gün", img: "05" },
  { c: "Bir güğüm su", r: (t, a) => <Weight t={t} a={a} /> },
  { c: "Pınarın başında", img: "06" },
  { c: "Çünkü pınar başında", r: (t, a) => <Gazete t={t} a={a} /> },
  { c: "Bir kız, pınar başında", img: "07" },
  { c: "Ama bunun bir bedeli", img: "08", ov: [{ t: "cap", a: "Evin su taşıyan elleri: kız çocukları." }] },
  { c: "Bir de pınar başında bir gelenek", img: "06", ov: [{ t: "note", a: "gelin, pınar başında karşılanır", p: "tr" }] },
  { c: "Sen de bir gün o kuyrukta", img: "07", ov: [{ t: "quote", a: "Burası her sabah böyle kalabalık mı?", d: 2.5 }] },
  { c: "Eve döndüğünüzde", img: "09" },
  { c: "Su, evin en değerli", r: (t, a) => <Damla t={t} a={a} /> },
  { c: "Bulaşık suyu", img: "10" },
  { c: "Kadınlar çamaşırı", img: "11" },
  { c: "Ve kış", img: "12", sfx: "whoosh" },
  { c: "Bazı sabahlar", img: "13" },
  { c: "Ve banyo", img: "14", ov: [{ t: "list", a: ["haftada bir", "kazanda ısıtılan su", "önce çocuklar"] }] },
  // ── 3 · Bütün ülke ──
  { c: "Şimdi bu tablonun", r: (t, a) => <Silence t={t} a={a} text="Bu, tek bir köyün hikâyesi değil." /> },
  { c: "1960'ların başında", r: (t, a) => <Doc t={t} a={a} head="1960'LARIN BAŞI · KÖYLER" lines={["Köylerin büyük kısmında", "içme suyu şebekesi yok.", "Su: pınardan, kuyudan, dereden."]} />, yr: 1960 },
  { c: "1965'te devlet", r: (t, a) => <Doc t={t} a={a} head="1965 · YSE" lines={["Yol Su Elektrik", "Genel Müdürlüğü", "köylere yol, su, elektrik"]} foot="Kaynak: 533 sayılı YSE Kuruluş Kanunu (1965)" stamp="T.C." />, yr: 1965 },
  { c: "YSE'nin adı", img: "16", ov: [{ t: "quote", a: "Bizim köye de su gelsin.", d: 2.5 }] },
  { c: "Ama sıra", r: (t, a) => <Split t={t} a={a} left={{ h: "OVADAKİ KÖY", v: ["kaynak yakın", "boru kolay"] }} right={{ h: "DAĞDAKİ KÖY", v: ["kaynak uzak", "kat kat zor"] }} /> },
  { c: "YSE'nin ekipleri", img: "15" },
  { c: "Bazı köylerde köylüler", img: "17", ov: [{ t: "note", a: "imece", p: "tr" }] },
  { c: "Ve senin köyüne", img: "01", yr: 1975, g: 100 },
  // ── 4 · Su geldi ──
  { c: "Şimdi meydana", img: "02" },
  { c: "İlk akşam", img: "18" },
  { c: "Bir dakika", r: (t, a) => <Minute t={t} a={a} /> },
  { c: "Ve o gün senin", img: "19", yr: 1976 },
  { c: "Ama bir şey de", img: "20", g: 70 },
  { c: "Annen bir gün", img: "20", ov: [{ t: "quote", a: "Su yakınlaştı. Ama insanlar biraz uzaklaştı.", d: 1.5 }] },
  { c: "Ama meydandaki çeşme", r: (t, a) => <Years t={t} a={a} items={[{ y: "1965", s: "YSE kuruldu" }, { y: "1975", s: "meydana çeşme" }, { y: "1990'lar", s: "eve musluk" }, { y: "2005", s: "KÖYDES" }]} upto={3} /> },
  { c: "2005'te devlet", r: (t, a) => <Doc t={t} a={a} head="2005 · KÖYDES" lines={["Köylerin altyapısını", "destekleme projesi"]} foot="Kaynak: Yüksek Planlama Kurulu, 2005" />, yr: 2005 },
  // ── 5 · Şehir ──
  { c: "Peki şehirler", r: (t, a) => <Silence t={t} a={a} text="Peki şehirler?" /> },
  { c: "1985", img: "21", yr: 1985, g: 30 },
  { c: "Mahallenin ortasında", img: "21" },
  { c: "Kocan akşamları", img: "22" },
  { c: "Sonra bir gün", img: "23", g: 85, sfx: "ding" },
  { c: "Ama İstanbul'un suyu", img: "24", yr: 1993, g: 40 },
  { c: "Ve 2007 yazında", img: "25", yr: 2007 },
  { c: "Yani su meselesi", r: (t, a) => <Years t={t} a={a} items={[{ y: "1965", s: "YSE" }, { y: "1975", s: "köy çeşmesi" }, { y: "1993", s: "İstanbul kesintileri" }, { y: "2007", s: "Ankara susuz" }]} /> },
  // ── 6 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Bir musluk, bir kadının hayatından kaç saat alır?" img="05" /> },
  { c: "Senin annen hayatı", r: (t, a) => <Hours t={t} a={a} /> },
  { c: "Ve o musluk geldiğinde", img: "19", g: 100 },
  { c: "7 Kasım", img: "26", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "İstanbul" }] },
  { c: "Zeynep sessizce", img: "26" },
  { c: "Torunu ona bakıyor", img: "27", ov: [{ t: "quote", a: "Ne oldu anneanne?", d: 0.2 }] },
  { c: "Zeynep gülümsüyor", r: (t, a, b) => <Re img="27" t={t} a={a} b={b} d={0.3} />, html: (t, a) => <Txt t={t} at={a + 1} text="“Bir zamanlar bu suyu omzumda taşıdım.”" size={66} y={430} /> },
  { c: "Torunu bir an", img: "26" },
  { c: "Senin köyüne", img: "06", ov: [{ t: "cap", a: "Senin köyüne su ne zaman geldi?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video15, seconds: K5_15_SECONDS } = makeK5({ id: "k5-15", words, shots: SHOTS, year: 1975, gauge: ["SUSUZ", "MUSLUK"], title: "Bir musluk kaç saat alır?" });
