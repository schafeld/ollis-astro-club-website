# Tech Stack — Detailed Decisions

## Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x | App Router, RSC, SSR/SSG, API routes |
| **React** | 19.x | UI components, Server Components |
| **TypeScript** | 5.x | Type safety |

> **Note:** The TASK.md originally mentions "Nuxt.js" but the project is built with **Next.js**. This document reflects the actual stack.

## Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Google Fonts** (self-hosted) | — | Kalam + Patrick Hand (hand-drawn design) |

### Tailwind Configuration

Custom design tokens to add (aligned with `DESIGN.md`):
- Colors: `paper`, `pencil`, `muted`, `accent`, `accent-blue`
- Border-radius: `wobbly`, `wobbly-md` (via custom plugin or inline styles)
- Shadows: `sketch`, `sketch-lg` (hard offset, no blur)
- Fonts: `heading` (Kalam), `body` (Patrick Hand)

## Authentication

| Technology | Purpose |
|---|---|
| **Auth0** (`@auth0/nextjs-auth0`) | User authentication, session management |

- Social logins + email/password
- Role-based access: `user` (default), `admin` (content management)
- Session stored in encrypted cookies
- Protected API routes and dashboard pages

## CMS

| Technology | Purpose |
|---|---|
| **Sanity.io** (`next-sanity`, `@sanity/image-url`) | Headless CMS for blog, links, gallery |

- Sanity Studio deployed separately (or embedded at `/studio` route)
- Content types: BlogPost, LinkItem, GalleryImage, VideoEmbed, GameMeta
- Localized fields for German + English
- GROQ queries in RSC (server-side only)
- Image CDN via Sanity's image pipeline

## Internationalization

| Technology | Purpose |
|---|---|
| **next-intl** | i18n routing, message formatting, locale detection |

- Route-based: `/de/...` and `/en/...`
- Middleware for locale detection (Accept-Language header → cookie → default)
- Message files: `messages/de.json`, `messages/en.json`
- Sanity content: localized fields with German as primary

## Validation

| Technology | Purpose |
|---|---|
| **Zod** | Schema validation for forms, API inputs, env vars |

- Form validation (contact forms, user settings)
- API request/response validation
- Environment variable validation at build time
- Sanity response type narrowing

## Database (Optional)

| Technology | Purpose |
|---|---|
| **MySQL** (Ionos VPS) | User data beyond Auth0 profile |

- Only introduced when needed (bookmarks, highscores, uploads)
- Access via Drizzle ORM or Prisma (TBD)
- Migrations managed via ORM tooling
- Connection pooling for serverless compatibility

## External APIs

| API | URL | Purpose | Auth |
|---|---|---|---|
| NASA APOD | `api.nasa.gov/planetary/apod` | Astronomy Picture of the Day | API key (free) |
| NASA NeoWs | `api.nasa.gov/neo/rest/v1/feed` | Near-Earth Objects | API key (free) |
| Open Notify | `api.open-notify.org/iss-now.json` | ISS position | None |
| Launch Library 2 | `ll.thespacedevs.com/2.2.0/launch/upcoming` | Upcoming launches | None (rate-limited) |
| ESA RSS | `esa.int/rssfeed/*` | ESA news | None |

## Development Tools

| Tool | Purpose |
|---|---|
| **ESLint** (9.x + `eslint-config-next`) | Linting |
| **Prettier** (to add) | Code formatting |
| **PostCSS** | Tailwind CSS processing |

## Dependencies to Add (Planned)

```
# Core
npm install next-intl next-themes zod

# Auth
npm install @auth0/nextjs-auth0

# CMS
npm install next-sanity @sanity/image-url

# Fonts (self-hosted via next/font)
# Kalam and Patrick Hand loaded via next/font/google

# Database (when needed)
npm install drizzle-orm mysql2
npm install -D drizzle-kit

# Development
npm install -D prettier eslint-config-prettier
```

## Environment Variables (Required)

```bash
# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# NASA
NASA_API_KEY=

# Database (optional)
DATABASE_URL=

# App
NEXT_PUBLIC_SITE_URL=https://www.ollis-astro-club.com
```
