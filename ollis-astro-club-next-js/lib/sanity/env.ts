export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2025-03-01';

/**
 * Returns true when Sanity env vars are configured.
 * Pages use this to decide whether to fetch from Sanity or show static fallback content.
 */
export const isSanityConfigured = Boolean(projectId);
