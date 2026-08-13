#!/usr/bin/env node
/**
 * Flags banned words and constructions in site content. See VOICE.md.
 *
 * Advisory by default. Pass --strict to exit 1 on any hit, e.g. in CI.
 *
 *   npm run check:voice
 *   npm run check:voice -- --strict
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGETS = ['src/content', 'src/pages', 'src/components', 'src/site.ts'];

/** Single words and short phrases. Matched case-insensitively on word boundaries. */
const BANNED_WORDS = {
  'consulting filler': [
    // Verb forms only. "Negotiating leverage" is ordinary English.
    'leveraging', 'leveraged', 'synergy', 'synergies', 'holistic',
    'robust', 'seamless', 'seamlessly', 'best-in-class', 'world-class',
    'move the needle', 'low-hanging fruit', 'boil the ocean', 'deep dive',
    'north star', 'value-add', 'mission-critical', 'turnkey', 'best practice',
    'best practices', 'unlock', 'unlocking', 'empower', 'empowering',
    'spearhead', 'spearheaded', 'orchestrate', 'orchestrated', 'transformative',
    'innovative', 'thought leader', 'ecosystem', 'paradigm', 'game-changer',
    'cutting-edge', 'state-of-the-art', 'circle back', 'drill down',
  ],
  'ai tell': [
    'delve', 'delving', 'tapestry', 'testament', 'realm', 'foster', 'fostering',
    'underscore', 'underscores', 'pivotal', 'crucial', 'vital', 'meticulous',
    'meticulously', 'intricate', 'myriad', 'plethora', 'embark', 'harness',
    'harnessing', 'elevate', 'elevating', 'serves as', 'plays a key role',
    'stands as', 'it is worth noting', 'it should be noted',
    'in today', 'ever-evolving', 'rapidly evolving', 'fast-paced',
  ],
  'intensifier': [
    'genuinely', 'actually', 'simply', 'obviously', 'truly', 'really',
    'incredibly', 'deeply', 'utterly', 'profoundly', 'undoubtedly',
    'fundamentally', 'essentially', 'literally',
  ],
  // NB: "journey mapping" and "customer journey" are real UX terms and are not
  // banned. What is banned is journey-as-metaphor-for-process, below.
  'figurative cliche': [
    'landscape', 'in the space', 'at scale', 'double down',
    'table stakes', 'moving parts', 'the reality is', 'the truth is',
  ],
};

/** Multi-word constructions and rhythm tics. */
const BANNED_PATTERNS = [
  {
    label: 'false contrast ("not X — it\'s Y")',
    re: /\b(?:is|was|were|are)\s+not\s+[^.?!]{1,60}?[—-]\s*it(?:'|’)?s?\s+/gi,
  },
  {
    label: 'false contrast ("not just X but Y")',
    re: /\bnot\s+(?:just|only|merely)\s+[^.?!]{1,60}?\bbut\b/gi,
  },
  {
    label: 'rhetorical signpost',
    re: /\b(?:the part that mattered|what(?:'|’)?s worth noticing|here(?:'|’)?s the thing|it turns out that|the pattern behind)\b/gi,
  },
  {
    label: 'sweeping generalisation opener',
    re: /^(?:Most|Every|All)\s+(?:enterprise|large|big|major|companies|organi[sz]ations|teams|product)\b/gim,
  },
  {
    label: 'abstract noun as subject',
    re: /^(?:Adoption|Enablement|Transformation|Innovation|Alignment)\s+(?:is|was|requires|produces|means)\b/gim,
  },
  {
    label: 'journey as metaphor',
    re: /\b(?:our|my|the|this|their)\s+journey\b(?!\s+map)/gi,
  },
  {
    label: 'leverage as verb',
    re: /\bleverage\s+(?:the|our|their|its|his|her|a|an)\b/gi,
  },
];

const MAX_EMDASH_PER_PARAGRAPH = 1;

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map((e) => {
      const p = join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      return /\.(mdx?|astro|ts)$/.test(e.name) ? [p] : [];
    })
  );
  return nested.flat();
}

/** Strips frontmatter, code fences, imports and JSX/CSS so prose is what gets checked. */
function proseOnly(text, file) {
  let out = text;
  if (/\.mdx?$/.test(file)) {
    out = out.replace(/^---\r?\n[\s\S]*?\r?\n---/, (m) => m.replace(/[^\n]/g, ' '));
    out = out.replace(/^import .*$/gm, '');
  } else {
    // .astro / .ts: only look inside string literals and text nodes, crudely.
    out = out.replace(/<style>[\s\S]*?<\/style>/g, '');
    out = out.replace(/^\s*(?:import|export)\s.*$/gm, '');
    out = out.replace(/\/\/.*$/gm, '');
    out = out.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  out = out.replace(/```[\s\S]*?```/g, '');
  return out;
}

const files = await walk(join(ROOT, 'src'));
const hits = [];

for (const file of files.sort()) {
  const raw = await readFile(file, 'utf8');
  const text = proseOnly(raw, file);
  const lines = text.split('\n');
  const rel = relative(ROOT, file);

  for (const [category, words] of Object.entries(BANNED_WORDS)) {
    for (const word of words) {
      const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      lines.forEach((line, i) => {
        for (const m of line.matchAll(re)) {
          hits.push({ rel, line: i + 1, category, term: m[0], context: line.trim().slice(0, 90) });
        }
      });
    }
  }

  for (const { label, re } of BANNED_PATTERNS) {
    for (const m of text.matchAll(re)) {
      const line = text.slice(0, m.index).split('\n').length;
      hits.push({ rel, line, category: 'construction', term: label, context: m[0].trim().slice(0, 90) });
    }
  }

  // Em-dash density, paragraph by paragraph. Prose files only — em-dashes in
  // component label data (e.g. "Gate — governed access") are separators, not
  // rhythm, and counting them produces noise.
  if (/\.mdx?$/.test(file)) text.split(/\n\s*\n/).forEach((para) => {
    // Draft notes are working annotations, not published prose. They get
    // deleted before launch, so holding them to the style rules is noise.
    if (para.trim().startsWith('>')) return;
    const count = (para.match(/—/g) || []).length;
    if (count > MAX_EMDASH_PER_PARAGRAPH) {
      const line = text.slice(0, text.indexOf(para)).split('\n').length;
      hits.push({
        rel, line, category: 'construction',
        term: `${count} em-dashes in one paragraph`,
        context: para.trim().replace(/\s+/g, ' ').slice(0, 90),
      });
    }
  });
}

if (hits.length === 0) {
  console.log('\n  Clean. No banned words or constructions found.\n');
  process.exit(0);
}

const byFile = hits.reduce((acc, h) => ((acc[h.rel] ??= []).push(h), acc), {});
for (const [file, list] of Object.entries(byFile)) {
  console.log(`\n  ${file}`);
  list
    .sort((a, b) => a.line - b.line)
    .forEach((h) => console.log(`    ${String(h.line).padStart(4)}  [${h.category}] ${h.term}\n          ${h.context}`));
}

const strict = process.argv.includes('--strict');
console.log(`\n  ${hits.length} issue${hits.length === 1 ? '' : 's'} across ${Object.keys(byFile).length} file(s).`);
console.log('  See VOICE.md. Some hits are false positives — use judgement.\n');
process.exit(strict ? 1 : 0);
