import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Anonymization contract
 * ----------------------
 * `client` is a DESCRIPTOR, never a name. "A leading investment management
 * firm" — not the firm. Nothing in a case study should let a reader identify
 * the client: no logos, no product screenshots, no internal codenames, no
 * distinctive proper nouns. See CONTENT-GUIDE.md before adding work.
 */
/**
 * A deliberately small, fixed vocabulary. Free-text themes produce a filter
 * where almost every option returns one project — which is noise rather than
 * navigation. Add a theme here only when at least two projects need it.
 */
export const THEMES = [
  'AI Enablement',
  'AI-Native Delivery',
  'Product Management',
  'Platform & Tooling',
  'Vendor & Commercial',
  'Research & Discovery',
] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One line, present tense, what the work was. Shows in listings. */
    tagline: z.string(),

    // Role context — projects lead, but every project carries where it happened.
    company: z.string(),
    role: z.string(),
    /** Anonymized client descriptor. Never a real client name. */
    client: z.string(),
    industry: z.string(),
    period: z.string(),
    /** Sortable. ISO-ish `YYYY-MM`; used for ordering, never displayed. */
    sortDate: z.string(),

    /** Scope signals a hiring manager scans for. */
    teamSize: z.string().optional(),

    summary: z.string(),
    themes: z.array(z.enum(THEMES)).min(1),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .default([]),
    skills: z.array(z.string()).default([]),

    /** Key into src/components/diagrams — renders the framework figure. */
    diagram: z.string().optional(),

    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/**
 * Roles exist so the career reads as a narrative, not just a pile of projects.
 * Projects link to a role via matching `company` + `role`.
 */
const roles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roles' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().default('New York, NY'),
    period: z.string(),
    sortDate: z.string(),
    summary: z.string(),
  }),
});

export const collections = { projects, roles };
