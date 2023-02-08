import { defineConfig } from "tsup";
import pkg from "./package.json";

function banner(lines: string[]) {
  if (!lines.length) return "";
  return `/**${lines.map((line) => `\n * ${line}`).join("")}\n */`;
}

function dateRange(since: number) {
  const now = new Date().getFullYear();
  if (now === since) return since;
  return `${since} - ${now}`;
}

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  minify: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  name: "vite-plugin-fantasticon",
  banner: {
    js: banner([
      `${pkg.name} v${pkg.version}`,
      pkg.description,
      `© ${dateRange(pkg.since)} ${pkg.author}`,
      `@license ${pkg.license}`,
    ]),
  },
});
