/**
 * News Post document schema.
 * Copy this file into your Sanity Studio project's schemas/ folder.
 */
import { defineType } from 'sanity';

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News Post',
  type: 'document',
  icon: () => '📰',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localizedString',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.de', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly identifier (click Generate)',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Olli',
    },
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localizedString',
      description: 'Short summary shown in the news list',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'localizedBlock',
      description: 'Full article content (rich text)',
    },
  ],
  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.de',
      subtitle: 'publishedAt',
      media: 'image',
    },
  },
});
