import { watch } from "fs";
import { normalizePath } from "vite";

export function debounced(ms: number, fn: () => void | Promise<void>) {
  let timeout: number | undefined = undefined;
  return () => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(fn, ms) as never;
  };
}

export function watchDebounced(path: string, fn: () => void, ms = 100) {
  return watch(normalizePath(path), debounced(ms, fn));
}
