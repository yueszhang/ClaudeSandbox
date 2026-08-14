/**
 * Single source of truth for identity and contact details.
 *
 * Deliberately omits a phone number. A resume is sent to people you chose;
 * a public indexed page is read by scrapers. Email and LinkedIn are enough
 * for anyone with a real reason to reach out.
 */
export const site = {
  name: 'Joey Zhang',
  role: 'AI-Native Product Manager',
  location: 'New York, NY',

  /**
   * Search-engine visibility. Keep this `false` while draft notes remain —
   * it adds a noindex tag and a blocking robots.txt, so you can deploy and
   * share a live link without anything reaching Google.
   *
   * Flip to `true` when you're ready to be found. That's the launch switch.
   */
  indexable: false,

  /** The positioning line. Everything on the site should support this claim. */
  positioning:
    'Product manager who builds with AI, and gets organizations building with it too.',

  intro:
    'I ship product with AI inside my own delivery loop. Then I turn what works into something teams can adopt: tooling, guardrails, and the change management that makes it stick. Most recently across 900+ product teams at an investment management company.',

  /**
   * Optional headshot for the About page. Drop an image in `src/assets/` and
   * set this to e.g. '/portrait.jpg' after placing it in `public/`.
   * Leave null and the bio simply runs full width.
   */
  portrait: null as string | null,

  /**
   * Downloadable resume. Put the PDF in `public/` and set `path` to its URL,
   * e.g. '/joey-zhang-resume.pdf'. Links appear on About and in the footer
   * only when this is set; leave it null and nothing renders.
   *
   * Before you add the file, two things to settle:
   *
   * 1. This repo is public and git history is permanent. Every resume version
   *    carries a phone number, which the site itself deliberately omits. Use a
   *    copy with the number removed, or accept that it becomes public.
   * 2. Your resume still states figures the site no longer does — the four
   *    dollar amounts, 12 launches, 1.5x velocity. Publishing both invites
   *    someone to notice the difference.
   */
  resume: null as { path: string; label: string; updated: string } | null,

  email: 'YueSZhang@gmail.com',
  linkedin: 'https://linkedin.com/in/joey-y-zhang',
  linkedinLabel: 'linkedin.com/in/joey-y-zhang',

  nav: [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
  ],
} as const;
