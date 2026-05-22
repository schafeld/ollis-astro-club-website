export function useSanityEnv() {
  const config = useRuntimeConfig();

  const projectId = config.public.sanityProjectId ?? '';
  const dataset = config.public.sanityDataset ?? 'production';
  const apiVersion = config.public.sanityApiVersion ?? '2025-03-01';

  return {
    projectId,
    dataset,
    apiVersion,
    isSanityConfigured: Boolean(projectId),
  };
}