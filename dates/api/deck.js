import { createDeck, joinDeck, viewFor, revision } from '../lib/deck.js';
import { normalizeCode } from '../lib/ids.js';
import { readBody, send, fail, credentials, assertStorage } from '../lib/http.js';

export default async function handler(req, res){
  try{
    assertStorage();
    if(req.method === 'GET'){
      const { code, member } = credentials(req.query || {});
      // The poll costs one read: if nothing changed, say so and send no data.
      const since = Number((req.query || {}).rev);
      if(Number.isFinite(since) && since > 0){
        const now = await revision(code);
        if(now === since) return send(res, 200, { rev: now, unchanged: true });
      }
      return send(res, 200, await viewFor(code, member));
    }

    if(req.method === 'POST'){
      const body = readBody(req);

      if(body.op === 'create'){
        const { code, memberId } = await createDeck(body.name);
        return send(res, 200, { code, member: memberId, view: await viewFor(code, memberId) });
      }

      if(body.op === 'join'){
        const code = normalizeCode(body.code);
        if(!code) return send(res, 400, { error: 'That code is not a deck code.' });
        const existing = typeof body.member === 'string' ? body.member : null;
        const joined = await joinDeck(code, body.name, existing);
        return send(res, 200, { code, member: joined.memberId, view: await viewFor(code, joined.memberId) });
      }

      return send(res, 400, { error: 'Unknown operation.' });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Method not allowed.' });
  }catch(err){ return fail(res, err); }
}
