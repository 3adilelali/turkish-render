import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k7-02-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { Big, HCam, SubBtn, rp } from "../../components/Hayat";
import { X, T, PFrame, Grain, Sil } from "../../components/Protokol";
import { Dossier, Chapter, DateCard, BigNum } from "../../components/Protokol2";
import { MedMap, MapMode, mp, CITY } from "../../components/Protokol3";
import {
  AnkaraBayram, Reception, EmbassyFront, Telegram, Strongbox, StudyRoom, Leica, ClassifiedDoc, FilmRoll, Notes, CarNight, Chain, PressRoom,
  HotelSite, ThreePaths, Posters, TwoBooks, RouteMarks, TwoTools, TriFrames,
} from "../../components/Protokol4";

// Kanal 5 · Protokol X · k7-02 · "Hitler'e Sır Satan Uşağın Parası Neden Sahteydi?" (Çiçero · İlyas Bazna)
// Ses: Gemini TTS (Gacrux, gemini-3.8-flash-tts, 7 parça + 1 yama). Kelime zamanları faster-whisper → snap_words (script kelimelerine).
// Kaynaklar: القناة 5/فيديوهات/k7-02-cicero/بحث.md. Tarafsız, kaynaklı; çelişen yerler "kaynaklara göre" diye söylenir.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K7_02_SECONDS = Math.ceil(VOICE_END + 4);
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string | string[]; r: R; html?: R; sfx?: string; tone?: Tone };
type Z = { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; k?: number };

const AMB = X.amber, RED = X.red;
const cam = (t: number, a: number, b: number, node: React.ReactNode, p: Z = {}, dz: [number, number] = [1, 1.08]) => <HCam t={t} a={a} b={b} z={p.z ?? dz} c0={p.c0} c1={p.c1} k={p.k}>{node}</HCam>;
const B = (text: string, o: { y?: number; size?: number; c?: string; at?: number; sub?: string } = {}): R => (t, a) => <Big t={t} at={a + (o.at ?? 0.3)} text={text} sub={o.sub} y={o.y ?? 80} size={o.size ?? 72} c={o.c ?? "#FFF"} />;
const mpC = (c: string): [number, number] => mp(...CITY[c]);
// sahneler
const map = (mode: MapMode, p: Z & { dur?: number; labels?: string[] } = {}): R => (t, a, b) =>
  cam(t, a, b, <MedMap t={t} a={a} mode={mode} dur={p.dur} labels={p.labels} />, p, [1.0, 1.08]);
const routeMap = (pts: [string, number, number][], arcs: [number, number][] = [], p: Z = {}): R => (t, a, b) =>
  cam(t, a, b, <g><MedMap t={t} a={a} mode="plain" labels={[]} /><RouteMarks t={t} a={a} pts={pts} arcs={arcs} /></g>, p, [1.0, 1.08]);
const dos = (title: string, lines: string[], p: Z & { stamp?: string; no?: string; at?: number } = {}): R => (t, a, b) =>
  cam(t, a, b, <Dossier t={t} a={a} title={title} lines={lines} stamp={p.stamp} stampAt={p.at} no={p.no ?? "DOSYA 02"} />, p, [1.0, 1.05]);
const date = (d: string, place?: string, c?: string): R => (t, a, b) => cam(t, a, b, <DateCard t={t} a={a} date={d} place={place} c={c} />, {}, [1.0, 1.04]);
const chap = (n: string, title: string, sub?: string): R => (t, a, b) => cam(t, a, b, <Chapter t={t} a={a} n={n} title={title} sub={sub} />, {}, [1.0, 1.05]);
const num = (to: number, label: string, o: { suffix?: string; prefix?: string; c?: string; from?: number; dur?: number } = {}): R => (t, a, b) =>
  cam(t, a, b, <BigNum t={t} a={a} to={to} from={o.from} label={label} suffix={o.suffix} prefix={o.prefix} c={o.c} dur={o.dur} />, {}, [1.0, 1.05]);
const quote = (q: string, who = "Protokol X", c = AMB): R => (t, a, b) => cam(t, a, b, (
  <g>
    <rect width={1920} height={1080} fill="#0A0806" />
    <ellipse cx={960} cy={540} rx={900} ry={480} fill="url(#pGlowA)" opacity={0.18} />
    {T(260, 360, "“", 260, c, 700)}
    {q.split("\n").map((l, i) => <g key={i} opacity={rp(t, a + 0.2 + i * 0.35, a + 0.7 + i * 0.35)}>{T(960, 470 + i * 110, l, 70, "#FFF", 700, "middle")}</g>)}
    <g opacity={rp(t, a + 0.9, a + 1.4)}>{T(960, 470 + q.split("\n").length * 110 + 40, `— ${who}`, 38, c, 600, "middle")}</g>
  </g>
), {}, [1.0, 1.06]);
const list = (title: string, items: string[], c = AMB): R => (t, a, b) => cam(t, a, b, (
  <g>
    <rect width={1920} height={1080} fill="#07090E" /><rect width={1920} height={1080} fill="url(#pGrid)" />
    {T(200, 220, title, 64, c, 700)}
    {items.map((s, i) => <g key={i} opacity={rp(t, a + 0.3 + i * 0.45, a + 0.7 + i * 0.45)} transform={`translate(${(1 - rp(t, a + 0.3 + i * 0.45, a + 0.7 + i * 0.45)) * -40},0)`}><rect x={200} y={300 + i * 130} width={90} height={90} rx={12} fill={c} />{T(245, 365 + i * 130, String(i + 1), 54, "#111", 700, "middle")}{T(330, 368 + i * 130, s, 56, "#FFF", 700)}</g>)}
  </g>
), {}, [1.0, 1.05]);
const sil = (node: (t: number) => React.ReactNode, bg = "#0B0E14", p: Z = {}): R => (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill={bg} /><ellipse cx={960} cy={620} rx={760} ry={520} fill="url(#pGlowA)" opacity={0.22} /><rect x={0} y={860} width={1920} height={220} fill="#07090C" /><ellipse cx={960} cy={880} rx={600} ry={60} fill="#FFE0A8" opacity={0.05} />{node(t)}</g>, p, [1.0, 1.1]);
const photo = (file: string, cap: string, credit: string, p: Z & { blur?: number } = {}): R => (t, a, b) => cam(t, a, b, (
  <g>
    <defs><filter id={`pb${file}`}><feGaussianBlur stdDeviation={p.blur ?? 0} /><feColorMatrix type="saturate" values="0.55" /></filter></defs>
    <image href={staticFile(`img/k7-02/${file}.jpg`)} x={-40} y={-30} width={2000} height={1140} preserveAspectRatio="xMidYMid slice" filter={`url(#pb${file})`} />
    <rect width={1920} height={1080} fill="#0A1018" opacity={0.18} />
    <rect width={1920} height={1080} fill="url(#pShade)" />
    <g opacity={rp(t, a + 0.4, a + 0.9)}><rect x={150} y={130} width={cap.length * 21 + 60} height={64} rx={8} fill="#05070A" opacity={0.85} />{T(180, 173, cap, 32, AMB, 700)}</g>
    {T(1800, 1000, credit, 20, "#C9CED6", 500, "end", { opacity: 0.7 } as React.SVGProps<SVGTextElement>)}
  </g>
), p, [1.02, 1.12]);
const fig = (t: number, x: number, o: { pose?: "stand" | "think" | "head" | "phone" | "hold" | "cuffs" | "bag" | "point" | "sit"; kind?: "hood" | "suit" | "coat" | "casual"; rim?: string; s?: number; dir?: 1 | -1 } = {}) =>
  <Sil x={x} y={1000} s={o.s ?? 1.5} t={t} kind={o.kind ?? "coat"} pose={o.pose ?? "stand"} rim={o.rim ?? AMB} dir={o.dir} hair="short" seed={x} />;
