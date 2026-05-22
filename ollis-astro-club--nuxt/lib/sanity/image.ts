import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';
import { useSanityEnv } from './env';

export function urlFor(source: SanityImageSource) {
  const { dataset, projectId } = useSanityEnv();

  if (!projectId) {
    return null;
  }

  return imageUrlBuilder({ projectId, dataset }).image(source);
}