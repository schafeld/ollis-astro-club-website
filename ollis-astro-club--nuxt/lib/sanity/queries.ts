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