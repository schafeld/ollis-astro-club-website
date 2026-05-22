<script setup lang="ts">
import FortuneWheel from '~~/app/components/FortuneWheel.vue';

const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const routeLocale = computed(() => typeof route.params.locale === 'string' ? route.params.locale : '');

if (!supportedLocales.includes(routeLocale.value as SupportedLocale)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const { t, locale } = useI18n();
locale.value = routeLocale.value;

useHead({ title: `🎡 ${t('games.wheelOfFortune.title')}` });
</script>

<template>
  <FortuneWheel
    :title="t('games.wheelOfFortune.title')"
    :spin-label="routeLocale === 'de' ? 'Drehen!' : 'Spin!'"
    :max-sectors-label="routeLocale === 'de' ? 'Anzahl der Felder (2-20)' : 'Number of sectors (2-20)'"
  />
</template>