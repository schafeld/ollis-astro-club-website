<script setup lang="ts">
import PortableTextRenderer from '~~/app/components/sanity/PortableTextRenderer.vue';
import { sanityFetch } from '~~/lib/sanity/client';
import { IMPRESSUM_QUERY } from '~~/lib/sanity/queries';

interface PortableTextBlock {
  _key?: string;
  _type: string;
}

interface ImpressumData {
  title: string | null;
  body: PortableTextBlock[] | null;
}

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

const { data } = await useAsyncData(
  () => `impressum-${routeLocale.value}`,
  () =>
    sanityFetch<ImpressumData>({
      query: IMPRESSUM_QUERY,
      params: { locale: routeLocale.value },
    }),
  {
    watch: [routeLocale],
  },
);

const title = computed(() => data.value?.title ?? t('impressum.title'));
const body = computed(() => data.value?.body ?? null);

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title,
});
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)] md:text-4xl">
      {{ title }}
    </h1>

    <div class="mt-6">
      <PortableTextRenderer v-if="body" :value="body" />
      <p v-else class="font-body text-[var(--foreground)] opacity-80">
        {{ t('impressum.fallback') }}
      </p>
    </div>
  </div>
</template>