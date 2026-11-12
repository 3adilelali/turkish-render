import React from "react";
import { Composition } from "remotion";
import { fontsReady } from "./theme";
// القوالب: بس الفيديوهات اللي لسا بتنصدّر بتنضاف هون. الفيديو المنشور بينشال من هون (كوده بيضل بـ src/videos كعدّة).
// القناة 1 (عثماني، k3r) · القناة 2 (Olursa، k2r) · القناة 4 (Hayat، k6) · شورتس القناة 1 الجديدة (sh1)
// للفيديو الطويل الجاي للقناة 1: انسخ src/videos/k3r-14/K3Video.tsx وغيّر ملف الكلمات والصوت.
import { K6_05_SECONDS, K6Video05 } from "./videos/k6-05/K6Video";
import { SH1_01_SECONDS, Sh1Short01 } from "./videos/sh1-01/Short";

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
    {/* الشورت الجاي: نفس السطر فوق (أداة السحابة بتدوّر على id="..." component={...}) */}
  </>
);
