<script setup lang="ts">
const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const routeLocale = computed(() => typeof route.params.locale === 'string' ? route.params.locale : '');

if (!supportedLocales.includes(routeLocale.value as SupportedLocale)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const { t, locale } = useI18n();
locale.value = routeLocale.value;

useHead({ title: `🚀 ${t('games.moonLander.title')}` });
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">🚀 {{ t('games.moonLander.title') }}</h1>
    <p class="font-body text-lg text-[var(--foreground)] opacity-70">
      {{ routeLocale === 'de' ? 'Moon Lander kommt bald! 🎮' : 'Moon Lander is coming soon! 🎮' }}
    </p>
  </div>
</template>