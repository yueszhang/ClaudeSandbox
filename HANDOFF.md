# Handoff

Paste this, or just say: **"Read HANDOFF.md and follow it."**

---

Read `README.md`, `CONTENT-GUIDE.md` and `VOICE.md` before touching anything.
They cover the structure, the anonymization contract, and how the writing is
meant to sound.

This is my work portfolio. Content lives in `src/content/`: eight case studies
in `projects/`, five roles in `roles/`, two entries in `education/`. Pages are
Astro files in `src/pages/`.

There are 18 unresolved draft notes marked in the Markdown. Run
`npm run check:drafts` to list them with file and line numbers. Each one asks
for a specific detail that only I can supply, and each renders on the page as an
orange callout so it can't ship by accident.

I've put source material in `./website context/`. Read all of it. Don't ask me
to pre-sort it.

## Start with triage, not edits

Before writing anything into the site, give me:

1. **An inventory.** What's in each file, one line each.
2. **A mapping.** Which of the 18 draft notes each file can answer.
3. **Conflicts.** Anywhere a source disagrees with what's currently on the site.
   Two of my resumes already disagreed on a portfolio figure, so assume more of
   this exists.
4. **Exposure.** Anything client-identifying that needs sanitizing before it
   goes near a page.

Wait for me to approve that before you edit.

## Rules that don't bend

- **Clients are never named. Employers are.** Deloitte, Adobe and Loews are
  fine. Their clients get descriptors only. Watch for indirect identification —
  industry plus scale plus date can identify a company as surely as a name.
- **Don't invent details.** If a page needs something the sources don't cover,
  leave a draft note instead of writing a plausible sentence. I have to defend
  every claim on this site in an interview.
- **Flag conflicts, don't resolve them.** If a source contradicts a number
  that's live, ask me which is right.
- **No college internships.** Specifically exclude J.P. Morgan Asset Management
  (2017) and Equitation Capital (2017–18). MBA internships like Adobe are fine.
- **Contractions and American spelling**, site-wide.
- **The repo is public.** Never commit anything out of `./website context/`.
  Check `.gitignore` covers it before your first commit.

## Before any commit

```bash
npm run build         # must pass, 0 errors
npm run check:voice   # banned words and constructions, see VOICE.md
npm run check:drafts  # tells me what's still open
```

## Working rhythm

After triage, do **one case study at a time** and show me the diff. Two
site-wide rewrites have already been reverted on this project because the
feedback loop was too long. Small passes I can react to work better.

## Deployment

Vercel builds from the `claude/personal-portfolio-website-ou436z` branch, not
`main` — the repo's default branch was never switched. Keep both refs at the
same commit or the live site silently goes stale.

`site.indexable` in `src/site.ts` is `false`, which serves `noindex` and a
blocking `robots.txt`. That's the launch switch. Leave it off until the draft
notes are resolved.
