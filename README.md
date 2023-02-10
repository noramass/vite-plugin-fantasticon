# vite-plugin-fantasticon

```shell
npm i -D vite-plugin-fantasticon
```
```shell
pnpm i -D vite-plugin-fantasticon
```
```shell
yarn add -D vite-plugin-fantasticon
```


## Usage

with a single icon font
```typescript
import { defineConfig } from "vite";
import fantasticon from "vite-plugin-fantasticon";

export default defineConfig({
  plugins: [
    fantasticon(/* fantasticon options */)
  ]
})
```

with multiple icon fonts
```typescript
import { defineConfig } from "vite";
import fantasticon from "vite-plugin-fantasticon";

export default defineConfig({
  plugins: [
    fantasticon({ name: "first" }),
    fantasticon({ name: "second" }),
  ]
});
```

for hmr to work simply import "fontasticon:<font name>" somewhere in your code
```typescript
import "fantasticon:icons";
import "fontasticon:my-other-font";
```

default options:
```typescript
export function defaults(options: Partial<RunnerOptions>): RunnerOptions {
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
```
