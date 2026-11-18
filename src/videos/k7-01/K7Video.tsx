import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k7-01-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { Big, HCam, SubBtn, rp, lp } from "../../components/Hayat";
import { X, T, PFrame, Grain, Sil, Screen, NewsPage } from "../../components/Protokol";
import { Room, Court, Dossier, Papers, Chapter, DateCard, BigNum } from "../../components/Protokol2";
import {
  MedMap, MapMode, Phone, AppBal, AppMaint, PhoneWall, ScreenVault, Kiosk, Gate, NightPlane, XRay, ColdWallet, Villa, Biometric, Gold, Corridor,
  AtmStreet, CarDraw, PriceChart, Commission, Crowd, OfficeFront, ShopScreen,
} from "../../components/Protokol3";

// Kanal 5 · Protokol X · k7-01 · "400 Bin Kişinin Parasıyla Kaybolan Çocuk: Thodex Dosyası"
// Ses: Gemini TTS (Gacrux, gemini-3.8-flash-tts, 7 parça). Kelime zamanları faster-whisper (align_parts). tighten.
// Kaynaklar: القناة 5/فيديوهات/k7-01b-thodex/بحث.md. Kurgu sadece kaynaklı olay; ölüm tek resmî cümle, yöntem yok.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K7_01_SECONDS = Math.ceil(VOICE_END + 4);
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string | string[]; r: R; html?: R; sfx?: string; tone?: Tone };
type Z = { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; k?: number };

const AMB = X.amber, RED = X.red, CY = X.cyan;
const cam = (t: number, a: number, b: number, node: React.ReactNode, p: Z = {}, dz: [number, number] = [1, 1.08]) => <HCam t={t} a={a} b={b} z={p.z ?? dz} c0={p.c0} c1={p.c1} k={p.k}>{node}</HCam>;
const B = (text: string, o: { y?: number; size?: number; c?: string; at?: number; sub?: string } = {}): R => (t, a) => <Big t={t} at={a + (o.at ?? 0.3)} text={text} sub={o.sub} y={o.y ?? 80} size={o.size ?? 72} c={o.c ?? "#FFF"} />;
const BB = (text: string, o: { size?: number; c?: string; at?: number } = {}): R => B(text, { y: 880, size: o.size ?? 64, c: o.c, at: o.at });
// sahneler
const room: (p?: Z & { main?: (t: number, a: number) => React.ReactNode; mode?: "day" | "dusk" | "night"; pose?: "type" | "think" | "head" | "phone"; red?: number; glow?: string }) => R = (p = {}) => (t, a, b) =>
  cam(t, a, b, <Room t={t} main={p.main?.(t, a)} mode={p.mode ?? "dusk"} pose={p.pose ?? "type"} red={p.red} glow={p.glow} />, p, [1.0, 1.1]);
const scr = (content: (t: number, a: number) => React.ReactNode, p: Z & { glow?: string } = {}): R => (t, a, b) =>
  cam(t, a, b, <g><rect width={1920} height={1080} fill="#07090E" /><Screen x={160} y={90} w={1600} h={900} glow={p.glow ?? CY}>{content(t, a)}</Screen></g>, p, [1.0, 1.06]);
const ph = (content: (t: number, a: number) => React.ReactNode, p: Z & { glow?: string; bg?: string } = {}): R => (t, a, b) =>
  cam(t, a, b, <g><rect width={1920} height={1080} fill={p.bg ?? "#06080C"} /><ellipse cx={960} cy={540} rx={900} ry={500} fill="url(#pGlowC)" opacity={0.15} /><Phone x={960} y={600} s={1.0} glow={p.glow}>{content(t, a)}</Phone></g>, p, [0.95, 1.08]);
const map = (mode: MapMode, p: Z & { dur?: number; labels?: string[]; route?: [string, string]; dots?: number } = {}): R => (t, a, b) =>
  cam(t, a, b, <MedMap t={t} a={a} mode={mode} dur={p.dur} labels={p.labels} route={p.route} dots={p.dots} />, p, [1.0, 1.08]);
const dos = (title: string, lines: string[], p: Z & { stamp?: string; no?: string; at?: number } = {}): R => (t, a, b) =>
  cam(t, a, b, <Dossier t={t} a={a} title={title} lines={lines} stamp={p.stamp} stampAt={p.at} no={p.no ?? "THODEX"} />, p, [1.0, 1.05]);
const date = (d: string, place?: string, c?: string): R => (t, a, b) => cam(t, a, b, <DateCard t={t} a={a} date={d} place={place} c={c} />, {}, [1.0, 1.04]);
const chap = (n: string, title: string, sub?: string): R => (t, a, b) => cam(t, a, b, <Chapter t={t} a={a} n={n} title={title} sub={sub} />, {}, [1.0, 1.05]);
const num = (to: number, label: string, o: { suffix?: string; prefix?: string; c?: string; from?: number; dur?: number } = {}): R => (t, a, b) =>
  cam(t, a, b, <BigNum t={t} a={a} to={to} from={o.from} label={label} suffix={o.suffix} prefix={o.prefix} c={o.c} dur={o.dur} />, {}, [1.0, 1.05]);