// yeni sahneler (Protokol4)
const bayram = (p: Z = {}): R => (t, a, b) => cam(t, a, b, <AnkaraBayram t={t} a={a} />, p, [1.0, 1.08]);
const recep = (p: Z = {}): R => (t, a, b) => cam(t, a, b, <Reception t={t} />, p, [1.0, 1.1]);
const emb = (label: string, tone: "de" | "uk", p: Z = {}): R => (t, a, b) => cam(t, a, b, <EmbassyFront t={t} a={a} label={label} tone={tone} />, p, [1.0, 1.1]);
const tele = (from: string, to: string, text: string, stamp = "ŞİFRELİ", p: Z = {}): R => (t, a, b) => cam(t, a, b, <Telegram t={t} a={a} from={from} to={to} text={text} stamp={stamp} />, p, [1.0, 1.06]);
const box = (open = 99, p: Z = {}): R => (t, a, b) => cam(t, a, b, <Strongbox t={t} a={a} open={open} />, p, [1.0, 1.08]);
const study = (scene: "door" | "piano" | "sleep" | "box", p: Z = {}): R => (t, a, b) => cam(t, a, b, <StudyRoom t={t} a={a} scene={scene} />, p, [1.0, 1.08]);
const leica = (shots = 3, p: Z = {}): R => (t, a, b) => cam(t, a, b, <Leica t={t} a={a} shots={shots} />, p, [1.0, 1.08]);
const cdoc = (title?: string, lines?: string[], stamp?: string, pages = 3, p: Z = {}): R => (t, a, b) => cam(t, a, b, <ClassifiedDoc t={t} a={a} title={title} lines={lines} stamp={stamp} pages={pages} />, p, [1.0, 1.06]);
const film = (label?: string, p: Z = {}): R => (t, a, b) => cam(t, a, b, <FilmRoll t={t} a={a} label={label} />, p, [1.0, 1.06]);
const notes = (o: { fake?: number; count?: number; label?: string } = {}, p: Z = {}): R => (t, a, b) => cam(t, a, b, <Notes t={t} a={a} fake={o.fake} count={o.count} label={o.label} />, p, [1.0, 1.08]);
const car = (chase = false, p: Z = {}): R => (t, a, b) => cam(t, a, b, <CarNight t={t} a={a} chase={chase} />, p, [1.0, 1.08]);
const chain = (nodes: string[], sub: string[] = [], c = AMB, p: Z = {}): R => (t, a, b) => cam(t, a, b, <Chain t={t} a={a} nodes={nodes} sub={sub} c={c} />, p, [1.0, 1.05]);
const press = (count?: string, p: Z = {}): R => (t, a, b) => cam(t, a, b, <PressRoom t={t} a={a} count={count} />, p, [1.0, 1.08]);
const hotel = (pay = false, p: Z = {}): R => (t, a, b) => cam(t, a, b, <HotelSite t={t} a={a} pay={pay} />, p, [1.0, 1.08]);
const threep = (items: [string, string][]): R => (t, a, b) => cam(t, a, b, <ThreePaths t={t} a={a} items={items} />, {}, [1.0, 1.04]);
const posters: R = (t, a, b) => cam(t, a, b, <Posters t={t} a={a} />, {}, [1.0, 1.05]);
const books: R = (t, a, b) => cam(t, a, b, <TwoBooks t={t} a={a} />, {}, [1.0, 1.05]);
const tools = (extra?: string, p: Z = {}): R => (t, a, b) => cam(t, a, b, <TwoTools t={t} a={a} extra={extra} />, p, [1.0, 1.08]);
const tri = (labels: [string, string, string], files: [string?, string?, string?] = []): R => (t, a, b) =>
  cam(t, a, b, <TriFrames t={t} a={a} labels={labels} imgs={files.map((f) => (f ? staticFile(`img/k7-02/${f}.jpg`) : undefined)) as [string?, string?, string?]} />, {}, [1.0, 1.05]);

