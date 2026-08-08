# Content Guide

How to add and edit work on this site.

---

## The anonymization contract

Almost everything here is Deloitte client work. Your resume already anonymizes
it; this site has to hold the same line, and a public indexed page is a much
higher-exposure surface than a resume you hand to a specific person.

**The rule:** a reader must not be able to identify the client.

| Do | Don't |
| --- | --- |
| "A major multinational hotel loyalty program" | The brand name |
| Metrics you can defend — 1.5×, $2.5M, 900 teams | Internal codenames or project names |
| Diagrams and frameworks you authored | Screenshots of the client's product |
| Your role, your decisions, your reasoning | Slide excerpts with client branding |
| Named employers — Deloitte, Adobe, Loews | Named clients of those employers |

Naming your own **employers** is always fine. Only their **clients** get
anonymized.

Watch for indirect identification. Industry + scale + timeframe can be enough
on their own — "the 8,000-property hotel chain that replatformed in 2022"
identifies a company as surely as naming it. If a detail only fits one company,
it's identifying, even when no name appears.

Screenshots are the trap. A product screenshot identifies a client in seconds,
including through reverse image search, and redaction is usually reversible
from context. If you want something visual, make a diagram instead — see below.

---

## Adding a case study

Create a file in `src/content/projects/`. Use `.md` normally; use `.mdx` only
if you want to embed a diagram.

```yaml
---
title: 'Replatforming a Global Loyalty Program'
tagline: 'One line — what the work was. Shows in listings.'
company: 'Deloitte Digital'          # Your employer
role: 'Product Manager'              # Your title on this work
client: 'A global travel loyalty program'   # DESCRIPTOR, never a name
industry: 'Travel & Hospitality'
period: 'September 2020 — January 2024'
sortDate: '2021-06'                  # YYYY-MM, ordering only, never displayed
teamSize: '10 developers · 2 designers'    # Optional
summary: 'Two sentences. Used for search results and social previews.'
themes:                              # Must come from the fixed list below
  - 'Product Management'
  - 'Vendor & Commercial'
skills:                              # Shows in the case study sidebar
  - 'Requirements definition'
metrics:                             # First one appears on the card
  - value: '$1.2M'
    label: 'Cost savings enabled'
diagram: 'requirements'              # Optional, .mdx only
featured: true                       # Shows on the home page
draft: false                         # true hides it from the built site
---
```

### Themes are a fixed list

Free-text themes produce a filter where every option returns one project, which
is noise rather than navigation. The allowed values live in
`src/content.config.ts`:

`AI Enablement` · `AI-Native Delivery` · `Product Management` ·
`Platform & Tooling` · `Vendor & Commercial` · `Research & Discovery`

Using anything else fails the build with a clear error. Add a new theme only
when at least two projects need it.

---

## How a case study is structured

The existing ones follow a shape that works. It survives a skim and rewards a
close read:

1. **Opening** — the tension, in two or three sentences. Rendered larger than
   body copy, so it carries weight. Not a summary; a hook with a claim in it.
2. **The situation** — the constraints. What made this hard.
3. **What I owned** — your actual scope, stated plainly.
4. **The approach** — the substance. Where a diagram usually belongs.
5. **Outcomes** — bulleted, with the numbers.
6. **What I'd do differently** — non-negotiable. Senior candidates get read on
   self-awareness, and its absence is conspicuous.

Write about reasoning rather than activity. "I ran 25 discovery sessions" is
activity. "I ran them separately and reconciled afterwards, so conflicts
surfaced as decisions for leadership rather than as ambiguities that reappear
mid-build" is reasoning. That is the thing a hiring manager cannot get from
your resume.

**How it should sound is a separate document.** See [VOICE.md](./VOICE.md) for
the rules, the banned word list, and the sources behind them. Run
`npm run check:voice` before you publish.

---

## Draft notes

When a case study needs a detail only you have, mark it:

```markdown
> **Draft note —** Add the before/after on time-to-launch here. That number
> would carry the whole case study. Delete this note once added.
```

These render as loud orange "UNPUBLISHED — NEEDS YOUR INPUT" callouts, so they
can't ship unnoticed. List the outstanding ones with:

```bash
npm run check:drafts
```

---

## Adding a diagram

Diagrams are the visual language of this site, since screenshots are off the
table. They're also better for your positioning: a screenshot proves a website
existed, a diagram shows how you think.

1. Build the component in `src/components/diagrams/`. Copy an existing one —
   they share conventions: a `viewBox` around 640 units wide, type set through
   CSS classes rather than SVG attributes, colors from theme variables
   (`var(--accent)`, `var(--text-muted)`), and a `<title>` element describing
   the figure for screen readers.
2. Register it in `src/components/Diagram.astro` with a caption. Captions do
   real work here — say what the figure *means*, not what it shows.
3. Rename the case study to `.mdx`, add the import below the frontmatter, and
   place the figure in the section it illustrates:

```mdx
import Diagram from '../../components/Diagram.astro';

...prose...

<Diagram name="requirements" />
```

Keep label text short. The columns are narrow, and anything much past four
wrapped lines clips against the box — check it in the browser at desktop and
mobile width before committing.

---

## Adding a role

`src/content/roles/` — short files that give the career its shape. Projects
attach to a role automatically when `company` matches and the role title starts
the same way.

---

## Adding education

`src/content/education/` — one file per credential, shown on the About page.
The Markdown body is a short narrative; keep it to two or three paragraphs
about what the degree actually did for you, not a course list.

```yaml
---
school: 'Columbia Business School'
credential: 'Master of Business Administration'
focus: 'Media & Technology Program'      # Program, major, or concentration
location: 'New York, NY'
year: 'May 2025'
sortDate: '2025-05'                      # Newest sorts first
honors:
  - 'GSAP Award — tuition sponsored by Deloitte Digital'
  - 'Columbia Build Lab incubatee'
---
```

Honors render as a bulleted list beside the narrative. Keep each one short —
they're scanned, not read.

---

## Adding a headshot

The About page supports an optional portrait. Put the image in `public/` and
set `portrait` in `src/site.ts` to its path (e.g. `'/portrait.jpg'`). Leave it
`null` and the bio simply runs full width, which is a perfectly good look — add
one only if you have a photo you actually like.

---

## When you're ready to publish

- [ ] `npm run check:drafts` returns clean
- [ ] Every `client` is a descriptor, not a name
- [ ] No screenshots or slide excerpts of client work
- [ ] No detail that identifies a client indirectly
- [ ] `site` in `astro.config.mjs` points at your real domain
- [ ] `npm run build` passes
