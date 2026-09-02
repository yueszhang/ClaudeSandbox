/**
 * Local stand-in for Vercel: serves public/ and dispatches /api/* to the same
 * handlers Vercel will call. Without Upstash credentials the store falls back
 * to memory, so this runs with no setup at all.
 *
 *   node dev-server.js   →  http://localhost:4321
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 4321;

const routes = {
  '/api/deck': (await import('./api/deck.js')).default,
  '/api/swipe': (await import('./api/swipe.js')).default,
  '/api/idea': (await import('./api/idea.js')).default
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function collect(req){
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      try{ resolve(raw ? JSON.parse(raw) : {}); }catch{ resolve({}); }
    });
  });
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const handler = routes[url.pathname];

  if(handler){
    req.query = Object.fromEntries(url.searchParams);
    if(req.method === 'POST') req.body = await collect(req);
    return handler(req, res);
  }

  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  try{
    const file = await readFile(join(ROOT, 'public', path));
    res.setHeader('Content-Type', TYPES[extname(path)] || 'application/octet-stream');
    res.end(file);
  }catch{
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(PORT, () => console.log('Weather Permitting dev server → http://localhost:' + PORT));
