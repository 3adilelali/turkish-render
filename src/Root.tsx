import React from "react";
import { Composition } from "remotion";
import { fontsReady } from "./theme";
// القوالب: بس الفيديوهات اللي لسا بتنصدّر بتنضاف هون. الفيديو المنشور بينشال من هون (كوده بيضل بـ src/videos كعدّة).
// القناة 1 (عثماني، k3r) · القناة 2 (Olursa، k2r) · القناة 4 (Hayat، k6) · شورتس القناة 1 الجديدة (sh1)
// للفيديو الطويل الجاي للقناة 1: انسخ src/videos/k3r-14/K3Video.tsx وغيّر ملف الكلمات والصوت.
import { K6_05_SECONDS, K6Video05 } from "./videos/k6-05/K6Video";
import { SH1_01_SECONDS, Sh1Short01 } from "./videos/sh1-01/Short";
import { SH1_02_SECONDS, Sh1Short02 } from "./videos/sh1-02/Short";
import { SH1_03_SECONDS, Sh1Short03 } from "./videos/sh1-03/Short";
import { SH1_04_SECONDS, Sh1Short04 } from "./videos/sh1-04/Short";
import { SH1_05_SECONDS, Sh1Short05 } from "./videos/sh1-05/Short";
import { SH1_06_SECONDS, Sh1Short06 } from "./videos/sh1-06/Short";
import { SH1_07_SECONDS, Sh1Short07 } from "./videos/sh1-07/Short";
import { SH1_08_SECONDS, Sh1Short08 } from "./videos/sh1-08/Short";
import { SH1_09_SECONDS, Sh1Short09 } from "./videos/sh1-09/Short";
import { SH1_10_SECONDS, Sh1Short10 } from "./videos/sh1-10/Short";

const FPS = 30;
const ready = async () => {
  await fontsReady;
  return {};
};

export const video = (id: string, component: React.FC, seconds: number) => (
  <Composition id={id} component={component} durationInFrames={Math.round(seconds * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
);

export const RemotionRoot: React.FC = () => (
  <>
    {video("K6Video05", K6Video05, K6_05_SECONDS)}
    <Composition id="Sh1Short01" component={Sh1Short01} durationInFrames={Math.round(SH1_01_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short02" component={Sh1Short02} durationInFrames={Math.round(SH1_02_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short03" component={Sh1Short03} durationInFrames={Math.round(SH1_03_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short04" component={Sh1Short04} durationInFrames={Math.round(SH1_04_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short05" component={Sh1Short05} durationInFrames={Math.round(SH1_05_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short06" component={Sh1Short06} durationInFrames={Math.round(SH1_06_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short07" component={Sh1Short07} durationInFrames={Math.round(SH1_07_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short08" component={Sh1Short08} durationInFrames={Math.round(SH1_08_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short09" component={Sh1Short09} durationInFrames={Math.round(SH1_09_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh1Short10" component={Sh1Short10} durationInFrames={Math.round(SH1_10_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    {/* الشورت الجاي: نفس السطر فوق (أداة السحابة بتدوّر على id="..." component={...}) */}
  </>
);
