import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function InfoPage() {
  const t = useTranslations('info');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('title')}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href={`/${locale}/info/links`} className="no-underline">
          <Card rotate>
            <span className="text-3xl">🔗</span>
            <h2 className="font-heading text-xl font-bold">{t('links')}</h2>
          </Card>
        </Link>
        <Link href={`/${locale}/info/live`} className="no-underline">
          <Card rotate>
            <span className="text-3xl">📡</span>
            <h2 className="font-heading text-xl font-bold">{t('live')}</h2>
          </Card>
        </Link>
      </div>
    </div>
  );
}
