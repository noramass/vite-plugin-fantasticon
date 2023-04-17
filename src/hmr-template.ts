import { RunnerOptions } from "fantasticon";
import { assetPath } from "src/paths";
import { HtmlTagDescriptor } from "vite";

// escape import . meta . hot to prevent vite replacement during build
export const hmrTemplate = (event: string, id: string) => `
import.${"meta"}.hot && import.${"meta"}.hot.on("${event}", () => {
  const link = document.querySelector("link[data-id='${id}']");
  const href = link.href.slice(0, link.href.indexOf("?")) + "?" + Date.now();
  link.setAttribute("href", href);
});`;

export const hmrLinkTag = (
  config: RunnerOptions,
  base: string,
  id: string
): HtmlTagDescriptor => ({
  tag: "link",
  attrs: {
    rel: "stylesheet",
    type: "text/css",
    href: `${base}${assetPath(config, "css" as any)}?${Date.now()}`,
    "data-id": id,
  },
  injectTo: "head",
});
