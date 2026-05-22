# Implementation Roadmap

## Phase 0 — Foundation (Current → Start)

**Goal:** Set up the project infrastructure before building features.

- [x] Fix TASK.md: correct "Nuxt.js" → "Next.js", "AuthO" → "Auth0"
- [ ] Set up Prettier and consistent formatting
- [ ] Self-host fonts (Kalam, Patrick Hand) via `next/font/google`
- [ ] Implement Tailwind design tokens from `DESIGN.md` (colors, shadows, fonts)
- [ ] Build core UI components following the hand-drawn design system:
  - Button, Card, Input, Badge
  - Header/Navigation (responsive, mobile hamburger menu)
  - Footer
  - ThemeToggle (dark/light)
- [ ] Set up `next-intl` with `[locale]` routing, middleware, and base translation files
- [ ] Set up `next-themes` for dark/light mode with cookie persistence
- [ ] Create shared layout (`app/[locale]/layout.tsx`) with nav + footer
- [ ] Add paper texture background and global design tokens to `globals.css`
- [ ] Set up Auth0 integration (`@auth0/nextjs-auth0`)
  - Configure Auth0 application (or use a hardcoded admin dummy for initial development)
  - Implement login/logout/callback API routes
  - Add auth middleware for protected routes
  - Create a temporary hardcoded admin user for development/testing
- [ ] Set up basic Auth0-protected admin area

**Deliverable:** Empty shell with navigation, i18n, theming, auth, and design system ready.

## Phase 1 — Content Migration

**Goal:** Migrate existing content into the new structure.

- [ ] Migrate homepage content from `app/page.tsx` into new section pages
- [ ] Create `/info/links` page with categorized link cards (hardcoded initially)
- [ ] Migrate Glücksrad to `/games/gluecksrad` with new design system
- [ ] Build homepage with hero, section teasers, and APOD widget placeholder
- [ ] Create placeholder pages for all main sections (News, Info, Games, Fun)
- [ ] Implement responsive navigation with all routes

**Deliverable:** All existing content accessible in the new structure.

## Phase 2 — CMS Integration (Sanity)

**Goal:** Move content management to Sanity.io (fresh project, set up from scratch).

- [ ] Create new Sanity.io project and configure studio
- [ ] Define schemas: BlogPost, LinkItem, GalleryImage, VideoEmbed
- [ ] Migrate link data from hardcoded pages into Sanity
- [ ] Implement GROQ queries in RSC for link listing
- [ ] Build blog listing page (`/news`) and post detail page (`/news/[slug]`)
- [ ] Configure ISR for content pages
- [ ] Add translation fields to Sanity schemas

**Deliverable:** Blog and links managed via Sanity CMS.

## Phase 3 — Live Data & APIs

**Goal:** Integrate external space APIs.

- [ ] Register for NASA API key
- [ ] Implement NASA APOD widget on homepage
- [ ] Build `/info/live` page with:
  - ISS Tracker (map-based or text)
  - Upcoming rocket launches
  - Near-Earth Objects (closest approach table)
- [ ] Server-side fetching with ISR caching
- [ ] Error handling and fallback UI for API failures

**Deliverable:** Live space data available on the info section.

## Phase 4 — Games

**Goal:** Build retro-style browser games.

- [ ] Create game framework (shared canvas/game loop, touch controls, score tracking)
- [ ] Implement Asteroids game
- [ ] Implement Moon Buggy game
- [ ] Implement Moon Lander game
- [ ] Add game instructions (i18n) and mobile touch controls
- [ ] Local highscore storage (localStorage, migrate to server when auth is ready)

**Deliverable:** Three playable games + migrated Glücksrad.

## Phase 5 — Dashboard & User Features

**Goal:** Build out user-facing dashboard features (Auth0 already set up in Phase 0).

- [ ] Build dashboard layout and pages:
  - Bookmarks
  - Highscores (personal + leaderboard)
  - User profile / settings
- [ ] Persist game highscores to server for logged-in users
- [ ] Implement bookmarking feature (save any page)
- [ ] Replace hardcoded admin dummy with full Auth0 user management
- [ ] Set up MySQL on Ionos VPS for user data storage (fresh database)
  - Schema for bookmarks, highscores, user uploads
  - Data access layer via Drizzle ORM or Prisma

**Deliverable:** Registered users can log in, save bookmarks, and track scores.

## Phase 6 — Fun Stuff & Gallery

**Goal:** Build the creative/community content sections.

- [ ] Build gallery page with image grid and lightbox
- [ ] Build video page with lazy-loaded embeds
- [ ] Add admin image uploads via Sanity
- [ ] Optional: user image uploads (if dashboard is ready)
- [ ] Moderation workflow for user-uploaded content

**Deliverable:** Gallery and video sections operational.

## Phase 7 — Polish & Launch

**Goal:** Production readiness.

- [ ] Performance audit (Lighthouse, Web Vitals)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO: meta tags, OpenGraph, structured data
- [ ] Error pages (404, 500) in design system
- [ ] Cookie consent (GDPR compliance)
- [ ] Security headers (CSP, HSTS)
- [ ] Set up deployment pipeline on Ionos VPS
- [ ] Domain configuration (www.ollis-astro-club.com)
- [ ] Monitoring and error tracking

**Deliverable:** Production-ready website.

## Future Ideas (Backlog)

- [ ] Microfrontend integration for closed-source components
- [ ] Push notifications for astronomical events
- [ ] PWA / offline mode for content pages
- [ ] Student account management (class groups)
- [ ] Telescope booking system for the club's telescope
- [ ] AI-generated astronomy quizzes
- [ ] Virtual planetarium (WebGL/Three.js)
- [ ] Night mode (red-filtered display for use while stargazing)
