# docs

Documentation site for **Morphic Blocks** — served at
`https://docs.morphicblocks.com`. Built with [Astro Starlight](https://starlight.astro.build).

The landing page (`morphicblocks.com`) and the interactive playground
(`playground.morphicblocks.com`) live in separate repos.

## Develop

```sh
bun install
bun run dev      # local dev server
bun run build    # static build to ./dist
bun run preview  # preview the built site
```

## Configuration

Every switchable value (site name, description, package name, and all links)
is an environment variable — nothing is hardcoded in pages or config. Change
them in one place and the whole site updates.

```sh
cp .env.example .env   # then edit .env
```

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_NAME` | Brand name in header, page titles, logo alt text |
| `PUBLIC_SITE_URL` | Canonical site URL (sitemap, meta) |
| `PUBLIC_SITE_DESCRIPTION` | Default meta description and splash tagline |
| `PUBLIC_NPM_PACKAGE` | Package name in install commands and code samples |
| `PUBLIC_NPM_URL` | npm link in the header |
| `PUBLIC_GITHUB_URL` | Repository link in the header |
| `PUBLIC_LANDING_URL` | Link to the landing page (morphicblocks.com) |
| `PUBLIC_PLAYGROUND_URL` | Playground link in the header |
| `PUBLIC_UNIVERSITY` | University attribution (currently unused on pages) |
| `PUBLIC_UNIVERSITY_URL` | Link target for the attribution |

These are build-time `PUBLIC_*` vars baked into the static output. On
Cloudflare Pages, set them in the project's environment variables. Reading
happens in two places: `src/config.ts` (pages/components) and
`astro.config.mjs` via Vite `loadEnv` (Starlight title, logo, social links) —
the Astro config runs before `import.meta.env` exists.

## Structure

```text
public/
  favicon.svg           # PLACEHOLDER — matches the landing page favicon
src/
  assets/logo.svg       # PLACEHOLDER logo — replace with the real mark
  config.ts             # single source for env-driven values in pages
  env.d.ts              # typed env vars
  pages/index.astro     # docs landing (StarlightPage, so it can use config)
  styles/custom.css     # brand color overrides (Starlight custom props)
  content/docs/         # the documentation content
    getting-started/    # introduction, installation, quick-start
    concepts/           # blocks & elements, modes, presets, definitions, behaviors
    guides/             # stubs, badged "Soon" in the sidebar
astro.config.mjs        # Starlight config: sidebar, env-driven title/social
```

## Content notes

- Pages that need config values (package name, links) are `.mdx` and import
  `src/config.ts`; plain prose pages stay `.md`.
- The sidebar is explicit in `astro.config.mjs`; guide stubs carry a `Soon`
  badge. An API Reference section is planned once the public API stabilises.
- Deploy target: Cloudflare Pages (static output).
