/**
 * Vercel's zero-config static root would be this whole directory, which would
 * publish lib/ and the tests alongside the app. Copying public/ into dist/ and
 * pointing outputDirectory there keeps the served surface to exactly the page.
 * Functions in api/ are picked up separately and are not affected.
 */
import { cp, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
await rm(here + 'dist', { recursive: true, force: true });
await mkdir(here + 'dist', { recursive: true });
await cp(here + 'public', here + 'dist', { recursive: true });
console.log('copied public/ → dist/');
