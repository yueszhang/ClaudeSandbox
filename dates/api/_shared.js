import { DeckError } from '../lib/deck.js';
import { normalizeCode } from '../lib/ids.js';

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

/** Both the code and the member id have to be present and well-formed to act. */
export function credentials(source){
  const code = normalizeCode(source.code);
  const member = typeof source.member === 'string' && /^[0-9a-f]{32}$/.test(source.member) ? source.member : null;
  if(!code) throw new DeckError(400, 'That code is not a deck code.');
  if(!member) throw new DeckError(403, 'Missing your key for this deck.');
  return { code, member };
}
