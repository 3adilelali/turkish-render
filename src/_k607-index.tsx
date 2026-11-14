import React from "react";
import { Composition, registerRoot } from "remotion";
import { fontsReady } from "./theme";
import { K6_07_SECONDS, K6Video07 } from "./videos/k6-07/K6Video";
const ready = async () => { await fontsReady; return {}; };
registerRoot(() => <Composition id="K6Video07" component={K6Video07} durationInFrames={Math.round(K6_07_SECONDS * 30)} fps={30} width={1920} height={1080} calculateMetadata={ready} />);
