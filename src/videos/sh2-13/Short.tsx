import words from "../../../public/data/sh2-13-words.json";
import { HERO, Outfit, P, TCam, TFig, TPose, lerp } from "../../components/Toon";
import { YatakOda } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #13 · «Deprem Başladı: İlk 10 Saniyede Ne Yapmalısın?» (النوع ج، توعية)
// السكربت والمصادر: السكربتات/sh2-13-deprem.txt (AFAD: Çök-Kapan-Tutun، و«hayat üçgeni» مش توصية رسمية)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#3A7BD5", top2: "#2A5BA5" };
const KAPAN: TPose = { l: [150, 40], r: [150, 40], ll: [90, 0], rl: [90, 0], lean: 30 };
const TUTUN: TPose = { l: [150, 40], r: [70, 60], ll: [90, 0], rl: [90, 0], lean: 24 };
const RED = "#E0393E", TQ = "#2EE6D0";

// büyük masa (önde)
const Masa = ({ dx = 0 }: { dx?: number }) => (
  <g transform={`translate(${dx},0)`}>
    <rect x={720} y={700} width={480} height={34} rx={6} fill="#A86E40" stroke="#6E4628" strokeWidth={5} />
    <rect x={740} y={734} width={28} height={290} fill="#8A5A32" /><rect x={1152} y={734} width={28} height={290} fill="#8A5A32" />
  </g>
);
const oda = (t: number, shake = 0, dx = 0, kid?: React.ReactNode) => <g><YatakOda t={t} shake={shake} masa={false} /><rect y={1000} width={1920} height={80} fill="#3A2C24" /><g transform={`translate(${Math.sin(t * 40) * shake},0)`}><Masa dx={dx} />{kid}</g></g>;
const kapanan = (t: number, pose: TPose, dx = 0) => <TFig x={960 + dx} y={1060} s={0.62} o={SEN} t={t} pose={pose} eyes="closed" brow="worried" mouth="flat" />;
const carpi = (x: number, y: number, k: number) => <g opacity={k} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * k})`}><path d="M-60,-60 L60,60 M60,-60 L-60,60" stroke={RED} strokeWidth={22} strokeLinecap="round" /></g>;
// tehlike ikonları: merdiven / asansör / balkon
const Ikonlar = ({ t, a, x = 0 }: { t: number; a: number; x?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A2236" />
    <g transform="translate(960,200)" opacity={ramp(t, a, a + 0.3)}><path d="M-110,90 H-60 V40 H-10 V-10 H40 V-60 H90 V-110" stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinejoin="round" />{carpi(0, 0, x)}</g>
    <g transform="translate(960,420)" opacity={ramp(t, a + 0.5, a + 0.8)}><rect x={-80} y={-110} width={160} height={220} rx={10} fill="none" stroke="#FFFFFF" strokeWidth={14} /><path d="M0,-110 V110" stroke="#FFFFFF" strokeWidth={8} /><path d="M-40,-150 l20,-24 l20,24 M20,-174 l20,24 l20,-24" stroke="#FFFFFF" strokeWidth={8} fill="none" />{carpi(0, 0, x)}</g>
    <g transform="translate(960,640)" opacity={ramp(t, a + 1, a + 1.3)}><path d="M-120,0 H120 M-120,0 V-90 M120,0 V-90 M-120,-90 H120" stroke="#FFFFFF" strokeWidth={14} />{[-80, -40, 0, 40, 80].map((xx) => <path key={xx} d={`M${xx},0 V-90`} stroke="#FFFFFF" strokeWidth={8} />)}{carpi(0, -40, x)}</g>
  </g>
);
const Pencere = ({ t, k }: { t: number; k: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#2E3A52" />
    <rect x={700} y={140} width={260} height={340} fill="#14203A" stroke="#C9CDD0" strokeWidth={12} /><path d="M830,140 V480 M700,310 H960" stroke="#C9CDD0" strokeWidth={8} />
    <path d="M760,200 L800,260 L780,300 M880,360 L850,420" stroke="#FFFFFF" strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(t * 20)} />
    <g transform={`translate(1110,560) rotate(${Math.sin(t * 14) * 3})`}><rect x={-110} y={-380} width={220} height={760} fill="#8A5A32" stroke="#5E3E22" strokeWidth={8} /><path d="M0,-380 V380" stroke="#5E3E22" strokeWidth={6} /><circle cx={-20} cy={0} r={8} fill="#F6C445" /><circle cx={20} cy={0} r={8} fill="#F6C445" /></g>
    {carpi(830, 310, k)}{carpi(1110, 560, k)}
  </g>
);
const Ucgen = ({ k }: { k: number }) => (
  <g transform="translate(960,440) scale(0.8)">
    <path d="M-260,200 L0,-240 L260,200Z" fill="none" stroke="#F6C445" strokeWidth={18} strokeLinejoin="round" />
    <text y={150} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={220} fill="#F6C445">?</text>
    {carpi(0, 0, k)}
  </g>
);
const Ayakkabi = ({ t }: { t: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2C24" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${700 + (i * 47) % 520},${300 + (i * 83) % 600} l${20 + (i % 3) * 10},-30 l14,40Z`} fill="#BFE3F2" opacity={0.7} />)}
    <g transform={`translate(960,${640 + Math.sin(t * 3) * 6})`}><path d="M-200,40 Q-210,-60 -120,-80 L0,-80 Q40,-20 160,-10 Q220,0 220,40Z" fill="#E0393E" stroke="#8A1A1E" strokeWidth={8} /><rect x={-210} y={40} width={440} height={36} rx={14} fill="#F4F4F2" /><path d="M-100,-60 L-40,-40 M-90,-40 L-30,-20" stroke="#FFFFFF" strokeWidth={8} /></g>
  </g>
);
const kart = (t: number, at: number, i: number, s: string) => <g opacity={ramp(t, at, at + 0.25)} transform={`translate(960,${260 + i * 190}) scale(${0.8 + 0.2 * ramp(t, at, at + 0.25)})`}><rect x={-260} y={-80} width={520} height={160} rx={30} fill={[RED, "#F6C445", TQ][i]} /><text y={36} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={100} fill="#0B1426">{s}</text></g>;

