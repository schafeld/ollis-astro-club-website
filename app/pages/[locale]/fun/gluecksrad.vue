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

useHead({ title: `🎡 ${t('fun.wheelOfFortune.title')}` });
</script>

<template>
  <FortuneWheel
    :title="t('fun.wheelOfFortune.title')"
    :spin-label="t('fun.wheelOfFortune.spin')"
    :max-sectors-label="t('fun.wheelOfFortune.maxSectors')"
  />
</template>