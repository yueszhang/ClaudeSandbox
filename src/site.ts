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

  /** The positioning line. Everything on the site should support this claim. */
  positioning:
    'Product manager who builds with AI and gets whole organizations building with it too.',

  intro:
    'I ship product with AI in my own loop, then turn what works into something teams can adopt — tooling, guardrails, and the change management that makes it stick. Most recently across 900+ product teams at a global investment manager.',

  email: 'YueSZhang@gmail.com',
  linkedin: 'https://linkedin.com/in/joey-y-zhang',
  linkedinLabel: 'linkedin.com/in/joey-y-zhang',

  nav: [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
  ],
} as const;
