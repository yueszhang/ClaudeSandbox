import { setVote, viewFor } from '../lib/deck.js';
import { readBody, send, fail, credentials, assertStorage } from '../lib/http.js';

export default async function handler(req, res){
  try{
    assertStorage();
    if(req.method !== 'POST'){
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed.' });
    }
    const body = readBody(req);
    const { code, member } = credentials(body);
    const verdict = body.v === null || body.v === undefined ? null : body.v;
    await setVote(code, member, body.idea, verdict);
    return send(res, 200, await viewFor(code, member));
  }catch(err){ return fail(res, err); }
}
