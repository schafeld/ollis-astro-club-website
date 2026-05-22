import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function GamesPage() {
  const t = useTranslations('games');
  const locale = useLocale();

  const games = [
    { href: `/${locale}/games/asteroids`, emoji: '☄️', label: t('asteroids.title') },
    { href: `/${locale}/games/moon-buggy`, emoji: '🏎️', label: t('moonBuggy.title') },
    { href: `/${locale}/games/moon-lander`, emoji: '🚀', label: t('moonLander.title') },
    { href: `/${locale}/games/gluecksrad`, emoji: '🎡', label: t('wheelOfFortune.title') },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('title')}</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {games.map((game) => (
          <Link key={game.href} href={game.href} className="no-underline">
            <Card rotate className="flex flex-col items-center gap-2 text-center hover:bg-[var(--muted)]">
              <span className="text-4xl">{game.emoji}</span>
              <span className="font-heading text-lg font-bold">{game.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
