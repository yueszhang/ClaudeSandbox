#!/usr/bin/env node
/**
 * Lists every unresolved draft note across the content directory.
 * Run before publishing: `npm run check:drafts`.
 *
 * Exits 0 always — draft notes are a normal working state, not a build error.
 * The point is visibility, not enforcement.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'src/content');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const p = join(dir, e.name);
      return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
    })
  );
  return files.flat();
}

const files = await walk(CONTENT);
let total = 0;

for (const file of files.sort()) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  const hits = lines
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /^\s*>\s*\*\*Draft note/i.test(line));

  if (hits.length === 0) continue;
  console.log(`\n  ${relative(ROOT, file)}`);
  for (const { n } of hits) console.log(`    line ${n}`);
  total += hits.length;
}

console.log(
  total === 0
    ? '\n  No draft notes remaining. Content is publish-ready.\n'
    : `\n  ${total} draft note${total === 1 ? '' : 's'} to resolve before publishing.\n`
);
