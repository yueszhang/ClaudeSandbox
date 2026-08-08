# Joey Zhang — Work Portfolio

An editorial, text-forward portfolio site. Case studies are the primary unit;
roles provide career context. Built with [Astro](https://astro.build), content
lives in Markdown, deploys as a fully static site.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-checks, then builds to `dist/` |
| `npm run preview` | Serves the built site locally |
| `npm run check:drafts` | Lists every unresolved draft note |
| `npm run check:voice` | Flags banned words and constructions (see VOICE.md) |

Requires Node 22.12 or newer.

## How it's organized

```
src/
  content/
    projects/        One file per case study — the main thing you edit
    roles/           One file per job, for career context
  components/
    diagrams/        Original SVG framework figures
  pages/             Home, work index, case study template, about, 404
  styles/global.css  Design tokens and long-form prose styles
  site.ts            Name, positioning, contact details, nav
```

Two documents govern the content:

- **[CONTENT-GUIDE.md](./CONTENT-GUIDE.md)** — how to add a case study, and the
  anonymization rules. Read this first.
- **[VOICE.md](./VOICE.md)** — how the writing should sound, the banned word
  list, and the source documents behind both. Enforced by `npm run check:voice`.

## Before you publish

1. **Resolve the draft notes.** Run `npm run check:drafts`. Each one marks a
   place where a case study needs a detail only you can supply. They render as
   loud orange callouts on the page so they can't ship by accident.
2. **Set the real domain.** `site` in `astro.config.mjs` drives canonical URLs,
   the sitemap, and social preview tags. It's currently a placeholder.
3. **Re-read the anonymization.** Every client is a descriptor, never a name.
   See CONTENT-GUIDE.md.

## Deploying to Vercel

The site builds to static HTML, so hosting is straightforward.

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, and import the repo.
3. Vercel detects Astro automatically — build command `npm run build`, output
   directory `dist`. No environment variables needed.
4. Add your custom domain under **Settings → Domains**, then update `site` in
   `astro.config.mjs` to match and redeploy.

Every push to the default branch redeploys. Pull requests get preview URLs,
which is a convenient way to review a new case study before it's live.

## Design notes

- **Serif for reading, sans for scanning.** Body copy and headings are serif;
  navigation, metadata, labels, and metrics are sans. That split is what makes
  it read as editorial rather than as a template.
- **Light and dark both matter.** Themes follow the reader's OS by default; the
  header toggle cycles system → light → dark.
- **No external requests.** No web fonts, no analytics, no third-party scripts.
  The site loads fast and leaks nothing about who's reading it.
- **Accessibility.** Skip link, focus rings, real landmarks, alt text on every
  diagram via `<title>`, and honored `prefers-reduced-motion`.

## A note on the phone number

Your resume carries a phone number; this site deliberately does not. A resume
goes to people you chose. A public page is read by scrapers. Email and LinkedIn
are enough for anyone with a real reason to reach you. If you want it added
anyway, it's one line in `src/site.ts`.
