import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://esolarcantabria.es',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (pagina) => !pagina.includes('/gracias/') })],
  server: { host: true },
});
