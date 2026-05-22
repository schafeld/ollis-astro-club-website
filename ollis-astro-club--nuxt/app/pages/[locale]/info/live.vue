<script setup lang="ts">
import { getApod, getVideoEmbedUrl } from '~~/lib/nasa/apod';

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

const { data: apod } = await useAsyncData(
  () => `apod-${routeLocale.value}`,
  () => getApod(),
  {
    watch: [routeLocale],
  },
);

const videoInfo = computed(() => {
  return apod.value && apod.value.media_type === 'video' ? getVideoEmbedUrl(apod.value.url) : null;
});

const sourceUrl = computed(() => {
  if (!apod.value) {
    return null;
  }

  return `https://apod.nasa.gov/apod/ap${apod.value.date.replace(/-/g, '').slice(2)}.html`;
});

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: t('info.live'),
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('info.live') }}</h1>

    <div
      v-if="apod"
      class="wobbly-md overflow-hidden border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
    >
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-4">
          <h2 class="font-heading text-2xl font-bold text-[var(--foreground)]">
            {{ t('info.apod.title') }}
          </h2>
          <span class="wobbly-sm inline-flex border-2 border-[var(--border-color)] bg-[var(--accent-blue)] px-3 py-1 font-body text-sm text-white">
            {{ t('info.apod.date') }}: {{ apod.date }}
          </span>
        </div>

        <h3 class="font-heading text-xl text-[var(--foreground)]">{{ apod.title }}</h3>

        <div v-if="apod.media_type === 'image'" class="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <img :src="apod.url" :alt="apod.title" class="h-full w-full object-contain" />
        </div>

        <div v-else-if="videoInfo" class="space-y-2">
          <span class="wobbly-sm inline-flex border-2 border-[var(--border-color)] bg-[var(--accent)] px-3 py-1 font-body text-sm text-white">
            {{ t('info.apod.videoNote') }}
          </span>

          <div v-if="videoInfo.type === 'youtube'" class="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              :src="videoInfo.embedUrl"
              :title="apod.title"
              class="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <div v-else-if="videoInfo.type === 'direct'" class="relative w-full overflow-hidden rounded-lg bg-neutral-900">
            <video :src="videoInfo.embedUrl" controls class="w-full" preload="metadata">
              Your browser does not support the video tag.
            </video>
          </div>

          <div v-else class="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--muted)] p-8">
            <div class="space-y-4 text-center">
              <p class="font-body text-sm text-[var(--foreground)] opacity-70">
                📹 {{ t('info.apod.externalVideo') }}
              </p>
              <a
                :href="videoInfo.embedUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="wobbly-pill inline-block border-[3px] border-[var(--border-color)] bg-[var(--background)] px-6 py-2.5 font-body text-lg text-[var(--foreground)] shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--accent)] hover:text-white hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                {{ t('info.apod.viewOnNasa') }}
              </a>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <p class="font-body text-sm leading-relaxed text-[var(--foreground)] apod-explanation">
            {{ apod.explanation }}
          </p>
          <p v-if="sourceUrl" class="font-body text-xs">
            <a
              :href="sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
            >
              → {{ t('info.apod.sourceLink') }}
            </a>
          </p>
          <p v-if="apod.copyright" class="font-body text-xs text-[var(--foreground)] opacity-60">
            {{ t('info.apod.copyright') }}: {{ apod.copyright }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
    >
      <p class="font-body text-center text-lg text-[var(--foreground)] opacity-70">
        {{ t('info.apod.error') }}
      </p>
    </div>
  </div>
</template>