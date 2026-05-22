# CLAUDE.md — Project Context for AI-Assisted Development

> This file provides context for Claude Code and other AI agents working on this codebase.

## Project Overview

**Ollis Astro Club** (`www.ollis-astro-club.com`) — A fun astronomy and space website for kids (3rd grade+) and all ages. Run as an astronomy club ("Astronomie AG") at Michaelschule in Groß Reken, Germany, by Oliver Schafeld.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **React:** 19.x with React Server Components
- **Styling:** Tailwind CSS 4 + hand-drawn design system (see `AI_DOCS/DESIGN.md`)
- **Auth:** Auth0 (integrated from the start; hardcoded admin dummy for initial dev)
- **CMS:** Sanity.io headless CMS — Studio in companion repo at `../../Sanity-cms/studio-ollis-astro-club`
- **Validation:** Zod (planned)
- **i18n:** German (primary) + English — language selection persisted
- **Hosting:** Ionos VPS with MySQL database (fresh, to be set up)

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run sync:studio  # Copy schemas → companion Sanity Studio repo
```

## Companion Repositories

This Next.js app works in tandem with a separate **Sanity Studio** repository:

- **Studio path:** `../../Sanity-cms/studio-ollis-astro-club` (relative to this repo)
- **Sanity Project ID:** `f18pduhr` | **Dataset:** `production`
- **VS Code Workspace:** Open `../../astro-club.code-workspace` to work in both repos simultaneously — this makes `@workspace` searches span both codebases

### Schema Ownership

Schemas are the **source of truth in this repo** (`lib/sanity/schemas/`) and are copied to the Studio's `schemaTypes/` folder. After changing any schema file, run:

```bash
npm run sync:studio   # Copies lib/sanity/schemas/*.ts → Studio schemaTypes/
```

### Adding New CMS Content Types

1. Create schema file in `lib/sanity/schemas/`
2. Export from `lib/sanity/schemas/index.ts`
3. Run `npm run sync:studio`
4. Update Studio's `schemaTypes/index.ts` to import and register the new type
5. Add GROQ query in `lib/sanity/queries.ts`
6. Create/update the Next.js page to fetch and render the content
7. Add i18n keys to `messages/de.json` and `messages/en.json` for static fallback

## Project Structure

```
app/                    # Next.js App Router pages and layouts
  layout.tsx            # Root layout (fonts, metadata)
  page.tsx              # Redirect to /de
  globals.css           # Global styles (Tailwind + design tokens)
  [locale]/             # i18n locale-aware routes
    layout.tsx          # Locale layout (nav, footer, providers)
    page.tsx            # Homepage
    news/               # Blog section
    info/               # Info section (links, live data)
    games/              # Games section
    fun/                # Fun section (gallery, videos)
    dashboard/          # Authenticated user area
  zufallszahlen/        # Legacy wheel of fortune (to migrate)
components/             # Shared React components
  ui/                   # Design system primitives (Button, Card, Badge…)
  layout/               # Header, Footer
  ThemeProvider.tsx     # Dark/light mode provider
lib/
  auth0.ts              # Auth0 v4 client instance (Auth0Client)
  auth/                 # Auth config helpers (roles, dev dummy)
  i18n/                 # next-intl routing & request config
messages/               # i18n translation files (de.json, en.json)
public/                 # Static assets (logo, SVGs)
AI_DOCS/                # Planning and design documentation
  TASK.md               # Project requirements and AI task description
  DESIGN.md             # Hand-drawn design system specification
  ARCHITECTURE.md       # Technical architecture decisions
  CONTENT_PLAN.md       # Content structure and route planning
  TECH_STACK.md         # Detailed tech stack decisions
  ROADMAP.md            # Phased implementation plan
  DEPLOYMENT.md         # Deployment & API key setup (incl. Ionos VPS)
  NOTES.md              # Human developer notes
```

## Architecture Principles

- **Bilingual:** All user-facing content must support German and English (i18n)
- **Mobile-first:** Responsive, usable on slow mobile connections
- **Microfrontend-ready:** Architecture should allow integrating other frameworks and closed-source components
- **Dark/light mode:** User preference persisted
- **Accessibility:** Age-appropriate, child-friendly UI
- **Performance:** Prefer React Server Components; minimize client-side JS

## Design System

The design follows a **hand-drawn/sketch aesthetic** — see `AI_DOCS/DESIGN.md` for full specification. Key points:
- Fonts: Kalam (headings), Patrick Hand (body)
- Wobbly borders with irregular border-radius
- Hard offset shadows (no blur)
- Paper texture backgrounds
- Colors: warm paper `#fdfbf7`, pencil black `#2d2d2d`, red accent `#ff4d4d`, blue accent `#2d5da1`

## Conventions

- **Language:** TypeScript strict mode
- **Components:** React Server Components by default; use `'use client'` only when needed
- **Styling:** Tailwind CSS utility classes + design tokens from `AI_DOCS/DESIGN.md`
- **File naming:** kebab-case for routes, PascalCase for components
- **i18n keys:** Use a flat namespace with dot notation (e.g., `nav.home`, `games.asteroids.title`)

## Auth0 v4 Setup

- Auth0 v4 SDK uses `Auth0Client` from `@auth0/nextjs-auth0/server` (no more `handleAuth()`)
- Client instance lives in `lib/auth0.ts`
- When Auth0 is configured, add `auth0.middleware()` to the middleware chain
- Auth routes are handled automatically at `/auth/login`, `/auth/logout`, `/auth/callback`
- Currently in dev mode with hardcoded admin dummy (see `lib/auth/config.ts`)

## Current State

Phase 0 (Foundation) is complete:
- Hand-drawn design system with Tailwind tokens
- i18n (de/en) with next-intl, locale-aware routing
- Dark/light mode with next-themes
- UI components: Button, Card, Badge, ThemeToggle, LanguageSwitcher
- Layout: Header (with mobile nav), Footer
- All placeholder pages created for planned routes
- Auth0 v4 SDK installed and configured (dev dummy mode)

Legacy pages to migrate:
- **Zufallszahlen** (`app/zufallszahlen/page.tsx`) → `/games/gluecksrad`

## Important Notes

- The logo at `public/logo-astro-club-300x300.png` must always be used
- Content is suitable for children — keep language and themes age-appropriate
- The site targets a German school audience primarily; English is secondary
- See `AI_DOCS/ROADMAP.md` for the planned implementation phases
