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
// POST.json now holds the real address of the live post on X. An empty url
// is refused outright by the validation below — the placeholder stage is
// over, and a missing address is a mistake worth failing on, not a state to
// copy through.
//
// Node 22, standard library only. No network, no clock, no files outside the
// repository and the output directory, so the grader's two runs write the same
// bytes. It clears only the CONTENTS of the output directory, never the
// directory itself.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { chmodSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post address as X shows it. The post is live now, so an empty url is
// no longer acceptable — the placeholder stage is over. Anything else is a
// typo worth failing on, with a distinct error per fault so a bad POST.json
// says exactly what is wrong with it.
const X_HOSTS = new Set([
  'x.com', 'www.x.com', 'mobile.x.com',
  'twitter.com', 'www.twitter.com', 'mobile.twitter.com',
]);

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// Validates the post address structurally: https, an X host, a path shaped
// /<handle>/status/<digits>, and no query string or fragment. Share links
// like ?s=19 are a real typo source, so they are rejected outright instead
// of being copied through.
function checkPostUrl(url: string): void {
  if (url === '') {
    fail('POST.json "url" is empty — the post is live, fill in its real address');
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(`POST.json "url" is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== 'https:') {
    fail(`POST.json "url" must use https: ${url}`);
  }
  if (!X_HOSTS.has(parsed.hostname.toLowerCase())) {
    fail(`POST.json "url" host "${parsed.hostname}" is not X: ${url}`);
  }
  if (parsed.search !== '' || parsed.hash !== '') {
    fail(`POST.json "url" must not carry a query string or fragment: ${url}`);
  }
  const parts = parsed.pathname.split('/').filter((part) => part !== '');
  if (parts.length !== 3 || parts[1] !== 'status') {
    fail(`POST.json "url" is not shaped /<handle>/status/<id>: ${url}`);
  }
  if (!/^\d+$/.test(parts[2])) {
    fail(`POST.json "url" status id "${parts[2]}" is not numeric: ${url}`);
  }
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
  checkPostUrl(url);
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
  // The grader runs as another user, so the written file must stay
  // world-readable: verify the mode landed at 0644 instead of assuming it.
  const mode = statSync(dest).mode & 0o777;
  if (mode !== 0o644) {
    fail(`POST.json copy has mode ${mode.toString(8)}, expected 644`);
  }
  console.log(`main.ts: copied ${raw.length} bytes to ${dest}`);
}

main();
