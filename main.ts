// Entry hand-in for the make.fun bounty gta6-meme-x-01 (v4).
//
// Loads POST.json, validates that it parses, that its URL is an
// x.com status URL, and that the meme image referenced by the entry
// exists in this repo — then copies POST.json and the image into the
// output directory so the judged post travels with the entry.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

interface Post {
  url: string;
}

function loadPost(): Post {
  const raw = readFileSync(join(here, "POST.json"), "utf8");
  const data: unknown = JSON.parse(raw);
  if (typeof data !== "object" || data === null) {
    throw new Error("POST.json must contain a JSON object");
  }
  const url = (data as { url?: unknown }).url;
  if (typeof url !== "string" || url.trim() === "") {
    throw new Error("POST.json must carry a non-empty \"url\" string");
  }
  if (!/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(url)) {
    throw new Error(`POST.json url is not an x.com status URL: ${url}`);
  }
  return { url };
}

const MEME_IMAGE = "meme-v4-eviction-notice.png";

function main(): void {
  const post = loadPost();
  const imagePath = join(here, MEME_IMAGE);
  if (!existsSync(imagePath)) {
    throw new Error(`meme image missing from the entry repo: ${MEME_IMAGE}`);
  }
  const outDir = join(here, "out");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  copyFileSync(join(here, "POST.json"), join(outDir, "POST.json"));
  copyFileSync(imagePath, join(outDir, MEME_IMAGE));
  console.log(`hand-in ready: ${post.url} + ${MEME_IMAGE}`);
}

main();
