'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('common');

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="wobbly-sm border-2 border-[var(--border-color)] bg-[var(--background)] px-3 py-1.5 text-sm font-body text-[var(--foreground)] shadow-[var(--shadow-sketch)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-sketch-hover)]"
      aria-label={isDark ? t('lightMode') : t('darkMode')}
      title={isDark ? t('lightMode') : t('darkMode')}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
