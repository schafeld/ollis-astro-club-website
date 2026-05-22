import { useTranslations } from 'next-intl';

export default function AsteroidsPage() {
  const t = useTranslations('games');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">☄️ {t('asteroids.title')}</h1>
      <p className="font-body text-lg opacity-70">Asteroids kommt bald! 🎮</p>
    </div>
  );
}
