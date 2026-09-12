import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const basePath = process.env.BASE_PATH ?? '/';

const redirectsFile = fileURLToPath(new URL('./scripts/generated-tone-redirects.json', import.meta.url));
const toneRedirects = JSON.parse(readFileSync(redirectsFile, 'utf8'));

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://blog.kirishima.dev',
  base: basePath,
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/blog': '/writing/',
    ...toneRedirects,
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
