import * as store from './store.js';
import { seedIdeas } from './seed.js';
import { makeCode, makeMemberId, makeIdeaId } from './ids.js';

const MAX_MEMBERS = 2;
const MAX_IDEAS = 300;
const LIMITS = { title: 80, note: 140, hood: 48, url: 400, name: 24, doneNote: 200 };

const kD = (c) => 'd:' + c;
const kI = (c) => 'i:' + c;
const kV = (c) => 'v:' + c;
const kR = (c) => 'r:' + c;

export class DeckError extends Error {
  constructor(status, message){ super(message); this.status = status; }
}

/* ------------------------------- validation ------------------------------ */

function str(value, max, fallback = ''){
  if(typeof value !== 'string') return fallback;
  const t = value.trim().slice(0, max);
  return t || fallback;
}

function optionalStr(value, max){
  const t = str(value, max, '');
  return t || null;
}

const WEATHERS = ['warm', 'cold', 'any'];
const WHENS = ['day', 'night', 'any'];

/** Only http(s) — a javascript: or data: url in a link people tap is a hazard. */
function safeUrl(value){
  const raw = optionalStr(value, LIMITS.url);
  if(!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
  try{
    const u = new URL(withScheme);
    if(u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  }catch{ return null; }
}

function cleanIdeaInput(input, base = {}){
  const cost = Number(input.cost);
  return {
    title: str(input.title, LIMITS.title, base.title || ''),
    note: str(input.note, LIMITS.note, ''),
    weather: WEATHERS.includes(input.weather) ? input.weather : (base.weather || 'any'),
    hood: optionalStr(input.hood, LIMITS.hood),
    when: WHENS.includes(input.when) ? input.when : (base.when || 'any'),
    cost: [1, 2, 3].includes(cost) ? cost : null,
    url: safeUrl(input.url)
  };
}

/* --------------------------------- reads --------------------------------- */

export async function revision(code){ return store.getNumber(kR(code)); }

async function loadMeta(code){
  const meta = await store.getJSON(kD(code));
  if(!meta) throw new DeckError(404, 'No deck with that code.');
  return meta;
}

async function requireMember(code, memberId){
  const meta = await loadMeta(code);
  if(!memberId || !meta.members[memberId]) throw new DeckError(403, 'That deck is not yours to change.');
  return meta;
}

/**
 * The view one member is allowed to see.
 *
 * Blind matching is enforced here and nowhere else: a card you have not voted
 * on carries no trace of your partner's answer, and `picks` deliberately
 * merges "they haven't voted" with "they said no" so neither can be inferred
 * from the other's absence.
 */
export async function viewFor(code, memberId){
  const meta = await requireMember(code, memberId);
  const [ideaMap, voteMap, rev] = await Promise.all([
    store.hgetAll(kI(code)),
    store.hgetAll(kV(code)),
    revision(code)
  ]);

  const partnerId = Object.keys(meta.members).find((id) => id !== memberId) || null;
  const ideas = Object.values(ideaMap).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  const votes = {};
  const matches = [];
  const picks = [];

  for(const idea of ideas){
    const mine = voteMap[idea.id + '|' + memberId];
    if(!mine) continue;
    votes[idea.id] = mine.v;
    if(idea.done || mine.v !== 'yes') continue;
    const theirs = partnerId ? voteMap[idea.id + '|' + partnerId] : null;
    (theirs && theirs.v === 'yes' ? matches : picks).push({ id: idea.id, t: mine.t || 0 });
  }

  const byNewest = (a, b) => b.t - a.t;
  return {
    rev,
    code,
    you: { id: memberId, name: meta.members[memberId].name },
    partner: partnerId ? { name: meta.members[partnerId].name } : null,
    ideas,
    votes,
    matches: matches.sort(byNewest).map((m) => m.id),
    picks: picks.sort(byNewest).map((m) => m.id)
  };
}

/* -------------------------------- writes --------------------------------- */

export async function createDeck(name){
  let code = makeCode();
  for(let i = 0; i < 5 && (await store.exists(kD(code))); i++) code = makeCode();

  const memberId = makeMemberId();
  const meta = {
    code,
    createdAt: Date.now(),
    members: { [memberId]: { name: str(name, LIMITS.name, 'You'), joinedAt: Date.now() } }
  };
  await store.setJSON(kD(code), meta);
  await store.hset(kI(code), seedIdeas());
  await store.bump(kR(code));
  return { code, memberId };
}

export async function joinDeck(code, name, existingMemberId){
  const meta = await loadMeta(code);

  // Reopening the invite link on a device that already joined is not a new member.
  if(existingMemberId && meta.members[existingMemberId]) return { code, memberId: existingMemberId };

  if(Object.keys(meta.members).length >= MAX_MEMBERS){
    throw new DeckError(409, 'This deck already has two people in it.');
  }

  const memberId = makeMemberId();
  meta.members[memberId] = { name: str(name, LIMITS.name, 'Them'), joinedAt: Date.now() };
  await store.setJSON(kD(code), meta);
  await store.bump(kR(code));
  return { code, memberId };
}

export async function setVote(code, memberId, ideaId, verdict){
  await requireMember(code, memberId);
  const idea = await store.hgetOne(kI(code), String(ideaId));
  if(!idea) throw new DeckError(404, 'That idea is gone.');

  const field = idea.id + '|' + memberId;
  if(verdict === null) await store.hdel(kV(code), [field]);
  else if(verdict === 'yes' || verdict === 'no') await store.hset(kV(code), { [field]: { v: verdict, t: Date.now() } });
  else throw new DeckError(400, 'A vote is yes, no, or nothing.');

  await store.bump(kR(code));
}

export async function addIdea(code, memberId, input){
  await requireMember(code, memberId);
  const count = Object.keys(await store.hgetAll(kI(code))).length;
  if(count >= MAX_IDEAS) throw new DeckError(409, 'This deck is full.');

  const fields = cleanIdeaInput(input);
  if(!fields.title) throw new DeckError(400, 'An idea needs a name.');

  const idea = { id: makeIdeaId(), ...fields, addedBy: memberId, createdAt: Date.now(), done: null };
  await store.hset(kI(code), { [idea.id]: idea });
  await store.bump(kR(code));
  return idea;
}

export async function editIdea(code, memberId, ideaId, input){
  await requireMember(code, memberId);
  const idea = await store.hgetOne(kI(code), String(ideaId));
  if(!idea) throw new DeckError(404, 'That idea is gone.');

  const fields = cleanIdeaInput(input, idea);
  if(!fields.title) throw new DeckError(400, 'An idea needs a name.');

  const updated = { ...idea, ...fields };
  await store.hset(kI(code), { [idea.id]: updated });
  await store.bump(kR(code));
  return updated;
}

/** Only what someone added themselves; the starting deck is revived, not deleted. */
export async function deleteIdea(code, memberId, ideaId){
  const meta = await requireMember(code, memberId);
  const idea = await store.hgetOne(kI(code), String(ideaId));
  if(!idea) return;
  if(idea.addedBy === 'seed') throw new DeckError(403, 'Ideas from the starting deck can be marked done, not deleted.');

  await store.hdel(kI(code), [idea.id]);
  await store.hdel(kV(code), Object.keys(meta.members).map((id) => idea.id + '|' + id));
  await store.bump(kR(code));
}

export async function setDone(code, memberId, ideaId, done){
  await requireMember(code, memberId);
  const idea = await store.hgetOne(kI(code), String(ideaId));
  if(!idea) throw new DeckError(404, 'That idea is gone.');

  if(done){
    const at = Number(done.at);
    idea.done = {
      at: Number.isFinite(at) && at > 0 ? at : Date.now(),
      note: str(done.note, LIMITS.doneNote, ''),
      by: memberId
    };
  }else{
    idea.done = null;
  }

  await store.hset(kI(code), { [idea.id]: idea });
  await store.bump(kR(code));
  return idea;
}
