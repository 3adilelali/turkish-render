import React from "react";
import { useCurrentFrame } from "remotion";
import { TFrame, TFig, HERO, P } from "../../components/Toon";
import * as S from "../../components/SonIki";

const DEFNE = { top: "#E0566A", top2: "#B8404F", kind: "sweater" as const, hair: "ponytail" as const, hairColor: "#3A2418", shoes: "#F4F4F4" };
const SEN = { ...HERO, kind: "hoodie" as const, top: "#1FC8B4", top2: "#159A8B" };
const scenes: ((t: number) => React.ReactNode)[] = [
  (t) => <><S.Sehir t={t} mode="day" /><S.HUD t={t} gun={1} /></>,
  (t) => <S.Sehir t={t} mode="dusk" sun={1} lights={0.3} />,
  (t) => <S.Sehir t={t} mode="night" lights={1} stars={0.5} />,
  (t) => <S.Sehir t={t} mode="night" milky={1} stars={1} />,
  (t) => <S.KuleSahne t={t} night={1} lit={1} />,
  (t) => <S.KuleSahne t={t} lodos={1} rain={0.8} near={0.4} boat={<S.Kayik x={700} y={930} s={0.8} t={t} row={t} tilt={Math.sin(t*2)*10} water={0.4} rower={<TFig x={0} y={-40} s={0.5} o={SEN} t={t} pose={P.reach} />} dog={<S.Kopek x={0} y={0} s={0.5} t={t} sit={1} />} />} />,
  (t) => <S.KuleIci t={t} />,
  (t) => <><S.BosSokak t={t} /><S.Kedi x={800} y={1040} t={t} s={1.2} /><S.Kedi x={1600} y={1040} t={t} c="#444" walk={1} /></>,
  (t) => <><S.Sinif t={t} /><TFig x={600} y={1040} s={1} o={DEFNE} t={t} pose={P.sit} /></>,
  (t) => <><S.Kahvalti t={t} /><S.Terlik x={300} y={1000} s={0.6} /></>,
  (t) => <S.Cati t={t} lid={1} />,
  (t) => <S.Kuyumcu t={t} />,
  (t) => <S.Market t={t} spoiled={1} dark={1} />,
  (t) => <><S.Taksim t={t} /><S.Kopek x={600} y={1040} t={t} kind="kangal" s={1.3} bark={1} /><S.Kopek x={900} y={1040} t={t} kind="sokak" run={1} /></>,
  (t) => <S.Eczane t={t} />,
  (t) => <S.Otel t={t} />,
  (t) => <S.Stad t={t} />,
  (t) => <><S.AhsapIc t={t} snow={1} /><S.Kopek x={600} y={1040} t={t} sleep={1} /></>,
  (t) => <S.Halic t={t} dolphin={(t%2)/2} boat={<S.Kayik x={1100} y={860} s={0.7} t={t} />} />,
  (t) => <><S.Kopru t={t} dusk={1} /><TFig x={800} y={1040} s={1} o={SEN} t={t} pose={P.sit} /><TFig x={1000} y={1040} s={1} o={DEFNE} t={t} pose={P.sit} dir={-1} /></>,
  (t) => <S.Kutuphane t={t} />,
  (t) => <S.Firin2 t={t} simits={1} burnt={1} />,
  (t) => <S.Nufus t={t} k={0.5} />,
  (t) => <><rect width={1920} height={1080} fill="#E9D9C0" /><S.Zarf x={600} y={400} /><S.Radyo x={1300} y={700} t={t} on={1} voice={1} /><S.Konserve x={200} y={1000} /><S.Bidon x={400} y={1000} /><S.Dondurma x={600} y={900} n={7} /><S.Poset x={900} y={1000} /><S.Istavrit x={1100} y={950} t={t} /><S.Kopek x={1600} y={1040} t={t} kind="kara" sit={1} /></>,
  (t) => <><rect width={1920} height={1080} fill="#E9D9C0" /><S.Mektup2 x={960} y={540} lines={["Notlarımın üstüne çay döktüğün için", "sana kızmadım. Aslında hiç kızmadım.", "Denemeden sonra Karaköy'de", "çay içelim mi? Bu sefer dökme."]} sign="— Defne" /></>,
  (t) => <><rect width={1920} height={1080} fill="#0E1A2E" /><g transform="translate(960,540)"><S.Telefon s={1.6} msgs={[{who:"Emre",text:"yarın deneme var 😭"},{who:"Zeynep",text:"çalışan var mı"},{who:"Can",text:"🐸 [çıkartma]"}]} time="03:14" /></g><S.MorsKagit x={400} y={700} s={0.5} k={1} rows={[["-.--", "Y"],[".-", "A"]]} /><S.FenerIsik x={1200} y={900} /></>,
  (t) => <><S.Sehir t={t} mode="day" /><S.Motor x={900} y={1000} t={t} tilt={-6} rider={<TFig x={0} y={0} s={0.8} o={SEN} t={t} pose={P.reach} />} /><S.Bilezikler x={960} y={300} s={0.6} t={t} /></>,
];
export const SiKitTest: React.FC = () => { const f = useCurrentFrame(); const i = Math.floor(f / 30); const t = f / 30 + 0.5; return <TFrame>{scenes[i % scenes.length](t)}</TFrame>; };
export const SI_KIT_N = scenes.length;
