import type {
  AssetType,
  FontAssetType,
  OtherAssetType,
  RunnerOptions,
} from "fantasticon";
import { FSWatcher, promises as fs } from "fs";
import { dirname, relative } from "path/posix";
import { assetPath, assetType, withoutQuery } from "src/paths";
import { FontGenerator } from "src/plugin";
import { watchDebounced } from "src/util";
import { WebSocketServer } from "vite";

export interface AssetBuilder {
  build(
    writeToDisk?: boolean
  ): Promise<Partial<Record<AssetType, string | Buffer>>>;
  has(ext: AssetType): boolean;
  get<Buff extends boolean = false>(
    ext: AssetType,
    buffer?: Buff
  ): Buff extends true ? Buffer : string | Buffer;
  match(path: string, assetTypes?: AssetType[]): undefined | (Buffer | string);
  watch(ws: () => WebSocketServer | undefined, event: string): () => void;
  end(): void;
}

export const fontAssetTypes = [
  "svg",
  "ttf",
  "woff",
  "woff2",
  "eot",
] as FontAssetType[];
export const otherAssetTypes = [
  "ts",
  "css",
  "json",
  "scss",
  "sass",
  "html",
] as OtherAssetType[];

export function assetBuilder(
  config: RunnerOptions,
  generateFonts?: FontGenerator
): AssetBuilder {
  let assets: Partial<Record<AssetType, string | Buffer>> = {};
  let watcher: FSWatcher | undefined = undefined;

  async function build(writeToDisk = false) {
    const cfg = { ...config };
    if (!writeToDisk) cfg.outputDir = undefined as any;
    await fs.mkdir(cfg.inputDir, { recursive: true });
    cfg.inputDir = relative(".", cfg.inputDir);
    // eslint-disable-next-line no-console
    console.log(`[fantasticon] Generating fonts from '${cfg.inputDir}'...`);
    if (!generateFonts)
      generateFonts = (await import("fantasticon")).generateFonts;
    const results = await generateFonts(cfg, writeToDisk);
    assets = results.assetsOut;
    if (assets.ts) {
      const ts = assets.ts;
      delete assets.ts;
      const filePath = relative(".", assetPath(config, "ts" as never));
      const dir = dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, ts as string);
    }
    return assets;
  }

  function has(ext: AssetType) {
    return assets[ext] !== undefined;
  }

  function get<Buff extends boolean = false>(
    ext: AssetType,
    buffer: Buff = false as Buff
  ): Buff extends true ? Buffer : string | Buffer {
    if (buffer)
      return assets[ext] instanceof Buffer
        ? (assets[ext] as any)
        : Buffer.from(assets[ext]!);
    else return assets[ext] as any;
  }

  function match(
    path: string,
    assetTypes: AssetType[] = [...fontAssetTypes, ...otherAssetTypes]
  ) {
    path = withoutQuery(path);
    if (path.startsWith("/")) path = path.slice(1);
    const ext = assetType(path);
    if (!assetTypes.includes(ext)) return undefined;
    return assetPath(config, ext) === path ? get(ext) : undefined;
  }

  function watch(ws: () => WebSocketServer | undefined, event: string) {
    if (watcher) return end;
    build().then(() => {
      watcher = watchDebounced(config.inputDir, async () => {
        await build();
        ws()?.send({ type: "custom", event, data: {} });
      });
    });
    return end;
  }

  function end() {
    if (watcher) {
      watcher.close();
      watcher = undefined;
    }
  }

  return { build, has, get, watch, end, match };
}
