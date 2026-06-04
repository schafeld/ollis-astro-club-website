export const HOMEPAGE_QUERY = `
  *[_type == "homepage"][0]{
    "title": title[$locale],
    "subtitle": subtitle[$locale],
    "description": description[$locale]
  }
`;

export const NEWS_LIST_QUERY = `
  *[_type == "newsPost" && defined(slug.current)]
  | order(publishedAt desc)[0...20]{
    _id,
    "title": title[$locale],
    slug,
    publishedAt,
    "excerpt": excerpt[$locale],
    image
  }
`;

export const NEWS_POST_QUERY = `
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
`;

export const LINKS_QUERY = `
  *[_type == "link"] | order(sortOrder asc, title.de asc){
    _id,
    "title": title[$locale],
    url,
    "description": description[$locale],
    category,
    emoji
  }
`;

export const IMPRESSUM_QUERY = `
  *[_type == "impressum"][0]{
    "title": title[$locale],
    "body": body[$locale]
  }
`;

/**
 * Allowlist of the only GROQ queries that may be executed on behalf of a client.
 * The public-facing `/api/sanity/query` endpoint and `sanityFetch` accept a
 * `queryId` from this map rather than a raw query string, so visitors can only
 * run queries we have explicitly shipped — not arbitrary GROQ against the dataset.
 */
export const SANITY_QUERIES = {
  homepage: HOMEPAGE_QUERY,
  newsList: NEWS_LIST_QUERY,
  newsPost: NEWS_POST_QUERY,
  links: LINKS_QUERY,
  impressum: IMPRESSUM_QUERY,
} as const;

export type SanityQueryId = keyof typeof SANITY_QUERIES;