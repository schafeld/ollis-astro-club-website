<script setup lang="ts">
import { PortableText } from '@portabletext/vue';

interface PortableTextBlock {
  _key?: string;
  _type: string;
  children?: Array<{ _key?: string; _type?: string; text?: string }>;
  markDefs?: unknown[];
  style?: string;
}

const props = withDefaults(
  defineProps<{
    value: PortableTextBlock[];
    className?: string;
  }>(),
  {
    className: '',
  },
);

const components = {
  block: {
    h1: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('h1', { class: 'font-heading text-3xl font-bold' }, slots.default?.()),
    h2: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('h2', { class: 'font-heading text-2xl font-bold' }, slots.default?.()),
    h3: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('h3', { class: 'font-heading text-xl font-bold' }, slots.default?.()),
    normal: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('p', { class: 'font-body leading-7' }, slots.default?.()),
    blockquote: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h(
        'blockquote',
        {
          class:
            'wobbly-sm border-l-4 border-[var(--accent-blue)] bg-[var(--muted)] px-4 py-3 italic',
        },
        slots.default?.(),
      ),
  },
  list: {
    bullet: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('ul', { class: 'list-disc space-y-2 pl-6' }, slots.default?.()),
    number: (_props: unknown, { slots }: { slots: { default?: () => unknown } }) =>
      h('ol', { class: 'list-decimal space-y-2 pl-6' }, slots.default?.()),
  },
  marks: {
    link: (
      props: { value?: { href?: string } },
      { slots }: { slots: { default?: () => unknown } },
    ) =>
      h(
        'a',
        {
          href: props.value?.href,
          class: 'text-[var(--accent-blue)] underline hover:text-[var(--accent)]',
          rel: 'noreferrer noopener',
          target: '_blank',
        },
        slots.default?.(),
      ),
  },
};
</script>

<template>
  <div v-if="value?.length" :class="['portable-text font-body space-y-4', className]">
    <PortableText :value="value" :components="components" />
  </div>
</template>