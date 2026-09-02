import { DeckError } from './deck.js';
import { normalizeCode } from './ids.js';
import { backend } from './store.js';

export function readBody(req){
  if(req.body && typeof req.body === 'object') return req.body;
  if(typeof req.body === 'string'){
    try{ return JSON.parse(req.body); }catch{ return {}; }
  }
  return {};
}

export function send(res, status, payload){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function fail(res, err){
  if(err instanceof DeckError) return send(res, err.status, { error: err.message });
  console.error(err);
  return send(res, 500, { error: 'Something broke on our side.' });
}

/**
 * A deploy with no database attached still answers, and then loses decks
 * between requests because each invocation is a fresh process. That reads as a
 * baffling bug, so refuse up front and say exactly which click is missing.
 */
export function assertStorage(){
  if(process.env.VERCEL && backend !== 'upstash'){
    throw new DeckError(503,
      'The deck database is not connected yet. In Vercel: Storage → Marketplace → ' +
      'Upstash for Redis, connect it to this project, then redeploy.');
  }
}

/** Both the code and the member id have to be present and well-formed to act. */
export function credentials(source){
  const code = normalizeCode(source.code);
  const member = typeof source.member === 'string' && /^[0-9a-f]{32}$/.test(source.member) ? source.member : null;
  if(!code) throw new DeckError(400, 'That code is not a deck code.');
  if(!member) throw new DeckError(403, 'Missing your key for this deck.');
  return { code, member };
}
