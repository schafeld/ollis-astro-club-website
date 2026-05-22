import { getTranslations, getLocale } from 'next-intl/server';
import { sanityFetch } from '@/lib/sanity/client';
import { IMPRESSUM_QUERY } from '@/lib/sanity/queries';
import { isSanityConfigured } from '@/lib/sanity/env';
import { PortableTextRenderer } from '@/components/sanity/PortableTextRenderer';
import type { PortableTextBlock } from 'next-sanity';

export default async function ImpressumPage() {
  const t = await getTranslations('impressum');
  const locale = await getLocale();

  let title = t('title');
  let body: PortableTextBlock[] | null = null;

  if (isSanityConfigured) {
    const data = await sanityFetch({
      query: IMPRESSUM_QUERY,
      params: { locale },
      tags: ['impressum'],
    }) as { title: string | null; body: PortableTextBlock[] | null } | null;

    if (data) {
      title = data.title ?? title;
      body = data.body ?? null;
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-[var(--foreground)] md:text-4xl">
        {title}
      </h1>

      <div className="mt-6">
        {body ? (
          <PortableTextRenderer value={body} />
        ) : (
          <p className="font-body text-[var(--foreground)] opacity-80">
            {t('fallback')}
          </p>
        )}
      </div>
    </div>
  );
}
