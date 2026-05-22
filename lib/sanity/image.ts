import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';
import { getSanityEnv } from './env';

export function urlFor(source: SanityImageSource) {
  const { dataset, projectId } = getSanityEnv();

  if (!projectId) {
    return null;
  }

  return imageUrlBuilder({ projectId, dataset }).image(source);
}