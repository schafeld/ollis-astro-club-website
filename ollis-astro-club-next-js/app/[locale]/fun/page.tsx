import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function FunPage() {
  const t = useTranslations('fun');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('title')}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link href={`/${locale}/fun/gallery`} className="no-underline">
          <Card rotate>
            <span className="text-3xl">🖼️</span>
            <h2 className="font-heading text-xl font-bold">{t('gallery')}</h2>
          </Card>
        </Link>
        <Link href={`/${locale}/fun/videos`} className="no-underline">
          <Card rotate>
            <span className="text-3xl">🎬</span>
            <h2 className="font-heading text-xl font-bold">{t('videos')}</h2>
          </Card>
        </Link>
        <Link href={`/${locale}/fun/gluecksrad`} className="no-underline">
          <Card rotate>
            <span className="text-3xl">🎡</span>
            <h2 className="font-heading text-xl font-bold">{t('wheelOfFortune.title')}</h2>
          </Card>
        </Link>
      </div>
    </div>
  );
}
