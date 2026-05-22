import { useTranslations } from 'next-intl';

export default function MoonBuggyPage() {
  const t = useTranslations('games');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">🏎️ {t('moonBuggy.title')}</h1>
      <p className="font-body text-lg opacity-70">Moon Buggy kommt bald! 🎮</p>
    </div>
  );
}
