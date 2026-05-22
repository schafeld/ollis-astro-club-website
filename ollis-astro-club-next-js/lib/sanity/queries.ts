import { defineQuery } from 'next-sanity';

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------
export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage"][0]{
    "title": title[$locale],
    "subtitle": subtitle[$locale],
    "description": description[$locale]
  }
`);

// ---------------------------------------------------------------------------
// News posts — list (newest first, max 20)
// ---------------------------------------------------------------------------
export const NEWS_LIST_QUERY = defineQuery(`
  *[_type == "newsPost" && defined(slug.current)]
  | order(publishedAt desc)[0...20]{
    _id,
    "title": title[$locale],
    slug,
    publishedAt,
    "excerpt": excerpt[$locale],
    image
  }
`);

// ---------------------------------------------------------------------------
// Single news post by slug
// ---------------------------------------------------------------------------
export const NEWS_POST_QUERY = defineQuery(`
  *[_type == "newsPost" && slug.current == $slug][0]{
    _id,
    "title": title[$locale],
    slug,
    publishedAt,
    "excerpt": excerpt[$locale],
    "body": body[$locale],
    image,
    author
  }
`);

// ---------------------------------------------------------------------------
// Links — for info/links page, ordered by sortOrder then title
// ---------------------------------------------------------------------------
export const LINKS_QUERY = defineQuery(`
  *[_type == "link"] | order(sortOrder asc, title.de asc){
    _id,
    "title": title[$locale],
    url,
    "description": description[$locale],
    category,
    emoji
  }
`);

// ---------------------------------------------------------------------------
// Impressum (Legal Notice) — singleton
// ---------------------------------------------------------------------------
export const IMPRESSUM_QUERY = defineQuery(`
  *[_type == "impressum"][0]{
    "title": title[$locale],
    "body": body[$locale]
  }
`);
