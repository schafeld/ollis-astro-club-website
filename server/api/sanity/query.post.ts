import { createClient, type QueryParams } from '@sanity/client';
import { createError, readBody } from 'h3';
import { getSanityEnv } from '~~/lib/sanity/env';

interface SanityQueryRequest {
  query?: unknown;
  params?: QueryParams;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SanityQueryRequest>(event);

  if (typeof body?.query !== 'string' || body.query.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Sanity query',
    });
  }

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

  return client.fetch(body.query, body.params ?? {});
});