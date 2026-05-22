<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();

const year = new Date().getFullYear();
const currentLocale = computed(() => (typeof route.params.locale === 'string' ? route.params.locale : 'de'));
</script>

<template>
  <footer class="mt-12 border-t-[3px] border-dashed border-[var(--border-color)] px-4 py-6 text-center font-body text-sm text-[var(--foreground)] opacity-80">
    <p>{{ t('footer.copyright', { year }) }}</p>
    <p class="mt-1">
      {{ t('footer.madeBy') }} ·
      <a
        href="https://github.com/schafeld/ollis-astro-club-website"
        target="_blank"
        rel="noreferrer"
        class="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
      >
        {{ t('footer.openSource') }}
      </a>
      ·
      <NuxtLink
        :to="`/${currentLocale}/impressum`"
        class="text-[var(--accent-blue)] underline hover:text-[var(--accent)]"
      >
        {{ t('footer.impressum') }}
      </NuxtLink>
    </p>
  </footer>
</template>