export const { SECONDS: SH2_13_SECONDS, Comp: Sh2Short13 } = makeShort2({
  words: words as W[],
  audio: "sh2-13",
  hook: "DEPREM: İLK 10 SANİYE",
  hookUntil: 3.2,
  build: (cue) => {
    const tGon = cue("videoyu");
    const S: Sh[] = [
      { c: "Deprem", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]} c0={[960, 600]} shake={8}>{oda(t, 10)}</TCam> },
      { c: "İlk on", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: () => <rect width={1920} height={1080} fill="#0E1A2E" />,
        html: (t, a) => <><Sayi t={t} at={a} from={10} to={0} dur={2} unit="SANİYE" y={560} c="#F6C445" /><VT t={t} at={a + 0.6} text="NE YAPMALISIN?" y={330} /></> },
      { c: "Gece üç", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[780, 640]}><YatakOda t={t} masa={false} /><TFig x={720} y={800} s={0.5} o={SEN} t={t} pose={P.sit} eyes="closed" mouth="flat" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="03:00" y={330} c={TQ} size={130} /> },
      { c: "Yatak", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[780, 640]} shake={10}><YatakOda t={t} shake={12} masa={false} /><TFig x={720} y={800} s={0.5} o={SEN} t={t} pose={P.shock} eyes="wide" brow="worried" mouth="o" sweat /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.3} text="SALLANIYOR!" y={1040} c={RED} rot={-5} /> },
      { c: "Beynin", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 700]} shake={6}>{oda(t, 8, 0, <TFig x={lerp(880, 1100, ramp(t, a, b))} y={1040} s={0.6} o={SEN} t={t} pose={P.run} eyes="wide" mouth="o" />)}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.9} text="KAÇ!" y={330} c="#F6C445" rot={-6} size={140} /> },
      { c: "Ama sarsıntı", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 700]}>{oda(t, 6, 0, <TFig x={1100} y={1040} s={0.6} o={SEN} t={t} pose={P.run} eyes="wide" mouth="o" />)}{carpi(1100, 760, ramp(t, a + 0.5, a + 0.8))}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1} text="KOŞMAK TEHLİKELİ" y={330} c={RED} size={90} /> },
      { c: "Merdivenler", sfx: "pop", tone: "cool", bg: "#1A2236", r: (t, a) => <Ikonlar t={t} a={a} x={0} /> },
      { c: "Hepsi risk", sfx: "boom", tone: "cool", bg: "#1A2236", r: (t, a) => <Ikonlar t={t} a={a - 2} x={ramp(t, a, a + 0.3)} />,
        html: (t, a) => <Damga t={t} at={a + 0.3} text="HEPSİ RİSK" y={1060} c={RED} rot={-4} /> },
      { c: "AFAD'ın", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: () => <rect width={1920} height={1080} fill="#0E1A2E" />,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="AFAD DİYOR Kİ:" y={330} c={TQ} /><Sayi t={t} at={a + 0.9} to={3} dur={0.4} unit="KELİME" y={600} c="#F6C445" /></> },
      { c: "Çök", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 780]}>{oda(t, 6, 0, <TFig x={1000} y={lerp(1040, 1070, ramp(t, a, a + 0.5))} s={0.62} o={SEN} t={t} pose={P.sit} eyes="squint" brow="worried" mouth="flat" />)}</TCam>,
        html: (t, a) => <VT t={t} at={a} text="1 · ÇÖK" y={330} c={RED} size={130} /> },
      { c: "Kapan", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[980, 820]}>{oda(t, 6, 0, kapanan(t, KAPAN, 40))}</TCam>,
        html: (t, a) => <><VT t={t} at={a} text="2 · KAPAN" y={330} c="#F6C445" size={130} /><VT t={t} at={a + 1.6} text="BAŞINI VE ENSENİ KORU" y={520} size={66} /></> },
      { c: "Sağlam", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 800]}>{oda(t, 5, 0, kapanan(t, KAPAN, 0))}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="SAĞLAM MASA ALTI" y={330} size={84} /> },
      { c: "Tutun", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.9, 2.2]} c0={[900, 840]}>{oda(t, 6, 0, kapanan(t, TUTUN, -40))}</TCam>,
        html: (t, a) => <><VT t={t} at={a} text="3 · TUTUN" y={330} c={TQ} size={130} /><VT t={t} at={a + 1} text="MASANIN AYAĞINA" y={520} size={70} /></> },
      { c: "Masa kayarsa", sfx: "whoosh", tone: "warm", r: (t, a, b) => { const dx = Math.sin((t - a) * 3) * 80; return <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 800]} shake={6}>{oda(t, 6, dx, kapanan(t, TUTUN, dx - 40))}</TCam>; },
        html: (t, a) => <VT t={t} at={a + 0.8} text="SEN DE ONUNLA GİT" y={330} size={84} /> },
      { c: "Pencereden", sfx: "pop", tone: "cool", r: (t, a) => <Pencere t={t} k={ramp(t, a + 1, a + 1.6)} />,
        html: (t, a) => <VT t={t} at={a + 2} text="CAM · DOLAP: UZAK DUR" y={1060} c="#F6C445" size={70} /> },
      { c: "Peki ya", sfx: "drone", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Ucgen k={0} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="HAYAT ÜÇGENİ?" y={330} c="#F6C445" /> },
      { c: "AFAD, onun", sfx: "boom", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><g opacity={1 - ramp(t, a + 1.2, a + 1.6)}><Ucgen k={ramp(t, a + 0.2, a + 0.5)} /></g>{kart(t, a + 1.4, 0, "ÇÖK")}{kart(t, a + 1.8, 1, "KAPAN")}{kart(t, a + 2.2, 2, "TUTUN")}</g> },
      { c: "Sarsıntı bitince", sfx: "pop", tone: "warm", r: (t) => <Ayakkabi t={t} />,
        html: (t, a) => <><VT t={t} at={a + 0.6} text="AYAKKABINI GİY 👟" y={330} size={84} /><Damga t={t} at={a + 1.8} text="CAM KIRIKLARI!" y={1060} c={RED} rot={-4} size={80} /></> },
      { c: "Sonra sakin", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><YatakOda t={t} masa={false} /><TFig x={lerp(760, 1100, ramp(t, a, b + 0.5))} y={1000} s={0.6} o={SEN} t={t} mouth="flat" /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="SAKİN ÇIK" y={330} c={TQ} size={110} /> },
      { c: "Bunu bir", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{kart(t, a, 0, "ÇÖK")}{kart(t, a + 0.2, 1, "KAPAN")}{kart(t, a + 0.4, 2, "TUTUN")}</g>,
        html: (t, a) => <>{t > tGon && <VT t={t} at={tGon} text="SEVDİKLERİNE GÖNDER ↗" y={1500} size={70} c="#F6C445" />}</> },
    ];
    return S;
  },
});
