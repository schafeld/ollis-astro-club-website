import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

function loadParentEnvFile(fileName: string) {
  const envPath = resolve(process.cwd(), '..', fileName);

  if (!existsSync(envPath)) {
    return;
  }

  const envContents = readFileSync(envPath, 'utf8');

  for (const line of envContents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    const normalizedValue = rawValue.replace(/^(['"])(.*)\1$/, '$2');
    process.env[key] = normalizedValue;
  }
}

loadParentEnvFile('.env.local');
loadParentEnvFile('.env');

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxtjs/color-mode'],
  css: ['./app/assets/fonts.css', '../app/globals.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    nasaApiKey: process.env.NASA_API_KEY ?? '',
    public: {
      sanityProjectId:
        process.env.NUXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
      sanityDataset:
        process.env.NUXT_PUBLIC_SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      sanityApiVersion:
        process.env.NUXT_PUBLIC_SANITY_API_VERSION ??
        process.env.NEXT_PUBLIC_SANITY_API_VERSION ??
        '2025-03-01',
    },
  },
  app: {
    head: {
      title: 'Ollis Astro Club – Astronomie AG an der Michaelschule in Gross Reken',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content:
            'Astronomie AG an der Michaelschule in Gross Reken mit Tipps fuer Sternenfreunde, Infos zu Teleskopen, Astronomie-Software und vielem mehr. Von Oliver Schafeld gegruendet und betrieben.',
        },
      ],
    },
  },
  colorMode: {
    classSuffix: '',
    fallback: 'light',
    preference: 'system',
  },
  i18n: {
    defaultLocale: 'de',
    strategy: 'no_prefix',
    locales: [
      { code: 'de', name: 'Deutsch' },
      { code: 'en', name: 'English' },
    ],
    detectBrowserLanguage: false,
    vueI18n: 'i18n.config.ts',
  },
})
