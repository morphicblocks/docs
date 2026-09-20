/**
 * Single source for every env-driven value used inside pages/components.
 *
 * The values come from `PUBLIC_*` environment variables (see `.env.example`)
 * and are baked in at build time. `astro.config.mjs` reads the same variables
 * via Vite's `loadEnv` because the Astro config runs before `import.meta.env`
 * is available.
 */
const env = import.meta.env;

// Undefined when a variable is unset or empty, so callers can skip the link
// entirely rather than rendering a dead one.
const link = (value?: string) => value || undefined;

// Legal pages exist per language: the university publishes English versions of
// some of them. `PUBLIC_*_URL` is the fallback used by every language;
// `PUBLIC_*_URL_EN` overrides it on the English pages. Leave the override unset
// when no translated page exists, and both languages share the base URL.
const legalLink = (base?: string, en?: string) => ({
  en: link(en) ?? link(base),
  de: link(base),
});

// The organization name differs per language ("University" vs "Universität").
// `PUBLIC_UNIVERSITY` is used everywhere; `PUBLIC_UNIVERSITY_DE` overrides it
// on German pages. Leave the override unset and both languages share the base.
const organization = (base?: string, de?: string) => ({
  en: base ?? "",
  de: de || base || "",
});

export const site = {
  name: env.PUBLIC_SITE_NAME ?? "",
  description: env.PUBLIC_SITE_DESCRIPTION ?? "",
  npmPackage: env.PUBLIC_NPM_PACKAGE ?? "",
  university: organization(env.PUBLIC_UNIVERSITY, env.PUBLIC_UNIVERSITY_DE),
  links: {
    landing: link(env.PUBLIC_LANDING_URL),
    playground: link(env.PUBLIC_PLAYGROUND_URL),
    github: link(env.PUBLIC_GITHUB_URL),
    npm: link(env.PUBLIC_NPM_URL),
    university: link(env.PUBLIC_UNIVERSITY_URL),
  },
  /**
   * Required on every university web presence, rendered by the footer
   * override in `src/components/Footer.astro`.
   */
  legal: {
    imprint: legalLink(env.PUBLIC_IMPRINT_URL, env.PUBLIC_IMPRINT_URL_EN),
    privacy: legalLink(env.PUBLIC_PRIVACY_URL, env.PUBLIC_PRIVACY_URL_EN),
    disclaimer: legalLink(
      env.PUBLIC_DISCLAIMER_URL,
      env.PUBLIC_DISCLAIMER_URL_EN,
    ),
  },
};

/** Absolute http(s) URLs point off-site. */
export function isExternal(href?: string): boolean {
  return !!href && /^https?:\/\//i.test(href);
}

/** Spread onto an <a> so off-site links open in a new tab. */
export function externalAttrs(href?: string) {
  return isExternal(href)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}
