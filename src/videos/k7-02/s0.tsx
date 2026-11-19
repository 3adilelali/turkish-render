import React from "react";
import { SubBtn } from "../../components/Hayat";
import { Sh, ph, seq, burst, map, date, over, panel, quote, chain, stat, title, AMB } from "./h";
import { bd } from "./board";

// مقدمة (0 → «Bölüm bir»): أول 3 ثواني «عاصفة خرائط عتيقة»، بعدها هدوء (2–5 ث للقطة)
export const MAPS = ["omap12", "omap21", "omap33", "omap25", "omap43", "omap31", "omap22", "omap45", "omap32", "omap26", "omap41", "omap35", "omap42", "omap11", "omap44", "omap23", "omap24", "omap34"];
const STORM = MAPS;

export const S0: Sh[] = [
  { c: "Yirmi dokuz Ekim", r: burst(STORM, { grade: "warm", mode: "cover", z: [1.5, 1.95] }) },
  { c: "Cumhuriyet'in yirminci", r: date("ankara407", "29 EKİM 1943", "ANKARA · CUMHURİYET'İN 20. YILI", AMB, [0.5, 0.5, 0.58, 0.5]), sfx: "tick" },
  { c: "Ankara'da bayram var", r: seq([{ file: "ankbulv3", par: "r", yr: "1943", cap: "Ankara", sub: "1940'lar" }, { file: "ankara3", z: [1.04, 1.16] }, { file: "ankbulv5", par: "in" }]) },
  { c: "Sokaklarda bayraklar", r: seq([{ file: "ankara2", z: [1.05, 1.18], yr: "1943" }, { file: "ankara4014", par: "l" }]) },
  { c: "resepsiyonlarda diplomatlar", r: seq([{ file: "istanbul406", par: "r", z: [1.05, 1.18] }, { file: "istanbul407", par: "l", z: [1.05, 1.2] }]) },
  { c: "Savaş, Türkiye'nin kapısında", r: map({ lon: 28, lat: 48, w: 74 }, { v1: { lon: 31, lat: 42, w: 46 }, hi: ["TUR"], pins: [{ lon: 13.4, lat: 52.5, label: "BERLİN", dt: 0.8, c: "#FF6B6B", side: "t" }, { lon: -0.12, lat: 51.5, label: "LONDRA", dt: 1.2, c: "#7FC8FF", side: "t" }, { lon: 37.6, lat: 55.75, label: "MOSKOVA", dt: 1.6, c: "#FF6B6B", side: "t" }], yr: "1943", place: "SAVAŞ · AVRUPA ALEVDE" }) },
  { c: "Ama Türkiye savaşın dışında", r: map({ lon: 33, lat: 40, w: 30 }, { v1: { lon: 33, lat: 39.6, w: 21 }, hi: ["TUR"], pins: [{ lon: 32.85, lat: 39.93, label: "ANKARA", dt: 0.6 }], yr: "1943", place: "TÜRKİYE · TARAFSIZ" }) },
  { c: "Aynı gün, Alman", r: ph("papenw6", { cap: "Franz von Papen", sub: "Almanya'nın Ankara Büyükelçisi" }) },
  { c: "Berlin'den geliyor", r: ph("enigma3", { par: "r", z: [1.05, 1.22], cap: "Şifreli telgraf", sub: "BERLİN → ANKARA", grade: "warm" }) },
  { c: "Kısacık bir cevap", r: over("enigma2", "Evet. Satın alın.", { sub: "BERLİN'DEN CEVAP · 29 EKİM 1943", y: 150, z: [1.05, 1.16] }), sfx: "tick" },
  { c: "Neyi satın alıyorlar", r: over("leicaw2", "Neyi satın alıyorlar?", { sub: "Bir adamın çektiği fotoğrafları · Leica (temsili görsel)", y: 150, z: [1.05, 1.15] }) },
  { c: "Adam, dünyanın en güçlü", r: seq([{ file: "churchill2", par: "r", z: [1.04, 1.16], cap: "İngiltere", sub: "Dünyanın en güçlü devletlerinden biri · 1943" }, { file: "churchill3", z: [1.05, 1.18], f: [0.5, 0.35, 0.5, 0.4] }]) },
  { c: "O evdeki kasada", r: seq([{ file: "typewriter3", z: [1.04, 1.16], cap: "Büyükelçilik yazışmaları", grade: "bw" }, { file: "typewriter2", z: [1.05, 1.2] }]) },
  { c: "çok gizli damgalı", r: ph("typewriter1", { z: [1.05, 1.18], cap: "ÇOK GİZLİ", sub: "damgalı belgeler" }) },
  { c: "için de yirmi bin", r: stat("bernhard1", 20000, "sterlin istedi", { suffix: " £" }) },
  { c: "Adamın mesleği uşak", r: ph("bazna", { cap: "İlyas Bazna", sub: "Meslek: uşak · kod adı: Çiçero" }) },
  { c: "Büyükelçinin ceketini fırçalıyor", r: panel("istanbul407", "BİR UŞAĞIN GÜNÜ", ["Ceketi fırçalar", "Kapıyı açar", "Çayı getirir"], { tag: "UŞAK" }) },
  { c: "Kimse ona bakmıyor", r: quote("ankara405", "Çünkü bir uşağa\nkimse bakmaz.", "Protokol X") },
  { c: "İşte bu yüzden", r: seq([{ file: "enigma4", par: "r", z: [1.05, 1.2], grade: "warm" }, { file: "typewriter1", par: "l", z: [1.05, 1.2] }, { file: "enigma3", z: [1.1, 1.3] }]) },
  { c: "Peki bir uşak", r: over("enigma2", "Nasıl?", { sub: "Bir uşak, bir büyükelçinin kasasına nasıl ulaştı?", y: 150, z: [1.1, 1.3] }) },
  { c: "Almanya bu sırlarla", r: chain("hitlerw5", ["BAZNA", "MOYZISCH", "FON PAPEN", "BERLİN"], ["uşak", "SD", "büyükelçi", "Dışişleri"]) },
  { c: "Ve bu adam", r: over("bernhard2", "Para gerçek miydi?", { sub: "Eline geçenin büyük kısmı neden sahte çıktı?", y: 150, z: [1.05, 1.18] }) },
  { c: "Burası Protokol X", r: bd("bazna", 1.7), sfx: "boom" },
  { c: "Bir. Bir uşağın", r: bd("bazna", 1.7, "bazna", 2.1) },
  { c: "İki. Almanya'nın", r: bd("papen", 1.5, "ribb", 1.5) },
  { c: "Üç. Bu adamın", r: bd("money", 1.7, "money", 2.1) },
  { c: "Hikâyeler birbirine", r: title([{ s: "Hikâyeler birbirine benzeyebilir.", size: 66 }, { s: "Ama hiçbiri bizim anlattığımız gibi değil.", c: AMB, size: 66 }], "#070A10") },
  { c: "Dosya açılıyor", r: panel("nazi2", "PROTOKOL X", ["Dosya 02 · Çiçero", "Kaynak: akademik makale, arşiv, hatıralar"], { stamp: "AÇILDI", stampAt: 0.7, tag: "DOSYA AÇILIYOR", dim: 0.55 }), sfx: "boom" },
  { c: "Başlamadan önce tek", r: title([{ s: "PROTOKOL X", c: AMB, size: 130 }, { s: "Bir sonraki dosya daha güçlü.", size: 52 }], "#070A10"), html: (t, a) => React.createElement(SubBtn, { t, at: a + 2.4 }) },
];
