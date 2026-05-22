# Sanity.io CMS Integration

## Overview

This project uses [Sanity.io](https://www.sanity.io/) as a headless CMS for managing bilingual (German/English) content. The integration uses:

- **[next-sanity](https://github.com/sanity-io/next-sanity)** — official Sanity toolkit for Next.js
- **[@sanity/image-url](https://www.sanity.io/docs/apis-and-sdks/image-urls)** — image URL builder
- **GROQ** — Sanity's query language for fetching content
- **Portable Text** — rich text format rendered via `next-sanity`

## Architecture

```
Sanity Studio (separate project or hosted)
    ↓ Content Lake (cloud)
    ↓ GROQ queries via next-sanity client
Next.js App (this project)
    ├── lib/sanity/          ← Client, queries, schemas, image helper
    ├── components/sanity/   ← Portable Text renderer
    └── app/[locale]/        ← Pages fetch from Sanity with i18n fallback
```

### Bilingual Strategy

Each document in Sanity stores content in **both languages** using custom `localizedString` and `localizedBlock` schema types:

```
title: {
  de: "Willkommen bei Ollis Astro Club!",
  en: "Welcome to Olli's Astro Club!"
}
```

GROQ queries select the correct language dynamically:
```groq
*[_type == "homepage"][0]{
  "title": title[$locale],
  "subtitle": subtitle[$locale]
}
```

The `$locale` parameter ("de" or "en") is passed from the Next.js page.

### Fallback Behavior

When Sanity is **not configured** (no `NEXT_PUBLIC_SANITY_PROJECT_ID` env var), all pages fall back to static content from `messages/de.json` and `messages/en.json` via `next-intl`. This means:

- The site works without Sanity during development
- Zero downtime if Sanity is temporarily unavailable
- Gradual migration — add CMS content at your own pace

## File Structure

```
lib/sanity/
  env.ts              # Environment variables + isSanityConfigured flag
  client.ts           # Sanity client + sanityFetch() helper with caching
  queries.ts          # All GROQ queries (homepage, news, links)
  image.ts            # Image URL builder helper
  schemas/            # Schema definitions (copy to Sanity Studio)
    index.ts          # All schema exports
    localizedString.ts
    localizedBlock.ts
    homepage.ts
    newsPost.ts
    link.ts

components/sanity/
  PortableTextRenderer.tsx   # Portable Text → React component

app/[locale]/
  page.tsx                # Homepage — fetches hero content from CMS
  news/
    page.tsx              # News list — fetches posts from CMS
    [slug]/page.tsx       # Single news post with rich text body
  info/links/
    page.tsx              # Links & Tips — fetches links from CMS
```

## Environment Variables

Add these to `.env.local`:

```bash
# Required for Sanity integration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional — override API version (default: 2025-03-01)
# NEXT_PUBLIC_SANITY_API_VERSION=2025-03-01
```

The project ID and dataset are **not secrets** — they are safe to expose in `NEXT_PUBLIC_` vars.

For **server-side** operations (mutations, tokens), refer to the existing `SANITY_API_TOKEN` in `AI_DOCS/DEPLOYMENT.md`.

## Content Types

### 1. Homepage (singleton)

| Field | Type | Description |
|-------|------|-------------|
| `title` | localizedString | Main heading ("Ollis Astro Club") |
| `subtitle` | localizedString | Subtitle ("Tipps für Sternenfreunde") |
| `description` | localizedString | Description paragraph |

**Only one Homepage document should exist.** The query fetches `*[_type == "homepage"][0]`.

### 2. News Post

| Field | Type | Description |
|-------|------|-------------|
| `title` | localizedString | Post title |
| `slug` | slug | URL-friendly identifier (auto-generated from German title) |
| `publishedAt` | datetime | Publication date |
| `author` | string | Author name (default: "Olli") |
| `image` | image | Cover image with hotspot cropping |
| `excerpt` | localizedString | Short summary for the list view |
| `body` | localizedBlock | Full article body (rich text with images) |

Posts appear at `/{locale}/news` (list) and `/{locale}/news/{slug}` (detail).

### 3. Link

| Field | Type | Description |
|-------|------|-------------|
| `title` | localizedString | Link display name |
| `url` | url | Target URL |
| `description` | localizedString | Short description |
| `category` | string | One of: website, app, youtube, book, tool, learning |
| `emoji` | string | Emoji icon shown next to the link |
| `sortOrder` | number | Lower numbers appear first (default: 100) |

Links appear at `/{locale}/info/links`.

---

## Setting Up Sanity Studio

### Step 1: Create a Sanity Project

If you don't have a Sanity project yet:

```bash
# In a SEPARATE directory (not inside this Next.js project)
npm create sanity@latest -- \
  --dataset production \
  --template clean \
  --typescript \
  --output-path studio-astro-club
```

Follow the prompts:
1. Log in or create a free Sanity account
2. Choose "Create new project"
3. Name it "Astro Club"
4. Select "production" dataset

This gives you a **Project ID** — note it down.

### Step 2: Add Schema Files (Required!)

> **Important:** Without this step the Studio will show **"No document types"** and you won't see any content types in the sidebar.

> **Schema source of truth:** Schemas live in this Next.js repo under `lib/sanity/schemas/`. Use `npm run sync:studio` whenever you update them.

Use the sync script to copy all schema files to the Studio automatically:

```bash
# From the Next.js project root
npm run sync:studio
```

Or copy manually if preferred:

```bash
cp lib/sanity/schemas/localizedString.ts \
   lib/sanity/schemas/localizedBlock.ts \
   lib/sanity/schemas/homepage.ts \
   lib/sanity/schemas/newsPost.ts \
   lib/sanity/schemas/link.ts \
   ../../Sanity-cms/studio-ollis-astro-club/schemaTypes/
```

Then **replace** the Studio's schema index. Edit `schemaTypes/index.ts` (the default file contains an empty array):

```typescript
import { localizedString } from './localizedString'
import { localizedBlock } from './localizedBlock'
import { homepage } from './homepage'
import { newsPost } from './newsPost'
import { link } from './link'

export const schemaTypes = [
  localizedString,
  localizedBlock,
  homepage,
  newsPost,
  link,
]
```

### Step 3: Configure the Next.js App

Add your Sanity Project ID to the Next.js environment:

```bash
# In this Next.js project's .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 4: Add CORS Origin

Sanity needs to allow requests from your development and production URLs. In
your Sanity Studio or via the CLI:

```bash
# In the Studio project directory
npx sanity cors add http://localhost:3000
npx sanity cors add https://www.ollis-astro-club.com
```

Or manage CORS in the Sanity dashboard at https://www.sanity.io/manage → Your Project → API → CORS origins.

### Step 5: Run the Studio

```bash
# In the Studio project directory
npm run dev
```

Open http://localhost:3333 to access Sanity Studio.

---

## Managing Content in Sanity Studio

### Creating Homepage Content

1. Open Sanity Studio (http://localhost:3333)
2. Click **Homepage** in the left sidebar
3. Click **+ Create** (or edit the existing document)
4. Fill in the fields:
   - **Title** → 🇩🇪 "Ollis Astro Club" / 🇬🇧 "Olli's Astro Club"
   - **Subtitle** → 🇩🇪 "Tipps für Sternenfreunde" / 🇬🇧 "Tips for Stargazers"
   - **Description** → 🇩🇪 "Astronomie AG an der Michaelschule..." / 🇬🇧 "Astronomy Club at Michaelschule..."
5. Click **Publish**

> **Tip:** You only need ONE homepage document. If the English field is left empty, the German text is used as fallback (handled in the page code).

### Writing a News Post

1. Click **News Post** in the sidebar → **+ Create**
2. Fill in:
   - **Title**: 🇩🇪 + 🇬🇧 (bilingual)
   - **Slug**: Click "Generate" to auto-create from the German title
   - **Published At**: Defaults to now, adjust if needed
   - **Author**: Defaults to "Olli"
   - **Cover Image**: Upload a photo (optional)
   - **Excerpt**: Short summary for the news list
   - **Body**: Write the full article using rich text
     - You can add **bold**, *italic*, headings, links, and images
     - Fill in both 🇩🇪 Deutsch and 🇬🇧 English tabs
3. Click **Publish**

The post immediately appears on the website (after the cache revalidation period, default 60 seconds).

### Adding Links & Tips

1. Click **Link** in the sidebar → **+ Create**
2. Fill in:
   - **Title**: 🇩🇪 + 🇬🇧
   - **URL**: Full URL (e.g., `https://stellarium-web.org/`)
   - **Description**: 🇩🇪 + 🇬🇧 short description
   - **Category**: Select from dropdown (Website, App, YouTube, etc.)
   - **Emoji**: Pick a fitting emoji (🔭 🌍 🚀 ⭐ etc.)
   - **Sort Order**: Lower = higher on the page (e.g., 10, 20, 30...)
3. Click **Publish**

### Content Tips

- **Images**: Use JPEG or PNG. Sanity handles resizing automatically. Enable the hotspot feature to control how images are cropped.
- **Rich Text**: The body field supports headings (H2, H3), bold, italic, links, numbered/bullet lists, and inline images.
- **English optional**: If you skip the English translation, the site falls back to showing the German content.
- **Unpublish**: To remove content from the site, click the arrow next to "Publish" → "Unpublish".

---

## Caching & Revalidation

Content is cached by Next.js with **time-based revalidation** (default: 60 seconds). After editing content in Sanity Studio, changes appear on the live site within ~1 minute.

To change the revalidation period, edit the `revalidate` parameter in `lib/sanity/client.ts`:

```typescript
// Default: 60 seconds
revalidate = 60
```

For production, you might increase this to 300 (5 minutes) or 3600 (1 hour) for less frequently updated content.

### Webhook-based Revalidation (Advanced)

For instant updates, set up a GROQ webhook in Sanity that calls a Next.js API route:

1. Add `SANITY_REVALIDATE_SECRET` to `.env.local`
2. Create an API route at `app/api/revalidate/route.ts`
3. Configure a webhook in https://www.sanity.io/manage → Webhooks

See the [next-sanity README](https://github.com/sanity-io/next-sanity#tag-based-revalidation) for detailed instructions.

---

## GROQ Query Reference

Queries live in `lib/sanity/queries.ts`. Key patterns:

```groq
# Fetch localized content (locale = "de" or "en")
"title": title[$locale]

# Filter by type
*[_type == "newsPost"]

# Sort by date
| order(publishedAt desc)

# Limit results
[0...20]

# Filter by slug parameter
&& slug.current == $slug
```

Test queries interactively:
- **Sanity Vision** plugin in the Studio (install via `npm i @sanity/vision` in Studio project)
- **GROQ Playground** at https://groq.dev

---

## Deploying Sanity Studio

### Option A: Sanity-hosted (Recommended)

```bash
# In the Studio project directory
npx sanity deploy
```

This deploys to `https://your-project.sanity.studio`.

### Option B: Embedded in Next.js

You can embed the Studio as a route in this Next.js app (e.g., `/studio`). See the [next-sanity embedded Studio docs](https://github.com/sanity-io/next-sanity#embedded-sanity-studio). This is more complex and not recommended for the initial setup.

---

## Extending the CMS

To add new content types:

1. Create a new schema file in `lib/sanity/schemas/`
2. Add it to `lib/sanity/schemas/index.ts`
3. Copy the schema to the Sanity Studio project
4. Add GROQ queries in `lib/sanity/queries.ts`
5. Update the relevant page to fetch and render the new content

Planned future content types:
- **Gallery Image** — for the Fun > Gallery page
- **Game** — metadata for each game (description, instructions)
- **Site Settings** — global settings (site title, social links)
