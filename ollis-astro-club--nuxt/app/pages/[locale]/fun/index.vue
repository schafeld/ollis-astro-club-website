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

const sections = computed(() => [
  { href: `/${routeLocale.value}/fun/gallery`, emoji: '🖼️', label: t('fun.gallery') },
  { href: `/${routeLocale.value}/fun/videos`, emoji: '🎬', label: t('fun.videos') },
  { href: `/${routeLocale.value}/fun/gluecksrad`, emoji: '🎡', label: t('fun.wheelOfFortune.title') },
]);

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: t('fun.title'),
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('fun.title') }}</h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <NuxtLink
        v-for="section in sections"
        :key="section.href"
        :to="section.href"
        class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 no-underline shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      >
        <div class="flex flex-col gap-2">
          <span class="text-3xl">{{ section.emoji }}</span>
          <h2 class="font-heading text-xl font-bold text-[var(--foreground)]">{{ section.label }}</h2>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>