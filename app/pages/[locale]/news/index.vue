<script setup lang="ts">
import { NEWS_LIST_QUERY } from '~~/lib/sanity/queries';
import { sanityFetch } from '~~/lib/sanity/client';
import { urlFor } from '~~/lib/sanity/image';

interface SanityImage {
  asset?: { _ref: string };
}

interface NewsPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string | null;
  image?: SanityImage;
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

const { data: posts } = await useAsyncData(
  () => `news-${routeLocale.value}`,
  () =>
    sanityFetch<NewsPost[]>({
      query: NEWS_LIST_QUERY,
      params: { locale: routeLocale.value },
    }).then((result) => result ?? []),
  {
    watch: [routeLocale],
  },
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(routeLocale.value === 'de' ? 'de-DE' : 'en-US');
}

function getImageUrl(image?: SanityImage) {
  return image ? urlFor(image)?.width(600).height(340).url() ?? null : null;
}

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: t('nav.news'),
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ t('nav.news') }}</h1>

    <div v-if="posts && posts.length > 0" class="grid gap-6 md:grid-cols-2">
      <NuxtLink
        v-for="post in posts"
        :key="post._id"
        :to="`/${routeLocale}/news/${post.slug.current}`"
        class="wobbly-md flex flex-col gap-3 border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 no-underline shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--muted)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      >
        <img
          v-if="getImageUrl(post.image)"
          :src="getImageUrl(post.image) || undefined"
          :alt="post.title || ''"
          width="600"
          height="340"
          class="wobbly w-full object-cover"
        />
        <h2 class="font-heading text-xl font-bold text-[var(--foreground)]">{{ post.title }}</h2>
        <span
          v-if="post.publishedAt"
          class="wobbly-sm inline-flex w-fit border-2 border-[var(--border-color)] bg-[var(--accent-blue)] px-3 py-1 font-body text-sm text-white"
        >
          {{ formatDate(post.publishedAt) }}
        </span>
        <p v-if="post.excerpt" class="font-body text-sm text-[var(--foreground)] opacity-70">
          {{ post.excerpt }}
        </p>
      </NuxtLink>
    </div>

    <div
      v-else
      class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
    >
      <p class="font-body text-lg text-[var(--foreground)] opacity-70">
        {{
          routeLocale === 'de'
            ? 'Hier erscheinen bald Neuigkeiten vom Astro Club! 🚀'
            : 'News from the Astro Club coming soon! 🚀'
        }}
      </p>
    </div>
  </div>
</template>