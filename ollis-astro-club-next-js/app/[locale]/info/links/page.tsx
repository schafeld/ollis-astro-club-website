import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { sanityFetch } from '@/lib/sanity/client';
import { LINKS_QUERY } from '@/lib/sanity/queries';
import { isSanityConfigured } from '@/lib/sanity/env';

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  emoji: string | null;
}

const categoryLabels: Record<string, { de: string; en: string }> = {
  website: { de: 'Website', en: 'Website' },
  app: { de: 'App', en: 'App' },
  youtube: { de: 'YouTube', en: 'YouTube' },
  book: { de: 'Buch / Artikel', en: 'Book / Article' },
  tool: { de: 'Tool', en: 'Tool' },
  learning: { de: 'Lernen', en: 'Learning' },
};

export default async function LinksPage() {
  const t = await getTranslations('info');
  const locale = await getLocale();

  let links: LinkItem[] = [];

  if (isSanityConfigured) {
    links = (await sanityFetch({
      query: LINKS_QUERY,
      params: { locale },
      tags: ['link'],
    })) ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('links')}</h1>

      {links.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Card rotate className="flex flex-col gap-2 hover:bg-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{link.emoji ?? '🔗'}</span>
                  <h2 className="font-heading text-lg font-bold">{link.title}</h2>
                </div>
                {link.description && (
                  <p className="font-body text-sm opacity-70">{link.description}</p>
                )}
                {link.category && (
                  <Badge variant="blue">
                    {categoryLabels[link.category]?.[locale as 'de' | 'en'] ?? link.category}
                  </Badge>
                )}
              </Card>
            </a>
          ))}
        </div>
      ) : (
        <Card>
          <p className="font-body text-lg opacity-70">
            {locale === 'de'
              ? 'Links & Tipps werden bald hier erscheinen! 🔭'
              : 'Links & Tips coming soon! 🔭'}
          </p>
        </Card>
      )}
    </div>
  );
}
