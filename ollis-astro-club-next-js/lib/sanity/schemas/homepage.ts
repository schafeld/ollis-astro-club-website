/**
 * Homepage singleton document schema.
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: () => '🏠',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
      description: 'Main heading on the homepage (e.g. "Olli\'s Astro Club")',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'localizedString',
      description: 'Subtitle under the title (e.g. "Tipps für Sternenfreunde")',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localizedString',
      description: 'Short description paragraph below the subtitle',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' };
    },
  },
});
