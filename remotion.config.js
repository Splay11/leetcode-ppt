import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.overrideWebpackConfig((currentConfiguration) => ({
  ...currentConfiguration,
  resolve: {
    ...currentConfiguration.resolve,
    alias: {
      ...(currentConfiguration.resolve?.alias ?? {}),
      "@motion-tuning": path.resolve(process.cwd(), "src/motion-tuning/index.js"),
    },
  },
}));
