import { addIdea, editIdea, deleteIdea, setDone, viewFor } from '../lib/deck.js';
import { readBody, send, fail, credentials } from './_shared.js';

export default async function handler(req, res){
  try{
    if(req.method !== 'POST'){
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed.' });
    }
    const body = readBody(req);
    const { code, member } = credentials(body);

    switch(body.op){
      case 'add':    await addIdea(code, member, body.idea || {}); break;
      case 'edit':   await editIdea(code, member, body.id, body.idea || {}); break;
      case 'delete': await deleteIdea(code, member, body.id); break;
      case 'done':   await setDone(code, member, body.id, body.done || {}); break;
      case 'undone': await setDone(code, member, body.id, null); break;
      default:       return send(res, 400, { error: 'Unknown operation.' });
    }
    return send(res, 200, await viewFor(code, member));
  }catch(err){ return fail(res, err); }
}
