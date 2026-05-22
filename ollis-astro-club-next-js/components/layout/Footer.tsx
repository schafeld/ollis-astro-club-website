import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t-[3px] border-dashed border-[var(--border-color)] px-4 py-6 text-center font-body text-sm text-[var(--foreground)] opacity-80">
      <p>
        {t('copyright', { year })}
      </p>
      <p className="mt-1">
        {t('madeBy')} ·{' '}
        <a
          href="https://github.com/schafeld/ollis-astro-club--next-js"
          target="_blank"
          rel="noreferrer"
          className="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
        >
          {t('openSource')}
        </a>
        {' · '}
        <Link
          href={`/${locale}/impressum`}
          className="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
        >
          {t('impressum')}
        </Link>
      </p>
    </footer>
  );
}
