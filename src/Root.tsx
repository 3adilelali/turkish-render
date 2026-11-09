import React from "react";
import { Composition } from "remotion";
import { fontsReady } from "./theme";
// القوالب: آخر فيديو لكل قناة بيضل هون كقالب. الفيديو الجديد بينسخ قالب قناته وبينضاف تحت.
// القناة 1 (عثماني، k3r) · القناة 2 (Olursa، k2r) · القناة 3 (O Yıl Sen، k5) · القناة 4 (Hayat، k6) · شورتس القناة 1 (s3)
import { K3R_12_SECONDS, K3RVideo12 } from "./videos/k3r-12/K3Video";
import { K3R_13_SECONDS, K3RVideo13 } from "./videos/k3r-13/K3Video";
import { K3R_14_SECONDS, K3RVideo14 } from "./videos/k3r-14/K3Video";
import { K2R_13_SECONDS, K2RVideo13 } from "./videos/k2r-13/K2Video";
import { K5_05_SECONDS, K5Video05 } from "./videos/k5-05/K5Video";
import { K5_06_SECONDS, K5Video06 } from "./videos/k5-06/Video";
import { K5_07_SECONDS, K5Video07 } from "./videos/k5-07/Video";
import { K5_08_SECONDS, K5Video08 } from "./videos/k5-08/Video";
import { K5_09_SECONDS, K5Video09 } from "./videos/k5-09/Video";
import { K5_10_SECONDS, K5Video10 } from "./videos/k5-10/Video";
import { K5_11_SECONDS, K5Video11 } from "./videos/k5-11/Video";
import { K5_12_SECONDS, K5Video12 } from "./videos/k5-12/Video";
import { K5_13_SECONDS, K5Video13 } from "./videos/k5-13/Video";
import { K5_14_SECONDS, K5Video14 } from "./videos/k5-14/Video";
import { K5_15_SECONDS, K5Video15 } from "./videos/k5-15/Video";
import { K6_04_SECONDS, K6Video04 } from "./videos/k6-04/K6Video";
import { S3_01_SECONDS, S3Short01 } from "./videos/s3-01/S3Short";
import { S3_02_SECONDS, S3Short02 } from "./videos/s3-02/Short";
import { S3_03_SECONDS, S3Short03 } from "./videos/s3-03/Short";
import { S3_04_SECONDS, S3Short04 } from "./videos/s3-04/Short";
import { S3_05_SECONDS, S3Short05 } from "./videos/s3-05/Short";
import { S3_06_SECONDS, S3Short06 } from "./videos/s3-06/Short";
import { P1_TEST_SECONDS, P1Test } from "./videos/p1-test/Test";

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
    {video("P1Test", P1Test, P1_TEST_SECONDS)}
    {video("K3RVideo12", K3RVideo12, K3R_12_SECONDS)}
    {video("K3RVideo13", K3RVideo13, K3R_13_SECONDS)}
    {video("K3RVideo14", K3RVideo14, K3R_14_SECONDS)}
    {video("K2RVideo13", K2RVideo13, K2R_13_SECONDS)}
    {video("K5Video05", K5Video05, K5_05_SECONDS)}
    {video("K5Video06", K5Video06, K5_06_SECONDS)}
    {video("K5Video07", K5Video07, K5_07_SECONDS)}
    {video("K5Video08", K5Video08, K5_08_SECONDS)}
    {video("K5Video09", K5Video09, K5_09_SECONDS)}
    {video("K5Video10", K5Video10, K5_10_SECONDS)}
    {video("K5Video11", K5Video11, K5_11_SECONDS)}
    {video("K5Video12", K5Video12, K5_12_SECONDS)}
    {video("K5Video13", K5Video13, K5_13_SECONDS)}
    {video("K5Video14", K5Video14, K5_14_SECONDS)}
    {video("K5Video15", K5Video15, K5_15_SECONDS)}
    {video("K6Video04", K6Video04, K6_04_SECONDS)}
    <Composition id="S3Short01" component={S3Short01} durationInFrames={Math.round(S3_01_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="S3Short02" component={S3Short02} durationInFrames={Math.round(S3_02_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="S3Short03" component={S3Short03} durationInFrames={Math.round(S3_03_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="S3Short04" component={S3Short04} durationInFrames={Math.round(S3_04_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="S3Short05" component={S3Short05} durationInFrames={Math.round(S3_05_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
    <Composition id="S3Short06" component={S3Short06} durationInFrames={Math.round(S3_06_SECONDS * FPS)} fps={FPS} width={1080} height={1920} calculateMetadata={ready} />
  </>
);
