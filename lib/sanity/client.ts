import { createClient, type QueryParams } from '@sanity/client';
import { useSanityEnv } from './env';

export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
}) {
  const { apiVersion, dataset, isSanityConfigured, projectId } = useSanityEnv();

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