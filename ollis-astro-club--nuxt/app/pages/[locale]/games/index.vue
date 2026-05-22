<script setup lang="ts">
const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const routeLocale = computed(() =>
  typeof route.params.locale === 'string' ? route.params.locale : '',
);

if (!supportedLocales.includes(routeLocale.value as SupportedLocale)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const { t, locale } = useI18n();
locale.value = routeLocale.value;

const games = computed(() => [
  { href: `/${routeLocale.value}/games/asteroids`, emoji: '☄️', label: t('games.asteroids.title') },
  { href: `/${routeLocale.value}/games/moon-buggy`, emoji: '🏎️', label: t('games.moonBuggy.title') },
  { href: `/${routeLocale.value}/games/moon-lander`, emoji: '🚀', label: t('games.moonLander.title') },
  { href: `/${routeLocale.value}/games/gluecksrad`, emoji: '🎡', label: t('games.wheelOfFortune.title') },
]);

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: t('games.title'),
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('games.title') }}</h1>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <NuxtLink
        v-for="game in games"
        :key="game.href"
        :to="game.href"
        class="wobbly-md flex flex-col items-center gap-2 border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 text-center no-underline shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--muted)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      >
        <span class="text-4xl">{{ game.emoji }}</span>
        <span class="font-heading text-lg font-bold text-[var(--foreground)]">{{ game.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>