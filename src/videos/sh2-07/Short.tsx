import words from "../../../public/data/sh2-07-words.json";
import { TCam } from "../../components/Toon";
import { BogazKesit } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #7 · «Boğaz'ın Suyu Bir Gecede Çekilse Ne Görürdük?» (النوع أ، 90/100)
// السكربت والمصادر: السكربتات/sh2-07-bogaz.txt (أعمق نقطة 110 م، Marmaray 60 م، التيار التحتاني)

// havada kalan iskele (sol yamaç)
const iskele = (k: number) => (
  <g opacity={k}>
    <rect x={560} y={228} width={260} height={20} fill="#8A5A32" />
    {[600, 680, 760].map((x) => <rect key={x} x={x} y={248} width={14} height={60} fill="#6E4628" />)}
    <rect x={540} y={180} width={60} height={50} fill="#E0393E" /><text x={570} y={214} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={18} fill="#FFFFFF">İSKELE</text>
  </g>
);
const etiket = (x: number, y: number, s: string, c: string) => <text x={x} y={y} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={40} fill={c} stroke="#0B1426" strokeWidth={8} paintOrder="stroke">{s}</text>;

export const { SECONDS: SH2_07_SECONDS, Comp: Sh2Short07 } = makeShort2({
  words: words as W[],
  audio: "sh2-07",
  hook: "BOĞAZ'IN SUYU ÇEKİLSE?",
  hookUntil: 3.6,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const tKara = cue("Karadeniz'e");
    const S: Sh[] = [
      // 0 · soru
      { c: "İstanbul", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.3]} c0={[960, 420]}><BogazKesit t={t} water={1} /></TCam> },
      // su çekiliyor
      { c: "Önce vapurlar", sfx: "drone", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.2]} c0={[960, 600]}><BogazKesit t={t} water={1 - ramp(t, a, a + 1.6)} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.2} text="YERE OTURUR" y={1040} c="#F6C445" rot={-5} /> },
      { c: "İskeleler", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[720, 320]}><BogazKesit t={t} water={0} />{iskele(1)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="İSKELELER HAVADA" y={330} /> },
      // derinlik
      { c: "Sonra derinlik", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.4]} c0={[960, 360]} c1={[960, 820]}><BogazKesit t={t} water={0} ruler={ramp(t, a + 0.6, a + 1.4)} /></TCam> },
      { c: "En derin", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><BogazKesit t={t} water={0} ruler={1} />{etiket(800, 320, "BEBEK", "#FFFFFF")}{etiket(1110, 320, "KANDİLLİ", "#FFFFFF")}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="EN DERİN YER" y={330} c="#2EE6D0" /> },
      { c: "Yüz on", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1100, 640]}><BogazKesit t={t} water={0} ruler={1} /></TCam>,
        html: (t, a) => <Sayi t={t} at={a} to={110} dur={0.9} unit="METRE" y={330} c="#F6C445" /> },
      { c: "Neredeyse", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.15]} c0={[960, 600]}><BogazKesit t={t} water={0} ship={0} towers={ramp(t, a + 0.3, a + 1.6)} ruler={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="≈ 2 GALATA KULESİ" y={330} c="#F6C445" /> },
      // Marmaray
      { c: "Biraz güneyde", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.9]} c0={[960, 600]} c1={[960, 900]}><BogazKesit t={t} water={0} ship={0} tube={ramp(t, a + 0.8, a + 1.8)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.4} text="DEV BETON TÜP" y={330} /> },
      { c: "Marmaray", sfx: "ding", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, 920]}><BogazKesit t={t} water={0} ship={0} tube={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="MARMARAY" y={330} c="#2EE6D0" size={110} /><Sayi t={t} at={a + 0.9} to={60} dur={0.8} unit="METRE ALTINDA" y={520} c="#F6C445" /></> },
      { c: "Dünyanın", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 860]}><BogazKesit t={t} water={0} ship={0} tube={1} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.9} text="DÜNYA REKORU" y={400} c="#F6C445" rot={-5} size={80} /> },
      // iki nehir
      { c: "Ama en", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><BogazKesit t={t} water={ramp(t, a, a + 1.4)} ship={0} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.7} text="AMA ASIL ŞAŞIRTICI..." y={330} size={80} /> },
      { c: "Boğaz'da iki", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><BogazKesit t={t} water={1} flow={ramp(t, a + 0.3, a + 1)} ship={0} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.4} text="İKİ NEHİR" y={1020} c="#2EE6D0" rot={-4} size={110} /> },
      { c: "Üstteki su", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.8]} c0={[960, 330]}><BogazKesit t={t} water={1} flow={1} ship={0} />{etiket(960, 360, "MARMARA'YA →", "#FFFFFF")}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="ÜST AKINTI" y={330} /> },
      { c: "Ama yaklaşık", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 560]}><BogazKesit t={t} water={1} flow={1} ship={0} />{t > tKara && etiket(960, 640, "← KARADENİZ'E", "#F6C445")}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.4} text="~20 METRE AŞAĞIDA" y={330} size={80} /><Damga t={t} at={a + 2.1} text="TERS YÖNE!" y={1040} c="#F6C445" rot={-5} /></> },
      { c: "Aynı denizde", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 500]}><BogazKesit t={t} water={1} flow={1} ship={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="ÜST ÜSTE, ZIT İKİ AKINTI" y={330} size={76} /> },
      { c: "Yani Boğaz", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]}><BogazKesit t={t} water={1} flow={1} ship={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.6} text="1 NEHİR DEĞİL..." y={330} /><Damga t={t} at={a + 2.1} text="2!" y={480} c="#2EE6D0" size={200} /></> },
      // döngü
      { c: "Sen dipte", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 700]}><BogazKesit t={t} water={0} tube={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="DİPTE NE ARARDIN?" y={330} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
