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

useHead({ title: t('fun.gallery') });
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('fun.gallery') }}</h1>
    <p class="font-body text-lg text-[var(--foreground)] opacity-70">
      {{ routeLocale === 'de' ? 'Die Galerie wird bald mit tollen Bildern gefuellt! 🖼️' : 'The gallery will soon be filled with great images! 🖼️' }}
    </p>
  </div>
</template>