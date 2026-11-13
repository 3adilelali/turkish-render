import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PFrame, PFig } from "../components/HaremPro";
import { CibaliSokak, EvOda, TutunFabrika, HamamPro, Gazete, EkmekVesika, RecelTabak, Kavanoz, Bilezik, CelpKagit, Mangal } from "../components/HaremKuma";

const fer = (t: number, x: number, o = {}) => <PFig x={x} y={1005} s={1.1} kind="girl" robe="#5A2A4A" robe2="#E9D8C0" scarf="#F2E6D0" t={t} seed={3} {...o} />;
const lem = (t: number, x: number, o = {}) => <PFig x={x} y={1005} s={1.0} kind="girl" robe="#8AAAC0" robe2="#EFE6D4" scarf="#D8C8A8" t={t} seed={7} {...o} />;
const mur = (t: number, x: number, o = {}) => <PFig x={x} y={1005} s={1.12} kind="valide" plain robe="#3A3A4A" robe2="#D9CFC0" t={t} seed={5} {...o} />;
const riza = (t: number, x: number, o = {}) => <PFig x={x} y={1005} s={1.14} kind="prince" plain fes robe="#2A2E3A" robe2="#D9D2C4" t={t} seed={8} {...o} />;

export const Kuma: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const k = Math.floor(t);
  return (
    <AbsoluteFill>
      <PFrame>
        {k === 0 && <><CibaliSokak t={t} pan={200} />{fer(t, 700, { face: "worried" })}{riza(t, 1100, { look: -0.5 })}</>}
        {k === 1 && <><CibaliSokak t={t} pan={600} fire={1} dusk={0.6} />{fer(t, 960, { face: "shock" })}</>}
        {k === 2 && <><EvOda t={t} />{mur(t, 600, { look: 0.5 })}{fer(t, 1000, { sit: true, y: 880, face: "sad" })}<Mangal x={1500} y={1040} t={t} /></>}
        {k === 3 && <><EvOda t={t} night={1} cold={0.6} />{lem(t, 900, { face: "sad" })}</>}
        {k === 4 && <><TutunFabrika t={t} />{fer(t, 700, { sit: true, y: 930 }, )}{lem(t, 1100, { sit: true, y: 930, face: "smile" })}</>}
        {k === 5 && <><HamamPro t={t} />{lem(t, 800, { face: "sad", bow: 0.5 })}{fer(t, 1200, { face: "normal" })}</>}
        {k === 6 && <><rect width={1920} height={1080} fill="#3A2A20" /><Gazete t={t} x={600} y={540} s={0.9} /><EkmekVesika x={1380} y={300} s={0.9} /><CelpKagit x={1400} y={780} s={0.7} /></>}
        {k === 7 && <><rect width={1920} height={1080} fill="#E9DCC0" /><Kavanoz x={500} y={700} s={1.4} /><RecelTabak x={1000} y={700} s={1.6} t={t} /><Bilezik x={1500} y={500} t={t} /></>}
      </PFrame>
    </AbsoluteFill>
  );
};
