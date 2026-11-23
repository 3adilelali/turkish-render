import React from "react";
import { T, X } from "../../components/Protokol";
import { rp, Person, HCam } from "../../components/Hayat";
import { Court, Legend, Label, Stamp } from "../../components/Karun";
import { LonelyKid, LifeCards, PxQuestion } from "../../components/SilkRoad";
import {
  DonutBox, Apartment, Fridge, Cards, Bus, Crt, Call, Network, PhoneHQ, Cell, Whistle, Wiretap, UsaMap, Spoof, Trace, RadioCar,
  Door202, FaceOff, Paper, FreeKevin, Stage, Senate, ScamCall, Betray, FakeIds, SourceCode,
  KEVIN, KEVIN_K, KEVIN_F, SHIMO, LEWIS, DICICCO, ERIC, BONNIE, GRANDPA, AGENT, CLERK,
} from "../../components/Mitnick";
import { Sh, K, ph, title, lab, AMB, RED, GRN, PINK, FBI, COLD } from "./h";

// k7-05 · Kevin Mitnick · لقطات مربوطة بكلام السكربت (المحرّك أساس، الصور الحرة للتعريف)
type P = { t: number; a: number; b: number };

// بورتريه (temsili)
const Hero: React.FC<P & { o?: typeof KEVIN; tag?: string; sub?: string; c?: string; mood?: "calm" | "fear" | "smile" | "smug" }> = ({ t, a, b, o = KEVIN, tag = "Kevin Mitnick", sub = "temsili çizim", c = GRN, mood = "calm" }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <circle cx={960} cy={480} r={520} fill={c} opacity={0.06} />
    <HCam t={t} a={a} b={b} z={[1.0, 1.08]}>
      <Person x={960} y={1200} s={1.75} t={t} o={o} mouth={mood === "smile" ? "smile" : mood === "smug" ? "tight" : mood === "fear" ? "o" : "flat"} eyes={mood === "fear" ? "wide" : mood === "smug" ? "half" : "open"} brow={mood === "fear" ? "worry" : mood === "smug" ? "angry" : "flat"} />
    </HCam>
    <Label x={80} y={960} k={rp(t, a + 0.4, a + 0.9)} a={tag} b={sub} c={c} />
  </g>
);
const H = (p: Omit<React.ComponentProps<typeof Hero>, "t" | "a" | "b"> = {}) => K(Hero, p);
const date = (d: string, place: string, bg = "#07090E") => title([{ s: d, c: AMB, size: 88 }, { s: place, c: "#C8D0DA", size: 46 }], { bg, step: 0.6 });
const KV = (cap = "Kevin Mitnick", sub = "gerçek fotoğraf · 2010") => lab(ph("kevin1", undefined, undefined, { z: [1.12, 1.24] }), cap, sub, GRN);
const KV2 = (cap = "Kevin Mitnick", sub = "gerçek fotoğraf") => lab(ph("kevin4", undefined, undefined, { z: [1.15, 1.28] }), cap, sub, GRN);

