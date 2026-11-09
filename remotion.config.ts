import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Preview pane assigns a free port via PORT.
if (process.env.PORT) {
  Config.setStudioPort(Number(process.env.PORT));
}
