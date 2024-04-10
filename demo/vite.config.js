import { defineConfig } from "vite";
import fantasticon from "../dist/index";

const config = defineConfig({
  plugins: [
    fantasticon({
      name: "icons",
      fontTypes: ["ttf", "woff", "woff2"],
      assetTypes: ["css", "json", "html"],
      formatOptions: { json: { indent: 2 } },
      inputDir: "icons",
    }),
  ],
});

export default config;
