// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { loadEnv } from 'vite';

// The Astro config runs before `import.meta.env` exists, so read the same
// PUBLIC_* variables (see .env.example) via Vite. Pages/components read them
// through `src/config.ts` instead.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

/** Social links appear in the site header; unset variables are skipped. */
const social = [
	env.PUBLIC_LANDING_URL && { icon: 'external', label: 'Website', href: env.PUBLIC_LANDING_URL },
	env.PUBLIC_PLAYGROUND_URL && { icon: 'rocket', label: 'Playground', href: env.PUBLIC_PLAYGROUND_URL },
	env.PUBLIC_GITHUB_URL && { icon: 'github', label: 'GitHub', href: env.PUBLIC_GITHUB_URL },
	env.PUBLIC_NPM_URL && { icon: 'npm', label: 'npm', href: env.PUBLIC_NPM_URL },
].filter((entry) => typeof entry === 'object');

// https://astro.build/config
export default defineConfig({
	site: env.PUBLIC_SITE_URL || undefined,
	integrations: [
		starlight({
			title: env.PUBLIC_SITE_NAME || 'Docs',
			description: env.PUBLIC_SITE_DESCRIPTION || undefined,
			social,
			// Sidebar is auto-generated from src/content/docs/ for now; an
			// explicit sidebar arrives with the page structure.
		}),
	],
});
