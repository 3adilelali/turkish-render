import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Channel identity: deep navy, warm cream text, "dakika" yellow accent.
export const C = {
  bg1: "#0B1526",
  bg2: "#15294A",
  text: "#F6F1E7",
  dim: "#8A97AD",
  accent: "#FFC93C",
  land: "#22385C",
  stroke: "#F6F1E7",
};

export const REGION_COLORS: Record<string, string> = {
  marmara: "#FF6B6B",
  ege: "#4D96FF",
  akdeniz: "#FFA94D",
  icanadolu: "#F4D35E",
  karadeniz: "#3DDC97",
  doguanadolu: "#B388FF",
  guneydogu: "#E07A5F",
};

export const FONT = "Poppins";

export const HAND = "Patrick Hand"; // hand-written key words (OFL)

export const fontsReady = Promise.all([
  ...(["500", "600", "700"] as const).map((weight) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/Poppins-${{ "500": "Medium", "600": "SemiBold", "700": "Bold" }[weight]}.ttf`),
      weight,
    }),
  ),
  loadFont({ family: HAND, url: staticFile("fonts/PatrickHand-Regular.ttf") }),
]);
