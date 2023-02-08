import { OtherAssetType } from "fantasticon";
import { AssetBuilder, fontAssetTypes } from "src/build-assets";
import { Connect } from "vite";

export function middleware(builder: AssetBuilder): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url) return next();
    let asset = builder.match(req.url, [
      ...fontAssetTypes,
      "json" as OtherAssetType,
      // "css" as OtherAssetType,
    ]);
    if (!asset) return next();
    if (!(asset instanceof Buffer)) asset = Buffer.from(asset);
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Length": Buffer.byteLength(asset),
    });
    res.write(asset, "binary");
    res.end();
  };
}
