<script setup lang="ts">
const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const colorMode = useColorMode();
const { t } = useI18n();

const currentLocale = computed<SupportedLocale>(() => {
  const value = route.params.locale;
  return typeof value === 'string' && supportedLocales.includes(value as SupportedLocale)
    ? (value as SupportedLocale)
    : 'de';
});

const navItems = computed(() => [
  { href: `/${currentLocale.value}`, label: t('nav.home') },
  { href: `/${currentLocale.value}/news`, label: t('nav.news') },
  { href: `/${currentLocale.value}/info`, label: t('nav.info') },
  { href: `/${currentLocale.value}/games`, label: t('nav.games') },
  { href: `/${currentLocale.value}/fun`, label: t('nav.fun') },
]);

function switchLocalePath(targetLocale: SupportedLocale) {
  const segments = route.path.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${targetLocale}`;
  }

  if (supportedLocales.includes(segments[0] as SupportedLocale)) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  return `/${segments.join('/')}`;
}

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}

const languageButtonLabel = computed(() => t('common.language'));
const themeButtonLabel = computed(() =>
  colorMode.value === 'dark' ? t('common.lightMode') : t('common.darkMode'),
);
</script>

<template>
  <header class="wobbly-md border-b-[3px] border-[var(--border-color)] bg-[var(--background)] px-4 py-3 shadow-[0_4px_0px_0px_var(--shadow-color)]">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <NuxtLink :to="`/${currentLocale}`" class="flex items-center gap-3 no-underline">
        <img
          src="/logo-astro-club-300x300.png"
          alt="Ollis Astro Club logo"
          width="48"
          height="48"
          class="rounded-full"
        />
        <span class="brand-name font-heading text-xl font-bold text-[var(--foreground)]">
          Ollis Astro Club
        </span>
      </NuxtLink>

      <div class="flex flex-col gap-3 md:items-end">
        <nav class="flex flex-wrap items-center gap-2" aria-label="Main navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            class="wobbly-sm px-3 py-1.5 font-body text-[var(--foreground)] no-underline transition-all hover:bg-[var(--muted)]"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 self-start md:self-auto">
          <NuxtLink
            :to="switchLocalePath(currentLocale === 'de' ? 'en' : 'de')"
            class="wobbly-sm border-2 border-[var(--border-color)] bg-[var(--background)] px-3 py-1.5 text-sm font-body text-[var(--foreground)] no-underline shadow-[var(--shadow-sketch)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-sketch-hover)]"
            :aria-label="languageButtonLabel"
            :title="languageButtonLabel"
          >
            {{ currentLocale === 'de' ? '🇬🇧 EN' : '🇩🇪 DE' }}
          </NuxtLink>
          <button
            type="button"
            class="wobbly-sm border-2 border-[var(--border-color)] bg-[var(--background)] px-3 py-1.5 text-sm font-body text-[var(--foreground)] shadow-[var(--shadow-sketch)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-sketch-hover)]"
            :aria-label="themeButtonLabel"
            :title="themeButtonLabel"
            @click="toggleTheme"
          >
            {{ colorMode.value === 'dark' ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>