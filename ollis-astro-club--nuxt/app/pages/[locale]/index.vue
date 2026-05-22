<script setup lang="ts">
import { HOMEPAGE_QUERY } from '~~/lib/sanity/queries';
import { sanityFetch } from '~~/lib/sanity/client';

interface HomePageContent {
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const routeLocale = computed(() => {
  return typeof route.params.locale === 'string' ? route.params.locale : '';
});

if (!supportedLocales.includes(routeLocale.value as SupportedLocale)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const { t, locale } = useI18n();
locale.value = routeLocale.value;

const { data } = await useAsyncData(
  () => `homepage-${routeLocale.value}`,
  () =>
    sanityFetch<HomePageContent>({
      query: HOMEPAGE_QUERY,
      params: { locale: routeLocale.value },
    }),
  {
    watch: [routeLocale],
  },
);

const title = computed(() => data.value?.title ?? t('home.title'));
const subtitle = computed(() => data.value?.subtitle ?? t('home.subtitle'));
const description = computed(() => data.value?.description ?? t('home.description'));

const sections = computed(() => [
  { href: `/${routeLocale.value}/news`, emoji: '📰', label: t('nav.news') },
  { href: `/${routeLocale.value}/info`, emoji: '🔭', label: t('nav.info') },
  { href: `/${routeLocale.value}/games`, emoji: '🎮', label: t('nav.games') },
  { href: `/${routeLocale.value}/fun`, emoji: '🎨', label: t('nav.fun') },
]);

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: title,
});
</script>

<template>
  <div class="space-y-10">
    <section class="flex flex-col items-center gap-4 text-center">
      <img
        src="/logo-astro-club-300x300.png"
        alt="Astro Club Logo"
        width="120"
        height="120"
        class="rounded-full"
      />
      <h1 class="font-heading text-4xl font-bold text-[var(--foreground)] md:text-5xl">
        {{ title }}
      </h1>
      <p class="font-heading text-xl text-[var(--accent)]">{{ subtitle }}</p>
      <p class="max-w-lg font-body text-lg text-[var(--foreground)] opacity-80">
        {{ description }}
      </p>
    </section>

    <section class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <NuxtLink
        v-for="section in sections"
        :key="section.href"
        :to="section.href"
        class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 text-center no-underline shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      >
        <div class="flex flex-col items-center gap-2">
          <span class="text-4xl">{{ section.emoji }}</span>
          <span class="font-heading text-lg font-bold text-[var(--foreground)]">
            {{ section.label }}
          </span>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>