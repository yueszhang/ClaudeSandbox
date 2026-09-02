import { randomBytes, randomInt } from 'node:crypto';

/* No 0/O/1/I/L — these get read aloud and typed by hand. */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const CODE_LENGTH = 8;

export function makeCode(){
  let out = '';
  for(let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Accepts "xkmr-4t2p", "XKMR 4T2P", "xkmr4t2p" — returns null if it can't be one. */
export function normalizeCode(input){
  if(typeof input !== 'string') return null;
  const up = input.toUpperCase().replace(/[^0-9A-Z]/g, '');
  if(up.length !== CODE_LENGTH) return null;
  for(const ch of up) if(!ALPHABET.includes(ch)) return null;
  return up;
}

export function formatCode(code){
  return code ? code.slice(0, 4) + '-' + code.slice(4) : '';
}

/** A member id is a bearer token, not a name — 128 bits, never shown. */
export function makeMemberId(){ return randomBytes(16).toString('hex'); }

export function makeIdeaId(){ return 'c' + randomBytes(8).toString('hex'); }
