import { createClient, type QueryParams } from '@sanity/client';
import { getSanityEnv } from './env';

async function fetchFromSanity<T>(query: string, params: QueryParams = {}) {
  const { apiVersion, dataset, isSanityConfigured, projectId } = getSanityEnv();

  if (!isSanityConfigured) {
    return null;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

  return client.fetch<T>(query, params);
}

export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}) {
  if (import.meta.client) {
    return $fetch<T | null>('/api/sanity/query', {
      method: 'POST',
      body: {
        query,
        params,
      },
    });
  }

  return fetchFromSanity<T>(query, params);
}