import { useTranslations } from 'next-intl';

export default function VideosPage() {
  const t = useTranslations('fun');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('videos')}</h1>
      <p className="font-body text-lg opacity-70">Videos kommen bald! 🎬</p>
    </div>
  );
}
