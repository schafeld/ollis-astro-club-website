/**
 * Reusable localizedBlock schema type for bilingual (de/en) rich text (Portable Text).
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const localizedBlock = defineType({
  name: 'localizedBlock',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    {
      name: 'de',
      title: '🇩🇪 Deutsch',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'en',
      title: '🇬🇧 English',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
  ],
});
