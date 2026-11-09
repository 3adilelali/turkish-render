import React from "react";
import { AbsoluteFill } from "remotion";
import words from "../../../public/data/k5-08-words.json";
import { FONT, HAND } from "../../theme";
import { Counter, Doc, Fig, K, LOOK, Phone, Question, Re, Shot, Silence, Split, Txt, Years, Yorum, makeK5, ramp, shadow } from "../k5-kit/Kit";

// k5-08 · "2001'de Kontörle Yaşamak" · ölçek: kontör (BİTTİ ↔ DOLU)
const EMRE = { ...LOOK.kid, body: "#3E6FB0", body2: "#2C5288" };

// çaldırma kodları
const RingCodes: React.FC<{ t: number; a: number; codes: [number, string][]; head: string }> = ({ t, a, codes, head }) => (
  <AbsoluteFill style={{ background: K.cream, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
    <div style={{ fontSize: 46, fontWeight: 800, color: K.brick, letterSpacing: 3, marginBottom: 40 }}>{head}</div>
    {codes.map(([n, s], i) => {
      const k = ramp(t, a + 0.4 + i * 1.3, a + 0.8 + i * 1.3);
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, width: 1400, marginTop: 26, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>
          <div style={{ display: "flex", gap: 14, width: 420, justifyContent: "flex-end" }}>
            {Array.from({ length: n }, (_, j) => { const pulse = 1 + 0.15 * Math.max(0, Math.sin((t - a - i * 1.3) * 8 - j)); return <div key={j} style={{ width: 96, height: 96, borderRadius: 48, background: K.petrol, transform: `scale(${pulse})`, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: shadow }}><svg width={50} height={50} viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#fff" /></svg></div>; })}
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: K.brick }}>=</div>
          <div style={{ fontFamily: HAND, fontSize: 68, color: K.ink }}>{s}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// hoparlör paraziti: tıt tıt tıt
const Buzz: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const on = Math.floor((t - a) * 6) % 3 !== 2;
  return (
    <AbsoluteFill style={{ background: "#1C2228", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
        <div style={{ width: 300, height: 420, background: "#2E2E2E", borderRadius: 24, boxShadow: shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, transform: `translateX(${on ? Math.sin(t * 90) * 3 : 0}px)` }}>
          {[140, 90].map((r, i) => <div key={i} style={{ width: r, height: r, borderRadius: r, background: "radial-gradient(#555, #111)", border: "6px solid #444" }} />)}
        </div>
        <svg width={700} height={300} viewBox="0 0 700 300">
          <polyline fill="none" stroke={K.gold} strokeWidth={8} points={Array.from({ length: 70 }, (_, i) => `${i * 10},${150 + (on ? (Math.sin(i * 2.7 + t * 40) * 110 * ((i % 7) / 7)) : 0)}`).join(" ")} />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 120, fontFamily: HAND, fontSize: 90, color: K.gold, opacity: on ? 1 : 0.3 }}>tıt tıt tıt…</div>
      <div style={{ position: "absolute", bottom: 90, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#CCD", opacity: ramp(t, a + 1.5, a + 2) }}>Telefon çalmadan 2 saniye önce</div>
    </AbsoluteFill>
  );
};

// kısaltmalar
const Abbr: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const rows = [["Merhaba", "mrb"], ["Nasılsın", "nbr"], ["Akşam", "aksm"], ["ş · ğ · ı", "s · g · i"]];
  return (
    <AbsoluteFill style={{ background: "#A8C57A", justifyContent: "center", alignItems: "center", fontFamily: "monospace" }}>
      {rows.map(([l, r], i) => {
        const k = ramp(t, a + 0.3 + i * 1.1, a + 0.9 + i * 1.1);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 84, fontWeight: 800, color: "#1E2A14", marginTop: 20 }}>
            <span style={{ width: 560, textAlign: "right", textDecoration: k > 0.5 ? "line-through" : undefined, opacity: 1 - 0.5 * k }}>{l}</span>
            <span style={{ opacity: k }}>→</span>
            <span style={{ width: 400, color: K.brick, opacity: k }}>{r}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// çoklu basış: 7 tuşu → P Q R S
const Keypad: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const n = Math.min(4, Math.floor(ramp(t, a + 0.4, a + 3.2) * 4.99));
  const letters = "PQRS";
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 120, alignItems: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: 150, background: n > 0 && Math.floor((t - a) * 10) % 3 === 0 ? "#DDE6EE" : "#C9D1D8", border: "10px solid #5A6470", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: shadow }}>
          <div style={{ fontSize: 150, fontWeight: 800, color: "#333", lineHeight: 1 }}>7</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: "#666", letterSpacing: 8 }}>PQRS</div>
        </div>
        <div>
          <div style={{ fontSize: 60, fontWeight: 800, color: K.petrol }}>{n}× bas</div>
          <div style={{ fontFamily: "monospace", fontSize: 220, fontWeight: 800, color: K.brick }}>{n ? letters[n - 1] : "_"}</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 90, fontFamily: HAND, fontSize: 60, color: K.ink, opacity: ramp(t, a + 3.2, a + 3.8) }}>bir cümle = dakikalar</div>
    </AbsoluteFill>
  );
};

// yılan oyunu
const Snake: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const steps = Math.floor((t - a) * 6);
  const len = 4 + Math.floor(steps / 8);
  const path = (s: number) => { const p = s % 56; const x = p < 14 ? p : p < 28 ? 13 : p < 42 ? 13 - (p - 28) : 0; const y = p < 14 ? 2 : p < 28 ? 2 + (p - 14) * 0.5 : p < 42 ? 9 : 9 - (p - 42) * 0.5; return [x, Math.round(y)]; };
  return (
    <AbsoluteFill style={{ background: "#E9DCC2", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: 900, height: 620, background: "#A8C57A", border: "24px solid #2C3238", borderRadius: 30, position: "relative", boxShadow: shadow }}>
        {Array.from({ length: len }, (_, i) => { const [x, y] = path(Math.max(0, steps - i)); return <div key={i} style={{ position: "absolute", left: 30 + x * 58, top: 30 + y * 52, width: 50, height: 46, background: "#1E2A14", borderRadius: 6 }} />; })}
        <div style={{ position: "absolute", left: 30 + 7 * 58, top: 30 + 9 * 52, width: 30, height: 30, borderRadius: 15, background: "#1E2A14", opacity: Math.floor(t * 3) % 2 ? 1 : 0.4 }} />
        <div style={{ position: "absolute", right: 30, top: 20, fontFamily: "monospace", fontSize: 44, fontWeight: 800, color: "#1E2A14" }}>{String(steps * 7).padStart(4, "0")}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2007: sahnede tuşsuz telefon
const Stage: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const up = ramp(t, a + 0.6, a + 1.6);
  return (
    <AbsoluteFill style={{ background: "#07090C", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, width: 900, height: 1400, background: "radial-gradient(ellipse at top, rgba(255,255,255,.28), transparent 65%)" }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute" }}>
        <g transform="translate(960,820)">
          <ellipse cx={0} cy={20} rx={160} ry={24} fill="rgba(255,255,255,.08)" />
          <rect x={-60} y={-330} width={120} height={330} rx={50} fill="#1A1A1A" />
          <circle cx={0} cy={-400} r={70} fill="#1A1A1A" />
          <g transform={`rotate(${-150 * up},50,-310)`}><rect x={40} y={-320} width={30} height={170} rx={15} fill="#1A1A1A" /><rect x={30} y={-185} width={52} height={96} rx={10} fill="#111" stroke="#888" strokeWidth={4} /><rect x={36} y={-178} width={40} height={80} rx={6} fill="#9FD3E6" opacity={0.9} /></g>
        </g>
        {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={100 + i * 60} cy={1000 + Math.sin(t * 12 + i) * 6 * up} r={34} fill="#111" />)}
      </svg>
      <div style={{ position: "absolute", left: 80, top: 70, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#DDD" }}>Ocak 2007 · ABD</div>
      <div style={{ position: "absolute", bottom: 160, fontFamily: HAND, fontSize: 70, color: K.gold, opacity: ramp(t, a + 2, a + 2.6) }}>tuş yok. sadece ekran.</div>
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  // ── 1 · Kanca ──
  { c: "15 Haziran", img: "01", yr: 2001, ov: [{ t: "date", a: "15 Haziran 2001", b: "Bursa · karne günü" }] },
  { c: "Senin adın Emre", img: "01", ov: [{ t: "tag", a: "EMRE", b: "13 · 7. sınıf · sen" }] },
  { c: "Eve girdiğinde", img: "02" },
  { c: "Kapaklı değil", img: "03", ov: [{ t: "list", a: ["✗ kapaklı", "✗ dokunmatik", "2 renk ekran"] }] },
  { c: "Bu senin ilk", r: (t, a) => <Phone t={t} a={a} top="Hoş geldiniz" right="" msg="Kalan: 10 kontör" />, g: 100 },
  { c: "Bu videoda", img: "07" },
  { c: "Ve sonunda şu sorunun", r: (t, a, b) => <Question t={t} a={a} b={b} q="Konuşmadan nasıl anlaşılır?" img="07" /> },
  { c: "Bu hikâye", r: (t, a) => <Yorum t={t} a={a} likes={12} text="İlk telefonum karne hediyesiydi, 2001. Ekranı iki renk yanardı. Çaldırınca açmasın diye telefonu elimizde hazır beklerdik!" /> },
  // ── 2 · 2001 ──
  { c: "Önce bulunduğun", img: "04" },
  { c: "Dolar bir gecede", r: (t, a) => <Counter t={t} a={a} to={40} pre="≈ %" head="ŞUBAT 2001 · KRİZ" sub="dolar bir gecede" foot="Kaynak: TCMB; 22 Şubat 2001 dalgalı kura geçiş" /> },
  { c: "Paralar hâlâ", img: "05" },
  { c: "Kontör ne demek", img: "06" },
  { c: "Kart alıyorsun", img: "06", ov: [{ t: "list", a: ["kartı al", "kazı", "numarayı tuşla"] }] },
  { c: "Sokakta bir de", img: "16" },
  { c: "Evde ise sabit", img: "17", ov: [{ t: "quote", a: "Bu Ankara'yı kim aradı?", d: 2.5 }] },
  // ── 3 · Çaldır kapat ──
  { c: "Ve bu yüzden 2001", r: (t, a) => <Silence t={t} a={a} text="Çaldır kapat." sub="bir neslin icat ettiği dil" /> },
  { c: "Kuralı basit", r: (t, a) => <Phone t={t} a={a} ring msg="ARIYOR…" top="" right="" />, sfx: "buzz" },
  { c: "Karşı taraf açmadan", img: "07" },
  { c: "Peki mesaj ne", r: (t, a) => <RingCodes t={t} a={a} head="MAHALLE KODLARI" codes={[[1, "Aşağıdayım, in."], [2, "Geç kalacağım."], [3, "Beni ara, kontörüm yok."]]} /> },
  { c: "Bazı kodlar", img: "08" },
  { c: "Kısa çaldırma", img: "09", ov: [{ t: "quote", a: "Bir çaldırma: Seni düşünüyorum.", d: 0.5 }] },
  { c: "Ama bir sorun", img: "10" },
  { c: "Yorumlarda biri", img: "10", ov: [{ t: "cap", a: "İlk titreşimde aç: onun kontörü yansın!" }] },
  { c: "Yani çaldır kapat", r: (t, a) => <Split t={t} a={a} left={{ h: "SEN", v: ["Hemen kapat!"] }} right={{ h: "O", v: ["Hemen aç!"] }} /> },
  { c: "Ve bu savaşın", img: "11" },
  { c: "Telefonun çalmadan", r: (t, a) => <Buzz t={t} a={a} />, sfx: "static" },
  { c: "Bu ses, telefonun", img: "11", ov: [{ t: "note", a: "şebeke sinyali = biri arıyor", p: "tr" }] },
  // ── 4 · Mesaj ──
  { c: "Şimdi mesajlara", r: (t, a) => <Phone t={t} a={a} top="Mesaj yaz" right="160" msg="mrb nbr? aksm cikiyon mu?" /> },
  { c: "Bir mesaj yüz", r: (t, a) => <Counter t={t} a={a} to={160} suf=" karakter" head="BİR SMS" sub="fazlası = ikinci mesaj = 2× kontör" /> },
  { c: "Merhaba olmuyor", r: (t, a) => <Abbr t={t} a={a} /> },
  { c: "Ve tuşlu telefonda", r: (t, a) => <Keypad t={t} a={a} /> },
  { c: "Gece yarısından", img: "13" },
  { c: "Telefonunda bir de oyun", r: (t, a) => <Snake t={t} a={a} /> },
  { c: "Bir de zincir", r: (t, a) => <Phone t={t} a={a} top="Yeni mesaj" right="" msg="Bu mesaji 10 kisiye gondermezsen sansin kacar!!" />, g: 60 },
  { c: "Telefonun hafızası", img: "26" },
  { c: "Bir de zil sesleri", img: "15" },
  { c: "Yaz bitiyor", img: "07", g: 15, ov: [{ t: "note", a: "kontör: 3 kez bitti", p: "tr" }] },
  { c: "Bir gün ekranda", r: (t, a) => <Phone t={t} a={a} top="" right="0" msg="Bakiyeniz yetersiz." />, g: 0 },
  { c: "Yeni kart alacak", img: "18" },
  { c: "O hafta sessiz", r: (t, a) => <Phone t={t} a={a} ring msg="ANNEM arıyor" top="" right="" />, sfx: "buzz" },
  { c: "Akşam eve geldiğinde", img: "19", ov: [{ t: "quote", a: "Bir daha annesini çaldırıp kapatan çocuk görmedim.", d: 1.2 }] },
  { c: "O akşam yemekte", img: "20" },
  // ── 5 · Yıllar ──
  { c: "Yıllar geçiyor", r: (t, a) => <Years t={t} a={a} upto={1} items={[{ y: "2001", s: "çaldır kapat" }, { y: "2004", s: "kameralı telefon" }, { y: "2007", s: "dokunmatik ekran" }, { y: "2009", s: "Türkiye'de 3G" }]} />, g: null },
  { c: "2004'te kameralı", img: "21", yr: 2004 },
  { c: "Fotoğrafı arkadaşına", img: "22" },
  { c: "Bir dakika sonra", r: (t, a) => <Phone t={t} a={a} top="Kızılötesi" right="" msg="Alındı." />, sfx: "ding" },
  { c: "Teneffüste artık", img: "21" },
  { c: "2006'da devlet", r: (t, a) => <Doc t={t} a={a} head="2006 · KAYIT DIŞI TELEFONLAR" lines={["IMEI kaydı başlıyor.", "Kayıtsız telefon: kapanır."]} foot="Kaynak: Telekomünikasyon Kurumu, Mobil Cihaz Kayıt Sistemi (2006)" />, yr: 2006 },
  { c: "Ve Ocak 2007", r: (t, a) => <Stage t={t} a={a} />, yr: 2007 },
  { c: "O gün sen", img: "23", ov: [{ t: "quote", a: "Tuşsuz telefon mu olur?", d: 2.5 }] },
  { c: "Bu telefonlar Türkiye'ye", img: "24", yr: 2008 },
  { c: "Ama yavaş yavaş", r: (t, a) => <Years t={t} a={a} items={[{ y: "2001", s: "çaldır kapat" }, { y: "2004", s: "kameralı telefon" }, { y: "2007", s: "dokunmatik ekran" }, { y: "2009", s: "Türkiye'de 3G" }]} />, yr: 2009 },
  { c: "Ve bir gün fark", img: "25", yr: 2013 },
  { c: "Mesajlar ücretsiz", img: "25", ov: [{ t: "list", a: ["mesaj: ücretsiz", "görüntülü: ücretsiz", "✗ kontör"] }] },
  { c: "Çaldır kapat dili", r: (t, a) => <Silence t={t} a={a} text="Çaldır kapat dili sessizce ölüyor." /> },
  // ── 6 · Cevap ──
  { c: "Şimdi cevaba", r: (t, a, b) => <Question t={t} a={a} b={b} q="Konuşmadan nasıl anlaşılır?" img="09" /> },
  { c: "2001'de bir nesil", r: (t, a) => <RingCodes t={t} a={a} head="HER KESİK ÇAĞRI BİR CÜMLEYDİ" codes={[[1, "Buradayım."], [2, "Seni düşünüyorum."], [3, "Beni unutma."]]} /> },
  { c: "Bugün sınırsız", r: (t, a, b) => <Re img="26" t={t} a={a} b={b} d={0.35} />, html: (t, a) => <Txt t={t} at={a + 1.5} text="Bir kez çalan telefon, bazen daha çok şey söylüyordu." size={56} y={430} /> },
  { c: "7 Kasım", img: "27", yr: 2026, ov: [{ t: "date", a: "7 Kasım 2026", b: "Bursa" }] },
  { c: "Emre gülümsüyor", img: "28" },
  { c: "Arıyor", r: (t, a) => <Phone t={t} a={a} ring msg="1 kez…" top="" right="" color="#2A2A2E" screen="#9FD3E6" />, sfx: "buzz" },
  { c: "Birkaç saniye sonra", r: (t, a) => <Phone t={t} a={a} top="Yeni mesaj" right="" msg="nbr." color="#2A2A2E" screen="#9FD3E6" />, sfx: "ding" },
  { c: "Senin ilk telefonun", img: "03", ov: [{ t: "cap", a: "Senin ilk telefonun neydi? Çaldır kapat kodun?", d: 0.4 }, { t: "cay", d: 1 }] },
];

export const { Comp: K5Video08, seconds: K5_08_SECONDS } = makeK5({ id: "k5-08", words, shots: SHOTS, year: 2001, gauge: ["BİTTİ", "KONTÖR DOLU"], title: "Konuşmadan nasıl anlaşılır?" });
void Fig; void EMRE;
