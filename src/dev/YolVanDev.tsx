import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TFrame, TFig, P, HERO, Outfit } from "../components/Toon";
import { Kopek, Radyo } from "../components/SonIki";
import { InceBardak } from "../components/K2Dikey3";
import {
  Araba, ArabaIci, Benzinlik, Bileklik, Cesme, Defter, GeceModu, HUD2, Harita, Istasyon, Kizilay, Kulube, Kurt, KurtIzi, Lokanta, MorsDuvar,
  RadyoOdasi, TenekeKutu, VanGece, VanKedisi, YolSahne,
} from "../components/YolVan";

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const DEFNE_K: Outfit = { top: "#C9473E", top2: "#9E342D", kind: "coat", hair: "ponytail", hairColor: "#3A2418", shoes: "#F4F4F4" };
const YABANCI: Outfit = { top: "#6E7B3A", top2: "#56612C", kind: "coat", inner: "#F28C28", hair: "cap", hairColor: "#2A2A2A", shoes: "#3A2A20" };

// her saniye bir sahne (k2r-17 kit fikstürü)
export const YolVanDev: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30; const k = Math.floor(t);
  const inCar = (dog = true) => ({
    front: <TFig x={95} y={-20} s={0.42} o={DEFNE_K} t={t} pose={P.sit} rim={0.3} />,
    back: <TFig x={-110} y={-20} s={0.42} o={SEN} t={t} pose={P.sit} rim={0.3} mouth="grin" />,
    dog: dog ? <Kopek x={-178} y={-178} s={0.3} t={t} kind="kara" sit={1} dir={-1} /> : undefined,
  });
  return (
    <AbsoluteFill>
      <TFrame>
        {k === 0 && <Harita t={t} k={0.36} />}
        {k === 1 && <><YolSahne t={t} kind="otoyol" mode="day" px={t * 400} snow={0.3} /><Araba x={900} y={960} s={0.9} t={t} speed={1} smoke={0.6} {...inCar()} /><HUD2 t={t} gun={1} km={1600} /></>}
        {k === 2 && <><YolSahne t={t} kind="bozkir" mode="dusk" sun={1} /><Araba x={900} y={960} s={0.9} t={t} {...inCar(false)} /><GeceModu t={t} a={1.5} saat="18:12" notes={[{ x: 700, y: 900, text: "SOL ARKA: HAVA −%10" }, { x: 1100, y: 760, text: "ÇATLAK +2 CM", dx: 160, dy: -200 }, { x: 990, y: 740, text: "NAKARAT YANLIŞ", dx: -220, dy: -260 }]} /><HUD2 t={t} gun={1} km={1460} gece /></>}
        {k === 3 && <MorsDuvar t={t} text="15 DK BEKLE" surf="kaya" k={0.7} dust={1} snow={1} />}
        {k === 4 && <><YolSahne t={t} kind="dag" mode="day" snow={1} fall={0.6} /><KurtIzi /><Kurt x={1500} y={760} s={0.5} t={t} dir={1} /><Kurt x={1650} y={770} s={0.45} t={t + 0.3} dir={1} /></>}
        {k === 5 && <Cesme t={t} dug={1} dog={<Kopek x={1260} y={1000} s={0.6} t={t} kind="kara" />} />}
        {k === 6 && <Istasyon t={t} mors={<MorsDuvar t={t} text="BEŞ" surf="istasyon" bg={false} y={430} k={1} />} />}
        {k === 7 && <Benzinlik t={t} people={<><TFig x={1780} y={1040} s={0.95} o={YABANCI} t={t} pose={P.sit} dir={-1} rim={0.3} mouth="smile" /><TFig x={1380} y={1040} s={0.95} o={SEN} t={t} pose={P.sit} rim={0.3} mouth="grin" /></>} />}
        {k === 8 && <><YolSahne t={t} kind="ova" mode="day" snow={1} road={false} /><Araba x={760} y={980} s={1} t={t} hood={1} battery={false} id="h" /><Radyo x={1500} y={1000} s={0.6} t={t} on={1} /></>}
        {k === 9 && <MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={1} snow={0.8} />}
        {k === 10 && <><YolSahne t={t} kind="tipi" mode="night" snow={1} road={false} /><Kulube x={1500} y={900} s={0.8} t={t} light={1} /><Araba x={600} y={960} s={0.85} t={t} snow={1} buried={1} co={1} lights={0.4} id="c" back={<TFig x={-110} y={-20} s={0.42} o={SEN} t={t} pose={P.sit} eyes="closed" rim={0.3} />} /></>}
        {k === 11 && <><YolSahne t={t} kind="ova" mode="night" stars={1} /><GeceModu t={t} a={10} k={0.6} crash={1} /></>}
        {k === 12 && <><VanGece t={t} /><VanKedisi x={400} y={1000} s={0.9} t={t} /></>}
        {k === 13 && <RadyoOdasi t={t} bardak={<InceBardak x={0} y={0} s={0.5} tea={1} saucer={false} />} />}
        {k === 14 && <><rect width={1920} height={1080} fill="#E9DCC6" /><Defter lines={["1. gece: güneş batınca başladı.", "03:14'te bitti.", "Güneş batınca dahi. Sonra salak."]} corner="03.14" erased="İkisi de benim." erase={0.5} /></>}
        {k === 15 && <><rect width={1920} height={1080} fill="#E9DCC6" /><TenekeKutu y={760} s={0.9} /><Bileklik y={300} s={0.95} /></>}
        {k === 16 && <><Kizilay t={t} /><Araba x={1300} y={1000} s={0.8} t={t} flat={1} id="k" /></>}
        {k === 17 && <Lokanta t={t} people={<><TFig x={700} y={1000} s={0.95} o={SEN} t={t} pose={P.sit} rim={0.3} /><TFig x={1220} y={1000} s={0.95} o={DEFNE_K} t={t} pose={P.sit} dir={-1} rim={0.3} brow="angry" /></>} />}
        {k === 18 && <ArabaIci t={t} mode="day" kind="otoyol" left={<TFig x={700} y={1060} s={1.15} o={SEN} t={t} pose={P.sit} rim={0.3} mouth="grin" />} right={<TFig x={1220} y={1060} s={1.15} o={DEFNE_K} t={t} pose={P.hold} dir={-1} rim={0.3} mouth="smile" />} dog={<Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} />} />}
        {k === 19 && <><ArabaIci t={t} mode="night" kind="bozkir" move={false} glow={1} left={<TFig x={700} y={1060} s={1.15} o={SEN} t={t} pose={P.sit} rim={0.3} mouth="flat" eyes="squint" />} right={<TFig x={1220} y={1060} s={1.15} o={DEFNE_K} t={t} pose={P.hold} dir={-1} rim={0.3} mouth="o" eyes="wide" />} dog={<Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} sleep={1} />} /><GeceModu t={t} a={19} /></>}
      </TFrame>
    </AbsoluteFill>
  );
};
