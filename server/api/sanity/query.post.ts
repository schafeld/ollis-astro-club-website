import { type QueryParams } from '@sanity/client';
import { createError, readBody } from 'h3';
import { fetchFromSanity } from '~~/lib/sanity/client';
import { SANITY_QUERIES, type SanityQueryId } from '~~/lib/sanity/queries';

interface SanityQueryRequest {
  queryId?: unknown;
  params?: QueryParams;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SanityQueryRequest>(event);

  // Only run queries from our allowlist — never an arbitrary GROQ string from the client.
  const query =
    typeof body?.queryId === 'string'
      ? SANITY_QUERIES[body.queryId as SanityQueryId]
      : undefined;

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unknown Sanity query',
    });
  }

  return fetchFromSanity(query, body.params ?? {});
});