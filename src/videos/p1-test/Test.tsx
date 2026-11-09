import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { act } from "../../components/Motion";
import {
  PFrame, PCam, PFig, proWalk, GalleryWall, ForeColumns, NightVeil, Motes, Fincan,
  ValideOda, Sedir2, Samdan, HasBahce, Fiskiye, Laleler, Petals, Birds,
} from "../../components/HaremPro";

// Kanal 1 · 15 sn görsel test (2026-11-08): koridor (gece) → valide dairesi (gece) → has bahçe (gündüz)
export const P1_TEST_SECONDS = 15;

const fade = (t: number, a: number, b: number, d = 0.35) => Math.max(0, Math.min(1, (t - a) / d, (b - t) / d));

const Corridor: React.FC<{ t: number }> = ({ t }) => {
  const S = 1.15, Y = 1000;
  const g = proWalk(t, 0.2, 5.1, 300, 2350, S);
  const camX = g.x - 860;
  const M = 560;
  const n0 = Math.floor((camX - 200) / M) - 1;
  const lights = Array.from({ length: 6 }, (_, i) => n0 + i).flatMap((m) => {
    const lx = m * M + M / 2 - camX;
    return [{ x: lx, y: 380, r: 250 }, { x: lx, y: 980, r: 210, f: 0.75 }];
  });
  return (
    <PFrame>
      <PCam t={t} a={3.0} b={5.4} z={[1, 1.32]} c0={[960, 540]} c1={[880, 560]}>
        <GalleryWall t={t} camX={camX} />
        <PFig x={g.x - camX} y={Y} s={S} kind="girl" t={t} seed={2} walk={g.walk} look={g.look} hands="tray" face={t > 3.6 ? "worried" : "normal"} />
        <NightVeil id="nvA" k={0.74} lights={lights} t={t} />
        <Motes t={t} n={50} op={0.55} />
        <ForeColumns camX={camX} />
      </PCam>
    </PFrame>
  );
};

const Room: React.FC<{ t: number }> = ({ t }) => {
  const S = 1.1;
  const g = proWalk(t, 0.0, 1.9, -160, 770, S);
  const bow = t < 1.9 ? 0 : t < 2.3 ? (t - 1.9) / 0.4 * 0.55 : t < 2.7 ? 0.55 - (t - 2.3) / 0.4 * 0.45 : 0.1;
  const give = act(t, 2.7, 0.9, 0.5, 0.6);
  const take = act(t, 3.0, 9, 0.5, 0.5);
  const passed = t >= 3.55;
  return (
    <PFrame>
      <PCam t={t} a={2.5} b={4.6} z={[1.02, 1.85]} c0={[960, 540]} c1={[1015, 640]}>
        <ValideOda t={t} />
        <Samdan x={1600} y={1010} t={t} s={1.1} />
        <Samdan x={330} y={1010} t={t + 0.7} s={1.1} />
        <Sedir2 x={1260} y={900} w={760} />
        <PFig x={1250} y={880} s={1.1} kind="valide" sit t={t} seed={5} look={-0.6} face={t > 3.2 ? "smile" : "normal"} reach={take} reachDir={-1} item={passed ? <Fincan t={t} s={0.9} /> : undefined} light={1} />
        <PFig x={g.x} y={1005} s={S} kind="girl" t={t} seed={3} walk={g.walk} look={t < 1.9 ? g.look : 0.4} bow={bow} hands="fold" reach={give} reachDir={1} item={!passed ? <Fincan t={t} s={0.9} /> : undefined} face={t > 3.6 ? "shy" : "normal"} />
        <NightVeil id="nvB" k={0.62} lights={[{ x: 560, y: 760, r: 440 }, { x: 1600, y: 640, r: 260 }, { x: 330, y: 640, r: 260 }, { x: 1540, y: 380, r: 240, f: 0.55 }, { x: 1010, y: 660, r: 320, f: 0.85 }]} t={t} />
        <Motes t={t} n={30} x0={300} x1={900} y0={300} y1={900} op={0.5} />
      </PCam>
    </PFrame>
  );
};

const Garden: React.FC<{ t: number }> = ({ t }) => {
  const S = 1.1;
  const p = proWalk(t, 0.3, 3.0, 2150, 1290, S);
  const bow = t < 2.4 ? 0 : t < 2.9 ? (t - 2.4) / 0.5 * 0.5 : 0.5;
  return (
    <PFrame grain={0.05}>
      <PCam t={t} a={0} b={4.6} z={[1.0, 1.08]} c0={[980, 560]} c1={[1060, 560]}>
        <HasBahce t={t} pan={t * 30} />
        <Birds t={t} />
        <Fiskiye x={560} y={905} t={t} s={0.95} />
        <Laleler x={1380} y={890} n={10} t={t} s={0.8} />
        <PFig x={880} y={1010} s={S} kind="girl" t={t} seed={4} look={t > 1.2 ? 0.55 : 0} bow={bow} hands="fold" face={t > 2.2 ? "shy" : "normal"} />
        <PFig x={p.x} y={1020} s={S * 1.04} kind="prince" t={t} seed={8} walk={p.walk} look={t < 3.0 ? p.look : -0.6} hands="down" face={t > 2.8 ? "smile" : "normal"} light={-1} />
        <Petals t={t} />
        <Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} />
        <Laleler x={1560} y={1140} n={6} t={t + 1} s={1.8} blur={8} />
      </PCam>
    </PFrame>
  );
};

export const P1Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: "#0A0604" }}>
      {t < 5.6 && <AbsoluteFill style={{ opacity: fade(t, -1, 5.6) }}><Corridor t={t} /></AbsoluteFill>}
      {t >= 5.2 && t < 10.6 && <AbsoluteFill style={{ opacity: fade(t, 5.2, 10.6) }}><Room t={t - 5.2} /></AbsoluteFill>}
      {t >= 10.2 && <AbsoluteFill style={{ opacity: fade(t, 10.2, 15.4, 0.4) }}><Garden t={t - 10.2} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
