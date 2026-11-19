import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TFrame, TCam } from "../../components/Toon";
import { CAST, DFig, Konak, KonakBahce, HastaneOda, Hapis, OkulKapisi, Tersane, Konsey, Sahil, Ofis, Foto4, SiyahMinibus } from "../../components/Dizi";

const names = ["haydar", "bozo", "ceylan", "sultan", "melek", "ruzgar", "yilmaz", "derya", "ada", "efraim", "gulsum", "asli"];
export const K8Cast: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const scene = Math.floor(t);
  const bgs = [
    () => <rect width={1920} height={1080} fill="#E8E2D4" />,
    () => <Konak t={t} room="salon" />, () => <Konak t={t} room="oda" />, () => <Konak t={t} room="mutfak" night={0} />,
    () => <KonakBahce t={t} />, () => <HastaneOda t={t} />, () => <Hapis t={t} />, () => <Hapis t={t} mode="avlu" />,
    () => <OkulKapisi t={t} />, () => <Tersane t={t} lights={1} flood={0.4} />, () => <Konsey t={t} />, () => <Sahil t={t} />, () => <Ofis t={t} />,
  ];
  const B = bgs[Math.min(scene, bgs.length - 1)];
  return (
    <AbsoluteFill>
      <TFrame>
        <B />
        {scene === 0 && names.map((n, i) => <DFig key={n} x={110 + i * 155} y={1000} s={n === "ada" ? 0.6 : 0.9} o={CAST[n]} t={t} seed={i} mouth={i % 3 ? "flat" : "smile"} />)}
        {scene === 13 && <TCam t={t} a={13} b={14} z={[3, 3]} c0={[700, 600]}><DFig x={600} y={1000} o={CAST.haydar} t={t} brow="angry" mouth="tight" /><DFig x={820} y={1000} o={CAST.ceylan} t={t} dir={-1} brow="worried" eyes="sad" /></TCam>}
        {scene === 14 && <><Foto4 x={600} y={500} reveal={0} /><SiyahMinibus x={1450} y={900} s={0.8} t={t} /></>}
        {scene > 0 && scene < 13 && <DFig x={1000} y={1000} o={CAST.bozo} t={t} brow="angry" mouth="smirk" />}
      </TFrame>
    </AbsoluteFill>
  );
};
