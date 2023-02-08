import type { OtherAssetType, RunnerOptions } from "fantasticon";
import { fontAssetTypes } from "src/build-assets";
import { FantasticonOptions } from "src/plugin";

export function defaults(
  options: FantasticonOptions
): FantasticonOptions & RunnerOptions {
  const name = options.name ?? "icons";
  return {
    name,
    inputDir: name === "icons" ? "icons" : `icons/${name}`,
    outputDir: "./dist",
    fontTypes: [...fontAssetTypes],
    assetTypes: ["ts", "css", "json", "html"] as OtherAssetType[],
    fontsUrl: "",
    prefix: name,
    descent: 33,
    normalize: true,
    formatOptions: {
      svg: { ascent: 0 },
      json: { indent: 2 },
      ts: { types: ["constant", "literalId"] },
    },
    pathOptions: {
      ts: name === "icons" ? "src/icons.ts" : `src/icons/${name}.ts`,
    },
    ...options,
  };
}
