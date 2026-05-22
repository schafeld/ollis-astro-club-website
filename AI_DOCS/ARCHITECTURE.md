# Architecture

## Overview

Olli's Astro Club now runs as a Nuxt 4 application at the repository root. The architecture uses Vue 3, TypeScript, server-rendered content pages, manual locale-prefixed routes, and a small Sanity integration layer for CMS-backed content.

The old Next.js implementation is still present in `ollis-astro-club-next-js/` as a behavioral reference and as the current schema source of truth for Sanity Studio sync.

## Current Application Shape

```text
Repo Root (Nuxt 4 app)
├── app/
│   ├── app.vue
│   ├── layouts/default.vue
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── FortuneWheel.vue
│   │   └── sanity/PortableTextRenderer.vue
│   └── pages/
│       ├── [locale]/...
│       └── zufallszahlen.vue
├── i18n/i18n.config.ts
├── lib/
│   ├── nasa/apod.ts
│   └── sanity/{client,env,image,queries}.ts
├── messages/{de,en}.json
├── public/
└── nuxt.config.ts

Legacy reference app
└── ollis-astro-club-next-js/
```

## Route Architecture

Locale-prefixed URLs are implemented explicitly in the file system:

```text
app/pages/[locale]/
  index.vue
  news/
    index.vue
    [slug].vue
  info/
    index.vue
    links.vue
    live.vue
  games/
    index.vue
    asteroids.vue
    moon-buggy.vue
    moon-lander.vue
    gluecksrad.vue
  fun/
    index.vue
    gallery.vue
    videos.vue
    gluecksrad.vue
  impressum.vue
  dashboard.vue

app/pages/
  zufallszahlen.vue
```

`@nuxtjs/i18n` is used for translations only. It stays in `no_prefix` mode so it does not generate its own locale routing on top of the manual `[locale]` tree.

## Rendering Strategy

- Content pages use `useAsyncData()` and server-side fetches.
- Sanity-backed pages fetch through the local `lib/sanity/*` helpers.
- Rich text is rendered through `app/components/sanity/PortableTextRenderer.vue`.
- Highly interactive UI, such as the wheel, stays in dedicated Vue components.

## Shared Shell

- `app/app.vue` provides the Nuxt shell.
- `app/layouts/default.vue` wraps all main pages.
- `app/components/AppHeader.vue` owns navigation, locale switching, and theme toggle.
- `app/components/AppFooter.vue` provides the shared footer.

The design system is driven by `app/globals.css` plus the imported Google font definitions in `app/assets/fonts.css`.

## Content Sources

### Local translations

- `messages/de.json`
- `messages/en.json`

These provide UI copy and fallback content.

### Sanity CMS

The live app queries Sanity via:

- `lib/sanity/env.ts`
- `lib/sanity/client.ts`
- `lib/sanity/queries.ts`
- `lib/sanity/image.ts`

Current CMS-backed surfaces:

- homepage
- news list
- news detail
- info links
- impressum

### External APIs

- NASA APOD via `lib/nasa/apod.ts`

If `NASA_API_KEY` is missing, the APOD helper falls back to NASA's `DEMO_KEY` for development.

## Environment Loading

The root `nuxt.config.ts` loads `.env.local` and `.env` from the repository root before building `runtimeConfig`. This is required because public Sanity configuration and NASA configuration are injected into the build.

Supported public Sanity env names:

- `NUXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NUXT_PUBLIC_SANITY_DATASET` or `NEXT_PUBLIC_SANITY_DATASET`
- `NUXT_PUBLIC_SANITY_API_VERSION` or `NEXT_PUBLIC_SANITY_API_VERSION`

## Legacy Next.js Subfolder

The directory `ollis-astro-club-next-js/` is no longer the deployed site. It remains useful for:

- comparing unfinished Vue routes with their old React behavior
- preserving Storybook and old React tests until a Vue replacement exists
- keeping the Sanity schema source of truth under `ollis-astro-club-next-js/lib/sanity/schemas/`

## Current Gaps

- Auth0 is not wired in the Nuxt root app yet.
- Dashboard is a placeholder page only.
- Storybook has not been migrated to Vue.
- Vue unit/component tests are not set up yet.
- A shared locale validation helper could reduce repeated page-level checks.
