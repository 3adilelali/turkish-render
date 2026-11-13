import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { PFrame, PFig, ValideOda, Sedir2, NightVeil, Bebek, Samdan } from "../components/HaremPro";
import { DogumSandalye, Saksi, SerbetTepsi, Nazarlik, Kurdele } from "../components/HaremHamile";
import { Ates, GulKutu, KafesIc, Gul } from "../components/HaremPrenses";
import { Yayla } from "../components/Eras";
import { Kuma } from "./Kuma";

// Yeni figür/nesne fikstürleri (her saniye bir sahne)
const Figs: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const k = Math.floor(t);
  return (
    <AbsoluteFill>
      <PFrame>
        {k === 0 && <><ValideOda t={t} win={0.2} /><PFig x={420} y={1005} s={1.1} kind="girl" robe="#A9C6DA" t={t} belly={0.35} hands="belly" face="normal" /><PFig x={820} y={1005} s={1.1} kind="girl" robe="#A9C6DA" t={t} belly={0.88} hands="belly" face="worried" /><PFig x={1220} y={1005} s={1.1} kind="kalfa" t={t} look={-0.5} /><PFig x={1600} y={1005} s={1.18} kind="sultan" t={t} look={-0.4} /></>}
        {k === 1 && <><ValideOda t={t} win={0.95} /><Sedir2 x={1000} y={900} w={760} /><PFig x={1000} y={880} s={1.1} kind="girl" robe="#A9C6DA" t={t} sit belly={0.88} hands="belly" face="worried" look={0.3} /><PFig x={400} y={1005} s={1.06} kind="girl" robe="#D98E8E" t={t} hands="tray" trayItem={<SerbetTepsi t={t} glow={0.6} />} /><Saksi x={1300} y={830} s={0.62} t={t} /><NightVeil id="d1" k={0.62} lights={[{ x: 560, y: 700, r: 420 }, { x: 1010, y: 660, r: 360, f: 0.85 }]} t={t} /></>}
        {k === 2 && <><ValideOda t={t} win={0.2} /><PFig x={500} y={1005} s={1.16} kind="kalfa" robe="#7A4A3A" robe2="#F1E3C6" scarf="#F4EAD6" t={t} hands="baby" face="smile" /><DogumSandalye x={1000} y={1010} s={1.0} /><PFig x={1500} y={880} s={1.1} kind="girl" robe="#A9C6DA" t={t} sit hands="baby" face="smile" /><Kurdele x={1700} y={600} s={1} t={t} /><Nazarlik x={1200} y={200} s={0.8} t={t} /><Samdan x={1820} y={1010} t={t} /></>}
        {k === 3 && <><Yayla t={t} night={0.9} /><Ates x={960} y={960} s={1.1} t={t} /><PFig x={600} y={1005} s={1.1} kind="girl" robe="#2F6B4A" robe2="#F2DDB0" scarf="#B8242C" t={t} face="shy" reach={0.8} reachDir={1} item={<Gul s={0.7} />} /><PFig x={1400} y={1005} s={1.12} kind="prince" plain robe="#7A5A3A" robe2="#E9DCC2" t={t} look={-0.6} /><NightVeil id="d2" k={0.62} lights={[{ x: 960, y: 760, r: 620 }]} t={t} /></>}
        {k === 4 && <><KafesIc t={t} /><GulKutu x={600} y={980} s={1.2} open={1} /><PFig x={1200} y={1005} s={1.0} kind="girl" robe="#2F6B4A" robe2="#F2DDB0" scarf="#B8242C" t={t} face="sad" /><g transform="translate(1600,700) scale(3)"><Bebek t={t} cry={1} /></g></>}
      </PFrame>
    </AbsoluteFill>
  );
};

export const DevRoot: React.FC = () => (
  <>
    <Composition id="DevKuma" component={Kuma} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="DevFigs" component={Figs} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
