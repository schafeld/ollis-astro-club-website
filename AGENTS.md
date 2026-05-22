# AGENTS.md

## Purpose

This repository root now contains the primary Nuxt 4 application for Ollis Astro Club. The old Next.js app lives in `ollis-astro-club-next-js/` and remains available as a behavioral reference during the final migration tail.

## Project Scope

- Framework: Nuxt 4 with Vue 3 and TypeScript
- Design system: hand-drawn styling loaded from `app/globals.css`
- i18n: German and English via `@nuxtjs/i18n`, with translations imported from `messages/de.json` and `messages/en.json`
- CMS: Sanity content fetched through the local `lib/sanity/*` layer
- Theme: `@nuxtjs/color-mode`

## Commands

- `npm install` installs the Nuxt app dependencies.
- `npm run dev` starts the Nuxt dev server.
- `npm run build` is the required validation command after any meaningful route or config change.
- `npm run start` serves the built Nuxt Nitro server and is the command used by PM2 in deployment.
- `npm run preview` runs the production output locally.

## Current Architecture

- App shell entry: `app/app.vue`
- Shared layout: `app/layouts/default.vue`
- Shared header/footer: `app/components/AppHeader.vue`, `app/components/AppFooter.vue`
- Locale routes: `app/pages/[locale]/**`
- Runtime config and Sanity env mapping: `lib/sanity/env.ts`
- Sanity client, queries, and image helper: `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `lib/sanity/image.ts`
- Portable Text renderer: `app/components/sanity/PortableTextRenderer.vue`

## Migration Rules

- Prefer implementing new work in this Nuxt app instead of the old Next.js app.
- Use the old Next.js pages in `ollis-astro-club-next-js/` only as the source of behavior, copy, and route shape.
- Preserve locale-prefixed routes such as `/de/news` and `/en/news`.
- Keep the separate Sanity Studio workflow unchanged. The schema source of truth for the old Next app still lives in `ollis-astro-club-next-js/lib/sanity/schemas/`.
- Translation JSON files are now local to the Nuxt root under `messages/`.
- Reuse the existing logo asset name: `/logo-astro-club-300x300.png`.

## Nuxt-Specific Notes

- In this app, `~` resolves inside the `app` source directory. Use `~~` when importing from project-root folders such as `lib/`.
- Locale-prefixed URLs are implemented by the manual `app/pages/[locale]/**` route tree. Keep `@nuxtjs/i18n` in `no_prefix` mode so it handles translations only and does not try to generate or redirect locale routes on top of the existing structure.
- Sanity runtime config accepts both Nuxt and legacy Next env names:
  - `NUXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NUXT_PUBLIC_SANITY_DATASET` or `NEXT_PUBLIC_SANITY_DATASET`
  - `NUXT_PUBLIC_SANITY_API_VERSION` or `NEXT_PUBLIC_SANITY_API_VERSION`
- Root `.env.local` is loaded directly by the Nuxt config so deployment and local development can keep using the repo-root env file.
- NASA APOD uses the server-only `NASA_API_KEY` runtime config entry.
- Content pages should use `useAsyncData()` with the local Sanity helpers instead of calling the client directly in templates.
- Rich text should render through `app/components/sanity/PortableTextRenderer.vue`.

## Validation Expectations

- After editing routes, layout, i18n config, or Sanity integration, run `npm run build`.
- Non-blocking sourcemap warnings from Nuxt and Tailwind are currently expected during builds.
- If a route references a static asset, ensure the asset exists in this app's `public/` directory.

## Current Migration Status

Already migrated:

- homepage
- news list
- news detail
- info landing page
- info links
- info live with NASA APOD
- impressum
- games landing page and game subroutes
- fun landing page and interactive wheel

Still pending or partial:

- dashboard/auth flow
- dashboard page is present, but auth is not wired yet
- Storybook migration to Vue
- Vue unit/component tests
- shared locale helper to reduce repeated page-level locale validation

## Agent Workflow Guidance

- Make small, validated slices. Add a route or helper, then run `npm run build` before broadening scope.
- Avoid changing the Next.js app unless the change is required to understand or mirror existing behavior.
- If you need the legacy app, work inside `ollis-astro-club-next-js/` explicitly instead of assuming the repo root is Next.js.
- Update this file when the architecture, commands, migration status, or validation expectations change.