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
| `PUBLIC_UNIVERSITY` | Copyright holder in the footer |
| `PUBLIC_UNIVERSITY_DE` | German name of the holder, used on `/de/` pages |
| `PUBLIC_UNIVERSITY_URL` | Link target for the attribution |
| `PUBLIC_IMPRINT_URL` | Imprint link in the footer |
| `PUBLIC_PRIVACY_URL` | Privacy policy link in the footer |
| `PUBLIC_DISCLAIMER_URL` | Disclaimer (Haftungsausschluss) link in the footer |
| `PUBLIC_IMPRINT_URL_EN` | English imprint, if a translated page exists |
| `PUBLIC_PRIVACY_URL_EN` | English privacy page, if one exists |
| `PUBLIC_DISCLAIMER_URL_EN` | English disclaimer, if one exists |

These are build-time `PUBLIC_*` vars baked into the static output. On
Cloudflare Pages, set them in the project's environment variables. Reading
happens in two places: `src/config.ts` (pages/components) and
`astro.config.mjs` via Vite `loadEnv` (Starlight title, logo, social links) —
the Astro config runs before `import.meta.env` exists.

## Structure

```text
public/
  favicon.svg           # the real mark, shared with the other sites
  og.png                # social card, rendered from morphic-meta/brand/og
src/
  assets/logo.svg       # the real mark, shared with the other sites
  config.ts             # single source for env-driven values in pages
  env.d.ts              # typed env vars
  pages/index.astro     # English docs landing (StarlightPage, uses config)
  pages/de/index.astro  # German docs landing (/de/)
  styles/custom.css     # brand color overrides (Starlight custom props)
  content/docs/         # English content (root locale, served at /)
    getting-started/    # introduction, installation, quick-start
    concepts/           # blocks & elements, modes, presets, definitions, behaviors
    guides/             # custom toolbox, codespace, preview, highlighting, …
    de/                 # German content, mirroring the same slugs (served at /de/)
astro.config.mjs        # Starlight config: sidebar, locales, env-driven title/social
```

## Content notes

- Pages that need config values (package name, links) are `.mdx` and import
  `src/config.ts`; plain prose pages stay `.md`.
- The sidebar is explicit in `astro.config.mjs`. An API Reference section is
  planned once the public API stabilises.
- The output is a plain static site, so any static host works. See
  [Deploy](#deploy) for the Docker route.

## Deploy

The site ships as a Docker image: a `bun` stage builds it, an `nginx` stage
serves the result. Two compose files, so the same image can be run with or
without a reverse proxy in front.

**Locally**, to check a change in the image that actually gets deployed:

```sh
docker compose up -d --build
open http://localhost:8081
```

**On the server**, behind an existing Traefik instance:

```sh
cp .env.example .env     # then edit, DEPLOY_DOMAIN in particular
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build
```

The second file adds only the Traefik router labels and the external `traefik`
network. It expects Traefik to be running already and attached to that
network. Traefik terminates TLS and forwards plain HTTP to the container, so
nginx listens on port 80 only and holds no certificate.

`DEPLOY_DOMAIN` is the one value that differs per deployment, along with
`HTTP_PROXY` and friends if the build host needs a proxy. Everything else
(image and container names, the loopback port, the entrypoint and network
names) is the same for every clone and is written directly in the compose
files.

Because the `PUBLIC_*` values are baked in at build time, changing any of them
means rebuilding: `docker compose … up -d --build` again.

## Translations (i18n)

English is the **root locale** (served at `/`, no prefix) and the fallback for
any untranslated page. German lives under `/de/`.

- **Page content** = parallel Markdown/MDX files, not JSON. A German page is
  `src/content/docs/de/<same-slug>` mirroring the English file. `.mdx` pages in
  `de/` import config from `../../../../config` (one level deeper than English).
- **Internal links inside a `de/` page** are written with the `/de/` prefix so
  navigation stays in-locale.
- **UI strings** (search, "On this page", nav) come from Starlight's built-in
  translations — no JSON needed for supported languages. The header language
  picker appears automatically.
- **Untranslated pages** auto-fall-back to English with a notice, so partial
  translation is safe.
- **Terminology:** product and Blockly terms stay in English — *Morphic
  Blocks, Morphic Elements, Modes, Views, Workspace, Codespace, Toolbox,
  Preset, Behavior, Blockly, shadow, placeholder* — only surrounding prose is
  translated.
- **First-visit routing:** an inline script on the English home
  (`src/pages/index.astro`) sends a German-preferring browser to `/de/` once,
  storing the choice in `localStorage` (`mb-docs-lang`) so it never overrides a
  manual pick.

**To add a language** (e.g. `fr`): add it to `locales` in `astro.config.mjs`,
add `translations: { fr: '…' }` to each sidebar group label, create
`src/content/docs/fr/…` pages, and add `src/pages/fr/index.astro`. Translate
what you can; the rest falls back to English.

German prose is machine-drafted — have a native/technical speaker review it
before it's treated as final.

## License

This repository is dual-licensed:

- **Site code** — Apache-2.0, see [LICENSE](LICENSE).
- **Documentation content** (the Markdown under `src/content/docs/`, English and
  German) — Creative Commons **CC BY 4.0**, see [LICENSE-docs](LICENSE-docs). You
  may reuse, translate, and adapt it with attribution.

© Gottfried Wilhelm Leibniz Universität Hannover. The "Morphic Blocks" name and
logo are trademarks and are not covered by these licenses.
