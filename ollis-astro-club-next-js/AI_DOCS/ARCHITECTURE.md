# Architecture

## Overview

Olli's Astro Club is a Next.js 16 application using the App Router with React Server Components. The architecture prioritizes performance on slow mobile connections, i18n support, and extensibility for microfrontend integration.

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App Router               │
│  ┌───────────┐  ┌───────────┐  ┌────────────────┐   │
│  │   Pages   │  │  Layouts  │  │  Middleware    │   │
│  │  (RSC)    │  │  (RSC)    │  │  (i18n, auth)  │   │
│  └─────┬─────┘  └─────┬─────┘  └────────────────┘   │
│        │              │                             │
│  ┌─────▼──────────────▼─────┐                       │
│  │   Shared Components      │                       │
│  │  (UI kit, layout prims)  │                       │
│  └─────┬────────────┬───────┘                       │
│        │            │                               │
│  ┌─────▼─────┐ ┌────▼──────┐                        │
│  │  Sanity   │ │  External │                        │
│  │  CMS      │ │  APIs     │                        │
│  │  (GROQ)   │ │  (NASA,   │                        │
│  └───────────┘ │   ESA)    │                        │
│                └───────────┘                        │
└─────────────────────────────────────────────────────┘
```

## Directory Structure (Target)

```
app/
  [locale]/                  # i18n: /de/... and /en/...
    layout.tsx               # Locale-aware root layout
    page.tsx                 # Homepage
    news/                    # Ollis Astro Club News (blog)
      page.tsx               # Blog listing
      [slug]/page.tsx        # Individual blog post
    info/                    # Information section
      page.tsx               # Astronomy info hub
      links/page.tsx         # Curated link lists
      live/page.tsx          # Live data (NASA/ESA APIs)
    games/                   # Games section
      page.tsx               # Games hub
      asteroids/page.tsx     # Asteroids game
      moon-buggy/page.tsx    # Moon Buggy game
      moon-lander/page.tsx   # Moon Lander game
      gluecksrad/page.tsx    # Wheel of Fortune (migrated)
    fun/                     # Fun stuff section
      page.tsx               # Fun hub
      gallery/page.tsx       # Images of cardboard crafts
      videos/page.tsx        # Videos
    dashboard/               # Authenticated user area
      page.tsx               # User dashboard
      bookmarks/page.tsx
      highscores/page.tsx
  api/                       # API routes
    auth/[...auth0]/route.ts # Auth0 callback routes
components/
  ui/                        # Reusable UI components (design system)
    Button.tsx
    Card.tsx
    Navigation.tsx
    ThemeToggle.tsx
    LanguageSwitcher.tsx
  layout/                    # Layout components
    Header.tsx
    Footer.tsx
    Sidebar.tsx
  games/                     # Game-specific components
  content/                   # Content display components
lib/
  sanity/                    # Sanity client, queries, types
  auth/                      # Auth0 configuration
  i18n/                      # Internationalization utilities
  api/                       # External API clients (NASA, ESA)
  db/                        # Database access (if MySQL needed)
messages/                    # i18n translation files
  de.json
  en.json
public/
  fonts/                     # Kalam, Patrick Hand (self-hosted)
  images/
```

## Key Architectural Decisions

### 1. React Server Components First

All pages and layouts are RSC by default. Client components (`'use client'`) only for:
- Interactive games
- Theme/language toggle
- Animated components (e.g., wheel of fortune)
- Dashboard features requiring client state

### 2. i18n Strategy

Use `next-intl` with the `[locale]` route segment approach:
- German (`/de/...`) is the default locale
- English (`/en/...`) is the secondary locale
- Locale preference stored in a cookie
- Middleware handles locale detection and redirects
- Translation files in `messages/de.json` and `messages/en.json`

### 3. CMS Integration (Sanity.io)

- Blog posts, info articles, and curated link lists are managed in Sanity
- Use GROQ queries with the Sanity client in RSC (no client-side fetching for content)
- Static generation with ISR (Incremental Static Regeneration) for content pages
- Schema types: BlogPost, InfoArticle, LinkList, GameMeta

### 4. Authentication (Auth0) — From Day One

Auth0 is integrated from the start of development, not deferred.

- Auth0 SDK for Next.js (`@auth0/nextjs-auth0`)
- **Initial setup:** hardcoded admin dummy user for development/testing before full Auth0 tenant configuration
- Protected routes: `/[locale]/dashboard/**`
- Public routes: everything else
- Roles: `admin` (content management, initially the hardcoded dummy) and `user` (registered members)
- User data stored in Auth0 + MySQL (fresh database on Ionos VPS) for app-specific data (bookmarks, highscores)

### 5. Theming (Dark/Light Mode)

- CSS custom properties for theme tokens
- `next-themes` or custom implementation with cookie persistence
- The hand-drawn design system (DESIGN.md) currently defines light mode only
- Dark mode needs adapted color palette (dark paper, light pencil strokes)

### 6. Microfrontend Readiness

General architecture requirement for the future — no specific closed-source components are planned at this time. The architecture should be extensible enough to integrate them later.

To allow future integration of other frameworks or closed-source components:
- Use Next.js Module Federation or iframe-based embedding as needed
- Component boundaries are well-defined with clear data contracts
- Shared state via URL params or a lightweight event bus (not a global store)
- Games could be standalone bundles loaded dynamically

### 7. Performance Strategy

- Self-host fonts (Patrick Hand) to avoid external CDN dependency
- Use `next/image` for all images with appropriate sizing
- Lazy-load games and heavy interactive content
- Minimal client-side JavaScript for content pages
- Consider service worker for offline access to static content

### 8. Database (Optional MySQL on Ionos)

Only used if Auth0 user metadata is insufficient for:
- Storing user bookmarks
- Game highscores (leaderboard)
- Uploaded user images
- Access via a data access layer in `lib/db/`, not directly from components

## External API Integrations

| API | Purpose | Caching Strategy |
|-----|---------|-----------------|
| Sanity.io | Blog posts, articles, links | ISR (revalidate ~60s) |
| NASA APOD | Astronomy Picture of the Day | ISR (revalidate ~3600s) |
| ESA feeds | Space news | ISR (revalidate ~3600s) |
| Auth0 | Authentication | Session-based |

## Security Considerations

- All external links use `rel="noreferrer"` (already in existing code)
- Auth0 handles authentication; no custom auth logic
- API keys stored in environment variables, never committed
- Sanity content is read-only from the frontend
- User uploads validated and sanitized server-side
- CSRF protection via Auth0 session handling
- Content Security Policy headers for game content
