import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client';
import { NEWS_LIST_QUERY } from '@/lib/sanity/queries';
import { isSanityConfigured } from '@/lib/sanity/env';
import { urlFor } from '@/lib/sanity/image';
import Link from 'next/link';
import Image from 'next/image';

interface NewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string | null;
  image?: { asset: { _ref: string } };
}

export default async function NewsPage() {
  const t = await getTranslations('nav');
  const locale = await getLocale();

  let posts: NewsPost[] = [];

  if (isSanityConfigured) {
    posts = (await sanityFetch({
      query: NEWS_LIST_QUERY,
      params: { locale },
      tags: ['newsPost'],
    })) ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('news')}</h1>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => {
            const imageUrl = post.image ? urlFor(post.image)?.width(600).height(340).url() : null;
            return (
              <Link
                key={post._id}
                href={`/${locale}/news/${post.slug.current}`}
                className="no-underline"
              >
                <Card rotate className="flex flex-col gap-3 hover:bg-[var(--muted)]">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={post.title ?? ''}
                      width={600}
                      height={340}
                      className="wobbly w-full object-cover"
                    />
                  )}
                  <h2 className="font-heading text-xl font-bold">{post.title}</h2>
                  {post.publishedAt && (
                    <Badge variant="blue">
                      {new Date(post.publishedAt).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')}
                    </Badge>
                  )}
                  {post.excerpt && (
                    <p className="font-body text-sm opacity-70">{post.excerpt}</p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="font-body text-lg opacity-70">
            {locale === 'de'
              ? 'Hier erscheinen bald Neuigkeiten vom Astro Club! 🚀'
              : 'News from the Astro Club coming soon! 🚀'}
          </p>
        </Card>
      )}
    </div>
  );
}
