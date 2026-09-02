/* The starting deck lives in public/ so the page and the server share one copy. */
export { SEED } from '../public/seed.js';
import { SEED } from '../public/seed.js';

/** Fresh idea records for a new deck. `done` here means "before the app". */
export function seedIdeas(){
  const out = {};
  for(const s of SEED){
    out[s.id] = {
      id: s.id,
      title: s.title,
      note: s.note || '',
      weather: s.weather,
      hood: s.hood || null,
      when: s.when || 'any',
      cost: null,
      url: null,
      addedBy: 'seed',
      createdAt: 0,
      done: s.done ? { at: 0, note: '', by: 'seed' } : null
    };
  }
  return out;
}
