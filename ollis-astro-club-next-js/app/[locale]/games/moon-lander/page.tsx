import { useTranslations } from 'next-intl';

export default function MoonLanderPage() {
  const t = useTranslations('games');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">🚀 {t('moonLander.title')}</h1>
      <p className="font-body text-lg opacity-70">Moon Lander kommt bald! 🎮</p>
    </div>
  );
}
