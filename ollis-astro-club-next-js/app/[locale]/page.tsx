import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { HOMEPAGE_QUERY } from '@/lib/sanity/queries';
import { isSanityConfigured } from '@/lib/sanity/env';

export default async function HomePage() {
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');
  const locale = await getLocale();

  // Fetch CMS content with fallback to i18n messages
  let title = t('title');
  let subtitle = t('subtitle');
  let description = t('description');

  if (isSanityConfigured) {
    const data = await sanityFetch({
      query: HOMEPAGE_QUERY,
      params: { locale },
      tags: ['homepage'],
    }) as { title: string | null; subtitle: string | null; description: string | null } | null;
    if (data) {
      title = data.title ?? title;
      subtitle = data.subtitle ?? subtitle;
      description = data.description ?? description;
    }
  }

  const sections = [
    { href: `/${locale}/news`, emoji: '📰', label: tNav('news') },
    { href: `/${locale}/info`, emoji: '🔭', label: tNav('info') },
    { href: `/${locale}/games`, emoji: '🎮', label: tNav('games') },
    { href: `/${locale}/fun`, emoji: '🎨', label: tNav('fun') },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/logo-astro-club-300x300.png"
          alt="Astro Club Logo"
          width={120}
          height={120}
          className="rounded-full"
          priority
        />
        <h1 className="font-heading text-4xl font-bold text-[var(--foreground)] md:text-5xl">
          {title}
        </h1>
        <p className="font-heading text-xl text-[var(--accent)]">{subtitle}</p>
        <p className="max-w-lg font-body text-lg text-[var(--foreground)] opacity-80">
          {description}
        </p>
      </section>

      {/* Section Quick Links */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="no-underline">
            <Card rotate className="flex flex-col items-center gap-2 text-center hover:bg-[var(--muted)]">
              <span className="text-4xl">{section.emoji}</span>
              <span className="font-heading text-lg font-bold">{section.label}</span>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