const SHOTS: Sh[] = [
  // ───── açılış
  { c: "Yirmi dokuz Ekim", r: date("29 EKİM 1943", "ANKARA · CUMHURİYET'İN 20. YILI", AMB), sfx: "tick" },
  { c: "Ankara'da bayram var", r: bayram() },
  { c: "Sokaklarda bayraklar", r: photo("ankara2", "Ankara · 1940'lar", "DGPI Arşivi · Wikimedia Commons") },
  { c: "resepsiyonlarda diplomatlar", r: recep() },
  { c: "Savaş, Türkiye'nin kapısında", r: map("plain", { labels: ["ANKARA"] }), html: B("Savaş, kapının eşiğinde", { y: 880, size: 60 }) },
  { c: "Ama Türkiye savaşın dışında", r: map("plain", { labels: ["ANKARA"], dur: 4 }), html: B("Türkiye savaşın dışında", { y: 880, size: 60, c: AMB }) },
  { c: "Aynı gün, Alman", r: emb("ALMAN BÜYÜKELÇİLİĞİ", "de"), sfx: "knock" },
  { c: "Berlin'den geliyor", r: tele("BERLİN", "ANKARA", "EVET. SATIN ALIN.") },
  { c: "Kısacık bir cevap", r: tele("BERLİN", "ANKARA", "EVET. SATIN ALIN.", "ŞİFRELİ", { z: [1.25, 1.4] }), sfx: "tick" },
  { c: "Neyi satın alıyorlar", r: leica(4), html: B("Neyi satın alıyorlar?", { y: 880, size: 60 }) },
  { c: "Adam, dünyanın en güçlü", r: emb("İNGİLİZ BÜYÜKELÇİLİĞİ", "uk") },
  { c: "O evdeki kasada", r: box(1.5) },
  { c: "çok gizli damgalı", r: cdoc() },
  { c: "için de yirmi bin", r: notes({ count: 6, label: "20.000 £" }), html: B("20.000 sterlin", { y: 880, size: 64, c: AMB }) },
  { c: "Adamın mesleği uşak", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "coat" })}</>, "#0B0E14", { z: [1.0, 1.15] }), html: B("UŞAK", { size: 120, c: AMB, y: 120 }) },
  { c: "Büyükelçinin ceketini fırçalıyor", r: tools() },
  { c: "Kimse ona bakmıyor", r: study("door") },
  { c: "Çünkü bir uşağa", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "coat", rim: "#5A6478" })}</>, "#0B0E14", { z: [1.15, 1.3], c0: [960, 560] }) },
  { c: "İşte bu yüzden", r: film("savaşın en büyük sırları"), sfx: "drone" },
  { c: "Peki bir uşak", r: box(0.8, { z: [1.05, 1.25] }), html: B("Nasıl?", { size: 120, c: AMB, y: 120 }) },
  { c: "Almanya bu sırlarla", r: chain(["BAZNA", "MOYTSİŞ", "FON PAPEN", "BERLİN"], ["uşak", "SD", "büyükelçi", "Dışişleri"]) },
  { c: "Ve bu adam", r: notes({ fake: 1.4, count: 6, label: "Para gerçek miydi?" }) },
  { c: "Burası Protokol X", r: dos("PROTOKOL X", ["Dosya 02 · Çiçero", "Kaynak: akademik makale, arşiv, hatıralar", "█"]), sfx: "boom" },
  { c: "Bir. Bir uşağın", r: list("Bu dosyada", ["Uşak, sırlara nasıl ulaştı?", "Almanya neden kullanamadı?", "Para neden sahte çıktı?"]) },
  { c: "İki. Almanya'nın", r: chain(["BELGELER", "BERLİN", "?"], ["elde", "kullanılmadı", ""], RED) },
  { c: "Üç. Bu adamın", r: notes({ fake: 0.8, count: 3, label: "Sahte çıktı" }) },
  { c: "Hikâyeler birbirine", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#050608" />{T(960, 500, "Hikâyeler birbirine benzeyebilir.", 70, "#FFF", 700, "middle")}<g opacity={rp(t, a + 2.2, a + 2.8)}>{T(960, 620, "Ama hiçbiri bizim anlattığımız gibi değil.", 70, AMB, 700, "middle")}</g></g>, {}, [1.0, 1.05]) },
  { c: "Dosya açılıyor", r: dos("PROTOKOL X", ["Dosya 02 · Çiçero", "Kaynak: akademik makale, arşiv, hatıralar", "█"], { stamp: "AÇILDI", at: 0.6 }), sfx: "boom" },
  { c: "Başlamadan önce tek", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#050608" />{T(960, 520, "PROTOKOL X", 130, AMB, 700, "middle", { letterSpacing: 16 } as React.SVGProps<SVGTextElement>)}{T(960, 620, "Bir sonraki dosya daha güçlü.", 52, "#FFF", 600, "middle")}</g>, {}, [1.0, 1.06]), html: (t, a) => <SubBtn t={t} at={a + 2.4} /> },

  // ───── Bölüm 1
  { c: "Bölüm bir", r: chap("BÖLÜM 1", "Priştine'den İstanbul'a", "1904 · Priştine"), sfx: "boom" },
  { c: "Adı İlyas Bazna", r: photo("bazna", "İlyas (Elyesa) Bazna", "Wikimedia Commons · kamu malı") },
  { c: "Bin dokuz yüz dört yılının", r: date("TEMMUZ 1904", "PRİŞTİNE · OSMANLI TOPRAĞI") },
  { c: "O gün Priştine", r: (t, a, b) => again("Bin dokuz yüz dört yılının", t, a, b, 0) },
  { c: "Arnavut asıllı bir ailenin", r: routeMap([["PRİŞTİNE", 21.17, 42.66]], [], { z: [1.2, 1.4], c0: mp(21.17, 42.66) }) },
  { c: "Bin dokuz yüz on sekizde", r: routeMap([["PRİŞTİNE", 21.17, 42.66], ["İSTANBUL", 29.0, 41.0]], [[0, 1]]), html: B("1918 · göç", { y: 880, size: 64 }) },
  { c: "Varlıklı bir hayatı", r: (t, a, b) => again("Bin dokuz yüz on sekizde", t, a, b, 0) },
  { c: "Okulda tutunamıyor", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "casual" })}</>, "#0E1218", { z: [1.0, 1.1] }) },
  { c: "Sonraki yıllar, bir işten", r: list("İşten işe", ["Şoförlük", "Kapıcılık", "Bekçilik", "Tamircilik"]) },
  { c: "Bir kaynak, gençliğinde", r: dos("KAYNAK NOTU", ["Fransa'da çalışma kampı (3 yıl)", "Kaynağı: kendi anlatımı", "Güvenilirlik: düşük"], { no: "BAZNA" }) },
  { c: "Ama burada dikkatli olalım", r: quote("Onun kendi anlatımı,\nen az güvenilir kaynak.", "Protokol X notu") },
  { c: "Ve onun kendi", r: (t, a, b) => again("Ama burada dikkatli olalım", t, a, b, 0) },
  { c: "Herkesin söylediği bir şey", r: list("Diplomat kapılarında", ["Yugoslavya temsilcisi", "Amerikan Elçiliği", "Alman Elçiliği"]) },
  { c: "Önce Yugoslavya'nın Ankara'daki", r: (t, a, b) => again("Herkesin söylediği bir şey", t, a, b, 0) },
  { c: "Sonra bin dokuz yüz kırk iki", r: emb("ALMAN BÜYÜKELÇİLİĞİ", "de") },
  { c: "Albert Yenke adında", r: (t, a, b) => again("Sonra bin dokuz yüz kırk iki", t, a, b, 0) },
  { c: "Bazı kaynaklar, Yenke'nin", r: dos("ALBERT YENKE", ["Alman diplomat", "Bazı kaynaklara göre: Ribbentrop'un akrabası", "Bazna'yı işten kovdu"]) },
  { c: "Ve burada küçük bir detay", r: quote("Sebep: mektupları okuması.", "Kaynaklara göre") },
  { c: "Bu detayı aklında tut", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.1, 1.3], c0: [960, 560] }), sfx: "drone" },
  { c: "Alman istihbaratçı Ludwig", r: dos("LUDWIG MOYZISCH", ["Alman istihbaratçı (SD)", "Resmî unvan: ticaret ataşesi", "Değerlendirmesi: hırslı, kibirli, tehlikeli"]) },
  { c: "hırslı, kibirli, hayatta", r: (t, a, b) => again("Alman istihbaratçı Ludwig", t, a, b, 0) },
  { c: "Ve tam bu", r: (t, a, b) => again("Alman istihbaratçı Ludwig", t, a, b, 1) },
  { c: "İşte bin dokuz yüz kırk üçün yazında", r: study("door", { z: [1.1, 1.3] }), html: B("Yaz 1943", { y: 880, size: 64 }) },

  // ───── Bölüm 2
  { c: "Bölüm iki", r: chap("BÖLÜM 2", "Büyükelçinin uşağı", "Ankara · 1943"), sfx: "boom" },
  { c: "Unutma, daha bin dokuz", r: date("1943", "ANKARA · SAVAŞIN ORTASI") },
  { c: "Ama iki taraf da Ankara'yı", r: chain(["İNGİLİZLER", "ANKARA", "ALMANLAR"], ["çekmek istiyor", "tarafsız", "çekmek istiyor"]) },
  { c: "bazen tarafsız kalmasını", r: (t, a, b) => again("Ama iki taraf da Ankara'yı", t, a, b, 0) },
  { c: "Bu yüzden Ankara", r: photo("ankara1", "Ankara · 1940'lar", "DGPI Arşivi · Wikimedia Commons") },
  { c: "Bir akademik çalışma", r: (t, a, b) => again("Bu yüzden Ankara", t, a, b, 0) },
  { c: "burada işlenip istihbarata", r: (t, a, b) => again("Bu yüzden Ankara", t, a, b, 1) },
  { c: "Alman diplomatlar, İngiliz", r: recep({ z: [1.1, 1.25] }) },
  { c: "Hepsi aynı şehirde", r: (t, a, b) => again("Alman diplomatlar, İngiliz", t, a, b, 0) },
  { c: "Ve o şehirde, İngiliz", r: emb("İNGİLİZ BÜYÜKELÇİLİĞİ", "uk", { z: [1.2, 1.3] }) },
  { c: "Sekreter de onu", r: (t, a, b) => again("Ve o şehirde, İngiliz", t, a, b, 0) },
  { c: "Büyükelçinin adı", r: dos("SİR HUGHE KNATCHBULL-HUGESSEN", ["İngiltere'nin Ankara Büyükelçisi", "Uşağı: Bazna (kavas)", "1943"]) },
  { c: "elçilik kapısındaki hizmetli", r: (t, a, b) => again("Büyükelçinin adı", t, a, b, 0) },
  { c: "Bazna'nın tam olarak ne zaman", r: list("Başlangıç tarihi (kaynaklara göre)", ["Temmuz 1943", "Eylül 1943", "Ekim 1943"]) },
  { c: "Peki geçmişi araştırılıyor mu", r: dos("GEÇMİŞ ARAŞTIRMASI", ["Yapıldı mı?", "Görünüşe göre: hayır", "█"], { stamp: "YOK", at: 1.2 }) },
  { c: "Görevi, büyükelçinin elbiselerine", r: tools("Fırça · üniforma · koruma") },
  { c: "Ona üniforma veriliyor", r: (t, a, b) => again("Görevi, büyükelçinin elbiselerine", t, a, b, 0) },
  { c: "Şimdi diyeceksin ki", r: quote("Peki ya dil?", "Protokol X") },
  { c: "İngilizce bilmeyen biri", r: (t, a, b) => again("Şimdi diyeceksin ki", t, a, b, 0) },
  { c: "Bazı İngilizler, onun", r: dos("DİL", ["Bazı İngilizler: bilmiyor sanıyor", "Başka kaynak: basit İngilizce okuyabiliyor", "Akademik makale: muamma"]) },
  { c: "basit bir İngilizceyi", r: (t, a, b) => again("Bazı İngilizler, onun", t, a, b, 0) },
  { c: "bu konunun hiçbir", r: (t, a, b) => again("Bazı İngilizler, onun", t, a, b, 1) },
  { c: "onun anlamadığını sanıyorsa", r: (t, a, b) => again("Bazı İngilizler, onun", t, a, b, 2) },
  { c: "Şimdi burada biraz durmamız", r: sil((t) => <>{fig(t, 960, { pose: "point" })}</>, "#0B0E14", { z: [1.0, 1.15] }), html: B("Biraz durmamız lazım", { y: 880, size: 60 }) },
  { c: "bir uşak, o", r: (t, a, b) => again("Şimdi burada biraz durmamız", t, a, b, 0) },
  { c: "Büyükelçinin evinde resmî yazışmalar", r: cdoc("TELGRAF KOPYALARI", ["████ ██████ ███", "██████ ████ ████████"], "GİZLİ", 3) },
  { c: "Kaynaklar burada ayrışıyor", r: (t, a, b) => again("Büyükelçinin evinde resmî yazışmalar", t, a, b, 0) },
  { c: "Kimi anlatımlara göre bir kasada", r: box(1.2) },
  { c: "Anlatılanlara göre Bazna", r: (t, a, b) => again("Kimi anlatımlara göre bir kasada", t, a, b, 0) },
  { c: "anahtarının bir kopyasını", r: study("box") },
  { c: "Ve büyükelçi? Kimi", r: study("sleep") },
  { c: "piyano çalarken", r: study("piano") },
  { c: "bir uşağın erişebileceği", r: box(0.4, { z: [1.0, 1.2] }) },
  { c: "Bir şey daha var", r: sil((t) => <>{fig(t, 700, { pose: "stand", kind: "suit", rim: "#B98B3C" })}{fig(t, 1220, { pose: "stand", kind: "coat", dir: -1 })}</>) },
  { c: "İngiliz Dışişleri büyükelçiye", r: dos("RESMÎ KINAMA", ["28 Ağustos 1945", "Konu: güvenlik", "█"], { stamp: "KINAMA", at: 1.2, no: "BÜYÜKELÇİ" }) },
  { c: "Yirmi sekiz Ağustos", r: (t, a, b) => again("İngiliz Dışişleri büyükelçiye", t, a, b, 0) },
  { c: "Bir kaynak, büyükelçinin daha", r: quote("Anahtarlar ve belge kutuları\nortada bırakılmamalı.", "Uyarı · bir kaynağa göre") },
  { c: "kutularını ortada bırakmaması", r: (t, a, b) => again("Bir kaynak, büyükelçinin daha", t, a, b, 0) },
  { c: "Ama bu, sonraki sahne", r: study("door", { z: [1.4, 1.6] }) },

  // ───── Bölüm 3
  { c: "elindeki şeyin değerini", r: (t, a, b) => again("Ama bu, sonraki sahne", t, a, b, 0) },
  { c: "Bölüm üç", r: chap("BÖLÜM 3", "Pazarlık", "26 Ekim 1943"), sfx: "boom" },
  { c: "Yirmi altı Ekim", r: date("26 EKİM 1943 · AKŞAM", "ALMAN BÜYÜKELÇİLİĞİ · ANKARA", RED), sfx: "tick" },
  { c: "Onu ilk karşılayan", r: emb("ALMAN BÜYÜKELÇİLİĞİ", "de", { z: [1.2, 1.3] }) },
  { c: "Sonra iş, başka", r: (t, a, b) => again("Onu ilk karşılayan", t, a, b, 0) },
  { c: "Kartvizitinde ticaret ataşesi", r: dos("MOYZISCH · KARTVİZİT", ["Ticaret ataşesi", "Gerçek görev: SD (SS istihbaratı)", "█"], { no: "ANKARA" }) },
  { c: "Gerçek görevi ise", r: (t, a, b) => again("Kartvizitinde ticaret ataşesi", t, a, b, 0) },
  { c: "Bazna'nın teklifi basit", r: cdoc("TEKLİF", ["Çok gizli belgelerin fotoğrafları", "Karşılığı: 20.000 sterlin"], "TEKLİF", 2) },
  { c: "çok gizli ve", r: (t, a, b) => again("Bazna'nın teklifi basit", t, a, b, 0) },
  { c: "Karşılığında, yirmi bin", r: notes({ count: 3, label: "20.000 £" }) },
  { c: "Moytsiş bu rakamı pahalı", r: sil((t) => <>{fig(t, 700, { pose: "think", kind: "suit", rim: "#B98B3C" })}{fig(t, 1220, { pose: "stand", kind: "coat", dir: -1 })}</>) },
  { c: "Kaynaklardan birine göre", r: (t, a, b) => again("Moytsiş bu rakamı pahalı", t, a, b, 0) },
  { c: "Almanlar kabul etmezse", r: (t, a, b) => again("Moytsiş bu rakamı pahalı", t, a, b, 1) },
  { c: "Burada bir soru olmalı", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.1, 1.3] }), html: B("Neden?", { size: 120, c: AMB, y: 120 }) },
  { c: "Para mı? Öfke", r: (t, a, b) => again("Burada bir soru olmalı", t, a, b, 0) },
  { c: "Moytsiş'in kitabında, Bazna'nın", r: dos("BAZNA'NIN BABASI", ["Moytsiş'in kitabı: bir İngiliz'in vurduğu söylenir", "Sonradan: doğru olmadığı ortaya çıktı", "Asıl sebep: bilinmiyor"], { no: "ANKARA" }) },
  { c: "Bir İngiliz'in babasını", r: (t, a, b) => again("Moytsiş'in kitabında, Bazna'nın", t, a, b, 0) },
  { c: "sonradan ortaya çıkıyor", r: (t, a, b) => again("Moytsiş'in kitabında, Bazna'nın", t, a, b, 1) },
  { c: "Moytsiş durumu Alman büyükelçisine", r: photo("papen", "Franz von Papen · Alman büyükelçisi", "Bundesarchiv, Bild 183-1988-0113-500 · CC BY-SA 3.0 de", { blur: 3 }) },
  { c: "Fon Papen biliyor", r: tele("ANKARA", "BERLİN", "İNGİLİZ BELGELERİ", "MESAJ") },
  { c: "Ama savaş var", r: (t, a, b) => again("Fon Papen biliyor", t, a, b, 0) },
  { c: "Fon Papen birkaç düzeltme", r: dos("YEŞİL KALEM", ["Sadece büyükelçi imzalayabilir", "Taslak: Moytsiş", "İmza: Fon Papen"], { stamp: "ONAY", at: 1.4, no: "BERLİN'E" }) },
  { c: "Yeşil kalem. Büyükelçilikte", r: quote("Yeşil kalem:\nsadece büyükelçi.", "Büyükelçilik kuralı", "#3CCB6A") },
  { c: "sadece büyükelçide. Yani", r: (t, a, b) => again("Yeşil kalem. Büyükelçilikte", t, a, b, 0) },
  { c: "Ve cevap, Cumhuriyet Bayramı", r: date("29 EKİM 1943", "CUMHURİYET BAYRAMI · BERLİN'DEN ONAY", AMB), sfx: "tick" },
  { c: "Adamına bir ad veriliyor", r: dos("KOD ADI", ["ÇİÇERO", "(Cicero)", "Antik Roma'nın ünlü hatibi"], { stamp: "KOD ADI", at: 1.0 }) },
  { c: "Bir akademik makale, bu adın", r: quote("Çok konuşkan olduğu için\nolabilir.", "Gülmez & Demirkollu · 2013") },
  { c: "Ama Bazna'nın bundan haberi", r: date("1950", "ÇİÇERO OLDUĞUNU ÖĞRENDİĞİ YIL") },
  { c: "Sonra bir şey daha oluyor", r: tele("BERLİN", "MOYZISCH", "BU ADAM NASIL BİRİ?", "SORU") },
  { c: "Moytsiş'in cevabı", r: list("Moytsiş'in değerlendirmesi", ["Maceraperest", "Kibirli", "Hırslı", "Tehlikeli olabilecek biri"], RED) },
  { c: "kibirli, hırslı. Tehlikeli", r: (t, a, b) => again("Moytsiş'in cevabı", t, a, b, 0) },
  { c: "Ama para da hazır", r: notes({ count: 4 }) },
  { c: "Peki kasadaki belgeler", r: box(0.2, { z: [1.0, 1.2] }), html: B("Belgeler ne?", { size: 100, c: AMB, y: 100 }) },

  // ───── Bölüm 4
  { c: "Bölüm dört", r: chap("BÖLÜM 4", "Filmler", "Ekim 1943 – 1944"), sfx: "boom" },
  { c: "Bazna, küçük bir Layka", r: leica(5) },
  { c: "Belgeleri çekiyor, filmleri", r: film("filmler Moytsiş'e") },
  { c: "Teslimler bazen Alman", r: car(false), html: B("Ankara · gece", { y: 880, size: 60 }) },
  { c: "bazen de bir", r: (t, a, b) => again("Teslimler bazen Alman", t, a, b, 0) },
  { c: "Fon Papen anılarında bir şey", r: dos("FON PAPEN · ANILAR", ["Ajan sürekli para istiyordu", "Her yeni telgrafta ücret biraz daha artıyordu"]) },
  { c: "Her yeni telgrafta", r: (t, a, b) => again("Fon Papen anılarında bir şey", t, a, b, 0) },
  { c: "Moytsiş'in anlatımına göre, bir keresinde", r: car(true), sfx: "whoosh" },
  { c: "Ve bunu, sonradan", r: recep({ z: [1.1, 1.3] }), html: B("Alaycı bir ima", { y: 880, size: 60 }) },
  { c: "Yani Ankara'da bu", r: (t, a, b) => again("Ve bunu, sonradan", t, a, b, 0) },
  { c: "Peki filmlerin içinde ne var", r: cdoc("FİLM İÇERİĞİ", ["██████ ████ ███", "████████ ██████"], "GİZLİ", 3) },
  { c: "Moskova, Kahire ve Tahran", r: tri(["MOSKOVA", "KAHİRE", "TAHRAN"], [undefined, undefined, "tehran"]) },
  { c: "İngiltere'nin Türkiye'den hava üsleri", r: cdoc("HAVA ÜSLERİ", ["Türkiye'den üs talebi", "██████ ████ ███"], "GİZLİ", 2) },
  { c: "Churchill, Roosevelt ve İnönü", r: date("ARALIK 1943", "KAHİRE · İNÖNÜ, CHURCHILL, ROOSEVELT") },
  { c: "Aralık bin dokuz", r: (t, a, b) => again("Churchill, Roosevelt ve İnönü", t, a, b, 0) },
  { c: "O masada konuşulanların", r: (t, a, b) => again("Churchill, Roosevelt ve İnönü", t, a, b, 1) },
  { c: "Ve bir de, Overlord", r: dos("OVERLORD", ["Müttefiklerin Fransa çıkarması", "Sadece kod adı", "█"], { no: "BELGE" }), sfx: "boom" },
  { c: "Burada kaynaklar çok dikkatli", r: quote("Çıkarmanın nerede ve ne zaman\nyapılacağı verilmedi.", "Savaş sonrası İngiliz değerlendirmesi") },
  { c: "Çiçero'nun verdiği şey", r: (t, a, b) => again("Burada kaynaklar çok dikkatli", t, a, b, 0) },
  { c: "Çıkarmanın nerede ve", r: (t, a, b) => again("Burada kaynaklar çok dikkatli", t, a, b, 1) },
  { c: "Yani Almanya, Overlord", r: chain(["OVERLORD ADI", "NEREDE?", "NE ZAMAN?"], ["biliniyor", "yok", "yok"], RED) },
  { c: "Belge sayısı konusunda", r: list("Belge sayısı (kaynaklara göre)", ["400'den fazla belge", "52 film rulosu"]) },
  { c: "altı ayda dört", r: (t, a, b) => again("Belge sayısı konusunda", t, a, b, 0) },
  { c: "Sayı değişiyor. Ama", r: (t, a, b) => again("Belge sayısı konusunda", t, a, b, 1) },
  { c: "Ve bir şey daha. Moytsiş'in anlatımına", r: dos("SOFYA TESTİ", ["Moytsiş'in anlatımı", "Berlin, bilginin doğruluğunu test etmek istedi", "Bulgarlara haber verilmedi"], { no: "İDDİA" }) },
  { c: "Çiçero'nun verdiği bilgilerin", r: (t, a, b) => again("Ve bir şey daha. Moytsiş'in anlatımına", t, a, b, 0) },
  { c: "Sofya'nın bombalanacağı bilgisinin", r: (t, a, b) => again("Ve bir şey daha. Moytsiş'in anlatımına", t, a, b, 1) },
  { c: "Bu anlatımın ayrıntıları", r: (t, a, b) => again("Ve bir şey daha. Moytsiş'in anlatımına", t, a, b, 2) },
  { c: "savaşın o yıllarında", r: (t, a, b) => again("Ve bir şey daha. Moytsiş'in anlatımına", t, a, b, 3) },
  { c: "Unutma, ortada çok büyük", r: box(0.3, { z: [1.2, 1.4] }) },
  { c: "savaşın en büyük", r: (t, a, b) => again("Unutma, ortada çok büyük", t, a, b, 0) },
  { c: "Peki Almanya o masada", r: chain(["BELGELER", "BERLİN", "?"], ["masada", "", ""], RED), sfx: "drone" },

  // ───── Bölüm 5
  { c: "Bölüm beş", r: chap("BÖLÜM 5", "Berlin'in şüphesi", "Aralık 1943"), sfx: "boom" },
  { c: "Cevap acı: neredeyse", r: sil((t) => <>{fig(t, 960, { pose: "stand", kind: "suit", rim: "#5A6478" })}</>, "#0B0E14", { z: [1.0, 1.15] }), html: B("Neredeyse hiçbir şey", { y: 880, size: 64, c: RED }) },
  { c: "Alman Dışişleri Bakanı Ribentrop", r: dos("RIBBENTROP", ["Fotoğrafları Hitler'e gösterdi", "Ama güvenmedi", "Şüphe: İngiliz oyunu olabilir"], { no: "BERLİN" }) },
  { c: "Çünkü düşünüyor", r: quote("Bir kaynak neden bu kadar düzenli,\nbu kadar önemli belge getirsin?", "Ribbentrop'un şüphesi") },
  { c: "Moytsiş'in amiri, SS generali", r: chain(["KALTENBRUNNER", "RIBBENTROP", "FON PAPEN"], ["kavgalı", "", "kavgalı"], RED) },
  { c: "Bu yüzden Almanya", r: (t, a, b) => again("Moytsiş'in amiri, SS generali", t, a, b, 0) },
  { c: "Fon Papen anılarında şöyle", r: quote("Kötü haberleri duymak istemiyorlardı.", "Fon Papen · anılar") },
  { c: "Arkasında İngiliz gizli", r: (t, a, b) => again("Fon Papen anılarında şöyle", t, a, b, 0) },
  { c: "Moytsiş de kitabında", r: quote("Belgeler stratejik olarak\nhiçbir zaman kullanılmadı.", "Moytsiş · kitap") },
  { c: "Şöyle düşün. Bir adamın kapısına", r: box(99), html: B("Açılmamış zarf", { y: 880, size: 64, c: AMB }) },
  { c: "Ama o adam", r: (t, a, b) => again("Şöyle düşün. Bir adamın kapısına", t, a, b, 0) },
  { c: "İngilizler ise, tam bu sırada", r: emb("İNGİLİZ BÜYÜKELÇİLİĞİ", "uk") },
  { c: "Ekim bin dokuz yüz kırk üçte İngiliz", r: dos("İNGİLİZ KARŞI İSTİHBARATI", ["Ekim 1943", "Büyükelçilikte güvenlik ihlali", "█"], { no: "KAYIT" }) },
  { c: "Aralık sonunda ise", r: chain(["ALMAN DIŞİŞLERİ", "MÜTTEFİKLER", "İNGİLİZLER"], ["gizli memur", "", "“Çiçero var”"]) },
  { c: "gizlice Müttefikler için", r: (t, a, b) => again("Aralık sonunda ise", t, a, b, 0) },
  { c: "İngiliz Büyükelçiliği'nde Çiçero", r: (t, a, b) => again("Aralık sonunda ise", t, a, b, 1) },
  { c: "Ocak bin dokuz yüz kırk dörtte", r: cdoc("SAHTE BELGE", ["Eden imzası: sahte", "Amaç: tuzak"], "TUZAK", 2) },
  { c: "Sahte bir belge", r: (t, a, b) => again("Ocak bin dokuz yüz kırk dörtte", t, a, b, 0) },
  { c: "Tuzak tutmuyor", r: dos("TUZAK", ["Sonuç: Bazna yakalanmadı", "█"], { stamp: "BAŞARISIZ", at: 0.8, no: "İNGİLİZ" }) },
  { c: "Çiçero yoluna devam ediyor", r: film("devam ediyor"), sfx: "drone" },

  // ───── Bölüm 6
  { c: "Bölüm altı", r: chap("BÖLÜM 6", "Nele Kap", "Ocak – Nisan 1944"), sfx: "boom" },
  { c: "Ocak bin dokuz yüz kırk dört. Moytsiş'in", r: date("OCAK 1944", "MOYZISCH'İN OFİSİ · ANKARA") },
  { c: "Moytsiş ona Elizabet", r: dos("NELE KAP", ["Moytsiş'in yeni sekreteri", "Çok iyi İngilizce", "Babası: Alman diplomat"]) },
  { c: "Çok iyi İngilizce", r: (t, a, b) => again("Moytsiş ona Elizabet", t, a, b, 0) },
  { c: "Bir CIA değerlendirmesine", r: chain(["NELE", "AMERİKALILAR", "İNGİLİZLER"], ["Amerika'ya gitmek istiyor", "ilettiler", ""]) },
  { c: "Bilgi karşılığında Amerika'ya", r: (t, a, b) => again("Bir CIA değerlendirmesine", t, a, b, 0) },
  { c: "Bu anlatımda, Çiçero'nun", r: (t, a, b) => again("Bir CIA değerlendirmesine", t, a, b, 1) },
  { c: "Kaynaklar burada da ayrışıyor", r: list("Kaynaklar ayrışıyor", ["Kimi: İngilizlere gitti", "Kimi: Amerikalılara", "Tarih: Mart sonu / Nisan başı"]) },
  { c: "Tarih de aynı", r: (t, a, b) => again("Kaynaklar burada da ayrışıyor", t, a, b, 0) },
  { c: "Ama hikâyenin sonu", r: (t, a, b) => again("Kaynaklar burada da ayrışıyor", t, a, b, 1) },
  { c: "Nele'nin sonu mu", r: dos("NELE'NİN SONU", ["Amerika'ya gönderildi (CIA değerlendirmesi)", "Bilinen son yer: Kaliforniya"]) },
  { c: "Bin dokuz yüz kırk dördün baharında", r: emb("İNGİLİZ BÜYÜKELÇİLİĞİ", "uk", { z: [1.0, 1.15] }), html: B("Önlemler arttı", { y: 880, size: 64 }) },
  { c: "Kasaya alarm bile", r: box(99), html: B("Kasaya alarm", { y: 880, size: 64, c: RED }) },
  { c: "Çiçero, daha fazla dikkat", r: study("door") },
  { c: "Bavuluyla kapıdan çıkıyor", r: sil((t) => <>{fig(t, 960, { pose: "bag", kind: "coat" })}</>, "#0B0E14", { z: [1.0, 1.12] }), html: B("Tutuklanmıyor", { y: 880, size: 64, c: AMB }) },
  { c: "Büyükelçi ise, anılarında", r: dos("BÜYÜKELÇİNİN SESSİZLİĞİ", ["Anılarında bu olaydan hiç bahsetmedi", "İstediği: Normandiya'yı o sızdırmadı"]) },
  { c: "Bir akademik makaleye", r: (t, a, b) => again("Büyükelçi ise, anılarında", t, a, b, 0) },
  { c: "Normandiya çıkarmasını sızdıran", r: (t, a, b) => again("Büyükelçi ise, anılarında", t, a, b, 1) },
  { c: "Bunu sormadan geçmeyelim", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.1, 1.3] }), html: B("Neden tutuklanmadı?", { y: 880, size: 64, c: AMB }) },
  { c: "Bu sorunun cevabını", r: car(false, { z: [1.0, 1.15] }) },

  // ───── Bölüm 7
  { c: "Bölüm yedi", r: chap("BÖLÜM 7", "Para", "Bernhard Operasyonu"), sfx: "boom" },
  { c: "Hikâyenin düğüm noktasına", r: notes({ count: 6 }) },
  { c: "Almanya savaşta bir plan", r: photo("bernhard20", "Sahte 20 sterlin · Bernhard Operasyonu", "Wikimedia Commons · kamu malı") },
  { c: "Operasyonun adı", r: dos("BERNHARD OPERASYONU", ["Amaç: İngiliz ekonomisini sarsmak", "Yöntem: sahte sterlin basmak"]) },
  { c: "Bu işin başında SS subayı", r: press() },
  { c: "Paraları, Berlin yakınındaki", r: press("yaklaşık 140 mahkûm, zorla") },
  { c: "çoğu Yahudi olan", r: (t, a, b) => again("Paraları, Berlin yakınındaki", t, a, b, 0) },
  { c: "Kaynaklara göre, kamp boşaltılana", r: num(9, "banknot (kaynaklara göre, yaklaşık)", { suffix: " milyon", prefix: "~" }) },
  { c: "Toplam değeri, yüz otuz dört", r: num(134, "toplam değer (sterlin)", { suffix: " milyon £" }) },
  { c: "Ve bu paraların kalitesi", r: notes({ count: 6, label: "Bankacılar bile ayıramazdı" }) },
  { c: "Çiçero'ya toplam olarak", r: num(300, "bin sterlin (toplam ödeme)", { suffix: " bin £" }) },
  { c: "Ama bu paranın ne kadarının", r: list("Sahte olan kısım?", ["Moytsiş: ilk 200 bin gerçek", "Başka anlatım: yaklaşık yarısı", "Makale: hepsi sahte"], RED) },
  { c: "Moytsiş, ilk iki yüz bin", r: quote("İlk 200.000 sterlin gerçekti.", "Moytsiş'e göre") },
  { c: "Bazna'nın savurganlığı yüzünden", r: (t, a, b) => again("Moytsiş, ilk iki yüz bin", t, a, b, 0) },
  { c: "Başka anlatımlara göre", r: quote("Ödemenin yaklaşık yarısı sahteydi.", "Başka anlatımlara göre") },
  { c: "Bir akademik makale ise", r: quote("Paranın tamamı sahteydi.", "Akademik makale · 2013") },
  { c: "Kimse kesin söyleyemiyor", r: dos("KESİN OLAN", ["İngiltere Merkez Bankası", "Bazna'nın sterlinlerinin çoğu sahte"], { stamp: "SAHTE", at: 1.2, no: "TESPİT" }), sfx: "boom" },
  { c: "sonradan onun elindeki", r: (t, a, b) => again("Kimse kesin söyleyemiyor", t, a, b, 0) },
  { c: "Düşün. Bir uşak", r: chain(["UŞAK", "SAHTE PARA", "İNGİLİZ EKONOMİSİ"], ["alıcı", "", "hedef"], RED) },
  { c: "Yani adam, savaşın", r: (t, a, b) => again("Düşün. Bir uşak", t, a, b, 0) },
  { c: "Diğerinde, farkında olmadan", r: (t, a, b) => again("Düşün. Bir uşak", t, a, b, 1) },
  { c: "Savaş bitiyor. Bazna iş adamı", r: hotel() },
  { c: "Bir akademik makale, bunun Bursa'da", r: routeMap([["BURSA", 29.06, 40.18], ["İSTANBUL", 29.0, 41.0]], [[1, 0]], { z: [1.3, 1.6], c0: mpC("BURSA") }) },
  { c: "İnşaat sırasında", r: hotel(true) },
  { c: "Alacaklılarla uğraşmak", r: list("Alacaklılar", ["İşçiler", "Esnaf", "Sahte paralar"]) },
  { c: "Servet olarak aldığı", r: notes({ fake: 0.4, count: 2, label: "Otelin temeline bile yetmedi" }) },

  // ───── Bölüm 8
  { c: "Bölüm sekiz", r: chap("BÖLÜM 8", "Sonrası", "1950 – 1970"), sfx: "boom" },
  { c: "Bin dokuz yüz elli. Bazna", r: date("1950", "ÇİÇERO OLDUĞUNU İLK KEZ ÖĞRENDİ") },
  { c: "Moytsiş'in kitabından. Aynı", r: (t, a, b) => again("Bin dokuz yüz elli. Bazna", t, a, b, 0) },
  { c: "Bazna, Batı Almanya'ya dava", r: dos("DAVA", ["Batı Almanya'ya karşı", "Talep: sahte paranın karşılığı", "Sonuç: sembolik ya da hiç"], { no: "BAZNA" }) },
  { c: "Aldığı sahte paraların", r: (t, a, b) => again("Bazna, Batı Almanya'ya dava", t, a, b, 0) },
  { c: "sembolik bir ödeme", r: (t, a, b) => again("Bazna, Batı Almanya'ya dava", t, a, b, 1) },
  { c: "Bir ayrıntı daha", r: quote("İngilizlerin intikamından korktuğu için\nBBC'yi reddetti.", "Akademik makale") },
  { c: "BBC'nin röportaj davetlerini", r: (t, a, b) => again("Bir ayrıntı daha", t, a, b, 0) },
  { c: "yine para karşılığı", r: (t, a, b) => again("Bir ayrıntı daha", t, a, b, 1) },
  { c: "Bin dokuz yüz elli beşte Fransız", r: date("1955", "İSTANBUL · AKSARAY") },
  { c: "O yıllarda Aksaray'da", r: list("Aksaray yılları", ["Şarkı dersi", "İkinci el araba", "Gece bekçiliği"]) },
  { c: "Bin dokuz yüz elli birde, hikâyesi", r: photo("ankarapalas", "Ankara Palas (bugün)", "Cetorhinus · Wikimedia Commons · CC BY-SA 3.0") },
  { c: "Bir akademik makalenin dipnotuna", r: dos("DİPNOT", ["Yönetmeni Ankara Palas'ta sıkıştırdığı anlatılır", "Polis gözaltına aldı, sonra bıraktı", "Kaynak: tek dipnot"]) },
  { c: "yönetmen polisi arıyor", r: (t, a, b) => again("Bir akademik makalenin dipnotuna", t, a, b, 0) },
  { c: "Dipnotta, Bazna'nın o", r: (t, a, b) => again("Bir akademik makalenin dipnotuna", t, a, b, 1) },
  { c: "Milliyet, bu olayı", r: dos("MİLLİYET · 20 TEMMUZ 1951", ["Olay birinci sütundan verildi", "█"], { no: "ARŞİV" }) },
  { c: "Yani, dikkatli okumamız", r: quote("Tek bir dipnota dayanıyor.", "Protokol X notu") },
  { c: "Bin dokuz yüz altmışta Münih'e", r: date("1960", "MÜNİH · GECE BEKÇİSİ") },
  { c: "Bin dokuz yüz altmış ikide", r: dos("1962 · KİTAP", ["«Ben Çiçero'ydum»", "Hans Nogli ile birlikte"], { no: "BAZNA" }) },
  { c: "Yirmi bir Aralık", r: date("21 ARALIK 1970", "MÜNİH · 66 YAŞINDA", RED), sfx: "drone" },
  { c: "Altmış altı yaşında", r: (t, a, b) => again("Yirmi bir Aralık", t, a, b, 0) },
  { c: "Hikâyesi sinemaya defalarca", r: posters },

  // ───── Bölüm 9
  { c: "Bin dokuz yüz", r: (t, a, b) => again("Hikâyesi sinemaya defalarca", t, a, b, 0) },
  { c: "İki bin on", r: (t, a, b) => again("Hikâyesi sinemaya defalarca", t, a, b, 1) },
  { c: "Bölüm dokuz", r: chap("BÖLÜM 9", "Bu hikâyeyi nasıl biliyoruz?", "Kaynaklar"), sfx: "boom" },
  { c: "Burada bir şey itiraf", r: quote("İki ana kaynak da\ntam güvenilir değil.", "Protokol X") },
  { c: "Birincisi, Moytsiş'in", r: books },
  { c: "Tarihçi Richard Vayırs", r: dos("RICHARD WIRES", ["Tarihçi · «The Cicero Spy Affair» (1999)", "Moytsiş'in kitabı: sansasyonel anlatı", "Yanlışlar ve eksikler var"], { no: "KAYNAK" }) },
  { c: "İkincisi, Bazna'nın kendi", r: dos("BAZNA'NIN KİTABI", ["Hans Nogli derledi (okul defteri notları)", "Abartılar çıkarıldı", "Bazna: bazı bölümlere katılmıyorum"], { no: "KAYNAK" }) },
  { c: "Bazna'nın okul defterine", r: (t, a, b) => again("İkincisi, Bazna'nın kendi", t, a, b, 0) },
  { c: "Ama Bazna, bir", r: (t, a, b) => again("İkincisi, Bazna'nın kendi", t, a, b, 1) },
  { c: "Yani iki kitapta da hatalar", r: list("Bu dosyada", ["Ne zaman bir şey anlattıysak", "kimden geldiğini söyledik", "Çünkü kaynak ≠ yaşanan"]) },

  // ───── Bölüm 10
  { c: "kimden geldiğini söylemeye", r: (t, a, b) => again("Yani iki kitapta da hatalar", t, a, b, 0) },
  { c: "bir kaynağın söylediği", r: (t, a, b) => again("Yani iki kitapta da hatalar", t, a, b, 1) },
  { c: "Bölüm on", r: chap("BÖLÜM 10", "Açık sorular", "Çiçero kimin için çalışıyordu?"), sfx: "boom" },
  { c: "Çiçero gerçekten kimin için", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.1, 1.3] }), html: B("Kimin için çalışıyordu?", { y: 880, size: 64, c: AMB }) },
  { c: "Bu sorular için üç farklı", r: threep([["İngiliz ikili ajanı", "KANIT: YOK"], ["Türk istihbaratı yönlendirdi", "KANIT: YOK"], ["Hırslı bir uşak", "KANIT: YOK"]]) },
  { c: "Birincisi. İngiliz istihbaratının", r: dos("1 · İKİLİ AJAN", ["İngiliz istihbaratı yönetiyordu", "Üst düzey biri: «kontrolümüzde»", "Kanıt: yok"], { no: "İHTİMAL" }) },
  { c: "İngiliz istihbaratının üst", r: (t, a, b) => again("Birincisi. İngiliz istihbaratının", t, a, b, 0) },
  { c: "Bu ihtimalde, tutuklanmamasının", r: (t, a, b) => again("Birincisi. İngiliz istihbaratının", t, a, b, 1) },
  { c: "İkincisi. Türk", r: dos("2 · TÜRK İSTİHBARATI", ["MİT resmî tarihçesi (2002): yönlendirildi iddiası", "Şellenberg: benzer şüphe", "Kanıt: yok"], { no: "İHTİMAL" }) },
  { c: "Milli İstihbarat Teşkilatı'nın", r: (t, a, b) => again("İkincisi. Türk", t, a, b, 0) },
  { c: "Alman SS istihbaratından", r: (t, a, b) => again("İkincisi. Türk", t, a, b, 1) },
  { c: "Bazı fotoğraflarda parmak izleri", r: cdoc("PARMAK İZLERİ", ["Bazı fotoğraflarda parmak izi", "Tek başına mı çekildi?"], "İKİNCİ KİŞİ?", 2) },
  { c: "Ama ikinci kişinin", r: (t, a, b) => again("Bazı fotoğraflarda parmak izleri", t, a, b, 0) },
  { c: "Üçüncüsü. Sadece hırslı", r: dos("3 · SADECE UŞAK", ["Hırslı, cesur ve şanslı", "Neden tutuklanmadı: cevap yok"], { no: "İHTİMAL" }) },
  { c: "Bu ihtimalde, neden", r: (t, a, b) => again("Üçüncüsü. Sadece hırslı", t, a, b, 0) },
  { c: "Hiçbiri kanıtlanmış değil", r: threep([["İngiliz ikili ajanı", "KANIT: YOK"], ["Türk istihbaratı yönlendirdi", "KANIT: YOK"], ["Hırslı bir uşak", "KANIT: YOK"]]), sfx: "drone" },

  // ───── kapanış
  { c: "Dosyanın kapanışı", r: chap("KAPANIŞ", "Dosyanın kapanışı", ""), sfx: "boom" },
  { c: "Bir uşak. Bir kasa", r: tools("Bir uşak. Bir kasa. Bir Layka.") },
  { c: "Almanya, elindeki sırları kullanmadı", r: chain(["ALMANYA", "İNGİLTERE", "TÜRKİYE"], ["kullanmadı", "yakalayamadı", "taraf olmadı"]) },
  { c: "Ve adamın kendisi", r: notes({ fake: 0.5, count: 2 }) },
  { c: "Peki geriye ne kaldı", r: sil((t) => <>{fig(t, 960, { pose: "think" })}</>, "#0B0E14", { z: [1.1, 1.3] }) },
  { c: "Bir ders kaldı", r: quote("Bir sır, tek başına\nbir şey ifade etmez.", "Protokol X") },
  { c: "Onu açan kadar", r: (t, a, b) => again("Bir ders kaldı", t, a, b, 0) },
  { c: "Savaşın en değerli bilgileri", r: box(99), html: B("Açılmamış zarf", { y: 880, size: 64, c: AMB }) },
  { c: "Bu hikâyenin başında sana", r: quote("Hikâyeler birbirine benzeyebilir.\nAma hiçbiri bizim anlattığımız gibi değil.", "Protokol X") },
  { c: "Hikâyeler birbirine benzeyebilir", r: (t, a, b) => again("Bu hikâyenin başında sana", t, a, b, 0) },
  { c: "Çünkü bu hikâyenin en acı", r: notes({ fake: 0.4, count: 4, label: "Paranın kendisi" }) },
  { c: "kendi emeğinin karşılığı", r: (t, a, b) => again("Çünkü bu hikâyenin en acı", t, a, b, 0) },
  { c: "Şimdi sana bir soru", r: sil((t) => <>{fig(t, 960, { pose: "point" })}</>, "#0B0E14", { z: [1.0, 1.15] }), html: B("Çiçero kazandı mı, kaybetti mi?", { y: 880, size: 60, c: AMB }) },
  { c: "Yorumlarda yaz", r: list("Yorumlarda yaz", ["Çiçero kazandı mı, kaybetti mi?", "Sen olsan, anahtarı kopyalar mıydın?"]) },
  { c: "Bu dosya burada kapanıyor", r: (t, a, b) => cam(t, a, b, <g><rect width={1920} height={1080} fill="#050608" />{T(960, 560, "PROTOKOL X", 150, AMB, 700, "middle", { letterSpacing: 20 } as React.SVGProps<SVGTextElement>)}{T(960, 660, "Bir sonraki dosyada görüşmek üzere", 44, X.dim, 600, "middle")}</g>, {}, [1.0, 1.06]), html: (t, a) => <SubBtn t={t} at={a + 1.0} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K7_02_SECONDS));
  return raw;
})();

export const K7Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K7_02_SECONDS - 1.5, K7_02_SECONDS);
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
      <Audio src={staticFile("audio/k7-02.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K7_02_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.14 : 0.06} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = SHOTS.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, a, b)}</g>;
}
