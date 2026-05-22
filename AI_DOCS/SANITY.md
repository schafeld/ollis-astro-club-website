# Sanity.io CMS Integration

## Overview

The root Nuxt app uses Sanity as a headless CMS for localized content. The current integration is intentionally small and framework-native:

- `@sanity/client` for GROQ fetches
- `@sanity/image-url` for image URLs
- `@portabletext/vue` for rich text rendering

## Current Nuxt Integration

```text
Sanity Content Lake
    ↓ GROQ queries
Nuxt root app
    ├── lib/sanity/env.ts
    ├── lib/sanity/client.ts
    ├── lib/sanity/queries.ts
    ├── lib/sanity/image.ts
    └── app/components/sanity/PortableTextRenderer.vue
```

## Active CMS-backed Pages

- homepage
- `/[locale]/news`
- `/[locale]/news/[slug]`
- `/[locale]/info/links`
- `/[locale]/impressum`

## Query Strategy

Localized fields are selected through `$locale` in GROQ projections.

Example:

```groq
*[_type == "newsPost" && defined(slug.current)]
| order(publishedAt desc)[0...20]{
  _id,
  "title": title[$locale],
  slug,
  publishedAt,
  "excerpt": excerpt[$locale],
  image
}
```

The locale value comes from the route param in the page component.

## File Structure

```text
lib/sanity/
  env.ts
  client.ts
  queries.ts
  image.ts

app/components/sanity/
  PortableTextRenderer.vue
```

## Environment Variables

The Nuxt app accepts both Nuxt-native and legacy Next-style public env names:

```dotenv
NUXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NUXT_PUBLIC_SANITY_DATASET=production

# Optional
NUXT_PUBLIC_SANITY_API_VERSION=2025-03-01

# Compatibility aliases also work
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-03-01
```

The root `nuxt.config.ts` loads the root `.env.local` before creating runtime config, so these values work both locally and in production deploys.

## Fallback Behavior

If no Sanity project ID is configured, `sanityFetch()` returns `null` and the page-level code falls back to static or placeholder UI. This keeps the site usable even if CMS access is not configured.

## Schema Source of Truth

The root Nuxt app does not currently contain the Sanity schema files.

The schema source of truth still lives in the legacy Next.js subfolder:

```text
ollis-astro-club-next-js/lib/sanity/schemas/
```

That is still the directory to use when syncing schema files into the separate Sanity Studio repository.

## Current Document Types in Use

- `homepage`
- `newsPost`
- `link`
- `impressum`

These are queried by the root Nuxt app through `lib/sanity/queries.ts`.

## Images and Rich Text

- Sanity images are transformed with `lib/sanity/image.ts`
- Portable Text content is rendered through `app/components/sanity/PortableTextRenderer.vue`

## Operational Notes

- The currently configured production dataset contains live content for news and links.
- After the Nuxt root migration, CMS content appears correctly once the root `.env.local` contains the Sanity project ID and dataset.
- Public Sanity env vars are build-time values for the client bundle, so changes require rebuilding the app.

## Future Cleanup

Still worth doing later:

- move Sanity schemas into a Nuxt-owned location or a dedicated shared package
- add webhook-based revalidation if faster publish-to-site updates are needed
- add explicit response typing per query if the Sanity layer grows
