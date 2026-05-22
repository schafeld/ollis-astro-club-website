import { useTranslations } from 'next-intl';

export default function GluecksradPage() {
  const t = useTranslations('games');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">🎡 {t('wheelOfFortune.title')}</h1>
      <p className="font-body text-lg opacity-70">
        Das Glücksrad wird bald hierher umgezogen! ✨
      </p>
    </div>
  );
}
