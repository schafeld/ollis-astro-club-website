'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/info`, label: t('info') },
    { href: `/${locale}/games`, label: t('games') },
    { href: `/${locale}/fun`, label: t('fun') },
  ];

  return (
    <header className="wobbly-md border-b-[3px] border-[var(--border-color)] bg-[var(--background)] px-4 py-3 shadow-[0_4px_0px_0px_var(--shadow-color)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Logo + Title */}
        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline">
          <Image
            src="/logo-astro-club-300x300.png"
            alt="Ollis Astro Club logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="brand-name font-heading text-xl font-bold text-[var(--foreground)]">
            Ollis Astro Club
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="wobbly-sm px-3 py-1.5 font-body text-[var(--foreground)] no-underline transition-all hover:bg-[var(--muted)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-[var(--foreground)] transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--foreground)] transition-opacity ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[var(--foreground)] transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-1 border-t-2 border-dashed border-[var(--border-color)] pt-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="wobbly-sm px-3 py-2 font-body text-[var(--foreground)] no-underline transition-all hover:bg-[var(--muted)]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-2 px-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
