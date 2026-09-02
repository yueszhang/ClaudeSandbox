/**
 * Key/value access, backed by Upstash Redis in production and by process
 * memory when no credentials are present (local dev and tests).
 *
 * The shape is deliberately spread across several keys rather than one JSON
 * blob: votes and ideas live in hashes, so two people acting at the same
 * moment write different fields and neither loses. Only `d:` (members) is a
 * whole-document write, and that changes about twice in a deck's life.
 *
 *   d:<code>  string  JSON { code, createdAt, members }
 *   i:<code>  hash    ideaId          -> JSON idea
 *   v:<code>  hash    ideaId|memberId -> JSON { v, t }
 *   r:<code>  string  integer, bumped on every change — the poll reads this alone
 */

const TTL = 60 * 60 * 24 * 400; // touched on every write, so a live deck never expires

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

let redis = null;
if(url && token){
  const { Redis } = await import('@upstash/redis');
  // We do our own JSON handling so values round-trip identically on both backends.
  redis = new Redis({ url, token, automaticDeserialization: false });
}

export const backend = redis ? 'upstash' : 'memory';

/* ---- memory backend: a Map of strings, plus a Map of Maps for hashes ---- */
const mem = { str: new Map(), hash: new Map() };
const hashOf = (key) => {
  let h = mem.hash.get(key);
  if(!h){ h = new Map(); mem.hash.set(key, h); }
  return h;
};

export async function getJSON(key){
  const raw = redis ? await redis.get(key) : mem.str.get(key);
  if(raw == null) return null;
  try{ return JSON.parse(raw); }catch{ return null; }
}

export async function setJSON(key, value){
  const raw = JSON.stringify(value);
  if(redis) await redis.set(key, raw, { ex: TTL });
  else mem.str.set(key, raw);
}

export async function getNumber(key){
  const raw = redis ? await redis.get(key) : mem.str.get(key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function bump(key){
  if(redis){
    const n = await redis.incr(key);
    await redis.expire(key, TTL);
    return n;
  }
  const n = (Number(mem.str.get(key)) || 0) + 1;
  mem.str.set(key, String(n));
  return n;
}

export async function hgetAll(key){
  const out = {};
  if(redis){
    const raw = await redis.hgetall(key);
    if(raw) for(const [f, v] of Object.entries(raw)){
      try{ out[f] = JSON.parse(v); }catch{ /* skip a corrupt field rather than fail the read */ }
    }
    return out;
  }
  for(const [f, v] of hashOf(key)){
    try{ out[f] = JSON.parse(v); }catch{ /* same */ }
  }
  return out;
}

export async function hgetOne(key, field){
  const raw = redis ? await redis.hget(key, field) : hashOf(key).get(field);
  if(raw == null) return null;
  try{ return JSON.parse(raw); }catch{ return null; }
}

/** `entries` is a plain object of field -> value; values are JSON-encoded here. */
export async function hset(key, entries){
  const encoded = {};
  for(const [f, v] of Object.entries(entries)) encoded[f] = JSON.stringify(v);
  if(redis){
    await redis.hset(key, encoded);
    await redis.expire(key, TTL);
    return;
  }
  const h = hashOf(key);
  for(const [f, v] of Object.entries(encoded)) h.set(f, v);
}

export async function hdel(key, fields){
  if(!fields.length) return;
  if(redis){ await redis.hdel(key, ...fields); return; }
  const h = hashOf(key);
  for(const f of fields) h.delete(f);
}

export async function exists(key){
  if(redis) return (await redis.exists(key)) > 0;
  return mem.str.has(key) || mem.hash.has(key);
}

/** Tests only — the memory backend has no other way to start clean. */
export function _resetMemory(){ mem.str.clear(); mem.hash.clear(); }
