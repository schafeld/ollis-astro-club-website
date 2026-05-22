import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">🔒 {t('title')}</h1>
      <p className="font-body text-lg opacity-70">
        Der Benutzerbereich wird bald verfügbar sein!
      </p>
    </div>
  );
}
