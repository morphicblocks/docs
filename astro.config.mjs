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
			// PLACEHOLDER logo — swap src/assets/logo.svg for the real mark.
			logo: { src: './src/assets/logo.svg', alt: env.PUBLIC_SITE_NAME || '' },
			customCss: ['./src/styles/custom.css'],
			social,
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ slug: 'getting-started/introduction' },
						{ slug: 'getting-started/installation' },
						{ slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ slug: 'concepts/blocks-and-elements' },
						{ slug: 'concepts/modes' },
						{ slug: 'concepts/presets-and-views' },
						{ slug: 'concepts/definitions-format' },
						{ slug: 'concepts/behaviors-and-codegen' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ slug: 'guides/custom-toolbox', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/codespace', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/preview-and-code-editor', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/syntax-highlighting', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/selection-sync', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/toolbars', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/styling-modes', badge: { text: 'Soon', variant: 'caution' } },
						{ slug: 'guides/saving-and-loading', badge: { text: 'Soon', variant: 'caution' } },
					],
				},
				// An API Reference section will slot in here once the public
				// API stabilises.
			],
		}),
	],
});