const court = (p: Z & { speak?: boolean; stand?: boolean; gavel?: number } = {}): R => (t, a, b) => cam(t, a, b, <Court t={t} a={a} speak={p.speak} stand={p.stand} gavel={p.gavel} seal="ADALET" />, p, [1.0, 1.1]);
const quote = (q: string, who = "Mahkeme kaydı", c = AMB): R => (t, a, b) => cam(t, a, b, (
  <g>
    <rect width={1920} height={1080} fill="#0A0806" />
    <ellipse cx={960} cy={540} rx={900} ry={480} fill="url(#pGlowA)" opacity={0.18} />
    {T(260, 360, "“", 260, c, 700)}
    {q.split("\n").map((l, i) => <g key={i} opacity={rp(t, a + 0.2 + i * 0.35, a + 0.7 + i * 0.35)}>{T(960, 470 + i * 110, l, 78, "#FFF", 700, "middle")}</g>)}
    <g opacity={rp(t, a + 0.9, a + 1.4)}>{T(960, 470 + q.split("\n").length * 110 + 40, `— ${who}`, 38, c, 600, "middle")}</g>
  </g>
), {}, [1.0, 1.06]);
const list = (title: string, items: string[], c = AMB): R => (t, a, b) => cam(t, a, b, (
  <g>
    <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
    {T(200, 220, title, 64, c, 700)}
    {items.map((s, i) => <g key={i} opacity={rp(t, a + 0.3 + i * 0.45, a + 0.7 + i * 0.45)} transform={`translate(${(1 - rp(t, a + 0.3 + i * 0.45, a + 0.7 + i * 0.45)) * -40},0)`}><rect x={200} y={300 + i * 130} width={90} height={90} rx={12} fill={c} />{T(245, 365 + i * 130, String(i + 1), 54, "#111", 700, "middle")}{T(330, 368 + i * 130, s, 60, "#FFF", 700)}</g>)}
  </g>
), {}, [1.0, 1.05]);
const sil = (node: (t: number) => React.ReactNode, bg = "#0B0E14", p: Z = {}): R => (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill={bg} /><ellipse cx={960} cy={620} rx={760} ry={520} fill="url(#pGlowA)" opacity={0.22} /><rect x={0} y={860} width={1920} height={220} fill="#07090C" /><ellipse cx={960} cy={880} rx={600} ry={60} fill="#FFE0A8" opacity={0.05} />{node(t)}</g>, p, [1.0, 1.1]);
const news = (head: string, sub?: string, tag?: string): R => (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#07090E" /><Screen x={160} y={90} w={1600} h={900} glow={RED}><NewsPage t={t} a={a} head={head} sub={sub} tag={tag} /></Screen></g>, {}, [1.0, 1.06]);
const papers = (heads: string[]): R => (t, a, b) => cam(t, a, b, <Papers t={t} a={a} heads={heads} />, {}, [1.0, 1.06]);
const vault = (p: { shown?: number; fill?: number; drain?: number; key2?: boolean } & Z = {}): R => (t, a, b) => cam(t, a, b, <ScreenVault t={t} a={a} shown={p.shown} fill={p.fill} drain={p.drain} key2={p.key2} />, p, [1.0, 1.06]);
const photo = (file: string, cap: string, credit: string, p: Z & { blur?: number } = {}): R => (t, a, b) => cam(t, a, b, (
  <g>
    <defs><filter id={`pb${file}`}><feGaussianBlur stdDeviation={p.blur ?? 0} /><feColorMatrix type="saturate" values="0.55" /></filter></defs>
    <image href={staticFile(`img/k7-01/${file}`)} x={-40} y={-30} width={2000} height={1140} preserveAspectRatio="xMidYMid slice" filter={`url(#pb${file})`} />
    <rect width={1920} height={1080} fill="#0A1018" opacity={0.18} />
    <rect width={1920} height={1080} fill="url(#pShade)" />
    <g opacity={rp(t, a + 0.4, a + 0.9)}><rect x={150} y={130} width={cap.length * 21 + 60} height={64} rx={8} fill="#05070A" opacity={0.85} />{T(180, 173, cap, 32, AMB, 700)}</g>
    {T(1800, 1000, credit, 20, "#C9CED6", 500, "end", { opacity: 0.7 } as React.SVGProps<SVGTextElement>)}
  </g>
), p, [1.02, 1.12]);
const fig = (t: number, x: number, o: { pose?: "stand" | "think" | "head" | "phone" | "hold" | "cuffs" | "bag" | "point" | "sit"; kind?: "hood" | "suit" | "coat" | "casual"; rim?: string; s?: number; dir?: 1 | -1 } = {}) =>
  <Sil x={x} y={1000} s={o.s ?? 1.5} t={t} kind={o.kind ?? "coat"} pose={o.pose ?? "stand"} rim={o.rim ?? AMB} dir={o.dir} hair="short" seed={x} />;

const SHOTS: Sh[] = [
  // ───── açılış
  { c: "Yirmi Nisan", r: date("20 NİSAN 2021", "İSTANBUL HAVALİMANI · 17:57", RED), sfx: "tick" },
  { c: "Akşam saat beşi", r: (t, a, b) => cam(t, a, b, <Gate t={t} a={a} />, { z: [1.15, 1.25], c0: [1500, 300] }) },
  { c: "Pasaport kontrolünden doksan", r: (t, a, b) => cam(t, a, b, <Gate t={t} a={a} pass={0} />, { z: [1.0, 1.06] }), html: B("1994 doğumlu bir genç", { y: 880, size: 60 }) },
  { c: "Kimse durdurmuyor", r: (t, a, b) => cam(t, a, b, <Gate t={t} a={a - 2} pass={0} />, { z: [1.2, 1.3], c0: [900, 700] }) },
  { c: "İki saat sonra", r: (t, a, b) => cam(t, a, b, <NightPlane t={t} a={a} />, { z: [1.0, 1.08] }), sfx: "whoosh" },
  { c: "Aynı saatlerde Türkiye'nin", r: map("grow", { dur: 3, z: [1.0, 1.08], c0: [1300, 560] }) },
  { c: "Aynı uygulamayı", r: ph((t, a) => <AppBal t={t} a={a} />) },
  { c: "Ve aynı sözü", r: (t, a, b) => cam(t, a, b, <PhoneWall t={t} a={a} flip={0.6} />, { z: [1.0, 1.08] }), sfx: "static" },
  { c: "Önce birkaç saat", r: ph((t, a) => <AppMaint t={t} a={a} days={false} />, { glow: AMB }) },
  { c: "Sonra dört beş", r: ph((t, a) => <AppMaint t={t} a={a} />, { glow: AMB, z: [1.15, 1.25], c0: [960, 500] }) },
  { c: "Ama o kapı", r: ph((t, a) => <AppMaint t={t} a={a} closed />, { glow: RED, z: [1.0, 0.9] }), sfx: "drone" },
  { c: "Uygulamanın adı", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="THODEX" />, { z: [1.0, 1.1], c0: [960, 700] }), html: B("THODEX", { size: 110, c: AMB }) },
  { c: "Hesabı olan insan", r: num(400000, "hesap", { dur: 1.6 }) },
  { c: "Ve uçaktaki o genç", r: (t, a, b) => cam(t, a, b, <NightPlane t={t} a={a - 3} />, { z: [1.3, 1.45], c0: [1100, 420] }) },
  { c: "Faruk Fatih Özer", r: dos("FARUK FATİH ÖZER", ["Doğum: 1994 · Kocaeli", "Eğitim: lise", "Şirket: Thodex (kurucu)", "█"], { no: "DOSYA 01" }), sfx: "knock" },
  { c: "Peki lise mezunu", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.0, 1.15], c0: [960, 600] }), html: B("Nasıl?", { size: 110, c: AMB, at: 0.6 }) },
  { c: "Ve o ekran karardığında", r: ph((t, a) => <AppBal t={t} a={a} dim={rp(t, a + 0.5, a + 2)} />, { glow: RED }), html: B("Para nereye gitti?", { y: 880, c: RED }) },
  { c: "Sonunu şimdiden", r: sil((t) => <Corridor t={t} />, "#000", { z: [1.0, 1.12] }) },
  { c: "Çünkü bu hikâye", r: dos("THODEX DOSYASI", ["█", "█", "█", "█"], { stamp: "AÇIK", at: 0.8 }) },
  { c: "Bu hikâyeyi duymuş", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#050608" />{T(960, 500, "Bu hikâyeyi duymuş olabilirsin.", 76, "#FFF", 700, "middle")}<g opacity={rp(t, a + 2.2, a + 2.8)}>{T(960, 620, "Ama bu dosyayı hiç böyle açmadın.", 76, AMB, 700, "middle")}</g></g>, {}, [1.0, 1.05]) },
  { c: "Dosya açılıyor", r: dos("PROTOKOL X", ["Dosya 01 · Thodex", "Kaynak: mahkeme kayıtları, iddianame, basın", "█"], { stamp: "AÇILDI", at: 0.6, no: "DOSYA 01" }), sfx: "boom" },

  // ───── Bölüm 1
  { c: "Bölüm bir", r: chap("BÖLÜM 1", "Gebze'deki şirket", "2014 · Kocaeli"), sfx: "boom" },
  { c: "bin dokuz yüz doksan dörtte", r: map("plain", { labels: ["KOCAELİ"], z: [1.6, 1.9], c0: mpC("KOCAELİ") }), html: B("1994 · Kocaeli", { y: 880 }) },
  { c: "Çocukluğuna dair", r: dos("KAMUYA AÇIK BİLGİ", ["Çocukluk: —", "Röportaj: —", "Okul hikâyesi: —"], { no: "DOSYA 01" }) },
  { c: "Bildiğimiz şey şu", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "casual" })}</>, "#0E1218", { z: [1.0, 1.1] }), html: B("Üniversite yok", { y: 880, c: AMB }) },
  { c: "Yıllar sonra mahkemede", r: dos("KİMLİK TESPİTİ", ["Medeni hâl: bekâr", "Eğitim: lise mezunu", "█"], { no: "TUTANAK" }) },
  { c: "Ama okul yerine", r: room({ mode: "day", main: (t, a) => <ShopScreen t={t} a={a} />, z: [1.0, 1.15], c0: [990, 470] }) },
  { c: "Kendi anlatımına göre", r: scr((t, a) => <ShopScreen t={t} a={a} />), html: B("e-ticaret", { y: 880, c: AMB }) },
  { c: "İnternetten bir şeyler", r: room({ mode: "dusk", main: (t, a) => <ShopScreen t={t} a={a} />, z: [1.25, 1.35], c0: [990, 470] }) },
  { c: "Sonra o işin başına", r: scr((t, a) => <ShopScreen t={t} a={a} hack={0.6} />, { glow: RED }), sfx: "buzz" },
  { c: "Mahkemede bunu tek", r: quote("Şirketim hacklendi.", "Faruk Fatih Özer · mahkeme savunması") },
  { c: "İki bin on dört", r: date("2014", "GEBZE · INLINE TEKNOLOJİ") },
  { c: "Adı Inline", r: room({ mode: "night", z: [1.0, 1.1] }), html: B("Inline Teknoloji · yazılım", { y: 880 }) },
  { c: "Ama bu genç bir şeyi", r: ph((t, a) => <AppBal t={t} a={a} total={1000} />, { z: [1.1, 1.2], c0: [960, 400] }) },
  { c: "Ve o rakamı kim", r: (t, a, b) => cam(t, a, b, <ScreenVault t={t} a={a} shown={1000} fill={1} key2 />, { z: [1.2, 1.3], c0: [1480, 820] }) },
  { c: "Tam o yıllarda", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a} sym="BTC" pct="" dur={4} />, {}, [1.0, 1.06]) },
  { c: "Çoğu insan için", r: sil((t) => <>{fig(t, 700, { pose: "think", kind: "casual", rim: CY })}{fig(t, 1220, { pose: "phone", kind: "coat", rim: CY, dir: -1 })}</>) },
  { c: "Ama fiyatı her gün", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a} sym="BTC" pct="▲" dur={3} />, { z: [1.1, 1.2], c0: [1500, 400] }) },
  { c: "Faruk Fatih Özer de merak", r: room({ mode: "night", pose: "think", main: (t, a) => <PriceChartScreen t={t} a={a} />, z: [1.0, 1.12] }) },
  { c: "Mahkemedeki ifadesine göre", r: dos("SAVUNMA · ÖZET", ["E-ticaretle uğraşırken kripto dikkatini çekti", "Rakip şirketlerde eksikler gördü", "Yazılımcılarla mobil işlemlere başladı"], { no: "TUTANAK" }) },
  { c: "Ama o merak etmekle", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.2, 1.35], c0: [960, 520] }), html: B("Alışverişin yapıldığı yer kimin olacak?", { y: 880, size: 56, c: AMB, at: 1.2 }) },

  // ───── Bölüm 2
  { c: "Bölüm iki", r: chap("BÖLÜM 2", "Kasa", "2017 · Şişli"), sfx: "boom" },
  { c: "Burada durup basit", r: sil((t) => <>{fig(t, 960, { pose: "point", kind: "suit", rim: CY })}</>, "#0B0E14") , html: B("Kripto borsası nedir?", { y: 880, c: CY }) },
  { c: "Bir döviz bürosu", r: (t, a, b) => cam(t, a, b, <Kiosk t={t} a={a} give={2} />, {}, [1.0, 1.06]) },
  { c: "Ama bu büroda bir fark", r: (t, a, b) => cam(t, a, b, <Kiosk t={t} a={a - 3} />, { z: [1.3, 1.4], c0: [1500, 560] }) },
  { c: "Diyorlar ki", r: vault({ shown: 1000, fill: 1 }), html: B("“Senin doların kasamızda.”", { y: 880, size: 60 }) },
  { c: "İşte borsa budur", r: vault({ shown: 1000, fill: 1, z: [1.3, 1.4], c0: [500, 440] }) },
  { c: "Kasada senin adına", r: vault({ shown: 1000, fill: 1, z: [1.25, 1.35], c0: [1480, 480] }) },
  { c: "Ve o sözün tek güvencesi", r: vault({ shown: 1000, fill: 1, key2: true, z: [1.0, 1.08] }), html: B("Anahtarı tutan kişi", { c: AMB }) },
  { c: "On dört Eylül", r: date("14 EYLÜL 2017", "ŞİŞLİ · İSTANBUL"), sfx: "tick" },
  { c: "Kendi sözleriyle", r: quote("Şişli'de bir coin şirketi\n100 bin lira ödenmiş sermaye ile kurdum.", "Faruk Fatih Özer · mahkeme savunması") },
  { c: "Şirketin adı Koineks", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="KOİNEKS" />, { z: [1.0, 1.1], c0: [960, 700] }) },
  { c: "Kurulduğunda Türkiye'deki", r: list("Türkiye · kripto borsaları · 2017", ["…", "…", "…", "Koineks"]) },
  { c: "Kendisi yıllar sonra", r: quote("22 yaşında kurduğum şirket…", "Faruk Fatih Özer · mahkeme savunması") },
  { c: "Yirmi iki yaşında bir genç", r: vault({ shown: 1000, fill: 1, key2: true, z: [1.3, 1.4], c0: [1480, 840] }) },
  { c: "Ve ilk büyük ders", r: sil((t) => <Corridor t={t} />, "#000") },
  { c: "Kayıtlara göre", r: dos("ŞİKÂYET · 2017", ["Şikâyetçi: Faruk Fatih Özer / şirket", "Şüpheli: bir kullanıcı (Süleyman K.)", "İddia: hesapta olmayan parayı satmak"], { no: "İDDİANAME" }) },
  { c: "İddiaya göre bu kullanıcı", r: vault({ shown: 595000, fill: 0.15 }), html: B("Ekranda var · kasada yok", { y: 880, c: RED }) },
  { c: "Yani kasada olmayan", r: vault({ shown: 595000, fill: 0.15, z: [1.25, 1.35], c0: [1480, 480] }) },
  { c: "Bilirkişi raporuna göre", r: num(264, "kez", { dur: 1.2 }) },
  { c: "Toplam beş yüz", r: num(595000, "lira", { suffix: " ₺" }) },
  { c: "Mahkeme o kullanıcıya", r: court({ gavel: 1.0 }), html: B("7 yıl 6 ay", { y: 880, c: AMB }), sfx: "knock" },
  { c: "Bu detayı unutma", r: vault({ shown: 1000, fill: 0.2, z: [1.0, 1.05] }) },
  { c: "ekrandaki rakam ile", r: vault({ shown: 1000, fill: 0.2, z: [1.15, 1.2], c0: [960, 470] }), html: B("Ekran ≠ Kasa", { size: 110, c: RED, at: 0.8 }) },
  { c: "Koineks büyüyor", r: map("grow", { dur: 5, dots: 120, z: [1.0, 1.06], c0: [1300, 560] }) },
  { c: "Türkiye'nin ilk Bitcoin", r: (t, a, b) => cam(t, a, b, <AtmStreet t={t} />, { z: [1.0, 1.15], c0: [1210, 630] }) },
  { c: "Adını duyurmak için", r: (t, a, b) => cam(t, a, b, <CarDraw t={t} a={a} />, {}, [1.0, 1.06]), sfx: "ding" },
  { c: "Bir Porsche", r: (t, a, b) => cam(t, a, b, <CarDraw t={t} a={a - 2} />, { z: [1.3, 1.4], c0: [960, 700] }) },
  { c: "Ve insanlar şunu", r: (t, a, b) => cam(t, a, b, <Crowd t={t} />, {}, [1.0, 1.08]), html: B("“Bu şirket benim paramı mı alacak?”", { y: 80, size: 56 }) },
  { c: "Mart iki bin yirmi", r: date("MART 2020", "KOİNEKS → THODEX") },
  { c: "Koineks gidiyor", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign={t < a + 1.6 ? "KOİNEKS" : "THODEX"} />, { z: [1.0, 1.1], c0: [960, 700] }) },
  { c: "Göztepe'de yeni", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="THODEX" />, { z: [1.2, 1.1], c0: [960, 500] }), html: B("Göztepe · yeni ofis", { y: 880 }) },
  { c: "Reklamlarda ünlü", r: (t, a, b) => cam(t, a, b, <AdBoards t={t} a={a} />, {}, [1.0, 1.08]) },
  { c: "İki bin yirmi Kasım'ına", r: num(3, "işlem hacmi · Kasım 2020", { prefix: "~", suffix: " milyar $", dur: 1.2 }) },
  { c: "Yüz bin lirayla", r: num(100000, "lira · başlangıç sermayesi", { suffix: " ₺" }) },
  { c: "Peki insanlar neden", r: sil((t) => <>{fig(t, 960, { pose: "think", kind: "casual", rim: CY })}</>, "#0E1218"), html: B("Neden güvendiler?", { c: CY }) },
  { c: "Ve güven işaretlerini", r: list("Güven işaretleri", ["Gerçek ofis", "Bitcoin ATM", "ABD kaydı", "Ünlü yüzler", "Para çekebilmek"], CY) },
  { c: "Bir. Şirketin", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="THODEX" />, { z: [1.0, 1.08] }), html: BB("1 · Gerçek ofis") },
  { c: "İki. Sokakta", r: (t, a, b) => cam(t, a, b, <AtmStreet t={t} />, { z: [1.1, 1.2], c0: [1100, 620] }), html: BB("2 · Bitcoin ATM") },
  { c: "Üç. Şirket", r: dos("ABD · FinCEN KAYDI", ["Para hizmetleri işletmesi (MSB)", "Yıl: 2020", "█"], { no: "BELGE" }), html: BB("3 · ABD kaydı") },
  { c: "Kâğıt üzerinde", r: dos("ABD · FinCEN KAYDI", ["Para hizmetleri işletmesi (MSB)", "Kasa denetimi: —"], { no: "BELGE", stamp: "SADECE KAYIT", at: 1.4 }) },
  { c: "Dört. Televizyonda", r: (t, a, b) => cam(t, a, b, <AdBoards t={t} a={a - 2} />, { z: [1.2, 1.3] }), html: BB("4 · Ünlü yüzler") },
  { c: "Ve beş", r: ph((t, a) => <AppBal t={t} a={a} total={5000} />), html: BB("5 · Para çekebilmek") },
  { c: "İnsanlar küçük miktarlar", r: ph((t, a) => <WithdrawOk t={t} a={a} />, { glow: "#3DDC84" }), sfx: "ding" },
  { c: "Ve her gelen para", r: (t, a, b) => cam(t, a, b, <Crowd t={t} />, { z: [1.15, 1.25] }) },
  { c: "Ama bu beş işaretin", r: vault({ shown: 1000, fill: 1, open: 0 } as never), html: B("Hiçbiri kasanın içini göstermiyor", { y: 880, size: 56, c: AMB }) },
  { c: "Ofis kasayı göstermez", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="THODEX" />, { z: [1.3, 1.4], c0: [960, 760] }) },
  { c: "Küçük bir çekim bile", r: vault({ shown: 1000, fill: 0.3 }) },
  { c: "Sadece o gün", r: vault({ shown: 1000, fill: 0.3, z: [1.3, 1.4], c0: [1480, 600] }) },
  { c: "Bir de şunu bil", r: dos("SORUŞTURMA · REKLAM YÜZLERİ", ["Kişi sayısı: 17", "Karar: kovuşturmaya yer yok", "Gerekçe: reklamda oynamak tek başına suç değil"], { no: "SAVCILIK" }) },
  { c: "Yani reklamlardaki", r: (t, a, b) => cam(t, a, b, <AdBoards t={t} a={a - 3} dark />, { z: [1.0, 1.1] }) },

  // ───── Bölüm 3
  { c: "Bölüm üç", r: chap("BÖLÜM 3", "Doge", "2021 · bahar"), sfx: "boom" },
  { c: "İki bin yirmi bir. Dünya", r: (t, a, b) => cam(t, a, b, <NightCity t={t} />, { z: [1.0, 1.1] }) },
  { c: "Türkiye'de de bir şey", r: (t, a, b) => cam(t, a, b, <LiraFall t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "Bankadaki faiz", r: list("Birikim nereye?", ["Banka faizi: yetmiyor", "Altın: pahalı", "Telefondaki paralar: ▲ %10 · %20"], AMB) },
  { c: "Bir borsa bu durumda", r: (t, a, b) => cam(t, a, b, <Commission t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "Kulağa az geliyor", r: (t, a, b) => cam(t, a, b, <Commission t={t} a={a - 4} />, { z: [1.3, 1.4], c0: [960, 760] }) },
  { c: "Yani dürüst bir", r: vault({ shown: 1000, fill: 1 }), html: B("Kasa müşterinin · komisyon borsanın", { y: 880, size: 54, c: "#3DDC84" }) },
  { c: "Bunu aklında tut", r: vault({ shown: 1000, fill: 1, key2: true, z: [1.3, 1.45], c0: [1480, 840] }), html: B("Kasadaki paraya kim dokundu?", { c: AMB, at: 1.4 }) },
  { c: "Thodex'in hesabı olan", r: map("grow", { dur: 4, z: [1.0, 1.08], c0: [1300, 560] }) },
  { c: "Bunların yaklaşık", r: num(391000, "aktif hesap", { from: 300000 }) },
  { c: "Faruk Fatih Özer kendisi", r: num(700000, "üye · Özer'in söylediği", { from: 391000, c: RED }) },
  { c: "Ve tam bu sırada", r: date("15 MART 2021", "SON KAMPANYA") },
  { c: "On beş Mart'tan", r: ph((t, a) => <CampaignApp t={t} a={a} />, { glow: AMB }) },
  { c: "Dogecoin, bir köpek", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a} sym="DOGE" pct="" dur={5} />, {}, [1.0, 1.06]) },
  { c: "Fiyatı her gün yükseliyor", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a - 3} sym="DOGE" pct="▲" dur={5} />, { z: [1.2, 1.3], c0: [1500, 420] }) },
  { c: "Kaynaklara göre kampanyada", r: num(4000000, "Dogecoin dağıtıldı", { dur: 1.6 }) },
  { c: "Bazı haberlere göre", r: (t, a, b) => cam(t, a, b, <QuarterPrice t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "Yani dışarıda", r: (t, a, b) => cam(t, a, b, <QuarterPrice t={t} a={a - 2} />, { z: [1.2, 1.3] }) },
  { c: "Şimdi bir dakika", r: (t, a, b) => cam(t, a, b, <Kiosk t={t} a={a} give={99} />, { z: [1.1, 1.2], c0: [1310, 300] }), html: B("Dolar · çeyrek fiyata?", { y: 880, c: RED }) },
  { c: "Çoğu insan bunu", r: (t, a, b) => cam(t, a, b, <Crowd t={t} />, { z: [1.0, 1.08] }) },
  { c: "Fiyat yükseliyor", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a - 4} sym="DOGE" pct="▲" dur={4} />, { z: [1.05, 1.15] }) },
  { c: "Ve diğer borsalardan", r: map("grow", { dur: 2, z: [1.15, 1.25], c0: [900, 420] }) },
  { c: "Yirmi Nisan. Dogecoin", r: date("20 NİSAN 2021", "“DOGE GÜNÜ”"), sfx: "tick" },
  { c: "O gün fiyat", r: (t, a, b) => cam(t, a, b, <PriceChart t={t} a={a} sym="DOGE" pct="+%20" dur={2.5} />, {}, [1.0, 1.08]) },
  { c: "Ve haberlere göre", r: num(300, "son 24 saat · Dogecoin işlemi", { prefix: ">", suffix: " milyon $" }) },
  { c: "Ama aynı günlerde", r: ph((t, a) => <WithdrawFail t={t} a={a} />, { glow: RED }), sfx: "buzz" },
  { c: "Kullanıcılar para çekmeye", r: ph((t, a) => <WithdrawFail t={t} a={a - 1} />, { glow: RED, z: [1.2, 1.3], c0: [960, 640] }) },
  { c: "Şirket bir açıklama", r: news("Siber saldırı", "Şirket: işlemlerde aksama", "AÇIKLAMA") },
  { c: "Sonra bir açıklama daha", r: news("Dogecoin yatırma ve çekme bakıma alındı", "Şirket açıklaması", "AÇIKLAMA") },
  { c: "Ekranda rakamlar", r: vault({ shown: 48250, fill: 0.4, drain: 0.5 }) },

  // ───── Bölüm 4
  { c: "Bölüm dört", r: chap("BÖLÜM 4", "Beşi elli yedi", "20 Nisan 2021"), sfx: "boom" },
  { c: "Şimdi o güne", r: date("20 NİSAN 2021", "GERİ DÖNÜŞ") },
  { c: "Anadolu Ajansı'nın", r: photo("ist.jpg", "GERÇEK GÖRÜNTÜ · İSTANBUL HAVALİMANI", "Foto: Matti Blume · CC BY-SA 4.0 · Wikimedia Commons", { blur: 3 }) },
  { c: "Saat beşi elli yedi geçe", r: (t, a, b) => cam(t, a, b, <Gate t={t} a={a - 1} pass={0} />, { z: [1.3, 1.4], c0: [1500, 280] }), sfx: "tick" },
  { c: "Saat yediyi elli", r: (t, a, b) => cam(t, a, b, <NightPlane t={t} a={a} />, { z: [1.0, 1.08] }) },
  { c: "Bu saatleri bir kez", r: (t, a, b) => cam(t, a, b, <Timeline t={t} a={a} />, {}, [1.0, 1.05]) },
  { c: "Ve aynı gün, şirketin kurucusu", r: map("route", { dur: 4, labels: ["İSTANBUL", "TİRAN"], z: [1.0, 1.15], c0: [1100, 400] }) },
  { c: "Ertesi gün", r: date("21 NİSAN 2021", "SABAH") },
  { c: "Kullanıcılar uygulamaya", r: ph((t, a) => <AppMaint t={t} a={a} closed />, { glow: RED }) },
  { c: "Şirketin açıklamasına göre", r: news("Ortaklık ve devir süreci", "“Dünyaca ünlü bankalar ve fon şirketleriyle görüşülüyor”", "AÇIKLAMA") },
  { c: "Açıklamadaki cümle", r: quote("Süreç ise yaklaşık\n4-5 iş günü sürecektir.", "Thodex açıklaması · Nisan 2021", RED) },
  { c: "Dört beş iş günü", r: (t, a, b) => cam(t, a, b, <PhoneWall t={t} a={a - 5} />, { z: [1.0, 1.08] }) },
  { c: "Sonra bir avukat", r: (t, a, b) => cam(t, a, b, <TvStudio t={t} />, {}, [1.0, 1.08]) },
  { c: "Ona göre buharlaşan", r: num(2, "iddia · buharlaşan para", { suffix: " milyar $", c: RED, dur: 0.8 }), sfx: "boom" },
  { c: "İki milyar dolar. Bu rakam", r: map("dark", { dur: 3, z: [1.0, 1.08], c0: [1300, 560] }) },
  { c: "Gazeteler cumhuriyet", r: papers(["CUMHURİYET\nTARİHİNİN EN\nBÜYÜK İDDİASI", "391 BİN\nYATIRIMCI", "KURUCU\nYURT DIŞINDA"]) },
  { c: "Faruk Fatih Özer ise", r: ph((t, a) => <SocialPost t={t} a={a} />) },
  { c: "Yurt dışına ortaklık", r: list("Özer'in açıklaması", ["Ortaklık görüşmeleri için yurt dışındayım", "2 milyar dolar rakamı doğru değil", "Döneceğim, devletle iş birliği yapacağım"], CY) },
  { c: "Sonra Twitter", r: ph((t, a) => <SocialPost t={t} a={a} gone={0.4} />, { glow: RED }) },
  { c: "Ve dönmüyor", r: (t, a, b) => cam(t, a, b, <NightPlane t={t} a={a + 6} />, { z: [1.0, 1.1] }), sfx: "drone" },
  { c: "Yirmi iki Nisan'da", r: (t, a, b) => cam(t, a, b, <OfficeFront t={t} sign="THODEX" police />, { z: [1.0, 1.08] }) },
  { c: "Altmış iki kişi", r: num(62, "gözaltı", { dur: 1 }) },
  { c: "Yirmi üç Nisan'da", r: dos("INTERPOL", ["Ad: Faruk Fatih Özer", "Tarih: 23 Nisan 2021", "█"], { stamp: "KIRMIZI BÜLTEN", at: 1.0, no: "ARANIYOR" }), sfx: "knock" },
  { c: "Artık dünyanın", r: photo("tirana.jpg", "GERÇEK GÖRÜNTÜ · TİRAN", "Foto: Pudelek · CC BY-SA 4.0 · Wikimedia Commons") },
  { c: "İçişleri Bakanı", r: num(31, "el konulan · 3 hesap", { suffix: " milyon ₺" }) },
  { c: "Ve bir detay daha", r: num(290000, "Arnavutluk'a girişte beyan", { prefix: "~", suffix: " $" }) },
  { c: "Ama herkesin sorduğu", r: (t, a, b) => cam(t, a, b, <ScreenVault t={t} a={a} shown={48250} fill={0} />, { z: [1.0, 1.06] }), html: B("Peki geri kalanı?", { c: RED }) },
  { c: "İşte burada", r: sil((t) => <Corridor t={t} />, "#000", { z: [1.0, 1.1] }) },
  { c: "Kripto parayı şöyle", r: vault({ shown: 1000, fill: 1, key2: true }) },
  { c: "Kasanın kendisi", r: (t, a, b) => cam(t, a, b, <PassKey t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "O şifreyi internete", r: (t, a, b) => cam(t, a, b, <ColdWallet t={t} a={a} />, {}, [1.0, 1.1]) },
  { c: "Havalimanında hiçbir", r: (t, a, b) => cam(t, a, b, <XRay t={t} a={a - 1} />, {}, [1.0, 1.06]) },
  { c: "Savcılar yıllar sonra", r: quote("Mağdurların parasını soğuk cüzdan ile\nyurt dışına çıkardınız mı?", "Savcının sorusu · 2023", CY) },
  { c: "Cevabı ne oldu", r: dos("SORU", ["Soğuk cüzdan?", "Cevap: █"], { no: "TUTANAK" }) },

  // ───── Bölüm 5
  { c: "Bölüm beş", r: chap("BÖLÜM 5", "Vlora", "Arnavutluk · 2022"), sfx: "boom" },
  { c: "Aylar geçiyor", r: (t, a, b) => cam(t, a, b, <Crowd t={t} office />, {}, [1.0, 1.08]) },
  { c: "Mahkemede ilk dava", r: court({}) },
  { c: "Eylül iki bin yirmi birde", r: num(82, "yakalama kararı · Eylül 2021", { dur: 1 }) },
  { c: "Herkes yakalanıyor", r: (t, a, b) => cam(t, a, b, <Lineup t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "Faruk Fatih Özer ise ortada", r: (t, a, b) => cam(t, a, b, <Lineup t={t} a={a - 3} missing />, { z: [1.3, 1.4], c0: [1560, 560] }) },
  { c: "Tam on altı ay", r: num(16, "ay · kayıp", { dur: 1.2, c: RED }) },
  { c: "Bu sürede Türkiye'de", r: dos("MERKEZ BANKASI · YÖNETMELİK", ["Kripto varlıklarla ödeme: yasak", "Tarih: Nisan 2021"], { stamp: "YASAK", at: 1.2, no: "RESMÎ" }) },
  { c: "Mayıs iki bin yirmi birde", r: dos("MASAK", ["Kripto varlık hizmet sağlayıcıları", "kara para aklama kurallarına dahil", "Mayıs 2021"], { no: "RESMÎ" }) },
  { c: "Yani bir gencin kaçışı", r: map("plain", { z: [1.0, 1.1], c0: [1300, 560] }), html: B("Bir kaçış · bir ülkenin yasaları", { y: 880, c: AMB }) },
  { c: "Bu arada mağdurların", r: (t, a, b) => cam(t, a, b, <Crowd t={t} office />, { z: [1.15, 1.25] }) },
  { c: "Ve çoğunun elindeki", r: ph((t, a) => <Screenshot t={t} a={a} />) },
  { c: "İşte bu, kripto", r: vault({ shown: 48250, fill: 0 }), html: B("Gittiğini kanıtlarsın · nereye gittiğini göremezsin", { y: 880, size: 48 }) },
  { c: "Ve sonra, otuz Ağustos", r: date("30 AĞUSTOS 2022", "VLORA · ARNAVUTLUK", RED), sfx: "tick" },
  { c: "Arnavutluk'un güneyinde", r: map("vlora", { labels: ["VLORA", "TİRAN"], z: [1.6, 2.0], c0: mpC("VLORA") }) },
  { c: "Turistlerin yaz tatili", r: photo("vlora.jpg", "GERÇEK GÖRÜNTÜ · VLORA", "Foto: A1 · CC BY-SA 4.0 · Wikimedia Commons", { z: [1.0, 1.15], c0: [900, 820] }) },
  { c: "Sabah saat sekiz", r: (t, a, b) => cam(t, a, b, <Villa t={t} a={a} raid={0.6} />, { z: [1.0, 1.06] }), sfx: "whoosh" },
  { c: "İçeride bir adam", r: sil((t) => <>{fig(t, 760, { pose: "stand", kind: "casual", rim: AMB })}{fig(t, 1200, { pose: "badge" as never, kind: "coat", rim: "#2B5BFF", dir: -1 })}</>, "#1A1A1E") },
  { c: "Polis kim olduğunu", r: (t, a, b) => cam(t, a, b, <Biometric t={t} a={a} match={99} />, {}, [1.0, 1.05]) },
  { c: "Polis parmak izini", r: (t, a, b) => cam(t, a, b, <Biometric t={t} a={a} match={99} />, { z: [1.3, 1.4], c0: [560, 540] }) },
  { c: "Bilgiler Türkiye'ye", r: map("route", { route: ["VLORA", "ANKARA"], dur: 2, labels: ["VLORA", "ANKARA"], z: [1.0, 1.08] }) },
  { c: "Yüz tanıma sistemi", r: (t, a, b) => cam(t, a, b, <Biometric t={t} a={a} match={1.2} />, {}, [1.0, 1.05]), sfx: "ding" },
  { c: "Sahte ismin arkasındaki", r: dos("FARUK FATİH ÖZER", ["Yakalandı: 30 Ağustos 2022", "Yer: Vlora", "16 ay sonra"], { stamp: "YAKALANDI", at: 1.2, no: "DOSYA 01" }), sfx: "knock" },
  { c: "Yanında iki Arnavut", r: (t, a, b) => cam(t, a, b, <Villa t={t} a={a - 3} raid={0} />, { z: [1.2, 1.3], c0: [1300, 760] }) },
  { c: "Ama hikâye burada", r: court({ seal: "" } as never) },
  { c: "Arnavutluk mahkemelerinde", r: court({ speak: true, z: [1.2, 1.3], c0: [960, 500] }) },
  { c: "İtirazı reddediliyor", r: court({ gavel: 0.6 }), html: B("İtiraz reddedildi", { y: 880, c: RED }), sfx: "knock" },
  { c: "Ve yirmi Nisan iki bin yirmi üç", r: date("20 NİSAN 2023", "TAM İKİ YIL SONRA"), sfx: "tick" },
  { c: "Kaçtığı günden", r: (t, a, b) => cam(t, a, b, <TwoDates t={t} a={a} />, {}, [1.0, 1.05]) },

  // ───── Bölüm 6
  { c: "Bölüm altı", r: chap("BÖLÜM 6", "11.196 yıl", "Anadolu 9. Ağır Ceza"), sfx: "boom" },
  { c: "İstanbul Anadolu", r: court({ z: [1.0, 1.08] }) },
  { c: "Sanık sandalyesinde", r: court({ z: [1.3, 1.4], c0: [700, 900] }), html: B("21 sanık", { y: 80 }) },
  { c: "Savcılık her biri", r: num(40000, "yıl · talep (her biri)", { prefix: ">", c: RED }) },
  { c: "Ve iddianame", r: dos("İDDİANAME", ["Müşteki: 2.027", "Hesaplanan zarar: 356 milyon ₺", "█"], { no: "İDDİANAME" }) },
  { c: "Hesaplanan zarar", r: num(356, "milyon ₺ · iddianame", { dur: 1 }) },
  { c: "Sonraki hesaplarda", r: num(150, "milyon $ · sonraki tahmin", { prefix: "~", dur: 1 }) },
  { c: "Yani iki milyar değil", r: (t, a, b) => cam(t, a, b, <Compare t={t} a={a} />, {}, [1.0, 1.05]) },
  { c: "Mali Suçları", r: dos("MASAK RAPORU", ["Özer'in kontrolündeki 3 hesap", "→ Malta merkezli bir borsa", "~253,7 milyon ₺ kripto varlık"], { no: "MASAK" }) },
  { c: "merkezi Malta'da", r: map("malta", { route: ["İSTANBUL", "MALTA"], labels: ["İSTANBUL", "MALTA"], z: [1.0, 1.08], c0: [800, 560] }) },
  { c: "Ve bir de altın", r: (t, a, b) => cam(t, a, b, <Gold t={t} a={a} label="~22,7 milyon ₺" />, {}, [1.0, 1.06]) },
  { c: "O günün fiyatıyla", r: (t, a, b) => cam(t, a, b, <Gold t={t} a={a - 1} />, { z: [1.1, 1.2] }), sfx: "ding" },
  { c: "Elli iki kilo altın. Bir", r: (t, a, b) => cam(t, a, b, <Scale t={t} a={a} />, {}, [1.0, 1.06]) },
  { c: "Şimdi mahkeme salonuna", r: court({ z: [1.0, 1.1] }) },
  { c: "On iki Haziran", r: date("12 HAZİRAN 2023", "İLK SAVUNMA") },
  { c: "Kimlik tespiti", r: dos("KİMLİK TESPİTİ", ["Ad: Faruk Fatih Özer", "Eğitim: lise", "Meslek: █"], { no: "TUTANAK" }) },
  { c: "Tutanağa yazılan", r: dos("KİMLİK TESPİTİ", ["Ad: Faruk Fatih Özer", "Eğitim: lise", "Meslek: işsiz"], { no: "TUTANAK", stamp: "İŞSİZ", at: 0.5 }) },
  { c: "Bir zamanlar yedi yüz", r: num(700000, "üye · bir zamanlar", { c: AMB }) },
  { c: "Ve savunmasına", r: court({ stand: true, z: [1.2, 1.3], c0: [600, 760] }) },
  { c: "medyada ve iddianamede", r: quote("Ben kimseyi dolandırmadım.\nBana kumpas yapıldı.", "Faruk Fatih Özer · 12 Haziran 2023") },
  { c: "Ardından başka", r: quote("Şirket üzerinde alınan\ntüm kararlar bana aittir.", "Faruk Fatih Özer · 12 Haziran 2023") },
  { c: "Dikkat et", r: (t, a, b) => cam(t, a, b, <TwoQuotes t={t} a={a} />, {}, [1.0, 1.05]) },
  { c: "Yani her şeyi", r: (t, a, b) => cam(t, a, b, <TwoQuotes t={t} a={a - 3} />, { z: [1.15, 1.2] }), html: B("Her şeyi o yönetiyordu · hiçbir şeyden sorumlu değildi", { y: 880, size: 46, c: AMB }) },
  { c: "Savcılar soruyor", r: court({ speak: true, z: [1.1, 1.2], c0: [960, 420] }) },
  { c: "Özer, bazı mağdurların", r: dos("DOSYAYA SUNULAN", ["Dekont", "Dekont", "Dekont"], { no: "DELİL" }) },
  { c: "Şirketin hacklendiğini", r: quote("Thodex sadece bir şirket\nve iflas etti.", "Faruk Fatih Özer · son savunma") },
  { c: "Ve sonra, mahkeme kayıtlarına", r: court({ stand: true, z: [1.3, 1.45], c0: [560, 700] }), sfx: "drone" },
  { c: "Dünya üzerindeki tüm", r: quote("Dünya üzerindeki tüm kurumları\nyönetebilecek kadar zekiyim.", "Faruk Fatih Özer · son savunma", RED) },
  { c: "Bu cümleyi bir kez", r: court({ z: [1.0, 1.1] }), html: B("40 bin yıl istenen bir sanık · zekâsından bahsediyor", { y: 880, size: 46 }) },
  { c: "Belki de en başından", r: (t, a, b) => cam(t, a, b, <Steps t={t} a={a} />, {}, [1.0, 1.05]) },
  { c: "Bu genç, kendisinin", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "suit" })}</>, "#0B0E14", { z: [1.0, 1.2], c0: [960, 600] }) },
  { c: "Son duruşmada", r: quote("Yolun sonu görünüyor…", "Özer'in okuduğu türkü sözü · Musa Eroğlu") },
  { c: "Yedi Eylül", r: date("7 EYLÜL 2023", "KARAR"), sfx: "tick" },
  { c: "Faruk Fatih Özer'e, nitelikli", r: court({ gavel: 0.8, z: [1.1, 1.2], c0: [1240, 420] }), sfx: "knock" },
  { c: "On bir bin yüz doksan altı yıl. Bir", r: num(11196, "yıl · ilk derece kararı", { dur: 2, c: AMB }), sfx: "boom" },
  { c: "Aynı ceza iki", r: dos("KARAR · İLK DERECE", ["Faruk Fatih Özer: 11.196 yıl 10 ay 15 gün", "Güven Özer: aynı", "Serap Özer: aynı"], { no: "KARAR" }) },
  { c: "Gazeteler bu rakamı", r: papers(["11.196\nYIL", "KRİPTO\nMİLYONERİ", "DÜNYA\nGÜNDEMİNDE"]) },
  { c: "Ama bu rakam", r: num(11196, "yıl", { from: 11196, c: "#555" }) },

  // ───── Bölüm 7
  { c: "Bölüm yedi", r: chap("BÖLÜM 7", "Kapanmayan dosya"), sfx: "boom" },
  { c: "Dava istinafa", r: dos("İSTİNAF", ["İlk derece kararı: 11.196 yıl", "█"], { stamp: "BOZULDU", at: 1.6, no: "KARAR" }), sfx: "knock" },
  { c: "Dosya yeniden açılıyor", r: court({ z: [1.0, 1.08] }), html: B("21 sanık · yeniden yargılama", { y: 880 }) },
  { c: "Yani o on bir bin", r: num(0, "kesinleşen karar", { from: 11196, dur: 1.6, c: RED }) },
  { c: "Ve sonra, bir Kasım", r: date("1 KASIM 2025", "TEKİRDAĞ", "#9AA4B2") },
  { c: "Tekirdağ'daki", r: (t, a, b) => cam(t, a, b, <Corridor t={t} />, { z: [1.0, 1.1] }, [1.0, 1.1]), tone: "cool" },
  { c: "Faruk Fatih Özer, hücresinde", r: (t, a, b) => cam(t, a, b, <Corridor t={t} label="Hücresinde ölü bulundu · soruşturma başlatıldı" />, { z: [1.05, 1.12] }), tone: "cool" },
  { c: "Doksan dört doğumlu", r: (t, a, b) => cam(t, a, b, <TwoDates t={t} a={a} />, {}, [1.0, 1.05]), tone: "cool" },
  { c: "Ve hakkındaki dosya", r: dos("FARUK FATİH ÖZER", ["Doğum: 1994", "Kesin karar: —", "█"], { no: "DOSYA 01" }), tone: "cool" },
  { c: "Kardeşlerinin yeniden", r: court({ z: [1.0, 1.08] }), tone: "cool" },
  { c: "Şubat iki bin yirmi altıda", r: dos("ARA KARAR · ŞUBAT 2026", ["Güven Özer: ev hapsiyle tahliye", "Serap Özer: ev hapsiyle tahliye", "Yargılama sürüyor"], { no: "KARAR" }) },
  { c: "Ve kesin karar", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#07090E" />{T(960, 560, "Masumiyet karinesi", 100, "#FFF", 700, "middle")}<g opacity={rp(t, a + 0.6, a + 1.2)}>{T(960, 660, "kesin karar çıkana kadar herkes için", 44, X.dim, 600, "middle")}</g></g>, {}, [1.0, 1.04]) },
  { c: "Peki geriye ne", r: map("dark", { dur: 0.1, z: [1.0, 1.08], c0: [1300, 560] }) },
  { c: "Geriye dört yüz bin", r: (t, a, b) => cam(t, a, b, <PhoneWall t={t} a={a - 5} />, { z: [1.0, 1.1] }) },
  { c: "Yıllar boyunca", r: (t, a, b) => cam(t, a, b, <Crowd t={t} office />, { z: [1.0, 1.08] }) },
  { c: "Ve bir ülke kaldı", r: map("plain", { z: [1.0, 1.1], c0: [1300, 560] }) },
  { c: "Ama en çok", r: vault({ shown: 1000, fill: 0 }) },
  { c: "Bu hikâyenin başında", r: vault({ shown: 1000, fill: 1, key2: true }) },
  { c: "Ve ekranda gördüğün", r: vault({ shown: 1000, fill: 1, z: [1.3, 1.4], c0: [500, 440] }) },
  { c: "Faruk Fatih Özer bunu", r: dos("ŞİKÂYET · 2017", ["Hesapta olmayan para satıldı", "Şikâyetçi: Özer"], { no: "İDDİANAME" }) },
  { c: "Ekrandaki rakamla kasadaki", r: vault({ shown: 1000, fill: 0.15 }), html: B("Ekran ≠ Kasa", { size: 110, c: RED, at: 0.8 }) },
  { c: "Ve dört yüz bin insan", r: map("dark", { dur: 3, z: [1.0, 1.08], c0: [1300, 560] }) },
  { c: "Şimdi sana bir soru", r: ph((t, a) => <AppBal t={t} a={a} />, { z: [1.0, 1.1] }) },
  { c: "Ama o kasanın anahtarı", r: vault({ shown: 1000, fill: 1, key2: true, z: [1.3, 1.45], c0: [1480, 840] }), html: B("Anahtar kimde?", { c: AMB, at: 0.6 }) },
  { c: "Yorumlarda yaz", r: ph((t, a) => <AppMaint t={t} a={a} />, { glow: AMB }), html: B("Sen ne yapardın?", { y: 880, c: AMB }) },
  { c: "Bu dosya burada", r: dos("THODEX DOSYASI", ["█", "█"], { stamp: "KAPANDI", at: 0.8, no: "DOSYA 01" }) },
  { c: "Bir sonraki dosyada", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#050608" />{T(960, 560, "PROTOKOL X", 150, AMB, 700, "middle", { letterSpacing: 20 } as React.SVGProps<SVGTextElement>)}{T(960, 660, "Bir sonraki dosyada görüşmek üzere", 44, X.dim, 600, "middle")}</g>, {}, [1.0, 1.06]), html: (t, a) => <SubBtn t={t} at={a + 1.0} /> },
];

// ───────── küçük yardımcı sahneler (bu dosyaya özel) ─────────
function mpC(c: string): [number, number] {
  const m: Record<string, [number, number]> = { KOCAELİ: [29.9, 40.77], TİRAN: [19.82, 41.33], VLORA: [19.49, 40.47] };
  const [lo, la] = m[c];
  return [60 + (lo - 12) * 53, 150 + (44.5 - la) * 68];
}
const PriceChartScreen: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g transform="scale(0.8333)"><PriceChart t={t} a={a} sym="BTC" pct="" dur={6} /></g>
);
const AdBoards: React.FC<{ t: number; a: number; dark?: boolean }> = ({ t, a, dark = false }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSkyN)" />
    <rect x={0} y={860} width={1920} height={220} fill="#0E1116" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${160 + i * 560},${220 + (i % 2) * 40})`}>
        <rect x={-10} y={-10} width={500} height={580} fill="#05070A" />
        <rect width={480} height={560} fill={dark ? "#101318" : ["#2A1E40", "#1E2A40", "#402A1E"][i]} />
        <Sil x={240} y={560} s={1.0} t={t} kind={i === 1 ? "suit" : "coat"} pose="stand" hair={i === 1 ? "short" : "long"} rim={dark ? "#333" : AMB} seed={90 + i} op={dark ? 0.4 : 1} />
        {!dark && T(240, 80, "YATIRIM", 46, "#FFF", 700, "middle")}
        {!dark && <rect x={60} y={110} width={360} height={8} fill={AMB} />}
        <rect x={230} y={570} width={20} height={300} fill="#1A1E24" />
      </g>
    ))}
  </g>
);
const WithdrawOk: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g><rect width={360} height={740} fill="#0E3B2A" /><circle cx={180} cy={300} r={80} fill="#2BB673" /><path d="M140,302 L170,332 L224,270" stroke="#FFF" strokeWidth={16} fill="none" />{T(180, 450, "Çekim başarılı", 30, "#FFF", 700, "middle")}{T(180, 500, "500 ₺ · banka hesabı", 22, "#BFE6D2", 600, "middle")}</g>
);
const WithdrawFail: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g><rect width={360} height={740} fill="#2A0A0E" /><g transform={`translate(180,300) rotate(${(t - a) * 120})`}><circle r={70} fill="none" stroke="#FF6B6B" strokeWidth={12} strokeDasharray="300 140" /></g>{T(180, 450, "İşlem beklemede", 30, "#FFF", 700, "middle")}{T(180, 500, "Lütfen daha sonra deneyin", 20, "#F2C9C9", 600, "middle")}</g>
);
const CampaignApp: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g><rect width={360} height={740} fill="#1A1405" /><circle cx={180} cy={250} r={110} fill="#C2A633" />{T(180, 285, "D", 110, "#3A2E08", 700, "middle")}{T(180, 440, "Yeni üyelere", 30, "#FFF", 700, "middle")}{T(180, 480, "ÜCRETSİZ DOGE", 34, AMB, 700, "middle")}{T(180, 540, "15 Mart – 15 Nisan", 20, X.dim, 600, "middle")}<rect x={60} y={600} width={240} height={60} rx={16} fill={AMB} />{T(180, 640, "Hemen üye ol", 24, "#111", 700, "middle")}</g>
);
const QuarterPrice: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    {[0, 1].map((i) => <g key={i} transform={`translate(${520 + i * 880},540)`}><rect x={-320} y={-260} width={640} height={520} rx={24} fill="#111824" stroke={i ? AMB : "#2A3850"} strokeWidth={6} />{T(0, -160, i ? "BURADA" : "DIŞARIDA", 54, i ? AMB : X.dim, 700, "middle")}{T(0, 40, i ? "1 ₺" : "4 ₺", 200, i ? AMB : "#FFF", 700, "middle")}{T(0, 170, "aynı Dogecoin", 38, X.dim, 600, "middle")}</g>)}
    <g opacity={rp(t, a + 0.8, a + 1.3)}>{T(960, 960, "piyasa fiyatının çeyreği", 52, RED, 700, "middle")}</g>
  </g>
);
const NightCity: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSkyN)" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 165 - 20} y={300 - (i % 4) * 60} width={150} height={800} fill={["#121722", "#161C28", "#0F141E"][i % 3]} />)}
    {Array.from({ length: 140 }, (_, i) => { const lit = hash2(i) > 0.4; return <rect key={i} x={(hash2(i * 3) * 1920) | 0} y={(260 + hash2(i * 7) * 600) | 0} width={22} height={30} fill={lit ? (i % 7 ? "#FFCF7A" : CY) : "#0A0D12"} opacity={lit ? 0.55 + 0.2 * Math.sin(t + i) : 1} />; })}
    <rect x={0} y={920} width={1920} height={160} fill="#07090C" />
  </g>
);
const hash2 = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const LiraFall: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = rp(t, a + 0.2, a + 3);
  const pts = Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${200 + i * 38},${300 + (i / 40) * k * 500 + Math.sin(i * 1.3) * 18}`).join(" ");
  return <g><rect width={1920} height={1080} fill="#0A0B10" />{T(200, 200, "₺  değer", 64, RED, 700)}<path d={pts} stroke={RED} strokeWidth={8} fill="none" opacity={0.9} /></g>;
};
const Timeline: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const items: [string, string][] = [["20 Nisan", "En yoğun işlem günü"], ["20 Nisan", "“Doge günü”"], ["20 Nisan · 17:57", "Kurucu ülkeden çıkıyor"]];
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <line x1={300} y1={540} x2={300 + 1320 * rp(t, a + 0.1, a + 2)} y2={540} stroke={AMB} strokeWidth={4} />
      {items.map(([d, s], i) => { const k = rp(t, a + 0.4 + i * 0.9, a + 0.9 + i * 0.9); return <g key={i} opacity={k} transform={`translate(${380 + i * 580},540)`}><circle r={18} fill={i === 2 ? RED : AMB} />{T(0, -60, d, 40, i === 2 ? RED : AMB, 700, "middle")}{T(0, 90, s, 38, "#FFF", 600, "middle")}</g>; })}
    </g>
  );
};
const TvStudio: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0E16" />
    <rect x={200} y={120} width={1520} height={760} fill="#121A2A" stroke="#2A3850" strokeWidth={6} />
    <rect x={200} y={760} width={1520} height={120} fill={RED} />{T(260, 840, "SON DAKİKA · borsada 2 milyar dolar iddiası", 52, "#FFF", 700)}
    <Sil x={960} y={760} s={1.3} t={t} kind="suit" pose="point" rim={CY} seed={33} />
    <rect x={220} y={140} width={200} height={60} fill={RED} />{T(320, 182, "CANLI", 34, "#FFF", 700, "middle")}
  </g>
);
const SocialPost: React.FC<{ t: number; a: number; gone?: number }> = ({ t, a, gone }) => {
  const g = gone !== undefined && t > a + gone;
  return g ? (
    <g><rect width={360} height={740} fill="#0B0E14" />{T(180, 360, "Hesap bulunamadı", 28, "#FFF", 700, "middle")}{T(180, 400, "Bu hesap kapatıldı", 20, X.dim, 600, "middle")}</g>
  ) : (
    <g><rect width={360} height={740} fill="#0E1218" /><circle cx={60} cy={80} r={34} fill={X.sil2} />{T(110, 74, "Faruk Fatih Özer", 22, "#FFF", 700)}{T(110, 100, "@hesap", 16, X.dim, 500)}<rect x={20} y={140} width={320} height={4} fill="#1F2938" />{["Yurt dışına ortaklık", "görüşmeleri için çıktım.", "Rakamlar doğru değil.", "Döneceğim."].map((l, i) => <g key={i}>{T(24, 200 + i * 40, l, 22, "#E6E9EE", 600)}</g>)}{T(24, 400, "(özet · basında aktarılan)", 16, X.dim, 500)}</g>
  );
};
const PassKey: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#07090E" />
    <rect width={1920} height={1080} fill="url(#pGrid)" />
    <g transform="translate(960,480)"><rect x={-520} y={-90} width={1040} height={180} rx={20} fill="#111824" stroke={AMB} strokeWidth={4} />{T(0, 30, "●●●● ●●●● ●●●● ●●●●".slice(0, Math.floor(rp(t, a + 0.2, a + 1.6) * 19)), 80, AMB, 700, "middle")}</g>
    <g opacity={rp(t, a + 1.2, a + 1.8)}>{T(960, 760, "Kasanın kendisi bir şifre", 60, "#FFF", 700, "middle")}</g>
  </g>
);
const Lineup: React.FC<{ t: number; a: number; missing?: boolean }> = ({ t, a, missing = false }) => (
  <g>
    <rect width={1920} height={1080} fill="#14171C" />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={0} x2={1920} y1={200 + i * 100} y2={200 + i * 100} stroke="#FFF" opacity={0.06} />)}
    {Array.from({ length: 6 }, (_, i) => <Sil key={i} x={260 + i * 260} y={960} s={1.1} t={t} kind={i % 2 ? "suit" : "coat"} pose="cuffs" rim="#5A6478" seed={100 + i} hair={i % 3 ? "short" : "long"} />)}
    <g transform="translate(1660,960)">{missing ? <g><rect x={-90} y={-560} width={180} height={560} fill="none" stroke={RED} strokeWidth={6} strokeDasharray="20 14" />{T(0, -270, "?", 160, RED, 700, "middle")}</g> : <Sil x={0} y={0} s={1.1} t={t} kind="coat" pose="stand" rim="#333" op={0.25} seed={7} />}</g>
  </g>
);
const Screenshot: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g><AppBal t={t} a={a} up={false} /><rect x={0} y={0} width={360} height={740} fill="#FFF" opacity={Math.max(0, 1 - (t - a - 0.6) * 4) * (t > a + 0.6 ? 1 : 0)} /><rect x={10} y={10} width={340} height={720} rx={24} fill="none" stroke="#FFF" strokeWidth={4} opacity={0.6} /></g>
);
const TwoDates: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#06080C" />
    {[["20 NİSAN 2021", "kaçtı", RED], ["20 NİSAN 2023", "geri getirildi", AMB]].map(([d, s, c], i) => <g key={i} opacity={rp(t, a + 0.2 + i * 0.8, a + 0.7 + i * 0.8)} transform={`translate(${540 + i * 840},540)`}>{T(0, 0, d, 90, c, 700, "middle")}{T(0, 90, s, 48, "#FFF", 600, "middle")}</g>)}
  </g>
);
const Compare: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = rp(t, a + 0.3, a + 1.4);
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      <rect x={400} y={900 - 700 * (1 - k * 0.0)} width={360} height={700} fill="#3A1A1A" />
      <rect x={400} y={200} width={360} height={700} fill={RED} opacity={0.35} />{T(580, 170, "İddia: 2 milyar $", 46, RED, 700, "middle")}
      <rect x={1160} y={900 - 700 * 0.075 * k} width={360} height={700 * 0.075 * k} fill={AMB} />{T(1340, 830 - 52 * k, "Sonraki tahmin: ~150 milyon $", 40, AMB, 700, "middle")}
      <rect x={300} y={900} width={1320} height={6} fill="#2A3240" />
    </g>
  );
};
const Scale: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const tilt = Math.sin(rp(t, a + 0.3, a + 1.6) * Math.PI * 0.5) * 2 + Math.sin(t * 1.4) * 0.6;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0906" />
      <rect x={950} y={300} width={20} height={600} fill="#5A4A30" /><rect x={760} y={890} width={400} height={30} fill="#5A4A30" />
      <g transform={`translate(960,300) rotate(${tilt})`}>
        <rect x={-560} y={-8} width={1120} height={16} fill="#8A7040" />
        <g transform="translate(-480,0)"><line x1={0} y1={0} x2={0} y2={300} stroke="#8A7040" strokeWidth={4} /><Sil x={0} y={520} s={0.9} t={t} kind="casual" pose="stand" rim={AMB} seed={5} /></g>
        <g transform="translate(480,0)"><line x1={0} y1={0} x2={0} y2={300} stroke="#8A7040" strokeWidth={4} />{Array.from({ length: 10 }, (_, i) => <path key={i} transform={`translate(${(i % 4 - 1.5) * 70},${470 - Math.floor(i / 4) * 40})`} d="M-30,0 L30,0 L24,-30 L-24,-30Z" fill="#D9A93A" />)}<rect x={-160} y={480} width={320} height={14} fill="#8A7040" /></g>
      </g>
      {T(960, 1020, "52 kg altın ≈ bir insanın ağırlığı", 44, AMB, 700, "middle")}
    </g>
  );
};
const TwoQuotes: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A0806" />
    <g opacity={rp(t, a + 0.2, a + 0.7)} transform="translate(520,540)"><rect x={-400} y={-220} width={800} height={440} rx={20} fill="#151210" stroke="#3A3028" strokeWidth={4} />{T(0, -40, "“Kimseyi", 64, "#FFF", 700, "middle")}{T(0, 50, "dolandırmadım.”", 64, "#FFF", 700, "middle")}</g>
    <g opacity={rp(t, a + 1.0, a + 1.5)} transform="translate(1400,540)"><rect x={-400} y={-220} width={800} height={440} rx={20} fill="#151210" stroke={AMB} strokeWidth={4} />{T(0, -40, "“Tüm kararlar", 64, AMB, 700, "middle")}{T(0, 50, "bana aittir.”", 64, AMB, 700, "middle")}</g>
  </g>
);
const Steps: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const s: [string, string][] = [["20 yaş", "yazılım şirketi"], ["22 yaş", "borsa"], ["", "Porsche çekilişi"], ["", "çeyrek fiyata para"]];
  return (
    <g>
      <rect width={1920} height={1080} fill="#07090E" />
      {s.map(([y, l], i) => { const k = rp(t, a + 0.3 + i * 0.6, a + 0.8 + i * 0.6); return <g key={i} opacity={k} transform={`translate(${260 + i * 420},${800 - i * 150})`}><rect x={-160} y={0} width={360} height={20} fill={AMB} />{T(20, -80, y, 44, AMB, 700, "middle")}{T(20, -30, l, 36, "#FFF", 600, "middle")}</g>; })}
      <Sil x={lp(260, 1520, rp(t, a + 0.3, a + 2.6))} y={lp(800, 350, rp(t, a + 0.3, a + 2.6))} s={0.9} t={t} kind="suit" pose="stand" rim={AMB} seed={9} />
    </g>
  );
};

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K7_01_SECONDS));
  return raw;
})();

export const K7Video01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K7_01_SECONDS - 1.5, K7_01_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <PFrame>
          {s.r(t, s.from, s.to)}
          <Atmos t={t} tone={s.tone ?? "night"} dust={0.35} rays={0.15} seed={n} />
          <Sweep t={t} a={s.from} c="#FFE0A8" />
          <Grain t={t} k={0.8} />
        </PFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cutFlash * 0.12, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k7-01.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K7_01_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.14 : 0.06} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
