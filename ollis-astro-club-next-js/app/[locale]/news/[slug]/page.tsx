import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/lib/sanity/client';
import { NEWS_POST_QUERY } from '@/lib/sanity/queries';
import { isSanityConfigured } from '@/lib/sanity/env';
import { urlFor } from '@/lib/sanity/image';
import { PortableTextRenderer } from '@/components/sanity/PortableTextRenderer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'next-sanity';

interface NewsPostData {
  _id: string;
  title: string | null;
  slug: { current: string };
  publishedAt: string | null;
  excerpt: string | null;
  body: PortableTextBlock[] | null;
  image?: { asset: { _ref: string } };
  author: string | null;
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('common');

  if (!isSanityConfigured) {
    notFound();
  }

  const post = await sanityFetch({
    query: NEWS_POST_QUERY,
    params: { locale, slug },
    tags: ['newsPost'],
  }) as NewsPostData | null;

  if (!post) {
    notFound();
  }

  const imageUrl = post.image ? urlFor(post.image)?.width(800).height(450).url() : null;

  return (
    <article className="space-y-6">
      <Link
        href={`/${locale}/news`}
        className="font-body text-[var(--accent-blue)] hover:underline"
      >
        ← {t('backHome')}
      </Link>

      <Card>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.title ?? ''}
            width={800}
            height={450}
            className="wobbly mb-4 w-full object-cover"
          />
        )}

        <h1 className="font-heading text-3xl font-bold">{post.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {post.publishedAt && (
            <Badge variant="blue">
              {new Date(post.publishedAt).toLocaleDateString(
                locale === 'de' ? 'de-DE' : 'en-US'
              )}
            </Badge>
          )}
          {post.author && <Badge>{post.author}</Badge>}
        </div>

        {post.body && (
          <PortableTextRenderer value={post.body} className="mt-6" />
        )}
      </Card>
    </article>
  );
}
