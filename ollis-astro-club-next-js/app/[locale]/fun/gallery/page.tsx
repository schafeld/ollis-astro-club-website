import { useTranslations } from 'next-intl';

export default function GalleryPage() {
  const t = useTranslations('fun');

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">{t('gallery')}</h1>
      <p className="font-body text-lg opacity-70">
        Die Galerie wird bald mit tollen Bildern gefüllt! 🖼️
      </p>
    </div>
  );
}
