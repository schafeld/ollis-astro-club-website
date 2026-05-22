import { createClient, type QueryParams } from 'next-sanity';
import { apiVersion, dataset, projectId, isSanityConfigured } from './env';

function getClient() {
  if (!isSanityConfigured) {
    throw new Error('Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID.');
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });
}

/**
 * Helper for fetching from Sanity with built-in caching via Next.js.
 * Uses time-based revalidation (default: 60s).
 * Returns null if Sanity is not configured.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  if (!isSanityConfigured) return null;

  return getClient().fetch(query, params, {
    next: {
      // Before (broken without webhook):
      // revalidate: tags.length ? false : revalidate,

      // After (time-based fallback, e.g. 60s):
      revalidate: revalidate,
      tags,
    },
  });
}
