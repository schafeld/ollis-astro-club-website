# This Nuxt web app is for the website www.ollis-astro-club.com – a fun and science website for all ages.

Audience:

This web app is a website about astronomy, space, and related subjects such as games, arts and crafts, and science fiction. It should be suitable for audiences from 3rd grade onward.

Tech Stack:

- Nuxt 4 with TypeScript
- Vue 3
- Tailwind CSS
- `@nuxtjs/i18n`
- `@nuxtjs/color-mode`
- Zod where useful
- Sanity.io as headless CMS
- Public APIs such as NASA APOD
- Optional future use of an Ionos MySQL server if needed later

Design:

- The logo `public/logo-astro-club-300x300.png` must be used.
- The design is inspired by handwriting and sketches; see `DESIGN.md`.
- The site must remain fully responsive and usable on slow mobile connections.
- Dark and light mode should be supported.

Architecture:

- The root application is Nuxt, not Next.js.
- Locale-prefixed routes such as `/de/news` and `/en/news` should be preserved.
- The project should remain flexible enough to integrate future closed-source components or external frameworks if needed.
- A basic dashboard exists as a placeholder for future registered-user features such as bookmarks, highscores, and uploads.

Content:

- Structure the content into Astro Club News, information, games, and fun.
- Keep Sanity-backed content for homepage/news/links/impressum working.
- Keep the NASA APOD page working.
- Preserve the wheel of fortune routes and the legacy `/zufallszahlen` route.

AI Task:

Maintain the planning documents in `/AI_DOCS` as living documentation for the current Nuxt version of the website. Keep them aligned with the actual deployed root app, not with the legacy Next.js reference app in `ollis-astro-club-next-js/`.

---

## Clarifications (May 2026)

1. **Framework:** The active website now uses **Nuxt 4** at the repository root.
2. **Legacy app:** The previous Next.js implementation has been moved to `ollis-astro-club-next-js/` and should be treated as reference code only.
3. **Sanity.io:** CMS integration is active in the Nuxt root app, but the schema source of truth still lives in the legacy Next subfolder.
4. **Deployment:** The production server now deploys the root Nuxt app and runs it via Nitro under PM2.
5. **Auth0:** Still planned, not fully wired in the active Nuxt app yet.
