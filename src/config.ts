/**
 * Single source for every env-driven value used inside pages/components.
 *
 * The values come from `PUBLIC_*` environment variables (see `.env.example`)
 * and are baked in at build time. `astro.config.mjs` reads the same variables
 * via Vite's `loadEnv` because the Astro config runs before `import.meta.env`
 * is available.
 */
const env = import.meta.env;

export const site = {
  name: env.PUBLIC_SITE_NAME ?? "",
  description: env.PUBLIC_SITE_DESCRIPTION ?? "",
  npmPackage: env.PUBLIC_NPM_PACKAGE ?? "",
  university: env.PUBLIC_UNIVERSITY ?? "",
  links: {
    landing: env.PUBLIC_LANDING_URL ?? "#",
    playground: env.PUBLIC_PLAYGROUND_URL ?? "#",
    github: env.PUBLIC_GITHUB_URL ?? "#",
    npm: env.PUBLIC_NPM_URL ?? "#",
    university: env.PUBLIC_UNIVERSITY_URL ?? "#",
  },
};
