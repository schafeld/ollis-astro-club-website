<script setup lang="ts">
import { sanityFetch } from '~~/lib/sanity/client';
import { LINKS_QUERY } from '~~/lib/sanity/queries';

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  emoji: string | null;
}

const categoryLabels: Record<string, { de: string; en: string }> = {
  website: { de: 'Website', en: 'Website' },
  app: { de: 'App', en: 'App' },
  youtube: { de: 'YouTube', en: 'YouTube' },
  book: { de: 'Buch / Artikel', en: 'Book / Article' },
  tool: { de: 'Tool', en: 'Tool' },
  learning: { de: 'Lernen', en: 'Learning' },
};

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

const { data: links } = await useAsyncData(
  () => `links-${routeLocale.value}`,
  () =>
    sanityFetch<LinkItem[]>({
      query: LINKS_QUERY,
      params: { locale: routeLocale.value },
    }).then((result) => result ?? []),
  {
    watch: [routeLocale],
  },
);

function getCategoryLabel(category: string) {
  return categoryLabels[category]?.[routeLocale.value as 'de' | 'en'] ?? category;
}

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: t('info.links'),
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('info.links') }}</h1>

    <div v-if="links && links.length > 0" class="grid gap-4 md:grid-cols-2">
      <a
        v-for="link in links"
        :key="link._id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="wobbly-md flex flex-col gap-2 border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 no-underline shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--muted)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      >
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ link.emoji ?? '🔗' }}</span>
          <h2 class="font-heading text-lg font-bold text-[var(--foreground)]">{{ link.title }}</h2>
        </div>
        <p v-if="link.description" class="font-body text-sm text-[var(--foreground)] opacity-70">
          {{ link.description }}
        </p>
        <span
          v-if="link.category"
          class="wobbly-sm inline-flex w-fit border-2 border-[var(--border-color)] bg-[var(--accent-blue)] px-3 py-1 font-body text-sm text-white"
        >
          {{ getCategoryLabel(link.category) }}
        </span>
      </a>
    </div>

    <div
      v-else
      class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
    >
      <p class="font-body text-lg text-[var(--foreground)] opacity-70">
        {{ routeLocale === 'de' ? 'Links & Tipps werden bald hier erscheinen! 🔭' : 'Links & Tips coming soon! 🔭' }}
      </p>
    </div>
  </div>
</template>