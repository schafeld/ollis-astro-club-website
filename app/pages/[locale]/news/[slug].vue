<script setup lang="ts">
import PortableTextRenderer from '~~/app/components/sanity/PortableTextRenderer.vue';
import { sanityFetch } from '~~/lib/sanity/client';
import { urlFor } from '~~/lib/sanity/image';
import { NEWS_POST_QUERY } from '~~/lib/sanity/queries';

interface SanityImage {
  asset?: { _ref: string };
}

interface PortableTextBlock {
  _key?: string;
  _type: string;
}

interface NewsPost {
  _id: string;
  title: string | null;
  slug: { current: string };
  publishedAt: string | null;
  excerpt: string | null;
  body: PortableTextBlock[] | null;
  image?: SanityImage;
  author: string | null;
}

const supportedLocales = ['de', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const route = useRoute();
const routeLocale = computed(() =>
  typeof route.params.locale === 'string' ? route.params.locale : '',
);
const routeSlug = computed(() => (typeof route.params.slug === 'string' ? route.params.slug : ''));

if (!supportedLocales.includes(routeLocale.value as SupportedLocale) || !routeSlug.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

const { t, locale } = useI18n();
locale.value = routeLocale.value;

const { data: post } = await useAsyncData(
  () => `news-post-${routeLocale.value}-${routeSlug.value}`,
  () =>
    sanityFetch<NewsPost>({
      query: NEWS_POST_QUERY,
      params: { locale: routeLocale.value, slug: routeSlug.value },
    }),
  {
    watch: [routeLocale, routeSlug],
  },
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(routeLocale.value === 'de' ? 'de-DE' : 'en-US');
}

const imageUrl = computed(() =>
  post.value?.image ? urlFor(post.value.image)?.width(800).height(450).url() ?? null : null,
);

useHead({
  htmlAttrs: {
    lang: routeLocale.value,
  },
  title: post.value.title ?? t('nav.news'),
});
</script>

<template>
  <article class="space-y-6">
    <NuxtLink
      :to="`/${routeLocale}/news`"
      class="font-body text-[var(--accent-blue)] hover:underline"
    >
      ← {{ t('common.backHome') }}
    </NuxtLink>

    <div class="wobbly-md border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
      <img
        v-if="imageUrl"
        :src="imageUrl || undefined"
        :alt="post?.title || ''"
        width="800"
        height="450"
        class="wobbly mb-4 w-full object-cover"
      />

      <h1 class="font-heading text-3xl font-bold text-[var(--foreground)]">{{ post?.title }}</h1>

      <p v-if="post?.excerpt" class="mt-3 font-body text-base text-[var(--foreground)] opacity-80">
        {{ post.excerpt }}
      </p>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span
          v-if="post?.publishedAt"
          class="wobbly-sm inline-flex border-2 border-[var(--border-color)] bg-[var(--accent-blue)] px-3 py-1 font-body text-sm text-white"
        >
          {{ formatDate(post.publishedAt) }}
        </span>
        <span
          v-if="post?.author"
          class="wobbly-sm inline-flex border-2 border-[var(--border-color)] bg-[var(--muted)] px-3 py-1 font-body text-sm text-[var(--foreground)]"
        >
          {{ post.author }}
        </span>
      </div>

      <PortableTextRenderer
        v-if="post?.body"
        :value="post.body"
        class-name="mt-6"
      />
    </div>
  </article>
</template>