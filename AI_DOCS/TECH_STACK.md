# Tech Stack — Current Nuxt Root App

## Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Nuxt** | 4.4.x | SSR app framework, routing, build, Nitro server |
| **Vue** | 3.5.x | UI layer and components |
| **TypeScript** | 5.x | Type safety |
| **Nitro** | 2.13.x | Production server runtime |

## Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.3.x | Utility styling |
| **@tailwindcss/vite** | 4.3.x | Tailwind integration in Nuxt/Vite |
| **Google Fonts import** | — | `Kalam` and `Patrick Hand` via `app/assets/fonts.css` |

The visual system still comes primarily from `app/globals.css` and the hand-drawn styles defined there.

## Internationalization

| Technology | Purpose |
|---|---|
| **@nuxtjs/i18n** | Translation integration |
| **vue-i18n** | Message formatting/runtime |

Current approach:

- explicit route tree under `app/pages/[locale]/**`
- Nuxt i18n in `no_prefix` mode
- translation files at `messages/de.json` and `messages/en.json`

## CMS / Content

| Technology | Purpose |
|---|---|
| **@sanity/client** | GROQ content fetches |
| **@sanity/image-url** | Sanity image URLs |
| **@portabletext/vue** | Portable Text rendering |

Nuxt uses a local Sanity layer:

- `lib/sanity/env.ts`
- `lib/sanity/client.ts`
- `lib/sanity/queries.ts`
- `lib/sanity/image.ts`

## Theme Handling

| Technology | Purpose |
|---|---|
| **@nuxtjs/color-mode** | Light/dark mode selection |

## External APIs

| API | Purpose |
|---|---|
| NASA APOD | Astronomy Picture of the Day for `/[locale]/info/live` |

## Validation / Utilities

| Technology | Purpose |
|---|---|
| **zod** | Validation utilities where needed |

## Root App Scripts

```bash
npm run dev
npm run build
npm run preview
npm run start
```

`npm run start` runs the built Nitro server using `node .output/server/index.mjs`.

## Repository Layout

```text
repo root/                  # deployed Nuxt app
ollis-astro-club-next-js/  # legacy Next.js reference app
```

The legacy Next app still contains:

- previous React implementation details
- old Storybook setup
- Sanity schema source under `ollis-astro-club-next-js/lib/sanity/schemas/`

## Environment Variables in Active Use

```dotenv
# Sanity
NUXT_PUBLIC_SANITY_PROJECT_ID=
NUXT_PUBLIC_SANITY_DATASET=
NUXT_PUBLIC_SANITY_API_VERSION=

# Compatibility aliases also supported
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=

# NASA
NASA_API_KEY=

# Optional site metadata / compatibility
NEXT_PUBLIC_SITE_URL=https://www.ollis-astro-club.com
```

## Not Yet Migrated to Nuxt Root

- Auth0 integration
- Vue Storybook
- Vue unit/component test suite
- Database-backed user features

Those still exist only as requirements or as legacy implementation context, not as active root-app capabilities.
