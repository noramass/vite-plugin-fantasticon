import type { RunnerOptions, generateFonts } from "fantasticon";
import { assetBuilder } from "src/build-assets";
import { defaults } from "src/defaults";
import { hmrLinkTag, hmrTemplate } from "src/hmr-template";
import { middleware } from "src/middleware";
import { PluginOption, WebSocketServer } from "vite";

export type FontGenerator = typeof generateFonts;
export interface FantasticonOptions extends Partial<RunnerOptions> {
  generateFonts?: FontGenerator;
  injectHtml?: boolean;
}
export function fantasticon(options?: FantasticonOptions): PluginOption {
  const {
    generateFonts,
    injectHtml = true,
    ...config
  } = defaults(options ?? {});
  const builder = assetBuilder(config, generateFonts);
  const name = `fantasticon:${config.name}`;
  const virtual = `\0${name}`;
  const updateEvent = `${name}:update`;
  let base = "/";

  let ws: WebSocketServer | undefined = undefined;

  function transformIndexHtml(html: string) {
    return { html, tags: [hmrLinkTag(config, base, name)] };
  }

  return {
    name,
    configResolved(config) {
      base = config.base;
    },
    async buildStart() {
      builder.watch(() => ws, updateEvent);
      await builder.build();
    },
    buildEnd() {
      builder.end();
    },
    async writeBundle() {
      await builder.build(true);
    },
    async handleHotUpdate(ctx) {
      ws = ctx.server.ws;
    },
    transformIndexHtml: injectHtml ? transformIndexHtml : undefined,
    resolveId(source) {
      if (source === name) return virtual;
    },
    load(source) {
      if (source === virtual) return hmrTemplate(updateEvent, name);
      return builder.match(source) as any;
    },
    configureServer(server) {
      server.middlewares.use(middleware(builder));
    },
  };
}
