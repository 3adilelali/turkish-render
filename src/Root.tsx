import React from "react";
import { Composition } from "remotion";
import { fontsReady } from "./theme";
// القوالب: بس الفيديوهات اللي لسا بتنصدّر بتنضاف هون. الفيديو المنشور بينشال من هون (كوده بيضل بـ src/videos كعدّة).
// القناة 1 (عثماني، k3r) · القناة 2 (Olursa، k2r) · القناة 4 (Hayat، k6) · شورتس القناة 1 الجديدة (sh1)
// للفيديو الطويل الجاي للقناة 1: انسخ src/videos/k3r-14/K3Video.tsx وغيّر ملف الكلمات والصوت.
import { K6_05_SECONDS, K6Video05 } from "./videos/k6-05/K6Video";
import { K8_01_SECONDS, K8Video01 } from "./videos/k8-01/K8Video";
import { K8_03_SECONDS, K8Video03 } from "./videos/k8-03/K8Video03";
import { K6_07_SECONDS, K6Video07 } from "./videos/k6-07/K6Video";
import { K6_08_SECONDS, K6Video08 } from "./videos/k6-08/K6Video";
import { K6_10_SECONDS, K6Video10 } from "./videos/k6-10/K6Video";
import { K6_11_SECONDS, K6Video11 } from "./videos/k6-11/K6Video";
import { K7_01_SECONDS, K7Video01 } from "./videos/k7-01/K7Video";
import { K7_02_SECONDS, K7Video02 } from "./videos/k7-02/K7Video";
import { K7_03_SECONDS, K7Video03 } from "./videos/k7-03/K7Video";
import { K3R_16_SECONDS, K3RVideo16 } from "./videos/k3r-16/K3Video";
import { K3R_17_SECONDS, K3RVideo17 } from "./videos/k3r-17/K3Video";
import { K3R_20_SECONDS, K3RVideo20 } from "./videos/k3r-20/K3Video";
import { K3R_21_SECONDS, K3RVideo21 } from "./videos/k3r-21/K3Video";
import { K2R_14_SECONDS, K2RVideo14 } from "./videos/k2r-14/K2Video";
import { K2R_15_SECONDS, K2RVideo15 } from "./videos/k2r-15/K2Video";
import { K2R_17_SECONDS, K2RVideo17 } from "./videos/k2r-17/K2Video";
import { K2R_18_SECONDS, K2RVideo18 } from "./videos/k2r-18/K2Video";
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
import { SH2_01_SECONDS, Sh2Short01 } from "./videos/sh2-01/Short";
import { SH2_02_SECONDS, Sh2Short02 } from "./videos/sh2-02/Short";
import { SH2_10_SECONDS, Sh2Short10 } from "./videos/sh2-10/Short";
import { SH2_20_SECONDS, Sh2Short20 } from "./videos/sh2-20/Short";
import { SH2_19_SECONDS, Sh2Short19 } from "./videos/sh2-19/Short";
import { SH2_18_SECONDS, Sh2Short18 } from "./videos/sh2-18/Short";
import { SH2_17_SECONDS, Sh2Short17 } from "./videos/sh2-17/Short";
import { SH2_16_SECONDS, Sh2Short16 } from "./videos/sh2-16/Short";
import { SH2_15_SECONDS, Sh2Short15 } from "./videos/sh2-15/Short";
import { SH2_14_SECONDS, Sh2Short14 } from "./videos/sh2-14/Short";
import { SH2_13_SECONDS, Sh2Short13 } from "./videos/sh2-13/Short";
import { SH2_12_SECONDS, Sh2Short12 } from "./videos/sh2-12/Short";
import { SH2_11_SECONDS, Sh2Short11 } from "./videos/sh2-11/Short";
import { SH2_09_SECONDS, Sh2Short09 } from "./videos/sh2-09/Short";
import { SH2_08_SECONDS, Sh2Short08 } from "./videos/sh2-08/Short";
import { SH2_07_SECONDS, Sh2Short07 } from "./videos/sh2-07/Short";
import { SH2_06_SECONDS, Sh2Short06 } from "./videos/sh2-06/Short";
import { SH2_05_SECONDS, Sh2Short05 } from "./videos/sh2-05/Short";
import { SH2_04_SECONDS, Sh2Short04 } from "./videos/sh2-04/Short";
import { SH2_03_SECONDS, Sh2Short03 } from "./videos/sh2-03/Short";

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
    {video("K8Video01", K8Video01, K8_01_SECONDS)}
    {video("K8Video03", K8Video03, K8_03_SECONDS)}
    {video("K6Video07", K6Video07, K6_07_SECONDS)}
    {video("K6Video08", K6Video08, K6_08_SECONDS)}
    {video("K6Video10", K6Video10, K6_10_SECONDS)}
    {video("K6Video11", K6Video11, K6_11_SECONDS)}
    {video("K7Video01", K7Video01, K7_01_SECONDS)}
    {video("K7Video02", K7Video02, K7_02_SECONDS)}
    {video("K7Video03", K7Video03, K7_03_SECONDS)}
    <Composition id="K3RVideo16" component={K3RVideo16} durationInFrames={Math.round(K3R_16_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K3RVideo17" component={K3RVideo17} durationInFrames={Math.round(K3R_17_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K3RVideo20" component={K3RVideo20} durationInFrames={Math.round(K3R_20_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K3RVideo21" component={K3RVideo21} durationInFrames={Math.round(K3R_21_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K2RVideo14" component={K2RVideo14} durationInFrames={Math.round(K2R_14_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K2RVideo15" component={K2RVideo15} durationInFrames={Math.round(K2R_15_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K2RVideo17" component={K2RVideo17} durationInFrames={Math.round(K2R_17_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
    <Composition id="K2RVideo18" component={K2RVideo18} durationInFrames={Math.round(K2R_18_SECONDS * FPS)} fps={FPS} width={1920} height={1080} calculateMetadata={ready} />
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
    <Composition id="Sh2Short01" component={Sh2Short01} durationInFrames={Math.round(SH2_01_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short02" component={Sh2Short02} durationInFrames={Math.round(SH2_02_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short10" component={Sh2Short10} durationInFrames={Math.round(SH2_10_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short20" component={Sh2Short20} durationInFrames={Math.round(SH2_20_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short19" component={Sh2Short19} durationInFrames={Math.round(SH2_19_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short18" component={Sh2Short18} durationInFrames={Math.round(SH2_18_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short17" component={Sh2Short17} durationInFrames={Math.round(SH2_17_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short16" component={Sh2Short16} durationInFrames={Math.round(SH2_16_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short15" component={Sh2Short15} durationInFrames={Math.round(SH2_15_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short14" component={Sh2Short14} durationInFrames={Math.round(SH2_14_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short13" component={Sh2Short13} durationInFrames={Math.round(SH2_13_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short12" component={Sh2Short12} durationInFrames={Math.round(SH2_12_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short11" component={Sh2Short11} durationInFrames={Math.round(SH2_11_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short09" component={Sh2Short09} durationInFrames={Math.round(SH2_09_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short08" component={Sh2Short08} durationInFrames={Math.round(SH2_08_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short07" component={Sh2Short07} durationInFrames={Math.round(SH2_07_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short06" component={Sh2Short06} durationInFrames={Math.round(SH2_06_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short05" component={Sh2Short05} durationInFrames={Math.round(SH2_05_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short04" component={Sh2Short04} durationInFrames={Math.round(SH2_04_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="Sh2Short03" component={Sh2Short03} durationInFrames={Math.round(SH2_03_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    {/* الشورت الجاي: نفس السطر فوق (أداة السحابة بتدوّر على id="..." component={...}) */}
  </>
);
