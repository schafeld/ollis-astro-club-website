# This Next.js web app is for the website www.ollis-astro-club.com – a fun and science website for all ages.

Audience:

This web app is meant to be a website about astronomy, space and related subjects (e.g. games, arts and crafts, science fiction). It is to be suitable for audiences from 3rd grade onwards.

Tech Stack:

- Next.js with Typescript
- Auth0
- TailwindCSS
- Zod
- React Server Components
- REST APIs (GraphQL if applicable)
- i18n (German and English – selection should be persisted)
- Ready to use Sanity.io as headless CMS
- If required this project can make use of a Ionos MySQL server (project is hosted as Ionos VPS)

Design:

- The logo public/logo-astro-club-300x300.png must be used.
- The design is inspired by handwriting/sketches – see the detailled prompt at DESIGN.md
- Fully responsive design must be usable on slow mobile connections too
- dark/light mode (selection should be persisted)

Architecture:

- The project should be able to integrate closed source components
- The project shold be able to integrate other frameworks
Probably a microfrontend architecture and/or monorepo should be feasible
- A basic dashboard should be provided for registered users who will be able to bookmark pages, save highscores, upload user images etc. (to be defined/extended later)

Content:

- Take the already available content from `app/page.tsx` and the wheel of fortune feature from `app/zufallszahlen/page.tsx` and integrate them as separate menu items/ routes.
- The content should be structured in Astro Club News (a blog), information (astronomy information, link lists, maybe live information through public APIs from NASA or ESA), games (simple retro style javascript games like asteroids, moon buggy, or moon lander; mobile friendly), fun stuff (images and videos of cardboard UFOs, robots, aliens, astronauts etc.)

**AI Task:**
Create planning documents to outline this website's concept in the folder `/AI_DOCS` (create a separate `CLAUDE.md` in the root folder if that is a best practice for Claude Code agentic development). Create documents that will serve as context for future development with generative/agentic AI and as documentation for users and developers.

---

## Clarifications (March 2026)

1. **Framework:** The project uses **Next.js** (keep project at latest long term stable version as dependencies allow)
2. **Auth0:** Integrate from the start of development. Begin with a single hardcoded admin dummy user for testing before full Auth0 setup.
3. **Sanity.io:** Fresh start — no existing Sanity project. Will be set up from scratch.
4. **MySQL (Ionos):** Fresh start — no existing database or schema. Will be created as needed.
5. **Closed-source components:** General architecture requirement for the future. No specific proprietary components planned at this time. The architecture should simply be extensible enough to allow it later.
