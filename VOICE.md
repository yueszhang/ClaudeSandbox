# Voice Guide

How writing on this site should sound, and what it must never sound like.

This exists because the first draft of this site read like an AI wrote it. It
had a recognisable set of habits, all of them listed below as bans. Run
`npm run check:voice` to catch them mechanically.

---

## Source documents

These are the actual references this guide is built on. Where a rule here
seems arbitrary, the source explains it.

| Source | What it contributes |
| --- | --- |
| Barbara Minto, *The Pyramid Principle* (1973) | Answer first, then support it. The standard structure in management consulting writing. |
| Amazon six-page narrative / PR-FAQ convention | Plain prose over bullets. No adjectives doing work that data should do. |
| George Orwell, *Politics and the English Language* (1946) | The six rules. Chiefly: never use a metaphor you are used to seeing in print. |
| Strunk & White, *The Elements of Style* | Omit needless words. Prefer the specific to the general. |
| Ryan Singer, *Shape Up* (Basecamp, 2019) | How a working product person actually writes about product decisions. |
| *The Economist Style Guide* | Short words, active voice, no jargon where English will do. |

---

## The four rules that matter most

### 1. Answer first

Minto's core move. State the conclusion, then support it. Do not build to a
reveal.

> **Bad:** Most enterprise AI programs die in the same place. A pilot goes well,
> a leadership deck gets made, and then nothing reaches the teams who would have
> to change how they work.
>
> **Good:** I led AI adoption across 900+ product teams at a global investment
> manager. Feature delivery doubled. The work split into two problems:
> infrastructure teams could actually reach, and reasons for them to use it.

The bad version withholds the point for three sentences. A hiring manager
skimming eight case studies will not wait.

### 2. One idea per sentence

Average sentence length under 20 words. If a sentence has two subordinate
clauses, it is two sentences.

> **Bad:** Vendor negotiations go badly when the buyer's requirements are vague,
> because vague requirements get filled in by the vendor's roadmap and priced as
> customization.
>
> **Good:** Vague requirements get filled in by the vendor. Then they get priced
> as customization.

### 3. Specifics, not maxims

Never end a section on a generalisation. The reader wants the number, the
decision, the name of the thing.

> **Bad:** Enablement is mostly the removal of excuses.
>
> **Good:** The one-click installer mattered more than the model choice. Setup
> friction was the reason four of the first six teams stalled.

### 4. No rhetorical scaffolding

Cut anything that signals "an insight is coming." Signposting is a substitute
for having the insight.

Banned openers: *The part that mattered was…*, *What's worth noticing…*, *Here's
the thing…*, *It turns out…*, *The pattern behind both…*

---

## Banned constructions

These are enforced by `npm run check:voice`.

**The false contrast.** `not X — it's Y`, `isn't about X, it's about Y`,
`not just X but Y`. Once in a document is a choice. Four times is a tic.

**Aphoristic closers.** A short declarative sentence, on its own line, meant to
land. `It was the negotiating position.` `That is the whole point.`

**Rule of three.** `unblocking teams, clarifying requirements, and securing
funding`. Real work does not arrive in threes. Use two items or five.

**Em-dash as default punctuation.** One per paragraph, maximum. Prefer a full
stop. Prefer a comma. The em-dash is for genuine interruption, not for rhythm.

**Sweeping generalisation as opener.** `Most enterprise AI programs…`,
`Every large company has…`, `There are two kinds of…`. You do not have the data
for this claim and the reader knows it.

**Abstract nouns as subjects.** `Adoption requires…`, `Enablement produces…`.
Say who did what. `I ran…`, `The pods used…`, `Three teams stalled because…`.

---

## Banned words

Full list lives in `scripts/check-voice.mjs`. The categories:

**Consulting filler:** leverage (verb), synergy, holistic, robust, seamless,
best-in-class, world-class, move the needle, low-hanging fruit, deep dive,
north star, value-add, mission-critical, turnkey, best practice, unlock,
empower, spearhead, orchestrate, transformative, innovative, thought leader,
ecosystem, landscape (figurative), journey (figurative), space (as in "the AI
space"), at scale (as a modifier).

**AI tells:** delve, tapestry, testament, realm, navigate (figurative), foster,
underscore, pivotal, crucial, vital, meticulous, intricate, myriad, plethora,
embark, harness, elevate, serves as, plays a key role, stands as.

**Intensifier filler:** genuinely, actually, simply, obviously, truly, really,
quite, very, incredibly, deeply.

Cutting an intensifier almost always strengthens the sentence. If `genuinely
useful` is more true than `useful`, the problem is that `useful` is not
supported.

---

## What good looks like here

The voice is a competent product manager writing a post-mortem for peers. Not
selling. Not teaching. Reporting what happened and what they concluded.

Specifically:

- **First person, past tense, active.** "I ran 25 discovery sessions." Not
  "25 discovery sessions were conducted."
- **Numbers early.** If the section has a number, it belongs in the first two
  sentences.
- **Admit the limits.** "I reconstructed the baseline after the fact" is more
  credible than a clean claim. Consultants read for what you are not saying.
- **Name the trade-off.** Every real decision cost something. Say what.
- **Short paragraphs.** Three to five sentences. One idea.

---

## What to keep

Two things from the current draft are working and should survive any rewrite:

1. **The "What I'd do differently" section on every case study.** Self-criticism
   is the most credible thing on a portfolio.
2. **Precise metric definitions.** "Twice the launches in a comparable window
   with comparable resources" beats "2× delivery." Always define the
   denominator.

---

## Checking your work

```bash
npm run check:voice     # banned words and constructions
npm run check:drafts    # unresolved input requests
npm run build           # must pass before publishing
```

`check:voice` is advisory, not a build gate. It catches lexicon and simple
patterns. It cannot catch a boring sentence, a claim without evidence, or a
paragraph that says nothing. Read the page.
