'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  function switchLocale() {
    const newLocale = locale === 'de' ? 'en' : 'de';
    // Replace the locale segment in the path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <button
      onClick={switchLocale}
      className="wobbly-sm border-2 border-[var(--border-color)] bg-[var(--background)] px-3 py-1.5 text-sm font-body text-[var(--foreground)] shadow-[var(--shadow-sketch)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-sketch-hover)]"
      aria-label={t('language')}
      title={t('language')}
    >
      {locale === 'de' ? '🇬🇧 EN' : '🇩🇪 DE'}
    </button>
  );
}
