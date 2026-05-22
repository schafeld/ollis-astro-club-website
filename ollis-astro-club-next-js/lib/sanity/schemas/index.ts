/**
 * Export all schema types for use in Sanity Studio's sanity.config.ts.
 *
 * In your Studio config:
 *   import { schemaTypes } from './schemas'
 *   schema: { types: schemaTypes }
 */
export { localizedString } from './localizedString';
export { localizedBlock } from './localizedBlock';
export { homepage } from './homepage';
export { newsPost } from './newsPost';
export { link } from './link';
export { impressum } from './impressum';

import { localizedString } from './localizedString';
import { localizedBlock } from './localizedBlock';
import { homepage } from './homepage';
import { newsPost } from './newsPost';
import { link } from './link';
import { impressum } from './impressum';

export const schemaTypes = [localizedString, localizedBlock, homepage, newsPost, link, impressum];
