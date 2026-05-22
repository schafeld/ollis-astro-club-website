/**
 * Impressum (Legal Notice) singleton document schema.
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const impressum = defineType({
  name: 'impressum',
  title: 'Impressum',
  type: 'document',
  icon: () => '⚖️',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      description: 'Page title (e.g. "Impressum" / "Legal Notice")',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'localizedBlock',
      description: 'Full page content — use rich text to add contact details, legal info, etc.',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Impressum' };
    },
  },
});
