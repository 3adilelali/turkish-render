import React from "react";
import { Composition, registerRoot } from "remotion";
import { K2R_20_SECONDS, K2RVideo20 } from "../videos/k2r-20/K2Video";
const R: React.FC = () => <Composition id="K2RVideo20" component={K2RVideo20} durationInFrames={Math.round(K2R_20_SECONDS * 30)} fps={30} width={1920} height={1080} />;
registerRoot(R);
