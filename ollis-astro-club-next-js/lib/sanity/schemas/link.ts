/**
 * Link document schema for the Info > Links & Tips page.
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'document',
  icon: () => '🔗',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localizedString',
      description: 'Short description of what this link is about',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: '🌐 Website', value: 'website' },
          { title: '📱 App', value: 'app' },
          { title: '🎬 YouTube', value: 'youtube' },
          { title: '📚 Book / Article', value: 'book' },
          { title: '🛠️ Tool', value: 'tool' },
          { title: '🎓 Learning', value: 'learning' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'website',
    },
    {
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'An emoji shown next to the link (e.g. 🌍, 🔭, 🚀)',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
      description: 'Lower numbers appear first',
    },
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.de',
      subtitle: 'url',
      emoji: 'emoji',
    },
    prepare({ title, subtitle, emoji }) {
      return {
        title: `${emoji ?? '🔗'} ${title}`,
        subtitle,
      };
    },
  },
});
