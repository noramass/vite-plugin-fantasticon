import {
  AssetType,
  FontAssetType,
  OtherAssetType,
  RunnerOptions,
} from "fantasticon";
import { normalizePath } from "vite";
import { extname } from "path/posix";

export function assetPath(
  config: RunnerOptions,
  asset: FontAssetType | OtherAssetType
) {
  const { pathOptions, name } = config;
  return normalizePath(pathOptions?.[asset] ?? `${name}.${asset}`);
}

export function withoutQuery(path: string) {
  const index = path.indexOf("?");
  return index === -1 ? path : path.slice(0, index);
}

export function assetType(resource: string): AssetType {
  return extname(resource).slice(1) as AssetType;
}
