# Weather Permitting

A two-player deck of New York date ideas that sorts itself by the temperature.
You each swipe on your own phone. Neither of you sees the other's answer on a
card you haven't decided yet; when you both say yes, it's a match.

Seventy degrees is the line — 70°F and up opens the warm deck, under 70°F the
cold one, and the all-weather ideas ride along in both. If it's raining, the
indoor deck wins regardless, with a one-tap override.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm test           # the deck rules, including the blind-matching guarantees
```

With no Upstash credentials in the environment the store falls back to process
memory, so `npm run dev` works with nothing set up. Decks vanish when you stop
the server, which is what you want locally.

## Deploying

This is a separate Vercel project from the portfolio in the repo root. Three
steps, all in the Vercel dashboard:

1. **Add New → Project**, import this repo, and set **Root Directory** to
   `dates`. Framework preset: **Other**. `vercel.json` supplies the rest.
2. **Storage → Marketplace → Upstash for Redis**: create a database and connect
   it to this project. It injects the URL and token; the store reads either the
   `KV_REST_API_*` or the `UPSTASH_REDIS_REST_*` spelling, whichever appears.
3. Set the production branch under **Settings → Git**.

No other environment variables. A deployment without Redis refuses to create or
open a shared deck and says which click is missing, rather than running on
memory and losing decks between invocations. "Just me, on this phone" keeps
working either way.

## How it fits together

```
public/index.html   the whole app — no framework, no build step
public/seed.js      the starting 32 ideas, imported by the page and the server
api/deck.js         create · join · poll
api/swipe.js        vote · undo
api/idea.js         add · edit · delete · mark done
lib/deck.js         deck rules, and the only place blind matching is enforced
lib/http.js         request plumbing, and the no-database guard
lib/store.js        Upstash, or process memory when there are no credentials
```

Redis keys, one set per deck:

| Key | Type | Holds |
| --- | --- | --- |
| `d:<code>` | string | members |
| `i:<code>` | hash | one field per idea |
| `v:<code>` | hash | one field per idea-and-person |
| `r:<code>` | counter | bumped on every change |

Votes and ideas are hash fields rather than one JSON document so two people
acting at the same moment write different fields and neither loses. Polling
reads `r:` alone and asks for the rest only when that number moves, which keeps
an open app to roughly one Redis command every few seconds.

## Two things to know

**The code is the key.** Anyone holding an eight-character deck code can join if
a seat is free, and there are only two seats. There are no accounts, so clearing
your browser loses your key — reopening the invite link is how you get back in.

**Blind matching is a server rule, not a client one.** `viewFor()` in
`lib/deck.js` strips your partner's votes from any card you haven't decided
before the response leaves the function, and `picks` deliberately merges "they
haven't voted" with "they said no" so neither can be inferred from the other's
absence. The tests in `test/deck.test.js` hold that line — if you change the
view shape, keep them passing.
