/**
 * Reusable localizedString schema type for bilingual (de/en) string fields.
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    {
      name: 'de',
      title: '🇩🇪 Deutsch',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'en',
      title: '🇬🇧 English',
      type: 'string',
    },
  ],
});