export const SHOTS: Sh[] = [
  // ── soğuk açılış · Eylül 1992 ──
  { c: ["Eylül 1992", "Eylül bin dokuz"], r: date("Eylül 1992", "Calabasas · Kaliforniya · ABD"), sfx: "px/boom" },
  { c: "Los Angeles", r: lab(ph("calabasas", undefined, undefined, { grade: "cool" }), "Calabasas", "Los Angeles'ın kuzeyi") },
  { c: "Federal ajanlar", r: K(Apartment, { raid: true, label: ["FBI", "Los Angeles ofisi"] }), sfx: "px/steps" },
  { c: "Arama emri", r: lab(K(Court, { kind: "ny" }), "Arama emri", "hazır") },
  { c: "İçerideki adamı", r: K(Wiretap, { rows: [["HEDEF · CALABASAS", "İZLENİYOR"], ["HEDEF · ARAMALAR", "KAYIT"], ["HEDEF · KONTAKLAR", "KAYIT"]], alert: 0 }) },
  { c: "Bu sefer kaçışı", r: K(Apartment, { raid: true, lit: [3] }) },
  { c: "Kapı açılıyor", r: K(Door202, { open: true, num: "14" }), sfx: "px/boom" },
  { c: "Ve daire boş", r: title([{ s: "Daire", size: 70 }, { s: "BOŞ.", c: RED, size: 130 }], { step: 0.5 }) },
  { c: "Yatak toplanmış", r: K(Fridge, { agent: true }) },
  { c: "Ama mutfakta", r: K(Fridge, { agent: true }) },
  { c: "Ajanlardan biri", r: K(Fridge, { open: true }), sfx: "px/riser" },
  { c: "Bir kutu donut", r: K(DonutBox, {}) },
  { c: "Ve kutunun üstünde", r: K(DonutBox, { note: "FBI DONUTS", sub: "“FBI donutları”" }), sfx: "px/boom3" },
  { c: "Onlar daha kapıya", r: title([{ s: "Onlar gelmeden", size: 70 }, { s: "o her şeyi biliyordu.", c: AMB, size: 80 }], { step: 0.9 }) },
  { c: ["Hangi gün", "Handigün"], r: K(LifeCards, { items: [["?", "hangi gün"], ["?", "kaç kişi"], ["?", "hangi saat"]] }) },
  { c: "Çünkü onların konuştuğu", r: K(Wiretap, {}), sfx: "px/keys" },
  { c: "Bu, Kevin Mitnick", r: KV("Kevin Mitnick", "ABD tarihinin en çok aranan bilgisayar korsanı") },
  { c: "Bu, onu yıllarca", r: K(Apartment, { raid: true, label: ["FBI", "iki buçuk yıllık av"] }) },
  { c: "Bu da, sonunda", r: H({ o: SHIMO, tag: "Tsutomu Shimomura", sub: "güvenlik uzmanı · temsili çizim", c: COLD }) },
  { c: "Kevin'in bir Noel", r: K(Crt, { lines: ["25.12.1994", "> bağlantı kuruldu", "> dosyalar kopyalanıyor..."], c: COLD }) },
  { c: "Peki nasıl", r: K(Call, { say: "Merhaba, teknik ekipten arıyorum.", reply: "Tabii, nasıl yardımcı olayım?" }) },
  { c: "En yakın arkadaşları", r: K(Betray, {}) },
  { c: "İki buçuk yıl", r: K(UsaMap, { route: ["Los Angeles", "Denver", "Seattle", "Raleigh"] }) },
  { c: "Ve bir hayalet", r: K(RadioCar, {}) },
  { c: "Hikâyeler birbirine", r: title([{ s: "Hikâyeler birbirine benzeyebilir.", size: 60 }, { s: "Ama hiçbiri bizim anlattığımız gibi değil.", c: AMB, size: 52 }], { step: 1.6 }), sfx: "px/riser" },
  { c: "Burası Protokol", r: title([{ s: "PROTOKOL X", c: GRN, size: 130 }], {}), sfx: "px/boom3" },
  { c: "Bilgisayardan önce", r: K(LifeCards, { items: [["1", "insanları nasıl kandırdı"], ["2", "nasıl kaçtı"], ["3", "kim onu yakaladı"]] }) },
  { c: "Bu dosya, inanması", r: title([{ s: "DOSYA: KEVIN MITNICK", c: GRN, size: 84 }, { s: "inanması zor bir dosya", c: "#C8D0DA", size: 46 }]) },
  { c: "Bu videoyu izleyenlerin", r: title([{ s: "İzleyenlerin çoğu", size: 64 }, { s: "abone değil.", c: AMB, size: 84 }]) },
  { c: "Uzatmadan, dosya", r: title([{ s: "DOSYA AÇILIYOR", c: GRN, size: 110 }]), sfx: "px/boom" },

  // ── çocukluk ──
  { c: ["6 Ağustos 1963", "Altı Ağustos"], r: date("6 Ağustos 1963", "Los Angeles · Van Nuys"), sfx: "px/tick" },
  { c: ["Kevin daha üç", "Kevin daha 3"], r: K(LonelyKid, {}) },
  { c: "Baba gidiyor", r: title([{ s: "Baba", size: 70 }, { s: "gidiyor.", c: "#7D8796", size: 80 }], { step: 0.6 }) },
  { c: "Annesi garsonluk", r: K(LifeCards, { items: [["☕", "garsonluk"], ["⇄", "sürekli taşınma"], ["…", "yalnız bir çocuk"]] }) },
  { c: "Kevin büyük ölçüde", r: K(LonelyKid, { school: true }) },
  { c: "Anlatılanlara göre o yıllarda", r: K(Cards, { old: true, label: ["Anlatılanlara göre", "kumarhane hilelerini bilen yaşlı adam"] }) },
  { c: "Gençliğinde kumarhanelerde", r: K(Cards, { old: true }) },
  { c: ["Kevin'e iskambil", "Kevin'a iskambil"], r: K(Cards, {}) },
  { c: "Bir kartı avucunda", r: K(Cards, { vanish: true }), sfx: "px/whoosh" },
  { c: "Ve Kevin bu işe", r: H({ o: KEVIN_K, tag: "Kevin", sub: "çocuk sihirbaz · temsili çizim", mood: "smile" }) },
  { c: "Okulda kimseyle", r: K(LonelyKid, { school: true }) },
  { c: "Daha on yaşına", r: K(Cards, { vanish: true }), sfx: "px/whoosh" },
  { c: "Ve sihirbazlıktan", r: title([{ s: "Kartlar değil.", size: 70 }, { s: "İNSANLAR.", c: AMB, size: 120 }], { step: 0.9 }) },
  { c: "İnsanlar gördüklerine", r: title([{ s: "İnsanlar gördüklerine inanır.", size: 62 }, { s: "Ne göstereceğini sen seçersen…", c: "#C8D0DA", size: 50 }], { step: 1.4 }) },

  // ── otobüs bileti ──
  { c: "On iki yaşında", r: K(Bus, {}) },
  { c: "Los Angeles otobüslerinde", r: K(Bus, { punch: true }) },
  { c: "Şoför bileti", r: K(Bus, { punch: true }), sfx: "px/click" },
  { c: "Kevin bir gün", r: K(Bus, { ask: true }) },
  { c: "Şoför de gülümseyip", r: K(Bus, { ask: true }) },
  { c: "Kevin zımbayı", r: K(Bus, { punch: true }), sfx: "px/click" },
  { c: "Ve bütün şehri", r: title([{ s: "Bütün şehir", size: 70 }, { s: "BEDAVA.", c: GRN, size: 120 }], { step: 0.6 }) },
  { c: "Para değil", r: title([{ s: "Bir yetişkin, bir çocuğa,", size: 60 }, { s: "sadece sorulduğu için", c: AMB, size: 64 }, { s: "her şeyi anlattı.", size: 60 }], { step: 1 }) },
  { c: "Bugün buna bir isim", r: title([{ s: "SOSYAL", c: COLD, size: 110 }, { s: "MÜHENDİSLİK", c: COLD, size: 110 }], { step: 0.5 }), sfx: "px/boom" },
  { c: "Bir sisteme girmek", r: K(Spoof, {}) },
  { c: "Kevin bu ismi", r: H({ o: KEVIN_K, tag: "Kevin", sub: "12 yaşında · temsili çizim", mood: "smug" }) },

  // ── bilgisayar ve telefon ──
  { c: ["On beş yaşında", "15 yaşında"], r: date("1978", "Okulun bodrum katı"), sfx: "px/tick" },
  { c: "O yıllarda bilgisayar", r: lab(ph("vax1", undefined, undefined, { grade: "cool" }), "1970'lerin bilgisayarları", "oda büyüklüğünde makineler") },
  { c: "Yeşil yazılı", r: K(Crt, { lines: ["LOGIN:", "> HELLO", "> RUN", "READY."] }), sfx: "px/keys" },
  { c: "Kevin o odadan", r: K(Crt, { lines: ["> 01:12", "> 03:40", "> 06:15 ..."] }) },
  { c: "Annesi akşam", r: title([{ s: "Günde", size: 60 }, { s: "13 SAAT", c: GRN, size: 120 }, { s: "anlatılanlara göre", c: "#7D8796", size: 34 }], { step: 0.7 }) },
  { c: "Ama Kevin'in asıl", r: K(Network, {}) },
  { c: "O yıllarda telefon", r: K(Network, { label: "Dünyanın en büyük makinesi" }) },
  { c: "Ve Kevin o makinenin", r: K(Network, { hi: true }), sfx: "px/riser" },
  { c: "Telefon şirketlerini", r: K(Call, { left: KEVIN_K, say: "Hattı kontrol ediyorum, bir numara lazım." }) },
  { c: "Kendini çalışan", r: K(Call, { left: KEVIN_K, say: "Ben de ekiptenim, santralden arıyorum." }) },
  { c: "Teknik terimleri", r: K(Call, { left: KEVIN_K, say: "Hat kodunu teyit edelim.", reply: "Tabii, hemen bakıyorum." }) },
  { c: "Karşıdaki memur", r: K(Call, { left: KEVIN_K, reply: "Buyrun, kodu okuyorum…" }) },
  { c: "Kevin hiçbir zaman", r: title([{ s: "Hiç zorla girmedi.", size: 66 }, { s: "Kapıyı hep içerideki biri açtı.", c: AMB, size: 56 }], { step: 1.2 }) },

  // ── Lewis ──
  { c: "Bu yıllarda tek", r: H({ o: LEWIS, tag: "Lewis De Payne", sub: "en yakın arkadaşı · temsili çizim", c: X.amber }) },
  { c: "İkisi birlikte", r: K(Network, { hi: true, label: "Gece boyunca şebekenin içinde" }) },
  { c: ["Ve Kevin, on yedi", "Ve Kevin, 17"], r: K(Crt, { sil: "CONDOR" }) },

  // ── Pacific Bell ──
  { c: ["1981", "Bin dokuz yüz seksen bir"], r: date("1981", "Kevin 17 yaşında"), sfx: "px/boom" },
  { c: "Anlatılanlara göre her şey", r: K(PhoneHQ, { label: ["Anlatılanlara göre", "bir şantiyede başladı"] }) },
  { c: "Kevin bir gün Pacific", r: H({ o: KEVIN_K, tag: "Kevin", sub: "17 yaşında · temsili çizim", mood: "fear" }) },
  { c: "Oradaki çalışanlar", r: title([{ s: "Ona gülüyorlar.", size: 70 }], {}) },
  { c: "Kevin hiçbir şey", r: title([{ s: "“Size söz,", size: 64 }, { s: "bunu unutmayacaksınız.”", c: AMB, size: 70 }], { step: 1 }) },
  { c: "Ve gerçekten de bir gece", r: K(PhoneHQ, { enter: true, label: ["Pacific Bell", "Los Angeles merkez binası · temsili"] }), sfx: "px/steps" },
  { c: "Bilgisayar sistemi", r: K(PhoneHQ, { docs: true }) },
  { c: "Şirketin bütün", r: K(Network, { hi: true, label: "Santralin haritası artık bir gencin elinde" }) },
  { c: "Anlatılanlara göre olayın", r: K(Legend, { items: ["Bir yönetici", "Birkaç çalışan", "İşini kaybetti"] }) },
  { c: "Ve o yöneticinin", r: K(DonutBox, { bg: "#14100C" }) },
  { c: "Üstünde bir not", r: K(DonutBox, { note: "Sözümü tuttum.", bg: "#14100C" }), sfx: "px/boom3" },
  { c: ["Donut kutusu. Bu", "Donat kutusu. Bu"], r: title([{ s: "Bu kutuyu", size: 64 }, { s: "çok göreceksin.", c: PINK, size: 84 }], { step: 0.8 }) },

  // ── ilk yakalanma ──
  { c: "Ama Kevin'in bir hatası", r: title([{ s: "İnsanları kandırmayı biliyordu.", size: 58 }, { s: "Kime güveneceğini bilmiyordu.", c: RED, size: 58 }], { step: 1.4 }) },
  { c: ["Belgeleri çaldıkları", "Balgeleri çaldıkları"], r: K(Betray, { who: ERIC, name: "Gruptan biri", to: "POLİS" }) },
  { c: "Kevin yakalanıyor", r: K(Cell, { who: KEVIN_K }), sfx: "px/boom" },
  { c: "Reşit olmadığı", r: K(Court, { kind: "ny", verdict: "GÖZETİMLİ SERBESTLİK", label: ["1981", "çocuk mahkemesi"] }) },
  { c: "Ama hapishanede", r: K(Cell, { who: KEVIN_K }) },
  { c: "Telefon şirketini soyan", r: H({ o: KEVIN_K, tag: "“Telefon şirketini soyan çocuk”", sub: "temsili çizim", mood: "smug" }) },
  { c: "Kevin ilk kez", r: title([{ s: "İlk kez", size: 64 }, { s: "bir efsane gibi.", c: AMB, size: 84 }], { step: 0.7 }) },
  { c: "Ve o hep aynı", r: K(DonutBox, { bg: "#0A0C10" }) },
  { c: ["Bir kutu donut. Seni", "Bir kutu donat. Seni"], r: K(DonutBox, { note: "Seni unutmadım.", bg: "#0A0C10" }), sfx: "px/boom3" },

  // ── Bonnie ──
  { c: "Kevin büyüyor", r: H({ o: BONNIE, tag: "Bonnie", sub: "eşi · temsili çizim", c: PINK, mood: "smile" }) },
  { c: "Kevin ilk kez normal", r: H({ o: KEVIN, tag: "Kevin Mitnick", sub: "normal bir hayat denemesi · temsili", mood: "calm" }) },
  { c: "Ama ekran onu", r: K(Crt, { lines: ["> 02:47", "> bağlanılıyor..."] }) },
  { c: "Anlatılanlara göre bir gece", r: title([{ s: "Bir gece", size: 64 }, { s: "garip bir rüya.", c: "#B8A0FF", size: 84 }, { s: "anlatılanlara göre", c: "#7D8796", size: 34 }], { step: 0.8 }) },
  { c: "Uyanıyor ve", r: K(Crt, { lines: ["> son girişler:", "> BİLİNMEYEN KULLANICI", "> BİLİNMEYEN KULLANICI"], c: X.red }), sfx: "px/tick" },
  { c: "O andan sonra", r: title([{ s: "Avlanan değil,", size: 66 }, { s: "AVCI.", c: RED, size: 130 }], { step: 0.8 }), sfx: "px/boom" },

  // ── DEC ──
  { c: "Ve hedefini", r: lab(ph("vax2", undefined, undefined, { grade: "cool" }), "Digital Equipment Corporation (DEC)", "dönemin dev bilgisayar şirketi · temsili model") },
  { c: "O yılların dev", r: lab(ph("vax1", undefined, undefined, { grade: "cool", z: [1.2, 1.08] }), "DEC", "işletim sistemi kaynak kodu") },
  { c: ["Kevin'in istediği", "Kevin'ın istediği"], r: K(SourceCode, { cos: ["DEC", "KAYNAK KODU"] }) },
  { c: "Ve bu işte yanında", r: H({ o: DICICCO, tag: "Lenny DiCicco", sub: "ortağı · temsili çizim", c: X.amber }) },
  { c: "İkisi aylarca", r: K(Crt, { lines: ["> DEC ağı", "> parça 1/40 indiriliyor", "> parça 2/40 indiriliyor"] }), sfx: "px/keys" },
  { c: "Her şey yolunda", r: K(Crt, { lines: ["> parça 38/40", "> parça 39/40"] }) },
  { c: "Kevin, DiCicco'nun", r: title([{ s: "Bir şaka.", size: 70 }, { s: "Affedilmeyen bir şaka.", c: RED, size: 64 }], { step: 0.8 }) },
  { c: "Bir gün sessizce", r: K(Betray, {}), sfx: "px/tick" },
  { c: ["Aralık 1988", "Aralık bin dokuz"], r: date("Aralık 1988", "Bir otopark"), sfx: "px/boom" },
  { c: "En yakın ortağı", r: title([{ s: "En yakın ortağı,", size: 64 }, { s: "onu kendi eliyle teslim etti.", c: RED, size: 60 }], { step: 1 }) },

  // ── ıslık ──
  { c: "Ve şimdi bu hikâyenin", r: K(Court, { kind: "ny", label: ["1988", "Los Angeles federal mahkemesi"] }) },
  { c: "Bu adamın elinde", r: K(Whistle, {}), sfx: "px/riser" },
  { c: "Bu cümle gerçekten", r: title([{ s: "Bu cümle", size: 64 }, { s: "GERÇEKTEN söylendi.", c: AMB, size: 84 }], { step: 0.8 }) },
  { c: "Kevin, bir telefona", r: K(Cell, { days: 240 }), sfx: "px/boom" },
  { c: "Sekiz ay", r: K(Cell, { days: 240 }) },
  { c: "Bir insanın sesine", r: title([{ s: "Bir insanın sesinden", size: 62 }, { s: "bu kadar korkulan", c: AMB, size: 70 }, { s: "başka bir dosya yok.", size: 56 }], { step: 0.9 }) },
  { c: "Mahkeme kararını", r: K(Court, { kind: "ny", verdict: "1 YIL + 3 YIL GÖZETİM" }), sfx: "px/boom3" },
  { c: ["Bonnie artık", "Bunny artık"], r: H({ o: BONNIE, tag: "Bonnie", sub: "temsili çizim", c: PINK, mood: "calm" }) },
  { c: ["Bonnie, o yalnız", "Bunny o yalnız"], r: K(FaceOff, { l: BONNIE, r: LEWIS, ln: "BONNIE", rn: "LEWIS" }) },
  { c: "Bir arkadaş onu", r: title([{ s: "Bir arkadaş onu FBI'a sattı.", size: 58 }, { s: "Diğeri hayatını aldı.", c: RED, size: 64 }], { step: 1.2 }) },

  // ── Eric ──
  { c: ["1992. Kevin", "1992 Kevin"], r: date("1992", "Gözetimin son ayları"), sfx: "px/tick" },
  { c: "Bir dedektiflik", r: H({ o: KEVIN, tag: "Kevin Mitnick", sub: "dedektiflik bürosunda · temsili" }) },
  { c: "Kendine Eric diyen", r: K(Crt, { sil: "ERIC" }), sfx: "px/riser" },
  { c: "Eric, telefon sistemlerinden", r: K(Call, { left: ERIC, right: KEVIN, tag: "KEVIN", say: "Sana bir şey göstermem lazım.", reply: "Neymiş?" }) },
  { c: "Kevin'in ilgisini", r: K(Crt, { sil: "ERIC" }) },
  { c: "Ama bir garip", r: K(LifeCards, { items: [["✕", "telefon numarası yok"], ["✕", "ev adresi yok"], ["→", "hep o arıyor"]] }) },
  { c: "Kevin şüpheleniyor", r: H({ o: KEVIN, tag: "Kevin", sub: "temsili çizim", mood: "smug" }) },
  { c: "Eric'in geldiği", r: K(Trace, { hops: ["ERIC", "HAT 1", "HAT 2", "SAHİBİ ?"] }) },
  { c: "Ve gerçek ortaya", r: K(Crt, { lines: ["> ERIC = Justin Petersen", "> durum: FBI muhbiri"], c: X.red }), sfx: "px/boom" },
  { c: "Kendisi de yakalanmış", r: H({ o: ERIC, tag: "Justin Petersen", sub: "“Eric” · temsili çizim", c: X.red }) },
  { c: "Ve cezasından", r: title([{ s: "FBI ile", size: 64 }, { s: "ANLAŞMA", c: FBI, size: 120 }], { step: 0.6 }) },
  { c: "Görevi tek bir", r: title([{ s: "Görevi:", size: 60 }, { s: "Kevin Mitnick'i bir suçun içine çekmek.", c: RED, size: 54 }], { step: 0.8 }) },
  { c: "Ama Kevin daha da", r: K(Wiretap, {}), sfx: "px/keys" },
  { c: "Kimin kimi", r: K(Wiretap, { alert: 1 }) },
  { c: "Ve bir gün hatlarda", r: K(Wiretap, { alert: 2 }), sfx: "px/tick" },
  { c: "Bir arama emri", r: title([{ s: "Bir arama emri.", size: 70 }, { s: "Onun için.", c: RED, size: 100 }], { step: 0.8 }), sfx: "px/boom" },

  // ── donut hamlesi ──
  { c: "Ve bu noktada", r: H({ o: KEVIN, tag: "Kevin Mitnick", sub: "temsili çizim", mood: "smug" }) },
  { c: "Kaçmadan önce", r: K(DonutBox, {}) },
  { c: "Eve dönüyor", r: K(Fridge, { agent: false }) },
  { c: "Kutuyu buzdolabına", r: K(Fridge, { agent: false, open: true }) },
  { c: "Üstüne yazıyor", r: K(DonutBox, { note: "FBI DONUTS" }), sfx: "px/boom3" },
  { c: "Ertesi sabah", r: K(Apartment, { raid: true }), sfx: "px/steps" },
  { c: "Ve anlatılanlara göre o kutunun", r: K(Fridge, { open: true }) },
  { c: "Kevin onlara", r: title([{ s: "“Sizi gördüm.", size: 70 }, { s: "Hep görüyordum.”", c: AMB, size: 84 }], { step: 1 }) },
  { c: ["Kasım 1992", "Kasım bin dokuz"], r: date("Kasım 1992", "Tutuklama kararı"), sfx: "px/boom" },
  { c: "Ve Kevin Mitnick yok", r: title([{ s: "Kevin Mitnick", size: 70 }, { s: "YOK OLUYOR.", c: RED, size: 110 }], { step: 0.6 }), sfx: "px/whoosh" },

  // ── kaçak ──
  { c: "Bundan sonraki", r: K(UsaMap, { pins: ["Los Angeles"], yr: "1992–1995" }) },
  { c: "Sahte isimler", r: K(FakeIds, {}) },
  { c: "Bir şehirde birkaç", r: K(UsaMap, { route: ["Los Angeles", "Denver"], yr: "1993" }) },
  { c: "Denver'da bir hukuk", r: lab(ph("denver1", undefined, undefined, {}), "Denver", "başka bir adla, bir hukuk bürosunda") },
  { c: "Kimse yanında", r: H({ o: KEVIN_F, tag: "“Eric Weiss”", sub: "sahte kimlikle · temsili çizim" }) },
  { c: "Temmuz 1994'te", r: K(Paper, { head: "Siber uzayın en çok arananı", date: "TEMMUZ 1994", sub: "ön sayfa" }), sfx: "px/boom" },
  { c: "Artık Kevin sadece", r: K(Paper, { head: "Siber uzayın en çok arananı", date: "TEMMUZ 1994" }) },
  { c: "Yüzü yok", r: title([{ s: "Yüzü yok.", size: 70 }, { s: "Adresi yok.", size: 70 }, { s: "Sadece bir efsane.", c: AMB, size: 70 }], { step: 0.7 }) },
  { c: "Ve kaçarken de", r: K(SourceCode, {}) },
  { c: "Motorola", r: K(SourceCode, {}), sfx: "px/keys" },
  { c: "Peki neden", r: title([{ s: "Satmıyor.", size: 70 }, { s: "Kimseye vermiyor.", size: 70 }, { s: "Sadece kanıtlamak için.", c: AMB, size: 64 }], { step: 0.8 }) },
  { c: "Ve bu kodlar", r: K(Network, { hi: true, label: "Telefonlar nasıl izlenir… ve nasıl izlenmez" }) },

  // ── Şili ──
  { c: ["Anlatılanlara göre bu yıllarda", "Anlatılanlara göre bu yollarda"], r: H({ o: LEWIS, tag: "Lewis", sub: "anlatılanlara göre · temsili", c: X.amber }) },
  { c: "Ona bir iş", r: K(LifeCards, { items: [["✈", "Şili"], ["💽", "bir sabit disk"], ["$", "büyük para vaadi"]] }) },
  { c: "Ama Kevin artık", r: K(Call, { left: KEVIN_F, right: AGENT, tag: "YETKİLİ", say: "Ben ajanım, dosyayı soruyorum.", reply: "O iş bir tuzak." }) },
  { c: "Kevin kaçıyor", r: title([{ s: "Bu iş", size: 64 }, { s: "BİR TUZAK.", c: RED, size: 110 }], { step: 0.6 }), sfx: "px/boom" },

  // ── Seattle ──
  { c: ["1994. Kevin", "1994 Kevin"], r: lab(ph("seattle1", undefined, undefined, { grade: "cool" }), "Seattle", "1994") },
  { c: "Bir gün evine", r: K(UsaMap, { route: ["Los Angeles", "Denver", "Seattle"], hi: "Seattle", yr: "1994" }), sfx: "px/steps" },
  { c: "Telefon dolandırıcılığı", r: title([{ s: "Aradıklarının kim olduğunu", size: 58 }, { s: "bilmiyorlar.", c: AMB, size: 80 }], { step: 1 }) },
  { c: "Kevin bir kez daha", r: K(UsaMap, { route: ["Seattle", "Raleigh"], yr: "1994" }), sfx: "px/whoosh" },

  // ── Shimomura ──
  { c: "Ve sonra, hikâyenin", r: title([{ s: "Hikâyenin", size: 64 }, { s: "EN BÜYÜK HATASI", c: RED, size: 100 }], { step: 0.6 }), sfx: "px/riser" },
  { c: ["25 Aralık 1994", "Yirmi beş Aralık"], r: date("25 Aralık 1994", "Noel günü · San Diego"), sfx: "px/boom" },
  { c: ["Tsutomu Shimomura", "Tutomu Shimamura", "San Diego"], r: H({ o: SHIMO, tag: "Tsutomu Shimomura", sub: "fizikçi ve güvenlik uzmanı · temsili", c: COLD }) },
  { c: "Amerika'nın en iyi", r: H({ o: SHIMO, tag: "Shimomura", sub: "devlet kurumlarına danışman", c: COLD, mood: "smug" }) },
  { c: "O gün tatildedir", r: K(Crt, { lines: ["SAN DIEGO", "> sahibi: tatilde", "> sistem: açık"], c: COLD }) },
  { c: "Yöntem, o güne", r: K(Spoof, {}) },
  { c: "Kapıdaki görevliye", r: K(Call, { left: ERIC, right: CLERK, tag: "KAPIDAKİ GÖREVLİ", say: "Benim, içeriden.", reply: "Buyur, geç." }) },
  { c: "Kapı açılıyor", r: K(Crt, { lines: ["> güvenilen bağlantı kabul edildi", "> /home/tsutomu kopyalanıyor..."], c: X.red }), sfx: "px/keys" },
  { c: "Shimomura döndüğünde", r: H({ o: SHIMO, tag: "Shimomura", sub: "temsili çizim", c: COLD, mood: "fear" }) },
  { c: "Birkaç gün sonra", r: K(Crt, { lines: ["TELESEKRETER", "> 1 yeni mesaj", "> alaycı bir ses..."], c: X.amber }), sfx: "px/tick" },
  { c: "Ve Shimomura bir karar", r: title([{ s: "“Bu adamı", size: 70 }, { s: "ben bulacağım.”", c: COLD, size: 90 }], { step: 0.8 }), sfx: "px/boom" },
  { c: "Şimdi iki hayalet", r: K(FaceOff, {}) },

  // ── iz sürme ──
  { c: "Shimomura işe", r: K(Trace, { upto: 1 }) },
  { c: "Ve o yeri izlemeye", r: K(Crt, { lines: ["> izleme açık", "> kim giriyor?", "> nereden?"], c: COLD }) },
  { c: "İzler onu internet", r: K(Trace, { upto: 3 }) },
  { c: "Her bağlantı", r: K(Trace, { upto: 4 }) },
  { c: ["Ocak 1995'in", "Ocak 1995"], r: date("Ocak 1995", "San Francisco yakınları"), sfx: "px/tick" },
  { c: "San Francisco yakınlarında", r: K(Crt, { lines: ["THE WELL", "> eski bir internet topluluğu", "> sunucu: Sausalito"], c: COLD }) },
  { c: "Kimsenin yüklemediği", r: K(Crt, { lines: ["THE WELL · sunucu", "> bilinmeyen dosyalar: 158 MB", "> ad: tsutomu..."], c: COLD }) },
  { c: "Ve içlerinden birinin", r: title([{ s: "Dosyanın adı:", size: 60 }, { s: "SHIMOMURA", c: COLD, size: 110 }], { step: 0.6 }), sfx: "px/boom" },
  { c: "Kevin, çaldığı", r: title([{ s: "Çaldığını", size: 64 }, { s: "başkalarının sunucusunda", c: AMB, size: 70 }, { s: "saklıyordu.", size: 64 }], { step: 0.8 }) },
  { c: "Shimomura ekibiyle", r: K(Crt, { lines: ["> izleniyor...", "> bekleniyor..."], c: COLD }) },
  { c: "Ve hırsız geliyor", r: K(Crt, { lines: ["> bağlantı: ?", "> yazıyor: ls", "> yazıyor: cd ..."], c: X.red }), sfx: "px/keys" },
  { c: "Ama nereden", r: K(Trace, { hops: ["THE WELL", "?", "?", "?"], upto: 2 }) },
  { c: "Shimomura her hattı", r: K(Trace, { upto: 4 }) },
  { c: "Anlatılanlara göre bu süreçte", r: K(Paper, { head: "Aranıyor: Kevin Mitnick", date: "1995", sub: "gazeteler ve ekranlar" }) },
  { c: "Ve Kevin bir süre", r: K(UsaMap, { pins: ["Seattle", "Denver", "Raleigh"], yr: "1995" }) },
  { c: "Ama ipin ucu", r: K(Trace, {}), sfx: "px/boom" },

  // ── Raleigh ──
  { c: ["Şubat 1995", "Şubat bin dokuz"], r: lab(ph("raleigh1", undefined, undefined, { grade: "cool" }), "Raleigh · Kuzey Karolina", "Şubat 1995") },
  { c: "Ellerinde özel", r: K(RadioCar, { strength: [0.1, 0.4] }) },
  { c: "Bir arabanın", r: K(RadioCar, { strength: [0.3, 0.6] }), sfx: "px/pulse" },
  { c: "Sinyal güçleniyor", r: K(RadioCar, { strength: [0.5, 0.75] }) },
  { c: "Ve sonunda", r: K(RadioCar, { strength: [0.75, 1] }), sfx: "px/riser" },
  { c: ["15 Şubat 1995", "On beş Şubat"], r: date("15 Şubat 1995", "Raleigh · gece yarısı"), sfx: "px/boom" },
  { c: "Ajanlar 202", r: K(Door202, {}) },
  { c: "Kevin kapıyı", r: K(Door202, { open: true }), sfx: "px/boom3" },
  { c: "İçeride bir bilgisayar", r: K(FakeIds, {}) },
  { c: "Kevin Mitnick, Amerika", r: K(Door202, { open: true, cuffs: true }), sfx: "px/boom" },
  { c: "Anlatılanlara göre o gece", r: K(DonutBox, {}) },
  { c: "Üstünde tek bir not: Shimomura", r: K(DonutBox, { note: "Shimomura'dan hediye." }), sfx: "px/boom3" },
  { c: "Kapıda Kevin", r: K(FaceOff, {}) },
  { c: "Yıllardır ekranın", r: K(FaceOff, { l: KEVIN_F, r: SHIMO }) },
  { c: "Sana saygı duyuyorum", r: title([{ s: "“Sana", size: 70 }, { s: "saygı duyuyorum.”", c: COLD, size: 90 }], { step: 0.6 }) },
  { c: "Ve hikâyenin en ince", r: title([{ s: "Onu yakalayan", size: 64 }, { s: "daha iyi bir hacker değildi.", c: "#7D8796", size: 54 }], { step: 1 }) },
  { c: ["Kevin'i yakalayan, kendi", "Kevin'ı yakalayan kendi"], r: title([{ s: "Kendi", size: 70 }, { s: "KİBRİ.", c: RED, size: 140 }], { step: 0.5 }), sfx: "px/boom" },
  { c: "Avcıya meydan", r: K(FaceOff, {}) },

  // ── dava ──
  { c: "Bundan sonrası", r: K(Court, { kind: "ny", label: ["1995–1999", "Amerika'yı ikiye bölen dava"] }) },
  { c: "Kevin dört buçuk", r: K(Cell, { days: 1600, lbl: "KEFALETSİZ · DURUŞMASIZ" }) },
  { c: "Dışarıda gençler", r: K(FreeKevin, {}) },
  { c: "Bazıları için", r: K(Legend, { items: ["Suçlu?", "Sistemin korkusundan yaratılmış bir canavar?"] }) },
  { c: ["1999'da Kevin", "1999 da Kevin"], r: K(Court, { kind: "ny", verdict: "SUÇ KABULÜ", label: ["1999", "anlaşma"] }), sfx: "px/boom3" },
  { c: ["21 Ocak 2000", "Yirmi bir Ocak"], r: date("21 Ocak 2000", "Beş yıl sonra kapıdan çıkıyor"), sfx: "px/boom" },
  { c: ["Üç yıl boyunca", "3 yıl boyunca"], r: K(LifeCards, { items: [["✕", "bilgisayar"], ["✕", "cep telefonu"], ["✕", "internet"]] }) },
  { c: "Dünyanın en iyi", r: title([{ s: "Dünyanın en iyi hacker'ı", size: 60 }, { s: "bir telefonla bile konuşamıyor.", c: AMB, size: 56 }], { step: 1 }) },
  { c: "Bu arada Shimomura", r: K(Paper, { head: "Yakalanma: bir kitap, bir film", date: "1996–2000" }) },
  { c: "Kevin içeriden", r: H({ o: KEVIN_F, tag: "Kevin", sub: "“çoğu abartı ya da yanlış”", mood: "smug" }) },
  { c: "Serbest kaldıktan", r: K(Senate, {}) },
  { c: "Amerikan Senatosu", r: K(Senate, {}) },
  { c: "Ve söylediği cümle", r: title([{ s: "En zayıf halka", size: 64 }, { s: "teknoloji değil.", c: "#7D8796", size: 60 }, { s: "İNSAN.", c: COLD, size: 130 }], { step: 0.9 }), sfx: "px/boom" },
  { c: "Bir sistemin en zayıf", r: K(Stage, {}) },

  // ── yeni hayat ──
  { c: "Ve sonra Kevin", r: KV2("Kevin Mitnick", "güvenlik danışmanı · gerçek fotoğraf") },
  { c: "Kendi güvenlik", r: KV("Kevin Mitnick", "Campus Party · Meksika · 2010") },
  { c: "Aldatma Sanatı", r: K(LifeCards, { items: [["📕", "Aldatma Sanatı · 2002"], ["📗", "Kablolardaki Hayalet · 2011"]] }) },
  { c: "Dünyanın dört", r: K(Stage, {}) },
  { c: "Yasal olarak", r: K(Stage, { screen: "YASAL GÜVENLİK TESTİ" }) },
  { c: ["16 Temmuz 2023", "On altı Temmuz"], r: date("16 Temmuz 2023", "Kevin Mitnick · 59 yaşında"), sfx: "px/boom" },
  { c: "Eşi o sırada", r: KV2("Kevin Mitnick", "1963–2023") },
  { c: "Bir zamanlar en çok", r: title([{ s: "En çok aranan adam,", size: 64 }, { s: "en çok tanınan güvenlik uzmanı.", c: COLD, size: 58 }], { step: 1.2 }) },

  // ── bugün · Türkiye ──
  { c: "Ve bugün, Kevin", r: K(Call, { left: ERIC, right: CLERK, tag: "BUGÜN · BİR ŞİRKET", say: "Bilgi işlemden arıyorum, şifreniz lazım." }) },
  { c: "Bugün, büyük şirketlere", r: K(Network, { hi: true, label: "Bugün: saldırıların çoğu bir insanla başlıyor" }) },
  { c: "Bir telefon, bir", r: K(LifeCards, { items: [["☎", "bir telefon"], ["✉", "bir mesaj"], ["🔊", "inandırıcı bir ses"]] }) },
  { c: "Bizim burada", r: K(ScamCall, {}), sfx: "px/tick" },
  { c: ["Kevin'in on iki", "Kevin'ın 12"], r: K(Bus, { ask: true }) },
  { c: "O yüzden bu dosyadan", r: K(ScamCall, {}) },
  { c: "Telefonda kim", r: title([{ s: "Şifre, kod, para isteyen ses:", size: 56 }, { s: "KAPAT.", c: RED, size: 120 }, { s: "Kurumu kendin ara.", c: AMB, size: 56 }], { step: 0.8 }), sfx: "px/boom" },
  { c: "Kevin Mitnick'in bütün", r: KV("Kevin Mitnick", "1963–2023") },

  // ── kapanış ──
  { c: "Şimdi bütün dosyayı", r: title([{ s: "DOSYA ÖZETİ", c: GRN, size: 100 }]) },
  { c: "Kartlarla oynayan", r: K(Cards, { vanish: true }) },
  { c: "Bir otobüs", r: K(Bus, { punch: true }) },
  { c: "Telefon şirketine", r: K(PhoneHQ, { enter: true }) },
  { c: "Ona ihanet", r: K(Betray, {}) },
  { c: "Bir ıslıkla", r: K(Whistle, {}) },
  { c: "Buzdolabındaki", r: K(DonutBox, { note: "FBI DONUTS" }) },
  { c: "İki buçuk yıl süren", r: K(UsaMap, { route: ["Los Angeles", "Denver", "Seattle", "Raleigh"], hi: "Raleigh", red: true }) },
  { c: "Ve bir Noel", r: K(FaceOff, {}) },
  { c: "Kevin'in hikâyesi", r: title([{ s: "İnsanları kandırmayı en iyi bilen adam,", size: 56 }, { s: "sonunda kendi kibrine kandı.", c: AMB, size: 64 }], { step: 1.4 }), sfx: "px/riser" },
  { c: "Peki sen ne", r: K(PxQuestion, { q: "GERÇEKTEN BU KADAR BASİT MİYDİ?", opts: ["Evet, insan en zayıf halka", "Hayır, efsane abartılmış"] }) },
  { c: "Ve en önemlisi", r: K(ScamCall, {}) },
  { c: "Bu dosya burada", r: title([{ s: "Bu dosya burada kapanıyor.", size: 64 }, { s: "PROTOKOL X", c: GRN, size: 110 }], { step: 1 }), sfx: "px/hit_end" },
];

// غير مستعمل مباشرة: للتأكد إنو الاستيرادات صحيحة
void T; void X; void Stamp; void HCam; void GRANDPA; void AGENT; void FBI; void KEVIN_K;
