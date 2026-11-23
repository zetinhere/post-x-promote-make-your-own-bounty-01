// Entry program for the make.fun bounty "Promote make.fun's make-your-own-bounty
// post on X" (post-x-promote-make-your-own-bounty-01).
//
// The entry itself is the X post: one post of our own that quotes make.fun's
// make-your-own-bounty post (https://x.com/makefunai/status/2124915864336236646),
// with a photo of its own attached and the play code in its text. This program
// does nothing about the post — the house reads the post itself from X. All it
// does is hand POST.json from the repository root to the grader: it reads the
// file, checks it is a JSON object with a string "url" field, and writes the
// exact same bytes to /output/POST.json.
//
// POST.json still holds the placeholder (an empty url) until the post is made
// on X and its real address is filled in. An empty url copies through fine;
// the gate refuses it until the real address is in place, which is the point
// of the placeholder.
//
// Node 22, standard library only. No network, no clock, no files outside the
// repository and the output directory, so the grader's two runs write the same
// bytes. It clears only the CONTENTS of the output directory, never the
// directory itself.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post address as X shows it, or an empty string while the post is not
// made yet (the placeholder stage). Anything else is a typo worth failing on.
const POST_URL = /^(https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\S+\/status\/\d+)?$/;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function readPostFile(): Buffer {
  const path = join(BOT_DIR, 'POST.json');
  let raw: Buffer;
  try {
    raw = readFileSync(path);
  } catch (err) {
    fail(`cannot read POST.json at ${path}: ${(err as Error).message}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.toString('utf8'));
  } catch {
    fail('POST.json is not valid JSON');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('POST.json must be a JSON object with a string "url" field');
  }
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string') {
    fail('POST.json must be a JSON object with a string "url" field');
  }
  if (!POST_URL.test(url)) {
    fail(`POST.json "url" is not an X post address: ${url}`);
  }
  return raw;
}

function emptyDirectory(dir: string): void {
  // Contents only — never the directory itself, which the grader owns.
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function main(): void {
  const raw = readPostFile();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  emptyDirectory(OUTPUT_DIR);
  const dest = join(OUTPUT_DIR, 'POST.json');
  writeFileSync(dest, raw);
  chmodSync(dest, 0o644);
  // The copy must be faithful: the bytes out are the bytes in.
  if (!readFileSync(dest).equals(raw)) {
    fail('POST.json copy does not match the source');
  }
}

main();
